import { GuidedTutorial } from '../../types/guidedTutorial';

export const distributedEmailServiceProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'distributed-email-service-progressive',
  title: 'Design Distributed Email Service',
  description: 'Build a scalable email service from basic sending to Gmail-scale with search, threading, and deliverability',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design email sending and receiving pipelines',
    'Implement email storage and threading',
    'Build full-text search over emails',
    'Handle spam filtering and deliverability',
    'Scale to billions of emails per day'
  ],
  prerequisites: ['SMTP protocol', 'Distributed storage', 'Search engines'],
  tags: ['email', 'smtp', 'messaging', 'search', 'deliverability'],

  progressiveStory: {
    title: 'Distributed Email Service Evolution',
    premise: "You're building an email service like Gmail. Starting with basic SMTP sending and receiving, you'll evolve to support threading, search, spam filtering, and massive scale handling billions of emails daily.",
    phases: [
      { phase: 1, title: 'Core', description: 'Send and receive emails' },
      { phase: 2, title: 'Storage', description: 'Store and organize emails' },
      { phase: 3, title: 'Features', description: 'Search, threading, spam' },
      { phase: 4, title: 'Scale', description: 'Billions of emails' }
    ]
  },

  steps: [
    // PHASE 1: Core (Steps 1-3)
    {
      id: 'step-1',
      title: 'Email Sending Pipeline',
      phase: 1,
      phaseTitle: 'Core',
      learningObjective: 'Send emails via SMTP',
      thinkingFramework: {
        framework: 'Outbound Email',
        approach: 'User composes email → Queue for sending → DNS lookup for recipient MX → SMTP connection → Deliver. Handle retries for temporary failures. Track delivery status.',
        keyInsight: 'Email sending is async and unreliable. Recipient server may reject, rate limit, or be down. Queue with exponential backoff retries. Track status: queued → sending → delivered/bounced.'
      },
      requirements: {
        functional: [
          'Accept email from user (API/SMTP)',
          'Queue email for delivery',
          'Lookup recipient MX records',
          'Deliver via SMTP'
        ],
        nonFunctional: [
          'Send latency < 30 seconds',
          'Retry up to 72 hours'
        ]
      },
      hints: [
        'MX lookup: DNS query for recipient domain MX records',
        'SMTP: connect to MX server, send MAIL FROM, RCPT TO, DATA',
        'Queue: persistent queue with retry backoff'
      ],
      expectedComponents: ['Send Queue', 'MX Resolver', 'SMTP Client'],
      successCriteria: ['Emails sent', 'Retries work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Email Receiving Pipeline',
      phase: 1,
      phaseTitle: 'Core',
      learningObjective: 'Receive emails via SMTP',
      thinkingFramework: {
        framework: 'Inbound Email',
        approach: 'Run SMTP server on port 25. Accept connections from other mail servers. Validate recipient exists. Store email. Send to processing pipeline (spam check, filtering).',
        keyInsight: 'Receiving email means running a public SMTP server. Anyone can connect. Must validate: is recipient valid? Is sender legitimate (SPF/DKIM)? Is content safe? Then route to user inbox.'
      },
      requirements: {
        functional: [
          'Run SMTP server (port 25)',
          'Accept incoming emails',
          'Validate recipient address',
          'Queue for processing'
        ],
        nonFunctional: [
          'Handle 10K connections/sec',
          'Accept email < 5 seconds'
        ]
      },
      hints: [
        'SMTP server: listen on 25, handle EHLO, MAIL FROM, RCPT TO, DATA',
        'Validation: check recipient exists before accepting',
        'Queue: store raw email, async processing'
      ],
      expectedComponents: ['SMTP Server', 'Recipient Validator', 'Inbound Queue'],
      successCriteria: ['Emails received', 'Validation works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Email Authentication (SPF/DKIM/DMARC)',
      phase: 1,
      phaseTitle: 'Core',
      learningObjective: 'Verify sender authenticity',
      thinkingFramework: {
        framework: 'Email Authentication',
        approach: 'SPF: verify sending IP is authorized. DKIM: verify email signature matches domain. DMARC: policy for SPF/DKIM failures. Essential for spam prevention and deliverability.',
        keyInsight: 'Without authentication, anyone can send email "from" any address. SPF/DKIM prove sender is authorized. Major providers (Gmail, Outlook) require authentication or emails go to spam.'
      },
      requirements: {
        functional: [
          'Check SPF record for sender IP',
          'Verify DKIM signature',
          'Apply DMARC policy',
          'Sign outgoing emails with DKIM'
        ],
        nonFunctional: [
          'Auth check < 100ms',
          'DKIM signing < 10ms'
        ]
      },
      hints: [
        'SPF: DNS TXT lookup, check if sender IP in allowed list',
        'DKIM: extract signature header, DNS lookup for public key, verify',
        'DMARC: DNS lookup for policy, apply pass/quarantine/reject'
      ],
      expectedComponents: ['SPF Checker', 'DKIM Verifier', 'DMARC Enforcer'],
      successCriteria: ['Incoming auth checked', 'Outgoing signed'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Storage (Steps 4-6)
    {
      id: 'step-4',
      title: 'Email Storage Design',
      phase: 2,
      phaseTitle: 'Storage',
      learningObjective: 'Store emails efficiently',
      thinkingFramework: {
        framework: 'Email Data Model',
        approach: 'Email has headers, body (text/HTML), attachments. Store metadata separately from body and attachments. Deduplicate attachments across emails. Support mailboxes (inbox, sent, trash).',
        keyInsight: 'Emails are write-once, read-many. Optimize for reads. Separate hot (metadata for list view) from cold (body for detail view). Deduplicate attachments - same PDF sent to 100 people stored once.'
      },
      requirements: {
        functional: [
          'Store email headers and metadata',
          'Store body (text and HTML)',
          'Store attachments with deduplication',
          'Organize by mailbox/folder'
        ],
        nonFunctional: [
          'Metadata query < 50ms',
          'Body fetch < 200ms'
        ]
      },
      hints: [
        'Schema: {id, user_id, mailbox, from, to, subject, snippet, has_attachments, received_at}',
        'Body: separate table or blob storage',
        'Attachments: content-addressed storage (hash → blob)'
      ],
      expectedComponents: ['Email Store', 'Attachment Store', 'Mailbox Manager'],
      successCriteria: ['Emails stored', 'Mailboxes work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Folder and Label System',
      phase: 2,
      phaseTitle: 'Storage',
      learningObjective: 'Organize emails with folders and labels',
      thinkingFramework: {
        framework: 'Organization System',
        approach: 'Traditional folders (one email, one folder) vs Gmail labels (one email, multiple labels). Labels more flexible. System labels (inbox, sent, spam) plus user labels. Label = cheap metadata.',
        keyInsight: 'Gmail doesnt have folders - everything is labels. Inbox is a label. Archive = remove Inbox label. Trash = add Trash label + schedule deletion. More flexible than folders.'
      },
      requirements: {
        functional: [
          'Create user-defined labels',
          'Apply multiple labels to email',
          'System labels (inbox, sent, spam, trash)',
          'Move to trash (scheduled deletion)'
        ],
        nonFunctional: [
          'Label operation < 10ms',
          'List by label < 100ms'
        ]
      },
      hints: [
        'Label: {id, user_id, name, color, type: system|user}',
        'Email-Label: {email_id, label_id} many-to-many',
        'Trash: add trash label, delete after 30 days'
      ],
      expectedComponents: ['Label Manager', 'Email-Label Store', 'Trash Cleaner'],
      successCriteria: ['Labels work', 'Multi-label supported'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Email Threading',
      phase: 2,
      phaseTitle: 'Storage',
      learningObjective: 'Group emails into conversations',
      thinkingFramework: {
        framework: 'Thread Detection',
        approach: 'Group related emails into threads/conversations. Use In-Reply-To and References headers. Fallback: subject line matching (Re: prefix). Thread = list of emails sorted by date.',
        keyInsight: 'Threading transforms inbox from email list to conversation list. Match by Message-ID references first (reliable). Fallback to subject similarity (handles broken references). Gmail-style conversation view.'
      },
      requirements: {
        functional: [
          'Parse In-Reply-To and References headers',
          'Group emails into threads',
          'Handle broken reference chains',
          'Display thread as conversation'
        ],
        nonFunctional: [
          'Thread detection < 50ms',
          'Thread load < 200ms'
        ]
      },
      hints: [
        'Message-ID: unique ID per email, set in headers',
        'References: list of parent Message-IDs',
        'Fallback: normalize subject (strip Re: Fwd:), match'
      ],
      expectedComponents: ['Thread Detector', 'Reference Parser', 'Thread Store'],
      successCriteria: ['Threads formed', 'Conversations display'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Full-Text Search',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Search email content',
      thinkingFramework: {
        framework: 'Email Search',
        approach: 'Index email subject, body, sender, recipients. Full-text search with relevance ranking. Filters: from:, to:, has:attachment, before:, after:. Real-time index updates.',
        keyInsight: 'Users have thousands of emails. Search is essential. Index on write (or async). Combine full-text with structured filters. "from:boss has:attachment last week" must be fast.'
      },
      requirements: {
        functional: [
          'Full-text search on subject and body',
          'Structured filters (from, to, date)',
          'Attachment search',
          'Real-time indexing'
        ],
        nonFunctional: [
          'Search < 500ms',
          'Index lag < 1 minute'
        ]
      },
      hints: [
        'Elasticsearch: index {subject, body, from, to, labels, has_attachment, date}',
        'Query: bool query with full-text + filters',
        'Indexing: async pipeline from email store to search index'
      ],
      expectedComponents: ['Search Index', 'Query Parser', 'Index Pipeline'],
      successCriteria: ['Search works', 'Filters apply'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Spam Filtering',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Detect and filter spam',
      thinkingFramework: {
        framework: 'Spam Detection',
        approach: 'Multi-layer filtering: sender reputation, content analysis (ML), user feedback. Score each email. High score → spam folder. Learn from user actions (mark as spam, not spam).',
        keyInsight: 'Spam is adversarial - spammers adapt. Multi-signal approach: IP reputation, authentication results, content patterns, user reports. ML model trained on labeled examples. Continuous retraining.'
      },
      requirements: {
        functional: [
          'Score emails for spam likelihood',
          'Use sender reputation',
          'Content-based ML classification',
          'User feedback loop'
        ],
        nonFunctional: [
          'Filter < 100ms per email',
          '99% spam detection, < 0.1% false positive'
        ]
      },
      hints: [
        'Signals: SPF/DKIM fail, unknown sender, suspicious links, keyword patterns',
        'ML: train on user-labeled spam vs ham',
        'Feedback: user marks spam → retrain, marks not spam → whitelist sender'
      ],
      expectedComponents: ['Spam Scorer', 'Reputation DB', 'ML Classifier'],
      successCriteria: ['Spam filtered', 'Low false positives'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Email Deliverability',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Ensure sent emails reach inbox',
      thinkingFramework: {
        framework: 'Deliverability',
        approach: 'Your outbound email must not be marked spam by recipients. Maintain IP reputation. Proper authentication. Handle bounces and complaints. Warm up new IPs gradually.',
        keyInsight: 'Sending is easy. Landing in inbox is hard. Recipient providers score your reputation. Bad reputation = spam folder. Monitor bounce rates, complaint rates. Remove bad addresses promptly.'
      },
      requirements: {
        functional: [
          'Track delivery, bounce, complaint rates',
          'Handle bounce notifications',
          'Process feedback loops (complaints)',
          'IP warming for new senders'
        ],
        nonFunctional: [
          'Inbox placement > 95%',
          'Bounce rate < 2%'
        ]
      },
      hints: [
        'Bounces: parse bounce emails, classify hard vs soft',
        'Complaints: sign up for ISP feedback loops',
        'IP warming: start low volume, gradually increase over weeks'
      ],
      expectedComponents: ['Bounce Handler', 'Complaint Processor', 'Reputation Monitor'],
      successCriteria: ['High deliverability', 'Bounces processed'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Email Storage Sharding',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Distribute email storage',
      thinkingFramework: {
        framework: 'User-Based Sharding',
        approach: 'Shard by user_id. All emails for a user on same shard. Enables efficient inbox queries. User with millions of emails still on one shard. Cross-user queries (search all users) scatter-gather.',
        keyInsight: 'Email is user-centric. User only sees their emails. Shard by user = inbox query hits one shard. Gmail has billions of users, each with thousands of emails. User sharding scales linearly.'
      },
      requirements: {
        functional: [
          'Shard emails by user',
          'Route queries to correct shard',
          'Handle user migration between shards',
          'Rebalance when shards fill'
        ],
        nonFunctional: [
          'Linear scalability',
          'No cross-shard queries for user operations'
        ]
      },
      hints: [
        'Shard key: hash(user_id) mod num_shards',
        'Migration: copy emails to new shard, update routing, delete old',
        'Hot users: may need dedicated shard'
      ],
      expectedComponents: ['Shard Router', 'Migration Manager', 'Balance Monitor'],
      successCriteria: ['Sharding works', 'Queries routed correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'High-Volume Sending',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Send millions of emails per hour',
      thinkingFramework: {
        framework: 'Outbound Scale',
        approach: 'Millions of emails to different domains. Connection pooling per destination. Rate limiting per domain (respect recipient limits). Prioritize transactional over bulk. Multiple outbound IPs.',
        keyInsight: 'Recipient servers rate limit you. Gmail allows X connections/minute from your IP. Connection pooling reuses connections. Multiple IPs increase capacity. Prioritize password resets over newsletters.'
      },
      requirements: {
        functional: [
          'Connection pooling per destination',
          'Per-domain rate limiting',
          'Priority queues (transactional vs bulk)',
          'Multiple outbound IP rotation'
        ],
        nonFunctional: [
          'Send 10M emails/hour',
          'Respect recipient rate limits'
        ]
      },
      hints: [
        'Pool: keep connections open per MX, reuse for multiple emails',
        'Rate limit: track sends per domain, throttle when approaching limit',
        'Priority: separate queues, transactional always first'
      ],
      expectedComponents: ['Connection Pool', 'Rate Limiter', 'Priority Queue'],
      successCriteria: ['High volume achieved', 'Rate limits respected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Email Infrastructure',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Run email service globally',
      thinkingFramework: {
        framework: 'Global Architecture',
        approach: 'Multiple data centers for redundancy and latency. User email stored in home region. Send from region closest to recipient. Handle region failover. Compliance with data residency.',
        keyInsight: 'Email is global but data has locality. EU user data in EU (GDPR). Send to Japan MX from Asia DC (lower latency). Global anycast for SMTP receiving. Regional storage, global routing.'
      },
      requirements: {
        functional: [
          'Multi-region email storage',
          'Route sending to optimal region',
          'Global SMTP receiving',
          'Region failover'
        ],
        nonFunctional: [
          '99.99% global availability',
          'Cross-region latency < 200ms'
        ]
      },
      hints: [
        'Storage: user assigned to region, all emails in that region',
        'Sending: route to DC closest to recipient MX',
        'Receiving: anycast IPs, process in nearest DC, forward to user region'
      ],
      expectedComponents: ['Region Manager', 'Global Router', 'Failover Controller'],
      successCriteria: ['Multi-region works', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
