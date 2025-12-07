import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Banking Transaction Database Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching critical banking system concepts:
 * - ACID transactions
 * - Double-entry bookkeeping
 * - Audit trails and compliance
 * - Strong consistency requirements
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (ACID guarantees, replication, audit, etc.)
 *
 * Key Concepts:
 * - ACID properties (Atomicity, Consistency, Isolation, Durability)
 * - Double-entry bookkeeping (every debit has a credit)
 * - Immutable audit logs
 * - Transaction isolation levels
 * - Strong consistency requirements
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const bankingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a banking transaction database system",

  interviewer: {
    name: 'David Martinez',
    role: 'VP of Engineering at FinanceCore Bank',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core operations users need from a banking system?",
      answer: "Customers need to:\n\n1. **Transfer money** - Move funds between accounts\n2. **Check balance** - View current account balance\n3. **View transaction history** - See all past transactions\n4. **Deposit/Withdraw** - Add or remove money from accounts",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Banking is fundamentally about moving and tracking money with perfect accuracy",
    },
    {
      id: 'transaction-guarantees',
      category: 'functional',
      question: "What happens if a transfer fails halfway through - money is deducted but never credited?",
      answer: "This is CATASTROPHIC! Banking systems MUST be **atomic** - either the complete transfer succeeds (debit AND credit), or nothing happens at all. We can NEVER have partial transfers. This is the 'A' in ACID.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "ACID guarantees are non-negotiable for financial systems",
    },
    {
      id: 'double-entry',
      category: 'functional',
      question: "How do you ensure the bank's books always balance?",
      answer: "We use **double-entry bookkeeping**: every transaction has TWO entries - a debit and a credit. If Alice sends $100 to Bob:\n- Debit Alice's account: -$100\n- Credit Bob's account: +$100\n\nThe sum of all debits must equal the sum of all credits. Always.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Double-entry bookkeeping is 700 years old and still the foundation of all accounting",
    },
    {
      id: 'audit-trail',
      category: 'functional',
      question: "Do regulators need to audit transactions? Can transactions be modified or deleted?",
      answer: "Absolutely NO modifications or deletions! Every transaction is **immutable** and must have a complete audit trail:\n- Who initiated it\n- When it happened\n- What changed\n- Why it happened\n\nRegulators can audit any transaction from the past 7 years. Tampering with records is illegal.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Financial audit trails are legally required and must be immutable",
    },
    {
      id: 'concurrent-transfers',
      category: 'clarification',
      question: "What if two people try to transfer money from the same account simultaneously?",
      answer: "We need **transaction isolation**! Each transfer must see a consistent snapshot of the account balance. We use database locks or optimistic concurrency control to prevent race conditions and overdrafts.",
      importance: 'critical',
      insight: "Isolation prevents race conditions that could allow overdrafts or lost updates",
    },
    {
      id: 'fraud-detection',
      category: 'clarification',
      question: "Do we need fraud detection or suspicious activity monitoring?",
      answer: "For MVP, we'll log all transactions for later analysis. Real-time fraud detection can be v2. But we MUST log everything for forensics.",
      importance: 'important',
      insight: "Comprehensive logging enables fraud detection and regulatory compliance",
    },

    // SCALE & NFRs
    {
      id: 'throughput-transactions',
      category: 'throughput',
      question: "How many transactions per day should we handle?",
      answer: "50 million transactions per day at steady state, with spikes to 150 million during payroll periods (end of month)",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 transactions/sec",
        result: "~579 TPS average, ~1,737 TPS peak",
      },
      learningPoint: "Banking has predictable daily patterns with end-of-month spikes",
    },
    {
      id: 'throughput-balance-checks',
      category: 'throughput',
      question: "How many balance inquiries per day?",
      answer: "About 500 million per day - users check balances 10x more often than they transfer money",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~5,787 reads/sec average, ~17,361 peak",
      },
      learningPoint: "Read-heavy workload, but writes (transfers) have stricter consistency requirements",
    },
    {
      id: 'latency-transfer',
      category: 'latency',
      question: "How fast should money transfers be?",
      answer: "p99 under 200ms for transfers. Customers are waiting for confirmation - slow transfers hurt trust.",
      importance: 'critical',
      learningPoint: "Transfer latency impacts user experience and trust",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "Can we use eventual consistency for account balances?",
      answer: "Absolutely NOT! Banking requires **strong consistency**. Users must ALWAYS see the current balance. Eventual consistency could allow overdrafts or show incorrect balances. This is legally and financially unacceptable.",
      importance: 'critical',
      learningPoint: "Financial systems demand strong consistency - eventual consistency is illegal",
    },
    {
      id: 'data-retention',
      category: 'reliability',
      question: "How long must we retain transaction records?",
      answer: "Legally required: 7 years minimum. Transaction records are immutable and must survive hardware failures, disasters, and audits.",
      importance: 'critical',
      insight: "Regulatory compliance requires long-term, immutable storage with backups",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'transaction-guarantees', 'double-entry'],
  criticalFRQuestionIds: ['core-operations', 'transaction-guarantees', 'double-entry'],
  criticalScaleQuestionIds: ['throughput-transactions', 'consistency-requirements', 'data-retention'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Transfer money between accounts',
      description: 'Users can move funds from one account to another',
      emoji: '💸',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Check account balance',
      description: 'Users can view current account balance',
      emoji: '💰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: View transaction history',
      description: 'Users can see all past transactions',
      emoji: '📜',
    },
    {
      id: 'fr-4',
      text: 'FR-4: ACID transaction guarantees',
      description: 'All transfers are atomic, consistent, isolated, and durable',
      emoji: '⚛️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Double-entry bookkeeping',
      description: 'Every transaction has balanced debits and credits',
      emoji: '⚖️',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Immutable audit trail',
      description: 'All transactions are permanently logged and auditable',
      emoji: '🔒',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million customers',
    writesPerDay: '50 million transactions',
    readsPerDay: '500 million balance checks',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 579, peak: 1737 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~1KB (transaction record)',
    storagePerRecord: '~500 bytes (transaction)',
    storageGrowthPerYear: '~9TB (7-year retention)',
    redirectLatencySLA: 'p99 < 200ms (transfer)',
    createLatencySLA: 'p99 < 50ms (balance check)',
  },

  architecturalImplications: [
    '✅ Strong consistency required → ACID-compliant database (PostgreSQL)',
    '✅ Double-entry bookkeeping → Transaction table with debits and credits',
    '✅ Immutable audit trail → Append-only logs, no updates/deletes',
    '✅ High transaction volume → Database replication for reads',
    '✅ Regulatory compliance → Long-term storage with backups',
    '✅ Isolation required → Database transaction locks',
  ],

  outOfScope: [
    'Real-time fraud detection',
    'Multi-currency support',
    'Interest calculation',
    'Credit/debit card processing',
    'Mobile banking interface',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can transfer money with ACID guarantees. Then we'll add double-entry bookkeeping, audit trails, and scale to handle millions of transactions. Correctness first, then performance!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏦',
  scenario: "Welcome to FinanceCore Bank! You've been hired to build their core banking system.",
  hook: "Your first customer wants to transfer $100 to their friend. But there's no system yet!",
  challenge: "Set up the basic connection so customers can reach your banking server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your banking system is online!',
  achievement: 'Customers can now send requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process transactions yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Banking API Architecture',
  conceptExplanation: `Every banking system starts with a **Client** connecting to a **Server**.

When a customer initiates a transfer:
1. Their application (web/mobile) is the **Client**
2. It sends HTTPS requests to your **Banking Server**
3. The server processes the transaction and returns success/failure

This is the foundation of ALL banking systems!`,

  whyItMatters: 'Without this connection, customers can\'t access their accounts or transfer money.',

  realWorldExample: {
    company: 'Chase Bank',
    scenario: 'Processing millions of transactions daily',
    howTheyDoIt: 'Their mobile app connects to hundreds of banking servers distributed globally for low latency',
  },

  keyPoints: [
    'Client = customer\'s application (web, mobile, ATM)',
    'Banking Server = your backend that processes transactions',
    'HTTPS = secure protocol required for financial data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer application making banking requests', icon: '📱' },
    { title: 'Banking Server', explanation: 'Your backend that handles transaction logic', icon: '🏦' },
    { title: 'HTTPS', explanation: 'Encrypted protocol for secure financial data', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'banking-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all banking operations',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents banking customers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles transaction processing logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Transaction APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it's just an empty shell!",
  hook: "A customer tried to transfer $100 but got a 404 error. The server doesn't know how to process transactions!",
  challenge: "Write the Python code to handle transfers, balance checks, and transaction history.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your banking APIs are live!',
  achievement: 'You implemented the core transaction processing functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can transfer money', after: '✓' },
    { label: 'Can check balance', after: '✓' },
    { label: 'Can view history', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all transaction records are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Banking API Implementation: Critical Transaction Handlers',
  conceptExplanation: `Every banking API needs **handler functions** that process financial transactions.

For our banking system, we need handlers for:
- \`transfer()\` - Move money between accounts
- \`get_balance()\` - Retrieve current account balance
- \`get_history()\` - Fetch transaction history

**Critical requirements:**
1. **Validate inputs** - Check account exists, sufficient funds, valid amount
2. **Process atomically** - All-or-nothing (debit + credit together)
3. **Return clear status** - success, failed, or insufficient_funds
4. **Never allow negative balances** - Enforce business rules

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Banking handlers must be bulletproof. A bug here means real money lost or stolen!',

  famousIncident: {
    title: 'RBS Banking Outage',
    company: 'Royal Bank of Scotland',
    year: '2012',
    whatHappened: 'A software update corrupted RBS\'s transaction processing system. For 3 weeks, customers couldn\'t access accounts, wages weren\'t paid, and mortgages defaulted. The bank was fined £56 million.',
    lessonLearned: 'Banking software must be tested exhaustively. One bug can affect millions of customers.',
    icon: '💷',
  },

  realWorldExample: {
    company: 'JPMorgan Chase',
    scenario: 'Processing 1,737 transactions/second at peak',
    howTheyDoIt: 'Their transaction APIs use state machines with retry logic, duplicate detection, and comprehensive error handling',
  },

  keyPoints: [
    'Each banking API needs a handler function',
    'Validate all inputs - amount, account existence, sufficient funds',
    'Use in-memory storage for now (database comes next)',
    'Always return clear status: success/failed/insufficient_funds',
  ],

  quickCheck: {
    question: 'Why must banking transactions be atomic?',
    options: [
      'It makes them faster',
      'To prevent partial transfers where money is deducted but never credited',
      'It reduces server load',
      'It\'s required by banking regulations',
    ],
    correctIndex: 1,
    explanation: 'Atomicity ensures either the complete transaction succeeds (debit AND credit) or nothing happens. Partial transfers would lose money!',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes a banking API request', icon: '⚙️' },
    { title: 'Atomicity', explanation: 'All-or-nothing - transaction fully succeeds or fully fails', icon: '⚛️' },
    { title: 'Validation', explanation: 'Check business rules before processing', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'banking-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Transfer money, FR-2: Check balance, FR-3: View history',
    taskDescription: 'Configure APIs and implement Python handlers for transaction processing',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/transfer, GET /api/v1/balance/:account, GET /api/v1/history/:account APIs',
      'Open the Python tab',
      'Implement transfer(), get_balance(), and get_history() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the App Server, then go to the APIs tab to assign banking endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for transfer, get_balance, and get_history',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/transfer', 'GET /api/v1/balance/:account', 'GET /api/v1/history/:account'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database with ACID Guarantees
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed during a $50,000 transfer at 2 AM...",
  hook: "When it came back, the money vanished! It was deducted from one account but never credited to the other. Both customers are furious!",
  challenge: "Add a database with ACID guarantees so financial data survives crashes AND transfers are atomic.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your transactions are now ACID-compliant!',
  achievement: 'Financial data persists with atomicity, consistency, isolation, and durability',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Transaction atomicity', after: '100%' },
    { label: 'ACID compliance', after: '✓' },
  ],
  nextTeaser: "But we're not tracking the complete story of each transaction...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'ACID Transactions: The Foundation of Banking',
  conceptExplanation: `For banking systems, ACID guarantees are **legally and financially mandatory**.

**ACID Properties:**

**A - Atomicity**: All-or-nothing
- Transfer either fully succeeds (debit AND credit) or fully fails
- No partial transfers where money disappears

**C - Consistency**: Business rules enforced
- Account balances can't go negative
- Double-entry bookkeeping always balanced

**I - Isolation**: Concurrent transactions don't interfere
- Two simultaneous withdrawals won't cause overdraft
- Each transaction sees consistent snapshot

**D - Durability**: Committed transactions survive crashes
- Once you see "Transfer successful", it's permanent
- Survives power outages, crashes, hardware failures

For banking, we need databases like PostgreSQL that provide ACID guarantees.`,

  whyItMatters: 'Without ACID:\n1. Money can disappear or duplicate\n2. Accounts can overdraft\n3. Crashes can corrupt data\n4. You go to jail for losing customer money',

  famousIncident: {
    title: 'TSB Bank Migration Disaster',
    company: 'TSB Bank',
    year: '2018',
    whatHappened: 'TSB migrated to a new database system that didn\'t properly implement ACID guarantees. For weeks, customers saw wrong balances, duplicate transactions, and could access other people\'s accounts. The CEO resigned.',
    lessonLearned: 'ACID guarantees are non-negotiable for financial systems. Never compromise on transaction safety.',
    icon: '🏦',
  },

  realWorldExample: {
    company: 'Wells Fargo',
    scenario: 'Processing billions of transactions annually',
    howTheyDoIt: 'Uses Oracle databases with ACID guarantees, transaction logs, and point-in-time recovery',
  },

  keyPoints: [
    'ACID = Atomicity, Consistency, Isolation, Durability',
    'Use PostgreSQL for strong ACID guarantees',
    'Database transactions ensure atomic transfers',
    'Committed data survives any crash',
  ],

  quickCheck: {
    question: 'What happens if a server crashes mid-transfer without ACID guarantees?',
    options: [
      'The transfer automatically completes',
      'Money could be deducted but never credited - catastrophic data loss',
      'The database automatically recovers',
      'The transfer is automatically retried',
    ],
    correctIndex: 1,
    explanation: 'Without atomicity, a crash can leave data in an inconsistent state. ACID ensures all-or-nothing.',
  },

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Transaction', explanation: 'Group of operations that succeed or fail together', icon: '🔄' },
    { title: 'Durability', explanation: 'Committed data survives crashes permanently', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'banking-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-4: All transfers need ACID-compliant storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store transactions with ACID guarantees', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Implement Double-Entry Bookkeeping
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚖️',
  scenario: "The auditors are here! They want to verify that all transactions balance.",
  hook: "Your current system only records 'Alice sent $100 to Bob' - but it doesn't track the dual nature of the transaction. Auditors need to see BOTH the debit and the credit!",
  challenge: "Implement double-entry bookkeeping: every transaction must have TWO entries that balance to zero.",
  illustration: 'accounting-ledger',
};

const step4Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Your books always balance!',
  achievement: 'Double-entry bookkeeping implemented correctly',
  metrics: [
    { label: 'Debits = Credits', after: 'Always ✓' },
    { label: 'Audit compliance', after: '✓' },
    { label: 'Books balanced', after: '100%' },
  ],
  nextTeaser: "But we still can't prove WHO did WHAT and WHEN...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Double-Entry Bookkeeping: The 700-Year-Old Innovation',
  conceptExplanation: `**Double-entry bookkeeping** was invented in 1494 and is STILL the foundation of all accounting.

**The Core Principle:**
Every transaction affects TWO accounts with equal and opposite entries.

**For a $100 transfer from Alice to Bob:**

\`\`\`
Transaction ID: 12345
┌─────────────────────────────────────┐
│ Debit:  Alice's Account    -$100   │ ← Money leaving
│ Credit: Bob's Account      +$100   │ ← Money arriving
│ SUM:                        $0     │ ← Always balances!
└─────────────────────────────────────┘
\`\`\`

**Why this matters:**
1. **Detect errors**: If debits ≠ credits, something is wrong
2. **Prevent fraud**: Can't "create" money from nothing
3. **Audit trail**: See both sides of every transaction
4. **Financial statements**: Automatically generate balance sheets

**Database Schema:**
\`\`\`
transactions table:
  id, timestamp, description, status

transaction_entries table:
  transaction_id, account_id, amount, type (debit/credit)
\`\`\`

For EVERY transaction, we INSERT exactly 2 entries that sum to zero.`,

  whyItMatters: 'Double-entry bookkeeping prevents financial fraud, detects errors immediately, and ensures the bank\'s books always balance.',

  famousIncident: {
    title: 'Barings Bank Collapse',
    company: 'Barings Bank',
    year: '1995',
    whatHappened: 'Trader Nick Leeson hid $1.4 billion in losses by exploiting weak accounting controls. If proper double-entry bookkeeping had been enforced, his fraud would have been detected immediately. The 233-year-old bank collapsed.',
    lessonLearned: 'Double-entry bookkeeping isn\'t optional - it\'s the only way to prevent accounting fraud.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Intuit (QuickBooks)',
    scenario: 'Millions of small businesses tracking transactions',
    howTheyDoIt: 'Every transaction automatically creates balanced debit and credit entries. Their journal reports show the double-entry structure.',
  },

  keyPoints: [
    'Every transaction has TWO entries: debit and credit',
    'Debits and credits must always sum to zero',
    'Use a transaction_entries table to store both sides',
    'Sum of all entries must equal zero (mathematical proof of correctness)',
  ],

  quickCheck: {
    question: 'If Alice sends $100 to Bob, what entries do we create?',
    options: [
      'One entry: +$100 to Bob',
      'Two entries: -$100 from Alice, +$100 to Bob',
      'Three entries: -$100 from Alice, +$100 to Bob, +$0 bank fee',
      'One entry: $100 transferred',
    ],
    correctIndex: 1,
    explanation: 'Double-entry requires TWO entries that balance: debit Alice -$100, credit Bob +$100. Sum = $0.',
  },

  keyConcepts: [
    { title: 'Debit', explanation: 'Entry that decreases account balance (money leaving)', icon: '➖' },
    { title: 'Credit', explanation: 'Entry that increases account balance (money arriving)', icon: '➕' },
    { title: 'Balanced', explanation: 'Sum of all debits equals sum of all credits', icon: '⚖️' },
  ],
};

const step4: GuidedStep = {
  id: 'banking-step-4',
  stepNumber: 4,
  frIndex: 4,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Implement double-entry bookkeeping for all transactions',
    taskDescription: 'Update your database schema and code to support double-entry accounting',
    successCriteria: [
      'Database schema includes transaction_entries table',
      'Every transfer creates TWO entries (debit and credit)',
      'Entries always balance to zero',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Create a transaction_entries table with: transaction_id, account_id, amount, type (debit/credit)',
    level2: 'In your transfer() function, create TWO entries: one debit (-amount) and one credit (+amount)',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Immutable Audit Logs
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔍',
  scenario: "The regulators are investigating a suspicious transaction from 3 months ago.",
  hook: "They demand to know: WHO initiated it, WHEN it happened, WHAT changed, and WHY. Your current system can't answer these questions!",
  challenge: "Add an immutable audit trail that logs every transaction with complete metadata.",
  illustration: 'audit-trail',
};

const step5Celebration: CelebrationContent = {
  emoji: '📋',
  message: 'Your audit trail is bulletproof!',
  achievement: 'Complete, immutable transaction logging for regulatory compliance',
  metrics: [
    { label: 'Audit trail', after: 'Complete ✓' },
    { label: 'Immutability', after: 'Enforced ✓' },
    { label: 'Regulatory compliance', after: '✓' },
  ],
  nextTeaser: "But what if multiple transfers hit the same account simultaneously?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Immutable Audit Trails: The Legal Requirement',
  conceptExplanation: `Banking regulations require a **complete, immutable audit trail** of every transaction.

**What to log for each transaction:**
1. **Who**: User ID, IP address, session ID
2. **What**: Transaction type, accounts involved, amount
3. **When**: Timestamp with timezone (UTC)
4. **Why**: Description, category, reference number
5. **How**: Request details, device info, location
6. **Result**: Success/failure, error codes, final balances

**Immutability Requirements:**
- **NEVER update** transaction records
- **NEVER delete** transaction records
- **Only INSERT** new records
- Use append-only logs
- Hash chain to detect tampering

**Database Schema:**
\`\`\`
audit_log table:
  id (auto-increment)
  timestamp (immutable)
  user_id (who)
  transaction_id (what)
  action (transfer/deposit/withdraw)
  amount
  from_account, to_account
  ip_address, device_info
  status (success/failed)
  error_code (if failed)
  previous_hash (chain to detect tampering)
\`\`\`

**Regulatory Compliance:**
- Sarbanes-Oxley (SOX) - USA
- GDPR - Europe
- PCI DSS - Payment cards
- Bank Secrecy Act (BSA) - USA

All require complete audit trails for 7+ years.`,

  whyItMatters: 'Without audit trails:\n1. Can\'t investigate fraud\n2. Can\'t meet regulatory requirements\n3. Can\'t resolve disputes\n4. Face massive fines and criminal charges',

  famousIncident: {
    title: 'Wells Fargo Fake Accounts Scandal',
    company: 'Wells Fargo',
    year: '2016',
    whatHappened: 'Employees created 2 million fake accounts. Poor audit trails made it hard to detect. When discovered, regulators fined Wells Fargo $3 billion. Proper audit logging would have caught the fraud early.',
    lessonLearned: 'Comprehensive audit trails are essential for detecting fraud and meeting regulatory requirements.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Coinbase',
    scenario: 'Crypto exchange handling billions in transactions',
    howTheyDoIt: 'Every transaction logged with: user, timestamp, amount, from/to addresses, IP, device, location. Logs are immutable and retained forever.',
  },

  keyPoints: [
    'Log WHO, WHAT, WHEN, WHY, HOW for every transaction',
    'Make logs immutable - never update or delete',
    'Retain for 7+ years for regulatory compliance',
    'Use hash chains to detect tampering',
  ],

  quickCheck: {
    question: 'Why must audit logs be immutable?',
    options: [
      'It makes them faster',
      'To prevent fraud and meet regulatory requirements for unalterable records',
      'It saves storage space',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Immutable logs prevent tampering and fraud. Regulators require proof that records haven\'t been altered.',
  },

  keyConcepts: [
    { title: 'Immutable', explanation: 'Cannot be changed or deleted after creation', icon: '🔒' },
    { title: 'Audit Trail', explanation: 'Complete record of who did what and when', icon: '📜' },
    { title: 'Compliance', explanation: 'Meeting legal and regulatory requirements', icon: '✅' },
  ],
};

const step5: GuidedStep = {
  id: 'banking-step-5',
  stepNumber: 5,
  frIndex: 5,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-6: Create immutable audit trail for all transactions',
    taskDescription: 'Add audit logging to track complete transaction metadata',
    successCriteria: [
      'Create audit_log table in database',
      'Log every transaction with: user, timestamp, amount, accounts, status',
      'Enforce immutability - no updates or deletes allowed',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Create an audit_log table with all transaction metadata',
    level2: 'In your transfer() function, INSERT an audit log entry after every transaction. Never UPDATE or DELETE audit logs.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 6: Add Database Replication (Zero Data Loss)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "EMERGENCY! Your database crashed for 30 minutes last night.",
  hook: "During that time:\n- All transactions failed\n- Customers couldn't check balances\n- ATMs stopped working\n- Regulators are investigating\n- Your job is on the line",
  challenge: "Add database replication with synchronous writes so you NEVER lose transaction data.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Financial data is now fault-tolerant!',
  achievement: 'Synchronous replication ensures zero data loss',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But concurrent transfers to the same account could cause race conditions...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Zero Data Loss for Financial Systems',
  conceptExplanation: `For banking systems, database replication is **LEGALLY MANDATORY**.

**Types of Replication:**

1. **Synchronous (REQUIRED for banking)**
   - Write to primary AND replicas before returning success
   - Guarantees: Zero data loss
   - Trade-off: Higher latency (~10-50ms extra)
   - Use for: Financial transactions (mandatory!)

2. **Asynchronous (ILLEGAL for banking)**
   - Write to primary, replicate later
   - Guarantees: None (can lose recent writes)
   - Trade-off: Lower latency
   - Use for: Non-critical data only

**Architecture:**
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Stay in sync via replication
- **Read scaling**: Route read queries to replicas
- **Failover**: Promote replica if primary fails

**For Banking:**
- Minimum 2 replicas in different availability zones
- Synchronous replication (zero data loss)
- Automatic failover with health checks
- Regular disaster recovery drills`,

  whyItMatters: 'For banking:\n1. Can\'t lose transaction data (illegal)\n2. Need audit trail for regulators\n3. Downtime = customer losses and lawsuits\n4. Synchronous replication prevents data loss',

  famousIncident: {
    title: 'TSB Bank IT Meltdown',
    company: 'TSB Bank',
    year: '2018',
    whatHappened: 'TSB migrated to a new database without proper replication. The migration failed, causing complete service outage for 1.9 million customers for over a week. They had no working backup. Cost: £330 million.',
    lessonLearned: 'Banking systems MUST have synchronous replication with tested failover procedures.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Bank of America',
    scenario: 'Zero tolerance for transaction data loss',
    howTheyDoIt: 'Uses synchronous replication across 3+ database instances in different data centers with automatic failover',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │   SYNC WRITE →   │
                         └────────┬─────────┘
                                  │ Synchronous Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Use SYNCHRONOUS replication for banking (zero data loss)',
    'Primary handles writes, replicas handle reads',
    'If primary fails, promote a replica (failover)',
    'Minimum 2 replicas in different data centers',
  ],

  quickCheck: {
    question: 'Why must banking systems use synchronous replication?',
    options: [
      'It\'s faster than async',
      'It guarantees zero data loss - critical for financial records',
      'It\'s cheaper',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Synchronous replication ensures writes are committed to multiple servers before success. Financial data cannot be lost.',
  },

  keyConcepts: [
    { title: 'Synchronous Replication', explanation: 'Write to replicas before returning success', icon: '🔒' },
    { title: 'Zero Data Loss', explanation: 'Data survives any single server failure', icon: '🛡️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'banking-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All transactions require zero-data-loss guarantees',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
      'Set replication mode to synchronous',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication, set replicas to 2+, and choose synchronous mode for financial data safety',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Implement Transaction Isolation
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🏃‍♂️',
  scenario: "A race condition just occurred! Two simultaneous withdrawals allowed the account to overdraft.",
  hook: "Alice had $100. Two ATMs simultaneously withdrew $80 each. Both checked the balance ($100), both approved, both withdrew. Alice now has -$60. The bank lost money!",
  challenge: "Implement transaction isolation to prevent concurrent transactions from interfering with each other.",
  illustration: 'race-condition',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Race conditions eliminated!',
  achievement: 'Transaction isolation prevents concurrent interference',
  metrics: [
    { label: 'Race conditions', before: 'Possible', after: 'Impossible ✓' },
    { label: 'Overdrafts', before: 'Can occur', after: 'Prevented ✓' },
    { label: 'Isolation level', after: 'Serializable' },
  ],
  nextTeaser: "Now let's make sure the system can handle peak traffic...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Transaction Isolation: Preventing Race Conditions',
  conceptExplanation: `**The Problem:** Without isolation, concurrent transactions can interfere:

**Race Condition Example:**
\`\`\`
Time  ATM-1                  ATM-2                  Balance
0     Read balance: $100     -                      $100
1     -                      Read balance: $100     $100
2     Check: $100 >= $80 ✓   -                      $100
3     -                      Check: $100 >= $80 ✓   $100
4     Withdraw $80           -                      $20
5     -                      Withdraw $80           -$60 ❌
\`\`\`

**The Solution:** Database Transaction Isolation Levels

**1. Read Uncommitted** (DON'T USE)
- Can read uncommitted changes
- Dirty reads possible

**2. Read Committed** (MINIMUM for banking)
- Only read committed changes
- Prevents dirty reads

**3. Repeatable Read** (GOOD for banking)
- Same reads within transaction return same result
- Prevents non-repeatable reads

**4. Serializable** (BEST for banking)
- Transactions execute as if serial (one at a time)
- Prevents ALL race conditions
- Highest safety, some performance cost

**Implementation:**
\`\`\`sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT balance FROM accounts WHERE id = 123 FOR UPDATE; -- Lock row
  -- Check balance >= amount
  UPDATE accounts SET balance = balance - amount WHERE id = 123;
COMMIT;
\`\`\`

The \`FOR UPDATE\` lock prevents other transactions from reading/modifying the row until commit.`,

  whyItMatters: 'Without proper isolation:\n1. Accounts can overdraft\n2. Money can be lost or duplicated\n3. Concurrent transfers can corrupt balances\n4. Banks lose customer trust and money',

  famousIncident: {
    title: 'Knight Capital Trading Glitch',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Poor transaction isolation allowed their trading system to execute orders multiple times. In 45 minutes, they executed 4 million trades (meant to be 212), losing $440 million. The company nearly collapsed.',
    lessonLearned: 'Transaction isolation isn\'t optional for financial systems. Race conditions can cost millions.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Visa',
    scenario: 'Processing 65,000 transactions per second globally',
    howTheyDoIt: 'Uses serializable isolation with row-level locking to prevent duplicate charges and race conditions',
  },

  keyPoints: [
    'Use SERIALIZABLE isolation level for banking',
    'Lock rows with SELECT ... FOR UPDATE',
    'Prevents race conditions and overdrafts',
    'Trade-off: slightly higher latency for perfect safety',
  ],

  quickCheck: {
    question: 'What isolation level should banking systems use?',
    options: [
      'Read Uncommitted - fastest',
      'Read Committed - good enough',
      'Repeatable Read - pretty safe',
      'Serializable - prevents ALL race conditions',
    ],
    correctIndex: 3,
    explanation: 'Banking requires Serializable isolation to prevent ALL race conditions. Money is too important to risk.',
  },

  keyConcepts: [
    { title: 'Isolation', explanation: 'Concurrent transactions don\'t interfere', icon: '🔐' },
    { title: 'Race Condition', explanation: 'Bug where timing affects correctness', icon: '🏃' },
    { title: 'Row Locking', explanation: 'Prevent others from modifying locked rows', icon: '🔒' },
  ],
};

const step7: GuidedStep = {
  id: 'banking-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Enforce transaction isolation to prevent race conditions',
    taskDescription: 'Update transaction code to use SERIALIZABLE isolation with row locking',
    successCriteria: [
      'Use SERIALIZABLE isolation level',
      'Lock account rows with SELECT ... FOR UPDATE',
      'Prevent concurrent transactions from causing overdrafts',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Wrap your transfer logic in a database transaction with SERIALIZABLE isolation',
    level2: 'Use BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE, then SELECT ... FOR UPDATE to lock account rows',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer and Scale for Peak Traffic
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📈',
  scenario: "It's the end of the month - payday for millions of people!",
  hook: "Transaction volume just spiked 3x. Your single app server is at 100% CPU. Transfers are timing out. Customers can't access their money!",
  challenge: "Add a load balancer and scale out your app servers to handle peak traffic.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade banking system!',
  achievement: 'A secure, scalable, ACID-compliant transaction database',
  metrics: [
    { label: 'Transaction throughput', before: '500 TPS', after: '2,000+ TPS' },
    { label: 'ACID compliance', after: '100% ✓' },
    { label: 'Zero data loss', after: '✓' },
    { label: 'Audit trail', after: 'Complete ✓' },
    { label: 'Isolation', after: 'Serializable ✓' },
  ],
  nextTeaser: "You've mastered banking system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Banking Systems: High Availability at Peak',
  conceptExplanation: `Banking systems have **predictable traffic patterns** with end-of-month spikes.

**Traffic Patterns:**
- Regular hours: ~500-800 TPS
- End of month (payroll): ~1,500-2,000 TPS
- Black Friday/holidays: ~2,500+ TPS

**Scaling Strategy:**

**1. Horizontal Scaling (App Servers)**
- Add 2-4 app server instances behind load balancer
- Stateless servers enable easy scaling
- Auto-scale based on CPU/RPS metrics

**2. Read Scaling (Database Replicas)**
- Route balance checks to read replicas
- Transfers go to primary (write)
- 10:1 read:write ratio → replicas absorb 90% of load

**3. Load Balancing**
- Round-robin or least-connections algorithm
- Health checks remove failed servers
- Sticky sessions NOT needed (stateless)

**4. Connection Pooling**
- Database connection pools (100-200 connections per app server)
- Reuse connections for efficiency
- Prevents connection exhaustion

**Architecture:**
\`\`\`
Client → Load Balancer → App Servers (3x) → Database (Primary + 2 Replicas)
\`\`\``,

  whyItMatters: 'Banking systems must handle peak traffic without degradation. Transaction failures during payroll = customer losses and lawsuits.',

  realWorldExample: {
    company: 'Revolut',
    scenario: 'Digital bank handling 150 million transactions per month',
    howTheyDoIt: 'Auto-scales from 10 to 100+ app servers during peak hours. Read replicas handle balance checks. Primary handles transfers.',
  },

  keyPoints: [
    'Add load balancer for traffic distribution',
    'Scale app servers horizontally (2-4 instances)',
    'Use database replicas for read scaling',
    'Auto-scale based on CPU and transaction volume',
  ],

  quickCheck: {
    question: 'Why can we scale app servers horizontally but must be careful with database scaling?',
    options: [
      'App servers are cheaper',
      'App servers are stateless, database maintains state and consistency',
      'Databases are faster',
      'App servers are easier to configure',
    ],
    correctIndex: 1,
    explanation: 'Stateless app servers can be added/removed freely. Databases maintain state and need careful replication/sharding for scale.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Read Replica', explanation: 'Database copy for read-only queries', icon: '📖' },
  ],
};

const step8: GuidedStep = {
  id: 'banking-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All operations must handle 2,000+ TPS peak traffic',
    taskDescription: 'Add load balancer and scale app servers for peak capacity',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'Database replication enabled (from Step 6)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server. Ensure database replication is still enabled.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const bankingTransactionDbGuidedTutorial: GuidedTutorial = {
  problemId: 'banking-transaction-db',
  title: 'Design a Banking Transaction Database',
  description: 'Build a production-grade banking system with ACID transactions, double-entry bookkeeping, and audit trails',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🏦',
    hook: "You've been hired as Lead Engineer at FinanceCore Bank!",
    scenario: "Your mission: Build a banking transaction database that guarantees ACID properties, maintains double-entry bookkeeping, and provides complete audit trails for regulatory compliance.",
    challenge: "Can you design a system that NEVER loses money, prevents all race conditions, and handles 2,000 transactions per second?",
  },

  requirementsPhase: bankingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'ACID Transactions',
    'Atomicity',
    'Consistency',
    'Isolation',
    'Durability',
    'Double-Entry Bookkeeping',
    'Immutable Audit Trails',
    'Transaction Isolation Levels',
    'Synchronous Replication',
    'Row-Level Locking',
    'Database Transactions',
    'Regulatory Compliance',
    'Zero Data Loss',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (ACID guarantees, isolation levels)',
    'Chapter 5: Replication (Synchronous replication for zero data loss)',
    'Chapter 9: Consistency and Consensus (Strong consistency)',
    'Chapter 12: The Future of Data Systems (Audit logging)',
  ],
};

export default bankingTransactionDbGuidedTutorial;
