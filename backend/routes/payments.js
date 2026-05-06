const router = require('express').Router()
const {
  initiateMpesa,
  mpesaCallback,
  createStripeIntent,
  stripeWebhook,
  getPaymentByOrder,
} = require('../controllers/paymentController')
const { protect } = require('../middleware/auth')
router.post('/simulate-success', paymentController.simulateMpesaSuccess);
// M-Pesa
router.post('/mpesa',          protect, initiateMpesa)
router.post('/mpesa/callback',          mpesaCallback)   // Safaricom webhook (no auth)

// Stripe
router.post('/stripe/intent',  protect, createStripeIntent)
router.post('/stripe/webhook',          stripeWebhook)   // Stripe webhook (raw body, no auth)

// Query
router.get('/order/:orderId',  protect, getPaymentByOrder)

module.exports = router
