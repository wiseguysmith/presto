import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pink Flamingo Table Ordering | Mindful Tech',
  description: 'Tamarindo table ordering for Pink Flamingo, powered by Mindful Tech.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
