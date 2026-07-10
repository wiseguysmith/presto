import Link from 'next/link'
import {
  ArrowRight,
  ChefHat,
  LockKeyhole,
  MapPin,
  QrCode,
  Sparkles,
  Sun,
  Waves,
} from 'lucide-react'

const demoTables = Array.from({ length: 10 }, (_, index) => index + 1)

const guestSteps = [
  {
    icon: QrCode,
    label: 'Scan the table',
    text: 'Open the Pink Flamingo menu from the QR code at your seat.',
  },
  {
    icon: Sparkles,
    label: 'Pick your favorites',
    text: 'Tacos, bowls, seafood, smoothies, coffee, and whatever sounds good.',
  },
  {
    icon: Waves,
    label: 'Stay in the sunshine',
    text: 'Send the order from your phone and keep the beach day moving.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#173f45]">
      <section
        className="relative min-h-[88svh] overflow-hidden bg-[#174f59] text-white"
        style={{
          backgroundImage: 'url(/assets/pink-flamingo-surf-hero.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-[#0b3035]/55" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-between px-5 py-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f06a5f] text-white shadow-lg shadow-black/20 transition group-hover:rotate-6">
                <Waves size={22} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block text-lg font-black uppercase tracking-[0.12em] text-white">
                  Pink Flamingo
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffd6a5]">
                  Tamarindo, Costa Rica
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/staff-login"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-[#0b3035]/35 px-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
              >
                <LockKeyhole size={16} />
                <span className="hidden sm:inline">Staff Login</span>
                <span className="sm:hidden">Staff</span>
              </Link>
              <Link
                href="/menu/pink-flamingo/table/1"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#fff8eb] px-4 text-sm font-black text-[#173f45] transition hover:bg-[#ffd6a5]"
              >
                <QrCode size={17} />
                Table 1
              </Link>
            </div>
          </nav>

          <div className="grid gap-10 pb-8 pt-16 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-white/85">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0b3035]/35 px-3 py-2 backdrop-blur">
                  <MapPin size={16} />
                  Right by the beach
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0b3035]/35 px-3 py-2 backdrop-blur">
                  <Sun size={16} />
                  Breakfast to sunset
                </span>
              </div>

              <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">
                Scan, order, chill.
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.94] sm:text-7xl">
                Pink Flamingo
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
                Tacos, bowls, fresh seafood, smoothies, and good coffee from your table in
                Tamarindo.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/menu/pink-flamingo/table/1"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#f06a5f] px-6 text-base font-black text-white shadow-2xl shadow-[#0b3035]/35 transition hover:bg-[#f58270]"
                >
                  <QrCode size={20} />
                  Open Table 1
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="#tables"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-base font-black text-white backdrop-blur transition hover:bg-white/18"
                >
                  Choose a table
                </Link>
              </div>
            </div>

            <div className="border border-white/20 bg-[#0b3035]/55 p-5 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffd6a5]">
                    Your table, your pace
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">Easy ordering by the sea</p>
                </div>
                <Waves className="shrink-0 text-[#f06a5f]" size={34} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="border border-white/15 bg-white/10 p-3">
                  <p className="text-white/60">Tables ready</p>
                  <p className="mt-1 text-2xl font-black">1-10</p>
                </div>
                <div className="border border-white/15 bg-white/10 p-3">
                  <p className="text-white/60">Menu mood</p>
                  <p className="mt-1 text-2xl font-black">Pura vida</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/75">
                Pull up a chair, choose a table below, and see the guest flow Pink Flamingo can
                use every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8d7bd] bg-[#fff8eb] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#e35c52]">
                How it feels
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#173f45]">A little more beach day, a little less waiting.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#557176]">
              A simple guest experience that keeps the menu close and the table conversation going.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {guestSteps.map((step) => {
              const Icon = step.icon

              return (
                <div key={step.label} className="border border-[#e8d7bd] bg-[#f8f0df] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d9eee7] text-[#177079]">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-[#173f45]">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#557176]">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="tables" className="bg-[#f8f0df] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#e35c52]">
                Try the guest flow
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#173f45]">Choose your table</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#557176]">
              Each table opens the same ordering experience a printed QR code would launch.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {demoTables.map((table) => (
              <Link
                key={table}
                href={`/menu/pink-flamingo/table/${table}`}
                className="group flex min-h-24 flex-col justify-between border border-[#e8d7bd] bg-[#fff8eb] p-4 transition hover:border-[#e35c52] hover:bg-[#ffe5c6]"
              >
                <span className="text-sm font-bold text-[#557176]">Table</span>
                <span className="flex items-end justify-between gap-3">
                  <span className="text-4xl font-black text-[#173f45]">{table}</span>
                  <ArrowRight className="text-[#e35c52] transition group-hover:translate-x-1" size={22} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#173f45] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffd6a5]">
              Pink Flamingo, Tamarindo
            </p>
            <p className="mt-2 text-sm text-white/65">Powered by Mindful Tech</p>
          </div>
          <Link
            href="/staff-login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff8eb] px-5 font-black text-[#173f45] transition hover:bg-[#ffd6a5]"
          >
            <ChefHat size={19} />
            Staff tools
          </Link>
        </div>
      </footer>
    </main>
  )
}
