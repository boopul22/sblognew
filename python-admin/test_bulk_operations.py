#!/usr/bin/env python3
"""
Test script for bulk post operations functionality.
"""

import sys
import os
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from services.supabase_service import supabase_service
    from utils.bulk_operations_logger import bulk_logger
    from utils.helpers import DebugHelper
    from config.env_loader import config
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Please ensure all dependencies are installed: pip install -r requirements.txt")
    sys.exit(1)


def test_supabase_connection():
    """Test Supabase connection."""
    print("Testing Supabase connection...")
    try:
        # Try to get a small number of posts to test connection
        posts = supabase_service.get_posts(limit=1)
        print(f"✅ Supabase connection successful. Found {len(posts)} posts.")
        return True
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False


def test_bulk_operations_service():
    """Test bulk operations service methods."""
    print("\nTesting bulk operations service...")
    
    try:
        # Test with empty list (should handle gracefully)
        success, message, count = supabase_service.bulk_update_post_status([], 'published')
        if not success and "No posts selected" in message:
            print("✅ Empty post list handled correctly")
        else:
            print("❌ Empty post list not handled correctly")
            return False
        
        # Test with invalid status
        success, message, count = supabase_service.bulk_update_post_status(['test-id'], 'invalid_status')
        if not success and "Invalid status" in message:
            print("✅ Invalid status handled correctly")
        else:
            print("❌ Invalid status not handled correctly")
            return False
        
        print("✅ Bulk operations service tests passed")
        return True
        
    except Exception as e:
        print(f"❌ Bulk operations service test failed: {e}")
        return False


def test_bulk_logger():
    """Test bulk operations logger."""
    print("\nTesting bulk operations logger...")
    
    try:
        # Test logging a bulk operation
        operation_id = bulk_logger.log_bulk_operation_start(
            operation_type="test_operation",
            post_ids=["test-id-1", "test-id-2"],
            target_status="published",
            user_id="test-user"
        )
        
        if operation_id:
            print("✅ Bulk operation start logged successfully")
            
            # Test logging completion
            bulk_logger.log_bulk_operation_complete(
                operation_id=operation_id,
                success=True,
                updated_count=2,
                failed_count=0
            )
            print("✅ Bulk operation completion logged successfully")
            
            # Test getting recent operations
            recent_ops = bulk_logger.get_recent_operations(limit=1)
            if recent_ops and len(recent_ops) > 0:
                print("✅ Recent operations retrieved successfully")
            else:
                print("⚠️  No recent operations found (this may be normal)")
            
            return True
        else:
            print("❌ Failed to log bulk operation start")
            return False
            
    except Exception as e:
        print(f"❌ Bulk logger test failed: {e}")
        return False


def test_configuration():
    """Test configuration setup."""
    print("\nTesting configuration...")
    
    try:
        # Check Supabase configuration
        supabase_config = config.get_supabase_config()
        if supabase_config['url'] and supabase_config['anon_key']:
            print("✅ Supabase configuration is present")
        else:
            print("❌ Supabase configuration is missing")
            return False
        
        # Print configuration summary
        config.print_config_summary()
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("="*60)
    print("🧪 Testing Bulk Post Operations Functionality")
    print("="*60)
    
    tests = [
        ("Configuration", test_configuration),
        ("Supabase Connection", test_supabase_connection),
        ("Bulk Operations Service", test_bulk_operations_service),
        ("Bulk Operations Logger", test_bulk_logger),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} test PASSED")
            else:
                print(f"❌ {test_name} test FAILED")
        except Exception as e:
            print(f"❌ {test_name} test FAILED with exception: {e}")
    
    print("\n" + "="*60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Bulk operations functionality is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the configuration and dependencies.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
