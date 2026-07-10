import Link from 'next/link'
import { CheckCircle, MessageSquare, QrCode } from 'lucide-react'

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <section className="w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-100">
          <div className="bg-gray-950 px-7 py-8 text-center text-white">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-500">
              <CheckCircle size={46} />
            </div>
            <p className="text-xs font-black uppercase text-emerald-200">Payment confirmed</p>
            <h1 className="mt-2 text-3xl font-black">Your order is going to the kitchen</h1>
          </div>

          <div className="px-7 py-7">
            <p className="text-center text-lg leading-8 text-gray-700">
              Thank you. Please stay at your table and staff will assist you shortly.
            </p>

            <div className="my-6 rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3">
              <p className="text-xs font-bold uppercase text-pink-500">Order ID</p>
              <p className="mt-1 break-all font-mono text-lg font-black text-gray-950">{orderId}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href={`/feedback/${orderId}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 font-black text-white transition hover:bg-pink-700"
              >
                <MessageSquare size={18} />
                Leave Feedback
              </Link>
              <Link
                href="/menu/pink-flamingo/table/1"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-4 font-black text-pink-700 transition hover:bg-pink-50"
              >
                <QrCode size={18} />
                New Order
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
