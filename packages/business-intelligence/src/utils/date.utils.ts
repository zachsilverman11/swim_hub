import { DateRange } from '../types';

/**
 * Date utility functions for business intelligence calculations
 */

/**
 * Get the start and end of the current week
 */
export function getCurrentWeek(): DateRange {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get the start and end of the current month
 */
export function getCurrentMonth(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get the start and end of the current quarter
 */
export function getCurrentQuarter(): DateRange {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const startDate = new Date(now.getFullYear(), quarter * 3, 1);
  const endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get the start and end of the current year
 */
export function getCurrentYear(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Get date range for last N days
 */
export function getLastNDays(days: number): DateRange {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

/**
 * Calculate hours between two dates
 */
export function calculateHoursBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

/**
 * Get day of week from date (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Get day name from date
 */
export function getDayName(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Check if date is within range
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  return date >= range.startDate && date <= range.endDate;
}

/**
 * Calculate business hours for a location in a given date range
 */
export function calculateAvailableHours(
  operatingHours: { [day: string]: { open: string; close: string } | null },
  dateRange: DateRange
): number {
  let totalHours = 0;
  const currentDate = new Date(dateRange.startDate);

  while (currentDate <= dateRange.endDate) {
    const dayName = getDayName(currentDate);
    const hours = operatingHours[dayName];

    if (hours) {
      const [openHour, openMinute] = hours.open.split(':').map(Number);
      const [closeHour, closeMinute] = hours.close.split(':').map(Number);

      const openTime = openHour + openMinute / 60;
      const closeTime = closeHour + closeMinute / 60;

      totalHours += closeTime - openTime;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalHours;
}
