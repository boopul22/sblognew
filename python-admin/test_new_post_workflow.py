#!/usr/bin/env python3
"""
Test the exact workflow of creating a new post with image upload.
"""

import sys
import os
import tempfile
from pathlib import Path
from PIL import Image

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from services.storage_service import storage_service
    from services.supabase_service import supabase_service
    from services.auth_service import auth_service
    from models.post import Post
    from datetime import datetime
    
    print("="*70)
    print("🧪 TESTING NEW POST CREATION WORKFLOW")
    print("="*70)
    
    # Step 1: Simulate user login (required for post creation)
    print("\n1. 🔐 Simulating user authentication...")
    try:
        # Try to login with admin credentials
        success, message = auth_service.login("tricksplacess.com@gmail.com", "admin123")
        if success:
            print(f"✅ Logged in as: {auth_service.current_user.email}")
        else:
            print(f"❌ Login failed: {message}")
            print("   Using fallback user ID for testing...")
            # We'll use a known admin user ID for testing
    except Exception as e:
        print(f"⚠️  Auth error: {e}, continuing with test...")
    
    # Step 2: Create test image (simulating Browse button)
    print("\n2. 📁 Creating test image...")
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        img = Image.new('RGB', (300, 200), color='green')
        img.save(temp_file.name, 'PNG')
        test_image_path = temp_file.name
        print(f"✅ Test image created: {os.path.basename(test_image_path)}")
    
    # Step 3: Upload image (simulating Upload button)
    print("\n3. ⬆️  Uploading image...")
    success, message, public_url = storage_service.upload_image(test_image_path)
    
    if success and public_url:
        print(f"✅ Upload successful!")
        print(f"   Public URL: {public_url}")
        
        # Verify URL structure
        if 'blog-images/' in public_url:
            print("✅ URL has correct 'blog-images/' prefix")
        else:
            print("❌ URL missing 'blog-images/' prefix")
            print("   This is the problem!")
            
    else:
        print(f"❌ Upload failed: {message}")
        sys.exit(1)
    
    # Step 4: Create post object (simulating form submission)
    print("\n4. 📝 Creating post object...")
    
    # Get admin user ID
    admin_user_id = None
    if auth_service.current_user:
        admin_user_id = auth_service.current_user.id
    else:
        # Fallback to known admin user
        admin_user_id = "b8c5e2f1-4a3d-4e8f-9c1b-2d3e4f5a6b7c"  # Replace with actual admin ID
    
    test_post = Post(
        title="Test New Post Workflow",
        slug="test-new-post-workflow",
        content="This is a test post to verify the new post creation workflow with image upload.",
        excerpt="Testing new post workflow",
        featured_image_url=public_url,  # This should be the correct URL
        status="draft",
        author_id=admin_user_id
    )
    
    print(f"✅ Post object created")
    print(f"   Title: {test_post.title}")
    print(f"   Featured Image URL: {test_post.featured_image_url}")
    
    # Step 5: Save post to database (simulating Save button)
    print("\n5. 💾 Saving post to database...")
    try:
        saved_post = supabase_service.create_post(test_post)
        
        if saved_post and saved_post.id:
            print(f"✅ Post saved successfully!")
            print(f"   Post ID: {saved_post.id}")
            print(f"   Saved Featured Image URL: {saved_post.featured_image_url}")
            
            # Step 6: Verify the URL in database matches what we expect
            print("\n6. 🔍 Verifying saved URL...")
            if saved_post.featured_image_url == public_url:
                print("✅ Saved URL matches uploaded URL - CORRECT!")
            else:
                print("❌ URL MISMATCH!")
                print(f"   Expected: {public_url}")
                print(f"   Saved:    {saved_post.featured_image_url}")
            
            # Step 7: Test image accessibility
            print("\n7. 🌐 Testing image accessibility...")
            import requests
            try:
                response = requests.head(saved_post.featured_image_url, timeout=5)
                if response.status_code == 200:
                    print("✅ Image is accessible from saved URL")
                else:
                    print(f"❌ Image not accessible: Status {response.status_code}")
            except Exception as e:
                print(f"❌ Error testing accessibility: {e}")
            
            # Cleanup: Delete test post
            print("\n8. 🧹 Cleaning up...")
            try:
                supabase_service.delete_post(saved_post.id)
                print("✅ Test post deleted")
            except Exception as e:
                print(f"⚠️  Could not delete test post: {e}")
                
        else:
            print("❌ Failed to save post")
            
    except Exception as e:
        print(f"❌ Error saving post: {e}")
    
    # Cleanup local file
    try:
        os.unlink(test_image_path)
        print("✅ Local test image cleaned up")
    except:
        pass
    
    print("\n" + "="*70)
    print("🎯 NEW POST WORKFLOW TEST COMPLETE")
    print("="*70)
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
