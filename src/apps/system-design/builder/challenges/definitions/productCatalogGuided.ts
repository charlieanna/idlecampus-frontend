import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Product Catalog Storage Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches catalog storage design concepts
 * while building an e-commerce product catalog system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working catalog (FR satisfaction)
 * Steps 4-6: Scale with NFRs (indexing, variants, attributes)
 *
 * Key Concepts:
 * - Catalog data model design
 * - Product variant management
 * - Attribute indexing and search
 * - Schema evolution
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const productCatalogRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a product catalog storage system for an e-commerce platform",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Engineering Manager at E-Commerce Platform',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-catalog',
      category: 'functional',
      question: "What are the core operations for the product catalog?",
      answer: "The catalog needs to support:\n\n1. **Store products** - Add new products with details (name, description, price, images)\n2. **Search products** - Find products by name, category, attributes\n3. **Browse catalog** - List products by category, filters\n4. **Update products** - Modify pricing, inventory, details",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "E-commerce catalogs are about discovery, organization, and updates",
    },
    {
      id: 'product-variants',
      category: 'functional',
      question: "How do we handle product variants? Like a t-shirt in different sizes and colors?",
      answer: "Great question! We need to support variants:\n- **Parent product**: iPhone 15\n- **Variants**: iPhone 15 128GB Blue, iPhone 15 256GB Black, etc.\n\nEach variant has:\n- Its own SKU and price\n- Its own inventory count\n- Shared attributes (brand, model) from parent\n- Unique attributes (color, size, storage)",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Variants are critical for fashion, electronics - most e-commerce products have them",
    },
    {
      id: 'product-attributes',
      category: 'functional',
      question: "What product attributes do we need to store?",
      answer: "Products have both:\n\n**Fixed attributes** (all products):\n- SKU, name, brand, price, category, description\n\n**Dynamic attributes** (category-specific):\n- Electronics: screen_size, battery_life, processor\n- Clothing: material, fit, care_instructions\n- Books: author, publisher, ISBN\n\nWe need flexible schema to handle different attribute sets per category.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Different product types need different attributes - schema flexibility is key",
    },
    {
      id: 'attribute-search',
      category: 'functional',
      question: "Can users filter by these attributes? Like 'show me laptops with 16GB RAM under $1000'?",
      answer: "Yes! Attribute-based filtering is critical:\n- Filter by price range\n- Filter by brand, color, size\n- Filter by category-specific attributes (RAM, storage, etc.)\n\nWe need efficient indexing on these attributes for fast search.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Attribute indexing is essential for catalog search performance",
    },
    {
      id: 'product-relationships',
      category: 'clarification',
      question: "Do products have relationships? Like 'frequently bought together' or 'similar products'?",
      answer: "For MVP, let's defer relationships to v2. We'll focus on the core catalog structure - storing products, variants, and attributes efficiently.",
      importance: 'nice-to-have',
      insight: "Product relationships are ML/recommendation features - separate from core catalog storage",
    },

    // SCALE & NFRs
    {
      id: 'throughput-catalog-size',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "Start with 10 million products, with growth to 100 million",
      importance: 'critical',
      learningPoint: "Large catalogs require efficient storage and indexing strategies",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many catalog queries per day?",
      answer: "About 500 million queries per day (mostly reads - browsing, searching)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 queries/sec average",
        result: "~6K reads/sec (20K at peak during sales)",
      },
      learningPoint: "Catalog is heavily read-dominated - 100:1 read-to-write ratio",
    },
    {
      id: 'throughput-updates',
      category: 'throughput',
      question: "How often are products updated?",
      answer: "About 1 million product updates per day (price changes, inventory updates, new products)",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.5 updates/sec",
        result: "~12 writes/sec (50 at peak)",
      },
      learningPoint: "Updates are infrequent but must be consistent",
    },
    {
      id: 'payload-product-size',
      category: 'payload',
      question: "What's the typical product data size?",
      answer: "Base product: ~2KB\nWith variants (avg 5): ~10KB\nWith images (URLs): +2KB\nTotal: ~12KB per product on average",
      importance: 'important',
      calculation: {
        formula: "10M products × 12KB = 120GB",
        result: "~120GB for 10M products (without images)",
      },
      learningPoint: "Catalog data is relatively compact - images stored separately",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should catalog search respond?",
      answer: "p99 under 200ms for attribute-based searches. Users expect instant results when filtering.",
      importance: 'critical',
      learningPoint: "Fast search is critical for discovery - slow search = lost conversions",
    },
    {
      id: 'consistency-catalog',
      category: 'consistency',
      question: "How important is consistency for catalog data?",
      answer: "**Eventually consistent is acceptable** for most catalog data:\n- Product descriptions can be slightly stale\n- Price updates can take a few seconds to propagate\n\n**Strong consistency needed for**:\n- Inventory counts (prevent overselling)\n- Product availability status",
      importance: 'critical',
      learningPoint: "Different data types need different consistency guarantees",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-catalog', 'product-variants', 'product-attributes'],
  criticalFRQuestionIds: ['core-catalog', 'product-variants', 'product-attributes'],
  criticalScaleQuestionIds: ['throughput-catalog-size', 'throughput-queries', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Store and retrieve products',
      description: 'Products stored with name, description, price, category, images',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Search by attributes',
      description: 'Users can filter products by category, price, brand, and dynamic attributes',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Update products',
      description: 'Modify product details, pricing, inventory',
      emoji: '✏️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Support product variants',
      description: 'Handle size, color, storage variants with separate SKUs and pricing',
      emoji: '👕',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Category-specific attributes',
      description: 'Flexible schema for different product types (electronics vs clothing)',
      emoji: '🏷️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million shoppers',
    writesPerDay: '1 million product updates',
    readsPerDay: '500 million catalog queries',
    peakMultiplier: 3,
    readWriteRatio: '500:1',
    calculatedWriteRPS: { average: 12, peak: 50 },
    calculatedReadRPS: { average: 5787, peak: 20000 },
    maxPayloadSize: '~12KB (product with variants)',
    storagePerRecord: '~12KB average',
    storageGrowthPerYear: '~5TB (10M products growth)',
    redirectLatencySLA: 'p99 < 200ms (search)',
    createLatencySLA: 'p99 < 500ms (updates)',
  },

  architecturalImplications: [
    '✅ Read-heavy (500:1) → Aggressive caching for catalog data',
    '✅ 20K reads/sec at peak → Distributed cache, read replicas',
    '✅ Flexible schema → Document DB or JSONB columns for attributes',
    '✅ Attribute search → Search index (Elasticsearch) for fast filtering',
    '✅ 10M+ products → Database partitioning by category or product_id',
  ],

  outOfScope: [
    'Product recommendations',
    'Review and rating storage',
    'Image storage (use CDN/S3)',
    'Real-time inventory sync',
    'Multi-currency pricing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple catalog storage system that can store products, handle variants, and support basic search. The advanced indexing and partitioning will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛍️',
  scenario: "Welcome to E-Commerce Catalog Systems! You've been hired to build the product catalog.",
  hook: "Your first customer wants to browse products. They've opened the catalog page!",
  challenge: "Set up the basic request flow so customers can reach your catalog server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your catalog is online!',
  achievement: 'Customers can now send requests to your Catalog Service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to store or retrieve products...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Catalog Service Architecture',
  conceptExplanation: `Every catalog system starts with a **Client** connecting to a **Catalog Service**.

When a customer browses products:
1. Their browser (phone, laptop) is the **Client**
2. It sends HTTP requests to your **Catalog Service**
3. The service processes the request and returns product data

This is the foundation of catalog systems!`,

  whyItMatters: 'Without this connection, customers can\'t browse or search your catalog at all.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving catalog queries for 300M+ products',
    howTheyDoIt: 'Microservices architecture with dedicated catalog services, handling 20K+ queries/sec during Prime Day',
  },

  keyPoints: [
    'Client = the customer\'s device (browser, mobile app)',
    'Catalog Service = backend that manages product data',
    'HTTP = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The customer\'s device that makes requests', icon: '📱' },
    { title: 'Catalog Service', explanation: 'Backend that handles product queries', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'catalog-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for catalog operations',
    taskDescription: 'Add a Client and App Server (Catalog Service), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers browsing catalog', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles catalog queries and updates', displayName: 'Catalog Service' },
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
// STEP 2: Add Database for Product Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "Your catalog service is running, but it has nowhere to store products!",
  hook: "A merchant tried to add their first product, but where does the data go?",
  challenge: "Add a database to store product catalog data - the foundation of your system.",
  illustration: 'data-storage',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your catalog can now store products!',
  achievement: 'Product data is persisted in the database',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Products stored', after: '✓' },
  ],
  nextTeaser: "But how do we handle products with variants like different sizes and colors?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Catalog Data Model: Core Product Schema',
  conceptExplanation: `A product catalog needs a well-designed **data model** to store product information.

**Basic Product Schema**:
\`\`\`sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY,
  name VARCHAR(500),
  brand VARCHAR(200),
  category VARCHAR(200),
  base_price DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
\`\`\`

**Key design decisions**:
1. **UUID for product_id** - Globally unique, distributed-friendly
2. **Fixed columns** for common attributes (name, brand, price)
3. **category** for organization and filtering
4. **Timestamps** for auditing and cache invalidation`,

  whyItMatters: 'The data model is the foundation - a poor schema makes everything harder. Get it right from the start!',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Storing products for millions of merchants',
    howTheyDoIt: 'Uses PostgreSQL with JSONB columns for flexible attributes, optimized indexes on category and brand',
  },

  keyPoints: [
    'Start with core attributes that all products share',
    'Use appropriate data types (DECIMAL for money, TEXT for descriptions)',
    'Add timestamps for auditing and change tracking',
    'Plan for flexibility - product schemas evolve over time',
  ],

  keyConcepts: [
    { title: 'Schema', explanation: 'Structure defining how data is organized', icon: '🗂️' },
    { title: 'Primary Key', explanation: 'Unique identifier for each product', icon: '🔑' },
    { title: 'Data Types', explanation: 'VARCHAR, DECIMAL, TEXT - choose wisely', icon: '📊' },
  ],

  quickCheck: {
    question: 'Why use DECIMAL instead of FLOAT for product prices?',
    options: [
      'DECIMAL is faster',
      'DECIMAL prevents rounding errors with money',
      'DECIMAL uses less storage',
      'FLOAT is deprecated',
    ],
    correctIndex: 1,
    explanation: 'DECIMAL is precise for monetary values. FLOAT can have rounding errors ($0.01 might become $0.0099999), which is unacceptable for pricing.',
  },
};

const step2: GuidedStep = {
  id: 'catalog-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store and retrieve products',
    taskDescription: 'Add a Database and connect the Catalog Service to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store product catalog data', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
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
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement Product Variants Schema
// =============================================================================

const step3Story: StoryContent = {
  emoji: '👕',
  scenario: "A fashion merchant wants to add t-shirts with 5 colors and 4 sizes - that's 20 variants!",
  hook: "Right now, we'd have to create 20 separate products. That's messy and doesn't show they're related.",
  challenge: "Design a schema that handles product variants - same base product, different SKU, price, and attributes.",
  illustration: 'variant-explosion',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎨',
  message: 'Your catalog now supports variants!',
  achievement: 'Products can have multiple size/color/storage options',
  metrics: [
    { label: 'Variant support', after: 'Enabled' },
    { label: 'Schema design', after: 'Parent-Child model' },
  ],
  nextTeaser: "But how do we store category-specific attributes like 'screen size' for laptops?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Product Variant Management: Parent-Child Schema',
  conceptExplanation: `Product variants require a **parent-child relationship**:

**Approach 1: Single Table (Variants as Columns)**
\`\`\`sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY,
  name VARCHAR(500),
  color VARCHAR(50),
  size VARCHAR(50),
  sku VARCHAR(100) UNIQUE
);
\`\`\`
❌ Problem: Can't easily group "all colors of this shirt"

**Approach 2: Parent-Child Tables** ✅ BEST
\`\`\`sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY,
  name VARCHAR(500),
  brand VARCHAR(200),
  base_price DECIMAL(10, 2)
);

CREATE TABLE product_variants (
  variant_id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(product_id),
  sku VARCHAR(100) UNIQUE,
  color VARCHAR(50),
  size VARCHAR(50),
  price DECIMAL(10, 2),
  inventory_count INT,
  UNIQUE(product_id, color, size)
);
\`\`\`

**Benefits**:
- Group related variants under one product
- Each variant has its own SKU, price, inventory
- Efficient queries: "show all colors" or "find specific variant"`,

  whyItMatters: 'Most e-commerce products have variants. Without proper modeling, your catalog becomes a mess with duplicate data and hard-to-maintain relationships.',

  realWorldExample: {
    company: 'Zalando',
    scenario: 'Fashion retailer with millions of clothing items',
    howTheyDoIt: 'Parent-child product model with variants table. One product can have 100+ size/color combinations. Each variant tracked separately for inventory.',
  },

  famousIncident: {
    title: 'Target Inventory Mishap',
    company: 'Target',
    year: '2015',
    whatHappened: 'Target\'s catalog system didn\'t properly link variants. When "Red T-Shirt Size M" sold out, the system showed "T-Shirt" as out of stock, even though other sizes/colors were available. Lost millions in sales.',
    lessonLearned: 'Variant management is critical. Poor schema = poor UX = lost revenue.',
    icon: '🎯',
  },

  keyPoints: [
    'Parent table = base product (shared attributes)',
    'Variants table = specific SKUs (color, size, price, inventory)',
    'Foreign key links variants to parent',
    'UNIQUE constraint prevents duplicate variants',
  ],

  diagram: `
┌─────────────────────────────────────────┐
│         PARENT-CHILD MODEL              │
├─────────────────────────────────────────┤
│                                         │
│  products                               │
│  ┌─────────────────────────────┐       │
│  │ product_id: 123             │       │
│  │ name: "Classic T-Shirt"     │       │
│  │ brand: "Acme Apparel"       │       │
│  │ base_price: $20.00          │       │
│  └─────────────┬───────────────┘       │
│                │                        │
│                │ has variants           │
│                ▼                        │
│  product_variants                      │
│  ┌─────────────────────────────┐       │
│  │ variant_id: v1              │       │
│  │ product_id: 123 (FK)        │       │
│  │ sku: "ACME-TS-R-S"          │       │
│  │ color: "Red"                │       │
│  │ size: "Small"               │       │
│  │ price: $20.00               │       │
│  │ inventory_count: 50         │       │
│  └─────────────────────────────┘       │
│  ┌─────────────────────────────┐       │
│  │ variant_id: v2              │       │
│  │ product_id: 123 (FK)        │       │
│  │ sku: "ACME-TS-B-M"          │       │
│  │ color: "Blue"               │       │
│  │ size: "Medium"              │       │
│  │ price: $22.00               │       │
│  │ inventory_count: 30         │       │
│  └─────────────────────────────┘       │
└─────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Parent Product', explanation: 'Base product with shared attributes', icon: '👔' },
    { title: 'Variant', explanation: 'Specific SKU with color, size, price', icon: '🎨' },
    { title: 'Foreign Key', explanation: 'Links variants to parent product', icon: '🔗' },
  ],

  quickCheck: {
    question: 'Why use a separate variants table instead of storing variants in the products table?',
    options: [
      'Separate tables are always faster',
      'One product can have many variants - parent-child model prevents duplication',
      'PostgreSQL requires it',
      'It uses less storage',
    ],
    correctIndex: 1,
    explanation: 'A product like "T-Shirt" can have 20+ variants. Parent-child model avoids duplicating shared data (name, brand) for each variant.',
  },
};

const step3: GuidedStep = {
  id: 'catalog-step-3',
  stepNumber: 3,
  frIndex: 3,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-4: Support product variants',
    taskDescription: 'Your database schema now supports parent products and variants - no new components needed, just schema design understanding',
    successCriteria: [
      'Understand parent-child product model',
      'Learn how variants are stored separately',
      'Recognize the benefits of this approach',
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
    level1: 'This step is about understanding the schema design - no new components needed',
    level2: 'Your existing database now supports product variants through the parent-child table model',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Flexible Attributes with JSONB
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🏷️',
  scenario: "Electronics merchants need to store 'screen_size', 'battery_life'. Book merchants need 'author', 'ISBN'.",
  hook: "Every product category needs different attributes! We can't add a column for every possible attribute - that's hundreds of columns!",
  challenge: "Add flexible attribute storage so different product types can have different properties.",
  illustration: 'schema-flexibility',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your catalog supports flexible attributes!',
  achievement: 'Category-specific attributes stored efficiently',
  metrics: [
    { label: 'Schema flexibility', after: 'JSONB attributes' },
    { label: 'Attribute types', after: 'Unlimited' },
  ],
  nextTeaser: "But how do we search and filter by these attributes quickly?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Flexible Attributes: JSONB vs EAV vs Columns',
  conceptExplanation: `**The Challenge**: Different product types need different attributes.

**Approach 1: Add Columns for Everything**
\`\`\`sql
ALTER TABLE products ADD COLUMN screen_size VARCHAR(50);
ALTER TABLE products ADD COLUMN author VARCHAR(200);
ALTER TABLE products ADD COLUMN isbn VARCHAR(20);
-- ... 100+ more columns
\`\`\`
❌ Problems:
- Hundreds of mostly-NULL columns
- Schema changes for every new attribute
- Wastes storage

**Approach 2: EAV (Entity-Attribute-Value)**
\`\`\`sql
CREATE TABLE product_attributes (
  product_id UUID,
  attribute_name VARCHAR(100),
  attribute_value TEXT
);
\`\`\`
❌ Problems:
- Complex queries ("show products with RAM >= 16GB")
- Hard to enforce data types
- Performance issues

**Approach 3: JSONB Column** ✅ BEST
\`\`\`sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY,
  name VARCHAR(500),
  category VARCHAR(200),
  attributes JSONB
);

-- Store attributes as JSON
INSERT INTO products VALUES (
  '123',
  'MacBook Pro',
  'Electronics',
  '{"screen_size": "14 inch", "ram": "16GB", "storage": "512GB"}'
);

-- Query by attributes
SELECT * FROM products
WHERE attributes->>'ram' = '16GB'
  AND (attributes->>'storage')::INT >= 512;
\`\`\`

**Benefits**:
- Flexible schema - add new attributes without migrations
- Efficient storage (only store what's needed)
- Can index JSONB for fast queries
- PostgreSQL has excellent JSONB support`,

  whyItMatters: 'E-commerce catalogs evolve constantly. New product types, new attributes. JSONB gives flexibility without sacrificing performance.',

  realWorldExample: {
    company: 'eBay',
    scenario: 'Supporting every possible product category',
    howTheyDoIt: 'Uses document-oriented storage with flexible schemas. Sellers can add custom attributes without eBay engineering changing the schema.',
  },

  famousIncident: {
    title: 'Best Buy Schema Evolution Nightmare',
    company: 'Best Buy',
    year: '2012',
    whatHappened: 'Best Buy used rigid schemas with separate tables per category. Adding new product types required months of engineering work and database migrations. They lost competitive advantage to Amazon.',
    lessonLearned: 'Flexible schemas are essential for catalog systems. JSONB or document DBs enable rapid iteration.',
    icon: '🛒',
  },

  keyPoints: [
    'JSONB stores flexible attributes as JSON documents',
    'Can index JSONB fields for fast queries',
    'No schema changes needed for new attributes',
    'PostgreSQL has excellent JSONB support (queries, indexes)',
    'Balance: fixed columns for common fields, JSONB for category-specific',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         JSONB ATTRIBUTE STORAGE                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  products                                           │
│  ┌───────────────────────────────────────────┐     │
│  │ product_id: "laptop-1"                    │     │
│  │ name: "MacBook Pro"                       │     │
│  │ category: "Electronics"                   │     │
│  │ price: $1999                              │     │
│  │ attributes: {                             │     │
│  │   "screen_size": "14 inch",              │     │
│  │   "ram": "16GB",                         │     │
│  │   "storage": "512GB",                    │     │
│  │   "processor": "M3 Pro",                 │     │
│  │   "battery_life": "18 hours"             │     │
│  │ }                                         │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │ product_id: "tshirt-1"                    │     │
│  │ name: "Classic T-Shirt"                   │     │
│  │ category: "Clothing"                      │     │
│  │ price: $20                                │     │
│  │ attributes: {                             │     │
│  │   "material": "100% Cotton",             │     │
│  │   "fit": "Regular",                      │     │
│  │   "care": "Machine wash cold",           │     │
│  │   "origin": "USA"                        │     │
│  │ }                                         │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  Query by JSONB attributes:                        │
│  SELECT * FROM products                            │
│  WHERE attributes->>'ram' = '16GB';                │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'JSONB', explanation: 'Binary JSON format in PostgreSQL, indexable and queryable', icon: '📄' },
    { title: 'Schema Flexibility', explanation: 'Add attributes without changing table structure', icon: '🔄' },
    { title: 'GIN Index', explanation: 'PostgreSQL index type for JSONB queries', icon: '🔍' },
  ],

  quickCheck: {
    question: 'Why is JSONB better than EAV for product attributes?',
    options: [
      'JSONB uses less storage',
      'JSONB is easier to query and can be indexed efficiently',
      'JSONB is newer technology',
      'PostgreSQL requires JSONB',
    ],
    correctIndex: 1,
    explanation: 'JSONB supports indexing and direct queries (attributes->>\'ram\' = \'16GB\'). EAV requires complex joins for every attribute query.',
  },
};

const step4: GuidedStep = {
  id: 'catalog-step-4',
  stepNumber: 4,
  frIndex: 4,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Category-specific attributes',
    taskDescription: 'Your database schema now supports flexible attributes via JSONB - no new components needed',
    successCriteria: [
      'Understand JSONB for flexible attributes',
      'Learn how to query JSONB columns',
      'Recognize benefits over EAV or rigid schemas',
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
    level1: 'This step is about understanding JSONB schema design - no new components needed',
    level2: 'Your existing PostgreSQL database now uses JSONB columns for flexible attributes',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Search Index for Attribute Filtering
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users want to filter: 'Show laptops with 16GB RAM, 512GB+ storage, under $2000'",
  hook: "Your database is scanning all 10 million products for every search! Queries are taking 5+ seconds. Customers are abandoning the page!",
  challenge: "Add a search index to enable fast attribute-based filtering and text search.",
  illustration: 'slow-search',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog search is lightning fast!',
  achievement: 'Attribute filtering under 100ms',
  metrics: [
    { label: 'Search latency', before: '5000ms', after: '50ms' },
    { label: 'Attribute queries', after: 'Indexed ✓' },
  ],
  nextTeaser: "But catalog queries are still hitting the database hard...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Search Indexing: Elasticsearch for Catalog Queries',
  conceptExplanation: `**The Problem**: Complex catalog searches are slow in SQL:
- Text search: "wireless headphones"
- Attribute filters: RAM >= 16GB AND price < $2000
- Category facets: Show counts per brand
- Relevance ranking: Best matches first

**PostgreSQL Full-Text Search**:
\`\`\`sql
CREATE INDEX idx_product_search ON products
USING GIN (to_tsvector('english', name || ' ' || description));

SELECT * FROM products
WHERE to_tsvector('english', name || ' ' || description)
      @@ to_tsquery('wireless & headphones');
\`\`\`
✅ Works for basic text search
❌ Struggles with complex attribute filters and faceting

**Elasticsearch** ✅ BEST for Catalog Search
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "laptop" } },
        { "range": { "attributes.ram_gb": { "gte": 16 } } },
        { "range": { "price": { "lte": 2000 } } }
      ]
    }
  },
  "aggs": {
    "brands": { "terms": { "field": "brand" } }
  }
}
\`\`\`

**Architecture**:
- PostgreSQL = source of truth (write here)
- Elasticsearch = search index (read here)
- Sync via change data capture or app writes to both`,

  whyItMatters: 'Complex catalog searches with attribute filters need specialized search indexes. Elasticsearch is built for this use case.',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Searching across millions of handmade items',
    howTheyDoIt: 'PostgreSQL for product storage, Elasticsearch for search. Index is updated in near real-time via Kafka streams. Supports text search, filters, faceting, and relevance tuning.',
  },

  famousIncident: {
    title: 'Walmart Search Overhaul',
    company: 'Walmart',
    year: '2018',
    whatHappened: 'Walmart\'s legacy catalog search was slow and inaccurate. They rebuilt with Elasticsearch. Search speed improved 10x, conversion rate increased 15%.',
    lessonLearned: 'Fast, accurate search directly impacts revenue. Invest in proper search infrastructure.',
    icon: '🛍️',
  },

  keyPoints: [
    'Elasticsearch specialized for text search and attribute filtering',
    'PostgreSQL = source of truth, Elasticsearch = search index',
    'Sync data via dual-write or change data capture',
    'Supports faceting (show counts per category/brand)',
    'Relevance tuning for better search results',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         SEARCH INDEX ARCHITECTURE                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  WRITE PATH:                                        │
│  ┌──────────────┐                                  │
│  │ Catalog Svc  │                                  │
│  └──────┬───────┘                                  │
│         │                                          │
│         ▼                                          │
│  ┌──────────────┐     Sync     ┌───────────────┐  │
│  │ PostgreSQL   │────────────→ │ Elasticsearch │  │
│  │ (Source of   │              │ (Search Index)│  │
│  │  Truth)      │              └───────────────┘  │
│  └──────────────┘                                  │
│                                                     │
│  READ PATH:                                         │
│  ┌──────────────┐                                  │
│  │   Client     │                                  │
│  └──────┬───────┘                                  │
│         │ Search: "laptops 16GB"                   │
│         ▼                                          │
│  ┌──────────────┐                                  │
│  │ Catalog Svc  │                                  │
│  └──────┬───────┘                                  │
│         │ Query                                    │
│         ▼                                          │
│  ┌───────────────┐                                 │
│  │ Elasticsearch │ ← Fast attribute filtering      │
│  │ Returns IDs   │                                 │
│  └──────┬────────┘                                 │
│         │                                          │
│         ▼ Get full data                            │
│  ┌──────────────┐                                  │
│  │ PostgreSQL   │                                  │
│  └──────────────┘                                  │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized data structure for fast queries', icon: '🔍' },
    { title: 'Faceting', explanation: 'Show counts per attribute (e.g., 50 laptops, 20 tablets)', icon: '📊' },
    { title: 'Relevance', explanation: 'Rank results by match quality', icon: '⭐' },
    { title: 'Dual Write', explanation: 'Write to both DB and search index', icon: '✍️' },
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of just PostgreSQL for catalog search?',
    options: [
      'Elasticsearch is cheaper',
      'PostgreSQL can\'t store product data',
      'Elasticsearch is optimized for text search, filters, and faceting',
      'It\'s newer technology',
    ],
    correctIndex: 2,
    explanation: 'Elasticsearch is built for search use cases: full-text search, complex filters, faceting, relevance ranking. PostgreSQL is great for transactional data but not optimized for these search patterns.',
  },
};

const step5: GuidedStep = {
  id: 'catalog-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Search by attributes',
    taskDescription: 'Add a Search Index (Elasticsearch) for fast attribute-based filtering',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast catalog search and filtering', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added',
      'App Server connected to Search Index for queries',
      'App Server connected to Database for source data',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Drag a Search Index (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to both Database (writes) and Search Index (reads)',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 6: Add Cache for Catalog Data
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your homepage shows 'Featured Products' - the same 20 products shown to millions of users!",
  hook: "Every page load queries the database for the same products. At 6K queries/sec, your database is struggling!",
  challenge: "Add a cache to serve frequently accessed catalog data without hitting the database.",
  illustration: 'slow-loading',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog queries are now blazing fast!',
  achievement: 'Popular products served from cache',
  metrics: [
    { label: 'Product query latency', before: '50ms', after: '2ms' },
    { label: 'Database load', before: '6000 QPS', after: '300 QPS' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Your catalog system is complete! Let's review what you've built.",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Catalog Data: What to Cache and When',
  conceptExplanation: `**The Catalog Caching Strategy**:

**What to cache**:
- ✅ Individual products (by product_id)
- ✅ Product listings (homepage, category pages)
- ✅ Search results (with TTL)
- ❌ User-specific data (carts, orders)

**Cache-Aside Pattern** for Catalog:
\`\`\`python
def get_product(product_id):
    # 1. Check cache
    product = cache.get(f"product:{product_id}")
    if product:
        return product  # Cache hit - fast!

    # 2. Cache miss - query database
    product = db.query("SELECT * FROM products WHERE id = ?", product_id)

    # 3. Store in cache for next time
    cache.set(f"product:{product_id}", product, ttl=3600)  # 1 hour

    return product
\`\`\`

**TTL Strategy**:
- Product details: 1 hour (updates are infrequent)
- Search results: 5 minutes (more dynamic)
- Category listings: 30 minutes

**Invalidation**:
When a product is updated, invalidate cache:
\`\`\`python
def update_product(product_id, updates):
    # 1. Update database
    db.update("products", product_id, updates)

    # 2. Invalidate cache
    cache.delete(f"product:{product_id}")
\`\`\``,

  whyItMatters: 'At 6K reads/sec, hitting the database for every query is unsustainable. Caching reduces load by 90%+ and improves latency 20x.',

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Serving millions of furniture product pages',
    howTheyDoIt: 'Redis cluster caches product data with 1-hour TTL. 98% cache hit rate. Database only handles writes and cache misses.',
  },

  keyPoints: [
    'Cache frequently accessed products (homepage, bestsellers)',
    'Use appropriate TTL (balance freshness vs cache hit rate)',
    'Invalidate cache on product updates',
    'Cache-aside pattern: check cache, then DB on miss',
    'Monitor cache hit rate (target 90%+)',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         CATALOG CACHING ARCHITECTURE                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  READ PATH (95% of requests):                      │
│                                                     │
│  ┌──────────┐                                      │
│  │  Client  │                                      │
│  └────┬─────┘                                      │
│       │ Get product                                │
│       ▼                                            │
│  ┌───────────────┐                                 │
│  │ Catalog Svc   │                                 │
│  └───┬───────────┘                                 │
│      │ 1. Check cache                              │
│      ▼                                             │
│  ┌──────────┐                                      │
│  │  Redis   │──→ Hit (95%)? Return! (2ms)         │
│  │  Cache   │                                      │
│  └──────────┘                                      │
│      │ Miss (5%)?                                  │
│      ▼                                             │
│  ┌──────────┐     ┌──────────────┐                │
│  │PostgreSQL│────→│Elasticsearch │                │
│  │          │     │              │                │
│  └──────────┘     └──────────────┘                │
│      │                                             │
│      └─→ Store in cache for next time              │
│                                                     │
│  WRITE PATH (5% of requests):                      │
│  Update DB → Invalidate cache                      │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'TTL', explanation: 'Time-To-Live: how long cached data stays valid', icon: '⏰' },
    { title: 'Invalidation', explanation: 'Remove stale data when source updates', icon: '🗑️' },
  ],

  quickCheck: {
    question: 'Why set a TTL on cached catalog data instead of caching forever?',
    options: [
      'TTL saves memory',
      'Without TTL, users see stale data after product updates',
      'Redis requires TTL',
      'It makes queries faster',
    ],
    correctIndex: 1,
    explanation: 'If we cache forever, price changes and product updates won\'t be visible until we explicitly invalidate. TTL ensures data stays reasonably fresh.',
  },
};

const step6: GuidedStep = {
  id: 'catalog-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from caching frequently accessed products',
    taskDescription: 'Add a Cache (Redis) to reduce database load',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache frequently accessed catalog data', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Cache strategy configured',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache for fast product lookups',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const productCatalogGuidedTutorial: GuidedTutorial = {
  problemId: 'product-catalog',
  title: 'Design Product Catalog Storage',
  description: 'Build an e-commerce product catalog with variants, flexible attributes, and fast search',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🛍️',
    hook: "You've been hired as Lead Engineer at E-Commerce Catalog Systems!",
    scenario: "Your mission: Build a product catalog that can handle 10M+ products with variants, flexible attributes, and lightning-fast search.",
    challenge: "Can you design a system that supports complex product hierarchies and attribute-based filtering?",
  },

  requirementsPhase: productCatalogRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Catalog Data Model',
    'Product Variant Management',
    'Parent-Child Schema Design',
    'Flexible Attributes (JSONB)',
    'Search Indexing (Elasticsearch)',
    'Attribute Filtering',
    'Catalog Caching Strategy',
    'Schema Evolution',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (Relational vs Document)',
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication (Catalog data sync)',
  ],
};

export default productCatalogGuidedTutorial;
