import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Airbnb - Vacation Rental Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const airbnbProblemDefinition: ProblemDefinition = {
  id: 'airbnb',
  title: 'Airbnb - Vacation Rentals',
  description: `Design a vacation rental platform like Airbnb that:
- Hosts can list properties with photos and details
- Guests can search and book properties
- Platform handles payments and bookings
- Users can leave reviews`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process bookings and searches',
      },
      {
        type: 'storage',
        reason: 'Need to store listings, bookings, users, reviews',
      },
      {
        type: 'object_storage',
        reason: 'Need to store property photos',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write booking data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve photos',
      },
    ],
    dataModel: {
      entities: ['user', 'listing', 'booking', 'review', 'payment'],
      fields: {
        user: ['id', 'name', 'email', 'phone', 'is_host', 'created_at'],
        listing: ['id', 'host_id', 'title', 'description', 'price_per_night', 'lat', 'lng', 'created_at'],
        booking: ['id', 'listing_id', 'guest_id', 'check_in', 'check_out', 'total_price', 'status', 'created_at'],
        review: ['id', 'booking_id', 'reviewer_id', 'rating', 'comment', 'created_at'],
        payment: ['id', 'booking_id', 'amount', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Search by location
        { type: 'write', frequency: 'high' },        // Creating bookings
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing listings
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        geospatialQueries: true,
        avgFileSize: 3, // 3MB photos
      },
      passCriteria: {
        maxLatency: 30000,
        maxErrorRate: 0.99,
      },
    },
  ],

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
