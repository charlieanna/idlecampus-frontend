import type { SystemDesignLesson } from '../../../types/lesson';
import {
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section,
  KeyPoint, Example, Divider, InfoBox, ComparisonTable
} from '../../../ui/components/LessonContent';

export const introductionLesson: SystemDesignLesson = {
  id: 'sd-introduction',
  slug: 'what-is-system-design',
  title: 'What is System Design?',
  description: 'Learn trade-off thinking: The heart of system design. Understand WHEN to choose speed vs freshness, simple vs scalable, consistency vs availability',
  difficulty: 'beginner',
  estimatedMinutes: 50, // Increased due to comprehensive trade-off content
  category: 'fundamentals',
  tags: ['introduction', 'basics', 'overview'],
  prerequisites: [],

  // Progressive flow metadata
  moduleId: 'sd-module-1-fundamentals',
  sequenceOrder: 1,

  // NEW: Connect to next lessons
  nextLessons: ['basic-components', 'nfr-fundamentals'],

  // NEW: Related challenges
  relatedChallenges: ['tiny_url', 'food-blog'],

  learningObjectives: [
    'Understand what system design is and why it matters',
    'Learn common system design problems',
    'Understand interview expectations',
    'Get familiar with basic terminology',
    'Practice identifying components and trade-offs',
  ],
  conceptsCovered: [
    {
      id: 'system-design-definition',
      name: 'System Design',
      type: 'technique',
      difficulty: 1,
      description: 'The process of defining the architecture, components, modules, interfaces, and data for a system',
    },
    {
      id: 'components',
      name: 'System Components',
      type: 'component',
      difficulty: 1,
      description: 'Client, server, database, cache, load balancer - building blocks of systems'
    },
    {
      id: 'trade-offs',
      name: 'Trade-off Analysis',
      type: 'technique',
      difficulty: 2,
      description: 'Balancing performance, cost, complexity, and reliability'
    }
  ],
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

          <H2>Real-World Example: TinyURL</H2>

          <P>Think about <Strong>TinyURL</Strong> (URL shortener):</P>

          <Example title="What it does">
            <UL>
              <LI>Takes a long URL like <Code>https://example.com/very/long/path</Code></LI>
              <LI>Returns a short code like <Code>abc123</Code></LI>
              <LI>When someone visits <Code>tinyurl.com/abc123</Code>, redirects to the original URL</LI>
            </UL>
          </Example>

          <P>This seems simple, but system design asks:</P>

          <UL>
            <LI>💾 How do you store 1 billion URLs efficiently?</LI>
            <LI>🔒 How do you ensure the short code is unique?</LI>
            <LI>⚡ How fast should redirects be? (Users expect {'<'}100ms!)</LI>
            <LI>🛡️ What if a server goes down?</LI>
            <LI>💰 How much will this cost to run?</LI>
          </UL>

          <KeyPoint>
            These are <Strong>system design</Strong> questions! In upcoming lessons,
            you'll learn how to answer them.
          </KeyPoint>

          <Divider />

          <H2>Simple vs Scalable Design</H2>

          <ComparisonTable
            headers={['Aspect', 'Simple (1 user)', 'Scalable (1M users)', 'Difference']}
            rows={[
              [
                'Storage',
                'Single text file',
                'Database + caching',
                'Need efficient lookup'
              ],
              [
                'Servers',
                '1 laptop',
                '100+ servers',
                'Need load balancing'
              ],
              [
                'Failures',
                'Restart manually',
                'Auto-recovery',
                'Need redundancy'
              ],
              [
                'Cost',
                '$0/month',
                '$10,000/month',
                'Need optimization'
              ]
            ]}
          />

          <InfoBox type="tip">
            <P>
              <Strong>Key insight:</Strong> System design is about building systems that work
              at scale, not just for a few users. That's what makes it challenging and interesting!
            </P>
          </InfoBox>
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
            <LI><Strong>Key concerns:</Strong> High read-to-write ratio (90% reads), fast redirects</LI>
            <LI><Strong>Pattern:</Strong> Heavy caching for popular URLs</LI>
          </UL>

          <H2>2. Social Media Feed (Twitter, Instagram)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Show personalized content to millions of users</LI>
            <LI><Strong>Key concerns:</Strong> Real-time updates, ranking algorithms</LI>
            <LI><Strong>Pattern:</Strong> Fan-out on write, caching, read replicas</LI>
          </UL>

          <H2>3. Chat/Messaging System (WhatsApp)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Deliver messages instantly to users</LI>
            <LI><Strong>Key concerns:</Strong> Real-time communication, message ordering</LI>
            <LI><Strong>Pattern:</Strong> WebSockets, message queues</LI>
          </UL>

          <H2>4. Video Streaming (YouTube, Netflix)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Stream video to millions of concurrent viewers</LI>
            <LI><Strong>Key concerns:</Strong> Bandwidth, CDN, adaptive bitrate</LI>
            <LI><Strong>Pattern:</Strong> CDN for edge caching, transcoding</LI>
          </UL>

          <H2>5. E-commerce Platform (Amazon)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Handle product catalog, orders, payments</LI>
            <LI><Strong>Key concerns:</Strong> Inventory consistency, payment processing</LI>
            <LI><Strong>Pattern:</Strong> Distributed transactions, event sourcing</LI>
          </UL>

          <H2>6. Ride-Sharing (Uber, Lyft)</H2>
          <UL>
            <LI><Strong>Challenge:</Strong> Match drivers with riders in real-time</LI>
            <LI><Strong>Key concerns:</Strong> Geospatial indexing, real-time matching</LI>
            <LI><Strong>Pattern:</Strong> Geohashing, WebSockets, event-driven</LI>
          </UL>

          <Divider />

          <H2>Common Patterns Across Problems</H2>

          <P>Despite different requirements, most systems use similar building blocks:</P>

          <UL>
            <LI>🗄️ <Strong>Caching</Strong> for frequently accessed data</LI>
            <LI>⚖️ <Strong>Load balancing</Strong> to distribute traffic</LI>
            <LI>💾 <Strong>Databases</Strong> for persistent storage</LI>
            <LI>🌐 <Strong>CDNs</Strong> for static content delivery</LI>
            <LI>📨 <Strong>Message queues</Strong> for async processing</LI>
          </UL>

          <KeyPoint>
            You'll learn these patterns in upcoming lessons and apply them to challenges!
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'Many system design problems share common patterns',
        'Each problem has unique requirements and constraints',
        'Understanding patterns helps solve new problems',
      ],
    },

    // NEW: Mini-Exercise 1 - Identify Components
    {
      id: 'practice-identify-components',
      type: 'quiz',
      title: 'Mini-Exercise: Identify Components',
      description: 'Test your understanding of system components',
      estimatedMinutes: 3,
      questions: [
        {
          id: 'component-1',
          question: 'A blog needs to store articles permanently (even after server restarts). Which component do you need?',
          type: 'multiple_choice',
          options: [
            'Cache (Redis)',
            'Database (PostgreSQL)',
            'Load Balancer',
            'CDN'
          ],
          correctAnswer: 'Database (PostgreSQL)',
          explanation: 'Databases provide PERSISTENT storage that survives restarts. Caches are temporary (in-memory). This is a fundamental difference!',
          points: 10
        },
        {
          id: 'component-2',
          question: 'Your blog is getting slow because the same popular articles are queried repeatedly. What should you add?',
          type: 'multiple_choice',
          options: [
            'More databases',
            'Cache (Redis)',
            'CDN',
            'Load Balancer'
          ],
          correctAnswer: 'Cache (Redis)',
          explanation: 'Caches speed up REPEATED requests by storing frequently accessed data in fast memory. Perfect for popular articles!',
          points: 10
        },
        {
          id: 'component-3',
          question: 'You have 3 app servers. How do you distribute incoming traffic across all 3?',
          type: 'multiple_choice',
          options: [
            'Cache',
            'Database',
            'Load Balancer',
            'CDN'
          ],
          correctAnswer: 'Load Balancer',
          explanation: 'Load balancers DISTRIBUTE traffic across multiple servers. Without one, traffic only goes to the first server!',
          points: 10
        }
      ],
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true
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

          <P>System design interviews are common at tech companies (FAANG, startups, etc.). Here's what to expect:</P>

          <H2>Interview Format (45-60 minutes)</H2>

          <OL>
            <LI>
              <Strong>Problem Statement</Strong> (5 min)
              <UL>
                <LI>Interviewer: "Design Instagram" or "Design a URL shortener"</LI>
                <LI><Strong>Your job:</Strong> Ask clarifying questions!</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Requirements Gathering</Strong> (10 min)
              <UL>
                <LI><Strong>Functional:</Strong> What must it do? (e.g., shorten URLs, redirect)</LI>
                <LI><Strong>Non-functional:</Strong> How many users? How fast? How reliable?</LI>
                <LI><Strong>Constraints:</Strong> Budget? Team size? Timeline?</LI>
              </UL>
            </LI>
            <LI>
              <Strong>High-Level Design</Strong> (15 min)
              <UL>
                <LI>Draw diagram: Client → Server → Database</LI>
                <LI>Explain data flow</LI>
                <LI>Define APIs (createShortURL, redirect)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Deep Dive</Strong> (15 min)
              <UL>
                <LI>Pick 1-2 components to detail (e.g., how to generate unique IDs)</LI>
                <LI>Address bottlenecks (database slow? add cache!)</LI>
                <LI>Discuss trade-offs (speed vs cost, complexity vs reliability)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Scale & Optimize</Strong> (10 min)
              <UL>
                <LI>"What if traffic increases 10x?"</LI>
                <LI>"What if database fails?"</LI>
                <LI>"How to reduce costs?"</LI>
              </UL>
            </LI>
          </OL>

          <Divider />

          <H2>What Interviewers Look For</H2>

          <ComparisonTable
            headers={['Skill', 'Good', 'Bad']}
            rows={[
              [
                'Communication',
                'Explains thinking clearly\nAsks clarifying questions',
                'Silent coding\nAssumes requirements'
              ],
              [
                'Problem-solving',
                'Starts simple, adds complexity\nIdentifies bottlenecks',
                'Jumps to complex solution\nMisses obvious issues'
              ],
              [
                'Trade-offs',
                'Discusses pros/cons\n"We could cache, but..."',
                'Only one solution\nNo alternatives'
              ],
              [
                'Scalability',
                'Plans for 10x growth\nConsiders failures',
                'Designs for current load\nIgnores edge cases'
              ]
            ]}
          />

          <H2>Interview Tips</H2>

          <UL>
            <LI>✅ <Strong>Ask questions FIRST</Strong> - "How many users? How fast?" Don't assume!</LI>
            <LI>✅ <Strong>Start simple</Strong> - Draw basic diagram, then optimize</LI>
            <LI>✅ <Strong>Think out loud</Strong> - "I'm considering cache here because..."</LI>
            <LI>✅ <Strong>Discuss trade-offs</Strong> - "Cache is faster but costs more memory"</LI>
            <LI>✅ <Strong>Use numbers</Strong> - "100 RPS needs ~2 servers at 70% capacity"</LI>
            <LI>❌ <Strong>Don't jump to coding</Strong> - This isn't a coding interview!</LI>
            <LI>❌ <Strong>Don't over-engineer</Strong> - Start with 3 components, not 30</LI>
          </UL>

          <Example title="Good Interview Flow">
            <CodeBlock>
{`Interviewer: "Design a URL shortener."

You: "Great! Let me clarify a few things:
- How many URLs shortened per day?
- How many redirects per day?
- Should URLs expire?
- Any requirements on short code length?"

Interviewer: "1M new URLs/day, 100M redirects/day, no expiration, 7 chars."

You: "So we're read-heavy (100:1 ratio). Let me start with a simple design:
[Draws: Client → App Server → Database]

For reads, I'd add Redis cache because:
- 100M redirects/day = very high read traffic
- Popular URLs accessed repeatedly
- Cache can serve 80%+ requests (reduces DB load 5x)

[Draws: Client → LB → App Servers → Redis Cache → Database]

This handles the scale. Should I dive deeper into ID generation?"`}
            </CodeBlock>
          </Example>

          <InfoBox type="success">
            <P>
              <Strong>Pro tip:</Strong> Practice on this platform! The challenges simulate
              real interviews. You'll draw diagrams, make trade-offs, and see performance results.
            </P>
          </InfoBox>
        </Section>
      ),
      keyPoints: [
        'System design interviews test communication and problem-solving',
        'Start simple, then add complexity',
        'Always ask clarifying questions first',
      ],
    },

    // NEW: Mini-Exercise 2 - Requirements Gathering
    {
      id: 'practice-requirements',
      type: 'quiz',
      title: 'Mini-Exercise: Ask the Right Questions',
      description: 'Practice gathering requirements like in real interviews',
      estimatedMinutes: 4,
      questions: [
        {
          id: 'req-1',
          question: 'Interviewer says: "Design Twitter". What is the MOST important question to ask first?',
          type: 'multiple_choice',
          options: [
            'Which database should I use?',
            'How many users and how many tweets per day?',
            'Should I use microservices?',
            'What programming language?'
          ],
          correctAnswer: 'How many users and how many tweets per day?',
          explanation: 'SCALE is the first thing to clarify! 100 users vs 100M users = completely different designs. Database choice comes later.',
          points: 10
        },
        {
          id: 'req-2',
          question: 'For a URL shortener, which requirement helps you most with design decisions?',
          type: 'multiple_choice',
          options: [
            'How long should short URLs be?',
            'Read vs write ratio (redirects vs new URLs)',
            'What color should the website be?',
            'Should we support analytics?'
          ],
          correctAnswer: 'Read vs write ratio (redirects vs new URLs)',
          explanation: 'Read-heavy (90% reads) → use caching. Write-heavy (90% writes) → optimize writes. This determines your entire architecture!',
          points: 10
        },
        {
          id: 'req-3',
          question: 'Interviewer asks: "How would you handle 10x traffic?" What should you consider?',
          type: 'multiple_choice',
          options: [
            'Rewrite everything from scratch',
            'Scale horizontally (add more servers) + add caching',
            'Buy the biggest server available',
            'Tell users to wait'
          ],
          correctAnswer: 'Scale horizontally (add more servers) + add caching',
          explanation: 'Horizontal scaling (more servers) is how real systems scale. Vertical scaling (bigger server) hits limits. Caching reduces load.',
          points: 10
        }
      ],
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true
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

          <P>Here are essential terms you'll encounter in system design:</P>

          <H2>Components (Building Blocks)</H2>

          <ComparisonTable
            headers={['Component', 'Purpose', 'Example', 'Speed']}
            rows={[
              ['Client', 'User device', 'Browser, mobile app', 'Varies'],
              ['Server', 'Runs app logic', 'Node.js, Python server', 'Fast (CPU)'],
              ['Database', 'Persistent storage', 'PostgreSQL, MongoDB', 'Slow (disk)'],
              ['Cache', 'Fast temp storage', 'Redis, Memcached', 'Very fast (RAM)'],
              ['Load Balancer', 'Distributes traffic', 'NGINX, AWS ELB', 'Fast (routing)'],
              ['CDN', 'Edge caching', 'Cloudflare, Akamai', 'Very fast (geo)']
            ]}
          />

          <Divider />

          <H2>Metrics (How We Measure)</H2>

          <UL>
            <LI>
              <Strong>RPS (Requests Per Second):</Strong> How many requests per second
              <UL>
                <LI>Example: "TinyURL handles 10,000 RPS"</LI>
                <LI>Helps calculate: How many servers needed?</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Latency:</Strong> Time for request to complete
              <UL>
                <LI>p50 = 50th percentile (median user experience)</LI>
                <LI>p99 = 99th percentile (worst 1% of users)</LI>
                <LI>Example: "p99 latency &lt; 100ms" means 99% of users get response in &lt;100ms</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Throughput:</Strong> Total data processed per unit time
              <UL>
                <LI>Example: "1 GB/second video throughput"</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Availability:</Strong> Percentage of time system is operational
              <UL>
                <LI>99.9% (3 nines) = 8.76 hours downtime/year</LI>
                <LI>99.99% (4 nines) = 52 minutes downtime/year</LI>
                <LI>99.999% (5 nines) = 5 minutes downtime/year (very expensive!)</LI>
              </UL>
            </LI>
          </UL>

          <Divider />

          <H2>Concepts (How Systems Work)</H2>

          <UL>
            <LI>
              <Strong>Scalability:</Strong> Ability to handle increased load
              <UL>
                <LI><Strong>Vertical:</Strong> Bigger server (limited, expensive)</LI>
                <LI><Strong>Horizontal:</Strong> More servers (unlimited, preferred)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Reliability:</Strong> System works correctly even with failures
              <UL>
                <LI>Example: If 1 server crashes, load balancer routes to others</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Consistency:</Strong> All users see same data
              <UL>
                <LI><Strong>Strong:</Strong> Everyone sees latest data (slow, expensive)</LI>
                <LI><Strong>Eventual:</Strong> Everyone sees latest data... eventually (fast, cheap)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Partitioning/Sharding:</Strong> Split data across databases
              <UL>
                <LI>Example: Users A-M on DB1, N-Z on DB2</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Replication:</Strong> Copy data to multiple servers
              <UL>
                <LI>Primary (writes) + Read replicas (reads only)</LI>
              </UL>
            </LI>
          </UL>

          <Divider />

          <H2>Patterns (Reusable Solutions)</H2>

          <UL>
            <LI>
              <Strong>Cache-aside:</Strong> App checks cache first, database on miss
              <UL>
                <LI>When to use: Read-heavy workloads (90%+ reads)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Write-through:</Strong> Write to cache + database simultaneously
              <UL>
                <LI>When to use: Need strong consistency</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Single-leader replication:</Strong> 1 primary (writes), many replicas (reads)
              <UL>
                <LI>When to use: Read-heavy, strong consistency on writes</LI>
              </UL>
            </LI>
          </UL>

          <InfoBox type="tip">
            <P>
              <Strong>Don't memorize everything!</Strong> You'll learn each term in detail
              through lessons and practice. This is just a reference guide.
            </P>
          </InfoBox>
        </Section>
      ),
      keyPoints: [
        'Understanding terminology helps communicate designs',
        'Metrics help quantify system requirements',
        'Patterns are reusable solutions to common problems',
      ],
    },

    // NEW: Trade-Off Thinking Section
    {
      id: 'tradeoff-thinking',
      type: 'concept',
      title: 'Trade-Off Thinking: The Heart of System Design',
      description: 'Learn to make informed trade-off decisions',
      estimatedMinutes: 8,
      content: (
        <Section>
          <H1>Trade-Off Thinking: The Heart of System Design</H1>

          <P>
            <Strong>The most important lesson in system design:</Strong> There is no perfect system. Every decision is a trade-off.
          </P>

          <KeyPoint>
            <Strong>Core principle:</Strong> You can't optimize for everything. When you gain something, you give up something else.
          </KeyPoint>

          <Divider />

          <H2>The Classic Trade-Offs</H2>

          <ComparisonTable
            headers={['Trade-Off', 'Option A', 'Option B', 'Choose Based On']}
            rows={[
              [
                'Speed vs Freshness',
                'Cache (fast, stale data)',
                'Database (slow, fresh data)',
                'Can users tolerate 60s stale data?'
              ],
              [
                'Consistency vs Availability',
                'CP: Always consistent, may go down',
                'AP: Always available, may be inconsistent',
                'Is downtime worse than stale data?'
              ],
              [
                'Simple vs Scalable',
                'Single server (simple, limited scale)',
                'Distributed (complex, unlimited scale)',
                'Do you have <10k RPS or >100k RPS?'
              ],
              [
                'Cost vs Performance',
                'Cheap (slow, limited resources)',
                'Expensive (fast, ample resources)',
                'What\'s your budget vs performance needs?'
              ],
              [
                'Build vs Buy',
                'Build (flexible, time-consuming)',
                'Buy/SaaS (quick, vendor lock-in)',
                'Do you need customization or speed-to-market?'
              ]
            ]}
          />

          <Divider />

          <H2>🎯 Example: Adding a Cache</H2>

          <P><Strong>Decision:</Strong> Should I add Redis cache to my application?</P>

          <Example title="What You Gain">
            <UL>
              <LI>✅ <Strong>Speed:</Strong> 10-50x faster reads (2ms vs 20ms)</LI>
              <LI>✅ <Strong>Database relief:</Strong> 90% fewer database queries</LI>
              <LI>✅ <Strong>Better UX:</Strong> Pages load faster</LI>
              <LI>✅ <Strong>Cost savings:</Strong> Can use smaller database</LI>
            </UL>
          </Example>

          <Example title="What You Give Up">
            <UL>
              <LI>❌ <Strong>Freshness:</Strong> Data may be stale (cache not updated immediately)</LI>
              <LI>❌ <Strong>Complexity:</Strong> Cache invalidation is hard ("2 hard problems in CS")</LI>
              <LI>❌ <Strong>Cost:</Strong> Redis server costs $100-500/mo</LI>
              <LI>❌ <Strong>Memory:</Strong> Cache takes RAM, limited capacity</LI>
              <LI>❌ <Strong>Failure mode:</Strong> If cache crashes, system slower</LI>
            </UL>
          </Example>

          <P><Strong>Decision framework:</Strong></P>
          <CodeBlock>
{`If (read-heavy workload AND staleness acceptable AND have budget):
    → Add cache (gains outweigh costs)
Else:
    → Don't add cache (costs outweigh gains)`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Example: Horizontal vs Vertical Scaling</H2>

          <P><Strong>Decision:</Strong> Traffic growing from 5k RPS to 20k RPS. How to scale?</P>

          <ComparisonTable
            headers={['Factor', 'Vertical (Bigger Server)', 'Horizontal (More Servers)', 'Winner?']}
            rows={[
              ['Max capacity', 'Limited (64 cores max)', 'Unlimited (add servers)', 'Horizontal'],
              ['Implementation time', 'Fast (restart with more RAM)', 'Slow (setup LB, distribute)', 'Vertical'],
              ['Cost @ 20k RPS', '$800/mo (single big server)', '$600/mo (6 small servers)', 'Horizontal'],
              ['Complexity', 'Low (single machine)', 'High (distributed state)', 'Vertical'],
              ['High Availability', 'No (single point of failure)', 'Yes (1 server fails = 83% up)', 'Horizontal'],
              ['When to fail?', 'Works until 64 cores (then stuck)', 'Works forever (keep adding)', 'Horizontal']
            ]}
          />

          <P><Strong>The Trade-Off:</Strong></P>
          <UL>
            <LI><Strong>Short-term:</Strong> Vertical scaling wins (faster, simpler, cheaper)</LI>
            <LI><Strong>Long-term:</Strong> Horizontal scaling wins (unlimited capacity, HA, no ceiling)</LI>
          </UL>

          <KeyPoint>
            <Strong>Real-world approach:</Strong> Start vertical (simpler), switch to horizontal when you hit limits (~10k RPS) or need HA. Don't over-engineer early!
          </KeyPoint>

          <Divider />

          <H2>🎯 Example: Strong vs Eventual Consistency</H2>

          <P><Strong>Scenario:</Strong> Social media app with user profile photos</P>

          <ComparisonTable
            headers={['Approach', 'User Experience', 'Performance', 'Cost']}
            rows={[
              [
                'Strong Consistency\n(Wait for all replicas)',
                'User always sees latest photo\n(Refresh = latest)',
                'Slow writes (110ms)\nWait for sync',
                'High\n(synchronous replication)'
              ],
              [
                'Eventual Consistency\n(Update replicas async)',
                'User might see old photo for 1-2 sec\n(Then latest)',
                'Fast writes (10ms)\nNo waiting',
                'Low\n(async replication)'
              ]
            ]}
          />

          <P><Strong>The Trade-Off:</Strong></P>
          <UL>
            <LI><Strong>Strong consistency:</Strong> Correct BUT slow</LI>
            <LI><Strong>Eventual consistency:</Strong> Fast BUT might show stale data briefly</LI>
          </UL>

          <P><Strong>What Instagram chose:</Strong> Eventual consistency</P>
          <UL>
            <LI>✅ 11x faster writes (better UX)</LI>
            <LI>❌ Rare edge case: see old photo for 1-2 seconds (acceptable!)</LI>
          </UL>

          <KeyPoint>
            <Strong>Lesson:</Strong> Profile photos aren't life-or-death. 1-2 seconds of staleness is acceptable for 11x performance gain.
          </KeyPoint>

          <Divider />

          <H2>How to Think About Trade-Offs</H2>

          <P><Strong>Step 1: Ask "What are my requirements?"</Strong></P>
          <UL>
            <LI>Is this financial data (strict consistency) or social media (eventual OK)?</LI>
            <LI>Do I have 1,000 RPS or 100,000 RPS?</LI>
            <LI>Can users tolerate 60s stale data or need real-time?</LI>
            <LI>What's my budget: $100/mo or $10,000/mo?</LI>
          </UL>

          <P><Strong>Step 2: Ask "What am I giving up?"</Strong></P>
          <UL>
            <LI>If I cache: I gain speed, I lose freshness</LI>
            <LI>If I horizontal scale: I gain capacity, I lose simplicity</LI>
            <LI>If I choose AP: I gain availability, I lose consistency</LI>
          </UL>

          <P><Strong>Step 3: Ask "Is the trade-off worth it?"</Strong></P>
          <UL>
            <LI>For TinyURL: Cache staleness is fine (URLs never change) → Cache!</LI>
            <LI>For banking: Consistency is critical (money is at stake) → Strong consistency!</LI>
            <LI>For startup: Simplicity matters more than scale → Start vertical!</LI>
          </UL>

          <Divider />

          <H2>Common Mistakes</H2>

          <Example title="❌ Mistake 1: Optimizing prematurely">
            <P>
              <Strong>Wrong:</Strong> "Let's use Kafka for 100 requests/day because it's what Netflix uses!"
            </P>
            <P>
              <Strong>Right:</Strong> "We have 100 requests/day. A simple queue (Redis List) is fine. If we grow to 100k/day, we'll switch to Kafka."
            </P>
            <P>
              <Strong>Trade-off insight:</Strong> Netflix needs Kafka's scale. You need simplicity. Don't copy solutions without understanding trade-offs.
            </P>
          </Example>

          <Example title="❌ Mistake 2: Ignoring business context">
            <P>
              <Strong>Wrong:</Strong> "We need 5 nines availability (99.999%) because that's industry standard!"
            </P>
            <P>
              <Strong>Right:</Strong> "We're a blog with 1,000 daily users. 99.9% (8 hours downtime/year) is fine and costs 10x less than 5 nines."
            </P>
            <P>
              <Strong>Trade-off insight:</Strong> 5 nines costs $50,000/year. 3 nines costs $5,000/year. What's the business impact of 8 hours downtime?
            </P>
          </Example>

          <Example title="❌ Mistake 3: Not asking 'Why not X?'">
            <P>
              <Strong>Wrong:</Strong> "Let's use PostgreSQL!" (without considering why NOT MongoDB)
            </P>
            <P>
              <Strong>Right:</Strong> "PostgreSQL gives us ACID, but MongoDB gives us schema flexibility. We need ACID for inventory, so PostgreSQL wins."
            </P>
            <P>
              <Strong>Trade-off insight:</Strong> Always articulate what you're giving up by NOT choosing the alternative.
            </P>
          </Example>

          <Divider />

          <H2>Key Principles</H2>

          <KeyPoint>
            <Strong>1. There are no silver bullets</Strong>
            <P>Every technology, pattern, and architecture has trade-offs. The best solution depends on YOUR specific requirements.</P>
          </KeyPoint>

          <KeyPoint>
            <Strong>2. Optimize for your bottleneck</Strong>
            <P>If reads are your problem, optimize reads (cache). If writes are your problem, optimize writes (sharding). Don't optimize everything.</P>
          </KeyPoint>

          <KeyPoint>
            <Strong>3. Start simple, scale when needed</Strong>
            <P>A single server is fine for 99% of startups. Don't build for Netflix scale on day one. Trade complexity for simplicity early on.</P>
          </KeyPoint>

          <KeyPoint>
            <Strong>4. Business requirements drive technical decisions</Strong>
            <P>Banking app needs strong consistency (money!). Social media accepts eventual consistency (likes can be stale). Requirements {'>'} technology preferences.</P>
          </KeyPoint>

          <P>
            <Strong>Remember:</Strong> System design interviews don't have "right answers" - they have "well-reasoned trade-offs". Your job is to understand WHEN to use WHAT and WHY.
          </P>
        </Section>
      ),
      keyPoints: [
        'Every technical decision involves trade-offs - you gain something and lose something',
        'No perfect system - optimize based on YOUR requirements, not others\'',
        'Always ask: What am I giving up? Is it worth what I\'m gaining?',
        'Start simple, add complexity only when necessary',
      ],
    },

    // NEW: Mini-Exercise 3 - Trade-offs
    {
      id: 'practice-tradeoffs',
      type: 'quiz',
      title: 'Mini-Exercise: Understanding Trade-offs',
      description: 'System design is all about trade-offs - practice thinking about them',
      estimatedMinutes: 4,
      questions: [
        {
          id: 'tradeoff-1',
          question: 'You add Redis cache to speed up reads. What is the TRADE-OFF?',
          type: 'multiple_choice',
          options: [
            'Faster reads, but cache costs memory and may serve stale data',
            'Faster reads, no downsides',
            'Slower reads, higher cost',
            'Database becomes unnecessary'
          ],
          correctAnswer: 'Faster reads, but cache costs memory and may serve stale data',
          explanation: 'Trade-off: Speed vs Freshness + Cost. Cache is 10x faster BUT costs memory AND might show old data. There are no free lunches in system design!',
          points: 10
        },
        {
          id: 'tradeoff-2',
          question: 'Which statement best describes horizontal scaling trade-offs?',
          type: 'multiple_choice',
          options: [
            'More servers = higher capacity, but more cost and complexity',
            'More servers = perfect solution with no downsides',
            'More servers = lower cost',
            'More servers = slower performance'
          ],
          correctAnswer: 'More servers = higher capacity, but more cost and complexity',
          explanation: 'More servers can handle more traffic (good!) but costs more money and adds complexity like load balancing, coordination (bad!).',
          points: 10
        },
        {
          id: 'tradeoff-3',
          question: '99.999% availability (5 nines) vs 99.9% availability (3 nines). What\'s the trade-off?',
          type: 'multiple_choice',
          options: [
            '5 nines = 5 min downtime/year but costs 10x more than 3 nines',
            '5 nines = cheaper and better',
            '5 nines = more downtime',
            '3 nines = more expensive'
          ],
          correctAnswer: '5 nines = 5 min downtime/year but costs 10x more than 3 nines',
          explanation: 'Higher availability = less downtime BUT much higher cost (redundancy, monitoring, failover). 5 nines costs 10-100x more than 3 nines!',
          points: 10
        }
      ],
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true
    },

    {
      id: 'intro-quiz',
      type: 'quiz',
      title: 'Final Knowledge Check',
      description: 'Test your overall understanding',
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
          explanation: 'System design focuses on architecture, components, and trade-offs, not just code implementation.',
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
          explanation: 'Sorting algorithms are data structure/algorithm problems, not system design problems which focus on distributed systems.',
          points: 10,
        },
        {
          id: 'q3',
          question: 'In a system design interview, what should you do FIRST after hearing the problem?',
          type: 'multiple_choice',
          options: [
            'Start drawing diagrams',
            'Ask clarifying questions about scale and requirements',
            'Write code',
            'Discuss specific technologies (Redis, PostgreSQL, etc.)'
          ],
          correctAnswer: 'Ask clarifying questions about scale and requirements',
          explanation: 'Always clarify requirements FIRST! 100 users vs 100M users = completely different designs. Never assume scale or requirements.',
          points: 10
        }
      ],
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true,
    },

    // NEW: Next steps
    {
      id: 'intro-next-steps',
      type: 'concept',
      title: 'Your Learning Path',
      description: 'What to learn next',
      estimatedMinutes: 2,
      content: (
        <Section>
          <H1>Congratulations! 🎉</H1>

          <P>You've completed the introduction to system design! You now understand:</P>

          <UL>
            <LI>✅ What system design is and why it matters</LI>
            <LI>✅ Common problems (URL shorteners, social feeds, etc.)</LI>
            <LI>✅ How to approach system design interviews</LI>
            <LI>✅ Basic terminology (components, metrics, patterns)</LI>
            <LI>✅ Trade-off thinking (speed vs cost, reliability vs complexity)</LI>
          </UL>

          <Divider />

          <H2>Recommended Learning Path</H2>

          <OL>
            <LI>
              <Strong>Next Lesson: Basic Components</Strong>
              <UL>
                <LI>Learn about client, server, database, cache, load balancer in detail</LI>
                <LI>Practice placing components on canvas</LI>
                <LI>Understand when to use each component</LI>
              </UL>
            </LI>
            <LI>
              <Strong>Then: NFR Fundamentals</Strong>
              <UL>
                <LI>Calculate how many servers you need for given traffic</LI>
                <LI>Understand throughput, latency, capacity planning</LI>
                <LI>Practice handling peak vs average load</LI>
              </UL>
            </LI>
            <LI>
              <Strong>After Basics: Try Your First Challenge!</Strong>
              <UL>
                <LI><Strong>TinyURL (Beginner):</Strong> Perfect first challenge</LI>
                <LI>Apply what you learned: components, caching, capacity</LI>
                <LI>See your design perform with traffic simulation</LI>
              </UL>
            </LI>
          </OL>

          <Divider />

          <InfoBox type="success">
            <P><Strong>Pro tip:</Strong> Don't rush through lessons to get to challenges!</P>
            <P>Each lesson builds on the previous one. Taking time to understand fundamentals
            will make challenges much easier and more enjoyable.</P>
          </InfoBox>

          <H2>Keep Practicing!</H2>

          <P>System design is a skill that improves with practice. The more systems you design, the better you'll become at:</P>

          <UL>
            <LI>🧠 Recognizing patterns</LI>
            <LI>⚡ Making quick trade-off decisions</LI>
            <LI>🎯 Estimating capacity needs</LI>
            <LI>💡 Thinking about edge cases and failures</LI>
          </UL>

          <KeyPoint>
            <Strong>You've got this!</Strong> Start with the basics, practice regularly,
            and soon you'll be designing systems like a pro. Ready for the next lesson?
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'System design is learned through practice',
        'Start with fundamentals before tackling challenges',
        'Each lesson builds on previous knowledge',
      ],
    }
  ],
};
