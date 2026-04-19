import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, ChevronRight, Minus, Plus } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { PRODUCTS, formatKES, getDiscount } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'
import styles from './ProductDetailPage.module.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find(p => p.id === Number(id))
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')

  const addItem  = useCartStore(s => s.addItem)
  const toggle   = useWishlistStore(s => s.toggle)
  const isWished = useWishlistStore(s => s.isWishlisted(product?.id))

  if (!product) return (
    <div className="page" style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  )

  const discount  = getDiscount(product.price, product.originalPrice)
  const related   = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  function handleAddToCart() {
    addItem(product, qty)
    toast.success(`${product.name} added to cart!`)
  }

  function handleWishlist() {
    const added = toggle(product)
    toast(added ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <ChevronRight size={14}/>
          <Link to="/products">Products</Link>
          <ChevronRight size={14}/>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={14}/>
          <span>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.mainImg}>
              <img src={product.image} alt={product.name} />
              {discount && <span className="badge badge-danger" style={{position:'absolute',top:16,left:16}}>-{discount}%</span>}
              {product.badge && <span className={`badge badge-primary`} style={{position:'absolute',top:16,right:16}}>{product.badge}</span>}
            </div>
            {/* Thumbnail row (simulated) */}
            <div className={styles.thumbRow}>
              {[product.image, product.image, product.image].map((img, i) => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ''}`}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.name}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className="stars">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} size={16}
                    fill={n <= Math.floor(product.rating) ? '#F5C518' : 'none'}
                    stroke={n <= Math.floor(product.rating) ? '#F5C518' : '#D1D5DB'}
                  />
                ))}
              </div>
              <span className={styles.ratingNum}>{product.rating}</span>
              <span className={styles.reviewCount}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatKES(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.original}>{formatKES(product.originalPrice)}</span>
                  <span className="badge badge-danger">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description short */}
            <p className={styles.desc}>{product.description}</p>

            {/* Stock */}
            <div className={styles.stock}>
              <span className={styles.stockDot} />
              <span>In Stock ({product.stock} available)</span>
            </div>

            {/* Qty */}
            <div className={styles.qtyRow}>
              <label className={styles.qtyLabel}>Quantity</label>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} className={styles.qtyBtn} disabled={qty<=1}>
                  <Minus size={16}/>
                </button>
                <span className={styles.qtyNum}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className={styles.qtyBtn}>
                  <Plus size={16}/>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.ctas}>
              <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{flex:1}}>
                <ShoppingCart size={18}/> Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`btn btn-outline ${isWished ? styles.wishedBtn : ''}`}
                style={{width:52,padding:'0 0'}}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWished ? 'var(--primary)' : 'none'} color={isWished ? 'var(--primary)' : 'currentColor'} />
              </button>
            </div>

            <Link to="/checkout" onClick={() => addItem(product, qty)} className="btn btn-navy btn-full" style={{marginTop:0}}>
              Buy Now
            </Link>

            {/* Perks */}
            <div className={styles.perks}>
              {[
                { icon: <Truck size={16}/>, text: 'Free delivery on orders over KES 3,000' },
                { icon: <Shield size={16}/>, text: 'Secure M-Pesa & card payment' },
                { icon: <RefreshCw size={16}/>, text: '14-day hassle-free returns' },
              ].map(({ icon, text }) => (
                <div key={text} className={styles.perk}>
                  <span className={styles.perkIcon}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['description', 'reviews', 'shipping'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          {tab === 'description' && (
            <div>
              <p style={{fontSize:15,color:'var(--gray-700)',lineHeight:1.8}}>{product.description}</p>
              <ul style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
                {['High quality materials', 'Manufacturer warranty included', 'Available in multiple variants', 'Ships within 24 hours'].map(f => (
                  <li key={f} style={{display:'flex',gap:8,alignItems:'center',fontSize:14,color:'var(--gray-600)'}}>
                    <span style={{color:'var(--success)',fontWeight:700}}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'reviews' && (
            <div>
              <p style={{fontSize:15,color:'var(--gray-600)'}}>⭐ {product.rating} out of 5 — based on {product.reviews} customer reviews.</p>
              <p style={{marginTop:8,color:'var(--gray-400)',fontSize:14}}>Reviews feature coming soon. Be the first to review this product!</p>
            </div>
          )}
          {tab === 'shipping' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                ['Standard Delivery', 'Nairobi: 1-2 days | Other counties: 2-4 days', 'Free over KES 3,000'],
                ['Express Delivery', 'Nairobi same-day (order before 12pm)', 'KES 350'],
                ['Pickup Points', 'Available at 50+ locations nationwide', 'Free'],
              ].map(([t,d,p]) => (
                <div key={t} style={{background:'var(--gray-50)',padding:'16px 20px',borderRadius:'var(--radius-md)'}}>
                  <p style={{fontWeight:600,color:'var(--navy)',marginBottom:4}}>{t}</p>
                  <p style={{fontSize:13,color:'var(--gray-600)',marginBottom:4}}>{d}</p>
                  <p style={{fontSize:12,color:'var(--primary)',fontWeight:600}}>{p}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{marginTop:60}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:800,color:'var(--navy)',marginBottom:24}}>
              You May Also Like
            </h2>
            <div className="grid-products">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
