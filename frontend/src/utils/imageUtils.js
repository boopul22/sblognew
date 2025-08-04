/**
 * Image utility functions for compression, resizing, and thumbnail generation
 */

/**
 * Compress an image file
 * @param {File} file - The image file to compress
 * @param {object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    format = 'image/jpeg'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: format,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        format,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate a thumbnail from an image file
 * @param {File} file - The image file
 * @param {object} options - Thumbnail options
 * @returns {Promise<File>} - Thumbnail file
 */
export const generateThumbnail = async (file, options = {}) => {
  const {
    width = 300,
    height = 200,
    quality = 0.7,
    format = 'image/jpeg'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = width
      canvas.height = height

      // Calculate crop dimensions to maintain aspect ratio
      const imgAspect = img.width / img.height
      const canvasAspect = width / height

      let drawWidth, drawHeight, drawX, drawY

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        drawHeight = height
        drawWidth = height * imgAspect
        drawX = (width - drawWidth) / 2
        drawY = 0
      } else {
        // Image is taller than canvas
        drawWidth = width
        drawHeight = width / imgAspect
        drawX = 0
        drawY = (height - drawHeight) / 2
      }

      // Fill background with white
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Draw image
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: format,
              lastModified: Date.now()
            })
            resolve(thumbnailFile)
          } else {
            reject(new Error('Failed to generate thumbnail'))
          }
        },
        format,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Resize an image to specific dimensions
 * @param {File} file - The image file to resize
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {object} options - Resize options
 * @returns {Promise<File>} - Resized image file
 */
export const resizeImage = async (file, width, height, options = {}) => {
  const {
    quality = 0.8,
    format = 'image/jpeg',
    maintainAspectRatio = true
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      let targetWidth = width
      let targetHeight = height

      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height
        if (width / height > aspectRatio) {
          targetWidth = height * aspectRatio
        } else {
          targetHeight = width / aspectRatio
        }
      }

      canvas.width = targetWidth
      canvas.height = targetHeight

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: format,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        format,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get image dimensions from a file
 * @param {File} file - The image file
 * @returns {Promise<object>} - Object with width and height
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Convert image file to base64 data URL
 * @param {File} file - The image file
 * @returns {Promise<string>} - Base64 data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target.result)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file type and size
 * @param {File} file - The file to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    minWidth = 100,
    minHeight = 100,
    maxWidth = 4000,
    maxHeight = 4000
  } = options

  const errors = []

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum ${Math.round(maxSize / 1024 / 1024)}MB`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Create multiple image variants (original, thumbnail, medium)
 * @param {File} file - The original image file
 * @returns {Promise<object>} - Object with different image variants
 */
export const createImageVariants = async (file) => {
  try {
    const [original, thumbnail, medium] = await Promise.all([
      compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.8 }),
      generateThumbnail(file, { width: 300, height: 200, quality: 0.7 }),
      compressImage(file, { maxWidth: 600, maxHeight: 400, quality: 0.75 })
    ])

    return {
      original,
      thumbnail,
      medium
    }
  } catch (error) {
    throw new Error(`Failed to create image variants: ${error.message}`)
  }
}

/**
 * Extract dominant colors from an image
 * @param {File} file - The image file
 * @returns {Promise<string[]>} - Array of dominant colors in hex format
 */
export const extractDominantColors = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Resize to small canvas for faster processing
      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(img, 0, 0, 50, 50)

      const imageData = ctx.getImageData(0, 0, 50, 50)
      const data = imageData.data
      const colorMap = new Map()

      // Sample colors
      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]

        if (alpha > 128) { // Only consider non-transparent pixels
          const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          colorMap.set(color, (colorMap.get(color) || 0) + 1)
        }
      }

      // Get top 5 colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color)

      resolve(sortedColors)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for color extraction'))
    }

    img.src = URL.createObjectURL(file)
  })
}
