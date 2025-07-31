import { useState, useRef, useEffect, memo } from 'react'
import { getCurrentProviderName } from '../lib/storage'

const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  lazy = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio = null // New prop for aspect ratio
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
      observerRef.current = observer
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazy, priority, isInView])

  // Generate optimized image URLs based on storage provider
  const getOptimizedImageUrl = (originalUrl, targetWidth, quality = 80) => {
    if (!originalUrl) return null

    const currentProvider = getCurrentProviderName()

    // Handle Supabase storage URLs
    if (currentProvider === 'supabase' && originalUrl.includes('supabase.co/storage/v1/object/public/')) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('width', targetWidth.toString())
        url.searchParams.set('quality', quality.toString())
        url.searchParams.set('format', 'webp')
        return url.toString()
      } catch (error) {
        console.warn('Failed to optimize Supabase image URL:', error)
        return originalUrl
      }
    }

    // Handle Cloudflare R2 URLs (R2 doesn't have built-in image optimization)
    if (currentProvider === 'cloudflare-r2') {
      // For R2, we return the original URL as-is since R2 doesn't have built-in optimization
      // In production, you might want to use Cloudflare Images or another optimization service
      return originalUrl
    }

    // For other URLs or unknown providers, return as-is
    return originalUrl
  }

  // Generate WebP version of image based on storage provider
  const getWebPUrl = (originalUrl) => {
    if (!originalUrl) return null

    const currentProvider = getCurrentProviderName()

    // For Supabase storage URLs, use format parameter
    if (currentProvider === 'supabase' && originalUrl.includes('supabase.co/storage/v1/object/public/')) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('format', 'webp')
        return url.toString()
      } catch (error) {
        console.warn('Failed to generate WebP URL:', error)
        return originalUrl
      }
    }

    // For Cloudflare R2 or other providers, return as-is
    // (browser will handle format negotiation or you can implement custom logic)
    return originalUrl
  }

  // Generate srcSet for responsive images
  const generateSrcSet = (src, format = 'original') => {
    if (!src) return ''

    const widths = [320, 480, 640, 768, 1024, 1280, 1920]
    const relevantWidths = widths.filter(w => !width || w <= width * 2)

    return relevantWidths
      .map(w => {
        let optimizedUrl = getOptimizedImageUrl(src, w)
        if (format === 'webp') {
          // For Supabase URLs, add webp format parameter
          if (optimizedUrl.includes('supabase.co/storage/v1/object/public/')) {
            try {
              const url = new URL(optimizedUrl)
              url.searchParams.set('format', 'webp')
              optimizedUrl = url.toString()
            } catch (error) {
              console.warn('Failed to create WebP URL:', error)
            }
          } else {
            // For other URLs, try to replace extension
            optimizedUrl = optimizedUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')
          }
        }
        return `${optimizedUrl} ${w}w`
      })
      .join(', ')
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  // Placeholder while loading
  const placeholder = (
    <div 
      className={`image-placeholder ${className}`}
      style={{
        ...style,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px'
      }}
      ref={imgRef}
    >
      {error ? 'Failed to load' : 'Loading...'}
    </div>
  )

  // Don't render image until it's in view (for lazy loading)
  if (!isInView) {
    return placeholder
  }

  // If there's an error, show placeholder
  if (error) {
    return placeholder
  }

  return (
    <div className={`optimized-image-container ${className}`} style={style} ref={imgRef}>
      <picture>
        {/* WebP source for modern browsers */}
        <source
          srcSet={generateSrcSet(src, 'webp')}
          sizes={sizes}
          type="image/webp"
        />
        {/* Fallback for older browsers */}
        <img
          src={getOptimizedImageUrl(src, width)}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0,
            display: 'block'
          }}
        />
      </picture>
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}
        >
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  return (
    prevProps.src === nextProps.src &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.lazy === nextProps.lazy &&
    prevProps.priority === nextProps.priority
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
