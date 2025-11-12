"""
TinyURL System Design - URL Shortening Algorithm Challenge
=============================================================

Your task: Optimize the shorten() function to meet production requirements.

REQUIREMENTS:
-------------
1. Generate short codes that are 6-10 characters long
2. Must be collision-resistant (avoid duplicate codes)
3. Should be deterministic (same URL → same code) OR handle collisions
4. Must be URL-safe (alphanumeric only)
5. Performance: Handle 1000+ URLs per second

AVAILABLE LIBRARIES:
-------------------
import random      # For random string generation
import string      # For character sets
import hashlib     # For MD5, SHA256 hashing
import base64      # For base64 encoding

OPTIMIZATION IDEAS:
------------------
1. Use hashlib.md5() or hashlib.sha256() for deterministic hashing
2. Use base64 encoding to shorten hash output
3. Use random.choice() with a custom charset for non-deterministic codes
4. Implement collision detection and retry logic
5. Use a counter-based approach with base62 encoding

INTERVIEW DISCUSSION POINTS:
---------------------------
- Why did you choose this approach?
- How does it handle collisions?
- What's the trade-off between deterministic vs random?
- How would you scale this in a distributed system?
- What's the maximum number of URLs this supports?
"""

import random
import string
import hashlib
import base64
from typing import Dict, Optional


def shorten(url: str) -> str:
    """
    Generate a short code for the given URL.

    STARTER IMPLEMENTATION (NOT OPTIMIZED):
    This basic version generates a random 6-character code.
    Problems:
    - Not deterministic (same URL → different codes)
    - High collision probability
    - No collision handling

    YOUR TASK: Optimize this function!

    Args:
        url: The long URL to shorten (e.g., "https://example.com/very/long/path")

    Returns:
        A short code string (6-10 characters, alphanumeric)

    Examples:
        >>> shorten("https://example.com/page")
        'a3K9pL'
        >>> shorten("https://google.com")
        'bX2mN9'
    """
    # BASIC IMPLEMENTATION (Replace this with your optimized version!)
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(6))


def expand(code: str, store: Dict[str, str]) -> Optional[str]:
    """
    Retrieve the original URL from a short code.

    Args:
        code: The short code to expand
        store: Dictionary mapping {code: url}

    Returns:
        The original URL, or None if not found

    Examples:
        >>> store = {'a3K9pL': 'https://example.com/page'}
        >>> expand('a3K9pL', store)
        'https://example.com/page'
    """
    return store.get(code)


def test_shorten():
    """
    Test the shorten() function.
    """
    print("=" * 60)
    print("Testing URL Shortening Algorithm")
    print("=" * 60)

    # Test 1: Basic functionality
    print("\n[Test 1] Basic URL shortening:")
    test_urls = [
        "https://www.example.com/very/long/path/to/some/page",
        "https://github.com/user/repository/issues/12345",
        "https://stackoverflow.com/questions/123456/how-to-do-something",
    ]

    store = {}
    for url in test_urls:
        code = shorten(url)
        store[code] = url
        print(f"  {url[:50]:50} → {code}")

    # Test 2: Check code length
    print("\n[Test 2] Code length check:")
    codes = [shorten(url) for url in test_urls]
    all_valid_length = all(6 <= len(code) <= 10 for code in codes)
    print(f"  All codes between 6-10 chars: {'✓ PASS' if all_valid_length else '✗ FAIL'}")
    for code in codes:
        print(f"    {code} (length: {len(code)})")

    # Test 3: Deterministic check (same URL should give same code)
    print("\n[Test 3] Deterministic check:")
    url = "https://example.com/test"
    code1 = shorten(url)
    code2 = shorten(url)
    is_deterministic = (code1 == code2)
    print(f"  Same URL → Same code: {'✓ PASS' if is_deterministic else '✗ FAIL (random approach)'}")
    print(f"    First call:  {code1}")
    print(f"    Second call: {code2}")

    # Test 4: Collision test (with many URLs)
    print("\n[Test 4] Collision test (generating 1000 codes):")
    codes = set()
    collisions = 0
    num_urls = 1000

    for i in range(num_urls):
        url = f"https://example.com/page/{i}"
        code = shorten(url)
        if code in codes:
            collisions += 1
        codes.add(code)

    collision_rate = (collisions / num_urls) * 100
    print(f"  Total codes: {num_urls}")
    print(f"  Unique codes: {len(codes)}")
    print(f"  Collisions: {collisions} ({collision_rate:.2f}%)")
    print(f"  Status: {'✓ PASS' if collision_rate < 1 else '⚠ WARNING' if collision_rate < 5 else '✗ FAIL'}")

    # Test 5: Performance test
    print("\n[Test 5] Performance test (10,000 URLs):")
    import time
    start = time.time()
    for i in range(10000):
        shorten(f"https://example.com/page/{i}")
    elapsed = time.time() - start
    rps = 10000 / elapsed
    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {rps:.0f} URLs/second")
    print(f"  Status: {'✓ PASS' if rps >= 1000 else '✗ FAIL'}")

    # Test 6: URL-safe characters
    print("\n[Test 6] URL-safe character check:")
    code = shorten("https://example.com")
    safe_chars = set(string.ascii_letters + string.digits + '-_')
    all_safe = all(c in safe_chars for c in code)
    print(f"  Code: {code}")
    print(f"  All chars URL-safe: {'✓ PASS' if all_safe else '✗ FAIL'}")

    print("\n" + "=" * 60)
    print("Testing complete!")
    print("=" * 60)


# ============================================================================
# OPTIMIZATION EXAMPLES (Uncomment to try different approaches)
# ============================================================================

def shorten_md5_approach(url: str) -> str:
    """
    Approach 1: MD5 Hash + Base64 (Deterministic)

    Pros:
    - Deterministic (same URL → same code)
    - Fast
    - Low collision rate

    Cons:
    - Slightly longer codes
    - MD5 is not cryptographically secure (but ok for this use case)
    """
    hash_digest = hashlib.md5(url.encode()).digest()
    # Take first 6 bytes and encode as base64
    encoded = base64.urlsafe_b64encode(hash_digest[:6]).decode('utf-8')
    # Remove padding and limit to 8 chars
    return encoded.replace('=', '')[:8]


def shorten_sha256_approach(url: str) -> str:
    """
    Approach 2: SHA256 Hash + Base64 (More secure, deterministic)

    Pros:
    - Deterministic
    - Better collision resistance than MD5
    - Cryptographically secure

    Cons:
    - Slightly slower than MD5
    """
    hash_digest = hashlib.sha256(url.encode()).digest()
    encoded = base64.urlsafe_b64encode(hash_digest[:6]).decode('utf-8')
    return encoded.replace('=', '')[:8]


def shorten_base62_counter(url: str, counter: int) -> str:
    """
    Approach 3: Base62 Encoding of Counter (Production approach)

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
        url: The URL (not used in this approach)
        counter: Unique numeric ID (e.g., from database)
    """
    charset = string.ascii_letters + string.digits  # 62 characters
    if counter == 0:
        return charset[0]

    result = []
    while counter > 0:
        result.append(charset[counter % 62])
        counter //= 62

    return ''.join(reversed(result))


def shorten_hybrid_approach(url: str, store: Dict[str, str]) -> str:
    """
    Approach 4: Hash with Collision Detection (Best of both worlds)

    1. Generate deterministic hash
    2. Check if collision exists
    3. If collision, append random suffix

    Pros:
    - Mostly deterministic
    - Handles collisions gracefully
    - Good for systems with retry logic

    Cons:
    - Requires database lookup to check collision
    """
    # Generate base code using hash
    hash_digest = hashlib.md5(url.encode()).digest()
    base_code = base64.urlsafe_b64encode(hash_digest[:5]).decode('utf-8').replace('=', '')[:7]

    # Check for collision
    if base_code not in store or store[base_code] == url:
        return base_code

    # Collision detected - append random suffix
    suffix = random.choice(string.ascii_letters + string.digits)
    return base_code + suffix


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Run the test suite
    test_shorten()

    print("\n" + "=" * 60)
    print("Try optimizing the shorten() function above!")
    print("=" * 60)
    print("\nOptimization strategies:")
    print("1. Use shorten_md5_approach() for deterministic hashing")
    print("2. Use shorten_sha256_approach() for better security")
    print("3. Use shorten_base62_counter() for production-grade (no collisions)")
    print("4. Use shorten_hybrid_approach() for collision handling")
    print("\nReplace the shorten() function with your optimized version!")
    print("=" * 60)
