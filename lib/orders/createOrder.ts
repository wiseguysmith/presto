'use server'

import { getSupabaseClient } from '@/lib/supabase/client'
import { CartItem } from '@/types'

export interface CreateOrderInput {
  restaurantId: string
  tableId: string
  tableNumber: number
  customerName?: string
  customerWhatsApp?: string
  orderNotes?: string
  cartItems: CartItem[]
}

export async function createOrder(input: CreateOrderInput): Promise<{ orderId: string } | { error: string }> {
  const {
    restaurantId,
    tableId,
    tableNumber,
    customerName,
    customerWhatsApp,
    orderNotes,
    cartItems,
  } = input

  // Validate cart
  if (!cartItems || cartItems.length === 0) {
    return { error: 'Cart is empty' }
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal // No tax in Phase 1

  try {
    const supabase = getSupabaseClient()

    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          restaurant_id: restaurantId,
          table_id: tableId,
          table_number: tableNumber,
          customer_name: customerName || null,
          customer_whatsapp: customerWhatsApp || null,
          status: 'new',
          subtotal,
          total,
          order_notes: orderNotes || null,
        } as never,
      ])
      .select()

    if (orderError || !orderData || orderData.length === 0) {
      console.error('Error creating order:', orderError)
      return { error: 'Failed to create order' }
    }

    const orderId = (orderData[0] as any).id

    // Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      name_snapshot: item.name,
      price_snapshot: item.price,
      quantity: item.quantity,
      item_notes: item.item_notes || null,
      line_total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems as never[])

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return { error: 'Failed to save order items' }
    }

    return { orderId }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'An unexpected error occurred' }
  }
}
