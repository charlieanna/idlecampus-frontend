import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Music Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches system design concepts
 * while building a music search platform with advanced search capabilities.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview - audio fingerprinting, metadata, lyrics)
 * Steps 1-3: Build basic music metadata search
 * Steps 4-6: Add audio fingerprinting, lyric search, similar song discovery
 *
 * Key Concepts:
 * - Music metadata search
 * - Audio fingerprinting technology
 * - Lyric search implementation
 * - Similar song discovery algorithms
 * - Music-specific search challenges
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const musicSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a music search system like Shazam or SoundHound",

  interviewer: {
    name: 'Maya Rodriguez',
    role: 'Principal Engineer at AudioSearch Inc.',
    avatar: '🎸',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-search',
      category: 'functional',
      question: "What are the different ways users search for music?",
      answer: "Users search for music in multiple ways:\n\n1. **Metadata search** - Search by song title, artist, album\n2. **Audio fingerprinting** - Identify a song from a recording (Shazam-style)\n3. **Lyric search** - Find songs by searching lyrics\n4. **Similar songs** - Discover music similar to a given song",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Music search is more complex than text search - it includes audio recognition and music-specific features",
    },
    {
      id: 'metadata-search',
      category: 'functional',
      question: "How should metadata search work?",
      answer: "Users type 'Rolling Stones' or 'Satisfaction' and get:\n1. **Fuzzy matching** - Handle typos ('Satsfaction')\n2. **Multi-field search** - Match across title, artist, album\n3. **Auto-complete** - Suggest as they type\n4. **Filters** - Genre, year, popularity",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Metadata search is the foundation - users need to find songs by name/artist quickly",
    },
    {
      id: 'audio-fingerprinting',
      category: 'functional',
      question: "How does audio fingerprinting work?",
      answer: "When a user records audio:\n1. **Extract fingerprint** - Create unique hash from audio waveform\n2. **Match fingerprint** - Search database for matching hash\n3. **Return song info** - Identify the song in <2 seconds\n\nThis is Shazam's core technology - identifying songs from short clips even in noisy environments.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Audio fingerprinting is complex - requires signal processing and specialized indexing",
    },
    {
      id: 'lyric-search',
      category: 'functional',
      question: "Should users be able to search lyrics?",
      answer: "Yes! Users often remember lyrics but not the song title:\n- 'I can't get no satisfaction' → finds 'Satisfaction' by Rolling Stones\n- Full-text search on lyrics database\n- Fuzzy matching for misremembered lyrics",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Lyric search helps users find songs they remember snippets of",
    },
    {
      id: 'similar-songs',
      category: 'functional',
      question: "How do you find similar songs?",
      answer: "Based on multiple factors:\n1. **Audio features** - Tempo, key, energy, valence\n2. **Genre/style** - Same or related genres\n3. **Collaborative filtering** - What other users liked\n4. **Music theory** - Harmonic similarity\n\nThis powers 'Discover Weekly' and 'Radio' features.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Similar song discovery combines audio analysis with user behavior",
    },
    {
      id: 'search-filters',
      category: 'functional',
      question: "What filters should users have?",
      answer: "Music-specific filters:\n1. **Genre** - Rock, Pop, Classical, Hip-Hop\n2. **Year/Era** - 1960s, 2020s, etc.\n3. **Mood** - Happy, Sad, Energetic, Calm\n4. **Popularity** - Trending, All-time hits\n5. **Duration** - Short (<3min), Long (>5min)",
      importance: 'important',
      revealsRequirement: 'FR-1 (enhanced)',
      learningPoint: "Music filters are domain-specific - different from e-commerce",
    },
    {
      id: 'real-time-recognition',
      category: 'clarification',
      question: "How quickly must audio fingerprinting identify songs?",
      answer: "Users expect results in 2-5 seconds. Shazam typically identifies songs in ~3 seconds. Any longer feels broken.",
      importance: 'critical',
      insight: "Speed is essential - users are in the moment listening to music",
    },

    // SCALE & NFRs
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many songs in the database?",
      answer: "100 million songs globally, with 60,000 new songs added daily",
      importance: 'critical',
      learningPoint: "Massive catalog requires efficient indexing for both metadata and audio fingerprints",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "500 million searches per day across all search types (metadata, audio, lyrics)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 searches/sec",
        result: "~6K searches/sec average (20K at peak)",
      },
      learningPoint: "High search volume requires distributed search infrastructure",
    },
    {
      id: 'throughput-fingerprinting',
      category: 'throughput',
      question: "How many audio fingerprint requests?",
      answer: "About 100 million fingerprint requests per day (20% of total searches)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 fingerprints/sec",
        result: "~1K fingerprint/sec average (4K at peak)",
      },
      learningPoint: "Audio fingerprinting is computationally expensive - needs optimization",
    },
    {
      id: 'latency-metadata-search',
      category: 'latency',
      question: "How fast should metadata search be?",
      answer: "p99 under 100ms. Search should feel instant as users type.",
      importance: 'critical',
      learningPoint: "Fast metadata search requires aggressive caching",
    },
    {
      id: 'latency-fingerprinting',
      category: 'latency',
      question: "How fast should audio fingerprinting be?",
      answer: "p99 under 3 seconds from audio capture to song identification",
      importance: 'critical',
      learningPoint: "Fingerprint matching must be extremely efficient despite large catalog",
    },
    {
      id: 'audio-fingerprint-accuracy',
      category: 'quality',
      question: "How accurate must audio fingerprinting be?",
      answer: "95%+ accuracy even with background noise, live performances, covers. False positives are unacceptable - showing wrong song destroys trust.",
      importance: 'critical',
      learningPoint: "Audio fingerprinting quality is critical - accuracy matters more than speed",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'metadata-search', 'audio-fingerprinting', 'lyric-search'],
  criticalFRQuestionIds: ['core-search', 'metadata-search', 'audio-fingerprinting'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-fingerprinting', 'audio-fingerprint-accuracy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search by metadata',
      description: 'Search songs by title, artist, album with fuzzy matching',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can identify songs by audio',
      description: 'Audio fingerprinting to identify songs from recordings',
      emoji: '🎵',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can search by lyrics',
      description: 'Full-text search through song lyrics',
      emoji: '📝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can find similar songs',
      description: 'Discover songs similar to a given track',
      emoji: '🎧',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million music searchers',
    writesPerDay: '60K new songs + metadata updates',
    readsPerDay: '500 million searches',
    peakMultiplier: 3,
    readWriteRatio: '8000:1',
    calculatedWriteRPS: { average: 1, peak: 3 },
    calculatedReadRPS: { average: 5787, peak: 20000 },
    maxPayloadSize: '~10KB (search results)',
    storagePerRecord: '~50KB per song (metadata + fingerprint)',
    storageGrowthPerYear: '~1TB (new songs)',
    redirectLatencySLA: 'p99 < 100ms (metadata search)',
    createLatencySLA: 'p99 < 3s (audio fingerprinting)',
  },

  architecturalImplications: [
    '✅ 100M songs → Elasticsearch for metadata, specialized fingerprint DB',
    '✅ 20K searches/sec at peak → Distributed search cluster with caching',
    '✅ Audio fingerprinting → Signal processing pipeline + hash index',
    '✅ p99 < 100ms metadata → Aggressive caching of popular searches',
    '✅ Lyric search → Full-text index with 100M+ lyrics',
    '✅ Similar songs → Pre-computed similarity vectors + nearest neighbor search',
  ],

  outOfScope: [
    'Music streaming (focus on search/discovery)',
    'Social features (playlists, sharing)',
    'Music recommendations (ML-based)',
    'Multi-language lyrics (English only for MVP)',
    'Live concert recordings',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search songs by metadata. Audio fingerprinting, lyric search, and similarity will come in later steps. Functionality first, then advanced features!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎵',
  scenario: "Welcome to AudioSearch Inc! You're building the next Shazam.",
  hook: "Your first user wants to search for 'Bohemian Rhapsody' by Queen!",
  challenge: "Set up the basic request flow so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your music search service is online!',
  achievement: 'Users can now send search requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every music search system starts with a **Client** connecting to a **Server**.

When a user searches on Shazam or Spotify:
1. Their device (phone, laptop, web browser) is the **Client**
2. It sends HTTP requests to your **Search API Server**
3. The server processes the query and returns matching songs

This is the foundation of all search applications!`,

  whyItMatters: 'Without this connection, users can\'t search for music at all.',

  realWorldExample: {
    company: 'Shazam',
    scenario: 'Processing 20 million song identifications per day',
    howTheyDoIt: 'Started with simple client-server in 2002, now uses distributed architecture across global regions',
  },

  keyPoints: [
    'Client = the user\'s device (app, browser)',
    'Search API Server = your backend that handles queries',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes search requests', icon: '📱' },
    { title: 'Search API Server', explanation: 'Backend that processes music search queries', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'music-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for music search',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for music', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles music search API requests', displayName: 'Search API Server' },
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
// STEP 2: Implement Music Search API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to search music!",
  hook: "A user searched for 'Queen' but got an error.",
  challenge: "Write the Python code to search songs by title, artist, and album.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your music search API works!',
  achievement: 'You implemented basic metadata search functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can search by metadata', after: '✓' },
  ],
  nextTeaser: "But searching through millions of songs is too slow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Music Search Handler',
  conceptExplanation: `Every music search API needs a **handler function** that:
1. Receives the search query
2. Searches through song metadata
3. Returns matching songs

For music search, we need:
- \`search_music(query, filters)\` - Find songs matching text and filters

For now, we'll store songs in memory (Python lists) and use simple string matching.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where music search happens!',

  famousIncident: {
    title: 'iTunes Search Outage',
    company: 'Apple',
    year: '2015',
    whatHappened: 'iTunes search went down for 2 hours. Users couldn\'t find or purchase music. Apple lost millions in revenue during that window.',
    lessonLearned: 'Search is mission-critical for music services. Downtime = immediate revenue loss.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Processing millions of searches per day',
    howTheyDoIt: 'Uses Elasticsearch for fast metadata search with custom ranking algorithms',
  },

  keyPoints: [
    'Search API receives query and filters as parameters',
    'Use in-memory storage for MVP (search index comes later)',
    'Return song list matching the search criteria',
    'Search across title, artist, and album fields',
  ],

  quickCheck: {
    question: 'Why start with in-memory storage instead of a database?',
    options: [
      'Memory is faster than databases',
      'We\'re keeping it simple - search index comes in next step',
      'Databases can\'t search music',
      'Memory is cheaper',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Search index (Elasticsearch) adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Search Handler', explanation: 'Function that processes search queries', icon: '⚙️' },
    { title: 'Metadata', explanation: 'Song information (title, artist, album)', icon: '📋' },
    { title: 'Query', explanation: 'The text user types to search', icon: '🔤' },
  ],
};

const step2: GuidedStep = {
  id: 'music-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search by metadata',
    taskDescription: 'Configure search API and implement Python handler',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search API',
      'Open the Python tab',
      'Implement search_music() function',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign the search endpoint',
    level2: 'After assigning API, switch to the Python tab. Implement the TODO for search_music',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index (Elasticsearch)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million songs, and search takes 10+ seconds!",
  hook: "Scanning through millions of songs for every query is impossibly slow. And you can't handle typos or fuzzy matching.",
  challenge: "Add a search index (Elasticsearch) for lightning-fast music search.",
  illustration: 'slow-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Music search is blazing fast now!',
  achievement: 'Search index enables sub-second queries on millions of songs',
  metrics: [
    { label: 'Search latency', before: '10000ms', after: '50ms' },
    { label: 'Typo tolerance', after: 'Enabled' },
    { label: 'Fuzzy matching', after: 'Enabled' },
  ],
  nextTeaser: "But users want to identify songs from audio recordings...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Fast Music Metadata Search',
  conceptExplanation: `A **search index** is a specialized data structure for fast text search.

Why NOT use a database?
- SQL LIKE queries are slow on millions of songs
- No typo tolerance ('Qeen' won't match 'Queen')
- No relevance scoring
- No multi-field search

**Elasticsearch** provides:
- **Inverted index** - Lightning fast text search
- **Fuzzy matching** - Handles typos automatically
- **Multi-field search** - Search title, artist, album together
- **Relevance scoring** - Ranks results by match quality
- **Aggregations** - Powers filters (genre, year)

For music search, Elasticsearch is essential.`,

  whyItMatters: 'At scale, SQL databases can\'t provide the search experience users expect. Search engines are purpose-built for this.',

  famousIncident: {
    title: 'Spotify Search Migration',
    company: 'Spotify',
    year: '2012',
    whatHappened: 'Spotify migrated from custom search to Elasticsearch. Search latency dropped from 500ms to 50ms, and typo tolerance improved dramatically.',
    lessonLearned: 'Specialized search engines provide better user experience than custom solutions.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Apple Music',
    scenario: 'Searching 100M+ songs in under 100ms',
    howTheyDoIt: 'Uses distributed search clusters with custom relevance tuning for music-specific ranking',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │Elasticsearch │
└────────┘     └─────────────┘     │ Search Index │
                                   └──────────────┘

Elasticsearch Index Structure:
{
  "song_id": "123",
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "genre": "Rock",
  "year": 1975,
  "duration": 354
}

Inverted Index for "Queen":
- queen → [song_123, song_456, song_789]
- bohemian → [song_123]
- rhapsody → [song_123]
`,

  keyPoints: [
    'Elasticsearch is a distributed search engine',
    'Inverted index enables fast full-text search',
    'Handles typos, synonyms, and relevance ranking',
    'Essential for music search at scale',
    'Songs are indexed with all searchable metadata',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of SQL database for music search?',
    options: [
      'Elasticsearch is cheaper',
      'SQL can\'t store music data',
      'Elasticsearch provides fast full-text search with typo tolerance and relevance ranking',
      'Elasticsearch is easier to set up',
    ],
    correctIndex: 2,
    explanation: 'Elasticsearch is purpose-built for search with features SQL lacks: inverted index, fuzzy matching, relevance scoring, and multi-field search.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for fast text search', icon: '📇' },
    { title: 'Inverted Index', explanation: 'Maps words to songs containing them', icon: '🔍' },
    { title: 'Fuzzy Matching', explanation: 'Handle typos and similar spellings', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'music-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast metadata search with fuzzy matching',
    taskDescription: 'Add Elasticsearch search index and connect App Server to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast full-text search on millions of songs', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added to canvas',
      'App Server connected to Search Index',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Drag a Search Index (Elasticsearch) component onto the canvas',
    level2: 'Click App Server, then click Search Index to create a connection',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 4: Add Audio Fingerprinting Service
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎵',
  scenario: "A user is at a coffee shop and hears a great song but doesn't know the name!",
  hook: "They want to record a snippet and identify the song instantly, just like Shazam.",
  challenge: "Add audio fingerprinting to identify songs from audio recordings.",
  illustration: 'audio-wave',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Audio fingerprinting works!',
  achievement: 'Users can now identify songs from audio recordings',
  metrics: [
    { label: 'Fingerprint generation', after: '<1 second' },
    { label: 'Song identification', after: '<3 seconds' },
    { label: 'Accuracy', after: '95%+' },
  ],
  nextTeaser: "But users also want to search by lyrics...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Audio Fingerprinting: Identifying Songs from Audio',
  conceptExplanation: `**Audio fingerprinting** is the technology behind Shazam and SoundHound.

How it works:
1. **Record audio** - User records 5-10 seconds
2. **Extract fingerprint** - Convert audio waveform to unique hash
   - Identify peaks in spectrogram
   - Create constellation map of frequency/time pairs
   - Generate hash from anchor points
3. **Match fingerprint** - Search database for matching hash
4. **Return song** - Identify the song with 95%+ accuracy

**Key innovation**: Fingerprints are robust to:
- Background noise (coffee shop, street)
- Poor audio quality (phone microphone)
- Different audio sources (live, radio, streaming)

This requires:
- Signal processing to generate fingerprints
- Specialized hash index for fast matching
- Pre-computed fingerprints for all songs`,

  whyItMatters: 'Audio fingerprinting is what makes music identification magical - no typing, just listen and discover.',

  famousIncident: {
    title: 'Shazam\'s Patent Victory',
    company: 'Shazam',
    year: '2008',
    whatHappened: 'Shazam\'s audio fingerprinting patent (US 7,627,477) was granted, protecting their core technology. The algorithm could identify songs in noisy environments with just 5 seconds of audio.',
    lessonLearned: 'Audio fingerprinting is technically complex but incredibly valuable. Robust algorithms are essential.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Shazam',
    scenario: 'Identifying 20M songs per day with 95%+ accuracy',
    howTheyDoIt: 'Uses spectrogram analysis to create constellation maps. Stores 100M+ song fingerprints in specialized hash tables for sub-second matching.',
  },

  diagram: `
Audio Fingerprinting Flow:

User Records Audio (5-10 seconds)
        │
        ▼
┌────────────────────┐
│  Extract Features  │
│  - FFT transform   │
│  - Peak detection  │
│  - Constellation   │
└────────┬───────────┘
        │
        ▼
┌────────────────────┐
│ Generate Hash      │
│ (Audio Fingerprint)│
└────────┬───────────┘
        │
        ▼
┌────────────────────┐     ┌──────────────┐
│ Fingerprint DB     │ ──▶ │ Match Found! │
│ (100M songs)       │     │ Return Song  │
└────────────────────┘     └──────────────┘
`,

  keyPoints: [
    'Audio fingerprinting converts audio to unique hash',
    'Spectrogram analysis identifies frequency peaks',
    'Constellation mapping creates robust fingerprints',
    'Hash matching finds songs in <3 seconds',
    'Works even with background noise',
  ],

  quickCheck: {
    question: 'Why use audio fingerprinting instead of just audio matching?',
    options: [
      'Fingerprinting is cheaper',
      'Fingerprints are robust to noise, quality variations, and live recordings',
      'Fingerprinting is easier to implement',
      'Audio matching doesn\'t work',
    ],
    correctIndex: 1,
    explanation: 'Audio fingerprints are hash representations that capture the unique characteristics of a song while being robust to noise, compression, and recording quality.',
  },

  keyConcepts: [
    { title: 'Audio Fingerprint', explanation: 'Unique hash representing audio characteristics', icon: '🔑' },
    { title: 'Spectrogram', explanation: 'Visual representation of frequency over time', icon: '📊' },
    { title: 'Constellation Map', explanation: 'Pattern of frequency peaks used for matching', icon: '⭐' },
  ],
};

const step4: GuidedStep = {
  id: 'music-search-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can identify songs by audio',
    taskDescription: 'Add Database for fingerprint storage and second App Server for fingerprinting',
    componentsNeeded: [
      { type: 'database', reason: 'Store audio fingerprints for 100M songs', displayName: 'Fingerprint DB' },
      { type: 'app_server', reason: 'Process audio and generate fingerprints', displayName: 'Fingerprint Service' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Second App Server added (Fingerprint Service)',
      'First App Server connected to Fingerprint Service',
      'Fingerprint Service connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database for fingerprint storage and a second App Server for the fingerprinting service',
    level2: 'Connect: Main App Server → Fingerprint Service → Database',
    solutionComponents: [{ type: 'database' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'app_server', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Lyric Search
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📝',
  scenario: "A user remembers 'I can't get no satisfaction' but forgot the song title!",
  hook: "Users often remember lyrics snippets but not song titles. They need lyric search.",
  challenge: "Add full-text search through lyrics database.",
  illustration: 'lyrics-page',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎤',
  message: 'Lyric search is live!',
  achievement: 'Users can now find songs by searching lyrics',
  metrics: [
    { label: 'Lyrics indexed', after: '100M songs' },
    { label: 'Search latency', after: '<100ms' },
    { label: 'User satisfaction', after: '+40%' },
  ],
  nextTeaser: "But users also want to discover similar songs...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Lyric Search: Finding Songs by Words',
  conceptExplanation: `**Lyric search** helps users find songs when they remember lyrics but not the title.

Implementation:
1. **Lyrics database** - Store full lyrics for all songs
2. **Full-text indexing** - Index lyrics in Elasticsearch
3. **Search** - Users search for lyric snippets
4. **Fuzzy matching** - Handle misremembered or misheard lyrics

Example queries:
- "I can't get no satisfaction" → Rolling Stones
- "Hello from the other side" → Adele
- "We are the champions" → Queen

Challenges:
- 100M songs × ~500 words/song = huge text corpus
- Must handle typos, variations, misheard lyrics (mondegreens)
- Copyright considerations for displaying lyrics`,

  whyItMatters: 'Lyric search is how users find songs they remember but can\'t name - critical for music discovery.',

  famousIncident: {
    title: 'Genius vs. Google Lyrics Dispute',
    company: 'Genius / Google',
    year: '2019',
    whatHappened: 'Genius accused Google of scraping their lyrics for Google Search results. Google was showing lyrics directly in search, reducing traffic to Genius.',
    lessonLearned: 'Lyrics are valuable data but have copyright and licensing complexities. Respect data sources.',
    icon: '⚖️',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Searching lyrics across 100M songs',
    howTheyDoIt: 'Partners with Musixmatch for lyrics. Uses Elasticsearch with custom analyzers for fuzzy lyric matching.',
  },

  diagram: `
Lyric Search Flow:

User Query: "can't get no satisfaction"
        │
        ▼
┌─────────────────────────────────┐
│  Elasticsearch (Lyrics Index)   │
│                                  │
│  Song: "Satisfaction"            │
│  Lyrics: "I can't get no         │
│           satisfaction..."       │
│                                  │
│  Match Score: 0.95 (high)        │
└────────┬────────────────────────┘
        │
        ▼
Return: "Satisfaction" by Rolling Stones
`,

  keyPoints: [
    'Store lyrics as full-text documents in Elasticsearch',
    'Use fuzzy matching for misheard lyrics',
    'Index lyrics separately from metadata',
    'Consider copyright/licensing for lyrics display',
    'Lyrics search complements metadata search',
  ],

  quickCheck: {
    question: 'Why index lyrics in Elasticsearch instead of SQL database?',
    options: [
      'Elasticsearch is cheaper',
      'Full-text search with fuzzy matching is faster and more accurate',
      'SQL can\'t store text',
      'Elasticsearch looks better',
    ],
    correctIndex: 1,
    explanation: 'Elasticsearch provides full-text search with fuzzy matching, relevance scoring, and fast queries across millions of lyric documents - features SQL lacks.',
  },

  keyConcepts: [
    { title: 'Lyric Index', explanation: 'Full-text searchable database of lyrics', icon: '📚' },
    { title: 'Full-text Search', explanation: 'Search across entire lyric text', icon: '🔍' },
    { title: 'Mondegreen', explanation: 'Misheard lyric (e.g., "Hold me closer Tony Danza")', icon: '👂' },
  ],
};

const step5: GuidedStep = {
  id: 'music-search-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can search by lyrics',
    taskDescription: 'Configure Elasticsearch to index lyrics with full-text search',
    successCriteria: [
      'Click on Search Index component',
      'Go to Configuration tab',
      'Enable lyrics indexing',
      'Configure full-text search for lyrics field',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Click on the Search Index component, then find the indexing configuration',
    level2: 'Enable lyrics indexing and configure full-text search with fuzzy matching',
    solutionComponents: [{ type: 'search_index', config: { lyrics: { enabled: true } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Similar Song Discovery
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎧',
  scenario: "A user loves 'Bohemian Rhapsody' and wants to discover similar songs!",
  hook: "Users want song recommendations based on what they're currently listening to.",
  challenge: "Implement similar song discovery using audio features and collaborative filtering.",
  illustration: 'discovery-algorithm',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Similar song discovery works!',
  achievement: 'Users can now discover music similar to songs they love',
  metrics: [
    { label: 'Similarity signals', after: '5' },
    { label: 'Discovery success rate', after: '85%' },
    { label: 'User engagement', after: '+60%' },
    { label: 'Time spent listening', after: '+45%' },
  ],
  nextTeaser: "You've built a complete music search platform!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Similar Song Discovery: Music Recommendation',
  conceptExplanation: `**Similar song discovery** helps users find music they'll love based on songs they already like.

Multiple approaches:

1. **Audio Feature Similarity** (Content-based)
   - Tempo (BPM)
   - Key and mode
   - Energy, valence (happiness)
   - Acousticness, instrumentalness
   - Danceability

   Songs with similar features sound alike!

2. **Collaborative Filtering** (Behavior-based)
   - "Users who liked Song A also liked Song B"
   - User listening patterns
   - Playlist co-occurrence

3. **Metadata Similarity**
   - Same genre
   - Same artist
   - Same era/decade

4. **Music Theory**
   - Harmonic similarity
   - Chord progressions
   - Song structure

**Implementation:**
- Extract audio features for all songs
- Compute similarity vectors
- Use nearest neighbor search (KNN)
- Pre-compute top N similar songs for popular tracks
- Cache recommendations`,

  whyItMatters: 'Similar song discovery is how users explore music - it drives engagement and retention.',

  famousIncident: {
    title: 'Spotify Discover Weekly Success',
    company: 'Spotify',
    year: '2015',
    whatHappened: 'Spotify launched Discover Weekly using collaborative filtering + audio features. It became their most successful feature with 40M+ weekly users. 5 billion songs discovered in first year.',
    lessonLearned: 'Good recommendations keep users engaged. Combining multiple signals (audio + behavior) is more effective than either alone.',
    icon: '🎵',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Recommending songs to 500M users',
    howTheyDoIt: 'Combines audio analysis (using convolutional neural networks), collaborative filtering, and NLP on playlist titles. Pre-computes recommendations for scale.',
  },

  diagram: `
Similar Song Discovery:

Input: "Bohemian Rhapsody" by Queen
        │
        ├──▶ Audio Features
        │    - Tempo: 72 BPM
        │    - Key: B♭ Major
        │    - Energy: 0.4
        │    - Valence: 0.3
        │
        ├──▶ Collaborative Filtering
        │    - Users who liked this
        │      also liked: [...]
        │
        └──▶ Metadata
             - Genre: Rock, Progressive
             - Era: 1970s

        ▼
┌──────────────────────────┐
│  Nearest Neighbor Search │
│  (Similarity Vectors)    │
└────────┬─────────────────┘
        │
        ▼
Similar Songs:
1. "Stairway to Heaven" - Led Zeppelin
2. "November Rain" - Guns N' Roses
3. "Don't Stop Me Now" - Queen
`,

  keyPoints: [
    'Combine multiple signals for better recommendations',
    'Audio features capture musical similarity',
    'Collaborative filtering captures user preferences',
    'Pre-compute similarities for popular songs',
    'Use vector similarity search (cosine similarity, KNN)',
  ],

  quickCheck: {
    question: 'Why combine audio features with collaborative filtering?',
    options: [
      'It\'s faster',
      'Audio features find musically similar songs, collaborative filtering finds songs users actually like together',
      'It\'s easier to implement',
      'Collaborative filtering doesn\'t work',
    ],
    correctIndex: 1,
    explanation: 'Audio features find objective musical similarity, but collaborative filtering captures what users actually listen to together. Combining both gives better recommendations.',
  },

  keyConcepts: [
    { title: 'Audio Features', explanation: 'Musical characteristics (tempo, key, energy)', icon: '🎼' },
    { title: 'Collaborative Filtering', explanation: 'Recommendations based on user behavior', icon: '👥' },
    { title: 'Nearest Neighbor', explanation: 'Find most similar items in vector space', icon: '📍' },
  ],
};

const step6: GuidedStep = {
  id: 'music-search-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Users can find similar songs',
    taskDescription: 'Add Cache for similarity recommendations and configure similarity service',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache pre-computed song similarities', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Main App Server connected to Cache',
      'Configure cache for similarity vectors (TTL: 86400 seconds)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Cache (Redis) component to store pre-computed similarities',
    level2: 'Connect App Server to Cache. Set TTL to 86400 seconds (24 hours) for similarity data',
    solutionComponents: [{ type: 'cache', config: { ttl: 86400 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const musicSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'music-search',
  title: 'Design Music Search',
  description: 'Build a music search system with metadata search, audio fingerprinting, lyric search, and similar song discovery',
  difficulty: 'advanced',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🎵',
    hook: "You've been hired as Lead Engineer at AudioSearch Inc!",
    scenario: "Your mission: Build a music search platform that can identify songs from audio, search metadata and lyrics, and discover similar music for millions of users.",
    challenge: "Can you design a system that handles multiple search modalities at scale?",
  },

  requirementsPhase: musicSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Music Search API',
    'Elasticsearch Full-text Search',
    'Audio Fingerprinting',
    'Spectrogram Analysis',
    'Lyric Search',
    'Similar Song Discovery',
    'Audio Feature Extraction',
    'Collaborative Filtering',
    'Nearest Neighbor Search',
    'Music Metadata Indexing',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing (Audio processing)',
  ],
};

export default musicSearchGuidedTutorial;
