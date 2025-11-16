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
 * Amazon - E-commerce Marketplace
 * DDIA Ch. 2 (NoSQL Data Models) & Ch. 7 (Transactions for Inventory)
 *
 * DDIA Concepts Applied:
 * - Ch. 2: NoSQL key-value store (DynamoDB) for shopping cart (session data)
 * - Ch. 2: Document model for product catalog (flexible schema)
 * - Ch. 7: ACID transactions for inventory management (prevent overselling)
 * - Ch. 7: Lost update prevention - optimistic locking for inventory
 * - Ch. 6: Partitioning by user_id for cart, product_id for catalog
 *
 * Key Design Patterns:
 * - Shopping Cart: DynamoDB with TTL for session expiry
 * - Product Catalog: Document store (MongoDB/DynamoDB) for flexible attributes
 * - Inventory: ACID transactions to prevent overselling (compare-and-swap)
 * - Order Processing: Two-phase commit (reserve inventory + create order)
 */
export const amazonProblemDefinition: ProblemDefinition = {
  id: 'amazon',
  title: 'Amazon - E-commerce Marketplace',
  description: `Design an e-commerce marketplace like Amazon that:
- Users can browse and search for products
- Users can add items to cart and checkout
- Users can track orders and view order history
- Sellers can list and manage products

Learning Objectives (DDIA Ch. 2, 7):
1. Use NoSQL (DynamoDB) for shopping cart (DDIA Ch. 2: Key-value model)
2. Prevent inventory overselling with transactions (DDIA Ch. 7: Lost updates)
3. Implement optimistic locking for inventory (DDIA Ch. 7: Compare-and-swap)
4. Use document model for product catalog (DDIA Ch. 2: Flexible schema)
5. Ensure atomicity for order + inventory (DDIA Ch. 7)`,

  userFacingFRs: [
    'Users can browse and search for products',
    'Users can add items to cart and checkout',
    'Users can track orders and view order history',
    'Sellers can list and manage products'
  ],

  userFacingNFRs: [
    'No overselling: 100% guarantee (DDIA Ch. 7: Optimistic locking on inventory)',
    'Cart operations: < 50ms (DDIA Ch. 2: DynamoDB key-value access)',
    'Order atomicity: Inventory + order together (DDIA Ch. 7: ACID transaction)',
    'Product search: < 300ms (DDIA Ch. 3: Secondary indexes)',
    'Inventory consistency: Strong consistency (DDIA Ch. 7: Serializable)',
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

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
products = {}
orders = {}
order_items = {}
cart = {}
inventory = {}

def search_products(query: str, category: str = None) -> List[Dict]:
    """
    FR-1: Users can browse and search for products
    Naive implementation - simple substring match
    """
    results = []
    for product in products.values():
        # Check query match
        if query and query.lower() not in product.get('name', '').lower():
            continue
        # Check category match
        if category and product.get('category') != category:
            continue
        results.append(product)
    return results

def add_to_cart(user_id: str, product_id: str, quantity: int) -> Dict:
    """
    FR-2: Users can add items to cart
    Naive implementation - stores cart items in memory
    """
    cart_key = f"{user_id}_{product_id}"
    cart[cart_key] = {
        'user_id': user_id,
        'product_id': product_id,
        'quantity': quantity,
        'added_at': datetime.now()
    }
    return cart[cart_key]

def checkout(order_id: str, user_id: str, shipping_address: str) -> Dict:
    """
    FR-2: Users can checkout
    Naive implementation - creates order from cart items
    No payment processing or inventory checks
    """
    # Get user's cart items
    user_cart_items = [item for item in cart.values() if item['user_id'] == user_id]

    # Calculate total
    total_amount = 0
    for item in user_cart_items:
        product = products.get(item['product_id'])
        if product:
            total_amount += product['price'] * item['quantity']

    # Create order
    orders[order_id] = {
        'id': order_id,
        'user_id': user_id,
        'total_amount': total_amount,
        'status': 'confirmed',
        'shipping_address': shipping_address,
        'created_at': datetime.now()
    }

    # Create order items
    for item in user_cart_items:
        item_key = f"{order_id}_{item['product_id']}"
        order_items[item_key] = {
            'order_id': order_id,
            'product_id': item['product_id'],
            'quantity': item['quantity'],
            'price': products[item['product_id']]['price']
        }

    # Clear cart
    for item in user_cart_items:
        cart_key = f"{user_id}_{item['product_id']}"
        if cart_key in cart:
            del cart[cart_key]

    return orders[order_id]

def track_order(order_id: str) -> Dict:
    """
    FR-3: Users can track orders
    Naive implementation - returns order status
    """
    return orders.get(order_id)

def get_order_history(user_id: str) -> List[Dict]:
    """
    FR-3: Users can view order history
    Naive implementation - returns all user orders
    """
    user_orders = []
    for order in orders.values():
        if order['user_id'] == user_id:
            user_orders.append(order)

    # Sort by created_at (most recent first)
    user_orders.sort(key=lambda x: x['created_at'], reverse=True)
    return user_orders
`,
};
