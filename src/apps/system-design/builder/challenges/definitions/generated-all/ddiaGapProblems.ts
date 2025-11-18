import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Gap Problems - Filling missing concepts from "Designing Data-Intensive Applications"
 * Total: 5 problems
 *
 * These problems specifically address gaps in DDIA coverage:
 * 1. Batch Processing (Ch 10) - MapReduce/Spark
 * 2. Partitioning (Ch 6) - Explicit sharding design
 * 3. Transactions (Ch 7) - Isolation levels
 * 4. Data Warehousing (Ch 3) - OLAP/columnar storage
 * 5. Graph Databases (Ch 2) - Graph traversal
 */

/**
 * Batch Processing with MapReduce/Spark
 * DDIA Chapter 10: Batch Processing
 */
export const batchProcessingMapreduceProblemDefinition: ProblemDefinition = {
  id: 'batch-processing-mapreduce',
  title: 'Batch Processing Pipeline (MapReduce/Spark)',
  description: `Design a batch processing pipeline to analyze 1PB of web server logs daily. Process access logs, clickstreams, and user events to generate daily analytics reports, user behavior patterns, and recommendation data. Support MapReduce-style fault tolerance and handle stragglers.

Key requirements:
- Process 1PB of compressed log files daily (100TB raw per hour)
- Generate aggregated reports within 6-hour batch window
- Support complex joins across multiple datasets
- Handle node failures during processing
- Enable reprocessing of historical data`,

  userFacingFRs: [
    'Ingest and decompress 1PB of daily logs from distributed storage',
    'Run MapReduce-style jobs for log aggregation and analysis',
    'Support multi-stage data pipelines (map → shuffle → reduce)',
    'Generate daily reports: page views, unique users, conversion funnels',
    'Enable ad-hoc SQL queries on processed data',
    'Support backfilling historical data (1 year retention)',
    'Handle stragglers and task failures with speculative execution',
  ],
  userFacingNFRs: [
    'Latency: Complete daily batch job within 6 hours',
    'Throughput: Process 50GB/sec sustained, 100GB/sec peak',
    'Dataset Size: 1PB raw logs daily, 365PB yearly retention',
    'Availability: Tolerate 10% node failures during job execution',
    'Fault tolerance: Automatic task retry, speculative execution for stragglers',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need distributed file system (HDFS-like) for input/output data',
      },
      {
        type: 'compute',
        reason: 'Need worker nodes for map and reduce tasks',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Workers read from and write to distributed storage',
      },
    ],
    dataModel: {
      entities: ['logs', 'jobs', 'reports'],
      fields: {
        logs: ['timestamp', 'user_id', 'url', 'event_type', 'session_id'],
        jobs: ['job_id', 'status', 'start_time', 'end_time'],
        reports: ['date', 'metric', 'value', 'dimensions'],
      },
      accessPatterns: [
        { type: 'scan', frequency: 'high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('batch-processing-mapreduce', problemConfigs['batch-processing-mapreduce'] || {
    baseRps: 0,
    readRatio: 0,
    maxLatency: 21600000, // 6 hours
    availability: 0.99,
  }, [
    'Ingest and decompress 1PB of daily logs from distributed storage',
    'Run MapReduce-style jobs for log aggregation and analysis',
    'Support multi-stage data pipelines (map → shuffle → reduce)',
    'Generate daily reports: page views, unique users, conversion funnels',
    'Enable ad-hoc SQL queries on processed data',
    'Support backfilling historical data (1 year retention)',
    'Handle stragglers and task failures with speculative execution',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  pythonTemplate: `# batch_processing_mapreduce.py
from typing import List, Dict, Iterator
from collections import defaultdict

# In-memory storage for demonstration
logs = []
intermediate_data = defaultdict(list)
reports = {}

def map_function(log_line: str) -> Iterator[tuple]:
    """
    Map phase: Parse log line and emit key-value pairs
    Example: Extract (url, 1) for page view counting
    """
    # TODO: Parse log line and emit intermediate key-value pairs
    # Hint: Return iterator of (key, value) tuples
    pass

def shuffle_and_sort(map_outputs: List[tuple]) -> Dict[str, List]:
    """
    Shuffle phase: Group all values by key
    """
    grouped = defaultdict(list)
    for key, value in map_outputs:
        grouped[key].append(value)
    return grouped

def reduce_function(key: str, values: List) -> tuple:
    """
    Reduce phase: Aggregate values for each key
    Example: Sum page view counts
    """
    # TODO: Aggregate values for the given key
    # Hint: Return (key, aggregated_result)
    pass

def run_mapreduce_job(input_data: List[str]) -> Dict:
    """
    Run complete MapReduce job
    """
    # Map phase
    map_outputs = []
    for line in input_data:
        map_outputs.extend(map_function(line))

    # Shuffle phase
    grouped = shuffle_and_sort(map_outputs)

    # Reduce phase
    results = {}
    for key, values in grouped.items():
        output_key, output_value = reduce_function(key, values)
        results[output_key] = output_value

    return results`,
};

/**
 * Explicit Sharding/Partitioning Design
 * DDIA Chapter 6: Partitioning
 */
export const explicitShardingDesignProblemDefinition: ProblemDefinition = {
  id: 'explicit-sharding-design',
  title: 'Design a Sharding Strategy (Partitioning)',
  description: `Design a sharding strategy for a product catalog with 1B products across 1000 database nodes. Choose between key-range partitioning and hash partitioning, handle hotspots, and support rebalancing when adding nodes. Design secondary indexes and query routing.

Key challenges:
- Avoid hotspots (celebrity products, seasonal items)
- Support efficient lookups by product_id and category
- Enable range queries (price ranges, creation date)
- Rebalance data when adding/removing nodes
- Minimize cross-shard queries`,

  userFacingFRs: [
    'Partition 1B products across 1000 database shards',
    'Support lookup by product_id (primary key)',
    'Support queries by category, price range, seller',
    'Handle rebalancing when nodes are added/removed',
    'Detect and mitigate hotspots (skewed data distribution)',
    'Route queries to appropriate shards',
    'Support consistent hashing for dynamic shard assignment',
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms for single-shard queries, P99 < 500ms for multi-shard',
    'Request Rate: 100k reads/sec, 10k writes/sec',
    'Dataset Size: 1B products, 10TB total data',
    'Availability: Tolerate single shard failure without downtime',
    'Rebalancing: Add/remove nodes with < 5% data movement',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need partitioned/sharded database',
      },
      {
        type: 'compute',
        reason: 'Need query router/coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Router directs queries to appropriate shards',
      },
    ],
    dataModel: {
      entities: ['products', 'shards'],
      fields: {
        products: ['product_id', 'name', 'category', 'price', 'seller_id', 'created_at'],
        shards: ['shard_id', 'key_range_start', 'key_range_end', 'node_address'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'read_by_query', frequency: 'high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('explicit-sharding-design', problemConfigs['explicit-sharding-design'] || {
    baseRps: 110000,
    readRatio: 0.9,
    maxLatency: 50,
    availability: 0.999,
  }, [
    'Partition 1B products across 1000 database shards',
    'Support lookup by product_id (primary key)',
    'Support queries by category, price range, seller',
    'Handle rebalancing when nodes are added/removed',
    'Detect and mitigate hotspots (skewed data distribution)',
    'Route queries to appropriate shards',
    'Support consistent hashing for dynamic shard assignment',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  pythonTemplate: `# explicit_sharding_design.py
from typing import Optional, List
import hashlib

# Shard configuration
NUM_SHARDS = 1000
shards = {}  # shard_id -> list of products

def hash_partition(product_id: str) -> int:
    """
    Hash-based partitioning: hash(product_id) % NUM_SHARDS
    Pro: Uniform distribution, no hotspots
    Con: No range queries
    """
    # TODO: Implement hash-based partitioning
    # Hint: Use consistent hashing for better rebalancing
    pass

def range_partition(product_id: str) -> int:
    """
    Range-based partitioning: assign ranges to shards
    Pro: Efficient range queries
    Con: Risk of hotspots
    """
    # TODO: Implement range-based partitioning
    # Hint: Define key ranges for each shard
    pass

def get_shard(product_id: str, method='hash') -> int:
    """Route request to appropriate shard"""
    if method == 'hash':
        return hash_partition(product_id)
    else:
        return range_partition(product_id)

def insert_product(product_id: str, data: dict) -> bool:
    """Insert product into appropriate shard"""
    shard_id = get_shard(product_id)
    if shard_id not in shards:
        shards[shard_id] = []
    shards[shard_id].append({'product_id': product_id, **data})
    return True

def get_product(product_id: str) -> Optional[dict]:
    """Retrieve product from appropriate shard"""
    shard_id = get_shard(product_id)
    if shard_id in shards:
        for product in shards[shard_id]:
            if product['product_id'] == product_id:
                return product
    return None`,
};

/**
 * Transaction Isolation Levels
 * DDIA Chapter 7: Transactions
 */
export const transactionIsolationLevelsProblemDefinition: ProblemDefinition = {
  id: 'transaction-isolation-levels',
  title: 'Transaction Isolation Levels (Banking System)',
  description: `Design a banking system that supports multiple transaction isolation levels: read uncommitted, read committed, repeatable read, and serializable. Handle concurrent transfers, prevent dirty reads, non-repeatable reads, and phantom reads. Implement two-phase locking (2PL) or snapshot isolation.

Key scenarios:
- Concurrent account transfers without lost updates
- Balance queries during ongoing transactions
- Prevent double-spending in simultaneous withdrawals
- Support audit queries requiring snapshot consistency`,

  userFacingFRs: [
    'Support ACID transactions for money transfers',
    'Implement read uncommitted (dirty reads allowed)',
    'Implement read committed (prevent dirty reads)',
    'Implement repeatable read (prevent non-repeatable reads)',
    'Implement serializable (prevent phantoms, full isolation)',
    'Handle concurrent transactions with locking or MVCC',
    'Prevent lost updates and write skew anomalies',
    'Support transaction rollback and recovery',
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for transfers, P99 < 50ms for balance reads',
    'Request Rate: 10k transactions/sec',
    'Dataset Size: 100M accounts, 1B transaction history',
    'Availability: 99.99% uptime, no data loss',
    'Consistency: Configurable isolation level per transaction',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need transactional database with ACID guarantees',
      },
      {
        type: 'compute',
        reason: 'Need transaction coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinator manages locks and transaction state',
      },
    ],
    dataModel: {
      entities: ['accounts', 'transactions', 'locks'],
      fields: {
        accounts: ['account_id', 'balance', 'version'],
        transactions: ['txn_id', 'from_account', 'to_account', 'amount', 'status'],
        locks: ['resource_id', 'txn_id', 'lock_type'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('transaction-isolation-levels', problemConfigs['transaction-isolation-levels'] || {
    baseRps: 10000,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.9999,
  }, [
    'Support ACID transactions for money transfers',
    'Implement read uncommitted (dirty reads allowed)',
    'Implement read committed (prevent dirty reads)',
    'Implement repeatable read (prevent non-repeatable reads)',
    'Implement serializable (prevent phantoms, full isolation)',
    'Handle concurrent transactions with locking or MVCC',
    'Prevent lost updates and write skew anomalies',
    'Support transaction rollback and recovery',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  pythonTemplate: `# transaction_isolation_levels.py
from typing import Optional, Dict
from enum import Enum
from threading import Lock

class IsolationLevel(Enum):
    READ_UNCOMMITTED = 1
    READ_COMMITTED = 2
    REPEATABLE_READ = 3
    SERIALIZABLE = 4

# In-memory storage
accounts = {}  # account_id -> balance
locks = {}  # account_id -> lock
transaction_log = []

def begin_transaction(isolation_level: IsolationLevel) -> str:
    """Start a new transaction with specified isolation level"""
    # TODO: Initialize transaction state
    pass

def read_balance(account_id: str, txn_id: str, isolation: IsolationLevel) -> Optional[float]:
    """
    Read account balance with isolation level semantics
    - READ_UNCOMMITTED: Read latest value (may be dirty)
    - READ_COMMITTED: Read only committed values
    - REPEATABLE_READ: Read snapshot at transaction start
    - SERIALIZABLE: Acquire read lock
    """
    # TODO: Implement isolation level semantics
    pass

def transfer(from_account: str, to_account: str, amount: float,
             txn_id: str, isolation: IsolationLevel) -> bool:
    """
    Transfer money between accounts with proper isolation
    """
    # TODO: Implement with proper locking/MVCC
    # Hint: Acquire locks based on isolation level
    # Hint: Prevent lost updates and write skew
    pass

def commit_transaction(txn_id: str) -> bool:
    """Commit transaction and release locks"""
    # TODO: Make changes visible and release locks
    pass

def rollback_transaction(txn_id: str) -> bool:
    """Abort transaction and release locks"""
    # TODO: Undo changes and release locks
    pass`,
};

/**
 * Data Warehouse (OLAP)
 * DDIA Chapter 3: Storage and Retrieval (Columnar Storage)
 */
export const dataWarehouseOlapProblemDefinition: ProblemDefinition = {
  id: 'data-warehouse-olap',
  title: 'Data Warehouse with OLAP (Columnar Storage)',
  description: `Design a data warehouse for analytics workloads with columnar storage, supporting OLAP queries on 100TB of sales data. Implement star schema with fact and dimension tables, enable fast aggregations, and support complex analytical queries with grouping and window functions.

Key features:
- Columnar storage for efficient analytics (read 1% of columns)
- Star schema: fact table (sales) + dimension tables (products, customers, time)
- Fast aggregations: SUM, COUNT, AVG across billions of rows
- Support for data cubes and materialized views
- Compression (run-length encoding, dictionary encoding)`,

  userFacingFRs: [
    'Store 100TB of sales transactions (5 years, 10B rows)',
    'Support star schema with fact and dimension tables',
    'Execute OLAP queries: GROUP BY, aggregations, window functions',
    'Enable drill-down and roll-up operations',
    'Support materialized views for common queries',
    'Implement columnar compression (RLE, dictionary encoding)',
    'ETL pipeline for daily data ingestion from OLTP databases',
  ],
  userFacingNFRs: [
    'Latency: P95 < 5s for complex analytical queries',
    'Query throughput: 100 concurrent analytical queries',
    'Dataset Size: 100TB compressed (500TB raw), 10B rows',
    'Compression ratio: 5:1 with columnar encoding',
    'ETL: Ingest 50GB daily updates within 1-hour window',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need columnar database for analytical workloads',
      },
      {
        type: 'compute',
        reason: 'Need query engine for OLAP operations',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query engine scans columnar data',
      },
    ],
    dataModel: {
      entities: ['fact_sales', 'dim_product', 'dim_customer', 'dim_time'],
      fields: {
        fact_sales: ['sale_id', 'product_id', 'customer_id', 'date_id', 'quantity', 'revenue'],
        dim_product: ['product_id', 'name', 'category', 'brand'],
        dim_customer: ['customer_id', 'name', 'segment', 'region'],
        dim_time: ['date_id', 'date', 'month', 'quarter', 'year'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' },
        { type: 'scan', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('data-warehouse-olap', problemConfigs['data-warehouse-olap'] || {
    baseRps: 100,
    readRatio: 0.99,
    maxLatency: 5000,
    availability: 0.999,
  }, [
    'Store 100TB of sales transactions (5 years, 10B rows)',
    'Support star schema with fact and dimension tables',
    'Execute OLAP queries: GROUP BY, aggregations, window functions',
    'Enable drill-down and roll-up operations',
    'Support materialized views for common queries',
    'Implement columnar compression (RLE, dictionary encoding)',
    'ETL pipeline for daily data ingestion from OLTP databases',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  pythonTemplate: `# data_warehouse_olap.py
from typing import List, Dict
from collections import defaultdict

# Columnar storage: each column stored separately
fact_sales = {
    'sale_id': [],
    'product_id': [],
    'customer_id': [],
    'date_id': [],
    'quantity': [],
    'revenue': [],
}

dim_product = {}
dim_customer = {}
dim_time = {}

def insert_fact(sale_id: int, product_id: int, customer_id: int,
                date_id: int, quantity: int, revenue: float):
    """Insert into fact table (columnar storage)"""
    fact_sales['sale_id'].append(sale_id)
    fact_sales['product_id'].append(product_id)
    fact_sales['customer_id'].append(customer_id)
    fact_sales['date_id'].append(date_id)
    fact_sales['quantity'].append(quantity)
    fact_sales['revenue'].append(revenue)

def olap_query_group_by(dimension: str, measure: str, aggregation: str) -> Dict:
    """
    Execute OLAP query with GROUP BY
    Example: SELECT category, SUM(revenue) FROM sales JOIN products GROUP BY category

    Args:
        dimension: Column to group by (e.g., 'product_id', 'customer_id')
        measure: Column to aggregate (e.g., 'revenue', 'quantity')
        aggregation: Aggregation function ('SUM', 'AVG', 'COUNT')
    """
    # TODO: Implement columnar scan and aggregation
    # Hint: Only read relevant columns (product_id, revenue)
    # Hint: Use dictionary encoding for dimension values
    pass

def run_length_encode(column: List) -> List[tuple]:
    """
    Compress column with run-length encoding
    Example: [1,1,1,2,2,3] -> [(1,3), (2,2), (3,1)]
    """
    # TODO: Implement RLE compression
    pass`,
};

/**
 * Graph Database (Social Network)
 * DDIA Chapter 2: Data Models (Graph-Like Data Models)
 */
export const graphDatabaseSocialProblemDefinition: ProblemDefinition = {
  id: 'graph-database-social',
  title: 'Graph Database for Social Network',
  description: `Design a graph database for a social network with 1B users and 50B connections. Support graph traversal queries (friends-of-friends, shortest path, community detection), efficient neighbor lookups, and graph algorithms. Compare property graph vs triple-store models.

Key queries:
- Find friends-of-friends within 3 hops
- Shortest path between two users
- Common connections (mutual friends)
- Community detection and clustering
- Influencer scoring (PageRank-style)`,

  userFacingFRs: [
    'Store 1B user nodes and 50B connection edges',
    'Support graph traversal: BFS, DFS, shortest path',
    'Query friends-of-friends (2-3 hops) efficiently',
    'Find mutual connections between users',
    'Support property graphs (nodes and edges have properties)',
    'Execute graph algorithms: PageRank, community detection',
    'Handle high-degree nodes (celebrities with millions of followers)',
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for 2-hop queries, P99 < 1s for 3-hop',
    'Request Rate: 50k graph queries/sec',
    'Dataset Size: 1B nodes, 50B edges, 10TB graph data',
    'Availability: 99.9% uptime',
    'Traversal: Support up to 5 hops for path queries',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need graph database (Neo4j-like or adjacency list)',
      },
      {
        type: 'compute',
        reason: 'Need graph query engine',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query engine traverses graph',
      },
    ],
    dataModel: {
      entities: ['users', 'connections'],
      fields: {
        users: ['user_id', 'name', 'properties'],
        connections: ['from_user', 'to_user', 'relationship_type', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'read_by_query', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('graph-database-social', problemConfigs['graph-database-social'] || {
    baseRps: 50000,
    readRatio: 0.95,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Store 1B user nodes and 50B connection edges',
    'Support graph traversal: BFS, DFS, shortest path',
    'Query friends-of-friends (2-3 hops) efficiently',
    'Find mutual connections between users',
    'Support property graphs (nodes and edges have properties)',
    'Execute graph algorithms: PageRank, community detection',
    'Handle high-degree nodes (celebrities with millions of followers)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  pythonTemplate: `# graph_database_social.py
from typing import List, Set, Dict, Optional
from collections import deque, defaultdict

# Graph storage: adjacency list
graph = defaultdict(list)  # user_id -> list of connected user_ids
user_properties = {}  # user_id -> properties dict

def add_connection(from_user: str, to_user: str, bidirectional=True):
    """Add edge between users"""
    graph[from_user].append(to_user)
    if bidirectional:
        graph[to_user].append(from_user)

def get_neighbors(user_id: str) -> List[str]:
    """Get direct connections (1-hop neighbors)"""
    return graph.get(user_id, [])

def friends_of_friends(user_id: str, max_hops: int = 2) -> Set[str]:
    """
    Find all users within N hops (BFS traversal)
    Example: 2-hop = friends + friends-of-friends
    """
    # TODO: Implement BFS traversal up to max_hops
    # Hint: Use queue for BFS, track visited nodes
    pass

def shortest_path(from_user: str, to_user: str) -> Optional[List[str]]:
    """
    Find shortest path between two users (BFS)
    Returns: List of user IDs forming the path, or None if no path
    """
    # TODO: Implement shortest path with BFS
    # Hint: Track parent nodes to reconstruct path
    pass

def mutual_friends(user1: str, user2: str) -> Set[str]:
    """Find common connections between two users"""
    friends1 = set(get_neighbors(user1))
    friends2 = set(get_neighbors(user2))
    return friends1.intersection(friends2)

def pagerank(iterations: int = 10, damping: float = 0.85) -> Dict[str, float]:
    """
    Calculate PageRank scores for all users
    Simplified algorithm for influence scoring
    """
    # TODO: Implement PageRank algorithm
    # Hint: Iteratively update scores based on neighbor influence
    pass`,
};

