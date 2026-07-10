import Link from 'next/link'

export default function PrototypeReference() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold uppercase text-pink-300">
          Back to PRESTO
        </Link>
        <h1 className="mt-8 text-5xl font-black">Original Prototype Reference</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
          The first static HTML/CSS/JavaScript concept is preserved in the repository under
          <span className="font-mono text-pink-200"> prototype/</span>. The active local demo is now
          the Next.js QR ordering flow.
        </p>
        <Link
          href="/menu/pink-flamingo/table/1"
          className="mt-8 inline-flex rounded-lg bg-pink-500 px-6 py-4 font-bold text-white transition hover:bg-pink-600"
        >
          Launch demo table
        </Link>
      </div>
    </main>
  )
}
