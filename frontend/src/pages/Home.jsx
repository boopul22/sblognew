import { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { getPostsPaginated } from '../lib/staticData'
import PostCard from '../components/PostCard'
import SkeletonLoader from '../components/SkeletonLoader'
import HeroSection from '../components/HeroSection'
import Sidebar from '../components/Sidebar'

const Home = ({ searchQuery }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const POSTS_PER_PAGE = 12

  useEffect(() => {
    fetchPosts(true) // Reset when search changes
  }, [searchQuery, selectedCategory])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    fetchPosts(true) // Reset posts when category changes
  }, [])

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)
      const currentPage = reset ? 0 : page

      const { posts: newPosts, hasMore: moreAvailable } = await getPostsPaginated(
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
      {/* Hero Section */}
      {!searchQuery && <HeroSection featuredPost={featuredPost} />}

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          <div className="content-layout">
            {/* Shayari Cards Grid */}
            <div className="shayari-grid">
              <h3 className="section-title">Latest शायरी</h3>

              <div className="cards-grid">
                {(searchQuery ? posts : regularPosts).map((post, index) => (
                  <div key={post.id} className="shayari-card">
                    {post.featured_image_url ? (
                      <div className="card-image">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '15px'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="card-image-placeholder"></div>
                    )}
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-author">लेखक: Admin</p>
                    <p className="card-excerpt">{post.content?.substring(0, 150)}...</p>
                    <div className="card-meta">
                      <span className="card-category">शायरी</span>
                      <span className="card-date">{new Date(post.published_at).toLocaleDateString('hi-IN')}</span>
                    </div>
                    <div className="card-actions">
                      <div className="card-engagement">
                        <button className="like-count">
                          ❤️ <span>{Math.floor(Math.random() * 500) + 50}</span>
                        </button>
                        <button className="share-btn">
                          📤 Share
                        </button>
                      </div>
                      <Link to={`/${post.slug}`} className="btn btn--sm btn--primary">
                        पढ़ें
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !searchQuery && (
                <div className="load-more-container">
                  <button
                    onClick={() => fetchPosts(false)}
                    disabled={loading}
                    className="btn btn--outline"
                  >
                    {loading ? 'Loading...' : 'Load More शायरी'}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default memo(Home)
