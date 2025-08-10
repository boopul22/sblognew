"""
Tag management interface for creating and managing blog tags.
"""

import tkinter as tk
from tkinter import ttk, colorchooser
from typing import List, Optional
import threading

from config.settings import FONTS, UI_THEME, TAG_COLORS
from services.supabase_service import supabase_service
from services.auth_service import auth_service
from models.tag import Tag
from utils.validators import Validator
from utils.helpers import UIHelper


class TagManager:
    """Tag management interface."""
    
    def __init__(self, parent, main_window):
        self.parent = parent
        self.main_window = main_window
        self.tags: List[Tag] = []
        self.selected_tag: Optional[Tag] = None
        self.is_loading = False
        self.is_saving = False
        
        # Form variables
        self.name_var = tk.StringVar()
        self.slug_var = tk.StringVar()
        self.description_var = tk.StringVar()
        self.color_var = tk.StringVar(value=TAG_COLORS[0])
        
        self.setup_ui()
        self.load_tags()
        
        # Auto-generate slug when name changes
        self.name_var.trace_add('write', self.on_name_change)
    
    def setup_ui(self):
        """Setup the tag management UI."""
        # Main container
        self.main_frame = ttk.Frame(self.parent)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Header
        header_frame = ttk.Frame(self.main_frame)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(header_frame, text="Tags", font=FONTS['large_heading']).pack(side=tk.LEFT)
        
        # Create paned window for list and form
        paned_window = ttk.PanedWindow(self.main_frame, orient=tk.HORIZONTAL)
        paned_window.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - Tags list
        self.setup_tags_list(paned_window)
        
        # Right panel - Tag form
        self.setup_tag_form(paned_window)
        
        # Footer
        self.setup_footer()
    
    def setup_tags_list(self, parent):
        """Setup tags list panel."""
        list_frame = ttk.Frame(parent)
        parent.add(list_frame, weight=1)
        
        # List header
        list_header = ttk.Frame(list_frame)
        list_header.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(list_header, text="All Tags", font=FONTS['heading']).pack(side=tk.LEFT)
        ttk.Button(list_header, text="New Tag", command=self.new_tag).pack(side=tk.RIGHT)
        
        # Tags listbox
        listbox_frame = ttk.Frame(list_frame)
        listbox_frame.pack(fill=tk.BOTH, expand=True)
        
        self.tags_listbox = tk.Listbox(listbox_frame, font=FONTS['default'])
        scrollbar = ttk.Scrollbar(listbox_frame, command=self.tags_listbox.yview)
        self.tags_listbox.configure(yscrollcommand=scrollbar.set)
        
        self.tags_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Bind selection
        self.tags_listbox.bind('<<ListboxSelect>>', self.on_tag_select)
    
    def setup_tag_form(self, parent):
        """Setup tag form panel."""
        form_frame = ttk.Frame(parent)
        parent.add(form_frame, weight=1)
        
        # Form header
        form_header = ttk.Frame(form_frame)
        form_header.pack(fill=tk.X, pady=(0, 10))
        
        self.form_title_label = ttk.Label(form_header, text="New Tag", font=FONTS['heading'])
        self.form_title_label.pack(side=tk.LEFT)
        
        # Form fields
        fields_frame = ttk.Frame(form_frame)
        fields_frame.pack(fill=tk.BOTH, expand=True, padx=10)
        
        # Name field
        ttk.Label(fields_frame, text="Name *", font=FONTS['default']).pack(anchor=tk.W, pady=(10, 5))
        name_entry = ttk.Entry(fields_frame, textvariable=self.name_var, font=FONTS['default'])
        name_entry.pack(fill=tk.X, pady=(0, 10))
        
        # Slug field
        ttk.Label(fields_frame, text="Slug *", font=FONTS['default']).pack(anchor=tk.W, pady=(0, 5))
        slug_frame = ttk.Frame(fields_frame)
        slug_frame.pack(fill=tk.X, pady=(0, 10))
        
        slug_entry = ttk.Entry(slug_frame, textvariable=self.slug_var, font=FONTS['default'])
        slug_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        ttk.Button(slug_frame, text="Generate", command=self.generate_slug).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Description field
        ttk.Label(fields_frame, text="Description", font=FONTS['default']).pack(anchor=tk.W, pady=(0, 5))
        
        desc_frame = ttk.Frame(fields_frame)
        desc_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.description_text = tk.Text(desc_frame, height=3, font=FONTS['default'], wrap=tk.WORD)
        desc_scrollbar = ttk.Scrollbar(desc_frame, command=self.description_text.yview)
        self.description_text.configure(yscrollcommand=desc_scrollbar.set)
        
        self.description_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        desc_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Color field
        ttk.Label(fields_frame, text="Color", font=FONTS['default']).pack(anchor=tk.W, pady=(0, 5))
        
        color_frame = ttk.Frame(fields_frame)
        color_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.color_entry = ttk.Entry(color_frame, textvariable=self.color_var, font=FONTS['default'], width=10)
        self.color_entry.pack(side=tk.LEFT)
        
        self.color_preview = tk.Label(color_frame, text="  ", width=3, relief=tk.RAISED)
        self.color_preview.pack(side=tk.LEFT, padx=(5, 0))
        
        ttk.Button(color_frame, text="Choose Color", command=self.choose_color).pack(side=tk.LEFT, padx=(5, 0))
        
        # Preset colors
        preset_frame = ttk.Frame(fields_frame)
        preset_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(preset_frame, text="Preset Colors:", font=FONTS['small']).pack(anchor=tk.W)
        
        colors_frame = ttk.Frame(preset_frame)
        colors_frame.pack(fill=tk.X, pady=(5, 0))
        
        for i, color in enumerate(TAG_COLORS[:5]):  # Show first 5 colors
            color_btn = tk.Button(colors_frame, bg=color, width=3, height=1,
                                 command=lambda c=color: self.set_color(c))
            color_btn.pack(side=tk.LEFT, padx=(0, 2))
        
        # Form buttons
        buttons_frame = ttk.Frame(form_frame)
        buttons_frame.pack(fill=tk.X, padx=10, pady=(10, 0))
        
        self.save_button = ttk.Button(buttons_frame, text="Save Tag", command=self.save_tag)
        self.save_button.pack(side=tk.LEFT)
        
        self.delete_button = ttk.Button(buttons_frame, text="Delete", command=self.delete_tag)
        self.delete_button.pack(side=tk.LEFT, padx=(10, 0))
        self.delete_button.config(state='disabled')
        
        ttk.Button(buttons_frame, text="Clear", command=self.clear_form).pack(side=tk.RIGHT)
        
        # Update color preview when color changes
        self.color_var.trace_add('write', self.update_color_preview)
        self.update_color_preview()
    
    def setup_footer(self):
        """Setup footer with status."""
        footer_frame = ttk.Frame(self.main_frame)
        footer_frame.pack(fill=tk.X, pady=(10, 0))
        
        self.status_label = ttk.Label(footer_frame, text="Ready", font=FONTS['small'])
        self.status_label.pack(side=tk.LEFT)
        
        # Progress bar (hidden by default)
        self.progress_bar = ttk.Progressbar(footer_frame, mode='indeterminate')
    
    def load_tags(self):
        """Load tags from database."""
        if self.is_loading:
            return
        
        self.is_loading = True
        self.set_status("Loading tags...")
        self.show_progress()
        
        def load_worker():
            try:
                tags = supabase_service.get_tags()
                self.main_frame.after(0, lambda: self.on_tags_loaded(tags))
            except Exception as e:
                self.main_frame.after(0, lambda: self.on_load_error(str(e)))
        
        thread = threading.Thread(target=load_worker, daemon=True)
        thread.start()
    
    def on_tags_loaded(self, tags: List[Tag]):
        """Handle successful tags loading."""
        self.is_loading = False
        self.hide_progress()
        
        self.tags = tags
        self.populate_tags_list()
        self.set_status(f"Loaded {len(tags)} tags")
    
    def on_load_error(self, error_message: str):
        """Handle tags loading error."""
        self.is_loading = False
        self.hide_progress()
        self.set_status("Error loading tags")
        UIHelper.show_error(self.main_frame, "Load Error", f"Failed to load tags: {error_message}")
    
    def populate_tags_list(self):
        """Populate the tags listbox."""
        self.tags_listbox.delete(0, tk.END)
        
        for tag in self.tags:
            self.tags_listbox.insert(tk.END, tag.name)
    
    def on_tag_select(self, event):
        """Handle tag selection."""
        selection = self.tags_listbox.curselection()
        if selection:
            index = selection[0]
            self.selected_tag = self.tags[index]
            self.populate_form()
            self.delete_button.config(state='normal')
        else:
            self.selected_tag = None
            self.delete_button.config(state='disabled')
    
    def populate_form(self):
        """Populate form with selected tag data."""
        if not self.selected_tag:
            return
        
        self.form_title_label.config(text=f"Edit Tag: {self.selected_tag.name}")
        
        self.name_var.set(self.selected_tag.name)
        self.slug_var.set(self.selected_tag.slug)
        self.color_var.set(self.selected_tag.color)
        
        # Description
        self.description_text.delete(1.0, tk.END)
        if self.selected_tag.description:
            self.description_text.insert(1.0, self.selected_tag.description)
    
    def new_tag(self):
        """Start creating new tag."""
        self.selected_tag = None
        self.clear_form()
        self.form_title_label.config(text="New Tag")
        self.delete_button.config(state='disabled')
        
        # Clear selection
        self.tags_listbox.selection_clear(0, tk.END)
    
    def clear_form(self):
        """Clear the form."""
        self.name_var.set("")
        self.slug_var.set("")
        self.color_var.set(TAG_COLORS[0])
        self.description_text.delete(1.0, tk.END)
    
    def on_name_change(self, *args):
        """Handle name change to auto-generate slug."""
        if not self.slug_var.get() or (self.selected_tag and 
                                      self.slug_var.get() == self.selected_tag.slug):
            self.generate_slug()
    
    def generate_slug(self):
        """Generate slug from name."""
        name = self.name_var.get().strip()
        if name:
            slug = Validator.generate_slug(name)
            self.slug_var.set(slug)
    
    def choose_color(self):
        """Open color chooser dialog."""
        color = colorchooser.askcolor(color=self.color_var.get(), parent=self.main_frame)
        if color[1]:  # color[1] is the hex value
            self.color_var.set(color[1])
    
    def set_color(self, color: str):
        """Set color from preset."""
        self.color_var.set(color)
    
    def update_color_preview(self, *args):
        """Update color preview."""
        try:
            color = self.color_var.get()
            self.color_preview.config(bg=color)
        except tk.TclError:
            # Invalid color
            self.color_preview.config(bg='white')
    
    def validate_form(self) -> tuple[bool, list]:
        """Validate form data."""
        errors = []
        
        name = self.name_var.get().strip()
        slug = self.slug_var.get().strip()
        color = self.color_var.get().strip()
        
        # Validate name
        valid, error = Validator.validate_tag_name(name)
        if not valid:
            errors.append(f"Name: {error}")
        
        # Validate slug
        valid, error = Validator.validate_slug(slug)
        if not valid:
            errors.append(f"Slug: {error}")
        
        # Validate color
        valid, error = Validator.validate_color(color)
        if not valid:
            errors.append(f"Color: {error}")
        
        return len(errors) == 0, errors
    
    def save_tag(self):
        """Save the tag."""
        if self.is_saving:
            return
        
        # Validate form
        valid, errors = self.validate_form()
        if not valid:
            error_message = "Please fix the following errors:\n\n" + "\n".join(errors)
            UIHelper.show_error(self.main_frame, "Validation Error", error_message)
            return
        
        # Create tag object
        tag = Tag(
            id=self.selected_tag.id if self.selected_tag else None,
            name=self.name_var.get().strip(),
            slug=self.slug_var.get().strip(),
            description=self.description_text.get(1.0, tk.END).strip() or None,
            color=self.color_var.get().strip(),
        )
        
        self.is_saving = True
        action = "Updating" if self.selected_tag else "Creating"
        self.set_status(f"{action} tag...")
        self.show_progress()
        
        def save_worker():
            try:
                if self.selected_tag:
                    result = supabase_service.update_tag(tag)
                else:
                    result = supabase_service.create_tag(tag)
                
                self.main_frame.after(0, lambda: self.on_save_complete(result))
            except Exception as e:
                self.main_frame.after(0, lambda: self.on_save_error(str(e)))
        
        thread = threading.Thread(target=save_worker, daemon=True)
        thread.start()
    
    def on_save_complete(self, result: Optional[Tag]):
        """Handle successful save."""
        self.is_saving = False
        self.hide_progress()
        
        if result:
            action = "updated" if self.selected_tag else "created"
            self.set_status(f"Tag {action} successfully")
            UIHelper.show_success(self.main_frame, "Success", f"Tag {action} successfully!")
            
            # Reload tags
            self.load_tags()
            
            # Clear form if creating new
            if not self.selected_tag:
                self.clear_form()
        else:
            self.set_status("Save failed")
            UIHelper.show_error(self.main_frame, "Save Failed", "Failed to save tag. Please try again.")
    
    def on_save_error(self, error_message: str):
        """Handle save error."""
        self.is_saving = False
        self.hide_progress()
        self.set_status("Save failed")
        UIHelper.show_error(self.main_frame, "Save Error", f"Failed to save tag: {error_message}")
    
    def delete_tag(self):
        """Delete selected tag."""
        if not self.selected_tag:
            return
        
        # Confirm deletion
        if not UIHelper.confirm_action(self.main_frame, "Delete Tag", 
                                     f"Are you sure you want to delete '{self.selected_tag.name}'?\n\nThis action cannot be undone."):
            return
        
        self.set_status("Deleting tag...")
        self.show_progress()
        
        def delete_worker():
            try:
                success = supabase_service.delete_tag(self.selected_tag.id)
                self.main_frame.after(0, lambda: self.on_delete_complete(success))
            except Exception as e:
                self.main_frame.after(0, lambda: self.on_delete_error(str(e)))
        
        thread = threading.Thread(target=delete_worker, daemon=True)
        thread.start()
    
    def on_delete_complete(self, success: bool):
        """Handle delete completion."""
        self.hide_progress()
        
        if success:
            self.set_status("Tag deleted successfully")
            UIHelper.show_success(self.main_frame, "Success", "Tag deleted successfully!")
            
            # Clear form and reload
            self.new_tag()
            self.load_tags()
        else:
            self.set_status("Delete failed")
            UIHelper.show_error(self.main_frame, "Delete Failed", "Failed to delete tag. Please try again.")
    
    def on_delete_error(self, error_message: str):
        """Handle delete error."""
        self.hide_progress()
        self.set_status("Delete failed")
        UIHelper.show_error(self.main_frame, "Delete Error", f"Failed to delete tag: {error_message}")
    
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
