import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Shopify - E-commerce Platform
 * Comprehensive FR and NFR scenarios
 */
export const shopifyProblemDefinition: ProblemDefinition = {
  id: 'shopify',
  title: 'Shopify - E-commerce Platform',
  description: `Design an e-commerce platform like Shopify that:
- Store owners can create online stores
- Store owners can manage products and inventory
- Customers can browse and purchase products
- Platform handles payments and order fulfillment`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process storefront requests and admin actions',
      },
      {
        type: 'storage',
        reason: 'Need to store stores, products, orders',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write store data',
      },
    ],
    dataModel: {
      entities: ['store', 'product', 'order', 'customer', 'payment'],
      fields: {
        store: ['id', 'owner_id', 'name', 'domain', 'theme', 'created_at'],
        product: ['id', 'store_id', 'name', 'price', 'inventory', 'created_at'],
        order: ['id', 'store_id', 'customer_id', 'total', 'status', 'created_at'],
        customer: ['id', 'store_id', 'email', 'name', 'created_at'],
        payment: ['id', 'order_id', 'amount', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing products
        { type: 'write', frequency: 'high' },        // Creating orders
      ],
    },
  },

  scenarios: generateScenarios('shopify', problemConfigs.shopify),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
