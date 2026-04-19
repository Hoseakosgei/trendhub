import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Headphones, Star } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { PRODUCTS, CATEGORIES, BANNERS, TESTIMONIALS, formatKES } from '@/data/products'
import styles from './HomePage.module.css'

export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0)
  const [countdown, setCountdown] = useState({ h: 5, m: 42, s: 17 })

  // Banner auto-rotate
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  // Flash sale countdown
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        let { h, m, s } = c
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) { h = 5; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const featured  = PRODUCTS.slice(0, 8)
  const saleItems = PRODUCTS.filter(p => p.originalPrice).slice(0, 4)
  const newArrivals = PRODUCTS.filter(p => p.badge === 'New' || p.badge === 'Hot').slice(0, 4)

  const banner = BANNERS[bannerIdx]

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className={`page ${styles.page}`}>

      {/* ── Hero Banner ── */}
      <section className={styles.hero} style={{ background: banner.bg }}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.heroTag} style={{ color: banner.accent }}>✦ Limited Time Offer</span>
            <h1 className={styles.heroHeadline}>{banner.headline}</h1>
            <p className={styles.heroSub}>{banner.subtext}</p>
            <div className={styles.heroCtas}>
              <Link to={banner.link} className="btn btn-primary btn-lg">
                {banner.cta} <ArrowRight size={18} />
              </Link>
              <Link to="/products" className={styles.heroSecondary}>
                Browse All →
              </Link>
            </div>
          </div>
          <div className={styles.heroImg}>
            <img src={banner.image} alt={banner.headline} />
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {BANNERS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === bannerIdx ? styles.dotActive : ''}`}
              onClick={() => setBannerIdx(i)}
            />
          ))}
        </div>

        {/* Arrows */}
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)}>
          <ChevronLeft size={22} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)}>
          <ChevronRight size={22} />
        </button>
      </section>

      {/* ── Trust Bar ── */}
      <section className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: <Truck size={22}/>,      label: 'Free Delivery', sub: 'On orders over KES 3,000' },
              { icon: <Shield size={22}/>,     label: 'Secure Payment', sub: 'M-Pesa, Visa & PayPal' },
              { icon: <RefreshCw size={22}/>,  label: 'Easy Returns', sub: '14-day hassle-free returns' },
              { icon: <Headphones size={22}/>, label: '24/7 Support', sub: 'Call or WhatsApp us anytime' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className={styles.trustItem}>
                <span className={styles.trustIcon}>{icon}</span>
                <div>
                  <p className={styles.trustLabel}>{label}</p>
                  <p className={styles.trustSub}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <Link to="/products" className={styles.seeAll}>See all <ArrowRight size={14}/></Link>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className={styles.catCard}>
                <span className={styles.catIcon} style={{ background: cat.color + '18' }}>
                  {cat.icon}
                </span>
                <span className={styles.catLabel}>{cat.label}</span>
                <ArrowRight size={14} className={styles.catArrow} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Sale ── */}
      <section className={styles.flashSale}>
        <div className="container">
          <div className={styles.flashHeader}>
            <div>
              <h2 className={styles.flashTitle}>⚡ Flash Sale</h2>
              <p className={styles.flashSub}>Deals end in</p>
            </div>
            <div className={styles.countdown}>
              {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((v, i) => (
                <span key={i} className={styles.countUnit}>
                  <span className={styles.countNum}>{v}</span>
                  <span className={styles.countLabel}>{['HRS','MIN','SEC'][i]}</span>
                  {i < 2 && <span className={styles.colon}>:</span>}
                </span>
              ))}
            </div>
            <Link to="/products" className="btn btn-outline btn-sm" style={{borderColor:'rgba(255,255,255,0.3)', color:'#fff'}}>
              View All
            </Link>
          </div>
          <div className="grid-products">
            {saleItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" className={styles.seeAll}>View all <ArrowRight size={14}/></Link>
          </div>
          <div className="grid-products stagger">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className={styles.promoBanner}>
        <div className="container">
          <div className={styles.promoGrid}>
            <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#0D1B2A,#243B55)' }}>
              <p className={styles.promoTag}>New Collection</p>
              <h3 className={styles.promoTitle}>Electronics for Every Lifestyle</h3>
              <Link to="/products?category=electronics" className="btn btn-primary btn-sm">Shop Now</Link>
              <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80" alt="" className={styles.promoImg} />
            </div>
            <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#1f0a1e,#3d1246)' }}>
              <p className={styles.promoTag}>Trending Now</p>
              <h3 className={styles.promoTitle}>Beauty & Skincare Essentials</h3>
              <Link to="/products?category=beauty" className="btn btn-primary btn-sm">Shop Now</Link>
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80" alt="" className={styles.promoImg} />
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
            <Link to="/products" className={styles.seeAll}>See all <ArrowRight size={14}/></Link>
          </div>
          <div className="grid-products">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{textAlign:'center',marginBottom:40}}>What Our Customers Say</h2>
          <div className={styles.testGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.id} className={styles.testCard}>
                <div className="stars" style={{marginBottom:10}}>
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={14} fill={n<=t.rating?'#F5C518':'none'} stroke={n<=t.rating?'#F5C518':'#D1D5DB'}/>
                  ))}
                </div>
                <p className={styles.testComment}>"{t.comment}"</p>
                <div className={styles.testAuthor}>
                  <div className={styles.testAvatar}>{t.name[0]}</div>
                  <div>
                    <p className={styles.testName}>{t.name}</p>
                    <p className={styles.testLoc}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div>
              <h2 className={styles.newsletterTitle}>Get Exclusive Deals</h2>
              <p className={styles.newsletterSub}>Subscribe and be the first to know about sales, new products, and offers.</p>
            </div>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="form-input" style={{maxWidth:320}} />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
