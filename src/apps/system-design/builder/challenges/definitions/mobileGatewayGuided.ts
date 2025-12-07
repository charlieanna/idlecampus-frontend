import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Mobile Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches mobile-specific system design concepts
 * while building a mobile gateway/BFF. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic mobile client → gateway solution
 * Steps 3+: Apply mobile-specific optimizations (BFF, compression, offline, push)
 *
 * Key Pedagogy: First make it WORK, then make it MOBILE-OPTIMIZED, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const mobileGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a mobile backend system with API Gateway/BFF",

  interviewer: {
    name: 'Jordan Kim',
    role: 'Mobile Platform Lead',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'mobile-clients',
      category: 'functional',
      question: "What types of mobile clients will access this system?",
      answer: "We have iOS and Android apps that need to access our backend services. Mobile apps have different constraints than web - limited battery, spotty networks, smaller screens. They need a mobile-friendly API layer.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Mobile clients have unique constraints that require specialized backend support",
    },
    {
      id: 'multiple-services',
      category: 'functional',
      question: "Does the mobile app need data from multiple backend services?",
      answer: "Yes! The home screen alone needs data from 5 different services: User Service, Feed Service, Recommendations, Notifications, and Analytics. Making 5 separate API calls from the mobile app would be slow and drain battery.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Mobile apps benefit from aggregated APIs that reduce network round-trips",
    },
    {
      id: 'offline-support',
      category: 'functional',
      question: "What should happen when users lose network connectivity?",
      answer: "Users should still be able to use the app! They should see cached content and be able to queue actions (like posting, liking) that sync when connectivity returns. Mobile users are constantly moving between WiFi, LTE, and no signal.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Offline-first design is critical for mobile user experience",
    },

    // IMPORTANT - Clarifications
    {
      id: 'push-notifications',
      category: 'clarification',
      question: "Do mobile clients need to receive push notifications?",
      answer: "Absolutely! Push notifications are essential for engagement - new messages, updates, alerts. We need to send targeted notifications to specific users or groups, and they need to work even when the app is closed.",
      importance: 'important',
      insight: "Push notification infrastructure is a mobile-specific requirement",
    },
    {
      id: 'data-size',
      category: 'clarification',
      question: "How much data does the mobile app typically fetch?",
      answer: "Mobile users are often on limited data plans. We need to minimize data transfer. A typical feed request returns 2MB of JSON, but 80% of that is unnecessary for the mobile UI. We should compress responses and send only what mobile needs.",
      importance: 'important',
      insight: "Response compression and optimization are critical for mobile",
    },
    {
      id: 'api-versions',
      category: 'clarification',
      question: "How do you handle API versioning with mobile apps?",
      answer: "Mobile apps can't be instantly updated like web apps. Users might run old versions for months. We need to support multiple API versions simultaneously and gracefully handle version mismatches.",
      importance: 'important',
      insight: "Mobile requires long-term API version support",
    },

    // SCOPE
    {
      id: 'scope-platforms',
      category: 'scope',
      question: "Are we supporting just iOS and Android, or other platforms too?",
      answer: "Start with iOS and Android. We can add other platforms later, but the BFF pattern should make it easy to support platform-specific needs.",
      importance: 'nice-to-have',
      insight: "BFF allows platform-specific optimizations",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['mobile-clients', 'multiple-services', 'offline-support'],
  criticalFRQuestionIds: ['mobile-clients', 'multiple-services', 'offline-support'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Mobile clients can access backend services',
      description: 'iOS and Android apps can communicate with backend services',
      emoji: '📱',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Gateway aggregates data from multiple services',
      description: 'Mobile apps get aggregated responses instead of making multiple API calls',
      emoji: '🔀',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Apps work offline with local cache',
      description: 'Users can view cached content and queue actions when offline',
      emoji: '📴',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Push notifications reach mobile devices',
      description: 'System can send targeted push notifications to mobile clients',
      emoji: '🔔',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Responses are optimized for mobile',
      description: 'Data is compressed and tailored for mobile screen sizes and bandwidth',
      emoji: '⚡',
    },
  ],

  outOfScope: [
    'Web browser support (focus on native mobile)',
    'Desktop applications',
    'Real-time websocket connections (v2)',
    'Offline-first database sync',
  ],

  keyInsight: "Mobile backends are different from web backends. The BFF (Backend for Frontend) pattern lets us optimize specifically for mobile constraints: limited bandwidth, battery life, offline scenarios, and push notifications. Let's build a mobile-first architecture!",
};

// =============================================================================
// STEP 1: Connect Mobile Client to Backend Services
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📱',
  scenario: "Welcome! You're building a mobile app that needs to fetch data from backend services.",
  hook: "Your mobile app needs to display a user's profile. The data lives in a backend User Service.",
  challenge: "Connect the Mobile Client to the User Service so users can see their profiles.",
  illustration: 'mobile-app',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Mobile app is connected!",
  achievement: "Users can now fetch their profile data",
  metrics: [
    { label: 'Status', after: 'Connected' },
    { label: 'Can fetch data', after: '✓' },
  ],
  nextTeaser: "But there's a problem... the home screen needs data from 5 different services!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Mobile Architecture Basics',
  conceptExplanation: `Mobile apps need to communicate with backend services to fetch data.

**The basic flow:**
1. Mobile app makes HTTP request to backend service
2. Service queries database and returns JSON response
3. Mobile app parses JSON and displays UI

**Mobile-specific challenges:**
- Limited battery (network calls drain battery)
- Spotty network (users move between WiFi, LTE, no signal)
- Data plan limits (every byte counts)
- Platform differences (iOS vs Android APIs)`,

  whyItMatters: `Mobile apps face unique constraints that web apps don't:
- Users might be on slow 3G networks
- Battery life is precious - excessive API calls drain it
- App size matters - every KB of downloaded data costs users money`,

  keyPoints: [
    'Mobile clients communicate over HTTP/HTTPS',
    'Network requests drain battery - minimize them!',
    'Mobile users expect apps to work on slow networks',
    'JSON responses should be compact',
  ],

  diagram: `
    [Mobile App] ──→ [User Service] ──→ [Database]
         │                 │
         └── HTTP Request  │
                           └── JSON Response
  `,

  interviewTip: 'Always ask about mobile-specific constraints early in the interview.',
};

const step1: GuidedStep = {
  stepNumber: 1,
  title: 'Connect Mobile Client to Backend',
  story: step1Story,
  learn: step1LearnPhase,
  celebration: step1Celebration,
  practice: {
    task: 'Connect the Mobile Client to the User Service',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Represents mobile app (iOS/Android)', displayName: 'Mobile App' },
        { type: 'app_server', reason: 'User Service provides profile data', displayName: 'User Service' },
      ],
      connectionsNeeded: [
        { from: 'Mobile App', to: 'User Service', reason: 'App fetches user profile data' },
      ],
    },
    successCriteria: [
      'Mobile Client connected to User Service',
      'Can fetch profile data',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a Mobile Client and a User Service, then connect them',
    level2: 'Drag connections from Mobile Client to User Service',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: The Problem - Too Many API Calls
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your app's home screen is slow and users are complaining about battery drain.",
  hook: "You discover the problem: the home screen makes 5 separate API calls to different services! Each call takes 200ms, so the screen takes over 1 second to load. Plus, it drains battery.",
  challenge: "Mobile apps should minimize network requests. We need an API Gateway that aggregates data from multiple services into a single response!",
  illustration: 'multiple-requests',
};

const step2Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "API Gateway implemented!",
  achievement: "Home screen now loads with 1 request instead of 5",
  metrics: [
    { label: 'API calls', before: '5', after: '1' },
    { label: 'Load time', before: '1000ms', after: '200ms' },
    { label: 'Battery impact', before: 'High', after: 'Low' },
  ],
  nextTeaser: "Great! But the response is 2MB... that's too much data!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'BFF Pattern: Backend for Frontend',
  conceptExplanation: `The **BFF (Backend for Frontend)** pattern introduces a gateway layer specifically for mobile clients.

**Without BFF:**
- Mobile app → User Service (200ms)
- Mobile app → Feed Service (200ms)
- Mobile app → Recommendations (200ms)
- Mobile app → Notifications (200ms)
- Mobile app → Analytics (200ms)
**Total: 1000ms + battery drain from 5 network calls**

**With BFF:**
- Mobile app → Mobile Gateway (200ms)
- Gateway aggregates data from all 5 services in parallel
- Returns single JSON response
**Total: 200ms + 1 network call**

**The BFF layer:**
- Aggregates data from multiple services
- Transforms responses for mobile UI
- Handles mobile-specific logic
- Provides versioned APIs`,

  whyItMatters: 'Every network request on mobile costs battery and time. BFF reduces both dramatically.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Netflix mobile app home screen needs data from 20+ microservices',
    howTheyDoIt: 'They use a mobile BFF that aggregates all data into a single optimized response. Load time dropped from 5 seconds to under 1 second.',
  },

  keyPoints: [
    'BFF sits between mobile app and backend microservices',
    'Aggregates multiple service calls into one response',
    'Can customize responses for iOS vs Android',
    'Reduces network requests = better battery life',
  ],

  diagram: `
    [Mobile App] ──→ [Mobile Gateway/BFF]
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    [User Service]  [Feed Service]  [Notifications]
  `,

  interviewTip: 'Always mention BFF for mobile system designs - it shows you understand mobile constraints.',
};

const step2: GuidedStep = {
  stepNumber: 2,
  title: 'Add API Gateway/BFF Layer',
  story: step2Story,
  learn: step2LearnPhase,
  celebration: step2Celebration,
  practice: {
    task: 'Add an API Gateway that aggregates data from multiple backend services',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Mobile app', displayName: 'Mobile App' },
        { type: 'load_balancer', reason: 'Acts as API Gateway/BFF', displayName: 'Mobile Gateway' },
        { type: 'app_server', reason: 'Backend microservices', displayName: 'User Service' },
        { type: 'app_server', reason: 'Backend microservices', displayName: 'Feed Service' },
      ],
      connectionsNeeded: [
        { from: 'Mobile App', to: 'Mobile Gateway', reason: 'Single aggregated request' },
        { from: 'Mobile Gateway', to: 'User Service', reason: 'Gateway fetches user data' },
        { from: 'Mobile Gateway', to: 'Feed Service', reason: 'Gateway fetches feed data' },
      ],
    },
    successCriteria: [
      'API Gateway aggregates multiple services',
      'Mobile app makes 1 request instead of many',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add API Gateway between mobile app and backend services',
    level2: 'Mobile App → API Gateway → Multiple Backend Services',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Response Compression - Minimize Data Transfer
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📦',
  scenario: "Users are complaining about data usage. Your app consumed their entire monthly data plan!",
  hook: "The home screen response is 2MB of JSON. Most users are on limited mobile data plans. A user complained: 'Your app used 500MB in one week just from browsing!'",
  challenge: "We need to compress responses and only send data that mobile actually needs. Every byte costs users money!",
  illustration: 'data-compression',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Response size reduced dramatically!",
  achievement: "Compression enabled - responses are 90% smaller",
  metrics: [
    { label: 'Response size', before: '2MB', after: '200KB' },
    { label: 'Data usage', before: '500MB/week', after: '50MB/week' },
    { label: 'Load speed', before: '3G: 5 sec', after: '3G: 0.5 sec' },
  ],
  nextTeaser: "Much better! But what happens when users go offline?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Response Compression & Optimization',
  conceptExplanation: `Mobile apps need aggressive data optimization:

**1. Gzip/Brotli Compression**
- Enable HTTP compression (Accept-Encoding: gzip)
- 70-90% size reduction for JSON
- Modern browsers/apps support it automatically

**2. Payload Optimization**
- Remove unnecessary fields
- Paginate large lists
- Use smaller image thumbnails for mobile
- Defer non-critical data

**3. Binary Protocols**
- Protocol Buffers (Protobuf) instead of JSON
- 3-10x smaller than JSON
- Faster to parse (better battery life)

**Example:**
\`\`\`json
// Web API: 2MB response
{
  "user": {...full user object with 50 fields...},
  "feed": [...100 posts with full metadata...],
  "recommendations": [...50 items...],
}

// Mobile BFF: 200KB response (gzipped)
{
  "user": {name, avatar}, // Only 2 fields
  "feed": [...20 posts, thumbnails only...],
  "recommendations": [...10 items...],
}
\`\`\``,

  whyItMatters: 'Data usage directly impacts user retention. Apps that consume too much data get uninstalled.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Facebook Lite for emerging markets with expensive data',
    howTheyDoIt: 'They use aggressive compression, binary protocols, and send only essential data. The app uses 90% less data than regular Facebook.',
  },

  keyPoints: [
    'Enable gzip/brotli compression at API Gateway',
    'BFF returns mobile-optimized payloads',
    'Remove unnecessary fields from responses',
    'Consider Protocol Buffers for binary efficiency',
  ],

  diagram: `
    [Mobile App] ──→ [API Gateway with Compression]
                           │
                           │ gzip enabled
                           ▼
              Original: 2MB → Compressed: 200KB
  `,

  interviewTip: 'Mention compression and payload optimization for any mobile system design.',
};

const step3: GuidedStep = {
  stepNumber: 3,
  title: 'Enable Response Compression',
  story: step3Story,
  learn: step3LearnPhase,
  celebration: step3Celebration,
  practice: {
    task: 'Configure the API Gateway to compress responses and optimize payloads',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Mobile app', displayName: 'Mobile App' },
        { type: 'load_balancer', reason: 'API Gateway with compression', displayName: 'Mobile Gateway' },
        { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
      ],
      connectionsNeeded: [
        { from: 'Mobile App', to: 'Mobile Gateway', reason: 'Compressed responses' },
        { from: 'Mobile Gateway', to: 'Services', reason: 'Aggregates and compresses' },
      ],
    },
    successCriteria: [
      'API Gateway compresses responses',
      'Payload size reduced by 80%+',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
  },
  hints: {
    level1: 'Configure API Gateway to enable compression',
    level2: 'Click on Gateway and enable compression settings',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Offline Support - Local Caching
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📴',
  scenario: "A user is on the subway with no signal. They open your app and see... nothing. Just a blank screen.",
  hook: "Mobile users are constantly moving between good WiFi, slow LTE, and no signal. Your app should work even offline!",
  challenge: "Implement local caching so users can view previously loaded content when offline.",
  illustration: 'offline-mode',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Offline support enabled!",
  achievement: "Users can now browse cached content without connectivity",
  metrics: [
    { label: 'Offline usability', before: 'None', after: 'Full' },
    { label: 'User retention', before: '60%', after: '85%' },
    { label: 'Cache hit rate', after: '70%' },
  ],
  nextTeaser: "Awesome! But how do we notify users when they're back online?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Offline-First Architecture',
  conceptExplanation: `Mobile apps should assume the network is unreliable.

**Offline-First Strategy:**

**1. Local Cache Layer**
- Store API responses in device storage
- Show cached data immediately
- Fetch fresh data in background

**2. Cache Strategies**
- **Cache-First**: Show cache, update if network available
- **Network-First**: Try network, fallback to cache
- **Stale-While-Revalidate**: Show cache, fetch fresh in background

**3. Action Queue**
- User actions (like, post, delete) queue locally
- Sync when network returns
- Handle conflicts gracefully

**4. Optimistic UI**
- Update UI immediately (assume success)
- Show action in queue if offline
- Rollback if sync fails

**Example Flow:**
1. User opens app → Show cached feed immediately
2. App tries to fetch fresh data in background
3. If network available: Update cache and UI
4. If offline: User sees cached data (with "offline" indicator)`,

  whyItMatters: 'Users expect apps to work instantly, regardless of network. Offline support is now table stakes for mobile.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Users scroll through feed on subway with spotty signal',
    howTheyDoIt: 'Instagram aggressively caches feed content. You can browse for minutes offline. When you like a post offline, it queues and syncs later.',
  },

  keyPoints: [
    'Cache API responses in local storage (SQLite, CoreData)',
    'Show cached data immediately on app open',
    'Queue user actions for sync when online',
    'Use optimistic UI for instant feedback',
  ],

  diagram: `
    [Mobile App]
         │
         ├──→ [Local Cache] ─── Instant load
         │         │
         │         └──→ Check if stale
         │
         └──→ [API Gateway] ─── Update cache in background
  `,

  interviewTip: 'Offline-first is a key mobile design pattern. Always mention local caching and sync queues.',
};

const step4: GuidedStep = {
  stepNumber: 4,
  title: 'Implement Offline Support with Caching',
  story: step4Story,
  learn: step4LearnPhase,
  celebration: step4Celebration,
  practice: {
    task: 'Add local caching to the mobile app for offline support',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Mobile app with local cache', displayName: 'Mobile App' },
        { type: 'cache', reason: 'Represents local device storage', displayName: 'Local Cache' },
        { type: 'load_balancer', reason: 'API Gateway', displayName: 'Mobile Gateway' },
        { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
      ],
      connectionsNeeded: [
        { from: 'Mobile App', to: 'Local Cache', reason: 'Read cached data offline' },
        { from: 'Mobile App', to: 'Mobile Gateway', reason: 'Fetch fresh data when online' },
      ],
    },
    successCriteria: [
      'Local cache stores API responses',
      'App works offline with cached data',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cache', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'cache' },
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a cache component for local storage and connect it to the mobile app',
    level2: 'Mobile App connects to both Local Cache and API Gateway',
    solutionComponents: [{ type: 'client' }, { type: 'cache' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'cache' },
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Push Notifications - Real-Time Engagement
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔔',
  scenario: "Users are missing important updates because they don't keep the app open all the time.",
  hook: "When someone likes their post or sends a message, users should get notified immediately - even when the app is closed!",
  challenge: "Implement push notification infrastructure to send real-time alerts to mobile devices.",
  illustration: 'push-notifications',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Push notifications are live!",
  achievement: "Users now receive real-time notifications",
  metrics: [
    { label: 'Notification delivery', after: '99.9%' },
    { label: 'User engagement', before: '20%', after: '65%' },
    { label: 'Daily active users', before: '10K', after: '25K' },
  ],
  nextTeaser: "Amazing! But we need to persist notification data...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Push Notification Architecture',
  conceptExplanation: `Push notifications let you reach users even when your app is closed.

**How Push Notifications Work:**

**1. Device Registration**
- App launches → Requests permission for notifications
- OS provides device token (unique identifier)
- App sends token to your backend

**2. Sending Notifications**
- Backend triggers notification (e.g., "New message!")
- Your server sends to push provider (APNs for iOS, FCM for Android)
- Provider delivers to device using device token

**3. Push Service Providers**
- **APNs** (Apple Push Notification service) - iOS
- **FCM** (Firebase Cloud Messaging) - Android + iOS
- **SNS** (AWS Simple Notification Service) - Multi-platform

**Architecture Components:**
- **Notification Service**: Manages sending logic
- **Device Registry**: Stores device tokens
- **Message Queue**: Buffers notifications for delivery
- **Push Gateway**: Interfaces with APNs/FCM

**Example Flow:**
1. User A likes User B's post
2. Backend → Notification Service: "User A liked your post"
3. Notification Service → Query device tokens for User B
4. Send to FCM/APNs with User B's token
5. Device receives notification and shows alert`,

  whyItMatters: 'Push notifications are the primary re-engagement channel for mobile apps. Without them, users forget about your app.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Delivering 100 billion notifications per day',
    howTheyDoIt: 'WhatsApp uses a custom notification infrastructure on top of FCM/APNs. They batch notifications and prioritize by importance to reduce battery drain.',
  },

  famousIncident: {
    title: 'Pokemon GO Notification Storm',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'A bug caused Pokemon GO to send the same notification to all 100M users simultaneously. FCM/APNs were overwhelmed. Many users received 50+ duplicate notifications. Battery drain was massive.',
    lessonLearned: 'Rate-limit notifications, deduplicate on the client, and implement backoff strategies for push providers.',
    icon: '⚡',
  },

  keyPoints: [
    'Use FCM for Android, APNs for iOS (or FCM for both)',
    'Store device tokens in a registry database',
    'Queue notifications for reliable delivery',
    'Implement batching and rate limiting',
    'Allow users to manage notification preferences',
  ],

  diagram: `
    [Backend Service] ──→ [Notification Service]
                                │
                                ├──→ [Message Queue]
                                │
                                ├──→ [Device Registry DB]
                                │
                                └──→ [Push Gateway] ──┬──→ [APNs] ──→ [iOS Device]
                                                      │
                                                      └──→ [FCM] ──→ [Android Device]
  `,

  interviewTip: 'Always mention both APNs and FCM when discussing mobile push notifications.',
};

const step5: GuidedStep = {
  stepNumber: 5,
  title: 'Add Push Notification Infrastructure',
  story: step5Story,
  learn: step5LearnPhase,
  celebration: step5Celebration,
  practice: {
    task: 'Implement push notification system with message queue and push gateway',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Mobile devices receive notifications', displayName: 'Mobile App' },
        { type: 'app_server', reason: 'Notification Service', displayName: 'Notification Service' },
        { type: 'message_queue', reason: 'Queue notifications for delivery', displayName: 'Message Queue' },
        { type: 'app_server', reason: 'Push Gateway to APNs/FCM', displayName: 'Push Gateway' },
      ],
      connectionsNeeded: [
        { from: 'Notification Service', to: 'Message Queue', reason: 'Queue notifications' },
        { from: 'Message Queue', to: 'Push Gateway', reason: 'Process queued notifications' },
        { from: 'Push Gateway', to: 'Mobile App', reason: 'Deliver to devices via APNs/FCM' },
      ],
    },
    successCriteria: [
      'Notification Service queues notifications',
      'Push Gateway delivers to mobile devices',
      'Reliable delivery with message queue',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add Notification Service → Message Queue → Push Gateway → Mobile App',
    level2: 'Build the push notification pipeline with queuing for reliability',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
      { from: 'app_server', to: 'client' },
    ],
  },
};

// =============================================================================
// STEP 6: Persist Notification Data
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💾',
  scenario: "Your notification service crashes and all device tokens are lost!",
  hook: "Users aren't getting notifications anymore because the device registry was only in memory. We need persistent storage!",
  challenge: "Add a database to store device tokens and notification history.",
  illustration: 'database',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Notification data is now persisted!",
  achievement: "Device tokens and history survive service restarts",
  metrics: [
    { label: 'Device registry', before: 'In-memory', after: 'Persisted' },
    { label: 'Data durability', before: 'Lost on restart', after: '100%' },
  ],
  nextTeaser: "Great! Now let's optimize for high-volume traffic...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Notification Data Persistence',
  conceptExplanation: `Your push notification system needs to store:

**1. Device Registry**
- Device token (unique identifier)
- User ID (who owns this device)
- Platform (iOS/Android)
- App version
- Last active timestamp

**2. Notification History**
- Notification ID
- User ID
- Message content
- Status (sent, delivered, failed)
- Timestamp

**3. User Preferences**
- Which notification types are enabled
- Quiet hours
- Per-device settings

**Database Schema Example:**
\`\`\`sql
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  device_token TEXT NOT NULL,
  platform ENUM('ios', 'android'),
  created_at TIMESTAMP,
  last_active TIMESTAMP
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  message TEXT,
  status ENUM('queued', 'sent', 'delivered', 'failed'),
  created_at TIMESTAMP
);
\`\`\``,

  whyItMatters: 'Device tokens and notification preferences must persist. Losing them means losing your communication channel with users.',

  keyPoints: [
    'Store device tokens in database',
    'Track notification delivery status',
    'Support multiple devices per user',
    'Clean up stale/inactive tokens periodically',
  ],

  diagram: `
    [Notification Service] ──→ [Database]
                                  │
                                  ├── device_tokens
                                  ├── notifications
                                  └── user_preferences
  `,

  interviewTip: 'Mention the need to clean up stale device tokens to avoid wasting resources on invalid devices.',
};

const step6: GuidedStep = {
  stepNumber: 6,
  title: 'Add Database for Notification Data',
  story: step6Story,
  learn: step6LearnPhase,
  celebration: step6Celebration,
  practice: {
    task: 'Add a database to persist device tokens and notification history',
    hints: {
      componentsNeeded: [
        { type: 'app_server', reason: 'Notification Service', displayName: 'Notification Service' },
        { type: 'database', reason: 'Store device tokens and history', displayName: 'Database' },
      ],
      connectionsNeeded: [
        { from: 'Notification Service', to: 'Database', reason: 'Read/write device tokens' },
      ],
    },
    successCriteria: [
      'Database stores device tokens',
      'Notification history is persisted',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect it to the Notification Service',
    level2: 'Notification Service needs to store device tokens in the database',
    solutionComponents: [{ type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Scale with Load Balancer
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Your app went viral! Traffic increased 100x overnight.",
  hook: "A single API Gateway can't handle the load. Requests are timing out. Users are seeing errors!",
  challenge: "Add a load balancer and multiple gateway instances to handle high traffic.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "System scaled successfully!",
  achievement: "Multiple gateway instances handle high traffic",
  metrics: [
    { label: 'Capacity', before: '1K RPS', after: '50K RPS' },
    { label: 'Gateway instances', before: '1', after: '5+' },
    { label: 'Availability', before: '99%', after: '99.9%' },
  ],
  nextTeaser: "Excellent! Now let's add caching to reduce backend load...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Mobile Gateway with Load Balancer',
  conceptExplanation: `Mobile apps can generate massive traffic spikes:
- App launches (morning commute)
- Push notifications driving opens
- Viral content

**Horizontal Scaling:**
- Run multiple API Gateway instances
- Load balancer distributes traffic
- Each instance handles aggregation independently

**Mobile-Specific Considerations:**
- **Sticky sessions NOT needed** - gateways are stateless
- **Health checks** - remove failing instances
- **Auto-scaling** - scale based on traffic patterns
- **Geographic distribution** - gateways near users

**Load Balancing Strategies:**
- Round-robin for even distribution
- Least connections for optimal utilization
- Geographic routing for low latency`,

  whyItMatters: 'Mobile traffic is unpredictable. Viral content or push notifications can cause 100x traffic spikes in minutes.',

  realWorldExample: {
    company: 'TikTok',
    scenario: 'Viral videos drive massive traffic spikes',
    howTheyDoIt: 'Auto-scaling gateway clusters across multiple regions. They can scale from 1000 to 10000 instances in under 5 minutes.',
  },

  keyPoints: [
    'Load balancer in front of API Gateway cluster',
    'Gateway instances are stateless - easy to scale',
    'Auto-scaling based on CPU/request metrics',
    'Multiple availability zones for reliability',
  ],

  diagram: `
    [Mobile Apps] ──→ [Load Balancer]
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    [Gateway 1]       [Gateway 2]       [Gateway 3]
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                           ▼
                  [Backend Services]
  `,

  interviewTip: 'Mention auto-scaling for mobile gateways - traffic patterns are highly variable.',
};

const step7: GuidedStep = {
  stepNumber: 7,
  title: 'Add Load Balancer for High Availability',
  story: step7Story,
  learn: step7LearnPhase,
  celebration: step7Celebration,
  practice: {
    task: 'Add load balancer and scale gateway instances',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Mobile apps', displayName: 'Mobile App' },
        { type: 'load_balancer', reason: 'Distribute traffic to gateways', displayName: 'Load Balancer' },
        { type: 'load_balancer', reason: 'API Gateway instances', displayName: 'API Gateway Cluster' },
        { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
      ],
      connectionsNeeded: [
        { from: 'Mobile App', to: 'Load Balancer', reason: 'Entry point' },
        { from: 'Load Balancer', to: 'API Gateway Cluster', reason: 'Distribute to gateways' },
        { from: 'API Gateway Cluster', to: 'Services', reason: 'Aggregate backend data' },
      ],
    },
    successCriteria: [
      'Load balancer distributes traffic',
      'Multiple gateway instances running',
      'High availability achieved',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add load balancer in front of API Gateway cluster',
    level2: 'Mobile App → Load Balancer → Multiple Gateway Instances → Services',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add API-Level Cache
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your backend services are getting hammered by the same requests over and over.",
  hook: "Every mobile app requests the same trending feed. Why fetch it from the database 1000 times per second when it only changes every 5 minutes?",
  challenge: "Add a cache layer at the API Gateway to serve repeated requests without hitting backend services.",
  illustration: 'caching',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "API cache reduces backend load by 90%!",
  achievement: "Repeated requests served from cache in milliseconds",
  metrics: [
    { label: 'Backend requests', before: '10K/sec', after: '1K/sec' },
    { label: 'Response time', before: '200ms', after: '20ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "Perfect! You've built a production-ready mobile backend!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway Caching',
  conceptExplanation: `API-level caching reduces load on backend services:

**What to Cache:**
- Public content (trending, popular items)
- User-specific data with short TTL
- Static/semi-static responses
- Expensive aggregations

**Cache Strategy:**
1. **Cache-Aside**: Check cache → Miss → Fetch → Store
2. **TTL-based**: Expire after N seconds/minutes
3. **Cache Invalidation**: Update cache on data change

**Mobile-Specific Caching:**
- **Short TTLs** for user data (30-60 seconds)
- **Long TTLs** for static content (hours/days)
- **Vary by app version** for API compatibility
- **Compressed cache entries** to save memory

**Example Cache Keys:**
\`\`\`
feed:trending:v1                → TTL: 5 minutes
user:12345:profile:v2           → TTL: 1 minute
recommendations:12345:ios:v3    → TTL: 10 minutes
\`\`\`

**Cache Invalidation:**
- Time-based (TTL expires)
- Event-based (user updates profile → invalidate)
- Tag-based (invalidate all user-related keys)`,

  whyItMatters: 'Mobile apps generate repeated identical requests. Caching at the gateway reduces backend load 10-100x.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline API called millions of times per second',
    howTheyDoIt: 'Redis cache at API gateway layer. Popular timelines cached for 30 seconds. Cache hit rate: 95%+.',
  },

  famousIncident: {
    title: 'Instagram Cache Stampede',
    company: 'Instagram',
    year: '2015',
    whatHappened: 'When Instagram\'s Redis cache crashed, all requests hit the database simultaneously. The DB couldn\'t handle 10x load and crashed too. Cascading failure took down the entire service for 2 hours.',
    lessonLearned: 'Implement circuit breakers and request coalescing to prevent cache stampedes.',
    icon: '💥',
  },

  keyPoints: [
    'Cache at API Gateway layer (Redis)',
    'Short TTLs for user data, long for static',
    'Cache compressed responses',
    'Monitor cache hit rate (target: 80%+)',
  ],

  diagram: `
    [Mobile App] ──→ [Load Balancer] ──→ [API Gateway]
                                              │
                                              ├──→ [Cache] ─── 90% of requests
                                              │        │
                                              │        └── Cache hit!
                                              │
                                              └──→ [Services] ─── 10% cache misses
  `,

  interviewTip: 'Always mention caching at the API Gateway level for mobile backends. It\'s a huge win.',
};

const step8: GuidedStep = {
  stepNumber: 8,
  title: 'Add API Gateway Cache',
  story: step8Story,
  learn: step8LearnPhase,
  celebration: step8Celebration,
  practice: {
    task: 'Add cache layer at API Gateway to reduce backend load',
    hints: {
      componentsNeeded: [
        { type: 'load_balancer', reason: 'API Gateway Cluster', displayName: 'API Gateway' },
        { type: 'cache', reason: 'Redis cache for responses', displayName: 'Cache' },
        { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
      ],
      connectionsNeeded: [
        { from: 'API Gateway', to: 'Cache', reason: 'Check cache before backend' },
        { from: 'API Gateway', to: 'Services', reason: 'Fetch on cache miss' },
      ],
    },
    successCriteria: [
      'Cache layer added to gateway',
      '90%+ cache hit rate',
      'Backend load reduced dramatically',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'cache', 'app_server'],
    requiredConnections: [
      { fromType: 'load_balancer', toType: 'cache' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add cache between API Gateway and backend services',
    level2: 'Gateway checks cache first, then queries services on miss',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'cache' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'load_balancer', to: 'cache' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const mobileGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'mobile-gateway-guided',
  problemTitle: 'Build Mobile Gateway - BFF & Optimization',

  requirementsPhase: mobileGatewayRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],
};

export function getMobileGatewayGuidedTutorial(): GuidedTutorial {
  return mobileGatewayGuidedTutorial;
}
