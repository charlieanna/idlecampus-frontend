# System Design - STREAMING Problems

Total Problems: 35

---

## 1. Basic Message Queue

**ID:** basic-message-queue
**Category:** streaming
**Difficulty:** Easy

### Summary

Learn pub/sub with RabbitMQ

### Goal

Build reliable async message processing.

### Description

Learn message queue fundamentals with a simple publisher-subscriber system. Understand message acknowledgment, durability, and basic queue patterns for decoupling services.

### Functional Requirements

- Publish messages to queues
- Subscribe multiple consumers
- Handle message acknowledgments
- Implement retry on failure
- Support message persistence

### Non-Functional Requirements

- **Latency:** P95 < 100ms end-to-end
- **Request Rate:** 5k messages/sec
- **Dataset Size:** 1M messages in queue
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **message_rate:** 5000
- **queue_size:** 1000000
- **consumer_count:** 3

### Available Components

- client
- lb
- app
- queue
- worker

### Hints

1. Use acknowledgments for reliability
2. Multiple consumers for parallel processing

### Tiers/Checkpoints

**T0: Queue**
  - Must include: worker

**T1: Scale**
  - Minimum 3 of type: worker

### Reference Solution

Queue decouples producers from consumers. Multiple consumer groups process messages in parallel. Acknowledgments ensure at-least-once delivery. This teaches basic async messaging patterns.

**Components:**
- Producers (redirect_client)
- Publisher API (app)
- RabbitMQ (queue)
- Consumer A (worker)
- Consumer B (worker)

**Connections:**
- Producers → Publisher API
- Publisher API → RabbitMQ
- RabbitMQ → Consumer A
- RabbitMQ → Consumer B

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 2. Real-time Push Notifications

**ID:** realtime-notifications
**Category:** streaming
**Difficulty:** Easy

### Summary

WebSocket delivery for live updates

### Goal

Push notifications to millions of users.

### Description

Build a real-time notification system using WebSockets. Learn about connection management, fan-out patterns, and handling millions of persistent connections.

### Functional Requirements

- Maintain WebSocket connections
- Push notifications instantly
- Handle connection drops/reconnects
- Support topic subscriptions
- Batch notifications for efficiency

### Non-Functional Requirements

- **Latency:** P95 < 50ms delivery time
- **Request Rate:** 100k notifications/sec
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **notification_rate:** 100000
- **concurrent_connections:** 1000000
- **topics_count:** 1000

### Available Components

- client
- lb
- app
- stream
- cache

### Hints

1. Use pub/sub for fan-out
2. Sticky sessions for WebSocket connections

### Tiers/Checkpoints

**T0: Connections**
  - Must include: stream

**T1: Scale**
  - Minimum 20 of type: app

### Reference Solution

Sticky load balancer ensures WebSocket reconnects to same server. Redis pub/sub enables cross-server messaging. Connection registry tracks user→server mapping. This teaches real-time delivery patterns.

**Components:**
- Connected Users (redirect_client)
- Sticky LB (lb)
- WebSocket Server (app)
- Redis Pub/Sub (stream)
- Connection Registry (cache)

**Connections:**
- Connected Users → Sticky LB
- Sticky LB → WebSocket Server
- WebSocket Server → Redis Pub/Sub
- WebSocket Server → Connection Registry

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 3. Basic Event Log Streaming

**ID:** basic-event-log
**Category:** streaming
**Difficulty:** Easy

### Summary

Stream application events

### Goal

Build a centralized event logging system.

### Description

Create a basic event log streaming system that collects application events from multiple services. Learn about log aggregation, structured logging, and basic analytics.

### Functional Requirements

- Collect events from multiple sources
- Parse structured log formats
- Store events for querying
- Support real-time monitoring
- Enable basic filtering and search

### Non-Functional Requirements

- **Latency:** P95 < 200ms for log ingestion
- **Request Rate:** 50k events/sec
- **Dataset Size:** 500GB daily logs
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **event_rate:** 50000
- **daily_volume_gb:** 500
- **retention_days:** 7

### Available Components

- client
- app
- stream
- db_primary
- search
- worker

### Hints

1. Use Fluentd/Logstash for collection
2. Elasticsearch for searching

### Tiers/Checkpoints

**T0: Storage**
  - Must include: search

**T1: Processing**
  - Must include: worker

### Reference Solution

Collectors aggregate 50k events/sec from services. Kafka with 34 partitions buffers for reliability (51k msg/s capacity). 63 workers parse and enrich logs (50.4k msg/s). Elasticsearch with 20 shards enables search and dashboards (24k read capacity). This teaches production-scale log streaming patterns.

**Components:**
- App Services (redirect_client)
- Log Collector (app)
- Kafka Stream (stream)
- Log Processor (worker)
- Elasticsearch (search)

**Connections:**
- App Services → Log Collector
- Log Collector → Kafka Stream
- Kafka Stream → Log Processor
- Log Processor → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 4. Simple Pub/Sub Notification

**ID:** simple-pubsub
**Category:** streaming
**Difficulty:** Easy

### Summary

Topic-based message routing

### Goal

Build a publish-subscribe notification system.

### Description

Implement a topic-based pub/sub system using Redis or RabbitMQ. Learn about topic filtering, fanout patterns, and subscription management.

### Functional Requirements

- Publish messages to topics
- Subscribe to multiple topics
- Filter by topic patterns
- Support wildcard subscriptions
- Handle subscriber backpressure

### Non-Functional Requirements

- **Latency:** P95 < 50ms delivery
- **Request Rate:** 10k messages/sec
- **Dataset Size:** 1M active subscriptions
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **message_rate:** 10000
- **topics:** 1000
- **subscribers:** 1000000

### Available Components

- client
- app
- stream
- cache
- worker

### Hints

1. Use topic hierarchy for filtering
2. Cache subscription mappings

### Tiers/Checkpoints

**T0: Subscribers**
  - Must include: worker

**T1: Registry**
  - Must include: cache

### Reference Solution

Publishers send to topics. Redis matches topics to subscribers. Cache stores subscription metadata. Workers consume and process messages. This teaches pub/sub fundamentals.

**Components:**
- Publishers (redirect_client)
- Pub API (app)
- Redis Pub/Sub (stream)
- Subscription Cache (cache)
- Subscribers (worker)

**Connections:**
- Publishers → Pub API
- Pub API → Redis Pub/Sub
- Redis Pub/Sub → Subscribers
- Pub API → Subscription Cache

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 5. Real-time Chat Messages

**ID:** realtime-chat-messages
**Category:** streaming
**Difficulty:** Easy

### Summary

Instant messaging system

### Goal

Build a Slack-like real-time chat.

### Description

Design a real-time chat messaging system with channels and direct messages. Learn about message ordering, online presence, and message persistence.

### Functional Requirements

- Send messages in real-time
- Support channels and DMs
- Show online presence
- Persist message history
- Handle message ordering

### Non-Functional Requirements

- **Latency:** P95 < 100ms message delivery
- **Request Rate:** 20k messages/sec
- **Dataset Size:** 10M messages/day
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **message_rate:** 20000
- **concurrent_users:** 100000
- **channels:** 50000

### Available Components

- client
- lb
- app
- stream
- db_primary
- cache

### Hints

1. WebSockets for real-time
2. Partition by channel for ordering

### Tiers/Checkpoints

**T0: Messaging**
  - Must include: stream

**T1: Persistence**
  - Must include: db_primary

### Reference Solution

WebSocket servers maintain connections. Messages flow through Kafka for ordering. Cache tracks online status. Cassandra stores history. This teaches real-time messaging patterns.

**Components:**
- Chat Users (redirect_client)
- WebSocket LB (lb)
- Chat Server (app)
- Message Bus (stream)
- Presence Cache (cache)
- Message DB (db_primary)

**Connections:**
- Chat Users → WebSocket LB
- WebSocket LB → Chat Server
- Chat Server → Message Bus
- Chat Server → Presence Cache
- Chat Server → Message DB
- Message Bus → Message DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 6. Click Stream Analytics

**ID:** clickstream-analytics
**Category:** streaming
**Difficulty:** Easy

### Summary

Track user clicks and behavior

### Goal

Build Google Analytics-style click tracking.

### Description

Create a clickstream analytics pipeline to track user interactions. Learn about event collection, sessionization, and real-time analytics.

### Functional Requirements

- Collect click events from web/mobile
- Track page views and interactions
- Sessionize user activity
- Generate real-time metrics
- Support custom event properties

### Non-Functional Requirements

- **Latency:** P95 < 500ms for ingestion
- **Request Rate:** 100k events/sec
- **Dataset Size:** 10B events/day
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **event_rate:** 100000
- **daily_events:** 10000000000
- **session_timeout_minutes:** 30

### Available Components

- client
- cdn
- app
- stream
- db_primary
- worker

### Hints

1. Batch events at edge
2. Use streaming windows for sessions

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Processing**
  - Must include: worker

### Reference Solution

Edge collectors batch events. Kafka handles 100k/sec ingestion. Workers sessionize using windowing. ClickHouse stores for analytics queries. This teaches web analytics patterns.

**Components:**
- Web/Mobile (redirect_client)
- Edge Collectors (cdn)
- Ingest API (app)
- Event Stream (stream)
- Sessionizer (worker)
- Analytics DB (db_primary)

**Connections:**
- Web/Mobile → Edge Collectors
- Edge Collectors → Ingest API
- Ingest API → Event Stream
- Event Stream → Sessionizer
- Sessionizer → Analytics DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 7. Server Log Aggregation

**ID:** server-log-aggregation
**Category:** streaming
**Difficulty:** Easy

### Summary

Centralize server logs

### Goal

Build ELK-style log aggregation.

### Description

Aggregate logs from thousands of servers into a central system. Learn about log shipping, parsing, indexing, and monitoring.

### Functional Requirements

- Ship logs from many servers
- Parse different log formats
- Index for fast searching
- Alert on error patterns
- Visualize with dashboards

### Non-Functional Requirements

- **Latency:** P95 < 5s from log to search
- **Request Rate:** 200k log lines/sec
- **Dataset Size:** 5TB logs/day
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **log_rate:** 200000
- **servers:** 5000
- **daily_volume_tb:** 5

### Available Components

- client
- app
- stream
- search
- worker

### Hints

1. Use Filebeat for shipping
2. Logstash for parsing

### Tiers/Checkpoints

**T0: Buffer**
  - Must include: stream

**T1: Index**
  - Must include: search

### Reference Solution

Filebeat ships logs from 5000 servers. Kafka buffers for reliability. Logstash parses and enriches. Elasticsearch enables search and alerting. This teaches log aggregation architecture.

**Components:**
- App Servers (redirect_client)
- Filebeat (app)
- Kafka Buffer (stream)
- Logstash (worker)
- Elasticsearch (search)

**Connections:**
- App Servers → Filebeat
- Filebeat → Kafka Buffer
- Kafka Buffer → Logstash
- Logstash → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 8. Sensor Data Collection

**ID:** sensor-data-collection
**Category:** streaming
**Difficulty:** Easy

### Summary

IoT sensor telemetry

### Goal

Collect data from millions of IoT sensors.

### Description

Build an IoT data collection pipeline for sensor telemetry. Learn about time-series data, downsampling, and handling device connectivity.

### Functional Requirements

- Ingest from millions of sensors
- Handle intermittent connectivity
- Store time-series data efficiently
- Support data aggregation
- Alert on anomalies

### Non-Functional Requirements

- **Latency:** P95 < 1s for critical sensors
- **Request Rate:** 500k readings/sec
- **Dataset Size:** 100TB time-series data
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **reading_rate:** 500000
- **sensor_count:** 10000000
- **reading_interval_sec:** 60

### Available Components

- client
- lb
- app
- stream
- db_primary
- worker

### Hints

1. Use MQTT for IoT protocol
2. TimescaleDB for time-series

### Tiers/Checkpoints

**T0: Ingestion**
  - Must include: stream

**T1: Storage**
  - Must include: db_primary

### Reference Solution

MQTT handles IoT protocol. Kafka streams telemetry. Workers downsample for efficiency. TimescaleDB optimized for time-series. This teaches IoT data pipeline patterns.

**Components:**
- IoT Sensors (redirect_client)
- MQTT Gateway (lb)
- Ingest Service (app)
- Telemetry Stream (stream)
- Downsampler (worker)
- TimescaleDB (db_primary)

**Connections:**
- IoT Sensors → MQTT Gateway
- MQTT Gateway → Ingest Service
- Ingest Service → Telemetry Stream
- Telemetry Stream → Downsampler
- Downsampler → TimescaleDB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 9. Email Queue System

**ID:** email-queue-system
**Category:** streaming
**Difficulty:** Easy

### Summary

Asynchronous email delivery

### Goal

Build a reliable bulk email system.

### Description

Design an email delivery queue system for transactional and marketing emails. Learn about rate limiting, retries, and bounce handling.

### Functional Requirements

- Queue emails for delivery
- Rate limit per domain
- Retry failed deliveries
- Handle bounces and complaints
- Track delivery status

### Non-Functional Requirements

- **Latency:** P95 < 30s for transactional
- **Request Rate:** 10k emails/sec
- **Dataset Size:** 100M emails/day
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **email_rate:** 10000
- **daily_volume:** 100000000
- **retry_attempts:** 3

### Available Components

- client
- app
- queue
- worker
- db_primary

### Hints

1. Separate queues by priority
2. Rate limit by recipient domain

### Tiers/Checkpoints

**T0: Queue**
  - Must include: queue

**T1: Workers**
  - Must include: worker

### Reference Solution

Separate queues for transactional vs bulk. Workers apply rate limits per domain. Database tracks delivery status and bounces. This teaches asynchronous email delivery patterns.

**Components:**
- Applications (redirect_client)
- Email API (app)
- Priority Queue (queue)
- Bulk Queue (queue)
- Sender Workers (worker)
- Status DB (db_primary)

**Connections:**
- Applications → Email API
- Email API → Priority Queue
- Email API → Bulk Queue
- Priority Queue → Sender Workers
- Bulk Queue → Sender Workers
- Sender Workers → Status DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 10. Event Sourcing Basics

**ID:** event-sourcing-basic
**Category:** streaming
**Difficulty:** Easy

### Summary

Store events instead of state

### Goal

Build an event-sourced order system.

### Description

Learn event sourcing by building an order management system that stores events instead of current state. Understand event replay, projections, and CQRS basics.

### Functional Requirements

- Store all state changes as events
- Rebuild state from event log
- Create read projections
- Support event replay
- Handle out-of-order events

### Non-Functional Requirements

- **Latency:** P95 < 100ms for reads
- **Request Rate:** 10k events/sec
- **Dataset Size:** 100M events
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **event_rate:** 10000
- **total_events:** 100000000
- **projection_count:** 5

### Available Components

- client
- app
- stream
- db_primary
- cache
- worker

### Hints

1. Events are immutable
2. Projections for fast reads

### Tiers/Checkpoints

**T0: Events**
  - Must include: stream

**T1: Projections**
  - Must include: cache

### Reference Solution

Commands generate events written to append-only log. Workers build projections for different read models. Event replay reconstructs state. This teaches event sourcing fundamentals.

**Components:**
- Order Service (redirect_client)
- Command API (app)
- Event Log (stream)
- Event Store (db_primary)
- Read Models (cache)
- Projection Builder (worker)

**Connections:**
- Order Service → Command API
- Command API → Event Log
- Event Log → Event Store
- Event Log → Projection Builder
- Projection Builder → Read Models
- Command API → Read Models

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 11. Order Processing Stream

**ID:** order-processing-stream
**Category:** streaming
**Difficulty:** Advanced

### Summary

Amazon-scale 100M orders/day processing

### Goal

Build Amazon-scale order processing.

### Description

Design an Amazon-scale order processing system handling 100M orders/day (1B during Prime Day). Must coordinate inventory across 500+ fulfillment centers, process payments with <500ms latency, survive payment provider failures, and maintain perfect order accuracy. Support distributed sagas, real-time fraud detection, same-day delivery orchestration, and operate within $100M/month budget.

### Functional Requirements

- Process 100M orders/day (1B during Prime Day)
- Coordinate inventory across 500+ fulfillment centers
- Distributed saga pattern for multi-step transactions
- Real-time fraud detection on all orders
- Same-day delivery orchestration for 50M+ orders
- Handle 10M concurrent shopping carts
- Support 100+ payment methods globally
- Automatic rollback and compensation for failures

### Non-Functional Requirements

- **Latency:** P99 < 500ms order confirmation, P99.9 < 1s
- **Request Rate:** 1.2M orders/sec during Prime Day
- **Dataset Size:** 10B historical orders, 1B products
- **Availability:** 99.999% uptime, zero duplicate orders

### Constants/Assumptions

- **l4_enhanced:** true
- **order_rate:** 1200000
- **spike_multiplier:** 10
- **avg_order_value:** 100
- **daily_orders:** 100000000
- **fulfillment_centers:** 500
- **cache_hit_target:** 0.99
- **budget_monthly:** 100000000

### Available Components

- client
- lb
- app
- stream
- db_primary
- worker
- queue

### Hints

1. Saga pattern for distributed transactions
2. Event-driven state machine

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Workers**
  - Minimum 10 of type: worker

**T2: State**
  - Must include: db_primary

### Reference Solution

Orders published to Kafka with 50 partitions. Separate workers for inventory, payment, fulfillment orchestrated via saga. State stored in PostgreSQL. Compensating transactions handle failures. This teaches order processing pipelines.

**Components:**
- Customers (redirect_client)
- Load Balancer (lb)
- Order API (app)
- Order Events (stream)
- Inventory (worker)
- Payment (worker)
- Fulfillment (worker)
- Order DB (db_primary)

**Connections:**
- Customers → Load Balancer
- Load Balancer → Order API
- Order API → Order Events
- Order Events → Inventory
- Order Events → Payment
- Order Events → Fulfillment
- Inventory → Order DB
- Payment → Order DB
- Fulfillment → Order DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,200,000 QPS, the system uses 1200 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $5000

*Peak Load:*
During 10x traffic spikes (12,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 12,000,000 requests/sec
- Cost/Hour: $50000

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $5,520,000
- Yearly Total: $66,240,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,600,000 (1200 × $100/month per instance)
- Storage: $1,200,000 (Database storage + backup + snapshots)
- Network: $600,000 (Ingress/egress + CDN distribution)

---

## 12. Payment Transaction Log

**ID:** payment-transaction-log
**Category:** streaming
**Difficulty:** Advanced

### Summary

Visa/Mastercard-scale 50B transactions/day

### Goal

Build Visa-scale payment processing.

### Description

Design a Visa/Mastercard-scale payment system processing 50B transactions/day globally with <10ms P99 latency. Must handle Black Friday spikes (500B transactions), maintain perfect financial accuracy, survive entire continent failures, and meet PCI-DSS compliance. Support real-time settlement across 10k+ banks, fraud detection on every transaction, and operate within $200M/month budget while ensuring zero financial loss.

### Functional Requirements

- Process 50B transactions/day (500B during Black Friday)
- Real-time settlement with 10k+ banks globally
- Immutable audit trail with 10-year retention
- Real-time fraud detection with <10ms latency
- Support 200+ currencies with real-time FX
- Distributed ledger with perfect consistency
- Handle chargebacks and dispute resolution
- Comply with GDPR, PCI-DSS, SOC2, ISO27001

### Non-Functional Requirements

- **Latency:** P99 < 10ms authorization, P99.9 < 25ms
- **Request Rate:** 580k transactions/sec normal, 5.8M during spikes
- **Dataset Size:** 10PB daily logs, 100PB historical, 10-year retention
- **Data Durability:** 11 nines durability, zero financial loss
- **Availability:** 99.9999% uptime (31 seconds downtime/year)

### Constants/Assumptions

- **l4_enhanced:** true
- **transaction_rate:** 580000
- **spike_multiplier:** 10
- **avg_transaction_value:** 50
- **retention_years:** 10
- **bank_partners:** 10000
- **cache_hit_target:** 0.999
- **budget_monthly:** 200000000

### Available Components

- client
- app
- stream
- db_primary
- worker
- cache

### Hints

1. Append-only log for audit
2. Stream processing for fraud

### Tiers/Checkpoints

**T0: Logging**
  - Must include: stream

**T1: Fraud**
  - Must include: worker

**T2: Persistence**
  - Must include: db_primary

### Reference Solution

All transactions logged to immutable stream. Fraud detector analyzes patterns in real-time. Ledger DB provides ACID guarantees. Cache speeds up lookups. This teaches financial transaction logging.

**Components:**
- Payment Requests (redirect_client)
- Payment Gateway (app)
- Transaction Log (stream)
- Fraud Detector (worker)
- Ledger DB (db_primary)
- Transaction Cache (cache)

**Connections:**
- Payment Requests → Payment Gateway
- Payment Gateway → Transaction Log
- Transaction Log → Fraud Detector
- Transaction Log → Ledger DB
- Fraud Detector → Transaction Cache

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 580,000 QPS, the system uses 580 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 580,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2417

*Peak Load:*
During 10x traffic spikes (5,800,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,800,000 requests/sec
- Cost/Hour: $24167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,668,000
- Yearly Total: $32,016,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,740,000 (580 × $100/month per instance)
- Storage: $580,000 (Database storage + backup + snapshots)
- Network: $290,000 (Ingress/egress + CDN distribution)

---

## 13. Stock Price Updates

**ID:** stock-price-updates
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Real-time market data feed

### Goal

Build Bloomberg-style price streaming.

### Description

Stream real-time stock price updates to traders and systems. Learn about low-latency distribution, market data protocols, and fan-out patterns.

### Functional Requirements

- Stream tick-by-tick price data
- Support thousands of symbols
- Enable subscription filtering
- Provide historical replay
- Calculate technical indicators
- Handle market data gaps

### Non-Functional Requirements

- **Latency:** P99 < 10ms for price updates
- **Request Rate:** 1M ticks/sec
- **Dataset Size:** 50TB daily market data
- **Availability:** 99.99% during market hours

### Constants/Assumptions

- **tick_rate:** 1000000
- **symbols:** 10000
- **subscribers:** 100000

### Available Components

- client
- lb
- app
- stream
- cache
- db_primary

### Hints

1. In-memory pub/sub for low latency
2. Partition by symbol

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Cache**
  - Must include: cache

**T2: Scale**
  - Minimum 100 of type: app

### Reference Solution

Feed handlers normalize exchange protocols. Redis Streams partition by symbol for ordering. Cache provides last price lookups. WebSocket servers fan out to subscribers. This teaches market data distribution.

**Components:**
- Exchanges (redirect_client)
- Feed Handler (app)
- Price Stream (stream)
- Last Price Cache (cache)
- WebSocket Servers (app)
- Tick DB (db_primary)

**Connections:**
- Exchanges → Feed Handler
- Feed Handler → Price Stream
- Price Stream → Last Price Cache
- Price Stream → WebSocket Servers
- Price Stream → Tick DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 14. Social Media Feed

**ID:** social-media-feed
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Twitter/Instagram feed generation

### Goal

Build personalized social feeds at scale.

### Description

Generate personalized social media feeds with posts from followed users. Learn about fan-out patterns, feed ranking, and real-time updates.

### Functional Requirements

- Aggregate posts from followees
- Rank by relevance and recency
- Support real-time updates
- Handle viral content efficiently
- Personalize per user
- Cache popular content

### Non-Functional Requirements

- **Latency:** P95 < 300ms for feed generation
- **Request Rate:** 500k feed requests/sec
- **Dataset Size:** 1B users, 100M posts/day
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **feed_requests_per_sec:** 500000
- **avg_followees:** 200
- **posts_per_day:** 100000000

### Available Components

- client
- lb
- app
- stream
- cache
- db_primary
- worker

### Hints

1. Hybrid push-pull fan-out
2. Pre-compute feeds for active users

### Tiers/Checkpoints

**T0: Fanout**
  - Must include: stream

**T1: Cache**
  - Must include: cache

**T2: Ranking**
  - Must include: worker

### Reference Solution

New posts stream to fan-out workers. Workers pre-compute feeds for active users. Cache serves 70% from memory. Pull-based for celebrities. This teaches social feed generation patterns.

**Components:**
- App Users (redirect_client)
- Load Balancer (lb)
- Feed API (app)
- Feed Cache (cache)
- Post Stream (stream)
- Feed Builder (worker)
- Social Graph (db_primary)

**Connections:**
- App Users → Load Balancer
- Load Balancer → Feed API
- Feed API → Feed Cache
- Feed API → Post Stream
- Post Stream → Feed Builder
- Feed Builder → Feed Cache
- Feed Builder → Social Graph

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 15. Video Upload Pipeline

**ID:** video-upload-pipeline
**Category:** streaming
**Difficulty:** Advanced

### Summary

YouTube-scale 500k hours/day processing

### Goal

Build YouTube-scale video pipeline.

### Description

Design a YouTube-scale video processing pipeline handling 500k hours of uploads daily (2M during viral events). Must transcode to 20+ formats in <2 minutes for 4K videos, support live streaming to 100M viewers, survive datacenter failures, and operate within $50M/month budget. Include ML content moderation, automatic quality optimization, and copyright detection across 1B+ reference videos.

### Functional Requirements

- Process 500k hours of video daily (2M during viral events)
- Transcode to 20+ formats in <2min for 4K videos
- Support 100M concurrent live stream viewers
- ML-based content moderation and copyright detection
- Detect copyrighted content against 1B+ references
- Adaptive bitrate streaming based on network
- Generate AI highlights and auto-chapters
- Distributed transcoding across 10k+ GPU nodes

### Non-Functional Requirements

- **Latency:** P99 < 2min for 4K transcode, <10s live streaming delay
- **Request Rate:** 500k hours/day uploads, 100M concurrent streams
- **Dataset Size:** 100PB raw videos, 1EB with all formats
- **Availability:** 99.99% uptime, zero data loss guarantee

### Constants/Assumptions

- **l4_enhanced:** true
- **upload_rate_per_hour:** 20833
- **spike_multiplier:** 4
- **avg_video_size_gb:** 10
- **transcode_formats:** 20
- **concurrent_viewers:** 100000000
- **gpu_nodes:** 10000
- **budget_monthly:** 50000000

### Available Components

- client
- cdn
- lb
- app
- stream
- queue
- worker
- db_primary

### Hints

1. S3 for blob storage
2. Parallel transcoding

### Tiers/Checkpoints

**T0: Queue**
  - Must include: queue

**T1: Workers**
  - Minimum 50 of type: worker

**T2: Storage**
  - Must include: db_primary

### Reference Solution

Videos uploaded to S3 via CDN. Jobs queued for processing. Workers transcode in parallel. Thumbnails generated separately. Completion events trigger notifications. This teaches video processing pipelines.

**Components:**
- Content Creators (redirect_client)
- Upload CDN (cdn)
- Upload API (app)
- Job Queue (queue)
- Transcoders (worker)
- Thumbnail Gen (worker)
- Object Storage (db_primary)
- Completion Events (stream)

**Connections:**
- Content Creators → Upload CDN
- Upload CDN → Upload API
- Upload API → Job Queue
- Job Queue → Transcoders
- Job Queue → Thumbnail Gen
- Transcoders → Object Storage
- Thumbnail Gen → Object Storage
- Transcoders → Completion Events

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 16. Fraud Detection Stream

**ID:** fraud-detection-stream
**Category:** streaming
**Difficulty:** Advanced

### Summary

PayPal/Stripe-scale fraud detection at 10M TPS

### Goal

Build PayPal-scale real-time fraud detection.

### Description

Design a PayPal/Stripe-scale fraud detection system processing 10M transactions/sec globally with <5ms P99 latency. Must handle Black Friday spikes (100M TPS), detect sophisticated fraud rings using graph analysis, survive entire region failures, and maintain <0.01% false positive rate. Support 1000+ ML models, real-time feature computation across 100B+ historical transactions, and operate within $5M/month budget.

### Functional Requirements

- Process 10M transactions/sec (100M during Black Friday)
- Score with <5ms P99 latency using 1000+ ML models
- Graph analysis for fraud ring detection across 1B+ entities
- Real-time feature computation from 100B+ transaction history
- Support 100+ payment methods and currencies
- Automatic model retraining when drift detected >2%
- Coordinate global blocklists across 50+ countries
- Handle chargebacks and dispute resolution workflows

### Non-Functional Requirements

- **Latency:** P99 < 5ms scoring, P99.9 < 10ms during spikes
- **Request Rate:** 10M transactions/sec normal, 100M during Black Friday
- **Dataset Size:** 100B transactions, 1B user profiles, 10PB feature store
- **Availability:** 99.999% uptime, zero false negatives for high-risk

### Constants/Assumptions

- **l4_enhanced:** true
- **transaction_rate:** 10000000
- **spike_multiplier:** 10
- **fraud_rate:** 0.001
- **models:** 1000
- **feature_dimensions:** 10000
- **cache_hit_target:** 0.999
- **budget_monthly:** 5000000

### Available Components

- client
- app
- stream
- worker
- cache
- db_primary

### Hints

1. Feature store for user behavior
2. A/B test fraud models

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: ML**
  - Must include: worker

**T2: Features**
  - Must include: cache

### Reference Solution

Transactions stream for real-time scoring. Workers extract features from cache and apply ML models. Suspicious transactions blocked immediately. Feature store updated asynchronously. This teaches fraud detection patterns.

**Components:**
- Transactions (redirect_client)
- Transaction API (app)
- Transaction Stream (stream)
- Feature Store (cache)
- Fraud Scorer (worker)
- Fraud DB (db_primary)

**Connections:**
- Transactions → Transaction API
- Transaction API → Transaction Stream
- Transaction Stream → Fraud Scorer
- Fraud Scorer → Feature Store
- Fraud Scorer → Fraud DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 17. User Activity Tracking

**ID:** user-activity-tracking
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Track user behavior across app

### Goal

Build Mixpanel-style analytics.

### Description

Create a user activity tracking system for product analytics. Learn about event schemas, user profiles, funnels, and cohort analysis.

### Functional Requirements

- Track user events across platforms
- Build user profiles
- Calculate funnel metrics
- Segment users into cohorts
- Support A/B test analysis
- Generate behavioral insights

### Non-Functional Requirements

- **Latency:** P95 < 1s for event ingestion
- **Request Rate:** 300k events/sec
- **Dataset Size:** 50M active users
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **event_rate:** 300000
- **active_users:** 50000000
- **events_per_user_per_day:** 100

### Available Components

- client
- cdn
- app
- stream
- db_primary
- worker
- cache

### Hints

1. Batch events at client
2. Pre-aggregate metrics

### Tiers/Checkpoints

**T0: Ingestion**
  - Must include: stream

**T1: Processing**
  - Must include: worker

**T2: Analytics**
  - Must include: db_primary

### Reference Solution

Events batched at edge and streamed to Kafka. Profile builders maintain user state. Metric aggregators pre-compute funnels. ClickHouse enables OLAP queries. This teaches product analytics architecture.

**Components:**
- Mobile/Web Apps (redirect_client)
- Edge Collectors (cdn)
- Tracking API (app)
- Event Stream (stream)
- Profile Builder (worker)
- Metric Aggregator (worker)
- Analytics DB (db_primary)

**Connections:**
- Mobile/Web Apps → Edge Collectors
- Edge Collectors → Tracking API
- Tracking API → Event Stream
- Event Stream → Profile Builder
- Event Stream → Metric Aggregator
- Profile Builder → Analytics DB
- Metric Aggregator → Analytics DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 300,000 QPS, the system uses 300 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 300,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $1250

*Peak Load:*
During 10x traffic spikes (3,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 3,000,000 requests/sec
- Cost/Hour: $12500

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $1,380,000
- Yearly Total: $16,560,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $900,000 (300 × $100/month per instance)
- Storage: $300,000 (Database storage + backup + snapshots)
- Network: $150,000 (Ingress/egress + CDN distribution)

---

## 18. IoT Telemetry Aggregation

**ID:** iot-telemetry-aggregation
**Category:** streaming
**Difficulty:** Advanced

### Summary

Tesla/AWS-scale IoT with 1B+ devices

### Goal

Build Tesla-scale global IoT platform.

### Description

Design a Tesla/AWS IoT-scale platform handling 100M messages/sec from 1B+ devices globally. Must handle entire fleet OTA updates (10x traffic), maintain <100ms P99 latency for critical telemetry, survive multiple region failures, and detect anomalies across millions of autonomous vehicles. Support edge computing, real-time ML inference, and operate within $10M/month budget while processing 10PB daily telemetry.

### Functional Requirements

- Ingest 100M messages/sec from 1B+ devices (1B during OTA)
- Real-time anomaly detection across fleet with ML models
- Edge computing for 100ms decision making in vehicles
- Support OTA updates to entire fleet within 1 hour
- Hierarchical aggregation (device→edge→region→global)
- Process video streams from 10M+ cameras
- Coordinate swarm intelligence for autonomous fleets
- Predictive maintenance using telemetry patterns

### Non-Functional Requirements

- **Latency:** P99 < 100ms for critical telemetry, P99.9 < 500ms
- **Request Rate:** 100M messages/sec normal, 1B during fleet updates
- **Dataset Size:** 1B devices, 10PB daily telemetry, 100PB historical
- **Availability:** 99.999% for safety-critical data

### Constants/Assumptions

- **l4_enhanced:** true
- **reading_rate:** 100000000
- **spike_multiplier:** 10
- **device_count:** 1000000000
- **reading_interval_sec:** 1
- **edge_locations:** 10000
- **cache_hit_target:** 0.99
- **budget_monthly:** 10000000

### Available Components

- client
- lb
- app
- stream
- worker
- db_primary
- cache

### Hints

1. Use MQTT for IoT
2. Window aggregation for downsampling

### Tiers/Checkpoints

**T0: Ingestion**
  - Must include: stream

**T1: Aggregation**
  - Must include: worker

**T2: Storage**
  - Must include: db_primary

### Reference Solution

MQTT handles IoT protocol at scale. Kafka streams telemetry with 100 partitions. Workers aggregate by time windows and detect anomalies. TimescaleDB optimized for time-series queries. This teaches IoT platform architecture.

**Components:**
- IoT Devices (redirect_client)
- MQTT Broker (lb)
- Gateway Service (app)
- Telemetry Stream (stream)
- Aggregators (worker)
- Anomaly Detector (worker)
- TimescaleDB (db_primary)

**Connections:**
- IoT Devices → MQTT Broker
- MQTT Broker → Gateway Service
- Gateway Service → Telemetry Stream
- Telemetry Stream → Aggregators
- Telemetry Stream → Anomaly Detector
- Aggregators → TimescaleDB
- Anomaly Detector → TimescaleDB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 19. Game Event Processing

**ID:** game-event-processing
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Process game telemetry events

### Goal

Build game analytics pipeline.

### Description

Process game events for leaderboards, achievements, and analytics. Learn about high-volume event processing, state management, and real-time rankings.

### Functional Requirements

- Process player actions in real-time
- Update leaderboards
- Award achievements
- Detect cheating
- Track player progression
- Generate live analytics

### Non-Functional Requirements

- **Latency:** P95 < 100ms for rankings
- **Request Rate:** 500k events/sec
- **Dataset Size:** 10M concurrent players
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **event_rate:** 500000
- **concurrent_players:** 10000000
- **events_per_session:** 1000

### Available Components

- client
- lb
- app
- stream
- worker
- cache
- db_primary

### Hints

1. Redis sorted sets for leaderboards
2. Stateful stream processing

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Processing**
  - Must include: worker

**T2: Leaderboard**
  - Must include: cache

### Reference Solution

Game events stream to Kafka. Workers maintain player state and update leaderboards. Redis sorted sets provide O(log N) ranking. Achievements awarded in real-time. This teaches game event processing.

**Components:**
- Game Clients (redirect_client)
- Game LB (lb)
- Game Servers (app)
- Event Stream (stream)
- Event Processor (worker)
- Leaderboard Cache (cache)
- Player DB (db_primary)

**Connections:**
- Game Clients → Game LB
- Game LB → Game Servers
- Game Servers → Event Stream
- Event Stream → Event Processor
- Event Processor → Leaderboard Cache
- Event Processor → Player DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 20. Delivery Tracking Updates

**ID:** delivery-tracking-updates
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Track package locations in real-time

### Goal

Build UPS-style package tracking.

### Description

Stream delivery location updates and ETAs to customers. Learn about geospatial tracking, ETA calculation, and notification triggers.

### Functional Requirements

- Track package locations
- Calculate real-time ETAs
- Notify on status changes
- Handle route updates
- Support delivery proof
- Generate delivery analytics

### Non-Functional Requirements

- **Latency:** P95 < 500ms for location updates
- **Request Rate:** 100k updates/sec
- **Dataset Size:** 50M active deliveries
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **update_rate:** 100000
- **active_deliveries:** 50000000
- **update_interval_sec:** 60

### Available Components

- client
- app
- stream
- worker
- cache
- db_primary

### Hints

1. Geospatial indexing
2. Real-time ETA with traffic data

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: ETA**
  - Must include: worker

**T2: Cache**
  - Must include: cache

### Reference Solution

Location updates stream from drivers. Workers calculate ETAs using traffic data. Cache provides fast lookups. Geospatial queries find nearby deliveries. This teaches delivery tracking patterns.

**Components:**
- Delivery Drivers (redirect_client)
- Tracking API (app)
- Location Stream (stream)
- ETA Calculator (worker)
- Location Cache (cache)
- Delivery DB (db_primary)

**Connections:**
- Delivery Drivers → Tracking API
- Tracking API → Location Stream
- Location Stream → ETA Calculator
- Location Stream → Location Cache
- ETA Calculator → Delivery DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 21. Notification Fan-out

**ID:** notification-fanout
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Broadcast notifications to millions

### Goal

Build Airbnb-style notification system.

### Description

Fan out notifications to millions of users across multiple channels (email, push, SMS). Learn about channel preferences, batching, and rate limiting.

### Functional Requirements

- Support multiple channels
- Respect user preferences
- Batch similar notifications
- Rate limit per channel
- Track delivery status
- Handle failures with retries

### Non-Functional Requirements

- **Latency:** P95 < 5s for fan-out
- **Request Rate:** 50k notifications/sec
- **Dataset Size:** 500M users
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **notification_rate:** 50000
- **total_users:** 500000000
- **channels:** 4

### Available Components

- client
- app
- stream
- queue
- worker
- cache
- db_primary

### Hints

1. Separate queues per channel
2. Batch for efficiency

### Tiers/Checkpoints

**T0: Fanout**
  - Must include: stream

**T1: Channels**
  - Minimum 3 of type: queue

**T2: Delivery**
  - Must include: worker

### Reference Solution

Fanout workers expand to per-user notifications. Separate queues per channel with independent rate limits. Batching reduces API calls. Delivery workers handle retries. This teaches notification fan-out patterns.

**Components:**
- Services (redirect_client)
- Notification API (app)
- Fanout Stream (stream)
- Fanout Worker (worker)
- Email Queue (queue)
- Push Queue (queue)
- SMS Queue (queue)
- Delivery Workers (worker)

**Connections:**
- Services → Notification API
- Notification API → Fanout Stream
- Fanout Stream → Fanout Worker
- Fanout Worker → Email Queue
- Fanout Worker → Push Queue
- Fanout Worker → SMS Queue
- Email Queue → Delivery Workers
- Push Queue → Delivery Workers
- SMS Queue → Delivery Workers

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 22. Content Moderation Queue

**ID:** content-moderation-queue
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Moderate user-generated content

### Goal

Build Facebook-style content moderation.

### Description

Queue and process user-generated content through automated and human moderation. Learn about prioritization, SLA management, and feedback loops.

### Functional Requirements

- Queue content for review
- Apply automated filters
- Route to human moderators
- Prioritize by urgency
- Track SLA compliance
- Support appeals process

### Non-Functional Requirements

- **Latency:** P95 < 15min for high-priority
- **Request Rate:** 100k submissions/sec
- **Dataset Size:** 1B pieces of content/day
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **submission_rate:** 100000
- **daily_content:** 1000000000
- **automated_pass_rate:** 0.95

### Available Components

- client
- app
- stream
- queue
- worker
- db_primary
- cache

### Hints

1. ML for first-pass filtering
2. Priority queues for urgency

### Tiers/Checkpoints

**T0: Automated**
  - Must include: worker

**T1: Queue**
  - Minimum 3 of type: queue

**T2: Human**
  - Must include: app

### Reference Solution

ML classifier auto-approves 95% of content. Remaining 5% routed to human moderators via priority queues. Urgent content reviewed first. Feedback loop retrains models. This teaches content moderation pipelines.

**Components:**
- Content Creators (redirect_client)
- Upload API (app)
- Content Stream (stream)
- ML Classifier (worker)
- High Priority (queue)
- Medium Priority (queue)
- Low Priority (queue)
- Moderator UI (app)
- Content DB (db_primary)

**Connections:**
- Content Creators → Upload API
- Upload API → Content Stream
- Content Stream → ML Classifier
- ML Classifier → High Priority
- ML Classifier → Medium Priority
- ML Classifier → Low Priority
- High Priority → Moderator UI
- Medium Priority → Moderator UI
- Low Priority → Moderator UI
- Moderator UI → Content DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 23. Search Index Updates

**ID:** search-index-updates
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Real-time search index maintenance

### Goal

Keep search indexes fresh with document changes.

### Description

Stream document changes to search indexes in near real-time. Learn about incremental indexing, consistency, and search ranking updates.

### Functional Requirements

- Stream document changes
- Update indexes incrementally
- Maintain search consistency
- Reindex on schema changes
- Update ranking signals
- Support rollback on errors

### Non-Functional Requirements

- **Latency:** P95 < 5s from update to searchable
- **Request Rate:** 50k document changes/sec
- **Dataset Size:** 10B documents
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **change_rate:** 50000
- **total_documents:** 10000000000
- **index_shards:** 100

### Available Components

- client
- app
- stream
- worker
- search
- db_primary

### Hints

1. CDC for document changes
2. Batch updates to Elasticsearch

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Indexer**
  - Must include: worker

**T2: Search**
  - Must include: search

### Reference Solution

CDC captures document changes from database. Changes stream to index workers. Workers batch updates to Elasticsearch. Partitioning ensures ordering per document. This teaches real-time search indexing.

**Components:**
- Services (redirect_client)
- Document API (app)
- Source DB (db_primary)
- Change Stream (stream)
- Index Workers (worker)
- Elasticsearch (search)

**Connections:**
- Services → Document API
- Document API → Source DB
- Source DB → Change Stream
- Change Stream → Index Workers
- Index Workers → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 24. Recommendation Pipeline

**ID:** recommendation-pipeline
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Netflix-style recommendations

### Goal

Generate personalized recommendations in real-time.

### Description

Build a recommendation pipeline using user activity streams and ML models. Learn about feature extraction, model serving, and A/B testing.

### Functional Requirements

- Track user interactions
- Extract behavioral features
- Serve ML recommendations
- A/B test models
- Update models incrementally
- Cache recommendations

### Non-Functional Requirements

- **Latency:** P95 < 100ms for recommendations
- **Request Rate:** 200k requests/sec
- **Dataset Size:** 100M users, 1M items
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **request_rate:** 200000
- **users:** 100000000
- **items:** 1000000

### Available Components

- client
- lb
- app
- stream
- worker
- cache
- db_primary

### Hints

1. Precompute for popular items
2. Real-time for personalization

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: ML**
  - Must include: worker

**T2: Cache**
  - Must include: cache

### Reference Solution

User activity streams to feature extractors. ML workers serve collaborative filtering models. Recommendations cached for 80% hit rate. Feature store updated in real-time. This teaches recommendation systems.

**Components:**
- App Users (redirect_client)
- Load Balancer (lb)
- Recommendation API (app)
- Recommendation Cache (cache)
- Activity Stream (stream)
- ML Serving (worker)
- Feature Store (db_primary)

**Connections:**
- App Users → Load Balancer
- Load Balancer → Recommendation API
- Recommendation API → Recommendation Cache
- Recommendation API → Activity Stream
- Activity Stream → ML Serving
- ML Serving → Recommendation Cache
- ML Serving → Feature Store

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 25. Audit Log Streaming

**ID:** audit-log-streaming
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Compliance audit trail

### Goal

Build immutable audit log system.

### Description

Stream audit logs for compliance and security monitoring. Learn about immutability, encryption, retention policies, and log correlation.

### Functional Requirements

- Capture all system actions
- Ensure log immutability
- Encrypt sensitive data
- Support compliance queries
- Archive to cold storage
- Detect security anomalies

### Non-Functional Requirements

- **Latency:** P95 < 1s for log ingestion
- **Request Rate:** 500k audit events/sec
- **Dataset Size:** 100TB logs, 7-year retention
- **Data Durability:** 11 nines durability
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **audit_rate:** 500000
- **retention_years:** 7
- **daily_volume_tb:** 40

### Available Components

- client
- app
- stream
- worker
- db_primary
- cache

### Hints

1. Append-only storage
2. WORM for compliance

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Processing**
  - Must include: worker

**T2: Storage**
  - Minimum 2 of type: db_primary

### Reference Solution

All actions logged to immutable stream. Hot storage for recent logs. Cold archive (S3 Glacier) for compliance. Anomaly detector identifies security threats. Encryption at rest and in transit. This teaches audit log architecture.

**Components:**
- All Services (redirect_client)
- Audit Collector (app)
- Audit Stream (stream)
- Log Processor (worker)
- Anomaly Detector (worker)
- Hot Storage (db_primary)
- Cold Archive (db_primary)

**Connections:**
- All Services → Audit Collector
- Audit Collector → Audit Stream
- Audit Stream → Log Processor
- Audit Stream → Anomaly Detector
- Log Processor → Hot Storage
- Log Processor → Cold Archive

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 26. Kafka Streaming Pipeline

**ID:** kafka-streaming-pipeline
**Category:** streaming
**Difficulty:** Intermediate

### Summary

Process billions of events with Kafka

### Goal

Build LinkedIn-scale event processing.

### Description

Design a Kafka-based streaming pipeline processing billions of events daily. Learn about partitioning strategies, consumer groups, exactly-once semantics, and stream processing with Kafka Streams.

### Functional Requirements

- Ingest 1B events per day
- Process with exactly-once semantics
- Support stream joins and aggregations
- Handle late-arriving data
- Provide real-time analytics
- Support event replay for reprocessing

### Non-Functional Requirements

- **Latency:** P95 < 100ms end-to-end
- **Request Rate:** 100k events/sec peak
- **Dataset Size:** 30 days retention, 30TB
- **Availability:** 99.95% uptime
- **Consistency:** Exactly-once processing

### Constants/Assumptions

- **peak_rate:** 100000
- **daily_events:** 1000000000
- **retention_days:** 30
- **partition_count:** 100

### Available Components

- client
- lb
- app
- stream
- db_primary
- cache
- worker

### Hints

1. Partition by key for ordering
2. Use Kafka Streams for processing

### Tiers/Checkpoints

**T0: Kafka**
  - Parameter range check: stream.partitions

**T1: Processing**
  - Must include: worker

**T2: Analytics**
  - Must include: cache

### Reference Solution

Kafka with 100 partitions handles 100k events/sec. Stream processors perform stateful operations with RocksDB. Exactly-once via transactional producers. Analytics engine generates real-time metrics. This teaches distributed stream processing.

**Components:**
- Event Producers (redirect_client)
- Producer API (app)
- Kafka Cluster (stream)
- Stream Processor (worker)
- Analytics Engine (worker)
- State Store (cache)
- Analytics DB (db_primary)

**Connections:**
- Event Producers → Producer API
- Producer API → Kafka Cluster
- Kafka Cluster → Stream Processor
- Kafka Cluster → Analytics Engine
- Stream Processor → State Store
- Analytics Engine → Analytics DB
- Analytics Engine → State Store

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 27. Exactly-Once Payment Processing

**ID:** exactly-once-payment
**Category:** streaming
**Difficulty:** Advanced

### Summary

Guarantee exactly-once payment semantics

### Goal

Build payments with zero duplicates or losses.

### Description

Implement exactly-once payment processing across distributed systems. Learn about idempotency keys, distributed transactions, and two-phase commit.

### Functional Requirements

- Guarantee exactly-once payment execution
- Handle network failures gracefully
- Support distributed transactions
- Maintain strict ordering
- Enable idempotent retries
- Provide strong consistency
- Track transaction state
- Support rollback on failure

### Non-Functional Requirements

- **Latency:** P95 < 500ms for payments
- **Request Rate:** 50k payments/sec
- **Dataset Size:** 10B transactions/year
- **Availability:** 99.999% uptime
- **Consistency:** Exactly-once guarantee

### Constants/Assumptions

- **payment_rate:** 50000
- **yearly_transactions:** 10000000000
- **avg_amount:** 100
- **dedup_window_hours:** 24

### Available Components

- client
- lb
- app
- stream
- db_primary
- cache
- worker
- queue

### Hints

1. Idempotency keys for deduplication
2. Two-phase commit for distributed transactions

### Tiers/Checkpoints

**T0: Idempotency**
  - Must include: cache

**T1: Stream**
  - Must include: stream

**T2: Coordination**
  - Minimum 20 of type: worker

**T3: State**
  - Must include: db_primary

### Reference Solution

Idempotency cache deduplicates requests. Kafka with transactional producer ensures exactly-once. Two-phase commit via coordinators. Ledger DB provides ACID. This teaches exactly-once semantics at scale.

**Components:**
- Payment Requests (redirect_client)
- Load Balancer (lb)
- Payment Gateway (app)
- Idempotency Cache (cache)
- Transaction Log (stream)
- Coordinators (worker)
- Ledger DB (db_primary)
- Settlement Queue (queue)

**Connections:**
- Payment Requests → Load Balancer
- Load Balancer → Payment Gateway
- Payment Gateway → Idempotency Cache
- Payment Gateway → Transaction Log
- Transaction Log → Coordinators
- Coordinators → Ledger DB
- Coordinators → Settlement Queue

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 28. Global Event Sourcing

**ID:** global-event-sourcing-system
**Category:** streaming
**Difficulty:** Advanced

### Summary

Distributed event sourcing across continents

### Goal

Build event sourcing across multiple regions.

### Description

Design a globally distributed event sourcing system with regional event stores and cross-region replication. Handle conflicts, maintain causality, and support point-in-time queries globally.

### Functional Requirements

- Store events across regions
- Maintain causal ordering
- Replicate events globally
- Resolve conflicts with CRDTs
- Support global queries
- Enable regional projections
- Provide point-in-time recovery
- Handle network partitions

### Non-Functional Requirements

- **Latency:** P95 < 100ms regional, < 1s cross-region
- **Request Rate:** 200k events/sec globally
- **Dataset Size:** 500TB event history
- **Availability:** 99.99% per region
- **Consistency:** Eventual consistency < 5s

### Constants/Assumptions

- **event_rate:** 200000
- **regions:** 5
- **total_events_tb:** 500
- **replication_lag_ms:** 5000

### Available Components

- client
- cdn
- lb
- app
- stream
- db_primary
- db_replica
- cache
- worker

### Hints

1. Vector clocks for causality
2. CRDTs for conflict resolution

### Tiers/Checkpoints

**T0: Regional**
  - Minimum 5 of type: stream

**T1: Replication**
  - Minimum 20 of type: worker

**T2: Projections**
  - Must include: cache

**T3: Coordination**
  - Must include: db_replica

### Reference Solution

Regional event stores with local writes. Replicators propagate events globally with vector clocks. CRDTs resolve conflicts. Global catalog tracks event locations. This teaches distributed event sourcing.

**Components:**
- Global Apps (redirect_client)
- GeoDNS (cdn)
- Regional LBs (lb)
- Event APIs (app)
- Regional Stores (stream)
- Replicators (worker)
- Projections (cache)
- Global Catalog (db_primary)

**Connections:**
- Global Apps → GeoDNS
- GeoDNS → Regional LBs
- Regional LBs → Event APIs
- Event APIs → Regional Stores
- Regional Stores → Replicators
- Replicators → Regional Stores
- Replicators → Projections
- Replicators → Global Catalog

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 29. Multi-DC Stream Replication

**ID:** multi-dc-stream-replication
**Category:** streaming
**Difficulty:** Advanced

### Summary

Replicate streams across data centers

### Goal

Build Kafka MirrorMaker for global streaming.

### Description

Replicate streaming data across multiple data centers with low latency and high consistency. Handle regional failures, network partitions, and maintain ordering guarantees.

### Functional Requirements

- Replicate streams across DCs
- Maintain message ordering
- Handle DC failures
- Support bidirectional replication
- Monitor replication lag
- Enable selective replication
- Provide conflict detection
- Support topic remapping

### Non-Functional Requirements

- **Latency:** P95 < 2s cross-DC replication
- **Request Rate:** 500k messages/sec per DC
- **Dataset Size:** 100TB per DC
- **Availability:** 99.95% per DC
- **Consistency:** At-least-once delivery

### Constants/Assumptions

- **message_rate_per_dc:** 500000
- **data_centers:** 4
- **replication_lag_target_ms:** 2000
- **topics:** 1000

### Available Components

- client
- app
- stream
- worker
- db_primary
- cache

### Hints

1. MirrorMaker 2.0 for replication
2. Monitor consumer lag

### Tiers/Checkpoints

**T0: Replicators**
  - Minimum 20 of type: worker

**T1: Monitoring**
  - Must include: cache

**T2: Multi-DC**
  - Minimum 4 of type: stream

### Reference Solution

MirrorMaker workers replicate between DCs with checkpointing. Lag monitor tracks replication delay. Metrics stored for alerting. Bidirectional replication enables active-active. This teaches multi-DC streaming.

**Components:**
- DC1 Kafka (stream)
- DC2 Kafka (stream)
- DC3 Kafka (stream)
- Replicators 1-2 (worker)
- Replicators 2-3 (worker)
- Lag Monitor (cache)
- Health Dashboard (app)
- Metrics DB (db_primary)

**Connections:**
- DC1 Kafka → Replicators 1-2
- Replicators 1-2 → DC2 Kafka
- DC2 Kafka → Replicators 2-3
- Replicators 2-3 → DC3 Kafka
- Replicators 1-2 → Lag Monitor
- Replicators 2-3 → Lag Monitor
- Lag Monitor → Health Dashboard
- Health Dashboard → Metrics DB

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 30. Real-time ML Feature Store

**ID:** realtime-ml-feature-store
**Category:** streaming
**Difficulty:** Advanced

### Summary

Feature store for online inference

### Goal

Build Feast-style feature platform.

### Description

Create a real-time feature store for ML inference with streaming feature computation, low-latency serving, and point-in-time correctness.

### Functional Requirements

- Compute features from streams
- Serve features with <10ms latency
- Maintain point-in-time correctness
- Support feature versioning
- Enable batch and streaming
- Provide feature lineage
- Handle feature drift
- Support A/B testing

### Non-Functional Requirements

- **Latency:** P95 < 10ms for feature serving
- **Request Rate:** 1M feature requests/sec
- **Dataset Size:** 10B feature vectors
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **feature_requests_per_sec:** 1000000
- **features:** 10000
- **feature_vectors:** 10000000000
- **update_rate:** 100000

### Available Components

- client
- lb
- app
- stream
- cache
- db_primary
- worker

### Hints

1. Redis for low-latency serving
2. Flink for feature computation

### Tiers/Checkpoints

**T0: Serving**
  - Must include: cache

**T1: Computation**
  - Must include: stream

**T2: Processing**
  - Minimum 50 of type: worker

**T3: Scale**
  - Minimum 200 of type: app

### Reference Solution

Redis serves features at <10ms. Flink computes streaming features. Offline store for training. Registry tracks metadata. Point-in-time joins ensure correctness. This teaches real-time feature engineering.

**Components:**
- ML Services (redirect_client)
- Feature LB (lb)
- Feature API (app)
- Feature Cache (cache)
- Event Stream (stream)
- Feature Processors (worker)
- Offline Store (db_primary)
- Registry (cache)

**Connections:**
- ML Services → Feature LB
- Feature LB → Feature API
- Feature API → Feature Cache
- Event Stream → Feature Processors
- Feature Processors → Feature Cache
- Feature Processors → Offline Store
- Feature API → Registry

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 31. GDPR-Compliant Event Streaming

**ID:** gdpr-compliant-streaming
**Category:** streaming
**Difficulty:** Advanced

### Summary

Privacy-preserving event streams

### Goal

Build GDPR-compliant data streaming.

### Description

Design an event streaming platform compliant with GDPR and privacy regulations. Handle right to deletion, data anonymization, and consent management in real-time streams.

### Functional Requirements

- Support right to be forgotten
- Anonymize PII in streams
- Track consent across events
- Enable data portability
- Audit all data access
- Implement retention policies
- Support data minimization
- Provide transparency reports

### Non-Functional Requirements

- **Latency:** P95 < 100ms with privacy checks
- **Request Rate:** 100k events/sec
- **Dataset Size:** 50TB with 30-day retention
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **event_rate:** 100000
- **user_deletion_rate:** 1000
- **retention_days:** 30
- **pii_fields:** 50

### Available Components

- client
- app
- stream
- worker
- db_primary
- cache
- queue

### Hints

1. Pseudonymization for PII
2. Tombstone records for deletion

### Tiers/Checkpoints

**T0: Anonymization**
  - Must include: worker

**T1: Consent**
  - Must include: cache

**T2: Deletion**
  - Must include: queue

**T3: Audit**
  - Must include: db_primary

### Reference Solution

Gateway checks consent before streaming. Anonymizer replaces PII with pseudonyms. Deletion workers insert tombstones. Audit log tracks all access. TTLs enforce retention. This teaches privacy-compliant streaming.

**Components:**
- Services (redirect_client)
- Privacy Gateway (app)
- Consent Cache (cache)
- Event Stream (stream)
- Anonymizer (worker)
- Deletion Queue (queue)
- Audit Log (db_primary)
- Deletion Worker (worker)

**Connections:**
- Services → Privacy Gateway
- Privacy Gateway → Consent Cache
- Privacy Gateway → Event Stream
- Event Stream → Anonymizer
- Anonymizer → Audit Log
- Privacy Gateway → Deletion Queue
- Deletion Queue → Deletion Worker
- Deletion Worker → Event Stream

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 32. Financial Settlement Stream

**ID:** financial-settlement-stream
**Category:** streaming
**Difficulty:** Advanced

### Summary

Real-time financial settlement

### Goal

Build bank-grade settlement system.

### Description

Process financial settlements in real-time with strong consistency, audit trails, and regulatory compliance. Handle reconciliation, disputes, and multi-currency settlements.

### Functional Requirements

- Process settlements in real-time
- Maintain double-entry accounting
- Support multi-currency
- Handle dispute resolution
- Enable transaction reconciliation
- Provide regulatory reporting
- Implement circuit breakers
- Support settlement windows

### Non-Functional Requirements

- **Latency:** P95 < 1s for settlements
- **Request Rate:** 50k settlements/sec
- **Dataset Size:** 100TB transaction history
- **Data Durability:** 11 nines durability
- **Availability:** 99.999% uptime
- **Consistency:** Strong consistency

### Constants/Assumptions

- **settlement_rate:** 50000
- **currencies:** 150
- **avg_settlement_amount:** 10000
- **daily_volume_usd:** 4000000000

### Available Components

- client
- lb
- app
- stream
- db_primary
- worker
- cache
- queue

### Hints

1. Two-phase commit for atomicity
2. Event sourcing for audit

### Tiers/Checkpoints

**T0: Validation**
  - Must include: worker

**T1: Settlement**
  - Must include: stream

**T2: Ledger**
  - Must include: db_primary

**T3: Reconciliation**
  - Must include: queue

### Reference Solution

Validators check limits and fraud. Stream provides immutable audit trail. Processors apply double-entry accounting. Ledger DB ensures ACID. Reconciliation queue handles disputes. This teaches financial settlement systems.

**Components:**
- Banks/PSPs (redirect_client)
- Gateway LB (lb)
- Settlement API (app)
- Validators (worker)
- Settlement Stream (stream)
- Ledger DB (db_primary)
- Processors (worker)
- Reconciliation (queue)

**Connections:**
- Banks/PSPs → Gateway LB
- Gateway LB → Settlement API
- Settlement API → Validators
- Validators → Settlement Stream
- Settlement Stream → Processors
- Processors → Ledger DB
- Processors → Reconciliation

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 33. Autonomous Vehicle Telemetry

**ID:** autonomous-vehicle-telemetry
**Category:** streaming
**Difficulty:** Advanced

### Summary

Process AV sensor streams

### Goal

Build Tesla-style telemetry platform.

### Description

Stream and process telemetry from autonomous vehicles including sensor data, video, and decision logs. Handle high bandwidth, edge processing, and ML model updates.

### Functional Requirements

- Ingest multi-modal sensor data
- Process video streams
- Log decision traces
- Detect safety events
- Update ML models OTA
- Support fleet analytics
- Enable remote diagnostics
- Compress data efficiently

### Non-Functional Requirements

- **Latency:** P95 < 100ms for safety events
- **Request Rate:** 10M readings/sec fleet-wide
- **Dataset Size:** 1PB/day from fleet
- **Availability:** 99.99% uptime
- **Scalability:** 1M vehicles

### Constants/Assumptions

- **fleet_size:** 1000000
- **readings_per_vehicle_per_sec:** 10
- **video_bandwidth_mbps:** 5
- **daily_data_pb:** 1

### Available Components

- client
- cdn
- app
- stream
- worker
- db_primary
- cache
- queue

### Hints

1. Edge computing for compression
2. Prioritize safety events

### Tiers/Checkpoints

**T0: Edge**
  - Minimum 100 of type: app

**T1: Stream**
  - Minimum 3 of type: stream

**T2: Safety**
  - Must include: worker

**T3: Storage**
  - Must include: db_primary

### Reference Solution

Edge processors compress and filter telemetry. Safety events prioritized in separate stream. ML pipeline trains on fleet data. Data lake stores PB-scale history. This teaches AV telemetry architecture.

**Components:**
- AV Fleet (redirect_client)
- Edge Gateways (cdn)
- Edge Processors (app)
- Safety Stream (stream)
- Telemetry Stream (stream)
- Video Stream (stream)
- Safety Monitor (worker)
- ML Pipeline (worker)
- Data Lake (db_primary)

**Connections:**
- AV Fleet → Edge Gateways
- Edge Gateways → Edge Processors
- Edge Processors → Safety Stream
- Edge Processors → Telemetry Stream
- Edge Processors → Video Stream
- Safety Stream → Safety Monitor
- Telemetry Stream → ML Pipeline
- Video Stream → ML Pipeline
- ML Pipeline → Data Lake

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 34. Healthcare Data Stream (HIPAA)

**ID:** healthcare-data-stream-hipaa
**Category:** streaming
**Difficulty:** Advanced

### Summary

HIPAA-compliant health data streaming

### Goal

Build Epic-style health data exchange.

### Description

Stream patient health data with HIPAA compliance, encryption, access controls, and audit trails. Handle HL7/FHIR formats, clinical workflows, and real-time alerts.

### Functional Requirements

- Stream HL7/FHIR messages
- Encrypt PHI end-to-end
- Enforce access controls
- Audit all data access
- Support clinical workflows
- Enable real-time alerts
- Maintain data lineage
- Provide patient consent

### Non-Functional Requirements

- **Latency:** P95 < 500ms for critical alerts
- **Request Rate:** 100k messages/sec
- **Dataset Size:** 500TB patient data
- **Data Durability:** 11 nines durability
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **message_rate:** 100000
- **patients:** 100000000
- **providers:** 1000000
- **retention_years:** 10

### Available Components

- client
- lb
- app
- stream
- worker
- db_primary
- cache
- queue

### Hints

1. Field-level encryption for PHI
2. RBAC for access control

### Tiers/Checkpoints

**T0: Encryption**
  - Must include: app

**T1: Stream**
  - Must include: stream

**T2: Access Control**
  - Must include: cache

**T3: Audit**
  - Must include: db_primary

### Reference Solution

Gateway encrypts all PHI fields. Stream maintains immutable audit trail. Workers check permissions before processing. Alert queue for critical events. BAA agreements with vendors. This teaches HIPAA-compliant streaming.

**Components:**
- Healthcare Systems (redirect_client)
- Secure Gateway (lb)
- Encryption Layer (app)
- FHIR Stream (stream)
- Permissions (cache)
- Clinical Workers (worker)
- Audit Log (db_primary)
- Alert Queue (queue)

**Connections:**
- Healthcare Systems → Secure Gateway
- Secure Gateway → Encryption Layer
- Encryption Layer → FHIR Stream
- FHIR Stream → Clinical Workers
- Clinical Workers → Permissions
- Clinical Workers → Audit Log
- Clinical Workers → Alert Queue

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for moderate-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 60 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 35. Global CDC Streaming Platform

**ID:** global-cdc-pipeline
**Category:** streaming
**Difficulty:** Advanced

### Summary

Replicate database changes worldwide

### Goal

Stream database changes across regions in real-time.

### Description

Build a change data capture (CDC) platform that streams database changes across multiple regions. Handle schema evolution, data transformation, and maintain consistency across heterogeneous systems.

### Functional Requirements

- Capture changes from multiple databases
- Stream across regions with low latency
- Handle schema evolution gracefully
- Transform data between formats
- Maintain ordering guarantees
- Support filtering and routing
- Enable point-in-time recovery
- Monitor lag and data quality

### Non-Functional Requirements

- **Latency:** P95 < 1s cross-region replication
- **Request Rate:** 500k changes/sec globally
- **Dataset Size:** 100TB daily change volume
- **Availability:** 99.99% uptime
- **Consistency:** Eventual consistency < 5s

### Constants/Assumptions

- **change_rate:** 500000
- **source_databases:** 50
- **target_systems:** 20
- **regions:** 5

### Available Components

- client
- app
- stream
- db_primary
- db_replica
- cache
- worker
- queue

### Hints

1. Use Debezium for CDC
2. Schema registry for evolution

### Tiers/Checkpoints

**T0: Capture**
  - Must include: worker

**T1: Transform**
  - Minimum 10 of type: worker

**T2: Multi-Region**
  - Minimum 3 of type: stream

**T3: Scale**
  - Parameter range check: stream.partitions

### Reference Solution

Debezium captures changes from 50 source databases. Global Kafka with 200 partitions handles 500k changes/sec. Schema registry manages evolution. Transformers convert formats. Regional streams reduce cross-region traffic. This teaches enterprise CDC at scale.

**Components:**
- MySQL Sources (db_primary)
- Postgres Sources (db_primary)
- CDC Connectors (worker)
- Global Kafka (stream)
- Transformers (worker)
- Routers (worker)
- Schema Registry (cache)
- Regional Streams (stream)
- Target Systems (db_replica)

**Connections:**
- MySQL Sources → CDC Connectors
- Postgres Sources → CDC Connectors
- CDC Connectors → Global Kafka
- Global Kafka → Transformers
- Global Kafka → Routers
- Transformers → Schema Registry
- Transformers → Regional Streams
- Routers → Regional Streams
- Regional Streams → Target Systems

### Solution Analysis

**Architecture Overview:**

Event-driven architecture for high-scale real-time data processing. Kafka provides durable message queuing with stream processors for real-time analytics.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Kafka partitions evenly distribute load across consumers.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Kafka partitions auto-scale with consumer groups.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through partition reassignment and consumer rebalancing. Automatic failover ensures continuous operation.
- Redundancy: Kafka replication factor 3 across availability zones
- Failover Time: < 30 seconds
- Data Loss Risk: At-most-once delivery possible
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Kafka
   - Pros:
     - High throughput
     - Durable
     - Scalable
   - Cons:
     - Complex operations
     - Resource intensive
   - Best for: High-volume event streaming
   - Cost: Higher infrastructure cost, excellent for scale

2. Managed Queue (SQS/Kinesis)
   - Pros:
     - Fully managed
     - No operations
     - Pay-per-use
   - Cons:
     - Vendor lock-in
     - Less control
   - Best for: Variable workloads without operations team
   - Cost: No fixed costs, can be expensive at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---
