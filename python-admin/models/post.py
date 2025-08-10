"""
Post data model for the blog admin desktop application.
Matches the database schema and provides data validation.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Dict, Any
from .category import Category
from .tag import Tag


@dataclass
class User:
    """User model for post authors."""
    id: str
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    user_login: Optional[str] = None
    user_url: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str = 'user'
    wp_id: Optional[int] = None
    registered_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create User instance from dictionary."""
        return cls(
            id=data['id'],
            email=data.get('email'),
            username=data.get('username'),
            full_name=data.get('full_name'),
            display_name=data.get('display_name'),
            user_login=data.get('user_login'),
            user_url=data.get('user_url'),
            avatar_url=data.get('avatar_url'),
            bio=data.get('bio'),
            role=data.get('role', 'user'),
            wp_id=data.get('wp_id'),
            registered_at=cls._parse_datetime(data.get('registered_at')),
            created_at=cls._parse_datetime(data.get('created_at')),
            updated_at=cls._parse_datetime(data.get('updated_at')),
        )
    
    @staticmethod
    def _parse_datetime(date_str: Optional[str]) -> Optional[datetime]:
        """Parse datetime string."""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return None


@dataclass
class Post:
    """Post model matching the database schema."""
    id: Optional[str] = None
    title: str = ''
    slug: str = ''
    content: str = ''
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    featured_image_url: Optional[str] = None
    status: str = 'draft'
    author_id: Optional[str] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = field(default_factory=list)
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    reading_time: Optional[int] = None
    view_count: int = 0
    wp_id: Optional[int] = None
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Related data
    author: Optional[User] = None
    category: Optional[Category] = None
    post_tags: Optional[List[Tag]] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Post':
        """Create Post instance from dictionary."""
        post = cls(
            id=data.get('id'),
            title=data.get('title', ''),
            slug=data.get('slug', ''),
            content=data.get('content', ''),
            excerpt=data.get('excerpt'),
            featured_image=data.get('featured_image'),
            featured_image_url=data.get('featured_image_url'),
            status=data.get('status', 'draft'),
            author_id=data.get('author_id'),
            category_id=data.get('category_id'),
            tags=data.get('tags', []),
            meta_title=data.get('meta_title'),
            meta_description=data.get('meta_description'),
            reading_time=data.get('reading_time'),
            view_count=data.get('view_count', 0),
            wp_id=data.get('wp_id'),
            published_at=cls._parse_datetime(data.get('published_at')),
            created_at=cls._parse_datetime(data.get('created_at')),
            updated_at=cls._parse_datetime(data.get('updated_at')),
        )
        
        # Parse related data
        if 'users' in data and data['users']:
            if isinstance(data['users'], list) and len(data['users']) > 0:
                post.author = User.from_dict(data['users'][0])
            elif isinstance(data['users'], dict):
                post.author = User.from_dict(data['users'])
        
        if 'post_categories' in data and data['post_categories']:
            categories = data['post_categories']
            if isinstance(categories, list) and len(categories) > 0:
                if 'categories' in categories[0]:
                    post.category = Category.from_dict(categories[0]['categories'])
        
        if 'post_tags' in data and data['post_tags']:
            post.post_tags = []
            for tag_data in data['post_tags']:
                if 'tags' in tag_data:
                    post.post_tags.append(Tag.from_dict(tag_data['tags']))
        
        return post
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert Post instance to dictionary for API calls."""
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'featured_image_url': self.featured_image_url,
            'status': self.status,
            'author_id': self.author_id,
            'category_id': self.category_id,
            'tags': self.tags,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'reading_time': self.reading_time,
            'view_count': self.view_count,
            'wp_id': self.wp_id,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    @staticmethod
    def _parse_datetime(date_str: Optional[str]) -> Optional[datetime]:
        """Parse datetime string."""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return None
    
    def is_published(self) -> bool:
        """Check if post is published."""
        return self.status == 'published'
    
    def is_draft(self) -> bool:
        """Check if post is draft."""
        return self.status == 'draft'
    
    def get_display_title(self) -> str:
        """Get display title with fallback."""
        return self.title or 'Untitled Post'
    
    def get_display_excerpt(self) -> str:
        """Get display excerpt with fallback."""
        if self.excerpt:
            return self.excerpt
        if self.content:
            # Return first 150 characters of content
            return (self.content[:150] + '...') if len(self.content) > 150 else self.content
        return 'No excerpt available'
    
    def get_tag_names(self) -> List[str]:
        """Get list of tag names."""
        if self.post_tags:
            return [tag.name for tag in self.post_tags]
        return self.tags or []
    
    def get_category_name(self) -> str:
        """Get category name with fallback."""
        if self.category:
            return self.category.name
        return 'Uncategorized'
    
    def get_author_name(self) -> str:
        """Get author name with fallback."""
        if self.author:
            return self.author.display_name or self.author.username or self.author.full_name or 'Unknown Author'
        return 'Unknown Author'
