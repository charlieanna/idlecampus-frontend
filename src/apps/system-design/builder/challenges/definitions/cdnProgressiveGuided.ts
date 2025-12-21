import { GuidedTutorial } from '../../types/guidedTutorial';

export const cdnProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'cdn-progressive',
  title: 'Design a Content Delivery Network (CDN)',
  description: 'Build a CDN from simple caching proxy to global edge network',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design edge caching with cache hierarchies',
    'Implement content routing and DNS-based load balancing',
    'Build cache invalidation and purging',
    'Handle origin shielding and failover',
    'Optimize for global scale and low latency'
  ],
  prerequisites: ['HTTP/caching', 'DNS', 'Distributed systems'],
  tags: ['cdn', 'caching', 'edge', 'performance', 'global'],

  progressiveStory: {
    title: 'CDN Evolution',
    premise: "You're building a CDN to serve static and dynamic content globally. Starting with a simple caching proxy, you'll evolve to a distributed edge network serving millions of requests per second with sub-100ms latency worldwide.",
    phases: [
      { phase: 1, title: 'Caching Proxy', description: 'Basic HTTP caching' },
      { phase: 2, title: 'Edge Network', description: 'Multiple PoPs and routing' },
      { phase: 3, title: 'Advanced Caching', description: 'Invalidation and optimization' },
      { phase: 4, title: 'Global Scale', description: 'Enterprise features and analytics' }
    ]
  },

  steps: [
    // PHASE 1: Caching Proxy (Steps 1-3)
    {
      id: 'step-1',
      title: 'HTTP Cache Proxy',
      phase: 1,
      phaseTitle: 'Caching Proxy',
      learningObjective: 'Cache HTTP responses correctly',
      thinkingFramework: {
        framework: 'Cache-Control Compliance',
        approach: 'Respect origin headers: Cache-Control, Expires, ETag, Last-Modified. Cache GET requests only (by default). Store response with TTL, serve from cache on hit.',
        keyInsight: 'Cache key = HTTP method + URL + Vary headers. Same URL with different Accept-Encoding = different cache entries.'
      },
      requirements: {
        functional: [
          'Cache HTTP GET responses',
          'Respect Cache-Control headers',
          'Generate cache key from URL and Vary headers',
          'Serve from cache when valid'
        ],
        nonFunctional: [
          'Cache hit latency < 10ms',
          'Cache storage: LRU eviction'
        ]
      },
      hints: [
        'Cache-Control: max-age, s-maxage, no-cache, no-store, private',
        'Key: hash(method + url + vary_header_values)',
        'Storage: in-memory for hot content, disk for overflow'
      ],
      expectedComponents: ['Cache Store', 'HTTP Parser', 'Key Generator'],
      successCriteria: ['Cacheable content cached', 'Cache-Control respected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Origin Fetching',
      phase: 1,
      phaseTitle: 'Caching Proxy',
      learningObjective: 'Fetch from origin on cache miss',
      thinkingFramework: {
        framework: 'Conditional Requests',
        approach: 'Cache miss → fetch from origin. Stale cache → conditional request (If-None-Match, If-Modified-Since). 304 = reuse cached, 200 = update cache.',
        keyInsight: 'Conditional requests save bandwidth. Origin returns 304 Not Modified (no body) if content unchanged. Revalidation cheaper than full fetch.'
      },
      requirements: {
        functional: [
          'Fetch from origin on cache miss',
          'Send conditional requests for stale content',
          'Handle 304 Not Modified responses',
          'Update cache on 200 response'
        ],
        nonFunctional: [
          'Origin timeout: 30 seconds',
          'Retry once on failure'
        ]
      },
      hints: [
        'Conditional: If-None-Match: <etag>, If-Modified-Since: <date>',
        '304: content unchanged, refresh cache TTL',
        'Store ETag and Last-Modified from origin response'
      ],
      expectedComponents: ['Origin Client', 'Conditional Fetcher', 'Cache Updater'],
      successCriteria: ['Cache misses fetch origin', 'Conditional requests work'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Request Coalescing',
      phase: 1,
      phaseTitle: 'Caching Proxy',
      learningObjective: 'Prevent origin overload on cache miss',
      thinkingFramework: {
        framework: 'Thundering Herd Prevention',
        approach: 'Multiple requests for same uncached resource → only one fetches from origin. Others wait for first to complete. Coalesce requests by cache key.',
        keyInsight: 'Popular content expires → 1000 simultaneous requests → 1000 origin fetches. Coalescing: 1 fetch, 999 wait. Prevents origin overload.'
      },
      requirements: {
        functional: [
          'Detect concurrent requests for same resource',
          'Coalesce to single origin request',
          'Queue waiting requests',
          'Serve all from single fetch result'
        ],
        nonFunctional: [
          'Coalescing adds < 5ms latency'
        ]
      },
      hints: [
        'Lock per cache key: first request acquires, others wait',
        'Promise/future pattern: waiting requests share result',
        'Timeout: dont wait forever for slow origin'
      ],
      expectedComponents: ['Request Coalescer', 'Lock Manager', 'Wait Queue'],
      successCriteria: ['Concurrent misses coalesced', 'Origin protected'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Edge Network (Steps 4-6)
    {
      id: 'step-4',
      title: 'Points of Presence (PoPs)',
      phase: 2,
      phaseTitle: 'Edge Network',
      learningObjective: 'Deploy edge servers globally',
      thinkingFramework: {
        framework: 'Geographic Distribution',
        approach: 'Deploy cache servers in multiple regions (PoPs). Users routed to nearest PoP. Each PoP has own cache, independent but consistent behavior.',
        keyInsight: 'PoP placement is strategic. Co-locate with IX (Internet Exchange) for peering. Tier 1: major metros, Tier 2: regional, Tier 3: local.'
      },
      requirements: {
        functional: [
          'Deploy edge servers in multiple regions',
          'Configure origin for each PoP',
          'Independent cache per PoP',
          'Monitor PoP health and capacity'
        ],
        nonFunctional: [
          'Minimum 3 PoPs for redundancy',
          'PoP capacity: 10 Gbps each'
        ]
      },
      hints: [
        'PoP: {id, region, servers: [], origin_config, status}',
        'Regions: us-east, us-west, eu-west, ap-south, ap-east',
        'Health check: synthetic requests every 10 seconds'
      ],
      expectedComponents: ['PoP Manager', 'Server Fleet', 'Health Monitor'],
      successCriteria: ['Multiple PoPs operational', 'Independent caching'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'DNS-Based Routing',
      phase: 2,
      phaseTitle: 'Edge Network',
      learningObjective: 'Route users to nearest PoP via DNS',
      thinkingFramework: {
        framework: 'GeoDNS',
        approach: 'DNS resolves to nearest healthy PoP. Use EDNS Client Subnet for accuracy. Anycast for automatic failover. Low TTL for fast updates.',
        keyInsight: 'DNS TTL tradeoff: low TTL = fast failover but more queries. High TTL = cached but slow failover. Typically 60-300 seconds.'
      },
      requirements: {
        functional: [
          'Resolve CDN domain to nearest PoP',
          'Support EDNS Client Subnet for accuracy',
          'Failover to next-nearest on PoP failure',
          'Configurable routing policies'
        ],
        nonFunctional: [
          'DNS resolution < 50ms',
          'Failover < 60 seconds (TTL)'
        ]
      },
      hints: [
        'GeoDNS: map client IP → geo → nearest PoP IPs',
        'EDNS: resolver sends client subnet, not its own IP',
        'Anycast: same IP announced from multiple PoPs, BGP routes'
      ],
      expectedComponents: ['GeoDNS Server', 'Routing Engine', 'Failover Handler'],
      successCriteria: ['Users routed to nearest PoP', 'Failover works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Cache Hierarchy',
      phase: 2,
      phaseTitle: 'Edge Network',
      learningObjective: 'Build tiered cache architecture',
      thinkingFramework: {
        framework: 'Edge → Shield → Origin',
        approach: 'Edge PoPs serve users. Shield (mid-tier) aggregates edge misses. Shield fetches from origin. Reduces origin load, improves cache hit ratio.',
        keyInsight: 'Shield = regional parent cache. 10 edge PoPs share 1 shield. Shield has higher hit rate (aggregated traffic). Origin sees only shield misses.'
      },
      requirements: {
        functional: [
          'Edge tier: user-facing PoPs',
          'Shield tier: aggregates edge misses',
          'Route edge misses to designated shield',
          'Shield fetches from origin'
        ],
        nonFunctional: [
          'Shield hit ratio > 90%',
          'Edge-to-shield latency < 50ms'
        ]
      },
      hints: [
        'Topology: edges → regional shield → origin',
        'Shield selection: consistent hashing by URL',
        'Shield failover: secondary shield if primary down'
      ],
      expectedComponents: ['Cache Tier Manager', 'Shield Router', 'Hierarchy Config'],
      successCriteria: ['Tiered caching works', 'Origin load reduced'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Advanced Caching (Steps 7-9)
    {
      id: 'step-7',
      title: 'Cache Invalidation',
      phase: 3,
      phaseTitle: 'Advanced Caching',
      learningObjective: 'Purge cached content on demand',
      thinkingFramework: {
        framework: 'Purge Propagation',
        approach: 'API to purge by URL, prefix, or tag. Propagate purge to all PoPs. Soft purge (mark stale) vs hard purge (delete). Handle purge during fetch.',
        keyInsight: 'Instant purge is hard at scale. Purge queue processed async. Trade instant consistency for reliability. Soft purge + revalidation is safer.'
      },
      requirements: {
        functional: [
          'Purge by exact URL',
          'Purge by URL prefix (wildcard)',
          'Purge by cache tag',
          'Propagate purge to all PoPs'
        ],
        nonFunctional: [
          'Purge propagation < 5 seconds',
          'Purge API rate limit: 100/second'
        ]
      },
      hints: [
        'Purge types: url, prefix/*, tag:product-123',
        'Propagation: pub/sub to all PoPs',
        'Soft purge: set stale, serve while revalidating'
      ],
      expectedComponents: ['Purge API', 'Propagator', 'Cache Invalidator'],
      successCriteria: ['Purges propagate globally', 'Content removed promptly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Dynamic Content Caching',
      phase: 3,
      phaseTitle: 'Advanced Caching',
      learningObjective: 'Cache personalized and dynamic content',
      thinkingFramework: {
        framework: 'Edge Compute',
        approach: 'ESI (Edge Side Includes) to assemble pages. Cache fragments by user segment, not user. Edge functions for personalization. Cookie-based cache keys.',
        keyInsight: 'Dont cache per user - cache per segment. Logged-in vs anonymous, premium vs free, region A vs B. Fewer variants, higher hit rate.'
      },
      requirements: {
        functional: [
          'Vary cache by cookie/header',
          'Edge-side includes for page assembly',
          'Cache by user segment (not individual)',
          'Support edge compute functions'
        ],
        nonFunctional: [
          'ESI assembly < 10ms',
          'Edge function timeout: 50ms'
        ]
      },
      hints: [
        'Vary: Cookie (specific cookies only, not whole cookie)',
        'ESI: <esi:include src=\"/user-nav\"/> - cached separately',
        'Segments: anonymous, logged_in, premium - include in key'
      ],
      expectedComponents: ['Vary Handler', 'ESI Processor', 'Edge Functions'],
      successCriteria: ['Dynamic content cacheable', 'Personalization at edge'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Content Optimization',
      phase: 3,
      phaseTitle: 'Advanced Caching',
      learningObjective: 'Optimize content at the edge',
      thinkingFramework: {
        framework: 'On-the-Fly Optimization',
        approach: 'Compress: gzip, brotli based on Accept-Encoding. Resize images at edge. Minify JS/CSS. WebP conversion for supporting browsers.',
        keyInsight: 'Optimization at edge trades CPU for bandwidth. Image resize on edge = one origin image, multiple cached sizes. Worth it for images.'
      },
      requirements: {
        functional: [
          'Compress responses (gzip, brotli)',
          'Resize and optimize images on demand',
          'Convert to modern formats (WebP, AVIF)',
          'Minify JS/CSS'
        ],
        nonFunctional: [
          'Compression ratio: 70%+ for text',
          'Image optimization < 500ms'
        ]
      },
      hints: [
        'Accept-Encoding: gzip, br → choose best supported',
        'Image params: ?width=300&format=webp',
        'Cache optimized variants: key includes optimization params'
      ],
      expectedComponents: ['Compressor', 'Image Optimizer', 'Format Converter'],
      successCriteria: ['Content optimized at edge', 'Bandwidth reduced'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Global Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Origin Shielding & Failover',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Protect and failover origin servers',
      thinkingFramework: {
        framework: 'Origin Protection',
        approach: 'Shield concentrates origin traffic. Rate limit origin requests. Failover to backup origin or stale cache. Health checks with fast failover.',
        keyInsight: 'Stale-while-revalidate: serve stale, async refresh. Stale-if-error: serve stale when origin fails. Better stale than error.'
      },
      requirements: {
        functional: [
          'Configure primary and backup origins',
          'Health check origins continuously',
          'Failover on origin failure',
          'Serve stale on origin error'
        ],
        nonFunctional: [
          'Origin failover < 30 seconds',
          'Stale-if-error: serve for up to 1 hour'
        ]
      },
      hints: [
        'Health check: HEAD / every 10s, 3 failures = unhealthy',
        'Failover: primary down → secondary origin',
        'Stale-if-error: Cache-Control: stale-if-error=3600'
      ],
      expectedComponents: ['Origin Pool', 'Health Checker', 'Failover Manager'],
      successCriteria: ['Origin protected', 'Failover seamless'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Security & DDoS Protection',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Protect against attacks at the edge',
      thinkingFramework: {
        framework: 'Edge Security',
        approach: 'WAF rules at edge: block SQL injection, XSS. Rate limiting by IP/geography. DDoS absorption: edge capacity >> origin. Bot detection.',
        keyInsight: 'CDN is natural DDoS protection. Distributed capacity absorbs volumetric attacks. Edge filtering stops attacks before reaching origin.'
      },
      requirements: {
        functional: [
          'Web Application Firewall (WAF) rules',
          'Rate limiting by IP and geo',
          'DDoS detection and mitigation',
          'Bot detection and challenge'
        ],
        nonFunctional: [
          'Mitigation capacity: 10+ Tbps',
          'WAF latency: < 5ms'
        ]
      },
      hints: [
        'WAF: OWASP rules, custom rules per customer',
        'Rate limit: 1000 req/sec per IP, geo blocking',
        'Bot: JS challenge, CAPTCHA, behavior analysis'
      ],
      expectedComponents: ['WAF Engine', 'Rate Limiter', 'DDoS Mitigator'],
      successCriteria: ['Attacks blocked at edge', 'Origin protected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Analytics & Real-Time Logs',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Provide visibility into CDN performance',
      thinkingFramework: {
        framework: 'Observability at Scale',
        approach: 'Real-time logs streaming (every request). Aggregated analytics (hit ratio, latency, bandwidth). Per-customer dashboards. Alerting on anomalies.',
        keyInsight: 'Log every request at global scale = massive data. Stream to customer in real-time, aggregate for analytics. Sampling for long-term storage.'
      },
      requirements: {
        functional: [
          'Stream real-time access logs',
          'Aggregate metrics (hit ratio, latency percentiles)',
          'Per-customer analytics dashboards',
          'Alert on anomalies (traffic spike, error rate)'
        ],
        nonFunctional: [
          'Log delivery < 60 seconds',
          'Metrics granularity: 1 minute'
        ]
      },
      hints: [
        'Log: {timestamp, url, status, cache_status, latency, bytes, geo}',
        'Streaming: Kafka/Kinesis to customer S3/SIEM',
        'Metrics: Prometheus-style, query via API'
      ],
      expectedComponents: ['Log Streamer', 'Metrics Aggregator', 'Analytics Dashboard'],
      successCriteria: ['Logs streamed in real-time', 'Dashboards accurate'],
      estimatedTime: '8 minutes'
    }
  ]
};
