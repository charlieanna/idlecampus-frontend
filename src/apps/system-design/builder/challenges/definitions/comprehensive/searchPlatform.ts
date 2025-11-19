import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../../utils/codeChallengeGenerator';

/**
 * Comprehensive Search Platform
 * 
 * This problem consolidates all search concepts into a single, realistic application.
 * Users will progressively build a Google/Yelp-scale search platform that covers:
 * 
 * SEARCH CONCEPTS COVERED:
 * 1. Full-Text Search - Keyword search with TF-IDF ranking
 * 2. Autocomplete - Real-time search suggestions with prefix trees
 * 3. Faceted Search - Multi-dimensional filtering (price, rating, category)
 * 4. Geo Search - Location-based search with geohash indexing
 * 5. Search Analytics - Track popular queries and click-through rates
 * 6. Fuzzy Matching - Handle typos and spelling errors
 * 7. Search Ranking - ML-based ranking with personalization
 * 8. Search Indexing - Real-time index updates
 * 
 * The problem is designed for progressive learning:
 * - Start with basic keyword search
 * - Add autocomplete for better UX
 * - Introduce faceted filters
 * - Add location-based search
 * - Optimize with caching and ranking
 */
export const comprehensiveSearchPlatformDefinition: ProblemDefinition = {
  id: 'comprehensive-search-platform',
  title: 'Search Platform (Google/Yelp-scale)',
  description: `Design a comprehensive search platform (like Google or Yelp) that handles:
  
  **Core User Features:**
  - Search for businesses, restaurants, and services
  - Get instant autocomplete suggestions while typing
  - Filter results by category, price, rating, distance
  - Find nearby places based on current location
  - View search results ranked by relevance
  - See business details, photos, and reviews
  
  **Scale Requirements:**
  - Support millions of searches per day
  - Index 100M+ businesses worldwide
  - Handle 50k autocomplete requests/sec
  - Provide sub-100ms search latency
  - Update index in real-time as businesses change
  
  **Key Learning Objectives:**
  This problem teaches you to build a production-grade search system with:
  - Inverted index for fast text search
  - Prefix trees (trie) for autocomplete
  - Elasticsearch aggregations for faceted search
  - Geohash indexing for location queries
  - TF-IDF and BM25 ranking algorithms
  - Query caching for performance
  - Real-time index updates
  - Search analytics and personalization
  
  **Progressive Approach:**
  Start simple with basic search, then progressively add:
  1. Keyword search with ranking
  2. Autocomplete suggestions
  3. Filters (category, price, rating)
  4. Location-based search
  5. Caching and optimization
  6. Advanced ranking and personalization`,

  userFacingFRs: [
    // Core Search Experience
    'Users can search for businesses using keywords',
    'Users get instant autocomplete suggestions while typing',
    'Users can filter results by category (restaurants, hotels, shops)',
    'Users can filter by price range ($, $$, $$$, $$$$)',
    'Users can filter by rating (1-5 stars)',
    'Users can sort results by relevance, rating, or distance',
    
    // Location-Based Search
    'Users can find businesses near their current location',
    'Users can search within a specific radius (1km, 5km, 10km)',
    'Users can search within a bounding box on a map',
    'Results show distance from user location',
    
    // Business Details
    'Users can view business details (name, address, phone, hours)',
    'Users can view photos and reviews',
    'Users can see business location on a map',
    
    // Search Quality
    'Search handles typos and spelling errors (fuzzy matching)',
    'Search supports partial matches and synonyms',
    'Popular searches appear in autocomplete',
    'Trending searches are highlighted',
  ],

  userFacingNFRs: [
    // Performance
    'Search results appear in <100ms at P95',
    'Autocomplete suggestions appear in <50ms at P95',
    'Geo-search completes in <100ms at P95',
    'Faceted search with filters completes in <300ms at P95',
    
    // Scale
    'Support 50,000 autocomplete requests/sec',
    'Support 20,000 search queries/sec',
    'Index 100M+ businesses worldwide',
    'Handle 10M location-based queries/day',
    
    // Accuracy
    'Search relevance score >0.8 for top 10 results',
    'Autocomplete accuracy >90% for popular queries',
    'Fuzzy matching with edit distance up to 2 characters',
    'Geo-search accuracy within 10 meters',
    
    // Freshness
    'New businesses appear in search within 5 seconds',
    'Updated business info reflects in search within 10 seconds',
    'Deleted businesses removed from search within 1 minute',
  ],

  functionalRequirements: {
    mustHave: [
      // Frontend
      {
        type: 'load_balancer',
        reason: 'Need load balancer to distribute search traffic across API servers',
      },
      
      // Application Layer
      {
        type: 'compute',
        reason: 'Need application servers to handle search API requests',
      },
      
      // Search Engine
      {
        type: 'search',
        reason: 'Need Elasticsearch for full-text search with inverted index',
      },
      {
        type: 'search',
        reason: 'Need Elasticsearch for geo-spatial indexing (geohash)',
      },
      {
        type: 'search',
        reason: 'Need Elasticsearch for faceted search aggregations',
      },
      
      // Caching Layer
      {
        type: 'cache',
        reason: 'Need Redis for autocomplete trie (prefix tree) storage',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache popular search queries',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache facet counts',
      },
      
      // Database
      {
        type: 'storage',
        reason: 'Need primary database for business data (name, address, hours)',
      },
      {
        type: 'storage',
        reason: 'Need database for search analytics (query logs, click-through rates)',
      },
      
      // Message Queue
      {
        type: 'message_queue',
        reason: 'Need message queue for async index updates when businesses change',
      },
    ],
    
    mustConnect: [
      // User Traffic Flow
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users send search queries through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load balancer distributes to search API servers',
      },
      
      // Search Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'API checks cache for popular queries (cache hit = instant response)',
      },
      {
        from: 'compute',
        to: 'search',
        reason: 'API queries Elasticsearch for full-text search',
      },
      
      // Autocomplete Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'API queries Redis trie for autocomplete suggestions',
      },
      
      // Faceted Search Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'API checks cache for facet counts',
      },
      {
        from: 'compute',
        to: 'search',
        reason: 'API queries Elasticsearch aggregations for facet counts',
      },
      
      // Geo Search Flow
      {
        from: 'compute',
        to: 'search',
        reason: 'API queries Elasticsearch with geo_distance for location search',
      },
      
      // Business Data
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries database for full business details',
      },
      
      // Index Updates
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API publishes business update events to queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Index worker consumes events from queue',
      },
      {
        from: 'compute',
        to: 'search',
        reason: 'Index worker updates Elasticsearch index',
      },
      
      // Analytics
      {
        from: 'compute',
        to: 'storage',
        reason: 'API logs search queries and clicks to analytics database',
      },
    ],
    
    dataModel: {
      entities: [
        'business',
        'location',
        'category',
        'review',
        'search_query',
        'autocomplete_suggestion',
        'facet',
      ],
      fields: {
        business: ['id', 'name', 'description', 'category', 'price_range', 'rating', 'review_count', 'phone', 'hours'],
        location: ['business_id', 'lat', 'lon', 'address', 'city', 'state', 'zip'],
        category: ['id', 'name', 'parent_category_id'],
        review: ['id', 'business_id', 'user_id', 'rating', 'text', 'created_at'],
        search_query: ['id', 'query_text', 'user_id', 'timestamp', 'result_count', 'clicked_business_id'],
        autocomplete_suggestion: ['prefix', 'completions', 'popularity_scores'],
        facet: ['name', 'values', 'counts'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' },  // Full-text search
        { type: 'read_by_key', frequency: 'very_high' },    // Autocomplete prefix lookups
        { type: 'read_by_query', frequency: 'high' },       // Geo-spatial queries
        { type: 'write', frequency: 'medium' },             // Index updates
      ],
    },
  },

  scenarios: generateScenarios('comprehensive-search-platform', problemConfigs['comprehensive-search-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(comprehensiveSearchPlatformDefinition as any).codeChallenges = generateCodeChallengesFromFRs(comprehensiveSearchPlatformDefinition);

