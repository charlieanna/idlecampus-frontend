import { Challenge } from '../types/testCase';

export const tinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: `Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes.

Users can then use these short codes to redirect to the original URLs.

Example:
- POST /shorten with https://example.com/very/long/url → returns abc123
- GET /abc123 → redirects to https://example.com/very/long/url`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes should be unique',
    ],
    traffic: '1,000 RPS reads (redirects), 100 RPS writes (create short URLs)',
    latency: 'p99 < 100ms for redirects',
    availability: '99.9% uptime',
    budget: '$500/month',
  },

  availableComponents: ['load_balancer', 'app_server', 'redis', 'postgresql'],

  testCases: [
    {
      name: 'Normal Load',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91, // 1000 reads, 100 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 500,
      },
    },
    {
      name: 'Read Spike (5x)',
      traffic: {
        type: 'mixed',
        rps: 5100,
        readRatio: 0.98, // 5000 reads, 100 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.05,
      },
    },
    {
      name: 'Cache Flush',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_flush',
        atSecond: 15,
      },
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
      },
    },
  ],

  learningObjectives: [
    'Understand read-heavy vs write-heavy workloads',
    'Design caching strategies for high-read workloads',
    'Learn about cache hit ratios and their impact',
    'Practice capacity planning for databases',
    'Balance cost vs performance tradeoffs',
  ],

  hints: [
    {
      trigger: 'test_failed:Read Spike',
      message: `💡 Your database is saturated during the traffic spike.

This is common in read-heavy systems. Consider:
1. Adding a cache (Redis) to absorb read traffic
2. Increasing cache hit ratio (larger cache, longer TTL)
3. Sizing database to handle cache miss scenarios

For Tiny URL, most URLs are accessed multiple times, so caching is very effective!`,
    },
    {
      trigger: 'cost_exceeded',
      message: `💡 Your design exceeds the budget.

Ways to reduce cost:
1. Reduce app server instances if over-provisioned
2. Optimize cache size (4GB is usually enough)
3. Let cache absorb most reads to reduce DB costs

Remember: Meet requirements at minimum cost!`,
    },
  ],
};
