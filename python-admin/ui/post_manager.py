"""
Post management interface for listing, editing, and deleting blog posts.
"""

import tkinter as tk
from tkinter import ttk, messagebox
from typing import List, Optional
import threading

from config.settings import FONTS, UI_THEME, PAGINATION
from services.supabase_service import supabase_service
from services.auth_service import auth_service
from models.post import Post
from utils.formatters import Formatter
from utils.helpers import UIHelper


class PostManager:
    """Post management interface."""
    
    def __init__(self, parent, main_window, status_filter: Optional[str] = None):
        self.parent = parent
        self.main_window = main_window
        self.status_filter = status_filter
        self.posts: List[Post] = []
        self.is_loading = False

        # Search and filter variables
        self.search_var = tk.StringVar()
        self.status_filter_var = tk.StringVar(value=status_filter or 'all')

        # Pagination variables
        self.current_page = 1
        self.posts_per_page = PAGINATION['posts_per_page']
        self.total_posts = 0
        self.total_pages = 1

        self.setup_ui()
        self.load_posts()

        # Bind search
        self.search_var.trace_add('write', self.on_search_change)
    
    def setup_ui(self):
        """Setup the post management UI."""
        # Main container
        self.main_frame = ttk.Frame(self.parent)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Header
        self.setup_header()
        
        # Toolbar
        self.setup_toolbar()
        
        # Posts list
        self.setup_posts_list()
        
        # Footer
        self.setup_footer()
    
    def setup_header(self):
        """Setup header with title and stats."""
        header_frame = ttk.Frame(self.main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Title
        title_text = "All Posts"
        if self.status_filter:
            title_text = f"{self.status_filter.title()} Posts"
        
        title_label = ttk.Label(header_frame, text=title_text, font=FONTS['large_heading'])
        title_label.pack(side=tk.LEFT)
        
        # Stats
        self.stats_label = ttk.Label(header_frame, text="", font=FONTS['small'])
        self.stats_label.pack(side=tk.RIGHT)
    
    def setup_toolbar(self):
        """Setup toolbar with search and filters."""
        toolbar_frame = ttk.Frame(self.main_frame)
        toolbar_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Left side - Search
        search_frame = ttk.Frame(toolbar_frame)
        search_frame.pack(side=tk.LEFT)
        
        ttk.Label(search_frame, text="Search:", font=FONTS['default']).pack(side=tk.LEFT)
        search_entry = ttk.Entry(search_frame, textvariable=self.search_var, width=30)
        search_entry.pack(side=tk.LEFT, padx=(5, 10))
        
        # Status filter
        ttk.Label(search_frame, text="Status:", font=FONTS['default']).pack(side=tk.LEFT)
        status_combo = ttk.Combobox(search_frame, textvariable=self.status_filter_var,
                                   values=['all', 'draft', 'published', 'private'],
                                   state="readonly", width=10)
        status_combo.pack(side=tk.LEFT, padx=(5, 0))
        status_combo.bind('<<ComboboxSelected>>', self.on_filter_change)
        
        # Right side - Actions
        actions_frame = ttk.Frame(toolbar_frame)
        actions_frame.pack(side=tk.RIGHT)
        
        ttk.Button(actions_frame, text="New Post", 
                  command=self.main_window.new_post).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(actions_frame, text="Refresh", 
                  command=self.refresh_posts).pack(side=tk.LEFT)
    
    def setup_posts_list(self):
        """Setup posts list with treeview."""
        # Create frame for treeview and scrollbars
        list_frame = ttk.Frame(self.main_frame)
        list_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Create treeview
        columns = ('title', 'status', 'category', 'author', 'date', 'views', 'post_id')
        self.posts_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        self.posts_tree.heading('title', text='Title')
        self.posts_tree.heading('status', text='Status')
        self.posts_tree.heading('category', text='Category')
        self.posts_tree.heading('author', text='Author')
        self.posts_tree.heading('date', text='Date')
        self.posts_tree.heading('views', text='Views')

        # Configure column widths
        self.posts_tree.column('title', width=300, minwidth=200)
        self.posts_tree.column('status', width=80, minwidth=60)
        self.posts_tree.column('category', width=120, minwidth=80)
        self.posts_tree.column('author', width=120, minwidth=80)
        self.posts_tree.column('date', width=100, minwidth=80)
        self.posts_tree.column('views', width=60, minwidth=50)

        # Hide the post_id column (used for data storage only)
        self.posts_tree.column('post_id', width=0, minwidth=0)
        self.posts_tree.heading('post_id', text='')
        
        # Add scrollbars
        v_scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.posts_tree.yview)
        h_scrollbar = ttk.Scrollbar(list_frame, orient=tk.HORIZONTAL, command=self.posts_tree.xview)
        
        self.posts_tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Pack treeview and scrollbars
        self.posts_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        v_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        h_scrollbar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Bind double-click to edit
        self.posts_tree.bind('<Double-1>', self.on_post_double_click)
        
        # Bind right-click for context menu
        self.posts_tree.bind('<Button-3>', self.show_context_menu)
        
        # Create context menu
        self.context_menu = tk.Menu(self.posts_tree, tearoff=0)
        self.context_menu.add_command(label="Edit", command=self.edit_selected_post)
        self.context_menu.add_command(label="Duplicate", command=self.duplicate_selected_post)
        self.context_menu.add_separator()
        self.context_menu.add_command(label="Delete", command=self.delete_selected_post)
    
    def setup_footer(self):
        """Setup footer with status and pagination."""
        footer_frame = ttk.Frame(self.main_frame)
        footer_frame.pack(fill=tk.X)

        # Left side - Status
        self.status_label = ttk.Label(footer_frame, text="Ready", font=FONTS['small'])
        self.status_label.pack(side=tk.LEFT)

        # Right side - Pagination controls
        pagination_frame = ttk.Frame(footer_frame)
        pagination_frame.pack(side=tk.RIGHT)

        # Pagination info
        self.pagination_info_label = ttk.Label(pagination_frame, text="", font=FONTS['small'])
        self.pagination_info_label.pack(side=tk.RIGHT, padx=(0, 10))

        # Pagination buttons
        self.next_button = ttk.Button(pagination_frame, text="Next →",
                                     command=self.next_page, state='disabled')
        self.next_button.pack(side=tk.RIGHT, padx=(5, 0))

        self.prev_button = ttk.Button(pagination_frame, text="← Previous",
                                     command=self.previous_page, state='disabled')
        self.prev_button.pack(side=tk.RIGHT)

        # Progress bar (hidden by default)
        self.progress_bar = ttk.Progressbar(footer_frame, mode='indeterminate')
    
    def load_posts(self):
        """Load posts from database."""
        if self.is_loading:
            return

        self.is_loading = True
        self.set_status("Loading posts...")
        self.show_progress()

        # Get filter values in main thread
        try:
            status_filter = self.status_filter_var.get() if self.status_filter_var.get() != 'all' else None
            search_query = self.search_var.get().strip() if self.search_var.get().strip() else None
        except:
            status_filter = None
            search_query = None

        def load_worker():
            try:
                # Calculate offset for pagination
                offset = (self.current_page - 1) * self.posts_per_page

                # Get posts with pagination
                posts = supabase_service.get_posts(
                    limit=self.posts_per_page,
                    offset=offset,
                    status=status_filter,
                    search=search_query
                )

                # Get total count for pagination
                total_count = supabase_service.get_posts_count(
                    status=status_filter,
                    search=search_query
                )

                # Schedule UI update
                self.main_frame.after(0, lambda: self.on_posts_loaded(posts, total_count))

            except Exception as e:
                self.main_frame.after(0, lambda: self.on_load_error(str(e)))

        thread = threading.Thread(target=load_worker, daemon=True)
        thread.start()
    
    def on_posts_loaded(self, posts: List[Post], total_count: int = 0):
        """Handle successful posts loading."""
        self.is_loading = False
        self.hide_progress()

        self.posts = posts
        self.total_posts = total_count
        self.total_pages = max(1, (total_count + self.posts_per_page - 1) // self.posts_per_page)

        self.populate_posts_list()
        self.update_stats()
        self.update_pagination_controls()
        self.set_status(f"Loaded {len(posts)} of {total_count} posts")
    
    def on_load_error(self, error_message: str):
        """Handle posts loading error."""
        self.is_loading = False
        self.hide_progress()
        self.set_status("Error loading posts")
        UIHelper.show_error(self.main_frame, "Load Error", f"Failed to load posts: {error_message}")
    
    def populate_posts_list(self):
        """Populate the posts treeview."""
        # Clear existing items
        for item in self.posts_tree.get_children():
            self.posts_tree.delete(item)
        
        # Add posts
        for post in self.posts:
            # Format data for display
            title = Formatter.truncate_text(post.get_display_title(), 50)
            status = Formatter.format_post_status(post.status)
            category = post.get_category_name()
            author = post.get_author_name()
            date = Formatter.format_date(post.published_at or post.created_at)
            views = Formatter.format_number(post.view_count)
            
            # Insert item with post_id in the values
            item_id = self.posts_tree.insert('', tk.END, values=(title, status, category, author, date, views, post.id))
    
    def update_stats(self):
        """Update statistics display."""
        total = len(self.posts)
        published = len([p for p in self.posts if p.status == 'published'])
        drafts = len([p for p in self.posts if p.status == 'draft'])
        
        stats_text = f"Total: {total} | Published: {published} | Drafts: {drafts}"
        self.stats_label.config(text=stats_text)
    
    def on_search_change(self, *args):
        """Handle search text change."""
        # Reset pagination when search changes
        self.reset_pagination()

        # Debounce search - reload after short delay
        if hasattr(self, '_search_timer'):
            self.main_frame.after_cancel(self._search_timer)

        self._search_timer = self.main_frame.after(500, self.load_posts)

    def on_filter_change(self, event=None):
        """Handle status filter change."""
        # Reset pagination when filter changes
        self.reset_pagination()
        self.load_posts()
    
    def refresh_posts(self):
        """Refresh posts list."""
        self.load_posts()
    
    def on_post_double_click(self, event):
        """Handle double-click on post."""
        self.edit_selected_post()
    
    def show_context_menu(self, event):
        """Show context menu."""
        # Select item under cursor
        item = self.posts_tree.identify_row(event.y)
        if item:
            self.posts_tree.selection_set(item)
            self.context_menu.post(event.x_root, event.y_root)
    
    def get_selected_post(self) -> Optional[Post]:
        """Get currently selected post."""
        selection = self.posts_tree.selection()
        if not selection:
            return None

        item = selection[0]
        values = self.posts_tree.item(item, 'values')
        if len(values) > 6:  # post_id is at index 6
            post_id = values[6]

            # Find post in list
            for post in self.posts:
                if post.id == post_id:
                    return post

        return None
    
    def edit_selected_post(self):
        """Edit selected post."""
        post = self.get_selected_post()
        if post:
            if auth_service.can_edit_post(post.author_id):
                self.main_window.edit_post(post.id)
            else:
                UIHelper.show_error(self.main_frame, "Permission Denied", 
                                  "You don't have permission to edit this post.")
    
    def duplicate_selected_post(self):
        """Duplicate selected post."""
        post = self.get_selected_post()
        if post and auth_service.can_create_posts():
            # TODO: Implement post duplication
            UIHelper.show_info(self.main_frame, "Not Implemented", "Post duplication is not yet implemented.")
    
    def delete_selected_post(self):
        """Delete selected post."""
        post = self.get_selected_post()
        if not post:
            return
        
        if not auth_service.can_delete_post(post.author_id):
            UIHelper.show_error(self.main_frame, "Permission Denied", 
                              "You don't have permission to delete this post.")
            return
        
        # Confirm deletion
        if not UIHelper.confirm_action(self.main_frame, "Delete Post", 
                                     f"Are you sure you want to delete '{post.get_display_title()}'?\n\nThis action cannot be undone."):
            return
        
        self.set_status("Deleting post...")
        self.show_progress()
        
        def delete_worker():
            try:
                success = supabase_service.delete_post(post.id)
                self.main_frame.after(0, lambda: self.on_delete_complete(success, post.get_display_title()))
            except Exception as e:
                self.main_frame.after(0, lambda: self.on_delete_error(str(e)))
        
        thread = threading.Thread(target=delete_worker, daemon=True)
        thread.start()
    
    def on_delete_complete(self, success: bool, post_title: str):
        """Handle delete completion."""
        self.hide_progress()
        
        if success:
            self.set_status("Post deleted successfully")
            UIHelper.show_success(self.main_frame, "Success", f"Post '{post_title}' deleted successfully!")
            self.refresh_posts()
        else:
            self.set_status("Delete failed")
            UIHelper.show_error(self.main_frame, "Delete Failed", "Failed to delete post. Please try again.")
    
    def on_delete_error(self, error_message: str):
        """Handle delete error."""
        self.hide_progress()
        self.set_status("Delete failed")
        UIHelper.show_error(self.main_frame, "Delete Error", f"Failed to delete post: {error_message}")
    
    def set_status(self, message: str):
        """Set status message."""
        self.status_label.config(text=message)
    
    def show_progress(self):
        """Show progress indicator."""
        self.progress_bar.pack(side=tk.RIGHT, padx=(10, 0))
        self.progress_bar.start()
    
    def hide_progress(self):
        """Hide progress indicator."""
        self.progress_bar.stop()
        self.progress_bar.pack_forget()

    def update_pagination_controls(self):
        """Update pagination controls based on current state."""
        # Update pagination info
        start_item = (self.current_page - 1) * self.posts_per_page + 1
        end_item = min(self.current_page * self.posts_per_page, self.total_posts)

        if self.total_posts > 0:
            info_text = f"Page {self.current_page} of {self.total_pages} ({start_item}-{end_item} of {self.total_posts})"
        else:
            info_text = "No posts found"

        self.pagination_info_label.config(text=info_text)

        # Update button states
        self.prev_button.config(state='normal' if self.current_page > 1 else 'disabled')
        self.next_button.config(state='normal' if self.current_page < self.total_pages else 'disabled')

    def previous_page(self):
        """Go to previous page."""
        if self.current_page > 1:
            self.current_page -= 1
            self.load_posts()

    def next_page(self):
        """Go to next page."""
        if self.current_page < self.total_pages:
            self.current_page += 1
            self.load_posts()

    def reset_pagination(self):
        """Reset pagination to first page."""
        self.current_page = 1
