# Inspired Swim Marketing Hub

Marketing intelligence and business analytics platform for Inspired Swim's operations across BC and Alberta.

## Overview

The Marketing Hub integrates with Inspired Swim's existing systems:
- **Reads** operational data from Firebase (booking platform)
- **Receives** tracking events from the marketing website
- **Provides** business intelligence and marketing optimization
- **Generates** marketing content

## Architecture

This is a monorepo using Turbo and npm workspaces:

```
swim_hub/
├── apps/               # Applications
│   └── dashboard/     # Next.js Operations Dashboard
├── packages/          # Shared packages
│   └── business-intelligence/   # Firebase integration & analytics
```

## Packages

### @inspired-swim/business-intelligence

Read-only Firebase integration providing:
- Location insights (utilization, capacity, performance)
- Service and pricing data
- Instructor analytics
- Revenue tracking vs targets
- Business snapshots

[View Package Documentation](./packages/business-intelligence/README.md)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase service account credentials

### Installation

```bash
# Install dependencies
npm install

# Build all packages
npm run build
```

### Configuration

1. Create a `.env` file in the root:

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# OR use individual credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

2. Obtain Firebase service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Save as `serviceAccountKey.json` (keep secure, never commit!)

### Development

```bash
# Run all packages in development mode
npm run dev

# Build all packages
npm run build

# Lint all packages
npm run lint

# Clean build artifacts
npm run clean
```

## Project Principles

### Data Separation
- **ALL** business data comes from Firebase
- **NEVER** hardcode locations, pricing, or services
- If business info is needed, read it from Firebase

### System Integration
- Marketing website fires tracking events → Hub receives and analyzes
- Hub reads operational data → Provides insights
- Clean separation of concerns

### Read-Only Operations
- Business Intelligence package is read-only
- Never modifies operational data in Firebase
- Safe to run alongside booking platform

## Phase 1: Foundation + Business Intelligence ✅

**Status**: Complete

- ✅ Monorepo structure with TypeScript
- ✅ Firebase Admin SDK integration
- ✅ Business Intelligence service
- ✅ Location utilization calculations
- ✅ Service/pricing data retrieval
- ✅ Instructor and revenue tracking
- ✅ Business snapshot API

## Phase 2: Operations Dashboard ✅

**Status**: Complete

**Live Route**: `/operations`

Features:
- ✅ Business overview metrics (locations, utilization, revenue)
- ✅ Performance alerts for underperforming (<40%) and high-performing (>90%) locations
- ✅ Revenue tracking by location and lesson type
- ✅ Comprehensive location table with color-coded utilization
- ✅ Auto-refresh every 5 minutes
- ✅ Professional design with Inspired Swim branding (#004657, #0080A0)

### Running the Dashboard

```bash
npm run dev
# Dashboard available at http://localhost:3002/operations
```

## Future Phases

### Phase 3: Event Tracking API
- Receive tracking events from website
- Page views, form submissions, conversions
- User journey tracking

### Phase 4: Conversion Intelligence
- Analyze marketing performance
- Attribution modeling
- Conversion funnel analysis

### Phase 5: SMS Lead Agent
- Automated lead capture via SMS
- Lead nurturing workflows
- Integration with booking system

### Phase 6: Organic Growth Engine
- SEO content generation
- Blog posts and location pages
- Schema markup for local SEO

## Deployment to Vercel

### Quick Deploy

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit: Operations Dashboard"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Add Environment Variables** in Vercel dashboard:
   - `FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `FIREBASE_CLIENT_EMAIL` - Firebase service account email
   - `FIREBASE_PRIVATE_KEY` - Firebase private key (keep quotes and \n)

4. **Deploy**: Vercel will automatically build and deploy

### Manual Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link project
```

## Testing with Real Data

Run the test script to verify Firebase connection:

```bash
node test-real-data.js
```

This will display:
- All active locations
- Active seasons
- Pricing structure
- Location insights (utilization, revenue, bookings)
- Business snapshot with top/underperforming locations

## Contributing

This is a private project for Inspired Swim. For questions or issues, contact the development team.

## License

Private - Inspired Swim © 2025
