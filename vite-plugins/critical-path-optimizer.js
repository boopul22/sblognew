/**
 * Vite Plugin: Critical Path Optimizer
 * Automatically injects resource preloading to reduce critical request chains
 */

export function criticalPathOptimizer() {
  return {
    name: 'critical-path-optimizer',
    apply: 'build',
    generateBundle(options, bundle) {
      // Find the main HTML file
      const htmlFile = Object.keys(bundle).find(fileName => fileName.endsWith('.html'))
      if (!htmlFile) return

      const htmlBundle = bundle[htmlFile]
      let html = htmlBundle.source

      // Extract critical resources from the bundle
      const criticalResources = []
      
      // Find CSS files
      const cssFiles = Object.keys(bundle).filter(fileName => 
        fileName.includes('assets/css/') && fileName.endsWith('.css')
      )
      
      // Find critical JS files (main entry and React vendor)
      const jsFiles = Object.keys(bundle).filter(fileName => 
        fileName.includes('assets/js/') && 
        (fileName.includes('index-') || fileName.includes('react-vendor-'))
      )

      // Add CSS preloads
      cssFiles.forEach(fileName => {
        criticalResources.push(
          `<link rel="preload" href="/${fileName}" as="style" onload="this.onload=null;this.rel='stylesheet'">`
        )
        criticalResources.push(
          `<noscript><link rel="stylesheet" href="/${fileName}"></noscript>`
        )
      })

      // Add JS preloads for critical resources
      jsFiles.forEach(fileName => {
        criticalResources.push(
          `<link rel="preload" href="/${fileName}" as="script">`
        )
      })

      // Add resource hints for better performance
      const resourceHints = [
        '<!-- Critical resource preloading for faster LCP -->',
        ...criticalResources,
        '<!-- Prefetch non-critical resources -->',
        '<link rel="prefetch" href="/assets/js/components-DKpPwVyy.js">',
        '<link rel="prefetch" href="/assets/js/utils-G5iJCnJd.js">',
        ''
      ].join('\n    ')

      // Inject before the closing </head> tag
      html = html.replace(
        '</head>',
        `    ${resourceHints}\n  </head>`
      )

      // Update the bundle
      htmlBundle.source = html
    }
  }
}

/**
 * Service Worker Cache Strategy Optimizer
 * Optimizes caching for critical path resources
 */
export function serviceWorkerOptimizer() {
  return {
    name: 'service-worker-optimizer',
    apply: 'build',
    writeBundle(options, bundle) {
      // Generate optimized cache strategy
      const criticalResources = []
      const nonCriticalResources = []

      Object.keys(bundle).forEach(fileName => {
        if (fileName.includes('assets/css/') || 
            fileName.includes('index-') || 
            fileName.includes('react-vendor-')) {
          criticalResources.push(fileName)
        } else if (fileName.includes('assets/js/')) {
          nonCriticalResources.push(fileName)
        }
      })

      // Create cache configuration
      const cacheConfig = {
        critical: criticalResources,
        nonCritical: nonCriticalResources,
        strategy: {
          critical: 'CacheFirst', // Cache critical resources aggressively
          nonCritical: 'StaleWhileRevalidate' // Update non-critical in background
        }
      }

      console.log('🚀 Critical Path Optimization:')
      console.log(`   Critical resources: ${criticalResources.length}`)
      console.log(`   Non-critical resources: ${nonCriticalResources.length}`)
    }
  }
}
