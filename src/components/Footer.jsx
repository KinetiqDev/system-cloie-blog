import { Link } from 'react-router-dom'
import './Footer.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/chapter1', label: 'Chapter 1' },
  { to: '/chapter2', label: 'Chapter 2' },
  { to: '/chapter3', label: 'Chapter 3' },
  { to: '/references', label: 'References' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="footer__brand">
          <img src="/cloie-logo.png" alt="CLOIE logo" className="footer__logo" />
          <Link to="/" className="footer__title">Project CLOIE</Link>
          <p className="footer__course">ITE 1 – Web System Technologies 1</p>
        </div>

        <nav className="footer__links" aria-label="Footer navigation">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer__bottom">
          <p>&copy; 2026 Project CLOIE Team. Assumption College of Davao Capstone Showcase.</p>
        </div>
      </div>
    </footer>
  )
}
