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
  const addButtonClass =
    quantityInCart > 0
      ? 'bg-[#f06a5f] text-white'
      : 'bg-[#173f45] text-white group-hover:bg-[#f06a5f]'

  return (
    <button
      onClick={() => onSelect(item)}
      className="group relative flex w-full items-stretch gap-4 border border-[#e8d7bd] bg-[#fff8eb] p-4 text-left transition-all hover:border-[#e35c52] hover:shadow-lg hover:shadow-[#173f45]/10 active:scale-[0.99]"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-black leading-snug text-[#173f45]">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#557176]">{item.description}</p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <span className="text-base font-black text-[#173f45]">
            {'$'}{Number(item.price).toFixed(2)}
          </span>
          {quantityInCart > 0 && (
            <span className="rounded-full bg-[#ffe0d0] px-2.5 py-0.5 text-xs font-black text-[#b94745]">
              {quantityInCart} in order
            </span>
          )}
        </div>
      </div>

      <div
        className={['relative flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-[20px] bg-gradient-to-br text-4xl', tile].join(' ')}
      >
        <span className="drop-shadow-sm transition-transform group-hover:scale-110">{emoji}</span>
        <span
          className={[
            'absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors',
            addButtonClass,
          ].join(' ')}
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
