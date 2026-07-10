'use client'

import { useEffect } from 'react'
import { Banknote, CheckCircle2, UtensilsCrossed } from 'lucide-react'
import { PaymentMethod } from '@/types'

interface OrderConfirmationProps {
  orderId: string
  tableNumber: number
  paymentMethod: PaymentMethod
  status: 'pending_payment' | 'sent_to_kitchen'
  total: number
  onNewOrder: () => void
}

export function OrderConfirmation({
  orderId,
  tableNumber,
  paymentMethod,
  status,
  total,
  onNewOrder,
}: OrderConfirmationProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const shortRef = orderId.replace(/-/g, '').slice(0, 6).toUpperCase()
  const waitingForStaff = paymentMethod === 'counter' || status === 'pending_payment'

  return (
    <div className="animate-fade-in fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#f8f0df] px-6 text-center">
      <div className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-full bg-[#f06a5f] shadow-2xl shadow-[#f06a5f]/35">
        {waitingForStaff ? (
          <Banknote className="text-white" size={44} />
        ) : (
          <CheckCircle2 className="text-white" size={48} />
        )}
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-wide text-[#e35c52]">
        Order {shortRef} - Table {tableNumber}
      </p>
      <h1 className="mt-2 max-w-md text-4xl font-black leading-tight text-[#173f45]">
        {waitingForStaff ? 'Waiting for staff payment' : 'Order sent to the kitchen'}
      </h1>
      <p className="mt-4 max-w-sm text-[17px] leading-8 text-[#557176]">
        {waitingForStaff
          ? 'Thank you. Please stay at your table. A staff member will confirm payment and send your order to the kitchen.'
          : 'Thank you. Your order has been sent to the restaurant. Please stay at your table. A staff member will assist you shortly.'}
      </p>

      <p className="mt-5 rounded-full bg-[#fff8eb] px-5 py-3 text-sm font-black text-[#557176] shadow-sm">
        Total ${total.toFixed(2)}
      </p>

      <button
        onClick={onNewOrder}
        className="mt-10 flex h-[54px] items-center gap-2 rounded-full bg-[#173f45] px-8 font-black text-white shadow-xl shadow-[#173f45]/25 transition hover:bg-[#177079] active:scale-[0.98]"
      >
        <UtensilsCrossed size={18} />
        Order something else
      </button>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Powered by Mindful Tech
      </p>
    </div>
  )
}
