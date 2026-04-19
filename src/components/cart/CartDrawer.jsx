import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore, useUIStore } from '@/store'
import { formatKES } from '@/data/products'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQty, clearCart } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  if (!cartOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingBag size={20} />
            <span>Your Cart</span>
            <span className={styles.count}>{items.reduce((n,i)=>n+i.quantity,0)}</span>
          </div>
          <button onClick={closeCart} className={styles.close}><X size={20}/></button>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your cart is empty</p>
              <Link to="/products" className="btn btn-primary btn-sm" onClick={closeCart}>
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} className={styles.itemImg} />
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemPrice}>{formatKES(item.price)}</p>
                  <div className={styles.qty}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className={styles.qtyBtn} disabled={item.quantity <= 1}>
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className={styles.qtyBtn}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <p className={styles.itemTotal}>{formatKES(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className={styles.removeBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.subtotalAmt}>{formatKES(total)}</span>
            </div>
            <p className={styles.shipping}>Shipping calculated at checkout</p>
            <Link to="/checkout" className="btn btn-primary btn-full btn-lg" onClick={closeCart}>
              Proceed to Checkout
            </Link>
            <Link to="/cart" className="btn btn-outline btn-full" onClick={closeCart} style={{marginTop:'8px'}}>
              View Full Cart
            </Link>
            <button onClick={clearCart} className={styles.clearBtn}>Clear cart</button>
          </div>
        )}
      </aside>
    </>
  )
}
