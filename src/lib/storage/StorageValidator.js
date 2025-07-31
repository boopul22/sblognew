/**
 * Storage Validation Utilities
 * Validates storage configuration and tests functionality
 */

import { 
  getCurrentStorageProvider, 
  getStorageStatus, 
  validateStorage,
  uploadImage,
  deleteImage,
  getImageUrl,
  listImages,
  getImageMetadata
} from './index.js'

export class StorageValidator {
  constructor() {
    this.testResults = []
  }

  /**
   * Run comprehensive storage validation tests
   * @param {object} options - Test options
   * @returns {Promise<object>} Test results
   */
  async runValidationTests(options = {}) {
    const {
      includeUploadTest = false, // Set to true to test actual upload (creates test file)
      testImageUrl = null // URL of existing image to test with
    } = options

    this.testResults = []
    let passedTests = 0
    let totalTests = 0

    console.log('🧪 Starting storage validation tests...')

    // Test 1: Configuration validation
    totalTests++
    const configTest = await this.testConfiguration()
    if (configTest.passed) passedTests++
    this.testResults.push(configTest)

    // Test 2: Provider availability
    totalTests++
    const providerTest = await this.testProviderAvailability()
    if (providerTest.passed) passedTests++
    this.testResults.push(providerTest)

    // Test 3: URL generation
    totalTests++
    const urlTest = await this.testUrlGeneration()
    if (urlTest.passed) passedTests++
    this.testResults.push(urlTest)

    // Test 4: List functionality
    totalTests++
    const listTest = await this.testListFunctionality()
    if (listTest.passed) passedTests++
    this.testResults.push(listTest)

    // Test 5: Metadata functionality (if test image provided)
    if (testImageUrl) {
      totalTests++
      const metadataTest = await this.testMetadataFunctionality(testImageUrl)
      if (metadataTest.passed) passedTests++
      this.testResults.push(metadataTest)
    }

    // Test 6: Upload/Delete functionality (if enabled)
    if (includeUploadTest) {
      totalTests++
      const uploadTest = await this.testUploadDeleteFunctionality()
      if (uploadTest.passed) passedTests++
      this.testResults.push(uploadTest)
    }

    const overallResult = {
      success: passedTests === totalTests,
      passedTests,
      totalTests,
      passRate: Math.round((passedTests / totalTests) * 100),
      results: this.testResults,
      timestamp: new Date().toISOString()
    }

    console.log(`✅ Validation complete: ${passedTests}/${totalTests} tests passed (${overallResult.passRate}%)`)
    
    return overallResult
  }

  /**
   * Test storage configuration
   */
  async testConfiguration() {
    try {
      const status = getStorageStatus()
      const validation = validateStorage()

      const passed = validation.valid && status.current !== null

      return {
        name: 'Configuration Test',
        passed,
        details: {
          currentProvider: status.current,
          configuredProviders: Object.keys(status.providers).filter(
            p => status.providers[p].configured
          ),
          validationErrors: validation.errors,
          validationWarnings: validation.warnings
        },
        message: passed ? 'Storage configuration is valid' : 'Storage configuration has issues'
      }
    } catch (error) {
      return {
        name: 'Configuration Test',
        passed: false,
        error: error.message,
        message: 'Configuration test failed'
      }
    }
  }

  /**
   * Test provider availability
   */
  async testProviderAvailability() {
    try {
      const provider = getCurrentStorageProvider()
      const passed = provider !== null && provider.isConfigured()

      return {
        name: 'Provider Availability Test',
        passed,
        details: {
          providerName: provider ? provider.getProviderName() : 'none',
          isConfigured: provider ? provider.isConfigured() : false
        },
        message: passed ? 'Storage provider is available and configured' : 'Storage provider is not available'
      }
    } catch (error) {
      return {
        name: 'Provider Availability Test',
        passed: false,
        error: error.message,
        message: 'Provider availability test failed'
      }
    }
  }

  /**
   * Test URL generation
   */
  async testUrlGeneration() {
    try {
      const testFilename = 'test-image.jpg'
      const url = getImageUrl(testFilename)
      
      const passed = typeof url === 'string' && url.length > 0 && url !== testFilename

      return {
        name: 'URL Generation Test',
        passed,
        details: {
          testFilename,
          generatedUrl: url,
          urlLength: url ? url.length : 0
        },
        message: passed ? 'URL generation works correctly' : 'URL generation failed'
      }
    } catch (error) {
      return {
        name: 'URL Generation Test',
        passed: false,
        error: error.message,
        message: 'URL generation test failed'
      }
    }
  }

  /**
   * Test list functionality
   */
  async testListFunctionality() {
    try {
      const result = await listImages({ limit: 5 })
      const passed = result.success && Array.isArray(result.files)

      return {
        name: 'List Functionality Test',
        passed,
        details: {
          success: result.success,
          fileCount: result.files ? result.files.length : 0,
          error: result.error
        },
        message: passed ? 'List functionality works correctly' : 'List functionality failed'
      }
    } catch (error) {
      return {
        name: 'List Functionality Test',
        passed: false,
        error: error.message,
        message: 'List functionality test failed'
      }
    }
  }

  /**
   * Test metadata functionality
   */
  async testMetadataFunctionality(testImageUrl) {
    try {
      const result = await getImageMetadata(testImageUrl)
      const passed = result.success && result.metadata !== null

      return {
        name: 'Metadata Functionality Test',
        passed,
        details: {
          testImageUrl,
          success: result.success,
          hasMetadata: result.metadata !== null,
          error: result.error
        },
        message: passed ? 'Metadata functionality works correctly' : 'Metadata functionality failed'
      }
    } catch (error) {
      return {
        name: 'Metadata Functionality Test',
        passed: false,
        error: error.message,
        message: 'Metadata functionality test failed'
      }
    }
  }

  /**
   * Test upload and delete functionality
   */
  async testUploadDeleteFunctionality() {
    try {
      // Create a small test image file
      const testImageData = this.createTestImageBlob()
      const testFile = new File([testImageData], 'storage-test.png', { type: 'image/png' })

      // Test upload
      const uploadResult = await uploadImage(testFile)
      
      if (!uploadResult.success) {
        return {
          name: 'Upload/Delete Functionality Test',
          passed: false,
          details: {
            uploadError: uploadResult.error,
            phase: 'upload'
          },
          message: 'Upload test failed'
        }
      }

      // Test delete
      const deleteResult = await deleteImage(uploadResult.filename || uploadResult.url)
      
      const passed = uploadResult.success && deleteResult.success

      return {
        name: 'Upload/Delete Functionality Test',
        passed,
        details: {
          uploadSuccess: uploadResult.success,
          deleteSuccess: deleteResult.success,
          uploadedUrl: uploadResult.url,
          uploadError: uploadResult.error,
          deleteError: deleteResult.error
        },
        message: passed ? 'Upload/Delete functionality works correctly' : 'Upload/Delete functionality failed'
      }
    } catch (error) {
      return {
        name: 'Upload/Delete Functionality Test',
        passed: false,
        error: error.message,
        message: 'Upload/Delete functionality test failed'
      }
    }
  }

  /**
   * Create a small test image blob
   */
  createTestImageBlob() {
    // Create a simple 1x1 PNG image
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(0, 0, 1, 1)
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })
  }

  /**
   * Get test results
   */
  getTestResults() {
    return this.testResults
  }

  /**
   * Export test results as JSON
   */
  exportTestResults() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.testResults
    }, null, 2)
  }
}

// Export singleton instance
export const storageValidator = new StorageValidator()

/**
 * Quick validation function
 * @param {object} options - Test options
 * @returns {Promise<object>} Test results
 */
export async function validateStorageSetup(options = {}) {
  return await storageValidator.runValidationTests(options)
}
