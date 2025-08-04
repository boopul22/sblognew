/**
 * Abstract Storage Provider Interface
 * Defines the contract that all storage providers must implement
 */

export class StorageProvider {
  constructor(config = {}) {
    this.config = config
  }

  /**
   * Upload a file to storage
   * @param {File} file - The file to upload
   * @param {object} options - Upload options
   * @param {function} options.onProgress - Progress callback (progress: number 0-100)
   * @param {number} options.maxSize - Maximum file size in bytes
   * @returns {Promise<StorageResult>} Upload result
   */
  async upload(file, options = {}) {
    throw new Error('upload() method must be implemented by storage provider')
  }

  /**
   * Delete a file from storage
   * @param {string} fileIdentifier - File identifier (filename, URL, or path)
   * @returns {Promise<StorageResult>} Delete result
   */
  async delete(fileIdentifier) {
    throw new Error('delete() method must be implemented by storage provider')
  }

  /**
   * Get public URL for a file
   * @param {string} fileIdentifier - File identifier (filename or path)
   * @returns {string} Public URL
   */
  getPublicUrl(fileIdentifier) {
    throw new Error('getPublicUrl() method must be implemented by storage provider')
  }

  /**
   * List files in storage (for admin purposes)
   * @param {object} options - List options
   * @param {number} options.limit - Maximum number of files to return
   * @param {number} options.offset - Number of files to skip
   * @returns {Promise<StorageListResult>} List result
   */
  async list(options = {}) {
    throw new Error('list() method must be implemented by storage provider')
  }

  /**
   * Get file metadata
   * @param {string} fileIdentifier - File identifier
   * @returns {Promise<StorageMetadataResult>} Metadata result
   */
  async getMetadata(fileIdentifier) {
    throw new Error('getMetadata() method must be implemented by storage provider')
  }

  /**
   * Check if the storage provider is properly configured
   * @returns {boolean} Whether the provider is configured
   */
  isConfigured() {
    throw new Error('isConfigured() method must be implemented by storage provider')
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    throw new Error('getProviderName() method must be implemented by storage provider')
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {object} options - Validation options
   * @returns {object} Validation result
   */
  validateFile(file, options = {}) {
    const errors = []

    if (!file) {
      errors.push('No file provided')
      return { valid: false, errors }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image')
    }

    // Validate file size
    const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB default
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate a unique filename
   * @param {string} originalName - Original filename
   * @returns {string} Unique filename
   */
  generateUniqueFilename(originalName) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    const baseName = originalName.split('.').slice(0, -1).join('.')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20)
    
    return `${timestamp}-${randomString}-${baseName}.${extension}`
  }
}

/**
 * Storage operation result interface
 * @typedef {object} StorageResult
 * @property {boolean} success - Whether the operation was successful
 * @property {string} [url] - Public URL of the file (for upload operations)
 * @property {string} [filename] - Generated filename
 * @property {string} [path] - Storage path
 * @property {string} [error] - Error message if operation failed
 * @property {object} [metadata] - Additional metadata
 */

/**
 * Storage list result interface
 * @typedef {object} StorageListResult
 * @property {boolean} success - Whether the operation was successful
 * @property {Array} files - Array of file objects
 * @property {string} [error] - Error message if operation failed
 */

/**
 * Storage metadata result interface
 * @typedef {object} StorageMetadataResult
 * @property {boolean} success - Whether the operation was successful
 * @property {object} [metadata] - File metadata
 * @property {string} [error] - Error message if operation failed
 */
