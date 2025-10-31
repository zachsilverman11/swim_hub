import type { Metadata } from 'next'
import { Alegreya_Sans } from 'next/font/google'
import './globals.css'

const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-alegreya-sans',
  display: 'swap',
})

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
      <body className={alegreyaSans.className}>{children}</body>
    </html>
  )
}
