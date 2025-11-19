import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter2DataModelsLesson: SystemDesignLesson = {
  id: 'ddia-ch2-data-models',
  slug: 'ddia-ch2-data-models',
  title: 'Data Models & Query Languages (DDIA Ch. 2)',
  description: 'Understand relational, document, and graph data models and when to use each.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  stages: [
    {
      id: 'intro-data-models',
      type: 'concept',
      title: 'Introduction to Data Models',
      content: (
        <Section>
          <H1>Introduction to Data Models</H1>
          <P>
            Data models define how data is structured and how relationships between data are represented.
            Different data models are optimized for different use cases. The three main categories are:
          </P>
          <UL>
            <LI><Strong>Relational Model:</Strong> Tables with rows and columns, normalized for consistency</LI>
            <LI><Strong>Document Model:</Strong> Tree-like structures (JSON), denormalized for flexibility</LI>
            <LI><Strong>Graph Model:</Strong> Nodes and edges, optimized for relationships</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'relational-model',
      type: 'concept',
      title: 'Relational Model - Normalization & SQL',
      content: (
        <Section>
          <H1>Relational Model - Normalization & SQL</H1>
          <P>
            The relational model organizes data into <Strong>tables</Strong> (relations) with rows (tuples) and columns (attributes).
            Data is <Strong>normalized</Strong> to eliminate redundancy and ensure consistency.
          </P>

          <H2>Normalization (1NF, 2NF, 3NF)</H2>
          <UL>
            <LI><Strong>1NF (First Normal Form):</Strong> Each column contains atomic values, no repeating groups</LI>
            <LI><Strong>2NF (Second Normal Form):</Strong> 1NF + no partial dependencies (all non-key attributes depend on full primary key)</LI>
            <LI><Strong>3NF (Third Normal Form):</Strong> 2NF + no transitive dependencies (no attributes depend on non-key attributes)</LI>
          </UL>

          <Example title="Blog Platform Schema">
            <CodeBlock>
{`-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE
);

-- Posts table
CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT,
  user_id INT,
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`}
            </CodeBlock>
          </Example>

          <H2>SQL Optimization</H2>
          <UL>
            <LI><Strong>Indexes:</Strong> B-tree indexes on foreign keys and frequently queried columns</LI>
            <LI><Strong>Query Planning:</Strong> EXPLAIN ANALYZE to understand query execution</LI>
            <LI><Strong>Join Strategies:</Strong> Nested loop, hash join, merge join</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Data has clear structure, relationships are important, ACID transactions needed,
            complex queries with joins required.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'document-model',
      type: 'concept',
      title: 'Document Model - JSON & Schema-on-Read',
      content: (
        <Section>
          <H1>Document Model - JSON & Schema-on-Read</H1>
          <P>
            Document databases (MongoDB, CouchDB) store data as <Strong>documents</Strong> (typically JSON),
            which are self-contained and can have nested structures.
          </P>

          <H2>Embedded vs. Referenced</H2>
          <UL>
            <LI><Strong>Embedded:</Strong> Store related data within the same document (fast reads, but duplication)</LI>
            <LI><Strong>Referenced:</Strong> Store IDs and join in application (normalized, but requires multiple queries)</LI>
          </UL>

          <Example title="Blog Post as Document">
            <CodeBlock>
{`{
  "_id": "post123",
  "user_id": "user456",
  "title": "My Blog Post",
  "content": "...",
  "comments": [
    { "user_id": "user789", "content": "Great post!", "created_at": "2024-01-01" }
  ],
  "tags": ["tech", "programming"]
}`}
            </CodeBlock>
          </Example>

          <H2>Schema-on-Read vs. Schema-on-Write</H2>
          <UL>
            <LI><Strong>Schema-on-Write (SQL):</Strong> Schema enforced at write time, must migrate to change</LI>
            <LI><Strong>Schema-on-Read (NoSQL):</Strong> Schema enforced at read time, flexible structure</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Data has variable structure, hierarchical relationships, 
            read-heavy workloads, rapid iteration needed.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'graph-model',
      type: 'concept',
      title: 'Graph Model - Nodes & Edges',
      content: (
        <Section>
          <H1>Graph Model - Nodes & Edges</H1>
          <P>
            Graph databases (Neo4j, Amazon Neptune) represent data as <Strong>nodes</Strong> (entities) and
            <Strong>edges</Strong> (relationships). Optimized for traversing relationships.
          </P>

          <H2>Property Graphs</H2>
          <UL>
            <LI><Strong>Nodes:</Strong> Entities with properties (e.g., User, Post, Comment)</LI>
            <LI><Strong>Edges:</Strong> Relationships with properties (e.g., FOLLOWS, LIKES, CREATED)</LI>
          </UL>

          <Example title="Social Network Graph">
            <CodeBlock>
{`// Nodes
(:User {id: "alice", name: "Alice"})
(:User {id: "bob", name: "Bob"})
(:Post {id: "post1", title: "Hello"})

// Edges
(alice)-[:FOLLOWS {since: "2024-01-01"}]->(bob)
(alice)-[:LIKES {timestamp: "2024-01-02"}]->(post1)

// Cypher Query: Find users Alice follows
MATCH (alice:User {id: "alice"})-[:FOLLOWS]->(followed:User)
RETURN followed.name`}
            </CodeBlock>
          </Example>

          <H2>Graph Traversal</H2>
          <UL>
            <LI><Strong>Depth-First:</Strong> Follow one path as deep as possible</LI>
            <LI><Strong>Breadth-First:</Strong> Explore all neighbors before going deeper</LI>
            <LI><Strong>Shortest Path:</Strong> Find minimum hops between nodes</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Many relationships, need to traverse connections (social networks, 
            recommendation engines, fraud detection), complex relationship queries.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'choosing-model',
      type: 'concept',
      title: 'Choosing the Right Data Model',
      content: (
        <Section>
          <H1>Choosing the Right Data Model</H1>
          <ComparisonTable
            headers={['Model', 'Best For', 'Trade-offs']}
            rows={[
              ['Relational (SQL)', 'Structured data, complex queries, ACID transactions', 'Less flexible, requires schema migrations'],
              ['Document (NoSQL)', 'Variable structure, hierarchical data, rapid iteration', 'No joins, eventual consistency'],
              ['Graph', 'Many relationships, relationship traversal', 'Not optimized for simple queries, higher complexity'],
            ]}
          />
          <Divider />
          <H2>Hybrid Approaches</H2>
          <P>
            Many systems use multiple data models:
          </P>
          <UL>
            <LI><Strong>Primary Store:</Strong> Relational DB for core data</LI>
            <LI><Strong>Cache:</Strong> Document store (Redis) for fast lookups</LI>
            <LI><Strong>Search:</Strong> Full-text search index (Elasticsearch)</LI>
            <LI><Strong>Analytics:</Strong> Columnar store (data warehouse) for OLAP</LI>
          </UL>
        </Section>
      ),
    },
  ],
};

