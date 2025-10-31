import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">
          🏊 Inspired Swim Marketing Hub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Business intelligence and marketing optimization platform
        </p>
        <Link
          href="/operations"
          className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
        >
          View Operations Dashboard →
        </Link>
      </div>
    </div>
  )
}
