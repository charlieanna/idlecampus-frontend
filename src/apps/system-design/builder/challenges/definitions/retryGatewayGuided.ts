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
 * Retry Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching resilience patterns for distributed systems.
 * Focuses on retry logic, exponential backoff, jitter, circuit breakers, and retry budgets.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic working gateway (FR satisfaction)
 * Steps 3-8: Add resilience patterns (exponential backoff, jitter, circuit breaker, retry budgets)
 *
 * Key Concepts (DDIA & SRE):
 * - Exponential backoff with jitter (preventing thundering herd)
 * - Circuit breaker pattern (fail fast when downstream is down)
 * - Retry budgets (prevent retry storms)
 * - Timeout strategies
 * - Bulkhead isolation
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const retryGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a resilient API Gateway that gracefully handles downstream failures",

  interviewer: {
    name: 'Morgan Roberts',
    role: 'Principal SRE at CloudScale Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-gateway',
      category: 'functional',
      question: "What does an API Gateway actually do for our users?",
      answer: "An API Gateway is the entry point for all client requests. It:\n\n1. **Routes requests** - Forwards requests to appropriate backend services\n2. **Retries failed requests** - If a backend is temporarily down, retry automatically\n3. **Returns responses** - Sends backend responses back to clients\n\nThink of it as a smart proxy that makes backend failures invisible to users.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "The gateway's job is to make distributed systems feel reliable, even when individual services fail",
    },
    {
      id: 'retry-strategy',
      category: 'functional',
      question: "When a backend service fails, should we retry immediately?",
      answer: "No! Immediate retries often make problems worse. We need:\n\n1. **Exponential backoff** - Wait longer between each retry (1s, 2s, 4s, 8s)\n2. **Jitter** - Add randomness to prevent all clients retrying simultaneously\n3. **Maximum attempts** - Stop after 3-5 retries to avoid infinite loops\n\nThis prevents 'thundering herd' where all clients hammer a recovering service.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Naive retries can turn a small outage into a catastrophic failure",
    },
    {
      id: 'circuit-breaker',
      category: 'functional',
      question: "What if a service is completely down for minutes? Should we keep retrying?",
      answer: "Absolutely not! That's where **circuit breakers** come in:\n\n**CLOSED** → Normal operation, requests flow through\n**OPEN** → Service is failing, stop sending requests (fail fast)\n**HALF-OPEN** → Test if service recovered\n\nWhen failures exceed a threshold (e.g., 50% error rate), open the circuit and fail fast instead of wasting resources on retries.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Circuit breakers prevent cascading failures and resource exhaustion",
    },
    {
      id: 'retry-budget',
      category: 'functional',
      question: "How do we prevent retries from overwhelming our system?",
      answer: "Use a **retry budget** - limit the percentage of requests that can be retries:\n\n- Total requests = 1000/sec\n- Retry budget = 10%\n- Max retries allowed = 100/sec\n\nIf retry attempts exceed the budget, fail fast instead. This prevents retry storms where retries consume all capacity.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Unbounded retries can consume all system resources during outages",
    },
    {
      id: 'timeout-strategy',
      category: 'functional',
      question: "How long should we wait for a backend response?",
      answer: "Use **adaptive timeouts**:\n\n- Fast endpoints: 500ms timeout\n- Slow endpoints: 5s timeout\n- Database queries: 2s timeout\n\nNever wait forever! Timeouts prevent threads from hanging on dead services.",
      importance: 'important',
      insight: "Timeouts are critical - a hung request consumes resources until it times out",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests should the gateway handle?",
      answer: "100,000 requests per second at peak, distributed across multiple backend services",
      importance: 'critical',
      learningPoint: "High throughput means retry storms can quickly overwhelm the system",
    },
    {
      id: 'backend-failure-rate',
      category: 'throughput',
      question: "What's a typical backend failure rate we need to handle?",
      answer: "Backends typically fail 0.1-1% of requests during normal operation. During incidents, failure rates can spike to 50-90%.",
      importance: 'critical',
      calculation: {
        formula: "At 100K RPS, 1% failure = 1000 failed requests/sec",
        result: "Without circuit breakers, 1000 requests/sec will retry and amplify the load",
      },
      learningPoint: "Even small failure rates create significant retry load at scale",
    },
    {
      id: 'latency-tolerance',
      category: 'latency',
      question: "How much latency can users tolerate?",
      answer: "p99 latency should be under 200ms for successful requests. Failed requests (after all retries) should fail fast within 2 seconds.",
      importance: 'critical',
      learningPoint: "Retries add latency - must balance reliability with response time",
    },
    {
      id: 'cascading-failures',
      category: 'latency',
      question: "What happens if retries overload the backend services?",
      answer: "This is the dreaded **cascading failure**:\n\n1. Service A slows down\n2. Gateway retries requests to A\n3. Retries 2-3x the load on A\n4. A crashes completely\n5. Now ALL requests fail\n\nCircuit breakers and retry budgets prevent this death spiral.",
      importance: 'critical',
      learningPoint: "Retries can turn a partial outage into a total outage",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-gateway', 'retry-strategy', 'circuit-breaker'],
  criticalFRQuestionIds: ['core-gateway', 'retry-strategy'],
  criticalScaleQuestionIds: ['throughput-requests', 'backend-failure-rate', 'cascading-failures'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Gateway routes requests to backends',
      description: 'Forward client requests to appropriate backend services',
      emoji: '🔀',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Gateway retries transient failures',
      description: 'Automatically retry failed requests with exponential backoff',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Implement exponential backoff with jitter',
      description: 'Prevent thundering herd by adding randomness to retry delays',
      emoji: '⏱️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Circuit breaker for failing services',
      description: 'Fail fast when backend services are down',
      emoji: '⚡',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Enforce retry budgets',
      description: 'Limit retry percentage to prevent retry storms',
      emoji: '💰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A - Gateway handles 100K RPS',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 3,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 33333, peak: 100000 },
    maxPayloadSize: '~10KB (API request)',
    storagePerRecord: 'N/A',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 200ms',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Exponential backoff prevents thundering herd',
    '✅ Jitter spreads retry load over time',
    '✅ Circuit breaker prevents cascading failures',
    '✅ Retry budgets prevent retry storms',
    '✅ Timeouts prevent resource exhaustion',
    '✅ Bulkhead isolation contains failures',
  ],

  outOfScope: [
    'Rate limiting (separate concern)',
    'Authentication/Authorization',
    'API versioning',
    'Request transformation',
    'Response caching',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that routes requests and retries failures. Then we'll add sophisticated resilience patterns to make it production-ready. Function first, then resilience!",
};

// =============================================================================
// STEP 1: Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to CloudScale Inc! You're building a critical API Gateway.",
  hook: "Clients need to talk to backend services, but they shouldn't talk directly - that's brittle!",
  challenge: "Build the foundation: Client sends requests through the Gateway to reach backends.",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your gateway is online!',
  achievement: 'Clients can now send requests through the gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Request flow', after: 'Client → Gateway → Backend' },
  ],
  nextTeaser: "But what happens when the backend fails?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway Pattern: Centralized Entry Point',
  conceptExplanation: `An **API Gateway** sits between clients and backend services, providing:

**Why a Gateway?**
1. **Single entry point** - Clients only know about the gateway
2. **Service abstraction** - Backend services can change without affecting clients
3. **Resilience logic** - Retries, circuit breakers, timeouts centralized
4. **Observability** - Monitor all traffic in one place

Basic flow:
\`\`\`
Client → Gateway → Backend Service A
                 → Backend Service B
                 → Backend Service C
\`\`\``,

  whyItMatters: 'Without a gateway, every client needs to implement retry logic, circuit breakers, and service discovery. The gateway centralizes resilience patterns.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Zuul gateway handles 50+ billion requests per day',
    howTheyDoIt: 'Uses Zuul gateway with sophisticated retry logic, circuit breakers (Hystrix), and dynamic routing',
  },

  keyPoints: [
    'Gateway is the single entry point for all API requests',
    'Centralizes cross-cutting concerns (retries, timeouts, auth)',
    'Abstracts backend service topology from clients',
    'Critical for observability and resilience',
  ],

  keyConcepts: [
    { title: 'Gateway', explanation: 'Smart proxy that routes and retries requests', icon: '🚪' },
    { title: 'Backend', explanation: 'Downstream services the gateway calls', icon: '🖥️' },
    { title: 'Client', explanation: 'Applications that call the gateway', icon: '📱' },
  ],
};

const step1: GuidedStep = {
  id: 'retry-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Gateway routes requests to backends',
    taskDescription: 'Add Client, Gateway (App Server), and Backend (Database), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as the API Gateway', displayName: 'Gateway' },
      { type: 'database', reason: 'Represents backend services', displayName: 'Backend Service' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (App Server) component added',
      'Backend (Database) component added',
      'Client → Gateway → Backend connections created',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server (Gateway), and Database (Backend) onto the canvas',
    level2: 'Connect Client → App Server, then App Server → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Basic Retry Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! A backend service just returned a 503 error.",
  hook: "The client's request failed. But the error was temporary - the next request might succeed!",
  challenge: "Implement retry logic in Python so the gateway automatically retries failed requests.",
  illustration: 'backend-failure',
};

const step2Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Your gateway now retries failed requests!',
  achievement: 'Transient failures are automatically recovered',
  metrics: [
    { label: 'Retry attempts', after: '3 max' },
    { label: 'Success rate', before: '99%', after: '99.9%' },
  ],
  nextTeaser: "But immediate retries are hammering the failing backend...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Retry Logic: Handling Transient Failures',
  conceptExplanation: `**Transient failures** are temporary errors that resolve quickly:
- Network blips
- Backend service restarting
- Temporary overload

**Basic retry logic**:
\`\`\`python
def call_backend_with_retry(request, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = backend.call(request)
            return response  # Success!
        except TransientError:
            if attempt == max_retries - 1:
                raise  # Give up after max retries
            # Otherwise, retry immediately
\`\`\`

**Problem**: Immediate retries can overwhelm a recovering service!`,

  whyItMatters: 'Network failures happen constantly in distributed systems. Retries turn 99% availability into 99.9% availability.',

  famousIncident: {
    title: 'AWS S3 Outage Amplified by Retries',
    company: 'AWS',
    year: '2017',
    whatHappened: 'A typo in a command took down S3. When services started retrying, the retry storm made recovery impossible. The outage lasted 4 hours.',
    lessonLearned: 'Naive retries without backoff can amplify failures. Exponential backoff is essential.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Handling billions of requests across global infrastructure',
    howTheyDoIt: 'Uses exponential backoff with jitter in all client libraries. Default: 1s, 2s, 4s, 8s with ±25% jitter',
  },

  keyPoints: [
    'Retry transient failures (5xx errors, timeouts)',
    'Never retry client errors (4xx)',
    'Use max retry limit (3-5 attempts)',
    'Immediate retries can overwhelm recovering services',
  ],

  quickCheck: {
    question: 'Which HTTP errors should we retry?',
    options: [
      '400 Bad Request',
      '401 Unauthorized',
      '503 Service Unavailable',
      '404 Not Found',
    ],
    correctIndex: 2,
    explanation: '503 Service Unavailable is transient - retry likely succeeds. 4xx errors are client problems - retrying won\'t help.',
  },

  keyConcepts: [
    { title: 'Transient Failure', explanation: 'Temporary error that resolves quickly', icon: '⚠️' },
    { title: 'Retry', explanation: 'Automatically resend failed requests', icon: '🔄' },
    { title: 'Max Retries', explanation: 'Limit to prevent infinite loops', icon: '🛑' },
  ],
};

const step2: GuidedStep = {
  id: 'retry-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Gateway retries transient failures',
    taskDescription: 'Configure gateway APIs and implement retry logic in Python',
    successCriteria: [
      'Click on Gateway (App Server)',
      'Assign POST /api/v1/request API',
      'Open Python tab',
      'Implement retry_request() function with max 3 retries',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Gateway → APIs tab, assign POST /api/v1/request',
    level2: 'Switch to Python tab, implement retry_request() with a loop that retries up to 3 times',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Exponential Backoff
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌊',
  scenario: "The backend is being hammered! 1000 clients are retrying simultaneously.",
  hook: "Every retry happens immediately, creating a 'thundering herd' that keeps crashing the backend.",
  challenge: "Implement exponential backoff to space out retry attempts: 1s, 2s, 4s, 8s...",
  illustration: 'thundering-herd',
};

const step3Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Exponential backoff is working!',
  achievement: 'Retry load is now spread over time',
  metrics: [
    { label: 'Retry delay', before: '0s (immediate)', after: '1s → 2s → 4s → 8s' },
    { label: 'Backend recovery time', before: 'Never', after: '10 seconds' },
  ],
  nextTeaser: "But all clients are still retrying in perfect sync...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Exponential Backoff: Preventing Thundering Herd',
  conceptExplanation: `**Exponential backoff** doubles the wait time between retries:

\`\`\`python
def exponential_backoff(attempt):
    return min(2 ** attempt, max_delay)  # 1s, 2s, 4s, 8s, 16s...
\`\`\`

**Why it works**:
- Attempt 1: Wait 1 second (service might recover)
- Attempt 2: Wait 2 seconds (give it more time)
- Attempt 3: Wait 4 seconds (still down? wait longer)
- Attempt 4: Wait 8 seconds (probably not transient)

**Without backoff**: All 1000 clients retry immediately → 3000 requests in 1 second
**With backoff**: Retries spread over 1s, 2s, 4s, 8s → Load distributed over time`,

  whyItMatters: 'Exponential backoff prevents retry storms that can turn a small outage into a total system collapse.',

  famousIncident: {
    title: 'GitHub DDoS by Exponential Backoff Bug',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A client library had a bug where exponential backoff was implemented incorrectly, causing retries to happen faster than intended. The retry storm overwhelmed GitHub\'s servers.',
    lessonLearned: 'Test your retry logic! A bug in exponential backoff is worse than no backoff.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'DynamoDB client library',
    howTheyDoIt: 'Uses exponential backoff with base delay of 50ms, doubling up to 20 seconds. Includes jitter to prevent synchronization.',
  },

  diagram: `
Without Backoff (Thundering Herd):
─────────────────────────────────────────
t=0s:  ████████████ (1000 requests)
t=1s:  ████████████ (1000 retries) ← Backend crashes
t=2s:  ████████████ (1000 retries) ← Still crashing

With Exponential Backoff:
─────────────────────────────────────────
t=0s:  ████████████ (1000 requests)
t=1s:  ████ (250 retries)
t=2s:  ██ (125 retries)
t=4s:  █ (62 retries) ← Backend recovers!
`,

  keyPoints: [
    'Exponential: delay doubles each retry (1s, 2s, 4s, 8s)',
    'Prevents all clients from retrying simultaneously',
    'Gives backend time to recover',
    'Use max delay cap (e.g., 60 seconds) to prevent unbounded delays',
  ],

  quickCheck: {
    question: 'What is the retry delay sequence with exponential backoff starting at 1 second?',
    options: [
      '1s, 1s, 1s, 1s (constant)',
      '1s, 2s, 3s, 4s (linear)',
      '1s, 2s, 4s, 8s (exponential)',
      '1s, 10s, 100s, 1000s (too aggressive)',
    ],
    correctIndex: 2,
    explanation: 'Exponential backoff doubles the delay each time: 2^0=1s, 2^1=2s, 2^2=4s, 2^3=8s',
  },

  keyConcepts: [
    { title: 'Exponential Backoff', explanation: 'Delay doubles each retry', icon: '📈' },
    { title: 'Thundering Herd', explanation: 'All clients retry simultaneously', icon: '🌊' },
    { title: 'Max Delay', explanation: 'Cap on maximum wait time', icon: '⏱️' },
  ],
};

const step3: GuidedStep = {
  id: 'retry-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Implement exponential backoff',
    taskDescription: 'Update retry logic to use exponential backoff: 1s, 2s, 4s, 8s',
    successCriteria: [
      'Click Gateway (App Server)',
      'Open Python tab',
      'Update retry_request() to calculate delay = 2^attempt',
      'Add sleep(delay) between retries',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Modify retry_request() to calculate delay = 2 ** attempt (exponential)',
    level2: 'Add time.sleep(delay) between retry attempts. Start with 1s base delay.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Jitter to Retry Delays
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎲',
  scenario: "1000 clients all started at the same time. Their clocks are synchronized!",
  hook: "Even with exponential backoff, they all retry at t=1s, t=2s, t=4s in perfect sync. The backend sees waves of traffic!",
  challenge: "Add randomness (jitter) to spread retry attempts over time.",
  illustration: 'synchronized-retries',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌟',
  message: 'Jitter is smoothing out the retry load!',
  achievement: 'Retry attempts are now distributed uniformly over time',
  metrics: [
    { label: 'Retry delay', before: 'Synchronized', after: 'Randomized ±50%' },
    { label: 'Peak load', before: '1000 RPS spike', after: '~300 RPS smooth' },
  ],
  nextTeaser: "But what if the backend is completely down for minutes?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Jitter: Breaking Synchronization',
  conceptExplanation: `**Jitter** adds randomness to retry delays to prevent synchronized retries:

\`\`\`python
import random

def exponential_backoff_with_jitter(attempt, base=1.0):
    delay = min(2 ** attempt, 60)  # Exponential with cap
    jitter = random.uniform(0.5, 1.5)  # ±50% randomness
    return delay * jitter
\`\`\`

**Without jitter** (1000 clients):
- t=1.0s: ALL 1000 retry simultaneously
- t=2.0s: ALL 1000 retry simultaneously
- Backend sees spikes every 2^n seconds

**With jitter** (±50% randomness):
- Client 1: retries at 0.8s, 1.7s, 3.2s, 6.1s
- Client 2: retries at 1.2s, 2.4s, 5.1s, 9.7s
- Client 3: retries at 0.9s, 1.9s, 4.3s, 7.8s
- Backend sees smooth distributed load!`,

  whyItMatters: 'Jitter is critical at scale. Without it, retry waves can prevent backend recovery by creating synchronized load spikes.',

  realWorldExample: {
    company: 'AWS',
    scenario: 'All AWS SDKs use "full jitter" backoff',
    howTheyDoIt: 'random_between(0, min(cap, base * 2^attempt)). Spreads retries uniformly across the full delay window.',
  },

  famousIncident: {
    title: 'AWS ELB Synchronized Retry Storm',
    company: 'AWS',
    year: '2012',
    whatHappened: 'During an outage, ELB instances all started retrying simultaneously with exponential backoff but no jitter. The synchronized retry waves prevented recovery for hours.',
    lessonLearned: 'AWS added jitter to all retry logic and published a paper "Exponential Backoff and Jitter" recommending full jitter.',
    icon: '⚡',
  },

  diagram: `
Exponential Backoff WITHOUT Jitter:
─────────────────────────────────────────
t=1s:  ████ (all clients retry together)
t=2s:  ████ (all clients retry together)
t=4s:  ████ (all clients retry together)
       ↑ Backend sees synchronized spikes!

Exponential Backoff WITH Jitter:
─────────────────────────────────────────
t=0-2s:  ██ (retries spread out)
t=2-4s:  ██ (retries spread out)
t=4-8s:  ██ (retries spread out)
         ↑ Backend sees smooth load!
`,

  keyPoints: [
    'Jitter adds randomness to prevent synchronized retries',
    'Full jitter: random(0, exponential_delay)',
    'Equal jitter: exponential_delay ± random%',
    'AWS recommends full jitter for best distribution',
  ],

  quickCheck: {
    question: 'Why add jitter to exponential backoff?',
    options: [
      'Makes retries faster',
      'Prevents all clients from retrying simultaneously',
      'Reduces total number of retries',
      'Makes debugging easier',
    ],
    correctIndex: 1,
    explanation: 'Jitter breaks synchronization. Without it, all clients retry at the same time, creating load spikes.',
  },

  keyConcepts: [
    { title: 'Jitter', explanation: 'Randomness added to retry delays', icon: '🎲' },
    { title: 'Full Jitter', explanation: 'random(0, max_delay)', icon: '🎯' },
    { title: 'Synchronization', explanation: 'All clients acting at once', icon: '⏰' },
  ],
};

const step4: GuidedStep = {
  id: 'retry-gateway-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Add jitter to exponential backoff',
    taskDescription: 'Add randomness to retry delays to prevent synchronized retries',
    successCriteria: [
      'Open Python tab in Gateway',
      'Import random module',
      'Multiply exponential delay by random.uniform(0.5, 1.5)',
      'Test that delays vary by ±50%',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add jitter by multiplying delay by random.uniform(0.5, 1.5)',
    level2: 'Update: delay = (2 ** attempt) * random.uniform(0.5, 1.5)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Circuit Breaker Pattern
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💥',
  scenario: "The backend database has been down for 5 minutes!",
  hook: "Your gateway is still retrying every request, wasting CPU, memory, and threads. Latency is 8+ seconds as every request times out.",
  challenge: "Add a circuit breaker to fail fast when the backend is known to be down.",
  illustration: 'circuit-breaker',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Circuit breaker is protecting your system!',
  achievement: 'Failed requests now fail fast in milliseconds instead of timing out',
  metrics: [
    { label: 'Latency when backend down', before: '8000ms (timeout)', after: '2ms (fast fail)' },
    { label: 'Wasted retry attempts', before: '1000/sec', after: '0/sec' },
    { label: 'Circuit state', after: 'OPEN (failing fast)' },
  ],
  nextTeaser: "But unlimited retries are still consuming all resources during incidents...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Circuit Breaker: Fail Fast to Prevent Cascading Failures',
  conceptExplanation: `The **Circuit Breaker** pattern has three states:

**CLOSED** (Normal operation):
- Requests flow through normally
- Track failures in a sliding window
- If failure rate > threshold → OPEN

**OPEN** (Backend is down):
- Fail fast without trying backend
- Return error immediately (2ms instead of 8s timeout)
- After timeout period → HALF_OPEN

**HALF_OPEN** (Testing recovery):
- Send 1 test request
- If success → CLOSED (recovered!)
- If failure → OPEN (still down)

\`\`\`python
class CircuitBreaker:
    def __init__(self):
        self.state = "CLOSED"
        self.failures = 0
        self.threshold = 5  # Open after 5 failures

    def call(self, fn):
        if self.state == "OPEN":
            raise CircuitOpenError("Fail fast")

        try:
            result = fn()
            self.failures = 0  # Reset on success
            return result
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise
\`\`\``,

  whyItMatters: 'Circuit breakers prevent cascading failures. Without them, a single failed service can consume all resources and crash the entire system.',

  famousIncident: {
    title: 'Netflix Hystrix Origin Story',
    company: 'Netflix',
    year: '2011',
    whatHappened: 'A backend service failure caused threads to hang waiting for timeouts. This exhausted the thread pool, crashing Netflix\'s entire API. Users couldn\'t watch videos for hours.',
    lessonLearned: 'Netflix built Hystrix (circuit breaker library) to fail fast and prevent resource exhaustion. It became the gold standard for resilience.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Protecting against 50+ downstream service failures',
    howTheyDoIt: 'Uses Hystrix circuit breakers with 10-second rolling windows. Opens circuit at 50% error rate, half-opens after 5 seconds.',
  },

  diagram: `
Circuit Breaker States:
─────────────────────────────────────────
         ┌─────────────┐
         │   CLOSED    │ ← Normal operation
         │ (requests   │
         │  flowing)   │
         └──────┬──────┘
                │ Failures > threshold
                ▼
         ┌─────────────┐
         │    OPEN     │ ← Fail fast!
         │ (blocking   │   No backend calls
         │  requests)  │   Return error in 2ms
         └──────┬──────┘
                │ After timeout
                ▼
         ┌─────────────┐
         │ HALF_OPEN   │ ← Test recovery
         │ (testing 1  │   Send 1 request
         │  request)   │   Success → CLOSED
         └─────────────┘   Fail → OPEN
`,

  keyPoints: [
    'Circuit breaker tracks failure rate in sliding window',
    'Opens circuit (fails fast) when failures > threshold',
    'Prevents resource exhaustion from timeouts',
    'Periodically tests if backend recovered',
  ],

  quickCheck: {
    question: 'What happens when the circuit breaker is OPEN?',
    options: [
      'Requests wait longer before retrying',
      'Requests fail immediately without calling backend',
      'Requests are queued until backend recovers',
      'The gateway restarts',
    ],
    correctIndex: 1,
    explanation: 'OPEN circuit means fail fast - return error immediately (2ms) instead of wasting resources on a call that will fail (8s timeout).',
  },

  keyConcepts: [
    { title: 'Circuit Breaker', explanation: 'Fail fast when service is down', icon: '⚡' },
    { title: 'CLOSED', explanation: 'Normal operation, requests flow', icon: '🟢' },
    { title: 'OPEN', explanation: 'Failing fast, no backend calls', icon: '🔴' },
    { title: 'HALF_OPEN', explanation: 'Testing recovery with 1 request', icon: '🟡' },
  ],
};

const step5: GuidedStep = {
  id: 'retry-gateway-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Circuit breaker for failing services',
    taskDescription: 'Implement circuit breaker logic in the gateway',
    successCriteria: [
      'Open Python tab',
      'Implement CircuitBreaker class with CLOSED/OPEN/HALF_OPEN states',
      'Track failures in sliding window',
      'Open circuit when failure rate > 50%',
      'Test recovery after timeout',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Create CircuitBreaker class that tracks state (CLOSED/OPEN/HALF_OPEN)',
    level2: 'Implement: track failures, open at 50% error rate, half-open after 5s timeout',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Implement Retry Budget
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💸',
  scenario: "During a partial outage, 50% of requests are failing and being retried!",
  hook: "Your retry logic is creating 150,000 RPS of load (100K original + 50K retries). The entire system is collapsing under retry load!",
  challenge: "Implement a retry budget to limit retries to 10% of total traffic.",
  illustration: 'retry-storm',
};

const step6Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Retry budget is preventing retry storms!',
  achievement: 'System stays stable even during outages',
  metrics: [
    { label: 'Max retry rate', before: 'Unlimited', after: '10% of traffic' },
    { label: 'Peak load during incident', before: '300K RPS', after: '110K RPS' },
    { label: 'System stability', before: 'Crashes', after: 'Stable' },
  ],
  nextTeaser: "Let's add monitoring and observability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Retry Budgets: Preventing Retry Storms',
  conceptExplanation: `A **retry budget** limits the percentage of requests that can be retries:

**Without retry budget**:
- 100K requests/sec
- 50% failure rate during incident
- Each request retries 3 times
- Total load: 100K + (50K × 3) = 250K RPS
- System collapses under retry load!

**With 10% retry budget**:
- 100K requests/sec
- Retry budget: 10% = 10K retries/sec max
- When budget exhausted → fail fast, don't retry
- Total load: 100K + 10K = 110K RPS (manageable!)

\`\`\`python
class RetryBudget:
    def __init__(self, budget_percent=0.10):
        self.budget_percent = budget_percent
        self.total_requests = 0
        self.retries_used = 0

    def can_retry(self) -> bool:
        retry_ratio = self.retries_used / max(self.total_requests, 1)
        return retry_ratio < self.budget_percent

    def record_request(self, is_retry=False):
        self.total_requests += 1
        if is_retry:
            self.retries_used += 1
\`\`\``,

  whyItMatters: 'Retry budgets are the last line of defense against retry storms. They ensure your system degrades gracefully during outages instead of collapsing completely.',

  famousIncident: {
    title: 'Google Global Outage from Retry Storm',
    company: 'Google',
    year: '2019',
    whatHappened: 'A configuration change caused a partial outage. Retry logic amplified the problem, creating a retry storm that overwhelmed Google\'s infrastructure. YouTube, Gmail, and other services went down globally for an hour.',
    lessonLearned: 'Google now enforces strict retry budgets across all services. The SRE book dedicates an entire chapter to retry budgets.',
    icon: '🌍',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Protecting global infrastructure from retry storms',
    howTheyDoIt: 'Every service has a retry budget (typically 10-20%). Budgets are enforced at the client library level and monitored in real-time.',
  },

  diagram: `
Retry Storm WITHOUT Budget:
─────────────────────────────────────────
Normal:         ████████ 100K RPS

Incident:       ████████ 100K RPS (original)
                ████████ 50K retries
                ████████ 50K retries (2nd attempt)
                ████████ 50K retries (3rd attempt)
                ─────────────────────
                Total: 250K RPS → System crashes!

Retry Storm WITH 10% Budget:
─────────────────────────────────────────
Incident:       ████████ 100K RPS (original)
                ██ 10K retries (budget limit)
                ─────────────────────
                Total: 110K RPS → System stable!
`,

  keyPoints: [
    'Retry budget limits retry percentage (typically 10-20%)',
    'Prevents retry storms from amplifying failures',
    'Track: retry_ratio = retries / total_requests',
    'When budget exhausted → fail fast',
    'Critical for system stability during outages',
  ],

  quickCheck: {
    question: 'With 100K RPS and 10% retry budget, what\'s the max total load?',
    options: [
      '100K RPS (no retries)',
      '110K RPS (100K + 10K retries)',
      '200K RPS (double)',
      'Unlimited (depends on failure rate)',
    ],
    correctIndex: 1,
    explanation: 'With 10% budget, max retries = 10K. Total = 100K original + 10K retries = 110K RPS.',
  },

  keyConcepts: [
    { title: 'Retry Budget', explanation: 'Max % of requests that can be retries', icon: '💰' },
    { title: 'Retry Storm', explanation: 'Retries amplify load during outages', icon: '🌪️' },
    { title: 'Fail Fast', explanation: 'Reject retries when budget exhausted', icon: '⚡' },
  ],
};

const step6: GuidedStep = {
  id: 'retry-gateway-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Enforce retry budgets',
    taskDescription: 'Implement retry budget to limit retries to 10% of traffic',
    successCriteria: [
      'Open Python tab',
      'Implement RetryBudget class',
      'Track total requests and retry attempts',
      'Enforce 10% budget limit',
      'Fail fast when budget exhausted',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Create RetryBudget class that tracks total_requests and retries_used',
    level2: 'Implement can_retry() that returns False when retries_used / total_requests > 0.10',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Cache for Monitoring Metrics
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "You need to monitor circuit breaker states and retry budgets across multiple gateway instances!",
  hook: "Each gateway instance has its own state, but you need global visibility for alerting.",
  challenge: "Add Redis cache to store and aggregate metrics from all gateway instances.",
  illustration: 'monitoring',
};

const step7Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Metrics are now centralized!',
  achievement: 'You can monitor retry rates, circuit states, and latency across all gateways',
  metrics: [
    { label: 'Metric visibility', before: 'Per instance', after: 'Global' },
    { label: 'Alert latency', before: 'Minutes', after: 'Seconds' },
  ],
  nextTeaser: "Now let's add load balancing for high availability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Centralized Metrics for Resilience Patterns',
  conceptExplanation: `**Observability** is critical for resilience patterns:

**Metrics to track**:
1. **Retry rate**: retries / total_requests (should be < 10%)
2. **Circuit breaker state**: CLOSED/OPEN/HALF_OPEN per backend
3. **Success rate**: successful_requests / total_requests
4. **Latency**: p50, p99, p999 response times
5. **Budget utilization**: current_retries / retry_budget

**Why Redis cache?**
- Fast shared state across gateway instances
- Atomic counters for accurate metrics
- Pub/Sub for real-time alerts
- TTL for sliding windows

\`\`\`python
# Store circuit breaker state
redis.set("circuit:backend-a", "OPEN", ex=300)

# Track retry budget (sliding window)
redis.incr("retries:last_minute")
redis.expire("retries:last_minute", 60)

# Monitor retry rate
total = redis.get("requests:last_minute")
retries = redis.get("retries:last_minute")
retry_rate = retries / total
\`\`\``,

  whyItMatters: 'Without centralized metrics, you can\'t detect retry storms or cascading failures until it\'s too late. Observability enables proactive incident response.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Monitoring 2000+ microservices',
    howTheyDoIt: 'Uses centralized metrics (M3) to track retry rates, circuit states, and SLOs. Alerts trigger when retry budget exceeds 15%.',
  },

  keyPoints: [
    'Centralize metrics across all gateway instances',
    'Track retry rate, circuit states, latency',
    'Use Redis for fast shared state',
    'Alert when retry budget > threshold',
  ],

  keyConcepts: [
    { title: 'Metrics', explanation: 'Quantitative measurements of system behavior', icon: '📊' },
    { title: 'Observability', explanation: 'Ability to understand system state', icon: '👁️' },
    { title: 'Redis', explanation: 'Fast in-memory store for shared state', icon: '🔴' },
  ],
};

const step7: GuidedStep = {
  id: 'retry-gateway-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'Centralize metrics for monitoring',
    taskDescription: 'Add Redis cache to store retry metrics, circuit states, and latency data',
    componentsNeeded: [
      { type: 'cache', reason: 'Store metrics and circuit breaker states', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect Gateway to Cache',
      'Configure cache for metrics storage',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag Cache (Redis) component onto canvas',
    level2: 'Connect Gateway → Cache for storing metrics and circuit breaker states',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer for High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your single gateway instance just crashed! All client requests are failing.",
  hook: "With only one gateway, you have a single point of failure. Clients can't reach any backend services!",
  challenge: "Add a load balancer and multiple gateway instances for high availability.",
  illustration: 'high-availability',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Congratulations! You built a production-ready resilient gateway!',
  achievement: 'Complete with retry logic, circuit breakers, retry budgets, and high availability',
  metrics: [
    { label: 'Gateway instances', before: '1', after: '3+' },
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Retry strategy', after: 'Exponential backoff + jitter' },
    { label: 'Circuit breaker', after: 'Enabled' },
    { label: 'Retry budget', after: '10%' },
  ],
  nextTeaser: "You've mastered resilience patterns for distributed systems!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability: Eliminating Single Points of Failure',
  conceptExplanation: `**High Availability** requires redundancy at every layer:

**Load Balancer benefits**:
1. **Distributes load** across multiple gateway instances
2. **Health checks** remove failed instances automatically
3. **Zero-downtime deploys** by updating instances one at a time
4. **Geographic distribution** for disaster recovery

**Gateway instance count**:
- Minimum: 2 (survive 1 failure)
- Recommended: 3+ (survive failures + maintenance)
- Each instance shares state via Redis

**Sticky sessions NOT needed**:
- Gateways are stateless
- Circuit breaker state stored in Redis (shared)
- Any gateway can handle any request`,

  whyItMatters: 'A resilient gateway is worthless if it becomes a single point of failure. Load balancing + multiple instances ensures the gateway itself is highly available.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Zuul gateway handles 50B+ requests/day',
    howTheyDoIt: 'Hundreds of Zuul instances behind AWS ELB. Auto-scaling based on request rate. Each instance is stateless.',
  },

  keyPoints: [
    'Load balancer distributes traffic across gateway instances',
    'Multiple instances eliminate single point of failure',
    'Health checks remove unhealthy instances',
    'Shared state (Redis) enables stateless gateways',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across instances', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Detects and removes failed instances', icon: '💓' },
    { title: 'Stateless', explanation: 'No local state, can handle any request', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why can gateway instances be stateless?',
    options: [
      'They don\'t need to remember anything',
      'Circuit breaker state is stored in Redis (shared)',
      'Load balancers handle all state',
      'Clients handle state',
    ],
    correctIndex: 1,
    explanation: 'Circuit breaker state, retry budgets, and metrics are stored in Redis. Any gateway instance can access shared state.',
  },
};

const step8: GuidedStep = {
  id: 'retry-gateway-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'High availability with load balancing',
    taskDescription: 'Add load balancer and configure multiple gateway instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute requests and health check', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and Gateway',
      'Configure Gateway for 3+ instances',
      'Ensure circuit breaker state shared via Redis',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and Gateway',
    level2: 'Reconnect: Client → Load Balancer → Gateway. Configure Gateway for 3+ instances.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const retryGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'retry-gateway',
  title: 'Design a Resilient API Gateway',
  description: 'Build a production-ready gateway with retry logic, circuit breakers, and retry budgets',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🛡️',
    hook: "You're the Principal Engineer at CloudScale Inc!",
    scenario: "Your mission: Build a resilient API Gateway that gracefully handles backend failures using exponential backoff, jitter, circuit breakers, and retry budgets.",
    challenge: "Can you design a gateway that prevents cascading failures and retry storms?",
  },

  requirementsPhase: retryGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Request Routing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway routes requests to backend successfully',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Retry Transient Failures',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway retries failed requests and eventually succeeds',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 60,
      failureInjection: { type: 'intermittent', errorRate: 0.3 },
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Exponential Backoff with Jitter',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Retries use exponential backoff with jitter to prevent thundering herd',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      failureInjection: { type: 'burst_failures', errorRate: 0.5, duration: 20 },
      passCriteria: { maxP99Latency: 5000, maxErrorRate: 0.1 },
    },
    {
      name: 'Circuit Breaker Opens',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Circuit breaker opens when backend fails, then recovers',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { maxP99Latency: 1000, minAvailability: 0.95 },
    },
    {
      name: 'Retry Budget Enforced',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Retry budget limits retries to prevent retry storms',
      traffic: { type: 'mixed', rps: 2000, readRps: 2000, writeRps: 0 },
      duration: 60,
      failureInjection: { type: 'intermittent', errorRate: 0.4 },
      passCriteria: { maxErrorRate: 0.15 },
    },
  ] as TestCase[],

  concepts: [
    'API Gateway Pattern',
    'Retry Logic',
    'Exponential Backoff',
    'Jitter',
    'Circuit Breaker Pattern',
    'Retry Budgets',
    'Cascading Failures',
    'Bulkhead Isolation',
    'Timeout Strategies',
    'Observability',
    'High Availability',
  ],

  ddiaReferences: [
    'Chapter 8: Distributed System Troubles - Handling failures',
    'Chapter 1: Reliability - Fault tolerance',
  ],
};

export default retryGatewayGuidedTutorial;
