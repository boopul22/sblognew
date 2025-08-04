/**
 * Validation utilities for post creation and editing
 */

/**
 * Validate post title
 * @param {string} title - Post title to validate
 * @returns {object} - Validation result
 */
export const validateTitle = (title) => {
  const errors = []

  if (!title || typeof title !== 'string') {
    errors.push('Title is required')
  } else {
    const trimmedTitle = title.trim()
    
    if (trimmedTitle.length === 0) {
      errors.push('Title cannot be empty')
    } else if (trimmedTitle.length < 3) {
      errors.push('Title must be at least 3 characters long')
    } else if (trimmedTitle.length > 200) {
      errors.push('Title must be less than 200 characters')
    }

    // Check for HTML tags in title
    if (/<[^>]*>/g.test(trimmedTitle)) {
      errors.push('Title cannot contain HTML tags')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: title ? title.trim() : ''
  }
}

/**
 * Validate post slug
 * @param {string} slug - Post slug to validate
 * @returns {object} - Validation result
 */
export const validateSlug = (slug) => {
  const errors = []

  if (!slug || typeof slug !== 'string') {
    errors.push('Slug is required')
  } else {
    const trimmedSlug = slug.trim().toLowerCase()
    
    if (trimmedSlug.length === 0) {
      errors.push('Slug cannot be empty')
    } else if (trimmedSlug.length < 3) {
      errors.push('Slug must be at least 3 characters long')
    } else if (trimmedSlug.length > 100) {
      errors.push('Slug must be less than 100 characters')
    }

    // Check slug format
    if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
      errors.push('Slug can only contain lowercase letters, numbers, and hyphens')
    }

    // Check for consecutive hyphens
    if (trimmedSlug.includes('--')) {
      errors.push('Slug cannot contain consecutive hyphens')
    }

    // Check start/end with hyphen
    if (trimmedSlug.startsWith('-') || trimmedSlug.endsWith('-')) {
      errors.push('Slug cannot start or end with a hyphen')
    }

    // Check for reserved words
    const reservedWords = [
      'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'test',
      'staging', 'dev', 'development', 'prod', 'production',
      'blog', 'post', 'page', 'category', 'tag', 'author', 'search',
      'about', 'contact', 'privacy', 'terms', 'sitemap', 'robots'
    ]

    if (reservedWords.includes(trimmedSlug)) {
      errors.push('This slug is reserved and cannot be used')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: slug ? slug.trim().toLowerCase() : ''
  }
}

/**
 * Validate post content
 * @param {string} content - Post content to validate
 * @returns {object} - Validation result
 */
export const validateContent = (content) => {
  const errors = []
  const warnings = []

  if (!content || typeof content !== 'string') {
    warnings.push('Content is empty')
  } else {
    const trimmedContent = content.trim()
    
    if (trimmedContent.length === 0) {
      warnings.push('Content is empty')
    } else if (trimmedContent.length < 50) {
      warnings.push('Content is quite short (less than 50 characters)')
    } else if (trimmedContent.length > 50000) {
      errors.push('Content is too long (maximum 50,000 characters)')
    }

    // Check for potentially problematic HTML
    const scriptTags = /<script[^>]*>.*?<\/script>/gi
    if (scriptTags.test(trimmedContent)) {
      errors.push('Content cannot contain script tags')
    }

    const styleTags = /<style[^>]*>.*?<\/style>/gi
    if (styleTags.test(trimmedContent)) {
      warnings.push('Content contains style tags which may affect layout')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: content ? content.trim() : ''
  }
}

/**
 * Validate post excerpt
 * @param {string} excerpt - Post excerpt to validate
 * @returns {object} - Validation result
 */
export const validateExcerpt = (excerpt) => {
  const errors = []
  const warnings = []

  if (excerpt && typeof excerpt === 'string') {
    const trimmedExcerpt = excerpt.trim()
    
    if (trimmedExcerpt.length > 300) {
      errors.push('Excerpt must be less than 300 characters')
    }

    if (trimmedExcerpt.length > 0 && trimmedExcerpt.length < 20) {
      warnings.push('Excerpt is quite short (less than 20 characters)')
    }

    // Check for HTML tags in excerpt
    if (/<[^>]*>/g.test(trimmedExcerpt)) {
      warnings.push('Excerpt contains HTML tags which will be stripped')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: excerpt ? excerpt.trim() : ''
  }
}

/**
 * Validate featured image URL
 * @param {string} imageUrl - Image URL to validate
 * @returns {object} - Validation result
 */
export const validateFeaturedImage = (imageUrl) => {
  const errors = []
  const warnings = []

  if (imageUrl && typeof imageUrl === 'string') {
    const trimmedUrl = imageUrl.trim()
    
    if (trimmedUrl.length === 0) {
      return { isValid: true, errors: [], warnings: [], value: '' }
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl)
    } catch {
      errors.push('Featured image URL is not valid')
      return { isValid: false, errors, warnings, value: trimmedUrl }
    }

    // Check if it's an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const hasImageExtension = imageExtensions.some(ext => 
      trimmedUrl.toLowerCase().includes(ext)
    )

    if (!hasImageExtension && !trimmedUrl.includes('supabase')) {
      warnings.push('URL does not appear to be an image file')
    }

    // Check for HTTPS
    if (!trimmedUrl.startsWith('https://')) {
      warnings.push('Consider using HTTPS URLs for better security')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: imageUrl ? imageUrl.trim() : ''
  }
}

/**
 * Validate SEO meta title
 * @param {string} metaTitle - Meta title to validate
 * @returns {object} - Validation result
 */
export const validateMetaTitle = (metaTitle) => {
  const errors = []
  const warnings = []

  if (metaTitle && typeof metaTitle === 'string') {
    const trimmedTitle = metaTitle.trim()
    
    if (trimmedTitle.length > 60) {
      warnings.push('Meta title is longer than 60 characters and may be truncated in search results')
    }

    if (trimmedTitle.length > 100) {
      errors.push('Meta title must be less than 100 characters')
    }

    if (trimmedTitle.length > 0 && trimmedTitle.length < 30) {
      warnings.push('Meta title is quite short (less than 30 characters)')
    }

    // Check for HTML tags
    if (/<[^>]*>/g.test(trimmedTitle)) {
      errors.push('Meta title cannot contain HTML tags')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: metaTitle ? metaTitle.trim() : ''
  }
}

/**
 * Validate SEO meta description
 * @param {string} metaDescription - Meta description to validate
 * @returns {object} - Validation result
 */
export const validateMetaDescription = (metaDescription) => {
  const errors = []
  const warnings = []

  if (metaDescription && typeof metaDescription === 'string') {
    const trimmedDescription = metaDescription.trim()
    
    if (trimmedDescription.length > 160) {
      warnings.push('Meta description is longer than 160 characters and may be truncated in search results')
    }

    if (trimmedDescription.length > 300) {
      errors.push('Meta description must be less than 300 characters')
    }

    if (trimmedDescription.length > 0 && trimmedDescription.length < 50) {
      warnings.push('Meta description is quite short (less than 50 characters)')
    }

    // Check for HTML tags
    if (/<[^>]*>/g.test(trimmedDescription)) {
      errors.push('Meta description cannot contain HTML tags')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    value: metaDescription ? metaDescription.trim() : ''
  }
}

/**
 * Validate entire post data
 * @param {object} postData - Complete post data to validate
 * @returns {object} - Comprehensive validation result
 */
export const validatePost = (postData) => {
  const validationResults = {
    title: validateTitle(postData.title),
    slug: validateSlug(postData.slug),
    content: validateContent(postData.content),
    excerpt: validateExcerpt(postData.excerpt),
    featured_image_url: validateFeaturedImage(postData.featured_image_url),
    meta_title: validateMetaTitle(postData.meta_title),
    meta_description: validateMetaDescription(postData.meta_description)
  }

  const allErrors = []
  const allWarnings = []

  Object.entries(validationResults).forEach(([field, result]) => {
    if (result.errors && result.errors.length > 0) {
      allErrors.push(...result.errors.map(error => `${field}: ${error}`))
    }
    if (result.warnings && result.warnings.length > 0) {
      allWarnings.push(...result.warnings.map(warning => `${field}: ${warning}`))
    }
  })

  // Additional cross-field validations
  if (postData.status === 'published') {
    if (!postData.title || !postData.title.trim()) {
      allErrors.push('Published posts must have a title')
    }
    if (!postData.slug || !postData.slug.trim()) {
      allErrors.push('Published posts must have a slug')
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    fieldResults: validationResults
  }
}

/**
 * Get validation summary for display
 * @param {object} validationResult - Result from validatePost
 * @returns {string} - Human-readable summary
 */
export const getValidationSummary = (validationResult) => {
  const { errors, warnings } = validationResult

  if (errors.length === 0 && warnings.length === 0) {
    return 'All validations passed'
  }

  const parts = []
  
  if (errors.length > 0) {
    parts.push(`${errors.length} error${errors.length !== 1 ? 's' : ''}`)
  }
  
  if (warnings.length > 0) {
    parts.push(`${warnings.length} warning${warnings.length !== 1 ? 's' : ''}`)
  }

  return parts.join(', ')
}

/**
 * Clean and sanitize post data
 * @param {object} postData - Raw post data
 * @returns {object} - Cleaned post data
 */
export const sanitizePostData = (postData) => {
  const cleaned = {}

  // Clean title
  if (postData.title) {
    cleaned.title = postData.title.trim().replace(/<[^>]*>/g, '')
  }

  // Clean slug
  if (postData.slug) {
    cleaned.slug = postData.slug.trim().toLowerCase()
  }

  // Clean content (preserve HTML but remove scripts)
  if (postData.content) {
    cleaned.content = postData.content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .trim()
  }

  // Clean excerpt (remove HTML)
  if (postData.excerpt) {
    cleaned.excerpt = postData.excerpt.trim().replace(/<[^>]*>/g, '')
  }

  // Clean featured image URL
  if (postData.featured_image_url) {
    cleaned.featured_image_url = postData.featured_image_url.trim()
  }

  // Clean meta fields (remove HTML)
  if (postData.meta_title) {
    cleaned.meta_title = postData.meta_title.trim().replace(/<[^>]*>/g, '')
  }

  if (postData.meta_description) {
    cleaned.meta_description = postData.meta_description.trim().replace(/<[^>]*>/g, '')
  }

  // Preserve other fields as-is
  Object.keys(postData).forEach(key => {
    if (!cleaned.hasOwnProperty(key)) {
      cleaned[key] = postData[key]
    }
  })

  return cleaned
}
