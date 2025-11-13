import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Trello - Project Management Platform
 * Comprehensive FR and NFR scenarios
 */
export const trelloProblemDefinition: ProblemDefinition = {
  id: 'trello',
  title: 'Trello - Project Management',
  description: `Design a project management platform like Trello that:
- Users can create boards with lists and cards
- Cards can be moved between lists (drag and drop)
- Users can collaborate on boards
- Cards support comments, attachments, and checklists`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create boards with lists and cards',
    'Users can collaborate on boards'
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
