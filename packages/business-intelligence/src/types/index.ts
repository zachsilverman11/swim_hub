/**
 * Core business data types from Firebase - Inspired Swim Platform
 * Based on actual Firebase schema discovered from inspired-swim-platform
 */

export interface Location {
  id: string;
  name: string;
  displayName?: string;
  region?: string; // 'alberta' | 'bc' | etc
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    mapUrl: string;
  };
  facilities?: string;
  poolType?: string;
  totalCapacity?: number;
  currentEnrollment?: number;
  isActive: boolean;
  isVisibleToUser: boolean;
  lessonTypes: string[];
  hasPricingOverride: boolean;
  operatingHours?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Season {
  id: string;
  name: string; // e.g., "Fall #2 2025", "Winter 2026"
  startDate: Date;
  endDate: Date;
  registrationOpen: Date;
  holdMySpotOpen: Date;
  holdMySpotClose: Date;
  isActive: boolean;
  locations: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  programId: string;
  locationId: string;
  locationName: string;
  seasonId: string;
  seasonName: string;
  format: string; // 'swim_set'
  startDate: Date;
  endDate: Date;
  startTime: string; // e.g., "15:00"
  endTime: string; // e.g., "21:00"
  dayOfWeek: string; // 'monday', 'tuesday', etc
  daysOfWeek: string[];
  coachIds: string[];
  numLessons: number;
  isFull: boolean;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  id: string;
  coachId: string;
  coachName: string;
  locationId: string;
  locationName: string;
  seasonId: string;
  seasonName: string;
  programId?: string;
  programName?: string;
  days: string[]; // ['monday', 'tuesday', etc]
  startTime: string; // "14:00"
  endTime: string; // "18:00"
  format: string; // 'swim_set'
  lessonType: string; // 'private', 'group'
  status: string; // 'approved', 'pending', etc
  isActive: boolean;
  isFullCampAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  coachId: string;
  locationId: string;
  locationName: string;
  seasonId: string;
  seasonName: string;
  programId: string;
  parentId: string;
  swimmerIds: string[];
  lessonType: string; // 'private', 'group', 'semi-private'
  lessonFormat: string; // 'swim_set'
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  numLessons: number;
  status: string; // 'confirmed', 'pending', 'cancelled'
  paymentStatus: string; // 'paid', 'pending', 'failed'
  paymentMethod: string; // 'stripe', 'promo_code', etc
  currency: string; // 'CAD'
  totalAmount: number;
  amountPaid: number;
  discountApplied: number;
  promoCode?: string;
  transactionRef?: string;
  paymentReference?: string;
  paymentDate?: string;
  bypassPayment: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  bookingId: string;
  coachId: string;
  locationId: string;
  seasonId: string;
  parentId: string;
  swimmerIds: string[];
  lessonDate: Date;
  startTime: string;
  endTime: string;
  lessonType: string; // 'private', 'group'
  lessonFormat: string; // 'swim_set'
  status: string; // 'confirmed', 'completed', 'cancelled', 'no-show'
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupClass {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  seasonId: string;
  seasonName: string;
  programId: string;
  coachIds: string[];
  swimmerLevel: string; // 'preschool-3', 'swimmer-3', etc
  swimmerLevelName: string;
  format: string;
  dayOfWeek: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  duration: number; // minutes
  maxSwimmers: number;
  currentEnrollment: number;
  availableSpots: number;
  startDate: Date;
  endDate: Date;
  totalLessons: number;
  isFull: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pricing {
  privateLessons: {
    '30min': {
      basePrice: number;
      addOnPerSwimmer: number;
      maxSwimmers: number;
    };
    '45min': {
      basePrice: number;
      addOnPerSwimmer: number;
      maxSwimmers: number;
    };
    '60min': {
      basePrice: number;
      addOnPerSwimmer: number;
      maxSwimmers: number;
    };
  };
  smallGroup: {
    '30min': {
      pricePerSwimmer: number;
      maxSwimmers: number;
    };
    '45min': {
      pricePerSwimmer: number;
      maxSwimmers: number;
    };
    '60min': {
      pricePerSwimmer: number;
      maxSwimmers: number;
    };
  };
  overrideable: boolean;
}

/**
 * Business Intelligence derived types
 * These are calculated from the core data
 */

export interface WeeklyUtilization {
  availableHoursPerWeek: number;
  bookedHoursPerWeek: number;
  utilizationRate: number; // 0-1
  availableSlots: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    hours: number;
  }>;
}

export interface LocationInsights {
  location: Location;
  season: Season;
  utilization: WeeklyUtilization;
  revenue: {
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
    pending: number;
  };
  lessons: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  performance: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SeasonInsights {
  season: Season;
  totalRevenue: number;
  totalBookings: number;
  totalLessons: number;
  averageBookingValue: number;
  locationBreakdown: Array<{
    locationId: string;
    locationName: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface LessonTypeInsights {
  lessonType: '30min' | '45min' | '60min';
  lessonFormat: 'private' | 'group' | 'semi-private';
  bookingCount: number;
  revenue: number;
  averagePrice: number;
  popularityByLocation: Record<string, number>;
}

export interface BusinessSnapshot {
  timestamp: Date;
  activeSeason: Season;
  locations: LocationInsights[];
  totalRevenue: number;
  totalBookings: number;
  overallUtilization: number;
  underperformingLocations: LocationInsights[];
  topLocations: LocationInsights[];
  lessonTypeBreakdown: LessonTypeInsights[];
}

/**
 * Query parameters for filtering business data
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface BusinessIntelligenceQuery {
  locationIds?: string[];
  seasonIds?: string[];
  dateRange?: DateRange;
  includeInactive?: boolean;
}

/**
 * Revenue Target (managed in dashboard, not from Firebase)
 */

export interface RevenueTarget {
  id: string;
  locationId?: string;
  seasonId?: string;
  targetAmount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'season';
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
