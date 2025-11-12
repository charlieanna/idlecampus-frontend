# System Design - GATEWAY Problems

Total Problems: 35

---

## 1. Basic API Gateway

**ID:** basic-api-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Route requests to microservices

### Goal

Build a simple gateway that routes to services.

### Description

Learn API gateway fundamentals by building a basic router that directs requests to appropriate microservices. Understand path-!based routing, header manipulation, and basic request/response transformation.

### Functional Requirements

- Route requests based on URL path
- Add authentication headers
- Transform request/response formats
- Handle service discovery
- Implement basic health checks

### Non-Functional Requirements

- **Latency:** P95 < 50ms overhead, P99 < 100ms
- **Request Rate:** 10k requests/sec across all services
- **Availability:** 99.9% uptime
- **Scalability:** Horizontal scaling for gateway instances

### Constants/Assumptions

- **total_qps:** 10000
- **services_count:** 5
- **gateway_overhead_ms:** 50
- **instances_per_service:** 3

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Use path prefix for routing
2. Gateway should be stateless

### Tiers/Checkpoints

**T0: Gateway**
  - Must have connection from: redirect_client

**T1: Services**
  - Minimum 3 of type: app

**T2: Scale**
  - Minimum 5 of type: app

### Reference Solution

Gateway routes /users/* to User Service, /products/* to Product Service, /orders/* to Order Service. Each service has 3 instances for availability. Gateway adds auth headers and transforms responses. This teaches basic API gateway patterns.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- API Gateway (app)
- User Service (app)
- Product Service (app)
- Order Service (app)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → API Gateway
- API Gateway → User Service
- API Gateway → Product Service
- API Gateway → Order Service

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 2. Simple Rate Limiter

**ID:** simple-rate-limiter
**Category:** gateway
**Difficulty:** Easy

### Summary

Protect APIs with request limits

### Goal

Implement token bucket rate limiting.

### Description

Build a rate limiter using the token bucket algorithm. Learn about rate limiting strategies, handling burst traffic, and returning proper HTTP status codes (429 Too Many Requests).

### Functional Requirements

- Limit requests per user per minute
- Support burst allowance
- Return 429 with retry-after header
- Track usage per API key
- Allow different tiers with different limits

### Non-Functional Requirements

- **Latency:** P95 < 10ms for limit checks
- **Request Rate:** 20k requests/sec to validate
- **Dataset Size:** 100k active API keys
- **Availability:** 99.9% uptime, fail open on errors

### Constants/Assumptions

- **check_qps:** 20000
- **default_limit:** 100
- **burst_size:** 20
- **active_keys:** 100000

### Available Components

- client
- lb
- app
- cache

### Hints

1. Use Redis INCR with EXPIRE
2. Token bucket allows bursts

### Tiers/Checkpoints

**T0: Limiter**
  - Must include: cache

**T1: Performance**
  - Minimum 5 of type: app

### Reference Solution

Redis stores token buckets per API key with atomic INCR operations. Tokens refill at configured rate (100/min). Burst of 20 allows temporary spikes. Returns 429 with Retry-After header when exhausted. This teaches rate limiting fundamentals.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- Rate Limiter (app)
- Redis Counters (cache)
- Backend API (app)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → Rate Limiter
- Rate Limiter → Redis Counters
- Rate Limiter → Backend API

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 3. Authentication Gateway

**ID:** authentication-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Validate JWT tokens at edge

### Goal

Secure APIs with token validation.

### Description

Implement JWT token validation at the API gateway. Learn about token verification, public key caching, token refresh flows, and how to minimize auth overhead on backend services.

### Functional Requirements

- Validate JWT tokens on every request
- Cache public keys for verification
- Extract user context from tokens
- Support token refresh flow
- Forward user context to services

### Non-Functional Requirements

- **Latency:** P95 < 20ms for validation
- **Request Rate:** 30k authenticated requests/sec
- **Availability:** 99.99% uptime for auth
- **Security:** Cryptographic token verification

### Constants/Assumptions

- **auth_qps:** 30000
- **token_validation_ms:** 5
- **public_key_cache_ttl:** 3600
- **token_expiry_seconds:** 900

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Cache public keys locally
2. Pass user context in headers

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Auth DB**
  - Must include: db_primary

**T2: Scale**
  - Minimum 8 of type: app

### Reference Solution

Gateway validates JWT signatures using cached public keys (99% hit rate). User context extracted and forwarded in headers, eliminating auth overhead in services. Token refresh endpoint handles expiry. This teaches edge authentication patterns.

**Components:**
- Mobile Apps (redirect_client)
- Load Balancer (lb)
- Auth Gateway (app)
- Key Cache (cache)
- User DB (db_primary)
- Backend Services (app)

**Connections:**
- Mobile Apps → Load Balancer
- Load Balancer → Auth Gateway
- Auth Gateway → Key Cache
- Auth Gateway → User DB
- Auth Gateway → Backend Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 30,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 30,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (300,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 300,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000592

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 4. Load Balancing Gateway

**ID:** load-balancing-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Distribute load across services

### Goal

Implement round-robin and weighted routing.

### Description

Build a gateway that implements various load balancing algorithms. Learn about round-robin, weighted distribution, least connections, and how to handle unhealthy instances.

### Functional Requirements

- Implement round-robin load balancing
- Support weighted distribution
- Health check backend services
- Remove unhealthy instances
- Support sticky sessions

### Non-Functional Requirements

- **Latency:** P95 < 30ms routing overhead
- **Request Rate:** 15k requests/sec
- **Availability:** 99.9% with automatic failover
- **Scalability:** Handle 100 backend instances

### Constants/Assumptions

- **total_qps:** 15000
- **backend_instances:** 10
- **health_check_interval:** 5
- **unhealthy_threshold:** 3

### Available Components

- client
- lb
- app
- cache

### Hints

1. Track connection count per instance
2. Use consistent hashing for sticky sessions

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 5 of type: app

**T1: Session**
  - Must include: cache

### Reference Solution

Gateway implements weighted round-robin with health checks every 5 seconds. Unhealthy instances removed after 3 failures. Session affinity via consistent hashing in Redis. This teaches load balancing fundamentals.

**Components:**
- Clients (redirect_client)
- Load Balancer (lb)
- LB Gateway (app)
- Session Cache (cache)
- Backend Pool (app)

**Connections:**
- Clients → Load Balancer
- Load Balancer → LB Gateway
- LB Gateway → Session Cache
- LB Gateway → Backend Pool

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 15,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 15,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (150,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 150,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001183

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 5. Request Transformation Gateway

**ID:** request-transform-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Convert between API formats

### Goal

Transform REST to GraphQL and gRPC.

### Description

Build a gateway that transforms between different API protocols and formats. Learn about protocol translation, schema mapping, and maintaining backward compatibility.

### Functional Requirements

- Convert REST requests to GraphQL
- Transform JSON to Protocol Buffers
- Map between different schemas
- Support API versioning
- Handle format validation

### Non-Functional Requirements

- **Latency:** P95 < 40ms transformation overhead
- **Request Rate:** 8k requests/sec
- **Availability:** 99.9% uptime
- **Scalability:** Support 3 API versions simultaneously

### Constants/Assumptions

- **transform_qps:** 8000
- **transformation_overhead_ms:** 20
- **api_versions:** 3
- **schema_cache_size:** 100

### Available Components

- client
- lb
- app
- cache

### Hints

1. Cache compiled schemas
2. Use streaming for large payloads

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Services**
  - Minimum 4 of type: app

### Reference Solution

Gateway maps REST endpoints to GraphQL queries/mutations and gRPC methods. Schema cache avoids repeated parsing. Version headers determine transformation rules. This teaches protocol translation patterns.

**Components:**
- REST Clients (redirect_client)
- Load Balancer (lb)
- Transform Gateway (app)
- Schema Cache (cache)
- GraphQL Service (app)
- gRPC Service (app)

**Connections:**
- REST Clients → Load Balancer
- Load Balancer → Transform Gateway
- Transform Gateway → Schema Cache
- Transform Gateway → GraphQL Service
- Transform Gateway → gRPC Service

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 8,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 8,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (80,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 80,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00002218

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 6. CORS Handling Gateway

**ID:** cors-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Enable cross-origin requests

### Goal

Implement proper CORS for web apps.

### Description

Build a gateway that properly handles Cross-Origin Resource Sharing (CORS) for browser-based applications. Learn about preflight requests, allowed origins, and security implications.

### Functional Requirements

- Handle OPTIONS preflight requests
- Configure allowed origins
- Set proper CORS headers
- Support credentials in requests
- Cache preflight responses

### Non-Functional Requirements

- **Latency:** P95 < 10ms for preflight
- **Request Rate:** 5k requests/sec
- **Availability:** 99.9% uptime
- **Security:** Whitelist allowed origins

### Constants/Assumptions

- **preflight_qps:** 1000
- **actual_qps:** 4000
- **allowed_origins:** 10
- **preflight_cache_ttl:** 86400

### Available Components

- client
- lb
- app
- cache

### Hints

1. Cache preflight for 24 hours
2. Validate origin against whitelist

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Backend**
  - Minimum 3 of type: app

### Reference Solution

Gateway handles OPTIONS with Access-Control headers. Preflight responses cached for 24h reducing overhead. Origin whitelist prevents unauthorized access. This teaches CORS handling at scale.

**Components:**
- Web Browsers (redirect_client)
- Load Balancer (lb)
- CORS Gateway (app)
- Preflight Cache (cache)
- API Services (app)

**Connections:**
- Web Browsers → Load Balancer
- Load Balancer → CORS Gateway
- CORS Gateway → Preflight Cache
- CORS Gateway → API Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 7. Retry and Circuit Breaker Gateway

**ID:** retry-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Handle failures gracefully

### Goal

Implement exponential backoff and circuit breaking.

### Description

Build a resilient gateway with retry logic and circuit breakers. Learn about exponential backoff, jitter, failure detection, and how to prevent cascading failures.

### Functional Requirements

- Retry failed requests with exponential backoff
- Implement circuit breaker pattern
- Add jitter to prevent thundering herd
- Track failure rates per service
- Return cached responses when circuit open

### Non-Functional Requirements

- **Latency:** P95 < 200ms including retries
- **Request Rate:** 10k requests/sec
- **Availability:** 99.95% with degraded mode, prevent cascading failures

### Constants/Assumptions

- **request_qps:** 10000
- **initial_retry_ms:** 100
- **max_retries:** 3
- **circuit_threshold:** 0.5
- **circuit_timeout:** 30000

### Available Components

- client
- lb
- app
- cache

### Hints

1. Exponential backoff: 100ms, 200ms, 400ms
2. Circuit opens at 50% failure rate

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Services**
  - Minimum 4 of type: app

### Reference Solution

Gateway retries with exponential backoff (100ms, 200ms, 400ms) plus jitter. Circuit breaker opens at 50% failure rate, serving cached responses. Half-open state tests recovery. This teaches resilience patterns.

**Components:**
- Clients (redirect_client)
- Load Balancer (lb)
- Retry Gateway (app)
- Response Cache (cache)
- Stable Service (app)
- Flaky Service (app)

**Connections:**
- Clients → Load Balancer
- Load Balancer → Retry Gateway
- Retry Gateway → Response Cache
- Retry Gateway → Stable Service
- Retry Gateway → Flaky Service

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 8. Compression Gateway

**ID:** compression-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Reduce bandwidth with gzip/brotli

### Goal

Compress responses to save bandwidth.

### Description

Implement response compression at the gateway to reduce bandwidth usage. Learn about different compression algorithms (gzip, brotli), content negotiation, and CPU vs bandwidth trade-offs.

### Functional Requirements

- Compress responses with gzip/brotli
- Support Accept-Encoding negotiation
- Skip compression for small payloads
- Cache compressed responses
- Monitor compression ratios

### Non-Functional Requirements

- **Latency:** P95 < 50ms compression overhead
- **Request Rate:** 12k requests/sec, reduce bandwidth by 70% for text

### Constants/Assumptions

- **request_qps:** 12000
- **avg_response_size_kb:** 50
- **compression_ratio:** 0.3
- **min_compress_size:** 1000
- **compression_cpu_ms:** 10

### Available Components

- client
- cdn
- lb
- app
- cache

### Hints

1. Pre-compress static content
2. Use streaming compression for large responses

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: CDN**
  - Must include: cdn

### Reference Solution

Gateway compresses responses >1KB using brotli for modern browsers, gzip for legacy. Pre-compressed cache serves 70% of requests. CDN handles static assets. This teaches bandwidth optimization.

**Components:**
- Web Clients (redirect_client)
- CDN (cdn)
- Load Balancer (lb)
- Compression GW (app)
- Compressed Cache (cache)
- API Services (app)

**Connections:**
- Web Clients → CDN
- Web Clients → Load Balancer
- CDN → Compression GW
- Load Balancer → Compression GW
- Compression GW → Compressed Cache
- Compression GW → API Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 12,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 12,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (120,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 120,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001479

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 9. Request Logging Gateway

**ID:** logging-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Centralized logging and metrics

### Goal

Log all requests for debugging and analytics.

### Description

Build a gateway that logs all requests for debugging, monitoring, and analytics. Learn about structured logging, sampling strategies, and avoiding performance impact.

### Functional Requirements

- Log request/response metadata
- Implement correlation IDs
- Support sampling for high volume
- Send logs to centralized system
- Extract metrics from logs

### Non-Functional Requirements

- **Latency:** P95 < 5ms logging overhead
- **Request Rate:** 25k requests/sec
- **Dataset Size:** 1TB logs per day
- **Data Durability:** 30 days retention

### Constants/Assumptions

- **request_qps:** 25000
- **log_size_bytes:** 500
- **sampling_rate:** 0.1
- **retention_days:** 30
- **logging_overhead_ms:** 2

### Available Components

- client
- lb
- app
- queue
- stream

### Hints

1. Async logging to avoid blocking
2. Sample high-volume endpoints

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: queue

**T1: Stream**
  - Must include: stream

### Reference Solution

Gateway adds correlation ID to each request. Async logging to queue prevents blocking. 10% sampling for high-volume endpoints. Stream enables real-time analytics. This teaches observability patterns.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- Logging Gateway (app)
- Log Buffer (queue)
- Log Stream (stream)
- Backend Services (app)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → Logging Gateway
- Logging Gateway → Log Buffer
- Logging Gateway → Log Stream
- Logging Gateway → Backend Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 25,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 25,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (250,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 250,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000710

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 10. Health Check Endpoint Aggregator

**ID:** health-check-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Monitor service health across microservices

### Goal

Build a gateway that aggregates health checks.

### Description

Create a health check aggregator that monitors multiple microservices and provides a unified health status. Learn about dependency checks, graceful degradation, and health status reporting.

### Functional Requirements

- Aggregate health checks from all services
- Report overall system health
- Track dependency health
- Support different health levels (healthy, degraded, down)
- Cache health results with TTL

### Non-Functional Requirements

- **Latency:** P95 < 100ms for health endpoint
- **Request Rate:** 1k health checks/sec
- **Availability:** 99.9% uptime for health endpoint
- **Scalability:** Monitor 50+ services

### Constants/Assumptions

- **health_check_qps:** 1000
- **service_count:** 20
- **check_timeout_ms:** 500
- **cache_ttl_seconds:** 10

### Available Components

- client
- lb
- app
- cache

### Hints

1. Cache health results to reduce load
2. Parallel health checks with timeout

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 5 of type: app

**T1: Cache**
  - Must include: cache

### Reference Solution

Gateway queries all services with 500ms timeout. Results cached for 10s to prevent overwhelming services. Health endpoint returns 200 if all healthy, 503 if any critical service down, 207 if degraded. This teaches health monitoring patterns.

**Components:**
- Health Monitors (redirect_client)
- Load Balancer (lb)
- Health Gateway (app)
- Health Cache (cache)
- Service A (app)
- Service B (app)
- Service C (app)

**Connections:**
- Health Monitors → Load Balancer
- Load Balancer → Health Gateway
- Health Gateway → Health Cache
- Health Gateway → Service A
- Health Gateway → Service B
- Health Gateway → Service C

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 1,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (10,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 10,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00017747

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 11. Dynamic API Routing Gateway

**ID:** api-routing-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Route based on headers and query params

### Goal

Build advanced routing with canary releases.

### Description

Implement a gateway with dynamic routing capabilities including canary releases, A/B testing, and header-based routing. Learn about traffic splitting and gradual rollouts.

### Functional Requirements

- Route based on headers and query params
- Support canary releases with percentage
- Enable A/B testing by user segment
- Implement feature flags via routing
- Track routing decisions for analytics

### Non-Functional Requirements

- **Latency:** P95 < 30ms routing overhead
- **Request Rate:** 18k requests/sec
- **Availability:** 99.9% uptime, 99.99% correct routing

### Constants/Assumptions

- **routing_qps:** 18000
- **canary_percentage:** 5
- **routing_rules:** 20
- **decision_overhead_ms:** 10

### Available Components

- client
- lb
- app
- cache

### Hints

1. Use consistent hashing for sticky routing
2. Cache routing rules

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 5 of type: app

**T1: Config**
  - Must include: cache

### Reference Solution

Gateway routes 95% to stable, 5% to canary based on hash of user ID. Header X-Beta-User routes to canary. Routing config cached with hot reload. This teaches traffic management for safe deployments.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- Routing Gateway (app)
- Config Cache (cache)
- Stable v1.0 (app)
- Canary v2.0 (app)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → Routing Gateway
- Routing Gateway → Config Cache
- Routing Gateway → Stable v1.0
- Routing Gateway → Canary v2.0

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 18,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 18,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (180,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 180,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000986

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 12. Advanced Response Transformation

**ID:** response-transform-gateway
**Category:** gateway
**Difficulty:** Easy

### Summary

Transform and aggregate responses

### Goal

Reshape API responses for different clients.

### Description

Build a gateway that transforms API responses based on client type and requirements. Learn about field filtering, response merging, and format conversion.

### Functional Requirements

- Filter response fields by client type
- Merge responses from multiple services
- Convert between data formats (JSON/XML)
- Add computed fields to responses
- Support response templates

### Non-Functional Requirements

- **Latency:** P95 < 60ms transformation time
- **Request Rate:** 14k requests/sec
- **Throughput:** Handle 100MB/sec response data
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **transform_qps:** 14000
- **avg_response_kb:** 30
- **transformation_cpu_ms:** 25
- **field_filter_count:** 50

### Available Components

- client
- lb
- app
- cache
- worker

### Hints

1. Stream large responses
2. Pre-compile transformation templates

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Workers**
  - Must include: worker

### Reference Solution

Gateway detects client type from User-Agent. Mobile gets minimal fields, desktop full data. Templates cached and compiled. Heavy transformations offloaded to workers. This teaches response optimization for different clients.

**Components:**
- Mobile (redirect_client)
- Desktop (redirect_client)
- Load Balancer (lb)
- Transform Gateway (app)
- Template Cache (cache)
- Transform Workers (worker)
- Backend API (app)

**Connections:**
- Mobile → Load Balancer
- Desktop → Load Balancer
- Load Balancer → Transform Gateway
- Transform Gateway → Template Cache
- Transform Gateway → Transform Workers
- Transform Gateway → Backend API

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 14,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 14,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (140,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 140,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001268

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 13. Backend-for-Frontend (BFF) Gateway

**ID:** api-aggregation-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Aggregate multiple APIs for mobile/web

### Goal

Reduce client complexity with API aggregation.

### Description

Build a Backend-for-Frontend gateway that aggregates multiple microservice calls into optimized responses for different client types (mobile, web, TV). Learn about parallel API calls, response shaping, and client-specific optimization.

### Functional Requirements

- Aggregate multiple service calls
- Shape responses for different clients
- Execute parallel API calls
- Handle partial failures gracefully
- Cache aggregated responses
- Support GraphQL-like field selection

### Non-Functional Requirements

- **Latency:** P95 < 200ms for aggregated calls
- **Request Rate:** 50k requests/sec
- **Availability:** 99.9% with degraded responses
- **Scalability:** Support 20 microservices

### Constants/Assumptions

- **client_qps:** 50000
- **services_count:** 20
- **avg_apis_per_request:** 4
- **parallel_timeout_ms:** 150

### Available Components

- client
- lb
- app
- cache
- queue
- worker

### Hints

1. Use Promise.allSettled for partial failures
2. Cache common aggregations

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 15 of type: app

**T1: Services**
  - Minimum 20 of type: app

**T2: Cache**
  - Must include: cache

### Reference Solution

BFF executes parallel calls with 150ms timeout. Mobile gets minimal fields, web gets full data. Partial failures return degraded response. Common aggregations cached. This teaches API orchestration patterns.

**Components:**
- Mobile Apps (redirect_client)
- Web Apps (redirect_client)
- Load Balancer (lb)
- BFF Gateway (app)
- Response Cache (cache)
- User Service (app)
- Product Service (app)
- Order Service (app)
- Async Queue (queue)
- Aggregator (worker)

**Connections:**
- Mobile Apps → Load Balancer
- Web Apps → Load Balancer
- Load Balancer → BFF Gateway
- BFF Gateway → Response Cache
- BFF Gateway → User Service
- BFF Gateway → Product Service
- BFF Gateway → Order Service
- BFF Gateway → Async Queue
- Async Queue → Aggregator

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 14. GraphQL Federation Gateway

**ID:** graphql-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Federated GraphQL across services

### Goal

Unite multiple GraphQL services into one schema.

### Description

Implement a GraphQL federation gateway that combines schemas from multiple services. Learn about schema stitching, N+1 query problems, DataLoader pattern, and subscription handling.

### Functional Requirements

- Federate schemas from multiple services
- Resolve cross-service references
- Implement DataLoader for batching
- Handle GraphQL subscriptions
- Cache query results
- Support schema introspection

### Non-Functional Requirements

- **Latency:** P95 < 100ms for typical queries
- **Request Rate:** 30k queries/sec
- **Availability:** 99.95% uptime
- **Scalability:** Support 50 subgraphs

### Constants/Assumptions

- **query_qps:** 30000
- **subgraph_count:** 10
- **avg_query_depth:** 3
- **dataloader_batch_size:** 100

### Available Components

- client
- lb
- app
- cache
- stream
- worker

### Hints

1. DataLoader prevents N+1 queries
2. Cache normalized entities

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 18 of type: app

**T1: Cache**
  - Must include: cache

**T2: Subscriptions**
  - Must include: stream

### Reference Solution

Federation gateway merges subgraph schemas at startup. DataLoader batches entity lookups preventing N+1. Query cache stores normalized results. WebSocket subscriptions via stream. This teaches GraphQL at scale.

**Components:**
- GraphQL Clients (redirect_client)
- Load Balancer (lb)
- Federation Gateway (app)
- Query Cache (cache)
- User Subgraph (app)
- Product Subgraph (app)
- Order Subgraph (app)
- Subscription Stream (stream)

**Connections:**
- GraphQL Clients → Load Balancer
- Load Balancer → Federation Gateway
- Federation Gateway → Query Cache
- Federation Gateway → User Subgraph
- Federation Gateway → Product Subgraph
- Federation Gateway → Order Subgraph
- Federation Gateway → Subscription Stream

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 30,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 30,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (300,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 300,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000592

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 15. OAuth2 Authorization Gateway

**ID:** oauth2-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Google-scale OAuth2 with billions of users

### Goal

Build Google/Facebook-scale OAuth2 infrastructure.

### Description

Design a Google-scale OAuth2 authorization gateway handling 2B+ users globally with 10M token operations/sec. Must handle Black Friday-level spikes (10x traffic), survive regional failures, and maintain <50ms P99 latency. Include attack detection, token rotation during breaches, and compliance with GDPR/CCPA. System must operate within $500k/month budget.

### Functional Requirements

- Handle 10M token operations/sec (100M during spikes)
- Support 2 billion active users globally
- Implement authorization code flow with PKCE at scale
- Rotate all tokens within 1 hour during security breach
- Support multi-region token validation with <50ms latency
- Detect and block credential stuffing attacks in real-time
- Provide audit logs for compliance (7-year retention)
- Handle graceful degradation during 50% infrastructure failure

### Non-Functional Requirements

- **Latency:** P99 < 50ms globally, P99.9 < 100ms even during spikes
- **Request Rate:** 10M ops/sec normal, 100M ops/sec during viral events
- **Dataset Size:** 2B users, 10B active tokens, 100TB audit logs
- **Availability:** 99.99% uptime (4.38 minutes downtime/month)
- **Security:** Zero-trust architecture, hardware security modules

### Constants/Assumptions

- **l4_enhanced:** true
- **token_qps:** 10000000
- **spike_multiplier:** 10
- **active_users:** 2000000000
- **token_ttl_seconds:** 3600
- **refresh_ttl_days:** 30
- **cache_hit_target:** 0.99
- **budget_monthly:** 500000

### Available Components

- client
- lb
- app
- cache
- db_primary
- queue

### Hints

1. Use JWT for stateless tokens
2. Rotate refresh tokens on use

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Scale**
  - Minimum 15 of type: app

### Reference Solution

Gateway implements full OAuth2 with PKCE for security. Tokens cached for fast validation. Refresh tokens rotated on use. Events queued for audit. This teaches OAuth2 implementation at scale.

**Components:**
- OAuth Clients (redirect_client)
- Load Balancer (lb)
- OAuth Gateway (app)
- Token Cache (cache)
- Token DB (db_primary)
- Token Events (queue)
- Resource API (app)

**Connections:**
- OAuth Clients → Load Balancer
- Load Balancer → OAuth Gateway
- OAuth Gateway → Token Cache
- OAuth Gateway → Token DB
- OAuth Gateway → Token Events
- OAuth Gateway → Resource API

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 16. WebSocket Gateway

**ID:** websocket-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Persistent connections with load balancing

### Goal

Handle millions of concurrent WebSocket connections.

### Description

Design a WebSocket gateway that handles millions of persistent connections with efficient load balancing, message routing, and connection management. Learn about connection pooling and pub/sub patterns.

### Functional Requirements

- Accept WebSocket connections at scale
- Route messages to backend services
- Implement pub/sub for broadcasting
- Handle connection lifecycle events
- Support message acknowledgments
- Provide connection state tracking

### Non-Functional Requirements

- **Latency:** P95 < 20ms message delivery
- **Request Rate:** 500k messages/sec
- **Availability:** 99.95% uptime
- **Scalability:** 5M concurrent connections

### Constants/Assumptions

- **concurrent_connections:** 5000000
- **message_qps:** 500000
- **avg_message_size_bytes:** 500
- **connection_duration_minutes:** 30

### Available Components

- client
- lb
- app
- cache
- stream
- queue

### Hints

1. 100k connections per instance
2. Use Redis pub/sub for broadcasting

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 80 of type: app

**T1: PubSub**
  - Must include: stream

**T2: State**
  - Must include: cache

### Reference Solution

Each gateway instance handles 50k connections. Connection state in Redis for routing. Messages published to stream for distribution. Queue handles broadcast fan-out. This teaches WebSocket scalability.

**Components:**
- WS Clients (redirect_client)
- WS Load Balancer (lb)
- WS Gateway (app)
- Connection State (cache)
- Message Stream (stream)
- Broadcast Queue (queue)
- Chat Service (app)

**Connections:**
- WS Clients → WS Load Balancer
- WS Load Balancer → WS Gateway
- WS Gateway → Connection State
- WS Gateway → Message Stream
- WS Gateway → Broadcast Queue
- WS Gateway → Chat Service

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 17. gRPC Gateway with HTTP/2

**ID:** grpc-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Bridge REST and gRPC with multiplexing

### Goal

Convert REST to gRPC with streaming support.

### Description

Build a gRPC gateway that bridges REST clients with gRPC services, leveraging HTTP/2 multiplexing and streaming. Learn about protocol buffers, bidirectional streaming, and connection reuse.

### Functional Requirements

- Convert REST requests to gRPC calls
- Support unary and streaming RPCs
- Handle bidirectional streaming
- Implement connection pooling
- Support gRPC metadata and deadlines
- Provide error mapping to HTTP status

### Non-Functional Requirements

- **Latency:** P95 < 40ms conversion overhead
- **Request Rate:** 35k requests/sec
- **Availability:** 99.9% uptime
- **Scalability:** Reuse gRPC connections

### Constants/Assumptions

- **grpc_qps:** 35000
- **connection_pool_size:** 100
- **stream_duration_seconds:** 60
- **max_message_size_mb:** 4

### Available Components

- client
- lb
- app
- cache
- stream

### Hints

1. Pool gRPC connections
2. Use HTTP/2 server push for streaming

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 15 of type: app

**T1: Services**
  - Minimum 5 of type: app

**T2: Stream**
  - Must include: stream

### Reference Solution

Gateway maintains connection pool to gRPC services. HTTP/2 multiplexing reduces latency. Streaming handled via chunked transfer. Protobuf schemas cached. This teaches efficient gRPC bridging.

**Components:**
- REST Clients (redirect_client)
- Load Balancer (lb)
- gRPC Gateway (app)
- Protobuf Cache (cache)
- gRPC Service A (app)
- gRPC Service B (app)
- Stream Buffer (stream)

**Connections:**
- REST Clients → Load Balancer
- Load Balancer → gRPC Gateway
- gRPC Gateway → Protobuf Cache
- gRPC Gateway → gRPC Service A
- gRPC Gateway → gRPC Service B
- gRPC Gateway → Stream Buffer

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 35,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 35,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (350,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 350,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000507

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 18. Mobile API Gateway

**ID:** mobile-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Optimize for mobile networks

### Goal

Reduce latency and bandwidth for mobile clients.

### Description

Design a mobile-optimized gateway that handles poor network conditions, minimizes battery drain, and reduces bandwidth usage. Learn about adaptive bitrate, request batching, and push notifications.

### Functional Requirements

- Batch multiple API calls into one request
- Compress responses aggressively
- Support offline-first patterns
- Implement delta updates
- Handle push notifications
- Adapt to network quality

### Non-Functional Requirements

- **Latency:** P95 < 300ms on 3G
- **Request Rate:** 60k requests/sec, reduce bandwidth by 80% vs REST

### Constants/Assumptions

- **mobile_qps:** 60000
- **batch_size:** 10
- **compression_ratio:** 0.2
- **delta_update_savings:** 0.9

### Available Components

- client
- cdn
- lb
- app
- cache
- queue
- worker

### Hints

1. Use brotli for mobile
2. Batch requests within 100ms window

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cdn

**T1: Batching**
  - Must include: queue

**T2: Push**
  - Must include: worker

### Reference Solution

Gateway batches requests within 100ms window. Brotli compression saves 80% bandwidth. Delta updates reduce data by 90%. CDN caches aggressively. Push workers handle notifications. This teaches mobile optimization.

**Components:**
- Mobile Apps (redirect_client)
- CDN (cdn)
- Load Balancer (lb)
- Mobile Gateway (app)
- Delta Cache (cache)
- Batch Queue (queue)
- Push Workers (worker)
- Backend APIs (app)

**Connections:**
- Mobile Apps → CDN
- Mobile Apps → Load Balancer
- CDN → Mobile Gateway
- Load Balancer → Mobile Gateway
- Mobile Gateway → Delta Cache
- Mobile Gateway → Batch Queue
- Mobile Gateway → Push Workers
- Mobile Gateway → Backend APIs

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 60,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 60,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (600,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 600,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000296

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 19. Partner API Gateway with SLA Enforcement

**ID:** partner-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Multi-tenant with SLA guarantees

### Goal

Enforce SLAs and quotas per partner.

### Description

Build a partner API gateway that enforces SLAs, tracks usage, and provides different service tiers. Learn about multi-tenancy, priority queuing, and usage metering.

### Functional Requirements

- Enforce rate limits per partner tier
- Track API usage for billing
- Implement priority queues by SLA
- Support burst allowances
- Provide usage analytics
- Handle quota resets

### Non-Functional Requirements

- **Latency:** P95 < 50ms for premium, < 200ms for free
- **Request Rate:** 100k requests/sec
- **Data Durability:** 100% billing accuracy
- **Availability:** 99.99% for premium, 99.9% for free

### Constants/Assumptions

- **total_qps:** 100000
- **partner_count:** 1000
- **premium_sla_ms:** 50
- **free_sla_ms:** 200

### Available Components

- client
- lb
- app
- cache
- db_primary
- queue
- stream

### Hints

1. Priority queue for premium
2. Stream usage events for billing

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: db_primary

**T1: Metering**
  - Must include: stream

**T2: Queue**
  - Must include: queue

### Reference Solution

Gateway routes premium to priority queue with <50ms latency. Free tier uses best-effort queue. Usage streamed to billing. Quotas cached in Redis with atomic updates. This teaches SLA enforcement.

**Components:**
- Premium Partners (redirect_client)
- Free Partners (redirect_client)
- Load Balancer (lb)
- Partner Gateway (app)
- Quota Cache (cache)
- Usage DB (db_primary)
- Metering Stream (stream)
- Premium Queue (queue)
- Free Queue (queue)

**Connections:**
- Premium Partners → Load Balancer
- Free Partners → Load Balancer
- Load Balancer → Partner Gateway
- Partner Gateway → Quota Cache
- Partner Gateway → Usage DB
- Partner Gateway → Metering Stream
- Partner Gateway → Premium Queue
- Partner Gateway → Free Queue

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 20. Webhook Delivery Gateway

**ID:** webhook-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Reliable webhook delivery with retries

### Goal

Deliver webhooks at scale with guarantees.

### Description

Design a webhook delivery system with exponential backoff, dead letter queues, and delivery guarantees. Learn about at-least-once delivery, idempotency, and failure handling.

### Functional Requirements

- Deliver webhooks with retry logic
- Implement exponential backoff
- Track delivery status
- Support webhook signing
- Handle dead letter queue
- Provide delivery analytics

### Non-Functional Requirements

- **Latency:** P95 < 100ms first attempt
- **Request Rate:** 200k webhooks/sec
- **Data Durability:** 7 days retry window
- **Availability:** 99.9% delivery rate

### Constants/Assumptions

- **webhook_qps:** 200000
- **max_retries:** 5
- **retry_multiplier:** 2
- **initial_retry_seconds:** 60

### Available Components

- client
- lb
- app
- queue
- worker
- db_primary
- stream

### Hints

1. Exponential backoff: 1m, 2m, 4m, 8m, 16m
2. Sign webhooks with HMAC

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: queue

**T1: Workers**
  - Must include: worker

**T2: DLQ**
  - Must include: db_primary

### Reference Solution

Gateway enqueues webhooks for async delivery. Workers retry with exponential backoff (1m, 2m, 4m, 8m, 16m). Failed webhooks after 5 retries go to DLQ. Status streamed for monitoring. This teaches reliable delivery patterns.

**Components:**
- Event Sources (redirect_client)
- Load Balancer (lb)
- Webhook Gateway (app)
- Delivery Queue (queue)
- Delivery Workers (worker)
- DLQ Storage (db_primary)
- Status Stream (stream)

**Connections:**
- Event Sources → Load Balancer
- Load Balancer → Webhook Gateway
- Webhook Gateway → Delivery Queue
- Delivery Queue → Delivery Workers
- Delivery Workers → DLQ Storage
- Delivery Workers → Status Stream

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 21. Serverless API Gateway

**ID:** serverless-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

AWS Lambda-scale with 1M concurrent executions

### Goal

Build AWS Lambda-scale serverless infrastructure.

### Description

Design an AWS Lambda-scale serverless gateway handling 5M requests/sec with 1M concurrent executions globally. Must handle Prime Day spikes (10x traffic), maintain <0.1% cold start rate, and survive entire AZ failures. Include ML-based predictive warming, request coalescing during cold starts, and operate within $1M/month budget while supporting 100k+ different functions.

### Functional Requirements

- Route 5M requests/sec to serverless functions (50M during spikes)
- Support 1M concurrent function executions
- ML-based predictive warming to keep cold starts <0.1%
- Request coalescing and buffering during cold starts
- Support 100k+ unique functions across 10k customers
- Handle function cascading failures gracefully
- Implement priority-based execution during resource constraints
- Support WebAssembly and container-based functions

### Non-Functional Requirements

- **Latency:** P99 < 50ms warm, P99 < 500ms cold, <0.1% cold start rate
- **Request Rate:** 5M requests/sec normal, 50M during Prime Day
- **Dataset Size:** 100k functions, 10PB function code storage
- **Availability:** 99.99% uptime, survive AZ failures
- **Scalability:** 1M concurrent executions globally

### Constants/Assumptions

- **l4_enhanced:** true
- **lambda_qps:** 5000000
- **spike_multiplier:** 10
- **cold_start_ms:** 200
- **warm_start_ms:** 5
- **concurrent_limit:** 1000000
- **cache_hit_target:** 0.999
- **budget_monthly:** 1000000

### Available Components

- client
- lb
- app
- cache
- queue
- worker

### Hints

1. Predictive warming based on patterns
2. Buffer requests during cold starts

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Workers**
  - Must include: worker

**T2: Buffer**
  - Must include: queue

### Reference Solution

Gateway tracks function warmth in cache. Warmer service pre-warms based on traffic patterns. Requests buffered during cold starts. Concurrent limits prevent throttling. This teaches serverless optimization.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- Serverless GW (app)
- Warmup Cache (cache)
- Request Buffer (queue)
- Lambda Functions (worker)
- Warmer Service (app)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → Serverless GW
- Serverless GW → Warmup Cache
- Serverless GW → Request Buffer
- Serverless GW → Lambda Functions
- Warmer Service → Warmup Cache

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $23,000,000
- Yearly Total: $276,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $15,000,000 (5000 × $100/month per instance)
- Storage: $5,000,000 (Database storage + backup + snapshots)
- Network: $2,500,000 (Ingress/egress + CDN distribution)

---

## 22. Multi-Protocol Gateway

**ID:** multi-protocol-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Support REST, SOAP, and GraphQL

### Goal

Unified gateway for multiple protocols.

### Description

Design a gateway that supports multiple protocols (REST, SOAP, GraphQL) with protocol-specific optimizations. Learn about protocol negotiation, schema management, and unified error handling.

### Functional Requirements

- Support REST, SOAP, and GraphQL
- Auto-detect protocol from request
- Convert between protocols
- Maintain unified schema
- Handle protocol-specific errors
- Provide protocol metrics

### Non-Functional Requirements

- **Latency:** P95 < 80ms across protocols
- **Request Rate:** 50k requests/sec mixed
- **Availability:** 99.9% uptime
- **Scalability:** Support legacy SOAP 1.1/1.2

### Constants/Assumptions

- **total_qps:** 50000
- **rest_percentage:** 0.7
- **soap_percentage:** 0.2
- **graphql_percentage:** 0.1

### Available Components

- client
- lb
- app
- cache
- worker

### Hints

1. Detect protocol from Content-Type
2. Cache WSDL and GraphQL schemas

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Workers**
  - Must include: worker

**T2: Services**
  - Minimum 5 of type: app

### Reference Solution

Gateway detects protocol from headers and routes accordingly. SOAP uses XML parser, GraphQL uses schema validation. Protocol-specific workers handle conversion. Schemas cached. This teaches multi-protocol support.

**Components:**
- REST Clients (redirect_client)
- SOAP Clients (redirect_client)
- GraphQL Clients (redirect_client)
- Load Balancer (lb)
- Multi-Protocol GW (app)
- Schema Cache (cache)
- Protocol Workers (worker)
- Backend Services (app)

**Connections:**
- REST Clients → Load Balancer
- SOAP Clients → Load Balancer
- GraphQL Clients → Load Balancer
- Load Balancer → Multi-Protocol GW
- Multi-Protocol GW → Schema Cache
- Multi-Protocol GW → Protocol Workers
- Multi-Protocol GW → Backend Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 23. API Versioning Gateway

**ID:** versioning-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Backward compatibility with versioning

### Goal

Support multiple API versions simultaneously.

### Description

Build a gateway that manages multiple API versions with backward compatibility, gradual migration, and version deprecation. Learn about semantic versioning and compatibility layers.

### Functional Requirements

- Support multiple API versions
- Route by version header or path
- Transform between versions
- Track version usage
- Deprecate old versions gracefully
- Provide migration guides

### Non-Functional Requirements

- **Latency:** P95 < 60ms including transforms
- **Request Rate:** 70k requests/sec
- **Availability:** 99.9% uptime
- **Scalability:** Support 5 versions simultaneously

### Constants/Assumptions

- **total_qps:** 70000
- **active_versions:** 5
- **transformation_overhead_ms:** 15
- **deprecation_period_days:** 180

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Cache transformation rules
2. Track version usage for deprecation planning

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Analytics**
  - Must include: db_primary

**T2: Services**
  - Minimum 8 of type: app

### Reference Solution

Gateway routes by X-API-Version header or /v{N}/ path. v3 uses native service, v2/v1 use adapters that transform to v3. Usage tracked for deprecation planning. Transformation rules cached. This teaches API evolution.

**Components:**
- v3 Clients (redirect_client)
- v2 Clients (redirect_client)
- v1 Clients (redirect_client)
- Load Balancer (lb)
- Versioning GW (app)
- Transform Cache (cache)
- Usage Analytics (db_primary)
- v3 Service (app)
- v2 Adapter (app)
- v1 Adapter (app)

**Connections:**
- v3 Clients → Load Balancer
- v2 Clients → Load Balancer
- v1 Clients → Load Balancer
- Load Balancer → Versioning GW
- Versioning GW → Transform Cache
- Versioning GW → Usage Analytics
- Versioning GW → v3 Service
- Versioning GW → v2 Adapter
- Versioning GW → v1 Adapter

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 70,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 70,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (700,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 700,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000254

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 24. Quota Management Gateway

**ID:** quota-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Tiered rate limits and quotas

### Goal

Enforce complex quota rules per tier.

### Description

Design a gateway that enforces complex quota rules across multiple dimensions (per-second, per-day, per-month) with different tiers. Learn about quota tracking, overage handling, and fair use policies.

### Functional Requirements

- Enforce per-second, per-day, per-month quotas
- Support tiered plans (free, pro, enterprise)
- Handle quota overages gracefully
- Provide quota usage API
- Implement quota resets
- Support quota pooling for teams

### Non-Functional Requirements

- **Latency:** P95 < 15ms for quota checks
- **Request Rate:** 120k requests/sec
- **Availability:** 99.95% uptime, 99.99% quota enforcement accuracy

### Constants/Assumptions

- **quota_check_qps:** 120000
- **free_limit:** 1000
- **pro_limit:** 100000
- **enterprise_limit:** 10000000

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream

### Hints

1. Use sliding window for quotas
2. Increment counters atomically in Redis

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Storage**
  - Must include: db_primary

**T2: Analytics**
  - Must include: stream

### Reference Solution

Gateway maintains sliding window counters in Redis for per-second/day/month quotas. Checks all dimensions atomically. Free gets 1k/day, Pro 100k/day, Enterprise 10M/day. Usage streamed to billing. This teaches multi-dimensional quota enforcement.

**Components:**
- Free Tier (redirect_client)
- Pro Tier (redirect_client)
- Enterprise (redirect_client)
- Load Balancer (lb)
- Quota Gateway (app)
- Quota Counters (cache)
- Quota DB (db_primary)
- Usage Stream (stream)
- Backend API (app)

**Connections:**
- Free Tier → Load Balancer
- Pro Tier → Load Balancer
- Enterprise → Load Balancer
- Load Balancer → Quota Gateway
- Quota Gateway → Quota Counters
- Quota Gateway → Quota DB
- Quota Gateway → Usage Stream
- Quota Gateway → Backend API

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 120,000 QPS, the system uses 120 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 120,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $500

*Peak Load:*
During 10x traffic spikes (1,200,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,200,000 requests/sec
- Cost/Hour: $5000

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $552,000
- Yearly Total: $6,624,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $360,000 (120 × $100/month per instance)
- Storage: $120,000 (Database storage + backup + snapshots)
- Network: $60,000 (Ingress/egress + CDN distribution)

---

## 25. API Monetization Gateway

**ID:** monetization-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Usage-based billing and metering

### Goal

Track usage for accurate billing.

### Description

Build a monetization gateway that tracks API usage across multiple dimensions for billing. Learn about usage metering, billing integration, and revenue optimization.

### Functional Requirements

- Meter API usage by endpoint and method
- Track bandwidth consumption
- Calculate costs in real-time
- Support tiered pricing
- Provide usage reports
- Integrate with billing systems

### Non-Functional Requirements

- **Latency:** P95 < 10ms metering overhead
- **Request Rate:** 150k requests/sec
- **Data Durability:** 100% billing accuracy
- **Availability:** 99.99% uptime for metering

### Constants/Assumptions

- **metering_qps:** 150000
- **cost_per_1k_requests:** 1
- **cost_per_gb_bandwidth:** 0.1
- **billing_granularity_seconds:** 3600

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- queue

### Hints

1. Batch usage events for efficiency
2. Aggregate hourly for billing

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: stream

**T1: Aggregation**
  - Must include: queue

**T2: Billing**
  - Must include: db_primary

### Reference Solution

Gateway logs request count, method, endpoint, and bandwidth to stream. Aggregator computes hourly usage and cost. Pricing tiers cached. Billing DB updated hourly. This teaches usage-based monetization at scale.

**Components:**
- API Consumers (redirect_client)
- Load Balancer (lb)
- Monetization GW (app)
- Pricing Cache (cache)
- Usage Stream (stream)
- Aggregation Queue (queue)
- Billing DB (db_primary)
- Aggregator (app)
- Backend API (app)

**Connections:**
- API Consumers → Load Balancer
- Load Balancer → Monetization GW
- Monetization GW → Pricing Cache
- Monetization GW → Usage Stream
- Monetization GW → Backend API
- Usage Stream → Aggregation Queue
- Aggregation Queue → Aggregator
- Aggregator → Billing DB

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 150,000 QPS, the system uses 150 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 150,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $625

*Peak Load:*
During 10x traffic spikes (1,500,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,500,000 requests/sec
- Cost/Hour: $6250

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $690,000
- Yearly Total: $8,280,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $450,000 (150 × $100/month per instance)
- Storage: $150,000 (Database storage + backup + snapshots)
- Network: $75,000 (Ingress/egress + CDN distribution)

---

## 26. Zero-Trust API Gateway

**ID:** zero-trust-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Google BeyondCorp-scale zero-trust architecture

### Goal

Implement Google BeyondCorp-level zero-trust at scale.

### Description

Design a Google BeyondCorp-scale zero-trust gateway handling 20M requests/sec with mTLS for 500k+ services globally. Must handle nation-state attack scenarios (100x traffic), maintain <10ms P99 latency with hardware crypto acceleration, and survive compromise of 10% of certificates. Support 1M certificate rotations/day, continuous risk assessment, and operate within $2M/month budget.

### Functional Requirements

- Handle 20M requests/sec with mTLS (2B during attacks)
- Support 500k+ unique service identities globally
- Hardware-accelerated crypto for <10ms validation
- Continuous risk scoring and adaptive authentication
- Auto-rotate 1M certificates daily without downtime
- Micro-segment 10k+ different service meshes
- Real-time threat detection with ML anomaly detection
- Support FIDO2, WebAuthn, and biometric authentication

### Non-Functional Requirements

- **Latency:** P99 < 10ms with crypto, P99.9 < 25ms during attacks
- **Request Rate:** 20M requests/sec normal, 2B during DDoS
- **Dataset Size:** 500k services, 100M certificates, 10PB audit logs
- **Availability:** 99.999% uptime (26 seconds downtime/month)
- **Security:** Survive 10% certificate compromise, quantum-resistant crypto

### Constants/Assumptions

- **l4_enhanced:** true
- **mtls_qps:** 20000000
- **spike_multiplier:** 100
- **cert_validation_ms:** 2
- **cert_rotation_hours:** 1
- **active_certificates:** 100000000
- **cache_hit_target:** 0.999
- **budget_monthly:** 2000000

### Available Components

- client
- lb
- app
- cache
- db_primary
- queue
- worker

### Hints

1. OCSP stapling for revocation
2. Hardware crypto acceleration

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: db_primary

**T1: Validation**
  - Must include: cache

**T2: Audit**
  - Must include: queue

**T3: Scale**
  - Minimum 50 of type: app

### Reference Solution

mTLS validates both client and server certificates. Certificate pins cached with OCSP stapling. Policy engine continuously validates identity and context. Services micro-segmented by identity. All access audited. Certificate rotation automated daily. This teaches zero-trust at scale.

**Components:**
- Authenticated Clients (redirect_client)
- TLS Termination (lb)
- Zero-Trust GW (app)
- Cert Cache (cache)
- Cert Store (db_primary)
- Audit Queue (queue)
- Policy Engine (worker)
- Segmented Services (app)

**Connections:**
- Authenticated Clients → TLS Termination
- TLS Termination → Zero-Trust GW
- Zero-Trust GW → Cert Cache
- Zero-Trust GW → Cert Store
- Zero-Trust GW → Audit Queue
- Zero-Trust GW → Policy Engine
- Zero-Trust GW → Segmented Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000,000 QPS, the system uses 20000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 20,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $83333

*Peak Load:*
During 10x traffic spikes (200,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 200,000,000 requests/sec
- Cost/Hour: $833333

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $92,000,000
- Yearly Total: $1,104,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $60,000,000 (20000 × $100/month per instance)
- Storage: $20,000,000 (Database storage + backup + snapshots)
- Network: $10,000,000 (Ingress/egress + CDN distribution)

---

## 27. AI/ML Model Serving Gateway

**ID:** ml-model-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

OpenAI GPT-scale serving 100M requests/sec

### Goal

Build OpenAI/Google-scale ML serving infrastructure.

### Description

Design an OpenAI GPT-scale ML serving gateway handling 100M inference requests/sec for 10k+ different models globally. Must handle ChatGPT viral moments (20x traffic), maintain <20ms P99 latency for inference, and survive GPU cluster failures. Support 1000+ model versions, real-time A/B testing, automatic rollback on quality degradation, and operate within $10M/month budget.

### Functional Requirements

- Serve 100M predictions/sec (2B during viral ChatGPT moments)
- Support 10k+ different models with 1000+ versions
- GPU orchestration across 100k+ GPUs globally
- Real-time A/B testing with statistical significance
- Automatic rollback when model quality degrades >5%
- Batch inference with dynamic batch sizing
- Multi-modal support (text, image, video, audio)
- Federated learning and edge inference capabilities

### Non-Functional Requirements

- **Latency:** P99 < 20ms inference, P99.9 < 50ms during spikes
- **Request Rate:** 100M predictions/sec normal, 2B during viral events
- **Dataset Size:** 10k models, 100PB training data, 1EB logs
- **Availability:** 99.99% uptime, automatic failover between GPU clusters

### Constants/Assumptions

- **l4_enhanced:** true
- **prediction_qps:** 100000000
- **spike_multiplier:** 20
- **model_versions:** 1000
- **inference_batch_size:** 256
- **cache_hit_rate:** 0.8
- **gpu_count:** 100000
- **budget_monthly:** 10000000

### Available Components

- client
- lb
- app
- cache
- worker
- db_primary
- queue
- stream

### Hints

1. Batch requests for GPU efficiency
2. Cache common predictions

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: worker

**T1: Cache**
  - Must include: cache

**T2: Metrics**
  - Must include: stream

**T3: Scale**
  - Minimum 50 of type: worker

### Reference Solution

Gateway routes 95% to v1.0, 5% to v2.0 canary. Batches requests for GPU efficiency. Prediction cache provides 60% hit rate. Metrics streamed for A/B testing analysis. Model registry tracks versions. This teaches ML serving at scale.

**Components:**
- ML Clients (redirect_client)
- Load Balancer (lb)
- ML Gateway (app)
- Prediction Cache (cache)
- Batch Queue (queue)
- v1.0 Models (worker)
- v2.0 Canary (worker)
- Metrics Stream (stream)
- Model Registry (db_primary)

**Connections:**
- ML Clients → Load Balancer
- Load Balancer → ML Gateway
- ML Gateway → Prediction Cache
- ML Gateway → Batch Queue
- Batch Queue → v1.0 Models
- Batch Queue → v2.0 Canary
- ML Gateway → Metrics Stream
- ML Gateway → Model Registry

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 28. Real-time Fraud Detection Gateway

**ID:** fraud-detection-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

ML scoring under 5ms

### Goal

Detect fraud with sub-5ms latency.

### Description

Design a fraud detection gateway that scores every transaction in real-time with <5ms latency. Learn about feature engineering, model optimization, edge inference, and risk-based routing.

### Functional Requirements

- Score all transactions in real-time
- Extract features from transaction data
- Apply multiple fraud models
- Risk-based routing (block, challenge, allow)
- Real-time model updates
- Track fraud patterns
- Generate fraud alerts
- Support manual review queue

### Non-Functional Requirements

- **Latency:** P95 < 5ms scoring time
- **Request Rate:** 500k transactions/sec
- **Availability:** 99.99% uptime, <0.1% false positive rate, >95% fraud detection

### Constants/Assumptions

- **transaction_qps:** 500000
- **scoring_latency_ms:** 3
- **false_positive_rate:** 0.001
- **fraud_rate:** 0.01

### Available Components

- client
- lb
- app
- cache
- worker
- db_primary
- stream
- queue

### Hints

1. In-memory models for speed
2. Feature caching reduces latency

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Models**
  - Must include: worker

**T2: Alerts**
  - Must include: stream

**T3: Scale**
  - Minimum 100 of type: app

### Reference Solution

Gateway extracts features with 85% cache hit. In-memory models score in 3ms. High-risk transactions go to review queue. Fraud patterns streamed for real-time model updates. This teaches real-time ML at scale.

**Components:**
- Transactions (redirect_client)
- Load Balancer (lb)
- Fraud Gateway (app)
- Feature Cache (cache)
- Scoring Workers (worker)
- Fraud Stream (stream)
- Review Queue (queue)
- Fraud Patterns (db_primary)

**Connections:**
- Transactions → Load Balancer
- Load Balancer → Fraud Gateway
- Fraud Gateway → Feature Cache
- Fraud Gateway → Scoring Workers
- Fraud Gateway → Fraud Stream
- Scoring Workers → Review Queue
- Fraud Stream → Fraud Patterns

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 29. High-Frequency Trading Gateway

**ID:** hft-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Microsecond latency trading

### Goal

Route orders with <100μs latency.

### Description

Build an ultra-low latency gateway for high-frequency trading with microsecond routing, kernel bypass networking, and co-location optimization. Learn about tick-to-trade latency and deterministic performance.

### Functional Requirements

- Route orders to exchanges with <100μs latency
- Implement FIX protocol support
- Kernel bypass networking (DPDK)
- Lock-free data structures
- Deterministic garbage collection
- Hardware timestamping
- Market data fanout
- Order validation and risk checks

### Non-Functional Requirements

- **Latency:** P99 < 100μs tick-to-trade, <10μs jitter
- **Request Rate:** 1M orders/sec
- **Availability:** 99.999% uptime

### Constants/Assumptions

- **order_qps:** 1000000
- **target_latency_us:** 50
- **p99_latency_us:** 100
- **cpu_cores:** 128

### Available Components

- client
- lb
- app
- cache
- stream

### Hints

1. DPDK for kernel bypass
2. CPU pinning for latency

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 150 of type: app

**T1: Market Data**
  - Must include: stream

**T2: Risk**
  - Must include: cache

### Reference Solution

DPDK bypasses kernel for network I/O. Lock-free queues eliminate contention. CPU pinning reduces jitter. Hardware timestamping tracks latency. Risk checks in-memory. Co-located near exchanges. P99 < 100μs. This teaches microsecond-scale systems.

**Components:**
- Trading Algos (redirect_client)
- HFT Gateway (app)
- Risk Cache (cache)
- Market Data (stream)
- Exchange A (app)
- Exchange B (app)

**Connections:**
- Trading Algos → HFT Gateway
- HFT Gateway → Risk Cache
- HFT Gateway → Market Data
- HFT Gateway → Exchange A
- HFT Gateway → Exchange B

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 30. IoT Device Gateway

**ID:** iot-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Millions of devices with MQTT/CoAP

### Goal

Handle 10M+ IoT devices at scale.

### Description

Design an IoT gateway supporting millions of concurrent devices using MQTT and CoAP protocols. Learn about connection state management, message queuing, and efficient device addressing.

### Functional Requirements

- Support MQTT and CoAP protocols
- Handle 10M+ concurrent connections
- Implement QoS levels (0, 1, 2)
- Topic-based message routing
- Device authentication and authorization
- Offline message buffering
- Device shadow synchronization
- Firmware update distribution

### Non-Functional Requirements

- **Latency:** P95 < 100ms message delivery
- **Request Rate:** 5M messages/sec
- **Availability:** 99.9% uptime
- **Scalability:** 10M concurrent devices

### Constants/Assumptions

- **concurrent_devices:** 10000000
- **message_qps:** 5000000
- **avg_message_bytes:** 100
- **connection_duration_hours:** 24

### Available Components

- client
- lb
- app
- cache
- queue
- stream
- db_primary
- worker

### Hints

1. 50k devices per instance
2. Use MQTT keep-alive for efficiency

### Tiers/Checkpoints

**T0: Gateway**
  - Minimum 200 of type: app

**T1: State**
  - Must include: cache

**T2: Messages**
  - Must include: stream

**T3: Offline**
  - Must include: queue

### Reference Solution

Each gateway handles 40k devices. MQTT for persistent connections, CoAP for constrained devices. Device shadows in Redis. Messages streamed to processors. Offline messages queued for later delivery. This teaches IoT scale.

**Components:**
- IoT Devices (redirect_client)
- Load Balancer (lb)
- IoT Gateway (app)
- Device Shadow (cache)
- Telemetry Stream (stream)
- Offline Queue (queue)
- Device Registry (db_primary)
- Message Processors (worker)

**Connections:**
- IoT Devices → Load Balancer
- Load Balancer → IoT Gateway
- IoT Gateway → Device Shadow
- IoT Gateway → Telemetry Stream
- IoT Gateway → Offline Queue
- IoT Gateway → Device Registry
- Telemetry Stream → Message Processors

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $23,000,000
- Yearly Total: $276,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $15,000,000 (5000 × $100/month per instance)
- Storage: $5,000,000 (Database storage + backup + snapshots)
- Network: $2,500,000 (Ingress/egress + CDN distribution)

---

## 31. Blockchain RPC Gateway

**ID:** blockchain-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Node failover and rate limiting

### Goal

Reliable blockchain access at scale.

### Description

Build a blockchain RPC gateway with node failover, intelligent caching, and rate limiting. Learn about blockchain data consistency, mempool tracking, and WebSocket subscriptions for events.

### Functional Requirements

- Load balance across blockchain nodes
- Implement node health checking
- Cache immutable blockchain data
- Handle node sync lag
- Support WebSocket subscriptions
- Track mempool for pending txs
- Batch RPC calls
- Provide historical data archive

### Non-Functional Requirements

- **Latency:** P95 < 100ms for cached calls
- **Request Rate:** 300k RPC calls/sec
- **Availability:** 99.95% uptime, handle blockchain reorgs
- **Scalability:** Support 20+ nodes per chain

### Constants/Assumptions

- **rpc_qps:** 300000
- **blockchain_nodes:** 20
- **cache_hit_rate:** 0.7
- **reorg_depth:** 12

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker
- queue

### Hints

1. Cache finalized blocks
2. Route read-only to archive nodes

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Nodes**
  - Minimum 20 of type: app

**T2: Archive**
  - Must include: db_primary

**T3: Events**
  - Must include: stream

### Reference Solution

Gateway caches finalized blocks (70% hit rate). Full nodes handle recent data, archive nodes historical. Health checks detect sync lag. Events streamed to indexers. Handles 12-block reorgs. This teaches blockchain infrastructure at scale.

**Components:**
- dApp Clients (redirect_client)
- Load Balancer (lb)
- Blockchain GW (app)
- Block Cache (cache)
- Full Nodes (app)
- Archive Nodes (app)
- Historical DB (db_primary)
- Event Stream (stream)
- Indexers (worker)

**Connections:**
- dApp Clients → Load Balancer
- Load Balancer → Blockchain GW
- Blockchain GW → Block Cache
- Blockchain GW → Full Nodes
- Blockchain GW → Archive Nodes
- Archive Nodes → Historical DB
- Blockchain GW → Event Stream
- Event Stream → Indexers

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 300,000 QPS, the system uses 300 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 300,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $1250

*Peak Load:*
During 10x traffic spikes (3,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 3,000,000 requests/sec
- Cost/Hour: $12500

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $1,380,000
- Yearly Total: $16,560,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $900,000 (300 × $100/month per instance)
- Storage: $300,000 (Database storage + backup + snapshots)
- Network: $150,000 (Ingress/egress + CDN distribution)

---

## 32. Cloudflare-like Global Traffic Manager

**ID:** global-traffic-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Cloudflare-scale with 100M QPS and 10Tbps DDoS

### Goal

Build Cloudflare-scale global edge infrastructure.

### Description

Design a Cloudflare-scale global edge network handling 100M requests/sec across 300+ PoPs worldwide. Must mitigate 10Tbps DDoS attacks, maintain <5ms P99 edge latency, and survive simultaneous failures of 3 entire regions. Support 50M+ domains, real-time threat intelligence sharing, ML-based attack detection, and operate within $20M/month budget while handling nation-state level attacks.

### Functional Requirements

- Handle 100M requests/sec globally (10B during attacks)
- Deploy across 300+ edge locations in 100+ countries
- Mitigate 10Tbps volumetric DDoS attacks
- Support 50M+ customer domains with custom rules
- ML-based zero-day attack detection <100ms
- Real-time threat intelligence across all PoPs
- Anycast routing with <50ms convergence on failure
- Support HTTP/3, QUIC, and experimental protocols

### Non-Functional Requirements

- **Latency:** P99 < 5ms at edge, P99.9 < 10ms during attacks
- **Request Rate:** 100M requests/sec normal, 10B during nation-state attacks
- **Availability:** 99.999% uptime, survive 3 simultaneous region failures
- **Scalability:** 300+ edge locations, 100Tbps total capacity
- **Security:** Mitigate 10Tbps DDoS, nation-state APT defense

### Constants/Assumptions

- **l4_enhanced:** true
- **global_qps:** 100000000
- **spike_multiplier:** 100
- **edge_locations:** 300
- **attack_detection_ms:** 50
- **mitigation_capacity_tbps:** 10
- **domains_supported:** 50000000
- **budget_monthly:** 20000000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- stream
- worker
- queue

### Hints

1. Anycast IP for automatic geo-routing
2. SYN cookies for SYN flood protection

### Tiers/Checkpoints

**T0: Edge**
  - Minimum 3 of type: cdn

**T1: Protection**
  - Must include: worker

**T2: Analytics**
  - Must include: stream

**T3: Scale**
  - Minimum 100 of type: app

### Reference Solution

Anycast routing directs traffic to nearest edge. Each edge has 75% cache hit rate and DDoS detection. Attack patterns trigger automatic mitigation. Rate limiting at edge prevents origin overload. This teaches global traffic management at scale.

**Components:**
- Global Traffic (redirect_client)
- US Edge (cdn)
- EU Edge (cdn)
- APAC Edge (cdn)
- Regional LB (lb)
- Edge Proxy (app)
- Rate Limit Cache (cache)
- DDoS Detector (worker)
- Attack Stream (stream)
- WAF Rules (db_primary)
- Mitigation Queue (queue)

**Connections:**
- Global Traffic → US Edge
- Global Traffic → EU Edge
- Global Traffic → APAC Edge
- US Edge → Regional LB
- EU Edge → Regional LB
- APAC Edge → Regional LB
- Regional LB → Edge Proxy
- Edge Proxy → Rate Limit Cache
- Edge Proxy → DDoS Detector
- DDoS Detector → Attack Stream
- Edge Proxy → WAF Rules
- Attack Stream → Mitigation Queue

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 33. Edge Compute Gateway (Cloudflare Workers)

**ID:** edge-compute-gateway
**Category:** gateway
**Difficulty:** Advanced

### Summary

Run code at CDN edge for low latency

### Goal

Execute logic closest to users.

### Description

Design an edge compute platform that runs serverless functions at CDN edge locations. Handle cold starts, quota enforcement, and execution isolation at global scale.

### Functional Requirements

- Deploy functions to 100+ edge locations
- Isolate tenant execution
- Enforce CPU/memory quotas
- Handle cold start optimization
- Support multiple runtimes
- Provide edge KV storage

### Non-Functional Requirements

- **Latency:** P50 < 5ms, P95 < 15ms, cold start < 50ms
- **Request Rate:** 5M req/s globally across edges
- **Dataset Size:** 100k functions, 1MB avg size
- **Data Durability:** Function code replicated to all edges
- **Availability:** 99.99% uptime
- **Scalability:** Support 1M functions deployed

### Constants/Assumptions

- **global_qps:** 5000000
- **edge_count:** 150
- **function_count:** 100000
- **cold_start_target_ms:** 50

### Available Components

- client
- cdn
- app
- cache
- db_primary
- queue

### Hints

1. V8 isolates for fast cold starts
2. Keep warm pool of workers

### Tiers/Checkpoints

**T0: Edge**
  - Must include: cdn

**T1: Compute**
  - Must include: app

**T2: Storage**
  - Must include: cache

### Reference Solution

V8 isolates achieve <50ms cold starts. Functions deployed to all edges via queue. Edge KV for fast data access. Quota enforcement prevents runaway costs. This teaches edge compute at scale.

**Components:**
- Global Users (redirect_client)
- US Edge (cdn)
- EU Edge (cdn)
- APAC Edge (cdn)
- Edge Workers (app)
- Edge KV (cache)
- Deployment Queue (queue)
- Function Registry (db_primary)

**Connections:**
- Global Users → US Edge
- Global Users → EU Edge
- Global Users → APAC Edge
- US Edge → Edge Workers
- EU Edge → Edge Workers
- APAC Edge → Edge Workers
- Edge Workers → Edge KV
- Deployment Queue → Edge Workers
- Edge Workers → Function Registry

### Solution Analysis

**Architecture Overview:**

API gateway pattern for high-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $23,000,000
- Yearly Total: $276,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $15,000,000 (5000 × $100/month per instance)
- Storage: $5,000,000 (Database storage + backup + snapshots)
- Network: $2,500,000 (Ingress/egress + CDN distribution)

---

## 34. API Response Caching Gateway

**ID:** api-caching-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Cache API responses at gateway layer

### Goal

Reduce backend load with smart caching.

### Description

Design an API gateway that caches responses based on URL patterns, headers, and query parameters. Implement cache invalidation strategies, vary headers, and conditional requests.

### Functional Requirements

- Cache GET requests by URL+headers
- Support cache control headers
- Implement conditional requests (ETag, Last-Modified)
- Vary cache by query params
- Tag-based cache invalidation
- Bypass cache for authenticated requests

### Non-Functional Requirements

- **Latency:** P95 < 15ms cache hit, P95 < 100ms cache miss
- **Request Rate:** 50k req/s (40k cacheable)
- **Dataset Size:** 10GB cache, 1M unique URLs
- **Data Durability:** Cache ephemeral, rebuild from backend
- **Availability:** 99.95% uptime
- **Scalability:** 10x traffic spikes during events

### Constants/Assumptions

- **request_rate:** 50000
- **cache_hit_target:** 0.8
- **backend_capacity:** 10000

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Use Vary header for cache keys
2. Implement surrogate-control for origin hints

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: app

**T1: Cache**
  - Must include: cache

**T2: Hit Rate**
  - Parameter range check: cache.hit_rate

### Reference Solution

85% cache hit rate offloads backend. Gateway checks cache first, serves from backend on miss. Conditional requests reduce bandwidth. Tag-based invalidation for updates. This teaches API caching patterns.

**Components:**
- API Clients (redirect_client)
- LB (lb)
- API Gateway (app)
- Response Cache (cache)
- Backend API (app)

**Connections:**
- API Clients → LB
- LB → API Gateway
- API Gateway → Response Cache
- API Gateway → Backend API

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 35. Service Discovery Gateway (Consul/Eureka)

**ID:** service-discovery-gateway
**Category:** gateway
**Difficulty:** Intermediate

### Summary

Dynamic service routing with health checks

### Goal

Route to healthy services automatically.

### Description

Design an API gateway with service discovery integration. Automatically detect new service instances, perform health checks, and route traffic only to healthy endpoints.

### Functional Requirements

- Auto-discover service instances
- Perform active health checks
- Route to healthy endpoints only
- Support multiple service versions
- Load balance across instances
- Handle service failures gracefully

### Non-Functional Requirements

- **Latency:** P95 < 20ms routing decision
- **Request Rate:** 100k req/s across all services
- **Dataset Size:** 1000 service instances, 100 services
- **Data Durability:** Service registry rebuilt from discovery
- **Availability:** 99.99% uptime with failover
- **Scalability:** Support 10k service instances

### Constants/Assumptions

- **request_rate:** 100000
- **service_count:** 100
- **instance_count:** 1000
- **health_check_interval_s:** 5

### Available Components

- client
- lb
- app
- db_primary
- cache

### Hints

1. Use Consul/Eureka for service registry
2. Cache healthy endpoints

### Tiers/Checkpoints

**T0: Discovery**
  - Must include: db_primary

**T1: Health**
  - Must include: cache

### Reference Solution

Gateway queries service registry for endpoints. Health checks update cache every 5s. Routes only to healthy instances. Graceful degradation on discovery failure. This teaches service mesh patterns.

**Components:**
- Clients (redirect_client)
- LB (lb)
- Gateway (app)
- Health Cache (cache)
- Service Registry (db_primary)
- Services (app)

**Connections:**
- Clients → LB
- LB → Gateway
- Gateway → Health Cache
- Gateway → Service Registry
- Gateway → Services

### Solution Analysis

**Architecture Overview:**

API gateway pattern for moderate-scale microservices orchestration. Centralized authentication, rate limiting, and request routing with service mesh for inter-service communication.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Service discovery and circuit breakers ensure reliable routing.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Rate limiting and request queuing manage overload.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through circuit breakers and fallback responses. Automatic failover ensures continuous operation.
- Redundancy: Multiple gateway instances with health checks
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. API Gateway
   - Pros:
     - Centralized control
     - Built-in features
     - Easy monitoring
   - Cons:
     - Single point of failure
     - Added latency
   - Best for: Microservices with diverse clients
   - Cost: Gateway cost offset by reduced service complexity

2. Service Mesh
   - Pros:
     - Decentralized
     - Zero-trust security
     - Fine-grained control
   - Cons:
     - Complex setup
     - Resource overhead
   - Best for: Large-scale microservices
   - Cost: Higher resource usage, better at scale

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---
