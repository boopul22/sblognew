/**
 * Storage Configuration Management
 * Handles configuration and provider selection for image storage
 */

import { SupabaseStorageProvider } from './SupabaseStorageProvider.js'
import { CloudflareR2StorageProvider } from './CloudflareR2StorageProvider.js'

/**
 * Available storage providers
 */
export const STORAGE_PROVIDERS = {
  SUPABASE: 'supabase',
  CLOUDFLARE_R2: 'cloudflare-r2'
}

/**
 * Storage configuration class
 */
export class StorageConfig {
  constructor() {
    this.providers = new Map()
    this.currentProvider = null
    this.fallbackProvider = null
    
    // Initialize providers
    this.initializeProviders()
    
    // Set current provider based on configuration
    this.setCurrentProvider()
  }

  /**
   * Initialize all available storage providers
   */
  initializeProviders() {
    // Initialize Supabase provider
    const supabaseProvider = new SupabaseStorageProvider({
      bucketName: 'images'
    })
    this.providers.set(STORAGE_PROVIDERS.SUPABASE, supabaseProvider)

    // Initialize Cloudflare R2 provider
    const r2Provider = new CloudflareR2StorageProvider()
    this.providers.set(STORAGE_PROVIDERS.CLOUDFLARE_R2, r2Provider)
  }

  /**
   * Set the current provider based on environment configuration
   */
  setCurrentProvider() {
    // Get preferred provider from environment
    const preferredProvider = import.meta.env.VITE_STORAGE_PROVIDER || STORAGE_PROVIDERS.SUPABASE
    
    // Validate and set current provider
    if (this.providers.has(preferredProvider)) {
      const provider = this.providers.get(preferredProvider)
      
      if (provider.isConfigured()) {
        this.currentProvider = preferredProvider
        console.log(`✅ Storage provider set to: ${preferredProvider}`)
      } else {
        console.warn(`⚠️ Preferred provider '${preferredProvider}' is not properly configured`)
        this.setFallbackProvider(preferredProvider)
      }
    } else {
      console.warn(`⚠️ Unknown storage provider: ${preferredProvider}`)
      this.setFallbackProvider()
    }

    // If no current provider is set, use fallback
    if (!this.currentProvider) {
      this.currentProvider = this.fallbackProvider
      if (this.currentProvider) {
        console.log(`🔄 Using fallback storage provider: ${this.currentProvider}`)
      } else {
        console.error('❌ No storage provider is available!')
      }
    }
  }

  /**
   * Set fallback provider (first available configured provider)
   * @param {string} excludeProvider - Provider to exclude from fallback selection
   */
  setFallbackProvider(excludeProvider = null) {
    for (const [providerName, provider] of this.providers) {
      if (providerName !== excludeProvider && provider.isConfigured()) {
        this.fallbackProvider = providerName
        break
      }
    }

    // If no fallback found and Supabase is available, use it as ultimate fallback
    // This ensures the app works on Vercel even if R2 APIs fail
    if (!this.fallbackProvider && this.providers.has(STORAGE_PROVIDERS.SUPABASE)) {
      const supabaseProvider = this.providers.get(STORAGE_PROVIDERS.SUPABASE)
      if (supabaseProvider.isConfigured()) {
        this.fallbackProvider = STORAGE_PROVIDERS.SUPABASE
        console.log('🔄 Using Supabase as ultimate fallback (Vercel-compatible)')
      }
    }
  }

  /**
   * Get the current storage provider instance
   * @returns {StorageProvider|null} Current provider instance
   */
  getCurrentProvider() {
    if (!this.currentProvider) {
      console.error('No storage provider is configured')
      return null
    }
    
    return this.providers.get(this.currentProvider)
  }

  /**
   * Get a specific provider instance
   * @param {string} providerName - Provider name
   * @returns {StorageProvider|null} Provider instance
   */
  getProvider(providerName) {
    return this.providers.get(providerName) || null
  }

  /**
   * Switch to a different provider
   * @param {string} providerName - Provider to switch to
   * @returns {boolean} Whether the switch was successful
   */
  switchProvider(providerName) {
    if (!this.providers.has(providerName)) {
      console.error(`Unknown provider: ${providerName}`)
      return false
    }

    const provider = this.providers.get(providerName)
    if (!provider.isConfigured()) {
      console.error(`Provider '${providerName}' is not properly configured`)
      return false
    }

    this.currentProvider = providerName
    console.log(`✅ Switched to storage provider: ${providerName}`)
    return true
  }

  /**
   * Get configuration status for all providers
   * @returns {object} Configuration status
   */
  getConfigurationStatus() {
    const status = {
      current: this.currentProvider,
      fallback: this.fallbackProvider,
      providers: {}
    }

    for (const [providerName, provider] of this.providers) {
      status.providers[providerName] = {
        configured: provider.isConfigured(),
        name: provider.getProviderName()
      }
    }

    return status
  }

  /**
   * Validate current configuration
   * @returns {object} Validation result
   */
  validateConfiguration() {
    const errors = []
    const warnings = []

    // Check if any provider is available
    const configuredProviders = Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.isConfigured())

    if (configuredProviders.length === 0) {
      errors.push('No storage providers are properly configured')
    }

    // Check current provider
    if (!this.currentProvider) {
      errors.push('No current storage provider is set')
    } else {
      const currentProviderInstance = this.getCurrentProvider()
      if (!currentProviderInstance || !currentProviderInstance.isConfigured()) {
        errors.push(`Current provider '${this.currentProvider}' is not properly configured`)
      }
    }

    // Check fallback provider
    if (!this.fallbackProvider && configuredProviders.length > 1) {
      warnings.push('No fallback provider is available')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      configuredProviders: configuredProviders.length,
      totalProviders: this.providers.size
    }
  }

  /**
   * Get environment variables needed for each provider
   * @returns {object} Environment variables by provider
   */
  static getRequiredEnvironmentVariables() {
    return {
      [STORAGE_PROVIDERS.SUPABASE]: [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY'
      ],
      [STORAGE_PROVIDERS.CLOUDFLARE_R2]: [
        'VITE_CLOUDFLARE_ACCOUNT_ID',
        'VITE_CLOUDFLARE_R2_ACCESS_KEY_ID',
        'VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY',
        'VITE_CLOUDFLARE_R2_BUCKET_NAME',
        'VITE_CLOUDFLARE_R2_PUBLIC_URL',
        'VITE_CLOUDFLARE_R2_ENDPOINT'
      ],
      general: [
        'VITE_STORAGE_PROVIDER' // Optional: defaults to 'supabase'
      ]
    }
  }

  /**
   * Check which environment variables are missing
   * @returns {object} Missing environment variables by provider
   */
  static checkMissingEnvironmentVariables() {
    const required = StorageConfig.getRequiredEnvironmentVariables()
    const missing = {}

    for (const [provider, vars] of Object.entries(required)) {
      missing[provider] = vars.filter(varName => !import.meta.env[varName])
    }

    return missing
  }
}

// Create and export a singleton instance
export const storageConfig = new StorageConfig()

/**
 * Get the current storage provider instance
 * @returns {StorageProvider|null} Current provider instance
 */
export function getCurrentStorageProvider() {
  return storageConfig.getCurrentProvider()
}

/**
 * Get storage configuration status
 * @returns {object} Configuration status
 */
export function getStorageConfigurationStatus() {
  return storageConfig.getConfigurationStatus()
}

/**
 * Validate storage configuration
 * @returns {object} Validation result
 */
export function validateStorageConfiguration() {
  return storageConfig.validateConfiguration()
}
