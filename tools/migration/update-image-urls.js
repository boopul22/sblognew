require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

async function findNewImageUrlByWpId(wpImageId) {
  // Find attachment by WordPress ID
  const { data: attachment } = await supabase
    .from('attachments')
    .select('file_url')
    .eq('wp_id', wpImageId)
    .not('file_url', 'is', null)
    .limit(1);

  return attachment && attachment.length > 0 ? attachment[0].file_url : null;
}

async function findNewImageUrl(originalUrl) {
  // Extract filename from the original URL and clean it
  let fileName = path.basename(originalUrl);

  // Remove size suffixes like -939x1024, -1024x1024, etc.
  fileName = fileName.replace(/-\d+x\d+/, '');

  // Remove file extension for better matching
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, '').toLowerCase();

  // Try exact filename match first
  let { data: attachments } = await supabase
    .from('attachments')
    .select('file_url, file_path')
    .not('file_url', 'is', null)
    .ilike('file_path', `%${fileName}%`)
    .limit(1);

  if (attachments && attachments.length > 0) {
    return attachments[0].file_url;
  }

  // Try fuzzy matching with the base name
  const { data: allAttachments, error: allError } = await supabase
    .from('attachments')
    .select('file_url, file_path')
    .not('file_url', 'is', null);

  if (allError || !allAttachments) {
    return null;
  }

  // Find best match using fuzzy string matching
  for (const attachment of allAttachments) {
    const attachmentName = attachment.file_path.toLowerCase();

    // Check if the base name is contained in the attachment name
    if (attachmentName.includes(nameWithoutExt) || nameWithoutExt.includes(attachmentName.replace(/\.[^.]+$/, ''))) {
      return attachment.file_url;
    }
  }

  return null;
}

async function updateImageUrls() {
  console.log('Starting URL replacement...')

  try {
    // Get posts that reference the available WordPress image IDs (421-431)
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, title')
      .or('content.like.%wp-image-42%,content.like.%wp-image-43%')

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return
    }

    console.log(`Found ${posts.length} posts with WordPress URLs`)

    // Update each post
    let updatedCount = 0
    for (const post of posts) {
      console.log(`Processing post: ${post.title}`)
      let updatedContent = post.content
      let hasChanges = false

      // First, try to find images with WordPress IDs (most reliable method)
      const wpImageRegex = /<img[^>]+class="[^"]*wp-image-(\d+)[^"]*"[^>]*>/gi;
      let wpMatch;

      while ((wpMatch = wpImageRegex.exec(post.content)) !== null) {
        const wpImageId = parseInt(wpMatch[1]);
        const fullImgTag = wpMatch[0];

        // Extract the src URL from the img tag
        const srcMatch = fullImgTag.match(/src="([^"]*)"/);
        if (!srcMatch) continue;

        const originalUrl = srcMatch[1];
        console.log(`  Found WordPress image ID ${wpImageId}: ${originalUrl}`)

        // Find the new URL using WordPress ID
        const newUrl = await findNewImageUrlByWpId(wpImageId);

        if (newUrl && newUrl !== originalUrl) {
          console.log(`  Replacing with: ${newUrl}`)
          // Replace the src URL in the img tag
          const newImgTag = fullImgTag.replace(originalUrl, newUrl);
          updatedContent = updatedContent.replace(fullImgTag, newImgTag);
          hasChanges = true;
        } else {
          console.log(`  No replacement found for WordPress ID ${wpImageId}`)
        }
      }

      // Reset regex for next iteration
      wpImageRegex.lastIndex = 0;

      // Fallback: Find other image URLs without WordPress IDs
      const patterns = [
        // Pattern 1: src="..." with full URLs (not already processed)
        /src="([^"]*(?:zayotech\.com|wp-content)\/[^"]*)"/gi,
        // Pattern 2: Direct wp-content/uploads references
        /https?:\/\/[^\/]*\/wp-content\/uploads\/[^"'\s)]+/gi,
        // Pattern 3: Relative wp-content paths
        /wp-content\/uploads\/[^"'\s)]+/gi
      ];

      for (const regex of patterns) {
        let match;
        while ((match = regex.exec(updatedContent)) !== null) {
          const originalUrl = match[1] || match[0];

          // Skip if this URL was already processed by WordPress ID method
          if (post.content.includes(`wp-image-`) && post.content.includes(originalUrl)) {
            continue;
          }

          console.log(`  Found image URL (fallback): ${originalUrl}`)

          // Try to find the corresponding attachment
          const newUrl = await findNewImageUrl(originalUrl);

          if (newUrl && newUrl !== originalUrl) {
            console.log(`  Replacing with: ${newUrl}`)
            // Replace all occurrences of this URL
            const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            updatedContent = updatedContent.replace(new RegExp(escapedUrl, 'g'), newUrl);
            hasChanges = true;
          } else {
            console.log(`  No replacement found for: ${originalUrl}`)
          }
        }
        // Reset regex lastIndex for next iteration
        regex.lastIndex = 0;
      }

      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ content: updatedContent })
          .eq('id', post.id)

        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError)
        } else {
          updatedCount++
          console.log(`✓ Updated post: ${post.title}`)
        }
      } else {
        console.log(`  No changes needed for: ${post.title}`)
      }
    }

    console.log(`\nSuccessfully updated ${updatedCount} posts`)

  } catch (error) {
    console.error('Error in updateImageUrls:', error)
  }
}

updateImageUrls()
