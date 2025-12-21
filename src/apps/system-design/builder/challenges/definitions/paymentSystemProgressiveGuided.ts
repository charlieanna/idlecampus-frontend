import { GuidedTutorial } from '../../types/guidedTutorial';

export const paymentSystemProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'payment-system-progressive',
  title: 'Design a Payment System',
  description: 'Build a payment platform from basic checkout to global multi-currency processing',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design idempotent payment processing with retry safety',
    'Integrate multiple payment providers with failover',
    'Handle refunds, disputes, and chargebacks',
    'Build ledger system for financial accuracy',
    'Implement fraud detection and global compliance'
  ],
  prerequisites: ['Database transactions', 'API design', 'Distributed systems'],
  tags: ['payments', 'fintech', 'transactions', 'compliance', 'fraud'],

  progressiveStory: {
    title: 'Payment System Evolution',
    premise: "You're building a payment system for an e-commerce platform. Starting with simple card payments, you'll evolve to handle millions of transactions across multiple currencies with bank-grade reliability.",
    phases: [
      { phase: 1, title: 'Basic Checkout', description: 'Simple payment processing' },
      { phase: 2, title: 'Reliable Processing', description: 'Handle failures and retries' },
      { phase: 3, title: 'Financial Operations', description: 'Refunds, disputes, and reconciliation' },
      { phase: 4, title: 'Global Platform', description: 'Multi-currency, fraud, and compliance' }
    ]
  },

  steps: [
    // PHASE 1: Basic Checkout (Steps 1-3)
    {
      id: 'step-1',
      title: 'Payment Intent & Checkout',
      phase: 1,
      phaseTitle: 'Basic Checkout',
      learningObjective: 'Create payment flow with customer authorization',
      thinkingFramework: {
        framework: 'Intent-Based Payments',
        approach: 'Create payment intent before collecting payment. This tracks the payment lifecycle and survives page refreshes, retries, and failures.',
        keyInsight: 'Payment intent is the source of truth. Amount, currency, and metadata are locked at creation. Customer authorizes intent, not raw amount.'
      },
      requirements: {
        functional: [
          'Create payment intent with amount and currency',
          'Generate client secret for frontend authorization',
          'Store payment metadata (order ID, customer)',
          'Handle intent expiration'
        ],
        nonFunctional: []
      },
      hints: [
        'Intent states: created → requires_payment → processing → succeeded/failed',
        'Client secret: random token for frontend, not stored server-side',
        'Expire unconfirmed intents after 24 hours'
      ],
      expectedComponents: ['Payment Intent Service', 'Intent Store', 'Checkout UI'],
      successCriteria: ['Intent created with all metadata', 'Client can authorize payment'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Payment Provider Integration',
      phase: 1,
      phaseTitle: 'Basic Checkout',
      learningObjective: 'Connect to payment processor (Stripe/PayPal)',
      thinkingFramework: {
        framework: 'Provider Abstraction',
        approach: 'Never call provider APIs directly from business logic. Abstract behind interface. This enables switching providers and testing.',
        keyInsight: 'Map your intent states to provider states. Stripe has its own lifecycle - translate both ways.'
      },
      requirements: {
        functional: [
          'Create payment with provider (card details)',
          'Handle 3D Secure / SCA authentication',
          'Map provider responses to internal states',
          'Store provider transaction ID for reference'
        ],
        nonFunctional: []
      },
      hints: [
        'Interface: charge(amount, payment_method) → result',
        'Handle 3DS redirect flow with return URL',
        'Store both your intent ID and provider charge ID'
      ],
      expectedComponents: ['Payment Provider Adapter', 'Provider Client', 'State Mapper'],
      successCriteria: ['Payments processed through provider', '3DS handled correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Webhook Processing',
      phase: 1,
      phaseTitle: 'Basic Checkout',
      learningObjective: 'Handle async payment updates from provider',
      thinkingFramework: {
        framework: 'Async Event Processing',
        approach: 'Payments are async - success/failure comes via webhook, not sync response. Design for eventual consistency.',
        keyInsight: 'Webhooks can arrive out of order, be duplicated, or be delayed. Make processing idempotent and order-independent.'
      },
      requirements: {
        functional: [
          'Receive webhooks from payment provider',
          'Verify webhook signature (security)',
          'Update payment intent based on event',
          'Trigger downstream actions (fulfill order)'
        ],
        nonFunctional: []
      },
      hints: [
        'Verify signature before processing (HMAC)',
        'Store event ID, skip duplicates',
        'Acknowledge quickly, process async if slow'
      ],
      expectedComponents: ['Webhook Handler', 'Signature Verifier', 'Event Processor'],
      successCriteria: ['Webhooks verified and processed', 'Duplicates handled'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Reliable Processing (Steps 4-6)
    {
      id: 'step-4',
      title: 'Idempotency & Retry Safety',
      phase: 2,
      phaseTitle: 'Reliable Processing',
      learningObjective: 'Ensure payments are never double-charged',
      thinkingFramework: {
        framework: 'Idempotency Keys',
        approach: 'Network failures cause retries. Client passes idempotency key. If key seen before, return cached response. Never charge twice.',
        keyInsight: 'Idempotency key scoped to client + operation. Store with TTL (24h). Return identical response for repeated calls.'
      },
      requirements: {
        functional: [
          'Accept idempotency key in API requests',
          'Check key before processing payment',
          'Return cached response for duplicate keys',
          'Expire old idempotency records'
        ],
        nonFunctional: [
          '0 duplicate charges ever'
        ]
      },
      hints: [
        'Key: hash of (client_id, key, operation)',
        'Store: key → {response, created_at}',
        'Check key before ANY state mutation'
      ],
      expectedComponents: ['Idempotency Store', 'Request Deduplicator', 'Response Cache'],
      successCriteria: ['Retries return same response', 'No duplicate charges'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Provider Failover',
      phase: 2,
      phaseTitle: 'Reliable Processing',
      learningObjective: 'Handle provider outages with backup processors',
      thinkingFramework: {
        framework: 'Multi-Provider Resilience',
        approach: 'Single provider is single point of failure. Integrate multiple providers. Route based on: cost, reliability, card type, geography.',
        keyInsight: 'Failover is tricky with payments. If Stripe times out, did charge succeed? Check before retrying with backup.'
      },
      requirements: {
        functional: [
          'Integrate 2+ payment providers',
          'Route payments based on cost/reliability',
          'Failover to backup on primary failure',
          'Verify charge status before failover retry'
        ],
        nonFunctional: [
          '99.99% payment availability'
        ]
      },
      hints: [
        'Circuit breaker per provider',
        'On timeout: check provider for charge status before retry',
        'Log routing decisions for cost analysis'
      ],
      expectedComponents: ['Payment Router', 'Circuit Breaker', 'Provider Health Monitor'],
      successCriteria: ['Provider outage handled transparently', 'No duplicate charges on failover'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Transaction State Machine',
      phase: 2,
      phaseTitle: 'Reliable Processing',
      learningObjective: 'Model payment lifecycle with state machine',
      thinkingFramework: {
        framework: 'Explicit State Transitions',
        approach: 'Payments have complex lifecycle. State machine makes transitions explicit, validates allowed transitions, and logs everything.',
        keyInsight: 'States: pending → authorized → captured → refunded. Each transition is audited. Invalid transitions are bugs.'
      },
      requirements: {
        functional: [
          'Define payment states and allowed transitions',
          'Validate transitions before applying',
          'Log all state changes with timestamp and actor',
          'Support two-phase capture (authorize then capture)'
        ],
        nonFunctional: []
      },
      hints: [
        'Enum states, transition table for validation',
        'Append-only state change log (audit trail)',
        'Separate authorize and capture for flexibility'
      ],
      expectedComponents: ['State Machine', 'Transition Validator', 'Audit Log'],
      successCriteria: ['All transitions logged', 'Invalid transitions rejected'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Financial Operations (Steps 7-9)
    {
      id: 'step-7',
      title: 'Refund Processing',
      phase: 3,
      phaseTitle: 'Financial Operations',
      learningObjective: 'Handle full and partial refunds',
      thinkingFramework: {
        framework: 'Reversible Transactions',
        approach: 'Refunds are not simple reversals. Track refund amount against original, support partial refunds, handle refund failures.',
        keyInsight: 'Refund can fail (card expired, bank declined). Queue and retry. Never silently fail a refund request.'
      },
      requirements: {
        functional: [
          'Process full or partial refunds',
          'Track refunded amount per payment',
          'Prevent refunding more than charged',
          'Handle refund failures with retry'
        ],
        nonFunctional: [
          'Refund processed within 5-7 business days'
        ]
      },
      hints: [
        'Store: payment_id → {charged, refunded}',
        'Validate: new_refund <= charged - refunded',
        'Refund to original payment method only'
      ],
      expectedComponents: ['Refund Service', 'Refund Tracker', 'Retry Queue'],
      successCriteria: ['Partial refunds tracked correctly', 'Failures retried'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Dispute & Chargeback Handling',
      phase: 3,
      phaseTitle: 'Financial Operations',
      learningObjective: 'Manage customer disputes and chargebacks',
      thinkingFramework: {
        framework: 'Dispute Lifecycle',
        approach: 'Customer disputes charge with bank → chargeback → you lose money unless you fight and win. Need evidence submission, deadline tracking.',
        keyInsight: 'Disputes have strict deadlines (7-21 days). Missing deadline = automatic loss. Track and alert aggressively.'
      },
      requirements: {
        functional: [
          'Receive dispute notifications via webhook',
          'Collect evidence (receipts, delivery proof)',
          'Submit evidence to provider within deadline',
          'Track dispute outcome (won/lost)'
        ],
        nonFunctional: [
          'No missed dispute deadlines'
        ]
      },
      hints: [
        'Dispute states: opened → evidence_needed → under_review → won/lost',
        'Alert merchant immediately on dispute',
        'Pre-build evidence packages for common disputes'
      ],
      expectedComponents: ['Dispute Manager', 'Evidence Collector', 'Deadline Tracker', 'Alert Service'],
      successCriteria: ['Disputes handled before deadline', 'Win rate tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Ledger & Reconciliation',
      phase: 3,
      phaseTitle: 'Financial Operations',
      learningObjective: 'Maintain accurate financial records',
      thinkingFramework: {
        framework: 'Double-Entry Accounting',
        approach: 'Every transaction has two sides. Money moves between accounts. Debits = credits always. This catches errors and fraud.',
        keyInsight: 'Ledger is append-only. Never update, only add offsetting entries. This creates perfect audit trail.'
      },
      requirements: {
        functional: [
          'Record all transactions in ledger (debit/credit)',
          'Support account balances (merchant, platform, fees)',
          'Daily reconciliation with provider reports',
          'Detect and alert on discrepancies'
        ],
        nonFunctional: [
          'Books balance to the penny',
          'Discrepancy detected within 24 hours'
        ]
      },
      hints: [
        'Transaction: [{account, type: debit|credit, amount}]',
        'Sum(debits) must equal Sum(credits)',
        'Provider sends settlement files - reconcile against ledger'
      ],
      expectedComponents: ['Ledger Service', 'Account Balances', 'Reconciliation Engine', 'Discrepancy Alerter'],
      successCriteria: ['All transactions in ledger', 'Daily reconciliation passes'],
      estimatedTime: '10 minutes'
    },

    // PHASE 4: Global Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Currency Support',
      phase: 4,
      phaseTitle: 'Global Platform',
      learningObjective: 'Handle payments in multiple currencies',
      thinkingFramework: {
        framework: 'Currency as First-Class',
        approach: 'Store amounts with currency code. Exchange rates fluctuate. Lock rate at transaction time. Merchant settles in preferred currency.',
        keyInsight: 'Presentment currency (customer pays) vs settlement currency (merchant receives). FX happens in between with spread.'
      },
      requirements: {
        functional: [
          'Support 100+ currencies',
          'Display prices in customer currency',
          'Lock exchange rate at payment time',
          'Settle to merchant in their currency'
        ],
        nonFunctional: [
          'Exchange rates updated every 5 minutes'
        ]
      },
      hints: [
        'Amount type: {value: bigint, currency: string}',
        'Never do math across currencies without conversion',
        'Store original and converted amounts'
      ],
      expectedComponents: ['Currency Service', 'FX Rate Provider', 'Currency Converter', 'Settlement Service'],
      successCriteria: ['Payments work in any currency', 'Merchants receive correct settlement'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Fraud Detection',
      phase: 4,
      phaseTitle: 'Global Platform',
      learningObjective: 'Detect and prevent payment fraud',
      thinkingFramework: {
        framework: 'Risk Scoring',
        approach: 'Score each payment for fraud risk. Factors: device, location, velocity, amount, card history. Block high risk, 3DS medium risk, allow low risk.',
        keyInsight: 'False positives lose sales. False negatives lose money. Tune based on business tolerance. Usually 1-2% decline rate optimal.'
      },
      requirements: {
        functional: [
          'Score payment risk (0-100)',
          'Block high-risk payments automatically',
          'Require 3DS for medium-risk',
          'Learn from confirmed fraud (feedback loop)'
        ],
        nonFunctional: [
          'Fraud loss < 0.1% of volume',
          'False positive rate < 2%'
        ]
      },
      hints: [
        'Features: velocity, device fingerprint, address match, amount pattern',
        'Rules engine for quick iteration + ML for pattern detection',
        'Manual review queue for borderline cases'
      ],
      expectedComponents: ['Risk Engine', 'Feature Calculator', 'Decision Service', 'Review Queue'],
      successCriteria: ['Fraud detected before loss', 'Good transactions approved'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Compliance & Regulations',
      phase: 4,
      phaseTitle: 'Global Platform',
      learningObjective: 'Meet PCI, PSD2, and regional requirements',
      thinkingFramework: {
        framework: 'Compliance by Design',
        approach: 'Payment regulations vary by region (PSD2 in EU, PCI globally, state laws in US). Build compliance into architecture, not as afterthought.',
        keyInsight: 'PCI DSS: never store raw card numbers. Tokenize immediately. PSD2/SCA: strong authentication for EU payments.'
      },
      requirements: {
        functional: [
          'Tokenize card data (never store PAN)',
          'Enforce SCA for EU payments (PSD2)',
          'Support regional payment methods',
          'Maintain audit logs for compliance'
        ],
        nonFunctional: [
          'PCI DSS Level 1 compliant',
          'SCA challenge rate per regulations'
        ]
      },
      hints: [
        'Use provider tokenization (Stripe, Adyen)',
        'SCA triggers: region, amount, merchant preference',
        'Log retention: 7 years for financial records'
      ],
      expectedComponents: ['Tokenization Service', 'SCA Handler', 'Compliance Logger', 'Regional Router'],
      successCriteria: ['No raw card data stored', 'SCA applied correctly', 'Audit ready'],
      estimatedTime: '8 minutes'
    }
  ]
};
