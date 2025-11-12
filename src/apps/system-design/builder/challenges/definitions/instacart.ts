import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Instacart - Grocery Delivery Platform
 * Comprehensive FR and NFR scenarios
 */
export const instacartProblemDefinition: ProblemDefinition = {
  id: 'instacart',
  title: 'Instacart - Grocery Delivery',
  description: `Design a grocery delivery platform like Instacart that:
- Customers can order groceries from multiple stores
- Personal shoppers fulfill orders in real-time
- Platform handles inventory and substitutions
- Real-time order tracking and communication`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process orders and shopper matching',
      },
      {
        type: 'storage',
        reason: 'Need to store orders, products, shoppers, stores',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends orders',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store order data',
      },
    ],
    dataModel: {
      entities: ['customer', 'store', 'shopper', 'order', 'product'],
      fields: {
        customer: ['id', 'name', 'email', 'address', 'created_at'],
        store: ['id', 'name', 'address', 'lat', 'lng', 'created_at'],
        shopper: ['id', 'name', 'phone', 'status', 'rating', 'created_at'],
        order: ['id', 'customer_id', 'store_id', 'shopper_id', 'status', 'total', 'created_at'],
        product: ['id', 'store_id', 'name', 'price', 'in_stock', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating orders
        { type: 'read_by_query', frequency: 'very_high' }, // Product search
        { type: 'geospatial_query', frequency: 'high' }, // Finding nearby stores
      ],
    },
  },

  scenarios: generateScenarios('instacart', problemConfigs.instacart),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
