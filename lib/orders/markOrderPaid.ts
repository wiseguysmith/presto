'use server'

import { sendOrderConfirmationEmail } from '@/lib/notifications/email'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function markOrderPaidAndSendToKitchen(orderId: string, stripePaymentIntentId?: string) {
  const supabase = getSupabaseServerClient()
  const now = new Date().toISOString()

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'sent_to_kitchen',
      paid_at: now,
      kitchen_sent_at: now,
      stripe_payment_intent_id: stripePaymentIntentId || null,
      updated_at: now,
    } as never)
    .eq('id', orderId)
    .select()

  if (orderError || !orderData || orderData.length === 0) {
    console.error('Error marking order paid:', orderError)
    return { error: 'Could not mark order paid' }
  }

  const order = orderData[0] as any
  const { data: restaurantResponse } = await supabase
    .from('restaurants')
    .select('name')
    .eq('id', order.restaurant_id)
    .single()
  const restaurant = restaurantResponse as { name: string } | null

  if (order.customer_email) {
    await sendOrderConfirmationEmail({
      to: order.customer_email,
      orderId: order.id,
      restaurantName: restaurant?.name || 'Pink Flamingo',
      tableNumber: order.table_number,
      total: Number(order.total),
      paymentMethod: order.payment_method,
    })
  }

  return { orderId: order.id }
}
