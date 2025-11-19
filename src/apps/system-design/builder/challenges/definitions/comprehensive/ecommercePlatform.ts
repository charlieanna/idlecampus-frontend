import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../../utils/codeChallengeGenerator';

/**
 * Comprehensive E-commerce Platform
 * 
 * This problem consolidates all caching concepts into a single, realistic application.
 * Users will progressively build an Amazon-scale e-commerce platform that covers:
 * 
 * CACHING CONCEPTS COVERED:
 * 1. Session Store - User authentication and session management
 * 2. Database Query Cache - Analytics dashboard caching
 * 3. API Rate Limiting - Protecting APIs with rate limits
 * 4. Product Catalog Cache - Product details and inventory
 * 5. Multi-tenant Isolation - Supporting multiple sellers
 * 6. CMS Cache - Product descriptions and content
 * 7. Auth Token Cache - JWT validation and revocation
 * 8. Pricing Engine - Dynamic pricing with ML
 * 9. Recommendation Engine - Personalized product recommendations
 * 10. Real-time Bidding - Ad placement on product pages
 * 11. Global Inventory - Multi-region inventory management
 * 12. CDN Caching - Static asset delivery
 * 
 * The problem is designed for progressive learning:
 * - Start with basic connectivity (client -> LB -> compute -> cache -> DB)
 * - Add product catalog and session management
 * - Introduce rate limiting and security
 * - Scale to multi-region with CDN
 * - Add advanced features like dynamic pricing and recommendations
 */
export const comprehensiveEcommercePlatformDefinition: ProblemDefinition = {
  id: 'comprehensive-ecommerce-platform',
  title: 'E-commerce Platform (Amazon-scale)',
  description: `Design a comprehensive e-commerce platform (like Amazon) that handles:
  
  **Core User Features:**
  - Browse and search products with instant results
  - Add items to cart and checkout securely
  - View personalized product recommendations
  - Track orders and view order history
  - Sellers can manage their product catalogs
  
  **Scale Requirements:**
  - Support millions of concurrent shoppers
  - Handle Black Friday traffic spikes (100k+ requests/sec)
  - Serve users globally with low latency
  - Prevent overselling during flash sales
  - Maintain high availability (99.9%+)
  
  **Key Learning Objectives:**
  This problem teaches you to build a production-grade system with:
  - Multi-layer caching strategy (CDN, Redis, local cache)
  - Session management and authentication
  - Rate limiting and API security
  - Dynamic pricing and personalization
  - Global inventory management
  - Real-time updates and consistency
  - Scalability patterns for extreme traffic
  - ACID transactions for checkout (order + payment atomicity) - DDIA Ch. 7
  - Serializable isolation to prevent overselling (write skew prevention) - DDIA Ch. 7
  - Optimistic/pessimistic locking for inventory management - DDIA Ch. 7
  - Batch processing for analytics (Map/Reduce for sales reports) - DDIA Ch. 10
  - Stream processing for real-time recommendations - DDIA Ch. 11
  - CQRS pattern (separate read/write models for performance) - DDIA Ch. 12
  - Event sourcing for order history and audit logs - DDIA Ch. 12
  
  **Progressive Approach:**
  Start simple with basic connectivity, then progressively add:
  1. Product catalog and caching
  2. User sessions and authentication
  3. Shopping cart and checkout
  4. Rate limiting and security
  5. Multi-region deployment
  6. Advanced features (recommendations, dynamic pricing)`,

  userFacingFRs: [
    // Core Shopping Experience
    'Users can browse products by category',
    'Users can search for products with autocomplete',
    'Users can view detailed product information (images, description, price, reviews)',
    'Users can add products to shopping cart',
    'Users can checkout and place orders',
    'Checkout is atomic - both order creation and payment processing succeed or both fail (ACID transactions)',
    'System prevents overselling using serializable isolation (no two users can buy the last item)',
    'Inventory updates use optimistic locking to handle concurrent purchases',
    
    // User Account Management
    'Users can create accounts and login',
    'Users can view order history and track shipments',
    'Users can save favorite products and wishlists',
    
    // Seller Features
    'Sellers can list products with descriptions and images',
    'Sellers can manage inventory and pricing',
    'Sellers can view sales analytics dashboard',
    'Analytics dashboard shows real-time metrics (stream processing) and historical reports (batch processing)',
    'Sales reports are generated using batch processing (Map/Reduce) for accuracy',
    
    // Personalization
    'Users see personalized product recommendations',
    'Users see targeted ads based on browsing history',
    'Product prices may vary based on user segment and demand',
    
    // Global Access
    'Users worldwide can access the platform from their nearest region',
    'Products remain available even during regional failures',
    'Inventory is synchronized across all regions',
  ],

  userFacingNFRs: [
    // Performance
    'Product page loads in <200ms at P95',
    'Search results appear in <100ms',
    'Session validation completes in <10ms',
    'Checkout process completes in <2 seconds',
    
    // Scale
    'Support 100,000 requests/sec during peak traffic (Black Friday)',
    'Handle 10M concurrent active users',
    'Serve 1B+ product SKUs',
    'Process 1M orders per day',
    
    // Availability & Reliability
    'System availability of 99.9% (8.76 hours downtime/year)',
    'Zero overselling - inventory must be accurate',
    'Zero data loss for orders and payments',
    'Automatic failover within 30 seconds of regional failure',
    
    // Consistency
    'User sees their own actions immediately (read-after-write consistency)',
    'Inventory updates propagate within 100ms',
    'Price changes take effect within 1 second',
    'Order history uses event sourcing - all order state changes are stored as immutable events',
    'System uses CQRS - separate read model (optimized for queries) and write model (optimized for transactions)',
    
    // Security
    'API rate limiting: 1000 requests/hour per user',
    'Session tokens expire after 30 minutes of inactivity',
    'All payment data encrypted at rest and in transit',
  ],

  functionalRequirements: {
    mustHave: [
      // Frontend & CDN
      {
        type: 'cdn',
        reason: 'Need CDN to serve static assets (images, CSS, JS) globally with low latency',
      },
      
      // Load Balancing
      {
        type: 'load_balancer',
        reason: 'Need load balancer to distribute traffic across multiple application servers',
      },
      
      // Application Layer
      {
        type: 'compute',
        reason: 'Need application servers to handle business logic (product catalog, cart, checkout)',
      },
      
      // Caching Layer (Multiple Redis Clusters)
      {
        type: 'cache',
        reason: 'Need session cache (Redis) for fast user session lookups with 30-min TTL',
      },
      {
        type: 'cache',
        reason: 'Need product cache (Redis) for product details, prices, and inventory',
      },
      {
        type: 'cache',
        reason: 'Need query cache (Redis) for expensive analytics queries on seller dashboard',
      },
      {
        type: 'cache',
        reason: 'Need rate limit cache (Redis) for API rate limiting counters',
      },
      
      // Database Layer
      {
        type: 'storage',
        reason: 'Need primary database for user accounts, orders, and product catalog',
      },
      {
        type: 'storage',
        reason: 'Need read replicas to handle cache misses and analytics queries',
      },
      
      // Search
      {
        type: 'search',
        reason: 'Need search engine (Elasticsearch) for product search with autocomplete',
      },
      
      // Message Queue
      {
        type: 'message_queue',
        reason: 'Need message queue for async tasks (order processing, inventory updates, emails)',
      },
      
      // Object Storage
      {
        type: 'object_storage',
        reason: 'Need object storage (S3) for product images and user-generated content',
      },
    ],
    
    mustConnect: [
      // User Traffic Flow
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users access the platform through CDN for static assets',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN forwards dynamic requests to load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load balancer distributes traffic to application servers',
      },
      
      // Application to Caching Layer
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check session cache for user authentication',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check product cache for product details',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check query cache for analytics dashboard',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check rate limit cache to enforce API limits',
      },
      
      // Application to Database
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers write to primary database (orders, user accounts)',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read from read replicas on cache miss',
      },
      
      // Application to Search
      {
        from: 'compute',
        to: 'search',
        reason: 'App servers query search engine for product search',
      },
      
      // Application to Message Queue
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App servers publish events (order placed, inventory updated)',
      },
      
      // Application to Object Storage
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App servers store/retrieve product images from S3',
      },
      
      // CDN to Object Storage
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls images from S3 origin',
      },
    ],
    
    dataModel: {
      entities: [
        'user',
        'session',
        'product',
        'inventory',
        'order',
        'cart',
        'seller',
        'review',
        'recommendation',
        'price',
      ],
      fields: {
        user: ['id', 'email', 'password_hash', 'name', 'address', 'created_at'],
        session: ['id', 'user_id', 'token', 'expires_at', 'last_activity'],
        product: ['id', 'seller_id', 'name', 'description', 'category', 'image_url', 'created_at'],
        inventory: ['product_id', 'quantity', 'warehouse_id', 'updated_at'],
        order: ['id', 'user_id', 'total_amount', 'status', 'created_at', 'shipped_at'],
        cart: ['id', 'user_id', 'product_id', 'quantity', 'added_at'],
        seller: ['id', 'name', 'email', 'rating', 'created_at'],
        review: ['id', 'product_id', 'user_id', 'rating', 'comment', 'created_at'],
        recommendation: ['user_id', 'product_id', 'score', 'reason', 'generated_at'],
        price: ['product_id', 'base_price', 'current_price', 'discount_percent', 'updated_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },     // Product lookups, session validation
        { type: 'write', frequency: 'high' },                // Orders, cart updates, inventory
        { type: 'read_by_query', frequency: 'high' },        // Search, category browse
        { type: 'read_by_range', frequency: 'medium' },      // Order history, analytics
      ],
    },
  },

  scenarios: generateScenarios('comprehensive-ecommerce-platform', problemConfigs['comprehensive-ecommerce-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(comprehensiveEcommercePlatformDefinition as any).codeChallenges = generateCodeChallengesFromFRs(comprehensiveEcommercePlatformDefinition);

