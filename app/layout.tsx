import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PRESTO - QR Ordering',
  description: 'Restaurant QR code ordering system',
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
