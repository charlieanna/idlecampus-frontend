import { GuidedTutorial } from '../../types/guidedTutorial';

export const digitalWalletProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'digital-wallet-progressive',
  title: 'Design a Digital Wallet System',
  description: 'Build a digital wallet from basic balance tracking to full financial services platform',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design ledger system with double-entry bookkeeping',
    'Implement secure money transfers with atomicity',
    'Build payment integrations and card linking',
    'Handle fraud detection and regulatory compliance',
    'Scale to millions of transactions per day'
  ],
  prerequisites: ['Database transactions', 'Financial concepts', 'Security basics'],
  tags: ['fintech', 'payments', 'ledger', 'wallet', 'transactions'],

  progressiveStory: {
    title: 'Digital Wallet Evolution',
    premise: "You're building a digital wallet like Venmo or PayPal. Starting with simple balance tracking, you'll evolve to handle millions of transactions with instant transfers, card payments, and regulatory compliance.",
    phases: [
      { phase: 1, title: 'Basic Wallet', description: 'Balance and transfers' },
      { phase: 2, title: 'Payment Methods', description: 'Cards and bank accounts' },
      { phase: 3, title: 'Advanced Features', description: 'P2P, splits, and rewards' },
      { phase: 4, title: 'Financial Platform', description: 'Compliance and scale' }
    ]
  },

  steps: [
    // PHASE 1: Basic Wallet (Steps 1-3)
    {
      id: 'step-1',
      title: 'Wallet & Balance Model',
      phase: 1,
      phaseTitle: 'Basic Wallet',
      learningObjective: 'Design wallet with accurate balance tracking',
      thinkingFramework: {
        framework: 'Ledger-Based Balance',
        approach: 'Dont store balance as a field. Balance = sum of all transactions. Immutable transaction log is source of truth. Avoids race conditions.',
        keyInsight: 'Never UPDATE balance directly. Only INSERT transactions. Balance is computed or cached. Immutable log enables audit and reconciliation.'
      },
      requirements: {
        functional: [
          'Create wallet for each user',
          'Track balance accurately (no floating point)',
          'Support multiple currencies',
          'View transaction history'
        ],
        nonFunctional: [
          'Balance query < 50ms',
          'Precision: cents (2 decimal places for USD)'
        ]
      },
      hints: [
        'Wallet: {id, user_id, currency, status, created_at}',
        'Use integers for amounts (cents, not dollars)',
        'Balance = SUM(credits) - SUM(debits) for wallet'
      ],
      expectedComponents: ['Wallet', 'Transaction Log', 'Balance Calculator'],
      successCriteria: ['Wallets created', 'Balance always accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Double-Entry Ledger',
      phase: 1,
      phaseTitle: 'Basic Wallet',
      learningObjective: 'Implement proper accounting with double-entry',
      thinkingFramework: {
        framework: 'Debits and Credits',
        approach: 'Every transaction has two entries: debit one account, credit another. Total debits = total credits. Money never created or destroyed, only moved.',
        keyInsight: 'Double-entry is self-balancing. If sum of all debits != sum of all credits, you have a bug. Built-in integrity check.'
      },
      requirements: {
        functional: [
          'Record debit and credit for each transfer',
          'Ensure debits = credits always',
          'Support internal accounts (fees, reserves)',
          'Handle transfer reversals correctly'
        ],
        nonFunctional: [
          'Ledger entries immutable (no updates, only new entries)'
        ]
      },
      hints: [
        'Entry: {id, account_id, type: debit|credit, amount, transaction_id}',
        'Transfer: debit sender, credit receiver (same transaction_id)',
        'Reversal: new entries with opposite signs, reference original'
      ],
      expectedComponents: ['Ledger', 'Entry Writer', 'Balance Checker'],
      successCriteria: ['Double-entry maintained', 'Ledger always balanced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Wallet-to-Wallet Transfer',
      phase: 1,
      phaseTitle: 'Basic Wallet',
      learningObjective: 'Transfer money between wallets atomically',
      thinkingFramework: {
        framework: 'Atomic Transfers',
        approach: 'Check balance, debit sender, credit receiver in single transaction. Rollback if any step fails. Use database transaction or saga pattern.',
        keyInsight: 'Insufficient balance check and debit must be atomic. Otherwise: check passes, another transaction drains balance, debit fails. Use SELECT FOR UPDATE.'
      },
      requirements: {
        functional: [
          'Transfer between two wallets',
          'Validate sufficient balance',
          'Atomic debit and credit',
          'Handle transfer failures gracefully'
        ],
        nonFunctional: [
          'Transfer < 500ms end-to-end',
          'Zero money creation or loss'
        ]
      },
      hints: [
        'DB transaction: BEGIN, check balance, insert entries, COMMIT',
        'SELECT balance FOR UPDATE (row lock)',
        'Idempotency: unique transfer_id to prevent duplicates'
      ],
      expectedComponents: ['Transfer Service', 'Balance Validator', 'Transaction Manager'],
      successCriteria: ['Transfers atomic', 'Balance never negative'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Payment Methods (Steps 4-6)
    {
      id: 'step-4',
      title: 'Bank Account Linking',
      phase: 2,
      phaseTitle: 'Payment Methods',
      learningObjective: 'Connect external bank accounts',
      thinkingFramework: {
        framework: 'Account Aggregation',
        approach: 'Use Plaid/Yodlee for bank connection. Verify ownership via micro-deposits. Store tokenized account info only. Enable ACH transfers.',
        keyInsight: 'Never store actual bank credentials. Use aggregator tokens. Bank connection can break - handle re-authentication gracefully.'
      },
      requirements: {
        functional: [
          'Link bank account via Plaid/aggregator',
          'Verify account ownership',
          'Initiate ACH deposits and withdrawals',
          'Handle bank connection errors'
        ],
        nonFunctional: [
          'ACH settlement: 1-3 business days',
          'Micro-deposit verification: 2-3 days'
        ]
      },
      hints: [
        'LinkedAccount: {id, wallet_id, bank_name, last_four, plaid_token}',
        'Micro-deposits: two small amounts (<$1), user verifies',
        'ACH: batch processing, T+1 or T+2 settlement'
      ],
      expectedComponents: ['Bank Linker', 'Account Verifier', 'ACH Processor'],
      successCriteria: ['Banks linked', 'Deposits/withdrawals work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Card Payments',
      phase: 2,
      phaseTitle: 'Payment Methods',
      learningObjective: 'Accept card payments and store cards',
      thinkingFramework: {
        framework: 'PCI Compliance',
        approach: 'Never touch raw card numbers. Use Stripe/Braintree for tokenization. Store only token. PCI-DSS Level 1 for full card handling is expensive.',
        keyInsight: 'Payment processor handles PCI compliance. You store tokens only. Still need secure transmission (TLS), but much simpler than full PCI.'
      },
      requirements: {
        functional: [
          'Add card via tokenization (Stripe)',
          'Charge card to add funds',
          'Handle declined transactions',
          'Store multiple cards per wallet'
        ],
        nonFunctional: [
          'PCI-DSS SAQ-A compliance (tokenization)',
          'Charge latency < 3 seconds'
        ]
      },
      hints: [
        'Card: {id, wallet_id, stripe_token, last_four, brand, exp_month, exp_year}',
        'Charge: stripe.charges.create({amount, source: token})',
        'Decline: handle card_declined, insufficient_funds, expired_card'
      ],
      expectedComponents: ['Card Vault', 'Payment Processor', 'Decline Handler'],
      successCriteria: ['Cards added securely', 'Charges processed'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Instant vs Scheduled Transfers',
      phase: 2,
      phaseTitle: 'Payment Methods',
      learningObjective: 'Support different transfer speeds',
      thinkingFramework: {
        framework: 'Speed vs Cost Tradeoff',
        approach: 'Standard: ACH, free, 1-3 days. Instant: debit card push, fee, seconds. User chooses based on urgency. Fund availability reflects settlement.',
        keyInsight: 'Instant transfer means platform takes settlement risk. User has money instantly, platform waits for ACH to settle. Monitor for fraud.'
      },
      requirements: {
        functional: [
          'Offer standard (free, slow) transfers',
          'Offer instant (fee, fast) transfers',
          'Track settlement status separately',
          'Handle failed settlements'
        ],
        nonFunctional: [
          'Instant: < 30 seconds to recipient',
          'Standard: 1-3 business days'
        ]
      },
      hints: [
        'Instant: debit card push via Visa Direct / Mastercard Send',
        'Available vs settled balance: available for spending, settled for withdrawal',
        'Settlement failure: reverse or reclaim funds'
      ],
      expectedComponents: ['Transfer Router', 'Settlement Tracker', 'Fee Calculator'],
      successCriteria: ['Both transfer types work', 'Fees applied correctly'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Advanced Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'P2P Payments & Requests',
      phase: 3,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Enable social payments between users',
      thinkingFramework: {
        framework: 'Social Payments',
        approach: 'Send to email/phone, even non-users. Payment requests (venmo-style). Social feed of transactions. Privacy controls for visibility.',
        keyInsight: 'P2P drives virality. Non-user receives payment → prompted to sign up to claim. Payment request creates obligation to pay.'
      },
      requirements: {
        functional: [
          'Send money to email/phone (existing or new user)',
          'Request money from contacts',
          'Add notes/emoji to payments',
          'Social feed with privacy settings'
        ],
        nonFunctional: [
          'Unclaimed payments expire in 14 days'
        ]
      },
      hints: [
        'P2P: lookup recipient by email/phone, create user stub if not exists',
        'Request: {from, to, amount, note, status: pending|paid|declined}',
        'Privacy: public, friends, private for each transaction'
      ],
      expectedComponents: ['P2P Service', 'Request Manager', 'Social Feed'],
      successCriteria: ['P2P works to non-users', 'Requests fulfilled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Bill Splitting',
      phase: 3,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Split expenses among groups',
      thinkingFramework: {
        framework: 'Group Expense Tracking',
        approach: 'Create expense, add participants, calculate shares. Track who owes whom. Simplify debts (Alice owes Bob $10, Bob owes Alice $5 → net $5).',
        keyInsight: 'Splitting creates payment requests. Actual transfer when participant pays. Track balances between pairs for ongoing groups (roommates).'
      },
      requirements: {
        functional: [
          'Create expense with participants',
          'Split equally or custom amounts',
          'Track group balances',
          'Simplify debts within group'
        ],
        nonFunctional: []
      },
      hints: [
        'Split: {expense_id, payer, amount, participants: [{user, share}]}',
        'Balance: running total between each pair in group',
        'Settle up: calculate net balance, create single transfer'
      ],
      expectedComponents: ['Split Calculator', 'Group Ledger', 'Debt Simplifier'],
      successCriteria: ['Splits calculated correctly', 'Debts simplified'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Rewards & Cashback',
      phase: 3,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Incentivize wallet usage with rewards',
      thinkingFramework: {
        framework: 'Loyalty Economics',
        approach: 'Cashback on purchases (1-5%). Points for activity. Tiered benefits. Rewards have cost - must be funded by merchant fees or marketing budget.',
        keyInsight: 'Rewards are liability. Earned points = future payout. Track as separate ledger. Expiration reduces liability but frustrates users.'
      },
      requirements: {
        functional: [
          'Earn cashback on qualifying purchases',
          'Track points balance',
          'Redeem points for wallet credit',
          'Apply promotional bonuses'
        ],
        nonFunctional: [
          'Points expiry: 12 months of inactivity'
        ]
      },
      hints: [
        'Reward: {user_id, type, amount, earned_at, expires_at, redeemed}',
        'Cashback: % of transaction, funded by merchant fee',
        'Redemption: convert points to wallet credit at rate (100 pts = $1)'
      ],
      expectedComponents: ['Rewards Engine', 'Points Ledger', 'Redemption Handler'],
      successCriteria: ['Rewards earned and tracked', 'Redemption works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Financial Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Fraud Detection',
      phase: 4,
      phaseTitle: 'Financial Platform',
      learningObjective: 'Detect and prevent fraudulent transactions',
      thinkingFramework: {
        framework: 'Real-Time Risk Scoring',
        approach: 'Score every transaction: amount, velocity, device, behavior. High risk → block or step-up verification. ML models trained on fraud patterns.',
        keyInsight: 'Fraud vs friction balance. Too strict = legitimate users blocked. Too loose = fraud losses. Tune thresholds based on loss data.'
      },
      requirements: {
        functional: [
          'Score transaction risk in real-time',
          'Block high-risk transactions',
          'Flag suspicious patterns for review',
          'Support manual fraud review queue'
        ],
        nonFunctional: [
          'Risk scoring < 100ms',
          'False positive rate < 1%'
        ]
      },
      hints: [
        'Signals: velocity, amount deviation, new device, geo-anomaly',
        'Score: 0-100, threshold at 70 for block, 50 for review',
        'Velocity: >5 transactions in 1 hour, >$1000 in 24 hours'
      ],
      expectedComponents: ['Risk Engine', 'Fraud Rules', 'Review Queue'],
      successCriteria: ['Fraud blocked', 'Low false positives'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Regulatory Compliance',
      phase: 4,
      phaseTitle: 'Financial Platform',
      learningObjective: 'Meet financial regulatory requirements',
      thinkingFramework: {
        framework: 'KYC/AML',
        approach: 'Know Your Customer: verify identity before large transactions. Anti-Money Laundering: monitor for suspicious patterns. Report to regulators (SARs, CTRs).',
        keyInsight: 'Compliance is not optional. Without money transmitter license and compliance program, you cant operate. Partner with bank sponsor or get licensed.'
      },
      requirements: {
        functional: [
          'Collect and verify identity (KYC)',
          'Monitor for suspicious activity (AML)',
          'Enforce transaction limits by verification tier',
          'Generate regulatory reports'
        ],
        nonFunctional: [
          'KYC verification < 24 hours',
          'SAR filing within 30 days of detection'
        ]
      },
      hints: [
        'KYC tiers: unverified ($500/mo), basic ($5K/mo), enhanced (unlimited)',
        'AML patterns: structuring, rapid movement, high-risk countries',
        'Reports: SAR (suspicious), CTR (currency, >$10K)'
      ],
      expectedComponents: ['KYC Verifier', 'AML Monitor', 'Compliance Reporter'],
      successCriteria: ['KYC enforced', 'AML monitoring active'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Multi-Currency & International',
      phase: 4,
      phaseTitle: 'Financial Platform',
      learningObjective: 'Support global transactions',
      thinkingFramework: {
        framework: 'Currency Exchange',
        approach: 'Hold balances in multiple currencies. FX conversion at market rates + spread. International transfers via SWIFT or partners. Handle country-specific regulations.',
        keyInsight: 'FX is profit center. Small spread (1-3%) on conversions adds up. Real-time rates from providers, cache with short TTL.'
      },
      requirements: {
        functional: [
          'Support multiple currency wallets',
          'Convert between currencies at live rates',
          'International transfers to foreign banks',
          'Handle country-specific limits and requirements'
        ],
        nonFunctional: [
          'FX rate refresh: every 1 minute',
          'International transfer: 1-5 business days'
        ]
      },
      hints: [
        'Wallet: one per currency, not one with multiple currencies',
        'FX: mid-market rate + 2% spread',
        'International: SWIFT for banks, Wise/partner for faster'
      ],
      expectedComponents: ['Currency Exchanger', 'FX Rate Provider', 'International Transfer'],
      successCriteria: ['Multi-currency works', 'International transfers complete'],
      estimatedTime: '8 minutes'
    }
  ]
};
