import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * DoorDash - Food Delivery Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const doordashProblemDefinition: ProblemDefinition = {
  id: 'doordash',
  title: 'DoorDash - Food Delivery',
  description: `Design a food delivery platform like DoorDash that:
- Customers can browse restaurants and order food
- Platform matches orders with nearby dashers (drivers)
- Real-time tracking of delivery status
- Restaurants receive and manage orders`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process orders and driver matching',
      },
      {
        type: 'storage',
        reason: 'Need to store orders, restaurants, drivers, customers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends orders and location updates',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store order data',
      },
    ],
    dataModel: {
      entities: ['customer', 'restaurant', 'driver', 'order', 'menu_item'],
      fields: {
        customer: ['id', 'name', 'phone', 'address', 'created_at'],
        restaurant: ['id', 'name', 'address', 'lat', 'lng', 'rating', 'created_at'],
        driver: ['id', 'name', 'phone', 'current_lat', 'current_lng', 'status', 'created_at'],
        order: ['id', 'customer_id', 'restaurant_id', 'driver_id', 'status', 'total', 'created_at'],
        menu_item: ['id', 'restaurant_id', 'name', 'price', 'description', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Finding nearby restaurants/drivers
        { type: 'write', frequency: 'high' },        // Creating orders
        { type: 'read_by_key', frequency: 'very_high' }, // Order tracking
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
