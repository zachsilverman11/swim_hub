# Project Structure

## Directory Layout

```
swim_hub/
├── README.md                          # Project overview and documentation
├── SETUP.md                           # Setup and installation guide
├── STRUCTURE.md                       # This file - project structure reference
├── package.json                       # Root package.json with workspace config
├── turbo.json                         # Turbo monorepo configuration
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
│
├── apps/                              # Applications (future)
│   ├── dashboard/                     # Operations dashboard (Phase 2)
│   ├── api/                           # Event tracking API (Phase 3)
│   └── content-generator/             # Content generation app (Phase 6)
│
└── packages/                          # Shared packages
    └── business-intelligence/         # Firebase integration & analytics
        ├── README.md                  # Package documentation
        ├── package.json               # Package dependencies
        ├── tsconfig.json              # TypeScript configuration
        │
        ├── src/                       # Source code
        │   ├── index.ts               # Main entry point
        │   │
        │   ├── types/                 # TypeScript type definitions
        │   │   └── index.ts           # Business data types
        │   │
        │   ├── services/              # Core services
        │   │   ├── firebase.service.ts              # Firebase connection
        │   │   └── business-intelligence.service.ts # Main BI service
        │   │
        │   └── utils/                 # Utility functions
        │       └── date.utils.ts      # Date calculations
        │
        ├── examples/                  # Usage examples
        │   └── usage.ts               # Example code
        │
        └── dist/                      # Built files (generated)
            ├── index.js
            ├── index.d.ts
            ├── services/
            ├── types/
            └── utils/
```

## Package: business-intelligence

### Purpose
Read-only Firebase integration providing business intelligence and analytics.

### Key Files

#### `src/index.ts`
Main entry point. Exports all types, services, and utilities.

#### `src/types/index.ts`
Type definitions for:
- **Core Data Types**: Location, Service, Instructor, Booking, RevenueTarget
- **Insights Types**: LocationInsights, ServiceInsights, InstructorInsights, BusinessSnapshot
- **Query Types**: DateRange, BusinessIntelligenceQuery

#### `src/services/firebase.service.ts`
Firebase Admin SDK wrapper:
- Singleton pattern for connection management
- Supports multiple credential methods
- Read-only operations
- Health check functionality

#### `src/services/business-intelligence.service.ts`
Main service providing:
- `getLocations()` - Retrieve location data
- `getServices()` - Retrieve service/pricing data
- `getInstructors()` - Retrieve instructor data
- `getBookings()` - Retrieve booking data with filters
- `getLocationInsights()` - Calculate utilization and performance
- `getServiceInsights()` - Analyze service popularity
- `getInstructorInsights()` - Instructor performance metrics
- `getBusinessSnapshot()` - Complete business overview

#### `src/utils/date.utils.ts`
Date utilities for:
- Getting current week/month/quarter/year ranges
- Calculating hours between dates
- Computing available business hours
- Date range validations

## Data Flow

```
Firebase (Firestore)
    ↓
FirebaseService (connection)
    ↓
BusinessIntelligenceService (queries & calculations)
    ↓
Your Application (dashboard, API, etc.)
```

## Design Principles

### 1. Read-Only Access
- No write operations to Firebase
- Safe to run alongside booking platform
- All queries are SELECT-only

### 2. No Hardcoded Data
- All business data comes from Firebase
- Location details, pricing, services all dynamic
- Configuration via environment variables only

### 3. Clean Separation
- Firebase service handles connection
- BI service handles business logic
- Utilities handle common calculations
- Types ensure type safety

### 4. Monorepo Benefits
- Shared packages across multiple apps
- Consistent types and logic
- Easy to add new applications
- Turbo for fast builds

## Future Structure

### Phase 2: Operations Dashboard
```
apps/dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   └── lib/                    # Client utilities
└── package.json
```

### Phase 3: Event Tracking API
```
apps/api/
├── src/
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Express middleware
│   └── services/               # Event processing
└── package.json
```

### Additional Packages
```
packages/
├── business-intelligence/      # ✅ Phase 1 (Complete)
├── event-tracking/             # Phase 3 - Event ingestion
├── conversion-intelligence/    # Phase 4 - Conversion analytics
├── sms-agent/                  # Phase 5 - SMS lead capture
└── content-generator/          # Phase 6 - SEO content generation
```

## Technology Stack

### Current (Phase 1)
- **Language**: TypeScript
- **Runtime**: Node.js 20+
- **Database**: Firebase/Firestore (read-only)
- **Build**: Turbo + npm workspaces
- **Package Manager**: npm

### Future Additions
- **Dashboard**: Next.js + React + Tailwind CSS
- **API**: Express or Next.js API routes
- **Content Generation**: OpenAI API or similar

## Development Workflow

### Building
```bash
# Build all packages
npm run build

# Build specific package
cd packages/business-intelligence
npm run build

# Watch mode for development
npm run dev
```

### Adding New Packages
```bash
# Create new package directory
mkdir -p packages/new-package/src

# Create package.json
cd packages/new-package
npm init -y

# Install from root to link workspaces
cd ../..
npm install
```

### Adding New Apps
```bash
# Create new app
mkdir -p apps/new-app

# Create Next.js app (example)
cd apps/new-app
npx create-next-app@latest . --typescript

# Add business-intelligence dependency
npm install @inspired-swim/business-intelligence
```

## Configuration Files

### `package.json` (root)
- Defines workspaces (`apps/*`, `packages/*`)
- Scripts for building/developing all packages
- Dev dependencies shared across workspace

### `turbo.json`
- Build pipeline configuration
- Caching strategy
- Output paths

### `tsconfig.json` (per package)
- TypeScript compiler options
- Module resolution
- Output directory

### `.env`
- Environment variables
- Firebase credentials
- Never committed to git

## Import Patterns

### From Applications
```typescript
// Import entire service
import businessIntelligence from '@inspired-swim/business-intelligence';

// Import specific utilities
import { getCurrentMonth } from '@inspired-swim/business-intelligence';

// Import types
import type { Location, LocationInsights } from '@inspired-swim/business-intelligence';
```

### Within Package
```typescript
// Use relative imports
import { Location } from '../types';
import FirebaseService from './firebase.service';
```

## Security

### Protected Files
- `.env` - Environment variables (gitignored)
- `serviceAccountKey.json` - Firebase credentials (gitignored)
- `node_modules/` - Dependencies (gitignored)
- `dist/` - Build artifacts (gitignored)

### Credentials Management
1. Development: Local `.env` file
2. Production: Environment variables in hosting platform
3. Never commit credentials to git
4. Use different service accounts for dev/prod

## Performance

### Build Performance
- Turbo caching speeds up rebuilds
- Only rebuilds changed packages
- Parallel builds when possible

### Runtime Performance
- Firebase queries are indexed
- Singleton pattern for connections
- Data fetched only when needed
- Can add caching layer if needed

## Testing Strategy (Future)

### Unit Tests
```
packages/business-intelligence/
└── src/
    └── __tests__/
        ├── services/
        └── utils/
```

### Integration Tests
```
packages/business-intelligence/
└── tests/
    └── integration/
        └── firebase.test.ts
```

## Documentation

- `README.md` - Project overview
- `SETUP.md` - Installation and setup
- `STRUCTURE.md` - This file, project structure
- `packages/*/README.md` - Package-specific docs
- `examples/` - Usage examples

---

Last Updated: Phase 1 Complete
