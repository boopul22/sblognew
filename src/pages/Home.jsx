import { useState, useEffect, useCallback, memo } from 'react'
import { fetchHomePosts } from '../lib/queries'
import PostCard from '../components/PostCard'
import SkeletonLoader from '../components/SkeletonLoader'

const Home = ({ searchQuery }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const POSTS_PER_PAGE = 12

  useEffect(() => {
    fetchPosts(true) // Reset when search changes
  }, [searchQuery])

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)
      const currentPage = reset ? 0 : page

      const { posts: newPosts, hasMore: moreAvailable } = await fetchHomePosts(
        currentPage,
        POSTS_PER_PAGE,
        searchQuery
      )

      if (reset) {
        setPosts(newPosts)
        setPage(1)
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }

      setHasMore(moreAvailable)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery])

  if (loading && posts.length === 0) {
    return (
      <div className="main-grid">
        <SkeletonLoader type="post" count={6} />
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

  if (posts.length === 0 && !loading) {
    return (
      <div className="main-grid">
        <div className="loading">
          {searchQuery ? `No posts found for "${searchQuery}"` : 'No posts available'}
        </div>
      </div>
    )
  }

  // Get featured post (first post) and regular posts
  const [featuredPost, ...regularPosts] = posts

  return (
    <>
      <div className="main-grid">
        {featuredPost && !searchQuery && (
          <PostCard post={featuredPost} featured={true} priority={true} />
        )}

        {(searchQuery ? posts : regularPosts).map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            priority={index < 3} // Mark first 3 posts as priority for LCP
          />
        ))}
      </div>

      {hasMore && !searchQuery && (
        <div className="load-more-container">
          <button
            onClick={() => fetchPosts(false)}
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? (
              <div className="loading-inline">
                <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                Loading...
              </div>
            ) : (
              'Load More Posts'
            )}
          </button>
        </div>
      )}
    </>
  )
}

export default memo(Home)
