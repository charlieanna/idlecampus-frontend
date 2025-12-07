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
 * Fuzzy Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching fuzzy search and approximate string matching.
 * Focus: Levenshtein distance, n-grams, phonetic matching, typo tolerance
 *
 * Key Concepts:
 * - Levenshtein distance (edit distance)
 * - N-gram tokenization and matching
 * - Phonetic algorithms (Soundex, Metaphone)
 * - Typo tolerance and autocorrect
 * - Performance optimization for fuzzy search
 *
 * Flow:
 * Step 0: Requirements gathering
 * Steps 1-2: Build exact search (baseline)
 * Steps 3-4: Add fuzzy matching (Levenshtein + n-grams)
 * Steps 5-6: Add phonetic matching and typo correction
 * Steps 7-8: Optimize for scale and performance
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const fuzzySearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a fuzzy search system for an e-commerce product catalog",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Search Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-search',
      category: 'functional',
      question: "What should users be able to search for, and what should they get back?",
      answer: "Users search for products by typing queries like 'iphone 15' or 'nike running shoes'. The system should return relevant products even if the query has typos like 'ipone 15' or 'nike runing shose'. It should handle misspellings, transpositions, and phonetic variations.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Fuzzy search is about finding results despite imperfect input - the core value proposition",
    },
    {
      id: 'typo-tolerance',
      category: 'functional',
      question: "How many typos should the system tolerate?",
      answer: "The system should handle 1-2 character errors per word. For example, 'labtop' → 'laptop', 'colgate toothpste' → 'colgate toothpaste'. This covers 95% of real-world typos.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Levenshtein distance measures character edits needed - insertions, deletions, substitutions",
    },
    {
      id: 'phonetic-matching',
      category: 'functional',
      question: "Should the search work with sound-alike words?",
      answer: "Yes! If someone searches 'fone case', they should find 'phone case'. Many users spell phonetically, especially for brands they've only heard spoken: 'adeedas' → 'adidas', 'samsung galxy' → 'samsung galaxy'.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Phonetic algorithms like Soundex/Metaphone encode words by sound, not spelling",
    },

    // IMPORTANT - Clarifications
    {
      id: 'ranking',
      category: 'clarification',
      question: "How should results be ranked when multiple fuzzy matches exist?",
      answer: "Rank by relevance score: exact matches first, then 1-character edits, then 2-character edits, then phonetic matches. Within each tier, rank by popularity or product sales.",
      importance: 'important',
      insight: "Fuzzy search must balance matching flexibility with result quality",
    },
    {
      id: 'partial-matches',
      category: 'clarification',
      question: "Should the system handle partial word matches?",
      answer: "Yes. 'sony headph' should match 'sony headphones'. This requires prefix matching and n-gram analysis for partial word matching.",
      importance: 'important',
      insight: "N-grams enable partial matching and are essential for autocomplete",
    },
    {
      id: 'multilingual',
      category: 'clarification',
      question: "Do we need to support multiple languages?",
      answer: "Not for MVP. Start with English. Multi-language adds complexity (accents, character sets, language-specific phonetics). Defer to v2.",
      importance: 'nice-to-have',
      insight: "Different languages need different phonetic algorithms and edit distance rules",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many products are in the catalog?",
      answer: "10 million products initially, growing to 100 million",
      importance: 'critical',
      learningPoint: "Index size affects fuzzy matching algorithm choice - some don't scale",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "Peak of 50,000 queries/second during sales events",
      importance: 'critical',
      calculation: {
        formula: "50K QPS with fuzzy matching on 10M products",
        result: "Need pre-computed indexes + caching",
      },
      learningPoint: "Real-time fuzzy matching at scale requires specialized data structures",
    },

    // LATENCY
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 under 200ms. Users expect instant results as they type (autocomplete).",
      importance: 'critical',
      learningPoint: "Fuzzy search is computationally expensive - must optimize heavily",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How fresh must the search index be when products are added?",
      answer: "New products should be searchable within 1 minute. Acceptable to use async indexing.",
      importance: 'important',
      insight: "Separate read path (fast fuzzy search) from write path (index building)",
    },

    // ACCURACY
    {
      id: 'accuracy-precision',
      category: 'accuracy',
      question: "What precision is acceptable? Can we return some irrelevant results?",
      answer: "For typo tolerance: 95%+ precision. Users tolerate 1-2 irrelevant results per page if we catch their typos. For phonetic matching: 85%+ precision is acceptable - harder problem.",
      importance: 'important',
      learningPoint: "Fuzzy search is a precision/recall tradeoff - tune thresholds carefully",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'typo-tolerance', 'phonetic-matching'],
  criticalFRQuestionIds: ['core-search', 'typo-tolerance', 'phonetic-matching'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-search', 'accuracy-precision'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Fuzzy matching with typo tolerance',
      description: 'Search finds results despite 1-2 character errors per word',
      emoji: '🔤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Phonetic matching',
      description: 'Search finds sound-alike words (fone → phone)',
      emoji: '🔊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Partial word matching',
      description: 'Search works with incomplete words (headph → headphones)',
      emoji: '✂️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million searchers/day',
    writesPerDay: '10K new products/day',
    readsPerDay: '500 million searches/day',
    peakMultiplier: 3,
    readWriteRatio: '50000:1',
    calculatedWriteRPS: { average: 1, peak: 3 },
    calculatedReadRPS: { average: 5787, peak: 50000 },
    maxPayloadSize: '~500 bytes per query',
    storagePerRecord: '~2KB per product (with n-gram indexes)',
    storageGrowthPerYear: '~7GB (new products)',
    redirectLatencySLA: 'p99 < 200ms',
    createLatencySLA: 'async indexing < 1 minute',
  },

  architecturalImplications: [
    '✅ 10M products → Need specialized index (inverted index + n-grams)',
    '✅ 50K QPS → Must cache popular queries',
    '✅ p99 < 200ms → Pre-compute edit distance structures',
    '✅ Typo tolerance → Levenshtein automaton or BK-tree',
    '✅ Phonetic matching → Pre-compute Soundex/Metaphone codes',
    '✅ Partial matching → N-gram tokenization (bigrams/trigrams)',
  ],

  outOfScope: [
    'Multi-language support',
    'Image-based search',
    'Natural language queries',
    'Personalized ranking (use generic popularity)',
    'Voice search',
  ],

  keyInsight: "First, let's make it WORK. We'll build exact search with a database, then progressively add fuzzy matching capabilities. Start simple, then layer in complexity: Levenshtein distance → n-grams → phonetic matching → optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Basic Exact Search
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "You're building a product search for an e-commerce site with 10,000 products.",
  hook: "A user types 'laptop' and expects to see laptops. Easy, right?",
  challenge: "Build a basic exact search: Client → App Server → Database. No fuzzy matching yet.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your exact search works!",
  achievement: "Users can search for products by exact name",
  metrics: [
    { label: 'Search type', after: 'Exact match' },
    { label: 'Latency', after: '<50ms' },
  ],
  nextTeaser: "But users keep misspelling words...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Baseline: Exact Search with SQL',
  conceptExplanation: `Before we get to fuzzy search, let's build exact search as a baseline.

**SQL exact search:**
\`\`\`sql
SELECT * FROM products
WHERE name LIKE '%laptop%'
ORDER BY popularity DESC
LIMIT 20;
\`\`\`

This works great when users type perfectly. But real users make mistakes:
- Typos: 'labtop' instead of 'laptop'
- Misspellings: 'ipone' instead of 'iphone'
- Phonetic errors: 'fone case' instead of 'phone case'

SQL LIKE doesn't handle these. We need fuzzy matching!`,

  whyItMatters: 'Exact search is fast and simple, but fails on 20-30% of real queries due to typos. This directly impacts conversion rates.',

  keyPoints: [
    'SQL LIKE provides exact substring matching',
    'Fast for exact matches (with proper indexes)',
    'Zero tolerance for typos or variations',
    'Baseline: we\'ll improve this with fuzzy algorithms',
  ],

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────┐
│ Client │────▶│ App Server  │────▶│ Database │
└────────┘     └─────────────┘     └──────────┘
                     │
                     ▼
            SELECT * FROM products
            WHERE name LIKE '%query%'
`,

  keyConcepts: [
    { title: 'Exact Match', explanation: 'String must match character-by-character', icon: '🎯' },
    { title: 'SQL LIKE', explanation: 'Pattern matching with wildcards', icon: '🔍' },
  ],
};

const step1: GuidedStep = {
  id: 'fuzzy-search-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Setting up foundation for search',
    taskDescription: 'Add Client, App Server, and Database with basic connections',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search queries', displayName: 'App Server' },
      { type: 'database', reason: 'Stores product catalog', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send search queries' },
      { from: 'App Server', to: 'Database', reason: 'Server queries product data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the basic search path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Search API with Python
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected but doesn't know how to search!",
  hook: "Users get empty results even when products exist. We need to implement the search logic.",
  challenge: "Write Python code to handle search requests and query the database.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Search is working!",
  achievement: "You implemented exact search with SQL",
  metrics: [
    { label: 'API endpoints', after: '1' },
    { label: 'Search accuracy', after: '100% (exact)' },
  ],
  nextTeaser: "But 25% of searches return zero results due to typos...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Implementing Search Logic',
  conceptExplanation: `Your search API needs to:

1. **Receive query**: GET /api/v1/search?q=laptop
2. **Query database**: \`SELECT * FROM products WHERE name LIKE '%laptop%'\`
3. **Return results**: JSON array of matching products

**Python implementation:**
\`\`\`python
def search(query: str) -> List[Product]:
    # Exact match - no fuzzy logic yet
    sql = "SELECT * FROM products WHERE name LIKE %s"
    results = db.execute(sql, f'%{query}%')
    return results
\`\`\`

This works for exact matches. Next step: add fuzzy matching!`,

  whyItMatters: 'The search API is the foundation. We\'ll enhance it with fuzzy algorithms in later steps.',

  keyPoints: [
    'GET endpoint for search queries',
    'SQL LIKE for substring matching',
    'Return ranked results (by popularity)',
    'Handle empty queries gracefully',
  ],

  quickCheck: {
    question: 'What happens when a user searches for "labtop" with exact matching?',
    options: [
      'Returns laptop products',
      'Returns zero results (no exact match)',
      'Returns an error',
      'Auto-corrects to "laptop"',
    ],
    correctIndex: 1,
    explanation: 'Exact matching requires character-by-character match. "labtop" ≠ "laptop", so no results.',
  },

  keyConcepts: [
    { title: 'Search API', explanation: 'HTTP endpoint for queries', icon: '🔌' },
    { title: 'SQL Query', explanation: 'Database lookup for products', icon: '🗄️' },
  ],
};

const step2: GuidedStep = {
  id: 'fuzzy-search-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-0: Basic exact search',
    taskDescription: 'Configure search API and implement Python handler',
    componentsNeeded: [
      { type: 'app_server', reason: 'Configure search endpoint', displayName: 'App Server' },
    ],
    successCriteria: [
      'Click App Server → Assign GET /api/v1/search API',
      'Open Python tab → Implement search() function',
    ],
  },
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
    level1: 'Configure the search API, then implement the Python handler',
    level2: 'Assign GET /api/v1/search, then in Python tab implement search logic using SQL LIKE',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Levenshtein Distance for Typo Tolerance
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📏',
  scenario: "Analytics show 25% of searches return zero results, but the products exist!",
  hook: "Users are typing 'ipone 15' but we have 'iphone 15'. They're just one letter off!",
  challenge: "Add Levenshtein distance to measure how close two strings are and tolerate 1-2 character errors.",
  illustration: 'typo-error',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Typo tolerance enabled!",
  achievement: "Search now handles 1-2 character errors per word",
  metrics: [
    { label: 'Zero-result searches', before: '25%', after: '8%' },
    { label: 'User satisfaction', before: '70%', after: '92%' },
  ],
  nextTeaser: "But what about partial words like 'headph'?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Levenshtein Distance: Measuring String Similarity',
  conceptExplanation: `**Levenshtein distance** counts the minimum character edits needed to transform one string into another.

Three types of edits:
1. **Insertion**: 'pone' → 'phone' (add 'h')
2. **Deletion**: 'phonne' → 'phone' (remove 'n')
3. **Substitution**: 'fone' → 'phone' (replace 'f' with 'ph')

**Example:**
- 'ipone' → 'iphone': distance = 1 (insert 'h')
- 'labtop' → 'laptop': distance = 1 (substitute 'b' with 'p')
- 'adeedas' → 'adidas': distance = 2

**Algorithm (dynamic programming):**
\`\`\`python
def levenshtein(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # deletion
                    dp[i][j-1],    # insertion
                    dp[i-1][j-1]   # substitution
                )
    return dp[m][n]
\`\`\`

**For search:**
Accept matches with distance ≤ 2 for words with 6+ characters.`,

  whyItMatters: 'Levenshtein distance is the gold standard for typo tolerance. Catching misspellings dramatically improves user experience.',

  famousIncident: {
    title: 'Google "Did You Mean" Feature',
    company: 'Google',
    year: '2008',
    whatHappened: 'Google introduced "Did you mean" using edit distance algorithms. Within months, it was handling billions of typos daily and became one of their most valuable features for user satisfaction.',
    lessonLearned: 'Fuzzy matching is not optional for search - users expect it. Levenshtein is foundational.',
    icon: '🔤',
  },

  keyPoints: [
    'Levenshtein distance counts minimum edits (insert/delete/substitute)',
    'O(m×n) time complexity - can be slow for large strings',
    'Threshold: accept distance ≤ 2 for most words',
    'Must compute for EVERY product - optimization needed',
  ],

  diagram: `
Query: "ipone 15"

Database Products:
┌──────────────┬──────────┬────────┐
│ Product      │ Distance │ Match? │
├──────────────┼──────────┼────────┤
│ iphone 15    │    1     │   ✓    │
│ ipad 15      │    3     │   ✗    │
│ ipod nano    │    4     │   ✗    │
└──────────────┴──────────┴────────┘

Accept distance ≤ 2 → Return "iphone 15"
`,

  quickCheck: {
    question: 'What is the Levenshtein distance from "fone" to "phone"?',
    options: [
      '1 (substitute f→p)',
      '2 (insert p, substitute f→h)',
      '1 (insert h)',
      '3 (delete f, insert p, insert h)',
    ],
    correctIndex: 1,
    explanation: 'Need to insert "p" at start and substitute "f"→"h": 2 operations.',
  },

  keyConcepts: [
    { title: 'Edit Distance', explanation: 'Minimum edits to transform strings', icon: '📏' },
    { title: 'Dynamic Programming', explanation: 'Efficient algorithm for edit distance', icon: '🧮' },
    { title: 'Threshold', explanation: 'Maximum distance to accept as match', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'fuzzy-search-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Typo tolerance with Levenshtein distance',
    taskDescription: 'Enhance search algorithm with edit distance calculation',
    componentsNeeded: [
      { type: 'app_server', reason: 'Update search logic with Levenshtein', displayName: 'App Server' },
    ],
    successCriteria: [
      'Open Python tab in App Server',
      'Implement levenshtein_distance() function',
      'Update search() to accept matches with distance ≤ 2',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Implement Levenshtein distance and use it to filter results',
    level2: 'Add the DP algorithm, then filter products where distance ≤ 2 from query',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add N-Grams for Partial Matching
// =============================================================================

const step4Story: StoryContent = {
  emoji: '✂️',
  scenario: "Users type 'sony headph' expecting autocomplete to work.",
  hook: "They haven't finished typing! Levenshtein won't help with incomplete words.",
  challenge: "Add n-gram indexing to match partial words and enable autocomplete.",
  illustration: 'autocomplete',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Partial matching works!",
  achievement: "Search handles incomplete words with n-grams",
  metrics: [
    { label: 'Autocomplete support', after: '✓' },
    { label: 'Partial match accuracy', after: '94%' },
  ],
  nextTeaser: "But what about sound-alike words?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'N-Grams: Breaking Words into Pieces',
  conceptExplanation: `**N-grams** split text into overlapping sequences of N characters.

**Example: "headphones"**
- **Bigrams (n=2)**: he, ea, ad, dp, ph, ho, on, ne, es
- **Trigrams (n=3)**: hea, ead, adp, dph, pho, hon, one, nes

**Why this helps:**
Query "headph" generates bigrams: he, ea, ad, dp, ph
Product "headphones" bigrams: he, ea, ad, dp, ph, ho, on, ne, es

Match score = (common bigrams) / (total bigrams) = 5/9 = 56%

If similarity > 50%, it's a match!

**Implementation:**
\`\`\`python
def get_bigrams(text: str) -> Set[str]:
    return {text[i:i+2] for i in range(len(text) - 1)}

def ngram_similarity(s1: str, s2: str) -> float:
    bg1, bg2 = get_bigrams(s1), get_bigrams(s2)
    common = len(bg1 & bg2)
    total = len(bg1 | bg2)
    return common / total if total > 0 else 0.0
\`\`\`

**For search:**
- Pre-compute bigrams for all products
- At query time, compute query bigrams
- Find products with similarity > 0.5`,

  whyItMatters: 'N-grams enable autocomplete and partial matching - critical for modern search UX.',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Powers autocomplete for Uber, Netflix, GitHub',
    howTheyDoIt: 'Uses n-gram tokenizers (edge n-grams) for prefix matching. Pre-indexes all n-grams for instant autocomplete.',
  },

  famousIncident: {
    title: 'Google Instant Search',
    company: 'Google',
    year: '2010',
    whatHappened: 'Google launched Instant Search showing results as you type. Required n-gram indexes to handle partial queries at scale. Reduced search time by 2-5 seconds per query.',
    lessonLearned: 'N-grams are essential for autocomplete. Pre-compute indexes for speed.',
    icon: '⚡',
  },

  keyPoints: [
    'N-grams split text into overlapping character sequences',
    'Bigrams (n=2) and trigrams (n=3) most common',
    'Similarity = (shared n-grams) / (total n-grams)',
    'Must pre-compute and store n-gram indexes',
  ],

  diagram: `
Query: "headph"
Bigrams: [he, ea, ad, dp, ph]

Product: "sony headphones"
Bigrams: [so, on, ny, he, ea, ad, dp, ph, ho, on, ne, es]

Common: {he, ea, ad, dp, ph} = 5 bigrams
Total: 12 unique bigrams
Similarity: 5/12 = 42% → Likely not a match

Product: "headphones"
Bigrams: [he, ea, ad, dp, ph, ho, on, ne, es]

Common: {he, ea, ad, dp, ph} = 5 bigrams
Total: 9 unique bigrams
Similarity: 5/9 = 56% → MATCH!
`,

  quickCheck: {
    question: 'Why are n-grams better than Levenshtein for partial word matching?',
    options: [
      'N-grams are faster to compute',
      'N-grams can match incomplete words; Levenshtein requires full words',
      'N-grams are more accurate',
      'N-grams use less memory',
    ],
    correctIndex: 1,
    explanation: 'Levenshtein compares full strings. N-grams work with any fragments, perfect for autocomplete.',
  },

  keyConcepts: [
    { title: 'N-gram', explanation: 'Sequence of N consecutive characters', icon: '🔤' },
    { title: 'Bigram', explanation: '2-character sequence (most common)', icon: '✌️' },
    { title: 'Jaccard Similarity', explanation: 'Shared items / total items', icon: '📊' },
  ],
};

const step4: GuidedStep = {
  id: 'fuzzy-search-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-3: Partial word matching with n-grams',
    taskDescription: 'Add n-gram index to database and update search logic',
    componentsNeeded: [
      { type: 'database', reason: 'Store n-gram indexes', displayName: 'Database' },
      { type: 'app_server', reason: 'Implement n-gram matching', displayName: 'App Server' },
    ],
    successCriteria: [
      'Update database schema to store n-grams per product',
      'Implement get_bigrams() and ngram_similarity()',
      'Update search to rank by n-gram similarity',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add n-gram computation and similarity matching to your search',
    level2: 'Pre-compute bigrams for products, compare with query bigrams, rank by similarity',
    solutionComponents: [{ type: 'database' }, { type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Phonetic Matching (Soundex/Metaphone)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔊',
  scenario: "A user searches for 'fone case' but we only have 'phone case'.",
  hook: "They spelled it phonetically! Levenshtein distance is 2, but they sound identical.",
  challenge: "Add phonetic algorithm (Soundex or Metaphone) to match sound-alike words.",
  illustration: 'sound-waves',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎵',
  message: "Phonetic matching works!",
  achievement: "Search finds sound-alike products",
  metrics: [
    { label: 'Phonetic matches', after: '✓' },
    { label: 'Coverage increase', after: '+12%' },
  ],
  nextTeaser: "But the search is getting slow with 10M products...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Phonetic Algorithms: Matching by Sound',
  conceptExplanation: `Phonetic algorithms encode words by pronunciation, not spelling.

**Soundex Algorithm:**
Converts words to 4-character codes based on sound:

1. Keep first letter
2. Replace consonants with digits based on sound:
   - B,F,P,V → 1
   - C,G,J,K,Q,S,X,Z → 2
   - D,T → 3
   - L → 4
   - M,N → 5
   - R → 6
3. Remove vowels (A,E,I,O,U)
4. Collapse repeated digits
5. Pad/truncate to 4 chars

**Examples:**
- "phone" → P-5 (P, h=remove, o=remove, n=5, e=remove) → P500
- "fone" → F-5 (F, o=remove, n=5, e=remove) → F500
- "Smith" → S-5-3 (S, m=5, i=remove, t=3, h=remove) → S530
- "Smythe" → S-5-3 → S530

**Metaphone (better):**
More sophisticated than Soundex, handles English phonetics better:
- "phone" → FN
- "fone" → FN
- "photo" → FT (different!)

**Implementation:**
\`\`\`python
def soundex(word: str) -> str:
    word = word.upper()
    soundex_code = word[0]

    # Soundex digit mapping
    mapping = {
        'BFPV': '1', 'CGJKQSXZ': '2', 'DT': '3',
        'L': '4', 'MN': '5', 'R': '6'
    }

    for char in word[1:]:
        for key, val in mapping.items():
            if char in key:
                if val != soundex_code[-1]:
                    soundex_code += val

    return (soundex_code + '000')[:4]
\`\`\`

**For search:**
Pre-compute Soundex codes for all products, match query code.`,

  whyItMatters: 'Users often spell words phonetically, especially brand names they\'ve only heard spoken. Phonetic matching catches these.',

  famousIncident: {
    title: 'Ellis Island Immigration Records',
    company: 'US Immigration',
    year: '1890s-1954',
    whatHappened: 'Soundex was originally developed for indexing census data. Immigration officers spelled names phonetically, creating millions of variations. Soundex helped reunite families by finding records despite spelling differences.',
    lessonLearned: 'Phonetic algorithms solve real human problems - people remember sounds, not spellings.',
    icon: '🗽',
  },

  realWorldExample: {
    company: 'Ancestry.com',
    scenario: 'Searching historical records with variant spellings',
    howTheyDoIt: 'Uses Soundex + Metaphone to match names like "Smith" and "Smythe", "Johnson" and "Jonson".',
  },

  keyPoints: [
    'Soundex: Classic algorithm, 4-character codes',
    'Metaphone: More sophisticated, better for English',
    'Pre-compute codes for all products',
    'Match when soundex(query) == soundex(product)',
    'Lower precision than Levenshtein - use as fallback',
  ],

  diagram: `
Query: "fone case"
Soundex: "fone" → F500, "case" → C200

Products:
┌───────────────┬──────────┬─────────┐
│ Product       │ Soundex  │ Match?  │
├───────────────┼──────────┼─────────┤
│ phone case    │ P500 C200│   ✓     │
│ foam case     │ F500 C200│   ✓ (!) │
│ cone base     │ C500 B200│   ✗     │
└───────────────┴──────────┴─────────┘

Note: "foam" matches too! Precision tradeoff.
Rank phonetic matches lower than exact/Levenshtein.
`,

  quickCheck: {
    question: 'Why does Soundex match "phone" and "fone" but not "photo"?',
    options: [
      'photo has more letters',
      'The "o" vs "one" ending creates different codes',
      'ph→F, f→F are same, but t in photo creates different code',
      'Soundex can\'t handle "ph"',
    ],
    correctIndex: 2,
    explanation: 'phone→P500, fone→F500 (first letters differ but sound same). photo→P300 (t→3, different code).',
  },

  keyConcepts: [
    { title: 'Soundex', explanation: '4-char phonetic code (1918 algorithm)', icon: '🔤' },
    { title: 'Metaphone', explanation: 'Modern phonetic algorithm (1990)', icon: '🎵' },
    { title: 'Phonetic Encoding', explanation: 'Convert spelling to sound', icon: '🔊' },
  ],
};

const step5: GuidedStep = {
  id: 'fuzzy-search-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-2: Phonetic matching for sound-alike words',
    taskDescription: 'Implement Soundex/Metaphone and add to search ranking',
    componentsNeeded: [
      { type: 'database', reason: 'Store phonetic codes', displayName: 'Database' },
      { type: 'app_server', reason: 'Implement phonetic matching', displayName: 'App Server' },
    ],
    successCriteria: [
      'Implement soundex() or metaphone()',
      'Pre-compute codes for products in database',
      'Add phonetic matching to search (rank below Levenshtein)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add Soundex encoding and use it as a fallback matching strategy',
    level2: 'Compute Soundex for query and products, match codes, rank phonetic lower than typo matches',
    solutionComponents: [{ type: 'database' }, { type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Search Index (Elasticsearch or specialized search)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📚',
  scenario: "Your catalog grew to 10 million products. Search takes 5 seconds!",
  hook: "Computing Levenshtein and n-grams for 10M products PER QUERY is killing performance.",
  challenge: "Add a specialized search index (Elasticsearch) to pre-compute fuzzy matching structures.",
  illustration: 'slow-database',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Search is blazing fast!",
  achievement: "Specialized index handles fuzzy matching at scale",
  metrics: [
    { label: 'Search latency', before: '5000ms', after: '150ms' },
    { label: 'Products indexed', after: '10M' },
  ],
  nextTeaser: "But popular queries still hit the index repeatedly...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Specialized Search Indexes: The Key to Scale',
  conceptExplanation: `SQL databases aren't optimized for fuzzy search at scale. We need specialized indexes.

**Elasticsearch/Solr provide:**
1. **Inverted index**: Maps terms → documents (products)
2. **N-gram tokenizers**: Pre-compute all n-grams
3. **Phonetic plugins**: Soundex/Metaphone filters
4. **Fuzzy query support**: Built-in Levenshtein matching
5. **Fast ranking**: BM25 algorithm for relevance

**Architecture:**
- PostgreSQL: Source of truth (products, prices, inventory)
- Elasticsearch: Search index (optimized for fuzzy matching)
- Sync: Products written to both systems

**Elasticsearch Fuzzy Query:**
\`\`\`json
{
  "query": {
    "multi_match": {
      "query": "ipone 15",
      "fields": ["name", "description"],
      "fuzziness": "AUTO"
    }
  }
}
\`\`\`

**Why it's fast:**
- Pre-computed inverted index
- Levenshtein automaton (faster than DP)
- N-grams stored at index time
- Distributed: shards across nodes`,

  whyItMatters: 'At 10M products and 50K QPS, computing fuzzy matches in real-time is impossible. Pre-computation is essential.',

  famousIncident: {
    title: 'Amazon Search Overhaul',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon migrated from SQL-based search to Elasticsearch. Search speed improved 10x, fuzzy matching quality improved dramatically. Contributed to significant revenue increase.',
    lessonLearned: 'Specialized search indexes are not optional at scale. Elasticsearch/Solr are industry standard.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'City/address autocomplete with fuzzy matching',
    howTheyDoIt: 'Uses Elasticsearch with n-gram tokenizers. Handles misspellings and autocomplete for 10K+ cities globally.',
  },

  keyPoints: [
    'Elasticsearch pre-computes fuzzy matching structures',
    'Inverted index maps terms to products',
    'Built-in support for fuzziness, n-grams, phonetic matching',
    'Distributed architecture scales to billions of documents',
    'Keep SQL as source of truth, Elasticsearch for search only',
  ],

  diagram: `
Write Path:
┌─────────────┐
│ New Product │
└──────┬──────┘
       │
       ├──────▶ PostgreSQL (source of truth)
       │
       └──────▶ Elasticsearch (search index)
                 - Tokenize: bigrams, trigrams
                 - Compute: Soundex codes
                 - Build: inverted index

Read Path:
┌────────┐      ┌─────────────┐      ┌─────────────────┐
│ Client │─────▶│ App Server  │─────▶│ Elasticsearch   │
└────────┘      └─────────────┘      │ Fuzzy Query     │
                                     │ 150ms response  │
                                     └─────────────────┘
`,

  quickCheck: {
    question: 'Why use Elasticsearch instead of computing fuzzy matches in PostgreSQL?',
    options: [
      'Elasticsearch is cheaper',
      'Elasticsearch pre-computes fuzzy structures at index time for fast queries',
      'PostgreSQL can\'t do fuzzy matching',
      'Elasticsearch has better security',
    ],
    correctIndex: 1,
    explanation: 'Elasticsearch builds specialized indexes (inverted index, n-grams) at write time, making fuzzy queries fast. SQL would compute on every query.',
  },

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Maps terms to documents', icon: '📇' },
    { title: 'Elasticsearch', explanation: 'Specialized search engine', icon: '🔍' },
    { title: 'Fuzziness', explanation: 'Built-in edit distance support', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'fuzzy-search-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'All FRs now need to scale to 10M products',
    taskDescription: 'Add Elasticsearch search index for fast fuzzy matching',
    componentsNeeded: [
      { type: 'search_index', reason: 'Specialized search with fuzzy matching', displayName: 'Elasticsearch' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Search Index', reason: 'Query fuzzy index' },
      { from: 'App Server', to: 'Database', reason: 'Still need source of truth' },
    ],
    successCriteria: [
      'Add Search Index (Elasticsearch) component',
      'Connect App Server to Search Index',
      'Keep Database connection (source of truth)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },
  hints: {
    level1: 'Add a specialized Search Index component connected to App Server',
    level2: 'Add Search Index (Elasticsearch), connect from App Server. Keep database for data writes.',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 7: Add Cache for Popular Queries
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Analytics show 10% of queries account for 60% of traffic!",
  hook: "'iphone 15' is searched 10,000 times per minute. Why recompute it every time?",
  challenge: "Add Redis cache to store popular search results.",
  illustration: 'cache-hit',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Cache hit rate: 65%!",
  achievement: "Popular searches return instantly from cache",
  metrics: [
    { label: 'P99 latency', before: '150ms', after: '12ms' },
    { label: 'Elasticsearch load', before: '100%', after: '35%' },
  ],
  nextTeaser: "Time to handle peak traffic with load balancing...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Search Results',
  conceptExplanation: `Search queries follow a power-law distribution: a few queries are VERY popular.

**Cache strategy:**
1. Check Redis: cache.get(query_hash)
2. If hit: return cached results (2ms)
3. If miss: query Elasticsearch (150ms), cache result

**What to cache:**
- Query → Top 20 results
- TTL: 5-15 minutes (products change)
- Key: hash(query + filters + page)

**Cache key example:**
\`\`\`python
def get_cache_key(query: str, filters: dict, page: int) -> str:
    key_str = f"{query}:{json.dumps(filters)}:{page}"
    return hashlib.md5(key_str.encode()).hexdigest()
\`\`\`

**Invalidation:**
When product is updated/deleted, invalidate affected queries or use TTL expiry.

**Why it works:**
Top 10% of queries = 60% of traffic
Cache hit = 10x faster, 10x less Elasticsearch load`,

  whyItMatters: 'At 50K QPS, even a 50% cache hit rate cuts Elasticsearch load in half and speeds up most searches.',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Search for popular terms like "wedding dress"',
    howTheyDoIt: 'Caches top search queries in Redis. 70%+ cache hit rate. Serves most searches in <10ms.',
  },

  keyPoints: [
    'Cache popular queries (power-law distribution)',
    'Key: hash of query + filters + pagination',
    'TTL: 5-15 minutes (balance freshness vs hits)',
    'Invalidate on product updates or rely on TTL',
  ],

  diagram: `
┌────────┐     ┌─────────────┐
│ Client │────▶│ App Server  │
└────────┘     └──────┬──────┘
                      │
                      ▼
               Check Cache (Redis)
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼ HIT (65%)            ▼ MISS (35%)
    Return cached          Query Elasticsearch
    results (2ms)          └──▶ Cache result
                                └──▶ Return (150ms)
`,

  quickCheck: {
    question: 'Why not cache ALL search queries forever?',
    options: [
      'Too expensive',
      'Products change - stale results are bad UX',
      'Cache would be too large',
      'Redis can\'t handle it',
    ],
    correctIndex: 1,
    explanation: 'Product prices, inventory, and catalog change. Cached results must expire (TTL) or invalidate when products update.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Query found in cache', icon: '✅' },
    { title: 'TTL', explanation: 'Cache expiration time', icon: '⏰' },
    { title: 'Power Law', explanation: 'Few queries are very popular', icon: '📊' },
  ],
};

const step7: GuidedStep = {
  id: 'fuzzy-search-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'All FRs benefit from caching popular queries',
    taskDescription: 'Add Redis cache for search results',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache popular search queries', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Check cache before search index' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect App Server to Cache',
      'Configure TTL (300-900 seconds)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add Redis cache between App Server and Search Index',
    level2: 'Add Cache, connect to App Server, set TTL to 300-900 seconds for search results',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer for High Traffic
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📈',
  scenario: "Black Friday! Search traffic just hit 50,000 queries per second!",
  hook: "Your single app server is melting. Users see timeouts.",
  challenge: "Add load balancer and scale to multiple app server instances.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "You built a production-grade fuzzy search system!",
  achievement: "Handles 50K QPS with typo tolerance, n-grams, and phonetic matching",
  metrics: [
    { label: 'Throughput', before: '5K QPS', after: '50K+ QPS' },
    { label: 'P99 latency', before: '500ms', after: '150ms' },
    { label: 'Typo coverage', after: '92%' },
    { label: 'Phonetic coverage', after: '85%' },
  ],
  nextTeaser: "Congratulations! You've mastered fuzzy search system design.",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Fuzzy Search to Production',
  conceptExplanation: `Final architecture review - you've built:

**1. Multiple matching strategies:**
- Exact matching (baseline)
- Levenshtein distance (typo tolerance)
- N-grams (partial matching)
- Phonetic (sound-alike matching)

**2. Optimizations for scale:**
- Elasticsearch: Pre-computed indexes
- Redis Cache: 65%+ hit rate on popular queries
- Load Balancer: Distribute traffic across app servers

**3. Ranking strategy:**
Tier 1: Exact matches (100% confidence)
Tier 2: Levenshtein distance ≤ 1 (95% confidence)
Tier 3: Levenshtein distance = 2 (85% confidence)
Tier 4: N-gram similarity > 0.5 (75% confidence)
Tier 5: Phonetic matches (70% confidence)

Within each tier: rank by product popularity/sales.

**Performance at 50K QPS:**
- 65% cache hits → 2ms response
- 35% Elasticsearch queries → 150ms response
- Multiple app servers handle load
- Elasticsearch sharded across nodes`,

  whyItMatters: 'Fuzzy search is critical for e-commerce. 25% of searches have typos - without fuzzy matching, you lose conversions.',

  famousIncident: {
    title: 'Amazon Typo Patent',
    company: 'Amazon',
    year: '2014',
    whatHappened: 'Amazon patented an advanced typo correction system using machine learning and behavioral data. Estimated to improve search conversions by 3-5%, worth hundreds of millions in revenue.',
    lessonLearned: 'Fuzzy search is a competitive advantage. Companies invest heavily in search quality.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Powering search for 1M+ merchant stores',
    howTheyDoIt: 'Uses Elasticsearch with custom fuzzy matching. Handles typos, synonyms, partial matches. Processes billions of searches/month.',
  },

  keyPoints: [
    'Multiple matching strategies for different error types',
    'Pre-computed indexes essential for scale',
    'Caching popular queries critical for performance',
    'Ranking by confidence tier, then popularity',
    'Load balancing for high throughput',
  ],

  diagram: `
FULL ARCHITECTURE:

┌────────┐     ┌─────────────────┐     ┌─────────────┐
│ Client │────▶│  Load Balancer  │────▶│ App Server 1│
└────────┘     └─────────────────┘     ├─────────────┤
                                       │ App Server 2│
                                       ├─────────────┤
                                       │ App Server 3│
                                       └──────┬──────┘
                                              │
                       ┌──────────────────────┼──────────────┐
                       ▼                      ▼              ▼
                ┌─────────────┐      ┌──────────────┐  ┌──────────┐
                │Redis Cache  │      │Elasticsearch │  │PostgreSQL│
                │(Popular Q)  │      │(Fuzzy Index) │  │(Truth)   │
                └─────────────┘      └──────────────┘  └──────────┘
`,

  quickCheck: {
    question: 'What is the most important optimization for fuzzy search at scale?',
    options: [
      'Faster Levenshtein algorithm',
      'Pre-computed indexes (Elasticsearch) + caching',
      'More app servers',
      'Better ranking algorithm',
    ],
    correctIndex: 1,
    explanation: 'Real-time fuzzy computation on 10M products is impossible. Pre-computed indexes + caching make it feasible.',
  },

  keyConcepts: [
    { title: 'Multi-Strategy', explanation: 'Combine Levenshtein, n-grams, phonetic', icon: '🎯' },
    { title: 'Pre-Computation', explanation: 'Build indexes at write time', icon: '⚡' },
    { title: 'Tiered Ranking', explanation: 'Rank by match confidence', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'fuzzy-search-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'All FRs must handle 50K QPS',
    taskDescription: 'Add load balancer and scale app servers',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Scale to multiple instances', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Distribute to instances' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Configure App Server instances to 3+',
      'All components properly connected',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add Load Balancer and scale App Server to 3+ instances',
    level2: 'Insert Load Balancer between Client and App Server, then set App Server instances to 3+',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const fuzzySearchGuidedTutorial: GuidedTutorial = {
  problemId: 'fuzzy-search-guided',
  problemTitle: 'Build Fuzzy Search - Typo Tolerance & Phonetic Matching',

  requirementsPhase: fuzzySearchRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Exact Search Baseline',
      type: 'functional',
      requirement: 'FR-0',
      description: 'Basic exact search works correctly',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Typo Tolerance (Levenshtein)',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Search finds products despite 1-2 character typos',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minRecall: 0.90 },
    },
    {
      name: 'Phonetic Matching',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Search finds sound-alike products (fone → phone)',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.10, minRecall: 0.85 },
    },
    {
      name: 'Partial Word Matching',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Autocomplete works with partial words using n-grams',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05, minRecall: 0.90 },
    },
    {
      name: 'NFR-P1: Search Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'P99 latency under 200ms at 10K QPS',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Peak Traffic',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 50K QPS during peak events',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 300, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getFuzzySearchGuidedTutorial(): GuidedTutorial {
  return fuzzySearchGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = fuzzySearchRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= fuzzySearchRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
