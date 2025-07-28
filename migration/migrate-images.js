const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config();

class ImageMigrator {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    this.dataDir = path.join(__dirname, 'extracted-data');
    this.tempDir = path.join(__dirname, 'temp-images');
    this.batchSize = parseInt(process.env.BATCH_SIZE) || 10;
    this.dryRun = process.env.DRY_RUN === 'true';
    this.wordpressBaseUrl = process.env.WORDPRESS_BASE_URL || '';
  }

  async migrateImages() {
    console.log('Starting image migration...');
    
    try {
      // Ensure temp directory exists
      await fs.ensureDir(this.tempDir);
      
      // Load extracted data
      const attachments = await this.loadData('attachments.json');
      const postMeta = await this.loadData('postMeta.json');
      const posts = await this.loadData('posts.json');
      
      console.log(`Found ${attachments.length} attachments to migrate`);
      
      if (attachments.length === 0) {
        console.log('No attachments found. Make sure to run extract-data.js first.');
        return;
      }
      
      // Create mapping of WordPress post IDs to Supabase UUIDs
      const postIdMap = await this.getPostIdMapping();
      const userIdMap = await this.getUserIdMapping();
      
      // Process attachments in batches
      const attachmentIdMap = {};
      
      for (let i = 0; i < attachments.length; i += this.batchSize) {
        const batch = attachments.slice(i, i + this.batchSize);
        console.log(`Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(attachments.length / this.batchSize)}`);
        
        for (const attachment of batch) {
          try {
            const result = await this.processAttachment(attachment, postMeta, postIdMap, userIdMap);
            if (result) {
              attachmentIdMap[attachment.wp_id] = result.id;
            }
          } catch (error) {
            console.error(`Failed to process attachment ${attachment.wp_id}:`, error.message);
          }
        }
      }
      
      // Update post content with new image URLs
      await this.updatePostContent(posts, attachmentIdMap, postIdMap);
      
      // Clean up temp directory
      await fs.remove(this.tempDir);
      
      console.log('✅ Image migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Image migration failed:', error);
      throw error;
    }
  }

  async loadData(filename) {
    const filePath = path.join(this.dataDir, filename);
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return [];
  }

  async getPostIdMapping() {
    const { data: posts, error } = await this.supabase
      .from('posts')
      .select('id, wp_id');
    
    if (error) {
      throw new Error(`Failed to get post ID mapping: ${error.message}`);
    }
    
    const mapping = {};
    posts.forEach(post => {
      mapping[post.wp_id] = post.id;
    });
    
    return mapping;
  }

  async getUserIdMapping() {
    const { data: users, error } = await this.supabase
      .from('users')
      .select('id, wp_id');
    
    if (error) {
      throw new Error(`Failed to get user ID mapping: ${error.message}`);
    }
    
    const mapping = {};
    users.forEach(user => {
      mapping[user.wp_id] = user.id;
    });
    
    return mapping;
  }

  async processAttachment(attachment, postMeta, postIdMap, userIdMap) {
    console.log(`Processing attachment: ${attachment.title} (ID: ${attachment.wp_id})`);
    
    if (this.dryRun) {
      console.log(`[DRY RUN] Would process attachment: ${attachment.title}`);
      return { id: `fake-uuid-${attachment.wp_id}` };
    }
    
    // Find the file path from post meta
    const attachedFileMeta = postMeta.find(meta => 
      meta.post_wp_id === attachment.wp_id && meta.meta_key === '_wp_attached_file'
    );
    
    if (!attachedFileMeta) {
      console.warn(`No _wp_attached_file meta found for attachment ${attachment.wp_id}`);
      return null;
    }
    
    const originalFilePath = attachedFileMeta.meta_value;
    const fileName = path.basename(originalFilePath);
    const fileExtension = path.extname(fileName);
    
    // Generate clean file name
    const cleanFileName = this.generateCleanFileName(attachment.slug || attachment.title, fileExtension);
    
    // Download the image
    const localFilePath = await this.downloadImage(originalFilePath, fileName);
    if (!localFilePath) {
      return null;
    }
    
    // Upload to Supabase Storage
    const storageFilePath = await this.uploadToSupabase(localFilePath, cleanFileName);
    if (!storageFilePath) {
      return null;
    }
    
    // Get image dimensions and file size
    const fileStats = await fs.stat(localFilePath);
    const imageInfo = await this.getImageInfo(localFilePath);
    
    // Get alt text from post meta
    const altTextMeta = postMeta.find(meta => 
      meta.post_wp_id === attachment.wp_id && meta.meta_key === '_wp_attachment_image_alt'
    );
    
    // Insert into attachments table
    const attachmentData = {
      wp_id: attachment.wp_id,
      title: attachment.title,
      slug: attachment.slug,
      content: attachment.content,
      excerpt: attachment.excerpt,
      mime_type: attachment.mime_type,
      file_path: storageFilePath,
      file_url: `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${storageFilePath}`,
      file_size: fileStats.size,
      width: imageInfo.width,
      height: imageInfo.height,
      alt_text: altTextMeta ? altTextMeta.meta_value : '',
      status: attachment.status,
      author_id: userIdMap[attachment.author_wp_id] || null,
      parent_post_id: attachment.parent_wp_id ? postIdMap[attachment.parent_wp_id] : null,
      created_at: attachment.created_at,
      updated_at: attachment.updated_at
    };
    
    const { data, error } = await this.supabase
      .from('attachments')
      .insert(attachmentData)
      .select('id')
      .single();
    
    if (error) {
      console.error(`Failed to insert attachment ${attachment.wp_id}:`, error);
      return null;
    }
    
    console.log(`✅ Successfully migrated: ${attachment.title}`);
    return data;
  }

  generateCleanFileName(name, extension) {
    // Create a clean, URL-safe filename
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = Date.now();
    return `${cleanName}-${timestamp}${extension}`;
  }

  async downloadImage(originalPath, fileName) {
    // Try different possible URLs for the image
    const possibleUrls = [
      `${this.wordpressBaseUrl}/wp-content/uploads/${originalPath}`,
      `${this.wordpressBaseUrl}/uploads/${originalPath}`,
      originalPath.startsWith('http') ? originalPath : null
    ].filter(Boolean);
    
    for (const imageUrl of possibleUrls) {
      try {
        console.log(`Attempting to download: ${imageUrl}`);
        const localPath = path.join(this.tempDir, fileName);
        
        const success = await this.downloadFile(imageUrl, localPath);
        if (success) {
          return localPath;
        }
      } catch (error) {
        console.warn(`Failed to download from ${imageUrl}:`, error.message);
      }
    }
    
    console.error(`Could not download image from any URL for: ${originalPath}`);
    return null;
  }

  async downloadFile(url, localPath) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const file = fs.createWriteStream(localPath);
      
      const request = client.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        } else {
          file.close();
          fs.unlink(localPath).catch(() => {});
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
      
      request.on('error', (error) => {
        file.close();
        fs.unlink(localPath).catch(() => {});
        reject(error);
      });
      
      request.setTimeout(30000, () => {
        request.destroy();
        file.close();
        fs.unlink(localPath).catch(() => {});
        reject(new Error('Download timeout'));
      });
    });
  }

  async uploadToSupabase(localFilePath, fileName) {
    try {
      const fileBuffer = await fs.readFile(localFilePath);
      
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(fileName, fileBuffer, {
          contentType: this.getMimeType(fileName),
          upsert: false
        });
      
      if (error) {
        console.error(`Failed to upload ${fileName}:`, error);
        return null;
      }
      
      return data.path;
    } catch (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }
  }

  getMimeType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async getImageInfo(filePath) {
    // Basic implementation - you might want to use a library like 'sharp' for better image info
    try {
      const stats = await fs.stat(filePath);
      return {
        width: null,
        height: null,
        size: stats.size
      };
    } catch (error) {
      return { width: null, height: null, size: 0 };
    }
  }

  async updatePostContent(posts, attachmentIdMap, postIdMap) {
    console.log('Updating post content with new image URLs...');

    if (this.dryRun) {
      console.log('[DRY RUN] Would update post content with new image URLs');
      return;
    }

    for (const post of posts) {
      try {
        let updatedContent = post.content;
        let hasChanges = false;

        // Find all image references in the content
        const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let match;

        while ((match = imageRegex.exec(post.content)) !== null) {
          const originalUrl = match[1];

          // Try to find the corresponding attachment
          const newUrl = await this.findNewImageUrl(originalUrl, attachmentIdMap);

          if (newUrl && newUrl !== originalUrl) {
            updatedContent = updatedContent.replace(originalUrl, newUrl);
            hasChanges = true;
          }
        }

        // Also handle WordPress gallery shortcodes and other image references
        updatedContent = await this.updateWordPressImageReferences(updatedContent, attachmentIdMap);

        if (hasChanges || updatedContent !== post.content) {
          // Update the post in the database
          const { error } = await this.supabase
            .from('posts')
            .update({ content: updatedContent })
            .eq('wp_id', post.wp_id);

          if (error) {
            console.error(`Failed to update post ${post.wp_id}:`, error);
          } else {
            console.log(`✅ Updated post content: ${post.title}`);
          }
        }

      } catch (error) {
        console.error(`Error updating post ${post.wp_id}:`, error);
      }
    }
  }

  async findNewImageUrl(originalUrl, attachmentIdMap) {
    // Extract filename from the original URL
    const fileName = path.basename(originalUrl);

    // Query attachments table to find the new URL
    const { data: attachments, error } = await this.supabase
      .from('attachments')
      .select('file_url, file_path')
      .ilike('file_path', `%${fileName}%`)
      .limit(1);

    if (error || !attachments || attachments.length === 0) {
      return null;
    }

    return attachments[0].file_url;
  }

  async updateWordPressImageReferences(content, attachmentIdMap) {
    // Handle WordPress-specific image references like [gallery] shortcodes
    // This is a basic implementation - you might need to expand based on your content

    // Replace wp-content/uploads URLs
    const uploadsRegex = /wp-content\/uploads\/[^"'\s)]+/gi;
    let updatedContent = content;

    const matches = content.match(uploadsRegex);
    if (matches) {
      for (const match of matches) {
        const fileName = path.basename(match);
        const newUrl = await this.findNewImageUrl(match, attachmentIdMap);

        if (newUrl) {
          updatedContent = updatedContent.replace(new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        }
      }
    }

    return updatedContent;
  }
}

// Run the migration
async function main() {
  const migrator = new ImageMigrator();

  try {
    await migrator.migrateImages();
    console.log('✅ Image migration completed successfully!');
  } catch (error) {
    console.error('❌ Image migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageMigrator;
