import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Ticketmaster - Event Ticketing Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const ticketmasterProblemDefinition: ProblemDefinition = {
  id: 'ticketmaster',
  title: 'Ticketmaster - Event Ticketing',
  description: `Design an event ticketing platform like Ticketmaster that:
- Users can browse and search for events
- Users can purchase tickets with seat selection
- Platform prevents double-booking of seats
- Tickets are delivered digitally`,

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

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
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
