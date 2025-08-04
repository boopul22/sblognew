import { memo } from 'react'

/**
 * Skeleton loader component for better perceived performance
 * Shows animated placeholders while content is loading
 */
const SkeletonLoader = memo(({ 
  type = 'post', 
  count = 1, 
  className = '',
  style = {} 
}) => {
  const skeletonStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    ...style
  }

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
    animation: 'shimmer 1.5s infinite'
  }

  const PostSkeleton = () => (
    <div className={`skeleton-post ${className}`} style={{ marginBottom: '20px' }}>
      {/* Image skeleton */}
      <div style={{ ...skeletonStyle, width: '100%', height: '200px', marginBottom: '15px' }}>
        <div style={shimmerStyle}></div>
      </div>
      
      {/* Title skeleton */}
      <div style={{ ...skeletonStyle, width: '80%', height: '24px', marginBottom: '10px' }}>
        <div style={shimmerStyle}></div>
      </div>
      
      {/* Content skeleton */}
      <div style={{ ...skeletonStyle, width: '100%', height: '16px', marginBottom: '8px' }}>
        <div style={shimmerStyle}></div>
      </div>
      <div style={{ ...skeletonStyle, width: '90%', height: '16px', marginBottom: '8px' }}>
        <div style={shimmerStyle}></div>
      </div>
      <div style={{ ...skeletonStyle, width: '70%', height: '16px', marginBottom: '15px' }}>
        <div style={shimmerStyle}></div>
      </div>
      
      {/* Meta skeleton */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ ...skeletonStyle, width: '80px', height: '14px' }}>
          <div style={shimmerStyle}></div>
        </div>
        <div style={{ ...skeletonStyle, width: '100px', height: '14px' }}>
          <div style={shimmerStyle}></div>
        </div>
      </div>
    </div>
  )

  const AuthorSkeleton = () => (
    <div className={`skeleton-author ${className}`} style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Avatar skeleton */}
        <div style={{ ...skeletonStyle, width: '50px', height: '50px', borderRadius: '50%' }}>
          <div style={shimmerStyle}></div>
        </div>
        
        <div style={{ flex: 1 }}>
          {/* Name skeleton */}
          <div style={{ ...skeletonStyle, width: '150px', height: '18px', marginBottom: '5px' }}>
            <div style={shimmerStyle}></div>
          </div>
          
          {/* Bio skeleton */}
          <div style={{ ...skeletonStyle, width: '200px', height: '14px' }}>
            <div style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    </div>
  )

  const HeaderSkeleton = () => (
    <div className={`skeleton-header ${className}`} style={{ marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo skeleton */}
        <div style={{ ...skeletonStyle, width: '120px', height: '32px' }}>
          <div style={shimmerStyle}></div>
        </div>
        
        {/* Navigation skeleton */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ ...skeletonStyle, width: '60px', height: '20px' }}>
              <div style={shimmerStyle}></div>
            </div>
          ))}
        </div>
        
        {/* Search skeleton */}
        <div style={{ ...skeletonStyle, width: '200px', height: '36px' }}>
          <div style={shimmerStyle}></div>
        </div>
      </div>
    </div>
  )

  const TextSkeleton = ({ lines = 3, width = '100%' }) => (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          style={{ 
            ...skeletonStyle, 
            width: i === lines - 1 ? '70%' : width, 
            height: '16px', 
            marginBottom: '8px' 
          }}
        >
          <div style={shimmerStyle}></div>
        </div>
      ))}
    </div>
  )

  const ImageSkeleton = ({ width = '100%', height = '200px' }) => (
    <div 
      className={`skeleton-image ${className}`}
      style={{ ...skeletonStyle, width, height }}
    >
      <div style={shimmerStyle}></div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'post':
        return <PostSkeleton />
      case 'author':
        return <AuthorSkeleton />
      case 'header':
        return <HeaderSkeleton />
      case 'text':
        return <TextSkeleton />
      case 'image':
        return <ImageSkeleton />
      default:
        return <PostSkeleton />
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
      <div className={`skeleton-loader ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    </>
  )
})

SkeletonLoader.displayName = 'SkeletonLoader'

export default SkeletonLoader

// Export individual skeleton components for more granular use
export const PostSkeleton = memo(() => <SkeletonLoader type="post" count={1} />)
export const AuthorSkeleton = memo(() => <SkeletonLoader type="author" count={1} />)
export const HeaderSkeleton = memo(() => <SkeletonLoader type="header" count={1} />)
export const TextSkeleton = memo(({ lines = 3 }) => <SkeletonLoader type="text" lines={lines} />)
export const ImageSkeleton = memo(({ width, height }) => <SkeletonLoader type="image" width={width} height={height} />)
