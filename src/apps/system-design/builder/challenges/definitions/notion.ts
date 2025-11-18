import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Notion - Collaborative Workspace
 * DDIA Ch. 9 (Consistency and Consensus) - Operational Transforms for Collaborative Editing
 *
 * DDIA Concepts Applied:
 * - Ch. 9: Operational transforms (OT) for concurrent text editing
 *   - Transform conflicting operations to preserve user intent
 *   - INSERT, DELETE operations need transformation when concurrent
 *   - Convergence: All replicas converge to same document state
 * - Ch. 9: Causal consistency for block operations
 *   - Create block → Edit block → Delete block (preserve order)
 *   - Version vectors track operation dependencies
 *   - Buffer operations until dependencies satisfied
 * - Ch. 9: Total order broadcast for document updates
 *   - All collaborators see same sequence of edits
 *   - Raft consensus for operation log replication
 *   - Prevents divergent document states
 * - Ch. 9: Linearizability for block creation and deletion
 *   - User creates block → Sees it immediately in document
 *   - Strong consistency for structural operations
 *   - Read-your-writes guarantee
 * - Ch. 9: Consensus for page hierarchy changes
 *   - Move page to new parent atomically
 *   - Prevent cyclic page relationships
 *   - Raft-based atomic hierarchy updates
 *
 * Collaborative Text Editing Problem (DDIA Ch. 9):
 * Scenario: Alice and Bob edit same paragraph "Hello" concurrently
 *
 * Initial state: "Hello"
 * Alice: INSERT " World" at position 5 → "Hello World"
 * Bob: INSERT "!" at position 5 → "Hello!"
 *
 * Without Operational Transform:
 * Server receives both operations:
 * 1. Apply Alice's op: "Hello" + INSERT(" World", 5) = "Hello World"
 * 2. Apply Bob's op: "Hello World" + INSERT("!", 5) = "Hello! World"  # Wrong! "!" inserted in middle
 * → Bob intended "Hello!" but got "Hello! World"
 *
 * With Operational Transform:
 * 1. Alice's op: INSERT(" World", 5) [sent first]
 * 2. Server applies Alice's op: "Hello World"
 * 3. Bob's op: INSERT("!", 5) [arrives after Alice's]
 * 4. Server transforms Bob's op against Alice's:
 *    - Original: INSERT("!", 5)
 *    - Alice inserted 6 chars at position 5
 *    - New position: 5 + 6 = 11
 *    - Transformed: INSERT("!", 11)
 * 5. Apply transformed op: "Hello World" + INSERT("!", 11) = "Hello World!"
 * → Correct! Both users see "Hello World!"
 *
 * Operational Transform Implementation (DDIA Ch. 9):
 * class Operation:
 *     def __init__(self, op_type, position, content):
 *         self.type = op_type  # INSERT or DELETE
 *         self.position = position
 *         self.content = content
 *
 * def transform(op1, op2):
 *     """Transform op1 against op2 (op2 was applied first)"""
 *     if op1.type == INSERT and op2.type == INSERT:
 *         if op2.position < op1.position:
 *             # op2 inserted before op1 → shift op1 position
 *             return Operation(INSERT, op1.position + len(op2.content), op1.content)
 *         elif op2.position > op1.position:
 *             # op2 inserted after op1 → no change
 *             return op1
 *         else:  # Same position
 *             # Tie-breaking: Lower user_id wins
 *             if op2.user_id < op1.user_id:
 *                 return Operation(INSERT, op1.position + len(op2.content), op1.content)
 *             else:
 *                 return op1
 *
 *     elif op1.type == DELETE and op2.type == INSERT:
 *         if op2.position <= op1.position:
 *             # op2 inserted before deletion → shift deletion position
 *             return Operation(DELETE, op1.position + len(op2.content), op1.content)
 *         else:
 *             return op1
 *
 *     elif op1.type == INSERT and op2.type == DELETE:
 *         if op2.position < op1.position:
 *             # op2 deleted before insertion → shift insertion position
 *             return Operation(INSERT, op1.position - len(op2.content), op1.content)
 *         else:
 *             return op1
 *
 *     elif op1.type == DELETE and op2.type == DELETE:
 *         if op2.position < op1.position:
 *             # op2 deleted before op1 → shift op1 position
 *             return Operation(DELETE, op1.position - len(op2.content), op1.content)
 *         else:
 *             return op1
 *
 * # Apply operation to document
 * def apply(document, operation):
 *     if operation.type == INSERT:
 *         return document[:operation.position] + operation.content + document[operation.position:]
 *     elif operation.type == DELETE:
 *         return document[:operation.position] + document[operation.position + len(operation.content):]
 *
 * # Server-side operation handling
 * operation_history = []  # All operations in total order
 *
 * def handle_client_operation(client_op, client_version):
 *     """Transform client operation against all operations since client's last version"""
 *     transformed_op = client_op
 *     for server_op in operation_history[client_version:]:
 *         transformed_op = transform(transformed_op, server_op)
 *     operation_history.append(transformed_op)
 *     broadcast_to_clients(transformed_op)
 *
 * Three-Way Concurrent Edits (DDIA Ch. 9):
 * Initial: "The quick brown fox"
 * Alice (position 4): INSERT "very " → "The very quick brown fox"
 * Bob (position 10): DELETE "brown " → "The quick fox"
 * Charlie (position 19): INSERT " jumps" → "The quick brown fox jumps"
 *
 * Server receives in order: Alice, Bob, Charlie
 *
 * 1. Apply Alice's op: "The very quick brown fox"
 * 2. Transform Bob's op against Alice's:
 *    - Original: DELETE("brown ", 10)
 *    - Alice inserted 5 chars at position 4 (before 10)
 *    - New: DELETE("brown ", 15)
 *    - Result: "The very quick fox"
 * 3. Transform Charlie's op against Alice's and Bob's:
 *    - Original: INSERT(" jumps", 19)
 *    - Alice inserted 5 chars at position 4 (before 19) → position = 19 + 5 = 24
 *    - Bob deleted 6 chars at position 15 (before 24) → position = 24 - 6 = 18
 *    - New: INSERT(" jumps", 18)
 *    - Result: "The very quick fox jumps"
 *
 * Causal Consistency for Block Operations (DDIA Ch. 9):
 * Scenario: Alice creates block, Bob edits it, Charlie deletes it
 *
 * Without Causal Consistency:
 * - Charlie's DELETE arrives first at Server 2 → Error: Block doesn't exist
 * - Bob's EDIT arrives → Error: Block doesn't exist
 * - Alice's CREATE arrives → Block created but edits lost
 *
 * With Version Vectors (Causal Consistency):
 * Alice creates block:
 * - op: {type: 'create_block', block_id: 'b1', content: 'Hello'}
 * - version_vector: {alice: 1, bob: 0, charlie: 0}
 *
 * Bob edits block (after seeing Alice's creation):
 * - op: {type: 'edit_block', block_id: 'b1', new_content: 'Hello World'}
 * - version_vector: {alice: 1, bob: 1, charlie: 0}  # Depends on alice: 1
 *
 * Charlie deletes block (after seeing Bob's edit):
 * - op: {type: 'delete_block', block_id: 'b1'}
 * - version_vector: {alice: 1, bob: 1, charlie: 1}  # Depends on bob: 1
 *
 * Server 2 receives in wrong order: Charlie, Bob, Alice
 *
 * Charlie's DELETE: VC = {alice: 1, bob: 1, charlie: 1}
 * - Check: Do I have alice: 1? → No
 * - Check: Do I have bob: 1? → No
 * - Buffer DELETE (not causally ready)
 *
 * Bob's EDIT: VC = {alice: 1, bob: 1, charlie: 0}
 * - Check: Do I have alice: 1? → No
 * - Buffer EDIT
 *
 * Alice's CREATE: VC = {alice: 1, bob: 0, charlie: 0}
 * - Check: Dependencies satisfied? → Yes (no dependencies)
 * - Apply CREATE → Block 'b1' created
 * - Server VC: {alice: 1, bob: 0, charlie: 0}
 *
 * Check buffered operations:
 * - Bob's EDIT: Requires alice: 1 ✓ → Apply EDIT
 * - Server VC: {alice: 1, bob: 1, charlie: 0}
 * - Charlie's DELETE: Requires alice: 1 ✓, bob: 1 ✓ → Apply DELETE
 * - Server VC: {alice: 1, bob: 1, charlie: 1}
 *
 * → Correct order: CREATE → EDIT → DELETE
 *
 * Linearizable Block Creation (DDIA Ch. 9):
 * Problem: User creates block, refreshes page, doesn't see block
 *
 * Without Linearizability:
 * T0: Alice creates block → Writes to Raft leader
 * T1: Leader ACKs (not yet replicated)
 * T2: Alice refreshes → Reads from follower (stale, no block)
 *
 * With Linearizable Read-Your-Writes:
 * T0: Alice creates block → Leader assigns seq=100
 * T1: Leader replicates to majority (2/3)
 * T2: Leader responds: "Block created, seq=100"
 * T3: Alice refreshes with min_seq=100
 * T4: Follower checks: "My seq is 98, need to catch up"
 * T5: Follower fetches operations up to seq=100
 * T6: Follower serves read: Block now visible
 *
 * Consensus for Page Hierarchy (DDIA Ch. 9):
 * Problem: Move page to new parent, prevent cycles
 *
 * Page hierarchy: A → B → C
 * User tries: Move A to be child of C
 * → Would create cycle: C → A → B → C (invalid!)
 *
 * With Raft Consensus:
 * 1. Client requests: MOVE(page=A, new_parent=C)
 * 2. Leader validates: Check if C is descendant of A
 *    - Traverse: C → B → A → Found! C is descendant of A
 *    - Reject: "Cannot create cycle"
 * 3. Client requests: MOVE(page=A, new_parent=D)
 * 4. Leader validates: D is not descendant of A ✓
 * 5. Leader proposes to Raft: LOG[seq] = {op: 'move', page: A, new_parent: D}
 * 6. Majority ACK → Commit
 * 7. All replicas apply: A is now child of D
 *
 * # Cycle detection
 * def is_descendant(page, ancestor):
 *     current = page
 *     visited = set()
 *     while current:
 *         if current == ancestor:
 *             return True
 *         if current in visited:
 *             return False  # Already checked
 *         visited.add(current)
 *         current = get_parent(current)
 *     return False
 *
 * def move_page(page_id, new_parent_id):
 *     if is_descendant(new_parent_id, page_id):
 *         raise ValueError("Cannot create cycle")
 *     # Atomic move via Raft consensus
 *     raft.apply_operation({
 *         'type': 'move_page',
 *         'page_id': page_id,
 *         'new_parent_id': new_parent_id
 *     })
 *
 * Total Order Broadcast for Document Updates (DDIA Ch. 9):
 * 5 users editing document concurrently:
 * - Alice: Edit paragraph 1
 * - Bob: Create new block
 * - Charlie: Delete paragraph 2
 * - David: Move block 3 to top
 * - Eve: Add comment to block 4
 *
 * Raft assigns sequence numbers:
 * seq=50: Alice's paragraph edit
 * seq=51: Bob's block creation
 * seq=52: Charlie's deletion
 * seq=53: David's block move
 * seq=54: Eve's comment
 *
 * All replicas apply in sequence order:
 * → All users see identical document state
 * → No conflicts, no divergence
 *
 * System Design Primer Concepts:
 * - Operational Transforms: Google Docs-style collaborative editing
 * - Raft Consensus: etcd for operation log replication
 * - CRDTs: Alternative to OT for conflict-free convergence
 * - WebSocket: Real-time operation push to all collaborators
 * - Version Vectors: Track causal dependencies for operations
 */
export const notionProblemDefinition: ProblemDefinition = {
  id: 'notion',
  title: 'Notion - Collaborative Workspace',
  description: `Design a collaborative workspace like Notion that:
- Users can create pages with rich content (text, images, databases)
- Multiple users can edit pages in real-time
- Pages can be organized hierarchically
- Users can share and collaborate on workspaces

Learning Objectives (DDIA Ch. 9):
1. Implement operational transforms (OT) for concurrent text editing (DDIA Ch. 9)
   - Transform INSERT/DELETE operations when concurrent
   - Preserve user intent across conflicting edits
   - Ensure all replicas converge to same document state
2. Design causal consistency for block operations (DDIA Ch. 9)
   - Create → Edit → Delete operations preserve causal order
   - Version vectors track operation dependencies
   - Buffer operations until dependencies satisfied
3. Implement total order broadcast for document updates (DDIA Ch. 9)
   - All collaborators see same sequence of edits
   - Raft consensus for operation log replication
   - Prevent divergent document states
4. Design linearizability for block creation and deletion (DDIA Ch. 9)
   - Read-your-writes guarantee for structural changes
   - Strong consistency for block operations
   - Track sequence numbers for replica freshness
5. Implement consensus for page hierarchy changes (DDIA Ch. 9)
   - Move pages atomically with cycle detection
   - Prevent invalid parent-child relationships
   - Raft-based atomic hierarchy updates`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create pages with rich content (text, images, databases)',
    'Users can share and collaborate on workspaces'
  ],

  userFacingNFRs: [
    'Operational transform: Convergence for concurrent edits (DDIA Ch. 9: Transform INSERT/DELETE)',
    'Causal consistency: Preserve block operation order (DDIA Ch. 9: Version vectors)',
    'Total order broadcast: All users see same edit sequence (DDIA Ch. 9: Raft log)',
    'Linearizability: Read-your-writes < 100ms (DDIA Ch. 9: Track sequence numbers)',
    'Consensus latency: Operations committed < 200ms (DDIA Ch. 9: Raft majority ACK)',
    'OT convergence: 100% consistency across replicas (DDIA Ch. 9: Transform against all ops)',
    'Hierarchy integrity: Prevent cycles (DDIA Ch. 9: Consensus-based validation)',
    'Concurrent edits: Preserve user intent (DDIA Ch. 9: OT position transformation)',
    'Operation ordering: Deterministic across clients (DDIA Ch. 9: Sequence numbers)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process page edits and real-time sync',
      },
      {
        type: 'storage',
        reason: 'Need to store pages, blocks, users, workspaces',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time collaborative editing',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends edit requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store page data',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server syncs edits in real-time',
      },
    ],
    dataModel: {
      entities: ['user', 'workspace', 'page', 'block', 'permission'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        workspace: ['id', 'name', 'owner_id', 'created_at'],
        page: ['id', 'workspace_id', 'parent_page_id', 'title', 'created_at'],
        block: ['id', 'page_id', 'type', 'content', 'position', 'created_at'],
        permission: ['id', 'page_id', 'user_id', 'role', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Editing pages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading pages
      ],
    },
  },

  scenarios: generateScenarios('notion', problemConfigs.notion, [
    'Users can create pages with rich content (text, images, databases)',
    'Users can share and collaborate on workspaces'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
workspaces = {}
pages = {}
blocks = {}
permissions = {}

def create_page(page_id: str, workspace_id: str, title: str, parent_page_id: str = None) -> Dict:
    """
    FR-1: Users can create pages with rich content
    Naive implementation - stores page in memory
    """
    pages[page_id] = {
        'id': page_id,
        'workspace_id': workspace_id,
        'parent_page_id': parent_page_id,
        'title': title,
        'created_at': datetime.now()
    }
    return pages[page_id]

def add_text_block(block_id: str, page_id: str, content: str, position: int) -> Dict:
    """
    FR-1: Add text block to page
    Naive implementation - stores block in memory
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'text',
        'content': content,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def add_image_block(block_id: str, page_id: str, image_url: str, position: int) -> Dict:
    """
    FR-1: Add image to page
    Naive implementation - stores image block reference
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'image',
        'content': image_url,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def share_workspace(permission_id: str, workspace_id: str, user_id: str, role: str = "viewer") -> Dict:
    """
    FR-2: Users can share and collaborate on workspaces
    Naive implementation - grants user access to workspace
    """
    permissions[permission_id] = {
        'id': permission_id,
        'workspace_id': workspace_id,
        'user_id': user_id,
        'role': role,  # viewer, editor, admin
        'created_at': datetime.now()
    }
    return permissions[permission_id]

def get_page_content(page_id: str) -> Dict:
    """
    Helper: Get page with all its blocks
    Naive implementation - returns page and sorted blocks
    """
    if page_id not in pages:
        return None

    page = pages[page_id].copy()
    page_blocks = [b for b in blocks.values() if b['page_id'] == page_id]
    page_blocks.sort(key=lambda x: x['position'])
    page['blocks'] = page_blocks
    return page
`,
};

// Auto-generate code challenges from functional requirements
(notionProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(notionProblemDefinition);
