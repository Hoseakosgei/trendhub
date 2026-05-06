import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import {
Package, ShoppingBag, Users, TrendingUp,
Plus, Edit2, Trash2, CheckCircle, Truck,
XCircle, BarChart2, LogOut, Bell
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { PRODUCTS, CATEGORIES, formatKES } from '@/data/products'
import toast from 'react-hot-toast'
import styles from './AdminPage.module.css'

// ── Mock data ──────────────────────────────────────────────────
const MOCK_ORDERS = [
{ id: 'TH-482910', customer: 'Amina Wanjiru',  email: 'amina@gmail.com',   total: 8500,  status: 'processing',      date: '19 Apr 2026', items: 3 },
{ id: 'TH-482891', customer: 'Brian Kamau',    email: 'brian@gmail.com',   total: 15000, status: 'shipped',          date: '19 Apr 2026', items: 1 },
{ id: 'TH-482750', customer: 'Faith Muthoni',  email: 'faith@gmail.com',   total: 4200,  status: 'delivered',        date: '18 Apr 2026', items: 2 },
{ id: 'TH-482630', customer: 'James Ochieng',  email: 'james@gmail.com',   total: 2800,  status: 'pending_payment',  date: '18 Apr 2026', items: 1 },
{ id: 'TH-482510', customer: 'Grace Njeri',    email: 'grace@gmail.com',   total: 6700,  status: 'processing',      date: '17 Apr 2026', items: 4 },
]

const MOCK_USERS = [
{ id: 1, name: 'Amina Wanjiru',  email: 'amina@gmail.com',   role: 'customer', joined: '01 Mar 2026', orders: 5 },
{ id: 2, name: 'Brian Kamau',    email: 'brian@gmail.com',   role: 'customer', joined: '15 Mar 2026', orders: 2 },
{ id: 3, name: 'Faith Muthoni',  email: 'faith@gmail.com',   role: 'customer', joined: '20 Mar 2026', orders: 8 },
{ id: 4, name: 'James Ochieng',  email: 'james@gmail.com',   role: 'customer', joined: '01 Apr 2026', orders: 1 },
{ id: 5, name: 'Admin User',     email: 'admin@trendhub.co.ke', role: 'admin', joined: '01 Jan 2026', orders: 0 },
]

const STATS = [
{ label: 'Total Revenue',  value: 'KES 284,500', icon: <TrendingUp size={20}/>, color: '#FF6B2B', bg: '#FFF0E8' },
{ label: 'Total Orders',   value: '142',          icon: <ShoppingBag size={20}/>, color: '#3B82F6', bg: '#EBF5FF' },
{ label: 'Total Products', value: '24',           icon: <Package size={20}/>,    color: '#10B981', bg: '#E8F5F0' },
{ label: 'Total Users',    value: '89',           icon: <Users size={20}/>,      color: '#8B5CF6', bg: '#F3EEFF' },
]

const STATUS_CONFIG = {
pending_payment: { label: 'Pending',    color: '#F59E0B', bg: '#FFFBEB' },
processing:      { label: 'Processing', color: '#3B82F6', bg: '#EBF5FF' },
shipped:         { label: 'Shipped',    color: '#8B5CF6', bg: '#F3EEFF' },
delivered:       { label: 'Delivered',  color: '#10B981', bg: '#E8F5F0' },
cancelled:       { label: 'Cancelled',  color: '#EF4444', bg: '#FEF2F2' },
}

const TABS = ['Overview', 'Orders', 'Products', 'Users']

export default function AdminPage() {
const { user, logout } = useAuthStore()
const [activeTab, setActiveTab]     = useState('Overview')
const [products, setProducts]       = useState(PRODUCTS)
const [orders, setOrders]           = useState(MOCK_ORDERS)
const [showAddProduct, setShowAdd]  = useState(false)  
const [editProduct, setEditProduct] = useState(null)
const [newProduct, setNewProduct]   = useState({
    name: '', price: '', category: 'fashion', stock: '', description: '', badge: ''
})

  // Redirect non-admins
if (!user) return <Navigate to="/login" />
if (user.email !== 'admin@trendhub.co.ke' && user.role !== 'admin') {
    return (
    <div className={`page ${styles.denied}`}>
        <XCircle size={48} color="var(--danger)" />
        <h2>Access Denied</h2>
        <p>You do not have admin privileges.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
    )
}

function updateOrderStatus(orderId, newStatus) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    toast.success(`Order ${orderId} updated to ${newStatus}`)
}

function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product removed')
}

function handleAddProduct(e) {
    e.preventDefault()
    const product = {
    ...newProduct,
    id:           Date.now(),
    price:        Number(newProduct.price),
    originalPrice: null,
    rating:       0,
    reviews:      0,
    stock:        Number(newProduct.stock),
    image:        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    badge:        newProduct.badge || null,
    }
    setProducts(prev => [product, ...prev])
    setNewProduct({ name: '', price: '', category: 'fashion', stock: '', description: '', badge: '' })
    setShowAdd(false)
    toast.success('Product added successfully!')
}

function handleLogout() {
    logout()
    toast.success('Signed out')
}

return (
    <div className={styles.page}>
      {/* ── Sidebar ── */}
    <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
        <div className={styles.logoBox}>T</div>
        <div>
            <p className={styles.logoTitle}>TrendHub</p>
            <p className={styles.logoSub}>Admin Panel</p>
        </div>
        </div>

        <nav className={styles.sidebarNav}>
        {TABS.map(tab => (
            <button
            key={tab}
            className={`${styles.navItem} ${activeTab === tab ? styles.navActive : ''}`}
            onClick={() => setActiveTab(tab)}
            >
            {tab === 'Overview'  && <BarChart2 size={18}/>}
            {tab === 'Orders'    && <ShoppingBag size={18}/>}
            {tab === 'Products'  && <Package size={18}/>}
            {tab === 'Users'     && <Users size={18}/>}
            {tab}
            </button>
        ))}
        </nav>

        <div className={styles.sidebarFooter}>
        <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>A</div>
            <div>
            <p className={styles.adminName}>{user.name}</p>
            <p className={styles.adminRole}>Administrator</p>
            </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16}/> Sign Out
        </button>
        </div>
    </aside>

      {/* ── Main ── */}
    <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
        <div>
            <h1 className={styles.headerTitle}>{activeTab}</h1>
            <p className={styles.headerSub}>
            {activeTab === 'Overview'  && 'Your store at a glance'}
            {activeTab === 'Orders'    && `${orders.length} total orders`}
            {activeTab === 'Products'  && `${products.length} products in catalogue`}
            {activeTab === 'Users'     && `${MOCK_USERS.length} registered users`}
            </p>
    </div>
        <div className={styles.headerActions}>
            <button className={styles.iconBtn}><Bell size={18}/></button>
            <Link to="/" className="btn btn-outline btn-sm">← View Store</Link>
        </div>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'Overview' && (
        <div className={styles.overviewContent}>
            {/* Stats */}
            <div className={styles.statsGrid}>
            {STATS.map(s => (
                <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
                    {s.icon}
                </div>
                <div>
                    <p className={styles.statLabel}>{s.label}</p>
                    <p className={styles.statValue}>{s.value}</p>
                </div>
                </div>
            ))}
            </div>

            {/* Recent Orders */}
            <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Orders</h2>
                <button className={styles.seeAll} onClick={() => setActiveTab('Orders')}>
                View all →
                </button>
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 4).map(o => {
                    const sc = STATUS_CONFIG[o.status]
                    return (
                        <tr key={o.id}>
                        <td className={styles.orderId}>{o.id}</td>
                        <td>{o.customer}</td>
                        <td className={styles.amount}>{formatKES(o.total)}</td>
                        <td>
                            <span className={styles.statusBadge} style={{ color: sc.color, background: sc.bg }}>
                            {sc.label}
                            </span>
                        </td>
                        </tr>
                    )
                    })}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'Orders' && (
        <div className={styles.section}>
            <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(o => {
                    const sc = STATUS_CONFIG[o.status]
                    return (
                    <tr key={o.id}>
                        <td className={styles.orderId}>{o.id}</td>
                        <td>
                        <p style={{ fontWeight: 500, fontSize: 14 }}>{o.customer}</p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{o.email}</p>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{o.date}</td>
                        <td style={{ textAlign: 'center' }}>{o.items}</td>
                        <td className={styles.amount}>{formatKES(o.total)}</td>
                        <td>
                        <span className={styles.statusBadge} style={{ color: sc.color, background: sc.bg }}>
                            {sc.label}
                        </span>
                        </td>
                        <td>
                        <select
                            className={styles.statusSelect}
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                        >
                            <option value="pending_payment">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        </td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
        </div>
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'Products' && (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Product Catalogue</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
                <Plus size={16}/> Add Product
            </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
            <div className={styles.addForm}>
                <h3 className={styles.formTitle}>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                <div className={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label">Product Name *</label>
                    <input required className="form-input" placeholder="e.g. Classic White Sneakers"
                        value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price (KES) *</label>
                    <input required type="number" className="form-input" placeholder="e.g. 3200"
                        value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                    <select className="form-select" value={newProduct.category}
                        onChange={e => setNewProduct(p => ({...p, category: e.target.value}))}>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock *</label>
                    <input required type="number" className="form-input" placeholder="e.g. 50"
                        value={newProduct.stock} onChange={e => setNewProduct(p => ({...p, stock: e.target.value}))} />
                    </div>
                    <div className="form-group">
                    <label className="form-label">Badge (optional)</label>
                    <select className="form-select" value={newProduct.badge}
                        onChange={e => setNewProduct(p => ({...p, badge: e.target.value}))}>
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Sale">Sale</option>
                        <option value="Hot">Hot</option>
                        <option value="Bestseller">Bestseller</option>
                    </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Description *</label>
                    <input required className="form-input" placeholder="Product description..."
                        value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button type="submit" className="btn btn-primary">Save Product</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
                </form>
            </div>
            )}

            {/* Products Table */}
            <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Badge</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(p => (
                    <tr key={p.id}>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image} alt={p.name} className={styles.productThumb} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>{p.name}</span>
                        </div>
                    </td>
                    <td style={{ fontSize: 13, textTransform: 'capitalize' }}>{p.category}</td>
                    <td className={styles.amount}>{formatKES(p.price)}</td>
                    <td>
                        <span style={{ color: p.stock < 10 ? 'var(--danger)' : 'var(--success)', fontWeight: 600, fontSize: 14 }}>
                        {p.stock}
                        </span>
                    </td>
                    <td style={{ fontSize: 13 }}>⭐ {p.rating}</td>
                    <td>
                        {p.badge
                        ? <span className={styles.productBadge}>{p.badge}</span>
                        : <span style={{ color: 'var(--gray-300)', fontSize: 13 }}>—</span>
                        }
                    </td>
                    <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                        <button className={styles.actionBtn} onClick={() => toast('Edit coming soon!')}>
                            <Edit2 size={14}/>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteProduct(p.id)}>
                            <Trash2 size={14}/>
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'Users' && (
        <div className={styles.section}>
            <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Orders</th>
                </tr>
                </thead>
                <tbody>
                {MOCK_USERS.map(u => (
                    <tr key={u.id}>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={styles.userAvatar}>{u.name[0]}</div>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</span>
                        </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{u.email}</td>
                    <td>
                        <span className={styles.roleBadge} style={{
                        background: u.role === 'admin' ? '#FFF0E8' : '#E8F5F0',
                        color: u.role === 'admin' ? '#C04828' : '#0F6E56'
                        }}>
                        {u.role}
                        </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{u.joined}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{u.orders}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        )}
    </main>
    </div>
)
}