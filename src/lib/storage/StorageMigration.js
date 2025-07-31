/**
 * Storage Migration Utilities
 * Helps migrate images between different storage providers
 */

import { storageConfig } from './StorageConfig.js'

export class StorageMigration {
  constructor() {
    this.migrationLog = []
  }

  /**
   * Migrate images from one provider to another
   * @param {string} fromProvider - Source provider name
   * @param {string} toProvider - Target provider name
   * @param {object} options - Migration options
   * @returns {Promise<object>} Migration result
   */
  async migrateImages(fromProvider, toProvider, options = {}) {
    const {
      batchSize = 10,
      onProgress = null,
      dryRun = false,
      filter = null // Function to filter which images to migrate
    } = options

    try {
      // Get provider instances
      const sourceProvider = storageConfig.getProvider(fromProvider)
      const targetProvider = storageConfig.getProvider(toProvider)

      if (!sourceProvider || !targetProvider) {
        throw new Error('Invalid provider specified')
      }

      if (!sourceProvider.isConfigured() || !targetProvider.isConfigured()) {
        throw new Error('Both providers must be properly configured')
      }

      // Get list of images from source provider
      const listResult = await sourceProvider.list({ limit: 1000 })
      if (!listResult.success) {
        throw new Error(`Failed to list images from ${fromProvider}: ${listResult.error}`)
      }

      let imagesToMigrate = listResult.files || []
      
      // Apply filter if provided
      if (filter && typeof filter === 'function') {
        imagesToMigrate = imagesToMigrate.filter(filter)
      }

      const totalImages = imagesToMigrate.length
      let migratedCount = 0
      let errorCount = 0
      const errors = []

      console.log(`Starting migration of ${totalImages} images from ${fromProvider} to ${toProvider}`)
      
      if (dryRun) {
        console.log('DRY RUN MODE - No actual migration will occur')
      }

      // Process images in batches
      for (let i = 0; i < imagesToMigrate.length; i += batchSize) {
        const batch = imagesToMigrate.slice(i, i + batchSize)
        
        const batchResults = await Promise.allSettled(
          batch.map(imageInfo => this.migrateImage(
            imageInfo, 
            sourceProvider, 
            targetProvider, 
            { dryRun }
          ))
        )

        // Process batch results
        batchResults.forEach((result, index) => {
          const imageInfo = batch[index]
          
          if (result.status === 'fulfilled' && result.value.success) {
            migratedCount++
            this.migrationLog.push({
              type: 'success',
              image: imageInfo.name,
              timestamp: new Date().toISOString(),
              dryRun
            })
          } else {
            errorCount++
            const error = result.status === 'rejected' ? result.reason : result.value.error
            errors.push({
              image: imageInfo.name,
              error: error.message || error
            })
            this.migrationLog.push({
              type: 'error',
              image: imageInfo.name,
              error: error.message || error,
              timestamp: new Date().toISOString(),
              dryRun
            })
          }
        })

        // Report progress
        const progress = Math.round(((i + batch.length) / totalImages) * 100)
        if (onProgress) {
          onProgress({
            total: totalImages,
            migrated: migratedCount,
            errors: errorCount,
            progress
          })
        }

        console.log(`Progress: ${migratedCount}/${totalImages} migrated, ${errorCount} errors`)
      }

      return {
        success: true,
        totalImages,
        migratedCount,
        errorCount,
        errors,
        dryRun,
        log: this.migrationLog
      }

    } catch (error) {
      console.error('Migration failed:', error)
      return {
        success: false,
        error: error.message,
        totalImages: 0,
        migratedCount: 0,
        errorCount: 0,
        errors: [],
        dryRun,
        log: this.migrationLog
      }
    }
  }

  /**
   * Migrate a single image
   * @param {object} imageInfo - Image information from source provider
   * @param {StorageProvider} sourceProvider - Source provider instance
   * @param {StorageProvider} targetProvider - Target provider instance
   * @param {object} options - Migration options
   * @returns {Promise<object>} Migration result
   */
  async migrateImage(imageInfo, sourceProvider, targetProvider, options = {}) {
    const { dryRun = false } = options

    try {
      if (dryRun) {
        // In dry run mode, just simulate the migration
        return {
          success: true,
          message: `Would migrate ${imageInfo.name}`,
          dryRun: true
        }
      }

      // Get the image URL from source provider
      const sourceUrl = sourceProvider.getPublicUrl(imageInfo.name)
      
      // Download the image
      const response = await fetch(sourceUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`)
      }

      const blob = await response.blob()
      const file = new File([blob], imageInfo.name, { type: blob.type })

      // Upload to target provider
      const uploadResult = await targetProvider.upload(file, {
        filename: imageInfo.name // Preserve original filename
      })

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      return {
        success: true,
        sourceUrl,
        targetUrl: uploadResult.url,
        filename: imageInfo.name
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        filename: imageInfo.name
      }
    }
  }

  /**
   * Verify migration integrity
   * @param {string} fromProvider - Source provider name
   * @param {string} toProvider - Target provider name
   * @param {Array} migratedImages - List of migrated images
   * @returns {Promise<object>} Verification result
   */
  async verifyMigration(fromProvider, toProvider, migratedImages) {
    const sourceProvider = storageConfig.getProvider(fromProvider)
    const targetProvider = storageConfig.getProvider(toProvider)

    if (!sourceProvider || !targetProvider) {
      throw new Error('Invalid provider specified')
    }

    const verificationResults = []
    let successCount = 0
    let errorCount = 0

    for (const imageInfo of migratedImages) {
      try {
        // Check if image exists in target provider
        const targetMetadata = await targetProvider.getMetadata(imageInfo.filename)
        
        if (targetMetadata.success) {
          successCount++
          verificationResults.push({
            filename: imageInfo.filename,
            status: 'verified',
            targetExists: true
          })
        } else {
          errorCount++
          verificationResults.push({
            filename: imageInfo.filename,
            status: 'missing',
            targetExists: false,
            error: targetMetadata.error
          })
        }
      } catch (error) {
        errorCount++
        verificationResults.push({
          filename: imageInfo.filename,
          status: 'error',
          error: error.message
        })
      }
    }

    return {
      success: errorCount === 0,
      totalChecked: migratedImages.length,
      successCount,
      errorCount,
      results: verificationResults
    }
  }

  /**
   * Get migration log
   * @returns {Array} Migration log entries
   */
  getMigrationLog() {
    return this.migrationLog
  }

  /**
   * Clear migration log
   */
  clearMigrationLog() {
    this.migrationLog = []
  }

  /**
   * Export migration log to JSON
   * @returns {string} JSON string of migration log
   */
  exportMigrationLog() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      log: this.migrationLog
    }, null, 2)
  }
}

// Export a singleton instance
export const storageMigration = new StorageMigration()

/**
 * Quick migration function
 * @param {string} fromProvider - Source provider
 * @param {string} toProvider - Target provider
 * @param {object} options - Migration options
 * @returns {Promise<object>} Migration result
 */
export async function migrateStorageProvider(fromProvider, toProvider, options = {}) {
  return await storageMigration.migrateImages(fromProvider, toProvider, options)
}
