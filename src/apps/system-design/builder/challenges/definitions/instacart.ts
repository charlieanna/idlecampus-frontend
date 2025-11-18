import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

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

  scenarios: generateScenarios('instacart', problemConfigs.instacart, [
    'Customers can order groceries from multiple stores',
    'Personal shoppers fulfill orders in real-time',
    'Real-time order tracking and communication'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Customers can order groceries from multiple stores',
    'Personal shoppers fulfill orders in real-time',
    'Real-time order tracking and communication'
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
customers = {}
stores = {}
products = {}
shoppers = {}
orders = {}
order_items = {}

def browse_products(store_id: str, category: str = None) -> List[Dict]:
    """
    FR-1: Customers can browse products
    Naive implementation - returns all products from a store
    """
    store_products = []
    for product in products.values():
        if product['store_id'] == store_id:
            if category is None or product.get('category') == category:
                store_products.append(product)
    return store_products

def create_order(order_id: str, customer_id: str, store_id: str,
                 items: List[Dict]) -> Dict:
    """
    FR-1: Customers can order groceries
    Naive implementation - creates order without validation
    """
    # Calculate total
    total = 0
    for item in items:
        product = products.get(item['product_id'])
        if product:
            total += product['price'] * item['quantity']
            # Store order items
            order_items[f"{order_id}_{item['product_id']}"] = {
                'order_id': order_id,
                'product_id': item['product_id'],
                'quantity': item['quantity'],
                'price': product['price']
            }

    orders[order_id] = {
        'id': order_id,
        'customer_id': customer_id,
        'store_id': store_id,
        'shopper_id': None,
        'status': 'pending',
        'total': total,
        'created_at': datetime.now()
    }
    return orders[order_id]

def assign_shopper(order_id: str) -> Optional[Dict]:
    """
    FR-2: Personal shoppers fulfill orders
    Naive implementation - assigns first available shopper
    """
    order = orders.get(order_id)
    if not order:
        return None

    # Find available shopper
    for shopper in shoppers.values():
        if shopper['status'] == 'available':
            shopper['status'] = 'shopping'
            order['shopper_id'] = shopper['id']
            order['status'] = 'shopping'
            return {
                'order_id': order_id,
                'shopper_id': shopper['id'],
                'shopper_name': shopper['name']
            }
    return None

def update_order_status(order_id: str, status: str) -> Dict:
    """
    FR-3: Real-time order tracking
    Naive implementation - updates order status
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    order['status'] = status
    order['updated_at'] = datetime.now()
    return order

def send_message(order_id: str, sender_id: str, message: str) -> Dict:
    """
    FR-3: Communication between customer and shopper
    Naive implementation - returns message confirmation
    """
    return {
        'order_id': order_id,
        'sender_id': sender_id,
        'message': message,
        'timestamp': datetime.now()
    }

def get_order_status(order_id: str) -> Dict:
    """
    FR-3: Track order
    Naive implementation - returns current order status
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    return {
        'order_id': order['id'],
        'status': order['status'],
        'shopper_id': order.get('shopper_id')
    }
`,
};

// Auto-generate code challenges from functional requirements
(instacartProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(instacartProblemDefinition);
