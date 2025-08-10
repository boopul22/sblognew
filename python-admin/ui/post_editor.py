"""
Post editor component for creating and editing blog posts.
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from datetime import datetime
from typing import Optional, List
import threading

from config.settings import FONTS, UI_THEME, POST_STATUSES, EDITOR_CONFIG
from services.supabase_service import supabase_service
from services.storage_service import storage_service
from services.auth_service import auth_service
from models.post import Post
from models.category import Category
from models.tag import Tag
from utils.validators import Validator
from utils.formatters import Formatter
from utils.helpers import UIHelper, ThreadHelper


class PostEditor:
    """Post editor for creating and editing blog posts."""
    
    def __init__(self, parent, main_window, post_id: Optional[str] = None):
        self.parent = parent
        self.main_window = main_window
        self.post_id = post_id
        self.post: Optional[Post] = None
        self.categories: List[Category] = []
        self.tags: List[Tag] = []
        self.is_loading = False
        self.is_saving = False
        
        # Form variables
        self.title_var = tk.StringVar()
        self.slug_var = tk.StringVar()
        self.excerpt_var = tk.StringVar()
        self.status_var = tk.StringVar(value='draft')
        self.category_var = tk.StringVar()
        self.meta_title_var = tk.StringVar()
        self.meta_description_var = tk.StringVar()
        self.featured_image_var = tk.StringVar()
        
        self.setup_ui()
        self.load_data()
        
        # Auto-generate slug when title changes
        self.title_var.trace_add('write', self.on_title_change)
    
    def setup_ui(self):
        """Setup the post editor UI."""
        # Main container
        self.main_frame = ttk.Frame(self.parent)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Header
        self.setup_header()
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(self.main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        
        # Content tab
        self.setup_content_tab()
        
        # Settings tab
        self.setup_settings_tab()
        
        # SEO tab
        self.setup_seo_tab()
        
        # Footer with action buttons
        self.setup_footer()
    
    def setup_header(self):
        """Setup header with title and status."""
        header_frame = ttk.Frame(self.main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Title
        title_text = "Edit Post" if self.post_id else "New Post"
        title_label = ttk.Label(header_frame, text=title_text, font=FONTS['large_heading'])
        title_label.pack(side=tk.LEFT)
        
        # Status indicator
        self.status_label = ttk.Label(header_frame, text="", font=FONTS['small'])
        self.status_label.pack(side=tk.RIGHT)
    
    def setup_content_tab(self):
        """Setup the main content editing tab."""
        content_frame = ttk.Frame(self.notebook)
        self.notebook.add(content_frame, text="Content")
        
        # Create scrollable frame
        canvas = tk.Canvas(content_frame)
        scrollbar = ttk.Scrollbar(content_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Title field
        ttk.Label(scrollable_frame, text="Title *", font=FONTS['heading']).pack(anchor=tk.W, pady=(10, 5))
        title_entry = ttk.Entry(scrollable_frame, textvariable=self.title_var, font=FONTS['default'])
        title_entry.pack(fill=tk.X, pady=(0, 10))
        
        # Slug field
        ttk.Label(scrollable_frame, text="Slug *", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        slug_frame = ttk.Frame(scrollable_frame)
        slug_frame.pack(fill=tk.X, pady=(0, 10))
        
        slug_entry = ttk.Entry(slug_frame, textvariable=self.slug_var, font=FONTS['default'])
        slug_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        ttk.Button(slug_frame, text="Generate", command=self.generate_slug).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Content field
        ttk.Label(scrollable_frame, text="Content *", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        
        content_frame_inner = ttk.Frame(scrollable_frame)
        content_frame_inner.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        self.content_text = tk.Text(content_frame_inner, 
                                   font=EDITOR_CONFIG['font'],
                                   height=EDITOR_CONFIG['height'],
                                   wrap=EDITOR_CONFIG['wrap'],
                                   undo=EDITOR_CONFIG['undo'])
        
        content_scrollbar = ttk.Scrollbar(content_frame_inner, command=self.content_text.yview)
        self.content_text.configure(yscrollcommand=content_scrollbar.set)
        
        self.content_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        content_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Excerpt field
        ttk.Label(scrollable_frame, text="Excerpt", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        
        excerpt_frame = ttk.Frame(scrollable_frame)
        excerpt_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.excerpt_text = tk.Text(excerpt_frame, height=3, font=FONTS['default'], wrap=tk.WORD)
        excerpt_scrollbar = ttk.Scrollbar(excerpt_frame, command=self.excerpt_text.yview)
        self.excerpt_text.configure(yscrollcommand=excerpt_scrollbar.set)
        
        self.excerpt_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        excerpt_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Auto-generate excerpt button
        ttk.Button(scrollable_frame, text="Generate Excerpt from Content", 
                  command=self.generate_excerpt).pack(anchor=tk.W, pady=(0, 10))
    
    def setup_settings_tab(self):
        """Setup the post settings tab."""
        settings_frame = ttk.Frame(self.notebook)
        self.notebook.add(settings_frame, text="Settings")
        
        # Create scrollable frame
        canvas = tk.Canvas(settings_frame)
        scrollbar = ttk.Scrollbar(settings_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Status
        ttk.Label(scrollable_frame, text="Status", font=FONTS['heading']).pack(anchor=tk.W, pady=(10, 5))
        status_combo = ttk.Combobox(scrollable_frame, textvariable=self.status_var, 
                                   values=[status[0] for status in POST_STATUSES],
                                   state="readonly")
        status_combo.pack(fill=tk.X, pady=(0, 10))
        
        # Category
        ttk.Label(scrollable_frame, text="Category", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        self.category_combo = ttk.Combobox(scrollable_frame, textvariable=self.category_var, 
                                          state="readonly")
        self.category_combo.pack(fill=tk.X, pady=(0, 10))
        
        # Tags
        ttk.Label(scrollable_frame, text="Tags", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        
        tags_frame = ttk.Frame(scrollable_frame)
        tags_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Tags listbox with scrollbar
        tags_list_frame = ttk.Frame(tags_frame)
        tags_list_frame.pack(fill=tk.BOTH, expand=True)
        
        self.tags_listbox = tk.Listbox(tags_list_frame, selectmode=tk.MULTIPLE, height=6)
        tags_list_scrollbar = ttk.Scrollbar(tags_list_frame, command=self.tags_listbox.yview)
        self.tags_listbox.configure(yscrollcommand=tags_list_scrollbar.set)
        
        self.tags_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        tags_list_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Featured Image
        ttk.Label(scrollable_frame, text="Featured Image", font=FONTS['heading']).pack(anchor=tk.W, pady=(10, 5))
        
        image_frame = ttk.Frame(scrollable_frame)
        image_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.image_entry = ttk.Entry(image_frame, textvariable=self.featured_image_var, 
                                    font=FONTS['default'])
        self.image_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        ttk.Button(image_frame, text="Browse", command=self.browse_image).pack(side=tk.RIGHT, padx=(5, 0))
        ttk.Button(image_frame, text="Upload", command=self.upload_image).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Image preview (placeholder)
        self.image_preview_label = ttk.Label(scrollable_frame, text="No image selected")
        self.image_preview_label.pack(pady=(0, 10))
    
    def setup_seo_tab(self):
        """Setup the SEO settings tab."""
        seo_frame = ttk.Frame(self.notebook)
        self.notebook.add(seo_frame, text="SEO")
        
        # Create scrollable frame
        canvas = tk.Canvas(seo_frame)
        scrollbar = ttk.Scrollbar(seo_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Meta Title
        ttk.Label(scrollable_frame, text="Meta Title", font=FONTS['heading']).pack(anchor=tk.W, pady=(10, 5))
        meta_title_entry = ttk.Entry(scrollable_frame, textvariable=self.meta_title_var, 
                                    font=FONTS['default'])
        meta_title_entry.pack(fill=tk.X, pady=(0, 5))
        
        self.meta_title_count = ttk.Label(scrollable_frame, text="0/60 characters", 
                                         font=FONTS['small'])
        self.meta_title_count.pack(anchor=tk.W, pady=(0, 10))
        
        # Meta Description
        ttk.Label(scrollable_frame, text="Meta Description", font=FONTS['heading']).pack(anchor=tk.W, pady=(0, 5))
        
        meta_desc_frame = ttk.Frame(scrollable_frame)
        meta_desc_frame.pack(fill=tk.X, pady=(0, 5))
        
        self.meta_desc_text = tk.Text(meta_desc_frame, height=4, font=FONTS['default'], wrap=tk.WORD)
        meta_desc_scrollbar = ttk.Scrollbar(meta_desc_frame, command=self.meta_desc_text.yview)
        self.meta_desc_text.configure(yscrollcommand=meta_desc_scrollbar.set)
        
        self.meta_desc_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        meta_desc_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.meta_desc_count = ttk.Label(scrollable_frame, text="0/160 characters", 
                                        font=FONTS['small'])
        self.meta_desc_count.pack(anchor=tk.W, pady=(0, 10))
        
        # Auto-generate buttons
        ttk.Button(scrollable_frame, text="Generate Meta Title from Title", 
                  command=self.generate_meta_title).pack(anchor=tk.W, pady=(0, 5))
        ttk.Button(scrollable_frame, text="Generate Meta Description from Excerpt", 
                  command=self.generate_meta_description).pack(anchor=tk.W, pady=(0, 10))
        
        # Bind character counting
        self.meta_title_var.trace_add('write', self.update_meta_title_count)
        self.meta_desc_text.bind('<KeyRelease>', self.update_meta_desc_count)
    
    def setup_footer(self):
        """Setup footer with action buttons."""
        footer_frame = ttk.Frame(self.main_frame)
        footer_frame.pack(fill=tk.X, pady=(10, 0))
        
        # Left side - Back button
        ttk.Button(footer_frame, text="← Back to Posts", 
                  command=self.go_back).pack(side=tk.LEFT)
        
        # Right side - Action buttons
        button_frame = ttk.Frame(footer_frame)
        button_frame.pack(side=tk.RIGHT)
        
        self.save_button = ttk.Button(button_frame, text="Save Draft", 
                                     command=self.save_draft)
        self.save_button.pack(side=tk.LEFT, padx=(0, 5))
        
        self.publish_button = ttk.Button(button_frame, text="Publish", 
                                        command=self.publish_post)
        self.publish_button.pack(side=tk.LEFT)
        
        # Progress bar (hidden by default)
        self.progress_bar = ttk.Progressbar(footer_frame, mode='indeterminate')
    
    def load_data(self):
        """Load post data and form options."""
        self.set_status("Loading...")
        self.show_progress()
        
        def load_worker():
            try:
                # Load categories and tags
                self.categories = supabase_service.get_categories()
                self.tags = supabase_service.get_tags()
                
                # Load post if editing
                if self.post_id:
                    self.post = supabase_service.get_post_by_id(self.post_id)
                
                # Schedule UI update
                self.main_frame.after(0, self.on_data_loaded)
                
            except Exception as e:
                self.main_frame.after(0, lambda: self.on_load_error(str(e)))
        
        thread = threading.Thread(target=load_worker, daemon=True)
        thread.start()
    
    def on_data_loaded(self):
        """Handle successful data loading."""
        self.hide_progress()
        
        # Populate categories
        category_names = [cat.name for cat in self.categories]
        self.category_combo['values'] = category_names
        
        # Populate tags
        self.tags_listbox.delete(0, tk.END)
        for tag in self.tags:
            self.tags_listbox.insert(tk.END, tag.name)
        
        # Load post data if editing
        if self.post:
            self.populate_form()
        
        self.set_status("Ready")
    
    def on_load_error(self, error_message: str):
        """Handle data loading error."""
        self.hide_progress()
        self.set_status("Error loading data")
        UIHelper.show_error(self.main_frame, "Load Error", f"Failed to load data: {error_message}")


    def populate_form(self):
        """Populate form with post data."""
        if not self.post:
            return

        # Basic fields
        self.title_var.set(self.post.title)
        self.slug_var.set(self.post.slug)
        self.status_var.set(self.post.status)

        # Content
        self.content_text.delete(1.0, tk.END)
        self.content_text.insert(1.0, self.post.content)

        # Excerpt
        if self.post.excerpt:
            self.excerpt_text.delete(1.0, tk.END)
            self.excerpt_text.insert(1.0, self.post.excerpt)

        # Category
        if self.post.category:
            self.category_var.set(self.post.category.name)

        # Tags
        if self.post.post_tags:
            post_tag_names = [tag.name for tag in self.post.post_tags]
            for i, tag in enumerate(self.tags):
                if tag.name in post_tag_names:
                    self.tags_listbox.selection_set(i)

        # Featured image
        if self.post.featured_image_url:
            self.featured_image_var.set(self.post.featured_image_url)

        # SEO fields
        if self.post.meta_title:
            self.meta_title_var.set(self.post.meta_title)

        if self.post.meta_description:
            self.meta_desc_text.delete(1.0, tk.END)
            self.meta_desc_text.insert(1.0, self.post.meta_description)

        # Update character counts
        self.update_meta_title_count()
        self.update_meta_desc_count()

    def on_title_change(self, *args):
        """Handle title change to auto-generate slug."""
        if not self.slug_var.get() or self.slug_var.get() == Validator.generate_slug(self.title_var.get()):
            self.generate_slug()

    def generate_slug(self):
        """Generate slug from title."""
        title = self.title_var.get().strip()
        if title:
            slug = Validator.generate_slug(title)
            self.slug_var.set(slug)

    def generate_excerpt(self):
        """Generate excerpt from content."""
        content = self.content_text.get(1.0, tk.END).strip()
        if content:
            excerpt = Formatter.extract_excerpt(content, 150)
            self.excerpt_text.delete(1.0, tk.END)
            self.excerpt_text.insert(1.0, excerpt)

    def generate_meta_title(self):
        """Generate meta title from title."""
        title = self.title_var.get().strip()
        if title:
            # Truncate to 60 characters for SEO
            meta_title = title[:60] if len(title) > 60 else title
            self.meta_title_var.set(meta_title)

    def generate_meta_description(self):
        """Generate meta description from excerpt."""
        excerpt = self.excerpt_text.get(1.0, tk.END).strip()
        if not excerpt:
            # Generate from content if no excerpt
            content = self.content_text.get(1.0, tk.END).strip()
            excerpt = Formatter.extract_excerpt(content, 160)

        if excerpt:
            # Truncate to 160 characters for SEO
            meta_desc = excerpt[:160] if len(excerpt) > 160 else excerpt
            self.meta_desc_text.delete(1.0, tk.END)
            self.meta_desc_text.insert(1.0, meta_desc)

    def update_meta_title_count(self, *args):
        """Update meta title character count."""
        count = len(self.meta_title_var.get())
        color = UI_THEME['error_color'] if count > 60 else UI_THEME['text_secondary']
        self.meta_title_count.config(text=f"{count}/60 characters", foreground=color)

    def update_meta_desc_count(self, *args):
        """Update meta description character count."""
        count = len(self.meta_desc_text.get(1.0, tk.END).strip())
        color = UI_THEME['error_color'] if count > 160 else UI_THEME['text_secondary']
        self.meta_desc_count.config(text=f"{count}/160 characters", foreground=color)

    def browse_image(self):
        """Browse for image file."""
        filetypes = [
            ("Image files", "*.jpg *.jpeg *.png *.gif *.webp"),
            ("JPEG files", "*.jpg *.jpeg"),
            ("PNG files", "*.png"),
            ("GIF files", "*.gif"),
            ("WebP files", "*.webp"),
            ("All files", "*.*")
        ]

        filename = filedialog.askopenfilename(
            title="Select Featured Image",
            filetypes=filetypes,
            parent=self.main_frame
        )

        if filename:
            self.featured_image_var.set(filename)
            self.image_preview_label.config(text=f"Selected: {filename.split('/')[-1]}")

    def upload_image(self):
        """Upload selected image to R2 storage."""
        image_path = self.featured_image_var.get().strip()
        if not image_path:
            UIHelper.show_error(self.main_frame, "No Image", "Please select an image first.")
            return

        if not image_path.startswith('http'):
            # Local file - upload it
            self.set_status("Uploading image...")
            self.show_progress()

            def upload_worker():
                try:
                    success, message, public_url = storage_service.upload_image(image_path)
                    self.main_frame.after(0, lambda: self.on_upload_complete(success, message, public_url))
                except Exception as e:
                    self.main_frame.after(0, lambda: self.on_upload_complete(False, str(e), None))

            thread = threading.Thread(target=upload_worker, daemon=True)
            thread.start()
        else:
            # Already a URL
            self.image_preview_label.config(text="Using provided URL")

    def on_upload_complete(self, success: bool, message: str, public_url: Optional[str]):
        """Handle image upload completion."""
        self.hide_progress()

        if success and public_url:
            self.featured_image_var.set(public_url)
            self.image_preview_label.config(text=f"Uploaded: {public_url.split('/')[-1]}")
            self.set_status("Image uploaded successfully")
            UIHelper.show_success(self.main_frame, "Upload Success", "Image uploaded successfully!")
        else:
            self.set_status("Image upload failed")
            UIHelper.show_error(self.main_frame, "Upload Failed", f"Failed to upload image: {message}")

    def validate_form(self) -> tuple[bool, list]:
        """Validate form data."""
        errors = []

        # Get form data
        title = self.title_var.get().strip()
        slug = self.slug_var.get().strip()
        content = self.content_text.get(1.0, tk.END).strip()
        excerpt = self.excerpt_text.get(1.0, tk.END).strip()
        meta_title = self.meta_title_var.get().strip()
        meta_desc = self.meta_desc_text.get(1.0, tk.END).strip()

        # Validate required fields
        valid, error = Validator.validate_title(title)
        if not valid:
            errors.append(f"Title: {error}")

        valid, error = Validator.validate_slug(slug)
        if not valid:
            errors.append(f"Slug: {error}")

        valid, error = Validator.validate_content(content)
        if not valid:
            errors.append(f"Content: {error}")

        # Validate optional fields
        if excerpt:
            valid, error = Validator.validate_excerpt(excerpt)
            if not valid:
                errors.append(f"Excerpt: {error}")

        if meta_title:
            valid, error = Validator.validate_meta_title(meta_title)
            if not valid:
                errors.append(f"Meta Title: {error}")

        if meta_desc:
            valid, error = Validator.validate_meta_description(meta_desc)
            if not valid:
                errors.append(f"Meta Description: {error}")

        return len(errors) == 0, errors

    def get_form_data(self) -> Post:
        """Get form data as Post object."""
        # Get selected category
        category_name = self.category_var.get()
        selected_category = None
        for cat in self.categories:
            if cat.name == category_name:
                selected_category = cat
                break

        # Get selected tags
        selected_indices = self.tags_listbox.curselection()
        selected_tags = [self.tags[i] for i in selected_indices]

        # Create post object
        post = Post(
            id=self.post.id if self.post else None,
            title=self.title_var.get().strip(),
            slug=self.slug_var.get().strip(),
            content=self.content_text.get(1.0, tk.END).strip(),
            excerpt=self.excerpt_text.get(1.0, tk.END).strip() or None,
            featured_image_url=self.featured_image_var.get().strip() or None,
            status=self.status_var.get(),
            category_id=selected_category.id if selected_category else None,
            meta_title=self.meta_title_var.get().strip() or None,
            meta_description=self.meta_desc_text.get(1.0, tk.END).strip() or None,
            author_id=auth_service.current_user.id if auth_service.current_user else None,
            published_at=datetime.now() if self.status_var.get() == 'published' else None,
        )

        # Set related data
        post.category = selected_category
        post.post_tags = selected_tags

        return post

    def save_draft(self):
        """Save post as draft."""
        self.save_post('draft')

    def publish_post(self):
        """Publish the post."""
        if not auth_service.can_publish_posts():
            UIHelper.show_error(self.main_frame, "Permission Denied",
                              "You don't have permission to publish posts.")
            return

        # Confirm publication
        if not UIHelper.confirm_action(self.main_frame, "Publish Post",
                                     "Are you sure you want to publish this post?"):
            return

        self.save_post('published')

    def save_post(self, status: str):
        """Save the post with specified status."""
        if self.is_saving:
            return

        # Validate form
        valid, errors = self.validate_form()
        if not valid:
            error_message = "Please fix the following errors:\n\n" + "\n".join(errors)
            UIHelper.show_error(self.main_frame, "Validation Error", error_message)
            return

        # Set status and get form data
        self.status_var.set(status)
        post_data = self.get_form_data()

        self.is_saving = True
        self.set_status(f"Saving {'draft' if status == 'draft' else 'and publishing'}...")
        self.show_progress()

        # Disable buttons
        self.save_button.config(state='disabled')
        self.publish_button.config(state='disabled')

        def save_worker():
            try:
                if self.post_id:
                    # Update existing post
                    result = supabase_service.update_post(post_data)
                else:
                    # Create new post
                    result = supabase_service.create_post(post_data)

                self.main_frame.after(0, lambda: self.on_save_complete(result, status))

            except Exception as e:
                self.main_frame.after(0, lambda: self.on_save_error(str(e)))

        thread = threading.Thread(target=save_worker, daemon=True)
        thread.start()

    def on_save_complete(self, result: Optional[Post], status: str):
        """Handle successful save."""
        self.is_saving = False
        self.hide_progress()

        # Re-enable buttons
        self.save_button.config(state='normal')
        self.publish_button.config(state='normal')

        if result:
            self.post = result
            self.post_id = result.id

            action = "published" if status == 'published' else "saved"
            self.set_status(f"Post {action} successfully")

            success_message = f"Post {action} successfully!"
            if status == 'published':
                success_message += f"\n\nPost URL: /{result.slug}"

            UIHelper.show_success(self.main_frame, "Success", success_message)
        else:
            self.set_status("Save failed")
            UIHelper.show_error(self.main_frame, "Save Failed", "Failed to save post. Please try again.")

    def on_save_error(self, error_message: str):
        """Handle save error."""
        self.is_saving = False
        self.hide_progress()

        # Re-enable buttons
        self.save_button.config(state='normal')
        self.publish_button.config(state='normal')

        self.set_status("Save failed")
        UIHelper.show_error(self.main_frame, "Save Error", f"Failed to save post: {error_message}")

    def go_back(self):
        """Go back to posts list."""
        # Check for unsaved changes
        if self.has_unsaved_changes():
            if not UIHelper.confirm_action(self.main_frame, "Unsaved Changes",
                                         "You have unsaved changes. Are you sure you want to go back?"):
                return

        self.main_window.show_posts()

    def has_unsaved_changes(self) -> bool:
        """Check if there are unsaved changes."""
        if not self.post:
            # New post - check if any fields are filled
            return (self.title_var.get().strip() or
                   self.content_text.get(1.0, tk.END).strip() or
                   self.excerpt_text.get(1.0, tk.END).strip())

        # Existing post - compare with original data
        return (self.title_var.get().strip() != self.post.title or
               self.slug_var.get().strip() != self.post.slug or
               self.content_text.get(1.0, tk.END).strip() != self.post.content or
               self.status_var.get() != self.post.status)

    def set_status(self, message: str):
        """Set status message."""
        self.status_label.config(text=message)

    def show_progress(self):
        """Show progress indicator."""
        self.progress_bar.pack(side=tk.LEFT, padx=(10, 0))
        self.progress_bar.start()

    def hide_progress(self):
        """Hide progress indicator."""
        self.progress_bar.stop()
        self.progress_bar.pack_forget()
