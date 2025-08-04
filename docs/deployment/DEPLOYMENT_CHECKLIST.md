# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] All environment variables are using `import.meta.env.VITE_*` format
- [ ] No hardcoded API keys or URLs in the codebase
- [ ] `.env.example` file is updated with all required variables
- [ ] Local `.env` file is working correctly
- [ ] Environment variables are validated at application startup

### ✅ Code Quality
- [ ] All tests are passing
- [ ] No console errors in development
- [ ] Build completes without warnings
- [ ] CSS properties are valid (no `fontSize`, use `font-size`)
- [ ] All imports are correct and components exist

### ✅ Build Configuration
- [ ] `vite.config.js` has correct base path (`base: '/'`)
- [ ] `_redirects` file exists for SPA routing (`/* /index.html 200`)
- [ ] Build output directory is correct (`dist`)
- [ ] `wrangler.toml` is configured with correct build settings
- [ ] No JSX files exist in the `dist` directory after build

## Deployment Steps

### 1. Local Testing
```bash
# Build the project
npm run build

# Test the build locally
npm run preview

# Check for any errors in browser console
```

### 2. Environment Variables Setup

#### Cloudflare Pages
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Navigate to Settings → Environment variables
4. Add required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### Other Platforms
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **GitHub Pages**: Repository Settings → Secrets and Variables

### 3. Deploy
```bash
# Commit changes
git add .
git commit -m "Your commit message"

# Push to trigger deployment
git push origin main
```

### 4. Post-Deployment Verification
- [ ] Site loads without blank page
- [ ] No JavaScript errors in browser console
- [ ] All routes work correctly
- [ ] Data loads from Supabase
- [ ] Search functionality works
- [ ] Navigation works properly

## Common Issues & Solutions

### MIME Type Error for JSX Files
**Cause**: Deploying source files instead of built files, or JSX files being served directly
**Solution**:
1. Ensure you're deploying the `dist` directory, not the root directory
2. Remove JSX MIME type configuration from `_headers` file
3. Verify `npm run build` completes successfully
4. Check that no `.jsx` files exist in the `dist` directory

### Blank White Page
**Cause**: Missing or incorrect environment variables
**Solution**:
1. Check environment variables are set correctly
2. Verify variable names match exactly
3. Check browser console for errors

### 404 Errors on Refresh
**Cause**: Missing SPA redirect configuration
**Solution**: Ensure `_redirects` file contains `/* /index.html 200`

### Asset Loading Issues
**Cause**: Incorrect base path in Vite config
**Solution**: Set `base: '/'` in `vite.config.js`

### Supabase Connection Errors
**Cause**: Hardcoded values or missing environment variables
**Solution**: Use `import.meta.env.VITE_*` format for all Supabase config

## Emergency Rollback

If deployment fails:
1. Check the previous working commit: `git log --oneline`
2. Revert to last working version: `git revert <commit-hash>`
3. Push the revert: `git push origin main`

## Security Reminders

- ❌ Never commit `.env` files
- ❌ Never hardcode API keys
- ❌ Never expose service keys (only anon keys)
- ✅ Always use environment variables
- ✅ Regularly rotate API keys
- ✅ Use different keys for different environments
