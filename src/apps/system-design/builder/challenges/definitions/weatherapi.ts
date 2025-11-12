import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Weather API - Weather Data Service
 * Comprehensive FR and NFR scenarios
 */
export const weatherapiProblemDefinition: ProblemDefinition = {
  id: 'weatherapi',
  title: 'Weather API - Weather Data Service',
  description: `Design a weather data API service that:
- Users can query current weather by location
- API provides forecasts for upcoming days
- Platform ingests data from weather stations
- Supports high-volume read traffic`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can query current weather by location',
    'Supports high-volume read traffic'
  ],

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

  scenarios: generateScenarios('weatherapi', problemConfigs.weatherapi),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
