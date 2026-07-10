'use client'

import { ShoppingBag } from 'lucide-react'

interface CartBarProps {
  itemCount: number
  total: number
  onOpen: () => void
}

export function CartBar({ itemCount, total, onOpen }: CartBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        onClick={onOpen}
        className="animate-bar-up pointer-events-auto flex h-[58px] w-full max-w-lg items-center justify-between rounded-full bg-stone-950 px-5 font-black text-white shadow-2xl shadow-stone-950/40 transition hover:bg-stone-800 active:scale-[0.98]"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <ShoppingBag size={22} />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-black">
              {itemCount}
            </span>
          </span>
          <span>View order</span>
        </span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </button>
    </div>
  )
}
