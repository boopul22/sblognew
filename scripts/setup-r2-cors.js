#!/usr/bin/env node

/**
 * Setup R2 Bucket CORS Configuration
 * Configures CORS settings for Cloudflare R2 bucket to allow file uploads
 */

import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'boopul',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
}

// Create S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
})

// CORS configuration for R2 bucket
const corsConfiguration = {
  CORSRules: [
    {
      ID: 'AllowWebAppUploads',
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:4173',
        'https://*.pages.dev',
        'https://*.cloudflare.com'
      ],
      ExposeHeaders: ['ETag', 'x-amz-meta-*'],
      MaxAgeSeconds: 3600
    },
    {
      ID: 'AllowPublicRead',
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'HEAD'],
      AllowedOrigins: ['*'],
      MaxAgeSeconds: 86400
    }
  ]
}

async function getCurrentCorsConfig() {
  try {
    console.log('📋 Checking current CORS configuration...')
    
    const command = new GetBucketCorsCommand({
      Bucket: R2_CONFIG.bucketName
    })
    
    const response = await s3Client.send(command)
    console.log('✅ Current CORS configuration:')
    console.log(JSON.stringify(response.CORSRules, null, 2))
    return response.CORSRules
    
  } catch (error) {
    if (error.name === 'NoSuchCORSConfiguration') {
      console.log('ℹ️  No CORS configuration found (this is normal for new buckets)')
      return null
    } else {
      console.error('❌ Error getting CORS configuration:', error.message)
      throw error
    }
  }
}

async function setCorsConfig() {
  try {
    console.log('🔧 Setting up CORS configuration...')
    
    const command = new PutBucketCorsCommand({
      Bucket: R2_CONFIG.bucketName,
      CORSConfiguration: corsConfiguration
    })
    
    await s3Client.send(command)
    console.log('✅ CORS configuration applied successfully!')
    
    // Display the configuration
    console.log('\n📋 Applied CORS rules:')
    corsConfiguration.CORSRules.forEach((rule, index) => {
      console.log(`\n  Rule ${index + 1} (${rule.ID}):`)
      console.log(`    Allowed Origins: ${rule.AllowedOrigins.join(', ')}`)
      console.log(`    Allowed Methods: ${rule.AllowedMethods.join(', ')}`)
      console.log(`    Allowed Headers: ${rule.AllowedHeaders.join(', ')}`)
      console.log(`    Max Age: ${rule.MaxAgeSeconds} seconds`)
    })
    
  } catch (error) {
    console.error('❌ Error setting CORS configuration:', error.message)
    throw error
  }
}

async function validateConfig() {
  console.log('🔍 Validating R2 configuration...')
  
  const requiredVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_ENDPOINT'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(varName => console.error(`   ${varName}`))
    throw new Error('Missing required environment variables')
  }
  
  console.log('✅ All required environment variables are set')
  console.log(`📦 Bucket: ${R2_CONFIG.bucketName}`)
  console.log(`🔗 Endpoint: ${R2_CONFIG.endpoint}`)
}

async function main() {
  console.log('🚀 Setting up R2 Bucket CORS Configuration')
  console.log('=' .repeat(50))
  
  try {
    // Validate configuration
    await validateConfig()
    
    // Get current CORS config
    await getCurrentCorsConfig()
    
    // Set new CORS config
    await setCorsConfig()
    
    // Verify the configuration was applied
    console.log('\n🔍 Verifying CORS configuration...')
    await getCurrentCorsConfig()
    
    console.log('\n🎉 CORS configuration setup complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Wait a few minutes for CORS changes to propagate')
    console.log('2. Test image upload in your application')
    console.log('3. Check browser console for any remaining CORS errors')
    
    console.log('\n💡 If you still see CORS errors:')
    console.log('- Clear your browser cache')
    console.log('- Wait up to 5 minutes for changes to propagate')
    console.log('- Check that your domain is included in AllowedOrigins')
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Verify your R2 API credentials have CORS management permissions')
    console.log('2. Check that the bucket name is correct')
    console.log('3. Ensure your R2 endpoint URL is correct')
    process.exit(1)
  }
}

// Run the setup
main()
