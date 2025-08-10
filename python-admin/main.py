#!/usr/bin/env python3
"""
Blog Admin Desktop Application

A Python Tkinter desktop application for managing blog posts, categories, and tags
for the Sayari Blog platform. Integrates with Supabase database and Cloudflare R2 storage.

Usage:
    python main.py

Requirements:
    - Python 3.8+
    - Dependencies listed in requirements.txt
    - Access to .env.local file with Supabase and R2 credentials
    - Admin or editor role in the blog system

Author: Blog Admin Desktop Team
Version: 1.0.0
"""

import sys
import os
import traceback
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    import tkinter as tk
    from tkinter import messagebox
except ImportError:
    print("Error: tkinter is not available. Please install Python with tkinter support.")
    sys.exit(1)

# Import application modules
try:
    from config.env_loader import config
    from ui.main_window import MainWindow
    from utils.helpers import DebugHelper
    from services.server_manager import server_manager
except ImportError as e:
    print(f"Error importing application modules: {e}")
    print("Please ensure all dependencies are installed: pip install -r requirements.txt")
    sys.exit(1)


def check_dependencies():
    """Check if all required dependencies are available."""
    required_modules = [
        'supabase',
        'requests',
        'PIL',
        'slugify',
        'boto3',
        'dotenv'
    ]
    
    missing_modules = []
    
    for module in required_modules:
        try:
            __import__(module)
        except ImportError:
            missing_modules.append(module)
    
    if missing_modules:
        print("Error: Missing required dependencies:")
        for module in missing_modules:
            print(f"  - {module}")
        print("\nPlease install missing dependencies:")
        print("  pip install -r requirements.txt")
        return False
    
    return True


def check_environment():
    """Check if environment is properly configured."""
    try:
        # Print configuration summary
        config.print_config_summary()
        
        # Check critical configuration
        supabase_config = config.get_supabase_config()
        if not supabase_config['url'] or not supabase_config['anon_key']:
            print("❌ Critical Error: Supabase configuration is missing!")
            print("Please ensure your .env.local file contains:")
            print("  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url")
            print("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Environment check failed: {e}")
        return False


def setup_error_handling():
    """Setup global error handling."""
    def handle_exception(exc_type, exc_value, exc_traceback):
        """Handle uncaught exceptions."""
        if issubclass(exc_type, KeyboardInterrupt):
            # Allow Ctrl+C to work normally
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        
        # Log the error
        error_msg = ''.join(traceback.format_exception(exc_type, exc_value, exc_traceback))
        DebugHelper.log_error("Uncaught exception", Exception(error_msg))
        
        # Show error dialog if tkinter is available
        try:
            root = tk.Tk()
            root.withdraw()  # Hide the root window
            
            messagebox.showerror(
                "Application Error",
                f"An unexpected error occurred:\n\n{exc_value}\n\n"
                f"The application will now close. Please check the console for details."
            )
            
            root.destroy()
        except:
            pass  # If tkinter fails, just print to console
        
        print(f"\n❌ Fatal Error: {exc_value}")
        print("Full traceback:")
        print(error_msg)
        sys.exit(1)
    
    sys.excepthook = handle_exception


def main():
    """Main application entry point."""
    print("="*60)
    print("🚀 Starting Blog Admin Desktop Application")
    print("="*60)
    
    # Setup error handling
    setup_error_handling()
    
    # Check dependencies
    print("📦 Checking dependencies...")
    if not check_dependencies():
        return 1
    print("✅ All dependencies are available")
    
    # Check environment configuration
    print("🔧 Checking environment configuration...")
    if not check_environment():
        return 1
    print("✅ Environment configuration is valid")

    # Start Next.js server for image uploads
    print("🚀 Starting image upload server...")
    success, message = server_manager.ensure_server_running()
    if success:
        print("✅ Image upload server is ready")
    else:
        print(f"⚠️  Image upload server failed to start: {message}")
        print("   Image upload functionality may not work properly.")

    try:
        # Create and run the main application
        print("🎨 Initializing user interface...")
        app = MainWindow()

        print("✅ Application initialized successfully")
        print("🎯 Ready to use! Please login with your admin credentials.")
        print("-" * 60)

        # Start the application
        app.run()
        
        print("\n👋 Application closed. Goodbye!")

        # Cleanup: Stop the server if we started it
        if server_manager.process:
            print("🛑 Stopping image upload server...")
            server_manager.stop_server()

        return 0
        
    except KeyboardInterrupt:
        print("\n⚠️  Application interrupted by user")
        return 0
        
    except Exception as e:
        DebugHelper.log_error("Failed to start application", e)
        print(f"\n❌ Failed to start application: {e}")
        
        # Show error dialog
        try:
            root = tk.Tk()
            root.withdraw()
            messagebox.showerror(
                "Startup Error",
                f"Failed to start the application:\n\n{e}\n\n"
                f"Please check your configuration and try again."
            )
            root.destroy()
        except:
            pass
        
        return 1


if __name__ == "__main__":
    # Ensure we're running with the correct Python version
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    
    # Run the application
    exit_code = main()
    sys.exit(exit_code)
