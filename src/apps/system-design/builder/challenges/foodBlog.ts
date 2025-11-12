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
    {
      name: 'Normal Load',
      traffic: {
        type: 'read',
        rps: 2000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 500,
        maxErrorRate: 0.01,
        maxMonthlyCost: 300,
      },
    },
    {
      name: 'Viral Post Spike (5x traffic)',
      traffic: {
        type: 'read',
        rps: 10000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 1000,
        maxErrorRate: 0.05,
      },
    },
    {
      name: 'Image-Heavy Load',
      traffic: {
        type: 'read',
        rps: 3000, // Higher image traffic
        avgResponseSizeMB: 2, // Large images
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 600,
        maxErrorRate: 0.02,
      },
    },
    {
      name: 'CDN Cost Validation (Without CDN = Expensive)',
      traffic: {
        type: 'read',
        rps: 5000, // High image traffic
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
          { type: 'cdn', config: { enabled: true } },
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
