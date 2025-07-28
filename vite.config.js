import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild',
    target: 'es2015', // Better browser support
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],

          // Page chunks
          'pages': [
            './src/pages/Home.jsx',
            './src/pages/SinglePost.jsx',
            './src/pages/Author.jsx',
            './src/pages/Authors.jsx',
            './src/pages/Category.jsx',
            './src/pages/Tag.jsx'
          ]
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
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
  }
})
