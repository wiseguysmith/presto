import { MenuCategory, MenuItem, Restaurant, RestaurantTable } from '@/types'

export const demoRestaurant: Restaurant = {
  id: 'demo-restaurant-pink-flamingo',
  name: 'Pink Flamingo',
  slug: 'pink-flamingo',
  description: 'Beachside Costa Rican dining powered by Mindful Tech.',
  location: 'Tamarindo, Costa Rica',
  currency: 'USD',
  is_active: true,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
}

export const demoTables: RestaurantTable[] = Array.from({ length: 10 }, (_, index) => ({
  id: `demo-table-${index + 1}`,
  restaurant_id: demoRestaurant.id,
  table_number: index + 1,
  label: `Table ${index + 1}`,
  is_active: true,
  created_at: new Date(0).toISOString(),
}))

export const demoCategories: MenuCategory[] = [
  'Starters',
  'Bowls',
  'Tacos',
  'Seafood',
  'Smoothies',
  'Coffee',
].map((name, index) => ({
  id: `demo-category-${index + 1}`,
  restaurant_id: demoRestaurant.id,
  name,
  slug: name.toLowerCase(),
  sort_order: index + 1,
  is_active: true,
  created_at: new Date(0).toISOString(),
}))

const categoryId = (name: string) => demoCategories.find((category) => category.name === name)?.id

export const demoMenuItems: MenuItem[] = [
  ['Guacamole & Plantain Chips', 'Smashed avocado, citrus, pico de gallo, warm plantain chips.', 12.99, 'Starters'],
  ['Tuna Tostadas', 'Ahi tuna, avocado crema, mango relish, crispy corn tostadas.', 14.99, 'Starters'],
  ['Tropical Chicken Bowl', 'Grilled chicken, coconut rice, black beans, pineapple salsa.', 15.99, 'Bowls'],
  ['Vegan Casado Bowl', 'Plantains, gallo pinto, market vegetables, cashew crema.', 13.99, 'Bowls'],
  ['Baja Fish Tacos', 'Crispy fish, cabbage slaw, chipotle crema, lime.', 16.99, 'Tacos'],
  ['Chicken Tinga Tacos', 'Slow-braised chicken, pickled onion, queso fresco.', 14.99, 'Tacos'],
  ['Garlic Shrimp Plate', 'Sauteed shrimp, cilantro rice, grilled vegetables.', 18.99, 'Seafood'],
  ['Grilled Mahi Mahi', 'Local mahi, passionfruit glaze, coconut rice.', 19.99, 'Seafood'],
  ['Mango Passion Smoothie', 'Mango, passionfruit, banana, coconut water.', 7.99, 'Smoothies'],
  ['Green Detox Smoothie', 'Spinach, pineapple, ginger, lime, cucumber.', 8.99, 'Smoothies'],
  ['Iced Costa Rican Coffee', 'Cold coffee, cane syrup, milk over ice.', 5.99, 'Coffee'],
  ['Coconut Cold Brew', 'Cold brew, coconut cream, toasted cinnamon.', 6.99, 'Coffee'],
].map(([name, description, price, category], index) => ({
  id: `demo-item-${index + 1}`,
  restaurant_id: demoRestaurant.id,
  category_id: categoryId(category as string),
  name: name as string,
  description: description as string,
  price: price as number,
  currency: 'USD',
  available: true,
  sort_order: index + 1,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
}))

export function isDemoMode() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function isDemoRestaurantId(restaurantId: string) {
  return restaurantId === demoRestaurant.id
}
