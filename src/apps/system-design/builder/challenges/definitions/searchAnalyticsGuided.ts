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
 * Search Analytics Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching search analytics and metrics system design
 * while building a comprehensive search analytics platform.
 *
 * Flow:
 * Phase 0: Requirements gathering (metrics, click tracking, A/B testing)
 * Steps 1-3: Basic search logging
 * Steps 4-6: Click-through rate, zero-result queries, search funnel
 *
 * Key Concepts:
 * - Search event logging and clickstream tracking
 * - CTR calculation and zero-result detection
 * - Search funnel analysis and A/B testing metrics
 * - Real-time analytics and batch processing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const searchAnalyticsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search analytics system to track and analyze user search behavior",

  interviewer: {
    name: 'David Chen',
    role: 'Head of Search at E-commerce Corp',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-search-logging',
      category: 'functional',
      question: "What search events do we need to track?",
      answer: "We need to track the complete search journey:\n1. **Search queries**: What users search for, when they search, how they refine queries\n2. **Search results**: Which results were shown, in what order, with what relevance scores\n3. **Click events**: Which results users clicked, position in results, time to click\n4. **Post-click behavior**: Did they add to cart? Purchase? Bounce back?\n\nEach event needs: user_id, session_id, query_text, timestamp, results_shown, click_position, result_id.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search analytics starts with capturing the full search funnel - query → results → clicks → conversions",
    },
    {
      id: 'click-tracking',
      category: 'functional',
      question: "How do we measure search quality?",
      answer: "We use several key metrics:\n1. **Click-Through Rate (CTR)**: % of searches that result in a click\n2. **Mean Reciprocal Rank (MRR)**: Average position of first clicked result\n3. **Zero-result rate**: % of searches returning no results\n4. **Time to click**: How long users scan results before clicking\n5. **Refinement rate**: % of searches that are immediately refined\n\nThese metrics tell us if our search is finding what users want.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "CTR and zero-result rate are the primary health indicators for search quality",
    },
    {
      id: 'funnel-analysis',
      category: 'functional',
      question: "What kind of search funnel analysis do we need?",
      answer: "We need to analyze the complete search-to-purchase funnel:\n1. **Search → Results**: What % of searches return relevant results?\n2. **Results → Click**: What % of results get clicked? (CTR)\n3. **Click → Add to Cart**: What % of clicked items get added?\n4. **Cart → Purchase**: What % of search-driven carts convert?\n\nThis helps identify drop-off points. For example, if CTR is low, search relevance is poor. If click→cart is low, product pages are the issue.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Funnel analysis reveals where in the search journey users drop off",
    },

    // IMPORTANT - Clarifications
    {
      id: 'ab-testing',
      category: 'clarification',
      question: "Do we need to support A/B testing of search algorithms?",
      answer: "Yes! We frequently test new ranking algorithms. We need to:\n- Tag each search with experiment_id and variant (control/treatment)\n- Calculate metrics separately for each variant\n- Run statistical significance tests to determine winners\n- Support multi-variant tests (A/B/C/D)\n\nTypically running 5-10 experiments simultaneously.",
      importance: 'critical',
      insight: "A/B testing requires tracking experiment context with every search event",
    },
    {
      id: 'real-time-dashboards',
      category: 'clarification',
      question: "Do metrics need to be real-time or can they be batch-computed?",
      answer: "**Hybrid approach**:\n- **Real-time** (5-minute delay): CTR, zero-result rate, search volume for operational monitoring\n- **Near real-time** (15-minute delay): A/B test metrics for quick iteration\n- **Batch** (hourly/daily): Deep funnel analysis, cohort analysis, trend reports\n\nOps team needs real-time alerts if zero-result rate spikes (search broken!).",
      importance: 'important',
      insight: "Different metrics have different latency requirements based on use case",
    },
    {
      id: 'personalization-tracking',
      category: 'clarification',
      question: "Should we track personalized vs non-personalized search separately?",
      answer: "Yes! We want to measure if personalization improves CTR. Track:\n- is_personalized flag on each search\n- personalization_signals used (user history, preferences, location)\n- Compare CTR: personalized vs baseline\n\nThis proves ROI of personalization investments.",
      importance: 'important',
      insight: "Personalization effectiveness must be measured to justify the complexity",
    },
    {
      id: 'query-clustering',
      category: 'clarification',
      question: "Should we cluster similar queries for analysis?",
      answer: "Not for MVP, but plan for it! For v2:\n- Cluster synonyms ('sneakers', 'trainers', 'running shoes')\n- Group typos with correct spellings\n- Aggregate metrics across clusters\n\nFor now, analyze queries as-is. Clustering adds complexity.",
      importance: 'nice-to-have',
      insight: "Query normalization improves analytics but isn't essential for launch",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day do we need to track?",
      answer: "50 million daily active users (DAU), each doing 5 searches per day on average = 250 million searches per day",
      importance: 'critical',
      calculation: {
        formula: "250M ÷ 86,400 sec = 2,893 searches/sec average",
        result: "~3K searches/sec (9K at 3x peak)",
      },
      learningPoint: "Search volume drives analytics throughput - every search generates multiple events",
    },
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many total events if we track searches + clicks + conversions?",
      answer: "Each search generates:\n- 1 search_query event\n- 1 search_results event\n- ~0.3 click events (30% CTR average)\n- ~0.05 conversion events (5% of searches convert)\n\nTotal: 250M × 2.35 = ~590M events per day",
      importance: 'critical',
      calculation: {
        formula: "590M ÷ 86,400 sec = 6,828 events/sec average",
        result: "~7K events/sec (21K at peak)",
      },
      learningPoint: "Each search generates multiple trackable events in the funnel",
    },

    // LATENCY
    {
      id: 'latency-tracking',
      category: 'latency',
      question: "What's the acceptable latency for logging search events?",
      answer: "Event logging must be async - can't slow down search! Target:\n- Acknowledge event receipt in <50ms\n- Actual processing can be async (within 5 minutes)\n- Don't block the search response waiting for analytics logging",
      importance: 'critical',
      learningPoint: "Analytics logging must never degrade search performance",
    },
    {
      id: 'latency-dashboards',
      category: 'latency',
      question: "How fast should analytics dashboards load?",
      answer: "Interactive dashboards (CTR, zero-result rate) should load in <3 seconds p95. Deep dive reports (funnel analysis) can take up to 30 seconds for complex queries.",
      importance: 'important',
      learningPoint: "Dashboard latency impacts how quickly teams can respond to search issues",
    },

    // PAYLOAD
    {
      id: 'payload-event-size',
      category: 'payload',
      question: "What's the average search event size?",
      answer: "Search events are larger than typical analytics events:\n- search_query: ~500 bytes (query, user context, personalization signals)\n- search_results: ~5KB (top 20 results with scores, features)\n- click_event: ~300 bytes (position, result_id, timing)\n\nAverage across all events: ~2KB per event",
      importance: 'important',
      calculation: {
        formula: "590M events × 2KB = ~1.18TB per day",
        result: "~1.2TB per day of raw search analytics data",
      },
      learningPoint: "Search results events are large due to ranking features and result metadata",
    },
    {
      id: 'payload-retention',
      category: 'payload',
      question: "How long should we retain raw search logs vs aggregated metrics?",
      answer: "Two-tier retention:\n- **Raw events**: 30 days (for debugging, deep analysis)\n- **Pre-aggregated metrics**: 2 years (for trending, year-over-year)\n- **Sampled data**: Keep 1% sample forever for research\n\nThis balances storage cost with analytical needs.",
      importance: 'important',
      insight: "Tiered retention reduces storage costs while preserving key insights",
    },

    // BURSTS
    {
      id: 'burst-flash-sales',
      category: 'burst',
      question: "Do we get traffic spikes during flash sales or marketing campaigns?",
      answer: "Yes! Black Friday can be 10x normal traffic. Flash sales cause instant 5x spikes. System must handle:\n- Normal: 7K events/sec\n- Peak: 70K events/sec (Black Friday)\n- Burst: 35K events/sec (flash sale)",
      importance: 'critical',
      insight: "Auto-scaling is essential for handling e-commerce traffic patterns",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search-logging', 'click-tracking', 'funnel-analysis'],
  criticalFRQuestionIds: ['core-search-logging', 'click-tracking', 'funnel-analysis'],
  criticalScaleQuestionIds: ['throughput-searches', 'throughput-events', 'latency-tracking'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Log search events',
      description: 'Capture search queries, results shown, clicks, and conversions',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Calculate search quality metrics',
      description: 'Compute CTR, zero-result rate, MRR, and time-to-click',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Analyze search funnel',
      description: 'Track search → results → clicks → conversions funnel',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '590 million search events',
    readsPerDay: 'Dashboard queries: ~50K per day',
    peakMultiplier: 3,
    readWriteRatio: '100:1 (write-heavy)',
    calculatedWriteRPS: { average: 6828, peak: 20484 },
    calculatedReadRPS: { average: 578, peak: 1734 },
    maxPayloadSize: '~5KB (search_results event)',
    storagePerRecord: '~2KB average',
    storageGrowthPerYear: '~430TB per year (with 30-day retention)',
    redirectLatencySLA: 'p99 < 50ms (async event logging)',
    createLatencySLA: 'p95 < 3s (dashboard queries)',
  },

  architecturalImplications: [
    '✅ Write-heavy (21K events/sec peak) → Need fast async event ingestion',
    '✅ 1.2TB/day → Efficient storage and aggressive data retention policy',
    '✅ p99 < 50ms logging → Async processing, fire-and-forget from search service',
    '✅ A/B testing → Tag events with experiment context, compute metrics per variant',
    '✅ Real-time CTR → Stream processing for 5-minute aggregations',
    '✅ Search results are 5KB → Compression and columnar storage beneficial',
  ],

  outOfScope: [
    'Query spell correction (that\'s search engine\'s job)',
    'Product recommendation engine',
    'Search relevance tuning (focus is analytics, not ranking)',
    'User segmentation and cohort analysis (v2 feature)',
    'Multi-language query analysis',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple pipeline where searches are logged, clicks are tracked, and basic CTR is calculated. Advanced funnel analysis, A/B testing, and real-time dashboards will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server for Search Logging
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to E-commerce Corp! You've been hired to build a search analytics system.",
  hook: "Users are searching for products, but we have no idea what they're searching for or if they find what they need!",
  challenge: "Set up the basic connection so search events can be logged to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search analytics pipeline is online!',
  achievement: 'Search events can now be sent to your server for logging',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting search events', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process search logs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building Search Analytics: Event Collection',
  conceptExplanation: `Every search analytics system starts with **capturing search events**.

When a user searches:
1. Search service executes the query
2. While returning results to user, it also logs the search event
3. Analytics service receives and stores the event

For example:
- User searches "red running shoes" → Search service logs query + results shown
- User clicks result #3 → Search service logs click event with position
- User adds to cart → Search service logs conversion event

This creates a complete picture of search behavior.`,

  whyItMatters: 'Without event collection, you have no visibility into search quality or user behavior.',

  keyPoints: [
    'Client represents your search service sending analytics events',
    'Each search generates multiple events: query, results, clicks',
    'Events must be logged asynchronously to not slow down search',
  ],

  keyConcepts: [
    { title: 'Search Event', explanation: 'A record of query, results, or click', icon: '📝' },
    { title: 'Async Logging', explanation: 'Log events without blocking search response', icon: '⚡' },
    { title: 'Clickstream', explanation: 'Sequence of search and click events', icon: '🖱️' },
  ],
};

const step1: GuidedStep = {
  id: 'search-analytics-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for search analytics',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents search service sending events', displayName: 'Search Service' },
      { type: 'app_server', reason: 'Handles analytics event logging', displayName: 'Analytics Server' },
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
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Search Event Logging (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your analytics server is connected, but it doesn't know how to log search events!",
  hook: "A search for 'wireless headphones' was executed, but nothing was logged. No data, no insights!",
  challenge: "Write the Python code to implement search event logging.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can now log search events!',
  achievement: 'You implemented search analytics event logging',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can log searches', after: '✓' },
    { label: 'Can log clicks', after: '✓' },
  ],
  nextTeaser: "But what happens when the server restarts? All data is lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Search Event Schema: What to Log',
  conceptExplanation: `The key to good search analytics is logging the right data.

**Search Query Event:**
\`\`\`json
{
  "event_type": "search_query",
  "query_id": "q_abc123",
  "user_id": "user_456",
  "session_id": "sess_789",
  "query_text": "wireless headphones",
  "timestamp": "2025-01-15T10:30:00Z",
  "num_results": 127,
  "personalized": true
}
\`\`\`

**Click Event:**
\`\`\`json
{
  "event_type": "search_click",
  "query_id": "q_abc123",
  "result_id": "prod_999",
  "click_position": 3,
  "time_to_click_ms": 2500
}
\`\`\`

With this data, you can calculate:
- CTR = (queries with clicks) / (total queries)
- Zero-result rate = (queries with 0 results) / (total queries)
- MRR = average of (1 / click_position)`,

  whyItMatters: 'The event schema determines what metrics you can compute. Design it carefully!',

  famousIncident: {
    title: 'Google Search Quality Crisis',
    company: 'Google',
    year: '2011',
    whatHappened: 'A competitor copied Google\'s search results. Google knew because they had detailed click tracking and saw suspicious patterns - searches with no results on Google but immediate clicks on competitor. Without analytics, they couldn\'t have detected or proven the copying.',
    lessonLearned: 'Search analytics aren\'t just for optimization - they\'re critical for detecting abuse and competitive threats.',
    icon: '🔍',
  },

  keyPoints: [
    'Log query_id to join search and click events',
    'Track num_results to detect zero-result queries',
    'Record click_position for CTR and MRR calculation',
    'Include timestamp for time-based analysis',
  ],

  quickCheck: {
    question: 'Why do we need to log click_position?',
    options: [
      'To know which color the user clicked',
      'To calculate if users click top results or scroll deep (measures relevance)',
      'To store the GPS position',
      'To track mouse cursor position',
    ],
    correctIndex: 1,
    explanation: 'Click position tells us search quality. If users always click result #1, search is great. If they click #10, relevance is poor.',
  },

  keyConcepts: [
    { title: 'query_id', explanation: 'Unique identifier to join search and click events', icon: '🔑' },
    { title: 'CTR', explanation: 'Click-through rate = % of searches that get clicked', icon: '📊' },
    { title: 'MRR', explanation: 'Mean Reciprocal Rank = average of 1/position', icon: '📈' },
  ],
};

const step2: GuidedStep = {
  id: 'search-analytics-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Log search events (basic implementation)',
    taskDescription: 'Configure APIs and implement Python handlers for search logging',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/search/log API',
      'Open the Python tab',
      'Implement log_search_event() function to handle search and click events',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign the endpoint',
    level2: 'After assigning API, switch to Python tab. Implement log_search_event() to store events in a list and calculate basic stats',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/search/log'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Event Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your in-memory event log is working, but what about historical analysis?",
  hook: "When the server restarts, all search analytics data is lost! Product team can't analyze last week's search trends.",
  challenge: "Add a database to store search events persistently.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Search analytics data is now persistent!',
  achievement: 'Event data survives server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Search events stored', after: '590M per day' },
  ],
  nextTeaser: "But how do we actually calculate CTR from all these events?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistent Storage for Search Analytics',
  conceptExplanation: `In-memory storage loses data on restart. A **database** provides durability.

For search analytics, we store:
\`\`\`sql
search_events table:
  event_id | query_id | user_id | event_type | timestamp | ...
  ---------|----------|---------|------------|-----------|----
  evt_1    | q_abc    | user_1  | search     | 10:30:00  | ...
  evt_2    | q_abc    | user_1  | click      | 10:30:03  | ...
  evt_3    | q_def    | user_2  | search     | 10:31:00  | ...
\`\`\`

With persistent storage, you can:
- Analyze historical trends (CTR over time)
- Debug specific problematic queries
- Run batch jobs to compute funnel metrics
- Retain data for compliance and auditing`,

  whyItMatters: 'Without persistence, search analytics is useless. Historical analysis is the whole point!',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Analyzing billions of product searches',
    howTheyDoIt: 'Uses distributed databases and data lakes to store search events. Runs batch jobs daily to compute aggregate metrics. Real-time metrics use stream processing.',
  },

  keyPoints: [
    'Database stores all search and click events',
    'Write-heavy workload: optimize for fast inserts',
    'Add indexes on query_id, user_id, timestamp for analytics queries',
    'Consider partitioning by date for efficient retention management',
  ],

  quickCheck: {
    question: 'Why is the database write-heavy for search analytics?',
    options: [
      'Users rarely search',
      'Every search and click generates events - 21K events/sec at peak',
      'We delete more than we write',
      'Databases are always write-heavy',
    ],
    correctIndex: 1,
    explanation: 'Search analytics logs every query and click. At 21K events/sec peak, this is extremely write-heavy.',
  },

  keyConcepts: [
    { title: 'Write-Heavy', explanation: 'Many inserts (log events), fewer reads (analytics)', icon: '✍️' },
    { title: 'Partitioning', explanation: 'Split table by date for faster queries', icon: '📅' },
    { title: 'Retention', explanation: 'Delete old data to manage storage costs', icon: '🗑️' },
  ],
};

const step3: GuidedStep = {
  id: 'search-analytics-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Log search events (now with persistence)',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store search events persistently', displayName: 'PostgreSQL' },
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
// STEP 4: Calculate Click-Through Rate (CTR)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📊',
  scenario: "The product team wants to know: 'How good is our search? Are users finding what they need?'",
  hook: "We have millions of search events logged, but no way to measure search quality!",
  challenge: "Implement CTR calculation to measure search effectiveness.",
  illustration: 'analytics-dashboard',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'You can now measure search quality!',
  achievement: 'CTR metric reveals if users find relevant results',
  metrics: [
    { label: 'Metric implemented', after: 'CTR' },
    { label: 'Search quality visibility', after: 'Enabled' },
    { label: 'Can track trends', after: '✓' },
  ],
  nextTeaser: "But what about searches that return zero results?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Click-Through Rate: The Search Quality Metric',
  conceptExplanation: `**Click-Through Rate (CTR)** is the percentage of searches that result in at least one click.

**Calculation:**
\`\`\`
CTR = (searches with ≥1 click) / (total searches)
\`\`\`

**Example:**
- 1000 searches executed
- 350 had at least one click
- CTR = 350 / 1000 = 35%

**Why CTR matters:**
- **High CTR (>40%)**: Users find relevant results quickly
- **Medium CTR (20-40%)**: Search is acceptable but needs improvement
- **Low CTR (<20%)**: Search relevance is poor, users can't find what they need

**Analyzing CTR:**
- Track CTR over time to spot degradation
- Break down by category (electronics: 45%, clothing: 30%)
- Compare personalized vs non-personalized search
- A/B test ranking algorithm changes`,

  whyItMatters: 'CTR is the primary indicator of search quality. Low CTR means users aren\'t finding what they search for.',

  famousIncident: {
    title: 'Bing CTR Drop Detection',
    company: 'Microsoft Bing',
    year: '2018',
    whatHappened: 'A bug in Bing\'s ranking algorithm caused CTR to drop from 35% to 18% overnight. The analytics system detected it within 30 minutes and automatically rolled back the change. Without CTR monitoring, they would have lost millions in revenue.',
    lessonLearned: 'Real-time CTR monitoring can catch search bugs before they cause major damage.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Optimizing product search',
    howTheyDoIt: 'Tracks CTR for every search category. Runs constant A/B tests to improve ranking. Target: >45% CTR for core categories.',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│              CTR CALCULATION                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  1000 searches:                                    │
│  ┌─────────────────────────────────────┐          │
│  │ search_1 → click (✓)                │          │
│  │ search_2 → no click                 │          │
│  │ search_3 → click (✓)                │          │
│  │ search_4 → click (✓)                │          │
│  │ search_5 → no click                 │          │
│  │ ... 995 more searches ...           │          │
│  └─────────────────────────────────────┘          │
│                                                    │
│  350 searches had clicks                           │
│  CTR = 350 / 1000 = 35%                            │
│                                                    │
│  SQL:                                              │
│  SELECT                                            │
│    COUNT(DISTINCT CASE WHEN event_type='click'    │
│           THEN query_id END) / COUNT(DISTINCT     │
│           CASE WHEN event_type='search'           │
│           THEN query_id END) as ctr               │
│  FROM search_events                                │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'CTR measures % of searches that get clicked',
    'Join search and click events by query_id',
    'Track CTR over time to detect issues',
    'Break down CTR by dimensions (category, device, etc.)',
  ],

  quickCheck: {
    question: 'If 1000 searches result in 250 clicks across 200 searches, what\'s the CTR?',
    options: [
      '25% (clicks / searches)',
      '20% (searches with clicks / total searches)',
      '12.5% (half of 25%)',
      '50% (random guess)',
    ],
    correctIndex: 1,
    explanation: 'CTR = searches with clicks / total searches = 200 / 1000 = 20%. Note: some searches had multiple clicks, but we count them once.',
  },

  keyConcepts: [
    { title: 'CTR', explanation: '% of searches resulting in a click', icon: '📊' },
    { title: 'query_id', explanation: 'Join key to match searches with clicks', icon: '🔗' },
    { title: 'Trend Analysis', explanation: 'Track CTR over time', icon: '📈' },
  ],
};

const step4: GuidedStep = {
  id: 'search-analytics-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Calculate CTR metric',
    taskDescription: 'Update your Python code to calculate CTR from search events',
    successCriteria: [
      'Click on App Server',
      'Open the Python tab',
      'Implement calculate_ctr() function',
      'Add GET /api/v1/analytics/ctr endpoint',
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
    level1: 'Open the Python editor and implement calculate_ctr()',
    level2: 'Query the database to count total searches and searches with clicks. CTR = searches_with_clicks / total_searches',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Detect and Track Zero-Result Queries
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are complaining: 'I searched for a product but got no results, even though you sell it!'",
  hook: "Zero-result queries frustrate users and lose sales. We need to track them!",
  challenge: "Implement zero-result detection and tracking to identify gaps in product catalog and search relevance.",
  illustration: 'search-no-results',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'You can now track zero-result queries!',
  achievement: 'Identify search gaps and improve product coverage',
  metrics: [
    { label: 'Zero-result tracking', after: 'Enabled' },
    { label: 'Can identify gaps', after: '✓' },
    { label: 'Metric: Zero-result rate', after: 'Calculated' },
  ],
  nextTeaser: "Now let's analyze the complete search funnel...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Zero-Result Queries: Finding the Gaps',
  conceptExplanation: `**Zero-result queries** are searches that return no results - a critical metric for search quality.

**Why zero results happen:**
1. Product not in catalog ("iPhone 16" before launch)
2. Search too specific ("red nike air max size 10.5 mens")
3. Typo or misspelling ("wirless headphones")
4. Wrong category ("iPhone case" in Books section)

**Zero-result rate calculation:**
\`\`\`
Zero-result rate = (searches with 0 results) / (total searches)
\`\`\`

**What to do with zero-result queries:**
- **Product gaps**: If many users search "iPhone 16", consider stocking it
- **Search tuning**: Expand query to broader terms or fix spell checker
- **Category issues**: Suggest category switching
- **Trending interests**: Shows what users want that you don't have

**Target**: Keep zero-result rate <5% for good UX`,

  whyItMatters: 'Every zero-result search is a potential lost sale. Tracking them reveals gaps in your catalog and search quality.',

  famousIncident: {
    title: 'Best Buy Product Gap Discovery',
    company: 'Best Buy',
    year: '2016',
    whatHappened: 'Analytics team noticed 50,000 searches/month for "USB-C cables" with zero results. They weren\'t stocking them yet! Added USB-C products, captured $2M in annual revenue that was going to Amazon.',
    lessonLearned: 'Zero-result queries reveal customer demand for products you don\'t carry.',
    icon: '💡',
  },

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Tracking zero-result searches',
    howTheyDoIt: 'Analyzes zero-result queries daily. Shows top zero-result searches to sellers as product opportunities. Improved seller coverage and reduced zero-result rate from 15% to 8%.',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│         ZERO-RESULT QUERY TRACKING                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  1000 searches:                                    │
│  ┌─────────────────────────────────────┐          │
│  │ "headphones" → 127 results          │          │
│  │ "wirless mice" → 0 results ⚠️       │          │
│  │ "laptop bag" → 45 results           │          │
│  │ "iPhone 16" → 0 results ⚠️          │          │
│  │ "USB cable" → 89 results            │          │
│  └─────────────────────────────────────┘          │
│                                                    │
│  40 searches returned 0 results                    │
│  Zero-result rate = 40 / 1000 = 4%                 │
│                                                    │
│  Top zero-result queries:                          │
│  1. "iPhone 16" (120 searches) → Product gap      │
│  2. "wirless mice" (80 searches) → Typo           │
│  3. "vintage typewriter" (40 searches) → Gap      │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Track num_results in search events',
    'Zero-result rate = queries with 0 results / total queries',
    'Analyze top zero-result queries for product gaps',
    'Alert if zero-result rate spikes (search broken!)',
  ],

  quickCheck: {
    question: 'A zero-result query "wirless headphones" suggests what action?',
    options: [
      'Remove wireless headphones from catalog',
      'Improve spell checker to match "wireless"',
      'Ignore it - typos happen',
      'Ban users who make typos',
    ],
    correctIndex: 1,
    explanation: 'This is clearly a typo. Good spell correction would catch "wirless" → "wireless" and show results.',
  },

  keyConcepts: [
    { title: 'Zero-Result', explanation: 'Search returning no results', icon: '🚫' },
    { title: 'Product Gap', explanation: 'Users want products you don\'t carry', icon: '🕳️' },
    { title: 'Spell Correction', explanation: 'Fix typos to reduce zero-results', icon: '✏️' },
  ],
};

const step5: GuidedStep = {
  id: 'search-analytics-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Calculate zero-result rate',
    taskDescription: 'Update Python code to track and calculate zero-result queries',
    successCriteria: [
      'Click on App Server',
      'Open the Python tab',
      'Implement calculate_zero_result_rate() function',
      'Add GET /api/v1/analytics/zero-results endpoint',
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
    level1: 'Track num_results in search events, then count searches where num_results = 0',
    level2: 'Query database for searches with num_results = 0. Zero-result rate = zero_result_searches / total_searches',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Build Search Funnel Analysis
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "The CEO asks: 'What % of searches lead to purchases? Where do users drop off?'",
  hook: "We can track searches and clicks, but we can't see the complete search-to-purchase journey!",
  challenge: "Implement search funnel analysis to track the complete journey from search to conversion.",
  illustration: 'funnel-analysis',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'Search funnel analysis complete!',
  achievement: 'You can now track the complete search-to-purchase journey',
  metrics: [
    { label: 'Funnel stages tracked', after: '4 stages' },
    { label: 'Conversion visibility', after: 'Full journey' },
    { label: 'Drop-off analysis', after: 'Enabled' },
  ],
  nextTeaser: "Your search analytics system is now production-ready!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Search Funnel: From Query to Purchase',
  conceptExplanation: `The **search funnel** tracks user progression from search to conversion.

**Funnel stages:**
1. **Search**: User executes query
2. **Results**: System shows products
3. **Click**: User clicks a result
4. **Add to Cart**: User adds clicked product
5. **Purchase**: User completes checkout

**Example funnel:**
\`\`\`
1000 searches
 ↓ 35% CTR
350 clicks
 ↓ 40% add-to-cart rate
140 add-to-cart
 ↓ 50% checkout rate
70 purchases

Overall search-to-purchase rate: 7%
\`\`\`

**Funnel insights:**
- Low CTR (35%) → Search relevance needs work
- Low add-to-cart (40%) → Product pages need improvement
- Low checkout (50%) → Checkout flow has friction

Each stage reveals where to optimize!`,

  whyItMatters: 'Funnel analysis reveals exactly where users drop off, guiding optimization efforts.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Optimizing search-to-purchase funnel',
    howTheyDoIt: 'Tracks full funnel for every search. A/B tests each stage independently. Improved search relevance (CTR), product page quality, and checkout flow. Search-driven purchases increased 40%.',
  },

  famousIncident: {
    title: 'Walmart Search Funnel Optimization',
    company: 'Walmart',
    year: '2019',
    whatHappened: 'Funnel analysis showed high CTR but low add-to-cart. Problem: clicked products were often out of stock. Fixed by prioritizing in-stock items in search results. Add-to-cart rate jumped from 30% to 55%.',
    lessonLearned: 'Funnel analysis pinpoints exact problems. Don\'t just optimize one metric (CTR) - optimize the whole journey.',
    icon: '🛒',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│            SEARCH FUNNEL ANALYSIS                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  1000 Searches                                     │
│    ↓ 35% (CTR)                                     │
│  350 Clicks                                        │
│    ↓ 40% (add-to-cart rate)                        │
│  140 Add-to-Cart                                   │
│    ↓ 50% (checkout rate)                           │
│  70 Purchases                                      │
│                                                    │
│  Overall conversion: 7%                            │
│                                                    │
│  Optimization opportunities:                       │
│  • Increase CTR: Improve search relevance          │
│  • Increase add-to-cart: Better product pages      │
│  • Increase checkout: Reduce cart abandonment      │
│                                                    │
│  SQL:                                              │
│  WITH funnel AS (                                  │
│    SELECT                                          │
│      COUNT(*) FILTER (WHERE type='search') searches│
│      COUNT(*) FILTER (WHERE type='click') clicks,  │
│      COUNT(*) FILTER (WHERE type='cart') carts,    │
│      COUNT(*) FILTER (WHERE type='purchase')       │
│        purchases                                   │
│    FROM search_events                              │
│  )                                                 │
│  SELECT * FROM funnel                              │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Track events across entire journey: search → click → cart → purchase',
    'Calculate conversion rate at each stage',
    'Identify biggest drop-off point for optimization',
    'A/B test improvements stage by stage',
  ],

  quickCheck: {
    question: 'If CTR is 40% but search-to-purchase is only 3%, where should you focus optimization?',
    options: [
      'Search relevance (CTR is already good)',
      'Post-click funnel (click → cart → purchase) has bigger drop-off',
      'Don\'t optimize anything, 3% is great',
      'Increase prices',
    ],
    correctIndex: 1,
    explanation: 'CTR of 40% is healthy. The problem is after the click - users aren\'t converting. Focus on product pages and checkout.',
  },

  keyConcepts: [
    { title: 'Funnel', explanation: 'Multi-stage journey with drop-off at each stage', icon: '🔻' },
    { title: 'Conversion Rate', explanation: '% progressing to next stage', icon: '📊' },
    { title: 'Drop-off Analysis', explanation: 'Finding where users abandon', icon: '🕵️' },
  ],
};

const step6: GuidedStep = {
  id: 'search-analytics-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Analyze search funnel',
    taskDescription: 'Implement search funnel analysis from query to purchase',
    successCriteria: [
      'Click on App Server',
      'Open the Python tab',
      'Implement calculate_search_funnel() function',
      'Add GET /api/v1/analytics/funnel endpoint',
      'Return funnel metrics: searches, clicks, carts, purchases, conversion rates',
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
    level1: 'Query database to count events at each funnel stage',
    level2: 'Count search, click, cart, purchase events. Calculate conversion rates: clicks/searches, carts/clicks, purchases/carts',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const searchAnalyticsGuidedTutorial: GuidedTutorial = {
  problemId: 'search-analytics-guided',
  problemTitle: 'Build Search Analytics - A System Design Journey',

  requirementsPhase: searchAnalyticsRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Search Logging',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System logs search queries, results, and clicks.',
      traffic: { type: 'write', rps: 1000, writeRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'CTR Calculation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System correctly calculates click-through rate.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 3000, maxErrorRate: 0.01 },
    },
    {
      name: 'Zero-Result Detection',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System tracks and reports zero-result queries.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 3000, maxErrorRate: 0.01 },
    },
    {
      name: 'Search Funnel Analysis',
      type: 'functional',
      requirement: 'FR-3',
      description: 'System tracks complete search-to-purchase funnel.',
      traffic: { type: 'read', rps: 50, readRps: 50 },
      duration: 30,
      passCriteria: { maxP99Latency: 5000, maxErrorRate: 0.01 },
    },
    {
      name: 'High Throughput Logging',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 20K events/sec logging with low latency.',
      traffic: { type: 'write', rps: 20000, writeRps: 20000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.02 },
    },
    {
      name: 'Peak Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle peak traffic of 70K events/sec during flash sales.',
      traffic: { type: 'write', rps: 70000, writeRps: 70000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'Analytics Query Performance',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Dashboard queries return in <3 seconds.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP95Latency: 3000, maxErrorRate: 0.02 },
    },
  ] as TestCase[],
};

export default searchAnalyticsGuidedTutorial;
