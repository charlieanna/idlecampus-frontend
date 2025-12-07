import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Global DNS Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching DNS fundamentals through building
 * a global DNS infrastructure for a SaaS platform.
 *
 * Flow:
 * Phase 0: Requirements gathering (latency, failover, geo-routing)
 * Steps 1-3: Basic DNS setup (nameserver, zone files, basic resolution)
 * Steps 4-6: GeoDNS, health checks, TTL optimization
 *
 * Key Pedagogy: First make it WORK, then make it GLOBAL, then make it RESILIENT
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const globalDnsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a global DNS infrastructure for a SaaS platform",

  interviewer: {
    name: 'Maria Santos',
    role: 'Principal Infrastructure Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-dns-operation',
      category: 'functional',
      question: "What is the main job of this DNS system?",
      answer: "When users type 'app.yourservice.com' in their browser, the DNS system needs to:\n1. **Resolve the domain** to an IP address (like 192.0.2.1)\n2. **Return the IP** to the user's browser\n3. **Do it fast** - DNS is on the critical path for every request\n\nThis is the fundamental operation: domain name → IP address mapping.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "DNS is the internet's phone book - it translates human-readable names to machine-readable IP addresses",
    },
    {
      id: 'geographic-routing',
      category: 'functional',
      question: "Your SaaS platform has servers in US, Europe, and Asia. How should DNS help with this?",
      answer: "DNS should do **GeoDNS** - smart routing based on user location:\n- User in Tokyo asks for 'app.yourservice.com' → Get Asia server IP (13.x.x.x)\n- User in London asks for 'app.yourservice.com' → Get EU server IP (18.x.x.x)\n- User in NYC asks for 'app.yourservice.com' → Get US server IP (3.x.x.x)\n\nThis reduces latency by routing users to the nearest datacenter.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "GeoDNS enables global applications by routing users to the nearest datacenter",
    },
    {
      id: 'health-aware-routing',
      category: 'functional',
      question: "What happens if your US-East datacenter goes down?",
      answer: "DNS needs **health-aware failover**:\n1. Continuously health-check all datacenter endpoints\n2. If US-East fails health checks, automatically remove it from DNS responses\n3. Route US-East traffic to healthy US-West or other regions\n4. When US-East recovers, automatically add it back\n\nUsers should never get IPs for unhealthy servers.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Health-aware DNS prevents routing users to failed servers",
    },

    // IMPORTANT - Clarifications
    {
      id: 'ttl-strategy',
      category: 'clarification',
      question: "DNS responses get cached by browsers and ISPs. How long should they cache for?",
      answer: "This is the **TTL** (Time To Live) tradeoff:\n- **High TTL** (1 hour): Less DNS load, but slower failover (users stuck with stale IPs)\n- **Low TTL** (60 seconds): Fast failover, but more DNS queries (higher cost)\n\nFor a global SaaS needing fast failover, use **60-300 second TTL**. This balances quick recovery with reasonable query volume.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "TTL is a tradeoff between cache efficiency and agility to change",
    },
    {
      id: 'dns-records',
      category: 'clarification',
      question: "What types of DNS records do you need to support?",
      answer: "For a SaaS platform, we need:\n- **A records**: Domain → IPv4 address (most common)\n- **AAAA records**: Domain → IPv6 address\n- **CNAME records**: Alias one domain to another (www.example.com → example.com)\n- **MX records** (optional): For email routing\n\nFocus on A records for the MVP, add others as needed.",
      importance: 'important',
      insight: "A records are the core - they map names to IPs",
    },
    {
      id: 'dns-propagation',
      category: 'clarification',
      question: "When you update a DNS record, how quickly do users see the change?",
      answer: "This depends on TTL:\n- If TTL is 300 seconds, changes take up to 5 minutes to propagate\n- **Propagation time** = TTL + resolver cache behavior\n- Some resolvers ignore TTL and cache longer (aggressive caching)\n\nPlan for **2x TTL** for full propagation in practice.",
      importance: 'nice-to-have',
      insight: "DNS changes aren't instant - plan deployments accordingly",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT (First - tells you the scale)
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many DNS queries should the system handle?",
      answer: "100 million users globally, each making ~5 DNS queries per hour on average",
      importance: 'critical',
      calculation: {
        formula: "100M users × 5 queries/hour ÷ 3600 sec = 138,889 queries/sec average",
        result: "~139K queries/sec average, ~417K at 3x peak",
      },
      learningPoint: "DNS query volume is MASSIVE at scale",
    },
    {
      id: 'throughput-geographic',
      category: 'throughput',
      question: "How is the traffic distributed geographically?",
      answer: "- 40% North America\n- 35% Europe\n- 20% Asia\n- 5% Rest of World\n\nThis means you need DNS presence in all major regions with capacity proportional to traffic.",
      importance: 'critical',
      learningPoint: "Global traffic requires regional DNS distribution",
    },

    // 2. LATENCY (Second - DNS is latency-critical)
    {
      id: 'latency-resolution',
      category: 'latency',
      question: "What's the acceptable latency for DNS resolution?",
      answer: "p99 DNS query latency should be under **50ms**. DNS is on the critical path - every millisecond adds to page load time.",
      importance: 'critical',
      learningPoint: "DNS latency directly impacts user experience - it must be fast",
    },
    {
      id: 'latency-global',
      category: 'latency',
      question: "Users are worldwide. How do you ensure low latency everywhere?",
      answer: "Deploy **authoritative nameservers in multiple regions**:\n- Anycast routing sends queries to nearest nameserver\n- US users hit US nameservers\n- EU users hit EU nameservers\n- Asia users hit Asia nameservers\n\nThis ensures sub-50ms response times globally.",
      importance: 'critical',
      insight: "DNS latency comes from network distance - deploy close to users",
    },

    // 3. AVAILABILITY (Third - DNS failures are catastrophic)
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What availability do you need for DNS?",
      answer: "DNS needs **99.99%+ availability** (four nines). If DNS is down, your entire service is unreachable.\n\nThis means:\n- Multiple redundant nameservers per region\n- No single points of failure\n- Automatic failover",
      importance: 'critical',
      calculation: {
        formula: "99.99% = 52 minutes downtime per year",
        result: "DNS can only be down ~4 minutes per month",
      },
      learningPoint: "DNS is critical infrastructure - higher availability than your app servers",
    },
    {
      id: 'failover-speed',
      category: 'availability',
      question: "How quickly should DNS failover when a datacenter goes down?",
      answer: "With health checks every 10 seconds and TTL of 60 seconds:\n- Detection: 10-20 seconds (health check)\n- Propagation: 60 seconds (TTL)\n- **Total failover time**: ~90 seconds\n\nThis is acceptable for most SaaS platforms.",
      importance: 'important',
      insight: "Failover time = health check interval + TTL",
    },

    // 4. PAYLOAD (Fourth - affects bandwidth)
    {
      id: 'payload-size',
      category: 'payload',
      question: "How big is a typical DNS query and response?",
      answer: "- DNS query: ~50 bytes (domain name)\n- DNS response: ~100-200 bytes (IP addresses + metadata)\n\nDNS uses UDP for speed - packets are tiny and fast.",
      importance: 'nice-to-have',
      calculation: {
        formula: "417K queries/sec × 150 bytes = 62.5 MB/sec",
        result: "~500 Mbps bandwidth at peak",
      },
      insight: "DNS bandwidth is low despite high query volume",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-dns-operation', 'geographic-routing', 'health-aware-routing'],
  criticalFRQuestionIds: ['core-dns-operation', 'geographic-routing', 'health-aware-routing', 'ttl-strategy'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-resolution', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Resolve domain names to IP addresses',
      description: 'DNS nameserver responds to queries with A records',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Geographic-aware routing (GeoDNS)',
      description: 'Route users to nearest datacenter based on location',
      emoji: '🌍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Health-aware failover',
      description: 'Automatically remove unhealthy endpoints from DNS responses',
      emoji: '💚',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Configurable TTL',
      description: 'Control DNS caching behavior with TTL settings',
      emoji: '⏰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: 'Few hundred DNS record updates',
    readsPerDay: '~12 billion DNS queries',
    peakMultiplier: 3,
    readWriteRatio: '100000000:1',
    calculatedWriteRPS: { average: 1, peak: 3 },
    calculatedReadRPS: { average: 138889, peak: 416667 },
    maxPayloadSize: '~200 bytes',
    storagePerRecord: '~500 bytes per DNS record',
    storageGrowthPerYear: 'Negligible (~1GB)',
    redirectLatencySLA: 'p99 < 50ms',
    createLatencySLA: 'p99 < 1s',
  },

  architecturalImplications: [
    '✅ 417K queries/sec → Need distributed nameservers',
    '✅ p99 < 50ms → Regional deployment with Anycast',
    '✅ 99.99% availability → Multiple redundant nameservers',
    '✅ GeoDNS → Route based on client location',
    '✅ Health checks → Automatic endpoint failover',
    '✅ Low TTL (60-300s) → Fast propagation for changes',
  ],

  outOfScope: [
    'DNSSEC (security extensions)',
    'Dynamic DNS (DynDNS)',
    'DNS-based load balancing with weights',
    'Private DNS (internal networks)',
  ],

  keyInsight: "First, let's make DNS WORK. We'll build a simple nameserver that resolves queries. Then we'll make it GLOBAL with GeoDNS. Finally, we'll make it RESILIENT with health checks and failover. Functionality first!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to DNS Nameserver
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome! You're building a DNS system for a global SaaS platform.",
  hook: "When users type 'app.yourservice.com', they need an IP address to connect to. That's DNS's job!",
  challenge: "Set up the basic flow: Client needs to query a DNS nameserver.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your DNS system is online!",
  achievement: "Clients can now send DNS queries to your nameserver",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can resolve queries', after: '✓' },
  ],
  nextTeaser: "But the nameserver doesn't know where to store DNS records...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: DNS Nameserver',
  conceptExplanation: `Every DNS system needs a **nameserver** - the service that answers DNS queries.

When a user's browser wants to visit app.yourservice.com:
1. Browser sends DNS query: "What's the IP for app.yourservice.com?"
2. Your **nameserver** looks up the record
3. Nameserver responds: "It's 192.0.2.1"
4. Browser connects to 192.0.2.1

This is called **DNS resolution** - converting names to IPs.`,

  whyItMatters: 'Without DNS, users would have to remember IP addresses like 192.0.2.1 instead of friendly names like app.yourservice.com',

  keyPoints: [
    'Nameserver is the server that answers DNS queries',
    'Client sends query, nameserver sends response',
    'This happens before every HTTP request',
    'DNS is on the critical path - must be fast!',
  ],

  diagram: `
┌─────────────┐       Query       ┌─────────────────┐
│   Client    │ ───────────────→  │   Nameserver    │
│  (Browser)  │                   │   (DNS Server)  │
│             │ ◀─────────────    │                 │
└─────────────┘    IP Response    └─────────────────┘
`,

  keyConcepts: [
    {
      title: 'DNS Query',
      explanation: 'Client asks: "What IP is app.yourservice.com?"',
      icon: '❓',
    },
    {
      title: 'DNS Response',
      explanation: 'Nameserver answers: "It\'s 192.0.2.1"',
      icon: '💡',
    },
    {
      title: 'Nameserver',
      explanation: 'The service that stores and returns DNS records',
      icon: '🗄️',
    },
  ],

  quickCheck: {
    question: 'What does a DNS nameserver do?',
    options: [
      'Hosts your website',
      'Answers DNS queries with IP addresses',
      'Balances traffic across servers',
      'Caches frequently accessed data',
    ],
    correctIndex: 1,
    explanation: 'The nameserver receives DNS queries and responds with IP addresses from DNS records.',
  },
};

const step1: GuidedStep = {
  id: 'global-dns-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can send DNS queries to the system',
    taskDescription: 'Add Client and DNS Nameserver, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Answers DNS queries', displayName: 'DNS Nameserver' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Users send DNS queries' },
    ],
    successCriteria: ['Add Client', 'Add DNS Nameserver', 'Connect Client → DNS Nameserver'],
  },
  validation: {
    requiredComponents: ['client', 'dns_server'],
    requiredConnections: [{ fromType: 'client', toType: 'dns_server' }],
  },
  hints: {
    level1: 'First add Client, then add DNS Nameserver, then connect them',
    level2: 'Drag Client and DNS Nameserver from the sidebar, then drag from Client to DNS Nameserver to connect',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }],
    solutionConnections: [{ from: 'client', to: 'dns_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for DNS Records (Zone Files)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📋',
  scenario: "Your nameserver is running, but it has no records to serve!",
  hook: "When a query comes in for 'app.yourservice.com', the nameserver doesn't know what IP to return. It needs a database of DNS records (called zone files).",
  challenge: "Add a database to store DNS records persistently.",
  illustration: 'storage-needed',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: "DNS records now have a home!",
  achievement: "Nameserver can look up and return IP addresses",
  metrics: [
    { label: 'DNS records stored', after: '✓' },
    { label: 'Basic resolution working', after: '✓' },
  ],
  nextTeaser: "But every query is hitting the database - that's slow and expensive...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'DNS Records: The Data Behind Resolution',
  conceptExplanation: `DNS records (zone files) are stored in a database:

**Example DNS records**:
\`\`\`
app.yourservice.com     A     192.0.2.1      TTL: 300
www.yourservice.com     CNAME app.yourservice.com
api.yourservice.com     A     192.0.2.5      TTL: 60
\`\`\`

**Each record has**:
- **Name**: The domain (app.yourservice.com)
- **Type**: A (IPv4), AAAA (IPv6), CNAME (alias)
- **Value**: The IP address or target
- **TTL**: How long clients can cache this record (seconds)

When a query comes in, the nameserver:
1. Queries the database for matching records
2. Returns the IP address(es)
3. Client caches the result for TTL seconds`,

  whyItMatters: 'Without persistent storage, DNS records would be lost on restart. The database is the source of truth.',

  realWorldExample: {
    company: 'AWS Route 53',
    scenario: 'Managing billions of DNS records',
    howTheyDoIt: 'Uses distributed database (likely DynamoDB) to store zone files, with multi-region replication for durability.',
  },

  keyPoints: [
    'DNS records map domain names to IP addresses',
    'TTL controls how long clients cache responses',
    'Database stores zone files persistently',
    'Nameserver queries DB for each lookup',
  ],

  diagram: `
┌──────────┐   Query    ┌─────────────┐   Lookup   ┌──────────┐
│  Client  │ ────────→  │ Nameserver  │ ─────────→ │ Database │
└──────────┘            └─────────────┘            │ (Records)│
                              ↓                     └──────────┘
                         Returns IP
`,

  keyConcepts: [
    { title: 'A Record', explanation: 'Maps domain to IPv4 address', icon: '🔗' },
    { title: 'TTL', explanation: 'Time-To-Live: how long to cache (seconds)', icon: '⏰' },
    { title: 'Zone File', explanation: 'Collection of DNS records for a domain', icon: '📋' },
  ],

  quickCheck: {
    question: 'What is TTL in DNS?',
    options: [
      'The time it takes to resolve a query',
      'How long clients can cache the DNS response',
      'The database query timeout',
      'Time To Load the webpage',
    ],
    correctIndex: 1,
    explanation: 'TTL (Time-To-Live) tells clients and resolvers how long they can cache the DNS response before querying again.',
  },
};

const step2: GuidedStep = {
  id: 'global-dns-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'DNS records must be stored persistently',
    taskDescription: 'Build Client → DNS Nameserver → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Answers DNS queries', displayName: 'DNS Nameserver' },
      { type: 'database', reason: 'Stores DNS records (zone files)', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Users send queries' },
      { from: 'DNS Nameserver', to: 'Database', reason: 'Nameserver looks up records' },
    ],
    successCriteria: ['Add Client, DNS Nameserver, Database', 'Connect Client → Nameserver → Database'],
  },
  validation: {
    requiredComponents: ['client', 'dns_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns_server' },
      { fromType: 'dns_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → DNS Nameserver → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'dns_server' }, { from: 'dns_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Cache for Faster Resolution
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your DNS system works! But users are complaining about slow responses.",
  hook: "Every DNS query hits the database - that's 10-50ms per lookup. For popular domains queried thousands of times per second, this is wasteful and slow!",
  challenge: "Add a cache to store frequently queried DNS records in memory.",
  illustration: 'slow-database',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "DNS queries are now lightning fast!",
  achievement: "Cache hits respond in sub-millisecond time",
  metrics: [
    { label: 'Query latency', before: '20ms', after: '1ms' },
    { label: 'Database load', before: '100K queries/sec', after: '5K queries/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Great! But users in Asia are still experiencing high latency...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'DNS Caching: Speed Through Memory',
  conceptExplanation: `DNS is **extremely read-heavy** - the same domains are queried millions of times.

**Why cache DNS records?**
- Database query: 10-50ms
- Cache lookup: < 1ms
- **10-50x faster!**

**How DNS caching works**:
1. Query comes in for app.yourservice.com
2. Check cache: Is it there?
3. **Cache HIT**: Return immediately (< 1ms)
4. **Cache MISS**: Query database, cache result, return (20ms)

**Cache TTL management**:
- Store records in cache for the DNS record's TTL
- When TTL expires, evict from cache
- Next query repopulates the cache

**The 80/20 rule**: 20% of domains get 80% of queries - these stay hot in cache!`,

  whyItMatters: 'Without caching, every DNS query hits the database. At 100K+ QPS, the database becomes the bottleneck.',

  realWorldExample: {
    company: 'Cloudflare DNS (1.1.1.1)',
    scenario: 'Handling 500+ billion DNS queries per day',
    howTheyDoIt: 'Aggressive caching at edge with Redis. Popular domains are cached globally, reducing origin queries by 99%+.',
  },

  famousIncident: {
    title: 'Dyn DNS DDoS Attack',
    company: 'Dyn',
    year: '2016',
    whatHappened: 'A massive DDoS attack overwhelmed Dyn\'s DNS servers with 1.2 Tbps of traffic. Major sites like Twitter, Netflix, Reddit went down for hours. The attack flooded DNS servers faster than they could respond.',
    lessonLearned: 'DNS infrastructure needs massive caching and DDoS protection. Cache absorbs query floods. Distributed architecture prevents single points of failure.',
    icon: '🌊',
  },

  keyPoints: [
    'Cache stores frequently queried records in memory',
    'Cache hit = sub-millisecond response',
    'Cache miss = query DB + populate cache',
    'Respect TTL - evict expired records',
    '95%+ cache hit rate is achievable',
  ],

  diagram: `
                          ┌─────────────┐
                   ┌────→ │    Cache    │ ← < 1ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │──→ │    DNS   │      │ miss?
└────────┘    │Nameserver│      ▼
              └────┬─────┘┌─────────────┐
                   └────→ │  Database   │ ← 20ms
                          └─────────────┘
`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Record found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Record not in cache - query database', icon: '❌' },
    { title: 'Cache TTL', explanation: 'Respects DNS record TTL for eviction', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why is caching critical for DNS?',
    options: [
      'To reduce network bandwidth',
      'Same domains are queried millions of times - cache avoids DB load',
      'To provide encryption',
      'To store DNS records permanently',
    ],
    correctIndex: 1,
    explanation: 'DNS is extremely read-heavy. Popular domains are queried constantly - caching avoids hitting the database millions of times.',
  },
};

const step3: GuidedStep = {
  id: 'global-dns-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'DNS queries must be fast (p99 < 50ms)',
    taskDescription: 'Build Client → DNS Nameserver → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Answers DNS queries', displayName: 'DNS Nameserver' },
      { type: 'database', reason: 'Stores DNS records', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot DNS records', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Users send queries' },
      { from: 'DNS Nameserver', to: 'Database', reason: 'Nameserver queries DB on cache miss' },
      { from: 'DNS Nameserver', to: 'Cache', reason: 'Nameserver checks cache first' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect Nameserver to both Database and Cache'],
  },
  validation: {
    requiredComponents: ['client', 'dns_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns_server' },
      { fromType: 'dns_server', toType: 'database' },
      { fromType: 'dns_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with a Cache for fast lookups',
    level2: 'Add Client, DNS Nameserver, Database, and Cache - connect Nameserver to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'dns_server' },
      { from: 'dns_server', to: 'database' },
      { from: 'dns_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 4: GeoDNS - Route Based on User Location
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌏',
  scenario: "Your SaaS platform now has datacenters in US, Europe, and Asia!",
  hook: "But users in Tokyo are being routed to your US servers - that's 200ms of latency! DNS is returning the same US IP to everyone, regardless of location.",
  challenge: "Implement GeoDNS - return different IPs based on where the user is querying from.",
  illustration: 'global-latency',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Users are now routed to their nearest datacenter!",
  achievement: "GeoDNS reduces global latency by 70%",
  metrics: [
    { label: 'Asia latency', before: '200ms', after: '20ms' },
    { label: 'Europe latency', before: '150ms', after: '15ms' },
    { label: 'User satisfaction', after: '📈' },
  ],
  nextTeaser: "But what happens when a datacenter goes down?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'GeoDNS: Smart Geographic Routing',
  conceptExplanation: `**GeoDNS** (Geographic DNS) routes users to the nearest datacenter based on their location.

**How it works**:
1. Query arrives from IP address in Tokyo
2. DNS nameserver detects: "This IP is in Asia"
3. Returns Asia datacenter IP: 13.x.x.x
4. User connects to nearby server - low latency!

**Without GeoDNS**:
- Tokyo user → US server: 200ms latency
- London user → US server: 150ms latency

**With GeoDNS**:
- Tokyo user → Asia server: 20ms latency
- London user → EU server: 15ms latency

**Implementation**:
- Use **GeoIP database** to map IP → location
- Configure **location-specific records**:
  - app.yourservice.com → 3.x.x.x (US users)
  - app.yourservice.com → 18.x.x.x (EU users)
  - app.yourservice.com → 13.x.x.x (Asia users)`,

  whyItMatters: 'For global applications, network latency dominates response time. GeoDNS routes users to the nearest datacenter, reducing latency by 70-90%.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Streaming to 200M+ users globally',
    howTheyDoIt: 'Uses GeoDNS with AWS Route 53 to route users to the nearest CDN edge server. A user in Mumbai gets routed to Asia servers, not US servers.',
  },

  keyPoints: [
    'GeoDNS detects user location from IP address',
    'Returns datacenter IP closest to user',
    'Dramatically reduces latency for global users',
    'Same domain, different IPs per region',
    'Requires GeoIP database and location-aware nameserver',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│              GEODNS ROUTING                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  User in Tokyo                                   │
│  ┌────────┐   Query app.com    ┌──────────┐    │
│  │ Client │ ──────────────────→ │   DNS    │    │
│  └────────┘                     │  Server  │    │
│                                 └────┬─────┘    │
│                     Detects: Asia    │          │
│                     Returns: 13.x.x.x│          │
│                                      ▼          │
│                              ┌────────────┐     │
│                              │ Asia DC    │     │
│                              │ (20ms)     │     │
│                              └────────────┘     │
│                                                  │
│  User in London                                  │
│  ┌────────┐   Query app.com    ┌──────────┐    │
│  │ Client │ ──────────────────→ │   DNS    │    │
│  └────────┘                     │  Server  │    │
│                                 └────┬─────┘    │
│                     Detects: EU      │          │
│                     Returns: 18.x.x.x│          │
│                                      ▼          │
│                              ┌────────────┐     │
│                              │ EU DC      │     │
│                              │ (15ms)     │     │
│                              └────────────┘     │
└──────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'GeoIP', explanation: 'Database mapping IP addresses to locations', icon: '🗺️' },
    { title: 'Region-specific IPs', explanation: 'Different datacenter IPs per region', icon: '🌍' },
    { title: 'Latency reduction', explanation: 'Route to nearest server for speed', icon: '⚡' },
  ],

  quickCheck: {
    question: 'What is the main benefit of GeoDNS?',
    options: [
      'Reduces database load',
      'Routes users to the nearest datacenter for lower latency',
      'Provides better security',
      'Reduces DNS query volume',
    ],
    correctIndex: 1,
    explanation: 'GeoDNS routes users to the nearest datacenter based on their location, dramatically reducing network latency.',
  },
};

const step4: GuidedStep = {
  id: 'global-dns-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-2: Route users to nearest datacenter',
    taskDescription: 'Configure GeoDNS on the DNS Nameserver',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Configure GeoDNS routing', displayName: 'DNS Nameserver' },
      { type: 'database', reason: 'Stores location-specific records', displayName: 'Database' },
      { type: 'cache', reason: 'Caches DNS records', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Global users send queries' },
      { from: 'DNS Nameserver', to: 'Database', reason: 'Nameserver queries records' },
      { from: 'DNS Nameserver', to: 'Cache', reason: 'Cache hot records' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click DNS Nameserver → Enable GeoDNS routing',
    ],
  },
  validation: {
    requiredComponents: ['client', 'dns_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns_server' },
      { fromType: 'dns_server', toType: 'database' },
      { fromType: 'dns_server', toType: 'cache' },
    ],
    requireGeoDNS: true,
  },
  hints: {
    level1: 'Build full system and enable GeoDNS on the nameserver',
    level2: 'Add all components, connect them, then click DNS Nameserver → Enable GeoDNS',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'dns_server' },
      { from: 'dns_server', to: 'database' },
      { from: 'dns_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Health Checks and Failover
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your US-East datacenter just went down!",
  hook: "DNS is still returning US-East IPs to users. They're getting connection errors. Your monitoring is exploding with alerts. Users are angry on Twitter!",
  challenge: "Implement health checks to automatically detect and fail over from unhealthy datacenters.",
  illustration: 'server-crash',
};

const step5Celebration: CelebrationContent = {
  emoji: '💚',
  message: "Your DNS system is now self-healing!",
  achievement: "Automatic failover keeps users connected during outages",
  metrics: [
    { label: 'Failover time', before: 'Manual (hours)', after: '~90 seconds' },
    { label: 'Availability', before: '99%', after: '99.95%' },
    { label: 'User impact', after: 'Minimal' },
  ],
  nextTeaser: "Great! But can we make failover even faster?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Health Checks: DNS That Self-Heals',
  conceptExplanation: `**Health-aware DNS** automatically removes unhealthy endpoints from responses.

**How it works**:
1. **Health checker** pings each datacenter every 10 seconds
2. If 3 consecutive checks fail → Mark as UNHEALTHY
3. **DNS nameserver** only returns IPs for healthy datacenters
4. When datacenter recovers → Add back to rotation

**Example failover flow**:
- US-East goes down at 3:00:00 AM
- Health check detects at 3:00:30 AM (3 failed checks)
- DNS stops returning US-East IPs at 3:00:30 AM
- Existing cached responses expire in 60 sec (TTL)
- By 3:01:30 AM, all users route to healthy datacenters

**Total failover time**: ~90 seconds

**Health check methods**:
- **HTTP**: GET /health → expect 200 OK
- **TCP**: Try to connect to port 80/443
- **ICMP**: Ping the server

**Configuration**:
- Check interval: 10 seconds
- Timeout: 5 seconds
- Failure threshold: 3 consecutive failures`,

  whyItMatters: 'Without health checks, DNS continues routing users to failed servers. With health checks, failover is automatic and fast.',

  realWorldExample: {
    company: 'AWS Route 53',
    scenario: 'Health checking millions of endpoints',
    howTheyDoIt: 'Route 53 performs health checks from multiple locations globally. If an endpoint fails checks from 2+ regions, it\'s marked unhealthy and removed from DNS responses.',
  },

  famousIncident: {
    title: 'GitHub DDoS via DNS',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub was hit by the largest DDoS attack ever (1.35 Tbps) exploiting DNS amplification. Attackers sent small DNS queries with spoofed IPs, causing DNS servers to send massive responses to GitHub, overwhelming their infrastructure.',
    lessonLearned: 'DNS is critical infrastructure but also an attack vector. Implement rate limiting, health checks, and DDoS protection. Fast failover is essential when under attack.',
    icon: '🔥',
  },

  keyPoints: [
    'Health checks continuously monitor endpoint health',
    'Unhealthy endpoints are automatically removed',
    'Failover time = detection (30s) + TTL (60s) = ~90s',
    'Lower TTL = faster failover but more DNS queries',
    'Multi-region health checks prevent false positives',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│         HEALTH-AWARE DNS FAILOVER                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────┐      Health Checks             │
│  │   Health    │                                 │
│  │  Checker    │                                 │
│  └──────┬──────┘                                 │
│         │                                        │
│    ┌────┼────┬────────────────┐                 │
│    ▼    ▼    ▼                ▼                 │
│  [US-E] [US-W] [EU]        [Asia]               │
│    ❌    ✅     ✅          ✅                    │
│   DOWN  UP     UP          UP                   │
│                                                  │
│  ┌────────────┐                                 │
│  │    DNS     │  Only returns IPs for:          │
│  │ Nameserver │  - US-West ✅                   │
│  └────────────┘  - EU ✅                        │
│         │         - Asia ✅                      │
│         ▼                                        │
│    ┌────────┐   Failover time:                  │
│    │ Client │   Detection (30s) + TTL (60s)     │
│    └────────┘   = ~90 seconds                   │
└──────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Health Check', explanation: 'Periodic probe to verify endpoint is reachable', icon: '💓' },
    { title: 'Failover', explanation: 'Automatic switch to healthy endpoints', icon: '🔄' },
    { title: 'TTL tradeoff', explanation: 'Lower TTL = faster failover but more queries', icon: '⚖️' },
  ],

  quickCheck: {
    question: 'Why does lower TTL enable faster failover?',
    options: [
      'Lower TTL makes health checks run faster',
      'Lower TTL means cached IPs expire sooner, so users get fresh responses',
      'Lower TTL reduces database load',
      'Lower TTL improves cache hit rate',
    ],
    correctIndex: 1,
    explanation: 'Lower TTL means clients cache DNS responses for less time. When you remove an unhealthy endpoint, clients get fresh responses faster.',
  },
};

const step5: GuidedStep = {
  id: 'global-dns-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-3: Automatic failover from unhealthy endpoints',
    taskDescription: 'Add Health Checker and configure health-aware DNS',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Returns only healthy IPs', displayName: 'DNS Nameserver' },
      { type: 'database', reason: 'Stores DNS records', displayName: 'Database' },
      { type: 'cache', reason: 'Caches records', displayName: 'Cache' },
      { type: 'health_checker', reason: 'Monitors endpoint health', displayName: 'Health Checker' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Users send queries' },
      { from: 'DNS Nameserver', to: 'Database', reason: 'Nameserver queries records' },
      { from: 'DNS Nameserver', to: 'Cache', reason: 'Cache records' },
      { from: 'Health Checker', to: 'DNS Nameserver', reason: 'Reports health status' },
    ],
    successCriteria: [
      'Build full architecture with Health Checker',
      'Connect Health Checker to DNS Nameserver',
      'Configure health checks on endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'dns_server', 'database', 'cache', 'health_checker'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns_server' },
      { fromType: 'dns_server', toType: 'database' },
      { fromType: 'dns_server', toType: 'cache' },
      { fromType: 'health_checker', toType: 'dns_server' },
    ],
    requireGeoDNS: true,
    requireHealthChecks: true,
  },
  hints: {
    level1: 'Add Health Checker and connect it to the DNS Nameserver',
    level2: 'Add Health Checker component, connect it to DNS Nameserver, then configure health check settings',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }, { type: 'database' }, { type: 'cache' }, { type: 'health_checker' }],
    solutionConnections: [
      { from: 'client', to: 'dns_server' },
      { from: 'dns_server', to: 'database' },
      { from: 'dns_server', to: 'cache' },
      { from: 'health_checker', to: 'dns_server' },
    ],
  },
};

// =============================================================================
// STEP 6: TTL Optimization for Fast Updates
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⏰',
  scenario: "You need to migrate traffic from your old datacenter to a new one.",
  hook: "But you set TTL to 1 hour! That means some users will keep hitting the old datacenter for the next hour. You need faster DNS propagation!",
  challenge: "Optimize TTL settings to balance cache efficiency with agility to change.",
  illustration: 'ttl-problem',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your DNS system is now optimized!",
  achievement: "TTL tuning balances performance and flexibility",
  metrics: [
    { label: 'Propagation time', before: '60 minutes', after: '5 minutes' },
    { label: 'DNS query load', after: 'Acceptable' },
    { label: 'Deployment agility', after: '✓ Fast' },
  ],
  nextTeaser: "You've built a production-grade global DNS system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'TTL Optimization: The Critical Balance',
  conceptExplanation: `**TTL** (Time-To-Live) is one of the most important DNS settings.

**The TTL tradeoff**:

**High TTL (1 hour - 1 day)**:
✅ Pros:
  - Fewer DNS queries (lower cost)
  - Less load on nameservers
  - Better cache efficiency
❌ Cons:
  - Slow propagation of changes
  - Longer failover time
  - Less deployment flexibility

**Low TTL (30-300 seconds)**:
✅ Pros:
  - Fast propagation of changes
  - Quick failover (~90 seconds)
  - Deployment flexibility
❌ Cons:
  - More DNS queries (higher cost)
  - Higher load on nameservers
  - Lower cache efficiency

**Best practices**:
- **Normal operation**: 300 seconds (5 minutes)
  - Good balance of cache and agility
- **Pre-migration**: Lower to 60 seconds 1 hour before
  - Enables fast cutover
- **Post-migration**: Raise back to 300 seconds
  - Reduce query load after change
- **Stable records**: 1 hour to 1 day
  - Records that rarely change (like nameservers)

**Real-world example**:
- AWS Route 53 default: 300 seconds
- Cloudflare automatic: 300 seconds
- Google DNS default: 300 seconds

The industry has converged on **300 seconds** as the sweet spot!`,

  whyItMatters: 'TTL controls how quickly you can respond to outages and make changes. Too high = slow failover. Too low = expensive query volume.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Migrating to new datacenter',
    howTheyDoIt: 'Days before migration, Slack lowers DNS TTL from 300s to 60s. After successful migration, they raise it back to 300s. This gives them fast cutover with minimal DNS load.',
  },

  keyPoints: [
    'TTL = 300 seconds (5 min) is the industry sweet spot',
    'Lower TTL before planned changes, raise after',
    'Failover time = health check detection + TTL',
    'With 60s TTL and 30s detection = 90s total failover',
    'Monitor DNS query volume when changing TTL',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│              TTL TRADEOFF                         │
├──────────────────────────────────────────────────┤
│                                                  │
│  TTL: 60 seconds (LOW)                           │
│  ┌────────────────────────────────────┐          │
│  │ Cache Efficiency:      ⭐⭐         │          │
│  │ Query Volume:          ⭐⭐⭐⭐⭐   │          │
│  │ Failover Speed:        ⭐⭐⭐⭐⭐   │          │
│  │ Deployment Agility:    ⭐⭐⭐⭐⭐   │          │
│  │ Cost:                  💰💰💰💰💰 │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  TTL: 300 seconds (RECOMMENDED)                  │
│  ┌────────────────────────────────────┐          │
│  │ Cache Efficiency:      ⭐⭐⭐⭐     │          │
│  │ Query Volume:          ⭐⭐⭐       │          │
│  │ Failover Speed:        ⭐⭐⭐⭐     │          │
│  │ Deployment Agility:    ⭐⭐⭐⭐     │          │
│  │ Cost:                  💰💰💰     │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  TTL: 3600 seconds (HIGH)                        │
│  ┌────────────────────────────────────┐          │
│  │ Cache Efficiency:      ⭐⭐⭐⭐⭐   │          │
│  │ Query Volume:          ⭐           │          │
│  │ Failover Speed:        ⭐           │          │
│  │ Deployment Agility:    ⭐           │          │
│  │ Cost:                  💰         │          │
│  └────────────────────────────────────┘          │
└──────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'TTL', explanation: 'How long clients cache DNS responses (seconds)', icon: '⏰' },
    { title: 'Propagation', explanation: 'Time for DNS changes to reach all clients', icon: '🌊' },
    { title: '300s sweet spot', explanation: 'Industry standard balancing all factors', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why is 300 seconds (5 minutes) the recommended TTL for most DNS records?',
    options: [
      'It\'s the fastest possible TTL',
      'It balances cache efficiency, query volume, and failover speed',
      'It\'s required by DNS standards',
      'It uses the least bandwidth',
    ],
    correctIndex: 1,
    explanation: '300 seconds provides good cache efficiency while still allowing reasonably fast failover (~5 minutes) at acceptable query volume and cost.',
  },
};

const step6: GuidedStep = {
  id: 'global-dns-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-4: Optimized TTL for fast propagation',
    taskDescription: 'Configure optimal TTL settings on DNS records',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'dns_server', reason: 'Configure TTL settings', displayName: 'DNS Nameserver' },
      { type: 'database', reason: 'Stores DNS records with TTL', displayName: 'Database' },
      { type: 'cache', reason: 'Respects TTL for eviction', displayName: 'Cache' },
      { type: 'health_checker', reason: 'Monitors endpoints', displayName: 'Health Checker' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS Nameserver', reason: 'Users send queries' },
      { from: 'DNS Nameserver', to: 'Database', reason: 'Nameserver queries records' },
      { from: 'DNS Nameserver', to: 'Cache', reason: 'Cache records' },
      { from: 'Health Checker', to: 'DNS Nameserver', reason: 'Reports health' },
    ],
    successCriteria: [
      'Build complete DNS architecture',
      'Configure TTL to 300 seconds (5 minutes)',
      'System passes all validation tests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'dns_server', 'database', 'cache', 'health_checker'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns_server' },
      { fromType: 'dns_server', toType: 'database' },
      { fromType: 'dns_server', toType: 'cache' },
      { fromType: 'health_checker', toType: 'dns_server' },
    ],
    requireGeoDNS: true,
    requireHealthChecks: true,
    requireOptimalTTL: true,
  },
  hints: {
    level1: 'Build full system and set TTL to 300 seconds',
    level2: 'Add all components, configure all features, then set DNS record TTL to 300 seconds in the DNS Nameserver configuration',
    solutionComponents: [{ type: 'client' }, { type: 'dns_server' }, { type: 'database' }, { type: 'cache' }, { type: 'health_checker' }],
    solutionConnections: [
      { from: 'client', to: 'dns_server' },
      { from: 'dns_server', to: 'database' },
      { from: 'dns_server', to: 'cache' },
      { from: 'health_checker', to: 'dns_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const globalDnsGuidedTutorial: GuidedTutorial = {
  problemId: 'global-dns-guided',
  problemTitle: 'Build Global DNS - A System Design Journey',

  requirementsPhase: globalDnsRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic DNS Resolution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'DNS nameserver correctly resolves domain names to IP addresses.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'GeoDNS Routing',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Users in different regions get routed to nearest datacenter.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Health-Aware Failover',
      type: 'functional',
      requirement: 'FR-3',
      description: 'DNS automatically removes unhealthy endpoints from responses.',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 60,
      failureInjection: { type: 'endpoint_failure', atSecond: 20, recoverySecond: 40 },
      passCriteria: { maxErrorRate: 0.05, minAvailability: 0.98 },
    },
    {
      name: 'NFR-P1: Query Performance',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K QPS while maintaining p99 latency under 50ms.',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb sudden traffic spike to 200K QPS.',
      traffic: { type: 'read', rps: 200000, readRps: 200000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: High Availability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain 99.9% availability during datacenter failure.',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 120,
      failureInjection: { type: 'datacenter_failure', atSecond: 30, recoverySecond: 90 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 120, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getGlobalDnsGuidedTutorial(): GuidedTutorial {
  return globalDnsGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = globalDnsRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= globalDnsRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
