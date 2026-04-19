const router = require('express').Router()
const { register, login, refreshToken, logout, me } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { registerRules, loginRules, validate } = require('../middleware/validation')

// Public routes
router.post('/register', registerRules, validate, register)
router.post('/login',    loginRules,    validate, login)
router.post('/refresh',  refreshToken)
router.post('/logout',   logout)

// Protected routes
router.get('/me', protect, me)

module.exports = router
