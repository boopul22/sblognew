"""
Category data model for the blog admin desktop application.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any


@dataclass
class Category:
    """Category model matching the database schema."""
    id: Optional[str] = None
    name: str = ''
    slug: str = ''
    description: Optional[str] = None
    color: str = '#6366f1'
    parent_id: Optional[str] = None
    wp_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Category':
        """Create Category instance from dictionary."""
        return cls(
            id=data.get('id'),
            name=data.get('name', ''),
            slug=data.get('slug', ''),
            description=data.get('description'),
            color=data.get('color', '#6366f1'),
            parent_id=data.get('parent_id'),
            wp_id=data.get('wp_id'),
            created_at=cls._parse_datetime(data.get('created_at')),
            updated_at=cls._parse_datetime(data.get('updated_at')),
        )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert Category instance to dictionary for API calls."""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'color': self.color,
            'parent_id': self.parent_id,
            'wp_id': self.wp_id,
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
    
    def get_display_name(self) -> str:
        """Get display name with fallback."""
        return self.name or 'Unnamed Category'
    
    def __str__(self) -> str:
        """String representation."""
        return self.get_display_name()
    
    def __repr__(self) -> str:
        """Detailed string representation."""
        return f"Category(id='{self.id}', name='{self.name}', slug='{self.slug}')"
