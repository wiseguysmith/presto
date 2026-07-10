'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Waves } from 'lucide-react'
import {
  GuestSource,
  MenuCategory,
  MenuItem,
  PaymentMethod,
  Restaurant,
  RestaurantTable,
} from '@/types'
import { createOrder } from '@/lib/orders/createOrder'
import { CartBar } from './CartBar'
import { CartDrawer, CartLine } from './CartDrawer'
import { CategoryTabs } from './CategoryTabs'
import { ItemSheet } from './ItemSheet'
import { MenuItemCard } from './MenuItemCard'
import { OrderConfirmation } from './OrderConfirmation'

interface MenuPageProps {
  restaurant: Restaurant
  table: RestaurantTable
  categories: MenuCategory[]
  items: MenuItem[]
}

type SubmittedOrder = {
  orderId: string
  paymentMethod: PaymentMethod
  status: 'pending_payment' | 'sent_to_kitchen'
  total: number
}

const lineKeyFor = (menuItemId: string, notes: string) => `${menuItemId}::${notes}`

export function MenuPage({ restaurant, table, categories, items }: MenuPageProps) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerWhatsApp, setCustomerWhatsApp] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [tipPercent, setTipPercent] = useState(15)
  const [guestSource, setGuestSource] = useState<GuestSource | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null)

  const sectionsRef = useRef<HTMLDivElement>(null)
  const suppressSpyUntil = useRef(0)

  const categorySlugById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.slug])),
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
  const tipAmount = subtotal * (tipPercent / 100)
  const total = subtotal + tipAmount

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
        customerEmail,
        customerWhatsApp: customerWhatsApp.trim() || undefined,
        orderNotes: orderNotes.trim() || undefined,
        paymentMethod,
        tipPercent,
        guestSource: guestSource || undefined,
        cartItems: lines.map(({ lineKey, ...cartItem }) => cartItem),
      })

      if ('error' in result) {
        setSubmitError(result.error)
      } else if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setSubmittedOrder({
          orderId: result.orderId,
          paymentMethod: result.paymentMethod,
          status: result.status,
          total: result.total,
        })
        setDrawerOpen(false)
      }
    } catch {
      setSubmitError('Something went wrong sending your order. Please try again or ask our staff.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewOrder = () => {
    setSubmittedOrder(null)
    setLines([])
    setOrderNotes('')
    setCustomerName('')
    setCustomerEmail('')
    setCustomerWhatsApp('')
    setPaymentMethod('card')
    setTipPercent(15)
    setGuestSource('')
    setSubmitError(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-[#f8f0df] pb-28 text-[#173f45]">
      <div className="sticky top-0 z-30 border-b border-[#e8d7bd] bg-[#f8f0df]/92 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#e35c52]">
                {restaurant.location || 'Tamarindo'} - order from your table
              </p>
              <h1 className="text-2xl font-black leading-tight text-[#173f45]">{restaurant.name}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/staff-login"
                className="hidden h-10 items-center rounded-full border border-[#d5e4df] bg-[#fff8eb] px-3 text-xs font-black text-[#557176] shadow-sm transition hover:border-[#e35c52] hover:text-[#b94745] sm:inline-flex"
              >
                Staff
              </Link>
              <span className="whitespace-nowrap rounded-full border-2 border-[#173f45] bg-[#fff8eb] px-4 py-2 text-sm font-black text-[#173f45]">
                Table {table.table_number}
              </span>
            </div>
          </div>

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={scrollToCategory}
          />
        </div>
      </div>

      <main ref={sectionsRef} className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <div className="mt-5 border border-[#c4e0d8] bg-[#d9eee7] px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#177079]">
                Tamarindo table service
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#173f45]">
                What are you feeling?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#557176]">
                Take your time. Start with something cold, something fresh, or whatever the beach
                day is calling for.
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff8eb] text-[#e35c52]">
              <Waves size={22} />
            </span>
          </div>
        </div>

        {categories.map((category) => {
          const categoryItems = itemsByCategory.get(category.id)
          if (!categoryItems) return null

          return (
            <section
              key={category.id}
              id={`section-${category.id}`}
              data-section={category.id}
              className="scroll-mt-36 pt-9"
            >
              <h2 className="text-xl font-black text-[#173f45]">{category.name}</h2>
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
            <p className="py-16 text-center font-bold text-[#7b9492]">
            The menu is being updated. Please ask our staff.
          </p>
        )}

        <p className="pb-10 pt-12 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#7b9492]">
          Powered by Mindful Tech
        </p>
      </main>

      {itemCount > 0 && !drawerOpen && !selectedItem && !submittedOrder && (
        <CartBar itemCount={itemCount} total={total} onOpen={() => setDrawerOpen(true)} />
      )}

      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          categorySlug={selectedItem.category_id ? categorySlugById[selectedItem.category_id] : undefined}
          onAdd={handleAdd}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {drawerOpen && (
        <CartDrawer
          lines={lines}
          tableNumber={table.table_number}
          orderNotes={orderNotes}
          customerName={customerName}
          customerEmail={customerEmail}
          customerWhatsApp={customerWhatsApp}
          paymentMethod={paymentMethod}
          tipPercent={tipPercent}
          guestSource={guestSource}
          isSubmitting={isSubmitting}
          error={submitError}
          onChangeQuantity={handleChangeQuantity}
          onChangeOrderNotes={setOrderNotes}
          onChangeCustomerName={setCustomerName}
          onChangeCustomerEmail={setCustomerEmail}
          onChangeWhatsApp={setCustomerWhatsApp}
          onChangePaymentMethod={setPaymentMethod}
          onChangeTipPercent={setTipPercent}
          onChangeGuestSource={setGuestSource}
          onSubmit={handleSubmitOrder}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {submittedOrder && (
        <OrderConfirmation
          orderId={submittedOrder.orderId}
          tableNumber={table.table_number}
          paymentMethod={submittedOrder.paymentMethod}
          status={submittedOrder.status}
          total={submittedOrder.total}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  )
}
