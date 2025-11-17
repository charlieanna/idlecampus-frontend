import { Challenge } from '../../types/testCase';

export const internalDocsPlatformChallenge: Challenge = {
  id: 'internal_docs_platform',
  title: 'Internal Documentation Platform (Wiki/Confluence style)',
  difficulty: 'advanced',
  description: `Design an internal documentation platform for engineering teams.

Supports wiki pages, API documentation, runbooks, and architecture diagrams. Engineers can
create/edit docs, search content, and control access. Docs are versioned and can be reviewed.

Example workflow:
- POST /docs → Create new doc page
- PUT /docs/:id → Edit page (creates new version)
- GET /docs/search?q=authentication → Search docs
- POST /docs/:id/review → Request review from team
- GET /docs/:id/versions → View edit history

Key challenges:
- Search relevance (prioritize recent, popular docs)
- Version control (track changes, diff viewing)
- Access control (team-based permissions)
- Rich content (code blocks, diagrams, embedded media)`,

  requirements: {
    functional: [
      'Create/edit docs with markdown and rich media',
      'Full-text search with relevance ranking',
      'Version history with diff viewing',
      'Team-based access control',
      'Review/approval workflow',
    ],
    traffic: '2000 RPS (90% reads, 10% writes)',
    latency: 'p99 < 200ms for reads, < 500ms for writes',
    availability: '99.9% uptime (critical for on-call runbooks)',
    budget: '$3,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'search_engine',
    's3',
    'cdn',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Doc Creation and Editing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Engineers can create and edit documentation pages.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.8,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 500,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'cdn', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 4 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 100 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
          { type: 's3', config: { storageSizeGB: 1000 } },
          { type: 'elasticsearch', config: { nodes: 2, shards: 5 } },
        ],
        connections: [
          { from: 'client', to: 'cdn' },
          { from: 'cdn', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'elasticsearch' },
        ],
        explanation: `Architecture:
- PostgreSQL stores doc metadata, versions, permissions
- S3 stores large attachments (images, videos, PDFs)
- Elasticsearch for full-text search
- Redis caches popular docs and search results
- CDN for static assets and rendered pages`,
      },
    },

    {
      name: 'Version History and Diff Viewing',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Track all edits with version history and show diffs between versions.',
      traffic: {
        type: 'read',
        rps: 30,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 400,
      },
      hints: [
        'Store full doc content for each version (not diffs) for fast retrieval',
        'Compute diffs on-demand using diff algorithm (Myers)',
        'Cache recent version diffs in Redis',
        'Consider git-based storage for version control',
      ],
    },

    {
      name: 'Team-Based Access Control',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Restrict doc access based on team membership.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 200,
      },
      hints: [
        'Doc permissions: public, team-restricted, private',
        'Cache user permissions in Redis (avoid DB lookup)',
        'Denormalize team memberships for fast checks',
        'Filter search results by access control',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Read Throughput',
      type: 'performance',
      requirement: 'NFR-P',
      description: '2000 RPS sustained reads with p99 < 200ms.',
      traffic: {
        type: 'read',
        rps: 2000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 200,
      },
      hints: [
        'Cache rendered HTML in Redis (5min TTL)',
        'Use CDN for static content (images, CSS)',
        'Read replicas for PostgreSQL',
        'Pre-render popular docs',
      ],
    },

    {
      name: 'Search Relevance and Speed',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Search returns relevant results in < 300ms.',
      traffic: {
        type: 'read',
        rps: 200,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 300,
      },
      hints: [
        'Ranking factors: recency, view count, edit frequency',
        'Boost runbooks and critical docs in results',
        'Cache popular searches (15min TTL)',
        'Use Elasticsearch function score for custom ranking',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large Document Corpus',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Handle 100K documents with 10M page views/month.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 250,
      },
      hints: [
        'Shard Elasticsearch by team or category',
        'Archive stale docs (not viewed in 1 year)',
        'Lazy-load embedded media (reduce page size)',
        'Use pagination for search results',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Critical Runbook Availability',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Runbooks must be available during outages (99.99% uptime).',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.0001,
        maxP99Latency: 200,
      },
      hints: [
        'Multi-region deployment for runbooks',
        'Local caching of critical docs',
        'Offline-first PWA for mobile access',
        'Separate "runbook mode" with minimal dependencies',
      ],
    },
  ],

  hints: [
    {
      category: 'Data Model',
      items: [
        'Docs table: id, title, slug, team_id, created_at, updated_at',
        'Versions table: doc_id, version_num, content, author, created_at',
        'Permissions table: doc_id, team_id, access_level',
        'Views table: doc_id, user_id, viewed_at (for popularity)',
      ],
    },
    {
      category: 'Search Implementation',
      items: [
        'Index on document create/update (async via message queue)',
        'Custom ranking: recency (30%) + views (40%) + edits (30%)',
        'Boost critical tags: "runbook", "oncall", "critical"',
        'Filter by access control before returning results',
      ],
    },
    {
      category: 'Version Control',
      items: [
        'Store full content per version (faster reads, more storage)',
        'Alternative: git-based storage (efficient, complex)',
        'Compute diffs on-demand (Myers diff algorithm)',
        'Limit version history to 100 versions (archive old ones)',
      ],
    },
    {
      category: 'Caching Strategy',
      items: [
        'L1: CDN (static assets, rendered pages)',
        'L2: Redis (doc content, search results, permissions)',
        'L3: Database (source of truth)',
        'Cache invalidation on edit: delete doc + all versions',
      ],
    },
  ],

  learningObjectives: [
    'Full-text search with custom relevance ranking',
    'Version control and diff algorithms',
    'Team-based access control implementation',
    'Multi-tier caching strategies',
    'High-availability for critical systems',
  ],

  realWorldExample: `**Confluence:**
- Wiki for enterprise teams
- Rich editor with macros and integrations
- Fine-grained permissions (spaces, pages)
- Analytics for page views and engagement

**Notion:**
- Block-based editor (flexible content)
- Real-time collaboration
- Hierarchical permissions
- Fast search with offline support

**Google Docs (internal):**
- Colossus storage for doc content
- Real-time collaboration (Operational Transform)
- Commenting and suggestions
- Integration with code search and tools`,

  pythonTemplate: `from typing import List, Dict, Optional
from datetime import datetime

class InternalDocsPlatform:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.cache = None  # Redis
        self.search = None  # Elasticsearch
        self.storage = None  # S3

    def create_doc(self, title: str, content: str, team_id: str, author: str) -> str:
        """Create a new documentation page."""
        # TODO: Generate unique slug from title
        # TODO: Store doc metadata in PostgreSQL
        # TODO: Store first version in versions table
        # TODO: Index doc in Elasticsearch
        # TODO: Return doc ID
        pass

    def edit_doc(self, doc_id: str, content: str, author: str) -> int:
        """Edit a doc (creates new version)."""
        # TODO: Check edit permissions
        # TODO: Get current version number
        # TODO: Insert new version row
        # TODO: Update doc updated_at timestamp
        # TODO: Invalidate cache
        # TODO: Re-index in Elasticsearch
        # TODO: Return new version number
        pass

    def get_doc(self, doc_id: str, version: Optional[int] = None) -> Dict:
        """Get doc content (latest or specific version)."""
        # TODO: Check read permissions
        # TODO: Try cache first (latest version only)
        # TODO: Query versions table
        # TODO: Cache result
        # TODO: Track view for analytics
        return {}

    def search_docs(self, query: str, user_id: str, limit: int = 20) -> List[Dict]:
        """Search docs with relevance ranking."""
        # TODO: Get user's team memberships
        # TODO: Query Elasticsearch with access filter
        # TODO: Custom scoring: recency + views + edits
        # TODO: Cache popular queries
        return []

    def get_version_diff(self, doc_id: str, from_version: int, to_version: int) -> str:
        """Compute diff between two versions."""
        # TODO: Check cache for diff
        # TODO: Fetch both versions
        # TODO: Compute Myers diff
        # TODO: Cache result
        return ""

    def check_access(self, doc_id: str, user_id: str) -> bool:
        """Check if user can read doc."""
        # TODO: Cache user permissions
        # TODO: Check doc visibility (public/team/private)
        # TODO: Check team membership
        return False

# Example usage
if __name__ == '__main__':
    platform = InternalDocsPlatform()

    # Create doc
    doc_id = platform.create_doc(
        title='Authentication Guide',
        content='# Auth\\n\\nUse OAuth 2.0...',
        team_id='platform-team',
        author='alice'
    )

    # Edit doc
    v2 = platform.edit_doc(doc_id, '# Auth\\n\\nUpdated guide...', 'bob')

    # Get doc
    doc = platform.get_doc(doc_id)

    # Search
    results = platform.search_docs('authentication', user_id='alice')

    # View diff
    diff = platform.get_version_diff(doc_id, from_version=1, to_version=2)`,
};
