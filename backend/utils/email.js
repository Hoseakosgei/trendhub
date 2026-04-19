// utils/email.js
// In production wire up SendGrid. For dev we log to console.

async function sendEmail({ to, subject, html }) {
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send({
      to,
      from: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || 'TrendHub Kenya' },
      subject,
      html,
    })
  } else {
    // Dev: log to console
    console.log(`\n📧 [EMAIL] To: ${to} | Subject: ${subject}\n${html}\n`)
  }
}

// ── Templates ──────────────────────────────────────────────────

function orderConfirmationHTML(order, user) {
  const rows = order.items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${i.productName}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">KES ${i.lineTotal.toLocaleString()}</td>
    </tr>`).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0D1B2A;padding:32px 40px;text-align:center;">
      <div style="display:inline-block;background:#FF6B2B;color:#fff;width:40px;height:40px;border-radius:10px;line-height:40px;font-size:22px;font-weight:900;margin-bottom:12px;">T</div>
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">TrendHub Kenya</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="color:#0D1B2A;font-size:24px;margin:0 0 8px;">Order Confirmed! 🎉</h2>
      <p style="color:#6B7280;margin:0 0 24px;">Hi ${user.name}, your order has been placed successfully.</p>

      <div style="background:#f8f7f4;border-radius:10px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;">Order Number</p>
        <p style="margin:0;font-size:20px;font-weight:800;color:#0D1B2A;">${order.orderNumber}</p>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0;">
            <th style="padding:8px 0;text-align:left;font-size:12px;color:#9CA3AF;text-transform:uppercase;">Product</th>
            <th style="padding:8px 0;text-align:center;font-size:12px;color:#9CA3AF;text-transform:uppercase;">Qty</th>
            <th style="padding:8px 0;text-align:right;font-size:12px;color:#9CA3AF;text-transform:uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f0f0f0;padding-top:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#6B7280;">Subtotal</span>
          <span>KES ${order.subtotal.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <span style="color:#6B7280;">Delivery</span>
          <span style="color:${order.deliveryFee === 0 ? '#22C55E' : '#111'}">${order.deliveryFee === 0 ? 'FREE' : `KES ${order.deliveryFee}`}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:800;color:#0D1B2A;">
          <span>Total</span>
          <span>KES ${order.total.toLocaleString()}</span>
        </div>
      </div>

      <!-- Delivery Info -->
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:16px;margin-top:24px;">
        <p style="margin:0 0 4px;font-weight:600;color:#C2410C;">🚚 Delivery Address</p>
        <p style="margin:0;color:#6B7280;font-size:14px;">
          ${order.shippingAddress.street}, ${order.shippingAddress.town}, ${order.shippingAddress.county}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8f7f4;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;">Questions? Contact us at hello@trendhub.co.ke</p>
      <p style="margin:8px 0 0;font-size:11px;color:#D1D5DB;">© ${new Date().getFullYear()} TrendHub Kenya Ltd</p>
    </div>
  </div>
</body>
</html>`
}

function passwordResetHTML(name, resetLink) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0D1B2A;padding:28px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:20px;">TrendHub Kenya</h1>
    </div>
    <div style="padding:36px;">
      <h2 style="color:#0D1B2A;margin:0 0 12px;">Reset Your Password</h2>
      <p style="color:#6B7280;">Hi ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetLink}" style="background:#FF6B2B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">Reset Password</a>
      </div>
      <p style="color:#9CA3AF;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`
}

module.exports = { sendEmail, orderConfirmationHTML, passwordResetHTML }
