import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Static Content CDN Coach Configuration
 * Pattern: CDN + Caching + Object Storage
 * Focus: Edge caching, cache hit rates, global distribution
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic CDN Setup',
  goal: 'Serve static assets (images, CSS, JS) from edge locations',
  description: 'Learn how CDNs work and why they\'re essential for modern web apps',
  estimatedTime: '12 minutes',
  learningObjectives: [
    'Understand CDN architecture and edge locations',
    'Learn cache hits vs cache misses',
    'Design origin server fallback',
    'Connect CDN to object storage (S3)',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to CDN design! You\'re building infrastructure for a news website that serves millions of images, CSS files, and JavaScript files globally. Learn how to deliver content fast!',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Deliver static assets with <50ms latency globally\n\nRequirements:\n• Serve images, CSS, JS from edge locations\n• 95% cache hit rate (reduce origin load)\n• 20k requests/sec\n• Global distribution\n\nStart by building: Client → CDN → Origin → S3',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'cdn' },
      message: '✅ CDN added! This is the core of your architecture.\n\n💡 How CDNs work:\n1. User in Tokyo requests /logo.png\n2. CDN edge in Tokyo checks cache\n3. Cache HIT → Return cached file (10ms)\n4. Cache MISS → Fetch from origin (150ms)\n5. Cache the file for next request\n\nNow add an origin server!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 's3' },
      message: '✅ S3 (Object Storage) added! Perfect for storing:\n• Images (JPEG, PNG, WebP)\n• CSS files\n• JavaScript bundles\n• Videos\n• PDFs\n\n💡 S3 is designed for 99.999999999% durability (11 nines)!\nYour files won\'t get lost.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Origin Server added! This handles CDN cache misses.\n\n💡 Flow on cache miss:\n1. CDN checks cache → MISS\n2. CDN requests from origin server\n3. Origin fetches from S3\n4. Origin returns to CDN\n5. CDN caches and serves\n\nConnect: CDN → Origin → S3',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Components need to be connected!\n\nProper CDN architecture:\n1. Client → CDN (users access content)\n2. CDN → Origin Server (cache miss fallback)\n3. Origin → S3 (fetch master files)\n\nDraw these connections!',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Awesome! Your CDN is working!\n\nStatic assets are served from edge locations globally. But we can optimize further - let\'s improve cache hit rates and reduce costs!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: CDNs sit between users and your origin servers. They cache content at edge locations worldwide. What three components do you need?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. CDN (CloudFront/Cloudflare) - Edge caching\n2. Origin Server (App Server) - Handles cache misses\n3. S3 - Stores master copies\n\nConnect: Client → CDN → Origin → S3',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 150 },
      hint: '🎯 Direct help:\n• Add CDN (e.g., CloudFront)\n• Add App Server as origin\n• Add S3 for object storage\n\nFlow: Client → CDN → App Server → S3',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Optimize Cache Hit Rate',
  goal: 'Achieve 95%+ cache hit rate with smart caching strategies',
  description: 'Learn cache invalidation, TTL tuning, and cache warming',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand cache hit rate metrics',
    'Configure optimal TTL (Time To Live)',
    'Implement cache invalidation strategies',
    'Use cache warming for popular content',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goal: Achieve 95% cache hit rate!\n\nCurrent problem:\n• Cache hit rate: 70% (too low)\n• 30% of requests hit origin\n• High S3 costs\n• Slower response times\n\n💡 Goal: Optimize caching to reduce origin load and costs.',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Cache Hit Rate' },
      message: '⚠️ Cache hit rate too low!\n\nTo improve:\n1. Increase TTL for static assets (images rarely change)\n2. Pre-warm cache for popular content\n3. Use versioned URLs (e.g., /logo.v2.png)\n4. Configure proper Cache-Control headers\n\n💡 CSS/JS: TTL = 1 year with versioned URLs\n💡 Images: TTL = 1 week',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis added for cache warming!\n\n💡 Cache warming strategy:\n1. Track popular content in Redis (view counts)\n2. Daily job: Pre-fetch top 10K images\n3. Push to all CDN edge locations\n4. Result: Popular content is ALWAYS cached\n\nThis can boost hit rate from 70% → 95%!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'latency_exceeded', maxLatency: 50 },
      message: '⚠️ Latency too high!\n\nCause: Too many cache misses hitting origin.\n\n💡 Solutions:\n1. Increase CDN TTL\n2. Pre-warm cache for popular content\n3. Use regional origin servers (closer to edges)\n4. Enable HTTP/2 for multiplexing',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Excellent! 95% cache hit rate achieved!\n\nYou\'ve learned:\n• TTL tuning for different asset types\n• Cache warming strategies\n• Versioned URLs for cache busting\n• Cache-Control headers\n\nNext: Handle dynamic content and personalization!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Low cache hit rate means assets are expiring too quickly or not being cached at all. What can you configure to keep assets cached longer?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: To improve cache hit rate:\n1. Increase CDN TTL (e.g., 1 week for images)\n2. Use versioned URLs (/logo.v2.png) to cache forever\n3. Add Redis to track popular content\n4. Pre-warm cache for top content',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 200 },
      hint: '🎯 Direct solution:\n1. Configure CDN with high TTL:\n   - Images: 7 days\n   - CSS/JS: 1 year (with versioning)\n2. Add Redis for popularity tracking\n3. Implement cache warming job\n4. Use Cache-Control: public, max-age=604800',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Multi-Region CDN + Dynamic Content',
  goal: 'Scale globally with edge computing and dynamic content delivery',
  description: 'Handle mixed static/dynamic content with edge computing',
  estimatedTime: '20 minutes',
  learningObjectives: [
    'Implement edge computing (Lambda@Edge)',
    'Handle dynamic content at the edge',
    'Image optimization on-the-fly',
    'Multi-region origin failover',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3 Goal: Handle dynamic content and image transformations!\n\nNew requirements:\n• Resize images on-the-fly (thumbnails, mobile)\n• Personalized content at the edge\n• Multi-region failover\n• WebP conversion for modern browsers\n\nYou need edge computing!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'lambda' },
      message: '✅ Lambda@Edge added! This runs code at CDN edge locations.\n\n💡 Use cases:\n1. Image resizing: /image.jpg?width=300\n2. Format conversion: WebP for Chrome, JPEG for Safari\n3. URL rewrites: /blog/post-slug → /blog/12345\n4. A/B testing at the edge\n5. Auth checks before serving content\n\nCompute happens at the edge (low latency)!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Multi-region origins!\n\n💡 Failover strategy:\n• Primary origin: us-east-1\n• Secondary origin: eu-west-1\n• Tertiary origin: ap-southeast-1\n\nIf primary fails, CDN automatically routes to secondary.\n\nThis ensures 99.99% availability!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 's3' },
      message: '⚠️ S3 bottleneck on image transformations!\n\nProblem: Resizing every image request is expensive.\n\n💡 Solution:\n1. Lambda@Edge resizes on first request\n2. Cache the resized version\n3. Subsequent requests hit cache\n\nResize once, serve millions!',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Incredible! You\'ve built a world-class CDN!\n\nAchievements:\n✓ Static asset delivery from edge locations\n✓ 95%+ cache hit rate\n✓ Dynamic content with Lambda@Edge\n✓ On-the-fly image transformations\n✓ Multi-region failover\n✓ <50ms latency globally\n\nThis is production-grade architecture! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'netflix',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Dynamic content (image resizing, personalization) can\'t be pre-cached. What technology lets you run code at the CDN edge?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Use edge computing:\n1. Add Lambda@Edge (or Cloudflare Workers)\n2. Resize images on-the-fly at the edge\n3. Cache the transformed result\n4. Set up multi-region origins for failover\n\nEdge compute = low latency dynamic content!',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 250 },
      hint: '🎯 Direct solution:\n1. Add Lambda@Edge for image transformations\n2. Configure multi-region origin servers:\n   - Primary: us-east-1\n   - Secondary: eu-west-1\n3. Lambda resizes on first request, caches result\n4. Use CloudFront with origin failover enabled',
      hintLevel: 3,
    },
  ],
};

export const staticContentCdnCoachConfig: ProblemCoachConfig = {
  problemId: 'static-content-cdn',
  archetype: 'cdn',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nYou\'ve built a working CDN! You understand:\n• Edge caching at global locations\n• Cache hits vs misses\n• Origin server fallback\n• Object storage (S3)\n\nNext: Optimize cache hit rates!',
    2: '🎉 Level 2 Complete!\n\nYou\'ve optimized for 95% cache hit rate! You\'ve learned:\n• TTL tuning strategies\n• Cache warming for popular content\n• Versioned URLs for cache busting\n• Cache-Control headers\n\nNext: Edge computing and dynamic content!',
    3: '🎉 CDN Mastery Complete! 🌍\n\nYou\'ve built a global CDN with:\n✓ Static asset delivery (<50ms globally)\n✓ 95%+ cache hit rate\n✓ Edge computing (Lambda@Edge)\n✓ On-the-fly image transformations\n✓ Multi-region failover (99.99% uptime)\n\nYou can now deliver content at massive scale!',
  },
  nextProblemRecommendation: 'netflix',
  prerequisites: [],
  estimatedTotalTime: '47 minutes',
};

export function getStaticContentCdnLevelConfig(level: number): LevelCoachConfig | null {
  return staticContentCdnCoachConfig.levelConfigs[level] || null;
}
