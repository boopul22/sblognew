# Blog Admin Desktop Application

A Python Tkinter desktop application for managing blog posts, categories, and tags for the Sayari Blog platform.

## Features

- **Post Management**: Create, edit, delete, and publish blog posts
- **Rich Text Editor**: Built-in content editor with markdown support
- **Image Upload**: Direct integration with Cloudflare R2 storage
- **Category & Tag Management**: Create and manage post categories and tags
- **SEO Tools**: Meta title, description, and keyword management
- **Authentication**: Secure login using Supabase authentication
- **Real-time Sync**: Direct integration with the main blog's Supabase database

## Prerequisites

- Python 3.8 or higher
- Access to the main blog's `.env.local` file
- Admin or editor role in the blog system

## Installation

1. **Clone or navigate to the python-admin directory**:
   ```bash
   cd python-admin
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   The application automatically reads from the parent directory's `.env.local` file.
   Ensure the following variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
   CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
   CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint
   CLOUDFLARE_R2_PUBLIC_URL=your_public_url
   ```

## Usage

1. **Start the application**:
   ```bash
   python main.py
   ```

2. **Login**: Use your blog admin credentials to authenticate

3. **Manage Content**:
   - Create new posts with the post editor
   - Upload and manage images
   - Organize content with categories and tags
   - Preview and publish posts

## Project Structure

```
python-admin/
├── main.py                 # Application entry point
├── config/
│   ├── __init__.py
│   ├── env_loader.py       # Environment configuration
│   └── settings.py         # Application settings
├── services/
│   ├── __init__.py
│   ├── supabase_service.py # Database operations
│   ├── storage_service.py  # R2 image upload
│   └── auth_service.py     # Authentication
├── ui/
│   ├── __init__.py
│   ├── main_window.py      # Main application window
│   ├── post_editor.py      # Post creation/editing
│   ├── post_manager.py     # Post listing/management
│   ├── category_manager.py # Category management
│   ├── tag_manager.py      # Tag management
│   └── components/         # Reusable UI components
├── models/
│   ├── __init__.py
│   ├── post.py            # Post data model
│   ├── category.py        # Category data model
│   └── tag.py             # Tag data model
├── utils/
│   ├── __init__.py
│   ├── validators.py      # Input validation
│   ├── formatters.py      # Text formatting
│   └── helpers.py         # Utility functions
└── requirements.txt       # Python dependencies
```

## Development

- The application uses Tkinter for the GUI framework
- Supabase Python client for database operations
- Boto3 for Cloudflare R2 storage integration
- Python-dotenv for environment variable management

## Troubleshooting

1. **Connection Issues**: Verify your `.env.local` file contains correct credentials
2. **Permission Errors**: Ensure your user account has admin or editor role
3. **Image Upload Failures**: Check R2 configuration and network connectivity

## Quick Start Guide

### 1. **Automated Setup (Recommended)**
```bash
cd python-admin
python setup.py
```

The setup script will:
- Check Python version compatibility
- Install all dependencies
- Verify environment configuration
- Test all imports
- Optionally create a desktop shortcut

### 2. **Manual Setup**
If you prefer manual setup:

```bash
cd python-admin

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

## Features Overview

### 📝 **Post Management**
- **Create Posts**: Rich text editor with markdown support
- **Edit Posts**: Full editing capabilities with auto-save
- **Post Status**: Draft, Published, Private status management
- **SEO Optimization**: Meta titles, descriptions, and keywords
- **Content Organization**: Categories and tags assignment

### 🖼️ **Image Management**
- **Direct Upload**: Upload images directly to Cloudflare R2
- **Image Preview**: Preview images before uploading
- **Featured Images**: Set featured images for posts
- **Storage Integration**: Seamless R2 storage integration

### 🏷️ **Content Organization**
- **Categories**: Create and manage post categories
- **Tags**: Create and manage post tags
- **Color Coding**: Visual organization with custom colors
- **Hierarchical Structure**: Support for category hierarchies

### 🔐 **Security & Authentication**
- **Supabase Auth**: Secure authentication system
- **Role-Based Access**: Admin and editor role support
- **Permission Control**: Granular permission management
- **Session Management**: Secure session handling

### ⚡ **Performance Features**
- **Real-time Sync**: Direct database integration
- **Async Operations**: Non-blocking UI operations
- **Progress Indicators**: Visual feedback for operations
- **Error Handling**: Comprehensive error management

## User Interface Guide

### Main Window
- **Menu Bar**: File, Posts, Content, and Help menus
- **Toolbar**: Quick access to common actions
- **Content Area**: Dynamic content based on current view
- **Status Bar**: Real-time status updates and progress

### Post Editor
- **Content Tab**: Title, slug, content, and excerpt editing
- **Settings Tab**: Status, category, tags, and featured image
- **SEO Tab**: Meta title, description, and optimization tools
- **Auto-generation**: Automatic slug and excerpt generation

### Post Manager
- **List View**: Sortable table of all posts
- **Search & Filter**: Find posts by title, status, or category
- **Bulk Actions**: Select and manage multiple posts
- **Context Menu**: Right-click for quick actions

### Category & Tag Managers
- **Split View**: List on left, form on right
- **Color Picker**: Visual color selection
- **Preset Colors**: Quick color selection
- **Real-time Preview**: See changes immediately

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New Post |
| `Ctrl+S` | Save Post |
| `Ctrl+P` | Publish Post |
| `F5` | Refresh/Preview |
| `Ctrl+Q` | Quit Application |

## Configuration

### Environment Variables
The application reads from the parent directory's `.env.local` file:

```env
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Required for Image Upload - Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=blog-images
CLOUDFLARE_R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://pub-account-id.r2.dev/blog-images

# Optional - API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:3000
NEXT_PUBLIC_STORAGE_PROVIDER=cloudflare-r2
```

### User Roles
- **Admin**: Full access to all features
- **Editor**: Can create, edit, and publish posts
- **User**: Read-only access (cannot use admin app)

## API Integration

The application integrates with your existing blog's API endpoints:

### Image Upload Flow
1. Request presigned URL from `/api/r2/presigned-upload`
2. Upload image directly to Cloudflare R2
3. Store public URL in post data

### Database Operations
- Direct Supabase integration using Python client
- Real-time data synchronization
- Automatic relationship management

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**2. "Supabase connection failed"**
- Check your `.env.local` file exists and has correct values
- Verify Supabase URL and keys are valid
- Test connection from main blog application first

**3. "Image upload failed"**
- Verify R2 credentials in `.env.local`
- Check R2 bucket permissions
- Ensure CORS is configured for R2 bucket

**4. "Permission denied" errors**
- Verify your user account has admin or editor role
- Check Supabase RLS policies
- Ensure you're logged in with correct credentials

**5. Application won't start**
```bash
# Check Python version
python --version  # Should be 3.8+

# Run setup script
python setup.py

# Check for detailed error messages
python main.py
```

### Debug Mode
For detailed logging, set environment variable:
```bash
export DEBUG=1  # macOS/Linux
set DEBUG=1     # Windows
python main.py
```

### Getting Help
1. Check the console output for detailed error messages
2. Verify all environment variables are set correctly
3. Test the main blog application works first
4. Check Supabase dashboard for any service issues

## Development

### Project Structure
```
python-admin/
├── main.py                 # Application entry point
├── setup.py               # Setup and installation script
├── requirements.txt       # Python dependencies
├── config/               # Configuration management
├── services/             # Database and API services
├── ui/                   # User interface components
├── models/               # Data models
├── utils/                # Utility functions
└── README.md             # This file
```

### Adding New Features
1. Create new UI components in `ui/` directory
2. Add data models in `models/` directory
3. Implement services in `services/` directory
4. Update main window navigation as needed

### Testing
```bash
# Run basic functionality test
python -c "from main import *; print('Import test passed')"

# Test database connection
python -c "from services.supabase_service import supabase_service; print('DB test passed')"
```

## Contributing

This application is part of the larger Sayari Blog project. Follow the main project's contribution guidelines.

### Development Guidelines
- Follow PEP 8 style guidelines
- Add docstrings to all functions and classes
- Handle errors gracefully with user-friendly messages
- Test all functionality before submitting changes
- Update documentation for new features
