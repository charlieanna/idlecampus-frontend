import { GuidedTutorial } from '../../types/guidedTutorial';

export const huluProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'hulu-progressive',
  title: 'Design Hulu',
  description: 'Build a streaming platform from video playback to live TV with ads',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design video streaming with adaptive bitrate',
    'Implement ad insertion for streaming content',
    'Build live TV streaming architecture',
    'Handle content licensing and availability',
    'Scale to millions of concurrent viewers'
  ],
  prerequisites: ['Video streaming', 'CDN', 'Ad tech'],
  tags: ['streaming', 'video', 'ads', 'live-tv', 'entertainment'],

  progressiveStory: {
    title: 'Hulu Evolution',
    premise: "You're building a streaming service that combines on-demand content with live TV. Starting with basic video playback, you'll evolve to support ad-insertion, live streaming, and personalized recommendations.",
    phases: [
      { phase: 1, title: 'On-Demand', description: 'Video streaming basics' },
      { phase: 2, title: 'Advertising', description: 'Ad-supported streaming' },
      { phase: 3, title: 'Live TV', description: 'Real-time broadcast' },
      { phase: 4, title: 'Platform', description: 'Scale and personalization' }
    ]
  },

  steps: [
    // PHASE 1: On-Demand (Steps 1-3)
    {
      id: 'step-1',
      title: 'Video Ingestion and Encoding',
      phase: 1,
      phaseTitle: 'On-Demand',
      learningObjective: 'Process video for streaming delivery',
      thinkingFramework: {
        framework: 'Transcoding Pipeline',
        approach: 'Ingest source video → transcode to multiple bitrates → segment into chunks → package for streaming (HLS/DASH). Store in origin.',
        keyInsight: 'ABR (Adaptive Bitrate) needs multiple qualities. 480p, 720p, 1080p, 4K. Each quality has segments. Player switches based on bandwidth.'
      },
      requirements: {
        functional: [
          'Ingest video from content providers',
          'Transcode to multiple bitrates',
          'Generate HLS/DASH manifests',
          'Extract thumbnails and metadata'
        ],
        nonFunctional: [
          'Encoding time < 2x video duration',
          'Support 4K HDR source'
        ]
      },
      hints: [
        'Bitrates: 480p@1.5Mbps, 720p@3Mbps, 1080p@6Mbps, 4K@15Mbps',
        'Segments: 6-10 second chunks for fast switching',
        'Manifest: m3u8 (HLS) or mpd (DASH) listing all qualities'
      ],
      expectedComponents: ['Ingest Service', 'Transcoder', 'Packager'],
      successCriteria: ['Videos encoded', 'Manifests generated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Video Playback',
      phase: 1,
      phaseTitle: 'On-Demand',
      learningObjective: 'Stream video with adaptive quality',
      thinkingFramework: {
        framework: 'ABR Streaming',
        approach: 'Player fetches manifest → downloads segments → measures bandwidth → switches quality. Buffer management for smooth playback.',
        keyInsight: 'Buffer is key to smooth playback. Too small = rebuffering. Too large = slow start. Start with low quality, ramp up as bandwidth allows.'
      },
      requirements: {
        functional: [
          'Fetch and parse manifest',
          'Download and play segments',
          'Adaptive bitrate switching',
          'Seek and resume playback'
        ],
        nonFunctional: [
          'Time to first frame < 2 seconds',
          'Rebuffer rate < 1%'
        ]
      },
      hints: [
        'Buffer: target 30 seconds ahead',
        'ABR algorithm: measure download speed, pick sustainable quality',
        'Seek: find nearest segment, start from there'
      ],
      expectedComponents: ['Video Player', 'ABR Controller', 'Buffer Manager'],
      successCriteria: ['Playback smooth', 'Quality adapts'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Content Library',
      phase: 1,
      phaseTitle: 'On-Demand',
      learningObjective: 'Organize and browse video content',
      thinkingFramework: {
        framework: 'Content Catalog',
        approach: 'Movies and TV shows with metadata. Series → seasons → episodes hierarchy. Categories, genres, networks. Search and browse.',
        keyInsight: 'Content organization matters for discovery. TV shows are complex: series metadata, season metadata, episode metadata. All linked correctly.'
      },
      requirements: {
        functional: [
          'Movies and TV show catalog',
          'Series/season/episode hierarchy',
          'Browse by genre, network',
          'Search by title, actor, director'
        ],
        nonFunctional: [
          'Catalog load < 500ms',
          'Search < 300ms'
        ]
      },
      hints: [
        'Series: {id, title, description, seasons: [{episodes: []}]}',
        'Content: {id, type: movie|episode, video_id, metadata}',
        'Browse: pre-computed genre/network rows'
      ],
      expectedComponents: ['Content Store', 'Browse API', 'Search Index'],
      successCriteria: ['Catalog displays', 'Search works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Advertising (Steps 4-6)
    {
      id: 'step-4',
      title: 'Ad Break Insertion',
      phase: 2,
      phaseTitle: 'Advertising',
      learningObjective: 'Insert ads at appropriate points in content',
      thinkingFramework: {
        framework: 'SSAI vs CSAI',
        approach: 'Server-side ad insertion (SSAI) stitches ads into stream. Client-side (CSAI) plays separate ad stream. SSAI defeats ad blockers.',
        keyInsight: 'SSAI is preferred for streaming. Ads look like content, same CDN. No ad blocker bypass. Personalized ads per viewer even in same content.'
      },
      requirements: {
        functional: [
          'Define ad break cue points',
          'Fetch ads for viewer',
          'Stitch ads into stream (SSAI)',
          'Track ad impressions'
        ],
        nonFunctional: [
          'Ad decision < 200ms',
          'Seamless stitching'
        ]
      },
      hints: [
        'Cue points: timestamps where ads can insert (scene changes)',
        'SSAI: modify manifest to include ad segments',
        'Tracking: beacon URLs in manifest, player pings on play'
      ],
      expectedComponents: ['Ad Decisioning', 'Manifest Manipulator', 'Tracking Service'],
      successCriteria: ['Ads insert correctly', 'Tracking works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Ad Targeting',
      phase: 2,
      phaseTitle: 'Advertising',
      learningObjective: 'Serve relevant ads to viewers',
      thinkingFramework: {
        framework: 'Audience Targeting',
        approach: 'Target by: demographics, content genre, viewing history, device. Real-time bidding for premium inventory. Frequency capping.',
        keyInsight: 'Better targeting = higher CPM. Advertiser pays more for reaching right audience. Balance: privacy vs personalization.'
      },
      requirements: {
        functional: [
          'Demographic targeting',
          'Content-based targeting',
          'Behavioral targeting',
          'Frequency capping'
        ],
        nonFunctional: [
          'Ad selection < 100ms',
          'Privacy compliance (CCPA, GDPR)'
        ]
      },
      hints: [
        'Segments: {demo: 25-34, interests: [sports], device: roku}',
        'Frequency cap: max 3 impressions per ad per user per day',
        'Privacy: user opt-out, data retention limits'
      ],
      expectedComponents: ['Targeting Engine', 'Audience Manager', 'Privacy Controls'],
      successCriteria: ['Ads targeted correctly', 'Caps enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Ad-Free Tier',
      phase: 2,
      phaseTitle: 'Advertising',
      learningObjective: 'Support multiple subscription tiers',
      thinkingFramework: {
        framework: 'Tiered Subscriptions',
        approach: 'Ad-supported (cheaper), ad-free (premium), live TV bundles. Entitlements determine experience. Upgrade/downgrade flows.',
        keyInsight: 'Tiers maximize revenue. Price-sensitive users accept ads. Premium users pay more for no ads. Live TV is separate upsell.'
      },
      requirements: {
        functional: [
          'Multiple subscription plans',
          'Entitlement checking',
          'Skip ads for premium users',
          'Plan upgrade/downgrade'
        ],
        nonFunctional: [
          'Entitlement check < 50ms'
        ]
      },
      hints: [
        'Plans: ad_supported, no_ads, live_tv_bundle',
        'Entitlement: {user_id, plan, features: [no_ads, live_tv, downloads]}',
        'Stream decision: check entitlements, skip ad insertion if no_ads'
      ],
      expectedComponents: ['Subscription Manager', 'Entitlement Service', 'Billing'],
      successCriteria: ['Tiers work correctly', 'Billing accurate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Live TV (Steps 7-9)
    {
      id: 'step-7',
      title: 'Live Stream Ingestion',
      phase: 3,
      phaseTitle: 'Live TV',
      learningObjective: 'Ingest and distribute live broadcasts',
      thinkingFramework: {
        framework: 'Live Pipeline',
        approach: 'Receive live feed from broadcaster → real-time transcode → segment → distribute. Low latency critical. Redundancy for reliability.',
        keyInsight: 'Live is different from VOD. Segments created in real-time. Glass-to-glass latency matters for sports. Dual ingest paths for failover.'
      },
      requirements: {
        functional: [
          'Ingest live feeds (RTMP, SRT)',
          'Real-time transcoding',
          'Generate live manifest',
          'Support 100+ channels'
        ],
        nonFunctional: [
          'End-to-end latency < 30 seconds',
          'No single point of failure'
        ]
      },
      hints: [
        'Ingest: RTMP/SRT from broadcaster, dual paths',
        'Transcode: real-time, multiple qualities in parallel',
        'Manifest: sliding window of segments, update every chunk'
      ],
      expectedComponents: ['Live Ingest', 'Real-Time Encoder', 'Live Packager'],
      successCriteria: ['Live streams work', 'Low latency'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'TV Guide and EPG',
      phase: 3,
      phaseTitle: 'Live TV',
      learningObjective: 'Display program schedule and navigation',
      thinkingFramework: {
        framework: 'Electronic Program Guide',
        approach: 'Schedule data from providers. Grid view by channel and time. What\'s on now. Upcoming shows. Set reminders.',
        keyInsight: 'EPG is primary navigation for live TV. Must be fast and accurate. Pre-fetch schedule data. Handle timezone correctly.'
      },
      requirements: {
        functional: [
          'Grid view of channels and times',
          'What\'s on now across all channels',
          'Program details',
          'Set reminders'
        ],
        nonFunctional: [
          'EPG load < 500ms',
          'Schedule accuracy: real-time updates'
        ]
      },
      hints: [
        'Schedule: [{channel_id, start, end, program}] - 2 weeks ahead',
        'Grid: virtualized rendering for performance',
        'On now: filter by current time, update every minute'
      ],
      expectedComponents: ['EPG Data Service', 'Grid Renderer', 'Reminder Service'],
      successCriteria: ['Guide displays correctly', 'Navigation smooth'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Cloud DVR',
      phase: 3,
      phaseTitle: 'Live TV',
      learningObjective: 'Record and playback live content',
      thinkingFramework: {
        framework: 'Network DVR',
        approach: 'Record live streams to storage. Per-user recording lists. Storage quotas. Fast-forward through ads (or not, based on rights).',
        keyInsight: 'Cloud DVR is storage-efficient. One recording, many users. But rights are complex: some content cant be recorded, some cant skip ads.'
      },
      requirements: {
        functional: [
          'Schedule recordings from EPG',
          'Record series automatically',
          'Playback recordings',
          'Storage quota management'
        ],
        nonFunctional: [
          'Recording starts within 5 seconds',
          'Storage quota: 50 hours typical'
        ]
      },
      hints: [
        'Recording: {user_id, program_id, start, end, video_url}',
        'Series link: auto-record all episodes of series',
        'Rights: {program_id, allow_record, allow_ffwd_ads}'
      ],
      expectedComponents: ['Recording Scheduler', 'DVR Storage', 'Rights Manager'],
      successCriteria: ['Recordings work', 'Quotas enforced'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Content Recommendations',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Personalize content discovery',
      thinkingFramework: {
        framework: 'Watch-Based Recommendations',
        approach: 'Learn from viewing history. Similar content (genre, actors). "Because you watched X". Continue watching. Trending.',
        keyInsight: 'Homepage real estate is valuable. Personalized rows increase engagement. Balance: personalization vs discovery of new genres.'
      },
      requirements: {
        functional: [
          'Personalized home rows',
          'Continue watching',
          'Because you watched X',
          'Trending content'
        ],
        nonFunctional: [
          'Home load < 1 second',
          'Recommendations refresh hourly'
        ]
      },
      hints: [
        'Signals: watch history, completion rate, search, ratings',
        'Rows: continue_watching, trending, genre rows, similar_to_X',
        'Cold start: popular content, onboarding preferences'
      ],
      expectedComponents: ['Recommendation Engine', 'Home Builder', 'Watch History'],
      successCriteria: ['Recommendations relevant', 'Engagement up'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Content Availability',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle complex licensing and windowing',
      thinkingFramework: {
        framework: 'Rights Management',
        approach: 'Content licensed by territory, time window, platform. Same content available differently in US vs UK. Expires and becomes unavailable.',
        keyInsight: 'Licensing is complex. Movie on Hulu until March, then moves to HBO. Some content US-only. Must check rights before every play.'
      },
      requirements: {
        functional: [
          'Territory-based availability',
          'Time-windowed licensing',
          'Platform restrictions (mobile, web, TV)',
          'Expiring content warnings'
        ],
        nonFunctional: [
          'Rights check < 100ms',
          'Accurate to the second for windows'
        ]
      },
      hints: [
        'License: {content_id, territories, start, end, platforms}',
        'Check: on browse (filter), on play (block if not entitled)',
        'Expiring: show banner "leaving in X days"'
      ],
      expectedComponents: ['Rights Database', 'Availability Checker', 'Expiry Notifier'],
      successCriteria: ['Rights enforced', 'Accurate availability'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Reliability',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle peak viewing events',
      thinkingFramework: {
        framework: 'Live Event Scale',
        approach: 'Big events = millions concurrent. Multi-CDN for capacity. Origin shielding. Graceful degradation. Pre-warm for known events.',
        keyInsight: 'Super Bowl = 10x normal traffic. Cant just auto-scale. Pre-provision CDN, warm caches, have runbook. Graceful degradation: drop quality before dropping users.'
      },
      requirements: {
        functional: [
          'Multi-CDN delivery',
          'Origin shielding',
          'Graceful degradation',
          'Real-time monitoring'
        ],
        nonFunctional: [
          'Support 10M concurrent streams',
          '99.99% availability'
        ]
      },
      hints: [
        'CDN: multiple providers, DNS-based steering',
        'Shield: cache layer between origin and edge',
        'Degradation: reduce quality tiers before refusing connections'
      ],
      expectedComponents: ['CDN Router', 'Shield Layer', 'Load Shedder'],
      successCriteria: ['Handles peak load', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
