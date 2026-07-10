'use server'

import { revalidatePath } from 'next/cache'
import { markOrderPaidAndSendToKitchen } from '@/lib/orders/markOrderPaid'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { OrderStatus } from '@/types'

const kitchenStatuses: OrderStatus[] = ['preparing', 'ready', 'served', 'cancelled']

export async function confirmCounterPayment(orderId: string) {
  const result = await markOrderPaidAndSendToKitchen(orderId)
  revalidatePath('/admin')
  revalidatePath('/kitchen')
  return result
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!kitchenStatuses.includes(status)) {
    return { error: 'Invalid kitchen status' }
  }

  const supabase = getSupabaseServerClient()
  const now = new Date().toISOString()

  const update: Record<string, string> = {
    status,
    updated_at: now,
  }

  if (status === 'cancelled') {
    update.payment_status = 'cancelled'
    update.cancelled_at = now
  }

  const { error } = await supabase.from('orders').update(update as never).eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { error: 'Could not update order' }
  }

  revalidatePath('/kitchen')
  revalidatePath('/admin')
  return { orderId }
}
