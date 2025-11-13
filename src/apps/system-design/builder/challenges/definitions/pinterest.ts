import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Pinterest - Visual Bookmarking Platform
 * Comprehensive FR and NFR scenarios
 */
export const pinterestProblemDefinition: ProblemDefinition = {
  id: 'pinterest',
  title: 'Pinterest - Visual Bookmarking',
  description: `Design a visual discovery platform like Pinterest that:
- Users can create boards and pin images
- Users can browse and search for pins
- Users can follow boards and users
- Images are organized into categories`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create boards and pin images',
    'Users can browse and search for pins',
    'Users can follow boards and users'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (pin, search)',
      },
      {
        type: 'storage',
        reason: 'Need to store pins, boards, users',
      },
      {
        type: 'object_storage',
        reason: 'Need to store images',
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
        reason: 'App server needs to read/write pin data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve images',
      },
    ],
    dataModel: {
      entities: ['user', 'board', 'pin', 'follow'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        board: ['id', 'user_id', 'name', 'description', 'created_at'],
        pin: ['id', 'board_id', 'user_id', 'image_url', 'title', 'description', 'source_url', 'created_at'],
        follow: ['follower_id', 'following_id', 'target_type', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'medium' },        // Pinning images
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing pins
        { type: 'write_large_file', frequency: 'medium' }, // Uploading images
      ],
    },
  },

  scenarios: generateScenarios('pinterest', problemConfigs.pinterest),

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
pins = {}
follows = {}

def create_board(board_id: str, user_id: str, name: str, description: str = None) -> Dict:
    """
    FR-1: Users can create boards
    Naive implementation - stores board in memory
    """
    boards[board_id] = {
        'id': board_id,
        'user_id': user_id,
        'name': name,
        'description': description,
        'created_at': datetime.now()
    }
    return boards[board_id]

def pin_image(pin_id: str, board_id: str, user_id: str, image_url: str,
              title: str = None, description: str = None) -> Dict:
    """
    FR-1: Users can pin images
    Naive implementation - stores pin in memory
    """
    pins[pin_id] = {
        'id': pin_id,
        'board_id': board_id,
        'user_id': user_id,
        'image_url': image_url,
        'title': title,
        'description': description,
        'created_at': datetime.now()
    }
    return pins[pin_id]

def browse_pins() -> List[Dict]:
    """
    FR-2: Users can browse pins
    Naive implementation - returns all pins, no ranking
    """
    all_pins = list(pins.values())
    # Sort by created_at (most recent first)
    all_pins.sort(key=lambda x: x['created_at'], reverse=True)
    return all_pins

def search_pins(query: str) -> List[Dict]:
    """
    FR-2: Users can search for pins
    Naive implementation - simple text search in title/description
    """
    results = []
    query_lower = query.lower()
    for pin in pins.values():
        title_match = pin.get('title') and query_lower in pin['title'].lower()
        desc_match = pin.get('description') and query_lower in pin['description'].lower()
        if title_match or desc_match:
            results.append(pin)
    return results

def follow_board(follower_id: str, board_id: str) -> Dict:
    """
    FR-3: Users can follow boards
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_board_{board_id}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'target_type': 'board',
        'target_id': board_id,
        'created_at': datetime.now()
    }
    return follows[follow_id]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-3: Users can follow users
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_user_{following_id}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'target_type': 'user',
        'target_id': following_id,
        'created_at': datetime.now()
    }
    return follows[follow_id]
`,
};
