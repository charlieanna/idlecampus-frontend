import type { SystemDesignLesson } from '../../../types/lesson';
import { SystemGraph } from '../../../types/graph';

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
      content: {
        markdown: `# Basic Components

Every system is built from a set of **components**. Each component has a specific role:

## Core Components

### 1. Client
- **What**: User's device (browser, mobile app)
- **Role**: Makes requests, displays responses
- **Example**: Your web browser requesting a webpage

### 2. App Server
- **What**: Machine that runs your application code
- **Role**: Processes business logic, handles requests
- **Example**: Server running Python/Java/Node.js code

### 3. Database
- **What**: Persistent storage for data
- **Role**: Stores and retrieves data reliably
- **Example**: PostgreSQL, MySQL, MongoDB

### 4. Cache
- **What**: Fast, temporary storage
- **Role**: Speeds up repeated requests
- **Example**: Redis, Memcached

### 5. Load Balancer
- **What**: Distributes traffic across servers
- **Role**: Prevents any single server from being overwhelmed
- **Example**: AWS ELB, NGINX

## Component Relationships

Components **connect** to each other:
- **Client → App Server**: User makes request
- **App Server → Database**: Fetch/store data
- **App Server → Cache**: Check for cached data
- **Load Balancer → App Server**: Route requests

In the next stages, you'll learn about each component in detail!`,
      },
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
      content: {
        markdown: `# Client Component

The **client** is where users interact with your system.

## What is a Client?

- Web browser (Chrome, Firefox, Safari)
- Mobile app (iOS, Android)
- Desktop application
- API client (another service calling your API)

## Client Responsibilities

1. **Send requests** to servers
2. **Display responses** to users
3. **Handle user input** (clicks, forms, etc.)
4. **Cache static assets** (images, CSS, JS)

## Client Limitations

- **No persistent storage** (usually)
- **Limited processing power** (compared to servers)
- **Network dependent** (needs internet connection)

## In System Design

When designing systems, you typically:
- **Don't control** the client (users use their own devices)
- **Optimize** for client experience (fast responses, mobile-friendly)
- **Assume** clients can be unreliable (slow networks, crashes)

The client is the **entry point** to your system!`,
      },
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
      content: {
        markdown: `# App Server Component

The **app server** is the heart of your application - it runs your business logic.

## What is an App Server?

A server that:
- Runs your application code (Python, Java, Node.js, etc.)
- Processes HTTP requests
- Implements business logic
- Connects to databases, caches, and other services

## App Server Responsibilities

1. **Handle requests** from clients
2. **Process business logic** (validate, transform, compute)
3. **Query databases** for data
4. **Call external APIs** if needed
5. **Return responses** to clients

## Scaling App Servers

- **Vertical scaling**: Use a bigger server (more CPU, RAM)
- **Horizontal scaling**: Add more servers (instances)
- **Load balancing**: Distribute requests across multiple servers

## Stateless vs Stateful

- **Stateless**: Server doesn't remember previous requests (easier to scale)
- **Stateful**: Server remembers session data (harder to scale)

Most modern systems use **stateless** servers for scalability.

## In System Design

You'll configure:
- **Number of instances**: How many servers?
- **Instance type**: How powerful? (fixed to commodity hardware in this platform)
- **Load balancing strategy**: How to distribute traffic?`,
      },
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
      content: {
        markdown: `# Database Component

The **database** stores your persistent data reliably.

## What is a Database?

A system that:
- Stores data permanently (survives server restarts)
- Provides structured access to data
- Ensures data integrity and consistency
- Supports queries and transactions

## Types of Databases

### SQL (Relational)
- **Examples**: PostgreSQL, MySQL
- **Structure**: Tables with rows and columns
- **Use when**: Need ACID transactions, complex queries

### NoSQL
- **Examples**: MongoDB, DynamoDB, Cassandra
- **Structure**: Documents, key-value, wide-column
- **Use when**: Need horizontal scaling, flexible schema

## Database Responsibilities

1. **Store data** permanently
2. **Retrieve data** quickly (with indexes)
3. **Ensure consistency** (ACID properties)
4. **Handle concurrent access** (locks, transactions)

## Scaling Databases

- **Replication**: Copy data to multiple servers (read replicas)
- **Sharding**: Split data across multiple databases
- **Caching**: Use cache to reduce database load

## In System Design

You'll configure:
- **Replication mode**: Single-leader, multi-leader, or leaderless
- **Number of replicas**: For read capacity
- **Sharding**: For write capacity and data distribution`,
      },
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
      content: {
        markdown: `# Cache Component

The **cache** stores frequently accessed data in fast memory.

## What is a Cache?

A fast, temporary storage that:
- Stores data in memory (much faster than disk)
- Has limited capacity (smaller than database)
- Can expire data (TTL - Time To Live)
- Reduces load on database

## Why Use a Cache?

- **Speed**: Memory access is 100-1000x faster than disk
- **Reduce database load**: 90%+ of requests can be served from cache
- **Cost**: Fewer database queries = lower costs

## Cache Patterns

### Cache-Aside (Lazy Loading)
1. App checks cache
2. If miss, query database
3. Store result in cache
4. Return to client

### Write-Through
1. Write to cache and database simultaneously
2. Ensures consistency
3. Slower writes, faster reads

## Cache Considerations

- **What to cache**: Frequently accessed, rarely changing data
- **Cache size**: Balance between hit rate and memory cost
- **Eviction policy**: What to remove when full (LRU, LFU)
- **Invalidation**: When to remove stale data

## In System Design

You'll configure:
- **Cache size**: How much memory?
- **Strategy**: Cache-aside, write-through, etc.
- **TTL**: How long data stays in cache`,
      },
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

