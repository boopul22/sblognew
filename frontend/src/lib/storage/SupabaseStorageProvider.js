/**
 * Supabase Storage Provider Implementation
 * Handles image storage using Supabase Storage
 */

import { StorageProvider } from './StorageProvider.js'
import { supabase } from '../supabase.js'

export class SupabaseStorageProvider extends StorageProvider {
  constructor(config = {}) {
    super(config)
    this.bucketName = config.bucketName || 'images'
  }

  /**
   * Upload a file to Supabase storage
   * @param {File} file - The file to upload
   * @param {object} options - Upload options
   * @returns {Promise<StorageResult>} Upload result
   */
  async upload(file, options = {}) {
    try {
      // Validate file
      const validation = this.validateFile(file, options)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      const filename = this.generateUniqueFilename(file.name)

      // Call progress callback if provided
      if (options.onProgress) {
        options.onProgress(10) // Starting upload
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filename, file, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      if (options.onProgress) {
        options.onProgress(90) // Upload complete
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filename)

      if (options.onProgress) {
        options.onProgress(100) // Complete
      }

      return {
        success: true,
        url: publicUrl,
        filename: filename,
        path: data.path,
        provider: 'supabase'
      }

    } catch (error) {
      console.error('Error uploading image to Supabase:', error)
      return {
        success: false,
        error: error.message,
        provider: 'supabase'
      }
    }
  }

  /**
   * Delete a file from Supabase storage
   * @param {string} fileIdentifier - Filename or URL to delete
   * @returns {Promise<StorageResult>} Delete result
   */
  async delete(fileIdentifier) {
    try {
      if (!fileIdentifier) {
        throw new Error('No file identifier provided')
      }

      // Extract filename from URL if a full URL is provided
      let actualFilename = fileIdentifier
      if (fileIdentifier.includes(`/storage/v1/object/public/${this.bucketName}/`)) {
        actualFilename = fileIdentifier.split(`/${this.bucketName}/`).pop()
      }

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([actualFilename])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }

      return {
        success: true,
        message: 'Image deleted successfully',
        provider: 'supabase'
      }

    } catch (error) {
      console.error('Error deleting image from Supabase:', error)
      return {
        success: false,
        error: error.message,
        provider: 'supabase'
      }
    }
  }

  /**
   * Get public URL for a file
   * @param {string} fileIdentifier - Filename or path
   * @returns {string} Public URL
   */
  getPublicUrl(fileIdentifier) {
    if (!fileIdentifier) {
      console.warn('No file identifier provided')
      return fileIdentifier
    }
    
    // If it's already a full URL, return as is
    if (fileIdentifier.startsWith('http')) {
      return fileIdentifier
    }
    
    // Remove leading slash if present
    const cleanFilename = fileIdentifier.startsWith('/') ? fileIdentifier.slice(1) : fileIdentifier
    
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(cleanFilename)
      
    return publicUrl
  }

  /**
   * List files in the storage bucket
   * @param {object} options - List options
   * @returns {Promise<StorageListResult>} List result
   */
  async list(options = {}) {
    try {
      const { limit = 100, offset = 0 } = options

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', {
          limit,
          offset,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        throw new Error(`Failed to list images: ${error.message}`)
      }

      return {
        success: true,
        files: data || [],
        provider: 'supabase'
      }

    } catch (error) {
      console.error('Error listing images:', error)
      return {
        success: false,
        error: error.message,
        files: [],
        provider: 'supabase'
      }
    }
  }

  /**
   * Get file metadata
   * @param {string} fileIdentifier - Filename or URL
   * @returns {Promise<StorageMetadataResult>} Metadata result
   */
  async getMetadata(fileIdentifier) {
    try {
      if (!fileIdentifier) {
        throw new Error('No file identifier provided')
      }

      // Extract filename from URL if a full URL is provided
      let actualFilename = fileIdentifier
      if (fileIdentifier.includes(`/storage/v1/object/public/${this.bucketName}/`)) {
        actualFilename = fileIdentifier.split(`/${this.bucketName}/`).pop()
      }

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', {
          search: actualFilename
        })

      if (error) {
        throw new Error(`Failed to get metadata: ${error.message}`)
      }

      const fileInfo = data.find(file => file.name === actualFilename)
      
      if (!fileInfo) {
        throw new Error('Image not found')
      }

      return {
        success: true,
        metadata: fileInfo,
        provider: 'supabase'
      }

    } catch (error) {
      console.error('Error getting image metadata:', error)
      return {
        success: false,
        error: error.message,
        metadata: null,
        provider: 'supabase'
      }
    }
  }

  /**
   * Check if Supabase storage is properly configured
   * @returns {boolean} Whether Supabase is configured
   */
  isConfigured() {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      return !!(supabaseUrl && supabaseAnonKey)
    } catch (error) {
      console.error('Error checking Supabase configuration:', error)
      return false
    }
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'supabase'
  }
}
