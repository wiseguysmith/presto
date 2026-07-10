export interface Restaurant {
  id: string
  name: string
  slug: string
  description?: string
  location?: string
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RestaurantTable {
  id: string
  restaurant_id: string
  table_number: number
  label?: string
  is_active: boolean
  created_at: string
}

export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id?: string
  name: string
  description?: string
  price: number
  currency: string
  available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  menu_item_id: string
  name: string
  price: number
  quantity: number
  item_notes?: string
}

export type PaymentMethod = 'card' | 'counter'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'sent_to_kitchen'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled'
  | 'refunded'

export type GuestSource =
  | 'instagram'
  | 'google'
  | 'walk_by'
  | 'hotel'
  | 'friend'
  | 'local_resident'
  | 'tourist'
  | 'tiktok'
  | 'other'

export interface Order {
  id: string
  restaurant_id: string
  table_id?: string
  table_number: number
  customer_name?: string
  customer_whatsapp?: string
  customer_email?: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  subtotal: number
  tip_amount: number
  tax_amount: number
  platform_fee_amount: number
  total: number
  order_notes?: string
  guest_source?: GuestSource
  stripe_checkout_session_id?: string
  stripe_payment_intent_id?: string
  stripe_connected_account_id?: string
  kitchen_sent_at?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id?: string
  name_snapshot: string
  price_snapshot: number
  quantity: number
  item_notes?: string
  line_total: number
  created_at: string
}

export interface KitchenOrder extends Order {
  order_items: OrderItem[]
}

export interface OrderFeedback {
  id: string
  order_id: string
  restaurant_id: string
  rating: number
  feedback_text?: string
  wants_follow_up: boolean
  created_at: string
}
