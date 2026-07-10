'use client'

import { useEffect } from 'react'
import { Banknote, CreditCard, Minus, Plus, Send, X } from 'lucide-react'
import { CartItem, GuestSource, PaymentMethod } from '@/types'

export interface CartLine extends CartItem {
  lineKey: string
}

interface CartDrawerProps {
  lines: CartLine[]
  tableNumber: number
  orderNotes: string
  customerName: string
  customerEmail: string
  customerWhatsApp: string
  paymentMethod: PaymentMethod
  tipPercent: number
  guestSource: GuestSource | ''
  isSubmitting: boolean
  error: string | null
  onChangeQuantity: (lineKey: string, quantity: number) => void
  onChangeOrderNotes: (value: string) => void
  onChangeCustomerName: (value: string) => void
  onChangeCustomerEmail: (value: string) => void
  onChangeWhatsApp: (value: string) => void
  onChangePaymentMethod: (value: PaymentMethod) => void
  onChangeTipPercent: (value: number) => void
  onChangeGuestSource: (value: GuestSource | '') => void
  onSubmit: () => void
  onClose: () => void
}

const guestSourceOptions: { value: GuestSource; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'walk_by', label: 'Walk-by' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'friend', label: 'Friend' },
  { value: 'local_resident', label: 'Local resident' },
  { value: 'tourist', label: 'Tourist' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'other', label: 'Other' },
]

export function CartDrawer({
  lines,
  tableNumber,
  orderNotes,
  customerName,
  customerEmail,
  customerWhatsApp,
  paymentMethod,
  tipPercent,
  guestSource,
  isSubmitting,
  error,
  onChangeQuantity,
  onChangeOrderNotes,
  onChangeCustomerName,
  onChangeCustomerEmail,
  onChangeWhatsApp,
  onChangePaymentMethod,
  onChangeTipPercent,
  onChangeGuestSource,
  onSubmit,
  onClose,
}: CartDrawerProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const tipAmount = subtotal * (tipPercent / 100)
  const total = subtotal + tipAmount

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

      <div className="animate-sheet-up relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-[#fff8eb] shadow-2xl sm:max-h-[85vh] sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-[#e8d7bd] px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e35c52]">
              Table {tableNumber}
            </p>
            <h2 className="text-xl font-black text-[#173f45]">Your table order</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f0df] text-[#173f45] transition hover:bg-[#d9eee7] active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.lineKey} className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-snug text-stone-950">{line.name}</p>
                  {line.item_notes && (
                    <p className="mt-0.5 text-sm italic text-stone-500">{line.item_notes}</p>
                  )}
                   <p className="mt-0.5 text-sm font-bold text-[#7b9492]">
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

                <div className="mt-6 space-y-4 border-t border-[#e8d7bd] pt-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#7b9492]">Tip</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[0, 10, 15, 20].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onChangeTipPercent(option)}
                    className={`min-h-11 rounded-full border text-sm font-black transition ${
                      tipPercent === option
                        ? 'border-[#f06a5f] bg-[#f06a5f] text-white'
                        : 'border-[#d5e4df] bg-[#f8f0df] text-[#557176] hover:border-[#e35c52] hover:bg-[#ffe0d0]'
                    }`}
                  >
                    {option === 0 ? 'No tip' : `${option}%`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#7b9492]">Payment</p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => onChangePaymentMethod('card')}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === 'card'
                      ? 'border-[#f06a5f] bg-[#ffe0d0] text-[#173f45]'
                      : 'border-[#d5e4df] bg-[#f8f0df] text-[#557176] hover:border-[#e35c52] hover:bg-[#ffe0d0]'
                  }`}
                >
                  <CreditCard size={20} className="shrink-0 text-[#e35c52]" />
                  <span>
                    <span className="block font-black">Pay by card</span>
                    <span className="text-xs font-bold text-[#557176]">
                      Opens secure Stripe checkout.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangePaymentMethod('counter')}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === 'counter'
                      ? 'border-[#f06a5f] bg-[#ffe0d0] text-[#173f45]'
                      : 'border-[#d5e4df] bg-[#f8f0df] text-[#557176] hover:border-[#e35c52] hover:bg-[#ffe0d0]'
                  }`}
                >
                  <Banknote size={20} className="shrink-0 text-[#e35c52]" />
                  <span>
                    <span className="block font-black">Pay at counter/table</span>
                    <span className="text-xs font-bold text-[#557176]">
                      Staff confirms payment before kitchen receives it.
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-[#7b9492]">
                Notes for the kitchen
              </span>
              <textarea
                value={orderNotes}
                onChange={(event) => onChangeOrderNotes(event.target.value)}
                placeholder="Allergies, timing, anything else..."
                rows={2}
                className="mt-2 w-full resize-none rounded-2xl border border-[#d5e4df] bg-[#f8f0df] px-4 py-3 text-[15px] text-[#173f45] placeholder:text-[#7b9492] focus:border-[#e35c52] focus:bg-[#fff8eb] focus:outline-none focus:ring-4 focus:ring-[#f06a5f]/15"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-[#7b9492]">
                  Name <span className="font-bold normal-case text-[#a3b6b3]">(optional)</span>
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => onChangeCustomerName(event.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-[#d5e4df] bg-[#f8f0df] px-4 py-3 text-[15px] text-[#173f45] placeholder:text-[#7b9492] focus:border-[#e35c52] focus:bg-[#fff8eb] focus:outline-none focus:ring-4 focus:ring-[#f06a5f]/15"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-[#7b9492]">
                  WhatsApp <span className="font-bold normal-case text-[#a3b6b3]">(optional)</span>
                </span>
                <input
                  type="tel"
                  value={customerWhatsApp}
                  onChange={(event) => onChangeWhatsApp(event.target.value)}
                  placeholder="+506 8888 8888"
                  className="mt-2 w-full rounded-2xl border border-[#d5e4df] bg-[#f8f0df] px-4 py-3 text-[15px] text-[#173f45] placeholder:text-[#7b9492] focus:border-[#e35c52] focus:bg-[#fff8eb] focus:outline-none focus:ring-4 focus:ring-[#f06a5f]/15"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-[#7b9492]">
                Email for receipt
              </span>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(event) => onChangeCustomerEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-[#d5e4df] bg-[#f8f0df] px-4 py-3 text-[15px] text-[#173f45] placeholder:text-[#7b9492] focus:border-[#e35c52] focus:bg-[#fff8eb] focus:outline-none focus:ring-4 focus:ring-[#f06a5f]/15"
              />
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-[#7b9492]">
                How did you hear about us?
              </span>
              <select
                value={guestSource}
                onChange={(event) => onChangeGuestSource(event.target.value as GuestSource | '')}
                className="mt-2 w-full rounded-2xl border border-[#d5e4df] bg-[#f8f0df] px-4 py-3 text-[15px] text-[#173f45] focus:border-[#e35c52] focus:bg-[#fff8eb] focus:outline-none focus:ring-4 focus:ring-[#f06a5f]/15"
              >
                <option value="">Choose one</option>
                {guestSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-[#ffe3dc] px-4 py-3 text-sm font-bold text-[#b94745]">
              {error}
            </p>
          )}
        </div>

        <div className="border-t border-[#e8d7bd] px-6 py-4">
          <div className="mb-3 space-y-1 text-[#173f45]">
            <div className="flex items-center justify-between text-sm font-bold text-[#7b9492]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-[#7b9492]">
              <span>Tip</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#557176]">Total</span>
              <span className="text-2xl font-black">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || lines.length === 0}
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#f06a5f] font-black text-white shadow-xl shadow-[#f06a5f]/30 transition hover:bg-[#f58270] active:scale-[0.98] disabled:bg-[#d5e4df] disabled:text-[#7b9492] disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                Sending order...
              </>
            ) : (
              <>
                <Send size={18} />
                {paymentMethod === 'card' ? 'Continue to payment' : 'Submit for staff payment'}
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs font-bold text-[#7b9492]">
            {paymentMethod === 'card'
              ? 'You will pay securely before the kitchen receives the order.'
              : 'Staff will confirm payment and send your order to the kitchen.'}
          </p>
          <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
        </div>
      </div>
    </div>
  )
}
