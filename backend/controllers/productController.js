const { v4: uuidv4 } = require('uuid')
const { db } = require('../config/database')

// ── GET /api/v1/products ───────────────────────────────────────
function getProducts(req, res) {
  const {
    category, search, minPrice, maxPrice,
    sort = 'createdAt', order = 'desc',
    page = 1, limit = 20,
  } = req.query

  let results = [...db.products]

  // Filter
  if (category)  results = results.filter(p => p.categoryId === category)
  if (minPrice)  results = results.filter(p => p.price >= Number(minPrice))
  if (maxPrice)  results = results.filter(p => p.price <= Number(maxPrice))
  if (search) {
    const q = search.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }
  // Only show active products to non-admins
  if (req.user?.role !== 'admin') {
    results = results.filter(p => p.isActive)
  }

  // Sort
  results.sort((a, b) => {
    if (sort === 'price')  return order === 'asc' ? a.price - b.price : b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  // Paginate
  const pageNum  = Math.max(1, parseInt(page))
  const pageSize = Math.min(100, parseInt(limit))
  const total    = results.length
  const items    = results.slice((pageNum - 1) * pageSize, pageNum * pageSize)

  res.json({
    data:       items,
    pagination: {
      total,
      page:       pageNum,
      limit:      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}

// ── GET /api/v1/products/:id ───────────────────────────────────
function getProduct(req, res) {
  const product = db.products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  res.json({ data: product })
}

// ── POST /api/v1/products (admin only) ────────────────────────
function createProduct(req, res) {
  const {
    name, description, price, originalPrice,
    categoryId, stock, images = [], badge,
  } = req.body

  const product = {
    id:            uuidv4(),
    name:          name.trim(),
    description:   description?.trim() || '',
    price:         Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    categoryId,
    stock:         Number(stock),
    images,
    badge:         badge || null,
    rating:        0,
    reviewCount:   0,
    isActive:      true,
    createdAt:     new Date().toISOString(),
    updatedAt:     new Date().toISOString(),
  }
  db.products.push(product)
  res.status(201).json({ message: 'Product created.', data: product })
}

// ── PUT /api/v1/products/:id (admin only) ─────────────────────
function updateProduct(req, res) {
  const idx = db.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Product not found.' })

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    id:        db.products[idx].id,
    updatedAt: new Date().toISOString(),
  }
  res.json({ message: 'Product updated.', data: db.products[idx] })
}

// ── DELETE /api/v1/products/:id (admin only) ──────────────────
function deleteProduct(req, res) {
  const idx = db.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Product not found.' })

  // Soft delete
  db.products[idx].isActive  = false
  db.products[idx].updatedAt = new Date().toISOString()
  res.json({ message: 'Product deactivated.' })
}

// ── GET /api/v1/products/categories ───────────────────────────
function getCategories(_req, res) {
  res.json({ data: db.categories })
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories }
