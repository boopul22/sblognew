#!/usr/bin/env python3
"""
Simplified Blog Admin Desktop Application
A working version with basic functionality to test the setup.
"""

import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from pathlib import Path
import asyncio
import threading

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from config.env_loader import config
    from services.supabase_service import supabase_service
    from services.auth_service import auth_service
    from models.post import Post
    print("✅ All modules imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)


class SimpleBlogAdmin:
    """Simplified blog admin interface."""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Blog Admin Desktop - Simple Version")
        self.root.geometry("800x600")
        
        # Center window
        self.center_window()
        
        self.setup_ui()
        self.check_authentication()
    
    def center_window(self):
        """Center the window on screen."""
        self.root.update_idletasks()
        width = 800
        height = 600
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f"{width}x{height}+{x}+{y}")
    
    def setup_ui(self):
        """Setup basic UI."""
        # Main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_frame, text="Blog Admin Desktop", 
                               font=('Arial', 16, 'bold'))
        title_label.pack(pady=(0, 20))
        
        # Status
        self.status_label = ttk.Label(main_frame, text="Initializing...", 
                                     font=('Arial', 10))
        self.status_label.pack(pady=(0, 20))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.pack(pady=20)
        
        # Action buttons
        self.login_button = ttk.Button(buttons_frame, text="Login", 
                                      command=self.show_login)
        self.login_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.posts_button = ttk.Button(buttons_frame, text="View Posts", 
                                      command=self.view_posts, state='disabled')
        self.posts_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.new_post_button = ttk.Button(buttons_frame, text="New Post", 
                                         command=self.new_post, state='disabled')
        self.new_post_button.pack(side=tk.LEFT)
        
        # Text area for output
        text_frame = ttk.Frame(main_frame)
        text_frame.pack(fill=tk.BOTH, expand=True, pady=(20, 0))
        
        self.output_text = tk.Text(text_frame, wrap=tk.WORD, font=('Consolas', 10))
        scrollbar = ttk.Scrollbar(text_frame, command=self.output_text.yview)
        self.output_text.configure(yscrollcommand=scrollbar.set)
        
        self.output_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Add welcome message
        self.log("Welcome to Blog Admin Desktop!")
        self.log("Click 'Login' to authenticate with your admin credentials.")
    
    def log(self, message: str):
        """Add message to output log."""
        self.output_text.insert(tk.END, f"{message}\n")
        self.output_text.see(tk.END)
        self.root.update_idletasks()
    
    def set_status(self, message: str):
        """Set status message."""
        self.status_label.config(text=message)
        self.root.update_idletasks()
    
    def check_authentication(self):
        """Check if user is already authenticated."""
        if auth_service.is_authenticated:
            self.on_login_success()
        else:
            self.set_status("Please login to continue")
    
    def show_login(self):
        """Show simple login dialog."""
        self.set_status("Logging in...")
        
        # Get credentials
        email = simpledialog.askstring("Login", "Enter your email:", parent=self.root)
        if not email:
            self.set_status("Login cancelled")
            return
        
        password = simpledialog.askstring("Login", "Enter your password:", 
                                        parent=self.root, show='*')
        if not password:
            self.set_status("Login cancelled")
            return
        
        # Perform login
        self.log(f"Attempting login for: {email}")
        
        def login_worker():
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                success, message = loop.run_until_complete(
                    auth_service.login(email, password)
                )
                
                loop.close()
                
                # Schedule UI update
                self.root.after(0, lambda: self.on_login_result(success, message))
                
            except Exception as e:
                self.root.after(0, lambda: self.on_login_result(False, str(e)))
        
        thread = threading.Thread(target=login_worker, daemon=True)
        thread.start()
    
    def on_login_result(self, success: bool, message: str):
        """Handle login result."""
        if success:
            self.on_login_success()
        else:
            self.set_status("Login failed")
            self.log(f"❌ Login failed: {message}")
            messagebox.showerror("Login Failed", message, parent=self.root)
    
    def on_login_success(self):
        """Handle successful login."""
        user = auth_service.get_current_user()
        display_name = auth_service.get_display_name()
        role = auth_service.get_user_role()
        
        self.set_status(f"Logged in as: {display_name} ({role})")
        self.log(f"✅ Login successful!")
        self.log(f"User: {display_name}")
        self.log(f"Role: {role}")
        
        # Enable buttons
        self.login_button.config(text="Logout", command=self.logout)
        self.posts_button.config(state='normal')
        self.new_post_button.config(state='normal')
    
    def logout(self):
        """Logout current user."""
        auth_service.logout()
        self.set_status("Logged out")
        self.log("👋 Logged out successfully")
        
        # Disable buttons
        self.login_button.config(text="Login", command=self.show_login)
        self.posts_button.config(state='disabled')
        self.new_post_button.config(state='disabled')
    
    def view_posts(self):
        """View posts (simplified)."""
        self.set_status("Loading posts...")
        self.log("📄 Loading posts...")
        
        def load_worker():
            try:
                posts = supabase_service.get_posts(limit=10)
                self.root.after(0, lambda: self.on_posts_loaded(posts))
            except Exception as e:
                self.root.after(0, lambda: self.on_posts_error(str(e)))
        
        thread = threading.Thread(target=load_worker, daemon=True)
        thread.start()
    
    def on_posts_loaded(self, posts):
        """Handle posts loaded."""
        self.set_status(f"Loaded {len(posts)} posts")
        self.log(f"✅ Loaded {len(posts)} posts:")
        
        for i, post in enumerate(posts[:5], 1):  # Show first 5
            self.log(f"  {i}. {post.title} ({post.status})")
        
        if len(posts) > 5:
            self.log(f"  ... and {len(posts) - 5} more posts")
    
    def on_posts_error(self, error_message):
        """Handle posts loading error."""
        self.set_status("Failed to load posts")
        self.log(f"❌ Failed to load posts: {error_message}")
        messagebox.showerror("Error", f"Failed to load posts: {error_message}", parent=self.root)
    
    def new_post(self):
        """Create new post (simplified)."""
        if not auth_service.can_create_posts():
            messagebox.showerror("Permission Denied", 
                               "You don't have permission to create posts.", 
                               parent=self.root)
            return
        
        # Simple post creation dialog
        title = simpledialog.askstring("New Post", "Enter post title:", parent=self.root)
        if not title:
            return
        
        content = simpledialog.askstring("New Post", "Enter post content:", parent=self.root)
        if not content:
            return
        
        self.set_status("Creating post...")
        self.log(f"📝 Creating post: {title}")
        
        def create_worker():
            try:
                from slugify import slugify
                
                post = Post(
                    title=title,
                    slug=slugify(title),
                    content=content,
                    status='draft',
                    author_id=auth_service.current_user.id
                )
                
                result = supabase_service.create_post(post)
                self.root.after(0, lambda: self.on_post_created(result, title))
                
            except Exception as e:
                self.root.after(0, lambda: self.on_post_error(str(e)))
        
        thread = threading.Thread(target=create_worker, daemon=True)
        thread.start()
    
    def on_post_created(self, result, title):
        """Handle post creation result."""
        if result:
            self.set_status("Post created successfully")
            self.log(f"✅ Post '{title}' created successfully!")
            self.log(f"   ID: {result.id}")
            self.log(f"   Slug: {result.slug}")
            messagebox.showinfo("Success", f"Post '{title}' created successfully!", parent=self.root)
        else:
            self.set_status("Failed to create post")
            self.log(f"❌ Failed to create post: {title}")
            messagebox.showerror("Error", "Failed to create post. Please try again.", parent=self.root)
    
    def on_post_error(self, error_message):
        """Handle post creation error."""
        self.set_status("Failed to create post")
        self.log(f"❌ Post creation error: {error_message}")
        messagebox.showerror("Error", f"Failed to create post: {error_message}", parent=self.root)
    
    def run(self):
        """Start the application."""
        try:
            self.log("🚀 Application ready!")
            self.set_status("Ready")
            self.root.mainloop()
        except KeyboardInterrupt:
            self.log("👋 Application closed")


def main():
    """Main function."""
    try:
        print("🚀 Starting Simple Blog Admin...")
        app = SimpleBlogAdmin()
        app.run()
        return 0
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
