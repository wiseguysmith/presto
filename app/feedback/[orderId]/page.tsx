import { MessageSquare, Star } from 'lucide-react'
import { createFeedback } from '@/lib/feedback/createFeedback'

interface FeedbackPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { orderId } = await params

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-5 py-10">
      <div className="mx-auto max-w-xl">
        <section className="border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-pink-100 text-pink-700">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-pink-600">Pink Flamingo feedback</p>
              <h1 className="text-2xl font-black text-gray-950">How was your experience?</h1>
            </div>
          </div>

          <form action={createFeedback} className="mt-6 space-y-5">
            <input type="hidden" name="orderId" value={orderId} />

            <div>
              <label className="block text-sm font-bold text-gray-700">Rating</label>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label
                    key={rating}
                    className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-pink-100 bg-pink-50/50 px-2 py-3 text-sm font-black text-gray-800"
                  >
                    <input className="sr-only peer" type="radio" name="rating" value={rating} required />
                    <Star className="text-pink-500 peer-checked:fill-pink-500" size={22} />
                    {rating}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Private note</label>
              <textarea
                name="feedbackText"
                rows={4}
                placeholder="Tell us what went well or what needs attention."
                className="mt-2 w-full rounded-xl border border-pink-100 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <input type="checkbox" name="wantsFollowUp" className="h-4 w-4 rounded border-pink-200" />
              I would like staff to follow up.
            </label>

            <button className="w-full rounded-xl bg-gray-950 px-5 py-4 font-black text-white transition hover:bg-pink-600">
              Submit Feedback
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
