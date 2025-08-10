/**
 * Utility functions for Gemini content generation
 * Provides easy-to-use functions for different types of content generation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

/**
 * Base function to call the Gemini API
 */
async function callGeminiAPI(content, type, customPrompt = null) {
  const response = await fetch(`${API_BASE_URL}/api/gemini/generate-content`, {
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
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Generate SEO-friendly titles from content
 * @param {string} content - The content to generate titles for
 * @returns {Promise<Object>} Object with title suggestions and primary title
 */
export async function generateTitles(content) {
  try {
    const result = await callGeminiAPI(content, 'title')
    return {
      success: true,
      titles: result.generated.suggestions,
      primary: result.generated.primary,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      titles: [],
      primary: ''
    }
  }
}

/**
 * Generate URL-friendly slugs from content
 * @param {string} content - The content to generate slugs for
 * @returns {Promise<Object>} Object with slug suggestions and primary slug
 */
export async function generateSlugs(content) {
  try {
    const result = await callGeminiAPI(content, 'slug')
    return {
      success: true,
      slugs: result.generated.suggestions,
      primary: result.generated.primary,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      slugs: [],
      primary: ''
    }
  }
}

/**
 * Generate meta descriptions from content
 * @param {string} content - The content to generate descriptions for
 * @returns {Promise<Object>} Object with description suggestions and primary description
 */
export async function generateDescriptions(content) {
  try {
    const result = await callGeminiAPI(content, 'description')
    return {
      success: true,
      descriptions: result.generated.suggestions,
      primary: result.generated.primary,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      descriptions: [],
      primary: ''
    }
  }
}

/**
 * Generate relevant tags from content
 * @param {string} content - The content to generate tags for
 * @returns {Promise<Object>} Object with tag suggestions and primary tags
 */
export async function generateTags(content) {
  try {
    const result = await callGeminiAPI(content, 'tags')
    return {
      success: true,
      tags: result.generated.suggestions,
      primary: result.generated.primary,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      tags: [],
      primary: []
    }
  }
}

/**
 * Generate a summary from content
 * @param {string} content - The content to summarize
 * @returns {Promise<Object>} Object with summary and word count
 */
export async function generateSummary(content) {
  try {
    const result = await callGeminiAPI(content, 'summary')
    return {
      success: true,
      summary: result.generated.content,
      wordCount: result.generated.wordCount,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      summary: '',
      wordCount: 0
    }
  }
}

/**
 * Generate custom content with a specific prompt
 * @param {string} content - The content to work with
 * @param {string} customPrompt - Custom instructions for content generation
 * @returns {Promise<Object>} Object with generated content
 */
export async function generateCustomContent(content, customPrompt) {
  try {
    const result = await callGeminiAPI(content, 'custom', customPrompt)
    return {
      success: true,
      content: result.generated.content,
      raw: result.generated.raw,
      timestamp: result.timestamp
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      content: '',
      raw: ''
    }
  }
}

/**
 * Generate all basic content types at once (title, slug, description, tags)
 * @param {string} content - The content to generate metadata for
 * @returns {Promise<Object>} Object with all generated content types
 */
export async function generateAllMetadata(content) {
  try {
    const [titles, slugs, descriptions, tags] = await Promise.allSettled([
      generateTitles(content),
      generateSlugs(content),
      generateDescriptions(content),
      generateTags(content)
    ])

    return {
      success: true,
      titles: titles.status === 'fulfilled' ? titles.value : { success: false, error: titles.reason?.message, titles: [], primary: '' },
      slugs: slugs.status === 'fulfilled' ? slugs.value : { success: false, error: slugs.reason?.message, slugs: [], primary: '' },
      descriptions: descriptions.status === 'fulfilled' ? descriptions.value : { success: false, error: descriptions.reason?.message, descriptions: [], primary: '' },
      tags: tags.status === 'fulfilled' ? tags.value : { success: false, error: tags.reason?.message, tags: [], primary: [] },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      titles: { success: false, error: error.message, titles: [], primary: '' },
      slugs: { success: false, error: error.message, slugs: [], primary: '' },
      descriptions: { success: false, error: error.message, descriptions: [], primary: '' },
      tags: { success: false, error: error.message, tags: [], primary: [] }
    }
  }
}

/**
 * Generate blog post metadata optimized for SEO
 * @param {string} content - The blog post content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Object with SEO-optimized metadata
 */
export async function generateBlogMetadata(content, options = {}) {
  const { includeCustomPrompts = false, customTitlePrompt, customDescriptionPrompt } = options

  try {
    const promises = [
      includeCustomPrompts && customTitlePrompt 
        ? generateCustomContent(content, customTitlePrompt)
        : generateTitles(content),
      generateSlugs(content),
      includeCustomPrompts && customDescriptionPrompt
        ? generateCustomContent(content, customDescriptionPrompt)
        : generateDescriptions(content),
      generateTags(content),
      generateSummary(content)
    ]

    const [titles, slugs, descriptions, tags, summary] = await Promise.allSettled(promises)

    return {
      success: true,
      metadata: {
        titles: titles.status === 'fulfilled' ? titles.value : { success: false, error: titles.reason?.message },
        slugs: slugs.status === 'fulfilled' ? slugs.value : { success: false, error: slugs.reason?.message },
        descriptions: descriptions.status === 'fulfilled' ? descriptions.value : { success: false, error: descriptions.reason?.message },
        tags: tags.status === 'fulfilled' ? tags.value : { success: false, error: tags.reason?.message },
        summary: summary.status === 'fulfilled' ? summary.value : { success: false, error: summary.reason?.message }
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      metadata: {}
    }
  }
}

/**
 * Validate content before sending to API
 * @param {string} content - Content to validate
 * @returns {Object} Validation result
 */
export function validateContent(content) {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      error: 'Content is required and must be a string'
    }
  }

  if (content.length < 10) {
    return {
      valid: false,
      error: 'Content must be at least 10 characters long'
    }
  }

  if (content.length > 10000) {
    return {
      valid: false,
      error: 'Content must be less than 10,000 characters'
    }
  }

  return {
    valid: true,
    length: content.length,
    wordCount: content.trim().split(/\s+/).length
  }
}

/**
 * Clean and prepare content for API submission
 * @param {string} content - Raw content
 * @returns {string} Cleaned content
 */
export function prepareContent(content) {
  if (!content || typeof content !== 'string') {
    return ''
  }

  return content
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .substring(0, 10000) // Ensure content doesn't exceed limit
}

// Default export for convenience
export default {
  generateTitles,
  generateSlugs,
  generateDescriptions,
  generateTags,
  generateSummary,
  generateCustomContent,
  generateAllMetadata,
  generateBlogMetadata,
  validateContent,
  prepareContent
}
