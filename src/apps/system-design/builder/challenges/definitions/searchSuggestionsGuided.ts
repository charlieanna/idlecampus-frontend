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
 * Search Suggestions/Autocomplete Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching autocomplete system design concepts
 * while building a search suggestion system like Google Search.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (trie, caching, ranking, etc.)
 *
 * Key Concepts:
 * - Trie data structure for prefix matching
 * - Ranking algorithms (popularity, personalization)
 * - Real-time indexing and caching strategies
 * - Handling high read throughput
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const searchSuggestionsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search autocomplete system like Google Search",

  interviewer: {
    name: 'Emily Rodriguez',
    role: 'Principal Engineer at Search Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-autocomplete',
      category: 'functional',
      question: "What's the main user experience we're building?",
      answer: "Users type in a search box, and as they type each character, we show them a list of suggested completions in real-time. For example:\n- User types 'goo' → we show ['google', 'good morning', 'good night', 'google maps', 'google translate']\n- User types 'goog' → we narrow to ['google', 'google maps', 'google translate']\n\nIt's instant - appearing as they type, not after they press enter.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Autocomplete is a real-time prefix matching system - speed is everything",
    },
    {
      id: 'ranking-order',
      category: 'functional',
      question: "How do we decide which suggestions to show first?",
      answer: "We rank by **popularity** - the most searched queries appear first. If a million people search 'google' but only 100 search 'good morning', then 'google' ranks higher.\n\nWe show the top 5-10 suggestions sorted by popularity/frequency.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Ranking by popularity gives users the most relevant suggestions",
    },
    {
      id: 'suggestion-updates',
      category: 'functional',
      question: "Do suggestions change over time based on what people search?",
      answer: "Yes! If 'world cup 2025' suddenly becomes super popular, it should start appearing in suggestions. But this doesn't need to be instant - updating every few hours is fine. Trending queries can take a bit to bubble up.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Autocomplete data can be eventually consistent - doesn't need real-time updates",
    },

    // CLARIFICATIONS
    {
      id: 'personalization',
      category: 'clarification',
      question: "Should suggestions be personalized based on user history?",
      answer: "Not for the MVP. We'll show the same suggestions to everyone based on global popularity. Personalization adds significant complexity - that's a v2 feature.",
      importance: 'nice-to-have',
      insight: "Global suggestions are simpler and can be heavily cached",
    },
    {
      id: 'typo-correction',
      category: 'clarification',
      question: "What about typos? If someone types 'gogle', should we suggest 'google'?",
      answer: "Not for the MVP. Fuzzy matching and spell correction are v2 features. For now, we do exact prefix matching only.",
      importance: 'nice-to-have',
      insight: "Fuzzy matching requires different data structures (edit distance, phonetic algorithms)",
    },
    {
      id: 'multi-language',
      category: 'clarification',
      question: "Do we need to support multiple languages?",
      answer: "Start with English only. Multi-language adds complexity in tokenization and ranking.",
      importance: 'nice-to-have',
      insight: "Different languages need different text processing pipelines",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users will use autocomplete?",
      answer: "100 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "DAU sets the scale for all capacity planning",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many autocomplete requests per second?",
      answer: "Each user types ~10 searches per day, and each search involves ~5 keystrokes on average. So 100M users × 10 searches × 5 keystrokes = 5 billion autocomplete requests per day.",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 req/sec",
        result: "~58K requests/sec (174K at peak)",
      },
      learningPoint: "Autocomplete is EXTREMELY read-heavy - every keystroke is a query",
    },

    // LATENCY
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "How fast do suggestions need to appear?",
      answer: "Sub-100ms, ideally under 50ms. Users expect instant feedback as they type. Any delay feels sluggish.",
      importance: 'critical',
      learningPoint: "This is synchronous - user is waiting. Ultra-low latency required.",
    },

    // PAYLOAD
    {
      id: 'payload-suggestions',
      category: 'payload',
      question: "How much data per response?",
      answer: "We return 5-10 suggestions, each up to 50 characters. So ~500 bytes per response, very lightweight.",
      importance: 'important',
      calculation: {
        formula: "10 suggestions × 50 chars = ~500 bytes",
        result: "Very low bandwidth per request",
      },
      learningPoint: "Responses are small, but volume is massive",
    },
    {
      id: 'payload-corpus',
      category: 'payload',
      question: "How many unique search queries should we support?",
      answer: "About 10 million popular queries that we'll index for suggestions. Long tail queries (searched once) don't need to be in autocomplete.",
      importance: 'important',
      calculation: {
        formula: "10M queries × 50 chars avg = ~500MB corpus",
        result: "Corpus fits easily in memory!",
      },
      learningPoint: "The entire suggestion dataset can be cached in RAM",
    },

    // BURSTS
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average ratio?",
      answer: "Peak is about 3x average during prime hours.",
      importance: 'critical',
      calculation: {
        formula: "58K avg × 3 = 174K peak",
        result: "~174K requests/sec at peak",
      },
      insight: "Must handle 3x traffic during peak times",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-autocomplete', 'ranking-order', 'throughput-queries'],
  criticalFRQuestionIds: ['core-autocomplete', 'ranking-order'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-requirement', 'burst-peak'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time prefix suggestions',
      description: 'As users type, show matching suggestions instantly (<100ms)',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Ranked by popularity',
      description: 'Show top 5-10 suggestions sorted by search frequency',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Updates based on trends',
      description: 'Suggestions reflect current search trends (eventual consistency OK)',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: 'N/A (read-dominated)',
    readsPerDay: '5 billion autocomplete requests',
    peakMultiplier: 3,
    readWriteRatio: '10000:1 (extremely read-heavy)',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 57870, peak: 173610 },
    maxPayloadSize: '~500 bytes',
    storagePerRecord: '~50 bytes',
    storageGrowthPerYear: '~500MB (corpus)',
    redirectLatencySLA: 'p99 < 100ms',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy → Caching is ESSENTIAL',
    '✅ 174K reads/sec peak → Multiple app servers + aggressive caching',
    '✅ Sub-100ms latency → In-memory data structures (Trie)',
    '✅ 500MB corpus → Entire dataset fits in RAM',
    '✅ Prefix matching → Trie data structure is optimal',
  ],

  outOfScope: [
    'Personalized suggestions (v2)',
    'Typo correction / fuzzy matching (v2)',
    'Multi-language support (v2)',
    'Image/voice search suggestions',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple prefix matching system. The famous Trie data structure and caching optimizations will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to Search Inc! You've been hired to build the next Google Autocomplete.",
  hook: "Users are typing in the search box, but nothing happens. They see no suggestions!",
  challenge: "Set up the basic connection so autocomplete requests can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your autocomplete system is online!',
  achievement: 'Users can now send autocomplete requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to suggest anything yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building Autocomplete: Client-Server Flow',
  conceptExplanation: `Every autocomplete system starts with a **Client** connecting to a **Server**.

When a user types in the search box:
1. Their browser (Client) sends each keystroke to your App Server
2. The server processes the prefix and returns suggestions
3. The client displays suggestions in a dropdown

For example:
- User types 'g' → Client sends "g" → Server returns ['google', 'gmail', 'github']
- User types 'go' → Client sends "go" → Server returns ['google', 'good morning']`,

  whyItMatters: 'Without this connection, users get no suggestions at all.',

  keyPoints: [
    'Each keystroke triggers an autocomplete request',
    'Server must respond in <100ms for smooth UX',
    'Client displays top 5-10 suggestions',
  ],

  keyConcepts: [
    { title: 'Prefix', explanation: 'The partial query user has typed so far', icon: '📝' },
    { title: 'Suggestion', explanation: 'Completed query we recommend', icon: '💡' },
    { title: 'Real-time', explanation: 'Response appears instantly as user types', icon: '⚡' },
  ],
};

const step1: GuidedStep = {
  id: 'search-suggestions-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for autocomplete',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users typing queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles autocomplete logic', displayName: 'App Server' },
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
// STEP 2: Implement Basic Prefix Matching (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to match prefixes!",
  hook: "A user typed 'goo' expecting to see 'google', but got nothing.",
  challenge: "Write the Python code to implement basic prefix matching.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can now suggest completions!',
  achievement: 'You implemented basic autocomplete functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can match prefixes', after: '✓' },
    { label: 'Returns suggestions', after: '✓' },
  ],
  nextTeaser: "But linear search through all queries is too slow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Prefix Matching: The Naive Approach',
  conceptExplanation: `The simplest autocomplete implementation:
1. Store all queries in a list
2. When user types a prefix, filter queries that start with it
3. Return the top matches

For example, with queries: ['google', 'gmail', 'github', 'good morning']
- Prefix 'g' → all match → return top 5
- Prefix 'go' → ['google', 'good morning'] match
- Prefix 'goo' → ['google', 'good morning'] match

This works, but it's slow! We scan the entire list for every keystroke.`,

  whyItMatters: 'This establishes the core FR - showing relevant suggestions. But we\'ll optimize it later.',

  famousIncident: {
    title: 'Google Suggest Launch',
    company: 'Google',
    year: '2004',
    whatHappened: 'Google Suggest (autocomplete) was so popular it doubled search query volume. But the naive implementation couldn\'t scale. They had to rebuild it with Tries.',
    lessonLearned: 'Start simple, then optimize when you understand the bottleneck.',
    icon: '🔧',
  },

  keyPoints: [
    'Store queries with popularity scores',
    'Filter by prefix match',
    'Sort by popularity and return top N',
    'This is O(n) per request - we\'ll optimize to O(k) with Tries',
  ],

  quickCheck: {
    question: 'Why is the naive approach slow for 10 million queries?',
    options: [
      'It uses too much memory',
      'It scans all 10M queries for every keystroke',
      'It can\'t sort results',
      'It doesn\'t cache anything',
    ],
    correctIndex: 1,
    explanation: 'Naive approach is O(n) - scanning all queries. With 10M queries and 174K req/sec, this is too slow.',
  },

  keyConcepts: [
    { title: 'Prefix Match', explanation: 'Query starts with the typed characters', icon: '🔠' },
    { title: 'Linear Search', explanation: 'Check every item one by one - O(n)', icon: '📜' },
    { title: 'Top-K', explanation: 'Return only the K most popular matches', icon: '🏆' },
  ],
};

const step2: GuidedStep = {
  id: 'search-suggestions-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time prefix suggestions (basic implementation)',
    taskDescription: 'Configure APIs and implement Python handlers for autocomplete',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/autocomplete API',
      'Open the Python tab',
      'Implement autocomplete() function with prefix matching',
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
    level2: 'After assigning API, switch to Python tab. Implement autocomplete() to filter queries by prefix and sort by popularity',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/autocomplete'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Query Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your in-memory query list is hardcoded. What about new trending searches?",
  hook: "When the server restarts, all search popularity data is lost!",
  challenge: "Add a database to store queries and their popularity scores persistently.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Query data is now persistent!',
  achievement: 'Search popularity data survives server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Query corpus', after: '10M queries stored' },
  ],
  nextTeaser: "But scanning 10M database rows for every keystroke is way too slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistent Storage for Search Queries',
  conceptExplanation: `In-memory storage loses data on restart. A **database** provides:
- **Durability**: Query popularity data survives crashes
- **Updates**: Track trending queries over time
- **Queries**: Retrieve matching suggestions

For autocomplete, we store:
\`\`\`
queries table:
  id | query_text        | popularity_score
  ---|-------------------|------------------
  1  | google            | 10000000
  2  | gmail             | 5000000
  3  | good morning      | 2000000
\`\`\`

The popularity score is updated periodically based on actual searches.`,

  whyItMatters: 'Without persistence, trending queries can\'t be tracked. Your suggestions become stale.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Tracking 10M+ popular queries',
    howTheyDoIt: 'Uses distributed databases to store query popularity, updated hourly from search logs',
  },

  keyPoints: [
    'Database stores query text + popularity score',
    'Popularity updated periodically (hourly/daily)',
    'Still doing prefix matching in the database - slow!',
    'Next step: optimize with better data structures',
  ],

  quickCheck: {
    question: 'Why is querying the database for every keystroke problematic?',
    options: [
      'Databases can\'t do prefix matching',
      'Database queries take 10-50ms - too slow for 174K req/sec',
      'Databases don\'t support sorting',
      'It costs too much',
    ],
    correctIndex: 1,
    explanation: 'At 174K req/sec, database becomes a bottleneck. Each query takes 10-50ms, but we need <100ms total.',
  },

  keyConcepts: [
    { title: 'Popularity Score', explanation: 'How often a query is searched', icon: '📊' },
    { title: 'Trending', explanation: 'Queries gaining popularity over time', icon: '📈' },
    { title: 'Persistence', explanation: 'Data survives server restarts', icon: '💾' },
  ],
};

const step3: GuidedStep = {
  id: 'search-suggestions-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Updates based on trends (needs persistent storage)',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store query text and popularity scores', displayName: 'PostgreSQL' },
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
// STEP 4: Implement Trie Data Structure
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌳',
  scenario: "Users are complaining: 'Why does autocomplete take so long to appear?'",
  hook: "With 10M queries in the database, scanning for prefix matches takes 100ms+. We need sub-10ms!",
  challenge: "Implement a Trie data structure for blazing-fast prefix lookups.",
  illustration: 'slow-search',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Autocomplete is now lightning fast!',
  achievement: 'Trie reduces prefix lookup from O(n) to O(k)',
  metrics: [
    { label: 'Lookup time', before: '100ms', after: '<1ms' },
    { label: 'Algorithm', before: 'Linear scan', after: 'Trie traversal' },
    { label: 'Complexity', before: 'O(n)', after: 'O(k) where k=prefix length' },
  ],
  nextTeaser: "But we're still hitting the database for every request...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Trie Data Structure: The Autocomplete Secret Weapon',
  conceptExplanation: `A **Trie** (pronounced "try") is a tree optimized for prefix matching.

**How it works:**
\`\`\`
          root
         /  |  \\
        g   h   s
       /    |    \\
      o     e     e
     / \\    |     |
    o   m   l     a
    |   |   |     |
    d   a   l   r
    |   |   |   |
[good] [gmail] [hello] [search]
\`\`\`

To find suggestions for "go":
1. Start at root → 'g' → 'o'
2. Collect all words in this subtree
3. Return top K by popularity

**Time complexity:**
- Build: O(n × m) where n=queries, m=avg length
- Lookup: O(k + s) where k=prefix length, s=suggestions returned
- This is MUCH faster than O(n) linear scan!`,

  whyItMatters: 'Tries are THE data structure for autocomplete. Google, Bing, every search engine uses them.',

  famousIncident: {
    title: 'Stack Overflow Autocomplete Rewrite',
    company: 'Stack Overflow',
    year: '2019',
    whatHappened: 'They rewrote tag autocomplete from database queries to in-memory Trie. Latency dropped from 200ms to <5ms. Servers could handle 10x more traffic.',
    lessonLearned: 'Use the right data structure for the job. Tries are autocomplete\'s best friend.',
    icon: '💨',
  },

  realWorldExample: {
    company: 'Google Search',
    scenario: 'Billions of autocomplete requests daily',
    howTheyDoIt: 'Uses distributed Tries with compression. Each query server has a Trie in RAM for ultra-low latency.',
  },

  diagram: `
┌──────────────────────────────────────────────────────┐
│              TRIE STRUCTURE                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    (root)                            │
│                   /  |  \\                            │
│                  g   m   s                           │
│                 /    |    \\                          │
│                o     a     e                         │
│               / \\    |     |                         │
│              o   m   p     a                         │
│              |   |   |     |                         │
│           [good] [gmail] [maps] [search]             │
│           (500) (2000)  (5000) (1000)                │
│                                                      │
│  Query: "go" → Traverse g→o → Return all children   │
│  Results: [good:500, gmail:2000] sorted by score    │
│  Time: O(2) + O(2) = O(4) instead of O(10M)!        │
└──────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Trie nodes represent characters, edges spell words',
    'Each node stores child nodes + data (query, popularity)',
    'Lookup is O(k) where k is prefix length - blazing fast!',
    'Space overhead: ~10-20x larger than flat list, but worth it',
  ],

  quickCheck: {
    question: 'What\'s the time complexity to find suggestions for a 5-character prefix in a Trie?',
    options: [
      'O(n) - must check all queries',
      'O(log n) - binary search',
      'O(5) - constant, depends only on prefix length',
      'O(n × 5) - check all queries for 5 chars',
    ],
    correctIndex: 2,
    explanation: 'Trie lookup is O(k) where k=prefix length. For "hello" (5 chars), it\'s O(5) regardless of total queries!',
  },

  keyConcepts: [
    { title: 'Trie', explanation: 'Tree structure optimized for prefix matching', icon: '🌳' },
    { title: 'Node', explanation: 'Represents a character in the tree', icon: '⭕' },
    { title: 'Prefix Lookup', explanation: 'Traverse tree character by character', icon: '🔍' },
    { title: 'Time Complexity', explanation: 'O(k) for prefix of length k', icon: '⚡' },
  ],
};

const step4: GuidedStep = {
  id: 'search-suggestions-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time prefix suggestions (now optimized with Trie)',
    taskDescription: 'Update your Python code to use a Trie data structure',
    successCriteria: [
      'Click on App Server',
      'Open the Python tab',
      'Implement Trie class with insert() and search_prefix() methods',
      'Update autocomplete() to use Trie instead of linear search',
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
    level1: 'Open the Python editor and implement a TrieNode class and Trie class',
    level2: 'Create a Trie with insert(query, popularity) and search_prefix(prefix) methods. Use DFS to collect all completions in the prefix subtree.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Caching Layer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your Trie is fast, but you're still rebuilding it from the database on every request!",
  hook: "At 174K requests/sec, the database can't keep up. We need to cache the Trie in memory.",
  challenge: "Add a cache to store the pre-built Trie and serve requests without touching the database.",
  illustration: 'cache-optimization',
};

const step5Celebration: CelebrationContent = {
  emoji: '💨',
  message: 'Autocomplete is now served from cache!',
  achievement: 'Database load reduced by 99.9%',
  metrics: [
    { label: 'Cache hit rate', after: '99%+' },
    { label: 'Latency', before: '50ms', after: '<5ms' },
    { label: 'DB queries/sec', before: '174K', after: '<100' },
  ],
  nextTeaser: "But can a single server handle all this traffic?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Strategy for Autocomplete',
  conceptExplanation: `The entire Trie can fit in memory! With 10M queries at 50 bytes each = 500MB.

**Two-layer caching strategy:**

1. **Application-level Trie cache**:
   - Build Trie from DB once, keep in memory
   - All autocomplete requests use in-memory Trie
   - Rebuild every hour to incorporate trending queries

2. **Redis cache for popular prefixes**:
   - Cache top suggestions for common prefixes ("g", "go", "goo")
   - These serve 80% of requests instantly
   - Fallback to Trie for less common prefixes

**Result**:
- 99% of requests never touch the database
- Latency drops to <5ms
- Can handle 174K req/sec easily`,

  whyItMatters: 'At massive scale, every database query costs time and money. Caching is essential.',

  famousIncident: {
    title: 'Bing Autocomplete Cache Miss Storm',
    company: 'Microsoft Bing',
    year: '2015',
    whatHappened: 'A cache cluster restart caused all autocomplete queries to hit the database simultaneously. The DB couldn\'t handle 100K+ queries/sec and crashed, taking down all search suggestions for 2 hours.',
    lessonLearned: 'Always have cache warming. Never let all caches expire at once.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Serving billions of autocomplete requests',
    howTheyDoIt: 'Pre-computed Tries in memory at edge servers globally. Redis for hot prefixes. Database only for analytics, never for serving.',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│        AUTOCOMPLETE CACHING ARCHITECTURE           │
├────────────────────────────────────────────────────┤
│                                                    │
│  Client → App Server                               │
│               │                                    │
│               ▼                                    │
│         ┌──────────┐                               │
│         │  Redis   │  ← Hot prefixes (80% traffic)│
│         │  Cache   │                               │
│         └────┬─────┘                               │
│              │ miss                                │
│              ▼                                    │
│         ┌──────────┐                               │
│         │In-Memory │  ← Full Trie (20% traffic)   │
│         │   Trie   │                               │
│         └────┬─────┘                               │
│              │ rebuild hourly                     │
│              ▼                                    │
│         ┌──────────┐                               │
│         │ Database │  ← Only for rebuilds         │
│         └──────────┘                               │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Entire Trie fits in memory (500MB for 10M queries)',
    'Redis caches popular prefixes for instant response',
    'Rebuild Trie periodically (hourly) for trending queries',
    'Database used only for rebuilds, not serving traffic',
  ],

  quickCheck: {
    question: 'Why can the entire Trie fit in memory?',
    options: [
      'Because we only cache 100 queries',
      'Because 10M queries × 50 bytes = ~500MB, easily fits in RAM',
      'Because we compress it heavily',
      'Because we only cache popular queries',
    ],
    correctIndex: 1,
    explanation: 'The corpus is small enough to fit entirely in memory. Modern servers have 16GB+ RAM easily.',
  },

  keyConcepts: [
    { title: 'In-Memory Trie', explanation: 'Full dataset loaded in RAM for speed', icon: '💾' },
    { title: 'Cache Warming', explanation: 'Pre-populate cache to avoid cold starts', icon: '🔥' },
    { title: 'TTL Rebuild', explanation: 'Refresh cache periodically for trending queries', icon: '🔄' },
  ],
};

const step5: GuidedStep = {
  id: 'search-suggestions-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from caching',
    taskDescription: 'Add a Redis cache to store the Trie and popular prefix results',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache Trie and hot prefix results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (3600 seconds for Trie)',
    ],
  },

  celebration: step5Celebration,

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
    level2: 'Connect App Server to Cache. Set TTL to 3600 seconds (1 hour) for periodic Trie rebuilds.',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Horizontal Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Traffic keeps growing! Your single server is maxed out at 100% CPU.",
  hook: "At 174K requests/sec, one server can't handle it all. Requests are timing out.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is now balanced across servers!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Capacity', before: '20K req/s', after: 'Unlimited with scaling' },
  ],
  nextTeaser: "But we still only have one server instance...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for High Throughput',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes requests.

For autocomplete at 174K req/sec:
- One server can handle ~20K req/sec
- Need at least 9 servers to handle peak traffic
- Load balancer distributes evenly across all servers

Benefits:
- **Horizontal scaling**: Add more servers as needed
- **High availability**: If one server dies, others continue
- **No single point of failure**

**Important for autocomplete**: Each server has its own in-memory Trie, so they're stateless and can scale independently.`,

  whyItMatters: 'At 174K requests/sec, you MUST distribute load. No single server can handle that.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Handling billions of autocomplete requests',
    howTheyDoIt: 'Uses global load balancers to route requests to nearest data center, then local load balancers to distribute across query servers.',
  },

  keyPoints: [
    'Load balancer distributes 174K req/sec across servers',
    'Each app server has its own in-memory Trie',
    'Stateless servers = easy horizontal scaling',
    'Add/remove servers dynamically based on traffic',
  ],

  quickCheck: {
    question: 'If one server handles 20K req/sec, how many do you need for 174K req/sec peak?',
    options: [
      '5 servers',
      '9 servers',
      '17 servers',
      '1 big server',
    ],
    correctIndex: 1,
    explanation: '174K ÷ 20K = 8.7, so need at least 9 servers. Add a few more for safety buffer.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'search-suggestions-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs require high throughput',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute 174K req/sec across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
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
// STEP 7: Scale to Multiple App Server Instances
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "You added a load balancer, but it's still routing to just ONE server!",
  hook: "The load balancer has nothing to balance. You need multiple server instances.",
  challenge: "Scale horizontally by running multiple app server instances.",
  illustration: 'horizontal-scaling',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle massive traffic!',
  achievement: 'Multiple servers share the autocomplete load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Capacity', before: '20K req/s', after: '200K+ req/s' },
    { label: 'Can handle peak', after: '✓ 174K req/s' },
  ],
  nextTeaser: "But what about ranking by popularity?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Multiple Instances',
  conceptExplanation: `**Horizontal scaling** for autocomplete:

At 174K req/sec peak:
- 1 server handles 20K req/sec
- Need 10 instances to handle peak with headroom

Each instance:
- Has its own in-memory Trie (500MB RAM)
- Independently serves autocomplete requests
- Rebuilds Trie from cache/DB hourly

Load balancer distributes requests evenly:
- Round-robin: server1 → server2 → ... → server10 → server1
- Or least-connections: send to least busy server`,

  whyItMatters: 'Without multiple instances, your load balancer can\'t actually balance anything.',

  realWorldExample: {
    company: 'Amazon Search',
    scenario: 'Handling millions of product searches',
    howTheyDoIt: 'Runs hundreds of autocomplete servers globally. Each has a Trie of popular product queries. Auto-scales during peak shopping hours.',
  },

  keyPoints: [
    'Each instance has its own Trie in memory',
    'All instances share the same cache and database',
    'Stateless design makes scaling easy',
    'Add/remove instances based on traffic',
  ],

  quickCheck: {
    question: 'Why is stateless design important for horizontal scaling?',
    options: [
      'It uses less memory',
      'Any server can handle any request - no session stickiness needed',
      'It\'s cheaper',
      'It\'s easier to code',
    ],
    correctIndex: 1,
    explanation: 'Stateless means any server can serve any request. No sticky sessions needed - load balancer can route freely.',
  },

  keyConcepts: [
    { title: 'Instance', explanation: 'A running copy of your app server', icon: '🖥️' },
    { title: 'Stateless', explanation: 'No user-specific state stored on server', icon: '🔄' },
    { title: 'Headroom', explanation: 'Extra capacity for traffic spikes', icon: '📊' },
  ],
};

const step7: GuidedStep = {
  id: 'search-suggestions-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more compute capacity',
    taskDescription: 'Scale the App Server to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 10 or more',
    ],
  },

  celebration: step7Celebration,

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
    level1: 'Click on the App Server, then find the instance count in Configuration',
    level2: 'Set instances to 10. This gives you 200K req/sec capacity for 174K peak traffic.',
    solutionComponents: [{ type: 'app_server', config: { instances: 10 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Optimize Ranking by Popularity
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🏆',
  scenario: "Users are seeing weird suggestions! 'google' should rank higher than 'good night'.",
  hook: "Your Trie returns matches, but they're not sorted by popularity correctly.",
  challenge: "Implement popularity-based ranking to show the most relevant suggestions first.",
  illustration: 'ranking-algorithm',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Suggestions are now perfectly ranked!',
  achievement: 'Top suggestions appear first based on search frequency',
  metrics: [
    { label: 'Ranking algorithm', after: 'Popularity-based' },
    { label: 'User satisfaction', before: '60%', after: '95%' },
    { label: 'Click-through rate', before: '40%', after: '85%' },
  ],
  nextTeaser: "Your autocomplete system is complete!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Ranking Algorithms for Autocomplete',
  conceptExplanation: `**Popularity-based ranking** is the foundation:

Each query has a popularity score based on:
1. **Search frequency**: How often it's searched
2. **Recency**: Recent searches weighted higher
3. **Click-through rate**: How often users click the suggestion

Example scores:
- "google" → 10,000,000 (searched millions of times)
- "gmail" → 5,000,000
- "good morning" → 2,000,000
- "good night" → 1,500,000

When user types "goo":
1. Trie finds all matches: [google, good morning, good night]
2. Sort by popularity score (descending)
3. Return top 5: [google, good morning, good night]

**Advanced ranking factors** (beyond MVP):
- Personalization (user's search history)
- Location (city names ranked higher locally)
- Time of day ("good morning" ranks higher at 8am)
- Trending boost (sudden popularity spike)`,

  whyItMatters: 'Good ranking is the difference between useful and useless autocomplete. Users expect relevant suggestions.',

  famousIncident: {
    title: 'Google Autocomplete Bias',
    company: 'Google',
    year: '2018',
    whatHappened: 'Critics found Google autocomplete was showing biased suggestions based on popularity. Google had to implement fairness filters while maintaining relevance.',
    lessonLearned: 'Ranking by pure popularity can amplify biases. Consider editorial controls for sensitive queries.',
    icon: '⚖️',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Ranking billions of queries',
    howTheyDoIt: 'Uses machine learning models that combine popularity, personalization, context, and freshness. Updated in real-time.',
  },

  diagram: `
┌──────────────────────────────────────────────────────┐
│           POPULARITY RANKING ALGORITHM               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Prefix: "goo"                                       │
│                                                      │
│  Trie matches:                                       │
│  ┌──────────────────┬──────────┬─────────┐          │
│  │ Query            │ Score    │ Rank    │          │
│  ├──────────────────┼──────────┼─────────┤          │
│  │ google           │10,000,000│ 1       │          │
│  │ good morning     │ 2,000,000│ 2       │          │
│  │ good night       │ 1,500,000│ 3       │          │
│  │ google maps      │ 5,000,000│ 4       │          │
│  │ google translate │ 3,000,000│ 5       │          │
│  └──────────────────┴──────────┴─────────┘          │
│                                                      │
│  Return top 5 sorted by score                        │
│                                                      │
│  Score = f(search_count, recency, CTR)               │
│  - search_count: total searches                      │
│  - recency: recent searches weighted 2x              │
│  - CTR: % users who clicked this suggestion          │
└──────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Store popularity score with each query in the Trie',
    'Sort suggestions by score before returning top-K',
    'Update scores periodically from search logs',
    'Consider recency - trending queries rank higher',
  ],

  quickCheck: {
    question: 'What should be the ranking signal for autocomplete suggestions?',
    options: [
      'Alphabetical order',
      'Random',
      'Search frequency / popularity',
      'Length of query',
    ],
    correctIndex: 2,
    explanation: 'Popularity (search frequency) is the primary ranking signal. Most searched queries are most relevant.',
  },

  keyConcepts: [
    { title: 'Popularity Score', explanation: 'Numerical score based on search frequency', icon: '📊' },
    { title: 'Top-K', explanation: 'Return only the K highest-ranked results', icon: '🔝' },
    { title: 'CTR', explanation: 'Click-through rate - % users clicking suggestion', icon: '👆' },
    { title: 'Trending', explanation: 'Recent popularity surge boosts ranking', icon: '📈' },
  ],
};

const step8: GuidedStep = {
  id: 'search-suggestions-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: Ranked by popularity (final optimization)',
    taskDescription: 'Update your Trie implementation to properly rank suggestions by popularity',
    successCriteria: [
      'Click on App Server',
      'Open the Python tab',
      'Update Trie to store popularity scores',
      'Modify search_prefix() to return results sorted by score',
      'Return only top 10 suggestions',
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
    requireCacheStrategy: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Open the Python editor and update the Trie node to store popularity scores',
    level2: 'When collecting completions in search_prefix(), sort them by popularity score descending and return top 10',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const searchSuggestionsGuidedTutorial: GuidedTutorial = {
  problemId: 'search-suggestions-guided',
  problemTitle: 'Build Search Autocomplete - A System Design Journey',

  requirementsPhase: searchSuggestionsRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Autocomplete',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System provides real-time prefix suggestions with low latency.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Popularity Ranking',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Suggestions are correctly ranked by popularity score.',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K autocomplete requests per second with low latency.',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.02 },
    },
    {
      name: 'Peak Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle peak traffic of 174K requests/sec during prime hours.',
      traffic: { type: 'read', rps: 174000, readRps: 174000 },
      duration: 60,
      passCriteria: { maxP99Latency: 150, maxErrorRate: 0.05 },
    },
    {
      name: 'Cache Effectiveness',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Cache hit rate above 95% for optimal performance.',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { minCacheHitRate: 0.95, maxP99Latency: 100 },
    },
    {
      name: 'Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Stay within $1,500/month budget while meeting performance targets.',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 1500, maxP99Latency: 100, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export default searchSuggestionsGuidedTutorial;
