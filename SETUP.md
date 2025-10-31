# Inspired Swim Marketing Hub - Setup Guide

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Firebase service account credentials
- Access to your Inspired Swim Firebase project

## Step 1: Install Dependencies

From the root directory:

```bash
npm install
```

## Step 2: Configure Firebase Credentials

### Option A: Service Account File (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Inspired Swim project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json`
6. Move it to a secure location (e.g., `~/.firebase/` or project root)

**IMPORTANT**: Never commit this file to git! It's already in `.gitignore`.

7. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

8. Edit `.env` and set the path:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
```

### Option B: Environment Variables

Alternatively, you can set individual environment variables in `.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

## Step 3: Verify Firebase Database Structure

The Business Intelligence package expects these collections in Firestore:

### Required Collections

1. **`locations`** - Swim location information
   ```typescript
   {
     name: string;
     address: string;
     city: string;
     province: string;
     postalCode: string;
     capacity: {
       poolLanes: number;
       maxConcurrentLessons: number;
       operatingHours: {
         monday: { open: "09:00", close: "20:00" },
         tuesday: { open: "09:00", close: "20:00" },
         // ... etc
       }
     };
     active: boolean;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

2. **`services`** - Service types and pricing
   ```typescript
   {
     name: string;
     description: string;
     duration: number; // minutes
     pricing: {
       basePrice: number;
       currency: string;
       priceByLocation?: { [locationId]: number };
     };
     active: boolean;
     serviceType: "private" | "group" | "assessment" | "other";
   }
   ```

3. **`instructors`** - Instructor information
   ```typescript
   {
     name: string;
     email: string;
     phone?: string;
     locationIds: string[];
     certifications: string[];
     active: boolean;
     hireDate: Timestamp;
   }
   ```

4. **`bookings`** - Lesson bookings
   ```typescript
   {
     locationId: string;
     instructorId: string;
     serviceId: string;
     studentName: string;
     studentAge?: number;
     parentEmail: string;
     parentPhone: string;
     scheduledAt: Timestamp;
     duration: number; // minutes
     status: "scheduled" | "completed" | "cancelled" | "no-show";
     revenue: number;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

5. **`revenueTargets`** (Optional) - Revenue targets by location
   ```typescript
   {
     locationId: string;
     targetAmount: number;
     period: "weekly" | "monthly" | "quarterly" | "yearly";
     startDate: Timestamp;
     endDate: Timestamp;
   }
   ```

## Step 4: Build the Package

```bash
# From project root
npm run build

# Or build just the business intelligence package
cd packages/business-intelligence
npm run build
```

## Step 5: Test the Connection

Create a test file to verify everything works:

```typescript
// test-connection.ts
import businessIntelligence from '@inspired-swim/business-intelligence';

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');

    // Get all locations
    const locations = await businessIntelligence.getLocations();
    console.log(`✅ Connected! Found ${locations.length} locations:`);

    locations.forEach(loc => {
      console.log(`   - ${loc.name} (${loc.city}, ${loc.province})`);
    });

    // Get business snapshot
    const snapshot = await businessIntelligence.getBusinessSnapshot();
    console.log(`\n📊 Business Snapshot:`);
    console.log(`   Total Revenue: $${snapshot.totalRevenue.toFixed(2)}`);
    console.log(`   Total Bookings: ${snapshot.totalBookings}`);
    console.log(`   Overall Utilization: ${(snapshot.overallUtilization * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check that FIREBASE_SERVICE_ACCOUNT_PATH is correct in .env');
    console.error('2. Verify the service account has read permissions');
    console.error('3. Ensure your Firebase collections exist and have the correct structure');
  }
}

testConnection();
```

Run it:

```bash
# If using TypeScript directly with ts-node
npx ts-node test-connection.ts

# Or compile first
npx tsc test-connection.ts
node test-connection.js
```

## Step 6: Use the Package

Now you can import and use the Business Intelligence package in your applications:

```typescript
import businessIntelligence, {
  getCurrentMonth,
  type LocationInsights
} from '@inspired-swim/business-intelligence';

// Get location insights
const insights = await businessIntelligence.getAllLocationInsights();

// Find underperforming locations
const underperforming = insights.filter(
  loc => loc.utilization.utilizationRate < 0.4
);

console.log('Locations needing attention:');
underperforming.forEach(loc => {
  console.log(`${loc.location.name}: ${(loc.utilization.utilizationRate * 100).toFixed(1)}%`);
});
```

## Troubleshooting

### "Failed to initialize Firebase"

- Check that your `.env` file exists and has the correct path
- Verify the service account JSON file exists at that path
- Ensure the file has the correct permissions (readable by your user)

### "Permission Denied" errors

- Verify your service account has read permissions on Firestore
- In Firebase Console: IAM & Admin → Service Accounts
- Ensure the account has "Cloud Datastore User" or "Firebase Admin" role

### "Collection does not exist"

- The package will still work, but will return empty arrays
- Create the collections in Firebase Console if they don't exist
- Or import your existing data into the expected structure

### Build errors

```bash
# Clean and rebuild
npm run clean
npm run build
```

## Next Steps

1. **Test with your actual Firebase data** to ensure data structure compatibility
2. **Create a dashboard application** in `apps/dashboard` to visualize the insights
3. **Set up event tracking API** to receive events from your marketing website
4. **Integrate with your existing website** to send tracking events

## Security Notes

- ⚠️ Never commit `serviceAccountKey.json` to version control
- ⚠️ Never commit `.env` files to version control
- ✅ Both are already in `.gitignore`
- ✅ The package is read-only and cannot modify Firebase data
- ✅ Use environment-specific service accounts for development vs production

## Support

For issues or questions:
1. Check the package documentation: `packages/business-intelligence/README.md`
2. Review the examples: `packages/business-intelligence/examples/usage.ts`
3. Contact the development team

---

**Phase 1 Complete!** 🎉

You now have:
- ✅ Working monorepo structure
- ✅ Business Intelligence package with Firebase integration
- ✅ Location utilization calculations
- ✅ Service and pricing data retrieval
- ✅ Revenue tracking and insights

Ready to build the dashboard or add more features!
