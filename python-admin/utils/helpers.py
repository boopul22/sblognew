"""
Helper utilities for the blog admin desktop application.
"""

import os
import sys
import threading
import tkinter as tk
from tkinter import messagebox
from typing import Callable, Any, Optional
from datetime import datetime


class ThreadHelper:
    """Helper class for running async operations in threads."""
    
    @staticmethod
    def run_async(func: Callable, callback: Optional[Callable] = None, error_callback: Optional[Callable] = None):
        """Run a function asynchronously in a separate thread."""
        def worker():
            try:
                result = func()
                if callback:
                    # Schedule callback on main thread
                    if hasattr(callback, '__self__') and hasattr(callback.__self__, 'after'):
                        callback.__self__.after(0, lambda: callback(result))
                    else:
                        callback(result)
            except Exception as e:
                if error_callback:
                    if hasattr(error_callback, '__self__') and hasattr(error_callback.__self__, 'after'):
                        error_callback.__self__.after(0, lambda: error_callback(e))
                    else:
                        error_callback(e)
                else:
                    print(f"Async operation failed: {e}")
        
        thread = threading.Thread(target=worker, daemon=True)
        thread.start()
        return thread


class UIHelper:
    """Helper class for UI operations."""
    
    @staticmethod
    def center_window(window: tk.Tk, width: int, height: int):
        """Center a window on the screen."""
        screen_width = window.winfo_screenwidth()
        screen_height = window.winfo_screenheight()
        
        x = (screen_width - width) // 2
        y = (screen_height - height) // 2
        
        window.geometry(f"{width}x{height}+{x}+{y}")
    
    @staticmethod
    def show_error(parent: tk.Widget, title: str, message: str):
        """Show error message dialog."""
        messagebox.showerror(title, message, parent=parent)
    
    @staticmethod
    def show_success(parent: tk.Widget, title: str, message: str):
        """Show success message dialog."""
        messagebox.showinfo(title, message, parent=parent)
    
    @staticmethod
    def show_warning(parent: tk.Widget, title: str, message: str):
        """Show warning message dialog."""
        messagebox.showwarning(title, message, parent=parent)
    
    @staticmethod
    def confirm_action(parent: tk.Widget, title: str, message: str) -> bool:
        """Show confirmation dialog."""
        return messagebox.askyesno(title, message, parent=parent)
    
    @staticmethod
    def create_tooltip(widget: tk.Widget, text: str):
        """Create a tooltip for a widget."""
        def on_enter(event):
            tooltip = tk.Toplevel()
            tooltip.wm_overrideredirect(True)
            tooltip.wm_geometry(f"+{event.x_root+10}+{event.y_root+10}")
            
            label = tk.Label(tooltip, text=text, background="lightyellow", 
                           relief="solid", borderwidth=1, font=("Arial", 9))
            label.pack()
            
            widget.tooltip = tooltip
        
        def on_leave(event):
            if hasattr(widget, 'tooltip'):
                widget.tooltip.destroy()
                del widget.tooltip
        
        widget.bind("<Enter>", on_enter)
        widget.bind("<Leave>", on_leave)
    
    @staticmethod
    def bind_mousewheel(widget: tk.Widget, canvas: tk.Canvas):
        """Bind mousewheel scrolling to a canvas."""
        def on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
        def bind_to_mousewheel(event):
            canvas.bind_all("<MouseWheel>", on_mousewheel)
        
        def unbind_from_mousewheel(event):
            canvas.unbind_all("<MouseWheel>")
        
        widget.bind('<Enter>', bind_to_mousewheel)
        widget.bind('<Leave>', unbind_from_mousewheel)


class FileHelper:
    """Helper class for file operations."""
    
    @staticmethod
    def get_app_data_dir() -> str:
        """Get application data directory."""
        if sys.platform == "win32":
            app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
            return os.path.join(app_data, 'BlogAdminDesktop')
        elif sys.platform == "darwin":
            return os.path.expanduser('~/Library/Application Support/BlogAdminDesktop')
        else:
            return os.path.expanduser('~/.blog-admin-desktop')
    
    @staticmethod
    def ensure_dir_exists(directory: str):
        """Ensure directory exists, create if it doesn't."""
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
    
    @staticmethod
    def get_temp_dir() -> str:
        """Get temporary directory for the application."""
        import tempfile
        temp_dir = os.path.join(tempfile.gettempdir(), 'blog-admin-desktop')
        FileHelper.ensure_dir_exists(temp_dir)
        return temp_dir
    
    @staticmethod
    def safe_filename(filename: str) -> str:
        """Create a safe filename by removing invalid characters."""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename.strip()
    
    @staticmethod
    def get_file_extension(filename: str) -> str:
        """Get file extension from filename."""
        return os.path.splitext(filename)[1].lower()
    
    @staticmethod
    def is_image_file(filename: str) -> bool:
        """Check if file is an image based on extension."""
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'}
        return FileHelper.get_file_extension(filename) in image_extensions


class ConfigHelper:
    """Helper class for configuration management."""
    
    @staticmethod
    def save_window_geometry(window: tk.Tk, config_key: str = 'main_window'):
        """Save window geometry to config."""
        try:
            geometry = window.geometry()
            # In a real app, you'd save this to a config file
            # For now, we'll just store it in a class variable
            if not hasattr(ConfigHelper, '_geometries'):
                ConfigHelper._geometries = {}
            ConfigHelper._geometries[config_key] = geometry
        except Exception as e:
            print(f"Failed to save window geometry: {e}")
    
    @staticmethod
    def restore_window_geometry(window: tk.Tk, config_key: str = 'main_window', 
                              default_geometry: str = '1200x800'):
        """Restore window geometry from config."""
        try:
            if hasattr(ConfigHelper, '_geometries') and config_key in ConfigHelper._geometries:
                window.geometry(ConfigHelper._geometries[config_key])
            else:
                window.geometry(default_geometry)
                UIHelper.center_window(window, 1200, 800)
        except Exception as e:
            print(f"Failed to restore window geometry: {e}")
            window.geometry(default_geometry)


class DateHelper:
    """Helper class for date operations."""
    
    @staticmethod
    def now() -> datetime:
        """Get current datetime."""
        return datetime.now()
    
    @staticmethod
    def format_for_api(dt: datetime) -> str:
        """Format datetime for API calls."""
        return dt.isoformat()
    
    @staticmethod
    def parse_from_api(date_str: str) -> Optional[datetime]:
        """Parse datetime from API response."""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return None
    
    @staticmethod
    def is_today(dt: datetime) -> bool:
        """Check if datetime is today."""
        return dt.date() == datetime.now().date()
    
    @staticmethod
    def is_this_week(dt: datetime) -> bool:
        """Check if datetime is in current week."""
        now = datetime.now()
        start_of_week = now - datetime.timedelta(days=now.weekday())
        return dt >= start_of_week


class ValidationHelper:
    """Helper class for common validation tasks."""
    
    @staticmethod
    def is_empty_or_whitespace(text: str) -> bool:
        """Check if text is empty or contains only whitespace."""
        return not text or not text.strip()
    
    @staticmethod
    def has_minimum_length(text: str, min_length: int) -> bool:
        """Check if text meets minimum length requirement."""
        return len(text.strip()) >= min_length
    
    @staticmethod
    def is_valid_hex_color(color: str) -> bool:
        """Check if string is a valid hex color."""
        import re
        return bool(re.match(r'^#[0-9A-Fa-f]{6}$', color))
    
    @staticmethod
    def clean_input(text: str) -> str:
        """Clean user input by stripping whitespace."""
        return text.strip() if text else ""


class DebugHelper:
    """Helper class for debugging and logging."""
    
    @staticmethod
    def log(message: str, level: str = "INFO"):
        """Log a message with timestamp."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")
    
    @staticmethod
    def log_error(message: str, exception: Exception = None):
        """Log an error message."""
        error_msg = f"{message}"
        if exception:
            error_msg += f" - {str(exception)}"
        DebugHelper.log(error_msg, "ERROR")
    
    @staticmethod
    def log_warning(message: str):
        """Log a warning message."""
        DebugHelper.log(message, "WARNING")
    
    @staticmethod
    def log_debug(message: str):
        """Log a debug message."""
        DebugHelper.log(message, "DEBUG")
