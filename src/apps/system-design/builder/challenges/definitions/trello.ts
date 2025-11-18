import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Trello - Project Management Platform
 * DDIA Ch. 9 (Consistency and Consensus) - CRDTs for Collaborative Board Editing
 *
 * DDIA Concepts Applied:
 * - Ch. 9: Conflict-free replicated data types (CRDTs) for card positions
 *   - Multiple users moving cards concurrently without conflicts
 *   - Convergence: All replicas eventually show same card order
 *   - LWW-Element-Set CRDT for card positions
 * - Ch. 9: Linearizability for card move operations
 *   - User moves card → Sees new position immediately
 *   - Other users see move in deterministic order
 *   - Strong consistency for position updates
 * - Ch. 9: Total order broadcast for board updates
 *   - All collaborators see same sequence of card movements
 *   - Prevents inconsistent board states across users
 *   - Implemented via Raft consensus log
 * - Ch. 9: Consensus for atomic card moves across lists
 *   - Move card from List A to List B atomically
 *   - Prevents card appearing in both lists or neither
 *   - Two-phase protocol: Remove from A, Add to B (atomic)
 * - Ch. 9: Causal consistency for dependent operations
 *   - Create card → Add comment → Comment never appears before card
 *   - Version vectors track operation dependencies
 *   - Buffer operations until dependencies met
 *
 * Collaborative Card Move Problem (DDIA Ch. 9):
 * Scenario: Alice and Bob both move Card 1 concurrently
 *
 * Without CRDTs (Race Condition):
 * T0: Card 1 is in "To Do" list at position 0
 * T1: Alice moves Card 1 to "In Progress" position 0
 * T2: Bob moves Card 1 to "Done" position 0 (concurrent with Alice)
 *
 * Server receives both:
 * - Alice's update: {card_id: 1, list: "In Progress", position: 0, timestamp: T1}
 * - Bob's update: {card_id: 1, list: "Done", position: 0, timestamp: T2}
 *
 * → Last-write-wins: Bob's update overwrites Alice's
 * → Alice's "In Progress" move is lost!
 *
 * With CRDTs (LWW-Element-Set):
 * Card state = LWW-Element-Set of (list_id, position, timestamp, user_id)
 *
 * Alice's operation:
 * - Remove: ("To Do", 0, T0, system)
 * - Add: ("In Progress", 0, T1, "alice")
 *
 * Bob's operation:
 * - Remove: ("To Do", 0, T0, system)  # Same removal
 * - Add: ("Done", 0, T2, "bob")
 *
 * Merge (all replicas converge to same state):
 * - Compare timestamps: T2 > T1 → Bob's operation wins
 * - Final state: Card 1 in "Done" position 0
 * - Deterministic: All replicas show Card 1 in "Done"
 *
 * LWW-Element-Set CRDT Implementation (DDIA Ch. 9):
 * class LWWElementSet:
 *     def __init__(self):
 *         self.adds = {}  # {element: (timestamp, user_id)}
 *         self.removes = {}  # {element: (timestamp, user_id)}
 *
 *     def add(self, element, timestamp, user_id):
 *         self.adds[element] = (timestamp, user_id)
 *
 *     def remove(self, element, timestamp, user_id):
 *         self.removes[element] = (timestamp, user_id)
 *
 *     def contains(self, element):
 *         if element not in self.adds:
 *             return False
 *         add_ts, add_user = self.adds[element]
 *         if element in self.removes:
 *             rem_ts, rem_user = self.removes[element]
 *             if rem_ts > add_ts:
 *                 return False  # Removed after added
 *             elif rem_ts == add_ts and rem_user > add_user:
 *                 return False  # Tie-breaking: Higher user_id wins for removal
 *         return True
 *
 *     def merge(self, other):
 *         # Merge adds: Keep max timestamp
 *         for elem, (ts, user) in other.adds.items():
 *             if elem not in self.adds or (ts, user) > self.adds[elem]:
 *                 self.adds[elem] = (ts, user)
 *         # Merge removes: Keep max timestamp
 *         for elem, (ts, user) in other.removes.items():
 *             if elem not in self.removes or (ts, user) > self.removes[elem]:
 *                 self.removes[elem] = (ts, user)
 *
 * def move_card(card_id, old_list, new_list, position, timestamp, user_id):
 *     # CRDT operations for atomic move
 *     old_element = (card_id, old_list)
 *     new_element = (card_id, new_list, position)
 *     card_positions.remove(old_element, timestamp, user_id)
 *     card_positions.add(new_element, timestamp, user_id)
 *
 * Linearizable Card Reads (DDIA Ch. 9):
 * Problem: Alice moves card, refreshes board, doesn't see new position
 *
 * Without Linearizability:
 * T0: Alice moves Card 1 to "Done" → Writes to leader
 * T1: Leader acknowledges (but not yet replicated to followers)
 * T2: Alice refreshes → Reads from follower (stale: Card still in "In Progress")
 * → Alice confused: "Did my move work?"
 *
 * With Linearizable Read-Your-Writes:
 * T0: Alice moves Card 1 → Leader assigns operation_seq = 42
 * T1: Leader replicates to majority (2/3 servers)
 * T2: Leader responds: "Move successful, operation_seq = 42"
 * T3: Alice refreshes with min_operation_seq = 42
 * T4: Follower checks: "My latest operation_seq is 40, need to catch up"
 * T5: Follower fetches operations 41, 42, applies them
 * T6: Follower serves read: Card 1 now in "Done"
 *
 * # Linearizable read implementation
 * last_operation_seq = None
 *
 * def move_card_linearizable(card_id, new_list, position):
 *     global last_operation_seq
 *     result = raft_leader.apply_operation({
 *         'type': 'move_card',
 *         'card_id': card_id,
 *         'new_list': new_list,
 *         'position': position
 *     })
 *     last_operation_seq = result['operation_seq']
 *     return result
 *
 * def get_board_state(board_id):
 *     # Ensure follower has applied up to last write
 *     return raft_follower.read_with_min_seq(board_id, last_operation_seq)
 *
 * Total Order Broadcast for Board Updates (DDIA Ch. 9):
 * Scenario: 5 users collaborating on board, all making concurrent changes
 *
 * Operations:
 * - Alice: Move Card 1 to "Done"
 * - Bob: Add comment to Card 2
 * - Charlie: Create new card in "To Do"
 * - David: Move Card 3 to "In Progress"
 * - Eve: Rename List "Backlog" to "Sprint Backlog"
 *
 * Raft assigns sequence numbers:
 * 1. seq=100: Alice's card move
 * 2. seq=101: Bob's comment
 * 3. seq=102: Charlie's new card
 * 4. seq=103: David's card move
 * 5. seq=104: Eve's list rename
 *
 * All replicas apply operations in sequence order:
 * → All users see identical board state (convergence)
 * → No conflicts, no reordering
 *
 * # Total order broadcast via Raft
 * board_operations_log = []  # Append-only, replicated via Raft
 *
 * def broadcast_operation(board_id, operation):
 *     entry = {
 *         'seq': raft.get_next_sequence(),
 *         'board_id': board_id,
 *         'operation': operation,
 *         'timestamp': time.now()
 *     }
 *     raft.append_log(entry)  # Consensus: Replicate to majority
 *     raft.wait_for_majority_ack()
 *     return entry
 *
 * def apply_operations(board_id):
 *     board_state = load_board(board_id)
 *     for entry in sorted(board_operations_log, key=lambda e: e['seq']):
 *         if entry['board_id'] == board_id:
 *             board_state = apply(board_state, entry['operation'])
 *     return board_state
 *
 * Consensus for Atomic Card Moves (DDIA Ch. 9):
 * Problem: Move card from List A to List B atomically
 *
 * Without Consensus (Non-Atomic):
 * T0: Remove card from List A → Success
 * T1: Network failure before adding to List B
 * → Card lost! Exists in neither list
 *
 * With Raft Consensus (Atomic):
 * operation = {
 *     'type': 'atomic_move',
 *     'card_id': 'card_1',
 *     'from_list': 'list_A',
 *     'to_list': 'list_B',
 *     'position': 2
 * }
 *
 * 1. Raft leader receives operation
 * 2. Leader proposes to Raft log: LOG[seq] = operation
 * 3. Majority of servers ACK (consensus achieved)
 * 4. Leader commits operation
 * 5. All servers apply entire operation atomically:
 *    - Remove card_1 from list_A
 *    - Add card_1 to list_B at position 2
 * → Either both succeed or both fail (atomicity)
 *
 * Causal Consistency for Dependent Operations (DDIA Ch. 9):
 * Scenario: Alice creates card, then Bob adds comment
 *
 * Without Causal Consistency:
 * - Bob's comment arrives first at Server 2
 * - Server 2 sees comment for non-existent card → Error
 *
 * With Version Vectors (Causal Consistency):
 * Alice creates card:
 * - operation: {type: 'create_card', card_id: 'card_1'}
 * - version_vector: {alice: 1, bob: 0}
 *
 * Bob adds comment (after seeing Alice's card):
 * - operation: {type: 'add_comment', card_id: 'card_1', text: 'LGTM'}
 * - version_vector: {alice: 1, bob: 1}  # Depends on alice: 1
 *
 * Server 2 receives Bob's comment first:
 * - Checks dependency: "Do I have alice: 1?" → No
 * - Buffers Bob's operation
 * - Receives Alice's create_card operation
 * - Applies Alice's operation: {alice: 1, bob: 0}
 * - Now checks buffered operations: Bob's comment has alice: 1 ✓
 * - Applies Bob's comment: {alice: 1, bob: 1}
 *
 * # Version vector implementation
 * class VersionVector:
 *     def __init__(self):
 *         self.vector = {}  # {user_id: counter}
 *
 *     def increment(self, user_id):
 *         self.vector[user_id] = self.vector.get(user_id, 0) + 1
 *
 *     def is_causally_ready(self, operation_vv):
 *         # Check if we have all dependencies
 *         for user_id, count in operation_vv.vector.items():
 *             if self.vector.get(user_id, 0) < count:
 *                 return False
 *         return True
 *
 * System Design Primer Concepts:
 * - CRDTs: Riak, Redis CRDT modules for conflict-free replication
 * - Raft Consensus: etcd, Consul for operation log replication
 * - Total Order Broadcast: Kafka for ordered operation delivery
 * - WebSocket: Real-time operation push to all collaborators
 */
export const trelloProblemDefinition: ProblemDefinition = {
  id: 'trello',
  title: 'Trello - Project Management',
  description: `Design a project management platform like Trello that:
- Users can create boards with lists and cards
- Cards can be moved between lists (drag and drop)
- Users can collaborate on boards
- Cards support comments, attachments, and checklists

Learning Objectives (DDIA Ch. 9):
1. Implement CRDTs for conflict-free collaborative editing (DDIA Ch. 9)
   - LWW-Element-Set CRDT for card positions
   - Multiple users moving cards concurrently without conflicts
   - Deterministic convergence across all replicas
2. Design linearizability for card move operations (DDIA Ch. 9)
   - User sees card in new position immediately (read-your-writes)
   - Strong consistency for position updates
   - Track operation sequence numbers
3. Implement total order broadcast for board updates (DDIA Ch. 9)
   - All collaborators see same sequence of changes
   - Raft consensus for operation log replication
   - Prevents inconsistent board states
4. Design consensus for atomic card moves (DDIA Ch. 9)
   - Move card between lists atomically (remove + add)
   - Prevent card loss or duplication
   - Raft-based two-phase protocol
5. Implement causal consistency for dependent operations (DDIA Ch. 9)
   - Create card → Add comment (preserve order)
   - Version vectors track operation dependencies
   - Buffer operations until dependencies met`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create boards with lists and cards',
    'Users can collaborate on boards'
  ],

  userFacingNFRs: [
    'CRDT convergence: 100% consistency across replicas (DDIA Ch. 9: LWW-Element-Set)',
    'Linearizability: Read-your-writes < 100ms (DDIA Ch. 9: Track operation_seq)',
    'Total order: All users see same operation sequence (DDIA Ch. 9: Raft consensus log)',
    'Atomic card moves: No loss or duplication (DDIA Ch. 9: Raft two-phase protocol)',
    'Consensus latency: Operations committed < 200ms (DDIA Ch. 9: Majority ACK)',
    'Causal consistency: Preserve operation dependencies (DDIA Ch. 9: Version vectors)',
    'Concurrent edits: Conflict-free convergence (DDIA Ch. 9: CRDT merge)',
    'Operation ordering: Deterministic across all clients (DDIA Ch. 9: Sequence numbers)',
    'Freshness guarantee: Replicas catch up before read (DDIA Ch. 9: min_operation_seq)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process board updates and card movements',
      },
      {
        type: 'storage',
        reason: 'Need to store boards, lists, cards, users',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends board update requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store board data',
      },
    ],
    dataModel: {
      entities: ['user', 'board', 'list', 'card', 'comment'],
      fields: {
        user: ['id', 'email', 'name', 'avatar_url', 'created_at'],
        board: ['id', 'name', 'owner_id', 'visibility', 'created_at'],
        list: ['id', 'board_id', 'name', 'position', 'created_at'],
        card: ['id', 'list_id', 'title', 'description', 'position', 'due_date', 'created_at'],
        comment: ['id', 'card_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Moving cards, adding comments
        { type: 'read_by_key', frequency: 'very_high' }, // Loading boards
      ],
    },
  },

  scenarios: generateScenarios('trello', problemConfigs.trello, [
    'Users can create boards with lists and cards',
    'Users can collaborate on boards'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
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
boards = {}
lists = {}
cards = {}
comments = {}
board_members = {}

def create_board(board_id: str, owner_id: str, name: str, visibility: str = "private") -> Dict:
    """
    FR-1: Users can create boards
    Naive implementation - stores board in memory
    """
    boards[board_id] = {
        'id': board_id,
        'name': name,
        'owner_id': owner_id,
        'visibility': visibility,  # private, team, public
        'created_at': datetime.now()
    }
    return boards[board_id]

def create_list(list_id: str, board_id: str, name: str, position: int) -> Dict:
    """
    FR-1: Users can create lists in boards
    Naive implementation - stores list in memory
    """
    lists[list_id] = {
        'id': list_id,
        'board_id': board_id,
        'name': name,
        'position': position,
        'created_at': datetime.now()
    }
    return lists[list_id]

def create_card(card_id: str, list_id: str, title: str, description: str = "", position: int = 0) -> Dict:
    """
    FR-1: Users can create cards in lists
    Naive implementation - stores card in memory
    """
    cards[card_id] = {
        'id': card_id,
        'list_id': list_id,
        'title': title,
        'description': description,
        'position': position,
        'due_date': None,
        'created_at': datetime.now()
    }
    return cards[card_id]

def move_card(card_id: str, new_list_id: str, new_position: int) -> Dict:
    """
    Helper: Move card between lists
    Naive implementation - updates list and position
    """
    if card_id in cards:
        cards[card_id]['list_id'] = new_list_id
        cards[card_id]['position'] = new_position
        return cards[card_id]
    return None

def add_board_member(board_id: str, user_id: str, role: str = "member") -> Dict:
    """
    FR-2: Users can collaborate on boards
    Naive implementation - adds user to board members
    """
    member_key = f"{board_id}_{user_id}"
    board_members[member_key] = {
        'board_id': board_id,
        'user_id': user_id,
        'role': role,  # admin, member, observer
        'added_at': datetime.now()
    }
    return board_members[member_key]

def get_board_content(board_id: str) -> Dict:
    """
    Helper: Get board with all lists and cards
    Naive implementation - returns board structure
    """
    if board_id not in boards:
        return None

    board = boards[board_id].copy()

    # Get all lists for this board
    board_lists = [l for l in lists.values() if l['board_id'] == board_id]
    board_lists.sort(key=lambda x: x['position'])

    # Get cards for each list
    for lst in board_lists:
        list_cards = [c for c in cards.values() if c['list_id'] == lst['id']]
        list_cards.sort(key=lambda x: x['position'])
        lst['cards'] = list_cards

    board['lists'] = board_lists
    return board
`,
};

// Auto-generate code challenges from functional requirements
(trelloProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(trelloProblemDefinition);
