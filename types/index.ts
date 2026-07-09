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

export interface Order {
  id: string
  restaurant_id: string
  table_id?: string
  table_number: number
  customer_name?: string
  customer_whatsapp?: string
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled'
  subtotal: number
  total: number
  order_notes?: string
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
