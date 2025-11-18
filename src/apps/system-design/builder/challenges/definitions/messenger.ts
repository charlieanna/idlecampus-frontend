import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Facebook Messenger - Messaging Platform
 * Comprehensive FR and NFR scenarios
 */
export const messengerProblemDefinition: ProblemDefinition = {
  id: 'messenger',
  title: 'Facebook Messenger - Chat App',
  description: `Design a messaging platform like Facebook Messenger that:
- Users can send text messages and media
- Users can make voice and video calls
- Group chats support multiple participants
- Messages sync across all devices`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send text messages and media',
    'Users can make voice and video calls'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and calls',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, conversations',
      },
      {
        type: 'object_storage',
        reason: 'Need to store media files',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time message delivery',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends messages',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store messages',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store media',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages in real-time',
      },
    ],
    dataModel: {
      entities: ['user', 'conversation', 'message', 'participant', 'media'],
      fields: {
        user: ['id', 'name', 'email', 'profile_photo', 'last_active', 'created_at'],
        conversation: ['id', 'type', 'created_at'],
        message: ['id', 'conversation_id', 'sender_id', 'content', 'created_at'],
        participant: ['conversation_id', 'user_id', 'joined_at'],
        media: ['id', 'message_id', 'url', 'type', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading conversations
      ],
    },
  },

  scenarios: generateScenarios('messenger', problemConfigs.messenger, [
    'Users can send text messages and media',
    'Users can make voice and video calls'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
conversations = {}
messages = {}
participants = {}
media = {}

def send_text_message(message_id: str, conversation_id: str, sender_id: str,
                      content: str) -> Dict:
    """
    FR-1: Users can send text messages
    Naive implementation - stores message in memory
    """
    messages[message_id] = {
        'id': message_id,
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'content': content,
        'type': 'text',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_media_message(message_id: str, conversation_id: str, sender_id: str,
                       media_url: str, media_type: str) -> Dict:
    """
    FR-1: Users can send media
    Naive implementation - stores message with media reference
    """
    # Store media
    media_id = f"media_{message_id}"
    media[media_id] = {
        'id': media_id,
        'message_id': message_id,
        'url': media_url,
        'type': media_type,
        'created_at': datetime.now()
    }

    messages[message_id] = {
        'id': message_id,
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'content': '',
        'type': 'media',
        'media_id': media_id,
        'created_at': datetime.now()
    }
    return messages[message_id]

def initiate_call(conversation_id: str, caller_id: str, call_type: str) -> Dict:
    """
    FR-2: Users can make voice and video calls
    Naive implementation - returns call initiation data
    """
    call_id = f"call_{conversation_id}_{datetime.now().timestamp()}"
    return {
        'call_id': call_id,
        'conversation_id': conversation_id,
        'caller_id': caller_id,
        'type': call_type,  # 'voice' or 'video'
        'status': 'ringing',
        'started_at': datetime.now()
    }

def get_conversation_messages(conversation_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a conversation
    Naive implementation - returns recent messages
    """
    conv_messages = []
    for message in messages.values():
        if message['conversation_id'] == conversation_id:
            conv_messages.append(message)

    # Sort by created_at (most recent last)
    conv_messages.sort(key=lambda x: x['created_at'])
    return conv_messages[-limit:]

def create_conversation(conversation_id: str, participant_ids: List[str],
                        conv_type: str = 'direct') -> Dict:
    """
    Helper: Create a conversation
    Naive implementation - stores conversation and participants
    """
    conversations[conversation_id] = {
        'id': conversation_id,
        'type': conv_type,  # 'direct' or 'group'
        'created_at': datetime.now()
    }

    # Add participants
    for user_id in participant_ids:
        participant_id = f"{conversation_id}_{user_id}"
        participants[participant_id] = {
            'conversation_id': conversation_id,
            'user_id': user_id,
            'joined_at': datetime.now()
        }

    return conversations[conversation_id]
`,
};

// Auto-generate code challenges from functional requirements
(messengerProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(messengerProblemDefinition);
