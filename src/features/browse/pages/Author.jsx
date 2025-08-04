import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAuthorByUsername, getPostsByAuthor } from '../../../lib/api/staticData'
import PostCard from '../../homepage/components/PostCard'

const Author = ({ searchQuery }) => {
  const { username } = useParams()
  const [posts, setPosts] = useState([])
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (username) {
      fetchAuthorPosts()
    }
  }, [username, searchQuery])

  const fetchAuthorPosts = async () => {
    try {
      setLoading(true)

      // Get author from static data
      const authorData = await getAuthorByUsername(username)

      if (!authorData) {
        throw new Error('Author not found')
      }

      setAuthor(authorData)

      // Get posts by this author
      const authorPosts = await getPostsByAuthor(authorData.id, searchQuery)
      setPosts(authorPosts)
    } catch (err) {
      console.error('Error fetching author posts:', err)
      setError('Author not found')
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="main-grid">
        <div className="loading">Loading author...</div>
      </div>
    )
  }

  if (error || !author) {
    return (
      <div className="main-grid">
        <div className="error">{error || 'Author not found'}</div>
      </div>
    )
  }

  return (
    <>
      {author && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          padding: '40px 20px',
          background: 'white',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#ddd',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#666'
          }}>
            {getAuthorInitials(author.display_name)}
          </div>
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '10px'
          }}>
            {author.display_name}
          </h1>
          
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
            @{author.user_login}
          </p>
          
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '10px' }}>
            Member since {formatDate(author.user_registered)}
          </p>
          
          <p style={{ color: '#999', fontSize: '14px' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
          </p>
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="main-grid">
          <div className="loading">
            {searchQuery 
              ? `No posts found by ${author?.display_name} for "${searchQuery}"` 
              : `No posts found by ${author?.display_name}`
            }
          </div>
        </div>
      ) : (
        <div className="main-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

export default Author
