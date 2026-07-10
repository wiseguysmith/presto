import Link from 'next/link'
import { ArrowLeft, Download, TrendingUp, Utensils, Waves } from 'lucide-react'
import { getTodaySalesSummary } from '@/lib/orders/getOrders'

export default async function SalesPage() {
  const sales = await getTodaySalesSummary()

  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#173f45]">
      <header className="bg-[#173f45] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-black text-white/75 transition hover:text-white">
              <ArrowLeft size={17} />
              Back to service dashboard
            </Link>
            <Link href="/" className="hidden items-center gap-2 sm:inline-flex">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f06a5f]">
                <Waves size={18} />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.14em]">Pink Flamingo staff</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Service numbers</p>
              <h1 className="mt-2 text-4xl font-black sm:text-5xl">Daily sales</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                A quick read on what came through the counter and the table flow today.
              </p>
            </div>
            <a
              href="/admin/sales/export"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f06a5f] px-5 font-black text-white transition hover:bg-[#f58270]"
            >
              <Download size={18} />
              Export CSV
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-7 max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="border border-[#c8ddd7] bg-[#fff8eb] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#557176]">Gross sales</p>
            <p className="mt-3 text-3xl font-black">{'$'}{sales.grossSales.toFixed(2)}</p>
            <p className="mt-2 text-xs font-bold text-[#7b9492]">All paid orders</p>
          </div>
          <div className="border border-[#c8ddd7] bg-[#d9eee7] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#177079]">Card</p>
            <p className="mt-3 text-3xl font-black">{'$'}{sales.cardSales.toFixed(2)}</p>
            <p className="mt-2 text-xs font-bold text-[#557176]">Online checkout</p>
          </div>
          <div className="border border-[#f2c9b6] bg-[#ffe0d0] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b94745]">Counter</p>
            <p className="mt-3 text-3xl font-black">{'$'}{sales.counterSales.toFixed(2)}</p>
            <p className="mt-2 text-xs font-bold text-[#8e5d5d]">Pay at table</p>
          </div>
          <div className="border border-[#e8d7bd] bg-[#fff8eb] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#557176]">Tips</p>
            <p className="mt-3 text-3xl font-black">{'$'}{sales.tips.toFixed(2)}</p>
            <p className="mt-2 text-xs font-bold text-[#7b9492]">Guest appreciation</p>
          </div>
          <div className="border border-[#c8ddd7] bg-[#177079] p-4 text-white shadow-lg shadow-[#173f45]/10 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#c4e0d8]">Orders</p>
            <p className="mt-3 text-3xl font-black">{sales.orderCount}</p>
            <p className="mt-2 text-xs font-bold text-white/65">Paid today</p>
          </div>
        </section>

        <section className="mt-8 border border-[#e8d7bd] bg-[#fff8eb] shadow-lg shadow-[#173f45]/5">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e8d7bd] px-5 py-5 sm:flex-row sm:items-start sm:px-6">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d9eee7] text-[#177079]">
                <Utensils size={20} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e35c52]">Top items</p>
                <h2 className="mt-1 text-2xl font-black">What guests are buying today</h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f0df] px-3 py-2 text-xs font-black text-[#557176]">
              <TrendingUp size={14} />
              By paid orders
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {sales.topItems.length > 0 ? (
              <div className="space-y-2">
                <div className="hidden grid-cols-[1fr_auto_auto] gap-4 px-4 pb-1 text-xs font-black uppercase tracking-[0.14em] text-[#7b9492] sm:grid">
                  <span>Menu item</span>
                  <span>Quantity</span>
                  <span>Sales</span>
                </div>
                {sales.topItems.map((item, index) => (
                  <div key={item.name} className="grid grid-cols-[auto_1fr] items-center gap-3 border border-[#e8d7bd] bg-[#f8f0df] p-4 sm:grid-cols-[auto_1fr_auto_auto]">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d9eee7] text-sm font-black text-[#177079]">
                      {index + 1}
                    </span>
                    <p className="font-black">{item.name}</p>
                    <p className="text-sm font-bold text-[#557176]">{item.quantity} sold</p>
                    <p className="font-black">{'$'}{item.sales.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#c8ddd7] bg-[#d9eee7]/45 px-5 py-12 text-center">
                <TrendingUp className="mx-auto text-[#177079]" size={30} />
                <p className="mt-3 text-lg font-black">No paid orders yet today.</p>
                <p className="mt-1 text-sm font-bold text-[#557176]">
                  Your top items will appear here once guests start ordering.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
