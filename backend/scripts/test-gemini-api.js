#!/usr/bin/env node

/**
 * Test script for Gemini API integration
 * Tests all content generation endpoints and utility functions
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
config({ path: join(projectRoot, '..', '.env.local') })

// Test content
const TEST_CONTENT = `
Artificial Intelligence (AI) has revolutionized the way we approach problem-solving and automation in the modern world. From machine learning algorithms that can predict consumer behavior to natural language processing systems that can understand and generate human-like text, AI technologies are transforming industries across the globe.

Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed. This technology powers recommendation systems on streaming platforms, fraud detection in banking, and even autonomous vehicles that can navigate complex road conditions.

Deep learning, which uses neural networks with multiple layers, has made significant breakthroughs in image recognition, speech processing, and language translation. These advancements have made it possible for computers to perform tasks that were once thought to be exclusively human.

The future of AI holds immense promise, with potential applications in healthcare for disease diagnosis, in education for personalized learning experiences, and in environmental science for climate change mitigation. However, it also raises important questions about ethics, privacy, and the future of work that society must address thoughtfully.
`

/**
 * Test individual API endpoint
 */
async function testAPIEndpoint(content, type, customPrompt = null) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'
  
  try {
    console.log(`\n🧪 Testing ${type} generation...`)
    
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        type,
        customPrompt
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    
    console.log(`✅ ${type} generation successful`)
    console.log(`📊 Generated content:`)
    
    if (type === 'title') {
      console.log(`   Primary: ${result.generated.primary}`)
      console.log(`   Alternatives: ${result.generated.suggestions.slice(1).join(', ')}`)
    } else if (type === 'slug') {
      console.log(`   Primary: ${result.generated.primary}`)
      console.log(`   Alternatives: ${result.generated.suggestions.slice(1).join(', ')}`)
    } else if (type === 'description') {
      console.log(`   Primary: ${result.generated.primary}`)
      console.log(`   Alternative: ${result.generated.suggestions[1] || 'N/A'}`)
    } else if (type === 'tags') {
      console.log(`   Primary tags: ${result.generated.primary.join(', ')}`)
      console.log(`   Additional: ${result.generated.suggestions.slice(8).join(', ')}`)
    } else if (type === 'summary') {
      console.log(`   Summary (${result.generated.wordCount} words): ${result.generated.content.substring(0, 100)}...`)
    } else {
      console.log(`   Content: ${result.generated.content.substring(0, 100)}...`)
    }
    
    return { success: true, result }
  } catch (error) {
    console.log(`❌ ${type} generation failed: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * Test utility functions
 */
async function testUtilityFunctions() {
  console.log('\n🔧 Testing utility functions...')
  
  try {
    // Import utility functions (dynamic import for ES modules)
    const { 
      generateTitles, 
      generateSlugs, 
      generateAllMetadata,
      validateContent,
      prepareContent 
    } = await import('../utils/gemini-content-generator.js')

    // Test validation
    console.log('\n📋 Testing content validation...')
    const validationTests = [
      { content: '', expected: false },
      { content: 'Short', expected: false },
      { content: TEST_CONTENT, expected: true }
    ]

    for (const test of validationTests) {
      const result = validateContent(test.content)
      const status = result.valid === test.expected ? '✅' : '❌'
      console.log(`   ${status} Validation test: ${test.content.length} chars -> ${result.valid}`)
    }

    // Test content preparation
    console.log('\n🧹 Testing content preparation...')
    const messyContent = '  This   has    multiple   spaces\n\n\n\nand   newlines  '
    const cleanContent = prepareContent(messyContent)
    console.log(`   ✅ Content cleaned: "${messyContent}" -> "${cleanContent}"`)

    // Test individual utility functions
    console.log('\n🎯 Testing individual utility functions...')
    
    const titleResult = await generateTitles(TEST_CONTENT.substring(0, 500))
    if (titleResult.success) {
      console.log(`   ✅ generateTitles: ${titleResult.primary}`)
    } else {
      console.log(`   ❌ generateTitles failed: ${titleResult.error}`)
    }

    const slugResult = await generateSlugs(TEST_CONTENT.substring(0, 500))
    if (slugResult.success) {
      console.log(`   ✅ generateSlugs: ${slugResult.primary}`)
    } else {
      console.log(`   ❌ generateSlugs failed: ${slugResult.error}`)
    }

    // Test batch generation
    console.log('\n📦 Testing batch metadata generation...')
    const metadataResult = await generateAllMetadata(TEST_CONTENT.substring(0, 800))
    
    if (metadataResult.success) {
      console.log(`   ✅ Batch generation successful`)
      console.log(`   📝 Title: ${metadataResult.titles.success ? metadataResult.titles.primary : 'Failed'}`)
      console.log(`   🔗 Slug: ${metadataResult.slugs.success ? metadataResult.slugs.primary : 'Failed'}`)
      console.log(`   📄 Description: ${metadataResult.descriptions.success ? metadataResult.descriptions.primary.substring(0, 50) + '...' : 'Failed'}`)
      console.log(`   🏷️  Tags: ${metadataResult.tags.success ? metadataResult.tags.primary.slice(0, 3).join(', ') : 'Failed'}`)
    } else {
      console.log(`   ❌ Batch generation failed: ${metadataResult.error}`)
    }

    return true
  } catch (error) {
    console.log(`❌ Utility function test failed: ${error.message}`)
    return false
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Gemini API Integration Tests')
  console.log('=' .repeat(50))

  // Check environment
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('❌ GEMINI_API_KEY not configured in .env.local')
    console.log('   Please add your Gemini API key to continue testing')
    console.log('   Get your API key from: https://ai.google.dev/gemini-api/docs/api-key')
    process.exit(1)
  }

  console.log('✅ Environment configured')
  console.log(`📡 API Base URL: ${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'}`)
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`)

  const results = {
    apiTests: {},
    utilityTests: false
  }

  // Test all content types
  const contentTypes = ['title', 'slug', 'description', 'tags', 'summary']
  
  for (const type of contentTypes) {
    const result = await testAPIEndpoint(TEST_CONTENT, type)
    results.apiTests[type] = result.success
  }

  // Test custom content generation
  const customResult = await testAPIEndpoint(
    TEST_CONTENT, 
    'custom', 
    'Create a compelling social media post (under 280 characters) that summarizes the key points of this content about AI.'
  )
  results.apiTests.custom = customResult.success

  // Test utility functions
  results.utilityTests = await testUtilityFunctions()

  // Summary
  console.log('\n📊 Test Results Summary')
  console.log('=' .repeat(50))
  
  const apiTestsPassed = Object.values(results.apiTests).filter(Boolean).length
  const apiTestsTotal = Object.keys(results.apiTests).length
  
  console.log(`🧪 API Tests: ${apiTestsPassed}/${apiTestsTotal} passed`)
  for (const [type, passed] of Object.entries(results.apiTests)) {
    console.log(`   ${passed ? '✅' : '❌'} ${type}`)
  }
  
  console.log(`🔧 Utility Tests: ${results.utilityTests ? '✅ Passed' : '❌ Failed'}`)
  
  const allPassed = apiTestsPassed === apiTestsTotal && results.utilityTests
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`)
  
  if (!allPassed) {
    console.log('\n💡 Troubleshooting tips:')
    console.log('   1. Make sure the development server is running (npm run dev:api)')
    console.log('   2. Verify your Gemini API key is valid and has sufficient quota')
    console.log('   3. Check your internet connection')
    console.log('   4. Review the error messages above for specific issues')
  }

  process.exit(allPassed ? 0 : 1)
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  })
}
