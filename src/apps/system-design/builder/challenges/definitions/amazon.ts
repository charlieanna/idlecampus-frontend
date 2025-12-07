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
import { amazonGuidedTutorial } from './amazonGuided';

/**
 * Amazon - E-commerce Marketplace
 * DDIA Ch. 7 (Transactions) - Multi-Warehouse Inventory Management
 *
 * DDIA Concepts Applied:
 * - Ch. 7: Lost update prevention for inventory across multiple warehouses
 *   - Compare-and-set (CAS) for atomic inventory deduction
 *   - UPDATE inventory SET quantity = quantity - qty WHERE id = ? AND quantity >= qty
 *   - Prevents overselling when multiple orders compete for same inventory
 * - Ch. 7: Distributed transactions for order processing
 *   - Order creation + inventory deduction + payment authorization
 *   - Two-phase commit across multiple databases/services
 *   - All three must succeed or all rollback (atomicity)
 * - Ch. 7: Optimistic locking with version numbers for concurrent updates
 *   - Inventory table includes version field
 *   - Update only succeeds if version unchanged since read
 *   - Retry logic on version conflict
 * - Ch. 7: Isolation levels by operation type
 *   - Browsing products: Read Committed (fast, eventual consistency OK)
 *   - Checkout: Serializable (prevent inventory race conditions)
 *   - Order history: Read Committed (stale data acceptable)
 * - Ch. 7: Multi-warehouse inventory allocation
 *   - Check multiple warehouses for availability
 *   - Prefer closest warehouse to customer
 *   - Lock inventory atomically during checkout
 *
 * Lost Update Problem (DDIA Ch. 7):
 * Scenario: Product has 10 units in warehouse, two orders for 7 units each
 *
 * Without Atomic Decrement:
 * T1: SELECT quantity FROM inventory WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1'  -- Returns 10
 * T2: SELECT quantity FROM inventory WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1'  -- Returns 10
 * T1: UPDATE inventory SET quantity = 10 - 7 WHERE product_id = 'prod_123'  -- quantity = 3
 * T2: UPDATE inventory SET quantity = 10 - 7 WHERE product_id = 'prod_123'  -- quantity = 3 (LOST UPDATE!)
 * → Final quantity = 3, but should be -4 (oversold by 4 units)
 *
 * Solution 1: Compare-and-Set (Atomic Decrement)
 * UPDATE inventory SET quantity = quantity - 7
 *   WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1' AND quantity >= 7;
 * -- Returns 1 row updated if successful, 0 if insufficient inventory
 * -- Database guarantees atomicity: read-modify-write in single operation
 *
 * Solution 2: Pessimistic Locking (SELECT FOR UPDATE)
 * BEGIN TRANSACTION;
 * SELECT quantity FROM inventory
 *   WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1' FOR UPDATE;
 * -- Exclusive lock acquired, T2 waits
 * IF (quantity >= 7) THEN
 *   UPDATE inventory SET quantity = quantity - 7;
 *   COMMIT;
 * ELSE
 *   ROLLBACK;  -- Insufficient inventory
 * END IF;
 *
 * Solution 3: Optimistic Locking (Version Numbers)
 * inventory table: [product_id, warehouse_id, quantity, version, last_updated]
 *
 * BEGIN TRANSACTION;
 * SELECT quantity, version FROM inventory
 *   WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1';  -- version = 42
 * IF (quantity >= 7) THEN
 *   UPDATE inventory SET quantity = quantity - 7, version = version + 1
 *     WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1' AND version = 42;
 *   IF (affected_rows == 0) THEN
 *     ROLLBACK;  -- Version changed by T2, retry entire transaction
 *   ELSE
 *     COMMIT;
 *   END IF;
 * END IF;
 *
 * Distributed Transaction (DDIA Ch. 7 - Two-Phase Commit):
 * Order processing requires coordinating: Order DB + Inventory DB + Payment Service
 *
 * Phase 1 - Prepare:
 * BEGIN TRANSACTION;
 * -- Step 1a: Reserve inventory (Inventory DB)
 * UPDATE inventory SET quantity = quantity - 7, reserved = reserved + 7
 *   WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1' AND quantity >= 7;
 * IF (affected_rows == 0) THEN ROLLBACK;  -- Insufficient inventory
 *
 * -- Step 1b: Create order record (Order DB)
 * INSERT INTO orders (id, user_id, total, status) VALUES ('order_123', 'user_1', 299.99, 'pending');
 *
 * -- Step 1c: Authorize payment (Payment Service - external)
 * payment_result = payment_service.authorize(user_id='user_1', amount=299.99);
 * IF (payment_result.status != 'authorized') THEN ROLLBACK;
 *
 * -- All three prepared successfully → PREPARE
 * PREPARE TRANSACTION 'order_123_txn';
 *
 * Phase 2 - Commit:
 * -- Step 2a: Capture payment
 * payment_service.capture(authorization_id=payment_result.auth_id);
 *
 * -- Step 2b: Finalize inventory (convert reserved → sold)
 * UPDATE inventory SET reserved = reserved - 7
 *   WHERE product_id = 'prod_123' AND warehouse_id = 'wh_1';
 *
 * -- Step 2c: Update order status
 * UPDATE orders SET status = 'confirmed' WHERE id = 'order_123';
 *
 * COMMIT PREPARED 'order_123_txn';
 *
 * Multi-Warehouse Inventory Allocation (DDIA Ch. 7):
 * Query: Customer in NYC needs 10 units, check warehouses by proximity
 *
 * BEGIN TRANSACTION;
 * -- Get warehouses sorted by distance
 * SELECT warehouse_id, quantity FROM inventory
 *   WHERE product_id = 'prod_123' AND quantity > 0
 *   ORDER BY distance_from('NYC', warehouse_id) ASC
 *   FOR UPDATE;  -- Lock all warehouse inventory rows
 *
 * -- Try to allocate from closest warehouse first
 * IF (warehouse_1.quantity >= 10) THEN
 *   UPDATE inventory SET quantity = quantity - 10 WHERE warehouse_id = 'wh_1';
 * ELSE
 *   -- Split order across warehouses (7 from wh_1, 3 from wh_2)
 *   UPDATE inventory SET quantity = 0 WHERE warehouse_id = 'wh_1';
 *   UPDATE inventory SET quantity = quantity - 3 WHERE warehouse_id = 'wh_2';
 * END IF;
 * COMMIT;
 *
 * Isolation Levels by Operation (DDIA Ch. 7):
 * - Browse products: Read Committed (allow concurrent updates, fast)
 * - View cart: Read Committed (soft data, no locks)
 * - Checkout: Serializable (critical - prevent overselling)
 * - Order history: Read Committed (eventual consistency acceptable)
 *
 * System Design Primer Concepts:
 * - Compare-and-Set: Atomic inventory updates
 * - Optimistic Locking: Version field for conflict detection
 * - Two-Phase Commit: Distributed transaction coordination
 */
export const amazonProblemDefinition: ProblemDefinition = {
  id: 'amazon',
  title: 'Amazon - E-commerce Marketplace',
  description: `Design an e-commerce marketplace like Amazon with inventory management and order processing.

Critical Requirement: Prevent inventory overselling. Multiple concurrent orders must never exceed available stock.

The system must coordinate distributed transactions across orders, inventory, and payments. For multi-warehouse scenarios, intelligently allocate stock from the closest warehouse first.

Requirements:
• Users can browse and search for products
• Users can add items to cart and checkout
• Users can track orders and view order history
• Sellers can list and manage products
• Prevent inventory overselling with atomic operations
• Coordinate distributed transactions across services
• Multi-warehouse inventory allocation
• Optimistic locking with version numbers for concurrent updates
• Appropriate isolation levels (read committed for browsing, serializable for checkout)`,

  userFacingFRs: [
    'Users can browse and search for products',
    'Users can add items to cart and checkout',
    'Users can track orders and view order history',
    'Sellers can list and manage products'
  ],

  userFacingNFRs: [
    'No overselling: 100% guarantee (DDIA Ch. 7: Compare-and-set WHERE quantity >= qty)',
    'Lost update prevention: Atomic decrement (DDIA Ch. 7: Read-modify-write in single op)',
    'Optimistic locking: Version-based concurrency control (DDIA Ch. 7: Retry on conflict)',
    'Distributed transaction: Order + Inventory + Payment (DDIA Ch. 7: Two-phase commit)',
    'Isolation level: Serializable for checkout (DDIA Ch. 7: Prevent inventory race)',
    'Isolation level: Read Committed for browsing (DDIA Ch. 7: Fast, eventual consistency)',
    'Multi-warehouse allocation: Atomic lock on all warehouses (DDIA Ch. 7: SELECT FOR UPDATE)',
    'Order atomicity: All-or-nothing commit (DDIA Ch. 7: Rollback on payment failure)',
    'Checkout latency: p99 < 500ms (DDIA Ch. 7: Minimize 2PC coordinator overhead)',
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

  scenarios: generateScenarios('amazon', problemConfigs.amazon, [
    'Users can browse and search for products',
    'Users can add items to cart and checkout',
    'Users can track orders and view order history',
    'Sellers can list and manage products'
  ]),

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

  // Guided Tutorial
  guidedTutorial: amazonGuidedTutorial,
};

// Auto-generate code challenges from functional requirements
(amazonProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(amazonProblemDefinition);
