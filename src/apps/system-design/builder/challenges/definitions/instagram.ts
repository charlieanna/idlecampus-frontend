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
  cacheInvalidationValidator,
} from '../../validation/validators/cachingValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';
import { generateSolution } from '../solutionGenerator';

/**
 * Instagram - Photo Sharing Platform
 * Comprehensive FR and NFR scenarios with DDIA/SDP concepts
 *
 * DDIA Concepts Applied:
 * - Chapter 5 (Replication): Read replicas for scaling read traffic on feed/profile views
 * - Chapter 6 (Partitioning): Partition users and posts by user_id for horizontal scaling
 * - Chapter 7 (Transactions): Ensure atomicity for like/comment operations
 * - Chapter 9 (Consistency): Eventual consistency for feed updates (acceptable lag)
 *
 * System Design Primer - Caching Strategies (Deep Dive):
 *
 * Instagram is read-heavy (view:upload ratio ~100:1), making caching critical.
 * We'll explore all major caching patterns and when to use each.
 *
 * 1. Cache-Aside (Lazy Loading) Pattern:
 * =====================================
 * Application reads from cache first, loads from DB on miss.
 *
 * Use Case: User profile cache
 *
 * def get_user_profile(user_id):
 *     # Try cache first
 *     profile = redis.get(f"user_profile:{user_id}")
 *     if profile:
 *         return profile  # Cache hit
 *
 *     # Cache miss - load from database
 *     profile = db.query("SELECT * FROM users WHERE id = ?", user_id)
 *
 *     # Populate cache for future reads (TTL: 1 hour)
 *     redis.setex(f"user_profile:{user_id}", 3600, profile)
 *     return profile
 *
 * Pros:
 * - Only cache data that's actually requested (no wasted memory)
 * - Cache failures don't bring down the system (DB is fallback)
 * - Simple to implement and reason about
 *
 * Cons:
 * - Cache miss penalty (latency spike on first read)
 * - Potential cache stampede (multiple requests fetch same data on miss)
 * - Stale data risk (cache doesn't know when DB updates)
 *
 * Best For: Read-heavy data with unpredictable access patterns
 * Instagram Examples: User profiles, post metadata, hashtag info
 *
 *
 * 2. Write-Through Cache Pattern:
 * ===============================
 * Application writes to cache AND database synchronously.
 *
 * Use Case: Like count on posts (must be consistent)
 *
 * def like_post(post_id, user_id):
 *     # Write to database first (ensures durability)
 *     db.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", post_id, user_id)
 *     db.execute("UPDATE posts SET like_count = like_count + 1 WHERE id = ?", post_id)
 *
 *     # Update cache synchronously
 *     redis.incr(f"post_likes:{post_id}")
 *
 *     # Also invalidate post cache to ensure consistency
 *     redis.delete(f"post:{post_id}")
 *
 * Pros:
 * - Cache is always consistent with database (no stale reads)
 * - Read latency is fast (data already in cache)
 * - No cache stampede on writes
 *
 * Cons:
 * - Write latency increases (must write to cache + DB)
 * - Wasted writes if data is never read (caching unused data)
 * - Cache failure blocks writes (unless you add fallback logic)
 *
 * Best For: Write-moderate, read-heavy data requiring strong consistency
 * Instagram Examples: Like counts, follower counts, comment counts
 *
 *
 * 3. Write-Behind (Write-Back) Cache Pattern:
 * ===========================================
 * Application writes to cache only, async worker persists to DB later.
 *
 * Use Case: View count on posts (eventual consistency acceptable)
 *
 * def view_post(post_id):
 *     # Only increment cache (fast write)
 *     redis.incr(f"post_views:{post_id}")
 *
 *     # Background worker (runs every 10 seconds):
 *     # for post_id, count in redis.scan("post_views:*"):
 *     #     db.execute("UPDATE posts SET view_count = view_count + ? WHERE id = ?", count, post_id)
 *     #     redis.delete(f"post_views:{post_id}")
 *
 * Pros:
 * - Very fast writes (cache write only, no DB latency)
 * - Batching reduces DB load (100 increments → 1 DB update)
 * - Shields DB from write spikes
 *
 * Cons:
 * - Risk of data loss if cache fails before flush to DB
 * - Complex to implement (need reliable background workers)
 * - Eventual consistency (DB lags behind cache)
 *
 * Best For: High-write, eventual consistency acceptable
 * Instagram Examples: View counts, impression counts, analytics events
 *
 *
 * 4. Write-Around Cache Pattern:
 * ==============================
 * Application writes to database directly, bypassing cache.
 * Cache populated only on subsequent reads (lazy).
 *
 * Use Case: Uploading new post (rarely re-read immediately)
 *
 * def upload_post(post_id, user_id, image_url, caption):
 *     # Write directly to database (bypass cache)
 *     db.execute("INSERT INTO posts (id, user_id, image_url, caption) VALUES (?, ?, ?, ?)",
 *                post_id, user_id, image_url, caption)
 *
 *     # Don't cache yet - wait for first read
 *     # (Avoids caching data that may never be read)
 *
 * Pros:
 * - Avoids cache pollution (don't cache data that's never read)
 * - Good for write-once, read-maybe data
 *
 * Cons:
 * - First read after write is slow (cache miss)
 * - Not suitable if data is immediately read after write
 *
 * Best For: Write-heavy, infrequent reads
 * Instagram Examples: New post uploads (user may not view own post right away)
 *
 *
 * Cache Invalidation Strategies:
 * ===============================
 * Hardest problem in computer science: "When do we evict/refresh cache?"
 *
 * Strategy 1: TTL (Time-To-Live)
 * - Set expiration time on cached data
 * - Example: User profile expires after 1 hour
 * - Pro: Simple, automatic cleanup
 * - Con: Stale data until expiration
 *
 * redis.setex(f"user_profile:{user_id}", 3600, profile)  # 1 hour TTL
 *
 * Strategy 2: Write-Time Invalidation
 * - Invalidate cache whenever database is updated
 * - Example: Delete cached profile when user updates bio
 * - Pro: Cache always fresh
 * - Con: Extra logic on every write
 *
 * def update_user_bio(user_id, new_bio):
 *     db.execute("UPDATE users SET bio = ? WHERE id = ?", new_bio, user_id)
 *     redis.delete(f"user_profile:{user_id}")  # Invalidate cache
 *
 * Strategy 3: Lazy Invalidation (Event-Driven)
 * - Use CDC (Change Data Capture) to invalidate cache
 * - Database changes published to Kafka → Worker invalidates cache
 * - Pro: Decouples cache invalidation from application logic
 * - Con: Adds complexity (need CDC pipeline)
 *
 * Kafka Stream: user_updates
 * Consumer: Listens for user update events → Deletes cache key
 *
 * Strategy 4: Versioned Keys
 * - Include version in cache key (e.g., user_profile:{user_id}:v2)
 * - On update, bump version → old cache naturally expires
 * - Pro: No explicit invalidation needed
 * - Con: More cache memory usage (old versions linger)
 *
 *
 * Instagram-Specific Caching Architecture:
 * =========================================
 *
 * Layer 1: CDN (CloudFront, Cloudflare)
 * - Cache: Images, videos (static content)
 * - TTL: 7 days
 * - Invalidation: On content update/delete (rare)
 *
 * Layer 2: Redis Cluster (Application Cache)
 * - Cache: User feeds, profiles, post metadata
 * - Strategy: Cache-aside for reads, write-through for critical counts
 * - TTL: 5-60 minutes depending on data type
 *
 * Layer 3: Database Read Replicas (DDIA Ch. 5)
 * - Handle cache misses
 * - Eventual consistency acceptable (lag < 500ms)
 *
 * Feed Generation Example (Multi-Layer Caching):
 *
 * def get_user_feed(user_id):
 *     # L1: Try Redis cache (hot path)
 *     feed = redis.get(f"feed:{user_id}")
 *     if feed:
 *         return feed  # Cache hit (p50 case, < 10ms)
 *
 *     # L2: Cache miss - regenerate feed
 *     following = db.query("SELECT following_id FROM followers WHERE follower_id = ?", user_id)
 *     posts = []
 *     for followed_user in following:
 *         # Try to get posts from cache first (cache-aside)
 *         user_posts = redis.get(f"user_posts:{followed_user}")
 *         if not user_posts:
 *             user_posts = db.query("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", followed_user)
 *             redis.setex(f"user_posts:{followed_user}", 600, user_posts)  # 10 min TTL
 *         posts.extend(user_posts)
 *
 *     # Rank by recency and cache result
 *     feed = sorted(posts, key=lambda p: p['created_at'], reverse=True)[:50]
 *     redis.setex(f"feed:{user_id}", 300, feed)  # 5 min TTL
 *     return feed
 *
 *
 * Cache Stampede Prevention (Thundering Herd):
 * ============================================
 * Problem: 1000 requests hit cache miss simultaneously → 1000 DB queries
 *
 * Solution: Distributed Lock with Cache Warming
 *
 * def get_user_feed_safe(user_id):
 *     feed = redis.get(f"feed:{user_id}")
 *     if feed:
 *         return feed
 *
 *     # Try to acquire lock (only 1 request regenerates feed)
 *     lock_key = f"lock:feed:{user_id}"
 *     if redis.set(lock_key, "1", nx=True, ex=10):  # 10s lock
 *         try:
 *             # This request won the lock - generate feed
 *             feed = generate_feed(user_id)
 *             redis.setex(f"feed:{user_id}", 300, feed)
 *             return feed
 *         finally:
 *             redis.delete(lock_key)
 *     else:
 *         # Another request is generating - wait and retry
 *         time.sleep(0.1)
 *         return get_user_feed_safe(user_id)  # Retry
 *
 *
 * When to Use Each Caching Strategy at Instagram:
 * ================================================
 *
 * Cache-Aside:
 * - User profiles (read-heavy, unpredictable access)
 * - Post metadata (read on demand)
 * - Hashtag information
 *
 * Write-Through:
 * - Like counts (must be accurate, read frequently)
 * - Follower counts (displayed on profile)
 * - Comment counts
 *
 * Write-Behind:
 * - View counts (eventual consistency OK)
 * - Impression tracking
 * - Analytics events (page views, clicks)
 *
 * Write-Around:
 * - New post uploads (rarely viewed immediately by uploader)
 * - Story uploads (24-hour TTL, may not be re-read)
 *
 *
 * System Design Primer - Other Concepts:
 * - CDN: Global distribution of images/videos (static content)
 * - Load Balancing: Distribute traffic across app servers
 * - Object Storage: S3-compatible storage for photos/videos
 */
export const instagramProblemDefinition: ProblemDefinition = {
  id: 'instagram',
  title: 'Instagram - Photo Sharing Platform',
  description: `Design a photo sharing platform like Instagram that:
- Users can upload photos and videos
- Users can view a feed of photos from people they follow
- Users can like and comment on photos
- Users can search for other users and content

Learning Objectives (DDIA/SDP):
1. Scale read-heavy workloads with read replicas (DDIA Ch. 5)
2. Partition data by user_id for horizontal scaling (DDIA Ch. 6)
3. Use CDN for global image delivery (SDP - CDN)
4. Master all 4 caching patterns (SDP - Caching):
   - Cache-Aside: User profiles, post metadata (lazy loading)
   - Write-Through: Like counts, follower counts (strong consistency)
   - Write-Behind: View counts, analytics (eventual consistency)
   - Write-Around: New uploads (avoid cache pollution)
5. Implement cache invalidation strategies (SDP):
   - TTL-based expiration (simple, automatic)
   - Write-time invalidation (strong consistency)
   - Event-driven invalidation with CDC (decoupled)
   - Versioned keys (no explicit invalidation)
6. Prevent cache stampede with distributed locks (SDP)
7. Design multi-layer caching (CDN → Redis → DB replicas)
8. Handle eventual consistency in social feeds (DDIA Ch. 9)
9. Design for high availability with replication (DDIA Ch. 5)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload photos and videos',
    'Users can view a feed of photos from people they follow',
    'Users can like and comment on photos',
    'Users can search for other users and content'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'Feed latency: p99 < 200ms with cache hit (SDP: Cache-aside pattern)',
    'Cache hit ratio: > 80% for feed requests (SDP: Multi-layer caching)',
    'Cache miss latency: p99 < 500ms with stampede prevention (SDP: Distributed locks)',
    'Like count accuracy: Strong consistency (SDP: Write-through caching)',
    'View count lag: < 10s acceptable (SDP: Write-behind batching)',
    'Upload latency: p99 < 1s (SDP: Write-around + direct S3 upload)',
    'Cache invalidation lag: < 1s for profile updates (SDP: Write-time invalidation)',
    'CDN cache hit ratio: > 95% for images (SDP: Edge caching, 7-day TTL)',
    'Replication lag: < 500ms average (DDIA Ch. 5: Async replication)',
    'Availability: 99.9% uptime (DDIA Ch. 5: Multi-replica setup)',
    'Global image delivery: CDN edge latency < 100ms (SDP: CDN)',
    'Consistency: Eventual consistency acceptable for feeds (DDIA Ch. 9)',
    'Scalability: Partition by user_id to handle 100M+ users (DDIA Ch. 6)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests (upload, view, like)',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, posts, likes, comments',
      },
      {
        type: 'object_storage',
        reason: 'Need to store photos and videos (large files)',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for fast global image delivery',
      },
      {
        type: 'cache',
        reason: 'Need caching for feed performance',
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
        reason: 'App server needs to read/write metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve media files',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server caches feeds and user data',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls images from object storage',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'like', 'comment', 'follower'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'image_url', 'caption', 'created_at'],
        like: ['post_id', 'user_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        follower: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'medium' },        // Uploading posts
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing feed
        { type: 'write_large_file', frequency: 'medium' }, // Uploading images
      ],
    },
  },

  scenarios: generateScenarios('instagram', problemConfigs.instagram, [
    'Users can upload photos and videos',
    'Users can view a feed of photos from people they follow',
    'Users can like and comment on photos',
    'Users can search for other users and content'
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
      name: 'Cache Invalidation (SDP - Caching)',
      validate: cacheInvalidationValidator,
    },
    {
      name: 'Cost Optimization (DDIA - Trade-offs)',
      validate: costOptimizationValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# ===========================================
# 📦 STORAGE API (PROVIDED)
# ===========================================
# In-memory storage (simulates production database/cache)
storage = {}

def store(key: str, value: Any) -> bool:
    """Store a key-value pair in memory."""
    storage[key] = value
    return True

def retrieve(key: str) -> Optional[Any]:
    """Retrieve a value by key."""
    return storage.get(key)

def exists(key: str) -> bool:
    """Check if a key exists in storage."""
    return key in storage

# ===========================================
# 🚀 YOUR IMPLEMENTATION
# ===========================================

def upload_photo(post_id: str, user_id: str, image_url: str, caption: str = "") -> Dict:
    """
    FR-1: Users can upload photos and videos
    Store post metadata using the storage API
    """
    post = {
        'id': post_id,
        'user_id': user_id,
        'image_url': image_url,
        'caption': caption,
        'created_at': datetime.now()
    }
    store(f"post:{post_id}", post)

    # Add to user's posts list
    user_posts_key = f"user_posts:{user_id}"
    user_posts = retrieve(user_posts_key) or []
    user_posts.append(post_id)
    store(user_posts_key, user_posts)

    return post

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow other users (helper for feed)
    Store follow relationship using the storage API
    """
    follow_key = f"follow:{follower_id}:{following_id}"
    follow = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    store(follow_key, follow)

    # Update follower's following list
    following_key = f"following:{follower_id}"
    following_list = retrieve(following_key) or []
    if following_id not in following_list:
        following_list.append(following_id)
        store(following_key, following_list)

    return follow

def get_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Users can view a feed of photos from people they follow
    Returns posts from followed users, sorted by recency
    """
    # Get list of users this user follows
    following_key = f"following:{user_id}"
    following = retrieve(following_key) or []

    # Collect all posts from followed users
    feed = []
    for followed_user_id in following:
        user_posts_key = f"user_posts:{followed_user_id}"
        post_ids = retrieve(user_posts_key) or []
        for post_id in post_ids:
            post = retrieve(f"post:{post_id}")
            if post:
                feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]

def like_photo(post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like photos
    Store like using the storage API
    """
    like_key = f"like:{post_id}:{user_id}"
    like = {
        'post_id': post_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    store(like_key, like)

    # Update post's likes count
    likes_count_key = f"likes_count:{post_id}"
    count = retrieve(likes_count_key) or 0
    store(likes_count_key, count + 1)

    return like

def comment_on_photo(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    FR-3: Users can comment on photos
    Store comment using the storage API
    """
    comment = {
        'id': comment_id,
        'post_id': post_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    store(f"comment:{comment_id}", comment)

    # Add comment to post's comment list
    post_comments_key = f"post_comments:{post_id}"
    comments_list = retrieve(post_comments_key) or []
    comments_list.append(comment_id)
    store(post_comments_key, comments_list)

    return comment

def search_users(query: str) -> List[Dict]:
    """
    FR-4: Users can search for other users
    Search through stored users by username
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all user keys
    for key in storage.keys():
        if key.startswith("user:"):
            user = retrieve(key)
            if user and query.lower() in user.get('username', '').lower():
                results.append(user)
    return results

def search_content(query: str) -> List[Dict]:
    """
    FR-4: Users can search for content
    Search through stored posts by caption
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all post keys
    for key in storage.keys():
        if key.startswith("post:"):
            post = retrieve(key)
            if post and query.lower() in post.get('caption', '').lower():
                results.append(post)
    return results
`,

  // Auto-generated solution that passes all test scenarios
  solution: generateSolution(
    'instagram',
    problemConfigs.instagram,
    [
      'Users can upload photos and videos',
      'Users can view a feed of photos from people they follow',
      'Users can like and comment on photos',
      'Users can search for other users and content'
    ]
  ),
};

// Auto-generate code challenges from functional requirements
(instagramProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(instagramProblemDefinition);
