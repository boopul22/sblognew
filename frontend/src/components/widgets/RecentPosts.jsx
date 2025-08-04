import { memo } from 'react'
import { Link } from 'react-router-dom'

const RecentPosts = memo(() => {
  // Sample recent posts data - in a real app, this would come from an API
  const recentPosts = [
    {
      id: 1,
      title: "खुशियों का मंजर",
      date: "28 जनवरी 2025",
      slug: "khushiyon-ka-manjar"
    },
    {
      id: 2,
      title: "दोस्ती का रिश्ता",
      date: "25 जनवरी 2025",
      slug: "dosti-ka-rishta"
    }
  ]

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
              <p className="recent-date">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

RecentPosts.displayName = 'RecentPosts'

export default RecentPosts
