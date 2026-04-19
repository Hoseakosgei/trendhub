const { v4: uuidv4 } = require('uuid')
const { db } = require('../config/database')

const ORDER_STATUSES = ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

// ── POST /api/v1/orders ────────────────────────────────────────
function createOrder(req, res) {
  const { items, shippingAddress, notes } = req.body

  // Validate items and compute totals
  const orderItems = []
  let subtotal = 0

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId && p.isActive)
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found or unavailable.` })
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for "${product.name}". Only ${product.stock} left.` })
    }

    const lineTotal = product.price * item.quantity
    subtotal += lineTotal
    orderItems.push({
      id:          uuidv4(),
      productId:   product.id,
      productName: product.name,
      productImage: product.images?.[0] || null,
      quantity:    item.quantity,
      unitPrice:   product.price,
      lineTotal,
    })
  }

  const deliveryFee = subtotal >= 3000 ? 0 : 350
  const total       = subtotal + deliveryFee

  const order = {
    id:              uuidv4(),
    orderNumber:     `TH-${Date.now().toString().slice(-6)}`,
    userId:          req.user.id,
    items:           orderItems,
    shippingAddress,
    notes:           notes || '',
    subtotal,
    deliveryFee,
    total,
    status:          'pending_payment',
    paymentStatus:   'pending',
    paymentMethod:   null,
    trackingNumber:  null,
    createdAt:       new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
  }
  db.orders.push(order)

  res.status(201).json({ message: 'Order created.', data: order })
}

// ── GET /api/v1/orders ─────────────────────────────────────────
function getOrders(req, res) {
  const { page = 1, limit = 10, status } = req.query
  const isAdmin = req.user.role === 'admin'

  let results = isAdmin
    ? [...db.orders]
    : db.orders.filter(o => o.userId === req.user.id)

  if (status) results = results.filter(o => o.status === status)

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const pageNum  = Math.max(1, parseInt(page))
  const pageSize = Math.min(50, parseInt(limit))
  const total    = results.length
  const items    = results.slice((pageNum - 1) * pageSize, pageNum * pageSize)

  res.json({ data: items, pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) } })
}

// ── GET /api/v1/orders/:id ─────────────────────────────────────
function getOrder(req, res) {
  const order = db.orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })

  // Non-admins can only view their own orders
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied.' })
  }

  res.json({ data: order })
}

// ── PATCH /api/v1/orders/:id/status (admin only) ──────────────
function updateOrderStatus(req, res) {
  const { status, trackingNumber } = req.body

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}` })
  }

  const idx = db.orders.findIndex(o => o.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Order not found.' })

  db.orders[idx] = {
    ...db.orders[idx],
    status,
    trackingNumber: trackingNumber || db.orders[idx].trackingNumber,
    updatedAt:      new Date().toISOString(),
  }

  res.json({ message: 'Order status updated.', data: db.orders[idx] })
}

// ── POST /api/v1/orders/:id/cancel ────────────────────────────
function cancelOrder(req, res) {
  const order = db.orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied.' })
  }
  if (['shipped', 'delivered'].includes(order.status)) {
    return res.status(400).json({ error: 'Cannot cancel an order that has been shipped or delivered.' })
  }

  order.status    = 'cancelled'
  order.updatedAt = new Date().toISOString()
  res.json({ message: 'Order cancelled.', data: order })
}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder }
