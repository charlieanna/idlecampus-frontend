import { GuidedTutorial } from '../../types/guidedTutorial';

export const webCrawlerProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'web-crawler-progressive',
  title: 'Design a Web Crawler',
  description: 'Build a web crawler from single-threaded fetcher to distributed search engine crawler',
  difficulty: 'hard',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Implement polite crawling with robots.txt and rate limiting',
    'Design URL frontier with priority queuing',
    'Build distributed crawler with work stealing',
    'Handle deduplication at billion-page scale',
    'Extract and index content for search'
  ],
  prerequisites: ['HTTP basics', 'Distributed systems', 'Queue-based architectures'],
  tags: ['web-crawler', 'distributed-systems', 'search', 'data-pipeline'],

  progressiveStory: {
    title: 'Web Crawler Evolution',
    premise: "You're building a web crawler for a search engine. Starting with crawling a single site, you'll scale to crawl the entire web while respecting site policies and handling the chaos of real-world HTML.",
    phases: [
      { phase: 1, title: 'Single Site Crawler', description: 'Basic fetching with politeness' },
      { phase: 2, title: 'Multi-Site Crawler', description: 'Handle multiple domains with scheduling' },
      { phase: 3, title: 'Distributed Crawler', description: 'Scale to billions of pages' },
      { phase: 4, title: 'Search Integration', description: 'Content extraction and indexing' }
    ]
  },

  steps: [
    // PHASE 1: Single Site Crawler (Steps 1-3)
    {
      id: 'step-1',
      title: 'Basic URL Fetching',
      phase: 1,
      phaseTitle: 'Single Site Crawler',
      learningObjective: 'Fetch web pages and extract links',
      thinkingFramework: {
        framework: 'Start with Core Loop',
        approach: 'Crawler core: fetch URL → parse HTML → extract links → add to queue → repeat. Get this loop working first, then add complexity.',
        keyInsight: 'HTTP is messy: redirects, timeouts, encoding issues, malformed HTML. Handle errors gracefully, dont let one bad page crash the crawler.'
      },
      requirements: {
        functional: [
          'Fetch web page by URL',
          'Parse HTML to extract links',
          'Normalize URLs (relative to absolute, remove fragments)',
          'Queue discovered links for crawling'
        ],
        nonFunctional: []
      },
      hints: [
        'Use HEAD request first to check content type',
        'Handle redirects (301, 302) up to limit (5)',
        'Set User-Agent header identifying your crawler'
      ],
      expectedComponents: ['Fetcher', 'HTML Parser', 'URL Normalizer', 'Link Queue'],
      successCriteria: ['Pages fetched successfully', 'Links extracted and normalized'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Robots.txt Compliance',
      phase: 1,
      phaseTitle: 'Single Site Crawler',
      learningObjective: 'Respect site crawling policies',
      thinkingFramework: {
        framework: 'Polite Crawling',
        approach: 'robots.txt tells crawlers what they can/cannot crawl. Always fetch and obey it. Being blocked is worse than being slow.',
        keyInsight: 'Cache robots.txt per domain (TTL ~1 day). Parse once, check many. Most sites allow crawling with some exclusions.'
      },
      requirements: {
        functional: [
          'Fetch and parse robots.txt before crawling domain',
          'Respect Disallow directives for your user-agent',
          'Honor Crawl-delay if specified',
          'Cache robots.txt to avoid refetching'
        ],
        nonFunctional: []
      },
      hints: [
        'Fetch robots.txt first: domain.com/robots.txt',
        'Handle missing robots.txt (assume allow all)',
        'Match user-agent patterns (* and specific)'
      ],
      expectedComponents: ['Robots Parser', 'Robots Cache', 'Policy Checker'],
      successCriteria: ['Disallowed paths not crawled', 'Crawl-delay respected'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Rate Limiting Per Domain',
      phase: 1,
      phaseTitle: 'Single Site Crawler',
      learningObjective: 'Avoid overloading target servers',
      thinkingFramework: {
        framework: 'Be a Good Citizen',
        approach: 'Even without Crawl-delay, dont hammer servers. Default to 1 request per second per domain. Spread load across domains.',
        keyInsight: 'Track last fetch time per domain. Delay next request if too soon. This is critical for not getting blocked.'
      },
      requirements: {
        functional: [
          'Limit requests per domain (default 1/sec)',
          'Track last request time per domain',
          'Queue requests and respect delay',
          'Allow override via robots.txt Crawl-delay'
        ],
        nonFunctional: []
      },
      hints: [
        'Map: domain → last_fetch_timestamp',
        'Calculate delay: max(0, min_delay - (now - last_fetch))',
        'Use priority queue sorted by eligible_time'
      ],
      expectedComponents: ['Rate Limiter', 'Domain Tracker', 'Delay Queue'],
      successCriteria: ['No domain hit faster than limit', 'Multiple domains crawled concurrently'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Multi-Site Crawler (Steps 4-6)
    {
      id: 'step-4',
      title: 'URL Frontier Design',
      phase: 2,
      phaseTitle: 'Multi-Site Crawler',
      learningObjective: 'Manage crawl queue with priorities',
      thinkingFramework: {
        framework: 'Priority Queue with Constraints',
        approach: 'Not all URLs are equal. Prioritize by: freshness need, page importance, domain rate limits. The frontier manages what to crawl next.',
        keyInsight: 'Two-level queue: front queue (priority) feeds back queue (per-domain). This separates priority from politeness.'
      },
      requirements: {
        functional: [
          'Priority queue for URL importance',
          'Per-domain queues for rate limiting',
          'Seed URLs to bootstrap crawl',
          'Handle queue persistence (survive restarts)'
        ],
        nonFunctional: [
          'Support 100M+ URLs in queue'
        ]
      },
      hints: [
        'Front queue: priority heap',
        'Back queue: domain → queue, with rate limit selector',
        'Persist to disk/DB for durability'
      ],
      expectedComponents: ['URL Frontier', 'Priority Queue', 'Domain Queues', 'Persistence Layer'],
      successCriteria: ['High-priority URLs crawled first', 'Rate limits still respected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'URL Deduplication',
      phase: 2,
      phaseTitle: 'Multi-Site Crawler',
      learningObjective: 'Avoid crawling the same URL twice',
      thinkingFramework: {
        framework: 'Memory-Efficient Set Membership',
        approach: 'With billions of URLs, you cant store them all in memory. Use Bloom filter for approximate membership test, with DB backing for false positives.',
        keyInsight: 'Bloom filter: O(1) check, O(k) memory. 1% false positive is okay - you just re-crawl 1% of pages occasionally.'
      },
      requirements: {
        functional: [
          'Check if URL already crawled before fetching',
          'Normalize URLs before dedup (trailing slash, www)',
          'Handle URL canonicalization (rel=canonical)',
          'Memory-efficient storage for billions of URLs'
        ],
        nonFunctional: [
          'Support 10B URLs with <10GB memory'
        ]
      },
      hints: [
        'Bloom filter for fast negative check',
        'On positive, verify in persistent store',
        'Hash URL: SHA256 for storage, truncated for bloom'
      ],
      expectedComponents: ['Bloom Filter', 'URL Normalizer', 'Seen URL Store'],
      successCriteria: ['No duplicate fetches', 'Memory usage bounded'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Content Deduplication',
      phase: 2,
      phaseTitle: 'Multi-Site Crawler',
      learningObjective: 'Detect and handle duplicate content',
      thinkingFramework: {
        framework: 'Near-Duplicate Detection',
        approach: 'Same content at different URLs is common (mirrors, pagination). Use content fingerprinting (simhash) to detect near-duplicates.',
        keyInsight: 'Exact duplicates: content hash. Near-duplicates: simhash (tolerates small changes). Both matter for crawl efficiency.'
      },
      requirements: {
        functional: [
          'Hash page content to detect exact duplicates',
          'Use simhash for near-duplicate detection',
          'Track canonical URL for duplicate groups',
          'Skip indexing duplicates, just note the mapping'
        ],
        nonFunctional: []
      },
      hints: [
        'MD5/SHA256 for exact duplicate',
        'Simhash: hash shingles, aggregate with XOR',
        'Hamming distance < 3 = near-duplicate'
      ],
      expectedComponents: ['Content Hasher', 'Simhash Calculator', 'Duplicate Store'],
      successCriteria: ['Duplicates detected efficiently', 'Storage not wasted on copies'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Distributed Crawler (Steps 7-9)
    {
      id: 'step-7',
      title: 'Distributed Architecture',
      phase: 3,
      phaseTitle: 'Distributed Crawler',
      learningObjective: 'Scale crawling across multiple machines',
      thinkingFramework: {
        framework: 'Partition by Domain',
        approach: 'Assign domains to crawler nodes. Each node owns its domains, respects their rate limits, maintains their state. Coordination only for work stealing.',
        keyInsight: 'Consistent hashing for domain → node mapping. When nodes join/leave, minimal redistribution.'
      },
      requirements: {
        functional: [
          'Distribute domains across crawler nodes',
          'Each node responsible for its domains rate limits',
          'Handle node failures with reassignment',
          'Central coordinator for work distribution'
        ],
        nonFunctional: [
          'Scale to 1000+ crawler nodes',
          'Handle node failure in < 1 minute'
        ]
      },
      hints: [
        'Consistent hashing: domain hash → ring → node',
        'Zookeeper/etcd for node membership',
        'Work stealing for load balancing'
      ],
      expectedComponents: ['Crawler Nodes', 'Coordinator', 'Domain Partitioner', 'Health Monitor'],
      successCriteria: ['Work distributed evenly', 'Node failure handled gracefully'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Crawl Scheduling & Freshness',
      phase: 3,
      phaseTitle: 'Distributed Crawler',
      learningObjective: 'Re-crawl pages to keep content fresh',
      thinkingFramework: {
        framework: 'Adaptive Scheduling',
        approach: 'Pages change at different rates. News hourly, Wikipedia daily, static pages monthly. Learn change frequency, schedule recrawls accordingly.',
        keyInsight: 'Track last-modified, content hash changes. If page changed 5 times in last 10 crawls, crawl more often.'
      },
      requirements: {
        functional: [
          'Schedule recrawls based on page change frequency',
          'Prioritize important/fresh pages',
          'Handle If-Modified-Since for efficient recrawls',
          'Learn optimal crawl frequency per page'
        ],
        nonFunctional: [
          'Maintain freshness index: 90% of pages crawled within 2x their change interval'
        ]
      },
      hints: [
        'Store: page_id → {last_crawl, change_count, crawl_count}',
        'Crawl interval: base_interval / change_rate',
        'Use 304 Not Modified to save bandwidth'
      ],
      expectedComponents: ['Scheduler', 'Freshness Tracker', 'Change Detector'],
      successCriteria: ['Frequently changing pages crawled often', 'Stable pages crawled rarely'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Crawl Traps & Adversarial Content',
      phase: 3,
      phaseTitle: 'Distributed Crawler',
      learningObjective: 'Handle infinite loops and hostile sites',
      thinkingFramework: {
        framework: 'Defensive Crawling',
        approach: 'Some sites have infinite calendars, session IDs in URLs, or deliberately trap crawlers. Detect and escape these traps.',
        keyInsight: 'Limit depth per path, limit URLs per domain, detect URL patterns that grow infinitely (?page=1, ?page=2, ...).'
      },
      requirements: {
        functional: [
          'Limit crawl depth from seed URL',
          'Limit total URLs per domain',
          'Detect and skip URL pattern traps',
          'Timeout long-running fetches'
        ],
        nonFunctional: [
          'No crawler stuck on single domain > 1 hour'
        ]
      },
      hints: [
        'Track path depth: count / in normalized URL',
        'Detect patterns: if URL only differs by number, limit',
        'Blacklist known trap patterns (calendar, session)'
      ],
      expectedComponents: ['Trap Detector', 'Depth Limiter', 'Pattern Matcher', 'Timeout Handler'],
      successCriteria: ['Crawler escapes traps', 'Resources not exhausted by hostile sites'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Search Integration (Steps 10-12)
    {
      id: 'step-10',
      title: 'Content Extraction & Parsing',
      phase: 4,
      phaseTitle: 'Search Integration',
      learningObjective: 'Extract meaningful content from HTML',
      thinkingFramework: {
        framework: 'Signal Extraction',
        approach: 'Raw HTML is noisy. Extract: title, main content, metadata, structured data (Schema.org). Filter boilerplate (nav, footer, ads).',
        keyInsight: 'Boilerplate detection: text density ratio. Main content has high text/tag ratio, boilerplate has low.'
      },
      requirements: {
        functional: [
          'Extract title, description, keywords',
          'Identify and extract main content block',
          'Parse structured data (JSON-LD, microdata)',
          'Detect page language'
        ],
        nonFunctional: []
      },
      hints: [
        'Use readability algorithms for main content',
        'Text density = text_chars / tag_count',
        'Handle JavaScript-rendered content with headless browser'
      ],
      expectedComponents: ['Content Extractor', 'Boilerplate Remover', 'Structured Data Parser', 'Language Detector'],
      successCriteria: ['Clean content extracted', 'Metadata captured'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Index Building Pipeline',
      phase: 4,
      phaseTitle: 'Search Integration',
      learningObjective: 'Build searchable index from crawled content',
      thinkingFramework: {
        framework: 'Inverted Index Construction',
        approach: 'Search needs inverted index: word → list of documents. Build in batch (map-reduce) or incrementally (streaming).',
        keyInsight: 'Tokenize → normalize (lowercase, stem) → build postings lists → merge. This is the core of search indexing.'
      },
      requirements: {
        functional: [
          'Tokenize extracted content',
          'Build inverted index (term → documents)',
          'Store document metadata (URL, title, snippet)',
          'Support incremental index updates'
        ],
        nonFunctional: [
          'Index 1M documents/hour'
        ]
      },
      hints: [
        'MapReduce: map(doc) → [(term, doc_id)], reduce → posting lists',
        'Use LSM tree for incremental updates',
        'Compress posting lists (delta encoding)'
      ],
      expectedComponents: ['Tokenizer', 'Index Builder', 'Document Store', 'Merger'],
      successCriteria: ['Index supports fast term lookup', 'Updates propagate quickly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Link Analysis & PageRank',
      phase: 4,
      phaseTitle: 'Search Integration',
      learningObjective: 'Compute page importance from link structure',
      thinkingFramework: {
        framework: 'Graph-Based Ranking',
        approach: 'Links are votes. PageRank: page importance = sum of importance passed by linking pages. Iteratively compute until convergence.',
        keyInsight: 'PageRank handles web scale with iteration. Each iteration: PR(p) = (1-d) + d * sum(PR(q)/outlinks(q)) for all q linking to p.'
      },
      requirements: {
        functional: [
          'Build link graph from crawled pages',
          'Compute PageRank scores iteratively',
          'Handle dangling pages (no outlinks)',
          'Update scores as new pages crawled'
        ],
        nonFunctional: [
          'Compute PageRank over 1B pages in < 1 day'
        ]
      },
      hints: [
        'Store link graph: page_id → [outlink_ids]',
        'Damping factor d = 0.85 (standard)',
        'Use MapReduce for distributed computation'
      ],
      expectedComponents: ['Link Graph Builder', 'PageRank Calculator', 'Score Store'],
      successCriteria: ['PageRank scores computed', 'Important pages ranked higher'],
      estimatedTime: '10 minutes'
    }
  ]
};
