import { GuidedTutorial } from '../../types/guidedTutorial';

export const parkingLotProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'parking-lot-progressive',
  title: 'Design a Parking Lot System',
  description: 'Build a parking management system from simple tracking to smart city integration',
  difficulty: 'medium',
  estimatedTime: '60 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Model parking lot structure with floors and spots',
    'Implement vehicle tracking and spot assignment',
    'Build pricing and payment systems',
    'Add reservation and dynamic pricing',
    'Integrate sensors and real-time availability'
  ],
  prerequisites: ['OOP design', 'Database basics', 'API design'],
  tags: ['parking', 'oop', 'real-time', 'iot', 'pricing'],

  progressiveStory: {
    title: 'Parking Lot Evolution',
    premise: "You're building a parking management system. Starting with a single lot, you'll evolve to manage a network of smart parking facilities with dynamic pricing and real-time availability.",
    phases: [
      { phase: 1, title: 'Basic Parking', description: 'Track vehicles and spots' },
      { phase: 2, title: 'Payment System', description: 'Pricing and ticketing' },
      { phase: 3, title: 'Smart Features', description: 'Reservations and dynamic pricing' },
      { phase: 4, title: 'Smart City Integration', description: 'Sensors and multi-lot network' }
    ]
  },

  steps: [
    // PHASE 1: Basic Parking (Steps 1-3)
    {
      id: 'step-1',
      title: 'Parking Lot Data Model',
      phase: 1,
      phaseTitle: 'Basic Parking',
      learningObjective: 'Model parking structure with spots and floors',
      thinkingFramework: {
        framework: 'Hierarchical Object Model',
        approach: 'ParkingLot → Floors → Rows → Spots. Each spot has type (compact, regular, handicapped, EV) and status (available, occupied, reserved).',
        keyInsight: 'Spot type determines what vehicles can park. Compact car can use regular spot but not vice versa. Model vehicle-spot compatibility.'
      },
      requirements: {
        functional: [
          'Model parking lot with floors and spots',
          'Define spot types (compact, regular, large, handicapped, EV)',
          'Track spot status (available, occupied, reserved)',
          'Support multiple entrance/exit points'
        ],
        nonFunctional: []
      },
      hints: [
        'Spot: {id, floor, row, number, type, status}',
        'Floor: {id, level, spot_count, spots: []}',
        'ParkingLot: {id, name, address, floors: [], entry_points: []}'
      ],
      expectedComponents: ['ParkingLot', 'Floor', 'ParkingSpot', 'SpotType'],
      successCriteria: ['Structure modeled correctly', 'Spot types defined'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Vehicle Entry & Spot Assignment',
      phase: 1,
      phaseTitle: 'Basic Parking',
      learningObjective: 'Handle vehicle entry and assign spots',
      thinkingFramework: {
        framework: 'Assignment Strategy',
        approach: 'Vehicle arrives → check capacity → find compatible spot → assign → issue ticket. Strategy: nearest to entrance, or fill floor-by-floor.',
        keyInsight: 'Assignment strategy affects walking distance and utilization. Nearest to entrance is user-friendly but creates hotspots. Balance load across floors.'
      },
      requirements: {
        functional: [
          'Record vehicle entry with license plate',
          'Find available spot matching vehicle type',
          'Assign spot and mark as occupied',
          'Issue parking ticket with entry time'
        ],
        nonFunctional: [
          'Spot assignment < 1 second'
        ]
      },
      hints: [
        'Vehicle: {license_plate, type, entry_time, assigned_spot}',
        'Ticket: {id, vehicle, spot, entry_time, status}',
        'Assignment: prefer same type, allow larger if none'
      ],
      expectedComponents: ['EntryGate', 'SpotAssigner', 'TicketIssuer', 'Vehicle'],
      successCriteria: ['Vehicles assigned spots', 'Tickets issued'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Vehicle Exit & Spot Release',
      phase: 1,
      phaseTitle: 'Basic Parking',
      learningObjective: 'Handle vehicle exit and release spots',
      thinkingFramework: {
        framework: 'Exit Flow',
        approach: 'Vehicle at exit → scan ticket → calculate duration → process payment → release spot → open gate. Spot immediately available for next vehicle.',
        keyInsight: 'Race condition: two vehicles try to get same spot. Use atomic operations or locking when assigning/releasing spots.'
      },
      requirements: {
        functional: [
          'Scan ticket at exit',
          'Calculate parking duration',
          'Release spot and mark available',
          'Update lot availability count'
        ],
        nonFunctional: [
          'Exit processing < 5 seconds'
        ]
      },
      hints: [
        'Duration = exit_time - entry_time',
        'Atomic: release spot and update count together',
        'Handle lost ticket scenario'
      ],
      expectedComponents: ['ExitGate', 'SpotReleaser', 'AvailabilityTracker'],
      successCriteria: ['Spots released correctly', 'Duration calculated'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Payment System (Steps 4-6)
    {
      id: 'step-4',
      title: 'Pricing Model',
      phase: 2,
      phaseTitle: 'Payment System',
      learningObjective: 'Implement flexible pricing rules',
      thinkingFramework: {
        framework: 'Rate Structure',
        approach: 'Hourly rate with variations: first hour flat, then per hour. Different rates by spot type. Maximum daily cap. Weekend/holiday rates.',
        keyInsight: 'Price = sum of applicable rates for each time segment. First 2 hours at rate A, hours 3-8 at rate B, daily cap C.'
      },
      requirements: {
        functional: [
          'Define hourly rates by spot type',
          'Support tiered pricing (first hour, additional hours)',
          'Apply daily maximum cap',
          'Different rates for weekday/weekend'
        ],
        nonFunctional: []
      },
      hints: [
        'Rate: {spot_type, hour_ranges: [{start, end, rate}], daily_cap}',
        'Calculate: iterate hours, apply matching rate, cap at daily max',
        'Grace period: first 15 minutes free'
      ],
      expectedComponents: ['PricingEngine', 'RateCard', 'DurationCalculator'],
      successCriteria: ['Prices calculated correctly', 'Caps applied'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Payment Processing',
      phase: 2,
      phaseTitle: 'Payment System',
      learningObjective: 'Handle multiple payment methods',
      thinkingFramework: {
        framework: 'Payment Gateway Integration',
        approach: 'Support cash, card, mobile payment. Integrate with payment provider. Handle failures gracefully. Issue receipt.',
        keyInsight: 'Pre-auth at entry for card payments. Charge actual amount at exit. Avoids stuck vehicles when payment fails.'
      },
      requirements: {
        functional: [
          'Support cash payment at exit',
          'Process card payments via terminal',
          'Support mobile payment (QR code)',
          'Generate receipt with breakdown'
        ],
        nonFunctional: [
          'Payment processing < 10 seconds'
        ]
      },
      hints: [
        'Payment: {ticket_id, amount, method, status, receipt_id}',
        'Card pre-auth: hold $50 at entry, adjust at exit',
        'Receipt: entry/exit time, duration, rate breakdown, total'
      ],
      expectedComponents: ['PaymentProcessor', 'CardTerminal', 'ReceiptGenerator'],
      successCriteria: ['Payments processed', 'Receipts generated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Membership & Subscriptions',
      phase: 2,
      phaseTitle: 'Payment System',
      learningObjective: 'Offer recurring parking subscriptions',
      thinkingFramework: {
        framework: 'Subscription Tiers',
        approach: 'Monthly pass: unlimited parking for flat fee. Reserved spot: guaranteed specific spot. Discounted rates: % off hourly rate.',
        keyInsight: 'Reserved spot reduces availability for others. Price premium should offset opportunity cost of dedicated spot.'
      },
      requirements: {
        functional: [
          'Create membership plans',
          'Assign reserved spots to members',
          'Apply member discounts at payment',
          'Handle subscription renewal/cancellation'
        ],
        nonFunctional: []
      },
      hints: [
        'Membership: {user_id, plan, reserved_spot, valid_until}',
        'Plans: monthly_pass, reserved_spot, discount_card',
        'Validate membership at entry, apply discount at exit'
      ],
      expectedComponents: ['MembershipService', 'SubscriptionManager', 'DiscountApplier'],
      successCriteria: ['Members recognized', 'Discounts applied correctly'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Smart Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Spot Reservation',
      phase: 3,
      phaseTitle: 'Smart Features',
      learningObjective: 'Allow advance spot booking',
      thinkingFramework: {
        framework: 'Time-Based Inventory',
        approach: 'Reserve spot for future time window. Handle no-shows. Overbooking: accept more reservations than spots (expect cancellations).',
        keyInsight: 'Reservation is a promise, not a guarantee of specific spot. Reserve "a compact spot" not "spot C-42". Assign specific spot at arrival.'
      },
      requirements: {
        functional: [
          'Create reservation for future time',
          'Hold spot inventory for reservation window',
          'Send confirmation and reminder',
          'Handle no-shows and cancellations'
        ],
        nonFunctional: [
          'Reservation confirmation < 3 seconds'
        ]
      },
      hints: [
        'Reservation: {user, spot_type, start_time, end_time, status}',
        'Inventory: available_spots - reserved_spots for time window',
        'No-show: release after 30 min grace period'
      ],
      expectedComponents: ['ReservationService', 'InventoryManager', 'NotificationService'],
      successCriteria: ['Reservations created', 'Inventory updated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Dynamic Pricing',
      phase: 3,
      phaseTitle: 'Smart Features',
      learningObjective: 'Adjust prices based on demand',
      thinkingFramework: {
        framework: 'Demand-Based Pricing',
        approach: 'Higher occupancy = higher prices. Event nearby = surge pricing. Off-peak hours = discount. Goal: maximize revenue and smooth demand.',
        keyInsight: 'Price elasticity varies. Commuters are price-insensitive (must park). Shoppers will go elsewhere if too expensive. Segment accordingly.'
      },
      requirements: {
        functional: [
          'Track occupancy rate in real-time',
          'Adjust prices based on occupancy thresholds',
          'Apply event-based surge pricing',
          'Offer off-peak discounts'
        ],
        nonFunctional: [
          'Price updates within 5 minutes of occupancy change'
        ]
      },
      hints: [
        'Occupancy tiers: <50% = base, 50-80% = 1.2x, >80% = 1.5x',
        'Event integration: fetch nearby events, apply surge',
        'Display current rate at entrance'
      ],
      expectedComponents: ['DynamicPricingEngine', 'OccupancyMonitor', 'EventIntegration'],
      successCriteria: ['Prices adjust dynamically', 'Revenue increases'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Wayfinding & Navigation',
      phase: 3,
      phaseTitle: 'Smart Features',
      learningObjective: 'Guide drivers to available spots',
      thinkingFramework: {
        framework: 'Indoor Navigation',
        approach: 'Display available spots per floor at entrance. LED indicators at each spot (green/red). Guide to nearest available spot.',
        keyInsight: 'Reduce cruising time. Time spent looking for spot = frustrated user + congestion. Direct guidance improves throughput.'
      },
      requirements: {
        functional: [
          'Display real-time availability per floor',
          'Guide to nearest available spot',
          'Update spot indicators in real-time',
          'Handle spot taken while en route'
        ],
        nonFunctional: [
          'Display update < 1 second'
        ]
      },
      hints: [
        'Floor display: "Floor 2: 15 spots available"',
        'Guidance: turn-by-turn to assigned spot',
        'Spot taken: redirect to next nearest'
      ],
      expectedComponents: ['DisplayBoard', 'NavigationService', 'SpotIndicator'],
      successCriteria: ['Drivers guided efficiently', 'Displays accurate'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Smart City Integration (Steps 10-12)
    {
      id: 'step-10',
      title: 'IoT Sensor Integration',
      phase: 4,
      phaseTitle: 'Smart City Integration',
      learningObjective: 'Use sensors for automatic detection',
      thinkingFramework: {
        framework: 'Sensor-Based Automation',
        approach: 'Sensors in each spot detect presence. No ticket needed - camera reads plate at entry/exit. Fully automated parking experience.',
        keyInsight: 'Sensor types: ultrasonic (cheap, unreliable), magnetic (accurate, expensive), camera (plate recognition). Choose based on accuracy needs and budget.'
      },
      requirements: {
        functional: [
          'Receive occupancy data from spot sensors',
          'Detect vehicle entry/exit via cameras',
          'Read license plates automatically (ALPR)',
          'Handle sensor failures gracefully'
        ],
        nonFunctional: [
          'Sensor update frequency: every 5 seconds',
          'ALPR accuracy > 95%'
        ]
      },
      hints: [
        'Sensor event: {spot_id, occupied: bool, timestamp}',
        'ALPR: camera at entry/exit, OCR on plate image',
        'Fallback: manual entry if ALPR fails'
      ],
      expectedComponents: ['SensorGateway', 'ALPRService', 'OccupancyAggregator'],
      successCriteria: ['Sensors update status', 'Plates recognized accurately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Multi-Lot Network',
      phase: 4,
      phaseTitle: 'Smart City Integration',
      learningObjective: 'Manage network of parking facilities',
      thinkingFramework: {
        framework: 'Distributed Management',
        approach: 'Central platform manages multiple lots. Cross-lot memberships. Redirect users to nearby lot if one is full. Aggregate analytics.',
        keyInsight: 'Network effect: user searches "parking near X", system shows all lots with availability. Better than lot-by-lot search.'
      },
      requirements: {
        functional: [
          'Manage multiple parking lots centrally',
          'Show availability across all lots',
          'Redirect to nearby lot when full',
          'Cross-lot membership validity'
        ],
        nonFunctional: [
          'Cross-lot search < 2 seconds'
        ]
      },
      hints: [
        'Lot registry: {lot_id, location, capacity, current_occupancy}',
        'Search: nearby lots sorted by distance + availability',
        'Membership: valid at all lots in network'
      ],
      expectedComponents: ['LotRegistry', 'NetworkSearch', 'RedirectService'],
      successCriteria: ['Multi-lot search works', 'Memberships work across lots'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Analytics & Forecasting',
      phase: 4,
      phaseTitle: 'Smart City Integration',
      learningObjective: 'Predict demand and optimize operations',
      thinkingFramework: {
        framework: 'Data-Driven Operations',
        approach: 'Historical data predicts future demand. Optimize staffing, maintenance windows, pricing. ML forecasts demand by hour/day.',
        keyInsight: 'Parking demand is predictable. Weekday morning = commuters, Saturday afternoon = shoppers. Model patterns, forecast demand.'
      },
      requirements: {
        functional: [
          'Track historical occupancy patterns',
          'Forecast demand by hour/day/week',
          'Recommend optimal pricing based on forecast',
          'Generate operational reports'
        ],
        nonFunctional: [
          'Forecast accuracy within 15%'
        ]
      },
      hints: [
        'Features: day_of_week, hour, nearby_events, weather',
        'Model: time series (ARIMA) or ML (gradient boosting)',
        'Dashboard: real-time occupancy, forecast, revenue'
      ],
      expectedComponents: ['AnalyticsEngine', 'DemandForecaster', 'ReportGenerator'],
      successCriteria: ['Forecasts reasonably accurate', 'Reports actionable'],
      estimatedTime: '8 minutes'
    }
  ]
};
