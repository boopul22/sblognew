# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### 🔧 Code Preparation
- [ ] All changes committed and pushed to main branch
- [ ] `vercel.json` configuration file exists
- [ ] `.vercelignore` file configured
- [ ] API routes in `/api` directory with correct export format
- [ ] Build scripts updated in `package.json`

### 🧪 Local Testing
- [ ] Run `npm run build:vercel` successfully
- [ ] Run `npm run preview` and verify site works
- [ ] Test all routes and functionality locally
- [ ] Check browser console for errors
- [ ] Verify API endpoints work (if using R2 storage)

### 📋 Environment Variables Ready
- [ ] Supabase URL and anon key available
- [ ] Cloudflare R2 credentials (if using R2 storage)
- [ ] All required variables documented in `.env.vercel.example`

## Deployment Steps

### 1. Repository Setup
```bash
# Ensure all changes are committed
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Vercel Project Creation

#### Option A: Vercel CLI
```bash
# Install and login
npm i -g vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
- [ ] Go to [vercel.com](https://vercel.com) and login
- [ ] Click "New Project"
- [ ] Import your Git repository
- [ ] Verify build settings are auto-detected correctly
- [ ] Deploy

### 3. Environment Variables Configuration
- [ ] Go to Project Settings → Environment Variables
- [ ] Add all variables from `.env.vercel.example`
- [ ] Set environment scope (Production, Preview, Development)
- [ ] Save configuration

### 4. Build Configuration Verification
Verify these settings in Vercel dashboard:
- [ ] **Build Command**: `npm run build:vercel`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`
- [ ] **Framework**: Vite (auto-detected)
- [ ] **Node.js Version**: 18.x

## Post-Deployment Verification

### 🌐 Site Functionality
- [ ] Site loads without blank page
- [ ] No JavaScript errors in browser console
- [ ] All routes work correctly (React Router)
- [ ] Navigation between pages works
- [ ] Search functionality works
- [ ] Mobile responsiveness verified

### 🗄️ Database Connection
- [ ] Posts load from Supabase
- [ ] Authors page displays correctly
- [ ] Categories and tags work
- [ ] Single post pages load
- [ ] No database connection errors

### 🔐 Admin Functionality (if applicable)
- [ ] Admin login works
- [ ] Post creation/editing works
- [ ] Image uploads work (test with small image)
- [ ] Storage settings accessible
- [ ] All admin routes protected

### 🚀 API Endpoints
Test these endpoints in browser or with curl:
- [ ] `/api/r2/health` (if using R2) - should return status
- [ ] API routes respond correctly
- [ ] CORS headers working
- [ ] No 500 errors in function logs

### 📊 Performance Check
- [ ] Page load times acceptable
- [ ] Images load correctly
- [ ] CSS and JS assets load
- [ ] Service worker registers (check DevTools)
- [ ] Core Web Vitals look good

## Troubleshooting Common Issues

### ❌ Blank Page After Deployment
**Symptoms**: Site shows blank page or loading spinner
**Solutions**:
1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Check browser console for JavaScript errors
4. Ensure `vercel.json` routes are correct

### ❌ API Routes Not Working
**Symptoms**: 404 errors on `/api/*` endpoints
**Solutions**:
1. Verify API files are in `/api` directory
2. Check `vercel.json` functions configuration
3. Ensure proper export format: `export default async function handler(req, res)`
4. Check function logs in Vercel dashboard

### ❌ Environment Variables Not Working
**Symptoms**: Database connection errors, missing configuration
**Solutions**:
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Ensure `VITE_` prefix for client-side variables
4. Redeploy after adding variables

### ❌ Build Failures
**Symptoms**: Deployment fails during build step
**Solutions**:
1. Test build locally: `npm run build:vercel`
2. Check for TypeScript errors
3. Verify all dependencies are in `package.json`
4. Check Node.js version compatibility

### ❌ Image Upload Issues
**Symptoms**: Image uploads fail in admin panel
**Solutions**:
1. Test `/api/r2/health` endpoint
2. Verify all R2 environment variables
3. Check R2 bucket permissions and CORS
4. Test with small image files first

## Monitoring and Maintenance

### 📈 Regular Checks
- [ ] Monitor Vercel Analytics for performance
- [ ] Check function execution logs weekly
- [ ] Monitor Core Web Vitals
- [ ] Verify SSL certificate is active

### 🔄 Updates and Maintenance
- [ ] Keep dependencies updated
- [ ] Monitor Vercel service status
- [ ] Backup Supabase data regularly
- [ ] Test functionality after major updates

### 🆘 Emergency Procedures
If site goes down:
1. Check Vercel status page
2. Review recent deployments
3. Rollback to previous working deployment
4. Check Supabase service status
5. Verify domain configuration

## Success Criteria ✅

Your deployment is successful when:
- [ ] Site loads quickly without errors
- [ ] All functionality works as expected
- [ ] Admin panel is accessible and functional
- [ ] API endpoints respond correctly
- [ ] Performance metrics are acceptable
- [ ] No console errors or warnings
- [ ] Mobile experience is smooth

## Next Steps After Successful Deployment

1. **Set up monitoring**: Configure alerts for downtime
2. **Performance optimization**: Monitor and optimize based on real usage
3. **SEO setup**: Configure meta tags and sitemap
4. **Analytics**: Set up Google Analytics or similar
5. **Backup strategy**: Ensure regular Supabase backups
6. **Documentation**: Update README with live site URL

---

🎉 **Congratulations!** Your Sayari Blog is now live on Vercel!

**Live Site**: `https://your-project.vercel.app`
**Admin Panel**: `https://your-project.vercel.app/admin`
