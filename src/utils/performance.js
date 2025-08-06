// Performance monitoring and Core Web Vitals tracking

// Web Vitals metrics tracking
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
    this.init()
  }

  init() {
    // Track Core Web Vitals
    this.trackLCP()
    this.trackFID()
    this.trackCLS()
    this.trackFCP()
    this.trackTTFB()
    
    // Track custom metrics
    this.trackNavigationTiming()
    this.trackResourceTiming()
  }

  // Largest Contentful Paint
  trackLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        this.metrics.lcp = {
          value: lastEntry.startTime,
          element: lastEntry.element,
          timestamp: Date.now()
        }
        
        this.reportMetric('LCP', lastEntry.startTime)
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    }
  }

  // First Input Delay
  trackFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now()
          }
          
          this.reportMetric('FID', entry.processingStart - entry.startTime)
        })
      })
      
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    }
  }

  // Cumulative Layout Shift
  trackCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        this.metrics.cls = {
          value: clsValue,
          timestamp: Date.now()
        }
        
        this.reportMetric('CLS', clsValue)
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    }
  }

  // First Contentful Paint
  trackFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = {
              value: entry.startTime,
              timestamp: Date.now()
            }
            
            this.reportMetric('FCP', entry.startTime)
          }
        })
      })
      
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    }
  }

  // Time to First Byte
  trackTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation')
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0]
        const ttfb = entry.responseStart - entry.requestStart
        
        this.metrics.ttfb = {
          value: ttfb,
          timestamp: Date.now()
        }
        
        this.reportMetric('TTFB', ttfb)
      }
    }
  }

  // Navigation timing
  trackNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation')
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0]
        
        this.metrics.navigation = {
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          domInteractive: entry.domInteractive - entry.navigationStart,
          timestamp: Date.now()
        }
      }
    }
  }

  // Resource timing
  trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.initiatorType === 'img') {
            this.trackImageLoad(entry)
          }
        })
      })
      
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    }
  }

  // Track image loading performance
  trackImageLoad(entry) {
    const loadTime = entry.responseEnd - entry.startTime
    
    if (!this.metrics.images) {
      this.metrics.images = []
    }
    
    this.metrics.images.push({
      url: entry.name,
      loadTime: loadTime,
      size: entry.transferSize,
      timestamp: Date.now()
    })
    
    // Report slow loading images
    if (loadTime > 1000) {
      console.warn(`Slow image load: ${entry.name} took ${loadTime}ms`)
    }
  }

  // Report metric to console and analytics
  reportMetric(name, value) {
    console.log(`${name}: ${Math.round(value)}ms`)
    
    // Send to analytics service if configured
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      })
    }
  }

  // Get all metrics
  getMetrics() {
    return this.metrics
  }

  // Get performance score
  getPerformanceScore() {
    const { lcp, fid, cls, fcp } = this.metrics
    let score = 100
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (lcp) {
      if (lcp.value > 4000) score -= 30
      else if (lcp.value > 2500) score -= 15
    }
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (fid) {
      if (fid.value > 300) score -= 25
      else if (fid.value > 100) score -= 10
    }
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls) {
      if (cls.value > 0.25) score -= 25
      else if (cls.value > 0.1) score -= 10
    }
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (fcp) {
      if (fcp.value > 3000) score -= 20
      else if (fcp.value > 1800) score -= 10
    }
    
    return Math.max(0, score)
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Preload critical resources
  preloadResource(href, as, crossorigin = false) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossorigin) link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  },

  // Prefetch resources for next navigation
  prefetchResource(href) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  },

  // Measure function execution time
  measureFunction(fn, name) {
    return function(...args) {
      const start = performance.now()
      const result = fn.apply(this, args)
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    }
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Get connection information
  getConnectionInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      }
    }
    return null
  }
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    const monitor = new PerformanceMonitor()

    // Report performance metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const score = monitor.getPerformanceScore()
        const metrics = monitor.getMetrics()

        // Enhanced logging with structured data
        console.group('🚀 Performance Report')
        console.log(`Performance Score: ${score}/100`)
        console.log('Core Web Vitals:', {
          LCP: metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'Not measured',
          FID: metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'Not measured',
          CLS: metrics.cls ? metrics.cls.toFixed(4) : 'Not measured'
        })
        console.log('Navigation Timing:', metrics.navigation)
        console.log('Resource Performance:', metrics.resources?.slice(0, 5)) // Show first 5 resources
        console.groupEnd()

        // Send to analytics if available
        if (window.gtag) {
          window.gtag('event', 'performance_score', {
            custom_parameter: score,
            lcp: metrics.lcp,
            fid: metrics.fid,
            cls: metrics.cls
          })
        }

        // Store in sessionStorage for debugging
        sessionStorage.setItem('performance-report', JSON.stringify({
          score,
          metrics,
          timestamp: Date.now(),
          url: window.location.href
        }))
      }, 5000) // Wait 5 seconds for all metrics to be collected
    })

    return monitor
  }
  return null
}
