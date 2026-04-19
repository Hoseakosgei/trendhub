const bcrypt   = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { db }   = require('../config/database')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt')

// ── POST /api/v1/auth/register ─────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body

    // Check duplicate email
    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    // Hash password (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12)

    const user = {
      id:           uuidv4(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      phone:        phone.trim(),
      passwordHash,
      role:         'customer',
      isVerified:   false,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    }
    db.users.push(user)

    const accessToken  = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    const { passwordHash: _, ...safeUser } = user

    res.status(201).json({
      message:      'Account created successfully.',
      user:         safeUser,
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/v1/auth/login ────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = db.users.find(u => u.email === email.toLowerCase().trim())
    if (!user) {
      // Generic message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const accessToken  = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    })

    const { passwordHash, ...safeUser } = user

    res.json({
      message: 'Login successful.',
      user:    safeUser,
      accessToken,
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/v1/auth/refresh ──────────────────────────────────
function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken
    if (!token) {
      return res.status(401).json({ error: 'Refresh token not provided.' })
    }

    const decoded = verifyRefreshToken(token)
    const user    = db.users.find(u => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'User not found.' })
    }

    const accessToken     = signAccessToken({ userId: user.id, role: user.role })
    const newRefreshToken = signRefreshToken({ userId: user.id })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    })

    res.json({ accessToken })
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired. Please sign in again.' })
    }
    next(err)
  }
}

// ── POST /api/v1/auth/logout ───────────────────────────────────
function logout(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.json({ message: 'Logged out successfully.' })
}

// ── GET /api/v1/auth/me ────────────────────────────────────────
function me(req, res) {
  res.json({ user: req.user })
}

module.exports = { register, login, refreshToken, logout, me }
