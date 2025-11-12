import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Airbnb - Vacation Rental Platform
 * Comprehensive FR and NFR scenarios
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

  scenarios: generateScenarios('airbnb', problemConfigs.airbnb),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
