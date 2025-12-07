import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Google Calendar Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a calendar and scheduling platform like Google Calendar.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, replication, queues, optimization)
 *
 * Key Concepts:
 * - Event creation and management
 * - Recurring events with RRULE
 * - Calendar sharing and permissions
 * - Meeting invites with RSVP
 * - Conflict detection
 * - Time zone handling
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const googlecalendarRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a calendar and scheduling platform like Google Calendar",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Staff Engineer at Productivity Systems Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-calendar',
      category: 'functional',
      question: "What are the core features users need in a calendar application?",
      answer: "Users need to:\n\n1. **Create events** - Add events with title, time, location, description\n2. **View calendar** - See events in day/week/month views\n3. **Edit/Delete events** - Modify or remove existing events\n4. **Set reminders** - Get notifications before events start",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Google Calendar is about organizing time - events are the fundamental building block",
    },
    {
      id: 'recurring-events',
      category: 'functional',
      question: "How should recurring events work?",
      answer: "Users should be able to create **recurring events** like:\n- Daily standup (every weekday)\n- Weekly team meeting (every Monday at 10am)\n- Monthly all-hands (first Friday of each month)\n\nUse **RRULE** (Recurrence Rule) standard: 'FREQ=WEEKLY;BYDAY=MO,WE,FR'\n\nUsers should be able to edit just one instance or the entire series.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Recurring events are complex - don't store each instance, compute them on-demand using RRULE",
    },
    {
      id: 'sharing',
      category: 'functional',
      question: "Can users share calendars with others?",
      answer: "Yes! **Calendar sharing** is essential:\n- **View-only** - Others can see your events\n- **Edit access** - Others can add/modify events\n- **Free/Busy only** - Show availability without details\n\nUsers can share entire calendars or individual events.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Sharing requires permissions system and access control",
    },
    {
      id: 'meeting-invites',
      category: 'functional',
      question: "How do meeting invites work?",
      answer: "Users can **invite attendees** to events:\n- Send email invitations with event details\n- Attendees can RSVP (Yes/No/Maybe)\n- See who's accepted/declined\n- Update invites when event changes\n\nThis is critical for coordinating meetings with colleagues.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Invites require email integration and state management (pending/accepted/declined)",
    },
    {
      id: 'conflict-detection',
      category: 'clarification',
      question: "Should the system detect scheduling conflicts?",
      answer: "Yes! When creating an event, show a **warning** if it conflicts with existing events. Don't block it (users might want double-booked time), just warn them.",
      importance: 'important',
      insight: "Conflict detection requires efficient time-range queries",
    },
    {
      id: 'time-zones',
      category: 'clarification',
      question: "How should the system handle time zones?",
      answer: "Store all events in **UTC**, display in user's local time zone. When users travel, events should automatically adjust to local time. For MVP, focus on basic time zone support.",
      importance: 'important',
      insight: "Time zones are complex - store UTC, convert on display",
    },
    {
      id: 'notifications',
      category: 'clarification',
      question: "What types of reminders should be supported?",
      answer: "For MVP:\n- **Email reminders** - 10 min, 1 hour, 1 day before\n- **In-app notifications** - Browser/mobile push notifications\n\nSMS reminders can come later.",
      importance: 'important',
      insight: "Reminders require a background job system to trigger at specific times",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million registered users, with 50 million daily active users. Average user has 3 calendars (personal, work, shared).",
      importance: 'critical',
      learningPoint: "This is massive scale - similar to Google Calendar's user base",
    },
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events are created per day?",
      answer: "About 200 million events created per day across all users",
      importance: 'critical',
      calculation: {
        formula: "200M ÷ 86,400 sec = 2,315 events/sec",
        result: "~2.3K writes/sec (7K at peak)",
      },
      learningPoint: "Moderate write volume, but high read volume for calendar views",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How often do users check their calendar?",
      answer: "Average user checks calendar 10 times per day. That's 500 million calendar views per day.",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 = 5,787 reads/sec",
        result: "~6K reads/sec (18K at peak)",
      },
      learningPoint: "Read-heavy workload - caching is critical",
    },
    {
      id: 'recurring-complexity',
      category: 'burst',
      question: "What about users with hundreds of recurring events?",
      answer: "Power users might have 50+ recurring events (daily standup, weekly meetings, etc.). Expanding a month view could generate 1,000+ event instances to compute.",
      importance: 'critical',
      insight: "Don't store all instances - compute on-demand and cache aggressively",
    },
    {
      id: 'latency-read',
      category: 'latency',
      question: "How fast should calendar views load?",
      answer: "p99 under 300ms. Users expect instant calendar views when switching between day/week/month.",
      importance: 'critical',
      learningPoint: "Sub-second latency requires efficient queries and caching",
    },
    {
      id: 'latency-invite',
      category: 'latency',
      question: "How quickly should meeting invites be sent?",
      answer: "Invites should be sent within 5 seconds of event creation. Async processing is acceptable.",
      importance: 'important',
      learningPoint: "Email delivery can be async - use message queues",
    },
    {
      id: 'data-retention',
      category: 'reliability',
      question: "How long should events be stored?",
      answer: "Events should be stored **forever** (or until user deletes). Users reference old calendar events for years. This is their historical record.",
      importance: 'critical',
      learningPoint: "Unlike ephemeral data, calendar events are permanent records",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-calendar', 'recurring-events', 'sharing'],
  criticalFRQuestionIds: ['core-calendar', 'recurring-events', 'meeting-invites'],
  criticalScaleQuestionIds: ['throughput-users', 'throughput-reads', 'recurring-complexity'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create events',
      description: 'Create events with title, time, location, description, and reminders',
      emoji: '📅',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view their calendar',
      description: 'View events in day, week, or month views',
      emoji: '📆',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can create recurring events',
      description: 'Set up events that repeat (daily, weekly, monthly) using RRULE',
      emoji: '🔁',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can share calendars',
      description: 'Share calendars with view or edit permissions',
      emoji: '🤝',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can send meeting invites',
      description: 'Invite attendees who can RSVP (Yes/No/Maybe)',
      emoji: '✉️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '200 million events',
    readsPerDay: '500 million views',
    peakMultiplier: 3,
    readWriteRatio: '2.5:1 (read-heavy)',
    calculatedWriteRPS: { average: 2315, peak: 6945 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~10KB (event with attendees)',
    storagePerRecord: '~2KB',
    storageGrowthPerYear: '~150TB',
    redirectLatencySLA: 'p99 < 300ms (calendar view)',
    createLatencySLA: 'p99 < 200ms (create event)',
  },

  architecturalImplications: [
    '✅ Read-heavy workload → Aggressive caching required',
    '✅ Recurring events → Compute on-demand, don\'t store all instances',
    '✅ Time zone complexity → Store UTC, convert on display',
    '✅ Meeting invites → Message queue for async email delivery',
    '✅ Conflict detection → Efficient time-range index queries',
  ],

  outOfScope: [
    'Video conferencing integration (Zoom/Meet)',
    'Room/resource booking',
    'Advanced scheduling AI (find meeting time)',
    'SMS reminders',
    'Calendar sync with other providers (Outlook, iCal)',
    'Team workspace features',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create events, view their calendar, and handle basic recurring events. Scaling challenges and optimization will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📅',
  scenario: "Welcome to Productivity Systems Inc! You've been hired to build the next Google Calendar.",
  hook: "Your first user wants to create a calendar event!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your calendar platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Google Calendar:
1. Their device (browser, mobile app) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t create or view events at all.',

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Handling 50 million daily active users',
    howTheyDoIt: 'Started with a simple web app in 2006, now uses a complex distributed system across Google\'s global infrastructure',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'googlecalendar-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Calendar', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles event creation and calendar logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle events yet!",
  hook: "A user just tried to create a meeting but got an error.",
  challenge: "Write the Python code to create events, view calendar, and handle recurring events.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle calendar events!',
  achievement: 'You implemented the core Calendar functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create events', after: '✓' },
    { label: 'Can view calendar', after: '✓' },
    { label: 'Can handle recurring events', after: '✓' },
    { label: 'Can send invites', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all events are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Calendar Event Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Google Calendar, we need handlers for:
- \`create_event()\` - Create a new calendar event
- \`get_events()\` - Retrieve events for a date range
- \`expand_recurring()\` - Generate instances of recurring events
- \`send_invite()\` - Send meeting invitations

For now, we'll store everything in memory (Python dictionaries).

**RRULE Example:**
\`\`\`
RRULE: FREQ=WEEKLY;BYDAY=MO,WE,FR
→ Repeats every Monday, Wednesday, Friday
\`\`\``,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the calendar logic lives!',

  famousIncident: {
    title: 'Google Calendar Recurring Event Bug',
    company: 'Google',
    year: '2019',
    whatHappened: 'A bug in recurring event logic caused some users to lose all instances of recurring meetings. The RRULE expansion code had an edge case with time zones and daylight saving time.',
    lessonLearned: 'Recurring events are HARD. Test edge cases thoroughly: time zones, DST transitions, leap years.',
    icon: '🔁',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Creating 200M events per day',
    howTheyDoIt: 'Event service validates RRULE, stores base event, computes instances on-demand for calendar views',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'RRULE standard defines recurring patterns',
    'Don\'t store all recurring instances - compute on-demand',
  ],

  quickCheck: {
    question: 'Why compute recurring event instances on-demand instead of storing them all?',
    options: [
      'It\'s faster to compute than to read from database',
      'Infinite recurrence would require infinite storage',
      'Users prefer dynamic generation',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'A recurring event without an end date is infinite. You can\'t store infinite instances! Compute only what users need to see.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'RRULE', explanation: 'Standard for defining recurrence patterns', icon: '🔁' },
    { title: 'Event Instance', explanation: 'Single occurrence of a recurring event', icon: '📌' },
  ],
};

const step2: GuidedStep = {
  id: 'googlecalendar-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create events, FR-2: View calendar, FR-3: Recurring events, FR-5: Send invites',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/events, GET /api/v1/events, GET /api/v1/events/:id/instances, POST /api/v1/events/:id/invites APIs',
      'Open the Python tab',
      'Implement create_event(), get_events(), expand_recurring(), and send_invite() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_event, get_events, expand_recurring, and send_invite',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/events', 'GET /api/v1/events', 'GET /api/v1/events/:id/instances', 'POST /api/v1/events/:id/invites'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the calendar events were GONE! Your users lost their entire schedule.",
  challenge: "Add a database so events survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your calendar events are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But calendar views are getting slow as events accumulate...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval with indexes

For Google Calendar, we need tables for:
- \`calendars\` - User calendars (personal, work, shared)
- \`events\` - All events (including recurring base events)
- \`event_attendees\` - Who's invited to each event
- \`calendar_shares\` - Sharing permissions
- \`reminders\` - Notification settings per event`,

  whyItMatters: 'Imagine losing your entire work calendar because of a server restart. Years of meetings, appointments, deadlines - gone!',

  famousIncident: {
    title: 'Google Calendar Sync Outage',
    company: 'Google',
    year: '2017',
    whatHappened: 'A database issue caused calendar sync to fail for millions of users. New events weren\'t saving, and existing events weren\'t loading. Lasted several hours during work hours.',
    lessonLearned: 'Database reliability is non-negotiable. Events are critical data - must never be lost.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Storing billions of events',
    howTheyDoIt: 'Uses distributed databases (Spanner) partitioned by user_id for horizontal scaling. Each user\'s events stay together.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data with relationships',
    'Index on user_id and time ranges for fast queries',
    'Store recurring base event + RRULE, not all instances',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved to disk',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'Index', explanation: 'Speed up queries on specific columns', icon: '🔍' },
  ],
};

const step3: GuidedStep = {
  id: 'googlecalendar-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store events, calendars, attendees, shares permanently', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Calendar Views
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 50 million users, and calendar views are loading slowly!",
  hook: "Users complain: 'Why does it take 2 seconds to load my calendar?' Every view hits the database and computes recurring events.",
  challenge: "Add a cache to make calendar views lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Calendar views load 15x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Calendar view latency', before: '2000ms', after: '130ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when traffic spikes during work hours?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Google Calendar, we cache:
- **Expanded recurring events** - Computed instances for current month
- **Calendar metadata** - User's calendar list and settings
- **Conflict detection results** - Recent availability checks

Instead of:
\`\`\`
Request → Database (slow, 100ms) → Compute RRULE (50ms) = 150ms
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Return cached instances = 1ms
\`\`\`

Cache invalidation strategy:
- When event is modified → invalidate that event's cache
- When new event created → invalidate overlapping time ranges
- Set TTL to 1 hour for expanded instances`,

  whyItMatters: 'Users check their calendar 10 times per day. Computing recurring events every time would crush the database.',

  famousIncident: {
    title: 'Google Calendar Mobile Slowdown',
    company: 'Google',
    year: '2018',
    whatHappened: 'Mobile app performance degraded significantly for users with many recurring events. The app was re-computing RRULE instances on every view. Fixed by implementing aggressive client-side and server-side caching.',
    lessonLearned: 'Cache computed results aggressively. Recurring event expansion is CPU-intensive.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Serving 500M calendar views per day',
    howTheyDoIt: 'Uses multi-tier caching: client cache (1 hour), CDN cache (5 min), Redis cache (1 hour). Most views never hit database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return expanded events!
                     │
                     │   Cache Miss?
                     └──▶ Query DB + Compute RRULE → Store in cache
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache expanded recurring event instances (1 hour TTL)',
    'Cache Hit = instant response (1ms)',
    'Cache Miss = query + compute + store',
    'Invalidate cache when events are modified',
  ],

  quickCheck: {
    question: 'What should you cache for a calendar application?',
    options: [
      'All events for all time',
      'Expanded recurring events for current/next month',
      'Only user settings',
      'Nothing - compute on every request',
    ],
    correctIndex: 1,
    explanation: 'Cache what users frequently access: current and near-future events. Don\'t cache all time (too much data).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch and compute', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'googlecalendar-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can view their calendar (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache expanded recurring events and calendar metadata', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (3600 seconds for calendar views)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 3600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out during work hours!",
  hook: "Every morning at 9am, request volume spikes 5x. One server can't handle it all.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Peak capacity', before: '1x', after: '5x+' },
  ],
  nextTeaser: "But we need database redundancy for high availability...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- **Round-robin**: Take turns distributing requests
- **Least connections**: Send to least busy server
- **IP hash**: Same user always goes to same server (session affinity)

For calendar, use **least connections** to balance load evenly.`,

  whyItMatters: 'Calendar usage follows work hours. Peak traffic (9am-5pm) is 5x higher than nights. Need multiple servers.',

  famousIncident: {
    title: 'Google Calendar January 1st Spike',
    company: 'Google',
    year: '2016',
    whatHappened: 'Every January 1st, users flood the calendar with New Year events and resolutions. Traffic spikes 10x. Google\'s auto-scaling and load balancing kicked in to handle the surge.',
    lessonLearned: 'Predictable traffic patterns (work hours, holidays) require elastic capacity with load balancing.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Handling global work hour peaks',
    howTheyDoIt: 'Uses Google Cloud Load Balancer with auto-scaling. Spins up extra servers during peak hours (9am-5pm in each timezone).',
  },

  diagram: `
              ┌─────────────────┐
              │  App Server 1   │
┌────────┐   ┌──────────────────┐   └─────────────────┘
│ Client │──▶│  Load Balancer   │──▶  App Server 2
└────────┘   │(Least Connections)│   ┌─────────────────┐
              └──────────────────┘   │  App Server 3   │
              └─────────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Use least connections strategy for even load',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes when using a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Users see an error page',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers (health checks) and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'googlecalendar-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers, handle peak load', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed for 30 minutes this morning. Users couldn't access their calendars!",
  hook: "During peak work hours, no one could see their meetings. Revenue impact: lost productivity for thousands of businesses.",
  challenge: "Add database replication so a backup is always ready.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need async processing for meeting invites...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Events',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your events

For calendar:
- Writes go to primary (create/update/delete events)
- Reads go to replicas (view calendar, check conflicts)
- Replication lag: typically <100ms`,

  whyItMatters: 'A single database is a single point of failure. For 50M users checking calendars, downtime is unacceptable.',

  famousIncident: {
    title: 'Google Calendar Worldwide Outage',
    company: 'Google',
    year: '2020',
    whatHappened: 'A database configuration error caused a 3-hour outage affecting millions of users globally. Calendar views failed, events couldn\'t be created. Google had to failover to backup data centers.',
    lessonLearned: 'Database replication is essential. Test failover regularly - it must be automatic and fast.',
    icon: '🌍',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Zero tolerance for event loss',
    howTheyDoIt: 'Uses Google Spanner with multi-region replication. Each user\'s events are stored on 5+ servers across different geographic zones.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'If primary fails, a replica can be promoted',
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
    'Calendar views can read from replicas (eventual consistency OK)',
  ],

  quickCheck: {
    question: 'What happens if the primary database fails with replication enabled?',
    options: [
      'All data is lost',
      'A replica is promoted to become the new primary',
      'All reads and writes fail',
      'The system automatically creates a new database',
    ],
    correctIndex: 1,
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'googlecalendar-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Invites and Reminders
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📧',
  scenario: "Creating a meeting with 50 attendees is taking 15 seconds!",
  hook: "The server is waiting for all 50 email invites to send before responding. Users are frustrated.",
  challenge: "Add a message queue to send invites and reminders asynchronously.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Event creation is instant!',
  achievement: 'Async processing handles invites and reminders',
  metrics: [
    { label: 'Event create latency', before: '15s', after: '<200ms' },
    { label: 'Invite delivery', after: 'Async' },
    { label: 'Reminder delivery', after: 'Scheduled' },
  ],
  nextTeaser: "But we need to optimize costs...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Invites and Reminders',
  conceptExplanation: `Message queues enable **async processing** so users don't wait.

When an event with invites is created:
1. **Synchronous**: Save event to database, return success ✓
2. **Async via Queue**:
   - Send email invites to all attendees
   - Schedule reminder notifications
   - Update shared calendars
   - Check for conflicts

This is the **write-through, async fan-out** pattern.

For reminders:
- When event is created → queue reminder job for (event_time - 10 min)
- Background worker polls queue at scheduled time → sends notification
- Supports email, push notifications, SMS`,

  whyItMatters: 'Without queues, creating an event with 50 attendees would block for 15+ seconds. Users expect instant confirmation!',

  famousIncident: {
    title: 'Google Calendar Notification Storm',
    company: 'Google',
    year: '2015',
    whatHappened: 'A bug caused duplicate reminder notifications to be sent. Users got hundreds of notifications for the same event. The message queue was processing the same job multiple times.',
    lessonLearned: 'Queue processing must be idempotent. Use deduplication and job IDs.',
    icon: '🔔',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Sending millions of invites and reminders daily',
    howTheyDoIt: 'Uses Cloud Pub/Sub for event streaming. Background workers handle email delivery, push notifications, and scheduled reminders.',
  },

  diagram: `
User Creates Event with Invites
      │
      ▼
┌─────────────┐     ┌──────────────────────────────┐
│ App Server  │────▶│      Message Queue           │
│ (instant)   │     │  [invite1, invite2, ...]     │
└─────────────┘     └──────────────┬───────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Created!"                 ▼
                          ┌─────────────────┐
                          │  Async Workers  │
                          │  (background)   │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐          ┌──────────┐        ┌──────────┐
        │  Email   │          │  Push    │        │Scheduled │
        │ Invites  │          │  Notif   │        │Reminders │
        └──────────┘          └──────────┘        └──────────┘
`,

  keyPoints: [
    'Queue decouples event creation from invite delivery',
    'User gets instant response - delivery happens async',
    'Workers handle email invites, push notifications, reminders',
    'Reminders are scheduled jobs (event_time - X minutes)',
  ],

  quickCheck: {
    question: 'Why use async processing for meeting invites?',
    options: [
      'It\'s cheaper',
      'User gets instant response while invites send in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Event is saved instantly, invites to 50 people happen in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Scheduled Job', explanation: 'Task that runs at specific time', icon: '⏰' },
  ],
};

const step7: GuidedStep = {
  id: 'googlecalendar-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Users can send meeting invites (now async)',
    taskDescription: 'Add a Message Queue for async invite delivery and reminder scheduling',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async invites and scheduled reminders', displayName: 'RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag a Message Queue (RabbitMQ) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async invite delivery and reminder scheduling.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $400,000.",
  hook: "The CFO says: 'Cut costs by 30% or we need to charge users more.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Google Calendar!',
  achievement: 'A scalable, cost-effective calendar platform',
  metrics: [
    { label: 'Monthly cost', before: '$400K', after: 'Under budget' },
    { label: 'Calendar view latency', after: '<300ms' },
    { label: 'Event create latency', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '50M daily users' },
  ],
  nextTeaser: "You've mastered calendar system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Cache aggressively** - Reduce expensive DB queries and RRULE computation
2. **Database query optimization** - Index on user_id + time range
3. **Archive old events** - Move events >2 years old to cold storage
4. **Auto-scale workers** - Scale reminder workers based on queue depth
5. **Optimize RRULE computation** - Cache expanded instances for 1 hour

For Google Calendar:
- Most users access current/next month only - cache that aggressively
- Use read replicas for calendar views (95% of traffic)
- Auto-scale app servers based on time of day (peak 9am-5pm)
- Archive old events to cheaper storage tier`,

  whyItMatters: 'At 50M users, every optimization saves thousands in monthly costs. Small improvements add up.',

  famousIncident: {
    title: 'Google Calendar Infrastructure Evolution',
    company: 'Google',
    year: '2010-2020',
    whatHappened: 'As Calendar scaled from millions to billions of events, Google invested heavily in optimization: Spanner for global distribution, aggressive caching, query optimization, code efficiency.',
    lessonLearned: 'At scale, infrastructure costs are significant. Design for cost efficiency from day 1.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Google Calendar',
    scenario: 'Running at massive scale profitably',
    howTheyDoIt: 'Multi-tier caching, read replicas for views, cold storage for old events, optimized RRULE computation',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Cache aggressively - reduce DB load by 90%',
    'Use read replicas for read-heavy workloads',
    'Archive old data to cheaper storage',
    'Auto-scale based on time-of-day patterns',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for a read-heavy calendar workload?',
    options: [
      'Use bigger database servers',
      'Aggressive caching + read replicas',
      'Delete old events',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Calendar views (reads) are 95% of traffic. Caching reduces DB load. Read replicas distribute remaining reads.',
  },

  keyConcepts: [
    { title: 'Read Replica', explanation: 'Database copy for read queries', icon: '📖' },
    { title: 'Cold Storage', explanation: 'Cheap storage for old data', icon: '🧊' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'googlecalendar-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $300/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $300/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: smaller cache, fewer replicas, right-sized instances. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const googlecalendarGuidedTutorial: GuidedTutorial = {
  problemId: 'googlecalendar',
  title: 'Design Google Calendar',
  description: 'Build a calendar platform with events, recurring events, sharing, and meeting invites',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📅',
    hook: "You've been hired as Lead Engineer at Productivity Systems Inc!",
    scenario: "Your mission: Build a Google Calendar-like platform that handles millions of events, recurring patterns, and meeting invitations.",
    challenge: "Can you design a system that efficiently handles recurring events with RRULE and scales to 50M users?",
  },

  requirementsPhase: googlecalendarRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Message Queues',
    'Recurring Events (RRULE)',
    'Time Zone Handling',
    'Async Processing',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default googlecalendarGuidedTutorial;
