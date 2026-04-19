// utils/helpers.js

/**
 * Generate a random OTP of given length
 */
function generateOTP(length = 6) {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

/**
 * Format a number as KES currency string
 */
function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

/**
 * Sanitize a phone number to Kenyan format 254XXXXXXXXX
 */
function sanitizePhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('254') && cleaned.length === 12) return cleaned
  if (cleaned.startsWith('0')   && cleaned.length === 10) return '254' + cleaned.slice(1)
  if (cleaned.startsWith('7')   && cleaned.length === 9)  return '254' + cleaned
  throw new Error('Invalid Kenyan phone number format')
}

/**
 * Paginate an array
 */
function paginate(array, page = 1, limit = 20) {
  const pageNum  = Math.max(1, parseInt(page))
  const pageSize = Math.min(100, parseInt(limit))
  const total    = array.length
  const items    = array.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  return {
    data:       items,
    pagination: {
      total,
      page:       pageNum,
      limit:      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext:    pageNum * pageSize < total,
      hasPrev:    pageNum > 1,
    },
  }
}

/**
 * Pick specified keys from an object
 */
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {})
}

/**
 * Omit specified keys from an object
 */
function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  )
}

/**
 * Sleep for ms milliseconds (useful in tests / retry logic)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate a short order/tracking reference
 */
function generateRef(prefix = 'TH') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

module.exports = { generateOTP, formatKES, sanitizePhone, paginate, pick, omit, sleep, generateRef }
