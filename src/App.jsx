import { useState, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const SinglePost = lazy(() => import('./pages/SinglePost'))
const Authors = lazy(() => import('./pages/Authors'))
const Author = lazy(() => import('./pages/Author'))
const Category = lazy(() => import('./pages/Category'))
const Tag = lazy(() => import('./pages/Tag'))

// Loading component
const PageLoader = () => (
  <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>
    <div className="spinner"></div>
    Loading...
  </div>
)

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <Router>
      <div className="container">
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <Suspense fallback={<PageLoader />}>
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
            {/* Catch-all route for individual posts - must be last */}
            <Route
              path="/:slug"
              element={<SinglePost />}
            />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
