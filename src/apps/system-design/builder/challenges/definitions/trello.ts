import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Trello - Project Management Platform
 * DDIA Ch. 2 (Data Models) & Ch. 3 (Storage) - Document-Oriented Model
 *
 * DDIA Concepts Applied:
 * - Ch. 2: Document model for nested board/list/card hierarchy
 *   - MongoDB/document DB stores board as single denormalized document
 *   - Embedding: Lists embedded in board, cards embedded in lists
 *   - One-to-many relationships: board → lists → cards
 * - Ch. 3: Denormalization for fast board loading
 *   - Fetch entire board structure in one query (no joins)
 *   - Trade-off: Larger document size vs fewer queries
 *   - Update position atomically with single document update
 * - Ch. 3: Document versioning for real-time collaboration
 *   - Optimistic locking: version field incremented on each update
 *   - Conflict detection: reject update if version mismatch
 * - Ch. 3: Secondary indexes for board access
 *   - Index on (owner_id, created_at DESC) for "my boards"
 *   - Index on (members, updated_at DESC) for "shared boards"
 *
 * Document Model Example (MongoDB):
 * {
 *   "_id": "board_123",
 *   "name": "Sprint Planning",
 *   "owner_id": "user_456",
 *   "members": ["user_456", "user_789"],
 *   "version": 42,
 *   "lists": [
 *     {
 *       "id": "list_1",
 *       "name": "To Do",
 *       "position": 0,
 *       "cards": [
 *         {
 *           "id": "card_1",
 *           "title": "Implement feature X",
 *           "description": "...",
 *           "position": 0,
 *           "assignees": ["user_789"],
 *           "comments": [
 *             {"user_id": "user_456", "text": "LGTM", "created_at": "2024-01-01"}
 *           ],
 *           "checklists": [
 *             {"text": "Write tests", "completed": false}
 *           ]
 *         }
 *       ]
 *     }
 *   ],
 *   "created_at": "2024-01-01",
 *   "updated_at": "2024-01-15"
 * }
 *
 * Document Model Benefits (DDIA Ch. 2):
 * 1. Schema flexibility: Add fields to cards without migrations
 * 2. Locality: Entire board loaded in one query (no joins)
 * 3. Natural hierarchy: JSON/BSON matches application data structure
 * 4. Atomic updates: Move card between lists atomically
 *
 * Document Model Trade-offs (DDIA Ch. 2):
 * - ❌ Large documents: Board with 1000 cards = large document
 * - ❌ Duplication: User info duplicated in assignees/comments
 * - ✅ Fast reads: One query to load board (vs 100+ with normalized schema)
 * - ✅ Atomic updates: No transaction coordination across tables
 *
 * Real-Time Collaboration (DDIA Ch. 3):
 * - Optimistic locking: version field prevents lost updates
 * - WebSocket: Push updates to all board members
 * - Conflict resolution: Last-write-wins with version check
 *
 * Card Search Index (DDIA Ch. 3):
 * - Multi-key index on lists.cards.title for full-text search
 * - Index on lists.cards.assignees for "my tasks"
 * - Index on lists.cards.due_date for "upcoming deadlines"
 *
 * System Design Primer Concepts:
 * - Document DB: MongoDB for hierarchical board structure
 * - WebSocket: Real-time updates to collaborators
 * - Caching: Redis for active board caching
 */
export const trelloProblemDefinition: ProblemDefinition = {
  id: 'trello',
  title: 'Trello - Project Management',
  description: `Design a project management platform like Trello that:
- Users can create boards with lists and cards
- Cards can be moved between lists (drag and drop)
- Users can collaborate on boards
- Cards support comments, attachments, and checklists

Learning Objectives (DDIA Ch. 2 & 3):
1. Design document model for nested hierarchy (DDIA Ch. 2)
   - Embed lists in board, cards in lists
   - Understand one-to-many relationships in documents
2. Implement denormalization for performance (DDIA Ch. 3)
   - Load entire board in one query (no joins)
   - Trade-offs: document size vs query count
3. Handle real-time collaboration (DDIA Ch. 3)
   - Optimistic locking with version field
   - Detect and resolve conflicts
4. Create multi-key indexes for card search (DDIA Ch. 3)
   - Index on nested fields: lists.cards.title
   - Search across all cards in all boards`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create boards with lists and cards',
    'Users can collaborate on boards'
  ],

  userFacingNFRs: [
    'Board load: p99 < 200ms (DDIA Ch. 2: Denormalized document, one query)',
    'Card move: p99 < 100ms (DDIA Ch. 2: Atomic document update)',
    'Conflict detection: < 50ms (DDIA Ch. 3: Optimistic locking version check)',
    'Card search: p99 < 300ms (DDIA Ch. 3: Multi-key index on nested cards)',
    'Real-time updates: < 100ms (SDP: WebSocket push to collaborators)',
    'Board cache: > 80% hit ratio (SDP: Redis for active boards)',
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

  scenarios: generateScenarios('trello', problemConfigs.trello),

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
