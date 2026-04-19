import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.sub}>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className={styles.ctas}>
          <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
