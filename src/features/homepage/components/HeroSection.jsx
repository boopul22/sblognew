import { memo } from 'react'

const HeroSection = memo(() => {
  const handleReadMore = (e) => {
    e.preventDefault()
    alert('Featured शायरी:\n\n"दिल से दिल तक का सफर\nशब्दों में बयाँ करता है\nहर एक शायर अपनी कलम से\nजिंदगी का राज़ बताता है"\n\n- फीचर्ड पोएट')
  }

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
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
