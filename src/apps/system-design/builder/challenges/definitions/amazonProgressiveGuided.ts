import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Amazon E-commerce - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Product catalog, cart, checkout, inventory, payments.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Browse products
 * - FR-2: Add to cart
 * - Build: Client → Server → Database, basic catalog
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Checkout and payment
 * - FR-4: Order tracking
 * - Build: Payment integration, order management
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle flash sales (100K orders/minute)
 * - Inventory management
 * - Build: Distributed locking, caching, queues
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Search and recommendations
 * - Multi-seller marketplace
 * - Global fulfillment
 *
 * Key Teaching: E-commerce has unique challenges - inventory, payments, scale.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design an e-commerce platform like Amazon",

  interviewer: {
    name: 'Michael Chen',
    role: 'Product Manager at MegaStore',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'browse-products',
      category: 'functional',
      question: "What's the first thing shoppers do?",
      answer: "Browse products! They search, filter by category, read descriptions, and compare items before buying.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Product catalog is the foundation",
    },
    {
      id: 'add-to-cart',
      category: 'functional',
      question: "How do shoppers collect items to buy?",
      answer: "Shopping cart! They add items, adjust quantities, and the cart persists until they're ready to checkout.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cart enables multi-item purchases",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['browse-products', 'add-to-cart'],
  criticalFRQuestionIds: ['browse-products', 'add-to-cart'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Browse product catalog',
      description: 'Search and browse products by category',
      emoji: '🛍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Shopping cart',
      description: 'Add/remove items, adjust quantities',
      emoji: '🛒',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000',
    writesPerDay: '50,000 orders',
    readsPerDay: '10M product views',
    peakMultiplier: 10,
    readWriteRatio: '200:1',
    calculatedWriteRPS: { average: 0.5, peak: 50 },
    calculatedReadRPS: { average: 100, peak: 1000 },
    maxPayloadSize: '~10KB per product',
    storagePerRecord: '~5KB average',
    storageGrowthPerYear: '~100GB',
    redirectLatencySLA: 'Product page < 200ms',
    createLatencySLA: 'Checkout < 2s',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (200:1 ratio)',
    '✅ Bursty traffic (flash sales, holidays)',
    '✅ Inventory consistency critical',
  ],

  outOfScope: [
    'Checkout (Phase 2)',
    'Payments (Phase 2)',
    'Inventory locking (Phase 3)',
    'Search (Phase 4)',
  ],

  keyInsight: "E-commerce is READ-HEAVY but WRITE-CRITICAL. Millions browse, thousands buy. But when they buy, inventory and payment MUST be consistent.",

  thinkingFramework: {
    title: "Phase 1: Product Catalog & Cart",
    intro: "We have 2 simple requirements. Let's build product browsing and cart.",

    steps: [
      {
        id: 'catalog',
        title: 'Step 1: Product Catalog',
        alwaysAsk: "What data do we need for products?",
        whyItMatters: "Products have many attributes - title, description, price, images, variants.",
        expertBreakdown: {
          intro: "Product data:",
          points: [
            "Basic info: title, description, price",
            "Images: multiple per product",
            "Variants: size, color combinations",
            "Inventory: quantity available"
          ]
        },
        icon: '📦',
        category: 'functional'
      },
      {
        id: 'cart',
        title: 'Step 2: Shopping Cart',
        alwaysAsk: "How does the cart work?",
        whyItMatters: "Cart must persist, handle quantities, and survive session loss.",
        expertBreakdown: {
          intro: "Cart requirements:",
          points: [
            "Add/remove items",
            "Adjust quantities",
            "Persist across sessions",
            "Calculate totals"
          ]
        },
        icon: '🛒',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → Server → Database. Product catalog and cart management.",
      whySimple: "This works for a basic store. We'll add checkout and inventory management later.",
      nextStepPreview: "Step 1: Set up the product catalog"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic e-commerce store works!",
    hookMessage: "But shoppers can't actually BUY anything yet. And what about inventory?",
    steps: [
      {
        id: 'checkout',
        title: 'Phase 2: Checkout',
        question: "How do customers complete purchases?",
        whyItMatters: "Checkout = revenue",
        example: "Payment processing, order creation",
        icon: '💳'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "What if 10,000 people buy the same item?",
        whyItMatters: "Flash sales can overwhelm inventory",
        example: "Inventory locking, distributed systems",
        icon: '📈'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Product Catalog (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛍️',
  scenario: "Welcome to MegaStore! You're building the next Amazon.",
  hook: "A shopper comes to your site looking for headphones. They see... nothing. No products, no categories, just an empty page!",
  challenge: "Set up the product catalog so shoppers can browse.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your e-commerce platform is online!',
  achievement: 'Shoppers can browse products',
  metrics: [
    { label: 'Products', after: 'Browsable' },
    { label: 'Categories', after: 'Organized' },
  ],
  nextTeaser: "But where do we store all this product data?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'E-commerce Architecture Basics',
  conceptExplanation: `**Core E-commerce Entities:**

\`\`\`
Products     → What's for sale
Categories   → Product organization
Cart         → Items user wants to buy
Orders       → Completed purchases
Inventory    → Stock levels
\`\`\`

**Key Insight: Read vs Write Patterns**
| Operation | Frequency | Consistency |
|-----------|-----------|-------------|
| Browse products | Very high | Eventually OK |
| Add to cart | Medium | Session consistent |
| Checkout | Low | MUST be consistent |
| Update inventory | Low | CRITICAL |

**API Design:**
\`\`\`
GET  /products              → List products
GET  /products/{id}         → Product details
GET  /categories            → List categories
GET  /cart                  → Get user's cart
POST /cart/items            → Add to cart
POST /checkout              → Create order
\`\`\`

**Product Display:**
\`\`\`json
{
  "id": "prod_123",
  "title": "Wireless Headphones",
  "description": "Premium noise-canceling...",
  "price": 199.99,
  "images": ["img1.jpg", "img2.jpg"],
  "category": "Electronics > Audio",
  "in_stock": true,
  "rating": 4.5,
  "review_count": 1234
}
\`\`\``,

  whyItMatters: 'Understanding the data model and access patterns drives all architecture decisions.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving millions of products',
    howTheyDoIt: 'Microservices per domain. Product catalog separate from inventory. Heavy caching.',
  },

  keyPoints: [
    'Products have many attributes',
    'Read-heavy, write-critical',
    'Catalog separate from inventory',
  ],

  keyConcepts: [
    { title: 'Product Catalog', explanation: 'All product information', icon: '📦' },
    { title: 'SKU', explanation: 'Stock Keeping Unit - unique product identifier', icon: '🏷️' },
  ],
};

const step1: GuidedStep = {
  id: 'amazon-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse product catalog',
    taskDescription: 'Add Client and App Server for product browsing',
    componentsNeeded: [
      { type: 'client', reason: 'Shopper browsing products', displayName: 'MegaStore App' },
      { type: 'app_server', reason: 'Handles catalog requests', displayName: 'Catalog Service' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'Connected together',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them together',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "We need to store all the product data!",
  hook: "You have 100,000 products to list. Each has title, description, images, price, categories, and inventory. Where does all this data live?",
  challenge: "Add a database for products and categories.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Product catalog stored!',
  achievement: '100,000 products organized and queryable',
  metrics: [
    { label: 'Products', after: '100,000' },
    { label: 'Categories', after: '500' },
  ],
  nextTeaser: "Now let's add the shopping cart...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'E-commerce Data Model',
  conceptExplanation: `**Core Tables:**

\`\`\`sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,
  title VARCHAR(200),
  description TEXT,
  base_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  category_id BIGINT,
  brand VARCHAR(100),
  rating DECIMAL(2,1),
  review_count INT,
  status VARCHAR(20),  -- active, inactive, discontinued
  created_at TIMESTAMP,
  INDEX (category_id),
  INDEX (status)
);

CREATE TABLE product_images (
  id BIGINT PRIMARY KEY,
  product_id BIGINT,
  url VARCHAR(500),
  is_primary BOOLEAN,
  display_order INT
);

CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT,
  sku VARCHAR(50) UNIQUE,
  name VARCHAR(100),       -- "Red, Large"
  price_adjustment DECIMAL(10,2),
  attributes JSONB,        -- {"color": "red", "size": "L"}
  inventory_count INT,
  INDEX (product_id)
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  parent_id BIGINT,        -- For hierarchy
  slug VARCHAR(100),
  display_order INT
);

CREATE TABLE inventory (
  product_id BIGINT PRIMARY KEY,
  quantity INT,
  reserved INT,            -- Reserved during checkout
  warehouse_id BIGINT,
  last_updated TIMESTAMP
);
\`\`\`

**Product Variants:**
\`\`\`
T-Shirt (product_id: 1)
├── Red, Small  (variant_id: 101)
├── Red, Medium (variant_id: 102)
├── Red, Large  (variant_id: 103)
├── Blue, Small (variant_id: 104)
└── Blue, Medium (variant_id: 105)
\`\`\``,

  whyItMatters: 'The data model handles product variants, categories, and inventory relationships.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Millions of products',
    howTheyDoIt: 'Separate databases per domain. DynamoDB for catalog. PostgreSQL for orders.',
  },

  keyPoints: [
    'Products with variants',
    'Category hierarchy',
    'Inventory separate from catalog',
  ],

  keyConcepts: [
    { title: 'Variant', explanation: 'Size/color combination', icon: '🎨' },
    { title: 'Inventory', explanation: 'Stock quantity tracking', icon: '📊' },
  ],
};

const step2: GuidedStep = {
  id: 'amazon-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store product catalog',
    taskDescription: 'Add Database for products and categories',
    componentsNeeded: [
      { type: 'database', reason: 'Store products and categories', displayName: 'Product DB' },
    ],
    successCriteria: [
      'Database added',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database component',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Shopping Cart (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🛒',
  scenario: "Shoppers can browse but can't save items!",
  hook: "A customer finds 5 items they want. They can't collect them to buy together. 'Where's my cart?!' Every store needs a shopping cart!",
  challenge: "Implement shopping cart functionality.",
  illustration: 'cart',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic e-commerce works!',
  achievement: 'Shoppers can browse products and add to cart',
  metrics: [
    { label: 'Browse products', after: '✓ Working' },
    { label: 'Shopping cart', after: '✓ Working' },
    { label: 'Products', after: '100,000' },
  ],
  nextTeaser: "But shoppers can't checkout yet...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Shopping Cart Implementation',
  conceptExplanation: `**Cart Requirements:**
- Add/remove items
- Adjust quantities
- Persist across sessions
- Handle price changes
- Calculate totals

**Cart Storage Options:**

**Option 1: Database (Recommended for logged-in users)**
\`\`\`sql
CREATE TABLE carts (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  status VARCHAR(20),  -- active, converted, abandoned
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE cart_items (
  id BIGINT PRIMARY KEY,
  cart_id BIGINT,
  product_id BIGINT,
  variant_id BIGINT,
  quantity INT,
  price_at_add DECIMAL(10,2),  -- Snapshot price
  added_at TIMESTAMP
);
\`\`\`

**Option 2: Redis (Fast, temporary)**
\`\`\`python
# Cart as Redis hash
def add_to_cart(user_id, product_id, quantity):
    cart_key = f"cart:{user_id}"
    redis.hset(cart_key, product_id, quantity)
    redis.expire(cart_key, 86400 * 7)  # 7 days

def get_cart(user_id):
    cart_key = f"cart:{user_id}"
    return redis.hgetall(cart_key)
\`\`\`

**Add to Cart Flow:**
\`\`\`python
async def add_to_cart(user_id, product_id, variant_id, quantity):
    # Validate product exists and is in stock
    product = await db.get_product(product_id)
    if not product:
        raise NotFound("Product not found")

    variant = await db.get_variant(variant_id)
    if variant.inventory_count < quantity:
        raise BadRequest("Insufficient stock")

    # Get or create cart
    cart = await get_or_create_cart(user_id)

    # Check if item already in cart
    existing = await db.get_cart_item(cart.id, variant_id)
    if existing:
        new_quantity = existing.quantity + quantity
        await db.update_cart_item(existing.id, quantity=new_quantity)
    else:
        await db.create_cart_item(
            cart_id=cart.id,
            product_id=product_id,
            variant_id=variant_id,
            quantity=quantity,
            price_at_add=variant.price or product.base_price
        )

    return await get_cart_with_items(cart.id)
\`\`\`

**Cart Total Calculation:**
\`\`\`python
def calculate_cart_total(cart_items):
    subtotal = sum(item.quantity * item.current_price for item in cart_items)
    tax = calculate_tax(subtotal, cart.shipping_address)
    shipping = calculate_shipping(cart_items, cart.shipping_address)
    return {
        'subtotal': subtotal,
        'tax': tax,
        'shipping': shipping,
        'total': subtotal + tax + shipping
    }
\`\`\``,

  whyItMatters: 'The cart is the bridge between browsing and buying. Must be reliable.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Persistent carts',
    howTheyDoIt: 'Carts persist for months. "Save for later" feature. Cart abandonment emails.',
  },

  keyPoints: [
    'Persist across sessions',
    'Snapshot price at add time',
    'Validate inventory on add',
  ],

  keyConcepts: [
    { title: 'Cart', explanation: 'Collection of items to buy', icon: '🛒' },
    { title: 'Price Snapshot', explanation: 'Remember price when added', icon: '📸' },
  ],
};

const step3: GuidedStep = {
  id: 'amazon-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Shopping cart',
    taskDescription: 'Implement cart with add/remove/update',
    successCriteria: [
      'Add items to cart',
      'Update quantities',
      'Cart persists across sessions',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Cart table with cart_items',
    level2: 'Get or create cart, add/update items',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Checkout & Orders
// =============================================================================

// =============================================================================
// STEP 4: Checkout Flow (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💳',
  scenario: "Phase 2 begins! Shoppers want to BUY!",
  hook: "A customer has $500 worth of items in their cart. They're ready to buy. But there's no checkout button! We need the money flow!",
  challenge: "NEW REQUIREMENT: FR-3 - Checkout and payment.",
  illustration: 'checkout',
};

const step4Celebration: CelebrationContent = {
  emoji: '💳',
  message: 'Checkout is working!',
  achievement: 'Customers can complete purchases',
  metrics: [
    { label: 'Checkout', after: '✓ Working' },
    { label: 'Payments', after: '✓ Processing' },
  ],
  nextTeaser: "Now let's add order tracking...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Checkout Flow',

  frameworkReminder: {
    question: "How do customers complete purchases?",
    connection: "FR-3 requires checkout. This is where money changes hands - MUST be reliable."
  },

  conceptExplanation: `**Checkout Steps:**
\`\`\`
1. Review cart
2. Enter shipping address
3. Select shipping method
4. Enter payment info
5. Place order
6. Confirm & receipt
\`\`\`

**Order Data Model:**
\`\`\`sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE,
  user_id BIGINT,
  status VARCHAR(30),
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  total DECIMAL(10,2),
  shipping_address JSONB,
  billing_address JSONB,
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),  -- External payment reference
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  variant_id BIGINT,
  quantity INT,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2)
);
\`\`\`

**Order Status Flow:**
\`\`\`
pending → payment_processing → paid → processing → shipped → delivered
                   ↓
              payment_failed → cancelled
\`\`\`

**Checkout Implementation:**
\`\`\`python
async def checkout(user_id, checkout_data):
    cart = await get_cart(user_id)
    if not cart.items:
        raise BadRequest("Cart is empty")

    # 1. Validate inventory (again!)
    for item in cart.items:
        inventory = await get_inventory(item.variant_id)
        if inventory.available < item.quantity:
            raise BadRequest(f"Insufficient stock for {item.product.title}")

    # 2. Calculate totals
    totals = calculate_totals(cart, checkout_data.shipping_address)

    # 3. Create order (pending)
    order = await db.create_order(
        user_id=user_id,
        status='pending',
        items=cart.items,
        totals=totals,
        shipping_address=checkout_data.shipping_address
    )

    # 4. Process payment
    try:
        payment = await stripe.charges.create(
            amount=int(totals.total * 100),
            currency='usd',
            source=checkout_data.payment_token,
            metadata={'order_id': order.id}
        )
        await db.update_order(order.id, status='paid', payment_id=payment.id)
    except stripe.CardError as e:
        await db.update_order(order.id, status='payment_failed')
        raise PaymentFailed(str(e))

    # 5. Reserve inventory
    for item in cart.items:
        await reserve_inventory(item.variant_id, item.quantity)

    # 6. Clear cart
    await clear_cart(cart.id)

    return order
\`\`\``,

  whyItMatters: 'Checkout is where revenue happens. Must be reliable, secure, and fast.',

  famousIncident: {
    title: 'Checkout Reliability',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon estimates every 100ms of latency costs 1% of sales. Checkout must be fast.',
    lessonLearned: 'Checkout performance directly impacts revenue.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'One-click checkout',
    howTheyDoIt: 'Patented one-click ordering. Stored payment methods. Sub-second checkout.',
  },

  keyPoints: [
    'Validate inventory before payment',
    'Process payment via provider',
    'Reserve inventory on success',
  ],

  keyConcepts: [
    { title: 'Checkout', explanation: 'Cart to order conversion', icon: '💳' },
    { title: 'Payment Provider', explanation: 'Stripe, PayPal, etc.', icon: '🏦' },
  ],
};

const step4: GuidedStep = {
  id: 'amazon-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Checkout and payment',
    taskDescription: 'Implement checkout with payment processing',
    successCriteria: [
      'Validate cart and inventory',
      'Create order record',
      'Process payment',
      'Reserve inventory',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Validate → create order → charge → reserve inventory',
    level2: 'Use transaction for atomicity',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Order Tracking (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📦',
  scenario: "Customers want to know where their orders are!",
  hook: "'Where's my package?' A customer placed an order 3 days ago. They need to track it! Order visibility builds trust.",
  challenge: "NEW REQUIREMENT: FR-4 - Order tracking.",
  illustration: 'order-tracking',
};

const step5Celebration: CelebrationContent = {
  emoji: '📦',
  message: 'Order tracking working!',
  achievement: 'Customers can track their orders',
  metrics: [
    { label: 'Order history', after: '✓ Visible' },
    { label: 'Tracking', after: '✓ Real-time' },
  ],
  nextTeaser: "Now let's add notifications...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Order Tracking',

  frameworkReminder: {
    question: "How do customers track orders?",
    connection: "FR-4 enables visibility. Order status, shipment tracking, delivery estimates."
  },

  conceptExplanation: `**Order Lifecycle:**
\`\`\`
placed → confirmed → processing → shipped → out_for_delivery → delivered
    ↓                                              ↓
 cancelled                                      failed_delivery
\`\`\`

**Shipment Tracking:**
\`\`\`sql
CREATE TABLE shipments (
  id BIGINT PRIMARY KEY,
  order_id BIGINT,
  carrier VARCHAR(50),           -- UPS, FedEx, USPS
  tracking_number VARCHAR(100),
  status VARCHAR(30),
  estimated_delivery DATE,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE TABLE shipment_events (
  id BIGINT PRIMARY KEY,
  shipment_id BIGINT,
  status VARCHAR(50),
  location VARCHAR(200),
  description TEXT,
  occurred_at TIMESTAMP
);
\`\`\`

**Tracking Events:**
\`\`\`python
# Example tracking timeline
events = [
    {"status": "label_created", "location": "Warehouse", "time": "2024-01-15 09:00"},
    {"status": "picked_up", "location": "Warehouse", "time": "2024-01-15 14:00"},
    {"status": "in_transit", "location": "Distribution Center", "time": "2024-01-16 03:00"},
    {"status": "out_for_delivery", "location": "Local Hub", "time": "2024-01-17 06:00"},
    {"status": "delivered", "location": "Customer Address", "time": "2024-01-17 14:30"},
]
\`\`\`

**Integration with Carriers:**
\`\`\`python
async def sync_tracking(shipment_id):
    shipment = await db.get_shipment(shipment_id)

    # Call carrier API
    if shipment.carrier == 'ups':
        events = await ups_api.get_tracking(shipment.tracking_number)
    elif shipment.carrier == 'fedex':
        events = await fedex_api.get_tracking(shipment.tracking_number)

    # Store events
    for event in events:
        await db.upsert_shipment_event(shipment_id, event)

    # Update shipment status
    await db.update_shipment(shipment_id, status=events[-1].status)
\`\`\`

**Order History API:**
\`\`\`python
@app.route('/orders')
async def get_orders(user_id):
    orders = await db.get_user_orders(user_id, limit=50)
    return [{
        'id': o.id,
        'order_number': o.order_number,
        'status': o.status,
        'total': o.total,
        'items': serialize_items(o.items),
        'tracking': get_tracking_info(o.shipment),
        'created_at': o.created_at
    } for o in orders]
\`\`\``,

  whyItMatters: 'Order visibility reduces support tickets and builds customer confidence.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Real-time tracking',
    howTheyDoIt: 'Carrier integrations. Map view of driver. "X stops away" messaging.',
  },

  keyPoints: [
    'Order status lifecycle',
    'Carrier API integration',
    'Event-based tracking',
  ],

  keyConcepts: [
    { title: 'Shipment', explanation: 'Physical delivery', icon: '🚚' },
    { title: 'Tracking Event', explanation: 'Status update point', icon: '📍' },
  ],
};

const step5: GuidedStep = {
  id: 'amazon-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Order tracking',
    taskDescription: 'Implement order history and shipment tracking',
    successCriteria: [
      'Order history API',
      'Shipment status tracking',
      'Carrier integration',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add shipments and shipment_events tables',
    level2: 'Poll carrier APIs, update status',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Notifications (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔔',
  scenario: "Customers want updates on their orders!",
  hook: "Order shipped? Email the customer! Out for delivery? Push notification! Keeping customers informed reduces 'Where's my order?' calls.",
  challenge: "Add order notifications.",
  illustration: 'notifications',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full ordering system!',
  achievement: 'Checkout, orders, tracking, and notifications',
  metrics: [
    { label: 'Checkout', after: '✓ Working' },
    { label: 'Order tracking', after: '✓ Real-time' },
    { label: 'Notifications', after: '✓ Multi-channel' },
  ],
  nextTeaser: "Phase 3: Handling flash sales!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Order Notifications',

  frameworkReminder: {
    question: "How do we keep customers informed?",
    connection: "Notifications update customers at key moments - order confirmed, shipped, delivered."
  },

  conceptExplanation: `**Notification Triggers:**
\`\`\`
order_placed      → "Thanks for your order!"
payment_confirmed → "Payment received"
order_shipped     → "Your order is on its way!"
out_for_delivery  → "Your package is out for delivery"
delivered         → "Your package was delivered"
\`\`\`

**Multi-Channel Delivery:**
\`\`\`python
async def send_notification(user_id, notification_type, data):
    user = await db.get_user(user_id)

    # Email (always)
    await send_email(
        to=user.email,
        template=notification_type,
        data=data
    )

    # Push notification (if enabled)
    if user.push_enabled:
        await send_push(user.device_tokens, notification_type, data)

    # SMS (for critical updates if enabled)
    if user.sms_enabled and notification_type in ['out_for_delivery', 'delivered']:
        await send_sms(user.phone, notification_type, data)
\`\`\`

**Async Processing:**
\`\`\`python
# Don't block checkout for notifications
async def on_order_placed(order):
    # Queue notification for async processing
    await queue.publish('notifications', {
        'type': 'order_placed',
        'user_id': order.user_id,
        'order_id': order.id,
        'data': {
            'order_number': order.order_number,
            'total': order.total,
            'items': serialize_items(order.items)
        }
    })

# Notification worker
async def notification_worker():
    async for job in queue.consume('notifications'):
        await send_notification(
            job['user_id'],
            job['type'],
            job['data']
        )
\`\`\`

**Email Templates:**
\`\`\`html
<!-- order_shipped.html -->
<h1>Your order is on the way!</h1>
<p>Order #{{order_number}} has been shipped.</p>
<p>Track your package: <a href="{{tracking_url}}">{{tracking_number}}</a></p>
<p>Estimated delivery: {{estimated_delivery}}</p>
\`\`\``,

  whyItMatters: 'Proactive notifications reduce support load and improve customer experience.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Multi-channel notifications',
    howTheyDoIt: 'Email + app push + SMS. "Your package is X stops away" real-time updates.',
  },

  keyPoints: [
    'Async notification processing',
    'Multi-channel (email, push, SMS)',
    'Template-based messages',
  ],

  keyConcepts: [
    { title: 'Notification', explanation: 'User update message', icon: '🔔' },
    { title: 'Multi-Channel', explanation: 'Email, push, SMS', icon: '📱' },
  ],
};

const step6: GuidedStep = {
  id: 'amazon-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Order notifications',
    taskDescription: 'Add multi-channel notifications',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Async notification processing', displayName: 'Notification Queue' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Queue notifications on order events',
      'Workers send email/push/SMS',
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
    level1: 'Add queue for async notifications',
    level2: 'Queue on order events, workers process and send',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale & Inventory
// =============================================================================

// =============================================================================
// STEP 7: Inventory Management (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Phase 3 begins! OVERSELLING DISASTER!",
  hook: "Flash sale! 100 units of iPhone available. 500 people checkout simultaneously. 200 orders confirmed. You just oversold by 100 units! Customers are FURIOUS!",
  challenge: "Implement proper inventory management to prevent overselling.",
  illustration: 'inventory',
};

const step7Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Inventory management working!',
  achievement: 'No more overselling',
  metrics: [
    { label: 'Overselling', after: '0%' },
    { label: 'Inventory locking', after: '✓ Active' },
  ],
  nextTeaser: "Now let's add caching for scale...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Inventory Management & Locking',

  frameworkReminder: {
    question: "How do we prevent overselling?",
    connection: "Concurrent checkouts can cause overselling. Need distributed locking."
  },

  conceptExplanation: `**The Overselling Problem:**
\`\`\`
Time 0: Stock = 1
Time 1: User A reads stock (1) ✓ proceed
Time 1: User B reads stock (1) ✓ proceed
Time 2: User A decrements (1-1=0)
Time 2: User B decrements (0-1=-1) 💥 OVERSOLD!
\`\`\`

**Solution 1: Pessimistic Locking (Database)**
\`\`\`sql
BEGIN;
SELECT quantity FROM inventory
WHERE product_id = 123
FOR UPDATE;  -- Lock the row

-- Check and decrement
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 123
AND quantity >= 1;

COMMIT;
\`\`\`

**Solution 2: Optimistic Locking (Version)**
\`\`\`sql
-- Read with version
SELECT quantity, version FROM inventory WHERE product_id = 123;
-- quantity=10, version=5

-- Update with version check
UPDATE inventory
SET quantity = quantity - 1, version = version + 1
WHERE product_id = 123
AND version = 5;

-- If rows_affected = 0, retry!
\`\`\`

**Solution 3: Redis Distributed Lock**
\`\`\`python
async def reserve_inventory(product_id, quantity):
    lock_key = f"lock:inventory:{product_id}"

    # Acquire lock
    if not await redis.set(lock_key, "1", nx=True, ex=10):
        raise ConcurrentModification("Please try again")

    try:
        # Check stock
        stock = await redis.get(f"inventory:{product_id}")
        if int(stock) < quantity:
            raise InsufficientStock()

        # Decrement
        await redis.decrby(f"inventory:{product_id}", quantity)

        # Sync to DB async
        await queue.publish('inventory-sync', {
            'product_id': product_id,
            'delta': -quantity
        })
    finally:
        await redis.delete(lock_key)
\`\`\`

**Inventory States:**
\`\`\`
Total: 100
Reserved: 20 (in checkout, not paid)
Sold: 70 (paid orders)
Available: 10 (total - reserved - sold)
\`\`\`

**Reservation Expiry:**
\`\`\`python
# Reserve inventory during checkout
async def start_checkout(cart):
    for item in cart.items:
        await reserve_inventory(item.product_id, item.quantity, ttl=900)  # 15 min

# Release if checkout not completed
async def release_expired_reservations():
    expired = await db.get_expired_reservations()
    for res in expired:
        await release_inventory(res.product_id, res.quantity)
\`\`\``,

  whyItMatters: 'Overselling damages customer trust and creates operational nightmares.',

  famousIncident: {
    title: 'Flash Sale Overselling',
    company: 'Various',
    year: 'Common',
    whatHappened: 'Many retailers have oversold during flash sales. Some honor orders at a loss, others cancel and face PR disasters.',
    lessonLearned: 'Inventory locking is essential for high-traffic sales.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day sales',
    howTheyDoIt: 'Distributed inventory system. Reserved quantity during checkout. Short reservation window.',
  },

  keyPoints: [
    'Lock before decrementing',
    'Reserve during checkout',
    'Release expired reservations',
  ],

  keyConcepts: [
    { title: 'Inventory Lock', explanation: 'Prevent concurrent modification', icon: '🔒' },
    { title: 'Reservation', explanation: 'Temporary hold on stock', icon: '🎫' },
  ],
};

const step7: GuidedStep = {
  id: 'amazon-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Prevent overselling',
    taskDescription: 'Implement inventory locking',
    componentsNeeded: [
      { type: 'cache', reason: 'Distributed locks and fast inventory', displayName: 'Redis Inventory' },
    ],
    successCriteria: [
      'Add Redis for inventory',
      'Lock before decrement',
      'Reservation with TTL',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Redis for distributed locks',
    level2: 'SETNX for lock, check-then-decrement, always release',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 8: Product Caching (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "The database is melting during the sale!",
  hook: "10 million people are browsing products. Every page load queries the database. The database can't keep up! Product pages are timing out!",
  challenge: "Add caching for product data.",
  illustration: 'caching',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Caching is working!',
  achievement: 'Product pages load instantly',
  metrics: [
    { label: 'Page load', before: '2000ms', after: '50ms' },
    { label: 'DB queries', before: '10M/hour', after: '100K/hour' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Product Caching Strategy',

  frameworkReminder: {
    question: "How do we handle millions of product page views?",
    connection: "Product data changes rarely but is read millions of times. Perfect for caching."
  },

  conceptExplanation: `**What to Cache:**
| Data | TTL | Strategy |
|------|-----|----------|
| Product details | 1 hour | Cache aside |
| Category list | 1 day | Cache aside |
| Price | 5 min | Short TTL |
| Inventory | Real-time | Cache + events |
| Reviews | 15 min | Cache aside |

**Cache-Aside Pattern:**
\`\`\`python
async def get_product(product_id):
    # 1. Check cache
    cached = await redis.get(f"product:{product_id}")
    if cached:
        return json.loads(cached)

    # 2. Cache miss - query DB
    product = await db.get_product(product_id)
    if not product:
        return None

    # 3. Store in cache
    await redis.setex(
        f"product:{product_id}",
        3600,  # 1 hour
        json.dumps(product)
    )

    return product
\`\`\`

**Cache Invalidation:**
\`\`\`python
async def update_product(product_id, data):
    # Update database
    await db.update_product(product_id, data)

    # Invalidate cache
    await redis.delete(f"product:{product_id}")

    # Also invalidate related caches
    await redis.delete(f"category:{product.category_id}:products")
\`\`\`

**Pre-Warming for Sales:**
\`\`\`python
async def prewarm_sale_products(sale_id):
    products = await db.get_sale_products(sale_id)
    for product in products:
        await redis.setex(
            f"product:{product.id}",
            3600,
            json.dumps(product)
        )
    print(f"Pre-warmed {len(products)} products")
\`\`\`

**Multi-Level Caching:**
\`\`\`
Request → CDN (static assets)
        → App Cache (in-memory)
        → Redis (distributed)
        → Database (source of truth)
\`\`\``,

  whyItMatters: 'Caching is essential for read-heavy e-commerce. Without it, databases can\'t scale.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day traffic',
    howTheyDoIt: 'Multiple cache layers. Pre-warm before sales. Aggressive caching with short TTL.',
  },

  keyPoints: [
    'Cache-aside pattern',
    'Invalidate on update',
    'Pre-warm for sales',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'TTL', explanation: 'Time To Live', icon: '⏰' },
  ],
};

const step8: GuidedStep = {
  id: 'amazon-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle traffic spikes',
    taskDescription: 'Implement product caching',
    successCriteria: [
      'Cache product data',
      'Invalidate on updates',
      'Pre-warm for sales',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Cache-aside: check cache → miss → query DB → store',
    level2: 'Invalidate on update, pre-warm for sales',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Load Balancing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Single server can't handle the load!",
  hook: "Black Friday! 100x normal traffic. One server is maxed out. Orders are failing. We need to scale horizontally!",
  challenge: "Add load balancing for scale.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Production-ready e-commerce!',
  achievement: 'Inventory management, caching, and horizontal scale',
  metrics: [
    { label: 'Inventory', after: 'No overselling' },
    { label: 'Caching', after: '99% hit rate' },
    { label: 'Scale', after: 'Horizontally' },
  ],
  nextTeaser: "Phase 4: Search and recommendations!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing E-commerce',

  frameworkReminder: {
    question: "How do we handle Black Friday traffic?",
    connection: "Single server has limits. Load balancer distributes across multiple servers."
  },

  conceptExplanation: `**Traffic Patterns:**
\`\`\`
Normal day: 1,000 req/s
Sale day: 50,000 req/s
Black Friday: 100,000 req/s
\`\`\`

**Architecture:**
\`\`\`
Users → CDN → Load Balancer → App Servers
                             → Server 1
                             → Server 2
                             → ...
                             → Server N
\`\`\`

**Auto-Scaling:**
\`\`\`yaml
scaling:
  min_instances: 10
  max_instances: 500
  scale_up:
    cpu_percent: > 60
    request_latency: > 500ms
  scale_down:
    cpu_percent: < 30
    cooldown: 300s
\`\`\`

**Session Management:**
\`\`\`
Option 1: Sticky sessions (same user → same server)
Option 2: Shared session store (Redis)
Option 3: Stateless with JWT
\`\`\`

**Stateless Approach:**
\`\`\`python
# All state in database/cache, not server memory
@app.route('/cart')
async def get_cart():
    user_id = verify_jwt(request.headers['Authorization'])
    cart = await redis.get(f"cart:{user_id}")
    # Any server can handle this request
    return cart
\`\`\`

**Database Connection Pooling:**
\`\`\`python
# Each server has limited DB connections
pool = asyncpg.create_pool(
    min_size=10,
    max_size=50
)

# With 100 servers × 50 connections = 5000 DB connections
# Consider: Connection proxy like PgBouncer
\`\`\``,

  whyItMatters: 'Horizontal scaling enables handling any traffic level.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day',
    howTheyDoIt: 'Auto-scaling from hundreds to thousands of servers. Capacity planning months ahead.',
  },

  keyPoints: [
    'Stateless servers',
    'Auto-scaling based on load',
    'Connection pooling',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests', icon: '⚖️' },
    { title: 'Auto-Scaling', explanation: 'Add servers as needed', icon: '📈' },
  ],
};

const step9: GuidedStep = {
  id: 'amazon-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle Black Friday traffic',
    taskDescription: 'Add load balancer with auto-scaling',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Stateless servers',
      'Auto-scaling configured',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add LB between clients and servers',
    level2: 'Stateless servers, shared state in Redis/DB',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Search, Recommendations, Marketplace
// =============================================================================

// =============================================================================
// STEP 10: Product Search (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🔍',
  scenario: "Phase 4 begins! Users can't find products!",
  hook: "100,000 products in the catalog. A customer searches for 'wireless earbuds' and gets... random results. Good search = more sales!",
  challenge: "Implement product search.",
  illustration: 'search',
};

const step10Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Search is working!',
  achievement: 'Customers can find products easily',
  metrics: [
    { label: 'Search', after: '✓ Full-text' },
    { label: 'Filters', after: 'Category, Price, Rating' },
  ],
  nextTeaser: "Now let's add recommendations...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Product Search',

  frameworkReminder: {
    question: "How do customers find products?",
    connection: "Search is the primary discovery mechanism. Good search increases conversion."
  },

  conceptExplanation: `**Search Requirements:**
- Full-text search on title, description
- Filters (category, price, brand, rating)
- Faceted search (show filter counts)
- Autocomplete
- Typo tolerance

**Elasticsearch Index:**
\`\`\`json
{
  "mappings": {
    "properties": {
      "product_id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "english"
      },
      "description": { "type": "text" },
      "category": { "type": "keyword" },
      "brand": { "type": "keyword" },
      "price": { "type": "float" },
      "rating": { "type": "float" },
      "in_stock": { "type": "boolean" },
      "tags": { "type": "keyword" }
    }
  }
}
\`\`\`

**Search Query with Filters:**
\`\`\`python
def search_products(query, filters=None, page=1, page_size=20):
    body = {
        "query": {
            "bool": {
                "must": {
                    "multi_match": {
                        "query": query,
                        "fields": ["title^3", "description", "brand^2"],
                        "fuzziness": "AUTO"
                    }
                },
                "filter": []
            }
        },
        "aggs": {
            "categories": { "terms": { "field": "category" } },
            "brands": { "terms": { "field": "brand" } },
            "price_ranges": {
                "range": {
                    "field": "price",
                    "ranges": [
                        { "to": 25 },
                        { "from": 25, "to": 50 },
                        { "from": 50, "to": 100 },
                        { "from": 100 }
                    ]
                }
            }
        },
        "from": (page - 1) * page_size,
        "size": page_size
    }

    # Add filters
    if filters:
        if filters.get('category'):
            body["query"]["bool"]["filter"].append(
                {"term": {"category": filters['category']}}
            )
        if filters.get('min_price'):
            body["query"]["bool"]["filter"].append(
                {"range": {"price": {"gte": filters['min_price']}}}
            )

    return es.search(index="products", body=body)
\`\`\`

**Autocomplete:**
\`\`\`json
{
  "suggest": {
    "product-suggest": {
      "prefix": "wire",
      "completion": {
        "field": "title_suggest",
        "fuzzy": { "fuzziness": 1 }
      }
    }
  }
}
\`\`\``,

  whyItMatters: 'Search is the #1 way customers find products. Better search = higher conversion.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product search',
    howTheyDoIt: 'Custom search infrastructure. A9 algorithm considers relevance + conversion + profit.',
  },

  keyPoints: [
    'Elasticsearch for full-text',
    'Faceted search with aggregations',
    'Typo tolerance with fuzziness',
  ],

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search in product text', icon: '🔍' },
    { title: 'Faceted Search', explanation: 'Filter counts', icon: '📊' },
  ],
};

const step10: GuidedStep = {
  id: 'amazon-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Product search',
    taskDescription: 'Implement search with Elasticsearch',
    successCriteria: [
      'Full-text product search',
      'Filters and facets',
      'Autocomplete',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Elasticsearch with multi_match and filters',
    level2: 'Index title, description, use aggregations for facets',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Recommendations (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🎯',
  scenario: "Customers need help discovering products!",
  hook: "'Customers who bought this also bought...' 'Recommended for you.' Personalization increases average order value by 30%!",
  challenge: "Build a recommendation engine.",
  illustration: 'recommendations',
};

const step11Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Recommendations working!',
  achievement: 'Personalized product suggestions',
  metrics: [
    { label: 'Recommendations', after: '✓ Personalized' },
    { label: 'AOV', after: '+30%' },
  ],
  nextTeaser: "One final step: global fulfillment!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Product Recommendations',

  frameworkReminder: {
    question: "How do we increase order value?",
    connection: "Recommendations suggest relevant products. 35% of Amazon revenue comes from recommendations."
  },

  conceptExplanation: `**Recommendation Types:**
\`\`\`
1. "Frequently bought together"
2. "Customers who bought X also bought Y"
3. "Based on your browsing history"
4. "Recommended for you"
5. "Similar products"
\`\`\`

**Collaborative Filtering:**
\`\`\`python
# Users who bought X also bought Y
def get_also_bought(product_id, limit=10):
    # Find orders containing this product
    orders = db.query("""
        SELECT order_id FROM order_items
        WHERE product_id = ?
    """, product_id)

    # Find other products in those orders
    recommendations = db.query("""
        SELECT product_id, COUNT(*) as frequency
        FROM order_items
        WHERE order_id IN (?)
        AND product_id != ?
        GROUP BY product_id
        ORDER BY frequency DESC
        LIMIT ?
    """, orders, product_id, limit)

    return recommendations
\`\`\`

**Frequently Bought Together:**
\`\`\`python
def get_frequently_bought_together(product_id):
    # Products often in the same order
    return db.query("""
        SELECT oi2.product_id, COUNT(*) as co_occurrence
        FROM order_items oi1
        JOIN order_items oi2 ON oi1.order_id = oi2.order_id
        WHERE oi1.product_id = ?
        AND oi2.product_id != ?
        GROUP BY oi2.product_id
        ORDER BY co_occurrence DESC
        LIMIT 3
    """, product_id, product_id)
\`\`\`

**Personalized Recommendations:**
\`\`\`python
def get_personalized(user_id, limit=20):
    # Get user's purchase history
    purchased = get_user_purchases(user_id)
    browsed = get_browsing_history(user_id)

    # Find similar users
    similar_users = find_similar_users(user_id)

    # Get what similar users bought
    candidates = get_purchases_by_users(similar_users)

    # Filter out already purchased
    recommendations = [p for p in candidates if p.id not in purchased]

    # Score and rank
    scored = []
    for product in recommendations:
        score = calculate_recommendation_score(product, user_id)
        scored.append((product, score))

    return sorted(scored, key=lambda x: -x[1])[:limit]
\`\`\`

**Pre-Computing Recommendations:**
\`\`\`python
# Run nightly job
async def precompute_recommendations():
    for product in all_products:
        also_bought = compute_also_bought(product.id)
        await redis.set(f"rec:also_bought:{product.id}", json.dumps(also_bought))

        similar = compute_similar(product.id)
        await redis.set(f"rec:similar:{product.id}", json.dumps(similar))
\`\`\``,

  whyItMatters: 'Recommendations are a significant revenue driver. Amazon attributes 35% of revenue to them.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product recommendations',
    howTheyDoIt: 'Item-to-item collaborative filtering. Pre-computed and cached. A/B tested constantly.',
  },

  keyPoints: [
    'Collaborative filtering',
    'Pre-compute and cache',
    'Multiple recommendation types',
  ],

  keyConcepts: [
    { title: 'Collaborative Filtering', explanation: 'Similar users, similar purchases', icon: '👥' },
    { title: 'Pre-Computing', explanation: 'Calculate offline, serve fast', icon: '⚡' },
  ],
};

const step11: GuidedStep = {
  id: 'amazon-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Product recommendations',
    taskDescription: 'Build recommendation engine',
    successCriteria: [
      'Also bought together',
      'Personalized recommendations',
      'Pre-compute and cache',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Collaborative filtering based on order history',
    level2: 'Pre-compute nightly, cache in Redis',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Global Fulfillment (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🌍',
  scenario: "MegaStore is going global!",
  hook: "Customers in Europe complain about slow shipping from US warehouses. We need warehouses worldwide! Global fulfillment is the final frontier.",
  challenge: "Design multi-region fulfillment.",
  illustration: 'fulfillment',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Amazon system design!',
  achievement: 'From basic store to global e-commerce platform',
  metrics: [
    { label: 'Products', after: 'Millions' },
    { label: 'Orders/day', after: 'Millions' },
    { label: 'Regions', after: 'Global' },
    { label: 'Features', after: 'Search, Recommendations, Fulfillment' },
  ],
  nextTeaser: "You've completed the Amazon journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Global Fulfillment',

  frameworkReminder: {
    question: "How do we deliver globally?",
    connection: "Multiple warehouses, smart routing, inventory distribution."
  },

  conceptExplanation: `**Fulfillment Network:**
\`\`\`
Warehouses:
├── US East (New Jersey)
├── US West (California)
├── EU (Germany)
├── UK (London)
└── APAC (Singapore)
\`\`\`

**Inventory Distribution:**
\`\`\`sql
CREATE TABLE warehouse_inventory (
  warehouse_id BIGINT,
  product_id BIGINT,
  quantity INT,
  reserved INT,
  PRIMARY KEY (warehouse_id, product_id)
);
\`\`\`

**Order Routing:**
\`\`\`python
async def select_fulfillment_warehouse(order):
    shipping_address = order.shipping_address
    items = order.items

    # Find warehouses with all items
    eligible = []
    for warehouse in warehouses:
        if can_fulfill(warehouse.id, items):
            distance = calculate_distance(warehouse.location, shipping_address)
            eligible.append((warehouse, distance))

    # Sort by distance
    eligible.sort(key=lambda x: x[1])

    # Consider split shipment if needed
    if not eligible:
        return plan_split_shipment(order)

    return eligible[0][0]

def can_fulfill(warehouse_id, items):
    for item in items:
        inventory = get_warehouse_inventory(warehouse_id, item.product_id)
        if inventory.available < item.quantity:
            return False
    return True
\`\`\`

**Inventory Rebalancing:**
\`\`\`python
# Move inventory based on demand
async def rebalance_inventory():
    for product in high_demand_products:
        demand_by_region = analyze_demand(product.id)

        for region, demand in demand_by_region.items():
            current = get_regional_inventory(product.id, region)
            if current < demand * 2:  # Want 2x buffer
                # Transfer from oversupplied region
                source = find_oversupplied_region(product.id)
                create_transfer_order(product.id, source, region, demand)
\`\`\`

**Same-Day Delivery:**
\`\`\`python
def check_same_day_eligible(address, items):
    # Find local fulfillment center
    local_fc = get_nearest_fulfillment_center(address)

    if distance(local_fc, address) > 30:  # km
        return False

    # Check all items in stock locally
    for item in items:
        if not in_stock_at(local_fc.id, item.product_id):
            return False

    # Check cutoff time (e.g., order by 12pm)
    if now().hour >= 12:
        return False

    return True
\`\`\``,

  whyItMatters: 'Fulfillment is the physical manifestation of e-commerce. Fast delivery = competitive advantage.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Global fulfillment',
    howTheyDoIt: '175+ fulfillment centers worldwide. Predictive stocking. Same-day in major cities.',
  },

  keyPoints: [
    'Multiple warehouses globally',
    'Smart order routing',
    'Inventory rebalancing',
  ],

  keyConcepts: [
    { title: 'Fulfillment Center', explanation: 'Warehouse for orders', icon: '🏭' },
    { title: 'Order Routing', explanation: 'Pick optimal warehouse', icon: '🗺️' },
  ],
};

const step12: GuidedStep = {
  id: 'amazon-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Global fulfillment',
    taskDescription: 'Design multi-warehouse fulfillment',
    successCriteria: [
      'Multiple warehouse support',
      'Smart order routing',
      'Inventory distribution',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Multiple warehouses with inventory per location',
    level2: 'Route orders to nearest warehouse with stock',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const amazonProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'amazon-progressive',
  title: 'Design Amazon',
  description: 'Build an evolving e-commerce platform from basic store to global marketplace',
  difficulty: 'beginner',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🛒',
    hook: "Welcome to MegaStore! You're building the next Amazon.",
    scenario: "Your journey: Start with product catalog, add checkout and orders, handle flash sales at scale, and build search and global fulfillment.",
    challenge: "Can you build an e-commerce platform that handles millions of orders?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    step1, step2, step3,
    step4, step5, step6,
    step7, step8, step9,
    step10, step11, step12,
  ],

  concepts: [
    'Product Catalog Data Model',
    'Shopping Cart',
    'Checkout Flow',
    'Order Management',
    'Notification System',
    'Inventory Locking',
    'Caching Strategy',
    'Load Balancing',
    'Product Search',
    'Recommendation Engine',
    'Global Fulfillment',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 7: Transactions',
    'Chapter 8: Distributed Locks',
  ],
};

export default amazonProgressiveGuidedTutorial;
