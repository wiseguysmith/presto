'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MenuItem, MenuCategory, Restaurant, RestaurantTable } from '@/types'
import { CategoryTabs } from './CategoryTabs'
import { MenuItemCard } from './MenuItemCard'
import { ItemSheet } from './ItemSheet'
import { CartBar } from './CartBar'
import { CartDrawer, CartLine } from './CartDrawer'
import { OrderConfirmation } from './OrderConfirmation'
import { createOrder } from '@/lib/orders/createOrder'

interface MenuPageProps {
  restaurant: Restaurant
  table: RestaurantTable
  categories: MenuCategory[]
  items: MenuItem[]
}

const lineKeyFor = (menuItemId: string, notes: string) => `${menuItemId}::${notes}`

export function MenuPage({ restaurant, table, categories, items }: MenuPageProps) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerWhatsApp, setCustomerWhatsApp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const sectionsRef = useRef<HTMLDivElement>(null)
  const suppressSpyUntil = useRef(0)

  const categorySlugById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.slug])),
    [categories]
  )

  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>()
    for (const category of categories) {
      const inCategory = items.filter((item) => item.category_id === category.id)
      if (inCategory.length > 0) grouped.set(category.id, inCategory)
    }
    return grouped
  }, [categories, items])

  const quantityByItem = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const line of lines) {
      totals[line.menu_item_id] = (totals[line.menu_item_id] || 0) + line.quantity
    }
    return totals
  }, [lines])

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

  // Scroll-spy: highlight the category currently in view
  useEffect(() => {
    const sections = sectionsRef.current?.querySelectorAll('[data-section]')
    if (!sections || sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressSpyUntil.current) return
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveCategory(visible[0].target.getAttribute('data-section'))
        }
      },
      { rootMargin: '-130px 0px -55% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [itemsByCategory])

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    suppressSpyUntil.current = Date.now() + 700
    document.getElementById(`section-${categoryId}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAdd = (item: MenuItem, quantity: number, notes: string) => {
    const key = lineKeyFor(item.id, notes)
    setLines((current) => {
      const existing = current.find((line) => line.lineKey === key)
      if (existing) {
        return current.map((line) =>
          line.lineKey === key ? { ...line, quantity: line.quantity + quantity } : line
        )
      }
      return [
        ...current,
        {
          lineKey: key,
          menu_item_id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity,
          item_notes: notes || undefined,
        },
      ]
    })
    setSelectedItem(null)
  }

  const handleChangeQuantity = (lineKey: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) {
        const next = current.filter((line) => line.lineKey !== lineKey)
        if (next.length === 0) setDrawerOpen(false)
        return next
      }
      return current.map((line) => (line.lineKey === lineKey ? { ...line, quantity } : line))
    })
  }

  const handleSubmitOrder = async () => {
    if (lines.length === 0) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await createOrder({
        restaurantId: restaurant.id,
        tableId: table.id,
        tableNumber: table.table_number,
        customerName: customerName.trim() || undefined,
        customerWhatsApp: customerWhatsApp.trim() || undefined,
        orderNotes: orderNotes.trim() || undefined,
        cartItems: lines.map(({ lineKey, ...cartItem }) => cartItem),
      })

      if ('error' in result) {
        setSubmitError(result.error)
      } else {
        setOrderId(result.orderId)
        setDrawerOpen(false)
      }
    } catch {
      setSubmitError('Something went wrong sending your order. Please try again or ask our staff.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewOrder = () => {
    setOrderId(null)
    setLines([])
    setOrderNotes('')
    setSubmitError(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-[#fbf7f1] pb-28 text-stone-950">
      {/* Sticky header + category nav */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbf7f1]/90 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between px-5 pb-1 pt-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-pink-600">
                {restaurant.location || 'Dine-in'} · QR ordering
              </p>
              <h1 className="text-2xl font-black leading-tight">
                <span className="mr-1.5" aria-hidden>
                  🦩
                </span>
                {restaurant.name}
              </h1>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full border-2 border-stone-950 px-4 py-2 text-sm font-black">
              Table {table.table_number}
            </span>
          </div>

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={scrollToCategory}
          />
        </div>
      </div>

      {/* Menu sections */}
      <main ref={sectionsRef} className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const categoryItems = itemsByCategory.get(category.id)
          if (!categoryItems) return null

          return (
            <section
              key={category.id}
              id={`section-${category.id}`}
              data-section={category.id}
              className="scroll-mt-36 pt-8"
            >
              <h2 className="text-xl font-black">{category.name}</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {categoryItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    categorySlug={categorySlugById[category.id]}
                    quantityInCart={quantityByItem[item.id] || 0}
                    onSelect={setSelectedItem}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {items.length === 0 && (
          <p className="py-16 text-center font-bold text-stone-400">
            The menu is being updated — please ask our staff.
          </p>
        )}

        <p className="pb-10 pt-12 text-center text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
          Powered by PRESTO
        </p>
      </main>

      {/* Floating cart bar */}
      {itemCount > 0 && !drawerOpen && !selectedItem && !orderId && (
        <CartBar itemCount={itemCount} total={subtotal} onOpen={() => setDrawerOpen(true)} />
      )}

      {/* Item detail sheet */}
      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          categorySlug={selectedItem.category_id ? categorySlugById[selectedItem.category_id] : undefined}
          onAdd={handleAdd}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Cart drawer */}
      {drawerOpen && (
        <CartDrawer
          lines={lines}
          tableNumber={table.table_number}
          orderNotes={orderNotes}
          customerName={customerName}
          customerWhatsApp={customerWhatsApp}
          isSubmitting={isSubmitting}
          error={submitError}
          onChangeQuantity={handleChangeQuantity}
          onChangeOrderNotes={setOrderNotes}
          onChangeCustomerName={setCustomerName}
          onChangeWhatsApp={setCustomerWhatsApp}
          onSubmit={handleSubmitOrder}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {/* Confirmation takeover */}
      {orderId && (
        <OrderConfirmation
          orderId={orderId}
          tableNumber={table.table_number}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  )
}
