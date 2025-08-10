#!/usr/bin/env python3
"""
Simple launcher script for the Blog Admin Desktop Application.
This script provides a user-friendly way to start the application with
proper error handling and setup verification.
"""

import sys
import os
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))


def check_setup():
    """Quick setup check."""
    try:
        # Check if main.py exists
        main_script = current_dir / 'main.py'
        if not main_script.exists():
            print("❌ main.py not found. Please ensure you're in the correct directory.")
            return False
        
        # Check if requirements.txt exists
        requirements_file = current_dir / 'requirements.txt'
        if not requirements_file.exists():
            print("❌ requirements.txt not found.")
            return False
        
        # Try to import main modules
        try:
            import tkinter
        except ImportError:
            print("❌ tkinter not available. Please install Python with tkinter support.")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Setup check failed: {e}")
        return False


def run_application():
    """Run the main application."""
    try:
        print("🚀 Starting Blog Admin Desktop Application...")
        
        # Import and run the main application
        from main import main
        return main()
        
    except KeyboardInterrupt:
        print("\n⚠️  Application interrupted by user")
        return 0
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\nThis usually means dependencies are not installed.")
        print("Please run: pip install -r requirements.txt")
        return 1
        
    except Exception as e:
        print(f"❌ Application failed to start: {e}")
        print("\nFor detailed diagnostics, run:")
        print("  python test_installation.py")
        return 1


def show_help():
    """Show help information."""
    print("""
Blog Admin Desktop Application Launcher

Usage:
  python run.py [options]

Options:
  --help, -h     Show this help message
  --test, -t     Run installation test
  --setup, -s    Run setup script
  --version, -v  Show version information

Examples:
  python run.py           # Start the application
  python run.py --test    # Test installation
  python run.py --setup   # Run setup script

For more information, see README.md
""")


def run_test():
    """Run installation test."""
    try:
        from test_installation import main as test_main
        return test_main()
    except ImportError:
        print("❌ test_installation.py not found")
        return 1
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return 1


def run_setup():
    """Run setup script."""
    try:
        from setup import main as setup_main
        return setup_main()
    except ImportError:
        print("❌ setup.py not found")
        return 1
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return 1


def show_version():
    """Show version information."""
    print("Blog Admin Desktop Application v1.0.0")
    print(f"Python {sys.version}")
    print(f"Platform: {sys.platform}")


def main():
    """Main launcher function."""
    # Parse command line arguments
    args = sys.argv[1:]
    
    if '--help' in args or '-h' in args:
        show_help()
        return 0
    
    if '--version' in args or '-v' in args:
        show_version()
        return 0
    
    if '--test' in args or '-t' in args:
        return run_test()
    
    if '--setup' in args or '-s' in args:
        return run_setup()
    
    # Default: run the application
    if not check_setup():
        print("\n💡 Try running setup first:")
        print("  python run.py --setup")
        return 1
    
    return run_application()


if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except Exception as e:
        print(f"❌ Launcher failed: {e}")
        sys.exit(1)
