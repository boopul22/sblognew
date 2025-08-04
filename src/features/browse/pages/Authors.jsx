import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllAuthors } from '../../../lib/api/staticData'

const Authors = ({ searchQuery }) => {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAuthors()
  }, [searchQuery])

  const fetchAuthors = async () => {
    try {
      setLoading(true)

      // Get authors from static data
      let allAuthors = await getAllAuthors()

      // Apply search filter if searchQuery exists
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        allAuthors = allAuthors.filter(author =>
          author.display_name.toLowerCase().includes(query) ||
          author.username.toLowerCase().includes(query)
        )
      }

      // Sort by post count (descending)
      allAuthors.sort((a, b) => (b.post_count || 0) - (a.post_count || 0))

      setAuthors(allAuthors)
    } catch (err) {
      console.error('Error fetching authors:', err)
      setError('Failed to load authors')
    } finally {
      setLoading(false)
    }
  }



  const getAuthorInitials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="author-grid">
        <div className="loading">Loading authors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="author-grid">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (authors.length === 0) {
    return (
      <div className="author-grid">
        <div className="loading">
          {searchQuery ? `No authors found for "${searchQuery}"` : 'No authors available'}
        </div>
      </div>
    )
  }

  return (
    <div className="author-grid">
      {authors.map((author) => (
        <Link 
          key={author.id} 
          to={`/author/${author.username}`}
          className="author-card"
        >
          <div className="author-avatar">
            {getAuthorInitials(author.display_name)}
          </div>
          <div className="author-name">{author.display_name}</div>
          <div className="author-count">
            {author.post_count} {author.post_count === 1 ? 'post' : 'posts'}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Authors
