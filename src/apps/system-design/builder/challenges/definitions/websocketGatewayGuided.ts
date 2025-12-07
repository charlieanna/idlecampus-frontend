import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * WebSocket Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches WebSocket architecture concepts
 * while building a scalable real-time messaging gateway.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (pub/sub, heartbeats, load balancing, scaling)
 *
 * Key Concepts:
 * - WebSocket protocol and persistent connections
 * - Connection management and heartbeats
 * - Pub/Sub pattern for message distribution
 * - Horizontal scaling challenges for WebSockets
 * - Sticky sessions and connection state
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const websocketGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a WebSocket Gateway that handles real-time bidirectional communication at scale",

  interviewer: {
    name: 'Jordan Lee',
    role: 'Principal Engineer at RealTime Systems Corp.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-websocket',
      category: 'functional',
      question: "What's the primary function of this WebSocket Gateway?",
      answer: "The gateway needs to:\n\n1. **Accept WebSocket connections** - Upgrade HTTP to WebSocket protocol\n2. **Maintain persistent connections** - Keep connections alive for real-time communication\n3. **Route messages bidirectionally** - Send/receive messages between clients and backend\n4. **Manage connection lifecycle** - Handle connect, disconnect, reconnect scenarios",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "WebSocket Gateway is a stateful proxy that maintains long-lived connections, unlike HTTP which is stateless",
    },
    {
      id: 'message-routing',
      category: 'functional',
      question: "How should messages be routed through the gateway?",
      answer: "Messages flow in two directions:\n\n**Client → Backend**:\n- Client sends message over WebSocket\n- Gateway forwards to appropriate backend service\n- Backend processes and may respond\n\n**Backend → Client**:\n- Backend publishes message to specific client(s)\n- Gateway delivers to correct WebSocket connection(s)\n- Handles fan-out for broadcast scenarios",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Gateway needs both request routing AND push delivery capabilities",
    },
    {
      id: 'connection-state',
      category: 'functional',
      question: "What state does the gateway need to track for each connection?",
      answer: "For each WebSocket connection:\n- **User/Session ID** - Who is connected\n- **Connection metadata** - Device type, version, capabilities\n- **Subscription channels** - Which topics/rooms user subscribed to\n- **Last activity timestamp** - For timeout detection\n- **Connection quality** - Latency, reconnect count",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "WebSocket connections are stateful - gateway must maintain this state",
    },
    {
      id: 'heartbeat-mechanism',
      category: 'functional',
      question: "How do we keep connections alive and detect disconnects?",
      answer: "Use **heartbeats** (ping/pong):\n- Gateway sends ping every 30 seconds\n- Client must respond with pong within 10 seconds\n- If no pong received, connection is dead\n- Prevents zombie connections consuming resources\n\nThis is essential because network issues may not trigger immediate disconnect events.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Heartbeats are critical for detecting broken connections that don't cleanly disconnect",
    },
    {
      id: 'pub-sub-pattern',
      category: 'functional',
      question: "How do we broadcast messages to multiple clients efficiently?",
      answer: "Use **Pub/Sub pattern**:\n- Clients subscribe to channels/topics (e.g., 'chat-room-123')\n- Backend publishes message to channel\n- Gateway fans out to all subscribers\n- Avoids backend knowing about individual connections\n\nFor example, 1,000 users in a chat room → publish once, gateway delivers to all 1,000 connections.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Pub/Sub decouples message producers from consumers - essential for broadcast scenarios",
    },
    {
      id: 'reconnection',
      category: 'clarification',
      question: "What happens when a client disconnects and reconnects?",
      answer: "Gateway should:\n1. **Detect disconnect** - Via heartbeat failure or explicit close\n2. **Clean up state** - Remove from active connections\n3. **Handle reconnect** - Allow client to resume session\n4. **Replay missed messages** - If possible, deliver messages sent during disconnect\n\nFor MVP, focus on clean disconnect/reconnect. Message replay can come later.",
      importance: 'important',
      insight: "Reconnection logic is complex - consider exponential backoff and session resumption",
    },
    {
      id: 'authentication',
      category: 'clarification',
      question: "How do we authenticate WebSocket connections?",
      answer: "WebSocket connections start with HTTP upgrade request. Options:\n1. **Token in query param** - ws://gateway.com?token=xyz\n2. **Token in headers** - During HTTP upgrade handshake\n3. **Cookie-based** - Use existing session cookie\n\nFor MVP, use token in upgrade request. Validate before accepting connection.",
      importance: 'important',
      insight: "WebSocket auth happens during upgrade - can't send auth after connection opens",
    },

    // SCALE & NFRs
    {
      id: 'concurrent-connections',
      category: 'throughput',
      question: "How many concurrent WebSocket connections should we support?",
      answer: "Target: **10 million concurrent connections** across the entire gateway cluster at peak.\n\nTypical distribution:\n- Small single server: 10K-50K connections\n- Medium instance: 50K-100K connections  \n- Total cluster capacity: 10M connections",
      importance: 'critical',
      learningPoint: "WebSocket connections are expensive - each connection consumes memory and a file descriptor",
    },
    {
      id: 'message-throughput',
      category: 'throughput',
      question: "What's the expected message throughput?",
      answer: "Expected throughput:\n- **500K messages/second** total across all connections\n- Average: 0.05 messages/sec per connection (many connections idle)\n- Burst: Up to 2M messages/sec during peak events",
      importance: 'critical',
      calculation: {
        formula: "10M connections × 0.05 msg/sec = 500K msg/sec average",
        result: "~500K messages/sec baseline, 2M peak",
      },
      learningPoint: "Most connections are idle most of the time - handle burst patterns",
    },
    {
      id: 'message-latency',
      category: 'latency',
      question: "What's the latency requirement for message delivery?",
      answer: "**p99 < 100ms** from backend publish to client delivery.\n\nThis includes:\n- Pub/Sub propagation (~10-20ms)\n- Gateway processing (~10ms)\n- Network transmission (~20-50ms)\n- Total budget: 100ms",
      importance: 'critical',
      learningPoint: "Real-time means sub-second latency - every millisecond counts",
    },
    {
      id: 'broadcast-fanout',
      category: 'burst',
      question: "What's the largest broadcast scenario?",
      answer: "Largest scenario: **Broadcasting to 100K subscribers simultaneously**\n\nExample: Major live event stream\n- Single message published\n- Must fan out to 100K WebSocket connections\n- All deliveries should complete within 200ms\n- Gateway must handle the write amplification",
      importance: 'critical',
      insight: "Fan-out is the bottleneck - one message becomes 100K socket writes",
    },
    {
      id: 'connection-reliability',
      category: 'reliability',
      question: "What happens if a gateway server crashes?",
      answer: "When a gateway crashes:\n- **All connections on that server are lost** (could be 50K connections)\n- Clients must reconnect to a different gateway server\n- Use client-side exponential backoff to avoid thundering herd\n- Load balancer redirects reconnects to healthy servers\n\nTarget: 99.9% uptime for gateway layer.",
      importance: 'critical',
      learningPoint: "WebSocket is stateful - server crash means connection loss. Design for graceful degradation.",
    },
    {
      id: 'scaling-challenge',
      category: 'throughput',
      question: "How do we scale WebSocket gateways horizontally?",
      answer: "Scaling WebSockets is tricky because connections are stateful:\n\n**Challenge**: Client A on Gateway 1 needs message from Client B on Gateway 2\n\n**Solution**: Use shared Pub/Sub layer (Redis)\n- All gateways subscribe to message broker\n- When message published, all gateways receive it\n- Each gateway delivers to local connections\n- Enables cross-gateway communication",
      importance: 'critical',
      learningPoint: "Stateful connections require shared state layer for horizontal scaling",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-websocket', 'message-routing', 'heartbeat-mechanism'],
  criticalFRQuestionIds: ['core-websocket', 'message-routing', 'pub-sub-pattern'],
  criticalScaleQuestionIds: ['concurrent-connections', 'message-throughput', 'scaling-challenge'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Accept WebSocket connections',
      description: 'Upgrade HTTP to WebSocket and maintain persistent connections',
      emoji: '🔌',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Manage connection lifecycle',
      description: 'Handle connect, disconnect, and reconnect scenarios',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Route messages bidirectionally',
      description: 'Forward messages between clients and backend services',
      emoji: '↔️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Track connection state',
      description: 'Maintain user/session info and subscriptions',
      emoji: '📊',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Implement heartbeat mechanism',
      description: 'Detect dead connections via ping/pong',
      emoji: '💓',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Support pub/sub messaging',
      description: 'Broadcast messages to channel subscribers',
      emoji: '📡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million concurrent connections',
    writesPerDay: '43 billion messages',
    readsPerDay: '43 billion deliveries',
    peakMultiplier: 4,
    readWriteRatio: '1:1 (bidirectional)',
    calculatedWriteRPS: { average: 500000, peak: 2000000 },
    calculatedReadRPS: { average: 500000, peak: 2000000 },
    maxPayloadSize: '~4KB (typical message)',
    storagePerRecord: 'N/A (stateless gateway)',
    redirectLatencySLA: 'p99 < 100ms (delivery)',
    createLatencySLA: 'p99 < 50ms (send)',
  },

  architecturalImplications: [
    '✅ 10M connections → Multiple gateway servers with load balancer',
    '✅ Stateful connections → Sticky sessions on load balancer',
    '✅ Cross-gateway communication → Shared Redis Pub/Sub',
    '✅ Heartbeats → Periodic ping/pong for connection health',
    '✅ Message fan-out → Async delivery to avoid blocking',
    '✅ 99.9% uptime → Client reconnect logic + health checks',
  ],

  outOfScope: [
    'Message persistence (gateway is stateless)',
    'Message ordering guarantees (backend responsibility)',
    'End-to-end encryption (TLS termination only)',
    'Rate limiting per user (separate service)',
    'Protocol translation (WebSocket only, no polling fallback)',
    'Message compression (can add later)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that accepts connections and routes messages. Scaling to millions of connections and pub/sub complexity will come in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Accept WebSocket Connections
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to RealTime Systems Corp! You're building a WebSocket Gateway from scratch.",
  hook: "Your first client is ready to connect. They're waiting for that WebSocket handshake!",
  challenge: "Set up the foundation so clients can connect to your gateway.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your WebSocket Gateway is accepting connections!',
  achievement: 'Clients can now establish WebSocket connections',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'WebSocket protocol', after: 'Ready' },
  ],
  nextTeaser: "But the gateway doesn't know what to do with messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket Protocol: Upgrading from HTTP',
  conceptExplanation: `**WebSocket** is a protocol that provides full-duplex communication over a single TCP connection.

How it works:
1. Client sends HTTP request with \`Upgrade: websocket\` header
2. Server responds with \`101 Switching Protocols\`
3. Connection upgrades from HTTP to WebSocket
4. Both sides can now send messages anytime

Unlike HTTP:
- **Persistent**: Connection stays open (not request/response)
- **Bidirectional**: Both client and server can initiate messages
- **Low latency**: No connection overhead per message
- **Stateful**: Server maintains connection state`,

  whyItMatters: 'HTTP polling is inefficient for real-time apps. WebSocket enables true push notifications with minimal latency.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 100+ billion messages per day',
    howTheyDoIt: 'Uses custom WebSocket gateway layer built on Erlang, handling millions of concurrent connections per server',
  },

  keyPoints: [
    'WebSocket starts as HTTP upgrade request',
    'Connection remains open for bidirectional communication',
    'Each connection consumes server resources (memory + file descriptor)',
    'Gateway layer abstracts WebSocket complexity from backend',
  ],

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional protocol', icon: '🔌' },
    { title: 'HTTP Upgrade', explanation: 'Converts HTTP to WebSocket', icon: '⬆️' },
    { title: 'Full-Duplex', explanation: 'Both sides can send simultaneously', icon: '↔️' },
  ],
};

const step1: GuidedStep = {
  id: 'websocket-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Accept WebSocket connections',
    taskDescription: 'Add Client and WebSocket Gateway, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users establishing WebSocket connections', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as WebSocket Gateway accepting connections', displayName: 'WebSocket Gateway' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'WebSocket Gateway (App Server) added to canvas',
      'Client connected to WebSocket Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server (acting as WebSocket Gateway) onto the canvas',
    level2: 'Click the Client, then click the App Server to create a WebSocket connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Message Routing (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Connections are established, but messages just disappear!",
  hook: "A client sends 'Hello Gateway!' and... nothing happens. The gateway accepted the message but doesn't route it.",
  challenge: "Write the Python code to route messages and track connections.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your gateway is routing messages!',
  achievement: 'Messages now flow bidirectionally through the gateway',
  metrics: [
    { label: 'Message routing', after: 'Implemented' },
    { label: 'Connection tracking', after: 'Active' },
  ],
  nextTeaser: "But when the gateway restarts, all connections are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket Message Routing and Connection State',
  conceptExplanation: `The gateway needs to handle three key operations:

1. **on_connect(client_id, metadata)**:
   - Store connection in active connections map
   - Track user/session information
   - Return connection success

2. **on_message(client_id, message)**:
   - Route message to backend service
   - Handle client → server messages
   - Return acknowledgment

3. **on_disconnect(client_id)**:
   - Clean up connection state
   - Remove from active connections
   - Notify backend of disconnect

Connection state stored in memory (for now):
\`\`\`python
connections = {
  'user-123': {'socket': ws, 'subscriptions': ['room-1'], 'last_ping': time.now()},
  'user-456': {'socket': ws, 'subscriptions': ['room-2'], 'last_ping': time.now()},
}
\`\`\``,

  whyItMatters: 'Without connection tracking, the gateway can\'t deliver messages to specific clients or broadcast to groups.',

  famousIncident: {
    title: 'Facebook Messenger WebSocket Incident',
    company: 'Facebook',
    year: '2016',
    whatHappened: 'A bug in connection state management caused duplicate message deliveries. Some users received the same message dozens of times. Gateway wasn\'t properly tracking which messages were already delivered.',
    lessonLearned: 'Connection state must be accurate - bugs cause duplicate deliveries or lost messages.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Managing 5M concurrent WebSocket connections',
    howTheyDoIt: 'Built custom gateway servers in Elixir that maintain connection state in-memory, with graceful reconnect handling',
  },

  keyPoints: [
    'Gateway maintains map of active connections',
    'Each connection tracks user ID, metadata, and subscriptions',
    'Messages routed based on connection state',
    'Clean up state on disconnect to prevent memory leaks',
  ],

  quickCheck: {
    question: 'Why does the gateway need to track connection state?',
    options: [
      'To make it slower',
      'To deliver messages to the correct client connections',
      'To use more memory',
      'For debugging only',
    ],
    correctIndex: 1,
    explanation: 'Connection state maps user IDs to WebSocket connections, enabling message delivery to specific clients.',
  },

  keyConcepts: [
    { title: 'Connection Map', explanation: 'In-memory map of active connections', icon: '🗺️' },
    { title: 'Message Routing', explanation: 'Forward messages to correct destination', icon: '🧭' },
    { title: 'Lifecycle Events', explanation: 'connect/message/disconnect handlers', icon: '🔄' },
  ],
};

const step2: GuidedStep = {
  id: 'websocket-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-3: Route messages bidirectionally, FR-4: Track connection state',
    taskDescription: 'Configure WebSocket APIs and implement connection handlers',
    successCriteria: [
      'Click on WebSocket Gateway to open inspector',
      'Assign WebSocket /ws API endpoint',
      'Open the Python tab',
      'Implement on_connect(), on_message(), on_disconnect() functions',
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
    level1: 'Click on the WebSocket Gateway, then assign WebSocket /ws endpoint in the APIs tab',
    level2: 'After assigning the WebSocket API, implement the connection lifecycle handlers in Python tab',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['WS /ws'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Redis for Connection State
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes! Your gateway server crashed and restarted...",
  hook: "All 10,000 connected users were disconnected. Connection state is gone. They're all trying to reconnect at once!",
  challenge: "Add Redis to persist connection metadata and support failover.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Connection state is now resilient!',
  achievement: 'Redis provides shared state across gateway instances',
  metrics: [
    { label: 'State persistence', after: 'Enabled' },
    { label: 'Multi-gateway ready', after: '✓' },
  ],
  nextTeaser: "But heartbeats aren't implemented - dead connections linger forever...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Shared State with Redis for WebSocket Gateways',
  conceptExplanation: `In-memory connection state has problems:
- Lost on server crash
- Can't share across multiple gateway servers
- No way to know which gateway has which connection

**Redis as shared state layer**:
\`\`\`
Connection State in Redis:
  connections:user-123 → {'gateway': 'gw-1', 'channels': ['room-5'], 'last_ping': 1699999}
  connections:user-456 → {'gateway': 'gw-2', 'channels': ['room-5'], 'last_ping': 1699998}
\`\`\`

Benefits:
1. **Cross-gateway visibility** - All gateways see all connections
2. **Failover support** - State survives gateway crashes
3. **Horizontal scaling** - Add gateways without state conflicts

Why Redis?
- In-memory speed (sub-millisecond)
- Built-in data structures (hash, set)
- Pub/Sub capability (needed in next step)`,

  whyItMatters: 'Without shared state, you can only run one gateway server. Redis enables horizontal scaling.',

  famousIncident: {
    title: 'Slack WebSocket Gateway Scaling Crisis',
    company: 'Slack',
    year: '2014',
    whatHappened: 'Early Slack stored WebSocket state locally in each gateway. When they needed to add more gateways, messages couldn\'t route between gateways. A user on gateway-1 couldn\'t message a user on gateway-2.',
    lessonLearned: 'Shared state layer is essential for multi-gateway deployments. Use Redis or similar.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Managing millions of WebSocket connections',
    howTheyDoIt: 'Uses Redis cluster to track which gateway server holds each user\'s connection, enabling cross-gateway message delivery',
  },

  diagram: `
┌─────────────┐     ┌─────────────┐
│  Gateway 1  │     │  Gateway 2  │
│  (50K conn) │     │  (50K conn) │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
          ┌─────────────┐
          │    Redis    │
          │ (Shared     │
          │  State)     │
          └─────────────┘
  All gateways read/write connection state
`,

  keyPoints: [
    'Redis stores connection metadata (user, gateway, channels)',
    'All gateways share same Redis instance/cluster',
    'Enables cross-gateway communication',
    'Connection state survives individual gateway crashes',
  ],

  quickCheck: {
    question: 'Why can\'t we just store connection state in memory on each gateway?',
    options: [
      'Memory is too expensive',
      'State would be lost on crash and isolated per gateway',
      'Redis is faster',
      'In-memory storage is deprecated',
    ],
    correctIndex: 1,
    explanation: 'In-memory state is isolated to one server and lost on crash. Redis provides shared, persistent state across all gateways.',
  },

  keyConcepts: [
    { title: 'Shared State', explanation: 'Connection info accessible by all gateways', icon: '🌐' },
    { title: 'Redis', explanation: 'In-memory data store for connection metadata', icon: '💾' },
    { title: 'Failover', explanation: 'State survives gateway server crashes', icon: '🔄' },
  ],
};

const step3: GuidedStep = {
  id: 'websocket-gateway-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-4: Track connection state (now with persistence)',
    taskDescription: 'Add Redis cache and connect the WebSocket Gateway to it',
    componentsNeeded: [
      { type: 'cache', reason: 'Store connection state and enable cross-gateway communication', displayName: 'Redis' },
    ],
    successCriteria: [
      'Redis cache component added to canvas',
      'WebSocket Gateway connected to Redis',
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
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Click WebSocket Gateway, then click Redis to store connection state',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Implement Heartbeats
// =============================================================================

const step4Story: StoryContent = {
  emoji: '👻',
  scenario: "Your Redis is filling up with 'zombie' connections!",
  hook: "Users close their laptops and walk away. WebSocket connections don't close cleanly. Your gateway thinks 50,000 dead connections are still alive!",
  challenge: "Implement heartbeat ping/pong to detect and clean up dead connections.",
  illustration: 'zombie-connections',
};

const step4Celebration: CelebrationContent = {
  emoji: '💓',
  message: 'Heartbeats keep connections healthy!',
  achievement: 'Dead connections are now detected and cleaned up automatically',
  metrics: [
    { label: 'Zombie connections', before: '50,000', after: '0' },
    { label: 'Connection health', after: 'Monitored' },
  ],
  nextTeaser: "But you still can't broadcast messages to multiple users...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket Heartbeats: Detecting Dead Connections',
  conceptExplanation: `**Problem**: Network issues don't always trigger disconnect events. A user's laptop might sleep, their wifi might drop, but the socket stays "open" on the server.

**Solution**: Heartbeats (PING/PONG)

How it works:
1. **Every 30 seconds**: Gateway sends PING frame to client
2. **Client responds**: Sends PONG frame back
3. **Timeout detection**: If no PONG within 10 seconds → connection is dead
4. **Cleanup**: Close dead socket, remove from Redis

WebSocket has built-in PING/PONG frames:
\`\`\`python
# Gateway sends PING
await websocket.ping()

# Wait for PONG (timeout 10s)
try:
  await asyncio.wait_for(websocket.pong(), timeout=10)
  # Connection alive!
except TimeoutError:
  # Connection dead, cleanup
  await cleanup_connection(user_id)
\`\`\`

Why it matters:
- **Resource cleanup**: Dead connections consume memory and file descriptors
- **Accurate state**: Know which users are truly online
- **Fast detection**: Detect failures in 10-30 seconds`,

  whyItMatters: 'Without heartbeats, dead connections accumulate, wasting resources and giving incorrect online status.',

  famousIncident: {
    title: 'WhatsApp Connection Leak',
    company: 'WhatsApp',
    year: '2015',
    whatHappened: 'A bug in heartbeat logic caused dead connections to not be cleaned up properly. Servers ran out of file descriptors (ulimit reached), preventing new connections. Outage affected millions.',
    lessonLearned: 'Heartbeats must be reliable. Always clean up on timeout. Monitor file descriptor usage.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Managing connection health',
    howTheyDoIt: 'Sends heartbeat every 41.25 seconds, expects response within 60 seconds. Aggressive cleanup of unresponsive connections.',
  },

  diagram: `
Timeline of Heartbeat:

T=0s:   Gateway sends PING
        ↓
T=1s:   Client receives PING
T=1s:   Client sends PONG
        ↓
T=2s:   Gateway receives PONG ✓ (connection healthy)

--- Next heartbeat ---

T=30s:  Gateway sends PING
        ↓
T=40s:  No PONG received... ⏳
T=45s:  Still no PONG... ⏳
T=50s:  TIMEOUT! Connection dead ❌
        Gateway closes socket, cleans up state
`,

  keyPoints: [
    'Send PING every 30 seconds to all connections',
    'Expect PONG response within 10 seconds',
    'Clean up connections that fail heartbeat',
    'Update last_ping timestamp in Redis',
  ],

  quickCheck: {
    question: 'Why do we need heartbeats if WebSocket has disconnect events?',
    options: [
      'Disconnect events are deprecated',
      'Network failures don\'t always trigger disconnect events',
      'Heartbeats make connections faster',
      'It\'s just a best practice with no real purpose',
    ],
    correctIndex: 1,
    explanation: 'Network issues (wifi drops, laptop sleep) may not trigger clean disconnect. Heartbeats actively detect these silent failures.',
  },

  keyConcepts: [
    { title: 'PING/PONG', explanation: 'WebSocket frames for connection health', icon: '🏓' },
    { title: 'Heartbeat', explanation: 'Periodic check that connection is alive', icon: '💓' },
    { title: 'Timeout', explanation: 'Max time to wait for PONG response', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'websocket-gateway-step-4',
  stepNumber: 4,
  frIndex: 4,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Implement heartbeat mechanism',
    taskDescription: 'Update Python code to implement PING/PONG heartbeat logic',
    successCriteria: [
      'Click on WebSocket Gateway',
      'Open Python tab',
      'Implement heartbeat_check() function with PING/PONG logic',
      'Add timeout detection and cleanup for dead connections',
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
    level1: 'Open the Python tab in WebSocket Gateway and find the heartbeat_check() function',
    level2: 'Implement PING send, PONG wait with timeout, and connection cleanup on failure',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Pub/Sub for Broadcasting
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📡',
  scenario: "You're building a chat room with 1,000 users!",
  hook: "When someone sends a message, it needs to go to all 1,000 users. Your gateway is trying to send 1,000 individual messages. This is SLOW!",
  challenge: "Implement Redis Pub/Sub to efficiently broadcast messages.",
  illustration: 'broadcast-problem',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Pub/Sub enables efficient broadcasting!',
  achievement: 'Messages can now be broadcast to thousands of subscribers',
  metrics: [
    { label: 'Broadcast efficiency', before: 'O(n) backend calls', after: 'O(1) publish' },
    { label: 'Fan-out', after: 'Gateway-level' },
  ],
  nextTeaser: "But a single gateway can't handle millions of connections...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Pub/Sub Pattern for WebSocket Broadcasting',
  conceptExplanation: `**Problem**: How do you send one message to 1,000 users efficiently?

**Naive approach** (doesn't scale):
\`\`\`
for each user in chat_room:
  backend.send_message(user_id, message)  # 1,000 API calls!
\`\`\`

**Pub/Sub pattern** (scales):
\`\`\`
# Backend publishes once
redis.publish('chat-room-123', message)

# All gateways subscribed to 'chat-room-123' receive it
# Each gateway delivers to local connections
\`\`\`

How it works:
1. **Client subscribes**: "Subscribe me to chat-room-123"
   - Gateway adds user to local subscription list
   - Gateway subscribes to Redis channel (if not already)

2. **Backend publishes**: "Publish to chat-room-123"
   - Message goes to Redis Pub/Sub
   - Redis fans out to all subscribed gateways
   - Each gateway delivers to local subscribers

3. **Client unsubscribes**: "Unsubscribe from chat-room-123"
   - Gateway removes from local list
   - If no more local subscribers, unsubscribe from Redis

Benefits:
- **O(1) publish** - Backend publishes once regardless of subscriber count
- **Gateway fan-out** - Gateways handle the heavy lifting
- **Cross-gateway** - Works across multiple gateway servers`,

  whyItMatters: 'Without Pub/Sub, broadcasting to 100K users would require 100K API calls from backend. Pub/Sub makes it one publish.',

  famousIncident: {
    title: 'Twitch Chat Scaling Challenge',
    company: 'Twitch',
    year: '2017',
    whatHappened: 'Popular streams had chat rooms with 100K+ concurrent viewers. Early architecture tried to send messages individually - gateways couldn\'t keep up. Chat latency reached 30+ seconds.',
    lessonLearned: 'Rebuilt with Pub/Sub architecture. One publish fans out to all gateways, each delivering to local connections. Brought latency down to <100ms.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Broadcasting to large channels',
    howTheyDoIt: 'Uses Redis Pub/Sub for channel-based message delivery. Each gateway subscribes to channels that have local users, receives published messages, and fans out to WebSocket connections.',
  },

  diagram: `
Backend publishes message to 'chat-room-123':
                 ┌────────────┐
                 │  Backend   │
                 │  Service   │
                 └─────┬──────┘
                       │ publish('chat-room-123', msg)
                       ▼
                 ┌────────────┐
                 │   Redis    │
                 │  Pub/Sub   │
                 └─────┬──────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │Gateway 1 │  │Gateway 2 │  │Gateway 3 │
   │(300 local│  │(400 local│  │(300 local│
   │  users)  │  │  users)  │  │  users)  │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │             │
        └─────────────┴─────────────┘
              Fan-out to all
          1,000 WebSocket connections
`,

  keyPoints: [
    'Backend publishes message to channel (topic)',
    'Redis fans out to all subscribed gateways',
    'Each gateway delivers to local WebSocket connections',
    'Decouples message producers from consumers',
  ],

  quickCheck: {
    question: 'Why is Pub/Sub more efficient than individual message sends?',
    options: [
      'It uses less memory',
      'Backend publishes once instead of N times for N users',
      'It\'s faster because Redis is in-memory',
      'WebSocket connections are faster with Pub/Sub',
    ],
    correctIndex: 1,
    explanation: 'Pub/Sub allows backend to publish once. Redis and gateways handle fan-out, avoiding N API calls from backend.',
  },

  keyConcepts: [
    { title: 'Pub/Sub', explanation: 'Publish/Subscribe messaging pattern', icon: '📡' },
    { title: 'Channel', explanation: 'Topic that clients subscribe to', icon: '📺' },
    { title: 'Fan-Out', explanation: 'Delivering one message to many recipients', icon: '🌟' },
  ],
};

const step5: GuidedStep = {
  id: 'websocket-gateway-step-5',
  stepNumber: 5,
  frIndex: 5,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-6: Support pub/sub messaging',
    taskDescription: 'Configure Redis Pub/Sub and implement subscribe/publish handlers',
    successCriteria: [
      'Redis cache already connected (configured for Pub/Sub)',
      'Click WebSocket Gateway and open Python tab',
      'Implement subscribe(), publish(), and handle_pubsub_message() functions',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Redis is already connected. Open Python tab and implement Pub/Sub message handlers',
    level2: 'Implement subscribe() to add client to channel, publish() to broadcast, and handle_pubsub_message() to deliver to local connections',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer with Sticky Sessions
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single gateway server is overwhelmed!",
  hook: "50,000 concurrent connections on one server. CPU at 95%. New connections timing out. You need more servers!",
  challenge: "Add a load balancer with sticky sessions to distribute connections.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Load balancer distributes connections!',
  achievement: 'Sticky sessions ensure clients stay on same gateway',
  metrics: [
    { label: 'Single server bottleneck', before: 'Yes', after: 'No' },
    { label: 'Sticky sessions', after: 'Enabled' },
  ],
  nextTeaser: "But can this scale to millions of connections?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing WebSockets with Sticky Sessions',
  conceptExplanation: `**Challenge**: WebSocket connections are stateful and long-lived.

Unlike HTTP where each request is independent, WebSocket:
- Connection lasts minutes/hours/days
- Server maintains connection state
- Can't switch servers mid-connection

**Solution**: Sticky Sessions (Session Affinity)

How it works:
1. Client connects → Load balancer picks Gateway 1
2. All messages from that client → Always route to Gateway 1
3. Connection stays on Gateway 1 until disconnect

Sticky session methods:
- **IP hash**: Hash client IP → same gateway
- **Cookie-based**: Set cookie on first connection
- **Connection ID**: Track in load balancer state

\`\`\`
Client A (IP: 1.2.3.4)  ────┐
                             ├──→ Gateway 1 (hash(1.2.3.4) % 3 = 1)
Client B (IP: 1.2.3.5)  ────┤
                             │
Client C (IP: 1.2.3.6)  ─────┴──→ Gateway 2 (hash(1.2.3.6) % 3 = 2)
\`\`\`

Why sticky sessions matter:
- **State locality**: Connection state on same server
- **No state sync**: Don't need to sync connection state across gateways
- **Simpler logic**: Each gateway manages its own connections`,

  whyItMatters: 'Without sticky sessions, a client\'s messages might go to different gateways, breaking the WebSocket connection.',

  famousIncident: {
    title: 'Discord Connection Chaos',
    company: 'Discord',
    year: '2016',
    whatHappened: 'Misconfigured load balancer didn\'t use sticky sessions. Client\'s messages randomly went to different gateway servers, causing connection errors and message delivery failures.',
    lessonLearned: 'Sticky sessions are MANDATORY for WebSocket load balancing. Test thoroughly during deployment.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Load balancing millions of WebSocket connections',
    howTheyDoIt: 'Uses Nginx with IP hash sticky sessions. Each gateway handles 50K-100K connections, scaled to hundreds of gateways.',
  },

  diagram: `
                  ┌──────────────────┐
                  │  Load Balancer   │
                  │ (Sticky Session) │
                  └────────┬─────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼────┐   ┌─────▼────┐   ┌─────▼────┐
      │Gateway 1 │   │Gateway 2 │   │Gateway 3 │
      │(30K conn)│   │(30K conn)│   │(30K conn)│
      └──────────┘   └──────────┘   └──────────┘
            │              │              │
            └──────────────┴──────────────┘
                          │
                    ┌─────▼─────┐
                    │   Redis   │
                    │  Pub/Sub  │
                    └───────────┘
`,

  keyPoints: [
    'Sticky sessions keep client on same gateway server',
    'Use IP hash or cookie-based routing',
    'Essential for stateful WebSocket connections',
    'Each gateway handles subset of total connections',
  ],

  quickCheck: {
    question: 'Why do WebSocket connections need sticky sessions?',
    options: [
      'To make them faster',
      'To reduce costs',
      'WebSocket is stateful - client must stay on same server',
      'It\'s just a best practice',
    ],
    correctIndex: 2,
    explanation: 'WebSocket connections are stateful and long-lived. The server holds connection state, so the client must stay on the same server throughout the connection.',
  },

  keyConcepts: [
    { title: 'Sticky Session', explanation: 'Client always routes to same server', icon: '📌' },
    { title: 'IP Hash', explanation: 'Route based on client IP address', icon: '#️⃣' },
    { title: 'Stateful', explanation: 'Server maintains connection state', icon: '💾' },
  ],
};

const step6: GuidedStep = {
  id: 'websocket-gateway-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need horizontal scaling',
    taskDescription: 'Add a Load Balancer between Client and WebSocket Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute connections with sticky sessions', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to WebSocket Gateway',
      'Sticky sessions enabled',
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
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and WebSocket Gateway',
    level2: 'Reconnect: Client → Load Balancer → WebSocket Gateway. Configure sticky sessions for WebSocket.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Scale Gateway Instances
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "You've gone viral! 1 million users trying to connect!",
  hook: "Load balancer is routing to only ONE gateway server. That server can't handle more than 50K connections!",
  challenge: "Add multiple WebSocket Gateway instances to distribute the load.",
  illustration: 'viral-growth',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Your gateway can scale to millions!',
  achievement: 'Multiple gateway instances handle connections in parallel',
  metrics: [
    { label: 'Gateway capacity', before: '50K connections', after: '1M+ connections' },
    { label: 'Gateway instances', after: 'Multiple' },
  ],
  nextTeaser: "But is this cost-effective? Can we optimize?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for WebSocket Gateways',
  conceptExplanation: `**Scaling WebSockets horizontally** is challenging because connections are stateful.

Architecture with multiple gateways:
\`\`\`
Load Balancer (sticky sessions)
    ↓
┌───┼───┬───┼───┬───┼───┐
│   │   │   │   │   │   │
Gateway Gateway Gateway ... (N gateways)
   1      2      3
(50K)  (50K)  (50K)  = 150K total connections
    │       │       │
    └───────┴───────┘
           │
       Redis Pub/Sub
\`\`\`

How it works:
1. **Load balancer**: Distributes new connections across gateways
2. **Each gateway**: Handles 50K connections independently
3. **Redis Pub/Sub**: Enables cross-gateway message delivery
4. **Sticky sessions**: Keep client on same gateway

Example message flow (cross-gateway):
- User A on Gateway 1 sends message to chat-room-5
- Gateway 1 publishes to Redis channel 'chat-room-5'
- Gateways 1, 2, 3 (all subscribed) receive message
- Each gateway delivers to local users in chat-room-5
- User B on Gateway 2 receives the message

Capacity planning:
- Each gateway: 50K connections = 4GB RAM
- For 1M connections: 20 gateways
- For 10M connections: 200 gateways

Auto-scaling:
- Scale up: When avg connections/gateway > 40K
- Scale down: When avg connections/gateway < 20K
- Graceful shutdown: Stop accepting new connections, drain existing`,

  whyItMatters: 'A single server can only handle 50K-100K WebSocket connections. Horizontal scaling is essential for millions of users.',

  famousIncident: {
    title: 'WhatsApp Erlang Gateway Scaling',
    company: 'WhatsApp',
    year: '2011',
    whatHappened: 'WhatsApp achieved 2 million concurrent connections on a SINGLE Erlang server - a world record at the time. They eventually scaled to hundreds of servers handling hundreds of millions of connections.',
    lessonLearned: 'Choose the right technology (Erlang built for concurrency) and scale horizontally when needed.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Handling 5M concurrent connections',
    howTheyDoIt: 'Runs hundreds of Elixir gateway servers, each handling 50K-100K connections. Auto-scales based on connection count. Uses Redis for cross-gateway Pub/Sub.',
  },

  diagram: `
Connection Distribution:

┌────────────────────────────────────────┐
│       Load Balancer (Sticky)           │
└─────────────┬──────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│  GW1  │ │  GW2  │ │  GW3  │ │  GW4  │
│ 50K   │ │ 50K   │ │ 50K   │ │ 50K   │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │         │         │
    └─────────┴─────────┴─────────┘
                 │
         ┌───────▼────────┐
         │  Redis Pub/Sub │
         └────────────────┘

Total Capacity: 200K concurrent connections
`,

  keyPoints: [
    'Each gateway runs as independent instance',
    'Load balancer distributes new connections',
    'Redis Pub/Sub enables cross-gateway messaging',
    'Auto-scale based on connection count per gateway',
  ],

  quickCheck: {
    question: 'How do messages get from User A on Gateway 1 to User B on Gateway 2?',
    options: [
      'Direct connection between gateways',
      'Gateway 1 publishes to Redis, Gateway 2 receives and delivers',
      'Load balancer forwards the message',
      'User A\'s message goes to Gateway 2 directly',
    ],
    correctIndex: 1,
    explanation: 'Redis Pub/Sub acts as message bus. Gateway 1 publishes, all gateways (including Gateway 2) receive and deliver to local connections.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more gateway servers', icon: '➡️' },
    { title: 'Connection Distribution', explanation: 'Load balancer spreads connections', icon: '⚖️' },
    { title: 'Cross-Gateway Messaging', explanation: 'Redis Pub/Sub connects gateways', icon: '🌉' },
  ],
};

const step7: GuidedStep = {
  id: 'websocket-gateway-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from multiple gateway instances',
    taskDescription: 'Configure WebSocket Gateway to run multiple instances',
    successCriteria: [
      'Click on WebSocket Gateway component',
      'Open Configuration tab',
      'Set instance count to 3 or more',
      'Verify load balancer distributes across instances',
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
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on WebSocket Gateway and find the instance count configuration',
    level2: 'Set instance count to at least 3. Each instance can handle ~50K connections independently.',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Your CFO is shocked! Monthly WebSocket Gateway bill is $50,000.",
  hook: "Running 20 gateway instances 24/7 is expensive. Traffic drops 80% at night. Can we optimize?",
  challenge: "Optimize your architecture to stay under budget while maintaining reliability.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a scalable WebSocket Gateway!',
  achievement: 'A production-ready real-time messaging infrastructure',
  metrics: [
    { label: 'Monthly cost', before: '$50K', after: 'Optimized' },
    { label: 'Message latency', after: '<100ms' },
    { label: 'Capacity', after: '10M connections' },
    { label: 'Availability', after: '99.9%' },
  ],
  nextTeaser: "You've mastered WebSocket Gateway system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization for WebSocket Infrastructure',
  conceptExplanation: `WebSocket gateways can be expensive. Optimization strategies:

1. **Right-size instances**
   - Don't over-provision
   - Monitor CPU/Memory/Connection count
   - Gateway instances typically need: 4-8 CPU cores, 8-16GB RAM

2. **Auto-scaling**
   - Scale up during peak hours (9am-9pm)
   - Scale down at night (80% less traffic)
   - Save 30-50% on compute costs

3. **Connection limits**
   - Set max connections per gateway (50K)
   - Prevents resource exhaustion
   - Graceful degradation when at capacity

4. **Redis optimization**
   - Use Redis cluster for high availability
   - Pub/Sub messages are ephemeral (not stored)
   - Connection state can use TTL for auto-cleanup

5. **Monitoring and alerting**
   - Track: connections/gateway, message latency, error rate
   - Alert: CPU > 80%, connections > 45K, error rate > 1%
   - Prevents overload and enables proactive scaling

Cost breakdown (10M connections):
- 200 gateway instances × $100/month = $20K
- Redis cluster (5 nodes) × $500/month = $2.5K
- Load balancer = $500/month
- Total: ~$23K/month

With auto-scaling (night 80% reduction):
- Day: 200 instances
- Night: 40 instances
- Average: 120 instances × $100 = $12K
- Savings: ~50%`,

  whyItMatters: 'Operating at scale is expensive. Optimization means the difference between profitability and burning money.',

  realWorldExample: {
    company: 'Discord',
    scenario: 'Managing infrastructure costs',
    howTheyDoIt: 'Uses aggressive auto-scaling based on connection patterns. Optimized Elixir/Erlang for low memory footprint. One server handles 2-3x more connections than typical Node.js implementations.',
  },

  keyPoints: [
    'Auto-scale based on traffic patterns (day vs night)',
    'Right-size instances - don\'t over-provision',
    'Set connection limits per gateway',
    'Monitor and optimize continuously',
  ],

  quickCheck: {
    question: 'Why can auto-scaling save 50% for WebSocket gateways?',
    options: [
      'Auto-scaling is free',
      'Traffic drops significantly during off-peak hours',
      'Gateways use less memory when auto-scaled',
      'It makes connections faster',
    ],
    correctIndex: 1,
    explanation: 'WebSocket traffic follows user activity patterns. Night/weekend traffic is 70-80% lower. Auto-scaling reduces instance count during low traffic.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Adjust instances based on load', icon: '📊' },
    { title: 'Right-Sizing', explanation: 'Match instance size to needs', icon: '📏' },
    { title: 'Connection Limits', explanation: 'Prevent resource exhaustion', icon: '🚧' },
  ],
};

const step8: GuidedStep = {
  id: 'websocket-gateway-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $15K/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $15,000/month',
      'Maintain all performance and reliability requirements',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review instance counts, instance sizes, and Redis configuration',
    level2: 'Consider: fewer instances with auto-scaling, smaller instance types, optimized Redis cluster size',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const websocketGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'websocket-gateway',
  title: 'Design a WebSocket Gateway',
  description: 'Build a scalable real-time messaging gateway with pub/sub, heartbeats, and connection management',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Engineer at RealTime Systems Corp!",
    scenario: "Your mission: Build a WebSocket Gateway that handles 10 million concurrent connections and routes messages with <100ms latency.",
    challenge: "Can you design a system that scales WebSocket connections horizontally while maintaining connection state?",
  },

  requirementsPhase: websocketGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'WebSocket Protocol',
    'Persistent Connections',
    'Connection State Management',
    'Heartbeat Mechanism (PING/PONG)',
    'Pub/Sub Pattern',
    'Redis Pub/Sub',
    'Load Balancing',
    'Sticky Sessions',
    'Horizontal Scaling',
    'Cross-Gateway Messaging',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution',
    'Chapter 5: Replication',
    'Chapter 8: The Trouble with Distributed Systems',
    'Chapter 11: Stream Processing',
  ],
};

export default websocketGatewayGuidedTutorial;
