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

  const getThumbnailImage = (content) => {
    if (!content) return null

    // Extract the first image from the content
    const imgMatch = content.match(/<img[^>]+src="([^"]*)"[^>]*>/i)
    return imgMatch ? imgMatch[1] : null
  }

  const getAuthorName = (authorId) => {
    // For now, return a placeholder. In a real app, you'd fetch author data
    return 'Admin'
  }

  if (featured) {
    const thumbnailUrl = getThumbnailImage(post.content)

    return (
      <Link to={`/${post.slug}`} className="featured">
        {thumbnailUrl && (
          <div className="featured-image">
            <img
              src={thumbnailUrl}
              alt={post.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            />
          </div>
        )}
        <div className="featured-title">{post.title}</div>
        <div className="featured-content">
          {getExcerpt(post.content, 200)}
        </div>
        <div className="featured-author">
          By {getAuthorName(post.author_id)}
        </div>
      </Link>
    )
  }

  const thumbnailUrl = getThumbnailImage(post.content)

  return (
    <Link to={`/${post.slug}`} className="poem-card">
      {thumbnailUrl && (
        <div className="poem-image">
          <img
            src={thumbnailUrl}
            alt={post.title}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px'
            }}
          />
        </div>
      )}
      <div className="poem-title">{post.title}</div>
      <div className="poem-preview">
        {getExcerpt(post.content)}
      </div>
      <div className="poem-meta">
        <div className="author">By {getAuthorName(post.author_id)}</div>
        <div className="date">{formatDate(post.published_at)}</div>
      </div>
    </Link>
  )
}

export default PostCard
