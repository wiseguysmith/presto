'use client'

import { useState, useEffect } from 'react'
import { MenuItem, MenuCategory, CartItem, Restaurant, RestaurantTable } from '@/types'
import { CategoryTabs } from './CategoryTabs'
import { MenuItemCard } from './MenuItemCard'
import { Cart } from './Cart'
import { OrderConfirmation } from './OrderConfirmation'
import { createOrder } from '@/lib/orders/createOrder'

interface MenuPageProps {
  restaurant: Restaurant
  table: RestaurantTable
  categories: MenuCategory[]
  items: MenuItem[]
}

export function MenuPage({ restaurant, table, categories, items }: MenuPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null)
  const [orderNotes, setOrderNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerWhatsApp, setCustomerWhatsApp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const visibleItems = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cartItems.find((ci) => ci.menu_item_id === item.id)

    if (existingItem) {
      setCartItems(
        cartItems.map((ci) =>
          ci.menu_item_id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          item_notes: '',
        },
      ])
    }
  }

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.menu_item_id !== menuItemId))
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.menu_item_id === menuItemId ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleRemoveItem = (menuItemId: string) => {
    setCartItems(cartItems.filter((item) => item.menu_item_id !== menuItemId))
  }

  const handleUpdateItemNotes = (menuItemId: string, notes: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.menu_item_id === menuItemId ? { ...item, item_notes: notes } : item
      )
    )
  }

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      alert('Please add items to your cart')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createOrder({
        restaurantId: restaurant.id,
        tableId: table.id,
        tableNumber: table.table_number,
        customerName,
        customerWhatsApp,
        orderNotes,
        cartItems,
      })

      if ('error' in result) {
        alert(`Error: ${result.error}`)
      } else {
        setOrderId(result.orderId)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('An error occurred while submitting your order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewOrder = () => {
    setOrderId(null)
    setCartItems([])
    setOrderNotes('')
    setCustomerName('')
    setCustomerWhatsApp('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-600">Table {table.table_number}</p>
        </div>
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {visibleItems.length === 0 && (
              <p className="text-gray-500 text-center py-8">No items available in this category</p>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onUpdateItemNotes={handleUpdateItemNotes}
                onUpdateOrderNotes={setOrderNotes}
                onUpdateCustomerName={setCustomerName}
                onUpdateWhatsApp={setCustomerWhatsApp}
                orderNotes={orderNotes}
                customerName={customerName}
                customerWhatsApp={customerWhatsApp}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {orderId && (
        <OrderConfirmation orderId={orderId} onNewOrder={handleNewOrder} />
      )}
    </div>
  )
}
