import { demoCategories, demoMenuItems, demoRestaurant, isDemoMode } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { MenuCategory, MenuItem } from '@/types'

export async function getAdminMenu() {
  if (isDemoMode()) {
    return {
      restaurant: demoRestaurant,
      categories: demoCategories,
      items: demoMenuItems,
    }
  }

  const supabase = getSupabaseServerClient()
  const { data: restaurantData } = await supabase.from('restaurants').select('*').eq('slug', 'pink-flamingo').single()
  const restaurant = restaurantData as typeof demoRestaurant | null

  if (!restaurant) {
    return {
      restaurant: demoRestaurant,
      categories: [] as MenuCategory[],
      items: [] as MenuItem[],
    }
  }

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true })
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true })

  return {
    restaurant,
    categories: (categories || []) as MenuCategory[],
    items: (items || []).map((item: any) => ({
      ...item,
      price: Number(item.price),
    })) as MenuItem[],
  }
}
