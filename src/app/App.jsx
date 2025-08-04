import { useState, Suspense, lazy, useCallback, memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../shared/contexts/AuthContext'
import Header from '../shared/components/layout/Header'
import Footer from '../shared/components/layout/Footer'
import SkeletonLoader from '../shared/components/ui/SkeletonLoader'

// Lazy load page components for code splitting
const Home = lazy(() => import('../features/homepage/pages/Home'))
const PostPageWrapper = lazy(() => import('../features/posts/pages/PostPageWrapper'))
const Authors = lazy(() => import('../features/browse/pages/Authors'))
const Author = lazy(() => import('../features/browse/pages/Author'))
const Category = lazy(() => import('../features/browse/pages/Category'))
const Tag = lazy(() => import('../features/browse/pages/Tag'))

// Admin components
const AdminLayout = lazy(() => import('../features/admin/pages/AdminLayout'))
const CreatePost = lazy(() => import('../features/admin/pages/CreatePost'))
const EditPost = lazy(() => import('../features/admin/pages/EditPost'))
const PostsList = lazy(() => import('../features/admin/pages/PostsList'))
const StorageSettings = lazy(() => import('../features/admin/pages/StorageSettings'))
const Login = lazy(() => import('../features/admin/components/Login'))
const ProtectedRoute = lazy(() => import('../features/admin/components/ProtectedRoute'))

// Loading component
const PageLoader = () => (
  <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>
    <div className="spinner"></div>
    Loading...
  </div>
)

const App = memo(() => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleSetSearchQuery = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Header
            onSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={handleSetSearchQuery}
          />

          <Suspense fallback={<SkeletonLoader type="post" count={3} />}>
            <Routes>
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
            {/* Enhanced post page route */}
            <Route
              path="/post/:slug"
              element={<PostPageWrapper />}
            />
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="posts" element={<PostsList />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:id" element={<EditPost />} />
              <Route path="storage-settings" element={<StorageSettings />} />
            </Route>
            {/* Catch-all route for individual posts - must be last */}
            <Route
              path="/:slug"
              element={<PostPageWrapper />}
            />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>
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
        }}
      />
      </Router>
    </AuthProvider>
  )
})

App.displayName = 'App'

export default App
