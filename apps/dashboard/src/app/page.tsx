import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-splash/30 to-aquamarine/20">
      <div className="text-center max-w-2xl px-6">
        {/* Inspired Swim Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/InspiredSwim-logomark_full-colour.svg"
            alt="Inspired Swim"
            width={300}
            height={80}
            priority
          />
        </div>

        <h1 className="text-5xl font-bold text-depths mb-4">
          Marketing Hub
        </h1>
        <p className="text-xl text-gray-700 mb-10">
          Business intelligence and marketing optimization platform
        </p>
        <Link
          href="/operations"
          className="inline-block bg-depths text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-aquamarine hover:text-depths transition-colors shadow-lg hover:shadow-xl"
        >
          View Operations Dashboard →
        </Link>
      </div>
    </div>
  )
}
