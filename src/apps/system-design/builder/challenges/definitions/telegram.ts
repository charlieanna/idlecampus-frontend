import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Telegram - Cloud Messaging Platform
 * Comprehensive FR and NFR scenarios
 */
export const telegramProblemDefinition: ProblemDefinition = {
  id: 'telegram',
  title: 'Telegram - Cloud Messaging',
  description: `Design a cloud messaging platform like Telegram that:
- Users can send messages, photos, and videos
- Messages are stored in the cloud (accessible from any device)
- Users can create channels for broadcasting
- Platform supports bots and automation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send messages, photos, and videos',
    'Users can create channels for broadcasting'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and bot requests',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, channels',
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
        reason: 'App server needs to store messages in cloud',
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
      entities: ['user', 'chat', 'message', 'channel', 'bot'],
      fields: {
        user: ['id', 'phone', 'username', 'name', 'created_at'],
        chat: ['id', 'type', 'title', 'created_at'],
        message: ['id', 'chat_id', 'sender_id', 'content', 'media_url', 'created_at'],
        channel: ['chat_id', 'name', 'description', 'subscribers', 'created_at'],
        bot: ['id', 'username', 'token', 'webhook_url', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading chats
        { type: 'read_by_query', frequency: 'high' }, // Searching messages
      ],
    },
  },

  scenarios: generateScenarios('telegram', problemConfigs.telegram),

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
chats = {}
messages = {}
channels = {}
bots = {}

def send_message(message_id: str, chat_id: str, sender_id: str, content: str,
                 media_url: str = None) -> Dict:
    """
    FR-1: Users can send messages, photos, and videos
    Naive implementation - stores message in cloud
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': content,
        'media_url': media_url,
        'created_at': datetime.now()
    }
    return messages[message_id]

def get_chat_messages(chat_id: str, limit: int = 50) -> List[Dict]:
    """
    FR-1: Messages stored in cloud (accessible from any device)
    Naive implementation - returns messages from any device
    """
    chat_messages = []
    for message in messages.values():
        if message['chat_id'] == chat_id:
            chat_messages.append(message)

    # Sort by created_at
    chat_messages.sort(key=lambda x: x['created_at'])
    return chat_messages[-limit:]

def create_channel(channel_id: str, chat_id: str, name: str, description: str = None) -> Dict:
    """
    FR-2: Users can create channels for broadcasting
    Naive implementation - creates channel
    """
    # First create the chat
    chats[chat_id] = {
        'id': chat_id,
        'type': 'channel',
        'title': name,
        'created_at': datetime.now()
    }

    channels[channel_id] = {
        'chat_id': chat_id,
        'name': name,
        'description': description,
        'subscribers': 0,
        'created_at': datetime.now()
    }
    return channels[channel_id]

def subscribe_to_channel(user_id: str, channel_id: str) -> Dict:
    """
    FR-2: Subscribe to channel
    Naive implementation - increments subscriber count
    """
    channel = channels.get(channel_id)
    if not channel:
        raise ValueError("Channel not found")

    channel['subscribers'] += 1
    return {
        'user_id': user_id,
        'channel_id': channel_id,
        'subscribed_at': datetime.now()
    }

def broadcast_to_channel(message_id: str, channel_id: str, content: str) -> Dict:
    """
    FR-2: Broadcast message to all channel subscribers
    Naive implementation - sends message to channel chat
    """
    channel = channels.get(channel_id)
    if not channel:
        raise ValueError("Channel not found")

    message = send_message(message_id, channel['chat_id'], 'channel', content)
    return message
`,
};
