'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCircle2, ChefHat, Clock3, RefreshCw } from 'lucide-react'
import { updateOrderStatus } from '@/lib/orders/updateOrderStatus'
import { KitchenOrder, OrderStatus } from '@/types'

interface KitchenBoardProps {
  initialOrders: KitchenOrder[]
}

const columns: { status: OrderStatus; label: string; actionLabel?: string; nextStatus?: OrderStatus }[] = [
  { status: 'sent_to_kitchen', label: 'New tickets', actionLabel: 'Start cooking', nextStatus: 'preparing' },
  { status: 'preparing', label: 'On the line', actionLabel: 'Mark ready', nextStatus: 'ready' },
  { status: 'ready', label: 'Ready for pickup', actionLabel: 'Mark served', nextStatus: 'served' },
  { status: 'served', label: 'Served', actionLabel: undefined },
]

const columnStyles: Record<string, { header: string; count: string; empty: string }> = {
  sent_to_kitchen: {
    header: 'text-[#ffd6a5]',
    count: 'bg-[#f06a5f] text-white',
    empty: 'Waiting for the next table order.',
  },
  preparing: {
    header: 'text-[#9bd5b6]',
    count: 'bg-[#177079] text-white',
    empty: 'Nothing cooking right now.',
  },
  ready: {
    header: 'text-[#bde9e2]',
    count: 'bg-[#c4e0d8] text-[#173f45]',
    empty: 'The pass is clear.',
  },
  served: {
    header: 'text-white/65',
    count: 'bg-white/10 text-white/70',
    empty: 'Completed tickets land here.',
  },
}

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

  const activeOrders = orders.filter((order) => order.status !== 'served').length

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
      <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Live kitchen</p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#9bd5b6]/25 bg-[#9bd5b6]/10 px-3 py-1 text-xs font-black text-[#9bd5b6]">
              <span className="h-2 w-2 rounded-full bg-[#9bd5b6]" />
              Updating every 8 seconds
            </span>
          </div>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Kitchen board</h1>
          <p className="mt-3 text-base leading-7 text-white/60">
            {activeOrders} active {activeOrders === 1 ? 'ticket' : 'tickets'} across the line.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(true)
              playNewOrderTone()
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f06a5f] px-4 font-black text-white transition hover:bg-[#f58270]"
          >
            <Bell size={18} />
            {soundEnabled ? 'Sound on' : 'Enable ticket sound'}
          </button>
          <button
            type="button"
            onClick={refreshOrders}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 font-black text-white transition hover:bg-white/15"
          >
            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
            Refresh board
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const style = columnStyles[column.status]
          const columnOrders = groupedOrders[column.status] || []

          return (
            <section key={column.status} className="min-h-[26rem] border border-white/10 bg-white/[0.06] p-3">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 px-1 pb-3">
                <h2 className={'text-lg font-black ' + style.header}>{column.label}</h2>
                <span className={'rounded-full px-3 py-1 text-sm font-black ' + style.count}>
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <article key={order.id} className="border border-[#e8d7bd] bg-[#fff8eb] p-4 text-[#173f45] shadow-lg shadow-black/10">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e35c52]">Table {order.table_number}</p>
                        <h3 className="mt-1 text-xl font-black">Order {order.id.slice(0, 8)}</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f8f0df] px-2 py-1 text-xs font-bold text-[#557176]">
                        <Clock3 size={14} />
                        {formatTime(order.created_at)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="border border-[#e8d7bd] bg-[#f8f0df] p-3">
                          <div className="flex justify-between gap-3">
                            <p className="font-black">{item.quantity}x {item.name_snapshot}</p>
                            <p className="font-bold">{'$'}{item.line_total.toFixed(2)}</p>
                          </div>
                          {item.item_notes && (
                            <p className="mt-2 border-l-2 border-[#f06a5f] pl-2 text-sm font-bold text-[#b94745]">
                              {item.item_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.order_notes && (
                      <p className="mt-3 border border-[#f2c9b6] bg-[#ffe0d0] p-3 text-sm font-bold text-[#8e5d5d]">
                        Guest note: {order.order_notes}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8d7bd] pt-3">
                      <p className="text-sm font-bold text-[#557176]">
                        {order.payment_method === 'card' ? 'Card paid' : 'Counter paid'}
                      </p>
                      <p className="text-lg font-black">{'$'}{order.total.toFixed(2)}</p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {column.nextStatus && (
                        <button
                          type="button"
                          onClick={() => moveOrder(order.id, column.nextStatus as OrderStatus)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#177079] px-3 text-sm font-black text-white transition hover:bg-[#0f5f66]"
                        >
                          <ChefHat size={16} />
                          {column.actionLabel}
                        </button>
                      )}
                      {order.status !== 'served' && (
                        <button
                          type="button"
                          onClick={() => moveOrder(order.id, 'cancelled')}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#f2c9b6] bg-[#fff1eb] px-3 text-sm font-black text-[#b94745] transition hover:bg-[#ffe0d0]"
                        >
                          Cancel
                        </button>
                      )}
                      {order.status === 'served' && (
                        <div className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d9eee7] px-3 text-sm font-black text-[#177079]">
                          <CheckCircle2 size={16} />
                          Completed
                        </div>
                      )}
                    </div>
                  </article>
                ))}

                {columnOrders.length === 0 && (
                  <p className="border border-dashed border-white/15 px-4 py-10 text-center text-sm font-bold text-white/45">
                    {style.empty}
                  </p>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
