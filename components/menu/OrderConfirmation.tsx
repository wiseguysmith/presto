'use client'

import { CheckCircle } from 'lucide-react'

interface OrderConfirmationProps {
  orderId: string
  onNewOrder: () => void
}

export function OrderConfirmation({ orderId, onNewOrder }: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed</h2>
        <p className="text-lg text-gray-700 mb-6">
          Thank you. Your order has been sent to the restaurant. Please stay at your table. A staff member will
          assist you shortly.
        </p>
        <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
        <button
          onClick={onNewOrder}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Continue Ordering
        </button>
      </div>
    </div>
  )
}
