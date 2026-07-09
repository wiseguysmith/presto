import Link from 'next/link'
import {
  ArrowRight,
  ChefHat,
  Clock3,
  ConciergeBell,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react'

const demoTables = Array.from({ length: 10 }, (_, index) => index + 1)

const demoChecks = [
  {
    icon: Smartphone,
    label: 'Guest phone flow',
    text: 'Open a table, browse categories, add notes, and submit an order.',
  },
  {
    icon: ConciergeBell,
    label: 'Pay-at-table mode',
    text: 'Built for a controlled demo before payments or POS integration.',
  },
  {
    icon: ShieldCheck,
    label: 'Demo environment',
    text: 'Use this for walkthroughs until staff tools and production safety are complete.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-stone-950">
      <section
        className="relative min-h-[86svh] overflow-hidden bg-stone-950 text-white"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(15, 12, 10, 0.88) 0%, rgba(15, 12, 10, 0.72) 43%, rgba(15, 12, 10, 0.22) 100%), url(/assets/presto-hero.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="mx-auto flex min-h-[86svh] max-w-6xl flex-col justify-between px-5 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="text-lg font-black uppercase tracking-[0.18em] text-white">
              PRESTO
            </Link>
            <Link
              href="/menu/pink-flamingo/table/1"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-black text-stone-950 transition hover:bg-pink-100"
            >
              <QrCode size={18} />
              Table 1
            </Link>
          </nav>

          <div className="grid gap-10 pb-10 pt-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-3 text-sm font-bold text-white/82">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-2 backdrop-blur">
                  <MapPin size={16} />
                  Tamarindo
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-2 backdrop-blur">
                  <UtensilsCrossed size={16} />
                  Dine-in QR ordering
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-2 backdrop-blur">
                  Controlled demo
                </span>
              </div>

              <p className="mb-3 text-sm font-black uppercase text-pink-200">Pink Flamingo x PRESTO</p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Pink Flamingo table ordering
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Guests scan from the table, choose dishes, add notes, and send the order to the
                restaurant. This demo is built for the first Pink Flamingo walkthrough.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/menu/pink-flamingo/table/1"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-pink-500 px-6 text-base font-black text-white shadow-2xl shadow-pink-950/35 transition hover:bg-pink-400"
                >
                  <QrCode size={20} />
                  Open Table 1 Demo
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="#tables"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-base font-black text-white backdrop-blur transition hover:bg-white/18"
                >
                  Choose Another Table
                </Link>
              </div>
            </div>

            <div className="border border-white/20 bg-black/35 p-5 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs font-black uppercase text-pink-200">Demo QR target</p>
                  <p className="mt-2 break-all font-mono text-sm text-white/85">
                    pinkflamingointama.mindfultech.services
                  </p>
                </div>
                <QrCode className="shrink-0 text-pink-200" size={34} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="border border-white/15 bg-white/10 p-3">
                  <p className="text-white/60">Tables</p>
                  <p className="mt-1 text-2xl font-black">1-10</p>
                </div>
                <div className="border border-white/15 bg-white/10 p-3">
                  <p className="text-white/60">Menu items</p>
                  <p className="mt-1 text-2xl font-black">12</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 text-sm text-white/78">
                <Clock3 size={18} className="text-pink-200" />
                <span>Use for owner review before live table QR traffic.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tables" className="border-b border-stone-200 bg-white px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase text-pink-600">Start the table flow</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">Choose a Pink Flamingo table</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Each button opens the same guest experience a printed QR code would launch.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {demoTables.map((table) => (
              <Link
                key={table}
                href={`/menu/pink-flamingo/table/${table}`}
                className="group flex min-h-24 flex-col justify-between border border-stone-200 bg-[#fbf7f1] p-4 transition hover:border-pink-300 hover:bg-pink-50"
              >
                <span className="text-sm font-bold text-stone-500">Table</span>
                <span className="flex items-end justify-between gap-3">
                  <span className="text-4xl font-black text-stone-950">{table}</span>
                  <ArrowRight className="text-pink-600 transition group-hover:translate-x-1" size={22} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7f1] px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {demoChecks.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="border border-stone-200 bg-white p-5">
                <Icon className="text-pink-600" size={24} />
                <h3 className="mt-4 text-lg font-black text-stone-950">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-pink-200">Next build target</p>
            <h2 className="mt-2 text-2xl font-black">Staff order board before real table launch.</h2>
          </div>
          <Link
            href="/menu/pink-flamingo/table/1"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-black text-stone-950 transition hover:bg-pink-100"
          >
            <ChefHat size={19} />
            Reopen Table 1
          </Link>
        </div>
      </section>
    </main>
  )
}
