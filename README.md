# Sayari Blog - दिल के जज़्बात
## Full-Stack Next.js Blog Application

A beautiful Hindi and Hinglish shayari blog built with Next.js 15, featuring a clean design, Supabase backend, and Cloudflare R2 storage.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Cloudflare account (for R2 storage)

### Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see below)
# Edit .env.local with your credentials

# Run development server
npm run dev

# Test database connection (optional)
npm run test:connection

# Test R2 storage connection (optional)
npm run test:r2

# Create admin user (optional)
npm run setup:admin
```

### Environment Configuration
```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Cloudflare R2 Configuration (Required)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=blog-images
CLOUDFLARE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev/blog-images
```

## 🏗️ Architecture

### Technology Stack
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2 (S3-compatible)
- **API**: Vercel Serverless Functions
- **Authentication**: Supabase Auth with Row Level Security

### Project Structure
```
├── app/                     # Next.js App Router
│   ├── [slug]/             # Dynamic blog post pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── loading.tsx         # Loading component
│   └── page.tsx            # Homepage
├── components/              # React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── PostCard.tsx
│   ├── PostDetail.tsx
│   └── ...
├── contexts/               # React Context providers
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── lib/                    # Utilities and configurations
│   └── supabase.ts
├── services/               # API services
│   └── blogService.ts
├── api/                    # Vercel API routes
│   ├── r2/                 # Cloudflare R2 storage endpoints
│   │   ├── presigned-upload.js
│   │   ├── delete.js
│   │   ├── list.js
│   │   ├── metadata.js
│   │   └── health.js
│   └── debug.js            # System diagnostics
├── backend/                # Backend utilities (development)
│   ├── database/           # Database schema and migrations
│   │   ├── database-schema.sql
│   │   └── database-performance-indexes.sql
│   └── scripts/            # Backend utilities
│       ├── setup-admin-user.js
│       ├── test-connection.js
│       ├── test-r2-connection.js
│       ├── setup-r2-credentials.js
│       ├── setup-r2-cors.js
│       └── dev-api-server.js
├── .env.example             # Environment configuration template
├── vercel.json              # Vercel deployment configuration
└── package.json             # Minimal backend dependencies
```

## 📊 Database Setup

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Copy the project URL and anon key

### 2. Run Database Schema
1. Open Supabase SQL Editor
2. Execute `backend/database/database-schema.sql`
3. Execute `backend/database/database-performance-indexes.sql`

### 3. Configure Row Level Security
The schema includes RLS policies for secure data access.

---

## 🔧 Available Scripts

### Development
```bash
npm run dev              # Start Next.js development server (port 3000)
npm run dev:api          # Start development API server (port 3001)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Testing
```bash
npm run test:connection  # Test Supabase database connection
npm run test:r2         # Test Cloudflare R2 storage connection
```

### Setup
```bash
npm run setup:admin     # Create admin user account
npm run setup:r2        # Setup R2 credentials
npm run setup:r2-cors   # Configure R2 CORS settings
```

## 📡 API Endpoints

### Base URL
- **Development**: `http://localhost:3001/api/`
- **Production**: `https://your-domain.vercel.app/api/`

### Storage Endpoints

#### POST `/api/r2/presigned-upload`
Generate presigned URL for file upload.

**Request:**
```json
{
  "filename": "image.jpg",
  "contentType": "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://presigned-url...",
  "filename": "unique-filename.jpg",
  "expiresIn": 600
}
```

#### DELETE `/api/r2/delete`
Delete file from storage.

#### GET `/api/r2/list`
List files in storage (admin only).

#### GET `/api/r2/health`
Check R2 service availability.

### System Endpoints

#### GET `/api/debug`
System diagnostics and environment check.

### AI Content Generation

#### POST `/api/gemini/generate-content`
Generate titles, slugs, descriptions, tags, and summaries using Gemini 2.0 Flash.

**Request Body:**
```json
{
  "content": "Your content here...",
  "type": "title|slug|description|tags|summary|custom",
  "customPrompt": "Optional custom prompt for type 'custom'"
}
```

**Supported Types:**
- `title`: Generate SEO-friendly titles (3 suggestions)
- `slug`: Generate URL-friendly slugs (3 suggestions)
- `description`: Generate meta descriptions (2 suggestions)
- `tags`: Generate relevant tags (8-12 suggestions)
- `summary`: Generate content summary (100-150 words)
- `custom`: Generate content with custom prompt

**Example:**
```bash
curl -X POST http://localhost:3001/api/gemini/generate-content \
  -H "Content-Type: application/json" \
  -d '{"content": "Your article content...", "type": "title"}'
```

See [Gemini API Documentation](backend/docs/GEMINI_API.md) for detailed usage.

---

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **posts**: Blog posts with metadata
- **categories**: Post categories
- **tags**: Post tags
- **attachments**: Media files
- **comments**: User comments
- **post_categories**: Post-category relationships
- **post_tags**: Post-tag relationships

### User Roles
- **admin**: Full system access
- **editor**: Content management
- **user**: Read access

## 🔐 Authentication

### User Management
```bash
# Create admin user
npm run setup:admin
```

### API Authentication
- Uses Supabase Auth with JWT tokens
- Row Level Security (RLS) policies enforce access control
- Service key for admin operations

---

## 📁 File Storage

### Cloudflare R2 Storage
- S3-compatible object storage
- Global CDN delivery
- Direct client uploads via presigned URLs
- Automatic file management

### File Upload Flow
1. Client requests presigned URL from `/api/r2/presigned-upload`
2. Server generates secure presigned URL (10-minute expiry)
3. Client uploads directly to R2 using presigned URL
4. File becomes immediately available via public URL

## 🚀 Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables
Set these in your Vercel dashboard:
- All variables from `.env.example`
- `NODE_ENV=production`

### Vercel Configuration
The `vercel.json` file is configured for:
- Serverless function routing
- CORS headers
- Static file serving

---

## 🔧 Development

### Local API Server
```bash
npm run dev:api
```

The development server runs on `http://localhost:3001` and provides:
- API endpoint testing
- CORS headers for development
- Request logging
- Error handling

### Testing Connections
```bash
# Test database
npm run test:connection

# Test storage
npm run test:r2

# Check system status
curl http://localhost:3001/api/debug
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Verify Supabase project is active

2. **R2 Storage Not Working**
   - Check all `CLOUDFLARE_R2_*` environment variables
   - Verify R2 bucket exists and is configured

3. **API Endpoints Not Found**
   - Ensure Vercel deployment is successful
   - Check `vercel.json` configuration

### Debug Commands
```bash
# Check environment
npm run test:connection

# Check R2 setup
npm run test:r2

# Check API status
curl http://localhost:3001/api/debug
```

---

**This is a pure backend API service ready for any frontend implementation! 🚀**
