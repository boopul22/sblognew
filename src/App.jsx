import { useState, Suspense, lazy, useCallback, memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import SkeletonLoader from './components/SkeletonLoader'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const SinglePost = lazy(() => import('./pages/SinglePost'))
const Authors = lazy(() => import('./pages/Authors'))
const Author = lazy(() => import('./pages/Author'))
const Category = lazy(() => import('./pages/Category'))
const Tag = lazy(() => import('./pages/Tag'))

// Admin components
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const CreatePost = lazy(() => import('./pages/admin/CreatePost'))
const EditPost = lazy(() => import('./pages/admin/EditPost'))
const PostsList = lazy(() => import('./pages/admin/PostsList'))

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
    <Router>
      <div className="container">
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
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="posts" element={<PostsList />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:id" element={<EditPost />} />
            </Route>
            {/* Catch-all route for individual posts - must be last */}
            <Route
              path="/:slug"
              element={<SinglePost />}
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
  )
})

App.displayName = 'App'

export default App
