require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

async function debugImageMapping() {
  console.log('=== DEBUG: Image Mapping Analysis ===\n')

  // Get a sample WordPress URL from posts
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, content')
    .like('content', '%wp-content/uploads%')
    .limit(1)

  if (posts && posts.length > 0) {
    const post = posts[0]
    console.log(`Sample post: ${post.title}`)
    
    // Extract first image URL
    const imageRegex = /src="([^"]*(?:zayotech\.com|wp-content)\/[^"]*)"/i
    const match = post.content.match(imageRegex)
    
    if (match) {
      const originalUrl = match[1]
      console.log(`Original URL: ${originalUrl}`)
      
      // Extract filename
      let fileName = path.basename(originalUrl)
      console.log(`Extracted filename: ${fileName}`)
      
      // Remove size suffixes
      const cleanFileName = fileName.replace(/-\d+x\d+/, '')
      console.log(`Clean filename: ${cleanFileName}`)
      
      // Remove extension for base name
      const nameWithoutExt = cleanFileName.replace(/\.[^.]+$/, '').toLowerCase()
      console.log(`Base name: ${nameWithoutExt}`)
    }
  }

  console.log('\n=== Available Supabase Images ===')
  
  // Get all Supabase attachments
  const { data: attachments } = await supabase
    .from('attachments')
    .select('file_url, file_path')
    .not('file_url', 'is', null)
    .limit(10)

  if (attachments) {
    attachments.forEach((attachment, index) => {
      console.log(`${index + 1}. ${attachment.file_path}`)
      console.log(`   URL: ${attachment.file_url}`)
      console.log(`   Base: ${attachment.file_path.replace(/\.[^.]+$/, '').toLowerCase()}`)
      console.log('')
    })
  }

  console.log('\n=== WordPress Attachments ===')
  
  // Get WordPress attachments
  const { data: wpAttachments } = await supabase
    .from('attachments')
    .select('file_path')
    .is('file_url', null)
    .limit(10)

  if (wpAttachments) {
    wpAttachments.forEach((attachment, index) => {
      const fileName = path.basename(attachment.file_path)
      const cleanFileName = fileName.replace(/-\d+x\d+/, '')
      const baseName = cleanFileName.replace(/\.[^.]+$/, '').toLowerCase()
      
      console.log(`${index + 1}. ${attachment.file_path}`)
      console.log(`   Filename: ${fileName}`)
      console.log(`   Clean: ${cleanFileName}`)
      console.log(`   Base: ${baseName}`)
      console.log('')
    })
  }
}

debugImageMapping()
