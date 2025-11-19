import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Ticketmaster - Event Ticketing Platform
 * DDIA Ch. 7 (Transactions) - CANONICAL EXAMPLE for Preventing Double-Booking
 *
 * DDIA Concepts Applied:
 * - Ch. 7: Pessimistic locking (SELECT FOR UPDATE) to prevent double-booking
 *   - Lock seat row when user attempts to purchase
 *   - Other transactions wait until lock is released
 *   - Prevents write skew (two users buying same seat)
 * - Ch. 7: Snapshot isolation for browsing available seats
 *   - Users see consistent seat map during selection
 *   - Prevents phantom reads (seats disappearing mid-selection)
 * - Ch. 7: Optimistic locking alternative with version numbers
 *   - seat.version incremented on each booking
 *   - Purchase fails if version changed (retry logic)
 * - Ch. 7: Serializable isolation for high-demand events
 *   - Prevent write skew when last seat is purchased
 *   - Two concurrent purchases: only one succeeds
 * - Ch. 7: Temporary seat reservations with timeout
 *   - Reserve seat for 10 minutes during checkout
 *   - Release if payment not completed (compensating transaction)
 *
 * Write Skew Problem (DDIA Ch. 7 - Classic Example):
 * Scenario: Last seat available, two users try to buy simultaneously
 *
 * Without Serializable Isolation:
 * T1: SELECT COUNT(*) FROM tickets WHERE seat_id = 'A1' AND status = 'sold'  -- Returns 0
 * T2: SELECT COUNT(*) FROM tickets WHERE seat_id = 'A1' AND status = 'sold'  -- Returns 0
 * T1: INSERT INTO tickets (seat_id, user_id, status) VALUES ('A1', 'user_1', 'sold')
 * T2: INSERT INTO tickets (seat_id, user_id, status) VALUES ('A1', 'user_2', 'sold')
 * → BOTH SUCCEED! Double-booking occurred.
 *
 * Solution 1: Pessimistic Locking (SELECT FOR UPDATE)
 * BEGIN TRANSACTION;
 * SELECT * FROM seats WHERE id = 'A1' FOR UPDATE;  -- Exclusive lock
 * -- Check if seat is available
 * INSERT INTO tickets (seat_id, user_id, status) VALUES ('A1', user_id, 'sold');
 * COMMIT;
 *
 * T1 acquires lock → T2 waits → T1 commits → T2 fails (seat unavailable)
 *
 * Solution 2: Optimistic Locking (Version Numbers)
 * Seats table: [id, section, row, number, version, last_updated]
 *
 * BEGIN TRANSACTION;
 * SELECT version FROM seats WHERE id = 'A1';  -- Read version = 5
 * INSERT INTO tickets (seat_id, user_id);
 * UPDATE seats SET version = version + 1, last_updated = NOW()
 *   WHERE id = 'A1' AND version = 5;  -- Only succeeds if version unchanged
 * IF (affected_rows == 0) THEN ROLLBACK;  -- Version changed, retry
 * COMMIT;
 *
 * Solution 3: Unique Constraint (Database-level)
 * CREATE UNIQUE INDEX ON tickets (seat_id, event_id) WHERE status != 'cancelled';
 * -- Second concurrent insert fails with unique constraint violation
 *
 * Temporary Reservation Pattern (DDIA Ch. 7):
 * Step 1: Reserve seat (status = 'reserved', reserved_until = NOW() + 10 minutes)
 * Step 2: User completes payment within 10 minutes
 * Step 3a: Payment success → UPDATE status = 'sold'
 * Step 3b: Payment timeout → Compensating transaction: UPDATE status = 'available'
 *
 * Isolation Levels for Different Operations (DDIA Ch. 7):
 * - Browse seats: Read Committed (fast, allow dirty reads OK)
 * - Select seat: Snapshot Isolation (consistent view during selection)
 * - Purchase seat: Serializable (prevent double-booking, critical)
 * - View ticket history: Read Committed (eventual consistency OK)
 *
 * System Design Primer Concepts:
 * - Database Constraints: Unique constraint on (seat_id, event_id)
 * - Pessimistic Locking: SELECT FOR UPDATE
 * - Optimistic Locking: Version field
 */
export const ticketmasterProblemDefinition: ProblemDefinition = {
  id: 'ticketmaster',
  title: 'Ticketmaster - Event Ticketing',
  description: `Design an event ticketing platform like Ticketmaster with strong consistency guarantees.

Critical Requirement: Prevent double-booking at all costs. Two users must never be able to purchase the same seat.

The system must handle high-demand ticket drops where thousands of users compete for limited inventory. During checkout, seats are temporarily reserved with a timeout mechanism.

Requirements:
• Users browse and search for events
• Users purchase tickets with seat selection
• Platform prevents double-booking (100% guarantee)
• Temporary seat reservations expire after timeout
• Handle payment failures with compensating transactions
• Maintain consistency during high-concurrency scenarios`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse and search for events',
    'Users can purchase tickets with seat selection'
  ],

  userFacingNFRs: [
    'No double-booking: 100% guarantee',
    'Purchase latency: p99 < 500ms',
    'Concurrent bookings: Handle gracefully with retries',
    'Temporary reservation: 10-minute timeout',
    'Seat availability: Consistent view during selection',
    'Payment failures: Automatic rollback',
    'High concurrency: Support 1000+ simultaneous purchase attempts',
    'Availability: 99.95% uptime',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process ticket purchases and seat allocation',
      },
      {
        type: 'storage',
        reason: 'Need to store events, tickets, users, inventory',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends ticket purchase requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store ticket data',
      },
    ],
    dataModel: {
      entities: ['user', 'event', 'venue', 'ticket', 'seat'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        event: ['id', 'venue_id', 'name', 'date', 'category', 'created_at'],
        venue: ['id', 'name', 'address', 'capacity', 'created_at'],
        ticket: ['id', 'event_id', 'user_id', 'seat_id', 'price', 'status', 'purchased_at'],
        seat: ['id', 'venue_id', 'section', 'row', 'number', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Searching events
        { type: 'write', frequency: 'very_high' },    // Purchasing tickets (high concurrency)
        { type: 'read_by_key', frequency: 'very_high' }, // Checking seat availability
      ],
    },
  },

  scenarios: generateScenarios('ticketmaster', problemConfigs.ticketmaster, [
    'Users can browse and search for events',
    'Users can purchase tickets with seat selection'
  ]),

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
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
events = {}
venues = {}
seats = {}
tickets = {}

def search_events(query: str = None, category: str = None, city: str = None) -> List[Dict]:
    """
    FR-1: Users can browse and search for events
    Naive implementation - simple text matching
    """
    results = []
    for event in events.values():
        if query and query.lower() not in event['name'].lower():
            continue
        if category and event.get('category') != category:
            continue
        # In a real system, would match city via venue
        results.append(event)
    return results

def get_available_seats(event_id: str) -> List[Dict]:
    """
    FR-2: View available seats for an event
    Naive implementation - returns seats not in tickets
    """
    event = events.get(event_id)
    if not event:
        raise ValueError("Event not found")

    venue_id = event['venue_id']

    # Find all seats for venue
    venue_seats = []
    for seat in seats.values():
        if seat['venue_id'] == venue_id:
            venue_seats.append(seat)

    # Filter out sold seats
    sold_seat_ids = set()
    for ticket in tickets.values():
        if ticket['event_id'] == event_id and ticket['status'] in ['sold', 'reserved']:
            sold_seat_ids.add(ticket['seat_id'])

    available = [s for s in venue_seats if s['id'] not in sold_seat_ids]
    return available

def purchase_ticket(ticket_id: str, event_id: str, user_id: str, seat_id: str,
                    price: float) -> Dict:
    """
    FR-2: Users can purchase tickets with seat selection
    Naive implementation - no double-booking prevention
    """
    # Check if seat is available (naive check)
    for ticket in tickets.values():
        if ticket['event_id'] == event_id and ticket['seat_id'] == seat_id:
            if ticket['status'] in ['sold', 'reserved']:
                raise ValueError("Seat already taken")

    tickets[ticket_id] = {
        'id': ticket_id,
        'event_id': event_id,
        'user_id': user_id,
        'seat_id': seat_id,
        'price': price,
        'status': 'sold',
        'purchased_at': datetime.now()
    }
    return tickets[ticket_id]

def get_user_tickets(user_id: str) -> List[Dict]:
    """
    Helper: Get all tickets for a user
    Naive implementation - returns user's tickets
    """
    user_tickets = []
    for ticket in tickets.values():
        if ticket['user_id'] == user_id:
            user_tickets.append(ticket)
    return user_tickets
`,
};

// Auto-generate code challenges from functional requirements
(ticketmasterProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(ticketmasterProblemDefinition);
