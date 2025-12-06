import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Uber Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a ride-sharing platform. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4+: Apply NFRs (real-time messaging, caching, replication, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const uberRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a ride-sharing platform like Uber",
  
  interviewer: {
    name: 'Alex Rodriguez',
    role: 'Engineering Manager',
    avatar: '👨‍💼',
  },
  
  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================
    
    // CRITICAL - Core Functionality (from rider/driver experience)
    {
      id: 'core-rider-experience',
      category: 'functional',
      question: "What can riders do with this system? What's the main user experience?",
      answer: "Riders have a simple experience:\n1. **Request a ride**: A rider opens the app, enters pickup and dropoff locations, and taps 'Request Ride'\n2. **See nearby drivers**: Before requesting, riders see available drivers on a live map\n3. **Get matched**: The platform matches the rider to a nearby available driver\n4. **Track ride**: Riders see their driver's location, ETA, and ride status in real-time\n5. **Complete and pay**: When the ride ends, the fare is calculated and the rider pays",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Always start by understanding the rider's experience - what they see and do",
    },
    {
      id: 'core-driver-experience',
      category: 'functional',
      question: "What can drivers do with this system?",
      answer: "Drivers have their own experience:\n1. **Go online/offline**: Drivers can toggle their availability\n2. **Receive requests**: When online, drivers receive ride requests from nearby riders\n3. **Accept/reject**: Drivers can accept or reject incoming requests\n4. **Navigate**: Once accepted, drivers navigate to pickup and dropoff locations\n5. **Complete ride**: Drivers mark rides as complete and see their earnings",
      importance: 'critical',
      revealsRequirement: 'FR-4, FR-5',
      learningPoint: "Understanding both sides of a two-sided marketplace is crucial",
    },
    {
      id: 'double-allocation',
      category: 'functional',
      question: "What happens if two riders request a ride at the same time and both get matched to the same driver?",
      answer: "That would be a disaster! A driver can only take one ride at a time. If two riders both get matched to the same driver, one rider will be left stranded. Each driver can only be matched to one rider at a time - we need to prevent double-allocation.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Consistency is critical for user experience - wrong matches break trust",
    },
    
    // IMPORTANT - Clarifications (from user's experience)
    {
      id: 'location-tracking',
      category: 'clarification',
      question: "How often does the app update driver locations? Do riders see this in real-time?",
      answer: "Driver GPS location updates every few seconds. Riders see the driver's current location on a live map, updating in real-time. This helps riders know when their driver will arrive.",
      importance: 'important',
      insight: "Real-time location updates require efficient data streaming",
    },
    {
      id: 'ride-status',
      category: 'clarification',
      question: "What are the different states of a ride?",
      answer: "A ride goes through these states:\n1. **Requested**: Rider requested, waiting for driver\n2. **Matched**: Driver accepted, on way to pickup\n3. **In Progress**: Driver picked up rider, going to destination\n4. **Completed**: Ride finished, fare calculated\n5. **Cancelled**: Either rider or driver cancelled",
      importance: 'important',
      insight: "State management is important for tracking ride progress",
    },
    {
      id: 'payment-timing',
      category: 'clarification',
      question: "When does payment happen? What if payment fails?",
      answer: "Payment happens after the ride is completed. The fare is calculated based on distance and time, then charged to the rider's payment method. If payment fails, we retry safely - we don't want to charge twice if the first attempt actually succeeded but we didn't get confirmation.",
      importance: 'important',
      insight: "Payment processing needs idempotency and retry logic",
    },
    
    // SCOPE
    {
      id: 'scope-single-city',
      category: 'scope',
      question: "Is this for a single city or multiple cities?",
      answer: "Let's start with a single city for now. We can discuss multi-city and multi-region as an extension if time permits.",
      importance: 'nice-to-have',
      insight: "Starting simple with single city is the right approach",
    },
    {
      id: 'scope-surge-pricing',
      category: 'scope',
      question: "Do we need surge pricing or dynamic pricing?",
      answer: "Not for the MVP. We'll use fixed pricing based on distance and time. Surge pricing can be a v2 feature.",
      importance: 'nice-to-have',
      insight: "Dynamic pricing adds complexity - good to defer",
    },
  ],
  
  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-rider-experience', 'core-driver-experience', 'double-allocation'],
  criticalFRQuestionIds: ['core-rider-experience', 'core-driver-experience', 'double-allocation'],
  criticalScaleQuestionIds: [], // NFRs will be gathered in later steps
  
  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Riders can request rides',
      description: 'Riders can enter pickup and dropoff locations and request a ride',
      emoji: '🚗',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Riders can see nearby drivers',
      description: 'Riders see available drivers on a live map before requesting',
      emoji: '📍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Platform matches riders to drivers',
      description: 'The system matches each rider to a single available driver',
      emoji: '🤝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Drivers can go online/offline',
      description: 'Drivers can toggle their availability and receive ride requests when online',
      emoji: '🟢',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Drivers can accept/reject requests',
      description: 'Drivers can accept or reject incoming ride requests',
      emoji: '✅',
    },
    {
      id: 'fr-6',
      text: 'FR-6: No double-allocation',
      description: 'Each driver can only be matched to one rider at a time - prevents double-allocation',
      emoji: '🔒',
    },
    {
      id: 'fr-7',
      text: 'FR-7: Real-time location tracking',
      description: 'App tracks driver GPS location in real-time during and between rides',
      emoji: '📡',
    },
    {
      id: 'fr-8',
      text: 'FR-8: Riders see ride status and driver location',
      description: 'Riders can see current ride status, driver ETA, and live driver location',
      emoji: '👀',
    },
    {
      id: 'fr-9',
      text: 'FR-9: Rides can be completed and paid',
      description: 'Rides can be completed, fares calculated, and riders can pay securely',
      emoji: '💳',
    },
  ],
  
  outOfScope: [
    'Surge pricing (v2)',
    'Multi-city/multi-region (v2)',
    'Ride scheduling (v2)',
    'Split fares (v2)',
  ],
  
  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server solution that satisfies our functional requirements. Once it works, we'll optimize for scale, real-time updates, and reliability in later steps. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You've been hired to build Uber - a ride-sharing platform.",
  hook: "Your first task: get the basic system running. Riders and drivers need to connect to your server.",
  challenge: "Connect the Client to the App Server to handle requests from riders and drivers.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system is connected!",
  achievement: "Riders and drivers can now send requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: App Servers',
  conceptExplanation: `Every web application starts with an **App Server** - the brain of your system.

When a rider requests a ride, their request travels to your app server, which:
1. Receives the HTTP request
2. Processes the business logic (matching, location tracking, etc.)
3. Returns a response

The app server is where all your ride-sharing logic lives.`,

  whyItMatters: `In production, app servers handle millions of requests per day. They need to be:
- **Scalable**: Handle traffic spikes during rush hours
- **Reliable**: Stay online even if some servers crash
- **Fast**: Respond quickly to keep riders and drivers happy`,

  realWorldExample: {
    company: 'Uber',
    scenario: 'Handling ride requests during peak hours',
    howTheyDoIt: 'Uber uses thousands of app servers across multiple regions, with load balancers distributing traffic evenly.',
  },

  keyPoints: [
    'App servers run your business logic (matching, location tracking, payments)',
    'They handle HTTP requests from mobile apps and web clients',
    'Multiple app servers provide redundancy and scalability',
    'Load balancers distribute traffic across app servers',
  ],

  diagram: `
    [Rider App] ──→ [App Server] ──→ [Response]
    [Driver App] ──→ [App Server] ──→ [Response]
  `,

  interviewTip: 'Always start with the app server - it\'s the core of your system. You can add databases, caches, and other components later.',
};

const step1: GuidedStep = {
  stepNumber: 1,
  title: 'Connect Client to App Server',
  story: step1Story,
  learn: step1LearnPhase,
  celebration: step1Celebration,
  practice: {
    task: 'Connect the Client to the App Server',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Riders and drivers use mobile apps', displayName: 'Mobile App' },
        { type: 'app_server', reason: 'Processes ride requests and matching logic', displayName: 'App Server' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'App Server', reason: 'Riders and drivers send requests to the app server' },
      ],
    },
    successCriteria: [
      'Client is connected to App Server',
      'App Server can receive requests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a Client and an App Server, then connect them',
    level2: 'Make sure the connection flows from Client to App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Write Basic Matching Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Great! Your app server is connected. But it's empty - it doesn't know how to match riders to drivers yet.",
  hook: "Riders are requesting rides, but nothing happens. You need to write the matching logic!",
  challenge: "Write code to match riders to drivers. Start simple - even in-memory matching is fine!",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Matching works!",
  achievement: "Riders can now request rides and get matched to drivers",
  metrics: [
    { label: 'Matching logic', after: 'Implemented' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But what happens when the server restarts? All data is lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Writing Business Logic: Ride Matching',
  conceptExplanation: `Your app server needs to implement the core matching logic:

1. **Rider requests ride**: App receives pickup/dropoff locations
2. **Find nearby drivers**: Query available drivers near pickup location
3. **Match to driver**: Assign the closest available driver
4. **Prevent double-allocation**: Mark driver as "on-ride" so they can't be matched again

For now, you can store everything in memory (arrays, dictionaries). We'll add persistence later!`,

  whyItMatters: `Matching is the heart of ride-sharing. It needs to be:
- **Fast**: Riders expect matches in seconds
- **Fair**: Distribute rides evenly among drivers
- **Reliable**: Never double-allocate a driver`,

  keyPoints: [
    'Start with simple in-memory data structures (arrays, dictionaries)',
    'Implement basic matching: find closest available driver',
    'Prevent double-allocation: mark driver as unavailable when matched',
    'You can optimize and add persistence later - first make it work!',
  ],

  interviewTip: 'In interviews, it\'s OK to start with simple in-memory solutions. Show you can make it work first, then optimize.',
};

const step2: GuidedStep = {
  stepNumber: 2,
  title: 'Write Basic Matching Logic',
  story: step2Story,
  learn: step2LearnPhase,
  celebration: step2Celebration,
  practice: {
    task: 'Write code to match riders to drivers (in-memory is fine!)',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Matching logic implemented',
      'Can match rider to driver',
      'Prevents double-allocation',
    ],
  },
  validation: {
    requiredComponents: ['app_server'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Write Python code in the App Server to handle ride requests and matching',
    level2: 'Store drivers and rides in memory (dictionaries/lists). Match riders to closest available driver.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your matching works! But there's a problem: when the server restarts, all drivers and rides disappear.",
  hook: "You need to persist data so it survives server restarts. Riders and drivers expect their data to be saved!",
  challenge: "Add a Database to store drivers, riders, and rides permanently.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Data persists!",
  achievement: "Rides and driver data now survive server restarts",
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
  ],
  nextTeaser: "But matching is slow... riders are waiting!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Adding Persistence: Databases',
  conceptExplanation: `A **Database** stores your data permanently on disk. Even if your app server crashes, the data survives.

For Uber, you need to store:
- **Drivers**: Driver info, location, availability status
- **Riders**: Rider info, payment methods
- **Rides**: Ride requests, matches, status, fares

When a rider requests a ride, your app server:
1. Saves the ride request to the database
2. Queries the database for nearby available drivers
3. Updates driver status when matched`,

  whyItMatters: `Databases provide:
- **Durability**: Data survives crashes and restarts
- **Querying**: Find drivers by location, filter by availability
- **Consistency**: Prevent double-allocation with transactions`,

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing millions of rides and drivers',
    howTheyDoIt: 'Uber uses PostgreSQL for structured data (rides, drivers) and Redis for real-time location updates.',
  },

  keyPoints: [
    'Databases store data permanently on disk',
    'App servers read from and write to databases',
    'Use transactions to prevent double-allocation',
    'You can query databases efficiently (e.g., find nearby drivers)',
  ],

  diagram: `
    [App Server] ──→ [Database]
         │              │
         └── Write ride request
         └── Query nearby drivers
         └── Update driver status
  `,

  interviewTip: 'Always add a database after you have basic functionality working. It\'s the foundation for data persistence.',
};

const step3: GuidedStep = {
  stepNumber: 3,
  title: 'Add Database for Persistence',
  story: step3Story,
  learn: step3LearnPhase,
  celebration: step3Celebration,
  practice: {
    task: 'Add a Database and connect it to your App Server',
    hints: {
      componentsNeeded: [
        { type: 'database', reason: 'Store drivers, riders, and rides permanently', displayName: 'Database' },
      ],
      connectionsNeeded: [
        { from: 'App Server', to: 'Database', reason: 'App server reads/writes ride and driver data' },
      ],
    },
    successCriteria: [
      'Database is connected to App Server',
      'Ride and driver data is persisted',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database component and connect it to your App Server',
    level2: 'Update your code to read from and write to the database instead of memory',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const uberGuidedTutorial: GuidedTutorial = {
  problemId: 'uber-guided',
  problemTitle: 'Build Uber - A System Design Journey',
  
  // Requirements gathering phase (Step 0)
  requirementsPhase: uberRequirementsPhase,
  
  totalSteps: 3, // Start with 3 steps, can expand later
  steps: [step1, step2, step3],
};

export function getUberGuidedTutorial(): GuidedTutorial {
  return uberGuidedTutorial;
}

