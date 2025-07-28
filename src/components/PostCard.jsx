import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { getExcerpt, getThumbnailImage, formatDate } from '../utils/contentUtils'

const PostCard = ({ post, featured = false }) => {


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
            <OptimizedImage
              src={thumbnailUrl}
              alt={post.title}
              width={800}
              height={200}
              priority={true}
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
          <OptimizedImage
            src={thumbnailUrl}
            alt={post.title}
            width={400}
            height={150}
            lazy={true}
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
        <div className="author">By {getAuthorName(post.author_id)}</div>
        <div className="date">{formatDate(post.published_at)}</div>
      </div>
    </Link>
  )
}

export default PostCard
