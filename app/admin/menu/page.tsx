import Link from 'next/link'
import { PackageX } from 'lucide-react'
import { getAdminMenu } from '@/lib/menu/getAdminMenu'
import { updateMenuItemAvailability } from '@/lib/menu/updateAvailability'

export default async function AdminMenuPage() {
  const { categories, items } = await getAdminMenu()

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link href="/admin" className="text-sm font-black uppercase text-pink-600">
              Back to admin
            </Link>
            <h1 className="mt-2 text-4xl font-black text-gray-950">Menu Availability</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-600">
            Use this during service to mark dishes sold out or bring them back. Full menu editing comes later.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category_id === category.id)

            return (
              <section key={category.id} className="border border-pink-100 bg-white p-5 shadow-xl shadow-pink-100">
                <h2 className="text-2xl font-black text-gray-950">{category.name}</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {categoryItems.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black text-gray-950">{item.name}</p>
                          <p className="mt-1 text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                            item.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {item.available ? 'Available' : 'Sold out'}
                        </span>
                      </div>

                      <form action={updateMenuItemAvailability} className="mt-4">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="available" value={item.available ? 'false' : 'true'} />
                        <button
                          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 font-black transition ${
                            item.available
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          <PackageX size={18} />
                          {item.available ? 'Mark Sold Out' : 'Bring Back'}
                        </button>
                      </form>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
