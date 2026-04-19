const bcrypt = require('bcryptjs')
const { db } = require('../config/database')

// ── GET /api/v1/users/profile ──────────────────────────────────
function getProfile(req, res) {
  res.json({ data: req.user })
}

// ── PUT /api/v1/users/profile ──────────────────────────────────
async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body
    const idx = db.users.findIndex(u => u.id === req.user.id)
    if (idx === -1) return res.status(404).json({ error: 'User not found.' })

    if (name)  db.users[idx].name  = name.trim()
    if (phone) db.users[idx].phone = phone.trim()
    db.users[idx].updatedAt = new Date().toISOString()

    const { passwordHash, ...safeUser } = db.users[idx]
    res.json({ message: 'Profile updated.', data: safeUser })
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/v1/users/password ─────────────────────────────────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    const idx  = db.users.findIndex(u => u.id === req.user.id)
    const user = db.users[idx]

    const match = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!match) return res.status(400).json({ error: 'Current password is incorrect.' })

    db.users[idx].passwordHash = await bcrypt.hash(newPassword, 12)
    db.users[idx].updatedAt    = new Date().toISOString()

    res.json({ message: 'Password changed successfully.' })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/v1/users (admin only) ────────────────────────────
function getAllUsers(req, res) {
  const { page = 1, limit = 20 } = req.query
  const pageNum  = parseInt(page)
  const pageSize = parseInt(limit)

  const users = db.users.map(({ passwordHash, ...u }) => u)
  const total = users.length

  res.json({
    data: users.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) },
  })
}

// ── GET /api/v1/users/:id (admin only) ────────────────────────
function getUserById(req, res) {
  const user = db.users.find(u => u.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found.' })
  const { passwordHash, ...safeUser } = user
  res.json({ data: safeUser })
}

// ── GET /api/v1/users/wishlist ─────────────────────────────────
function getWishlist(req, res) {
  // In production this queries the DB. Here we return a placeholder.
  res.json({ data: [], message: 'Wishlist is managed client-side in this version.' })
}

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, getUserById, getWishlist }
