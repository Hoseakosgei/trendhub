const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const { db } = require('../config/database')

// ── Helpers ────────────────────────────────────────────────────
exports.simulateMpesaSuccess = async (req, res) => {
    const { orderId } = req.body;
    
    // This is the exact format Safaricom uses for a successful payment
    const mockCallbackData = {
        Body: {
            stkCallback: {
                ResultCode: 0,
                ResultDesc: "The service request is processed successfully.",
                CallbackMetadata: {
                    Item: [
                        { Name: "Amount", Value: 1.00 },
                        { Name: "MpesaReceiptNumber", Value: "SIMULATED_SUCCESS" },
                        { Name: "TransactionDate", Value: Date.now() },
                        { Name: "PhoneNumber", Value: "254708374149" }
                    ]
                }
            }
        }
    };

    // Now, call your existing callback logic using this fake data
    // This will update the order in your database as if Safaricom sent it
    await processMpesaCallback(mockCallbackData, orderId); 
    
    res.status(200).json({ message: "Simulation successful" });
};
async function getMpesaToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const baseUrl = process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

  const { data } = await axios.get(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  )
  return data.access_token
}

function getMpesaTimestamp() {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
}

// ── POST /api/v1/payments/mpesa ───────────────────────────────
async function initiateMpesa(req, res, next) {
  try {
    const { orderId, phoneNumber } = req.body

    const order = db.orders.find(o => o.id === orderId)
    if (!order) return res.status(404).json({ error: 'Order not found.' })
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' })
    if (order.paymentStatus === 'paid') return res.status(400).json({ error: 'Order already paid.' })

    // Sanitize phone: ensure format 254XXXXXXXXX
    const phone = phoneNumber.replace(/^(\+?254|0)/, '254')

    const timestamp = getMpesaTimestamp()
    const password  = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const baseUrl = process.env.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke'

    const token = await getMpesaToken()

    const { data } = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password:          password,
        Timestamp:         timestamp,
        TransactionType:   'CustomerPayBillOnline',
        Amount:            Math.ceil(order.total),
        PartyA:            phone,
        PartyB:            process.env.MPESA_SHORTCODE,
        PhoneNumber:       phone,
        CallBackURL:       process.env.MPESA_CALLBACK_URL,
        AccountReference:  order.orderNumber,
        TransactionDesc:   `TrendHub Order ${order.orderNumber}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Record pending payment
    const payment = {
      id:                 uuidv4(),
      orderId,
      method:             'mpesa',
      amount:             order.total,
      currency:           'KES',
      status:             'pending',
      checkoutRequestId:  data.CheckoutRequestID,
      merchantRequestId:  data.MerchantRequestID,
      phone,
      createdAt:          new Date().toISOString(),
    }
    db.payments.push(payment)

    res.json({
      message:          'M-Pesa STK push sent. Please enter your PIN.',
      checkoutRequestId: data.CheckoutRequestID,
    })
  } catch (err) {
    if (err.response?.data) {
      return res.status(400).json({ error: err.response.data.errorMessage || 'M-Pesa request failed.' })
    }
    next(err)
  }
}

// ── POST /api/v1/payments/mpesa/callback (Safaricom webhook) ──
function mpesaCallback(req, res) {
  const { Body } = req.body
  const callbackData = Body?.stkCallback

  if (!callbackData) {
    return res.status(400).json({ error: 'Invalid callback data.' })
  }

  const { CheckoutRequestID, ResultCode, ResultDesc } = callbackData

  // Find matching payment
  const paymentIdx = db.payments.findIndex(p => p.checkoutRequestId === CheckoutRequestID)

  if (paymentIdx !== -1) {
    const payment = db.payments[paymentIdx]

    if (ResultCode === 0) {
      // Success
      const metadata = callbackData.CallbackMetadata?.Item || []
      const get = name => metadata.find(i => i.Name === name)?.Value

      db.payments[paymentIdx] = {
        ...payment,
        status:          'paid',
        mpesaReceiptNo:  get('MpesaReceiptNumber'),
        transactionDate: get('TransactionDate'),
        updatedAt:       new Date().toISOString(),
      }

      // Update order
      const orderIdx = db.orders.findIndex(o => o.id === payment.orderId)
      if (orderIdx !== -1) {
        db.orders[orderIdx].paymentStatus  = 'paid'
        db.orders[orderIdx].paymentMethod  = 'mpesa'
        db.orders[orderIdx].status         = 'processing'
        db.orders[orderIdx].updatedAt      = new Date().toISOString()
      }
    } else {
      db.payments[paymentIdx].status    = 'failed'
      db.payments[paymentIdx].failReason = ResultDesc
      db.payments[paymentIdx].updatedAt  = new Date().toISOString()
    }
  }

  // Always respond 200 to Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' })
}

// ── POST /api/v1/payments/stripe/intent ───────────────────────
async function createStripeIntent(req, res, next) {
  try {
    // Dynamic import to avoid crashing if Stripe key not set
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: 'Stripe not configured.' })
    }

    const Stripe = require('stripe')
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

    const { orderId } = req.body
    const order = db.orders.find(o => o.id === orderId)
    if (!order) return res.status(404).json({ error: 'Order not found.' })
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied.' })

    // Amount in smallest currency unit (KES cents = fils; Stripe uses minor units)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.ceil(order.total * 100),
      currency: 'kes',
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    })

    // Record pending payment
    db.payments.push({
      id:              uuidv4(),
      orderId,
      method:          'stripe',
      amount:          order.total,
      currency:        'KES',
      status:          'pending',
      stripePaymentId: paymentIntent.id,
      createdAt:       new Date().toISOString(),
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/v1/payments/stripe/webhook ──────────────────────
function stripeWebhook(req, res) {
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).end()

  const Stripe  = require('stripe')
  const stripe  = Stripe(process.env.STRIPE_SECRET_KEY)
  const sig     = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi       = event.data.object
    const orderId  = pi.metadata?.orderId
    const orderIdx = db.orders.findIndex(o => o.id === orderId)
    if (orderIdx !== -1) {
      db.orders[orderIdx].paymentStatus = 'paid'
      db.orders[orderIdx].paymentMethod = 'stripe'
      db.orders[orderIdx].status        = 'processing'
      db.orders[orderIdx].updatedAt     = new Date().toISOString()
    }
    const paymentIdx = db.payments.findIndex(p => p.stripePaymentId === pi.id)
    if (paymentIdx !== -1) {
      db.payments[paymentIdx].status    = 'paid'
      db.payments[paymentIdx].updatedAt = new Date().toISOString()
    }
  }

  res.json({ received: true })
}

// ── GET /api/v1/payments/order/:orderId ───────────────────────
function getPaymentByOrder(req, res) {
  const payment = db.payments.find(p => p.orderId === req.params.orderId)
  if (!payment) return res.status(404).json({ error: 'No payment found for this order.' })
  res.json({ data: payment })
}

module.exports = { initiateMpesa, mpesaCallback, createStripeIntent, stripeWebhook, getPaymentByOrder }
