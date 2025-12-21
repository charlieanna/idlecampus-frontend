import { GuidedTutorial } from '../../types/guidedTutorial';

export const typeaheadProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'typeahead-progressive',
  title: 'Design Typeahead / Autocomplete',
  description: 'Build an autocomplete system from simple prefix matching to ML-powered suggestions',
  difficulty: 'medium',
  estimatedTime: '60 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Implement efficient prefix matching with tries',
    'Rank suggestions by popularity and personalization',
    'Handle real-time updates to suggestion corpus',
    'Build distributed autocomplete for global scale',
    'Add ML-powered query understanding'
  ],
  prerequisites: ['Trie data structure', 'Caching', 'Distributed systems basics'],
  tags: ['autocomplete', 'search', 'trie', 'real-time', 'personalization'],

  progressiveStory: {
    title: 'Typeahead Evolution',
    premise: "You're building autocomplete for a search engine. Starting with basic prefix matching, you'll scale to handle billions of queries with sub-50ms latency and personalized suggestions.",
    phases: [
      { phase: 1, title: 'Basic Autocomplete', description: 'Prefix matching with popularity ranking' },
      { phase: 2, title: 'Scalable Service', description: 'Distributed trie with real-time updates' },
      { phase: 3, title: 'Smart Suggestions', description: 'Personalization and context awareness' },
      { phase: 4, title: 'Intelligence Layer', description: 'ML ranking and query understanding' }
    ]
  },

  steps: [
    // PHASE 1: Basic Autocomplete (Steps 1-3)
    {
      id: 'step-1',
      title: 'Trie-Based Prefix Matching',
      phase: 1,
      phaseTitle: 'Basic Autocomplete',
      learningObjective: 'Implement efficient prefix lookup with trie data structure',
      thinkingFramework: {
        framework: 'Right Data Structure',
        approach: 'Trie (prefix tree) is optimal for autocomplete. O(k) lookup where k = prefix length, regardless of corpus size. Each node = character, path = prefix.',
        keyInsight: 'Store complete suggestions at terminal nodes. Traverse to prefix end, then collect all descendants up to limit.'
      },
      requirements: {
        functional: [
          'Build trie from list of search terms',
          'Find all terms matching given prefix',
          'Return top N suggestions',
          'Handle case-insensitive matching'
        ],
        nonFunctional: []
      },
      hints: [
        'Node: {children: Map<char, Node>, isTerminal: bool, term: string}',
        'DFS from prefix end node to collect suggestions',
        'Normalize to lowercase before insert/search'
      ],
      expectedComponents: ['Trie', 'Prefix Matcher', 'Suggestion Collector'],
      successCriteria: ['Prefix lookup returns matches', 'Case insensitive works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Popularity-Based Ranking',
      phase: 1,
      phaseTitle: 'Basic Autocomplete',
      learningObjective: 'Rank suggestions by search frequency',
      thinkingFramework: {
        framework: 'Relevance Signals',
        approach: 'Not all matches are equal. "apple" should rank above "apple pie recipe" for prefix "app" if searched more often. Store frequency, sort by it.',
        keyInsight: 'Pre-compute top suggestions per prefix. Dont sort at query time - lookup should be O(1) after prefix match.'
      },
      requirements: {
        functional: [
          'Track search frequency per term',
          'Rank suggestions by popularity',
          'Pre-compute top-K for common prefixes',
          'Update rankings as frequencies change'
        ],
        nonFunctional: [
          'Query latency < 50ms'
        ]
      },
      hints: [
        'Store frequency at terminal node',
        'Use min-heap to track top-K during collection',
        'Cache top-K for each prefix node'
      ],
      expectedComponents: ['Frequency Tracker', 'Ranking Service', 'Top-K Cache'],
      successCriteria: ['Popular terms rank higher', 'Fast response time'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Suggestion Caching',
      phase: 1,
      phaseTitle: 'Basic Autocomplete',
      learningObjective: 'Cache results for common prefixes',
      thinkingFramework: {
        framework: 'Query Distribution',
        approach: 'Most queries share common prefixes. "a", "th", "wh" are typed constantly. Cache these aggressively. Long prefixes are rare - compute on demand.',
        keyInsight: 'Prefix length follows power law. 80% of queries hit top 1000 prefixes. Cache those, compute rest.'
      },
      requirements: {
        functional: [
          'Cache suggestions for popular prefixes',
          'Invalidate cache when corpus changes',
          'LRU eviction for cache size management',
          'Warm cache on startup with common prefixes'
        ],
        nonFunctional: [
          'Cache hit rate > 80%'
        ]
      },
      hints: [
        'Redis for distributed cache',
        'Key: prefix, Value: [suggestions]',
        'TTL based on prefix popularity'
      ],
      expectedComponents: ['Suggestion Cache', 'Cache Warmer', 'Invalidation Service'],
      successCriteria: ['High cache hit rate', 'Fresh results after updates'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Scalable Service (Steps 4-6)
    {
      id: 'step-4',
      title: 'Distributed Trie',
      phase: 2,
      phaseTitle: 'Scalable Service',
      learningObjective: 'Partition trie across multiple servers',
      thinkingFramework: {
        framework: 'Trie Sharding',
        approach: 'Single trie doesnt fit in memory for billions of terms. Shard by first character(s). Server A handles a-f, Server B handles g-m, etc.',
        keyInsight: 'First-letter sharding is simple but unbalanced (more words start with "s" than "x"). Use consistent hashing on prefix for better distribution.'
      },
      requirements: {
        functional: [
          'Partition trie across multiple servers',
          'Route queries to correct shard',
          'Handle shard failures with replicas',
          'Rebalance when adding/removing servers'
        ],
        nonFunctional: [
          'Support 100M+ terms',
          'No single point of failure'
        ]
      },
      hints: [
        'Consistent hashing on 2-character prefix',
        'Replicate each shard 3x for availability',
        'Zookeeper for shard membership'
      ],
      expectedComponents: ['Shard Router', 'Trie Shards', 'Replication Manager'],
      successCriteria: ['Queries route correctly', 'Shard failure handled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Real-Time Corpus Updates',
      phase: 2,
      phaseTitle: 'Scalable Service',
      learningObjective: 'Update suggestions as new searches happen',
      thinkingFramework: {
        framework: 'Streaming Updates',
        approach: 'Search corpus changes constantly. New trending terms appear, old ones fade. Stream updates via Kafka, apply to trie in near-real-time.',
        keyInsight: 'Batch updates to avoid per-query trie modification. Aggregate counts every minute, apply batch update.'
      },
      requirements: {
        functional: [
          'Stream new search queries to update system',
          'Increment frequency for existing terms',
          'Add new terms that reach threshold',
          'Decay old terms over time'
        ],
        nonFunctional: [
          'New trending terms appear within 5 minutes'
        ]
      },
      hints: [
        'Kafka topic for search events',
        'Aggregate in Flink/Spark Streaming',
        'Batch apply updates to trie every minute'
      ],
      expectedComponents: ['Event Stream', 'Aggregator', 'Trie Updater', 'Decay Worker'],
      successCriteria: ['Trending terms appear quickly', 'Stale terms removed'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Multi-Datacenter Deployment',
      phase: 2,
      phaseTitle: 'Scalable Service',
      learningObjective: 'Serve suggestions globally with low latency',
      thinkingFramework: {
        framework: 'Edge Deployment',
        approach: 'Autocomplete is latency-critical (every keystroke). Deploy trie replicas in each datacenter. Async replication for consistency.',
        keyInsight: 'Eventual consistency is fine for autocomplete. User doesnt notice if DC-A has slightly different suggestions than DC-B for a few seconds.'
      },
      requirements: {
        functional: [
          'Deploy trie replicas in multiple regions',
          'Route users to nearest datacenter',
          'Replicate updates across datacenters',
          'Handle datacenter failure'
        ],
        nonFunctional: [
          'Global p99 latency < 100ms',
          'Replication lag < 30 seconds'
        ]
      },
      hints: [
        'Full replica per DC, not partitioned',
        'Async replication via Kafka',
        'DNS-based routing to nearest DC'
      ],
      expectedComponents: ['Regional Replicas', 'Cross-DC Replication', 'Global Load Balancer'],
      successCriteria: ['Low latency globally', 'Failover works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Smart Suggestions (Steps 7-9)
    {
      id: 'step-7',
      title: 'Personalized Suggestions',
      phase: 3,
      phaseTitle: 'Smart Suggestions',
      learningObjective: 'Customize suggestions based on user history',
      thinkingFramework: {
        framework: 'User Context',
        approach: 'Global popularity + personal history. If user searched "python tutorial" before, boost "python" suggestions. Balance personalization vs discovery.',
        keyInsight: 'Blend scores: 70% global popularity + 30% personal affinity. Dont over-personalize or users get trapped in filter bubble.'
      },
      requirements: {
        functional: [
          'Track user search history',
          'Boost suggestions matching user interests',
          'Blend personal and global rankings',
          'Respect user privacy preferences'
        ],
        nonFunctional: [
          'Personalization latency overhead < 10ms'
        ]
      },
      hints: [
        'Store recent N searches per user in Redis',
        'Compute affinity: overlap with suggestion terms',
        'Anonymous users get global suggestions only'
      ],
      expectedComponents: ['User History Store', 'Personalization Ranker', 'Score Blender'],
      successCriteria: ['Relevant personal suggestions appear', 'Privacy respected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Context-Aware Suggestions',
      phase: 3,
      phaseTitle: 'Smart Suggestions',
      learningObjective: 'Adapt suggestions based on context signals',
      thinkingFramework: {
        framework: 'Contextual Relevance',
        approach: 'Same prefix, different context = different suggestions. "java" on weekday morning (programming) vs Saturday night (travel to Indonesia).',
        keyInsight: 'Context signals: time of day, day of week, location, device, recent queries in session. Light features, big impact.'
      },
      requirements: {
        functional: [
          'Extract context: time, location, device',
          'Adjust rankings based on context',
          'Handle session context (recent queries)',
          'A/B test context features'
        ],
        nonFunctional: []
      },
      hints: [
        'Time buckets: morning/afternoon/evening/night',
        'Location: country, city granularity',
        'Session: boost terms related to last 3 queries'
      ],
      expectedComponents: ['Context Extractor', 'Context Ranker', 'A/B Testing Framework'],
      successCriteria: ['Context improves relevance', 'Measurable CTR improvement'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Trending & Fresh Suggestions',
      phase: 3,
      phaseTitle: 'Smart Suggestions',
      learningObjective: 'Surface trending and time-sensitive content',
      thinkingFramework: {
        framework: 'Recency vs Popularity',
        approach: 'Breaking news should surface immediately even if historically unpopular. Detect velocity (rate of change) not just volume.',
        keyInsight: 'Trending = high velocity relative to baseline. "earthquake" jumping from 100 to 10000 queries/hour is trending. "weather" at 10000 constantly is not.'
      },
      requirements: {
        functional: [
          'Detect trending terms (velocity spike)',
          'Boost trending terms in suggestions',
          'Decay trending boost over time',
          'Filter inappropriate trending terms'
        ],
        nonFunctional: [
          'Trending detection within 2 minutes'
        ]
      },
      hints: [
        'Compare current hour to same hour last week',
        'Velocity = current_count / baseline_count',
        'Exponential decay: boost * 0.9^hours_since_peak'
      ],
      expectedComponents: ['Trend Detector', 'Velocity Calculator', 'Trending Ranker', 'Content Filter'],
      successCriteria: ['Breaking news surfaces quickly', 'False trends filtered'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Intelligence Layer (Steps 10-12)
    {
      id: 'step-10',
      title: 'Typo Tolerance & Fuzzy Matching',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Handle misspellings and typos gracefully',
      thinkingFramework: {
        framework: 'Error Correction',
        approach: 'Users make typos. "amzon" should suggest "amazon". Use edit distance, phonetic matching (Soundex), or learned corrections from query logs.',
        keyInsight: 'Learn corrections from user behavior. If users type "amzon" then click "amazon" result, thats a correction signal.'
      },
      requirements: {
        functional: [
          'Detect likely misspelled queries',
          'Suggest corrections alongside prefix matches',
          'Learn corrections from click behavior',
          'Handle phonetic similarities'
        ],
        nonFunctional: [
          'Correction latency < 20ms additional'
        ]
      },
      hints: [
        'BK-tree for edit distance queries',
        'Pre-compute corrections for common misspellings',
        'Soundex/Metaphone for phonetic matching'
      ],
      expectedComponents: ['Spell Checker', 'Edit Distance Index', 'Correction Learner'],
      successCriteria: ['Typos corrected accurately', 'Low latency impact'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Query Understanding',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Parse intent and entities from partial queries',
      thinkingFramework: {
        framework: 'Semantic Parsing',
        approach: 'Understand what user is looking for, not just string matching. "best itali" → intent: restaurant recommendation, entity: cuisine=Italian.',
        keyInsight: 'Entity recognition on partial queries is hard. Train on completed queries, apply to prefixes. Use query templates.'
      },
      requirements: {
        functional: [
          'Detect query intent (navigational, informational)',
          'Extract entities (locations, products, people)',
          'Suggest completions matching detected intent',
          'Handle multi-intent queries'
        ],
        nonFunctional: []
      },
      hints: [
        'Intent classifier: BERT fine-tuned on query logs',
        'NER for entities: people, places, products',
        'Query templates: "[cuisine] restaurant in [location]"'
      ],
      expectedComponents: ['Intent Classifier', 'Entity Extractor', 'Semantic Ranker'],
      successCriteria: ['Intent detected from partial query', 'Entities extracted correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'ML-Based Ranking',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Learn optimal ranking from user behavior',
      thinkingFramework: {
        framework: 'Learning to Rank',
        approach: 'Hand-tuned ranking weights dont scale. Train ML model on user clicks. Features: popularity, personalization, context, recency. Label: was suggestion clicked?',
        keyInsight: 'Position bias in training data: top suggestions get more clicks regardless of relevance. Use propensity scoring to debias.'
      },
      requirements: {
        functional: [
          'Collect training data from user interactions',
          'Train ranking model on click-through data',
          'Serve predictions in real-time',
          'Continuously retrain as behavior changes'
        ],
        nonFunctional: [
          'Model inference < 10ms',
          'Retrain weekly'
        ]
      },
      hints: [
        'Features: log(popularity), personal_score, trending_score, position',
        'Model: gradient boosted trees (XGBoost) or small neural net',
        'A/B test model versions before full rollout'
      ],
      expectedComponents: ['Feature Store', 'Ranking Model', 'Model Serving', 'Training Pipeline'],
      successCriteria: ['ML ranking improves CTR', 'Model updates smoothly'],
      estimatedTime: '8 minutes'
    }
  ]
};
