import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PostCard from '../components/PostCard'

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
      
      // First, get the author info
      const { data: authorData, error: authorError } = await supabase
        .from('users')
        .select('*')
        .eq('user_login', username)
        .single()

      if (authorError) throw authorError
      setAuthor(authorData)

      // Then get posts by this author
      let query = supabase
        .from('posts')
        .select('*')
        .eq('author_id', authorData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      // Apply search filter if searchQuery exists
      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      const { data: postsData, error: postsError } = await query

      if (postsError) throw postsError

      setPosts(postsData || [])
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
