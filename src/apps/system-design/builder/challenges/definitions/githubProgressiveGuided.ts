import { GuidedTutorial } from '../../types/guidedTutorial';

export const githubProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'github-progressive',
  title: 'Design GitHub',
  description: 'Build a code hosting platform from basic git storage to global developer collaboration',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design distributed git repository storage',
    'Implement pull requests and code review',
    'Build CI/CD pipeline integration',
    'Handle large-scale code search',
    'Scale for millions of repositories'
  ],
  prerequisites: ['Git internals', 'Distributed systems', 'File storage'],
  tags: ['git', 'code-hosting', 'collaboration', 'ci-cd', 'developer-tools'],

  progressiveStory: {
    title: 'GitHub Evolution',
    premise: "You're building a code hosting platform for developers. Starting with basic git repository hosting, you'll evolve to support pull requests, CI/CD, code search, and collaboration for millions of developers.",
    phases: [
      { phase: 1, title: 'Git Hosting', description: 'Basic repository storage' },
      { phase: 2, title: 'Collaboration', description: 'PRs and code review' },
      { phase: 3, title: 'Automation', description: 'CI/CD and integrations' },
      { phase: 4, title: 'Platform Scale', description: 'Search and global scale' }
    ]
  },

  steps: [
    // PHASE 1: Git Hosting (Steps 1-3)
    {
      id: 'step-1',
      title: 'Repository Storage',
      phase: 1,
      phaseTitle: 'Git Hosting',
      learningObjective: 'Store git repositories efficiently',
      thinkingFramework: {
        framework: 'Git Object Storage',
        approach: 'Git stores objects (blobs, trees, commits) by SHA-1 hash. Content-addressable storage. Pack files for efficiency. Store on disk or object storage.',
        keyInsight: 'Git is already content-addressable. Same file = same hash across all repos. Deduplication is built-in. Focus on serving git protocol efficiently.'
      },
      requirements: {
        functional: [
          'Create and delete repositories',
          'Store git objects (blobs, trees, commits)',
          'Support clone, push, pull operations',
          'Handle repository metadata'
        ],
        nonFunctional: [
          'Clone speed: 10 MB/s minimum',
          'Storage deduplication across forks'
        ]
      },
      hints: [
        'Repo: {id, owner, name, description, visibility, default_branch}',
        'Storage: .git directory on distributed filesystem or object store',
        'Protocol: git-upload-pack (clone), git-receive-pack (push)'
      ],
      expectedComponents: ['Repository Store', 'Git Protocol Handler', 'Object Storage'],
      successCriteria: ['Repos created', 'Git operations work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Branch & Commit Management',
      phase: 1,
      phaseTitle: 'Git Hosting',
      learningObjective: 'Track branches and commit history',
      thinkingFramework: {
        framework: 'Reference Management',
        approach: 'Branches are refs pointing to commits. Track in database for fast lookup. Commit graph for history traversal. Protected branches for safety.',
        keyInsight: 'Git refs are cheap (just SHA pointers). Database index enables fast branch listing, commit lookup without touching git storage.'
      },
      requirements: {
        functional: [
          'Create and delete branches',
          'View commit history and diffs',
          'Compare branches',
          'Protected branch rules'
        ],
        nonFunctional: [
          'Branch list < 100ms',
          'Commit diff < 500ms'
        ]
      },
      hints: [
        'Branch: {repo_id, name, commit_sha, protected}',
        'Commit cache: {sha, repo_id, author, message, timestamp, parent_shas}',
        'Protection: require reviews, status checks, no force push'
      ],
      expectedComponents: ['Branch Manager', 'Commit Cache', 'Protection Rules'],
      successCriteria: ['Branches tracked', 'History viewable'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Fork & Clone Network',
      phase: 1,
      phaseTitle: 'Git Hosting',
      learningObjective: 'Enable repository forking efficiently',
      thinkingFramework: {
        framework: 'Copy-on-Write Forks',
        approach: 'Fork shares storage with parent (same objects). Only new commits stored separately. Fork network tracks relationships. Upstream sync.',
        keyInsight: 'Forks dont copy data. Git objects are content-addressed - fork points to same objects. New commits create new objects. Massive storage savings.'
      },
      requirements: {
        functional: [
          'Fork repository to user account',
          'Track fork relationships',
          'Sync with upstream',
          'Cross-fork pull requests'
        ],
        nonFunctional: [
          'Fork creation < 5 seconds',
          'No storage duplication for shared objects'
        ]
      },
      hints: [
        'Fork: {id, parent_repo_id, owner_id} - shares object store',
        'Network: graph of fork relationships',
        'Sync: fetch upstream, merge/rebase locally'
      ],
      expectedComponents: ['Fork Manager', 'Object Sharing', 'Network Graph'],
      successCriteria: ['Forks created instantly', 'Storage shared'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Collaboration (Steps 4-6)
    {
      id: 'step-4',
      title: 'Pull Requests',
      phase: 2,
      phaseTitle: 'Collaboration',
      learningObjective: 'Enable code contribution workflow',
      thinkingFramework: {
        framework: 'Merge Proposals',
        approach: 'PR = proposal to merge branch. Track head/base branches. Compute diff and merge-ability. Update as branches change. Merge strategies.',
        keyInsight: 'PR is living document. Head branch updates → PR updates. Must track merge conflicts in real-time. Mergeable status cached, invalidated on push.'
      },
      requirements: {
        functional: [
          'Create PR from branch to branch',
          'Show diff between branches',
          'Track mergeable status',
          'Merge with different strategies'
        ],
        nonFunctional: [
          'Diff computation < 2 seconds',
          'Merge status update < 10 seconds'
        ]
      },
      hints: [
        'PR: {id, repo_id, head_branch, base_branch, title, state, author}',
        'Diff: git diff base...head (three-dot = merge base)',
        'Merge: merge commit, squash, rebase'
      ],
      expectedComponents: ['PR Manager', 'Diff Engine', 'Merge Handler'],
      successCriteria: ['PRs created', 'Merging works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Code Review',
      phase: 2,
      phaseTitle: 'Collaboration',
      learningObjective: 'Enable inline code review and comments',
      thinkingFramework: {
        framework: 'Line-Level Feedback',
        approach: 'Comments attached to specific lines in diff. Track position even as code changes. Review as approval workflow. Suggested changes inline.',
        keyInsight: 'Comment position is tricky. Line 42 in old diff might be line 50 after rebase. Track by surrounding context, not just line number.'
      },
      requirements: {
        functional: [
          'Comment on specific diff lines',
          'Review approval workflow',
          'Suggested changes with apply button',
          'Resolve/unresolve comments'
        ],
        nonFunctional: [
          'Comment load < 500ms',
          'Position tracking through rebases'
        ]
      },
      hints: [
        'Comment: {pr_id, path, line, side: left|right, body, commit_sha}',
        'Review: {pr_id, author, state: APPROVED|CHANGES_REQUESTED|COMMENTED}',
        'Suggestion: code block in comment, one-click commit'
      ],
      expectedComponents: ['Review System', 'Comment Tracker', 'Suggestion Handler'],
      successCriteria: ['Reviews work', 'Comments track position'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Issues & Project Management',
      phase: 2,
      phaseTitle: 'Collaboration',
      learningObjective: 'Track bugs and feature requests',
      thinkingFramework: {
        framework: 'Issue Tracking',
        approach: 'Issues = discussion threads with metadata. Labels, milestones, assignees. Link to PRs and commits. Project boards for workflow visualization.',
        keyInsight: 'Issues and PRs share infrastructure. Both are "issue-like" with comments, labels, assignees. PR is issue + code changes. Unified model.'
      },
      requirements: {
        functional: [
          'Create issues with labels and assignees',
          'Link issues to PRs (closes #123)',
          'Milestones for release planning',
          'Project boards (kanban)'
        ],
        nonFunctional: [
          'Issue search < 500ms'
        ]
      },
      hints: [
        'Issue: {id, repo_id, number, title, body, state, labels, assignees}',
        'Link: "fixes #123" in PR description auto-closes on merge',
        'Project: columns with issue/PR cards, drag-drop workflow'
      ],
      expectedComponents: ['Issue Tracker', 'Label Manager', 'Project Boards'],
      successCriteria: ['Issues tracked', 'Linked to code'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Automation (Steps 7-9)
    {
      id: 'step-7',
      title: 'Webhooks & Events',
      phase: 3,
      phaseTitle: 'Automation',
      learningObjective: 'Notify external systems of repository events',
      thinkingFramework: {
        framework: 'Event-Driven Integration',
        approach: 'Every action emits event. Webhooks deliver to registered URLs. Retry on failure. Signature for verification. Event types filter.',
        keyInsight: 'Webhooks enable ecosystem. CI/CD, chat notifications, deployment - all triggered by push/PR events. Reliable delivery is critical.'
      },
      requirements: {
        functional: [
          'Register webhook URLs per repo',
          'Emit events for push, PR, issue, etc.',
          'Deliver with retry on failure',
          'HMAC signature for verification'
        ],
        nonFunctional: [
          'Delivery within 30 seconds',
          'Retry for 24 hours'
        ]
      },
      hints: [
        'Webhook: {repo_id, url, secret, events: [push, pull_request, ...]}',
        'Delivery: POST with X-Hub-Signature header',
        'Retry: exponential backoff, 1min, 5min, 30min, 2hr'
      ],
      expectedComponents: ['Event Emitter', 'Webhook Delivery', 'Signature Generator'],
      successCriteria: ['Webhooks delivered', 'Retries work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'GitHub Actions (CI/CD)',
      phase: 3,
      phaseTitle: 'Automation',
      learningObjective: 'Run automated workflows on events',
      thinkingFramework: {
        framework: 'Workflow Execution',
        approach: 'YAML defines workflow (trigger, jobs, steps). Queue job on trigger. Execute in isolated runner. Report status back to PR/commit.',
        keyInsight: 'Actions = managed CI/CD. Runners are ephemeral VMs/containers. Marketplace for reusable actions. Matrix builds for parallelism.'
      },
      requirements: {
        functional: [
          'Define workflows in YAML',
          'Trigger on push, PR, schedule',
          'Execute jobs on runners',
          'Report status checks'
        ],
        nonFunctional: [
          'Job start < 30 seconds',
          'Concurrent jobs per repo: 20'
        ]
      },
      hints: [
        'Workflow: .github/workflows/*.yml parsed on push',
        'Job: {runs-on, steps: [{uses, run}], needs: [other-job]}',
        'Runner: VM pool, checkout code, execute steps, upload artifacts'
      ],
      expectedComponents: ['Workflow Parser', 'Job Queue', 'Runner Pool'],
      successCriteria: ['Workflows execute', 'Status reported'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-9',
      title: 'Status Checks & Branch Protection',
      phase: 3,
      phaseTitle: 'Automation',
      learningObjective: 'Gate merges on automated checks',
      thinkingFramework: {
        framework: 'Merge Gates',
        approach: 'External systems report status (CI pass/fail). Branch protection requires status checks. Block merge until all required checks pass.',
        keyInsight: 'Status checks decouple CI from GitHub. Any system can report status via API. Branch protection aggregates: all required checks must pass.'
      },
      requirements: {
        functional: [
          'Accept status check reports',
          'Aggregate check status per commit',
          'Require checks for merge',
          'Auto-merge when checks pass'
        ],
        nonFunctional: [
          'Status update propagation < 5 seconds'
        ]
      },
      hints: [
        'Status: {repo_id, sha, context, state: pending|success|failure, url}',
        'Protection: {branch, required_contexts: [ci/test, ci/lint]}',
        'Auto-merge: queue PR, merge when all checks green'
      ],
      expectedComponents: ['Status API', 'Check Aggregator', 'Merge Queue'],
      successCriteria: ['Status blocks merge', 'Auto-merge works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Platform Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Code Search',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Search across millions of repositories',
      thinkingFramework: {
        framework: 'Code Index',
        approach: 'Index code on push. Tokenize for code-aware search. Trigram index for substring. Scope by repo, language, path. Ranking by relevance.',
        keyInsight: 'Code search is not text search. Must handle: camelCase, snake_case, symbols, exact matches. Trigram index enables substring search without wildcards.'
      },
      requirements: {
        functional: [
          'Index code on push',
          'Search with language and path filters',
          'Symbol search (functions, classes)',
          'Regex search support'
        ],
        nonFunctional: [
          'Search latency < 1 second',
          'Index within 1 hour of push'
        ]
      },
      hints: [
        'Index: trigrams + tokens per file, sharded by repo',
        'Query: parse into terms, filter by scope, rank results',
        'Symbol: language-specific parser extracts definitions'
      ],
      expectedComponents: ['Code Indexer', 'Search Engine', 'Symbol Extractor'],
      successCriteria: ['Code searchable', 'Results relevant'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Repository Scaling',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Handle massive repositories efficiently',
      thinkingFramework: {
        framework: 'Monorepo Support',
        approach: 'Large repos need special handling. Sparse checkout for partial clone. Git LFS for large files. Commit graph for faster traversal.',
        keyInsight: 'Monorepos can have millions of files, TB of history. Partial clone: fetch objects on demand. Sparse checkout: only needed directories.'
      },
      requirements: {
        functional: [
          'Partial clone (blobless, treeless)',
          'Git LFS for large files',
          'Sparse checkout configuration',
          'Commit graph acceleration'
        ],
        nonFunctional: [
          'Support repos > 100GB',
          'Partial clone starts < 30 seconds'
        ]
      },
      hints: [
        'Partial: --filter=blob:none, fetch blobs on checkout',
        'LFS: pointer files in git, actual content in object store',
        'Commit-graph: precomputed graph for faster log, blame'
      ],
      expectedComponents: ['LFS Server', 'Partial Clone Handler', 'Graph Cache'],
      successCriteria: ['Large repos usable', 'LFS works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Distribution',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Serve developers worldwide with low latency',
      thinkingFramework: {
        framework: 'Geo-Distributed Git',
        approach: 'Replicate repos to regional caches. Read from nearest, write to primary. CDN for web assets. Eventual consistency acceptable for reads.',
        keyInsight: 'Git is already distributed. Regional read replicas serve clones fast. Writes go to primary, async replicate. Clone is read-heavy operation.'
      },
      requirements: {
        functional: [
          'Regional repository caches',
          'Route to nearest cache',
          'Async replication on push',
          'CDN for web interface'
        ],
        nonFunctional: [
          'Clone from nearest region',
          'Replication lag < 1 minute'
        ]
      },
      hints: [
        'Cache: warm popular repos in each region',
        'Routing: GeoDNS or anycast to nearest PoP',
        'Replication: push triggers async copy to caches'
      ],
      expectedComponents: ['Regional Cache', 'Geo Router', 'Replication Queue'],
      successCriteria: ['Global low latency', 'Replication works'],
      estimatedTime: '8 minutes'
    }
  ]
};
