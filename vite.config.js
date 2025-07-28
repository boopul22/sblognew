import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { criticalPathOptimizer, serviceWorkerOptimizer } from './vite-plugins/critical-path-optimizer.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    criticalPathOptimizer(),
    serviceWorkerOptimizer()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild',
    target: 'es2015', // Better browser support
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and reduced unused code
        manualChunks: (id) => {
          // Vendor chunks - split by usage patterns
          if (id.includes('node_modules')) {
            // React core - always needed
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }

            // Router - only loaded when navigating
            if (id.includes('react-router-dom')) {
              return 'router-vendor'
            }

            // Supabase - split into smaller chunks based on usage
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase-vendor'
            }

            // Other vendor libraries
            return 'vendor'
          }

          // Page-specific chunks - each page gets its own chunk
          if (id.includes('/pages/Home.jsx')) {
            return 'page-home'
          }
          if (id.includes('/pages/SinglePost.jsx')) {
            return 'page-post'
          }
          if (id.includes('/pages/Authors.jsx')) {
            return 'page-authors'
          }
          if (id.includes('/pages/Author.jsx')) {
            return 'page-author'
          }
          if (id.includes('/pages/Category.jsx')) {
            return 'page-category'
          }
          if (id.includes('/pages/Tag.jsx')) {
            return 'page-tag'
          }

          // Component chunks - group related components
          if (id.includes('/components/')) {
            return 'components'
          }

          // Utils and lib chunks
          if (id.includes('/lib/') || id.includes('/utils/')) {
            return 'utils'
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Performance budgets
    chunkSizeWarningLimit: 500, // Warn if chunks exceed 500KB
    // Additional build optimizations
    reportCompressedSize: true,
    cssMinify: true
  },
  base: '/',
  // Ensure public files are copied
  publicDir: 'public',
  // Optimize dependencies and enable aggressive tree shaking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: ['@supabase/auth-js', '@supabase/realtime-js'] // Exclude unused Supabase modules
  },
  // Enable aggressive tree shaking
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console logs and debugger statements
    pure: ['console.log', 'console.warn'] // Mark as pure functions for tree shaking
  }
})
