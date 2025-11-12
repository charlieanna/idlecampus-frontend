import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Stripe - Payment Processing Platform
 * Level 1 ONLY: Brute force connectivity test
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

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
      },
      passCriteria: {
        maxLatency: 30000,
        maxErrorRate: 0.99,
      },
    },
  ],

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
