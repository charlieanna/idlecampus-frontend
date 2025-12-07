import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';
import { doordashGuidedTutorial } from './doordashGuided';

/**
 * DoorDash - Food Delivery Platform
 * Comprehensive FR and NFR scenarios
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

  scenarios: generateScenarios('doordash', problemConfigs.doordash, [
    'Customers can browse restaurants and order food',
    'Platform matches orders with nearby dashers (drivers)',
    'Real-time tracking of delivery status'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Customers can browse restaurants and order food',
    'Platform matches orders with nearby dashers (drivers)',
    'Real-time tracking of delivery status'
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
restaurants = {}
menu_items = {}
customers = {}
drivers = {}
orders = {}

def browse_restaurants(customer_lat: float, customer_lng: float) -> List[Dict]:
    """
    FR-1: Customers can browse restaurants
    Naive implementation - returns all restaurants, no real distance calculation
    """
    return list(restaurants.values())

def get_menu(restaurant_id: str) -> List[Dict]:
    """
    FR-1: Customers can view menu items
    Naive implementation - returns all items for a restaurant
    """
    items = []
    for item in menu_items.values():
        if item['restaurant_id'] == restaurant_id:
            items.append(item)
    return items

def place_order(order_id: str, customer_id: str, restaurant_id: str,
                items: List[str]) -> Dict:
    """
    FR-1: Customers can order food
    Naive implementation - creates order without validation
    """
    # Calculate total (simplified)
    total = 0
    for item_id in items:
        item = menu_items.get(item_id)
        if item:
            total += item['price']

    orders[order_id] = {
        'id': order_id,
        'customer_id': customer_id,
        'restaurant_id': restaurant_id,
        'driver_id': None,
        'items': items,
        'total': total,
        'status': 'pending',
        'created_at': datetime.now()
    }
    return orders[order_id]

def match_driver(order_id: str) -> Optional[Dict]:
    """
    FR-2: Platform matches orders with nearby dashers
    Naive implementation - assigns first available driver
    """
    order = orders.get(order_id)
    if not order:
        return None

    # Find available driver
    for driver in drivers.values():
        if driver['status'] == 'available':
            driver['status'] = 'busy'
            order['driver_id'] = driver['id']
            order['status'] = 'assigned'
            return {
                'order_id': order_id,
                'driver_id': driver['id'],
                'driver_name': driver['name']
            }
    return None

def update_order_status(order_id: str, status: str) -> Dict:
    """
    FR-3: Real-time tracking of delivery status
    Naive implementation - simple status update
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    order['status'] = status
    order['updated_at'] = datetime.now()
    return order

def get_order_status(order_id: str) -> Dict:
    """
    FR-3: Track delivery status
    Naive implementation - returns current order state
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    driver_location = None
    if order['driver_id']:
        driver = drivers.get(order['driver_id'])
        if driver:
            driver_location = {
                'lat': driver.get('current_lat'),
                'lng': driver.get('current_lng')
            }

    return {
        'order_id': order['id'],
        'status': order['status'],
        'driver_location': driver_location
    }
`,

  guidedTutorial: doordashGuidedTutorial,
};

// Auto-generate code challenges from functional requirements
(doordashProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(doordashProblemDefinition);
