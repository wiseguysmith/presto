import { NextResponse } from 'next/server'
import { getKitchenOrders } from '@/lib/orders/getOrders'

export async function GET() {
  const orders = await getKitchenOrders()
  return NextResponse.json({ orders })
}
