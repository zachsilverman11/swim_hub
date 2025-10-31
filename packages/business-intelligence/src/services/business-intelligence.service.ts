import FirebaseService from './firebase.service';
import {
  Location,
  Season,
  Program,
  Availability,
  Booking,
  Lesson,
  Pricing,
  LocationInsights,
  SeasonInsights,
  LessonTypeInsights,
  BusinessSnapshot,
  BusinessIntelligenceQuery,
  WeeklyUtilization,
} from '../types';

/**
 * Business Intelligence Service for Inspired Swim
 * Retrieves and analyzes business data from Firebase
 */
export class BusinessIntelligenceService {
  private firebase = FirebaseService;

  /**
   * Get all locations from Firebase
   */
  async getLocations(includeInactive = false): Promise<Location[]> {
    const snapshot = await this.firebase.collection('locations').get();

    const locations: Location[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const location: Location = {
        id: doc.id,
        name: data.name,
        displayName: data.displayName,
        region: data.region,
        address: data.address || {},
        facilities: data.facilities,
        poolType: data.poolType,
        totalCapacity: data.totalCapacity,
        currentEnrollment: data.currentEnrollment,
        isActive: data.isActive ?? true,
        isVisibleToUser: data.isVisibleToUser ?? true,
        lessonTypes: data.lessonTypes || [],
        hasPricingOverride: data.hasPricingOverride ?? false,
        operatingHours: data.operatingHours,
        createdAt: this.firebase.timestampToDate(data.createdAt),
        updatedAt: this.firebase.timestampToDate(data.updatedAt),
      };

      if (includeInactive || location.isActive) {
        locations.push(location);
      }
    });

    return locations;
  }

  /**
   * Get a specific location by ID
   */
  async getLocation(locationId: string): Promise<Location | null> {
    const doc = await this.firebase.collection('locations').doc(locationId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      name: data.name,
      displayName: data.displayName,
      region: data.region,
      address: data.address || {},
      facilities: data.facilities,
      poolType: data.poolType,
      totalCapacity: data.totalCapacity,
      currentEnrollment: data.currentEnrollment,
      isActive: data.isActive ?? true,
      isVisibleToUser: data.isVisibleToUser ?? true,
      lessonTypes: data.lessonTypes || [],
      hasPricingOverride: data.hasPricingOverride ?? false,
      operatingHours: data.operatingHours,
      createdAt: this.firebase.timestampToDate(data.createdAt),
      updatedAt: this.firebase.timestampToDate(data.updatedAt),
    };
  }

  /**
   * Get all seasons from Firebase
   */
  async getSeasons(activeOnly = true): Promise<Season[]> {
    let query = this.firebase.collection('seasons');

    if (activeOnly) {
      query = query.where('isActive', '==', true) as any;
    }

    const snapshot = await query.get();

    const seasons: Season[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      seasons.push({
        id: doc.id,
        name: data.name,
        startDate: this.firebase.timestampToDate(data.startDate),
        endDate: this.firebase.timestampToDate(data.endDate),
        registrationOpen: this.firebase.timestampToDate(data.registrationOpen),
        holdMySpotOpen: this.firebase.timestampToDate(data.holdMySpotOpen),
        holdMySpotClose: this.firebase.timestampToDate(data.holdMySpotClose),
        isActive: data.isActive ?? false,
        locations: data.locations || [],
        notes: data.notes,
        createdAt: this.firebase.timestampToDate(data.createdAt),
        updatedAt: this.firebase.timestampToDate(data.updatedAt),
      });
    });

    return seasons;
  }

  /**
   * Get programs (availability windows) for a location and season
   */
  async getPrograms(locationId?: string, seasonId?: string): Promise<Program[]> {
    let query = this.firebase.collection('programs');

    if (locationId) {
      query = query.where('locationId', '==', locationId) as any;
    }

    if (seasonId) {
      query = query.where('seasonId', '==', seasonId) as any;
    }

    const snapshot = await query.get();

    const programs: Program[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      programs.push({
        id: doc.id,
        programId: data.programId || doc.id,
        locationId: data.locationId,
        locationName: data.locationName,
        seasonId: data.seasonId,
        seasonName: data.seasonName,
        format: data.format,
        startDate: this.firebase.timestampToDate(data.startDate),
        endDate: this.firebase.timestampToDate(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
        daysOfWeek: data.daysOfWeek || [],
        coachIds: data.coachIds || [],
        numLessons: data.numLessons || 0,
        isFull: data.isFull ?? false,
        isActive: data.isActive ?? true,
        description: data.description,
        createdAt: this.firebase.timestampToDate(data.createdAt),
        updatedAt: this.firebase.timestampToDate(data.updatedAt),
      });
    });

    return programs;
  }

  /**
   * Get bookings with optional filters
   */
  async getBookings(query?: BusinessIntelligenceQuery): Promise<Booking[]> {
    let bookingsQuery = this.firebase.collection('bookings');

    if (query?.locationIds && query.locationIds.length > 0) {
      bookingsQuery = bookingsQuery.where('locationId', 'in', query.locationIds.slice(0, 10)) as any;
    }

    if (query?.seasonIds && query.seasonIds.length > 0) {
      bookingsQuery = bookingsQuery.where('seasonId', 'in', query.seasonIds.slice(0, 10)) as any;
    }

    const snapshot = await bookingsQuery.get();

    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const booking: Booking = {
        id: doc.id,
        coachId: data.coachId,
        locationId: data.locationId,
        locationName: data.locationName,
        seasonId: data.seasonId,
        seasonName: data.seasonName,
        programId: data.programId,
        parentId: data.parentId,
        swimmerIds: data.swimmerIds || [],
        lessonType: data.lessonType,
        lessonFormat: data.lessonFormat,
        startDate: this.firebase.timestampToDate(data.startDate),
        endDate: this.firebase.timestampToDate(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
        numLessons: data.numLessons,
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        currency: data.currency,
        totalAmount: data.totalAmount || 0,
        amountPaid: data.amountPaid || 0,
        discountApplied: data.discountApplied || 0,
        promoCode: data.promoCode,
        transactionRef: data.transactionRef,
        paymentReference: data.paymentReference,
        paymentDate: data.paymentDate,
        bypassPayment: data.bypassPayment ?? false,
        createdAt: this.firebase.timestampToDate(data.createdAt),
        updatedAt: this.firebase.timestampToDate(data.updatedAt),
      };

      bookings.push(booking);
    });

    return bookings;
  }

  /**
   * Get lessons with optional filters
   */
  async getLessons(locationId?: string, seasonId?: string): Promise<Lesson[]> {
    let query = this.firebase.collection('lessons');

    if (locationId) {
      query = query.where('locationId', '==', locationId) as any;
    }

    if (seasonId) {
      query = query.where('seasonId', '==', seasonId) as any;
    }

    const snapshot = await query.get();

    const lessons: Lesson[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      lessons.push({
        id: doc.id,
        bookingId: data.bookingId,
        coachId: data.coachId,
        locationId: data.locationId,
        seasonId: data.seasonId,
        parentId: data.parentId,
        swimmerIds: data.swimmerIds || [],
        lessonDate: this.firebase.timestampToDate(data.lessonDate),
        startTime: data.startTime,
        endTime: data.endTime,
        lessonType: data.lessonType,
        lessonFormat: data.lessonFormat,
        status: data.status,
        createdAt: this.firebase.timestampToDate(data.createdAt),
        updatedAt: this.firebase.timestampToDate(data.updatedAt),
      });
    });

    return lessons;
  }

  /**
   * Get pricing from Firebase
   */
  async getPricing(): Promise<Pricing | null> {
    const doc = await this.firebase.collection('pricing').doc('default').get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      privateLessons: data.privateLessons,
      smallGroup: data.smallGroup,
      overrideable: data.overrideable ?? true,
    };
  }

  /**
   * Calculate weekly utilization for a location in a season
   * This calculates:
   * - Available hours per week (from programs)
   * - Booked hours per week (from bookings, since each booking is a weekly recurring slot)
   * - Utilization rate
   */
  async calculateWeeklyUtilization(
    locationId: string,
    seasonId: string
  ): Promise<WeeklyUtilization> {
    // Get all programs for this location and season
    const programs = await this.getPrograms(locationId, seasonId);

    // Calculate available hours per week from programs
    const availableSlots: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      hours: number;
    }> = [];

    let totalAvailableHours = 0;

    programs.forEach((program) => {
      if (!program.isActive) return;

      const startHour = parseInt(program.startTime.split(':')[0]);
      const startMinute = parseInt(program.startTime.split(':')[1]);
      const endHour = parseInt(program.endTime.split(':')[0]);
      const endMinute = parseInt(program.endTime.split(':')[1]);

      const hours =
        endHour - startHour + (endMinute - startMinute) / 60;

      availableSlots.push({
        dayOfWeek: program.dayOfWeek,
        startTime: program.startTime,
        endTime: program.endTime,
        hours,
      });

      totalAvailableHours += hours;
    });

    // Get all confirmed bookings for this location and season
    // Each booking represents a weekly recurring lesson slot
    const bookings = await this.getBookings({
      locationIds: [locationId],
      seasonIds: [seasonId],
    });

    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

    // Calculate booked hours per week
    // Each booking is ONE recurring time slot per week
    let totalBookedHours = 0;

    confirmedBookings.forEach((booking) => {
      const startHour = parseInt(booking.startTime.split(':')[0]);
      const startMinute = parseInt(booking.startTime.split(':')[1]);
      const endHour = parseInt(booking.endTime.split(':')[0]);
      const endMinute = parseInt(booking.endTime.split(':')[1]);

      const duration =
        endHour - startHour + (endMinute - startMinute) / 60;

      totalBookedHours += duration;
    });

    const utilizationRate =
      totalAvailableHours > 0 ? totalBookedHours / totalAvailableHours : 0;

    return {
      availableHoursPerWeek: totalAvailableHours,
      bookedHoursPerWeek: totalBookedHours,
      utilizationRate,
      availableSlots,
    };
  }

  /**
   * Get location insights with utilization and revenue data
   */
  async getLocationInsights(
    locationId: string,
    seasonId: string
  ): Promise<LocationInsights | null> {
    const location = await this.getLocation(locationId);
    if (!location) {
      return null;
    }

    const seasons = await this.getSeasons(false);
    const season = seasons.find((s) => s.id === seasonId);
    if (!season) {
      return null;
    }

    // Calculate weekly utilization
    const utilization = await this.calculateWeeklyUtilization(locationId, seasonId);

    // Get bookings for this location and season
    const bookings = await this.getBookings({
      locationIds: [locationId],
      seasonIds: [seasonId],
    });

    // Calculate revenue
    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amountPaid, 0);

    const averageBookingValue =
      bookings.length > 0 ? totalRevenue / bookings.length : 0;

    // Count bookings by status
    const bookingStats = {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
    };

    // Get lessons
    const lessons = await this.getLessons(locationId, seasonId);
    const now = new Date();
    const lessonStats = {
      total: lessons.length,
      completed: lessons.filter((l) => l.status === 'completed').length,
      upcoming: lessons.filter(
        (l) => l.status === 'confirmed' && l.lessonDate > now
      ).length,
      cancelled: lessons.filter((l) => l.status === 'cancelled').length,
    };

    // Determine performance level based on utilization
    let performance: 'excellent' | 'good' | 'fair' | 'poor';
    if (utilization.utilizationRate >= 0.8) {
      performance = 'excellent';
    } else if (utilization.utilizationRate >= 0.6) {
      performance = 'good';
    } else if (utilization.utilizationRate >= 0.4) {
      performance = 'fair';
    } else {
      performance = 'poor';
    }

    return {
      location,
      season,
      utilization,
      revenue: {
        totalRevenue,
        totalBookings: bookings.length,
        averageBookingValue,
      },
      bookings: bookingStats,
      lessons: lessonStats,
      performance,
    };
  }

  /**
   * Get insights for all locations in a season
   */
  async getAllLocationInsights(seasonId: string): Promise<LocationInsights[]> {
    const locations = await this.getLocations();

    const insights: LocationInsights[] = [];
    for (const location of locations) {
      const insight = await this.getLocationInsights(location.id, seasonId);
      if (insight) {
        insights.push(insight);
      }
    }

    return insights;
  }

  /**
   * Get season insights (revenue, bookings, location breakdown)
   */
  async getSeasonInsights(seasonId: string): Promise<SeasonInsights | null> {
    const seasons = await this.getSeasons(false);
    const season = seasons.find((s) => s.id === seasonId);
    if (!season) {
      return null;
    }

    const bookings = await this.getBookings({ seasonIds: [seasonId] });
    const lessons = await this.getLessons(undefined, seasonId);

    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amountPaid, 0);

    const averageBookingValue =
      bookings.length > 0 ? totalRevenue / bookings.length : 0;

    // Group by location
    const locationMap: Record<
      string,
      { locationId: string; locationName: string; revenue: number; bookings: number }
    > = {};

    bookings.forEach((booking) => {
      if (!locationMap[booking.locationId]) {
        locationMap[booking.locationId] = {
          locationId: booking.locationId,
          locationName: booking.locationName,
          revenue: 0,
          bookings: 0,
        };
      }

      if (booking.status === 'confirmed' && booking.paymentStatus === 'paid') {
        locationMap[booking.locationId].revenue += booking.amountPaid;
      }
      locationMap[booking.locationId].bookings += 1;
    });

    const locationBreakdown = Object.values(locationMap).sort(
      (a, b) => b.revenue - a.revenue
    );

    return {
      season,
      totalRevenue,
      totalBookings: bookings.length,
      totalLessons: lessons.length,
      averageBookingValue,
      locationBreakdown,
    };
  }

  /**
   * Get lesson type insights (30min, 45min, 60min breakdown)
   */
  async getLessonTypeInsights(seasonId: string): Promise<LessonTypeInsights[]> {
    const bookings = await this.getBookings({ seasonIds: [seasonId] });

    // Group by lesson duration
    const insights: Map<
      string,
      {
        lessonType: '30min' | '45min' | '60min';
        lessonFormat: 'private' | 'group' | 'semi-private';
        bookingCount: number;
        revenue: number;
        popularityByLocation: Record<string, number>;
      }
    > = new Map();

    bookings.forEach((booking) => {
      // Calculate duration from start/end time
      const startHour = parseInt(booking.startTime.split(':')[0]);
      const startMinute = parseInt(booking.startTime.split(':')[1]);
      const endHour = parseInt(booking.endTime.split(':')[0]);
      const endMinute = parseInt(booking.endTime.split(':')[1]);

      const durationMinutes =
        (endHour - startHour) * 60 + (endMinute - startMinute);

      let lessonType: '30min' | '45min' | '60min';
      if (durationMinutes <= 30) {
        lessonType = '30min';
      } else if (durationMinutes <= 45) {
        lessonType = '45min';
      } else {
        lessonType = '60min';
      }

      const key = `${lessonType}-${booking.lessonType}`;

      if (!insights.has(key)) {
        insights.set(key, {
          lessonType,
          lessonFormat: booking.lessonType as any,
          bookingCount: 0,
          revenue: 0,
          popularityByLocation: {},
        });
      }

      const insight = insights.get(key)!;
      insight.bookingCount += 1;

      if (booking.status === 'confirmed' && booking.paymentStatus === 'paid') {
        insight.revenue += booking.amountPaid;
      }

      insight.popularityByLocation[booking.locationId] =
        (insight.popularityByLocation[booking.locationId] || 0) + 1;
    });

    return Array.from(insights.values())
      .map((insight) => ({
        ...insight,
        averagePrice:
          insight.bookingCount > 0
            ? insight.revenue / insight.bookingCount
            : 0,
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount);
  }

  /**
   * Get complete business snapshot for a season
   */
  async getBusinessSnapshot(seasonId?: string): Promise<BusinessSnapshot> {
    // If no seasonId provided, use the first active season
    let targetSeasonId = seasonId;
    if (!targetSeasonId) {
      const activeSeasons = await this.getSeasons(true);
      if (activeSeasons.length === 0) {
        throw new Error('No active seasons found');
      }
      targetSeasonId = activeSeasons[0].id;
    }

    const seasons = await this.getSeasons(false);
    const activeSeason = seasons.find((s) => s.id === targetSeasonId);
    if (!activeSeason) {
      throw new Error(`Season ${targetSeasonId} not found`);
    }

    const [locationInsights, lessonTypeBreakdown, bookings] = await Promise.all([
      this.getAllLocationInsights(targetSeasonId),
      this.getLessonTypeInsights(targetSeasonId),
      this.getBookings({ seasonIds: [targetSeasonId] }),
    ]);

    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amountPaid, 0);

    const totalBookedHours = locationInsights.reduce(
      (sum, loc) => sum + loc.utilization.bookedHoursPerWeek,
      0
    );
    const totalAvailableHours = locationInsights.reduce(
      (sum, loc) => sum + loc.utilization.availableHoursPerWeek,
      0
    );
    const overallUtilization =
      totalAvailableHours > 0 ? totalBookedHours / totalAvailableHours : 0;

    // Identify underperforming locations (utilization < 40%)
    const underperformingLocations = locationInsights
      .filter((loc) => loc.utilization.utilizationRate < 0.4)
      .sort((a, b) => a.utilization.utilizationRate - b.utilization.utilizationRate);

    // Top performing locations by revenue
    const topLocations = locationInsights
      .filter((loc) => loc.revenue.totalRevenue > 0)
      .sort((a, b) => b.revenue.totalRevenue - a.revenue.totalRevenue)
      .slice(0, 5);

    return {
      timestamp: new Date(),
      activeSeason,
      locations: locationInsights,
      totalRevenue,
      totalBookings: bookings.length,
      overallUtilization,
      underperformingLocations,
      topLocations,
      lessonTypeBreakdown,
    };
  }
}

export default new BusinessIntelligenceService();
