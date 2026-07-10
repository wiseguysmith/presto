'use server'

import { sendOrderConfirmationEmail } from '@/lib/notifications/email'
import { calculateOrderTotals, priceCartItems } from '@/lib/orders/totals'
import { createStripeCheckoutSession, isStripeConfigured } from '@/lib/payments/stripe'
import { demoMenuItems, demoRestaurant, isDemoMode, isDemoRestaurantId } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { CartItem, GuestSource, MenuItem, PaymentMethod } from '@/types'

export interface CreateOrderInput {
  restaurantId: string
  tableId: string
  tableNumber: number
  customerName?: string
  customerEmail: string
  customerWhatsApp?: string
  orderNotes?: string
  paymentMethod: PaymentMethod
  tipPercent: number
  guestSource?: GuestSource
  cartItems: CartItem[]
}

type CreateOrderResult =
  | {
      orderId: string
      checkoutUrl?: string
      paymentMethod: PaymentMethod
      paymentStatus: 'pending' | 'paid'
      status: 'pending_payment' | 'sent_to_kitchen'
      total: number
    }
  | { error: string }

const validGuestSources: GuestSource[] = [
  'instagram',
  'google',
  'walk_by',
  'hotel',
  'friend',
  'local_resident',
  'tourist',
  'tiktok',
  'other',
]

function cleanOptional(value?: string) {
  const cleaned = value?.trim()
  return cleaned ? cleaned.slice(0, 500) : undefined
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function getTrustedMenuItems(restaurantId: string, cartItems: CartItem[]): Promise<MenuItem[]> {
  const ids = Array.from(new Set(cartItems.map((item) => item.menu_item_id)))

  if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
    return demoMenuItems.filter((item) => ids.includes(item.id) && item.restaurant_id === restaurantId && item.available)
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('available', true)
    .in('id', ids)

  if (error) {
    console.error('Error fetching trusted menu prices:', error)
    throw new Error('Could not verify menu prices')
  }

  return (data || []).map((item: any) => ({
    ...item,
    price: Number(item.price),
  }))
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const {
    restaurantId,
    tableId,
    tableNumber,
    customerName,
    customerEmail,
    customerWhatsApp,
    orderNotes,
    paymentMethod,
    tipPercent,
    guestSource,
    cartItems,
  } = input

  if (!cartItems || cartItems.length === 0) {
    return { error: 'Cart is empty' }
  }

  if (!customerEmail || !isValidEmail(customerEmail.trim())) {
    return { error: 'A valid email is required for your confirmation' }
  }

  if (!['card', 'counter'].includes(paymentMethod)) {
    return { error: 'Choose card or pay at counter/table' }
  }

  if (guestSource && !validGuestSources.includes(guestSource)) {
    return { error: 'Choose a valid customer source' }
  }

  try {
    const trustedMenuItems = await getTrustedMenuItems(restaurantId, cartItems)

    if (trustedMenuItems.length === 0) {
      return { error: 'No available menu items found' }
    }

    const pricedItems = priceCartItems(cartItems, trustedMenuItems)
    const totals = calculateOrderTotals(pricedItems, tipPercent)
    const platformFeeAmount = paymentMethod === 'card' ? totals.platformFeeAmount : 0
    const orderStatus = 'pending_payment'
    const paymentStatus = 'pending'
    const cleanedEmail = customerEmail.trim().toLowerCase()

    if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
      const orderId = `DEMO-${Date.now().toString().slice(-6)}`

      return {
        orderId,
        checkoutUrl: paymentMethod === 'card' ? `/order/${orderId}/success?demo=1` : undefined,
        paymentMethod,
        paymentStatus,
        status: orderStatus,
        total: totals.total,
      }
    }

    const supabase = getSupabaseServerClient()

    const { data: restaurantResponse, error: restaurantError } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', restaurantId)
      .single()
    const restaurantData = restaurantResponse as { name: string } | null

    if (restaurantError || !restaurantData) {
      console.error('Error fetching restaurant for order:', restaurantError)
      return { error: 'Restaurant could not be verified' }
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          restaurant_id: restaurantId,
          table_id: tableId,
          table_number: tableNumber,
          customer_name: cleanOptional(customerName) || null,
          customer_email: cleanedEmail,
          customer_whatsapp: cleanOptional(customerWhatsApp) || null,
          status: orderStatus,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          subtotal: totals.subtotal,
          tip_amount: totals.tipAmount,
          tax_amount: totals.taxAmount,
          platform_fee_amount: platformFeeAmount,
          total: totals.total,
          order_notes: cleanOptional(orderNotes) || null,
          guest_source: guestSource || null,
        } as never,
      ])
      .select()

    if (orderError || !orderData || orderData.length === 0) {
      console.error('Error creating order:', orderError)
      return { error: 'Failed to create order' }
    }

    const orderId = (orderData[0] as any).id as string
    const orderItems = pricedItems.map((item) => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      name_snapshot: item.name,
      price_snapshot: item.price,
      quantity: item.quantity,
      item_notes: item.item_notes || null,
      line_total: item.line_total,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems as never[])

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return { error: 'Failed to save order items' }
    }

    if (paymentMethod === 'counter') {
      await sendOrderConfirmationEmail({
        to: cleanedEmail,
        orderId,
        restaurantName: restaurantData.name,
        tableNumber,
        total: totals.total,
        paymentMethod,
      })

      return {
        orderId,
        paymentMethod,
        paymentStatus,
        status: orderStatus,
        total: totals.total,
      }
    }

    if (!isStripeConfigured()) {
      return { error: 'Card payments are not configured yet. Please choose pay at counter/table.' }
    }

    const session = await createStripeCheckoutSession({
      orderId,
      restaurantName: restaurantData.name,
      tableNumber,
      customerEmail: cleanedEmail,
      items: pricedItems,
      tipAmount: totals.tipAmount,
      platformFeeAmount,
    })

    const { error: stripeUpdateError } = await supabase
      .from('orders')
      .update({
        stripe_checkout_session_id: session.id,
        stripe_connected_account_id: process.env.STRIPE_CONNECTED_ACCOUNT_ID || null,
      } as never)
      .eq('id', orderId)

    if (stripeUpdateError) {
      console.error('Error saving Stripe session:', stripeUpdateError)
      return { error: 'Failed to attach payment session to order' }
    }

    return {
      orderId,
      checkoutUrl: session.url,
      paymentMethod,
      paymentStatus,
      status: orderStatus,
      total: totals.total,
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'An unexpected error occurred' }
  }
}
