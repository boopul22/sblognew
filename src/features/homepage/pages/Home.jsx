import { useState, useEffect, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '../../../lib/api/staticData'
import OptimizedImage from '../../../shared/components/ui/OptimizedImage'
import PostCard from '../components/PostCard'
import SkeletonLoader from '../../../shared/components/ui/SkeletonLoader'
import HeroSection from '../components/HeroSection'
import Sidebar from '../../../shared/components/layout/Sidebar'

const Home = ({ searchQuery }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [imageOrientations, setImageOrientations] = useState({})
  const POSTS_PER_PAGE = 12

  useEffect(() => {
    fetchPosts(true) // Reset when search changes
  }, [searchQuery, selectedCategory])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    fetchPosts(true) // Reset posts when category changes
  }, [])

  // Handle aspect ratio detection for adaptive images
  const handleAspectRatioDetected = useCallback((postId, aspectRatio, orientation) => {
    setImageOrientations(prev => ({
      ...prev,
      [postId]: orientation
    }))
  }, [])

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      // Get all posts from Supabase
      let allPosts = await getAllPosts()

      // Apply category filter
      if (selectedCategory !== 'all') {
        allPosts = allPosts.filter(post =>
          post.categories?.slug === selectedCategory
        )
      }

      // Apply search filter
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        allPosts = allPosts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
        )
      }

      // Implement pagination
      const currentPage = reset ? 0 : page
      const startIndex = currentPage * POSTS_PER_PAGE
      const endIndex = startIndex + POSTS_PER_PAGE
      const newPosts = allPosts.slice(startIndex, endIndex)
      const moreAvailable = endIndex < allPosts.length

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
  }, [page, searchQuery, selectedCategory])

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

  // Helper functions for post interactions
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRandomLikes = () => Math.floor(Math.random() * 500) + 50

  const handleLike = (post) => {
    const likes = getRandomLikes()
    alert(`शायरी को ${likes} लाइक मिले!`)
  }

  const handleShare = (post) => {
    const shareText = `${post.title}\n\n${post.excerpt}\n\n- ${post.users?.display_name || 'Admin'}\n\nशायरी ब्लॉग से साझा किया गया`

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err))
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('शायरी क्लिपबोर्ड में कॉपी हो गई!')
      }).catch(() => {
        alert(`शायरी साझा करें:\n\n${shareText}`)
      })
    }
  }

  const handleReadFull = (post) => {
    // Navigate to the individual post page using the post slug
    navigate(`/${post.slug}`)
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          <div className="content-layout">
            {/* Shayari Cards Grid */}
            <div className="shayari-grid">
              <h3 className="section-title">Latest शायरी</h3>

              <div className="cards-grid" id="shayariGrid">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="shayari-card">
                      {post.featured_image_url ? (
                        <div className="card-image">
                          <OptimizedImage
                            src={post.featured_image_url}
                            alt={post.title}
                            width={400}
                            height={200}
                            lazy={true}
                            priority={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            aspectRatio="2/1"
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                              marginBottom: '15px'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="card-image-placeholder"></div>
                      )}
                      <h3 className="card-title">{post.title}</h3>
                      <p className="card-author">लेखक: {post.users?.display_name || 'Admin'}</p>
                      <p className="card-excerpt">{post.excerpt}</p>
                      <div className="card-meta">
                        <span className="card-category">
                          {post.post_categories?.[0]?.categories?.name || 'शायरी'}
                        </span>
                        <span className="card-date">{formatDate(post.published_at)}</span>
                      </div>
                      <div className="card-actions">
                        <div className="card-engagement">
                          <button
                            className="like-count"
                            onClick={() => handleLike(post)}
                          >
                            ❤️ <span>{getRandomLikes()}</span>
                          </button>
                          <button
                            className="share-btn"
                            onClick={() => handleShare(post)}
                          >
                            📤 Share
                          </button>
                        </div>
                        <button
                          className="btn btn--sm btn--primary"
                          onClick={() => handleReadFull(post)}
                        >
                          पढ़ें
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <h3>कोई शायरी नहीं मिली</h3>
                    <p>कृपया अपनी खोज या फ़िल्टर बदलें</p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {hasMore && (
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
