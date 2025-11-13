/*
Basic Full-Text Search - Database Schema
=========================================

Data Model Definition:
  Entity: document
  Fields: id, title, content, author, created_at, word_count

Access Patterns:
  1. Write (document indexing): Low frequency (~10% of traffic)
  2. Read by query (keyword searches): Very high frequency (~90% of traffic)

Your Task:
  Define the database schema to support document storage and search.
  The inverted index is typically stored in Elasticsearch, but you still
  need a database for:
    - Original document storage
    - Metadata (author, timestamps)
    - Analytics (search metrics)

Requirements:
  - Store original documents
  - Support fast metadata lookups
  - Handle 1M+ documents
  - Handle 1000+ searches per second

Questions to Consider:
  1. What should be the PRIMARY KEY?
  2. Do you need full-text search indexes?
  3. Do you need indexes on author or created_at?
  4. How to handle large content fields?
*/

-- TODO: Define your schema here!
-- This is a starter schema - optimize it based on access patterns

CREATE TABLE documents (
    id SERIAL,                   -- TODO: Should this be PRIMARY KEY?
    title VARCHAR(500),          -- TODO: Add index for searches?
    content TEXT,                -- TODO: How to handle large content?
    author VARCHAR(255),         -- TODO: Index for author queries?
    created_at TIMESTAMP,        -- TODO: Index for date filtering?
    word_count INT               -- TODO: Useful for ranking?
);

-- TODO: Add indexes for your access patterns
-- Hint: Full-text search on title/content, range queries on created_at


/*
============================================================================
Example Optimized Schemas (Uncomment to try)
============================================================================

-- Approach 1: Basic Optimized Schema
-- Primary key on id, full-text search indexes

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    word_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search index on title and content
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('english', title || ' ' || content));

-- Index on author for filtering by author
CREATE INDEX idx_documents_author ON documents(author);

-- Index on created_at for date range queries
CREATE INDEX idx_documents_created ON documents(created_at DESC);

-- Index on word_count for filtering long/short docs
CREATE INDEX idx_documents_word_count ON documents(word_count);


-- Approach 2: With Elasticsearch Integration
-- Minimal PostgreSQL schema, Elasticsearch handles search

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    elasticsearch_id VARCHAR(255),  -- Link to Elasticsearch document
    is_indexed BOOLEAN DEFAULT FALSE,
    indexed_at TIMESTAMP
);

-- Index for finding non-indexed documents
CREATE INDEX idx_documents_not_indexed ON documents(is_indexed, created_at) WHERE is_indexed = FALSE;


-- Approach 3: With Analytics
-- Track search queries and popularity

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    word_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    last_viewed_at TIMESTAMP
);

CREATE TABLE search_queries (
    id SERIAL PRIMARY KEY,
    query_text VARCHAR(500) NOT NULL,
    result_count INT,
    clicked_doc_id INT REFERENCES documents(id),
    searched_at TIMESTAMP DEFAULT NOW(),
    latency_ms INT
);

-- Index on documents for popularity ranking
CREATE INDEX idx_documents_popular ON documents(view_count DESC, created_at DESC);

-- Index on queries for analytics
CREATE INDEX idx_queries_text ON search_queries(query_text);
CREATE INDEX idx_queries_timestamp ON search_queries(searched_at DESC);


-- Approach 4: Partitioned for Scale
-- Partition by created_at for time-based queries

CREATE TABLE documents (
    id SERIAL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    word_count INT DEFAULT 0,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for each month
CREATE TABLE documents_2024_01 PARTITION OF documents
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE documents_2024_02 PARTITION OF documents
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- ... more partitions

-- Full-text search index per partition
CREATE INDEX idx_documents_2024_01_search ON documents_2024_01
    USING gin(to_tsvector('english', title || ' ' || content));
*/


/*
============================================================================
PostgreSQL Full-Text Search (Alternative to Elasticsearch)
============================================================================

PostgreSQL has built-in full-text search capabilities:

1. to_tsvector('english', text)
   - Converts text to search vector
   - Removes stopwords
   - Stems words

2. to_tsquery('english', query)
   - Converts query to search query
   - Supports AND, OR, NOT operators

3. GIN Index
   - Fast full-text search
   - Inverted index structure

Example queries:

-- Index document
INSERT INTO documents (title, content, author) VALUES
    ('Python Tutorial', 'Learn Python programming basics', 'John Doe');

-- Search for documents
SELECT id, title, ts_rank(to_tsvector('english', title || ' ' || content), to_tsquery('english', 'python & programming')) as rank
FROM documents
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'python & programming')
ORDER BY rank DESC
LIMIT 10;

-- Search with OR operator
SELECT * FROM documents
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'python | java')
ORDER BY created_at DESC;
*/


/*
============================================================================
Performance Considerations
============================================================================

1. Storage Calculation:
   - Average document: 500 bytes (title) + 5KB (content) + 255 bytes (author) = ~6KB
   - 1M documents: 6GB
   - With indexes: ~12GB total
   - Fits in memory on medium instances

2. Full-Text Search Index:
   - GIN index: O(log n) lookup
   - For 1M documents: ~20 disk seeks worst case
   - With index in memory: ~1-5ms per query

3. Elasticsearch vs PostgreSQL:
   - Elasticsearch: Better for complex search (facets, aggregations)
   - PostgreSQL: Simpler for basic keyword search
   - Hybrid: Store in PostgreSQL, index in Elasticsearch

4. Read Performance:
   - With GIN index: 1000 QPS per instance
   - With 10 instances: 10,000 QPS
   - With caching: 50,000+ QPS

5. Write Performance:
   - Insert + index update: ~50ms per document
   - ~20 documents/sec per instance
   - For 100 docs/sec: 5 instances needed

============================================================================
Interview Talking Points
============================================================================

Q: "Why separate table for search_queries?"
A: "Analytics and debugging. Track popular queries, failed searches, and optimize autocomplete suggestions."

Q: "Why store content in PostgreSQL if Elasticsearch handles search?"
A: "Source of truth. Elasticsearch can be rebuilt from PostgreSQL if corrupted. Also for backups and compliance."

Q: "Do you need separate database for read-heavy workloads?"
A: "Yes! Use read replicas. 90% of traffic is searches (reads), only 10% is indexing (writes). Separate concerns."

Q: "How do you handle large documents (> 1MB)?"
A: "Store large content in S3, keep metadata in PostgreSQL, index in Elasticsearch. Link via s3_url field."

Q: "What about sharding?"
A: "Shard by document ID hash or time range. Elasticsearch auto-shards. For PostgreSQL, manual partitioning by created_at works well."

============================================================================
*/
