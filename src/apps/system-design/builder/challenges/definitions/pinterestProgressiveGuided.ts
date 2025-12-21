import { GuidedTutorial } from '../../types/guidedTutorial';

export const pinterestProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'pinterest-progressive',
  title: 'Design Pinterest',
  description: 'Build a visual discovery platform from image boards to personalized recommendation engine',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design image-heavy infinite scroll feeds',
    'Implement visual search and similar image discovery',
    'Build personalized recommendation system',
    'Handle shopping integration and monetization',
    'Scale image processing and delivery'
  ],
  prerequisites: ['Image processing', 'Recommendation systems', 'Search'],
  tags: ['visual', 'discovery', 'recommendations', 'images', 'social'],

  progressiveStory: {
    title: 'Pinterest Evolution',
    premise: "You're building a visual discovery platform. Starting with simple image bookmarking, you'll evolve to personalized recommendations, visual search, and a shopping platform with billions of Pins.",
    phases: [
      { phase: 1, title: 'Pin Boards', description: 'Save and organize images' },
      { phase: 2, title: 'Discovery Feed', description: 'Personalized recommendations' },
      { phase: 3, title: 'Visual Search', description: 'Find similar images' },
      { phase: 4, title: 'Shopping Platform', description: 'Commerce and scale' }
    ]
  },

  steps: [
    // PHASE 1: Pin Boards (Steps 1-3)
    {
      id: 'step-1',
      title: 'Pin and Board Model',
      phase: 1,
      phaseTitle: 'Pin Boards',
      learningObjective: 'Create pins and organize into boards',
      thinkingFramework: {
        framework: 'Content Organization',
        approach: 'Pin = image with metadata (title, description, link). Board = collection of pins. User owns boards, pins belong to boards. Re-pin = copy pin to own board.',
        keyInsight: 'Pin is atomic content unit. Same image can exist as multiple pins (different metadata). Re-pin creates new pin referencing same image.'
      },
      requirements: {
        functional: [
          'Create pin from URL or upload',
          'Organize pins into boards',
          'Re-pin to own boards',
          'Board sections for sub-organization'
        ],
        nonFunctional: [
          'Pin creation < 3 seconds',
          'Unlimited pins per board'
        ]
      },
      hints: [
        'Pin: {id, image_id, board_id, title, description, source_url, creator_id}',
        'Board: {id, owner_id, name, privacy: public|secret, cover_pin_id}',
        'Re-pin: new Pin referencing same image_id, different board'
      ],
      expectedComponents: ['Pin Store', 'Board Manager', 'Re-pin Handler'],
      successCriteria: ['Pins created', 'Boards organize content'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Image Processing Pipeline',
      phase: 1,
      phaseTitle: 'Pin Boards',
      learningObjective: 'Process and optimize images at scale',
      thinkingFramework: {
        framework: 'Multi-Resolution Storage',
        approach: 'Upload triggers processing: resize to multiple sizes, extract dominant colors, generate thumbnails. Store original + derivatives. CDN delivery.',
        keyInsight: 'Pinterest is 99% images. Processing cost is huge. Generate sizes on upload (not on-demand). Cache aggressively. Images are immutable.'
      },
      requirements: {
        functional: [
          'Accept image upload or URL fetch',
          'Generate multiple sizes (thumbnail, medium, large)',
          'Extract dominant colors for UI',
          'Deduplicate identical images'
        ],
        nonFunctional: [
          'Processing < 10 seconds',
          'Storage: original + 5 sizes'
        ]
      },
      hints: [
        'Sizes: 75x75, 236xN, 474xN, 736xN, original (variable aspect)',
        'Colors: k-means clustering on pixels, top 5 colors',
        'Dedup: perceptual hash, not exact match'
      ],
      expectedComponents: ['Upload Handler', 'Image Processor', 'Deduplicator'],
      successCriteria: ['Images processed', 'Multiple sizes available'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Masonry Grid Layout',
      phase: 1,
      phaseTitle: 'Pin Boards',
      learningObjective: 'Display variable-height images efficiently',
      thinkingFramework: {
        framework: 'Waterfall Layout',
        approach: 'Masonry grid: variable height items packed into columns. Calculate positions server-side or client-side. Infinite scroll with virtualization.',
        keyInsight: 'Masonry maximizes screen real estate. No wasted space from uniform grids. Challenge: position calculation and smooth scroll with lazy loading.'
      },
      requirements: {
        functional: [
          'Masonry grid with variable heights',
          'Infinite scroll pagination',
          'Lazy load images on scroll',
          'Responsive columns (2-6 based on width)'
        ],
        nonFunctional: [
          'Smooth 60fps scroll',
          'Initial load: 25 pins'
        ]
      },
      hints: [
        'Layout: assign to shortest column, track column heights',
        'Virtualization: render only visible + buffer, recycle DOM',
        'Lazy load: IntersectionObserver, load 2 screens ahead'
      ],
      expectedComponents: ['Masonry Layout', 'Infinite Scroller', 'Image Loader'],
      successCriteria: ['Grid displays correctly', 'Scroll is smooth'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Discovery Feed (Steps 4-6)
    {
      id: 'step-4',
      title: 'Home Feed Generation',
      phase: 2,
      phaseTitle: 'Discovery Feed',
      learningObjective: 'Generate personalized pin recommendations',
      thinkingFramework: {
        framework: 'Candidate Generation',
        approach: 'Multiple sources: following, interests, similar to saved. Candidate generation (1000s) → ranking (100s) → filtering (50s). Real-time personalization.',
        keyInsight: 'Feed is not just following. Pinterest is discovery-first. 80% of feed is recommendations, 20% from followed boards. Exploration > exploitation.'
      },
      requirements: {
        functional: [
          'Aggregate pins from followed boards',
          'Add recommended pins based on interests',
          'Mix fresh and evergreen content',
          'Filter seen and hidden pins'
        ],
        nonFunctional: [
          'Feed generation < 500ms',
          'Personalization: 80% relevance target'
        ]
      },
      hints: [
        'Sources: following, interests, related_pins, trending',
        'Candidate: embedding similarity to user interests',
        'Mixing: 20% following, 50% interests, 20% explore, 10% ads'
      ],
      expectedComponents: ['Feed Generator', 'Candidate Ranker', 'Content Mixer'],
      successCriteria: ['Feed is personalized', 'Good content mix'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Interest Graph',
      phase: 2,
      phaseTitle: 'Discovery Feed',
      learningObjective: 'Model user interests from behavior',
      thinkingFramework: {
        framework: 'Implicit Signals',
        approach: 'User interests inferred from: saves, clicks, searches, dwell time. Interest taxonomy (fashion > womens > dresses). Update interests in real-time.',
        keyInsight: 'Actions speak louder than profiles. Saving a pin = strong signal. Clicking = medium. Scrolling past = weak negative. Build interest model from behavior.'
      },
      requirements: {
        functional: [
          'Track user engagement signals',
          'Build interest profile from actions',
          'Hierarchical interest taxonomy',
          'Decay old interests over time'
        ],
        nonFunctional: [
          'Interest update: real-time',
          'Taxonomy: 10,000+ interests'
        ]
      },
      hints: [
        'Signals: save=1.0, click=0.3, closeup=0.5, hide=-0.5',
        'Interest: {user_id, interest_id, score, last_updated}',
        'Decay: score *= 0.95 per week without engagement'
      ],
      expectedComponents: ['Signal Collector', 'Interest Modeler', 'Taxonomy'],
      successCriteria: ['Interests tracked', 'Profile accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Related Pins',
      phase: 2,
      phaseTitle: 'Discovery Feed',
      learningObjective: 'Recommend similar content',
      thinkingFramework: {
        framework: 'Item-to-Item Similarity',
        approach: 'Given pin A, find similar pins. Methods: visual similarity (CNN embeddings), co-engagement (users who saved A also saved B), content (same keywords).',
        keyInsight: 'Visual similarity is Pinterests superpower. CNN extracts features, nearest neighbor finds similar. Shows pins user never searched for but will love.'
      },
      requirements: {
        functional: [
          'Show related pins on pin detail',
          'Visual similarity recommendations',
          'Co-engagement based relations',
          'Update relations as new pins added'
        ],
        nonFunctional: [
          'Related pins load < 200ms',
          '10+ related pins per pin'
        ]
      },
      hints: [
        'Visual: ResNet embedding, cosine similarity, ANN index',
        'Co-engagement: jaccard similarity of saver sets',
        'Hybrid: weighted combination of signals'
      ],
      expectedComponents: ['Similarity Engine', 'Embedding Store', 'ANN Index'],
      successCriteria: ['Related pins relevant', 'Updates real-time'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Visual Search (Steps 7-9)
    {
      id: 'step-7',
      title: 'Image-Based Search',
      phase: 3,
      phaseTitle: 'Visual Search',
      learningObjective: 'Search using images instead of text',
      thinkingFramework: {
        framework: 'Visual Query',
        approach: 'Upload image → extract embedding → find nearest neighbors in index. Crop to specific object for focused search. Combined with text for hybrid.',
        keyInsight: 'Sometimes you cant describe what you want. See a lamp you like? Photo → visual search → find similar products. Unlocks non-verbal intent.'
      },
      requirements: {
        functional: [
          'Search by uploading image',
          'Search by camera capture',
          'Crop region for focused search',
          'Combine with text keywords'
        ],
        nonFunctional: [
          'Visual search < 1 second',
          'Top-10 relevance > 70%'
        ]
      },
      hints: [
        'Embedding: ResNet/EfficientNet, 2048-dim vector',
        'Index: FAISS or ScaNN for billion-scale ANN',
        'Crop: user selects region, embed cropped area'
      ],
      expectedComponents: ['Visual Encoder', 'ANN Search', 'Crop Handler'],
      successCriteria: ['Visual search works', 'Results relevant'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Lens (Object Detection)',
      phase: 3,
      phaseTitle: 'Visual Search',
      learningObjective: 'Detect and search objects in images',
      thinkingFramework: {
        framework: 'Multi-Object Detection',
        approach: 'Detect multiple objects in image: furniture, fashion items, food. Each object becomes searchable. Show pins for each detected object.',
        keyInsight: 'Lens turns every image into shopping catalog. Point camera at room → detect couch, lamp, rug → show similar products for each. Powerful for commerce.'
      },
      requirements: {
        functional: [
          'Detect objects in image',
          'Identify object category',
          'Search for each object',
          'Show product matches'
        ],
        nonFunctional: [
          'Detection < 500ms',
          'Support 100+ object categories'
        ]
      },
      hints: [
        'Detection: YOLO/Faster-RCNN, bounding boxes + classes',
        'Categories: furniture, fashion, food, home_decor, etc',
        'Per-object: crop region, embed, search'
      ],
      expectedComponents: ['Object Detector', 'Category Classifier', 'Multi-Search'],
      successCriteria: ['Objects detected', 'Each searchable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Search Ranking',
      phase: 3,
      phaseTitle: 'Visual Search',
      learningObjective: 'Rank search results by relevance and quality',
      thinkingFramework: {
        framework: 'Learning to Rank',
        approach: 'Combine multiple signals: text match, visual similarity, engagement, freshness, quality. ML model learns weights from click data. Personalize per user.',
        keyInsight: 'Raw similarity not enough. High-quality pins should rank higher. User engagement validates relevance. Train ranker on click-through data.'
      },
      requirements: {
        functional: [
          'Multi-signal ranking',
          'Personalized results',
          'Quality filtering',
          'Freshness boost for trends'
        ],
        nonFunctional: [
          'Ranking < 100ms',
          'Click-through rate optimization'
        ]
      },
      hints: [
        'Features: text_score, visual_score, saves, clicks, pin_age, creator_quality',
        'Model: gradient boosted trees or neural ranker',
        'Training: click/save as positive, skip as negative'
      ],
      expectedComponents: ['Feature Extractor', 'Ranking Model', 'Result Scorer'],
      successCriteria: ['Results well-ranked', 'CTR improved'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Shopping Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Product Pins & Catalogs',
      phase: 4,
      phaseTitle: 'Shopping Platform',
      learningObjective: 'Enable shopping directly from pins',
      thinkingFramework: {
        framework: 'Commerce Integration',
        approach: 'Merchants upload product catalogs. Product pins show price, availability. Deep link to merchant checkout. Automatic catalog sync.',
        keyInsight: 'Pinterest bridges discovery and purchase. User finds product in feed → product pin → merchant site → buy. Shortens path from inspiration to transaction.'
      },
      requirements: {
        functional: [
          'Ingest merchant product catalogs',
          'Product pins with price/availability',
          'Real-time inventory sync',
          'Shop tab on profiles'
        ],
        nonFunctional: [
          'Catalog sync: daily',
          'Price accuracy: < 1 hour lag'
        ]
      },
      hints: [
        'Catalog: feed of products (title, price, image, url, availability)',
        'Product pin: enhanced with shopping metadata',
        'Sync: webhook on inventory change or periodic pull'
      ],
      expectedComponents: ['Catalog Ingester', 'Product Pin', 'Inventory Sync'],
      successCriteria: ['Products shoppable', 'Prices accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Shopping Ads',
      phase: 4,
      phaseTitle: 'Shopping Platform',
      learningObjective: 'Monetize with native shopping ads',
      thinkingFramework: {
        framework: 'Native Advertising',
        approach: 'Promoted pins blend into feed. Target by interests, keywords, shopping intent. CPC/CPM bidding. Measure ROAS (return on ad spend).',
        keyInsight: 'Pinterest ads are high-intent. Users are planning purchases. Shopping ads at decision point convert well. Native format reduces ad blindness.'
      },
      requirements: {
        functional: [
          'Create promoted pin campaigns',
          'Target by interests and keywords',
          'Bid management (CPC/CPM)',
          'Conversion tracking'
        ],
        nonFunctional: [
          'Ad serving < 50ms',
          'Fill rate > 90%'
        ]
      },
      hints: [
        'Campaign: {budget, targeting, bid_type, creative_pins}',
        'Targeting: interests, keywords, demographics, retargeting',
        'Attribution: view-through (1 day), click-through (30 days)'
      ],
      expectedComponents: ['Ad Server', 'Targeting Engine', 'Attribution'],
      successCriteria: ['Ads serve correctly', 'Targeting works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Scale Infrastructure',
      phase: 4,
      phaseTitle: 'Shopping Platform',
      learningObjective: 'Scale to billions of pins worldwide',
      thinkingFramework: {
        framework: 'Multi-Region Architecture',
        approach: 'CDN for images globally. Sharded databases by user/pin. Real-time ML inference at edge. Multi-region for availability and latency.',
        keyInsight: 'Images are 95% of traffic. CDN is critical. ML models at edge for real-time personalization. Database sharding by user for locality.'
      },
      requirements: {
        functional: [
          'Global CDN for image delivery',
          'Multi-region database replication',
          'Edge ML inference',
          'Graceful degradation'
        ],
        nonFunctional: [
          'Image latency < 100ms globally',
          '99.99% availability'
        ]
      },
      hints: [
        'CDN: images in 50+ PoPs worldwide',
        'Sharding: user_id % N for user data, pin_id % M for pins',
        'Edge ML: lightweight models for ranking, full models in region'
      ],
      expectedComponents: ['CDN Layer', 'Shard Manager', 'Edge Inference'],
      successCriteria: ['Global low latency', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
