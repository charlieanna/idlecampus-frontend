/*
TinyURL - Database Schema
==========================

Data Model Definition:
  Entity: url_mapping
  Fields: short_code, long_url, created_at, user_id

Access Patterns:
  1. Write (creating short URLs): Low frequency (~10% of traffic)
  2. Read by key (redirecting): Very high frequency (~90% of traffic)

Your Task:
  Define the database schema to support these access patterns.
  Consider indexing, data types, and constraints.

Requirements:
  - Store mapping: short_code → long_url
  - Fast lookups by short_code
  - Support 1M+ URL mappings
  - Handle 1000+ reads per second

Questions to Consider:
  1. What should be the PRIMARY KEY?
  2. Do you need additional indexes?
  3. What data types for each column?
  4. Any constraints (UNIQUE, NOT NULL)?
*/

-- TODO: Define your schema here!
-- This is a starter schema - optimize it based on access patterns

CREATE TABLE url_mappings (
    short_code VARCHAR(10),      -- TODO: Should this be PRIMARY KEY?
    long_url TEXT,               -- TODO: Add constraints?
    created_at TIMESTAMP,        -- TODO: Add DEFAULT NOW()?
    user_id INT                  -- TODO: Add index for user queries?
);

-- TODO: Add indexes for your access patterns
-- Hint: Read-heavy workload → index on lookup key (short_code)

-- Example: CREATE INDEX idx_short_code ON url_mappings(short_code);


/*
============================================================================
Example Optimized Schemas (Uncomment to try)
============================================================================

-- Approach 1: Basic Optimized Schema
-- Primary key on short_code for fast lookups

CREATE TABLE url_mappings (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INT
);

-- Index on user_id for querying user's URLs
CREATE INDEX idx_user_id ON url_mappings(user_id);

-- Index on created_at for analytics/reports
CREATE INDEX idx_created_at ON url_mappings(created_at);


-- Approach 2: With Analytics
-- Separate table for click analytics to avoid write contention

CREATE TABLE url_mappings (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INT,
    clicks INT DEFAULT 0
);

CREATE TABLE url_clicks (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) REFERENCES url_mappings(short_code),
    clicked_at TIMESTAMP DEFAULT NOW(),
    referrer TEXT,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_clicks_short_code ON url_clicks(short_code);
CREATE INDEX idx_clicks_timestamp ON url_clicks(clicked_at);


-- Approach 3: Partitioned for Scale
-- Partition by created_at for efficient data management

CREATE TABLE url_mappings (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INT,
    clicks INT DEFAULT 0
) PARTITION BY RANGE (created_at);

-- Create partitions for each month
CREATE TABLE url_mappings_2024_01 PARTITION OF url_mappings
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE url_mappings_2024_02 PARTITION OF url_mappings
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- ... more partitions


-- Approach 4: With Expiration
-- Auto-expire URLs after N days

CREATE TABLE url_mappings (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    user_id INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for expiration cleanup job
CREATE INDEX idx_expires_at ON url_mappings(expires_at) WHERE is_active = TRUE;

-- Cleanup query (run periodically):
-- UPDATE url_mappings SET is_active = FALSE WHERE expires_at < NOW() AND is_active = TRUE;
*/


/*
============================================================================
Performance Considerations
============================================================================

1. PRIMARY KEY on short_code:
   - B-tree index for O(log n) lookups
   - For 1M URLs: ~20 disk seeks worst case
   - With caching: most lookups in memory

2. Storage Calculation:
   - Average row: 10 bytes (short_code) + 100 bytes (long_url) + 8 bytes (timestamp) + 4 bytes (user_id) = ~130 bytes
   - 1M URLs: 130MB
   - 10M URLs: 1.3GB
   - 100M URLs: 13GB

3. Index Size:
   - B-tree index on VARCHAR(10): ~20 bytes per row
   - 1M URLs: 20MB index
   - Fits in memory on even small instances!

4. Read Performance:
   - With index: O(log n) = ~20 seeks for 1M rows
   - With caching (Redis): O(1) = 1 lookup
   - Strategy: Cache hot URLs, DB for cold URLs

5. Write Performance:
   - Insert: O(log n) for index maintenance
   - ~1000 inserts/sec on db.t3.medium
   - ~10,000 inserts/sec on db.m5.large
   - For 10% write rate at 1000 RPS → 100 writes/sec ✓

============================================================================
Interview Talking Points
============================================================================

Q: "Why VARCHAR(10) for short_code?"
A: "62^7 = 3.5 trillion URLs with 7 chars. VARCHAR(10) leaves room for growth. Fixed length for consistent performance."

Q: "Why TEXT for long_url?"
A: "URLs can be arbitrarily long (e.g., with query params). TEXT handles up to 1GB, but typically store < 200 chars."

Q: "Do you need a separate id column?"
A: "No. short_code is the natural primary key. Adding id would waste space and slow down lookups."

Q: "How do you handle deleted URLs?"
A: "Soft delete: add is_active BOOLEAN. Don't reuse short_codes (UX issue if users bookmarked)."

Q: "What about sharding?"
A: "Shard by short_code hash. E.g., 4 shards: short_code % 4. Consistent hashing for elasticity."

============================================================================
*/
