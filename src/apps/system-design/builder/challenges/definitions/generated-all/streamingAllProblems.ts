import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Streaming Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 37 problems
 */

/**
 * WhatsApp/Slack Real‑Time Chat
 * From extracted-problems/system-design/streaming.md
 */
export const chatProblemDefinition: ProblemDefinition = {
  id: 'chat',
  title: 'WhatsApp/Slack Real‑Time Chat',
  description: `Build a chat service that supports many rooms with predictable p95 delivery latency. Use a presence cache for online/offline state, a durable store for message history, and (optionally) a stream for fan‑out. Consider ordering per conversation key, backpressure during spikes, and idempotency on retries.
- Send text messages between users in real-time
- Create group chats with up to 100 participants
- Show online/offline/typing presence indicators
- Persist message history (last 30 days minimum)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Send text messages between users in real-time',
    'Create group chats with up to 100 participants',
    'Show online/offline/typing presence indicators',
    'Persist message history (last 30 days minimum)',
    'Support message delivery receipts (sent/delivered/read)',
    'Enable message search within conversations',
    'Share files/images up to 25MB',
    'Support message reactions/emojis',
    '@mention notifications in group chats',
    'End-to-end encryption for private messages'
  ],
  userFacingNFRs: [
    'Latency: Message delivery: P95 < 100ms, P99 < 200ms, P999 < 500ms. Message history fetch: P95 < 200ms. Presence updates: P95 < 50ms',
    'Request Rate: 100k messages/sec sustained. 1M concurrent WebSocket connections. 500k presence updates/sec. Peak traffic during business hours 3x normal (300k msg/sec)',
    'Dataset Size: 1B messages/day stored. Average message 500 bytes. Total storage ~500GB/day, 180TB/year. 100M active users. P99 group chat size: 100 members',
    'Availability: 99.95% uptime (4.38 hours downtime/year). Message delivery must work during partial outages (graceful degradation). Read-your-writes consistency for sender',
    'Durability: All messages must be persistent and reconstructable. Zero message loss is critical for user trust and legal compliance. Message retention: 90 days for free tier, unlimited for premium. Real-time backups with RPO < 1 minute'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Client (redirect_client) for low‑latency messaging with presence',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for low‑latency messaging with presence',
      },
      {
        type: 'cache',
        reason: 'Need Presence Cache (cache) for low‑latency messaging with presence',
      },
      {
        type: 'storage',
        reason: 'Need Message Store (db_primary) for low‑latency messaging with presence',
      },
      {
        type: 'message_queue',
        reason: 'Need Fanout Stream (stream) for low‑latency messaging with presence',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Client routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Chat Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Chat Service routes to Presence Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Chat Service routes to Message Store',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Chat Service routes to Fanout Stream',
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

  scenarios: generateScenarios('chat', problemConfigs['chat'], [
    'Send text messages between users in real-time',
    'Create group chats with up to 100 participants',
    'Show online/offline/typing presence indicators',
    'Persist message history (last 30 days minimum)',
    'Support message delivery receipts (sent/delivered/read)',
    'Enable message search within conversations',
    'Share files/images up to 25MB',
    'Support message reactions/emojis',
    '@mention notifications in group chats',
    'End-to-end encryption for private messages'
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
reactions = {}
users = {}
group = {}
items = {}
memory = {}
real = {}
results = {}

def send_text_messages_between_users_in_real(**kwargs) -> Dict:
    """
    FR-1: Send text messages between users in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Create group chats with up to 100 participants
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def show_online_offline_typing_presence_indi(**kwargs) -> Dict:
    """
    FR-3: Show online/offline/typing presence indicators
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def persist_message_history_last_30_days_mi(**kwargs) -> Dict:
    """
    FR-4: Persist message history (last 30 days minimum)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-5: Support message delivery receipts (sent/delivered/read)
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-6: Enable message search within conversations
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def share_files_images_up_to_25mb(**kwargs) -> Dict:
    """
    FR-7: Share files/images up to 25MB
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def add_reaction(item_id: str, user_id: str, reaction_type: str = 'like') -> Dict:
    """
    FR-8: Support message reactions/emojis
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

def mention_notifications_in_group_chats(**kwargs) -> Dict:
    """
    FR-9: @mention notifications in group chats
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def end_to_end_encryption_for_private_messag(**kwargs) -> Dict:
    """
    FR-10: End-to-end encryption for private messages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Segment/Kafka Event Ingestion
 * From extracted-problems/system-design/streaming.md
 */
export const ingestionProblemDefinition: ProblemDefinition = {
  id: 'ingestion',
  title: 'Segment/Kafka Event Ingestion',
  description: `Create a resilient ingestion pipeline. Producers write to a partitioned stream and consumers process events without exceeding lag SLAs. Size partitions and consumer groups appropriately, plan for bursts and drain time, and decide where to land data (DB or object storage). Address ordering by key and at‑least‑once vs exactly‑once delivery.
- Expose a public ingestion endpoint that accepts JSON event payloads from web, mobile, and server SDKs.
- Partition incoming events by workspace/customer key to preserve ordering guarantees.
- Buffer events in a Kafka/Kinesis topic with configurable retention and replay capabilities.
- Deliver events from the stream to downstream consumers/ETL workers for real-time feature generation.`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Expose a public ingestion endpoint that accepts JSON event payloads from web, mobile, and server SDKs.',
    'Partition incoming events by workspace/customer key to preserve ordering guarantees.',
    'Buffer events in a Kafka/Kinesis topic with configurable retention and replay capabilities.',
    'Deliver events from the stream to downstream consumers/ETL workers for real-time feature generation.',
    'Persist processed events to an analytics datastore and archive raw payloads to durable object storage.'
  ],
  userFacingNFRs: [
    'Request Rate: Sustain 10k events/sec steady state with 2× bursts (20k events/sec) for five minutes.',
    'Availability: 99.9% uptime for ingestion API and streaming pipeline.',
    'Durability: Retain events for 24h in-stream with triple replication and archive raw events for 30 days in object storage.'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need SDK Clients (redirect_client) for kafka/kinesis partitions, consumer groups, lag/drain',
      },
      {
        type: 'message_queue',
        reason: 'Need Stream (stream) for kafka/kinesis partitions, consumer groups, lag/drain',
      },
      {
        type: 'storage',
        reason: 'Need Landing DB (db_primary) for kafka/kinesis partitions, consumer groups, lag/drain',
      },
      {
        type: 'object_storage',
        reason: 'Need Archive (object_store) for kafka/kinesis partitions, consumer groups, lag/drain',
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
        reason: 'SDK Clients routes to Producers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers routes to Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Stream routes to Consumers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Consumers routes to Landing DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Consumers routes to Archive',
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

  scenarios: generateScenarios('ingestion', problemConfigs['ingestion'], [
    'Expose a public ingestion endpoint that accepts JSON event payloads from web, mobile, and server SDKs.',
    'Partition incoming events by workspace/customer key to preserve ordering guarantees.',
    'Buffer events in a Kafka/Kinesis topic with configurable retention and replay capabilities.',
    'Deliver events from the stream to downstream consumers/ETL workers for real-time feature generation.',
    'Persist processed events to an analytics datastore and archive raw payloads to durable object storage.'
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
a = {}
items = {}
memory = {}

def get_item(item_id: str) -> Dict:
    """
    FR-1: Expose a public ingestion endpoint that accepts JSON event payloads from web, mobile, and server SDKs.
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def get_item(item_id: str) -> Dict:
    """
    FR-2: Partition incoming events by workspace/customer key to preserve ordering guarantees.
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def buffer_events_in_a_kafka_kinesis_topic_w(**kwargs) -> Dict:
    """
    FR-3: Buffer events in a Kafka/Kinesis topic with configurable retention and replay capabilities.
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def deliver_events_from_the_stream_to_downst(**kwargs) -> Dict:
    """
    FR-4: Deliver events from the stream to downstream consumers/ETL workers for real-time feature generation.
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Persist processed events to an analytics datastore and archive raw payloads to durable object storage.
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
 * Basic Message Queue
 * From extracted-problems/system-design/streaming.md
 */
export const basicMessageQueueProblemDefinition: ProblemDefinition = {
  id: 'basic-message-queue',
  title: 'Basic Message Queue',
  description: `Learn message queue fundamentals with a simple publisher-subscriber system. Understand message acknowledgment, durability, and basic queue patterns for decoupling services.
- Publish messages to queues
- Subscribe multiple consumers
- Handle message acknowledgments
- Implement retry on failure`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Publish messages to queues',
    'Subscribe multiple consumers',
    'Handle message acknowledgments',
    'Implement retry on failure',
    'Support message persistence'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms end-to-end',
    'Request Rate: 5k messages/sec',
    'Dataset Size: 1M messages in queue',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Producers (redirect_client) for learn pub/sub with rabbitmq',
      },
      {
        type: 'message_queue',
        reason: 'Need RabbitMQ (queue) for learn pub/sub with rabbitmq',
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
        reason: 'Producers routes to Publisher API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Publisher API routes to RabbitMQ',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'RabbitMQ routes to Consumer A',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'RabbitMQ routes to Consumer B',
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

  scenarios: generateScenarios('basic-message-queue', problemConfigs['basic-message-queue'], [
    'Publish messages to queues',
    'Subscribe multiple consumers',
    'Handle message acknowledgments',
    'Implement retry on failure',
    'Support message persistence'
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
relationships = {}
memory = {}

def publish_messages_to_queues(**kwargs) -> Dict:
    """
    FR-1: Publish messages to queues
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-2: Subscribe multiple consumers
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def handle_message_acknowledgments(**kwargs) -> Dict:
    """
    FR-3: Handle message acknowledgments
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_retry_on_failure(**kwargs) -> Dict:
    """
    FR-4: Implement retry on failure
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_message_persistence(**kwargs) -> Dict:
    """
    FR-5: Support message persistence
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Real-time Push Notifications
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeNotificationsProblemDefinition: ProblemDefinition = {
  id: 'realtime-notifications',
  title: 'Real-time Push Notifications',
  description: `Build a real-time notification system using WebSockets. Learn about connection management, fan-out patterns, and handling millions of persistent connections.
- Maintain WebSocket connections
- Push notifications instantly
- Handle connection drops/reconnects
- Support topic subscriptions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Maintain WebSocket connections',
    'Push notifications instantly',
    'Handle connection drops/reconnects',
    'Support topic subscriptions',
    'Batch notifications for efficiency'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms delivery time',
    'Request Rate: 100k notifications/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Connected Users (redirect_client) for websocket delivery for live updates',
      },
      {
        type: 'load_balancer',
        reason: 'Need Sticky LB (lb) for websocket delivery for live updates',
      },
      {
        type: 'cache',
        reason: 'Need Redis Pub/Sub (stream) for websocket delivery for live updates',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Connected Users routes to Sticky LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Sticky LB routes to WebSocket Server',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'WebSocket Server routes to Redis Pub/Sub',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'WebSocket Server routes to Connection Registry',
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

  scenarios: generateScenarios('realtime-notifications', problemConfigs['realtime-notifications'], [
    'Maintain WebSocket connections',
    'Push notifications instantly',
    'Handle connection drops/reconnects',
    'Support topic subscriptions',
    'Batch notifications for efficiency'
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

def maintain_websocket_connections(**kwargs) -> Dict:
    """
    FR-1: Maintain WebSocket connections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def push_notifications_instantly(**kwargs) -> Dict:
    """
    FR-2: Push notifications instantly
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_connection_drops_reconnects(**kwargs) -> Dict:
    """
    FR-3: Handle connection drops/reconnects
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_topic_subscriptions(**kwargs) -> Dict:
    """
    FR-4: Support topic subscriptions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def batch_notifications_for_efficiency(**kwargs) -> Dict:
    """
    FR-5: Batch notifications for efficiency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Basic Event Log Streaming
 * From extracted-problems/system-design/streaming.md
 */
export const basicEventLogProblemDefinition: ProblemDefinition = {
  id: 'basic-event-log',
  title: 'Basic Event Log Streaming',
  description: `Create a basic event log streaming system that collects application events from multiple services. Learn about log aggregation, structured logging, and basic analytics.
- Collect events from multiple sources
- Parse structured log formats
- Store events for querying
- Support real-time monitoring`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Collect events from multiple sources',
    'Parse structured log formats',
    'Store events for querying',
    'Support real-time monitoring',
    'Enable basic filtering and search'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms for log ingestion',
    'Request Rate: 50k events/sec',
    'Dataset Size: 500GB daily logs',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Services (redirect_client) for stream application events',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Stream (stream) for stream application events',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for stream application events',
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
        reason: 'App Services routes to Log Collector',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Log Collector routes to Kafka Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka Stream routes to Log Processor',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Log Processor routes to Elasticsearch',
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

  scenarios: generateScenarios('basic-event-log', problemConfigs['basic-event-log'], [
    'Collect events from multiple sources',
    'Parse structured log formats',
    'Store events for querying',
    'Support real-time monitoring',
    'Enable basic filtering and search'
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
results = {}

def collect_events_from_multiple_sources(**kwargs) -> Dict:
    """
    FR-1: Collect events from multiple sources
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def parse_structured_log_formats(**kwargs) -> Dict:
    """
    FR-2: Parse structured log formats
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Store events for querying
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-4: Support real-time monitoring
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

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-5: Enable basic filtering and search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]`,
};

/**
 * Simple Pub/Sub Notification
 * From extracted-problems/system-design/streaming.md
 */
export const simplePubsubProblemDefinition: ProblemDefinition = {
  id: 'simple-pubsub',
  title: 'Simple Pub/Sub Notification',
  description: `Implement a topic-based pub/sub system using Redis or RabbitMQ. Learn about topic filtering, fanout patterns, and subscription management.
- Publish messages to topics
- Subscribe to multiple topics
- Filter by topic patterns
- Support wildcard subscriptions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Publish messages to topics',
    'Subscribe to multiple topics',
    'Filter by topic patterns',
    'Support wildcard subscriptions',
    'Handle subscriber backpressure'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms delivery',
    'Request Rate: 10k messages/sec',
    'Dataset Size: 1M active subscriptions',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Publishers (redirect_client) for topic-based message routing',
      },
      {
        type: 'cache',
        reason: 'Need Redis Pub/Sub (stream) for topic-based message routing',
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
        reason: 'Publishers routes to Pub API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Pub API routes to Redis Pub/Sub',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Redis Pub/Sub routes to Subscribers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Pub API routes to Subscription Cache',
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

  scenarios: generateScenarios('simple-pubsub', problemConfigs['simple-pubsub'], [
    'Publish messages to topics',
    'Subscribe to multiple topics',
    'Filter by topic patterns',
    'Support wildcard subscriptions',
    'Handle subscriber backpressure'
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
relationships = {}
memory = {}

def publish_messages_to_topics(**kwargs) -> Dict:
    """
    FR-1: Publish messages to topics
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-2: Subscribe to multiple topics
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def filter_by_topic_patterns(**kwargs) -> Dict:
    """
    FR-3: Filter by topic patterns
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_wildcard_subscriptions(**kwargs) -> Dict:
    """
    FR-4: Support wildcard subscriptions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-5: Handle subscriber backpressure
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]`,
};

/**
 * Real-time Chat Messages
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeChatMessagesProblemDefinition: ProblemDefinition = {
  id: 'realtime-chat-messages',
  title: 'Real-time Chat Messages',
  description: `Design a real-time chat messaging system with channels and direct messages. Learn about message ordering, online presence, and message persistence.
- Send messages in real-time
- Support channels and DMs
- Show online presence
- Persist message history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Send messages in real-time',
    'Support channels and DMs',
    'Show online presence',
    'Persist message history',
    'Handle message ordering'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms message delivery',
    'Request Rate: 20k messages/sec',
    'Dataset Size: 10M messages/day',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Chat Users (redirect_client) for instant messaging system',
      },
      {
        type: 'load_balancer',
        reason: 'Need WebSocket LB (lb) for instant messaging system',
      },
      {
        type: 'message_queue',
        reason: 'Need Message Bus (stream) for instant messaging system',
      },
      {
        type: 'cache',
        reason: 'Need Presence Cache (cache) for instant messaging system',
      },
      {
        type: 'storage',
        reason: 'Need Message DB (db_primary) for instant messaging system',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Chat Users routes to WebSocket LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'WebSocket LB routes to Chat Server',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Chat Server routes to Message Bus',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Chat Server routes to Presence Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Chat Server routes to Message DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Message Bus routes to Message DB',
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

  scenarios: generateScenarios('realtime-chat-messages', problemConfigs['realtime-chat-messages'], [
    'Send messages in real-time',
    'Support channels and DMs',
    'Show online presence',
    'Persist message history',
    'Handle message ordering'
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
real = {}

def send_messages_in_real_time(**kwargs) -> Dict:
    """
    FR-1: Send messages in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_channels_and_dms(**kwargs) -> Dict:
    """
    FR-2: Support channels and DMs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def show_online_presence(**kwargs) -> Dict:
    """
    FR-3: Show online presence
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def persist_message_history(**kwargs) -> Dict:
    """
    FR-4: Persist message history
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_message_ordering(**kwargs) -> Dict:
    """
    FR-5: Handle message ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Click Stream Analytics
 * From extracted-problems/system-design/streaming.md
 */
export const clickstreamAnalyticsProblemDefinition: ProblemDefinition = {
  id: 'clickstream-analytics',
  title: 'Click Stream Analytics',
  description: `Create a clickstream analytics pipeline to track user interactions. Learn about event collection, sessionization, and real-time analytics.
- Collect click events from web/mobile
- Track page views and interactions
- Sessionize user activity
- Generate real-time metrics`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Collect click events from web/mobile',
    'Track page views and interactions',
    'Sessionize user activity',
    'Generate real-time metrics',
    'Support custom event properties'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms for ingestion',
    'Request Rate: 100k events/sec',
    'Dataset Size: 10B events/day',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web/Mobile (redirect_client) for track user clicks and behavior',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Collectors (cdn) for track user clicks and behavior',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for track user clicks and behavior',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for track user clicks and behavior',
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
        reason: 'Web/Mobile routes to Edge Collectors',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Collectors routes to Ingest API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ingest API routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Sessionizer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Sessionizer routes to Analytics DB',
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

  scenarios: generateScenarios('clickstream-analytics', problemConfigs['clickstream-analytics'], [
    'Collect click events from web/mobile',
    'Track page views and interactions',
    'Sessionize user activity',
    'Generate real-time metrics',
    'Support custom event properties'
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

def collect_click_events_from_web_mobile(**kwargs) -> Dict:
    """
    FR-1: Collect click events from web/mobile
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Track page views and interactions
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

def sessionize_user_activity(**kwargs) -> Dict:
    """
    FR-3: Sessionize user activity
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-4: Generate real-time metrics
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

def support_custom_event_properties(**kwargs) -> Dict:
    """
    FR-5: Support custom event properties
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Server Log Aggregation
 * From extracted-problems/system-design/streaming.md
 */
export const serverLogAggregationProblemDefinition: ProblemDefinition = {
  id: 'server-log-aggregation',
  title: 'Server Log Aggregation',
  description: `Aggregate logs from thousands of servers into a central system. Learn about log shipping, parsing, indexing, and monitoring.
- Ship logs from many servers
- Parse different log formats
- Index for fast searching
- Alert on error patterns`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ship logs from many servers',
    'Parse different log formats',
    'Index for fast searching',
    'Alert on error patterns',
    'Visualize with dashboards'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5s from log to search',
    'Request Rate: 200k log lines/sec',
    'Dataset Size: 5TB logs/day',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Servers (redirect_client) for centralize server logs',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Buffer (stream) for centralize server logs',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for centralize server logs',
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
        reason: 'App Servers routes to Filebeat',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Filebeat routes to Kafka Buffer',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka Buffer routes to Logstash',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Logstash routes to Elasticsearch',
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

  scenarios: generateScenarios('server-log-aggregation', problemConfigs['server-log-aggregation'], [
    'Ship logs from many servers',
    'Parse different log formats',
    'Index for fast searching',
    'Alert on error patterns',
    'Visualize with dashboards'
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

def get_item(item_id: str) -> Dict:
    """
    FR-1: Ship logs from many servers
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def parse_different_log_formats(**kwargs) -> Dict:
    """
    FR-2: Parse different log formats
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Index for fast searching
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def alert_on_error_patterns(**kwargs) -> Dict:
    """
    FR-4: Alert on error patterns
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def visualize_with_dashboards(**kwargs) -> Dict:
    """
    FR-5: Visualize with dashboards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Sensor Data Collection
 * From extracted-problems/system-design/streaming.md
 */
export const sensorDataCollectionProblemDefinition: ProblemDefinition = {
  id: 'sensor-data-collection',
  title: 'Sensor Data Collection',
  description: `Build an IoT data collection pipeline for sensor telemetry. Learn about time-series data, downsampling, and handling device connectivity.
- Ingest from millions of sensors
- Handle intermittent connectivity
- Store time-series data efficiently
- Support data aggregation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest from millions of sensors',
    'Handle intermittent connectivity',
    'Store time-series data efficiently',
    'Support data aggregation',
    'Alert on anomalies'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s for critical sensors',
    'Request Rate: 500k readings/sec',
    'Dataset Size: 100TB time-series data',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Sensors (redirect_client) for iot sensor telemetry',
      },
      {
        type: 'load_balancer',
        reason: 'Need MQTT Gateway (lb) for iot sensor telemetry',
      },
      {
        type: 'message_queue',
        reason: 'Need Telemetry Stream (stream) for iot sensor telemetry',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for iot sensor telemetry',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Sensors routes to MQTT Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'MQTT Gateway routes to Ingest Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ingest Service routes to Telemetry Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Downsampler',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Downsampler routes to TimescaleDB',
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

  scenarios: generateScenarios('sensor-data-collection', problemConfigs['sensor-data-collection'], [
    'Ingest from millions of sensors',
    'Handle intermittent connectivity',
    'Store time-series data efficiently',
    'Support data aggregation',
    'Alert on anomalies'
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

def ingest_from_millions_of_sensors(**kwargs) -> Dict:
    """
    FR-1: Ingest from millions of sensors
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_intermittent_connectivity(**kwargs) -> Dict:
    """
    FR-2: Handle intermittent connectivity
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Store time-series data efficiently
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_data_aggregation(**kwargs) -> Dict:
    """
    FR-4: Support data aggregation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def alert_on_anomalies(**kwargs) -> Dict:
    """
    FR-5: Alert on anomalies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Email Queue System
 * From extracted-problems/system-design/streaming.md
 */
export const emailQueueSystemProblemDefinition: ProblemDefinition = {
  id: 'email-queue-system',
  title: 'Email Queue System',
  description: `Design an email delivery queue system for transactional and marketing emails. Learn about rate limiting, retries, and bounce handling.
- Queue emails for delivery
- Rate limit per domain
- Retry failed deliveries
- Handle bounces and complaints`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Queue emails for delivery',
    'Rate limit per domain',
    'Retry failed deliveries',
    'Handle bounces and complaints',
    'Track delivery status'
  ],
  userFacingNFRs: [
    'Latency: P95 < 30s for transactional',
    'Request Rate: 10k emails/sec',
    'Dataset Size: 100M emails/day',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for asynchronous email delivery',
      },
      {
        type: 'message_queue',
        reason: 'Need Priority Queue (queue) for asynchronous email delivery',
      },
      {
        type: 'storage',
        reason: 'Need Status DB (db_primary) for asynchronous email delivery',
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
        reason: 'Applications routes to Email API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Email API routes to Priority Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Email API routes to Bulk Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Priority Queue routes to Sender Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Bulk Queue routes to Sender Workers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Sender Workers routes to Status DB',
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

  scenarios: generateScenarios('email-queue-system', problemConfigs['email-queue-system'], [
    'Queue emails for delivery',
    'Rate limit per domain',
    'Retry failed deliveries',
    'Handle bounces and complaints',
    'Track delivery status'
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
posts = {}
memory = {}

def queue_emails_for_delivery(**kwargs) -> Dict:
    """
    FR-1: Queue emails for delivery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rate_limit_per_domain(**kwargs) -> Dict:
    """
    FR-2: Rate limit per domain
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def retry_failed_deliveries(**kwargs) -> Dict:
    """
    FR-3: Retry failed deliveries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_bounces_and_complaints(**kwargs) -> Dict:
    """
    FR-4: Handle bounces and complaints
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Track delivery status
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
 * Event Sourcing Basics
 * From extracted-problems/system-design/streaming.md
 */
export const eventSourcingBasicProblemDefinition: ProblemDefinition = {
  id: 'event-sourcing-basic',
  title: 'Event Sourcing Basics',
  description: `Learn event sourcing by building an order management system that stores events instead of current state. Understand event replay, projections, and CQRS basics.
- Store all state changes as events
- Rebuild state from event log
- Create read projections
- Support event replay`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store all state changes as events',
    'Rebuild state from event log',
    'Create read projections',
    'Support event replay',
    'Handle out-of-order events'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for reads',
    'Request Rate: 10k events/sec',
    'Dataset Size: 100M events',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Order Service (redirect_client) for store events instead of state',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (stream) for store events instead of state',
      },
      {
        type: 'storage',
        reason: 'Need Event Store (db_primary) for store events instead of state',
      },
      {
        type: 'cache',
        reason: 'Need Read Models (cache) for store events instead of state',
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
        reason: 'Order Service routes to Command API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Command API routes to Event Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event Log routes to Event Store',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event Log routes to Projection Builder',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Projection Builder routes to Read Models',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Command API routes to Read Models',
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

  scenarios: generateScenarios('event-sourcing-basic', problemConfigs['event-sourcing-basic'], [
    'Store all state changes as events',
    'Rebuild state from event log',
    'Create read projections',
    'Support event replay',
    'Handle out-of-order events'
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
    FR-1: Store all state changes as events
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def rebuild_state_from_event_log(**kwargs) -> Dict:
    """
    FR-2: Rebuild state from event log
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Create read projections
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_event_replay(**kwargs) -> Dict:
    """
    FR-4: Support event replay
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_out_of_order_events(**kwargs) -> Dict:
    """
    FR-5: Handle out-of-order events
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Order Processing Stream
 * From extracted-problems/system-design/streaming.md
 */
export const orderProcessingStreamProblemDefinition: ProblemDefinition = {
  id: 'order-processing-stream',
  title: 'Order Processing Stream',
  description: `Design an Amazon-scale order processing system handling 100M orders/day (1B during Prime Day). Must coordinate inventory across 500+ fulfillment centers, process payments with <500ms latency, survive payment provider failures, and maintain perfect order accuracy. Support distributed sagas, real-time fraud detection, same-day delivery orchestration, and operate within $100M/month budget.
- Process 100M orders/day (1B during Prime Day)
- Coordinate inventory across 500+ fulfillment centers
- Distributed saga pattern for multi-step transactions
- Real-time fraud detection on all orders`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 100M orders/day (1B during Prime Day)',
    'Coordinate inventory across 500+ fulfillment centers',
    'Distributed saga pattern for multi-step transactions',
    'Real-time fraud detection on all orders',
    'Same-day delivery orchestration for 50M+ orders',
    'Handle 10M concurrent shopping carts',
    'Support 100+ payment methods globally',
    'Automatic rollback and compensation for failures'
  ],
  userFacingNFRs: [
    'Latency: P99 < 500ms order confirmation, P99.9 < 1s',
    'Request Rate: 1.2M orders/sec during Prime Day',
    'Dataset Size: 10B historical orders, 1B products',
    'Availability: 99.999% uptime, zero duplicate orders'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Customers (redirect_client) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'message_queue',
        reason: 'Need Order Events (stream) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'storage',
        reason: 'Need Order DB (db_primary) for amazon-scale 100m orders/day processing',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Customers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Order API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order API routes to Order Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Inventory',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Payment',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Fulfillment',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Inventory routes to Order DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Payment routes to Order DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Fulfillment routes to Order DB',
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

  scenarios: generateScenarios('order-processing-stream', problemConfigs['order-processing-stream'], [
    'Process 100M orders/day (1B during Prime Day)',
    'Coordinate inventory across 500+ fulfillment centers',
    'Distributed saga pattern for multi-step transactions',
    'Real-time fraud detection on all orders',
    'Same-day delivery orchestration for 50M+ orders',
    'Handle 10M concurrent shopping carts',
    'Support 100+ payment methods globally',
    'Automatic rollback and compensation for failures'
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

def process_100m_orders_day_1b_during_prime(**kwargs) -> Dict:
    """
    FR-1: Process 100M orders/day (1B during Prime Day)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def coordinate_inventory_across_500_fulfill(**kwargs) -> Dict:
    """
    FR-2: Coordinate inventory across 500+ fulfillment centers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def distributed_saga_pattern_for_multi_step(**kwargs) -> Dict:
    """
    FR-3: Distributed saga pattern for multi-step transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_fraud_detection_on_all_orders(**kwargs) -> Dict:
    """
    FR-4: Real-time fraud detection on all orders
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def same_day_delivery_orchestration_for_50m(**kwargs) -> Dict:
    """
    FR-5: Same-day delivery orchestration for 50M+ orders
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_10m_concurrent_shopping_carts(**kwargs) -> Dict:
    """
    FR-6: Handle 10M concurrent shopping carts
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_100_payment_methods_globally(**kwargs) -> Dict:
    """
    FR-7: Support 100+ payment methods globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_rollback_and_compensation_for(**kwargs) -> Dict:
    """
    FR-8: Automatic rollback and compensation for failures
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Payment Transaction Log
 * From extracted-problems/system-design/streaming.md
 */
export const paymentTransactionLogProblemDefinition: ProblemDefinition = {
  id: 'payment-transaction-log',
  title: 'Payment Transaction Log',
  description: `Design a Visa/Mastercard-scale payment system processing 50B transactions/day globally with <10ms P99 latency. Must handle Black Friday spikes (500B transactions), maintain perfect financial accuracy, survive entire continent failures, and meet PCI-DSS compliance. Support real-time settlement across 10k+ banks, fraud detection on every transaction, and operate within $200M/month budget while ensuring zero financial loss.
- Process 50B transactions/day (500B during Black Friday)
- Real-time settlement with 10k+ banks globally
- Immutable audit trail with 10-year retention
- Real-time fraud detection with <10ms latency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 50B transactions/day (500B during Black Friday)',
    'Real-time settlement with 10k+ banks globally',
    'Immutable audit trail with 10-year retention',
    'Real-time fraud detection with <10ms latency',
    'Support 200+ currencies with real-time FX',
    'Distributed ledger with perfect consistency',
    'Handle chargebacks and dispute resolution',
    'Comply with GDPR, PCI-DSS, SOC2, ISO27001'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms authorization, P99.9 < 25ms',
    'Request Rate: 580k transactions/sec normal, 5.8M during spikes',
    'Dataset Size: 10PB daily logs, 100PB historical, 10-year retention',
    'Availability: 99.9999% uptime (31 seconds downtime/year)',
    'Durability: 11 nines durability, zero financial loss'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Payment Requests (redirect_client) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Log (stream) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'cache',
        reason: 'Need Transaction Cache (cache) for visa/mastercard-scale 50b transactions/day',
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
        reason: 'Payment Requests routes to Payment Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Payment Gateway routes to Transaction Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Log routes to Fraud Detector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Transaction Log routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Fraud Detector routes to Transaction Cache',
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

  scenarios: generateScenarios('payment-transaction-log', problemConfigs['payment-transaction-log'], [
    'Process 50B transactions/day (500B during Black Friday)',
    'Real-time settlement with 10k+ banks globally',
    'Immutable audit trail with 10-year retention',
    'Real-time fraud detection with <10ms latency',
    'Support 200+ currencies with real-time FX',
    'Distributed ledger with perfect consistency',
    'Handle chargebacks and dispute resolution',
    'Comply with GDPR, PCI-DSS, SOC2, ISO27001'
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

def process_50b_transactions_day_500b_durin(**kwargs) -> Dict:
    """
    FR-1: Process 50B transactions/day (500B during Black Friday)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_settlement_with_10k_banks_glo(**kwargs) -> Dict:
    """
    FR-2: Real-time settlement with 10k+ banks globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def immutable_audit_trail_with_10_year_reten(**kwargs) -> Dict:
    """
    FR-3: Immutable audit trail with 10-year retention
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_fraud_detection_with_10ms_lat(**kwargs) -> Dict:
    """
    FR-4: Real-time fraud detection with <10ms latency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_200_currencies_with_real_time_f(**kwargs) -> Dict:
    """
    FR-5: Support 200+ currencies with real-time FX
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-6: Distributed ledger with perfect consistency
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-6: Distributed ledger with perfect consistency
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def handle_chargebacks_and_dispute_resolutio(**kwargs) -> Dict:
    """
    FR-7: Handle chargebacks and dispute resolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def comply_with_gdpr_pci_dss_soc2_iso2700(**kwargs) -> Dict:
    """
    FR-8: Comply with GDPR, PCI-DSS, SOC2, ISO27001
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Stock Price Updates
 * From extracted-problems/system-design/streaming.md
 */
export const stockPriceUpdatesProblemDefinition: ProblemDefinition = {
  id: 'stock-price-updates',
  title: 'Stock Price Updates',
  description: `Stream real-time stock price updates to traders and systems. Learn about low-latency distribution, market data protocols, and fan-out patterns.
- Stream tick-by-tick price data
- Support thousands of symbols
- Enable subscription filtering
- Provide historical replay`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Stream tick-by-tick price data',
    'Support thousands of symbols',
    'Enable subscription filtering',
    'Provide historical replay',
    'Calculate technical indicators',
    'Handle market data gaps'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms for price updates',
    'Request Rate: 1M ticks/sec',
    'Dataset Size: 50TB daily market data',
    'Availability: 99.99% during market hours'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Exchanges (redirect_client) for real-time market data feed',
      },
      {
        type: 'message_queue',
        reason: 'Need Price Stream (stream) for real-time market data feed',
      },
      {
        type: 'cache',
        reason: 'Need Last Price Cache (cache) for real-time market data feed',
      },
      {
        type: 'storage',
        reason: 'Need Tick DB (db_primary) for real-time market data feed',
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
        reason: 'Exchanges routes to Feed Handler',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Feed Handler routes to Price Stream',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Price Stream routes to Last Price Cache',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Price Stream routes to WebSocket Servers',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Price Stream routes to Tick DB',
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

  scenarios: generateScenarios('stock-price-updates', problemConfigs['stock-price-updates'], [
    'Stream tick-by-tick price data',
    'Support thousands of symbols',
    'Enable subscription filtering',
    'Provide historical replay',
    'Calculate technical indicators',
    'Handle market data gaps'
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

def stream_tick_by_tick_price_data(**kwargs) -> Dict:
    """
    FR-1: Stream tick-by-tick price data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_thousands_of_symbols(**kwargs) -> Dict:
    """
    FR-2: Support thousands of symbols
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_subscription_filtering(**kwargs) -> Dict:
    """
    FR-3: Enable subscription filtering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_historical_replay(**kwargs) -> Dict:
    """
    FR-4: Provide historical replay
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def calculate_technical_indicators(**kwargs) -> Dict:
    """
    FR-5: Calculate technical indicators
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_market_data_gaps(**kwargs) -> Dict:
    """
    FR-6: Handle market data gaps
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Social Media Feed
 * From extracted-problems/system-design/streaming.md
 */
export const socialMediaFeedProblemDefinition: ProblemDefinition = {
  id: 'social-media-feed',
  title: 'Social Media Feed',
  description: `Generate personalized social media feeds with posts from followed users. Learn about fan-out patterns, feed ranking, and real-time updates.
- Aggregate posts from followees
- Rank by relevance and recency
- Support real-time updates
- Handle viral content efficiently`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Aggregate posts from followees',
    'Rank by relevance and recency',
    'Support real-time updates',
    'Handle viral content efficiently',
    'Personalize per user',
    'Cache popular content'
  ],
  userFacingNFRs: [
    'Latency: P95 < 300ms for feed generation',
    'Request Rate: 500k feed requests/sec',
    'Dataset Size: 1B users, 100M posts/day',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Users (redirect_client) for twitter/instagram feed generation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for twitter/instagram feed generation',
      },
      {
        type: 'cache',
        reason: 'Need Feed Cache (cache) for twitter/instagram feed generation',
      },
      {
        type: 'message_queue',
        reason: 'Need Post Stream (stream) for twitter/instagram feed generation',
      },
      {
        type: 'storage',
        reason: 'Need Social Graph (db_primary) for twitter/instagram feed generation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'App Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Feed API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feed API routes to Feed Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Feed API routes to Post Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Post Stream routes to Feed Builder',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feed Builder routes to Feed Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feed Builder routes to Social Graph',
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

  scenarios: generateScenarios('social-media-feed', problemConfigs['social-media-feed'], [
    'Aggregate posts from followees',
    'Rank by relevance and recency',
    'Support real-time updates',
    'Handle viral content efficiently',
    'Personalize per user',
    'Cache popular content'
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
relationships = {}
users = {}
item = {}
items = {}
memory = {}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-1: Aggregate posts from followees
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def rank_by_relevance_and_recency(**kwargs) -> Dict:
    """
    FR-2: Rank by relevance and recency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Support real-time updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def handle_viral_content_efficiently(**kwargs) -> Dict:
    """
    FR-4: Handle viral content efficiently
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def personalize_per_user(**kwargs) -> Dict:
    """
    FR-5: Personalize per user
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-6: Cache popular content
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-6: Cache popular content
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
 * Video Upload Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const videoUploadPipelineProblemDefinition: ProblemDefinition = {
  id: 'video-upload-pipeline',
  title: 'Video Upload Pipeline',
  description: `Design a YouTube-scale video processing pipeline handling 500k hours of uploads daily (2M during viral events). Must transcode to 20+ formats in <2 minutes for 4K videos, support live streaming to 100M viewers, survive datacenter failures, and operate within $50M/month budget. Include ML content moderation, automatic quality optimization, and copyright detection across 1B+ reference videos.
- Process 500k hours of video daily (2M during viral events)
- Transcode to 20+ formats in <2min for 4K videos
- Support 100M concurrent live stream viewers
- ML-based content moderation and copyright detection`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 500k hours of video daily (2M during viral events)',
    'Transcode to 20+ formats in <2min for 4K videos',
    'Support 100M concurrent live stream viewers',
    'ML-based content moderation and copyright detection',
    'Detect copyrighted content against 1B+ references',
    'Adaptive bitrate streaming based on network',
    'Generate AI highlights and auto-chapters',
    'Distributed transcoding across 10k+ GPU nodes'
  ],
  userFacingNFRs: [
    'Latency: P99 < 2min for 4K transcode, <10s live streaming delay',
    'Request Rate: 500k hours/day uploads, 100M concurrent streams',
    'Dataset Size: 100PB raw videos, 1EB with all formats',
    'Availability: 99.99% uptime, zero data loss guarantee'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Content Creators (redirect_client) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'cdn',
        reason: 'Need Upload CDN (cdn) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'message_queue',
        reason: 'Need Job Queue (queue) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'object_storage',
        reason: 'Need Object Storage (db_primary) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Content Creators routes to Upload CDN',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'Upload CDN routes to Upload API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Upload API routes to Job Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Job Queue routes to Transcoders',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Job Queue routes to Thumbnail Gen',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Transcoders routes to Object Storage',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Thumbnail Gen routes to Object Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transcoders routes to Completion Events',
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

  scenarios: generateScenarios('video-upload-pipeline', problemConfigs['video-upload-pipeline'], [
    'Process 500k hours of video daily (2M during viral events)',
    'Transcode to 20+ formats in <2min for 4K videos',
    'Support 100M concurrent live stream viewers',
    'ML-based content moderation and copyright detection',
    'Detect copyrighted content against 1B+ references',
    'Adaptive bitrate streaming based on network',
    'Generate AI highlights and auto-chapters',
    'Distributed transcoding across 10k+ GPU nodes'
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
posts = {}

def process_500k_hours_of_video_daily_2m_du(**kwargs) -> Dict:
    """
    FR-1: Process 500k hours of video daily (2M during viral events)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def transcode_to_20_formats_in_2min_for_4k(**kwargs) -> Dict:
    """
    FR-2: Transcode to 20+ formats in <2min for 4K videos
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_100m_concurrent_live_stream_view(**kwargs) -> Dict:
    """
    FR-3: Support 100M concurrent live stream viewers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ml_based_content_moderation_and_copyrigh(**kwargs) -> Dict:
    """
    FR-4: ML-based content moderation and copyright detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def detect_copyrighted_content_against_1b_r(**kwargs) -> Dict:
    """
    FR-5: Detect copyrighted content against 1B+ references
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def adaptive_bitrate_streaming_based_on_netw(**kwargs) -> Dict:
    """
    FR-6: Adaptive bitrate streaming based on network
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def generate_ai_highlights_and_auto_chapters(**kwargs) -> Dict:
    """
    FR-7: Generate AI highlights and auto-chapters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def distributed_transcoding_across_10k_gpu(**kwargs) -> Dict:
    """
    FR-8: Distributed transcoding across 10k+ GPU nodes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Fraud Detection Stream
 * From extracted-problems/system-design/streaming.md
 */
export const fraudDetectionStreamProblemDefinition: ProblemDefinition = {
  id: 'fraud-detection-stream',
  title: 'Fraud Detection Stream',
  description: `Design a PayPal/Stripe-scale fraud detection system processing 10M transactions/sec globally with <5ms P99 latency. Must handle Black Friday spikes (100M TPS), detect sophisticated fraud rings using graph analysis, survive entire region failures, and maintain <0.01% false positive rate. Support 1000+ ML models, real-time feature computation across 100B+ historical transactions, and operate within $5M/month budget.
- Process 10M transactions/sec (100M during Black Friday)
- Score with <5ms P99 latency using 1000+ ML models
- Graph analysis for fraud ring detection across 1B+ entities
- Real-time feature computation from 100B+ transaction history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 10M transactions/sec (100M during Black Friday)',
    'Score with <5ms P99 latency using 1000+ ML models',
    'Graph analysis for fraud ring detection across 1B+ entities',
    'Real-time feature computation from 100B+ transaction history',
    'Support 100+ payment methods and currencies',
    'Automatic model retraining when drift detected >2%',
    'Coordinate global blocklists across 50+ countries',
    'Handle chargebacks and dispute resolution workflows'
  ],
  userFacingNFRs: [
    'Latency: P99 < 5ms scoring, P99.9 < 10ms during spikes',
    'Request Rate: 10M transactions/sec normal, 100M during Black Friday',
    'Dataset Size: 100B transactions, 1B user profiles, 10PB feature store',
    'Availability: 99.999% uptime, zero false negatives for high-risk'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Transactions (redirect_client) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Stream (stream) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'cache',
        reason: 'Need Feature Store (cache) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'storage',
        reason: 'Need Fraud DB (db_primary) for paypal/stripe-scale fraud detection at 10m tps',
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
        reason: 'Transactions routes to Transaction API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Transaction API routes to Transaction Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Transaction Stream routes to Fraud Scorer',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Fraud Scorer routes to Feature Store',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Fraud Scorer routes to Fraud DB',
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

  scenarios: generateScenarios('fraud-detection-stream', problemConfigs['fraud-detection-stream'], [
    'Process 10M transactions/sec (100M during Black Friday)',
    'Score with <5ms P99 latency using 1000+ ML models',
    'Graph analysis for fraud ring detection across 1B+ entities',
    'Real-time feature computation from 100B+ transaction history',
    'Support 100+ payment methods and currencies',
    'Automatic model retraining when drift detected >2%',
    'Coordinate global blocklists across 50+ countries',
    'Handle chargebacks and dispute resolution workflows'
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

def process_10m_transactions_sec_100m_durin(**kwargs) -> Dict:
    """
    FR-1: Process 10M transactions/sec (100M during Black Friday)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def score_with_5ms_p99_latency_using_1000(**kwargs) -> Dict:
    """
    FR-2: Score with <5ms P99 latency using 1000+ ML models
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def graph_analysis_for_fraud_ring_detection(**kwargs) -> Dict:
    """
    FR-3: Graph analysis for fraud ring detection across 1B+ entities
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_feature_computation_from_100b(**kwargs) -> Dict:
    """
    FR-4: Real-time feature computation from 100B+ transaction history
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_100_payment_methods_and_currenc(**kwargs) -> Dict:
    """
    FR-5: Support 100+ payment methods and currencies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_model_retraining_when_drift_de(**kwargs) -> Dict:
    """
    FR-6: Automatic model retraining when drift detected >2%
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-7: Coordinate global blocklists across 50+ countries
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

def handle_chargebacks_and_dispute_resolutio(**kwargs) -> Dict:
    """
    FR-8: Handle chargebacks and dispute resolution workflows
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * User Activity Tracking
 * From extracted-problems/system-design/streaming.md
 */
export const userActivityTrackingProblemDefinition: ProblemDefinition = {
  id: 'user-activity-tracking',
  title: 'User Activity Tracking',
  description: `Create a user activity tracking system for product analytics. Learn about event schemas, user profiles, funnels, and cohort analysis.
- Track user events across platforms
- Build user profiles
- Calculate funnel metrics
- Segment users into cohorts`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track user events across platforms',
    'Build user profiles',
    'Calculate funnel metrics',
    'Segment users into cohorts',
    'Support A/B test analysis',
    'Generate behavioral insights'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s for event ingestion',
    'Request Rate: 300k events/sec',
    'Dataset Size: 50M active users',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile/Web Apps (redirect_client) for track user behavior across app',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Collectors (cdn) for track user behavior across app',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for track user behavior across app',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for track user behavior across app',
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
        reason: 'Mobile/Web Apps routes to Edge Collectors',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Collectors routes to Tracking API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tracking API routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Profile Builder',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Metric Aggregator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile Builder routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Metric Aggregator routes to Analytics DB',
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

  scenarios: generateScenarios('user-activity-tracking', problemConfigs['user-activity-tracking'], [
    'Track user events across platforms',
    'Build user profiles',
    'Calculate funnel metrics',
    'Segment users into cohorts',
    'Support A/B test analysis',
    'Generate behavioral insights'
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track user events across platforms
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

def build_user_profiles(**kwargs) -> Dict:
    """
    FR-2: Build user profiles
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-3: Calculate funnel metrics
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

def segment_users_into_cohorts(**kwargs) -> Dict:
    """
    FR-4: Segment users into cohorts
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_test_analysis(**kwargs) -> Dict:
    """
    FR-5: Support A/B test analysis
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def generate_behavioral_insights(**kwargs) -> Dict:
    """
    FR-6: Generate behavioral insights
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * IoT Telemetry Aggregation
 * From extracted-problems/system-design/streaming.md
 */
export const iotTelemetryAggregationProblemDefinition: ProblemDefinition = {
  id: 'iot-telemetry-aggregation',
  title: 'IoT Telemetry Aggregation',
  description: `Design a Tesla/AWS IoT-scale platform handling 100M messages/sec from 1B+ devices globally. Must handle entire fleet OTA updates (10x traffic), maintain <100ms P99 latency for critical telemetry, survive multiple region failures, and detect anomalies across millions of autonomous vehicles. Support edge computing, real-time ML inference, and operate within $10M/month budget while processing 10PB daily telemetry.
- Ingest 100M messages/sec from 1B+ devices (1B during OTA)
- Real-time anomaly detection across fleet with ML models
- Edge computing for 100ms decision making in vehicles
- Support OTA updates to entire fleet within 1 hour`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest 100M messages/sec from 1B+ devices (1B during OTA)',
    'Real-time anomaly detection across fleet with ML models',
    'Edge computing for 100ms decision making in vehicles',
    'Support OTA updates to entire fleet within 1 hour',
    'Hierarchical aggregation (device→edge→region→global)',
    'Process video streams from 10M+ cameras',
    'Coordinate swarm intelligence for autonomous fleets',
    'Predictive maintenance using telemetry patterns'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for critical telemetry, P99.9 < 500ms',
    'Request Rate: 100M messages/sec normal, 1B during fleet updates',
    'Dataset Size: 1B devices, 10PB daily telemetry, 100PB historical',
    'Availability: 99.999% for safety-critical data'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Devices (redirect_client) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'load_balancer',
        reason: 'Need MQTT Broker (lb) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'message_queue',
        reason: 'Need Telemetry Stream (stream) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for tesla/aws-scale iot with 1b+ devices',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Devices routes to MQTT Broker',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'MQTT Broker routes to Gateway Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Gateway Service routes to Telemetry Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Aggregators',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Anomaly Detector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregators routes to TimescaleDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Anomaly Detector routes to TimescaleDB',
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

  scenarios: generateScenarios('iot-telemetry-aggregation', problemConfigs['iot-telemetry-aggregation'], [
    'Ingest 100M messages/sec from 1B+ devices (1B during OTA)',
    'Real-time anomaly detection across fleet with ML models',
    'Edge computing for 100ms decision making in vehicles',
    'Support OTA updates to entire fleet within 1 hour',
    'Hierarchical aggregation (device→edge→region→global)',
    'Process video streams from 10M+ cameras',
    'Coordinate swarm intelligence for autonomous fleets',
    'Predictive maintenance using telemetry patterns'
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
cache = {}
item = {}
items = {}
memory = {}
vehicles = {}

def ingest_100m_messages_sec_from_1b_device(**kwargs) -> Dict:
    """
    FR-1: Ingest 100M messages/sec from 1B+ devices (1B during OTA)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_anomaly_detection_across_fleet(**kwargs) -> Dict:
    """
    FR-2: Real-time anomaly detection across fleet with ML models
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-3: Edge computing for 100ms decision making in vehicles
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-3: Edge computing for 100ms decision making in vehicles
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-4: Support OTA updates to entire fleet within 1 hour
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-5: Hierarchical aggregation (device→edge→region→global)
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-5: Hierarchical aggregation (device→edge→region→global)
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def process_video_streams_from_10m_cameras(**kwargs) -> Dict:
    """
    FR-6: Process video streams from 10M+ cameras
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def coordinate_swarm_intelligence_for_autono(**kwargs) -> Dict:
    """
    FR-7: Coordinate swarm intelligence for autonomous fleets
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def predictive_maintenance_using_telemetry_p(**kwargs) -> Dict:
    """
    FR-8: Predictive maintenance using telemetry patterns
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Game Event Processing
 * From extracted-problems/system-design/streaming.md
 */
export const gameEventProcessingProblemDefinition: ProblemDefinition = {
  id: 'game-event-processing',
  title: 'Game Event Processing',
  description: `Process game events for leaderboards, achievements, and analytics. Learn about high-volume event processing, state management, and real-time rankings.
- Process player actions in real-time
- Update leaderboards
- Award achievements
- Detect cheating`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process player actions in real-time',
    'Update leaderboards',
    'Award achievements',
    'Detect cheating',
    'Track player progression',
    'Generate live analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for rankings',
    'Request Rate: 500k events/sec',
    'Dataset Size: 10M concurrent players',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Clients (redirect_client) for process game telemetry events',
      },
      {
        type: 'load_balancer',
        reason: 'Need Game LB (lb) for process game telemetry events',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for process game telemetry events',
      },
      {
        type: 'cache',
        reason: 'Need Leaderboard Cache (cache) for process game telemetry events',
      },
      {
        type: 'storage',
        reason: 'Need Player DB (db_primary) for process game telemetry events',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Game Clients routes to Game LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Game LB routes to Game Servers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Game Servers routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Event Processor',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Event Processor routes to Leaderboard Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Event Processor routes to Player DB',
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

  scenarios: generateScenarios('game-event-processing', problemConfigs['game-event-processing'], [
    'Process player actions in real-time',
    'Update leaderboards',
    'Award achievements',
    'Detect cheating',
    'Track player progression',
    'Generate live analytics'
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
real = {}

def process_player_actions_in_real_time(**kwargs) -> Dict:
    """
    FR-1: Process player actions in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Update leaderboards
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def award_achievements(**kwargs) -> Dict:
    """
    FR-3: Award achievements
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def detect_cheating(**kwargs) -> Dict:
    """
    FR-4: Detect cheating
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Track player progression
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Generate live analytics
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
 * Delivery Tracking Updates
 * From extracted-problems/system-design/streaming.md
 */
export const deliveryTrackingUpdatesProblemDefinition: ProblemDefinition = {
  id: 'delivery-tracking-updates',
  title: 'Delivery Tracking Updates',
  description: `Stream delivery location updates and ETAs to customers. Learn about geospatial tracking, ETA calculation, and notification triggers.
- Track package locations
- Calculate real-time ETAs
- Notify on status changes
- Handle route updates`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track package locations',
    'Calculate real-time ETAs',
    'Notify on status changes',
    'Handle route updates',
    'Support delivery proof',
    'Generate delivery analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms for location updates',
    'Request Rate: 100k updates/sec',
    'Dataset Size: 50M active deliveries',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Delivery Drivers (redirect_client) for track package locations in real-time',
      },
      {
        type: 'message_queue',
        reason: 'Need Location Stream (stream) for track package locations in real-time',
      },
      {
        type: 'cache',
        reason: 'Need Location Cache (cache) for track package locations in real-time',
      },
      {
        type: 'storage',
        reason: 'Need Delivery DB (db_primary) for track package locations in real-time',
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
        reason: 'Delivery Drivers routes to Tracking API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tracking API routes to Location Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Location Stream routes to ETA Calculator',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Location Stream routes to Location Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'ETA Calculator routes to Delivery DB',
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

  scenarios: generateScenarios('delivery-tracking-updates', problemConfigs['delivery-tracking-updates'], [
    'Track package locations',
    'Calculate real-time ETAs',
    'Notify on status changes',
    'Handle route updates',
    'Support delivery proof',
    'Generate delivery analytics'
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
posts = {}
items = {}
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track package locations
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

def calculate_real_time_etas(**kwargs) -> Dict:
    """
    FR-2: Calculate real-time ETAs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Notify on status changes
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-4: Handle route updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def support_delivery_proof(**kwargs) -> Dict:
    """
    FR-5: Support delivery proof
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Generate delivery analytics
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
 * Notification Fan-out
 * From extracted-problems/system-design/streaming.md
 */
export const notificationFanoutProblemDefinition: ProblemDefinition = {
  id: 'notification-fanout',
  title: 'Notification Fan-out',
  description: `Fan out notifications to millions of users across multiple channels (email, push, SMS). Learn about channel preferences, batching, and rate limiting.
- Support multiple channels
- Respect user preferences
- Batch similar notifications
- Rate limit per channel`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support multiple channels',
    'Respect user preferences',
    'Batch similar notifications',
    'Rate limit per channel',
    'Track delivery status',
    'Handle failures with retries'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5s for fan-out',
    'Request Rate: 50k notifications/sec',
    'Dataset Size: 500M users',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for broadcast notifications to millions',
      },
      {
        type: 'message_queue',
        reason: 'Need Fanout Stream (stream) for broadcast notifications to millions',
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
        reason: 'Services routes to Notification API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Notification API routes to Fanout Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Fanout Stream routes to Fanout Worker',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to Email Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to Push Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to SMS Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Email Queue routes to Delivery Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Push Queue routes to Delivery Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'SMS Queue routes to Delivery Workers',
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

  scenarios: generateScenarios('notification-fanout', problemConfigs['notification-fanout'], [
    'Support multiple channels',
    'Respect user preferences',
    'Batch similar notifications',
    'Rate limit per channel',
    'Track delivery status',
    'Handle failures with retries'
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
posts = {}
users = {}
memory = {}

def support_multiple_channels(**kwargs) -> Dict:
    """
    FR-1: Support multiple channels
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def respect_user_preferences(**kwargs) -> Dict:
    """
    FR-2: Respect user preferences
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def batch_similar_notifications(**kwargs) -> Dict:
    """
    FR-3: Batch similar notifications
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rate_limit_per_channel(**kwargs) -> Dict:
    """
    FR-4: Rate limit per channel
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Track delivery status
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

def handle_failures_with_retries(**kwargs) -> Dict:
    """
    FR-6: Handle failures with retries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Content Moderation Queue
 * From extracted-problems/system-design/streaming.md
 */
export const contentModerationQueueProblemDefinition: ProblemDefinition = {
  id: 'content-moderation-queue',
  title: 'Content Moderation Queue',
  description: `Queue and process user-generated content through automated and human moderation. Learn about prioritization, SLA management, and feedback loops.
- Queue content for review
- Apply automated filters
- Route to human moderators
- Prioritize by urgency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Queue content for review',
    'Apply automated filters',
    'Route to human moderators',
    'Prioritize by urgency',
    'Track SLA compliance',
    'Support appeals process'
  ],
  userFacingNFRs: [
    'Latency: P95 < 15min for high-priority',
    'Request Rate: 100k submissions/sec',
    'Dataset Size: 1B pieces of content/day',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Content Creators (redirect_client) for moderate user-generated content',
      },
      {
        type: 'message_queue',
        reason: 'Need Content Stream (stream) for moderate user-generated content',
      },
      {
        type: 'storage',
        reason: 'Need Content DB (db_primary) for moderate user-generated content',
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
        reason: 'Content Creators routes to Upload API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Upload API routes to Content Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Content Stream routes to ML Classifier',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to High Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to Medium Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to Low Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'High Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Medium Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Low Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Moderator UI routes to Content DB',
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

  scenarios: generateScenarios('content-moderation-queue', problemConfigs['content-moderation-queue'], [
    'Queue content for review',
    'Apply automated filters',
    'Route to human moderators',
    'Prioritize by urgency',
    'Track SLA compliance',
    'Support appeals process'
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
posts = {}
memory = {}

def queue_content_for_review(**kwargs) -> Dict:
    """
    FR-1: Queue content for review
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def apply_automated_filters(**kwargs) -> Dict:
    """
    FR-2: Apply automated filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def route_to_human_moderators(**kwargs) -> Dict:
    """
    FR-3: Route to human moderators
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def prioritize_by_urgency(**kwargs) -> Dict:
    """
    FR-4: Prioritize by urgency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Track SLA compliance
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

def support_appeals_process(**kwargs) -> Dict:
    """
    FR-6: Support appeals process
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Search Index Updates
 * From extracted-problems/system-design/streaming.md
 */
export const searchIndexUpdatesProblemDefinition: ProblemDefinition = {
  id: 'search-index-updates',
  title: 'Search Index Updates',
  description: `Stream document changes to search indexes in near real-time. Learn about incremental indexing, consistency, and search ranking updates.
- Stream document changes
- Update indexes incrementally
- Maintain search consistency
- Reindex on schema changes`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Stream document changes',
    'Update indexes incrementally',
    'Maintain search consistency',
    'Reindex on schema changes',
    'Update ranking signals',
    'Support rollback on errors'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5s from update to searchable',
    'Request Rate: 50k document changes/sec',
    'Dataset Size: 10B documents',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for real-time search index maintenance',
      },
      {
        type: 'storage',
        reason: 'Need Source DB (db_primary) for real-time search index maintenance',
      },
      {
        type: 'message_queue',
        reason: 'Need Change Stream (stream) for real-time search index maintenance',
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
        reason: 'Services routes to Document API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Document API routes to Source DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Source DB routes to Change Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Change Stream routes to Index Workers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Index Workers routes to Elasticsearch',
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

  scenarios: generateScenarios('search-index-updates', problemConfigs['search-index-updates'], [
    'Stream document changes',
    'Update indexes incrementally',
    'Maintain search consistency',
    'Reindex on schema changes',
    'Update ranking signals',
    'Support rollback on errors'
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
results = {}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Stream document changes
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Update indexes incrementally
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Maintain search consistency
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-4: Reindex on schema changes
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Update ranking signals
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def support_rollback_on_errors(**kwargs) -> Dict:
    """
    FR-6: Support rollback on errors
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Recommendation Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const recommendationPipelineProblemDefinition: ProblemDefinition = {
  id: 'recommendation-pipeline',
  title: 'Recommendation Pipeline',
  description: `Build a recommendation pipeline using user activity streams and ML models. Learn about feature extraction, model serving, and A/B testing.
- Track user interactions
- Extract behavioral features
- Serve ML recommendations
- A/B test models`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track user interactions',
    'Extract behavioral features',
    'Serve ML recommendations',
    'A/B test models',
    'Update models incrementally',
    'Cache recommendations'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for recommendations',
    'Request Rate: 200k requests/sec',
    'Dataset Size: 100M users, 1M items',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Users (redirect_client) for netflix-style recommendations',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for netflix-style recommendations',
      },
      {
        type: 'cache',
        reason: 'Need Recommendation Cache (cache) for netflix-style recommendations',
      },
      {
        type: 'message_queue',
        reason: 'Need Activity Stream (stream) for netflix-style recommendations',
      },
      {
        type: 'storage',
        reason: 'Need Feature Store (db_primary) for netflix-style recommendations',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'App Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Recommendation API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Recommendation API routes to Recommendation Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Recommendation API routes to Activity Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Activity Stream routes to ML Serving',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'ML Serving routes to Recommendation Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Serving routes to Feature Store',
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

  scenarios: generateScenarios('recommendation-pipeline', problemConfigs['recommendation-pipeline'], [
    'Track user interactions',
    'Extract behavioral features',
    'Serve ML recommendations',
    'A/B test models',
    'Update models incrementally',
    'Cache recommendations'
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
events = {}
users = {}
item = {}
items = {}
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track user interactions
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

def extract_behavioral_features(**kwargs) -> Dict:
    """
    FR-2: Extract behavioral features
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-3: Serve ML recommendations
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def a_b_test_models(**kwargs) -> Dict:
    """
    FR-4: A/B test models
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Update models incrementally
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-6: Cache recommendations
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-6: Cache recommendations
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
 * Audit Log Streaming
 * From extracted-problems/system-design/streaming.md
 */
export const auditLogStreamingProblemDefinition: ProblemDefinition = {
  id: 'audit-log-streaming',
  title: 'Audit Log Streaming',
  description: `Stream audit logs for compliance and security monitoring. Learn about immutability, encryption, retention policies, and log correlation.
- Capture all system actions
- Ensure log immutability
- Encrypt sensitive data
- Support compliance queries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Capture all system actions',
    'Ensure log immutability',
    'Encrypt sensitive data',
    'Support compliance queries',
    'Archive to cold storage',
    'Detect security anomalies'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s for log ingestion',
    'Request Rate: 500k audit events/sec',
    'Dataset Size: 100TB logs, 7-year retention',
    'Availability: 99.99% uptime',
    'Durability: 11 nines durability'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need All Services (redirect_client) for compliance audit trail',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Stream (stream) for compliance audit trail',
      },
      {
        type: 'storage',
        reason: 'Need Hot Storage (db_primary) for compliance audit trail',
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
        reason: 'All Services routes to Audit Collector',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Audit Collector routes to Audit Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Audit Stream routes to Log Processor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Audit Stream routes to Anomaly Detector',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Log Processor routes to Hot Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Log Processor routes to Cold Archive',
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

  scenarios: generateScenarios('audit-log-streaming', problemConfigs['audit-log-streaming'], [
    'Capture all system actions',
    'Ensure log immutability',
    'Encrypt sensitive data',
    'Support compliance queries',
    'Archive to cold storage',
    'Detect security anomalies'
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

def capture_all_system_actions(**kwargs) -> Dict:
    """
    FR-1: Capture all system actions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ensure_log_immutability(**kwargs) -> Dict:
    """
    FR-2: Ensure log immutability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def encrypt_sensitive_data(**kwargs) -> Dict:
    """
    FR-3: Encrypt sensitive data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_compliance_queries(**kwargs) -> Dict:
    """
    FR-4: Support compliance queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def archive_to_cold_storage(**kwargs) -> Dict:
    """
    FR-5: Archive to cold storage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def detect_security_anomalies(**kwargs) -> Dict:
    """
    FR-6: Detect security anomalies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Kafka Streaming Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const kafkaStreamingPipelineProblemDefinition: ProblemDefinition = {
  id: 'kafka-streaming-pipeline',
  title: 'Kafka Streaming Pipeline',
  description: `Design a Kafka-based streaming pipeline processing billions of events daily. Learn about partitioning strategies, consumer groups, exactly-once semantics, and stream processing with Kafka Streams.
- Ingest 1B events per day
- Process with exactly-once semantics
- Support stream joins and aggregations
- Handle late-arriving data`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest 1B events per day',
    'Process with exactly-once semantics',
    'Support stream joins and aggregations',
    'Handle late-arriving data',
    'Provide real-time analytics',
    'Support event replay for reprocessing'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms end-to-end',
    'Request Rate: 100k events/sec peak',
    'Dataset Size: 30 days retention, 30TB',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Event Producers (redirect_client) for process billions of events with kafka',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Cluster (stream) for process billions of events with kafka',
      },
      {
        type: 'cache',
        reason: 'Need State Store (cache) for process billions of events with kafka',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for process billions of events with kafka',
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
        reason: 'Event Producers routes to Producer API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producer API routes to Kafka Cluster',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Kafka Cluster routes to Stream Processor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka Cluster routes to Analytics Engine',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Stream Processor routes to State Store',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Analytics Engine routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Analytics Engine routes to State Store',
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

  scenarios: generateScenarios('kafka-streaming-pipeline', problemConfigs['kafka-streaming-pipeline'], [
    'Ingest 1B events per day',
    'Process with exactly-once semantics',
    'Support stream joins and aggregations',
    'Handle late-arriving data',
    'Provide real-time analytics',
    'Support event replay for reprocessing'
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

def ingest_1b_events_per_day(**kwargs) -> Dict:
    """
    FR-1: Ingest 1B events per day
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def process_with_exactly_once_semantics(**kwargs) -> Dict:
    """
    FR-2: Process with exactly-once semantics
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_stream_joins_and_aggregations(**kwargs) -> Dict:
    """
    FR-3: Support stream joins and aggregations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_late_arriving_data(**kwargs) -> Dict:
    """
    FR-4: Handle late-arriving data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Provide real-time analytics
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

def support_event_replay_for_reprocessing(**kwargs) -> Dict:
    """
    FR-6: Support event replay for reprocessing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Exactly-Once Payment Processing
 * From extracted-problems/system-design/streaming.md
 */
export const exactlyOncePaymentProblemDefinition: ProblemDefinition = {
  id: 'exactly-once-payment',
  title: 'Exactly-Once Payment Processing',
  description: `Implement exactly-once payment processing across distributed systems. Learn about idempotency keys, distributed transactions, and two-phase commit.
- Guarantee exactly-once payment execution
- Handle network failures gracefully
- Support distributed transactions
- Maintain strict ordering`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Guarantee exactly-once payment execution',
    'Handle network failures gracefully',
    'Support distributed transactions',
    'Maintain strict ordering',
    'Enable idempotent retries',
    'Provide strong consistency',
    'Track transaction state',
    'Support rollback on failure'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms for payments',
    'Request Rate: 50k payments/sec',
    'Dataset Size: 10B transactions/year',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Payment Requests (redirect_client) for guarantee exactly-once payment semantics',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for guarantee exactly-once payment semantics',
      },
      {
        type: 'cache',
        reason: 'Need Idempotency Cache (cache) for guarantee exactly-once payment semantics',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Log (stream) for guarantee exactly-once payment semantics',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for guarantee exactly-once payment semantics',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Payment Requests routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Payment Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Payment Gateway routes to Idempotency Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Payment Gateway routes to Transaction Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Log routes to Coordinators',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinators routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Coordinators routes to Settlement Queue',
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

  scenarios: generateScenarios('exactly-once-payment', problemConfigs['exactly-once-payment'], [
    'Guarantee exactly-once payment execution',
    'Handle network failures gracefully',
    'Support distributed transactions',
    'Maintain strict ordering',
    'Enable idempotent retries',
    'Provide strong consistency',
    'Track transaction state',
    'Support rollback on failure'
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

def guarantee_exactly_once_payment_execution(**kwargs) -> Dict:
    """
    FR-1: Guarantee exactly-once payment execution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_network_failures_gracefully(**kwargs) -> Dict:
    """
    FR-2: Handle network failures gracefully
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_distributed_transactions(**kwargs) -> Dict:
    """
    FR-3: Support distributed transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_strict_ordering(**kwargs) -> Dict:
    """
    FR-4: Maintain strict ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_idempotent_retries(**kwargs) -> Dict:
    """
    FR-5: Enable idempotent retries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_strong_consistency(**kwargs) -> Dict:
    """
    FR-6: Provide strong consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-7: Track transaction state
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

def support_rollback_on_failure(**kwargs) -> Dict:
    """
    FR-8: Support rollback on failure
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global Event Sourcing
 * From extracted-problems/system-design/streaming.md
 */
export const globalEventSourcingSystemProblemDefinition: ProblemDefinition = {
  id: 'global-event-sourcing-system',
  title: 'Global Event Sourcing',
  description: `Design a globally distributed event sourcing system with regional event stores and cross-region replication. Handle conflicts, maintain causality, and support point-in-time queries globally.
- Store events across regions
- Maintain causal ordering
- Replicate events globally
- Resolve conflicts with CRDTs`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store events across regions',
    'Maintain causal ordering',
    'Replicate events globally',
    'Resolve conflicts with CRDTs',
    'Support global queries',
    'Enable regional projections',
    'Provide point-in-time recovery',
    'Handle network partitions'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms regional, < 1s cross-region',
    'Request Rate: 200k events/sec globally',
    'Dataset Size: 500TB event history',
    'Availability: 99.99% per region'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Apps (redirect_client) for distributed event sourcing across continents',
      },
      {
        type: 'cdn',
        reason: 'Need GeoDNS (cdn) for distributed event sourcing across continents',
      },
      {
        type: 'load_balancer',
        reason: 'Need Regional LBs (lb) for distributed event sourcing across continents',
      },
      {
        type: 'message_queue',
        reason: 'Need Regional Stores (stream) for distributed event sourcing across continents',
      },
      {
        type: 'cache',
        reason: 'Need Projections (cache) for distributed event sourcing across continents',
      },
      {
        type: 'storage',
        reason: 'Need Global Catalog (db_primary) for distributed event sourcing across continents',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Apps routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GeoDNS routes to Regional LBs',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Regional LBs routes to Event APIs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event APIs routes to Regional Stores',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Regional Stores routes to Replicators',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Regional Stores',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Projections',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Global Catalog',
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

  scenarios: generateScenarios('global-event-sourcing-system', problemConfigs['global-event-sourcing-system'], [
    'Store events across regions',
    'Maintain causal ordering',
    'Replicate events globally',
    'Resolve conflicts with CRDTs',
    'Support global queries',
    'Enable regional projections',
    'Provide point-in-time recovery',
    'Handle network partitions'
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
    FR-1: Store events across regions
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def maintain_causal_ordering(**kwargs) -> Dict:
    """
    FR-2: Maintain causal ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def replicate_events_globally(**kwargs) -> Dict:
    """
    FR-3: Replicate events globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def resolve_conflicts_with_crdts(**kwargs) -> Dict:
    """
    FR-4: Resolve conflicts with CRDTs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_global_queries(**kwargs) -> Dict:
    """
    FR-5: Support global queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_regional_projections(**kwargs) -> Dict:
    """
    FR-6: Enable regional projections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_point_in_time_recovery(**kwargs) -> Dict:
    """
    FR-7: Provide point-in-time recovery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_network_partitions(**kwargs) -> Dict:
    """
    FR-8: Handle network partitions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-DC Stream Replication
 * From extracted-problems/system-design/streaming.md
 */
export const multiDcStreamReplicationProblemDefinition: ProblemDefinition = {
  id: 'multi-dc-stream-replication',
  title: 'Multi-DC Stream Replication',
  description: `Replicate streaming data across multiple data centers with low latency and high consistency. Handle regional failures, network partitions, and maintain ordering guarantees.
- Replicate streams across DCs
- Maintain message ordering
- Handle DC failures
- Support bidirectional replication`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Replicate streams across DCs',
    'Maintain message ordering',
    'Handle DC failures',
    'Support bidirectional replication',
    'Monitor replication lag',
    'Enable selective replication',
    'Provide conflict detection',
    'Support topic remapping'
  ],
  userFacingNFRs: [
    'Latency: P95 < 2s cross-DC replication',
    'Request Rate: 500k messages/sec per DC',
    'Dataset Size: 100TB per DC',
    'Availability: 99.95% per DC'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'message_queue',
        reason: 'Need DC1 Kafka (stream) for replicate streams across data centers',
      },
      {
        type: 'compute',
        reason: 'Need Replicators 1-2 (worker) for replicate streams across data centers',
      },
      {
        type: 'cache',
        reason: 'Need Lag Monitor (cache) for replicate streams across data centers',
      },
      {
        type: 'storage',
        reason: 'Need Metrics DB (db_primary) for replicate streams across data centers',
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
        reason: 'DC1 Kafka routes to Replicators 1-2',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Replicators 1-2 routes to DC2 Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'DC2 Kafka routes to Replicators 2-3',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Replicators 2-3 routes to DC3 Kafka',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators 1-2 routes to Lag Monitor',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators 2-3 routes to Lag Monitor',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Lag Monitor routes to Health Dashboard',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Health Dashboard routes to Metrics DB',
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

  scenarios: generateScenarios('multi-dc-stream-replication', problemConfigs['multi-dc-stream-replication'], [
    'Replicate streams across DCs',
    'Maintain message ordering',
    'Handle DC failures',
    'Support bidirectional replication',
    'Monitor replication lag',
    'Enable selective replication',
    'Provide conflict detection',
    'Support topic remapping'
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

def replicate_streams_across_dcs(**kwargs) -> Dict:
    """
    FR-1: Replicate streams across DCs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_message_ordering(**kwargs) -> Dict:
    """
    FR-2: Maintain message ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_dc_failures(**kwargs) -> Dict:
    """
    FR-3: Handle DC failures
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_bidirectional_replication(**kwargs) -> Dict:
    """
    FR-4: Support bidirectional replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Monitor replication lag
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

def enable_selective_replication(**kwargs) -> Dict:
    """
    FR-6: Enable selective replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_conflict_detection(**kwargs) -> Dict:
    """
    FR-7: Provide conflict detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_topic_remapping(**kwargs) -> Dict:
    """
    FR-8: Support topic remapping
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Real-time ML Feature Store
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeMlFeatureStoreProblemDefinition: ProblemDefinition = {
  id: 'realtime-ml-feature-store',
  title: 'Real-time ML Feature Store',
  description: `Create a real-time feature store for ML inference with streaming feature computation, low-latency serving, and point-in-time correctness.
- Compute features from streams
- Serve features with <10ms latency
- Maintain point-in-time correctness
- Support feature versioning`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Compute features from streams',
    'Serve features with <10ms latency',
    'Maintain point-in-time correctness',
    'Support feature versioning',
    'Enable batch and streaming',
    'Provide feature lineage',
    'Handle feature drift',
    'Support A/B testing'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for feature serving',
    'Request Rate: 1M feature requests/sec',
    'Dataset Size: 10B feature vectors',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need ML Services (redirect_client) for feature store for online inference',
      },
      {
        type: 'load_balancer',
        reason: 'Need Feature LB (lb) for feature store for online inference',
      },
      {
        type: 'cache',
        reason: 'Need Feature Cache (cache) for feature store for online inference',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for feature store for online inference',
      },
      {
        type: 'storage',
        reason: 'Need Offline Store (db_primary) for feature store for online inference',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'ML Services routes to Feature LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Feature LB routes to Feature API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feature API routes to Feature Cache',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Feature Processors',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feature Processors routes to Feature Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feature Processors routes to Offline Store',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feature API routes to Registry',
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

  scenarios: generateScenarios('realtime-ml-feature-store', problemConfigs['realtime-ml-feature-store'], [
    'Compute features from streams',
    'Serve features with <10ms latency',
    'Maintain point-in-time correctness',
    'Support feature versioning',
    'Enable batch and streaming',
    'Provide feature lineage',
    'Handle feature drift',
    'Support A/B testing'
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

def compute_features_from_streams(**kwargs) -> Dict:
    """
    FR-1: Compute features from streams
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-2: Serve features with <10ms latency
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def maintain_point_in_time_correctness(**kwargs) -> Dict:
    """
    FR-3: Maintain point-in-time correctness
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_feature_versioning(**kwargs) -> Dict:
    """
    FR-4: Support feature versioning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_batch_and_streaming(**kwargs) -> Dict:
    """
    FR-5: Enable batch and streaming
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_feature_lineage(**kwargs) -> Dict:
    """
    FR-6: Provide feature lineage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_feature_drift(**kwargs) -> Dict:
    """
    FR-7: Handle feature drift
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_a_b_testing(**kwargs) -> Dict:
    """
    FR-8: Support A/B testing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * GDPR-Compliant Event Streaming
 * From extracted-problems/system-design/streaming.md
 */
export const gdprCompliantStreamingProblemDefinition: ProblemDefinition = {
  id: 'gdpr-compliant-streaming',
  title: 'GDPR-Compliant Event Streaming',
  description: `Design an event streaming platform compliant with GDPR and privacy regulations. Handle right to deletion, data anonymization, and consent management in real-time streams.
- Support right to be forgotten
- Anonymize PII in streams
- Track consent across events
- Enable data portability`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support right to be forgotten',
    'Anonymize PII in streams',
    'Track consent across events',
    'Enable data portability',
    'Audit all data access',
    'Implement retention policies',
    'Support data minimization',
    'Provide transparency reports'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms with privacy checks',
    'Request Rate: 100k events/sec',
    'Dataset Size: 50TB with 30-day retention',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for privacy-preserving event streams',
      },
      {
        type: 'cache',
        reason: 'Need Consent Cache (cache) for privacy-preserving event streams',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for privacy-preserving event streams',
      },
      {
        type: 'storage',
        reason: 'Need Audit Log (db_primary) for privacy-preserving event streams',
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
        reason: 'Services routes to Privacy Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Privacy Gateway routes to Consent Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Privacy Gateway routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Anonymizer',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Anonymizer routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Privacy Gateway routes to Deletion Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Deletion Queue routes to Deletion Worker',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Deletion Worker routes to Event Stream',
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

  scenarios: generateScenarios('gdpr-compliant-streaming', problemConfigs['gdpr-compliant-streaming'], [
    'Support right to be forgotten',
    'Anonymize PII in streams',
    'Track consent across events',
    'Enable data portability',
    'Audit all data access',
    'Implement retention policies',
    'Support data minimization',
    'Provide transparency reports'
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
streams = {}

def support_right_to_be_forgotten(**kwargs) -> Dict:
    """
    FR-1: Support right to be forgotten
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def anonymize_pii_in_streams(**kwargs) -> Dict:
    """
    FR-2: Anonymize PII in streams
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-3: Track consent across events
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

def enable_data_portability(**kwargs) -> Dict:
    """
    FR-4: Enable data portability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def audit_all_data_access(**kwargs) -> Dict:
    """
    FR-5: Audit all data access
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_retention_policies(**kwargs) -> Dict:
    """
    FR-6: Implement retention policies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_data_minimization(**kwargs) -> Dict:
    """
    FR-7: Support data minimization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_transparency_reports(**kwargs) -> Dict:
    """
    FR-8: Provide transparency reports
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Financial Settlement Stream
 * From extracted-problems/system-design/streaming.md
 */
export const financialSettlementStreamProblemDefinition: ProblemDefinition = {
  id: 'financial-settlement-stream',
  title: 'Financial Settlement Stream',
  description: `Process financial settlements in real-time with strong consistency, audit trails, and regulatory compliance. Handle reconciliation, disputes, and multi-currency settlements.
- Process settlements in real-time
- Maintain double-entry accounting
- Support multi-currency
- Handle dispute resolution`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process settlements in real-time',
    'Maintain double-entry accounting',
    'Support multi-currency',
    'Handle dispute resolution',
    'Enable transaction reconciliation',
    'Provide regulatory reporting',
    'Implement circuit breakers',
    'Support settlement windows'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s for settlements',
    'Request Rate: 50k settlements/sec',
    'Dataset Size: 100TB transaction history',
    'Availability: 99.999% uptime',
    'Durability: 11 nines durability'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Banks/PSPs (redirect_client) for real-time financial settlement',
      },
      {
        type: 'load_balancer',
        reason: 'Need Gateway LB (lb) for real-time financial settlement',
      },
      {
        type: 'message_queue',
        reason: 'Need Settlement Stream (stream) for real-time financial settlement',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for real-time financial settlement',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Banks/PSPs routes to Gateway LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Gateway LB routes to Settlement API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Settlement API routes to Validators',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Validators routes to Settlement Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Settlement Stream routes to Processors',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Processors routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Processors routes to Reconciliation',
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

  scenarios: generateScenarios('financial-settlement-stream', problemConfigs['financial-settlement-stream'], [
    'Process settlements in real-time',
    'Maintain double-entry accounting',
    'Support multi-currency',
    'Handle dispute resolution',
    'Enable transaction reconciliation',
    'Provide regulatory reporting',
    'Implement circuit breakers',
    'Support settlement windows'
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
memory = {}
real = {}

def process_settlements_in_real_time(**kwargs) -> Dict:
    """
    FR-1: Process settlements in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Maintain double-entry accounting
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

def support_multi_currency(**kwargs) -> Dict:
    """
    FR-3: Support multi-currency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_dispute_resolution(**kwargs) -> Dict:
    """
    FR-4: Handle dispute resolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_transaction_reconciliation(**kwargs) -> Dict:
    """
    FR-5: Enable transaction reconciliation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_regulatory_reporting(**kwargs) -> Dict:
    """
    FR-6: Provide regulatory reporting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_circuit_breakers(**kwargs) -> Dict:
    """
    FR-7: Implement circuit breakers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_settlement_windows(**kwargs) -> Dict:
    """
    FR-8: Support settlement windows
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Autonomous Vehicle Telemetry
 * From extracted-problems/system-design/streaming.md
 */
export const autonomousVehicleTelemetryProblemDefinition: ProblemDefinition = {
  id: 'autonomous-vehicle-telemetry',
  title: 'Autonomous Vehicle Telemetry',
  description: `Stream and process telemetry from autonomous vehicles including sensor data, video, and decision logs. Handle high bandwidth, edge processing, and ML model updates.
- Ingest multi-modal sensor data
- Process video streams
- Log decision traces
- Detect safety events`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest multi-modal sensor data',
    'Process video streams',
    'Log decision traces',
    'Detect safety events',
    'Update ML models OTA',
    'Support fleet analytics',
    'Enable remote diagnostics',
    'Compress data efficiently'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for safety events',
    'Request Rate: 10M readings/sec fleet-wide',
    'Dataset Size: 1PB/day from fleet',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need AV Fleet (redirect_client) for process av sensor streams',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Gateways (cdn) for process av sensor streams',
      },
      {
        type: 'message_queue',
        reason: 'Need Safety Stream (stream) for process av sensor streams',
      },
      {
        type: 'storage',
        reason: 'Need Data Lake (db_primary) for process av sensor streams',
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
        reason: 'AV Fleet routes to Edge Gateways',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Gateways routes to Edge Processors',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Safety Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Telemetry Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Video Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Safety Stream routes to Safety Monitor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to ML Pipeline',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Video Stream routes to ML Pipeline',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Pipeline routes to Data Lake',
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

  scenarios: generateScenarios('autonomous-vehicle-telemetry', problemConfigs['autonomous-vehicle-telemetry'], [
    'Ingest multi-modal sensor data',
    'Process video streams',
    'Log decision traces',
    'Detect safety events',
    'Update ML models OTA',
    'Support fleet analytics',
    'Enable remote diagnostics',
    'Compress data efficiently'
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

def ingest_multi_modal_sensor_data(**kwargs) -> Dict:
    """
    FR-1: Ingest multi-modal sensor data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def process_video_streams(**kwargs) -> Dict:
    """
    FR-2: Process video streams
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def log_decision_traces(**kwargs) -> Dict:
    """
    FR-3: Log decision traces
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def detect_safety_events(**kwargs) -> Dict:
    """
    FR-4: Detect safety events
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Update ML models OTA
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Support fleet analytics
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

def enable_remote_diagnostics(**kwargs) -> Dict:
    """
    FR-7: Enable remote diagnostics
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def compress_data_efficiently(**kwargs) -> Dict:
    """
    FR-8: Compress data efficiently
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Healthcare Data Stream (HIPAA)
 * From extracted-problems/system-design/streaming.md
 */
export const healthcareDataStreamHipaaProblemDefinition: ProblemDefinition = {
  id: 'healthcare-data-stream-hipaa',
  title: 'Healthcare Data Stream (HIPAA)',
  description: `Stream patient health data with HIPAA compliance, encryption, access controls, and audit trails. Handle HL7/FHIR formats, clinical workflows, and real-time alerts.
- Stream HL7/FHIR messages
- Encrypt PHI end-to-end
- Enforce access controls
- Audit all data access`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Stream HL7/FHIR messages',
    'Encrypt PHI end-to-end',
    'Enforce access controls',
    'Audit all data access',
    'Support clinical workflows',
    'Enable real-time alerts',
    'Maintain data lineage',
    'Provide patient consent'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms for critical alerts',
    'Request Rate: 100k messages/sec',
    'Dataset Size: 500TB patient data',
    'Availability: 99.99% uptime',
    'Durability: 11 nines durability'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Healthcare Systems (redirect_client) for hipaa-compliant health data streaming',
      },
      {
        type: 'load_balancer',
        reason: 'Need Secure Gateway (lb) for hipaa-compliant health data streaming',
      },
      {
        type: 'message_queue',
        reason: 'Need FHIR Stream (stream) for hipaa-compliant health data streaming',
      },
      {
        type: 'cache',
        reason: 'Need Permissions (cache) for hipaa-compliant health data streaming',
      },
      {
        type: 'storage',
        reason: 'Need Audit Log (db_primary) for hipaa-compliant health data streaming',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Healthcare Systems routes to Secure Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Secure Gateway routes to Encryption Layer',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Encryption Layer routes to FHIR Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'FHIR Stream routes to Clinical Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Clinical Workers routes to Permissions',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Clinical Workers routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Clinical Workers routes to Alert Queue',
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

  scenarios: generateScenarios('healthcare-data-stream-hipaa', problemConfigs['healthcare-data-stream-hipaa'], [
    'Stream HL7/FHIR messages',
    'Encrypt PHI end-to-end',
    'Enforce access controls',
    'Audit all data access',
    'Support clinical workflows',
    'Enable real-time alerts',
    'Maintain data lineage',
    'Provide patient consent'
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

def stream_hl7_fhir_messages(**kwargs) -> Dict:
    """
    FR-1: Stream HL7/FHIR messages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def encrypt_phi_end_to_end(**kwargs) -> Dict:
    """
    FR-2: Encrypt PHI end-to-end
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enforce_access_controls(**kwargs) -> Dict:
    """
    FR-3: Enforce access controls
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def audit_all_data_access(**kwargs) -> Dict:
    """
    FR-4: Audit all data access
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_clinical_workflows(**kwargs) -> Dict:
    """
    FR-5: Support clinical workflows
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_real_time_alerts(**kwargs) -> Dict:
    """
    FR-6: Enable real-time alerts
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_data_lineage(**kwargs) -> Dict:
    """
    FR-7: Maintain data lineage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_patient_consent(**kwargs) -> Dict:
    """
    FR-8: Provide patient consent
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global CDC Streaming Platform
 * From extracted-problems/system-design/streaming.md
 */
export const globalCdcPipelineProblemDefinition: ProblemDefinition = {
  id: 'global-cdc-pipeline',
  title: 'Global CDC Streaming Platform',
  description: `Build a change data capture (CDC) platform that streams database changes across multiple regions. Handle schema evolution, data transformation, and maintain consistency across heterogeneous systems.
- Capture changes from multiple databases
- Stream across regions with low latency
- Handle schema evolution gracefully
- Transform data between formats`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Capture changes from multiple databases',
    'Stream across regions with low latency',
    'Handle schema evolution gracefully',
    'Transform data between formats',
    'Maintain ordering guarantees',
    'Support filtering and routing',
    'Enable point-in-time recovery',
    'Monitor lag and data quality'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s cross-region replication',
    'Request Rate: 500k changes/sec globally',
    'Dataset Size: 100TB daily change volume',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need MySQL Sources (db_primary) for replicate database changes worldwide',
      },
      {
        type: 'compute',
        reason: 'Need CDC Connectors (worker) for replicate database changes worldwide',
      },
      {
        type: 'message_queue',
        reason: 'Need Global Kafka (stream) for replicate database changes worldwide',
      },
      {
        type: 'cache',
        reason: 'Need Schema Registry (cache) for replicate database changes worldwide',
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
        reason: 'MySQL Sources routes to CDC Connectors',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'Postgres Sources routes to CDC Connectors',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'CDC Connectors routes to Global Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Global Kafka routes to Transformers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Global Kafka routes to Routers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transformers routes to Schema Registry',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Transformers routes to Regional Streams',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Routers routes to Regional Streams',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Regional Streams routes to Target Systems',
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

  scenarios: generateScenarios('global-cdc-pipeline', problemConfigs['global-cdc-pipeline'], [
    'Capture changes from multiple databases',
    'Stream across regions with low latency',
    'Handle schema evolution gracefully',
    'Transform data between formats',
    'Maintain ordering guarantees',
    'Support filtering and routing',
    'Enable point-in-time recovery',
    'Monitor lag and data quality'
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

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Capture changes from multiple databases
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def stream_across_regions_with_low_latency(**kwargs) -> Dict:
    """
    FR-2: Stream across regions with low latency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_schema_evolution_gracefully(**kwargs) -> Dict:
    """
    FR-3: Handle schema evolution gracefully
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def transform_data_between_formats(**kwargs) -> Dict:
    """
    FR-4: Transform data between formats
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def maintain_ordering_guarantees(**kwargs) -> Dict:
    """
    FR-5: Maintain ordering guarantees
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_filtering_and_routing(**kwargs) -> Dict:
    """
    FR-6: Support filtering and routing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_point_in_time_recovery(**kwargs) -> Dict:
    """
    FR-7: Enable point-in-time recovery
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-8: Monitor lag and data quality
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
(chatProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(chatProblemDefinition);
