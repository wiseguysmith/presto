'use client'

import { MenuItem } from '@/types'
import { Plus } from 'lucide-react'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-600 mb-3 flex-grow">{item.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-pink-600">
          ${item.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAddToCart(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
