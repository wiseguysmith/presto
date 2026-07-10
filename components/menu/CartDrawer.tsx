'use client'

import { useEffect } from 'react'
import { CartItem } from '@/types'
import { Minus, Plus, Send, X } from 'lucide-react'

export interface CartLine extends CartItem {
  lineKey: string
}

interface CartDrawerProps {
  lines: CartLine[]
  tableNumber: number
  orderNotes: string
  customerName: string
  customerWhatsApp: string
  isSubmitting: boolean
  error: string | null
  onChangeQuantity: (lineKey: string, quantity: number) => void
  onChangeOrderNotes: (value: string) => void
  onChangeCustomerName: (value: string) => void
  onChangeWhatsApp: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CartDrawer({
  lines,
  tableNumber,
  orderNotes,
  customerName,
  customerWhatsApp,
  isSubmitting,
  error,
  onChangeQuantity,
  onChangeOrderNotes,
  onChangeCustomerName,
  onChangeWhatsApp,
  onSubmit,
  onClose,
}: CartDrawerProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

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

      <div className="animate-sheet-up relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-[28px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Table {tableNumber}
            </p>
            <h2 className="text-xl font-black text-stone-950">Your order</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-950 transition hover:bg-stone-200 active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Lines */}
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.lineKey} className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-snug text-stone-950">{line.name}</p>
                  {line.item_notes && (
                    <p className="mt-0.5 text-sm italic text-stone-500">“{line.item_notes}”</p>
                  )}
                  <p className="mt-0.5 text-sm font-bold text-stone-400">
                    ${(line.price * line.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-stone-200 p-0.5">
                  <button
                    onClick={() => onChangeQuantity(line.lineKey, line.quantity - 1)}
                    aria-label={`Decrease ${line.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-stone-950 transition hover:bg-stone-100 active:scale-90"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center font-black text-stone-950">{line.quantity}</span>
                  <button
                    onClick={() => onChangeQuantity(line.lineKey, line.quantity + 1)}
                    aria-label={`Increase ${line.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-stone-950 transition hover:bg-stone-100 active:scale-90"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Order notes */}
          <label className="mt-6 block">
            <span className="text-xs font-black uppercase tracking-wide text-stone-400">
              Notes for the kitchen
            </span>
            <textarea
              value={orderNotes}
              onChange={(e) => onChangeOrderNotes(e.target.value)}
              placeholder="Allergies, timing, anything else…"
              rows={2}
              className="mt-2 w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-[15px] text-stone-950 placeholder:text-stone-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            />
          </label>

          {/* Guest info */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-stone-400">
                Name <span className="font-bold normal-case text-stone-300">(optional)</span>
              </span>
              <input
                type="text"
                value={customerName}
                onChange={(e) => onChangeCustomerName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-[15px] text-stone-950 placeholder:text-stone-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-stone-400">
                WhatsApp <span className="font-bold normal-case text-stone-300">(optional)</span>
              </span>
              <input
                type="tel"
                value={customerWhatsApp}
                onChange={(e) => onChangeWhatsApp(e.target.value)}
                placeholder="+506 8888 8888"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-[15px] text-stone-950 placeholder:text-stone-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-6 py-4">
          <div className="mb-3 flex items-center justify-between text-stone-950">
            <span className="font-bold text-stone-500">Total</span>
            <span className="text-2xl font-black">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || lines.length === 0}
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-pink-500 font-black text-white shadow-xl shadow-pink-500/30 transition hover:bg-pink-400 active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                Sending to kitchen…
              </>
            ) : (
              <>
                <Send size={18} />
                Send order to the kitchen
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs font-bold text-stone-400">
            Pay at the table when you’re done — no card needed now.
          </p>
          <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
        </div>
      </div>
    </div>
  )
}
