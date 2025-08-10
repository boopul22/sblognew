# Gemini API Integration

This document describes the Gemini 2.0 Flash API integration for generating titles, slugs, descriptions, tags, and other content using Google's advanced AI model.

## 🚀 Quick Start

### 1. Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Create a new API key
3. Add it to your `.env.local` file:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Start the Development Server

```bash
npm run dev:api
```

### 3. Test the Integration

```bash
node backend/scripts/test-gemini-api.js
```

## 📡 API Endpoints

### POST `/api/gemini/generate-content`

Generate various types of content using Gemini 2.0 Flash.

#### Request Body

```json
{
  "content": "Your content here...",
  "type": "title|slug|description|tags|summary|custom",
  "customPrompt": "Optional custom prompt for type 'custom'"
}
```

#### Response Format

```json
{
  "success": true,
  "type": "title",
  "input": {
    "content": "Your content here...",
    "length": 1234
  },
  "generated": {
    "suggestions": ["Title 1", "Title 2", "Title 3"],
    "primary": "Title 1"
  },
  "timestamp": "2025-01-31T12:00:00.000Z",
  "model": "gemini-2.0-flash"
}
```

## 🎯 Content Types

### 1. Title Generation (`type: "title"`)

Generates 3 SEO-friendly, engaging titles (50-60 characters each).

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/gemini/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial Intelligence is transforming industries...",
    "type": "title"
  }'
```

**Example Response:**
```json
{
  "generated": {
    "suggestions": [
      "AI Revolution: How Artificial Intelligence Transforms Industries",
      "The Future of AI: Industry Transformation and Innovation",
      "Artificial Intelligence: Reshaping the Modern Business World"
    ],
    "primary": "AI Revolution: How Artificial Intelligence Transforms Industries"
  }
}
```

### 2. Slug Generation (`type: "slug"`)

Generates 3 URL-friendly slugs (3-8 words, lowercase, hyphens).

**Example Response:**
```json
{
  "generated": {
    "suggestions": [
      "ai-revolution-transforms-industries",
      "future-ai-industry-transformation",
      "artificial-intelligence-business-world"
    ],
    "primary": "ai-revolution-transforms-industries"
  }
}
```

### 3. Description Generation (`type: "description"`)

Generates 2 compelling meta descriptions (150-160 characters each).

**Example Response:**
```json
{
  "generated": {
    "suggestions": [
      "Discover how AI is revolutionizing industries worldwide. From automation to predictive analytics, explore the transformative power of artificial intelligence.",
      "Explore the impact of artificial intelligence on modern industries. Learn about AI applications, benefits, and future trends shaping business today."
    ],
    "primary": "Discover how AI is revolutionizing industries worldwide..."
  }
}
```

### 4. Tag Generation (`type: "tags"`)

Generates 8-12 relevant tags for content categorization and SEO.

**Example Response:**
```json
{
  "generated": {
    "suggestions": [
      "artificial intelligence", "machine learning", "automation", 
      "technology", "innovation", "digital transformation", 
      "AI applications", "future tech", "business intelligence", 
      "data science", "neural networks", "deep learning"
    ],
    "primary": [
      "artificial intelligence", "machine learning", "automation", 
      "technology", "innovation", "digital transformation", 
      "AI applications", "future tech"
    ]
  }
}
```

### 5. Summary Generation (`type: "summary"`)

Generates a concise 2-3 sentence summary (100-150 words).

**Example Response:**
```json
{
  "generated": {
    "content": "Artificial Intelligence is revolutionizing industries through machine learning algorithms, natural language processing, and deep learning technologies. These advancements enable computers to perform complex tasks like fraud detection, autonomous navigation, and personalized recommendations. While AI offers immense potential in healthcare, education, and environmental science, it also raises important ethical questions about privacy and the future of work that society must address.",
    "wordCount": 58
  }
}
```

### 6. Custom Content (`type: "custom"`)

Generate content with custom instructions.

**Example Request:**
```json
{
  "content": "Your content here...",
  "type": "custom",
  "customPrompt": "Create a compelling social media post under 280 characters that highlights the key benefits of AI technology."
}
```

## 🛠️ Utility Functions

The `backend/utils/gemini-content-generator.js` file provides convenient wrapper functions:

### Individual Functions

```javascript
import { 
  generateTitles, 
  generateSlugs, 
  generateDescriptions, 
  generateTags, 
  generateSummary,
  generateCustomContent 
} from '../utils/gemini-content-generator.js'

// Generate titles
const titles = await generateTitles(content)
console.log(titles.primary) // Primary title
console.log(titles.titles)  // All suggestions

// Generate slugs
const slugs = await generateSlugs(content)
console.log(slugs.primary) // Primary slug

// Custom generation
const custom = await generateCustomContent(content, "Your custom prompt here")
console.log(custom.content)
```

### Batch Functions

```javascript
import { generateAllMetadata, generateBlogMetadata } from '../utils/gemini-content-generator.js'

// Generate all basic metadata at once
const metadata = await generateAllMetadata(content)
console.log(metadata.titles.primary)
console.log(metadata.slugs.primary)
console.log(metadata.descriptions.primary)
console.log(metadata.tags.primary)

// Generate blog-specific metadata
const blogMeta = await generateBlogMetadata(content, {
  includeCustomPrompts: true,
  customTitlePrompt: "Create a catchy blog title that includes the main keyword",
  customDescriptionPrompt: "Write a meta description that encourages clicks"
})
```

### Validation and Preparation

```javascript
import { validateContent, prepareContent } from '../utils/gemini-content-generator.js'

// Validate content before processing
const validation = validateContent(content)
if (!validation.valid) {
  console.error(validation.error)
  return
}

// Clean and prepare content
const cleanContent = prepareContent(messyContent)
```

## ⚙️ Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
NEXT_PUBLIC_API_BASE=http://localhost:3001  # API base URL
```

### API Configuration

The API uses the following Gemini settings:

- **Model**: `gemini-2.0-flash`
- **Temperature**: `0.7` (balanced creativity/consistency)
- **Top P**: `0.8` (nucleus sampling)
- **Top K**: `40` (token selection)
- **Max Output Tokens**: `1024`
- **Thinking Budget**: `0` (disabled for faster responses)

## 🧪 Testing

### Run All Tests

```bash
node backend/scripts/test-gemini-api.js
```

### Manual Testing

```bash
# Test title generation
curl -X POST http://localhost:3001/api/gemini/generate-content \
  -H "Content-Type: application/json" \
  -d '{"content": "Your test content here", "type": "title"}'

# Test custom generation
curl -X POST http://localhost:3001/api/gemini/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your test content here", 
    "type": "custom",
    "customPrompt": "Create a haiku about this content"
  }'
```

## 🚨 Error Handling

### Common Errors

1. **API Key Not Configured**
   ```json
   {
     "success": false,
     "error": "Gemini API key not configured"
   }
   ```

2. **Content Too Short/Long**
   ```json
   {
     "success": false,
     "error": "Content must be between 10 and 10,000 characters"
   }
   ```

3. **Invalid Content Type**
   ```json
   {
     "success": false,
     "error": "Invalid type. Must be one of: title, slug, description, tags, summary, custom"
   }
   ```

4. **API Rate Limit**
   ```json
   {
     "success": false,
     "error": "AI service temporarily unavailable"
   }
   ```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error (development only)",
  "timestamp": "2025-01-31T12:00:00.000Z"
}
```

## 💡 Best Practices

1. **Content Length**: Keep content between 100-5000 characters for best results
2. **Batch Processing**: Use `generateAllMetadata()` for multiple content types
3. **Error Handling**: Always check the `success` field in responses
4. **Rate Limiting**: Implement delays between requests if processing many items
5. **Caching**: Consider caching results to reduce API calls
6. **Validation**: Use `validateContent()` before making API calls

## 🔗 Integration Examples

### Blog Post Creation

```javascript
import { generateBlogMetadata } from '../utils/gemini-content-generator.js'

async function createBlogPost(content) {
  const metadata = await generateBlogMetadata(content)
  
  if (metadata.success) {
    const post = {
      title: metadata.metadata.titles.primary,
      slug: metadata.metadata.slugs.primary,
      description: metadata.metadata.descriptions.primary,
      tags: metadata.metadata.tags.primary,
      summary: metadata.metadata.summary.summary,
      content: content
    }
    
    // Save to database
    return await savePost(post)
  }
}
```

### Content Management System

```javascript
// Generate multiple options for user selection
const options = await generateAllMetadata(content)

// Present options to user
const userChoices = {
  title: options.titles.suggestions[userSelectedTitleIndex],
  slug: options.slugs.suggestions[userSelectedSlugIndex],
  description: options.descriptions.suggestions[userSelectedDescIndex],
  tags: options.tags.primary
}
```

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [API Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
