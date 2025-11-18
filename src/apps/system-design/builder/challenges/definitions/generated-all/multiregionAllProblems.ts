import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Multiregion Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 35 problems
 */

/**
 * Basic Multi-Region Setup
 * From extracted-problems/system-design/multiregion.md
 */
export const basicMultiRegionProblemDefinition: ProblemDefinition = {
  id: 'basic-multi-region',
  title: 'Basic Multi-Region Setup',
  description: `Deploy a simple web application across two regions with basic failover. Learn about DNS routing, health checks, and data replication fundamentals.
- Deploy in US and EU regions
- Route users to nearest region
- Replicate data between regions
- Handle region failures`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Deploy in US and EU regions',
    'Route users to nearest region',
    'Replicate data between regions',
    'Handle region failures',
    'Monitor cross-region latency'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms same-region, < 300ms cross-region',
    'Request Rate: 10k requests/sec per region',
    'Availability: 99.95% with regional failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need US Users (redirect_client) for deploy app in two regions',
      },
      {
        type: 'cdn',
        reason: 'Need GeoDNS (cdn) for deploy app in two regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need US LB (lb) for deploy app in two regions',
      },
      {
        type: 'storage',
        reason: 'Need US DB (db_primary) for deploy app in two regions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'US Users routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'EU Users routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GeoDNS routes to US LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GeoDNS routes to EU LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'US LB routes to US App',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'EU LB routes to EU App',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'US App routes to US DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EU App routes to EU DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'US DB routes to EU DB',
      }
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

  scenarios: generateScenarios('basic-multi-region', problemConfigs['basic-multi-region'], [
    'Deploy in US and EU regions',
    'Route users to nearest region',
    'Replicate data between regions',
    'Handle region failures',
    'Monitor cross-region latency'
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
US = {}
events = {}
memory = {}

def deploy_in_us_and_eu_regions(**kwargs) -> Dict:
    """
    FR-1: Deploy in US and EU regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def route_users_to_nearest_region(**kwargs) -> Dict:
    """
    FR-2: Route users to nearest region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def replicate_data_between_regions(**kwargs) -> Dict:
    """
    FR-3: Replicate data between regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_region_failures(**kwargs) -> Dict:
    """
    FR-4: Handle region failures
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Monitor cross-region latency
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
 * Active-Active Multi-Region
 * From extracted-problems/system-design/multiregion.md
 */
export const activeActiveRegionsProblemDefinition: ProblemDefinition = {
  id: 'active-active-regions',
  title: 'Active-Active Multi-Region',
  description: `Build an active-active setup where both regions can handle writes. Learn about conflict resolution, vector clocks, and eventual consistency.
- Accept writes in both regions
- Resolve write conflicts
- Maintain eventual consistency
- Handle network partitions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Accept writes in both regions',
    'Resolve write conflicts',
    'Maintain eventual consistency',
    'Handle network partitions',
    'Support regional preferences'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for local writes',
    'Request Rate: 5k writes/sec per region',
    'Availability: 99.9% per region'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Region A Users (redirect_client) for both regions handle writes',
      },
      {
        type: 'load_balancer',
        reason: 'Need Region A LB (lb) for both regions handle writes',
      },
      {
        type: 'storage',
        reason: 'Need Region A DB (db_primary) for both regions handle writes',
      },
      {
        type: 'message_queue',
        reason: 'Need Replication Stream (stream) for both regions handle writes',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Region A Users routes to Region A LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Region B Users routes to Region B LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Region A LB routes to Region A App',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Region B LB routes to Region B App',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Region A App routes to Region A DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Region B App routes to Region B DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Region A DB routes to Replication Stream',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Region B DB routes to Replication Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Replication Stream routes to Conflict Resolver',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Conflict Resolver routes to Region A DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Conflict Resolver routes to Region B DB',
      }
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

  scenarios: generateScenarios('active-active-regions', problemConfigs['active-active-regions'], [
    'Accept writes in both regions',
    'Resolve write conflicts',
    'Maintain eventual consistency',
    'Handle network partitions',
    'Support regional preferences'
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
both = {}
items = {}
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Accept writes in both regions
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Resolve write conflicts
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def maintain_eventual_consistency(**kwargs) -> Dict:
    """
    FR-3: Maintain eventual consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_network_partitions(**kwargs) -> Dict:
    """
    FR-4: Handle network partitions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_regional_preferences(**kwargs) -> Dict:
    """
    FR-5: Support regional preferences
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global CDN with Regional Origins
 * From extracted-problems/system-design/multiregion.md
 */
export const globalCdnProblemDefinition: ProblemDefinition = {
  id: 'global-cdn',
  title: 'Global CDN with Regional Origins',
  description: `Design a global CDN architecture with regional origin servers, cache invalidation, and edge optimization.
- Edge caching in 100+ locations
- Regional origin failover
- Cache invalidation
- Dynamic content bypass`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Edge caching in 100+ locations',
    'Regional origin failover',
    'Cache invalidation',
    'Dynamic content bypass',
    'DDoS protection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms globally',
    'Request Rate: 10M req/s',
    'Dataset Size: 1PB static assets',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for serve static assets globally',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for serve static assets globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Origin LB (lb) for serve static assets globally',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 (object_store) for serve static assets globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Users routes to CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN routes to Origin LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Origin LB routes to US Origin',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Origin LB routes to EU Origin',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'US Origin routes to S3',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'EU Origin routes to S3',
      }
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

  scenarios: generateScenarios('global-cdn', problemConfigs['global-cdn'], [
    'Edge caching in 100+ locations',
    'Regional origin failover',
    'Cache invalidation',
    'Dynamic content bypass',
    'DDoS protection'
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
cache = {}
posts = {}
100 = {}
item = {}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-1: Edge caching in 100+ locations
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-1: Edge caching in 100+ locations
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def regional_origin_failover(**kwargs) -> Dict:
    """
    FR-2: Regional origin failover
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-3: Cache invalidation
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-3: Cache invalidation
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def dynamic_content_bypass(**kwargs) -> Dict:
    """
    FR-4: Dynamic content bypass
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ddos_protection(**kwargs) -> Dict:
    """
    FR-5: DDoS protection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Anycast Global Load Balancing
 * From extracted-problems/system-design/multiregion.md
 */
export const globalLoadBalancingProblemDefinition: ProblemDefinition = {
  id: 'global-load-balancing',
  title: 'Anycast Global Load Balancing',
  description: `Design an anycast-based global load balancing system that routes users to the geographically nearest healthy region.
- Anycast IP routing
- Health-based routing
- Latency-based routing
- Traffic distribution`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Anycast IP routing',
    'Health-based routing',
    'Latency-based routing',
    'Traffic distribution',
    'DDoS mitigation'
  ],
  userFacingNFRs: [
    'Latency: P95 < 80ms globally',
    'Request Rate: 5M req/s',
    'Dataset Size: 100M users across 20 regions',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for route users to nearest healthy region',
      },
      {
        type: 'load_balancer',
        reason: 'Need Anycast LB (lb) for route users to nearest healthy region',
      },
      {
        type: 'cache',
        reason: 'Need Global Cache (cache) for route users to nearest healthy region',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Anycast LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Anycast LB routes to US-East',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Anycast LB routes to EU-West',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Anycast LB routes to AP-South',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US-East routes to Global Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU-West routes to Global Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AP-South routes to Global Cache',
      }
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

  scenarios: generateScenarios('global-load-balancing', problemConfigs['global-load-balancing'], [
    'Anycast IP routing',
    'Health-based routing',
    'Latency-based routing',
    'Traffic distribution',
    'DDoS mitigation'
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

def anycast_ip_routing(**kwargs) -> Dict:
    """
    FR-1: Anycast IP routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def health_based_routing(**kwargs) -> Dict:
    """
    FR-2: Health-based routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def latency_based_routing(**kwargs) -> Dict:
    """
    FR-3: Latency-based routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def traffic_distribution(**kwargs) -> Dict:
    """
    FR-4: Traffic distribution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ddos_mitigation(**kwargs) -> Dict:
    """
    FR-5: DDoS mitigation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global Session Store with Sticky Sessions
 * From extracted-problems/system-design/multiregion.md
 */
export const distributedSessionStoreProblemDefinition: ProblemDefinition = {
  id: 'distributed-session-store',
  title: 'Global Session Store with Sticky Sessions',
  description: `Design a distributed session store allowing users to roam between regions while maintaining their session state.
- Global session lookup
- Session replication
- TTL-based expiration
- Sticky sessions optional`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Global session lookup',
    'Session replication',
    'TTL-based expiration',
    'Sticky sessions optional',
    'Session hijacking protection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms local, < 200ms cross-region',
    'Request Rate: 1M req/s',
    'Dataset Size: 100M active sessions',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for share sessions across regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global LB (lb) for share sessions across regions',
      },
      {
        type: 'cache',
        reason: 'Need Redis Global (cache) for share sessions across regions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Global LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to US Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to EU Apps',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US Apps routes to Redis Global',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU Apps routes to Redis Global',
      }
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

  scenarios: generateScenarios('distributed-session-store', problemConfigs['distributed-session-store'], [
    'Global session lookup',
    'Session replication',
    'TTL-based expiration',
    'Sticky sessions optional',
    'Session hijacking protection'
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

def global_session_lookup(**kwargs) -> Dict:
    """
    FR-1: Global session lookup
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def session_replication(**kwargs) -> Dict:
    """
    FR-2: Session replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ttl_based_expiration(**kwargs) -> Dict:
    """
    FR-3: TTL-based expiration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def sticky_sessions_optional(**kwargs) -> Dict:
    """
    FR-4: Sticky sessions optional
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def session_hijacking_protection(**kwargs) -> Dict:
    """
    FR-5: Session hijacking protection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Cross-Region Backup & Recovery
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionBackupProblemDefinition: ProblemDefinition = {
  id: 'multiregion-backup',
  title: 'Cross-Region Backup & Recovery',
  description: `Design a backup and recovery system with cross-region replication, point-in-time recovery, and automated testing.
- Automated continuous backup
- Cross-region replication
- Point-in-time recovery (PITR)
- Automated backup testing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Automated continuous backup',
    'Cross-region replication',
    'Point-in-time recovery (PITR)',
    'Automated backup testing',
    'Encryption at rest and in transit'
  ],
  userFacingNFRs: [
    'Latency: Backup lag < 5min, Recovery RTO < 1hr',
    'Request Rate: N/A (background)',
    'Dataset Size: 100TB database',
    'Availability: RPO < 5min, RTO < 1hr'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need DB (db_primary) for automated backups with geo-redundancy',
      },
      {
        type: 'compute',
        reason: 'Need Backup Agent (worker) for automated backups with geo-redundancy',
      },
      {
        type: 'object_storage',
        reason: 'Need US S3 (object_store) for automated backups with geo-redundancy',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'storage',
        to: 'compute',
        reason: 'DB routes to Backup Agent',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Backup Agent routes to US S3',
      },
      {
        from: 'object_storage',
        to: 'object_storage',
        reason: 'US S3 routes to EU S3',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'US S3 routes to Test Restore',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'EU S3 routes to Test Restore',
      }
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

  scenarios: generateScenarios('multiregion-backup', problemConfigs['multiregion-backup'], [
    'Automated continuous backup',
    'Cross-region replication',
    'Point-in-time recovery (PITR)',
    'Automated backup testing',
    'Encryption at rest and in transit'
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
transit = {}

def automated_continuous_backup(**kwargs) -> Dict:
    """
    FR-1: Automated continuous backup
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_region_replication(**kwargs) -> Dict:
    """
    FR-2: Cross-region replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def point_in_time_recovery_pitr(**kwargs) -> Dict:
    """
    FR-3: Point-in-time recovery (PITR)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automated_backup_testing(**kwargs) -> Dict:
    """
    FR-4: Automated backup testing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def encryption_at_rest_and_in_transit(**kwargs) -> Dict:
    """
    FR-5: Encryption at rest and in transit
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global DNS with GeoDNS Routing
 * From extracted-problems/system-design/multiregion.md
 */
export const globalDnsProblemDefinition: ProblemDefinition = {
  id: 'global-dns',
  title: 'Global DNS with GeoDNS Routing',
  description: `Design a global DNS infrastructure with GeoDNS routing, health checks, and failover capabilities.
- GeoDNS for latency-based routing
- Health check integration
- Failover to backup regions
- DNSSEC support`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'GeoDNS for latency-based routing',
    'Health check integration',
    'Failover to backup regions',
    'DNSSEC support',
    'DDoS protection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms DNS resolution',
    'Request Rate: 100k queries/s',
    'Dataset Size: 1M DNS records',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Queries (redirect_client) for route dns queries to nearest region',
      },
      {
        type: 'load_balancer',
        reason: 'Need GeoDNS (lb) for route dns queries to nearest region',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Queries routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'GeoDNS routes to US',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'GeoDNS routes to EU',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'GeoDNS routes to AP',
      }
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

  scenarios: generateScenarios('global-dns', problemConfigs['global-dns'], [
    'GeoDNS for latency-based routing',
    'Health check integration',
    'Failover to backup regions',
    'DNSSEC support',
    'DDoS protection'
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

def geodns_for_latency_based_routing(**kwargs) -> Dict:
    """
    FR-1: GeoDNS for latency-based routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def health_check_integration(**kwargs) -> Dict:
    """
    FR-2: Health check integration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def failover_to_backup_regions(**kwargs) -> Dict:
    """
    FR-3: Failover to backup regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def dnssec_support(**kwargs) -> Dict:
    """
    FR-4: DNSSEC support
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ddos_protection(**kwargs) -> Dict:
    """
    FR-5: DDoS protection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global IP Anycast Network
 * From extracted-problems/system-design/multiregion.md
 */
export const globalIpAnycastProblemDefinition: ProblemDefinition = {
  id: 'global-ip-anycast',
  title: 'Global IP Anycast Network',
  description: `Design a global anycast network where the same IP address is advertised from multiple locations via BGP routing.
- BGP anycast advertisement
- Health-based route withdrawal
- DDoS mitigation
- Traffic engineering`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'BGP anycast advertisement',
    'Health-based route withdrawal',
    'DDoS mitigation',
    'Traffic engineering',
    'Automatic failover'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms globally',
    'Request Rate: 20M req/s',
    'Dataset Size: 50+ POPs worldwide',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Traffic (redirect_client) for single ip address globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Anycast IP (lb) for single ip address globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Traffic routes to Anycast IP',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Anycast IP routes to US POPs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Anycast IP routes to EU POPs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Anycast IP routes to AP POPs',
      }
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

  scenarios: generateScenarios('global-ip-anycast', problemConfigs['global-ip-anycast'], [
    'BGP anycast advertisement',
    'Health-based route withdrawal',
    'DDoS mitigation',
    'Traffic engineering',
    'Automatic failover'
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

def bgp_anycast_advertisement(**kwargs) -> Dict:
    """
    FR-1: BGP anycast advertisement
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def health_based_route_withdrawal(**kwargs) -> Dict:
    """
    FR-2: Health-based route withdrawal
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ddos_mitigation(**kwargs) -> Dict:
    """
    FR-3: DDoS mitigation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def traffic_engineering(**kwargs) -> Dict:
    """
    FR-4: Traffic engineering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_failover(**kwargs) -> Dict:
    """
    FR-5: Automatic failover
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Geofenced Feature Rollout
 * From extracted-problems/system-design/multiregion.md
 */
export const geofencedFeaturesProblemDefinition: ProblemDefinition = {
  id: 'geofenced-features',
  title: 'Geofenced Feature Rollout',
  description: `Design a feature flagging system that enables/disables features based on user geography for staged rollouts.
- IP-based geolocation
- Feature flag per region
- Gradual rollout (0% → 100%)
- Rollback capability`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'IP-based geolocation',
    'Feature flag per region',
    'Gradual rollout (0% → 100%)',
    'Rollback capability',
    'A/B testing per region'
  ],
  userFacingNFRs: [
    'Latency: Flag check < 5ms',
    'Request Rate: 10M req/s',
    'Dataset Size: 10k feature flags',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for launch features in specific regions first',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for launch features in specific regions first',
      },
      {
        type: 'cache',
        reason: 'Need Flag Cache (cache) for launch features in specific regions first',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Users routes to GeoIP',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Apps',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Apps routes to Flag Cache',
      }
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

  scenarios: generateScenarios('geofenced-features', problemConfigs['geofenced-features'], [
    'IP-based geolocation',
    'Feature flag per region',
    'Gradual rollout (0% → 100%)',
    'Rollback capability',
    'A/B testing per region'
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

def ip_based_geolocation(**kwargs) -> Dict:
    """
    FR-1: IP-based geolocation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def feature_flag_per_region(**kwargs) -> Dict:
    """
    FR-2: Feature flag per region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def gradual_rollout_0_100(**kwargs) -> Dict:
    """
    FR-3: Gradual rollout (0% → 100%)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rollback_capability(**kwargs) -> Dict:
    """
    FR-4: Rollback capability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def a_b_testing_per_region(**kwargs) -> Dict:
    """
    FR-5: A/B testing per region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Graceful Degradation on Partial Failure
 * From extracted-problems/system-design/multiregion.md
 */
export const partialRegionFailureProblemDefinition: ProblemDefinition = {
  id: 'partial-region-failure',
  title: 'Graceful Degradation on Partial Failure',
  description: `Design a system that gracefully degrades when an availability zone fails while maintaining critical functionality.
- AZ-aware deployment
- Health checks per AZ
- Automatic AZ failover
- Degraded mode operation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'AZ-aware deployment',
    'Health checks per AZ',
    'Automatic AZ failover',
    'Degraded mode operation',
    'Capacity planning for N-1 AZs'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms normal, < 300ms degraded',
    'Request Rate: 1M req/s',
    'Dataset Size: 3 AZs per region',
    'Availability: 99.95% with AZ failure'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for handle availability zone failures',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for handle availability zone failures',
      },
      {
        type: 'storage',
        reason: 'Need Primary (db_primary) for handle availability zone failures',
      },
      {
        type: 'cache',
        reason: 'Need Cache (cache) for handle availability zone failures',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AZ-1',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AZ-2',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AZ-3',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AZ-1 routes to Primary',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AZ-2 routes to Primary',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AZ-3 routes to Primary',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AZ-1 routes to Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AZ-2 routes to Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AZ-3 routes to Cache',
      }
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

  scenarios: generateScenarios('partial-region-failure', problemConfigs['partial-region-failure'], [
    'AZ-aware deployment',
    'Health checks per AZ',
    'Automatic AZ failover',
    'Degraded mode operation',
    'Capacity planning for N-1 AZs'
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

def az_aware_deployment(**kwargs) -> Dict:
    """
    FR-1: AZ-aware deployment
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def health_checks_per_az(**kwargs) -> Dict:
    """
    FR-2: Health checks per AZ
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_az_failover(**kwargs) -> Dict:
    """
    FR-3: Automatic AZ failover
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def degraded_mode_operation(**kwargs) -> Dict:
    """
    FR-4: Degraded mode operation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def capacity_planning_for_n_1_azs(**kwargs) -> Dict:
    """
    FR-5: Capacity planning for N-1 AZs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Facebook-like Global Platform
 * From extracted-problems/system-design/multiregion.md
 */
export const globalSocialNetworkProblemDefinition: ProblemDefinition = {
  id: 'global-social-network',
  title: 'Facebook-like Global Platform',
  description: `Design a Facebook/WhatsApp-scale global social network serving 3B+ users with 100M requests/sec across 20+ regions. Must deliver messages in <100ms globally, handle viral content (10B impressions/hour), survive entire continent failures, and operate within $1B/month budget. Support E2E encryption, GDPR/CCPA compliance across 190+ countries, real-time translation for 100+ languages, while maintaining data sovereignty and handling 1T+ daily messages.
- Support 3B+ users across 20+ global regions
- Process 100M requests/sec (1B during viral events)
- Deliver 1T+ messages daily with E2E encryption
- Store user data in home region (GDPR/CCPA)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 3B+ users across 20+ global regions',
    'Process 100M requests/sec (1B during viral events)',
    'Deliver 1T+ messages daily with E2E encryption',
    'Store user data in home region (GDPR/CCPA)',
    'Handle viral content spreading to 1B users/hour',
    'Real-time translation for 100+ languages',
    'Cross-region friend graph with 100B+ edges',
    'Support Stories/Reels with 10M concurrent uploads'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms same-region, < 200ms global messaging',
    'Request Rate: 100M req/sec normal, 1B during viral events',
    'Dataset Size: 10B users profiles, 100PB media, 1EB total',
    'Availability: 99.999% for messaging, 99.99% for feed'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for facebook-scale 3b users/100m qps globally',
      },
      {
        type: 'cdn',
        reason: 'Need Global CDN (cdn) for facebook-scale 3b users/100m qps globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need US LB (lb) for facebook-scale 3b users/100m qps globally',
      },
      {
        type: 'cache',
        reason: 'Need Regional Cache (cache) for facebook-scale 3b users/100m qps globally',
      },
      {
        type: 'storage',
        reason: 'Need Regional DBs (db_primary) for facebook-scale 3b users/100m qps globally',
      },
      {
        type: 'message_queue',
        reason: 'Need Global Kafka (stream) for facebook-scale 3b users/100m qps globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Global Users routes to Global CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Global CDN routes to US LB',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Global CDN routes to EU LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'US LB routes to US Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'EU LB routes to EU Apps',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US Apps routes to Regional Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU Apps routes to Regional Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'US Apps routes to Regional DBs',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EU Apps routes to Regional DBs',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'US Apps routes to Global Kafka',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'EU Apps routes to Global Kafka',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Global Kafka routes to Async Queue',
      }
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

  scenarios: generateScenarios('global-social-network', problemConfigs['global-social-network'], [
    'Support 3B+ users across 20+ global regions',
    'Process 100M requests/sec (1B during viral events)',
    'Deliver 1T+ messages daily with E2E encryption',
    'Store user data in home region (GDPR/CCPA)',
    'Handle viral content spreading to 1B users/hour',
    'Real-time translation for 100+ languages',
    'Cross-region friend graph with 100B+ edges',
    'Support Stories/Reels with 10M concurrent uploads'
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
messages = {}
posts = {}
relationships = {}
users = {}
home = {}
items = {}
memory = {}

def support_3b_users_across_20_global_regi(**kwargs) -> Dict:
    """
    FR-1: Support 3B+ users across 20+ global regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def process_100m_requests_sec_1b_during_vir(**kwargs) -> Dict:
    """
    FR-2: Process 100M requests/sec (1B during viral events)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def deliver_1t_messages_daily_with_e2e_encr(**kwargs) -> Dict:
    """
    FR-3: Deliver 1T+ messages daily with E2E encryption
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_user(user_id: str, **kwargs) -> Dict:
    """
    FR-4: Store user data in home region (GDPR/CCPA)
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return users[user_id]

def get_item(item_id: str) -> Dict:
    """
    FR-5: Handle viral content spreading to 1B users/hour
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def real_time_translation_for_100_languages(**kwargs) -> Dict:
    """
    FR-6: Real-time translation for 100+ languages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-7: Cross-region friend graph with 100B+ edges
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-8: Support Stories/Reels with 10M concurrent uploads
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]`,
};

/**
 * Cross-Region Disaster Recovery
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionFailoverProblemDefinition: ProblemDefinition = {
  id: 'cross-region-failover',
  title: 'Cross-Region Disaster Recovery',
  description: `Design a multi-region system with automatic failover, data replication, and health monitoring to survive full region outages.
- Health checks per region
- Automatic DNS failover
- Async data replication
- RPO < 5 minutes`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Health checks per region',
    'Automatic DNS failover',
    'Async data replication',
    'RPO < 5 minutes',
    'RTO < 10 minutes'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms normal, < 500ms during failover',
    'Request Rate: 500k req/s',
    'Dataset Size: 10TB per region',
    'Availability: 99.99% with region failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for automatic failover between regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global DNS (lb) for automatic failover between regions',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for automatic failover between regions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Users routes to Global DNS',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global DNS routes to Primary Region',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Global DNS routes to Standby Region',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Primary Region routes to Primary DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'Standby Region routes to Standby DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'Primary DB routes to Standby DB',
      }
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

  scenarios: generateScenarios('cross-region-failover', problemConfigs['cross-region-failover'], [
    'Health checks per region',
    'Automatic DNS failover',
    'Async data replication',
    'RPO < 5 minutes',
    'RTO < 10 minutes'
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

def health_checks_per_region(**kwargs) -> Dict:
    """
    FR-1: Health checks per region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_dns_failover(**kwargs) -> Dict:
    """
    FR-2: Automatic DNS failover
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def async_data_replication(**kwargs) -> Dict:
    """
    FR-3: Async data replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rpo_5_minutes(**kwargs) -> Dict:
    """
    FR-4: RPO < 5 minutes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rto_10_minutes(**kwargs) -> Dict:
    """
    FR-5: RTO < 10 minutes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Geo-Pinning for Data Residency (GDPR)
 * From extracted-problems/system-design/multiregion.md
 */
export const geoPinningProblemDefinition: ProblemDefinition = {
  id: 'geo-pinning',
  title: 'Geo-Pinning for Data Residency (GDPR)',
  description: `Design a system that enforces data residency requirements, ensuring EU user data never leaves EU borders per GDPR.
- Geo-fencing per region
- User location detection
- Data residency enforcement
- Audit logging`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Geo-fencing per region',
    'User location detection',
    'Data residency enforcement',
    'Audit logging',
    'Cross-region aggregation for analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 200k req/s',
    'Dataset Size: 50M EU users, 100M US users',
    'Availability: 99.95% uptime, GDPR compliant'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for keep eu data in eu',
      },
      {
        type: 'load_balancer',
        reason: 'Need Geo LB (lb) for keep eu data in eu',
      },
      {
        type: 'storage',
        reason: 'Need EU DB (db_primary) for keep eu data in eu',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Geo LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to EU Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to US Apps',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EU Apps routes to EU DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'US Apps routes to US DB',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'EU DB routes to Analytics',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'US DB routes to Analytics',
      }
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

  scenarios: generateScenarios('geo-pinning', problemConfigs['geo-pinning'], [
    'Geo-fencing per region',
    'User location detection',
    'Data residency enforcement',
    'Audit logging',
    'Cross-region aggregation for analytics'
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
users = {}
memory = {}

def geo_fencing_per_region(**kwargs) -> Dict:
    """
    FR-1: Geo-fencing per region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def user_location_detection(**kwargs) -> Dict:
    """
    FR-2: User location detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def data_residency_enforcement(**kwargs) -> Dict:
    """
    FR-3: Data residency enforcement
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def audit_logging(**kwargs) -> Dict:
    """
    FR-4: Audit logging
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Cross-region aggregation for analytics
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
 * Multi-Region Event Streaming
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionStreamingProblemDefinition: ProblemDefinition = {
  id: 'multiregion-streaming',
  title: 'Multi-Region Event Streaming',
  description: `Design a Google Pub/Sub-scale multi-region event streaming platform processing 100M events/sec across 50+ regions with exactly-once delivery. Must replicate events in <100ms cross-region, handle network partitions, survive entire region failures, and operate within $300M/month budget. Support 1M+ topics, 10M+ subscriptions, schema evolution, and serve real-time ML pipelines while maintaining ordering guarantees and exactly-once semantics.
- Process 100M events/sec across 50+ regions
- Exactly-once delivery with <100ms replication
- Support 1M+ topics and 10M+ subscriptions
- Maintain ordering per partition globally`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 100M events/sec across 50+ regions',
    'Exactly-once delivery with <100ms replication',
    'Support 1M+ topics and 10M+ subscriptions',
    'Maintain ordering per partition globally',
    'Schema registry with evolution support',
    'Multi-region disaster recovery',
    'Real-time stream processing for ML',
    'Cross-region event replay and time travel'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms local, < 100ms cross-region replication',
    'Request Rate: 100M events/sec normal, 1B during peaks',
    'Dataset Size: 10PB/month ingestion, 90-day retention',
    'Availability: 99.999% for produce, 99.99% for consume'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Producers (redirect_client) for google pub/sub-scale 100m events/sec globally',
      },
      {
        type: 'message_queue',
        reason: 'Need US Kafka (stream) for google pub/sub-scale 100m events/sec globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers routes to US Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'US Kafka routes to MirrorMaker',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'EU Kafka routes to MirrorMaker',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'AP Kafka routes to MirrorMaker',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'MirrorMaker routes to US Kafka',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'MirrorMaker routes to EU Kafka',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'MirrorMaker routes to AP Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'US Kafka routes to Consumers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'EU Kafka routes to Consumers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'AP Kafka routes to Consumers',
      }
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

  scenarios: generateScenarios('multiregion-streaming', problemConfigs['multiregion-streaming'], [
    'Process 100M events/sec across 50+ regions',
    'Exactly-once delivery with <100ms replication',
    'Support 1M+ topics and 10M+ subscriptions',
    'Maintain ordering per partition globally',
    'Schema registry with evolution support',
    'Multi-region disaster recovery',
    'Real-time stream processing for ML',
    'Cross-region event replay and time travel'
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

def process_100m_events_sec_across_50_regio(**kwargs) -> Dict:
    """
    FR-1: Process 100M events/sec across 50+ regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def exactly_once_delivery_with_100ms_replic(**kwargs) -> Dict:
    """
    FR-2: Exactly-once delivery with <100ms replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_1m_topics_and_10m_subscription(**kwargs) -> Dict:
    """
    FR-3: Support 1M+ topics and 10M+ subscriptions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_ordering_per_partition_globally(**kwargs) -> Dict:
    """
    FR-4: Maintain ordering per partition globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def schema_registry_with_evolution_support(**kwargs) -> Dict:
    """
    FR-5: Schema registry with evolution support
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def multi_region_disaster_recovery(**kwargs) -> Dict:
    """
    FR-6: Multi-region disaster recovery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_stream_processing_for_ml(**kwargs) -> Dict:
    """
    FR-7: Real-time stream processing for ML
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_region_event_replay_and_time_trave(**kwargs) -> Dict:
    """
    FR-8: Cross-region event replay and time travel
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Latency-Based Intelligent Routing
 * From extracted-problems/system-design/multiregion.md
 */
export const latencyBasedRoutingProblemDefinition: ProblemDefinition = {
  id: 'latency-based-routing',
  title: 'Latency-Based Intelligent Routing',
  description: `Design a routing system that measures real-user latency to each region and dynamically routes to the fastest available region.
- Real User Monitoring (RUM)
- Latency measurement per region
- Dynamic routing updates
- Fallback to geo-proximity`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Real User Monitoring (RUM)',
    'Latency measurement per region',
    'Dynamic routing updates',
    'Fallback to geo-proximity',
    'A/B testing support'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms optimized',
    'Request Rate: 2M req/s',
    'Dataset Size: 500M users',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for route to fastest region dynamically',
      },
      {
        type: 'load_balancer',
        reason: 'Need Smart LB (lb) for route to fastest region dynamically',
      },
      {
        type: 'storage',
        reason: 'Need Latency DB (db_primary) for route to fastest region dynamically',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Users routes to RUM Collector',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Smart LB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'RUM Collector routes to Latency DB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Smart LB routes to US',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Smart LB routes to EU',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Smart LB routes to AP',
      },
      {
        from: 'load_balancer',
        to: 'storage',
        reason: 'Smart LB routes to Latency DB',
      }
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

  scenarios: generateScenarios('latency-based-routing', problemConfigs['latency-based-routing'], [
    'Real User Monitoring (RUM)',
    'Latency measurement per region',
    'Dynamic routing updates',
    'Fallback to geo-proximity',
    'A/B testing support'
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
events = {}
items = {}
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Real User Monitoring (RUM)
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
    return events[event_id]

def latency_measurement_per_region(**kwargs) -> Dict:
    """
    FR-2: Latency measurement per region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Dynamic routing updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def fallback_to_geo_proximity(**kwargs) -> Dict:
    """
    FR-4: Fallback to geo-proximity
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def a_b_testing_support(**kwargs) -> Dict:
    """
    FR-5: A/B testing support
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Region Search Index
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionSearchProblemDefinition: ProblemDefinition = {
  id: 'multiregion-search',
  title: 'Multi-Region Search Index',
  description: `Design a globally distributed search system with regional indexes, cross-region replication, and unified search results.
- Regional search clusters
- Index replication
- Unified ranking
- Regional relevance tuning`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Regional search clusters',
    'Index replication',
    'Unified ranking',
    'Regional relevance tuning',
    'Real-time indexing'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 500k req/s globally',
    'Dataset Size: 10B documents',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for replicate search index globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Geo LB (lb) for replicate search index globally',
      },
      {
        type: 'message_queue',
        reason: 'Need Index Stream (stream) for replicate search index globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Geo LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to US Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to EU Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to AP Apps',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'US Apps routes to US ES',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'EU Apps routes to EU ES',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AP Apps routes to AP ES',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'US ES routes to Index Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Index Stream routes to EU ES',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Index Stream routes to AP ES',
      }
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

  scenarios: generateScenarios('multiregion-search', problemConfigs['multiregion-search'], [
    'Regional search clusters',
    'Index replication',
    'Unified ranking',
    'Regional relevance tuning',
    'Real-time indexing'
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
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Regional search clusters
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def index_replication(**kwargs) -> Dict:
    """
    FR-2: Index replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def unified_ranking(**kwargs) -> Dict:
    """
    FR-3: Unified ranking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def regional_relevance_tuning(**kwargs) -> Dict:
    """
    FR-4: Regional relevance tuning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_indexing(**kwargs) -> Dict:
    """
    FR-5: Real-time indexing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Cross-Region Analytics Aggregation
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionAnalyticsProblemDefinition: ProblemDefinition = {
  id: 'cross-region-analytics',
  title: 'Cross-Region Analytics Aggregation',
  description: `Design an analytics system that aggregates data from regional databases while respecting data residency laws.
- Region-specific raw data storage
- Anonymized cross-region aggregation
- Real-time dashboards
- Historical trend analysis`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Region-specific raw data storage',
    'Anonymized cross-region aggregation',
    'Real-time dashboards',
    'Historical trend analysis',
    'Export for data science'
  ],
  userFacingNFRs: [
    'Latency: Dashboard < 2s, Batch < 1hr',
    'Request Rate: 1M events/s write, 10k queries/s',
    'Dataset Size: 1PB historical',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Events (redirect_client) for aggregate metrics from all regions',
      },
      {
        type: 'message_queue',
        reason: 'Need US Stream (stream) for aggregate metrics from all regions',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for aggregate metrics from all regions',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Warehouse (object_store) for aggregate metrics from all regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Events routes to US Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Events routes to EU Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Events routes to AP Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'US Stream routes to Anonymizers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'EU Stream routes to Anonymizers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'AP Stream routes to Anonymizers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Anonymizers routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Anonymizers routes to S3 Warehouse',
      }
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

  scenarios: generateScenarios('cross-region-analytics', problemConfigs['cross-region-analytics'], [
    'Region-specific raw data storage',
    'Anonymized cross-region aggregation',
    'Real-time dashboards',
    'Historical trend analysis',
    'Export for data science'
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

def region_specific_raw_data_storage(**kwargs) -> Dict:
    """
    FR-1: Region-specific raw data storage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def anonymized_cross_region_aggregation(**kwargs) -> Dict:
    """
    FR-2: Anonymized cross-region aggregation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_dashboards(**kwargs) -> Dict:
    """
    FR-3: Real-time dashboards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def historical_trend_analysis(**kwargs) -> Dict:
    """
    FR-4: Historical trend analysis
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def export_for_data_science(**kwargs) -> Dict:
    """
    FR-5: Export for data science
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Region Cache with Invalidation
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionCacheProblemDefinition: ProblemDefinition = {
  id: 'multiregion-cache',
  title: 'Multi-Region Cache with Invalidation',
  description: `Design a multi-region caching system with cache invalidation propagation and eventual consistency guarantees.
- Regional cache clusters
- Invalidation propagation
- Lazy replication
- TTL-based expiry`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Regional cache clusters',
    'Invalidation propagation',
    'Lazy replication',
    'TTL-based expiry',
    'Cache warming'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms local, < 500ms invalidation propagation',
    'Request Rate: 5M req/s',
    'Dataset Size: 100M cache entries',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for synchronize cache invalidations globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for synchronize cache invalidations globally',
      },
      {
        type: 'cache',
        reason: 'Need US Cache (cache) for synchronize cache invalidations globally',
      },
      {
        type: 'message_queue',
        reason: 'Need Invalidation Bus (stream) for synchronize cache invalidations globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to US',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to EU',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AP',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AP routes to AP Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'US Cache routes to Invalidation Bus',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'EU Cache routes to Invalidation Bus',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'AP Cache routes to Invalidation Bus',
      }
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

  scenarios: generateScenarios('multiregion-cache', problemConfigs['multiregion-cache'], [
    'Regional cache clusters',
    'Invalidation propagation',
    'Lazy replication',
    'TTL-based expiry',
    'Cache warming'
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
cache = {}
item = {}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-1: Regional cache clusters
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-1: Regional cache clusters
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def invalidation_propagation(**kwargs) -> Dict:
    """
    FR-2: Invalidation propagation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def lazy_replication(**kwargs) -> Dict:
    """
    FR-3: Lazy replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ttl_based_expiry(**kwargs) -> Dict:
    """
    FR-4: TTL-based expiry
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-5: Cache warming
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-5: Cache warming
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None`,
};

/**
 * Video Content Delivery Network
 * From extracted-problems/system-design/multiregion.md
 */
export const globalContentDeliveryProblemDefinition: ProblemDefinition = {
  id: 'global-content-delivery',
  title: 'Video Content Delivery Network',
  description: `Design a Netflix/YouTube-scale global CDN delivering 500M concurrent 4K/8K streams across 190+ countries. Must start playback in <100ms, maintain <0.5% buffering, handle viral events (5B views/hour), survive entire CDN region failures, and operate within $2B/month budget. Support adaptive bitrate, offline downloads, live streaming for 100M viewers, and serve 1 exabit/day while maintaining ISP partnerships and peering agreements.
- Stream to 500M concurrent viewers globally
- Support 4K/8K/HDR with adaptive bitrate
- Live streaming for 100M concurrent viewers
- Start playback in <100ms globally`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Stream to 500M concurrent viewers globally',
    'Support 4K/8K/HDR with adaptive bitrate',
    'Live streaming for 100M concurrent viewers',
    'Start playback in <100ms globally',
    'Offline downloads for 100M+ devices',
    'Multi-CDN strategy with ISP partnerships',
    'DRM for 10k+ content providers',
    'Serve 1 exabit/day of video traffic'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms to start, P99.9 < 200ms',
    'Request Rate: 500M concurrent streams, 5B during viral events',
    'Dataset Size: 10PB catalog, 1EB total cache capacity',
    'Availability: 99.999% for popular content, 99.99% overall'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Viewers (redirect_client) for netflix-scale 500m concurrent streams globally',
      },
      {
        type: 'cdn',
        reason: 'Need Edge POPs (cdn) for netflix-scale 500m concurrent streams globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Origin LB (lb) for netflix-scale 500m concurrent streams globally',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Video (object_store) for netflix-scale 500m concurrent streams globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Viewers routes to Edge POPs',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Edge POPs routes to Origin LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Origin LB routes to Origin Shield',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Origin Shield routes to S3 Video',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 Video routes to Transcoders',
      }
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

  scenarios: generateScenarios('global-content-delivery', problemConfigs['global-content-delivery'], [
    'Stream to 500M concurrent viewers globally',
    'Support 4K/8K/HDR with adaptive bitrate',
    'Live streaming for 100M concurrent viewers',
    'Start playback in <100ms globally',
    'Offline downloads for 100M+ devices',
    'Multi-CDN strategy with ISP partnerships',
    'DRM for 10k+ content providers',
    'Serve 1 exabit/day of video traffic'
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
cache = {}
posts = {}
item = {}
items = {}

def stream_to_500m_concurrent_viewers_global(**kwargs) -> Dict:
    """
    FR-1: Stream to 500M concurrent viewers globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_4k_8k_hdr_with_adaptive_bitrate(**kwargs) -> Dict:
    """
    FR-2: Support 4K/8K/HDR with adaptive bitrate
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def live_streaming_for_100m_concurrent_viewe(**kwargs) -> Dict:
    """
    FR-3: Live streaming for 100M concurrent viewers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def start_playback_in_100ms_globally(**kwargs) -> Dict:
    """
    FR-4: Start playback in <100ms globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def offline_downloads_for_100m_devices(**kwargs) -> Dict:
    """
    FR-5: Offline downloads for 100M+ devices
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-6: Multi-CDN strategy with ISP partnerships
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-6: Multi-CDN strategy with ISP partnerships
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def drm_for_10k_content_providers(**kwargs) -> Dict:
    """
    FR-7: DRM for 10k+ content providers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-8: Serve 1 exabit/day of video traffic
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * Edge Computing with Serverless Functions
 * From extracted-problems/system-design/multiregion.md
 */
export const edgeComputingProblemDefinition: ProblemDefinition = {
  id: 'edge-computing',
  title: 'Edge Computing with Serverless Functions',
  description: `Design an edge computing platform running serverless functions at 100+ global edge locations for sub-50ms latency.
- Deploy functions globally
- Request routing to nearest edge
- Edge-to-origin communication
- Edge state management`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Deploy functions globally',
    'Request routing to nearest edge',
    'Edge-to-origin communication',
    'Edge state management',
    'A/B testing at edge'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms',
    'Request Rate: 50M req/s globally',
    'Dataset Size: 10k functions, 100+ edge locations',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for run code at the edge globally',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Network (cdn) for run code at the edge globally',
      },
      {
        type: 'cache',
        reason: 'Need Edge KV (cache) for run code at the edge globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Users routes to Edge Network',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Network routes to Edge Functions',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Functions routes to Edge KV',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Functions routes to Origin',
      }
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

  scenarios: generateScenarios('edge-computing', problemConfigs['edge-computing'], [
    'Deploy functions globally',
    'Request routing to nearest edge',
    'Edge-to-origin communication',
    'Edge state management',
    'A/B testing at edge'
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
cache = {}
item = {}

def deploy_functions_globally(**kwargs) -> Dict:
    """
    FR-1: Deploy functions globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-2: Request routing to nearest edge
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-2: Request routing to nearest edge
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-3: Edge-to-origin communication
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-3: Edge-to-origin communication
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-4: Edge state management
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-4: Edge state management
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-5: A/B testing at edge
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-5: A/B testing at edge
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None`,
};

/**
 * Multi-Region Message Queue
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionQueueProblemDefinition: ProblemDefinition = {
  id: 'multiregion-queue',
  title: 'Multi-Region Message Queue',
  description: `Design a multi-region message queue with cross-region replication, exactly-once delivery, and automatic failover.
- Cross-region queue replication
- Exactly-once delivery
- Message ordering per partition
- Dead letter queues`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Cross-region queue replication',
    'Exactly-once delivery',
    'Message ordering per partition',
    'Dead letter queues',
    'Regional consumers'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms local, < 500ms cross-region',
    'Request Rate: 500k msg/s',
    'Dataset Size: 1B messages/day',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Producers (redirect_client) for replicate queues across regions',
      },
      {
        type: 'message_queue',
        reason: 'Need US Queue (queue) for replicate queues across regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers routes to US Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers routes to EU Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers routes to AP Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'US Queue routes to Replication',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'EU Queue routes to Replication',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'AP Queue routes to Replication',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replication routes to Consumers',
      }
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

  scenarios: generateScenarios('multiregion-queue', problemConfigs['multiregion-queue'], [
    'Cross-region queue replication',
    'Exactly-once delivery',
    'Message ordering per partition',
    'Dead letter queues',
    'Regional consumers'
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

def cross_region_queue_replication(**kwargs) -> Dict:
    """
    FR-1: Cross-region queue replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def exactly_once_delivery(**kwargs) -> Dict:
    """
    FR-2: Exactly-once delivery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def message_ordering_per_partition(**kwargs) -> Dict:
    """
    FR-3: Message ordering per partition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def dead_letter_queues(**kwargs) -> Dict:
    """
    FR-4: Dead letter queues
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def regional_consumers(**kwargs) -> Dict:
    """
    FR-5: Regional consumers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Regional Sharding Strategy
 * From extracted-problems/system-design/multiregion.md
 */
export const regionalShardingProblemDefinition: ProblemDefinition = {
  id: 'regional-sharding',
  title: 'Regional Sharding Strategy',
  description: `Design a sharding strategy that partitions data by region to optimize for local access while supporting cross-region queries.
- Shard by user region
- Local writes, cross-region reads
- Shard rebalancing
- Cross-shard transactions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Shard by user region',
    'Local writes, cross-region reads',
    'Shard rebalancing',
    'Cross-shard transactions',
    'Consistent hashing'
  ],
  userFacingNFRs: [
    'Latency: P95 < 80ms local, < 300ms cross-region',
    'Request Rate: 800k req/s',
    'Dataset Size: 500M users, 5 regions',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for shard by geography for locality',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for shard by geography for locality',
      },
      {
        type: 'storage',
        reason: 'Need US Shard (db_primary) for shard by geography for locality',
      },
      {
        type: 'cache',
        reason: 'Need Shard Map (cache) for shard by geography for locality',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Shard Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shard Router routes to US Shard',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shard Router routes to EU Shard',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shard Router routes to AP Shard',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shard Router routes to Shard Map',
      }
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

  scenarios: generateScenarios('regional-sharding', problemConfigs['regional-sharding'], [
    'Shard by user region',
    'Local writes, cross-region reads',
    'Shard rebalancing',
    'Cross-shard transactions',
    'Consistent hashing'
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
memory = {}

def shard_by_user_region(**kwargs) -> Dict:
    """
    FR-1: Shard by user region
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Local writes, cross-region reads
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def shard_rebalancing(**kwargs) -> Dict:
    """
    FR-3: Shard rebalancing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_shard_transactions(**kwargs) -> Dict:
    """
    FR-4: Cross-shard transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def consistent_hashing(**kwargs) -> Dict:
    """
    FR-5: Consistent hashing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Cross-Region Observability Platform
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionObservabilityProblemDefinition: ProblemDefinition = {
  id: 'cross-region-observability',
  title: 'Cross-Region Observability Platform',
  description: `Design an observability platform aggregating metrics, logs, and traces from all regions into a unified dashboard.
- Metrics aggregation
- Distributed tracing
- Log aggregation
- Cross-region correlation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Metrics aggregation',
    'Distributed tracing',
    'Log aggregation',
    'Cross-region correlation',
    'Alerting'
  ],
  userFacingNFRs: [
    'Latency: Ingestion < 10s, Query < 5s',
    'Request Rate: 10M events/s',
    'Dataset Size: 1PB/month',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'message_queue',
        reason: 'Need US Stream (stream) for unified metrics, logs, traces globally',
      },
      {
        type: 'compute',
        reason: 'Need Aggregators (worker) for unified metrics, logs, traces globally',
      },
      {
        type: 'storage',
        reason: 'Need Time-series DB (db_primary) for unified metrics, logs, traces globally',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Archive (object_store) for unified metrics, logs, traces globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'US Stream routes to Aggregators',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'EU Stream routes to Aggregators',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'AP Stream routes to Aggregators',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregators routes to Time-series DB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Aggregators routes to S3 Archive',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query API routes to Time-series DB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Query API routes to S3 Archive',
      }
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

  scenarios: generateScenarios('cross-region-observability', problemConfigs['cross-region-observability'], [
    'Metrics aggregation',
    'Distributed tracing',
    'Log aggregation',
    'Cross-region correlation',
    'Alerting'
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
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Metrics aggregation
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
    return events[event_id]

def distributed_tracing(**kwargs) -> Dict:
    """
    FR-2: Distributed tracing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def log_aggregation(**kwargs) -> Dict:
    """
    FR-3: Log aggregation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_region_correlation(**kwargs) -> Dict:
    """
    FR-4: Cross-region correlation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def alerting(**kwargs) -> Dict:
    """
    FR-5: Alerting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Regional Quota & Billing System
 * From extracted-problems/system-design/multiregion.md
 */
export const regionalQuotaEnforcementProblemDefinition: ProblemDefinition = {
  id: 'regional-quota-enforcement',
  title: 'Regional Quota & Billing System',
  description: `Design a system to track resource usage across regions for accurate billing and quota enforcement.
- Per-region usage tracking
- Global quota aggregation
- Real-time quota checks
- Monthly billing rollup`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Per-region usage tracking',
    'Global quota aggregation',
    'Real-time quota checks',
    'Monthly billing rollup',
    'Usage exports'
  ],
  userFacingNFRs: [
    'Latency: Quota check < 10ms',
    'Request Rate: 5M ops/s',
    'Dataset Size: 1M customers, 5 regions',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API (redirect_client) for track usage per region for billing',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for track usage per region for billing',
      },
      {
        type: 'cache',
        reason: 'Need Counters (cache) for track usage per region for billing',
      },
      {
        type: 'message_queue',
        reason: 'Need Usage Events (stream) for track usage per region for billing',
      },
      {
        type: 'storage',
        reason: 'Need Billing DB (db_primary) for track usage per region for billing',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Apps',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Counters',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Usage Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Usage Events routes to Aggregator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregator routes to Billing DB',
      }
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

  scenarios: generateScenarios('regional-quota-enforcement', problemConfigs['regional-quota-enforcement'], [
    'Per-region usage tracking',
    'Global quota aggregation',
    'Real-time quota checks',
    'Monthly billing rollup',
    'Usage exports'
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
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Per-region usage tracking
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
    return events[event_id]

def global_quota_aggregation(**kwargs) -> Dict:
    """
    FR-2: Global quota aggregation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_quota_checks(**kwargs) -> Dict:
    """
    FR-3: Real-time quota checks
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def monthly_billing_rollup(**kwargs) -> Dict:
    """
    FR-4: Monthly billing rollup
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def usage_exports(**kwargs) -> Dict:
    """
    FR-5: Usage exports
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Cross-Region Secrets Management
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionSecretsProblemDefinition: ProblemDefinition = {
  id: 'cross-region-secrets',
  title: 'Cross-Region Secrets Management',
  description: `Design a secrets management system that replicates encrypted secrets across regions while maintaining strong security.
- Encrypted storage
- Cross-region replication
- Secret rotation
- Access control (IAM)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Encrypted storage',
    'Cross-region replication',
    'Secret rotation',
    'Access control (IAM)',
    'Audit logging'
  ],
  userFacingNFRs: [
    'Latency: Retrieval < 100ms',
    'Request Rate: 100k req/s',
    'Dataset Size: 1M secrets',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Apps (app) for sync secrets globally securely',
      },
      {
        type: 'cache',
        reason: 'Need Secret Cache (cache) for sync secrets globally securely',
      },
      {
        type: 'storage',
        reason: 'Need Vault (db_primary) for sync secrets globally securely',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (stream) for sync secrets globally securely',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cache',
        reason: 'Apps routes to Secret Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Secret Cache routes to Vault',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Vault routes to KMS',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Audit Log',
      }
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

  scenarios: generateScenarios('cross-region-secrets', problemConfigs['cross-region-secrets'], [
    'Encrypted storage',
    'Cross-region replication',
    'Secret rotation',
    'Access control (IAM)',
    'Audit logging'
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

def encrypted_storage(**kwargs) -> Dict:
    """
    FR-1: Encrypted storage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_region_replication(**kwargs) -> Dict:
    """
    FR-2: Cross-region replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def secret_rotation(**kwargs) -> Dict:
    """
    FR-3: Secret rotation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def access_control_iam(**kwargs) -> Dict:
    """
    FR-4: Access control (IAM)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def audit_logging(**kwargs) -> Dict:
    """
    FR-5: Audit logging
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Google Spanner Clone
 * From extracted-problems/system-design/multiregion.md
 */
export const planetScaleDatabaseProblemDefinition: ProblemDefinition = {
  id: 'planet-scale-database',
  title: 'Google Spanner Clone',
  description: `Design a globally distributed SQL database with strong consistency like Google Spanner. Implement TrueTime, multi-version concurrency control, and global transactions.
- Support global ACID transactions
- Implement external consistency
- Use synchronized clocks (TrueTime)
- Handle automatic sharding`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support global ACID transactions',
    'Implement external consistency',
    'Use synchronized clocks (TrueTime)',
    'Handle automatic sharding',
    'Support SQL with joins',
    'Enable point-in-time recovery',
    'Provide 5 nines availability',
    'Scale to thousands of nodes'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms local reads, < 100ms global writes',
    'Request Rate: 10M ops/sec globally',
    'Dataset Size: 100PB across all regions',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Apps (redirect_client) for globally consistent database',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Routers (cdn) for globally consistent database',
      },
      {
        type: 'load_balancer',
        reason: 'Need Regional LBs (lb) for globally consistent database',
      },
      {
        type: 'storage',
        reason: 'Need Paxos Leaders (db_primary) for globally consistent database',
      },
      {
        type: 'cache',
        reason: 'Need Location Cache (cache) for globally consistent database',
      },
      {
        type: 'message_queue',
        reason: 'Need Commit Log (stream) for globally consistent database',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Apps routes to Edge Routers',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Edge Routers routes to Regional LBs',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Regional LBs routes to Span Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Span Servers routes to Paxos Leaders',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Span Servers routes to Paxos Replicas',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Span Servers routes to TrueTime',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Span Servers routes to Location Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Paxos Leaders routes to Commit Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Paxos Replicas routes to Commit Log',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Commit Log routes to Schema Queue',
      }
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

  scenarios: generateScenarios('planet-scale-database', problemConfigs['planet-scale-database'], [
    'Support global ACID transactions',
    'Implement external consistency',
    'Use synchronized clocks (TrueTime)',
    'Handle automatic sharding',
    'Support SQL with joins',
    'Enable point-in-time recovery',
    'Provide 5 nines availability',
    'Scale to thousands of nodes'
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

def support_global_acid_transactions(**kwargs) -> Dict:
    """
    FR-1: Support global ACID transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_external_consistency(**kwargs) -> Dict:
    """
    FR-2: Implement external consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def use_synchronized_clocks_truetime(**kwargs) -> Dict:
    """
    FR-3: Use synchronized clocks (TrueTime)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_automatic_sharding(**kwargs) -> Dict:
    """
    FR-4: Handle automatic sharding
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_sql_with_joins(**kwargs) -> Dict:
    """
    FR-5: Support SQL with joins
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_point_in_time_recovery(**kwargs) -> Dict:
    """
    FR-6: Enable point-in-time recovery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_5_nines_availability(**kwargs) -> Dict:
    """
    FR-7: Provide 5 nines availability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def scale_to_thousands_of_nodes(**kwargs) -> Dict:
    """
    FR-8: Scale to thousands of nodes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Master Conflict Resolution
 * From extracted-problems/system-design/multiregion.md
 */
export const conflictResolutionProblemDefinition: ProblemDefinition = {
  id: 'conflict-resolution',
  title: 'Multi-Master Conflict Resolution',
  description: `Design a Google Spanner-scale conflict resolution system handling 10M writes/sec across 100+ regions with active-active replication. Must resolve conflicts in <100ms using TrueTime/HLC, handle network partitions lasting hours, survive multiple datacenter failures, and operate within $200M/month budget. Support CRDTs, vector clocks, custom merge strategies, and maintain strong consistency for financial transactions while serving global banks and payment processors.
- Process 10M concurrent writes/sec globally
- Active-active replication across 100+ regions
- TrueTime/HLC for global ordering
- Support CRDTs for automatic resolution`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 10M concurrent writes/sec globally',
    'Active-active replication across 100+ regions',
    'TrueTime/HLC for global ordering',
    'Support CRDTs for automatic resolution',
    'Custom merge strategies for business logic',
    'Detect conflicts within 10ms',
    'Track lineage for 1B+ objects',
    'Support financial ACID requirements'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms conflict detection, < 200ms resolution',
    'Request Rate: 10M writes/sec, 100M during Black Friday',
    'Dataset Size: 100B objects, 1PB conflict logs',
    'Availability: 99.999% with automatic failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Writers (redirect_client) for google spanner-scale 10m writes/sec globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for google spanner-scale 10m writes/sec globally',
      },
      {
        type: 'storage',
        reason: 'Need US DB (db_primary) for google spanner-scale 10m writes/sec globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Writers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to US Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to EU Apps',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AP Apps',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'US Apps routes to US DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EU Apps routes to EU DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'AP Apps routes to AP DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'US DB routes to EU DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'EU DB routes to AP DB',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'AP DB routes to US DB',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'US DB routes to Conflict Resolver',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'EU DB routes to Conflict Resolver',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'AP DB routes to Conflict Resolver',
      }
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

  scenarios: generateScenarios('conflict-resolution', problemConfigs['conflict-resolution'], [
    'Process 10M concurrent writes/sec globally',
    'Active-active replication across 100+ regions',
    'TrueTime/HLC for global ordering',
    'Support CRDTs for automatic resolution',
    'Custom merge strategies for business logic',
    'Detect conflicts within 10ms',
    'Track lineage for 1B+ objects',
    'Support financial ACID requirements'
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
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Process 10M concurrent writes/sec globally
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def active_active_replication_across_100_re(**kwargs) -> Dict:
    """
    FR-2: Active-active replication across 100+ regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def truetime_hlc_for_global_ordering(**kwargs) -> Dict:
    """
    FR-3: TrueTime/HLC for global ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_crdts_for_automatic_resolution(**kwargs) -> Dict:
    """
    FR-4: Support CRDTs for automatic resolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def custom_merge_strategies_for_business_log(**kwargs) -> Dict:
    """
    FR-5: Custom merge strategies for business logic
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def detect_conflicts_within_10ms(**kwargs) -> Dict:
    """
    FR-6: Detect conflicts within 10ms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-7: Track lineage for 1B+ objects
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
    return events[event_id]

def support_financial_acid_requirements(**kwargs) -> Dict:
    """
    FR-8: Support financial ACID requirements
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global Rate Limiting System
 * From extracted-problems/system-design/multiregion.md
 */
export const globalRateLimitingProblemDefinition: ProblemDefinition = {
  id: 'global-rate-limiting',
  title: 'Global Rate Limiting System',
  description: `Design a Google Cloud-scale global rate limiting system processing 100M requests/sec across 50+ regions with <1ms decision latency. Must enforce limits for 100M+ API keys, handle DDoS attacks (10B req/sec), survive region failures, and operate within $150M/month budget. Support hierarchical quotas, sliding windows, distributed counters with eventual consistency, and protect against 100Gbps+ attack traffic while serving global enterprises.
- Process 100M rate limit decisions/sec globally
- Track quotas for 100M+ API keys/users
- Hierarchical limits (user/org/global)
- Sliding window and token bucket algorithms`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 100M rate limit decisions/sec globally',
    'Track quotas for 100M+ API keys/users',
    'Hierarchical limits (user/org/global)',
    'Sliding window and token bucket algorithms',
    'Distributed counter sync with <100ms lag',
    'DDoS protection at 10B req/sec scale',
    'Graceful degradation during attacks',
    'Real-time quota adjustment and overrides'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1ms decision time, P99.9 < 5ms',
    'Request Rate: 100M req/s normal, 10B during DDoS attacks',
    'Dataset Size: 100M API keys, 1B rate limit rules',
    'Availability: 99.999% for rate limiting decisions'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Clients (redirect_client) for google-scale 100m qps distributed rate limiting',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for google-scale 100m qps distributed rate limiting',
      },
      {
        type: 'cache',
        reason: 'Need US Redis (cache) for google-scale 100m qps distributed rate limiting',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Clients routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to US',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to EU',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AP',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US routes to US Redis',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU routes to EU Redis',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'AP routes to AP Redis',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'US Redis routes to Gossip Sync',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'EU Redis routes to Gossip Sync',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'AP Redis routes to Gossip Sync',
      }
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

  scenarios: generateScenarios('global-rate-limiting', problemConfigs['global-rate-limiting'], [
    'Process 100M rate limit decisions/sec globally',
    'Track quotas for 100M+ API keys/users',
    'Hierarchical limits (user/org/global)',
    'Sliding window and token bucket algorithms',
    'Distributed counter sync with <100ms lag',
    'DDoS protection at 10B req/sec scale',
    'Graceful degradation during attacks',
    'Real-time quota adjustment and overrides'
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
users = {}
memory = {}

def process_100m_rate_limit_decisions_sec_gl(**kwargs) -> Dict:
    """
    FR-1: Process 100M rate limit decisions/sec globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Track quotas for 100M+ API keys/users
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
    return events[event_id]

def hierarchical_limits_user_org_global(**kwargs) -> Dict:
    """
    FR-3: Hierarchical limits (user/org/global)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def sliding_window_and_token_bucket_algorith(**kwargs) -> Dict:
    """
    FR-4: Sliding window and token bucket algorithms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Distributed counter sync with <100ms lag
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
    return events[event_id]

def ddos_protection_at_10b_req_sec_scale(**kwargs) -> Dict:
    """
    FR-6: DDoS protection at 10B req/sec scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def graceful_degradation_during_attacks(**kwargs) -> Dict:
    """
    FR-7: Graceful degradation during attacks
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_quota_adjustment_and_overrides(**kwargs) -> Dict:
    """
    FR-8: Real-time quota adjustment and overrides
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Read-Your-Writes Consistency Globally
 * From extracted-problems/system-design/multiregion.md
 */
export const readYourWritesProblemDefinition: ProblemDefinition = {
  id: 'read-your-writes',
  title: 'Read-Your-Writes Consistency Globally',
  description: `Design a system that guarantees users always see their own writes even when reading from a different region.
- Session-based write tracking
- Version vectors
- Stale read detection
- Automatic fallback to primary`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Session-based write tracking',
    'Version vectors',
    'Stale read detection',
    'Automatic fallback to primary',
    'Bounded staleness'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms, P99 < 300ms',
    'Request Rate: 1M req/s',
    'Dataset Size: 100M users',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for users see their own writes immediately',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for users see their own writes immediately',
      },
      {
        type: 'cache',
        reason: 'Need Version Cache (cache) for users see their own writes immediately',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for users see their own writes immediately',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Apps',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Apps routes to Version Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Apps routes to Primary DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Read Replicas',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'Primary DB routes to Read Replicas',
      }
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

  scenarios: generateScenarios('read-your-writes', problemConfigs['read-your-writes'], [
    'Session-based write tracking',
    'Version vectors',
    'Stale read detection',
    'Automatic fallback to primary',
    'Bounded staleness'
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
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Session-based write tracking
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def version_vectors(**kwargs) -> Dict:
    """
    FR-2: Version vectors
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-3: Stale read detection
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def automatic_fallback_to_primary(**kwargs) -> Dict:
    """
    FR-4: Automatic fallback to primary
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def bounded_staleness(**kwargs) -> Dict:
    """
    FR-5: Bounded staleness
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Regional Compliance & Data Sovereignty
 * From extracted-problems/system-design/multiregion.md
 */
export const regionalComplianceProblemDefinition: ProblemDefinition = {
  id: 'regional-compliance',
  title: 'Regional Compliance & Data Sovereignty',
  description: `Design a multi-tenant system where each tenant can specify their data residency requirements and compliance needs.
- Per-tenant region preference
- Data residency enforcement
- Compliance audit logs
- Cross-tenant isolation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Per-tenant region preference',
    'Data residency enforcement',
    'Compliance audit logs',
    'Cross-tenant isolation',
    'Regional billing'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 300k req/s',
    'Dataset Size: 10k tenants, 1B records',
    'Availability: 99.95% uptime per region'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Tenants (redirect_client) for multi-tenant with per-tenant regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need Tenant Router (lb) for multi-tenant with per-tenant regions',
      },
      {
        type: 'storage',
        reason: 'Need US DB (db_primary) for multi-tenant with per-tenant regions',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (stream) for multi-tenant with per-tenant regions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tenants routes to Tenant Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tenant Router routes to US Apps',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tenant Router routes to EU Apps',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tenant Router routes to AP Apps',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'US Apps routes to US DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EU Apps routes to EU DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'AP Apps routes to AP DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'US Apps routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'EU Apps routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AP Apps routes to Audit Log',
      }
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

  scenarios: generateScenarios('regional-compliance', problemConfigs['regional-compliance'], [
    'Per-tenant region preference',
    'Data residency enforcement',
    'Compliance audit logs',
    'Cross-tenant isolation',
    'Regional billing'
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

def per_tenant_region_preference(**kwargs) -> Dict:
    """
    FR-1: Per-tenant region preference
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def data_residency_enforcement(**kwargs) -> Dict:
    """
    FR-2: Data residency enforcement
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def compliance_audit_logs(**kwargs) -> Dict:
    """
    FR-3: Compliance audit logs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_tenant_isolation(**kwargs) -> Dict:
    """
    FR-4: Cross-tenant isolation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def regional_billing(**kwargs) -> Dict:
    """
    FR-5: Regional billing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Zero-Downtime Cross-Region Migration
 * From extracted-problems/system-design/multiregion.md
 */
export const crossRegionMigrationProblemDefinition: ProblemDefinition = {
  id: 'cross-region-migration',
  title: 'Zero-Downtime Cross-Region Migration',
  description: `Design a system to migrate millions of users from one region to another with zero downtime and no data loss.
- Dual-write during migration
- Gradual traffic shift
- Data consistency verification
- Rollback capability`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Dual-write during migration',
    'Gradual traffic shift',
    'Data consistency verification',
    'Rollback capability',
    'Migration progress tracking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms during migration',
    'Request Rate: 500k req/s',
    'Dataset Size: 10M users, 100TB data',
    'Availability: 99.99% during migration'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for migrate users to new region without downtime',
      },
      {
        type: 'load_balancer',
        reason: 'Need Migration LB (lb) for migrate users to new region without downtime',
      },
      {
        type: 'storage',
        reason: 'Need Source DB (db_primary) for migrate users to new region without downtime',
      },
      {
        type: 'message_queue',
        reason: 'Need CDC Stream (stream) for migrate users to new region without downtime',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Migration LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Migration LB routes to Old Region',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Migration LB routes to New Region',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Old Region routes to Source DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'New Region routes to Target DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Source DB routes to CDC Stream',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'CDC Stream routes to Target DB',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'Source DB routes to Verifier',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'Target DB routes to Verifier',
      }
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

  scenarios: generateScenarios('cross-region-migration', problemConfigs['cross-region-migration'], [
    'Dual-write during migration',
    'Gradual traffic shift',
    'Data consistency verification',
    'Rollback capability',
    'Migration progress tracking'
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
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Dual-write during migration
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def gradual_traffic_shift(**kwargs) -> Dict:
    """
    FR-2: Gradual traffic shift
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def data_consistency_verification(**kwargs) -> Dict:
    """
    FR-3: Data consistency verification
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rollback_capability(**kwargs) -> Dict:
    """
    FR-4: Rollback capability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Migration progress tracking
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
 * Global Time Synchronization (TrueTime-like)
 * From extracted-problems/system-design/multiregion.md
 */
export const timeSynchronizationProblemDefinition: ProblemDefinition = {
  id: 'time-synchronization',
  title: 'Global Time Synchronization (TrueTime-like)',
  description: `Design a time synchronization system providing bounded clock uncertainty for distributed transactions like Google's TrueTime.
- Atomic clock references
- GPS synchronization
- Uncertainty bounds
- Commit wait protocol`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Atomic clock references',
    'GPS synchronization',
    'Uncertainty bounds',
    'Commit wait protocol',
    'Clock drift monitoring'
  ],
  userFacingNFRs: [
    'Latency: Uncertainty < 7ms',
    'Request Rate: 10M timestamps/s',
    'Dataset Size: 100+ datacenters',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Apps (app) for synchronized clocks across regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to US Time Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to EU/AP Time Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Atomic Masters routes to US Time Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Atomic Masters routes to EU/AP Time Servers',
      }
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

  scenarios: generateScenarios('time-synchronization', problemConfigs['time-synchronization'], [
    'Atomic clock references',
    'GPS synchronization',
    'Uncertainty bounds',
    'Commit wait protocol',
    'Clock drift monitoring'
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

def atomic_clock_references(**kwargs) -> Dict:
    """
    FR-1: Atomic clock references
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def gps_synchronization(**kwargs) -> Dict:
    """
    FR-2: GPS synchronization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def uncertainty_bounds(**kwargs) -> Dict:
    """
    FR-3: Uncertainty bounds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def commit_wait_protocol(**kwargs) -> Dict:
    """
    FR-4: Commit wait protocol
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Clock drift monitoring
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
 * Global Leader Election with Consensus
 * From extracted-problems/system-design/multiregion.md
 */
export const globalLeaderElectionProblemDefinition: ProblemDefinition = {
  id: 'global-leader-election',
  title: 'Global Leader Election with Consensus',
  description: `Design a global leader election system using distributed consensus (Paxos/Raft) to coordinate across regions.
- Leader election via consensus
- Automatic failover on leader failure
- Split-brain prevention
- Lease-based leadership`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Leader election via consensus',
    'Automatic failover on leader failure',
    'Split-brain prevention',
    'Lease-based leadership',
    'Observer nodes for reads'
  ],
  userFacingNFRs: [
    'Latency: Election < 10s, Lease renewal < 100ms',
    'Request Rate: 100k operations/s',
    'Dataset Size: 5 regions, 15 nodes',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Apps (app) for elect single leader across regions',
      },
      {
        type: 'storage',
        reason: 'Need Leader State (db_primary) for elect single leader across regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Consensus-US',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Consensus-EU',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Apps routes to Consensus-AP',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Consensus-US routes to Leader State',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Consensus-EU routes to Leader State',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Consensus-AP routes to Leader State',
      }
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

  scenarios: generateScenarios('global-leader-election', problemConfigs['global-leader-election'], [
    'Leader election via consensus',
    'Automatic failover on leader failure',
    'Split-brain prevention',
    'Lease-based leadership',
    'Observer nodes for reads'
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

def leader_election_via_consensus(**kwargs) -> Dict:
    """
    FR-1: Leader election via consensus
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_failover_on_leader_failure(**kwargs) -> Dict:
    """
    FR-2: Automatic failover on leader failure
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def split_brain_prevention(**kwargs) -> Dict:
    """
    FR-3: Split-brain prevention
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def lease_based_leadership(**kwargs) -> Dict:
    """
    FR-4: Lease-based leadership
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Observer nodes for reads
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
};

/**
 * CRDTs for Conflict-Free Replication
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionCrdtProblemDefinition: ProblemDefinition = {
  id: 'multiregion-crdt',
  title: 'CRDTs for Conflict-Free Replication',
  description: `Design a system using Conflict-free Replicated Data Types (CRDTs) for automatic conflict resolution without coordination.
- CRDT counters
- CRDT sets
- CRDT maps
- Operation-based or state-based`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'CRDT counters',
    'CRDT sets',
    'CRDT maps',
    'Operation-based or state-based',
    'Garbage collection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms local, < 500ms convergence',
    'Request Rate: 500k ops/s',
    'Dataset Size: 100M objects',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for replicate state without coordination',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for replicate state without coordination',
      },
      {
        type: 'message_queue',
        reason: 'Need Op Stream (stream) for replicate state without coordination',
      },
      {
        type: 'storage',
        reason: 'Need State Store (db_primary) for replicate state without coordination',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to US CRDT',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to EU CRDT',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to AP CRDT',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'US CRDT routes to Op Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'EU CRDT routes to Op Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'AP CRDT routes to Op Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Op Stream routes to State Store',
      }
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

  scenarios: generateScenarios('multiregion-crdt', problemConfigs['multiregion-crdt'], [
    'CRDT counters',
    'CRDT sets',
    'CRDT maps',
    'Operation-based or state-based',
    'Garbage collection'
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: CRDT counters
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
    return events[event_id]

def crdt_sets(**kwargs) -> Dict:
    """
    FR-2: CRDT sets
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def crdt_maps(**kwargs) -> Dict:
    """
    FR-3: CRDT maps
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def operation_based_or_state_based(**kwargs) -> Dict:
    """
    FR-4: Operation-based or state-based
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def garbage_collection(**kwargs) -> Dict:
    """
    FR-5: Garbage collection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Region Container Orchestration
 * From extracted-problems/system-design/multiregion.md
 */
export const multiregionOrchestrationProblemDefinition: ProblemDefinition = {
  id: 'multiregion-orchestration',
  title: 'Multi-Region Container Orchestration',
  description: `Design a container orchestration system managing deployments across multiple regions with centralized control.
- Multi-cluster management
- Global service discovery
- Cross-region networking
- Health monitoring`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Multi-cluster management',
    'Global service discovery',
    'Cross-region networking',
    'Health monitoring',
    'Rolling updates'
  ],
  userFacingNFRs: [
    'Latency: Deploy < 5min globally',
    'Request Rate: 10k containers deployed/hr',
    'Dataset Size: 100k containers, 5 regions',
    'Availability: 99.9% control plane uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Control Plane (app) for deploy containers to multiple regions',
      },
      {
        type: 'load_balancer',
        reason: 'Need Federation LB (lb) for deploy containers to multiple regions',
      },
      {
        type: 'message_queue',
        reason: 'Need Deployment Events (stream) for deploy containers to multiple regions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Control Plane routes to Federation LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Federation LB routes to US Cluster',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Federation LB routes to EU Cluster',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Federation LB routes to AP Cluster',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'US Cluster routes to Deployment Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'EU Cluster routes to Deployment Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'AP Cluster routes to Deployment Events',
      }
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

  scenarios: generateScenarios('multiregion-orchestration', problemConfigs['multiregion-orchestration'], [
    'Multi-cluster management',
    'Global service discovery',
    'Cross-region networking',
    'Health monitoring',
    'Rolling updates'
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

def multi_cluster_management(**kwargs) -> Dict:
    """
    FR-1: Multi-cluster management
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def global_service_discovery(**kwargs) -> Dict:
    """
    FR-2: Global service discovery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_region_networking(**kwargs) -> Dict:
    """
    FR-3: Cross-region networking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-4: Health monitoring
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
    return events[event_id]

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Rolling updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
};

// Auto-generate code challenges from functional requirements
(basicMultiRegionProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicMultiRegionProblemDefinition);
