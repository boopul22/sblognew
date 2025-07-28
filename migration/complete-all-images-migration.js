require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const https = require('https');
const http = require('http');

class MaxSpeedImageMigration {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    this.wordpressBaseUrl = process.env.WORDPRESS_BASE_URL || 'https://zayotech.com';
    
    // MAXIMUM SPEED SETTINGS - Push Supabase to the limit
    this.MAX_CONCURRENT_UPLOADS = 100;      // Aggressive parallel uploads
    this.MAX_CONCURRENT_DOWNLOADS = 150;    // Even more aggressive downloads
    this.MAX_CONCURRENT_DB_OPERATIONS = 50; // Database operations
    this.CHUNK_SIZE = 25;                   // Process in chunks
    this.TIMEOUT = 15000;                   // Fast timeout
    this.MAX_RETRIES = 2;                   // Quick retries only
    
    // Optimize HTTP agents for maximum concurrency
    this.httpsAgent = new https.Agent({
      maxSockets: 200,
      maxFreeSockets: 50,
      keepAlive: true,
      keepAliveMsecs: 1000
    });
    
    this.httpAgent = new http.Agent({
      maxSockets: 200,
      maxFreeSockets: 50,
      keepAlive: true,
      keepAliveMsecs: 1000
    });
    
    // Configure axios for maximum performance
    axios.defaults.timeout = this.TIMEOUT;
    axios.defaults.httpsAgent = this.httpsAgent;
    axios.defaults.httpAgent = this.httpAgent;
    
    this.stats = {
      totalImages: 0,
      downloaded: 0,
      uploaded: 0,
      failed: 0,
      postsUpdated: 0,
      startTime: Date.now()
    };
  }

  async run() {
    try {
      console.log('🚀 MAXIMUM SPEED IMAGE MIGRATION STARTED!\n');
      console.log(`⚡ Concurrency Settings:`);
      console.log(`   - Downloads: ${this.MAX_CONCURRENT_DOWNLOADS}`);
      console.log(`   - Uploads: ${this.MAX_CONCURRENT_UPLOADS}`);
      console.log(`   - DB Operations: ${this.MAX_CONCURRENT_DB_OPERATIONS}\n`);
      
      // Step 1: Extract ALL image URLs (parallel processing)
      const imageUrls = await this.extractAllImageUrls();
      this.stats.totalImages = imageUrls.length;
      console.log(`📸 Found ${imageUrls.length} images to migrate\n`);
      
      // Step 2: Download and upload with MAXIMUM concurrency
      const urlMapping = await this.hyperParallelImageProcessing(imageUrls);
      
      // Step 3: Update posts with maximum database concurrency
      await this.hyperParallelPostUpdates(urlMapping);
      
      // Step 4: Quick verification
      await this.quickVerification();
      
      this.printStats();
      console.log('\n🎉 MAXIMUM SPEED MIGRATION COMPLETED!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      this.printStats();
      process.exit(1);
    }
  }

  async extractAllImageUrls() {
    console.log('🔍 Extracting image URLs with parallel processing...');
    
    // Get ALL posts in parallel chunks
    const { data: allPosts, error } = await this.supabase
      .from('posts')
      .select('id, content');

    if (error) throw new Error(`Failed to fetch posts: ${error.message}`);

    // Process posts in parallel chunks for URL extraction
    const chunks = this.chunkArray(allPosts, this.CHUNK_SIZE);
    const imageUrlSets = await Promise.all(
      chunks.map(chunk => this.extractUrlsFromChunk(chunk))
    );

    // Combine all URLs and deduplicate
    const allUrls = new Set();
    imageUrlSets.forEach(urlSet => {
      urlSet.forEach(url => allUrls.add(url));
    });

    return Array.from(allUrls);
  }

  async extractUrlsFromChunk(posts) {
    const imageUrls = new Set();
    const patterns = [
      /https?:\/\/[^\/]*zayotech\.com\/wp-content\/uploads\/[^\s"'>]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/gi,
      /wp-content\/uploads\/[^\s"'>]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/gi,
    ];

    for (const post of posts) {
      if (!post.content) continue;
      
      for (const pattern of patterns) {
        const matches = [...post.content.matchAll(pattern)];
        matches.forEach(match => {
          let url = match[0];
          if (!url.startsWith('http')) {
            url = `${this.wordpressBaseUrl}/${url}`;
          }
          imageUrls.add(url);
        });
      }
    }

    return imageUrls;
  }

  async hyperParallelImageProcessing(imageUrls) {
    console.log('⚡ HYPER-PARALLEL IMAGE PROCESSING INITIATED!');
    
    const urlMapping = {};
    const semaphore = this.createSemaphore(this.MAX_CONCURRENT_UPLOADS);
    
    // Create all promises at once for maximum parallelism
    const processingPromises = imageUrls.map(async (imageUrl, index) => {
      return semaphore(async () => {
        const result = await this.processImageHyperSpeed(imageUrl, index + 1, imageUrls.length);
        if (result) {
          urlMapping[result.originalUrl] = result.newUrl;
          this.stats.uploaded++;
        } else {
          this.stats.failed++;
        }
        return result;
      });
    });

    // Start progress monitoring
    const progressInterval = setInterval(() => {
      const completed = this.stats.uploaded + this.stats.failed;
      const percentage = Math.round((completed / imageUrls.length) * 100);
      const rate = Math.round(completed / ((Date.now() - this.stats.startTime) / 1000));
      console.log(`📊 Progress: ${completed}/${imageUrls.length} (${percentage}%) | Rate: ${rate}/sec | Success: ${this.stats.uploaded} | Failed: ${this.stats.failed}`);
    }, 2000);

    // Wait for all processing to complete
    await Promise.allSettled(processingPromises);
    clearInterval(progressInterval);

    // Save URL mapping
    await fs.writeFile(
      path.join(__dirname, 'url-mapping.json'),
      JSON.stringify(urlMapping, null, 2)
    );

    console.log(`\n🎯 PROCESSING COMPLETE: ${this.stats.uploaded} uploaded, ${this.stats.failed} failed`);
    return urlMapping;
  }

  async processImageHyperSpeed(imageUrl, index, total) {
    const maxRetries = this.MAX_RETRIES;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Ultra-fast download with minimal timeout
        const downloadStart = Date.now();
        const response = await axios({
          method: 'GET',
          url: imageUrl,
          responseType: 'arraybuffer',
          timeout: this.TIMEOUT,
          maxContentLength: 50 * 1024 * 1024, // 50MB max
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/*',
            'Connection': 'keep-alive'
          }
        });

        this.stats.downloaded++;
        
        // Generate optimized filename
        const fileName = this.generateOptimizedFileName(imageUrl);
        const supabaseFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}-${fileName}`;

        // Ultra-fast upload to Supabase
        const uploadStart = Date.now();
        const { data: uploadData, error: uploadError } = await this.supabase.storage
          .from('images')
          .upload(supabaseFileName, response.data, {
            contentType: this.getContentType(fileName),
            upsert: false
          });

        if (uploadError) {
          if (attempt === maxRetries) {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
          continue; // Retry immediately
        }

        // Get public URL (no additional API call needed)
        const { data: { publicUrl } } = this.supabase.storage
          .from('images')
          .getPublicUrl(supabaseFileName);

        const totalTime = Date.now() - downloadStart;
        if (index % 10 === 0) { // Only log every 10th for speed
          console.log(`⚡ ${index}/${total}: ${path.basename(fileName)} (${totalTime}ms)`);
        }

        return { originalUrl: imageUrl, newUrl: publicUrl };

      } catch (error) {
        if (attempt === maxRetries) {
          if (index % 20 === 0) { // Reduce error logging for speed
            console.log(`❌ ${path.basename(imageUrl)}: ${error.message}`);
          }
          return null;
        }
        // No delay between retries for maximum speed
      }
    }
    return null;
  }

  async hyperParallelPostUpdates(urlMapping) {
    console.log('\n⚡ HYPER-PARALLEL POST UPDATES INITIATED!');
    
    if (Object.keys(urlMapping).length === 0) {
      console.log('⚠️ No URL mappings to process');
      return;
    }

    // Get all posts that need updating
    const { data: posts, error } = await this.supabase
      .from('posts')
      .select('id, title, content')
      .or('content.like.%wp-content%,content.like.%zayotech.com%');

    if (error) throw new Error(`Failed to fetch posts: ${error.message}`);

    console.log(`📝 Processing ${posts.length} posts with maximum concurrency...`);

    const semaphore = this.createSemaphore(this.MAX_CONCURRENT_DB_OPERATIONS);
    
    // Process all posts in parallel
    const updatePromises = posts.map(async (post) => {
      return semaphore(async () => {
        const result = await this.updatePostHyperSpeed(post, urlMapping);
        if (result.updated) {
          this.stats.postsUpdated++;
        }
        return result;
      });
    });

    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Post Updates Complete: ${successful} successful, ${failed} failed`);
  }

  async updatePostHyperSpeed(post, urlMapping) {
    try {
      let content = post.content;
      let hasChanges = false;
      let replacements = 0;

      // Ultra-fast URL replacement
      for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
        if (content.includes(oldUrl)) {
          content = content.split(oldUrl).join(newUrl); // Faster than regex
          replacements++;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        const { error } = await this.supabase
          .from('posts')
          .update({ content })
          .eq('id', post.id);

        if (error) throw new Error(`Update failed: ${error.message}`);

        return { updated: true, replacements };
      }

      return { updated: false, replacements: 0 };
    } catch (error) {
      console.error(`❌ Failed to update post "${post.title}": ${error.message}`);
      return { updated: false, replacements: 0 };
    }
  }

  async quickVerification() {
    console.log('\n🔍 Quick verification...');
    
    const { data: remainingPosts, error } = await this.supabase
      .from('posts')
      .select('id')
      .or('content.like.%wp-content%,content.like.%zayotech.com%');

    if (!error) {
      console.log(`📊 Posts still containing WordPress URLs: ${remainingPosts?.length || 0}`);
    }
  }

  // Utility functions
  createSemaphore(maxConcurrent) {
    const queue = [];
    let running = 0;

    return async (task) => {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        tryNext();
      });

      async function tryNext() {
        if (running >= maxConcurrent || queue.length === 0) return;
        
        running++;
        const { task, resolve, reject } = queue.shift();
        
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          running--;
          tryNext();
        }
      }
    };
  }

  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  generateOptimizedFileName(imageUrl) {
    try {
      const urlPath = new URL(imageUrl).pathname;
      let fileName = path.basename(urlPath);
      
      // Ultra-fast filename cleaning
      fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Limit filename length for performance
      if (fileName.length > 50) {
        const ext = path.extname(fileName);
        fileName = fileName.substring(0, 46) + ext;
      }
      
      return fileName;
    } catch {
      return `image_${Date.now()}.jpg`;
    }
  }

  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    // Optimized lookup table
    return {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }[ext] || 'image/jpeg';
  }

  printStats() {
    const duration = (Date.now() - this.stats.startTime) / 1000;
    const rate = Math.round(this.stats.uploaded / duration);
    
    console.log('\n📊 MIGRATION STATISTICS:');
    console.log(`⏱️  Total Duration: ${Math.round(duration)}s`);
    console.log(`📸 Total Images: ${this.stats.totalImages}`);
    console.log(`✅ Successfully Uploaded: ${this.stats.uploaded}`);
    console.log(`❌ Failed: ${this.stats.failed}`);
    console.log(`📝 Posts Updated: ${this.stats.postsUpdated}`);
    console.log(`🚀 Average Rate: ${rate} images/second`);
    console.log(`📈 Success Rate: ${Math.round((this.stats.uploaded / this.stats.totalImages) * 100)}%`);
  }
}

// Add process optimization
process.env.UV_THREADPOOL_SIZE = '128'; // Increase thread pool
process.setMaxListeners(0); // Remove listener limit

// Run the maximum speed migration
console.log('🔥 INITIALIZING MAXIMUM SPEED MIGRATION ENGINE...\n');
const migration = new MaxSpeedImageMigration();
migration.run();