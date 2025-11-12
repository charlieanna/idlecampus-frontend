import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Weather API - Weather Data Service
 * Level 1 ONLY: Brute force connectivity test
 */
export const weatherapiProblemDefinition: ProblemDefinition = {
  id: 'weatherapi',
  title: 'Weather API - Weather Data Service',
  description: `Design a weather data API service that:
- Users can query current weather by location
- API provides forecasts for upcoming days
- Platform ingests data from weather stations
- Supports high-volume read traffic`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests',
      },
      {
        type: 'storage',
        reason: 'Need to store weather data and forecasts',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends weather query requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read weather data',
      },
    ],
    dataModel: {
      entities: ['location', 'current_weather', 'forecast', 'station'],
      fields: {
        location: ['id', 'city', 'country', 'lat', 'lng', 'timezone'],
        current_weather: ['location_id', 'temperature', 'humidity', 'wind_speed', 'conditions', 'updated_at'],
        forecast: ['id', 'location_id', 'date', 'high_temp', 'low_temp', 'conditions', 'created_at'],
        station: ['id', 'location_id', 'name', 'last_report', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Querying weather by location
        { type: 'geospatial_query', frequency: 'high' }, // Finding nearest station
        { type: 'write', frequency: 'high' },        // Ingesting weather data
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.9, // Very read-heavy
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
