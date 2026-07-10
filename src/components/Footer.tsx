import { Link } from 'react-router-dom'

const bronze = { color: 'var(--bronze)' }
const socialRow = { display: 'flex', gap: '1.5rem' }

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="display">
              inkbyos<span style={bronze}>.</span>
            </p>
            <p>For the love of art. Private, appointment-only tattooing in Waterloo, Ontario.</p>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <Link to="/work">Work</Link>
            <Link to="/aftercare">Aftercare</Link>
            <Link to="/book">Book a session</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:inkbyos@gmail.com">inkbyos@gmail.com</a>
            <a href="tel:+15195012910">519-501-2910</a>
            <span>Waterloo, ON · Canada</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} InkbyOs</span>
          <span style={socialRow}>
            <a href="https://www.instagram.com/inkbyos" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@inkbyos" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            <a href="https://www.facebook.com/inkbyos" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
