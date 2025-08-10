"""
Validation utilities for the blog admin desktop application.
"""

import re
from typing import Tuple, Optional
from config.settings import VALIDATION_RULES


class Validator:
    """Utility class for input validation."""
    
    @staticmethod
    def validate_title(title: str) -> Tuple[bool, str]:
        """Validate post title."""
        if not title or not title.strip():
            return False, "Title is required"
        
        title = title.strip()
        rules = VALIDATION_RULES['title']
        
        if len(title) < rules['min_length']:
            return False, f"Title must be at least {rules['min_length']} character(s)"
        
        if len(title) > rules['max_length']:
            return False, f"Title must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_slug(slug: str) -> Tuple[bool, str]:
        """Validate post slug."""
        if not slug or not slug.strip():
            return False, "Slug is required"
        
        slug = slug.strip().lower()
        rules = VALIDATION_RULES['slug']
        
        if len(slug) < rules['min_length']:
            return False, f"Slug must be at least {rules['min_length']} character(s)"
        
        if len(slug) > rules['max_length']:
            return False, f"Slug must not exceed {rules['max_length']} characters"
        
        if not re.match(rules['pattern'], slug):
            return False, "Slug can only contain lowercase letters, numbers, and hyphens"
        
        if slug.startswith('-') or slug.endswith('-'):
            return False, "Slug cannot start or end with a hyphen"
        
        if '--' in slug:
            return False, "Slug cannot contain consecutive hyphens"
        
        return True, ""
    
    @staticmethod
    def validate_content(content: str) -> Tuple[bool, str]:
        """Validate post content."""
        if not content or not content.strip():
            return False, "Content is required"
        
        content = content.strip()
        rules = VALIDATION_RULES['content']
        
        if len(content) < rules['min_length']:
            return False, f"Content must be at least {rules['min_length']} character(s)"
        
        return True, ""
    
    @staticmethod
    def validate_excerpt(excerpt: Optional[str]) -> Tuple[bool, str]:
        """Validate post excerpt."""
        if not excerpt:
            return True, ""  # Excerpt is optional
        
        excerpt = excerpt.strip()
        rules = VALIDATION_RULES['excerpt']
        
        if len(excerpt) > rules['max_length']:
            return False, f"Excerpt must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_meta_title(meta_title: Optional[str]) -> Tuple[bool, str]:
        """Validate meta title."""
        if not meta_title:
            return True, ""  # Meta title is optional
        
        meta_title = meta_title.strip()
        rules = VALIDATION_RULES['meta_title']
        
        if len(meta_title) > rules['max_length']:
            return False, f"Meta title must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_meta_description(meta_description: Optional[str]) -> Tuple[bool, str]:
        """Validate meta description."""
        if not meta_description:
            return True, ""  # Meta description is optional
        
        meta_description = meta_description.strip()
        rules = VALIDATION_RULES['meta_description']
        
        if len(meta_description) > rules['max_length']:
            return False, f"Meta description must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_category_name(name: str) -> Tuple[bool, str]:
        """Validate category name."""
        if not name or not name.strip():
            return False, "Category name is required"
        
        name = name.strip()
        rules = VALIDATION_RULES['category_name']
        
        if len(name) < rules['min_length']:
            return False, f"Category name must be at least {rules['min_length']} character(s)"
        
        if len(name) > rules['max_length']:
            return False, f"Category name must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_tag_name(name: str) -> Tuple[bool, str]:
        """Validate tag name."""
        if not name or not name.strip():
            return False, "Tag name is required"
        
        name = name.strip()
        rules = VALIDATION_RULES['tag_name']
        
        if len(name) < rules['min_length']:
            return False, f"Tag name must be at least {rules['min_length']} character(s)"
        
        if len(name) > rules['max_length']:
            return False, f"Tag name must not exceed {rules['max_length']} characters"
        
        return True, ""
    
    @staticmethod
    def validate_email(email: str) -> Tuple[bool, str]:
        """Validate email address."""
        if not email or not email.strip():
            return False, "Email is required"
        
        email = email.strip().lower()
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(pattern, email):
            return False, "Please enter a valid email address"
        
        return True, ""
    
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, str]:
        """Validate password."""
        if not password:
            return False, "Password is required"
        
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        
        return True, ""
    
    @staticmethod
    def validate_color(color: str) -> Tuple[bool, str]:
        """Validate hex color code."""
        if not color:
            return False, "Color is required"
        
        color = color.strip()
        
        # Check if it's a valid hex color
        if not re.match(r'^#[0-9A-Fa-f]{6}$', color):
            return False, "Color must be a valid hex code (e.g., #6366f1)"
        
        return True, ""
    
    @staticmethod
    def validate_url(url: Optional[str]) -> Tuple[bool, str]:
        """Validate URL."""
        if not url:
            return True, ""  # URL is optional
        
        url = url.strip()
        pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        
        if not re.match(pattern, url):
            return False, "Please enter a valid URL (must start with http:// or https://)"
        
        return True, ""
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe storage."""
        # Remove or replace unsafe characters
        safe_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_."
        sanitized = ''.join(c if c in safe_chars else '_' for c in filename)
        
        # Remove multiple consecutive underscores
        while '__' in sanitized:
            sanitized = sanitized.replace('__', '_')
        
        # Remove leading/trailing underscores and dots
        sanitized = sanitized.strip('_.')
        
        return sanitized or 'unnamed'
    
    @staticmethod
    def generate_slug(text: str) -> str:
        """Generate a URL-friendly slug from text."""
        from slugify import slugify
        return slugify(text, max_length=200, word_boundary=True)
    
    @staticmethod
    def validate_post_data(post_data: dict) -> Tuple[bool, list]:
        """Validate complete post data."""
        errors = []
        
        # Validate title
        valid, error = Validator.validate_title(post_data.get('title', ''))
        if not valid:
            errors.append(f"Title: {error}")
        
        # Validate slug
        valid, error = Validator.validate_slug(post_data.get('slug', ''))
        if not valid:
            errors.append(f"Slug: {error}")
        
        # Validate content
        valid, error = Validator.validate_content(post_data.get('content', ''))
        if not valid:
            errors.append(f"Content: {error}")
        
        # Validate excerpt
        valid, error = Validator.validate_excerpt(post_data.get('excerpt'))
        if not valid:
            errors.append(f"Excerpt: {error}")
        
        # Validate meta title
        valid, error = Validator.validate_meta_title(post_data.get('meta_title'))
        if not valid:
            errors.append(f"Meta Title: {error}")
        
        # Validate meta description
        valid, error = Validator.validate_meta_description(post_data.get('meta_description'))
        if not valid:
            errors.append(f"Meta Description: {error}")
        
        # Validate featured image URL if provided
        if post_data.get('featured_image_url'):
            valid, error = Validator.validate_url(post_data['featured_image_url'])
            if not valid:
                errors.append(f"Featured Image URL: {error}")
        
        return len(errors) == 0, errors
