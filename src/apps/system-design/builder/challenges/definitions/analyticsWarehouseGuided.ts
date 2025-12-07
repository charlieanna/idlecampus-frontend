import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Analytics Warehouse Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches OLAP data warehouse concepts
 * while building an analytics platform. Each step tells a story that motivates the task.
 *
 * Focus areas:
 * - OLAP vs OLTP patterns
 * - Columnar storage optimization
 * - Star schema modeling
 * - Materialized views and pre-aggregation
 *
 * Flow:
 * Phase 0: Requirements gathering (query patterns, data freshness, aggregation needs)
 * Steps 1-3: Build basic OLAP data warehouse
 * Steps 4-6: Add columnar storage, star schema, materialized views
 *
 * Key Pedagogy: First make it WORK, then make it FAST, then make it SMART
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const analyticsWarehouseRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an analytics data warehouse for business intelligence and reporting",

  interviewer: {
    name: 'Jordan Martinez',
    role: 'Head of Data Engineering',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'query-patterns',
      category: 'functional',
      question: "What types of queries will the analytics team run? What are they trying to analyze?",
      answer: "The analytics team runs these types of queries:\n1. **Aggregations** - SUM(revenue), COUNT(orders), AVG(customer_age) across millions of rows\n2. **Time series** - Daily/weekly/monthly trends over years of data\n3. **Group by** - Revenue by region, orders by product category\n4. **Complex joins** - Combining sales, customer, and product data\n5. **Ad-hoc exploration** - Business analysts running unpredictable queries",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "OLAP workloads are fundamentally different from OLTP - they read lots of data but write infrequently",
    },
    {
      id: 'data-freshness',
      category: 'functional',
      question: "How fresh does the analytics data need to be? Real-time or daily batch?",
      answer: "We need **near real-time** analytics:\n- Operational dashboards: 5-15 minute delay acceptable\n- Executive reports: 1 hour delay is fine\n- Historical analysis: Daily batch is sufficient\n\nNot real-time (no sub-second requirements), but not overnight batch either.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Data freshness requirements drive architecture - real-time vs batch vs micro-batch",
    },
    {
      id: 'aggregation-patterns',
      category: 'functional',
      question: "Do analysts run the same aggregation queries repeatedly, or is every query different?",
      answer: "There's a pattern! About 80% of queries are variations of:\n- Daily/weekly/monthly revenue reports\n- Top 10 products by sales\n- Customer segments by region\n- Same-store sales comparisons\n\nOnly 20% are truly ad-hoc exploration queries.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Repeated aggregation patterns can be pre-computed with materialized views",
    },

    // IMPORTANT - Clarifications
    {
      id: 'data-sources',
      category: 'clarification',
      question: "Where does the data come from? How many source systems?",
      answer: "We have multiple source systems:\n1. **Transactional DB** (PostgreSQL) - orders, customers, products\n2. **Event stream** (Kafka) - clickstream, user behavior\n3. **CRM system** - customer interactions\n4. **External APIs** - weather, market data\n\nData needs ETL/ELT pipeline to land in warehouse.",
      importance: 'important',
      insight: "Multi-source data requires an ETL pipeline and schema standardization",
    },
    {
      id: 'query-complexity',
      category: 'clarification',
      question: "How complex are the typical queries? Simple aggregations or multi-table joins?",
      answer: "Queries range from simple to very complex:\n- **Simple**: `SELECT region, SUM(revenue) FROM sales GROUP BY region`\n- **Complex**: Multi-table joins across 5-10 tables, window functions, subqueries\n- Some queries scan **billions** of rows to compute aggregations\n\nQuery execution time budget: p95 < 30 seconds for dashboard queries",
      importance: 'important',
      insight: "Complex analytical queries need columnar storage and query optimization",
    },
    {
      id: 'historical-data',
      category: 'clarification',
      question: "How much historical data needs to be queryable? Days, months, or years?",
      answer: "We need **5 years** of historical data online and queryable:\n- Regulatory compliance: 7 years retention\n- Business analysis: 3-5 year trends\n- Recent data (last 90 days) is queried most frequently\n- Older data accessed less but must remain fast",
      importance: 'important',
      insight: "Large historical datasets require partitioning and tiered storage strategies",
    },

    // SCOPE
    {
      id: 'scope-ml',
      category: 'scope',
      question: "Do data scientists need to run machine learning workloads on this warehouse?",
      answer: "Not initially. This is for BI reporting and dashboards. ML workloads would be a separate data science platform. For now, focus on fast SQL analytics.",
      importance: 'nice-to-have',
      insight: "ML workloads have different requirements - keep scope focused on analytics",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many concurrent queries does the warehouse need to support?",
      answer: "We have:\n- 200 business analysts running queries during business hours\n- Peak: 50 concurrent queries\n- Average: 20 concurrent queries\n- Each query might scan 100M - 10B rows",
      importance: 'critical',
      calculation: {
        formula: "50 concurrent queries × 30 sec avg = need high parallelism",
        result: "~100-200 queries/hour peak throughput",
      },
      learningPoint: "OLAP systems need massive parallelism to handle concurrent analytical queries",
    },
    {
      id: 'data-volume',
      category: 'throughput',
      question: "How much data do we ingest per day?",
      answer: "About **500GB per day** of raw data:\n- 100M transactions/day\n- Average record size: 5KB\n- Growth rate: 20% year-over-year\n\nTotal warehouse size: ~900TB (5 years × 500GB/day)",
      importance: 'critical',
      calculation: {
        formula: "500GB/day × 365 × 5 years = ~900TB",
        result: "Need petabyte-scale storage architecture",
      },
      learningPoint: "Data warehouse storage grows linearly with time - plan for compression and tiered storage",
    },

    // PAYLOAD
    {
      id: 'payload-scan',
      category: 'payload',
      question: "What's the typical data scan size for analytical queries?",
      answer: "Queries typically scan:\n- Small queries: 10GB (last 24 hours)\n- Medium queries: 100GB (last week)\n- Large queries: 1TB+ (yearly aggregations)\n\nColumnar storage can reduce scan by 10-100x vs row storage!",
      importance: 'important',
      calculation: {
        formula: "Row storage: scan all columns. Columnar: scan only needed columns",
        result: "Columnar storage = 10-100x faster for analytical queries",
      },
      learningPoint: "OLAP queries read few columns but many rows - columnar storage is essential",
    },

    // LATENCY
    {
      id: 'latency-dashboard',
      category: 'latency',
      question: "What's the acceptable latency for dashboard queries?",
      answer: "**Dashboard queries**: p95 < 5 seconds\n**Ad-hoc exploration**: p95 < 30 seconds\n**Batch reports**: < 5 minutes\n\nUsers expect dashboards to load quickly. Long-running ad-hoc queries are acceptable.",
      importance: 'critical',
      learningPoint: "Different query types have different latency SLAs - prioritize dashboard performance",
    },
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How fast does data need to land in the warehouse after being generated?",
      answer: "**Micro-batch ingestion**: 5-15 minute delay acceptable\n- Not real-time streaming (too expensive)\n- Not overnight batch (too slow for operational dashboards)\n- Sweet spot: ingest every 10-15 minutes",
      importance: 'important',
      insight: "Micro-batch ingestion balances freshness with cost and complexity",
    },

    // BURST
    {
      id: 'burst-reporting',
      category: 'burst',
      question: "Are there predictable query spikes during certain times?",
      answer: "Yes! Query patterns:\n- **Monday 9 AM**: Weekly reports spike (3x normal load)\n- **Month-end**: Accounting queries spike (5x normal)\n- **Business hours**: 80% of queries happen 9 AM - 6 PM\n- **Nights/weekends**: Nearly zero queries",
      importance: 'important',
      insight: "Predictable spikes allow for scheduled resource scaling and maintenance windows",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['query-patterns', 'data-freshness'],
  criticalFRQuestionIds: ['query-patterns', 'data-freshness', 'aggregation-patterns'],
  criticalScaleQuestionIds: ['throughput-queries', 'data-volume', 'latency-dashboard'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Support OLAP analytical queries',
      description: 'System must efficiently execute aggregations, group-by, and joins across billions of rows',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Near real-time data ingestion',
      description: 'Data must be available for querying within 15 minutes of generation',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Pre-computed aggregations',
      description: 'Common aggregation queries (daily/weekly reports) should return in < 5 seconds',
      emoji: '🚀',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '200 analysts',
    writesPerDay: '100M records',
    readsPerDay: '2,000 queries',
    peakMultiplier: 3,
    readWriteRatio: '1000:1 (read-heavy)',
    calculatedWriteRPS: { average: 1157, peak: 3471 },
    calculatedReadRPS: { average: 50, peak: 150 },
    maxPayloadSize: '500GB/day ingestion',
    redirectLatencySLA: 'p95 < 5s (dashboard), p95 < 30s (ad-hoc)',
  },

  architecturalImplications: [
    'Columnar storage for efficient scans of billions of rows',
    'Star schema or denormalized tables for fast joins',
    'Materialized views for pre-computed aggregations',
    'Partitioning by time (most queries filter on date)',
    'Separate OLAP warehouse from OLTP transactional database',
  ],

  outOfScope: [
    'Real-time streaming analytics (< 1 second latency)',
    'Machine learning model training',
    'Operational transaction processing (OLTP)',
    'Data governance and compliance tooling',
  ],

  keyInsight: "Analytics warehouses are fundamentally different from transactional databases. OLAP systems optimize for reading billions of rows with complex aggregations, while OLTP systems optimize for fast individual row updates. First, we'll build a basic warehouse that works. Then we'll optimize with columnar storage, star schema, and materialized views!",
};

// =============================================================================
// STEP 1: The Beginning - Separate OLAP from OLTP
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏢',
  scenario: "Welcome! You're the new data engineer at a fast-growing e-commerce company.",
  hook: "Analysts are running heavy analytical queries directly on your production PostgreSQL database. Every time they run a report, customer checkout slows down. The CEO is furious!",
  challenge: "First step: Separate analytical workloads (OLAP) from transactional workloads (OLTP) by creating a dedicated data warehouse.",
  illustration: 'warehouse-separation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "You've separated OLAP from OLTP!",
  achievement: "Production database is no longer impacted by analytical queries",
  metrics: [
    { label: 'Production DB load', before: '100%', after: '30%' },
    { label: 'Analytics available', after: 'Dedicated warehouse' },
  ],
  nextTeaser: "But how does data get from the production DB into the warehouse?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'OLAP vs OLTP: Two Different Worlds',
  conceptExplanation: `**The fundamental problem**: One database cannot efficiently serve both workloads.

**OLTP (Online Transaction Processing)** - Production Database
- Characteristics: Fast, small transactions (INSERT, UPDATE, DELETE)
- Access pattern: Read/write individual rows by primary key
- Example: "Update inventory for product_id=123"
- Optimized for: Write throughput, low latency, ACID transactions
- Schema: Normalized (3NF) to reduce redundancy

**OLAP (Online Analytical Processing)** - Data Warehouse
- Characteristics: Complex queries scanning millions of rows
- Access pattern: Aggregations, GROUP BY, multi-table JOINs
- Example: "Total revenue by region for last 5 years"
- Optimized for: Read throughput, complex queries, data compression
- Schema: Denormalized (star/snowflake) for query performance

**Why separate them?**
- OLTP needs row-level locks → OLAP scans millions of rows (lock contention!)
- OLTP needs fast writes → OLAP needs fast reads (different indexes!)
- OLTP needs normalized schema → OLAP needs denormalized for fast joins`,
  whyItMatters: 'Running analytics on your production database kills performance. Separating OLAP and OLTP is the first step in building a scalable data platform.',
  realWorldExample: {
    company: 'Amazon',
    scenario: 'Billions of transactions per day, millions of analytical queries',
    howTheyDoIt: 'Separates OLTP (DynamoDB, Aurora) from OLAP (Redshift). Data flows from OLTP → S3 → Redshift via ETL pipeline.',
  },
  keyPoints: [
    'OLTP = transactional, row-oriented, normalized',
    'OLAP = analytical, column-oriented, denormalized',
    'Never run heavy analytics on production OLTP database',
    'Data warehouse is a separate system optimized for queries',
  ],
  diagram: `
┌──────────────────────────────────────────────────┐
│            BEFORE: Everything on OLTP            │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────┐      ┌──────────────────┐          │
│  │ Users   │ ───→ │  PostgreSQL      │ ← Heavy  │
│  │(checkout)│      │  (Production)    │   queries│
│  └─────────┘      └──────────────────┘   kill   │
│                            ↑               perf! │
│                            │                     │
│                    ┌───────────────┐             │
│                    │   Analysts    │             │
│                    │ (Big queries) │             │
│                    └───────────────┘             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│         AFTER: Separate OLAP and OLTP            │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────┐      ┌──────────────────┐          │
│  │ Users   │ ───→ │  PostgreSQL      │          │
│  │(checkout)│      │  (OLTP - Fast!)  │          │
│  └─────────┘      └─────────┬────────┘          │
│                              │ ETL               │
│                              ▼                   │
│                    ┌──────────────────┐          │
│  ┌───────────────┐ │  Data Warehouse  │          │
│  │   Analysts    │→│  (OLAP - Analytics)│        │
│  │ (Big queries) │ │  No impact on prod!│        │
│  └───────────────┘ └──────────────────┘          │
└──────────────────────────────────────────────────┘
`,
  keyConcepts: [
    {
      title: 'OLTP',
      explanation: 'Online Transaction Processing - fast individual row operations',
      icon: '⚡',
    },
    {
      title: 'OLAP',
      explanation: 'Online Analytical Processing - complex queries across many rows',
      icon: '📊',
    },
    {
      title: 'ETL',
      explanation: 'Extract, Transform, Load - pipeline to move data from OLTP to OLAP',
      icon: '🔄',
    },
  ],
  quickCheck: {
    question: 'Why should analytics queries NOT run on the production OLTP database?',
    options: [
      'OLTP databases cannot store enough data',
      'Heavy analytical queries slow down transactional operations',
      'OLTP databases are too expensive',
      'Analytics require a different programming language',
    ],
    correctIndex: 1,
    explanation: 'Analytical queries scan millions of rows, consuming CPU and holding locks that block fast transactional operations. This kills production performance.',
  },
};

const step1: GuidedStep = {
  id: 'analytics-warehouse-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Separate analytical workloads from production database',
    taskDescription: 'Add Database (OLTP) and Data Warehouse (OLAP) components',
    componentsNeeded: [
      { type: 'database', reason: 'Production OLTP database', displayName: 'Database (OLTP)' },
      { type: 'data_warehouse', reason: 'Dedicated analytical warehouse', displayName: 'Data Warehouse' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'Data Warehouse', reason: 'ETL pipeline extracts data' },
    ],
    successCriteria: ['Add OLTP Database', 'Add Data Warehouse', 'Connect Database → Data Warehouse'],
  },
  validation: {
    requiredComponents: ['database', 'data_warehouse'],
    requiredConnections: [{ fromType: 'database', toType: 'data_warehouse' }],
  },
  hints: {
    level1: 'Add both Database and Data Warehouse, then connect them',
    level2: 'Drag Database (OLTP) and Data Warehouse from sidebar, then connect Database → Data Warehouse',
    solutionComponents: [{ type: 'database' }, { type: 'data_warehouse' }],
    solutionConnections: [{ from: 'database', to: 'data_warehouse' }],
  },
};

// =============================================================================
// STEP 2: The Pipeline - ETL for Data Ingestion
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your data warehouse is set up, but it's empty!",
  hook: "Data lives in the production database. How does it get into the warehouse? You can't just copy tables - you need transformations, aggregations, and schema mapping.",
  challenge: "Build an ETL pipeline to extract data from OLTP, transform it, and load it into the warehouse.",
  illustration: 'etl-pipeline',
};

const step2Celebration: CelebrationContent = {
  emoji: '🚰',
  message: "Data is flowing into your warehouse!",
  achievement: "ETL pipeline is operational",
  metrics: [
    { label: 'Data ingestion', after: '500GB/day' },
    { label: 'Freshness', after: '15 min delay' },
  ],
  nextTeaser: "But queries are still slow... scanning billions of rows takes forever!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'ETL Pipeline: Moving Data into the Warehouse',
  conceptExplanation: `**ETL = Extract, Transform, Load**

**1. Extract** - Get data from source systems
- Production OLTP database (PostgreSQL, MySQL)
- Event streams (Kafka)
- APIs (CRM, external data)
- Files (S3, SFTP)

**2. Transform** - Process and clean the data
- Schema mapping (OLTP schema → OLAP schema)
- Data cleansing (fix nulls, duplicates)
- Aggregations (pre-compute daily/monthly totals)
- Enrichment (join with reference data)
- Denormalization (flatten for query performance)

**3. Load** - Insert into warehouse
- Batch: Load every hour/day
- Micro-batch: Load every 5-15 minutes
- Streaming: Continuous ingestion

**For this warehouse: Micro-batch (every 15 minutes)**
- Fresh enough for operational dashboards
- Cheaper than streaming
- Simpler than real-time`,
  whyItMatters: 'ETL is the pipeline that feeds your warehouse. Bad ETL = stale data, missing data, or data quality issues.',
  realWorldExample: {
    company: 'Uber',
    scenario: 'Ingests 100TB of data per day from 1000+ microservices',
    howTheyDoIt: 'Uses Apache Kafka for streaming ingestion → Apache Spark for transformation → Hive/Presto for OLAP queries. Micro-batch every 10 minutes.',
  },
  famousIncident: {
    title: 'Knight Capital ETL Failure',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A trading firm deployed new code but forgot to update the ETL pipeline. The warehouse showed stale prices while the production system had new prices. Automated trading algorithms made decisions on stale data and lost $440M in 45 minutes.',
    lessonLearned: 'ETL failures can be catastrophic. Always monitor data freshness and pipeline health!',
    icon: '💸',
  },
  keyPoints: [
    'ETL extracts from OLTP, transforms, loads into OLAP',
    'Micro-batch (15 min) balances freshness and cost',
    'Transformations include schema mapping and denormalization',
    'Monitor pipeline health and data freshness',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│              ETL PIPELINE FLOW                 │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────┐                                  │
│  │   OLTP   │ ← Production transactions        │
│  │ Database │                                  │
│  └─────┬────┘                                  │
│        │                                       │
│        │ Extract (every 15 min)                │
│        ▼                                       │
│  ┌──────────────┐                              │
│  │ ETL Pipeline │  Transform:                  │
│  │   (Spark)    │  • Schema mapping            │
│  │              │  • Denormalize               │
│  │              │  • Aggregate                 │
│  └──────┬───────┘                              │
│         │                                      │
│         │ Load                                 │
│         ▼                                      │
│  ┌──────────────┐                              │
│  │     OLAP     │ ← Analytics queries          │
│  │  Warehouse   │                              │
│  └──────────────┘                              │
│                                                │
│  Data freshness: 15 minute delay               │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Extract', explanation: 'Pull data from source systems', icon: '📤' },
    { title: 'Transform', explanation: 'Clean, map, aggregate, denormalize', icon: '⚙️' },
    { title: 'Load', explanation: 'Insert into warehouse', icon: '📥' },
    { title: 'Micro-batch', explanation: 'Ingest every 5-15 minutes', icon: '⏱️' },
  ],
  quickCheck: {
    question: 'Why use micro-batch (15 min) instead of real-time streaming ingestion?',
    options: [
      'Real-time is impossible to implement',
      'Micro-batch balances freshness with cost and complexity',
      'Analysts only check dashboards once per day',
      'Streaming would break the database',
    ],
    correctIndex: 1,
    explanation: 'Micro-batch gives near real-time freshness (15 min delay) at much lower cost and complexity than true streaming. Perfect for operational dashboards.',
  },
};

const step2: GuidedStep = {
  id: 'analytics-warehouse-step-2',
  stepNumber: 2,
  frIndex: 1,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Data must flow from OLTP to OLAP with 15-minute freshness',
    taskDescription: 'Add an ETL component between Database and Data Warehouse',
    componentsNeeded: [
      { type: 'database', reason: 'Source OLTP database', displayName: 'Database' },
      { type: 'etl', reason: 'Extract, Transform, Load pipeline', displayName: 'ETL Pipeline' },
      { type: 'data_warehouse', reason: 'Target analytical warehouse', displayName: 'Data Warehouse' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'ETL Pipeline', reason: 'Extract data from OLTP' },
      { from: 'ETL Pipeline', to: 'Data Warehouse', reason: 'Load transformed data' },
    ],
    successCriteria: ['Build Database → ETL Pipeline → Data Warehouse'],
  },
  validation: {
    requiredComponents: ['database', 'etl', 'data_warehouse'],
    requiredConnections: [
      { fromType: 'database', toType: 'etl' },
      { fromType: 'etl', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Add an ETL component between Database and Data Warehouse',
    level2: 'Architecture: Database → ETL Pipeline → Data Warehouse',
    solutionComponents: [{ type: 'database' }, { type: 'etl' }, { type: 'data_warehouse' }],
    solutionConnections: [
      { from: 'database', to: 'etl' },
      { from: 'etl', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// STEP 3: The Query - Analysts Can Now Query the Warehouse
// =============================================================================

const step3Story: StoryContent = {
  emoji: '👥',
  scenario: "Your warehouse is populated with data. Time to give analysts access!",
  hook: "Analysts need to run SQL queries to generate reports and dashboards. They need a query interface that connects to the warehouse.",
  challenge: "Add a query interface (like a BI tool or SQL client) so analysts can explore the data.",
  illustration: 'analyst-queries',
};

const step3Celebration: CelebrationContent = {
  emoji: '📊',
  message: "Analysts can now query the warehouse!",
  achievement: "Basic OLAP warehouse is operational",
  metrics: [
    { label: 'Analysts', after: '200 users' },
    { label: 'Queries/day', after: '2,000' },
  ],
  nextTeaser: "But queries scanning billions of rows take 5 minutes... we need columnar storage!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Query Layer: Giving Analysts Access',
  conceptExplanation: `Now that data is in the warehouse, analysts need to query it.

**Query interfaces:**
1. **BI Tools** - Tableau, Looker, Power BI
   - Visual drag-and-drop interface
   - Generates SQL under the hood
   - Great for non-technical users

2. **SQL Clients** - DBeaver, DataGrip
   - Direct SQL query interface
   - For analysts comfortable with SQL
   - More flexible than BI tools

3. **Notebooks** - Jupyter, Databricks
   - Mix SQL with Python/R for analysis
   - Data scientists love notebooks

**All connect to the same warehouse!**

**The flow:**
1. Analyst writes query or builds dashboard
2. Tool sends SQL to warehouse
3. Warehouse executes query (scans data, aggregates)
4. Results returned to analyst
5. Tool visualizes results`,
  whyItMatters: 'Without a query interface, your warehouse is useless. Analysts need tools to explore data and generate insights.',
  realWorldExample: {
    company: 'Airbnb',
    scenario: '1,000+ employees query their data warehouse daily',
    howTheyDoIt: 'Uses Airpal (query interface) + Presto (query engine) + Hive (warehouse). Any employee can run SQL to analyze data.',
  },
  keyPoints: [
    'BI tools provide visual interface for non-technical users',
    'SQL clients give direct query access',
    'All tools connect to the same warehouse backend',
    'Query performance depends on warehouse optimization',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│           QUERY LAYER ARCHITECTURE             │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Tableau  │  │  Looker  │  │ Jupyter  │     │
│  │(BI Tool) │  │(BI Tool) │  │(Notebook)│     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │           │
│       └─────────────┼─────────────┘           │
│                     │ SQL queries             │
│                     ▼                         │
│            ┌─────────────────┐                │
│            │ Data Warehouse  │                │
│            │  (Query Engine) │                │
│            └─────────────────┘                │
│                                                │
│  All tools send SQL queries to warehouse      │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'BI Tool', explanation: 'Visual interface for building dashboards', icon: '📊' },
    { title: 'SQL Client', explanation: 'Direct SQL query interface', icon: '💻' },
    { title: 'Query Engine', explanation: 'Executes SQL and returns results', icon: '⚙️' },
  ],
  quickCheck: {
    question: 'What do BI tools and SQL clients have in common?',
    options: [
      'They both store data locally',
      'They both send SQL queries to the warehouse',
      'They both require Python knowledge',
      'They both replace the need for a warehouse',
    ],
    correctIndex: 1,
    explanation: 'All query tools (BI tools, SQL clients, notebooks) send SQL queries to the warehouse. The warehouse executes the query and returns results.',
  },
};

const step3: GuidedStep = {
  id: 'analytics-warehouse-step-3',
  stepNumber: 3,
  frIndex: 0,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Analysts must be able to query the warehouse',
    taskDescription: 'Add Client (analysts/BI tools) connecting to the Data Warehouse',
    componentsNeeded: [
      { type: 'database', reason: 'Source OLTP', displayName: 'Database' },
      { type: 'etl', reason: 'ETL pipeline', displayName: 'ETL Pipeline' },
      { type: 'data_warehouse', reason: 'Analytical warehouse', displayName: 'Data Warehouse' },
      { type: 'client', reason: 'Analysts and BI tools', displayName: 'Client' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'ETL Pipeline', reason: 'Extract data' },
      { from: 'ETL Pipeline', to: 'Data Warehouse', reason: 'Load data' },
      { from: 'Client', to: 'Data Warehouse', reason: 'Query data' },
    ],
    successCriteria: ['Add Client', 'Connect Client → Data Warehouse for queries'],
  },
  validation: {
    requiredComponents: ['database', 'etl', 'data_warehouse', 'client'],
    requiredConnections: [
      { fromType: 'database', toType: 'etl' },
      { fromType: 'etl', toType: 'data_warehouse' },
      { fromType: 'client', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Add Client and connect to Data Warehouse',
    level2: 'Full architecture: Database → ETL → Warehouse, and Client → Warehouse',
    solutionComponents: [{ type: 'database' }, { type: 'etl' }, { type: 'data_warehouse' }, { type: 'client' }],
    solutionConnections: [
      { from: 'database', to: 'etl' },
      { from: 'etl', to: 'data_warehouse' },
      { from: 'client', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// STEP 4: The Slowdown - Queries Need Columnar Storage
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Analysts are complaining: 'My queries take 5 minutes! I only need 3 columns but the query scans ALL 50 columns!'",
  hook: "Row-oriented storage reads entire rows even when you only need a few columns. For analytical queries, this is brutally inefficient!",
  challenge: "Convert from row-oriented to columnar storage. This will make analytical queries 10-100x faster!",
  illustration: 'columnar-storage',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Columnar storage is live!",
  achievement: "Queries are now 10-100x faster",
  metrics: [
    { label: 'Query time', before: '300s', after: '5s' },
    { label: 'Data scanned', before: '1TB', after: '10GB' },
    { label: 'I/O reduction', after: '100x' },
  ],
  nextTeaser: "Much better! But joins across multiple tables are still slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Columnar Storage: The OLAP Secret Weapon',
  conceptExplanation: `**The key insight**: OLAP queries read FEW columns but MANY rows.

**Row-oriented storage** (traditional databases):
- Stores entire row together: [id, name, age, city, revenue, ...]
- Reading 1 column = must read entire row
- Query: "SELECT SUM(revenue) FROM sales"
- Must scan ALL columns even though you only need revenue!

**Columnar storage** (data warehouses):
- Stores each column separately: [revenue column] [name column] [city column]
- Reading 1 column = only read that column's data
- Query: "SELECT SUM(revenue) FROM sales"
- Only scans revenue column! 10-100x less data!

**Additional benefits:**
1. **Better compression** - similar values compress well (dates, categories)
2. **Vectorized execution** - CPU processes columns in batches (SIMD)
3. **Predicate pushdown** - skip irrelevant data before reading

**Example:**
\`\`\`
Query: SELECT region, SUM(revenue) FROM sales GROUP BY region

Row storage:     Scan 50 columns × 1B rows = 50B values
Columnar storage: Scan 2 columns × 1B rows = 2B values
Speedup: 25x less data read!
\`\`\``,
  whyItMatters: 'Columnar storage is what makes modern data warehouses (Redshift, BigQuery, Snowflake) 10-100x faster than traditional databases for analytics.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Stores 300 PB of data in their warehouse',
    howTheyDoIt: 'Uses columnar format (Parquet) in their data lake. Queries that would take hours with row storage complete in seconds with columnar.',
  },
  famousIncident: {
    title: 'Google Dremel/BigQuery Revolution',
    company: 'Google',
    year: '2010',
    whatHappened: 'Google published the Dremel paper showing how columnar storage + distributed execution could scan petabytes in seconds. This inspired modern cloud warehouses like BigQuery, Snowflake, and Redshift.',
    lessonLearned: 'Columnar storage + compression + parallelism = game changer for analytics at scale',
    icon: '🚀',
  },
  keyPoints: [
    'Row storage: good for OLTP (read/write whole rows)',
    'Columnar storage: good for OLAP (read few columns, many rows)',
    'Columnar provides 10-100x speedup for analytical queries',
    'Modern warehouses (Redshift, BigQuery, Snowflake) all use columnar',
    'Better compression (similar values cluster together)',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│         ROW vs COLUMNAR STORAGE                │
├────────────────────────────────────────────────┤
│                                                │
│  ROW-ORIENTED (Traditional DB):                │
│  ┌──────────────────────────────────────────┐  │
│  │ Row 1: [id=1, name="Alice", revenue=100] │  │
│  │ Row 2: [id=2, name="Bob",   revenue=200] │  │
│  │ Row 3: [id=3, name="Carol", revenue=150] │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Query: SELECT SUM(revenue)                    │
│  Must scan: id, name, revenue (all columns!)  │
│                                                │
│  ──────────────────────────────────────────── │
│                                                │
│  COLUMNAR (Data Warehouse):                    │
│  ┌──────┐ ┌───────┐ ┌─────────┐              │
│  │  id  │ │ name  │ │ revenue │              │
│  ├──────┤ ├───────┤ ├─────────┤              │
│  │  1   │ │ Alice │ │   100   │              │
│  │  2   │ │ Bob   │ │   200   │              │
│  │  3   │ │ Carol │ │   150   │              │
│  └──────┘ └───────┘ └─────────┘              │
│                                                │
│  Query: SELECT SUM(revenue)                    │
│  Only scan: revenue column! 10-100x faster!   │
│                                                │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Row Storage', explanation: 'Store entire row together (OLTP)', icon: '📏' },
    { title: 'Columnar Storage', explanation: 'Store each column separately (OLAP)', icon: '📊' },
    { title: 'Compression', explanation: 'Similar values compress better in columns', icon: '🗜️' },
    { title: 'I/O Reduction', explanation: 'Read only needed columns, skip the rest', icon: '⚡' },
  ],
  quickCheck: {
    question: 'Why is columnar storage faster for analytical queries?',
    options: [
      'It stores less data overall',
      'It only reads the columns you need, not entire rows',
      'It runs on faster hardware',
      'It caches all queries automatically',
    ],
    correctIndex: 1,
    explanation: 'Columnar storage only reads the columns you need. If you query 3 columns out of 50, you read 94% less data!',
  },
};

const step4: GuidedStep = {
  id: 'analytics-warehouse-step-4',
  stepNumber: 4,
  frIndex: 1,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Optimize warehouse with columnar storage for fast column scans',
    taskDescription: 'Keep existing architecture - columnar storage is a Data Warehouse optimization',
    componentsNeeded: [
      { type: 'database', reason: 'Source OLTP', displayName: 'Database' },
      { type: 'etl', reason: 'ETL pipeline', displayName: 'ETL Pipeline' },
      { type: 'data_warehouse', reason: 'Now with columnar storage', displayName: 'Data Warehouse' },
      { type: 'client', reason: 'Analysts', displayName: 'Client' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'ETL Pipeline', reason: 'Extract' },
      { from: 'ETL Pipeline', to: 'Data Warehouse', reason: 'Load' },
      { from: 'Client', to: 'Data Warehouse', reason: 'Query' },
    ],
    successCriteria: ['Architecture remains the same - columnar is internal warehouse optimization'],
  },
  validation: {
    requiredComponents: ['database', 'etl', 'data_warehouse', 'client'],
    requiredConnections: [
      { fromType: 'database', toType: 'etl' },
      { fromType: 'etl', toType: 'data_warehouse' },
      { fromType: 'client', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Columnar storage is an internal optimization - keep your architecture the same',
    level2: 'No architecture changes needed. The Data Warehouse now uses columnar format internally.',
    solutionComponents: [{ type: 'database' }, { type: 'etl' }, { type: 'data_warehouse' }, { type: 'client' }],
    solutionConnections: [
      { from: 'database', to: 'etl' },
      { from: 'etl', to: 'data_warehouse' },
      { from: 'client', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// STEP 5: The Schema - Star Schema for Fast Joins
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⭐',
  scenario: "Analysts are running queries that join 5-10 tables together. These multi-table joins are still slow!",
  hook: "Normalized OLTP schemas (3NF) require many joins. For analytics, we need a denormalized star schema that minimizes joins.",
  challenge: "Restructure your warehouse schema into a star schema: fact tables at center, dimension tables around them.",
  illustration: 'star-schema',
};

const step5Celebration: CelebrationContent = {
  emoji: '🌟',
  message: "Star schema is implemented!",
  achievement: "Multi-table queries are now blazing fast",
  metrics: [
    { label: 'Join performance', before: '60s', after: '3s' },
    { label: 'Query complexity', before: '10 joins', after: '2-3 joins' },
  ],
  nextTeaser: "Great! But analysts run the same aggregations repeatedly. Can we pre-compute them?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Star Schema: Optimizing for Analytical Queries',
  conceptExplanation: `**The problem**: Normalized schemas (OLTP) require many joins for analytics.

**Example normalized OLTP schema:**
- Query: "Revenue by product category and customer region"
- Joins needed: sales → orders → customers → addresses → regions
                        → order_items → products → categories
- That's 7 tables and 6 joins!

**Star Schema Solution:**
- **Fact table** (center): Contains metrics/measures
  - Example: sales_facts (revenue, quantity, date_id, product_id, customer_id)
- **Dimension tables** (points): Descriptive attributes
  - Example: dim_products (product_id, name, category, brand)
  - Example: dim_customers (customer_id, name, region, segment)

**Benefits:**
1. **Fewer joins** - typically 2-3 instead of 6-10
2. **Denormalized dims** - all product info in dim_products
3. **Pre-joined** - ETL does the joining, not the query engine
4. **Simple queries** - easier for analysts to understand

**Star vs Snowflake Schema:**
- **Star**: Dimensions are denormalized (flat)
- **Snowflake**: Dimensions are normalized (more tables, more joins)
- For analytics: Star is usually better (fewer joins)`,
  whyItMatters: 'Star schema is the standard for data warehouses. It makes queries faster, simpler, and more maintainable.',
  realWorldExample: {
    company: 'Walmart',
    scenario: 'Analyzes trillions of transactions across thousands of stores',
    howTheyDoIt: 'Uses massive star schema: sales_facts at center (6B rows/day), dimensions for products, stores, customers, dates. Queries that would take hours on normalized schema complete in seconds.',
  },
  famousIncident: {
    title: 'The Data Warehouse Toolkit',
    company: 'Kimball Group',
    year: '1996',
    whatHappened: 'Ralph Kimball published "The Data Warehouse Toolkit" standardizing star schema design. This became the bible for data warehouse design and is still the go-to pattern 25+ years later.',
    lessonLearned: 'Star schema is proven at scale - don\'t reinvent the wheel, follow Kimball!',
    icon: '📚',
  },
  keyPoints: [
    'Star schema: fact table (center) + dimension tables (points)',
    'Fact table: measures/metrics (revenue, quantity, counts)',
    'Dimension tables: attributes (product name, customer region)',
    'Denormalize dimensions to reduce joins',
    'ETL does complex joins, queries become simple',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│              STAR SCHEMA PATTERN               │
├────────────────────────────────────────────────┤
│                                                │
│         ┌─────────────────┐                    │
│         │  dim_products   │                    │
│         │ • product_id    │                    │
│         │ • name          │                    │
│         │ • category      │                    │
│         │ • brand         │                    │
│         └────────┬────────┘                    │
│                  │                             │
│  ┌──────────────┼──────────────┐              │
│  │              │              │              │
│  ▼              ▼              ▼              │
│┌────────┐  ┌─────────────┐  ┌────────┐       │
││dim_date│  │ sales_facts │  │dim_cust│       │
││• date  │──│• revenue    │──│• cust_id│       │
││• month │  │• quantity   │  │• name   │       │
││• year  │  │• date_id    │  │• region │       │
│└────────┘  │• product_id │  └────────┘       │
│            │• customer_id│                    │
│            └─────────────┘                    │
│                                                │
│  Query: SELECT region, category, SUM(revenue) │
│         FROM sales_facts                      │
│         JOIN dim_customers USING (customer_id)│
│         JOIN dim_products USING (product_id)  │
│         GROUP BY region, category             │
│                                                │
│  Only 2 joins instead of 6-10!                │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Fact Table', explanation: 'Central table with metrics (revenue, quantity)', icon: '📊' },
    { title: 'Dimension Table', explanation: 'Descriptive attributes (product, customer, date)', icon: '🏷️' },
    { title: 'Denormalization', explanation: 'Flatten dimensions to reduce joins', icon: '📏' },
    { title: 'Star Schema', explanation: 'Fact at center, dimensions as points', icon: '⭐' },
  ],
  quickCheck: {
    question: 'What is the main benefit of star schema over normalized OLTP schema?',
    options: [
      'It stores less data',
      'It requires fewer joins for analytical queries',
      'It prevents all data duplication',
      'It automatically backs up data',
    ],
    correctIndex: 1,
    explanation: 'Star schema denormalizes dimensions to minimize joins. Analytical queries become simpler and faster with 2-3 joins instead of 6-10.',
  },
};

const step5: GuidedStep = {
  id: 'analytics-warehouse-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Optimize warehouse schema for fast multi-dimensional queries',
    taskDescription: 'Star schema is a data modeling pattern - no architecture changes needed',
    componentsNeeded: [
      { type: 'database', reason: 'Source OLTP', displayName: 'Database' },
      { type: 'etl', reason: 'ETL transforms to star schema', displayName: 'ETL Pipeline' },
      { type: 'data_warehouse', reason: 'Now with star schema', displayName: 'Data Warehouse' },
      { type: 'client', reason: 'Analysts', displayName: 'Client' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'ETL Pipeline', reason: 'Extract' },
      { from: 'ETL Pipeline', to: 'Data Warehouse', reason: 'Load star schema' },
      { from: 'Client', to: 'Data Warehouse', reason: 'Query' },
    ],
    successCriteria: ['Architecture stays the same - star schema is a data modeling pattern'],
  },
  validation: {
    requiredComponents: ['database', 'etl', 'data_warehouse', 'client'],
    requiredConnections: [
      { fromType: 'database', toType: 'etl' },
      { fromType: 'etl', toType: 'data_warehouse' },
      { fromType: 'client', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Star schema is a data modeling pattern - no new components needed',
    level2: 'Keep same architecture. ETL now transforms data into star schema format.',
    solutionComponents: [{ type: 'database' }, { type: 'etl' }, { type: 'data_warehouse' }, { type: 'client' }],
    solutionConnections: [
      { from: 'database', to: 'etl' },
      { from: 'etl', to: 'data_warehouse' },
      { from: 'client', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// STEP 6: The Optimization - Materialized Views
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💎',
  scenario: "You notice analysts run the same queries every day: 'Daily revenue by region', 'Weekly top products'...",
  hook: "These queries scan billions of rows and take 30 seconds EVERY TIME. Why recompute the same aggregation when we can pre-compute it?",
  challenge: "Add materialized views to pre-compute common aggregations. Turn 30-second queries into 1-second lookups!",
  illustration: 'materialized-views',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Materialized views are live!",
  achievement: "Dashboard queries are instant",
  metrics: [
    { label: 'Dashboard query time', before: '30s', after: '1s' },
    { label: 'Compute savings', after: '97%' },
    { label: 'User happiness', before: '😐', after: '😊' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade analytics warehouse!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Materialized Views: Pre-computed Aggregations',
  conceptExplanation: `**The insight**: 80% of queries compute the same aggregations.

**Regular view** (just a saved query):
- Query: \`CREATE VIEW daily_revenue AS SELECT date, SUM(revenue) FROM sales GROUP BY date\`
- When you query the view: Re-executes the aggregation EVERY TIME
- Performance: Same as running the query manually

**Materialized view** (pre-computed results):
- Query: \`CREATE MATERIALIZED VIEW daily_revenue AS SELECT date, SUM(revenue) FROM sales GROUP BY date\`
- When you query the view: Returns pre-computed results instantly
- Performance: 10-1000x faster than regular view!

**How it works:**
1. **Initial computation**: Compute the aggregation once
2. **Store results**: Save the aggregated data
3. **Query the results**: Instant lookups, no recomputation
4. **Refresh strategy**:
   - **Full refresh**: Recompute entire view (simple but slow)
   - **Incremental refresh**: Only update new data (fast!)
   - **Scheduled**: Refresh every hour/day

**Common use cases:**
- Daily/weekly/monthly aggregations
- Top N queries (top 10 products)
- Complex multi-table joins
- Dashboard KPIs

**Trade-offs:**
- ✅ 10-1000x query speedup
- ✅ Reduce compute costs
- ❌ Storage cost (store aggregated data)
- ❌ Data staleness (view may lag behind source)`,
  whyItMatters: 'Materialized views turn expensive aggregations into instant lookups. Essential for dashboards and reports that query the same data repeatedly.',
  realWorldExample: {
    company: 'Pinterest',
    scenario: 'Dashboards show daily metrics: pins, repins, impressions',
    howTheyDoIt: 'Uses materialized views refreshed hourly. Dashboard queries that scanned 100TB now query 100MB pre-aggregated views. Load time: 30s → 0.5s.',
  },
  famousIncident: {
    title: 'The Netflix Dashboard Crisis',
    company: 'Netflix',
    year: '2015',
    whatHappened: 'Executive dashboards became unusably slow as data grew. Queries took 5-10 minutes. Execs stopped using dashboards. The data team added materialized views and reduced query time to 2-3 seconds.',
    lessonLearned: 'If dashboards are slow, they become useless. Materialized views are essential for real-time dashboard performance.',
    icon: '📺',
  },
  keyPoints: [
    'Materialized views pre-compute and store aggregation results',
    'Turn 30-second queries into 1-second lookups',
    'Perfect for dashboards and repeated aggregations',
    'Refresh strategies: full, incremental, scheduled',
    'Trade-off: storage cost and potential staleness',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│      MATERIALIZED VIEW ARCHITECTURE            │
├────────────────────────────────────────────────┤
│                                                │
│  WITHOUT MATERIALIZED VIEW:                    │
│  ┌──────────┐                                  │
│  │ Analyst  │ Query: Daily revenue by region   │
│  └────┬─────┘                                  │
│       │ Every query scans billions of rows    │
│       ▼                                        │
│  ┌─────────────────┐                           │
│  │ sales_facts     │ 10 billion rows          │
│  │ Scan all data! │ 30 seconds per query     │
│  └─────────────────┘                           │
│                                                │
│  ──────────────────────────────────────────── │
│                                                │
│  WITH MATERIALIZED VIEW:                       │
│  ┌──────────┐                                  │
│  │ Analyst  │ Query materialized view          │
│  └────┬─────┘                                  │
│       │ Fast lookup!                          │
│       ▼                                        │
│  ┌──────────────────────┐                      │
│  │ mv_daily_revenue     │ 1,825 rows (5 years)│
│  │ Pre-aggregated data! │ 1 second per query  │
│  └──────────────────────┘                      │
│       ▲                                        │
│       │ Refresh hourly                        │
│  ┌─────────────────┐                           │
│  │ sales_facts     │ 10 billion rows          │
│  │ (source data)   │                          │
│  └─────────────────┘                           │
│                                                │
│  Query speedup: 30x!                          │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Regular View', explanation: 'Saved query, recomputes every time', icon: '👁️' },
    { title: 'Materialized View', explanation: 'Pre-computed results stored on disk', icon: '💎' },
    { title: 'Refresh', explanation: 'Update materialized view with new data', icon: '🔄' },
    { title: 'Staleness', explanation: 'Time between refresh and latest data', icon: '⏰' },
  ],
  quickCheck: {
    question: 'What is the main benefit of materialized views over regular views?',
    options: [
      'They use less storage',
      'They are always 100% up-to-date',
      'They pre-compute results for instant queries',
      'They automatically create indexes',
    ],
    correctIndex: 2,
    explanation: 'Materialized views pre-compute and store aggregation results. Queries become instant lookups instead of expensive recomputations.',
  },
};

const step6: GuidedStep = {
  id: 'analytics-warehouse-step-6',
  stepNumber: 6,
  frIndex: 2,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Pre-compute common aggregations for instant dashboard queries',
    taskDescription: 'Materialized views are internal warehouse optimization - no architecture changes',
    componentsNeeded: [
      { type: 'database', reason: 'Source OLTP', displayName: 'Database' },
      { type: 'etl', reason: 'ETL pipeline', displayName: 'ETL Pipeline' },
      { type: 'data_warehouse', reason: 'Now with materialized views', displayName: 'Data Warehouse' },
      { type: 'client', reason: 'Analysts', displayName: 'Client' },
    ],
    connectionsNeeded: [
      { from: 'Database', to: 'ETL Pipeline', reason: 'Extract' },
      { from: 'ETL Pipeline', to: 'Data Warehouse', reason: 'Load' },
      { from: 'Client', to: 'Data Warehouse', reason: 'Query' },
    ],
    successCriteria: ['Architecture stays the same - materialized views are internal optimization'],
  },
  validation: {
    requiredComponents: ['database', 'etl', 'data_warehouse', 'client'],
    requiredConnections: [
      { fromType: 'database', toType: 'etl' },
      { fromType: 'etl', toType: 'data_warehouse' },
      { fromType: 'client', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Materialized views are internal warehouse optimization - no new components',
    level2: 'Keep same architecture. Warehouse now maintains materialized views internally.',
    solutionComponents: [{ type: 'database' }, { type: 'etl' }, { type: 'data_warehouse' }, { type: 'client' }],
    solutionConnections: [
      { from: 'database', to: 'etl' },
      { from: 'etl', to: 'data_warehouse' },
      { from: 'client', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const analyticsWarehouseGuidedTutorial: GuidedTutorial = {
  problemId: 'analytics-warehouse-guided',
  problemTitle: 'Build an Analytics Data Warehouse - From OLTP to OLAP',

  requirementsPhase: analyticsWarehouseRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Query Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Execute simple analytical queries on the warehouse',
      traffic: { type: 'read', rps: 10, readRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Data Freshness',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Data must be available within 15 minutes of ingestion',
      traffic: { type: 'mixed', rps: 50, readRps: 45, writeRps: 5 },
      duration: 60,
      passCriteria: { maxDataLag: 900, maxErrorRate: 0.05 },
    },
    {
      name: 'Aggregation Performance',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Pre-computed aggregations return in < 5 seconds',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 60,
      passCriteria: { maxP95Latency: 5000, maxErrorRate: 0.01 },
    },
    {
      name: 'Concurrent Query Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50 concurrent analytical queries',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 90,
      passCriteria: { maxP99Latency: 30000, maxErrorRate: 0.05 },
    },
    {
      name: 'Large Scan Efficiency',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Efficiently scan billions of rows with columnar storage',
      traffic: { type: 'read', rps: 150, readRps: 150 },
      duration: 120,
      passCriteria: { maxP95Latency: 10000, minDataScanned: 1000000000 },
    },
    {
      name: 'ETL Pipeline Reliability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'ETL pipeline handles failures and continues ingestion',
      traffic: { type: 'mixed', rps: 100, readRps: 80, writeRps: 20 },
      duration: 90,
      failureInjection: { type: 'etl_delay', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getAnalyticsWarehouseGuidedTutorial(): GuidedTutorial {
  return analyticsWarehouseGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = analyticsWarehouseRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= analyticsWarehouseRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
