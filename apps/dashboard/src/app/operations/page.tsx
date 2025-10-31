import businessIntelligence from '@inspired-swim/business-intelligence'
import type { LocationInsights, BusinessSnapshot } from '@inspired-swim/business-intelligence'
import Link from 'next/link'

// Revalidate every 5 minutes
export const revalidate = 300

export default async function OperationsDashboard() {
  // Fetch business snapshot (uses first active season by default)
  const snapshot = await businessIntelligence.getBusinessSnapshot()

  // Sort locations by utilization (lowest first - needs attention)
  const sortedLocations = [...snapshot.locations].sort(
    (a, b) => a.utilization.utilizationRate - b.utilization.utilizationRate
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-[#004657]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#004657]">Operations Dashboard</h1>
              <p className="text-gray-600 mt-2 text-sm">
                {snapshot.activeSeason.name} | Last updated {new Date(snapshot.timestamp).toLocaleString()}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-[#004657] hover:bg-[#004657] hover:text-white border-2 border-[#004657] rounded-lg transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#004657] mb-6 pb-2 border-b-2 border-[#0080A0]">Business Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Locations"
              value={snapshot.locations.length.toString()}
              subtitle={`${snapshot.locations.filter(l => l.utilization.utilizationRate > 0).length} active`}
              icon="📍"
            />
            <MetricCard
              title="Overall Utilization"
              value={`${(snapshot.overallUtilization * 100).toFixed(1)}%`}
              subtitle={getUtilizationLabel(snapshot.overallUtilization)}
              icon="📈"
              colorClass={getUtilizationColor(snapshot.overallUtilization)}
            />
            <MetricCard
              title="Total Revenue"
              value={`$${snapshot.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle={`${snapshot.totalBookings} bookings`}
              icon="💰"
            />
            <MetricCard
              title="Avg Booking Value"
              value={`$${(snapshot.totalRevenue / snapshot.totalBookings).toFixed(2)}`}
              subtitle="Per booking"
              icon="💵"
            />
          </div>
        </section>

        {/* Performance Alerts */}
        {(snapshot.underperformingLocations.length > 0 || snapshot.topLocations.some(l => l.utilization.utilizationRate > 0.9)) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#004657] mb-6 pb-2 border-b-2 border-[#0080A0]">Performance Alerts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Underperforming Locations */}
              {snapshot.underperformingLocations.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 shadow-md">
                  <div className="flex items-start">
                    <span className="text-4xl mr-3">⚠️</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-900 mb-2">
                        Needs Attention ({snapshot.underperformingLocations.length})
                      </h3>
                      <p className="text-sm text-red-700 mb-3">
                        Locations with less than 40% utilization
                      </p>
                      <ul className="space-y-2">
                        {snapshot.underperformingLocations.slice(0, 5).map((loc) => (
                          <li key={loc.location.id} className="text-sm">
                            <span className="font-medium text-red-900">{loc.location.name}</span>
                            <span className="text-red-700"> - {(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized</span>
                          </li>
                        ))}
                      </ul>
                      {snapshot.underperformingLocations.length > 5 && (
                        <p className="text-sm text-red-700 mt-2">
                          ... and {snapshot.underperformingLocations.length - 5} more
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <p className="text-sm font-medium text-red-900 mb-1">Suggested Actions:</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Increase local marketing efforts</li>
                          <li>• Review pricing and availability</li>
                          <li>• Consider promotional offers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* High Capacity Locations */}
              {snapshot.topLocations.some(l => l.utilization.utilizationRate > 0.9) && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 shadow-md">
                  <div className="flex items-start">
                    <span className="text-4xl mr-3">🎉</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-2">
                        High Performers
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        Locations with over 90% utilization
                      </p>
                      <ul className="space-y-2">
                        {snapshot.topLocations
                          .filter(l => l.utilization.utilizationRate > 0.9)
                          .map((loc) => (
                            <li key={loc.location.id} className="text-sm">
                              <span className="font-medium text-green-900">{loc.location.name}</span>
                              <span className="text-green-700"> - {(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized</span>
                            </li>
                          ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-sm font-medium text-green-900 mb-1">Suggested Actions:</p>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Consider adding more time slots</li>
                          <li>• Recruit additional coaches</li>
                          <li>• Implement waitlist system</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Revenue Tracking */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#004657] mb-6 pb-2 border-b-2 border-[#0080A0]">Revenue Tracking</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top 5 Locations by Revenue */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-[#004657] mb-4">Top Locations by Revenue</h3>
                <div className="space-y-4">
                  {snapshot.topLocations.map((loc, index) => (
                    <div key={loc.location.id} className="flex items-center">
                      <span className="text-2xl mr-3">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{loc.location.name}</span>
                          <span className="font-bold text-gray-900">
                            ${loc.revenue.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getUtilizationBgColor(loc.utilization.utilizationRate)}`}
                            style={{
                              width: `${Math.min(loc.utilization.utilizationRate * 100, 100)}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>{loc.revenue.totalBookings} bookings</span>
                          <span>{(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lesson Type Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-[#004657] mb-4">Lesson Types</h3>
                <div className="space-y-3">
                  {snapshot.lessonTypeBreakdown.slice(0, 5).map((type) => (
                    <div key={`${type.lessonType}-${type.lessonFormat}`} className="border-l-4 border-[#0080A0] pl-3 hover:bg-gray-50 py-2 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-medium text-gray-900">
                          {type.lessonType} {type.lessonFormat}
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          ${type.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {type.bookingCount} bookings • ${type.averagePrice.toFixed(2)} avg
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Table */}
        <section>
          <h2 className="text-2xl font-bold text-[#004657] mb-6 pb-2 border-b-2 border-[#0080A0]">All Locations</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#004657] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Utilization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLocations.map((loc) => (
                    <tr key={loc.location.id} className="hover:bg-[#f0f9ff] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{loc.location.name}</div>
                        <div className="text-xs text-gray-500">
                          {loc.location.address.city}, {loc.location.address.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {loc.utilization.availableHoursPerWeek.toFixed(1)}h/week
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getUtilizationBgColor(loc.utilization.utilizationRate)}`}
                                style={{
                                  width: `${Math.min(loc.utilization.utilizationRate * 100, 100)}%`
                                }}
                              />
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${getUtilizationTextColor(loc.utilization.utilizationRate)}`}>
                            {(loc.utilization.utilizationRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{loc.bookings.confirmed}</div>
                        <div className="text-xs text-gray-500">{loc.bookings.total} total</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${loc.revenue.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${loc.revenue.averageBookingValue.toFixed(0)} avg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPerformanceBadge(loc.performance)}`}>
                          {loc.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-10 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#0080A0] text-center">
          <p className="text-sm text-gray-600">Data updates automatically every 5 minutes</p>
          <p className="text-sm text-[#004657] font-semibold mt-1">Season: {snapshot.activeSeason.name}</p>
        </div>
      </main>
    </div>
  )
}

// Helper Components
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  colorClass = 'text-gray-900'
}: {
  title: string
  value: string
  subtitle: string
  icon: string
  colorClass?: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-[#0080A0] p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
    </div>
  )
}

// Helper Functions
function getUtilizationColor(rate: number): string {
  if (rate >= 0.7) return 'text-green-600'
  if (rate >= 0.4) return 'text-yellow-600'
  return 'text-red-600'
}

function getUtilizationBgColor(rate: number): string {
  if (rate >= 0.7) return 'bg-green-500'
  if (rate >= 0.4) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getUtilizationTextColor(rate: number): string {
  if (rate >= 0.7) return 'text-green-700'
  if (rate >= 0.4) return 'text-yellow-700'
  return 'text-red-700'
}

function getUtilizationLabel(rate: number): string {
  if (rate >= 0.8) return 'Excellent'
  if (rate >= 0.6) return 'Good'
  if (rate >= 0.4) return 'Fair'
  return 'Needs Attention'
}

function getPerformanceBadge(performance: string): string {
  switch (performance) {
    case 'excellent':
      return 'bg-green-100 text-green-800'
    case 'good':
      return 'bg-blue-100 text-blue-800'
    case 'fair':
      return 'bg-yellow-100 text-yellow-800'
    case 'poor':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
