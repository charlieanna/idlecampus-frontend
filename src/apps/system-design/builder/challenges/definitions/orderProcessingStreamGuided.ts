import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Order Processing Stream Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches event-driven architecture concepts
 * while building an order processing system with saga patterns and event sourcing.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working order workflow
 * Steps 4-6: Add saga pattern, compensation, and event sourcing
 *
 * Key Concepts:
 * - Order state management
 * - Event-driven architecture
 * - Saga pattern for distributed transactions
 * - Compensation and rollback
 * - Event sourcing
 * - Inventory reservation
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const orderProcessingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an order processing system with event streaming",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Engineering at CommerceFlow',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-order-flow',
      category: 'functional',
      question: "What's the core flow for processing an order?",
      answer: "We need to:\n\n1. **Receive order** - Customer places order for products\n2. **Reserve inventory** - Lock stock so no one else can buy it\n3. **Process payment** - Charge customer's payment method\n4. **Update inventory** - Deduct from available stock\n5. **Fulfill order** - Ship products to customer\n6. **Handle failures** - Rollback if any step fails",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Order processing is a multi-step workflow where each step can fail independently",
    },
    {
      id: 'order-states',
      category: 'functional',
      question: "What states can an order be in?",
      answer: "Orders transition through states:\n\n- **PENDING** - Just created, waiting for processing\n- **PAYMENT_PROCESSING** - Charging payment method\n- **PAYMENT_FAILED** - Payment declined\n- **CONFIRMED** - Payment succeeded, inventory reserved\n- **FULFILLING** - Being prepared for shipment\n- **SHIPPED** - In transit to customer\n- **DELIVERED** - Customer received\n- **CANCELLED** - Order was cancelled (refund if paid)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Clear state machines prevent orders from getting stuck in invalid states",
    },
    {
      id: 'payment-integration',
      category: 'functional',
      question: "How do we handle payment processing?",
      answer: "We integrate with a payment provider (like Stripe):\n\n1. **Authorize** - Hold funds on customer's card\n2. **Capture** - Actually charge the card (after inventory confirmed)\n3. **Refund** - Return money if order cancelled\n\nTwo-phase approach prevents charging for out-of-stock items!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Payment authorization before capture prevents charging customers for items we can't ship",
    },
    {
      id: 'inventory-management',
      category: 'functional',
      question: "How do we prevent overselling inventory?",
      answer: "Critical! We use **inventory reservation**:\n\n1. When order placed → Reserve stock (make it unavailable)\n2. If payment succeeds → Commit reservation (deduct stock)\n3. If payment fails → Release reservation (return stock)\n\nReservations expire after 15 minutes if payment not completed.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Inventory reservation prevents race conditions where two customers buy the last item simultaneously",
    },
    {
      id: 'failure-handling',
      category: 'clarification',
      question: "What happens if payment succeeds but inventory update fails?",
      answer: "This is where **sagas** come in! We need compensating transactions:\n\n**Happy path:** Reserve → Pay → Deduct inventory → Ship\n**Failure path:** If deduct fails → Refund payment → Release reservation\n\nSagas coordinate distributed transactions across services.",
      importance: 'critical',
      insight: "Saga pattern provides distributed transaction coordination without two-phase commit",
    },
    {
      id: 'event-sourcing',
      category: 'clarification',
      question: "How do we track order history for customer support?",
      answer: "Use **event sourcing** - store all order events:\n\n- OrderCreated\n- InventoryReserved\n- PaymentAuthorized\n- PaymentCaptured\n- OrderShipped\n- OrderDelivered\n\nReconstruct order state by replaying events. Perfect audit trail!",
      importance: 'important',
      insight: "Event sourcing provides complete audit trail and enables time travel for debugging",
    },
    {
      id: 'idempotency',
      category: 'clarification',
      question: "What if the same order is submitted twice due to network retry?",
      answer: "Use **idempotency keys**! Each order has a unique ID. If we see the same order ID twice:\n\n- First time: Process normally\n- Second time: Return cached result\n\nPrevents duplicate orders when customer clicks 'Buy' twice.",
      importance: 'critical',
      insight: "Idempotency prevents duplicate orders from network retries or impatient customers",
    },

    // SCALE & NFRs
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day should we handle?",
      answer: "5 million orders per day at steady state, spiking to 25 million during sales events",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 orders/sec",
        result: "~58 orders/sec average, ~290 orders/sec peak",
      },
      learningPoint: "Sales events like Black Friday create 5x normal order volume",
    },
    {
      id: 'latency-order-creation',
      category: 'latency',
      question: "How fast should order creation be?",
      answer: "p99 under 2 seconds from 'Place Order' to confirmation. Customers are waiting at checkout - slow confirmations hurt conversion.",
      importance: 'critical',
      learningPoint: "Order processing latency directly impacts sales conversion rates",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "Can we show stale inventory numbers to customers?",
      answer: "For display: Eventually consistent is OK (showing 5 in stock when actually 3)\n\nFor reservation: Strong consistency required (can't reserve item that's gone)\n\nUse eventual consistency for reads, strong for writes.",
      importance: 'critical',
      learningPoint: "Different consistency requirements for read vs write paths",
    },
    {
      id: 'order-reliability',
      category: 'reliability',
      question: "What happens if order service crashes mid-order?",
      answer: "Events are durable! Order events are written to Kafka before responding to customer. Even if service crashes, events persist and can be replayed.\n\nOn restart, service catches up by consuming events from where it left off.",
      importance: 'critical',
      learningPoint: "Event log durability ensures no orders are lost during failures",
    },
    {
      id: 'compensation',
      category: 'reliability',
      question: "How do we handle partial failures in the order workflow?",
      answer: "Saga pattern with compensation:\n\n**Each step has a compensating action:**\n- Reserve inventory ↔ Release reservation\n- Authorize payment ↔ Void authorization\n- Capture payment ↔ Refund payment\n\nIf any step fails, execute compensating actions in reverse order.",
      importance: 'critical',
      learningPoint: "Compensation transactions enable rollback in distributed systems",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-order-flow', 'payment-integration', 'inventory-management', 'failure-handling'],
  criticalFRQuestionIds: ['core-order-flow', 'order-states', 'payment-integration'],
  criticalScaleQuestionIds: ['throughput-orders', 'consistency-requirements', 'order-reliability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Order state management',
      description: 'Track orders through states: pending, confirmed, shipped, delivered',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Payment processing',
      description: 'Authorize, capture, and refund payments',
      emoji: '💳',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Inventory reservation',
      description: 'Reserve stock during order, commit or release based on payment',
      emoji: '📦',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Order fulfillment',
      description: 'Ship orders and track delivery status',
      emoji: '🚚',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Failure compensation',
      description: 'Rollback failed orders with compensating transactions',
      emoji: '↩️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500,000 customers',
    writesPerDay: '5 million orders',
    readsPerDay: '50 million order status checks',
    peakMultiplier: 5,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 58, peak: 290 },
    calculatedReadRPS: { average: 579, peak: 2895 },
    maxPayloadSize: '~10KB (order with items)',
    storagePerRecord: '~5KB (order)',
    storageGrowthPerYear: '~9TB',
    redirectLatencySLA: 'p99 < 2s (order creation)',
    createLatencySLA: 'p99 < 100ms (status check)',
  },

  architecturalImplications: [
    '✅ Event-driven architecture → Kafka for order events',
    '✅ Saga pattern → Orchestrate multi-step workflow with compensation',
    '✅ Event sourcing → Store all order events for audit trail',
    '✅ Strong consistency for inventory → Distributed locking or database transactions',
    '✅ Idempotency → Deduplicate order submissions',
    '✅ Async processing → Decouple order creation from fulfillment',
  ],

  outOfScope: [
    'Shipping carrier integration',
    'Tax calculation',
    'Fraud detection',
    'Returns and exchanges',
    'Gift cards and promotions',
    'Multi-warehouse routing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple order workflow where orders are created, paid, and fulfilled. The saga pattern, compensation logic, and event sourcing come in later steps. Functionality first, then resilience!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛒',
  scenario: "Welcome to CommerceFlow! You've been hired to build an order processing system.",
  hook: "Customers are ready to buy, but you have no system to process their orders!",
  challenge: "Set up the basic request flow so customers can place orders.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your order system is online!',
  achievement: 'Customers can now submit orders to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting orders', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process orders yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Order Processing Architecture',
  conceptExplanation: `Every order processing system starts with a **Client** submitting orders to a **Server**.

When a customer places an order:
1. The shopping cart (Client) sends order details to your backend
2. Your **Order Service** (Server) receives and validates the order
3. The system processes payment, reserves inventory, and initiates fulfillment

This is the foundation of e-commerce!`,

  whyItMatters: 'Without this connection, customers cannot complete purchases.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing millions of orders daily',
    howTheyDoIt: 'Distributed order processing system that handles peak loads during Prime Day',
  },

  keyPoints: [
    'Client = customer\'s shopping cart or checkout page',
    'Order Service = backend that orchestrates order workflow',
    'HTTPS = secure protocol for order data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Shopping cart submitting order', icon: '🛒' },
    { title: 'Order Service', explanation: 'Orchestrates order workflow', icon: '⚙️' },
    { title: 'Order Request', explanation: 'Items, quantities, payment info', icon: '📝' },
  ],
};

const step1: GuidedStep = {
  id: 'order-processing-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customer checkout/cart', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles order processing logic', displayName: 'Order Service' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Order Workflow APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to process orders!",
  hook: "A customer tried to place an order for $149.99 but got a 404 error. The sale is lost!",
  challenge: "Write the Python code to handle order creation, payment, and status updates.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your order APIs are live!',
  achievement: 'You implemented the core order processing workflow',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create orders', after: '✓' },
    { label: 'Can process payments', after: '✓' },
    { label: 'Can track status', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all order data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Order Workflow Implementation: State Management',
  conceptExplanation: `Every order processing system needs handlers for the workflow:

**Core Handlers:**
- \`create_order()\` - Validate items, calculate total, create order record
- \`process_payment()\` - Charge customer's payment method
- \`update_order_status()\` - Track order through states
- \`get_order_status()\` - Allow customer to check order progress

**Order State Machine:**
PENDING → PAYMENT_PROCESSING → CONFIRMED → FULFILLING → SHIPPED → DELIVERED

Each transition triggers specific business logic (reserve inventory, send notifications, etc.)

For now, we'll store orders in memory.`,

  whyItMatters: 'Clear state management prevents orders from getting stuck or lost in the workflow.',

  famousIncident: {
    title: 'Target Canada Order Processing Failure',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s order system in Canada had bugs where orders got stuck in processing state. Inventory wasn\'t reserved properly, leading to overselling. Stores ran out of stock while system showed items available. Cost them millions and contributed to their Canada exit.',
    lessonLearned: 'State machine logic must be bulletproof. Test all transitions, especially failure paths.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing orders for 2+ million merchants',
    howTheyDoIt: 'Clear state machine with event-driven transitions, comprehensive error handling, and automatic retry logic',
  },

  keyPoints: [
    'Orders transition through well-defined states',
    'Each state transition triggers business logic',
    'Validate state transitions (can\'t ship before payment!)',
    'Store order events for audit trail',
  ],

  quickCheck: {
    question: 'Why use a state machine for order processing?',
    options: [
      'It\'s easier to code',
      'Prevents invalid transitions (like shipping before payment)',
      'It\'s faster',
      'Customers prefer it',
    ],
    correctIndex: 1,
    explanation: 'State machines enforce valid transitions and prevent orders from entering invalid states.',
  },

  keyConcepts: [
    { title: 'State Machine', explanation: 'Enforces valid order transitions', icon: '🔄' },
    { title: 'State Transition', explanation: 'Moving order from one state to another', icon: '➡️' },
    { title: 'Order Validation', explanation: 'Check items, stock, payment method', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'order-processing-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Order state management, FR-2: Payment processing',
    taskDescription: 'Configure APIs and implement Python handlers for order workflow',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/orders, POST /api/v1/orders/:id/payment, GET /api/v1/orders/:id APIs',
      'Open the Python tab',
      'Implement create_order(), process_payment(), and get_order_status() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the App Server, then go to the APIs tab to assign order endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_order, process_payment, and get_order_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/orders', 'POST /api/v1/orders/:id/payment', 'GET /api/v1/orders/:id'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Order Records
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed during a flash sale...",
  hook: "When it came back, ALL order records were GONE! Customers were charged but have no order confirmation. Customer service is overwhelmed!",
  challenge: "Add a database so order data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your order records are safe!',
  achievement: 'Order data now persists with transactional guarantees',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Order durability', after: '100%' },
    { label: 'Transaction safety', after: '✓' },
  ],
  nextTeaser: "But we need to handle distributed transactions across services...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Are Critical for Orders',
  conceptExplanation: `For order processing, losing data is **catastrophic**.

A **database** provides:
- **Durability**: Order records survive crashes
- **ACID guarantees**: Atomic order creation and updates
- **Audit trail**: Complete order history for customer support
- **Queries**: Efficient lookups for order status

For order processing, we need tables for:
- \`orders\` - Order header (customer, total, status, timestamps)
- \`order_items\` - Line items (product, quantity, price)
- \`order_events\` - Event sourcing (all state changes)
- \`inventory_reservations\` - Locked stock during checkout
- \`payment_transactions\` - Payment attempts and results`,

  whyItMatters: 'Losing order data means:\n1. Customers were charged but have no record\n2. Can\'t fulfill orders\n3. No audit trail for disputes\n4. Legal and financial liability',

  famousIncident: {
    title: 'Zulily Order Processing Outage',
    company: 'Zulily',
    year: '2016',
    whatHappened: 'During a flash sale, their database couldn\'t handle the write load. Orders were accepted but not saved. Customers were charged but orders weren\'t processed. They had to manually reconcile thousands of orders.',
    lessonLearned: 'Database reliability and capacity planning are critical. Always provision for peak load + buffer.',
    icon: '🏷️',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Storing billions of order records',
    howTheyDoIt: 'Uses DynamoDB for order data with provisioned capacity, auto-scaling, and point-in-time recovery',
  },

  keyPoints: [
    'Store all order data in transactional database',
    'Use event sourcing pattern for audit trail',
    'Index on customer_id, order_id, status for fast queries',
    'Never delete orders - use soft deletes and archival',
  ],

  quickCheck: {
    question: 'What happens to in-memory order data when a server restarts?',
    options: [
      'It\'s automatically backed up',
      'It\'s recovered from cache',
      'It\'s completely lost - catastrophic for e-commerce',
      'It\'s saved to logs',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. For order systems, this is unacceptable - you MUST use durable storage.',
  },

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Event Sourcing', explanation: 'Store all order events for audit trail', icon: '📜' },
    { title: 'Durability', explanation: 'Data survives crashes', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'order-processing-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, transactional storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store orders, items, events, and inventory', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue for Event-Driven Workflow
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌊',
  scenario: "Your order service is doing too much! It handles payment, inventory, and shipping all synchronously.",
  hook: "Order creation now takes 5+ seconds because it waits for payment, inventory check, and shipping label generation. Cart abandonment rate is spiking!",
  challenge: "Add event streaming to decouple order workflow steps.",
  illustration: 'slow-processing',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Order creation is now instant!',
  achievement: 'Event-driven architecture decouples workflow steps',
  metrics: [
    { label: 'Order creation time', before: '5s', after: '<500ms' },
    { label: 'Processing mode', before: 'Synchronous', after: 'Async' },
    { label: 'System coupling', before: 'Tight', after: 'Loose' },
  ],
  nextTeaser: "But we need to coordinate distributed transactions...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Event-Driven Architecture: Decoupling Order Workflow',
  conceptExplanation: `Order processing is a **multi-step workflow**. Doing everything synchronously is slow and fragile.

**Synchronous (Bad):**
1. Create order
2. Wait for payment
3. Wait for inventory
4. Wait for shipping
→ Total: 5+ seconds, fails if any service is down

**Event-Driven (Good):**
1. Create order → Publish OrderCreated event (fast!)
2. Payment service subscribes → Processes payment → Publishes PaymentCompleted
3. Inventory service subscribes → Reserves stock → Publishes InventoryReserved
4. Fulfillment service subscribes → Creates shipment → Publishes OrderShipped

Each service works independently. Order creation returns instantly!

**Event Types:**
- OrderCreated
- PaymentAuthorized
- PaymentCaptured
- InventoryReserved
- OrderConfirmed
- OrderShipped
- OrderDelivered`,

  whyItMatters: 'Synchronous processing creates tight coupling. If payment service is slow, orders are slow. Event-driven architecture enables independent scaling and resilience.',

  famousIncident: {
    title: 'Best Buy Cyber Monday Crash',
    company: 'Best Buy',
    year: '2014',
    whatHappened: 'Their synchronous order processing system couldn\'t handle Cyber Monday traffic. Orders were taking 30+ seconds. System crashed. They lost millions in sales during peak hours.',
    lessonLearned: 'Moved to event-driven architecture. Order creation became instant, downstream processing happened asynchronously.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing millions of orders daily',
    howTheyDoIt: 'Event-driven architecture with Kafka. Order creation is instant, fulfillment happens asynchronously via event streams',
  },

  diagram: `
Order Created
     │
     ▼
┌─────────┐
│  Kafka  │  Order events stream
│  Topic  │
└────┬────┘
     │
     ├───▶ Payment Service (subscribes to OrderCreated)
     ├───▶ Inventory Service (subscribes to OrderCreated)
     └───▶ Fulfillment Service (subscribes to PaymentCompleted)

Each service processes independently!
`,

  keyPoints: [
    'Publish events instead of calling services directly',
    'Services subscribe to events they care about',
    'Order creation returns instantly',
    'Downstream processing happens asynchronously',
  ],

  quickCheck: {
    question: 'Why is event-driven architecture better than synchronous calls for orders?',
    options: [
      'It\'s easier to implement',
      'Decouples services, enables instant order creation and independent scaling',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Event-driven architecture decouples services, making order creation instant while processing happens asynchronously.',
  },

  keyConcepts: [
    { title: 'Event', explanation: 'Fact about something that happened', icon: '📋' },
    { title: 'Publisher', explanation: 'Service that publishes events', icon: '📤' },
    { title: 'Subscriber', explanation: 'Service that consumes events', icon: '📥' },
  ],
};

const step4: GuidedStep = {
  id: 'order-processing-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from event-driven workflow',
    taskDescription: 'Add a Message Queue for event streaming',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Stream order events between services', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue to enable event streaming',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Implement Saga Pattern for Distributed Transactions
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💥',
  scenario: "CRITICAL BUG DISCOVERED! Payment succeeded but inventory update failed.",
  hook: "Customer was charged $299 but order shows as 'Failed'. Now we have to manually refund them. This happens 50 times per day!",
  challenge: "Implement the Saga pattern to handle failures with compensating transactions.",
  illustration: 'system-error',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Sagas handle failures automatically!',
  achievement: 'Compensating transactions ensure consistency across services',
  metrics: [
    { label: 'Manual refunds', before: '50/day', after: '0' },
    { label: 'Automatic rollback', after: 'Enabled' },
    { label: 'Data consistency', after: '99.9%' },
  ],
  nextTeaser: "But we need to add compensation logic for all steps...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Saga Pattern: Distributed Transaction Coordination',
  conceptExplanation: `In distributed systems, you **can't use traditional ACID transactions** across services.

**The Problem:**
1. Reserve inventory (Service A)
2. Process payment (Service B)
3. Create shipment (Service C)

What if step 2 succeeds but step 3 fails? Money charged but no shipment!

**The Solution: SAGA PATTERN**

A saga is a sequence of local transactions with compensating transactions for rollback.

**Choreography Saga (Event-Driven):**
\`\`\`
OrderCreated
  → InventoryService reserves stock → InventoryReserved
  → PaymentService charges card → PaymentCaptured
  → FulfillmentService ships → OrderShipped

If PaymentCaptured fails:
  → PaymentService publishes PaymentFailed
  → InventoryService subscribes → Releases reservation
\`\`\`

**Compensating Actions:**
- Reserve inventory ↔ Release reservation
- Authorize payment ↔ Void authorization
- Capture payment ↔ Refund payment
- Create shipment ↔ Cancel shipment`,

  whyItMatters: 'Without sagas, partial failures leave system in inconsistent state. Customer charged but order not fulfilled, or inventory reserved but payment failed.',

  famousIncident: {
    title: 'Walmart.com Order Saga Failure',
    company: 'Walmart',
    year: '2015',
    whatHappened: 'During a promotion, their order system had a bug where inventory was reserved but payment authorization failed silently. Customers couldn\'t checkout (inventory "sold out") but no orders were actually placed. Lost $5M in a single day.',
    lessonLearned: 'Implemented proper saga pattern with compensating transactions. Failures now trigger automatic rollback.',
    icon: '🏪',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Coordinating ride workflow across services',
    howTheyDoIt: 'Uses saga pattern for ride lifecycle: request → match → start → complete. Each step has compensation logic.',
  },

  diagram: `
SAGA HAPPY PATH:
OrderCreated → InventoryReserved → PaymentCaptured → OrderShipped

SAGA FAILURE PATH (payment fails):
OrderCreated → InventoryReserved → PaymentFailed
                      ↓
              ReleaseReservation (compensation)

Each step has a compensating transaction!
`,

  keyPoints: [
    'Saga = sequence of local transactions',
    'Each step publishes success/failure event',
    'Failure triggers compensating transactions in reverse',
    'Compensations restore consistent state',
  ],

  quickCheck: {
    question: 'What is a compensating transaction in the Saga pattern?',
    options: [
      'A retry of the failed transaction',
      'An action that undoes a previous successful step',
      'A backup transaction',
      'A faster transaction type',
    ],
    correctIndex: 1,
    explanation: 'Compensating transactions undo the effects of previously completed steps when a later step fails.',
  },

  keyConcepts: [
    { title: 'Saga', explanation: 'Sequence of local transactions', icon: '🔄' },
    { title: 'Compensation', explanation: 'Undo action for rollback', icon: '↩️' },
    { title: 'Choreography', explanation: 'Services react to events', icon: '💃' },
  ],
};

const step5: GuidedStep = {
  id: 'order-processing-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Failure compensation with saga pattern',
    taskDescription: 'Add additional App Server services for Payment and Inventory',
    componentsNeeded: [
      { type: 'app_server', reason: 'Payment service with compensation logic', displayName: 'Payment Service' },
      { type: 'app_server', reason: 'Inventory service with reservation/release', displayName: 'Inventory Service' },
    ],
    successCriteria: [
      'Add Payment Service (App Server)',
      'Add Inventory Service (App Server)',
      'Connect both to Message Queue',
      'Connect both to Database',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add two more App Server components for Payment and Inventory services',
    level2: 'Connect both new services to Message Queue (for events) and Database (for state)',
    solutionComponents: [
      { type: 'app_server', displayName: 'Payment Service' },
      { type: 'app_server', displayName: 'Inventory Service' },
    ],
    solutionConnections: [
      { from: 'message_queue', to: 'app_server' },
      { from: 'message_queue', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Event Sourcing for Complete Audit Trail
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔍',
  scenario: "Customer service is struggling! A customer claims they paid but order shows as cancelled.",
  hook: "We have the current state (cancelled) but no history of what happened. When was it paid? When was it cancelled? Why? We can't answer basic questions!",
  challenge: "Implement event sourcing to maintain complete order history.",
  illustration: 'audit-trail',
};

const step6Celebration: CelebrationContent = {
  emoji: '📜',
  message: 'Complete audit trail achieved!',
  achievement: 'Event sourcing provides full order history and time travel',
  metrics: [
    { label: 'Order history', after: 'Complete' },
    { label: 'Audit compliance', after: '100%' },
    { label: 'Customer support resolution time', before: '15min', after: '2min' },
  ],
  nextTeaser: "Congratulations! You built a production-grade order processing system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Event Sourcing: The Complete Order Story',
  conceptExplanation: `Traditional systems store **current state**. Event sourcing stores **all events** that led to that state.

**Traditional Approach:**
\`\`\`
orders table:
  order_id: 12345
  status: SHIPPED
  total: 149.99
\`\`\`
(Lost: When was it paid? When shipped? Who cancelled it?)

**Event Sourcing Approach:**
\`\`\`
order_events table:
  OrderCreated (12:00, total=149.99)
  InventoryReserved (12:01)
  PaymentCaptured (12:02, amount=149.99)
  OrderConfirmed (12:02)
  OrderShipped (14:30, tracking=ABC123)
\`\`\`

**Benefits:**
1. **Complete audit trail** - Every change is recorded
2. **Time travel** - Reconstruct order state at any point in time
3. **Debug failures** - See exact sequence of events
4. **Compliance** - Immutable log for regulations
5. **Analytics** - Analyze order patterns and bottlenecks

**How it works:**
- Every state change is an event stored in event log
- Current state = replay all events for that order
- Events are append-only (never deleted or modified)`,

  whyItMatters: 'For customer disputes, fraud investigations, and compliance, you need complete history. Current state alone is insufficient.',

  famousIncident: {
    title: 'Etsy Order Investigation',
    company: 'Etsy',
    year: '2017',
    whatHappened: 'A seller claimed a buyer cancelled an order after it shipped. Without event sourcing, Etsy couldn\'t determine when cancellation happened vs when order shipped. They implemented event sourcing to provide complete audit trail for all transactions.',
    lessonLearned: 'Event sourcing is essential for marketplace trust and dispute resolution.',
    icon: '🎨',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Investigating order disputes',
    howTheyDoIt: 'Full event sourcing for all orders. Customer service can see exact timeline of every order event.',
  },

  diagram: `
Event Store (Append-Only Log):

Order 12345:
  t0: OrderCreated {customer_id, items, total}
  t1: InventoryReserved {item_id, quantity}
  t2: PaymentAuthorized {amount, payment_method}
  t3: PaymentCaptured {transaction_id}
  t4: OrderConfirmed {}
  t5: OrderShipped {tracking_number, carrier}

Current State = Replay events
Time Travel = Replay events up to time T
`,

  keyPoints: [
    'Store every order event, not just current state',
    'Events are immutable - never delete or modify',
    'Current state = replay all events',
    'Enables time travel and complete audit trail',
  ],

  quickCheck: {
    question: 'How does event sourcing help with customer disputes?',
    options: [
      'It makes orders process faster',
      'Provides complete timeline of what happened and when',
      'It reduces database storage',
      'It prevents disputes from happening',
    ],
    correctIndex: 1,
    explanation: 'Event sourcing stores every state change, providing an immutable audit trail for investigations.',
  },

  keyConcepts: [
    { title: 'Event Store', explanation: 'Append-only log of all events', icon: '📚' },
    { title: 'Event Replay', explanation: 'Reconstruct state from events', icon: '▶️' },
    { title: 'Time Travel', explanation: 'View state at any point in history', icon: '⏰' },
  ],
};

const step6: GuidedStep = {
  id: 'order-processing-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from complete event history',
    taskDescription: 'Add a second Database for Event Store',
    componentsNeeded: [
      { type: 'database', reason: 'Dedicated event store for immutable order events', displayName: 'Event Store' },
    ],
    successCriteria: [
      'Second Database component added',
      'Order Service connected to Event Store',
      'Message Queue connected to Event Store',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add a second Database component for the Event Store',
    level2: 'Connect Order Service and Message Queue to Event Store to persist all order events',
    solutionComponents: [{ type: 'database', displayName: 'Event Store' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const orderProcessingStreamGuidedTutorial: GuidedTutorial = {
  problemId: 'order-processing-stream',
  title: 'Design Order Processing Stream',
  description: 'Build an event-driven order processing system with saga pattern and event sourcing',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🛒',
    hook: "You've been hired as Lead Engineer at CommerceFlow!",
    scenario: "Your mission: Build an order processing system that can handle millions of orders with complex workflows involving payment, inventory, and fulfillment.",
    challenge: "Can you design a system that maintains consistency across distributed services using sagas and event sourcing?",
  },

  requirementsPhase: orderProcessingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Event-Driven Architecture',
    'Order State Management',
    'Saga Pattern',
    'Compensating Transactions',
    'Event Sourcing',
    'Distributed Transactions',
    'Inventory Reservation',
    'Payment Integration',
    'Idempotency',
    'Audit Trail',
    'Choreography Pattern',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (Distributed transactions)',
    'Chapter 11: Stream Processing (Event-driven architecture)',
    'Chapter 12: The Future of Data Systems (Event sourcing)',
  ],
};

export default orderProcessingStreamGuidedTutorial;
