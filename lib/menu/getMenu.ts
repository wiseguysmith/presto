'use server'

import { getSupabaseClient } from '@/lib/supabase/client'
import {
  demoCategories,
  demoMenuItems,
  demoRestaurant,
  demoTables,
  isDemoMode,
  isDemoRestaurantId,
} from '@/lib/demoData'
import { Restaurant, MenuCategory, MenuItem, RestaurantTable } from '@/types'

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  if (isDemoMode()) {
    return slug === demoRestaurant.slug ? demoRestaurant : null
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching restaurant:', error)
      return slug === demoRestaurant.slug ? demoRestaurant : null
    }

    return data
  } catch (error) {
    console.error('Error:', error)
    return slug === demoRestaurant.slug ? demoRestaurant : null
  }
}

export async function getTableByNumber(
  restaurantId: string,
  tableNumber: number
): Promise<RestaurantTable | null> {
  if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
    return demoTables.find((table) => table.restaurant_id === restaurantId && table.table_number === tableNumber) || null
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching table:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
  if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
    return demoCategories.filter((category) => category.restaurant_id === restaurantId)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
    return demoMenuItems.filter((item) => item.restaurant_id === restaurantId && item.available)
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('available', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching menu items:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function getMenuItemsByCategory(
  restaurantId: string,
  categoryId: string
): Promise<MenuItem[]> {
  if (isDemoMode() || isDemoRestaurantId(restaurantId)) {
    return demoMenuItems.filter(
      (item) => item.restaurant_id === restaurantId && item.category_id === categoryId && item.available
    )
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('category_id', categoryId)
      .eq('available', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching items by category:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}
