import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '@/store'
import { CATEGORIES } from '@/data/products'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [query, setQuery]           = useState('')
  const [catOpen, setCatOpen]       = useState(false)
  const navigate    = useNavigate()
  const location    = useLocation()
  const cartCount   = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
  const wishCount   = useWishlistStore(s => s.items.length)
  const { user }    = useAuthStore()
  const { openCart, menuOpen, toggleMenu, closeMenu, searchOpen, openSearch, closeSearch } = useUIStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { closeMenu() }, [location.pathname])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      closeSearch()
    }
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>T</span>
            <span>TrendHub</span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.links}>
            <Link to="/" className={styles.link}>Home</Link>
            <div
              className={styles.dropdown}
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className={styles.link}>
                Categories <ChevronDown size={14} />
              </button>
              {catOpen && (
                <div className={styles.dropMenu}>
                  {CATEGORIES.map(c => (
                    <Link
                      key={c.id}
                      to={`/products?category=${c.id}`}
                      className={styles.dropItem}
                      onClick={() => setCatOpen(false)}
                    >
                      <span>{c.icon}</span> {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/products" className={styles.link}>All Products</Link>
          </div>

          {/* Search Bar (desktop) */}
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              className={styles.searchInput}
            />
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={openSearch} className={styles.iconBtn} aria-label="Search" title="Search">
              <Search size={20} />
            </button>

            <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={20} />
              {wishCount > 0 && <span className={styles.badge}>{wishCount}</span>}
            </Link>

            <Link to={user ? '/account' : '/login'} className={styles.iconBtn} aria-label="Account">
              <User size={20} />
            </Link>

            <button onClick={openCart} className={styles.cartBtn} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>

            <button className={styles.menuBtn} onClick={toggleMenu} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className={styles.searchOverlay}>
            <form onSubmit={handleSearch} className={styles.searchOverlayForm}>
              <Search size={18} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                className={styles.searchOverlayInput}
              />
              <button type="button" onClick={closeSearch}><X size={18} /></button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink}>Home</Link>
          <Link to="/products" className={styles.mobileLink}>All Products</Link>
          {CATEGORIES.map(c => (
            <Link key={c.id} to={`/products?category=${c.id}`} className={styles.mobileLink}>
              {c.icon} {c.label}
            </Link>
          ))}
          <Link to="/wishlist" className={styles.mobileLink}>❤️ Wishlist ({wishCount})</Link>
          <Link to={user ? '/account' : '/login'} className={styles.mobileLink}>
            {user ? `👤 ${user.name}` : '🔑 Login / Register'}
          </Link>
          <div style={{ padding: '16px' }}>
            <button onClick={() => { openCart(); closeMenu() }} className="btn btn-primary btn-full">
              🛒 Cart ({cartCount})
            </button>
          </div>
        </div>
      )}
    </>
  )
}
