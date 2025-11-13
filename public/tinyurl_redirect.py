"""
TinyURL - Redirect API
=======================

Functional Requirement:
  "Redirect users from short URL to original URL via HTTP 301/302"

API Endpoint: GET /{short_code}
Input: short_code (string)
Output: long_url (string)

Your Task:
  Implement the redirect() function to retrieve the original URL
  from a short code.

Examples:
  redirect("abc123") → "https://example.com/very/long/path"
  redirect("xyz789") → "https://github.com/user/repo"

Requirements:
  1. Fast lookups (< 50ms p99 latency)
  2. High throughput (handle 10,000+ redirects per second)
  3. Return None if short code not found
  4. Support caching for frequently accessed URLs

Access Pattern:
  - Very high read frequency (90% of traffic)
  - Read by key (short_code → long_url)
  - Perfect for caching!

Database Schema (Reference):
  url_mappings:
    - short_code (PK)
    - long_url
    - created_at
    - user_id
"""

# Mock database and cache (in production, replace with real DB/cache)
url_mappings = {}
cache = {}


def redirect(short_code: str) -> str | None:
    """
    Retrieve the original URL from a short code.

    Args:
        short_code: The short code to look up (e.g., "abc123")

    Returns:
        long_url: The original URL, or None if not found

    TODO: Implement your redirect logic here!

    Optimization hints:
      1. Check cache first (Redis in production)
      2. If cache miss, query database
      3. Update cache with result
      4. Handle cache stampede for popular URLs
    """
    # STARTER IMPLEMENTATION (Replace this!)
    # Simple dictionary lookup (no caching, no error handling)

    return url_mappings.get(short_code)


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

def redirect_with_cache(short_code: str) -> str | None:
    """
    Approach 1: Cache-Aside Pattern (Most common)

    Steps:
      1. Check cache (Redis)
      2. If hit → return from cache (fast!)
      3. If miss → query database
      4. Store in cache for next time

    Performance:
      - Cache hit: ~1ms
      - Cache miss: ~10ms (DB query + cache update)
      - With 90% hit ratio: avg ~2ms
    """
    # Step 1: Check cache
    if short_code in cache:
        return cache[short_code]

    # Step 2: Cache miss - query database
    long_url = url_mappings.get(short_code)

    # Step 3: Update cache
    if long_url:
        cache[short_code] = long_url

    return long_url


def redirect_with_ttl(short_code: str, ttl: int = 3600) -> str | None:
    """
    Approach 2: Cache with TTL (Time-To-Live)

    Add expiration to cache entries to:
      - Free up memory for inactive URLs
      - Allow for URL updates (if URLs can change)
      - Prevent stale data

    Args:
        short_code: The short code
        ttl: Time to live in seconds (default: 1 hour)
    """
    import time

    # Cache structure: {short_code: (long_url, expiry_time)}
    if short_code in cache:
        long_url, expiry = cache[short_code]
        if time.time() < expiry:
            return long_url  # Cache hit!
        else:
            del cache[short_code]  # Expired, remove

    # Cache miss - query database
    long_url = url_mappings.get(short_code)

    if long_url:
        # Store with expiration
        cache[short_code] = (long_url, time.time() + ttl)

    return long_url


def redirect_with_analytics(short_code: str) -> str | None:
    """
    Approach 3: Add Analytics Tracking

    Track clicks for analytics:
      - Increment click counter
      - Log timestamp, referrer, geographic data
      - Update asynchronously to avoid slowing down redirects

    Note: In production, use async task queue (Kafka, RabbitMQ)
          to avoid blocking the redirect response
    """
    long_url = redirect_with_cache(short_code)

    if long_url:
        # Async analytics update (don't block redirect!)
        # In production: queue.publish('analytics', {short_code, timestamp, ...})
        pass

    return long_url


# ============================================================================
# Testing
# ============================================================================

def setup_test_data():
    """Setup sample URL mappings for testing"""
    global url_mappings
    url_mappings = {
        'abc123': 'https://example.com/very/long/path',
        'xyz789': 'https://github.com/user/repository',
        'def456': 'https://stackoverflow.com/questions/12345',
    }


if __name__ == "__main__":
    setup_test_data()

    print("=" * 60)
    print("Testing Redirect Logic")
    print("=" * 60)

    # Test 1: Basic redirect
    print("\n[Test 1] Basic redirect:")
    short_code = 'abc123'
    long_url = redirect(short_code)
    print(f"  {short_code} → {long_url}")
    print(f"  Status: {'✓ PASS' if long_url else '✗ FAIL'}")

    # Test 2: Not found
    print("\n[Test 2] Handle not found:")
    result = redirect('notfound')
    print(f"  notfound → {result}")
    print(f"  Status: {'✓ PASS' if result is None else '✗ FAIL'}")

    # Test 3: Performance (simulate high load)
    print("\n[Test 3] Performance test (10,000 redirects):")
    import time
    start = time.time()
    for _ in range(10000):
        redirect('abc123')
    elapsed = time.time() - start
    rps = 10000 / elapsed
    avg_latency = (elapsed / 10000) * 1000  # Convert to ms
    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {rps:.0f} redirects/second")
    print(f"  Avg latency: {avg_latency:.2f}ms")
    print(f"  Status: {'✓ PASS' if rps >= 10000 else '✗ FAIL'}")

    # Test 4: Cache effectiveness
    print("\n[Test 4] Test caching:")
    cache.clear()

    # First access (cache miss)
    start = time.time()
    redirect_with_cache('abc123')
    miss_time = (time.time() - start) * 1000

    # Second access (cache hit)
    start = time.time()
    redirect_with_cache('abc123')
    hit_time = (time.time() - start) * 1000

    print(f"  Cache miss: {miss_time:.3f}ms")
    print(f"  Cache hit: {hit_time:.3f}ms")
    print(f"  Speedup: {miss_time / hit_time:.1f}x faster")
    print(f"  Status: {'✓ PASS' if hit_time < miss_time else '✗ FAIL'}")

    print("\n" + "=" * 60)
    print("Optimize your redirect() function for high throughput!")
    print("Hint: Use caching to reduce database load")
    print("=" * 60)
