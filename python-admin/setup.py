#!/usr/bin/env python3
"""
Setup script for the Blog Admin Desktop Application.
Helps with installation and initial configuration.
"""

import os
import sys
import subprocess
from pathlib import Path


def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True


def check_virtual_environment():
    """Check if running in virtual environment."""
    in_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    
    if in_venv:
        print("✅ Running in virtual environment")
    else:
        print("⚠️  Not running in virtual environment")
        print("It's recommended to use a virtual environment:")
        print("  python -m venv venv")
        print("  source venv/bin/activate  # On Windows: venv\\Scripts\\activate")
        
        response = input("\nContinue anyway? (y/N): ").lower().strip()
        if response != 'y':
            return False
    
    return True


def install_dependencies():
    """Install required dependencies."""
    print("\n📦 Installing dependencies...")
    
    try:
        # Upgrade pip first
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'])
        
        # Install requirements
        requirements_file = Path(__file__).parent / 'requirements.txt'
        if requirements_file.exists():
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)])
            print("✅ Dependencies installed successfully")
        else:
            print("❌ requirements.txt not found")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    
    return True


def check_environment_file():
    """Check for environment configuration file."""
    print("\n🔧 Checking environment configuration...")
    
    # Look for .env.local in parent directory
    parent_dir = Path(__file__).parent.parent
    env_file = parent_dir / '.env.local'
    env_example = parent_dir / '.env.example'
    
    if env_file.exists():
        print(f"✅ Found environment file: {env_file}")
        
        # Check for required variables
        required_vars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        ]
        
        missing_vars = []
        try:
            with open(env_file, 'r') as f:
                content = f.read()
                for var in required_vars:
                    if f"{var}=" not in content:
                        missing_vars.append(var)
            
            if missing_vars:
                print("⚠️  Missing required environment variables:")
                for var in missing_vars:
                    print(f"    - {var}")
                print("\nPlease add these variables to your .env.local file")
            else:
                print("✅ All required environment variables found")
                
        except Exception as e:
            print(f"⚠️  Could not read environment file: {e}")
    
    elif env_example.exists():
        print(f"⚠️  Environment file not found: {env_file}")
        print(f"Found example file: {env_example}")
        print("Please copy .env.example to .env.local and configure it with your credentials")
    else:
        print("❌ No environment configuration found")
        print("Please create a .env.local file with your Supabase and R2 credentials")
        return False
    
    return True


def test_imports():
    """Test if all required modules can be imported."""
    print("\n🧪 Testing imports...")
    
    required_modules = [
        'tkinter',
        'supabase',
        'requests',
        'PIL',
        'slugify',
        'boto3',
        'dotenv'
    ]
    
    failed_imports = []
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            failed_imports.append(module)
    
    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        print("Please install missing dependencies:")
        print("  pip install -r requirements.txt")
        return False
    
    print("✅ All imports successful")
    return True


def create_desktop_shortcut():
    """Create desktop shortcut (optional)."""
    print("\n🖥️  Desktop shortcut creation...")
    
    response = input("Create desktop shortcut? (y/N): ").lower().strip()
    if response != 'y':
        return True
    
    try:
        app_dir = Path(__file__).parent
        main_script = app_dir / 'main.py'
        
        if sys.platform == 'win32':
            # Windows shortcut
            import winshell
            from win32com.client import Dispatch
            
            desktop = winshell.desktop()
            shortcut_path = os.path.join(desktop, 'Blog Admin Desktop.lnk')
            
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = sys.executable
            shortcut.Arguments = str(main_script)
            shortcut.WorkingDirectory = str(app_dir)
            shortcut.IconLocation = sys.executable
            shortcut.save()
            
            print(f"✅ Desktop shortcut created: {shortcut_path}")
            
        elif sys.platform == 'darwin':
            # macOS alias/shortcut
            print("⚠️  macOS shortcut creation not implemented")
            print(f"You can manually create an alias to: {main_script}")
            
        else:
            # Linux desktop entry
            desktop_dir = Path.home() / 'Desktop'
            if desktop_dir.exists():
                desktop_file = desktop_dir / 'blog-admin-desktop.desktop'
                
                content = f"""[Desktop Entry]
Name=Blog Admin Desktop
Comment=Desktop application for managing blog posts
Exec={sys.executable} {main_script}
Path={app_dir}
Icon=applications-office
Terminal=false
Type=Application
Categories=Office;
"""
                
                with open(desktop_file, 'w') as f:
                    f.write(content)
                
                # Make executable
                os.chmod(desktop_file, 0o755)
                
                print(f"✅ Desktop entry created: {desktop_file}")
            else:
                print("⚠️  Desktop directory not found")
        
    except Exception as e:
        print(f"⚠️  Could not create desktop shortcut: {e}")
    
    return True


def main():
    """Main setup function."""
    print("="*60)
    print("🚀 Blog Admin Desktop Application Setup")
    print("="*60)
    
    # Check Python version
    if not check_python_version():
        return 1
    
    # Check virtual environment
    if not check_virtual_environment():
        return 1
    
    # Install dependencies
    if not install_dependencies():
        return 1
    
    # Test imports
    if not test_imports():
        return 1
    
    # Check environment configuration
    check_environment_file()
    
    # Create desktop shortcut
    create_desktop_shortcut()
    
    print("\n" + "="*60)
    print("✅ Setup completed successfully!")
    print("="*60)
    print("\nNext steps:")
    print("1. Ensure your .env.local file is properly configured")
    print("2. Run the application: python main.py")
    print("3. Login with your admin credentials")
    print("\nFor help, see README.md")
    print("="*60)
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
