import { GuidedTutorial } from '../../types/guidedTutorial';

export const steamProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'steam-progressive',
  title: 'Design Steam',
  description: 'Build a digital game distribution platform from store to community features',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design digital content delivery at scale',
    'Implement game library and DRM',
    'Build social features and community',
    'Handle massive concurrent downloads',
    'Scale to millions of games and players'
  ],
  prerequisites: ['Content delivery', 'DRM', 'Social systems'],
  tags: ['gaming', 'distribution', 'downloads', 'community', 'marketplace'],

  progressiveStory: {
    title: 'Steam Evolution',
    premise: "You're building a digital game distribution platform. Starting with a game store and downloads, you'll evolve to support DRM, social features, user-generated content, and a global community of gamers.",
    phases: [
      { phase: 1, title: 'Store', description: 'Browse and purchase' },
      { phase: 2, title: 'Library', description: 'Downloads and DRM' },
      { phase: 3, title: 'Community', description: 'Social and content' },
      { phase: 4, title: 'Platform', description: 'Marketplace and scale' }
    ]
  },

  steps: [
    // PHASE 1: Store (Steps 1-3)
    {
      id: 'step-1',
      title: 'Game Catalog',
      phase: 1,
      phaseTitle: 'Store',
      learningObjective: 'Display games with rich metadata',
      thinkingFramework: {
        framework: 'Product Catalog',
        approach: 'Games have rich metadata: description, screenshots, videos, system requirements. Categories and tags. Publisher/developer info. Multiple editions.',
        keyInsight: 'Game pages are marketing. Screenshots, trailers, reviews sell games. System requirements prevent bad purchases. Multiple editions (standard, deluxe) with different content.'
      },
      requirements: {
        functional: [
          'Game listings with metadata',
          'Screenshots and trailer videos',
          'System requirements',
          'Game editions (standard, deluxe)'
        ],
        nonFunctional: [
          'Catalog search < 300ms',
          'Support 50K+ games'
        ]
      },
      hints: [
        'Game: {id, title, description, developer, publisher, release_date, tags}',
        'Media: {game_id, type: screenshot|video, url, order}',
        'Edition: {game_id, name, price, included_content: []}'
      ],
      expectedComponents: ['Game Store', 'Media Manager', 'Edition Handler'],
      successCriteria: ['Games display', 'Rich media works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Discovery and Recommendations',
      phase: 1,
      phaseTitle: 'Store',
      learningObjective: 'Help players find games',
      thinkingFramework: {
        framework: 'Personalized Discovery',
        approach: 'Curated lists (new, top sellers, specials). Personalized recommendations based on library/playtime. Tags for browsing. Similar games.',
        keyInsight: 'Players dont know what they want. Discovery drives sales. "Because you played X" works. Curators (trusted reviewers) help discovery.'
      },
      requirements: {
        functional: [
          'Featured and curated lists',
          'Tag-based browsing',
          'Personalized recommendations',
          'Similar games'
        ],
        nonFunctional: [
          'Recommendations < 200ms',
          'Daily recommendation refresh'
        ]
      },
      hints: [
        'Lists: {id, name, type: featured|sale|new, games: []}',
        'Tags: user-generated, aggregated from community',
        'Similar: collaborative filtering + tag similarity'
      ],
      expectedComponents: ['Discovery Service', 'Recommendation Engine', 'Curation Tools'],
      successCriteria: ['Discovery works', 'Recommendations relevant'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Purchase and Checkout',
      phase: 1,
      phaseTitle: 'Store',
      learningObjective: 'Process game purchases',
      thinkingFramework: {
        framework: 'Digital Goods Purchase',
        approach: 'Cart for multiple games. Multiple payment methods. Steam Wallet for balance. Gift purchases. Regional pricing.',
        keyInsight: 'Digital goods = instant delivery. No inventory concerns. Regional pricing essential - $60 game cant cost same in US and India. Gifting drives virality.'
      },
      requirements: {
        functional: [
          'Add to cart and checkout',
          'Multiple payment methods',
          'Steam Wallet balance',
          'Gift purchases'
        ],
        nonFunctional: [
          'Purchase < 3 seconds',
          'Instant library access'
        ]
      },
      hints: [
        'Cart: {user_id, items: [{game_id, edition, gift_to}]}',
        'Wallet: {user_id, balance, currency, transactions}',
        'Regional: different prices per country, based on PPP'
      ],
      expectedComponents: ['Cart Service', 'Payment Handler', 'Wallet Manager'],
      successCriteria: ['Purchases work', 'Instant delivery'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Library (Steps 4-6)
    {
      id: 'step-4',
      title: 'Game Library',
      phase: 2,
      phaseTitle: 'Library',
      learningObjective: 'Manage owned games',
      thinkingFramework: {
        framework: 'Entitlement Management',
        approach: 'Track owned games per user. Entitlement = proof of ownership. Categories and collections. Playtime tracking. Install state.',
        keyInsight: 'Library is permanent. Games tied to account forever. Track installed vs not installed. Categories help organize large libraries. Playtime is bragging rights.'
      },
      requirements: {
        functional: [
          'View owned games',
          'Organize into categories',
          'Track playtime',
          'Track install state'
        ],
        nonFunctional: [
          'Library load < 500ms',
          'Support 10K+ games per user'
        ]
      },
      hints: [
        'Entitlement: {user_id, game_id, acquired_at, source: purchase|gift|key}',
        'Category: {user_id, name, games: []}',
        'Playtime: {user_id, game_id, total_minutes, last_played}'
      ],
      expectedComponents: ['Library Store', 'Category Manager', 'Playtime Tracker'],
      successCriteria: ['Library works', 'Playtime tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Game Downloads',
      phase: 2,
      phaseTitle: 'Library',
      learningObjective: 'Deliver game files efficiently',
      thinkingFramework: {
        framework: 'Content Distribution',
        approach: 'Large files (50GB+). Delta updates (only changed chunks). Download servers globally. Bandwidth scheduling. Resume interrupted downloads.',
        keyInsight: 'Games are huge. Cant re-download 50GB for 100MB patch. Chunk files, hash each chunk, download only changed chunks. CDN essential for speed.'
      },
      requirements: {
        functional: [
          'Download game files',
          'Delta/incremental updates',
          'Pause and resume',
          'Bandwidth throttling'
        ],
        nonFunctional: [
          'Download speed: max bandwidth',
          'Update size: minimal'
        ]
      },
      hints: [
        'Manifest: {game_id, version, chunks: [{hash, size, offset}]}',
        'Delta: compare manifests, download only changed chunks',
        'CDN: regional servers, P2P optional for popular games'
      ],
      expectedComponents: ['Download Manager', 'Manifest Service', 'CDN'],
      successCriteria: ['Downloads work', 'Updates efficient'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'DRM and Verification',
      phase: 2,
      phaseTitle: 'Library',
      learningObjective: 'Protect games from piracy',
      thinkingFramework: {
        framework: 'Digital Rights',
        approach: 'Verify ownership before play. Online check or offline token. Anti-tamper for game files. Balance security vs user experience.',
        keyInsight: 'DRM is cat and mouse. Too strict = angry customers. Too loose = piracy. Steam DRM is relatively light - online check, offline mode with token.'
      },
      requirements: {
        functional: [
          'Ownership verification at launch',
          'Offline play with token',
          'File integrity check',
          'Family sharing (limited)'
        ],
        nonFunctional: [
          'Launch verification < 2 seconds',
          'Offline token: 30 days'
        ]
      },
      hints: [
        'Auth: check entitlement, generate session token',
        'Offline: cached token with expiry, refresh when online',
        'Integrity: hash verification of game files'
      ],
      expectedComponents: ['DRM Service', 'Token Manager', 'Integrity Checker'],
      successCriteria: ['Games launch', 'Offline works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Community (Steps 7-9)
    {
      id: 'step-7',
      title: 'Reviews and Ratings',
      phase: 3,
      phaseTitle: 'Community',
      learningObjective: 'Enable community feedback',
      thinkingFramework: {
        framework: 'User Reviews',
        approach: 'Only owners can review. Thumbs up/down (not stars). Helpful votes. Recent vs all-time scores. Developers can respond.',
        keyInsight: 'Steam uses binary (recommend/not recommend) not stars. Simpler, clearer. Recent reviews catch updates that break games. Helpful sorting surfaces quality.'
      },
      requirements: {
        functional: [
          'Write review (owners only)',
          'Recommend or not',
          'Helpful/funny votes',
          'Recent vs all-time scores'
        ],
        nonFunctional: [
          'Review after 1+ hours played',
          'Score calculation real-time'
        ]
      },
      hints: [
        'Review: {user_id, game_id, recommend: boolean, text, playtime_at_review}',
        'Votes: {review_id, user_id, type: helpful|funny}',
        'Score: {positive_reviews / total_reviews} for recent and all-time'
      ],
      expectedComponents: ['Review Service', 'Vote Handler', 'Score Calculator'],
      successCriteria: ['Reviews work', 'Scores accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Friends and Social',
      phase: 3,
      phaseTitle: 'Community',
      learningObjective: 'Connect players socially',
      thinkingFramework: {
        framework: 'Gaming Social Network',
        approach: 'Friend list and requests. See what friends play. Join game invites. Chat (text and voice). Activity feed.',
        keyInsight: 'Social drives engagement. See friend playing, want to join. Activity feed creates FOMO. Chat keeps users in Steam vs Discord.'
      },
      requirements: {
        functional: [
          'Friend requests and list',
          'Online status and current game',
          'Chat (text)',
          'Activity feed'
        ],
        nonFunctional: [
          'Status update < 10 seconds',
          'Chat delivery < 500ms'
        ]
      },
      hints: [
        'Friendship: {user_id, friend_id, created_at}',
        'Presence: {user_id, status: online|away|in_game, game_id, updated_at}',
        'Activity: {user_id, type: achievement|purchase|review, data}'
      ],
      expectedComponents: ['Friend Service', 'Presence System', 'Chat Service'],
      successCriteria: ['Friends work', 'Chat works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Workshop and User Content',
      phase: 3,
      phaseTitle: 'Community',
      learningObjective: 'Enable user-generated content',
      thinkingFramework: {
        framework: 'UGC Platform',
        approach: 'Mods, maps, skins uploaded by users. Game-specific content. Subscribe and auto-download. Ratings and curation.',
        keyInsight: 'Workshop extends game life. Users create content for free. Popular mods become features. Low friction subscribe + auto-install drives adoption.'
      },
      requirements: {
        functional: [
          'Upload mods/content',
          'Subscribe to content',
          'Auto-download subscribed items',
          'Rate and review content'
        ],
        nonFunctional: [
          'Content limit: 1GB per item',
          'Subscribe sync < 1 minute'
        ]
      },
      hints: [
        'Item: {id, game_id, creator_id, title, type: mod|map|skin, files, tags}',
        'Subscription: {user_id, item_id, created_at}',
        'Install: download to game folder on subscribe'
      ],
      expectedComponents: ['Workshop Service', 'Subscription Manager', 'Content CDN'],
      successCriteria: ['Uploads work', 'Subscriptions sync'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Achievements and Stats',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Track player progress',
      thinkingFramework: {
        framework: 'Game Telemetry',
        approach: 'Games report achievements unlocked. Stats (kills, deaths, playtime). Leaderboards. Profile showcase. Global achievement percentages.',
        keyInsight: 'Achievements extend engagement. Completionists chase 100%. Global % shows rarity. Stats enable leaderboards. Profile display is social status.'
      },
      requirements: {
        functional: [
          'Game reports achievements',
          'Track game statistics',
          'Leaderboards',
          'Profile achievement showcase'
        ],
        nonFunctional: [
          'Achievement unlock < 1 second',
          'Leaderboard query < 500ms'
        ]
      },
      hints: [
        'Achievement: {game_id, id, name, description, icon, global_percent}',
        'UserAchievement: {user_id, game_id, achievement_id, unlocked_at}',
        'Stat: {user_id, game_id, stat_name, value}'
      ],
      expectedComponents: ['Achievement Service', 'Stats Store', 'Leaderboard'],
      successCriteria: ['Achievements tracked', 'Leaderboards work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Trading and Marketplace',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Enable item trading economy',
      thinkingFramework: {
        framework: 'Virtual Economy',
        approach: 'In-game items tradeable. Community marketplace with real money. Steam takes cut. Price determined by supply/demand. Fraud prevention.',
        keyInsight: 'Trading creates value. Rare items worth real money. Marketplace is revenue source (15% fee). Must prevent fraud, scams, money laundering.'
      },
      requirements: {
        functional: [
          'List items for sale',
          'Buy items from marketplace',
          'Trade items between users',
          'Transaction history'
        ],
        nonFunctional: [
          'Transaction < 2 seconds',
          'Fraud detection real-time'
        ]
      },
      hints: [
        'Listing: {item_id, seller_id, price, currency, created_at}',
        'Trade: {user_a, user_b, items_a, items_b, status}',
        'Fraud: velocity limits, trade holds, pattern detection'
      ],
      expectedComponents: ['Marketplace', 'Trade Service', 'Fraud Detection'],
      successCriteria: ['Trading works', 'Fraud prevented'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Platform Scale',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle millions of concurrent users',
      thinkingFramework: {
        framework: 'Gaming Scale',
        approach: 'Sale events = 10x traffic. Download CDN globally distributed. Presence for millions online. Game server authentication.',
        keyInsight: 'Steam sales are massive traffic spikes. Pre-warm CDN for popular games. Presence system must handle millions. Every game launch authenticates.'
      },
      requirements: {
        functional: [
          'Handle sale traffic spikes',
          'Global download infrastructure',
          'Real-time presence at scale',
          'Game server authentication'
        ],
        nonFunctional: [
          'Handle 20M concurrent users',
          '99.9% availability'
        ]
      },
      hints: [
        'Sale: pre-provision capacity, queue for purchases',
        'CDN: regional PoPs, P2P for popular downloads',
        'Presence: eventual consistency, regional aggregation'
      ],
      expectedComponents: ['Traffic Manager', 'Global CDN', 'Scale Infrastructure'],
      successCriteria: ['Handles spikes', 'Global performance'],
      estimatedTime: '8 minutes'
    }
  ]
};
