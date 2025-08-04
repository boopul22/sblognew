import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../../lib/api/staticData'

const RecentPosts = memo(() => {
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true)
        const posts = await getAllPosts()
        // Get the 3 most recent posts
        const recent = posts.slice(0, 3)
        setRecentPosts(recent)
      } catch (err) {
        console.error('Error fetching recent posts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPosts()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="widget">
        <h4 className="widget-title">Recent Posts</h4>
        <div className="recent-list">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="widget">
        <h4 className="widget-title">Recent Posts</h4>
        <div className="recent-list">
          <div className="error">Error loading posts</div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget">
      <h4 className="widget-title">Recent Posts</h4>
      <div className="recent-list">
        {recentPosts.map((post) => (
          <div key={post.id} className="recent-item">
            <div className="recent-image-placeholder"></div>
            <div className="recent-content">
              <h5>
                <Link to={`/${post.slug}`}>
                  {post.title}
                </Link>
              </h5>
              <p className="recent-date">{formatDate(post.published_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

RecentPosts.displayName = 'RecentPosts'

export default RecentPosts
