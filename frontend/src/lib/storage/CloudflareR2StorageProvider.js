/**
 * Cloudflare R2 Storage Provider Implementation
 * Handles image storage using Cloudflare R2 (S3-compatible API)
 */

import { StorageProvider } from './StorageProvider.js'
import {
  getPresignedUploadUrl,
  uploadWithPresignedUrl,
  deleteFromR2,
  listR2Files,
  getR2FileMetadata,
  checkR2ApiAvailability
} from './r2Utils.js'

export class CloudflareR2StorageProvider extends StorageProvider {
  constructor(config = {}) {
    super(config)
    this.accountId = config.accountId || import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID
    this.accessKeyId = config.accessKeyId || import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID
    this.secretAccessKey = config.secretAccessKey || import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY
    this.bucketName = config.bucketName || import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME || 'blog-images'
    this.publicUrl = config.publicUrl || import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL
    this.endpoint = config.endpoint || import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT
  }

  /**
   * Upload a file to Cloudflare R2
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

      // Get presigned URL from backend
      const presignedData = await getPresignedUploadUrl(filename, file.type)

      if (!presignedData.success) {
        throw new Error(presignedData.error || 'Failed to get presigned URL')
      }

      if (options.onProgress) {
        options.onProgress(30) // Got presigned URL
      }

      // Upload using presigned URL
      const uploadResult = await uploadWithPresignedUrl(presignedData.url, file, {
        onProgress: (progress) => {
          // Map progress from 30-100
          const mappedProgress = 30 + (progress * 0.7)
          if (options.onProgress) {
            options.onProgress(Math.round(mappedProgress))
          }
        }
      })

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      // Generate public URL
      const publicUrl = this.getPublicUrl(filename)

      return {
        success: true,
        url: publicUrl,
        filename: filename,
        path: filename,
        provider: 'cloudflare-r2'
      }

    } catch (error) {
      console.error('Error uploading image to Cloudflare R2:', error)
      return {
        success: false,
        error: error.message,
        provider: 'cloudflare-r2'
      }
    }
  }



  /**
   * Delete a file from Cloudflare R2
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
      if (fileIdentifier.includes(this.publicUrl)) {
        actualFilename = fileIdentifier.replace(`${this.publicUrl}/`, '')
      }

      // Call backend API to delete the file
      const result = await deleteFromR2(actualFilename)

      return {
        success: result.success,
        message: result.success ? 'Image deleted successfully' : result.error,
        error: result.success ? undefined : result.error,
        provider: 'cloudflare-r2'
      }

    } catch (error) {
      console.error('Error deleting image from Cloudflare R2:', error)
      return {
        success: false,
        error: error.message,
        provider: 'cloudflare-r2'
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
    
    return `${this.publicUrl}/${cleanFilename}`
  }

  /**
   * List files in the R2 bucket
   * @param {object} options - List options
   * @returns {Promise<StorageListResult>} List result
   */
  async list(options = {}) {
    try {
      // Call backend API to list files
      const result = await listR2Files(options)

      return {
        success: result.success,
        files: result.files || [],
        error: result.success ? undefined : result.error,
        provider: 'cloudflare-r2'
      }

    } catch (error) {
      console.error('Error listing images from Cloudflare R2:', error)
      return {
        success: false,
        error: error.message,
        files: [],
        provider: 'cloudflare-r2'
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
      if (fileIdentifier.includes(this.publicUrl)) {
        actualFilename = fileIdentifier.replace(`${this.publicUrl}/`, '')
      }

      // Call backend API to get metadata
      const result = await getR2FileMetadata(actualFilename)

      return {
        success: result.success,
        metadata: result.metadata,
        error: result.success ? undefined : result.error,
        provider: 'cloudflare-r2'
      }

    } catch (error) {
      console.error('Error getting image metadata from Cloudflare R2:', error)
      return {
        success: false,
        error: error.message,
        metadata: null,
        provider: 'cloudflare-r2'
      }
    }
  }

  /**
   * Check if Cloudflare R2 is properly configured
   * @returns {boolean} Whether R2 is configured
   */
  isConfigured() {
    const hasConfig = !!(
      this.accountId &&
      this.accessKeyId &&
      this.secretAccessKey &&
      this.bucketName &&
      this.publicUrl &&
      this.endpoint
    )

    // Also check if backend APIs are available (async check would be better but this is sync)
    return hasConfig
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return 'cloudflare-r2'
  }
}
