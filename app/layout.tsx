import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pink Flamingo Table Ordering | PRESTO',
  description: 'Controlled QR ordering demo for Pink Flamingo in Tamarindo.',
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
