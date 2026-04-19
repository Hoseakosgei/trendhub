import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatKES } from '@/data/products'
import styles from './CartPage.module.css'

const DELIVERY_FEE = 350

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const freeDelivery = subtotal >= 3000
  const delivery = freeDelivery ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  if (items.length === 0) return (
    <div className={`page ${styles.emptyPage}`}>
      <ShoppingBag size={72} strokeWidth={1} color="var(--gray-300)" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  )

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart</h1>
        <p className={styles.count}>{items.reduce((n,i)=>n+i.quantity,0)} items</p>

        <div className={styles.layout}>
          {/* Items */}
          <div className={styles.items}>
            {items.map(item => (
              <div key={item.id} className={styles.item}>
                <Link to={`/products/${item.id}`} className={styles.itemImg}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className={styles.itemInfo}>
                  <p className={styles.itemCat}>{item.category}</p>
                  <Link to={`/products/${item.id}`} className={styles.itemName}>{item.name}</Link>
                  <p className={styles.itemPrice}>{formatKES(item.price)} each</p>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.qty}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity<=1} className={styles.qtyBtn}>
                      <Minus size={14}/>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className={styles.qtyBtn}>
                      <Plus size={14}/>
                    </button>
                  </div>
                  <p className={styles.itemTotal}>{formatKES(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className={styles.removeBtn}>
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className={styles.clearCart}>
              <Trash2 size={14}/> Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>

            {/* Coupon */}
            <div className={styles.coupon}>
              <Tag size={16} />
              <input type="text" placeholder="Coupon code" className="form-input" style={{flex:1,height:40,fontSize:13}} />
              <button className="btn btn-outline btn-sm">Apply</button>
            </div>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Subtotal</span><span>{formatKES(subtotal)}</span>
              </div>
              <div className={styles.summaryLine}>
                <span>Delivery</span>
                <span style={{color: freeDelivery ? 'var(--success)' : 'inherit'}}>
                  {freeDelivery ? 'FREE' : formatKES(DELIVERY_FEE)}
                </span>
              </div>
              {!freeDelivery && (
                <p className={styles.freeHint}>
                  Add {formatKES(3000 - subtotal)} more for free delivery
                </p>
              )}
            </div>

            <div className={styles.total}>
              <span>Total</span>
              <span className={styles.totalAmt}>{formatKES(total)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-full btn-lg" style={{marginTop:20}}>
              Proceed to Checkout <ArrowRight size={18}/>
            </Link>

            <Link to="/products" className="btn btn-ghost btn-full" style={{marginTop:8}}>
              Continue Shopping
            </Link>

            {/* Payment icons */}
            <div className={styles.payIcons}>
              <span>Accepted payments:</span>
              <div className={styles.payBadges}>
                {['M-Pesa','Visa','Mastercard','PayPal'].map(p => (
                  <span key={p} className={styles.payBadge}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
