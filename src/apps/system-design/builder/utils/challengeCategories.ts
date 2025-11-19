/**
 * Challenge categorization and execution configuration
 *
 * Maps challenges to categories and defines category-specific
 * execution parameters (timeout, memory limits, etc.)
 */

export type ChallengeCategory =
  | 'social_media'
  | 'messaging'
  | 'ecommerce'
  | 'streaming'
  | 'storage'
  | 'gateway'
  | 'search'
  | 'productivity'
  | 'delivery'
  | 'gaming'
  | 'generic';

/**
 * Execution configuration for a challenge category
 */
export interface CategoryConfig {
  timeoutMs: number;     // Maximum execution time
  memoryMB: number;      // Maximum memory usage
  description: string;   // Category description
}

/**
 * Category-specific execution configurations
 */
export const CATEGORY_CONFIGS: Record<ChallengeCategory, CategoryConfig> = {
  social_media: {
    timeoutMs: 10000,  // 10 seconds (graph traversal can be expensive)
    memoryMB: 256,
    description: 'Social networking platforms (Facebook, Instagram, Twitter, etc.)',
  },
  messaging: {
    timeoutMs: 8000,   // 8 seconds (message ordering, delivery)
    memoryMB: 128,
    description: 'Messaging and chat platforms (WhatsApp, Slack, Discord, etc.)',
  },
  ecommerce: {
    timeoutMs: 12000,  // 12 seconds (inventory, pricing calculations)
    memoryMB: 256,
    description: 'E-commerce platforms (Amazon, Shopify, Stripe, etc.)',
  },
  streaming: {
    timeoutMs: 15000,  // 15 seconds (video processing, transcoding)
    memoryMB: 512,
    description: 'Streaming and media platforms (Netflix, YouTube, Spotify, etc.)',
  },
  storage: {
    timeoutMs: 10000,  // 10 seconds (file operations)
    memoryMB: 512,
    description: 'Storage and file systems (Dropbox, Google Drive, S3, etc.)',
  },
  gateway: {
    timeoutMs: 5000,   // 5 seconds (fast routing, auth)
    memoryMB: 128,
    description: 'API gateways and infrastructure (rate limiters, auth, etc.)',
  },
  search: {
    timeoutMs: 8000,   // 8 seconds (indexing, querying)
    memoryMB: 256,
    description: 'Search engines and autocomplete (Elasticsearch, text search, etc.)',
  },
  productivity: {
    timeoutMs: 10000,  // 10 seconds (document processing)
    memoryMB: 256,
    description: 'Productivity tools (Notion, Trello, Calendar, etc.)',
  },
  delivery: {
    timeoutMs: 10000,  // 10 seconds (routing, optimization)
    memoryMB: 256,
    description: 'Food and package delivery (DoorDash, Instacart, Uber, etc.)',
  },
  gaming: {
    timeoutMs: 8000,   // 8 seconds (leaderboard, matchmaking)
    memoryMB: 256,
    description: 'Gaming platforms (Steam, leaderboards, etc.)',
  },
  generic: {
    timeoutMs: 10000,  // 10 seconds (default)
    memoryMB: 256,
    description: 'Generic system design challenges',
  },
};

/**
 * Map of challenge IDs to categories (auto-generated for all known challenges)
 */
export const CHALLENGE_CATEGORY_MAP: Record<string, ChallengeCategory> = {
  // Social Media
  facebook: 'social_media',
  instagram: 'social_media',
  twitter: 'social_media',
  reddit: 'social_media',
  linkedin: 'social_media',
  tiktok: 'social_media',
  pinterest: 'social_media',
  snapchat: 'social_media',
  medium: 'social_media',

  // Messaging
  whatsapp: 'messaging',
  slack: 'messaging',
  telegram: 'messaging',
  messenger: 'messaging',
  discord: 'messaging',
  chat: 'messaging',
  'realtime-chat-messages': 'messaging',

  // E-commerce & Services
  amazon: 'ecommerce',
  shopify: 'ecommerce',
  stripe: 'ecommerce',
  uber: 'delivery',
  airbnb: 'ecommerce',
  doordash: 'delivery',
  instacart: 'delivery',
  yelp: 'ecommerce',
  ticketmaster: 'ecommerce',
  bookingcom: 'ecommerce',

  // Streaming & Media
  netflix: 'streaming',
  spotify: 'streaming',
  youtube: 'streaming',
  twitch: 'streaming',
  hulu: 'streaming',

  // Storage
  pastebin: 'storage',
  dropbox: 'storage',
  googledrive: 'storage',
  's3': 'storage',
  'object-storage-system': 'storage',

  // Infrastructure/Gateway
  'basic-api-gateway': 'gateway',
  'simple-rate-limiter': 'gateway',
  'rate-limiter': 'gateway',
  'authentication-gateway': 'gateway',
  'graphql-gateway': 'gateway',
  'graphql-cache': 'gateway',

  // Search
  'basic-text-search': 'search',
  'autocomplete-search': 'search',
  'faceted-search': 'search',
  'geo-search': 'search',
  'search-suggestion-cache': 'search',

  // Productivity
  notion: 'productivity',
  trello: 'productivity',
  googlecalendar: 'productivity',
  zoom: 'productivity',
  github: 'productivity',
  stackoverflow: 'productivity',

  // Gaming
  steam: 'gaming',
  'gaming-leaderboard-cache': 'gaming',

  // URL Shorteners
  tiny_url: 'gateway',
  'tiny_url_tiered': 'gateway',
  'tiny-url-l6': 'caching', // L6-level URL shortener (converted from Challenge to ProblemDefinition)
  'tiny_url_progressive': 'gateway',

  // Food & Blogs
  food_blog: 'generic',
  todo_app: 'productivity',
  ticket_master: 'ecommerce',

  // Add more mappings as needed...
};

/**
 * Get category for a challenge ID
 * Falls back to 'generic' if not found
 */
export function getChallengeCategory(challengeId: string): ChallengeCategory {
  return CHALLENGE_CATEGORY_MAP[challengeId] || 'generic';
}

/**
 * Get execution config for a challenge
 */
export function getChallengeConfig(challengeId: string): CategoryConfig {
  const category = getChallengeCategory(challengeId);
  return CATEGORY_CONFIGS[category];
}

/**
 * Get all challenges in a category
 */
export function getChallengesByCategory(category: ChallengeCategory): string[] {
  return Object.entries(CHALLENGE_CATEGORY_MAP)
    .filter(([_, cat]) => cat === category)
    .map(([id, _]) => id);
}
