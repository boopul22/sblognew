import { toast } from 'react-hot-toast'

// Result type for safe async operations
export type Result<T, E = Error> = [T, null] | [null, E]

// Custom error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

// Safe async wrapper
export async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error as Error]
  }
}

// Safe sync wrapper
export function safeSync<T>(fn: () => T): Result<T> {
  try {
    const data = fn()
    return [data, null]
  } catch (error) {
    return [null, error as Error]
  }
}

// Error reporting utility
export class ErrorReporter {
  private static instance: ErrorReporter
  private isDev = import.meta.env.DEV

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter()
    }
    return ErrorReporter.instance
  }

  // Report error to external service (Sentry, etc.)
  report(error: Error, context?: Record<string, any>) {
    // Log to console in development
    if (this.isDev) {
      console.error('Error reported:', error)
      if (context) {
        console.error('Context:', context)
      }
    }

    // In production, send to error tracking service
    if (!this.isDev && window.Sentry) {
      window.Sentry.captureException(error, { extra: context })
    }
  }

  // Report error with user notification
  reportWithToast(error: Error, userMessage?: string, context?: Record<string, any>) {
    this.report(error, context)
    
    const message = userMessage || this.getUserFriendlyMessage(error)
    toast.error(message)
  }

  private getUserFriendlyMessage(error: Error): string {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          return 'Invalid request. Please check your input.'
        case 401:
          return 'You need to log in to perform this action.'
        case 403:
          return 'You don\'t have permission to perform this action.'
        case 404:
          return 'The requested resource was not found.'
        case 500:
          return 'Server error. Please try again later.'
        default:
          return error.message || 'An error occurred.'
      }
    }

    if (error instanceof ValidationError) {
      return error.message || 'Please check your input and try again.'
    }

    if (error instanceof NetworkError) {
      return 'Network error. Please check your connection and try again.'
    }

    return 'An unexpected error occurred. Please try again.'
  }
}

// Global error handler for unhandled promises
export function setupGlobalErrorHandling() {
  const errorReporter = ErrorReporter.getInstance()

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.report(
      new Error(`Unhandled promise rejection: ${event.reason}`),
      { type: 'unhandledrejection', reason: event.reason }
    )
  })

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    errorReporter.report(
      event.error || new Error(event.message),
      {
        type: 'uncaughtError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    )
  })
}

// Utility to create API error from response
export async function createApiError(response: Response): Promise<ApiError> {
  let message = `HTTP ${response.status}: ${response.statusText}`
  let code: string | undefined

  try {
    const errorData = await response.json()
    if (errorData.message) {
      message = errorData.message
    }
    if (errorData.code) {
      code = errorData.code
    }
  } catch {
    // If response is not JSON, use default message
  }

  return new ApiError(message, response.status, code)
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Export singleton instance
export const errorReporter = ErrorReporter.getInstance()
