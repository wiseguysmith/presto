import { CartItem, MenuItem } from '@/types'

export interface PricedOrderItem {
  menu_item_id: string
  name: string
  price: number
  quantity: number
  item_notes?: string
  line_total: number
}

export interface OrderTotals {
  subtotal: number
  tipAmount: number
  taxAmount: number
  total: number
  platformFeeAmount: number
}

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100)
}

export function centsToDollars(cents: number) {
  return cents / 100
}

export function normalizeMoney(amount: number) {
  return centsToDollars(dollarsToCents(amount))
}

export function priceCartItems(cartItems: CartItem[], menuItems: MenuItem[]): PricedOrderItem[] {
  const menuById = new Map(menuItems.map((item) => [item.id, item]))
  const quantityByItemId = new Map<string, { quantity: number; notes: string[] }>()

  for (const item of cartItems) {
    const quantity = Math.max(0, Math.min(20, Math.floor(item.quantity || 0)))

    if (!quantity) continue

    const current = quantityByItemId.get(item.menu_item_id) || { quantity: 0, notes: [] }
    current.quantity += quantity

    if (item.item_notes?.trim()) {
      current.notes.push(item.item_notes.trim())
    }

    quantityByItemId.set(item.menu_item_id, current)
  }

  return Array.from(quantityByItemId.entries()).map(([menuItemId, cartItem]) => {
    const menuItem = menuById.get(menuItemId)

    if (!menuItem) {
      throw new Error('A menu item is no longer available')
    }

    const lineTotal = normalizeMoney(menuItem.price * cartItem.quantity)

    return {
      menu_item_id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: cartItem.quantity,
      item_notes: cartItem.notes.join(' | ') || undefined,
      line_total: lineTotal,
    }
  })
}

export function calculateOrderTotals(items: PricedOrderItem[], tipPercent: number): OrderTotals {
  const subtotal = normalizeMoney(items.reduce((sum, item) => sum + item.line_total, 0))
  const safeTipPercent = [0, 10, 15, 20].includes(tipPercent) ? tipPercent : 0
  const tipAmount = normalizeMoney(subtotal * (safeTipPercent / 100))
  const taxAmount = 0
  const total = normalizeMoney(subtotal + tipAmount + taxAmount)
  const platformFeeBps = Number(process.env.STRIPE_PLATFORM_FEE_BPS || 100)
  const platformFeeAmount = normalizeMoney(subtotal * (platformFeeBps / 10000))

  return {
    subtotal,
    tipAmount,
    taxAmount,
    total,
    platformFeeAmount,
  }
}
