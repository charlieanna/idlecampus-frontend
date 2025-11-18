import { Challenge } from '../../types/testCase';

export const logAggregationChallenge: Challenge = {
  id: 'log_aggregation',
  title: 'Log Aggregation System (Splunk / Google Cloud Logging)',
  difficulty: 'advanced',
  description: `Design an internal log aggregation system for collecting logs from thousands of services.

Engineers can:
- Search logs by service, level, time range, keywords
- View logs in real-time (live tail)
- Set up alerts on log patterns (ERROR count > 100/min)
- Analyze log trends (error rate over time)

Example:
- Service "api-server" logs: [INFO] Request /api/users took 45ms
- Aggregate across 100 instances
- Search: "service:api-server level:ERROR time:last_hour"
- Alert: ERROR count > 100 in last 5 minutes

Key challenges:
- High volume (1M logs/sec from 1000+ services)
- Fast search (p99 < 3s for queries)
- Log retention (hot: 7 days, warm: 30 days, cold: 1 year)
- PII redaction (scrub sensitive data)`,

  requirements: {
    functional: [
      'Ingest logs from all services (1M logs/sec)',
      'Structured logging (JSON format)',
      'Full-text search with filters',
      'Live tail (real-time log streaming)',
      'PII redaction (auto-detect and scrub)',
      'Multi-tier retention (hot/warm/cold)',
    ],
    traffic: '1M logs/sec ingestion, 1000 queries/min',
    latency: 'p99 < 100ms for ingestion, < 3s for search',
    availability: '99.9% uptime',
    budget: '$15,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Log Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Ingest logs from services and store for search.',
      traffic: {
        type: 'write',
        rps: 1000, // 1000 logs/sec
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 100,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'message_queue', config: { maxThroughput: 100000 } },
          { type: 'postgresql', config: { readCapacity: 5000, writeCapacity: 10000 } },
          { type: 's3', config: { storageSizeGB: 100000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Log ingestion architecture:

**Components:**
- Message Queue: Buffer logs (handle traffic spikes)
- PostgreSQL: Recent logs (last 7 days) for fast search
- S3: Historical logs (7+ days) in compressed format

**Ingestion flow:**
1. Service logs: {"timestamp": "2024-01-15T10:30:00Z", "level": "ERROR", "message": "Failed to connect", "service": "api-server"}
2. Send to log collector (app_server)
3. Publish to message queue (async, non-blocking)
4. Background worker pulls from queue
5. Write to PostgreSQL (hot storage)
6. Batch write to S3 (cold storage)

**Why message queue is critical:**
- Decouples services from log storage
- Services never block on logging!
- Handles traffic spikes (release deployments)
- Overhead: <1ms per log`,
      },
    },

    {
      name: 'High-Volume Log Ingestion',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Ingest 1M logs/sec during peak traffic.',
      traffic: {
        type: 'write',
        rps: 1000000, // 1M logs/sec!
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.05, // 5% drops acceptable during peak
        maxP99Latency: 100,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 50 } },
          { type: 'message_queue', config: { maxThroughput: 2000000 } },
          { type: 'postgresql', config: { readCapacity: 20000, writeCapacity: 50000 } },
          { type: 's3', config: { storageSizeGB: 100000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Scaling to 1M logs/sec:

**Volume calculation:**
- 1M logs/sec × 1 KB/log = 1 GB/sec
- 1 GB/sec × 3600 sec/hour = 3.6 TB/hour
- 3.6 TB/hour × 24 hours = 86 TB/day!

**Storage tiers:**

**Hot (PostgreSQL, 7 days):**
- 86 TB/day × 7 days = 602 TB
- Too expensive for PostgreSQL! ($10,000/month)
- Solution: Sample logs (keep 10%)
- Hot storage: 60 TB (~$1,000/month)

**Warm (S3, 7-30 days):**
- 86 TB/day × 23 days = 1,978 TB
- S3 cost: $45/TB/month = $89,010/month ❌
- Solution: Compress logs (10:1 ratio)
- Warm storage: 198 TB (~$4,554/month)

**Cold (S3 Glacier, 30+ days):**
- 86 TB/day × 335 days = 28,810 TB
- Compressed: 2,881 TB
- Glacier cost: $1/TB/month = $2,881/month

**Total storage cost: ~$8,435/month**

**Sampling strategy:**
- 100% of ERROR/WARN logs (critical for debugging)
- 10% of INFO logs (representative sample)
- 1% of DEBUG logs (too verbose)
- Effective rate: ~100K logs/sec to hot storage

**Batching for efficiency:**
- Buffer 10,000 logs in memory
- Bulk insert to PostgreSQL every 10 sec
- 100x fewer database transactions!`,
      },
    },

    {
      name: 'Log Search with Filters',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Search logs: service=api-server level=ERROR time=last_hour.',
      traffic: {
        type: 'read',
        rps: 20, // 1000 queries/min = 16/sec
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 3000, // 3 seconds
        maxErrorRate: 0.01,
      },
    },

    {
      name: 'PII Redaction',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Auto-detect and redact PII (emails, credit cards, SSNs).',
      traffic: {
        type: 'write',
        rps: 10000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        piiRedacted: true,
      },
    },

    {
      name: 'Live Tail',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Stream logs in real-time as they arrive (WebSocket).',
      traffic: {
        type: 'read',
        rps: 100, // 100 engineers tailing logs
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        realTimeDelay: 5, // < 5 sec delay
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Message Queue Backpressure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Massive log spike (10x). System drops logs gracefully without crashing services.',
      traffic: {
        type: 'write',
        rps: 10000000, // 10M logs/sec!
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.9, // 90% drops acceptable (observability, not critical)
        minAvailability: 0.50,
      },
    },
  ],

  learningObjectives: [
    'Design high-volume log ingestion (1M logs/sec)',
    'Multi-tier storage (hot/warm/cold) for cost optimization',
    'Sampling strategies for cost control',
    'PII detection and redaction',
    'Graceful degradation under extreme load',
  ],

  hints: [
    {
      trigger: 'test_failed:High-Volume Log Ingestion',
      message: `💡 Storage costs are astronomical!

**Problem:**
- 1M logs/sec × 1 KB = 1 GB/sec = 86 TB/day
- PostgreSQL: $10,000/month for 86 TB ❌
- 30 days: 2,580 TB = $300,000/month ❌❌

**Solution 1 - Multi-tier storage:**

**Hot (PostgreSQL, 7 days):**
- Fast search (<3 sec)
- Expensive ($100/TB/month)
- Keep only recent logs

**Warm (S3, 7-30 days):**
- Medium search (~30 sec)
- Cheap ($23/TB/month)
- Compressed logs

**Cold (S3 Glacier, 30+ days):**
- Slow search (minutes to hours)
- Very cheap ($1/TB/month)
- Archive for compliance

**Solution 2 - Sampling:**
- 100% ERROR/WARN (critical!)
- 10% INFO (representative)
- 1% DEBUG (too verbose)

**Combined savings:**
Without optimization: $300,000/month ❌
With hot/warm/cold + sampling: $8,435/month ✅
97% cost reduction!`,
    },
    {
      trigger: 'test_failed:PII Redaction',
      message: `💡 PII is leaking into logs!

**Problem:**
Log: "User email: john@example.com purchased item"
→ Stored as-is → GDPR violation ❌

**Solution - Auto-redaction:**

**Regex patterns for PII:**
- Email: \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b
- SSN: \\b\\d{3}-\\d{2}-\\d{4}\\b
- Credit card: \\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b

**Redaction:**
Before: "User email: john@example.com purchased item"
After: "User email: [EMAIL_REDACTED] purchased item"

**Implementation:**
def redact_pii(log_message):
    # Email
    log = re.sub(r'\\b[\\w._%+-]+@[\\w.-]+\\.[A-Z|a-z]{2,}\\b',
                 '[EMAIL_REDACTED]',
                 log)

    # SSN
    log = re.sub(r'\\b\\d{3}-\\d{2}-\\d{4}\\b',
                 '[SSN_REDACTED]',
                 log)

    # Credit card
    log = re.sub(r'\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b',
                 '[CC_REDACTED]',
                 log)

    return log

**Apply redaction before storing!**`,
    },
    {
      trigger: 'test_failed:Message Queue Backpressure',
      message: `💡 Log spike is crashing application services!

**Problem:**
- 10M logs/sec (10x spike)
- Message queue fills up
- Services block waiting to publish logs
- Application requests slow down ❌
- Cascading failure!

**Solution - Graceful degradation:**

**BAD approach - Block services:** ❌
service.log("INFO: ...", timeout=30_000)  # Block up to 30 sec
→ Application becomes slow
→ All requests impacted

**GOOD approach - Drop logs:** ✅
try:
    service.log("INFO: ...", timeout=10)  # 10ms timeout
except TimeoutError:
    metrics.incr('logs_dropped')
    # Don't crash! Continue serving requests

**Key principle:**
For observability tools:
- Losing data is acceptable ⚠️
- Impacting production is NOT ❌

**Better to have:**
- 10% of logs + 100% availability ✅
vs
- 100% of logs + 0% availability ❌

**Logging should be invisible to production!**`,
    },
  ],

  pythonTemplate: `# Log Aggregation System
# Implement high-volume ingestion and search

import re
import json
from typing import List, Dict

# PII regex patterns
EMAIL_PATTERN = re.compile(r'\\b[\\w._%+-]+@[\\w.-]+\\.[A-Z|a-z]{2,}\\b')
SSN_PATTERN = re.compile(r'\\b\\d{3}-\\d{2}-\\d{4}\\b')
CC_PATTERN = re.compile(r'\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b')


def redact_pii(message: str) -> str:
    """
    Redact PII from log message.

    Args:
        message: Log message

    Returns:
        Redacted message

    Requirements:
    - Replace emails with [EMAIL_REDACTED]
    - Replace SSNs with [SSN_REDACTED]
    - Replace credit cards with [CC_REDACTED]
    """
    message = EMAIL_PATTERN.sub('[EMAIL_REDACTED]', message)
    message = SSN_PATTERN.sub('[SSN_REDACTED]', message)
    message = CC_PATTERN.sub('[CC_REDACTED]', message)

    return message


def should_sample_log(log_level: str) -> bool:
    """
    Decide whether to sample this log (for cost control).

    Args:
        log_level: ERROR, WARN, INFO, DEBUG

    Returns:
        True if should keep log

    Requirements:
    - 100% of ERROR/WARN
    - 10% of INFO
    - 1% of DEBUG
    """
    import random

    if log_level in ['ERROR', 'WARN']:
        return True
    elif log_level == 'INFO':
        return random.random() < 0.10
    elif log_level == 'DEBUG':
        return random.random() < 0.01

    return False


def ingest_log(log: dict, context: dict):
    """
    Ingest log with PII redaction and sampling (async).

    Args:
        log: {
            "timestamp": "2024-01-15T10:30:00Z",
            "level": "ERROR",
            "message": "Failed to connect to john@example.com",
            "service": "api-server"
        }
        context: Shared context

    Requirements:
    - Redact PII from message
    - Apply sampling based on log level
    - Publish to message queue (async, non-blocking!)
    - If queue full (timeout), drop log gracefully
    """
    # Redact PII
    log['message'] = redact_pii(log['message'])

    # Sampling
    if not should_sample_log(log['level']):
        context['metrics'].incr('logs_sampled_out')
        return

    # Publish to queue (with timeout!)
    try:
        context['queue'].publish(log, timeout=10)  # 10ms timeout
    except TimeoutError:
        context['metrics'].incr('logs_dropped')
        # Don't crash! Drop log gracefully


def search_logs(query: dict, context: dict) -> List[dict]:
    """
    Search logs with filters.

    Args:
        query: {
            "service": "api-server",
            "level": "ERROR",
            "time_range": {"start": "2024-01-15T00:00:00Z", "end": "2024-01-15T23:59:59Z"},
            "keyword": "timeout"
        }
        context: Shared context

    Returns:
        List of matching log entries

    Requirements:
    - Query PostgreSQL (hot storage, last 7 days)
    - Apply filters (service, level, time range, keyword)
    - Full-text search on message
    - Return top 1000 results
    - Complete in <3 seconds
    """
    # Your code here
    return []


# Worker: Process logs from queue
def log_processor_worker(context: dict):
    """
    Pull logs from queue and store them.

    Requirements:
    - Pull log from message queue
    - Batch logs (10,000 logs or 10 seconds, whichever first)
    - Bulk insert to PostgreSQL
    - Async write to S3 (compressed, for cold storage)
    - Ack messages
    """
    batch = []
    last_flush = time.time()

    while True:
        # Pull log
        message = context['queue'].receive(timeout=1)

        if message:
            batch.append(message['log'])

        # Flush conditions
        should_flush = (
            len(batch) >= 10000 or  # Batch size
            (time.time() - last_flush) >= 10  # Time window
        )

        if should_flush and batch:
            # Bulk insert to PostgreSQL
            # Your code here

            # Async write to S3
            # Your code here

            batch = []
            last_flush = time.time()


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle log API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /logs - Ingest log
    if method == 'POST' and path == '/logs':
        log = body
        ingest_log(log, context)
        return {'status': 202, 'body': {'accepted': True}}

    # GET /logs/search - Search logs
    elif method == 'GET' and path == '/logs/search':
        query = request.get('query', {})
        results = search_logs(query, context)
        return {'status': 200, 'body': {'logs': results}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
