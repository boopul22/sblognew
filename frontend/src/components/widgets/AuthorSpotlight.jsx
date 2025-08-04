import { memo } from 'react'
import { Link } from 'react-router-dom'

const AuthorSpotlight = memo(() => {
  // Sample author data - in a real app, this would come from an API
  const featuredAuthors = [
    {
      name: "राहुल शर्मा",
      bio: "प्रेम और जिंदगी की शायरी के मशहूर लेखक",
      username: "rahul-sharma",
      postsCount: 45,
      specialty: "प्रेम शायरी"
    },
    {
      name: "प्रिया गुप्ता",
      bio: "दुख और खुशी की भावनाओं की कुशल कवयित्री",
      username: "priya-gupta",
      postsCount: 32,
      specialty: "भावनात्मक शायरी"
    },
    {
      name: "अमित कुमार",
      bio: "जिंदगी के रंगों को शब्दों में पिरोने वाले शायर",
      username: "amit-kumar",
      postsCount: 28,
      specialty: "जिंदगी शायरी"
    }
  ]

  // Rotate featured author based on current time (changes every hour)
  const currentHour = new Date().getHours()
  const featuredAuthor = featuredAuthors[currentHour % featuredAuthors.length]

  return (
    <div className="widget">
      <h4 className="widget-title">Author Spotlight</h4>
      <div className="author-spotlight">
        <div className="author-image-placeholder"></div>
        <h5>{featuredAuthor.name}</h5>
        <p className="author-bio">{featuredAuthor.bio}</p>
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
