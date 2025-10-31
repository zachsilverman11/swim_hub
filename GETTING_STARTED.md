# Getting Started Checklist

Use this checklist to set up and test your Inspired Swim Marketing Hub.

## ✅ Phase 1 Setup Checklist

### 1. Prerequisites
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Access to Inspired Swim Firebase project
- [ ] Firebase Console access (admin permissions)

### 2. Project Setup
- [ ] Dependencies installed (`npm install`)
- [ ] Package built successfully (`npm run build`)
- [ ] No build errors

### 3. Firebase Configuration

#### Option A: Service Account File
- [ ] Downloaded service account key from Firebase Console
  - Firebase Console → Project Settings → Service Accounts
  - Click "Generate New Private Key"
- [ ] Saved as `serviceAccountKey.json` in secure location
- [ ] Created `.env` file from template (`cp .env.example .env`)
- [ ] Set `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`
- [ ] Verified file path is correct and accessible

#### Option B: Environment Variables
- [ ] Created `.env` file
- [ ] Set `FIREBASE_PROJECT_ID`
- [ ] Set `FIREBASE_CLIENT_EMAIL`
- [ ] Set `FIREBASE_PRIVATE_KEY` (with proper escaping)

### 4. Firebase Database Structure

Verify these collections exist in Firestore:

- [ ] `locations` collection exists
  - [ ] Has at least one document
  - [ ] Documents have required fields (name, address, capacity, etc.)
  - [ ] `capacity.operatingHours` is properly structured

- [ ] `services` collection exists
  - [ ] Has service documents
  - [ ] Documents have pricing information

- [ ] `instructors` collection exists (optional but recommended)
  - [ ] Has instructor documents

- [ ] `bookings` collection exists
  - [ ] Has booking documents
  - [ ] Documents have scheduledAt, duration, revenue, status

- [ ] `revenueTargets` collection exists (optional)
  - [ ] Has target documents if using revenue tracking

### 5. Test the Package

Create a test file (`test-connection.ts`) with this content:

```typescript
import businessIntelligence from './packages/business-intelligence/src';

async function test() {
  try {
    console.log('🔍 Testing Firebase connection...\n');

    // Test 1: Get locations
    const locations = await businessIntelligence.getLocations();
    console.log(`✅ Found ${locations.length} locations:`);
    locations.forEach(loc => {
      console.log(`   📍 ${loc.name} (${loc.city}, ${loc.province})`);
    });

    if (locations.length === 0) {
      console.warn('⚠️  No locations found. Add locations to Firebase first.');
      return;
    }

    // Test 2: Get location insights
    console.log('\n🔍 Testing location insights...\n');
    const insights = await businessIntelligence.getLocationInsights(locations[0].id);
    if (insights) {
      console.log(`✅ ${insights.location.name} Insights:`);
      console.log(`   Utilization: ${(insights.utilization.utilizationRate * 100).toFixed(1)}%`);
      console.log(`   Revenue: $${insights.revenue.actual.toFixed(2)}`);
      console.log(`   Performance: ${insights.performance}`);
    }

    // Test 3: Get business snapshot
    console.log('\n🔍 Testing business snapshot...\n');
    const snapshot = await businessIntelligence.getBusinessSnapshot();
    console.log('✅ Business Snapshot:');
    console.log(`   Total Revenue: $${snapshot.totalRevenue.toFixed(2)}`);
    console.log(`   Total Bookings: ${snapshot.totalBookings}`);
    console.log(`   Overall Utilization: ${(snapshot.overallUtilization * 100).toFixed(1)}%`);
    console.log(`   Underperforming Locations: ${snapshot.underperformingLocations.length}`);

    console.log('\n✅ All tests passed! Your setup is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nTroubleshooting steps:');
    console.error('1. Verify .env file exists and has correct Firebase credentials');
    console.error('2. Check that service account file path is correct');
    console.error('3. Ensure Firebase collections exist with proper structure');
    console.error('4. Verify service account has read permissions on Firestore');
  }
}

test();
```

Run the test:
```bash
# Using ts-node
npx ts-node test-connection.ts

# Or compile first
npx tsc test-connection.ts
node test-connection.js
```

- [ ] Test runs without errors
- [ ] Locations are retrieved successfully
- [ ] Insights are calculated correctly
- [ ] Business snapshot is generated

### 6. Verify Data

Check that the retrieved data makes sense:

- [ ] Location names match your actual locations
- [ ] Addresses are correct
- [ ] Utilization percentages seem reasonable
- [ ] Revenue numbers match expectations
- [ ] Service names and prices are accurate

### 7. Security Check

- [ ] `.env` file is NOT committed to git
- [ ] `serviceAccountKey.json` is NOT committed to git
- [ ] Both are listed in `.gitignore`
- [ ] Service account has read-only permissions (verify in Firebase Console)

### 8. Documentation Review

- [ ] Read [README.md](README.md) - Project overview
- [ ] Read [SETUP.md](SETUP.md) - Detailed setup guide
- [ ] Read [STRUCTURE.md](STRUCTURE.md) - Architecture
- [ ] Read [PHASE1_COMPLETE.md](PHASE1_COMPLETE.md) - What was built
- [ ] Review [package README](packages/business-intelligence/README.md) - API docs
- [ ] Look at [usage examples](packages/business-intelligence/examples/usage.ts)

## 🎯 What's Next?

Once everything above is checked:

### Immediate Actions
1. **Explore the API**: Try different queries and date ranges
2. **Integrate with your workflow**: Start using insights in your decision-making
3. **Identify opportunities**: Look at underperforming locations and services

### Phase 2: Operations Dashboard
- [ ] Decide on dashboard framework (Next.js recommended)
- [ ] Design dashboard layout
- [ ] Choose charting library (Recharts, Chart.js, etc.)
- [ ] Start building dashboard application

### Phase 3: Event Tracking
- [ ] Plan event tracking schema
- [ ] Identify key events to track from website
- [ ] Design API endpoints for event ingestion

## 🐛 Troubleshooting

### "Failed to initialize Firebase"
**Problem**: Can't connect to Firebase
**Solutions**:
- Verify `.env` file exists in project root
- Check service account path is correct
- Ensure service account JSON file is valid
- Try using environment variables instead of file path

### "Permission Denied"
**Problem**: Service account doesn't have access
**Solutions**:
- Go to Firebase Console → IAM & Admin
- Ensure service account has "Cloud Datastore User" role
- Or give it "Firebase Admin" role for full access

### "Collection does not exist"
**Problem**: Missing Firestore collections
**Solutions**:
- Create the collections in Firebase Console
- Add sample documents to test with
- Verify collection names match exactly (case-sensitive)

### "Utilization is 0%" or "No bookings found"
**Problem**: No booking data in date range
**Solutions**:
- Check that bookings have `scheduledAt` field
- Verify dates are in the correct format (Timestamp)
- Try a different date range
- Add sample bookings for testing

### Build Errors
**Problem**: TypeScript compilation fails
**Solutions**:
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Import Errors
**Problem**: Can't import from package
**Solutions**:
- Ensure package is built (`npm run build`)
- Check TypeScript configuration
- Verify package.json exports are correct

## 📞 Need Help?

1. **Check Documentation**: All docs are in the project
2. **Review Examples**: See `packages/business-intelligence/examples/usage.ts`
3. **Verify Firebase**: Check Firebase Console to ensure data exists
4. **Read Error Messages**: They usually point to the issue
5. **Check Permissions**: Ensure service account has proper access

## 🎉 Success Indicators

You'll know everything is working when:

✅ Test script runs without errors
✅ Location data is retrieved correctly
✅ Utilization calculations make sense
✅ Revenue numbers are accurate
✅ Business snapshot provides useful insights
✅ No permission errors
✅ Data matches what's in Firebase Console

## 📈 Using the Package

Once setup is complete, you can start using the package:

```typescript
import businessIntelligence, {
  getCurrentMonth,
  type LocationInsights
} from '@inspired-swim/business-intelligence';

// Get current month insights
const monthRange = getCurrentMonth();
const insights = await businessIntelligence.getAllLocationInsights({
  dateRange: monthRange
});

// Find locations that need attention
const needsAttention = insights.filter(
  loc => loc.utilization.utilizationRate < 0.5
);

console.log('Locations under 50% utilization:');
needsAttention.forEach(loc => {
  console.log(`- ${loc.location.name}: ${(loc.utilization.utilizationRate * 100).toFixed(1)}%`);
});
```

## 🚀 Ready for Production?

Before deploying to production:

- [ ] Test with production Firebase data
- [ ] Use separate service accounts for dev/prod
- [ ] Set up environment variables in hosting platform
- [ ] Monitor initial queries for performance
- [ ] Set up error logging/monitoring
- [ ] Document any production-specific configuration

---

**Questions?** Review the documentation files or check the inline code comments.

**Ready to build?** Start with Phase 2: Operations Dashboard!
