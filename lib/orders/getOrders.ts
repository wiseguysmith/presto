import { demoRestaurant, isDemoMode } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { KitchenOrder, OrderStatus } from '@/types'

const kitchenVisibleStatuses: OrderStatus[] = ['sent_to_kitchen', 'preparing', 'ready', 'served']

export async function getKitchenOrders(): Promise<KitchenOrder[]> {
  if (isDemoMode()) {
    return []
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('payment_status', 'paid')
    .in('status', kitchenVisibleStatuses)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching kitchen orders:', error)
    return []
  }

  return (data || []).map((order: any) => ({
    ...order,
    subtotal: Number(order.subtotal),
    tip_amount: Number(order.tip_amount),
    tax_amount: Number(order.tax_amount),
    platform_fee_amount: Number(order.platform_fee_amount),
    total: Number(order.total),
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      price_snapshot: Number(item.price_snapshot),
      line_total: Number(item.line_total),
    })),
  }))
}

export async function getPendingPaymentOrders(): Promise<KitchenOrder[]> {
  if (isDemoMode()) {
    return []
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('payment_method', 'counter')
    .eq('payment_status', 'pending')
    .eq('status', 'pending_payment')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching pending payment orders:', error)
    return []
  }

  return (data || []).map((order: any) => ({
    ...order,
    subtotal: Number(order.subtotal),
    tip_amount: Number(order.tip_amount),
    tax_amount: Number(order.tax_amount),
    platform_fee_amount: Number(order.platform_fee_amount),
    total: Number(order.total),
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      price_snapshot: Number(item.price_snapshot),
      line_total: Number(item.line_total),
    })),
  }))
}

export async function getTodaySalesSummary() {
  if (isDemoMode()) {
    return {
      restaurantName: demoRestaurant.name,
      orderCount: 0,
      grossSales: 0,
      tips: 0,
      cardSales: 0,
      counterSales: 0,
      averageOrderValue: 0,
      topItems: [] as { name: string; quantity: number; sales: number }[],
    }
  }

  const supabase = getSupabaseServerClient()
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('payment_status', 'paid')
    .gte('created_at', start.toISOString())

  if (error) {
    console.error('Error fetching sales summary:', error)
    return {
      restaurantName: 'Pink Flamingo',
      orderCount: 0,
      grossSales: 0,
      tips: 0,
      cardSales: 0,
      counterSales: 0,
      averageOrderValue: 0,
      topItems: [] as { name: string; quantity: number; sales: number }[],
    }
  }

  const paidOrders = orders || []
  const grossSales = paidOrders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
  const tips = paidOrders.reduce((sum: number, order: any) => sum + Number(order.tip_amount || 0), 0)
  const cardSales = paidOrders
    .filter((order: any) => order.payment_method === 'card')
    .reduce((sum: number, order: any) => sum + Number(order.total), 0)
  const counterSales = paidOrders
    .filter((order: any) => order.payment_method === 'counter')
    .reduce((sum: number, order: any) => sum + Number(order.total), 0)
  const itemMap = new Map<string, { name: string; quantity: number; sales: number }>()

  for (const order of paidOrders as any[]) {
    for (const item of order.order_items || []) {
      const current = itemMap.get(item.name_snapshot) || { name: item.name_snapshot, quantity: 0, sales: 0 }
      current.quantity += Number(item.quantity)
      current.sales += Number(item.line_total)
      itemMap.set(item.name_snapshot, current)
    }
  }

  return {
    restaurantName: 'Pink Flamingo',
    orderCount: paidOrders.length,
    grossSales,
    tips,
    cardSales,
    counterSales,
    averageOrderValue: paidOrders.length ? grossSales / paidOrders.length : 0,
    topItems: Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5),
  }
}
