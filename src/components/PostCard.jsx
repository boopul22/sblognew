import { Link } from 'react-router-dom'
import { memo } from 'react'
import OptimizedImage from './OptimizedImage'
import { getExcerpt, getThumbnailImage, formatDate } from '../utils/contentUtils'

const PostCard = memo(({ post, featured = false, priority = false }) => {
  // Get author name - simplified for now
  const getAuthorName = () => {
    // For now, return a placeholder. In a real app, you'd fetch author data
    return 'Admin'
  }

  if (featured) {
    const thumbnailUrl = getThumbnailImage(post.content)

    return (
      <Link to={`/${post.slug}`} className="featured">
        {thumbnailUrl && (
          <div className="featured-image">
            <OptimizedImage
              src={thumbnailUrl}
              alt={post.title}
              width={800}
              height={200}
              priority={priority || featured}
              style={{
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
          By {getAuthorName()}
        </div>
      </Link>
    )
  }

  const thumbnailUrl = getThumbnailImage(post.content)

  return (
    <Link to={`/${post.slug}`} className="poem-card">
      {thumbnailUrl && (
        <div className="poem-image">
          <OptimizedImage
            src={thumbnailUrl}
            alt={post.title}
            width={400}
            height={150}
            lazy={!priority}
            priority={priority}
            style={{
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
        <div className="author">By {getAuthorName()}</div>
        <div className="date">{formatDate(post.published_at)}</div>
      </div>
    </Link>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.featured === nextProps.featured &&
    prevProps.priority === nextProps.priority
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
