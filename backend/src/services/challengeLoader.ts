/**
 * Challenge Loader Service
 * Loads code lab challenges and their test cases
 */

import { CodeLabChallenge } from '../types/index.js';

/**
 * TinyURL Code Challenges
 */

export const tinyUrlHashFunction: CodeLabChallenge = {
  id: 'tinyurl_hash_function',
  title: 'Implement Base62 Encoding',
  description: `Design a function to convert a numeric ID into a short, URL-safe string using Base62 encoding (a-z, A-Z, 0-9).

**Requirements:**
- Convert numbers 0-999999 to base62 strings
- Use character set: a-z, A-Z, 0-9 (62 characters)
- Shorter IDs should produce shorter strings
- Must be deterministic (same ID = same output)`,

  difficulty: 'easy',

  starter_code: `def generate_short_code(id: int) -> str:
    """
    Convert a numeric ID to a Base62 short code
    Args:
        id: Numeric identifier (0 to 999999999)
    Returns:
        Base62 encoded string
    """
    # TODO: Implement base62 encoding
    # Hint: Use modulo and division to convert base 10 to base 62

    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    # Your code here

    return ''
`,

  test_cases: [
    {
      name: 'ID = 0',
      input: [0],
      expected: 'a',
      description: 'First character in charset',
    },
    {
      name: 'Small ID',
      input: [62],
      expected: 'ba',
      description: '62 in base62',
    },
    {
      name: 'Medium ID',
      input: [12345],
      expected: 'dnh',
      description: '12345 in base62',
    },
    {
      name: 'Large ID',
      input: [999999],
      expected: 'FJp',
      description: '999999 in base62',
    },
  ],

  hints: [
    'Use modulo (%) operation to get the remainder when dividing by 62',
    'Build the result string from right to left',
    'Use floor division (//) to get the quotient',
  ],

  solution: `def generate_short_code(id: int) -> str:
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    if id == 0:
        return charset[0]

    result = ''
    num = id

    while num > 0:
        result = charset[num % 62] + result
        num = num // 62

    return result
`,

  time_limit: 5,
  memory_limit: 128,
};

export const tinyUrlRateLimiter: CodeLabChallenge = {
  id: 'tinyurl_rate_limiter',
  title: 'Implement Token Bucket Rate Limiter',
  description: `Implement a token bucket rate limiter to prevent abuse of the URL shortening service.

**Requirements:**
- Allow 10 requests per second per user
- Burst capacity of 20 tokens
- Refill rate: 10 tokens per second
- Return True if request allowed, False if rate limited`,

  difficulty: 'medium',

  starter_code: `class RateLimiter:
    def __init__(self, capacity=20, refill_rate=10):
        """
        Initialize rate limiter
        Args:
            capacity: Maximum token bucket size
            refill_rate: Tokens to add per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.buckets = {}

    def allow_request(self, user_id: str, timestamp: int) -> bool:
        """
        Check if request should be allowed
        Args:
            user_id: User identifier
            timestamp: Current timestamp in milliseconds
        Returns:
            True if allowed, False if rate limited
        """
        # TODO: Implement token bucket algorithm

        # Hint:
        # 1. Get or create bucket for user
        # 2. Calculate tokens to add based on time elapsed
        # 3. Refill bucket (up to capacity)
        # 4. Check if tokens available
        # 5. Consume token if available

        return False
`,

  test_cases: [
    {
      name: 'First request allowed',
      input: ['user1', 1000],
      expected: true,
      description: 'First request should always be allowed',
    },
    {
      name: 'Burst capacity test',
      input: {
        user_id: 'user2',
        requests: 20,
        timestamp: 1000,
      },
      expected: {
        allowed: 20,
        rejected: 0,
      },
      description: 'Should allow burst up to capacity',
    },
    {
      name: 'Rate limit test',
      input: {
        user_id: 'user3',
        requests: 25,
        timestamp: 1000,
      },
      expected: {
        allowed: 20,
        rejected: 5,
      },
      description: 'Should reject after burst exhausted',
    },
  ],

  hints: [
    'Store bucket state as {tokens: float, last_refill: int}',
    'Calculate elapsed time to determine tokens to add',
    'Use min() to cap tokens at capacity',
  ],

  solution: `class RateLimiter:
    def __init__(self, capacity=20, refill_rate=10):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.buckets = {}

    def allow_request(self, user_id: str, timestamp: int) -> bool:
        if user_id not in self.buckets:
            self.buckets[user_id] = {
                'tokens': self.capacity - 1,
                'last_refill': timestamp
            }
            return True

        bucket = self.buckets[user_id]

        # Calculate tokens to add
        elapsed_ms = timestamp - bucket['last_refill']
        elapsed_sec = elapsed_ms / 1000
        tokens_to_add = elapsed_sec * self.refill_rate

        # Refill bucket
        bucket['tokens'] = min(self.capacity, bucket['tokens'] + tokens_to_add)
        bucket['last_refill'] = timestamp

        # Check if token available
        if bucket['tokens'] >= 1:
            bucket['tokens'] -= 1
            return True

        return False
`,

  time_limit: 5,
  memory_limit: 128,
};

export const tinyUrlCollisionHandling: CodeLabChallenge = {
  id: 'tinyurl_collision_handling',
  title: 'Handle Hash Collisions Efficiently',
  description: `Design a collision resolution strategy for URL shortener when generated hash already exists.

**Requirements:**
- Minimize database lookups
- Keep short codes user-friendly
- Handle high collision rates gracefully`,

  difficulty: 'hard',

  starter_code: `def resolve_collision(short_code: str, attempt_count: int) -> str:
    """
    Generate alternative short code when collision occurs
    Args:
        short_code: The colliding short code
        attempt_count: Number of collision attempts (1, 2, 3, ...)
    Returns:
        New short code to try
    """
    # TODO: Implement collision resolution
    # Hint: Consider different strategies for different attempt counts
    #   - Attempt 1-3: Linear probing (append character)
    #   - Attempt 4+: Random suffix

    return short_code
`,

  test_cases: [
    {
      name: 'First collision',
      input: ['abc123', 1],
      expected: 'abc123a',
      description: 'Append first character',
    },
    {
      name: 'Multiple collisions',
      input: ['abc123', 3],
      expected: 'abc123c',
      description: 'Append third character',
    },
  ],

  hints: [
    'Use different strategies based on attempt count',
    'Linear probing for first few attempts',
    'Random suffix for many collisions',
  ],

  solution: `import random

def resolve_collision(short_code: str, attempt_count: int) -> str:
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    if attempt_count <= 3:
        # Linear probing
        suffix = charset[attempt_count - 1]
        return short_code + suffix
    else:
        # Random suffix
        suffix_length = (attempt_count // 10) + 1
        suffix = ''.join(random.choice(charset) for _ in range(suffix_length))
        return short_code + suffix
`,

  time_limit: 5,
  memory_limit: 128,
};

/**
 * Challenge registry
 */
const challenges = new Map<string, CodeLabChallenge>([
  [tinyUrlHashFunction.id, tinyUrlHashFunction],
  [tinyUrlRateLimiter.id, tinyUrlRateLimiter],
  [tinyUrlCollisionHandling.id, tinyUrlCollisionHandling],
  ['golang_basics', {
    id: 'golang_basics',
    title: 'Go Hello World',
    description: 'Learn the basics of Go programming language.',
    difficulty: 'easy',
    starter_code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    test_cases: [],
    hints: ['Check the syntax'],
    solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    time_limit: 5,
    memory_limit: 128,
  }]
]);

/**
 * Get challenge by ID
 */
export function getChallenge(id: string): CodeLabChallenge | undefined {
  return challenges.get(id);
}

/**
 * Get all challenges
 */
export function getAllChallenges(): CodeLabChallenge[] {
  return Array.from(challenges.values());
}

/**
 * Check if challenge exists
 */
export function challengeExists(id: string): boolean {
  return challenges.has(id);
}
