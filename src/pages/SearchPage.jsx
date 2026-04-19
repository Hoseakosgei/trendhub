import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        <div className={styles.header}>
          <Search size={24} color="var(--gray-400)" />
          <h1 className={styles.title}>
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
        </div>
        <p className={styles.count}>{results.length} products found</p>

        {results.length === 0 ? (
          <div className={styles.empty}>
            <p>No products found for "<strong>{query}</strong>"</p>
            <p style={{fontSize:14,color:'var(--gray-400)'}}>Try a different search term</p>
          </div>
        ) : (
          <div className="grid-products">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
