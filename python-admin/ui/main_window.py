"""
Main window for the blog admin desktop application.
"""

import tkinter as tk
from tkinter import ttk, messagebox
import asyncio
from typing import Optional

from config.settings import WINDOW_CONFIG, UI_THEME, FONTS
from services.auth_service import auth_service
from utils.helpers import UIHelper, ConfigHelper, ThreadHelper
from .components.login_dialog import LoginDialog
from .post_manager import PostManager
from .post_editor import PostEditor
from .category_manager import CategoryManager
from .tag_manager import TagManager
from .bulk_post_manager import BulkPostManager


class MainWindow:
    """Main application window."""
    
    def __init__(self):
        self.root = tk.Tk()
        self.current_view: Optional[tk.Widget] = None
        self.setup_window()
        self.setup_menu()
        self.setup_ui()
        self.check_authentication()
    
    def setup_window(self):
        """Setup main window properties."""
        self.root.title(WINDOW_CONFIG['title'])
        self.root.geometry(WINDOW_CONFIG['geometry'])
        self.root.minsize(WINDOW_CONFIG['min_width'], WINDOW_CONFIG['min_height'])
        
        # Center window
        UIHelper.center_window(self.root, 1200, 800)
        
        # Configure style
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure colors
        self.root.configure(bg=UI_THEME['background_color'])
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def setup_menu(self):
        """Setup application menu bar."""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="New Post", command=self.new_post, accelerator="Ctrl+N")
        file_menu.add_separator()
        file_menu.add_command(label="Logout", command=self.logout)
        file_menu.add_command(label="Exit", command=self.on_closing, accelerator="Ctrl+Q")
        
        # Posts menu
        posts_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Posts", menu=posts_menu)
        posts_menu.add_command(label="All Posts", command=self.show_posts)
        posts_menu.add_command(label="New Post", command=self.new_post)
        posts_menu.add_separator()
        posts_menu.add_command(label="Bulk Management", command=self.show_bulk_posts)
        posts_menu.add_separator()
        posts_menu.add_command(label="Drafts", command=lambda: self.show_posts('draft'))
        posts_menu.add_command(label="Published", command=lambda: self.show_posts('published'))
        posts_menu.add_command(label="Private", command=lambda: self.show_posts('private'))
        
        # Content menu
        content_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Content", menu=content_menu)
        content_menu.add_command(label="Categories", command=self.show_categories)
        content_menu.add_command(label="Tags", command=self.show_tags)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)
        
        # Bind keyboard shortcuts
        self.root.bind('<Control-n>', lambda e: self.new_post())
        self.root.bind('<Control-q>', lambda e: self.on_closing())
    
    def setup_ui(self):
        """Setup main UI components."""
        # Create main container
        self.main_container = ttk.Frame(self.root)
        self.main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create toolbar
        self.setup_toolbar()
        
        # Create content area
        self.content_frame = ttk.Frame(self.main_container)
        self.content_frame.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        
        # Create status bar
        self.setup_status_bar()
    
    def setup_toolbar(self):
        """Setup toolbar with navigation buttons."""
        toolbar = ttk.Frame(self.main_container)
        toolbar.pack(fill=tk.X, pady=(0, 10))
        
        # Left side buttons
        left_frame = ttk.Frame(toolbar)
        left_frame.pack(side=tk.LEFT)
        
        ttk.Button(left_frame, text="All Posts", command=self.show_posts).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(left_frame, text="New Post", command=self.new_post).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(left_frame, text="Bulk Management", command=self.show_bulk_posts).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(left_frame, text="Categories", command=self.show_categories).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(left_frame, text="Tags", command=self.show_tags).pack(side=tk.LEFT, padx=(0, 5))
        
        # Right side info
        right_frame = ttk.Frame(toolbar)
        right_frame.pack(side=tk.RIGHT)
        
        self.user_label = ttk.Label(right_frame, text="Not logged in", font=FONTS['small'])
        self.user_label.pack(side=tk.RIGHT, padx=(5, 0))
        
        ttk.Button(right_frame, text="Logout", command=self.logout).pack(side=tk.RIGHT)
    
    def setup_status_bar(self):
        """Setup status bar."""
        self.status_bar = ttk.Frame(self.main_container)
        self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
        
        self.status_label = ttk.Label(self.status_bar, text="Ready", font=FONTS['small'])
        self.status_label.pack(side=tk.LEFT)
        
        # Progress bar (hidden by default)
        self.progress_bar = ttk.Progressbar(self.status_bar, mode='indeterminate')
    
    def check_authentication(self):
        """Check if user is authenticated, show login if not."""
        if not auth_service.is_authenticated:
            self.show_login()
        else:
            self.update_user_info()
            self.show_posts()
    
    def show_login(self):
        """Show login dialog."""
        login_dialog = LoginDialog(self.root)
        self.root.wait_window(login_dialog.dialog)
        
        if auth_service.is_authenticated:
            self.update_user_info()
            self.show_posts()
        else:
            self.root.quit()
    
    def update_user_info(self):
        """Update user information in UI."""
        if auth_service.is_authenticated:
            display_name = auth_service.get_display_name()
            role = auth_service.get_user_role()
            self.user_label.config(text=f"{display_name} ({role})")
        else:
            self.user_label.config(text="Not logged in")
    
    def logout(self):
        """Logout current user."""
        if UIHelper.confirm_action(self.root, "Logout", "Are you sure you want to logout?"):
            auth_service.logout()
            self.update_user_info()
            self.clear_content()
            self.show_login()
    
    def clear_content(self):
        """Clear current content view."""
        if self.current_view:
            try:
                if hasattr(self.current_view, 'main_frame'):
                    self.current_view.main_frame.destroy()
                elif hasattr(self.current_view, 'destroy'):
                    self.current_view.destroy()
            except Exception as e:
                print(f"Error clearing content: {e}")
            finally:
                self.current_view = None
    
    def show_posts(self, status_filter: Optional[str] = None):
        """Show posts management view."""
        if not auth_service.is_authenticated:
            self.show_login()
            return

        self.clear_content()
        self.current_view = PostManager(self.content_frame, self, status_filter)
        self.set_status("Posts loaded")

    def show_bulk_posts(self):
        """Show bulk post management view."""
        if not auth_service.is_authenticated:
            self.show_login()
            return

        if not auth_service.has_admin_access():
            UIHelper.show_error(self.root, "Permission Denied",
                              "You don't have permission to access bulk management features.")
            return

        self.clear_content()
        self.current_view = BulkPostManager(self.content_frame, self)
        self.set_status("Bulk post management loaded")
    
    def new_post(self):
        """Show new post editor."""
        if not auth_service.is_authenticated:
            self.show_login()
            return
        
        if not auth_service.can_create_posts():
            UIHelper.show_error(self.root, "Permission Denied", 
                              "You don't have permission to create posts.")
            return
        
        self.clear_content()
        self.current_view = PostEditor(self.content_frame, self)
        self.set_status("New post editor opened")
    
    def edit_post(self, post_id: str):
        """Show post editor for existing post."""
        if not auth_service.is_authenticated:
            self.show_login()
            return
        
        self.clear_content()
        self.current_view = PostEditor(self.content_frame, self, post_id)
        self.set_status(f"Editing post {post_id}")
    
    def show_categories(self):
        """Show categories management view."""
        if not auth_service.is_authenticated:
            self.show_login()
            return
        
        if not auth_service.can_manage_categories():
            UIHelper.show_error(self.root, "Permission Denied", 
                              "You don't have permission to manage categories.")
            return
        
        self.clear_content()
        self.current_view = CategoryManager(self.content_frame, self)
        self.set_status("Categories loaded")
    
    def show_tags(self):
        """Show tags management view."""
        if not auth_service.is_authenticated:
            self.show_login()
            return
        
        if not auth_service.can_manage_tags():
            UIHelper.show_error(self.root, "Permission Denied", 
                              "You don't have permission to manage tags.")
            return
        
        self.clear_content()
        self.current_view = TagManager(self.content_frame, self)
        self.set_status("Tags loaded")
    
    def show_about(self):
        """Show about dialog."""
        about_text = f"""Blog Admin Desktop v1.0.0

A desktop application for managing blog posts, categories, and tags.

Features:
• Create and edit blog posts
• Manage categories and tags
• Upload images to Cloudflare R2
• Real-time sync with Supabase database

Built with Python and Tkinter."""
        
        messagebox.showinfo("About", about_text, parent=self.root)
    
    def set_status(self, message: str):
        """Set status bar message."""
        self.status_label.config(text=message)
    
    def show_progress(self):
        """Show progress bar."""
        self.progress_bar.pack(side=tk.RIGHT, padx=(10, 0))
        self.progress_bar.start()
    
    def hide_progress(self):
        """Hide progress bar."""
        self.progress_bar.stop()
        self.progress_bar.pack_forget()
    
    def on_closing(self):
        """Handle window closing."""
        if UIHelper.confirm_action(self.root, "Exit", "Are you sure you want to exit?"):
            ConfigHelper.save_window_geometry(self.root)
            self.root.quit()
    
    def run(self):
        """Start the application."""
        try:
            self.root.mainloop()
        except KeyboardInterrupt:
            self.on_closing()
