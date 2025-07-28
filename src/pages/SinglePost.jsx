import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PostCard from '../components/PostCard'

const SinglePost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)

      // Fetch the main post with minimal fields first
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('id, title, slug, content, author_id, published_at, status')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (postError) throw postError

      setPost(postData)

      // Fetch all related data in parallel
      const [relatedResult, categoryResult, tagResult] = await Promise.all([
        // Fetch related posts (excluding current post)
        supabase
          .from('posts')
          .select('id, title, slug, published_at')
          .eq('status', 'published')
          .neq('id', postData.id)
          .order('published_at', { ascending: false })
          .limit(3),

        // Fetch categories for this post
        supabase
          .from('post_categories')
          .select(`
            categories (
              id,
              name,
              slug
            )
          `)
          .eq('post_id', postData.id),

        // Fetch tags for this post
        supabase
          .from('post_tags')
          .select(`
            tags (
              id,
              name,
              slug
            )
          `)
          .eq('post_id', postData.id)
      ])

      setRelatedPosts(relatedResult.data || [])
      setCategories(categoryResult.data?.map(pc => pc.categories) || [])
      setTags(tagResult.data?.map(pt => pt.tags) || [])

    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Post not found')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    // Remove WordPress block comments but keep the content
    let formatted = content.replace(/<!-- wp:.*? -->/g, '')
    formatted = formatted.replace(/<!-- \/wp:.*? -->/g, '')
    
    // Convert basic HTML to readable format
    formatted = formatted.replace(/<p>/g, '\n\n')
    formatted = formatted.replace(/<\/p>/g, '')
    formatted = formatted.replace(/<br\s*\/?>/g, '\n')
    formatted = formatted.replace(/<[^>]*>/g, '')
    
    // Decode HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = formatted
    formatted = textarea.value
    
    return formatted.trim()
  }

  if (loading) {
    return (
      <div className="single-poem-grid">
        <div className="loading">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="single-poem-grid">
        <div className="error">{error || 'Post not found'}</div>
      </div>
    )
  }

  return (
    <div className="single-poem-grid">
      <div className="poem-content">
        <div className="poem-full-title">{post.title}</div>
        <div className="poem-meta" style={{ marginBottom: '30px' }}>
          <div className="author">By Admin</div>
          <div className="date" style={{ marginLeft: '20px' }}>
            {formatDate(post.published_at)}
          </div>
        </div>
        <div className="poem-text">
          {formatContent(post.content)}
        </div>
      </div>

      <div className="poem-sidebar">
        {categories.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-title">Categories</div>
            <div className="sidebar-content">
              {categories.map((category, index) => (
                <span key={category.id}>
                  <Link 
                    to={`/category/${category.slug}`}
                    style={{ color: '#666', textDecoration: 'none' }}
                  >
                    {category.name}
                  </Link>
                  {index < categories.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-title">Tags</div>
            <div className="sidebar-content">
              {tags.map((tag, index) => (
                <span key={tag.id}>
                  <Link 
                    to={`/tag/${tag.slug}`}
                    style={{ color: '#666', textDecoration: 'none' }}
                  >
                    {tag.name}
                  </Link>
                  {index < tags.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-title">Related Posts</div>
            <div className="sidebar-content">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} style={{ marginBottom: '10px' }}>
                  <Link
                    to={`/${relatedPost.slug}`}
                    style={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '13px',
                      display: 'block'
                    }}
                  >
                    {relatedPost.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePost
