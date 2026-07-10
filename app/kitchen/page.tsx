import Link from 'next/link'
import { KitchenBoard } from '@/components/kitchen/KitchenBoard'
import { getKitchenOrders } from '@/lib/orders/getOrders'

export default async function KitchenPage() {
  const orders = await getKitchenOrders()

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <div className="mb-5 flex justify-end">
          <Link href="/admin" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/15">
            Admin
          </Link>
        </div>
        <KitchenBoard initialOrders={orders} />
      </div>
    </main>
  )
}
