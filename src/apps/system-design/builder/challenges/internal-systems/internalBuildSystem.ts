import { Challenge } from '../../types/testCase';

export const internalBuildSystemChallenge: Challenge = {
  id: 'internal_build_system',
  title: 'Internal Build System (Google Bazel/Blaze style)',
  difficulty: 'advanced',
  description: `Design a distributed build system for a large monorepo with millions of lines of code.

The system must:
- Cache build artifacts (avoid rebuilding unchanged code)
- Support incremental builds (only rebuild what changed)
- Distribute builds across hundreds of remote workers
- Ensure hermetic builds (reproducible, no external dependencies)
- Handle complex dependency graphs

Example workflow:
- Developer changes auth_service.cc
- Build system detects change via hash
- Recompiles only auth_service.cc + dependents
- Uses cached artifacts for everything else
- 1000-file project: 2 min → 10 sec rebuild! ✅

Key challenges:
- Dependency graph analysis (who depends on what?)
- Distributed caching (shared across all engineers)
- Remote execution (100+ build workers)
- Cache invalidation (when to rebuild?)`,

  requirements: {
    functional: [
      'Track file dependencies (build graph)',
      'Cache build artifacts by content hash',
      'Incremental builds (only rebuild changed files + deps)',
      'Remote execution on build workers',
      'Hermetic builds (reproducible)',
    ],
    traffic: '1,000 builds/day, avg 500 files per build',
    latency: 'p99 < 2 min for incremental build, < 20 min for full build',
    availability: '99.9% uptime (blocks deployments if down)',
    budget: '$10,000/month',
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
      name: 'Basic Build Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Compile a simple project with dependencies.',
      traffic: {
        type: 'write',
        rps: 1, // 1 build
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 120000, // 2 minutes
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500 } },
          { type: 's3', config: { storageSizeGB: 50000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Basic build architecture:
- PostgreSQL: Store dependency graph, build metadata
- S3: Store build artifacts (binaries, object files)
- App servers: Orchestrate build tasks`,
      },
    },

    {
      name: 'Incremental Build (Cache Hit)',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Developer changes 1 file. System rebuilds only that file + dependents using cached artifacts.',
      traffic: {
        type: 'mixed',
        rps: 5, // Concurrent builds
        readRatio: 0.95, // 95% cache hits!
      },
      duration: 120,
      passCriteria: {
        maxP99Latency: 10000, // 10 seconds (vs 2 min full build!)
        maxErrorRate: 0,
        cacheHitRatio: 0.95,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 8192 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000 } },
          { type: 's3', config: { storageSizeGB: 50000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Incremental build magic - Content-Addressable Storage:

**Problem - Naive approach:**
Developer changes 1 file → rebuild entire project
- 1000 files × 5 sec/file = 5,000 sec = 83 minutes ❌

**Solution - Dependency Graph + Caching:**

**Step 1: Build dependency graph**
- Parse BUILD files to understand dependencies
- auth_service.cc depends on crypto_lib.cc
- Store graph in PostgreSQL

**Step 2: Content hashing**
- Hash each file: SHA256(auth_service.cc) = abc123
- If hash unchanged → use cached artifact ✅
- If hash changed → rebuild + all dependents

**Step 3: Incremental rebuild**
Developer changes auth_service.cc:
1. Hash changes: abc123 → def456
2. Find dependents: [api_server.cc]
3. Rebuild only: auth_service.cc (5 sec) + api_server.cc (5 sec) = 10 sec ✅
4. Reuse cached: crypto_lib.o, database_lib.o, ... (995 files)

**Cache layers:**
- Redis: Build artifact metadata (file hash → S3 key)
- S3: Actual artifacts (compiled .o files, binaries)

**Key insight:**
Content-addressable caching enables 50x speedup!

**Cost breakdown (~$9,500/month):**
- 5 app servers: $1,000
- PostgreSQL: $500
- Redis 8GB: $400
- S3 50TB: $1,150
- Message Queue: $200
- 100 build workers: $6,000 (EC2 spot instances)
- Load Balancer: $100`,
      },
    },

    {
      name: 'Distributed Remote Execution',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Build large project (1000 files) in parallel across 100 remote workers.',
      traffic: {
        type: 'write',
        rps: 100, // 100 parallel compilation tasks
      },
      duration: 600, // 10 minutes
      passCriteria: {
        maxP99Latency: 600000, // 10 min for 1000-file project
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 8192 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000 } },
          { type: 's3', config: { storageSizeGB: 50000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Remote execution for parallel builds:

**Problem - Local build:**
1000 files × 60 sec/file = 60,000 sec = 16 hours ❌

**Solution - Distributed compilation:**

**Architecture:**
1. Build coordinator (app_server) analyzes dependency graph
2. Identifies independent tasks (files with no dependencies)
3. Publishes tasks to message queue
4. 100 build workers pull tasks and compile
5. Workers upload artifacts to S3

**Parallelization:**
- 1000 files, 100 workers → 10 files per worker
- 10 files × 60 sec = 600 sec = 10 minutes ✅

**Dependency-aware scheduling:**
- Level 0: Files with no deps → compile immediately (100 parallel)
- Level 1: Files depending on Level 0 → compile after Level 0 done
- Level 2: ...and so on

**Example:**
crypto_lib.cc (no deps) → compile immediately
auth_service.cc (depends on crypto_lib) → wait for crypto_lib.o
api_server.cc (depends on auth_service) → wait for auth_service.o

**Key insight:**
Message queue + topological sort enables massive parallelism!`,
      },
    },

    {
      name: 'Hermetic Build Verification',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Same input → same output (reproducible builds across different machines).',
      traffic: {
        type: 'write',
        rps: 2, // Build same project twice on different workers
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        deterministicOutput: true, // Outputs must be byte-identical
      },
    },

    {
      name: 'Cache Invalidation on Dependency Change',
      type: 'functional',
      requirement: 'FR-3',
      description: 'When crypto_lib.cc changes, invalidate cache for all dependents.',
      traffic: {
        type: 'mixed',
        rps: 5,
        readRatio: 0.7,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        correctnessCheck: 'all_dependents_rebuilt',
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Worker Failure During Build',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: '20% of build workers crash. System must retry failed tasks.',
      traffic: {
        type: 'write',
        rps: 100,
      },
      duration: 600,
      failureInjection: {
        type: 'worker_crash',
        atSecond: 120,
        affectedPercentage: 0.2,
      },
      passCriteria: {
        maxErrorRate: 0.05,
        minAvailability: 0.95,
      },
    },

    {
      name: 'S3 Cache Corruption',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Cached artifact in S3 is corrupted. System detects via hash mismatch and rebuilds.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.9,
      },
      duration: 120,
      failureInjection: {
        type: 'data_corruption',
        atSecond: 30,
      },
      passCriteria: {
        maxErrorRate: 0.1,
        correctnessCheck: 'hash_verification',
      },
    },
  ],

  learningObjectives: [
    'Design content-addressable storage for build artifacts',
    'Implement dependency graph analysis and topological sort',
    'Distributed task execution with message queues',
    'Cache invalidation based on transitive dependencies',
    'Hermetic builds for reproducibility',
  ],

  hints: [
    {
      trigger: 'test_failed:Incremental Build (Cache Hit)',
      message: `💡 Every build is rebuilding everything from scratch!

**Problem - Timestamp-based caching:**
if (file.modtime > cache.modtime) → rebuild
- Doesn't work in distributed systems (clock skew)
- Git checkout changes all timestamps → full rebuild ❌

**Solution - Content-based caching:**
1. Hash file content: hash = SHA256(file.read())
2. Cache key: hash → artifact
3. If hash unchanged → reuse cached artifact ✅

**Example:**
auth_service.cc (hash: abc123) → auth_service.o
Developer edits auth_service.cc → hash changes to def456
→ Cache miss → rebuild auth_service.o
→ Store in cache: def456 → auth_service.o

**Cache structure (Redis):**
{
  "abc123": "s3://builds/auth_service_abc123.o",
  "def456": "s3://builds/auth_service_def456.o"
}

This is called Content-Addressable Storage (CAS)!`,
    },
    {
      trigger: 'test_failed:Distributed Remote Execution',
      message: `💡 Builds are running sequentially instead of parallel!

**Problem:**
1000 files compiled one at a time = 16 hours ❌

**Solution - Dependency-Aware Parallelization:**

Step 1: Build dependency graph
- crypto_lib.cc → no deps (Level 0)
- auth_service.cc → depends on crypto_lib (Level 1)
- api_server.cc → depends on auth_service (Level 2)

Step 2: Topological sort (Kahn's algorithm)
- Sort files by dependency level

Step 3: Parallel execution per level
- Level 0: 200 files → 200 workers (parallel)
- Level 1: 300 files → wait for Level 0, then 300 workers
- Level 2: 500 files → wait for Level 1, then 500 workers

**Message Queue Pattern:**
for each level:
    for file in level:
        queue.publish({task: "compile", file: file})

    wait_for_level_completion()

Add Message Queue for distributed execution!`,
    },
    {
      trigger: 'test_failed:Cache Invalidation on Dependency Change',
      message: `💡 Stale cache causing incorrect builds!

**Problem:**
1. Developer changes crypto_lib.cc
2. auth_service.cc depends on crypto_lib
3. Build uses cached auth_service.o (built with OLD crypto_lib) ❌
4. Result: Incorrect binary!

**Solution - Transitive Cache Invalidation:**

When file X changes:
1. Invalidate X's cache
2. Find all files that depend on X (dependents)
3. Invalidate their cache too (recursive!)

**Dependency Graph:**
crypto_lib.cc → [auth_service.cc, payment_service.cc]
auth_service.cc → [api_server.cc]

**Invalidation flow:**
crypto_lib.cc changes:
→ Invalidate: crypto_lib.o ✅
→ Invalidate: auth_service.o ✅ (depends on crypto_lib)
→ Invalidate: api_server.o ✅ (depends on auth_service)

**Implementation:**
Store reverse dependencies in PostgreSQL for fast lookup!`,
    },
    {
      trigger: 'test_failed:Hermetic Build Verification',
      message: `💡 Builds are non-deterministic (different output on different machines)!

**Problem - Non-hermetic build:**
- Depends on system libraries (/usr/lib/libssl.so)
- Machine A has libssl v1.0 → binary_A
- Machine B has libssl v1.1 → binary_B
- binary_A ≠ binary_B ❌ (Can't cache!)

**Solution - Hermetic builds:**
1. All dependencies declared explicitly in BUILD file
2. No access to system libraries
3. Fixed compiler version
4. Sandbox execution (no network, no /tmp)

**Example BUILD file:**
cc_library(
  name = "auth_service",
  srcs = ["auth_service.cc"],
  deps = [
    "//third_party/crypto:libssl:1.0.2",  # Exact version!
    "//common:logging"
  ]
)

**Result:**
Same input → same output (always!) ✅
Can cache and reuse across entire organization!`,
    },
  ],

  pythonTemplate: `# Internal Build System
# Implement content-addressable caching and dependency graph

import hashlib
from typing import Dict, List, Set
from collections import defaultdict, deque

def compute_file_hash(file_path: str) -> str:
    """
    Compute content hash of a file (for cache key).

    Args:
        file_path: Path to source file

    Returns:
        SHA256 hash of file content

    Requirements:
    - Read file content
    - Compute SHA256 hash
    - Return hex digest
    """
    # Your code here
    return hashlib.sha256(b"").hexdigest()


def build_dependency_graph(build_files: List[dict]) -> Dict[str, List[str]]:
    """
    Build dependency graph from BUILD file declarations.

    Args:
        build_files: [
            {'target': 'auth_service', 'deps': ['crypto_lib', 'logging']},
            {'target': 'crypto_lib', 'deps': []},
            ...
        ]

    Returns:
        {
            'auth_service': ['crypto_lib', 'logging'],
            'crypto_lib': [],
            ...
        }

    Requirements:
    - Parse BUILD files
    - Extract dependencies
    - Detect circular dependencies (raise error)
    """
    # Your code here
    return {}


def topological_sort(dep_graph: Dict[str, List[str]]) -> List[List[str]]:
    """
    Sort targets by dependency levels (Kahn's algorithm).

    Args:
        dep_graph: Dependency graph

    Returns:
        [
            ['crypto_lib', 'logging'],      # Level 0: no deps
            ['auth_service'],                # Level 1: depends on Level 0
            ['api_server']                   # Level 2: depends on Level 1
        ]

    Requirements:
    - Implement topological sort
    - Group by levels for parallel execution
    - Detect cycles (raise error)
    """
    # Your code here
    return [[]]


def get_cached_artifact(file_hash: str, context: dict) -> str:
    """
    Check if artifact exists in cache (Redis + S3).

    Args:
        file_hash: SHA256 hash of source file
        context: Shared context

    Returns:
        S3 URL if cached, None otherwise

    Requirements:
    - Check Redis for file_hash → S3 key mapping
    - Verify artifact exists in S3
    - Return S3 URL or None
    """
    # Your code here
    return None


def compile_file(file_path: str, dependencies: List[str], context: dict) -> dict:
    """
    Compile a single file (or retrieve from cache).

    Args:
        file_path: Source file to compile
        dependencies: List of dependency artifacts (from cache or compiled)
        context: Shared context

    Returns:
        {
            'target': 'auth_service.o',
            's3_url': 's3://builds/auth_service_abc123.o',
            'hash': 'abc123',
            'cache_hit': True
        }

    Requirements:
    - Compute file hash
    - Check cache (get_cached_artifact)
    - If cache hit: return cached artifact ✅
    - If cache miss: compile file, upload to S3, cache result
    """
    # Your code here
    return {}


def invalidate_cache_transitive(changed_file: str, dep_graph: dict, context: dict):
    """
    Invalidate cache for changed file and all dependents (transitive).

    Args:
        changed_file: File that changed
        dep_graph: Dependency graph
        context: Shared context

    Requirements:
    - Build reverse dependency graph (who depends on changed_file?)
    - BFS/DFS to find all transitive dependents
    - Invalidate cache for all (delete from Redis)
    """
    # Your code here
    pass


def build_project(targets: List[str], context: dict) -> dict:
    """
    Build project with incremental caching.

    Args:
        targets: List of targets to build (e.g., ['api_server'])
        context: Shared context

    Returns:
        {
            'targets': ['api_server'],
            'total_files': 1000,
            'cache_hits': 950,
            'rebuilt': 50,
            'duration_sec': 120,
            'artifacts': ['s3://builds/api_server_xyz789']
        }

    Requirements:
    - Build dependency graph
    - Topological sort for build order
    - For each level, compile files in parallel (message queue)
    - Aggregate results
    """
    # Your code here
    return {}


def remote_compile_worker(context: dict):
    """
    Remote build worker (pulls tasks from queue and compiles).

    Requirements:
    - Pull compile task from message queue
    - Download dependencies from S3
    - Compile in sandboxed environment (hermetic)
    - Upload artifact to S3
    - Publish result
    """
    while True:
        # Pull task from queue
        task = context['queue'].receive(timeout=30)
        if not task:
            continue

        file_path = task['file_path']
        dependencies = task['dependencies']

        # Download deps from S3
        # Compile file
        # Upload artifact to S3
        # Publish result

        # Your code here
        pass


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle build system API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /build - Trigger build
    if method == 'POST' and path == '/build':
        targets = body.get('targets', [])
        result = build_project(targets, context)
        return {'status': 201, 'body': result}

    # POST /invalidate - Invalidate cache
    elif method == 'POST' and path == '/invalidate':
        changed_files = body.get('files', [])
        dep_graph = build_dependency_graph(context['build_files'])

        for file in changed_files:
            invalidate_cache_transitive(file, dep_graph, context)

        return {'status': 200, 'body': {'invalidated': len(changed_files)}}

    # GET /cache/:hash - Check cache
    elif method == 'GET' and path.startswith('/cache/'):
        file_hash = path.split('/')[-1]
        artifact = get_cached_artifact(file_hash, context)

        if artifact:
            return {'status': 200, 'body': {'artifact': artifact, 'cache_hit': True}}
        return {'status': 404, 'body': {'cache_hit': False}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
