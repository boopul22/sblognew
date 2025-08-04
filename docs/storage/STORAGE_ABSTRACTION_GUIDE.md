# Storage Abstraction Layer Guide

## 🎯 Overview

This guide covers the new modular storage abstraction layer that allows easy switching between different image storage providers while maintaining backward compatibility with existing code.

## 🏗️ Architecture

### Core Components

1. **StorageProvider** - Abstract base class defining the storage interface
2. **SupabaseStorageProvider** - Supabase Storage implementation
3. **CloudflareR2StorageProvider** - Cloudflare R2 implementation
4. **StorageConfig** - Configuration management and provider selection
5. **StorageMigration** - Utilities for migrating between providers
6. **StorageValidator** - Testing and validation utilities

### File Structure

```
src/lib/storage/
├── index.js                      # Main storage interface
├── StorageProvider.js             # Abstract base class
├── SupabaseStorageProvider.js     # Supabase implementation
├── CloudflareR2StorageProvider.js # Cloudflare R2 implementation
├── StorageConfig.js               # Configuration management
├── StorageMigration.js            # Migration utilities
├── StorageValidator.js            # Validation utilities
└── r2Utils.js                     # R2-specific utilities

api/r2/
├── presigned-upload.js            # R2 presigned URL generation
├── delete.js                      # R2 file deletion
├── list.js                        # R2 file listing
├── metadata.js                    # R2 file metadata
└── health.js                      # R2 health check
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { uploadImage, deleteImage, getImageUrl } from '../lib/storage'

// Upload an image
const result = await uploadImage(file, {
  onProgress: (progress) => console.log(`${progress}%`),
  maxSize: 5 * 1024 * 1024 // 5MB
})

if (result.success) {
  console.log('Image uploaded:', result.url)
} else {
  console.error('Upload failed:', result.error)
}

// Get public URL
const publicUrl = getImageUrl('my-image.jpg')

// Delete an image
const deleteResult = await deleteImage('my-image.jpg')
```

### Configuration

Set your preferred storage provider via environment variables:

```env
# Choose your storage provider
VITE_STORAGE_PROVIDER=supabase  # or 'cloudflare-r2'

# Supabase configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Cloudflare R2 configuration (optional)
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
VITE_CLOUDFLARE_R2_BUCKET_NAME=blog-images
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-account.r2.dev/blog-images
VITE_CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
```

## 📋 Provider Setup

### Supabase Storage (Default)

1. **Create Storage Bucket**:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
   ```

2. **Set Environment Variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_STORAGE_PROVIDER=supabase
   ```

3. **Features**:
   - ✅ Built-in image optimization
   - ✅ Automatic WebP conversion
   - ✅ CDN delivery
   - ✅ Direct client uploads

### Cloudflare R2

1. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Create bucket named `blog-images`
   - Enable public access

2. **Get API Credentials**:
   - Go to R2 → Manage R2 API tokens
   - Create API token with R2 permissions

3. **Set Environment Variables**:
   ```env
   VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
   VITE_CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
   VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
   VITE_CLOUDFLARE_R2_BUCKET_NAME=blog-images
   VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-account.r2.dev/blog-images
   VITE_CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
   VITE_STORAGE_PROVIDER=cloudflare-r2
   ```

4. **Backend API Setup**:
   The R2 provider requires backend APIs for security. Make sure these endpoints are available:
   - `/api/r2/presigned-upload` - Generate presigned upload URLs
   - `/api/r2/delete` - Delete files
   - `/api/r2/list` - List files
   - `/api/r2/metadata` - Get file metadata
   - `/api/r2/health` - Health check

5. **Features**:
   - ✅ S3-compatible API
   - ✅ Global CDN
   - ✅ Cost-effective storage
   - ⚠️ No built-in image optimization

## 🔄 Switching Providers

### Method 1: Environment Variable

Change the `VITE_STORAGE_PROVIDER` environment variable and restart your application:

```env
# Switch to Cloudflare R2
VITE_STORAGE_PROVIDER=cloudflare-r2

# Switch back to Supabase
VITE_STORAGE_PROVIDER=supabase
```

### Method 2: Runtime Switching

```javascript
import { storageConfig } from '../lib/storage/StorageConfig'

// Switch to a different provider
const success = storageConfig.switchProvider('cloudflare-r2')
if (success) {
  console.log('Switched to Cloudflare R2')
} else {
  console.log('Failed to switch provider')
}
```

### Method 3: Migration

Use the migration utility to move existing images:

```javascript
import { migrateStorageProvider } from '../lib/storage/StorageMigration'

const result = await migrateStorageProvider('supabase', 'cloudflare-r2', {
  batchSize: 10,
  dryRun: true, // Set to false for actual migration
  onProgress: (progress) => {
    console.log(`Migration progress: ${progress.progress}%`)
  }
})

console.log(`Migration completed: ${result.migratedCount}/${result.totalImages}`)
```

## 🧪 Testing & Validation

### Using the Storage Debugger

Add the StorageDebugger component to your admin interface:

```jsx
import StorageDebugger from '../components/admin/StorageDebugger'

function AdminPanel() {
  const [showDebugger, setShowDebugger] = useState(false)

  return (
    <div>
      <button onClick={() => setShowDebugger(!showDebugger)}>
        Toggle Storage Debugger
      </button>
      <StorageDebugger isVisible={showDebugger} />
    </div>
  )
}
```

### Manual Validation

```javascript
import { validateStorageSetup } from '../lib/storage/StorageValidator'

const results = await validateStorageSetup({
  includeUploadTest: false, // Set to true to test actual uploads
  testImageUrl: 'https://example.com/test-image.jpg'
})

console.log(`Tests passed: ${results.passedTests}/${results.totalTests}`)
```

## 🔧 Advanced Configuration

### Custom Provider

Create a custom storage provider by extending the base class:

```javascript
import { StorageProvider } from '../lib/storage/StorageProvider'

export class CustomStorageProvider extends StorageProvider {
  async upload(file, options = {}) {
    // Implement upload logic
  }

  async delete(fileIdentifier) {
    // Implement delete logic
  }

  getPublicUrl(fileIdentifier) {
    // Implement URL generation
  }

  // ... implement other required methods
}
```

### Provider-Specific Options

```javascript
import { SupabaseStorageProvider } from '../lib/storage/SupabaseStorageProvider'

const customSupabaseProvider = new SupabaseStorageProvider({
  bucketName: 'custom-images' // Use different bucket
})
```

## 🔒 Security Considerations

### Supabase Storage
- Uses Row Level Security (RLS) policies
- Anonymous key is safe for client-side use
- Built-in authentication integration

### Cloudflare R2
- Requires backend APIs for security
- Never expose R2 credentials in client code
- Use presigned URLs for uploads
- Implement proper authentication on backend APIs

## 📊 Monitoring & Debugging

### Configuration Status

```javascript
import { getStorageStatus, validateStorage } from '../lib/storage'

const status = getStorageStatus()
console.log('Current provider:', status.current)
console.log('Available providers:', Object.keys(status.providers))

const validation = validateStorage()
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors)
}
```

### Error Handling

All storage operations return a consistent result format:

```javascript
{
  success: boolean,
  url?: string,        // For upload operations
  filename?: string,   // Generated filename
  error?: string,      // Error message if failed
  provider: string     // Provider name
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"No storage provider is configured"**
   - Check environment variables are set correctly
   - Verify provider is properly configured
   - Use StorageDebugger to diagnose

2. **"Provider not available"**
   - Ensure all required environment variables are set
   - Check network connectivity
   - Verify API credentials are valid

3. **Upload failures**
   - Check file size limits
   - Verify file type is supported
   - Check storage bucket permissions

4. **R2 backend API errors**
   - Ensure backend API endpoints are deployed
   - Check R2 credentials in backend environment
   - Verify CORS settings if needed

### Debug Tools

1. **StorageDebugger Component** - Visual debugging interface
2. **StorageValidator** - Automated testing
3. **Browser Console** - Detailed error logging
4. **Network Tab** - Monitor API requests

## 📈 Performance Tips

1. **Image Optimization**:
   - Use Supabase's built-in optimization when possible
   - Implement custom optimization for R2
   - Consider WebP format for better compression

2. **Caching**:
   - Leverage CDN caching
   - Implement client-side caching for metadata
   - Use appropriate cache headers

3. **Batch Operations**:
   - Use migration utilities for bulk operations
   - Implement progress tracking for large uploads
   - Consider rate limiting for API calls

## 🔄 Migration Guide

### From Direct Supabase to Abstraction Layer

The abstraction layer maintains backward compatibility. Existing code using `uploadImageToSupabase` will continue to work without changes.

### Migrating Images Between Providers

1. **Prepare Target Provider**: Ensure target provider is configured
2. **Run Migration**: Use StorageMigration utility
3. **Verify Migration**: Check all images transferred correctly
4. **Update Configuration**: Switch to new provider
5. **Test Application**: Verify everything works correctly

## 📚 API Reference

See the individual provider files for detailed API documentation:
- `StorageProvider.js` - Base interface
- `SupabaseStorageProvider.js` - Supabase implementation
- `CloudflareR2StorageProvider.js` - R2 implementation
