import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug, getAllPosts } from '../lib/staticData'
import OptimizedImage from '../components/OptimizedImage'
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

      // Get post from static data
      const postData = await getPostBySlug(slug)

      if (!postData) {
        throw new Error('Post not found')
      }

      setPost(postData)

      // Get all posts for related posts
      const allPosts = await getAllPosts()

      // Find related posts (excluding current post)
      const related = allPosts
        .filter(p => p.id !== postData.id)
        .slice(0, 3)

      setRelatedPosts(related)
      setCategories(postData.categories || [])
      setTags(postData.tags || [])

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

    // Clean up WordPress-specific classes and attributes while preserving essential HTML
    formatted = formatted.replace(/class="[^"]*wp-[^"]*"/g, '')
    formatted = formatted.replace(/class="[^"]*has-[^"]*"/g, '')
    formatted = formatted.replace(/style="[^"]*text-transform:[^"]*"/g, '')

    // Optimize images with lazy loading and responsive attributes
    formatted = formatted.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, before, src, after) => {
      return `<img${before}src="${src}"${after} loading="lazy" decoding="async" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" sizes="(max-width: 768px) 100vw, 800px">`
    })

    // Add spacing around headings
    formatted = formatted.replace(/<h([1-6])([^>]*)>/g, '<h$1$2 style="margin: 30px 0 20px 0;">')

    // Style blockquotes
    formatted = formatted.replace(/<blockquote([^>]*)>/g, '<blockquote$1 style="margin: 20px 0; padding: 15px 20px; border-left: 4px solid #ddd; background: #f9f9f9; font-style: italic;">')

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
        <div
          className="poem-text"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
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
