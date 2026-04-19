import { Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home } from 'lucide-react'
import styles from './OrderConfirmationPage.module.css'

export default function OrderConfirmationPage() {
  const orderNo = `TH-${Date.now().toString().slice(-6)}`

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <CheckCircle size={56} color="var(--success)" />
        </div>
        <h1 className={styles.title}>Order Confirmed! 🎉</h1>
        <p className={styles.sub}>Thank you for shopping with TrendHub Kenya. Your order has been placed successfully.</p>
        <div className={styles.orderNo}>
          <span>Order Number</span>
          <strong>{orderNo}</strong>
        </div>

        {/* Tracking Steps */}
        <div className={styles.track}>
          {[
            { icon: <CheckCircle size={20}/>, label: 'Order Placed', done: true },
            { icon: <Package size={20}/>,     label: 'Processing',   done: false },
            { icon: <Truck size={20}/>,       label: 'Shipped',      done: false },
            { icon: <Home size={20}/>,        label: 'Delivered',    done: false },
          ].map((s, i) => (
            <div key={s.label} className={styles.trackItem}>
              <div className={`${styles.trackDot} ${s.done ? styles.trackDone : ''}`}>
                {s.icon}
              </div>
              <span className={`${styles.trackLabel} ${s.done ? styles.trackLabelDone : ''}`}>{s.label}</span>
              {i < 3 && <div className={`${styles.trackLine} ${s.done ? styles.trackLineDone : ''}`}/>}
            </div>
          ))}
        </div>

        <div className={styles.info}>
          <p>📧 A confirmation email has been sent to your email address.</p>
          <p>📱 You will receive SMS updates as your order progresses.</p>
          <p>🚚 Estimated delivery: <strong>1-3 business days</strong></p>
        </div>

        <div className={styles.ctas}>
          <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          <Link to="/account" className="btn btn-outline">Track Order</Link>
        </div>
      </div>
    </div>
  )
}
