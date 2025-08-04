import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCategoryBySlug, getPostsByCategory } from '../../../lib/api/staticData'
import PostCard from '../../homepage/components/PostCard'

const Category = ({ searchQuery }) => {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchCategoryPosts()
    }
  }, [slug, searchQuery])

  const fetchCategoryPosts = async () => {
    try {
      setLoading(true)

      // Get category from static data
      const categoryData = await getCategoryBySlug(slug)

      if (!categoryData) {
        throw new Error('Category not found')
      }

      setCategory(categoryData)

      // Get posts in this category
      const categoryPosts = await getPostsByCategory(categoryData.id, searchQuery)
      setPosts(categoryPosts)
    } catch (err) {
      console.error('Error fetching category posts:', err)
      setError('Failed to load category posts')
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
            ? `No posts found in "${category?.name}" for "${searchQuery}"` 
            : `No posts found in "${category?.name}"`
          }
        </div>
      </div>
    )
  }

  return (
    <>
      {category && (
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
            {category.name}
          </h1>
          {category.description && (
            <p style={{ color: '#666', fontSize: '16px' }}>
              {category.description}
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

export default Category
