import { CodeChallenge } from '../../types/codeChallenge';

/**
 * Instagram/Social Media Code Challenges
 * Focus on consistent hashing, distributed caching, fan-out algorithms
 */

export const consistentHashingChallenge: CodeChallenge = {
  id: 'instagram_consistent_hashing',
  title: 'Implement Consistent Hashing for Cache Distribution',
  description: `Distribute cached data across multiple cache nodes using consistent hashing.

**Problem:**
- 3 cache servers: cache1, cache2, cache3
- When adding/removing servers, minimize data movement
- Ensure even distribution of keys

**Consistent Hashing Benefits:**
- Add/remove nodes with minimal disruption
- Only K/N keys need rebalancing (K=total keys, N=nodes)
- Compare to naive hash % N (all keys need rebalancing!)

**Requirements:**
- Hash function maps keys to ring (0 to 2^32)
- Virtual nodes for better distribution
- Find correct node for a given key

**Interview Focus:**
- Why consistent hashing vs modulo hashing?
- How many virtual nodes to use?
- How to handle node failures?`,

  difficulty: 'medium',
  componentType: 'redis',

  functionSignature: 'class ConsistentHash { addNode(nodeId: string): void; getNode(key: string): string; }',

  starterCode: `class ConsistentHash {
  private ring: Map<number, string> = new Map(); // hash → nodeId
  private sortedHashes: number[] = [];
  private readonly virtualNodes = 150; // Virtual nodes per physical node

  /**
   * Add a node to the hash ring
   */
  addNode(nodeId: string): void {
    // TODO: Add node with virtual replicas

    // Steps:
    // 1. For each virtual node (0 to virtualNodes)
    // 2. Create hash: hash(\`\${nodeId}:vnode_\${i}\`)
    // 3. Add to ring: ring.set(hash, nodeId)
    // 4. Add hash to sortedHashes array
    // 5. Sort sortedHashes
  }

  /**
   * Remove a node from the hash ring
   */
  removeNode(nodeId: string): void {
    // TODO: Remove node and all its virtual nodes
  }

  /**
   * Get the node responsible for a key
   */
  getNode(key: string): string | null {
    if (this.ring.size === 0) return null;

    // TODO: Find the first node clockwise from key's hash

    // Steps:
    // 1. Hash the key
    // 2. Binary search in sortedHashes to find next node
    // 3. If hash > largest, wrap around to first node

    return null;
  }

  /**
   * Simple hash function
   */
  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}`,

  testCases: [
    {
      id: 'test_add_nodes',
      name: 'Add 3 nodes',
      input: { nodes: ['cache1', 'cache2', 'cache3'] },
      expectedOutput: { nodeCount: 3 },
    },
    {
      id: 'test_key_distribution',
      name: 'Keys distribute evenly',
      input: {
        nodes: ['cache1', 'cache2', 'cache3'],
        keys: Array.from({ length: 1000 }, (_, i) => `key${i}`),
      },
      expectedOutput: {
        // Each node should get ~33% of keys (±10%)
        minPerNode: 250,
        maxPerNode: 450,
      },
    },
    {
      id: 'test_add_node_minimal_movement',
      name: 'Adding node moves only ~25% of keys',
      input: {
        scenario: 'add_node',
        initialNodes: ['cache1', 'cache2', 'cache3'],
        newNode: 'cache4',
        keys: Array.from({ length: 1000 }, (_, i) => `key${i}`),
      },
      expectedOutput: {
        // Only ~25% of keys should move to new node
        movedKeys: { min: 150, max: 350 },
      },
    },
  ],

  performanceTargets: {
    maxTimeMs: 10, // Should lookup node in < 10ms
  },

  referenceSolution: `class ConsistentHash {
  private ring: Map<number, string> = new Map();
  private sortedHashes: number[] = [];
  private readonly virtualNodes = 150;

  addNode(nodeId: string): void {
    // Add virtual nodes for better distribution
    for (let i = 0; i < this.virtualNodes; i++) {
      const vNodeKey = \`\${nodeId}:vnode_\${i}\`;
      const hash = this.hash(vNodeKey);
      this.ring.set(hash, nodeId);
      this.sortedHashes.push(hash);
    }
    // Keep hashes sorted for binary search
    this.sortedHashes.sort((a, b) => a - b);
  }

  removeNode(nodeId: string): void {
    // Remove all virtual nodes for this physical node
    const hashesToRemove: number[] = [];

    for (const [hash, node] of this.ring.entries()) {
      if (node === nodeId) {
        hashesToRemove.push(hash);
      }
    }

    for (const hash of hashesToRemove) {
      this.ring.delete(hash);
    }

    // Rebuild sorted array
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  getNode(key: string): string | null {
    if (this.ring.size === 0) return null;

    const hash = this.hash(key);

    // Binary search for first node >= hash
    let left = 0;
    let right = this.sortedHashes.length - 1;

    if (hash > this.sortedHashes[right]) {
      // Wrap around to first node
      return this.ring.get(this.sortedHashes[0])!;
    }

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.sortedHashes[mid] < hash) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return this.ring.get(this.sortedHashes[left])!;
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}`,

  solutionExplanation: `**Consistent Hashing Explained**

**Problem with Naive Hashing (hash % N):**
\`\`\`
With 3 nodes:
  key1 → hash(key1) % 3 = node 0
  key2 → hash(key2) % 3 = node 1
  key3 → hash(key3) % 3 = node 2

Add 4th node:
  key1 → hash(key1) % 4 = node 1  ❌ MOVED!
  key2 → hash(key2) % 4 = node 2  ❌ MOVED!
  key3 → hash(key3) % 4 = node 3  ❌ MOVED!

Result: ALL keys rehash when adding/removing nodes!
\`\`\`

**Consistent Hashing Solution:**

**1. Hash Ring (0 to 2^32)**:
\`\`\`
         0
         ↑
    cache3 ←---- cache1
         |         |
         |         |
         |         ↓
    cache2 --→ key1
\`\`\`

**2. Virtual Nodes** (solve uneven distribution):
\`\`\`
Without virtual nodes:
  cache1 → 1 position on ring
  cache2 → 1 position on ring
  cache3 → 1 position on ring
  Problem: Positions may cluster → uneven distribution

With 150 virtual nodes each:
  cache1:vnode_0 → position A
  cache1:vnode_1 → position B
  ...
  cache1:vnode_149 → position Z
  Result: Even distribution!
\`\`\`

**3. Key Lookup (Binary Search)**:
\`\`\`
1. hash(key) = 12345
2. Binary search in sorted hashes for first node >= 12345
3. If key > last node, wrap around to first
4. O(log N) lookup where N = total virtual nodes
\`\`\`

**Production Implementation (Redis)**:

\`\`\`typescript
// Redis Cluster uses consistent hashing with 16,384 hash slots

class RedisClusterClient {
  private slots: Map<number, string> = new Map(); // slot → nodeId
  private readonly TOTAL_SLOTS = 16384;

  constructor(nodes: { id: string; slotRange: [number, number] }[]) {
    // Assign slot ranges to nodes
    for (const node of nodes) {
      const [start, end] = node.slotRange;
      for (let slot = start; slot <= end; slot++) {
        this.slots.set(slot, node.id);
      }
    }
  }

  getNode(key: string): string {
    const slot = this.crc16(key) % this.TOTAL_SLOTS;
    return this.slots.get(slot)!;
  }

  private crc16(key: string): number {
    // CRC16 hash function (Redis uses this)
    // ...implementation...
    return 0;
  }
}

// Example: 3-node cluster
const cluster = new RedisClusterClient([
  { id: 'redis1', slotRange: [0, 5460] },      // ~33%
  { id: 'redis2', slotRange: [5461, 10922] },  // ~33%
  { id: 'redis3', slotRange: [10923, 16383] }, // ~33%
]);
\`\`\`

**Why It Works**:
- **Adding node**: Only keys in new node's range move (≈ 1/N keys)
- **Removing node**: Only keys on removed node move (≈ 1/N keys)
- **Compare to hash % N**: ALL keys move!

**Interview Talking Points**:

**Q: How many virtual nodes?**
A: "Typically 100-200 per physical node. More = better distribution but slower lookups (binary search in larger array)."

**Q: What if node fails?**
A: "Keys on failed node go to next node clockwise. With replication, read from replica. For writes, use consistent hashing across writable replicas."

**Q: Real-world systems?**
A:
- **Redis Cluster**: 16,384 hash slots (consistent hashing)
- **Cassandra**: Consistent hashing with virtual nodes (tokens)
- **DynamoDB**: Consistent hashing with virtual nodes
- **Memcached**: Client-side consistent hashing

**Tradeoff**:
| Approach | Add/Remove Node Cost | Distribution | Complexity |
|----------|---------------------|--------------|------------|
| hash % N | O(K) rehash all keys | Perfect | Low |
| Consistent Hash | O(K/N) move 1/N keys | Good (with vnodes) | Medium |

Interview Answer: "For Instagram's cache layer with 100 cache nodes, I'd use consistent hashing with 150 virtual nodes each. When a node fails, only ~1% of keys need to be refetched from DB. Compare to naive hashing where ALL keys would invalidate!"`,

  interviewTips: [
    'Mention virtual nodes solve uneven distribution problem',
    'Explain binary search makes lookup O(log N)',
    'Discuss real systems: Redis Cluster (16K slots), Cassandra (256 tokens)',
    'Compare to rendezvous hashing (alternative with better distribution)',
    'Mention monitoring: track key distribution, rebalancing on node add/remove',
  ],
};

export const feedFanoutChallenge: CodeChallenge = {
  id: 'instagram_feed_fanout',
  title: 'Implement Fan-Out on Write for Social Media Feed',
  description: `Optimize feed generation using fan-out on write strategy.

**Problem:**
- User posts photo → 1M followers need to see it
- Two approaches:
  1. **Fan-out on write**: Push to all follower feeds immediately
  2. **Fan-out on read**: Pull from followed users when reading feed

**Requirements:**
- Implement fan-out on write for regular users
- Hybrid approach for celebrities (>100K followers)
- Async processing with message queue
- Handle failures gracefully

**Interview Focus:**
- Fan-out on write vs fan-out on read tradeoffs?
- How to handle celebrities with millions of followers?
- What's the consistency model?`,

  difficulty: 'hard',
  componentType: 'message_queue',

  functionSignature: 'class FeedService { async publishPost(userId: string, post: Post): Promise<void> }',

  starterCode: `interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

class FeedService {
  private feeds: Map<string, Post[]> = new Map(); // userId → feed posts
  private followers: Map<string, Set<string>> = new Map(); // userId → follower IDs
  private readonly CELEBRITY_THRESHOLD = 100000;

  /**
   * Publish a post using fan-out strategy
   */
  async publishPost(userId: string, post: Post): Promise<void> {
    // TODO: Implement fan-out on write

    // Steps:
    // 1. Get user's followers
    // 2. Determine if user is celebrity (>100K followers)
    // 3. If regular user: Fan-out on write (push to all follower feeds)
    // 4. If celebrity: Skip fan-out (pull on read instead)
    // 5. Process in batches to avoid overwhelming system

    // Hint: For regular users, iterate through followers
    //       and add post to each follower's feed
  }

  /**
   * Get user's feed (already cached)
   */
  async getFeed(userId: string, limit: number = 20): Promise<Post[]> {
    const feed = this.feeds.get(userId) || [];
    return feed.slice(0, limit);
  }

  /**
   * Add follower relationship
   */
  addFollower(followeeId: string, followerId: string): void {
    if (!this.followers.has(followeeId)) {
      this.followers.set(followeeId, new Set());
    }
    this.followers.get(followeeId)!.add(followerId);
  }
}`,

  testCases: [
    {
      id: 'test_regular_user',
      name: 'Regular user post (fan-out on write)',
      input: {
        userId: 'user1',
        followerCount: 1000,
        post: { id: 'post1', content: 'Hello!' },
      },
      expectedOutput: {
        fanoutCount: 1000, // All followers got post
        method: 'fan_out_on_write',
      },
    },
    {
      id: 'test_celebrity',
      name: 'Celebrity post (skip fan-out)',
      input: {
        userId: 'celebrity1',
        followerCount: 1000000,
        post: { id: 'post2', content: 'New album!' },
      },
      expectedOutput: {
        fanoutCount: 0, // No fan-out for celebrities
        method: 'fan_out_on_read',
      },
    },
  ],

  performanceTargets: {
    maxTimeMs: 5000, // Should handle 10K follower fan-out in < 5s
  },

  referenceSolution: `interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

class FeedService {
  private feeds: Map<string, Post[]> = new Map();
  private followers: Map<string, Set<string>> = new Map();
  private readonly CELEBRITY_THRESHOLD = 100000;
  private readonly BATCH_SIZE = 1000;

  async publishPost(userId: string, post: Post): Promise<void> {
    const followerSet = this.followers.get(userId) || new Set();
    const followerCount = followerSet.size;

    if (followerCount > this.CELEBRITY_THRESHOLD) {
      // Celebrity: Skip fan-out, use pull on read
      // Store post in user's timeline (for followers to pull)
      console.log(\`Celebrity post: \${post.id}, skip fan-out\`);
      return;
    }

    // Regular user: Fan-out on write
    const followers = Array.from(followerSet);

    // Process in batches to avoid overwhelming system
    for (let i = 0; i < followers.length; i += this.BATCH_SIZE) {
      const batch = followers.slice(i, i + this.BATCH_SIZE);

      // In production: Send to message queue for async processing
      await this.processBatch(batch, post);
    }
  }

  private async processBatch(followerIds: string[], post: Post): Promise<void> {
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 10));

    for (const followerId of followerIds) {
      // Add post to follower's feed
      if (!this.feeds.has(followerId)) {
        this.feeds.set(followerId, []);
      }
      const feed = this.feeds.get(followerId)!;
      feed.unshift(post); // Add to beginning

      // Keep feed size manageable (e.g., 1000 posts)
      if (feed.length > 1000) {
        feed.pop();
      }
    }
  }

  async getFeed(userId: string, limit: number = 20): Promise<Post[]> {
    const feed = this.feeds.get(userId) || [];
    return feed.slice(0, limit).sort((a, b) => b.timestamp - a.timestamp);
  }

  addFollower(followeeId: string, followerId: string): void {
    if (!this.followers.has(followeeId)) {
      this.followers.set(followeeId, new Set());
    }
    this.followers.get(followeeId)!.add(followerId);
  }
}`,

  solutionExplanation: `**Fan-Out Strategies for Social Media Feeds**

**1. Fan-Out on Write (Push)**:
\`\`\`
User posts → Push to ALL follower feeds immediately

Alice (100 followers) posts photo:
  → Push to follower1's feed
  → Push to follower2's feed
  → ...
  → Push to follower100's feed

Read feed: O(1) - just read cached feed
Write post: O(N) - push to N followers
\`\`\`

**2. Fan-Out on Read (Pull)**:
\`\`\`
User posts → Store in own timeline only

Bob reads feed:
  → Pull from followed_user1's timeline
  → Pull from followed_user2's timeline
  → ...
  → Merge and sort

Read feed: O(M log M) - merge M followed users
Write post: O(1) - just write to own timeline
\`\`\`

**Production Architecture (Hybrid)**:

\`\`\`typescript
class HybridFeedService {
  private redis: RedisClient;
  private kafka: KafkaProducer;
  private db: Database;

  async publishPost(userId: string, post: Post): Promise<void> {
    // Step 1: Store post in database
    await this.db.posts.insert(post);

    // Step 2: Get follower count
    const followerCount = await this.db.users.getFollowerCount(userId);

    if (followerCount > 100000) {
      // Celebrity: Fan-out on read
      // Just cache post in Redis for fast pulls
      await this.redis.zadd(
        \`user:\${userId}:timeline\`,
        post.timestamp,
        post.id
      );
    } else {
      // Regular user: Fan-out on write via message queue
      const followers = await this.getFollowerBatches(userId);

      for (const batch of followers) {
        await this.kafka.produce('feed-fanout', {
          postId: post.id,
          followerIds: batch,
        });
      }
    }
  }

  async getFeed(userId: string, limit: number = 20): Promise<Post[]> {
    // Try cache first
    const cached = await this.redis.zrevrange(
      \`user:\${userId}:feed\`,
      0,
      limit - 1
    );

    if (cached.length >= limit) {
      return this.hydratePostsFromIds(cached);
    }

    // Cache miss: Fetch from followed users (fan-out on read)
    const following = await this.db.users.getFollowing(userId);
    const posts = await this.fetchAndMergePosts(following, limit);

    // Cache for next time
    await this.cacheFeed(userId, posts);

    return posts;
  }

  private async getFollowerBatches(
    userId: string,
    batchSize: number = 1000
  ): Promise<string[][]> {
    const followers = await this.db.users.getFollowers(userId);
    const batches: string[][] = [];

    for (let i = 0; i < followers.length; i += batchSize) {
      batches.push(followers.slice(i, i + batchSize));
    }

    return batches;
  }
}

// Kafka consumer for async fan-out
class FeedFanoutWorker {
  async process(message: { postId: string; followerIds: string[] }): Promise<void> {
    const post = await this.db.posts.get(message.postId);

    // Batch write to Redis
    const pipeline = this.redis.pipeline();

    for (const followerId of message.followerIds) {
      pipeline.zadd(
        \`user:\${followerId}:feed\`,
        post.timestamp,
        post.id
      );
      // Keep feed size bounded (e.g., 1000 posts)
      pipeline.zremrangebyrank(\`user:\${followerId}:feed\`, 0, -1001);
    }

    await pipeline.exec();
  }
}
\`\`\`

**Tradeoffs**:

| Strategy | Write Cost | Read Cost | Best For |
|----------|-----------|-----------|----------|
| **Fan-out on write** | O(N) followers | O(1) cached | Regular users |
| **Fan-out on read** | O(1) own timeline | O(M) followed | Celebrities |
| **Hybrid** | O(N) if N<100K else O(1) | O(1) for most | Production |

**Instagram/Twitter Strategy**:
- **<100K followers**: Fan-out on write (Kafka → Redis)
- **>100K followers**: Fan-out on read (pull on demand)
- **>1M followers**: Mixed (cache top 20 posts, pull rest)

**Interview Answer**:
"For Instagram feed, I'd use hybrid approach:

**Write Path**:
1. Store post in DB (Cassandra for durability)
2. If user has <100K followers:
   - Send to Kafka topic 'feed-fanout'
   - Workers consume and push to Redis feeds
3. If celebrity (>100K):
   - Skip fan-out, just cache in own timeline

**Read Path**:
1. Try Redis cache (user:feed key)
2. If miss, pull from followed users
3. Merge + sort by timestamp
4. Cache result

**Monitoring**:
- Fan-out latency (should complete <5 seconds)
- Cache hit ratio (should be >90%)
- Celebrity detection (adjust threshold based on load)

**Tradeoff**: Regular users get instant feed (O(1) read), celebrities' followers have slight delay (pull on read). Acceptable because celebrities post less frequently."`,

  interviewTips: [
    'Explain hybrid approach is best: fan-out for regular, pull for celebrities',
    'Mention async processing via message queue (Kafka) for fan-out',
    'Discuss cache eviction: keep feed size bounded (e.g., 1000 posts)',
    'Compare to Twitter, Instagram: both use hybrid approach',
    'Explain timeline merge: use min-heap to merge sorted timelines efficiently',
  ],
};

export const instagramCodeChallenges: CodeChallenge[] = [
  consistentHashingChallenge,
  feedFanoutChallenge,
];
