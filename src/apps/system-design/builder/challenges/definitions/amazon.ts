import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Amazon - E-commerce Marketplace
 * Comprehensive FR and NFR scenarios
 */
export const amazonProblemDefinition: ProblemDefinition = {
  id: 'amazon',
  title: 'Amazon - E-commerce Marketplace',
  description: `Design an e-commerce marketplace like Amazon that:
- Users can browse and search for products
- Users can add items to cart and checkout
- Users can track orders and view order history
- Sellers can list and manage products`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse and search for products',
    'Users can add items to cart and checkout',
    'Users can track orders and view order history'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (browse, order, payment)',
      },
      {
        type: 'storage',
        reason: 'Need to store products, orders, users, inventory',
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
        reason: 'App server needs to read/write order data',
      },
    ],
    dataModel: {
      entities: ['user', 'product', 'order', 'order_item', 'cart', 'inventory'],
      fields: {
        user: ['id', 'email', 'name', 'address', 'created_at'],
        product: ['id', 'seller_id', 'name', 'description', 'price', 'category', 'created_at'],
        order: ['id', 'user_id', 'total_amount', 'status', 'shipping_address', 'created_at'],
        order_item: ['order_id', 'product_id', 'quantity', 'price'],
        cart: ['user_id', 'product_id', 'quantity', 'added_at'],
        inventory: ['product_id', 'warehouse_id', 'quantity', 'updated_at'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Product search
        { type: 'write', frequency: 'high' },        // Creating orders
        { type: 'read_by_key', frequency: 'very_high' }, // Product details
      ],
    },
  },

  scenarios: generateScenarios('amazon', problemConfigs.amazon),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
