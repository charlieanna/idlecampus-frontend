import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Steam - Gaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const steamProblemDefinition: ProblemDefinition = {
  id: 'steam',
  title: 'Steam - Gaming Platform',
  description: `Design a gaming platform like Steam that:
- Users can browse and purchase games
- Users can download and launch games
- Platform supports user reviews and community features
- Users can add friends and view achievements`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse and purchase games',
    'Users can download and launch games',
    'Users can add friends and view achievements'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process game purchases and downloads',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, games, purchases',
      },
      {
        type: 'object_storage',
        reason: 'Need to store game files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends purchase and download requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store purchase data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to serve game downloads',
      },
    ],
    dataModel: {
      entities: ['user', 'game', 'purchase', 'review', 'achievement'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        game: ['id', 'title', 'developer', 'price', 'description', 'file_size', 'created_at'],
        purchase: ['user_id', 'game_id', 'price_paid', 'purchased_at'],
        review: ['id', 'game_id', 'user_id', 'rating', 'text', 'created_at'],
        achievement: ['id', 'game_id', 'name', 'description', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing games
        { type: 'write', frequency: 'high' },        // Purchasing games
        { type: 'write_large_file', frequency: 'high' }, // Downloading games
      ],
    },
  },

  scenarios: generateScenarios('steam', problemConfigs.steam),

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
games = {}
purchases = {}
reviews = {}
achievements = {}
friendships = {}

def browse_games(category: str = None, search_query: str = None) -> List[Dict]:
    """
    FR-1: Users can browse games
    Naive implementation - returns all games, simple filtering
    """
    results = []
    for game in games.values():
        if category and game.get('category') != category:
            continue
        if search_query and search_query.lower() not in game['title'].lower():
            continue
        results.append(game)
    return results

def purchase_game(purchase_id: str, user_id: str, game_id: str) -> Dict:
    """
    FR-1: Users can purchase games
    Naive implementation - records purchase
    """
    game = games.get(game_id)
    if not game:
        raise ValueError("Game not found")

    purchases[purchase_id] = {
        'user_id': user_id,
        'game_id': game_id,
        'price_paid': game['price'],
        'purchased_at': datetime.now()
    }
    return purchases[purchase_id]

def download_game(game_id: str, user_id: str) -> Dict:
    """
    FR-2: Users can download games
    Naive implementation - returns download info
    """
    # Check if user owns the game
    owns_game = False
    for purchase in purchases.values():
        if purchase['user_id'] == user_id and purchase['game_id'] == game_id:
            owns_game = True
            break

    if not owns_game:
        raise ValueError("User does not own this game")

    game = games.get(game_id)
    return {
        'game_id': game_id,
        'download_url': f'https://cdn.steam.com/games/{game_id}/download',
        'file_size': game['file_size']
    }

def launch_game(game_id: str, user_id: str) -> Dict:
    """
    FR-2: Users can launch games
    Naive implementation - returns launch status
    """
    return {
        'game_id': game_id,
        'status': 'launched',
        'launched_at': datetime.now()
    }

def add_friend(user_id_1: str, user_id_2: str) -> Dict:
    """
    FR-3: Users can add friends
    Naive implementation - stores friendship
    """
    friendship_id = f"{user_id_1}_{user_id_2}"
    friendships[friendship_id] = {
        'user_id_1': user_id_1,
        'user_id_2': user_id_2,
        'created_at': datetime.now()
    }
    return friendships[friendship_id]

def get_user_achievements(user_id: str, game_id: str = None) -> List[Dict]:
    """
    FR-3: Users can view achievements
    Naive implementation - returns user achievements
    """
    user_achievements = []
    # In a real implementation, track which achievements are unlocked per user
    # For simplicity, return all achievements for a game
    for achievement in achievements.values():
        if game_id is None or achievement['game_id'] == game_id:
            user_achievements.append(achievement)
    return user_achievements
`,
};
