// config/database.js
// ─────────────────────────────────────────────────────────────────
// In production this connects to PostgreSQL via Prisma.
// For local development without a DB, we use an in-memory store
// so the server runs out of the box.
// ─────────────────────────────────────────────────────────────────

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

// ── In-Memory Data Store (replace with Prisma + PostgreSQL in prod) ──
const db = {
  users: [],
  products: [],
  orders: [],
  payments: [],
  categories: [
    { id: 'fashion',     name: 'Fashion',       slug: 'fashion' },
    { id: 'electronics', name: 'Electronics',   slug: 'electronics' },
    { id: 'home',        name: 'Home & Living',  slug: 'home' },
    { id: 'beauty',      name: 'Beauty',         slug: 'beauty' },
    { id: 'sports',      name: 'Sports',         slug: 'sports' },
  ],
}

// Seed a default admin user
;(async () => {
  const hash = await bcrypt.hash('Admin@1234', 12)
  db.users.push({
    id:           uuidv4(),
    name:         'Admin User',
    email:        'admin@trendhub.co.ke',
    phone:        '+254700000000',
    passwordHash: hash,
    role:         'admin',
    createdAt:    new Date().toISOString(),
    isVerified:   true,
  })
})()

module.exports = { db }
