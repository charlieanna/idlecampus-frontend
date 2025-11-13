import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Ticketmaster - Event Ticketing Platform
 * Comprehensive FR and NFR scenarios
 */
export const ticketmasterProblemDefinition: ProblemDefinition = {
  id: 'ticketmaster',
  title: 'Ticketmaster - Event Ticketing',
  description: `Design an event ticketing platform like Ticketmaster that:
- Users can browse and search for events
- Users can purchase tickets with seat selection
- Platform prevents double-booking of seats
- Tickets are delivered digitally`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse and search for events',
    'Users can purchase tickets with seat selection'
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

  scenarios: generateScenarios('ticketmaster', problemConfigs.ticketmaster),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
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
