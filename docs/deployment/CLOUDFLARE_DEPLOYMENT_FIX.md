# 🔧 Cloudflare Pages MIME Type Error Fix

## Problem
Getting error: "Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'text/jsx'"

## Root Cause
This error occurs when:
1. JSX files are being served directly instead of transpiled JavaScript
2. Cloudflare Pages is deploying source files instead of built files
3. Incorrect MIME type configuration for JSX files

## ✅ Solution Steps

### Step 1: Verify Build Configuration
```bash
# Ensure your build works locally
npm run build

# Check that dist/index.html references compiled JS, not JSX
cat dist/index.html
# Should show: <script type="module" crossorigin src="/assets/index-[hash].js"></script>
# NOT: <script type="module" src="/src/main.jsx"></script>
```

### Step 2: Check Cloudflare Pages Build Settings
1. Go to Cloudflare Pages Dashboard
2. Select your project → Settings → Builds & deployments
3. Verify these settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)

### Step 3: Environment Variables
1. Go to Settings → Environment variables
2. Add required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 4: Deploy the Fix
```bash
# Commit the updated _headers file
git add public/_headers wrangler.toml
git commit -m "Fix MIME type error for Cloudflare deployment"
git push origin main
```

### Step 5: Verify Deployment
1. Wait for Cloudflare Pages to rebuild
2. Check the deployed site
3. Open browser developer tools → Network tab
4. Verify that JavaScript files are served with `Content-Type: application/javascript`

## 🚨 Common Mistakes to Avoid

1. **Don't deploy the root directory** - Always deploy the `dist` folder
2. **Don't set JSX MIME types** - JSX files should never be served in production
3. **Don't skip the build step** - Always run `npm run build` before deployment
4. **Don't forget environment variables** - Set them in Cloudflare Pages dashboard

## 🔍 Debugging Tips

### Check what's being deployed:
```bash
# List files in dist directory
ls -la dist/
# Should contain: index.html, assets/, _headers, _redirects
# Should NOT contain: any .jsx files
```

### Verify build output:
```bash
# Check that main.jsx is transpiled
grep -r "main.jsx" dist/
# Should return no results
```

### Test locally:
```bash
# Preview the built site locally
npm run preview
# Visit http://localhost:4173 and check for errors
```

## 📞 Still Having Issues?

If you're still experiencing problems:
1. Check Cloudflare Pages build logs for errors
2. Verify that the build command completed successfully
3. Ensure no JSX files exist in the deployed directory
4. Contact support with the specific error message and build logs
