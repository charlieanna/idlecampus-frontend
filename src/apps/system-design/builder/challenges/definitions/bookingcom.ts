import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Booking.com - Hotel Booking Platform
 * Comprehensive FR and NFR scenarios with DDIA/SDP concepts
 *
 * DDIA Concepts Applied (Ch. 2 - Data Models & Ch. 7 - Transactions):
 * - Relational Integrity: Foreign key constraints (hotel → rooms, rooms → bookings)
 * - Cascading Operations: ON DELETE CASCADE for hotel removal
 * - Complex Joins: Multi-table queries for availability checking
 * - ACID Transactions (Ch. 7): Critical for preventing double-bookings
 *   - Atomicity: Booking + payment must succeed/fail together
 *   - Consistency: Room count must always be accurate
 *   - Isolation: Serializable isolation to prevent write skew
 *   - Durability: Confirmed bookings persisted to disk immediately
 *
 * DDIA Ch. 7 - Transaction Isolation Levels:
 * - Read Committed: Prevent dirty reads for room availability
 * - Repeatable Read: Prevent non-repeatable reads during booking process
 * - Serializable: Prevent write skew (two bookings for same room/date)
 *
 * Classic Double-Booking Problem (DDIA Ch. 7):
 * - Two users book last available room simultaneously
 * - Without serializable isolation, both bookings succeed
 * - Solution: SELECT FOR UPDATE or optimistic locking with version numbers
 *
 * System Design Primer Concepts:
 * - Database Constraints: Foreign keys, unique constraints, check constraints
 * - Optimistic Locking: Version field to detect concurrent modifications
 * - Pessimistic Locking: Row-level locks (SELECT FOR UPDATE)
 */
export const bookingcomProblemDefinition: ProblemDefinition = {
  id: 'bookingcom',
  title: 'Booking.com - Hotel Reservations',
  description: `Design a hotel booking platform like Booking.com that:
- Users can search for hotels by location and dates
- Users can view room availability and prices
- Users can book rooms and manage reservations
- Platform handles payments and cancellations

Learning Objectives (DDIA/SDP):
1. Design SQL schema with strong referential integrity (DDIA Ch. 2)
   - Foreign keys: room.hotel_id → hotel.id, booking.room_id → room.id
   - Cascading deletes: Delete hotel → cascade to rooms → cascade to bookings
2. Prevent double-bookings with ACID transactions (DDIA Ch. 7)
   - Serializable isolation level to prevent write skew
   - Pessimistic locking: SELECT FOR UPDATE when checking availability
3. Implement complex availability queries (DDIA Ch. 2)
   - JOIN rooms with bookings to find available rooms for date range
   - Handle overlapping date ranges correctly
4. Handle concurrent booking attempts (DDIA Ch. 7)
   - Optimistic locking with version numbers
   - Retry logic for serialization failures
5. Ensure atomicity for booking + payment (DDIA Ch. 7)
   - Two-phase commit or single transaction for both operations`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search for hotels by location and dates',
    'Users can view room availability and prices',
    'Users can book rooms and manage reservations',
    'Platform handles payments and cancellations'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'No double-bookings: 100% guarantee (DDIA Ch. 7: Serializable isolation)',
    'Booking transaction: ACID compliant (DDIA Ch. 7: Atomicity, Consistency, Isolation, Durability)',
    'Availability query: < 200ms (DDIA Ch. 3: Index on (room_id, check_in, check_out))',
    'Referential integrity: Enforce FK constraints (DDIA Ch. 2: No orphaned bookings)',
    'Concurrent bookings: Handle gracefully (DDIA Ch. 7: Serialization failure retry)',
    'Payment atomicity: Booking + payment in single transaction (DDIA Ch. 7)',
    'Isolation level: Serializable for bookings (DDIA Ch. 7: Prevent write skew)',
    'Scalability: Partition by hotel_id/region (DDIA Ch. 6)',
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
    {
      name: 'Transaction Configuration (DDIA Ch. 7)',
      validate: transactionConfigValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
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
