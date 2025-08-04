const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">श्रेणियाँ</h4>
            <ul className="footer-links">
              <li><a href="#">प्रेम शायरी</a></li>
              <li><a href="#">दुख शायरी</a></li>
              <li><a href="#">मोटिवेशनल शायरी</a></li>
              <li><a href="#">दोस्ती शायरी</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">लेखक</h4>
            <ul className="footer-links">
              <li><a href="#">राहुल शर्मा</a></li>
              <li><a href="#">प्रिया गुप्ता</a></li>
              <li><a href="#">अमित कुमार</a></li>
              <li><a href="#">सुनीता देवी</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">About</h4>
            <ul className="footer-links">
              <li><a href="#">हमारे बारे में</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">🐦 Twitter</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">📺 YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 शायरी ब्लॉग. All rights reserved.</p>
          <p>Contact: info@shayariblog.com | +91 9876543210</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
