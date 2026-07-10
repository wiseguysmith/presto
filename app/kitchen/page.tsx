import Link from 'next/link'
import { ArrowLeft, Waves } from 'lucide-react'
import { KitchenBoard } from '@/components/kitchen/KitchenBoard'
import { getKitchenOrders } from '@/lib/orders/getOrders'

export default async function KitchenPage() {
  const orders = await getKitchenOrders()

  return (
    <main className="min-h-screen bg-[#0d3237] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f06a5f]">
              <Waves size={21} />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.14em]">Pink Flamingo</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd6a5]">
                Tamarindo kitchen
              </span>
            </span>
          </Link>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white/80 transition hover:bg-white/15">
            <ArrowLeft size={16} />
            Admin
          </Link>
        </div>
        <KitchenBoard initialOrders={orders} />
      </div>
    </main>
  )
}
