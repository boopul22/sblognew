# 🔧 Vercel R2 API Troubleshooting Guide

## 🚨 Problem: R2 Works Locally but Not on Vercel

**Symptoms:**
- ✅ Images load fine with `VITE_STORAGE_PROVIDER=supabase`
- ✅ R2 works perfectly in local development
- ❌ R2 fails on Vercel deployment
- ❌ API calls to `/api/r2/*` endpoints return errors

## 🔍 Diagnostic Steps

### Step 1: Test the Debug Endpoint

After deployment, visit: `https://your-project.vercel.app/api/debug`

This will show:
- ✅ Environment variables status
- ✅ AWS SDK availability
- ✅ Node.js version
- ✅ S3 Client creation status

### Step 2: Test R2 Health Endpoint

Visit: `https://your-project.vercel.app/api/r2/health`

Expected response:
```json
{
  "success": true,
  "message": "R2 API is available",
  "configured": true,
  "bucket": "blog-images"
}
```

### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Click on any R2 function (e.g., `api/r2/health.js`)
4. Check the **Invocations** and **Logs**

## 🛠️ Common Fixes

### Fix 1: Environment Variables Not Set

**Problem**: Environment variables missing in Vercel
**Solution**: 
```bash
# Check if variables are set
vercel env ls

# Add missing variables
vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID
vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY
# ... add all R2 variables
```

### Fix 2: AWS SDK Import Issues

**Problem**: ES6 imports not working in Vercel functions
**Solution**: Already fixed in our API routes using dynamic imports

### Fix 3: Function Timeout

**Problem**: Functions timing out
**Solution**: Added `maxDuration: 30` in `vercel.json`

### Fix 4: Missing Dependencies

**Problem**: AWS SDK not installed
**Solution**: Dependencies are in `package.json`, but verify:
```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.857.0",
    "@aws-sdk/s3-request-presigner": "^3.857.0"
  }
}
```

## 🔄 Quick Fix: Use Supabase for Now

If R2 continues to fail on Vercel, use this configuration:

```env
VITE_STORAGE_PROVIDER=supabase
```

This will:
- ✅ Display all existing images (they're in Supabase)
- ✅ Use Supabase for new uploads
- ✅ Work reliably on Vercel
- ✅ No API routes needed

## 🧪 Testing R2 Configuration

### Test 1: Environment Variables
```bash
curl https://your-project.vercel.app/api/debug
```

### Test 2: R2 Health Check
```bash
curl https://your-project.vercel.app/api/r2/health
```

### Test 3: Presigned URL Generation
```bash
curl -X POST https://your-project.vercel.app/api/r2/presigned-upload \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.jpg","contentType":"image/jpeg"}'
```

## 🔧 Advanced Debugging

### Check Function Logs
```bash
# View real-time logs
vercel logs --follow

# View specific function logs
vercel logs --function=api/r2/health
```

### Test Locally vs Production
```bash
# Local test (should work)
curl http://localhost:3001/api/r2/health

# Production test (might fail)
curl https://your-project.vercel.app/api/r2/health
```

## 🎯 Recommended Solution

**For immediate deployment success:**

1. **Use Supabase storage** (your images are already there):
   ```env
   VITE_STORAGE_PROVIDER=supabase
   ```

2. **Deploy and verify** everything works

3. **Then debug R2** using the tools above

4. **Switch to R2** once it's working

## 🚀 Environment Variables for Supabase (Guaranteed to Work)

```env
VITE_SUPABASE_URL=https://ktxhnxmdbfkswmkikgum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGhueG1kYmZrc3dta2lrZ3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjE5OTksImV4cCI6MjA2OTUzNzk5OX0.5uWgEIlaGqHQupdBEsu76kzPDN3vzq4UFEknmKSpmHg
NODE_ENV=production
VITE_STORAGE_PROVIDER=supabase
```

## 🔍 If R2 Still Doesn't Work

The issue might be:
1. **Vercel region restrictions** - Some regions have limited AWS SDK support
2. **Cold start issues** - First function call might timeout
3. **Memory limits** - AWS SDK might need more memory
4. **Network restrictions** - Vercel might block certain external APIs

**Workaround**: Use Supabase storage, which is proven to work reliably on Vercel.

## 📞 Need Help?

1. Check `/api/debug` endpoint first
2. Review Vercel function logs
3. Test with Supabase storage as fallback
4. Share debug endpoint output for further assistance
