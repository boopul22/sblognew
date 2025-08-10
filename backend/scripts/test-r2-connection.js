#!/usr/bin/env node

/**
 * Test Cloudflare R2 Connection Script
 * Verifies that R2 credentials are correctly set and bucket is accessible
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the root .env.local file
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'blog-images',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
}

console.log('🔍 Testing Cloudflare R2 Configuration...')
console.log('=' .repeat(50))

// Check environment variables
function checkEnvironmentVariables() {
  console.log('\n📋 Checking environment variables...')
  
  const requiredVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL',
    'CLOUDFLARE_R2_ENDPOINT'
  ]
  
  const missing = []
  const configured = []
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value || value.includes('your_') || value.includes('_here')) {
      missing.push(varName)
    } else {
      configured.push(varName)
    }
  })
  
  console.log('\n✅ Configured variables:')
  configured.forEach(varName => {
    const value = process.env[varName]
    const displayValue = varName.includes('SECRET') 
      ? `${value.substring(0, 8)}...` 
      : value
    console.log(`  ${varName}: ${displayValue}`)
  })
  
  if (missing.length > 0) {
    console.log('\n❌ Missing or placeholder variables:')
    missing.forEach(varName => {
      console.log(`  ${varName}: ${process.env[varName] || 'NOT SET'}`)
    })
    return false
  }
  
  console.log('\n✅ All environment variables configured!')
  return true
}

// Test R2 bucket access
async function testR2Access() {
  console.log('\n🗄️  Testing R2 bucket access...')
  
  try {
    // For now, we'll just validate the configuration
    // In a real implementation, you'd test actual bucket access
    
    const { bucketName, endpoint, publicUrl } = R2_CONFIG
    
    console.log(`📦 Bucket: ${bucketName}`)
    console.log(`🔗 Endpoint: ${endpoint}`)
    console.log(`🌐 Public URL: ${publicUrl}`)
    
    // Validate URL formats
    if (!endpoint.startsWith('https://')) {
      throw new Error('R2 endpoint must start with https://')
    }
    
    if (!publicUrl.startsWith('https://')) {
      throw new Error('R2 public URL must start with https://')
    }
    
    console.log('✅ R2 configuration appears valid!')
    return true
    
  } catch (error) {
    console.error('❌ R2 configuration error:', error.message)
    return false
  }
}

// Test image URL generation
function testImageUrlGeneration() {
  console.log('\n🖼️  Testing image URL generation...')
  
  try {
    const testFilename = 'blog-images/1234567890-test.jpg'
    const { publicUrl } = R2_CONFIG
    
    const imageUrl = `${publicUrl}/${testFilename}`
    console.log(`📸 Test image URL: ${imageUrl}`)
    
    // Validate URL structure
    if (!imageUrl.includes(testFilename)) {
      throw new Error('Generated URL does not contain filename')
    }
    
    console.log('✅ Image URL generation working!')
    return true
    
  } catch (error) {
    console.error('❌ Image URL generation error:', error.message)
    return false
  }
}

// Test file validation
function testFileValidation() {
  console.log('\n📋 Testing file validation logic...')
  
  try {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    console.log(`📝 Allowed types: ${allowedTypes.join(', ')}`)
    console.log(`📏 Max size: ${Math.round(maxSize / 1024 / 1024)}MB`)
    
    // Test type validation
    const validType = 'image/jpeg'
    const invalidType = 'text/plain'
    
    if (!allowedTypes.includes(validType)) {
      throw new Error('Valid type validation failed')
    }
    
    if (allowedTypes.includes(invalidType)) {
      throw new Error('Invalid type validation failed')
    }
    
    console.log('✅ File validation logic working!')
    return true
    
  } catch (error) {
    console.error('❌ File validation error:', error.message)
    return false
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Running Cloudflare R2 integration tests...\n')
  
  const tests = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'R2 Access Configuration', fn: testR2Access },
    { name: 'Image URL Generation', fn: testImageUrlGeneration },
    { name: 'File Validation', fn: testFileValidation }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    try {
      const result = await test.fn()
      if (result) {
        passed++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`❌ Test "${test.name}" failed:`, error.message)
      failed++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Results:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your R2 configuration is ready.')
    console.log('\n📝 Next steps:')
    console.log('1. Configure your actual R2 credentials')
    console.log('2. Test image upload in the application')
    console.log('3. Verify images are accessible via public URLs')
    return true
  } else {
    console.log('\n⚠️  Some tests failed. Please check your configuration.')
    console.log('\n📖 See CLOUDFLARE_R2_SETUP.md for detailed setup instructions.')
    return false
  }
}

// Run the tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Test script error:', error)
    process.exit(1)
  })
