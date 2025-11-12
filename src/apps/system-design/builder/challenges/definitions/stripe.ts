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
};
