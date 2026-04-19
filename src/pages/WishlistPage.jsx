import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store'
import ProductCard from '@/components/product/ProductCard'
import styles from './WishlistPage.module.css'

export default function WishlistPage() {
  const { items } = useWishlistStore()

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        <h1 className={styles.title}>My Wishlist</h1>
        <p className={styles.count}>{items.length} saved items</p>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={64} strokeWidth={1} color="var(--gray-300)" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-products">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
