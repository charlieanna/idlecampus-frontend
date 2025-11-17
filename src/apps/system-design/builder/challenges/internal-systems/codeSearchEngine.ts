import { Challenge } from '../../types/testCase';

export const codeSearchEngineChallenge: Challenge = {
  id: 'code_search_engine',
  title: 'Code Search Engine (Google Code Search style)',
  difficulty: 'advanced',
  description: `Design an internal code search engine similar to Google Code Search or Sourcegraph.

Engineers search across multiple repositories using regex patterns, find symbol definitions/references,
and navigate code. The system indexes millions of files and provides near-instant search results.

Example workflow:
- GET /search?q=function.*authenticate.*regex → Find all authentication functions
- GET /search?q=UserService&type=class → Find class definition
- GET /references?symbol=calculatePrice → Find all usages
- POST /index/repo/myrepo → Trigger repo reindex

Key challenges:
- Multi-repo search (1000+ repos, 10M+ files)
- Regex search support (can be expensive)
- Incremental indexing (index only changed files)
- Symbol cross-referencing (find all usages)`,

  requirements: {
    functional: [
      'Multi-repo search with regex support',
      'Symbol definition and reference finding',
      'Incremental indexing on git push',
      'Code navigation (jump to definition)',
      'Search ranking by relevance',
    ],
    traffic: '1000 RPS (95% reads, 5% indexing)',
    latency: 'p99 < 500ms for search, < 5min for incremental index',
    availability: '99.9% uptime (critical for developer productivity)',
    budget: '$5,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'search_engine',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Multi-Repo Search',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Search across multiple repositories with keyword queries.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 500,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'elasticsearch', config: { nodes: 3, shards: 10 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
          { type: 'redis', config: { memorySizeGB: 16 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'elasticsearch' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Architecture:
- Elasticsearch indexes all code files with inverted index
- S3 stores raw source files for displaying results
- Redis caches popular searches and file metadata
- App servers coordinate search and fetch source context`,
      },
    },

    {
      name: 'Regex Search Support',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Support regex patterns in search queries (expensive operation).',
      traffic: {
        type: 'read',
        rps: 50,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 2000, // Regex search can be slower
      },
      hints: [
        'Regex search is CPU-intensive - consider limiting scope',
        'Pre-filter with simple text search before regex matching',
        'Time-box regex execution (kill after 5 seconds)',
        'Cache regex results for common patterns',
      ],
    },

    {
      name: 'Symbol Definition Finding',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Find symbol definitions (classes, functions) across repositories.',
      traffic: {
        type: 'read',
        rps: 80,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 300,
      },
      hints: [
        'Build symbol index during code indexing (AST parsing)',
        'Store symbol metadata: name, type, file path, line number',
        'Language-specific parsers for accurate symbol extraction',
        'Handle multiple definitions (overloaded functions)',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High RPS Search Load',
      type: 'performance',
      requirement: 'NFR-P',
      description: '1000 RPS sustained search queries with p99 < 500ms.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 500,
      },
      hints: [
        'Shard Elasticsearch index by repository or file path',
        'Cache search results in Redis (1hr TTL)',
        'Pre-compute search rankings offline',
        'Use read replicas for search queries',
      ],
    },

    {
      name: 'Incremental Indexing Speed',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Index only changed files within 5 minutes of git push.',
      traffic: {
        type: 'write',
        rps: 5, // Git pushes
      },
      duration: 300, // 5 minutes
      passCriteria: {
        maxErrorRate: 0,
        maxIndexLatency: 300000, // 5 minutes
      },
      hints: [
        'Git webhook triggers indexing job',
        'Compare git commit tree to find changed files only',
        'Parallel indexing workers (one per file)',
        'Update Elasticsearch index incrementally (not full reindex)',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large Codebase Indexing',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Index 1000 repositories with 10M total files.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 500,
      },
      hints: [
        'Partition Elasticsearch by repository (easier sharding)',
        'Use document routing to co-locate repo files',
        'Compress source files in S3 (reduce storage cost)',
        'Limit index fields to reduce index size',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Search During Index Rebuild',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Searches continue to work during background re-indexing.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 600, // Slightly higher during indexing
      },
      hints: [
        'Use Elasticsearch index aliases for zero-downtime reindex',
        'Build new index, swap alias when done',
        'Throttle indexing to avoid impacting search performance',
        'Separate indexing and search clusters',
      ],
    },
  ],

  hints: [
    {
      category: 'Data Model',
      items: [
        'Elasticsearch document: { repo, path, content, symbols[], language }',
        'Symbol index: { name, type, repo, path, line, references[] }',
        'Inverted index on content for full-text search',
        'Separate indexes for code vs symbols',
      ],
    },
    {
      category: 'Indexing Pipeline',
      items: [
        'Git webhook → Message queue → Indexing workers',
        'Parse AST for symbol extraction (tree-sitter)',
        'Incremental indexing: git diff to find changed files',
        'Batch updates to Elasticsearch (bulk API)',
      ],
    },
    {
      category: 'Search Optimization',
      items: [
        'Pre-filter with simple text search before regex',
        'Cache popular queries in Redis (1hr TTL)',
        'Search result ranking: exact match > partial > fuzzy',
        'Limit regex scope to specific repos or file types',
      ],
    },
    {
      category: 'Cost Optimization',
      items: [
        'Compress code in S3 (save 60% storage)',
        'Only index recent repos (archive old ones)',
        'Use smaller Elasticsearch instance for dev/test',
        'Sampling for analytics (don\'t log every search)',
      ],
    },
  ],

  learningObjectives: [
    'Full-text search indexing strategies (inverted index)',
    'AST parsing for symbol extraction',
    'Incremental indexing with git diffs',
    'Regex search optimization and safety',
    'Zero-downtime index rebuilds',
  ],

  realWorldExample: `**Google Code Search:**
- Indexes entire Google monorepo (2B lines of code)
- Trigram indexing for fast regex search
- Custom ranking algorithm (frecency-based)
- Incremental indexing on every commit

**Sourcegraph:**
- Multi-repo search for enterprises
- Symbol navigation via LSP integration
- Batch changes across repos
- Search-based code intelligence`,

  pythonTemplate: `from elasticsearch import Elasticsearch
from typing import List, Dict
import re

class CodeSearchEngine:
    def __init__(self):
        self.es = Elasticsearch(['localhost:9200'])
        self.index_name = 'code_index'

    def index_file(self, repo: str, path: str, content: str):
        """Index a single source file."""
        # TODO: Parse AST to extract symbols
        # TODO: Create Elasticsearch document
        # TODO: Bulk index for performance
        pass

    def search(self, query: str, use_regex: bool = False) -> List[Dict]:
        """Search for code matching query."""
        if use_regex:
            # TODO: Pre-filter with text search first
            # TODO: Apply regex on filtered results
            # TODO: Time-box regex execution
            pass
        else:
            # TODO: Full-text search with Elasticsearch
            # TODO: Ranking by relevance
            pass
        return []

    def find_symbol(self, symbol_name: str, symbol_type: str = None) -> Dict:
        """Find symbol definition."""
        # TODO: Query symbol index
        # TODO: Return file path and line number
        pass

    def find_references(self, symbol_name: str) -> List[Dict]:
        """Find all references to a symbol."""
        # TODO: Query references index
        # TODO: Return all usage locations
        pass

    def incremental_index(self, repo: str, changed_files: List[str]):
        """Index only changed files."""
        # TODO: Delete old file documents
        # TODO: Index new file content
        # TODO: Update symbol index
        pass

# Example usage
if __name__ == '__main__':
    engine = CodeSearchEngine()

    # Index a file
    engine.index_file('my-repo', 'src/auth.py', 'def authenticate(user): ...')

    # Search
    results = engine.search('function authenticate')

    # Find symbol
    definition = engine.find_symbol('authenticate', 'function')

    # Find references
    usages = engine.find_references('authenticate')`,
};
