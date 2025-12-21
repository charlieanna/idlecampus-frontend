import { GuidedTutorial } from '../../types/guidedTutorial';

export const airbnbProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'airbnb-progressive-guided',
  title: 'Design Airbnb - Progressive Journey',
  description: 'Build a vacation rental marketplace that evolves from basic listings to a global platform with instant booking and smart pricing',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Airbnb',
    description: 'A marketplace connecting travelers with hosts offering unique accommodations worldwide',
    requirements: [
      'List properties with photos, amenities, and pricing',
      'Search for rentals by location, dates, and guests',
      'Book properties with availability management',
      'Process payments and handle host payouts',
      'Enable reviews for guests and hosts',
      'Support real-time messaging between parties'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new vacation rental marketplace'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Marketplace',
      description: 'Your startup "StayLocal" is launching a rental marketplace. Hosts need to list properties and travelers need to find and book them. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Booking & Payments',
      description: 'StayLocal has 10K listings! Travelers want to book instantly and pay securely. Time to add real-time booking and payment processing.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Trust & Scale',
      description: 'StayLocal has 1M listings globally. You need reviews, identity verification, and infrastructure to handle peak booking periods.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Intelligence & Experiences',
      description: 'StayLocal is competing with Airbnb. Time to add smart pricing, personalized recommendations, and experiences marketplace.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC MARKETPLACE ==============
    {
      id: 'step-1',
      title: 'Property Listings',
      phase: 'phase-1-beginner',
      description: 'Design the data model for property listings with photos, amenities, and house rules',
      order: 1,

      educationalContent: {
        title: 'Modeling Rental Listings',
        explanation: `A rental listing is surprisingly complex - it needs to capture the property itself, pricing rules, availability, house rules, and host information.

**Core Listing Model:**
\`\`\`typescript
interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: 'house' | 'apartment' | 'room' | 'hotel' | 'unique';
  roomType: 'entire_place' | 'private_room' | 'shared_room';

  // Location
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
    neighborhood: string;
  };

  // Capacity
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  // Media
  photos: ListingPhoto[];
  coverPhotoId: string;

  // Amenities
  amenities: string[];  // ['wifi', 'kitchen', 'parking', 'pool']

  // Rules
  houseRules: {
    checkIn: string;  // "3:00 PM"
    checkOut: string; // "11:00 AM"
    smokingAllowed: boolean;
    petsAllowed: boolean;
    partiesAllowed: boolean;
    quietHours: string;
  };

  // Status
  status: 'draft' | 'published' | 'unlisted' | 'suspended';
  instantBook: boolean;
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

**Photo Handling:**
\`\`\`typescript
interface ListingPhoto {
  id: string;
  url: string;
  caption: string;
  room: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'exterior' | 'other';
  order: number;
}
// Generate multiple sizes for responsive display
// small: 300px, medium: 600px, large: 1200px
\`\`\`

**Location Privacy:**
Exact address is hidden until booking confirmed:
- Search shows approximate location (neighborhood)
- Map shows ~500m radius circle
- Exact address revealed after payment

**Listing Quality Score:**
Internal score affecting search ranking:
- Photo quality and quantity
- Description length and keywords
- Response rate and time
- Review scores`,
        keyInsight: 'Listing location needs privacy - show approximate area for search but reveal exact address only after booking is confirmed',
        commonMistakes: [
          'Exposing exact address before booking (privacy/safety issue)',
          'Not handling multiple photo sizes for performance',
          'Missing property type distinctions (entire place vs room)'
        ],
        interviewTips: [
          'Discuss the location privacy model',
          'Mention that photo order matters for conversion',
          'Talk about quality scoring for search ranking'
        ],
        realWorldExample: 'Airbnb shows a circle on the map with "Exact location provided after booking" - this protects host privacy while giving travelers neighborhood context.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Listing Service', 'Listing Database', 'Object Storage'],

      hints: [
        { trigger: 'stuck', content: 'Listings need location, capacity, amenities, photos, and house rules. Consider what to show before vs after booking.' },
        { trigger: 'no_photos', content: 'Photos are critical for bookings. Store in object storage with multiple sizes.' },
        { trigger: 'exact_location', content: 'Dont expose exact address until booking confirmed. Show approximate location for search.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Listing Service' },
          { from: 'Listing Service', to: 'Listing Database' },
          { from: 'Listing Service', to: 'Object Storage' }
        ],
        requiredComponents: ['Listing Service', 'Listing Database', 'Object Storage']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'What information do travelers need to choose a listing?',
          'What should be hidden until after booking?',
          'How do we handle multiple photos efficiently?'
        ],
        tradeoffs: [
          { option: 'Show all details upfront', pros: ['Transparent', 'Better search'], cons: ['Privacy concerns', 'Spam risk'] },
          { option: 'Progressive disclosure', pros: ['Privacy protected'], cons: ['Travelers may have questions'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Location Search',
      phase: 'phase-1-beginner',
      description: 'Implement search by location with map integration and filters',
      order: 2,

      educationalContent: {
        title: 'Geospatial Search for Rentals',
        explanation: `Rental search is fundamentally a geospatial problem - users search by destination and expect results shown on a map.

**Search Query Structure:**
\`\`\`typescript
interface SearchQuery {
  // Location
  location: string;  // "Paris, France" or coordinates
  boundingBox?: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };

  // Dates
  checkIn: Date;
  checkOut: Date;

  // Capacity
  guests: number;
  infants?: number;
  pets?: boolean;

  // Filters
  priceRange?: { min: number; max: number };
  propertyTypes?: string[];
  amenities?: string[];
  instantBook?: boolean;
  superhost?: boolean;

  // Pagination
  cursor?: string;
  limit: number;
}
\`\`\`

**Geospatial Indexing:**
Elasticsearch with geo_point field:
\`\`\`json
{
  "mappings": {
    "properties": {
      "location": { "type": "geo_point" },
      "geohash": { "type": "keyword" }
    }
  }
}
\`\`\`

**Bounding Box Query:**
When user pans the map:
\`\`\`json
{
  "geo_bounding_box": {
    "location": {
      "top_left": { "lat": 48.9, "lon": 2.2 },
      "bottom_right": { "lat": 48.8, "lon": 2.5 }
    }
  }
}
\`\`\`

**Search Ranking Factors:**
1. Availability (must be available for dates)
2. Price (within budget)
3. Quality score (reviews, photos, response rate)
4. Booking likelihood (personalization)
5. Diversity (don't show 10 identical apartments)

**Map Clustering:**
When zoomed out, show clusters:
\`\`\`
Zoom level 10: Show 50 listings as points
Zoom level 8: Show 500 listings → cluster into regions
Display: "127 stays" with price range
\`\`\``,
        keyInsight: 'Rental search combines geospatial queries (location) with temporal queries (availability for dates) - both must be efficient for a good experience',
        commonMistakes: [
          'Not filtering by availability (showing unavailable listings)',
          'Loading all results at once (slow for popular areas)',
          'No clustering when zoomed out (overwhelming)'
        ],
        interviewTips: [
          'Explain geo_bounding_box for map-based search',
          'Discuss the importance of availability filtering',
          'Mention clustering for dense areas'
        ],
        realWorldExample: 'When you search "Paris" on Airbnb, it finds listings within Paris boundaries, filters by your dates, and shows clusters when you zoom out: "500+ places in this area".'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Elasticsearch', 'Listing Database'],

      hints: [
        { trigger: 'stuck', content: 'Search needs geospatial indexing (Elasticsearch geo_point) for map queries' },
        { trigger: 'no_dates', content: 'Search must filter by availability. A booked listing shouldnt appear in results.' },
        { trigger: 'no_clustering', content: 'Popular areas have thousands of listings. Use clustering when zoomed out.' }
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
        approach: 'query-optimization',
        questions: [
          'How do we search by map bounds efficiently?',
          'How do we handle thousands of listings in one view?',
          'What filters must be applied at search time?'
        ],
        tradeoffs: [
          { option: 'Load all results, filter client-side', pros: ['Simple'], cons: ['Slow', 'Wasteful'] },
          { option: 'Server-side geo + availability filter', pros: ['Fast', 'Efficient'], cons: ['More complex queries'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Availability Calendar',
      phase: 'phase-1-beginner',
      description: 'Build the calendar system for hosts to manage when their property is available',
      order: 3,

      educationalContent: {
        title: 'Managing Rental Availability',
        explanation: `The availability calendar is the heart of a rental marketplace - it determines what guests can book and when hosts can accept.

**Calendar Data Model:**
\`\`\`typescript
interface CalendarDay {
  listingId: string;
  date: Date;  // Just the date, no time
  status: 'available' | 'blocked' | 'booked';
  price: number;  // Can vary by day
  minimumStay: number;
  bookingId?: string;  // If booked
}

// Stored per day, but queried in ranges
// Typical query: "Get calendar for listing X, March 2024"
\`\`\`

**Storage Strategy:**
Option 1: Store every day explicitly
- Simple queries
- 365 rows per listing per year
- 1M listings × 365 = 365M rows/year

Option 2: Store exceptions only
- Default: available at base price
- Only store blocked/booked dates and price overrides
- Much less data but complex queries

**Blocking Dates:**
Hosts block dates for:
- Personal use
- Maintenance
- External bookings (other platforms)

\`\`\`typescript
interface BlockedDateRange {
  listingId: string;
  startDate: Date;
  endDate: Date;
  reason: 'personal' | 'maintenance' | 'external_booking';
  externalPlatform?: string;  // "booking.com"
}
\`\`\`

**Minimum Stay Rules:**
\`\`\`typescript
interface MinimumStayRule {
  listingId: string;
  default: number;  // 2 nights
  weekendMinimum?: number;  // 3 nights Fri-Sun
  seasonalOverrides?: Array<{
    startDate: Date;
    endDate: Date;
    minimum: number;  // 7 nights for holidays
  }>;
}
\`\`\`

**Calendar Sync:**
Hosts list on multiple platforms:
- Import iCal feeds from Booking.com, VRBO
- Export iCal for our calendar
- Auto-block dates synced from other platforms`,
        keyInsight: 'Calendar systems must balance storage efficiency with query performance - storing exceptions is compact but checking availability for date ranges becomes complex',
        commonMistakes: [
          'Not handling timezone for international listings',
          'Ignoring minimum stay rules (frustrating for guests)',
          'Not supporting iCal sync (hosts use multiple platforms)'
        ],
        interviewTips: [
          'Discuss explicit vs exception-based storage tradeoffs',
          'Mention iCal sync for multi-platform hosts',
          'Talk about minimum stay rules that vary by season'
        ],
        realWorldExample: 'Airbnb imports iCal feeds every few hours from Booking.com and VRBO. When a listing is booked elsewhere, it auto-blocks on Airbnb to prevent double-booking.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Calendar Service', 'Calendar Database', 'Listing Service'],

      hints: [
        { trigger: 'stuck', content: 'Calendar needs to track availability per day, support blocking, and handle minimum stay rules' },
        { trigger: 'no_sync', content: 'Hosts use multiple platforms. Support iCal import/export to prevent double bookings.' },
        { trigger: 'no_min_stay', content: 'Minimum stay varies by season. A beach house might require 7 nights in summer.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Calendar Service' },
          { from: 'Calendar Service', to: 'Calendar Database' },
          { from: 'Calendar Service', to: 'Listing Service' }
        ],
        requiredComponents: ['Calendar Service', 'Calendar Database']
      },

      thinkingFramework: {
        approach: 'data-structure-choice',
        questions: [
          'How do we store availability efficiently?',
          'How do we handle variable pricing by day?',
          'How do we prevent double-bookings across platforms?'
        ],
        tradeoffs: [
          { option: 'Store every day', pros: ['Simple queries', 'Easy updates'], cons: ['More storage', 'Many rows'] },
          { option: 'Store exceptions only', pros: ['Compact'], cons: ['Complex range queries', 'Harder to understand'] }
        ]
      }
    },

    // ============== PHASE 2: BOOKING & PAYMENTS ==============
    {
      id: 'step-4',
      title: 'Booking Flow',
      phase: 'phase-2-intermediate',
      description: 'Implement the booking process with request-to-book and instant book options',
      order: 4,

      educationalContent: {
        title: 'Two-Sided Booking Process',
        explanation: `Airbnb supports two booking models: Instant Book (immediate confirmation) and Request to Book (host approval required).

**Booking Models:**

**Instant Book:**
\`\`\`
Guest clicks "Reserve" → Payment authorized → Booking confirmed
Host requirement: Must accept verified guests automatically
Benefit: Higher conversion, better search ranking
\`\`\`

**Request to Book:**
\`\`\`
Guest clicks "Request" → Payment held (not charged)
→ Host has 24h to accept/decline
→ If accepted: Payment captured, booking confirmed
→ If declined/expired: Payment released
\`\`\`

**Booking Data Model:**
\`\`\`typescript
interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;

  // Dates
  checkIn: Date;
  checkOut: Date;
  nights: number;

  // Guests
  adults: number;
  children: number;
  infants: number;

  // Pricing
  pricePerNight: number;
  subtotal: number;  // nights × price
  cleaningFee: number;
  serviceFee: number;  // Airbnb's cut
  taxes: number;
  total: number;

  // Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'authorized' | 'captured' | 'refunded';

  // Metadata
  guestMessage?: string;
  specialRequests?: string;
  createdAt: Date;
  confirmedAt?: Date;
}
\`\`\`

**Race Condition Prevention:**
Two guests booking same dates simultaneously:
\`\`\`
1. Check availability
2. LOCK calendar dates
3. Create booking
4. Process payment
5. Update calendar to "booked"
6. RELEASE lock
\`\`\`

**Optimistic Locking Alternative:**
\`\`\`sql
UPDATE calendar
SET status = 'booked', booking_id = ?
WHERE listing_id = ? AND date BETWEEN ? AND ?
  AND status = 'available';

-- If affected_rows < expected_nights → booking failed
\`\`\``,
        keyInsight: 'Booking requires careful handling of race conditions - two guests checking out simultaneously must not both succeed in booking the same dates',
        commonMistakes: [
          'Not handling concurrent booking attempts',
          'Charging guest before host accepts (Request to Book)',
          'Not implementing booking expiration for pending requests'
        ],
        interviewTips: [
          'Explain the difference between Instant Book and Request to Book',
          'Discuss optimistic vs pessimistic locking for availability',
          'Mention that payment is authorized but not captured for requests'
        ],
        realWorldExample: 'Airbnb uses optimistic locking with database constraints. If two guests try to book the same dates, the second UPDATE affects 0 rows and fails gracefully.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Booking Service', 'Booking Database', 'Calendar Service', 'Notification Service'],

      hints: [
        { trigger: 'stuck', content: 'Booking needs to handle both instant book and request-to-book flows' },
        { trigger: 'no_lock', content: 'Two guests can try to book same dates. Need locking or optimistic concurrency.' },
        { trigger: 'charge_early', content: 'For request-to-book, authorize payment but dont charge until host accepts.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Booking Service' },
          { from: 'Booking Service', to: 'Booking Database' },
          { from: 'Booking Service', to: 'Calendar Service' },
          { from: 'Booking Service', to: 'Notification Service' }
        ],
        requiredComponents: ['Booking Service', 'Booking Database', 'Notification Service']
      },

      thinkingFramework: {
        approach: 'concurrency-handling',
        questions: [
          'How do we prevent double-booking?',
          'What happens if host doesn\'t respond to a request?',
          'When do we charge the guest vs just authorize?'
        ],
        tradeoffs: [
          { option: 'Pessimistic locking', pros: ['Simple', 'Safe'], cons: ['Contention', 'Blocking'] },
          { option: 'Optimistic concurrency', pros: ['No blocking', 'Scalable'], cons: ['Retries needed', 'More complex'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Payment Processing',
      phase: 'phase-2-intermediate',
      description: 'Handle guest payments and host payouts with escrow',
      order: 5,

      educationalContent: {
        title: 'Marketplace Payment Flow',
        explanation: `Rental marketplaces have complex payment flows: guest pays, platform holds funds in escrow, then pays host after check-in.

**Payment Timeline:**
\`\`\`
Day 0: Booking confirmed
  → Guest's card charged
  → Funds held by Airbnb (escrow)

Day of check-in:
  → Host payout initiated (minus platform fee)
  → Typically arrives within 24 hours

For long stays (28+ nights):
  → Monthly payouts to host
  → Guest charged monthly
\`\`\`

**Pricing Breakdown:**
\`\`\`typescript
interface PricingBreakdown {
  // Guest pays
  nightly: number;
  nights: number;
  subtotal: number;      // nightly × nights
  cleaningFee: number;   // One-time
  serviceFee: number;    // 14% of subtotal (Airbnb's cut from guest)
  taxes: number;         // Varies by location
  guestTotal: number;

  // Host receives
  hostSubtotal: number;  // subtotal + cleaningFee
  hostServiceFee: number; // 3% (Airbnb's cut from host)
  hostPayout: number;    // hostSubtotal - hostServiceFee
}
\`\`\`

**Escrow Requirements:**
- Funds held until check-in
- Guest protection: refund if listing misrepresented
- Host protection: cancel policy enforced
- Regulatory: may need money transmitter license

**Payout Methods:**
\`\`\`typescript
interface PayoutMethod {
  hostId: string;
  type: 'bank_transfer' | 'paypal' | 'payoneer';
  currency: string;
  details: BankDetails | PayPalDetails;
  isDefault: boolean;
}
\`\`\`

**Split Payments (Long Stays):**
\`\`\`
30-night booking:
- First charge: nights 1-14 at booking
- Second charge: nights 15-28 two weeks before check-in
- Third charge: nights 29-30 at the same time
\`\`\`

**Currency Handling:**
Guest pays in their currency, host receives in theirs:
\`\`\`
Guest (USD) → Platform → Host (EUR)
Exchange rate locked at booking time
Platform may add FX spread
\`\`\``,
        keyInsight: 'Rental marketplace payments require escrow - the platform holds funds between guest payment and host payout, providing protection for both parties',
        commonMistakes: [
          'Paying host immediately (no guest protection)',
          'Not handling currency conversion for international bookings',
          'Ignoring money transmitter regulations'
        ],
        interviewTips: [
          'Explain the escrow model and why it\'s necessary',
          'Discuss split payments for long stays',
          'Mention regulatory requirements for holding funds'
        ],
        realWorldExample: 'Airbnb holds funds in escrow and releases payout to hosts ~24 hours after check-in. This protects guests if they arrive to find the listing doesn\'t match photos.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Payment Service', 'Stripe', 'Payout Service', 'Escrow Ledger'],

      hints: [
        { trigger: 'stuck', content: 'Payment flows through escrow: guest pays → platform holds → host receives after check-in' },
        { trigger: 'immediate_payout', content: 'Dont pay host immediately. Hold in escrow until guest checks in.' },
        { trigger: 'no_currency', content: 'International bookings need currency conversion. Lock rate at booking time.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Payment Service' },
          { from: 'Payment Service', to: 'Stripe' },
          { from: 'Payment Service', to: 'Escrow Ledger' },
          { from: 'Payment Service', to: 'Payout Service' }
        ],
        requiredComponents: ['Payment Service', 'Stripe', 'Escrow Ledger', 'Payout Service']
      },

      thinkingFramework: {
        approach: 'trust-mechanism',
        questions: [
          'How do we protect guests from misrepresented listings?',
          'How do we protect hosts from guest damage?',
          'When should funds be released to the host?'
        ],
        tradeoffs: [
          { option: 'Direct guest-to-host payment', pros: ['Simple', 'Faster for host'], cons: ['No protection', 'Disputes hard to resolve'] },
          { option: 'Escrow model', pros: ['Both parties protected', 'Dispute resolution'], cons: ['Complex', 'Regulatory burden'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'Messaging System',
      phase: 'phase-2-intermediate',
      description: 'Build real-time messaging between guests and hosts',
      order: 6,

      educationalContent: {
        title: 'Secure Guest-Host Communication',
        explanation: `Messaging is critical for coordinating bookings, but must be carefully designed to prevent off-platform transactions.

**Message Thread Model:**
\`\`\`typescript
interface MessageThread {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  bookingId?: string;  // Linked if booking exists

  // Thread metadata
  subject: string;  // Usually listing title
  status: 'active' | 'archived';
  lastMessageAt: Date;
}

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: 'text' | 'booking_request' | 'system';
  attachments?: string[];  // Photo URLs
  sentAt: Date;
  readAt?: Date;
}
\`\`\`

**Off-Platform Prevention:**
Guests trying to contact hosts directly costs the platform:
\`\`\`typescript
// Content moderation patterns
const blockedPatterns = [
  /\\d{10}/,  // Phone numbers
  /@[a-z]+\\.[a-z]+/,  // Email addresses
  /venmo|paypal|cash app/i,  // Payment apps
  /meet outside|pay cash/i,  // Off-platform intent
];

function moderateMessage(content: string): ModerationResult {
  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) {
      return { blocked: true, reason: 'contact_info_detected' };
    }
  }
  return { blocked: false };
}
\`\`\`

**System Messages:**
Auto-generated messages for transparency:
- "John requested to book Oct 15-20"
- "Sarah accepted your booking request"
- "Reminder: Check-in tomorrow at 3 PM"

**Real-Time Delivery:**
\`\`\`
Message sent → WebSocket to recipient (if online)
            → Push notification (if offline)
            → Email (if not read within 1 hour)
\`\`\`

**Response Time Tracking:**
Hosts with fast response times rank higher in search:
\`\`\`typescript
interface HostMetrics {
  responseRate: number;   // % of inquiries responded to
  responseTime: number;   // Average minutes to first response
  acceptanceRate: number; // % of requests accepted
}
\`\`\``,
        keyInsight: 'Rental marketplace messaging must balance usability with preventing off-platform transactions - moderate for contact info without being too restrictive',
        commonMistakes: [
          'Allowing contact info in messages (loses bookings)',
          'Not tracking response time (affects host rankings)',
          'Missing system messages for booking events'
        ],
        interviewTips: [
          'Discuss content moderation for contact info',
          'Explain why response time affects search ranking',
          'Mention the multi-channel delivery (WebSocket, push, email)'
        ],
        realWorldExample: 'Airbnb masks phone numbers and emails in messages with a warning: "It looks like you\'re sharing contact info. Keeping conversations on Airbnb protects you."'
      },

      requiredComponents: ['Client', 'API Gateway', 'Messaging Service', 'WebSocket Gateway', 'Message Database', 'Push Notification Service'],

      hints: [
        { trigger: 'stuck', content: 'Messaging needs real-time delivery plus content moderation to prevent off-platform contact' },
        { trigger: 'no_moderation', content: 'Users will share phone numbers and emails. Moderate messages to protect the platform.' },
        { trigger: 'no_realtime', content: 'Hosts expect instant message delivery. Use WebSocket for real-time.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'WebSocket Gateway' },
          { from: 'WebSocket Gateway', to: 'Messaging Service' },
          { from: 'Messaging Service', to: 'Message Database' },
          { from: 'Messaging Service', to: 'Push Notification Service' }
        ],
        requiredComponents: ['Messaging Service', 'WebSocket Gateway', 'Message Database', 'Push Notification Service']
      },

      thinkingFramework: {
        approach: 'platform-protection',
        questions: [
          'How do we prevent users from going off-platform?',
          'How do we ensure timely message delivery?',
          'What metrics affect host search ranking?'
        ],
        tradeoffs: [
          { option: 'No moderation', pros: ['Free communication'], cons: ['Lost bookings', 'No platform fees'] },
          { option: 'Aggressive blocking', pros: ['Protects platform'], cons: ['Frustrating UX', 'False positives'] }
        ]
      }
    },

    // ============== PHASE 3: TRUST & SCALE ==============
    {
      id: 'step-7',
      title: 'Review System',
      phase: 'phase-3-advanced',
      description: 'Implement two-sided reviews with timing controls to ensure honesty',
      order: 7,

      educationalContent: {
        title: 'Two-Sided Review System',
        explanation: `Unlike product reviews, rental reviews are two-sided - guests review hosts AND hosts review guests. Timing is critical for honest feedback.

**Review Model:**
\`\`\`typescript
interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  type: 'guest_to_host' | 'host_to_guest';

  // Ratings
  overall: number;  // 1-5 stars
  categories: {
    // Guest reviewing host
    cleanliness?: number;
    accuracy?: number;
    communication?: number;
    location?: number;
    checkIn?: number;
    value?: number;

    // Host reviewing guest
    houseRules?: number;
    communication?: number;
    cleanliness?: number;
  };

  // Text
  publicReview: string;
  privateNote?: string;  // Only visible to reviewed party

  // Status
  status: 'pending' | 'published' | 'hidden';
  submittedAt: Date;
  publishedAt?: Date;
}
\`\`\`

**Double-Blind Review System:**
Reviews are hidden until both parties submit OR 14 days pass:
\`\`\`
Day 0: Check-out
Day 1-14: Review window open
  - Guest submits review → "Waiting for host review"
  - Host submits review → Both reviews published simultaneously
Day 14: If either hasn't submitted → Submitted reviews published
\`\`\`

Why double-blind?
- Prevents retaliation reviews
- Encourages honest feedback
- Guest won't soften review to get good rating back

**Review Response:**
Hosts can respond publicly to reviews:
\`\`\`typescript
interface ReviewResponse {
  reviewId: string;
  hostId: string;
  content: string;
  submittedAt: Date;
}
\`\`\`

**Aggregate Ratings:**
\`\`\`typescript
interface ListingRating {
  overall: number;  // Weighted average of categories
  reviewCount: number;
  categoryAverages: {
    cleanliness: number;
    accuracy: number;
    // ...
  };
  superhost: boolean;  // 4.8+ with 10+ reviews
}
\`\`\``,
        keyInsight: 'Double-blind review submission prevents retaliation - neither party can see the other\'s review until both are submitted or the window expires',
        commonMistakes: [
          'Publishing reviews immediately (allows retaliation)',
          'Not separating public review from private feedback',
          'Missing category ratings (just overall is insufficient)'
        ],
        interviewTips: [
          'Explain the double-blind system and why it matters',
          'Discuss the 14-day review window',
          'Mention Superhost requirements (4.8+ rating)'
        ],
        realWorldExample: 'Airbnb\'s double-blind system was specifically designed after seeing retaliation patterns - hosts giving bad reviews to guests who left honest negative feedback.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Review Service', 'Review Database', 'Booking Service', 'Notification Service'],

      hints: [
        { trigger: 'stuck', content: 'Reviews are two-sided and double-blind - hidden until both parties submit or time expires' },
        { trigger: 'immediate_publish', content: 'Publishing immediately allows retaliation. Use double-blind submission.' },
        { trigger: 'no_categories', content: 'Overall rating isnt enough. Break down into categories like cleanliness, accuracy, etc.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Review Service' },
          { from: 'Review Service', to: 'Review Database' },
          { from: 'Review Service', to: 'Booking Service' }
        ],
        requiredComponents: ['Review Service', 'Review Database']
      },

      thinkingFramework: {
        approach: 'trust-building',
        questions: [
          'How do we encourage honest reviews?',
          'How do we prevent review manipulation?',
          'What makes a review helpful for future guests?'
        ],
        tradeoffs: [
          { option: 'Immediate publication', pros: ['Simpler'], cons: ['Retaliation risk', 'Biased reviews'] },
          { option: 'Double-blind with window', pros: ['Honest reviews'], cons: ['Delayed feedback', 'More complex'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Identity Verification',
      phase: 'phase-3-advanced',
      description: 'Build trust with ID verification for guests and hosts',
      order: 8,

      educationalContent: {
        title: 'Building Trust Through Verification',
        explanation: `In a marketplace where strangers stay in each other's homes, identity verification is crucial for safety and trust.

**Verification Levels:**
\`\`\`typescript
interface UserVerification {
  userId: string;

  email: {
    verified: boolean;
    verifiedAt?: Date;
  };

  phone: {
    verified: boolean;
    number?: string;
    verifiedAt?: Date;
  };

  government_id: {
    verified: boolean;
    documentType?: 'passport' | 'drivers_license' | 'national_id';
    issuingCountry?: string;
    verifiedAt?: Date;
    expiresAt?: Date;
  };

  selfie: {
    verified: boolean;
    matchedToId: boolean;
    verifiedAt?: Date;
  };

  background_check?: {
    completed: boolean;
    status: 'clear' | 'flagged';
    checkedAt?: Date;
  };
}
\`\`\`

**Verification Flow:**
\`\`\`
1. Email verification (click link)
2. Phone verification (SMS code)
3. Government ID upload
   → OCR extracts name, DOB, expiry
   → Check document validity
4. Selfie comparison
   → ML model matches face to ID photo
5. Background check (optional, host-requested)
\`\`\`

**Privacy & Compliance:**
- ID images encrypted at rest
- Deleted after verification (keep only status)
- GDPR/CCPA: right to deletion
- Different requirements by country

**Verified Badges:**
\`\`\`
✓ Identity verified (ID + selfie match)
✓ Superhost (top-rated hosts)
✓ Background check passed
\`\`\`

**Host Requirements:**
Some hosts require verification:
\`\`\`typescript
interface ListingRequirements {
  guestRequirements: {
    verifiedEmail: boolean;
    verifiedPhone: boolean;
    verifiedId: boolean;
    profilePhoto: boolean;
    minimumReviews?: number;
  };
}
\`\`\``,
        keyInsight: 'Verification builds trust on both sides - verified guests give hosts confidence, and verified hosts give guests confidence. The selfie-to-ID match prevents identity fraud.',
        commonMistakes: [
          'Storing ID images long-term (privacy/compliance issue)',
          'Not matching selfie to ID (someone else\'s ID)',
          'Making verification too difficult (friction reduces signups)'
        ],
        interviewTips: [
          'Discuss the balance between trust and friction',
          'Mention privacy requirements for ID storage',
          'Talk about ML for selfie-ID matching'
        ],
        realWorldExample: 'Airbnb partners with Jumio for ID verification - they use AI to verify document authenticity and match the selfie to the ID photo, with results in under a minute.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Verification Service', 'ID Verification Provider', 'User Database', 'Encrypted Storage'],

      hints: [
        { trigger: 'stuck', content: 'Verification needs email, phone, government ID, and selfie matching to ID photo' },
        { trigger: 'store_id', content: 'Dont store ID images long-term. Delete after verification for privacy compliance.' },
        { trigger: 'no_selfie', content: 'ID alone is insufficient - someone could use another persons ID. Match selfie to ID photo.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Verification Service' },
          { from: 'Verification Service', to: 'ID Verification Provider' },
          { from: 'Verification Service', to: 'User Database' }
        ],
        requiredComponents: ['Verification Service', 'ID Verification Provider']
      },

      thinkingFramework: {
        approach: 'trust-safety',
        questions: [
          'What verifications build meaningful trust?',
          'How do we verify ID without storing sensitive data?',
          'How do we balance security with signup friction?'
        ],
        tradeoffs: [
          { option: 'Minimal verification', pros: ['Easy signup', 'High conversion'], cons: ['Less trust', 'Safety risks'] },
          { option: 'Strict verification', pros: ['High trust', 'Safety'], cons: ['Friction', 'Lower conversion'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'Search Performance',
      phase: 'phase-3-advanced',
      description: 'Optimize search for high traffic periods with caching and load distribution',
      order: 9,

      educationalContent: {
        title: 'Search at Scale',
        explanation: `Travel search has extreme spikes - holiday weekends can see 10x normal traffic. The system must handle these peaks without degradation.

**Traffic Patterns:**
\`\`\`
Normal day: 100K searches/hour
Holiday weekend announcement: 1M searches/hour (10x spike)
New Year's: 2M searches/hour for "beach destinations"
\`\`\`

**Caching Strategy:**
\`\`\`typescript
// Search results cache
cacheKey = hash(location, dates, guests, filters)

// Problem: dates create infinite cache keys
// Solution: Bucket by week or month for popular destinations
cacheKey = hash(location, week_of_year, guests, basic_filters)

// Availability checked real-time, results cached
cachedResults.filter(listing =>
  isAvailable(listing.id, exactDates)
);
\`\`\`

**Search Index Sharding:**
\`\`\`
Shard by region:
- Shard 1: North America
- Shard 2: Europe
- Shard 3: Asia-Pacific
- Shard 4: Rest of World

Query routing:
- "Paris" → Shard 2 (Europe)
- "Tokyo" → Shard 3 (Asia-Pacific)
\`\`\`

**Async Search Pattern:**
For complex queries, use async:
\`\`\`
POST /search → returns search_id immediately
GET /search/{id}/results → poll for results

Benefits:
- Client doesn't timeout on slow searches
- Can show partial results as they arrive
- Backend can retry without client waiting
\`\`\`

**Degradation Strategy:**
When overloaded:
1. Serve cached results (possibly stale availability)
2. Reduce result quality (skip personalization)
3. Shed load (queue requests, return "try again")

**Read Replicas:**
\`\`\`
Primary: Writes (new listings, calendar updates)
Replicas: Search reads (can be slightly stale)

Replication lag: typically <1 second
Acceptable for search (availability confirmed at booking)
\`\`\``,
        keyInsight: 'Travel search can spike 10x during holidays - caching, sharding, and graceful degradation are essential for handling peaks',
        commonMistakes: [
          'Caching with exact dates (infinite keys)',
          'No degradation strategy (system crashes under load)',
          'Single search cluster (bottleneck)'
        ],
        interviewTips: [
          'Discuss date-bucketing for cache efficiency',
          'Explain regional sharding strategy',
          'Mention graceful degradation under load'
        ],
        realWorldExample: 'During peak travel booking periods, Airbnb serves slightly stale search results and confirms real-time availability only when user clicks on a listing - balancing freshness with performance.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Elasticsearch', 'Redis Cache', 'Load Balancer'],

      hints: [
        { trigger: 'stuck', content: 'Search needs caching with date-bucketing and regional sharding for scale' },
        { trigger: 'no_cache', content: 'Same searches happen millions of times. Cache with bucketed dates, check availability real-time.' },
        { trigger: 'single_cluster', content: 'One search cluster is a bottleneck. Shard by region for better distribution.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Load Balancer' },
          { from: 'Load Balancer', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Search Service' },
          { from: 'Search Service', to: 'Redis Cache' },
          { from: 'Search Service', to: 'Elasticsearch' }
        ],
        requiredComponents: ['Load Balancer', 'Redis Cache']
      },

      thinkingFramework: {
        approach: 'scalability',
        questions: [
          'How do we handle 10x traffic spikes?',
          'What can we cache without serving stale availability?',
          'How do we degrade gracefully under load?'
        ],
        tradeoffs: [
          { option: 'Always fresh results', pros: ['Accurate'], cons: ['Cant cache', 'Slow under load'] },
          { option: 'Cached with real-time availability check', pros: ['Fast', 'Scalable'], cons: ['Slight delay for availability'] }
        ]
      }
    },

    // ============== PHASE 4: INTELLIGENCE & EXPERIENCES ==============
    {
      id: 'step-10',
      title: 'Smart Pricing',
      phase: 'phase-4-expert',
      description: 'Build dynamic pricing recommendations for hosts based on demand and seasonality',
      order: 10,

      educationalContent: {
        title: 'Dynamic Pricing for Rentals',
        explanation: `Smart Pricing helps hosts maximize revenue by adjusting prices based on demand - similar to airline or hotel dynamic pricing.

**Pricing Factors:**
\`\`\`typescript
interface PricingSignals {
  // Demand signals
  searchVolume: number;      // Searches for this area/dates
  bookingVelocity: number;   // Bookings per day in area
  dayOfWeek: number;
  daysUntilCheckIn: number;

  // Supply signals
  availableListings: number; // Competing supply
  similarListingsPrice: number;

  // Seasonal
  holidays: string[];        // "New Year", "Christmas"
  localEvents: string[];     // "Comic-Con", "Marathon"
  season: string;            // "Summer peak"

  // Listing-specific
  reviewScore: number;
  superhostStatus: boolean;
  instantBook: boolean;
  responseRate: number;
}
\`\`\`

**Price Recommendation Model:**
\`\`\`
Base price (host sets): $150/night

Adjustments:
- Weekend: +20% → $180
- High demand (low supply): +15% → $207
- Holiday (New Year): +50% → $311
- 3 days until check-in, still available: -10% → $280
- Superhost: +5% quality premium

Final recommended price: $280/night
\`\`\`

**Host Controls:**
\`\`\`typescript
interface SmartPricingSettings {
  enabled: boolean;
  basePrice: number;
  minPrice: number;  // Never go below
  maxPrice: number;  // Never exceed
  adjustments: {
    weekend: boolean;
    seasonal: boolean;
    lastMinute: boolean;  // Reduce if unbooked
    events: boolean;
  };
}
\`\`\`

**Market Analysis:**
\`\`\`
Comparable listings:
- Same neighborhood
- Similar property type
- Similar capacity
- Similar amenities

Price percentile:
"Your listing is priced in the 75th percentile for your area"
"Lowering by $20 could increase bookings by 30%"
\`\`\`

**A/B Testing Prices:**
Test different price points:
- Show different prices to different users
- Measure conversion rates
- Find optimal price point`,
        keyInsight: 'Smart pricing balances host revenue (higher prices) with occupancy (lower prices = more bookings) - the optimal price maximizes total revenue, not nightly rate',
        commonMistakes: [
          'Only suggesting higher prices (hosts want bookings too)',
          'Not respecting host min/max constraints',
          'Ignoring last-minute discounting'
        ],
        interviewTips: [
          'Explain the multi-factor pricing model',
          'Discuss the tradeoff between rate and occupancy',
          'Mention comparable listing analysis'
        ],
        realWorldExample: 'Airbnb\'s Smart Pricing automatically lowers prices as check-in approaches if the listing is still available - a $200/night listing might drop to $150 for tonight\'s stay.'
      },

      requiredComponents: ['Pricing Service', 'ML Model Service', 'Market Data Service', 'Calendar Service', 'Event Database'],

      hints: [
        { trigger: 'stuck', content: 'Smart pricing considers demand, supply, seasonality, events, and listing quality' },
        { trigger: 'fixed_rules', content: 'Static rules miss nuance. Use ML to learn optimal prices from historical data.' },
        { trigger: 'only_increase', content: 'Sometimes lowering price increases total revenue through higher occupancy.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Pricing Service', to: 'ML Model Service' },
          { from: 'Pricing Service', to: 'Market Data Service' },
          { from: 'Pricing Service', to: 'Calendar Service' },
          { from: 'Market Data Service', to: 'Event Database' }
        ],
        requiredComponents: ['Pricing Service', 'ML Model Service', 'Market Data Service', 'Event Database']
      },

      thinkingFramework: {
        approach: 'revenue-optimization',
        questions: [
          'What factors influence optimal nightly price?',
          'How do we balance rate vs occupancy?',
          'How do we handle local events and holidays?'
        ],
        tradeoffs: [
          { option: 'High prices, low occupancy', pros: ['High per-night revenue'], cons: ['Empty nights earn nothing'] },
          { option: 'Optimized pricing', pros: ['Maximum total revenue'], cons: ['Complex', 'May confuse guests with variable pricing'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Personalized Search',
      phase: 'phase-4-expert',
      description: 'Implement ML-based search ranking personalized to user preferences',
      order: 11,

      educationalContent: {
        title: 'Personalized Search Ranking',
        explanation: `Two users searching "Paris" should see different results based on their preferences, history, and behavior patterns.

**Personalization Signals:**
\`\`\`typescript
interface UserProfile {
  // Explicit preferences
  savedListings: string[];
  savedSearches: SearchQuery[];

  // Behavioral signals
  viewedListings: Array<{
    listingId: string;
    viewDuration: number;
    photosViewed: number;
    scrollDepth: number;
  }>;
  bookingHistory: Booking[];

  // Inferred preferences
  preferredPropertyTypes: string[];
  preferredPriceRange: { min: number; max: number };
  preferredAmenities: string[];
  travelStyle: 'budget' | 'mid-range' | 'luxury';
  groupType: 'solo' | 'couple' | 'family' | 'group';
}
\`\`\`

**Ranking Model:**
\`\`\`
Score = w1×Relevance + w2×Quality + w3×Personalization + w4×Conversion

Where:
- Relevance: matches search filters
- Quality: review score, Superhost, response rate
- Personalization: matches user preferences
- Conversion: historical booking rate for this listing
\`\`\`

**Learning to Rank:**
Train on historical data:
\`\`\`
Features:
- User features (preferences, history)
- Listing features (price, rating, amenities)
- Query features (location, dates, guests)
- Context features (device, time of day)

Label: Did user book this listing?
Model: Gradient Boosted Trees or Neural Network
\`\`\`

**Cold Start Problem:**
New users have no history:
1. Use demographic similarities
2. Show diverse results to learn preferences
3. Quickly adapt as user interacts

**Exploration vs Exploitation:**
\`\`\`
Exploitation: Show listings user is most likely to book
Exploration: Show diverse listings to learn new preferences

Balance: 80% exploitation, 20% exploration
\`\`\``,
        keyInsight: 'Personalized search uses learning-to-rank on user behavior signals - the ranking model optimizes for booking probability, not just filter matching',
        commonMistakes: [
          'Same results for all users (ignores preferences)',
          'Only exploitation (filter bubble, no discovery)',
          'Not handling new users (cold start)'
        ],
        interviewTips: [
          'Explain learning-to-rank with booking as the target',
          'Discuss the exploration/exploitation tradeoff',
          'Mention cold start handling for new users'
        ],
        realWorldExample: 'Airbnb\'s search learns your preferences - if you consistently book entire homes with pools, future searches will rank those higher even without explicit filters.'
      },

      requiredComponents: ['Search Service', 'Personalization Service', 'ML Model Service', 'User Profile Service', 'Feature Store'],

      hints: [
        { trigger: 'stuck', content: 'Personalization uses user behavior signals to re-rank search results by booking probability' },
        { trigger: 'same_results', content: 'Different users should see different rankings based on their preferences and history.' },
        { trigger: 'no_exploration', content: 'All exploitation creates filter bubbles. Include some exploration for diversity.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Search Service', to: 'Personalization Service' },
          { from: 'Personalization Service', to: 'ML Model Service' },
          { from: 'Personalization Service', to: 'User Profile Service' },
          { from: 'Personalization Service', to: 'Feature Store' }
        ],
        requiredComponents: ['Personalization Service', 'ML Model Service', 'User Profile Service', 'Feature Store']
      },

      thinkingFramework: {
        approach: 'ml-system-design',
        questions: [
          'What signals indicate user preferences?',
          'How do we handle users with no history?',
          'How do we balance showing favorites vs discovering new options?'
        ],
        tradeoffs: [
          { option: 'No personalization', pros: ['Simple', 'Transparent'], cons: ['Suboptimal results', 'Lower conversion'] },
          { option: 'Heavy personalization', pros: ['Higher conversion'], cons: ['Filter bubble', 'Less discovery'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Experiences Marketplace',
      phase: 'phase-4-expert',
      description: 'Expand beyond stays to activities and experiences hosted by locals',
      order: 12,

      educationalContent: {
        title: 'Beyond Stays: Experiences Platform',
        explanation: `Airbnb Experiences extends the marketplace to activities - cooking classes, tours, workshops hosted by locals. It's a different product with different challenges.

**Experience Data Model:**
\`\`\`typescript
interface Experience {
  id: string;
  hostId: string;
  title: string;
  description: string;

  // Type
  category: 'food' | 'art' | 'sports' | 'nature' | 'nightlife' | 'culture';
  tags: string[];

  // Location
  location: {
    city: string;
    meetingPoint: string;  // Revealed after booking
    coordinates: { lat: number; lng: number };
  };

  // Scheduling
  duration: number;  // minutes
  schedule: ExperienceSchedule;

  // Capacity
  minGuests: number;
  maxGuests: number;

  // Pricing
  pricePerPerson: number;
  groupDiscount?: { minSize: number; discount: number };

  // Requirements
  requirements: string[];  // "Must be 18+", "Bring comfortable shoes"
  languages: string[];
  accessibility: AccessibilityInfo;
}
\`\`\`

**Scheduling Complexity:**
\`\`\`typescript
interface ExperienceSchedule {
  type: 'fixed' | 'flexible';

  // Fixed schedule
  instances?: Array<{
    date: Date;
    startTime: string;
    spotsAvailable: number;
  }>;

  // Flexible (on-demand)
  availability?: {
    daysOfWeek: number[];
    timeSlots: string[];
    bookingWindow: number;  // Days in advance
  };
}
\`\`\`

**Discovery Differences:**
- Stays: Search by dates first, then browse
- Experiences: Browse categories, filter by dates
- Need: Combined trips (stay + experiences)

**Quality Control:**
Experiences need stricter vetting:
\`\`\`
Vetting process:
1. Application with detailed description
2. Host interview (video call)
3. Quality review (sample experience)
4. Ongoing monitoring (ratings, reports)

Minimum standards:
- 4.7+ rating to stay listed
- Max 3 cancellations per month
- Response within 24 hours
\`\`\`

**Host Payout Timing:**
Different from stays:
\`\`\`
Stays: Payout 24h after check-in
Experiences: Payout 24h after experience completes
(Can't release before since experience might be cancelled)
\`\`\``,
        keyInsight: 'Experiences are a different product than stays - scheduling is per-instance rather than per-night, capacity is per-person, and quality vetting must be stricter for safety',
        commonMistakes: [
          'Treating experiences like stays (different scheduling model)',
          'Not vetting experience hosts (safety risk)',
          'Missing the opportunity to bundle stays + experiences'
        ],
        interviewTips: [
          'Explain how scheduling differs from stays',
          'Discuss the stricter quality vetting for experiences',
          'Mention cross-selling stays + experiences'
        ],
        realWorldExample: 'Airbnb Experiences suggests relevant activities when you book a stay - "While you\'re in Rome, try these cooking classes!" This increases average booking value significantly.'
      },

      requiredComponents: ['API Gateway', 'Experience Service', 'Experience Database', 'Schedule Service', 'Booking Service', 'Payment Service'],

      hints: [
        { trigger: 'stuck', content: 'Experiences have different scheduling (instances vs nights) and capacity (per-person vs property)' },
        { trigger: 'same_model', content: 'Experiences arent stays. Scheduling, capacity, and vetting all differ significantly.' },
        { trigger: 'no_bundle', content: 'Cross-sell experiences with stays. "Things to do in Paris during your trip."' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Experience Service' },
          { from: 'Experience Service', to: 'Experience Database' },
          { from: 'Experience Service', to: 'Schedule Service' },
          { from: 'Experience Service', to: 'Booking Service' },
          { from: 'Booking Service', to: 'Payment Service' }
        ],
        requiredComponents: ['Experience Service', 'Experience Database', 'Schedule Service']
      },

      thinkingFramework: {
        approach: 'product-expansion',
        questions: [
          'How do experiences differ from stays technically?',
          'What additional vetting is needed for experience hosts?',
          'How do we connect experiences with stay bookings?'
        ],
        tradeoffs: [
          { option: 'Separate experiences platform', pros: ['Optimized for use case'], cons: ['No cross-selling', 'Siloed'] },
          { option: 'Integrated platform', pros: ['Bundle deals', 'One app'], cons: ['More complex', 'Feature creep'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      // Clients
      { type: 'Client', category: 'client' },
      { type: 'Mobile App', category: 'client' },

      // Gateways
      { type: 'API Gateway', category: 'gateway' },
      { type: 'WebSocket Gateway', category: 'gateway' },
      { type: 'Load Balancer', category: 'gateway' },

      // Core Services
      { type: 'Listing Service', category: 'service' },
      { type: 'Search Service', category: 'service' },
      { type: 'Calendar Service', category: 'service' },
      { type: 'Booking Service', category: 'service' },
      { type: 'Payment Service', category: 'service' },
      { type: 'Payout Service', category: 'service' },
      { type: 'Messaging Service', category: 'service' },
      { type: 'Review Service', category: 'service' },
      { type: 'Verification Service', category: 'service' },
      { type: 'Notification Service', category: 'service' },
      { type: 'Push Notification Service', category: 'service' },

      // Advanced Services
      { type: 'Pricing Service', category: 'service' },
      { type: 'Personalization Service', category: 'service' },
      { type: 'ML Model Service', category: 'service' },
      { type: 'User Profile Service', category: 'service' },
      { type: 'Market Data Service', category: 'service' },
      { type: 'Experience Service', category: 'service' },
      { type: 'Schedule Service', category: 'service' },

      // External
      { type: 'Stripe', category: 'external' },
      { type: 'ID Verification Provider', category: 'external' },

      // Databases
      { type: 'Listing Database', category: 'database' },
      { type: 'Calendar Database', category: 'database' },
      { type: 'Booking Database', category: 'database' },
      { type: 'User Database', category: 'database' },
      { type: 'Message Database', category: 'database' },
      { type: 'Review Database', category: 'database' },
      { type: 'Event Database', category: 'database' },
      { type: 'Experience Database', category: 'database' },
      { type: 'Escrow Ledger', category: 'database' },

      // Storage
      { type: 'Object Storage', category: 'storage' },
      { type: 'Encrypted Storage', category: 'storage' },
      { type: 'Feature Store', category: 'storage' },

      // Search
      { type: 'Elasticsearch', category: 'search' },

      // Caching
      { type: 'Redis Cache', category: 'caching' }
    ]
  },

  learningObjectives: [
    'Design rental listing models with location privacy',
    'Implement geospatial search with map clustering',
    'Build availability calendars with external sync (iCal)',
    'Handle booking race conditions with optimistic locking',
    'Design marketplace payment flows with escrow',
    'Build two-sided review systems with double-blind submission',
    'Implement identity verification with privacy compliance',
    'Optimize search for traffic spikes with caching and sharding',
    'Build smart pricing with demand-based adjustments',
    'Implement personalized search ranking with ML',
    'Extend marketplace to experiences/activities'
  ],

  prerequisites: [
    'Understanding of geospatial concepts (coordinates, bounding boxes)',
    'Familiarity with payment processing (authorization vs capture)',
    'Basic knowledge of ML ranking systems',
    'Understanding of marketplace dynamics'
  ],

  interviewRelevance: {
    commonQuestions: [
      'Design Airbnb',
      'Design a hotel booking system',
      'How would you handle double-booking prevention?',
      'Design a review system that prevents retaliation',
      'How would you implement dynamic pricing?'
    ],
    keyTakeaways: [
      'Location privacy (approximate until booking confirmed)',
      'Calendar availability is core to rental marketplaces',
      'Escrow model protects both guests and hosts',
      'Double-blind reviews prevent retaliation',
      'Smart pricing balances rate vs occupancy',
      'Personalized search uses learning-to-rank on booking signals'
    ],
    frequentMistakes: [
      'Exposing exact address before booking',
      'Not handling concurrent booking race conditions',
      'Publishing reviews immediately (allows retaliation)',
      'No graceful degradation under traffic spikes'
    ]
  }
};
