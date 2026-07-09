import { getRestaurantBySlug, getTableByNumber, getMenuCategories, getMenuItems } from '@/lib/menu/getMenu'
import { MenuPage } from '@/components/menu/MenuPage'

interface MenuRouteProps {
  params: Promise<{
    restaurantSlug: string
    tableNumber: string
  }>
}

export default async function MenuRoute({ params }: MenuRouteProps) {
  const { restaurantSlug, tableNumber } = await params

  // Fetch restaurant
  const restaurant = await getRestaurantBySlug(restaurantSlug)
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant &quot;{restaurantSlug}&quot; could not be found.</p>
        </div>
      </div>
    )
  }

  // Fetch table
  const tableNum = parseInt(tableNumber, 10)
  const table = await getTableByNumber(restaurant.id, tableNum)
  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Table Not Found</h1>
          <p className="text-gray-600">Table {tableNumber} could not be found.</p>
        </div>
      </div>
    )
  }

  // Fetch menu data
  const categories = await getMenuCategories(restaurant.id)
  const items = await getMenuItems(restaurant.id)

  return <MenuPage restaurant={restaurant} table={table} categories={categories} items={items} />
}
