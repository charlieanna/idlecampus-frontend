"""
Web Crawler - URL Frontier Management API
==========================================

Functional Requirement:
  "Manage URL queue and avoid duplicate crawls"

API: Frontier management for web crawler
Methods:
  - add_url(url): Add URL to crawl queue
  - get_next_url(): Get next URL to crawl
  - mark_crawled(url): Mark URL as crawled
  - is_crawled(url): Check if URL already crawled

Your Task:
  Implement URL frontier (queue) that:
  1. Maintains queue of URLs to crawl
  2. Prioritizes important URLs
  3. Avoids duplicate crawls
  4. Handles politeness (rate limiting per domain)

What is URL Frontier?
  The queue of URLs waiting to be crawled

  Components:
    1. Pending queue: URLs to crawl
    2. Crawled set: URLs already crawled (deduplication)
    3. Priority: Important URLs crawled first
    4. Politeness: Rate limit per domain (don't hammer servers)

Examples:
  frontier = URLFrontier()
  frontier.add_url("https://example.com")
  frontier.add_url("https://example.com/page1")

  next_url = frontier.get_next_url()
    → "https://example.com"

  frontier.mark_crawled(next_url)
  frontier.is_crawled("https://example.com")
    → True

Requirements:
  1. Deduplicate URLs (don't crawl same URL twice)
  2. Priority queue (important URLs first)
  3. Politeness (delay between requests to same domain)
  4. Handle millions of URLs
  5. Fast operations (O(1) add, O(log n) get_next)

Design Patterns:
  - Priority queue: heapq
  - Deduplication: set or Bloom filter
  - Politeness: per-domain rate limiting
"""

import heapq
import time
from urllib.parse import urlparse
from typing import Optional, Set, Dict
from collections import defaultdict, deque


class URLFrontier:
    """
    URL Frontier for web crawler.

    Manages queue of URLs to crawl with:
      - Deduplication
      - Priority-based ordering
      - Per-domain politeness
    """

    def __init__(self, politeness_delay: float = 1.0):
        """
        Initialize URL frontier.

        Args:
            politeness_delay: Seconds to wait between requests to same domain
        """
        # TODO: Implement proper data structures!

        self.pending_urls = []  # Priority queue
        self.crawled_urls = set()  # Deduplic ation
        self.domain_last_crawl = {}  # Politeness tracking
        self.politeness_delay = politeness_delay

    def add_url(self, url: str, priority: int = 0):
        """
        Add URL to frontier.

        Args:
            url: URL to add
            priority: Priority (lower number = higher priority)

        TODO: Implement URL addition with deduplication
        """
        pass

    def get_next_url(self) -> Optional[str]:
        """
        Get next URL to crawl (respecting politeness).

        Returns:
            Next URL to crawl, or None if queue is empty

        TODO: Implement priority-based URL selection with politeness
        """
        return None

    def mark_crawled(self, url: str):
        """
        Mark URL as crawled.

        Args:
            url: The URL that was crawled

        TODO: Implement crawled tracking
        """
        pass

    def is_crawled(self, url: str) -> bool:
        """
        Check if URL has been crawled.

        Args:
            url: URL to check

        Returns:
            True if already crawled

        TODO: Implement crawled check
        """
        return False

    def size(self) -> int:
        """Return number of URLs in queue"""
        return len(self.pending_urls)


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

class URLFrontierOptimized:
    """
    Approach 1: Priority Queue with Deduplication

    Data structures:
      - Priority queue (heapq): O(log n) insert, O(log n) pop
      - Seen set: O(1) deduplication check
      - Domain tracking: O(1) politeness check

    Performance:
      - add_url: O(log n)
      - get_next_url: O(log n)
      - is_crawled: O(1)
      - Space: O(n) where n = total URLs
    """

    def __init__(self, politeness_delay: float = 1.0):
        self.pending_queue = []  # Priority queue: (priority, timestamp, url)
        self.seen_urls = set()  # All URLs seen (pending + crawled)
        self.crawled_urls = set()  # URLs already crawled
        self.domain_last_crawl = {}  # domain -> last crawl timestamp
        self.politeness_delay = politeness_delay
        self.counter = 0  # Tie-breaker for equal priorities

    def add_url(self, url: str, priority: int = 0):
        """Add URL to frontier with deduplication"""
        # Normalize URL (remove fragment)
        url = url.split('#')[0]

        # Skip if already seen
        if url in self.seen_urls:
            return

        # Add to queue
        self.seen_urls.add(url)
        heapq.heappush(self.pending_queue, (priority, self.counter, url))
        self.counter += 1

    def get_next_url(self) -> Optional[str]:
        """Get next URL respecting politeness"""
        while self.pending_queue:
            priority, _, url = heapq.heappop(self.pending_queue)

            # Check if already crawled (might be in queue multiple times)
            if url in self.crawled_urls:
                continue

            # Check politeness for domain
            domain = self._get_domain(url)
            last_crawl = self.domain_last_crawl.get(domain, 0)
            time_since_last = time.time() - last_crawl

            if time_since_last < self.politeness_delay:
                # Too soon! Put back in queue with delay
                heapq.heappush(self.pending_queue, (priority, self.counter, url))
                self.counter += 1
                time.sleep(self.politeness_delay - time_since_last)
                continue

            # Update last crawl time for domain
            self.domain_last_crawl[domain] = time.time()
            return url

        return None

    def mark_crawled(self, url: str):
        """Mark URL as crawled"""
        self.crawled_urls.add(url)

    def is_crawled(self, url: str) -> bool:
        """Check if URL crawled"""
        return url in self.crawled_urls

    def _get_domain(self, url: str) -> str:
        """Extract domain from URL"""
        return urlparse(url).netloc

    def size(self) -> int:
        """Number of pending URLs"""
        return len(self.pending_queue)


class URLFrontierWithBloomFilter:
    """
    Approach 2: Use Bloom Filter for Deduplication

    For very large crawls (billions of URLs):
      - Bloom filter for seen URLs (probabilistic, low memory)
      - Only ~10 bits per URL vs 100+ bytes in set
      - 1% false positive rate is acceptable

    Memory savings:
      - 1B URLs in set: ~100GB
      - 1B URLs in Bloom filter: ~1.2GB

    Note: Using simple set here. In production, use:
      - Redis Bloom filter
      - pybloom or pybloomfiltermmap
    """

    def __init__(self, politeness_delay: float = 1.0):
        self.pending_queue = []
        self.bloom_filter = set()  # Replace with real Bloom filter in production
        self.crawled_urls = set()
        self.domain_last_crawl = {}
        self.politeness_delay = politeness_delay
        self.counter = 0

    def add_url(self, url: str, priority: int = 0):
        """Add URL with Bloom filter deduplication"""
        url = url.split('#')[0]

        # Check Bloom filter (fast, low memory)
        if url in self.bloom_filter:
            return  # Probably seen (may have false positives)

        self.bloom_filter.add(url)
        heapq.heappush(self.pending_queue, (priority, self.counter, url))
        self.counter += 1

    # ... rest same as URLFrontierOptimized


class DistributedURLFrontier:
    """
    Approach 3: Distributed Frontier (Production Scale)

    For multi-machine crawlers:
      - Queue: Redis/Kafka
      - Deduplication: Redis Bloom filter
      - Politeness: Per-domain queues

    Architecture:
      1. Master assigns domains to workers
      2. Each worker has domain-specific queue
      3. Centralized deduplication in Redis

    This is a simplified version showing the concept.
    """

    def __init__(self, worker_id: int, total_workers: int):
        self.worker_id = worker_id
        self.total_workers = total_workers
        self.domain_queues = defaultdict(deque)  # domain -> queue
        self.seen_urls = set()
        self.crawled_urls = set()

    def add_url(self, url: str, priority: int = 0):
        """Add URL to appropriate domain queue"""
        domain = self._get_domain(url)

        # Route to worker (consistent hashing)
        worker = hash(domain) % self.total_workers
        if worker != self.worker_id:
            # Forward to correct worker (in production, use message queue)
            return

        # Add to domain-specific queue
        if url not in self.seen_urls:
            self.seen_urls.add(url)
            self.domain_queues[domain].append((priority, url))

    def get_next_url(self) -> Optional[str]:
        """Get next URL from domain queues (round-robin)"""
        for domain, queue in self.domain_queues.items():
            if queue:
                priority, url = queue.popleft()
                return url
        return None

    def _get_domain(self, url: str) -> str:
        return urlparse(url).netloc


# ============================================================================
# Testing
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing URL Frontier")
    print("=" * 60)

    # Test 1: Basic operations
    print("\n[Test 1] Basic frontier operations:")
    frontier = URLFrontier()

    test_urls = [
        "https://example.com",
        "https://example.com/page1",
        "https://example.com/page2",
        "https://another.com",
    ]

    for url in test_urls:
        frontier.add_url(url)

    print(f"  Added {len(test_urls)} URLs")
    print(f"  Queue size: {frontier.size()}")

    # Test 2: Get next URL
    print("\n[Test 2] Get next URL:")
    next_url = frontier.get_next_url()
    if next_url:
        print(f"  ✓ Got URL: {next_url}")
        frontier.mark_crawled(next_url)
    else:
        print("  ✗ No URL returned! Did you implement get_next_url()?")

    # Test 3: Deduplication
    print("\n[Test 3] Deduplication test:")
    frontier.add_url("https://example.com")  # Duplicate
    frontier.add_url("https://example.com")  # Duplicate
    print(f"  Added 2 duplicate URLs")
    print(f"  Queue size: {frontier.size()}")
    print(f"  Status: {'✓ PASS' if frontier.size() <= len(test_urls) else '✗ FAIL (duplicates added)'}")

    # Test 4: Priority
    print("\n[Test 4] Priority test:")
    frontier2 = URLFrontierOptimized()
    frontier2.add_url("https://low-priority.com", priority=10)
    frontier2.add_url("https://high-priority.com", priority=1)

    first = frontier2.get_next_url()
    print(f"  First URL crawled: {first}")
    print(f"  Status: {'✓ PASS' if 'high-priority' in first else '✗ FAIL (wrong priority)'}")

    # Test 5: Performance
    print("\n[Test 5] Performance test (10,000 URLs):")
    frontier3 = URLFrontierOptimized()

    start = time.time()
    for i in range(10000):
        frontier3.add_url(f"https://example.com/page{i}")
    elapsed = time.time() - start

    print(f"  Time to add 10k URLs: {elapsed:.3f}s")
    print(f"  Rate: {10000 / elapsed:.0f} URLs/sec")
    print(f"  Status: {'✓ PASS' if elapsed < 1.0 else '✗ FAIL (too slow)'}")

    print("\n" + "=" * 60)
    print("Optimize your URLFrontier class!")
    print("Hint: Use heapq for priority queue and set for deduplication")
    print("=" * 60)
