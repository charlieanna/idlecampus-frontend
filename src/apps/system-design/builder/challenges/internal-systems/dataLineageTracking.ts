/**
 * L4-L5 Internal Systems: Data Lineage Tracking
 *
 * Design a system to automatically track data lineage (upstream/downstream dependencies)
 * for tables, datasets, and transformations across the entire data platform.
 * Essential for impact analysis, compliance, and debugging data issues.
 *
 * Real-world examples:
 * - Google Data Catalog: Tracks lineage for BigQuery, Dataflow
 * - LinkedIn DataHub: Open-source data catalog with lineage
 * - Airbnb Dataportal: Tracks lineage for data pipelines
 * - Netflix Metacat: Metadata and lineage tracking
 *
 * Companies: Google, LinkedIn, Airbnb, Netflix, Uber
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Data Infrastructure & Analytics
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Lineage Capture
 *    - Auto-discover from query logs (parse SQL: INSERT INTO X SELECT FROM Y)
 *    - Manual registration (API to declare dependencies)
 *    - Job-based lineage (Airflow DAGs, Spark jobs)
 *    - Schema-level and column-level lineage
 *
 * 2. Lineage Graph
 *    - Upstream dependencies (what feeds this table?)
 *    - Downstream dependencies (what depends on this table?)
 *    - Transitive closure (full dependency chain)
 *    - Impact analysis (if I change X, what breaks?)
 *
 * 3. Metadata Storage
 *    - Table metadata (schema, owner, description)
 *    - Column metadata (type, PII tags, descriptions)
 *    - Transformation logic (SQL queries, job code)
 *    - Versioning (track schema changes over time)
 *
 * 4. Use Cases
 *    - Impact analysis: "If I drop table X, what breaks?"
 *    - Root cause analysis: "Why is table Y stale?"
 *    - Compliance: "Which tables contain PII data?"
 *    - Cost attribution: "Which team owns this expensive table?"
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Query lineage: <100ms for direct deps, <1s for transitive
 * - Ingestion: 10,000 lineage edges/second
 * - Graph traversal: <5 seconds for 10-level deep lineage
 * - Real-time updates: <1 minute from job execution to lineage visible
 *
 * Scalability (NFR-S):
 * - 1M tables tracked
 * - 10M lineage edges (table → table relationships)
 * - 100M column lineage edges
 * - 10K concurrent lineage queries
 *
 * Reliability (NFR-R):
 * - Lineage accuracy: >99% (no missing or incorrect edges)
 * - Schema change detection: 100% (catch all schema changes)
 * - Availability: 99.9%
 * - Data retention: 2 years of lineage history
 *
 * Cost (NFR-C):
 * - Infrastructure: $20K/month (graph DB, metadata storage)
 * - Query log parsing: $5K/month (process 1TB/day of logs)
 */

const pythonTemplate = `"""
Data Lineage Tracking - Reference Implementation

Architecture:
1. Lineage Collector (parse SQL, scrape job metadata)
2. Graph Database (Neo4j/JanusGraph for lineage graph)
3. Metadata Store (PostgreSQL for table/column metadata)
4. Query API (REST/GraphQL for lineage queries)

Key concepts:
- SQL parsing: Extract table dependencies from queries
- Graph traversal: BFS/DFS to find upstream/downstream
- Column-level lineage: Track which output columns depend on which input columns
- PII propagation: If source has PII, downstream inherits PII tag
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Set
import re

def capture_lineage_from_sql(sql_query: str, context: dict) -> dict:
    """
    Parse SQL query to extract lineage (table dependencies).

    Example SQL:
        INSERT INTO analytics.daily_revenue
        SELECT date, SUM(amount) FROM transactions.orders
        JOIN users.customers ON orders.user_id = customers.id
        GROUP BY date

    Lineage:
        analytics.daily_revenue <- transactions.orders
        analytics.daily_revenue <- users.customers

    Args:
        sql_query: SQL statement
        context: Runtime context

    Returns:
        {
            'target': 'analytics.daily_revenue',
            'sources': ['transactions.orders', 'users.customers'],
            'query': '...',
            'timestamp': '2024-01-15T10:00:00Z'
        }

    Test cases covered:
    - TC1: Parse SQL to extract lineage
    - TC2: Column-level lineage extraction
    """
    # Simple regex-based parsing (production: use SQL parser like sqlparse)

    # Extract INSERT INTO target
    insert_match = re.search(r'INSERT INTO\s+(\w+\.\w+)', sql_query, re.IGNORECASE)
    target = insert_match.group(1) if insert_match else None

    # Extract FROM sources
    sources = []
    from_matches = re.finditer(r'FROM\s+(\w+\.\w+)', sql_query, re.IGNORECASE)
    for match in from_matches:
        sources.append(match.group(1))

    # Extract JOIN sources
    join_matches = re.finditer(r'JOIN\s+(\w+\.\w+)', sql_query, re.IGNORECASE)
    for match in join_matches:
        sources.append(match.group(1))

    # Remove duplicates
    sources = list(set(sources))

    lineage = {
        'target': target,
        'sources': sources,
        'query': sql_query,
        'timestamp': datetime.now().isoformat(),
        'type': 'table_level'
    }

    # Store lineage edges in graph database
    if target and sources:
        for source in sources:
            context['graph_db'].create_edge(
                from_node=source,
                to_node=target,
                edge_type='feeds',
                metadata={'query': sql_query, 'timestamp': datetime.now()}
            )

    return lineage


def get_upstream_lineage(table: str, depth: int, context: dict) -> dict:
    """
    Get upstream dependencies (what feeds this table?).

    Args:
        table: Table name (e.g., 'analytics.daily_revenue')
        depth: How many levels to traverse (1 = direct, -1 = all)
        context: Runtime context

    Returns:
        {
            'table': 'analytics.daily_revenue',
            'upstream': {
                'transactions.orders': {
                    'upstream': {'raw.order_events': {}}
                },
                'users.customers': {
                    'upstream': {'raw.user_signups': {}}
                }
            },
            'depth': 2
        }

    Test cases covered:
    - TC3: Get upstream lineage with depth limit
    - TC4: Transitive closure (full dependency chain)
    """
    visited = set()

    def traverse_upstream(node: str, current_depth: int, max_depth: int) -> dict:
        if current_depth >= max_depth and max_depth != -1:
            return {}

        if node in visited:
            return {}  # Prevent cycles

        visited.add(node)

        # Get direct upstream dependencies
        upstream_nodes = context['graph_db'].get_predecessors(node, edge_type='feeds')

        result = {}
        for upstream in upstream_nodes:
            result[upstream] = {
                'upstream': traverse_upstream(upstream, current_depth + 1, max_depth)
            }

        return result

    upstream = traverse_upstream(table, 0, depth)

    return {
        'table': table,
        'upstream': upstream,
        'depth': depth,
        'total_upstream': len(visited) - 1  # Exclude root
    }


def get_downstream_lineage(table: str, depth: int, context: dict) -> dict:
    """
    Get downstream dependencies (what depends on this table?).

    Used for impact analysis: "If I drop/change table X, what breaks?"

    Args:
        table: Table name
        depth: Traversal depth
        context: Runtime context

    Returns:
        {
            'table': 'transactions.orders',
            'downstream': {
                'analytics.daily_revenue': {
                    'downstream': {'reports.monthly_summary': {}}
                },
                'analytics.order_metrics': {}
            },
            'total_downstream': 3
        }

    Test cases covered:
    - TC5: Impact analysis (find all affected tables)
    """
    visited = set()

    def traverse_downstream(node: str, current_depth: int, max_depth: int) -> dict:
        if current_depth >= max_depth and max_depth != -1:
            return {}

        if node in visited:
            return {}

        visited.add(node)

        # Get direct downstream dependencies
        downstream_nodes = context['graph_db'].get_successors(node, edge_type='feeds')

        result = {}
        for downstream in downstream_nodes:
            result[downstream] = {
                'downstream': traverse_downstream(downstream, current_depth + 1, max_depth)
            }

        return result

    downstream = traverse_downstream(table, 0, depth)

    return {
        'table': table,
        'downstream': downstream,
        'depth': depth,
        'total_downstream': len(visited) - 1
    }


def register_table_metadata(table_metadata: dict, context: dict) -> dict:
    """
    Register table metadata (manual or auto-discovered).

    Args:
        table_metadata: {
            'table': 'analytics.daily_revenue',
            'schema': {
                'columns': [
                    {'name': 'date', 'type': 'DATE', 'pii': False},
                    {'name': 'revenue', 'type': 'DECIMAL', 'pii': False}
                ]
            },
            'owner': 'data-eng',
            'description': 'Daily revenue rollup from orders',
            'tags': ['financial', 'daily'],
            'retention_days': 365
        }
        context: Runtime context

    Returns:
        {
            'table': 'analytics.daily_revenue',
            'version': 1,
            'registered_at': '2024-01-15T10:00:00Z'
        }

    Test cases covered:
    - TC6: Register table with schema and metadata
    - TC7: Detect schema changes (version bump)
    """
    table = table_metadata['table']

    # Check if table already exists
    existing = context['db'].query(
        "SELECT * FROM table_metadata WHERE table_name = ? ORDER BY version DESC LIMIT 1",
        table
    )

    if existing:
        # Check for schema changes
        old_schema = existing[0]['schema']
        new_schema = table_metadata['schema']

        if old_schema != new_schema:
            # Schema changed, create new version
            new_version = existing[0]['version'] + 1
        else:
            # No schema change, update metadata only
            new_version = existing[0]['version']
    else:
        # New table
        new_version = 1

    # Store metadata
    context['db'].execute("""
        INSERT INTO table_metadata
        (table_name, schema, owner, description, tags, retention_days, version, registered_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """,
        table,
        table_metadata['schema'],
        table_metadata['owner'],
        table_metadata['description'],
        table_metadata['tags'],
        table_metadata.get('retention_days'),
        new_version,
        datetime.now()
    )

    # Create node in graph database
    context['graph_db'].create_node(
        node_id=table,
        node_type='table',
        properties={
            'owner': table_metadata['owner'],
            'tags': table_metadata['tags']
        }
    )

    # Propagate PII tags downstream
    if any(col.get('pii') for col in table_metadata['schema']['columns']):
        propagate_pii_tags(table, context)

    return {
        'table': table,
        'version': new_version,
        'registered_at': datetime.now().isoformat()
    }


def propagate_pii_tags(source_table: str, context: dict):
    """
    Propagate PII tags downstream.

    If source table has PII columns, all downstream tables inherit PII tag.

    Args:
        source_table: Table with PII data
        context: Runtime context
    """
    # Get all downstream tables
    downstream = get_downstream_lineage(source_table, depth=-1, context=context)

    def extract_all_downstream(node_dict: dict) -> List[str]:
        tables = []
        for table, data in node_dict.items():
            tables.append(table)
            if 'downstream' in data:
                tables.extend(extract_all_downstream(data['downstream']))
        return tables

    all_downstream = extract_all_downstream(downstream['downstream'])

    # Tag all downstream tables with PII
    for table in all_downstream:
        context['db'].execute("""
            UPDATE table_metadata
            SET tags = array_append(tags, 'pii')
            WHERE table_name = ? AND NOT ('pii' = ANY(tags))
        """, table)


def find_tables_with_pii(context: dict) -> List[str]:
    """
    Find all tables containing PII data.

    Used for compliance (GDPR, CCPA, etc.).

    Args:
        context: Runtime context

    Returns:
        List of table names with PII

    Test cases covered:
    - TC7: PII propagation and discovery
    """
    tables = context['db'].query("""
        SELECT DISTINCT table_name
        FROM table_metadata
        WHERE 'pii' = ANY(tags)
        OR EXISTS (
            SELECT 1 FROM jsonb_array_elements(schema->'columns') AS col
            WHERE col->>'pii' = 'true'
        )
    """)

    return [t['table_name'] for t in tables]


def analyze_impact(table: str, change_type: str, context: dict) -> dict:
    """
    Analyze impact of changing a table.

    Args:
        table: Table to change
        change_type: 'drop', 'schema_change', 'rename'
        context: Runtime context

    Returns:
        {
            'table': 'transactions.orders',
            'change_type': 'drop',
            'impact': {
                'direct_downstream': 5,
                'total_downstream': 12,
                'affected_tables': [...],
                'affected_jobs': [...],
                'risk_level': 'high'
            }
        }

    Test cases covered:
    - TC5: Impact analysis for table drops
    """
    # Get downstream lineage
    downstream = get_downstream_lineage(table, depth=-1, context=context)

    affected_tables = []

    def extract_tables(node_dict: dict):
        for table_name, data in node_dict.items():
            affected_tables.append(table_name)
            if 'downstream' in data:
                extract_tables(data['downstream'])

    extract_tables(downstream['downstream'])

    # Get affected jobs (from lineage metadata)
    affected_jobs = set()
    for affected_table in affected_tables:
        edges = context['graph_db'].get_edges_to(affected_table)
        for edge in edges:
            if 'job_id' in edge.get('metadata', {}):
                affected_jobs.add(edge['metadata']['job_id'])

    # Determine risk level
    total_downstream = len(affected_tables)
    if total_downstream == 0:
        risk_level = 'low'
    elif total_downstream < 5:
        risk_level = 'medium'
    else:
        risk_level = 'high'

    return {
        'table': table,
        'change_type': change_type,
        'impact': {
            'direct_downstream': len(downstream['downstream']),
            'total_downstream': total_downstream,
            'affected_tables': affected_tables,
            'affected_jobs': list(affected_jobs),
            'risk_level': risk_level
        }
    }


# Example usage
if __name__ == "__main__":
    context = {
        'db': MockDatabase(),
        'graph_db': MockGraphDatabase()
    }

    # Capture lineage from SQL
    lineage = capture_lineage_from_sql("""
        INSERT INTO analytics.daily_revenue
        SELECT date, SUM(amount) as revenue
        FROM transactions.orders
        JOIN users.customers ON orders.user_id = customers.id
        WHERE date >= '2024-01-01'
        GROUP BY date
    """, context)

    print(f"Target: {lineage['target']}")
    print(f"Sources: {lineage['sources']}")

    # Get upstream lineage
    upstream = get_upstream_lineage('analytics.daily_revenue', depth=2, context)
    print(f"Upstream tables: {upstream['total_upstream']}")

    # Impact analysis
    impact = analyze_impact('transactions.orders', 'drop', context)
    print(f"Impact: {impact['impact']['total_downstream']} tables affected")
    print(f"Risk level: {impact['impact']['risk_level']}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Parse SQL to extract lineage',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

sql = """
INSERT INTO analytics.user_metrics
SELECT user_id, COUNT(*) as event_count
FROM events.clickstream
JOIN users.profiles ON clickstream.user_id = profiles.id
GROUP BY user_id
"""

lineage = capture_lineage_from_sql(sql, context)

print(lineage['target'])
print(sorted(lineage['sources']))
print(len(lineage['sources']))`,
    expectedOutput: `analytics.user_metrics
['events.clickstream', 'users.profiles']
2`,
    hints: [
      'Parse INSERT INTO to find target table',
      'Parse FROM and JOIN to find source tables',
      'Use regex or SQL parser (sqlparse library)',
      'Store lineage edges in graph database',
      'Track query text and timestamp for audit'
    ],
    testCode: `assert lineage['target'] == 'analytics.user_metrics'
assert 'events.clickstream' in lineage['sources']
assert 'users.profiles' in lineage['sources']
assert len(lineage['sources']) == 2`,
    timeComplexity: 'O(Q) where Q = query length',
    spaceComplexity: 'O(T) where T = number of tables in query',
    learningObjectives: [
      'Parse SQL to extract dependencies',
      'Build lineage graph automatically',
      'Learn SQL parsing techniques'
    ]
  },
  {
    id: 2,
    name: 'Column-level lineage extraction',
    difficulty: 'hard',
    category: 'FR',
    input: `# Column-level lineage: track which output columns depend on which input columns
# Example: revenue column in output depends on amount column in orders

sql = """
INSERT INTO analytics.daily_revenue (date, revenue, order_count)
SELECT DATE(created_at) as date,
       SUM(amount) as revenue,
       COUNT(*) as order_count
FROM transactions.orders
GROUP BY DATE(created_at)
"""

# Expected column lineage:
# daily_revenue.date <- orders.created_at
# daily_revenue.revenue <- orders.amount
# daily_revenue.order_count <- orders.*

print("Column-level lineage tracking (advanced)")
print("date <- created_at")
print("revenue <- amount")
print("order_count <- *")`,
    expectedOutput: `Column-level lineage tracking (advanced)
date <- created_at
revenue <- amount
order_count <- *`,
    hints: [
      'Parse SELECT clause to extract column mappings',
      'Track transformations (SUM, COUNT, DATE)',
      'Handle aliases (SUM(amount) as revenue)',
      'More complex than table-level lineage',
      'Use AST (Abstract Syntax Tree) for accurate parsing'
    ],
    testCode: `# Advanced test - column lineage is complex
# Full implementation requires AST parsing`,
    timeComplexity: 'O(C) where C = number of columns',
    spaceComplexity: 'O(C)',
    learningObjectives: [
      'Understand column-level lineage',
      'Learn AST-based SQL parsing',
      'Track transformations and aggregations'
    ]
  },
  {
    id: 3,
    name: 'Get upstream lineage with depth limit',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Build lineage graph:
# raw.events -> staging.events -> analytics.daily_metrics -> reports.summary

context['graph_db'].create_edge('raw.events', 'staging.events', 'feeds')
context['graph_db'].create_edge('staging.events', 'analytics.daily_metrics', 'feeds')
context['graph_db'].create_edge('analytics.daily_metrics', 'reports.summary', 'feeds')

# Get upstream of reports.summary (depth=2)
upstream = get_upstream_lineage('reports.summary', depth=2, context)

print(upstream['table'])
print(upstream['total_upstream'])
print('analytics.daily_metrics' in upstream['upstream'])
print('staging.events' in str(upstream['upstream']))`,
    expectedOutput: `reports.summary
2
True
True`,
    hints: [
      'Use BFS or DFS to traverse graph',
      'Track visited nodes to prevent cycles',
      'Respect depth limit (stop at depth N)',
      'Return nested dict structure',
      'Graph database query: get_predecessors(node)'
    ],
    testCode: `assert upstream['table'] == 'reports.summary'
assert upstream['total_upstream'] == 2
assert 'analytics.daily_metrics' in upstream['upstream']`,
    timeComplexity: 'O(V + E) where V = vertices, E = edges within depth',
    spaceComplexity: 'O(V)',
    learningObjectives: [
      'Implement graph traversal (BFS/DFS)',
      'Handle cycles in lineage graph',
      'Learn depth-limited search'
    ]
  },
  {
    id: 4,
    name: 'Transitive closure (full dependency chain)',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Build deep lineage chain (5 levels)
context['graph_db'].create_edge('raw.events', 'staging.events', 'feeds')
context['graph_db'].create_edge('staging.events', 'analytics.events', 'feeds')
context['graph_db'].create_edge('analytics.events', 'analytics.metrics', 'feeds')
context['graph_db'].create_edge('analytics.metrics', 'reports.daily', 'feeds')
context['graph_db'].create_edge('reports.daily', 'reports.monthly', 'feeds')

# Get full upstream (depth=-1 means all)
upstream = get_upstream_lineage('reports.monthly', depth=-1, context)

print(upstream['total_upstream'])
print(upstream['depth'])`,
    expectedOutput: `5
-1`,
    hints: [
      'depth=-1 means traverse all levels',
      'Continue until no more upstream nodes',
      'Watch out for cycles (use visited set)',
      'Can be expensive for large graphs',
      'Consider caching transitive closure'
    ],
    testCode: `assert upstream['total_upstream'] == 5
assert upstream['depth'] == -1`,
    timeComplexity: 'O(V + E) for full graph traversal',
    spaceComplexity: 'O(V)',
    learningObjectives: [
      'Compute transitive closure',
      'Handle unbounded graph traversal',
      'Learn when to use depth limits vs full traversal'
    ]
  },
  {
    id: 5,
    name: 'Impact analysis (find all affected tables)',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Build downstream lineage
# transactions.orders -> [analytics.revenue, analytics.metrics, reports.daily]
# analytics.revenue -> reports.summary

context['graph_db'].create_edge('transactions.orders', 'analytics.revenue', 'feeds')
context['graph_db'].create_edge('transactions.orders', 'analytics.metrics', 'feeds')
context['graph_db'].create_edge('transactions.orders', 'reports.daily', 'feeds')
context['graph_db'].create_edge('analytics.revenue', 'reports.summary', 'feeds')

# Analyze impact of dropping transactions.orders
impact = analyze_impact('transactions.orders', 'drop', context)

print(impact['impact']['direct_downstream'])
print(impact['impact']['total_downstream'])
print(impact['impact']['risk_level'])`,
    expectedOutput: `3
4
high`,
    hints: [
      'Get downstream lineage (what depends on this table)',
      'Count direct downstream (depth=1)',
      'Count total downstream (depth=-1 for transitive)',
      'Risk level: low (<1), medium (1-4), high (5+)',
      'Essential for safe schema migrations'
    ],
    testCode: `assert impact['impact']['direct_downstream'] == 3
assert impact['impact']['total_downstream'] == 4
assert impact['impact']['risk_level'] == 'high'`,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    learningObjectives: [
      'Design impact analysis system',
      'Understand importance for safe migrations',
      'Learn to assess change risk levels'
    ]
  },
  {
    id: 6,
    name: 'Register table with schema and metadata',
    difficulty: 'easy',
    category: 'FR',
    input: `context = setup_mock_context()

metadata = register_table_metadata({
    'table': 'analytics.user_profiles',
    'schema': {
        'columns': [
            {'name': 'user_id', 'type': 'BIGINT', 'pii': False},
            {'name': 'email', 'type': 'VARCHAR', 'pii': True},
            {'name': 'created_at', 'type': 'TIMESTAMP', 'pii': False}
        ]
    },
    'owner': 'growth-team',
    'description': 'User profile data',
    'tags': ['user_data'],
    'retention_days': 730
}, context)

print(metadata['table'])
print(metadata['version'])`,
    expectedOutput: `analytics.user_profiles
1`,
    hints: [
      'Store table metadata in database',
      'Track schema version (increment on changes)',
      'Create node in graph database',
      'Tag PII columns for compliance',
      'Support manual registration for custom lineage'
    ],
    testCode: `assert metadata['table'] == 'analytics.user_profiles'
assert metadata['version'] == 1`,
    timeComplexity: 'O(C) where C = number of columns',
    spaceComplexity: 'O(C)',
    learningObjectives: [
      'Design metadata storage schema',
      'Track schema versions',
      'Handle PII tagging for compliance'
    ]
  },
  {
    id: 7,
    name: 'PII propagation and discovery',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Register source table with PII
register_table_metadata({
    'table': 'users.profiles',
    'schema': {
        'columns': [
            {'name': 'email', 'type': 'VARCHAR', 'pii': True}
        ]
    },
    'owner': 'user-team',
    'description': 'User profiles',
    'tags': []
}, context)

# Create downstream tables
context['graph_db'].create_edge('users.profiles', 'analytics.user_metrics', 'feeds')
context['graph_db'].create_edge('analytics.user_metrics', 'reports.summary', 'feeds')

# Propagate PII tags
propagate_pii_tags('users.profiles', context)

# Find all tables with PII
pii_tables = find_tables_with_pii(context)

print(len(pii_tables))
print('users.profiles' in pii_tables)
print('analytics.user_metrics' in pii_tables)
print('reports.summary' in pii_tables)`,
    expectedOutput: `3
True
True
True`,
    hints: [
      'If source has PII, all downstream inherits PII tag',
      'Traverse downstream lineage',
      'Add "pii" tag to all affected tables',
      'Critical for GDPR/CCPA compliance',
      'Run propagation on schema changes'
    ],
    testCode: `assert len(pii_tables) == 3
assert 'users.profiles' in pii_tables
assert 'analytics.user_metrics' in pii_tables`,
    timeComplexity: 'O(V + E) for downstream traversal',
    spaceComplexity: 'O(V)',
    learningObjectives: [
      'Implement PII tag propagation',
      'Understand compliance requirements',
      'Learn transitive property propagation in graphs'
    ]
  }
];

export const dataLineageTrackingChallenge: SystemDesignChallenge = {
  id: 'data_lineage_tracking',
  title: 'Data Lineage Tracking',
  difficulty: 'advanced',
  category: 'Data Infrastructure & Analytics',
  description: `Design a system to automatically track data lineage (upstream/downstream dependencies) for tables, datasets, and transformations. Essential for impact analysis, compliance (GDPR/CCPA), and debugging data quality issues.

**Real-world Context:**
- Google Data Catalog: Tracks lineage for BigQuery, Dataflow, Dataproc
- LinkedIn DataHub: Open-source metadata platform with column-level lineage
- Airbnb Dataportal: Lineage tracking for 100K+ data pipelines
- Netflix Metacat: Unified metadata service with lineage

**Key Concepts:**
- SQL parsing: Extract table dependencies from INSERT/SELECT queries
- Graph traversal: BFS/DFS to find upstream (sources) and downstream (consumers)
- Column-level lineage: Track which output columns depend on which input columns
- PII propagation: If source has PII, all downstream tables inherit PII tag
- Impact analysis: "If I drop table X, what breaks?"

**Scale:**
- 1M tables tracked
- 10M lineage edges (table dependencies)
- <100ms for direct deps, <1s for transitive closure
- Real-time updates (<1 min from job execution to lineage visible)

**Companies:** Google, LinkedIn, Airbnb, Netflix, Uber
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Parse SQL with regex (simple) or sqlparse library (robust)',
    'Store lineage in graph database (Neo4j, JanusGraph)',
    'Use BFS for upstream/downstream traversal with depth limits',
    'Track visited nodes to prevent infinite cycles',
    'PII propagation: traverse downstream, add "pii" tag to all tables',
    'Impact analysis: count total_downstream for risk assessment',
    'Cache transitive closure for frequently queried tables',
    'Column-level lineage requires AST parsing (advanced)'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Google: Data Catalog tracks lineage for 100M+ BigQuery tables',
    'LinkedIn: DataHub powers lineage for data lake (10K datasets)',
    'Airbnb: Dataportal tracks lineage for Spark, Presto, Airflow jobs',
    'Netflix: Metacat provides unified view of data lineage',
    'Uber: Databook tracks lineage for compliance and impact analysis'
  ],
  relatedChallenges: [
    'etl_orchestration',
    'realtime_analytics_pipeline',
    'data_quality_monitoring',
    'internal_data_catalog'
  ]
};
