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

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store owners can create online stores',
    'Store owners can manage products and inventory',
    'Customers can browse and purchase products'
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
stores = {}
products = {}
orders = {}
customers = {}
payments = {}

def create_store(store_id: str, owner_id: str, name: str, domain: str) -> Dict:
    """
    FR-1: Store owners can create online stores
    Naive implementation - creates store in memory
    """
    stores[store_id] = {
        'id': store_id,
        'owner_id': owner_id,
        'name': name,
        'domain': domain,
        'theme': 'default',
        'created_at': datetime.now()
    }
    return stores[store_id]

def add_product(product_id: str, store_id: str, name: str, price: float,
                inventory: int, description: str = None) -> Dict:
    """
    FR-2: Store owners can manage products
    Naive implementation - adds product to store
    """
    products[product_id] = {
        'id': product_id,
        'store_id': store_id,
        'name': name,
        'price': price,
        'inventory': inventory,
        'description': description,
        'created_at': datetime.now()
    }
    return products[product_id]

def update_inventory(product_id: str, quantity: int) -> Dict:
    """
    FR-2: Store owners can manage inventory
    Naive implementation - updates product inventory
    """
    product = products.get(product_id)
    if not product:
        raise ValueError("Product not found")

    product['inventory'] = quantity
    product['updated_at'] = datetime.now()
    return product

def browse_products(store_id: str) -> List[Dict]:
    """
    FR-3: Customers can browse products
    Naive implementation - returns all products for a store
    """
    store_products = []
    for product in products.values():
        if product['store_id'] == store_id and product['inventory'] > 0:
            store_products.append(product)
    return store_products

def create_order(order_id: str, store_id: str, customer_id: str,
                 items: List[Dict]) -> Dict:
    """
    FR-3: Customers can purchase products
    Naive implementation - creates order without inventory check
    """
    # Calculate total
    total = 0
    for item in items:
        product = products.get(item['product_id'])
        if product:
            total += product['price'] * item['quantity']
            # Decrease inventory (naive - no atomicity)
            product['inventory'] -= item['quantity']

    orders[order_id] = {
        'id': order_id,
        'store_id': store_id,
        'customer_id': customer_id,
        'items': items,
        'total': total,
        'status': 'pending',
        'created_at': datetime.now()
    }
    return orders[order_id]

def process_payment(payment_id: str, order_id: str, amount: float) -> Dict:
    """
    Helper: Process payment for order
    Naive implementation - records payment
    """
    payments[payment_id] = {
        'id': payment_id,
        'order_id': order_id,
        'amount': amount,
        'status': 'completed',
        'created_at': datetime.now()
    }

    # Update order status
    order = orders.get(order_id)
    if order:
        order['status'] = 'paid'

    return payments[payment_id]
`,
};
