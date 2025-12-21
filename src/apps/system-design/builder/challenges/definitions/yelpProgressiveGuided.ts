import { GuidedTutorial } from '../../types/guidedTutorial';

export const yelpProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'yelp-progressive',
  title: 'Design Yelp',
  description: 'Build a local business review platform from listings to personalized recommendations',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design geospatial business search',
    'Implement review and rating systems',
    'Build recommendation and ranking algorithms',
    'Handle business claims and verification',
    'Scale to millions of businesses'
  ],
  prerequisites: ['Geolocation', 'Search', 'Review systems'],
  tags: ['local', 'reviews', 'search', 'recommendations', 'geolocation'],

  progressiveStory: {
    title: 'Yelp Evolution',
    premise: "You're building a local business discovery platform. Starting with basic listings and search, you'll evolve to support reviews, photos, recommendations, and business owner tools.",
    phases: [
      { phase: 1, title: 'Listings', description: 'Business search and info' },
      { phase: 2, title: 'Reviews', description: 'Ratings and feedback' },
      { phase: 3, title: 'Discovery', description: 'Recommendations and filters' },
      { phase: 4, title: 'Platform', description: 'Business tools and scale' }
    ]
  },

  steps: [
    // PHASE 1: Listings (Steps 1-3)
    {
      id: 'step-1',
      title: 'Business Listings',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Store and display business information',
      thinkingFramework: {
        framework: 'Business Profile',
        approach: 'Business = name, category, location, hours, contact. Categories are hierarchical (Food > Restaurants > Italian). Structured data for search.',
        keyInsight: 'Business data comes from multiple sources: owner claims, user submissions, data partners. Need deduplication and conflict resolution.'
      },
      requirements: {
        functional: [
          'Create business listings',
          'Categories and subcategories',
          'Hours of operation',
          'Contact info and website'
        ],
        nonFunctional: [
          'Support millions of businesses',
          'Listing load < 300ms'
        ]
      },
      hints: [
        'Business: {id, name, categories, address, location, hours, phone, website}',
        'Hours: [{day, open, close}] with special hours for holidays',
        'Categories: tree structure, business can have multiple'
      ],
      expectedComponents: ['Business Store', 'Category Manager', 'Hours Handler'],
      successCriteria: ['Listings display', 'Categories work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Location-Based Search',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Find businesses near a location',
      thinkingFramework: {
        framework: 'Geospatial Index',
        approach: 'Index businesses by location. Query by radius or bounding box. Combine with category and keyword filters. Sort by distance or relevance.',
        keyInsight: 'Geo queries are expensive. Use geohash for prefix-based spatial indexing. Combine with inverted index for text. Pre-compute popular areas.'
      },
      requirements: {
        functional: [
          'Search by location (near me, address)',
          'Filter by category',
          'Keyword search in name/description',
          'Sort by distance or rating'
        ],
        nonFunctional: [
          'Search < 500ms',
          'Radius up to 25 miles'
        ]
      },
      hints: [
        'Geo index: geohash prefix tree or R-tree',
        'Query: category filter → geo filter → text match → rank',
        'Combined: Elasticsearch with geo_distance + multi_match'
      ],
      expectedComponents: ['Geo Index', 'Search Engine', 'Filter Handler'],
      successCriteria: ['Location search works', 'Filters apply'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-3',
      title: 'Business Details Page',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Display comprehensive business information',
      thinkingFramework: {
        framework: 'Rich Business Page',
        approach: 'Aggregate all info: basic details, photos, hours, menu (if restaurant), reviews preview. Map integration. Call/directions actions.',
        keyInsight: 'Business page is conversion point. Must have: trust signals (reviews, photos), action buttons (call, directions, website), hours status (open now?).'
      },
      requirements: {
        functional: [
          'Full business details',
          'Photo gallery',
          'Map with directions',
          'Open/closed status'
        ],
        nonFunctional: [
          'Page load < 1 second',
          'Mobile-optimized'
        ]
      },
      hints: [
        'Aggregate: business + reviews_summary + photos + hours',
        'Open now: check current time against hours, handle timezone',
        'Actions: tel: link, maps link, website link'
      ],
      expectedComponents: ['Detail Aggregator', 'Photo Gallery', 'Map Integration'],
      successCriteria: ['Details display', 'Actions work'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Reviews (Steps 4-6)
    {
      id: 'step-4',
      title: 'Review System',
      phase: 2,
      phaseTitle: 'Reviews',
      learningObjective: 'Enable user reviews and ratings',
      thinkingFramework: {
        framework: 'Review Model',
        approach: 'Review = rating + text + photos. One review per user per business. Update existing review. Review quality signals (useful, funny, cool).',
        keyInsight: 'Reviews are Yelps core value. Quality matters more than quantity. Spam detection essential. Verified purchases increase trust.'
      },
      requirements: {
        functional: [
          'Write review with star rating',
          'Add photos to review',
          'Edit own reviews',
          'Mark reviews as useful/funny/cool'
        ],
        nonFunctional: [
          'Review submission < 2 seconds',
          'One review per business per user'
        ]
      },
      hints: [
        'Review: {id, business_id, user_id, rating: 1-5, text, photos, created_at}',
        'Reactions: {review_id, user_id, type: useful|funny|cool}',
        'Constraint: unique (user_id, business_id)'
      ],
      expectedComponents: ['Review Store', 'Rating Handler', 'Reaction System'],
      successCriteria: ['Reviews submit', 'Ratings calculate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Review Ranking and Display',
      phase: 2,
      phaseTitle: 'Reviews',
      learningObjective: 'Surface most helpful reviews',
      thinkingFramework: {
        framework: 'Review Quality',
        approach: 'Rank by helpfulness, recency, and reviewer reputation. Filter spam and fake reviews. Show summary stats (rating distribution).',
        keyInsight: 'Not all reviews equal. Established reviewers with history more trustworthy. Recent reviews more relevant. Helpful votes = community curation.'
      },
      requirements: {
        functional: [
          'Sort reviews (newest, highest, lowest, useful)',
          'Show rating distribution histogram',
          'Filter by rating',
          'Highlight elite reviewers'
        ],
        nonFunctional: [
          'Load first 10 reviews < 300ms'
        ]
      },
      hints: [
        'Ranking: useful_count × 0.4 + recency × 0.3 + reviewer_reputation × 0.3',
        'Distribution: {5: count, 4: count, ...} pre-aggregated',
        'Elite: badge for top reviewers based on quality metrics'
      ],
      expectedComponents: ['Review Ranker', 'Stats Aggregator', 'Elite Program'],
      successCriteria: ['Reviews ranked well', 'Stats accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Review Moderation',
      phase: 2,
      phaseTitle: 'Reviews',
      learningObjective: 'Detect and handle fake or inappropriate reviews',
      thinkingFramework: {
        framework: 'Trust and Safety',
        approach: 'ML detection for fake reviews. Flag suspicious patterns. Business can report. Human review queue. Dont delete - filter and notify.',
        keyInsight: 'Fake review detection is arms race. Patterns: burst of 5-stars, reviewer only reviews one business, review text copied. Algorithmic + human review.'
      },
      requirements: {
        functional: [
          'Flag suspicious reviews',
          'Business report mechanism',
          'Human review queue',
          'Appeal process'
        ],
        nonFunctional: [
          'Detection < 1 hour of posting',
          'False positive rate < 1%'
        ]
      },
      hints: [
        'Signals: reviewer history, review velocity, IP patterns, text similarity',
        'Actions: not_recommended (hidden but viewable), removed (policy violation)',
        'Transparency: show "not recommended" reviews separately'
      ],
      expectedComponents: ['Fraud Detector', 'Report Handler', 'Review Queue'],
      successCriteria: ['Fake reviews filtered', 'Legit reviews preserved'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Discovery (Steps 7-9)
    {
      id: 'step-7',
      title: 'Personalized Recommendations',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Suggest businesses based on user preferences',
      thinkingFramework: {
        framework: 'Collaborative Filtering',
        approach: 'Learn preferences from reviews and searches. Similar users like similar places. Combine with location and time context.',
        keyInsight: 'User who likes Thai food probably likes Vietnamese. Users with similar review history = similar taste. Location + cuisine + price = recommendation.'
      },
      requirements: {
        functional: [
          'Personalized home feed',
          'Because you liked X suggestions',
          'Similar businesses',
          'Trending near you'
        ],
        nonFunctional: [
          'Recommendations refresh hourly',
          'Cold start: use location + popular'
        ]
      },
      hints: [
        'User profile: {preferred_categories, price_range, avg_rating_given}',
        'Similar: collaborative filter on review history',
        'Context: time of day (lunch spots), day of week (brunch)'
      ],
      expectedComponents: ['Recommendation Engine', 'User Profile', 'Context Handler'],
      successCriteria: ['Recommendations relevant', 'Personalized'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Advanced Filters',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Enable precise business filtering',
      thinkingFramework: {
        framework: 'Faceted Search',
        approach: 'Filter by: price, open now, good for (groups, kids, dates), features (wifi, parking), dietary (vegan, gluten-free). Combine filters.',
        keyInsight: 'Filters narrow from millions to tens. Each filter is indexed attribute. "Open now" requires real-time hours check. Features from reviews/claims.'
      },
      requirements: {
        functional: [
          'Price range filter ($ - $$$$)',
          'Open now filter',
          'Amenity filters (wifi, parking, etc)',
          'Attribute filters (good for kids, etc)'
        ],
        nonFunctional: [
          'Filter application < 200ms',
          'Facet counts accurate'
        ]
      },
      hints: [
        'Facets: {price_range, features: [], good_for: [], dietary: []}',
        'Open now: filter in application layer (time-dependent)',
        'Counts: pre-compute or estimate for performance'
      ],
      expectedComponents: ['Filter Engine', 'Facet Counter', 'Open Now Checker'],
      successCriteria: ['Filters work', 'Results accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Collections and Lists',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Enable user-curated business lists',
      thinkingFramework: {
        framework: 'User Curation',
        approach: 'Users create lists (Best Coffee Shops, Date Night). Save businesses to lists. Public or private. Follow lists from others.',
        keyInsight: 'Lists are user-generated discovery. Trust humans for curation. Popular lists surface good businesses. Social proof + editorial.'
      },
      requirements: {
        functional: [
          'Create lists',
          'Add businesses to lists',
          'Public/private lists',
          'Follow others lists'
        ],
        nonFunctional: [
          'List load < 300ms'
        ]
      },
      hints: [
        'List: {id, owner_id, name, description, businesses: [], visibility}',
        'Bookmark: quick add to default "Saved" list',
        'Following: see updates when list changes'
      ],
      expectedComponents: ['List Manager', 'Bookmark Service', 'Follow System'],
      successCriteria: ['Lists work', 'Sharing works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Business Owner Tools',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Enable businesses to manage their presence',
      thinkingFramework: {
        framework: 'Business Dashboard',
        approach: 'Claim business ownership. Update info and photos. Respond to reviews. View analytics (views, clicks, calls).',
        keyInsight: 'Business owners are customers too. Give them control and insights. Responding to reviews improves perception. Upsell ads and features.'
      },
      requirements: {
        functional: [
          'Claim business ownership',
          'Update business info',
          'Respond to reviews',
          'View analytics dashboard'
        ],
        nonFunctional: [
          'Claim verification < 48 hours'
        ]
      },
      hints: [
        'Claim: verify via phone, mail, or documentation',
        'Response: {review_id, business_response, responded_at}',
        'Analytics: views, direction_requests, calls, website_clicks'
      ],
      expectedComponents: ['Claim System', 'Response Handler', 'Analytics Dashboard'],
      successCriteria: ['Claims work', 'Analytics accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Advertising Platform',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Monetize with promoted listings',
      thinkingFramework: {
        framework: 'Local Ads',
        approach: 'Promoted results in search. Cost-per-click bidding. Target by location and category. Show "Ad" label for transparency.',
        keyInsight: 'Local ads are high-intent. User searching "plumber near me" = ready to hire. Ads work when relevant. Auction for ad placement.'
      },
      requirements: {
        functional: [
          'Create ad campaigns',
          'Target by location and category',
          'Set CPC bids and budget',
          'Ad performance reporting'
        ],
        nonFunctional: [
          'Ad serving < 50ms',
          'Budget enforcement real-time'
        ]
      },
      hints: [
        'Campaign: {business_id, budget, cpc_bid, targeting: {radius, categories}}',
        'Auction: rank by bid × quality_score',
        'Placement: top of search results, competitor pages'
      ],
      expectedComponents: ['Ad Server', 'Auction Engine', 'Budget Manager'],
      successCriteria: ['Ads serve correctly', 'Billing accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Performance',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle millions of searches and reviews',
      thinkingFramework: {
        framework: 'Read-Heavy Optimization',
        approach: 'Cache business pages. CDN for photos. Pre-compute popular searches. Shard by geography for locality.',
        keyInsight: 'Yelp is read-heavy (100:1). Cache business + reviews together. Geographic sharding keeps related data together. Photos are biggest bandwidth.'
      },
      requirements: {
        functional: [
          'Business page caching',
          'Photo CDN',
          'Search result caching',
          'Geographic sharding'
        ],
        nonFunctional: [
          'Page load < 1 second',
          'Search < 500ms'
        ]
      },
      hints: [
        'Cache: business detail + review summary, invalidate on review',
        'Photos: multiple sizes, WebP, lazy load',
        'Sharding: by city/region, cross-shard for edge cases'
      ],
      expectedComponents: ['Page Cache', 'Photo CDN', 'Shard Manager'],
      successCriteria: ['Fast responses', 'Scales horizontally'],
      estimatedTime: '8 minutes'
    }
  ]
};
