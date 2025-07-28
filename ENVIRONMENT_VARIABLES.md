# Environment Variables Guide

## 🔐 Important: Always Use Environment Variables

**NEVER hardcode sensitive information like API keys, database URLs, or secrets directly in your code.**

## 📋 Required Environment Variables

This project requires the following environment variables to function properly:

### Supabase Configuration
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Setup Instructions

### 1. Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

3. **Never commit the `.env` file to Git** (it's already in `.gitignore`)

### 2. Production Deployment (Cloudflare Pages)

1. Go to your Cloudflare Pages dashboard
2. Navigate to your project → Settings → Environment variables
3. Add each variable:
   - Variable name: `VITE_SUPABASE_URL`
   - Value: `https://ckjpejxjpcfmlyopqabt.supabase.co`
   - Variable name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNranBlanhqcGNmbWx5b3BxYWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTk5OTUsImV4cCI6MjA2OTI5NTk5NX0.sdinJPYznrITCIJBijRV2iwA0TSLLsTmLWtTYY37OLE`

4. Redeploy your application

## 🔧 How to Use Environment Variables in Code

### ✅ Correct Way (Using Environment Variables)
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### ❌ Wrong Way (Hardcoded Values)
```javascript
// DON'T DO THIS!
const supabaseUrl = 'https://ckjpejxjpcfmlyopqabt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## 🚨 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different keys for different environments** (development, staging, production)
3. **Regularly rotate API keys** and update them in all environments
4. **Use `VITE_` prefix** for variables that need to be accessible in the browser
5. **Validate environment variables** at application startup

## 🐛 Troubleshooting

### Blank Page Issues
If you see a blank page after deployment, check:

1. **Environment variables are set** in your hosting platform
2. **Variable names match exactly** (case-sensitive)
3. **No extra spaces** in variable values
4. **Browser console** for JavaScript errors

### Common Errors
- `Missing Supabase environment variables` → Check if variables are set correctly
- `Invalid API key` → Verify the key is correct and not expired
- `CORS errors` → Check Supabase project settings

## 📝 Adding New Environment Variables

When adding new environment variables:

1. Add to `.env.example` with placeholder values
2. Update this documentation
3. Add validation in your code
4. Update deployment platform settings
5. Inform team members

## 🔄 Environment Variable Validation

Always validate environment variables at startup:

```javascript
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})
```
