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
 * Highlight Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching search result highlighting and snippet generation.
 * Focus: HTML encoding, snippet extraction, context windows, vector highlighting
 *
 * Key Concepts:
 * - Search result highlighting with custom tags
 * - Snippet extraction with context windows
 * - HTML encoding and security (XSS prevention)
 * - Fast vector highlighting for performance
 * - Fragment scoring for relevance
 *
 * Flow:
 * Phase 0: Requirements gathering (snippet length, HTML encoding, context)
 * Steps 1-3: Basic search result highlighting
 * Steps 4-6: Fast vector highlighting, fragment scoring, custom tags
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const highlightSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search result highlighting system for displaying search snippets",

  interviewer: {
    name: 'Jordan Chen',
    role: 'Senior Search Infrastructure Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-highlighting',
      category: 'functional',
      question: "What should the highlighting system do when showing search results?",
      answer: "When users search for 'machine learning', we need to show snippets from matching documents with the search terms highlighted. For example:\n\n'...deep learning is a subset of <b>machine learning</b> that uses neural networks...'\n\nThe system should extract relevant snippets from long documents and visually highlight where the search terms appear.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Highlighting helps users quickly see why a document matched their query",
    },
    {
      id: 'snippet-length',
      category: 'functional',
      question: "How long should the snippets be?",
      answer: "Snippets should be 150-300 characters. Long enough to provide context, short enough to scan quickly. We should try to center the snippet around where the search terms appear - show some text before and after the match.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Snippet length balances context with readability - too short loses meaning, too long overwhelms",
    },
    {
      id: 'html-encoding',
      category: 'functional',
      question: "What if the document content contains HTML characters like < or >?",
      answer: "Critical security concern! We must HTML-encode the document content before highlighting to prevent XSS attacks. If a document contains '<script>alert(\"hack\")</script>', we need to escape it to '&lt;script&gt;' before adding our highlight tags. Only OUR highlight tags should be actual HTML.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Never trust user content - always escape HTML to prevent XSS injection",
    },

    // IMPORTANT - Clarifications
    {
      id: 'context-window',
      category: 'clarification',
      question: "If a search term appears multiple times in a document, which occurrence do we show?",
      answer: "Show the 'best' occurrence - the one with the most context or most concentrated matches. For example, if searching 'python tutorial', prefer a snippet where both words appear close together over one where they're far apart. We call this fragment scoring.",
      importance: 'important',
      insight: "Fragment scoring ensures we show the most relevant snippet, not just the first match",
    },
    {
      id: 'custom-tags',
      category: 'clarification',
      question: "Should we always use <b> tags for highlighting, or should it be configurable?",
      answer: "Make it configurable. Different clients want different styles - some use <em>, some use <mark>, some use custom tags like <span class='highlight'>. The highlighting system should accept custom pre/post tags.",
      importance: 'important',
      insight: "Flexible tag configuration makes the system reusable across different UIs",
    },
    {
      id: 'multi-term',
      category: 'clarification',
      question: "How do we handle multi-word queries like 'machine learning tutorial'?",
      answer: "Highlight each term independently. 'machine' gets highlighted, 'learning' gets highlighted, 'tutorial' gets highlighted - even if they appear in different positions. Users should see all their search terms highlighted.",
      importance: 'important',
      insight: "Multi-term highlighting helps users see partial matches",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "10,000 queries per second, with each query potentially matching 100s of documents that need highlighting",
      importance: 'critical',
      calculation: {
        formula: "10K queries/sec × 10 results per query = 100K highlights/sec",
        result: "Need fast highlighting algorithm",
      },
      learningPoint: "Highlighting is in the critical path of search - must be blazing fast",
    },
    {
      id: 'throughput-corpus',
      category: 'throughput',
      question: "How large are the documents being highlighted?",
      answer: "Mix of sizes: blog posts (5KB), articles (50KB), some technical docs up to 1MB. On average, ~20KB per document.",
      importance: 'important',
      learningPoint: "Can't send full documents to client - must extract snippets server-side",
    },

    // LATENCY
    {
      id: 'latency-highlighting',
      category: 'latency',
      question: "How fast should highlighting be?",
      answer: "Part of search response time. Highlighting all results should add less than 50ms to search latency. If search takes 100ms, highlighting 10 results should add <5ms each.",
      importance: 'critical',
      learningPoint: "Highlighting is O(document_size) - needs optimization for large docs",
    },

    // ACCURACY
    {
      id: 'accuracy-snippet',
      category: 'accuracy',
      question: "How important is it to show the 'perfect' snippet?",
      answer: "Good enough is fine. If we show the 2nd-best snippet instead of the absolute best, users won't notice. But we should never show a snippet with zero matches - that's broken.",
      importance: 'important',
      insight: "Approximate fragment scoring is acceptable for speed",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-highlighting', 'snippet-length', 'html-encoding'],
  criticalFRQuestionIds: ['core-highlighting', 'snippet-length', 'html-encoding'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-highlighting', 'throughput-corpus'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Extract and highlight search terms',
      description: 'Show snippets with search terms visually highlighted',
      emoji: '🔦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Context-aware snippets',
      description: 'Snippets are 150-300 chars centered around matches',
      emoji: '📝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: HTML encoding for security',
      description: 'Escape user content to prevent XSS attacks',
      emoji: '🔒',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million searchers/day',
    writesPerDay: 'N/A (read operation)',
    readsPerDay: '10 million searches/day',
    peakMultiplier: 2,
    readWriteRatio: 'Read-only operation',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 116, peak: 10000 },
    maxPayloadSize: '~500 bytes per snippet',
    storagePerRecord: '~20KB average doc size',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 50ms for highlighting',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ 100K highlights/sec → Must use fast algorithms (avoid regex)',
    '✅ <5ms per highlight → Pre-process at index time when possible',
    '✅ XSS prevention → Always HTML-encode before highlighting',
    '✅ Large docs (1MB) → Extract snippets, don\'t highlight entire doc',
    '✅ Multi-term queries → Fast vector highlighting algorithm',
  ],

  outOfScope: [
    'Phrase matching ("exact phrase" in quotes)',
    'Fuzzy highlighting (showing near-matches)',
    'Proximity scoring (terms close together)',
    'PDF/binary document highlighting',
    'Highlighting in images',
  ],

  keyInsight: "First, let's make it WORK. We'll build basic highlighting with HTML encoding, then optimize with fast vector algorithms and fragment scoring. Start simple, then layer in performance!",
};

// =============================================================================
// STEP 1: The Beginning - Basic Search Infrastructure
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "You're building search for a documentation site with thousands of articles.",
  hook: "Users can search, but results just show document titles. They can't see WHY each document matched!",
  challenge: "Set up the basic infrastructure: Client → App Server → Search Index.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your search infrastructure is ready!",
  achievement: "Users can send search queries to your system",
  metrics: [
    { label: 'Search pipeline', after: 'Connected' },
    { label: 'Ready for highlighting', after: '✓' },
  ],
  nextTeaser: "But results don't show snippets yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Search Result Highlighting Architecture',
  conceptExplanation: `Before we highlight search terms, we need the basic search infrastructure:

**The flow:**
1. **Client**: User types a search query
2. **App Server**: Receives query and coordinates the response
3. **Search Index**: Finds matching documents

For example, searching "machine learning":
- Client sends: GET /api/v1/search?q=machine+learning
- App Server queries the search index
- Search Index returns matching documents
- App Server will add highlighting (next step!)

This is the foundation. Next, we'll enhance it to show highlighted snippets.`,

  whyItMatters: 'Without highlighting, users can\'t quickly scan results to see if they match what they\'re looking for. This hurts user experience and wastes time.',

  keyPoints: [
    'Search infrastructure separates concerns: indexing vs highlighting',
    'Search Index finds matches, App Server adds presentation',
    'Client displays the highlighted snippets to users',
    'Highlighting happens AFTER search, not during',
  ],

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │────▶│ App Server  │────▶│ Search Index │
└────────┘     └─────────────┘     └──────────────┘
                     │
                     ▼
          (Highlighting happens here)
`,

  keyConcepts: [
    { title: 'Search Index', explanation: 'Database optimized for full-text search', icon: '📚' },
    { title: 'Snippet', explanation: 'Short excerpt from a document', icon: '✂️' },
  ],
};

const step1: GuidedStep = {
  id: 'highlight-search-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Setting up foundation for search highlighting',
    taskDescription: 'Add Client, App Server, and Search Index with connections',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search and highlighting', displayName: 'App Server' },
      { type: 'search_index', reason: 'Finds matching documents', displayName: 'Search Index' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send search queries' },
      { from: 'App Server', to: 'Search Index', reason: 'Server queries for matches' },
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
    level1: 'Build the search pipeline: Client → App Server → Search Index',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'search_index' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'search_index' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Basic Highlighting with HTML Encoding
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your search returns documents, but they're just plain text!",
  hook: "A user searches for 'Python' and gets results, but can't quickly see where 'Python' appears in each result.",
  challenge: "Write Python code to highlight search terms with HTML tags, but safely encode the content first.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Search highlighting works!",
  achievement: "You implemented secure search term highlighting",
  metrics: [
    { label: 'Terms highlighted', after: '✓' },
    { label: 'XSS protection', after: 'Enabled' },
  ],
  nextTeaser: "But we're highlighting entire documents - too much text!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Safe HTML Highlighting',
  conceptExplanation: `Highlighting search terms requires two critical steps:

**1. HTML Encoding (Security First!)**
Never trust document content. Always escape HTML characters:
\`\`\`python
import html

def encode_html(text: str) -> str:
    # Converts < to &lt;, > to &gt;, etc.
    return html.escape(text)
\`\`\`

**2. Wrap Search Terms with Tags**
After encoding, find search terms and wrap them:
\`\`\`python
def highlight_term(text: str, term: str) -> str:
    # First, encode the text for safety
    safe_text = html.escape(text)

    # Then highlight (case-insensitive)
    highlighted = safe_text.replace(
        term,
        f'<b>{term}</b>'
    )
    return highlighted
\`\`\`

**Example:**
- Input: "Python is <great>"
- After encoding: "Python is &lt;great&gt;"
- After highlighting "Python": "<b>Python</b> is &lt;great&gt;"

The user's malicious < > tags are escaped, but our <b> tags work!`,

  whyItMatters: 'Without HTML encoding, users could inject malicious JavaScript into search results, creating XSS vulnerabilities. This is a critical security issue.',

  famousIncident: {
    title: 'MySpace Samy Worm (2005)',
    company: 'MySpace',
    year: '2005',
    whatHappened: 'A user injected JavaScript into their profile that wasn\'t properly HTML-encoded. The script spread to over 1 million users in 20 hours by adding "Samy is my hero" to their profiles. This was one of the fastest-spreading XSS worms ever.',
    lessonLearned: 'Always HTML-encode user content before displaying. Never trust ANY input, even from your own database.',
    icon: '🚨',
  },

  keyPoints: [
    'ALWAYS HTML-encode content before highlighting',
    'Encoding prevents XSS attacks from malicious content',
    'Case-insensitive highlighting improves user experience',
    'This is O(n) per document - simple but works',
  ],

  quickCheck: {
    question: 'Why must we HTML-encode BEFORE highlighting?',
    options: [
      'To make the text smaller',
      'So malicious HTML tags get escaped, but our highlight tags stay',
      'To improve performance',
      'To support Unicode',
    ],
    correctIndex: 1,
    explanation: 'If we highlight first, then encode, our <b> tags would get escaped too! Encode user content first, then add safe highlight tags.',
  },

  keyConcepts: [
    { title: 'HTML Encoding', explanation: 'Convert < > & to safe entities', icon: '🔒' },
    { title: 'XSS Prevention', explanation: 'Block malicious script injection', icon: '🛡️' },
    { title: 'Highlighting', explanation: 'Wrap terms in HTML tags', icon: '🔦' },
  ],
};

const step2: GuidedStep = {
  id: 'highlight-search-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1 + FR-3: Basic highlighting with HTML encoding',
    taskDescription: 'Configure search API and implement Python highlighting handler',
    componentsNeeded: [
      { type: 'app_server', reason: 'Implement highlighting logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Click App Server → Assign GET /api/v1/search API',
      'Open Python tab → Implement highlight() function',
      'Use html.escape() before highlighting',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Configure the search API, then implement highlighting with HTML encoding',
    level2: 'Assign GET /api/v1/search, then in Python tab: 1) html.escape() the text, 2) highlight search terms',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Extract Snippets with Context Windows
// =============================================================================

const step3Story: StoryContent = {
  emoji: '✂️',
  scenario: "Your highlighting works, but you're sending entire 50KB documents to users!",
  hook: "Search results are overwhelming - pages of highlighted text. Users can't scan them quickly.",
  challenge: "Extract small snippets (150-300 chars) centered around where search terms appear.",
  illustration: 'snippet-extraction',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Snippet extraction working!",
  achievement: "Results now show concise, relevant snippets",
  metrics: [
    { label: 'Snippet length', after: '~200 chars' },
    { label: 'Response size', before: '50KB', after: '500 bytes' },
  ],
  nextTeaser: "But what if search terms appear multiple times?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Context Windows: Extracting Relevant Snippets',
  conceptExplanation: `Don't show entire documents - extract snippets around matches!

**Algorithm:**
1. Find the first occurrence of any search term
2. Extract a window of text around it:
   - 75 chars before the match
   - The match itself
   - 75 chars after the match
3. Add ellipsis if we cut the document: "...snippet..."

**Example:**
Document: "Deep learning is a subset of machine learning that uses neural networks to model complex patterns..."

Search: "machine learning"

Snippet: "...Deep learning is a subset of <b>machine learning</b> that uses neural networks..."

**Python implementation:**
\`\`\`python
def extract_snippet(text: str, term: str, window: int = 75) -> str:
    # Find where term appears
    pos = text.lower().find(term.lower())
    if pos == -1:
        return text[:200]  # No match, return beginning

    # Extract window around match
    start = max(0, pos - window)
    end = min(len(text), pos + len(term) + window)

    snippet = text[start:end]

    # Add ellipsis if truncated
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."

    return snippet
\`\`\`

The window size balances context with brevity.`,

  whyItMatters: 'Snippets let users quickly scan 10 results instead of reading 10 full documents. This dramatically improves search experience.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Search result snippets on google.com',
    howTheyDoIt: 'Extracts ~160 character snippets using advanced algorithms. Shows multiple snippets if query terms appear in different parts of the document.',
  },

  famousIncident: {
    title: 'Google Featured Snippets Launch',
    company: 'Google',
    year: '2014',
    whatHappened: 'Google started showing "Featured Snippets" - enhanced snippets that directly answer queries. These snippets became so valuable that getting in position 0 (the featured snippet) drove more traffic than position 1 in normal results.',
    lessonLearned: 'Well-crafted snippets are incredibly valuable - they can answer questions without users clicking through.',
    icon: '⭐',
  },

  keyPoints: [
    'Extract 150-300 chars centered around matches',
    'Show context before AND after the match',
    'Add ellipsis (...) when truncating',
    'For now, just show first match (we\'ll improve with fragment scoring)',
  ],

  diagram: `
Original Document (5000 chars):
┌────────────────────────────────────────────────────────┐
│ Lorem ipsum... <MATCH HERE> ...more text...           │
└────────────────────────────────────────────────────────┘

Extract Snippet:
        ┌─────────┬──────────┬─────────┐
        │ 75 pre  │  MATCH   │ 75 post │
        └─────────┴──────────┴─────────┘
              ↓
    "...[context] <b>match</b> [context]..."
`,

  quickCheck: {
    question: 'Why extract snippets instead of highlighting the entire document?',
    options: [
      'Highlighting is too slow on large documents',
      'Snippets are easier to scan and reduce bandwidth',
      'HTML encoding breaks on large documents',
      'Search indexes can\'t return full documents',
    ],
    correctIndex: 1,
    explanation: 'Users can\'t scan 50KB of highlighted text. Snippets show just the relevant parts, improving UX and reducing response size.',
  },

  keyConcepts: [
    { title: 'Context Window', explanation: 'Characters before/after the match', icon: '🪟' },
    { title: 'Snippet', explanation: 'Short excerpt with context', icon: '✂️' },
    { title: 'Ellipsis', explanation: 'Indicates truncated text (...)', icon: '📝' },
  ],
};

const step3: GuidedStep = {
  id: 'highlight-search-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Context-aware snippet extraction',
    taskDescription: 'Enhance highlighting to extract snippets with context windows',
    componentsNeeded: [
      { type: 'app_server', reason: 'Update highlighting logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Open Python tab in App Server',
      'Implement extract_snippet() function',
      'Extract ~150-300 char window around matches',
      'Add ellipsis when truncating',
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
    level1: 'Implement snippet extraction with a context window',
    level2: 'Find match position, extract 75 chars before and after, add ellipsis if truncated',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Implement Fast Vector Highlighting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your search handles 100 queries/sec, but highlighting is getting slow!",
  hook: "Users search for 'Python programming tutorial' - that's 3 terms. Your naive approach scans the document 3 times!",
  challenge: "Implement fast vector highlighting - scan the document once to find all terms.",
  illustration: 'performance-optimization',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Highlighting is 3x faster!",
  achievement: "Vector highlighting handles multi-term queries efficiently",
  metrics: [
    { label: 'Highlighting time', before: '15ms', after: '5ms' },
    { label: 'Algorithm', after: 'O(n) single-pass' },
  ],
  nextTeaser: "But which snippet should we show when terms appear multiple times?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Fast Vector Highlighting Algorithm',
  conceptExplanation: `**The Problem:**
Naive approach: For each search term, scan the document
- Query: "Python programming tutorial" (3 terms)
- Scans: 3 × O(n) = O(3n) = slow!

**The Solution: Vector Highlighting**
Scan the document ONCE, finding all terms in a single pass:

\`\`\`python
def find_all_matches(text: str, terms: list) -> list:
    """
    Returns list of (position, term) tuples for all matches
    Single pass through the text - O(n)
    """
    matches = []
    text_lower = text.lower()

    # For each position in text
    for i in range(len(text)):
        # Check if any term starts here
        for term in terms:
            term_lower = term.lower()
            if text_lower[i:i+len(term)] == term_lower:
                matches.append((i, term))

    return sorted(matches)  # Sort by position

def vector_highlight(text: str, terms: list) -> str:
    """
    Highlight all terms in one pass
    """
    matches = find_all_matches(text, terms)

    # Build highlighted text by inserting tags
    result = []
    last_pos = 0

    for pos, term in matches:
        # Add text before match
        result.append(html.escape(text[last_pos:pos]))
        # Add highlighted match
        result.append(f'<b>{html.escape(term)}</b>')
        last_pos = pos + len(term)

    # Add remaining text
    result.append(html.escape(text[last_pos:]))

    return ''.join(result)
\`\`\`

**Why it's faster:**
- One pass through document instead of N passes
- Handles overlapping terms correctly
- Scales to queries with many terms`,

  whyItMatters: 'At 10K queries/sec with 10 results each, even a 10ms improvement saves 1000 seconds of CPU time per second - massive!',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Fast Highlighting for billions of documents',
    howTheyDoIt: 'Uses "Fast Vector Highlighter" that pre-analyzes documents at index time, storing term positions. At query time, it uses these positions for instant highlighting.',
  },

  famousIncident: {
    title: 'Lucene Fast Vector Highlighter',
    company: 'Apache Lucene',
    year: '2008',
    whatHappened: 'Apache Lucene introduced Fast Vector Highlighter, which was 10-50x faster than the original highlighter. It became the default for Elasticsearch and Solr, powering search at Netflix, GitHub, and thousands of companies.',
    lessonLearned: 'Pre-computation at index time can make query-time operations dramatically faster.',
    icon: '⚡',
  },

  keyPoints: [
    'Vector highlighting scans document once, not N times',
    'Finds all terms in single O(n) pass',
    'Handles overlapping terms and multi-word queries',
    'Critical for performance at scale',
  ],

  diagram: `
Naive Approach (slow):
Document: "Python is great for Python programming"
Term 1: Scan for "Python"     → O(n)
Term 2: Scan for "programming" → O(n)
Total: O(2n)

Vector Approach (fast):
Document: "Python is great for Python programming"
Single scan, find ALL terms → O(n)
Matches: [(0, "Python"), (20, "Python"), (27, "programming")]
`,

  quickCheck: {
    question: 'Why is vector highlighting faster for multi-term queries?',
    options: [
      'It uses parallel processing',
      'It scans the document once instead of once per term',
      'It compresses the document first',
      'It uses regex patterns',
    ],
    correctIndex: 1,
    explanation: 'Instead of N scans (one per term), vector highlighting makes one scan and finds all terms. For 5-term queries, that\'s 5x faster!',
  },

  keyConcepts: [
    { title: 'Vector Highlighting', explanation: 'Single-pass multi-term highlighting', icon: '⚡' },
    { title: 'Single Pass', explanation: 'Scan document once, not N times', icon: '🔄' },
    { title: 'Term Positions', explanation: 'Track where each term appears', icon: '📍' },
  ],
};

const step4: GuidedStep = {
  id: 'highlight-search-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-1: Multi-term highlighting optimization',
    taskDescription: 'Implement vector highlighting for faster multi-term queries',
    componentsNeeded: [
      { type: 'app_server', reason: 'Optimize highlighting algorithm', displayName: 'App Server' },
    ],
    successCriteria: [
      'Open Python tab in App Server',
      'Implement find_all_matches() for single-pass term finding',
      'Update highlight to use vector algorithm',
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
    level1: 'Implement single-pass vector highlighting instead of scanning per term',
    level2: 'Find all term positions in one scan, then build highlighted text from position list',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Fragment Scoring for Best Snippet Selection
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🎯',
  scenario: "A user searches for 'Python machine learning'. The term 'Python' appears 20 times in a document!",
  hook: "You're showing the first occurrence: 'Python 2.7 is deprecated'. But the best snippet is later: 'Python machine learning libraries like TensorFlow'.",
  challenge: "Add fragment scoring to find the snippet with the most concentrated matches.",
  illustration: 'scoring-algorithm',
};

const step5Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Fragment scoring working!",
  achievement: "System now finds the most relevant snippets",
  metrics: [
    { label: 'Snippet relevance', before: 'First match', after: 'Best match' },
    { label: 'User satisfaction', after: '+25%' },
  ],
  nextTeaser: "But what about custom highlight tags for different UIs?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Fragment Scoring: Finding the Best Snippet',
  conceptExplanation: `When search terms appear multiple times, which snippet do we show?

**Fragment Scoring Algorithm:**
1. Divide document into overlapping fragments (e.g., 200-char windows)
2. Score each fragment based on:
   - Number of unique terms matched
   - Total number of matches
   - Proximity of matches (closer = better)
3. Select the highest-scoring fragment

**Scoring function:**
\`\`\`python
def score_fragment(fragment: str, terms: list) -> float:
    score = 0.0
    text_lower = fragment.lower()

    # Count unique terms that appear
    unique_terms = sum(1 for term in terms
                      if term.lower() in text_lower)
    score += unique_terms * 10  # Unique terms worth more

    # Count total occurrences
    total_matches = sum(text_lower.count(term.lower())
                       for term in terms)
    score += total_matches * 1

    # Proximity bonus: if multiple terms in small fragment
    if unique_terms > 1 and len(fragment) < 200:
        score += 5  # Bonus for term proximity

    return score

def find_best_fragment(text: str, terms: list, size: int = 200) -> str:
    best_score = 0
    best_fragment = ""

    # Try fragments at different positions
    for i in range(0, len(text) - size, 50):  # Step by 50
        fragment = text[i:i+size]
        score = score_fragment(fragment, terms)

        if score > best_score:
            best_score = score
            best_fragment = fragment

    return best_fragment
\`\`\`

**Example:**
Query: "Python machine learning"

Fragment 1: "Python 2.7 is deprecated in favor of Python 3..."
- Score: 20 (2 occurrences of "Python", 0 "machine", 0 "learning")

Fragment 2: "Python machine learning libraries like TensorFlow..."
- Score: 35 (1 "Python", 1 "machine", 1 "learning" - all 3 terms!)

Fragment 2 wins! 🏆`,

  whyItMatters: 'Showing the best snippet helps users immediately see the most relevant part of the document, improving click-through rates.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Choosing which snippet to show in search results',
    howTheyDoIt: 'Uses ML models trained on click data to predict which snippet users find most helpful. Considers term density, query term proximity, and passage quality.',
  },

  famousIncident: {
    title: 'Bing Intelligent Snippet Selection',
    company: 'Microsoft Bing',
    year: '2016',
    whatHappened: 'Bing launched ML-based snippet selection that analyzes multiple candidate snippets and predicts which will get the most clicks. This improved click-through rate by 8%, worth millions in ad revenue.',
    lessonLearned: 'The quality of snippets directly impacts user engagement and business metrics.',
    icon: '📊',
  },

  keyPoints: [
    'Score fragments based on term presence and proximity',
    'Unique terms worth more than repeated terms',
    'Prefer fragments where terms appear close together',
    'Can use simple heuristics or ML models',
  ],

  diagram: `
Document divided into overlapping fragments:

┌──────────────┐
│ Fragment 1   │ Score: 15
└──────────────┘
     ┌──────────────┐
     │ Fragment 2   │ Score: 30 ← BEST!
     └──────────────┘
          ┌──────────────┐
          │ Fragment 3   │ Score: 10
          └──────────────┘

Select Fragment 2 as snippet
`,

  quickCheck: {
    question: 'Why is "Python machine learning tutorial" a better snippet than "Python Python Python" for query "Python machine learning"?',
    options: [
      'It\'s longer',
      'It contains more unique query terms (3 vs 1)',
      'It has more total words',
      'It comes first in the document',
    ],
    correctIndex: 1,
    explanation: 'The first fragment matches 3 unique terms (Python, machine, learning). The second only matches 1 term (Python) repeated. Unique terms score higher.',
  },

  keyConcepts: [
    { title: 'Fragment', explanation: 'Fixed-size window of text', icon: '🪟' },
    { title: 'Scoring', explanation: 'Ranking fragments by relevance', icon: '📊' },
    { title: 'Proximity', explanation: 'Terms appearing close together', icon: '🎯' },
  ],
};

const step5: GuidedStep = {
  id: 'highlight-search-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-2: Best snippet selection with fragment scoring',
    taskDescription: 'Implement fragment scoring to find the most relevant snippet',
    componentsNeeded: [
      { type: 'app_server', reason: 'Add fragment scoring logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Open Python tab in App Server',
      'Implement score_fragment() function',
      'Implement find_best_fragment() to try multiple positions',
      'Return highest-scoring fragment as snippet',
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
    level1: 'Score fragments based on unique terms and proximity',
    level2: 'Divide document into fragments, score each, select best. Score = unique_terms × 10 + total_matches',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Custom Highlight Tags
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎨',
  scenario: "Your mobile app wants <mark> tags, but your website uses <b> tags!",
  hook: "Different clients need different styling. Hardcoding <b> tags makes the system inflexible.",
  challenge: "Make highlight tags configurable so different clients can use different styles.",
  illustration: 'customization',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Highlighting is now flexible!",
  achievement: "System supports custom highlight tags for different clients",
  metrics: [
    { label: 'Tag customization', after: 'Enabled' },
    { label: 'Client flexibility', after: '✓' },
  ],
  nextTeaser: "Time to scale with caching...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Configurable Highlight Tags',
  conceptExplanation: `Different clients want different highlighting styles:

- **Web app**: <b>term</b> for bold
- **Mobile app**: <mark>term</mark> for yellow highlight
- **API clients**: <span class="highlight">term</span> for custom CSS
- **Email**: **term** (plain text, no HTML)

**Solution: Configurable Tags**
\`\`\`python
def highlight_with_tags(
    text: str,
    terms: list,
    pre_tag: str = '<b>',
    post_tag: str = '</b>'
) -> str:
    """
    Highlight terms with custom tags
    """
    matches = find_all_matches(text, terms)

    result = []
    last_pos = 0

    for pos, term in matches:
        # Text before match
        result.append(html.escape(text[last_pos:pos]))
        # Highlighted term with custom tags
        result.append(f'{pre_tag}{html.escape(term)}{post_tag}')
        last_pos = pos + len(term)

    result.append(html.escape(text[last_pos:]))
    return ''.join(result)
\`\`\`

**API Design:**
\`\`\`
GET /api/v1/search?q=python&pre_tag=<mark>&post_tag=</mark>

Response:
{
  "results": [
    {
      "snippet": "Learn <mark>Python</mark> programming..."
    }
  ]
}
\`\`\`

**Use cases:**
- Web: <em> for semantic emphasis
- Mobile: <mark> for visual highlighting
- RSS feeds: **term** for bold in plain text
- Accessibility: <strong> for screen readers`,

  whyItMatters: 'A flexible highlighting API serves multiple clients without code duplication. Build once, use everywhere.',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Highlight API with configurable tags',
    howTheyDoIt: 'Elasticsearch allows pre_tags and post_tags parameters. Default is <em>, but clients can specify any tags including multiple tags for different term weights.',
  },

  keyPoints: [
    'Make pre/post tags configurable parameters',
    'Default to <b></b> for backwards compatibility',
    'Validate tags to prevent XSS (only allow whitelisted tags)',
    'Enable multiple clients to use same highlighting service',
  ],

  diagram: `
Single Highlighting Service:

┌─────────────┐     ┌─────────────────────┐
│  Web App    │────▶│ Highlighting API    │
└─────────────┘     │ (pre_tag=<b>)       │
                    │                     │
┌─────────────┐     │                     │
│ Mobile App  │────▶│                     │
└─────────────┘     │ (pre_tag=<mark>)    │
                    │                     │
┌─────────────┐     │                     │
│ Email       │────▶│ (pre_tag=**)        │
└─────────────┘     └─────────────────────┘
`,

  quickCheck: {
    question: 'Why allow custom highlight tags instead of hardcoding <b>?',
    options: [
      'Custom tags are faster',
      'Different clients need different styling (web, mobile, email)',
      'Custom tags are more secure',
      '<b> tags don\'t work in all browsers',
    ],
    correctIndex: 1,
    explanation: 'Web apps might want <em>, mobile apps <mark>, email ** - one flexible API serves all clients.',
  },

  keyConcepts: [
    { title: 'Pre/Post Tags', explanation: 'Opening and closing HTML tags', icon: '🏷️' },
    { title: 'API Flexibility', explanation: 'One API, many clients', icon: '🔧' },
    { title: 'Default Values', explanation: 'Sensible defaults with override option', icon: '⚙️' },
  ],
};

const step6: GuidedStep = {
  id: 'highlight-search-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'All FRs now support custom highlight tags',
    taskDescription: 'Make highlight tags configurable via API parameters',
    componentsNeeded: [
      { type: 'app_server', reason: 'Add tag configuration', displayName: 'App Server' },
    ],
    successCriteria: [
      'Open Python tab in App Server',
      'Add pre_tag and post_tag parameters to highlight function',
      'Default to <b> and </b>',
      'Support custom tags from query parameters',
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
    level1: 'Add pre_tag and post_tag parameters to your highlight function',
    level2: 'Update highlight function signature: def highlight(text, terms, pre_tag="<b>", post_tag="</b>")',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const highlightSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'highlight-search-guided',
  problemTitle: 'Build Search Highlighting - Snippets, Encoding, Fast Vector Highlighting',

  requirementsPhase: highlightSearchRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Highlighting',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Search terms are highlighted in results',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'HTML Encoding Security',
      type: 'functional',
      requirement: 'FR-3',
      description: 'User content is properly HTML-encoded to prevent XSS',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0.00 },
    },
    {
      name: 'Snippet Extraction',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Snippets are 150-300 chars with context around matches',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Multi-Term Highlighting',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Vector highlighting handles multiple search terms efficiently',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-P1: Highlighting Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Highlighting adds <5ms per result at 1K QPS',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 5, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: High Throughput',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 10K QPS with fast vector highlighting',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getHighlightSearchGuidedTutorial(): GuidedTutorial {
  return highlightSearchGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = highlightSearchRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= highlightSearchRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
