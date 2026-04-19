const { verifyAccessToken } = require('../config/jwt')
const { db } = require('../config/database')

/**
 * protect – requires valid JWT access token in Authorization header
 */
function protect(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Please sign in.' })
    }

    const token   = header.split(' ')[1]
    const decoded = verifyAccessToken(token)

    // Attach user to request (exclude passwordHash)
    const user = db.users.find(u => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' })
    }

    const { passwordHash, ...safeUser } = user
    req.user = safeUser
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please sign in again.' })
    }
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

/**
 * requireAdmin – must come after protect
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' })
  }
  next()
}

/**
 * optionalAuth – attaches user if token present but does not block
 */
function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const token   = header.split(' ')[1]
      const decoded = verifyAccessToken(token)
      const user    = db.users.find(u => u.id === decoded.userId)
      if (user) {
        const { passwordHash, ...safeUser } = user
        req.user = safeUser
      }
    }
  } catch (_) { /* ignore */ }
  next()
}

module.exports = { protect, requireAdmin, optionalAuth }
