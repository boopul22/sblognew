#!/usr/bin/env node

/**
 * Test Cloudflare R2 Setup
 * This script tests your R2 configuration and credentials
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') })
dotenv.config({ path: path.join(__dirname, '.env') })

console.log('🧪 Testing Cloudflare R2 Setup...\n')

// Test environment variables
function testEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...')
  
  const requiredVars = [
    'VITE_CLOUDFLARE_ACCOUNT_ID',
    'VITE_CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'VITE_CLOUDFLARE_R2_BUCKET_NAME',
    'VITE_CLOUDFLARE_R2_PUBLIC_URL',
    'VITE_CLOUDFLARE_R2_ENDPOINT'
  ]
  
  let allSet = true
  
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value || value.includes('REPLACE_WITH') || value.includes('your_actual')) {
      console.log(`❌ ${varName}: Not set or contains placeholder`)
      allSet = false
    } else {
      console.log(`✅ ${varName}: Set (${value.substring(0, 20)}...)`)
    }
  }
  
  return allSet
}

// Test URL formats
function testURLFormats() {
  console.log('\n🔗 Checking URL Formats...')
  
  const publicUrl = process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL
  const endpoint = process.env.VITE_CLOUDFLARE_R2_ENDPOINT
  
  let urlsValid = true
  
  if (!publicUrl || !publicUrl.startsWith('https://pub-')) {
    console.log('❌ Public URL: Invalid format (should start with https://pub-)')
    urlsValid = false
  } else {
    console.log(`✅ Public URL: ${publicUrl}`)
  }
  
  if (!endpoint || !endpoint.startsWith('https://')) {
    console.log('❌ Endpoint: Invalid format (should start with https://)')
    urlsValid = false
  } else {
    console.log(`✅ Endpoint: ${endpoint}`)
  }
  
  return urlsValid
}

// Test storage provider selection
function testStorageProvider() {
  console.log('\n⚙️ Checking Storage Provider...')
  
  const provider = process.env.VITE_STORAGE_PROVIDER
  
  if (provider === 'cloudflare-r2') {
    console.log('✅ Storage Provider: cloudflare-r2')
    return true
  } else {
    console.log(`❌ Storage Provider: ${provider || 'not set'} (should be 'cloudflare-r2')`)
    return false
  }
}

// Generate test image URL
function testImageURLGeneration() {
  console.log('\n🖼️ Testing Image URL Generation...')
  
  const publicUrl = process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL
  const testFilename = 'test-image-123.jpg'
  
  if (publicUrl) {
    const imageUrl = `${publicUrl}/${testFilename}`
    console.log(`✅ Test Image URL: ${imageUrl}`)
    return true
  } else {
    console.log('❌ Cannot generate image URL - public URL not set')
    return false
  }
}

// Main test function
async function runTests() {
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'URL Formats', fn: testURLFormats },
    { name: 'Storage Provider', fn: testStorageProvider },
    { name: 'Image URL Generation', fn: testImageURLGeneration }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    try {
      const result = test.fn()
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
    console.log('\n🎉 All tests passed! Your R2 configuration looks good.')
    console.log('\n📝 Next steps:')
    console.log('1. Make sure you have the actual R2 API credentials')
    console.log('2. Test image upload in your application')
    console.log('3. Verify images are accessible via public URLs')
  } else {
    console.log('\n⚠️ Some tests failed. Please check your configuration.')
    console.log('\n🔧 To fix:')
    console.log('1. Get your R2 API credentials from Cloudflare dashboard')
    console.log('2. Replace REPLACE_WITH_YOUR_* placeholders in .env.local')
    console.log('3. Run this test again: node test-r2-setup.js')
  }
  
  return failed === 0
}

// Run the tests
runTests().catch(console.error)
