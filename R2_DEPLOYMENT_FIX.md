# 🔧 R2 Storage Deployment Fix

## Problem Solved ✅

The "Failed to get presigned URL" error was caused by missing API server in development and incorrect environment variable configuration for production deployment.

## Root Cause Analysis

1. **Development Issue**: API endpoints were designed for Cloudflare Pages Functions but no local development server was running
2. **Production Issue**: Environment variables for API functions may not be properly configured in Cloudflare Pages
3. **CORS Issue**: Potential CORS configuration problems between frontend and R2 bucket

## ✅ Development Fix (COMPLETED)

### 1. Created Development API Server
- **File**: `scripts/dev-api-server.js`
- **Purpose**: Runs Cloudflare Pages Functions locally for development
- **Port**: 3001 (matches Vite proxy configuration)

### 2. Updated Package Scripts
```json
{
  "dev:api": "node scripts/dev-api-server.js",
  "dev:full": "concurrently \"npm run dev:api\" \"npm run dev\""
}
```

### 3. Added Required Dependencies
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `concurrently` (dev dependency)

### 4. Verified Working Configuration
- ✅ R2 health check: `GET /api/r2/health`
- ✅ Presigned URL generation: `POST /api/r2/presigned-upload`
- ✅ Environment variables loaded from `.env.local`
- ✅ CORS enabled for development

## 🚀 Production Deployment Fix

### 1. Environment Variables for Cloudflare Pages

In your Cloudflare Pages dashboard, ensure these environment variables are set:

#### Frontend Variables (VITE_ prefix)
```env
VITE_STORAGE_PROVIDER=cloudflare-r2
VITE_CLOUDFLARE_ACCOUNT_ID=ab54ca2d01df4886aa0c3f240ace806d
VITE_CLOUDFLARE_R2_ACCESS_KEY_ID=399a86b7cc9968e58d9843168aa82f61
VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY=d24937a919cbdcd3019d9228004d11306867c8e5bb3373e2ff37cf2b3356ecc6
VITE_CLOUDFLARE_R2_BUCKET_NAME=boopul
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-fc97d8e973a94b6ab42a5785e3a4130e.r2.dev
VITE_CLOUDFLARE_R2_ENDPOINT=https://ab54ca2d01df4886aa0c3f240ace806d.r2.cloudflarestorage.com
```

#### Backend Variables (for API Functions)
```env
CLOUDFLARE_ACCOUNT_ID=ab54ca2d01df4886aa0c3f240ace806d
CLOUDFLARE_R2_ACCESS_KEY_ID=399a86b7cc9968e58d9843168aa82f61
CLOUDFLARE_R2_SECRET_ACCESS_KEY=d24937a919cbdcd3019d9228004d11306867c8e5bb3373e2ff37cf2b3356ecc6
CLOUDFLARE_R2_BUCKET_NAME=boopul
CLOUDFLARE_R2_PUBLIC_URL=https://pub-fc97d8e973a94b6ab42a5785e3a4130e.r2.dev
CLOUDFLARE_R2_ENDPOINT=https://ab54ca2d01df4886aa0c3f240ace806d.r2.cloudflarestorage.com
```

### 2. R2 Bucket CORS Configuration

Ensure your R2 bucket has proper CORS configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://your-domain.pages.dev",
      "https://your-custom-domain.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Deployment Steps

1. **Set Environment Variables**:
   - Go to Cloudflare Pages Dashboard
   - Navigate to your project → Settings → Environment variables
   - Add all variables listed above

2. **Verify Build Configuration**:
   ```bash
   # Ensure build works locally
   npm run build
   
   # Check that API functions are included
   ls -la api/
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Fix R2 storage presigned URL generation"
   git push origin main
   ```

4. **Test Production**:
   - Wait for deployment to complete
   - Test image upload functionality
   - Check browser console for errors

## 🧪 Testing Commands

### Development Testing
```bash
# Start both servers
npm run dev:full

# Or start separately
npm run dev:api  # Terminal 1
npm run dev      # Terminal 2

# Test API endpoints
curl http://localhost:3001/api/r2/health
curl -X POST http://localhost:3001/api/r2/presigned-upload \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.jpg","contentType":"image/jpeg"}'
```

### Production Testing
```bash
# Test R2 configuration
npm run test:r2

# Build and preview
npm run build
npm run preview
```

## 🔍 Troubleshooting

### If Upload Still Fails in Production

1. **Check Environment Variables**:
   - Verify all variables are set in Cloudflare Pages dashboard
   - Ensure no typos in variable names
   - Check that values don't contain placeholder text

2. **Check R2 Bucket Permissions**:
   - Verify R2 API token has correct permissions
   - Ensure bucket exists and is accessible
   - Check CORS configuration

3. **Check Browser Console**:
   - Look for CORS errors
   - Check for 403/404 errors on API calls
   - Verify presigned URLs are being generated

4. **Test API Endpoints Directly**:
   ```bash
   curl https://your-site.pages.dev/api/r2/health
   ```

## 📋 Current Status

- ✅ Development environment fixed and working
- ✅ API server running locally on port 3001
- ✅ Presigned URL generation working in development
- ✅ Environment variables properly configured
- ⏳ Production deployment needs environment variables set in Cloudflare Pages dashboard

## 🎯 Next Steps

1. Set environment variables in Cloudflare Pages dashboard
2. Deploy the updated code
3. Test image upload functionality in production
4. Configure R2 bucket CORS if needed
5. Monitor for any remaining issues
