import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoBox}>T</span>
            <span>TrendHub</span>
          </div>
          <p className={styles.tagline}>
            Kenya's favourite online marketplace for fashion, electronics, home goods, and more. Fast delivery. Easy returns.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook"><Facebook size={18}/></a>
            <a href="#" aria-label="Instagram"><Instagram size={18}/></a>
            <a href="#" aria-label="Twitter"><Twitter size={18}/></a>
            <a href="#" aria-label="YouTube"><Youtube size={18}/></a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className={styles.heading}>Shop</h4>
          <ul className={styles.links}>
            {['Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sports'].map(c => (
              <li key={c}><Link to={`/products?category=${c.toLowerCase()}`}>{c}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className={styles.heading}>Help</h4>
          <ul className={styles.links}>
            {[
              ['My Account', '/account'],
              ['Track Order', '/account'],
              ['Returns', '#'],
              ['FAQs', '#'],
              ['Contact Us', '#'],
            ].map(([label, href]) => (
              <li key={label}><Link to={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.heading}>Contact</h4>
          <ul className={styles.contact}>
            <li><MapPin size={14}/> Kimathi Street, Nairobi CBD</li>
            <li><Phone size={14}/> +254 700 000 000</li>
            <li><Mail size={14}/> hello@trendhub.co.ke</li>
          </ul>
          <div className={styles.payments}>
            <span className={styles.payBadge}>M-Pesa</span>
            <span className={styles.payBadge}>Visa</span>
            <span className={styles.payBadge}>Mastercard</span>
            <span className={styles.payBadge}>PayPal</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} TrendHub Kenya Ltd. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
