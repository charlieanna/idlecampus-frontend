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
