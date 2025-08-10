"""
Application settings and constants for the blog admin desktop application.
"""

from typing import Dict, List, Tuple

# Application Information
APP_NAME = "Blog Admin Desktop"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Desktop application for managing blog posts, categories, and tags"

# Window Configuration
WINDOW_CONFIG = {
    'title': f"{APP_NAME} v{APP_VERSION}",
    'geometry': '1200x800',
    'min_width': 800,
    'min_height': 600,
    'resizable': True,
}

# UI Theme and Styling
UI_THEME = {
    'primary_color': '#6366f1',
    'secondary_color': '#10b981',
    'background_color': '#ffffff',
    'surface_color': '#f8fafc',
    'text_color': '#1f2937',
    'text_secondary': '#6b7280',
    'border_color': '#e5e7eb',
    'error_color': '#ef4444',
    'success_color': '#10b981',
    'warning_color': '#f59e0b',
}

# Font Configuration
FONTS = {
    'default': ('Segoe UI', 10),
    'heading': ('Segoe UI', 12, 'bold'),
    'large_heading': ('Segoe UI', 14, 'bold'),
    'small': ('Segoe UI', 9),
    'monospace': ('Consolas', 10),
}

# Post Status Options
POST_STATUSES = [
    ('draft', 'Draft'),
    ('published', 'Published'),
    ('private', 'Private'),
    ('pending', 'Pending Review'),
]

# Default Category Colors
CATEGORY_COLORS = [
    '#6366f1',  # Indigo
    '#10b981',  # Emerald
    '#f59e0b',  # Amber
    '#ef4444',  # Red
    '#8b5cf6',  # Violet
    '#06b6d4',  # Cyan
    '#84cc16',  # Lime
    '#f97316',  # Orange
    '#ec4899',  # Pink
    '#6b7280',  # Gray
]

# Default Tag Colors
TAG_COLORS = [
    '#10b981',  # Emerald
    '#6366f1',  # Indigo
    '#f59e0b',  # Amber
    '#8b5cf6',  # Violet
    '#06b6d4',  # Cyan
    '#ef4444',  # Red
    '#84cc16',  # Lime
    '#f97316',  # Orange
    '#ec4899',  # Pink
    '#6b7280',  # Gray
]

# Image Upload Configuration
IMAGE_CONFIG = {
    'max_file_size': 10 * 1024 * 1024,  # 10MB
    'allowed_extensions': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'allowed_mime_types': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'thumbnail_size': (200, 200),
    'preview_size': (400, 300),
}

# Text Editor Configuration
EDITOR_CONFIG = {
    'wrap': 'word',
    'undo': True,
    'maxundo': 50,
    'tabs': '1c',
    'font': FONTS['default'],
    'height': 20,
    'width': 80,
}

# Validation Rules
VALIDATION_RULES = {
    'title': {
        'min_length': 1,
        'max_length': 200,
        'required': True,
    },
    'slug': {
        'min_length': 1,
        'max_length': 200,
        'pattern': r'^[a-z0-9-]+$',
        'required': True,
    },
    'content': {
        'min_length': 1,
        'required': True,
    },
    'excerpt': {
        'max_length': 500,
        'required': False,
    },
    'meta_title': {
        'max_length': 60,
        'required': False,
    },
    'meta_description': {
        'max_length': 160,
        'required': False,
    },
    'category_name': {
        'min_length': 1,
        'max_length': 100,
        'required': True,
    },
    'tag_name': {
        'min_length': 1,
        'max_length': 50,
        'required': True,
    },
}

# API Configuration
API_CONFIG = {
    'timeout': 30,
    'retry_attempts': 3,
    'retry_delay': 1,
}

# Pagination Settings
PAGINATION = {
    'posts_per_page': 20,
    'categories_per_page': 50,
    'tags_per_page': 50,
}

# Keyboard Shortcuts
SHORTCUTS = {
    'save': '<Control-s>',
    'new_post': '<Control-n>',
    'open_post': '<Control-o>',
    'publish': '<Control-p>',
    'preview': '<F5>',
    'quit': '<Control-q>',
}

# Error Messages
ERROR_MESSAGES = {
    'connection_failed': 'Failed to connect to the database. Please check your internet connection and try again.',
    'authentication_failed': 'Authentication failed. Please check your credentials.',
    'permission_denied': 'You do not have permission to perform this action.',
    'validation_failed': 'Please check your input and try again.',
    'upload_failed': 'Failed to upload image. Please try again.',
    'save_failed': 'Failed to save changes. Please try again.',
    'delete_failed': 'Failed to delete item. Please try again.',
    'load_failed': 'Failed to load data. Please refresh and try again.',
}

# Success Messages
SUCCESS_MESSAGES = {
    'post_saved': 'Post saved successfully!',
    'post_published': 'Post published successfully!',
    'post_deleted': 'Post deleted successfully!',
    'category_saved': 'Category saved successfully!',
    'category_deleted': 'Category deleted successfully!',
    'tag_saved': 'Tag saved successfully!',
    'tag_deleted': 'Tag deleted successfully!',
    'image_uploaded': 'Image uploaded successfully!',
    'login_success': 'Login successful!',
}

# Default Values
DEFAULTS = {
    'post_status': 'draft',
    'category_color': CATEGORY_COLORS[0],
    'tag_color': TAG_COLORS[0],
    'reading_time': 5,
    'view_count': 0,
}
