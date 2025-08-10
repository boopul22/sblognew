#!/usr/bin/env python3
"""
Script to fix broken image URLs in the database.
"""

import sys
import re
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from services.supabase_service import supabase_service
    from config.env_loader import config
    
    print("="*60)
    print("🔧 Fixing Image URLs in Database")
    print("="*60)
    
    # Get R2 public URL
    r2_config = config.get_r2_config()
    public_url = r2_config['public_url']
    
    print(f"Public URL base: {public_url}")
    
    # Get all posts with featured images
    print("\n1. Fetching posts with featured images...")
    posts = supabase_service.get_posts(limit=200)  # Get more posts
    image_posts = [p for p in posts if p.featured_image_url]
    
    print(f"✅ Found {len(image_posts)} posts with featured images")
    
    # Analyze and fix URLs
    fixed_count = 0
    already_correct = 0
    
    for post in image_posts:
        current_url = post.featured_image_url
        print(f"\n📝 Post: {post.get_display_title()[:50]}...")
        print(f"   Current URL: {current_url}")
        
        # Check if URL is missing the blog-images/ prefix
        if 'blog-images/' not in current_url and not current_url.startswith('https://'):
            # This might be a relative URL that needs fixing
            print("   ⚠️  URL appears to be relative or malformed")
            continue
        
        # Check if URL is missing blog-images/ prefix but file exists in bucket
        if public_url in current_url:
            # Extract filename from URL
            filename = current_url.replace(public_url, '').lstrip('/')
            
            # Check if this looks like a blog-images file that's missing the prefix
            if (not filename.startswith('blog-images/') and 
                not filename.startswith('wordpress-images/') and
                '20250810_' in filename):  # Our timestamp pattern
                
                # This is likely a blog-images file missing the prefix
                corrected_filename = f"blog-images/{filename}"
                corrected_url = f"{public_url}/{corrected_filename}"
                
                print(f"   🔧 Needs fixing: {filename} -> {corrected_filename}")
                
                # Test if the corrected URL exists
                import requests
                try:
                    response = requests.head(corrected_url, timeout=5)
                    if response.status_code == 200:
                        print(f"   ✅ Corrected URL is accessible")
                        
                        # Update the database
                        try:
                            success = supabase_service.update_post(post.id, {
                                'featured_image_url': corrected_url
                            })
                            
                            if success:
                                print(f"   ✅ Database updated successfully")
                                fixed_count += 1
                            else:
                                print(f"   ❌ Failed to update database")
                        except Exception as e:
                            print(f"   ❌ Database update error: {e}")
                    else:
                        print(f"   ❌ Corrected URL not accessible (Status: {response.status_code})")
                except Exception as e:
                    print(f"   ❌ Error testing corrected URL: {e}")
            else:
                print("   ✅ URL structure looks correct")
                already_correct += 1
        else:
            print("   ⚠️  URL doesn't use expected public URL base")
    
    print(f"\n" + "="*60)
    print(f"🎯 Fix Summary:")
    print(f"   Total posts with images: {len(image_posts)}")
    print(f"   URLs fixed: {fixed_count}")
    print(f"   Already correct: {already_correct}")
    print(f"   Remaining issues: {len(image_posts) - fixed_count - already_correct}")
    print("="*60)
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
