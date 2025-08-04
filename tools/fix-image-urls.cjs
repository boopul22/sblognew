require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function findNewImageUrl(originalUrl) {
  // Extract filename from the original URL
  const fileName = path.basename(originalUrl);
  console.log(`  Looking for: ${fileName}`)

  // Query attachments table to find the new URL using ilike to match filename
  const { data: attachments, error } = await supabase
    .from('attachments')
    .select('file_url, file_path, title')
    .not('file_url', 'is', null)
    .ilike('file_path', `%${fileName.split('.')[0]}%`)
    .limit(5);

  if (error) {
    console.error(`  Error querying attachments: ${error.message}`)
    return null;
  }

  if (!attachments || attachments.length === 0) {
    console.log(`  No attachment found for: ${fileName}`)
    return null;
  }

  // If multiple matches, try to find the best one
  let bestMatch = attachments[0];
  if (attachments.length > 1) {
    // Try to find exact filename match first
    const exactMatch = attachments.find(att => 
      att.file_path.toLowerCase().includes(fileName.toLowerCase().split('.')[0])
    );
    if (exactMatch) {
      bestMatch = exactMatch;
    }
  }

  console.log(`  Found match: ${bestMatch.file_url}`)
  return bestMatch.file_url;
}

async function updateImageUrls() {
  console.log('🔧 Starting comprehensive image URL replacement...')

  try {
    // Get all posts that might contain WordPress URLs
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, title, slug')
      .or('content.like.%zayotech.com%,content.like.%wp-content%')

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return
    }

    console.log(`📝 Found ${posts.length} posts to check`)

    let updatedCount = 0
    for (const post of posts) {
      console.log(`\n🔍 Processing: ${post.title} (${post.slug})`)
      let updatedContent = post.content
      let hasChanges = false

      // Pattern 1: Full WordPress URLs with domain
      const fullUrlRegex = /https?:\/\/[^\/]*\/wp-content\/uploads\/[^"'\s)]+/gi;
      let match;
      const fullUrlMatches = [...post.content.matchAll(fullUrlRegex)];
      
      for (const match of fullUrlMatches) {
        const originalUrl = match[0];
        console.log(`  📸 Found full URL: ${originalUrl}`)

        const newUrl = await findNewImageUrl(originalUrl);
        if (newUrl && newUrl !== originalUrl) {
          console.log(`  ✅ Replacing with: ${newUrl}`)
          updatedContent = updatedContent.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
          hasChanges = true;
        }
      }

      // Pattern 2: src="..." attributes
      const srcRegex = /src="([^"]*(?:wp-content|zayotech)[^"]*)"/gi;
      const srcMatches = [...post.content.matchAll(srcRegex)];
      
      for (const match of srcMatches) {
        const originalUrl = match[1];
        console.log(`  📸 Found src URL: ${originalUrl}`)

        const newUrl = await findNewImageUrl(originalUrl);
        if (newUrl && newUrl !== originalUrl) {
          console.log(`  ✅ Replacing with: ${newUrl}`)
          updatedContent = updatedContent.replace(match[0], `src="${newUrl}"`);
          hasChanges = true;
        }
      }

      // Update the post if changes were made
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ content: updatedContent })
          .eq('id', post.id);

        if (updateError) {
          console.error(`  ❌ Error updating post ${post.title}:`, updateError)
        } else {
          console.log(`  ✅ Successfully updated: ${post.title}`)
          updatedCount++
        }
      } else {
        console.log(`  ℹ️  No changes needed for: ${post.title}`)
      }
    }

    console.log(`\n🎉 Image URL replacement complete!`)
    console.log(`📊 Updated ${updatedCount} out of ${posts.length} posts`)

  } catch (error) {
    console.error('❌ Error during URL replacement:', error)
  }
}

// Run the script
updateImageUrls()
  .then(() => {
    console.log('✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
