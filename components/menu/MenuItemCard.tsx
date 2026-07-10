'use client'

import { MenuItem } from '@/types'
import { Plus } from 'lucide-react'
import { emojiForItem, tileForCategory } from './foodVisuals'

interface MenuItemCardProps {
  item: MenuItem
  categorySlug?: string
  quantityInCart: number
  onSelect: (item: MenuItem) => void
}

export function MenuItemCard({ item, categorySlug, quantityInCart, onSelect }: MenuItemCardProps) {
  const emoji = emojiForItem(item.name, categorySlug)
  const tile = tileForCategory(categorySlug)

  return (
    <button
      onClick={() => onSelect(item)}
      className="group relative flex w-full items-stretch gap-4 border border-stone-200 bg-white p-4 text-left transition-all hover:border-pink-300 hover:shadow-lg hover:shadow-pink-950/5 active:scale-[0.99]"
    >
      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-black leading-snug text-stone-950">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-500">{item.description}</p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <span className="text-base font-black text-stone-950">
            ${Number(item.price).toFixed(2)}
          </span>
          {quantityInCart > 0 && (
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-black text-pink-700">
              {quantityInCart} in order
            </span>
          )}
        </div>
      </div>

      {/* Visual tile */}
      <div
        className={`relative flex h-24 w-24 shrink-0 items-center justify-center self-center bg-gradient-to-br text-4xl ${tile}`}
      >
        <span className="drop-shadow-sm transition-transform group-hover:scale-110">{emoji}</span>
        <span
          className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors ${
            quantityInCart > 0 ? 'bg-pink-500 text-white' : 'bg-stone-950 text-white group-hover:bg-pink-500'
          }`}
          aria-hidden
        >
          {quantityInCart > 0 ? (
            <span className="text-sm font-black">{quantityInCart}</span>
          ) : (
            <Plus size={16} strokeWidth={3} />
          )}
        </span>
      </div>
    </button>
  )
}
