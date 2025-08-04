import { Link } from 'react-router-dom'
import { memo, useState, useCallback } from 'react'
import OptimizedImage from '../../../shared/components/ui/OptimizedImage'
import ImageDebugger from '../../../shared/components/debug/ImageDebugger'
import { getExcerpt, getThumbnailImage, formatDate } from '../../../utils/contentUtils'

const PostCard = memo(({ post, featured = false, priority = false, showDebug = false }) => {
  const [imageOrientation, setImageOrientation] = useState('')

  // Get author name - simplified for now
  const getAuthorName = () => {
    // For now, return a placeholder. In a real app, you'd fetch author data
    return 'Admin'
  }

  // Handle aspect ratio detection for adaptive images
  const handleAspectRatioDetected = useCallback((aspectRatio, orientation) => {
    setImageOrientation(orientation)
  }, [])

  if (featured) {
    const thumbnailUrl = getThumbnailImage(post.content, post.featured_image_url)

    return (
      <Link to={`/${post.slug}`} className="featured">
        {thumbnailUrl && (
          <div className={`featured-image ${imageOrientation}`}>
            <OptimizedImage
              src={thumbnailUrl}
              alt={post.title}
              width={800}
              height={400}
              priority={priority || featured}
              adaptive={true}
              onAspectRatioDetected={handleAspectRatioDetected}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              style={{
                borderRadius: '8px',
                marginBottom: '15px',
                width: '100%',
                height: 'auto'
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

  const thumbnailUrl = getThumbnailImage(post.content, post.featured_image_url)

  return (
    <>
      <Link to={`/${post.slug}`} className="poem-card">
        {thumbnailUrl && (
          <div className={`poem-image ${imageOrientation}`}>
            <OptimizedImage
              src={thumbnailUrl}
              alt={post.title}
              width={400}
              height={250}
              lazy={!priority}
              priority={priority}
              adaptive={true}
              onAspectRatioDetected={handleAspectRatioDetected}
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
              style={{
                borderRadius: '8px',
                marginBottom: '10px',
                width: '100%',
                height: 'auto'
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
      {showDebug && <ImageDebugger post={post} showDebug={showDebug} />}
    </>
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
