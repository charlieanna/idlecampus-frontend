import type { SystemDesignLesson } from '../../../types/lesson';
import { SystemGraph } from '../../../types/graph';
import {
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section,
  KeyPoint, Example, Divider, InfoBox, ComparisonTable
} from '../../../ui/components/LessonContent';

export const componentsLesson: SystemDesignLesson = {
  id: 'sd-components',
  slug: 'basic-components',
  title: 'Basic Components',
  description: 'Master component trade-offs: WHEN to scale horizontally vs vertically, WHICH load balancing algorithm to use, WHETHER to add cache vs database replicas',
  difficulty: 'beginner',
  estimatedMinutes: 60, // Increased due to trade-off content
  category: 'fundamentals',
  tags: ['components', 'architecture', 'basics'],
  prerequisites: ['what-is-system-design'],

  // Progressive flow metadata
  moduleId: 'sd-module-1-fundamentals',
  sequenceOrder: 2,

  // NEW: Connect to challenges
  relatedChallenges: ['tiny_url', 'food-blog', 'e-commerce'],

  // NEW: Next lessons
  nextLessons: ['capacity-planning', 'caching-fundamentals'],

  learningObjectives: [
    'Understand each component type and its purpose',
    'Learn when to use each component',
    'Understand how components connect',
    'Practice placing components on canvas',
  ],
  conceptsCovered: [
    {
      id: 'client',
      name: 'Client',
      type: 'component',
      difficulty: 1,
      description: 'User-facing device that makes requests',
    },
    {
      id: 'app-server',
      name: 'App Server',
      type: 'component',
      difficulty: 2,
      description: 'Processes business logic and handles requests',
    },
    {
      id: 'database',
      name: 'Database',
      type: 'component',
      difficulty: 2,
      description: 'Stores persistent data',
    },
    {
      id: 'cache',
      name: 'Cache',
      type: 'component',
      difficulty: 2,
      description: 'Fast storage for frequently accessed data',
    },
    {
      id: 'load-balancer',
      name: 'Load Balancer',
      type: 'component',
      difficulty: 2,
      description: 'Distributes traffic across multiple servers',
    },
  ],
  practiceComponents: [
    { type: 'client', required: true },
    { type: 'app_server', required: true },
    { type: 'database', required: true },
  ],
  stages: [
    {
      id: 'components-overview',
      type: 'concept',
      title: 'Component Overview',
      description: 'Introduction to system components',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Basic Components</H1>

          <P>Every system is built from a set of <Strong>components</Strong>. Each component has a specific role:</P>

          <H2>Core Components</H2>

          <H3>1. Client</H3>
          <UL>
            <LI><Strong>What:</Strong> User's device (browser, mobile app)</LI>
            <LI><Strong>Role:</Strong> Makes requests, displays responses</LI>
            <LI><Strong>Example:</Strong> Your web browser requesting a webpage</LI>
          </UL>

          <H3>2. App Server</H3>
          <UL>
            <LI><Strong>What:</Strong> Machine that runs your application code</LI>
            <LI><Strong>Role:</Strong> Processes business logic, handles requests</LI>
            <LI><Strong>Example:</Strong> Server running Python/Java/Node.js code</LI>
          </UL>

          <H3>3. Database</H3>
          <UL>
            <LI><Strong>What:</Strong> Persistent storage for data</LI>
            <LI><Strong>Role:</Strong> Stores and retrieves data reliably</LI>
            <LI><Strong>Example:</Strong> PostgreSQL, MySQL, MongoDB</LI>
          </UL>

          <H3>4. Cache</H3>
          <UL>
            <LI><Strong>What:</Strong> Fast, temporary storage</LI>
            <LI><Strong>Role:</Strong> Speeds up repeated requests</LI>
            <LI><Strong>Example:</Strong> Redis, Memcached</LI>
          </UL>

          <H3>5. Load Balancer</H3>
          <UL>
            <LI><Strong>What:</Strong> Distributes traffic across servers</LI>
            <LI><Strong>Role:</Strong> Prevents any single server from being overwhelmed</LI>
            <LI><Strong>Example:</Strong> AWS ELB, NGINX</LI>
          </UL>

          <H2>Component Relationships</H2>

          <P>Components <Strong>connect</Strong> to each other:</P>

          <UL>
            <LI><Strong>Client → App Server:</Strong> User makes request</LI>
            <LI><Strong>App Server → Database:</Strong> Fetch/store data</LI>
            <LI><Strong>App Server → Cache:</Strong> Check for cached data</LI>
            <LI><Strong>Load Balancer → App Servers:</Strong> Distribute requests</LI>
          </UL>

          <H2>Visual: Basic 3-Tier Architecture</H2>

          <CodeBlock>
{`┌─────────┐      ┌────────────┐      ┌──────────┐
│ Client  │─────►│ App Server │─────►│ Database │
└─────────┘      └────────────┘      └──────────┘
   (User)         (Your code)        (Data storage)

Request flow: Client sends request → App processes it → DB returns data`}
          </CodeBlock>

          <KeyPoint>
            In the next stages, you'll learn about each component in detail and practice adding them!
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'Components are building blocks of systems',
        'Each component has a specific purpose',
        'Components connect to form a complete system',
      ],
    },
    {
      id: 'components-client',
      type: 'concept',
      title: 'Client Component',
      description: 'Understanding the client',
      estimatedMinutes: 3,
      content: (
        <Section>
          <H1>Client Component</H1>

          <P>The <Strong>client</Strong> is where users interact with your system.</P>

          <H2>What is a Client?</H2>

          <UL>
            <LI>Web browser (Chrome, Firefox, Safari)</LI>
            <LI>Mobile app (iOS, Android)</LI>
            <LI>Desktop application</LI>
            <LI>API client (another service calling your API)</LI>
          </UL>

          <H2>Client Responsibilities</H2>

          <OL>
            <LI><Strong>Send requests</Strong> to servers</LI>
            <LI><Strong>Display responses</Strong> to users</LI>
            <LI><Strong>Handle user input</Strong> (clicks, forms, etc.)</LI>
            <LI><Strong>Cache static assets</Strong> (images, CSS, JS)</LI>
          </OL>

          <H2>Client Limitations</H2>

          <UL>
            <LI><Strong>No persistent storage</Strong> (usually)</LI>
            <LI><Strong>Limited processing power</Strong> (compared to servers)</LI>
            <LI><Strong>Network dependent</Strong> (needs internet connection)</LI>
          </UL>

          <H2>In System Design</H2>

          <P>When designing systems, you typically:</P>

          <UL>
            <LI><Strong>Don't control</Strong> the client (users use their own devices)</LI>
            <LI><Strong>Optimize</Strong> for client experience (fast responses, mobile-friendly)</LI>
            <LI><Strong>Assume</Strong> clients can be unreliable (slow networks, crashes)</LI>
          </UL>

          <KeyPoint>
            The client is the <Strong>entry point</Strong> to your system!
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'Client is the user-facing part of the system',
        'You typically don\'t control client devices',
        'Design for various client types and network conditions',
      ],
    },
    {
      id: 'components-app-server',
      type: 'concept',
      title: 'App Server Component',
      description: 'Understanding app servers',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>App Server Component</H1>

          <P>The <Strong>app server</Strong> is the heart of your application - it runs your business logic.</P>

          <H2>What is an App Server?</H2>

          <P>A server that:</P>

          <UL>
            <LI>Runs your application code (Python, Java, Node.js, etc.)</LI>
            <LI>Processes HTTP requests</LI>
            <LI>Implements business logic</LI>
            <LI>Connects to databases, caches, and other services</LI>
          </UL>

          <H2>App Server Responsibilities</H2>

          <OL>
            <LI><Strong>Handle requests</Strong> from clients</LI>
            <LI><Strong>Process business logic</Strong> (validate, transform, compute)</LI>
            <LI><Strong>Query databases</Strong> for data</LI>
            <LI><Strong>Call external APIs</Strong> if needed</LI>
            <LI><Strong>Return responses</Strong> to clients</LI>
          </OL>

          <H2>Example: Blog Post Request</H2>

          <Example title="App Server Processing">
            <CodeBlock>
{`// Client requests: GET /posts/123

// App server code (Node.js):
app.get('/posts/:id', async (req, res) => {
  // 1. Validate input
  const postId = parseInt(req.params.id);
  if (!postId) return res.status(400).send('Invalid ID');

  // 2. Query database
  const post = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
  if (!post) return res.status(404).send('Not found');

  // 3. Apply business logic
  const viewCount = post.views + 1;
  await db.query('UPDATE posts SET views = ? WHERE id = ?', [viewCount, postId]);

  // 4. Return response
  res.json({ ...post, views: viewCount });
});`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Scaling App Servers</H2>

          <UL>
            <LI><Strong>Vertical scaling:</Strong> Use a bigger server (more CPU, RAM)</LI>
            <LI><Strong>Horizontal scaling:</Strong> Add more servers (instances) ← Preferred!</LI>
            <LI><Strong>Load balancing:</Strong> Distribute requests across multiple servers</LI>
          </UL>

          <H2>Stateless vs Stateful</H2>

          <ComparisonTable
            headers={['Type', 'Definition', 'Pros', 'Cons', 'Example']}
            rows={[
              [
                'Stateless',
                'No session data stored\non server',
                'Easy to scale\nAny server can handle\nany request',
                'Must re-fetch\nuser data',
                'RESTful APIs'
              ],
              [
                'Stateful',
                'Server remembers\nsession data',
                'Faster (data cached\nin memory)',
                'Hard to scale\nSticky sessions needed',
                'WebSocket servers'
              ]
            ]}
          />

          <InfoBox type="tip">
            <P>
              <Strong>Best practice:</Strong> Design stateless app servers.
              Store session data in Redis/database, not in server memory.
            </P>
          </InfoBox>

          <H2>In System Design</H2>

          <P>You'll configure:</P>

          <UL>
            <LI><Strong>Number of instances:</Strong> How many servers?</LI>
            <LI><Strong>Instance type:</Strong> How powerful? (fixed to commodity hardware in this platform)</LI>
            <LI><Strong>Load balancing strategy:</Strong> How to distribute traffic?</LI>
          </UL>
        </Section>
      ),
      keyPoints: [
        'App servers run your business logic',
        'Stateless servers are easier to scale',
        'Horizontal scaling (more instances) is preferred',
      ],
    },

    // NEW: Focused Mini-Exercise 1 - When to scale app servers
    {
      id: 'practice-scaling-servers',
      type: 'canvas-practice',
      title: 'Mini-Exercise: When to Scale App Servers',
      description: 'Given a simple system, identify when you need to add more app servers',
      estimatedMinutes: 5,
      scenario: {
        description: 'You have a blog with 1 app server handling 1,500 RPS. Each server can handle 1,400 RPS effectively (accounting for overhead). Traffic is spiking to 5,000 RPS.',
        requirements: [
          'Handle 5,000 RPS without errors',
          'Add the minimum number of servers needed',
          'Understand when horizontal scaling is required'
        ]
      },
      hints: [
        'Current capacity: 1 server × 1,400 RPS = 1,400 RPS',
        'Needed capacity: 5,000 RPS',
        'Servers needed: 5,000 / 1,400 = 3.57 → 4 servers (round up!)',
        'Since you already have 1, add 3 more servers'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 300, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 500, y: 200 },
            config: { instances: 4 }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Why 4 servers?**

1. **Current situation:** 1 server handling 1,500 RPS (overloaded! Max is 1,400 RPS)
2. **New traffic:** 5,000 RPS
3. **Calculation:** 5,000 ÷ 1,400 = 3.57 → **4 servers** (always round up!)
4. **Load balancer:** Distributes 5,000 RPS across 4 servers (1,250 RPS each) ✓

**Key lesson:** When traffic exceeds single server capacity, scale horizontally!

**Rule of thumb:** Scale when reaching 70-80% of server capacity, not 100%.
      `
    },

    {
      id: 'components-database',
      type: 'concept',
      title: 'Database Component',
      description: 'Understanding databases',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Database Component</H1>

          <P>The <Strong>database</Strong> stores your persistent data reliably.</P>

          <H2>What is a Database?</H2>

          <P>A system that:</P>

          <UL>
            <LI>Stores data permanently (survives server restarts)</LI>
            <LI>Provides structured access to data</LI>
            <LI>Ensures data integrity and consistency</LI>
            <LI>Supports queries and transactions</LI>
          </UL>

          <H2>Types of Databases</H2>

          <H3>SQL (Relational)</H3>
          <UL>
            <LI><Strong>Examples:</Strong> PostgreSQL, MySQL</LI>
            <LI><Strong>Structure:</Strong> Tables with rows and columns</LI>
            <LI><Strong>Use when:</Strong> Need ACID transactions, complex queries, relationships</LI>
          </UL>

          <Example title="SQL Table Structure">
            <CodeBlock>
{`Table: users
+----+----------+-------------------+
| id | name     | email             |
+----+----------+-------------------+
| 1  | Alice    | alice@example.com |
| 2  | Bob      | bob@example.com   |
+----+----------+-------------------+

Query: SELECT * FROM users WHERE id = 1
Result: { id: 1, name: 'Alice', email: 'alice@example.com' }`}
            </CodeBlock>
          </Example>

          <H3>NoSQL</H3>
          <UL>
            <LI><Strong>Examples:</Strong> MongoDB, DynamoDB, Cassandra</LI>
            <LI><Strong>Structure:</Strong> Documents, key-value, wide-column</LI>
            <LI><Strong>Use when:</Strong> Need horizontal scaling, flexible schema</LI>
          </UL>

          <Example title="NoSQL Document Structure">
            <CodeBlock>
{`Document (MongoDB):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Alice",
  "email": "alice@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "tags": ["premium", "beta-tester"]
}

Flexible schema - each document can have different fields!`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Database Responsibilities</H2>

          <OL>
            <LI><Strong>Store data</Strong> permanently</LI>
            <LI><Strong>Retrieve data</Strong> quickly (with indexes)</LI>
            <LI><Strong>Ensure consistency</Strong> (ACID properties)</LI>
            <LI><Strong>Handle concurrent access</Strong> (locks, transactions)</LI>
          </OL>

          <H2>Scaling Databases</H2>

          <UL>
            <LI><Strong>Replication:</Strong> Copy data to multiple servers (read replicas)</LI>
            <LI><Strong>Sharding:</Strong> Split data across multiple databases</LI>
            <LI><Strong>Caching:</Strong> Use cache to reduce database load</LI>
          </UL>

          <CodeBlock>
{`Database Scaling Strategies:
============================

Replication (Read Replicas):
┌─────────┐  writes  ┌──────────┐
│ App Srv │─────────►│ Primary  │
└─────────┘          │ Database │
     │               └────┬─────┘
     │ reads             │ replicates
     ▼                   ▼
┌──────────┐        ┌──────────┐
│ Replica1 │        │ Replica2 │
└──────────┘        └──────────┘

Good for: Read-heavy workloads (90%+ reads)`}
          </CodeBlock>

          <H2>In System Design</H2>

          <P>You'll configure:</P>

          <UL>
            <LI><Strong>Replication mode:</Strong> Single-leader, multi-leader, or leaderless</LI>
            <LI><Strong>Number of replicas:</Strong> For read capacity</LI>
            <LI><Strong>Sharding:</Strong> For write capacity and data distribution</LI>
          </UL>
        </Section>
      ),
      keyPoints: [
        'Databases provide persistent storage',
        'SQL vs NoSQL depends on requirements',
        'Replication and sharding help scale databases',
      ],
    },
    {
      id: 'components-cache',
      type: 'concept',
      title: 'Cache Component',
      description: 'Understanding caching',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Cache Component</H1>

          <P>The <Strong>cache</Strong> stores frequently accessed data in fast memory.</P>

          <H2>What is a Cache?</H2>

          <P>A fast, temporary storage that:</P>

          <UL>
            <LI>Stores data in memory (much faster than disk)</LI>
            <LI>Has limited capacity (smaller than database)</LI>
            <LI>Can expire data (TTL - Time To Live)</LI>
            <LI>Reduces load on database</LI>
          </UL>

          <H2>Why Use a Cache?</H2>

          <ComparisonTable
            headers={['Operation', 'Without Cache', 'With Cache', 'Speedup']}
            rows={[
              ['Read product', '20ms (DB query)', '2ms (Redis)', '10x faster'],
              ['Read user profile', '15ms (DB query)', '1ms (memory)', '15x faster'],
              ['Read homepage', '50ms (multiple queries)', '3ms (cached HTML)', '17x faster']
            ]}
          />

          <UL>
            <LI><Strong>Speed:</Strong> Memory access is 100-1000x faster than disk</LI>
            <LI><Strong>Reduce database load:</Strong> 80-90% of requests can be served from cache</LI>
            <LI><Strong>Cost:</Strong> Fewer database queries = lower costs</LI>
          </UL>

          <H2>Cache Patterns</H2>

          <H3>Cache-Aside (Lazy Loading) - Most Common</H3>
          <CodeBlock>
{`Read flow:
1. App checks cache for data
2. If cache hit → return data (fast! 2ms)
3. If cache miss → query database (slow, 20ms)
4. Store result in cache for next time
5. Return to client

Example:
GET /product/123
→ Check Redis: cache.get('product:123')
→ Miss! Query DB: db.query('SELECT * FROM products WHERE id = 123')
→ Cache it: cache.set('product:123', productData, TTL=300)
→ Return productData`}
          </CodeBlock>

          <H3>Write-Through</H3>
          <CodeBlock>
{`Write flow:
1. Write to cache AND database simultaneously
2. Ensures consistency
3. Slower writes, but reads always get latest data

Example:
POST /product/123 (update)
→ Write to cache: cache.set('product:123', newData)
→ Write to DB: db.update('products', 123, newData)
→ Both updated! ✓`}
          </CodeBlock>

          <Divider />

          <H2>Cache Considerations</H2>

          <UL>
            <LI><Strong>What to cache:</Strong> Frequently accessed, rarely changing data</LI>
            <LI><Strong>Cache size:</Strong> Balance between hit rate and memory cost</LI>
            <LI><Strong>Eviction policy:</Strong> What to remove when full (LRU = Least Recently Used)</LI>
            <LI><Strong>Invalidation:</Strong> When to remove stale data</LI>
          </UL>

          <InfoBox type="warning">
            <P>
              <Strong>Common mistake:</Strong> Forgetting to invalidate cache when data changes!
            </P>
            <P>Always invalidate cache on updates, otherwise users see stale data.</P>
          </InfoBox>

          <H2>In System Design</H2>

          <P>You'll configure:</P>

          <UL>
            <LI><Strong>Cache size:</Strong> How much memory?</LI>
            <LI><Strong>Strategy:</Strong> Cache-aside, write-through, etc.</LI>
            <LI><Strong>TTL:</Strong> How long data stays in cache</LI>
          </UL>
        </Section>
      ),
      keyPoints: [
        'Cache speeds up repeated requests',
        'Cache-aside is the most common pattern',
        'Cache reduces database load significantly',
      ],
    },

    // NEW: Focused Mini-Exercise 2 - When to add cache
    {
      id: 'practice-adding-cache',
      type: 'canvas-practice',
      title: 'Mini-Exercise: When to Add a Cache',
      description: 'Identify when caching provides the most benefit',
      estimatedMinutes: 5,
      scenario: {
        description: 'Your blog has 10,000 RPS reading the same popular posts repeatedly. Each database query takes 20ms. You want to reduce latency and database load.',
        requirements: [
          'Reduce read latency from 20ms to <5ms',
          'Reduce database load by 80%+',
          'Add cache in the correct position'
        ],
        constraints: [
          'Read-heavy workload (95% reads, 5% writes)',
          'Popular posts accessed repeatedly',
          'Database struggling with 10,000 queries/sec'
        ]
      },
      hints: [
        'Cache should sit between app server and database',
        'App server checks cache first, then database on miss',
        'With 80% cache hit rate, only 2,000 requests hit database (vs 10,000)',
        'Cache-aside pattern is perfect for read-heavy workloads'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 250, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: { instances: 3 }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 600, y: 150 },
            config: {
              instanceType: 'redis-small',
              ttl: 600
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 600, y: 250 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Why add a cache here?**

**Before (No cache):**
- 10,000 RPS → all hit database
- Each query: 20ms latency
- Database overloaded!

**After (With Redis cache):**
- 10,000 RPS → 80% cache hit (8,000 requests)
- Cache latency: 2ms ✓
- Only 2,000 requests hit database
- Database load reduced by 80%! ✓

**When to add cache:**
- ✓ Read-heavy workload (90%+ reads)
- ✓ Same data accessed repeatedly
- ✓ Database struggling with load
- ✓ Need to reduce latency

**This is exactly how Reddit, Twitter, Facebook use caching!**
      `
    },

    {
      id: 'components-load-balancer',
      type: 'concept',
      title: 'Load Balancer Component',
      description: 'Understanding load balancers',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Load Balancer Component</H1>

          <P>The <Strong>load balancer</Strong> distributes traffic across multiple servers.</P>

          <H2>What is a Load Balancer?</H2>

          <P>A component that:</P>

          <UL>
            <LI>Receives incoming requests from clients</LI>
            <LI>Distributes requests across multiple app servers</LI>
            <LI>Monitors server health</LI>
            <LI>Routes traffic only to healthy servers</LI>
          </UL>

          <H2>Why Use a Load Balancer?</H2>

          <H3>1. Handle More Traffic</H3>
          <P>Single server maxes out at ~2,000 RPS. Load balancer lets you use 10+ servers for 20,000+ RPS.</P>

          <H3>2. High Availability</H3>
          <P>If one server crashes, load balancer routes traffic to remaining servers.</P>

          <H3>3. Zero-Downtime Deployments</H3>
          <P>Deploy to one server at a time while others keep serving traffic.</P>

          <H2>Load Balancing Algorithms</H2>

          <ComparisonTable
            headers={['Algorithm', 'How it Works', 'Best For', 'Example']}
            rows={[
              [
                'Round Robin',
                'Send requests to servers\nin order: 1,2,3,1,2,3...',
                'Servers with equal capacity',
                'Server1 → Server2 → Server3 → Server1...'
              ],
              [
                'Least Connections',
                'Send to server with\nfewest active connections',
                'Long-lived connections\n(WebSockets)',
                'Server1 (5 conn) gets next request\nvs Server2 (10 conn)'
              ],
              [
                'Random',
                'Pick random server\nfor each request',
                'Simple, works well\nfor stateless servers',
                'Random(1,2,3) → Server2'
              ]
            ]}
          />

          <Divider />

          <H2>Load Balancer Architecture</H2>

          <CodeBlock>
{`Without Load Balancer:
═══════════════════════
┌────────┐    ┌────────────┐    ┌──────────┐
│ Client │───►│ App Server │───►│ Database │
└────────┘    └────────────┘    └──────────┘
              Single server
              Max: ~2,000 RPS
              No redundancy ✗

With Load Balancer:
════════════════════
                    ┌────────────┐
                  ┌─│ App Srv #1 │
                  │ └────────────┘
┌────────┐  ┌────┴──┐  ┌────────────┐  ┌──────────┐
│ Client │─►│  LB   │─►│ App Srv #2 │─►│ Database │
└────────┘  └────┬──┘  └────────────┘  └──────────┘
                  │ ┌────────────┐
                  └─│ App Srv #3 │
                    └────────────┘
              3 servers
              Max: ~6,000 RPS
              Redundant ✓`}
          </CodeBlock>

          <H2>Health Checks</H2>

          <P>Load balancer continuously checks if servers are healthy:</P>

          <CodeBlock>
{`Every 10 seconds:
- LB sends: GET /health to each server
- Server responds: 200 OK (healthy) or timeout (unhealthy)
- If server unhealthy, LB stops sending traffic to it
- When server recovers, LB resumes sending traffic

Example:
Server1: 200 OK ✓ (receiving traffic)
Server2: 200 OK ✓ (receiving traffic)
Server3: Timeout ✗ (NOT receiving traffic)

Result: All traffic goes to Server1 and Server2`}
          </CodeBlock>

          <InfoBox type="tip">
            <P>
              <Strong>Best practice:</Strong> Always implement a /health endpoint
              that checks if your app can connect to database, cache, etc.
            </P>
          </InfoBox>

          <H2>In System Design</H2>

          <P>You'll configure:</P>

          <UL>
            <LI><Strong>Algorithm:</Strong> Round robin, least connections, etc.</LI>
            <LI><Strong>Health check interval:</Strong> How often to check servers</LI>
            <LI><Strong>Sticky sessions:</Strong> Send same user to same server (usually avoid)</LI>
          </UL>

          <Divider />

          <H2>🎯 Critical Decision: Which Load Balancing Algorithm?</H2>

          <ComparisonTable
            headers={['Scenario', 'Best Algorithm', 'Why?', 'Avoid']}
            rows={[
              [
                'All servers same specs\nShort HTTP requests\n(REST API)',
                'Round Robin',
                '• Simple, fair distribution\n• Works great when servers identical\n• Low overhead',
                '❌ Weighted (unnecessary complexity)\n❌ Least-conn (overkill for short requests)'
              ],
              [
                'Different server sizes\n(New servers 2x CPU)',
                'Weighted Round Robin',
                '• Send 2x traffic to 2x CPU servers\n• Efficient use of resources\n• Prevents overloading weak servers',
                '❌ Round robin (overloads weak servers)\n❌ Random (uneven distribution)'
              ],
              [
                'Long-lived connections\n(WebSockets, streaming)',
                'Least Connections',
                '• Tracks active connections per server\n• Prevents one server from getting all long requests\n• Balances actual load, not just request count',
                '❌ Round robin (Server1 gets 10 long connections, Server2 gets 0)'
              ],
              [
                'Variable request times\n(Some 10ms, some 1000ms)',
                'Least Connections',
                '• Servers finish slow requests go to "least connections"\n• Self-balancing based on actual load',
                '❌ Round robin (Server1 processing 10 slow requests while Server2 idle)'
              ]
            ]}
          />

          <Example title="Real-World Scenario: E-commerce Flash Sale">
            <P><Strong>Setup:</Strong> 5 app servers, 3 are new (4 CPU cores), 2 are old (2 CPU cores)</P>

            <P><Strong>❌ WRONG: Round-Robin (sends equal traffic to all servers)</Strong></P>
            <CodeBlock>
{`Round robin: Each server gets 20% traffic
- New servers (4 cores): 20% utilization → wasted capacity
- Old servers (2 cores): 80% utilization → overloaded, slow responses

Result: p99 latency = 500ms because old servers are bottleneck`}
            </CodeBlock>

            <P><Strong>✅ RIGHT: Weighted Round-Robin (weight by CPU)</Strong></P>
            <CodeBlock>
{`Weighted config:
- New servers (4 cores): weight = 2
- Old servers (2 cores): weight = 1

Traffic distribution:
- 3 new servers: 2+2+2 = 6 parts = 60% traffic
- 2 old servers: 1+1 = 2 parts = 20% traffic

Result: All servers at 60% utilization, p99 latency = 50ms`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Weighted is more complex to configure (must know server specs), but 10x better performance when servers differ.
            </KeyPoint>
          </Example>

          <Divider />

          <H2>🎯 Critical Decision: Horizontal vs Vertical Scaling</H2>

          <ComparisonTable
            headers={['Factor', 'Horizontal (Add Servers)', 'Vertical (Bigger Server)', 'Winner']}
            rows={[
              ['Max capacity', 'Unlimited (add more)', 'Limited (64 cores max)', 'Horizontal'],
              ['High availability', 'Yes (10 servers, 1 fails = 90% up)', 'No (1 server fails = 100% down)', 'Horizontal'],
              ['Cost (short-term)', '$1000/mo (10×$100)', '$800/mo (1×$800)', 'Vertical'],
              ['Cost (long-term)', 'Scales linearly', 'Gets expensive (16 cores = 4x cost)', 'Horizontal'],
              ['Complexity', 'High (load balancer, distributed state)', 'Low (single machine)', 'Vertical'],
              ['Latency', 'Slower (network hops)', 'Faster (local memory)', 'Vertical'],
              ['Deploy speed', 'Slow (add server, wait 5-10 min)', 'Medium (restart with more RAM)', 'Vertical'],
              ['Database friendly', 'Hard (sharding complex)', 'Easy (single DB, no sharding)', 'Vertical']
            ]}
          />

          <H3>Decision Tree:</H3>
          <CodeBlock>
{`
Can you fit on one big server (<10,000 RPS, <100GB RAM)?
├─ YES → Start with Vertical scaling (simpler)
│   └─ Scale up as you grow (2 cores → 4 cores → 8 cores)
│
└─ NO → Need Horizontal scaling
    │
    ├─ >10,000 RPS → Need multiple servers for capacity
    ├─ Need HA → Can't rely on single server
    └─ Outgrew biggest server → Must distribute load

**Best practice:** Start vertical, switch to horizontal when:
- Traffic >10,000 RPS (single server can't handle)
- Need 99.9%+ uptime (high availability required)
- Cost of big server >3x cost of smaller servers
`}
          </CodeBlock>

          <Example title="Scaling Timeline: Typical Startup">
            <P><Strong>Month 1-3: Vertical scaling</Strong></P>
            <UL>
              <LI>Start: 1 server, 2 cores, 4GB RAM → 500 RPS capacity</LI>
              <LI>Growth: Upgrade to 4 cores, 8GB RAM → 2,000 RPS</LI>
              <LI>Cost: $100/mo</LI>
              <LI>Complexity: Low (single server, easy to debug)</LI>
            </UL>

            <P><Strong>Month 4-6: Hit vertical limits</Strong></P>
            <UL>
              <LI>Traffic: 8,000 RPS (server at 80% CPU)</LI>
              <LI>Upgrade to 16 cores, 32GB RAM → $800/mo</LI>
              <LI>Problem: Still single point of failure!</LI>
            </UL>

            <P><Strong>Month 7+: Switch to horizontal</Strong></P>
            <UL>
              <LI>Add load balancer + 4 servers (4 cores each)</LI>
              <LI>Capacity: 4 × 2,000 RPS = 8,000 RPS total</LI>
              <LI>Cost: $400/mo for servers + $50/mo LB = $450/mo (cheaper!)</LI>
              <LI>Benefit: 1 server fails → 75% capacity remains (HA)</LI>
            </UL>

            <KeyPoint>
              <Strong>Trade-off made:</Strong> Accepted complexity (load balancer, distributed system) to gain high availability and lower cost.
            </KeyPoint>
          </Example>

          <Divider />

          <H2>🎯 Critical Decision: Add Cache or Database Replicas?</H2>

          <P>When your database is overloaded, you have two options. Which do you choose?</P>

          <ComparisonTable
            headers={['Solution', 'Use When', 'Avoid When', 'Cost', 'Benefit']}
            rows={[
              [
                'Add Cache\n(Redis)',
                '• Read-heavy (90%+ reads)\n• Same data read repeatedly\n• Staleness acceptable\n• Small dataset (<100GB)',
                '• Write-heavy workload\n• Strong consistency needed\n• Unique queries (no cache hits)',
                '$100-300/mo',
                '10-100x speedup\n20x fewer DB queries'
              ],
              [
                'Add Read Replicas\n(DB copies)',
                '• Need strong consistency\n• Complex SQL queries\n• Large dataset ({\'>\'}100GB)\n• Can\'t accept staleness',
                '• Write-heavy workload\n• Simple key-value lookups\n• Budget constrained',
                '$300-1000/mo per replica',
                '3-5x more read capacity\nStrong consistency'
              ]
            ]}
          />

          <H3>Decision Matrix:</H3>

          <ComparisonTable
            headers={['Scenario', 'Add Cache?', 'Add Replicas?', 'Why?']}
            rows={[
              [
                'Product catalog\n10k reads/sec\n10 writes/sec',
                '✅ YES (Redis)',
                '❌ NO',
                'Read-heavy (1000:1 ratio) → Cache hit rate will be 95%+, reduces DB load 20x for $100/mo'
              ],
              [
                'Analytics dashboard\nComplex SQL JOINs\n1-hour staleness OK',
                '✅ YES (Redis)',
                '❌ NO',
                'Pre-compute results, cache for 1 hour → Even complex queries served in <5ms'
              ],
              [
                'Bank transactions\nNeed real-time balance\nStrong consistency required',
                '❌ NO',
                '✅ YES (Replicas)',
                'Can\'t accept stale data for financial transactions → Need real-time reads from DB'
              ],
              [
                'Social media feed\nPersonalized per user\nEach query unique',
                '❌ NO',
                '✅ YES (Replicas)',
                'Every user has different feed → Low cache hit rate (<10%) → Replicas better'
              ]
            ]}
          />

          <Example title="Real Decision: E-commerce Site">
            <P><Strong>Problem:</Strong> Database at 90% CPU, 10,000 read queries/sec</P>

            <P><Strong>Analysis:</Strong></P>
            <UL>
              <LI>Traffic breakdown: 8,000 product views/sec, 2,000 unique queries/sec</LI>
              <LI>80% of reads are for top 20% products (classic 80/20 distribution)</LI>
              <LI>Product data changes 1x/hour (new arrivals, price updates)</LI>
            </UL>

            <P><Strong>Solution: Add Redis cache with 60s TTL</Strong></P>

            <CodeBlock>
{`Before (no cache):
- Database: 10,000 queries/sec
- Database CPU: 90% (near limit)
- p99 latency: 50ms

After (with Redis cache):
- Cache hit rate: 80% (for popular products)
- Cache serves: 8,000 queries/sec
- Database serves: 2,000 queries/sec
- Database CPU: 20% (comfortable!)
- p99 latency: 5ms (10x faster)

Cost: $150/mo for Redis vs $800/mo for 3 read replicas
Savings: $650/mo`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Accepted 60s staleness (price changes take 1 min to show) for 10x better performance and 5x cost savings.
            </KeyPoint>
          </Example>
        </Section>
      ),
      keyPoints: [
        'Load balancers distribute traffic across servers',
        'Enable horizontal scaling and high availability',
        'Health checks ensure traffic only goes to healthy servers',
      ],
    },

    // NEW: Focused Mini-Exercise 3 - Complete system with all components
    {
      id: 'practice-complete-system',
      type: 'canvas-practice',
      title: 'Practice: Build Complete 5-Component System',
      description: 'Put everything together: client, load balancer, app servers, cache, and database',
      estimatedMinutes: 7,
      scenario: {
        description: 'Build a scalable blog platform that handles 8,000 RPS with caching and multiple app servers for redundancy.',
        requirements: [
          'Handle 8,000 RPS read traffic',
          'Use load balancer to distribute across app servers',
          'Add cache to reduce database load',
          'Ensure high availability (redundant servers)'
        ],
        constraints: [
          'Each app server handles 1,400 RPS effective capacity',
          'Need at least 80% cache hit rate',
          'Must survive single server failure'
        ]
      },
      hints: [
        'Servers needed: 8,000 / 1,400 = 5.7 → 6 servers',
        'Add load balancer in front of app servers',
        'Cache goes between app servers and database',
        'Flow: Client → LB → App Servers → Cache/DB'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 300, y: 200 },
            config: {
              algorithm: 'round-robin'
            }
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 500, y: 200 },
            config: { instances: 6 }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 700, y: 150 },
            config: {
              instanceType: 'redis-medium',
              ttl: 300
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 700, y: 250 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: true, replicas: 2, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Complete Architecture Explained:**

1. **Client → Load Balancer:**
   - 8,000 RPS from users
   - LB distributes using round-robin

2. **Load Balancer → 6 App Servers:**
   - Each server handles ~1,333 RPS (within 1,400 capacity) ✓
   - If 1 server fails, remaining 5 handle 1,600 RPS each (still works!)
   - High availability ✓

3. **App Servers → Redis Cache:**
   - 80% cache hit rate
   - 6,400 requests served from cache (fast! 2ms)
   - Only 1,600 requests hit database

4. **Cache Miss → Database:**
   - 1,600 RPS query database
   - Read replicas help distribute load
   - Primary handles writes

**Traffic Flow:**
\`\`\`
8,000 RPS → Load Balancer → 6 App Servers
                               ↓
                    80% Cache Hit (6,400)  20% Cache Miss (1,600)
                         ↓                        ↓
                    Redis Cache              Database
                    (2ms latency)            (20ms latency)
\`\`\`

**Result:** Fast, scalable, highly available system! ✓

**This is a production-ready architecture** used by blogs, e-commerce sites, and many web applications.
      `
    },

    // NEW: Summary and next steps
    {
      id: 'components-summary',
      type: 'concept',
      title: 'Summary & Next Steps',
      description: 'Review and practice path',
      estimatedMinutes: 3,
      content: (
        <Section>
          <H1>You've Mastered Basic Components!</H1>

          <H2>What You Learned</H2>

          <UL>
            <LI>✓ <Strong>Client:</Strong> User-facing entry point</LI>
            <LI>✓ <Strong>App Server:</Strong> Runs business logic, scales horizontally</LI>
            <LI>✓ <Strong>Database:</Strong> Persistent storage with replication</LI>
            <LI>✓ <Strong>Cache:</Strong> Fast memory for repeated data (80%+ hit rate)</LI>
            <LI>✓ <Strong>Load Balancer:</Strong> Distributes traffic across servers</LI>
          </UL>

          <H2>Key Takeaways</H2>

          <ComparisonTable
            headers={['Component', 'When to Add', 'Benefit']}
            rows={[
              ['App Server (more)', 'Traffic exceeds capacity', 'Handle more requests'],
              ['Load Balancer', 'Have 2+ app servers', 'Distribute traffic evenly'],
              ['Cache', 'Read-heavy workload', '10-100x faster reads'],
              ['Database Replicas', 'High read load', 'Spread reads across servers']
            ]}
          />

          <Divider />

          <H2>Recommended Practice</H2>

          <InfoBox type="tip">
            <P><Strong>Challenge: Food Blog (Beginner)</Strong></P>
            <P>Perfect for practicing what you learned:</P>
            <UL>
              <LI>Read-heavy workload (blog posts accessed repeatedly)</LI>
              <LI>Practice adding cache in the right place</LI>
              <LI>Scale app servers based on traffic</LI>
              <LI>Use load balancer for redundancy</LI>
            </UL>
          </InfoBox>

          <InfoBox type="tip">
            <P><Strong>Challenge: TinyURL (Beginner)</Strong></P>
            <P>Apply caching concepts:</P>
            <UL>
              <LI>Very read-heavy (90%+ redirect requests)</LI>
              <LI>Perfect use case for cache-aside pattern</LI>
              <LI>Practice capacity planning</LI>
            </UL>
          </InfoBox>

          <Divider />

          <H2>Continue Learning</H2>

          <P><Strong>Next lessons:</Strong></P>
          <UL>
            <LI>→ <Strong>Capacity Planning:</Strong> Calculate exactly how many servers you need</LI>
            <LI>→ <Strong>Caching Fundamentals:</Strong> Deep dive into cache patterns and strategies</LI>
            <LI>→ <Strong>Database Scaling:</Strong> Replication, sharding, and optimization</LI>
          </UL>

          <KeyPoint>
            <Strong>Remember:</Strong> Start simple (3 components), then add complexity as needed.
            Don't over-engineer!
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'Understand when to add each component',
        'Start simple, add complexity gradually',
        'Practice with beginner challenges',
      ],
    },
  ],
};
