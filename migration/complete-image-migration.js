const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config();

class CompleteImageMigration {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    this.tempDir = path.join(__dirname, 'temp-images');
    this.wordpressBaseUrl = process.env.WORDPRESS_BASE_URL || 'https://zayotech.com';
  }

  async run() {
    console.log('🚀 Starting complete image migration...');
    
    try {
      // Step 1: Upload missing images to Supabase storage
      await this.uploadMissingImages();
      
      // Step 2: Update post content with Supabase URLs
      await this.updatePostContent();
      
      // Step 3: Verify migration
      await this.verifyMigration();
      
      console.log('✅ Complete image migration finished successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
    }
  }

  async uploadMissingImages() {
    console.log('\n📤 Step 1: Uploading missing images to Supabase storage...');
    
    // Get attachments that don't have file_url (missing from storage)
    const { data: missingAttachments, error } = await this.supabase
      .from('attachments')
      .select('*')
      .is('file_url', null);

    if (error) {
      throw new Error(`Failed to fetch missing attachments: ${error.message}`);
    }

    console.log(`Found ${missingAttachments.length} attachments missing from storage`);

    for (const attachment of missingAttachments) {
      try {
        await this.uploadSingleImage(attachment);
      } catch (error) {
        console.error(`Failed to upload ${attachment.title}:`, error.message);
      }
    }
  }

  async uploadSingleImage(attachment) {
    console.log(`\n📸 Processing: ${attachment.title} (wp_id: ${attachment.wp_id})`);
    
    // Check if file exists in temp directory
    const originalFileName = path.basename(attachment.file_path);
    const tempFilePath = path.join(this.tempDir, originalFileName);
    
    let fileBuffer;
    
    if (await fs.pathExists(tempFilePath)) {
      console.log(`  Found in temp directory: ${originalFileName}`);
      fileBuffer = await fs.readFile(tempFilePath);
    } else {
      console.log(`  Downloading from WordPress...`);
      const downloadUrl = `${this.wordpressBaseUrl}/${attachment.file_path}`;
      fileBuffer = await this.downloadImage(downloadUrl);
    }

    if (!fileBuffer) {
      throw new Error('Failed to get image file');
    }

    // Generate clean filename for Supabase storage
    const fileExtension = path.extname(originalFileName);
    const cleanFileName = this.generateCleanFileName(attachment.slug || attachment.title, fileExtension);
    
    console.log(`  Uploading to Supabase as: ${cleanFileName}`);
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('images')
      .upload(cleanFileName, fileBuffer, {
        contentType: attachment.mime_type,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('images')
      .getPublicUrl(cleanFileName);

    const publicUrl = urlData.publicUrl;
    
    // Update attachment record with Supabase URL
    const { error: updateError } = await this.supabase
      .from('attachments')
      .update({
        file_path: cleanFileName,
        file_url: publicUrl
      })
      .eq('id', attachment.id);

    if (updateError) {
      throw new Error(`Failed to update attachment record: ${updateError.message}`);
    }

    console.log(`  ✅ Successfully uploaded and updated: ${publicUrl}`);
  }

  async downloadImage(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    });
  }

  generateCleanFileName(title, extension) {
    const timestamp = Date.now();
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `${cleanTitle}-${timestamp}${extension}`;
  }

  async updatePostContent() {
    console.log('\n🔄 Step 2: Updating post content with Supabase URLs...');

    // Get all attachments with their WordPress IDs and Supabase URLs
    const { data: attachments, error: attachError } = await this.supabase
      .from('attachments')
      .select('wp_id, file_url, file_path, title')
      .not('file_url', 'is', null);

    if (attachError) {
      throw new Error(`Failed to fetch attachments: ${attachError.message}`);
    }

    // Create comprehensive mapping of WordPress paths to Supabase URLs
    const urlMapping = {};

    // First, get the original WordPress file paths from extracted data
    const extractedDataPath = path.join(__dirname, 'extracted-data', 'attachments.json');
    let originalAttachments = [];

    if (await fs.pathExists(extractedDataPath)) {
      originalAttachments = JSON.parse(await fs.readFile(extractedDataPath, 'utf8'));
    }

    attachments.forEach(att => {
      // Find original WordPress attachment data
      const originalAtt = originalAttachments.find(orig => orig.wp_id === att.wp_id);

      if (originalAtt && originalAtt.file_path) {
        // Map the original WordPress path
        urlMapping[originalAtt.file_path] = att.file_url;

        // Map full WordPress URL
        const fullUrl = `${this.wordpressBaseUrl}/${originalAtt.file_path}`;
        urlMapping[fullUrl] = att.file_url;

        // Map just the filename
        const fileName = path.basename(originalAtt.file_path);
        urlMapping[fileName] = att.file_url;

        // Map variations of the filename (with and without size suffixes)
        const baseFileName = fileName.replace(/-\d+x\d+/, ''); // Remove size suffix like -865x1024
        urlMapping[baseFileName] = att.file_url;
      }

      // Also map current file_path if different
      if (att.file_path && !att.file_path.includes('supabase')) {
        urlMapping[att.file_path] = att.file_url;
        const fileName = path.basename(att.file_path);
        urlMapping[fileName] = att.file_url;
      }
    });

    console.log(`Created URL mapping for ${Object.keys(urlMapping).length} image variations`);

    // Get posts that contain WordPress image URLs
    const { data: posts, error: postsError } = await this.supabase
      .from('posts')
      .select('id, title, content')
      .or('content.like.%wp-content%,content.like.%zayotech.com%');

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    console.log(`Found ${posts.length} posts with WordPress URLs to update`);

    let totalUpdated = 0;
    let totalImagesReplaced = 0;

    for (const post of posts) {
      const result = await this.updateSinglePost(post, urlMapping);
      if (result.updated) {
        totalUpdated++;
        totalImagesReplaced += result.replacements;
      }
    }

    console.log(`\n✅ Updated ${totalUpdated} posts with ${totalImagesReplaced} image URL replacements`);
  }

  async updateSinglePost(post, urlMapping) {
    console.log(`\n📝 Processing post: ${post.title}`);

    let content = post.content;
    let hasChanges = false;
    let replacements = 0;

    // More comprehensive patterns to find WordPress image URLs
    const patterns = [
      // Full WordPress URLs with domain
      /https?:\/\/[^\/]*zayotech\.com\/wp-content\/uploads\/[^\s"'>]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/gi,
      // Relative WordPress paths
      /wp-content\/uploads\/[^\s"'>]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/gi,
      // Any zayotech.com image URLs
      /https?:\/\/[^\/]*zayotech\.com\/[^\s"'>]*\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)/gi,
      // WordPress image class references
      /class="[^"]*wp-image-(\d+)[^"]*"/gi
    ];

    // Track found URLs for debugging
    const foundUrls = new Set();

    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const originalUrl = match[0];
        foundUrls.add(originalUrl);

        let newUrl = null;

        // Special handling for wp-image class references
        if (originalUrl.includes('wp-image-')) {
          const wpIdMatch = originalUrl.match(/wp-image-(\d+)/);
          if (wpIdMatch) {
            const wpId = parseInt(wpIdMatch[1]);
            // Find attachment by WordPress ID
            const { data: attachment } = await this.supabase
              .from('attachments')
              .select('file_url')
              .eq('wp_id', wpId)
              .single();

            if (attachment && attachment.file_url) {
              // Don't replace the class, just note that we found a reference
              console.log(`  📎 Found wp-image-${wpId} reference (attachment exists in Supabase)`);
              continue;
            }
          }
        } else {
          newUrl = this.findReplacementUrl(originalUrl, urlMapping);
        }

        if (newUrl && newUrl !== originalUrl) {
          console.log(`  🔄 Replacing: ${originalUrl} -> ${newUrl}`);
          content = content.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
          hasChanges = true;
          replacements++;
        }
      }
    }

    // Log found URLs for debugging
    if (foundUrls.size > 0) {
      console.log(`  📸 Found ${foundUrls.size} image references in post`);
      foundUrls.forEach(url => {
        if (!this.findReplacementUrl(url, urlMapping) && !url.includes('wp-image-')) {
          console.log(`  ⚠️  No replacement found for: ${url}`);
        }
      });
    }

    if (hasChanges) {
      const { error: updateError } = await this.supabase
        .from('posts')
        .update({ content })
        .eq('id', post.id);

      if (updateError) {
        console.error(`  ❌ Failed to update post: ${updateError.message}`);
        return { updated: false, replacements: 0 };
      }

      console.log(`  ✅ Updated post with ${replacements} image replacements`);
      return { updated: true, replacements };
    }

    console.log(`  ℹ️  No changes needed`);
    return { updated: false, replacements: 0 };
  }

  findReplacementUrl(originalUrl, urlMapping) {
    // Try exact match first
    if (urlMapping[originalUrl]) {
      return urlMapping[originalUrl];
    }

    // Try matching by filename
    const fileName = path.basename(originalUrl);
    if (urlMapping[fileName]) {
      return urlMapping[fileName];
    }

    // Try matching by WordPress path
    const wpPath = originalUrl.includes('wp-content')
      ? originalUrl.substring(originalUrl.indexOf('wp-content'))
      : null;

    if (wpPath && urlMapping[wpPath]) {
      return urlMapping[wpPath];
    }

    // Try matching without size suffix (e.g., -865x1024)
    const fileNameWithoutSize = fileName.replace(/-\d+x\d+/, '');
    if (urlMapping[fileNameWithoutSize]) {
      return urlMapping[fileNameWithoutSize];
    }

    // Try fuzzy matching by looking for similar filenames
    const baseFileName = fileName.replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i, '');
    for (const [key, value] of Object.entries(urlMapping)) {
      const keyBaseName = path.basename(key).replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i, '');
      if (keyBaseName.toLowerCase().includes(baseFileName.toLowerCase()) ||
          baseFileName.toLowerCase().includes(keyBaseName.toLowerCase())) {
        return value;
      }
    }

    return null;
  }

  async verifyMigration() {
    console.log('\n🔍 Step 3: Verifying migration...');
    
    // Check storage bucket
    const { data: files, error: listError } = await this.supabase.storage
      .from('images')
      .list();

    if (listError) {
      console.error('Failed to list storage files:', listError);
    } else {
      console.log(`📁 Storage bucket contains ${files.length} files`);
    }

    // Check attachments
    const { data: attachments, error: attError } = await this.supabase
      .from('attachments')
      .select('id, file_url')
      .is('file_url', null);

    if (attError) {
      console.error('Failed to check attachments:', attError);
    } else {
      console.log(`📎 Attachments missing file_url: ${attachments.length}`);
    }

    // Check posts for remaining WordPress URLs
    const { data: postsWithWpUrls, error: postsError } = await this.supabase
      .from('posts')
      .select('id, title')
      .or('content.like.%wp-content%,content.like.%zayotech.com%');

    if (postsError) {
      console.error('Failed to check posts:', postsError);
    } else {
      console.log(`📄 Posts still containing WordPress URLs: ${postsWithWpUrls.length}`);
      if (postsWithWpUrls.length > 0) {
        postsWithWpUrls.forEach(post => {
          console.log(`  - ${post.title}`);
        });
      }
    }
  }
}

// Run the migration
if (require.main === module) {
  const migration = new CompleteImageMigration();
  migration.run().catch(console.error);
}

module.exports = CompleteImageMigration;
