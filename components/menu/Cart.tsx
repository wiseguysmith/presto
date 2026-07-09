'use client'

import { CartItem } from '@/types'
import { Minus, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (menuItemId: string, quantity: number) => void
  onRemoveItem: (menuItemId: string) => void
  onUpdateItemNotes: (menuItemId: string, notes: string) => void
  onUpdateOrderNotes: (notes: string) => void
  onUpdateCustomerName: (name: string) => void
  onUpdateWhatsApp: (whatsapp: string) => void
  orderNotes: string
  customerName: string
  customerWhatsApp: string
  onSubmit: () => void
  isSubmitting: boolean
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateItemNotes,
  onUpdateOrderNotes,
  onUpdateCustomerName,
  onUpdateWhatsApp,
  orderNotes,
  customerName,
  customerWhatsApp,
  onSubmit,
  isSubmitting,
}: CartProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6 border-b pb-6">
            {items.map((item) => (
              <div key={item.menu_item_id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedItemId(expandedItemId === item.menu_item_id ? null : item.menu_item_id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedItemId === item.menu_item_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Expanded Item Details */}
                {expandedItemId === item.menu_item_id && (
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-pink-200">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.menu_item_id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Item Notes */}
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Notes for this item</label>
                      <input
                        type="text"
                        value={item.item_notes || ''}
                        onChange={(e) => onUpdateItemNotes(item.menu_item_id, e.target.value)}
                        placeholder="E.g., No onions, extra sauce"
                        className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.menu_item_id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-2 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Notes */}
          <div className="space-y-4 mb-6 pb-6 border-b">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Order notes (optional)</label>
              <textarea
                value={orderNotes}
                onChange={(e) => onUpdateOrderNotes(e.target.value)}
                placeholder="E.g., Allergies, special requests"
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Customer Info */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Name (optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => onUpdateCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp (optional)</label>
              <input
                type="tel"
                value={customerWhatsApp}
                onChange={(e) => onUpdateWhatsApp(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </>
      )}
    </div>
  )
}
