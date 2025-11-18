/**
 * Microservices TinyURL Challenge
 * Demonstrates API-to-server routing and microservices architecture
 */

import { Challenge } from '../types/testCase';

export const microservicesTinyUrlChallenge: Challenge = {
  id: 'microservices-tinyurl',
  title: 'TinyURL with Microservices',
  description: 'Design a URL shortening service using microservices architecture with separated read/write services',
  difficulty: 'medium',
  estimatedTime: '45 minutes',
  category: 'E-commerce',
  tier: 3,

  requirements: {
    traffic: '100K RPS with 90/10 read/write ratio',
    latency: 'P99 < 100ms for reads, < 200ms for writes',
    availability: '99.99%',
    budget: '$50K/month',
  },

  availableComponents: [
    'client','all'],

  testCases: [
    {
      name: 'Separated Read/Write Services',
      description: 'Test with read-heavy traffic to verify CQRS pattern',
      totalRps: 10000,
      readRps: 9000,
      writeRps: 1000,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.001,
        maxMonthlyCost: 50000,
      },
    },
    {
      name: 'Write Service Isolation',
      description: 'Heavy write burst should not affect read performance',
      totalRps: 15000,
      readRps: 5000,
      writeRps: 10000,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.01,
        maxMonthlyCost: 50000,
      },
    },
    {
      name: 'Service Failure Resilience',
      description: 'System should handle failure of individual services',
      totalRps: 8000,
      readRps: 7000,
      writeRps: 1000,
      failureScenario: {
        componentType: 'app_server',
        failureRate: 0.5,
        duration: 30,
      },
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.05,
        maxMonthlyCost: 50000,
      },
    },
  ],

  learningObjectives: [
    'Implement CQRS pattern with separate read/write services',
    'Configure API routing for microservices',
    'Optimize for different traffic patterns',
    'Handle service isolation and resilience',
  ],

  hints: [
    'Create separate app servers for read and write operations',
    'Assign "GET /api/v1/urls/*" to read service',
    'Assign "POST /api/v1/urls" to write service',
    'Consider using cache for read-heavy workload',
    'Scale read and write services independently',
  ],

  referenceSolution: {
    description: 'Microservices architecture with separated read/write services',
    components: [
      {
        type: 'load_balancer',
        count: 1,
        config: {
          algorithm: 'round-robin',
        },
      },
      {
        type: 'app_server',
        count: 5,
        config: {
          instanceType: 'm5.large',
          serviceName: 'url-reader',
          handledAPIs: ['GET /api/v1/urls/*', 'GET /api/v1/stats/*'],
        },
      },
      {
        type: 'app_server',
        count: 2,
        config: {
          instanceType: 'm5.xlarge',
          serviceName: 'url-writer',
          handledAPIs: ['POST /api/v1/urls', 'PUT /api/v1/urls/*', 'DELETE /api/v1/urls/*'],
        },
      },
      {
        type: 'cache',
        count: 1,
        config: {
          instanceType: 'cache.m5.large',
          engine: 'redis',
        },
      },
      {
        type: 'database',
        count: 1,
        config: {
          instanceType: 'db.m5.xlarge',
          engine: 'postgresql',
          replicas: 3,
          replicationStrategy: 'single-leader',
        },
      },
    ],
    estimatedCost: 35000,
    expectedLatency: {
      p50: 20,
      p99: 80,
    },
  },

  pythonStarterCode: `# URL Reader Service Code
# Handles: GET /api/v1/urls/*

def expand(short_code):
    """Expand a short URL to its original form"""
    # Check cache first
    cached = context.cache.get(short_code)
    if cached:
        return cached

    # Fallback to database
    long_url = context.db.get(short_code)

    if long_url:
        # Warm cache for next request
        context.cache.set(short_code, long_url, ttl=3600)

    return long_url

def get_stats(short_code):
    """Get statistics for a short URL"""
    # Implementation for stats
    return {
        "clicks": context.db.get(f"stats:{short_code}:clicks") or 0,
        "created_at": context.db.get(f"stats:{short_code}:created")
    }

# ===== URL Writer Service Code =====
# Handles: POST /api/v1/urls

def shorten(long_url):
    """Create a short URL"""
    # Check if URL already exists
    existing = context.db.find_by_url(long_url)
    if existing:
        return existing['short_code']

    # Generate new short code
    short_code = generate_short_code()

    # Store in database
    context.db.insert(short_code, long_url)

    # Invalidate cache if needed
    context.cache.delete(short_code)

    return short_code

def generate_short_code():
    """Generate a unique short code"""
    import hashlib
    import time

    # Use counter for uniqueness
    counter = context.db.get_next_id()

    # Convert to base62
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    result = []

    while counter > 0:
        result.append(chars[counter % 62])
        counter //= 62

    return ''.join(result) or 'a'
`,
};