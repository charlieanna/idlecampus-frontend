import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  costOptimizationValidator,
} from '../../validation/validators/commonValidators';
import {
  cacheStrategyConsistencyValidator,
} from '../../validation/validators/cachingValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * YouTube - Video Sharing Platform
 * Comprehensive FR and NFR scenarios with DDIA/SDP concepts
 *
 * DDIA Concepts Applied:
 * - Chapter 5 (Replication): Multi-region replication for global video availability
 * - Chapter 6 (Partitioning): Partition videos by video_id, users by user_id
 * - Chapter 11 (Stream Processing): Real-time view count updates, trending videos
 * - Chapter 10 (Batch Processing): Video transcoding pipeline (async job processing)
 *
 * System Design Primer - Load Balancing (Deep Dive):
 *
 * YouTube handles billions of requests daily, requiring sophisticated load balancing
 * across multiple layers. We'll explore Layer 4 vs Layer 7 load balancing and
 * various algorithms.
 *
 * Layer 4 vs Layer 7 Load Balancing:
 * ===================================
 *
 * Layer 4 (Transport Layer) - TCP/UDP Load Balancing:
 * - Operates on IP address and port only (no application data inspection)
 * - Fast: No need to decrypt SSL or parse HTTP
 * - Latency: < 1ms overhead
 * - Use case: High-throughput video streaming (no need to inspect video data)
 *
 * Example: AWS NLB (Network Load Balancer)
 * - Client → NLB (L4) → Backend server
 * - NLB forwards TCP packets based on IP:Port
 * - Maintains connection state (flow hash)
 *
 * Layer 7 (Application Layer) - HTTP Load Balancing:
 * - Inspects HTTP headers, cookies, URL paths
 * - Slower: Must terminate SSL, parse HTTP headers
 * - Latency: 2-10ms overhead (SSL handshake + HTTP parsing)
 * - Use case: Route API requests based on path (/api/upload → upload servers)
 *
 * Example: AWS ALB (Application Load Balancer)
 * - Client → ALB (L7) → Backend server
 * - ALB can route:
 *   - /api/upload → upload server pool
 *   - /api/watch → streaming server pool
 *   - /api/search → search server pool
 *
 * YouTube's Load Balancing Architecture:
 * =======================================
 *
 * Frontend (User-facing):
 * Layer 7 ALB → Routes based on API path
 *   - GET /watch?v=xyz → Video Streaming Servers (read-heavy)
 *   - POST /upload → Video Upload Servers (write-heavy, different resource needs)
 *   - GET /search → Search Servers (Elasticsearch backend)
 *   - GET /trending → Trending API Servers (cached responses)
 *
 * Backend (Internal services):
 * Layer 4 NLB → Fast TCP routing for internal microservices
 *   - Video transcoding workers
 *   - Database connection pooling
 *   - Kafka brokers
 *
 *
 * Load Balancing Algorithms:
 * ==========================
 *
 * 1. Round Robin (Simple, Stateless):
 * -----------------------------------
 * Distribute requests sequentially across servers.
 *
 * Servers: [Server1, Server2, Server3]
 * Request 1 → Server1
 * Request 2 → Server2
 * Request 3 → Server3
 * Request 4 → Server1 (wrap around)
 *
 * Pros:
 * - Simple to implement
 * - Fair distribution if all servers are equal
 * - No state required (stateless)
 *
 * Cons:
 * - Doesn't account for server load (CPU, memory, connections)
 * - Doesn't account for request complexity (1s video vs 60min video)
 * - Can overload slow servers
 *
 * Best For: Homogeneous servers with similar request patterns
 * YouTube Use Case: Distributing simple API requests (GET /video/metadata)
 *
 *
 * 2. Weighted Round Robin:
 * ------------------------
 * Assign weights based on server capacity (more powerful servers get more requests).
 *
 * Servers:
 * - Server1 (weight: 5) - New, powerful server (32 CPU cores)
 * - Server2 (weight: 3) - Medium server (16 CPU cores)
 * - Server3 (weight: 2) - Old, weaker server (8 CPU cores)
 *
 * Distribution (10 requests):
 * - Server1 gets 5 requests (50%)
 * - Server2 gets 3 requests (30%)
 * - Server3 gets 2 requests (20%)
 *
 * Pros:
 * - Accounts for heterogeneous server capacity
 * - Better utilization of powerful servers
 *
 * Cons:
 * - Still doesn't consider real-time load
 * - Static weights (must manually update when adding servers)
 *
 * Best For: Mixed server types (different instance sizes)
 * YouTube Use Case: Video transcoding workers (c5.xlarge, c5.2xlarge, c5.4xlarge)
 *
 *
 * 3. Least Connections:
 * ---------------------
 * Route to server with fewest active connections (dynamic load balancing).
 *
 * Server States:
 * - Server1: 10 active connections
 * - Server2: 5 active connections  ← Route here
 * - Server3: 15 active connections
 *
 * New request → Server2 (least connections)
 *
 * Pros:
 * - Adapts to real-time server load
 * - Better than round-robin for long-lived connections
 *
 * Cons:
 * - Connection count ≠ actual load (1 heavy request > 10 light requests)
 * - Requires tracking state (connection counts)
 *
 * Best For: Long-lived connections (WebSocket, video streaming)
 * YouTube Use Case: Video upload connections (long HTTP POST, 1GB files)
 *
 *
 * 4. Least Response Time (Latency-Based):
 * ----------------------------------------
 * Route to server with lowest average response time.
 *
 * Server Metrics (last 1 minute):
 * - Server1: avg 50ms response time
 * - Server2: avg 200ms response time (slow disk?)
 * - Server3: avg 45ms response time  ← Route here
 *
 * Pros:
 * - Accounts for real performance (CPU, disk, network)
 * - Automatically avoids slow/degraded servers
 *
 * Cons:
 * - Requires health checks and metrics collection
 * - Can create hot spots (all traffic to fastest server)
 *
 * Best For: Heterogeneous backends with varying performance
 * YouTube Use Case: Search API (some Elasticsearch nodes may be slower)
 *
 *
 * 5. IP Hash (Session Affinity / Sticky Sessions):
 * -------------------------------------------------
 * Route based on hash of client IP (same client → same server).
 *
 * hash(client_ip) % num_servers = server_index
 *
 * Client 192.168.1.100 → hash = 12345 → 12345 % 3 = 0 → Server1 (always)
 * Client 192.168.1.101 → hash = 67890 → 67890 % 3 = 1 → Server2 (always)
 *
 * Pros:
 * - Session affinity (user's data cached on same server)
 * - Useful for in-memory sessions (no need for Redis)
 *
 * Cons:
 * - Uneven distribution if some IPs generate more traffic
 * - Server failure disrupts sessions for that IP range
 * - Doesn't work behind NAT/proxies (many users share 1 IP)
 *
 * Best For: Stateful applications with in-memory sessions
 * YouTube Use Case: Personalized recommendation cache (user's history on same server)
 *
 *
 * 6. Consistent Hashing (Advanced IP Hash):
 * ------------------------------------------
 * Improved IP hash that minimizes disruption when servers are added/removed.
 *
 * Traditional hash problem:
 * - 3 servers: hash(IP) % 3 = server_index
 * - Add 4th server: hash(IP) % 4 = new_index (all mappings change!)
 *
 * Consistent hashing solution:
 * - Hash both IPs and servers onto a ring (0-360 degrees)
 * - Client IP → nearest server on ring
 * - Add/remove server → only nearby clients remapped (not all)
 *
 * Pros:
 * - Minimal remapping when scaling (add/remove servers)
 * - Better than IP hash for dynamic server pools
 *
 * Cons:
 * - More complex to implement (requires hash ring)
 *
 * Best For: Dynamic server pools (auto-scaling)
 * YouTube Use Case: CDN edge caching (cache shards that scale up/down)
 *
 *
 * Health Checks and Failover:
 * ===========================
 *
 * Active Health Checks:
 * - Load balancer periodically pings backend servers (GET /health)
 * - Interval: every 5 seconds
 * - Timeout: 2 seconds
 * - Unhealthy threshold: 3 consecutive failures
 * - Healthy threshold: 2 consecutive successes
 *
 * Example Health Check Endpoint:
 * GET /health
 * Response:
 * {
 *   "status": "healthy",
 *   "checks": {
 *     "database": "ok",
 *     "disk_space": "ok (80% free)",
 *     "cpu": "ok (30% usage)"
 *   }
 * }
 *
 * Passive Health Checks:
 * - Monitor actual traffic (not synthetic pings)
 * - If server returns 5xx errors for 50% of requests → mark unhealthy
 * - Less overhead (no extra health check requests)
 *
 * Failover Strategy:
 * - Server fails health check → Remove from pool
 * - Retry failed requests on different server (automatic retry)
 * - Server recovers → Add back to pool (with slow ramp-up)
 *
 *
 * SSL/TLS Termination:
 * ====================
 *
 * Option 1: SSL Termination at Load Balancer (Common)
 * - Client → HTTPS → Load Balancer (decrypts) → HTTP → Backend
 * - Pro: Backend doesn't need to decrypt (faster, less CPU)
 * - Con: Internal traffic is unencrypted (ok in VPC)
 *
 * Option 2: End-to-End Encryption
 * - Client → HTTPS → Load Balancer → HTTPS → Backend
 * - Pro: Encrypted all the way (more secure)
 * - Con: Backend must decrypt (more CPU usage)
 *
 * YouTube Choice: SSL termination at load balancer
 * - Internal network is trusted (VPC)
 * - Backend CPU saved for video processing
 *
 *
 * YouTube-Specific Load Balancing Strategy:
 * ==========================================
 *
 * Use Case 1: Video Streaming (Watch API)
 * - Layer: L4 (fast TCP routing, no need to inspect video data)
 * - Algorithm: Least connections (streaming = long-lived connections)
 * - Health Check: Active ping every 10s
 * - Sticky Sessions: No (stateless, video served from CDN)
 *
 * Use Case 2: Video Upload (Upload API)
 * - Layer: L7 (route /api/upload to specialized servers)
 * - Algorithm: Least connections (uploads are long HTTP POSTs)
 * - Health Check: Check disk space (uploads need storage)
 * - Sticky Sessions: Yes (resume failed uploads to same server)
 *
 * Use Case 3: Search API
 * - Layer: L7 (route /api/search to Elasticsearch cluster)
 * - Algorithm: Least response time (avoid slow ES nodes)
 * - Health Check: Query response time (ping ES cluster)
 * - Sticky Sessions: No (stateless search)
 *
 * Use Case 4: Trending API (Cached Data)
 * - Layer: L7 (route /api/trending)
 * - Algorithm: Round-robin (responses are cached, all servers equal)
 * - Health Check: Active ping
 * - Sticky Sessions: No
 *
 *
 * Multi-Region Load Balancing (Global):
 * ======================================
 *
 * DNS-Based Load Balancing (Route 53, CloudFlare):
 * - User in US → Resolve youtube.com → US data center IP
 * - User in EU → Resolve youtube.com → EU data center IP
 * - Latency-based routing (lowest network latency)
 * - Geo-routing (comply with data residency laws)
 *
 * Anycast Routing (Advanced):
 * - Same IP announced from multiple data centers
 * - Network routes user to nearest data center (BGP routing)
 * - Used by CDNs (Cloudflare, Akamai)
 *
 *
 * Autoscaling Integration:
 * ========================
 *
 * Load Balancer + Autoscaling Group:
 * - Monitor: Average CPU across servers > 70%
 * - Action: Add 2 more servers to pool
 * - Load balancer automatically discovers new servers (service discovery)
 * - Gradual ramp-up (new server gets 10%, 20%, 50%, 100% traffic)
 *
 * Scale-down:
 * - Monitor: Average CPU < 30% for 10 minutes
 * - Action: Remove 1 server from pool
 * - Graceful shutdown: Stop sending new requests, wait for existing to finish
 *
 *
 * System Design Primer - Other Concepts:
 * - CDN: Global edge caching for video chunks (similar to Netflix)
 * - Object Storage: S3 for video files (master copies + transcoded versions)
 * - Async Job Processing: Video transcoding (multiple formats, resolutions)
 * - Message Queue: Async upload processing, notification fan-out for subscribers
 * - Caching: Metadata caching (video info, comments, channel data)
 */
export const youtubeProblemDefinition: ProblemDefinition = {
  id: 'youtube',
  title: 'YouTube - Video Sharing',
  description: `Design a video sharing platform like YouTube that:
- Users can upload and share videos
- Users can watch, like, comment on videos
- Users can subscribe to channels
- Videos are recommended based on viewing history

Learning Objectives (DDIA/SDP):
1. Master Layer 4 vs Layer 7 load balancing (SDP):
   - L4 (TCP/UDP): Fast, < 1ms overhead for video streaming
   - L7 (HTTP): Path-based routing for API endpoints
2. Implement load balancing algorithms (SDP):
   - Round-robin: Simple, stateless (homogeneous servers)
   - Weighted round-robin: Account for server capacity
   - Least connections: Dynamic load balancing (long uploads)
   - Least response time: Avoid slow/degraded servers
   - IP hash: Session affinity for caching
   - Consistent hashing: Minimize remapping when scaling
3. Design health checks and failover (SDP):
   - Active health checks (periodic pings)
   - Passive health checks (monitor traffic)
   - Graceful shutdown and ramp-up
4. Implement SSL termination strategies (SDP)
5. Integrate load balancing with autoscaling (SDP)
6. Design multi-region DNS-based load balancing (SDP)
7. Use CDN for global video distribution (SDP - CDN)
8. Async video transcoding with message queues (DDIA Ch. 10: Batch processing)
9. Partition data by video_id and user_id (DDIA Ch. 6)
10. Real-time view count updates via stream processing (DDIA Ch. 11)
11. Replicate metadata across regions (DDIA Ch. 5)
12. Handle eventual consistency for view counts/likes (DDIA Ch. 9)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload and share videos',
    'Users can watch, like, comment on videos',
    'Users can subscribe to channels'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'L4 load balancer latency: < 1ms overhead (SDP: NLB for video streaming)',
    'L7 load balancer latency: < 10ms overhead (SDP: ALB for API routing)',
    'Upload server selection: Least connections algorithm (SDP: Long-lived connections)',
    'Search server selection: Least response time algorithm (SDP: Avoid slow ES nodes)',
    'Health check interval: 5s with 3-failure threshold (SDP: Active health checks)',
    'Failover time: < 10s to remove unhealthy server (SDP: Automatic failover)',
    'SSL termination: At load balancer (SDP: Save backend CPU for video processing)',
    'Autoscaling trigger: CPU > 70% for 5 minutes (SDP: Scale-up)',
    'Autoscaling ramp-up: Gradual (10% → 20% → 50% → 100% traffic)',
    'Multi-region routing: Latency-based DNS (SDP: Route 53)',
    'Upload processing: Transcode to 3+ formats within 5 minutes (DDIA Ch. 10: Batch jobs)',
    'Video start time: p99 < 2s (SDP: CDN edge serving)',
    'Buffering ratio: < 0.1% of playback time (SDP: Adaptive bitrate)',
    'CDN cache hit ratio: > 90% for popular videos (SDP: Edge caching)',
    'View count update lag: < 30s (DDIA Ch. 11: Stream processing)',
    'Availability: 99.9% uptime (DDIA Ch. 5: Multi-region replication)',
    'Metadata latency: p99 < 200ms (SDP: Metadata caching)',
    'Scalability: 500+ hours of video uploaded per minute (DDIA Ch. 6: Partitioning)',
    'Subscriber notification: < 5 minutes for new video alerts (SDP: Message queue fan-out)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process uploads, transcoding, streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store video metadata, comments, users',
      },
      {
        type: 'object_storage',
        reason: 'Need to store video files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write video metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/stream videos',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'comment', 'subscription', 'like'],
      fields: {
        user: ['id', 'email', 'channel_name', 'created_at'],
        video: ['id', 'channel_id', 'title', 'description', 'video_url', 'thumbnail_url', 'views', 'created_at'],
        comment: ['id', 'video_id', 'user_id', 'text', 'created_at'],
        subscription: ['subscriber_id', 'channel_id', 'created_at'],
        like: ['video_id', 'user_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading videos
        { type: 'read_by_key', frequency: 'very_high' }, // Watching videos
        { type: 'write', frequency: 'very_high' },    // Comments, likes
      ],
    },
  },

  scenarios: generateScenarios('youtube', problemConfigs.youtube),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
    },
    {
      name: 'Cache Strategy Consistency (SDP - Caching)',
      validate: cacheStrategyConsistencyValidator,
    },
    {
      name: 'Cost Optimization (DDIA - Trade-offs)',
      validate: costOptimizationValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
videos = {}
comments = {}
subscriptions = {}
likes = {}

def upload_video(video_id: str, channel_id: str, title: str, description: str, video_url: str) -> Dict:
    """
    FR-1: Users can upload and share videos
    Naive implementation - stores video metadata in memory
    """
    videos[video_id] = {
        'id': video_id,
        'channel_id': channel_id,
        'title': title,
        'description': description,
        'video_url': video_url,
        'thumbnail_url': f"{video_url}_thumb.jpg",
        'views': 0,
        'created_at': datetime.now()
    }
    return videos[video_id]

def watch_video(video_id: str) -> Dict:
    """
    FR-2: Users can watch videos
    Naive implementation - increments view count
    """
    if video_id in videos:
        videos[video_id]['views'] += 1
        return videos[video_id]
    return None

def like_video(video_id: str, user_id: str) -> Dict:
    """
    FR-2: Users can like videos
    Naive implementation - stores like in memory
    """
    like_id = f"{video_id}_{user_id}"
    likes[like_id] = {
        'video_id': video_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    return likes[like_id]

def comment_on_video(comment_id: str, video_id: str, user_id: str, text: str) -> Dict:
    """
    FR-2: Users can comment on videos
    Naive implementation - stores comment in memory
    """
    comments[comment_id] = {
        'id': comment_id,
        'video_id': video_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def subscribe_to_channel(subscriber_id: str, channel_id: str) -> Dict:
    """
    FR-3: Users can subscribe to channels
    Naive implementation - stores subscription in memory
    """
    subscription_key = f"{subscriber_id}_{channel_id}"
    subscriptions[subscription_key] = {
        'subscriber_id': subscriber_id,
        'channel_id': channel_id,
        'created_at': datetime.now()
    }
    return subscriptions[subscription_key]

def get_subscribed_videos(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get videos from subscribed channels
    Naive implementation - returns videos from subscribed channels
    """
    # Get all channels this user subscribes to
    subscribed_channels = []
    for sub in subscriptions.values():
        if sub['subscriber_id'] == user_id:
            subscribed_channels.append(sub['channel_id'])

    # Get all videos from subscribed channels
    feed = []
    for video in videos.values():
        if video['channel_id'] in subscribed_channels:
            feed.append(video)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]
`,
};
