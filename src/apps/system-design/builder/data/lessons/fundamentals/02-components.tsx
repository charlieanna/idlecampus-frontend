import type { SystemDesignLesson } from '../../../types/lesson';
import { SystemGraph } from '../../../types/graph';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const componentsLesson: SystemDesignLesson = {
  id: 'sd-components',
  slug: 'basic-components',
  title: 'Basic Components',
  description: 'Learn about the fundamental building blocks of system design: clients, servers, databases, and more',
  difficulty: 'beginner',
  estimatedMinutes: 30,
  category: 'fundamentals',
  tags: ['components', 'architecture', 'basics'],
  prerequisites: ['what-is-system-design'],
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
  relatedChallenges: ['tiny-url', 'food-blog'],
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
            <LI><Strong>Load Balancer → App Server:</Strong> Route requests</LI>
          </UL>

          <KeyPoint>
            In the next stages, you'll learn about each component in detail!
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

          <H2>Scaling App Servers</H2>

          <UL>
            <LI><Strong>Vertical scaling:</Strong> Use a bigger server (more CPU, RAM)</LI>
            <LI><Strong>Horizontal scaling:</Strong> Add more servers (instances)</LI>
            <LI><Strong>Load balancing:</Strong> Distribute requests across multiple servers</LI>
          </UL>

          <H2>Stateless vs Stateful</H2>

          <UL>
            <LI><Strong>Stateless:</Strong> Server doesn't remember previous requests (easier to scale)</LI>
            <LI><Strong>Stateful:</Strong> Server remembers session data (harder to scale)</LI>
          </UL>

          <P>Most modern systems use <Strong>stateless</Strong> servers for scalability.</P>

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
            <LI><Strong>Use when:</Strong> Need ACID transactions, complex queries</LI>
          </UL>

          <H3>NoSQL</H3>
          <UL>
            <LI><Strong>Examples:</Strong> MongoDB, DynamoDB, Cassandra</LI>
            <LI><Strong>Structure:</Strong> Documents, key-value, wide-column</LI>
            <LI><Strong>Use when:</Strong> Need horizontal scaling, flexible schema</LI>
          </UL>

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

          <UL>
            <LI><Strong>Speed:</Strong> Memory access is 100-1000x faster than disk</LI>
            <LI><Strong>Reduce database load:</Strong> 90%+ of requests can be served from cache</LI>
            <LI><Strong>Cost:</Strong> Fewer database queries = lower costs</LI>
          </UL>

          <H2>Cache Patterns</H2>

          <H3>Cache-Aside (Lazy Loading)</H3>
          <CodeBlock>
{`1. App checks cache
2. If miss, query database
3. Store result in cache
4. Return to client`}
          </CodeBlock>

          <H3>Write-Through</H3>
          <CodeBlock>
{`1. Write to cache and database simultaneously
2. Ensures consistency
3. Slower writes, faster reads`}
          </CodeBlock>

          <H2>Cache Considerations</H2>

          <UL>
            <LI><Strong>What to cache:</Strong> Frequently accessed, rarely changing data</LI>
            <LI><Strong>Cache size:</Strong> Balance between hit rate and memory cost</LI>
            <LI><Strong>Eviction policy:</Strong> What to remove when full (LRU, LFU)</LI>
            <LI><Strong>Invalidation:</Strong> When to remove stale data</LI>
          </UL>

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
    {
      id: 'components-practice',
      type: 'canvas-practice',
      title: 'Practice: Build a Simple System',
      description: 'Place components on canvas',
      estimatedMinutes: 10,
      scenario: {
        description: 'Build a simple web application that serves a blog. Users can read blog posts stored in a database.',
        requirements: [
          'Add a client component (users)',
          'Add an app server component (handles requests)',
          'Add a database component (stores blog posts)',
          'Connect client to app server',
          'Connect app server to database',
        ],
      },
      initialCanvas: {
        components: [],
        connections: [],
      },
      hints: [
        'Start by adding a client component - this represents users',
        'Add an app server to handle requests from clients',
        'Add a database to store the blog posts',
        'Connect client to app server with a read connection',
        'Connect app server to database with a read connection',
      ],
      solution: {
        components: [
          {
            id: 'client_1',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {},
          },
          {
            id: 'app_server_1',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 1,
              instanceType: 'commodity-app',
            },
          },
          {
            id: 'postgresql_1',
            type: 'postgresql',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' },
              sharding: { enabled: false, shards: 1, shardKey: 'id' },
            },
          },
        ],
        connections: [
          {
            from: 'client_1',
            to: 'app_server_1',
            type: 'read',
          },
          {
            from: 'app_server_1',
            to: 'postgresql_1',
            type: 'read',
          },
        ],
      },
      solutionExplanation: `## Solution Explanation

This is a simple 3-tier architecture:

1. **Client**: Users' browsers making requests
2. **App Server**: Processes requests and serves blog posts
3. **Database**: Stores blog post data

**Flow**: Client → App Server → Database

This is the foundation of most web applications. In later lessons, you'll learn to add caching, load balancing, and more!`,
    },
  ],
  nextLessons: ['understanding-scale'],
};

