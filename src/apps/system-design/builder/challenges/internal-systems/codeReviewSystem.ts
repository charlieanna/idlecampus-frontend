import { Challenge } from '../../types/testCase';

export const codeReviewSystemChallenge: Challenge = {
  id: 'code_review_system',
  title: 'Code Review System (Google Critique/Gerrit style)',
  difficulty: 'advanced',
  description: `Design an internal code review system similar to Google's Critique or Gerrit.

Engineers submit code changes (diffs) for review. Other engineers provide inline comments,
approve/reject changes, and track review status. The system integrates with CI/CD for automated checks.

Example workflow:
- POST /reviews → Create new review with diff
- POST /reviews/:id/comments → Add inline comment at line 42
- POST /reviews/:id/approve → Approve the change
- GET /reviews/:id/status → Check CI status + approvals

Key challenges:
- Large diffs (10K+ lines) from monorepo changes
- Concurrent comments on same lines
- Real-time updates when new comments arrive
- Integration with CI/CD pipeline status`,

  requirements: {
    functional: [
      'Store and display code diffs (up to 50MB)',
      'Inline comments with line numbers',
      'Approval workflow (require 2+ approvals)',
      'CI integration (show test status)',
      'Real-time notifications for new comments',
    ],
    traffic: '500 RPS (80% reads, 20% writes)',
    latency: 'p99 < 300ms for diff rendering, < 100ms for comments',
    availability: '99.9% uptime (blocks deployments if down!)',
    budget: '$2,000/month',
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
      name: 'Basic Code Review Creation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Engineers can create code reviews with diffs and view them.',
      traffic: {
        type: 'mixed',
        rps: 20,
        readRatio: 0.7,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 200 } },
          { type: 's3', config: { storageSizeGB: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Basic architecture:
- S3 stores large diffs (avoid bloating database)
- PostgreSQL stores review metadata, comments, approvals
- App servers orchestrate review workflow`,
      },
    },

    {
      name: 'Large Diff Handling (Monorepo)',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System handles large diffs from monorepo changes (10K lines, 50MB files).',
      traffic: {
        type: 'write',
        rps: 10,
        avgResponseSizeMB: 25, // Large diffs
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 5000, // 5 seconds acceptable for large uploads
      },
    },

    {
      name: 'Concurrent Inline Comments',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Multiple reviewers can add comments to the same line simultaneously without conflicts.',
      traffic: {
        type: 'write',
        rps: 50, // Many concurrent comment writes
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0, // No lost comments!
      },
    },

    {
      name: 'Approval Workflow',
      type: 'functional',
      requirement: 'FR-4',
      description: 'System enforces approval rules (require 2+ approvals before merge).',
      traffic: {
        type: 'mixed',
        rps: 30,
        readRatio: 0.6,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Normal Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle typical workday traffic (500 RPS, 80% reads for viewing reviews).',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.8, // 400 reads (view diffs), 100 writes (comments/approvals)
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 300,
        maxErrorRate: 0.01,
        maxMonthlyCost: 2000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 600, writeCapacity: 300, replication: true } },
          { type: 's3', config: { storageSizeGB: 5000 } },
          { type: 'message_queue', config: { maxThroughput: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Production-ready architecture:

**Why this works:**
- S3: Store large diffs (5TB for a large engineering org)
- Redis: Cache frequently viewed reviews (active reviews)
- PostgreSQL: Review metadata, comments, approvals (with replication for HA)
- Message Queue: Async notifications for new comments (pub/sub)
- 3 App Servers: Handle 500 RPS with room to spare

**Key optimizations:**
- Cache rendered diffs in Redis (expensive to compute syntax highlighting)
- Store raw diffs in S3 (cheap storage, ~$115/month for 5TB)
- Queue for real-time notifications (decouple from request path)

**Cost breakdown (~$1,850/month):**
- App Servers: 3 × $200 = $600
- PostgreSQL: $500 (with replication)
- Redis: $300 (2GB)
- S3: $115 (5TB)
- Message Queue: $100
- Load Balancer: $100`,
      },
    },

    {
      name: 'Release Week Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'During release week, code review activity doubles (1000 RPS).',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.75,
      },
      duration: 120,
      passCriteria: {
        maxP99Latency: 500,
        maxErrorRate: 0.02,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Database Failure During Active Reviews',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database fails during active code reviews. System must failover without losing comments.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.8,
      },
      duration: 120,
      failureInjection: {
        type: 'db_crash',
        atSecond: 30,
      },
      passCriteria: {
        minAvailability: 0.995, // 99.5% availability (critical for deployments!)
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 600, writeCapacity: 300, replication: true } },
          { type: 's3', config: { storageSizeGB: 5000 } },
          { type: 'message_queue', config: { maxThroughput: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Database replication is CRITICAL for code review systems:

**Why it matters:**
- Code reviews block deployments
- If the system is down, engineers can't ship code
- Lost approvals mean re-reviewing code (wastes hours)

**Failover strategy:**
- PostgreSQL replication: Automatic failover in <30 seconds
- Redis cache: Continues serving read traffic during failover
- Message queue: Buffers notifications during brief outage

**Without replication:**
- 60+ seconds downtime = 50% availability FAIL ❌
- Lost comments/approvals = trust issues

**With replication:**
- <30 seconds downtime = 99.5%+ availability ✅
- Zero data loss`,
      },
    },

    {
      name: 'S3 Region Outage - Diff Access',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'S3 region becomes unavailable. Engineers cannot view diffs.',
      traffic: {
        type: 'read',
        rps: 400, // Mostly diff reads
      },
      duration: 60,
      failureInjection: {
        type: 'storage_outage',
        atSecond: 15,
      },
      passCriteria: {
        maxErrorRate: 0.3, // 30% error rate acceptable (read-only degradation)
        minAvailability: 0.90,
      },
    },
  ],

  learningObjectives: [
    'Design for large file storage (diffs) separate from metadata',
    'Handle concurrent writes with transaction isolation',
    'Real-time notifications with message queues',
    'High availability for developer productivity tools',
    'Optimize for read-heavy workloads with caching',
  ],

  hints: [
    {
      trigger: 'test_failed:Large Diff Handling',
      message: `💡 Storing 50MB diffs in PostgreSQL will kill performance!

**Problem:**
- Database rows have size limits
- Large blobs slow down queries
- Expensive to replicate

**Solution:**
1. Store diffs in S3 (object storage)
2. Store only metadata in PostgreSQL (review_id, author, timestamp)
3. Reference S3 key in database

**Example:**
Database: {review_id: 123, diff_s3_key: "diffs/123.diff", size_mb: 47}
S3: Store actual diff content

This keeps database fast and cheap!`,
    },
    {
      trigger: 'test_failed:Concurrent Inline Comments',
      message: `💡 Lost comments due to race conditions!

**Problem:**
Two reviewers comment on line 42 at the same time:
- Reviewer A reads comments: []
- Reviewer B reads comments: []
- Reviewer A writes: [{line: 42, text: "Fix this"}]
- Reviewer B writes: [{line: 42, text: "Also fix that"}]
- Result: Only Reviewer B's comment is saved! ❌

**Solutions:**
1. Use database transactions with proper isolation (SERIALIZABLE)
2. Append-only comment table (each comment is a separate row)
3. Optimistic locking with version numbers

**Best approach:**
Each comment is a separate row - no conflicts!`,
    },
    {
      trigger: 'test_failed:Database Failure During Active Reviews',
      message: `💡 Code review system downtime blocks ALL deployments!

Without database replication:
- Primary fails = complete outage
- Engineers cannot approve code
- Deployments are blocked
- Team productivity halts

**Why this is critical:**
- Code review is in the critical path for shipping
- 1 hour outage = 100+ engineers blocked
- Lost approvals = wasted review effort

Enable PostgreSQL replication for automatic failover!`,
    },
  ],

  pythonTemplate: `# Code Review System
# Implement diff storage and comment management

def create_review(author: str, diff_content: str, context: dict) -> dict:
    """
    Create a new code review with diff.

    Args:
        author: Engineer creating the review
        diff_content: Raw diff text (could be large!)
        context: Shared context (db, s3, cache)

    Returns:
        {
            'review_id': 'review_123',
            'author': 'alice@company.com',
            'diff_url': 's3://diffs/review_123.diff',
            'status': 'pending',
            'approvals': []
        }

    Requirements:
    - Store diff in S3 (not database!)
    - Store metadata in database
    - Return review object
    """
    # Your code here

    return {}


def add_comment(review_id: str, line_number: int, text: str, author: str, context: dict) -> dict:
    """
    Add inline comment to a code review.

    Args:
        review_id: Review identifier
        line_number: Line number in diff (e.g., 42)
        text: Comment text
        author: Comment author
        context: Shared context

    Returns:
        {
            'comment_id': 'comment_456',
            'review_id': 'review_123',
            'line_number': 42,
            'text': 'This function should be async',
            'author': 'bob@company.com',
            'timestamp': 1234567890
        }

    Requirements:
    - Store each comment as separate row (avoid conflicts!)
    - Invalidate cached review
    - Publish notification to message queue
    """
    # Your code here

    return {}


def approve_review(review_id: str, approver: str, context: dict) -> dict:
    """
    Approve a code review.

    Args:
        review_id: Review identifier
        approver: Engineer approving
        context: Shared context

    Returns:
        {
            'review_id': 'review_123',
            'approvals': ['alice@company.com', 'bob@company.com'],
            'ready_to_merge': True  # True if >= 2 approvals
        }

    Requirements:
    - Check approval policy (require 2+ approvals)
    - Prevent duplicate approvals from same person
    - Update review status if ready to merge
    """
    # Your code here

    return {}


def get_review_with_comments(review_id: str, context: dict) -> dict:
    """
    Get review with all inline comments, optimized with caching.

    Args:
        review_id: Review identifier
        context: Shared context

    Returns:
        {
            'review_id': 'review_123',
            'author': 'alice@company.com',
            'diff_url': 's3://diffs/review_123.diff',
            'comments': [
                {'line': 42, 'text': '...', 'author': 'bob@company.com'},
                {'line': 55, 'text': '...', 'author': 'carol@company.com'}
            ],
            'approvals': ['bob@company.com'],
            'ci_status': 'passing'
        }

    Requirements:
    - Check cache first
    - Fetch diff URL from database (not diff content!)
    - Fetch comments from database
    - Cache the result
    """
    # Your code here

    return {}


# App Server Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle code review API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})
    user = request.get('user', '')

    # POST /reviews - Create review
    if method == 'POST' and path == '/reviews':
        diff_content = body.get('diff', '')
        review = create_review(user, diff_content, context)
        return {'status': 201, 'body': review}

    # GET /reviews/:id - Get review with comments
    elif method == 'GET' and path.startswith('/reviews/'):
        review_id = path.split('/')[-1]
        review = get_review_with_comments(review_id, context)
        return {'status': 200, 'body': review}

    # POST /reviews/:id/comments - Add comment
    elif method == 'POST' and '/comments' in path:
        review_id = path.split('/')[2]
        line_number = body.get('line', 0)
        text = body.get('text', '')
        comment = add_comment(review_id, line_number, text, user, context)
        return {'status': 201, 'body': comment}

    # POST /reviews/:id/approve - Approve review
    elif method == 'POST' and '/approve' in path:
        review_id = path.split('/')[2]
        result = approve_review(review_id, user, context)
        return {'status': 200, 'body': result}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
