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
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Booking.com - Hotel Booking Platform
 * DDIA Ch. 7 (Transactions) - CANONICAL EXAMPLE for Double-Booking Prevention
 *
 * DDIA Concepts Applied:
 * - Ch. 7: Serializable isolation to prevent double-booking write skew
 *   - Two users booking last available room for same dates
 *   - Both check availability, both see room available, both book → CONFLICT!
 *   - Solution: SELECT FOR UPDATE or unique constraint on (room_id, date_range)
 * - Ch. 7: ACID transactions for booking + payment atomicity
 *   - Atomicity: Both booking and payment succeed or both fail
 *   - Consistency: Room inventory always accurate
 *   - Isolation: Concurrent bookings don't interfere
 *   - Durability: Confirmed bookings persisted immediately
 * - Ch. 7: Optimistic locking for concurrent booking attempts
 *   - Version field on room availability
 *   - Booking only succeeds if version unchanged
 *   - Retry logic on conflict
 * - Ch. 7: Pessimistic locking with SELECT FOR UPDATE
 *   - Lock room row during booking process
 *   - Other transactions wait until lock released
 *   - Prevents concurrent modifications
 * - Ch. 7: Temporal overlap queries for date range conflicts
 *   - Check if (check_in, check_out) overlaps with existing bookings
 *   - SQL: WHERE NOT (new_checkout <= existing_checkin OR new_checkin >= existing_checkout)
 *
 * Double-Booking Problem (DDIA Ch. 7 - Write Skew):
 * Scenario: Room 101 available for Dec 15-17, two users try to book simultaneously
 *
 * Without Serializable Isolation:
 * T1: SELECT COUNT(*) FROM bookings
 *     WHERE room_id = 101 AND check_in < '2024-12-17' AND check_out > '2024-12-15'  -- Returns 0
 * T2: SELECT COUNT(*) FROM bookings
 *     WHERE room_id = 101 AND check_in < '2024-12-17' AND check_out > '2024-12-15'  -- Returns 0
 * T1: INSERT INTO bookings (room_id, user_id, check_in, check_out)
 *     VALUES (101, 'user_1', '2024-12-15', '2024-12-17')
 * T2: INSERT INTO bookings (room_id, user_id, check_in, check_out)
 *     VALUES (101, 'user_2', '2024-12-15', '2024-12-17')
 * → BOTH SUCCEED! Double-booking occurred.
 *
 * Solution 1: Pessimistic Locking (SELECT FOR UPDATE)
 * BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
 * SELECT * FROM rooms WHERE id = 101 FOR UPDATE;  -- Exclusive lock on room
 * SELECT COUNT(*) FROM bookings
 *   WHERE room_id = 101 AND check_in < '2024-12-17' AND check_out > '2024-12-15';
 * IF (count == 0) THEN
 *   INSERT INTO bookings (room_id, user_id, check_in, check_out) VALUES (...);
 *   COMMIT;
 * ELSE
 *   ROLLBACK;  -- Room already booked
 * END IF;
 *
 * T1 acquires lock → T2 waits → T1 commits → T2 sees room booked → T2 rollback
 *
 * Solution 2: Unique Constraint with Exclusion (PostgreSQL)
 * CREATE EXTENSION btree_gist;
 * CREATE TABLE bookings (
 *   id SERIAL PRIMARY KEY,
 *   room_id INT NOT NULL,
 *   user_id INT NOT NULL,
 *   check_in DATE NOT NULL,
 *   check_out DATE NOT NULL,
 *   status VARCHAR(20),
 *   EXCLUDE USING gist (room_id WITH =, daterange(check_in, check_out) WITH &&)
 *     WHERE (status != 'cancelled')
 * );
 * -- Second concurrent booking fails with exclusion constraint violation
 *
 * Solution 3: Optimistic Locking with Version Numbers
 * rooms table: [id, hotel_id, type, available_count, version]
 *
 * BEGIN TRANSACTION;
 * SELECT available_count, version FROM rooms WHERE id = 101;  -- available=1, version=10
 * IF (available_count > 0) THEN
 *   INSERT INTO bookings (room_id, user_id, check_in, check_out) VALUES (...);
 *   UPDATE rooms SET available_count = available_count - 1, version = version + 1
 *     WHERE id = 101 AND version = 10;
 *   IF (affected_rows == 0) THEN ROLLBACK;  -- Version changed, retry
 *   COMMIT;
 * END IF;
 *
 * Temporal Overlap Query (DDIA Ch. 7):
 * Check if new booking (2024-12-15 to 2024-12-17) conflicts with existing bookings:
 *
 * SELECT * FROM bookings
 *   WHERE room_id = 101
 *   AND status != 'cancelled'
 *   AND NOT (
 *     check_out <= '2024-12-15'  -- Existing booking ends before new booking starts
 *     OR check_in >= '2024-12-17'  -- Existing booking starts after new booking ends
 *   );
 * -- Returns conflicting bookings, if any
 *
 * ACID Transaction Example (DDIA Ch. 7):
 * BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
 * -- Step 1: Lock room and check availability
 * SELECT * FROM rooms WHERE id = 101 FOR UPDATE;
 * SELECT COUNT(*) FROM bookings
 *   WHERE room_id = 101 AND check_in < ? AND check_out > ? AND status != 'cancelled';
 * IF (count == 0) THEN
 *   -- Step 2: Create booking
 *   INSERT INTO bookings (room_id, user_id, check_in, check_out, total_price, status)
 *     VALUES (101, 'user_1', '2024-12-15', '2024-12-17', 299.99, 'pending');
 *   -- Step 3: Process payment (could be external service)
 *   payment_result = payment_service.charge(user_id='user_1', amount=299.99);
 *   IF (payment_result.success) THEN
 *     UPDATE bookings SET status = 'confirmed' WHERE id = NEW_BOOKING_ID;
 *     COMMIT;  -- Both booking and payment succeed
 *   ELSE
 *     ROLLBACK;  -- Payment failed, cancel booking
 *   END IF;
 * END IF;
 *
 * Isolation Levels by Operation (DDIA Ch. 7):
 * - Search hotels: Read Committed (allow concurrent updates, fast)
 * - View room details: Read Committed (stale price OK)
 * - Book room: Serializable (prevent double-booking, critical)
 * - View booking history: Read Committed (eventual consistency OK)
 *
 * System Design Primer Concepts:
 * - Foreign Keys: Referential integrity (room.hotel_id → hotel.id)
 * - Unique Constraints: Prevent duplicate bookings
 * - Exclusion Constraints: PostgreSQL temporal overlap prevention
 * - Pessimistic Locking: SELECT FOR UPDATE
 * - Optimistic Locking: Version field for conflict detection
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
    'No double-bookings: 100% guarantee (DDIA Ch. 7: SELECT FOR UPDATE + Serializable)',
    'Write skew prevention: Date range overlap check (DDIA Ch. 7: Temporal query)',
    'Booking transaction: ACID compliant (DDIA Ch. 7: Atomicity, Consistency, Isolation, Durability)',
    'Pessimistic locking: Lock room during checkout (DDIA Ch. 7: Exclusive lock)',
    'Optimistic locking: Version-based conflict detection (DDIA Ch. 7: Retry on version mismatch)',
    'Temporal overlap: Exclusion constraint on date range (DDIA Ch. 7: PostgreSQL GIST)',
    'Payment atomicity: Booking + payment in single txn (DDIA Ch. 7: Rollback on payment failure)',
    'Isolation level: Serializable for bookings (DDIA Ch. 7: Prevent concurrent conflicts)',
    'Concurrent bookings: Handle gracefully (DDIA Ch. 7: Serialization failure retry)',
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

// Auto-generate code challenges from functional requirements
(bookingcomProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(bookingcomProblemDefinition);
