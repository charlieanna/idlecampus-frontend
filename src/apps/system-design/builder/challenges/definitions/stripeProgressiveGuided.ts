import { GuidedTutorial } from '../../types/guidedTutorial';

export const stripeProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'stripe-progressive',
  title: 'Design Stripe',
  description: 'Build a payment processing platform from basic charges to global payment infrastructure',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design idempotent payment processing',
    'Implement card tokenization and PCI compliance',
    'Build subscription and recurring billing',
    'Handle multi-currency and global payments',
    'Scale for millions of transactions'
  ],
  prerequisites: ['Financial systems', 'Security', 'Distributed transactions'],
  tags: ['payments', 'fintech', 'api', 'billing', 'subscriptions'],

  progressiveStory: {
    title: 'Stripe Evolution',
    premise: "You're building a payment platform for internet businesses. Starting with simple card charges, you'll evolve to handle subscriptions, marketplaces, and billions of dollars in global payments.",
    phases: [
      { phase: 1, title: 'Card Payments', description: 'Basic charge processing' },
      { phase: 2, title: 'Subscriptions', description: 'Recurring billing' },
      { phase: 3, title: 'Platform Features', description: 'Connect and payouts' },
      { phase: 4, title: 'Global Scale', description: 'Multi-currency and compliance' }
    ]
  },

  steps: [
    // PHASE 1: Card Payments (Steps 1-3)
    {
      id: 'step-1',
      title: 'Card Tokenization',
      phase: 1,
      phaseTitle: 'Card Payments',
      learningObjective: 'Securely collect and store card data',
      thinkingFramework: {
        framework: 'PCI Scope Reduction',
        approach: 'Never let card numbers touch merchant servers. Client-side tokenization (Stripe.js). Token references card, safe to store. Full card data in PCI vault.',
        keyInsight: 'Tokenization shifts PCI burden. Merchant handles tokens only (SAQ-A). Stripe handles cards (PCI Level 1). Massive compliance simplification.'
      },
      requirements: {
        functional: [
          'Collect card via client-side form',
          'Tokenize card number immediately',
          'Return token to merchant server',
          'Store card for reuse (customer)'
        ],
        nonFunctional: [
          'Tokenization < 500ms',
          'PCI DSS Level 1 compliant'
        ]
      },
      hints: [
        'Token: tok_xxx, single-use, references card in vault',
        'Customer: cus_xxx with attached payment methods',
        'Vault: encrypted card storage, HSM for keys'
      ],
      expectedComponents: ['Token Service', 'Card Vault', 'Customer Store'],
      successCriteria: ['Cards tokenized', 'Tokens safe to handle'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Charge Processing',
      phase: 1,
      phaseTitle: 'Card Payments',
      learningObjective: 'Process payments through card networks',
      thinkingFramework: {
        framework: 'Authorization Flow',
        approach: 'Charge = auth + capture. Send to processor → card network → issuing bank. Handle approve/decline. Idempotency key prevents duplicate charges.',
        keyInsight: 'Idempotency is critical. Network timeout → did charge succeed? With idempotency key, retry is safe. Same key = same result returned.'
      },
      requirements: {
        functional: [
          'Create charge with token/customer',
          'Process through card networks',
          'Handle auth/capture separately if needed',
          'Idempotency for safe retries'
        ],
        nonFunctional: [
          'Charge latency < 2 seconds',
          'Idempotency window: 24 hours'
        ]
      },
      hints: [
        'Charge: {amount, currency, source, idempotency_key}',
        'Flow: Stripe → Processor → Network → Issuer → back',
        'Idempotency: hash(key) → cached response, return on retry'
      ],
      expectedComponents: ['Charge Service', 'Processor Gateway', 'Idempotency Cache'],
      successCriteria: ['Charges processed', 'Retries safe'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Refunds & Disputes',
      phase: 1,
      phaseTitle: 'Card Payments',
      learningObjective: 'Handle refunds and chargebacks',
      thinkingFramework: {
        framework: 'Money Flow Reversal',
        approach: 'Refund reverses charge (full or partial). Dispute = customer contests with bank. Evidence submission for dispute defense. Fees on lost disputes.',
        keyInsight: 'Disputes are expensive ($15 fee + amount). Fraud prevention cheaper than disputes. Radar rules reduce fraud before charge.'
      },
      requirements: {
        functional: [
          'Process full and partial refunds',
          'Handle incoming disputes',
          'Evidence submission workflow',
          'Track dispute outcomes'
        ],
        nonFunctional: [
          'Refund processing < 5 days',
          'Dispute response deadline: 7 days'
        ]
      },
      hints: [
        'Refund: {charge_id, amount, reason} - reverses funds',
        'Dispute: {charge_id, reason, evidence_due_by, status}',
        'Evidence: receipt, shipping proof, customer communication'
      ],
      expectedComponents: ['Refund Service', 'Dispute Manager', 'Evidence Handler'],
      successCriteria: ['Refunds work', 'Disputes manageable'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Subscriptions (Steps 4-6)
    {
      id: 'step-4',
      title: 'Subscription Billing',
      phase: 2,
      phaseTitle: 'Subscriptions',
      learningObjective: 'Implement recurring billing',
      thinkingFramework: {
        framework: 'Billing Cycles',
        approach: 'Subscription = customer + price + billing cycle. Generate invoice at period end. Charge payment method. Handle proration on changes.',
        keyInsight: 'Subscription state machine: trialing → active → past_due → canceled. Each transition triggers actions (charge, email, webhook).'
      },
      requirements: {
        functional: [
          'Create subscription with price',
          'Generate invoices on billing cycle',
          'Charge automatically',
          'Handle subscription lifecycle'
        ],
        nonFunctional: [
          'Invoice generation at midnight UTC',
          'Charge within 1 hour of invoice'
        ]
      },
      hints: [
        'Subscription: {customer_id, price_id, status, current_period_end}',
        'Price: {amount, currency, interval: month|year}',
        'Invoice: {subscription_id, amount_due, status: draft|open|paid}'
      ],
      expectedComponents: ['Subscription Engine', 'Invoice Generator', 'Billing Scheduler'],
      successCriteria: ['Subscriptions bill correctly', 'Lifecycle managed'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Failed Payment Recovery',
      phase: 2,
      phaseTitle: 'Subscriptions',
      learningObjective: 'Recover revenue from failed payments',
      thinkingFramework: {
        framework: 'Smart Retries',
        approach: 'Payment fails → retry schedule (not immediately). Update card prompts. Dunning emails before cancellation. Machine learning for optimal retry time.',
        keyInsight: 'Retry timing matters. Card might fail at 2am, succeed at 2pm (daily limit reset). ML model predicts best retry time per card.'
      },
      requirements: {
        functional: [
          'Automatic payment retries',
          'Customer notification emails',
          'Update payment method flow',
          'Grace period before cancel'
        ],
        nonFunctional: [
          'Retry schedule: 1, 3, 5, 7 days',
          'Recovery rate target: 40%+'
        ]
      },
      hints: [
        'Retry: exponential backoff, max 4 attempts',
        'Dunning: email sequence with payment link',
        'Smart retry: ML model predicts success probability by hour'
      ],
      expectedComponents: ['Retry Scheduler', 'Dunning System', 'Recovery Optimizer'],
      successCriteria: ['Failed payments retried', 'Revenue recovered'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Usage-Based Billing',
      phase: 2,
      phaseTitle: 'Subscriptions',
      learningObjective: 'Bill based on metered usage',
      thinkingFramework: {
        framework: 'Metered Billing',
        approach: 'Track usage events throughout period. Aggregate at invoice time. Tiered pricing (first 1000 free, then $0.01/unit). Usage reported via API.',
        keyInsight: 'Usage reporting is eventually consistent. Accept late events up to grace period. Invoice shows usage at time of generation.'
      },
      requirements: {
        functional: [
          'Report usage events via API',
          'Aggregate usage per billing period',
          'Apply tiered/volume pricing',
          'Usage summary on invoice'
        ],
        nonFunctional: [
          'Usage event ingestion < 100ms',
          'Late event grace period: 1 hour'
        ]
      },
      hints: [
        'Usage record: {subscription_item_id, quantity, timestamp, action: set|increment}',
        'Aggregation: sum quantities per period per meter',
        'Tiers: [{up_to: 1000, unit_amount: 0}, {up_to: inf, unit_amount: 1}]'
      ],
      expectedComponents: ['Usage Tracker', 'Aggregation Engine', 'Tiered Pricing'],
      successCriteria: ['Usage tracked', 'Billing accurate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Platform Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Connect (Marketplaces)',
      phase: 3,
      phaseTitle: 'Platform Features',
      learningObjective: 'Enable platforms to accept payments for others',
      thinkingFramework: {
        framework: 'Money Movement',
        approach: 'Platform charges customer, splits to connected accounts. Direct charges, destination charges, or separate charges + transfers. Platform takes fee.',
        keyInsight: 'Connect solves marketplace payments. Uber charges rider, pays driver. Platform handles compliance, connected accounts receive money.'
      },
      requirements: {
        functional: [
          'Onboard connected accounts',
          'Split payments to multiple recipients',
          'Platform fee collection',
          'Different charge types (direct, destination)'
        ],
        nonFunctional: [
          'Onboarding < 5 minutes',
          'Split accuracy: exact cents'
        ]
      },
      hints: [
        'Connected account: {id, type: express|standard|custom, payouts_enabled}',
        'Destination charge: charge customer, transfer to connected account',
        'Application fee: platform keeps portion of charge'
      ],
      expectedComponents: ['Account Onboarding', 'Payment Splitter', 'Fee Calculator'],
      successCriteria: ['Connected accounts work', 'Splits accurate'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Payouts',
      phase: 3,
      phaseTitle: 'Platform Features',
      learningObjective: 'Transfer money to bank accounts',
      thinkingFramework: {
        framework: 'Settlement & Payout',
        approach: 'Balance accumulates from charges. Payout sends to bank. Schedule: daily, weekly, manual. Handle different rails (ACH, wire, instant).',
        keyInsight: 'Payout timing affects cash flow. Standard ACH: 2 days. Instant: minutes but fee. Balance = pending + available; only available can payout.'
      },
      requirements: {
        functional: [
          'Track account balance',
          'Schedule automatic payouts',
          'Manual payout requests',
          'Multiple payout speeds'
        ],
        nonFunctional: [
          'Standard payout: T+2',
          'Instant payout: < 30 minutes'
        ]
      },
      hints: [
        'Balance: {pending, available, currency}',
        'Payout: {amount, destination: bank_account, arrival_date}',
        'Schedule: daily at midnight, weekly on Monday, manual only'
      ],
      expectedComponents: ['Balance Ledger', 'Payout Scheduler', 'Bank Transfer'],
      successCriteria: ['Payouts sent', 'Balance accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Fraud Prevention (Radar)',
      phase: 3,
      phaseTitle: 'Platform Features',
      learningObjective: 'Detect and block fraudulent transactions',
      thinkingFramework: {
        framework: 'Risk Scoring',
        approach: 'Score every charge: device, behavior, velocity, card history. Block high risk, review medium. Custom rules per merchant. ML model trained on network.',
        keyInsight: 'Network effect is key. Fraudster blocked on one merchant → flagged across all. Billions of transactions train better model than any single merchant.'
      },
      requirements: {
        functional: [
          'Score transaction risk',
          'Block/allow based on rules',
          'Custom rules per merchant',
          'Manual review queue'
        ],
        nonFunctional: [
          'Risk scoring < 100ms',
          'False positive rate < 0.5%'
        ]
      },
      hints: [
        'Signals: card country, IP geo, velocity, device fingerprint',
        'Rules: if (amount > 500 && card_country != ip_country) block',
        'ML: neural network on billions of transactions'
      ],
      expectedComponents: ['Risk Engine', 'Rule Evaluator', 'Review Queue'],
      successCriteria: ['Fraud blocked', 'Legit charges pass'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Global Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Currency',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Process payments in any currency',
      thinkingFramework: {
        framework: 'Currency Handling',
        approach: 'Charge in customer currency, settle in merchant currency. FX conversion at competitive rates. Present prices in local currency for conversion.',
        keyInsight: 'Currency presentment increases conversion. Show EUR to European visitors. Charge in EUR, convert to USD for US merchant. FX is revenue opportunity.'
      },
      requirements: {
        functional: [
          'Charge in 135+ currencies',
          'Automatic FX conversion',
          'Multi-currency pricing',
          'Currency-specific formatting'
        ],
        nonFunctional: [
          'FX rate refresh: every minute',
          'Conversion spread: 1-2%'
        ]
      },
      hints: [
        'Charge: {amount: 1000, currency: eur} → converted to merchant currency',
        'Presentment: show price in visitor currency, convert on charge',
        'Zero-decimal currencies: JPY, KRW (100 = ¥100, not ¥1.00)'
      ],
      expectedComponents: ['Currency Converter', 'FX Rate Provider', 'Presentment Engine'],
      successCriteria: ['All currencies work', 'FX accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Local Payment Methods',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Support region-specific payment methods',
      thinkingFramework: {
        framework: 'Payment Method Abstraction',
        approach: 'Cards are not universal. iDEAL (Netherlands), SEPA (EU), Alipay (China). Unified API abstracts differences. Each method has unique flow.',
        keyInsight: 'Local methods increase conversion. Netherlands: 60% use iDEAL. Germany: bank transfers preferred. Must support local methods to succeed globally.'
      },
      requirements: {
        functional: [
          'Support 20+ payment methods',
          'Redirect-based flows (iDEAL, Bancontact)',
          'Bank debits (SEPA, ACH)',
          'Wallets (Apple Pay, Google Pay)'
        ],
        nonFunctional: [
          'Method availability by country',
          'Unified webhook format'
        ]
      },
      hints: [
        'PaymentMethod: {type: card|ideal|sepa_debit|alipay, ...type_specific}',
        'Redirect: create → redirect to bank → return with status',
        'Webhook: payment_intent.succeeded regardless of method'
      ],
      expectedComponents: ['Method Router', 'Redirect Handler', 'Status Normalizer'],
      successCriteria: ['Local methods work', 'Unified experience'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Compliance & Reporting',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Meet global financial regulations',
      thinkingFramework: {
        framework: 'Regulatory Compliance',
        approach: 'KYC for connected accounts. Tax reporting (1099s). SCA for European cards. Data residency requirements. Audit trails for everything.',
        keyInsight: 'Compliance is market access. No PSD2/SCA → cant process EU cards. No money transmitter license → cant operate in US. Compliance is feature.'
      },
      requirements: {
        functional: [
          'KYC/identity verification',
          'Strong Customer Authentication (SCA)',
          'Tax form generation (1099)',
          'Audit logging'
        ],
        nonFunctional: [
          'SCA compliance: 100%',
          '1099 delivery: by Jan 31'
        ]
      },
      hints: [
        'KYC: collect SSN/EIN, verify identity, ongoing monitoring',
        'SCA: 3D Secure for EU cards, exemptions for low-risk',
        '1099-K: generated for accounts > $600/year (US)'
      ],
      expectedComponents: ['Identity Verifier', 'SCA Handler', 'Tax Reporter'],
      successCriteria: ['Compliant globally', 'Tax forms generated'],
      estimatedTime: '8 minutes'
    }
  ]
};
