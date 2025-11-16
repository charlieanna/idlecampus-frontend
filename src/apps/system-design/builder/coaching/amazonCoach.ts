import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Amazon Coach Configuration
 * Pattern: E-commerce + Inventory + Transactions
 * Focus: ACID transactions, inventory management, search, payments
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Product Catalog & Cart',
  goal: 'Build a system where users can browse products and add items to cart',
  description: 'Learn e-commerce fundamentals and catalog management',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand product catalog design',
    'Implement shopping cart functionality',
    'Handle basic order placement',
    'Design user and product data models',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Amazon! You\'re building an e-commerce marketplace. Core challenge: handle orders reliably without overselling inventory or losing money on failed transactions.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Build product catalog and shopping cart\n\nUsers should be able to:\n• Browse and search products\n• Add items to cart\n• View cart and update quantities\n• Place orders\n\n💡 Key: E-commerce needs ACID transactions (no double-charging!)',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ App Server added!\n\nHandles:\n• GET /products - Browse catalog\n• POST /cart/add - Add to cart\n• POST /checkout - Place order\n• GET /orders - Order history\n\nNow add a database!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL is PERFECT for e-commerce!\n\n💡 Why?\n• **ACID transactions**: Orders either complete fully or rollback\n• **Foreign keys**: order_items → orders → users\n• **Consistency**: Inventory can\'t go negative\n• **Complex queries**: Join orders with products\n\n**Critical**: BEGIN TRANSACTION; ... COMMIT; for checkout!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect the components!\n\nE-commerce flow:\n1. Client → App Server (browse products)\n2. App Server → PostgreSQL (get products)\n3. Client → App Server (add to cart)\n4. App Server → PostgreSQL (store cart)\n5. Client → App Server (checkout)\n6. App Server → PostgreSQL (create order in transaction)',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Shopping cart and orders work!\n\nBut there\'s a critical problem: inventory! What if 100 people order the last item in stock? We need inventory management!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: E-commerce needs transactional database to prevent:\n• Overselling (selling more than in stock)\n• Double-charging (charging twice)\n• Lost orders (power failure mid-checkout)\n\nACID transactions are critical!',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. App Server (business logic)\n2. PostgreSQL (ACID transactions)\n\nPostgreSQL ensures:\n• Orders are atomic (all-or-nothing)\n• Inventory consistency\n• Reliable money handling',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 170 },
      hint: '🎯 Direct solution:\n• App Server for APIs\n• PostgreSQL for ACID transactions\n\nTables: users, products, orders, order_items, cart, inventory\nConnect: Client → App → PostgreSQL',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Inventory Management & Search',
  goal: 'Add real-time inventory tracking and product search',
  description: 'Handle inventory consistency and optimize search',
  estimatedTime: '23 minutes',
  learningObjectives: [
    'Implement inventory reservation system',
    'Prevent overselling with pessimistic locking',
    'Add full-text search for products',
    'Handle cart abandonment and expiry',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goals:\n\n1. **Inventory management**: Reserve stock during checkout\n2. **Prevent overselling**: Lock inventory atomically\n3. **Product search**: Fast search across millions of products\n\nE-commerce at scale requires careful inventory handling!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Inventory Consistency' },
      message: '⚠️ Inventory overselling detected!\n\n**Problem**: Two users buying the last item simultaneously.\n\n💡 Solution: **Pessimistic locking**\n```sql\nBEGIN TRANSACTION;\n\n-- Lock inventory row\nSELECT quantity FROM inventory\nWHERE product_id = ? FOR UPDATE;\n\n-- Check availability\nIF quantity >= order_quantity THEN\n  UPDATE inventory SET quantity = quantity - order_quantity;\n  INSERT INTO orders (...);\n  COMMIT;\nELSE\n  ROLLBACK;\nEND IF;\n```\n\n**FOR UPDATE**: Locks row until transaction completes',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis for cart and session data!\n\n💡 Use cases:\n1. **Shopping cart**: Fast read/write, temporary data\n2. **Session store**: User login state\n3. **Product cache**: Popular products cached\n4. **Inventory reservation**: Reserve with TTL (15 min)\n\n**Cart in Redis**:\n• Fast (sub-ms)\n• Auto-expire after 7 days\n• Reduce DB load\n\n**Final order**: Redis cart → PostgreSQL order',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'elasticsearch' },
      message: '✅ Elasticsearch for product search!\n\n💡 Features:\n• Full-text search ("red shoes" matches "Crimson Running Shoes")\n• Filters (price range, category, brand)\n• Fuzzy matching (typo-tolerant)\n• Faceted search (show counts per category)\n• Relevance ranking\n• Autocomplete\n\n**Performance**: <50ms for millions of products\n**Index**: Products → Elasticsearch via message queue',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'message_queue' },
      message: '✅ Message Queue for order processing!\n\n💡 Async workflows:\n1. **Order placed** → Queue\n2. Workers process:\n   - Send confirmation email\n   - Update search index\n   - Trigger warehouse picking\n   - Initiate shipping\n   - Update analytics\n\n**Benefit**: Checkout response instant (don\'t wait for email)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Inventory management and search work!\n\nYou\'ve learned:\n• Pessimistic locking for inventory\n• Redis for cart (fast, temporary)\n• Elasticsearch for search\n• Async order processing\n\nNext: Payments and global scale!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Two critical additions:\n1. Prevent overselling: Use database locks (SELECT FOR UPDATE)\n2. Fast search: Use specialized search engine\n3. Cart performance: Use Redis instead of DB',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Add:\n1. Redis for shopping cart (fast, ephemeral)\n2. Elasticsearch for product search\n3. Message Queue for async order processing\n\nInventory: Use SELECT FOR UPDATE in PostgreSQL',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 260 },
      hint: '🎯 Direct solution:\n• Redis for cart (SETEX with 7-day TTL)\n• Elasticsearch for product search\n• Message Queue (SQS/Kafka) for order events\n• PostgreSQL with SELECT FOR UPDATE for inventory\n• Workflow: Add to cart (Redis) → Checkout (lock inventory, create order) → Queue for email/shipping',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Payments & Global Scale',
  goal: 'Add payment processing and handle Black Friday scale',
  description: 'Integrate payments, optimize for high traffic, multi-region',
  estimatedTime: '26 minutes',
  learningObjectives: [
    'Integrate payment gateway (Stripe)',
    'Handle payment failures and retries',
    'Scale to millions of orders/day',
    'Implement distributed inventory across warehouses',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3: Payments and massive scale!\n\nChallenges:\n• Payment processing (Stripe/PayPal)\n• Payment failures (retry logic)\n• Black Friday: 10M orders/day\n• Multi-warehouse inventory\n\nEnterprise e-commerce!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'payment_gateway' },
      message: '✅ Payment Gateway (Stripe) integrated!\n\n💡 Payment flow:\n1. User enters card → Stripe.js tokenizes (frontend)\n2. Send token to backend (never raw card data!)\n3. Create PaymentIntent via Stripe API\n4. Stripe processes payment\n5. Webhook confirms success/failure\n6. Complete order in PostgreSQL\n\n**PCI Compliance**: Stripe handles card data, you handle tokens\n**Idempotency**: Use idempotency keys to prevent double-charging',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis for distributed inventory!\n\n💡 Multi-warehouse setup:\n• **inventory:product_123:warehouse_A** = 50\n• **inventory:product_123:warehouse_B** = 30\n\n**Allocation algorithm**:\n1. Get user location\n2. Find nearest warehouse with stock\n3. Reserve with DECR (atomic)\n4. If 0, try next warehouse\n\n**DECR**: Atomic decrement (thread-safe)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database write bottleneck on Black Friday!\n\nProblem: 100K orders/minute overwhelming PostgreSQL.\n\n💡 Solutions:\n1. **Read replicas**: Offload product reads\n2. **Sharding**: Partition by user_id or region\n3. **Write buffering**: Queue writes during spikes\n4. **Caching**: Redis for product details\n5. **Microservices**: Separate order service, inventory service',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'cdn' },
      message: '✅ CDN for product images and static assets!\n\n💡 E-commerce CDN usage:\n• Product images (millions of SKUs)\n• CSS/JS bundles\n• Cached product pages (for SEO)\n\n**Result**: Page load <1 second globally\n**Cost savings**: 90% less origin traffic',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Amazon is production-ready! 🛒\n\nYou\'ve mastered:\n✓ ACID transactions (no data loss)\n✓ Inventory management (no overselling)\n✓ Pessimistic locking (consistency)\n✓ Product search (Elasticsearch)\n✓ Payment processing (Stripe)\n✓ Multi-warehouse inventory\n✓ Black Friday scale (millions of orders)\n✓ Async processing (queues)\n✓ Redis caching (fast cart, sessions)\n\nThis is production e-commerce architecture! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'shopify',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Three enhancements:\n1. Payment gateway for secure transactions\n2. Distributed inventory across warehouses\n3. Read replicas and caching for scale',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. Stripe for payment processing (use webhooks)\n2. Redis for distributed inventory (DECR for atomic updates)\n3. PostgreSQL read replicas for product reads\n4. CDN for product images\n5. Sharding for 10M+ orders',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 300 },
      hint: '🎯 Direct solution:\n• Stripe PaymentIntent API with webhooks\n• Redis distributed inventory (per warehouse)\n• PostgreSQL primary + 3 read replicas\n• CDN (CloudFront) for images\n• Message Queue for order events\n• Idempotency keys for payment retries\n• Circuit breaker for payment gateway\n• Workflow: Cart (Redis) → Reserve inventory → Charge card → Create order → Async fulfillment',
      hintLevel: 3,
    },
  ],
};

export const amazonCoachConfig: ProblemCoachConfig = {
  problemId: 'amazon',
  archetype: 'ecommerce',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nCatalog and cart work! You understand:\n• ACID transactions for orders\n• E-commerce data model\n• Shopping cart functionality\n\nNext: Inventory management!',
    2: '🎉 Level 2 Complete!\n\nInventory and search optimized! You\'ve learned:\n• Pessimistic locking (SELECT FOR UPDATE)\n• Redis for cart performance\n• Elasticsearch for product search\n• Async order processing\n\nNext: Payments and global scale!',
    3: '🎉 Amazon Complete! 🛒\n\nYou\'ve mastered e-commerce at scale:\n✓ ACID transactions (data consistency)\n✓ Inventory management (no overselling)\n✓ Product search (Elasticsearch)\n✓ Payment processing (Stripe)\n✓ Multi-warehouse inventory\n✓ Black Friday scale (10M orders/day)\n✓ Redis caching and sessions\n✓ Async workflows with queues\n\nThis is production Amazon architecture! 🚀',
  },
  nextProblemRecommendation: 'shopify',
  prerequisites: [],
  estimatedTotalTime: '64 minutes',
};

export function getAmazonLevelConfig(level: number): LevelCoachConfig | null {
  return amazonCoachConfig.levelConfigs[level] || null;
}
