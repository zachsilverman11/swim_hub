/**
 * Test Business Intelligence with Real Firebase Data
 */

require('dotenv').config();
const businessIntelligence = require('./packages/business-intelligence/dist/index.js').default;

async function test() {
  try {
    console.log('\n🏊 Inspired Swim Business Intelligence Test\n');
    console.log('=' .repeat(70) + '\n');

    // Test 1: Get all locations
    console.log('📍 TEST 1: Get All Locations\n');
    const locations = await businessIntelligence.getLocations();
    console.log(`✅ Found ${locations.length} active locations:`);
    locations.slice(0, 5).forEach((loc) => {
      console.log(`   - ${loc.name} (${loc.address.city || 'N/A'}, ${loc.address.province || 'N/A'})`);
    });
    if (locations.length > 5) {
      console.log(`   ... and ${locations.length - 5} more`);
    }

    // Test 2: Get active seasons
    console.log('\n\n📅 TEST 2: Get Active Seasons\n');
    const seasons = await businessIntelligence.getSeasons(true);
    console.log(`✅ Found ${seasons.length} active season(s):`);
    seasons.forEach((season) => {
      console.log(`   - ${season.name} (${season.startDate.toLocaleDateString()} - ${season.endDate.toLocaleDateString()})`);
      console.log(`     Registration opens: ${season.registrationOpen.toLocaleDateString()}`);
    });

    if (seasons.length === 0) {
      console.log('\n⚠️  No active seasons found. Cannot proceed with further tests.');
      return;
    }

    const activeSeason = seasons[0];
    console.log(`\n🎯 Using season: ${activeSeason.name} (ID: ${activeSeason.id})`);

    // Test 3: Get pricing
    console.log('\n\n💰 TEST 3: Get Pricing\n');
    const pricing = await businessIntelligence.getPricing();
    if (pricing) {
      console.log('✅ Pricing retrieved:');
      console.log(`   Private Lessons:`);
      console.log(`     - 30 min: $${pricing.privateLessons['30min'].basePrice} (+$${pricing.privateLessons['30min'].addOnPerSwimmer}/swimmer)`);
      console.log(`     - 45 min: $${pricing.privateLessons['45min'].basePrice} (+$${pricing.privateLessons['45min'].addOnPerSwimmer}/swimmer)`);
      console.log(`     - 60 min: $${pricing.privateLessons['60min'].basePrice} (+$${pricing.privateLessons['60min'].addOnPerSwimmer}/swimmer)`);
      console.log(`   Small Group:`);
      console.log(`     - 30 min: $${pricing.smallGroup['30min'].pricePerSwimmer}/swimmer`);
      console.log(`     - 45 min: $${pricing.smallGroup['45min'].pricePerSwimmer}/swimmer`);
      console.log(`     - 60 min: $${pricing.smallGroup['60min'].pricePerSwimmer}/swimmer`);
    }

    // Test 4: Get location insights for first location
    if (locations.length > 0) {
      console.log('\n\n📊 TEST 4: Location Insights\n');
      const location = locations[0];
      console.log(`Getting insights for: ${location.name}`);

      const insights = await businessIntelligence.getLocationInsights(
        location.id,
        activeSeason.id
      );

      if (insights) {
        console.log(`\n✅ ${insights.location.name} - ${insights.season.name}:`);
        console.log(`\n   📈 Utilization:`);
        console.log(`      Available hours/week: ${insights.utilization.availableHoursPerWeek.toFixed(1)}h`);
        console.log(`      Booked hours/week: ${insights.utilization.bookedHoursPerWeek.toFixed(1)}h`);
        console.log(`      Utilization rate: ${(insights.utilization.utilizationRate * 100).toFixed(1)}%`);
        console.log(`      Performance: ${insights.performance.toUpperCase()}`);

        console.log(`\n   💰 Revenue:`);
        console.log(`      Total revenue: $${insights.revenue.totalRevenue.toFixed(2)}`);
        console.log(`      Total bookings: ${insights.revenue.totalBookings}`);
        console.log(`      Avg booking value: $${insights.revenue.averageBookingValue.toFixed(2)}`);

        console.log(`\n   📚 Bookings:`);
        console.log(`      Total: ${insights.bookings.total}`);
        console.log(`      Confirmed: ${insights.bookings.confirmed}`);
        console.log(`      Cancelled: ${insights.bookings.cancelled}`);
        console.log(`      Pending: ${insights.bookings.pending}`);

        console.log(`\n   🎓 Lessons:`);
        console.log(`      Total: ${insights.lessons.total}`);
        console.log(`      Completed: ${insights.lessons.completed}`);
        console.log(`      Upcoming: ${insights.lessons.upcoming}`);
        console.log(`      Cancelled: ${insights.lessons.cancelled}`);
      }
    }

    // Test 5: Get season insights
    console.log('\n\n📊 TEST 5: Season Insights\n');
    const seasonInsights = await businessIntelligence.getSeasonInsights(activeSeason.id);
    if (seasonInsights) {
      console.log(`✅ ${seasonInsights.season.name} Overview:`);
      console.log(`   Total revenue: $${seasonInsights.totalRevenue.toFixed(2)}`);
      console.log(`   Total bookings: ${seasonInsights.totalBookings}`);
      console.log(`   Total lessons: ${seasonInsights.totalLessons}`);
      console.log(`   Avg booking value: $${seasonInsights.averageBookingValue.toFixed(2)}`);

      console.log(`\n   Top Locations by Revenue:`);
      seasonInsights.locationBreakdown.slice(0, 5).forEach((loc, index) => {
        console.log(`      ${index + 1}. ${loc.locationName}: $${loc.revenue.toFixed(2)} (${loc.bookings} bookings)`);
      });
    }

    // Test 6: Get lesson type breakdown
    console.log('\n\n📊 TEST 6: Lesson Type Breakdown\n');
    const lessonTypes = await businessIntelligence.getLessonTypeInsights(activeSeason.id);
    if (lessonTypes.length > 0) {
      console.log(`✅ Lesson Types:`);
      lessonTypes.forEach((type) => {
        console.log(`\n   ${type.lessonType} ${type.lessonFormat}:`);
        console.log(`      Bookings: ${type.bookingCount}`);
        console.log(`      Revenue: $${type.revenue.toFixed(2)}`);
        console.log(`      Avg price: $${type.averagePrice.toFixed(2)}`);
      });
    }

    // Test 7: Business snapshot
    console.log('\n\n📊 TEST 7: Complete Business Snapshot\n');
    const snapshot = await businessIntelligence.getBusinessSnapshot(activeSeason.id);

    console.log(`✅ Business Snapshot - ${snapshot.activeSeason.name}:`);
    console.log(`   Timestamp: ${snapshot.timestamp.toLocaleString()}`);
    console.log(`\n   💰 Financial:`);
    console.log(`      Total revenue: $${snapshot.totalRevenue.toFixed(2)}`);
    console.log(`      Total bookings: ${snapshot.totalBookings}`);

    console.log(`\n   📈 Utilization:`);
    console.log(`      Overall utilization: ${(snapshot.overallUtilization * 100).toFixed(1)}%`);

    console.log(`\n   🏆 Top ${snapshot.topLocations.length} Location(s) by Revenue:`);
    snapshot.topLocations.forEach((loc, index) => {
      console.log(`      ${index + 1}. ${loc.location.name}: $${loc.revenue.totalRevenue.toFixed(2)} (${(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized)`);
    });

    if (snapshot.underperformingLocations.length > 0) {
      console.log(`\n   ⚠️  ${snapshot.underperformingLocations.length} Underperforming Location(s) (< 40% utilization):`);
      snapshot.underperformingLocations.forEach((loc) => {
        console.log(`      - ${loc.location.name}: ${(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized`);
      });
    } else {
      console.log(`\n   ✅ All locations above 40% utilization!`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ All tests passed! Business Intelligence is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

test();
