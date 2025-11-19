import type { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

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
      content: (
        <Section>
          <H1>What is System Design?</H1>
          
          <P>
            System design is the process of <Strong>architecting</Strong> software systems to meet specific requirements. It involves:
          </P>

          <UL>
            <LI><Strong>Designing components:</Strong> What pieces make up your system?</LI>
            <LI><Strong>Defining interactions:</Strong> How do components communicate?</LI>
            <LI><Strong>Planning for scale:</Strong> How will it handle growth?</LI>
            <LI><Strong>Optimizing trade-offs:</Strong> Balancing performance, cost, and complexity</LI>
          </UL>

          <H2>Why Does It Matter?</H2>

          <P>When building real-world applications, you need to consider:</P>

          <OL>
            <LI><Strong>Scalability:</Strong> Can it handle 1 million users? 1 billion?</LI>
            <LI><Strong>Reliability:</Strong> What happens if a server crashes?</LI>
            <LI><Strong>Performance:</Strong> How fast are responses?</LI>
            <LI><Strong>Cost:</Strong> How much does infrastructure cost?</LI>
            <LI><Strong>Maintainability:</Strong> Can the team understand and modify it?</LI>
          </OL>

          <H2>Real-World Example</H2>

          <P>Think about <Strong>TinyURL</Strong> (URL shortener):</P>

          <UL>
            <LI>Takes a long URL like <Code>https://example.com/very/long/path</Code></LI>
            <LI>Returns a short code like <Code>abc123</Code></LI>
            <LI>When someone visits <Code>tinyurl.com/abc123</Code>, redirects to the original URL</LI>
          </UL>

          <P>This seems simple, but consider:</P>

          <UL>
            <LI>What if you need to handle 1 billion URLs?</LI>
            <LI>How do you ensure the short code is unique?</LI>
            <LI>What if a server goes down?</LI>
            <LI>How fast should redirects be?</LI>
          </UL>

          <KeyPoint>
            These are <Strong>system design</Strong> questions!
          </KeyPoint>
        </Section>
      ),
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
      content: (
        <Section>
          <H1>Common System Design Problems</H1>
          
          <P>Here are some classic problems you'll encounter:</P>

          <H2>1. URL Shortener (TinyURL)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Shorten long URLs and redirect quickly</LI>
            <LI><Strong>Key concerns:</Strong> High read-to-write ratio, fast redirects</LI>
          </UL>

          <H2>2. Social Media Feed</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Show personalized content to millions of users</LI>
            <LI><Strong>Key concerns:</Strong> Real-time updates, ranking algorithms</LI>
          </UL>

          <H2>3. Chat/Messaging System</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Deliver messages instantly to users</LI>
            <LI><Strong>Key concerns:</Strong> Real-time communication, message ordering</LI>
          </UL>

          <H2>4. Search Engine</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Find relevant results from billions of documents</LI>
            <LI><Strong>Key concerns:</Strong> Indexing, ranking, fast queries</LI>
          </UL>

          <H2>5. Video Streaming</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Stream video to millions of concurrent viewers</LI>
            <LI><Strong>Key concerns:</Strong> Bandwidth, CDN, buffering</LI>
          </UL>

          <H2>6. E-commerce Platform</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Handle product catalog, orders, payments</LI>
            <LI><Strong>Key concerns:</Strong> Inventory management, payment processing, recommendations</LI>
          </UL>

          <Divider />

          <P>Each problem has unique requirements, but they share common patterns:</P>

          <UL>
            <LI><Strong>Caching</Strong> for frequently accessed data</LI>
            <LI><Strong>Load balancing</Strong> to distribute traffic</LI>
            <LI><Strong>Databases</Strong> for persistent storage</LI>
            <LI><Strong>CDNs</Strong> for static content</LI>
          </UL>

          <KeyPoint>
            You'll learn these patterns in upcoming lessons!
          </KeyPoint>
        </Section>
      ),
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
      content: (
        <Section>
          <H1>System Design Interviews</H1>
          
          <P>System design interviews are common at tech companies. Here's what to expect:</P>

          <H2>Interview Format</H2>

          <OL>
            <LI>
              <Strong>Problem Statement</Strong> (5 min)
              <UL>
                <LI>Interviewer presents a problem (e.g., "Design a URL shortener")</LI>
                <LI>Ask clarifying questions about requirements</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Requirements Gathering</Strong> (10 min)
              <UL>
                <LI>Functional requirements: What must it do?</LI>
                <LI>Non-functional requirements: Scale, latency, availability</LI>
                <LI>Constraints: Budget, team size, timeline</LI>
              </UL>
            </LI>
            <LI>
              <Strong>High-Level Design</Strong> (15 min)
              <UL>
                <LI>Draw a diagram showing major components</LI>
                <LI>Explain data flow</LI>
                <LI>Identify APIs</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Deep Dive</Strong> (15 min)
              <UL>
                <LI>Discuss specific components in detail</LI>
                <LI>Address bottlenecks</LI>
                <LI>Discuss trade-offs</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Scale & Optimize</Strong> (10 min)
              <UL>
                <LI>How to handle 10x traffic?</LI>
                <LI>What if a component fails?</LI>
                <LI>Cost optimization</LI>
              </UL>
            </LI>
          </OL>

          <H2>Key Skills Assessed</H2>

          <UL>
            <LI><Strong>Communication:</Strong> Can you explain your design clearly?</LI>
            <LI><Strong>Problem-solving:</Strong> Do you ask the right questions?</LI>
            <LI><Strong>Trade-off analysis:</Strong> Do you understand pros/cons?</LI>
            <LI><Strong>Scalability thinking:</Strong> Can you design for growth?</LI>
          </UL>

          <H2>Tips for Success</H2>

          <UL>
            <LI>✅ <Strong>Ask questions</Strong> - Don't assume requirements</LI>
            <LI>✅ <Strong>Start simple</Strong> - Begin with basic design, then add complexity</LI>
            <LI>✅ <Strong>Think out loud</Strong> - Explain your reasoning</LI>
            <LI>✅ <Strong>Consider trade-offs</Strong> - There's no perfect solution</LI>
            <LI>✅ <Strong>Discuss alternatives</Strong> - Show you understand options</LI>
          </UL>

          <H2>Practice Makes Perfect</H2>

          <P>The best way to prepare is to:</P>

          <OL>
            <LI><Strong>Study patterns</Strong> - Learn common architectures</LI>
            <LI><Strong>Practice problems</Strong> - Design systems on paper</LI>
            <LI><Strong>Build systems</Strong> - Hands-on experience is invaluable</LI>
            <LI><Strong>Review solutions</Strong> - Learn from others' designs</LI>
          </OL>

          <KeyPoint>
            This platform helps you practice by building real systems and seeing how they perform!
          </KeyPoint>
        </Section>
      ),
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
      content: (
        <Section>
          <H1>Basic Terminology</H1>
          
          <P>Here are essential terms you'll encounter:</P>

          <H2>Components</H2>

          <UL>
            <LI><Strong>Client:</Strong> The user's device (browser, mobile app)</LI>
            <LI><Strong>Server:</Strong> Machine that processes requests</LI>
            <LI><Strong>Database:</Strong> Stores persistent data</LI>
            <LI><Strong>Cache:</Strong> Fast storage for frequently accessed data</LI>
            <LI><Strong>Load Balancer:</Strong> Distributes traffic across servers</LI>
            <LI><Strong>CDN:</Strong> Content Delivery Network for static assets</LI>
          </UL>

          <H2>Metrics</H2>

          <UL>
            <LI><Strong>RPS:</Strong> Requests Per Second - how many requests per second</LI>
            <LI><Strong>Latency:</Strong> Time for a request to complete (p50, p99)</LI>
            <LI><Strong>Throughput:</Strong> Total data processed per unit time</LI>
            <LI><Strong>Availability:</Strong> Percentage of time system is operational (99.9% = 8.76 hours downtime/year)</LI>
          </UL>

          <H2>Concepts</H2>

          <UL>
            <LI><Strong>Scalability:</Strong> Ability to handle increased load</LI>
            <LI><Strong>Reliability:</Strong> System works correctly under failures</LI>
            <LI><Strong>Consistency:</Strong> All users see same data</LI>
            <LI><Strong>Partitioning:</Strong> Splitting data across multiple databases (sharding)</LI>
            <LI><Strong>Replication:</Strong> Copying data to multiple servers</LI>
          </UL>

          <H2>Patterns</H2>

          <UL>
            <LI><Strong>Cache-aside:</Strong> App checks cache, then database</LI>
            <LI><Strong>Write-through:</Strong> Write to cache and database simultaneously</LI>
            <LI><Strong>Single-leader replication:</Strong> One primary database, multiple read replicas</LI>
            <LI><Strong>Multi-leader replication:</Strong> Multiple databases can accept writes</LI>
          </UL>

          <KeyPoint>
            Don't worry if these seem overwhelming - you'll learn each in detail!
          </KeyPoint>
        </Section>
      ),
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

