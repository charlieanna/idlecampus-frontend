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
 * Synonym Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching synonym search and query expansion.
 * Focus: Synonym mapping, bidirectional synonyms, query-time vs index-time expansion,
 * synonym graphs, domain-specific synonyms, multilingual synonyms
 *
 * Key Concepts:
 * - Synonym mapping and expansion strategies
 * - Query-time vs index-time expansion tradeoffs
 * - Bidirectional synonym relationships
 * - Synonym graphs for transitive relationships
 * - Domain-specific synonym management
 * - Multilingual synonym handling
 *
 * Flow:
 * Phase 0: Requirements gathering (synonym sources, bidirectional, domain-specific)
 * Steps 1-3: Basic synonym expansion
 * Steps 4-6: Synonym graphs, query-time vs index-time expansion, multilingual synonyms
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const synonymSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a synonym search system for an e-commerce search engine",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Search Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-synonyms',
      category: 'functional',
      question: "What are synonyms and why do we need them in search?",
      answer: "Synonyms are different words with similar meanings. In e-commerce, users search using different terms for the same product: 'laptop' vs 'notebook', 'TV' vs 'television', 'cell phone' vs 'mobile phone'. Without synonym support, we miss valid results and frustrate users who don't use our exact terminology.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Synonym expansion is critical for search recall - users don't always use catalog terminology",
    },
    {
      id: 'synonym-sources',
      category: 'functional',
      question: "Where do synonyms come from?",
      answer: "Multiple sources: (1) Manual curation by domain experts ('sneakers' = 'shoes'), (2) Search analytics (users search 'TV' then click 'television' results), (3) WordNet or thesauri for general terms, (4) Domain-specific mappings ('iPhone' = 'Apple phone'). We need to support custom synonym dictionaries that can be updated without code changes.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Synonym dictionaries must be configurable and updatable - hardcoding is not scalable",
    },
    {
      id: 'bidirectional',
      category: 'functional',
      question: "Should synonyms work in both directions?",
      answer: "Depends! 'TV' → 'television' should work both ways (bidirectional). But 'iPhone' → 'smartphone' should only expand iPhone to include smartphones, not make every smartphone search return iPhones (unidirectional). We need to support BOTH types.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Bidirectional vs unidirectional synonyms serve different use cases - need both",
    },

    // IMPORTANT - Clarifications
    {
      id: 'domain-specific',
      category: 'clarification',
      question: "Do synonyms change by category or domain?",
      answer: "Yes! In electronics, 'adapter' means 'charger' or 'cable'. In clothing, 'adapter' has no synonyms. In books, 'novel' means 'fiction book'. In crafts, 'novel' means 'new'. We need category-specific synonym dictionaries to avoid false matches.",
      importance: 'important',
      insight: "Domain context is critical - global synonyms cause precision problems",
    },
    {
      id: 'multi-word-synonyms',
      category: 'clarification',
      question: "Should we handle multi-word synonyms?",
      answer: "Absolutely! 'running shoes' = 'sneakers', 'cell phone' = 'mobile', 'flat screen' = 'LCD TV'. Multi-word to single-word and vice versa. This adds complexity to tokenization and matching.",
      importance: 'important',
      insight: "Multi-word synonyms require phrase detection before expansion",
    },
    {
      id: 'query-vs-index-time',
      category: 'clarification',
      question: "When should we expand synonyms - at query time or index time?",
      answer: "Tradeoff! Query-time: Expand user's query 'laptop' to search for ['laptop', 'notebook', 'computer']. Fast indexing but slower queries. Index-time: Store all synonyms in product documents. Faster queries but larger indexes. For MVP, use query-time expansion. We can optimize later.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Query-time vs index-time expansion is a fundamental design decision with different tradeoffs",
    },
    {
      id: 'synonym-ranking',
      category: 'clarification',
      question: "Should exact matches rank higher than synonym matches?",
      answer: "Yes! If user searches 'laptop', exact 'laptop' matches should rank above 'notebook' matches. Synonyms expand recall but exact matches show stronger intent. We need synonym-aware relevance scoring.",
      importance: 'important',
      insight: "Synonym expansion affects ranking - exact matches should score higher",
    },
    {
      id: 'multilingual',
      category: 'clarification',
      question: "Do we need multilingual synonyms?",
      answer: "Not for MVP, but plan for it. Cross-language synonyms are complex: 'ordinateur' (French) = 'computer', but also need English synonyms for 'computer' = 'laptop', 'PC'. Defer to v2.",
      importance: 'nice-to-have',
      insight: "Multilingual synonyms multiply complexity - start with single language",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-products',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "10 million products across multiple categories",
      importance: 'critical',
      learningPoint: "Large catalogs require efficient synonym expansion - can't brute force",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "Peak of 50,000 queries/second. Each query might expand to 5-10 synonym variations.",
      importance: 'critical',
      calculation: {
        formula: "50K QPS × 5 synonym expansions = 250K sub-queries/sec",
        result: "Need efficient synonym lookup and query expansion",
      },
      learningPoint: "Synonym expansion multiplies query load - must be fast",
    },
    {
      id: 'throughput-synonyms',
      category: 'throughput',
      question: "How many synonym mappings?",
      answer: "Start with 10,000 synonym rules (5,000 bidirectional pairs). Will grow to 100K+ as we add domains and categories.",
      importance: 'important',
      insight: "Synonym dictionaries can be large - need efficient data structures",
    },

    // LATENCY
    {
      id: 'latency-search',
      category: 'latency',
      question: "What's the latency budget for synonym expansion?",
      answer: "Total search p99 must be under 200ms. Synonym expansion should add less than 10ms overhead. Lookup must be cached in memory.",
      importance: 'critical',
      learningPoint: "Synonym expansion cannot slow down search - must be extremely fast",
    },
    {
      id: 'latency-updates',
      category: 'latency',
      question: "How quickly should synonym updates go live?",
      answer: "Within 1 minute. Merchandising team updates synonyms frequently based on analytics. Async update is fine - don't block searches.",
      importance: 'important',
      insight: "Hot-reload synonym dictionaries without downtime",
    },

    // ACCURACY
    {
      id: 'accuracy-precision',
      category: 'accuracy',
      question: "How do we prevent synonym over-expansion causing irrelevant results?",
      answer: "Limit expansion to 5 synonyms per term max. Use relevance scoring to rank exact matches higher. Monitor 'zero results after expansion' vs 'too many results'. Target: synonym expansion should improve recall by 20% while keeping precision above 90%.",
      importance: 'important',
      learningPoint: "Synonym expansion is a precision/recall tradeoff - tune thresholds carefully",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-synonyms', 'bidirectional', 'query-vs-index-time'],
  criticalFRQuestionIds: ['core-synonyms', 'bidirectional', 'query-vs-index-time'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-search', 'accuracy-precision'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Basic synonym expansion',
      description: 'Map user queries to synonyms (laptop → notebook, computer)',
      emoji: '🔄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Bidirectional synonym support',
      description: 'Some synonyms work both ways, others are one-way',
      emoji: '↔️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Query-time expansion',
      description: 'Expand user queries at search time for flexible updates',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Domain-specific synonyms',
      description: 'Different synonym sets per category/domain',
      emoji: '🏷️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million searchers/day',
    writesPerDay: '1K synonym updates/day',
    readsPerDay: '500 million searches/day',
    peakMultiplier: 3,
    readWriteRatio: '500000:1',
    calculatedWriteRPS: { average: 0.01, peak: 1 },
    calculatedReadRPS: { average: 5787, peak: 50000 },
    maxPayloadSize: '~1KB per query (with expansions)',
    storagePerRecord: '~100 bytes per synonym rule',
    storageGrowthPerYear: '~10MB (new synonym rules)',
    redirectLatencySLA: 'p99 < 200ms (including expansion)',
    createLatencySLA: 'synonym updates < 1 minute to go live',
  },

  architecturalImplications: [
    '✅ 50K QPS → In-memory synonym dictionaries (Redis/cache)',
    '✅ <10ms expansion overhead → Pre-load synonym graphs',
    '✅ 10K synonym rules → Efficient lookup structures (trie, hash map)',
    '✅ Query-time expansion → Avoid index bloat',
    '✅ Domain-specific → Multi-tenant synonym storage',
    '✅ Hot reload → Versioned synonym dictionaries',
  ],

  outOfScope: [
    'Multilingual synonyms (v2)',
    'Machine learning synonym discovery',
    'Context-aware synonym selection',
    'Synonym analytics dashboard',
    'A/B testing synonym rules',
  ],

  keyInsight: "First, let's make it WORK. We'll build basic synonym mapping with a simple dictionary, then progressively add bidirectional support, domain-specific synonyms, and optimization. Start with query-time expansion for flexibility.",
};

// =============================================================================
// STEP 1: The Beginning - Basic Search Without Synonyms
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "You're building product search for an electronics store with 10,000 products.",
  hook: "A user searches for 'laptop' and finds 500 results. Great! But when they search 'notebook computer', they get zero results even though we have laptops.",
  challenge: "Build basic search infrastructure: Client → App Server → Search Index. No synonyms yet - this is the baseline.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your basic search works!",
  achievement: "Users can search for products by exact terms",
  metrics: [
    { label: 'Search type', after: 'Exact match only' },
    { label: 'Latency', after: '<50ms' },
  ],
  nextTeaser: "But users searching for synonyms get zero results...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Baseline: Search Without Synonyms',
  conceptExplanation: `Before adding synonyms, let's understand the problem.

**Basic search flow:**
1. User searches "laptop"
2. Search index finds documents containing "laptop"
3. Return results: ✅ 500 products

**The synonym problem:**
1. User searches "notebook computer"
2. Search index finds documents containing "notebook computer"
3. Return results: ❌ 0 products (our catalog uses "laptop", not "notebook")

**Why this fails:**
- Different users use different terminology
- Catalog uses vendor language ("laptop")
- Users use everyday language ("notebook", "portable computer")
- Missing synonyms = missing sales`,

  whyItMatters: 'Without synonyms, search recall is poor. Users who don\'t use exact catalog terminology get frustrated and leave.',

  keyPoints: [
    'Basic search only matches exact terms',
    'Users and catalogs use different vocabulary',
    'Synonyms bridge the terminology gap',
    'This baseline shows why we need synonym expansion',
  ],

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │────▶│ App Server  │────▶│ Search Index │
└────────┘     └─────────────┘     └──────────────┘

Query: "notebook computer"
Index contains: "laptop", "laptop computer"
Result: ZERO MATCHES (terminology mismatch)
`,

  keyConcepts: [
    { title: 'Exact Match', explanation: 'Search only finds documents with exact query terms', icon: '🎯' },
    { title: 'Recall Problem', explanation: 'Relevant results missed due to terminology differences', icon: '📉' },
  ],
};

const step1: GuidedStep = {
  id: 'synonym-search-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Setting up foundation for search',
    taskDescription: 'Add Client, App Server, and Search Index with basic connections',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search queries', displayName: 'App Server' },
      { type: 'search_index', reason: 'Stores searchable product data', displayName: 'Search Index' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send search queries' },
      { from: 'App Server', to: 'Search Index', reason: 'Server queries product index' },
    ],
    successCriteria: ['Add Client, App Server, Search Index', 'Connect Client → App Server → Search Index'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },
  hints: {
    level1: 'Build the basic search path: Client → App Server → Search Index',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'search_index' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'search_index' },
    ],
  },
};

// =============================================================================
// STEP 2: Add Simple Synonym Dictionary
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📚',
  scenario: "Your analytics show 30% of searches return zero results because users don't use catalog terminology!",
  hook: "'notebook' has no results, but we have 'laptop'. 'TV' finds nothing, but we have 'television'. We need synonym mapping!",
  challenge: "Create a simple synonym dictionary and implement basic expansion. Start with a few hardcoded synonyms.",
  illustration: 'dictionary',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Synonym expansion is working!",
  achievement: "Searches now expand to include synonym terms",
  metrics: [
    { label: 'Zero-result searches', before: '30%', after: '12%' },
    { label: 'Search recall', before: '70%', after: '88%' },
  ],
  nextTeaser: "But the hardcoded dictionary is hard to maintain...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Basic Synonym Expansion',
  conceptExplanation: `**Synonym expansion** means rewriting queries to include related terms.

**Simple expansion example:**
User query: "laptop"
Expanded query: "laptop OR notebook OR portable computer"
Search index gets: ["laptop", "notebook", "portable computer"]
Results: ✅ All laptop products (regardless of terminology)

**Implementation approaches:**

1. **Hardcoded mapping (start here):**
\`\`\`python
SYNONYMS = {
    "laptop": ["laptop", "notebook", "portable computer"],
    "tv": ["tv", "television", "televisor"],
    "phone": ["phone", "cellphone", "mobile"]
}

def expand_query(term: str) -> List[str]:
    return SYNONYMS.get(term.lower(), [term])
\`\`\`

2. **Query rewriting:**
\`\`\`python
def search(query: str):
    expanded_terms = []
    for term in query.split():
        expanded_terms.extend(expand_query(term))

    # Search for: (term1 OR syn1 OR syn2) AND (term2 OR syn3)
    return search_index.query(expanded_terms)
\`\`\`

**Key insight:** Expand at query time, not index time. Easier to update synonyms!`,

  whyItMatters: 'Synonym expansion dramatically improves recall. Users find products even when they use different terminology than the catalog.',

  famousIncident: {
    title: 'Amazon Synonym Expansion',
    company: 'Amazon',
    year: '2006',
    whatHappened: 'Amazon implemented synonym expansion for product search. Within weeks, zero-result searches dropped 40% and conversion rates improved 8%. Now processes billions of synonym expansions daily.',
    lessonLearned: 'Synonym support is not optional for e-commerce search - it directly impacts revenue.',
    icon: '🛒',
  },

  keyPoints: [
    'Expand queries to include synonym terms',
    'Query-time expansion is flexible and updatable',
    'Start with simple dictionary mapping',
    'Expansion increases recall (finds more results)',
  ],

  diagram: `
Query: "laptop"
       │
       ▼
Synonym Expansion
       │
       ▼
Expanded: ["laptop", "notebook", "portable computer"]
       │
       ▼
Search Index finds products with ANY of these terms
       │
       ▼
Results: 500 products (high recall!)
`,

  quickCheck: {
    question: 'Why expand synonyms at query time instead of storing all synonyms in the product index?',
    options: [
      'Query-time is faster',
      'Query-time allows updating synonyms without re-indexing products',
      'Index-time uses less memory',
      'Query-time has better precision',
    ],
    correctIndex: 1,
    explanation: 'Query-time expansion lets you update synonym dictionaries instantly without re-indexing millions of products. Index-time requires full re-indexing.',
  },

  keyConcepts: [
    { title: 'Synonym Expansion', explanation: 'Rewrite query to include related terms', icon: '🔄' },
    { title: 'Query-Time', explanation: 'Expand when user searches (vs at index time)', icon: '⚡' },
    { title: 'Recall', explanation: 'Percentage of relevant results found', icon: '📈' },
  ],
};

const step2: GuidedStep = {
  id: 'synonym-search-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Basic synonym expansion',
    taskDescription: 'Implement synonym dictionary and query expansion in Python',
    componentsNeeded: [
      { type: 'app_server', reason: 'Implement synonym expansion logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Click App Server → Open Python tab',
      'Create SYNONYMS dictionary with mappings',
      'Implement expand_query() function',
      'Update search() to use expansion',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Implement a synonym dictionary and expand queries before searching',
    level2: 'Create SYNONYMS dict, implement expand_query() to return list of terms including synonyms',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Bidirectional Synonym Support
// =============================================================================

const step3Story: StoryContent = {
  emoji: '↔️',
  scenario: "Your merchandising team notices a problem: 'iPhone' searches should include 'smartphone', but 'smartphone' searches shouldn't only show iPhones!",
  hook: "We need TWO types of synonyms: bidirectional (TV ↔ television) and unidirectional (iPhone → smartphone, but not reverse).",
  challenge: "Enhance your synonym dictionary to support both symmetric and asymmetric relationships.",
  illustration: 'graph-network',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Bidirectional synonyms working!",
  achievement: "Synonym expansion respects directional relationships",
  metrics: [
    { label: 'Precision issues', before: '15%', after: '3%' },
    { label: 'Search quality', before: '82%', after: '94%' },
  ],
  nextTeaser: "But managing synonyms manually is getting hard...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Bidirectional vs Unidirectional Synonyms',
  conceptExplanation: `Not all synonyms work both ways!

**Bidirectional (symmetric):**
- TV ↔ television (interchangeable)
- laptop ↔ notebook (same meaning)
- couch ↔ sofa (equivalent terms)

**Unidirectional (asymmetric):**
- iPhone → smartphone (iPhone is a smartphone)
- But NOT: smartphone → iPhone (not all smartphones are iPhones!)

**Why this matters:**
Query: "smartphone"
❌ Bad expansion: ["smartphone", "iPhone", "Galaxy", "Pixel"]
   → Only shows expensive phones, misses budget options

✅ Good expansion: ["smartphone", "mobile phone", "cell phone"]
   → Shows all phones, user can filter by brand

**Implementation:**
\`\`\`python
# Bidirectional synonyms
BIDIRECTIONAL = {
    "tv": ["television", "televisor"],
    "laptop": ["notebook", "portable computer"],
}

# Unidirectional synonyms (broader → narrower)
UNIDIRECTIONAL = {
    "iphone": ["smartphone", "mobile phone"],
    "macbook": ["laptop", "notebook"],
}

def expand_query(term: str) -> List[str]:
    term_lower = term.lower()

    # Check bidirectional (works both ways)
    if term_lower in BIDIRECTIONAL:
        return [term] + BIDIRECTIONAL[term_lower]

    # Check reverse bidirectional
    for key, synonyms in BIDIRECTIONAL.items():
        if term_lower in synonyms:
            return [term, key] + synonyms

    # Check unidirectional (only expands specific → general)
    if term_lower in UNIDIRECTIONAL:
        return [term] + UNIDIRECTIONAL[term_lower]

    return [term]
\`\`\`

**Example behavior:**
- Query "laptop" → ["laptop", "notebook", "portable computer"] ✅
- Query "notebook" → ["notebook", "laptop", "portable computer"] ✅ (bidirectional)
- Query "iPhone" → ["iPhone", "smartphone", "mobile phone"] ✅
- Query "smartphone" → ["smartphone", "mobile phone"] ✅ (NOT iPhone)`,

  whyItMatters: 'Bidirectional control prevents over-expansion and maintains search precision. Brand-specific queries should not expand to competitors.',

  realWorldExample: {
    company: 'eBay',
    scenario: 'Handling brand-specific vs generic searches',
    howTheyDoIt: 'Uses unidirectional synonyms: "Nike shoes" expands to "sneakers", but "sneakers" does not force Nike results. Preserves user intent.',
  },

  famousIncident: {
    title: 'Google Shopping Synonym Controversy',
    company: 'Google Shopping',
    year: '2019',
    whatHappened: 'Google aggressively expanded brand queries bidirectionally. Searching "Sony TV" showed Samsung and LG. Users complained about losing brand specificity. Google adjusted to use more unidirectional expansion.',
    lessonLearned: 'Respect user intent - specific brand queries should not over-expand to competitors.',
    icon: '🏬',
  },

  keyPoints: [
    'Bidirectional: terms are interchangeable (TV ↔ television)',
    'Unidirectional: specific → general only (iPhone → smartphone)',
    'Preserves user intent and search precision',
    'Prevents brand queries from showing competitors',
  ],

  diagram: `
BIDIRECTIONAL:
laptop ←→ notebook ←→ portable computer
(any term finds all products)

UNIDIRECTIONAL:
iPhone → smartphone → mobile phone
  ↓         ↓            ↓
  ✓         ✓            ✓ (iPhone search finds all)

smartphone → mobile phone
  ↓            ↓
  ✓            ✓ (smartphone search finds generic, NOT iPhone)
`,

  quickCheck: {
    question: 'Why should "iPhone" → "smartphone" be unidirectional, not bidirectional?',
    options: [
      'iPhones are more expensive',
      'Users searching "smartphone" want all options, not just iPhones',
      'Bidirectional uses more memory',
      'iPhone is a brand name',
    ],
    correctIndex: 1,
    explanation: 'Generic term searches should show all products. Expanding "smartphone" to "iPhone" would incorrectly narrow results to one brand.',
  },

  keyConcepts: [
    { title: 'Bidirectional', explanation: 'Synonyms work in both directions', icon: '↔️' },
    { title: 'Unidirectional', explanation: 'Synonyms work in one direction only', icon: '→' },
    { title: 'Precision', explanation: 'Avoiding irrelevant results', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'synonym-search-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Bidirectional synonym support',
    taskDescription: 'Separate synonyms into bidirectional and unidirectional dictionaries',
    componentsNeeded: [
      { type: 'app_server', reason: 'Update synonym logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Create BIDIRECTIONAL and UNIDIRECTIONAL dictionaries',
      'Update expand_query() to handle both types',
      'Test: "laptop" ↔ "notebook" works both ways',
      'Test: "iPhone" → "smartphone" only one way',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Create two separate synonym dictionaries for bidirectional and unidirectional mappings',
    level2: 'Split SYNONYMS into BIDIRECTIONAL and UNIDIRECTIONAL, update expand_query() to check both',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Synonym Graph for Transitive Relationships
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🕸️',
  scenario: "Your synonym dictionary is growing: laptop=notebook, notebook=portable computer. But 'laptop' doesn't expand to 'portable computer' directly!",
  hook: "We need transitive synonyms: if A=B and B=C, then A=C. A synonym GRAPH, not just pairs!",
  challenge: "Build a synonym graph that automatically detects transitive relationships.",
  illustration: 'network-graph',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌐',
  message: "Synonym graph built!",
  achievement: "Transitive relationships automatically discovered",
  metrics: [
    { label: 'Synonym coverage', before: '60%', after: '87%' },
    { label: 'Manual mappings needed', before: '100%', after: '40%' },
  ],
  nextTeaser: "But we're still hardcoding synonyms in code...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Synonym Graphs: Transitive Relationships',
  conceptExplanation: `**The transitive synonym problem:**

Manual mappings:
- laptop = notebook ✓
- notebook = portable computer ✓
- laptop = portable computer ❓ (forgot to add!)

With a **synonym graph**, transitivity is automatic:
\`\`\`
laptop --- notebook --- portable computer
\`\`\`

Query "laptop" finds ALL connected nodes:
→ ["laptop", "notebook", "portable computer"]

**Graph implementation:**
\`\`\`python
class SynonymGraph:
    def __init__(self):
        # Adjacency list representation
        self.graph = defaultdict(set)

    def add_bidirectional(self, term1: str, term2: str):
        self.graph[term1].add(term2)
        self.graph[term2].add(term1)

    def get_synonyms(self, term: str) -> Set[str]:
        # BFS/DFS to find all connected terms
        visited = set()
        queue = [term]

        while queue:
            current = queue.pop(0)
            if current in visited:
                continue

            visited.add(current)
            for neighbor in self.graph[current]:
                if neighbor not in visited:
                    queue.append(neighbor)

        return visited
\`\`\`

**Example:**
\`\`\`python
syn_graph = SynonymGraph()
syn_graph.add_bidirectional("laptop", "notebook")
syn_graph.add_bidirectional("notebook", "portable computer")
syn_graph.add_bidirectional("laptop", "laptop computer")

# Query "laptop"
synonyms = syn_graph.get_synonyms("laptop")
# Returns: {"laptop", "notebook", "portable computer", "laptop computer"}
\`\`\`

**Benefits:**
- Automatic transitive expansion
- No redundant manual mappings
- Easy to visualize and debug
- Handles complex synonym networks

**Caution:**
Limit expansion depth to avoid over-expansion:
laptop → notebook → computer → device → product (TOO BROAD!)

Set max depth = 2 or max synonyms = 5.`,

  whyItMatters: 'Synonym graphs reduce manual mapping effort and automatically handle transitive relationships. Essential for large synonym dictionaries.',

  famousIncident: {
    title: 'WordNet Semantic Network',
    company: 'Princeton University',
    year: '1985',
    whatHappened: 'WordNet organized English words into a semantic graph with synonym sets (synsets) and relationships. Became the foundation for NLP and search synonym expansion. Now contains 155,000+ words with transitive relationships.',
    lessonLearned: 'Graph-based synonym storage scales to massive vocabularies and captures complex relationships.',
    icon: '📖',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Synonym graph token filter',
    howTheyDoIt: 'Uses synonym graphs to handle multi-word synonyms and transitive expansion. Can limit expansion depth to prevent over-expansion.',
  },

  keyPoints: [
    'Synonym graphs capture transitive relationships automatically',
    'BFS/DFS traversal finds all connected synonyms',
    'Reduces manual mapping effort significantly',
    'Must limit expansion depth to avoid over-generalization',
  ],

  diagram: `
SYNONYM GRAPH:

    laptop ──────── notebook
      │               │
      │               │
laptop computer   portable computer
      │               │
      └───────┬───────┘
              │
         mobile workstation

Query "laptop" → BFS traversal:
→ {laptop, notebook, laptop computer, portable computer, mobile workstation}

With depth limit = 2:
→ {laptop, notebook, laptop computer, portable computer}
`,

  quickCheck: {
    question: 'What problem do synonym graphs solve that simple dictionary mappings cannot?',
    options: [
      'Faster lookup performance',
      'Automatic transitive synonym relationships',
      'Better memory efficiency',
      'Support for multiple languages',
    ],
    correctIndex: 1,
    explanation: 'Graphs automatically find all connected terms through transitivity. Dictionaries require manually listing every relationship.',
  },

  keyConcepts: [
    { title: 'Synonym Graph', explanation: 'Network of connected synonym terms', icon: '🕸️' },
    { title: 'Transitive', explanation: 'If A=B and B=C, then A=C', icon: '🔗' },
    { title: 'BFS/DFS', explanation: 'Graph traversal algorithms', icon: '🔍' },
  ],
};

const step4: GuidedStep = {
  id: 'synonym-search-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-3: Synonym graphs with transitive relationships',
    taskDescription: 'Implement SynonymGraph class with BFS traversal',
    componentsNeeded: [
      { type: 'app_server', reason: 'Implement graph-based synonym expansion', displayName: 'App Server' },
    ],
    successCriteria: [
      'Implement SynonymGraph class with adjacency list',
      'Implement get_synonyms() with BFS traversal',
      'Add depth or count limit to prevent over-expansion',
      'Migrate existing synonyms to graph structure',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Build a graph data structure for synonyms with BFS traversal',
    level2: 'Use defaultdict(set) for adjacency list, implement BFS in get_synonyms(), limit expansion',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add External Synonym Storage (Database/Config)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💾',
  scenario: "Your merchandising team wants to update synonyms daily based on search analytics, but they can't edit Python code!",
  hook: "Hardcoded synonyms require code deploys. We need external, updatable synonym storage.",
  challenge: "Move synonym dictionaries to a database so non-engineers can manage them.",
  illustration: 'database',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Synonyms are now data-driven!",
  achievement: "Non-engineers can update synonyms without code changes",
  metrics: [
    { label: 'Deploy time for synonym updates', before: '1 hour', after: '1 minute' },
    { label: 'Synonym updates per week', before: '2', after: '50' },
  ],
  nextTeaser: "But loading synonyms from database on every query is slow...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'External Synonym Storage',
  conceptExplanation: `**Problem with hardcoded synonyms:**
- Requires code changes and deploys
- No version control for synonym data
- Can't update quickly based on analytics
- No A/B testing of synonym rules

**Solution: Store synonyms as data**

**Database schema:**
\`\`\`sql
CREATE TABLE synonyms (
    id SERIAL PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    synonym VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'bidirectional' or 'unidirectional'
    category VARCHAR(100),     -- domain-specific (e.g., 'electronics')
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_term ON synonyms(term);
CREATE INDEX idx_category ON synonyms(category);
\`\`\`

**Loading synonyms:**
\`\`\`python
class SynonymManager:
    def __init__(self, db):
        self.db = db
        self.graph = SynonymGraph()
        self.reload_synonyms()

    def reload_synonyms(self):
        # Clear existing graph
        self.graph = SynonymGraph()

        # Load from database
        rows = self.db.execute("""
            SELECT term, synonym, type
            FROM synonyms
            WHERE active = TRUE
        """)

        for row in rows:
            if row['type'] == 'bidirectional':
                self.graph.add_bidirectional(row['term'], row['synonym'])
            else:
                self.graph.add_unidirectional(row['term'], row['synonym'])

    def get_synonyms(self, term: str, category: str = None) -> Set[str]:
        return self.graph.get_synonyms(term)
\`\`\`

**Hot reload:**
Reload synonyms every N minutes or on admin update signal:
\`\`\`python
# Periodic reload (background thread)
def background_reload():
    while True:
        time.sleep(300)  # 5 minutes
        synonym_manager.reload_synonyms()
        logger.info("Synonyms reloaded")

# Or: Redis pub/sub for instant updates
\`\`\`

**Benefits:**
- Non-engineers can update synonyms
- Version control through database
- A/B testing possible
- Analytics-driven updates`,

  whyItMatters: 'Synonym management must be agile. Merchandising teams need to respond quickly to search trends without engineering deploys.',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Managing 50,000+ synonym rules across categories',
    howTheyDoIt: 'Stores synonyms in PostgreSQL with admin UI. Merchandising team updates daily based on zero-result searches. Hot-reloads every 5 minutes.',
  },

  keyPoints: [
    'Store synonyms as data, not code',
    'Database enables non-engineer updates',
    'Hot-reload without downtime',
    'Support versioning and A/B testing',
  ],

  diagram: `
SYNONYM UPDATE FLOW:

┌──────────────┐
│ Admin UI     │
│ (Merchandising)
└──────┬───────┘
       │ Update synonyms
       ▼
┌──────────────┐
│ Database     │
│ (Synonyms)   │
└──────┬───────┘
       │ Periodic reload (5 min)
       ▼
┌──────────────┐
│ App Server   │
│ (In-memory   │
│  graph)      │
└──────────────┘

Search queries use in-memory graph (fast!)
Updates propagate within 5 minutes (acceptable!)
`,

  quickCheck: {
    question: 'Why load synonyms into memory instead of querying database on every search?',
    options: [
      'Memory is cheaper than database queries',
      'Database queries add 50-100ms latency per search',
      'Databases can\'t store graphs',
      'Memory has better security',
    ],
    correctIndex: 1,
    explanation: 'Database lookups are too slow for 50K QPS. In-memory graphs provide <1ms synonym expansion. Reload periodically for updates.',
  },

  keyConcepts: [
    { title: 'Data-Driven', explanation: 'Store configuration as data, not code', icon: '💾' },
    { title: 'Hot Reload', explanation: 'Update without restarting service', icon: '🔄' },
    { title: 'In-Memory Cache', explanation: 'Load data into RAM for speed', icon: '⚡' },
  ],
};

const step5: GuidedStep = {
  id: 'synonym-search-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-3: External synonym storage for easy updates',
    taskDescription: 'Add database for synonym storage and hot-reload mechanism',
    componentsNeeded: [
      { type: 'database', reason: 'Store synonym mappings', displayName: 'Database' },
      { type: 'app_server', reason: 'Load synonyms from DB', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Database', reason: 'Load synonym data' },
    ],
    successCriteria: [
      'Add Database component',
      'Connect App Server to Database',
      'Implement SynonymManager class',
      'Add reload_synonyms() method',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add database to store synonyms and load them into memory periodically',
    level2: 'Add Database, connect to App Server, implement SynonymManager with reload_synonyms()',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 6: Add Domain-Specific Synonyms
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🏷️',
  scenario: "A user searches for 'adapter' in electronics and gets phone chargers ✓. Same user searches 'adapter' in books and gets... phone chargers ✗",
  hook: "Synonyms are context-dependent! 'Adapter' means different things in different categories.",
  challenge: "Add category/domain-specific synonym dictionaries to avoid cross-domain pollution.",
  illustration: 'categories',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Domain-specific synonyms working!",
  achievement: "Synonyms are scoped to relevant categories",
  metrics: [
    { label: 'Cross-domain false matches', before: '18%', after: '2%' },
    { label: 'Search precision', before: '84%', after: '96%' },
  ],
  nextTeaser: "Time to optimize for scale with caching...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Domain-Specific Synonyms',
  conceptExplanation: `**The domain problem:**

Global synonym: "adapter" = "converter"

✅ In electronics: adapter = charger, power adapter, AC adapter
❌ In books: adapter = screen writer, screenplay writer
❌ In clothing: (no synonyms)

**Solution: Category-scoped synonyms**

\`\`\`python
class DomainSynonymManager:
    def __init__(self):
        # Global synonyms (all categories)
        self.global_graph = SynonymGraph()

        # Domain-specific synonyms
        self.domain_graphs = defaultdict(SynonymGraph)

    def add_synonym(self, term: str, synonym: str,
                   domain: str = None, bidirectional: bool = True):
        if domain:
            graph = self.domain_graphs[domain]
        else:
            graph = self.global_graph

        if bidirectional:
            graph.add_bidirectional(term, synonym)
        else:
            graph.add_unidirectional(term, synonym)

    def get_synonyms(self, term: str, domain: str = None) -> Set[str]:
        # Start with global synonyms
        synonyms = self.global_graph.get_synonyms(term)

        # Add domain-specific synonyms
        if domain:
            domain_synonyms = self.domain_graphs[domain].get_synonyms(term)
            synonyms.update(domain_synonyms)

        return synonyms
\`\`\`

**Database schema update:**
\`\`\`sql
ALTER TABLE synonyms
ADD COLUMN category VARCHAR(100); -- 'electronics', 'books', 'clothing', NULL (global)

CREATE INDEX idx_category ON synonyms(category);
\`\`\`

**Query flow:**
\`\`\`python
def search(query: str, category: str = None):
    expanded_terms = set()
    for term in query.split():
        # Get global + category-specific synonyms
        synonyms = synonym_manager.get_synonyms(term, category)
        expanded_terms.update(synonyms)

    # Search with category filter
    return search_index.query(expanded_terms, category=category)
\`\`\`

**Example:**
\`\`\`python
# Global synonym
manager.add_synonym("TV", "television")

# Electronics-specific
manager.add_synonym("adapter", "charger", domain="electronics")
manager.add_synonym("adapter", "power supply", domain="electronics")

# Books-specific
manager.add_synonym("adapter", "screenwriter", domain="books")

# Query "adapter" in electronics
→ {"adapter", "charger", "power supply", "TV", "television"}
   (global + electronics)

# Query "adapter" in books
→ {"adapter", "screenwriter", "TV", "television"}
   (global + books, NOT charger!)
\`\`\``,

  whyItMatters: 'Domain-specific synonyms prevent false matches across categories and dramatically improve precision.',

  famousIncident: {
    title: 'Amazon Category-Specific Synonyms',
    company: 'Amazon',
    year: '2010',
    whatHappened: 'Amazon implemented category-scoped synonym expansion after global synonyms caused precision issues. Example: "mouse" in electronics meant computer mouse, but in pet supplies meant pet mouse. Category-specific synonyms improved precision 25%.',
    lessonLearned: 'Context matters for synonyms. Domain-specific dictionaries are essential for multi-category search.',
    icon: '🛍️',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Supporting 1M+ merchants across all product categories',
    howTheyDoIt: 'Maintains category-specific synonym dictionaries for top 50 categories. Merchants can add store-specific synonyms on top of global ones.',
  },

  keyPoints: [
    'Synonyms are context-dependent across domains',
    'Maintain global + domain-specific dictionaries',
    'Combine global and category synonyms at query time',
    'Dramatically improves precision in multi-category search',
  ],

  diagram: `
DOMAIN-SPECIFIC SYNONYM LOOKUP:

Query: "adapter" in category "electronics"

       ┌─────────────────┐
       │ Global Synonyms │
       │ TV=television   │
       └────────┬────────┘
                │
                ├──────────────────┐
                ▼                  ▼
       ┌─────────────────┐  ┌──────────────┐
       │ Electronics     │  │ Books        │
       │ adapter=charger │  │ adapter=     │
       │ adapter=power   │  │  screenwriter│
       └────────┬────────┘  └──────────────┘
                │
                ▼
       Merged: {adapter, charger, power, TV, television}
`,

  quickCheck: {
    question: 'Why not just create separate synonym dictionaries per category instead of merging global + category?',
    options: [
      'Merging is faster',
      'Global synonyms (TV=television) apply everywhere; category synonyms add specificity',
      'Databases can\'t handle multiple dictionaries',
      'Merging uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Global synonyms like "TV"="television" apply to all categories. Category-specific synonyms add domain knowledge on top. Best of both worlds.',
  },

  keyConcepts: [
    { title: 'Domain-Specific', explanation: 'Different synonym sets per category', icon: '🏷️' },
    { title: 'Global Synonyms', explanation: 'Apply across all domains', icon: '🌍' },
    { title: 'Context', explanation: 'Meaning depends on domain', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'synonym-search-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-4: Domain-specific synonym support',
    taskDescription: 'Implement category-scoped synonym dictionaries',
    componentsNeeded: [
      { type: 'app_server', reason: 'Add domain-aware synonym logic', displayName: 'App Server' },
      { type: 'database', reason: 'Store category in synonym table', displayName: 'Database' },
    ],
    successCriteria: [
      'Update database schema to include category',
      'Implement DomainSynonymManager class',
      'Merge global + category-specific synonyms',
      'Test category isolation',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add category support to synonym manager and database',
    level2: 'Implement DomainSynonymManager with global + domain graphs, add category column to DB',
    solutionComponents: [{ type: 'app_server' }, { type: 'database' }],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const synonymSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'synonym-search-guided',
  problemTitle: 'Build Synonym Search - Query Expansion & Domain-Specific Mapping',

  requirementsPhase: synonymSearchRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Search Without Synonyms',
      type: 'functional',
      requirement: 'FR-0',
      description: 'Baseline exact search works correctly',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Basic Synonym Expansion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Query expansion with simple synonym dictionary',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minRecall: 0.85 },
    },
    {
      name: 'Bidirectional Synonyms',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Bidirectional and unidirectional synonym support',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minPrecision: 0.90 },
    },
    {
      name: 'Query-Time Expansion',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Synonym graphs with transitive relationships',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minRecall: 0.90 },
    },
    {
      name: 'Domain-Specific Synonyms',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Category-scoped synonym dictionaries prevent cross-domain pollution',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minPrecision: 0.92 },
    },
    {
      name: 'NFR-P1: Search Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'P99 latency under 200ms with synonym expansion at 10K QPS',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Peak Traffic',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 50K QPS with synonym expansion during peak events',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 300, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getSynonymSearchGuidedTutorial(): GuidedTutorial {
  return synonymSearchGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = synonymSearchRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= synonymSearchRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
