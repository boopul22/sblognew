# Vercel Deployment Guide

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sayari-blog)

## 📋 Required Environment Variables

### Core Application Variables

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

#### Supabase Configuration (Required)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Storage Provider Selection
```env
# Use Supabase for image storage (recommended for Vercel deployment)
VITE_STORAGE_PROVIDER=supabase
```

**Note**: Your existing images are stored in Supabase storage. Using `VITE_STORAGE_PROVIDER=supabase` ensures maximum compatibility and reliability on Vercel.

### Cloudflare R2 Configuration (Optional)

Only required if using `VITE_STORAGE_PROVIDER=cloudflare-r2`:

#### Frontend Variables (Safe for client-side)
```env
VITE_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
VITE_CLOUDFLARE_R2_BUCKET_NAME=blog-images
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev/blog-images
```

#### Serverless Function Variables (Server-side only)
```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=blog-images
CLOUDFLARE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

#### Production Environment
```env
NODE_ENV=production
```

## 🛠️ Deployment Steps

### 1. Prepare Your Repository

1. **Ensure all changes are committed:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify build works locally:**
   ```bash
   npm run build:vercel
   npm run preview
   ```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings (auto-detected)
5. Add environment variables
6. Deploy

### 3. Configure Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add all required variables listed above
4. Set environment to **Production**, **Preview**, and **Development** as needed

### 4. Verify Deployment

After deployment, verify:
- [ ] Site loads without errors
- [ ] All routes work (React Router)
- [ ] API endpoints respond correctly
- [ ] Database connection works
- [ ] Image uploads work (if using R2)
- [ ] Admin functionality works

## 🔧 Build Configuration

The application uses these build settings (configured in `vercel.json`):

- **Build Command**: `npm run build:spa`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: `vite`
- **Node.js Version**: 18.x

## 🌐 API Routes

The following serverless functions are automatically deployed:

- `/api/r2/presigned-upload` - Generate presigned upload URLs
- `/api/r2/delete` - Delete files from R2
- `/api/r2/list` - List files in R2 bucket
- `/api/r2/metadata` - Get file metadata
- `/api/r2/health` - Health check for R2 configuration
- `/api/delete-image` - Delete image endpoint

## 🔒 Security Configuration

The deployment includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- CORS headers for API routes

## 📊 Performance Optimizations

- **Code Splitting**: Automatic chunk splitting for better caching
- **Asset Optimization**: Long-term caching for static assets
- **Compression**: Automatic gzip/brotli compression
- **CDN**: Global edge network delivery

## 🐛 Troubleshooting

### Common Issues

#### 1. Blank Page After Deployment
**Cause**: Missing environment variables or build errors
**Solution**: 
- Check Vercel function logs
- Verify all environment variables are set
- Test build locally: `npm run build:vercel`

#### 2. API Routes Not Working
**Cause**: Incorrect API route configuration
**Solution**:
- Verify `vercel.json` configuration
- Check serverless function logs in Vercel dashboard
- Ensure environment variables are set for functions

#### 3. Database Connection Errors
**Cause**: Incorrect Supabase configuration
**Solution**:
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Test connection locally

#### 4. Image Upload Failures
**Cause**: R2 configuration issues
**Solution**:
- Verify all R2 environment variables
- Check R2 bucket permissions
- Test R2 health endpoint: `/api/r2/health`

### Debug Commands

```bash
# Check build output
npm run build:vercel
ls -la dist/

# Test API routes locally
npm run dev:api

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch. To customize:

1. **Branch Deployments**: Configure in project settings
2. **Preview Deployments**: Automatic for pull requests
3. **Production Deployments**: Only from main branch

## 📈 Monitoring

Monitor your deployment:
- **Analytics**: Built-in Vercel Analytics
- **Performance**: Core Web Vitals tracking
- **Errors**: Function logs and error tracking
- **Usage**: Bandwidth and function execution metrics

## 🆘 Support

If you encounter issues:
1. Check Vercel function logs
2. Review this troubleshooting guide
3. Test locally with `npm run dev`
4. Check Supabase and R2 service status
