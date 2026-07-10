import Link from 'next/link'
import { ArrowLeft, CheckCircle2, PackageX, Waves } from 'lucide-react'
import { getAdminMenu } from '@/lib/menu/getAdminMenu'
import { updateMenuItemAvailability } from '@/lib/menu/updateAvailability'

export default async function AdminMenuPage() {
  const { categories, items } = await getAdminMenu()
  const availableCount = items.filter((item) => item.available).length

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
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">Live menu control</p>
              <h1 className="mt-2 text-4xl font-black sm:text-5xl">Menu availability</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                Keep the guest menu honest during service. Mark a dish sold out, then bring it back when the kitchen is ready.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white/80">
              <CheckCircle2 size={17} className="text-[#9bd5b6]" />
              {availableCount} of {items.length} items available
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <div className="space-y-5">
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category_id === category.id)
            const categoryAvailable = categoryItems.filter((item) => item.available).length

            return (
              <section key={category.id} className="border border-[#e8d7bd] bg-[#fff8eb] shadow-lg shadow-[#173f45]/5">
                <div className="flex flex-col justify-between gap-3 border-b border-[#e8d7bd] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                  <h2 className="text-2xl font-black">{category.name}</h2>
                  <span className="inline-flex w-fit items-center rounded-full bg-[#d9eee7] px-3 py-2 text-xs font-black text-[#177079]">
                    {categoryAvailable} of {categoryItems.length} available
                  </span>
                </div>
                <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2">
                  {categoryItems.map((item) => {
                    const statusClass = item.available
                      ? 'bg-[#d9eee7] text-[#177079]'
                      : 'bg-[#ffe0d0] text-[#b94745]'
                    const actionClass = item.available
                      ? 'border border-[#f2c9b6] bg-[#ffe0d0] text-[#b94745] hover:bg-[#ffd4c2]'
                      : 'bg-[#177079] text-white hover:bg-[#0f5f66]'

                    return (
                      <article key={item.id} className="border border-[#e8d7bd] bg-[#f8f0df] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-black">{item.name}</p>
                            <p className="mt-1 text-sm font-bold text-[#557176]">{'$'}{item.price.toFixed(2)}</p>
                          </div>
                          <span className={'rounded-full px-3 py-1 text-xs font-black uppercase ' + statusClass}>
                            {item.available ? 'Available' : 'Sold out'}
                          </span>
                        </div>

                        <form action={updateMenuItemAvailability} className="mt-4">
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="available" value={item.available ? 'false' : 'true'} />
                          <button className={'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 font-black transition ' + actionClass}>
                            <PackageX size={18} />
                            {item.available ? 'Mark sold out' : 'Bring back to menu'}
                          </button>
                        </form>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
