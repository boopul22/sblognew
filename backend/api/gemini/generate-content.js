/**
 * Gemini API Endpoint for generating content (titles, slugs, descriptions, etc.)
 * Uses Gemini 2.0 Flash model for high-quality content generation
 */

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Generate a URL-friendly slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Content generation prompts for different types
 */
const CONTENT_PROMPTS = {
  title: {
    system: "You are an expert content writer specializing in creating engaging, SEO-friendly titles. Generate titles that are compelling, clear, and optimized for search engines.",
    prompt: (content) => `Based on the following content, generate 3 compelling, SEO-friendly titles (each on a new line, no numbering or bullets):

Content: ${content}

Requirements:
- Each title should be 50-60 characters long
- Make them engaging and click-worthy
- Include relevant keywords naturally
- Avoid clickbait or misleading titles
- Make them unique and distinct from each other`
  },
  
  slug: {
    system: "You are an expert at creating URL-friendly slugs. Generate clean, SEO-optimized slugs that are readable and descriptive.",
    prompt: (content) => `Based on the following content, generate 3 URL-friendly slugs (each on a new line, no numbering or bullets):

Content: ${content}

Requirements:
- Use only lowercase letters, numbers, and hyphens
- Keep them between 3-8 words
- Make them descriptive and SEO-friendly
- Avoid stop words when possible
- Make them unique and distinct from each other`
  },
  
  description: {
    system: "You are an expert content writer specializing in creating compelling meta descriptions and summaries that drive engagement and improve SEO.",
    prompt: (content) => `Based on the following content, generate 2 compelling descriptions (each on a new line, no numbering or bullets):

Content: ${content}

Requirements:
- Each description should be 150-160 characters long
- Make them engaging and informative
- Include relevant keywords naturally
- Create a compelling reason to read the full content
- Make them unique and distinct from each other`
  },
  
  tags: {
    system: "You are an expert at content categorization and tagging. Generate relevant, specific tags that help with content discovery and SEO.",
    prompt: (content) => `Based on the following content, generate 8-12 relevant tags (each on a new line, no numbering or bullets):

Content: ${content}

Requirements:
- Use specific, relevant keywords
- Mix broad and specific tags
- Include both primary and secondary topics
- Use 1-3 words per tag
- Focus on searchable terms
- Avoid overly generic tags`
  },
  
  summary: {
    system: "You are an expert at creating concise, informative summaries that capture the essence of content while being engaging to readers.",
    prompt: (content) => `Based on the following content, generate a concise summary (2-3 sentences):

Content: ${content}

Requirements:
- Capture the main points and key insights
- Keep it between 100-150 words
- Make it engaging and informative
- Use clear, accessible language
- Include the most important takeaways`
  },
  
  custom: {
    system: "You are an expert content writer and AI assistant. Follow the user's specific instructions carefully and provide high-quality, relevant content.",
    prompt: (content, customPrompt) => `${customPrompt}

Content: ${content}`
  }
}

/**
 * Make request to Gemini API
 */
async function callGeminiAPI(systemInstruction, prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
      thinkingConfig: {
        thinkingBudget: 0 // Disable thinking for faster responses
      }
    }
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API')
  }

  return data.candidates[0].content.parts[0].text
}

/**
 * Process generated content based on type
 */
function processGeneratedContent(content, type) {
  const lines = content.trim().split('\n').filter(line => line.trim())
  
  switch (type) {
    case 'title':
      return {
        suggestions: lines.slice(0, 3),
        primary: lines[0] || ''
      }
    
    case 'slug':
      return {
        suggestions: lines.slice(0, 3).map(generateSlug),
        primary: generateSlug(lines[0] || '')
      }
    
    case 'description':
      return {
        suggestions: lines.slice(0, 2),
        primary: lines[0] || ''
      }
    
    case 'tags':
      return {
        suggestions: lines.slice(0, 12),
        primary: lines.slice(0, 8)
      }
    
    case 'summary':
      return {
        content: content.trim(),
        wordCount: content.trim().split(/\s+/).length
      }
    
    default:
      return {
        content: content.trim(),
        raw: content
      }
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    })
  }

  try {
    const { content, type = 'title', customPrompt } = req.body

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Content is required and must be a string'
      })
    }

    if (content.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Content must be at least 10 characters long'
      })
    }

    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Content must be less than 10,000 characters'
      })
    }

    // Validate type
    const validTypes = ['title', 'slug', 'description', 'tags', 'summary', 'custom']
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
      })
    }

    // Validate custom prompt if type is custom
    if (type === 'custom' && (!customPrompt || typeof customPrompt !== 'string')) {
      return res.status(400).json({
        success: false,
        error: 'Custom prompt is required when type is "custom"'
      })
    }

    // Get prompt configuration
    const promptConfig = CONTENT_PROMPTS[type]
    const prompt = type === 'custom' 
      ? promptConfig.prompt(content, customPrompt)
      : promptConfig.prompt(content)

    // Generate content using Gemini API
    const generatedContent = await callGeminiAPI(promptConfig.system, prompt)

    // Process the generated content
    const processedContent = processGeneratedContent(generatedContent, type)

    // Return successful response
    res.status(200).json({
      success: true,
      type,
      input: {
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        length: content.length
      },
      generated: processedContent,
      timestamp: new Date().toISOString(),
      model: 'gemini-2.0-flash'
    })

  } catch (error) {
    console.error('Error in Gemini content generation:', error)
    
    // Return appropriate error response
    const isAPIError = error.message.includes('Gemini API error')
    const statusCode = isAPIError ? 502 : 500
    
    res.status(statusCode).json({
      success: false,
      error: isAPIError ? 'AI service temporarily unavailable' : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    })
  }
}
