"""
Bulk post management interface for batch operations on blog posts.
"""

import tkinter as tk
from tkinter import ttk, messagebox
from typing import List, Optional, Dict, Set
import threading

from config.settings import FONTS, UI_THEME, PAGINATION
from services.supabase_service import supabase_service
from services.auth_service import auth_service
from models.post import Post
from utils.formatters import Formatter
from utils.helpers import UIHelper, DebugHelper
from utils.bulk_operations_logger import bulk_logger


class BulkPostManager:
    """Bulk post management interface."""
    
    def __init__(self, parent, main_window):
        self.parent = parent
        self.main_window = main_window
        self.posts: List[Post] = []
        self.selected_posts: Set[str] = set()  # Set of post IDs
        self.is_loading = False

        # Search and filter variables
        self.search_var = tk.StringVar()
        self.status_filter_var = tk.StringVar(value='all')

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
        """Setup the bulk post management UI."""
        # Main container
        self.main_frame = ttk.Frame(self.parent)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Header
        self.setup_header()
        
        # Toolbar
        self.setup_toolbar()
        
        # Bulk actions bar
        self.setup_bulk_actions()
        
        # Posts list with checkboxes
        self.setup_posts_list()
        
        # Footer
        self.setup_footer()
    
    def setup_header(self):
        """Setup header with title and stats."""
        header_frame = ttk.Frame(self.main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Title
        title_label = ttk.Label(header_frame, text="Bulk Post Management", font=FONTS['large_heading'])
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
        
        ttk.Button(actions_frame, text="Refresh", 
                  command=self.refresh_posts).pack(side=tk.LEFT)
    
    def setup_bulk_actions(self):
        """Setup bulk actions toolbar."""
        bulk_frame = ttk.LabelFrame(self.main_frame, text="Bulk Actions", padding=10)
        bulk_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Selection controls
        selection_frame = ttk.Frame(bulk_frame)
        selection_frame.pack(side=tk.LEFT)
        
        select_all_btn = ttk.Button(selection_frame, text="Select All",
                                   command=self.select_all_posts)
        select_all_btn.pack(side=tk.LEFT, padx=(0, 5))
        UIHelper.create_tooltip(select_all_btn, "Select all posts currently visible on this page")

        select_none_btn = ttk.Button(selection_frame, text="Select None",
                                   command=self.select_no_posts)
        select_none_btn.pack(side=tk.LEFT, padx=(0, 5))
        UIHelper.create_tooltip(select_none_btn, "Deselect all currently selected posts")

        invert_btn = ttk.Button(selection_frame, text="Invert Selection",
                              command=self.invert_selection)
        invert_btn.pack(side=tk.LEFT, padx=(0, 10))
        UIHelper.create_tooltip(invert_btn, "Invert the current selection (select unselected, deselect selected)")
        
        # Selection count
        self.selection_label = ttk.Label(selection_frame, text="0 selected", font=FONTS['small'])
        self.selection_label.pack(side=tk.LEFT, padx=(10, 0))
        
        # Bulk action buttons
        actions_frame = ttk.Frame(bulk_frame)
        actions_frame.pack(side=tk.RIGHT)
        
        self.publish_button = ttk.Button(actions_frame, text="Make Selected Public",
                                        command=self.make_selected_public, state='disabled')
        self.publish_button.pack(side=tk.LEFT, padx=(0, 5))
        UIHelper.create_tooltip(self.publish_button, "Change selected posts to published status, making them visible to all website visitors")

        self.private_button = ttk.Button(actions_frame, text="Make Selected Private",
                                        command=self.make_selected_private, state='disabled')
        self.private_button.pack(side=tk.LEFT, padx=(0, 5))
        UIHelper.create_tooltip(self.private_button, "Change selected posts to private status, hiding them from public view")

        self.draft_button = ttk.Button(actions_frame, text="Make Selected Draft",
                                      command=self.make_selected_draft, state='disabled')
        self.draft_button.pack(side=tk.LEFT)
        UIHelper.create_tooltip(self.draft_button, "Change selected posts to draft status, removing them from public view")
    
    def setup_posts_list(self):
        """Setup posts list with checkboxes."""
        # Create frame for treeview and scrollbars
        list_frame = ttk.Frame(self.main_frame)
        list_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Create treeview with checkbox column
        columns = ('selected', 'title', 'status', 'category', 'author', 'date', 'views', 'post_id')
        self.posts_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        self.posts_tree.heading('selected', text='☐')
        self.posts_tree.heading('title', text='Title')
        self.posts_tree.heading('status', text='Status')
        self.posts_tree.heading('category', text='Category')
        self.posts_tree.heading('author', text='Author')
        self.posts_tree.heading('date', text='Date')
        self.posts_tree.heading('views', text='Views')

        # Configure column widths
        self.posts_tree.column('selected', width=30, minwidth=30)
        self.posts_tree.column('title', width=280, minwidth=200)
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
        
        # Bind click to toggle selection
        self.posts_tree.bind('<Button-1>', self.on_tree_click)
        
        # Bind double-click to edit
        self.posts_tree.bind('<Double-1>', self.on_post_double_click)
    
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

        # Clear selection when loading new posts
        self.selected_posts.clear()

        self.populate_posts_list()
        self.update_stats()
        self.update_pagination_controls()
        self.update_selection_ui()
        self.set_status(f"Loaded {len(posts)} of {total_count} posts")

    def on_load_error(self, error_message: str):
        """Handle posts loading error."""
        self.is_loading = False
        self.hide_progress()
        self.set_status("Error loading posts")

        # Show detailed error message with troubleshooting steps
        detailed_error = f"Failed to load posts from the database:\n\n{error_message}\n\n"
        detailed_error += "Troubleshooting steps:\n"
        detailed_error += "1. Check your internet connection\n"
        detailed_error += "2. Verify the Supabase service is accessible\n"
        detailed_error += "3. Check your authentication status\n"
        detailed_error += "4. Try refreshing the page\n"
        detailed_error += "5. Contact support if the issue persists\n\n"
        detailed_error += "You can try clicking 'Refresh' to reload the posts."

        UIHelper.show_error(self.main_frame, "Failed to Load Posts", detailed_error)

    def populate_posts_list(self):
        """Populate the posts treeview."""
        # Clear existing items
        for item in self.posts_tree.get_children():
            self.posts_tree.delete(item)

        # Add posts
        for post in self.posts:
            # Format data for display
            selected_icon = '☑' if post.id in self.selected_posts else '☐'
            title = Formatter.truncate_text(post.get_display_title(), 50)
            status = Formatter.format_post_status(post.status)
            category = post.get_category_name()
            author = post.get_author_name()
            date = Formatter.format_date(post.published_at or post.created_at)
            views = Formatter.format_number(post.view_count)

            # Insert item with post_id in the values
            item_id = self.posts_tree.insert('', tk.END, values=(selected_icon, title, status, category, author, date, views, post.id))

    def update_stats(self):
        """Update statistics display."""
        total = len(self.posts)
        published = len([p for p in self.posts if p.status == 'published'])
        drafts = len([p for p in self.posts if p.status == 'draft'])
        private = len([p for p in self.posts if p.status == 'private'])

        stats_text = f"Total: {total} | Published: {published} | Drafts: {drafts} | Private: {private}"
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

    def on_tree_click(self, event):
        """Handle tree click to toggle selection."""
        region = self.posts_tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.posts_tree.identify_row(event.y)
            column = self.posts_tree.identify_column(event.x)

            # Check if clicked on the selection column
            if column == '#1' and item:  # First column is selection
                self.toggle_post_selection(item)
                return "break"  # Prevent default selection behavior

    def on_post_double_click(self, event):
        """Handle double-click on post to edit."""
        item = self.posts_tree.identify_row(event.y)
        if item:
            values = self.posts_tree.item(item, 'values')
            if len(values) > 7:  # post_id is at index 7
                post_id = values[7]

                # Find post in list
                for post in self.posts:
                    if post.id == post_id:
                        if auth_service.can_edit_post(post.author_id):
                            self.main_window.edit_post(post.id)
                        else:
                            UIHelper.show_error(self.main_frame, "Permission Denied",
                                              "You don't have permission to edit this post.")
                        break

    def toggle_post_selection(self, item):
        """Toggle selection state of a post."""
        values = self.posts_tree.item(item, 'values')
        if len(values) > 7:  # post_id is at index 7
            post_id = values[7]

            if post_id in self.selected_posts:
                self.selected_posts.remove(post_id)
                new_icon = '☐'
            else:
                self.selected_posts.add(post_id)
                new_icon = '☑'

            # Update the display
            new_values = list(values)
            new_values[0] = new_icon
            self.posts_tree.item(item, values=new_values)

            self.update_selection_ui()

    def select_all_posts(self):
        """Select all visible posts."""
        self.selected_posts.clear()
        for post in self.posts:
            self.selected_posts.add(post.id)

        self.populate_posts_list()  # Refresh display
        self.update_selection_ui()

    def select_no_posts(self):
        """Deselect all posts."""
        self.selected_posts.clear()
        self.populate_posts_list()  # Refresh display
        self.update_selection_ui()

    def invert_selection(self):
        """Invert current selection."""
        current_page_post_ids = {post.id for post in self.posts}

        # Invert selection for current page posts
        new_selection = set()
        for post_id in current_page_post_ids:
            if post_id not in self.selected_posts:
                new_selection.add(post_id)

        # Keep selections from other pages
        for post_id in self.selected_posts:
            if post_id not in current_page_post_ids:
                new_selection.add(post_id)

        self.selected_posts = new_selection
        self.populate_posts_list()  # Refresh display
        self.update_selection_ui()

    def update_selection_ui(self):
        """Update selection-related UI elements."""
        selected_count = len(self.selected_posts)
        self.selection_label.config(text=f"{selected_count} selected")

        # Enable/disable bulk action buttons
        has_selection = selected_count > 0
        self.publish_button.config(state='normal' if has_selection else 'disabled')
        self.private_button.config(state='normal' if has_selection else 'disabled')
        self.draft_button.config(state='normal' if has_selection else 'disabled')

    def make_selected_public(self):
        """Make selected posts public (published)."""
        self._bulk_update_status('published', 'public')

    def make_selected_private(self):
        """Make selected posts private."""
        self._bulk_update_status('private', 'private')

    def make_selected_draft(self):
        """Make selected posts draft."""
        self._bulk_update_status('draft', 'draft')

    def _bulk_update_status(self, status: str, status_display: str):
        """Perform bulk status update."""
        # Validation checks
        if not self.selected_posts:
            UIHelper.show_warning(self.main_frame, "No Selection",
                                "Please select at least one post to update.\n\n"
                                "Use the checkboxes in the first column to select posts, "
                                "or use the 'Select All' button to select all visible posts.")
            return

        if not auth_service.has_admin_access():
            UIHelper.show_error(self.main_frame, "Permission Denied",
                              "You don't have permission to perform bulk operations.\n\n"
                              "Bulk operations require administrator or editor privileges. "
                              "Please contact your administrator if you need access.")
            return

        selected_count = len(self.selected_posts)

        # Additional validation for large operations
        if selected_count > 100:
            if not UIHelper.confirm_action(self.main_frame, "Large Bulk Operation",
                                         f"You are about to update {selected_count} posts, which is a large operation.\n\n"
                                         f"This may take several minutes to complete and cannot be undone.\n\n"
                                         f"Are you sure you want to continue?"):
                return

        # Confirm action
        confirmation_message = f"Are you sure you want to make {selected_count} selected posts {status_display}?\n\n"

        if status == 'published':
            confirmation_message += "This will make the posts visible to all website visitors.\n"
        elif status == 'private':
            confirmation_message += "This will hide the posts from public view.\n"
        elif status == 'draft':
            confirmation_message += "This will change the posts to draft status.\n"

        confirmation_message += "\nThis action cannot be undone."

        if not UIHelper.confirm_action(self.main_frame, "Confirm Bulk Update", confirmation_message):
            return

        # Get current user ID for logging
        user_id = auth_service.get_current_user().id if auth_service.get_current_user() else None

        # Log the operation start
        post_ids = list(self.selected_posts)
        operation_id = bulk_logger.log_bulk_operation_start(
            operation_type="status_update",
            post_ids=post_ids,
            target_status=status,
            user_id=user_id
        )

        self.set_status(f"Updating {selected_count} posts to {status_display}...")
        self.show_progress()

        # Disable bulk action buttons during operation
        self.publish_button.config(state='disabled')
        self.private_button.config(state='disabled')
        self.draft_button.config(state='disabled')

        def update_worker():
            try:
                success, message, updated_count = supabase_service.bulk_update_post_status(post_ids, status)

                # Calculate failed count
                failed_count = len(post_ids) - updated_count

                # Log the operation result
                bulk_logger.log_bulk_operation_complete(
                    operation_id=operation_id,
                    success=success,
                    updated_count=updated_count,
                    failed_count=failed_count,
                    error_message=message if not success else None
                )

                self.main_frame.after(0, lambda: self.on_bulk_update_complete(success, message, updated_count, status_display))

            except Exception as e:
                error_msg = f"Bulk update error: {str(e)}"

                # Log the error
                bulk_logger.log_bulk_operation_complete(
                    operation_id=operation_id,
                    success=False,
                    updated_count=0,
                    failed_count=len(post_ids),
                    error_message=error_msg
                )

                self.main_frame.after(0, lambda: self.on_bulk_update_error(error_msg))

        thread = threading.Thread(target=update_worker, daemon=True)
        thread.start()

    def on_bulk_update_complete(self, success: bool, message: str, updated_count: int, status_display: str):
        """Handle bulk update completion."""
        self.hide_progress()
        self.update_selection_ui()  # Re-enable buttons

        if success:
            self.set_status(f"Successfully updated {updated_count} posts")

            # Show detailed success message
            success_message = f"Successfully updated {updated_count} posts to {status_display}."
            if updated_count != len(self.selected_posts):
                failed_count = len(self.selected_posts) - updated_count
                success_message += f"\n\n{failed_count} posts could not be updated. This may be due to permission restrictions or database constraints."

            UIHelper.show_success(self.main_frame, "Bulk Update Complete", success_message)

            # Clear selection and refresh posts
            self.selected_posts.clear()
            self.refresh_posts()
        else:
            self.set_status("Bulk update failed")

            # Show detailed error message with troubleshooting tips
            error_message = f"Bulk update failed: {message}\n\n"
            error_message += "Possible causes:\n"
            error_message += "• Network connectivity issues\n"
            error_message += "• Database permission restrictions\n"
            error_message += "• Some posts may be locked by other users\n"
            error_message += "• Invalid post status transition\n\n"
            error_message += "Please check your connection and try again. If the problem persists, contact your administrator."

            UIHelper.show_error(self.main_frame, "Bulk Update Failed", error_message)

    def on_bulk_update_error(self, error_message: str):
        """Handle bulk update error."""
        self.hide_progress()
        self.update_selection_ui()  # Re-enable buttons
        self.set_status("Bulk update failed")

        # Show detailed error message with troubleshooting information
        detailed_error = f"An unexpected error occurred during the bulk update:\n\n{error_message}\n\n"
        detailed_error += "Troubleshooting steps:\n"
        detailed_error += "1. Check your internet connection\n"
        detailed_error += "2. Verify you have the necessary permissions\n"
        detailed_error += "3. Try updating fewer posts at once\n"
        detailed_error += "4. Refresh the page and try again\n"
        detailed_error += "5. Contact support if the issue persists\n\n"
        detailed_error += "The error has been logged for further investigation."

        UIHelper.show_error(self.main_frame, "Bulk Update Error", detailed_error)

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
