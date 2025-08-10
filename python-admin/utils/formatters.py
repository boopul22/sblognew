"""
Text formatting utilities for the blog admin desktop application.
"""

import re
from datetime import datetime
from typing import Optional


class Formatter:
    """Utility class for text formatting."""
    
    @staticmethod
    def format_datetime(dt: Optional[datetime], format_str: str = "%Y-%m-%d %H:%M") -> str:
        """Format datetime object to string."""
        if not dt:
            return "Not set"
        return dt.strftime(format_str)
    
    @staticmethod
    def format_date(dt: Optional[datetime], format_str: str = "%Y-%m-%d") -> str:
        """Format datetime object to date string."""
        if not dt:
            return "Not set"
        return dt.strftime(format_str)
    
    @staticmethod
    def format_time_ago(dt: Optional[datetime]) -> str:
        """Format datetime as time ago (e.g., '2 hours ago')."""
        if not dt:
            return "Unknown"
        
        now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
        diff = now - dt
        
        seconds = diff.total_seconds()
        
        if seconds < 60:
            return "Just now"
        elif seconds < 3600:
            minutes = int(seconds // 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif seconds < 86400:
            hours = int(seconds // 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif seconds < 2592000:  # 30 days
            days = int(seconds // 86400)
            return f"{days} day{'s' if days != 1 else ''} ago"
        elif seconds < 31536000:  # 365 days
            months = int(seconds // 2592000)
            return f"{months} month{'s' if months != 1 else ''} ago"
        else:
            years = int(seconds // 31536000)
            return f"{years} year{'s' if years != 1 else ''} ago"
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
        """Truncate text to specified length."""
        if not text:
            return ""
        
        if len(text) <= max_length:
            return text
        
        return text[:max_length - len(suffix)].rstrip() + suffix
    
    @staticmethod
    def format_file_size(size_bytes: int) -> str:
        """Format file size in human readable format."""
        if size_bytes == 0:
            return "0 B"
        
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        size = float(size_bytes)
        
        while size >= 1024.0 and i < len(size_names) - 1:
            size /= 1024.0
            i += 1
        
        return f"{size:.1f} {size_names[i]}"
    
    @staticmethod
    def format_number(number: int) -> str:
        """Format number with thousand separators."""
        return f"{number:,}"
    
    @staticmethod
    def clean_html(text: str) -> str:
        """Remove HTML tags from text."""
        if not text:
            return ""
        
        # Remove HTML tags
        clean = re.sub(r'<[^>]+>', '', text)
        
        # Replace HTML entities
        clean = clean.replace('&amp;', '&')
        clean = clean.replace('&lt;', '<')
        clean = clean.replace('&gt;', '>')
        clean = clean.replace('&quot;', '"')
        clean = clean.replace('&#39;', "'")
        clean = clean.replace('&nbsp;', ' ')
        
        return clean.strip()
    
    @staticmethod
    def extract_excerpt(content: str, max_length: int = 150) -> str:
        """Extract excerpt from content."""
        if not content:
            return ""
        
        # Clean HTML first
        clean_content = Formatter.clean_html(content)
        
        # Remove extra whitespace
        clean_content = re.sub(r'\s+', ' ', clean_content).strip()
        
        # Truncate to max length
        if len(clean_content) <= max_length:
            return clean_content
        
        # Find the last complete word within the limit
        truncated = clean_content[:max_length]
        last_space = truncated.rfind(' ')
        
        if last_space > max_length * 0.8:  # If we can find a space reasonably close to the end
            return truncated[:last_space] + "..."
        else:
            return truncated + "..."
    
    @staticmethod
    def format_post_status(status: str) -> str:
        """Format post status for display."""
        status_map = {
            'draft': 'Draft',
            'published': 'Published',
            'private': 'Private',
            'pending': 'Pending Review',
            'trash': 'Trash'
        }
        return status_map.get(status.lower(), status.title())
    
    @staticmethod
    def format_user_role(role: str) -> str:
        """Format user role for display."""
        role_map = {
            'admin': 'Administrator',
            'editor': 'Editor',
            'author': 'Author',
            'contributor': 'Contributor',
            'subscriber': 'Subscriber',
            'user': 'User'
        }
        return role_map.get(role.lower(), role.title())
    
    @staticmethod
    def capitalize_words(text: str) -> str:
        """Capitalize each word in text."""
        if not text:
            return ""
        return ' '.join(word.capitalize() for word in text.split())
    
    @staticmethod
    def format_tag_list(tags: list) -> str:
        """Format list of tags for display."""
        if not tags:
            return "No tags"
        
        if isinstance(tags[0], str):
            return ", ".join(tags)
        else:
            # Assume tags are objects with name attribute
            return ", ".join(tag.name for tag in tags if hasattr(tag, 'name'))
    
    @staticmethod
    def format_reading_time(minutes: Optional[int]) -> str:
        """Format reading time for display."""
        if not minutes or minutes <= 0:
            return "Unknown"
        
        if minutes == 1:
            return "1 minute read"
        else:
            return f"{minutes} minutes read"
    
    @staticmethod
    def format_view_count(count: int) -> str:
        """Format view count for display."""
        if count == 0:
            return "No views"
        elif count == 1:
            return "1 view"
        elif count < 1000:
            return f"{count} views"
        elif count < 1000000:
            return f"{count/1000:.1f}K views"
        else:
            return f"{count/1000000:.1f}M views"
    
    @staticmethod
    def validate_and_format_slug(text: str) -> str:
        """Create a valid slug from text."""
        if not text:
            return ""
        
        # Convert to lowercase
        slug = text.lower()
        
        # Replace spaces and special characters with hyphens
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        
        return slug
    
    @staticmethod
    def format_markdown_preview(markdown_text: str, max_length: int = 200) -> str:
        """Create a preview of markdown text."""
        if not markdown_text:
            return ""
        
        # Remove markdown formatting for preview
        preview = markdown_text
        
        # Remove headers
        preview = re.sub(r'^#+\s*', '', preview, flags=re.MULTILINE)
        
        # Remove bold/italic
        preview = re.sub(r'\*\*([^*]+)\*\*', r'\1', preview)
        preview = re.sub(r'\*([^*]+)\*', r'\1', preview)
        
        # Remove links
        preview = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', preview)
        
        # Remove code blocks
        preview = re.sub(r'```[^`]*```', '', preview, flags=re.DOTALL)
        preview = re.sub(r'`([^`]+)`', r'\1', preview)
        
        # Clean up whitespace
        preview = re.sub(r'\s+', ' ', preview).strip()
        
        return Formatter.truncate_text(preview, max_length)
