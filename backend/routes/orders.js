const router = require('express').Router()
const {
  createOrder, getOrders, getOrder,
  updateOrderStatus, cancelOrder,
} = require('../controllers/orderController')
const { protect, requireAdmin } = require('../middleware/auth')
const { orderRules, validate } = require('../middleware/validation')

// All order routes require authentication
router.use(protect)

router.post('/',                              orderRules, validate, createOrder)
router.get('/',                               getOrders)
router.get('/:id',                            getOrder)
router.post('/:id/cancel',                    cancelOrder)

// Admin only
router.patch('/:id/status', requireAdmin,     updateOrderStatus)

module.exports = router
