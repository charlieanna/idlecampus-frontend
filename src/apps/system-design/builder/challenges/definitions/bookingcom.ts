import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Booking.com - Hotel Booking Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const bookingcomProblemDefinition: ProblemDefinition = {
  id: 'bookingcom',
  title: 'Booking.com - Hotel Reservations',
  description: `Design a hotel booking platform like Booking.com that:
- Users can search for hotels by location and dates
- Users can view room availability and prices
- Users can book rooms and manage reservations
- Platform handles payments and cancellations`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process searches and bookings',
      },
      {
        type: 'storage',
        reason: 'Need to store hotels, rooms, bookings, users',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends search and booking requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store booking data',
      },
    ],
    dataModel: {
      entities: ['user', 'hotel', 'room', 'booking', 'review'],
      fields: {
        user: ['id', 'email', 'name', 'phone', 'created_at'],
        hotel: ['id', 'name', 'address', 'lat', 'lng', 'rating', 'created_at'],
        room: ['id', 'hotel_id', 'type', 'price_per_night', 'max_occupancy', 'created_at'],
        booking: ['id', 'room_id', 'user_id', 'check_in', 'check_out', 'total_price', 'status', 'created_at'],
        review: ['id', 'hotel_id', 'user_id', 'rating', 'comment', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Searching hotels by location
        { type: 'write', frequency: 'high' },        // Creating bookings
        { type: 'read_by_query', frequency: 'very_high' }, // Checking availability
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        geospatialQueries: true,
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
