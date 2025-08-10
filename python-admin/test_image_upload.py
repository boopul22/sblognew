#!/usr/bin/env python3
"""
Test script to verify image upload workflow and URL generation.
"""

import sys
import os
import requests
from pathlib import Path
from PIL import Image
import tempfile

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from config.env_loader import config
    from services.storage_service import storage_service
    
    print("="*60)
    print("🧪 Testing Image Upload Workflow")
    print("="*60)
    
    # Test 1: Check R2 Configuration
    print("\n1. Testing R2 Configuration...")
    r2_config = config.get_r2_config()
    print(f"   Bucket: {r2_config['bucket_name']}")
    print(f"   Public URL: {r2_config['public_url']}")
    print(f"   Endpoint: {r2_config['endpoint']}")
    
    if r2_config['public_url']:
        print("✅ R2 public URL is configured")
    else:
        print("❌ R2 public URL is missing")
    
    # Test 2: Create a test image
    print("\n2. Creating test image...")
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        img.save(temp_file.name, 'PNG')
        test_image_path = temp_file.name
        print(f"✅ Test image created: {test_image_path}")
    
    # Test 3: Upload the image
    print("\n3. Testing image upload...")
    try:
        success, message, public_url = storage_service.upload_image(test_image_path)
        
        if success:
            print(f"✅ Image uploaded successfully")
            print(f"   Public URL: {public_url}")
            
            # Test 4: Check if URL is accessible
            print("\n4. Testing URL accessibility...")
            try:
                response = requests.head(public_url, timeout=10)
                if response.status_code == 200:
                    print("✅ Image URL is accessible")
                    print(f"   Status: {response.status_code}")
                    print(f"   Content-Type: {response.headers.get('content-type', 'Unknown')}")
                else:
                    print(f"❌ Image URL returned status: {response.status_code}")
                    print(f"   Headers: {dict(response.headers)}")
            except Exception as e:
                print(f"❌ Error accessing URL: {e}")
                
                # Try with GET request
                try:
                    print("   Trying GET request...")
                    response = requests.get(public_url, timeout=10)
                    print(f"   GET Status: {response.status_code}")
                    if response.status_code == 200:
                        print("✅ Image accessible via GET request")
                    else:
                        print(f"❌ GET request failed: {response.status_code}")
                except Exception as get_error:
                    print(f"❌ GET request error: {get_error}")
            
            # Test 5: Check URL structure
            print("\n5. Analyzing URL structure...")
            print(f"   Generated URL: {public_url}")
            
            # Check if URL follows expected pattern
            expected_base = r2_config['public_url']
            if public_url.startswith(expected_base):
                print("✅ URL uses correct base domain")
                filename_part = public_url.replace(expected_base, '').lstrip('/')
                print(f"   Filename part: {filename_part}")
                
                if 'blog-images/' in filename_part:
                    print("⚠️  URL contains 'blog-images/' prefix - this might cause issues")
                else:
                    print("✅ URL structure looks correct")
            else:
                print(f"❌ URL doesn't use expected base: {expected_base}")
        
        else:
            print(f"❌ Image upload failed: {message}")
    
    except Exception as e:
        print(f"❌ Upload error: {e}")
    
    # Cleanup
    try:
        os.unlink(test_image_path)
        print(f"\n🧹 Cleaned up test image")
    except:
        pass
    
    # Test 6: Check existing images in database
    print("\n6. Checking existing images in database...")
    try:
        from services.supabase_service import supabase_service
        
        # Get a few posts with featured images
        posts = supabase_service.get_posts(limit=5)
        image_posts = [p for p in posts if p.featured_image_url]
        
        if image_posts:
            print(f"✅ Found {len(image_posts)} posts with featured images")
            for i, post in enumerate(image_posts[:3], 1):
                print(f"   {i}. {post.get_display_title()}")
                print(f"      URL: {post.featured_image_url}")
                
                # Test if these URLs are accessible
                try:
                    response = requests.head(post.featured_image_url, timeout=5)
                    status = "✅ Accessible" if response.status_code == 200 else f"❌ Status: {response.status_code}"
                    print(f"      Status: {status}")
                except Exception as e:
                    print(f"      Status: ❌ Error: {e}")
        else:
            print("⚠️  No posts with featured images found")
    
    except Exception as e:
        print(f"❌ Error checking database: {e}")
    
    print("\n" + "="*60)
    print("🎯 Test Summary Complete")
    print("="*60)
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
