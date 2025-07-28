import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = ({ onSearch, searchQuery, setSearchQuery }) => {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  const getSearchPlaceholder = () => {
    if (location.pathname.startsWith('/authors')) return 'Search Authors...'
    return 'Search...'
  }

  return (
    <div className="header">
      <Link to="/" className="logo">
        SAYARI
      </Link>
      
      <nav className="nav">
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          All
        </Link>
        <Link 
          to="/category/shayari" 
          className={`nav-item ${isActive('/category/shayari') ? 'active' : ''}`}
        >
          Shayari
        </Link>
        <Link 
          to="/category/quotes" 
          className={`nav-item ${isActive('/category/quotes') ? 'active' : ''}`}
        >
          Quotes
        </Link>
        <Link 
          to="/category/wishes" 
          className={`nav-item ${isActive('/category/wishes') ? 'active' : ''}`}
        >
          Wishes
        </Link>
        <Link 
          to="/authors" 
          className={`nav-item ${isActive('/authors') ? 'active' : ''}`}
        >
          Authors
        </Link>
      </nav>
      
      <div className="search-container">
        <input
          type="text"
          className="search"
          placeholder={getSearchPlaceholder()}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}

export default Header
