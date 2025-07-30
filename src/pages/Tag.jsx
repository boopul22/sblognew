import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTagBySlug, getPostsByTag } from '../lib/staticData'
import PostCard from '../components/PostCard'

const Tag = ({ searchQuery }) => {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [tag, setTag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchTagPosts()
    }
  }, [slug, searchQuery])

  const fetchTagPosts = async () => {
    try {
      setLoading(true)

      // Get tag from static data
      const tagData = await getTagBySlug(slug)

      if (!tagData) {
        throw new Error('Tag not found')
      }

      setTag(tagData)

      // Get posts with this tag
      const tagPosts = await getPostsByTag(tagData.id, searchQuery)
      setPosts(tagPosts)
    } catch (err) {
      console.error('Error fetching tag posts:', err)
      setError('Failed to load tag posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="main-grid">
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-grid">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="main-grid">
        <div className="loading">
          {searchQuery 
            ? `No posts found with tag "${tag?.name}" for "${searchQuery}"` 
            : `No posts found with tag "${tag?.name}"`
          }
        </div>
      </div>
    )
  }

  return (
    <>
      {tag && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          padding: '20px',
          background: 'white',
          border: '1px solid #f0f0f0'
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '10px'
          }}>
            #{tag.name}
          </h1>
          {tag.description && (
            <p style={{ color: '#666', fontSize: '16px' }}>
              {tag.description}
            </p>
          )}
          <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      )}
      
      <div className="main-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}

export default Tag
