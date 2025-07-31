/**
 * Supabase Storage Utility (Legacy Compatibility Layer)
 *
 * This file maintains backward compatibility with the existing API
 * while using the new storage abstraction layer internally.
 *
 * For new code, use the storage abstraction layer directly:
 * import { uploadImage, deleteImage, getImageUrl } from './storage'
 */

import {
  uploadImage,
  deleteImage,
  getImageUrl as getImageUrlFromStorage,
  listImages as listImagesFromStorage,
  getImageMetadata as getImageMetadataFromStorage,
  isStorageConfigured as isStorageConfiguredFromStorage
} from './storage'

/**
 * Upload image to storage (Legacy API - maintained for backward compatibility)
 * @param {File} file - Image file to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with success status and URL
 */
export async function uploadImageToSupabase(file, options = {}) {
  // Use the new storage abstraction layer
  return await uploadImage(file, options)
}

/**
 * Delete image from storage (Legacy API - maintained for backward compatibility)
 * @param {string} filename - Filename to delete
 * @returns {Promise<object>} - Delete result
 */
export async function deleteImageFromSupabase(filename) {
  // Use the new storage abstraction layer
  return await deleteImage(filename)
}

/**
 * Get public URL for an image (Legacy API - maintained for backward compatibility)
 * @param {string} filename - Image filename
 * @returns {string} - Public URL
 */
export function getImageUrl(filename) {
  // Use the new storage abstraction layer
  return getImageUrlFromStorage(filename)
}

/**
 * Validate storage configuration (Legacy API - maintained for backward compatibility)
 * @returns {boolean} - Whether storage is properly configured
 */
export function isSupabaseStorageConfigured() {
  // Use the new storage abstraction layer
  return isStorageConfiguredFromStorage()
}

/**
 * List images in storage (Legacy API - maintained for backward compatibility)
 * @param {object} options - List options
 * @returns {Promise<object>} - List result
 */
export async function listImages(options = {}) {
  // Use the new storage abstraction layer
  const result = await listImagesFromStorage(options)

  // Maintain backward compatibility with the 'images' property name
  if (result.success && result.files) {
    result.images = result.files
  }

  return result
}

/**
 * Get image metadata (Legacy API - maintained for backward compatibility)
 * @param {string} filename - Image filename
 * @returns {Promise<object>} - Image metadata
 */
export async function getImageMetadata(filename) {
  // Use the new storage abstraction layer
  return await getImageMetadataFromStorage(filename)
}
