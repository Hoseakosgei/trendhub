// utils/sms.js
// Sends SMS via Africa's Talking API. Falls back to console log in dev.

async function sendSMS(to, message) {
  if (process.env.AT_API_KEY && process.env.AT_USERNAME !== 'sandbox') {
    const AfricasTalking = require('africastalking')
    const at  = AfricasTalking({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME })
    const sms = at.SMS
    await sms.send({ to: [to], message, from: process.env.AT_SENDER_ID || 'TrendHub' })
  } else {
    console.log(`\n📱 [SMS] To: ${to}\n${message}\n`)
  }
}

// ── Message Templates ──────────────────────────────────────────

function orderConfirmedSMS(orderNumber, total) {
  return `TrendHub: Your order ${orderNumber} is confirmed. Total: KES ${total.toLocaleString()}. Track at trendhub.co.ke. Thank you!`
}

function orderShippedSMS(orderNumber, tracking) {
  return `TrendHub: Order ${orderNumber} has been shipped. Tracking: ${tracking}. Expected delivery: 1-3 days.`
}

function orderDeliveredSMS(orderNumber) {
  return `TrendHub: Order ${orderNumber} delivered! We hope you love your purchase. Rate us at trendhub.co.ke`
}

function otpSMS(otp) {
  return `Your TrendHub verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`
}

module.exports = { sendSMS, orderConfirmedSMS, orderShippedSMS, orderDeliveredSMS, otpSMS }
