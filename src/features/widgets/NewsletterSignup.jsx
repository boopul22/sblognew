import { memo, useState } from 'react'

const NewsletterSignup = memo(() => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !isValidEmail(email)) {
      alert('कृपया वैध ईमेल पता दर्ज करें।')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true)
      setEmail('')
      setIsSubmitting(false)

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1000)
  }

  if (isSuccess) {
    return (
      <div className="widget">
        <h4 className="widget-title">Newsletter</h4>
        <div className="newsletter-signup">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h5>धन्यवाद!</h5>
            <p>आपका सब्स्क्रिप्शन सफल रहा।<br />अब आपको रोज़ाना नई शायरी मिलती रहेगी।</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget">
      <h4 className="widget-title">Newsletter</h4>
      <div className="newsletter-signup">
        <p>रोज़ाना नई शायरी पाएं</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn btn--primary btn--full-width mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  )
})

NewsletterSignup.displayName = 'NewsletterSignup'

export default NewsletterSignup
