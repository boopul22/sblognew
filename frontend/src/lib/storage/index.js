/**
 * Storage Abstraction Layer - Main Interface
 * Provides a unified interface for image storage operations
 */

import { getCurrentStorageProvider, getStorageConfigurationStatus, validateStorageConfiguration } from './StorageConfig.js'

/**
 * Upload an image file to the configured storage provider
 * @param {File} file - Image file to upload
 * @param {object} options - Upload options
 * @param {function} options.onProgress - Progress callback (progress: number 0-100)
 * @param {number} options.maxSize - Maximum file size in bytes
 * @returns {Promise<StorageResult>} Upload result
 */
export async function uploadImage(file, options = {}) {
  const provider = getCurrentStorageProvider()
  
  if (!provider) {
    return {
      success: false,
      error: 'No storage provider is configured',
      provider: 'none'
    }
  }

  try {
    const result = await provider.upload(file, options)
    
    // Add provider info to result if not already present
    if (!result.provider) {
      result.provider = provider.getProviderName()
    }
    
    return result
  } catch (error) {
    console.error('Error in uploadImage:', error)
    return {
      success: false,
      error: error.message,
      provider: provider.getProviderName()
    }
  }
}

/**
 * Delete an image from the configured storage provider
 * @param {string} fileIdentifier - File identifier (filename, URL, or path)
 * @returns {Promise<StorageResult>} Delete result
 */
export async function deleteImage(fileIdentifier) {
  const provider = getCurrentStorageProvider()
  
  if (!provider) {
    return {
      success: false,
      error: 'No storage provider is configured',
      provider: 'none'
    }
  }

  try {
    const result = await provider.delete(fileIdentifier)
    
    // Add provider info to result if not already present
    if (!result.provider) {
      result.provider = provider.getProviderName()
    }
    
    return result
  } catch (error) {
    console.error('Error in deleteImage:', error)
    return {
      success: false,
      error: error.message,
      provider: provider.getProviderName()
    }
  }
}

/**
 * Get public URL for an image
 * @param {string} fileIdentifier - File identifier (filename or path)
 * @returns {string} Public URL
 */
export function getImageUrl(fileIdentifier) {
  const provider = getCurrentStorageProvider()
  
  if (!provider) {
    console.warn('No storage provider is configured, returning original identifier')
    return fileIdentifier
  }

  try {
    return provider.getPublicUrl(fileIdentifier)
  } catch (error) {
    console.error('Error in getImageUrl:', error)
    return fileIdentifier
  }
}

/**
 * List images in storage (for admin purposes)
 * @param {object} options - List options
 * @param {number} options.limit - Maximum number of files to return
 * @param {number} options.offset - Number of files to skip
 * @returns {Promise<StorageListResult>} List result
 */
export async function listImages(options = {}) {
  const provider = getCurrentStorageProvider()
  
  if (!provider) {
    return {
      success: false,
      error: 'No storage provider is configured',
      files: [],
      provider: 'none'
    }
  }

  try {
    const result = await provider.list(options)
    
    // Add provider info to result if not already present
    if (!result.provider) {
      result.provider = provider.getProviderName()
    }
    
    return result
  } catch (error) {
    console.error('Error in listImages:', error)
    return {
      success: false,
      error: error.message,
      files: [],
      provider: provider.getProviderName()
    }
  }
}

/**
 * Get image metadata
 * @param {string} fileIdentifier - File identifier
 * @returns {Promise<StorageMetadataResult>} Metadata result
 */
export async function getImageMetadata(fileIdentifier) {
  const provider = getCurrentStorageProvider()
  
  if (!provider) {
    return {
      success: false,
      error: 'No storage provider is configured',
      metadata: null,
      provider: 'none'
    }
  }

  try {
    const result = await provider.getMetadata(fileIdentifier)
    
    // Add provider info to result if not already present
    if (!result.provider) {
      result.provider = provider.getProviderName()
    }
    
    return result
  } catch (error) {
    console.error('Error in getImageMetadata:', error)
    return {
      success: false,
      error: error.message,
      metadata: null,
      provider: provider.getProviderName()
    }
  }
}

/**
 * Check if storage is properly configured
 * @returns {boolean} Whether storage is configured
 */
export function isStorageConfigured() {
  const provider = getCurrentStorageProvider()
  return provider ? provider.isConfigured() : false
}

/**
 * Get current storage provider name
 * @returns {string|null} Provider name
 */
export function getCurrentProviderName() {
  const provider = getCurrentStorageProvider()
  return provider ? provider.getProviderName() : null
}

/**
 * Get storage configuration status (for debugging/admin)
 * @returns {object} Configuration status
 */
export function getStorageStatus() {
  return getStorageConfigurationStatus()
}

/**
 * Validate storage configuration (for debugging/admin)
 * @returns {object} Validation result
 */
export function validateStorage() {
  return validateStorageConfiguration()
}

// Re-export storage providers and config for advanced usage
export { STORAGE_PROVIDERS, getCurrentStorageProvider } from './StorageConfig.js'
export { StorageProvider } from './StorageProvider.js'
export { SupabaseStorageProvider } from './SupabaseStorageProvider.js'
export { CloudflareR2StorageProvider } from './CloudflareR2StorageProvider.js'

// Backward compatibility exports (maintain existing API)
export { uploadImage as uploadImageToSupabase }
export { deleteImage as deleteImageFromSupabase }
