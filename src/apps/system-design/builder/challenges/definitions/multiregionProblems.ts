import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Basic Multi-Region Setup - Deploy app in two regions
 * From extracted-problems/system-design/multiregion.md
 */
export const basicMultiRegionProblemDefinition: ProblemDefinition = {
  id: 'basic-multi-region',
  title: 'Basic Multi-Region Setup',
  description: `Deploy a web application across two regions that:
- Routes users to nearest region via GeoDNS
- Replicates data between US and EU regions
- Handles regional failures with automatic failover
- Maintains P95 < 100ms same-region, < 300ms cross-region`,

  userFacingFRs: [
    '**GET /api/data/:id** - Read data from the nearest region (US-East or EU-West)',
    '**POST /api/data** - Create new data in the primary region (writes go to US-East)',
    '**PUT /api/data/:id** - Update data in the primary region',
    '**DELETE /api/data/:id** - Delete data from the primary region',
    'Users are automatically routed to their nearest region based on geographic location (GeoDNS)',
    'Data written in US-East is asynchronously replicated to EU-West (eventually consistent reads)',
    'If primary region (US-East) fails, traffic automatically fails over to EU-West',
  ],

  userFacingNFRs: [
    '**Same-Region Latency**: < 100ms p95 for reads/writes within the same region',
    '**Cross-Region Latency**: < 300ms p95 for cross-region requests (if user hits wrong region)',
    '**Replication Lag**: Data replicates from US-East to EU-West within 1-2 seconds',
    '**Availability**: 99.9% uptime (failover to secondary region if primary fails)',
    '**Geographic Distribution**: Users in North America → US-East, Users in Europe → EU-West',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need GeoDNS/CDN for geographic routing',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB in each region',
      },
      {
        type: 'compute',
        reason: 'Need app servers in each region',
      },
      {
        type: 'storage',
        reason: 'Need primary database in each region',
      },
      {
        type: 'storage',
        reason: 'Need replica databases for cross-region replication',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users routed via GeoDNS',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'GeoDNS routes to regional LBs',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes to regional app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers access regional database',
      },
    ],
    dataModel: {
      entities: ['user', 'data'],
      fields: {
        user: ['id', 'region', 'last_seen'],
        data: ['id', 'value', 'region', 'synced_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Local reads
        { type: 'write', frequency: 'high' },            // Local writes
      ],
    },
  },

  scenarios: generateScenarios('basic-multi-region', problemConfigs['basic-multi-region']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Active-Active Multi-Region - Both regions handle writes
 * From extracted-problems/system-design/multiregion.md
 */
export const activeActiveRegionsProblemDefinition: ProblemDefinition = {
  id: 'active-active-regions',
  title: 'Active-Active Multi-Region',
  description: `Build an active-active setup where both regions handle writes that:
- Accepts writes in both regions with local latency
- Resolves write conflicts using vector clocks and CRDTs
- Maintains eventual consistency within 5 seconds
- Handles 5k writes/sec per region`,

  userFacingFRs: [
    '**POST /api/records** - Create a new record in the local region (US-East or EU-West)',
    '**PUT /api/records/:id** - Update an existing record in the local region',
    '**GET /api/records/:id** - Read a record from the local region (returns latest version available locally)',
    '**GET /api/records** - List all records visible in the local region',
    'System automatically replicates changes bidirectionally between US-East ↔ EU-West',
    'Conflict resolution: When the same record is updated in both regions simultaneously, use Last-Write-Wins (LWW) with vector clocks or CRDTs to merge changes',
  ],

  userFacingNFRs: [
    '**Write Latency**: < 50ms p99 for local writes (user writes to nearest region)',
    '**Read Latency**: < 10ms p99 for local reads (user reads from nearest region)',
    '**Replication Lag**: Changes propagate to other region within 5 seconds (eventual consistency)',
    '**Throughput**: 5,000 writes/sec per region (10,000 writes/sec globally across both regions)',
    '**Availability**: 99.99% uptime per region (each region operates independently if cross-region link fails)',
    '**Consistency**: Eventual consistency across regions, strong consistency within a region',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB in each region',
      },
      {
        type: 'compute',
        reason: 'Need app servers in each region',
      },
      {
        type: 'storage',
        reason: 'Need primary database in each region (both writable)',
      },
      {
        type: 'message_queue',
        reason: 'Need stream for bidirectional replication',
      },
      {
        type: 'compute',
        reason: 'Need worker for conflict resolution',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users connect to nearest region',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers write to local database',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Database publishes changes to replication stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Conflict resolver consumes from stream',
      },
    ],
    dataModel: {
      entities: ['record', 'vector_clock'],
      fields: {
        record: ['id', 'value', 'version', 'region'],
        vector_clock: ['record_id', 'region_a_version', 'region_b_version'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },     // Local writes
        { type: 'read_by_key', frequency: 'very_high' }, // Local reads
      ],
    },
  },

  scenarios: generateScenarios('active-active-regions', problemConfigs['active-active-regions']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Global CDN with Regional Origins - Serve static assets globally
 * From extracted-problems/system-design/multiregion.md
 */
export const globalCdnProblemDefinition: ProblemDefinition = {
  id: 'global-cdn',
  title: 'Global CDN with Regional Origins',
  description: `Design a global CDN architecture that:
- Caches at 100+ edge locations worldwide
- Routes to regional origins with failover
- Handles 10M requests/sec with P95 < 50ms globally
- Stores 1PB of static assets`,

  userFacingFRs: [
    '**GET /assets/:key** - Download static assets (images, videos, CSS, JS) from the nearest CDN edge location',
    '**POST /api/assets** - Upload new assets to origin storage (S3)',
    '**DELETE /api/assets/:key** - Delete assets from origin storage',
    'Content is automatically cached at 100+ global edge locations for fast delivery',
    'On cache miss, CDN pulls content from the nearest origin server',
    'Origin servers failover automatically if primary region is unavailable',
    'Assets are versioned and support cache invalidation',
  ],

  userFacingNFRs: [
    '**Global Latency**: < 50ms p95 for cached content (served from nearest edge)',
    '**Cache Hit Ratio**: > 90% (most requests served from edge, not origin)',
    '**Origin Latency**: < 200ms p95 for cache misses (pull from origin)',
    '**Throughput**: 10M requests/sec globally across all edge locations',
    '**Storage Capacity**: 1PB of static assets in origin storage (S3)',
    '**Availability**: 99.99% uptime with automatic origin failover',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need global CDN for edge caching',
      },
      {
        type: 'load_balancer',
        reason: 'Need origin LB for regional failover',
      },
      {
        type: 'compute',
        reason: 'Need origin servers in multiple regions',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 as source of truth for static assets',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users access content through edge locations',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN pulls from origin on cache miss',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Origin LB routes to nearest origin server',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Origin servers fetch from S3',
      },
    ],
    dataModel: {
      entities: ['asset'],
      fields: {
        asset: ['id', 'key', 's3_url', 'content_type', 'size_bytes', 'cache_ttl'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Asset downloads
      ],
    },
  },

  scenarios: generateScenarios('global-cdn', problemConfigs['global-cdn']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cross-Region Disaster Recovery - Backup and failover strategy
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionDrProblemDefinition: ProblemDefinition = {
  id: 'cross-region-dr',
  title: 'Cross-Region Disaster Recovery',
  description: `Implement disaster recovery across regions that:
- Maintains hot standby in secondary region
- Achieves RTO < 5 minutes, RPO < 1 minute
- Performs automated failover on region failure
- Handles data backup and recovery`,

  userFacingFRs: [
    '**GET /api/data/:id** - Read data from the active region (US-East primary)',
    '**POST /api/data** - Create data in the primary region',
    '**PUT /api/data/:id** - Update data in the primary region',
    'Primary region (US-East) handles all traffic during normal operation',
    'Hot standby in secondary region (EU-West) continuously replicates data from primary',
    'Automatic failover: If primary region fails, DNS switches traffic to secondary region within 5 minutes',
    'Data backups stored in cross-region S3 for disaster recovery',
  ],

  userFacingNFRs: [
    '**RTO (Recovery Time Objective)**: < 5 minutes - System recovers and serves traffic from secondary region within 5 minutes of primary failure',
    '**RPO (Recovery Point Objective)**: < 1 minute - Maximum 1 minute of data loss during failover (replication lag)',
    '**Normal Operation Latency**: < 100ms p95 when primary region is healthy',
    '**Failover Detection**: System detects primary region failure within 30 seconds',
    '**Availability**: 99.95% uptime including failover scenarios',
    '**Backup Frequency**: Continuous replication to standby + hourly S3 snapshots',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need DNS for traffic routing',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB in primary and secondary regions',
      },
      {
        type: 'compute',
        reason: 'Need app servers in both regions',
      },
      {
        type: 'storage',
        reason: 'Need database in primary region',
      },
      {
        type: 'storage',
        reason: 'Need hot standby replica in secondary region',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 for cross-region backup',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users connect through DNS failover',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'DNS routes to active region LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers access database',
      },
      {
        from: 'storage',
        to: 'object_storage',
        reason: 'Database backs up to S3',
      },
    ],
    dataModel: {
      entities: ['backup', 'recovery_point'],
      fields: {
        backup: ['id', 'timestamp', 's3_url', 'size_bytes'],
        recovery_point: ['timestamp', 'region', 'status'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },   // Continuous backup
        { type: 'read_by_key', frequency: 'low' }, // Recovery operations
      ],
    },
  },

  scenarios: generateScenarios('cross-region-dr', problemConfigs['cross-region-dr']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(basicMultiRegionProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicMultiRegionProblemDefinition);
