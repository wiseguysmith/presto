'use client'

import { useEffect, useState } from 'react'
import { MenuItem } from '@/types'
import { Minus, Plus, X } from 'lucide-react'
import { emojiForItem, tileForCategory } from './foodVisuals'

interface ItemSheetProps {
  item: MenuItem
  categorySlug?: string
  onAdd: (item: MenuItem, quantity: number, notes: string) => void
  onClose: () => void
}

export function ItemSheet({ item, categorySlug, onAdd, onClose }: ItemSheetProps) {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const emoji = emojiForItem(item.name, categorySlug)
  const tile = tileForCategory(categorySlug)
  const lineTotal = Number(item.price) * quantity

  // Lock body scroll while the sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-stone-950/50 backdrop-blur-[2px]"
      />

      <div className="animate-sheet-up relative w-full max-w-lg overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
        {/* Visual banner */}
        <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${tile}`}>
          <span className="animate-float-slow text-8xl drop-shadow-md">{emoji}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-950 shadow-md transition hover:bg-white active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black leading-tight text-stone-950">{item.name}</h2>
            <span className="shrink-0 text-2xl font-black text-stone-950">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
          {item.description && (
            <p className="mt-2 text-[15px] leading-7 text-stone-500">{item.description}</p>
          )}

          {/* Notes */}
          <label className="mt-5 block">
            <span className="text-xs font-black uppercase tracking-wide text-stone-400">
              Special instructions
            </span>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="No onions, extra sauce, allergies…"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-[15px] text-stone-950 placeholder:text-stone-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            />
          </label>

          {/* Quantity + Add */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-950 transition hover:bg-stone-100 active:scale-90 disabled:opacity-30"
                disabled={quantity <= 1}
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="w-8 text-center text-lg font-black text-stone-950">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-950 transition hover:bg-stone-100 active:scale-90"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <button
              onClick={() => onAdd(item, quantity, notes.trim())}
              className="flex h-[54px] flex-1 items-center justify-between gap-2 whitespace-nowrap rounded-full bg-pink-500 px-5 text-[15px] font-black text-white shadow-xl shadow-pink-500/30 transition hover:bg-pink-400 active:scale-[0.98]"
            >
              <span>Add to order</span>
              <span>${lineTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* Safe area for phones with home indicator */}
        <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
      </div>
    </div>
  )
}
