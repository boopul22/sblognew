import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PostCard from '../components/PostCard'

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

      // First, get the category info
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug, description')
        .eq('slug', slug)
        .single()

      if (categoryError) throw categoryError
      setCategory(categoryData)

      // Then get posts in this category using a more efficient approach
      const { data: postCategoryData, error: postsError } = await supabase
        .from('post_categories')
        .select(`
          posts (
            id,
            title,
            slug,
            content,
            excerpt,
            author_id,
            published_at
          )
        `)
        .eq('category_id', categoryData.id)

      if (postsError) throw postsError

      // Extract and filter posts
      let categoryPosts = postCategoryData
        ?.map(pc => pc.posts)
        .filter(post => post) || []

      // Apply search filter if searchQuery exists
      if (searchQuery && searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase()
        categoryPosts = categoryPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.content && post.content.toLowerCase().includes(searchLower))
        )
      }

      // Sort by published date
      categoryPosts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

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
