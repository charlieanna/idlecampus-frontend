import { Challenge } from '../../types/testCase';

export const distributedTracingChallenge: Challenge = {
  id: 'distributed_tracing',
  title: 'Distributed Tracing System (Google Dapper / Jaeger)',
  difficulty: 'advanced',
  description: `Design an internal distributed tracing system for debugging microservices.

Engineers can:
- Track requests across 20+ microservices
- Identify latency bottlenecks (which service is slow?)
- Debug errors with full request context
- Search traces by attributes (user_id, endpoint, status)

Example trace:
API Gateway (50ms)
  → Auth Service (10ms)
  → Product Service (200ms) ← SLOW!
      → Database (180ms) ← ROOT CAUSE
  → Cart Service (30ms)

Key challenges:
- High volume (10M requests/day = 115 requests/sec × 10 spans = 1,150 spans/sec)
- Sampling (can't store 100% of traces - too expensive)
- Trace assembly (spans arrive out of order from different services)
- Low overhead (<1ms per span)`,

  requirements: {
    functional: [
      'Collect spans from all microservices',
      'Assemble complete traces from spans',
      'Search traces by attributes (latency, error, user_id)',
      'Visualize trace timeline (waterfall diagram)',
      'Sampling (1% for normal requests, 100% for errors)',
    ],
    traffic: '10M requests/day (115 RPS), 10 spans per request = 1,150 spans/sec',
    latency: 'p99 < 1ms overhead per span, < 3s for trace retrieval',
    availability: '99% uptime (observability tool, not critical path)',
    budget: '$3,000/month',
  },

  availableComponents: [
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
      name: 'Basic Span Collection',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Collect spans from microservices and store them.',
      traffic: {
        type: 'write',
        rps: 100, // 100 spans/sec
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 100, // 100ms acceptable for span ingestion
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 1000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Basic tracing architecture:
- Microservices send spans to collector (app_server)
- Message Queue: Buffer spans (handle traffic spikes)
- PostgreSQL: Store spans (indexed by trace_id)`,
      },
    },

    {
      name: 'Trace Assembly',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Assemble complete trace from spans arriving out of order.',
      traffic: {
        type: 'mixed',
        rps: 200, // 100 span writes, 100 trace reads
        readRatio: 0.5,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        traceCompleteness: 0.95, // 95% of traces complete
      },
    },

    {
      name: 'High-Volume Span Ingestion',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle production traffic (1,150 spans/sec) with minimal overhead.',
      traffic: {
        type: 'write',
        rps: 1150, // 115 requests × 10 spans each
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 50, // Async ingestion, not critical
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Production tracing architecture:

**Span ingestion flow:**
1. Microservice creates span (trace_id, span_id, parent_id, duration)
2. Send to collector via message queue (async, non-blocking)
3. Collector batches spans (100 spans = 1 batch)
4. Write batch to PostgreSQL (bulk insert)

**Why message queue is critical:**
- Decouples microservices from collector
- Buffers traffic spikes (release deployments)
- Microservices never block on tracing!

**Storage tiers:**
- PostgreSQL: Recent traces (last 7 days) for fast search
- S3: Archive (7+ days old) in Parquet format

**Overhead:**
- Span creation: ~0.1ms (in-memory)
- Async send to queue: ~0.5ms
- Total overhead: <1ms ✅ (imperceptible!)`,
      },
    },

    {
      name: 'Sampling Strategy',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Sample 1% of successful requests, 100% of errors.',
      traffic: {
        type: 'write',
        rps: 1150,
      },
      duration: 120,
      passCriteria: {
        samplingRatio: 0.01, // ~1% of total
        errorSamplingRatio: 1.0, // 100% of errors
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Sampling is CRITICAL for cost control:

**Without sampling:**
- 10M requests/day × 10 spans × 1KB = 100GB/day ❌
- 100GB × 30 days = 3TB/month
- Storage cost: $69/month (S3) + $6,900/month (PostgreSQL) ❌❌

**With 1% sampling:**
- 100K requests/day × 10 spans × 1KB = 1GB/day ✅
- 1GB × 30 days = 30GB/month
- Storage cost: $0.69/month (S3) + $69/month (PostgreSQL) ✅

**99% cost reduction!**

**Sampling strategies:**

1. **Head-based sampling (simple):**
   - Decide at first span: sample = (trace_id % 100) < 1
   - Pro: Low overhead
   - Con: Might miss errors (sampled out before error occurs)

2. **Tail-based sampling (better):** ✅
   - Collect all spans in-memory buffer
   - At end of trace, decide: sample if error OR random(1%)
   - Pro: Never miss errors!
   - Con: More complex

**Implementation:**
- 100% of errors captured ✅ (critical for debugging)
- 1% of successful requests (representative sample)
- Total: ~2-3% storage (errors are rare)`,
      },
    },

    {
      name: 'Trace Search by Attributes',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Search traces by user_id, latency, error status within 3 seconds.',
      traffic: {
        type: 'read',
        rps: 50, // Engineers searching traces
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 3000, // 3 seconds for complex queries
        maxErrorRate: 0.01,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Message Queue Backpressure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Massive traffic spike (10x) overwhelms message queue. System should drop spans gracefully.',
      traffic: {
        type: 'write',
        rps: 11500, // 10x normal
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.5, // 50% drops acceptable (observability, not critical)
        minAvailability: 0.80,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Graceful degradation for observability systems:

**Problem:**
- 10x traffic spike (release, incident)
- Message queue fills up
- What happens?

**BAD approach - Block microservices:** ❌
- Microservice waits for queue to accept span
- Tracing overhead increases to 100ms+
- User requests slow down
- Cascading failure!

**GOOD approach - Drop spans:** ✅
- If queue is full → drop span (return immediately)
- Tracing overhead stays <1ms
- User requests unaffected
- Some traces lost (acceptable for observability!)

**Implementation:**
message_queue.send(span, timeout=1ms)
if timeout:
    drop(span)  # Log dropped count
    return

**Key insight:**
Observability should NEVER impact production traffic!
Better to lose traces than slow down requests.`,
      },
    },
  ],

  learningObjectives: [
    'Design low-overhead instrumentation (<1ms)',
    'Implement sampling strategies for cost control',
    'Assemble distributed traces from out-of-order spans',
    'Graceful degradation (drop data, not requests)',
    'Multi-tier storage (hot: PostgreSQL, cold: S3)',
  ],

  hints: [
    {
      trigger: 'test_failed:High-Volume Span Ingestion',
      message: `💡 Tracing overhead is slowing down requests!

**Problem:**
- Each request creates 10 spans
- Synchronous write to database: 10ms × 10 = 100ms ❌
- 100ms added to every request latency!

**Solution - Async Ingestion:**
1. Create span in-memory (~0.1ms)
2. Send to message queue (async, ~0.5ms)
3. Background worker writes to database
4. Total overhead: <1ms ✅

**Key insight:**
Tracing must be INVISIBLE to production traffic!

Add a Message Queue for async ingestion.`,
    },
    {
      trigger: 'test_failed:Sampling Strategy',
      message: `💡 Storage costs are too high!

**Problem:**
Storing 100% of traces:
- 10M requests × 10 spans × 1KB = 100GB/day
- $6,900/month for PostgreSQL ❌

**Solution - Sampling:**
Sample 1% of successful requests:
- 100K requests × 10 spans × 1KB = 1GB/day
- $69/month for PostgreSQL ✅

**But don't sample out errors!**
- 100% of error traces (critical for debugging)
- 1% of success traces (representative sample)

**Implementation - Tail-based sampling:**
1. Buffer spans in-memory (per trace_id)
2. When trace completes, check status
3. If error → store 100%
4. If success → store 1% (random)

This ensures you NEVER miss an error!`,
    },
    {
      trigger: 'test_failed:Message Queue Backpressure',
      message: `💡 Traffic spike is causing cascading failures!

**Problem:**
- 10x traffic spike fills up message queue
- Microservices block waiting for queue
- Tracing overhead: 1ms → 1000ms ❌
- All requests slow down!

**Solution - Drop Spans (Graceful Degradation):**
message_queue.send(span, timeout=1ms)
if timeout:
    metrics.incr('spans_dropped')
    return  # Don't block!

**Trade-off:**
- During spike: Lose some traces ⚠️
- Production requests: Fast (<1ms overhead) ✅

**Key insight:**
For observability tools:
- Losing data is acceptable
- Slowing down production is NOT

Better to have 50% of traces than 0% availability!`,
    },
  ],

  pythonTemplate: `# Distributed Tracing System
# Implement span collection and trace assembly

import time
import random
from typing import List, Dict, Optional

def create_span(
    trace_id: str,
    span_id: str,
    parent_id: Optional[str],
    service_name: str,
    operation: str,
    duration_ms: float,
    status: str,
    attributes: dict
) -> dict:
    """
    Create a trace span (called by microservices).

    Args:
        trace_id: Unique trace identifier
        span_id: Unique span identifier
        parent_id: Parent span ID (None for root span)
        service_name: Service that created this span
        operation: Operation name (e.g., "GET /api/products")
        duration_ms: Span duration in milliseconds
        status: "ok" or "error"
        attributes: Additional attributes (user_id, http_status, etc.)

    Returns:
        Span object

    Requirements:
    - Create span in <0.1ms (in-memory only)
    - Return immediately (don't block on I/O!)
    """
    span = {
        'trace_id': trace_id,
        'span_id': span_id,
        'parent_id': parent_id,
        'service_name': service_name,
        'operation': operation,
        'duration_ms': duration_ms,
        'status': status,
        'attributes': attributes,
        'timestamp': time.time(),
    }

    return span


def send_span_async(span: dict, context: dict):
    """
    Send span to collector asynchronously (non-blocking!).

    Args:
        span: Span object
        context: Shared context

    Requirements:
    - Send to message queue (async)
    - Timeout after 1ms (don't block!)
    - If timeout, drop span (graceful degradation)
    - Total overhead: <1ms
    """
    try:
        # Your code here: Send to message queue with 1ms timeout
        # If queue is full, drop span (increment dropped counter)
        pass
    except TimeoutError:
        context['metrics'].incr('spans_dropped')
        # Don't raise! Return immediately.


def should_sample(trace_id: str, status: str) -> bool:
    """
    Decide whether to sample this trace (tail-based sampling).

    Args:
        trace_id: Trace identifier
        status: "ok" or "error"

    Returns:
        True if should sample

    Requirements:
    - 100% sampling for errors
    - 1% sampling for successful requests
    """
    if status == 'error':
        return True  # Always sample errors!

    # 1% sampling for success
    return (hash(trace_id) % 100) < 1


def ingest_span(span: dict, context: dict):
    """
    Ingest span from message queue (background worker).

    Args:
        span: Span object from queue
        context: Shared context

    Requirements:
    - Apply sampling decision
    - If sampled, write to PostgreSQL
    - Batch writes (100 spans per batch)
    """
    # Your code here

    pass


def assemble_trace(trace_id: str, context: dict) -> dict:
    """
    Assemble complete trace from spans.

    Args:
        trace_id: Trace identifier
        context: Shared context

    Returns:
        {
            'trace_id': 'trace_123',
            'duration_ms': 250,
            'spans': [
                {'span_id': 'span_1', 'service': 'api-gateway', 'duration': 50, 'children': [
                    {'span_id': 'span_2', 'service': 'auth', 'duration': 10, 'children': []},
                    {'span_id': 'span_3', 'service': 'products', 'duration': 200, 'children': [
                        {'span_id': 'span_4', 'service': 'database', 'duration': 180}
                    ]}
                ]}
            ]
        }

    Requirements:
    - Fetch all spans for trace_id from PostgreSQL
    - Build tree structure (parent-child relationships)
    - Calculate total trace duration
    """
    # Your code here

    return {}


def search_traces(
    filters: dict,
    context: dict
) -> List[dict]:
    """
    Search traces by attributes.

    Args:
        filters: {
            'user_id': 'user_123',
            'min_duration_ms': 1000,
            'status': 'error',
            'service_name': 'products'
        }
        context: Shared context

    Returns:
        List of matching trace summaries

    Requirements:
    - Query PostgreSQL with filters
    - Index by common attributes (user_id, status, service_name)
    - Return within 3 seconds
    """
    # Your code here

    return []


# Microservice instrumentation example
def handle_request_with_tracing(request: dict, context: dict) -> dict:
    """
    Example of instrumenting a microservice request.

    Requirements:
    - Create span at start
    - Record duration
    - Send span async (non-blocking!)
    """
    trace_id = request.get('trace_id', generate_trace_id())
    span_id = generate_span_id()
    parent_id = request.get('parent_span_id')

    start_time = time.time()

    # Process request
    try:
        result = process_request(request)
        status = 'ok'
    except Exception as e:
        status = 'error'
        raise
    finally:
        # Create and send span
        duration_ms = (time.time() - start_time) * 1000

        span = create_span(
            trace_id=trace_id,
            span_id=span_id,
            parent_id=parent_id,
            service_name='my-service',
            operation=request['path'],
            duration_ms=duration_ms,
            status=status,
            attributes={'user_id': request.get('user_id')}
        )

        send_span_async(span, context)  # Non-blocking!

    return result


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle tracing API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    query = request.get('query', {})

    # GET /traces/:id - Get complete trace
    if method == 'GET' and path.startswith('/traces/'):
        trace_id = path.split('/')[-1]
        trace = assemble_trace(trace_id, context)
        return {'status': 200, 'body': trace}

    # GET /traces/search - Search traces
    elif method == 'GET' and path == '/traces/search':
        traces = search_traces(query, context)
        return {'status': 200, 'body': {'traces': traces}}

    return {'status': 404, 'body': {'error': 'Not found'}}


def generate_trace_id() -> str:
    """Generate unique trace ID."""
    return f"trace_{int(time.time() * 1000)}_{random.randint(1000, 9999)}"


def generate_span_id() -> str:
    """Generate unique span ID."""
    return f"span_{int(time.time() * 1000)}_{random.randint(1000, 9999)}"


def process_request(request: dict) -> dict:
    """Placeholder for actual request processing."""
    return {'result': 'ok'}
`,
};
