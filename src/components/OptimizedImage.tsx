import React, { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver>()

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [priority, isInView])

  // Generate responsive image URLs
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('cloudflare') && !baseSrc.includes('supabase')) {
      return undefined
    }

    // For Cloudflare R2 or Supabase, we can add resize parameters
    const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    return sizes
      .map((size) => {
        // This would need to be adapted based on your image service
        const resizedUrl = baseSrc.includes('?') 
          ? `${baseSrc}&w=${size}` 
          : `${baseSrc}?w=${size}`
        return `${resizedUrl} ${size}w`
      })
      .join(', ')
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      if (sizes) link.setAttribute('imagesizes', sizes)
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [priority, src, sizes])

  // Placeholder component
  const Placeholder = () => (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ width, height }}
      aria-label="Loading image..."
    >
      {placeholder === 'blur' && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="w-full h-full object-cover filter blur-sm"
          aria-hidden="true"
        />
      )}
    </div>
  )

  // Error fallback
  const ErrorFallback = () => (
    <div
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )

  if (hasError) {
    return <ErrorFallback />
  }

  if (!isInView) {
    return <Placeholder />
  }

  return (
    <div className="relative">
      {!isLoaded && <Placeholder />}
      <img
        ref={imgRef}
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  )
}

// Hook for image preloading
export function useImagePreloader() {
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }

  const preloadImages = async (sources: string[]): Promise<void> => {
    try {
      await Promise.all(sources.map(preloadImage))
    } catch (error) {
      console.warn('Failed to preload some images:', error)
    }
  }

  return { preloadImage, preloadImages }
}

// Component for critical images that should load immediately
export function CriticalImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority loading="eager" />
}

// Component for hero/above-the-fold images
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority
      loading="eager"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
