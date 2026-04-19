import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, LogOut, Settings, MapPin, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'
import styles from './AccountPage.module.css'

const MOCK_ORDERS = [
  { id: 'TH-284719', date: '10 Apr 2026', status: 'Delivered',  total: 'KES 4,500', items: 2 },
  { id: 'TH-284105', date: '01 Apr 2026', status: 'Processing', total: 'KES 8,700', items: 3 },
  { id: 'TH-283402', date: '22 Mar 2026', status: 'Shipped',    total: 'KES 2,200', items: 1 },
]

export default function AccountPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!user) return (
    <div className={`page ${styles.empty}`}>
      <h2>Please sign in to view your account</h2>
      <Link to="/login" className="btn btn-primary">Sign In</Link>
    </div>
  )

  function handleLogout() {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const statusColor = s => s === 'Delivered' ? 'badge-success' : s === 'Processing' ? 'badge-gold' : 'badge-navy'

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
          <button onClick={handleLogout} className={`btn btn-outline btn-sm ${styles.logoutBtn}`}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Nav */}
          <aside className={styles.sidebar}>
            {[
              { icon:<Package size={18}/>,    label:'My Orders',   active:true },
              { icon:<Heart size={18}/>,      label:'Wishlist',    href:'/wishlist' },
              { icon:<MapPin size={18}/>,     label:'Addresses',   href:'#' },
              { icon:<CreditCard size={18}/>, label:'Payment',     href:'#' },
              { icon:<Settings size={18}/>,   label:'Settings',    href:'#' },
            ].map(item => (
              item.href ? (
                <Link key={item.label} to={item.href} className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}>
                  {item.icon} {item.label}
                </Link>
              ) : (
                <button key={item.label} className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}>
                  {item.icon} {item.label}
                </button>
              )
            ))}
          </aside>

          {/* Orders */}
          <main>
            <h2 className={styles.sectionTitle}>My Orders</h2>
            <div className={styles.orders}>
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <p className={styles.orderId}>{order.id}</p>
                      <p className={styles.orderDate}>{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                    </div>
                    <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className={styles.orderFooter}>
                    <span className={styles.orderTotal}>{order.total}</span>
                    <button className="btn btn-outline btn-sm">Track Order</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
