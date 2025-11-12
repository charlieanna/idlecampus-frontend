import { Challenge } from '../types/testCase';

export const foodBlogChallenge: Challenge = {
  id: 'food_blog',
  title: 'Food Blog with Images',
  difficulty: 'beginner',
  description: `Design a food blogging platform where users can read articles and view high-resolution food photos.

The blog is read-heavy with lots of images. Most traffic comes from organic search and social media shares.

Example:
- GET /posts/chocolate-cake → HTML page (50KB)
- GET /images/chocolate-cake-1.jpg → Image (2MB)
- Each blog post has 5-10 images on average`,

  requirements: {
    functional: [
      'Serve blog posts (HTML pages)',
      'Serve high-resolution food images',
      'Handle viral traffic spikes from social media',
    ],
    traffic: '2,000 RPS reads (90% images, 10% HTML)',
    latency: 'p99 < 500ms for all assets',
    availability: '99% uptime',
    budget: '$300/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'postgresql',
    'mongodb',
    'cassandra',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can access blog posts and view images. The system must serve HTML pages and image files.',
      traffic: {
        type: 'read',
        rps: 10, // Very low traffic, just testing basic functionality
        avgResponseSizeMB: 1, // Mix of HTML and images
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0, // Must work perfectly
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 's3', config: { storageSizeGB: 100 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Minimal viable system - app server serves HTML from DB, images from S3.`,
      },
    },
    {
      name: 'Serve Static Content',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System serves high-resolution food images (2MB average) with correct URLs and metadata.',
      traffic: {
        type: 'read',
        rps: 20,
        avgResponseSizeMB: 2, // Large images
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'Handle Mixed Traffic',
      type: 'functional',
      requirement: 'FR-3',
      description: 'System handles both HTML page requests (10%) and image requests (90%) simultaneously.',
      traffic: {
        type: 'read',
        rps: 50,
        avgResponseSizeMB: 1.8, // Weighted average (90% images × 2MB + 10% HTML × 0.05MB)
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS (NFR-P) ==========
    {
      name: 'Normal Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'System handles typical daily traffic (2000 reads/sec) with low latency and stays within budget.',
      traffic: {
        type: 'read',
        rps: 2000,
        avgResponseSizeMB: 1.8, // 90% images, 10% HTML
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 500,
        maxErrorRate: 0.01,
        maxMonthlyCost: 300,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'cdn', config: { enabled: true, cacheHitRatio: 0.95 } },
          { type: 's3', config: { storageSizeGB: 500 } },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'cdn' },
          { from: 'cdn', to: 's3' },
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This solution handles 2000 RPS efficiently with CDN:

**Architecture:**
- CDN serves 90% of traffic (images) with 95% hit ratio
- S3 stores all images (500GB)
- App Server serves HTML pages (10% of traffic)
- PostgreSQL stores blog post metadata

**Why it works:**
- CDN absorbs 95% of image requests (~1,710 RPS)
- Only 90 RPS hit S3 (cache misses)
- App servers handle 200 RPS HTML requests
- Low latency (~20-50ms p99) due to edge caching
- Cost ~$280/month (within $300 budget)

**Key settings:**
- CDN: 95% hit ratio, edge locations worldwide
- S3: 500GB storage for high-res images
- App Server: 1 instance sufficient for HTML traffic`,
      },
    },
    {
      name: 'Peak Hour Load',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'During peak hours (lunch time), traffic increases to 4000 reads/sec. System must maintain low latency.',
      traffic: {
        type: 'read',
        rps: 4000,
        avgResponseSizeMB: 1.8,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 600,
        maxErrorRate: 0.01,
        maxMonthlyCost: 400,
      },
    },

    // ========== SCALABILITY REQUIREMENTS (NFR-S) ==========
    {
      name: 'Viral Post Spike (5x traffic)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'A blog post goes viral on social media, causing 5x normal traffic (10,000 reads/sec). System must handle the spike without significant degradation.',
      traffic: {
        type: 'read',
        rps: 10000,
        avgResponseSizeMB: 1.8,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 1000,
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'cdn', config: { enabled: true, cacheHitRatio: 0.98 } },
          { type: 's3', config: { storageSizeGB: 500 } },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 100, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'cdn' },
          { from: 'cdn', to: 's3' },
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This solution handles viral traffic (10,000 RPS):

**Scaled Architecture:**
- CDN with 98% hit ratio handles most image traffic
- 3 App Server instances behind load balancer
- Database with read replication

**Traffic Flow:**
- 9,000 RPS images: 98% CDN hits (8,820 RPS), 2% S3 (180 RPS)
- 1,000 RPS HTML: Load balanced across 3 app servers (~333 RPS each)
- Database replication handles increased HTML traffic

**Why CDN is critical:**
- Without CDN: All 9,000 image RPS would hit S3 or app servers
- With CDN: Only 180 RPS hit S3 (50x reduction!)
- CDN auto-scales to handle any traffic spike`,
      },
    },
    {
      name: 'Image-Heavy Load',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: 'Users share image-heavy posts (5-10 images each). System must handle 3000 reads/sec with large payloads.',
      traffic: {
        type: 'read',
        rps: 3000,
        avgResponseSizeMB: 2, // Higher due to multiple images per request
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 600,
        maxErrorRate: 0.02,
      },
    },
    {
      name: 'Sustained High Load',
      type: 'scalability',
      requirement: 'NFR-S3',
      description: 'Blog featured on popular news site causes sustained high traffic of 5000 reads/sec for 30 minutes.',
      traffic: {
        type: 'read',
        rps: 5000,
        avgResponseSizeMB: 1.8,
      },
      duration: 300, // 5 minutes
      passCriteria: {
        maxP99Latency: 800,
        maxErrorRate: 0.03,
        minAvailability: 0.99,
      },
    },

    // ========== COST OPTIMIZATION (NFR-C) ==========
    {
      name: 'CDN Cost Validation',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Optimize costs for high bandwidth workload. Without CDN, S3 data transfer costs would exceed $1,000/month. CDN must reduce costs significantly.',
      traffic: {
        type: 'read',
        rps: 5000,
        avgResponseSizeMB: 2, // 2MB per image
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100, // CDN needed to hit this
        maxMonthlyCost: 400, // S3 alone would cost ~$1,200/month!
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'cdn', config: { enabled: true, cacheHitRatio: 0.95 } },
          { type: 's3', config: { storageSizeGB: 500 } },
        ],
        connections: [
          { from: 'client', to: 'cdn' },
          { from: 'cdn', to: 's3' },
        ],
        explanation: `This test demonstrates **why CDN is essential** for image-heavy content:

**Without CDN (S3 Direct):**
- Latency: 100ms (S3 base latency)
- Cost: ~$1,200/month
  - S3 storage: $11.50 (500GB × $0.023)
  - S3 data transfer: $1,170 (13,000 GB × $0.09/GB)
  - Total bandwidth: 5000 RPS × 2MB × 2.6M sec/month = 26TB/month
- FAILS cost and latency requirements!

**With CDN + S3:**
- Latency: ~10ms average
  - 95% hit CDN edge (5ms)
  - 5% hit S3 (100ms)
  - Average: 0.95 × 5ms + 0.05 × 100ms = 9.75ms ✅
- Cost: ~$280/month
  - S3 storage: $11.50
  - S3 data transfer: $58.50 (only 5% of traffic = 1.3TB)
  - CDN transfer: $260 (26TB × $0.01/GB)
  - CDN is 9x cheaper than S3 transfer!
- PASSES both requirements! ✅

**Key Insight:**
- CDN reduces latency by 10x (100ms → 10ms)
- CDN reduces cost by 4x ($1,200 → $280)
- The more traffic, the more valuable CDN becomes

**When is CDN overkill?**
- Low traffic (<100 RPS) - CDN costs more than it saves
- Dynamic content - can't cache, so no benefit
- Already using app servers to serve files - need CDN + S3 migration`,
      },
    },
    {
      name: 'Budget Optimization',
      type: 'cost',
      requirement: 'NFR-C2',
      description: 'Reduce infrastructure costs to under $200/month while maintaining 1000 RPS and acceptable latency.',
      traffic: {
        type: 'read',
        rps: 1000,
        avgResponseSizeMB: 1.8,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 400,
        maxErrorRate: 0.01,
        maxMonthlyCost: 200,
        minAvailability: 0.99,
      },
    },

    // ========== RELIABILITY REQUIREMENTS (NFR-R) ==========
    {
      name: 'S3 Region Outage',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'S3 bucket in primary region becomes unavailable at second 20. System must failover to CDN cache and maintain availability.',
      traffic: {
        type: 'read',
        rps: 2000,
        avgResponseSizeMB: 1.8,
      },
      duration: 60,
      failureInjection: {
        type: 'db_crash', // Reusing for S3 outage
        atSecond: 20,
      },
      passCriteria: {
        maxP99Latency: 600,
        maxErrorRate: 0.1, // Some errors acceptable during outage
        minAvailability: 0.95, // 95% availability even during outage
      },
    },
    {
      name: 'CDN Cache Purge',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'CDN cache is purged at second 15 (e.g., content update). System must handle increased origin traffic as cache rebuilds.',
      traffic: {
        type: 'read',
        rps: 3000,
        avgResponseSizeMB: 1.8,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_flush',
        atSecond: 15,
      },
      passCriteria: {
        maxP99Latency: 800,
        maxErrorRate: 0.05,
        minAvailability: 0.98,
      },
    },
  ],

  learningObjectives: [
    'Learn when to use CDN for static content',
    'Understand S3 vs app servers for file storage',
    'Design for cost-efficiency with high bandwidth',
    'Handle traffic spikes from viral content',
    'Optimize for image-heavy workloads',
  ],

  hints: [
    {
      trigger: 'test_failed:Normal Load',
      message: `💡 Your design is too expensive or slow for serving images.

This is a common problem when serving images from app servers!

Consider:
1. Store images in S3 (cheap storage, $0.023/GB vs app servers)
2. Add a CDN to cache images at edge locations (5ms vs 100ms)
3. Let app servers only serve HTML pages

For a food blog, images are 90% of traffic but static content - perfect for CDN!`,
    },
    {
      trigger: 'cost_exceeded',
      message: `💡 Your design exceeds the $300/month budget.

Common cost mistakes:
1. Using too many app servers to serve static images ($100/server)
2. Not using CDN (S3 alone has 100ms latency, requires more app instances)
3. Over-provisioning database for a read-only blog

Hint: CDN ($20) + S3 ($10) + 1 App Server ($100) = $130/month`,
    },
    {
      trigger: 'test_failed:Viral Post Spike',
      message: `💡 Your system can't handle 5x traffic spike.

Without CDN:
- All traffic hits your app servers or S3
- App servers saturate quickly
- S3 charges per request (expensive at high volume)

With CDN:
- 95% of requests served from edge (cached)
- Only 5% hit origin (S3)
- Auto-scales to handle any traffic spike

CDN is essential for viral content!`,
    },
  ],
};
