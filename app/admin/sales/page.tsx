import Link from 'next/link'
import { Download, Utensils } from 'lucide-react'
import { getTodaySalesSummary } from '@/lib/orders/getOrders'

export default async function SalesPage() {
  const sales = await getTodaySalesSummary()

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link href="/admin" className="text-sm font-black uppercase text-pink-600">
              Back to admin
            </Link>
            <h1 className="mt-2 text-4xl font-black text-gray-950">Daily Sales</h1>
          </div>
          <a
            href="/admin/sales/export"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 font-black text-white hover:bg-pink-600"
          >
            <Download size={18} />
            Export CSV
          </a>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Gross sales</p>
            <p className="mt-2 text-3xl font-black">${sales.grossSales.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Card</p>
            <p className="mt-2 text-3xl font-black">${sales.cardSales.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Counter</p>
            <p className="mt-2 text-3xl font-black">${sales.counterSales.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Tips</p>
            <p className="mt-2 text-3xl font-black">${sales.tips.toFixed(2)}</p>
          </div>
          <div className="border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold text-gray-500">Orders</p>
            <p className="mt-2 text-3xl font-black">{sales.orderCount}</p>
          </div>
        </section>

        <section className="mt-8 border border-pink-100 bg-white p-5 shadow-xl shadow-pink-100">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-pink-100 text-pink-700">
              <Utensils size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-pink-600">Top items</p>
              <h2 className="text-2xl font-black text-gray-950">What guests are buying today</h2>
            </div>
          </div>

          <div className="space-y-3">
            {sales.topItems.map((item) => (
              <div key={item.name} className="grid grid-cols-[1fr_auto_auto] gap-4 rounded-2xl bg-gray-50 p-4">
                <p className="font-black text-gray-950">{item.name}</p>
                <p className="font-bold text-gray-600">{item.quantity} sold</p>
                <p className="font-black text-gray-950">${item.sales.toFixed(2)}</p>
              </div>
            ))}

            {sales.topItems.length === 0 && (
              <p className="rounded-2xl border border-dashed border-pink-100 py-12 text-center font-bold text-gray-500">
                No paid orders yet today.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
