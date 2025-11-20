import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpDatabaseLesson: SystemDesignLesson = {
  id: 'sdp-database',
  slug: 'sdp-database',
  title: 'Database Design Patterns',
  description: 'Master database fundamentals and critical trade-offs: WHEN to use SQL vs NoSQL (data model + scale thresholds), HOW to balance normalization vs denormalization, WHICH scaling strategy fits your read/write patterns.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,
  stages: [
    {
      id: 'intro-database',
      type: 'concept',
      title: 'Database Design Patterns',
      content: (
        <Section>
          <H1>Database Design Patterns</H1>
          <P>
            Database design involves trade-offs between normalization, performance, and consistency.
          </P>

          <H2>Denormalization</H2>
          <P>
            <Strong>Denormalization</Strong> adds redundant data to improve read performance at the cost of
            write complexity and storage.
          </P>

          <Example title="Normalized vs Denormalized">
            <CodeBlock>
{`// Normalized (3NF)
users: {id, name, email}
orders: {id, user_id, total}
order_items: {order_id, product_id, quantity, price}

// Query: Get user's orders with items
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
WHERE u.id = 123
// Requires 3 joins → slow

// Denormalized
orders: {
  id, user_id, user_name, user_email,  // Redundant user data
  total, items_json  // Redundant items
}

// Query: Get user's orders
SELECT * FROM orders WHERE user_id = 123
// No joins → fast!`}
            </CodeBlock>
          </Example>

          <H2>SQL Optimization</H2>
          <UL>
            <LI><Strong>Indexes:</Strong> Create indexes on frequently queried columns</LI>
            <LI><Strong>Query Analysis:</Strong> Use EXPLAIN to understand query execution</LI>
            <LI><Strong>Avoid N+1 Queries:</Strong> Use JOINs instead of multiple queries</LI>
            <LI><Strong>Limit Results:</Strong> Use LIMIT to avoid fetching too much data</LI>
          </UL>

          <H2>NoSQL Data Models</H2>
          <UL>
            <LI><Strong>Key-Value Store:</Strong> Redis, DynamoDB - Simple key-value pairs</LI>
            <LI><Strong>Document Store:</Strong> MongoDB - JSON documents</LI>
            <LI><Strong>Wide-Column Store:</Strong> Cassandra - Column families</LI>
            <LI><Strong>Graph Database:</Strong> Neo4j - Nodes and edges</LI>
          </UL>

          <KeyPoint>
            <Strong>Trade-off:</Strong> Normalization ensures consistency but may be slow. Denormalization
            improves reads but requires careful write logic to maintain consistency.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

