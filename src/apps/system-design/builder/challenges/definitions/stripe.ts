import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Stripe - Payment Processing Platform
 * DDIA Ch. 7 (Transactions) - CANONICAL EXAMPLE for Payment Processing
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

Learning Objectives (DDIA Ch. 7):
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
5. Design event sourcing for audit trail (DDIA Ch. 2)
   - Immutable append-only payment event log`,

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

  scenarios: generateScenarios('stripe', problemConfigs.stripe),

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
    'Audit trail: Immutable event log (DDIA Ch. 2: Event sourcing)',
    'Webhook delivery: At-least-once guarantee (DDIA Ch. 7: Retry with backoff)',
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
};
