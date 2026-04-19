import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import styles from './ProductsPage.module.css'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
]

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort]     = useState('featured')
  const [priceMax, setPriceMax] = useState(25000)

  const activeCat = params.get('category') || ''

  function setCategory(cat) {
    const p = new URLSearchParams(params)
    if (cat) p.set('category', cat)
    else p.delete('category')
    setParams(p)
  }

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (activeCat) list = list.filter(p => p.category === activeCat)
    list = list.filter(p => p.price <= priceMax)
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break
      case 'price-desc': list.sort((a,b) => b.price - a.price); break
      case 'rating':     list.sort((a,b) => b.rating - a.rating); break
      default: break
    }
    return list
  }, [activeCat, sort, priceMax])

  const activeLabel = CATEGORIES.find(c => c.id === activeCat)?.label || 'All Products'

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span>Home</span> / <span>{activeLabel}</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{activeLabel}</h1>
          <span className={styles.count}>{filtered.length} products</span>
        </div>

        {/* Category pills */}
        <div className={styles.catPills}>
          <button
            className={`${styles.pill} ${!activeCat ? styles.pillActive : ''}`}
            onClick={() => setCategory('')}
          >All</button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`${styles.pill} ${activeCat === c.id ? styles.pillActive : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Filters</h3>
              <button onClick={() => setShowFilters(false)} className={styles.closeFilters}><X size={18}/></button>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Max Price</h4>
              <input
                type="range" min={500} max={25000} step={500}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.priceDisplay}>
                <span>KES 500</span>
                <span className={styles.priceMax}>KES {priceMax.toLocaleString()}</span>
              </div>
            </div>

            {/* Categories */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Category</h4>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input type="radio" name="cat" checked={!activeCat} onChange={() => setCategory('')} />
                  All Categories
                </label>
                {CATEGORIES.map(c => (
                  <label key={c.id} className={styles.filterOption}>
                    <input type="radio" name="cat" checked={activeCat === c.id} onChange={() => setCategory(c.id)} />
                    {c.icon} {c.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Min Rating</h4>
              {[4, 3, 2].map(r => (
                <label key={r} className={styles.filterOption}>
                  <input type="checkbox" />
                  {'★'.repeat(r)}{'☆'.repeat(5-r)} & up
                </label>
              ))}
            </div>

            <button
              className="btn btn-outline btn-full btn-sm"
              onClick={() => { setCategory(''); setPriceMax(25000); }}
            >
              Clear Filters
            </button>
          </aside>

          {/* Products */}
          <div className={styles.main}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button className={styles.filterToggle} onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={16} /> Filters
              </button>
              <div className={styles.sortWrap}>
                <label className={styles.sortLabel}>Sort by:</label>
                <div className={styles.sortSelect}>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="form-select" style={{paddingLeft:12,paddingRight:36,height:38,fontSize:13}}>
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>No products match your filters.</p>
                <button className="btn btn-primary btn-sm" onClick={() => { setCategory(''); setPriceMax(25000) }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid-products">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {showFilters && <div className={styles.overlay} onClick={() => setShowFilters(false)} />}
    </div>
  )
}
