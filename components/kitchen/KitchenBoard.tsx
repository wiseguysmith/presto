'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCircle2, ChefHat, Clock3, RefreshCw } from 'lucide-react'
import { updateOrderStatus } from '@/lib/orders/updateOrderStatus'
import { KitchenOrder, OrderStatus } from '@/types'

interface KitchenBoardProps {
  initialOrders: KitchenOrder[]
}

const columns: { status: OrderStatus; label: string; actionLabel?: string; nextStatus?: OrderStatus }[] = [
  { status: 'sent_to_kitchen', label: 'New', actionLabel: 'Start', nextStatus: 'preparing' },
  { status: 'preparing', label: 'Preparing', actionLabel: 'Ready', nextStatus: 'ready' },
  { status: 'ready', label: 'Ready', actionLabel: 'Served', nextStatus: 'served' },
  { status: 'served', label: 'Served' },
]

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function playNewOrderTone() {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.06
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.18)
}

export function KitchenBoard({ initialOrders }: KitchenBoardProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const knownOrderIds = useRef(new Set(initialOrders.map((order) => order.id)))

  const groupedOrders = useMemo(() => {
    return columns.reduce<Record<string, KitchenOrder[]>>((acc, column) => {
      acc[column.status] = orders.filter((order) => order.status === column.status)
      return acc
    }, {})
  }, [orders])

  const refreshOrders = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/kitchen/orders', { cache: 'no-store' })
      const data = await response.json()
      const nextOrders = data.orders as KitchenOrder[]
      const hasNewOrder = nextOrders.some((order) => !knownOrderIds.current.has(order.id))

      if (hasNewOrder && soundEnabled) {
        playNewOrderTone()
      }

      knownOrderIds.current = new Set(nextOrders.map((order) => order.id))
      setOrders(nextOrders)
    } finally {
      setIsRefreshing(false)
    }
  }, [soundEnabled])

  async function moveOrder(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status)
    await refreshOrders()
  }

  useEffect(() => {
    const interval = window.setInterval(refreshOrders, 8000)
    return () => window.clearInterval(interval)
  }, [refreshOrders])

  return (
    <div>
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase text-pink-300">Live kitchen</p>
          <h1 className="text-4xl font-black text-white">Pink Flamingo Orders</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(true)
              playNewOrderTone()
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 font-black text-white transition hover:bg-pink-400"
          >
            <Bell size={18} />
            {soundEnabled ? 'Sound On' : 'Enable Sound'}
          </button>
          <button
            type="button"
            onClick={refreshOrders}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 font-black text-gray-950 transition hover:bg-pink-100"
          >
            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <section key={column.status} className="min-h-[24rem] rounded-2xl border border-white/10 bg-white/8 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{column.label}</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-pink-100">
                {groupedOrders[column.status]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {(groupedOrders[column.status] || []).map((order) => (
                <article key={order.id} className="rounded-2xl bg-white p-4 text-gray-950 shadow-xl shadow-black/10">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-pink-600">Table {order.table_number}</p>
                      <h3 className="text-xl font-black">Order {order.id.slice(0, 8)}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                      <Clock3 size={14} />
                      {formatTime(order.created_at)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                        <div className="flex justify-between gap-3">
                          <p className="font-black">{item.quantity}x {item.name_snapshot}</p>
                          <p className="font-bold">${item.line_total.toFixed(2)}</p>
                        </div>
                        {item.item_notes && <p className="mt-1 text-sm text-pink-700">{item.item_notes}</p>}
                      </div>
                    ))}
                  </div>

                  {order.order_notes && (
                    <p className="mt-3 rounded-xl border border-pink-100 bg-pink-50 p-3 text-sm font-medium text-pink-800">
                      {order.order_notes}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <p className="text-sm font-bold text-gray-500">{order.payment_method === 'card' ? 'Card paid' : 'Counter paid'}</p>
                    <p className="text-lg font-black">${order.total.toFixed(2)}</p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {column.nextStatus && (
                      <button
                        type="button"
                        onClick={() => moveOrder(order.id, column.nextStatus as OrderStatus)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-3 text-sm font-black text-white transition hover:bg-pink-600"
                      >
                        <ChefHat size={16} />
                        {column.actionLabel}
                      </button>
                    )}
                    {order.status !== 'served' && (
                      <button
                        type="button"
                        onClick={() => moveOrder(order.id, 'cancelled')}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 text-sm font-black text-red-700 transition hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    )}
                    {order.status === 'served' && (
                      <div className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 text-sm font-black text-emerald-700">
                        <CheckCircle2 size={16} />
                        Completed
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {(groupedOrders[column.status] || []).length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm font-bold text-white/45">
                  No orders
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
