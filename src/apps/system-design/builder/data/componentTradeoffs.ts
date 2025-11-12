// Predefined trade-offs for each component type
// Users must select which ones apply to their specific use case

export interface ComponentTradeoff {
  id: string;
  text: string;
  category: 'cost' | 'complexity' | 'performance' | 'reliability' | 'scalability' | 'maintenance';
}

export const COMPONENT_TRADEOFFS: Record<string, ComponentTradeoff[]> = {
  redis: [
    { id: 'redis_cost', text: 'Additional infrastructure cost (~$100-500/month for production cluster)', category: 'cost' },
    { id: 'redis_memory', text: 'Limited by memory - cannot store data larger than RAM', category: 'scalability' },
    { id: 'redis_invalidation', text: 'Cache invalidation complexity - hard to keep cache in sync', category: 'complexity' },
    { id: 'redis_stampede', text: 'Cache stampede risk when popular keys expire simultaneously', category: 'performance' },
    { id: 'redis_stale', text: 'Possible stale data if cache TTL is too long', category: 'reliability' },
    { id: 'redis_persistence', text: 'Data loss risk if not configured for persistence', category: 'reliability' },
    { id: 'redis_monitoring', text: 'Requires additional monitoring and alerting infrastructure', category: 'maintenance' },
    { id: 'redis_spof', text: 'Single point of failure without proper replication', category: 'reliability' },
  ],
  postgresql: [
    { id: 'pg_vertical', text: 'Vertical scaling limitations - eventually hit single server limits', category: 'scalability' },
    { id: 'pg_sharding', text: 'Complex sharding/partitioning setup for horizontal scaling', category: 'complexity' },
    { id: 'pg_acid', text: 'ACID compliance overhead can impact write performance', category: 'performance' },
    { id: 'pg_cost', text: 'Higher cost for large instances with lots of RAM/CPU', category: 'cost' },
    { id: 'pg_backup', text: 'Backup and restore can be time-consuming for large databases', category: 'maintenance' },
    { id: 'pg_replication', text: 'Read replica lag can cause consistency issues', category: 'reliability' },
    { id: 'pg_schema', text: 'Schema changes can be slow and require downtime', category: 'maintenance' },
    { id: 'pg_connections', text: 'Connection pooling required for high concurrency', category: 'performance' },
  ],
  mongodb: [
    { id: 'mongo_consistency', text: 'Eventual consistency can lead to stale reads', category: 'reliability' },
    { id: 'mongo_memory', text: 'Memory intensive - indexes must fit in RAM for good performance', category: 'cost' },
    { id: 'mongo_duplication', text: 'Data duplication in denormalized schemas increases storage costs', category: 'cost' },
    { id: 'mongo_transactions', text: 'Multi-document transactions have performance overhead', category: 'performance' },
    { id: 'mongo_size', text: 'Document size limit (16MB) can be restrictive', category: 'scalability' },
    { id: 'mongo_joins', text: 'No native joins - must do application-level joins or use aggregation', category: 'complexity' },
    { id: 'mongo_backup', text: 'Backup coordination across shards is complex', category: 'maintenance' },
    { id: 'mongo_upgrade', text: 'Version upgrades can be risky with breaking changes', category: 'maintenance' },
  ],
  cassandra: [
    { id: 'cass_consistency', text: 'Tunable consistency - must balance between consistency and availability', category: 'complexity' },
    { id: 'cass_learning', text: 'Steep learning curve - query patterns must be known upfront', category: 'complexity' },
    { id: 'cass_tombstones', text: 'Tombstone accumulation can degrade read performance', category: 'performance' },
    { id: 'cass_cost', text: 'Minimum 3-node cluster required - high infrastructure cost', category: 'cost' },
    { id: 'cass_compaction', text: 'Compaction can consume significant disk I/O', category: 'performance' },
    { id: 'cass_debugging', text: 'Distributed system debugging is difficult', category: 'maintenance' },
    { id: 'cass_updates', text: 'Updates and deletes are more expensive than inserts', category: 'performance' },
    { id: 'cass_modeling', text: 'Data modeling is query-driven and inflexible', category: 'complexity' },
  ],
  load_balancer: [
    { id: 'lb_spof', text: 'Single point of failure without redundancy (need multiple)', category: 'reliability' },
    { id: 'lb_cost', text: 'Additional cost for load balancer instances or managed service', category: 'cost' },
    { id: 'lb_latency', text: 'Adds network hop latency (typically 1-5ms)', category: 'performance' },
    { id: 'lb_complexity', text: 'Health check configuration and tuning required', category: 'complexity' },
    { id: 'lb_session', text: 'Sticky sessions can cause uneven load distribution', category: 'performance' },
    { id: 'lb_ssl', text: 'SSL termination at LB increases CPU/memory requirements', category: 'cost' },
    { id: 'lb_monitoring', text: 'Need monitoring for load balancer health and metrics', category: 'maintenance' },
  ],
  app_server: [
    { id: 'app_stateful', text: 'Stateful servers make scaling and failover complex', category: 'complexity' },
    { id: 'app_cost', text: 'Each instance adds to infrastructure cost', category: 'cost' },
    { id: 'app_deployment', text: 'Deployment coordination across multiple servers is complex', category: 'complexity' },
    { id: 'app_config', text: 'Configuration management across instances can be challenging', category: 'maintenance' },
    { id: 'app_memory', text: 'Memory leaks in one instance can cause cascading failures', category: 'reliability' },
    { id: 'app_monitoring', text: 'Distributed tracing and logging required for debugging', category: 'maintenance' },
  ],
  message_queue: [
    { id: 'mq_complexity', text: 'Adds architectural complexity with async processing', category: 'complexity' },
    { id: 'mq_ordering', text: 'Maintaining message ordering can be difficult', category: 'complexity' },
    { id: 'mq_duplicate', text: 'At-least-once delivery means handling duplicate messages', category: 'complexity' },
    { id: 'mq_monitoring', text: 'Need monitoring for queue depth, lag, and consumer health', category: 'maintenance' },
    { id: 'mq_cost', text: 'Additional infrastructure cost for brokers/partitions', category: 'cost' },
    { id: 'mq_debugging', text: 'Debugging async flows is harder than synchronous', category: 'maintenance' },
    { id: 'mq_backpressure', text: 'Need backpressure handling when consumers are slow', category: 'complexity' },
  ],
  cdn: [
    { id: 'cdn_cost', text: 'Bandwidth and request costs can be significant', category: 'cost' },
    { id: 'cdn_stale', text: 'Cached content can become stale', category: 'reliability' },
    { id: 'cdn_purge', text: 'Cache purging/invalidation takes time to propagate', category: 'complexity' },
    { id: 'cdn_origin', text: 'Cache misses still hit origin - must handle traffic spikes', category: 'performance' },
    { id: 'cdn_dynamic', text: 'Not effective for dynamic/personalized content', category: 'complexity' },
    { id: 'cdn_headers', text: 'Must configure cache headers correctly', category: 'complexity' },
  ],
  s3: [
    { id: 's3_consistency', text: 'Eventually consistent - new objects might not be immediately readable', category: 'reliability' },
    { id: 's3_cost', text: 'Storage and data transfer costs can grow significantly', category: 'cost' },
    { id: 's3_latency', text: 'Higher latency than local disk (50-100ms typical)', category: 'performance' },
    { id: 's3_api', text: 'API rate limits can cause throttling', category: 'performance' },
    { id: 's3_versioning', text: 'Versioning increases storage costs', category: 'cost' },
    { id: 's3_list', text: 'Listing large buckets is slow and paginated', category: 'performance' },
  ],
  dynamodb: [
    { id: 'dynamo_cost', text: 'Can be expensive for high throughput (read/write capacity units)', category: 'cost' },
    { id: 'dynamo_modeling', text: 'Data modeling is complex - must know access patterns upfront', category: 'complexity' },
    { id: 'dynamo_hot', text: 'Hot partition keys can cause throttling', category: 'performance' },
    { id: 'dynamo_query', text: 'Limited query flexibility - can only query by partition key', category: 'complexity' },
    { id: 'dynamo_size', text: 'Item size limit (400KB) can be restrictive', category: 'scalability' },
    { id: 'dynamo_gsi', text: 'Global secondary indexes double storage and write costs', category: 'cost' },
    { id: 'dynamo_consistency', text: 'Eventually consistent by default - must opt into strong consistency', category: 'reliability' },
  ],
};

// Get trade-offs for a specific component type
export function getTradeoffsForComponent(componentType: string): ComponentTradeoff[] {
  return COMPONENT_TRADEOFFS[componentType] || [];
}
