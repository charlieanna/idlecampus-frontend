"""
TinyURL - Create Short URL API
================================

Functional Requirement:
  "Given a long URL, generate a short URL"

API Endpoint: POST /shorten
Input: long_url (string)
Output: short_code (string)

Your Task:
  Implement the shorten() function to generate a unique short code
  from a long URL.

Examples:
  shorten("https://example.com/very/long/path") → "abc123"
  shorten("https://github.com/user/repo") → "xyz789"

Requirements:
  1. Generate short codes (6-10 characters)
  2. Must be URL-safe (alphanumeric only: a-z, A-Z, 0-9)
  3. Must be unique (avoid collisions)
  4. Performance: Handle 1000+ URLs per second

Available Libraries:
  import random      # For random generation
  import string      # For character sets
  import hashlib     # For MD5, SHA256 hashing
  import base64      # For base64 encoding

Approaches to Consider:
  1. Base62 encoding of sequential IDs
  2. MD5/SHA256 hash + truncate
  3. Random string generation with collision checking
  4. Counter-based with base conversion
"""

import random
import string
import hashlib
import base64


def shorten(long_url: str) -> str:
    """
    Generate a short code from a long URL.

    Args:
        long_url: The URL to shorten (e.g., "https://example.com/very/long/path")

    Returns:
        short_code: A unique short code (e.g., "abc123")

    TODO: Implement your URL shortening algorithm here!
    """
    # STARTER IMPLEMENTATION (Replace this!)
    # This generates a random 6-character code
    # Problems:
    #   - Not deterministic (same URL → different codes)
    #   - High collision probability
    #   - No collision handling

    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(6))


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

def shorten_md5(long_url: str) -> str:
    """
    Approach 1: MD5 Hash + Base64 (Deterministic)

    Pros:
      - Deterministic (same URL → same code)
      - Fast
      - Low collision rate

    Cons:
      - MD5 not cryptographically secure (ok for this use case)
      - Slightly longer codes
    """
    hash_digest = hashlib.md5(long_url.encode()).digest()
    # Take first 6 bytes and encode as base64
    encoded = base64.urlsafe_b64encode(hash_digest[:6]).decode('utf-8')
    # Remove padding and limit to 8 chars
    return encoded.replace('=', '')[:8]


def shorten_base62(counter: int) -> str:
    """
    Approach 2: Base62 Encoding of Counter (Production approach)

    This is what real systems like bit.ly use:
    - Use an auto-incrementing counter (database sequence)
    - Encode counter in base62 (a-z, A-Z, 0-9)

    Pros:
      - No collisions (each counter value is unique)
      - Short codes (62^6 = 56 billion URLs)
      - Fast

    Cons:
      - Requires centralized counter or distributed ID generator
      - Not deterministic (same URL can get different codes)

    Args:
        counter: Unique numeric ID (e.g., from database auto-increment)
    """
    charset = string.ascii_letters + string.digits  # 62 characters
    if counter == 0:
        return charset[0]

    result = []
    while counter > 0:
        result.append(charset[counter % 62])
        counter //= 62

    return ''.join(reversed(result))


# ============================================================================
# Testing
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing URL Shortening")
    print("=" * 60)

    # Test 1: Basic functionality
    print("\n[Test 1] Basic URL shortening:")
    test_urls = [
        "https://www.example.com/very/long/path/to/some/page",
        "https://github.com/user/repository/issues/12345",
        "https://stackoverflow.com/questions/123456/how-to-do-something",
    ]

    for url in test_urls:
        code = shorten(url)
        print(f"  {url[:50]:50} → {code}")

    # Test 2: Check code length
    print("\n[Test 2] Code length check:")
    codes = [shorten(url) for url in test_urls]
    all_valid_length = all(6 <= len(code) <= 10 for code in codes)
    print(f"  All codes between 6-10 chars: {'✓ PASS' if all_valid_length else '✗ FAIL'}")

    # Test 3: URL-safe characters
    print("\n[Test 3] URL-safe character check:")
    code = shorten("https://example.com")
    safe_chars = set(string.ascii_letters + string.digits + '-_')
    all_safe = all(c in safe_chars for c in code)
    print(f"  Code: {code}")
    print(f"  All chars URL-safe: {'✓ PASS' if all_safe else '✗ FAIL'}")

    # Test 4: Performance
    print("\n[Test 4] Performance test (10,000 URLs):")
    import time
    start = time.time()
    for i in range(10000):
        shorten(f"https://example.com/page/{i}")
    elapsed = time.time() - start
    rps = 10000 / elapsed
    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {rps:.0f} URLs/second")
    print(f"  Status: {'✓ PASS' if rps >= 1000 else '✗ FAIL'}")

    print("\n" + "=" * 60)
    print("Optimize your shorten() function to pass all tests!")
    print("=" * 60)
