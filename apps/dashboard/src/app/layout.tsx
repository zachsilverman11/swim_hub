import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inspired Swim - Operations Dashboard',
  description: 'Business intelligence and operations dashboard for Inspired Swim',
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
