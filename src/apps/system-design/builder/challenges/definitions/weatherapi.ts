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

  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
locations = {}
current_weather = {}
forecasts = {}
stations = {}

def query_weather(location_id: str) -> Optional[Dict]:
    """
    FR-1: Users can query current weather by location
    Naive implementation - returns cached weather data
    """
    weather = current_weather.get(location_id)
    if not weather:
        return None

    location = locations.get(location_id)
    return {
        'location': location,
        'temperature': weather['temperature'],
        'humidity': weather['humidity'],
        'wind_speed': weather['wind_speed'],
        'conditions': weather['conditions'],
        'updated_at': weather['updated_at']
    }

def get_forecast(location_id: str, days: int = 7) -> List[Dict]:
    """
    Helper: Get weather forecast for upcoming days
    Naive implementation - returns stored forecasts
    """
    location_forecasts = []
    for forecast in forecasts.values():
        if forecast['location_id'] == location_id:
            location_forecasts.append(forecast)

    # Sort by date
    location_forecasts.sort(key=lambda x: x['date'])
    return location_forecasts[:days]

def ingest_weather_data(location_id: str, temperature: float, humidity: int,
                        wind_speed: float, conditions: str, station_id: str = None) -> Dict:
    """
    Helper: Ingest data from weather stations
    Naive implementation - updates current weather
    """
    current_weather[location_id] = {
        'location_id': location_id,
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'conditions': conditions,
        'station_id': station_id,
        'updated_at': datetime.now()
    }

    # Update station last report time
    if station_id and station_id in stations:
        stations[station_id]['last_report'] = datetime.now()

    return current_weather[location_id]

def create_forecast(forecast_id: str, location_id: str, date: str,
                    high_temp: float, low_temp: float, conditions: str) -> Dict:
    """
    Helper: Create forecast entry
    Naive implementation - stores forecast
    """
    forecasts[forecast_id] = {
        'id': forecast_id,
        'location_id': location_id,
        'date': date,
        'high_temp': high_temp,
        'low_temp': low_temp,
        'conditions': conditions,
        'created_at': datetime.now()
    }
    return forecasts[forecast_id]

def handle_high_volume_request(location_id: str) -> Dict:
    """
    FR-2: Supports high-volume read traffic
    Naive implementation - same as query_weather, would use caching in production
    """
    return query_weather(location_id)
`,
};
