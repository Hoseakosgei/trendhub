const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const compression = require('compression')
const rateLimit  = require('express-rate-limit')
require('dotenv').config()

const authRoutes     = require('./routes/auth')
const productRoutes  = require('./routes/products')
const orderRoutes    = require('./routes/orders')
const paymentRoutes  = require('./routes/payments')
const userRoutes     = require('./routes/users')
const uploadRoutes   = require('./routes/uploads')
const { errorHandler }  = require('./middleware/errorHandler')
const { notFound }      = require('./middleware/notFound')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security Middleware ────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      scriptSrc:  ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// ── CORS ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token'],
}))

// ── Body Parsing ──────────────────────────────────────
// Raw body needed for Stripe webhook signature verification
app.use('/api/v1/payments/stripe/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Compression & Logging ─────────────────────────────
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Global Rate Limiter ───────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 100,
  message:  { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
})
app.use('/api', globalLimiter)

// ── Stricter Auth Rate Limiter ────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max:      10,
  message:  { error: 'Too many login attempts. Please try again in 15 minutes.' },
})
app.use('/api/v1/auth/login',    authLimiter)
app.use('/api/v1/auth/register', authLimiter)

// ── Health Check ──────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:      'ok',
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
    version:     '1.0.0',
  })
})

// ── API Routes ────────────────────────────────────────
app.use('/api/v1/auth',     authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/orders',   orderRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/users',    userRoutes)
app.use('/api/v1/uploads',  uploadRoutes)

// ── Error Handling ────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   TrendHub Kenya API                 ║
  ║   Running on port ${PORT}               ║
  ║   Env: ${(process.env.NODE_ENV || 'development').padEnd(28)}║
  ╚══════════════════════════════════════╝
  `)
})

module.exports = app
