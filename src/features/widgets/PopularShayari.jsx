import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../../lib/api/staticData'

const PopularShayari = memo(() => {
  const [popularPosts, setPopularPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        setLoading(true)
        const posts = await getAllPosts()
        // Get the most recent posts as "popular" for now
        // In a real app, you'd have a likes/views system
        const popular = posts.slice(0, 3)
        setPopularPosts(popular)
      } catch (err) {
        console.error('Error fetching popular posts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [])

  if (loading) {
    return (
      <div className="widget">
        <h4 className="widget-title">Popular शायरी</h4>
        <div className="popular-list">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="widget">
        <h4 className="widget-title">Popular शायरी</h4>
        <div className="popular-list">
          <div className="error">Error loading posts</div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget">
      <h4 className="widget-title">Popular शायरी</h4>
      <div className="popular-list">
        {popularPosts.map((post) => (
          <div key={post.id} className="popular-item">
            <h5>
              <Link to={`/${post.slug}`}>
                {post.title}
              </Link>
            </h5>
            <p className="popular-author">
              {post.users?.display_name || post.users?.full_name || 'Unknown Author'}
            </p>
            <span className="popular-likes">{post.reading_time || 5} min read</span>
          </div>
        ))}
      </div>
    </div>
  )
})

PopularShayari.displayName = 'PopularShayari'

export default PopularShayari
