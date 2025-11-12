import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Uber - Ride Sharing Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const uberProblemDefinition: ProblemDefinition = {
  id: 'uber',
  title: 'Uber - Ride Sharing',
  description: `Design a ride-sharing platform like Uber that:
- Riders can request rides
- Drivers can accept ride requests
- Platform matches riders with nearby drivers
- Real-time location tracking during rides`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process ride requests and matching',
      },
      {
        type: 'storage',
        reason: 'Need to store users, rides, payments',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends ride requests and location updates',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write ride data',
      },
    ],
    dataModel: {
      entities: ['rider', 'driver', 'ride', 'location', 'payment'],
      fields: {
        rider: ['id', 'name', 'phone', 'email', 'rating', 'created_at'],
        driver: ['id', 'name', 'phone', 'license', 'vehicle_id', 'rating', 'created_at'],
        ride: ['id', 'rider_id', 'driver_id', 'pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng', 'status', 'fare', 'created_at'],
        location: ['user_id', 'lat', 'lng', 'timestamp'],
        payment: ['id', 'ride_id', 'amount', 'method', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Location updates
        { type: 'geospatial_query', frequency: 'very_high' }, // Finding nearby drivers
        { type: 'read_by_key', frequency: 'high' }, // Getting ride details
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
