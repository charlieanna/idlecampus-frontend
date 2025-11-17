import { Challenge } from '../../types/testCase';

export const internalDataCatalogChallenge: Challenge = {
  id: 'internal_data_catalog',
  title: 'Internal Data Catalog (Amundsen/DataHub style)',
  difficulty: 'advanced',
  description: `Design an internal data catalog for discovering and understanding datasets.

Engineers search for tables, view schema/stats, understand lineage, and discover popular datasets.
Auto-tag tables with PII/sensitive data, track usage metrics, and provide quality scores.

Example workflow:
- GET /search?q=user → Find all user-related tables
- GET /tables/:id → View schema, stats, lineage, owners
- GET /tables/:id/lineage → Upstream/downstream dependencies
- POST /tables/:id/tag → Add PII tag

Key challenges:
- Metadata extraction from multiple sources (DBs, warehouses, data lakes)
- Column-level lineage tracking
- PII auto-detection
- Usage-based relevance ranking`,

  requirements: {
    functional: [
      'Metadata indexing from databases/warehouses',
      'Full-text search with relevance ranking',
      'Column-level lineage visualization',
      'Auto-tagging (PII, sensitive data)',
      'Usage metrics (query frequency, users)',
    ],
    traffic: '1000 RPS (search and metadata queries)',
    latency: 'p99 < 300ms for search',
    availability: '99.9% uptime',
    budget: '$4,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'search_engine',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Metadata Extraction and Indexing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Auto-extract metadata from databases and data warehouses.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        metadataCompleteness: 0.95,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 300, writeCapacity: 100 } },
          { type: 'elasticsearch', config: { nodes: 3, shards: 10 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
          { type: 'kafka', config: { partitions: 10 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'elasticsearch' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- Extractors poll databases for schema changes
- PostgreSQL stores metadata, owners, tags
- Elasticsearch for full-text search
- Redis caches popular tables
- Kafka for metadata update events`,
      },
    },

    {
      name: 'Column-Level Lineage',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Track column-level lineage (which columns derive from which).',
      traffic: {
        type: 'read',
        rps: 50,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 500,
        lineageAccuracy: 0.9,
      },
      hints: [
        'Parse SQL queries to extract column dependencies',
        'Build DAG: source_table.col → transform → dest_table.col',
        'Store in graph database (Neo4j)',
        'Handle complex transformations (joins, aggregations)',
      ],
    },

    {
      name: 'PII Auto-Detection',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Automatically detect and tag PII columns.',
      traffic: {
        type: 'mixed',
        rps: 30,
        readRatio: 0.8,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        piiDetectionAccuracy: 0.95,
      },
      hints: [
        'Column name patterns: email, ssn, phone, address',
        'Sample data analysis (regex patterns)',
        'ML classifier for PII detection',
        'Tag: PII, PCI, GDPR, CCPA',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Fast Search with Ranking',
      type: 'performance',
      requirement: 'NFR-P',
      description: '1000 RPS search with relevance ranking.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 300,
      },
      hints: [
        'Ranking: usage frequency (40%) + recency (30%) + popularity (30%)',
        'Boost certified/curated tables',
        'Cache popular searches (1hr TTL)',
        'Auto-complete for table names',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large Catalog Scale',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Index 100K tables with 10M columns.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 350,
      },
      hints: [
        'Shard Elasticsearch by database/warehouse',
        'Archive inactive tables (not queried in 1 year)',
        'Lazy-load column details',
        'Pagination for large result sets',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Metadata Freshness',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Metadata is up-to-date within 1 hour.',
      traffic: {
        type: 'mixed',
        rps: 200,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        metadataFreshness: 3600, // 1 hour
      },
      hints: [
        'Poll databases every 15 minutes',
        'Event-driven updates (table created/dropped)',
        'Incremental extraction (only changes)',
        'Show last_updated timestamp',
      ],
    },
  ],

  hints: [
    {
      category: 'Metadata Extraction',
      items: [
        'INFORMATION_SCHEMA for schema metadata',
        'ANALYZE for table statistics (row count, size)',
        'Query logs for usage metrics',
        'Git repos for ownership (CODEOWNERS)',
      ],
    },
    {
      category: 'Search Ranking',
      items: [
        'Factors: query frequency, unique users, recency',
        'Boost: certified tables, high quality score',
        'Personalization: User\'s team tables first',
        'Typo tolerance with fuzzy matching',
      ],
    },
    {
      category: 'Lineage Tracking',
      items: [
        'SQL parser extracts table/column refs',
        'Build DAG: SELECT user_id FROM users → user_events.user_id',
        'Handle CTEs, subqueries, joins',
        'Propagate PII tags via lineage',
      ],
    },
    {
      category: 'Quality Scoring',
      items: [
        'Dimensions: completeness, freshness, usage, documentation',
        'Completeness: % non-null values',
        'Freshness: Last update time',
        'Usage: Query frequency',
      ],
    },
  ],

  learningObjectives: [
    'Metadata extraction from heterogeneous sources',
    'Full-text search with custom relevance ranking',
    'Data lineage tracking and visualization',
    'PII detection and auto-tagging',
    'Data quality scoring',
  ],

  realWorldExample: `**Amundsen (Lyft):**
- Metadata from Hive, Redshift, Presto
- Usage metrics from query logs
- Neo4j for lineage graph
- Elasticsearch for search

**DataHub (LinkedIn):**
- Metadata as a service (MaaS)
- Unified metadata model
- GraphQL API
- Kafka for change events

**Google Data Catalog:**
- Auto-discovery from BigQuery, Cloud SQL
- Column-level lineage
- DLP integration for PII detection
- Tag templates for classification`,

  pythonTemplate: `from typing import List, Dict
import re

class InternalDataCatalog:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.search = None  # Elasticsearch
        self.cache = None  # Redis
        self.lineage_db = None  # Neo4j

    def extract_metadata(self, source: str, connection: str) -> List[Dict]:
        """Extract metadata from data source."""
        # TODO: Connect to source (DB, warehouse)
        # TODO: Query INFORMATION_SCHEMA for tables/columns
        # TODO: Get statistics (row count, size, last_modified)
        # TODO: Store in PostgreSQL
        # TODO: Index in Elasticsearch
        return []

    def search_tables(self, query: str, user_id: str, limit: int = 20) -> List[Dict]:
        """Search for tables with relevance ranking."""
        # TODO: Query Elasticsearch
        # TODO: Rank by usage + recency + popularity
        # TODO: Boost user's team tables
        # TODO: Return results with highlights
        return []

    def get_table_details(self, table_id: str) -> Dict:
        """Get table metadata, schema, stats."""
        # TODO: Check cache
        # TODO: Query PostgreSQL for metadata
        # TODO: Get usage stats
        # TODO: Get lineage summary
        # TODO: Cache result
        return {}

    def build_lineage(self, table_id: str, direction: str = 'both') -> Dict:
        """Build lineage graph for table."""
        # TODO: Query Neo4j for upstream/downstream
        # TODO: Traverse graph to depth 3
        # TODO: Return nodes and edges
        return {'nodes': [], 'edges': []}

    def detect_pii(self, table_id: str) -> List[str]:
        """Auto-detect PII columns."""
        # TODO: Get column names
        # TODO: Check name patterns (email, ssn, phone)
        # TODO: Sample data and run regex
        # TODO: Apply ML classifier
        # TODO: Return PII column names
        return ['email', 'ssn', 'phone']

    def add_tag(self, table_id: str, tag: str, user_id: str):
        """Add tag to table."""
        # TODO: Validate tag
        # TODO: Store in tags table
        # TODO: Re-index in Elasticsearch
        # TODO: Track who added tag
        pass

    def track_usage(self, table_id: str, query_id: str, user_id: str):
        """Track table usage from query logs."""
        # TODO: Increment query count
        # TODO: Add to unique users set
        # TODO: Update last_accessed timestamp
        # TODO: Update search ranking
        pass

    def calculate_quality_score(self, table_id: str) -> float:
        """Calculate data quality score."""
        # TODO: Completeness: % non-null
        # TODO: Freshness: Days since update
        # TODO: Usage: Query frequency
        # TODO: Documentation: Has description/owner
        # TODO: Weighted sum
        return 0.85  # 85% quality

# Example usage
if __name__ == '__main__':
    catalog = InternalDataCatalog()

    # Extract metadata
    catalog.extract_metadata('postgres', 'host=db.example.com')

    # Search
    results = catalog.search_tables('user', user_id='alice')

    # Get details
    table = catalog.get_table_details('public.users')

    # Lineage
    lineage = catalog.build_lineage('public.users', direction='downstream')

    # Detect PII
    pii_columns = catalog.detect_pii('public.users')

    # Add tag
    catalog.add_tag('public.users', 'PII', user_id='alice')`,
};
