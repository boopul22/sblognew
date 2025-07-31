# Storage Abstraction Usage Examples

## 🎯 Basic Usage Examples

### 1. Image Upload Component

```jsx
import React, { useState } from 'react'
import { uploadImage } from '../lib/storage'
import toast from 'react-hot-toast'

function ImageUploadExample() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const result = await uploadImage(file, {
        onProgress: (progressValue) => {
          setProgress(progressValue)
        },
        maxSize: 5 * 1024 * 1024 // 5MB limit
      })

      if (result.success) {
        setImageUrl(result.url)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      {uploading && (
        <div>
          <div>Uploading... {progress}%</div>
          <progress value={progress} max="100" />
        </div>
      )}
      
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '200px' }} />
          <p>Image URL: {imageUrl}</p>
        </div>
      )}
    </div>
  )
}
```

### 2. Image Gallery with Delete

```jsx
import React, { useState, useEffect } from 'react'
import { listImages, deleteImage, getImageUrl } from '../lib/storage'
import toast from 'react-hot-toast'

function ImageGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    try {
      const result = await listImages({ limit: 50 })
      if (result.success) {
        setImages(result.files || [])
      } else {
        toast.error('Failed to load images: ' + result.error)
      }
    } catch (error) {
      toast.error('Error loading images: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (filename) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const result = await deleteImage(filename)
      if (result.success) {
        setImages(images.filter(img => img.name !== filename))
        toast.success('Image deleted successfully')
      } else {
        toast.error('Delete failed: ' + result.error)
      }
    } catch (error) {
      toast.error('Delete error: ' + error.message)
    }
  }

  if (loading) return <div>Loading images...</div>

  return (
    <div className="image-gallery">
      {images.map((image) => (
        <div key={image.name} className="image-item">
          <img 
            src={getImageUrl(image.name)} 
            alt={image.name}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <div className="image-info">
            <p>{image.name}</p>
            <p>{Math.round(image.size / 1024)} KB</p>
            <button onClick={() => handleDelete(image.name)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 3. Storage Provider Switcher

```jsx
import React, { useState, useEffect } from 'react'
import { getStorageStatus, STORAGE_PROVIDERS } from '../lib/storage'
import { storageConfig } from '../lib/storage/StorageConfig'

function StorageProviderSwitcher() {
  const [status, setStatus] = useState(null)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    const currentStatus = getStorageStatus()
    setStatus(currentStatus)
  }

  const switchProvider = async (providerName) => {
    setSwitching(true)
    try {
      const success = storageConfig.switchProvider(providerName)
      if (success) {
        refreshStatus()
        alert(`Switched to ${providerName}`)
      } else {
        alert(`Failed to switch to ${providerName}`)
      }
    } catch (error) {
      alert('Switch failed: ' + error.message)
    } finally {
      setSwitching(false)
    }
  }

  if (!status) return <div>Loading...</div>

  return (
    <div className="provider-switcher">
      <h3>Storage Provider: {status.current}</h3>
      
      <div className="providers">
        {Object.entries(status.providers).map(([name, info]) => (
          <div key={name} className="provider-option">
            <span className={info.configured ? 'configured' : 'not-configured'}>
              {name} {info.configured ? '✅' : '❌'}
            </span>
            {info.configured && name !== status.current && (
              <button 
                onClick={() => switchProvider(name)}
                disabled={switching}
              >
                Switch to {name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🔄 Migration Examples

### 1. Migrate All Images

```javascript
import { migrateStorageProvider } from '../lib/storage/StorageMigration'

async function migrateAllImages() {
  console.log('Starting migration from Supabase to Cloudflare R2...')
  
  const result = await migrateStorageProvider('supabase', 'cloudflare-r2', {
    batchSize: 5, // Process 5 images at a time
    dryRun: false, // Set to true for testing
    onProgress: (progress) => {
      console.log(`Progress: ${progress.migrated}/${progress.total} (${progress.progress}%)`)
      if (progress.errors > 0) {
        console.warn(`Errors so far: ${progress.errors}`)
      }
    }
  })

  if (result.success) {
    console.log(`✅ Migration completed successfully!`)
    console.log(`Migrated: ${result.migratedCount}/${result.totalImages}`)
    if (result.errorCount > 0) {
      console.log(`Errors: ${result.errorCount}`)
      console.log('Failed images:', result.errors)
    }
  } else {
    console.error('❌ Migration failed:', result.error)
  }

  return result
}
```

### 2. Selective Migration

```javascript
import { StorageMigration } from '../lib/storage/StorageMigration'

async function migrateRecentImages() {
  const migration = new StorageMigration()
  
  // Only migrate images from the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const result = await migration.migrateImages('supabase', 'cloudflare-r2', {
    filter: (imageInfo) => {
      const imageDate = new Date(imageInfo.created_at || imageInfo.lastModified)
      return imageDate > thirtyDaysAgo
    },
    batchSize: 3,
    onProgress: (progress) => {
      console.log(`Migrating recent images: ${progress.progress}%`)
    }
  })

  console.log('Migration result:', result)
  
  // Export migration log
  const logJson = migration.exportMigrationLog()
  console.log('Migration log:', logJson)
}
```

## 🧪 Testing Examples

### 1. Validate Storage Setup

```javascript
import { validateStorageSetup } from '../lib/storage/StorageValidator'

async function testStorageSetup() {
  console.log('🧪 Running storage validation tests...')
  
  const results = await validateStorageSetup({
    includeUploadTest: true, // Test actual upload/delete
    testImageUrl: 'https://example.com/test-image.jpg'
  })

  console.log(`Test Results: ${results.passedTests}/${results.totalTests} passed`)
  
  if (!results.success) {
    console.log('❌ Some tests failed:')
    results.results.forEach(test => {
      if (!test.passed) {
        console.log(`- ${test.name}: ${test.message}`)
        if (test.error) console.log(`  Error: ${test.error}`)
      }
    })
  } else {
    console.log('✅ All tests passed!')
  }

  return results
}
```

### 2. Custom Validation

```javascript
import { StorageValidator } from '../lib/storage/StorageValidator'

async function customStorageTest() {
  const validator = new StorageValidator()
  
  // Run individual tests
  const configTest = await validator.testConfiguration()
  const providerTest = await validator.testProviderAvailability()
  
  console.log('Configuration test:', configTest.passed ? '✅' : '❌')
  console.log('Provider test:', providerTest.passed ? '✅' : '❌')
  
  if (!configTest.passed) {
    console.log('Config issues:', configTest.details)
  }
  
  if (!providerTest.passed) {
    console.log('Provider issues:', providerTest.details)
  }
}
```

## 🔧 Advanced Usage

### 1. Custom Storage Provider

```javascript
import { StorageProvider } from '../lib/storage/StorageProvider'

class CustomStorageProvider extends StorageProvider {
  constructor(config) {
    super(config)
    this.apiEndpoint = config.apiEndpoint
    this.apiKey = config.apiKey
  }

  async upload(file, options = {}) {
    try {
      const validation = this.validateFile(file, options)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      const filename = this.generateUniqueFilename(file.name)
      
      // Custom upload logic here
      const formData = new FormData()
      formData.append('file', file)
      formData.append('filename', filename)

      const response = await fetch(`${this.apiEndpoint}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        success: true,
        url: result.url,
        filename: filename,
        provider: 'custom'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'custom'
      }
    }
  }

  async delete(fileIdentifier) {
    // Implement delete logic
  }

  getPublicUrl(fileIdentifier) {
    return `${this.apiEndpoint}/files/${fileIdentifier}`
  }

  isConfigured() {
    return !!(this.apiEndpoint && this.apiKey)
  }

  getProviderName() {
    return 'custom'
  }
}

// Register custom provider
import { storageConfig } from '../lib/storage/StorageConfig'

const customProvider = new CustomStorageProvider({
  apiEndpoint: 'https://api.example.com',
  apiKey: 'your-api-key'
})

storageConfig.providers.set('custom', customProvider)
```

### 2. Provider-Specific Operations

```javascript
import { storageConfig } from '../lib/storage/StorageConfig'

async function providerSpecificOperation() {
  const currentProvider = storageConfig.getCurrentProvider()
  
  if (currentProvider.getProviderName() === 'supabase') {
    // Supabase-specific operation
    console.log('Using Supabase storage')
    // Access Supabase-specific methods if needed
  } else if (currentProvider.getProviderName() === 'cloudflare-r2') {
    // R2-specific operation
    console.log('Using Cloudflare R2 storage')
    // Access R2-specific methods if needed
  }
}
```

## 🚨 Error Handling Examples

### 1. Comprehensive Error Handling

```javascript
import { uploadImage, getCurrentProviderName } from '../lib/storage'

async function robustImageUpload(file) {
  try {
    // Check if storage is available
    const providerName = getCurrentProviderName()
    if (!providerName) {
      throw new Error('No storage provider is configured')
    }

    console.log(`Using ${providerName} for upload`)

    const result = await uploadImage(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`)
      }
    })

    if (result.success) {
      console.log('✅ Upload successful:', result.url)
      return result
    } else {
      // Handle specific error cases
      if (result.error.includes('size')) {
        throw new Error('File is too large. Please choose a smaller image.')
      } else if (result.error.includes('type')) {
        throw new Error('Invalid file type. Please upload an image file.')
      } else {
        throw new Error(`Upload failed: ${result.error}`)
      }
    }
  } catch (error) {
    console.error('❌ Upload error:', error.message)
    
    // Log additional context
    console.error('Provider:', getCurrentProviderName())
    console.error('File info:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    throw error
  }
}
```

### 2. Fallback Strategy

```javascript
import { storageConfig } from '../lib/storage/StorageConfig'
import { uploadImage } from '../lib/storage'

async function uploadWithFallback(file) {
  const status = storageConfig.getConfigurationStatus()
  const availableProviders = Object.keys(status.providers)
    .filter(name => status.providers[name].configured)

  for (const providerName of availableProviders) {
    try {
      // Switch to this provider
      const switched = storageConfig.switchProvider(providerName)
      if (!switched) continue

      console.log(`Trying upload with ${providerName}...`)
      
      const result = await uploadImage(file)
      
      if (result.success) {
        console.log(`✅ Upload successful with ${providerName}`)
        return result
      } else {
        console.log(`❌ Upload failed with ${providerName}: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ Error with ${providerName}: ${error.message}`)
    }
  }

  throw new Error('Upload failed with all available providers')
}
```

These examples demonstrate the flexibility and power of the storage abstraction layer while maintaining simplicity for common use cases.
