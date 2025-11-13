/*
Web Crawler - Database Schema
==============================

Data Model Definition:
  Entities:
    1. crawled_pages: Store crawled web pages
    2. url_queue: URLs to crawl (frontier)
    3. domain_stats: Per-domain crawl statistics

Access Patterns:
  1. Write (store crawled pages): High frequency
  2. Read (check if URL crawled): Very high frequency
  3. Queue operations (add/get next URL): High frequency

Your Task:
  Define the database schema for a web crawler that:
    - Stores crawled pages
    - Manages URL queue (frontier)
    - Tracks crawl status per domain
    - Avoids duplicate crawls

Requirements:
  - Fast URL deduplication
  - Efficient queue operations (FIFO/priority)
  - Handle millions of URLs
  - Per-domain politeness tracking
  - Store page content and metadata

Questions to Consider:
  1. How to deduplicate URLs efficiently?
  2. How to implement priority queue in SQL?
  3. How to track crawl status per domain?
  4. How to handle large page content?
*/

-- TODO: Define your schema here!
-- This is a starter schema - optimize it based on access patterns

CREATE TABLE crawled_pages (
    url VARCHAR(2048),           -- TODO: Should this be PRIMARY KEY?
    title TEXT,                  -- Page title
    content TEXT,                -- Page content
    links_found INT,             -- Number of outbound links
    crawled_at TIMESTAMP         -- When was it crawled?
);

CREATE TABLE url_queue (
    url VARCHAR(2048),           -- URL to crawl
    priority INT,                -- Priority (lower = higher priority)
    added_at TIMESTAMP           -- When was it added?
    -- TODO: How to efficiently get next URL to crawl?
);

CREATE TABLE domain_stats (
    domain VARCHAR(255),         -- Domain name
    last_crawled_at TIMESTAMP,   -- Last crawl time (for politeness)
    pages_crawled INT            -- Total pages crawled from this domain
    -- TODO: Add indexes?
);


/*
============================================================================
Example Optimized Schemas (Uncomment to try)
============================================================================

-- Approach 1: Basic Optimized Schema
-- Fast deduplication, priority queue, domain tracking

CREATE TABLE crawled_pages (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2048) UNIQUE NOT NULL,  -- Unique constraint for deduplication
    url_hash VARCHAR(64) UNIQUE,        -- MD5/SHA hash for faster lookups
    domain VARCHAR(255) NOT NULL,
    title TEXT,
    content TEXT,
    meta_description TEXT,
    links_found INT DEFAULT 0,
    outbound_links JSONB,               -- Array of extracted links
    status_code INT,
    content_type VARCHAR(100),
    content_length INT,
    crawled_at TIMESTAMP DEFAULT NOW(),
    crawl_duration_ms INT
);

-- Indexes for crawled_pages
CREATE INDEX idx_crawled_url_hash ON crawled_pages(url_hash);
CREATE INDEX idx_crawled_domain ON crawled_pages(domain);
CREATE INDEX idx_crawled_timestamp ON crawled_pages(crawled_at DESC);


CREATE TABLE url_queue (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    url_hash VARCHAR(64) UNIQUE,        -- Deduplication
    domain VARCHAR(255) NOT NULL,
    priority INT DEFAULT 5,             -- 1 = highest, 10 = lowest
    depth INT DEFAULT 0,                -- Depth from seed URL
    added_at TIMESTAMP DEFAULT NOW(),
    scheduled_for TIMESTAMP,            -- For politeness delay
    status VARCHAR(20) DEFAULT 'pending',  -- pending, in_progress, completed, failed
    retry_count INT DEFAULT 0,
    last_error TEXT
);

-- Indexes for url_queue (critical for performance!)
CREATE INDEX idx_queue_status_priority ON url_queue(status, priority, scheduled_for)
    WHERE status = 'pending';  -- Partial index for faster queue operations

CREATE INDEX idx_queue_url_hash ON url_queue(url_hash);
CREATE INDEX idx_queue_domain ON url_queue(domain);


CREATE TABLE domain_stats (
    domain VARCHAR(255) PRIMARY KEY,
    last_crawled_at TIMESTAMP,
    next_crawl_allowed_at TIMESTAMP,    -- For politeness (delay between requests)
    pages_crawled INT DEFAULT 0,
    pages_failed INT DEFAULT 0,
    avg_response_time_ms INT,
    robots_txt_url VARCHAR(2048),
    robots_txt_content TEXT,
    is_blocked BOOLEAN DEFAULT FALSE    -- If robots.txt disallows crawling
);

CREATE INDEX idx_domain_next_crawl ON domain_stats(next_crawl_allowed_at);


-- Approach 2: With Full-Text Search Integration
-- Store pages and make them searchable

CREATE TABLE crawled_pages (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2048) UNIQUE NOT NULL,
    url_hash VARCHAR(64) UNIQUE,
    domain VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    meta_description TEXT,
    links_found INT DEFAULT 0,
    outbound_links JSONB,
    crawled_at TIMESTAMP DEFAULT NOW(),

    -- For full-text search
    search_vector tsvector,             -- Pre-computed search vector
    page_rank FLOAT DEFAULT 0.0,        -- PageRank score
    importance_score FLOAT DEFAULT 0.0  -- Combined relevance score
);

-- Full-text search index
CREATE INDEX idx_pages_search ON crawled_pages USING gin(search_vector);

-- Trigger to automatically update search_vector
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
ON crawled_pages FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, content);


-- Approach 3: Partitioned for Scale
-- Partition by domain or crawl date for large crawls

CREATE TABLE crawled_pages (
    id BIGSERIAL,
    url VARCHAR(2048) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    title TEXT,
    content TEXT,
    crawled_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, crawled_at)
) PARTITION BY RANGE (crawled_at);

-- Create monthly partitions
CREATE TABLE crawled_pages_2024_01 PARTITION OF crawled_pages
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE crawled_pages_2024_02 PARTITION OF crawled_pages
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');


-- Approach 4: With Graph Structure (for PageRank)
-- Track links between pages for graph algorithms

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2048) UNIQUE NOT NULL,
    domain VARCHAR(255),
    title TEXT,
    content TEXT,
    crawled_at TIMESTAMP
);

CREATE TABLE page_links (
    from_page_id INT REFERENCES pages(id),
    to_page_id INT REFERENCES pages(id),
    anchor_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (from_page_id, to_page_id)
);

-- Indexes for graph traversal
CREATE INDEX idx_links_from ON page_links(from_page_id);
CREATE INDEX idx_links_to ON page_links(to_page_id);

-- For PageRank calculation
CREATE INDEX idx_links_to_count ON page_links(to_page_id);
*/


/*
============================================================================
Queue Operations (How to get next URL efficiently)
============================================================================

-- Get next URL to crawl (with priority and politeness)
-- This query respects:
--   1. Priority (lowest number first)
--   2. Politeness delay (scheduled_for timestamp)
--   3. Domain rate limiting

SELECT q.id, q.url, q.domain
FROM url_queue q
JOIN domain_stats d ON q.domain = d.domain
WHERE q.status = 'pending'
  AND (q.scheduled_for IS NULL OR q.scheduled_for <= NOW())
  AND (d.next_crawl_allowed_at IS NULL OR d.next_crawl_allowed_at <= NOW())
  AND d.is_blocked = FALSE
ORDER BY q.priority ASC, q.added_at ASC
LIMIT 1
FOR UPDATE SKIP LOCKED;  -- Lock row to prevent race conditions

-- Mark URL as in progress
UPDATE url_queue
SET status = 'in_progress',
    scheduled_for = NOW() + INTERVAL '5 minutes'  -- Timeout
WHERE id = ?;

-- Mark URL as completed
UPDATE url_queue
SET status = 'completed'
WHERE id = ?;

-- Update domain stats after crawl
UPDATE domain_stats
SET last_crawled_at = NOW(),
    next_crawl_allowed_at = NOW() + INTERVAL '1 second',  -- Politeness delay
    pages_crawled = pages_crawled + 1
WHERE domain = ?;


-- Add new URL to queue (with deduplication)
INSERT INTO url_queue (url, url_hash, domain, priority)
VALUES (?, MD5(?), ?, ?)
ON CONFLICT (url_hash) DO NOTHING;  -- Skip if already exists
*/


/*
============================================================================
Performance Considerations
============================================================================

1. URL Deduplication:
   - Method 1: UNIQUE constraint on url
     Pros: Simple, enforced by DB
     Cons: Slow for long URLs (> 2KB limit)

   - Method 2: UNIQUE constraint on url_hash
     Pros: Fast, no length limit
     Cons: Tiny collision risk (~1 in 2^128 for MD5)

   - Recommended: Use url_hash with MD5/SHA256

2. Queue Performance:
   - Use partial index on (status, priority) WHERE status = 'pending'
   - Only indexes pending URLs (much smaller)
   - Faster queue operations

3. Storage Calculation:
   - Average page: 2KB (URL) + 10KB (content) + 1KB (metadata) = 13KB
   - 1M pages: 13GB
   - 10M pages: 130GB
   - 100M pages: 1.3TB

4. Queue Size:
   - Typical crawler: 10M URLs in queue
   - With priority index: 100MB index
   - Fast operations: O(log n) = ~23 disk seeks for 10M URLs

5. Domain Politeness:
   - Update domain_stats.next_crawl_allowed_at after each crawl
   - Filter queue by next_crawl_allowed_at <= NOW()
   - Ensures respectful crawling (1 req/sec per domain)

============================================================================
Interview Talking Points
============================================================================

Q: "How do you handle duplicate URLs?"
A: "Use MD5/SHA256 hash of URL as unique key. Faster than comparing full URLs. ON CONFLICT DO NOTHING for deduplication."

Q: "How do you implement priority queue in SQL?"
A: "Order by (status, priority, scheduled_for). Use partial index on status='pending'. FOR UPDATE SKIP LOCKED prevents race conditions."

Q: "What about robots.txt compliance?"
A: "Store robots.txt content in domain_stats. Check before crawling. Mark domain as blocked if disallowed."

Q: "How to handle politeness (rate limiting)?"
A: "Track domain_stats.next_crawl_allowed_at. Update after each crawl with delay (e.g., +1 second). Queue query filters by this."

Q: "What if page content is too large for database?"
A: "Store content > 1MB in S3. Keep URL in database. Link via s3_key field. Only index metadata."

Q: "How to implement PageRank?"
A: "Store page links in page_links table. Run graph algorithm (iterative matrix multiplication) periodically. Store score in pages.page_rank."

============================================================================
*/
