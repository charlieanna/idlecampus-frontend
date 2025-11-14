/**
 * TinyURL Challenge - Tier 1 (Simple)
 *
 * Students implement the URL shortening algorithm
 * Their code performance directly impacts simulation results
 */

import { TieredChallenge, RequiredImplementation } from '../../types/challengeTiers';
import { tinyUrlCodeChallenges } from '../code/tinyUrlChallenges';

/**
 * App server Python template for TinyURL
 */
const APP_SERVER_TEMPLATE = `"""
TinyURL App Server Implementation

Your task: Implement the URL shortening and redirect logic
The simulation will measure your code's actual performance!

Available context methods:
- context['db'].get(key) - Get value from database
- context['db'].insert(key, value) - Insert into database
- context['db'].exists(key) - Check if key exists
- context['db'].get_next_id() - Get auto-incrementing ID
- context['cache'].get(key) - Get from cache (if available)
- context['cache'].set(key, value, ttl) - Set in cache
"""

import random
import string
import hashlib

def shorten(long_url: str, context: dict) -> str:
    """
    Generate a short code for a long URL.

    Args:
        long_url: The URL to shorten
        context: Available services (db, cache, queue)

    Returns:
        short_code: The generated short code

    Performance target: < 50ms per request
    """
    # TODO: Implement your URL shortening algorithm

    # ❌ STARTER CODE (Bad performance - will fail tests!)
    # This checks for collisions in a loop - SLOW!
    chars = string.ascii_letters + string.digits
    code = ''.join(random.choices(chars, k=6))

    while context['db'].exists(code):
        code = ''.join(random.choices(chars, k=6))

    context['db'].insert(code, long_url)
    return code

    # ✅ BETTER APPROACH (Uncomment to improve):
    # id = context['db'].get_next_id()
    # code = base62_encode(id)
    # context['db'].insert(code, long_url)
    # return code


def redirect(short_code: str, context: dict) -> str:
    """
    Get the original URL from a short code.

    Args:
        short_code: The short code to expand
        context: Available services

    Returns:
        long_url: The original URL, or None if not found

    Performance target: < 10ms per request
    """
    # Check cache first for better performance
    if 'cache' in context:
        cached_url = context['cache'].get(short_code)
        if cached_url:
            return cached_url

    # Cache miss - check database
    long_url = context['db'].get(short_code)

    # Warm the cache for next time
    if long_url and 'cache' in context:
        context['cache'].set(short_code, long_url, ttl=3600)

    return long_url


def base62_encode(num: int) -> str:
    """Helper function: Convert number to base62 string"""
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if num == 0:
        return charset[0]

    result = ''
    while num > 0:
        result = charset[num % 62] + result
        num //= 62
    return result
`;

/**
 * Worker Python template (optional)
 */
const WORKER_TEMPLATE = `"""
TinyURL Worker Implementation (Optional)

Only needed if your system design uses a message queue.
Worker processes URL creation messages from the queue.

Available context methods:
- context['db'] - Database client
- context['cache'] - Redis cache
"""

def process_message(message: dict, context: dict) -> bool:
    """
    Process a URL creation message from the queue.

    Args:
        message: {'short_code': 'abc123', 'long_url': '...', 'timestamp': ...}
        context: Available services

    Returns:
        True if successful, False to retry

    Performance: Can be slower than app_server (not user-facing)
    """
    short_code = message.get('short_code')
    long_url = message.get('long_url')

    if not short_code or not long_url:
        return False  # Invalid message

    # Option 1: Simple write (default)
    context['db'].insert(short_code, long_url)

    # Option 2: With validation (uncomment for better reliability)
    # import requests
    # try:
    #     response = requests.head(long_url, timeout=5)
    #     if response.status_code >= 400:
    #         return False  # URL not reachable
    # except:
    #     return False  # Retry later

    # context['db'].insert(short_code, long_url)

    # Pre-warm cache
    if 'cache' in context:
        context['cache'].set(short_code, long_url, ttl=7200)

    return True
`;

/**
 * TinyURL Tier 1 Challenge Definition
 */
export const tinyUrlTieredChallenge: TieredChallenge = {
  id: 'tiny_url_tiered',
  title: 'TinyURL Shortener (Tier 1)',
  difficulty: 'beginner',
  implementationTier: 'simple',

  description: `Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes.

**Your Task:**
1. Design the system architecture (drag & drop components)
2. Implement the URL shortening algorithm (Python code)
3. Your code's performance will be measured and impact the simulation!

Example:
- POST /shorten with https://example.com/very/long/url → returns abc123
- GET /abc123 → redirects to https://example.com/very/long/url`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes should be unique',
      'Handle 100 URL creations per second',
    ],
    traffic: '1,000 RPS reads (redirects), 100 RPS writes (create short URLs)',
    latency: 'p99 < 100ms for redirects',
    availability: '99.9% uptime',
    budget: '$500/month',
  },

  // Components available for system design
  availableComponents: [
    'load_balancer',
    'app_server',
    'worker',
    'postgresql',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ],

  // Tier 1: Students must implement these functions
  requiredImplementations: [
    {
      componentType: 'app_server',
      fileName: 'app_server.py',
      template: APP_SERVER_TEMPLATE,
      functions: [
        {
          name: 'shorten',
          description: 'Generate a short code from a long URL',
          signature: 'shorten(long_url: str, context: dict) -> str',
          performanceTarget: '< 50ms per request',
        },
        {
          name: 'redirect',
          description: 'Get the original URL from a short code',
          signature: 'redirect(short_code: str, context: dict) -> str',
          performanceTarget: '< 10ms per request',
        },
      ],
      contextAPI: `
Available in context dict:
- context['db']: Database client
  - .get(key) -> value
  - .insert(key, value)
  - .exists(key) -> bool
  - .get_next_id() -> int

- context['cache']: Redis client (if in your design)
  - .get(key) -> value
  - .set(key, value, ttl=3600)

- context['queue']: Message queue (if in your design)
  - .enqueue(message)
      `,
    },
    {
      componentType: 'worker',
      fileName: 'worker.py',
      template: WORKER_TEMPLATE,
      functions: [
        {
          name: 'process_message',
          description: 'Process URL creation message from queue',
          signature: 'process_message(message: dict, context: dict) -> bool',
          performanceTarget: 'Can be slower (not user-facing)',
        },
      ],
    },
  ],

  // Component behaviors for simulation
  componentBehaviors: {
    appServer: {
      operations: {
        create: {
          baseLatency: 10, // Will be overridden by actual Python execution
          cpuIntensive: true,
          ioIntensive: false,
        },
        read: {
          baseLatency: 5,
          cpuIntensive: false,
          ioIntensive: true,
        },
      },
    },
    worker: {
      behavior: 'validate_and_write',
      validations: ['url_reachable'],
      transformations: ['extract_metadata'],
    },
    database: {
      dataModel: 'relational',
      schema: {
        tables: [
          {
            name: 'urls',
            fields: [
              { name: 'short_code', type: 'varchar(10)', indexed: true },
              { name: 'long_url', type: 'text' },
              { name: 'created_at', type: 'timestamp', indexed: true },
              { name: 'click_count', type: 'integer' },
            ],
            primaryKey: 'short_code',
          },
        ],
        estimatedSize: '10M rows, 5GB',
      },
    },
  },

  // Benchmarking settings for Python code
  benchmarkSettings: {
    sampleSize: 100,
    warmupRequests: 10,
    timeoutMs: 5000,
  },

  // Test cases
  testCases: [
    {
      name: 'Basic Functionality',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System can create and redirect short URLs',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRps: 5,
        writeRps: 5,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'Normal Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle typical daily traffic with good performance',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100, // Your algorithm must be fast!
        maxErrorRate: 0.01,
        maxMonthlyCost: 500,
      },
    },
    {
      name: 'Write Spike (10x)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle sudden spike in URL creation requests',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRps: 1000,
        writeRps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.05,
      },
    },
  ],

  // Learning objectives
  learningObjectives: [
    'Implement efficient URL shortening algorithms',
    'Understand impact of algorithm choice on scalability',
    'Design systems to handle read-heavy workloads',
    'Use caching effectively for performance',
    'Handle write spikes with message queues',
  ],

  // Hints for students
  hints: [
    {
      trigger: 'test_failed:Normal Load',
      message: `💡 Your system is too slow!

Check your shorten() function:
- Are you checking for collisions in a loop? (SLOW!)
- Try using auto-increment IDs with base62 encoding (FAST!)

The simulation measures your actual code performance.`,
    },
    {
      trigger: 'test_failed:Write Spike',
      message: `💡 Database is overwhelmed during write spike!

Consider:
1. Add a message queue between app_server and database
2. Add worker component to process queue
3. This buffers the spike and prevents data loss`,
    },
    {
      trigger: 'high_latency',
      message: `⚠️ Your algorithm is slow!

Common issues:
- while context['db'].exists(code): ← O(n) collision checking!
- Use context['db'].get_next_id() instead ← O(1) guaranteed unique!`,
    },
  ],

  // Optional: Code challenges for deeper learning
  codeChallenges: tinyUrlCodeChallenges,

  // UI configuration
  showCodeEditor: true,
  showAlgorithmConfig: false,
};