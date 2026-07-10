import { PricedOrderItem, dollarsToCents } from '@/lib/orders/totals'

interface CreateStripeCheckoutSessionInput {
  orderId: string
  restaurantName: string
  tableNumber: number
  customerEmail: string
  items: PricedOrderItem[]
  tipAmount: number
  platformFeeAmount: number
}

interface StripeCheckoutSession {
  id: string
  url: string
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'
}

function appendFormValue(form: URLSearchParams, key: string, value: string | number | boolean) {
  form.append(key, String(value))
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_CONNECTED_ACCOUNT_ID)
}

export async function createStripeCheckoutSession({
  orderId,
  restaurantName,
  tableNumber,
  customerEmail,
  items,
  tipAmount,
  platformFeeAmount,
}: CreateStripeCheckoutSessionInput): Promise<StripeCheckoutSession> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const connectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID

  if (!stripeSecretKey || !connectedAccountId) {
    throw new Error('Stripe is not configured')
  }

  const form = new URLSearchParams()

  appendFormValue(form, 'mode', 'payment')
  appendFormValue(form, 'customer_email', customerEmail)
  appendFormValue(form, 'success_url', `${getSiteUrl()}/order/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`)
  appendFormValue(form, 'cancel_url', `${getSiteUrl()}/menu/pink-flamingo/table/${tableNumber}?payment=cancelled`)
  appendFormValue(form, 'payment_intent_data[application_fee_amount]', dollarsToCents(platformFeeAmount))
  appendFormValue(form, 'payment_intent_data[transfer_data][destination]', connectedAccountId)
  appendFormValue(form, 'metadata[order_id]', orderId)
  appendFormValue(form, 'metadata[table_number]', tableNumber)

  items.forEach((item, index) => {
    appendFormValue(form, `line_items[${index}][price_data][currency]`, 'usd')
    appendFormValue(form, `line_items[${index}][price_data][product_data][name]`, item.name)
    appendFormValue(
      form,
      `line_items[${index}][price_data][product_data][description]`,
      `${restaurantName} Table ${tableNumber}`
    )
    appendFormValue(form, `line_items[${index}][price_data][unit_amount]`, dollarsToCents(item.price))
    appendFormValue(form, `line_items[${index}][quantity]`, item.quantity)
  })

  if (tipAmount > 0) {
    const tipIndex = items.length
    appendFormValue(form, `line_items[${tipIndex}][price_data][currency]`, 'usd')
    appendFormValue(form, `line_items[${tipIndex}][price_data][product_data][name]`, 'Tip')
    appendFormValue(form, `line_items[${tipIndex}][price_data][unit_amount]`, dollarsToCents(tipAmount))
    appendFormValue(form, `line_items[${tipIndex}][quantity]`, 1)
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Stripe Checkout failed: ${text}`)
  }

  const session = (await response.json()) as StripeCheckoutSession

  if (!session.id || !session.url) {
    throw new Error('Stripe did not return a checkout URL')
  }

  return session
}
