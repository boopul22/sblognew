import { useState, useRef, useEffect } from 'react'

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  style = {},
  lazy = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
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

  // Generate optimized image URLs for Supabase storage
  const getOptimizedImageUrl = (originalUrl, width, quality = 80) => {
    if (!originalUrl) return null
    
    // Check if it's a Supabase storage URL
    if (originalUrl.includes('supabase.co/storage/v1/object/public/')) {
      // For Supabase, we can add transformation parameters
      const url = new URL(originalUrl)
      url.searchParams.set('width', width)
      url.searchParams.set('quality', quality)
      url.searchParams.set('format', 'webp')
      return url.toString()
    }
    
    return originalUrl
  }

  // Generate srcSet for responsive images
  const generateSrcSet = (src) => {
    if (!src) return ''
    
    const widths = [320, 640, 768, 1024, 1280, 1920]
    return widths
      .map(w => `${getOptimizedImageUrl(src, w)} ${w}w`)
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
      <img
        src={getOptimizedImageUrl(src, width)}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0
        }}
      />
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
          Loading...
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
