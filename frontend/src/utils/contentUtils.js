// Utility functions for content processing and optimization

/**
 * Extract clean text excerpt from HTML content
 * @param {string} content - HTML content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} Clean text excerpt
 */
export const getExcerpt = (content, maxLength = 150) => {
  if (!content) return ''
  
  // Remove HTML tags and decode entities
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Decode ampersands
    .replace(/&lt;/g, '<') // Decode less than
    .replace(/&gt;/g, '>') // Decode greater than
    .replace(/&quot;/g, '"') // Decode quotes
    .replace(/&#39;/g, "'") // Decode apostrophes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  if (textContent.length <= maxLength) {
    return textContent
  }
  
  // Find the last complete word within the limit
  const truncated = textContent.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

/**
 * Normalize image URL to work with current storage provider
 * @param {string} imageUrl - Original image URL
 * @returns {string|null} Normalized image URL or null
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null

  // If it's already a valid URL, return as-is
  // Both Cloudflare R2 and Supabase URLs should work directly
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // If it's a relative path, we might need to construct the full URL
  // This would depend on your storage configuration
  return imageUrl
}

/**
 * Extract the first image URL from HTML content or featured image
 * @param {string} content - HTML content
 * @param {string} featuredImageUrl - Featured image URL from database
 * @returns {string|null} First image URL or null
 */
export const getThumbnailImage = (content, featuredImageUrl = null) => {
  // First, check if there's a featured image URL
  if (featuredImageUrl) {
    return normalizeImageUrl(featuredImageUrl)
  }

  if (!content) return null

  // Extract the first image from the content
  const imgMatch = content.match(/<img[^>]+src="([^"]*)"[^>]*>/i)
  if (imgMatch) {
    return normalizeImageUrl(imgMatch[1])
  }

  return null
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Show relative dates for recent posts
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  
  // Show formatted date for older posts
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Debounce function for search optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}



/**
 * Optimize image URL based on storage provider
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return null

  // Check if it's a Supabase storage URL (supports built-in optimization)
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('width', width)
      urlObj.searchParams.set('quality', quality)
      urlObj.searchParams.set('format', 'webp')
      return urlObj.toString()
    } catch (error) {
      console.warn('Failed to optimize Supabase image URL:', error)
    }
  }

  // For Cloudflare R2 or other providers without built-in optimization, return as-is
  // In production, you might want to use Cloudflare Images or another optimization service
  return url
}

/**
 * Preload critical resources
 * @param {Array} urls - Array of URLs to preload
 * @param {string} as - Resource type (image, script, style, etc.)
 */
export const preloadResources = (urls, as = 'image') => {
  urls.forEach(url => {
    if (!url) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = url
    
    if (as === 'image') {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  })
}

/**
 * Create intersection observer for lazy loading
 * @param {Function} callback - Callback function when element intersects
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}
