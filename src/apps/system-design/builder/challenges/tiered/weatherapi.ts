/**
 * Generated Tiered Challenge: Weather API - Weather Data Service
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const weatherapiChallenge: Challenge = {
  id: 'weatherapi',
  title: 'Weather API - Weather Data Service',
  difficulty: 'beginner',
  description: `Design a weather data API service that:
- Users can query current weather by location
- API provides forecasts for upcoming days
- Platform ingests data from weather stations
- Supports high-volume read traffic`,
  
  requirements: {
  functional: [
    "Users can query current weather by location",
    "Supports high-volume read traffic"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency"
},
  
  availableComponents: [
  "client",
  "load_balancer",
  "app_server",
  "database",
  "redis",
  "message_queue",
  "cdn",
  "s3"
],
  
  testCases: [
    {
      "name": "Users can query current weather by location",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can query current weather by location\" works correctly. Must have search index for efficient queries.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Supports high-volume read traffic",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Supports high-volume read traffic\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
      "traffic": {
        "type": "read",
        "rps": 100,
        "readRatio": 0.9
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 5000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 10000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 150,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 7500,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 15000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 100ms even during write bursts. Without CQRS: read latency spikes to 300ms+.",
      "traffic": {
        "type": "read",
        "rps": 5000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 4950 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 5 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 200ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 7500,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-R1: Database Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Primary database crashes at 30s into test. System must failover to replica to maintain\navailability. Without replication: complete outage. With replication: < 10s downtime.",
      "traffic": {
        "type": "read",
        "rps": 5000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxErrorRate": 0.1,
        "minAvailability": 0.95,
        "maxDowntime": 10
      },
      "failureInjection": {
        "type": "db_crash",
        "atSecond": 30,
        "recoverySecond": 90
      }
    },
    {
      "name": "NFR-R2: Cache Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Cache (Redis) fails at 20s. System must continue operating by hitting database directly.\nPerformance degrades but system stays up. Tests graceful degradation.",
      "traffic": {
        "type": "read",
        "rps": 5000,
        "readRatio": 0.99
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.05,
        "minAvailability": 0.95
      },
      "failureInjection": {
        "type": "cache_flush",
        "atSecond": 20
      }
    }
  ],
  
  learningObjectives: [
  "Understand client-server architecture",
  "Learn database connectivity and data persistence",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "OpenWeatherMap",
    "url": "https://openweathermap.org/"
  },
  {
    "label": "Weather API Documentation",
    "url": "https://openweathermap.org/api"
  }
],
  
  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
locations = {}
current_weather = {}
forecasts = {}
stations = {}

def query_weather(location_id: str) -> Optional[Dict]:
    """
    FR-1: Users can query current weather by location
    Naive implementation - returns cached weather data
    """
    weather = current_weather.get(location_id)
    if not weather:
        return None

    location = locations.get(location_id)
    return {
        'location': location,
        'temperature': weather['temperature'],
        'humidity': weather['humidity'],
        'wind_speed': weather['wind_speed'],
        'conditions': weather['conditions'],
        'updated_at': weather['updated_at']
    }

def get_forecast(location_id: str, days: int = 7) -> List[Dict]:
    """
    Helper: Get weather forecast for upcoming days
    Naive implementation - returns stored forecasts
    """
    location_forecasts = []
    for forecast in forecasts.values():
        if forecast['location_id'] == location_id:
            location_forecasts.append(forecast)

    # Sort by date
    location_forecasts.sort(key=lambda x: x['date'])
    return location_forecasts[:days]

def ingest_weather_data(location_id: str, temperature: float, humidity: int,
                        wind_speed: float, conditions: str, station_id: str = None) -> Dict:
    """
    Helper: Ingest data from weather stations
    Naive implementation - updates current weather
    """
    current_weather[location_id] = {
        'location_id': location_id,
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'conditions': conditions,
        'station_id': station_id,
        'updated_at': datetime.now()
    }

    # Update station last report time
    if station_id and station_id in stations:
        stations[station_id]['last_report'] = datetime.now()

    return current_weather[location_id]

def create_forecast(forecast_id: str, location_id: str, date: str,
                    high_temp: float, low_temp: float, conditions: str) -> Dict:
    """
    Helper: Create forecast entry
    Naive implementation - stores forecast
    """
    forecasts[forecast_id] = {
        'id': forecast_id,
        'location_id': location_id,
        'date': date,
        'high_temp': high_temp,
        'low_temp': low_temp,
        'conditions': conditions,
        'created_at': datetime.now()
    }
    return forecasts[forecast_id]

def handle_high_volume_request(location_id: str) -> Dict:
    """
    FR-2: Supports high-volume read traffic
    Naive implementation - same as query_weather, would use caching in production
    """
    return query_weather(location_id)
`,
  
  codeChallenges,
  
  solution: {
  components: [
    {
      type: "client",
      config: {}
    },
    {
      type: "load_balancer",
      config: {
        algorithm: "least_connections"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 30,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "30 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 76,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "76 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 512,
        strategy: "cache_aside",
        hitRatio: 0.9998,
        replication: "master-slave",
        persistence: "rdb"
      }
    },
    {
      type: "postgresql",
      config: {
        instanceType: "commodity-db",
        replicationMode: "multi-leader",
        replication: {
          enabled: true,
          replicas: 10,
          mode: "async"
        },
        sharding: {
          enabled: true,
          shards: 16,
          shardKey: "region_id"
        },
        displayName: "PostgreSQL Master",
        subtitle: "Writes + 10 replicas (reads)"
      }
    },
    {
      type: "cdn",
      config: {
        enabled: true,
        edgeLocations: 150,
        cachePolicy: "aggressive",
        ttl: 300
      }
    },
    {
      type: "s3",
      config: {}
    },
    {
      type: "message_queue",
      config: {}
    }
  ],
  connections: [
    {
      from: "client",
      to: "load_balancer",
      type: "read_write"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "read",
      label: "Read traffic (GET)"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "write",
      label: "Write traffic (POST/PUT/DELETE)"
    },
    {
      from: "load_balancer",
      to: "redis",
      type: "read",
      label: "Direct cache access (L6)"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read",
      label: "Cache miss fallback"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "read",
      label: "Read API → Replicas"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "write",
      label: "Write API → Master"
    },
    {
      from: "redis",
      to: "postgresql",
      type: "read",
      label: "Cache miss → DB lookup"
    },
    {
      from: "client",
      to: "cdn",
      type: "read"
    },
    {
      from: "cdn",
      to: "s3",
      type: "read"
    },
    {
      from: "app_server",
      to: "s3",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "message_queue",
      type: "write"
    }
  ],
  explanation: "Reference Solution for Weather API - Weather Data Service (Geospatial + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 18 instances handling 14850 read RPS (GET requests)\n- **Write API**: 1 instance handling 150 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **512GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~13365 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 16 shards (sharded by region_id).\n  • Read Capacity: 14850 RPS across 11 database instance(s)\n  • Write Capacity: 150 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 99.0%, Write: 1.0%, Total: 15000 RPS)\n- **Read API (18 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 1.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 16 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
