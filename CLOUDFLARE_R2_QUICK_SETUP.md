# 🚀 Quick Cloudflare R2 Setup Guide

Your images are failing to load because Cloudflare R2 is not properly configured. Here's how to fix it:

## 🔍 Current Issue

Your posts data contains placeholder R2 URLs like:
```
https://blog-images.your-account.r2.cloudflarestorage.com/blog-images/1753943547780-fvs4pqwlnwb.jpg
```

These URLs won't work because `your-account` is a placeholder, not your real Cloudflare account.

## ⚡ Quick Fix (5 minutes)

### Step 1: Get Your Cloudflare Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Your **Account ID** is shown in the right sidebar
3. Copy it (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Create R2 Bucket (if not exists)
1. In Cloudflare Dashboard, go to **R2 Object Storage**
2. Create a bucket named `blog-images` (or use existing)
3. Make sure it's configured for **public access**

### Step 3: Set Up Public Access
Choose **Option A** (easier) or **Option B** (custom domain):

#### Option A: Use R2.dev Domain (Recommended)
1. In your R2 bucket settings, enable **Public Access**
2. Your public URL will be: `https://pub-YOUR_ACCOUNT_ID.r2.dev/blog-images`

#### Option B: Custom Domain (Advanced)
1. Set up a custom domain like `images.yourdomain.com`
2. Point it to your R2 bucket
3. Your public URL will be: `https://images.yourdomain.com`

### Step 4: Update Your .env File
Replace the placeholder in your `.env` file:

```env
# Replace YOUR_ACCOUNT_ID with your actual Account ID
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev/blog-images

# Example:
# VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.r2.dev/blog-images
```

### Step 5: Test the Fix
1. Save your `.env` file
2. Restart your development server: `npm run dev`
3. Check your home page - images should now load!
4. Look at the debug panel (top-right) - it should show "✅ R2 Configured: Yes"

## 🔧 Troubleshooting

### Images Still Not Loading?
1. **Check browser console** for error messages
2. **Verify bucket permissions** - make sure it's public
3. **Test a direct URL** - try accessing an image URL directly in browser
4. **Check the debug panel** - it will show exactly what's happening

### Debug Panel Shows "R2 not configured"?
- Make sure you restarted your dev server after updating `.env`
- Verify the URL doesn't contain `your_account_id` placeholder
- Check that `VITE_CLOUDFLARE_R2_PUBLIC_URL` is set (note the `VITE_` prefix)

### Need to Upload New Images?
Your existing upload system should work once R2 is configured. The `ImageUploader` component will use the R2 credentials to upload new images.

## 📝 Example Working Configuration

```env
# Working example (replace with your values):
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.r2.dev/blog-images
CLOUDFLARE_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CLOUDFLARE_R2_BUCKET_NAME=blog-images
```

## ✅ Success Indicators

When properly configured, you should see:
- ✅ Images loading on your home page
- ✅ Debug panel shows "R2 Configured: Yes"
- ✅ Console shows "Image loaded successfully" messages
- ✅ No 404 errors in Network tab

Need help? The debug panel will show you exactly what's happening with your image URLs!
