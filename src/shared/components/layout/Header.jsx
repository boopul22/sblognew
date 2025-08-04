import { useState, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { debounce } from '../../../utils/contentUtils'

const Header = memo(({ onSearch, searchQuery, setSearchQuery }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  // Debounced search for better performance
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (onSearch) {
        onSearch(query)
      }
    }, 300),
    [onSearch]
  )

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const getSearchPlaceholder = () => {
    if (location.pathname.startsWith('/authors')) return 'Search Authors...'
    return 'Search...'
  }

  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="logo">
            <Link to="/" className="logo-text">
              शायरी ब्लॉग
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <ul className="nav-list">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/category/shayari"
                  className={`nav-link ${isActive('/category/shayari') ? 'active' : ''}`}
                >
                  श्रेणियाँ
                </Link>
              </li>
              <li>
                <Link
                  to="/authors"
                  className={`nav-link ${isActive('/authors') ? 'active' : ''}`}
                >
                  लेखक
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                >
                  हमारे बारे में
                </Link>
              </li>
            </ul>
          </nav>

          {/* Search and Language Toggle */}
          <div className="header-actions flex items-center gap-16">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="शायरी खोजें..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
                spellCheck="false"
              />
              <button className="search-btn">🔍</button>
            </div>
            <button className="lang-toggle btn btn--outline btn--sm">हिंदी/En</button>
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
