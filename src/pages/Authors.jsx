import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

      // Use a more efficient query to get authors with post counts
      let query = `
        SELECT
          u.id, u.wp_id, u.user_login, u.display_name, u.user_registered,
          COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
      `

      // Apply search filter if searchQuery exists
      if (searchQuery && searchQuery.trim()) {
        query += ` WHERE u.display_name ILIKE '%${searchQuery}%'`
      }

      query += `
        GROUP BY u.id, u.wp_id, u.user_login, u.display_name, u.user_registered
        HAVING COUNT(p.id) > 0
        ORDER BY COUNT(p.id) DESC
      `

      const { data, error } = await supabase.rpc('execute_sql', { query })

      if (error) {
        // Fallback to the original method if RPC fails
        console.warn('RPC query failed, using fallback method:', error)
        return await fetchAuthorsFallback()
      }

      // Transform the data
      const authors = data?.map(author => ({
        id: author.id,
        wp_id: author.wp_id,
        user_login: author.user_login,
        display_name: author.display_name,
        user_registered: author.user_registered,
        postCount: parseInt(author.post_count) || 0
      })) || []

      setAuthors(authors)
    } catch (err) {
      console.error('Error fetching authors:', err)
      // Try fallback method
      await fetchAuthorsFallback()
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthorsFallback = async () => {
    try {
      // Simplified approach: get users who have published posts
      const { data: postsWithAuthors, error } = await supabase
        .from('posts')
        .select(`
          author_id,
          users!posts_author_id_fkey (
            id,
            wp_id,
            user_login,
            display_name,
            user_registered
          )
        `)
        .eq('status', 'published')

      if (error) throw error

      // Group by author and count posts
      const authorMap = new Map()

      postsWithAuthors?.forEach(post => {
        const author = post.users
        if (author) {
          const key = author.id
          if (authorMap.has(key)) {
            authorMap.get(key).postCount++
          } else {
            authorMap.set(key, {
              ...author,
              postCount: 1
            })
          }
        }
      })

      let authors = Array.from(authorMap.values())

      // Apply search filter if searchQuery exists
      if (searchQuery && searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase()
        authors = authors.filter(author =>
          author.display_name.toLowerCase().includes(searchLower)
        )
      }

      // Sort by post count
      authors.sort((a, b) => b.postCount - a.postCount)

      setAuthors(authors)
    } catch (err) {
      console.error('Error in fallback method:', err)
      setError('Failed to load authors')
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
          to={`/author/${author.user_login}`} 
          className="author-card"
        >
          <div className="author-avatar">
            {getAuthorInitials(author.display_name)}
          </div>
          <div className="author-name">{author.display_name}</div>
          <div className="author-count">
            {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Authors
