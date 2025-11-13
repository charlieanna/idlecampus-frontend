import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * WhatsApp - Messaging Platform
 * Comprehensive FR and NFR scenarios
 */
export const whatsappProblemDefinition: ProblemDefinition = {
  id: 'whatsapp',
  title: 'WhatsApp - Messaging App',
  description: `Design a messaging platform like WhatsApp that:
- Users can send text messages in real-time
- Users can send photos, videos, and voice messages
- Messages are end-to-end encrypted
- Users can create group chats`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send text messages in real-time',
    'Users can send photos, videos, and voice messages',
    'Users can create group chats'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and media',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, group data',
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
      entities: ['user', 'message', 'chat', 'group', 'media'],
      fields: {
        user: ['id', 'phone', 'name', 'profile_photo', 'last_seen', 'created_at'],
        message: ['id', 'chat_id', 'sender_id', 'content', 'media_url', 'created_at'],
        chat: ['id', 'type', 'created_at'],
        group: ['chat_id', 'name', 'admin_id', 'created_at'],
        media: ['id', 'message_id', 'url', 'type', 'size', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading chats
      ],
    },
  },

  scenarios: generateScenarios('whatsapp', problemConfigs.whatsapp),

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
messages = {}
chats = {}
groups = {}
media = {}

def send_text_message(message_id: str, chat_id: str, sender_id: str, content: str) -> Dict:
    """
    FR-1: Users can send text messages in real-time
    Naive implementation - stores message in memory
    No actual real-time delivery or encryption
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': content,
        'media_url': None,
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_photo(message_id: str, chat_id: str, sender_id: str, photo_url: str, caption: str = "") -> Dict:
    """
    FR-2: Users can send photos
    Naive implementation - stores message with photo URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': caption,
        'media_url': photo_url,
        'media_type': 'photo',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_video(message_id: str, chat_id: str, sender_id: str, video_url: str, caption: str = "") -> Dict:
    """
    FR-2: Users can send videos
    Naive implementation - stores message with video URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': caption,
        'media_url': video_url,
        'media_type': 'video',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_voice_message(message_id: str, chat_id: str, sender_id: str, audio_url: str) -> Dict:
    """
    FR-2: Users can send voice messages
    Naive implementation - stores message with audio URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': "",
        'media_url': audio_url,
        'media_type': 'voice',
        'created_at': datetime.now()
    }
    return messages[message_id]

def create_group_chat(chat_id: str, name: str, admin_id: str, member_ids: List[str]) -> Dict:
    """
    FR-3: Users can create group chats
    Naive implementation - stores group in memory
    """
    chats[chat_id] = {
        'id': chat_id,
        'type': 'group',
        'created_at': datetime.now()
    }

    groups[chat_id] = {
        'chat_id': chat_id,
        'name': name,
        'admin_id': admin_id,
        'member_ids': member_ids,
        'created_at': datetime.now()
    }
    return groups[chat_id]

def add_member_to_group(chat_id: str, user_id: str) -> Dict:
    """
    Helper: Add member to group chat
    Naive implementation - adds user to member list
    """
    if chat_id in groups:
        if user_id not in groups[chat_id]['member_ids']:
            groups[chat_id]['member_ids'].append(user_id)
        return groups[chat_id]
    return None

def get_chat_messages(chat_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a chat
    Naive implementation - returns all messages in chat
    """
    chat_messages = []
    for message in messages.values():
        if message['chat_id'] == chat_id:
            chat_messages.append(message)

    # Sort by created_at (oldest first)
    chat_messages.sort(key=lambda x: x['created_at'])
    return chat_messages[-limit:]  # Return most recent N messages
`,
};
