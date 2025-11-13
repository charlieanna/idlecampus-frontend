import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Stripe - Payment Processing Platform
 * Comprehensive FR and NFR scenarios
 */
export const stripeProblemDefinition: ProblemDefinition = {
  id: 'stripe',
  title: 'Stripe - Payment Processing',
  description: `Design a payment processing platform like Stripe that:
- Merchants can accept credit card payments
- Platform processes payments securely
- Platform handles subscriptions and recurring billing
- Merchants can view transaction history and analytics`,

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
  ],

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Merchants can accept credit card payments',
    'Platform handles subscriptions and recurring billing',
    'Merchants can view transaction history'
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
