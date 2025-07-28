# WordPress to Supabase Image Migration Guide

This guide covers the complete migration of WordPress content including images to Supabase.

## 🚀 Quick Start

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Run the complete migration**:
   ```bash
   node full-migration.js
   ```

## 📋 Prerequisites

- WordPress SQL dump file
- Supabase project with service key
- WordPress site URL (for downloading images)
- Node.js and npm installed

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here

# WordPress Configuration
WP_SQL_FILE=path/to/your/wordpress-dump.sql
WORDPRESS_BASE_URL=https://your-wordpress-site.com

# Migration Settings
BATCH_SIZE=100
DRY_RUN=false
```

## 📊 What Gets Migrated

### ✅ Content
- **Users**: WordPress users with profiles
- **Posts**: Blog posts and pages
- **Categories**: Post categories with hierarchy
- **Tags**: Post tags
- **Attachments**: Images and media files
- **Metadata**: Post metadata including SEO data

### 🖼️ Images
- **WordPress attachments** (`post_type='attachment'`)
- **Image metadata** (alt text, captions, dimensions)
- **Featured images** (thumbnail relationships)
- **Image files** downloaded and uploaded to Supabase Storage
- **Post content** updated with new image URLs

## 🗄️ Database Schema

The migration creates the following tables:

### `attachments`
```sql
- id (UUID, Primary Key)
- wp_id (Integer, WordPress ID)
- title (Text)
- slug (Text)
- content (Text, description)
- excerpt (Text, caption)
- mime_type (Text)
- file_path (Text, Supabase storage path)
- file_url (Text, public URL)
- file_size (Integer)
- width (Integer)
- height (Integer)
- alt_text (Text)
- status (Text)
- author_id (UUID, FK to users)
- parent_post_id (UUID, FK to posts)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Storage Bucket
- **Name**: `images`
- **Access**: Public read
- **File types**: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF
- **Size limit**: 50MB per file

## 🎯 Migration Steps

### Step 1: Data Extraction
```bash
node extract-data.js
```
Extracts from WordPress SQL:
- Posts and pages
- **Attachments** (images)
- Users, categories, tags
- Post metadata
- Relationships

### Step 2: Storage Setup
```bash
node setup-storage.js
```
- Creates `images` bucket in Supabase Storage
- Sets up public read access policies

### Step 3: Database Migration
```bash
node migrate-to-supabase.js
```
- Migrates all content to Supabase tables
- Creates proper relationships
- Handles WordPress ID mapping

### Step 4: Image Migration
```bash
node migrate-images.js
```
- Downloads images from WordPress site
- Uploads to Supabase Storage
- Updates post content with new URLs
- Preserves image metadata

## 🔧 Advanced Usage

### Dry Run Mode
Test the migration without making changes:
```bash
DRY_RUN=true node full-migration.js
```

### Partial Migrations
Run specific parts of the migration:

```bash
# Extract data only
node full-migration.js --extract-only

# Migrate database only
node full-migration.js --migrate-only

# Migrate images only
node full-migration.js --images-only

# Verify migration
node full-migration.js --verify-only
```

### Batch Processing
Control batch sizes for large datasets:
```bash
BATCH_SIZE=50 node full-migration.js
```

## 🖼️ Image URL Transformation

The migration automatically transforms image URLs:

**Before** (WordPress):
```
https://yoursite.com/wp-content/uploads/2023/01/image.jpg
```

**After** (Supabase):
```
https://your-project.supabase.co/storage/v1/object/public/images/image-1234567890.jpg
```

## 🔍 Verification

After migration, verify your data:

1. **Check record counts**:
   ```bash
   node full-migration.js --verify-only
   ```

2. **Test image access**:
   - Visit your Supabase Storage dashboard
   - Check that images are publicly accessible
   - Verify image URLs in post content

3. **Sample queries**:
   ```sql
   -- Count migrated content
   SELECT 'posts' as type, COUNT(*) as count FROM posts
   UNION ALL
   SELECT 'attachments', COUNT(*) FROM attachments
   UNION ALL
   SELECT 'users', COUNT(*) FROM users;

   -- Check image relationships
   SELECT p.title, COUNT(a.id) as image_count
   FROM posts p
   LEFT JOIN attachments a ON a.parent_post_id = p.id
   GROUP BY p.id, p.title
   HAVING COUNT(a.id) > 0;
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Images not downloading**:
   - Check `WORDPRESS_BASE_URL` is correct
   - Verify WordPress site is accessible
   - Check image URLs in WordPress content

2. **Storage bucket errors**:
   - Ensure service key has storage permissions
   - Check bucket policies are set correctly

3. **Large file uploads**:
   - Increase timeout settings
   - Process in smaller batches
   - Check file size limits

### Error Recovery

If migration fails partway through:

1. **Check logs** for specific error messages
2. **Run verification** to see what was completed
3. **Use partial migration** commands to resume
4. **Clear and restart** if needed:
   ```sql
   -- Clear tables (be careful!)
   TRUNCATE attachments, post_tags, post_categories, posts, tags, categories, users CASCADE;
   ```

## 📈 Performance Tips

1. **Use appropriate batch sizes** (50-100 for most cases)
2. **Run during off-peak hours** for large migrations
3. **Monitor Supabase quotas** and limits
4. **Test with small datasets** first

## 🎉 Success!

After successful migration, you'll have:
- ✅ All WordPress content in Supabase
- ✅ Images stored in Supabase Storage
- ✅ Updated post content with new image URLs
- ✅ Preserved relationships and metadata
- ✅ Public access to images

Your WordPress site is now fully migrated to Supabase with complete image support!
