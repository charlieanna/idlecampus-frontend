import { CodeChallenge } from '../../types/codeChallenge';

/**
 * TinyURL Code Challenges
 * Implementation and optimization tasks for URL shortening system
 */

export const tinyUrlHashFunction: CodeChallenge = {
  id: 'tinyurl_hash_function',
  title: 'Implement Base62 Encoding',
  description: `Design a function to convert a numeric ID into a short, URL-safe string using Base62 encoding (a-z, A-Z, 0-9).

**Requirements:**
- Convert numbers 0-999999 to base62 strings
- Use character set: a-z, A-Z, 0-9 (62 characters)
- Shorter IDs should produce shorter strings
- Must be deterministic (same ID = same output)

**Example:**
- Input: 12345
- Output: "3D7" (or similar base62 representation)

**Interview Focus:**
- How do you minimize collision probability?
- What's the maximum number of URLs this supports?
- How would you handle sequential IDs (avoid predictability)?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function generateShortCode(id: number): string',

  starterCode: `/**
 * Convert a numeric ID to a Base62 short code
 * @param id - Numeric identifier (0 to 999999999)
 * @returns Base62 encoded string
 */
function generateShortCode(id: number): string {
  // TODO: Implement base62 encoding
  // Hint: Use modulo and division to convert base 10 to base 62

  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Your code here

  return '';
}`,

  testCases: [
    {
      id: 'test_zero',
      name: 'ID = 0',
      input: 0,
      expectedOutput: 'a',
    },
    {
      id: 'test_small',
      name: 'Small ID',
      input: 62,
      expectedOutput: 'ba', // 62 in base62
    },
    {
      id: 'test_medium',
      name: 'Medium ID',
      input: 12345,
      expectedOutput: 'dnh', // 12345 in base62
    },
    {
      id: 'test_large',
      name: 'Large ID',
      input: 999999,
      expectedOutput: 'FJp', // 999999 in base62
    },
    {
      id: 'test_performance',
      name: 'Performance Test (1M encodings)',
      input: 1000000,
      expectedOutput: 'FXq',
      isPerformanceTest: true,
      timeoutMs: 1000,
    },
  ],

  performanceTargets: {
    maxTimeMs: 500, // Should encode 1M IDs in under 500ms
    minThroughput: 2000000, // 2M ops/sec
  },

  referenceSolution: `function generateShortCode(id: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  if (id === 0) return charset[0];

  let result = '';
  let num = id;

  while (num > 0) {
    result = charset[num % 62] + result;
    num = Math.floor(num / 62);
  }

  return result;
}`,

  solutionExplanation: `**Optimal Approach: Base Conversion**

1. **Algorithm**: Convert decimal to base-62
   - Repeatedly divide by 62
   - Take remainder as index into charset
   - Prepend character to result

2. **Time Complexity**: O(log₆₂(n)) ≈ O(log n)
   - For 1 billion IDs, only ~6 characters needed

3. **Space Complexity**: O(log₆₂(n)) for the string

4. **Key Optimizations**:
   - Use array operations (faster than string concatenation)
   - Pre-allocate result array if max length is known
   - Cache charset as constant

5. **Interview Insights**:
   - **Why Base62?** URL-safe (no special characters), compact
   - **Collision Avoidance**: Use auto-incrementing IDs or distributed ID generator (Snowflake)
   - **Capacity**: 62^7 = 3.5 trillion URLs with 7 characters
   - **Security**: Add random salt to prevent sequential guessing

**Alternative Approaches:**
- **MD5 Hash**: More collisions, longer strings
- **UUID**: Too long (36 chars), not user-friendly
- **Random Strings**: Need collision checking, database overhead`,

  interviewTips: [
    'Mention that you\'d use a distributed ID generator (like Twitter Snowflake) to avoid centralized bottleneck',
    'Explain tradeoff: sequential IDs (predictable) vs random IDs (need collision check)',
    'Discuss how to handle custom short URLs (premium feature)',
    'Mention you\'d monitor collision rates and adjust ID space if needed',
  ],
};

export const tinyUrlRateLimiter: CodeChallenge = {
  id: 'tinyurl_rate_limiter',
  title: 'Implement Token Bucket Rate Limiter',
  description: `Implement a token bucket rate limiter to prevent abuse of the URL shortening service.

**Requirements:**
- Allow 10 requests per second per user
- Burst capacity of 20 tokens
- Refill rate: 10 tokens per second
- Return true if request allowed, false if rate limited

**Token Bucket Algorithm:**
1. Start with full bucket (capacity)
2. Each request consumes 1 token
3. Tokens refill at constant rate
4. If no tokens available, reject request

**Interview Focus:**
- Why token bucket vs leaky bucket vs sliding window?
- How to implement this in distributed system?
- Where to store state (Redis)?`,

  difficulty: 'medium',
  componentType: 'app_server',

  functionSignature: 'class RateLimiter { allowRequest(userId: string, timestamp: number): boolean }',

  starterCode: `class RateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }>;

  constructor(
    private capacity: number = 20,
    private refillRate: number = 10 // tokens per second
  ) {
    this.buckets = new Map();
  }

  /**
   * Check if request should be allowed
   * @param userId - User identifier
   * @param timestamp - Current timestamp in milliseconds
   * @returns true if allowed, false if rate limited
   */
  allowRequest(userId: string, timestamp: number): boolean {
    // TODO: Implement token bucket algorithm

    // Hint:
    // 1. Get or create bucket for user
    // 2. Calculate tokens to add based on time elapsed
    // 3. Refill bucket (up to capacity)
    // 4. Check if tokens available
    // 5. Consume token if available

    return false;
  }
}`,

  testCases: [
    {
      id: 'test_first_request',
      name: 'First request allowed',
      input: { userId: 'user1', timestamp: 1000 },
      expectedOutput: true,
    },
    {
      id: 'test_burst',
      name: 'Allow burst up to capacity',
      input: { userId: 'user2', requests: 20, timestamp: 1000 },
      expectedOutput: { allowed: 20, rejected: 0 },
    },
    {
      id: 'test_rate_limit',
      name: 'Reject after burst exhausted',
      input: { userId: 'user3', requests: 25, timestamp: 1000 },
      expectedOutput: { allowed: 20, rejected: 5 },
    },
    {
      id: 'test_refill',
      name: 'Tokens refill over time',
      input: {
        userId: 'user4',
        sequence: [
          { requests: 20, timestamp: 1000 }, // Exhaust bucket
          { requests: 5, timestamp: 2000 },  // 1 sec later, 10 tokens refilled
        ],
      },
      expectedOutput: { firstBurst: 20, secondBurst: 10 },
    },
  ],

  performanceTargets: {
    maxTimeMs: 1, // Should check rate limit in < 1ms
  },

  referenceSolution: `class RateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }>;

  constructor(
    private capacity: number = 20,
    private refillRate: number = 10
  ) {
    this.buckets = new Map();
  }

  allowRequest(userId: string, timestamp: number): boolean {
    if (!this.buckets.has(userId)) {
      this.buckets.set(userId, {
        tokens: this.capacity - 1, // Consume 1 for this request
        lastRefill: timestamp,
      });
      return true;
    }

    const bucket = this.buckets.get(userId)!;

    // Calculate tokens to add based on elapsed time
    const elapsedMs = timestamp - bucket.lastRefill;
    const elapsedSec = elapsedMs / 1000;
    const tokensToAdd = elapsedSec * this.refillRate;

    // Refill bucket (capped at capacity)
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = timestamp;

    // Check if token available
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }

    return false;
  }
}`,

  solutionExplanation: `**Token Bucket Algorithm**

1. **Data Structure**: Map of userId → { tokens, lastRefill }
   - tokens: Current token count (0 to capacity)
   - lastRefill: Last time tokens were added

2. **Algorithm**:
   \`\`\`
   tokens_to_add = (current_time - last_refill) * refill_rate
   tokens = min(capacity, tokens + tokens_to_add)
   if tokens >= 1:
     tokens -= 1
     return ALLOW
   else:
     return REJECT
   \`\`\`

3. **Time Complexity**: O(1) per request

4. **Space Complexity**: O(U) where U = number of users

**Distributed Implementation (Production):**

\`\`\`lua
-- Redis Lua script for atomic rate limiting
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Refill tokens
local elapsed = (now - last_refill) / 1000
local tokens_to_add = elapsed * rate
tokens = math.min(capacity, tokens + tokens_to_add)

-- Check if request allowed
if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, 3600)
  return 1
else
  return 0
end
\`\`\`

**Interview Talking Points:**

1. **Why Token Bucket?**
   - Allows bursts (better UX than fixed window)
   - Smooth rate limiting
   - Easy to implement

2. **Alternatives:**
   - **Fixed Window**: Simple but allows double rate at boundaries
   - **Sliding Window**: More accurate but more memory
   - **Leaky Bucket**: Smooths bursts but stricter

3. **Distributed Considerations:**
   - Store in Redis for shared state across servers
   - Use Lua scripts for atomic operations
   - Set TTL to clean up inactive users

4. **Advanced Features:**
   - Different limits per tier (free vs premium)
   - Adaptive rate limiting based on system load
   - Per-IP and per-user limits`,

  interviewTips: [
    'Explain you\'d use Redis with Lua scripts for atomic distributed rate limiting',
    'Mention monitoring: track rejection rates, adjust limits based on abuse patterns',
    'Discuss tiered limits: free users (10/sec), premium (100/sec)',
    'Explain how to handle clock skew in distributed systems',
  ],
};

export const tinyUrlCollisionHandling: CodeChallenge = {
  id: 'tinyurl_collision_handling',
  title: 'Handle Hash Collisions Efficiently',
  description: `Design a collision resolution strategy for URL shortener when generated hash already exists.

**Scenario:**
- Two URLs hash to the same short code
- Need to detect collision and generate alternative

**Strategies:**
1. Linear probing (try hash+1, hash+2, ...)
2. Random suffix
3. Re-hash with salt
4. Pre-allocate ID ranges

**Requirements:**
- Minimize database lookups
- Keep short codes user-friendly
- Handle high collision rates gracefully`,

  difficulty: 'hard',
  componentType: 'app_server',

  functionSignature: 'function resolveCollision(shortCode: string, attemptCount: number): string',

  starterCode: `/**
 * Generate alternative short code when collision occurs
 * @param shortCode - The colliding short code
 * @param attemptCount - Number of collision attempts (1, 2, 3, ...)
 * @returns New short code to try
 */
function resolveCollision(shortCode: string, attemptCount: number): string {
  // TODO: Implement collision resolution
  // Hint: Consider different strategies for different attempt counts
  //   - Attempt 1-3: Linear probing (append character)
  //   - Attempt 4+: Random suffix

  return shortCode;
}`,

  testCases: [
    {
      id: 'test_first_collision',
      name: 'First collision attempt',
      input: { shortCode: 'abc123', attemptCount: 1 },
      expectedOutput: 'abc123a', // Append 'a'
    },
    {
      id: 'test_multiple_collisions',
      name: 'Multiple collisions',
      input: { shortCode: 'abc123', attemptCount: 3 },
      expectedOutput: 'abc123c', // Append 'c'
    },
    {
      id: 'test_many_collisions',
      name: 'High collision rate (use random)',
      input: { shortCode: 'abc123', attemptCount: 10 },
      expectedOutput: { pattern: /^abc123[a-zA-Z0-9]{2}$/ }, // Random 2-char suffix
    },
  ],

  performanceTargets: {
    maxTimeMs: 10,
  },

  referenceSolution: `function resolveCollision(shortCode: string, attemptCount: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  if (attemptCount <= 3) {
    // Linear probing: append sequential character
    const suffix = charset[attemptCount - 1];
    return shortCode + suffix;
  } else {
    // High collision rate: use random suffix
    const suffixLength = Math.ceil(attemptCount / 10) + 1;
    let suffix = '';
    for (let i = 0; i < suffixLength; i++) {
      suffix += charset[Math.floor(Math.random() * charset.length)];
    }
    return shortCode + suffix;
  }
}`,

  solutionExplanation: `**Collision Resolution Strategies**

**1. Linear Probing (Attempts 1-3):**
- Append 'a', 'b', 'c' to base short code
- Pros: Deterministic, maintains readability
- Cons: Sequential collisions if many URLs hash similarly

**2. Random Suffix (Attempts 4+):**
- Append random characters
- Pros: Breaks collision chains
- Cons: Less predictable

**3. Production Approach (Best Practice):**

\`\`\`typescript
// Use distributed ID generator (no collisions!)
class SnowflakeIdGenerator {
  private workerId: number;
  private sequence: number = 0;
  private lastTimestamp: number = 0;

  constructor(workerId: number) {
    this.workerId = workerId;
  }

  generateId(): bigint {
    let timestamp = Date.now();

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xFFF; // 12 bits
      if (this.sequence === 0) {
        // Wait for next millisecond
        while (timestamp <= this.lastTimestamp) {
          timestamp = Date.now();
        }
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // 64-bit ID: 41 bits timestamp + 10 bits worker + 13 bits sequence
    return (
      (BigInt(timestamp) << 22n) |
      (BigInt(this.workerId) << 12n) |
      BigInt(this.sequence)
    );
  }
}

// No collisions because IDs are globally unique!
const id = idGenerator.generateId();
const shortCode = base62Encode(id);
\`\`\`

**Interview Answer Framework:**

**For Hash-Based Approach:**
"I'd use linear probing for the first few collisions to maintain readability. If collisions persist, I'd append random suffixes. However, in production..."

**For Production System:**
"...I'd avoid the problem entirely by using a distributed ID generator like Twitter Snowflake. Each server gets a unique worker ID, and IDs are guaranteed unique through timestamp + worker + sequence bits. This eliminates collision checking entirely."

**Tradeoffs:**
| Approach | Collisions | Complexity | Performance |
|----------|------------|------------|-------------|
| Hash + Collision Handling | Yes | High | Medium |
| Auto-Increment ID | No | Low | High |
| Snowflake ID | No | Medium | Very High |

**Advanced Considerations:**
1. **Monitoring**: Track collision rates, alert if > 0.1%
2. **Pre-allocation**: Reserve ID ranges per server
3. **Custom URLs**: Handle premium users wanting specific codes
4. **Analytics**: Store collision stats for capacity planning`,

  interviewTips: [
    'Start with simple approach, then explain why production uses Snowflake',
    'Mention collision rate should be < 0.01% with good hash function',
    'Discuss database indexing: ensure short_code has unique index',
    'Explain how to handle custom vanity URLs (premium feature)',
  ],
};

export const tinyUrlCodeChallenges: CodeChallenge[] = [
  tinyUrlHashFunction,
  tinyUrlRateLimiter,
  tinyUrlCollisionHandling,
];
