# @inspired-swim/business-intelligence

Business Intelligence package for Inspired Swim Marketing Hub. Provides read-only access to Firebase operational data with analytics and insights.

## Overview

This package connects to your Firebase database and provides:
- Location data with utilization metrics
- Service and pricing information
- Instructor performance data
- Revenue tracking and targets
- Business snapshots and insights

**Important**: All business data comes from Firebase. Nothing is hardcoded.

## Installation

```bash
npm install @inspired-swim/business-intelligence
```

## Configuration

### Environment Variables

Set up Firebase credentials using one of these methods:

**Option 1: Service Account File Path**
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
```

**Option 2: Individual Environment Variables**
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Option 3: Default Credentials** (for Google Cloud environments)
No configuration needed - will use Application Default Credentials.

### Firebase Database Structure

The package expects the following collections in Firestore:

- `locations` - Swim location data
- `services` - Service types and pricing
- `instructors` - Instructor information
- `bookings` - Lesson bookings
- `revenueTargets` - Revenue targets by location

## Usage

### Basic Usage

```typescript
import businessIntelligence from '@inspired-swim/business-intelligence';

// Get all locations
const locations = await businessIntelligence.getLocations();

// Get location insights (utilization, revenue, performance)
const insights = await businessIntelligence.getLocationInsights('location-id');

console.log(`Utilization: ${insights.utilization.utilizationRate * 100}%`);
console.log(`Revenue: $${insights.revenue.actual}`);
console.log(`Performance: ${insights.performance}`);
```

### Get Business Snapshot

```typescript
import businessIntelligence, { getCurrentMonth } from '@inspired-swim/business-intelligence';

// Get complete business overview for current month
const snapshot = await businessIntelligence.getBusinessSnapshot();

console.log(`Total Revenue: $${snapshot.totalRevenue}`);
console.log(`Overall Utilization: ${snapshot.overallUtilization * 100}%`);
console.log(`Underperforming Locations: ${snapshot.underperformingLocations.length}`);

// Get snapshot for specific date range
const customRange = {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31')
};
const januarySnapshot = await businessIntelligence.getBusinessSnapshot(customRange);
```

### Location Insights

```typescript
// Get all location insights
const allInsights = await businessIntelligence.getAllLocationInsights();

// Find underperforming locations
const underperforming = allInsights.filter(
  loc => loc.utilization.utilizationRate < 0.4
);

underperforming.forEach(loc => {
  console.log(`${loc.location.name}: ${(loc.utilization.utilizationRate * 100).toFixed(1)}% utilized`);
});
```

### Service Insights

```typescript
// Get service popularity and revenue
const serviceInsights = await businessIntelligence.getServiceInsights();

// Top 5 services by booking count
const topServices = serviceInsights.slice(0, 5);

topServices.forEach(service => {
  console.log(`${service.service.name}: ${service.bookingCount} bookings, $${service.revenue} revenue`);
});
```

### Instructor Insights

```typescript
// Get instructor performance
const instructorInsights = await businessIntelligence.getInstructorInsights();

instructorInsights.forEach(instructor => {
  console.log(`${instructor.instructor.name}: ${instructor.totalLessons} lessons, ${instructor.hoursWorked} hours`);
});
```

### Custom Date Ranges

```typescript
import { getLastNDays, getCurrentWeek, getCurrentQuarter } from '@inspired-swim/business-intelligence';

// Last 30 days
const last30Days = getLastNDays(30);
const recentInsights = await businessIntelligence.getLocationInsights('location-id', last30Days);

// Current week
const thisWeek = getCurrentWeek();
const weeklySnapshot = await businessIntelligence.getBusinessSnapshot(thisWeek);

// Current quarter
const thisQuarter = getCurrentQuarter();
const quarterlySnapshot = await businessIntelligence.getBusinessSnapshot(thisQuarter);
```

## API Reference

### BusinessIntelligenceService

#### Data Retrieval Methods

- `getLocations(includeInactive?: boolean): Promise<Location[]>`
- `getLocation(locationId: string): Promise<Location | null>`
- `getServices(includeInactive?: boolean): Promise<Service[]>`
- `getInstructors(includeInactive?: boolean): Promise<Instructor[]>`
- `getBookings(query?: BusinessIntelligenceQuery): Promise<Booking[]>`
- `getRevenueTargets(locationIds?: string[]): Promise<RevenueTarget[]>`

#### Insights Methods

- `getLocationInsights(locationId: string, dateRange?: DateRange): Promise<LocationInsights | null>`
- `getAllLocationInsights(query?: BusinessIntelligenceQuery): Promise<LocationInsights[]>`
- `getServiceInsights(dateRange?: DateRange): Promise<ServiceInsights[]>`
- `getInstructorInsights(dateRange?: DateRange): Promise<InstructorInsights[]>`
- `getBusinessSnapshot(dateRange?: DateRange): Promise<BusinessSnapshot>`

### Date Utilities

- `getCurrentWeek(): DateRange`
- `getCurrentMonth(): DateRange`
- `getCurrentQuarter(): DateRange`
- `getCurrentYear(): DateRange`
- `getLastNDays(days: number): DateRange`
- `calculateAvailableHours(operatingHours, dateRange): number`

## Types

All TypeScript types are exported and available for use:

```typescript
import type {
  Location,
  Service,
  Instructor,
  Booking,
  LocationInsights,
  ServiceInsights,
  BusinessSnapshot,
  DateRange
} from '@inspired-swim/business-intelligence';
```

## Performance Levels

Location performance is automatically categorized:
- **excellent**: ≥80% utilization
- **good**: 60-79% utilization
- **fair**: 40-59% utilization
- **poor**: <40% utilization

## Security

This package is **read-only**. It cannot modify data in Firebase. All Firebase operations use the Admin SDK with read-only queries.

## Development

```bash
# Build the package
npm run build

# Development mode (watch)
npm run dev

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```
