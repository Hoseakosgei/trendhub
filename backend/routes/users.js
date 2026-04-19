const router = require('express').Router()
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  getWishlist,
} = require('../controllers/userController')
const { protect, requireAdmin } = require('../middleware/auth')

// All user routes require authentication
router.use(protect)

// Current user
router.get('/profile',          getProfile)
router.put('/profile',          updateProfile)
router.put('/password',         changePassword)
router.get('/wishlist',         getWishlist)

// Admin only
router.get('/',         requireAdmin, getAllUsers)
router.get('/:id',      requireAdmin, getUserById)

module.exports = router
