import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';
import { stripeGuidedTutorial } from './stripeGuided';

/**
 * Stripe - Payment Processing Platform
 * DDIA Ch. 7 (Transactions) - CANONICAL EXAMPLE for Payment Processing
 * DDIA Ch. 12 (Future of Data Systems) - Audit Logs & Event Sourcing
 *
 * DDIA Concepts Applied:
 * - Ch. 7: Two-phase commit (2PC) for distributed payment transactions
 *   - Phase 1 (Prepare): Authorize card with bank, lock merchant balance
 *   - Phase 2 (Commit): Capture payment, update balances atomically
 *   - Rollback: Void authorization if any phase fails
 * - Ch. 7: Serializable isolation to prevent duplicate charges
 *   - Idempotency keys: Unique constraint on (merchant_id, idempotency_key)
 *   - Prevents concurrent duplicate API calls from succeeding
 * - Ch. 7: Exactly-once semantics for payment processing
 *   - Write skew prevention: Cannot charge if balance insufficient
 *   - Lost update prevention: Optimistic locking on account balance
 * - Ch. 7: Distributed transactions across services
 *   - Payment DB + Bank API + Merchant Account Balance + Customer Account
 *   - Saga pattern for long-running subscription workflows
 * - Ch. 2: Event sourcing (append-only log) for audit trail
 *
 * Two-Phase Commit Example (DDIA Ch. 7):
 * Phase 1 - Prepare:
 *   1. BEGIN TRANSACTION
 *   2. INSERT INTO payment_intents (id, amount, status) VALUES (...)
 *   3. SELECT balance FROM merchant_accounts WHERE id = ? FOR UPDATE  -- Pessimistic lock
 *   4. Call bank API: POST /authorize {card_token, amount}
 *   5. If all succeed: PREPARE (write to transaction log)
 *   6. If any fail: ROLLBACK
 *
 * Phase 2 - Commit:
 *   1. Call bank API: POST /capture {authorization_id}
 *   2. UPDATE merchant_accounts SET balance = balance + (amount - fee)
 *   3. UPDATE payment_intents SET status = 'succeeded'
 *   4. COMMIT
 *   5. Send webhook: payment.succeeded
 *
 * Idempotency Keys (DDIA Ch. 7):
 * CREATE UNIQUE INDEX ON payments (merchant_id, idempotency_key);
 *
 * Concurrent duplicate requests:
 * Request 1: INSERT INTO payments (id, merchant_id, idempotency_key, ...)
 * Request 2: INSERT INTO payments (id, merchant_id, idempotency_key, ...)  -- FAILS (unique violation)
 * → Request 2 returns existing payment from Request 1
 *
 * Write Skew Prevention (DDIA Ch. 7):
 * Problem: Two concurrent $100 charges on merchant with $150 balance
 * - Both read balance = $150 (seems OK)
 * - Both charge $100
 * - Final balance = -$50 (INVALID!)
 *
 * Solution: Serializable isolation or SELECT FOR UPDATE
 * BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
 * SELECT balance FROM merchant_accounts WHERE id = ? FOR UPDATE;
 * -- Only one transaction proceeds, other retries
 *
 * Subscription Saga Pattern (DDIA Ch. 7):
 * Step 1: Create subscription → Compensate: Cancel subscription
 * Step 2: Charge customer → Compensate: Refund charge
 * Step 3: Send confirmation email → (No compensate)
 *
 * DDIA Ch. 12 - Audit Logs & Event Sourcing:
 *
 * Core Principle: Immutable Event Log as Source of Truth
 * - All state changes recorded as immutable events
 * - Current state derived by replaying events
 * - Complete audit trail for compliance (PCI-DSS, SOX, GDPR)
 *
 * Event Sourcing Architecture:
 *
 * Traditional State-Based:
 * Table: payments (id, merchant_id, amount, status)
 * Problem: No history of state changes
 * - Payment created with status = "pending"
 * - UPDATE payments SET status = "succeeded"
 * - Previous state lost! Can't answer: "When did status change?"
 *
 * Event Sourcing Approach:
 * Table: payment_events (event_id, payment_id, event_type, data, timestamp)
 * Events (append-only, immutable):
 *   1. payment.created {payment_id, amount, merchant_id}
 *   2. payment.authorized {payment_id, auth_code}
 *   3. payment.captured {payment_id, captured_amount}
 *   4. payment.succeeded {payment_id, final_amount}
 *
 * Current state derived by replaying all events for payment_id
 *
 * Event Sourcing Example (DDIA Ch. 12):
 *
 * Scenario: Process $100 payment
 *
 * Event Log (append-only):
 * T0: {event: "payment.created", payment_id: "pay_123", amount: 100, status: "pending"}
 * T1: {event: "payment.authorized", payment_id: "pay_123", auth_code: "auth_456"}
 * T2: {event: "payment.captured", payment_id: "pay_123", captured_amount: 100}
 * T3: {event: "payment.succeeded", payment_id: "pay_123", final_amount: 100}
 *
 * Query: What is current status of payment pay_123?
 * Answer: Replay events → "succeeded" (from last event)
 *
 * Query: What was status at T1.5?
 * Answer: Replay events up to T1 → "authorized"
 *
 * Query: When did payment succeed?
 * Answer: Timestamp of "payment.succeeded" event → T3
 *
 * Audit Log Use Cases (DDIA Ch. 12):
 *
 * Use Case 1: Compliance Reporting (PCI-DSS)
 * Question: "Show all failed payment attempts for merchant_123 in March 2024"
 *
 * Query Event Log:
 * SELECT * FROM payment_events
 * WHERE merchant_id = 'merchant_123'
 *   AND event_type = 'payment.failed'
 *   AND timestamp BETWEEN '2024-03-01' AND '2024-03-31'
 *
 * Result: Complete audit trail with exact timestamps, failure reasons
 *
 * Use Case 2: Fraud Investigation
 * Question: "Trace all events for payment pay_789"
 *
 * Event Timeline:
 * 10:00:00 - payment.created (amount: $500, card: *1234)
 * 10:00:01 - payment.authorized (fraud_score: 0.85, flagged: true)
 * 10:00:02 - payment.fraud_review_requested
 * 10:05:00 - payment.fraud_review_approved (reviewer: alice)
 * 10:05:01 - payment.captured
 * 10:05:02 - payment.succeeded
 *
 * Insight: Payment was flagged for fraud but manually approved
 *
 * Use Case 3: Dispute Resolution
 * Customer: "I was charged twice!"
 * Merchant: "I only see one payment"
 *
 * Audit Trail:
 * T0: payment.created (pay_111, $50, idempotency_key: "abc123")
 * T1: payment.succeeded (pay_111)
 * T2: payment.created (DUPLICATE, same idempotency_key "abc123")
 * T3: payment.duplicate_rejected (original_payment: pay_111)
 *
 * Result: Second payment was correctly rejected (idempotency worked)
 *
 * Snapshot + Event Log Pattern (DDIA Ch. 12):
 *
 * Problem: Replaying 1 million events for a single payment is slow
 *
 * Solution: Periodic Snapshots
 * - Snapshot Table: payment_snapshots (payment_id, state, snapshot_version)
 * - Event Log: payment_events (event_id, payment_id, event_type, data)
 *
 * Strategy:
 * 1. Create snapshot every 1000 events
 * 2. To get current state:
 *    - Load latest snapshot
 *    - Replay events since snapshot
 *
 * Example:
 * Snapshot at event 5000: {payment_id: pay_123, status: "succeeded", amount: 100}
 * New events since snapshot: [5001, 5002, 5003] (e.g., refund initiated)
 *
 * Current state = Snapshot + Replay(5001-5003)
 * Much faster than replaying all 5003 events!
 *
 * Event Versioning (DDIA Ch. 12):
 *
 * Problem: Event schema changes over time
 *
 * V1 Event: {event: "payment.created", amount: 100}
 * V2 Event: {event: "payment.created", amount: 100, currency: "USD"}
 *
 * Solution: Version events, handle multiple versions in replay
 * {event: "payment.created", version: 2, amount: 100, currency: "USD"}
 *
 * Event Replay Logic:
 * def apply_payment_created_event(state, event):
 *     if event.version == 1:
 *         state.amount = event.amount
 *         state.currency = "USD"  // Default for V1 events
 *     elif event.version == 2:
 *         state.amount = event.amount
 *         state.currency = event.currency
 *     return state
 *
 * Regulatory Compliance (DDIA Ch. 12):
 *
 * PCI-DSS Requirements:
 * - Track access to cardholder data
 * - Log all authentication attempts
 * - Retain logs for at least 1 year
 *
 * Event Log Implementation:
 * Table: security_audit_log (event_id, user_id, action, resource, timestamp)
 *
 * Events:
 * - user.login_attempt {user_id, ip_address, success: true/false}
 * - payment.viewed {user_id, payment_id, masked_card: "*1234"}
 * - payment.refunded {user_id, payment_id, amount, reason}
 *
 * Retention Policy:
 * - Hot storage (PostgreSQL): 1 year
 * - Cold storage (S3): 7 years (for legal compliance)
 * - After 7 years: Securely delete
 *
 * GDPR Right to Erasure (DDIA Ch. 12):
 *
 * Challenge: Event logs are immutable, but GDPR requires data deletion
 *
 * Solution: Crypto Shredding
 * 1. Store PII encrypted with user-specific key
 *    Event: {payment_id, encrypted_email: encrypt(email, user_key)}
 * 2. On deletion request: Delete user_key
 * 3. PII becomes unrecoverable (cryptographically erased)
 * 4. Event log remains intact for audit, but PII is gone
 *
 * Event Replay for Testing (DDIA Ch. 12):
 *
 * Use Case: Test new payment logic without affecting production
 *
 * 1. Export production event log (anonymized)
 * 2. Replay events in test environment
 * 3. Compare outputs: prod state vs test state
 * 4. Verify new logic produces same results
 *
 * Example:
 * Prod: 1M payments processed → 98.5% success rate
 * Test (with new logic): Replay same 1M events → 98.7% success rate
 * Insight: New logic improves success rate by 0.2%
 *
 * Derived Views from Event Log (DDIA Ch. 12):
 *
 * Source of Truth: payment_events (immutable event log)
 *
 * Derived View 1: payments table (current state)
 * - Materialized by replaying events
 * - Can rebuild at any time
 *
 * Derived View 2: merchant_balances table
 * - Aggregate events: SUM(payment.succeeded) - SUM(payment.refunded)
 * - Updated via stream processor (Kafka Streams)
 *
 * Derived View 3: daily_revenue_report
 * - Batch job runs nightly
 * - Groups events by date, merchant_id
 * - Outputs: total_revenue, transaction_count, avg_transaction_size
 *
 * System Design Primer Concepts:
 * - ACID Compliance: All payment operations
 * - Event Sourcing: Immutable payment event log
 * - Idempotency: Prevent duplicate charges on retry
 */
export const stripeProblemDefinition: ProblemDefinition = {
  id: 'stripe',
  title: 'Stripe - Payment Processing',
  description: `Design a payment processing platform like Stripe that:
- Merchants can accept credit card payments
- Platform processes payments securely
- Platform handles subscriptions and recurring billing
- Merchants can view transaction history and analytics

Learning Objectives (DDIA Ch. 7, 12):
1. Implement two-phase commit for distributed payments (DDIA Ch. 7)
   - Phase 1: Prepare (authorize card, lock balance)
   - Phase 2: Commit (capture payment, update balances)
   - Handle rollback on failure
2. Prevent duplicate charges with idempotency keys (DDIA Ch. 7)
   - Unique constraint on (merchant_id, idempotency_key)
   - Return existing payment on duplicate request
3. Use serializable isolation for write skew prevention (DDIA Ch. 7)
   - Prevent concurrent charges exceeding merchant balance
   - SELECT FOR UPDATE for pessimistic locking
4. Implement saga pattern for subscriptions (DDIA Ch. 7)
   - Compensating transactions for rollback
   - Eventual consistency across steps
5. Design event sourcing for complete audit trail (DDIA Ch. 12)
   - Immutable append-only payment event log
   - Derive current state by replaying events
   - Time-travel queries (state at any point in time)
6. Build compliance-ready audit logs (DDIA Ch. 12)
   - PCI-DSS, SOX, GDPR requirements
   - Retention policies (hot vs cold storage)
   - Crypto shredding for GDPR right to erasure
7. Implement snapshot + event log pattern (DDIA Ch. 12)
   - Periodic snapshots for performance
   - Event replay from snapshot forward
8. Handle event versioning (DDIA Ch. 12)
   - Schema evolution with backward compatibility
   - Multi-version event replay logic
9. Derive views from immutable event log (DDIA Ch. 12)
   - Current state tables, balances, analytics
   - Rebuild capability from source of truth`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process payment transactions',
      },
      {
        type: 'storage',
        reason: 'Need to store transactions, customers, merchants',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends payment requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to record transactions',
      },
    ],
    dataModel: {
      entities: ['merchant', 'customer', 'payment', 'subscription', 'transaction'],
      fields: {
        merchant: ['id', 'business_name', 'api_key', 'created_at'],
        customer: ['id', 'merchant_id', 'email', 'payment_method_id', 'created_at'],
        payment: ['id', 'merchant_id', 'customer_id', 'amount', 'status', 'created_at'],
        subscription: ['id', 'customer_id', 'plan_id', 'status', 'next_billing_date'],
        transaction: ['id', 'payment_id', 'amount', 'fee', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Processing payments
        { type: 'read_by_key', frequency: 'high' }, // Checking payment status
      ],
    },
  },

  scenarios: generateScenarios('stripe', problemConfigs.stripe, [
    'Merchants can accept credit card payments',
    'Platform handles subscriptions and recurring billing',
    'Merchants can view transaction history',
    'Platform processes payments securely'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Transaction Configuration (DDIA Ch. 7)',
      validate: transactionConfigValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
  ],

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Merchants can accept credit card payments',
    'Platform handles subscriptions and recurring billing',
    'Merchants can view transaction history',
    'Platform processes payments securely'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'No duplicate charges: 100% guarantee (DDIA Ch. 7: Unique index on idempotency_key)',
    'Payment atomicity: 2PC for authorize + capture (DDIA Ch. 7: Two-phase commit)',
    'Isolation level: Serializable for balance updates (DDIA Ch. 7: Prevent write skew)',
    'Write skew prevention: No overdraft (DDIA Ch. 7: SELECT FOR UPDATE)',
    'Distributed transaction: Payment + Merchant + Bank (DDIA Ch. 7: 2PC coordinator)',
    'Saga pattern: Subscription workflows with compensate (DDIA Ch. 7: Long-running)',
    'Exactly-once processing: Idempotency + deduplication (DDIA Ch. 7)',
    'Audit trail: Complete immutable event log (DDIA Ch. 12: Event sourcing)',
    'Webhook delivery: At-least-once guarantee (DDIA Ch. 7: Retry with backoff)',
    'Event append latency: < 10ms (DDIA Ch. 12: Append-only log writes)',
    'Time-travel queries: Query state at any timestamp (DDIA Ch. 12: Event replay)',
    'Snapshot creation: Every 1000 events (DDIA Ch. 12: Performance optimization)',
    'Event retention: 7 years in cold storage (DDIA Ch. 12: Compliance)',
    'Event versioning: Backward compatible schemas (DDIA Ch. 12: Schema evolution)',
    'GDPR compliance: Crypto shredding for PII (DDIA Ch. 12: Right to erasure)',
    'Audit query latency: < 500ms (DDIA Ch. 12: Indexed event log)',
  ],

  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional
import random
import string

# In-memory storage (naive implementation)
merchants = {}
customers = {}
payments = {}
subscriptions = {}
transactions = {}

def generate_payment_id() -> str:
    """Generate random payment ID"""
    return 'pay_' + ''.join(random.choices(string.ascii_letters + string.digits, k=16))

def process_payment(merchant_id: str, customer_id: str, amount: float,
                    currency: str = 'usd') -> Dict:
    """
    FR-1: Merchants can accept credit card payments
    Naive implementation - processes payment without actual card verification
    """
    payment_id = generate_payment_id()
    transaction_id = 'txn_' + ''.join(random.choices(string.ascii_letters + string.digits, k=16))

    # Create payment
    payments[payment_id] = {
        'id': payment_id,
        'merchant_id': merchant_id,
        'customer_id': customer_id,
        'amount': amount,
        'currency': currency,
        'status': 'succeeded',
        'created_at': datetime.now()
    }

    # Create transaction
    fee = amount * 0.029 + 0.30  # Stripe's standard fee
    transactions[transaction_id] = {
        'id': transaction_id,
        'payment_id': payment_id,
        'amount': amount,
        'fee': fee,
        'status': 'completed',
        'created_at': datetime.now()
    }

    return payments[payment_id]

def create_subscription(subscription_id: str, customer_id: str, plan_id: str,
                        billing_period_days: int = 30, amount: float = 9.99) -> Dict:
    """
    FR-2: Platform handles subscriptions and recurring billing
    Naive implementation - creates subscription record
    """
    subscriptions[subscription_id] = {
        'id': subscription_id,
        'customer_id': customer_id,
        'plan_id': plan_id,
        'amount': amount,
        'billing_period_days': billing_period_days,
        'status': 'active',
        'next_billing_date': datetime.now() + timedelta(days=billing_period_days),
        'created_at': datetime.now()
    }
    return subscriptions[subscription_id]

def cancel_subscription(subscription_id: str) -> Dict:
    """
    FR-2: Cancel recurring billing
    Naive implementation - updates subscription status
    """
    subscription = subscriptions.get(subscription_id)
    if not subscription:
        raise ValueError("Subscription not found")

    subscription['status'] = 'cancelled'
    subscription['cancelled_at'] = datetime.now()
    return subscription

def get_transaction_history(merchant_id: str, limit: int = 100) -> List[Dict]:
    """
    FR-3: Merchants can view transaction history
    Naive implementation - returns all transactions for merchant
    """
    merchant_transactions = []
    for transaction in transactions.values():
        payment_id = transaction['payment_id']
        payment = payments.get(payment_id)
        if payment and payment['merchant_id'] == merchant_id:
            merchant_transactions.append({
                **transaction,
                'payment': payment
            })

    # Sort by created_at (most recent first)
    merchant_transactions.sort(key=lambda x: x['created_at'], reverse=True)
    return merchant_transactions[:limit]

def check_payment_status(payment_id: str) -> str:
    """
    Helper: Check payment status
    Naive implementation - returns payment status
    """
    payment = payments.get(payment_id)
    if not payment:
        raise ValueError("Payment not found")
    return payment['status']
`,

  guidedTutorial: stripeGuidedTutorial,
};

// Auto-generate code challenges from functional requirements
(stripeProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(stripeProblemDefinition);
