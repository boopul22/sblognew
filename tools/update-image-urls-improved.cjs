require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Function to normalize filename for comparison
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Function to extract base name without size suffix
function getBaseName(filename) {
  // Remove size suffixes like -1024x1024, -936x1024, etc.
  return filename.replace(/-\d+x\d+/, '').replace(/\.[^.]+$/, '')
}

async function findNewImageUrl(originalUrl) {
  // Extract filename from the original URL
  const fileName = originalUrl.split('/').pop()
  const baseName = getBaseName(fileName)
  const normalizedBase = normalizeFilename(baseName)
  
  console.log(`  Looking for: ${fileName}`)
  console.log(`  Base name: ${baseName}`)
  console.log(`  Normalized: ${normalizedBase}`)

  // Query attachments table to find the new URL using multiple strategies
  const { data: attachments, error } = await supabase
    .from('attachments')
    .select('file_url, file_path, title')
    .not('file_url', 'is', null)

  if (error) {
    console.error(`  Error querying attachments: ${error.message}`)
    return null
  }

  if (!attachments || attachments.length === 0) {
    console.log(`  No attachments found in database`)
    return null
  }

  // Try to find a match using different strategies
  for (const attachment of attachments) {
    const attachmentBase = getBaseName(attachment.file_path)
    const normalizedAttachment = normalizeFilename(attachmentBase)
    
    // Strategy 1: Exact normalized base name match
    if (normalizedAttachment === normalizedBase) {
      console.log(`  ✅ Found match: ${attachment.file_path} -> ${attachment.file_url}`)
      return attachment.file_url
    }
    
    // Strategy 2: Check if normalized base is contained in attachment path
    if (normalizedAttachment.includes(normalizedBase) || normalizedBase.includes(normalizedAttachment)) {
      console.log(`  ✅ Found partial match: ${attachment.file_path} -> ${attachment.file_url}`)
      return attachment.file_url
    }
  }

  console.log(`  ❌ No match found for: ${fileName}`)
  return null
}

async function updateImageUrls() {
  console.log('🚀 Starting image URL update process...')
  
  try {
    // Get all posts with content
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, content')
      .not('content', 'is', null)

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return
    }

    console.log(`📝 Found ${posts.length} posts to process`)

    let totalUpdated = 0
    let totalImagesFound = 0
    let totalImagesReplaced = 0

    for (const post of posts) {
      console.log(`\n📄 Processing post: ${post.title} (ID: ${post.id})`)
      
      let content = post.content
      let hasChanges = false
      
      // Find all WordPress image URLs in the content
      const imageRegex = /https:\/\/zayotech\.com\/wp-content\/uploads\/[^"'\s)]+\.(jpg|jpeg|png|gif|webp)/gi
      const matches = content.match(imageRegex)
      
      if (!matches) {
        console.log('  No WordPress images found')
        continue
      }
      
      console.log(`  Found ${matches.length} WordPress image URLs`)
      totalImagesFound += matches.length
      
      // Process each image URL
      for (const originalUrl of matches) {
        const newUrl = await findNewImageUrl(originalUrl)
        
        if (newUrl) {
          content = content.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl)
          hasChanges = true
          totalImagesReplaced++
          console.log(`  ✅ Replaced: ${originalUrl} -> ${newUrl}`)
        }
      }
      
      // Update the post if there were changes
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ content })
          .eq('id', post.id)
        
        if (updateError) {
          console.error(`  ❌ Error updating post ${post.id}:`, updateError)
        } else {
          console.log(`  ✅ Updated post content`)
          totalUpdated++
        }
      }
    }

    console.log('\n🎉 Image URL update completed!')
    console.log(`📊 Summary:`)
    console.log(`   - Posts processed: ${posts.length}`)
    console.log(`   - Posts updated: ${totalUpdated}`)
    console.log(`   - Images found: ${totalImagesFound}`)
    console.log(`   - Images replaced: ${totalImagesReplaced}`)

  } catch (error) {
    console.error('❌ Error in updateImageUrls:', error)
  }
}

// Run the update
updateImageUrls()
