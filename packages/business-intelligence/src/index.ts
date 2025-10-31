/**
 * @inspired-swim/business-intelligence
 *
 * Business Intelligence package for Inspired Swim Marketing Hub
 * Provides read-only access to Firebase operational data with analytics and insights
 */

// Export all types
export * from './types';

// Export services
export { FirebaseService } from './services/firebase.service';
export { BusinessIntelligenceService } from './services/business-intelligence.service';

// Export utilities
export * from './utils/date.utils';

// Export default service instance for convenience
import businessIntelligenceService from './services/business-intelligence.service';
export default businessIntelligenceService;
