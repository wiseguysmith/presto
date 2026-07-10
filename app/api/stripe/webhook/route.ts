import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { markOrderPaidAndSendToKitchen } from '@/lib/orders/markOrderPaid'

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=')
    if (key && value) acc[key] = value
    return acc
  }, {})

  const timestamp = parts.t
  const signature = parts.v1

  if (!timestamp || !signature) return false

  const signedPayload = `${timestamp}.${payload}`
  const expectedSignature = createHmac('sha256', secret).update(signedPayload).digest('hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')
  const signatureBuffer = Buffer.from(signature, 'hex')

  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer)
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook secret is not configured' }, { status: 500 })
  }

  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid Stripe signature' }, { status: 400 })
  }

  const event = JSON.parse(payload)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.order_id

    if (orderId && session.payment_status === 'paid') {
      await markOrderPaidAndSendToKitchen(orderId, session.payment_intent)
    }
  }

  return NextResponse.json({ received: true })
}
