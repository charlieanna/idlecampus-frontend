/**
 * Utility functions for guided tutorial discovery and categorization
 */

import { tieredChallenges } from '../challenges/tieredChallenges';
import { Challenge } from '../types/testCase';
import {
  hasGuidedTutorial as checkHasGuided,
  getGuidedTutorialCount as getCount,
} from '../challenges/definitions/guidedTutorialIds';

// Category definitions with icons and descriptions
export interface GuidedCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
}

export const GUIDED_CATEGORIES: GuidedCategory[] = [
  // Order matters! More specific categories should come first
  {
    id: 'search',
    name: 'Search Systems',
    icon: '🔍',
    description: 'Build powerful search with Elasticsearch and vector search',
    keywords: ['search', 'elastic', 'autocomplete', 'typeahead', 'fuzzy', 'semantic', 'suggestions', 'discovery', 'highlight', 'boosting', 'synonym'],
  },
  {
    id: 'caching',
    name: 'Caching Patterns',
    icon: '⚡',
    description: 'Master caching strategies for high-performance systems',
    keywords: ['cache', 'cdn'],
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    icon: '🚪',
    description: 'Build robust API gateways with rate limiting, auth, and more',
    keywords: ['gateway', 'rate-limit', 'cors', 'transform', 'oauth2', 'grpc', 'graphql-gateway', 'websocket-gateway', 'webhook', 'serverless-gateway', 'service-discovery', 'load-balancing', 'retry', 'compression', 'versioning', 'zero-trust', 'mobile-gateway', 'iot-gateway'],
  },
  {
    id: 'streaming',
    name: 'Streaming & Queues',
    icon: '🌊',
    description: 'Real-time data processing with Kafka, queues, and event streams',
    keywords: ['stream', 'queue', 'kafka', 'notification', 'pubsub', 'fanout', 'pipeline', 'realtime-chat', 'realtime-notification', 'email-queue', 'content-moderation', 'video-upload', 'order-processing', 'fraud-detection', 'payment-transaction', 'stock-price', 'delivery-tracking', 'sensor-data', 'server-log', 'game-event', 'user-activity'],
  },
  {
    id: 'storage',
    name: 'Database & Storage',
    icon: '🗄️',
    description: 'Design scalable storage systems and database architectures',
    keywords: ['store', 'warehouse', 'registry', 'key-value', 'time-series', 'social-graph', 'banking-transaction', 'healthcare-records', 'inventory-management', 'booking-reservation', 'distributed-session', 'file-metadata', 'config-management', 'audit-trail', 'analytics-warehouse', 'multi-model', 'distributed-transactions', 'content-delivery-storage', 'search-index-storage', 'rate-limit-counters', 'cms-media'],
  },
  {
    id: 'multiregion',
    name: 'Multi-Region',
    icon: '🌐',
    description: 'Global architectures with cross-region failover and replication',
    keywords: ['multiregion', 'multi-region', 'global-', 'cross-region', 'active-active', 'edge-computing', 'global-dns', 'global-cdn', 'global-rate', 'global-inventory', 'global-event'],
  },
  {
    id: 'real-world-apps',
    name: 'Real-World Apps',
    icon: '📱',
    description: 'Build production-ready systems like Twitter, Netflix, Uber',
    keywords: ['twitter', 'instagram', 'netflix', 'uber', 'spotify', 'airbnb', 'slack', 'pinterest', 'reddit', 'tiktok', 'youtube', 'whatsapp', 'doordash', 'tinder', 'zoom', 'shopify', 'twitch', 'facebook', 'linkedin', 'tiny-url', 'pastebin', 'dropbox', 'github', 'stackoverflow', 'medium', 'notion', 'trello', 'discord', 'telegram', 'messenger', 'snapchat', 'hulu', 'steam', 'ticketmaster', 'yelp', 'instacart', 'bookingcom', 'googlecalendar', 'googledrive', 'weatherapi', 'amazon', 'stripe', 'product-catalog'],
  },
  {
    id: 'platform-engineering',
    name: 'Platform Engineering',
    icon: '🏗️',
    description: 'Advanced L5/L6 infrastructure and platform systems',
    keywords: ['l5api', 'l5data', 'l5devprod', 'l5infra', 'l5ml', 'l5multitenant', 'l5observability', 'l5security', 'l6db', 'l6distributed', 'l6privacy', 'l6protocol', 'comprehensive-api-gateway', 'comprehensive-cloud-storage', 'comprehensive-ecommerce', 'comprehensive-search', 'comprehensive-social', 'multi-tenant-saas', 'exactly-once'],
  },
];

// Get category for a challenge ID
export function getChallengeCategory(id: string): GuidedCategory {
  const lowerId = id.toLowerCase();

  for (const category of GUIDED_CATEGORIES) {
    if (category.keywords.some(keyword => lowerId.includes(keyword))) {
      return category;
    }
  }

  // Default category
  return {
    id: 'general',
    name: 'General',
    icon: '📋',
    description: 'General system design problems',
    keywords: [],
  };
}

// Check if a challenge has a guided tutorial
export function hasGuidedTutorial(challengeId: string): boolean {
  return checkHasGuided(challengeId);
}

// Get all challenges with guided tutorials
export function getGuidedChallenges(): Challenge[] {
  return tieredChallenges.filter(c => {
    if (c.id.includes('tutorial') || c.id.includes('boe-walkthrough')) {
      return false;
    }
    // Check if this challenge has a guided tutorial
    return checkHasGuided(c.id);
  });
}

// Group guided challenges by category
export function getGuidedChallengesByCategory(): Record<string, Challenge[]> {
  const guidedChallenges = getGuidedChallenges();
  const grouped: Record<string, Challenge[]> = {};

  for (const challenge of guidedChallenges) {
    const category = getChallengeCategory(challenge.id);
    if (!grouped[category.id]) {
      grouped[category.id] = [];
    }
    grouped[category.id].push(challenge);
  }

  return grouped;
}

// Get categories with their guided challenge counts
export function getCategoriesWithCounts(): Array<GuidedCategory & { count: number; challenges: Challenge[] }> {
  const grouped = getGuidedChallengesByCategory();

  return GUIDED_CATEGORIES
    .map(category => ({
      ...category,
      count: grouped[category.id]?.length || 0,
      challenges: grouped[category.id] || [],
    }))
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);
}

// Group challenges by difficulty
export function groupByDifficulty(challenges: Challenge[]): Record<string, Challenge[]> {
  return {
    beginner: challenges.filter(c => c.difficulty === 'beginner'),
    intermediate: challenges.filter(c => c.difficulty === 'intermediate'),
    advanced: challenges.filter(c => c.difficulty === 'advanced'),
  };
}

// Get estimated time for a guided tutorial (based on step count)
// Default to 6-10 steps = ~30-50 min
export function getEstimatedTime(challenge: Challenge): string {
  // Since we don't load the full tutorial, estimate based on difficulty
  if (challenge.difficulty === 'beginner') return '~25 min';
  if (challenge.difficulty === 'intermediate') return '~35 min';
  return '~45 min';
}

// Get total guided tutorial count
export function getGuidedTutorialCount(): number {
  return getCount();
}
