/**
 * Cloudflare R2 Utilities
 * Client-side utilities for R2 operations that work with backend APIs
 */

/**
 * Generate presigned URL for upload (calls backend API)
 * @param {string} filename - Target filename
 * @param {string} contentType - File content type
 * @returns {Promise<object>} Presigned URL data
 */
export async function getPresignedUploadUrl(filename, contentType) {
  try {
    const response = await fetch('/api/r2/presigned-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        contentType
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting presigned upload URL:', error)
    throw error
  }
}

/**
 * Upload file using presigned URL
 * @param {string} presignedUrl - Presigned URL for upload
 * @param {File} file - File to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result
 */
export async function uploadWithPresignedUrl(presignedUrl, file, options = {}) {
  try {
    const { onProgress } = options

    if (onProgress) {
      onProgress(20) // Starting upload
    }

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      }
    })

    if (onProgress) {
      onProgress(90) // Upload complete
    }

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    if (onProgress) {
      onProgress(100) // Complete
    }

    return {
      success: true,
      message: 'Upload completed successfully'
    }

  } catch (error) {
    console.error('Error uploading with presigned URL:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Delete file via backend API
 * @param {string} filename - Filename to delete
 * @returns {Promise<object>} Delete result
 */
export async function deleteFromR2(filename) {
  try {
    const response = await fetch('/api/r2/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename
      })
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting from R2:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * List files via backend API
 * @param {object} options - List options
 * @returns {Promise<object>} List result
 */
export async function listR2Files(options = {}) {
  try {
    const queryParams = new URLSearchParams()
    if (options.limit) queryParams.set('limit', options.limit)
    if (options.offset) queryParams.set('offset', options.offset)

    const response = await fetch(`/api/r2/list?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`List failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error listing R2 files:', error)
    return {
      success: false,
      error: error.message,
      files: []
    }
  }
}

/**
 * Get file metadata via backend API
 * @param {string} filename - Filename
 * @returns {Promise<object>} Metadata result
 */
export async function getR2FileMetadata(filename) {
  try {
    const response = await fetch(`/api/r2/metadata?filename=${encodeURIComponent(filename)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Metadata request failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting R2 file metadata:', error)
    return {
      success: false,
      error: error.message,
      metadata: null
    }
  }
}

/**
 * Check if R2 backend APIs are available
 * @returns {Promise<boolean>} Whether R2 APIs are available
 */
export async function checkR2ApiAvailability() {
  try {
    const response = await fetch('/api/r2/health', {
      method: 'GET'
    })
    return response.ok
  } catch (error) {
    console.warn('R2 API health check failed:', error)
    return false
  }
}
