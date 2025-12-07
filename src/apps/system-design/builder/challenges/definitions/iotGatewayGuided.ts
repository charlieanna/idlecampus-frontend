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
 * IoT Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building an IoT Gateway for smart home devices. Each step tells a story that motivates the task.
 *
 * Focus Areas:
 * - MQTT/CoAP protocols for device communication
 * - Device authentication and security
 * - Telemetry ingestion and processing
 * - Real-time data streaming
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - FRs satisfied!
 * Steps 4+: Apply NFRs (authentication, scaling, persistence, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SECURE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const iotGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an IoT Gateway for smart home devices like sensors, thermostats, and cameras",

  interviewer: {
    name: 'Maya Patel',
    role: 'IoT Platform Lead',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'device-communication',
      category: 'functional',
      question: "What's the main purpose of an IoT Gateway? What does it do?",
      answer: "An IoT Gateway is the bridge between IoT devices and the cloud. It:\n1. **Receives telemetry**: Devices send sensor data (temperature, motion, etc.)\n2. **Sends commands**: Cloud sends control commands to devices (turn on lights, adjust thermostat)\n3. **Protocol translation**: Devices use lightweight protocols (MQTT, CoAP), gateway translates to HTTP/gRPC for cloud",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "IoT gateways bridge the gap between resource-constrained devices and cloud systems",
    },
    {
      id: 'device-protocols',
      category: 'functional',
      question: "What protocols do IoT devices use to communicate?",
      answer: "IoT devices use lightweight protocols optimized for low power and bandwidth:\n- **MQTT**: Publish/Subscribe messaging, popular for sensors\n- **CoAP**: Like HTTP but for constrained devices, uses UDP\n- **WebSockets**: For devices that need bidirectional communication\n\nThese are much lighter than HTTP - critical for battery-powered sensors!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "IoT protocols are designed for low power, low bandwidth environments",
    },
    {
      id: 'device-authentication',
      category: 'functional',
      question: "How do we know a device is legitimate and not a hacker trying to send fake data?",
      answer: "Device authentication is critical! Each device must prove its identity:\n1. **Device certificates**: Each device has a unique certificate signed by our CA\n2. **API keys/tokens**: Devices include authentication tokens in messages\n3. **Device registry**: Gateway checks if device ID is registered before accepting data\n\nWithout authentication, anyone could send fake sensor data or control your smart home!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Authentication prevents unauthorized devices from compromising your IoT network",
    },

    // IMPORTANT - Clarifications
    {
      id: 'telemetry-types',
      category: 'clarification',
      question: "What kind of data do devices send? How often?",
      answer: "Devices send different types of telemetry:\n- **Temperature sensors**: Send every 5 minutes (low frequency)\n- **Motion sensors**: Send on event (when motion detected)\n- **Cameras**: Send continuously (video streams)\n- **Smart meters**: Send every second (high frequency)\n\nFrequency varies widely - design must handle both low and high frequency data.",
      importance: 'important',
      insight: "IoT systems must handle variable data rates from different device types",
    },
    {
      id: 'command-delivery',
      category: 'clarification',
      question: "When we send a command to a device (like 'turn on lights'), does it happen immediately?",
      answer: "Not always! IoT devices are often offline or sleeping to save battery. Commands might be:\n- **Immediate**: Device is online, receives command in milliseconds\n- **Delayed**: Device is sleeping, receives command when it wakes up (could be minutes)\n- **Failed**: Device is offline, command expires after timeout\n\nWe need to handle all three cases gracefully.",
      importance: 'important',
      insight: "IoT command delivery is 'best effort' due to device constraints",
    },
    {
      id: 'data-persistence',
      category: 'clarification',
      question: "Do we need to store all telemetry data? Or just process and forward it?",
      answer: "For the MVP, we should:\n1. **Buffer recent data**: Keep last 1 hour of telemetry for retry/recovery\n2. **Forward to cloud**: Send telemetry to cloud for long-term storage\n3. **Don't store forever locally**: Gateway has limited storage\n\nCloud handles long-term storage and analytics. Gateway is a processing bridge.",
      importance: 'important',
      insight: "IoT gateways are stateless processors, not long-term storage",
    },

    // SCOPE
    {
      id: 'scope-home-vs-industrial',
      category: 'scope',
      question: "Is this for smart homes or industrial IoT?",
      answer: "Let's focus on smart homes for now. Typical home has:\n- 10-100 devices\n- Low to medium data rates\n- WiFi/Zigbee/Bluetooth connectivity\n\nIndustrial IoT (factories) would need different design (thousands of devices, higher reliability).",
      importance: 'nice-to-have',
      insight: "Smart home IoT is simpler than industrial, good starting point",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-devices',
      category: 'throughput',
      question: "How many devices should one gateway support?",
      answer: "Target: 100 devices per gateway (typical large smart home)",
      importance: 'critical',
      learningPoint: "This tells you the connection and message processing capacity needed",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages per second should we handle?",
      answer: "Conservative estimate:\n- 100 devices × average 1 message/minute = ~2 messages/sec average\n- Peak: Some devices burst 10 messages/sec = ~50 messages/sec peak",
      importance: 'critical',
      calculation: {
        formula: "100 devices × 1 msg/min ÷ 60 = 1.67 msg/sec avg",
        result: "~2 msg/sec average, ~50 msg/sec peak",
      },
      learningPoint: "IoT is typically low throughput but must handle bursts",
    },

    // 2. LATENCY
    {
      id: 'latency-telemetry',
      category: 'latency',
      question: "How fast should telemetry reach the cloud?",
      answer: "Most telemetry: p99 < 5 seconds is fine\nCritical alerts (smoke detector): p99 < 500ms",
      importance: 'critical',
      learningPoint: "Different telemetry types have different latency needs",
    },
    {
      id: 'latency-commands',
      category: 'latency',
      question: "How fast should commands reach devices?",
      answer: "Interactive commands (turn on lights): p99 < 1 second\nScheduled commands (night mode): p99 < 5 seconds",
      importance: 'important',
      learningPoint: "User-initiated commands need lower latency than scheduled ones",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['device-communication', 'device-protocols', 'device-authentication'],
  criticalFRQuestionIds: ['device-communication', 'device-protocols', 'device-authentication'],
  criticalScaleQuestionIds: ['throughput-devices', 'throughput-messages', 'latency-telemetry'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Devices can send telemetry',
      description: 'IoT devices can send sensor data (temperature, motion, etc.) to the gateway',
      emoji: '📡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cloud can send commands',
      description: 'Cloud backend can send control commands to devices through the gateway',
      emoji: '📤',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support MQTT and CoAP',
      description: 'Gateway supports both MQTT (publish/subscribe) and CoAP (request/response) protocols',
      emoji: '🔌',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Authenticate devices',
      description: 'Every device must authenticate before sending/receiving data',
      emoji: '🔐',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Buffer telemetry data',
      description: 'Gateway buffers recent telemetry for retry and recovery',
      emoji: '💾',
    },
  ],

  scaleMetrics: {
    devicesPerGateway: '100',
    averageMessagesPerSecond: '2',
    peakMessagesPerSecond: '50',
    telemetryLatencySLA: 'p99 < 5s (critical: < 500ms)',
    commandLatencySLA: 'p99 < 1s',
  },

  architecturalImplications: [
    '✅ Low throughput (2-50 msg/sec) → Single server can handle',
    '✅ MQTT requires persistent connections → WebSocket or MQTT broker',
    '✅ CoAP uses UDP → Need UDP listener',
    '✅ Device auth is critical → TLS certificates + device registry',
    '✅ Commands to sleeping devices → Need message queue',
  ],

  outOfScope: [
    'Industrial IoT (thousands of devices)',
    'Edge analytics (v2)',
    'OTA firmware updates (v2)',
    'Multi-gateway orchestration (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that receives MQTT messages and forwards them. Once it works, we'll add authentication, persistence, and handle scale. This is the right way to approach IoT systems: functionality first, security second, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Devices to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, IoT engineer! You've been hired to build an IoT Gateway for smart home devices.",
  hook: "Your first task: get devices connected. Smart thermostats, door sensors, and cameras need to talk to your gateway.",
  challenge: "Set up the basic infrastructure: Devices → IoT Gateway → Cloud Backend",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your gateway is online!",
  achievement: "Devices can now connect to your IoT Gateway",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive connections', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know how to handle MQTT messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'IoT Gateway Architecture: The Bridge',
  conceptExplanation: `An **IoT Gateway** sits between devices and the cloud. It's a specialized server that:

1. **Receives device data**: Sensors send telemetry using lightweight protocols (MQTT, CoAP)
2. **Protocol translation**: Converts MQTT/CoAP to HTTP/gRPC for cloud
3. **Local processing**: Filters, aggregates, and validates data
4. **Forwards to cloud**: Sends processed data to backend for storage

Think of it as a translator and traffic controller for your IoT devices.`,

  whyItMatters: 'Without a gateway, thousands of battery-powered sensors would need to maintain direct internet connections to the cloud - draining batteries and overwhelming the backend.',

  keyPoints: [
    'IoT Gateway bridges resource-constrained devices and cloud backends',
    'Handles protocol translation (MQTT/CoAP → HTTP)',
    'Provides local buffering and processing',
    'Reduces cloud bandwidth and costs',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
│   Devices   │ ──────▶ │  IoT Gateway    │ ──────▶ │    Cloud    │
│ (MQTT/CoAP) │ ◀────── │  (Translator)   │ ◀────── │   Backend   │
└─────────────┘         └─────────────────┘         └─────────────┘
`,

  keyConcepts: [
    {
      title: 'Protocol Translation',
      explanation: 'Convert lightweight IoT protocols to standard cloud APIs',
      icon: '🔄',
    },
    {
      title: 'Edge Processing',
      explanation: 'Process data locally before sending to cloud',
      icon: '⚡',
    },
  ],

  quickCheck: {
    question: 'Why do we need an IoT Gateway instead of direct device-to-cloud connection?',
    options: [
      'Gateways are cheaper than cloud',
      'Devices use lightweight protocols that need translation',
      'Cloud cannot handle IoT data',
      'Gateways are faster than cloud',
    ],
    correctIndex: 1,
    explanation: 'IoT devices use MQTT/CoAP for efficiency, but cloud backends typically use HTTP/gRPC. The gateway translates between these protocols.',
  },
};

const step1: GuidedStep = {
  id: 'iot-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Devices can connect to gateway and gateway can reach cloud',
    taskDescription: 'Set up the basic data flow: Client (Devices) → App Server (Gateway) → Backend',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Acts as IoT Gateway', displayName: 'IoT Gateway' },
      { type: 'app_server', reason: 'Cloud backend', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'Devices send telemetry' },
      { from: 'IoT Gateway', to: 'Cloud Backend', reason: 'Gateway forwards data' },
    ],
    successCriteria: ['Add Devices, Gateway, Backend', 'Connect: Devices → Gateway → Backend'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Create the data flow path: Devices → Gateway → Cloud',
    level2: 'Add Client (devices), App Server (gateway), App Server (backend), then connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement MQTT Protocol Handler
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📡',
  scenario: "Your gateway is connected, but it's just an empty box!",
  hook: "Smart thermostats are trying to send temperature data via MQTT, but your gateway doesn't speak MQTT yet. The messages are being dropped!",
  challenge: "Implement an MQTT broker in your gateway to receive and process device telemetry.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "MQTT is working!",
  achievement: "Your gateway now receives MQTT messages from devices",
  metrics: [
    { label: 'MQTT protocol', after: 'Implemented' },
    { label: 'Messages received', after: '✓' },
  ],
  nextTeaser: "Great! But some devices use CoAP, not MQTT...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'MQTT: The Pub/Sub Protocol for IoT',
  conceptExplanation: `**MQTT (Message Queuing Telemetry Transport)** is the most popular IoT protocol.

**How it works:**
1. **Publish/Subscribe model**: Devices publish to topics, subscribers receive messages
2. **Topics**: Hierarchical like "home/bedroom/temperature"
3. **QoS Levels**:
   - QoS 0: Fire and forget (fastest, may lose messages)
   - QoS 1: At least once (guaranteed delivery, may duplicate)
   - QoS 2: Exactly once (slowest, guaranteed no duplicates)

**Why MQTT for IoT?**
- Tiny overhead (~2 bytes header vs 100+ for HTTP)
- Works on unreliable networks (3G, WiFi)
- Persistent connections reduce battery drain
- Built-in reconnection and offline queuing`,

  whyItMatters: 'MQTT is designed for battery-powered sensors on unreliable networks. HTTP would drain batteries in hours, MQTT lasts months.',

  realWorldExample: {
    company: 'Amazon Alexa',
    scenario: 'Millions of Echo devices sending voice commands and status',
    howTheyDoIt: 'Uses MQTT over WebSockets to maintain persistent connections with minimal battery impact.',
  },

  keyPoints: [
    'MQTT uses publish/subscribe pattern (vs HTTP request/response)',
    'Topics are hierarchical: home/bedroom/temperature',
    'QoS levels control delivery guarantees',
    'Perfect for low-power, unreliable networks',
  ],

  diagram: `
MQTT Publish/Subscribe:

┌──────────┐  publish  ┌──────────────┐  subscribe  ┌──────────┐
│ Sensor A │─────────→ │ MQTT Broker  │────────────→│ Gateway  │
└──────────┘           │   (Topics)   │             └──────────┘
   topic:              └──────────────┘
   "temp"                    ↑
                             │ publish
                       ┌──────────┐
                       │ Sensor B │
                       └──────────┘
                         topic: "temp"
`,

  keyConcepts: [
    { title: 'Pub/Sub', explanation: 'Publishers and subscribers are decoupled', icon: '📢' },
    { title: 'Topics', explanation: 'Messages are organized in hierarchical topics', icon: '🏷️' },
    { title: 'QoS', explanation: 'Quality of Service: delivery guarantees', icon: '✅' },
  ],

  quickCheck: {
    question: 'What is the main advantage of MQTT over HTTP for IoT devices?',
    options: [
      'MQTT is faster than HTTP',
      'MQTT has minimal overhead and persistent connections',
      'MQTT is more secure than HTTP',
      'MQTT supports more devices',
    ],
    correctIndex: 1,
    explanation: 'MQTT has minimal overhead (2 bytes vs 100+ for HTTP) and uses persistent connections, saving battery and bandwidth.',
  },
};

const step2: GuidedStep = {
  id: 'iot-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Gateway must handle MQTT protocol for device telemetry',
    taskDescription: 'Configure the IoT Gateway with MQTT protocol support and implement message handlers',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices using MQTT', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Gateway with MQTT broker', displayName: 'IoT Gateway' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'MQTT messages' },
    ],
    successCriteria: [
      'Click IoT Gateway to configure APIs',
      'Add MQTT endpoint and implement Python handler',
      'Gateway can receive and process MQTT messages',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Configure Gateway with MQTT protocol and write Python handler',
    level2: 'Click Gateway → Add MQTT API → Switch to Python tab and implement handle_mqtt_message()',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add CoAP Protocol Support
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔌',
  scenario: "MQTT works great! But you just got a batch of battery-powered door sensors that use CoAP instead of MQTT.",
  hook: "CoAP is even lighter than MQTT - it uses UDP instead of TCP. Your gateway needs to speak both languages!",
  challenge: "Add CoAP protocol support to your gateway alongside MQTT.",
  illustration: 'protocol-support',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Multi-protocol gateway!",
  achievement: "Your gateway now supports both MQTT and CoAP",
  metrics: [
    { label: 'Protocols', before: 'MQTT only', after: 'MQTT + CoAP' },
    { label: 'Device compatibility', after: '✓ Wide' },
  ],
  nextTeaser: "But wait... anyone can send data to your gateway! We need security!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'CoAP: Lightweight HTTP for Constrained Devices',
  conceptExplanation: `**CoAP (Constrained Application Protocol)** is like HTTP for tiny devices.

**Key differences from MQTT:**
- **Request/Response** (like HTTP) vs Pub/Sub (like MQTT)
- **Uses UDP** (connectionless) vs TCP (connection-oriented)
- **Even lighter** than MQTT - 4-byte header
- **RESTful**: GET/POST/PUT/DELETE methods like HTTP

**When to use CoAP?**
- Ultra-low-power devices (battery lasts years)
- Simple request/response patterns
- Devices that sleep most of the time

**When to use MQTT?**
- Devices need to stay connected
- Pub/sub pattern fits your use case
- Need guaranteed delivery (QoS)

**Most IoT gateways support both!**`,

  whyItMatters: 'Different devices have different needs. Door sensors sleep 99% of the time (use CoAP). Smart thermostats stay connected (use MQTT). Supporting both gives you flexibility.',

  realWorldExample: {
    company: 'Google Nest',
    scenario: 'Nest supports various device types with different protocols',
    howTheyDoIt: 'Thread protocol (CoAP-based) for battery devices, WiFi (MQTT) for powered devices.',
  },

  famousIncident: {
    title: 'Philips Hue Security Flaw',
    company: 'Philips Hue',
    year: '2020',
    whatHappened: 'Researchers discovered they could hack Philips Hue smart bulbs by exploiting vulnerabilities in the Zigbee protocol (CoAP-based). Attackers could take control of bulbs from 100m away, then pivot to the home network.',
    lessonLearned: 'Protocol support is not enough - you MUST implement proper authentication and encryption. Never assume the protocol handles security for you.',
    icon: '💡',
  },

  keyPoints: [
    'CoAP is request/response (like HTTP), MQTT is pub/sub',
    'CoAP uses UDP (connectionless), MQTT uses TCP (connected)',
    'CoAP is lighter - perfect for ultra-low-power sensors',
    'Real IoT gateways support multiple protocols',
  ],

  diagram: `
Protocol Comparison:

MQTT (Pub/Sub):
Device ──publish──→ Broker ──notify──→ Subscribers
        Persistent connection, QoS guarantees

CoAP (Request/Response):
Device ──GET/POST──→ Gateway ──Response──→ Device
        UDP, connectionless, minimal overhead
`,

  keyConcepts: [
    { title: 'UDP vs TCP', explanation: 'CoAP uses UDP (lighter), MQTT uses TCP (reliable)', icon: '📦' },
    { title: 'REST-like', explanation: 'CoAP has GET/POST/PUT/DELETE like HTTP', icon: '🔄' },
    { title: 'Observe', explanation: 'CoAP\'s subscribe feature (like MQTT)', icon: '👁️' },
  ],

  quickCheck: {
    question: 'When should you use CoAP instead of MQTT?',
    options: [
      'When you need guaranteed delivery',
      'When devices sleep most of the time',
      'When you need pub/sub pattern',
      'When you have high bandwidth',
    ],
    correctIndex: 1,
    explanation: 'CoAP is perfect for battery-powered sensors that sleep most of the time. They wake up, send a quick request (UDP), and go back to sleep. No persistent connection needed.',
  },
};

const step3: GuidedStep = {
  id: 'iot-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Gateway must support both MQTT and CoAP protocols',
    taskDescription: 'Add CoAP protocol support to your IoT Gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Devices using MQTT and CoAP', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Multi-protocol gateway', displayName: 'IoT Gateway' },
      { type: 'app_server', reason: 'Cloud backend', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'MQTT and CoAP messages' },
      { from: 'IoT Gateway', to: 'Cloud Backend', reason: 'Forward telemetry' },
    ],
    successCriteria: [
      'Add both MQTT and CoAP endpoints to Gateway',
      'Implement handlers for both protocols',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add CoAP endpoint alongside existing MQTT',
    level2: 'Configure Gateway with both protocols and implement both handlers in Python',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: The Security Crisis - Add Device Authentication
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🚨',
  scenario: "DISASTER! A hacker discovered your gateway accepts data from ANY device!",
  hook: "They're flooding your system with fake temperature readings. Your smart home thinks it's 200°F and is trying to turn on ALL the air conditioners! Your electricity bill will be thousands of dollars!",
  challenge: "Implement device authentication - only registered, authenticated devices should be able to send data.",
  illustration: 'security-breach',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔐',
  message: "Gateway is now secure!",
  achievement: "Only authenticated devices can send telemetry",
  metrics: [
    { label: 'Authentication', before: '❌ None', after: '✓ Required' },
    { label: 'Fake data', before: 'Accepted', after: 'Rejected' },
  ],
  nextTeaser: "Secure! But what happens when 100 devices all send data at once?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'IoT Device Authentication: Proving Identity',
  conceptExplanation: `**Without authentication, your IoT system is wide open to attacks:**
- Fake sensor data
- Unauthorized device control
- Network infiltration

**IoT Authentication Methods:**

**1. Certificate-based (Best for IoT)**
- Each device has a unique certificate signed by your CA
- Device presents certificate during TLS handshake
- Gateway verifies certificate before accepting data
- Can't be stolen or replayed easily

**2. Token-based**
- Device includes JWT or API key in each message
- Simpler than certificates but less secure
- Tokens can be intercepted if not using TLS

**3. Device Registry**
- Maintain database of registered device IDs
- Only accept data from registered devices
- Devices must be provisioned before use

**Best Practice: Use ALL THREE!**
- TLS certificates for transport security
- Device registry to track authorized devices
- Token/signature for message integrity`,

  whyItMatters: 'IoT devices often control physical systems (thermostats, locks, cameras). Unauthorized access could have serious consequences - from privacy breaches to physical safety risks.',

  realWorldExample: {
    company: 'AWS IoT Core',
    scenario: 'Managing millions of IoT devices securely',
    howTheyDoIt: 'Every device must have a unique X.509 certificate. Devices authenticate via mutual TLS. Registry tracks device state and permissions.',
  },

  famousIncident: {
    title: 'Mirai Botnet - IoT Armageddon',
    company: 'Multiple IoT Vendors',
    year: '2016',
    whatHappened: 'Hackers exploited IoT devices with default passwords (admin/admin). They infected 600,000 devices - cameras, DVRs, routers. Used them to launch massive DDoS attacks that took down Netflix, Twitter, Reddit. Why? NO AUTHENTICATION.',
    lessonLearned: 'Authentication is not optional in IoT. Every device must prove its identity. Default passwords are a disaster waiting to happen.',
    icon: '🤖',
  },

  keyPoints: [
    'Authentication prevents unauthorized devices from sending data',
    'Use TLS certificates for strongest security',
    'Maintain device registry to track authorized devices',
    'Never use default passwords',
    'Implement both authentication (who are you) and authorization (what can you do)',
  ],

  diagram: `
Device Authentication Flow:

┌────────────┐                    ┌─────────────┐
│   Device   │                    │   Gateway   │
└─────┬──────┘                    └──────┬──────┘
      │                                  │
      │ 1. TLS Handshake                 │
      │    (present certificate)         │
      ├─────────────────────────────────→│
      │                                  │ 2. Verify cert
      │                                  │    Check CA signature
      │ 3. TLS established               │
      │◀─────────────────────────────────┤
      │                                  │
      │ 4. Send telemetry                │
      │    + device ID                   │
      ├─────────────────────────────────→│
      │                                  │ 5. Check device registry
      │                                  │    Is device registered?
      │ 6. Accept or Reject              │
      │◀─────────────────────────────────┤
`,

  keyConcepts: [
    { title: 'TLS Certificates', explanation: 'Cryptographic proof of device identity', icon: '📜' },
    { title: 'Device Registry', explanation: 'Database of authorized devices', icon: '📋' },
    { title: 'Mutual TLS', explanation: 'Both device and gateway authenticate each other', icon: '🤝' },
  ],

  quickCheck: {
    question: 'What is the best authentication method for IoT devices?',
    options: [
      'Default passwords for all devices',
      'API keys in plaintext',
      'TLS certificates unique to each device',
      'No authentication needed',
    ],
    correctIndex: 2,
    explanation: 'TLS certificates provide strong authentication and can\'t be easily stolen or replayed. Each device gets a unique certificate signed by your CA.',
  },
};

const step4: GuidedStep = {
  id: 'iot-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Only authenticated devices can send telemetry',
    taskDescription: 'Add device authentication with database-backed device registry',
    componentsNeeded: [
      { type: 'client', reason: 'Devices with certificates', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Gateway with auth', displayName: 'IoT Gateway' },
      { type: 'database', reason: 'Device registry', displayName: 'Device Registry' },
      { type: 'app_server', reason: 'Cloud backend', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'Authenticated connections' },
      { from: 'IoT Gateway', to: 'Device Registry', reason: 'Verify device IDs' },
      { from: 'IoT Gateway', to: 'Cloud Backend', reason: 'Forward authenticated data' },
    ],
    successCriteria: [
      'Add Database for device registry',
      'Gateway verifies device identity before accepting data',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database for device registry and connect Gateway to it',
    level2: 'Add Database component, connect Gateway to Database, update code to verify devices',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Handle Traffic Bursts - Add Message Queue
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Morning rush! Everyone wakes up at 7 AM, and suddenly 100 devices all report status at once.",
  hook: "Your gateway is drowning! Messages are being dropped. The database can't keep up. Your smart home is missing critical events!",
  challenge: "Add a Message Queue to buffer incoming telemetry and process it at a controlled rate.",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Traffic handled smoothly!",
  achievement: "Message queue buffers bursts and ensures no data loss",
  metrics: [
    { label: 'Messages dropped', before: '20%', after: '0%' },
    { label: 'Peak handling', before: 'Failed', after: '✓ Buffered' },
  ],
  nextTeaser: "Great! But the queue is growing... we need to persist telemetry!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Smoothing Traffic Bursts',
  conceptExplanation: `**The Problem: Bursty IoT Traffic**
IoT devices don't send data evenly:
- Morning: Everyone's alarm goes off → 100 messages/sec
- Midday: Quiet → 2 messages/sec
- Evening: Everyone comes home → 80 messages/sec

**Without a queue:**
- Bursts overwhelm your database
- Messages get dropped
- You lose critical events

**With a Message Queue:**
1. Gateway receives burst → Queue buffers messages
2. Queue holds messages in memory/disk
3. Worker processes messages at steady rate
4. Database never overwhelmed

**Popular IoT Message Queues:**
- **MQTT Broker** (Mosquitto, HiveMQ): Built for IoT
- **RabbitMQ**: Reliable, persistent, flexible
- **Apache Kafka**: High-throughput, great for analytics
- **Redis Streams**: Fast, simple, in-memory`,

  whyItMatters: 'IoT traffic is inherently bursty. Message queues decouple ingestion (fast, variable) from processing (steady, controlled). This prevents data loss and system overload.',

  realWorldExample: {
    company: 'Nest Thermostat',
    scenario: 'Millions of thermostats reporting temperature every 5 minutes',
    howTheyDoIt: 'MQTT brokers buffer messages. Workers process at controlled rate. Analytics pipeline reads from Kafka for historical analysis.',
  },

  famousIncident: {
    title: 'FitBit New Year Crash',
    company: 'FitBit',
    year: '2015',
    whatHappened: 'On January 1st, millions of people wore their new FitBits for the first time. All devices synced simultaneously. FitBit\'s servers crashed - they couldn\'t handle the burst. Users couldn\'t see their steps for days.',
    lessonLearned: 'Always assume traffic will burst. Message queues + auto-scaling would have buffered the load and prevented the crash.',
    icon: '⌚',
  },

  keyPoints: [
    'IoT traffic is bursty - devices don\'t send data evenly',
    'Message queues buffer bursts and smooth out processing',
    'Prevents database overload and message loss',
    'Decouples ingestion (fast) from processing (controlled)',
  ],

  diagram: `
Without Queue (Drops messages):
100 devices ──→ Gateway ──→ Database (OVERLOAD! ❌)

With Queue (Smooth processing):
100 devices ──→ Gateway ──→ Message Queue ──→ Worker ──→ Database
                              (buffer)         (steady rate) ✓
`,

  keyConcepts: [
    { title: 'Buffering', explanation: 'Queue holds messages until system can process', icon: '📦' },
    { title: 'Decoupling', explanation: 'Producers and consumers work independently', icon: '🔄' },
    { title: 'Back Pressure', explanation: 'Queue prevents overwhelming downstream systems', icon: '⏸️' },
  ],

  quickCheck: {
    question: 'What is the main benefit of a message queue for IoT telemetry?',
    options: [
      'Makes messages faster',
      'Encrypts messages',
      'Buffers bursts and prevents data loss',
      'Reduces storage costs',
    ],
    correctIndex: 2,
    explanation: 'Message queues buffer traffic bursts so downstream systems aren\'t overwhelmed. This prevents message drops during peak traffic.',
  },
};

const step5: GuidedStep = {
  id: 'iot-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle traffic bursts without data loss',
    taskDescription: 'Add Message Queue to buffer telemetry and smooth processing',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Gateway', displayName: 'IoT Gateway' },
      { type: 'message_queue', reason: 'Buffer bursts', displayName: 'Message Queue' },
      { type: 'database', reason: 'Device registry', displayName: 'Device Registry' },
      { type: 'app_server', reason: 'Cloud backend', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'Send telemetry' },
      { from: 'IoT Gateway', to: 'Message Queue', reason: 'Queue messages' },
      { from: 'Message Queue', to: 'Cloud Backend', reason: 'Process at steady rate' },
      { from: 'IoT Gateway', to: 'Device Registry', reason: 'Verify devices' },
    ],
    successCriteria: [
      'Add Message Queue between Gateway and Backend',
      'Gateway writes to queue, Backend reads from queue',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Message Queue to buffer telemetry between Gateway and Backend',
    level2: 'Insert Message Queue: Gateway → Queue → Backend. Queue smooths bursts.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Persist Telemetry - Add Time-Series Database
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💾',
  scenario: "Your message queue is working great! But users want to see historical data: 'What was my temperature yesterday?'",
  hook: "The queue only keeps recent messages. You need to store telemetry long-term for analytics and historical queries!",
  challenge: "Add a Time-Series Database optimized for storing sensor data over time.",
  illustration: 'database',
};

const step6Celebration: CelebrationContent = {
  emoji: '📊',
  message: "Historical data preserved!",
  achievement: "All telemetry is now stored for analytics and queries",
  metrics: [
    { label: 'Data retention', before: '1 hour', after: 'Unlimited' },
    { label: 'Historical queries', after: '✓ Supported' },
  ],
  nextTeaser: "Nice! But can the system survive a gateway crash?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Built for Sensor Data',
  conceptExplanation: `**IoT data is time-series data:**
- Each measurement has a timestamp
- Data arrives continuously over time
- Queries are usually time-range based: "temperature from 9am-5pm"
- Old data can be aggregated/downsampled

**Regular SQL vs Time-Series DB:**

**PostgreSQL (Regular SQL):**
- General purpose
- Slow for time-range queries on billions of rows
- Not optimized for continuous ingestion

**Time-Series DB (InfluxDB, TimescaleDB):**
- Optimized for time-range queries (100x faster)
- Automatic data retention policies
- Built-in downsampling/aggregation
- Handles continuous high-frequency writes

**Example queries:**
\`\`\`sql
-- Regular SQL (slow on billions of rows)
SELECT * FROM telemetry
WHERE timestamp BETWEEN '2024-01-01' AND '2024-01-02'

-- Time-Series DB (optimized indexes, fast!)
SELECT mean(temperature) FROM sensors
WHERE time > now() - 24h GROUP BY time(1h)
\`\`\``,

  whyItMatters: 'IoT generates massive amounts of time-series data. Regular databases struggle with billions of timestamped rows. Time-series databases are purpose-built for this workload.',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Collecting telemetry from millions of vehicles',
    howTheyDoIt: 'Each Tesla sends 25GB of data per hour. Tesla uses time-series databases to store and analyze vehicle telemetry for fleet monitoring and autopilot improvements.',
  },

  keyPoints: [
    'Time-series databases are optimized for timestamped data',
    'Much faster for time-range queries (100x+)',
    'Built-in data retention and downsampling',
    'Perfect for IoT telemetry, metrics, and logs',
  ],

  diagram: `
Time-Series Data Pattern:

Timestamp            Device ID    Sensor      Value
2024-01-01 09:00:00  sensor-123  temperature  72.5°F
2024-01-01 09:05:00  sensor-123  temperature  73.1°F
2024-01-01 09:10:00  sensor-123  temperature  73.8°F
2024-01-01 09:15:00  sensor-123  temperature  74.2°F
...

Query: "Average temperature from 9am-5pm"
Time-Series DB: Fast! (optimized indexes)
Regular SQL: Slow (full table scan)
`,

  keyConcepts: [
    { title: 'Time-Series', explanation: 'Data points indexed by timestamp', icon: '⏰' },
    { title: 'Downsampling', explanation: 'Aggregate old data to save space', icon: '📉' },
    { title: 'Retention Policies', explanation: 'Automatically delete old data', icon: '🗑️' },
  ],

  quickCheck: {
    question: 'Why use a time-series database instead of regular SQL for IoT telemetry?',
    options: [
      'Time-series DBs are cheaper',
      'Time-series DBs are more secure',
      'Time-series DBs are optimized for time-range queries',
      'Time-series DBs support more devices',
    ],
    correctIndex: 2,
    explanation: 'Time-series databases are purpose-built for timestamped data. They have optimized indexes and storage for time-range queries, making them 100x faster than regular SQL for IoT workloads.',
  },
};

const step6: GuidedStep = {
  id: 'iot-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Telemetry must be persisted for historical queries',
    taskDescription: 'Add Time-Series Database to store telemetry long-term',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Gateway', displayName: 'IoT Gateway' },
      { type: 'message_queue', reason: 'Buffer bursts', displayName: 'Message Queue' },
      { type: 'database', reason: 'Device registry', displayName: 'Device Registry' },
      { type: 'database', reason: 'Store telemetry', displayName: 'Time-Series DB' },
      { type: 'app_server', reason: 'Process and store', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'IoT Gateway', reason: 'Send telemetry' },
      { from: 'IoT Gateway', to: 'Message Queue', reason: 'Queue messages' },
      { from: 'Message Queue', to: 'Cloud Backend', reason: 'Process messages' },
      { from: 'Cloud Backend', to: 'Time-Series DB', reason: 'Store telemetry' },
      { from: 'IoT Gateway', to: 'Device Registry', reason: 'Verify devices' },
    ],
    successCriteria: [
      'Add Time-Series Database',
      'Backend writes telemetry to Time-Series DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', to: 'database' },
    ],
  },
  hints: {
    level1: 'Add another Database for time-series telemetry storage',
    level2: 'Add second Database (Time-Series DB), connect Backend to it for telemetry storage',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }, { type: 'database' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: High Availability - Add Load Balancer and Replication
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your gateway crashed! All 100 devices are offline. No temperature data, no motion alerts, nothing!",
  hook: "You have a single point of failure. What if the gateway hardware dies? What if you need to update the software?",
  challenge: "Add Load Balancer and multiple Gateway instances for high availability.",
  illustration: 'high-availability',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "System is now highly available!",
  achievement: "Multiple gateways with load balancing - no single point of failure",
  metrics: [
    { label: 'Availability', before: '95%', after: '99.9%' },
    { label: 'Gateway instances', before: '1', after: '2+' },
  ],
  nextTeaser: "Almost there! Let's add caching for fast device lookups...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability for IoT Gateways',
  conceptExplanation: `**Single Gateway = Single Point of Failure**

What happens when:
- Gateway hardware fails?
- Power outage?
- Software update needed?
- Traffic spike overwhelms one gateway?

**Solution: Multiple Gateways + Load Balancer**

1. **Load Balancer**: Distributes device connections
2. **Multiple Gateways**: 2+ instances for redundancy
3. **Health Checks**: LB detects failed gateways
4. **Automatic Failover**: Devices reconnect to healthy gateway

**IoT-Specific Considerations:**
- Devices maintain persistent connections (MQTT)
- When gateway fails, device must reconnect
- Use "sticky sessions" to keep device on same gateway
- Or use stateless gateways (all state in DB/queue)`,

  whyItMatters: 'IoT systems often control critical infrastructure (security systems, medical devices, industrial equipment). Downtime can have serious consequences. High availability is not optional.',

  realWorldExample: {
    company: 'Ring Doorbell',
    scenario: 'Millions of doorbells must stay connected 24/7',
    howTheyDoIt: 'Multiple gateway clusters in each region. When a gateway fails, devices automatically reconnect. Health monitoring detects issues before users notice.',
  },

  famousIncident: {
    title: 'Nest Outage - Smart Homes Go Dark',
    company: 'Google Nest',
    year: '2019',
    whatHappened: 'A software bug caused Nest\'s servers to crash. For 12 hours, millions of smart thermostats, cameras, and locks were offline. People couldn\'t adjust temperature or unlock doors. Single point of failure in their gateway architecture.',
    lessonLearned: 'IoT high availability is critical. Always have redundant gateways, automatic failover, and graceful degradation. Users expect smart homes to work like regular homes - reliably.',
    icon: '🏠',
  },

  keyPoints: [
    'Single gateway = single point of failure',
    'Load balancer distributes connections across gateways',
    'Health checks detect and remove failed gateways',
    'Devices automatically reconnect on failure',
    'Aim for 99.9%+ uptime for critical IoT systems',
  ],

  diagram: `
High Availability Architecture:

                        ┌──────────────┐
                        │Load Balancer │
                        └──────┬───────┘
                   ┌───────────┴───────────┐
                   │                       │
             ┌─────▼─────┐          ┌─────▼─────┐
100 Devices ─┤Gateway 1  │          │Gateway 2  │
             │(Healthy)  │          │(Healthy)  │
             └─────┬─────┘          └─────┬─────┘
                   └───────────┬───────────┘
                               │
                        ┌──────▼───────┐
                        │Message Queue │
                        └──────────────┘

If Gateway 1 fails → Devices reconnect to Gateway 2
`,

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across gateways', icon: '⚖️' },
    { title: 'Failover', explanation: 'Automatic switch to backup when primary fails', icon: '🔄' },
    { title: 'Health Checks', explanation: 'Continuous monitoring of gateway status', icon: '💓' },
  ],

  quickCheck: {
    question: 'What happens when a gateway fails with a load balancer in place?',
    options: [
      'All devices go offline',
      'Devices automatically reconnect to another gateway',
      'Data is lost',
      'System shuts down',
    ],
    correctIndex: 1,
    explanation: 'With a load balancer and multiple gateways, devices automatically reconnect to a healthy gateway when one fails. The LB health checks detect failures and route new connections appropriately.',
  },
};

const step7: GuidedStep = {
  id: 'iot-gateway-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must survive gateway failures with high availability',
    taskDescription: 'Add Load Balancer and configure multiple Gateway instances',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'load_balancer', reason: 'Distribute connections', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple gateway instances', displayName: 'IoT Gateway' },
      { type: 'message_queue', reason: 'Buffer messages', displayName: 'Message Queue' },
      { type: 'database', reason: 'Device registry', displayName: 'Device Registry' },
      { type: 'database', reason: 'Telemetry storage', displayName: 'Time-Series DB' },
      { type: 'app_server', reason: 'Backend processor', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'Load Balancer', reason: 'All devices connect through LB' },
      { from: 'Load Balancer', to: 'IoT Gateway', reason: 'LB distributes to gateways' },
      { from: 'IoT Gateway', to: 'Message Queue', reason: 'Queue telemetry' },
      { from: 'IoT Gateway', to: 'Device Registry', reason: 'Verify devices' },
    ],
    successCriteria: [
      'Add Load Balancer in front of Gateway',
      'Configure Gateway for 2+ instances',
      'System survives single gateway failure',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add Load Balancer and configure Gateway for multiple instances',
    level2: 'Insert Load Balancer: Devices → LB → Gateway. Then configure Gateway for 2+ instances.',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'database' },
      { type: 'database' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Optimize Performance - Add Cache for Device Registry
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your gateway is highly available! But it's slow. Every message requires a database lookup to verify the device.",
  hook: "At 50 messages/sec, that's 50 DB queries/sec just for authentication! The database is becoming a bottleneck.",
  challenge: "Add a Cache to store device registry data for fast lookups.",
  illustration: 'performance',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Performance optimized!",
  achievement: "Device lookups are now lightning fast with cache",
  metrics: [
    { label: 'Auth latency', before: '50ms', after: '2ms' },
    { label: 'DB queries', before: '50/sec', after: '5/sec' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "Perfect! Your IoT Gateway is production-ready!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for IoT: Speed Up Device Lookups',
  conceptExplanation: `**The Problem: Repetitive Database Queries**

Every telemetry message requires:
1. Look up device in registry (DB query)
2. Verify device is active
3. Check permissions

At 50 messages/sec × 50ms per query = 2.5 seconds of DB time per second!

**Solution: Cache Device Registry**

**Cache-Aside Pattern:**
1. Check cache first: Is device in Redis?
2. **Hit**: Return immediately (2ms)
3. **Miss**: Query DB, store in cache (50ms)
4. TTL: Expire cache after 1 hour

**For IoT Device Registry:**
- Devices rarely change once registered
- Same devices send messages repeatedly
- Perfect for caching!
- Expected hit rate: 90-95%

**Result:**
- 90% of lookups: 2ms (cache)
- 10% of lookups: 50ms (DB)
- Average: ~7ms (was 50ms)
- Database load: 5 queries/sec (was 50)`,

  whyItMatters: 'IoT gateways process thousands of messages per second. Every database query adds latency and load. Caching device registry data dramatically improves performance and reduces database costs.',

  realWorldExample: {
    company: 'Amazon Alexa',
    scenario: 'Millions of Echo devices authenticating constantly',
    howTheyDoIt: 'Device credentials cached in Redis. Cache hit rate > 95%. Database only hit for new devices or cache misses.',
  },

  keyPoints: [
    'Device registry data rarely changes - perfect for caching',
    'Cache-aside pattern: check cache first, DB on miss',
    'Reduces database load by 90%+',
    'Improves authentication latency 10-20x',
    'Set TTL to balance freshness vs performance',
  ],

  diagram: `
Without Cache:
Every message ──→ Gateway ──→ Database lookup (50ms)
                               ↓
50 msg/sec = 50 DB queries/sec

With Cache:
Message ──→ Gateway ──→ Cache (2ms) ✓ 90% hit rate
                       ↓ miss (10%)
                    Database (50ms)

50 msg/sec = 5 DB queries/sec (90% reduction!)
`,

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, query DB on miss', icon: '📦' },
    { title: 'TTL', explanation: 'Time-to-live: auto-expire cached data', icon: '⏰' },
    { title: 'Hit Rate', explanation: 'Percentage of requests served from cache', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why is caching particularly effective for IoT device registries?',
    options: [
      'Device data changes frequently',
      'Device data is large',
      'Same devices send messages repeatedly',
      'Caching is required by MQTT',
    ],
    correctIndex: 2,
    explanation: 'Once registered, devices send many messages but rarely change. This means cache hit rates are very high (90%+), making caching extremely effective.',
  },
};

const step8: GuidedStep = {
  id: 'iot-gateway-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Device authentication must be fast with minimal database load',
    taskDescription: 'Add Cache for device registry lookups',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'load_balancer', reason: 'Distribute connections', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Gateway instances', displayName: 'IoT Gateway' },
      { type: 'cache', reason: 'Cache device registry', displayName: 'Cache (Redis)' },
      { type: 'message_queue', reason: 'Buffer messages', displayName: 'Message Queue' },
      { type: 'database', reason: 'Device registry', displayName: 'Device Registry' },
      { type: 'database', reason: 'Telemetry storage', displayName: 'Time-Series DB' },
      { type: 'app_server', reason: 'Backend processor', displayName: 'Cloud Backend' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'Load Balancer', reason: 'Device connections' },
      { from: 'Load Balancer', to: 'IoT Gateway', reason: 'Distribute load' },
      { from: 'IoT Gateway', to: 'Cache', reason: 'Fast device lookups' },
      { from: 'IoT Gateway', to: 'Device Registry', reason: 'Cache miss fallback' },
      { from: 'IoT Gateway', to: 'Message Queue', reason: 'Queue telemetry' },
    ],
    successCriteria: [
      'Add Cache (Redis) for device registry',
      'Gateway checks cache before database',
      'Achieve 90%+ cache hit rate',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add Cache and connect Gateway to both Cache and Database',
    level2: 'Add Redis Cache, connect Gateway to Cache (first) and Database (fallback)',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'message_queue' },
      { type: 'database' },
      { type: 'database' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const iotGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'iot-gateway-guided',
  problemTitle: 'Build an IoT Gateway - A System Design Journey',

  // Requirements gathering phase (Step 0)
  requirementsPhase: iotGatewayRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases for IoT Gateway
  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Devices can send telemetry through the gateway to the cloud',
      traffic: { type: 'write', rps: 10, writeRps: 10 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'MQTT Protocol Support',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway handles MQTT messages correctly',
      traffic: { type: 'mixed', rps: 20, readRps: 10, writeRps: 10 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Device Authentication',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Only authenticated devices can send telemetry',
      traffic: { type: 'write', rps: 25, writeRps: 25 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'NFR-P1: Telemetry Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50 msg/sec with p99 latency < 5 seconds',
      traffic: { type: 'write', rps: 50, writeRps: 50 },
      duration: 60,
      passCriteria: { maxP99Latency: 5000, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Burst',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle burst of 100 messages/sec without data loss',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 60,
      passCriteria: { maxP99Latency: 10000, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Gateway Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives gateway failure with minimal disruption',
      traffic: { type: 'write', rps: 50, writeRps: 50 },
      duration: 90,
      failureInjection: { type: 'app_server_crash', atSecond: 45, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxDowntime: 15, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getIotGatewayGuidedTutorial(): GuidedTutorial {
  return iotGatewayGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = iotGatewayRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= iotGatewayRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
