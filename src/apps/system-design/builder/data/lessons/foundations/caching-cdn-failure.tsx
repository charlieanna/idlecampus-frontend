import type { SystemDesignLesson } from '../../../types/lesson';

export const cachingCdnFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-caching-cdn-failure',
  slug: 'caching-and-cdn-failures',
  title: 'Caching Strategies & CDN — Failures & Safe Patterns',
  description:
    'Cache-aside, write-through, write-behind; CDN request flow; and what to do during cache stampedes, cold starts, invalidations, and CDN outages.',
  difficulty: 'beginner',
  estimatedMinutes: 45,
  category: 'patterns',
  tags: ['cache', 'cdn', 'stale-while-revalidate', 'dogpile', 'herd', 'invalidation', 'shield'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 2,
  learningObjectives: [
    'Pick correct caching strategy for read/write workloads',
    'Prevent dogpiles/thundering herds and handle invalidations safely',
    'Design CDN fallbacks and shield architectures',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Overview: Caching Strategies and CDN Basics',
      content: {
        markdown: `
### Caching strategies
- Cache-aside (lazy): app reads DB → fills cache on miss
- Write-through: write to cache then DB (stronger read freshness)
- Write-behind: write cache, flush to DB async (risk if cache loss)
- Stale-while-revalidate: serve stale, refresh in background

### CDN basics
- POPs, edge cache, origin, origin shield
- TTLs, cache keys, purges/invalidation
        `,
      },
    },
    {
      id: 'failure-modes',
      type: 'concept',
      title: 'Common Failure Modes',
      content: {
        markdown: `
### What goes wrong
- Cache stampede (dogpile): many concurrent misses overwhelm origin
- Incorrect keys/headers → low hit ratio, origin overload
- Invalidation races: users see stale or inconsistent content
- CDN POP or provider partial outage
- Origin overload after regional traffic shift
        `,
      },
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Prevention
- **Single-flight** (request coalescing) per key to avoid dogpile
- **Soft TTL + SWR**: serve stale for short window while refreshing
- **Backpressure**: cap concurrent misses to origin, drop optional content
- **Tiered cache**: local L1 + distributed L2 + CDN shield
- **Idempotent invalidation** with versioned URLs (e.g., content hash)

### Incident handling
- Raise TTLs temporarily to reduce origin load
- Serve stale on CDN errors (stale-if-error)
- Route around bad POPs; multi-CDN if critical
- Throttle invalidations; use versioned assets instead of global purge
        `,
      },
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          id: 'q1',
          question: 'Best technique to prevent a cache stampede?',
          type: 'multiple_choice',
          options: ['Shorter TTLs', 'Single-flight per key', 'Bigger instances', 'Disable cache'],
          correctAnswer: 'Single-flight per key',
          explanation: 'Coalescing prevents many requests from hitting origin at once.',
        },
        {
          id: 'q2',
          question: 'To roll out new static assets safely you should:',
          type: 'multiple_choice',
          options: ['Global purge', 'Versioned URLs (hashing)', 'Disable CDN', 'Zero TTL'],
          correctAnswer: 'Versioned URLs (hashing)',
          explanation: 'Versioned URLs avoid global purge and prevent stale reads.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


