"""
Login dialog component for the blog admin desktop application.
"""

import tkinter as tk
from tkinter import ttk, messagebox
import asyncio
from threading import Thread

from config.settings import FONTS, UI_THEME
from services.auth_service import auth_service
from services.credentials_manager import credentials_manager
from utils.helpers import UIHelper, ThreadHelper
from utils.validators import Validator


class LoginDialog:
    """Login dialog for user authentication."""
    
    def __init__(self, parent):
        self.parent = parent
        self.dialog = None
        self.email_var = tk.StringVar()
        self.password_var = tk.StringVar()
        self.remember_var = tk.BooleanVar()
        self.is_logging_in = False
        
        self.create_dialog()
    
    def create_dialog(self):
        """Create the login dialog."""
        self.dialog = tk.Toplevel(self.parent)
        self.dialog.title("Login - Blog Admin")
        self.dialog.geometry("400x300")
        self.dialog.resizable(False, False)
        self.dialog.transient(self.parent)
        self.dialog.grab_set()
        
        # Center dialog
        UIHelper.center_window(self.dialog, 400, 300)
        
        # Configure style
        self.dialog.configure(bg=UI_THEME['background_color'])
        
        # Handle dialog close
        self.dialog.protocol("WM_DELETE_WINDOW", self.on_cancel)
        
        self.setup_ui()
        self.load_saved_credentials()

        # Focus on appropriate field
        if self.email_var.get():
            self.password_entry.focus_set()
        else:
            self.email_entry.focus_set()
    
    def setup_ui(self):
        """Setup dialog UI components."""
        # Main container
        main_frame = ttk.Frame(self.dialog)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_frame, text="Blog Admin Login", 
                               font=FONTS['large_heading'])
        title_label.pack(pady=(0, 20))
        
        # Subtitle
        subtitle_label = ttk.Label(main_frame, 
                                  text="Sign in with your admin credentials",
                                  font=FONTS['default'])
        subtitle_label.pack(pady=(0, 20))
        
        # Form frame
        form_frame = ttk.Frame(main_frame)
        form_frame.pack(fill=tk.X, pady=(0, 20))
        
        # Email field
        ttk.Label(form_frame, text="Email:", font=FONTS['default']).pack(anchor=tk.W)
        self.email_entry = ttk.Entry(form_frame, textvariable=self.email_var, 
                                    font=FONTS['default'], width=40)
        self.email_entry.pack(fill=tk.X, pady=(5, 10))
        
        # Password field
        ttk.Label(form_frame, text="Password:", font=FONTS['default']).pack(anchor=tk.W)
        self.password_entry = ttk.Entry(form_frame, textvariable=self.password_var, 
                                       show="*", font=FONTS['default'], width=40)
        self.password_entry.pack(fill=tk.X, pady=(5, 10))
        
        # Remember me checkbox
        remember_frame = ttk.Frame(form_frame)
        remember_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Checkbutton(remember_frame, text="Remember me", 
                       variable=self.remember_var).pack(anchor=tk.W)
        
        # Error label (hidden by default)
        self.error_label = ttk.Label(form_frame, text="", 
                                    foreground=UI_THEME['error_color'],
                                    font=FONTS['small'])
        self.error_label.pack(fill=tk.X, pady=(0, 10))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.pack(fill=tk.X)
        
        # Cancel button
        self.cancel_button = ttk.Button(buttons_frame, text="Cancel", 
                                       command=self.on_cancel)
        self.cancel_button.pack(side=tk.RIGHT, padx=(10, 0))
        
        # Login button
        self.login_button = ttk.Button(buttons_frame, text="Login", 
                                      command=self.on_login)
        self.login_button.pack(side=tk.RIGHT)
        
        # Progress bar (hidden by default)
        self.progress_bar = ttk.Progressbar(main_frame, mode='indeterminate')
        
        # Bind Enter key to login
        self.dialog.bind('<Return>', lambda e: self.on_login())
        self.dialog.bind('<Escape>', lambda e: self.on_cancel())

    def load_saved_credentials(self):
        """Load saved credentials if available."""
        try:
            saved_creds = credentials_manager.load_credentials()
            if saved_creds:
                self.email_var.set(saved_creds['email'])
                self.password_var.set(saved_creds['password'])
                self.remember_var.set(True)
                print("✅ Loaded saved credentials")
        except Exception as e:
            print(f"⚠️  Error loading saved credentials: {e}")
    
    def on_login(self):
        """Handle login button click."""
        if self.is_logging_in:
            return
        
        # Validate input
        email = self.email_var.get().strip()
        password = self.password_var.get()
        
        if not email:
            self.show_error("Please enter your email address.")
            self.email_entry.focus_set()
            return
        
        if not password:
            self.show_error("Please enter your password.")
            self.password_entry.focus_set()
            return
        
        # Validate email format
        valid, error = Validator.validate_email(email)
        if not valid:
            self.show_error(error)
            self.email_entry.focus_set()
            return
        
        # Start login process
        self.start_login(email, password)
    
    def start_login(self, email: str, password: str):
        """Start the login process."""
        self.is_logging_in = True
        self.show_progress()
        self.clear_error()

        # Disable form
        self.email_entry.config(state='disabled')
        self.password_entry.config(state='disabled')
        self.login_button.config(state='disabled')
        self.cancel_button.config(text='Cancel', state='normal')

        # Use after() to run login in main thread with delay
        self.dialog.after(100, lambda: self.perform_login(email, password))

    def perform_login(self, email: str, password: str):
        """Perform the actual login operation."""
        try:
            # Create event loop for async operation
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            # Perform login
            success, message = loop.run_until_complete(
                auth_service.login(email, password)
            )

            loop.close()

            # Update UI directly since we're in main thread
            self.on_login_complete(success, message)

        except Exception as e:
            self.on_login_complete(False, f"Login failed: {str(e)}")

    def on_login_complete(self, success: bool, message: str):
        """Handle login completion."""
        self.is_logging_in = False
        self.hide_progress()
        
        # Re-enable form
        self.email_entry.config(state='normal')
        self.password_entry.config(state='normal')
        self.login_button.config(state='normal')
        
        if success:
            # Save credentials if remember is checked
            if self.remember_var.get():
                try:
                    credentials_manager.save_credentials(
                        self.email_var.get().strip(),
                        self.password_var.get(),
                        remember=True
                    )
                    print("✅ Credentials saved for next time")
                except Exception as e:
                    print(f"⚠️  Error saving credentials: {e}")
            else:
                # Clear saved credentials if remember is unchecked
                credentials_manager.clear_credentials()

            # Login successful
            self.dialog.destroy()
        else:
            # Login failed
            self.show_error(message)
            self.password_entry.delete(0, tk.END)
            self.password_entry.focus_set()
    
    def on_cancel(self):
        """Handle cancel button click."""
        if self.is_logging_in:
            # TODO: Cancel login operation
            return
        
        self.dialog.destroy()
    
    def show_error(self, message: str):
        """Show error message."""
        self.error_label.config(text=message)
    
    def clear_error(self):
        """Clear error message."""
        self.error_label.config(text="")
    
    def show_progress(self):
        """Show progress indicator."""
        self.progress_bar.pack(fill=tk.X, pady=(10, 0))
        self.progress_bar.start()
    
    def hide_progress(self):
        """Hide progress indicator."""
        self.progress_bar.stop()
        self.progress_bar.pack_forget()
