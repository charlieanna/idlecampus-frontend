import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Shopping Cart Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches shopping cart caching with session management,
 * inventory reservation, and abandoned cart handling.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic cart storage with Redis
 * Steps 4-6: Session management, inventory reservation, abandoned cart handling
 *
 * Key Concepts:
 * - Shopping cart persistence and session management
 * - Redis for fast cart operations
 * - Inventory reservation and timeout handling
 * - Cross-device cart synchronization
 * - Abandoned cart recovery
 * - Cart data consistency vs availability trade-offs
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const shoppingCartCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a shopping cart caching system for a high-traffic e-commerce platform",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Staff Engineer - E-Commerce Platform',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-cart-ops',
      category: 'functional',
      question: "What core operations do users need for their shopping cart?",
      answer: "Users need to:\n\n1. **Add items** - Add products to cart with quantity\n2. **Update quantities** - Change item quantities (increase/decrease)\n3. **Remove items** - Delete items from cart\n4. **View cart** - See all items with prices, quantities, and total\n5. **Persist cart** - Cart survives page refreshes and sessions\n\nAll operations must be FAST - users expect instant cart updates!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Shopping carts need sub-second response times for good UX",
    },
    {
      id: 'cart-persistence',
      category: 'functional',
      question: "How long should cart data be stored? What if users don't checkout?",
      answer: "**Logged-in users**: Keep cart for 30 days (or until checkout)\n**Guest users**: Keep cart for 7 days or until session expires\n\nWhy?\n- Users browse, leave, and come back days later\n- Cart persistence increases conversion rates\n- After expiration, move to abandoned cart system",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cart persistence drives sales - users expect their cart to be there when they return",
    },
    {
      id: 'cross-device-sync',
      category: 'functional',
      question: "What happens when a user adds items on mobile, then checks out on desktop?",
      answer: "**Cross-device sync is CRITICAL!**\n\nUser adds items on mobile → logs in on desktop → sees same cart!\n\nFor logged-in users:\n- Cart tied to user_id, not session\n- Syncs across all devices in real-time\n- Merge carts if items added on both devices\n\nFor guest users:\n- Cart tied to session/cookie only\n- Lost when switching devices (acceptable)",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Modern users shop across devices - cart sync is essential for conversions",
    },
    {
      id: 'inventory-reservation',
      category: 'functional',
      question: "Should we reserve inventory when users add items to cart?",
      answer: "**Yes, with a timeout!**\n\nProblem: Without reservation, user fills cart → goes to checkout → items sold out!\n\nSolution:\n- Reserve inventory when item added to cart\n- Reservation expires after 15 minutes (configurable)\n- User can refresh reservation by updating cart\n- Release reservation on cart abandonment or timeout\n\nBalance: Reserve for UX, but don't hold inventory forever",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Inventory reservation prevents cart abandonment but requires careful timeout management",
    },
    {
      id: 'abandoned-cart',
      category: 'clarification',
      question: "What happens to abandoned carts? Should we track them for recovery?",
      answer: "**Abandoned cart handling is a revenue goldmine!**\n\n70% of carts are abandoned. Recovering even 10% = huge revenue.\n\n**Track abandoned carts:**\n- Cart inactive for 1 hour → mark as abandoned\n- Store: user_id, items, total value, timestamp\n- Marketing sends reminder emails\n- Show cart on next visit\n\nCarts are only deleted after 30 days",
      importance: 'important',
      insight: "Abandoned cart recovery can recover 10-30% of lost sales",
    },
    {
      id: 'cart-merging',
      category: 'clarification',
      question: "What if a user has items as guest, then logs in?",
      answer: "**Cart merging strategy:**\n\n1. User adds items as guest (cart in cookie/session)\n2. User logs in (user has existing cart)\n3. **Merge both carts!**\n   - Combine items from both carts\n   - Sum quantities for duplicate items\n   - Keep user cart as primary\n\nThis prevents lost items and maximizes order value",
      importance: 'important',
      insight: "Cart merging on login improves conversion and prevents user frustration",
    },

    // SCALE & NFRs
    {
      id: 'throughput-cart',
      category: 'throughput',
      question: "How many cart operations per second do we need to handle?",
      answer: "With 50M daily active users, typical shopping behavior:\n- 30% add to cart (15M users)\n- Average 3 cart operations per session (add, update, view)\n- Peak during sales: 5x normal\n\n45 million cart operations/day",
      importance: 'critical',
      calculation: {
        formula: "45M ÷ 86,400 sec = 520 ops/sec average",
        result: "~500 ops/sec average, ~2,500 peak (5x)",
      },
      learningPoint: "Cart operations are bursty - flash sales cause 5-10x spikes",
    },
    {
      id: 'latency-cart',
      category: 'latency',
      question: "How fast should cart operations be?",
      answer: "Cart operations are UX-critical:\n\n**Add/Update/Remove: p99 < 100ms**\n**View cart: p99 < 50ms**\n\nWhy so fast?\n- Users expect instant feedback when clicking 'Add to Cart'\n- Slow cart = abandoned purchase\n- Industry standard: < 100ms for interactive operations",
      importance: 'critical',
      learningPoint: "Cart latency directly impacts conversion rates - every 100ms delay = 1% conversion drop",
    },
    {
      id: 'consistency-cart',
      category: 'consistency',
      question: "If a user adds item on mobile and immediately opens desktop, should they see it?",
      answer: "**Strong consistency for logged-in users!**\n\nScenario:\n1. User adds item on mobile\n2. Immediately opens desktop\n3. Must see the item!\n\nCan't have eventual consistency here - users will think the system is broken.\n\nFor guest users: Session-local is fine (can't sync anyway)",
      importance: 'critical',
      learningPoint: "Cart sync requires strong consistency to prevent user confusion",
    },
    {
      id: 'availability-cart',
      category: 'availability',
      question: "What if the cart database/cache goes down?",
      answer: "**Cart service must stay up!**\n\nFallback strategy:\n1. Primary: Redis cache (fast, in-memory)\n2. Backup: Database (slower, but durable)\n3. Emergency: In-memory cache (session only, lost on restart)\n4. Last resort: Client-side storage (localStorage)\n\nPrefer availability over consistency - losing cart = losing sale!",
      importance: 'critical',
      insight: "For carts, availability > consistency - better to show slightly stale cart than no cart",
    },
    {
      id: 'cart-size',
      category: 'payload',
      question: "How much data do we store per cart?",
      answer: "Typical cart:\n- User ID: 8 bytes\n- 5 items average × 100 bytes per item = 500 bytes\n- Metadata (timestamp, session, etc.): 100 bytes\n- **Total: ~600 bytes per cart**\n\nWith 15M active carts:\n15M × 600 bytes = ~9GB total cart data\n\nEasily fits in Redis memory!",
      importance: 'important',
      calculation: {
        formula: "15M carts × 600 bytes = 9GB",
        result: "~10GB Redis cluster for all active carts",
      },
      learningPoint: "Cart data is small - perfect for in-memory caching",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-cart-ops', 'cart-persistence', 'cross-device-sync', 'inventory-reservation'],
  criticalFRQuestionIds: ['core-cart-ops', 'cart-persistence', 'cross-device-sync'],
  criticalScaleQuestionIds: ['throughput-cart', 'latency-cart', 'consistency-cart'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can add, update, remove, and view cart items',
      description: 'Fast cart operations with < 100ms latency',
      emoji: '🛒',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cart persists across sessions',
      description: 'Logged-in users: 30 days, Guest users: 7 days',
      emoji: '💾',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Cross-device cart synchronization',
      description: 'Cart syncs across devices for logged-in users',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Inventory reservation with timeout',
      description: 'Reserve inventory for 15 minutes when added to cart',
      emoji: '⏱️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '45 million cart operations',
    readsPerDay: '90 million cart views',
    peakMultiplier: 5,
    readWriteRatio: '2:1',
    calculatedWriteRPS: { average: 520, peak: 2600 },
    calculatedReadRPS: { average: 1040, peak: 5200 },
    maxPayloadSize: '~600 bytes (cart data)',
    storagePerRecord: '~600 bytes',
    storageGrowthPerYear: '~50GB (abandoned carts)',
    redirectLatencySLA: 'p99 < 50ms (view cart)',
    createLatencySLA: 'p99 < 100ms (add/update cart)',
  },

  architecturalImplications: [
    '✅ Low latency required (< 100ms) → Redis cache is essential',
    '✅ Cross-device sync → Centralized cart storage (not session-local)',
    '✅ Inventory reservation → Distributed locking mechanism',
    '✅ Cart persistence → Write-through cache + database backup',
    '✅ Abandoned cart tracking → Background job + analytics',
    '✅ Small data size (600 bytes/cart) → All carts fit in Redis',
  ],

  outOfScope: [
    'Payment processing',
    'Order fulfillment',
    'Shipping calculations',
    'Coupon/promotion codes',
    'Gift wrapping options',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple cart storage system with Redis. Then we'll add session management, inventory reservation, and abandoned cart handling. Speed first, then sophistication!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛒',
  scenario: "Welcome to CartTech! You're building the shopping cart system for a major e-commerce platform.",
  hook: "Your first customer wants to add a product to their cart. Time to get the basic system running!",
  challenge: "Set up the foundation: connect the Client to your App Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your cart service is online!',
  achievement: 'Customers can now connect to your cart server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Connection', after: 'Established' },
  ],
  nextTeaser: "But the server doesn't know how to store cart data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Shopping Cart Architecture: The Foundation',
  conceptExplanation: `Every shopping cart system starts with a **Client-Server** architecture.

When a customer adds an item to cart:
1. Their browser/app (Client) sends a request
2. Your App Server receives the cart operation
3. The server processes and stores the cart
4. Responds with updated cart state

This is the foundation for all cart operations!`,

  whyItMatters: 'Without this connection, customers cannot maintain shopping carts. This is the entry point for all cart interactions.',

  keyPoints: [
    'Client represents customers managing their cart',
    'App Server handles cart operations (CRUD)',
    'REST API is standard: POST /cart/add, PUT /cart/update, DELETE /cart/remove',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer device managing shopping cart', icon: '📱' },
    { title: 'App Server', explanation: 'Handles cart logic and storage', icon: '🖥️' },
    { title: 'Cart State', explanation: 'Current items, quantities, and prices', icon: '🛒' },
  ],
};

const step1: GuidedStep = {
  id: 'cart-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all cart FRs',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers using shopping cart', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles cart operations', displayName: 'Cart Service' },
    ],
    successCriteria: [
      'Add Client component',
      'Add App Server component',
      'Connect Client to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server from the palette onto the canvas',
    level2: 'Click Client, then click App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Redis Cache for Fast Cart Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚡',
  scenario: "Users are adding items to cart, but operations are taking 500ms!",
  hook: "Storing cart data in application memory means it's lost when the server restarts. Users are complaining about vanishing carts!",
  challenge: "Add Redis cache for fast, persistent cart storage.",
  illustration: 'slow-loading',
};

const step2Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Cart operations are now lightning fast!',
  achievement: 'Redis handles cart data with < 10ms latency',
  metrics: [
    { label: 'Cart operation latency', before: '500ms', after: '5ms' },
    { label: 'Cart persistence', before: 'Lost on restart', after: 'Durable' },
    { label: 'Cross-device sync', after: 'Enabled' },
  ],
  nextTeaser: "Great! But what happens when the cache is full?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Redis for Shopping Carts: The Perfect Match',
  conceptExplanation: `**Why Redis for shopping carts?**

**Speed:**
- Redis is in-memory → 1-5ms latency
- Database is disk-based → 50-200ms latency
- **10-100x faster!**

**Data Structures:**
- Redis Hashes perfect for cart items
- \`HSET cart:user123 product_id quantity\`
- \`HGET cart:user123 product_id\` → instant lookup

**Persistence:**
- Redis can persist to disk (RDB/AOF)
- Survives server restarts
- Optional backup to database

**Cart Storage Pattern:**
\`\`\`
Key: cart:user_id
Value: Hash {
  product_id_1: quantity,
  product_id_2: quantity,
  ...
}

Metadata: cart_meta:user_id
Value: {
  created_at: timestamp,
  updated_at: timestamp,
  expires_at: timestamp
}
\`\`\`

**TTL for Expiration:**
- Set TTL on cart keys
- Logged-in: 30 days
- Guest: 7 days
- Redis auto-deletes expired carts`,

  whyItMatters: 'Redis provides the speed needed for cart operations (< 100ms) while maintaining persistence across sessions.',

  famousIncident: {
    title: 'Target Cart System Failure',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target stored carts in application memory without Redis. During Black Friday, servers crashed and restarted. ALL active shopping carts were lost. Customers lost items and abandoned purchases. Estimated $10M in lost sales.',
    lessonLearned: 'Never store cart state in application memory. Use Redis or similar persistent cache from day 1.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing 300M+ shopping carts globally',
    howTheyDoIt: 'Uses Redis ElastiCache for all cart storage. Each cart is a Redis hash. Cart operations take 2-5ms. Backup to DynamoDB every 5 minutes for disaster recovery.',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│         REDIS CART STORAGE PATTERN                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  User adds product_456 (qty: 2)                   │
│                                                    │
│  ┌──────────┐   HSET cart:user123   ┌───────────┐│
│  │   App    │ ─────────────────────→ │   Redis   ││
│  │  Server  │    product_456 → 2     │   Cache   ││
│  └──────────┘                        └───────────┘│
│                                                    │
│  Redis stores:                                     │
│  cart:user123 → {                                  │
│    product_123: 1,                                 │
│    product_456: 2,    ← Just added                 │
│    product_789: 3                                  │
│  }                                                 │
│                                                    │
│  TTL: 30 days (logged-in) or 7 days (guest)      │
│                                                    │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Redis provides < 10ms cart operations',
    'Use Redis Hashes for cart items (product → quantity)',
    'Set TTL for automatic cart expiration',
    'Redis persistence (RDB/AOF) survives restarts',
    'All cart operations: HSET (add), HGET (view), HDEL (remove)',
  ],

  quickCheck: {
    question: 'Why is Redis better than a traditional database for shopping carts?',
    options: [
      'Redis is cheaper',
      'Redis is in-memory (1-5ms) vs disk-based DB (50-200ms) - 10-100x faster',
      'Redis has more features',
      'Databases cannot store carts',
    ],
    correctIndex: 1,
    explanation: 'Redis operates in-memory, providing 10-100x faster access than disk-based databases. Critical for < 100ms cart operation latency.',
  },

  keyConcepts: [
    { title: 'Redis Hash', explanation: 'Key-value pairs perfect for cart items', icon: '🗂️' },
    { title: 'TTL', explanation: 'Time To Live - auto-expire carts after N days', icon: '⏰' },
    { title: 'In-Memory', explanation: 'Stored in RAM for microsecond access', icon: '⚡' },
  ],
};

const step2: GuidedStep = {
  id: 'cart-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast cart operations, FR-2: Cart persistence',
    taskDescription: 'Add Redis Cache for cart storage',
    componentsNeeded: [
      { type: 'cache', reason: 'Fast, persistent cart storage', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Click App Server, then click Cache to connect them',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Cart Backup and Analytics
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your Redis cache just crashed and restarted. ALL shopping carts are gone!",
  hook: "15 million customers lost their carts. Support is flooded with complaints. This is a disaster!",
  challenge: "Add a database to backup cart data and enable abandoned cart analytics.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Cart data is now safe and recoverable!',
  achievement: 'Database provides durability and analytics',
  metrics: [
    { label: 'Cart durability', before: 'Redis only', after: 'Redis + DB backup' },
    { label: 'Data loss risk', before: 'High', after: 'Near zero' },
    { label: 'Abandoned cart tracking', after: 'Enabled' },
  ],
  nextTeaser: "But how do we keep users' carts in sync across devices?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Database: The Safety Net for Shopping Carts',
  conceptExplanation: `**Why both Redis AND Database?**

**Redis (Primary):**
- Fast cart operations (< 10ms)
- Handles all live traffic
- In-memory = vulnerable to crashes

**Database (Backup):**
- Durable storage (survives crashes)
- Source of truth for cart history
- Enables abandoned cart analytics
- Slower (50-200ms), but reliable

**Two-Tier Strategy:**

1. **Write-Through Pattern:**
   - Write to Redis (fast)
   - Async write to DB (durable)
   - If Redis crashes → restore from DB

2. **Read Path:**
   - Always read from Redis (fast)
   - If Redis miss → read from DB → populate Redis

3. **Abandoned Cart Analytics:**
   - Database stores cart history
   - Track: items, timestamps, user behavior
   - Marketing uses for recovery campaigns

**Database Schema:**
\`\`\`sql
carts:
  user_id, session_id, created_at, updated_at, status

cart_items:
  cart_id, product_id, quantity, price_at_add, added_at

abandoned_carts:
  cart_id, user_id, items_json, total_value, abandoned_at
\`\`\``,

  whyItMatters: 'Redis provides speed, Database provides durability. Both are needed for production-grade cart systems.',

  famousIncident: {
    title: 'Shopify Cart Recovery System',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'Shopify merchants recovered $1.2B in sales from abandoned carts in 2019. This was only possible because they stored cart history in databases. Redis handled live carts, PostgreSQL enabled analytics and recovery emails.',
    lessonLearned: 'Database backup enables abandoned cart recovery - a major revenue driver for e-commerce.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Managing 100M+ shopping carts',
    howTheyDoIt: 'Uses Redis for live carts (< 5ms reads). Writes every cart operation to PostgreSQL asynchronously. Database enables abandoned cart emails that recover 15% of lost sales.',
  },

  keyPoints: [
    'Redis for speed (primary), Database for durability (backup)',
    'Write-through: Update Redis + async write to DB',
    'Database enables abandoned cart analytics and recovery',
    'If Redis crashes → restore carts from database',
    'Database stores cart history for ML and personalization',
  ],

  quickCheck: {
    question: 'Why do we need both Redis and Database for shopping carts?',
    options: [
      'Redis is faster, Database is cheaper',
      'Redis provides speed (< 10ms), Database provides durability and analytics',
      'They do the same thing',
      'Redis cannot store cart data',
    ],
    correctIndex: 1,
    explanation: 'Redis provides the speed needed for cart operations. Database provides durability (survives crashes) and enables abandoned cart tracking.',
  },

  keyConcepts: [
    { title: 'Write-Through', explanation: 'Write to cache and database', icon: '✍️' },
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'Abandoned Cart', explanation: 'Inactive carts tracked for recovery', icon: '📧' },
  ],
};

const step3: GuidedStep = {
  id: 'cart-cache-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Durable cart persistence, enables abandoned cart tracking',
    taskDescription: 'Add a Database for cart backup and analytics',
    componentsNeeded: [
      { type: 'database', reason: 'Backup cart data and enable analytics', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Add Database component',
      'Connect App Server to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database component onto the canvas',
    level2: 'Click App Server, then click Database to create backup storage',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Implement Session Management for Cross-Device Sync
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📱',
  scenario: "A customer adds items on their phone during lunch, then goes home to checkout on their laptop.",
  hook: "When they login on desktop... the cart is empty! The cart was tied to their mobile session, not their user account!",
  challenge: "Implement session management to sync carts across devices for logged-in users.",
  illustration: 'cross-device',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Carts now sync across all devices!',
  achievement: 'Logged-in users see their cart everywhere',
  metrics: [
    { label: 'Cart sync', before: 'Session-only', after: 'User-based' },
    { label: 'Cross-device support', after: 'Enabled' },
    { label: 'Conversion rate', before: 'Baseline', after: '+12%' },
  ],
  nextTeaser: "Perfect! But we need to handle inventory reservation...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Session Management: User-Based vs Session-Based Carts',
  conceptExplanation: `**The Cart Identification Challenge:**

**Two types of users:**

**1. Guest Users (Not Logged In):**
- Cart tied to session_id (cookie/token)
- Only accessible from same browser/device
- Lost when cookies cleared
- Cart key: \`cart:session:{session_id}\`

**2. Logged-In Users:**
- Cart tied to user_id
- Accessible from ANY device
- Persists across sessions
- Cart key: \`cart:user:{user_id}\`

**Cross-Device Sync Implementation:**

1. **User adds item on mobile:**
   - Key: \`cart:user:12345\`
   - Write to Redis + DB

2. **User opens desktop and logs in:**
   - Load cart using same key: \`cart:user:12345\`
   - Cart appears instantly!

**Cart Merging on Login:**

User has guest cart → logs in → merge with user cart:
\`\`\`
Guest cart (session_abc):     User cart (user_12345):
  product_1: 2                  product_1: 1
  product_2: 3                  product_3: 4

Merged cart:
  product_1: 3  (2 + 1)
  product_2: 3  (from guest)
  product_3: 4  (from user)
\`\`\`

Then delete guest cart.`,

  whyItMatters: 'Modern users shop across multiple devices. Cart sync is critical for conversion - 60% of purchases happen on a different device than cart creation.',

  famousIncident: {
    title: 'Best Buy Cross-Device Cart Failure',
    company: 'Best Buy',
    year: '2015',
    whatHappened: 'Best Buy\'s cart system didn\'t sync across devices. User added items on mobile, logged in on desktop, saw empty cart. Customer survey showed 23% abandoned purchases due to lost carts. Implementing cross-device sync increased conversions by 18%.',
    lessonLearned: 'Cart sync is not optional - it\'s a conversion requirement in multi-device era.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Nike',
    scenario: 'Shoppers browse on phone, buy on desktop',
    howTheyDoIt: 'Uses user_id for logged-in carts with Redis cluster. Cart syncs in real-time via Redis pub/sub. When user logs in, merges guest cart with user cart. 70% of purchases involve multiple devices.',
  },

  diagram: `
┌────────────────────────────────────────────────────────┐
│         CROSS-DEVICE CART SYNCHRONIZATION              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  MORNING: User on Mobile (logged in as user_12345)   │
│                                                        │
│  📱 Add product → cart:user:12345                     │
│                        ↓                               │
│                  ┌───────────┐                         │
│                  │   Redis   │                         │
│                  │   Cache   │                         │
│                  └───────────┘                         │
│                        ↑                               │
│  EVENING: User on Desktop (logs in as user_12345)    │
│                                                        │
│  💻 Load cart → cart:user:12345                       │
│                                                        │
│  ✅ Same cart appears! Cross-device sync works!       │
│                                                        │
└────────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Guest carts: tied to session_id (single device)',
    'User carts: tied to user_id (all devices)',
    'Cross-device sync via Redis + user_id as cart key',
    'Merge guest cart into user cart on login',
    'Real-time sync using Redis pub/sub (optional)',
  ],

  quickCheck: {
    question: 'How do we enable cross-device cart sync for logged-in users?',
    options: [
      'Store cart in browser localStorage',
      'Use user_id as cart key in Redis, accessible from any device',
      'Email cart contents to user',
      'Sync is impossible',
    ],
    correctIndex: 1,
    explanation: 'By using user_id as the cart key in Redis (cart:user:12345), the cart is accessible from any device when the user logs in.',
  },

  keyConcepts: [
    { title: 'Session ID', explanation: 'Browser/device-specific identifier', icon: '🍪' },
    { title: 'User ID', explanation: 'Account identifier across all devices', icon: '👤' },
    { title: 'Cart Merging', explanation: 'Combine guest + user carts on login', icon: '🔀' },
  ],
};

const step4: GuidedStep = {
  id: 'cart-cache-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Cross-device cart synchronization',
    taskDescription: 'Understand session management for cross-device sync (implementation in Python code)',
    successCriteria: [
      'Session management is implemented in application code',
      'In your App Server, you would:',
      '  1. Use user_id for logged-in carts: cart:user:{user_id}',
      '  2. Use session_id for guest carts: cart:session:{session_id}',
      '  3. Merge carts on login',
      'Your architecture already supports this pattern',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Session management is a code pattern, not a new component',
    level2: 'Your architecture supports cross-device sync - App Server uses user_id as cart key in Redis',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Inventory Reservation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '😡',
  scenario: "A customer spent 20 minutes filling their cart with rare collectibles, then went to checkout...",
  hook: "ERROR: Items out of stock! While they shopped, other customers bought the same items. Cart is useless now!",
  challenge: "Implement inventory reservation to hold items when added to cart.",
  illustration: 'inventory-error',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Inventory is now reserved when added to cart!',
  achievement: 'Customers won\'t lose items during checkout',
  metrics: [
    { label: 'Checkout failures', before: '15%', after: '2%' },
    { label: 'Inventory reservation', after: 'Enabled (15 min)' },
    { label: 'Customer satisfaction', before: '3.2/5', after: '4.7/5' },
  ],
  nextTeaser: "Great! But what happens to abandoned carts with reserved inventory?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Inventory Reservation: Balancing UX and Availability',
  conceptExplanation: `**The Inventory Problem:**

Without reservation:
1. User adds item to cart
2. Shops for 10 more minutes
3. Goes to checkout
4. ERROR: Out of stock! (someone else bought it)
5. User abandons entire cart 😡

**Solution: Temporary Inventory Reservation**

When user adds item to cart:
1. Reserve quantity in inventory system
2. Set reservation expiration (15 minutes)
3. Refresh reservation on cart updates
4. Release on timeout or checkout

**Implementation in Redis:**

\`\`\`
# Reserve 2 units of product_123 for user_456
HSET reservations:product_123 user_456 2
EXPIRE reservations:product_123:user_456 900  # 15 min

# Check available inventory:
total_stock - SUM(reservations) = available
\`\`\`

**Reservation Lifecycle:**

1. **Add to cart:** Reserve inventory (15 min TTL)
2. **Update cart:** Refresh reservation TTL
3. **Checkout:** Convert reservation → order
4. **Remove from cart:** Release reservation immediately
5. **Timeout (15 min):** Auto-release reservation

**Handling Conflicts:**

If inventory insufficient:
- Show "Only X items available"
- Allow partial add to cart
- Notify user immediately

**Reservation Timeout Trade-offs:**
- Too short (5 min): Users lose items while shopping
- Too long (1 hour): Inventory locked unnecessarily
- Sweet spot: 15 minutes (industry standard)`,

  whyItMatters: 'Inventory reservation prevents checkout failures and cart abandonment. Critical for limited inventory items and flash sales.',

  famousIncident: {
    title: 'PlayStation 5 Launch Inventory Chaos',
    company: 'Multiple Retailers',
    year: '2020',
    whatHappened: 'During PS5 launch, many retailers had no inventory reservation. Users added PS5 to cart, shopped for accessories, then at checkout: "Out of stock". Massive customer anger. Best Buy implemented reservation and had 90% fewer checkout failures.',
    lessonLearned: 'Inventory reservation is essential for limited stock items. Users will abandon entire cart if checkout fails.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'StubHub',
    scenario: 'Concert ticket sales with limited inventory',
    howTheyDoIt: 'Reserves tickets for 8 minutes when added to cart. Uses Redis sorted sets with expiration timestamps. Background job releases expired reservations every second. Prevents double-selling tickets.',
  },

  diagram: `
┌────────────────────────────────────────────────────────┐
│         INVENTORY RESERVATION FLOW                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. User adds 2 units of product_123 to cart         │
│                                                        │
│  ┌──────────┐                                         │
│  │   App    │                                         │
│  │  Server  │                                         │
│  └────┬─────┘                                         │
│       │                                                │
│       ├──→ Reserve in Redis:                          │
│       │    reservations:product_123:user_456 = 2     │
│       │    TTL: 900 seconds (15 min)                  │
│       │                                                │
│       └──→ Update inventory:                          │
│            available = total - reserved               │
│                                                        │
│  2. After 15 minutes (TTL expires)                    │
│     → Reservation auto-released                       │
│     → Inventory becomes available again               │
│                                                        │
│  3. If user checks out before TTL:                    │
│     → Convert reservation to order                    │
│     → Decrement actual inventory                      │
│                                                        │
└────────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Reserve inventory when item added to cart',
    'Reservation expires after 15 minutes (configurable)',
    'Refresh reservation TTL on cart updates',
    'Release immediately on cart removal or checkout',
    'Redis TTL handles automatic cleanup',
  ],

  quickCheck: {
    question: 'Why do inventory reservations need to expire?',
    options: [
      'To save memory',
      'To prevent inventory being locked forever by abandoned carts',
      'Redis requires expiration',
      'Inventory never changes',
    ],
    correctIndex: 1,
    explanation: 'Without expiration, abandoned carts would lock inventory forever. TTL ensures inventory is released and becomes available to other customers.',
  },

  keyConcepts: [
    { title: 'Reservation', explanation: 'Temporarily hold inventory for user', icon: '🔒' },
    { title: 'TTL Expiration', explanation: 'Auto-release after timeout', icon: '⏱️' },
    { title: 'Distributed Lock', explanation: 'Prevent double-reservation', icon: '🔐' },
  ],
};

const step5: GuidedStep = {
  id: 'cart-cache-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Inventory reservation with timeout',
    taskDescription: 'Understand inventory reservation (implementation in Python code)',
    successCriteria: [
      'Inventory reservation is implemented in application code',
      'In your App Server, you would:',
      '  1. Reserve inventory when item added to cart',
      '  2. Set 15-minute TTL on reservation',
      '  3. Release on removal/checkout',
      'Your Redis cache supports this with TTL',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Inventory reservation uses Redis TTL feature',
    level2: 'Your architecture supports reservation - App Server manages inventory in Redis with expiration',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer and Scale for High Traffic
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Black Friday is here! Cart operations spiked from 500/sec to 25,000/sec!",
  hook: "Your single app server is at 100% CPU and dropping requests. Customers see error pages when adding to cart!",
  challenge: "Add a load balancer to distribute cart traffic across multiple servers.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Your cart system handles Black Friday traffic!',
  achievement: 'Load balancer distributes load across multiple servers',
  metrics: [
    { label: 'Cart operation capacity', before: '500/sec', after: '25K/sec' },
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Success rate', before: '60%', after: '99.9%' },
  ],
  nextTeaser: "Excellent! Your cart system is production-ready!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for Shopping Cart Traffic',
  conceptExplanation: `**The Scaling Challenge:**

One app server can handle:
- ~500 cart operations/sec
- At 25K ops/sec, you need **50 servers**!

**Solution: Load Balancer + Stateless App Servers**

Load Balancer:
- Receives all cart requests
- Distributes across N app servers
- Round-robin or least connections
- Health checks remove failed servers

App Servers:
- **Stateless** - no cart data in memory
- All cart state in Redis (shared)
- Can add/remove servers anytime
- Auto-scale based on traffic

**Why Stateless Matters:**

With state (bad):
- User's cart tied to specific server
- Need sticky sessions
- Can't remove servers (lose carts)
- Scaling is complex

Without state (good):
- Cart in Redis, accessible by any server
- No sticky sessions needed
- Add/remove servers freely
- Simple auto-scaling

**Cart Consistency:**

All servers share same Redis cluster:
- User adds item on server 1
- User views cart on server 2
- Both see same cart state!`,

  whyItMatters: 'Traffic can spike 50x during sales. Without horizontal scaling via load balancer, your cart system will crash.',

  famousIncident: {
    title: 'Toys R Us Website Crash',
    company: 'Toys R Us',
    year: '1999',
    whatHappened: 'During Christmas shopping season, Toys R Us had a single server for cart operations. Traffic overwhelmed the server on Cyber Monday. Website crashed. Customers couldn\'t add items to cart. Lost millions in sales and damaged reputation permanently.',
    lessonLearned: 'Always design cart systems with load balancing and horizontal scaling from day 1. Peak traffic is not optional to handle.',
    icon: '🧸',
  },

  realWorldExample: {
    company: 'Target',
    scenario: 'Black Friday cart traffic',
    howTheyDoIt: 'Auto-scales cart service from 50 to 500+ instances during Black Friday. Load balancer (F5 BIG-IP) distributes traffic. All cart state in Redis ElastiCache. Can handle 100K cart ops/sec.',
  },

  diagram: `
                    ┌──────────────────┐
                    │  Load Balancer   │
                    └────────┬─────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │   Cart   │   │   Cart   │   │   Cart   │
        │ Server 1 │   │ Server 2 │   │ Server 3 │
        └────┬─────┘   └────┬─────┘   └────┬─────┘
             └──────────────┴──────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        ┌──────────┐                ┌──────────┐
        │  Redis   │                │ Database │
        │  Cache   │                │(Postgres)│
        └──────────┘                └──────────┘

        All servers share same cart state!`,

  keyPoints: [
    'Load balancer distributes cart traffic across servers',
    'App servers must be stateless (cart in Redis, not memory)',
    'No sticky sessions needed - any server can handle any request',
    'Auto-scale based on CPU, RPS, or queue depth',
    'Redis cluster provides shared cart state',
  ],

  quickCheck: {
    question: 'Why must cart app servers be stateless?',
    options: [
      'Stateless is cheaper',
      'Stateless enables easy scaling - any server can handle any request',
      'Redis requires stateless servers',
      'Databases cannot work with stateful servers',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers allow horizontal scaling and load balancing. Cart state in shared Redis means any server can handle any cart request.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Stateless', explanation: 'No user state in app server memory', icon: '🔄' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step6: GuidedStep = {
  id: 'cart-cache-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add Load Balancer and scale App Server instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute cart traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Reconnect: Client → Load Balancer → App Server',
      'Click App Server and set instances to 3+',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server, then scale app instances',
    level2: 'Reconnect the flow, then click App Server and set instances to 3 or more',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const shoppingCartCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'shopping-cart-cache',
  title: 'Design Shopping Cart Cache',
  description: 'Build a high-performance shopping cart system with Redis caching, session management, and inventory reservation',
  difficulty: 'intermediate',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🛒',
    hook: "You've been hired as Lead Engineer at CartTech!",
    scenario: "Your mission: Build a shopping cart system that handles 25K operations per second during Black Friday.",
    challenge: "Can you design a system that balances speed (< 100ms operations) with durability (carts never lost)?",
  },

  requirementsPhase: shoppingCartCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  totalSteps: 6,

  // Meta information
  concepts: [
    'Shopping Cart Architecture',
    'Redis for Cart Storage',
    'Session Management',
    'Cross-Device Sync',
    'Inventory Reservation',
    'TTL and Expiration',
    'Write-Through Caching',
    'Abandoned Cart Tracking',
    'Load Balancing',
    'Stateless Services',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Cart data durability)',
    'Chapter 7: Transactions (Inventory reservation)',
    'Chapter 12: Caching (Redis cart storage)',
  ],

  finalExamTestCases: [
    {
      name: 'Basic Cart Operations',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can add, update, and view cart items',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Cart Persistence',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Cart data persists across sessions',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      coldStart: true,
      passCriteria: { maxErrorRate: 0, dataLossRate: 0 },
    },
    {
      name: 'Cross-Device Cart Sync',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Cart syncs across devices for logged-in users',
      traffic: { type: 'mixed', rps: 200, readRps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxStaleness: 1, maxErrorRate: 0.01 },
    },
    {
      name: 'Inventory Reservation',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Inventory reserved when added to cart with timeout',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, noOverselling: true },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 5K cart operations/sec with p99 < 100ms',
      traffic: { type: 'mixed', rps: 5000, readRps: 3000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Black Friday Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 25K cart ops/sec during flash sale',
      traffic: { type: 'mixed', rps: 25000, readRps: 15000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Redis Failure Recovery',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System recovers from cache failure',
      traffic: { type: 'mixed', rps: 1000, readRps: 600, writeRps: 400 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxDataLoss: 0.05 },
    },
  ] as TestCase[],
};

export function getShoppingCartCacheGuidedTutorial(): GuidedTutorial {
  return shoppingCartCacheGuidedTutorial;
}

export default shoppingCartCacheGuidedTutorial;
