import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllAuthors, getAllPosts } from '../../lib/staticData'

const AuthorSpotlight = memo(() => {
  const [featuredAuthor, setFeaturedAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedAuthor = async () => {
      try {
        setLoading(true)
        const [authors, posts] = await Promise.all([
          getAllAuthors(),
          getAllPosts()
        ])

        if (authors.length === 0) {
          setError('No authors found')
          return
        }

        // Count posts per author
        const authorPostCounts = new Map()
        posts.forEach(post => {
          const authorId = post.author_id
          authorPostCounts.set(authorId, (authorPostCounts.get(authorId) || 0) + 1)
        })

        // Add post counts to authors
        const authorsWithCounts = authors.map(author => ({
          ...author,
          postsCount: authorPostCounts.get(author.id) || 0
        }))

        // Rotate featured author based on current time (changes every hour)
        const currentHour = new Date().getHours()
        const featured = authorsWithCounts[currentHour % authorsWithCounts.length]
        setFeaturedAuthor(featured)
      } catch (err) {
        console.error('Error fetching featured author:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedAuthor()
  }, [])

  if (loading) {
    return (
      <div className="widget">
        <h4 className="widget-title">Author Spotlight</h4>
        <div className="author-spotlight">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !featuredAuthor) {
    return (
      <div className="widget">
        <h4 className="widget-title">Author Spotlight</h4>
        <div className="author-spotlight">
          <div className="error">No authors available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget">
      <h4 className="widget-title">Author Spotlight</h4>
      <div className="author-spotlight">
        <div className="author-image-placeholder"></div>
        <h5>{featuredAuthor.display_name || featuredAuthor.full_name}</h5>
        <p className="author-bio">
          {featuredAuthor.role === 'admin' ? 'Website Administrator' : 'Content Author'}
          {featuredAuthor.postsCount > 0 && ` • ${featuredAuthor.postsCount} posts`}
        </p>
        <Link
          to={`/author/${featuredAuthor.username}`}
          className="btn btn--sm btn--outline"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
})

AuthorSpotlight.displayName = 'AuthorSpotlight'

export default AuthorSpotlight
