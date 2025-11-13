import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Uber - Ride Sharing Platform
 * Comprehensive FR and NFR scenarios
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

  scenarios: generateScenarios('uber', problemConfigs.uber),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Tuple

# In-memory storage (naive implementation)
riders = {}
drivers = {}
rides = {}
locations = {}
payments = {}

def request_ride(ride_id: str, rider_id: str, pickup_lat: float, pickup_lng: float, dropoff_lat: float, dropoff_lng: float) -> Dict:
    """
    Riders can request rides
    Naive implementation - creates ride request
    """
    rides[ride_id] = {
        'id': ride_id,
        'rider_id': rider_id,
        'driver_id': None,
        'pickup_lat': pickup_lat,
        'pickup_lng': pickup_lng,
        'dropoff_lat': dropoff_lat,
        'dropoff_lng': dropoff_lng,
        'status': 'requested',
        'fare': 0,
        'created_at': datetime.now()
    }
    return rides[ride_id]

def accept_ride(ride_id: str, driver_id: str) -> Dict:
    """
    Drivers can accept ride requests
    Naive implementation - assigns driver to ride
    """
    if ride_id in rides:
        rides[ride_id]['driver_id'] = driver_id
        rides[ride_id]['status'] = 'accepted'
        return rides[ride_id]
    return None

def find_nearby_drivers(lat: float, lng: float, max_distance: float = 5.0) -> List[Dict]:
    """
    Platform matches riders with nearby drivers
    Naive implementation - returns all drivers (no geospatial calculation)
    Real system would use geospatial indexing
    """
    # In real system, would calculate distance and filter
    available_drivers = []
    for driver in drivers.values():
        if driver.get('status') == 'available':
            available_drivers.append(driver)
    return available_drivers

def update_location(user_id: str, lat: float, lng: float, user_type: str = "driver") -> Dict:
    """
    Real-time location tracking during rides
    Naive implementation - stores latest location
    """
    location_id = f"{user_id}_{datetime.now().timestamp()}"
    locations[location_id] = {
        'user_id': user_id,
        'user_type': user_type,
        'lat': lat,
        'lng': lng,
        'timestamp': datetime.now()
    }
    return locations[location_id]

def complete_ride(ride_id: str, fare: float) -> Dict:
    """
    Complete a ride and process payment
    Naive implementation - updates ride status and creates payment
    """
    if ride_id in rides:
        rides[ride_id]['status'] = 'completed'
        rides[ride_id]['fare'] = fare
        rides[ride_id]['completed_at'] = datetime.now()

        # Create payment
        payment_id = f"payment_{ride_id}"
        payments[payment_id] = {
            'id': payment_id,
            'ride_id': ride_id,
            'amount': fare,
            'method': 'card',
            'status': 'completed',
            'created_at': datetime.now()
        }

        return rides[ride_id]
    return None

def get_ride_history(rider_id: str) -> List[Dict]:
    """
    Get ride history for a rider
    Naive implementation - returns all rides for rider
    """
    rider_rides = []
    for ride in rides.values():
        if ride['rider_id'] == rider_id:
            rider_rides.append(ride)
    rider_rides.sort(key=lambda x: x['created_at'], reverse=True)
    return rider_rides
`,
};
