# Supabase Storage Setup Guide

## ✅ Migration Complete: Cloudflare R2 → Supabase Storage

Your blog application has been successfully migrated from Cloudflare R2 to Supabase Storage for image uploads and storage.

## 🗄️ What Was Changed

### 1. **Removed Cloudflare R2**
- ❌ Removed all R2 configuration from environment files
- ❌ Deleted R2-specific utility files and API endpoints
- ❌ Removed AWS SDK dependencies
- ✅ Now using Supabase Storage exclusively

### 2. **Updated Code**
- ✅ Created `src/lib/supabaseStorage.js` - Supabase storage utility
- ✅ Updated `ImageUploader.jsx` to use Supabase storage
- ✅ Simplified content utilities to work directly with Supabase URLs
- ✅ Updated image optimization components

## 🔧 Current Configuration

### Supabase Storage Bucket
- **Bucket Name**: `images`
- **Public Access**: Enabled
- **Allowed File Types**: JPEG, PNG, WebP, GIF, SVG, BMP, TIFF
- **File Size Limit**: 50MB

### Environment Variables Required
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For migration scripts (keep private!)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Architecture

### Upload Flow
1. **Frontend**: User selects image in `ImageUploader` component
2. **Compression**: Image is compressed using `imageUtils`
3. **Supabase Upload**: File is uploaded to Supabase storage bucket
4. **Database**: Image URL and metadata saved to `attachments` table
5. **Display**: Image served from Supabase CDN with optimization

### File Structure
```
images/
├── 1753938412107-5ci1zp2wm8.jpg
├── 1753938523456-abc123def4.png
└── 1753938634789-xyz789ghi0.webp
```

### URL Structure
```
Public URL: https://your-project.supabase.co/storage/v1/object/public/images/filename.jpg
Optimized: https://your-project.supabase.co/storage/v1/object/public/images/filename.jpg?width=800&quality=80&format=webp
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Enabled on storage bucket
- **Public Read Access**: Images are publicly readable
- **Authenticated Upload**: Only authenticated users can upload
- **File Type Validation**: Server-side MIME type checking
- **Size Limits**: Configurable file size restrictions

## 🚀 Features

### Image Optimization
- **Automatic Compression**: Images compressed before upload
- **Multiple Formats**: Support for WebP, JPEG, PNG
- **Responsive Images**: Automatic srcSet generation
- **Lazy Loading**: Built-in lazy loading support

### Upload Features
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Comprehensive error messages
- **File Validation**: Type and size validation
- **Unique Filenames**: Timestamp-based naming

## 🧪 Testing

### 1. **Test Image Upload**
```bash
npm run dev
# Navigate to admin panel and try uploading an image
```

### 2. **Verify Storage Bucket**
- Go to Supabase Dashboard → Storage
- Check that images bucket exists and is public
- Verify uploaded images appear in the bucket

### 3. **Test Image Display**
- Upload an image through admin panel
- Check that it displays correctly on the frontend
- Verify image optimization parameters work

## 🔧 Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check Supabase credentials in `.env.local`
   - Verify storage bucket exists and is public
   - Check file size and type restrictions

2. **Images Don't Display**
   - Verify bucket public access is enabled
   - Check image URLs in browser directly
   - Ensure RLS policies allow public read access

3. **Optimization Not Working**
   - Supabase storage supports query parameters for optimization
   - Check that URLs include `?width=X&quality=Y&format=webp`

### Storage Policies

Ensure these policies exist in Supabase:

```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## 📊 Benefits of Supabase Storage

- **Integrated**: Part of your existing Supabase setup
- **Cost-Effective**: No additional service costs
- **Optimized**: Built-in image optimization
- **Secure**: Integrated with Supabase auth and RLS
- **Simple**: No complex configuration needed
- **Reliable**: Enterprise-grade infrastructure

## 🔄 Migration Notes

- All existing images should continue to work
- New uploads will use Supabase storage
- No changes needed to existing image URLs
- Image optimization works automatically
- Upload functionality remains the same for users
