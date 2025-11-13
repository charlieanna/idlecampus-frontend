import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Booking.com - Hotel Booking Platform
 * Comprehensive FR and NFR scenarios
 */
export const bookingcomProblemDefinition: ProblemDefinition = {
  id: 'bookingcom',
  title: 'Booking.com - Hotel Reservations',
  description: `Design a hotel booking platform like Booking.com that:
- Users can search for hotels by location and dates
- Users can view room availability and prices
- Users can book rooms and manage reservations
- Platform handles payments and cancellations`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search for hotels by location and dates',
    'Users can view room availability and prices',
    'Users can book rooms and manage reservations'
  ],

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

  scenarios: generateScenarios('bookingcom', problemConfigs.bookingcom),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
hotels = {}
rooms = {}
bookings = {}
users = {}

def search_hotels(location: str, check_in: str, check_out: str) -> List[Dict]:
    """
    FR-1: Users can search for hotels by location and dates
    Naive implementation - simple location string matching, no real availability check
    """
    results = []
    for hotel in hotels.values():
        if location.lower() in hotel['address'].lower():
            results.append(hotel)
    return results

def get_room_availability(hotel_id: str, check_in: str, check_out: str) -> List[Dict]:
    """
    FR-2: Users can view room availability
    Naive implementation - returns all rooms, doesn't check actual bookings
    """
    available_rooms = []
    for room in rooms.values():
        if room['hotel_id'] == hotel_id:
            available_rooms.append(room)
    return available_rooms

def get_room_prices(hotel_id: str) -> List[Dict]:
    """
    FR-2: Users can view room prices
    Naive implementation - returns static prices per room type
    """
    hotel_rooms = []
    for room in rooms.values():
        if room['hotel_id'] == hotel_id:
            hotel_rooms.append({
                'room_id': room['id'],
                'type': room['type'],
                'price_per_night': room['price_per_night']
            })
    return hotel_rooms

def book_room(booking_id: str, room_id: str, user_id: str,
              check_in: str, check_out: str) -> Dict:
    """
    FR-3: Users can book rooms
    Naive implementation - no concurrency control, no double-booking prevention
    """
    room = rooms.get(room_id)
    if not room:
        raise ValueError("Room not found")

    # Calculate total price (simplified)
    check_in_date = datetime.fromisoformat(check_in)
    check_out_date = datetime.fromisoformat(check_out)
    nights = (check_out_date - check_in_date).days
    total_price = room['price_per_night'] * nights

    bookings[booking_id] = {
        'id': booking_id,
        'room_id': room_id,
        'user_id': user_id,
        'check_in': check_in,
        'check_out': check_out,
        'total_price': total_price,
        'status': 'confirmed',
        'created_at': datetime.now()
    }
    return bookings[booking_id]

def manage_reservation(booking_id: str, action: str) -> Dict:
    """
    FR-3: Users can manage reservations (cancel, modify)
    Naive implementation - simple status updates
    """
    booking = bookings.get(booking_id)
    if not booking:
        raise ValueError("Booking not found")

    if action == 'cancel':
        booking['status'] = 'cancelled'
    elif action == 'confirm':
        booking['status'] = 'confirmed'

    return booking

def get_user_bookings(user_id: str) -> List[Dict]:
    """
    FR-3: Users can view their reservations
    Naive implementation - iterates through all bookings
    """
    user_bookings = []
    for booking in bookings.values():
        if booking['user_id'] == user_id:
            user_bookings.append(booking)
    return user_bookings
`,
};
