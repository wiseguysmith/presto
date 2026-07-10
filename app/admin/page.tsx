import Link from 'next/link'
import { Banknote, BarChart3, ChefHat, PackageX } from 'lucide-react'
import { confirmCounterPayment } from '@/lib/orders/updateOrderStatus'
import { getPendingPaymentOrders, getTodaySalesSummary } from '@/lib/orders/getOrders'

async function confirmPaymentAction(formData: FormData) {
  'use server'
  const orderId = String(formData.get('orderId') || '')
  if (orderId) {
    await confirmCounterPayment(orderId)
  }
}

export default async function AdminPage() {
  const [pendingOrders, sales] = await Promise.all([getPendingPaymentOrders(), getTodaySalesSummary()])

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-pink-600">Pink Flamingo Launch OS</p>
            <h1 className="mt-2 text-4xl font-black text-gray-950">Admin</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/kitchen"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 font-black text-white hover:bg-pink-600"
            >
              <ChefHat size={18} />
              Kitchen Board
            </Link>
            <Link
              href="/admin/sales"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-4 font-black text-pink-700 hover:bg-pink-50"
            >
              <BarChart3 size={18} />
              Sales
            </Link>
            <Link
              href="/admin/menu"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-4 font-black text-pink-700 hover:bg-pink-50"
            >
              <PackageX size={18} />
              Sold Out
            </Link>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Today sales</p>
            <p className="mt-2 text-3xl font-black">${sales.grossSales.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Orders</p>
            <p className="mt-2 text-3xl font-black">{sales.orderCount}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Tips</p>
            <p className="mt-2 text-3xl font-black">${sales.tips.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Avg order</p>
            <p className="mt-2 text-3xl font-black">${sales.averageOrderValue.toFixed(2)}</p>
          </div>
        </section>

        <section className="border border-pink-100 bg-white p-5 shadow-xl shadow-pink-100">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-pink-100 text-pink-700">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-pink-600">Counter/table payments</p>
              <h2 className="text-2xl font-black text-gray-950">Waiting for staff confirmation</h2>
            </div>
          </div>

          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <article key={order.id} className="grid gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-xl font-black text-gray-950">Table {order.table_number}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-pink-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-500">{order.id}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.order_items.map((item) => (
                      <span key={item.id} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
                        {item.quantity}x {item.name_snapshot}
                      </span>
                    ))}
                  </div>
                </div>
                <form action={confirmPaymentAction}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <button className="w-full rounded-xl bg-emerald-600 px-5 py-4 font-black text-white transition hover:bg-emerald-700 md:w-auto">
                    Mark Paid + Send to Kitchen
                  </button>
                </form>
              </article>
            ))}

            {pendingOrders.length === 0 && (
              <p className="rounded-2xl border border-dashed border-pink-100 py-12 text-center font-bold text-gray-500">
                No pending counter payments.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
