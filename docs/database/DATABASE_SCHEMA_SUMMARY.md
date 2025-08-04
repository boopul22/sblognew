# Database Schema Summary - Supabase Blog Website

## Project Information
- **Supabase Project**: bipul281b@gmail.com
- **Project ID**: ktxhnxmdbfkswmkikgum
- **Region**: ap-south-1
- **Database Version**: PostgreSQL 17.4.1

## Database Tables Created/Updated

### Core Tables (Already Existed - Enhanced)

#### 1. `users` - User Management
- **Primary Key**: `id` (UUID)
- **Key Columns**: 
  - `email` (TEXT, UNIQUE) - User email
  - `username` (TEXT, UNIQUE) - Username
  - `full_name` (TEXT) - Full display name
  - `display_name` (TEXT) - **NEW** - Display name for WordPress compatibility
  - `user_login` (TEXT) - **NEW** - Login name for WordPress compatibility
  - `user_url` (TEXT) - **NEW** - User website URL
  - `avatar_url` (TEXT) - Profile picture URL
  - `bio` (TEXT) - User biography
  - `role` (TEXT, DEFAULT 'user') - User role (admin, editor, user)
  - `wp_id` (INTEGER) - **NEW** - WordPress migration ID mapping
  - `registered_at` (TIMESTAMPTZ) - **NEW** - Registration timestamp
- **Indexes**: email, username, display_name, user_login, wp_id
- **RLS**: Enabled with policies for profile management

#### 2. `posts` - Blog Posts
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `title` (TEXT, NOT NULL) - Post title
  - `slug` (TEXT, UNIQUE) - URL slug
  - `content` (TEXT, NOT NULL) - Post content
  - `excerpt` (TEXT) - Post excerpt
  - `featured_image` (TEXT) - Featured image path
  - `featured_image_url` (TEXT) - **NEW** - Featured image URL
  - `status` (TEXT, DEFAULT 'draft') - Post status
  - `author_id` (UUID, FK to users) - Post author
  - `category_id` (UUID, FK to categories) - Primary category
  - `tags` (TEXT[]) - Tag array (for backward compatibility)
  - `meta_title` (TEXT) - SEO title
  - `meta_description` (TEXT) - SEO description
  - `reading_time` (INTEGER) - **AUTO-CALCULATED** - Reading time in minutes
  - `view_count` (INTEGER, DEFAULT 0) - View counter
  - `search_vector` (TSVECTOR) - **NEW** - Full-text search vector
  - `wp_id` (INTEGER) - **NEW** - WordPress migration ID
  - `published_at` (TIMESTAMPTZ) - Publication date
- **Indexes**: Multiple performance indexes for queries
- **RLS**: Comprehensive policies for authors, editors, and public access

#### 3. `categories` - Post Categories
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `name` (TEXT, UNIQUE) - Category name
  - `slug` (TEXT, UNIQUE) - URL slug
  - `description` (TEXT) - Category description
  - `color` (TEXT, DEFAULT '#6366f1') - Category color
  - `parent_id` (UUID, FK to categories) - **NEW** - Parent category for hierarchy
  - `wp_id` (INTEGER) - **NEW** - WordPress migration ID
- **Indexes**: name, slug, parent_id, wp_id
- **RLS**: Public read, admin manage

### New Tables Created

#### 4. `tags` - Post Tags
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `name` (TEXT, UNIQUE) - Tag name
  - `slug` (TEXT, UNIQUE) - URL slug
  - `description` (TEXT) - Tag description
  - `color` (TEXT, DEFAULT '#6366f1') - Tag color
- **Indexes**: name, slug
- **RLS**: Public read, admin manage

#### 5. `post_categories` - Post-Category Junction
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `post_id` (UUID, FK to posts) - Post reference
  - `category_id` (UUID, FK to categories) - Category reference
- **Constraints**: UNIQUE(post_id, category_id)
- **Indexes**: post_id, category_id, composite
- **RLS**: Public read, author/admin manage

#### 6. `post_tags` - Post-Tag Junction
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `post_id` (UUID, FK to posts) - Post reference
  - `tag_id` (UUID, FK to tags) - Tag reference
- **Constraints**: UNIQUE(post_id, tag_id)
- **Indexes**: post_id, tag_id, composite
- **RLS**: Public read, author/admin manage

#### 7. `attachments` - Media Files
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `title` (TEXT) - Attachment title
  - `filename` (TEXT, NOT NULL) - Original filename
  - `url` (TEXT, NOT NULL) - Public URL
  - `mime_type` (TEXT) - File MIME type
  - `file_size` (INTEGER) - File size in bytes
  - `width`, `height` (INTEGER) - Image dimensions
  - `alt_text` (TEXT) - Alt text for accessibility
  - `caption` (TEXT) - Image caption
  - `description` (TEXT) - Image description
  - `author_id` (UUID, FK to users) - Uploader
  - `parent_post_id` (UUID, FK to posts) - Associated post
  - `storage_path` (TEXT) - Supabase storage path
  - `wp_id` (INTEGER) - WordPress migration ID
- **Indexes**: author_id, parent_post_id, wp_id, mime_type, created_at
- **RLS**: Public read, author/admin manage

#### 8. `post_meta` - Additional Post Metadata
- **Primary Key**: `id` (UUID)
- **Key Columns**:
  - `post_id` (UUID, FK to posts) - Post reference
  - `meta_key` (TEXT, NOT NULL) - Metadata key
  - `meta_value` (TEXT) - Metadata value
- **Indexes**: post_id, meta_key, composite
- **RLS**: Public read for published posts, author/admin manage

### Existing Enhanced Tables

#### 9. `comments` - Comment System
- Threaded comments with parent_id
- Status-based moderation (pending, approved, rejected)
- Support for both authenticated and guest comments

#### 10. `likes` - Post Reactions
- User-post like relationships
- Unique constraint prevents duplicate likes

#### 11. `bookmarks` - User Bookmarks
- User-post bookmark relationships
- Private to each user

## Performance Optimizations

### Critical Indexes Created
1. **Homepage Performance**: `idx_posts_status_published_at`
2. **Author Queries**: `idx_posts_author_status`
3. **Single Post**: `idx_posts_slug_status`
4. **Full-Text Search**: `idx_posts_search_gin`, `idx_posts_search_vector`
5. **Relationship Queries**: Composite indexes on junction tables

### Materialized Views
- **`popular_posts`**: Pre-computed view of published posts with author info
- Refresh function: `refresh_popular_posts()`

### Database Functions
1. **`calculate_reading_time(content)`**: Auto-calculates reading time
2. **`update_updated_at_column()`**: Auto-updates timestamps
3. **`update_post_reading_time()`**: Trigger function for reading time
4. **`refresh_popular_posts()`**: Refreshes materialized view

### Automatic Triggers
- **Updated At**: Auto-updates `updated_at` on all tables
- **Reading Time**: Auto-calculates reading time when content changes

## Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

### Public Access
- **Read**: Published posts, approved comments, categories, tags, attachments
- **No Authentication Required**: Basic content consumption

### User Access
- **Own Content**: Users can manage their own posts, comments, bookmarks, likes
- **Profile Management**: Users can update their own profiles

### Admin/Editor Access
- **Full Management**: Admins can manage all content
- **Moderation**: Editors can manage posts and comments
- **Category/Tag Management**: Admin-only for taxonomy management

## WordPress Migration Compatibility

The schema is fully compatible with your WordPress migration scripts:
- All expected tables exist: `users`, `posts`, `categories`, `tags`, `attachments`, `post_meta`
- Junction tables: `post_categories`, `post_tags`
- WordPress ID mapping: `wp_id` columns for ID preservation
- Column compatibility: `display_name`, `user_login`, `featured_image_url`

## Next Steps

1. **Run Migration**: Your migration scripts should now work seamlessly
2. **Monitor Performance**: Use the included monitoring queries
3. **Refresh Views**: Set up periodic refresh of materialized views
4. **Test RLS**: Verify security policies work as expected

## SQL Commands Summary

All tables, indexes, functions, and policies have been created successfully in your new Supabase project (`ktxhnxmdbfkswmkikgum`). The database is now ready for your WordPress migration and blog application.
