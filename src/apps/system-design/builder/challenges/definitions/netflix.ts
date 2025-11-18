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
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Netflix - Video Streaming Platform
 * DDIA Ch. 8 (Distributed Systems) - CDN Edge Failures & Network Partitions
 * DDIA Ch. 11 (Stream Processing) - Real-time Streaming Analytics
 *
 * DDIA Concepts Applied:
 * - Ch. 8: CDN edge server failures and fallback to origin
 *   - Edge cache miss or edge server down → Route to origin or next-closest edge
 *   - Circuit breaker pattern: Detect edge failure, open circuit, route around
 *   - Graceful degradation: Serve lower quality video during high load
 * - Ch. 8: Network partitions between origin and CDN edges
 *   - Partition isolates edge from origin → Serve stale cached content
 *   - Bounded staleness: Catalog updates < 5 min stale acceptable
 *   - Trade-off: Availability (serve stale) vs Consistency (wait for origin)
 * - Ch. 8: Handling partial failures in watch history sync
 *   - User watches on TV → Syncs to phone (async replication)
 *   - Network fails midway → Eventually consistent, retry with backoff
 *   - Last-write-wins conflict resolution: Latest timestamp wins
 * - Ch. 8: Distributed coordination for video encoding jobs
 *   - 1000s of encoding workers processing video chunks in parallel
 *   - Leader-worker pattern: Leader assigns chunks, detects worker failures
 *   - Worker failure → Reassign chunk to another worker (idempotent)
 * - Ch. 8: Clock synchronization for video playback timestamps
 *   - Video chunks timestamped for seamless playback
 *   - NTP clock sync across CDN edges (±50ms)
 *   - Logical clocks for ordering watch history events
 *
 * CDN Edge Failure (DDIA Ch. 8):
 * Scenario: User in Tokyo requests video, local edge server fails
 *
 * Without Failover:
 * 1. Client requests chunk: GET /video/ep1/chunk_00001.ts
 * 2. DNS resolves to tokyo-edge-01 (closest edge)
 * 3. tokyo-edge-01 is down → Request times out (10s)
 * 4. User experiences buffering
 *
 * With Circuit Breaker + Fallback:
 * 1. Client requests chunk: GET /video/ep1/chunk_00001.ts
 * 2. DNS resolves to tokyo-edge-01
 * 3. Health check detects tokyo-edge-01 down → Circuit OPEN
 * 4. Fallback to tokyo-edge-02 (next closest edge) → < 100ms
 * 5. If all Tokyo edges down → Fallback to Seoul edge → < 300ms
 * 6. If all edges down (rare) → Fallback to origin → < 1s
 *
 * Network Partition Between Origin and Edge (DDIA Ch. 8):
 * New TV show released → Origin updates catalog
 *
 * Without Partition Tolerance:
 * - Edge waits for origin catalog update → Timeout → User sees old catalog
 *
 * With Eventual Consistency (Chosen by Netflix):
 * T0: Origin publishes new show "Stranger Things Season 5"
 * T1 (30s): US edges receive catalog update (fast path)
 * T2 (5 min): EU edges receive catalog update (network partition delays)
 * T5 (5 min): Asia edges receive catalog update
 * → Trade-off: Some users see new content 5 min later, but system remains available
 *
 * Circuit Breaker Pattern (DDIA Ch. 8):
 * State machine: CLOSED → OPEN → HALF_OPEN → CLOSED
 *
 * CLOSED (normal operation):
 * - Requests flow to edge server
 * - Track failure rate: If >50% failures in 10s → Open circuit
 *
 * OPEN (edge server unhealthy):
 * - All requests immediately fail over to backup edge
 * - After 30s → Transition to HALF_OPEN
 *
 * HALF_OPEN (testing recovery):
 * - Send 10% of requests to original edge server
 * - If success rate >90% → Close circuit (resume normal)
 * - If failures continue → Reopen circuit
 *
 * Graceful Degradation (DDIA Ch. 8):
 * High load scenario: 10M users watching playoff game simultaneously
 *
 * Level 1 (p99 < 2s):
 * - Serve all users at requested quality (4K, 1080p, 720p)
 *
 * Level 2 (load spike, origin struggling):
 * - Adaptive bitrate: Automatically downgrade 4K → 1080p for some users
 * - Reduces bandwidth by 50%
 *
 * Level 3 (severe load):
 * - Disable catalog browsing (read-only mode)
 * - Only allow video playback for ongoing sessions
 * - Queue new session requests
 *
 * Watch History Conflict Resolution (DDIA Ch. 8):
 * User watches on two devices simultaneously (TV + phone)
 *
 * T0: TV at 10:00 timestamp
 * T1: Phone at 12:00 timestamp (user skipped ahead)
 * T2: TV at 11:00 timestamp (behind phone)
 *
 * Conflict: Which timestamp to save?
 * Solution: Last-write-wins (LWW) based on server timestamp
 * - TV update arrives first → Save 11:00
 * - Phone update arrives second → Overwrites with 12:00
 * → Final: 12:00 (user's phone was ahead)
 *
 * DDIA Ch. 11 - Stream Processing for Real-time Analytics:
 *
 * Event Stream Architecture:
 * 1. Viewing Events → Kafka Topic: "playback-events"
 *    {user_id, video_id, timestamp, event_type, position, quality, device_type}
 *    Event Types: play, pause, seek, buffer, quality_change, completion
 *    Published every 10 seconds during playback + on-demand events
 *
 * 2. Stream Processors:
 *    a) Real-time Quality Monitoring
 *    b) Personalization Engine (viewing patterns)
 *    c) Content Popularity Tracker
 *    d) A/B Test Analytics
 *
 * Windowed Aggregations for Quality Monitoring (DDIA Ch. 11):
 *
 * Tumbling Window (1-minute intervals):
 * - Count buffer events per CDN edge per minute
 * - Calculate average bitrate per region
 * - Track quality degradation incidents
 *
 * Example Pipeline - Buffer Rate Monitoring:
 * playbackEvents.stream()
 *   .filter(event => event.type == 'buffer')
 *   .groupBy(event => event.cdn_edge_id)
 *   .windowedBy(TumblingWindow.of(Duration.ofMinutes(1)))
 *   .count()
 *   .toStream()
 *   .filter((edge, bufferCount) => bufferCount > 1000)  // Alert threshold
 *   .to("quality-alerts")
 *
 * Window 1 (10:00:00 - 10:00:59):
 *   US-East-Edge-01: 150 buffer events (normal)
 *   US-West-Edge-03: 2,500 buffer events (ALERT!)
 *   EU-Central-Edge-02: 80 buffer events (normal)
 *
 * Sliding Window for Viewing Patterns (DDIA Ch. 11):
 *
 * Sliding Window (5-minute window, 1-minute slide):
 * - Track concurrent viewers per show
 * - Detect viral content (rapid viewership growth)
 * - Predict server load
 *
 * playbackEvents.stream()
 *   .filter(event => event.type == 'play')
 *   .groupBy(event => event.video_id)
 *   .windowedBy(SlidingWindow.of(Duration.ofMinutes(5)).advanceBy(Duration.ofMinutes(1)))
 *   .count()
 *   .toStream()
 *   .map((video, count, windowEnd) => ({
 *     video_id: video,
 *     concurrent_viewers: count,
 *     timestamp: windowEnd
 *   }))
 *   .to("popularity-trends")
 *
 * Session Windows for Binge-Watching Detection (DDIA Ch. 11):
 *
 * Session Window (gap: 30 minutes):
 * - Group consecutive viewing events into "sessions"
 * - If gap > 30 min → New session
 * - Track binge-watching patterns for recommendations
 *
 * playbackEvents.stream()
 *   .groupBy(event => event.user_id)
 *   .windowedBy(SessionWindows.with(Duration.ofMinutes(30)))
 *   .aggregate(
 *     () => new ViewingSession(),
 *     (user, event, session) => session.addEvent(event)
 *   )
 *   .toStream()
 *   .filter((user, session) => session.episodesWatched >= 3)  // Binge detected
 *   .to("binge-recommendations")
 *
 * Example Session:
 * User 123:
 *   Session 1: 8:00 PM - 11:30 PM (watched 6 episodes of Stranger Things)
 *   [30 min gap]
 *   Session 2: 12:00 AM - 12:45 AM (watched 1 episode of The Crown)
 *
 * Stream-Table Join for Personalization (DDIA Ch. 11):
 *
 * Stream: playback-events (viewing activity)
 * Table: user-profiles (KTable from database CDC)
 *
 * playbackEvents.stream()
 *   .join(
 *     userProfiles.table(),
 *     (event, profile) => ({
 *       user_id: event.user_id,
 *       video_id: event.video_id,
 *       genre: lookupGenre(event.video_id),
 *       user_preferences: profile.preferred_genres,
 *       viewing_time: event.timestamp
 *     })
 *   )
 *   .filter((key, enriched) => enriched.genre in enriched.user_preferences)
 *   .to("personalization-signals")
 *
 * Real-time A/B Test Analytics (DDIA Ch. 11):
 *
 * Scenario: Test new recommendation algorithm
 * Control Group: 50% of users (existing algo)
 * Treatment Group: 50% of users (new algo)
 *
 * Metrics to Track (real-time):
 * - Click-through rate (CTR)
 * - Average watch time per session
 * - Completion rate
 *
 * playbackEvents.stream()
 *   .join(abTestAssignments.table(), (event, assignment) => ({
 *     user_id: event.user_id,
 *     variant: assignment.variant,  // 'control' or 'treatment'
 *     event_type: event.type,
 *     duration: event.duration
 *   }))
 *   .groupBy(data => data.variant)
 *   .windowedBy(TumblingWindow.of(Duration.ofMinutes(5)))
 *   .aggregate(
 *     () => new ABTestMetrics(),
 *     (variant, data, metrics) => metrics.update(data)
 *   )
 *   .toStream()
 *   .to("ab-test-results")
 *
 * Output (real-time dashboard):
 * Window: 10:00 - 10:05
 *   Control:   CTR: 15.2%, Avg Watch Time: 42 min, Completion: 68%
 *   Treatment: CTR: 18.7%, Avg Watch Time: 48 min, Completion: 73%
 *   → Treatment is winning!
 *
 * Change Data Capture (CDC) for Content Catalog (DDIA Ch. 11):
 *
 * Database: content_catalog (PostgreSQL)
 * Changes: new_release, metadata_update, availability_change
 *
 * CDC Stream (Debezium):
 * - Capture INSERT, UPDATE, DELETE from content_catalog table
 * - Publish to Kafka topic: "catalog-changes"
 * - Stream processors update cached catalog in real-time
 *
 * catalogChanges.stream()
 *   .filter(change => change.op == 'INSERT')  // New content added
 *   .map(change => ({
 *     video_id: change.after.id,
 *     title: change.after.title,
 *     release_date: change.after.release_date
 *   }))
 *   .to("new-releases-notifications")
 *
 * Exactly-Once Analytics (DDIA Ch. 11):
 *
 * Problem: Network retry causes duplicate view count
 * User watches episode 1 → Event published twice → Count = 2 views (WRONG!)
 *
 * Solution: Kafka Transactions + Idempotent Processing
 * - Each event has unique event_id
 * - Deduplication window: 1 hour
 * - State store tracks seen event_ids
 *
 * playbackEvents.stream()
 *   .transformValues(event => ({
 *     ...event,
 *     event_id: event.user_id + "_" + event.video_id + "_" + event.timestamp
 *   }))
 *   .groupByKey()
 *   .aggregate(
 *     () => new HashSet<String>(),  // Seen event IDs
 *     (key, event, seenIds) => {
 *       if (seenIds.contains(event.event_id)) {
 *         return seenIds;  // Duplicate, skip
 *       }
 *       seenIds.add(event.event_id);
 *       // Process event...
 *       return seenIds;
 *     }
 *   )
 *
 * System Design Primer Concepts:
 * - CDN: Global edge caching for video chunks (Netflix Open Connect)
 * - Circuit Breaker: Detect and route around failing edges
 * - Graceful Degradation: Reduce service quality under load
 * - Object Storage: S3 for video files (master copies)
 */
export const netflixProblemDefinition: ProblemDefinition = {
  id: 'netflix',
  title: 'Netflix - Video Streaming',
  description: `Design a video streaming platform like Netflix that:
- Users can browse movies and TV shows
- Users can stream videos on-demand
- Platform recommends content based on viewing history
- Videos are available in multiple qualities (SD, HD, 4K)

Learning Objectives (DDIA Ch. 8, 11):
1. Handle CDN edge failures with circuit breaker pattern (DDIA Ch. 8)
   - Detect edge server down, failover to backup edge < 100ms
   - Circuit breaker states: CLOSED → OPEN → HALF_OPEN
2. Design network partition tolerance for origin-edge (DDIA Ch. 8)
   - Serve stale catalog during partition (bounded staleness < 5 min)
   - Trade-off: Availability over consistency
3. Implement graceful degradation under high load (DDIA Ch. 8)
   - Level 1: Full quality → Level 2: Adaptive bitrate → Level 3: Read-only
4. Handle partial failures in watch history sync (DDIA Ch. 8)
   - Async replication across devices with eventual consistency
   - Last-write-wins conflict resolution
5. Coordinate distributed video encoding jobs (DDIA Ch. 8)
   - Leader-worker pattern, reassign failed chunks
6. Implement real-time analytics with stream processing (DDIA Ch. 11)
   - Windowed aggregations for quality monitoring (tumbling windows)
   - Sliding windows for concurrent viewer tracking
   - Session windows for binge-watching detection
7. Design stream-table joins for personalization (DDIA Ch. 11)
   - Join playback events with user profiles (CDC from database)
   - Enrich events with contextual data
8. Build real-time A/B test analytics (DDIA Ch. 11)
   - Compare control vs treatment groups in real-time
   - Windowed metrics: CTR, watch time, completion rate
9. Ensure exactly-once semantics for view counts (DDIA Ch. 11)
   - Idempotent processing with deduplication
   - Kafka transactions for atomic operations`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse movies and TV shows',
    'Users can stream videos on-demand'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'Edge failover: < 100ms to backup edge (DDIA Ch. 8: Circuit breaker)',
    'Network partition tolerance: Serve stale catalog (DDIA Ch. 8: Bounded staleness < 5 min)',
    'Circuit breaker: Detect edge failure in 10s (DDIA Ch. 8: >50% error rate)',
    'Graceful degradation: 3 levels under load (DDIA Ch. 8: Quality → Adaptive → Read-only)',
    'Watch history sync: Eventually consistent (DDIA Ch. 8: Last-write-wins)',
    'Partial failure handling: Retry with backoff (DDIA Ch. 8: Exponential backoff)',
    'Clock synchronization: ±50ms across edges (DDIA Ch. 8: NTP)',
    'Encoding job recovery: Reassign failed chunks (DDIA Ch. 8: Idempotent workers)',
    'Availability during partition: > 99.9% (DDIA Ch. 8: Favor availability over consistency)',
    'Analytics latency: < 5s end-to-end (DDIA Ch. 11: Real-time stream processing)',
    'Quality monitoring window: 1-minute tumbling (DDIA Ch. 11: Windowed aggregations)',
    'Popularity tracking: 5-minute sliding window (DDIA Ch. 11: Sliding windows)',
    'Binge detection: 30-minute session gap (DDIA Ch. 11: Session windows)',
    'Stream-table join: < 100ms (DDIA Ch. 11: KTable lookups)',
    'A/B test metrics: Real-time 5-minute windows (DDIA Ch. 11: Windowed aggregations)',
    'Exactly-once view counts: 100% accuracy (DDIA Ch. 11: Kafka transactions + deduplication)',
    'Event throughput: 1M playback events/second (DDIA Ch. 11: Scalable stream processing)',
    'CDC latency: < 1s for catalog updates (DDIA Ch. 11: Change data capture)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests and streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, viewing history, metadata',
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
        reason: 'App server needs to read/write viewing data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to stream video files',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'watch_history', 'subscription'],
      fields: {
        user: ['id', 'email', 'name', 'subscription_tier', 'created_at'],
        video: ['id', 'title', 'description', 'duration', 'video_url', 'thumbnail_url', 'created_at'],
        watch_history: ['user_id', 'video_id', 'progress', 'watched_at'],
        subscription: ['user_id', 'tier', 'status', 'expires_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Streaming videos
        { type: 'write', frequency: 'high' },        // Recording watch history
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing content
      ],
    },
  },

  scenarios: generateScenarios('netflix', problemConfigs.netflix, [
    'Users can browse movies and TV shows',
    'Users can stream videos on-demand'
  ]),

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
watch_history = {}
subscriptions = {}

def browse_catalog(category: str = None, limit: int = 20) -> List[Dict]:
    """
    FR-1: Users can browse movies and TV shows
    Naive implementation - returns all videos, optionally filtered by category
    No personalization or ranking
    """
    catalog = []
    for video in videos.values():
        if category is None or video.get('category') == category:
            catalog.append(video)

    # Sort by created_at (newest first)
    catalog.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
    return catalog[:limit]

def search_content(query: str) -> List[Dict]:
    """
    FR-1: Users can search for content
    Naive implementation - simple substring match on title
    """
    results = []
    for video in videos.values():
        if query.lower() in video.get('title', '').lower():
            results.append(video)
    return results

def stream_video(video_id: str, user_id: str, quality: str = "HD") -> Dict:
    """
    FR-2: Users can stream videos on-demand
    Naive implementation - returns video URL and records in watch history
    No actual streaming logic or quality adaptation
    """
    if video_id not in videos:
        return None

    video = videos[video_id]

    # Record watch history
    history_id = f"{user_id}_{video_id}_{datetime.now().timestamp()}"
    watch_history[history_id] = {
        'user_id': user_id,
        'video_id': video_id,
        'progress': 0,
        'quality': quality,
        'watched_at': datetime.now()
    }

    return {
        'video_id': video_id,
        'video_url': video['video_url'],
        'quality': quality,
        'title': video['title']
    }

def update_watch_progress(user_id: str, video_id: str, progress: int) -> Dict:
    """
    Helper: Update watch progress
    Naive implementation - updates most recent watch history entry
    """
    # Find most recent watch history entry for this user/video
    for history_id in reversed(list(watch_history.keys())):
        history = watch_history[history_id]
        if history['user_id'] == user_id and history['video_id'] == video_id:
            history['progress'] = progress
            return history

    return None

def get_watch_history(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get user's watch history
    Naive implementation - returns recent watch history
    """
    user_history = []
    for history in watch_history.values():
        if history['user_id'] == user_id:
            user_history.append(history)

    # Sort by watched_at (most recent first)
    user_history.sort(key=lambda x: x['watched_at'], reverse=True)
    return user_history[:limit]

def get_recommendations(user_id: str, limit: int = 10) -> List[Dict]:
    """
    Helper: Get recommended content (mentioned in description)
    Naive implementation - returns random videos, no actual ML
    In real system, this would use viewing history and ML models
    """
    return list(videos.values())[:limit]
`,
};

// Auto-generate code challenges from functional requirements
(netflixProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(netflixProblemDefinition);
