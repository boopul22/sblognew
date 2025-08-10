#!/usr/bin/env python3
"""
Test script to verify the Blog Admin Desktop Application installation.
Run this script to check if everything is properly configured.
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

def test_python_version():
    """Test Python version compatibility."""
    print("🐍 Testing Python version...")
    
    if sys.version_info < (3, 8):
        print(f"❌ Python 3.8+ required, found {sys.version.split()[0]}")
        return False
    
    print(f"✅ Python {sys.version.split()[0]} - Compatible")
    return True


def test_imports():
    """Test all required imports."""
    print("\n📦 Testing imports...")
    
    # Core Python modules
    core_modules = ['tkinter', 'threading', 'datetime', 'pathlib', 'os', 'sys']
    
    # Third-party modules
    third_party_modules = [
        'supabase',
        'requests', 
        'PIL',
        'slugify',
        'boto3',
        'dotenv'
    ]
    
    # Application modules
    app_modules = [
        'config.env_loader',
        'config.settings',
        'services.supabase_service',
        'services.storage_service',
        'services.auth_service',
        'models.post',
        'models.category',
        'models.tag',
        'utils.validators',
        'utils.formatters',
        'utils.helpers'
    ]
    
    all_passed = True
    
    # Test core modules
    print("  Core modules:")
    for module in core_modules:
        try:
            __import__(module)
            print(f"    ✅ {module}")
        except ImportError as e:
            print(f"    ❌ {module}: {e}")
            all_passed = False
    
    # Test third-party modules
    print("  Third-party modules:")
    for module in third_party_modules:
        try:
            __import__(module)
            print(f"    ✅ {module}")
        except ImportError as e:
            print(f"    ❌ {module}: {e}")
            all_passed = False
    
    # Test application modules
    print("  Application modules:")
    for module in app_modules:
        try:
            __import__(module)
            print(f"    ✅ {module}")
        except ImportError as e:
            print(f"    ❌ {module}: {e}")
            all_passed = False
    
    return all_passed


def test_environment():
    """Test environment configuration."""
    print("\n🔧 Testing environment configuration...")
    
    try:
        from config.env_loader import config
        
        # Test basic configuration loading
        supabase_config = config.get_supabase_config()
        r2_config = config.get_r2_config()
        
        # Check required Supabase config
        if not supabase_config.get('url'):
            print("    ❌ NEXT_PUBLIC_SUPABASE_URL not configured")
            return False
        else:
            print("    ✅ Supabase URL configured")
        
        if not supabase_config.get('anon_key'):
            print("    ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured")
            return False
        else:
            print("    ✅ Supabase anon key configured")
        
        # Check R2 config (optional but recommended)
        if not r2_config.get('access_key_id'):
            print("    ⚠️  R2 access key not configured (image upload will not work)")
        else:
            print("    ✅ R2 access key configured")
        
        if not r2_config.get('secret_access_key'):
            print("    ⚠️  R2 secret key not configured (image upload will not work)")
        else:
            print("    ✅ R2 secret key configured")
        
        print("    ✅ Environment configuration loaded successfully")
        return True
        
    except Exception as e:
        print(f"    ❌ Environment configuration failed: {e}")
        return False


def test_database_models():
    """Test database models."""
    print("\n🗄️  Testing database models...")
    
    try:
        from models.post import Post, User
        from models.category import Category
        from models.tag import Tag
        from datetime import datetime
        
        # Test Post model
        post = Post(
            title="Test Post",
            slug="test-post",
            content="Test content",
            status="draft"
        )
        
        post_dict = post.to_dict()
        post_from_dict = Post.from_dict(post_dict)
        
        print("    ✅ Post model working")
        
        # Test Category model
        category = Category(
            name="Test Category",
            slug="test-category",
            color="#6366f1"
        )
        
        category_dict = category.to_dict()
        category_from_dict = Category.from_dict(category_dict)
        
        print("    ✅ Category model working")
        
        # Test Tag model
        tag = Tag(
            name="Test Tag",
            slug="test-tag",
            color="#10b981"
        )
        
        tag_dict = tag.to_dict()
        tag_from_dict = Tag.from_dict(tag_dict)
        
        print("    ✅ Tag model working")
        
        return True
        
    except Exception as e:
        print(f"    ❌ Database models test failed: {e}")
        return False


def test_validators():
    """Test validation utilities."""
    print("\n✅ Testing validators...")
    
    try:
        from utils.validators import Validator
        
        # Test title validation
        valid, error = Validator.validate_title("Test Title")
        if not valid:
            print(f"    ❌ Title validation failed: {error}")
            return False
        
        # Test slug validation
        valid, error = Validator.validate_slug("test-slug")
        if not valid:
            print(f"    ❌ Slug validation failed: {error}")
            return False
        
        # Test email validation
        valid, error = Validator.validate_email("test@example.com")
        if not valid:
            print(f"    ❌ Email validation failed: {error}")
            return False
        
        print("    ✅ Validators working correctly")
        return True
        
    except Exception as e:
        print(f"    ❌ Validators test failed: {e}")
        return False


def test_ui_components():
    """Test UI components can be imported."""
    print("\n🎨 Testing UI components...")
    
    try:
        # Test if tkinter is available
        import tkinter as tk
        
        # Test creating a simple window (don't show it)
        root = tk.Tk()
        root.withdraw()  # Hide the window
        
        # Test main window import
        from ui.main_window import MainWindow
        
        # Test other UI components
        from ui.post_editor import PostEditor
        from ui.post_manager import PostManager
        from ui.category_manager import CategoryManager
        from ui.tag_manager import TagManager
        from ui.components.login_dialog import LoginDialog
        
        root.destroy()
        
        print("    ✅ UI components imported successfully")
        return True
        
    except Exception as e:
        print(f"    ❌ UI components test failed: {e}")
        return False


def test_services():
    """Test service initialization."""
    print("\n🔧 Testing services...")
    
    try:
        from services.supabase_service import supabase_service
        from services.storage_service import storage_service
        from services.auth_service import auth_service
        
        # Test service initialization (don't actually connect)
        print("    ✅ Supabase service initialized")
        print("    ✅ Storage service initialized")
        print("    ✅ Auth service initialized")
        
        return True
        
    except Exception as e:
        print(f"    ❌ Services test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("="*60)
    print("🧪 Blog Admin Desktop Application - Installation Test")
    print("="*60)
    
    tests = [
        ("Python Version", test_python_version),
        ("Module Imports", test_imports),
        ("Environment Config", test_environment),
        ("Database Models", test_database_models),
        ("Validators", test_validators),
        ("UI Components", test_ui_components),
        ("Services", test_services),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"\n❌ {test_name} test failed")
        except Exception as e:
            print(f"\n❌ {test_name} test crashed: {e}")
    
    print("\n" + "="*60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    print("="*60)
    
    if passed == total:
        print("🎉 All tests passed! The application should work correctly.")
        print("\nYou can now run the application with:")
        print("  python main.py")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("\nCommon solutions:")
        print("1. Install missing dependencies: pip install -r requirements.txt")
        print("2. Check your .env.local file configuration")
        print("3. Ensure you're using Python 3.8 or higher")
        print("4. Run setup.py for automated configuration")
    
    print("="*60)
    
    return 0 if passed == total else 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
