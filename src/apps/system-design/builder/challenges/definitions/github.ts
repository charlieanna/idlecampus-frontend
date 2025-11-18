import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * GitHub - Code Hosting Platform
 * DDIA Ch. 2 (Graph Data Models) & Ch. 3 (Git Object Storage)
 * DDIA Ch. 12 (Future of Data Systems) - Derived Views & Materialized Data
 *
 * DDIA Concepts Applied:
 * - Ch. 2: Graph database for repository relationships
 *   - Nodes: users, repos, commits, pull requests, issues
 *   - Edges: forks, stars, follows, PR references, commit parents
 * - Ch. 2: Git's DAG (Directed Acyclic Graph) for commit history
 * - Ch. 3: Content-addressable storage (SHA-1 hashing for git objects)
 * - Ch. 3: Pack files for efficient storage compression
 *
 * DDIA Ch. 12 - Derived Views & Data Lineage:
 *
 * Core Concept: Separation of System of Record vs Derived Data
 * - System of Record: Git repository (commits, trees, blobs) - immutable
 * - Derived Data: All views derived from git objects
 *   - Repository metadata (stars, forks, issues, PRs)
 *   - Search indexes (code search, commit search)
 *   - Analytics (contribution graphs, language statistics)
 *   - Notifications (followers, mentions, PR reviews)
 *
 * Derived View 1: Repository Star Count
 *
 * System of Record:
 * - Table: user_stars
 *   - (user_id, repo_id, starred_at)
 *   - Append-only event log
 *
 * Derived View:
 * - Table: repository_stats
 *   - (repo_id, star_count, fork_count, updated_at)
 *   - Materialized view, updated on star events
 *
 * Update Strategy (DDIA Ch. 12):
 * Option 1: Eager Materialization (write-time)
 *   - On star event: UPDATE repository_stats SET star_count = star_count + 1
 *   - Pro: Fast reads (no aggregation needed)
 *   - Con: Slower writes (synchronous update)
 *
 * Option 2: Lazy Materialization (read-time)
 *   - On read: SELECT COUNT(*) FROM user_stars WHERE repo_id = ?
 *   - Pro: Fast writes (no materialization)
 *   - Con: Slow reads (aggregation on every query)
 *
 * Option 3: Hybrid (eventual consistency)
 *   - Write to event log: INSERT INTO user_stars (user_id, repo_id, starred_at)
 *   - Async worker updates materialized view (within 1 second)
 *   - Pro: Fast writes + Fast reads
 *   - Con: Temporary inconsistency (acceptable for star counts)
 *
 * Implementation with CDC (Change Data Capture):
 * 1. User stars repo → INSERT into user_stars table
 * 2. CDC stream (Debezium) captures INSERT
 * 3. Kafka topic: "user-star-events"
 * 4. Stream processor aggregates: COUNT stars per repo_id
 * 5. Update repository_stats (derived view)
 *
 * Derived View 2: User Contribution Graph
 *
 * System of Record:
 * - Git commits (immutable)
 * - git log --author=user_id --since=1.year.ago
 *
 * Derived View:
 * - Table: user_contributions
 *   - (user_id, date, commit_count, repos_contributed)
 *   - Updated daily via batch job
 *
 * Batch Processing Pipeline (DDIA Ch. 12):
 * Daily Job (2:00 AM):
 * 1. Read all commits from past 24 hours (from git object store)
 * 2. Group by (user_id, date)
 * 3. Aggregate: COUNT(commits), COUNT(DISTINCT repo_id)
 * 4. Upsert into user_contributions table
 *
 * Why Derived View?
 * - Querying git history for millions of users is too slow
 * - Precompute daily for fast profile page loads
 * - Can always rebuild from git commits (source of truth)
 *
 * Derived View 3: Repository Language Statistics
 *
 * System of Record:
 * - Git tree objects (files in repository)
 * - File extensions: .js, .py, .go, .java
 *
 * Derived View:
 * - Table: repo_language_stats
 *   - (repo_id, language, lines_of_code, percentage)
 *
 * Update Strategy:
 * - On push event → Trigger language analysis job
 * - Scan all files in latest commit
 * - Count lines per language (using linguist library)
 * - Store results in repo_language_stats
 *
 * Event-Driven Update (DDIA Ch. 12):
 * 1. Developer pushes commits → GitHub receives git push
 * 2. Publish event: "repository.push" (repo_id, commit_sha)
 * 3. Worker consumes event, analyzes files
 * 4. Update derived view: repo_language_stats
 *
 * Derived View 4: Code Search Index (Elasticsearch)
 *
 * System of Record:
 * - Git blob objects (source code files)
 *
 * Derived View:
 * - Elasticsearch index: "code-search"
 *   - Documents: {repo_id, file_path, code_content, language}
 *
 * Indexing Pipeline (DDIA Ch. 12):
 * On git push:
 * 1. Identify changed files (git diff)
 * 2. Extract code content from git blobs
 * 3. Tokenize and analyze code (syntax highlighting, keywords)
 * 4. Index in Elasticsearch
 *
 * Example: User searches "function handleRequest"
 * 1. Query Elasticsearch: match "function handleRequest"
 * 2. Return matching files with context
 * 3. Link back to original git blob (system of record)
 *
 * Data Lineage (DDIA Ch. 12):
 *
 * Tracing Data Flow:
 * Source: Git commits (immutable event log)
 *   ↓ (CDC stream)
 * Derived: Commit metadata (author, timestamp, message)
 *   ↓ (Stream processor)
 * Derived: User contribution graph (aggregated daily)
 *   ↓ (API)
 * Display: User profile page
 *
 * Why Track Lineage?
 * - Debugging: Trace incorrect stats back to source
 * - Reprocessing: Rebuild derived views from source on schema change
 * - Compliance: Audit trail for data transformations
 *
 * Example Lineage Trace:
 * User complains: "My contribution graph shows 0 commits, but I pushed yesterday"
 * 1. Check user_contributions table (derived view) → 0 commits
 * 2. Check git log (system of record) → 5 commits found
 * 3. Check CDC stream topic → Processing lag (3 hours behind)
 * 4. Root cause: Stream processor crashed, restarting from checkpoint
 * 5. Fix: Restart processor, backfill missing 3 hours
 *
 * Rebuilding Derived Views (DDIA Ch. 12):
 *
 * Scenario: Need to add new field to repository_stats
 * Old schema: (repo_id, star_count, fork_count)
 * New schema: (repo_id, star_count, fork_count, open_issues_count)
 *
 * Rebuild Process:
 * 1. Create new table: repository_stats_v2
 * 2. Batch job: Recompute from system of record
 *    - SELECT repo_id, COUNT(*) FROM user_stars GROUP BY repo_id
 *    - SELECT repo_id, COUNT(*) FROM forks GROUP BY repo_id
 *    - SELECT repo_id, COUNT(*) FROM issues WHERE status = 'open' GROUP BY repo_id
 * 3. Join results and populate repository_stats_v2
 * 4. Switch application to use repository_stats_v2
 * 5. Drop old table repository_stats
 *
 * Advantage: No data loss, can always rebuild from immutable source
 *
 * Derived Views vs Distributed Transactions (DDIA Ch. 12):
 *
 * Traditional Approach (Distributed Transaction):
 * BEGIN TRANSACTION;
 *   INSERT INTO user_stars (user_id, repo_id);
 *   UPDATE repository_stats SET star_count = star_count + 1;
 * COMMIT;
 * - Pro: Strong consistency
 * - Con: Tight coupling, slower, locks required
 *
 * Derived View Approach (Eventual Consistency):
 * 1. Write to event log: INSERT INTO user_stars
 * 2. Async update derived view (1s delay)
 * - Pro: Loose coupling, faster writes, no locks
 * - Con: Temporary inconsistency (1s lag acceptable)
 *
 * Key Graph Queries (DDIA Ch. 2):
 * - Find all forks of a repository (graph traversal)
 * - Find contributors to a project (multi-hop query)
 * - Dependency graph between repositories
 * - Social graph: followers, following, collaborators
 */
export const githubProblemDefinition: ProblemDefinition = {
  id: 'github',
  title: 'GitHub - Code Hosting',
  description: `Design a code hosting platform like GitHub that:
- Users can host Git repositories
- Users can create pull requests and issues
- Platform supports code review and collaboration
- Users can fork and star repositories

Learning Objectives (DDIA Ch. 2, 3, 12):
1. Model relationships with graph database (DDIA Ch. 2)
   - Repository forks, stars, follows form a social graph
2. Understand Git's DAG structure (DDIA Ch. 2: Graph models)
   - Commits as nodes, parent commits as edges
3. Content-addressable storage with SHA hashing (DDIA Ch. 3)
4. Traverse dependency graphs efficiently (DDIA Ch. 2)
5. Design derived views from system of record (DDIA Ch. 12)
   - Separate immutable source (git commits) from derived data
   - Repository stats, contribution graphs, language statistics
6. Implement materialization strategies (DDIA Ch. 12)
   - Eager vs lazy vs hybrid materialization
   - Trade-offs: write latency vs read latency vs consistency
7. Build CDC pipelines for derived views (DDIA Ch. 12)
   - Change data capture from source tables
   - Stream processors update materialized views
8. Trace data lineage for debugging (DDIA Ch. 12)
   - Track transformations from source to derived views
   - Rebuild views from immutable source on schema changes
9. Compare derived views vs distributed transactions (DDIA Ch. 12)
   - Eventual consistency vs strong consistency trade-offs`,

  userFacingFRs: [
    'Users can host Git repositories',
    'Users can create pull requests and issues',
    'Users can fork and star repositories',
    'Platform supports code review and collaboration'
  ],

  userFacingNFRs: [
    'Fork traversal: < 100ms for 3-hop queries (DDIA Ch. 2: Graph queries)',
    'Content-addressable lookup: O(1) with SHA (DDIA Ch. 3)',
    'Git push: Handle 1000+ objects efficiently (DDIA Ch. 3: Pack files)',
    'Social graph queries: < 200ms (DDIA Ch. 2: Graph indexes)',
    'Derived view update: < 1s latency (DDIA Ch. 12: CDC stream processing)',
    'Star count accuracy: Eventually consistent (DDIA Ch. 12: Async materialization)',
    'Contribution graph: Daily batch update (DDIA Ch. 12: Batch processing)',
    'Code search index: < 5s after push (DDIA Ch. 12: Event-driven indexing)',
    'View rebuild: Zero downtime (DDIA Ch. 12: Blue-green deployment)',
    'Data lineage tracing: Full audit trail (DDIA Ch. 12: Track all transformations)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process git operations and web requests',
      },
      {
        type: 'storage',
        reason: 'Need to store repository metadata, issues, PRs',
      },
      {
        type: 'object_storage',
        reason: 'Need to store git repository data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends git and API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store git objects',
      },
    ],
    dataModel: {
      entities: ['user', 'repository', 'commit', 'pull_request', 'issue'],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'created_at'],
        repository: ['id', 'owner_id', 'name', 'description', 'is_private', 'stars', 'created_at'],
        commit: ['id', 'repo_id', 'author_id', 'message', 'sha', 'created_at'],
        pull_request: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
        issue: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Git pushes
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing repos
        { type: 'read_by_query', frequency: 'high' }, // Searching code
      ],
    },
  },

  scenarios: generateScenarios('github', problemConfigs.github, [
    'Users can host Git repositories',
    'Users can create pull requests and issues',
    'Users can fork and star repositories',
    'Platform supports code review and collaboration'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
repositories = {}
commits = {}
pull_requests = {}
issues = {}
stars = {}
forks = {}

def create_repository(repo_id: str, owner_id: str, name: str, description: str = "", is_private: bool = False) -> Dict:
    """
    FR-1: Users can host Git repositories
    Naive implementation - stores repository metadata
    """
    repositories[repo_id] = {
        'id': repo_id,
        'owner_id': owner_id,
        'name': name,
        'description': description,
        'is_private': is_private,
        'stars': 0,
        'created_at': datetime.now()
    }
    return repositories[repo_id]

def create_pull_request(pr_id: str, repo_id: str, author_id: str, title: str, base_branch: str, head_branch: str) -> Dict:
    """
    FR-2: Users can create pull requests
    Naive implementation - stores PR in memory
    """
    pull_requests[pr_id] = {
        'id': pr_id,
        'repo_id': repo_id,
        'author_id': author_id,
        'title': title,
        'base_branch': base_branch,
        'head_branch': head_branch,
        'status': 'open',
        'created_at': datetime.now()
    }
    return pull_requests[pr_id]

def create_issue(issue_id: str, repo_id: str, author_id: str, title: str, body: str = "") -> Dict:
    """
    FR-2: Users can create issues
    Naive implementation - stores issue in memory
    """
    issues[issue_id] = {
        'id': issue_id,
        'repo_id': repo_id,
        'author_id': author_id,
        'title': title,
        'body': body,
        'status': 'open',
        'created_at': datetime.now()
    }
    return issues[issue_id]

def fork_repository(fork_id: str, original_repo_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can fork repositories
    Naive implementation - creates copy of repo metadata
    """
    original = repositories.get(original_repo_id)
    if not original:
        return None

    repositories[fork_id] = {
        'id': fork_id,
        'owner_id': user_id,
        'name': original['name'],
        'description': original['description'],
        'is_private': False,
        'forked_from': original_repo_id,
        'stars': 0,
        'created_at': datetime.now()
    }

    forks[f"{original_repo_id}_{fork_id}"] = {
        'original_repo_id': original_repo_id,
        'fork_repo_id': fork_id,
        'created_at': datetime.now()
    }

    return repositories[fork_id]

def star_repository(user_id: str, repo_id: str) -> Dict:
    """
    FR-3: Users can star repositories
    Naive implementation - records star and increments count
    """
    star_id = f"{user_id}_{repo_id}"
    stars[star_id] = {
        'user_id': user_id,
        'repo_id': repo_id,
        'created_at': datetime.now()
    }

    if repo_id in repositories:
        repositories[repo_id]['stars'] += 1

    return stars[star_id]

def get_repository_pull_requests(repo_id: str, status: str = "open") -> List[Dict]:
    """
    Helper: Get pull requests for a repository
    Naive implementation - returns filtered PRs
    """
    repo_prs = []
    for pr in pull_requests.values():
        if pr['repo_id'] == repo_id and (status is None or pr['status'] == status):
            repo_prs.append(pr)
    return repo_prs
`,
};

// Auto-generate code challenges from functional requirements
(githubProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(githubProblemDefinition);
