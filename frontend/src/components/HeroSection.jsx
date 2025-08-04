import { memo } from 'react'
import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { getExcerpt, getThumbnailImage } from '../utils/contentUtils'

const HeroSection = memo(({ featuredPost }) => {
  const handleReadMore = (e) => {
    if (!featuredPost) {
      e.preventDefault()
      alert('Featured शायरी:\n\n"दिल से दिल तक का सफर\nशब्दों में बयाँ करता है\nहर एक शायर अपनी कलम से\nजिंदगी का राज़ बताता है"\n\n- फीचर्ड पोएट')
    }
  }

  if (!featuredPost) {
    return (
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-banner">
              <div className="hero-image-placeholder"></div>
              <div className="hero-text">
                <h2 className="hero-title">आज की खास शायरी</h2>
                <p className="hero-subtitle">प्रेम, दुख, खुशी की अनमोल शायरियाँ</p>
                <button
                  className="btn btn--primary"
                  onClick={handleReadMore}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const thumbnailUrl = getThumbnailImage(featuredPost.content, featuredPost.featured_image_url)

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-banner">
            <div className="hero-image">
              {thumbnailUrl ? (
                <OptimizedImage
                  src={thumbnailUrl}
                  alt={featuredPost.title}
                  width={300}
                  height={200}
                  priority={true}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div className="image-placeholder" style={{ width: '300px', height: '200px', borderRadius: '8px' }}>
                  Featured Image
                </div>
              )}
            </div>
            <div className="hero-text">
              <h2 className="hero-title">{featuredPost.title}</h2>
              <p className="hero-subtitle">
                {getExcerpt(featuredPost.content, 150)}
              </p>
              <Link
                to={`/${featuredPost.slug}`}
                className="btn btn--primary"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
