import { Link } from 'react-router-dom'

const PostCard = ({ post, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getExcerpt = (content, length = 150) => {
    if (!content) return ''
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ').trim()
    
    if (plainText.length <= length) return plainText
    
    // Find the last complete word within the length limit
    const truncated = plainText.substring(0, length)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  const getAuthorName = (authorId) => {
    // For now, return a placeholder. In a real app, you'd fetch author data
    return 'Admin'
  }

  if (featured) {
    return (
      <Link to={`/${post.slug}`} className="featured">
        <div className="featured-title">{post.title}</div>
        <div className="featured-content">
          {getExcerpt(post.content, 200)}
        </div>
        <div className="featured-author">
          By {getAuthorName(post.author_wp_id)}
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/${post.slug}`} className="poem-card">
      <div className="poem-title">{post.title}</div>
      <div className="poem-preview">
        {getExcerpt(post.content)}
      </div>
      <div className="poem-meta">
        <div className="author">By {getAuthorName(post.author_wp_id)}</div>
        <div className="date">{formatDate(post.published_at)}</div>
      </div>
    </Link>
  )
}

export default PostCard
