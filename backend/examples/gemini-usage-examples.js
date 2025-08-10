#!/usr/bin/env node

/**
 * Gemini API Usage Examples
 * Demonstrates how to use the Gemini content generation API
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
config({ path: join(projectRoot, '..', '.env.local') })

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

// Sample blog post content
const SAMPLE_CONTENT = `
The rise of sustainable technology has become one of the most significant trends in modern business. Companies worldwide are investing heavily in renewable energy solutions, electric vehicles, and eco-friendly manufacturing processes.

Solar and wind power technologies have reached unprecedented efficiency levels, making them cost-competitive with traditional fossil fuels. Electric vehicle adoption is accelerating, with major automakers committing to fully electric lineups within the next decade.

Green building practices are transforming the construction industry, with smart materials and energy-efficient designs becoming standard. These innovations not only reduce environmental impact but also provide long-term cost savings for businesses and consumers.

The circular economy model is gaining traction, encouraging companies to design products for reuse, recycling, and minimal waste. This approach creates new business opportunities while addressing environmental challenges.

As consumers become more environmentally conscious, businesses that embrace sustainable practices are gaining competitive advantages in the marketplace.
`

/**
 * Example 1: Generate blog post titles
 */
async function generateBlogTitles() {
  console.log('\n📝 Example 1: Generating Blog Post Titles')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: SAMPLE_CONTENT,
        type: 'title'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Generated Titles:')
      result.generated.suggestions.forEach((title, index) => {
        console.log(`   ${index + 1}. ${title}`)
      })
      console.log(`\n🎯 Recommended: ${result.generated.primary}`)
    } else {
      console.log(`❌ Error: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`)
  }
}

/**
 * Example 2: Generate SEO-friendly slugs
 */
async function generateSEOSlugs() {
  console.log('\n🔗 Example 2: Generating SEO-Friendly Slugs')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: SAMPLE_CONTENT,
        type: 'slug'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Generated Slugs:')
      result.generated.suggestions.forEach((slug, index) => {
        console.log(`   ${index + 1}. ${slug}`)
      })
      console.log(`\n🎯 Recommended: ${result.generated.primary}`)
    } else {
      console.log(`❌ Error: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`)
  }
}

/**
 * Example 3: Generate meta descriptions
 */
async function generateMetaDescriptions() {
  console.log('\n📄 Example 3: Generating Meta Descriptions')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: SAMPLE_CONTENT,
        type: 'description'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Generated Descriptions:')
      result.generated.suggestions.forEach((desc, index) => {
        console.log(`   ${index + 1}. ${desc}`)
        console.log(`      (${desc.length} characters)`)
      })
      console.log(`\n🎯 Recommended: ${result.generated.primary}`)
    } else {
      console.log(`❌ Error: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`)
  }
}

/**
 * Example 4: Generate content tags
 */
async function generateContentTags() {
  console.log('\n🏷️  Example 4: Generating Content Tags')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: SAMPLE_CONTENT,
        type: 'tags'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Generated Tags:')
      console.log(`   Primary Tags: ${result.generated.primary.join(', ')}`)
      console.log(`   All Tags: ${result.generated.suggestions.join(', ')}`)
    } else {
      console.log(`❌ Error: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`)
  }
}

/**
 * Example 5: Generate content summary
 */
async function generateContentSummary() {
  console.log('\n📋 Example 5: Generating Content Summary')
  console.log('=' .repeat(50))
  
  try {
    const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: SAMPLE_CONTENT,
        type: 'summary'
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Generated Summary:')
      console.log(`   ${result.generated.content}`)
      console.log(`   (${result.generated.wordCount} words)`)
    } else {
      console.log(`❌ Error: ${result.error}`)
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`)
  }
}

/**
 * Example 6: Custom content generation
 */
async function generateCustomContent() {
  console.log('\n🎨 Example 6: Custom Content Generation')
  console.log('=' .repeat(50))
  
  const customPrompts = [
    'Create a compelling social media post (under 280 characters) about this content',
    'Write a professional email subject line that would make people want to read about this topic',
    'Generate 3 questions that this content answers, formatted as FAQ items'
  ]

  for (let i = 0; i < customPrompts.length; i++) {
    const prompt = customPrompts[i]
    console.log(`\n🎯 Custom Prompt ${i + 1}: ${prompt}`)
    
    try {
      const response = await fetch(`${API_BASE}/api/gemini/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: SAMPLE_CONTENT,
          type: 'custom',
          customPrompt: prompt
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Generated Content:')
        console.log(`   ${result.generated.content}`)
      } else {
        console.log(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`)
    }
  }
}

/**
 * Example 7: Using utility functions
 */
async function useUtilityFunctions() {
  console.log('\n🔧 Example 7: Using Utility Functions')
  console.log('=' .repeat(50))
  
  try {
    // Import utility functions
    const { generateAllMetadata, validateContent } = await import('../utils/gemini-content-generator.js')

    // Validate content first
    const validation = validateContent(SAMPLE_CONTENT)
    console.log(`📋 Content validation: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`)
    
    if (validation.valid) {
      console.log(`   Length: ${validation.length} characters`)
      console.log(`   Words: ${validation.wordCount} words`)
      
      // Generate all metadata at once
      console.log('\n📦 Generating all metadata...')
      const metadata = await generateAllMetadata(SAMPLE_CONTENT)
      
      if (metadata.success) {
        console.log('✅ Batch generation successful!')
        console.log(`   Title: ${metadata.titles.success ? metadata.titles.primary : 'Failed'}`)
        console.log(`   Slug: ${metadata.slugs.success ? metadata.slugs.primary : 'Failed'}`)
        console.log(`   Description: ${metadata.descriptions.success ? metadata.descriptions.primary.substring(0, 50) + '...' : 'Failed'}`)
        console.log(`   Tags: ${metadata.tags.success ? metadata.tags.primary.slice(0, 3).join(', ') + '...' : 'Failed'}`)
      } else {
        console.log(`❌ Batch generation failed: ${metadata.error}`)
      }
    }
  } catch (error) {
    console.log(`❌ Utility function error: ${error.message}`)
  }
}

/**
 * Main function to run all examples
 */
async function runExamples() {
  console.log('🚀 Gemini API Usage Examples')
  console.log('=' .repeat(50))
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('❌ GEMINI_API_KEY not configured in .env.local')
    console.log('   Please add your Gemini API key to run these examples')
    console.log('   Get your API key from: https://ai.google.dev/gemini-api/docs/api-key')
    return
  }

  console.log('✅ Environment configured')
  console.log(`📡 API Base URL: ${API_BASE}`)
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`)
  
  // Run all examples
  await generateBlogTitles()
  await generateSEOSlugs()
  await generateMetaDescriptions()
  await generateContentTags()
  await generateContentSummary()
  await generateCustomContent()
  await useUtilityFunctions()
  
  console.log('\n🎉 All examples completed!')
  console.log('\n💡 Next steps:')
  console.log('   1. Integrate these functions into your application')
  console.log('   2. Customize prompts for your specific use case')
  console.log('   3. Add error handling and retry logic for production')
  console.log('   4. Consider caching results to reduce API calls')
}

// Run examples if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(error => {
    console.error('❌ Example execution failed:', error)
    process.exit(1)
  })
}
