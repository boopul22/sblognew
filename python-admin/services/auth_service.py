"""
Authentication service for the blog admin desktop application.
Handles user authentication and session management.
"""

from typing import Optional, Tuple
from services.supabase_service import supabase_service
from models.post import User


class AuthService:
    """Service class for handling authentication."""
    
    def __init__(self):
        self.current_user: Optional[User] = None
        self.is_authenticated: bool = False
    
    async def login(self, email: str, password: str) -> Tuple[bool, str]:
        """
        Authenticate user with email and password.
        
        Args:
            email: User's email address
            password: User's password
        
        Returns:
            Tuple of (success, message)
        """
        try:
            # Validate input
            if not email or not password:
                return False, "Email and password are required"
            
            if not self._is_valid_email(email):
                return False, "Please enter a valid email address"
            
            # Attempt authentication
            success, message = await supabase_service.sign_in(email.strip(), password)
            
            if success:
                self.current_user = supabase_service.get_current_user()
                self.is_authenticated = True
                
                # Check if user has admin/editor access
                if not self.has_admin_access():
                    self.logout()
                    return False, "Access denied. Admin or editor role required."
                
                return True, f"Welcome, {self.get_display_name()}!"
            else:
                return False, message
                
        except Exception as e:
            return False, f"Login failed: {str(e)}"
    
    def logout(self) -> None:
        """Sign out the current user."""
        try:
            supabase_service.sign_out()
            self.current_user = None
            self.is_authenticated = False
        except Exception as e:
            print(f"Logout error: {e}")
    
    def get_current_user(self) -> Optional[User]:
        """Get the current authenticated user."""
        return self.current_user
    
    def get_display_name(self) -> str:
        """Get display name for current user."""
        if not self.current_user:
            return "Unknown User"
        
        return (self.current_user.display_name or 
                self.current_user.username or 
                self.current_user.full_name or 
                self.current_user.email or 
                "Unknown User")
    
    def get_user_role(self) -> str:
        """Get current user's role."""
        if not self.current_user:
            return "guest"
        return self.current_user.role
    
    def has_admin_access(self) -> bool:
        """Check if current user has admin access."""
        if not self.current_user:
            return False
        return self.current_user.role in ['admin', 'editor']
    
    def is_admin(self) -> bool:
        """Check if current user is admin."""
        if not self.current_user:
            return False
        return self.current_user.role == 'admin'
    
    def is_editor(self) -> bool:
        """Check if current user is editor."""
        if not self.current_user:
            return False
        return self.current_user.role == 'editor'
    
    def can_create_posts(self) -> bool:
        """Check if user can create posts."""
        return self.has_admin_access()
    
    def can_edit_posts(self) -> bool:
        """Check if user can edit posts."""
        return self.has_admin_access()
    
    def can_delete_posts(self) -> bool:
        """Check if user can delete posts."""
        return self.has_admin_access()
    
    def can_manage_categories(self) -> bool:
        """Check if user can manage categories."""
        return self.has_admin_access()
    
    def can_manage_tags(self) -> bool:
        """Check if user can manage tags."""
        return self.has_admin_access()
    
    def can_upload_images(self) -> bool:
        """Check if user can upload images."""
        return self.has_admin_access()
    
    def can_publish_posts(self) -> bool:
        """Check if user can publish posts."""
        return self.has_admin_access()
    
    def can_edit_own_posts_only(self) -> bool:
        """Check if user can only edit their own posts."""
        return self.is_editor() and not self.is_admin()
    
    def can_edit_post(self, post_author_id: str) -> bool:
        """Check if user can edit a specific post."""
        if not self.has_admin_access():
            return False
        
        # Admins can edit any post
        if self.is_admin():
            return True
        
        # Editors can edit their own posts
        if self.is_editor() and self.current_user:
            return self.current_user.id == post_author_id
        
        return False
    
    def can_delete_post(self, post_author_id: str) -> bool:
        """Check if user can delete a specific post."""
        if not self.has_admin_access():
            return False
        
        # Only admins can delete posts
        if self.is_admin():
            return True
        
        # Editors can delete their own posts
        if self.is_editor() and self.current_user:
            return self.current_user.id == post_author_id
        
        return False
    
    def _is_valid_email(self, email: str) -> bool:
        """Validate email format."""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def get_session_info(self) -> dict:
        """Get current session information."""
        return {
            'is_authenticated': self.is_authenticated,
            'user_id': self.current_user.id if self.current_user else None,
            'display_name': self.get_display_name(),
            'role': self.get_user_role(),
            'permissions': {
                'can_create_posts': self.can_create_posts(),
                'can_edit_posts': self.can_edit_posts(),
                'can_delete_posts': self.can_delete_posts(),
                'can_manage_categories': self.can_manage_categories(),
                'can_manage_tags': self.can_manage_tags(),
                'can_upload_images': self.can_upload_images(),
                'can_publish_posts': self.can_publish_posts(),
                'is_admin': self.is_admin(),
                'is_editor': self.is_editor(),
            }
        }


# Global authentication service instance
auth_service = AuthService()
