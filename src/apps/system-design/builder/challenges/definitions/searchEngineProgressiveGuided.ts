import { GuidedTutorial } from '../../types/guidedTutorial';

export const searchEngineProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'search-engine-progressive',
  title: 'Design a Search Engine',
  description: 'Build a search engine from basic text search to ML-powered ranking at scale',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Build inverted index for efficient text search',
    'Implement relevance ranking with TF-IDF and BM25',
    'Design distributed search architecture',
    'Add query understanding and spell correction',
    'Implement ML-based ranking and personalization'
  ],
  prerequisites: ['Information retrieval basics', 'Distributed systems', 'Data structures'],
  tags: ['search', 'information-retrieval', 'indexing', 'ranking', 'distributed-systems'],

  progressiveStory: {
    title: 'Search Engine Evolution',
    premise: "You're building a search engine for a large document corpus. Starting with basic keyword search, you'll evolve to handle billions of documents with sub-second response times and intelligent ranking.",
    phases: [
      { phase: 1, title: 'Basic Search', description: 'Keyword matching with inverted index' },
      { phase: 2, title: 'Relevance Ranking', description: 'Score and rank results by relevance' },
      { phase: 3, title: 'Distributed Search', description: 'Scale to billions of documents' },
      { phase: 4, title: 'Intelligent Search', description: 'ML ranking and query understanding' }
    ]
  },

  steps: [
    // PHASE 1: Basic Search (Steps 1-3)
    {
      id: 'step-1',
      title: 'Inverted Index Construction',
      phase: 1,
      phaseTitle: 'Basic Search',
      learningObjective: 'Build inverted index from documents',
      thinkingFramework: {
        framework: 'Index for Fast Lookup',
        approach: 'Forward index (doc → words) requires scanning all docs. Inverted index (word → docs) enables O(1) lookup per term.',
        keyInsight: 'Posting list: for each term, store list of (doc_id, positions, frequency). Positions enable phrase queries.'
      },
      requirements: {
        functional: [
          'Tokenize documents into terms',
          'Build term → document mapping',
          'Store term positions for phrase search',
          'Store term frequency per document'
        ],
        nonFunctional: []
      },
      hints: [
        'Tokenize: split on whitespace, lowercase, remove punctuation',
        'Posting: {doc_id, term_freq, positions: [int]}',
        'Sort posting lists by doc_id for merge operations'
      ],
      expectedComponents: ['Tokenizer', 'Index Builder', 'Posting List Store'],
      successCriteria: ['Index built from documents', 'Term lookup returns correct docs'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Boolean Query Processing',
      phase: 1,
      phaseTitle: 'Basic Search',
      learningObjective: 'Execute AND/OR queries on inverted index',
      thinkingFramework: {
        framework: 'Set Operations',
        approach: 'AND = intersection of posting lists. OR = union. NOT = set difference. Process from smallest list to largest for efficiency.',
        keyInsight: 'Merge algorithm: two sorted lists can be intersected in O(n+m). Skip pointers accelerate this further.'
      },
      requirements: {
        functional: [
          'Parse boolean queries (AND, OR, NOT)',
          'Intersect posting lists for AND',
          'Union posting lists for OR',
          'Exclude documents for NOT'
        ],
        nonFunctional: [
          'Query latency < 100ms for 10M docs'
        ]
      },
      hints: [
        'Two-pointer merge for intersection',
        'Skip pointers: every sqrt(n) entries point ahead',
        'Process smallest posting list first'
      ],
      expectedComponents: ['Query Parser', 'Posting List Merger', 'Boolean Executor'],
      successCriteria: ['Boolean queries return correct results', 'Performance acceptable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Phrase and Proximity Search',
      phase: 1,
      phaseTitle: 'Basic Search',
      learningObjective: 'Find exact phrases and nearby terms',
      thinkingFramework: {
        framework: 'Positional Index',
        approach: 'Phrase "new york" requires "new" immediately before "york" in same document. Use position data to verify adjacency.',
        keyInsight: 'Proximity search: "new NEAR/3 york" means within 3 words. Check position differences after doc intersection.'
      },
      requirements: {
        functional: [
          'Support quoted phrase queries',
          'Verify term positions are adjacent',
          'Support proximity queries (within N words)',
          'Handle multi-word phrases'
        ],
        nonFunctional: []
      },
      hints: [
        'After doc intersection, check positions',
        'For phrase: pos[term2] - pos[term1] == 1',
        'For proximity: |pos[term2] - pos[term1]| <= N'
      ],
      expectedComponents: ['Phrase Matcher', 'Proximity Checker', 'Position Index'],
      successCriteria: ['Phrase queries match exactly', 'Proximity respects distance'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Relevance Ranking (Steps 4-6)
    {
      id: 'step-4',
      title: 'TF-IDF Scoring',
      phase: 2,
      phaseTitle: 'Relevance Ranking',
      learningObjective: 'Score documents by term importance',
      thinkingFramework: {
        framework: 'Term Weighting',
        approach: 'TF (term frequency): more occurrences = more relevant. IDF (inverse document frequency): rare terms matter more than common ones.',
        keyInsight: 'TF-IDF = tf(t,d) * log(N/df(t)). "the" has high TF but low IDF. "quantum" has lower TF but high IDF.'
      },
      requirements: {
        functional: [
          'Calculate term frequency per document',
          'Calculate document frequency per term',
          'Compute TF-IDF scores',
          'Rank documents by score sum'
        ],
        nonFunctional: []
      },
      hints: [
        'TF: 1 + log(count) to dampen high counts',
        'IDF: log(N/df) where N = total docs',
        'Score = sum of TF-IDF for each query term'
      ],
      expectedComponents: ['TF Calculator', 'IDF Calculator', 'Score Combiner'],
      successCriteria: ['Relevant docs score higher', 'Rare term matches boost score'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'BM25 Ranking',
      phase: 2,
      phaseTitle: 'Relevance Ranking',
      learningObjective: 'Implement industry-standard BM25 ranking',
      thinkingFramework: {
        framework: 'Probabilistic Ranking',
        approach: 'BM25 improves on TF-IDF with saturation (diminishing returns for high TF) and document length normalization.',
        keyInsight: 'BM25 parameters: k1 controls TF saturation (1.2-2.0), b controls length normalization (0.75 typical).'
      },
      requirements: {
        functional: [
          'Implement BM25 scoring formula',
          'Normalize by document length',
          'Handle multi-term queries',
          'Tune k1 and b parameters'
        ],
        nonFunctional: [
          'Ranking quality matches Elasticsearch baseline'
        ]
      },
      hints: [
        'BM25 = IDF * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl/avgdl))',
        'Store doc length in index',
        'Pre-compute avgdl (average doc length)'
      ],
      expectedComponents: ['BM25 Scorer', 'Length Normalizer', 'Parameter Tuner'],
      successCriteria: ['BM25 implemented correctly', 'Results more relevant than TF-IDF'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Field Boosting & Zones',
      phase: 2,
      phaseTitle: 'Relevance Ranking',
      learningObjective: 'Weight different document fields differently',
      thinkingFramework: {
        framework: 'Field-Specific Relevance',
        approach: 'Match in title is more important than match in body. Assign field weights: title 3x, body 1x, metadata 0.5x.',
        keyInsight: 'Index fields separately or with field markers. At query time, combine scores with field weights.'
      },
      requirements: {
        functional: [
          'Index multiple fields per document',
          'Configure boost weights per field',
          'Combine field scores at query time',
          'Support field-specific queries (title:search)'
        ],
        nonFunctional: []
      },
      hints: [
        'Posting: {doc_id, field, term_freq, positions}',
        'Final score = sum(field_score * field_boost)',
        'Allow query syntax: field:term'
      ],
      expectedComponents: ['Multi-Field Index', 'Field Scorer', 'Score Aggregator'],
      successCriteria: ['Title matches rank higher', 'Field queries work'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Distributed Search (Steps 7-9)
    {
      id: 'step-7',
      title: 'Index Sharding',
      phase: 3,
      phaseTitle: 'Distributed Search',
      learningObjective: 'Partition index across multiple nodes',
      thinkingFramework: {
        framework: 'Document vs Term Partitioning',
        approach: 'Document partitioning: each shard has full index for subset of docs. Term partitioning: each shard owns certain terms. Doc partitioning is simpler.',
        keyInsight: 'Document sharding: query goes to all shards, results merged. Term sharding: query goes only to relevant shards but cross-shard stats are tricky.'
      },
      requirements: {
        functional: [
          'Partition documents across shards',
          'Route queries to all shards',
          'Merge results from multiple shards',
          'Handle shard failures'
        ],
        nonFunctional: [
          'Support 10B+ documents',
          'Query latency < 500ms'
        ]
      },
      hints: [
        'Hash doc_id for shard assignment',
        'Scatter query, gather results, merge by score',
        'Each shard calculates local scores'
      ],
      expectedComponents: ['Shard Router', 'Query Scatter', 'Result Merger'],
      successCriteria: ['Queries search all shards', 'Results correctly merged'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Result Merging & Pagination',
      phase: 3,
      phaseTitle: 'Distributed Search',
      learningObjective: 'Combine and paginate results from multiple shards',
      thinkingFramework: {
        framework: 'Distributed Top-K',
        approach: 'Each shard returns local top-K. Coordinator merges. Problem: shard A doc at position 11 might beat shard B doc at position 5.',
        keyInsight: 'For page 1 (top 10): request 10 from each shard. For page 2: request 20 from each (deep pagination is expensive).'
      },
      requirements: {
        functional: [
          'Merge top-K from each shard',
          'Support pagination (page 1, 2, 3...)',
          'Handle score ties consistently',
          'Optimize deep pagination'
        ],
        nonFunctional: [
          'Deep pagination (page 100) still < 2s'
        ]
      },
      hints: [
        'Min-heap merge: O(K log S) where S = shards',
        'Request (page * size) from each shard',
        'search_after for efficient deep pagination'
      ],
      expectedComponents: ['Result Merger', 'Pagination Handler', 'Score Normalizer'],
      successCriteria: ['Results correctly ordered globally', 'Pagination works correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Index Replication & Failover',
      phase: 3,
      phaseTitle: 'Distributed Search',
      learningObjective: 'Replicate shards for availability and read scaling',
      thinkingFramework: {
        framework: 'Primary-Replica Model',
        approach: 'Each shard has replicas. Writes go to primary, replicate to replicas. Reads can hit any replica. Replica count trades storage for read throughput.',
        keyInsight: 'Replica can serve reads immediately. For writes, choose sync (consistent but slower) or async (faster but potential stale reads).'
      },
      requirements: {
        functional: [
          'Replicate each shard N times',
          'Route reads to any healthy replica',
          'Promote replica on primary failure',
          'Sync writes to replicas'
        ],
        nonFunctional: [
          'Survive N-1 replica failures',
          'Failover in < 30 seconds'
        ]
      },
      hints: [
        'Primary handles writes, streams to replicas',
        'Round-robin read distribution',
        'Leader election on primary failure'
      ],
      expectedComponents: ['Replica Manager', 'Write Replicator', 'Failover Handler'],
      successCriteria: ['Reads distributed across replicas', 'Failover is automatic'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Intelligent Search (Steps 10-12)
    {
      id: 'step-10',
      title: 'Query Understanding',
      phase: 4,
      phaseTitle: 'Intelligent Search',
      learningObjective: 'Parse and enhance user queries',
      thinkingFramework: {
        framework: 'Query Analysis Pipeline',
        approach: 'Raw query → tokenize → spell correct → expand synonyms → detect intent → rewrite. Each step improves recall and precision.',
        keyInsight: 'Query expansion: "car" → "car OR automobile OR vehicle". Improves recall but can hurt precision. Balance with boosting original terms.'
      },
      requirements: {
        functional: [
          'Spell check and suggest corrections',
          'Expand queries with synonyms',
          'Detect query intent (navigational, informational)',
          'Handle stopwords appropriately'
        ],
        nonFunctional: [
          'Query processing < 50ms'
        ]
      },
      hints: [
        'Spell check: edit distance to dictionary terms',
        'Synonym expansion from curated thesaurus',
        'Intent detection: navigational has entity, informational is question-like'
      ],
      expectedComponents: ['Spell Checker', 'Synonym Expander', 'Intent Classifier'],
      successCriteria: ['Typos corrected', 'Synonyms improve recall'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Learning to Rank',
      phase: 4,
      phaseTitle: 'Intelligent Search',
      learningObjective: 'Train ML model to rank search results',
      thinkingFramework: {
        framework: 'Feature-Based Ranking',
        approach: 'BM25 is one signal. Add: click-through rate, freshness, authority, user context. Train model to combine into final score.',
        keyInsight: 'Pairwise loss: model learns "doc A should rank above doc B for query Q". More robust than pointwise absolute scores.'
      },
      requirements: {
        functional: [
          'Extract ranking features (BM25, CTR, freshness)',
          'Collect training data from clicks',
          'Train ranking model (GBDT or neural)',
          'Serve model predictions at query time'
        ],
        nonFunctional: [
          'Model inference < 20ms for 100 docs'
        ]
      },
      hints: [
        'Features: bm25, click_rate, doc_age, title_match',
        'LambdaMART (gradient boosted trees) is industry standard',
        'A/B test model updates'
      ],
      expectedComponents: ['Feature Extractor', 'Ranking Model', 'Training Pipeline', 'Model Server'],
      successCriteria: ['ML ranking improves NDCG', 'Model serves in real-time'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Semantic Search',
      phase: 4,
      phaseTitle: 'Intelligent Search',
      learningObjective: 'Add vector-based semantic matching',
      thinkingFramework: {
        framework: 'Beyond Keywords',
        approach: 'Keyword search misses semantic matches ("puppy" vs "dog"). Embed queries and docs in vector space, find nearest neighbors.',
        keyInsight: 'Hybrid search: keyword BM25 + semantic embedding. Combine scores or use semantic as reranker on BM25 top-K.'
      },
      requirements: {
        functional: [
          'Embed documents into vectors',
          'Embed queries at search time',
          'Find nearest neighbor documents',
          'Combine with keyword search'
        ],
        nonFunctional: [
          'Vector search adds < 50ms latency',
          'Support 100M+ vectors'
        ]
      },
      hints: [
        'Sentence-BERT or similar for embeddings',
        'HNSW index for approximate nearest neighbor',
        'Hybrid: BM25 score + cosine similarity'
      ],
      expectedComponents: ['Embedding Model', 'Vector Index (HNSW)', 'Hybrid Scorer'],
      successCriteria: ['Semantic matches found', 'Hybrid improves relevance'],
      estimatedTime: '10 minutes'
    }
  ]
};
