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

  // Query attachments table to find the new URL using ilike to match filename
  const { data: attachments, error } = await supabase
    .from('attachments')
    .select('file_url, file_path')
    .ilike('file_path', `%${fileName}%`)
    .limit(1);

  if (error || !attachments || attachments.length === 0) {
    return null;
  }

  return attachments[0].file_url;
}

async function updateImageUrls() {
  console.log('Starting URL replacement...')

  try {
    // Get all posts with WordPress URLs
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, title')
      .like('content', '%wp-content/uploads%')

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

      // Find all image URLs in the content
      const imageRegex = /src="([^"]*wp-content\/uploads\/[^"]*)"/gi;
      let match;

      while ((match = imageRegex.exec(post.content)) !== null) {
        const originalUrl = match[1];
        console.log(`  Found image URL: ${originalUrl}`)

        // Try to find the corresponding attachment
        const newUrl = await findNewImageUrl(originalUrl);

        if (newUrl && newUrl !== originalUrl) {
          console.log(`  Replacing with: ${newUrl}`)
          updatedContent = updatedContent.replace(originalUrl, newUrl);
          hasChanges = true;
        } else {
          console.log(`  No replacement found for: ${originalUrl}`)
        }
      }

      // Also handle direct wp-content/uploads references
      const uploadsRegex = /wp-content\/uploads\/[^"'\s)]+/gi;
      const matches = updatedContent.match(uploadsRegex);
      if (matches) {
        for (const match of matches) {
          console.log(`  Found direct reference: ${match}`)
          const newUrl = await findNewImageUrl(match);

          if (newUrl) {
            console.log(`  Replacing with: ${newUrl}`)
            updatedContent = updatedContent.replace(new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
            hasChanges = true;
          }
        }
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
