'use client'

import { useEffect } from 'react'
import { UtensilsCrossed } from 'lucide-react'

interface OrderConfirmationProps {
  orderId: string
  tableNumber: number
  onNewOrder: () => void
}

export function OrderConfirmation({ orderId, tableNumber, onNewOrder }: OrderConfirmationProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const shortRef = orderId.replace(/-/g, '').slice(0, 6).toUpperCase()

  return (
    <div className="animate-fade-in fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#fbf7f1] px-6 text-center">
      {/* Animated check */}
      <div className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-full bg-pink-500 shadow-2xl shadow-pink-500/40">
        <svg viewBox="0 0 32 32" className="h-12 w-12" fill="none" aria-hidden>
          <path
            d="M7 17l6 6 12-14"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-check-draw"
          />
        </svg>
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-wide text-pink-600">
        Order {shortRef} · Table {tableNumber}
      </p>
      <h1 className="mt-2 max-w-md text-4xl font-black leading-tight text-stone-950">
        Order sent to the kitchen
      </h1>
      <p className="mt-4 max-w-sm text-[17px] leading-8 text-stone-600">
        Thank you. Your order has been sent to the restaurant. Please stay at your table. A staff
        member will assist you shortly.
      </p>

      <button
        onClick={onNewOrder}
        className="mt-10 flex h-[54px] items-center gap-2 rounded-full bg-stone-950 px-8 font-black text-white shadow-xl shadow-stone-950/25 transition hover:bg-stone-800 active:scale-[0.98]"
      >
        <UtensilsCrossed size={18} />
        Order something else
      </button>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Pink Flamingo × PRESTO
      </p>
    </div>
  )
}
