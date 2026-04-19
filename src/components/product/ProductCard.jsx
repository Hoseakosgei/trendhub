import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { formatKES, getDiscount } from '@/data/products'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const addItem    = useCartStore(s => s.addItem)
  const toggle     = useWishlistStore(s => s.toggle)
  const isWished   = useWishlistStore(s => s.isWishlisted(product.id))
  const discount   = getDiscount(product.price, product.originalPrice)

  function handleAddToCart(e) {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  function handleWishlist(e) {
    e.preventDefault()
    const added = toggle(product)
    toast(added ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imgWrap}>
        {!imgLoaded && <div className={`skeleton ${styles.imgSkeleton}`} />}
        <img
          src={product.image}
          alt={product.name}
          className={`${styles.img} ${imgLoaded ? styles.imgVisible : ''}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Badges */}
        {product.badge && (
          <span className={`badge ${
            product.badge === 'Sale' ? 'badge-primary' :
            product.badge === 'New' ? 'badge-navy' :
            product.badge === 'Hot' ? 'badge-primary' :
            'badge-gold'
          } ${styles.badge}`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className={`badge badge-danger ${styles.discountBadge}`}>-{discount}%</span>
        )}

        {/* Hover Actions */}
        <div className={styles.actions}>
          <button
            onClick={handleWishlist}
            className={`${styles.actionBtn} ${isWished ? styles.wished : ''}`}
            aria-label="Wishlist"
          >
            <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/products/${product.id}`} className={styles.actionBtn} aria-label="Quick view" onClick={e => e.stopPropagation()}>
            <Eye size={16} />
          </Link>
        </div>

        {/* Add to cart overlay */}
        <button onClick={handleAddToCart} className={styles.cartOverlay}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.rating}>
          <div className="stars">
            {[1,2,3,4,5].map(n => (
              <Star
                key={n} size={12}
                fill={n <= Math.floor(product.rating) ? '#F5C518' : 'none'}
                stroke={n <= Math.floor(product.rating) ? '#F5C518' : '#D1D5DB'}
              />
            ))}
          </div>
          <span className={styles.ratingText}>{product.rating} ({product.reviews})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatKES(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.original}>{formatKES(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
