import { GuidedTutorial } from '../../types/guidedTutorial';

export const tiktokProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'tiktok-progressive',
  title: 'Design TikTok',
  description: 'Build a short-form video platform from basic uploads to AI-powered viral content discovery',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design video processing and delivery pipeline',
    'Implement the "For You" recommendation algorithm',
    'Build real-time engagement and viral mechanics',
    'Handle creator monetization and live streaming',
    'Scale to billions of video views daily'
  ],
  prerequisites: ['Video processing', 'Recommendation systems', 'CDN'],
  tags: ['video', 'short-form', 'recommendations', 'viral', 'social'],

  progressiveStory: {
    title: 'TikTok Evolution',
    premise: "You're building a short-form video platform. Starting with basic video sharing, you'll evolve to AI-powered content discovery that keeps users scrolling for hours with perfectly personalized content.",
    phases: [
      { phase: 1, title: 'Video Upload', description: 'Create and share videos' },
      { phase: 2, title: 'For You Feed', description: 'AI recommendations' },
      { phase: 3, title: 'Engagement', description: 'Viral mechanics' },
      { phase: 4, title: 'Creator Platform', description: 'Monetization and live' }
    ]
  },

  steps: [
    // PHASE 1: Video Upload (Steps 1-3)
    {
      id: 'step-1',
      title: 'Video Upload & Processing',
      phase: 1,
      phaseTitle: 'Video Upload',
      learningObjective: 'Ingest and process short-form videos',
      thinkingFramework: {
        framework: 'Video Pipeline',
        approach: 'Upload → transcode to multiple qualities → generate thumbnails → extract audio. All async processing. Videos ready in under 1 minute.',
        keyInsight: 'Short videos (15-60s) can process fast. Prioritize low quality first for quick availability. Higher qualities process in background.'
      },
      requirements: {
        functional: [
          'Upload video from device',
          'Transcode to multiple bitrates',
          'Generate thumbnail/preview',
          'Extract and index audio'
        ],
        nonFunctional: [
          'Processing < 60 seconds',
          'Support 4K 60fps input'
        ]
      },
      hints: [
        'Qualities: 360p, 480p, 720p, 1080p - adaptive bitrate',
        'Thumbnails: every 1 second for scrubbing preview',
        'Audio: separate track for duets, sound reuse'
      ],
      expectedComponents: ['Upload Service', 'Transcoder', 'Thumbnail Generator'],
      successCriteria: ['Videos processed quickly', 'Multiple qualities available'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Video Creation Tools',
      phase: 1,
      phaseTitle: 'Video Upload',
      learningObjective: 'Enable in-app video editing',
      thinkingFramework: {
        framework: 'Mobile-First Creation',
        approach: 'Record in-app with effects. Add music, filters, text, stickers. Trim and merge clips. All processing on device for real-time preview.',
        keyInsight: 'Creation UX is key differentiator. Low barrier to create → more content. Effects/filters make amateur content look good. Device-side processing for instant feedback.'
      },
      requirements: {
        functional: [
          'In-app camera with effects',
          'Add music from library',
          'Filters and AR effects',
          'Text, stickers, and drawing'
        ],
        nonFunctional: [
          'Real-time preview at 30fps',
          'Export quality matches preview'
        ]
      },
      hints: [
        'Effects: GPU shaders, applied real-time during recording',
        'Music: sync audio track, show lyrics if available',
        'Timeline: multi-track editor for clips, audio, effects'
      ],
      expectedComponents: ['Camera SDK', 'Effect Engine', 'Video Editor'],
      successCriteria: ['Recording works', 'Effects apply smoothly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Content Moderation',
      phase: 1,
      phaseTitle: 'Video Upload',
      learningObjective: 'Filter inappropriate content before publishing',
      thinkingFramework: {
        framework: 'Proactive Moderation',
        approach: 'ML classifiers scan before publish. Detect: nudity, violence, hate speech, copyright. Auto-remove violations, borderline to human review.',
        keyInsight: 'Moderation at upload prevents viral spread of harmful content. Cant review every video manually. ML + human review for edge cases.'
      },
      requirements: {
        functional: [
          'Scan video frames for policy violations',
          'Audio transcription and analysis',
          'Copyright detection (music, video)',
          'Human review queue for borderline'
        ],
        nonFunctional: [
          'Automated scan < 30 seconds',
          'Accuracy > 95% for clear violations'
        ]
      },
      hints: [
        'Visual: NSFW classifier, violence detector, frame sampling',
        'Audio: speech-to-text → text classifier, music fingerprinting',
        'Copyright: audio fingerprint match against catalog'
      ],
      expectedComponents: ['Content Classifier', 'Copyright Detector', 'Review Queue'],
      successCriteria: ['Violations caught', 'Fast processing'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: For You Feed (Steps 4-6)
    {
      id: 'step-4',
      title: 'For You Page Algorithm',
      phase: 2,
      phaseTitle: 'For You Feed',
      learningObjective: 'Build the core recommendation engine',
      thinkingFramework: {
        framework: 'Interest-Based Ranking',
        approach: 'Candidate generation → ranking → diversity injection. Signals: watch time, likes, shares, follows, video features. Real-time feedback loop.',
        keyInsight: 'Watch time is king. User watches 95% of video = strong positive. Scrolls past in 1s = negative. Algorithm optimizes for engagement, not just likes.'
      },
      requirements: {
        functional: [
          'Generate candidate videos (1000s)',
          'Rank by predicted engagement',
          'Real-time signal processing',
          'Diversity across content types'
        ],
        nonFunctional: [
          'Feed generation < 200ms',
          'Cold start with < 10 interactions'
        ]
      },
      hints: [
        'Candidates: popular, interest-match, creator-following, explore',
        'Ranking features: user history, video stats, creator stats, context',
        'Model: two-tower (user embedding, video embedding) + ranker'
      ],
      expectedComponents: ['Candidate Generator', 'Ranking Model', 'Feed Assembler'],
      successCriteria: ['Feed is personalized', 'Engagement high'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Video Understanding',
      phase: 2,
      phaseTitle: 'For You Feed',
      learningObjective: 'Extract features from videos for matching',
      thinkingFramework: {
        framework: 'Multi-Modal Embeddings',
        approach: 'Understand video content: visual (objects, scenes), audio (music, speech), text (captions, OCR). Combined embedding for similarity.',
        keyInsight: 'Recommendation needs content understanding. User likes cooking videos → recommend cooking. But also: fast cuts, upbeat music, specific creator style.'
      },
      requirements: {
        functional: [
          'Extract visual features (scenes, objects)',
          'Analyze audio (music genre, speech)',
          'Process text (captions, on-screen)',
          'Generate content embedding'
        ],
        nonFunctional: [
          'Feature extraction < 30 seconds',
          'Embedding dimension: 512-1024'
        ]
      },
      hints: [
        'Visual: CNN on sampled frames, scene/object detection',
        'Audio: music genre classifier, speech transcription',
        'Embedding: concatenate modalities, project to shared space'
      ],
      expectedComponents: ['Visual Analyzer', 'Audio Analyzer', 'Embedding Generator'],
      successCriteria: ['Content understood', 'Embeddings useful'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Real-Time Personalization',
      phase: 2,
      phaseTitle: 'For You Feed',
      learningObjective: 'Adapt recommendations based on session behavior',
      thinkingFramework: {
        framework: 'Session Context',
        approach: 'Track in-session behavior. User skips 3 cooking videos → reduce cooking in this session. Real-time adjustment without retraining model.',
        keyInsight: 'Session signals are fresh and strong. Long-term: user likes cooking. This session: not in the mood. Blend long-term + short-term signals.'
      },
      requirements: {
        functional: [
          'Track session engagement in real-time',
          'Adjust recommendations mid-session',
          'Balance exploration vs exploitation',
          'Time-of-day awareness'
        ],
        nonFunctional: [
          'Signal → adjustment < 1 second',
          'Session state: in-memory'
        ]
      },
      hints: [
        'Session state: recent watches, skips, likes in sliding window',
        'Adjustment: boost/demote categories based on session signals',
        'Exploration: inject 10% random/diverse to avoid filter bubble'
      ],
      expectedComponents: ['Session Tracker', 'Real-Time Adjuster', 'Exploration Module'],
      successCriteria: ['Adapts to session', 'Stays engaging'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Engagement (Steps 7-9)
    {
      id: 'step-7',
      title: 'Sounds & Trends',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Enable viral spread through shared audio',
      thinkingFramework: {
        framework: 'Viral Mechanics',
        approach: 'Sounds are first-class entities. Use trending sound → more visibility. Sound page shows all videos using it. Creates participation culture.',
        keyInsight: 'Sounds drive virality. Song goes viral → millions create videos with it. Sound page becomes discovery mechanism. Audio is social glue.'
      },
      requirements: {
        functional: [
          'Extract and catalog sounds',
          'Sound search and browse',
          'Use sound in new video',
          'Trending sounds discovery'
        ],
        nonFunctional: [
          'Sound catalog: millions',
          'Trending updates: hourly'
        ]
      },
      hints: [
        'Sound: {id, audio_url, title, creator, use_count, trending_score}',
        'Usage: link video to sound, increment use_count',
        'Trending: velocity of new uses, not just total'
      ],
      expectedComponents: ['Sound Catalog', 'Trending Calculator', 'Sound Browser'],
      successCriteria: ['Sounds discoverable', 'Trends accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Duets & Stitches',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Enable content collaboration and response',
      thinkingFramework: {
        framework: 'Participatory Content',
        approach: 'Duet: side-by-side with original video. Stitch: use beginning of original, add your content. Creates conversation chains and remix culture.',
        keyInsight: 'Duet/Stitch lower creation barrier. Dont need original idea - react to existing. Creates content flywheel and engagement between creators.'
      },
      requirements: {
        functional: [
          'Duet: record alongside original',
          'Stitch: clip and extend original',
          'Link to original video',
          'Control who can duet/stitch'
        ],
        nonFunctional: [
          'Duet sync: < 50ms audio drift'
        ]
      },
      hints: [
        'Duet: two video tracks rendered side-by-side or green-screen',
        'Stitch: first N seconds of original + new content',
        'Attribution: link to original, show in duet chain'
      ],
      expectedComponents: ['Duet Recorder', 'Stitch Editor', 'Chain Tracker'],
      successCriteria: ['Duets work smoothly', 'Attribution correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Challenges & Hashtags',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Organize and promote viral challenges',
      thinkingFramework: {
        framework: 'Campaign Mechanics',
        approach: 'Hashtag = topic aggregator. Challenge = call to action (do this dance). Branded challenges for advertisers. Hashtag page shows all content.',
        keyInsight: 'Challenges drive mass participation. Clear format + sound + hashtag = viral recipe. Branded challenges are premium ad product.'
      },
      requirements: {
        functional: [
          'Hashtag discovery and pages',
          'Challenge creation and promotion',
          'Track challenge participation',
          'Branded challenge partnerships'
        ],
        nonFunctional: [
          'Hashtag page load < 500ms',
          'Support millions of hashtags'
        ]
      },
      hints: [
        'Hashtag: {name, video_count, view_count, trending}',
        'Challenge: {hashtag, sound, instructions, sponsor, start/end}',
        'Branded: guaranteed views, hashtag takeover'
      ],
      expectedComponents: ['Hashtag Index', 'Challenge Manager', 'Campaign Dashboard'],
      successCriteria: ['Hashtags aggregate content', 'Challenges drive participation'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Creator Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Creator Fund & Monetization',
      phase: 4,
      phaseTitle: 'Creator Platform',
      learningObjective: 'Pay creators for content',
      thinkingFramework: {
        framework: 'Creator Economics',
        approach: 'Creator Fund: pay per view from pool. Tips/gifts during live. Brand partnerships facilitated. Revenue share to retain top creators.',
        keyInsight: 'Creators are content engine. Must monetize or they leave. Multiple revenue streams: fund, gifts, sponsorships, merchandise. Platform takes cut.'
      },
      requirements: {
        functional: [
          'Creator Fund payouts by views',
          'In-app tipping with virtual gifts',
          'Brand partnership marketplace',
          'Earnings dashboard'
        ],
        nonFunctional: [
          'Payout calculation: daily',
          'Payment: monthly'
        ]
      },
      hints: [
        'Fund: total pool / sum(eligible_views) * creator_views',
        'Gifts: virtual currency, creator gets 50%, platform 50%',
        'Eligibility: 10K followers, 100K views in 30 days'
      ],
      expectedComponents: ['Fund Calculator', 'Gift System', 'Payout Service'],
      successCriteria: ['Creators paid accurately', 'Multiple revenue streams'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Live Streaming',
      phase: 4,
      phaseTitle: 'Creator Platform',
      learningObjective: 'Enable real-time video broadcasting',
      thinkingFramework: {
        framework: 'Live Video Architecture',
        approach: 'RTMP ingest → transcode → distribute via CDN. Low latency for interaction. Live chat alongside video. Gifts with real-time animations.',
        keyInsight: 'Live is highest engagement format. Direct creator-fan interaction. Gifts spike during live. Challenge: scale to millions of concurrent viewers.'
      },
      requirements: {
        functional: [
          'Go live from mobile app',
          'Real-time chat',
          'Virtual gifts with animations',
          'Live multi-guest'
        ],
        nonFunctional: [
          'Glass-to-glass latency < 3 seconds',
          'Support 100K concurrent viewers'
        ]
      },
      hints: [
        'Ingest: RTMP to nearest PoP, transcode to HLS/DASH',
        'Low latency: CMAF chunks, sub-second segments',
        'Gifts: WebSocket events, client-side animation rendering'
      ],
      expectedComponents: ['Live Ingest', 'Distribution CDN', 'Chat Service'],
      successCriteria: ['Live works smoothly', 'Low latency'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Scale & Delivery',
      phase: 4,
      phaseTitle: 'Creator Platform',
      learningObjective: 'Serve billions of video views globally',
      thinkingFramework: {
        framework: 'Video CDN Optimization',
        approach: 'Multi-CDN strategy. Predictive caching for trending content. Adaptive bitrate based on network. Regional processing for low latency.',
        keyInsight: 'Video is 80% of internet traffic. CDN costs are huge. Cache efficiently: popular videos at edge, long tail from origin. Adaptive bitrate saves bandwidth.'
      },
      requirements: {
        functional: [
          'Global CDN with edge caching',
          'Adaptive bitrate streaming',
          'Predictive cache warming',
          'Multi-CDN routing'
        ],
        nonFunctional: [
          'Video start < 500ms',
          'Rebuffer rate < 1%'
        ]
      },
      hints: [
        'CDN: cache top 10% of videos (90% of views)',
        'ABR: HLS/DASH, switch quality based on bandwidth',
        'Predictive: trending videos → warm in all PoPs'
      ],
      expectedComponents: ['CDN Router', 'ABR Controller', 'Cache Warmer'],
      successCriteria: ['Low latency globally', 'Minimal buffering'],
      estimatedTime: '8 minutes'
    }
  ]
};
