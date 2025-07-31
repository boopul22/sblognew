# Environment Setup - Supabase Blog Website

## ✅ Environment Variables Updated

Your local environment has been configured to use the correct **blog-website** Supabase project where the database schema was created.

### Project Details
- **Project Name**: blog-website
- **Project ID**: cgmlpbxwmqynmshecaqn
- **Region**: us-east-1
- **Database**: PostgreSQL 17.4.1 with full schema

### Files Updated

#### 1. Root `.env` file
```env
# Supabase Configuration for React App (blog-website project)
VITE_SUPABASE_URL=https://cgmlpbxwmqynmshecaqn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODYzOTIsImV4cCI6MjA2OTQ2MjM5Mn0.PJambQA-fPcmJPjsLuLJrTtYZXqOx7wzuslJjDjzo_A

# Supabase Service Key for Migration Scripts (blog-website project)
SUPABASE_URL=https://cgmlpbxwmqynmshecaqn.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg4NjM5MiwiZXhwIjoyMDY5NDYyMzkyfQ.v1LM4fFcfeMRGwdETiUaWGWM6lEVD3BkpmFTI3sp1WM

# Additional environment variables for migration scripts
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODYzOTIsImV4cCI6MjA2OTQ2MjM5Mn0.PJambQA-fPcmJPjsLuLJrTtYZXqOx7wzuslJjDjzo_A
```

#### 2. Root `.env.local` file
```env
# Supabase Configuration for React App (blog-website project)
VITE_SUPABASE_URL=https://cgmlpbxwmqynmshecaqn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODYzOTIsImV4cCI6MjA2OTQ2MjM5Mn0.PJambQA-fPcmJPjsLuLJrTtYZXqOx7wzuslJjDjzo_A

# Additional configuration for local development
NODE_ENV=development
```

#### 3. Migration `.env` file (`migration/.env`)
```env
# Supabase Configuration (blog-website project)
SUPABASE_URL=https://cgmlpbxwmqynmshecaqn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODYzOTIsImV4cCI6MjA2OTQ2MjM5Mn0.PJambQA-fPcmJPjsLuLJrTtYZXqOx7wzuslJjDjzo_A
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxwYnh3bXF5bm1zaGVjYXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg4NjM5MiwiZXhwIjoyMDY5NDYyMzkyfQ.v1LM4fFcfeMRGwdETiUaWGWM6lEVD3BkpmFTI3sp1WM

# WordPress Migration Settings
WP_SQL_FILE=../u957990218_GpBKT.sql
WORDPRESS_BASE_URL=https://your-wordpress-site.com
BATCH_SIZE=100
DRY_RUN=false
```

#### 4. Source Code Files Updated
- `migration/sayari-blog/src/lib/supabase.js` - Updated hardcoded URLs
- `scripts/build-static-data.js` - Updated fallback URLs
- `migration/.env.example` - Updated example configuration
- `.env.local` - Updated local development configuration
- `.env.example` - Updated root example configuration

## 🔑 API Keys Explained

### Anonymous Key (Public)
- **Purpose**: Client-side access for your React app
- **Security**: Safe to expose in frontend code
- **Permissions**: Limited by Row Level Security (RLS) policies
- **Usage**: Reading published content, user authentication

### Service Role Key (Private)
- **Purpose**: Server-side operations and migrations
- **Security**: ⚠️ **NEVER expose in frontend code**
- **Permissions**: Full database access (bypasses RLS)
- **Usage**: Migration scripts, admin operations, server-side functions

## 🚀 Ready to Use

Your environment is now properly configured for:

### Frontend Development
```bash
npm run dev
# Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### WordPress Migration
```bash
cd migration
npm run migrate
# Uses SUPABASE_URL and SUPABASE_SERVICE_KEY
```

### Static Data Generation
```bash
npm run build:static
# Uses environment variables with fallbacks
```

## 🔒 Security Notes

1. **Service Key**: Keep the service role key secure and never commit it to public repositories
2. **RLS Policies**: All tables have Row Level Security enabled for data protection
3. **Environment Files**: The `.env` files are gitignored for security
4. **Key Rotation**: API keys can be regenerated in the Supabase dashboard if needed

## 🔧 Troubleshooting

### If you get connection errors:
1. Verify the URLs are correct (cgmlpbxwmqynmshecaqn.supabase.co)
2. Check that the API keys are valid and not expired
3. Ensure your IP is not blocked by Supabase

### If RLS errors occur:
1. Check that you're using the correct key for the operation
2. Verify RLS policies allow the operation
3. Use service key for admin operations

### If migration fails:
1. Check the migration `.env` file has correct keys
2. Verify the database schema exists (it does!)
3. Check WordPress SQL file path is correct

## ✅ Next Steps

1. **Test Connection**: Run `npm run dev` to test frontend connection
2. **Run Migration**: If you have WordPress data, run the migration scripts
3. **Create Content**: Start adding posts, categories, and users
4. **Deploy**: Your environment is ready for production deployment

All environment variables are now correctly configured for the blog-website project with the complete database schema!
