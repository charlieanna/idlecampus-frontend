import { GuidedTutorial } from '../../types/guidedTutorial';

export const ticketmasterProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'ticketmaster-progressive-guided',
  title: 'Design Ticketmaster - Progressive Journey',
  description: 'Build a ticket booking platform that evolves from basic reservations to handling massive flash sales with millions competing for limited inventory',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Ticketmaster',
    description: 'An event ticketing platform enabling users to browse events, select seats, and purchase tickets for concerts, sports, and shows',
    requirements: [
      'Browse and search events by date, location, and category',
      'View venue seating charts with available seats',
      'Reserve seats temporarily during checkout',
      'Process payments and issue tickets',
      'Handle high-demand on-sales (flash sales)',
      'Support ticket transfers and resale'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new ticketing platform'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Ticketing',
      description: 'Your startup "QuickTix" is building a ticketing platform. Users need to browse events and buy tickets. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Seat Selection & Checkout',
      description: 'QuickTix has 1M users! They want to pick specific seats and checkout smoothly. Time to add seat maps and reservation holds.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Flash Sales',
      description: 'QuickTix is selling Taylor Swift tickets - 1 million users competing for 50,000 seats in seconds. Build for extreme concurrency.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Resale & Intelligence',
      description: 'QuickTix is competing with Ticketmaster. Time to add verified resale, dynamic pricing, and fraud prevention.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC TICKETING ==============
    {
      id: 'step-1',
      title: 'Event & Inventory Model',
      phase: 'phase-1-beginner',
      description: 'Design the data model for events, venues, and ticket inventory',
      order: 1,

      educationalContent: {
        title: 'Modeling Events and Tickets',
        explanation: `Ticketing systems have complex relationships between events, venues, sections, rows, and individual seats.

**Core Models:**
\`\`\`typescript
interface Event {
  id: string;
  name: string;
  description: string;
  artistId?: string;
  venueId: string;
  category: 'concert' | 'sports' | 'theater' | 'comedy';
  dateTime: Date;
  doorsOpen: Date;
  status: 'scheduled' | 'on_sale' | 'sold_out' | 'cancelled';
  saleStartDate: Date;
  presaleStartDate?: Date;
  imageUrl: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  seatingChartId: string;
  sections: Section[];
}

interface Section {
  id: string;
  venueId: string;
  name: string;          // "Floor", "Section 101"
  type: 'seated' | 'general_admission';
  rows: Row[];
}

interface Seat {
  id: string;
  sectionId: string;
  rowName: string;       // "A", "B", "AA"
  seatNumber: number;
  coordinates: { x: number; y: number };  // For seating chart
  accessible: boolean;
}
\`\`\`

**Ticket Inventory:**
\`\`\`typescript
interface TicketInventory {
  id: string;
  eventId: string;
  seatId: string;
  priceLevel: string;    // "VIP", "Premium", "Standard"
  price: number;
  fees: number;
  status: 'available' | 'held' | 'sold' | 'reserved';
  holdExpiresAt?: Date;
  holderId?: string;
  orderId?: string;
}
\`\`\`

**Pricing Tiers:**
Same section can have different prices:
- Early bird pricing
- VIP packages
- Accessible seating
- Obstructed view discounts`,
        keyInsight: 'Ticket inventory connects events to specific seats with pricing - the status field tracks the lifecycle from available through held to sold',
        commonMistakes: [
          'Not separating venue from event (venues host many events)',
          'Missing seat coordinates for interactive maps',
          'No distinction between hold and sold states'
        ],
        interviewTips: [
          'Explain the venue → section → row → seat hierarchy',
          'Discuss the ticket status lifecycle',
          'Mention GA vs seated inventory differences'
        ],
        realWorldExample: 'Madison Square Garden hosts 300+ events per year. The venue seating chart is reused, but each event has its own ticket inventory with different pricing.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Event Service', 'Venue Service', 'Inventory Service', 'Event Database'],

      hints: [
        { trigger: 'stuck', content: 'Events happen at venues. Venues have sections with seats. Ticket inventory connects events to seats.' },
        { trigger: 'event_venue_merged', content: 'Separate venue from event - venues host many events over time.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Event Service' },
          { from: 'Event Service', to: 'Venue Service' },
          { from: 'Event Service', to: 'Inventory Service' }
        ],
        requiredComponents: ['Event Service', 'Venue Service', 'Inventory Service', 'Event Database']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'How do events relate to venues?',
          'How do we model individual seats?',
          'What states can a ticket be in?'
        ],
        tradeoffs: [
          { option: 'Embed seats in event', pros: ['Simple queries'], cons: ['Duplicate venue data'] },
          { option: 'Separate venue entity', pros: ['Reusable', 'Consistent'], cons: ['More joins'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Event Search',
      phase: 'phase-1-beginner',
      description: 'Implement event discovery by date, location, category, and artist',
      order: 2,

      educationalContent: {
        title: 'Event Discovery',
        explanation: `Users discover events by location, date, artist, or browsing categories.

**Search Dimensions:**
\`\`\`typescript
interface EventSearch {
  query?: string;           // "Taylor Swift", "Lakers"
  location?: {
    city?: string;
    lat?: number;
    lng?: number;
    radius?: number;        // Miles from location
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];    // ["concert", "sports"]
  priceRange?: {
    min: number;
    max: number;
  };
  hasAvailability?: boolean;
}
\`\`\`

**Search Index:**
\`\`\`typescript
interface EventSearchDoc {
  id: string;
  name: string;
  artistName: string;
  venueName: string;
  city: string;
  location: GeoPoint;
  dateTime: Date;
  category: string;
  minPrice: number;
  maxPrice: number;
  availableCount: number;
  popularity: number;
}
\`\`\`

**Geospatial Search:**
"Events near me":
\`\`\`json
{
  "geo_distance": {
    "distance": "50mi",
    "location": { "lat": 40.7, "lon": -74.0 }
  }
}
\`\`\`

**Inventory Sync:**
\`\`\`
Challenge: availableCount changes with every sale

Solution:
- Update search index periodically (every 5 min)
- Real-time count fetched separately when viewing event
- "Low availability" badge updated more frequently
\`\`\``,
        keyInsight: 'Event search combines text matching, geospatial queries, and date filtering - availability counts are synced periodically, not in real-time',
        commonMistakes: [
          'Real-time availability in search index (too expensive)',
          'No geospatial search (events are location-based)',
          'Not showing price ranges in search results'
        ],
        interviewTips: [
          'Explain periodic sync for availability counts',
          'Discuss geospatial search for "near me"',
          'Mention faceted search for filtering'
        ],
        realWorldExample: 'Ticketmaster search shows "Limited availability" badges that update every few minutes, not in real-time, to balance accuracy with performance.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Elasticsearch', 'Event Service'],

      hints: [
        { trigger: 'stuck', content: 'Search needs: text matching, geo queries, date filtering. Sync availability periodically.' },
        { trigger: 'realtime_count', content: 'Dont sync availability in real-time to search. Update periodically (every 5 min).' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Search Service' },
          { from: 'Search Service', to: 'Elasticsearch' }
        ],
        requiredComponents: ['Search Service', 'Elasticsearch']
      },

      thinkingFramework: {
        approach: 'search-design',
        questions: [
          'What dimensions do users search by?',
          'How do we show availability in search results?',
          'How do we handle "events near me"?'
        ],
        tradeoffs: [
          { option: 'Real-time availability', pros: ['Accurate'], cons: ['Expensive updates'] },
          { option: 'Periodic sync', pros: ['Efficient'], cons: ['Slightly stale'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Basic Purchase Flow',
      phase: 'phase-1-beginner',
      description: 'Implement a simple ticket purchase without seat selection',
      order: 3,

      educationalContent: {
        title: 'General Admission Purchases',
        explanation: `Start with general admission (GA) tickets - no specific seat selection, just quantity.

**GA Purchase Flow:**
\`\`\`
1. User selects event
2. User selects ticket type and quantity
3. System checks availability
4. System creates order, reserves inventory
5. User completes payment
6. Tickets issued (email/app)
\`\`\`

**Order Model:**
\`\`\`typescript
interface Order {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  fees: number;
  total: number;
  paymentId?: string;
  createdAt: Date;
  expiresAt: Date;  // For pending orders
}

interface OrderItem {
  ticketInventoryId: string;
  priceLevel: string;
  price: number;
  fees: number;
}
\`\`\`

**Inventory Reservation:**
\`\`\`typescript
async function reserveGATickets(eventId: string, quantity: number, userId: string) {
  // Atomic operation to claim N available tickets
  const result = await db.query(\`
    UPDATE ticket_inventory
    SET status = 'held', holder_id = $1, hold_expires_at = $2
    WHERE event_id = $3 AND status = 'available'
    LIMIT $4
    RETURNING *
  \`, [userId, expiry, eventId, quantity]);

  if (result.rowCount < quantity) {
    // Not enough available - rollback and fail
    await rollbackHolds(result.rows);
    throw new Error('Insufficient inventory');
  }

  return result.rows;
}
\`\`\`

**Hold Expiration:**
Pending orders expire to release inventory:
\`\`\`
Hold duration: 10-15 minutes typically
Cron job: Clean up expired holds every minute
\`\`\``,
        keyInsight: 'GA tickets use atomic database operations to claim N available tickets - the LIMIT clause prevents overselling by only updating available inventory',
        commonMistakes: [
          'Check-then-reserve race condition',
          'No hold expiration (inventory locked forever)',
          'Not handling partial availability'
        ],
        interviewTips: [
          'Explain atomic reserve with LIMIT clause',
          'Discuss hold expiration for abandoned checkouts',
          'Mention the race condition risk'
        ],
        realWorldExample: 'Concert GA tickets often show "Tickets held for 10:00" countdown during checkout - this is the hold expiration timer.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Order Service', 'Inventory Service', 'Order Database', 'Payment Service'],

      hints: [
        { trigger: 'stuck', content: 'Use atomic UPDATE with LIMIT to reserve GA tickets. Add expiration for holds.' },
        { trigger: 'check_then_reserve', content: 'Checking then reserving has race conditions. Use atomic UPDATE.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Order Service' },
          { from: 'Order Service', to: 'Inventory Service' },
          { from: 'Order Service', to: 'Payment Service' }
        ],
        requiredComponents: ['Order Service', 'Inventory Service', 'Order Database', 'Payment Service']
      },

      thinkingFramework: {
        approach: 'inventory-management',
        questions: [
          'How do we prevent overselling?',
          'What happens if user abandons checkout?',
          'How do we handle partial availability?'
        ],
        tradeoffs: [
          { option: 'Optimistic (check then reserve)', pros: ['Simple'], cons: ['Race conditions'] },
          { option: 'Atomic update', pros: ['Safe'], cons: ['Database dependent'] }
        ]
      }
    },

    // ============== PHASE 2: SEAT SELECTION & CHECKOUT ==============
    {
      id: 'step-4',
      title: 'Interactive Seating Chart',
      phase: 'phase-2-intermediate',
      description: 'Build interactive seat maps showing availability in real-time',
      order: 4,

      educationalContent: {
        title: 'Visual Seat Selection',
        explanation: `Users expect to see venue maps and select specific seats interactively.

**Seating Chart Data:**
\`\`\`typescript
interface SeatingChart {
  id: string;
  venueId: string;
  svgData: string;       // Vector graphic of venue
  sections: SectionMap[];
}

interface SectionMap {
  sectionId: string;
  svgPath: string;       // Clickable region
  labelPosition: { x: number; y: number };
}

interface SeatDisplay {
  seatId: string;
  coordinates: { x: number; y: number };
  status: 'available' | 'held' | 'sold';
  priceLevel: string;
  price: number;
}
\`\`\`

**Rendering Strategy:**
\`\`\`
Level 1: Venue overview
- Show sections as clickable regions
- Color by availability (green/yellow/red)
- "Starting at $X" per section

Level 2: Section detail
- Show individual seats
- Click to select
- Real-time status updates
\`\`\`

**Availability Updates:**
\`\`\`typescript
// WebSocket for real-time seat status
ws.subscribe('event:123:seats');

// Server broadcasts on change
broadcast('event:123:seats', {
  seatId: 'A-1',
  status: 'held'
});

// Batch updates every few seconds during high activity
\`\`\`

**Best Available Algorithm:**
\`\`\`typescript
function findBestAvailable(
  eventId: string,
  quantity: number,
  preferences: { section?: string; aisle?: boolean; together: boolean }
): Seat[] {
  // Score seats by:
  // - Distance from stage/field
  // - Seat quality rating
  // - Consecutive availability (for groups)
  // - Aisle preference
}
\`\`\``,
        keyInsight: 'Seating charts use SVG for vector graphics with real-time WebSocket updates - the "best available" algorithm finds optimal consecutive seats for groups',
        commonMistakes: [
          'Raster images for seat maps (dont scale)',
          'No real-time status updates (users select sold seats)',
          'Not handling group seating (consecutive seats)'
        ],
        interviewTips: [
          'Explain SVG-based interactive maps',
          'Discuss real-time updates via WebSocket',
          'Mention best available algorithm for groups'
        ],
        realWorldExample: 'Ticketmaster seat maps zoom from venue overview to individual seats, with colors updating in real-time as seats are selected by other users.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Seating Service', 'WebSocket Gateway', 'Inventory Service', 'Redis Cache'],

      hints: [
        { trigger: 'stuck', content: 'Use SVG for scalable seat maps. WebSocket for real-time status. Best available for groups.' },
        { trigger: 'no_realtime', content: 'Seats get selected constantly. Use WebSocket to show real-time availability.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Seating Service' },
          { from: 'Client', to: 'WebSocket Gateway' },
          { from: 'Seating Service', to: 'Redis Cache' }
        ],
        requiredComponents: ['Seating Service', 'WebSocket Gateway', 'Redis Cache']
      },

      thinkingFramework: {
        approach: 'interactive-ui',
        questions: [
          'How do we render interactive seat maps?',
          'How do we keep availability current?',
          'How do we find best seats for groups?'
        ],
        tradeoffs: [
          { option: 'Static images', pros: ['Simple'], cons: ['Dont scale', 'Not interactive'] },
          { option: 'SVG + WebSocket', pros: ['Interactive', 'Real-time'], cons: ['More complex'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Seat Hold & Reservation',
      phase: 'phase-2-intermediate',
      description: 'Implement temporary holds on selected seats during checkout',
      order: 5,

      educationalContent: {
        title: 'Seat Reservation System',
        explanation: `When a user selects specific seats, those seats must be held exclusively during checkout.

**Seat Hold Flow:**
\`\`\`
1. User clicks seats A1, A2, A3
2. System attempts to hold all three atomically
3. If successful: start checkout timer
4. If any unavailable: show error, suggest alternatives
5. Timer visible: "Complete purchase in 10:00"
6. On timeout: seats released back to inventory
\`\`\`

**Atomic Multi-Seat Hold:**
\`\`\`typescript
async function holdSeats(seatIds: string[], userId: string, eventId: string) {
  const lockKey = \`event:\${eventId}:lock\`;

  return await redisLock(lockKey, async () => {
    // Check all seats available
    const seats = await db.query(
      'SELECT * FROM ticket_inventory WHERE id = ANY($1) FOR UPDATE',
      [seatIds]
    );

    const allAvailable = seats.every(s => s.status === 'available');
    if (!allAvailable) {
      throw new SeatUnavailableError(seats.filter(s => s.status !== 'available'));
    }

    // Hold all seats
    await db.query(\`
      UPDATE ticket_inventory
      SET status = 'held', holder_id = $1, hold_expires_at = $2
      WHERE id = ANY($3)
    \`, [userId, expiry, seatIds]);

    return seats;
  });
}
\`\`\`

**Hold Extension:**
\`\`\`
User still in checkout at 2 minutes left:
- Option to extend hold by 5 minutes (once)
- Shows warning at 5 min, 2 min, 1 min

No extension if event has waiting users
\`\`\`

**Release on Navigation:**
\`\`\`
User navigates away or closes tab:
- beforeunload event → API call to release
- Or rely on expiration
- Don't hold if user just viewing
\`\`\``,
        keyInsight: 'Seat holds use distributed locks for atomic multi-seat reservation - all seats must be available or the entire hold fails',
        commonMistakes: [
          'Non-atomic multi-seat holds (partial success)',
          'No hold timeout (inventory locked forever)',
          'Long hold times (frustrates other users)'
        ],
        interviewTips: [
          'Explain atomic all-or-nothing holds',
          'Discuss optimal hold duration (10-15 min)',
          'Mention hold extension for active users'
        ],
        realWorldExample: 'Ticketmaster shows "Someone else got these seats!" when your hold fails, and suggests nearby alternatives instantly.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Reservation Service', 'Inventory Service', 'Redis Lock', 'Hold Expiration Service'],

      hints: [
        { trigger: 'stuck', content: 'Use distributed lock for atomic multi-seat holds. All succeed or all fail.' },
        { trigger: 'partial_hold', content: 'Partial holds create bad UX. Hold all seats atomically or none.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Reservation Service' },
          { from: 'Reservation Service', to: 'Redis Lock' },
          { from: 'Reservation Service', to: 'Hold Expiration Service' }
        ],
        requiredComponents: ['Reservation Service', 'Redis Lock', 'Hold Expiration Service']
      },

      thinkingFramework: {
        approach: 'concurrency-control',
        questions: [
          'How do we hold multiple seats atomically?',
          'How long should holds last?',
          'How do we handle hold expiration?'
        ],
        tradeoffs: [
          { option: 'Short holds (5 min)', pros: ['Releases fast'], cons: ['Checkout pressure'] },
          { option: 'Long holds (20 min)', pros: ['User friendly'], cons: ['Blocks inventory'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'Payment & Ticket Delivery',
      phase: 'phase-2-intermediate',
      description: 'Process payments and deliver tickets electronically',
      order: 6,

      educationalContent: {
        title: 'Completing the Purchase',
        explanation: `Payment processing must be reliable - a failed payment after inventory update is a serious problem.

**Payment Flow:**
\`\`\`
1. User submits payment
2. Authorize payment (don't capture yet)
3. Confirm inventory still held
4. Capture payment
5. Update inventory to 'sold'
6. Generate tickets
7. Send confirmation
\`\`\`

**Idempotency:**
\`\`\`typescript
interface PaymentRequest {
  orderId: string;          // Idempotency key
  amount: number;
  paymentMethodId: string;
}

// Same orderId = same transaction
// Retry-safe
\`\`\`

**Ticket Delivery:**
\`\`\`typescript
interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  seatId?: string;
  barcode: string;          // Scannable at venue
  qrCode: string;
  status: 'active' | 'used' | 'transferred' | 'voided';
  issuedAt: Date;
}

// Delivery options:
// - Email with PDF attachment
// - Mobile app (Apple Wallet / Google Pay)
// - Will call (pickup at venue)
\`\`\`

**Fraud Checks:**
\`\`\`
Before completing payment:
- Velocity check (too many purchases)
- Address verification (AVS)
- Device fingerprinting
- Bot detection
\`\`\``,
        keyInsight: 'Payment uses authorize-then-capture pattern with idempotency keys - this allows safe retries and ensures we never charge without successfully reserving inventory',
        commonMistakes: [
          'Capturing payment before confirming inventory',
          'No idempotency (double charges on retry)',
          'Generating tickets before payment confirmed'
        ],
        interviewTips: [
          'Explain authorize vs capture',
          'Discuss idempotency for safe retries',
          'Mention fraud detection at checkout'
        ],
        realWorldExample: 'Ticketmaster authorizes your card immediately but only captures after confirming your seats are locked - if something fails, the auth expires without charging you.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Payment Service', 'Stripe', 'Ticket Service', 'Email Service', 'Fraud Detection'],

      hints: [
        { trigger: 'stuck', content: 'Authorize payment first, confirm inventory, then capture. Use idempotency keys.' },
        { trigger: 'capture_first', content: 'Dont capture payment before confirming inventory. Authorize then capture.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Payment Service' },
          { from: 'Payment Service', to: 'Stripe' },
          { from: 'Payment Service', to: 'Fraud Detection' },
          { from: 'Payment Service', to: 'Ticket Service' }
        ],
        requiredComponents: ['Payment Service', 'Ticket Service', 'Email Service', 'Fraud Detection']
      },

      thinkingFramework: {
        approach: 'transaction-safety',
        questions: [
          'How do we ensure payment and inventory are in sync?',
          'How do we handle payment failures safely?',
          'How do we prevent fraud?'
        ],
        tradeoffs: [
          { option: 'Capture immediately', pros: ['Simple'], cons: ['Refund complexity'] },
          { option: 'Auth then capture', pros: ['Safe', 'Retryable'], cons: ['More steps'] }
        ]
      }
    },

    // ============== PHASE 3: FLASH SALES ==============
    {
      id: 'step-7',
      title: 'Virtual Waiting Room',
      phase: 'phase-3-advanced',
      description: 'Build a queue system to manage traffic during high-demand on-sales',
      order: 7,

      educationalContent: {
        title: 'Managing Flash Sale Traffic',
        explanation: `High-demand on-sales can see millions of users hitting the site in seconds. A virtual waiting room prevents system overload.

**Flash Sale Numbers:**
\`\`\`
Taylor Swift Eras Tour:
- 14 million users in queue
- 2 million tickets available
- All sold in hours

System must handle 100K+ requests/second at peak
\`\`\`

**Virtual Queue:**
\`\`\`typescript
interface QueueEntry {
  userId: string;
  eventId: string;
  position: number;
  joinedAt: Date;
  status: 'waiting' | 'admitted' | 'expired';
  estimatedWait: number;  // Minutes
}

// User flow:
// 1. User arrives → joins queue
// 2. See position and estimated wait
// 3. Periodically check if admitted
// 4. When admitted → proceed to seat selection
// 5. Limited time to complete purchase
\`\`\`

**Queue Assignment:**
\`\`\`
Options:
1. First-come-first-served: Position based on join time
2. Random at sale start: Everyone who joins before sale gets random position
3. Verified fan: Priority for fans who registered interest

Ticketmaster uses "Verified Fan" for major events
\`\`\`

**Admission Rate Control:**
\`\`\`typescript
class AdmissionController {
  private admittedCount: number = 0;
  private maxConcurrent: number = 5000;  // Active shoppers

  async admitNext(eventId: string) {
    // Only admit when below concurrent limit
    // And inventory still available
    if (this.admittedCount < this.maxConcurrent) {
      const next = await queue.getNext(eventId);
      await queue.admit(next.userId);
      this.admittedCount++;
      return next;
    }
  }

  onPurchaseComplete() {
    this.admittedCount--;
    // Admit next in queue
  }
}
\`\`\`

**Queue UI:**
\`\`\`
"You're in the queue!"
Position: 45,231
Estimated wait: 28 minutes

[===========------------] 45%

Don't refresh - you won't lose your place
\`\`\``,
        keyInsight: 'Virtual queues decouple arrival traffic from shopping traffic - admit users at a controlled rate that the backend can handle',
        commonMistakes: [
          'No queue (system crashes under load)',
          'Losing position on refresh (user frustration)',
          'Static wait estimates (should update)'
        ],
        interviewTips: [
          'Explain why queues are necessary for flash sales',
          'Discuss admission rate control',
          'Mention Verified Fan for priority access'
        ],
        realWorldExample: 'Ticketmaster queue shows your position and updates estimated wait time every minute. Refreshing doesnt lose your place.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Queue Service', 'Redis', 'Admission Controller', 'WebSocket Gateway'],

      hints: [
        { trigger: 'stuck', content: 'Queue decouples arrival from shopping. Control admission rate to protect backend.' },
        { trigger: 'no_queue', content: 'Without a queue, flash sales crash the system. Implement virtual waiting room.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Queue Service' },
          { from: 'Queue Service', to: 'Redis' },
          { from: 'Queue Service', to: 'Admission Controller' }
        ],
        requiredComponents: ['Queue Service', 'Redis', 'Admission Controller']
      },

      thinkingFramework: {
        approach: 'load-management',
        questions: [
          'How do we handle 100K+ concurrent users?',
          'How do we fairly order the queue?',
          'How do we control admission rate?'
        ],
        tradeoffs: [
          { option: 'First-come-first-served', pros: ['Fair'], cons: ['Rewards fastest internet'] },
          { option: 'Random lottery', pros: ['Equal chance'], cons: ['Feels random'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'High-Concurrency Inventory',
      phase: 'phase-3-advanced',
      description: 'Design inventory system to handle thousands of concurrent seat selections',
      order: 8,

      educationalContent: {
        title: 'Inventory Under Extreme Load',
        explanation: `During flash sales, thousands of users try to select the same seats simultaneously. The inventory system must handle this without overselling.

**Concurrency Challenges:**
\`\`\`
5,000 users all selecting "best available" simultaneously
Each request tries to grab front row seats
Database becomes bottleneck

Solutions needed:
- Reduce database contention
- Distribute load across inventory
- Accept some failed attempts
\`\`\`

**Inventory Partitioning:**
\`\`\`typescript
// Partition inventory by section
// Different sections can be processed in parallel

async function getInventoryPartition(sectionId: string) {
  // Each section has its own lock/counter
  return redis.get(\`inventory:\${sectionId}\`);
}

// Parallel processing:
// Section A requests → handled by worker 1
// Section B requests → handled by worker 2
\`\`\`

**Pre-computed "Best Available" Buckets:**
\`\`\`typescript
// Pre-sort seats into quality buckets
interface SeatBucket {
  eventId: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  availableSeats: string[];  // Pre-sorted by quality
}

// On request for "best available":
// Pop from highest tier with availability
// Much faster than querying all seats
\`\`\`

**Optimistic Locking with Retry:**
\`\`\`typescript
async function reserveSeat(seatId: string, userId: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const seat = await getSeat(seatId);
    if (seat.status !== 'available') {
      throw new SeatUnavailableError();
    }

    const result = await db.query(\`
      UPDATE ticket_inventory
      SET status = 'held', holder_id = $1, version = version + 1
      WHERE id = $2 AND version = $3
    \`, [userId, seatId, seat.version]);

    if (result.rowCount > 0) {
      return seat;
    }
    // Version mismatch - retry with backoff
    await sleep(Math.random() * 100);
  }
  throw new ConcurrencyError();
}
\`\`\``,
        keyInsight: 'Partition inventory by section for parallel processing, pre-compute best available buckets, and use optimistic locking with retry for individual seat claims',
        commonMistakes: [
          'Single lock for all inventory (bottleneck)',
          'Computing best available on every request',
          'No retry on optimistic lock failure'
        ],
        interviewTips: [
          'Explain inventory partitioning by section',
          'Discuss pre-computed quality buckets',
          'Mention optimistic locking with version numbers'
        ],
        realWorldExample: 'Ticketmaster pre-sorts seats into quality tiers. When you click "Best Available", it pops from a pre-computed list rather than searching all 20,000 seats.'
      },

      requiredComponents: ['API Gateway', 'Inventory Service', 'Redis', 'Inventory Database', 'Seat Bucket Service'],

      hints: [
        { trigger: 'stuck', content: 'Partition by section for parallel processing. Pre-compute best available buckets.' },
        { trigger: 'single_lock', content: 'One lock for all seats creates bottleneck. Partition by section.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Inventory Service' },
          { from: 'Inventory Service', to: 'Redis' },
          { from: 'Inventory Service', to: 'Seat Bucket Service' }
        ],
        requiredComponents: ['Inventory Service', 'Seat Bucket Service']
      },

      thinkingFramework: {
        approach: 'concurrent-systems',
        questions: [
          'How do we reduce database contention?',
          'How do we serve best available quickly?',
          'How do we handle failed reservation attempts?'
        ],
        tradeoffs: [
          { option: 'Pessimistic locking', pros: ['Strong consistency'], cons: ['High contention'] },
          { option: 'Optimistic with retry', pros: ['Better throughput'], cons: ['Some failures'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'Bot Prevention',
      phase: 'phase-3-advanced',
      description: 'Implement anti-bot measures to ensure fair access for real fans',
      order: 9,

      educationalContent: {
        title: 'Fighting Ticket Bots',
        explanation: `Scalpers use bots to buy tickets faster than humans, then resell at markup. Fighting bots is critical for fan experience.

**Bot Detection Signals:**
\`\`\`typescript
interface UserBehavior {
  // Speed signals
  timeToPurchase: number;      // Bots are instant
  mouseMovements: boolean;     // Bots don't move mouse
  scrollPatterns: boolean;     // Bots don't scroll naturally

  // Volume signals
  requestsPerSecond: number;
  sessionsPerIP: number;
  devicesPerAccount: number;

  // Identity signals
  deviceFingerprint: string;
  ipReputation: number;
  accountAge: number;
}
\`\`\`

**Defense Layers:**
\`\`\`
Layer 1: Rate limiting
  - N requests per IP per second
  - N requests per account per minute

Layer 2: CAPTCHA
  - On suspicious behavior
  - Before checkout for high-demand events
  - Invisible CAPTCHA for low friction

Layer 3: Device fingerprinting
  - Canvas fingerprint
  - WebGL fingerprint
  - Browser characteristics
  - Known bot fingerprints → block

Layer 4: Behavioral analysis
  - ML model on interaction patterns
  - Real-time scoring
  - Block or challenge based on score
\`\`\`

**Verified Fan Program:**
\`\`\`typescript
interface VerifiedFan {
  userId: string;
  artistId: string;
  verificationMethod: 'social' | 'streaming' | 'purchase_history';
  score: number;           // Fan engagement score
  priorityAccess: boolean;
}

// Verified fans get:
// - Earlier queue access
// - Higher purchase limits
// - Exclusive presale access
\`\`\`

**Purchase Limits:**
\`\`\`
Per account: Max 4 tickets per event
Per household: Max 8 tickets (address matching)
Per payment method: Max 4 tickets

Tickets exceeding limits → cancelled post-purchase
\`\`\``,
        keyInsight: 'Bot prevention requires multiple layers - rate limiting, CAPTCHA, fingerprinting, and behavioral ML - no single technique is sufficient',
        commonMistakes: [
          'CAPTCHA only (bots solve CAPTCHAs)',
          'Rate limiting only (distributed bots)',
          'No post-purchase fraud detection'
        ],
        interviewTips: [
          'Explain defense-in-depth strategy',
          'Discuss behavioral signals that distinguish bots',
          'Mention Verified Fan for priority access'
        ],
        realWorldExample: 'Ticketmaster Verified Fan requires fans to register interest days before sale, prove they are real fans (streaming history), and get prioritized queue position.'
      },

      requiredComponents: ['API Gateway', 'Bot Detection Service', 'CAPTCHA Service', 'Device Fingerprint Service', 'ML Scoring Service', 'Rate Limiter'],

      hints: [
        { trigger: 'stuck', content: 'Layer defenses: rate limiting + CAPTCHA + fingerprinting + behavioral ML.' },
        { trigger: 'captcha_only', content: 'Bots can solve CAPTCHAs. Need behavioral analysis and fingerprinting too.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Bot Detection Service' },
          { from: 'Bot Detection Service', to: 'CAPTCHA Service' },
          { from: 'Bot Detection Service', to: 'Device Fingerprint Service' },
          { from: 'Bot Detection Service', to: 'ML Scoring Service' }
        ],
        requiredComponents: ['Bot Detection Service', 'CAPTCHA Service', 'ML Scoring Service', 'Rate Limiter']
      },

      thinkingFramework: {
        approach: 'security-layers',
        questions: [
          'How do we identify bot vs human behavior?',
          'Why is a single defense insufficient?',
          'How do we balance security vs user friction?'
        ],
        tradeoffs: [
          { option: 'Strict (CAPTCHA always)', pros: ['Blocks bots'], cons: ['User friction'] },
          { option: 'Risk-based', pros: ['Low friction'], cons: ['Some bots slip through'] }
        ]
      }
    },

    // ============== PHASE 4: RESALE & INTELLIGENCE ==============
    {
      id: 'step-10',
      title: 'Verified Resale',
      phase: 'phase-4-expert',
      description: 'Build a secondary marketplace for fan-to-fan ticket resale',
      order: 10,

      educationalContent: {
        title: 'Official Resale Marketplace',
        explanation: `An official resale marketplace lets fans resell tickets safely, competing with scalper sites while taking a commission.

**Resale Listing:**
\`\`\`typescript
interface ResaleListing {
  id: string;
  ticketId: string;
  sellerId: string;
  originalPrice: number;
  askingPrice: number;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  createdAt: Date;
  expiresAt: Date;  // Can't list day-of for delivery
}
\`\`\`

**Resale Flow:**
\`\`\`
1. Seller lists ticket at asking price
2. Original ticket is locked (can't use both)
3. Buyer purchases at asking price
4. Platform takes commission (typically 15-25%)
5. Original ticket voided, new ticket issued to buyer
6. Seller receives payout after event
\`\`\`

**Price Controls:**
\`\`\`
Options:
1. No cap: Free market (StubHub model)
2. Face value cap: Can't list above original price
3. Percentage cap: Max 20% above face value

Ticketmaster uses face value cap for some events
\`\`\`

**Ticket Transfer Security:**
\`\`\`typescript
// Original ticket has barcode ABC123
// On resale:
// 1. Void barcode ABC123
// 2. Generate new barcode XYZ789
// 3. Issue new ticket to buyer

// Prevents:
// - Seller using ticket after selling
// - Duplicate tickets
// - Screenshot fraud
\`\`\`

**Payout Timing:**
\`\`\`
Hold payout until:
- Event has occurred (ticket was valid)
- Grace period for disputes (48 hours post-event)
- Then release to seller minus commission
\`\`\``,
        keyInsight: 'Verified resale voids the original ticket and issues a new one to the buyer - this prevents the seller from using a screenshot after selling',
        commonMistakes: [
          'Not voiding original ticket (duplicate use)',
          'Immediate payout (no fraud protection)',
          'No price controls for face value events'
        ],
        interviewTips: [
          'Explain ticket transfer with barcode regeneration',
          'Discuss commission and payout timing',
          'Mention price cap options'
        ],
        realWorldExample: 'Ticketmaster Verified Resale generates a completely new barcode when you buy a resale ticket - the sellers original barcode is immediately voided.'
      },

      requiredComponents: ['API Gateway', 'Resale Service', 'Ticket Service', 'Payment Service', 'Escrow Service'],

      hints: [
        { trigger: 'stuck', content: 'Resale must void original ticket and issue new barcode. Hold payout until after event.' },
        { trigger: 'keep_original', content: 'Original ticket must be voided. Otherwise seller can use after selling.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Resale Service' },
          { from: 'Resale Service', to: 'Ticket Service' },
          { from: 'Resale Service', to: 'Payment Service' },
          { from: 'Resale Service', to: 'Escrow Service' }
        ],
        requiredComponents: ['Resale Service', 'Escrow Service']
      },

      thinkingFramework: {
        approach: 'marketplace-trust',
        questions: [
          'How do we prevent duplicate ticket use?',
          'When should sellers receive payment?',
          'Should we cap resale prices?'
        ],
        tradeoffs: [
          { option: 'No price cap', pros: ['Free market'], cons: ['Scalper profits'] },
          { option: 'Face value cap', pros: ['Fair for fans'], cons: ['Black market forms'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Dynamic Pricing',
      phase: 'phase-4-expert',
      description: 'Implement demand-based pricing that adjusts in real-time',
      order: 11,

      educationalContent: {
        title: 'Market-Based Ticket Pricing',
        explanation: `Dynamic pricing adjusts ticket prices based on demand, similar to airlines and hotels.

**Demand Signals:**
\`\`\`typescript
interface DemandSignals {
  eventId: string;

  // Historical
  artistPastSales: SalesHistory[];
  venuePastSales: SalesHistory[];
  similarEventSales: SalesHistory[];

  // Current
  searchVolume: number;
  socialMentions: number;
  presaleConversion: number;
  currentInventoryPct: number;
  daysUntilEvent: number;
  queueLength: number;
}
\`\`\`

**Pricing Algorithm:**
\`\`\`typescript
function calculatePrice(
  basePrice: number,
  section: string,
  signals: DemandSignals
): number {
  let multiplier = 1.0;

  // Demand factor
  if (signals.queueLength > 10000) multiplier *= 1.3;
  if (signals.currentInventoryPct < 20) multiplier *= 1.2;

  // Time factor
  if (signals.daysUntilEvent < 7) multiplier *= 1.1;

  // Quality factor
  multiplier *= sectionQualityFactor(section);

  return Math.round(basePrice * multiplier);
}
\`\`\`

**Price Floors and Ceilings:**
\`\`\`
Floor: Never below face value (artist requirement)
Ceiling: Max 3x face value (consumer protection)

Some events opt out of dynamic pricing entirely
\`\`\`

**Price Display:**
\`\`\`
"Official Platinum" seats:
- Dynamically priced
- Clearly labeled
- Best seats held back for dynamic pricing
- Proceeds shared with artist

vs Regular seats:
- Fixed price
- Release at announced time
\`\`\`

**Transparency:**
Users see:
- "Price set by demand"
- Price history graph
- Comparison to similar events`,
        keyInsight: 'Dynamic pricing captures value that would otherwise go to scalpers - premium seats priced by demand with proceeds shared with artists',
        commonMistakes: [
          'No price ceiling (PR disaster)',
          'Opaque pricing (user distrust)',
          'Pricing all inventory dynamically (fan backlash)'
        ],
        interviewTips: [
          'Explain demand signals for pricing',
          'Discuss Official Platinum vs regular seats',
          'Mention price transparency requirements'
        ],
        realWorldExample: 'Ticketmaster Official Platinum holds back 5-10% of best seats for dynamic pricing. Prices can be 3-5x face value for front row at popular shows.'
      },

      requiredComponents: ['Pricing Service', 'ML Model Service', 'Demand Signals Service', 'Inventory Service', 'Event Service'],

      hints: [
        { trigger: 'stuck', content: 'Dynamic pricing uses demand signals: queue length, inventory %, days until event.' },
        { trigger: 'all_dynamic', content: 'Dont dynamically price all tickets. Keep regular inventory at fixed prices.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Pricing Service', to: 'ML Model Service' },
          { from: 'Pricing Service', to: 'Demand Signals Service' },
          { from: 'Pricing Service', to: 'Inventory Service' }
        ],
        requiredComponents: ['Pricing Service', 'ML Model Service', 'Demand Signals Service']
      },

      thinkingFramework: {
        approach: 'revenue-optimization',
        questions: [
          'What signals indicate high demand?',
          'How do we balance revenue vs fan perception?',
          'How do we communicate dynamic pricing?'
        ],
        tradeoffs: [
          { option: 'Fixed pricing', pros: ['Predictable', 'Fan friendly'], cons: ['Scalpers capture value'] },
          { option: 'Dynamic pricing', pros: ['Captures value'], cons: ['PR risk', 'Perceived as greedy'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Venue Operations',
      phase: 'phase-4-expert',
      description: 'Build systems for ticket scanning, entry management, and real-time venue operations',
      order: 12,

      educationalContent: {
        title: 'Day-of-Event Operations',
        explanation: `Ticketing extends to event day - scanning tickets, managing entry, and handling issues at the venue.

**Ticket Scanning:**
\`\`\`typescript
interface ScanResult {
  ticketId: string;
  status: 'valid' | 'already_used' | 'invalid' | 'transferred';
  entryGate: string;
  scanTime: Date;
  message: string;  // "Welcome!" or "Already scanned at Gate A"
}

// Scanning modes:
// Online: Real-time validation against server
// Offline: Cached valid barcodes for network failures
\`\`\`

**Offline Mode:**
\`\`\`
Network fails at venue:
1. Pre-download valid barcodes before event
2. Scan locally against cached list
3. Mark as "pending sync"
4. Sync when network restores
5. Detect duplicates post-facto
\`\`\`

**Entry Analytics:**
\`\`\`typescript
interface VenueAnalytics {
  eventId: string;
  totalScanned: number;
  scansByGate: Record<string, number>;
  scansByTime: TimeSeriesData;
  peakEntryRate: number;  // Scans per minute
  noShows: number;        // Tickets not scanned
}

// Real-time dashboard for venue ops
// "Gate B is overwhelmed - redirect to Gate C"
\`\`\`

**Access Control:**
\`\`\`
Ticket types and access:
- GA Floor: Enter through Floor gates
- Section 100: Enter through upper gates
- VIP: Enter through VIP entrance
- Backstage: Special credentials

Scanner shows correct entry point
Wrong gate → redirect to correct entry
\`\`\`

**Issue Resolution:**
\`\`\`typescript
interface ScanIssue {
  ticketId: string;
  issue: 'already_scanned' | 'invalid' | 'name_mismatch';
  resolution: 'override' | 'deny' | 'escalate';
  resolvedBy: string;  // Staff ID
  notes: string;
}

// Box office can:
// - Look up purchase history
// - Verify identity
// - Issue replacement ticket
// - Override scan errors
\`\`\``,
        keyInsight: 'Venue operations require offline-capable scanning - network failures are common at venues, so scanners must cache valid barcodes locally',
        commonMistakes: [
          'Online-only scanning (network fails at venues)',
          'No duplicate detection for offline scans',
          'No real-time entry analytics'
        ],
        interviewTips: [
          'Explain offline scanning with sync',
          'Discuss entry analytics for crowd management',
          'Mention access control by ticket type'
        ],
        realWorldExample: 'NFL stadiums scan 70,000+ tickets in 2 hours. Scanners work offline and sync, with real-time dashboards showing entry rates per gate.'
      },

      requiredComponents: ['Scanner Device', 'Scanning Service', 'Offline Cache', 'Analytics Service', 'Box Office Service', 'Real-Time Dashboard'],

      hints: [
        { trigger: 'stuck', content: 'Scanners need offline mode. Cache valid barcodes, sync after. Real-time analytics for crowd management.' },
        { trigger: 'online_only', content: 'Venue networks fail. Scanners must work offline with cached barcodes.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Scanner Device', to: 'Scanning Service' },
          { from: 'Scanner Device', to: 'Offline Cache' },
          { from: 'Scanning Service', to: 'Analytics Service' },
          { from: 'Analytics Service', to: 'Real-Time Dashboard' }
        ],
        requiredComponents: ['Scanning Service', 'Offline Cache', 'Analytics Service', 'Box Office Service']
      },

      thinkingFramework: {
        approach: 'offline-first',
        questions: [
          'How do we handle network failures at venue?',
          'How do we detect duplicate scans offline?',
          'What analytics help venue operations?'
        ],
        tradeoffs: [
          { option: 'Online only', pros: ['Real-time validation'], cons: ['Fails on network issues'] },
          { option: 'Offline capable', pros: ['Always works'], cons: ['Sync complexity', 'Delayed duplicate detection'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      { type: 'Client', category: 'client' },
      { type: 'Scanner Device', category: 'client' },
      { type: 'API Gateway', category: 'gateway' },
      { type: 'WebSocket Gateway', category: 'gateway' },
      { type: 'Event Service', category: 'service' },
      { type: 'Venue Service', category: 'service' },
      { type: 'Inventory Service', category: 'service' },
      { type: 'Search Service', category: 'service' },
      { type: 'Order Service', category: 'service' },
      { type: 'Reservation Service', category: 'service' },
      { type: 'Payment Service', category: 'service' },
      { type: 'Ticket Service', category: 'service' },
      { type: 'Seating Service', category: 'service' },
      { type: 'Queue Service', category: 'service' },
      { type: 'Admission Controller', category: 'service' },
      { type: 'Bot Detection Service', category: 'service' },
      { type: 'Resale Service', category: 'service' },
      { type: 'Pricing Service', category: 'service' },
      { type: 'Scanning Service', category: 'service' },
      { type: 'Analytics Service', category: 'service' },
      { type: 'Box Office Service', category: 'service' },
      { type: 'Hold Expiration Service', category: 'service' },
      { type: 'Seat Bucket Service', category: 'service' },
      { type: 'Demand Signals Service', category: 'service' },
      { type: 'Fraud Detection', category: 'service' },
      { type: 'Email Service', category: 'service' },
      { type: 'CAPTCHA Service', category: 'service' },
      { type: 'Device Fingerprint Service', category: 'service' },
      { type: 'ML Model Service', category: 'service' },
      { type: 'ML Scoring Service', category: 'service' },
      { type: 'Rate Limiter', category: 'service' },
      { type: 'Event Database', category: 'database' },
      { type: 'Inventory Database', category: 'database' },
      { type: 'Order Database', category: 'database' },
      { type: 'Redis', category: 'storage' },
      { type: 'Redis Cache', category: 'storage' },
      { type: 'Redis Lock', category: 'storage' },
      { type: 'Offline Cache', category: 'storage' },
      { type: 'Elasticsearch', category: 'search' },
      { type: 'Stripe', category: 'external' },
      { type: 'Escrow Service', category: 'external' },
      { type: 'Real-Time Dashboard', category: 'monitoring' }
    ]
  },

  learningObjectives: [
    'Design event and ticket inventory data models',
    'Build event search with geospatial and date filtering',
    'Implement atomic ticket reservation for GA',
    'Create interactive seating charts with real-time updates',
    'Build atomic multi-seat holds with distributed locks',
    'Design safe payment flow with authorize-then-capture',
    'Implement virtual waiting rooms for flash sales',
    'Build high-concurrency inventory with partitioning',
    'Design multi-layer bot prevention',
    'Create verified resale marketplace with ticket transfer',
    'Implement dynamic pricing based on demand signals',
    'Build offline-capable venue scanning systems'
  ],

  prerequisites: [
    'Understanding of distributed locking',
    'Familiarity with payment processing',
    'Basic knowledge of queuing systems',
    'Understanding of fraud prevention'
  ],

  interviewRelevance: {
    commonQuestions: [
      'Design Ticketmaster',
      'Design a ticket booking system',
      'How would you handle flash sales?',
      'Design a seat selection system',
      'How would you prevent ticket scalping bots?'
    ],
    keyTakeaways: [
      'Ticket status lifecycle: available → held → sold',
      'Atomic multi-seat holds prevent partial reservations',
      'Virtual queues decouple arrival from shopping traffic',
      'Inventory partitioning enables parallel processing',
      'Bot prevention requires layered defenses',
      'Venue scanning needs offline capability'
    ],
    frequentMistakes: [
      'Check-then-reserve race conditions',
      'No hold expiration (inventory locked)',
      'No queue for flash sales (system crashes)',
      'Single bot defense (easily bypassed)'
    ]
  }
};
