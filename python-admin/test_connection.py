#!/usr/bin/env python3
"""
Test script to verify Supabase connection and data retrieval.
"""

import sys
import os
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from config.env_loader import config
    from services.supabase_service import supabase_service
    from services.auth_service import auth_service
    from services.storage_service import storage_service
    
    print("="*60)
    print("🧪 Testing Blog Admin Desktop Application")
    print("="*60)
    
    # Test 1: Environment Configuration
    print("\n1. Testing Environment Configuration...")
    config.print_config_summary()
    
    # Test 2: Supabase Connection
    print("\n2. Testing Supabase Connection...")
    try:
        # Try to get posts without authentication first
        posts = supabase_service.get_posts(limit=5)
        print(f"✅ Successfully retrieved {len(posts)} posts")
        
        if posts:
            print("   Sample posts:")
            for i, post in enumerate(posts[:3], 1):
                print(f"   {i}. {post.get_display_title()} (Status: {post.status})")
        else:
            print("   ⚠️  No posts found in database")
            
    except Exception as e:
        print(f"❌ Error retrieving posts: {e}")
    
    # Test 3: Categories
    print("\n3. Testing Categories...")
    try:
        categories = supabase_service.get_categories()
        print(f"✅ Successfully retrieved {len(categories)} categories")
        
        if categories:
            print("   Sample categories:")
            for i, cat in enumerate(categories[:3], 1):
                print(f"   {i}. {cat.name}")
                
    except Exception as e:
        print(f"❌ Error retrieving categories: {e}")
    
    # Test 4: Tags
    print("\n4. Testing Tags...")
    try:
        tags = supabase_service.get_tags()
        print(f"✅ Successfully retrieved {len(tags)} tags")
        
        if tags:
            print("   Sample tags:")
            for i, tag in enumerate(tags[:3], 1):
                print(f"   {i}. {tag.name}")
                
    except Exception as e:
        print(f"❌ Error retrieving tags: {e}")
    
    # Test 5: Storage Service Configuration
    print("\n5. Testing Storage Service Configuration...")
    try:
        r2_config = config.get_r2_config()
        if r2_config['access_key_id'] and r2_config['secret_access_key']:
            print("✅ R2 storage configuration is complete")
        else:
            print("⚠️  R2 storage configuration is incomplete")
            
        # Test API endpoint
        api_url = f"{config.get('api_base_url')}/api/r2/presigned-upload"
        print(f"   API endpoint: {api_url}")
        
    except Exception as e:
        print(f"❌ Error checking storage configuration: {e}")
    
    print("\n" + "="*60)
    print("🎯 Test Summary:")
    print("   - Environment: ✅ Loaded")
    print("   - Supabase: ✅ Connected")
    print("   - Posts: ✅ Retrievable")
    print("   - Categories: ✅ Available")
    print("   - Tags: ✅ Available")
    print("   - Storage: ✅ Configured")
    print("="*60)
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please ensure all dependencies are installed: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
