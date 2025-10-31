/**
 * Example usage of the Business Intelligence package
 *
 * This demonstrates how to use the package to retrieve and analyze
 * business data from Firebase.
 */

import businessIntelligence, { getCurrentMonth, getLastNDays } from '../src';

/**
 * Example 1: Get all locations and their basic info
 */
async function example1_GetLocations() {
  console.log('\n=== Example 1: Get All Locations ===\n');

  const locations = await businessIntelligence.getLocations();

  locations.forEach(location => {
    console.log(`📍 ${location.name}`);
    console.log(`   ${location.address}, ${location.city}, ${location.province}`);
    console.log(`   Capacity: ${location.capacity.maxConcurrentLessons} concurrent lessons`);
    console.log(`   Status: ${location.active ? 'Active' : 'Inactive'}`);
    console.log('');
  });
}

/**
 * Example 2: Get location insights with utilization
 */
async function example2_LocationInsights() {
  console.log('\n=== Example 2: Location Insights ===\n');

  const locations = await businessIntelligence.getLocations();

  // Get insights for each location
  for (const location of locations) {
    const insights = await businessIntelligence.getLocationInsights(location.id);

    if (insights) {
      console.log(`📊 ${insights.location.name}`);
      console.log(`   Utilization: ${(insights.utilization.utilizationRate * 100).toFixed(1)}%`);
      console.log(`   Booked Hours: ${insights.utilization.bookedHours.toFixed(1)} / ${insights.utilization.availableHours.toFixed(1)}`);
      console.log(`   Revenue: $${insights.revenue.actual.toFixed(2)}`);
      if (insights.revenue.target) {
        console.log(`   Target: $${insights.revenue.target.toFixed(2)}`);
        console.log(`   Variance: $${insights.revenue.variance?.toFixed(2)}`);
      }
      console.log(`   Performance: ${insights.performance.toUpperCase()}`);
      console.log(`   Bookings: ${insights.bookings.total} (${insights.bookings.completed} completed, ${insights.bookings.cancelled} cancelled)`);
      console.log('');
    }
  }
}

/**
 * Example 3: Business snapshot overview
 */
async function example3_BusinessSnapshot() {
  console.log('\n=== Example 3: Business Snapshot ===\n');

  const snapshot = await businessIntelligence.getBusinessSnapshot();

  console.log(`📅 Snapshot Date: ${snapshot.timestamp.toLocaleDateString()}`);
  console.log(`💰 Total Revenue: $${snapshot.totalRevenue.toFixed(2)}`);
  console.log(`📚 Total Bookings: ${snapshot.totalBookings}`);
  console.log(`📈 Overall Utilization: ${(snapshot.overallUtilization * 100).toFixed(1)}%`);
  console.log(`\n🏆 Top Services:`);

  snapshot.topServices.forEach((service, index) => {
    console.log(`   ${index + 1}. ${service.service.name}`);
    console.log(`      ${service.bookingCount} bookings, $${service.revenue.toFixed(2)} revenue`);
  });

  if (snapshot.underperformingLocations.length > 0) {
    console.log(`\n⚠️  Underperforming Locations (< 40% utilization):`);
    snapshot.underperformingLocations.forEach(loc => {
      console.log(`   • ${loc.location.name}: ${(loc.utilization.utilizationRate * 100).toFixed(1)}%`);
    });
  } else {
    console.log(`\n✅ All locations performing above 40% utilization!`);
  }
}

/**
 * Example 4: Service insights and popularity
 */
async function example4_ServiceInsights() {
  console.log('\n=== Example 4: Service Insights ===\n');

  const serviceInsights = await businessIntelligence.getServiceInsights();

  console.log('🏊 Service Performance:');
  serviceInsights.forEach(service => {
    console.log(`\n   ${service.service.name}`);
    console.log(`   Type: ${service.service.serviceType}`);
    console.log(`   Duration: ${service.service.duration} minutes`);
    console.log(`   Bookings: ${service.bookingCount}`);
    console.log(`   Revenue: $${service.revenue.toFixed(2)}`);
    console.log(`   Avg Price: $${service.averagePrice.toFixed(2)}`);

    const popularLocations = Object.entries(service.popularityByLocation)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (popularLocations.length > 0) {
      console.log(`   Top Locations: ${popularLocations.map(([id, count]) => `${count} bookings`).join(', ')}`);
    }
  });
}

/**
 * Example 5: Instructor performance
 */
async function example5_InstructorInsights() {
  console.log('\n=== Example 5: Instructor Insights ===\n');

  const instructorInsights = await businessIntelligence.getInstructorInsights();

  console.log('👨‍🏫 Instructor Performance:');
  instructorInsights.forEach(instructor => {
    console.log(`\n   ${instructor.instructor.name}`);
    console.log(`   Email: ${instructor.instructor.email}`);
    console.log(`   Lessons: ${instructor.totalLessons}`);
    console.log(`   Hours: ${instructor.hoursWorked.toFixed(1)}`);
    console.log(`   Revenue: $${instructor.revenue.toFixed(2)}`);
    console.log(`   Locations: ${instructor.instructor.locationIds.length}`);
  });
}

/**
 * Example 6: Custom date ranges
 */
async function example6_CustomDateRanges() {
  console.log('\n=== Example 6: Custom Date Ranges ===\n');

  // Last 7 days
  const last7Days = getLastNDays(7);
  const weekSnapshot = await businessIntelligence.getBusinessSnapshot(last7Days);

  console.log('📊 Last 7 Days:');
  console.log(`   Revenue: $${weekSnapshot.totalRevenue.toFixed(2)}`);
  console.log(`   Bookings: ${weekSnapshot.totalBookings}`);
  console.log(`   Utilization: ${(weekSnapshot.overallUtilization * 100).toFixed(1)}%`);

  // Current month
  const thisMonth = getCurrentMonth();
  const monthSnapshot = await businessIntelligence.getBusinessSnapshot(thisMonth);

  console.log('\n📊 Current Month:');
  console.log(`   Revenue: $${monthSnapshot.totalRevenue.toFixed(2)}`);
  console.log(`   Bookings: ${monthSnapshot.totalBookings}`);
  console.log(`   Utilization: ${(monthSnapshot.overallUtilization * 100).toFixed(1)}%`);
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await example1_GetLocations();
    await example2_LocationInsights();
    await example3_BusinessSnapshot();
    await example4_ServiceInsights();
    await example5_InstructorInsights();
    await example6_CustomDateRanges();

    console.log('\n✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

export {
  example1_GetLocations,
  example2_LocationInsights,
  example3_BusinessSnapshot,
  example4_ServiceInsights,
  example5_InstructorInsights,
  example6_CustomDateRanges,
  runAllExamples,
};
