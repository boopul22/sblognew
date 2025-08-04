require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

class FeaturedImageSetter {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    this.stats = {
      totalPosts: 0,
      postsWithImages: 0,
      postsUpdated: 0,
      postsSkipped: 0,
      errors: 0
    };
  }

  async run() {
    try {
      console.log('🖼️  Setting Featured Images for Posts...\n');
      
      // Get all posts with content
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select('id, title, slug, content, featured_image_url')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }

      this.stats.totalPosts = posts.length;
      console.log(`📊 Found ${posts.length} posts to process\n`);

      // Process each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        console.log(`Processing ${i + 1}/${posts.length}: ${post.title}`);
        
        await this.processPost(post);
      }

      this.printStats();
      console.log('\n✅ Featured image setting completed!');

    } catch (error) {
      console.error('❌ Failed to set featured images:', error.message);
      this.printStats();
      process.exit(1);
    }
  }

  async processPost(post) {
    try {
      // Skip if already has featured image
      if (post.featured_image_url) {
        console.log(`  ⏭️  Already has featured image, skipping`);
        this.stats.postsSkipped++;
        return;
      }

      // Extract the best image from content
      const featuredImageUrl = this.selectBestFeaturedImage(post.content);
      
      if (!featuredImageUrl) {
        console.log(`  ❌ No suitable image found`);
        this.stats.postsSkipped++;
        return;
      }

      // Update the post with featured image
      const { error } = await this.supabase
        .from('posts')
        .update({ featured_image_url: featuredImageUrl })
        .eq('id', post.id);

      if (error) {
        throw new Error(`Failed to update post: ${error.message}`);
      }

      console.log(`  ✅ Set featured image: ${this.getImageName(featuredImageUrl)}`);
      this.stats.postsUpdated++;
      this.stats.postsWithImages++;

    } catch (error) {
      console.error(`  ❌ Error processing post: ${error.message}`);
      this.stats.errors++;
    }
  }

  selectBestFeaturedImage(content) {
    if (!content) return null;

    // Extract all images from content
    const imageRegex = /<img[^>]+src="([^"]*)"[^>]*>/gi;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const imageUrl = match[1];
      
      // Only consider Supabase images (migrated images)
      if (imageUrl.includes('supabase.co/storage/v1/object/public/images/')) {
        images.push({
          url: imageUrl,
          position: match.index,
          context: this.getImageContext(content, match.index)
        });
      }
    }

    if (images.length === 0) return null;

    // Select the best image based on criteria
    return this.rankImages(images)[0]?.url || null;
  }

  getImageContext(content, position) {
    // Get surrounding text to understand image context
    const start = Math.max(0, position - 200);
    const end = Math.min(content.length, position + 200);
    const context = content.substring(start, end).toLowerCase();
    
    return {
      isEarly: position < content.length * 0.3, // Image appears in first 30% of content
      hasTitle: context.includes('title') || context.includes('heading'),
      hasIntro: context.includes('intro') || context.includes('overview'),
      isFigure: context.includes('<figure') || context.includes('wp-block-image'),
      isLarge: context.includes('size-large') || context.includes('1024x1024'),
      context: context
    };
  }

  rankImages(images) {
    return images.map(img => ({
      ...img,
      score: this.calculateImageScore(img)
    })).sort((a, b) => b.score - a.score);
  }

  calculateImageScore(image) {
    let score = 0;
    const ctx = image.context;

    // Prefer images that appear early in the content
    if (ctx.isEarly) score += 10;

    // Prefer larger images
    if (ctx.isLarge) score += 8;

    // Prefer images in figure blocks (more likely to be featured)
    if (ctx.isFigure) score += 6;

    // Prefer images near titles or headings
    if (ctx.hasTitle) score += 5;

    // Prefer images in intro sections
    if (ctx.hasIntro) score += 4;

    // Prefer images with descriptive filenames
    const filename = image.url.toLowerCase();
    if (filename.includes('featured') || filename.includes('main') || filename.includes('hero')) {
      score += 15;
    }

    // Avoid images that seem like icons or small graphics
    if (filename.includes('icon') || filename.includes('logo') || filename.includes('button')) {
      score -= 10;
    }

    return score;
  }

  getImageName(url) {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename.length > 50 ? filename.substring(0, 47) + '...' : filename;
    } catch {
      return 'unknown';
    }
  }

  printStats() {
    console.log('\n📊 FEATURED IMAGE SETTING STATISTICS:');
    console.log(`📝 Total Posts: ${this.stats.totalPosts}`);
    console.log(`🖼️  Posts with Images: ${this.stats.postsWithImages}`);
    console.log(`✅ Posts Updated: ${this.stats.postsUpdated}`);
    console.log(`⏭️  Posts Skipped: ${this.stats.postsSkipped}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    
    if (this.stats.totalPosts > 0) {
      const successRate = Math.round((this.stats.postsUpdated / this.stats.totalPosts) * 100);
      console.log(`📈 Success Rate: ${successRate}%`);
    }
  }
}

// Run the featured image setter
console.log('🚀 Starting Featured Image Setting Process...\n');
const setter = new FeaturedImageSetter();
setter.run();
