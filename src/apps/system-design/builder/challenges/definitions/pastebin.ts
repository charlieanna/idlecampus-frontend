import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Pastebin - Text Sharing Service
 * Comprehensive FR and NFR scenarios
 */
export const pastebinProblemDefinition: ProblemDefinition = {
  id: 'pastebin',
  title: 'Pastebin - Text Sharing',
  description: `Design a text sharing service like Pastebin that:
- Users can paste text and get a shareable URL
- Pastes can be public or private
- Pastes can expire after a certain time
- Users can view paste syntax highlighting`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can paste text and get a shareable URL',
    'Users can view paste syntax highlighting'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process paste creation and retrieval',
      },
      {
        type: 'storage',
        reason: 'Need to store paste content and metadata',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends paste requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store pastes',
      },
    ],
    dataModel: {
      entities: ['paste', 'user'],
      fields: {
        paste: ['id', 'user_id', 'title', 'content', 'language', 'visibility', 'expires_at', 'created_at'],
        user: ['id', 'email', 'username', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating pastes
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing pastes
      ],
    },
  },

  scenarios: generateScenarios('pastebin', problemConfigs.pastebin, [
    'Users can paste text and get a shareable URL',
    'Users can view paste syntax highlighting'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime, timedelta
from typing import Dict, Optional
import hashlib
import random
import string

# In-memory storage (naive implementation)
pastes = {}
users = {}

def generate_short_url() -> str:
    """Generate a random short URL key"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

def create_paste(user_id: str, title: str, content: str, language: str = 'text',
                 visibility: str = 'public', expires_hours: Optional[int] = None) -> Dict:
    """
    FR-1: Users can paste text and get a shareable URL
    Naive implementation - generates short URL and stores paste
    """
    paste_id = generate_short_url()
    expires_at = None
    if expires_hours:
        expires_at = datetime.now() + timedelta(hours=expires_hours)

    pastes[paste_id] = {
        'id': paste_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'language': language,
        'visibility': visibility,
        'expires_at': expires_at,
        'url': f'https://pastebin.com/{paste_id}',
        'created_at': datetime.now()
    }
    return pastes[paste_id]

def get_paste(paste_id: str) -> Optional[Dict]:
    """
    FR-2: Users can view paste with syntax highlighting
    Naive implementation - returns paste if not expired
    """
    paste = pastes.get(paste_id)
    if not paste:
        return None

    # Check if expired
    if paste['expires_at'] and paste['expires_at'] < datetime.now():
        return None

    # Return paste with syntax highlighting info
    return {
        'id': paste['id'],
        'title': paste['title'],
        'content': paste['content'],
        'language': paste['language'],
        'syntax_highlighted': True,
        'created_at': paste['created_at']
    }

def delete_expired_pastes() -> int:
    """
    Helper: Clean up expired pastes
    Naive implementation - removes expired pastes
    """
    now = datetime.now()
    expired = []
    for paste_id, paste in pastes.items():
        if paste['expires_at'] and paste['expires_at'] < now:
            expired.append(paste_id)

    for paste_id in expired:
        del pastes[paste_id]

    return len(expired)
`,
};

// Auto-generate code challenges from functional requirements
(pastebinProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(pastebinProblemDefinition);
