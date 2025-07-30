import slugify from 'slugify'
import { supabase } from '../lib/supabase'

/**
 * Hindi to English transliteration mapping
 * Basic mapping for common Hindi characters
 */
const hindiToEnglishMap = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya',
  'ं': 'n', 'ः': 'h', '्': '', 'ा': 'aa', 'ि': 'i', 'ी': 'ii',
  'ु': 'u', 'ू': 'uu', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
}

/**
 * Transliterate Hindi text to English
 * @param {string} text - Hindi text to transliterate
 * @returns {string} - Transliterated English text
 */
export const transliterateHindi = (text) => {
  if (!text) return ''
  
  let transliterated = text
  
  // Replace Hindi characters with English equivalents
  Object.entries(hindiToEnglishMap).forEach(([hindi, english]) => {
    const regex = new RegExp(hindi, 'g')
    transliterated = transliterated.replace(regex, english)
  })
  
  return transliterated
}

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert to slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (title) => {
  if (!title) return ''
  
  // First transliterate Hindi characters
  const transliterated = transliterateHindi(title)
  
  // Use slugify to create URL-friendly slug
  const slug = slugify(transliterated, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
  
  // Ensure slug is not empty and has reasonable length
  if (!slug) {
    return `post-${Date.now()}`
  }
  
  // Limit slug length to 100 characters
  return slug.substring(0, 100)
}

/**
 * Check if a slug is unique in the database
 * @param {string} slug - The slug to check
 * @param {string} excludeId - Post ID to exclude from check (for editing)
 * @returns {Promise<boolean>} - True if slug is unique
 */
export const validateSlugUniqueness = async (slug, excludeId = null) => {
  if (!slug) return false
  
  try {
    let query = supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error checking slug uniqueness:', error)
      return false
    }
    
    return !data || data.length === 0
  } catch (error) {
    console.error('Error validating slug:', error)
    return false
  }
}

/**
 * Generate a unique slug by appending numbers if needed
 * @param {string} baseSlug - The base slug to make unique
 * @param {string} excludeId - Post ID to exclude from check
 * @returns {Promise<string>} - Unique slug
 */
export const generateUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug
  let counter = 1
  
  while (!(await validateSlugUniqueness(slug, excludeId))) {
    slug = `${baseSlug}-${counter}`
    counter++
    
    // Prevent infinite loops
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }
  
  return slug
}

/**
 * Clean and validate slug format
 * @param {string} slug - The slug to clean
 * @returns {string} - Cleaned slug
 */
export const cleanSlug = (slug) => {
  if (!slug) return ''
  
  return slugify(slug, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  }).substring(0, 100)
}

/**
 * Extract slug from a full URL
 * @param {string} url - Full URL
 * @returns {string} - Extracted slug
 */
export const extractSlugFromUrl = (url) => {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const slug = pathname.split('/').filter(Boolean).pop()
    return slug || ''
  } catch (error) {
    // If URL parsing fails, try to extract from string
    const parts = url.split('/')
    return parts[parts.length - 1] || ''
  }
}

/**
 * Validate slug format
 * @param {string} slug - The slug to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validateSlugFormat = (slug) => {
  if (!slug) {
    return { isValid: false, message: 'Slug is required' }
  }
  
  if (slug.length < 3) {
    return { isValid: false, message: 'Slug must be at least 3 characters long' }
  }
  
  if (slug.length > 100) {
    return { isValid: false, message: 'Slug must be less than 100 characters' }
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { 
      isValid: false, 
      message: 'Slug can only contain lowercase letters, numbers, and hyphens' 
    }
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { isValid: false, message: 'Slug cannot start or end with a hyphen' }
  }
  
  if (slug.includes('--')) {
    return { isValid: false, message: 'Slug cannot contain consecutive hyphens' }
  }
  
  // Check for reserved words
  const reservedWords = [
    'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'test',
    'staging', 'dev', 'development', 'prod', 'production',
    'blog', 'post', 'page', 'category', 'tag', 'author', 'search'
  ]
  
  if (reservedWords.includes(slug)) {
    return { isValid: false, message: 'This slug is reserved and cannot be used' }
  }
  
  return { isValid: true, message: '' }
}
