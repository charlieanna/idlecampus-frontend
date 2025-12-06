import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Tinder - Dating & Matching
 *
 * User-facing focus:
 * - Swiping experience should feel instant
 * - Matches should appear as soon as both sides like each other
 * - Chat between matches should feel real-time
 */
export const tinderProblemDefinition: ProblemDefinition = {
  id: 'tinder',
  title: 'Tinder - Dating & Matching',
  description: `Design a mobile-first dating app like Tinder where:
- Users create profiles with photos, bio, and preferences
- Users swipe on a feed of nearby profiles (right = like, left = pass)
- When two users like each other, they become a match
- Matched users can chat with each other in real-time

Key focus:
- Make the swipe + match + chat flow feel instant from the user's perspective
- Start with a simple single-region design that just works
- Optimize for scale and real-time experience later using NFRs`,

  // User-facing functional requirements (from user experience)
  userFacingFRs: [
    'Users can create a dating profile with photos, bio, and basic preferences',
    'Users can browse a swipe feed of nearby profiles, swiping right (like) or left (pass)',
    'When two users like each other, the app creates a match',
    'Matched users can view a list of their matches and chat with them in real-time',
  ],

  // User-facing NFRs (for later optimization, not Step 0)
  userFacingNFRs: [
    'Swipe feed latency: p99 < 200ms for loading the next profile',
    'Match creation latency: p99 < 500ms after the second like',
    'Chat message delivery latency: p99 < 200ms between matched users',
    'System supports 10M daily active users with 1M concurrent users',
    'Read-heavy workload: ~90% reads (swipes, feed, chats) vs 10% writes (swipes, messages)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process profile, swipe, match, and chat requests',
      },
      {
        type: 'storage',
        reason: 'Need to store users, profiles, swipes, matches, and messages',
      },
      {
        type: 'cache',
        reason: 'Need low-latency swipe feeds and recent messages',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time chat between matched users',
      },
      {
        type: 'object_storage',
        reason: 'Need to store profile photos efficiently',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for fast global delivery of profile photos',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Mobile client sends profile, swipe, match, and chat requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server stores users, profiles, swipes, matches, and messages',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server caches swipe feeds and recent conversations',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes chat messages to online clients in real-time',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server uploads and reads profile photos',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls profile photos from object storage',
      },
    ],
    dataModel: {
      entities: ['user', 'profile', 'swipe', 'match', 'message'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        profile: [
          'id',
          'user_id',
          'age',
          'gender',
          'location',
          'bio',
          'photo_url',
          'preferences',
          'created_at',
        ],
        swipe: ['id', 'swiper_id', 'target_id', 'direction', 'created_at'],
        match: ['id', 'user1_id', 'user2_id', 'created_at', 'last_message_at'],
        message: ['id', 'match_id', 'sender_id', 'content', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Swipe feed queries
        { type: 'write', frequency: 'very_high' },         // Swipes + messages
        { type: 'read_by_key', frequency: 'high' },        // Loading matches & conversations
      ],
    },
  },

  // Use standard scenario generator for FR/NFR scenarios
  scenarios: generateScenarios('tinder', problemConfigs.tinder, [
    'Users can create a dating profile with photos, bio, and basic preferences',
    'Users can browse a swipe feed of nearby profiles, swiping right (like) or left (pass)',
    'When two users like each other, the app creates a match',
    'Matched users can view a list of their matches and chat with them in real-time',
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  // Naive Python implementation template (in-memory, brute-force)
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users: Dict[str, Dict] = {}
profiles: Dict[str, Dict] = {}
swipes: Dict[str, Dict] = {}
matches: Dict[str, Dict] = {}
messages: Dict[str, Dict] = {}

def create_profile(profile_id: str, user_id: str, age: int, gender: str,
                   location: str, bio: str, photo_url: str,
                   preferences: Optional[Dict] = None) -> Dict:
    \"\"\"FR-1: Users can create a dating profile\"\"\"
    profiles[profile_id] = {
        'id': profile_id,
        'user_id': user_id,
        'age': age,
        'gender': gender,
        'location': location,
        'bio': bio,
        'photo_url': photo_url,
        'preferences': preferences or {},
        'created_at': datetime.now()
    }
    return profiles[profile_id]

def record_swipe(swipe_id: str, swiper_id: str, target_id: str,
                 direction: str) -> Dict:
    \"\"\"FR-2: Users can swipe right (like) or left (pass) on profiles\"\"\"
    swipes[swipe_id] = {
        'id': swipe_id,
        'swiper_id': swiper_id,
        'target_id': target_id,
        'direction': direction,  # 'like' or 'pass'
        'created_at': datetime.now()
    }
    return swipes[swipe_id]

def find_match(swiper_id: str, target_id: str) -> Optional[Dict]:
    \"\"\"FR-3: When two users like each other, create a match\"\"\"
    # Check if target previously liked swiper
    for swipe in swipes.values():
        if (swipe['swiper_id'] == target_id and
            swipe['target_id'] == swiper_id and
            swipe['direction'] == 'like'):
            # Create simple match
            match_id = f\"{swiper_id}_{target_id}_{int(datetime.now().timestamp())}\"
            matches[match_id] = {
                'id': match_id,
                'user1_id': swiper_id,
                'user2_id': target_id,
                'created_at': datetime.now(),
                'last_message_at': None
            }
            return matches[match_id]
    return None

def get_matches(user_id: str) -> List[Dict]:
    \"\"\"FR-4: Users can view their list of matches\"\"\"
    user_matches: List[Dict] = []
    for match in matches.values():
        if match['user1_id'] == user_id or match['user2_id'] == user_id:
            user_matches.append(match)
    # Sort by most recent conversation
    user_matches.sort(key=lambda m: m['last_message_at'] or m['created_at'], reverse=True)
    return user_matches

def send_message(message_id: str, match_id: str, sender_id: str, content: str) -> Dict:
    \"\"\"FR-4: Matched users can chat with each other\"\"\"
    messages[message_id] = {
        'id': message_id,
        'match_id': match_id,
        'sender_id': sender_id,
        'content': content,
        'created_at': datetime.now()
    }
    if match_id in matches:
        matches[match_id]['last_message_at'] = datetime.now()
    return messages[message_id]

def get_conversation(match_id: str) -> List[Dict]:
    \"\"\"Helper: Get all messages in a conversation\"\"\"
    convo: List[Dict] = []
    for msg in messages.values():
        if msg['match_id'] == match_id:
            convo.append(msg)
    convo.sort(key=lambda m: m['created_at'])
    return convo
`,
};

// Auto-generate code challenges from functional requirements
(tinderProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(tinderProblemDefinition);


