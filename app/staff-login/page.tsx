import { LockKeyhole } from 'lucide-react'
import { staffLogin } from '@/lib/auth/staff'

interface StaffLoginPageProps {
  searchParams: Promise<{
    next?: string
    error?: string
  }>
}

export default async function StaffLoginPage({ searchParams }: StaffLoginPageProps) {
  const params = await searchParams
  const next = params.next || '/admin'

  return (
    <main className="min-h-screen bg-[#173f45] px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-[#0b3035]/55 p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f06a5f] text-white">
              <LockKeyhole size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Pink Flamingo staff</p>
              <h1 className="text-2xl font-black">Enter staff PIN</h1>
            </div>
          </div>

          {params.error && (
            <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
              That PIN did not work.
            </p>
          )}

          <form action={staffLogin} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="block text-sm font-bold text-white/75">Staff PIN</label>
              <input
                name="pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#fff8eb] px-3 py-4 text-lg font-black text-[#173f45] focus:outline-none focus:ring-2 focus:ring-[#f06a5f]"
              />
            </div>
            <button className="w-full rounded-xl bg-[#f06a5f] px-5 py-4 font-black text-white transition hover:bg-[#f58270]">
              Unlock Staff Tools
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
