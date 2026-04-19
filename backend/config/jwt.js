const jwt = require('jsonwebtoken')

const ACCESS_SECRET  = process.env.JWT_SECRET         || 'dev_access_secret_change_in_prod'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_prod'

/**
 * Generate a short-lived access token (15 min default)
 */
function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer:    'trendhub.co.ke',
    audience:  'trendhub-client',
  })
}

/**
 * Generate a long-lived refresh token (7 days default)
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer:    'trendhub.co.ke',
    audience:  'trendhub-client',
  })
}

/**
 * Verify an access token; throws on failure
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer:   'trendhub.co.ke',
    audience: 'trendhub-client',
  })
}

/**
 * Verify a refresh token; throws on failure
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET, {
    issuer:   'trendhub.co.ke',
    audience: 'trendhub-client',
  })
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }
