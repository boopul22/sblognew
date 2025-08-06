import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentName: string
  timestamp: number
}

export function usePerformanceMonitor(componentName: string, enabled = false) {
  const renderStartTime = useRef<number>()
  const renderCount = useRef(0)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    renderStartTime.current = performance.now()
    renderCount.current += 1

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current
        
        // Log slow renders
        if (renderTime > 16) { // More than one frame at 60fps
          console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
        }

        // Report metrics in development
        if (import.meta.env.DEV) {
          const metrics: PerformanceMetrics = {
            renderTime,
            componentName,
            timestamp: Date.now(),
          }
          
          // Store in session storage for debugging
          const existingMetrics = JSON.parse(
            sessionStorage.getItem('performance-metrics') || '[]'
          )
          existingMetrics.push(metrics)
          
          // Keep only last 100 metrics
          if (existingMetrics.length > 100) {
            existingMetrics.splice(0, existingMetrics.length - 100)
          }
          
          sessionStorage.setItem('performance-metrics', JSON.stringify(existingMetrics))
        }
      }
    }
  })

  return {
    renderCount: renderCount.current,
  }
}

// Hook for measuring async operations
export function useAsyncPerformanceMonitor() {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const duration = performance.now() - startTime
      
      if (import.meta.env.DEV) {
        console.log(`${operationName} completed in ${duration.toFixed(2)}ms`)
        
        // Log slow operations
        if (duration > 1000) {
          console.warn(`Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`)
        }
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  return { measureAsync }
}

// Hook for Core Web Vitals monitoring
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure Largest Contentful Paint (LCP)
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          if (lastEntry && import.meta.env.DEV) {
            console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
          }
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        return observer
      }
    }

    // Measure First Input Delay (FID)
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (import.meta.env.DEV) {
              console.log(`FID: ${entry.processingStart - entry.startTime}ms`)
            }
          })
        })
        
        observer.observe({ entryTypes: ['first-input'] })
        return observer
      }
    }

    // Measure Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0
        
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          
          if (import.meta.env.DEV) {
            console.log(`CLS: ${clsValue.toFixed(4)}`)
          }
        })
        
        observer.observe({ entryTypes: ['layout-shift'] })
        return observer
      }
    }

    const observers = [observeLCP(), observeFID(), observeCLS()].filter(Boolean)

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])
}

// Utility to get performance metrics
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  if (!navigation) return null

  return {
    // Page load metrics
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Network metrics
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    
    // Rendering metrics
    domProcessing: navigation.domComplete - navigation.domLoading,
    
    // Total time
    totalTime: navigation.loadEventEnd - navigation.navigationStart,
  }
}
