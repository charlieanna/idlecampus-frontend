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
};
