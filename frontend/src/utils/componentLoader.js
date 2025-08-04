/**
 * Lightweight component loader to reduce unused React code
 * Only loads React features that are actually used
 */

import React, { lazy } from 'react'

// Create a more efficient lazy loader that includes error boundaries
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = lazy(importFn)
  
  // Return a wrapper that handles loading states more efficiently
  return (props) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <LazyComponent {...props} />
      </ErrorBoundary>
    )
  }
}

// Lightweight error boundary for lazy components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <p>Something went wrong loading this component.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Optimized component preloader
export const preloadComponent = (importFn) => {
  // Only preload if the browser is idle and has good connection
  if (
    'requestIdleCallback' in window &&
    navigator.connection &&
    navigator.connection.effectiveType !== 'slow-2g'
  ) {
    requestIdleCallback(() => {
      importFn().catch(err => {
        console.warn('Component preload failed:', err)
      })
    })
  }
}

// Route-based component loader with intelligent preloading
export const createRouteComponent = (importFn, preloadCondition = null) => {
  const LazyComponent = lazy(importFn)
  
  // Preload based on user interaction patterns
  if (preloadCondition) {
    preloadCondition(() => preloadComponent(importFn))
  }
  
  return LazyComponent
}

// Intersection observer for component preloading
export const createIntersectionPreloader = (importFn, options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  return (element) => {
    if (!element || !('IntersectionObserver' in window)) return
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          preloadComponent(importFn)
          observer.unobserve(entry.target)
        }
      })
    }, defaultOptions)
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }
}

// Mouse hover preloader for better UX
export const createHoverPreloader = (importFn, delay = 100) => {
  let timeoutId = null
  
  return {
    onMouseEnter: () => {
      timeoutId = setTimeout(() => {
        preloadComponent(importFn)
      }, delay)
    },
    onMouseLeave: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }
}

// Bundle size analyzer helper
export const analyzeBundleUsage = () => {
  if (process.env.NODE_ENV === 'development') {
    // Track which React features are actually used
    const usedFeatures = new Set()
    
    // Hook into React internals (development only)
    const originalCreateElement = React.createElement
    React.createElement = function(...args) {
      usedFeatures.add(args[0])
      return originalCreateElement.apply(this, args)
    }
    
    // Log usage after a delay
    setTimeout(() => {
      console.log('React features used:', Array.from(usedFeatures))
    }, 5000)
  }
}
