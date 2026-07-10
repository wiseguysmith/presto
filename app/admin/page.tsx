import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  Banknote,
  BarChart3,
  CheckCircle2,
  ChefHat,
  Clock3,
  PackageX,
  Waves,
} from 'lucide-react'
import { confirmCounterPayment } from '@/lib/orders/updateOrderStatus'
import { getPendingPaymentOrders, getTodaySalesSummary } from '@/lib/orders/getOrders'

async function confirmPaymentAction(formData: FormData) {
  'use server'
  const orderId = String(formData.get('orderId') || '')
  if (orderId) {
    await confirmCounterPayment(orderId)
  }
}

const primaryActionClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f06a5f] px-4 font-black text-white transition hover:bg-[#f58270]'
const secondaryActionClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#c8ddd7] bg-[#fff8eb] px-4 font-black text-[#173f45] transition hover:border-[#f06a5f] hover:bg-[#ffe0d0]'

export default async function AdminPage() {
  const [pendingOrders, sales] = await Promise.all([getPendingPaymentOrders(), getTodaySalesSummary()])

  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#173f45]">
      <header className="bg-[#173f45] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f06a5f]">
                <Waves size={21} />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.14em]">Pink Flamingo</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd6a5]">
                  Tamarindo staff
                </span>
              </span>
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white/80">
              <Activity size={15} className="text-[#9bd5b6]" />
              Service online
            </span>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Staff dashboard</p>
              <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">Keep the beach day moving.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                Payments, kitchen tickets, sales, and menu availability in one place.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/kitchen" className={primaryActionClass}>
                <ChefHat size={18} />
                Open kitchen board
                <ArrowUpRight size={17} />
              </Link>
              <Link href="/admin/sales" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 font-black text-white transition hover:bg-white/15">
                <BarChart3 size={18} />
                Sales
              </Link>
              <Link href="/admin/menu" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 font-black text-white transition hover:bg-white/15">
                <PackageX size={18} />
                Menu
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-8 max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="border border-[#c8ddd7] bg-[#fff8eb] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#557176]">Today sales</p>
            <p className="mt-3 text-3xl font-black text-[#173f45]">
              {'$'}{sales.grossSales.toFixed(2)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#7b9492]">Gross paid orders</p>
          </div>
          <div className="border border-[#c8ddd7] bg-[#d9eee7] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#177079]">Orders</p>
            <p className="mt-3 text-3xl font-black text-[#173f45]">{sales.orderCount}</p>
            <p className="mt-2 text-xs font-bold text-[#557176]">Paid today</p>
          </div>
          <div className="border border-[#f2c9b6] bg-[#ffe0d0] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b94745]">Tips</p>
            <p className="mt-3 text-3xl font-black text-[#173f45]">
              {'$'}{sales.tips.toFixed(2)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#8e5d5d]">Guest appreciation</p>
          </div>
          <div className="border border-[#e8d7bd] bg-[#fff8eb] p-4 shadow-lg shadow-[#173f45]/5 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#557176]">Average order</p>
            <p className="mt-3 text-3xl font-black text-[#173f45]">
              {'$'}{sales.averageOrderValue.toFixed(2)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#7b9492]">Per paid order</p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <section className="border border-[#e8d7bd] bg-[#fff8eb] p-5 shadow-lg shadow-[#173f45]/5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-[#e8d7bd] pb-5 sm:flex-row sm:items-start">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffe0d0] text-[#e35c52]">
                  <Banknote size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e35c52]">
                    Counter or table payments
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#173f45]">Payment queue</h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f0df] px-3 py-2 text-xs font-black text-[#557176]">
                <Clock3 size={14} />
                {pendingOrders.length} waiting
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {pendingOrders.map((order) => (
                <article key={order.id} className="grid gap-4 border border-[#e8d7bd] bg-[#f8f0df] p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-xl font-black text-[#173f45]">Table {order.table_number}</p>
                      <span className="rounded-full bg-[#ffe0d0] px-3 py-1 text-xs font-black text-[#b94745]">
                        {'$'}{order.total.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#7b9492]">{order.id}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.order_items.map((item) => (
                        <span key={item.id} className="rounded-full bg-[#fff8eb] px-3 py-1 text-sm font-bold text-[#557176]">
                          {item.quantity}x {item.name_snapshot}
                        </span>
                      ))}
                    </div>
                  </div>
                  <form action={confirmPaymentAction}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#177079] px-5 font-black text-white transition hover:bg-[#0f5f66] md:w-auto">
                      <CheckCircle2 size={17} />
                      Mark paid and send
                    </button>
                  </form>
                </article>
              ))}

              {pendingOrders.length === 0 && (
                <div className="border border-dashed border-[#c8ddd7] bg-[#d9eee7]/45 px-5 py-10 text-center">
                  <CheckCircle2 className="mx-auto text-[#177079]" size={30} />
                  <p className="mt-3 text-lg font-black text-[#173f45]">Payment queue is clear.</p>
                  <p className="mt-1 text-sm font-bold text-[#557176]">
                    New pay-at-table orders will show up here for confirmation.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="border border-[#c8ddd7] bg-[#173f45] p-5 text-white shadow-lg shadow-[#173f45]/10 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Service shortcuts</p>
            <h2 className="mt-2 text-2xl font-black">What needs attention?</h2>
            <div className="mt-6 space-y-3">
              <Link href="/kitchen" className="flex items-center justify-between gap-4 border border-white/15 bg-white/10 p-4 transition hover:bg-white/15">
                <span className="flex items-center gap-3">
                  <ChefHat size={19} className="text-[#f06a5f]" />
                  <span>
                    <span className="block font-black">Kitchen board</span>
                    <span className="block text-xs font-bold text-white/55">Move tickets through service</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-[#ffd6a5]" />
              </Link>
              <Link href="/admin/menu" className="flex items-center justify-between gap-4 border border-white/15 bg-white/10 p-4 transition hover:bg-white/15">
                <span className="flex items-center gap-3">
                  <PackageX size={19} className="text-[#f06a5f]" />
                  <span>
                    <span className="block font-black">Menu availability</span>
                    <span className="block text-xs font-bold text-white/55">Mark items sold out</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-[#ffd6a5]" />
              </Link>
              <Link href="/admin/sales" className="flex items-center justify-between gap-4 border border-white/15 bg-white/10 p-4 transition hover:bg-white/15">
                <span className="flex items-center gap-3">
                  <BarChart3 size={19} className="text-[#f06a5f]" />
                  <span>
                    <span className="block font-black">Daily sales</span>
                    <span className="block text-xs font-bold text-white/55">Review totals and export</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-[#ffd6a5]" />
              </Link>
            </div>
            <p className="mt-8 border-t border-white/10 pt-5 text-xs font-bold leading-5 text-white/45">
              Pink Flamingo staff tools, powered by Mindful Tech.
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
