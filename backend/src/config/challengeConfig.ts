/**
 * Challenge execution configuration for Python code execution
 *
 * Defines timeout and memory limits for each challenge category
 */

export interface ChallengeExecutionConfig {
  timeoutMs: number;     // Maximum execution time in milliseconds
  memoryMB?: number;     // Maximum memory in MB (optional, for future use)
  description?: string;  // Category description
}

/**
 * Category-based execution configurations
 */
const CATEGORY_CONFIGS: Record<string, ChallengeExecutionConfig> = {
  social_media: {
    timeoutMs: 10000,  // 10 seconds (graph traversal can be expensive)
    memoryMB: 256,
    description: 'Social networking platforms',
  },
  messaging: {
    timeoutMs: 8000,   // 8 seconds
    memoryMB: 128,
    description: 'Messaging and chat platforms',
  },
  ecommerce: {
    timeoutMs: 12000,  // 12 seconds
    memoryMB: 256,
    description: 'E-commerce platforms',
  },
  streaming: {
    timeoutMs: 15000,  // 15 seconds (video processing)
    memoryMB: 512,
    description: 'Streaming and media platforms',
  },
  storage: {
    timeoutMs: 10000,  // 10 seconds
    memoryMB: 512,
    description: 'Storage and file systems',
  },
  gateway: {
    timeoutMs: 5000,   // 5 seconds (fast routing)
    memoryMB: 128,
    description: 'API gateways and infrastructure',
  },
  search: {
    timeoutMs: 8000,   // 8 seconds
    memoryMB: 256,
    description: 'Search engines',
  },
  productivity: {
    timeoutMs: 10000,  // 10 seconds
    memoryMB: 256,
    description: 'Productivity tools',
  },
  delivery: {
    timeoutMs: 10000,  // 10 seconds
    memoryMB: 256,
    description: 'Delivery services',
  },
  gaming: {
    timeoutMs: 8000,   // 8 seconds
    memoryMB: 256,
    description: 'Gaming platforms',
  },
  generic: {
    timeoutMs: 10000,  // 10 seconds (default)
    memoryMB: 256,
    description: 'Generic challenges',
  },
};

/**
 * Map challenge IDs to categories
 */
const CHALLENGE_CATEGORIES: Record<string, string> = {
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

  // E-commerce
  amazon: 'ecommerce',
  shopify: 'ecommerce',
  stripe: 'ecommerce',
  airbnb: 'ecommerce',
  yelp: 'ecommerce',
  ticketmaster: 'ecommerce',
  bookingcom: 'ecommerce',

  // Delivery
  uber: 'delivery',
  doordash: 'delivery',
  instacart: 'delivery',

  // Streaming
  netflix: 'streaming',
  spotify: 'streaming',
  youtube: 'streaming',
  twitch: 'streaming',
  hulu: 'streaming',

  // Storage
  pastebin: 'storage',
  dropbox: 'storage',
  googledrive: 'storage',
  s3: 'storage',

  // Gateway
  tiny_url: 'gateway',
  tinyurl_hash_function: 'gateway',
  'basic-api-gateway': 'gateway',
  'simple-rate-limiter': 'gateway',
  'rate-limiter': 'gateway',

  // Search
  'basic-text-search': 'search',
  'autocomplete-search': 'search',

  // Productivity
  notion: 'productivity',
  trello: 'productivity',
  zoom: 'productivity',
  github: 'productivity',

  // Gaming
  steam: 'gaming',
};

/**
 * Get execution configuration for a challenge
 */
export function getChallengeExecutionConfig(challengeId: string): ChallengeExecutionConfig {
  // Normalize challenge ID (remove underscores, convert to lowercase)
  const normalizedId = challengeId.toLowerCase().replace(/_/g, '');

  // Try to find category for this challenge
  const category = CHALLENGE_CATEGORIES[normalizedId] || CHALLENGE_CATEGORIES[challengeId] || 'generic';

  // Return category config or default
  return CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.generic;
}

/**
 * Get timeout for a challenge (in milliseconds)
 */
export function getChallengeTimeout(challengeId: string): number {
  return getChallengeExecutionConfig(challengeId).timeoutMs;
}

/**
 * Get memory limit for a challenge (in MB)
 */
export function getChallengeMemoryLimit(challengeId: string): number | undefined {
  return getChallengeExecutionConfig(challengeId).memoryMB;
}
