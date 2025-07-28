import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SinglePost from './pages/SinglePost'
import Authors from './pages/Authors'
import Author from './pages/Author'
import Category from './pages/Category'
import Tag from './pages/Tag'

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
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
