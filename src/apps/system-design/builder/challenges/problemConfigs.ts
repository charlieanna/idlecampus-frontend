/**
 * Configuration for each of the 40 system design problems
 * Defines traffic patterns, latency targets, and architectural needs
 */

export interface ProblemConfig {
  baseRps: number; // Normal load RPS
  readRatio: number; // Read/write ratio
  maxLatency: number; // Target p99 latency in ms
  availability: number; // Target availability (0-1)
  avgFileSize?: number; // For file upload scenarios (MB)
  hasCdn?: boolean; // If CDN is needed
  hasCache?: boolean; // If caching is recommended
  hasObjectStorage?: boolean; // If S3/blob storage needed
}

export const problemConfigs: { [key: string]: ProblemConfig } = {
  // ========== SOCIAL MEDIA (10) ==========
  instagram: {
    baseRps: 2000,
    readRatio: 0.9, // 90% reads (viewing feed)
    maxLatency: 200,
    availability: 0.999,
    avgFileSize: 2, // 2MB photos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  twitter: {
    baseRps: 5000,
    readRatio: 0.95, // 95% reads (timeline viewing)
    maxLatency: 150,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  reddit: {
    baseRps: 1500,
    readRatio: 0.9, // 90% reads (browsing threads)
    maxLatency: 200,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  linkedin: {
    baseRps: 1000,
    readRatio: 0.85, // 85% reads (profile views, feed)
    maxLatency: 250,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  facebook: {
    baseRps: 10000,
    readRatio: 0.9, // 90% reads (News Feed)
    maxLatency: 200,
    availability: 0.999,
    avgFileSize: 2,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  tiktok: {
    baseRps: 3000,
    readRatio: 0.95, // 95% reads (video viewing)
    maxLatency: 300,
    availability: 0.99,
    avgFileSize: 5, // 5MB videos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  pinterest: {
    baseRps: 1500,
    readRatio: 0.92, // 92% reads (browsing pins)
    maxLatency: 200,
    availability: 0.99,
    avgFileSize: 1, // 1MB images
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  snapchat: {
    baseRps: 2000,
    readRatio: 0.7, // 70% reads (lots of uploads)
    maxLatency: 250,
    availability: 0.99,
    avgFileSize: 3, // 3MB photos/videos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  discord: {
    baseRps: 1200,
    readRatio: 0.8, // 80% reads (message viewing)
    maxLatency: 100, // Real-time messaging
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: true,
  },

  medium: {
    baseRps: 800,
    readRatio: 0.95, // 95% reads (article reading)
    maxLatency: 300,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  // ========== E-COMMERCE & SERVICES (5) ==========
  amazon: {
    baseRps: 5000,
    readRatio: 0.85, // 85% reads (browsing products)
    maxLatency: 200,
    availability: 0.9999, // Very high availability
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  shopify: {
    baseRps: 1500,
    readRatio: 0.8, // 80% reads (store browsing)
    maxLatency: 250,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  stripe: {
    baseRps: 1000,
    readRatio: 0.6, // 60% reads (lots of payment writes)
    maxLatency: 150, // Payment needs to be fast
    availability: 0.9999, // Critical payment service
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  uber: {
    baseRps: 2000,
    readRatio: 0.7, // 70% reads (viewing rides, drivers)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  airbnb: {
    baseRps: 1200,
    readRatio: 0.9, // 90% reads (searching listings)
    maxLatency: 300,
    availability: 0.99,
    avgFileSize: 2, // Property photos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  // ========== STREAMING & MEDIA (5) ==========
  netflix: {
    baseRps: 3000,
    readRatio: 0.98, // 98% reads (video streaming)
    maxLatency: 500,
    availability: 0.9999,
    avgFileSize: 100, // 100MB video chunks
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  spotify: {
    baseRps: 2000,
    readRatio: 0.95, // 95% reads (audio streaming)
    maxLatency: 300,
    availability: 0.999,
    avgFileSize: 5, // 5MB audio files
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  youtube: {
    baseRps: 5000,
    readRatio: 0.97, // 97% reads (video watching)
    maxLatency: 400,
    availability: 0.9999,
    avgFileSize: 50, // 50MB videos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  twitch: {
    baseRps: 1500,
    readRatio: 0.95, // 95% reads (live stream viewing)
    maxLatency: 2000, // Live streaming tolerates higher latency
    availability: 0.99,
    avgFileSize: 10, // Video chunks
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  hulu: {
    baseRps: 1000,
    readRatio: 0.98, // 98% reads (video streaming)
    maxLatency: 500,
    availability: 0.999,
    avgFileSize: 80, // Video chunks
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  // ========== MESSAGING (4) ==========
  whatsapp: {
    baseRps: 10000,
    readRatio: 0.75, // 75% reads (lots of messages sent)
    maxLatency: 100, // Real-time messaging
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: true,
  },

  slack: {
    baseRps: 1500,
    readRatio: 0.8, // 80% reads (reading messages)
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: true,
  },

  telegram: {
    baseRps: 3000,
    readRatio: 0.75, // 75% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: true,
  },

  messenger: {
    baseRps: 5000,
    readRatio: 0.75, // 75% reads
    maxLatency: 100,
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: true,
  },

  // ========== INFRASTRUCTURE (5) ==========
  pastebin: {
    baseRps: 500,
    readRatio: 0.9, // 90% reads (viewing pastes)
    maxLatency: 150,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  dropbox: {
    baseRps: 1000,
    readRatio: 0.7, // 70% reads (file sync is write-heavy)
    maxLatency: 500,
    availability: 0.9999,
    avgFileSize: 10, // 10MB files
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  googledrive: {
    baseRps: 1500,
    readRatio: 0.75, // 75% reads
    maxLatency: 400,
    availability: 0.9999,
    avgFileSize: 8, // 8MB files
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  github: {
    baseRps: 2000,
    readRatio: 0.9, // 90% reads (browsing code)
    maxLatency: 300,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  stackoverflow: {
    baseRps: 1500,
    readRatio: 0.95, // 95% reads (viewing questions)
    maxLatency: 200,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  // ========== FOOD & DELIVERY (3) ==========
  doordash: {
    baseRps: 1000,
    readRatio: 0.7, // 70% reads (browsing restaurants)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  instacart: {
    baseRps: 800,
    readRatio: 0.75, // 75% reads (browsing groceries)
    maxLatency: 250,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  yelp: {
    baseRps: 1000,
    readRatio: 0.9, // 90% reads (searching restaurants)
    maxLatency: 300,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  // ========== PRODUCTIVITY (4) ==========
  notion: {
    baseRps: 800,
    readRatio: 0.75, // 75% reads (viewing pages)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  trello: {
    baseRps: 600,
    readRatio: 0.75, // 75% reads (viewing boards)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  googlecalendar: {
    baseRps: 1000,
    readRatio: 0.8, // 80% reads (viewing events)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  zoom: {
    baseRps: 1500,
    readRatio: 0.5, // 50% reads (video calls are bidirectional)
    maxLatency: 100, // Low latency for video
    availability: 0.9999,
    hasCdn: true,
    hasCache: false,
    hasObjectStorage: true,
  },

  // ========== GAMING & OTHER (4) ==========
  steam: {
    baseRps: 2000,
    readRatio: 0.85, // 85% reads (browsing store)
    maxLatency: 300,
    availability: 0.999,
    avgFileSize: 1000, // 1GB game downloads
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  ticketmaster: {
    baseRps: 1000,
    readRatio: 0.7, // 70% reads (browsing events)
    maxLatency: 200,
    availability: 0.9999, // Critical for ticket purchases
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  bookingcom: {
    baseRps: 1500,
    readRatio: 0.85, // 85% reads (searching hotels)
    maxLatency: 300,
    availability: 0.999,
    avgFileSize: 2, // Hotel photos
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  weatherapi: {
    baseRps: 5000,
    readRatio: 0.99, // 99% reads (weather lookups)
    maxLatency: 100,
    availability: 0.99,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  // ========== EXTRACTED PROBLEMS (from extracted-problems/) ==========

  // TUTORIALS (3)
  'tutorial-simple-blog': {
    baseRps: 1000, // Scale 100 -> 1000
    readRatio: 0.9, // 90% reads
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'tutorial-intermediate-images': {
    baseRps: 10000, // 10k requests/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 100,
    availability: 0.9999,
    avgFileSize: 5, // 5MB images
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  'tutorial-advanced-chat': {
    baseRps: 50000, // 50k messages/sec
    readRatio: 0.8, // 80% reads
    maxLatency: 500,
    availability: 0.9999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  // CACHING (6)
  'reddit-comment-system': {
    baseRps: 5000000, // 5M reads/sec normal
    readRatio: 0.99, // 99% reads (viewing comments)
    maxLatency: 100,
    availability: 0.9999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  'static-content-cdn': {
    baseRps: 20000, // 20k requests/sec
    readRatio: 1.0, // 100% reads (static assets)
    maxLatency: 50,
    availability: 0.999,
    hasCdn: true,
    hasCache: false,
    hasObjectStorage: true,
  },

  'session-store-basic': {
    baseRps: 10000, // 9k reads + 1k writes
    readRatio: 0.9, // 90% reads
    maxLatency: 10,
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'database-query-cache': {
    baseRps: 10000, // 10k queries/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'api-rate-limit-cache': {
    baseRps: 50000, // 50k validations/sec
    readRatio: 0.5, // Read/write balanced
    maxLatency: 5,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'product-catalog-cache': {
    baseRps: 100000, // 100k req/sec (Black Friday)
    readRatio: 0.98, // 98% reads
    maxLatency: 100,
    availability: 0.9995,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  // STREAMING (5)
  'basic-message-queue': {
    baseRps: 5000, // 5k messages/sec
    readRatio: 0.5, // Balanced read/write (pub/sub)
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'realtime-notifications': {
    baseRps: 100000, // 100k notifications/sec
    readRatio: 0.8, // 80% reads (connection tracking)
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'basic-event-log': {
    baseRps: 50000, // 50k events/sec
    readRatio: 0.3, // 30% reads (mostly writes)
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'simple-pubsub': {
    baseRps: 10000, // 10k messages/sec
    readRatio: 0.5, // Balanced pub/sub
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'realtime-chat-messages': {
    baseRps: 20000, // 20k messages/sec
    readRatio: 0.6, // 60% reads (viewing history)
    maxLatency: 100,
    availability: 0.9995,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  // STORAGE (5)
  'basic-database-design': {
    baseRps: 11000, // 10k reads + 1k writes
    readRatio: 0.91, // 91% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'nosql-basics': {
    baseRps: 20000, // 20k ops/sec
    readRatio: 0.8, // 80% reads
    maxLatency: 30,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'key-value-store': {
    baseRps: 100000, // 100k ops/sec
    readRatio: 0.7, // 70% reads
    maxLatency: 1,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'product-catalog': {
    baseRps: 5500, // 5k reads + 500 writes
    readRatio: 0.91, // 91% reads
    maxLatency: 100,
    availability: 0.9995,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'object-storage-system': {
    baseRps: 10000, // 10k file ops/sec
    readRatio: 0.7, // 70% reads
    maxLatency: 200,
    availability: 0.9999,
    avgFileSize: 10, // 10MB average
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  // GATEWAY (4)
  'basic-api-gateway': {
    baseRps: 10000, // 10k requests/sec
    readRatio: 0.9, // 90% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'simple-rate-limiter': {
    baseRps: 20000, // 20k validations/sec
    readRatio: 0.5, // Balanced
    maxLatency: 10,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'authentication-gateway': {
    baseRps: 30000, // 30k auth requests/sec
    readRatio: 1.0, // 100% reads (validation)
    maxLatency: 20,
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'graphql-gateway': {
    baseRps: 5000, // 5k complex queries/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  // SEARCH (4)
  'basic-text-search': {
    baseRps: 1000, // 1k searches/sec
    readRatio: 0.99, // 99% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'autocomplete-search': {
    baseRps: 50000, // 50k keystrokes/sec
    readRatio: 1.0, // 100% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'faceted-search': {
    baseRps: 5000, // 5k filtered searches/sec
    readRatio: 0.99, // 99% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'geo-search': {
    baseRps: 20000, // 20k location queries/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 50,
    availability: 0.9995,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  // MULTIREGION (4)
  'basic-multi-region': {
    baseRps: 10000, // 10k per region
    readRatio: 0.9, // 90% reads
    maxLatency: 100,
    availability: 0.9995,
    hasCdn: true,
    hasCache: false,
    hasObjectStorage: false,
  },

  'active-active-regions': {
    baseRps: 5000, // 5k writes/sec per region
    readRatio: 0.7, // 70% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'global-cdn': {
    baseRps: 10000000, // 10M requests/sec
    readRatio: 1.0, // 100% reads (static)
    maxLatency: 50,
    availability: 0.9999,
    hasCdn: true,
    hasCache: false,
    hasObjectStorage: true,
  },

  'cross-region-dr': {
    baseRps: 10000, // 10k requests/sec
    readRatio: 0.9, // 90% reads
    maxLatency: 100,
    availability: 0.9999,
    hasCdn: true,
    hasCache: false,
    hasObjectStorage: true,
  },

  // Caching Problems (Extended - Automated)
  'gaming-leaderboard-cache': {
    baseRps: 70000, // 20k updates + 50k queries
    readRatio: 0.7, // 70% reads (queries), 30% writes (updates)
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'geo-location-cache': {
    baseRps: 100000, // 100k lookups/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 10,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'config-cache-basic': {
    baseRps: 50000, // 50k config reads/sec
    readRatio: 0.99, // 99% reads
    maxLatency: 5,
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'social-feed-cache': {
    baseRps: 100000, // 100k feed requests/sec
    readRatio: 0.9, // 90% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  'video-streaming-cache': {
    baseRps: 50000, // 50k chunk requests/sec
    readRatio: 0.99, // 99% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: true,
  },

  'search-suggestion-cache': {
    baseRps: 100000, // 100k queries/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 20,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'news-aggregator-cache': {
    baseRps: 50000, // 50k requests/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
    hasCache: true,
    hasObjectStorage: false,
  },

  'graphql-cache': {
    baseRps: 20000, // 20k queries/sec
    readRatio: 0.9, // 90% reads
    maxLatency: 50,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'shopping-cart-cache': {
    baseRps: 30000, // 30k cart operations/sec
    readRatio: 0.7, // 70% reads, 30% writes
    maxLatency: 20,
    availability: 0.9999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  'analytics-dashboard-cache': {
    baseRps: 10000, // 10k dashboard requests/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 200,
    availability: 0.999,
    hasCdn: false,
    hasCache: true,
    hasObjectStorage: false,
  },

  // ========== EXTRACTED PROBLEMS - SYSTEM DESIGN (3) ==========

  // Rate Limiter - from extracted-problems/system-design.md
  'rate-limiter': {
    baseRps: 10000, // 10k requests/sec normal, 100k peak
    readRatio: 0.8, // 80% reads (checking limits)
    maxLatency: 15, // P99 < 15ms for rate limit checks
    availability: 0.999,
    hasCdn: false,
    hasCache: true, // Redis for fast counter access
    hasObjectStorage: false,
  },

  // Real-time Chat System - from extracted-problems/system-design.md
  'chat': {
    baseRps: 100000, // 100k messages/sec sustained
    readRatio: 0.7, // 70% reads (viewing history vs sending)
    maxLatency: 100, // P95 < 100ms message delivery
    availability: 0.9995,
    hasCdn: false,
    hasCache: true, // For presence and online status
    hasObjectStorage: true, // For file sharing
  },

  // Data Ingestion Pipeline - from extracted-problems/system-design.md
  'ingestion': {
    baseRps: 10000, // 10k events/sec steady, 20k peak
    readRatio: 0.3, // 30% reads (mostly writes to pipeline)
    maxLatency: 200, // P99 < 200ms for ingestion
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: true, // For raw event archival
  },

  // ========== DDIA GAP PROBLEMS (5) ==========
  'batch-processing-mapreduce': {
    baseRps: 0, // Batch processing, not request-based
    readRatio: 1.0, // Read-heavy (scan data)
    maxLatency: 21600000, // 6 hours for batch job
    availability: 0.99,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'explicit-sharding-design': {
    baseRps: 110000, // 100k reads/sec + 10k writes/sec
    readRatio: 0.9, // 90% reads
    maxLatency: 50, // P99 < 50ms for single-shard
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'transaction-isolation-levels': {
    baseRps: 10000, // 10k transactions/sec
    readRatio: 0.7, // 70% reads (balance queries)
    maxLatency: 100, // P99 < 100ms for transfers
    availability: 0.9999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'data-warehouse-olap': {
    baseRps: 100, // 100 concurrent analytical queries
    readRatio: 0.99, // 99% reads (OLAP)
    maxLatency: 5000, // P95 < 5s for complex queries
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  'graph-database-social': {
    baseRps: 50000, // 50k graph queries/sec
    readRatio: 0.95, // 95% reads
    maxLatency: 100, // P99 < 100ms for 2-hop queries
    availability: 0.999,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },

  // ========== NFR TEACHING CHAPTER 0 (Throughput) ==========
  'nfr-ch0-throughput-calc': {
    baseRps: 10000, // Peak RPS for calculation exercise
    readRatio: 1.0, // All reads (stateless API)
    maxLatency: 100, // Fast stateless operations
    availability: 0.99,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  },
};
