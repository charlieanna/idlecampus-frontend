import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * TCP Replacement (QUIC/HTTP3) Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching modern transport protocol design
 * through building QUIC/HTTP3 features.
 *
 * Key Concepts:
 * - QUIC protocol fundamentals
 * - 0-RTT connection establishment
 * - Stream multiplexing without head-of-line blocking
 * - Connection migration
 * - Loss recovery and congestion control
 * - Security (TLS 1.3 integration)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const quicRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a modern transport protocol to replace TCP for the next generation of internet applications",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'Principal Network Architect at CloudEdge Systems',
    avatar: '👩‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main limitations of TCP that we need to address?",
      answer: "TCP has several critical limitations for modern applications:\n\n1. **Head-of-line blocking** - One lost packet blocks all streams\n2. **Slow connection setup** - 1-3 RTT handshake delay\n3. **Ossification** - Middleboxes prevent protocol evolution\n4. **Connection rigidity** - IP/port changes break connections\n5. **Poor multiplexing** - Multiple connections needed, hurting performance\n\nQUIC solves these with: stream multiplexing, 0-RTT handshakes, connection migration, and encrypted transport.",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Modern protocols must address TCP's fundamental architectural limitations",
    },
    {
      id: 'zero-rtt',
      category: 'functional',
      question: "How fast should connection establishment be?",
      answer: "For modern web applications, connection latency is critical. QUIC supports:\n\n- **1-RTT** for first-time connections (combined crypto + transport handshake)\n- **0-RTT** for repeat connections (send data immediately using cached credentials)\n\nThis eliminates the 3-RTT overhead of TCP+TLS (TCP SYN + TLS handshake).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "0-RTT dramatically improves user experience for repeat visitors",
    },
    {
      id: 'multiplexing',
      category: 'functional',
      question: "How should we handle multiple data streams?",
      answer: "QUIC supports **independent stream multiplexing** over a single connection:\n\n- Multiple streams share one connection (reduces handshake overhead)\n- Streams are independent - packet loss in stream A doesn't block stream B\n- Solves TCP's head-of-line blocking problem\n- Example: Loading a webpage with 50 resources uses 1 QUIC connection vs 6 TCP connections",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Stream multiplexing is QUIC's killer feature - eliminates head-of-line blocking",
    },
    {
      id: 'connection-migration',
      category: 'functional',
      question: "What happens when a mobile user switches from WiFi to cellular?",
      answer: "TCP connections break because they're tied to IP address + port. QUIC supports **connection migration**:\n\n- Connections identified by Connection ID (not IP/port)\n- Seamless migration when IP changes (WiFi → cellular)\n- No reconnection or data loss\n- Critical for mobile apps and IoT devices",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Connection migration is essential for mobile-first applications",
    },
    {
      id: 'loss-recovery',
      category: 'functional',
      question: "How should the protocol handle packet loss?",
      answer: "QUIC has sophisticated loss recovery:\n\n- **Monotonic packet numbers** (unlike TCP's wraparound sequence numbers)\n- **Explicit ACK frames** with precise timing info\n- **Faster loss detection** using packet number gaps\n- **Improved congestion control** (pluggable algorithms: BBR, Cubic)\n- Retransmits use new packet numbers (clearer RTT measurement)",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Better loss recovery = better performance on lossy networks",
    },
    {
      id: 'security',
      category: 'security',
      question: "How is security integrated into the protocol?",
      answer: "QUIC has **mandatory encryption** with TLS 1.3 integrated into the protocol:\n\n- All payload encrypted (unlike TCP plaintext)\n- Transport parameters encrypted\n- Prevents middlebox ossification\n- Combined crypto + transport handshake (saves RTT)\n- Forward secrecy by default",
      importance: 'critical',
      insight: "Security is built-in, not bolted-on like TCP+TLS",
    },
    {
      id: 'udp-based',
      category: 'clarification',
      question: "Why is QUIC built on UDP instead of being a new IP protocol?",
      answer: "Pragmatic choice for deployment:\n\n- **UDP passes through firewalls/NATs** (IP protocol #N would be blocked)\n- **No kernel changes needed** (can implement in userspace)\n- **Rapid iteration** (update without OS patches)\n- UDP is 'boring' enough to not be blocked\n\nThis is why HTTP/3 = HTTP over QUIC over UDP.",
      importance: 'important',
      insight: "Protocol evolution must consider deployment reality - middleboxes killed many IP-level innovations",
    },

    // SCALE & NFRs
    {
      id: 'throughput-connections',
      category: 'throughput',
      question: "How many concurrent connections should we support?",
      answer: "Modern servers need to handle:\n\n- **Millions of concurrent connections** per server\n- **100K+ requests/sec** per server\n- Each connection may have 10-100 streams\n- Critical for CDNs and large-scale web services",
      importance: 'critical',
      calculation: {
        formula: "1M connections × 10 streams/conn = 10M active streams",
        result: "Must efficiently multiplex millions of streams",
      },
      learningPoint: "Scalability is critical for CDN edge servers",
    },
    {
      id: 'throughput-bandwidth',
      category: 'throughput',
      question: "What bandwidth should a single connection support?",
      answer: "QUIC should support:\n\n- **10+ Gbps per connection** (datacenter)\n- **Multiple streams at full bandwidth** (fair queueing)\n- **Adaptive congestion control** (BBR for high BDP networks)\n- Competitive with TCP performance",
      importance: 'critical',
      learningPoint: "High-bandwidth support essential for video streaming, file transfers",
    },
    {
      id: 'latency-handshake',
      category: 'latency',
      question: "What's the target for connection establishment?",
      answer: "Connection latency targets:\n\n- **0-RTT** for repeat connections (0ms additional latency)\n- **1-RTT** for new connections (~50-200ms depending on distance)\n- Compare to TCP+TLS: 3-RTT (150-600ms)\n\nThis 2-RTT savings is critical for web performance.",
      importance: 'critical',
      calculation: {
        formula: "TCP+TLS: 3 RTT × 100ms = 300ms | QUIC 0-RTT: 0ms",
        result: "300ms faster for repeat connections!",
      },
      learningPoint: "0-RTT is a game-changer for web performance",
    },
    {
      id: 'latency-migration',
      category: 'latency',
      question: "How fast should connection migration be?",
      answer: "When IP address changes (WiFi → cellular):\n\n- **< 100ms reconnection** using Connection ID\n- **No data loss** during migration\n- **Transparent to application** layer\n\nCompare to TCP: full reconnection (1-2 seconds + data loss)",
      importance: 'important',
      learningPoint: "Fast migration is critical for mobile user experience",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What reliability is expected?",
      answer: "QUIC should provide:\n\n- **Equivalent reliability to TCP** (ordered, reliable delivery per stream)\n- **Better availability** through faster failover\n- **Connection migration** reduces perceived downtime\n- Support for unreliable datagrams (QUIC DATAGRAM extension for WebRTC)",
      importance: 'important',
      learningPoint: "Reliability doesn't mean sacrificing performance",
    },
    {
      id: 'real-world-usage',
      category: 'functional',
      question: "Who's using QUIC in production?",
      answer: "QUIC/HTTP3 is widely deployed:\n\n- **Google**: 75%+ of Chrome → Google traffic uses QUIC\n- **Facebook/Meta**: All mobile apps use QUIC\n- **Cloudflare**: 25%+ of HTTP traffic is HTTP/3\n- **Netflix**: Testing QUIC for video streaming\n- **IETF RFC 9000**: Standardized in 2021",
      importance: 'important',
      insight: "QUIC is production-ready and battle-tested at massive scale",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-features', 'zero-rtt', 'multiplexing', 'connection-migration', 'throughput-connections'],
  criticalFRQuestionIds: ['core-features', 'zero-rtt', 'multiplexing', 'connection-migration'],
  criticalScaleQuestionIds: ['throughput-connections', 'throughput-bandwidth', 'latency-handshake'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: 0-RTT connection establishment',
      description: 'Fast reconnection using cached credentials',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Independent stream multiplexing',
      description: 'Multiple streams without head-of-line blocking',
      emoji: '🔀',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Connection migration',
      description: 'Seamless migration across network changes',
      emoji: '📱',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Advanced loss recovery',
      description: 'Fast, accurate loss detection and recovery',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1M concurrent connections per server',
    writesPerDay: 'Bidirectional: 50M packets/sec',
    readsPerDay: 'Bidirectional: 50M packets/sec',
    peakMultiplier: 2,
    readWriteRatio: '1:1 (bidirectional)',
    calculatedWriteRPS: { average: 50000, peak: 100000 },
    calculatedReadRPS: { average: 50000, peak: 100000 },
    maxPayloadSize: '~1200 bytes/packet (MTU-aware)',
    redirectLatencySLA: '0-RTT target',
    createLatencySLA: '1-RTT for new connections',
  },

  architecturalImplications: [
    '✅ Built on UDP → Userspace implementation, rapid iteration',
    '✅ 0-RTT → Cache session tickets, replay protection needed',
    '✅ Stream multiplexing → Per-stream flow control + connection-level flow control',
    '✅ Connection migration → Connection ID routing, path validation',
    '✅ TLS 1.3 integrated → Encrypted headers, prevents middlebox interference',
    '✅ Pluggable congestion control → BBR, Cubic, or custom algorithms',
  ],

  outOfScope: [
    'IP-level protocol changes (QUIC uses UDP)',
    'Kernel implementation (focus on userspace)',
    'Multicast support',
    'Legacy protocol compatibility (QUIC is new)',
  ],

  keyInsight: "First, let's make it WORK. We'll build the basic UDP-based transport, then add QUIC's advanced features: 0-RTT, multiplexing, and migration. Performance and security come together!",
};

// =============================================================================
// STEP 1: UDP Foundation - Replace TCP with UDP
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📦',
  scenario: "Welcome to CloudEdge Systems! You're designing the next-generation transport protocol.",
  hook: "TCP has served the internet for 40 years, but it's showing its age. Time for something better!",
  challenge: "Build a UDP-based foundation that can evolve beyond TCP's limitations.",
  illustration: 'network-layers',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'UDP foundation is ready!',
  achievement: 'You have a flexible, evolvable transport layer',
  metrics: [
    { label: 'Protocol layer', after: 'UDP' },
    { label: 'Middlebox compatibility', after: '✓' },
    { label: 'Userspace implementable', after: '✓' },
  ],
  nextTeaser: "But connections take 3 RTTs to establish...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Why UDP? The Foundation for Protocol Evolution',
  conceptExplanation: `TCP is ossified - middleboxes inspect and modify it, preventing innovation.

**Why build on UDP?**
1. **Passes through firewalls** - UDP port 443 is rarely blocked
2. **Userspace implementation** - No kernel changes needed
3. **Rapid evolution** - Update protocol without OS patches
4. **Encrypted by default** - Prevents middlebox interference

QUIC builds its own reliability on top of UDP's unreliable delivery:
- Application gets TCP-like reliability
- Protocol gets freedom to innovate
- Best of both worlds!`,

  whyItMatters: 'Building a new IP protocol would be blocked by firewalls. UDP is the pragmatic choice.',

  realWorldExample: {
    company: 'Google',
    scenario: 'QUIC deployment across Chrome and Google services',
    howTheyDoIt: 'Started with experimental UDP protocol in 2012. Now handles 75%+ of Chrome traffic to Google. UDP was key to deployment.',
  },

  famousIncident: {
    title: 'TCP Evolution Paralysis',
    company: 'IETF',
    year: '2000s-2010s',
    whatHappened: 'Multiple attempts to improve TCP (MPTCP, TCP Fast Open) saw limited deployment. Middleboxes blocked or corrupted new TCP options. The protocol was ossified.',
    lessonLearned: 'Protocol evolution must work around existing infrastructure. UDP + encryption = freedom.',
    icon: '🧱',
  },

  keyPoints: [
    'UDP is unreliable, unordered - but passes through middleboxes',
    'QUIC implements reliability, ordering, congestion control on top',
    'Userspace implementation enables rapid iteration',
    'Encryption prevents middlebox ossification',
  ],

  keyConcepts: [
    { title: 'UDP', explanation: 'Unreliable datagram protocol - thin wrapper over IP', icon: '📦' },
    { title: 'Ossification', explanation: 'Protocol evolution blocked by middleboxes', icon: '🧱' },
    { title: 'Userspace', explanation: 'Implement in app, not kernel', icon: '👨‍💻' },
  ],

  quickCheck: {
    question: 'Why does QUIC use UDP instead of a new IP protocol?',
    options: [
      'UDP is faster than IP',
      'UDP is more reliable',
      'UDP passes through existing firewalls and NATs',
      'UDP has better congestion control',
    ],
    correctIndex: 2,
    explanation: 'Pragmatic deployment: UDP port 443 works everywhere. A new IP protocol would be blocked by firewalls.',
  },
};

const step1: GuidedStep = {
  id: 'quic-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all QUIC features',
    taskDescription: 'Set up UDP-based client-server communication',
    componentsNeeded: [
      { type: 'client', reason: 'Represents QUIC client endpoint', displayName: 'Client' },
      { type: 'app_server', reason: 'Represents QUIC server endpoint (UDP-based)', displayName: 'QUIC Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'QUIC Server component added to canvas',
      'Client connected to QUIC Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and an App Server (representing QUIC server) onto the canvas',
    level2: 'Click the Client, then click the App Server to create a UDP connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement QUIC Packet Handler
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your UDP server is listening, but it doesn't understand QUIC packets!",
  hook: "The client sends a QUIC Initial packet... and gets silence in return.",
  challenge: "Implement the QUIC packet handler to parse and process QUIC frames.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'QUIC packet processing works!',
  achievement: 'Server can parse and handle QUIC packets',
  metrics: [
    { label: 'Packet types supported', after: 'Initial, Handshake, 1-RTT' },
    { label: 'Frame types', after: 'CRYPTO, ACK, STREAM' },
  ],
  nextTeaser: "But every connection requires a full handshake...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'QUIC Packet Structure: Frames in Packets in Datagrams',
  conceptExplanation: `QUIC has a layered packet structure:

**UDP Datagram** (MTU-sized, ~1200-1500 bytes)
 └─ **QUIC Packet** (encrypted)
     └─ **QUIC Frames** (STREAM, ACK, CRYPTO, etc.)

Packet types:
- **Initial**: First packet, starts handshake
- **Handshake**: Completes crypto handshake
- **1-RTT**: Encrypted application data
- **0-RTT**: Early data (repeat connections)

Frame types:
- **STREAM**: Carry application data
- **ACK**: Acknowledge received packets
- **CRYPTO**: TLS handshake messages
- **CONNECTION_CLOSE**: Graceful shutdown`,

  whyItMatters: 'Understanding packet structure is key to implementing QUIC correctly.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Processing billions of QUIC packets daily',
    howTheyDoIt: 'Uses quiche (Rust QUIC library) for fast packet processing. Zero-copy parsing for performance.',
  },

  keyPoints: [
    'QUIC packets are encrypted (except Initial packet header)',
    'Multiple frames can be bundled in one packet',
    'Packet numbers are monotonically increasing (never reused)',
    'Each packet type has different encryption keys',
  ],

  diagram: `
UDP Datagram (1200 bytes)
┌────────────────────────────────────────┐
│ QUIC Packet Header (encrypted)         │
├────────────────────────────────────────┤
│ Frame 1: CRYPTO (TLS handshake)        │
│ Frame 2: ACK (ack packets 0-5)         │
│ Frame 3: STREAM (id=4, offset=0, data) │
└────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Packet Number', explanation: 'Monotonic counter (unlike TCP sequence)', icon: '🔢' },
    { title: 'Frame', explanation: 'Individual message within packet', icon: '📋' },
    { title: 'Encryption', explanation: 'All payloads encrypted with AEAD', icon: '🔐' },
  ],

  quickCheck: {
    question: 'What is the advantage of monotonic packet numbers over TCP sequence numbers?',
    options: [
      'They are smaller',
      'They never wrap around, making loss detection clearer',
      'They are encrypted',
      'They use less bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Monotonic numbers eliminate ambiguity in retransmissions. Retransmits use NEW packet numbers.',
  },
};

const step2: GuidedStep = {
  id: 'quic-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'Foundation for packet processing',
    taskDescription: 'Implement QUIC packet parsing and frame handling',
    successCriteria: [
      'Click on QUIC Server to open inspector',
      'Assign UDP packet handling API',
      'Open the Python tab',
      'Implement handle_quic_packet() and process_frame() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the QUIC Server, then go to the APIs tab to assign packet handling',
    level2: 'After assigning APIs, switch to the Python tab and implement packet parsing and frame processing',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['UDP /quic/packet'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Session Ticket Cache for 0-RTT
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⏱️',
  scenario: "Your mobile app users are complaining about slow load times!",
  hook: "Every connection requires a full 1-RTT handshake. Repeat visitors deserve better!",
  challenge: "Add session ticket caching to enable 0-RTT reconnections.",
  illustration: 'clock-waiting',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Repeat connections are instant!',
  achievement: '0-RTT eliminates handshake latency',
  metrics: [
    { label: 'First connection', after: '1-RTT (~100ms)' },
    { label: 'Repeat connection', before: '1-RTT', after: '0-RTT (0ms!)' },
    { label: 'Time savings', after: '100-300ms per reconnection' },
  ],
  nextTeaser: "But loading webpages still needs 50+ separate connections...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: '0-RTT: The Speed of Light for Repeat Connections',
  conceptExplanation: `0-RTT allows clients to send data immediately using cached credentials.

**How it works:**
1. **First connection**: 1-RTT handshake, server issues session ticket
2. **Client caches** session ticket + crypto secrets
3. **Next connection**: Client sends encrypted data in first packet (0-RTT)
4. Server validates ticket and processes data immediately

**Security consideration:**
- 0-RTT data is NOT forward secret (replay attack risk)
- Only use for idempotent requests (GET, not POST)
- Server must implement replay protection

Compare latencies:
- **TCP+TLS**: 3 RTT (300ms @ 100ms RTT)
- **QUIC 1-RTT**: 1 RTT (100ms)
- **QUIC 0-RTT**: 0 RTT (0ms additional!)`,

  whyItMatters: '300ms faster page loads translate directly to better user experience and revenue.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Mobile app performance',
    howTheyDoIt: 'Uses 0-RTT for all mobile apps. Saw 30%+ improvement in request latency for repeat connections.',
  },

  famousIncident: {
    title: 'Google QUIC 0-RTT Deployment',
    company: 'Google',
    year: '2014',
    whatHappened: 'Early QUIC deployment showed 0-RTT improved page load time by 8% on average, and 1+ seconds for users with poor connections. This convinced Google to invest heavily in QUIC.',
    lessonLearned: 'Even 100ms latency reduction has measurable business impact.',
    icon: '📈',
  },

  keyPoints: [
    'Session tickets contain crypto parameters + expiry',
    'Cache tickets in Redis for multi-server deployments',
    '0-RTT data has replay risk - only for idempotent requests',
    'Ticket rotation prevents long-term key compromise',
  ],

  diagram: `
First Connection (1-RTT):
Client                          Server
  │─────── Initial ─────────────▶│
  │                               │ (Process handshake)
  │◀───── Handshake + Ticket ────│
  │─────── 1-RTT Data ───────────▶│

Repeat Connection (0-RTT):
Client                          Server
  │─────── Initial + 0-RTT Data ─▶│ ← Data sent immediately!
  │                               │ (Validate ticket, process data)
  │◀───── 1-RTT Response ─────────│
`,

  keyConcepts: [
    { title: '0-RTT', explanation: 'Send data in first packet using cached credentials', icon: '⚡' },
    { title: 'Session Ticket', explanation: 'Encrypted blob containing session state', icon: '🎫' },
    { title: 'Replay Protection', explanation: 'Prevent processing same 0-RTT data twice', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why is 0-RTT data vulnerable to replay attacks?',
    options: [
      'It is not encrypted',
      'Attacker can capture and resend packets before server validates',
      'Session tickets are sent in plaintext',
      'UDP is unreliable',
    ],
    correctIndex: 1,
    explanation: '0-RTT data is sent before server confirms receipt. Attacker can replay it. Only use for idempotent operations.',
  },
};

const step3: GuidedStep = {
  id: 'quic-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: 0-RTT connection establishment',
    taskDescription: 'Add cache for session tickets to enable 0-RTT',
    componentsNeeded: [
      { type: 'cache', reason: 'Store session tickets for 0-RTT resumption', displayName: 'Session Ticket Cache (Redis)' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'QUIC Server connected to Cache',
      'Cache TTL configured (24 hours for session tickets)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas for session ticket storage',
    level2: 'Connect QUIC Server to Cache. Set TTL to 86400 seconds (24 hours) for session ticket expiry',
    solutionComponents: [{ type: 'cache', config: { ttl: 86400 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Implement Stream Multiplexing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔀',
  scenario: "A webpage needs 50 resources. With TCP, this means 50 connections or head-of-line blocking!",
  hook: "One lost packet blocks ALL streams on a TCP connection. This is unacceptable!",
  challenge: "Implement independent stream multiplexing to eliminate head-of-line blocking.",
  illustration: 'traffic-jam',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Streams are independent!',
  achievement: 'One lost packet only affects its own stream',
  metrics: [
    { label: 'Streams per connection', after: 'Unlimited (flow-controlled)' },
    { label: 'Head-of-line blocking', before: 'TCP-level', after: 'Eliminated!' },
    { label: 'Webpage load improvement', after: '30%+ faster' },
  ],
  nextTeaser: "But mobile users lose connection when switching networks...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Multiplexing: QUIC\'s Killer Feature',
  conceptExplanation: `TCP's biggest problem: **head-of-line blocking**.

When one packet is lost on a TCP connection:
- ALL data behind it is blocked
- Even data for unrelated streams
- Application can't access any data until retransmit arrives

**QUIC's solution: Independent streams**
- Multiple logical streams over one connection
- Each stream has its own sequence space
- Packet loss in stream 4 doesn't block stream 8
- Application can process stream 8 immediately

**Benefits:**
- Load webpage: 1 connection with 50 streams (vs 6 TCP connections)
- Fewer handshakes (0-RTT for all streams!)
- Better congestion control (connection-level, not per-stream)
- Stream priorities (critical CSS before images)`,

  whyItMatters: 'Stream multiplexing is the fundamental architectural improvement over TCP.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'HTTP/3 performance',
    howTheyDoIt: 'HTTP/3 over QUIC shows 30%+ faster page loads on lossy networks due to no head-of-line blocking.',
  },

  famousIncident: {
    title: 'HTTP/2 Over TCP: Head-of-Line Blocking Returns',
    company: 'IETF',
    year: '2015',
    whatHappened: 'HTTP/2 introduced stream multiplexing, but over TCP. On lossy networks (2%+ packet loss), HTTP/2 was SLOWER than HTTP/1.1 due to TCP-level head-of-line blocking affecting all streams.',
    lessonLearned: 'You can\'t fix transport-layer problems at the application layer. QUIC fixes it at the right layer.',
    icon: '🚧',
  },

  keyPoints: [
    'Each stream identified by Stream ID (0, 4, 8, ...)',
    'Stream-level flow control + connection-level flow control',
    'Streams can be unidirectional or bidirectional',
    'Stream prioritization for performance optimization',
  ],

  diagram: `
TCP Head-of-Line Blocking:
┌─────────────────────────────────────┐
│ [Stream A: ✓✓✓ ✗ ...blocked...   ] │ ← Packet 4 lost
│ [Stream B: ✓✓✓ ✗ ...blocked...   ] │ ← Blocked by Stream A!
└─────────────────────────────────────┘

QUIC Independent Streams:
┌─────────────────────────────────────┐
│ [Stream A: ✓✓✓ ✗ ⏸️  waiting...   ] │ ← Packet 4 lost
│ [Stream B: ✓✓✓✓✓✓ ✅ delivered!  ] │ ← Continues!
└─────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Stream', explanation: 'Independent ordered byte stream', icon: '🌊' },
    { title: 'Head-of-Line Blocking', explanation: 'One loss blocks unrelated data', icon: '🚧' },
    { title: 'Flow Control', explanation: 'Per-stream AND per-connection limits', icon: '🚦' },
  ],

  quickCheck: {
    question: 'Why does HTTP/2 over TCP still suffer from head-of-line blocking?',
    options: [
      'HTTP/2 is poorly designed',
      'TCP blocks all data when one packet is lost, regardless of HTTP/2 streams',
      'HTTP/2 doesn\'t support multiplexing',
      'TCP is too slow',
    ],
    correctIndex: 1,
    explanation: 'TCP sees one byte stream. Loss anywhere blocks everything. QUIC fixes this at the transport layer.',
  },
};

const step4: GuidedStep = {
  id: 'quic-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Independent stream multiplexing',
    taskDescription: 'Implement stream multiplexing in QUIC server code',
    successCriteria: [
      'Open QUIC Server Python tab',
      'Implement create_stream(), send_stream_data(), and handle_stream_frame()',
      'Support multiple concurrent streams per connection',
      'Implement per-stream flow control',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Open the Python tab in QUIC Server inspector and look for stream handling TODOs',
    level2: 'Implement stream creation with unique IDs, track per-stream state, and handle STREAM frames',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for Connection Distribution
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "You've scaled to millions of connections! One server can't handle the load.",
  hook: "Connection establishment is the bottleneck - handshakes are CPU-intensive.",
  challenge: "Add load balancer with Connection ID routing for scale.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Connections distributed across servers!',
  achievement: 'Load balancer routes connections efficiently',
  metrics: [
    { label: 'Server instances', before: '1', after: '10+' },
    { label: 'Connection capacity', before: '100K', after: '1M+' },
  ],
  nextTeaser: "But connection state is lost when a server dies...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing QUIC: Connection ID Routing',
  conceptExplanation: `QUIC load balancing is different from TCP:

**TCP load balancing:**
- Based on 5-tuple: (src IP, src port, dst IP, dst port, protocol)
- Sticky sessions needed for stateful protocols

**QUIC load balancing:**
- Based on **Connection ID** (visible in packet header)
- Server generates Connection ID with routing info encoded
- Load balancer extracts server ID from Connection ID
- Supports connection migration (Connection ID stays same)

**Load balancer algorithm:**
1. Client sends packet with Connection ID
2. Load balancer reads Connection ID → determines target server
3. Route packet to that server
4. Server can change Connection ID to rebalance

This enables seamless migration and server-directed load balancing!`,

  whyItMatters: 'Millions of concurrent connections require efficient load distribution without losing connection state.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Load balancing QUIC at massive scale',
    howTheyDoIt: 'Uses Maglev load balancer with Connection ID-based routing. Supports 100M+ concurrent connections per datacenter.',
  },

  keyPoints: [
    'Connection ID visible in packet header (even when encrypted)',
    'Server encodes routing info in Connection ID',
    'Supports connection migration across load balancer pool',
    'Stateless load balancing (no connection state needed)',
  ],

  diagram: `
Connection ID Routing:

Client                    Load Balancer              Servers
  │                             │                       │
  │─ CID: [Server-2|Random] ──▶│                       │
  │                             │── Extract "Server-2" ─▶ Server-2
  │                             │                       │
  │◀──────────────────────────────────────────────────────│
  │                             │                       │
  │─ CID: [Server-5|Random] ──▶│                       │
  │                             │── Extract "Server-5" ─▶ Server-5
`,

  keyConcepts: [
    { title: 'Connection ID', explanation: 'Opaque identifier chosen by server', icon: '🔑' },
    { title: 'Stateless LB', explanation: 'No need to track connections', icon: '⚖️' },
    { title: 'Server-directed', explanation: 'Server controls routing via CID', icon: '🎯' },
  ],

  quickCheck: {
    question: 'What advantage does Connection ID routing have over 5-tuple routing?',
    options: [
      'It is faster',
      'It supports connection migration when client IP changes',
      'It uses less memory',
      'It is more secure',
    ],
    correctIndex: 1,
    explanation: 'Connection ID stays same when IP changes. Load balancer can still route correctly during migration.',
  },
};

const step5: GuidedStep = {
  id: 'quic-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'Scale all QUIC features',
    taskDescription: 'Add load balancer with Connection ID-based routing',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute connections across QUIC servers', displayName: 'QUIC Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to QUIC Server',
      'Configure Connection ID routing',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and QUIC Server',
    level2: 'Reconnect: Client → Load Balancer → QUIC Server. Configure for Connection ID routing.',
    solutionComponents: [{ type: 'load_balancer', config: { algorithm: 'connection_id' } }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Connection Migration
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📱',
  scenario: "Mobile users are furious! Every time they switch from WiFi to cellular, their video call drops.",
  hook: "With TCP, IP address change = connection break. Unacceptable for mobile apps!",
  challenge: "Implement connection migration using Connection IDs.",
  illustration: 'network-switch',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Seamless migration works!',
  achievement: 'Connections survive network changes',
  metrics: [
    { label: 'WiFi → Cellular migration', before: '2s reconnect', after: '<100ms' },
    { label: 'Data loss during migration', before: 'Yes', after: 'None' },
    { label: 'User-visible disruption', before: 'Call drops', after: 'Seamless!' },
  ],
  nextTeaser: "But packet loss is causing performance degradation...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Connection Migration: Mobility for the Modern Internet',
  conceptExplanation: `TCP connections are bound to 4-tuple (src IP, src port, dst IP, dst port).
When any changes → connection breaks.

**QUIC's solution: Connection ID**
- Connections identified by Connection ID (not IP/port)
- Connection ID is 64-bit random identifier
- Client can change IP address freely
- Server validates new path, connection continues

**Migration process:**
1. Client network changes (WiFi → cellular)
2. Client sends packet from new IP with same Connection ID
3. Server receives packet, validates new path
4. Server sends PATH_CHALLENGE frame to new address
5. Client responds with PATH_RESPONSE
6. Migration complete - connection active on new path!

**Security:**
- Path validation prevents address spoofing attacks
- Both paths can be active during migration (seamless!)`,

  whyItMatters: 'Mobile devices change networks constantly. TCP makes this painful. QUIC makes it seamless.',

  realWorldExample: {
    company: 'Meta (Facebook)',
    scenario: 'Mobile app connectivity',
    howTheyDoIt: 'All mobile apps use QUIC. Connection migration keeps video calls, messages flowing during network changes. Improved mobile UX dramatically.',
  },

  famousIncident: {
    title: 'iPhone FaceTime WiFi → Cellular Handoff',
    company: 'Apple',
    year: '2020s',
    whatHappened: 'Early FaceTime used TCP-based protocols. Switching from WiFi to cellular would drop calls. After moving to QUIC-like protocols, handoff became seamless.',
    lessonLearned: 'Mobile-first design requires connection migration support.',
    icon: '📞',
  },

  keyPoints: [
    'Connection ID decouples connection from IP/port',
    'Path validation prevents address spoofing',
    'Both old and new paths can be active (smooth transition)',
    'Crucial for mobile, IoT, multi-path scenarios',
  ],

  diagram: `
Connection Migration:

Mobile Client                        Server
WiFi: 192.168.1.5                 1.2.3.4
Connection ID: 0x1234567890

  │──── Packets (WiFi) ────────────▶│
  │◀──── Packets ───────────────────│
  │                                 │
  │ [Network change! WiFi → 4G]    │
  │                                 │
4G: 10.0.0.5                      1.2.3.4
Connection ID: 0x1234567890 (same!)

  │──── Packet from new IP ────────▶│
  │      Connection ID: 0x1234...   │
  │                                 │
  │◀──── PATH_CHALLENGE ────────────│
  │──── PATH_RESPONSE ──────────────▶│
  │                                 │
  │◀──── Migration successful! ─────│
  Connection continues seamlessly
`,

  keyConcepts: [
    { title: 'Connection ID', explanation: 'Identifier independent of network path', icon: '🔑' },
    { title: 'Path Validation', explanation: 'Verify new path with challenge/response', icon: '✅' },
    { title: 'Multi-path', explanation: 'Use multiple paths simultaneously', icon: '🛤️' },
  ],

  quickCheck: {
    question: 'Why does QUIC need path validation during connection migration?',
    options: [
      'To improve performance',
      'To prevent attackers from hijacking connections by spoofing IP addresses',
      'To save bandwidth',
      'To make migration faster',
    ],
    correctIndex: 1,
    explanation: 'Attacker could send packet with victim IP to redirect connection. Path validation proves client controls new address.',
  },
};

const step6: GuidedStep = {
  id: 'quic-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Connection migration',
    taskDescription: 'Implement connection migration with path validation',
    successCriteria: [
      'Open QUIC Server Python tab',
      'Implement handle_path_migration(), validate_path(), send_path_challenge()',
      'Support multiple active paths per connection',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement connection migration handlers in the Python code',
    level2: 'Track active paths per connection, implement PATH_CHALLENGE/PATH_RESPONSE frames',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Implement Advanced Loss Recovery
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📉',
  scenario: "On lossy networks (2% packet loss), your throughput is terrible!",
  hook: "TCP waits for 3 duplicate ACKs or timeout. Too slow for modern networks!",
  challenge: "Implement QUIC's advanced loss recovery with fast retransmission.",
  illustration: 'packet-loss',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Loss recovery is lightning fast!',
  achievement: 'Detect and recover from loss in milliseconds',
  metrics: [
    { label: 'Loss detection', before: '200ms (TCP)', after: '50ms (QUIC)' },
    { label: 'Throughput on lossy network', before: '5 Mbps', after: '20 Mbps' },
    { label: 'Retransmit ambiguity', before: 'Yes (TCP)', after: 'None!' },
  ],
  nextTeaser: "But connection state isn't persisted...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Loss Recovery: Faster Than TCP',
  conceptExplanation: `QUIC's loss recovery improvements over TCP:

**1. Monotonic Packet Numbers**
- TCP: sequence numbers wrap around, reused for retransmits
- QUIC: packet numbers NEVER reused, always increasing
- Benefit: Clear RTT measurement, no retransmission ambiguity

**2. Explicit ACK Frames**
- Contains packet number ranges (e.g., "ACK 0-5, 7-10" → 6 is lost)
- Immediate loss detection from gaps
- No waiting for duplicate ACKs

**3. Faster Loss Detection**
- Packet threshold: If later packet arrives, earlier is probably lost
- Time threshold: Delayed ACK indicates loss
- Combine both for fast, accurate detection

**4. Pluggable Congestion Control**
- Cubic (TCP-like)
- BBR (Google's algorithm for high BDP networks)
- Custom algorithms possible

**5. Separate Recovery Per Stream**
- Stream 1 loss doesn't trigger congestion response for Stream 2
- Better than TCP's connection-wide backoff`,

  whyItMatters: 'On lossy mobile/WiFi networks, fast loss recovery is the difference between usable and unusable.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Video streaming over cellular',
    howTheyDoIt: 'Testing QUIC for video delivery. Fast loss recovery maintains quality on lossy networks, reducing rebuffering.',
  },

  famousIncident: {
    title: 'TCP Retransmission Ambiguity Problem',
    company: 'Research',
    year: '1980s-2000s',
    whatHappened: 'TCP\'s Karn\'s algorithm had to ignore RTT samples from retransmits because you couldn\'t tell if ACK was for original or retransmit. This made RTT estimation poor on lossy networks.',
    lessonLearned: 'Monotonic packet numbers eliminate this entire class of problems.',
    icon: '🔬',
  },

  keyPoints: [
    'Monotonic packet numbers eliminate retransmission ambiguity',
    'ACK frames explicitly list received packet ranges',
    'Loss detected from gaps, not duplicate ACKs',
    'Pluggable congestion control (Cubic, BBR, etc.)',
  ],

  diagram: `
TCP Loss Detection (slow):
Packet:  1   2   3   4   5   6   7   8
         ✓   ✗   ✓   ✓   ✓   ✓   ✓   ✓
         │   │   └──dup ACK 1
         │   │       └──dup ACK 2
         │   │           └──dup ACK 3 ← Finally detect loss!
         └───┴─────────────────────────  ~3 RTT delay

QUIC Loss Detection (fast):
Packet:  1   2   3   4   5   6   7   8
         ✓   ✗   ✓   ✓   ✓   ✓   ✓   ✓
         │   │   └──ACK [1,3] ← Gap! Packet 2 likely lost
         │   └──────────────────  Retransmit as packet 9
         Detected in ~1 RTT
`,

  keyConcepts: [
    { title: 'Monotonic', explanation: 'Packet numbers always increase, never reuse', icon: '📈' },
    { title: 'ACK Range', explanation: 'List all received packets, gaps show loss', icon: '📊' },
    { title: 'BBR', explanation: 'Google\'s congestion control for high-speed networks', icon: '🌐' },
  ],

  quickCheck: {
    question: 'What is the main advantage of monotonic packet numbers over TCP sequence numbers?',
    options: [
      'They use less space',
      'Retransmits use NEW numbers, eliminating ambiguity in RTT measurement',
      'They are encrypted',
      'They prevent packet loss',
    ],
    correctIndex: 1,
    explanation: 'New packet number for retransmits means you know exactly which transmission was ACKed. Better RTT estimation.',
  },
};

const step7: GuidedStep = {
  id: 'quic-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Advanced loss recovery',
    taskDescription: 'Implement QUIC loss detection and recovery',
    successCriteria: [
      'Open QUIC Server Python tab',
      'Implement detect_loss(), handle_ack_frame(), retransmit_lost_packets()',
      'Use packet number gaps for fast loss detection',
      'Implement congestion control (basic Cubic or BBR)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement loss detection using ACK frame packet ranges',
    level2: 'Track sent packets, detect gaps in ACKs, retransmit with new packet numbers',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Database for Connection State Persistence
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💾',
  scenario: "A server crashes and restarts. Thousands of connections are lost!",
  hook: "Connection state was only in memory. Recovery is impossible.",
  challenge: "Add database to persist critical connection state.",
  illustration: 'data-loss',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Connection state is durable!',
  achievement: 'Server crashes no longer lose connection state',
  metrics: [
    { label: 'State persistence', after: 'Enabled' },
    { label: 'Recovery time', before: 'Never', after: '<10s' },
  ],
  nextTeaser: "But we need multiple server instances for redundancy...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'State Persistence: Don\'t Lose Connection State',
  conceptExplanation: `QUIC maintains per-connection state:
- Crypto secrets (TLS keys)
- Stream state (sent/received offsets)
- Flow control windows
- Packet number tracking
- Session tickets

**Why persist?**
If server crashes, all connections drop. Clients must re-establish (1-RTT delay).

**What to persist:**
1. **Session tickets** (for 0-RTT) - Store in cache/database
2. **Connection state** (optional) - For faster failover
3. **Crypto state** - Enables resumption after crash

**Trade-offs:**
- Writing state adds latency
- Only persist critical state (session tickets)
- Most connection state is ephemeral (rebuilt on reconnect)

**Architecture:**
- Cache: Session tickets (fast, ephemeral)
- Database: Long-term state, audit logs
- Most QUIC state is in-memory (performance)`,

  whyItMatters: 'Persisting session tickets enables 0-RTT even after server restarts. Critical for user experience.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Global QUIC edge network',
    howTheyDoIt: 'Session tickets stored in distributed cache. Enables 0-RTT even if user lands on different edge server.',
  },

  keyPoints: [
    'Session tickets MUST be persisted for 0-RTT',
    'Most connection state is ephemeral (in-memory)',
    'Use cache for hot state, database for long-term',
    'Database enables connection tracking, analytics',
  ],

  keyConcepts: [
    { title: 'Session Ticket', explanation: 'Encrypted resumption token', icon: '🎫' },
    { title: 'Durability', explanation: 'State survives server crashes', icon: '💾' },
    { title: 'Ephemeral', explanation: 'State that doesn\'t need persistence', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why are session tickets stored in cache rather than database?',
    options: [
      'Databases are too slow',
      'Cache is faster for high-frequency access during 0-RTT handshakes',
      'Tickets are too large for databases',
      'Security reasons',
    ],
    correctIndex: 1,
    explanation: 'Every 0-RTT connection needs ticket lookup. Cache provides sub-millisecond latency vs database\'s 10-50ms.',
  },
};

const step8: GuidedStep = {
  id: 'quic-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All features need persistent state',
    taskDescription: 'Add database for connection state and analytics',
    componentsNeeded: [
      { type: 'database', reason: 'Persist connection metadata and session tickets', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'QUIC Server connected to Database',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) onto the canvas',
    level2: 'Connect QUIC Server to Database for connection state persistence',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 9: Scale Horizontally with Multiple Server Instances
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📈',
  scenario: "You've scaled to 10 million connections! One server can't handle it.",
  hook: "CPU maxed out processing handshakes and encryption. Time to scale out!",
  challenge: "Add multiple QUIC server instances behind the load balancer.",
  illustration: 'scaling',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Horizontally scaled to millions of connections!',
  achievement: 'Multiple servers handle the load',
  metrics: [
    { label: 'Server instances', before: '1', after: '10' },
    { label: 'Connection capacity', before: '100K', after: '1M+' },
    { label: 'Throughput', before: '10 Gbps', after: '100 Gbps' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Handle Millions of Connections',
  conceptExplanation: `QUIC servers are CPU-intensive:
- TLS 1.3 handshake (crypto operations)
- Packet encryption/decryption (AEAD per packet)
- Loss recovery tracking
- Flow control calculations

**Single server limits:**
- ~100K-1M concurrent connections
- ~100K handshakes/sec
- Limited by CPU (crypto), not network

**Horizontal scaling strategy:**
1. Add more server instances
2. Load balancer routes by Connection ID
3. Share session ticket cache (for 0-RTT across servers)
4. Independent servers (no cross-server state)

**Key insight:**
QUIC's Connection ID enables stateless load balancing.
Unlike TCP sticky sessions, QUIC can rebalance anytime!`,

  whyItMatters: 'CDN edge servers handle millions of connections. Horizontal scaling is essential.',

  realWorldExample: {
    company: 'Google',
    scenario: 'QUIC at datacenter scale',
    howTheyDoIt: 'Runs thousands of QUIC server instances per datacenter. Connection ID routing enables seamless scaling and rebalancing.',
  },

  keyPoints: [
    'Add server instances to increase connection capacity',
    'Shared cache for session tickets (0-RTT works across servers)',
    'Load balancer routes by Connection ID (stateless)',
    'Auto-scale based on connection count + CPU',
  ],

  diagram: `
Scaled QUIC Architecture:

Clients ──▶ Load Balancer ─┬──▶ QUIC Server 1 ─┐
                           │                    │
                           ├──▶ QUIC Server 2 ─┤──▶ Cache (Shared)
                           │                    │
                           └──▶ QUIC Server 3 ─┘
`,

  keyConcepts: [
    { title: 'Stateless LB', explanation: 'Load balancer has no connection state', icon: '⚖️' },
    { title: 'Shared Cache', explanation: '0-RTT works on any server', icon: '💾' },
    { title: 'Auto-scale', explanation: 'Add servers based on load', icon: '📊' },
  ],

  quickCheck: {
    question: 'Why can QUIC load balancers be stateless while TCP load balancers need sticky sessions?',
    options: [
      'QUIC is faster',
      'Connection ID in packet header allows routing without tracking state',
      'QUIC uses UDP',
      'QUIC has better encryption',
    ],
    correctIndex: 1,
    explanation: 'Connection ID is visible in every packet header. Load balancer can route without remembering connections.',
  },
};

const step9: GuidedStep = {
  id: 'quic-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'All features scale horizontally',
    taskDescription: 'Configure multiple QUIC server instances',
    successCriteria: [
      'Click on QUIC Server component',
      'Go to Configuration tab',
      'Set instances to 5 or more',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on QUIC Server, go to Configuration, increase instance count',
    level2: 'Set instances to 5-10. Load balancer will distribute connections across all instances.',
    solutionComponents: [{ type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Cost Optimization and Performance Tuning
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💰',
  scenario: "Your CFO is concerned: 'The cloud bill is $10K/month for this QUIC deployment!'",
  hook: "Crypto operations and multiple instances are expensive. Time to optimize!",
  challenge: "Optimize your QUIC deployment for cost and performance.",
  illustration: 'budget',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a modern QUIC/HTTP3 transport!',
  achievement: 'Production-ready protocol replacing TCP',
  metrics: [
    { label: 'Connection setup', after: '0-RTT (0ms for repeat)' },
    { label: 'Head-of-line blocking', after: 'Eliminated' },
    { label: 'Connection migration', after: 'Seamless' },
    { label: 'Loss recovery', after: '<50ms detection' },
    { label: 'Monthly cost', before: '$10K', after: 'Optimized' },
  ],
  nextTeaser: "You've mastered next-generation transport protocol design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Production QUIC at Scale',
  conceptExplanation: `QUIC performance and cost optimization strategies:

**1. Crypto Acceleration**
- Hardware offload (AES-NI, SIMD)
- Reduce CPU cost per connection by 50%+

**2. Smart Instance Sizing**
- QUIC is CPU-bound (not network-bound)
- Use compute-optimized instances
- Balance: Too few → high latency, Too many → wasted $

**3. Connection Pooling**
- Reuse QUIC connections (multiplexing!)
- 1 connection with 50 streams > 50 connections
- Reduces handshake overhead

**4. 0-RTT Optimization**
- Maximize session ticket cache hit rate
- Longer TTL for tickets (balance security/performance)
- Pre-populate cache during low-traffic hours

**5. Congestion Control Tuning**
- BBR for high-bandwidth networks (vs Cubic)
- Tune initial window size
- Adjust based on network characteristics

**6. Right-size Infrastructure**
- Cache: Based on active users × ticket size
- Database: Only for long-term state
- Servers: Based on handshakes/sec + active connections`,

  whyItMatters: 'QUIC\'s crypto overhead is real. Optimization makes the difference between viable and too expensive.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Global QUIC deployment',
    howTheyDoIt: 'Uses BoringSSL with hardware crypto acceleration. Optimized implementations handle 1M+ connections per server at reasonable cost.',
  },

  famousIncident: {
    title: 'QUIC CPU Cost at Google',
    company: 'Google',
    year: '2015',
    whatHappened: 'Early QUIC deployment showed 2x CPU cost vs TCP+TLS due to userspace crypto. Google invested in optimization: kernel offload, better crypto libraries. Reduced overhead to <20%.',
    lessonLearned: 'New protocols need optimization investment to be cost-competitive.',
    icon: '⚡',
  },

  keyPoints: [
    'Use hardware crypto acceleration (AES-NI)',
    'Right-size instances based on actual load',
    'Maximize 0-RTT cache hit rate',
    'Connection multiplexing reduces overhead',
  ],

  keyConcepts: [
    { title: 'Crypto Acceleration', explanation: 'Hardware support for encryption', icon: '🔐' },
    { title: 'Connection Pooling', explanation: 'Reuse connections with multiplexing', icon: '🔄' },
    { title: 'BBR', explanation: 'Optimized congestion control', icon: '📊' },
  ],

  quickCheck: {
    question: 'What is the main CPU cost in QUIC?',
    options: [
      'Packet routing',
      'TLS 1.3 encryption/decryption per packet',
      'Memory allocation',
      'Network I/O',
    ],
    correctIndex: 1,
    explanation: 'Every packet is encrypted/decrypted. Hardware acceleration (AES-NI) is critical for performance.',
  },
};

const step10: GuidedStep = {
  id: 'quic-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All features must be cost-effective',
    taskDescription: 'Optimize QUIC deployment for cost and performance',
    successCriteria: [
      'Review all component configurations',
      'Optimize instance count and sizes',
      'Ensure cache hit rate is maximized',
      'Total cost is reasonable for scale',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Focus on right-sizing instances.',
    level2: 'Balance: enough instances for redundancy, but not wasteful. Cache should be large enough for session tickets.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l6ProtocolTcpReplacementGuidedTutorial: GuidedTutorial = {
  problemId: 'l6-protocol-tcp-replacement',
  title: 'Design QUIC/HTTP3: Next-Generation Transport Protocol',
  description: 'Build a modern transport protocol with 0-RTT, multiplexing, connection migration, and advanced loss recovery',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Protocol Architect at CloudEdge Systems!",
    scenario: "Your mission: Design a next-generation transport protocol that eliminates TCP's 40-year-old limitations while remaining deployable on today's internet.",
    challenge: "Can you build QUIC - the protocol that powers HTTP/3 and handles billions of connections daily at Google, Facebook, and Cloudflare?",
  },

  requirementsPhase: quicRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'UDP-based Transport',
    'QUIC Protocol Architecture',
    '0-RTT Connection Establishment',
    'Stream Multiplexing',
    'Connection Migration',
    'Loss Recovery',
    'Congestion Control (BBR, Cubic)',
    'TLS 1.3 Integration',
    'Connection ID Routing',
    'Path Validation',
    'Horizontal Scaling',
    'Crypto Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 8: Distributed System Troubles',
    'Network protocols and latency optimization',
  ],
};

export default l6ProtocolTcpReplacementGuidedTutorial;
