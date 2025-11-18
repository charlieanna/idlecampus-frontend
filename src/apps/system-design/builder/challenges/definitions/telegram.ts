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
 * Telegram - Cloud Messaging Platform
 * DDIA Ch. 4 (Encoding & Evolution) - MTProto Binary Protocol
 *
 * DDIA Concepts Applied:
 * - Ch. 4: Binary encoding for efficient messaging (MTProto)
 *   - Custom binary protocol optimized for mobile networks
 *   - 30-50% smaller than JSON for typical messages
 *   - TLV (Type-Length-Value) encoding structure
 * - Ch. 4: Schema evolution for protocol versioning
 *   - Forward compatibility: Old clients ignore new fields
 *   - Backward compatibility: New servers support old clients
 *   - Field tags allow adding features without breaking clients
 * - Ch. 4: Protocol Buffers comparison
 *   - MTProto uses similar field numbering scheme
 *   - But custom-designed for Telegram's security model
 *
 * MTProto Message Format (Simplified):
 * [message_id: int64] [seq_no: int32] [body_length: int32] [body: bytes]
 *
 * Example Message Encoding:
 * JSON (90 bytes):
 * {
 *   "message_id": 123456789,
 *   "user_id": 987654321,
 *   "text": "Hello!",
 *   "timestamp": 1704067200
 * }
 *
 * MTProto (45 bytes):
 * 0x15cd5b07 0x3ade68b1 0x06 "Hello!" 0x65a8c800
 *
 * Schema Evolution Example (DDIA Ch. 4):
 * Version 1: [message_id, user_id, text]
 * Version 2: [message_id, user_id, text, reply_to_id (new)]
 * Version 3: [message_id, user_id, text, reply_to_id, reactions (new)]
 *
 * Old clients ignore new fields (forward compatibility)
 * New servers fill defaults for missing fields (backward compatibility)
 *
 * Binary Encoding Benefits (DDIA Ch. 4):
 * 1. Bandwidth: 30-50% reduction vs JSON (critical for mobile)
 * 2. Parse speed: No UTF-8 decoding or JSON parsing overhead
 * 3. Schema enforcement: Type safety at protocol level
 * 4. Compactness: Variable-length integers (varint) for small values
 *
 * System Design Primer Concepts:
 * - WebSocket: Persistent connections for real-time messaging
 * - Message Queue: Async processing for offline message delivery
 * - CDN: Media file distribution (photos, videos)
 */
export const telegramProblemDefinition: ProblemDefinition = {
  id: 'telegram',
  title: 'Telegram - Cloud Messaging',
  description: `Design a cloud messaging platform like Telegram that:
- Users can send messages, photos, and videos
- Messages are stored in the cloud (accessible from any device)
- Users can create channels for broadcasting
- Platform supports bots and automation

Learning Objectives (DDIA Ch. 4):
1. Implement binary encoding with MTProto protocol (DDIA Ch. 4)
   - Understand TLV (Type-Length-Value) structure
   - Achieve 30-50% bandwidth savings over JSON
2. Design schema evolution for messaging protocol (DDIA Ch. 4)
   - Forward compatibility: Old clients ignore new fields
   - Backward compatibility: New servers support old clients
3. Compare binary formats (DDIA Ch. 4)
   - MTProto vs Protocol Buffers vs MessagePack
   - Trade-offs: compactness vs human-readability
4. Optimize for mobile networks (DDIA Ch. 4)
   - Variable-length integers (varint) for efficiency
   - Minimize payload size for low-bandwidth scenarios`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send messages, photos, and videos',
    'Users can create channels for broadcasting'
  ],

  userFacingNFRs: [
    'Message encoding: 30-50% smaller than JSON (DDIA Ch. 4: MTProto binary)',
    'Parse speed: < 1ms for typical message (DDIA Ch. 4: Binary vs JSON)',
    'Schema evolution: Support 3+ protocol versions simultaneously (DDIA Ch. 4)',
    'Mobile efficiency: < 5KB for typical chat sync (DDIA Ch. 4: Compact encoding)',
    'Message delivery: p99 < 200ms in same region (SDP: WebSocket)',
    'Cloud sync: < 1s to sync messages across devices (SDP: Message queue)',
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

// Auto-generate code challenges from functional requirements
(telegramProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(telegramProblemDefinition);
