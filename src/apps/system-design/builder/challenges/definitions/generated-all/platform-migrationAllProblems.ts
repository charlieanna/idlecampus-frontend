import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Platform-migration Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 37 problems
 */

/**
 * Netflix Monolith to Microservices Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationNetflixMicroservicesProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-netflix-microservices',
  title: 'Netflix Monolith to Microservices Migration',
  description: `Netflix needs to migrate from their monolithic Java application to a microservices architecture. The system handles 10M concurrent streams, 100TB of metadata, and must maintain 99.99% availability during migration. Consider service discovery, data consistency, API versioning, team boundaries, and gradual rollout strategies.
- Support parallel running of monolith and microservices
- Maintain all existing APIs during migration
- Enable gradual traffic shifting between systems
- Support rollback at any migration phase`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support parallel running of monolith and microservices',
    'Maintain all existing APIs during migration',
    'Enable gradual traffic shifting between systems',
    'Support rollback at any migration phase',
    'Preserve all user data and preferences'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for API calls',
    'Request Rate: 10M concurrent streams',
    'Dataset Size: 100TB metadata, 1PB content',
    'Availability: 99.99% during migration',
    'Durability: Zero data loss tolerance'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-netflix-microservices', problemConfigs['l5-migration-netflix-microservices'], [
    'Support parallel running of monolith and microservices',
    'Maintain all existing APIs during migration',
    'Enable gradual traffic shifting between systems',
    'Support rollback at any migration phase',
    'Preserve all user data and preferences'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}

def support_parallel_running_of_monolith_and(**kwargs) -> Dict:
    """
    FR-1: Support parallel running of monolith and microservices
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_all_existing_apis_during_migrat(**kwargs) -> Dict:
    """
    FR-2: Maintain all existing APIs during migration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_traffic_shifting_between(**kwargs) -> Dict:
    """
    FR-3: Enable gradual traffic shifting between systems
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_rollback_at_any_migration_phase(**kwargs) -> Dict:
    """
    FR-4: Support rollback at any migration phase
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Preserve all user data and preferences
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * Twitter Event-Driven Architecture Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationTwitterEventDrivenProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-twitter-event-driven',
  title: 'Twitter Event-Driven Architecture Migration',
  description: `Twitter processes 500M tweets daily through synchronous APIs. Design migration to event-driven architecture using Kafka/Pulsar while maintaining real-time timeline generation, search indexing, and notification delivery.
- Convert REST APIs to event publishers
- Maintain timeline generation < 2 seconds
- Support both push and pull notification models
- Enable event replay for debugging`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Convert REST APIs to event publishers',
    'Maintain timeline generation < 2 seconds',
    'Support both push and pull notification models',
    'Enable event replay for debugging',
    'Preserve tweet ordering guarantees'
  ],
  userFacingNFRs: [
    'Latency: P99 < 2s for timeline generation',
    'Request Rate: 6000 tweets/second average',
    'Dataset Size: 500B historical tweets',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-twitter-event-driven', problemConfigs['l5-migration-twitter-event-driven'], [
    'Convert REST APIs to event publishers',
    'Maintain timeline generation < 2 seconds',
    'Support both push and pull notification models',
    'Enable event replay for debugging',
    'Preserve tweet ordering guarantees'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
items = {}

def convert_rest_apis_to_event_publishers(**kwargs) -> Dict:
    """
    FR-1: Convert REST APIs to event publishers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_timeline_generation_2_seconds(**kwargs) -> Dict:
    """
    FR-2: Maintain timeline generation < 2 seconds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_both_push_and_pull_notification(**kwargs) -> Dict:
    """
    FR-3: Support both push and pull notification models
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_event_replay_for_debugging(**kwargs) -> Dict:
    """
    FR-4: Enable event replay for debugging
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Preserve tweet ordering guarantees
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * Spotify Serverless Platform Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationSpotifyServerlessProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-spotify-serverless',
  title: 'Spotify Serverless Platform Migration',
  description: `Spotify runs on 10,000+ EC2 instances. Design migration to serverless (Lambda, Fargate) while maintaining music streaming, playlist generation, and recommendation services.
- Support stateful music streaming sessions
- Maintain < 50ms audio buffering
- Handle both request/response and long-running jobs
- Support WebSocket connections for real-time features`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support stateful music streaming sessions',
    'Maintain < 50ms audio buffering',
    'Handle both request/response and long-running jobs',
    'Support WebSocket connections for real-time features',
    'Enable local development environment'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms for API calls',
    'Request Rate: 10M concurrent streams',
    'Dataset Size: 100M songs, 4B playlists',
    'Availability: 99.99% for streaming',
    'Durability: Zero playlist data loss'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-spotify-serverless', problemConfigs['l5-migration-spotify-serverless'], [
    'Support stateful music streaming sessions',
    'Maintain < 50ms audio buffering',
    'Handle both request/response and long-running jobs',
    'Support WebSocket connections for real-time features',
    'Enable local development environment'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_stateful_music_streaming_session(**kwargs) -> Dict:
    """
    FR-1: Support stateful music streaming sessions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_50ms_audio_buffering(**kwargs) -> Dict:
    """
    FR-2: Maintain < 50ms audio buffering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_both_request_response_and_long_ru(**kwargs) -> Dict:
    """
    FR-3: Handle both request/response and long-running jobs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_websocket_connections_for_real_t(**kwargs) -> Dict:
    """
    FR-4: Support WebSocket connections for real-time features
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_local_development_environment(**kwargs) -> Dict:
    """
    FR-5: Enable local development environment
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Uber Multi-Region Active-Active Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationUberMultiRegionProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-uber-multi-region',
  title: 'Uber Multi-Region Active-Active Migration',
  description: `Uber operates primarily from US-East. Design migration to active-active across 5 regions while handling real-time matching, pricing, and payment processing.
- Support cross-region ride matching
- Maintain consistent pricing across regions
- Handle split-brain scenarios
- Enable region-local data compliance`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cross-region ride matching',
    'Maintain consistent pricing across regions',
    'Handle split-brain scenarios',
    'Enable region-local data compliance',
    'Support gradual region activation'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms intra-region',
    'Request Rate: 1M rides per hour peak',
    'Availability: 99.99% per region'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-uber-multi-region', problemConfigs['l5-migration-uber-multi-region'], [
    'Support cross-region ride matching',
    'Maintain consistent pricing across regions',
    'Handle split-brain scenarios',
    'Enable region-local data compliance',
    'Support gradual region activation'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_cross_region_ride_matching(**kwargs) -> Dict:
    """
    FR-1: Support cross-region ride matching
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_consistent_pricing_across_regio(**kwargs) -> Dict:
    """
    FR-2: Maintain consistent pricing across regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_split_brain_scenarios(**kwargs) -> Dict:
    """
    FR-3: Handle split-brain scenarios
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_region_local_data_compliance(**kwargs) -> Dict:
    """
    FR-4: Enable region-local data compliance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_gradual_region_activation(**kwargs) -> Dict:
    """
    FR-5: Support gradual region activation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Airbnb GraphQL Federation Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationAirbnbGraphqlProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-airbnb-graphql',
  title: 'Airbnb GraphQL Federation Migration',
  description: `Airbnb has 1000+ REST endpoints across 50 teams. Design migration to Apollo GraphQL Federation while maintaining backward compatibility and performance.
- Support GraphQL and REST simultaneously
- Enable schema stitching across services
- Maintain sub-100ms query performance
- Support real-time subscriptions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GraphQL and REST simultaneously',
    'Enable schema stitching across services',
    'Maintain sub-100ms query performance',
    'Support real-time subscriptions',
    'Enable field-level authorization'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for queries',
    'Request Rate: 500K requests/second',
    'Dataset Size: 10,000 types in schema',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-airbnb-graphql', problemConfigs['l5-migration-airbnb-graphql'], [
    'Support GraphQL and REST simultaneously',
    'Enable schema stitching across services',
    'Maintain sub-100ms query performance',
    'Support real-time subscriptions',
    'Enable field-level authorization'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_graphql_and_rest_simultaneously(**kwargs) -> Dict:
    """
    FR-1: Support GraphQL and REST simultaneously
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_schema_stitching_across_services(**kwargs) -> Dict:
    """
    FR-2: Enable schema stitching across services
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-3: Maintain sub-100ms query performance
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def support_real_time_subscriptions(**kwargs) -> Dict:
    """
    FR-4: Support real-time subscriptions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_field_level_authorization(**kwargs) -> Dict:
    """
    FR-5: Enable field-level authorization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Stripe Database Sharding Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationStripeDatabaseProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-stripe-database',
  title: 'Stripe Database Sharding Migration',
  description: `Stripe processes payments on a massive Postgres instance. Design migration to horizontally sharded architecture while maintaining ACID guarantees for financial transactions.
- Maintain ACID for payment transactions
- Support cross-shard transactions
- Enable online resharding
- Preserve audit trail integrity`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Maintain ACID for payment transactions',
    'Support cross-shard transactions',
    'Enable online resharding',
    'Preserve audit trail integrity',
    'Support instant reconciliation'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms for payments',
    'Request Rate: 50K transactions/second',
    'Dataset Size: 10PB transaction history',
    'Availability: 99.999% for payments'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-stripe-database', problemConfigs['l5-migration-stripe-database'], [
    'Maintain ACID for payment transactions',
    'Support cross-shard transactions',
    'Enable online resharding',
    'Preserve audit trail integrity',
    'Support instant reconciliation'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def maintain_acid_for_payment_transactions(**kwargs) -> Dict:
    """
    FR-1: Maintain ACID for payment transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_cross_shard_transactions(**kwargs) -> Dict:
    """
    FR-2: Support cross-shard transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_online_resharding(**kwargs) -> Dict:
    """
    FR-3: Enable online resharding
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-4: Preserve audit trail integrity
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def support_instant_reconciliation(**kwargs) -> Dict:
    """
    FR-5: Support instant reconciliation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Slack WebSocket Infrastructure Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationSlackWebsocketProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-slack-websocket',
  title: 'Slack WebSocket Infrastructure Migration',
  description: `Slack uses HTTP long-polling for real-time messaging. Design migration to WebSocket infrastructure supporting 20M concurrent connections across 500K organizations.
- Support 20M concurrent WebSocket connections
- Maintain message ordering per channel
- Enable presence detection
- Support connection migration`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 20M concurrent WebSocket connections',
    'Maintain message ordering per channel',
    'Enable presence detection',
    'Support connection migration',
    'Handle graceful reconnection'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms message delivery',
    'Request Rate: 100K connections/second, 1M messages/second',
    'Availability: 99.99% connection uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-slack-websocket', problemConfigs['l5-migration-slack-websocket'], [
    'Support 20M concurrent WebSocket connections',
    'Maintain message ordering per channel',
    'Enable presence detection',
    'Support connection migration',
    'Handle graceful reconnection'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
messages = {}

def support_20m_concurrent_websocket_connect(**kwargs) -> Dict:
    """
    FR-1: Support 20M concurrent WebSocket connections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_message_ordering_per_channel(**kwargs) -> Dict:
    """
    FR-2: Maintain message ordering per channel
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_presence_detection(**kwargs) -> Dict:
    """
    FR-3: Enable presence detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_connection_migration(**kwargs) -> Dict:
    """
    FR-4: Support connection migration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_graceful_reconnection(**kwargs) -> Dict:
    """
    FR-5: Handle graceful reconnection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * GitHub Monorepo Infrastructure Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationGithubMonorepoProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-github-monorepo',
  title: 'GitHub Monorepo Infrastructure Migration',
  description: `GitHub struggles with repos > 100GB. Design infrastructure to support monorepos with billions of files, supporting 100K engineers with sub-second operations.
- Support 1B+ files per repository
- Enable partial clones and sparse checkouts
- Maintain sub-second file operations
- Support 10K concurrent pushes`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 1B+ files per repository',
    'Enable partial clones and sparse checkouts',
    'Maintain sub-second file operations',
    'Support 10K concurrent pushes',
    'Enable cross-repo dependencies'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1s for file operations',
    'Dataset Size: 10PB per monorepo',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-github-monorepo', problemConfigs['l5-migration-github-monorepo'], [
    'Support 1B+ files per repository',
    'Enable partial clones and sparse checkouts',
    'Maintain sub-second file operations',
    'Support 10K concurrent pushes',
    'Enable cross-repo dependencies'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_1b_files_per_repository(**kwargs) -> Dict:
    """
    FR-1: Support 1B+ files per repository
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_partial_clones_and_sparse_checkou(**kwargs) -> Dict:
    """
    FR-2: Enable partial clones and sparse checkouts
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_sub_second_file_operations(**kwargs) -> Dict:
    """
    FR-3: Maintain sub-second file operations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_10k_concurrent_pushes(**kwargs) -> Dict:
    """
    FR-4: Support 10K concurrent pushes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_cross_repo_dependencies(**kwargs) -> Dict:
    """
    FR-5: Enable cross-repo dependencies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Instagram Cassandra to TiDB Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationInstagramCassandraProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-instagram-cassandra',
  title: 'Instagram Cassandra to TiDB Migration',
  description: `Instagram uses Cassandra for social graph with 100B edges. Migrate to TiDB for SQL compatibility while maintaining scale and performance.
- Migrate 100B social graph edges
- Support both SQL and CQL during transition
- Maintain friend recommendation latency
- Enable zero-downtime migration`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Migrate 100B social graph edges',
    'Support both SQL and CQL during transition',
    'Maintain friend recommendation latency',
    'Enable zero-downtime migration',
    'Support gradual rollback capability'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms for graph queries',
    'Dataset Size: 100B edges, 2B nodes',
    'Availability: 99.99% during migration'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-instagram-cassandra', problemConfigs['l5-migration-instagram-cassandra'], [
    'Migrate 100B social graph edges',
    'Support both SQL and CQL during transition',
    'Maintain friend recommendation latency',
    'Enable zero-downtime migration',
    'Support gradual rollback capability'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
relationships = {}
cache = {}
item = {}
memory = {}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-1: Migrate 100B social graph edges
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-1: Migrate 100B social graph edges
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def support_both_sql_and_cql_during_transiti(**kwargs) -> Dict:
    """
    FR-2: Support both SQL and CQL during transition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-3: Maintain friend recommendation latency
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def enable_zero_downtime_migration(**kwargs) -> Dict:
    """
    FR-4: Enable zero-downtime migration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_gradual_rollback_capability(**kwargs) -> Dict:
    """
    FR-5: Support gradual rollback capability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * DoorDash Routing Engine Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationDoordashRoutingProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-doordash-routing',
  title: 'DoorDash Routing Engine Migration',
  description: `DoorDash spends $100M/year on Google Maps. Design migration to custom routing engine handling real-time traffic, multi-stop optimization, and dasher assignment.
- Calculate optimal routes for multi-stop deliveries
- Support real-time traffic updates
- Handle 1M concurrent dashers
- Enable A/B testing old vs new routing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Calculate optimal routes for multi-stop deliveries',
    'Support real-time traffic updates',
    'Handle 1M concurrent dashers',
    'Enable A/B testing old vs new routing',
    'Maintain fallback to Google Maps'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms route calculation',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-doordash-routing', problemConfigs['l5-migration-doordash-routing'], [
    'Calculate optimal routes for multi-stop deliveries',
    'Support real-time traffic updates',
    'Handle 1M concurrent dashers',
    'Enable A/B testing old vs new routing',
    'Maintain fallback to Google Maps'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
memory = {}

def calculate_optimal_routes_for_multi_stop(**kwargs) -> Dict:
    """
    FR-1: Calculate optimal routes for multi-stop deliveries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Support real-time traffic updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def handle_1m_concurrent_dashers(**kwargs) -> Dict:
    """
    FR-3: Handle 1M concurrent dashers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_a_b_testing_old_vs_new_routing(**kwargs) -> Dict:
    """
    FR-4: Enable A/B testing old vs new routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_fallback_to_google_maps(**kwargs) -> Dict:
    """
    FR-5: Maintain fallback to Google Maps
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Zoom WebRTC Infrastructure Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationZoomWebrtcProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-zoom-webrtc',
  title: 'Zoom WebRTC Infrastructure Migration',
  description: `Zoom uses proprietary video protocol. Migrate to WebRTC standard while maintaining quality for 300M daily meeting participants and enterprise features.
- Support 1000 participants per meeting
- Maintain end-to-end encryption
- Enable cloud recording
- Support virtual backgrounds`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 1000 participants per meeting',
    'Maintain end-to-end encryption',
    'Enable cloud recording',
    'Support virtual backgrounds',
    'Handle protocol translation for legacy clients'
  ],
  userFacingNFRs: [
    'Latency: P99 < 150ms audio/video',
    'Availability: 99.99% meeting uptime (1080p quality, 20% packet loss tolerance)'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-zoom-webrtc', problemConfigs['l5-migration-zoom-webrtc'], [
    'Support 1000 participants per meeting',
    'Maintain end-to-end encryption',
    'Enable cloud recording',
    'Support virtual backgrounds',
    'Handle protocol translation for legacy clients'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_1000_participants_per_meeting(**kwargs) -> Dict:
    """
    FR-1: Support 1000 participants per meeting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_end_to_end_encryption(**kwargs) -> Dict:
    """
    FR-2: Maintain end-to-end encryption
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_cloud_recording(**kwargs) -> Dict:
    """
    FR-3: Enable cloud recording
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_virtual_backgrounds(**kwargs) -> Dict:
    """
    FR-4: Support virtual backgrounds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_protocol_translation_for_legacy_c(**kwargs) -> Dict:
    """
    FR-5: Handle protocol translation for legacy clients
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Pinterest Recommendation Engine Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationPinterestRecommendationProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-pinterest-recommendation',
  title: 'Pinterest Recommendation Engine Migration',
  description: `Pinterest runs daily Hadoop batch jobs for recommendations. Migrate to real-time ML serving while handling 100B pins and maintaining recommendation quality.
- Serve recommendations in < 50ms
- Support online learning from user actions
- Handle 100B item catalog
- Enable real-time personalization`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Serve recommendations in < 50ms',
    'Support online learning from user actions',
    'Handle 100B item catalog',
    'Enable real-time personalization',
    'Maintain recommendation diversity'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms inference',
    'Dataset Size: 100GB+ embedding tables'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-pinterest-recommendation', problemConfigs['l5-migration-pinterest-recommendation'], [
    'Serve recommendations in < 50ms',
    'Support online learning from user actions',
    'Handle 100B item catalog',
    'Enable real-time personalization',
    'Maintain recommendation diversity'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}

def get_item(item_id: str) -> Dict:
    """
    FR-1: Serve recommendations in < 50ms
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def support_online_learning_from_user_action(**kwargs) -> Dict:
    """
    FR-2: Support online learning from user actions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_100b_item_catalog(**kwargs) -> Dict:
    """
    FR-3: Handle 100B item catalog
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_real_time_personalization(**kwargs) -> Dict:
    """
    FR-4: Enable real-time personalization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_recommendation_diversity(**kwargs) -> Dict:
    """
    FR-5: Maintain recommendation diversity
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * LinkedIn Kafka to Pulsar Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationLinkedinKafkaProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-linkedin-kafka',
  title: 'LinkedIn Kafka to Pulsar Migration',
  description: `LinkedIn operates one of the largest Kafka deployments. Design migration to Pulsar for multi-tenancy, geo-replication, and tiered storage while maintaining zero message loss.
- Migrate 7 trillion messages/day throughput
- Support Kafka protocol during transition
- Enable tiered storage to S3
- Maintain exactly-once semantics`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Migrate 7 trillion messages/day throughput',
    'Support Kafka protocol during transition',
    'Enable tiered storage to S3',
    'Maintain exactly-once semantics',
    'Support 100K topics'
  ],
  userFacingNFRs: [
    'Latency: P99 < 5ms publish',
    'Availability: 99.99% uptime',
    'Durability: 7 days hot, 1 year cold retention'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-linkedin-kafka', problemConfigs['l5-migration-linkedin-kafka'], [
    'Migrate 7 trillion messages/day throughput',
    'Support Kafka protocol during transition',
    'Enable tiered storage to S3',
    'Maintain exactly-once semantics',
    'Support 100K topics'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
messages = {}

def migrate_7_trillion_messages_day_throughp(**kwargs) -> Dict:
    """
    FR-1: Migrate 7 trillion messages/day throughput
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_kafka_protocol_during_transition(**kwargs) -> Dict:
    """
    FR-2: Support Kafka protocol during transition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_tiered_storage_to_s3(**kwargs) -> Dict:
    """
    FR-3: Enable tiered storage to S3
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_exactly_once_semantics(**kwargs) -> Dict:
    """
    FR-4: Maintain exactly-once semantics
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_100k_topics(**kwargs) -> Dict:
    """
    FR-5: Support 100K topics
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Reddit PostgreSQL to CockroachDB Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationRedditPostgresProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-reddit-postgres',
  title: 'Reddit PostgreSQL to CockroachDB Migration',
  description: `Reddit uses heavily sharded PostgreSQL. Migrate to CockroachDB for global distribution while handling 100B+ posts/comments and maintaining ACID guarantees.
- Migrate 100B+ posts and comments
- Maintain vote consistency
- Support complex queries for feeds
- Enable geo-distributed replicas`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Migrate 100B+ posts and comments',
    'Maintain vote consistency',
    'Support complex queries for feeds',
    'Enable geo-distributed replicas',
    'Preserve karma calculation accuracy'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms queries',
    'Dataset Size: 50TB active data',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-reddit-postgres', problemConfigs['l5-migration-reddit-postgres'], [
    'Migrate 100B+ posts and comments',
    'Maintain vote consistency',
    'Support complex queries for feeds',
    'Enable geo-distributed replicas',
    'Preserve karma calculation accuracy'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
messages = {}
posts = {}
reactions = {}
items = {}
memory = {}

def migrate_100b_posts_and_comments(**kwargs) -> Dict:
    """
    FR-1: Migrate 100B+ posts and comments
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def add_reaction(item_id: str, user_id: str, reaction_type: str = 'like') -> Dict:
    """
    FR-2: Maintain vote consistency
    Naive implementation - stores reaction in memory
    """
    reaction_id = f"{item_id}_{user_id}"
    reactions[reaction_id] = {
        'item_id': item_id,
        'user_id': user_id,
        'type': reaction_type,
        'created_at': datetime.now()
    }
    return reactions[reaction_id]

def support_complex_queries_for_feeds(**kwargs) -> Dict:
    """
    FR-3: Support complex queries for feeds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_geo_distributed_replicas(**kwargs) -> Dict:
    """
    FR-4: Enable geo-distributed replicas
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Preserve karma calculation accuracy
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * Snapchat Ephemeral Storage Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationSnapchatStorageProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-snapchat-storage',
  title: 'Snapchat Ephemeral Storage Migration',
  description: `Snapchat stores everything in S3. Design custom ephemeral storage system that auto-deletes content, reducing costs by 70% while maintaining performance.
- Auto-delete content after viewing
- Support 24-hour stories
- Handle 5B snaps daily
- Enable instant playback`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Auto-delete content after viewing',
    'Support 24-hour stories',
    'Handle 5B snaps daily',
    'Enable instant playback',
    'Maintain encryption at rest'
  ],
  userFacingNFRs: [
    'Latency: P99 < 200ms retrieval',
    'Dataset Size: 10PB active content',
    'Availability: 99.9% content availability'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-snapchat-storage', problemConfigs['l5-migration-snapchat-storage'], [
    'Auto-delete content after viewing',
    'Support 24-hour stories',
    'Handle 5B snaps daily',
    'Enable instant playback',
    'Maintain encryption at rest'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
posts = {}
items = {}

def delete_item(item_id: str) -> bool:
    """
    FR-1: Auto-delete content after viewing
    Naive implementation - removes from memory
    """
    if item_id in items:
        del items[item_id]
        return True
    return False

def support_24_hour_stories(**kwargs) -> Dict:
    """
    FR-2: Support 24-hour stories
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_5b_snaps_daily(**kwargs) -> Dict:
    """
    FR-3: Handle 5B snaps daily
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_instant_playback(**kwargs) -> Dict:
    """
    FR-4: Enable instant playback
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_encryption_at_rest(**kwargs) -> Dict:
    """
    FR-5: Maintain encryption at rest
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Shopify Multi-Cloud Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationShopifyMultiCloudProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-shopify-multi-cloud',
  title: 'Shopify Multi-Cloud Migration',
  description: `Shopify runs entirely on AWS. Design migration to multi-cloud (AWS, GCP, Azure) for cost optimization, vendor lock-in prevention, and regional compliance.
- Support cloud-agnostic services
- Enable workload placement optimization
- Maintain data consistency across clouds
- Support cloud-specific managed services`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cloud-agnostic services',
    'Enable workload placement optimization',
    'Maintain data consistency across clouds',
    'Support cloud-specific managed services',
    'Enable disaster recovery across clouds'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms API calls',
    'Availability: 99.99% across clouds'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-shopify-multi-cloud', problemConfigs['l5-migration-shopify-multi-cloud'], [
    'Support cloud-agnostic services',
    'Enable workload placement optimization',
    'Maintain data consistency across clouds',
    'Support cloud-specific managed services',
    'Enable disaster recovery across clouds'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def support_cloud_agnostic_services(**kwargs) -> Dict:
    """
    FR-1: Support cloud-agnostic services
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_workload_placement_optimization(**kwargs) -> Dict:
    """
    FR-2: Enable workload placement optimization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_data_consistency_across_clouds(**kwargs) -> Dict:
    """
    FR-3: Maintain data consistency across clouds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_cloud_specific_managed_services(**kwargs) -> Dict:
    """
    FR-4: Support cloud-specific managed services
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_disaster_recovery_across_clouds(**kwargs) -> Dict:
    """
    FR-5: Enable disaster recovery across clouds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Twitch Ultra-Low Latency Streaming
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationTwitchLowLatencyProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-twitch-low-latency',
  title: 'Twitch Ultra-Low Latency Streaming',
  description: `Twitch has 10-30 second stream delay. Design migration to WebRTC-based ultra-low latency while maintaining quality and scale for esports and interactive streaming.
- Achieve < 1 second glass-to-glass latency
- Support 15M concurrent viewers
- Maintain 1080p60 quality
- Enable instant channel switching`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Achieve < 1 second glass-to-glass latency',
    'Support 15M concurrent viewers',
    'Maintain 1080p60 quality',
    'Enable instant channel switching',
    'Support legacy HLS players'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1 second end-to-end',
    'Availability: 99.95% stream uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-twitch-low-latency', problemConfigs['l5-migration-twitch-low-latency'], [
    'Achieve < 1 second glass-to-glass latency',
    'Support 15M concurrent viewers',
    'Maintain 1080p60 quality',
    'Enable instant channel switching',
    'Support legacy HLS players'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def achieve_1_second_glass_to_glass_latenc(**kwargs) -> Dict:
    """
    FR-1: Achieve < 1 second glass-to-glass latency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_15m_concurrent_viewers(**kwargs) -> Dict:
    """
    FR-2: Support 15M concurrent viewers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_1080p60_quality(**kwargs) -> Dict:
    """
    FR-3: Maintain 1080p60 quality
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_instant_channel_switching(**kwargs) -> Dict:
    """
    FR-4: Enable instant channel switching
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_legacy_hls_players(**kwargs) -> Dict:
    """
    FR-5: Support legacy HLS players
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Coinbase Matching Engine Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationCoinbaseMatchingProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-coinbase-matching',
  title: 'Coinbase Matching Engine Migration',
  description: `Coinbase processes trades in milliseconds. Design migration to microsecond-latency matching engine handling $10B daily volume with regulatory compliance.
- Process orders in < 10 microseconds
- Maintain FIFO order fairness
- Support 1M orders/second
- Enable instant settlement`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process orders in < 10 microseconds',
    'Maintain FIFO order fairness',
    'Support 1M orders/second',
    'Enable instant settlement',
    'Preserve full audit trail'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10 microseconds',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-coinbase-matching', problemConfigs['l5-migration-coinbase-matching'], [
    'Process orders in < 10 microseconds',
    'Maintain FIFO order fairness',
    'Support 1M orders/second',
    'Enable instant settlement',
    'Preserve full audit trail'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def process_orders_in_10_microseconds(**kwargs) -> Dict:
    """
    FR-1: Process orders in < 10 microseconds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_fifo_order_fairness(**kwargs) -> Dict:
    """
    FR-2: Maintain FIFO order fairness
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_1m_orders_second(**kwargs) -> Dict:
    """
    FR-3: Support 1M orders/second
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_instant_settlement(**kwargs) -> Dict:
    """
    FR-4: Enable instant settlement
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Preserve full audit trail
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * Figma Real-Time Collaboration Migration
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5MigrationFigmaCollaborationProblemDefinition: ProblemDefinition = {
  id: 'l5-migration-figma-collaboration',
  title: 'Figma Real-Time Collaboration Migration',
  description: `Figma supports ~10 concurrent editors per document. Design architecture to support 1000+ simultaneous editors on enterprise design systems with real-time sync.
- Support 1000+ concurrent editors
- Maintain 60 FPS performance
- Handle 1GB+ document sizes
- Enable selective sync`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 1000+ concurrent editors',
    'Maintain 60 FPS performance',
    'Handle 1GB+ document sizes',
    'Enable selective sync',
    'Support offline editing'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms for operations',
    'Dataset Size: 1GB+ design files',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-migration-figma-collaboration', problemConfigs['l5-migration-figma-collaboration'], [
    'Support 1000+ concurrent editors',
    'Maintain 60 FPS performance',
    'Handle 1GB+ document sizes',
    'Enable selective sync',
    'Support offline editing'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
memory = {}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Support 1000+ concurrent editors
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def maintain_60_fps_performance(**kwargs) -> Dict:
    """
    FR-2: Maintain 60 FPS performance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_1gb_document_sizes(**kwargs) -> Dict:
    """
    FR-3: Handle 1GB+ document sizes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_selective_sync(**kwargs) -> Dict:
    """
    FR-4: Enable selective sync
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Support offline editing
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
};

/**
 * Netflix Monolith To Microservices Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration1ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-1',
  title: 'Netflix Monolith To Microservices Platform',
  description: `Netflix needs to implement monolith to microservices to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support monolith to microservices at Netflix scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support monolith to microservices at Netflix scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 10M requests per second',
    'Dataset Size: 100TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-1', problemConfigs['l5-platform-migration-1'], [
    'Support monolith to microservices at Netflix scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_monolith_to_microservices_at_net(**kwargs) -> Dict:
    """
    FR-1: Support monolith to microservices at Netflix scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Uber Database Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration2ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-2',
  title: 'Uber Database Migration Platform',
  description: `Uber needs to implement database migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support database migration at Uber scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support database migration at Uber scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 11M requests per second',
    'Dataset Size: 110TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-2', problemConfigs['l5-platform-migration-2'], [
    'Support database migration at Uber scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_database_migration_at_uber_scale(**kwargs) -> Dict:
    """
    FR-1: Support database migration at Uber scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Airbnb Cloud Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration3ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-3',
  title: 'Airbnb Cloud Migration Platform',
  description: `Airbnb needs to implement cloud migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support cloud migration at Airbnb scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cloud migration at Airbnb scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 12M requests per second',
    'Dataset Size: 120TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-3', problemConfigs['l5-platform-migration-3'], [
    'Support cloud migration at Airbnb scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_cloud_migration_at_airbnb_scale(**kwargs) -> Dict:
    """
    FR-1: Support cloud migration at Airbnb scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Spotify Protocol Upgrade Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration4ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-4',
  title: 'Spotify Protocol Upgrade Platform',
  description: `Spotify needs to implement protocol upgrade to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support protocol upgrade at Spotify scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support protocol upgrade at Spotify scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 13M requests per second',
    'Dataset Size: 130TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-4', problemConfigs['l5-platform-migration-4'], [
    'Support protocol upgrade at Spotify scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_protocol_upgrade_at_spotify_scal(**kwargs) -> Dict:
    """
    FR-1: Support protocol upgrade at Spotify scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Twitter Infrastructure Modernization Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration5ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-5',
  title: 'Twitter Infrastructure Modernization Platform',
  description: `Twitter needs to implement infrastructure modernization to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure modernization at Twitter scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure modernization at Twitter scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 14M requests per second',
    'Dataset Size: 140TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-5', problemConfigs['l5-platform-migration-5'], [
    'Support infrastructure modernization at Twitter scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_infrastructure_modernization_at(**kwargs) -> Dict:
    """
    FR-1: Support infrastructure modernization at Twitter scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * LinkedIn Monolith To Microservices Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration6ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-6',
  title: 'LinkedIn Monolith To Microservices Platform',
  description: `LinkedIn needs to implement monolith to microservices to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support monolith to microservices at LinkedIn scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support monolith to microservices at LinkedIn scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 15M requests per second',
    'Dataset Size: 150TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-6', problemConfigs['l5-platform-migration-6'], [
    'Support monolith to microservices at LinkedIn scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_monolith_to_microservices_at_lin(**kwargs) -> Dict:
    """
    FR-1: Support monolith to microservices at LinkedIn scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Pinterest Database Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration7ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-7',
  title: 'Pinterest Database Migration Platform',
  description: `Pinterest needs to implement database migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support database migration at Pinterest scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support database migration at Pinterest scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 16M requests per second',
    'Dataset Size: 160TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-7', problemConfigs['l5-platform-migration-7'], [
    'Support database migration at Pinterest scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_database_migration_at_pinterest(**kwargs) -> Dict:
    """
    FR-1: Support database migration at Pinterest scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Slack Cloud Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration8ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-8',
  title: 'Slack Cloud Migration Platform',
  description: `Slack needs to implement cloud migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support cloud migration at Slack scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cloud migration at Slack scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 17M requests per second',
    'Dataset Size: 170TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-8', problemConfigs['l5-platform-migration-8'], [
    'Support cloud migration at Slack scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_cloud_migration_at_slack_scale(**kwargs) -> Dict:
    """
    FR-1: Support cloud migration at Slack scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Discord Protocol Upgrade Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration9ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-9',
  title: 'Discord Protocol Upgrade Platform',
  description: `Discord needs to implement protocol upgrade to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support protocol upgrade at Discord scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support protocol upgrade at Discord scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 18M requests per second',
    'Dataset Size: 180TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-9', problemConfigs['l5-platform-migration-9'], [
    'Support protocol upgrade at Discord scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_protocol_upgrade_at_discord_scal(**kwargs) -> Dict:
    """
    FR-1: Support protocol upgrade at Discord scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Reddit Infrastructure Modernization Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration10ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-10',
  title: 'Reddit Infrastructure Modernization Platform',
  description: `Reddit needs to implement infrastructure modernization to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure modernization at Reddit scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure modernization at Reddit scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 19M requests per second',
    'Dataset Size: 190TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-10', problemConfigs['l5-platform-migration-10'], [
    'Support infrastructure modernization at Reddit scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_infrastructure_modernization_at(**kwargs) -> Dict:
    """
    FR-1: Support infrastructure modernization at Reddit scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Snapchat Monolith To Microservices Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration11ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-11',
  title: 'Snapchat Monolith To Microservices Platform',
  description: `Snapchat needs to implement monolith to microservices to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support monolith to microservices at Snapchat scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support monolith to microservices at Snapchat scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 20M requests per second',
    'Dataset Size: 200TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-11', problemConfigs['l5-platform-migration-11'], [
    'Support monolith to microservices at Snapchat scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
messages = {}
events = {}
memory = {}

def support_monolith_to_microservices_at_sna(**kwargs) -> Dict:
    """
    FR-1: Support monolith to microservices at Snapchat scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * TikTok Database Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration12ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-12',
  title: 'TikTok Database Migration Platform',
  description: `TikTok needs to implement database migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support database migration at TikTok scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support database migration at TikTok scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 21M requests per second',
    'Dataset Size: 210TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-12', problemConfigs['l5-platform-migration-12'], [
    'Support database migration at TikTok scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_database_migration_at_tiktok_sca(**kwargs) -> Dict:
    """
    FR-1: Support database migration at TikTok scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Zoom Cloud Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration13ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-13',
  title: 'Zoom Cloud Migration Platform',
  description: `Zoom needs to implement cloud migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support cloud migration at Zoom scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cloud migration at Zoom scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 22M requests per second',
    'Dataset Size: 220TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-13', problemConfigs['l5-platform-migration-13'], [
    'Support cloud migration at Zoom scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_cloud_migration_at_zoom_scale(**kwargs) -> Dict:
    """
    FR-1: Support cloud migration at Zoom scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Shopify Protocol Upgrade Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration14ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-14',
  title: 'Shopify Protocol Upgrade Platform',
  description: `Shopify needs to implement protocol upgrade to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support protocol upgrade at Shopify scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support protocol upgrade at Shopify scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 23M requests per second',
    'Dataset Size: 230TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-14', problemConfigs['l5-platform-migration-14'], [
    'Support protocol upgrade at Shopify scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_protocol_upgrade_at_shopify_scal(**kwargs) -> Dict:
    """
    FR-1: Support protocol upgrade at Shopify scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Square Infrastructure Modernization Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration15ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-15',
  title: 'Square Infrastructure Modernization Platform',
  description: `Square needs to implement infrastructure modernization to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure modernization at Square scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure modernization at Square scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 24M requests per second',
    'Dataset Size: 240TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-15', problemConfigs['l5-platform-migration-15'], [
    'Support infrastructure modernization at Square scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_infrastructure_modernization_at(**kwargs) -> Dict:
    """
    FR-1: Support infrastructure modernization at Square scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Stripe Monolith To Microservices Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration16ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-16',
  title: 'Stripe Monolith To Microservices Platform',
  description: `Stripe needs to implement monolith to microservices to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support monolith to microservices at Stripe scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support monolith to microservices at Stripe scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 25M requests per second',
    'Dataset Size: 250TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-16', problemConfigs['l5-platform-migration-16'], [
    'Support monolith to microservices at Stripe scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_monolith_to_microservices_at_str(**kwargs) -> Dict:
    """
    FR-1: Support monolith to microservices at Stripe scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * PayPal Database Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration17ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-17',
  title: 'PayPal Database Migration Platform',
  description: `PayPal needs to implement database migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support database migration at PayPal scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support database migration at PayPal scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 26M requests per second',
    'Dataset Size: 260TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-17', problemConfigs['l5-platform-migration-17'], [
    'Support database migration at PayPal scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_database_migration_at_paypal_sca(**kwargs) -> Dict:
    """
    FR-1: Support database migration at PayPal scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

/**
 * Netflix Cloud Migration Platform
 * From extracted-problems/system-design/platform-migration.md
 */
export const l5PlatformMigration18ProblemDefinition: ProblemDefinition = {
  id: 'l5-platform-migration-18',
  title: 'Netflix Cloud Migration Platform',
  description: `Netflix needs to implement cloud migration to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support cloud migration at Netflix scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support cloud migration at Netflix scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 27M requests per second',
    'Dataset Size: 270TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-platform-migration-18', problemConfigs['l5-platform-migration-18'], [
    'Support cloud migration at Netflix scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def support_cloud_migration_at_netflix_scale(**kwargs) -> Dict:
    """
    FR-1: Support cloud migration at Netflix scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_gradual_migration_with_zero_downt(**kwargs) -> Dict:
    """
    FR-2: Enable gradual migration with zero downtime
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_backward_compatibility(**kwargs) -> Dict:
    """
    FR-3: Maintain backward compatibility
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing_and_gradual_rollout(**kwargs) -> Dict:
    """
    FR-4: Support A/B testing and gradual rollout
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide comprehensive monitoring and rollback
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
};

// Auto-generate code challenges from functional requirements
(l5MigrationNetflixMicroservicesProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(l5MigrationNetflixMicroservicesProblemDefinition);
