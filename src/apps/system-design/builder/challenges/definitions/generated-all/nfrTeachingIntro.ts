import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * NFR Teaching - Chapter 0: Introduction to the Framework
 *
 * This is the META-TUTORIAL that teaches:
 * 1. What NFRs are and why they matter
 * 2. The 3-axis framework (Slowest, Riskiest, Largest)
 * 3. The systematic questioning template
 * 4. How changing values affects design decisions
 * 5. How to use the UI/builder
 *
 * This should be the FIRST problem students see before diving into specific NFR topics.
 */

export const nfrFrameworkIntroProblem: ProblemDefinition = {
  id: 'nfr-intro-framework',
  title: '🎓 Introduction: The NFR Framework',
  description: `Welcome to **NFR-Driven System Design**! 🚀

Before we dive into specific problems, let's learn the **framework** that will guide all your design decisions.

**What Are NFRs?**

NFR = **Non-Functional Requirements**. These are the numbers that determine your architecture:
- "How many requests per second?" → Determines if you need horizontal scaling
- "What's your latency target?" → Determines if you need caching
- "Can you lose data?" → Determines if you need a database

**Why NFRs Matter:**

❌ **Without NFRs:** "Let's add Kafka for messaging!" (Why? No idea.)
✅ **With NFRs:** "We have 20k writes/sec and DB can only handle 3k → Add write queue + batching."

**The 3-Axis Framework:**

We organize NFRs into 3 axes (in order of asking):

1️⃣ **SLOWEST Axis: Latency & Throughput**
   - Request-response latency (P99 target)
   - Data processing latency (freshness)
   - Requests per second (RPS)

2️⃣ **RISKIEST Axis: Data Durability**
   - What happens if we lose data?
   - RPO (Recovery Point Objective)
   - RTO (Recovery Time Objective)

3️⃣ **LARGEST Axis: Dataset Size**
   - How much data are you storing?
   - When do you need sharding?
   - What's your data growth rate?

**The Systematic Questioning Template:**

Instead of guessing, we ask questions in this order:

\`\`\`
Step 1: Throughput (SLOWEST)
├─ "What's your traffic?" → RPS
├─ "Peak vs average?" → Autoscaling needs
└─ "Read/write ratio?" → Caching vs write queues

Step 2: Latency (SLOWEST)
├─ "What's your P99 target?" → Latency budget
├─ "User-facing or background?" → Sync vs async
└─ "How fresh should data be?" → CDC vs batch

Step 3: Durability (RISKIEST)
├─ "Can you lose data?" → Database vs in-memory
├─ "What's your RPO?" → Replication strategy
└─ "What's your RTO?" → Failover setup

Step 4: Dataset Size (LARGEST)
├─ "How much data?" → Single DB vs sharding
├─ "What's your growth rate?" → When to shard
└─ "What's your access pattern?" → Sharding strategy
\`\`\`

**Cause and Effect:**

This tutorial will show you how changing NFR values affects your architecture:

🔄 **Example:**
- Change RPS: 1k → 10k
  - Effect: Need more servers (horizontal scaling)
- Change latency: 200ms → 50ms
  - Effect: Need caching layer
- Change RPO: 5min → 0s
  - Effect: Need synchronous replication
- Change dataset: 100GB → 50TB
  - Effect: Need sharding

**How This UI Works:**

1. **Wizard Flow (Left Panel):** Step-by-step questions guide you
2. **Canvas (Center):** Your architecture auto-builds based on answers
3. **Architecture Visualization:** Shows components + connections
4. **Decision Explanations:** "Why did we add this component?"

Ready? Let's walk through an interactive example! 👇`,

  userFacingFRs: [
    'Learn the NFR framework (Slowest, Riskiest, Largest)',
    'Understand systematic questioning template',
    'See cause-and-effect of NFR value changes',
    'Master the UI and workflow',
  ],

  userFacingNFRs: [
    'Interactive tutorial with live demonstrations',
    'No prerequisites - start from zero',
    'Builds foundation for all 16 NFR teaching problems',
  ],

  clientDescriptions: [
    {
      name: 'Tutorial User',
      subtitle: 'Learning NFR framework',
      id: 'tutorial_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Load balancer for traffic distribution (you\'ll learn WHEN to add this)',
      },
      {
        type: 'compute',
        reason: 'App servers for processing requests (you\'ll learn HOW MANY)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Client connects to load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load balancer distributes to app servers',
      },
    ],
  },

  scenarios: generateScenarios('nfr-intro-framework', problemConfigs['nfr-intro-framework'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Learn NFR framework fundamentals',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],

  wizardFlow: {
    enabled: true,
    title: '🎓 NFR Framework Introduction',
    subtitle: 'Learn how to ask the right questions and let NFRs drive your design',
    objectives: [
      'Understand what NFRs are and why they matter',
      'Learn the 3-axis framework (Slowest, Riskiest, Largest)',
      'Master the systematic questioning template',
      'See cause-and-effect: how values change architecture',
    ],
    questions: [
      {
        id: 'what_are_nfrs',
        step: 1,
        category: 'throughput',
        title: 'What Are NFRs?',
        description: 'You\'re in a system design interview. Interviewer says: "Design Twitter." What do you do?',
        questionType: 'single_choice',
        options: [
          {
            id: 'jump_to_design',
            label: 'Jump straight to design: "Let\'s use microservices and Kafka!"',
            description: 'Start drawing boxes',
            consequence: '❌ WRONG! Interviewer asks: "Why Kafka? How many tweets per second?" You have no idea. Design is aimless.',
          },
          {
            id: 'ask_features',
            label: 'Ask about features: "Can users post tweets? View timeline?"',
            description: 'Clarify functional requirements',
            consequence: '✅ GOOD START! But not enough. Interviewer says: "Yes, all standard features." Now what?',
          },
          {
            id: 'ask_nfrs',
            label: 'Ask about NFRs: "How many users? Tweets per second? Latency target?"',
            description: 'Get the numbers that drive design',
            consequence: '✅ PERFECT! Interviewer: "500M users, 6,000 tweets/sec, P99 < 200ms." NOW you can design intelligently!',
          },
        ],
        whyItMatters: 'NFRs (Non-Functional Requirements) = THE NUMBERS that determine your architecture. Without them, you\'re guessing. With them, design decisions are justified.',
        commonMistakes: [
          'Jumping to design without NFRs (premature optimization)',
          'Asking only about features (functional requirements)',
          'Not quantifying requirements (how many, how fast, how much)',
        ],
        onAnswer: (answer) => {
          if (answer === 'ask_nfrs') {
            return [{
              action: 'highlight',
              reason: '✅ Always start with NFRs! Get the numbers FIRST: RPS, latency, data size, consistency. Then design follows naturally.',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: 'Features alone aren\'t enough! You need NFRs (numbers) to justify design choices. "Why Kafka?" → "Because we have 20k writes/sec and DB can only handle 3k."',
            }];
          }
        },
      },
      {
        id: 'three_axis_framework',
        step: 2,
        category: 'throughput',
        title: 'The 3-Axis Framework',
        description: 'NFRs can be overwhelming. The framework organizes them into 3 axes. What do you ask FIRST?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: '1️⃣ SLOWEST: Latency & Throughput',
            recommendation: 'Ask FIRST: RPS, P99 latency, read/write ratio',
            reasoning: 'Determines horizontal scaling, caching, load balancing. Affects EVERY component.',
          },
          {
            condition: '2️⃣ RISKIEST: Data Durability',
            recommendation: 'Ask SECOND: Can you lose data? RPO/RTO?',
            reasoning: 'Determines if you need a database, replication, backups. Affects data layer.',
          },
          {
            condition: '3️⃣ LARGEST: Dataset Size',
            recommendation: 'Ask THIRD: How much data? Growth rate?',
            reasoning: 'Determines if you need sharding. Only matters for massive datasets (>10TB).',
          },
        ],
        whyItMatters: 'The order matters! Start with throughput (affects everything), then durability (affects data layer), then dataset size (only matters at scale).',
        commonMistakes: [
          'Asking about sharding first (premature - only needed for >10TB datasets)',
          'Skipping latency/throughput (affects EVERY component)',
          'Not considering durability (can you afford to lose data?)',
        ],
        onAnswer: () => {
          return [{
            action: 'highlight',
            reason: '3-Axis Framework: 1) Throughput (RPS, latency) → 2) Durability (RPO/RTO) → 3) Dataset Size (sharding). Ask in this order!',
          }];
        },
      },
      {
        id: 'systematic_template',
        step: 3,
        category: 'throughput',
        title: 'The Questioning Template',
        description: 'Within each axis, there\'s a systematic sequence. For THROUGHPUT, what do you ask?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Step 1: What\'s your traffic?',
            recommendation: 'Ask: Requests per second (RPS)',
            reasoning: 'Example: "6,000 tweets/sec" → Need 5 servers at 1,400 RPS each.',
          },
          {
            condition: 'Step 2: Peak vs average?',
            recommendation: 'Ask: Peak-to-average ratio',
            reasoning: 'Example: "Peak 3× average" → Need autoscaling (min 5, max 15 servers).',
          },
          {
            condition: 'Step 3: Read/write ratio?',
            recommendation: 'Ask: What % reads vs writes?',
            reasoning: 'Example: "95% reads" → Need read replicas + caching. "50% writes" → Need write queues.',
          },
        ],
        whyItMatters: 'Each axis has a systematic sequence of questions. Follow the template → complete coverage, no guessing!',
        commonMistakes: [
          'Asking only about total RPS (missing peak/average split)',
          'Not asking about read/write ratio (caching vs write queues)',
          'Jumping to solutions without completing the template',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer distributes traffic (learned from "6,000 RPS" requirement)',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 5 },
              reason: '5 app servers (6,000 RPS ÷ 1,400 capacity per server = 4.3 → round to 5)',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client connects to LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to app servers',
            },
          ];
        },
      },
      {
        id: 'cause_effect_rps',
        step: 4,
        category: 'throughput',
        title: 'Cause & Effect: Changing RPS',
        description: 'Let\'s see cause-and-effect in action! Your RPS changes from 6,000 → 20,000. What happens?',
        questionType: 'single_choice',
        options: [
          {
            id: 'no_change',
            label: 'Nothing changes (architecture stays the same)',
            description: 'Same 5 servers handle it',
            consequence: '❌ WRONG! 5 servers × 1,400 capacity = 7,000 RPS max. 20,000 RPS overloads → requests dropped!',
          },
          {
            id: 'add_servers',
            label: 'Add more servers (horizontal scaling)',
            description: '20,000 ÷ 1,400 = 14.3 → need 15 servers',
            consequence: '✅ CORRECT! RPS increase → more servers needed. This is cause-and-effect: NFR change → architecture change.',
          },
          {
            id: 'bigger_servers',
            label: 'Use bigger servers (vertical scaling)',
            description: 'Upgrade to more powerful machines',
            consequence: '⚠️ POSSIBLE but not scalable. Vertical scaling hits limits. Horizontal scaling (adding servers) is better for RPS.',
          },
        ],
        whyItMatters: 'Changing NFR values triggers architectural changes! RPS increase → more servers. Latency decrease → add cache. RPO = 0 → add replication.',
        commonMistakes: [
          'Not recalculating capacity when RPS changes',
          'Over-provisioning (adding 100 servers for 20k RPS = waste)',
          'Under-provisioning (5 servers can\'t handle 20k RPS)',
        ],
        onAnswer: (answer) => {
          if (answer === 'add_servers') {
            return [
              {
                action: 'add_component',
                componentType: 'compute',
                config: { count: 15 },
                reason: 'Scaled from 5 → 15 servers because RPS increased from 6k → 20k. Capacity: 15 × 1,400 = 21,000 RPS.',
              },
            ];
          } else {
            return [{
              action: 'highlight',
              reason: 'RPS increase requires more capacity! 20k RPS ÷ 1,400 per server = 14.3 → need 15 servers. Horizontal scaling is the solution.',
            }];
          }
        },
      },
      {
        id: 'cause_effect_latency',
        step: 5,
        category: 'latency',
        title: 'Cause & Effect: Changing Latency',
        description: 'Now latency requirement tightens: P99 < 200ms → P99 < 50ms. Database queries take 150ms. What do you add?',
        questionType: 'single_choice',
        options: [
          {
            id: 'faster_db',
            label: 'Faster database (SSD instead of HDD)',
            description: 'Reduce DB query time',
            consequence: '⚠️ Helps a bit (150ms → 80ms) but still over 50ms budget. Not enough!',
          },
          {
            id: 'add_cache',
            label: 'Add caching layer (Redis)',
            description: 'Cache hit = 5ms, cache miss = 150ms',
            consequence: '✅ PERFECT! With 90% cache hit ratio, P99 drops from 150ms → 5ms. Latency requirement met!',
          },
          {
            id: 'more_servers',
            label: 'Add more app servers',
            description: 'Horizontal scaling',
            consequence: '❌ WRONG! More servers help throughput, NOT latency. DB query still takes 150ms.',
          },
        ],
        whyItMatters: 'Latency change triggers different architectural components than throughput change! Tight latency → caching. High RPS → more servers.',
        commonMistakes: [
          'Confusing throughput and latency (more servers ≠ lower latency)',
          'Not adding cache when latency target is tight (<100ms)',
          'Over-optimizing (changing latency from 200ms → 199ms doesn\'t need cache)',
        ],
        onAnswer: (answer) => {
          if (answer === 'add_cache') {
            return [
              {
                action: 'add_component',
                componentType: 'cache',
                config: { count: 1 },
                reason: 'Redis cache added because latency requirement tightened to P99 < 50ms. Cache hit (5ms) meets target!',
              },
              {
                action: 'add_component',
                componentType: 'storage',
                config: { count: 1 },
                reason: 'Database for cache misses (still needed for source of truth)',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'cache',
                reason: 'Check cache first',
              },
              {
                action: 'add_connection',
                from: 'cache',
                to: 'storage',
                reason: 'Cache miss → read from database',
              },
            ];
          } else {
            return [{
              action: 'highlight',
              reason: 'Latency < 50ms requires caching! DB queries (150ms) too slow. Cache hit (5ms) meets target. This is cause-and-effect!',
            }];
          }
        },
      },
      {
        id: 'ui_workflow',
        step: 6,
        category: 'throughput',
        title: 'How the UI Works',
        description: 'You\'ve seen the wizard flow build architecture automatically. Here\'s how the full workflow works:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: '1️⃣ Wizard Flow (Left Panel)',
            recommendation: 'Answer NFR questions step-by-step',
            reasoning: 'Each answer adds/modifies architecture components. Progress through 5 steps per problem.',
          },
          {
            condition: '2️⃣ Architecture Visualization (Center)',
            recommendation: 'Watch your design auto-build',
            reasoning: 'Components appear based on your answers. Connections show data flow.',
          },
          {
            condition: '3️⃣ Decision Explanations',
            recommendation: 'Read "Why did we add this?"',
            reasoning: 'Each component includes reasoning: "Cache added because P99 < 50ms requires fast reads."',
          },
          {
            condition: '4️⃣ Summary & Next Steps',
            recommendation: 'Review key takeaways',
            reasoning: 'Wizard ends with summary: formulas, trade-offs, when to use each pattern.',
          },
        ],
        whyItMatters: 'The UI guides you through NFR-driven design. Answer questions → architecture builds → learn cause-and-effect.',
        commonMistakes: [
          'Skipping wizard questions (missing the learning!)',
          'Not reading explanations (missing the "why")',
          'Rushing through without understanding cause-and-effect',
        ],
        onAnswer: () => {
          return [{
            action: 'highlight',
            reason: 'UI Workflow: Wizard questions → Architecture auto-builds → Explanations → Summary. You\'ve just experienced it! Ready for real problems? 🚀',
          }];
        },
      },
    ],
    summary: {
      title: 'NFR Framework Mastered! 🎉',
      keyTakeaways: [
        'NFRs = numbers that drive design. Get them FIRST before designing.',
        '3-Axis Framework: 1) Throughput (RPS, latency) → 2) Durability (RPO/RTO) → 3) Dataset Size (sharding).',
        'Systematic template: Follow the question sequence → complete coverage, no guessing.',
        'Cause-and-effect: RPS increase → more servers. Latency decrease → add cache. RPO = 0 → replication.',
        'UI workflow: Wizard questions → Architecture auto-builds → Learn cause-and-effect.',
      ],
      nextSteps: `**You\'re ready for the real problems!** 🚀

The 16 NFR teaching problems are organized by the framework you just learned:

**Module 1: Throughput (SLOWEST - 4 problems)**
- Throughput calculation, peak vs average, read/write ratio, autoscaling

**Module 2: Burst Handling (2 problems)**
- Burst QPS with queues, write batching

**Module 3: Latency (SLOWEST - 4 problems)**
- P99 latency budgets, CDC pipelines, caching, replication

**Module 4: Durability (RISKIEST - 2 problems)**
- When to add database, durability levels (RPO/RTO)

**Module 5: Dataset Size (LARGEST - 2 problems)**
- When to shard, sharding strategies

**Module 6: Consistency (2 problems)**
- Read-after-write consistency, consistency levels

Start with Module 1 and work through systematically. Each problem uses the framework you just learned! 🎓`,
    },
  },
};

// Export for integration with problem catalog
export const nfrTeachingIntroProblems = [
  nfrFrameworkIntroProblem,
];
