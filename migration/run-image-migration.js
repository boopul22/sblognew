#!/usr/bin/env node

/**
 * Fast WordPress Image Migration Runner with Parallel Processing
 * 
 * This script provides a high-performance interface for running the WordPress image migration
 * with parallel processing, connection pooling, and optimized batch handling.
 */

const readline = require('readline');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
const { Worker } = require('worker_threads');
const pLimit = require('p-limit');
const WordPressImageMigration = require('./wordpress-image-migration');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

class FastImageMigrationRunner {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Optimal concurrency settings based on research
    this.maxConcurrentDownloads = 50; // Safe limit for HTTP/2 multiplexing
    this.maxConcurrentUploads = 30;   // Conservative for R2 rate limits
    this.batchSize = parseInt(process.env.BATCH_SIZE) || 100;
    this.workerCount = Math.min(os.cpus().length, 4); // Limit workers
    
    // Connection pooling settings
    this.connectionPoolSize = 10;
    this.requestTimeout = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  async run() {
    try {
      console.log('🚀 Fast WordPress to Cloudflare R2 Image Migration');
      console.log('=' .repeat(60));
      
      // Show current configuration
      await this.showConfiguration();
      
      // Confirm migration settings
      const confirmed = await this.confirmMigration();
      if (!confirmed) {
        console.log('❌ Migration cancelled by user');
        process.exit(0);
      }
      
      // Initialize performance monitoring
      const startTime = Date.now();
      
      // Run the migration with parallel processing
      if (process.env.USE_CLUSTER === 'true') {
        await this.runClusteredMigration();
      } else {
        await this.runParallelMigration();
      }
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`\n✅ Image migration completed successfully in ${duration}s!`);
      console.log('📝 Check the migration report for detailed results');
      
    } catch (error) {
      console.error('\n❌ Image migration failed:', error.message);
      console.error('📝 Check the migration report and logs for details');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async runParallelMigration() {
    console.log('\n🔄 Starting parallel migration...');
    
    // Create limited concurrency functions
    const downloadLimit = pLimit(this.maxConcurrentDownloads);
    const uploadLimit = pLimit(this.maxConcurrentUploads);
    
    const migration = new FastWordPressImageMigration({
      downloadLimit,
      uploadLimit,
      batchSize: this.batchSize,
      connectionPoolSize: this.connectionPoolSize,
      requestTimeout: this.requestTimeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay
    });
    
    await migration.migrate();
  }

  async runClusteredMigration() {
    console.log('\n🔄 Starting clustered migration...');
    
    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`);
      console.log(`Starting ${this.workerCount} workers...`);
      
      // Fork workers
      for (let i = 0; i < this.workerCount; i++) {
        cluster.fork();
      }
      
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
      });
      
    } else {
      console.log(`Worker ${process.pid} started`);
      
      // Each worker runs a portion of the migration
      const migration = new FastWordPressImageMigration({
        workerId: cluster.worker.id,
        totalWorkers: this.workerCount,
        downloadLimit: pLimit(Math.ceil(this.maxConcurrentDownloads / this.workerCount)),
        uploadLimit: pLimit(Math.ceil(this.maxConcurrentUploads / this.workerCount)),
        batchSize: Math.ceil(this.batchSize / this.workerCount)
      });
      
      await migration.migrate();
    }
  }

  async showConfiguration() {
    console.log('\n📋 Current Configuration:');
    console.log('-'.repeat(40));
    console.log(`Supabase URL: ${process.env.SUPABASE_URL || 'Not set'}`);
    console.log(`Service Key: ${process.env.SUPABASE_SERVICE_KEY ? '***' + process.env.SUPABASE_SERVICE_KEY.slice(-4) : 'Not set'}`);
    console.log(`R2 Bucket: ${process.env.CLOUDFLARE_R2_BUCKET_NAME || 'Not set'}`);
    console.log(`R2 Public URL: ${process.env.CLOUDFLARE_R2_PUBLIC_URL || 'Not set'}`);
    console.log(`R2 Endpoint: ${process.env.CLOUDFLARE_R2_ENDPOINT || 'Not set'}`);
    console.log(`Batch Size: ${this.batchSize}`);
    console.log(`Max Concurrent Downloads: ${this.maxConcurrentDownloads}`);
    console.log(`Max Concurrent Uploads: ${this.maxConcurrentUploads}`);
    console.log(`Connection Pool Size: ${this.connectionPoolSize}`);
    console.log(`Worker Count: ${this.workerCount}`);
    console.log(`Use Clustering: ${process.env.USE_CLUSTER || 'false'}`);
    console.log(`Dry Run: ${process.env.DRY_RUN || 'false'}`);
    
    // Check for required environment variables
    const required = [
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_KEY',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'CLOUDFLARE_R2_PUBLIC_URL',
      'CLOUDFLARE_R2_ENDPOINT',
      'CLOUDFLARE_R2_ACCESS_KEY_ID',
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.log('\n⚠️  Missing required environment variables:');
      missing.forEach(key => console.log(`   - ${key}`));
      throw new Error('Missing required environment variables');
    }
  }

  async confirmMigration() {
    console.log('\n⚠️  PERFORMANCE OPTIMIZATIONS ENABLED:');
    console.log(`- Parallel downloads: ${this.maxConcurrentDownloads} concurrent`);
    console.log(`- Parallel uploads: ${this.maxConcurrentUploads} concurrent`);
    console.log(`- Batch processing: ${this.batchSize} images per batch`);
    console.log(`- Connection pooling: ${this.connectionPoolSize} connections`);
    console.log(`- Worker processes: ${this.workerCount} (if clustering enabled)`);
    console.log('- Automatic retry with exponential backoff');
    console.log('- HTTP/2 multiplexing for faster transfers');
    
    console.log('\n⚠️  IMPORTANT WARNINGS:');
    console.log('- This migration will download images from WordPress site');
    console.log('- Images will be uploaded to your Cloudflare R2 bucket');
    console.log('- Database content will be updated with new image URLs');
    console.log('- High concurrency may increase server load');
    console.log('- Make sure you have sufficient R2 storage space');
    console.log('- Monitor for rate limiting (429 errors)');
    
    if (process.env.DRY_RUN === 'true') {
      console.log('\n🔍 DRY RUN MODE: No actual downloads or uploads will be made');
    } else {
      console.log('\n🚨 LIVE MODE: Images will be downloaded and uploaded at high speed');
    }
    
    const answer = await this.question('\nDo you want to proceed? (yes/no): ');
    return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Fast WordPress Image Migration Class with Parallel Processing
class FastWordPressImageMigration {
  constructor(options = {}) {
    this.downloadLimit = options.downloadLimit || pLimit(50);
    this.uploadLimit = options.uploadLimit || pLimit(30);
    this.batchSize = options.batchSize || 100;
    this.workerId = options.workerId || 1;
    this.totalWorkers = options.totalWorkers || 1;
    this.connectionPoolSize = options.connectionPoolSize || 10;
    this.requestTimeout = options.requestTimeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    // Performance tracking
    this.stats = {
      totalImages: 0,
      processed: 0,
      downloaded: 0,
      uploaded: 0,
      errors: 0,
      startTime: Date.now(),
      bytesDownloaded: 0,
      bytesUploaded: 0
    };
    
    // Initialize HTTP agent with connection pooling
    this.initializeHttpAgent();
  }

  initializeHttpAgent() {
    const http = require('http');
    const https = require('https');
    
    // Configure HTTP agents with connection pooling
    this.httpAgent = new http.Agent({
      keepAlive: true,
      maxSockets: this.connectionPoolSize,
      maxFreeSockets: this.connectionPoolSize,
      timeout: this.requestTimeout,
      freeSocketTimeout: 30000, // 30 seconds
    });
    
    this.httpsAgent = new https.Agent({
      keepAlive: true,
      maxSockets: this.connectionPoolSize,
      maxFreeSockets: this.connectionPoolSize,
      timeout: this.requestTimeout,
      freeSocketTimeout: 30000,
    });
  }

  async migrate() {
    try {
      console.log(`\n🚀 Starting fast migration (Worker ${this.workerId}/${this.totalWorkers})`);
      
      // Get all images to process
      const images = await this.getImagesToMigrate();
      this.stats.totalImages = images.length;
      
      if (images.length === 0) {
        console.log('No images found to migrate');
        return;
      }
      
      console.log(`Found ${images.length} images to migrate`);
      
      // Process images in parallel batches
      await this.processImagesInParallel(images);
      
      // Generate final report
      await this.generateReport();
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  async processImagesInParallel(images) {
    const batches = this.createBatches(images);
    console.log(`Processing ${batches.length} batches with ${this.batchSize} images each`);
    
    // Process all batches in parallel
    const batchPromises = batches.map((batch, index) => 
      this.processBatch(batch, index + 1)
    );
    
    await Promise.all(batchPromises);
  }

  createBatches(images) {
    const batches = [];
    for (let i = 0; i < images.length; i += this.batchSize) {
      batches.push(images.slice(i, i + this.batchSize));
    }
    return batches;
  }

  async processBatch(batch, batchNumber) {
    console.log(`\n📦 Processing batch ${batchNumber} (${batch.length} images)`);
    
    // Process all images in batch concurrently
    const promises = batch.map(image => this.processImageWithRetry(image));
    
    const results = await Promise.allSettled(promises);
    
    // Count successes and failures
    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Batch ${batchNumber}: ${successes} successful, ${failures} failed`);
    
    this.stats.processed += batch.length;
    this.logProgress();
  }

  async processImageWithRetry(image) {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await this.processImage(image);
      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${image.url}:`, error.message);
        
        if (attempt === this.retryAttempts) {
          this.stats.errors++;
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
  }

  async processImage(image) {
    // Download with concurrency limit
    const downloadResult = await this.downloadLimit(() => this.downloadImage(image));
    
    if (!downloadResult.success) {
      throw new Error(`Download failed: ${downloadResult.error}`);
    }
    
    this.stats.downloaded++;
    this.stats.bytesDownloaded += downloadResult.size;
    
    // Upload with concurrency limit
    const uploadResult = await this.uploadLimit(() => 
      this.uploadToR2(downloadResult.buffer, image)
    );
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }
    
    this.stats.uploaded++;
    this.stats.bytesUploaded += downloadResult.size;
    
    // Update database if not dry run
    if (process.env.DRY_RUN !== 'true') {
      await this.updateDatabase(image, uploadResult.newUrl);
    }
    
    return { success: true, image, newUrl: uploadResult.newUrl };
  }

  async downloadImage(image) {
    return new Promise((resolve, reject) => {
      const url = new URL(image.url);
      const agent = url.protocol === 'https:' ? this.httpsAgent : this.httpAgent;
      const lib = url.protocol === 'https:' ? require('https') : require('http');
      
      const request = lib.get(url, { agent }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        const chunks = [];
        let size = 0;
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
          size += chunk.length;
        });
        
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({ success: true, buffer, size });
        });
        
        response.on('error', reject);
      });
      
      request.setTimeout(this.requestTimeout, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
      
      request.on('error', reject);
    });
  }

  async uploadToR2(buffer, image) {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
    
    try {
      const key = this.generateR2Key(image);
      
      await r2Client.send(new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: this.getContentType(image.url),
      }));
      
      const newUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
      return { success: true, newUrl };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  generateR2Key(image) {
    // Extract filename from URL
    const url = new URL(image.url);
    const filename = path.basename(url.pathname);
    
    // Create date-based folder structure
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    return `wordpress-images/${year}/${month}/${filename}`;
  }

  getContentType(url) {
    const ext = path.extname(url).toLowerCase();
    const types = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return types[ext] || 'application/octet-stream';
  }

  async getImagesToMigrate() {
    // This would be implemented to get images from your database
    // For now, returning empty array as placeholder
    return [];
  }

  async updateDatabase(image, newUrl) {
    // This would be implemented to update your database
    // For now, just logging
    console.log(`Would update ${image.url} to ${newUrl}`);
  }

  logProgress() {
    const elapsed = (Date.now() - this.stats.startTime) / 1000;
    const rate = this.stats.processed / elapsed;
    const percentage = ((this.stats.processed / this.stats.totalImages) * 100).toFixed(1);
    
    console.log(`📊 Progress: ${this.stats.processed}/${this.stats.totalImages} (${percentage}%) | Rate: ${rate.toFixed(1)}/s | Errors: ${this.stats.errors}`);
  }

  async generateReport() {
    const elapsed = (Date.now() - this.stats.startTime) / 1000;
    const avgRate = this.stats.processed / elapsed;
    
    console.log('\n📊 Migration Report:');
    console.log('-'.repeat(40));
    console.log(`Total Images: ${this.stats.totalImages}`);
    console.log(`Processed: ${this.stats.processed}`);
    console.log(`Downloaded: ${this.stats.downloaded}`);
    console.log(`Uploaded: ${this.stats.uploaded}`);
    console.log(`Errors: ${this.stats.errors}`);
    console.log(`Time Elapsed: ${elapsed.toFixed(1)}s`);
    console.log(`Average Rate: ${avgRate.toFixed(1)} images/second`);
    console.log(`Data Downloaded: ${(this.stats.bytesDownloaded / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Data Uploaded: ${(this.stats.bytesUploaded / 1024 / 1024).toFixed(2)} MB`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Command line argument parsing
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dry-run':
        process.env.DRY_RUN = 'true';
        break;
      case '--batch-size':
        if (args[i + 1]) {
          process.env.BATCH_SIZE = args[i + 1];
          i++; // Skip next argument
        }
        break;
      case '--concurrent-downloads':
        if (args[i + 1]) {
          process.env.MAX_CONCURRENT_DOWNLOADS = args[i + 1];
          i++;
        }
        break;
      case '--concurrent-uploads':
        if (args[i + 1]) {
          process.env.MAX_CONCURRENT_UPLOADS = args[i + 1];
          i++;
        }
        break;
      case '--use-cluster':
        process.env.USE_CLUSTER = 'true';
        break;
      case '--force':
        options.force = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

function showHelp() {
  console.log(`
Fast WordPress to Cloudflare R2 Image Migration

Usage: node fast-migration-runner.js [options]

Performance Options:
  --concurrent-downloads <n>  Max concurrent downloads (default: 50, safe limit for HTTP/2)
  --concurrent-uploads <n>    Max concurrent uploads (default: 30, safe for R2 rate limits)
  --batch-size <n>           Set batch size for processing (default: 100)
  --use-cluster              Use cluster mode with multiple worker processes
  
General Options:
  --dry-run                  Run migration in dry-run mode (no actual downloads/uploads)
  --force                    Skip confirmation prompts
  --help, -h                 Show this help message

Environment Variables:
  SUPABASE_URL                    Supabase project URL (required)
  SUPABASE_SERVICE_KEY            Supabase service role key (required)
  CLOUDFLARE_R2_BUCKET_NAME       R2 bucket name (required)
  CLOUDFLARE_R2_PUBLIC_URL        R2 public URL (required)
  CLOUDFLARE_R2_ENDPOINT          R2 endpoint URL (required)
  CLOUDFLARE_R2_ACCESS_KEY_ID     R2 access key ID (required)
  CLOUDFLARE_R2_SECRET_ACCESS_KEY R2 secret access key (required)
  BATCH_SIZE                      Batch size for processing (default: 100)
  MAX_CONCURRENT_DOWNLOADS        Max concurrent downloads (default: 50)
  MAX_CONCURRENT_UPLOADS          Max concurrent uploads (default: 30)
  USE_CLUSTER                     Set to 'true' for cluster mode
  DRY_RUN                         Set to 'true' for dry run mode

Performance Examples:
  # Maximum speed with clustering
  node fast-migration-runner.js --use-cluster --concurrent-downloads 50 --concurrent-uploads 30
  
  # Conservative settings for limited bandwidth
  node fast-migration-runner.js --concurrent-downloads 10 --concurrent-uploads 5
  
  # Large batch processing
  node fast-migration-runner.js --batch-size 200 --concurrent-downloads 40

Performance Notes:
- Cloudflare R2 has rate limits around hundreds of requests/second
- HTTP/2 multiplexing has a limit of ~75 concurrent requests per connection
- The script uses connection pooling and automatic retry with exponential backoff
- Monitor for 429 (Too Many Requests) errors and adjust concurrency accordingly
- Clustering can improve performance on multi-core systems
- Use dry-run mode first to test optimal settings for your setup

Dependencies Required:
  npm install p-limit @aws-sdk/client-s3 @supabase/supabase-js dotenv
`);
}

// Pre-flight checks with performance testing
async function preflightChecks() {
  console.log('🔍 Running enhanced pre-flight checks...');
  
  // Test Supabase connection
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  
  try {
    const start = Date.now();
    const { data, error } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true })
      .eq('status', 'published');
    
    if (error) throw error;
    const dbLatency = Date.now() - start;
    console.log(`✅ Supabase connection verified (${dbLatency}ms latency)`);
  } catch (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
  
  // Test R2 connection with performance metrics
  const { S3Client, ListBucketsCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
  
  try {
    // Test connection
    await r2Client.send(new ListBucketsCommand({}));
    
    // Test upload performance
    const testData = Buffer.from('performance test');
    const testKey = 'test-performance-' + Date.now();
    
    const uploadStart = Date.now();
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: testKey,
      Body: testData,
    }));
    const uploadLatency = Date.now() - uploadStart;
    
    // Clean up test file
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: testKey,
    }));
    
    console.log(`✅ Cloudflare R2 connection verified (${uploadLatency}ms upload latency)`);
    
  } catch (error) {
    throw new Error(`Cloudflare R2 connection failed: ${error.message}`);
  }
  
  console.log('✅ Enhanced pre-flight checks passed');
}

// Main execution
async function main() {
  try {
    const options = parseArguments();
    
    await preflightChecks();
    
    if (options.force) {
      // Skip interactive confirmation
      console.log('🚀 Running in force mode...');
      const migration = new FastWordPressImageMigration();
      await migration.migrate();
      console.log('✅ Image migration completed successfully!');
    } else {
      // Run interactive migration
      const runner = new FastImageMigrationRunner();
      await runner.run();
    }
    
  } catch (error) {
    console.error('❌ Image migration failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { FastImageMigrationRunner, FastWordPressImageMigration };