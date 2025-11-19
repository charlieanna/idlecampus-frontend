import type { SystemDesignLesson } from '../../../types/lesson';

export const introductionLesson: SystemDesignLesson = {
  id: 'sd-introduction',
  slug: 'what-is-system-design',
  title: 'What is System Design?',
  description: 'Learn the fundamentals of system design and why it matters for building scalable applications',
  difficulty: 'beginner',
  estimatedMinutes: 20,
  category: 'fundamentals',
  tags: ['introduction', 'basics', 'overview'],
  prerequisites: [],
  learningObjectives: [
    'Understand what system design is and why it matters',
    'Learn common system design problems',
    'Understand interview expectations',
    'Get familiar with basic terminology',
  ],
  conceptsCovered: [
    {
      id: 'system-design-definition',
      name: 'System Design',
      type: 'technique',
      difficulty: 1,
      description: 'The process of defining the architecture, components, modules, interfaces, and data for a system',
    },
  ],
  relatedChallenges: ['tiny-url'],
  stages: [
    {
      id: 'intro-what-is',
      type: 'concept',
      title: 'What is System Design?',
      description: 'Understanding the basics',
      estimatedMinutes: 5,
      content: {
        markdown: `# What is System Design?

System design is the process of **architecting** software systems to meet specific requirements. It involves:

- **Designing components**: What pieces make up your system?
- **Defining interactions**: How do components communicate?
- **Planning for scale**: How will it handle growth?
- **Optimizing trade-offs**: Balancing performance, cost, and complexity

## Why Does It Matter?

When building real-world applications, you need to consider:

1. **Scalability**: Can it handle 1 million users? 1 billion?
2. **Reliability**: What happens if a server crashes?
3. **Performance**: How fast are responses?
4. **Cost**: How much does infrastructure cost?
5. **Maintainability**: Can the team understand and modify it?

## Real-World Example

Think about **TinyURL** (URL shortener):
- Takes a long URL like \`https://example.com/very/long/path\`
- Returns a short code like \`abc123\`
- When someone visits \`tinyurl.com/abc123\`, redirects to the original URL

This seems simple, but consider:
- What if you need to handle 1 billion URLs?
- How do you ensure the short code is unique?
- What if a server goes down?
- How fast should redirects be?

These are **system design** questions!`,
      },
      keyPoints: [
        'System design is about architecting scalable, reliable systems',
        'It involves components, interactions, and trade-offs',
        'Real-world systems must handle scale, reliability, and performance',
      ],
    },
    {
      id: 'intro-common-problems',
      type: 'concept',
      title: 'Common System Design Problems',
      description: 'Types of systems you might design',
      estimatedMinutes: 5,
      content: {
        markdown: `# Common System Design Problems

Here are some classic problems you'll encounter:

## 1. URL Shortener (TinyURL)
- **Challenge**: Shorten long URLs and redirect quickly
- **Key concerns**: High read-to-write ratio, fast redirects

## 2. Social Media Feed
- **Challenge**: Show personalized content to millions of users
- **Key concerns**: Real-time updates, ranking algorithms

## 3. Chat/Messaging System
- **Challenge**: Deliver messages instantly to users
- **Key concerns**: Real-time communication, message ordering

## 4. Search Engine
- **Challenge**: Find relevant results from billions of documents
- **Key concerns**: Indexing, ranking, fast queries

## 5. Video Streaming
- **Challenge**: Stream video to millions of concurrent viewers
- **Key concerns**: Bandwidth, CDN, buffering

## 6. E-commerce Platform
- **Challenge**: Handle product catalog, orders, payments
- **Key concerns**: Inventory management, payment processing, recommendations

Each problem has unique requirements, but they share common patterns:
- **Caching** for frequently accessed data
- **Load balancing** to distribute traffic
- **Databases** for persistent storage
- **CDNs** for static content

You'll learn these patterns in upcoming lessons!`,
      },
      keyPoints: [
        'Many system design problems share common patterns',
        'Each problem has unique requirements and constraints',
        'Understanding patterns helps solve new problems',
      ],
    },
    {
      id: 'intro-interview',
      type: 'concept',
      title: 'System Design Interviews',
      description: 'What to expect',
      estimatedMinutes: 5,
      content: {
        markdown: `# System Design Interviews

System design interviews are common at tech companies. Here's what to expect:

## Interview Format

1. **Problem Statement** (5 min)
   - Interviewer presents a problem (e.g., "Design a URL shortener")
   - Ask clarifying questions about requirements

2. **Requirements Gathering** (10 min)
   - Functional requirements: What must it do?
   - Non-functional requirements: Scale, latency, availability
   - Constraints: Budget, team size, timeline

3. **High-Level Design** (15 min)
   - Draw a diagram showing major components
   - Explain data flow
   - Identify APIs

4. **Deep Dive** (15 min)
   - Discuss specific components in detail
   - Address bottlenecks
   - Discuss trade-offs

5. **Scale & Optimize** (10 min)
   - How to handle 10x traffic?
   - What if a component fails?
   - Cost optimization

## Key Skills Assessed

- **Communication**: Can you explain your design clearly?
- **Problem-solving**: Do you ask the right questions?
- **Trade-off analysis**: Do you understand pros/cons?
- **Scalability thinking**: Can you design for growth?

## Tips for Success

✅ **Ask questions** - Don't assume requirements
✅ **Start simple** - Begin with basic design, then add complexity
✅ **Think out loud** - Explain your reasoning
✅ **Consider trade-offs** - There's no perfect solution
✅ **Discuss alternatives** - Show you understand options

## Practice Makes Perfect

The best way to prepare is to:
1. **Study patterns** - Learn common architectures
2. **Practice problems** - Design systems on paper
3. **Build systems** - Hands-on experience is invaluable
4. **Review solutions** - Learn from others' designs

This platform helps you practice by building real systems and seeing how they perform!`,
      },
      keyPoints: [
        'System design interviews test communication and problem-solving',
        'Start simple, then add complexity',
        'Practice is essential for success',
      ],
    },
    {
      id: 'intro-terminology',
      type: 'concept',
      title: 'Basic Terminology',
      description: 'Key terms you need to know',
      estimatedMinutes: 5,
      content: {
        markdown: `# Basic Terminology

Here are essential terms you'll encounter:

## Components

- **Client**: The user's device (browser, mobile app)
- **Server**: Machine that processes requests
- **Database**: Stores persistent data
- **Cache**: Fast storage for frequently accessed data
- **Load Balancer**: Distributes traffic across servers
- **CDN**: Content Delivery Network for static assets

## Metrics

- **RPS**: Requests Per Second - how many requests per second
- **Latency**: Time for a request to complete (p50, p99)
- **Throughput**: Total data processed per unit time
- **Availability**: Percentage of time system is operational (99.9% = 8.76 hours downtime/year)

## Concepts

- **Scalability**: Ability to handle increased load
- **Reliability**: System works correctly under failures
- **Consistency**: All users see same data
- **Partitioning**: Splitting data across multiple databases (sharding)
- **Replication**: Copying data to multiple servers

## Patterns

- **Cache-aside**: App checks cache, then database
- **Write-through**: Write to cache and database simultaneously
- **Single-leader replication**: One primary database, multiple read replicas
- **Multi-leader replication**: Multiple databases can accept writes

Don't worry if these seem overwhelming - you'll learn each in detail!`,
      },
      keyPoints: [
        'Understanding terminology helps communicate designs',
        'Metrics help quantify system requirements',
        'Patterns are reusable solutions to common problems',
      ],
    },
    {
      id: 'intro-quiz',
      type: 'quiz',
      title: 'Knowledge Check',
      description: 'Test your understanding',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'q1',
          question: 'What is system design primarily concerned with?',
          type: 'multiple_choice',
          options: [
            'Writing code',
            'Architecting scalable, reliable systems',
            'Debugging applications',
            'Writing documentation',
          ],
          correctAnswer: 'Architecting scalable, reliable systems',
          explanation: 'System design focuses on architecture, components, and trade-offs, not just code.',
          points: 10,
        },
        {
          id: 'q2',
          question: 'Which is NOT a common system design problem?',
          type: 'multiple_choice',
          options: [
            'URL Shortener',
            'Social Media Feed',
            'Sorting Algorithm',
            'Video Streaming',
          ],
          correctAnswer: 'Sorting Algorithm',
          explanation: 'Sorting algorithms are data structure problems, not system design problems.',
          points: 10,
        },
        {
          id: 'q3',
          question: 'What does RPS stand for?',
          type: 'multiple_choice',
          options: [
            'Requests Per Second',
            'Responses Per Second',
            'Reads Per Second',
            'Replication Per Second',
          ],
          correctAnswer: 'Requests Per Second',
          explanation: 'RPS measures how many requests a system handles per second.',
          points: 10,
        },
      ],
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true,
    },
  ],
  nextLessons: ['basic-components'],
};

