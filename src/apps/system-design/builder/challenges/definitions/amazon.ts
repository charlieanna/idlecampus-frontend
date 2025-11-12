import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Amazon - E-commerce Marketplace
 * Level 1 ONLY: Brute force connectivity test
 */
export const amazonProblemDefinition: ProblemDefinition = {
  id: 'amazon',
  title: 'Amazon - E-commerce Marketplace',
  description: `Design an e-commerce marketplace like Amazon that:
- Users can browse and search for products
- Users can add items to cart and checkout
- Users can track orders and view order history
- Sellers can list and manage products`,

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
