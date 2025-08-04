#!/usr/bin/env node

/**
 * Fix Featured Images Script
 * 
 * This script automatically sets featured images for posts by:
 * 1. Finding the first image in each post's content
 * 2. Setting it as the featured_image_url in the database
 * 3. Ensuring all posts have proper thumbnail images
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

class FeaturedImageFixer {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    this.stats = {
      totalPosts: 0,
      postsWithImages: 0,
      postsUpdated: 0,
      errors: 0
    };
  }

  async fixFeaturedImages() {
    console.log('🖼️  Starting Featured Image Fix...');
    console.log('=' .repeat(50));

    try {
      // Get all published posts without featured images
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select('id, title, slug, content, featured_image_url')
        .eq('status', 'published')
        .not('content', 'is', null);

      if (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }

      this.stats.totalPosts = posts.length;
      console.log(`📊 Found ${posts.length} published posts`);

      // Process each post
      for (const post of posts) {
        await this.processPost(post);
      }

      this.showResults();

    } catch (error) {
      console.error('❌ Featured image fix failed:', error.message);
      throw error;
    }
  }

  async processPost(post) {
    try {
      // Skip if already has featured image
      if (post.featured_image_url) {
        return;
      }

      // Extract first image from content
      const firstImageUrl = this.extractFirstImage(post.content);
      
      if (!firstImageUrl) {
        return;
      }

      this.stats.postsWithImages++;

      // Update post with featured image
      const { error } = await this.supabase
        .from('posts')
        .update({ 
          featured_image_url: firstImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) {
        console.error(`❌ Failed to update ${post.title}:`, error.message);
        this.stats.errors++;
        return;
      }

      this.stats.postsUpdated++;
      console.log(`✅ ${post.title}: ${firstImageUrl.split('/').pop()}`);

    } catch (error) {
      console.error(`❌ Error processing ${post.title}:`, error.message);
      this.stats.errors++;
    }
  }

  extractFirstImage(content) {
    if (!content) return null;

    // Look for images in order of preference:
    // 1. Cloudflare R2 images (already migrated)
    // 2. WordPress images (in case some weren't migrated)
    
    const patterns = [
      // R2 images (preferred)
      /<img[^>]+src=["']([^"']*pub-fc97d8e973a94b6ab42a5785e3a4130e\.r2\.dev[^"']*\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>/i,
      // WordPress images (fallback)
      /<img[^>]+src=["']([^"']*zayotech\.com[^"']*\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>/i,
      // Any other images
      /<img[^>]+src=["']([^"']*\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  showResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🎉 FEATURED IMAGE FIX COMPLETE!');
    console.log('='.repeat(50));
    console.log(`📊 Total Posts: ${this.stats.totalPosts}`);
    console.log(`🖼️  Posts with Images: ${this.stats.postsWithImages}`);
    console.log(`✅ Posts Updated: ${this.stats.postsUpdated}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    
    const successRate = ((this.stats.postsUpdated / this.stats.postsWithImages) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('='.repeat(50));
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new FeaturedImageFixer();
  fixer.fixFeaturedImages().catch(error => {
    console.error('Fix failed:', error);
    process.exit(1);
  });
}

module.exports = FeaturedImageFixer;
