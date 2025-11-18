import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Shopify - E-commerce Platform
 * DDIA Ch. 7 (Transactions) - Multi-Tenant Inventory Management
 *
 * DDIA Concepts Applied:
 * - Ch. 7: Compare-and-set (CAS) for atomic inventory deduction
 *   - UPDATE products SET inventory = inventory - qty WHERE id = ? AND inventory >= qty
 *   - Only succeeds if sufficient inventory available
 *   - Prevents overselling without explicit locks
 * - Ch. 7: Multi-tenant transaction isolation
 *   - Store A's transactions isolated from Store B
 *   - Partition by store_id for scalability
 *   - Row-level locks scoped to store_id
 * - Ch. 7: Lost update prevention for concurrent inventory changes
 *   - Two orders for same product must serialize
 *   - Optimistic locking with version numbers
 * - Ch. 7: Coordinated transaction: Order + Payment + Inventory
 *   - All three must succeed or all fail (atomicity)
 *   - Two-phase commit if payment service is separate
 * - Ch. 7: Read Committed vs Serializable isolation
 *   - Browsing products: Read Committed (fast, eventual consistency OK)
 *   - Checkout: Serializable (prevent inventory race conditions)
 *
 * Lost Update Problem (DDIA Ch. 7):
 * Scenario: Product has 5 items in stock, two orders for 3 items each
 *
 * Without Atomic Decrement:
 * T1: SELECT inventory FROM products WHERE id = 'prod_123'  -- Returns 5
 * T2: SELECT inventory FROM products WHERE id = 'prod_123'  -- Returns 5
 * T1: UPDATE products SET inventory = 5 - 3 WHERE id = 'prod_123'  -- inventory = 2
 * T2: UPDATE products SET inventory = 5 - 3 WHERE id = 'prod_123'  -- inventory = 2 (LOST UPDATE!)
 * → Final inventory = 2, but should be -1 (oversold by 1)
 *
 * Solution 1: Atomic Decrement (Compare-and-Set)
 * UPDATE products SET inventory = inventory - 3
 *   WHERE id = 'prod_123' AND inventory >= 3;
 * -- Returns 1 row updated if successful, 0 if insufficient inventory
 *
 * Solution 2: SELECT FOR UPDATE (Pessimistic Locking)
 * BEGIN TRANSACTION;
 * SELECT inventory FROM products WHERE id = 'prod_123' FOR UPDATE;
 * -- Check inventory >= quantity
 * UPDATE products SET inventory = inventory - 3;
 * COMMIT;
 *
 * Solution 3: Optimistic Locking (Version Numbers)
 * products table: [id, inventory, version]
 *
 * BEGIN TRANSACTION;
 * SELECT inventory, version FROM products WHERE id = 'prod_123';  -- version = 10
 * UPDATE products SET inventory = inventory - 3, version = version + 1
 *   WHERE id = 'prod_123' AND version = 10;
 * IF (affected_rows == 0) THEN ROLLBACK;  -- Version changed, retry
 * COMMIT;
 *
 * Coordinated Transaction (DDIA Ch. 7):
 * BEGIN TRANSACTION;
 * -- Step 1: Deduct inventory
 * UPDATE products SET inventory = inventory - qty WHERE id = ? AND inventory >= qty;
 * -- Step 2: Create order
 * INSERT INTO orders (id, store_id, customer_id, total, status) VALUES (...);
 * -- Step 3: Process payment (could be external service - 2PC)
 * CALL payment_service.charge(customer_id, total);  -- Prepare phase
 * -- If all succeed:
 * COMMIT;  -- Commit phase
 * -- If any fail:
 * ROLLBACK;  -- Abort, inventory restored
 *
 * Multi-Tenant Isolation (DDIA Ch. 7):
 * - Each store is a tenant with isolated data
 * - Transactions for store_123 don't block transactions for store_456
 * - Partition by store_id for horizontal scaling
 * - Row-level locks: WHERE store_id = ? AND product_id = ? FOR UPDATE
 *
 * Isolation Levels by Operation (DDIA Ch. 7):
 * - Browse products: Read Committed (allow concurrent updates)
 * - Add to cart: Read Committed (soft reservation, no lock)
 * - Checkout: Serializable (prevent inventory race, critical)
 * - View order history: Read Committed (eventual consistency OK)
 *
 * System Design Primer Concepts:
 * - Multi-Tenancy: Isolated data per store
 * - Compare-and-Set: Atomic inventory updates
 * - Optimistic Locking: Version field for conflict detection
 */
export const shopifyProblemDefinition: ProblemDefinition = {
  id: 'shopify',
  title: 'Shopify - E-commerce Platform',
  description: `Design an e-commerce platform like Shopify that:
- Store owners can create online stores
- Store owners can manage products and inventory
- Customers can browse and purchase products
- Platform handles payments and order fulfillment

Learning Objectives (DDIA Ch. 7):
1. Implement compare-and-set for atomic inventory deduction (DDIA Ch. 7)
   - UPDATE inventory = inventory - qty WHERE inventory >= qty
   - Prevent overselling without explicit locks
2. Design multi-tenant transaction isolation (DDIA Ch. 7)
   - Store A transactions don't block Store B
   - Partition by store_id for scalability
3. Prevent lost updates with optimistic locking (DDIA Ch. 7)
   - Version field for concurrent inventory updates
   - Retry logic on version conflict
4. Coordinate Order + Payment + Inventory transaction (DDIA Ch. 7)
   - All succeed or all fail (atomicity)
   - Two-phase commit if payment is external service
5. Use appropriate isolation levels (DDIA Ch. 7)
   - Read Committed for browsing
   - Serializable for checkout`,

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

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store owners can create online stores',
    'Store owners can manage products and inventory',
    'Customers can browse and purchase products'
  ],

  userFacingNFRs: [
    'No overselling: 100% guarantee (DDIA Ch. 7: Compare-and-set atomic decrement)',
    'Inventory atomicity: Order + Payment + Inventory (DDIA Ch. 7: ACID transaction)',
    'Lost update prevention: Optimistic locking (DDIA Ch. 7: Version field)',
    'Multi-tenant isolation: Store A ≠ Store B (DDIA Ch. 7: Row-level locks by store_id)',
    'Isolation level: Serializable for checkout (DDIA Ch. 7: Prevent race conditions)',
    'Isolation level: Read Committed for browse (DDIA Ch. 7: Fast, eventual consistency)',
    'Compare-and-set: WHERE inventory >= qty (DDIA Ch. 7: Atomic check-and-update)',
    'Concurrent orders: Handle gracefully (DDIA Ch. 7: Retry on conflict)',
    'Checkout latency: p99 < 500ms (DDIA Ch. 7: Minimize lock contention)',
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

// Auto-generate code challenges from functional requirements
(shopifyProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(shopifyProblemDefinition);
