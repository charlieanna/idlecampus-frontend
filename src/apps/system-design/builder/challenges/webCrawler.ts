import { Challenge } from '../types/testCase';

export const webCrawlerChallenge: Challenge = {
  id: 'web_crawler',
  title: 'Web Crawler',
  difficulty: 'intermediate',
  description: `Design a web crawler that discovers and indexes web pages while being polite and scalable.

The crawler should manage a URL frontier, fetch pages, respect basic politeness constraints, and store crawled content for downstream indexing.

Example:
- Worker pops URL from frontier → fetches page → extracts links → enqueues new URLs
- Persist crawled pages and metadata in storage for later search/indexing`,

  requirements: {
    functional: [
      'Maintain a URL frontier of pages to crawl',
      'Fetch and parse pages from the web',
      'Avoid re-crawling the same URL repeatedly',
      'Persist crawled content and metadata',
    ],
    traffic: '200 RPS (mix of page fetches and frontier operations)',
    latency: 'p99 < 500ms for frontier operations',
    availability: '99.9% uptime',
    budget: '$1,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'worker',
    'database',
    'cache',
    'message_queue',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
    {
      name: 'Basic Crawl Pipeline',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Crawler can fetch pages and store them in storage. Client can trigger crawl jobs that flow through app → worker → storage.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.3,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'worker', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'worker' },
          { from: 'worker', to: 'postgresql' },
        ],
        explanation: `Minimal viable crawler: app accepts crawl requests, worker fetches pages, database stores crawled content.`,
      },
    },
    {
      name: 'URL Frontier Management',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Crawler maintains a URL frontier so that pages are enqueued and dequeued correctly without losing work.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.5,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'Duplicate and Re-Crawl Control',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Crawler avoids re-crawling the same URL too frequently. Architecture should support deduplication (via DB or cache).',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.6,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0.01,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS (NFR-P) ==========
    {
      name: 'Steady Crawl Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Crawler sustains a steady throughput of 200 page fetches/sec with acceptable latency on frontier operations.',
      traffic: {
        type: 'mixed',
        rps: 200,
        readRatio: 0.4,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 500,
        maxErrorRate: 0.02,
        maxMonthlyCost: 1000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'worker', config: { instances: 4 } },
          { type: 'postgresql', config: { 
            readCapacity: 2000, 
            writeCapacity: 1000,
            replication: { enabled: true, replicas: 2, mode: 'async' } 
          } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
          { type: 'message_queue', config: { partitions: 3 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'worker', to: 'message_queue' },
          { from: 'worker', to: 'redis' },
          { from: 'worker', to: 'postgresql' },
        ],
        explanation: `App servers enqueue crawl jobs into message queue. Workers pull from queue, deduplicate via Redis, and persist to PostgreSQL.`,
      },
    },
    {
      name: 'Peak Crawl Burst',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'When a new domain is added, the crawler briefly spikes to 500 page fetches/sec. System should degrade gracefully and stay within cost limits.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.4,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 800,
        maxErrorRate: 0.05,
        maxMonthlyCost: 1500,
      },
    },

    // ========== SCALABILITY REQUIREMENTS (NFR-S) ==========
    {
      name: 'Many Domains Crawl',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Crawler handles many domains concurrently; architecture should scale horizontally using workers and queue partitions.',
      traffic: {
        type: 'mixed',
        rps: 800,
        readRatio: 0.4,
      },
      duration: 120,
      passCriteria: {
        maxP99Latency: 900,
        maxErrorRate: 0.05,
      },
    },

    // ========== RELIABILITY REQUIREMENTS (NFR-R) ==========
    {
      name: 'Database Failure During Crawl',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database crashes during a long crawl. System should failover to replica and avoid losing crawl progress.',
      traffic: {
        type: 'mixed',
        rps: 200,
        readRatio: 0.4,
      },
      duration: 120,
      failureInjection: {
        type: 'db_crash',
        atSecond: 30,
      },
      passCriteria: {
        minAvailability: 0.95,
        maxErrorRate: 0.1,
      },
    },
  ],

  learningObjectives: [
    'Understand crawling pipelines (frontier → fetch → parse → store)',
    'Design scalable worker-based architectures',
    'Balance queue, workers, and storage for throughput',
    'Handle failures without losing crawl progress',
  ],

  hints: [
    {
      trigger: 'test_failed:Steady Crawl Throughput',
      message: `💡 Your crawler is saturating the database or workers.

Consider:
1. Adding more worker instances to increase parallelism
2. Using a message queue to buffer crawl jobs
3. Adding Redis to avoid re-crawling the same URLs`,
    },
    {
      trigger: 'test_failed:Database Failure',
      message: `💡 Database is a single point of failure.

To improve reliability:
1. Enable replication for the database
2. Ensure workers can tolerate transient DB failures (retries, backoff)
3. Use message queue to avoid losing crawl jobs during failover`,
    },
  ],

  // Python template for crawler functionality (pure functions for learning)
  pythonTemplate: `"""
Web Crawler Implementation (Core Functions)

For this exercise, you will implement two pure functions:
- crawl_page:   parse HTML and extract links
- manage_frontier: compute next URLs to crawl

In a real system, these would be used inside workers that
read/write to the URL frontier, database, and cache.
"""

from typing import List, Dict, Set
from urllib.parse import urljoin
import re


def crawl_page(url: str, html: str) -> Dict:
    """
    Parse a page and extract links to crawl next.

    Args:
        url:  The URL of the current page (used to resolve relative links)
        html: The HTML content of the page as a string

    Returns:
        A dictionary with:
        - 'url': the original URL
        - 'status': HTTP-like status code (200 for success)
        - 'links': list of absolute URLs discovered on the page

    Requirements:
    - Extract href values from <a> tags
    - Normalize relative links using the page URL
    - Ignore non-http(s) links (e.g., mailto:, javascript:)
    - Do not include duplicate links
    """
    # TODO: Implement link extraction
    # Hints:
    # - Use regex or simple HTML parsing to find href="..."
    # - Use urllib.parse.urljoin(base, href) to resolve relative URLs
    # - Use a set to deduplicate links
    raise NotImplementedError


def manage_frontier(current_batch: List[str], seen_urls: Set[str]) -> List[str]:
    """
    Decide which URLs should be crawled next.

    Args:
        current_batch: List of candidate URLs discovered in this iteration
        seen_urls:     Set of URLs that have already been crawled

    Returns:
        A list of URLs to enqueue for crawling next.

    Requirements:
    - Only return URLs that are not in seen_urls
    - Do not return duplicates within the next batch
    - Keep the order stable (first valid URLs should appear first)
    """
    # TODO: Implement frontier management
    # Hints:
    # - Iterate over current_batch
    # - Skip URLs that are already in seen_urls
    # - Use a set to avoid duplicates within the returned list
    raise NotImplementedError
`,

  // Complete solution that passes ALL test cases
  solution: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 3 } },
      { type: 'message_queue', config: { maxThroughput: 5000 } },
      { type: 'redis', config: { memorySizeGB: 16 } },
      { type: 'postgresql', config: { 
        readCapacity: 2000, 
        writeCapacity: 1000,
        replication: { enabled: true, replicas: 2, mode: 'async' }
      } },
      { type: 's3', config: { storageSizeGB: 10000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
      { from: 'app_server', to: 's3' },
    ],
    explanation: `# Complete Solution for Web Crawler

## Architecture Components
- **client**: Crawler coordinator/scheduler
- **load_balancer**: Routes requests to available workers
- **app_server** (5 instances): Crawler workers (fetch, parse, extract)
- **message_queue** (10k throughput): URL frontier (queue of URLs to crawl)
- **redis** (32GB): Deduplication cache (seen URLs bloom filter)
- **postgresql** (2k read, 1k write): URL metadata, crawl status
- **s3** (10TB): Raw page content storage

## Data Flow
1. Client → App Server: Trigger crawl job
2. App Server → Message Queue: Enqueue seed URLs
3. Worker pops URL from queue
4. Worker → Redis: Check if URL seen (dedup)
5. Worker fetches page from web
6. Worker → S3: Store raw content
7. Worker → PostgreSQL: Save metadata
8. Worker → Message Queue: Enqueue discovered links

## Why This Works
This architecture handles:
- **200 RPS** of frontier operations efficiently
- **URL deduplication** via Redis bloom filter
- **Scalable storage** with S3 for billions of pages
- **Async processing** via message queue (decoupled)
- **Politeness** enforced by worker rate limiting

## Key Design Decisions
1. **Message queue as frontier** - handles backpressure, ordering
2. **Redis for dedup** - O(1) lookup for seen URLs
3. **S3 for content** - cheap, unlimited storage
4. **PostgreSQL for metadata** - queryable, indexed
5. **Multiple workers** - parallel crawling with scaling`,
  },
};
