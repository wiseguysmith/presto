interface OrderEmailInput {
  to: string
  orderId: string
  restaurantName: string
  tableNumber: number
  total: number
  paymentMethod: string
}

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  restaurantName,
  tableNumber,
  total,
  paymentMethod,
}: OrderEmailInput) {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.PRESTO_FROM_EMAIL || 'orders@mindfultech.services'

  if (!resendApiKey) {
    console.log('PRESTO email skipped; RESEND_API_KEY is not configured', { to, orderId })
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `PRESTO <${fromEmail}>`,
      to,
      subject: `${restaurantName} order confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
          <h1>Your order was received</h1>
          <p>Thank you for ordering from ${restaurantName}. Please stay at table ${tableNumber}; staff will assist you shortly.</p>
          <p><strong>Order:</strong> ${orderId}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Payment:</strong> ${paymentMethod === 'card' ? 'Card' : 'Pay at counter/table'}</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('PRESTO confirmation email failed', text)
  }
}
