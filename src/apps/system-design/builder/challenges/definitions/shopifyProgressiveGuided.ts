import { GuidedTutorial } from '../../types/guidedTutorial';

export const shopifyProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'shopify-progressive',
  title: 'Design Shopify',
  description: 'Build an e-commerce platform from simple storefronts to multi-tenant commerce infrastructure',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design multi-tenant storefront architecture',
    'Implement inventory and order management',
    'Build payment processing integration',
    'Handle app ecosystem and extensibility',
    'Scale to millions of merchants'
  ],
  prerequisites: ['Multi-tenancy', 'E-commerce', 'Payment systems'],
  tags: ['e-commerce', 'multi-tenant', 'platform', 'payments', 'saas'],

  progressiveStory: {
    title: 'Shopify Evolution',
    premise: "You're building an e-commerce platform that lets anyone create an online store. Starting with basic storefronts, you'll evolve to support inventory, payments, apps, and millions of merchants.",
    phases: [
      { phase: 1, title: 'Storefronts', description: 'Create online stores' },
      { phase: 2, title: 'Commerce', description: 'Products and orders' },
      { phase: 3, title: 'Growth', description: 'Marketing and analytics' },
      { phase: 4, title: 'Platform', description: 'Apps and scale' }
    ]
  },

  steps: [
    // PHASE 1: Storefronts (Steps 1-3)
    {
      id: 'step-1',
      title: 'Multi-Tenant Architecture',
      phase: 1,
      phaseTitle: 'Storefronts',
      learningObjective: 'Isolate merchant data securely',
      thinkingFramework: {
        framework: 'Tenant Isolation',
        approach: 'Each merchant is a tenant. Data isolation via shop_id on all tables. Subdomain routing (myshop.shopify.com). Custom domains supported.',
        keyInsight: 'Multi-tenancy is core to economics. Same infrastructure, many merchants. Isolation is critical - one merchant cant see anothers data.'
      },
      requirements: {
        functional: [
          'Create merchant accounts (shops)',
          'Subdomain for each shop',
          'Custom domain support',
          'Data isolation per shop'
        ],
        nonFunctional: [
          'Tenant resolution < 10ms',
          'Complete data isolation'
        ]
      },
      hints: [
        'Shop: {id, name, subdomain, custom_domain, owner_id}',
        'Routing: subdomain → shop_id lookup, set context',
        'All tables: shop_id column, always filter by shop'
      ],
      expectedComponents: ['Shop Manager', 'Domain Router', 'Tenant Context'],
      successCriteria: ['Shops created', 'Data isolated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Theme System',
      phase: 1,
      phaseTitle: 'Storefronts',
      learningObjective: 'Enable customizable store designs',
      thinkingFramework: {
        framework: 'Templated Storefronts',
        approach: 'Themes = reusable templates. Liquid templating language. Sections for drag-drop customization. Theme settings for colors/fonts.',
        keyInsight: 'Themes let non-developers create beautiful stores. Liquid is safe (no arbitrary code execution). Sections enable visual editing.'
      },
      requirements: {
        functional: [
          'Theme marketplace',
          'Install and customize themes',
          'Section-based page builder',
          'Theme settings (colors, fonts, etc)'
        ],
        nonFunctional: [
          'Page render < 500ms',
          'Theme switch instant'
        ]
      },
      hints: [
        'Theme: {id, name, templates: {}, sections: {}, settings_schema}',
        'Liquid: template language with shop/product/cart objects',
        'Sections: reusable blocks, drag to reorder'
      ],
      expectedComponents: ['Theme Store', 'Liquid Renderer', 'Section Editor'],
      successCriteria: ['Themes render correctly', 'Customization works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-3',
      title: 'Storefront Rendering',
      phase: 1,
      phaseTitle: 'Storefronts',
      learningObjective: 'Serve fast, SEO-friendly pages',
      thinkingFramework: {
        framework: 'Server-Side Rendering',
        approach: 'Render pages server-side for SEO. Cache rendered HTML. CDN for static assets. Invalidate on content changes.',
        keyInsight: 'E-commerce needs SEO. Server-render product pages for Google. Cache aggressively - products dont change often. Invalidate on edit.'
      },
      requirements: {
        functional: [
          'Server-side page rendering',
          'SEO meta tags and structured data',
          'Page caching',
          'CDN for assets'
        ],
        nonFunctional: [
          'Time to first byte < 200ms',
          'Lighthouse SEO score > 90'
        ]
      },
      hints: [
        'Cache key: shop_id + template + content_hash',
        'Invalidation: on product/page edit, purge related pages',
        'Structured data: Product schema for Google rich results'
      ],
      expectedComponents: ['Page Renderer', 'Cache Layer', 'CDN Integration'],
      successCriteria: ['Pages fast', 'SEO optimized'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Commerce (Steps 4-6)
    {
      id: 'step-4',
      title: 'Product Catalog',
      phase: 2,
      phaseTitle: 'Commerce',
      learningObjective: 'Manage products with variants',
      thinkingFramework: {
        framework: 'Product Model',
        approach: 'Products have variants (size, color). Variants have inventory. Collections group products. Product media (images, videos).',
        keyInsight: 'Variants are the sellable unit, not products. T-shirt is product, "Red Large" is variant with its own SKU, price, inventory.'
      },
      requirements: {
        functional: [
          'Create products with variants',
          'Product images and media',
          'Collections (manual and automated)',
          'Product search and filters'
        ],
        nonFunctional: [
          'Support 100K products per shop',
          'Search < 300ms'
        ]
      },
      hints: [
        'Product: {id, shop_id, title, description, variants: [], images: []}',
        'Variant: {id, product_id, sku, price, inventory_quantity, options: {}}',
        'Collection: {products} or {rules: [{field, condition, value}]}'
      ],
      expectedComponents: ['Product Store', 'Variant Manager', 'Collection Engine'],
      successCriteria: ['Products created', 'Variants work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Cart and Checkout',
      phase: 2,
      phaseTitle: 'Commerce',
      learningObjective: 'Enable purchasing flow',
      thinkingFramework: {
        framework: 'Shopping Flow',
        approach: 'Cart holds items before purchase. Checkout collects info and payment. Cart persists across sessions. Checkout has timeout.',
        keyInsight: 'Cart is different from checkout. Cart = browsing intent, long-lived. Checkout = purchasing intent, time-limited. Reserve inventory at checkout.'
      },
      requirements: {
        functional: [
          'Add/remove items from cart',
          'Checkout flow (shipping, payment)',
          'Inventory reservation',
          'Discount codes'
        ],
        nonFunctional: [
          'Cart recovery (abandoned cart)',
          'Checkout timeout: 10 minutes'
        ]
      },
      hints: [
        'Cart: {shop_id, line_items: [{variant_id, quantity}], discount_codes}',
        'Checkout: {cart_id, shipping_address, payment_method, expires_at}',
        'Reservation: hold inventory during checkout, release on abandon'
      ],
      expectedComponents: ['Cart Service', 'Checkout Flow', 'Inventory Lock'],
      successCriteria: ['Cart works', 'Checkout completes'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Order Management',
      phase: 2,
      phaseTitle: 'Commerce',
      learningObjective: 'Track orders from purchase to delivery',
      thinkingFramework: {
        framework: 'Order Lifecycle',
        approach: 'Order created on payment. Fulfillment = shipped items. Partial fulfillment supported. Refunds and returns.',
        keyInsight: 'Order is immutable record of purchase. Fulfillment is mutable (can ship partially). Separate concerns for accounting accuracy.'
      },
      requirements: {
        functional: [
          'Create order on payment',
          'Order status tracking',
          'Fulfillment (single and partial)',
          'Refunds and cancellations'
        ],
        nonFunctional: [
          'Order creation < 2 seconds',
          'Order history forever'
        ]
      },
      hints: [
        'Order: {id, shop_id, line_items, total, status, fulfillments: []}',
        'Fulfillment: {order_id, line_items, tracking_number, status}',
        'Status: pending → paid → fulfilled → delivered | refunded | cancelled'
      ],
      expectedComponents: ['Order Store', 'Fulfillment Manager', 'Refund Handler'],
      successCriteria: ['Orders track correctly', 'Fulfillment works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Growth (Steps 7-9)
    {
      id: 'step-7',
      title: 'Payment Processing',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Process payments securely',
      thinkingFramework: {
        framework: 'Payment Gateway',
        approach: 'Integrate multiple payment providers. Shopify Payments (Stripe-powered) as default. Third-party gateways via API. PCI compliance via tokenization.',
        keyInsight: 'Shopify is payment facilitator. Aggregates merchants under one Stripe account (Shopify Payments). Third-party gateways connect directly.'
      },
      requirements: {
        functional: [
          'Process card payments',
          'Multiple payment gateways',
          'Capture and refund',
          'PayPal, Apple Pay, etc.'
        ],
        nonFunctional: [
          'PCI compliant',
          'Payment latency < 3 seconds'
        ]
      },
      hints: [
        'Tokenization: card data never touches Shopify servers',
        'Shopify Payments: Stripe under the hood, better rates',
        'Gateway: {shop_id, provider, credentials_encrypted}'
      ],
      expectedComponents: ['Payment Gateway', 'Tokenization', 'Multi-Provider'],
      successCriteria: ['Payments process', 'Multiple methods work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Analytics Dashboard',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Provide merchant insights',
      thinkingFramework: {
        framework: 'E-commerce Metrics',
        approach: 'Track: sales, orders, visitors, conversion rate. Time-series data. Comparison periods. Product performance.',
        keyInsight: 'Merchants need to understand their business. Key metrics: revenue, AOV (average order value), conversion rate, top products.'
      },
      requirements: {
        functional: [
          'Sales and revenue reports',
          'Traffic and conversion metrics',
          'Product performance',
          'Compare time periods'
        ],
        nonFunctional: [
          'Dashboard load < 2 seconds',
          'Data delay < 1 hour'
        ]
      },
      hints: [
        'Metrics: orders, revenue, sessions, conversion = orders/sessions',
        'Pre-aggregate: hourly/daily rollups for fast queries',
        'Comparison: this_period vs previous_period'
      ],
      expectedComponents: ['Analytics Tracker', 'Aggregation Pipeline', 'Dashboard API'],
      successCriteria: ['Metrics accurate', 'Dashboard fast'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Marketing Tools',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Help merchants grow sales',
      thinkingFramework: {
        framework: 'Growth Features',
        approach: 'Discount codes and automatic discounts. Abandoned cart emails. SEO tools. Social media integration.',
        keyInsight: 'Shopify success = merchant success. Provide tools for growth. Abandoned cart recovery is high-ROI. SEO drives free traffic.'
      },
      requirements: {
        functional: [
          'Discount codes (% off, $ off, BOGO)',
          'Abandoned cart emails',
          'SEO recommendations',
          'Facebook/Google channel integration'
        ],
        nonFunctional: [
          'Email send within 1 hour of abandonment',
          'Discount validation < 100ms'
        ]
      },
      hints: [
        'Discount: {code, type, value, conditions, usage_limit}',
        'Abandoned cart: detect carts with email, no order after X hours',
        'Channels: sync products to Facebook catalog, Google Merchant'
      ],
      expectedComponents: ['Discount Engine', 'Email Automation', 'Channel Sync'],
      successCriteria: ['Discounts apply correctly', 'Automation works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'App Platform',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Enable third-party app ecosystem',
      thinkingFramework: {
        framework: 'Extensibility',
        approach: 'Apps extend functionality via API. OAuth for authentication. Webhooks for events. App store for discovery.',
        keyInsight: 'Apps are force multiplier. Shopify cant build everything. Apps fill gaps. Revenue share aligns incentives.'
      },
      requirements: {
        functional: [
          'OAuth app authentication',
          'REST and GraphQL APIs',
          'Webhook subscriptions',
          'App store and billing'
        ],
        nonFunctional: [
          'API rate limits',
          'Webhook delivery < 30 seconds'
        ]
      },
      hints: [
        'OAuth: app requests scopes, merchant approves, token issued',
        'API: REST for simple ops, GraphQL for complex queries',
        'Webhook: app subscribes to events (order/created, product/updated)'
      ],
      expectedComponents: ['OAuth Server', 'API Gateway', 'Webhook System'],
      successCriteria: ['Apps integrate', 'Webhooks deliver'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Checkout Extensibility',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Allow safe checkout customization',
      thinkingFramework: {
        framework: 'Checkout Extensions',
        approach: 'Checkout is sensitive (conversion). Limited extension points. Sandboxed execution. UI extensions for custom fields, upsells.',
        keyInsight: 'Checkout customization is risky. Bad code = lost sales. Sandbox extensions. Validate aggressively. Provide safe extension points.'
      },
      requirements: {
        functional: [
          'Checkout UI extensions',
          'Custom fields',
          'Payment method extensions',
          'Post-purchase upsells'
        ],
        nonFunctional: [
          'Extension execution < 100ms',
          'Sandboxed execution'
        ]
      },
      hints: [
        'Extension: React components in sandbox iframe',
        'Points: before_shipping, after_payment_method, post_purchase',
        'Validation: timeout, error isolation, performance budgets'
      ],
      expectedComponents: ['Extension Host', 'Sandbox', 'Extension Points'],
      successCriteria: ['Extensions run safely', 'Checkout unimpacted'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale to Millions',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle traffic spikes across all merchants',
      thinkingFramework: {
        framework: 'Platform Scale',
        approach: 'Flash sales = 100x traffic for one shop. Shared infrastructure means noisy neighbor risk. Rate limiting, isolation, graceful degradation.',
        keyInsight: 'One merchants flash sale shouldnt impact others. Resource isolation at multiple levels. Queue spiky operations. Scale horizontally.'
      },
      requirements: {
        functional: [
          'Handle flash sale traffic',
          'Noisy neighbor isolation',
          'Rate limiting per shop',
          'Graceful degradation'
        ],
        nonFunctional: [
          'Handle 10M+ shops',
          '99.99% availability'
        ]
      },
      hints: [
        'Isolation: per-shop resource limits, priority queues',
        'Flash sale: pre-warming, dedicated capacity, queue orders',
        'Degradation: serve cached pages, queue non-critical operations'
      ],
      expectedComponents: ['Resource Manager', 'Rate Limiter', 'Priority Queue'],
      successCriteria: ['Flash sales handled', 'No cross-shop impact'],
      estimatedTime: '8 minutes'
    }
  ]
};
