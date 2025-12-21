import { GuidedTutorial } from '../../types/guidedTutorial';

export const ecommerceProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'ecommerce-progressive',
  title: 'Design an E-commerce Platform',
  description: 'Build an e-commerce system from product catalog to global marketplace',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design product catalog with search and filtering',
    'Build shopping cart and checkout flow',
    'Implement inventory management and order processing',
    'Handle flash sales and high-traffic events',
    'Add personalization and recommendation systems'
  ],
  prerequisites: ['Database design', 'Caching', 'Payment systems'],
  tags: ['ecommerce', 'marketplace', 'inventory', 'payments', 'recommendations'],

  progressiveStory: {
    title: 'E-commerce Platform Evolution',
    premise: "You're building an e-commerce platform. Starting with a simple product catalog, you'll evolve to handle millions of products, flash sales, and personalized shopping experiences.",
    phases: [
      { phase: 1, title: 'Product Catalog', description: 'Products, categories, and search' },
      { phase: 2, title: 'Shopping Experience', description: 'Cart, checkout, and orders' },
      { phase: 3, title: 'Scale & Reliability', description: 'Inventory and flash sales' },
      { phase: 4, title: 'Smart Commerce', description: 'Personalization and marketplace' }
    ]
  },

  steps: [
    // PHASE 1: Product Catalog (Steps 1-3)
    {
      id: 'step-1',
      title: 'Product Data Model',
      phase: 1,
      phaseTitle: 'Product Catalog',
      learningObjective: 'Model products with variants and attributes',
      thinkingFramework: {
        framework: 'Flexible Product Schema',
        approach: 'Product has variants (size, color). Each variant is a separate SKU with own price/inventory. Attributes vary by category (shoes have size, electronics have specs).',
        keyInsight: 'Use EAV (Entity-Attribute-Value) for dynamic attributes. Fixed schema cant handle "screen size" for TVs and "material" for shirts.'
      },
      requirements: {
        functional: [
          'Store product with name, description, images',
          'Support product variants (size, color combinations)',
          'Define category-specific attributes',
          'Track price and inventory per variant'
        ],
        nonFunctional: []
      },
      hints: [
        'Product: {id, name, description, category_id, attributes, variants}',
        'Variant: {sku, product_id, options: {size, color}, price, inventory}',
        'EAV: {product_id, attribute_name, attribute_value}'
      ],
      expectedComponents: ['Product Service', 'Variant Store', 'Attribute Schema'],
      successCriteria: ['Products stored with variants', 'Attributes flexible by category'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Category & Navigation',
      phase: 1,
      phaseTitle: 'Product Catalog',
      learningObjective: 'Build category hierarchy for browsing',
      thinkingFramework: {
        framework: 'Hierarchical Categories',
        approach: 'Categories form tree: Electronics → Phones → Smartphones. Breadcrumb navigation. Products can be in multiple categories.',
        keyInsight: 'Nested set or materialized path for efficient ancestor/descendant queries. "Get all products in Electronics and subcategories" is common.'
      },
      requirements: {
        functional: [
          'Create category hierarchy (parent-child)',
          'Assign products to categories',
          'Generate breadcrumb navigation',
          'List products in category including subcategories'
        ],
        nonFunctional: [
          'Category tree load < 100ms'
        ]
      },
      hints: [
        'Category: {id, name, parent_id, path, level}',
        'Materialized path: /electronics/phones/smartphones/',
        'Query descendants: path LIKE "/electronics/%"'
      ],
      expectedComponents: ['Category Service', 'Navigation Builder', 'Breadcrumb Generator'],
      successCriteria: ['Hierarchy navigable', 'Products listed correctly'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Product Search & Filtering',
      phase: 1,
      phaseTitle: 'Product Catalog',
      learningObjective: 'Enable search and faceted filtering',
      thinkingFramework: {
        framework: 'Full-Text + Faceted Search',
        approach: 'Elasticsearch for text search. Facets show filter options with counts. Filter by price range, brand, rating, attributes.',
        keyInsight: 'Facet counts update as filters applied. "Nike (45)" means 45 Nike products match current filters. Helps users navigate.'
      },
      requirements: {
        functional: [
          'Full-text search on product name/description',
          'Filter by category, brand, price range',
          'Show facet counts for each filter option',
          'Sort by relevance, price, rating, newest'
        ],
        nonFunctional: [
          'Search latency < 200ms'
        ]
      },
      hints: [
        'Elasticsearch: text fields analyzed, attributes as keywords',
        'Aggregations for facet counts',
        'Price filter: range query'
      ],
      expectedComponents: ['Search Service', 'Facet Engine', 'Filter Builder'],
      successCriteria: ['Search returns relevant results', 'Facets update correctly'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Shopping Experience (Steps 4-6)
    {
      id: 'step-4',
      title: 'Shopping Cart',
      phase: 2,
      phaseTitle: 'Shopping Experience',
      learningObjective: 'Build persistent shopping cart',
      thinkingFramework: {
        framework: 'Cart State Management',
        approach: 'Cart is temporary state before order. Store in Redis for logged-in, localStorage for guests. Merge on login. Expire abandoned carts.',
        keyInsight: 'Cart doesnt reserve inventory (unlike wishlist). Check availability at checkout. Prevents phantom stock from abandoned carts.'
      },
      requirements: {
        functional: [
          'Add/remove items with variants',
          'Update quantities',
          'Calculate subtotal, taxes, shipping estimate',
          'Merge guest cart on login'
        ],
        nonFunctional: [
          'Cart operations < 100ms'
        ]
      },
      hints: [
        'Cart: {user_id, items: [{sku, quantity, price_at_add}]}',
        'Redis for fast access, TTL for guest carts',
        'Merge: combine quantities, resolve conflicts'
      ],
      expectedComponents: ['Cart Service', 'Cart Store (Redis)', 'Price Calculator'],
      successCriteria: ['Cart persists correctly', 'Totals calculated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Checkout Flow',
      phase: 2,
      phaseTitle: 'Shopping Experience',
      learningObjectpoint: 'Build multi-step checkout process',
      thinkingFramework: {
        framework: 'Checkout State Machine',
        approach: 'Steps: cart review → shipping → payment → confirmation. Save progress at each step. Handle back navigation. Validate at each transition.',
        keyInsight: 'Revalidate cart at checkout start. Prices/availability may have changed. Show changes clearly, require acknowledgment.'
      },
      requirements: {
        functional: [
          'Collect shipping address',
          'Calculate shipping options and costs',
          'Collect payment information',
          'Review and confirm order'
        ],
        nonFunctional: [
          'Checkout completion rate > 70%'
        ]
      },
      hints: [
        'Checkout session: {cart_id, step, shipping_address, shipping_method, payment_method}',
        'Validate: inventory available, prices current, address deliverable',
        'Guest checkout: dont require account'
      ],
      expectedComponents: ['Checkout Service', 'Shipping Calculator', 'Address Validator'],
      successCriteria: ['Checkout flows smoothly', 'Validations prevent errors'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Order Processing',
      phase: 2,
      phaseTitle: 'Shopping Experience',
      learningObjective: 'Create and process orders',
      thinkingFramework: {
        framework: 'Order Lifecycle',
        approach: 'Order created → payment captured → inventory decremented → fulfillment started → shipped → delivered. Each step is a state transition.',
        keyInsight: 'Order creation and payment are separate. Auth payment first, create order, then capture. If order creation fails, void the auth.'
      },
      requirements: {
        functional: [
          'Create order from checkout',
          'Process payment and handle failures',
          'Decrement inventory on success',
          'Send confirmation email'
        ],
        nonFunctional: [
          'Order creation < 5 seconds'
        ]
      },
      hints: [
        'Order: {id, user_id, items, shipping, payment_id, status, created_at}',
        'Status flow: pending → paid → processing → shipped → delivered',
        'Atomic: payment + inventory update in transaction'
      ],
      expectedComponents: ['Order Service', 'Payment Processor', 'Inventory Manager'],
      successCriteria: ['Orders created correctly', 'Inventory updated'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Scale & Reliability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Inventory Management',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Track inventory accurately across warehouses',
      thinkingFramework: {
        framework: 'Distributed Inventory',
        approach: 'Inventory per SKU per warehouse. Reserve on checkout, decrement on ship. Handle oversell gracefully (backorder or cancel).',
        keyInsight: 'Soft reserve at cart, hard reserve at payment, decrement at ship. Prevents oversell while allowing cart abandonment.'
      },
      requirements: {
        functional: [
          'Track inventory per SKU per location',
          'Reserve inventory during checkout',
          'Handle multiple warehouses',
          'Alert on low stock'
        ],
        nonFunctional: [
          'Zero oversells for in-stock items'
        ]
      },
      hints: [
        'Inventory: {sku, warehouse_id, available, reserved, total}',
        'available = total - reserved - shipped',
        'Atomic decrement: UPDATE WHERE available >= quantity'
      ],
      expectedComponents: ['Inventory Service', 'Reservation Manager', 'Stock Alert'],
      successCriteria: ['Inventory accurate', 'No overselling'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Flash Sale Handling',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Handle traffic spikes during sales events',
      thinkingFramework: {
        framework: 'High-Concurrency Design',
        approach: 'Flash sale = 1000x normal traffic in seconds. Queue requests, rate limit, pre-warm caches. Fairness: first-come-first-served or lottery.',
        keyInsight: 'Inventory becomes bottleneck. Pre-allocate sale inventory to Redis. Atomic decrement. Database cant handle 10K writes/second.'
      },
      requirements: {
        functional: [
          'Schedule flash sales with start time',
          'Queue buyers during high traffic',
          'Enforce purchase limits per user',
          'Show queue position and estimated wait'
        ],
        nonFunctional: [
          'Handle 100K concurrent users',
          'Sale items sell out fairly'
        ]
      },
      hints: [
        'Virtual queue: join queue, poll position, granted when turn',
        'Redis DECR for inventory: atomic, fast',
        'Purchase limit: track per user_id per sale'
      ],
      expectedComponents: ['Sale Scheduler', 'Virtual Queue', 'Rate Limiter'],
      successCriteria: ['Traffic handled without crash', 'Fair access to sale items'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-9',
      title: 'Order Fulfillment',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Manage warehouse picking and shipping',
      thinkingFramework: {
        framework: 'Fulfillment Pipeline',
        approach: 'Order → pick list → warehouse picks items → pack → ship → track. Optimize: batch picks for efficiency, route to nearest warehouse.',
        keyInsight: 'Multi-warehouse fulfillment: split order if items in different warehouses, or wait and ship together. User chooses: faster vs cheaper.'
      },
      requirements: {
        functional: [
          'Generate pick lists for warehouse',
          'Track fulfillment status per item',
          'Integrate with shipping carriers',
          'Provide tracking information'
        ],
        nonFunctional: [
          'Order to ship: < 24 hours for in-stock'
        ]
      },
      hints: [
        'Pick list: {order_id, sku, quantity, location_in_warehouse}',
        'Carrier API: create shipment, get tracking number',
        'Split shipment: different tracking per package'
      ],
      expectedComponents: ['Fulfillment Service', 'Pick List Generator', 'Carrier Integration'],
      successCriteria: ['Orders fulfilled efficiently', 'Tracking works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Smart Commerce (Steps 10-12)
    {
      id: 'step-10',
      title: 'Product Recommendations',
      phase: 4,
      phaseTitle: 'Smart Commerce',
      learningObjective: 'Personalize product suggestions',
      thinkingFramework: {
        framework: 'Recommendation Strategies',
        approach: 'Collaborative filtering (users who bought X also bought Y), content-based (similar products), hybrid. Context: cart, browsing history, purchase history.',
        keyInsight: 'Recommendations at multiple touchpoints: product page (similar), cart (frequently bought together), homepage (personalized for you).'
      },
      requirements: {
        functional: [
          'Show similar products on product page',
          'Suggest frequently bought together in cart',
          'Personalize homepage based on history',
          'Handle cold start for new users'
        ],
        nonFunctional: [
          'Recommendations add < 100ms to page load'
        ]
      },
      hints: [
        'Collaborative: item-item similarity matrix',
        'Frequently bought together: co-purchase analysis',
        'Cold start: popular items, category bestsellers'
      ],
      expectedComponents: ['Recommendation Engine', 'Similarity Index', 'User Profile'],
      successCriteria: ['Recommendations relevant', 'Conversion improves'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Reviews & Ratings',
      phase: 4,
      phaseTitle: 'Smart Commerce',
      learningObjective: 'Build social proof with user reviews',
      thinkingFramework: {
        framework: 'User-Generated Content',
        approach: 'Reviews build trust. Verified purchase badge. Helpful votes surface best reviews. Handle fake reviews with detection.',
        keyInsight: 'Average rating is misleading with few reviews. "4.5 stars from 3 reviews" vs "4.3 stars from 10,000 reviews". Show distribution.'
      },
      requirements: {
        functional: [
          'Submit review with rating and text',
          'Mark verified purchases',
          'Vote reviews as helpful',
          'Calculate and display average rating'
        ],
        nonFunctional: [
          'Review submission < 2 seconds'
        ]
      },
      hints: [
        'Review: {product_id, user_id, rating, text, verified_purchase, helpful_votes}',
        'Average: weighted by recency and helpfulness',
        'Fake detection: NLP patterns, purchase history'
      ],
      expectedComponents: ['Review Service', 'Rating Calculator', 'Moderation Queue'],
      successCriteria: ['Reviews submitted and displayed', 'Helpful sorting works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-12',
      title: 'Marketplace & Multi-Seller',
      phase: 4,
      phaseTitle: 'Smart Commerce',
      learningObjective: 'Enable third-party sellers',
      thinkingFramework: {
        framework: 'Marketplace Model',
        approach: 'Platform + sellers. Sellers list products, set prices, manage inventory. Platform handles discovery, checkout, payments. Split revenue.',
        keyInsight: 'Buy box: multiple sellers for same product. Winner shown by default. Factors: price, shipping speed, seller rating. Drives competition.'
      },
      requirements: {
        functional: [
          'Onboard sellers with verification',
          'Allow seller product listings',
          'Handle multi-seller same product (buy box)',
          'Split payments between platform and seller'
        ],
        nonFunctional: [
          'Seller payout within 7 days of delivery'
        ]
      },
      hints: [
        'Seller: {id, name, rating, commission_rate}',
        'Listing: {product_id, seller_id, price, shipping, inventory}',
        'Buy box: lowest price + fastest shipping + highest rating'
      ],
      expectedComponents: ['Seller Portal', 'Listing Service', 'Buy Box Algorithm', 'Payout Service'],
      successCriteria: ['Sellers can list products', 'Buy box selects best offer'],
      estimatedTime: '8 minutes'
    }
  ]
};
