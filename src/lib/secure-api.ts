import { z } from 'zod'

import { env } from './env'
import { ApiError, NetworkError, createApiError } from './error-handling'
import { sanitizeString } from './validation'

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < config.windowMs)
    
    if (validRequests.length >= config.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }

  reset(key: string) {
    this.requests.delete(key)
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter()

// Request configuration
interface SecureRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  rateLimit?: RateLimitConfig
  validateResponse?: z.ZodSchema
  sanitizeRequest?: boolean
}

// Default rate limit configuration
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
}

class SecureApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseUrl: string = env.VITE_SUPABASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Client-Info': 'sayari-blog-secure@1.0.0',
    }
    this.timeout = 30000 // 30 seconds default timeout
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  // Secure request method
  async request<T = any>(
    endpoint: string,
    config: SecureRequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = 3,
      rateLimit = DEFAULT_RATE_LIMIT,
      validateResponse,
      sanitizeRequest = true,
    } = config

    // Rate limiting check
    const rateLimitKey = `${method}:${endpoint}`
    if (!rateLimiter.isAllowed(rateLimitKey, rateLimit)) {
      throw new ApiError('Rate limit exceeded. Please try again later.', 429)
    }

    // Sanitize endpoint
    const sanitizedEndpoint = sanitizeRequest 
      ? sanitizeString(endpoint)
      : endpoint

    // Build URL
    const url = `${this.baseUrl}${sanitizedEndpoint.startsWith('/') ? '' : '/'}${sanitizedEndpoint}`

    // Validate URL
    try {
      new URL(url)
    } catch {
      throw new ApiError('Invalid request URL', 400)
    }

    // Prepare headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    // Prepare body
    let requestBody: string | undefined
    if (body && method !== 'GET') {
      if (sanitizeRequest && typeof body === 'object') {
        // Sanitize string values in the body
        requestBody = JSON.stringify(this.sanitizeObject(body))
      } else {
        requestBody = typeof body === 'string' ? body : JSON.stringify(body)
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    let lastError: Error

    // Retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: requestBody,
          signal: controller.signal,
          credentials: 'omit', // Don't send cookies for security
          mode: 'cors',
          cache: 'no-store', // Don't cache sensitive requests
        })

        clearTimeout(timeoutId)

        // Handle non-2xx responses
        if (!response.ok) {
          const apiError = await createApiError(response)
          throw apiError
        }

        // Parse response
        let data: any
        const contentType = response.headers.get('content-type')
        
        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else {
          data = await response.text()
        }

        // Validate response if schema provided
        if (validateResponse) {
          try {
            data = validateResponse.parse(data)
          } catch (error) {
            throw new ApiError('Invalid response format', 422)
          }
        }

        return data

      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (
          error instanceof ApiError && 
          (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404)
        ) {
          break
        }

        // Don't retry on abort (timeout)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new NetworkError('Request timeout')
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    clearTimeout(timeoutId)
    throw lastError || new NetworkError('Request failed after retries')
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: Omit<SecureRequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<SecureRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<SecureRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  async patch<T = any>(endpoint: string, body?: any, config?: Omit<SecureRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  async delete<T = any>(endpoint: string, config?: Omit<SecureRequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // Sanitize object recursively
  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return sanitizeString(obj)
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item))
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[sanitizeString(key)] = this.sanitizeObject(value)
      }
      return sanitized
    }
    
    return obj
  }
}

// Create singleton instance
export const secureApi = new SecureApiClient()

// Export class for custom instances
export { SecureApiClient }

// Utility to create API client with custom base URL
export function createSecureApiClient(baseUrl: string) {
  return new SecureApiClient(baseUrl)
}
