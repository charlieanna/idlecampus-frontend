"""
Web Crawler - Crawl Web Page API
=================================

Functional Requirement:
  "Crawl web pages and extract content and links"

API Endpoint: POST /crawl
Input: url (string)
Output: page_data (dict with content, links, metadata)

Your Task:
  Implement the crawl_page() function to:
  1. Fetch HTML from a URL
  2. Extract text content
  3. Extract all links on the page
  4. Extract metadata (title, description)
  5. Handle errors gracefully

Examples:
  crawl_page("https://example.com")
    → {
        "url": "https://example.com",
        "title": "Example Domain",
        "content": "Example text...",
        "links": ["https://example.com/page1", ...],
        "crawled_at": "2024-01-15T10:30:00"
      }

Requirements:
  1. Respect robots.txt
  2. Handle redirects
  3. Extract clean text (remove HTML tags)
  4. Extract absolute URLs (convert relative → absolute)
  5. Handle 100+ pages per second

Available Libraries:
  # For HTTP requests
  import requests

  # For HTML parsing
  from bs4 import BeautifulSoup
  from html.parser import HTMLParser

  # For URL handling
  from urllib.parse import urljoin, urlparse
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List
from datetime import datetime
import time

# User agent (identify ourselves to web servers)
USER_AGENT = 'SimpleWebCrawler/1.0 (+http://example.com/bot)'


def crawl_page(url: str, timeout: int = 10) -> Dict:
    """
    Crawl a web page and extract content and links.

    Args:
        url: The URL to crawl (e.g., "https://example.com")
        timeout: Request timeout in seconds (default: 10)

    Returns:
        Dict with page data:
          - url: The crawled URL
          - title: Page title
          - content: Extracted text content
          - links: List of URLs found on page
          - metadata: Additional data (description, etc.)
          - crawled_at: Timestamp

    TODO: Implement web page crawling!

    Steps:
      1. Fetch HTML from URL
      2. Parse HTML with BeautifulSoup
      3. Extract title and content
      4. Extract all links (convert relative → absolute)
      5. Return structured data
    """
    # STARTER IMPLEMENTATION (Replace this!)
    # Basic fetch without proper parsing

    try:
        response = requests.get(url, timeout=timeout, headers={'User-Agent': USER_AGENT})
        response.raise_for_status()

        # TODO: Parse HTML and extract data properly!

        return {
            "url": url,
            "title": "",  # TODO: Extract title
            "content": "",  # TODO: Extract text
            "links": [],  # TODO: Extract links
            "status_code": response.status_code,
            "crawled_at": datetime.now().isoformat()
        }

    except Exception as e:
        return {
            "url": url,
            "error": str(e),
            "crawled_at": datetime.now().isoformat()
        }


def extract_links(html: str, base_url: str) -> List[str]:
    """
    Extract all links from HTML.

    Args:
        html: HTML content
        base_url: Base URL for resolving relative links

    Returns:
        List of absolute URLs

    TODO: Implement link extraction
    """
    return []


def clean_text(html: str) -> str:
    """
    Extract clean text from HTML (remove tags).

    Args:
        html: HTML content

    Returns:
        Clean text

    TODO: Implement text extraction
    """
    return ""


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

def crawl_page_optimized(url: str, timeout: int = 10) -> Dict:
    """
    Approach 1: Proper HTML Parsing

    Steps:
      1. Fetch HTML with proper headers
      2. Parse with BeautifulSoup
      3. Extract title, meta description
      4. Extract clean text (remove scripts, styles)
      5. Extract and normalize all links

    Performance:
      - Fetch: ~500ms average
      - Parse: ~50ms
      - Total: ~550ms per page
    """
    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    try:
        # Fetch HTML
        response = requests.get(url, timeout=timeout, headers=headers, allow_redirects=True)
        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract title
        title = soup.find('title')
        title_text = title.get_text(strip=True) if title else ""

        # Extract meta description
        description = ""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            description = meta_desc['content']

        # Extract clean text
        # Remove script and style elements
        for script in soup(['script', 'style', 'nav', 'footer', 'header']):
            script.decompose()

        content = soup.get_text(separator=' ', strip=True)
        # Limit content size
        content = content[:5000] if len(content) > 5000 else content

        # Extract links
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Convert relative URLs to absolute
            absolute_url = urljoin(url, href)
            # Only include http/https links
            if absolute_url.startswith('http'):
                links.append(absolute_url)

        # Remove duplicates
        links = list(set(links))

        return {
            "url": response.url,  # Final URL after redirects
            "title": title_text,
            "description": description,
            "content": content,
            "links": links,
            "link_count": len(links),
            "content_length": len(content),
            "status_code": response.status_code,
            "content_type": response.headers.get('Content-Type', ''),
            "crawled_at": datetime.now().isoformat()
        }

    except requests.exceptions.Timeout:
        return {
            "url": url,
            "error": "Timeout",
            "crawled_at": datetime.now().isoformat()
        }
    except requests.exceptions.RequestException as e:
        return {
            "url": url,
            "error": str(e),
            "crawled_at": datetime.now().isoformat()
        }


def crawl_with_robots_txt(url: str) -> Dict:
    """
    Approach 2: Respect robots.txt

    Check robots.txt before crawling:
      - Is this URL allowed?
      - What's the crawl delay?

    In production, use: robotparser module
    """
    from urllib.robotparser import RobotFileParser

    # Parse robots.txt
    parsed_url = urlparse(url)
    robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"

    rp = RobotFileParser()
    rp.set_url(robots_url)
    try:
        rp.read()

        # Check if URL can be crawled
        if not rp.can_fetch(USER_AGENT, url):
            return {
                "url": url,
                "error": "Blocked by robots.txt",
                "crawled_at": datetime.now().isoformat()
            }

        # Get crawl delay
        crawl_delay = rp.crawl_delay(USER_AGENT)
        if crawl_delay:
            time.sleep(crawl_delay)

    except Exception:
        # If robots.txt fails, assume allowed
        pass

    # Proceed with crawl
    return crawl_page_optimized(url)


def crawl_with_retry(url: str, max_retries: int = 3) -> Dict:
    """
    Approach 3: Add Retry Logic

    Handle transient failures:
      - Timeout → retry with backoff
      - 5xx errors → retry
      - 4xx errors → don't retry

    Exponential backoff: 1s, 2s, 4s
    """
    for attempt in range(max_retries):
        result = crawl_page_optimized(url)

        # Success
        if 'error' not in result or result.get('status_code', 0) < 500:
            return result

        # Retry with exponential backoff
        if attempt < max_retries - 1:
            delay = 2 ** attempt
            print(f"Retry {attempt + 1}/{max_retries} after {delay}s...")
            time.sleep(delay)

    return result


# ============================================================================
# Testing
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Web Crawler")
    print("=" * 60)

    # Test 1: Crawl example.com (safe test site)
    print("\n[Test 1] Crawl example.com:")
    result = crawl_page("http://example.com")

    if 'error' not in result:
        print(f"  ✓ Title: {result.get('title', 'N/A')}")
        print(f"  ✓ Links found: {len(result.get('links', []))}")
        print(f"  ✓ Content length: {len(result.get('content', ''))} chars")
    else:
        print(f"  ✗ Error: {result['error']}")

    # Test 2: Extract links
    print("\n[Test 2] Link extraction:")
    links = result.get('links', [])
    if links:
        print(f"  Found {len(links)} links:")
        for link in links[:5]:
            print(f"    - {link}")
    else:
        print("  ⚠ No links extracted! Did you implement link extraction?")

    # Test 3: Performance
    print("\n[Test 3] Performance test (10 pages):")
    test_url = "http://example.com"

    start = time.time()
    for i in range(10):
        crawl_page(test_url)
    elapsed = time.time() - start
    pages_per_sec = 10 / elapsed

    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {pages_per_sec:.1f} pages/second")
    print(f"  Avg time per page: {elapsed / 10 * 1000:.0f}ms")
    print(f"  Status: {'✓ PASS' if elapsed < 10 else '✗ FAIL'}")

    print("\n" + "=" * 60)
    print("Optimize your crawl_page() function!")
    print("Hint: Parse HTML and extract title, content, and links")
    print("=" * 60)
