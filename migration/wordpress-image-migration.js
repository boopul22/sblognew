#!/usr/bin/env node

/**
 * WordPress to Cloudflare R2 Image Migration Script
 * 
 * This script:
 * 1. Extracts all image URLs from WordPress content in Supabase
 * 2. Downloads images from WordPress site
 * 3. Uploads them to Cloudflare R2 storage
 * 4. Updates database with new R2 URLs
 * 5. Provides comprehensive logging and error handling
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

class WordPressImageMigration {
  constructor() {
    // Supabase configuration
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Check your .env file.');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
    
    // Cloudflare R2 configuration
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
    
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    this.publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    
    // Migration configuration
    this.wordpressBaseUrl = 'https://zayotech.com';
    this.batchSize = parseInt(process.env.BATCH_SIZE) || 10;
    this.dryRun = process.env.DRY_RUN === 'true';
    this.maxRetries = 3;
    this.downloadTimeout = 30000; // 30 seconds
    
    // Migration state
    this.stats = {
      totalImages: 0,
      downloaded: 0,
      uploaded: 0,
      updated: 0,
      errors: 0,
      skipped: 0
    };
    
    this.errors = [];
    this.imageMapping = new Map(); // WordPress URL -> R2 URL
    this.processedImages = new Set(); // Track processed images to avoid duplicates
  }

  /**
   * Main migration orchestrator
   */
  async migrate() {
    try {
      this.log('🚀 Starting WordPress Image Migration to Cloudflare R2');
      this.log(`Configuration: Batch Size: ${this.batchSize}, Dry Run: ${this.dryRun}`);
      this.log('=' .repeat(80));

      // Step 1: Extract all image URLs from database
      await this.extractImageUrls();

      // Step 2: Download and upload images in batches
      await this.processImageBatches();

      // Step 3: Update database with new URLs
      if (!this.dryRun) {
        await this.updateDatabaseUrls();
      }

      // Step 4: Generate final report
      await this.generateMigrationReport();

      this.log('✅ Image migration completed successfully!');
      
    } catch (error) {
      this.logError('❌ Image migration failed:', error);
      throw error;
    }
  }

  /**
   * Extract all image URLs from post content
   */
  async extractImageUrls() {
    this.log('🔍 Extracting image URLs from database...');
    
    const { data: posts, error } = await this.supabase
      .from('posts')
      .select('id, title, slug, content, featured_image_url')
      .eq('status', 'published')
      .not('content', 'is', null);
    
    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
    
    this.imageUrls = new Set();
    this.postImageMap = new Map(); // post_id -> [image_urls]
    
    for (const post of posts) {
      const imageUrls = this.extractImagesFromContent(post.content);
      
      if (post.featured_image_url) {
        imageUrls.push(post.featured_image_url);
      }
      
      if (imageUrls.length > 0) {
        this.postImageMap.set(post.id, imageUrls);
        imageUrls.forEach(url => this.imageUrls.add(url));
      }
    }
    
    this.stats.totalImages = this.imageUrls.size;
    this.log(`✅ Found ${this.stats.totalImages} unique images across ${posts.length} posts`);
  }

  /**
   * Extract image URLs from HTML content
   */
  extractImagesFromContent(content) {
    if (!content) return [];
    
    const imageUrls = [];
    
    // Match img tags with src attributes
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];
      
      // Only process WordPress images from the original site
      if (url.includes('zayotech.com') && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp'))) {
        imageUrls.push(url);
      }
    }
    
    return imageUrls;
  }

  /**
   * Process images in batches
   */
  async processImageBatches() {
    this.log('📥 Starting image download and upload process...');
    
    const imageArray = Array.from(this.imageUrls);
    
    for (let i = 0; i < imageArray.length; i += this.batchSize) {
      const batch = imageArray.slice(i, i + this.batchSize);
      
      this.log(`\n📦 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(imageArray.length / this.batchSize)} (${batch.length} images)`);
      
      await Promise.all(batch.map(url => this.processImage(url)));
      
      // Add small delay between batches to be respectful
      if (i + this.batchSize < imageArray.length) {
        await this.sleep(1000);
      }
    }
  }

  /**
   * Process a single image: download and upload
   */
  async processImage(imageUrl) {
    try {
      // Skip if already processed
      if (this.processedImages.has(imageUrl)) {
        this.stats.skipped++;
        return;
      }
      
      this.processedImages.add(imageUrl);
      
      // Generate R2 filename
      const filename = this.generateR2Filename(imageUrl);
      const r2Url = `${this.publicUrl}/${filename}`;
      
      // Check if image already exists in R2
      if (!this.dryRun && await this.imageExistsInR2(filename)) {
        this.log(`⏭️  Skipping ${filename} (already exists in R2)`);
        this.imageMapping.set(imageUrl, r2Url);
        this.stats.skipped++;
        return;
      }
      
      if (this.dryRun) {
        this.log(`🔍 [DRY RUN] Would process: ${imageUrl} -> ${filename}`);
        this.imageMapping.set(imageUrl, r2Url);
        this.stats.downloaded++;
        this.stats.uploaded++;
        return;
      }
      
      // Download image
      const imageBuffer = await this.downloadImage(imageUrl);
      if (!imageBuffer) {
        this.stats.errors++;
        return;
      }
      
      this.stats.downloaded++;
      
      // Upload to R2
      const uploadSuccess = await this.uploadToR2(filename, imageBuffer, imageUrl);
      if (uploadSuccess) {
        this.imageMapping.set(imageUrl, r2Url);
        this.stats.uploaded++;
        this.log(`✅ ${filename} uploaded successfully`);
      } else {
        this.stats.errors++;
      }
      
    } catch (error) {
      this.logError(`Error processing image ${imageUrl}:`, error);
      this.stats.errors++;
    }
  }

  /**
   * Generate R2 filename from WordPress URL
   */
  generateR2Filename(imageUrl) {
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      
      // Extract filename from path like /wp-content/uploads/2023/12/image.jpg
      const pathParts = pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      
      // Create organized path: year/month/filename
      const uploadMatch = pathname.match(/\/wp-content\/uploads\/(\d{4})\/(\d{2})\//);
      if (uploadMatch) {
        const [, year, month] = uploadMatch;
        return `wordpress-images/${year}/${month}/${filename}`;
      }
      
      // Fallback: use just the filename with wordpress-images prefix
      return `wordpress-images/misc/${filename}`;
      
    } catch (error) {
      // Fallback for invalid URLs
      const filename = imageUrl.split('/').pop() || 'unknown.jpg';
      return `wordpress-images/misc/${filename}`;
    }
  }

  /**
   * Check if image already exists in R2
   */
  async imageExistsInR2(filename) {
    try {
      await this.r2Client.send(new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: filename
      }));
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Download image from WordPress site
   */
  async downloadImage(imageUrl) {
    return new Promise((resolve) => {
      let retries = 0;
      
      const attemptDownload = () => {
        const protocol = imageUrl.startsWith('https:') ? https : http;
        
        const request = protocol.get(imageUrl, { timeout: this.downloadTimeout }, (response) => {
          if (response.statusCode === 200) {
            const chunks = [];
            
            response.on('data', (chunk) => {
              chunks.push(chunk);
            });
            
            response.on('end', () => {
              const buffer = Buffer.concat(chunks);
              resolve(buffer);
            });
            
          } else if (response.statusCode === 404) {
            this.logError(`Image not found (404): ${imageUrl}`);
            resolve(null);
          } else if (retries < this.maxRetries) {
            retries++;
            this.log(`⚠️  Retry ${retries}/${this.maxRetries} for ${imageUrl} (status: ${response.statusCode})`);
            setTimeout(attemptDownload, 1000 * retries);
          } else {
            this.logError(`Failed to download after ${this.maxRetries} retries: ${imageUrl} (status: ${response.statusCode})`);
            resolve(null);
          }
        });
        
        request.on('error', (error) => {
          if (retries < this.maxRetries) {
            retries++;
            this.log(`⚠️  Retry ${retries}/${this.maxRetries} for ${imageUrl} (error: ${error.message})`);
            setTimeout(attemptDownload, 1000 * retries);
          } else {
            this.logError(`Download error after ${this.maxRetries} retries: ${imageUrl}`, error);
            resolve(null);
          }
        });
        
        request.on('timeout', () => {
          request.destroy();
          if (retries < this.maxRetries) {
            retries++;
            this.log(`⚠️  Retry ${retries}/${this.maxRetries} for ${imageUrl} (timeout)`);
            setTimeout(attemptDownload, 1000 * retries);
          } else {
            this.logError(`Download timeout after ${this.maxRetries} retries: ${imageUrl}`);
            resolve(null);
          }
        });
      };
      
      attemptDownload();
    });
  }

  /**
   * Upload image to Cloudflare R2
   */
  async uploadToR2(filename, buffer, originalUrl) {
    try {
      const contentType = this.getContentType(filename);
      
      await this.r2Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          'original-url': originalUrl,
          'migrated-at': new Date().toISOString()
        }
      }));
      
      return true;
      
    } catch (error) {
      this.logError(`Failed to upload ${filename} to R2:`, error);
      return false;
    }
  }

  /**
   * Get content type from filename
   */
  getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return contentTypes[ext] || 'image/jpeg';
  }

  /**
   * Utility methods
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
  }

  logError(message, error) {
    const errorMessage = `${message} ${error?.message || error}`;
    this.log(`❌ ${errorMessage}`);
    this.errors.push({ message: errorMessage, error: error?.stack });
  }

  /**
   * Update database with new R2 URLs
   */
  async updateDatabaseUrls() {
    this.log('\n🔄 Updating database with new R2 URLs...');

    let updatedPosts = 0;

    for (const [postId, imageUrls] of this.postImageMap) {
      try {
        // Get current post content
        const { data: post, error: fetchError } = await this.supabase
          .from('posts')
          .select('content, featured_image_url')
          .eq('id', postId)
          .single();

        if (fetchError) {
          this.logError(`Failed to fetch post ${postId}:`, fetchError);
          continue;
        }

        let updatedContent = post.content;
        let updatedFeaturedImage = post.featured_image_url;
        let hasChanges = false;

        // Replace image URLs in content
        for (const oldUrl of imageUrls) {
          const newUrl = this.imageMapping.get(oldUrl);
          if (newUrl && updatedContent && updatedContent.includes(oldUrl)) {
            updatedContent = updatedContent.replace(new RegExp(this.escapeRegex(oldUrl), 'g'), newUrl);
            hasChanges = true;
          }

          // Update featured image if it matches
          if (newUrl && updatedFeaturedImage === oldUrl) {
            updatedFeaturedImage = newUrl;
            hasChanges = true;
          }
        }

        // Update post if there are changes
        if (hasChanges) {
          const updateData = {
            content: updatedContent,
            updated_at: new Date().toISOString()
          };

          if (updatedFeaturedImage !== post.featured_image_url) {
            updateData.featured_image_url = updatedFeaturedImage;
          }

          const { error: updateError } = await this.supabase
            .from('posts')
            .update(updateData)
            .eq('id', postId);

          if (updateError) {
            this.logError(`Failed to update post ${postId}:`, updateError);
          } else {
            updatedPosts++;
            this.stats.updated++;
          }
        }

      } catch (error) {
        this.logError(`Error updating post ${postId}:`, error);
      }
    }

    this.log(`✅ Updated ${updatedPosts} posts with new image URLs`);
  }

  /**
   * Escape special regex characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Generate comprehensive migration report
   */
  async generateMigrationReport() {
    this.log('\n📊 Generating migration report...');

    const report = {
      timestamp: new Date().toISOString(),
      configuration: {
        batchSize: this.batchSize,
        dryRun: this.dryRun,
        wordpressBaseUrl: this.wordpressBaseUrl,
        r2Bucket: this.bucketName,
        r2PublicUrl: this.publicUrl
      },
      statistics: this.stats,
      imageMapping: Object.fromEntries(this.imageMapping),
      errors: this.errors,
      summary: {
        successRate: this.stats.totalImages > 0 ?
          ((this.stats.uploaded / this.stats.totalImages) * 100).toFixed(1) + '%' : '0%',
        totalProcessed: this.stats.downloaded + this.stats.skipped + this.stats.errors,
        postsAffected: this.postImageMap.size
      }
    };

    const reportPath = path.join(__dirname, `image-migration-report-${Date.now()}.json`);

    try {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      this.log(`📝 Migration report saved: ${reportPath}`);
    } catch (error) {
      this.logError('Failed to save migration report:', error);
    }

    // Print summary to console
    this.printMigrationSummary();
  }

  /**
   * Print migration summary
   */
  printMigrationSummary() {
    this.log('\n' + '='.repeat(80));
    this.log('📊 IMAGE MIGRATION SUMMARY');
    this.log('='.repeat(80));

    this.log(`Total Images Found: ${this.stats.totalImages}`);
    this.log(`Successfully Downloaded: ${this.stats.downloaded}`);
    this.log(`Successfully Uploaded: ${this.stats.uploaded}`);
    this.log(`Database Updates: ${this.stats.updated}`);
    this.log(`Skipped (Already Exist): ${this.stats.skipped}`);
    this.log(`Errors: ${this.stats.errors}`);

    const successRate = this.stats.totalImages > 0 ?
      ((this.stats.uploaded / this.stats.totalImages) * 100).toFixed(1) : '0';

    this.log(`Success Rate: ${successRate}%`);
    this.log(`Posts Affected: ${this.postImageMap.size}`);

    if (this.errors.length > 0) {
      this.log('\n❌ Errors encountered:');
      this.errors.slice(0, 10).forEach((error, index) => {
        this.log(`   ${index + 1}. ${error.message}`);
      });

      if (this.errors.length > 10) {
        this.log(`   ... and ${this.errors.length - 10} more errors (see full report)`);
      }
    }

    this.log('='.repeat(80));

    if (this.dryRun) {
      this.log('🔍 This was a DRY RUN - no actual changes were made');
    } else if (this.stats.errors === 0) {
      this.log('🎉 Migration completed successfully with no errors!');
    } else {
      this.log('⚠️  Migration completed with some errors. Check the report for details.');
    }
  }
}

// Export for use as module or run directly
if (require.main === module) {
  const migration = new WordPressImageMigration();
  migration.migrate().catch(error => {
    console.error('Image migration failed:', error);
    process.exit(1);
  });
}

module.exports = WordPressImageMigration;
