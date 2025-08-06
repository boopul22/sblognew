import React, { Suspense, lazy, useCallback, memo, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary, RouteErrorBoundary } from './components/ErrorBoundary'
import { DefaultSkipLinks } from './components/accessible/SkipLink'
import { DevToolbar, DevInfo } from './components/dev/DevToolbar'
import { HomeSEO } from './components/SEOHead'
import Header from './components/Header'
import Footer from './components/Footer'
import SkeletonLoader from './components/SkeletonLoader'
import { useOptimizedState } from './hooks/useOptimizedState'
import { useWebVitals } from './hooks/usePerformanceMonitor'
import { setupGlobalErrorHandling } from './lib/error-handling'
import { initPerformanceMonitoring } from './utils/performance'
import { logger } from './lib/logger'
import { isDev } from './lib/env'

// Lazy load page components for optimal code splitting
const Home = lazy(() => import('./features/homepage/pages/Home'))
const PostPageWrapper = lazy(() => import('./features/posts/pages/PostPageWrapper'))
const Authors = lazy(() => import('./features/browse/pages/Authors'))
const Author = lazy(() => import('./features/browse/pages/Author'))
const Category = lazy(() => import('./features/browse/pages/Category'))
const Tag = lazy(() => import('./features/browse/pages/Tag'))

// Admin components with separate chunk
const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const PostsList = lazy(() => import('./pages/admin/PostsList'))
const CreatePost = lazy(() => import('./pages/admin/CreatePost'))
const EditPost = lazy(() => import('./pages/admin/EditPost'))
const StorageSettings = lazy(() => import('./pages/admin/StorageSettings'))

// Protected route component
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))

// Optimized loading component
const OptimizedSuspense = memo(({ children, fallback }: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) => (
  <Suspense fallback={fallback || <SkeletonLoader type="post" count={3} />}>
    {children}
  </Suspense>
))

OptimizedSuspense.displayName = 'OptimizedSuspense'

// Main App component
const App = memo(() => {
  const [searchQuery, setSearchQuery] = useOptimizedState('')

  // Initialize monitoring and error handling
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling()
    
    // Initialize performance monitoring
    const monitor = initPerformanceMonitoring()
    
    // Log app initialization
    logger.info('Application initialized', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isDev,
    })

    return () => {
      monitor?.disconnect?.()
    }
  }, [])

  // Monitor Core Web Vitals
  useWebVitals()

  // Optimized search handler
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    
    // Log search interactions in development
    if (isDev && query.length > 2) {
      logger.debug('Search query changed', { query: query.slice(0, 50) })
    }
  }, [setSearchQuery])

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          {/* Skip links for accessibility */}
          <DefaultSkipLinks />
          
          {/* SEO for home page */}
          <HomeSEO />
          
          <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header with search */}
            <Header 
              searchQuery={searchQuery} 
              onSearchChange={handleSearchChange}
            />
            
            {/* Main content area */}
            <main id="main-content" className="flex-1">
              <RouteErrorBoundary>
                <OptimizedSuspense>
                  <Routes>
                    {/* Public routes */}
                    <Route
                      path="/"
                      element={<Home searchQuery={searchQuery} />}
                    />
                    <Route
                      path="/authors"
                      element={<Authors searchQuery={searchQuery} />}
                    />
                    <Route
                      path="/author/:username"
                      element={<Author searchQuery={searchQuery} />}
                    />
                    <Route
                      path="/category/:slug"
                      element={<Category searchQuery={searchQuery} />}
                    />
                    <Route
                      path="/tag/:slug"
                      element={<Tag searchQuery={searchQuery} />}
                    />
                    
                    {/* Post routes */}
                    <Route
                      path="/post/:slug"
                      element={<PostPageWrapper />}
                    />
                    
                    {/* Admin routes */}
                    <Route 
                      path="/admin/login" 
                      element={
                        <OptimizedSuspense fallback={<div>Loading...</div>}>
                          <Login />
                        </OptimizedSuspense>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <OptimizedSuspense>
                          <ProtectedRoute>
                            <AdminLayout />
                          </ProtectedRoute>
                        </OptimizedSuspense>
                      }
                    >
                      <Route 
                        path="posts" 
                        element={
                          <OptimizedSuspense>
                            <PostsList />
                          </OptimizedSuspense>
                        } 
                      />
                      <Route 
                        path="create" 
                        element={
                          <OptimizedSuspense>
                            <CreatePost />
                          </OptimizedSuspense>
                        } 
                      />
                      <Route 
                        path="edit/:id" 
                        element={
                          <OptimizedSuspense>
                            <EditPost />
                          </OptimizedSuspense>
                        } 
                      />
                      <Route 
                        path="storage-settings" 
                        element={
                          <OptimizedSuspense>
                            <StorageSettings />
                          </OptimizedSuspense>
                        } 
                      />
                    </Route>
                    
                    {/* Catch-all route for individual posts */}
                    <Route
                      path="/:slug"
                      element={<PostPageWrapper />}
                    />
                  </Routes>
                </OptimizedSuspense>
              </RouteErrorBoundary>
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
              error: {
                duration: 6000,
              },
            }}
          />
          
          {/* Development tools */}
          {isDev && (
            <>
              <DevToolbar />
              <DevInfo />
            </>
          )}
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
})

App.displayName = 'App'

export default App
