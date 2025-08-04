#!/usr/bin/env node

/**
 * Quick Storage Bucket Setup
 * Creates the Supabase storage bucket for images
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function setupStorageBucket() {
  console.log('🗄️  Setting up Supabase storage bucket...\n')

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL not found in environment variables')
    process.exit(1)
  }
  
  if (!supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_key_here') {
    console.error('❌ SUPABASE_SERVICE_KEY not found or not configured')
    console.log('\n📋 To get your service key:')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to Settings → API')
    console.log('4. Copy the "service_role" key (NOT the anon key)')
    console.log('5. Add it to your .env.local file as SUPABASE_SERVICE_KEY=your_key_here')
    console.log('\n⚠️  Keep the service key private - it has admin access!')
    process.exit(1)
  }

  // Create Supabase client with service key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Check if bucket already exists
    console.log('🔍 Checking existing buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      process.exit(1)
    }

    const existingBucket = buckets.find(bucket => bucket.name === 'images')
    
    if (existingBucket) {
      console.log('✅ Images bucket already exists!')
      console.log('📊 Bucket details:', existingBucket)
      
      // Test bucket access
      const { data: files, error: listFilesError } = await supabase.storage
        .from('images')
        .list('', { limit: 1 })
      
      if (listFilesError) {
        console.log('⚠️  Warning: Could not list files in bucket:', listFilesError.message)
      } else {
        console.log(`📁 Bucket is accessible (contains ${files.length} files)`)
      }
      
      return
    }

    // Create the bucket
    console.log('🆕 Creating images bucket...')
    const { data: bucket, error: createError } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff'
      ],
      fileSizeLimit: 52428800 // 50MB
    })

    if (createError) {
      console.error('❌ Error creating bucket:', createError.message)
      process.exit(1)
    }

    console.log('✅ Images bucket created successfully!')
    console.log('📊 Bucket details:', bucket)

    console.log('\n🎉 Storage setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Go to the admin panel and try uploading an image')
    console.log('3. Check your Supabase dashboard → Storage to see uploaded files')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupStorageBucket().catch(console.error)
}

module.exports = setupStorageBucket
