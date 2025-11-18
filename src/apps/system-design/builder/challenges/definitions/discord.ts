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
 * Discord - Gaming Chat Platform
 * DDIA Ch. 11 (Stream Processing) & Ch. 4 (Encoding)
 *
 * DDIA Concepts Applied:
 * - Ch. 11: Real-time messaging with WebSockets
 *   - Stateful connections for low-latency message delivery
 *   - Fan-out to all connected clients in channel
 *   - Maintain session state per WebSocket connection
 * - Ch. 4: Binary encoding for message protocol
 *   - Use MessagePack or Protocol Buffers for compact messages
 *   - ETF (Erlang Term Format) used by actual Discord
 * - Ch. 11: Event-driven architecture
 *   - Message sent → Store in DB → Fan-out via WebSocket
 *   - Use message queue (Kafka) for reliable delivery
 *
 * Discord's Architecture (DDIA Ch. 11):
 * - **Gateway**: WebSocket server for real-time events
 *   - Handles 1000+ connections per server
 *   - Sends events: MESSAGE_CREATE, TYPING_START, etc.
 * - **ETF Encoding**: Binary protocol (Erlang Term Format)
 *   - 30-50% smaller than JSON
 *   - Faster serialization than JSON
 * - **Voice**: WebRTC for peer-to-peer audio/video
 *
 * WebSocket Message Flow (DDIA Ch. 11):
 * 1. Client sends message via WebSocket
 * 2. Gateway server stores message in DB
 * 3. Gateway fans out to all connected clients in channel
 * 4. Use Redis Pub/Sub for cross-gateway coordination
 *
 * System Design Primer Concepts:
 * - WebSockets: Persistent bidirectional connections
 * - Load Balancing: Sticky sessions for WebSocket connections
 * - Message Queue: Kafka for event streaming
 * - Caching: Redis for online user presence
 */
export const discordProblemDefinition: ProblemDefinition = {
  id: 'discord',
  title: 'Discord - Gaming Chat',
  description: `Design a group chat platform like Discord that:
- Users can create servers with multiple channels
- Users can send text messages in real-time
- Users can join voice/video calls
- Messages are organized by channels and threads

Learning Objectives (DDIA Ch. 4, 11):
1. Implement real-time messaging with WebSockets (DDIA Ch. 11)
   - Persistent bidirectional connections
   - Fan-out to all channel members
2. Design binary message protocol (DDIA Ch. 4)
   - ETF/MessagePack for compact encoding
   - Compare JSON vs binary trade-offs
3. Build event-driven architecture (DDIA Ch. 11)
   - Message → DB → Fan-out pipeline
4. Handle WebSocket scaling challenges (SDP)
   - Sticky sessions for load balancing
   - Redis Pub/Sub for cross-gateway messaging`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create servers with multiple channels',
    'Users can send text messages in real-time',
    'Users can join voice/video calls',
    'Messages are organized by channels and threads'
  ],

  userFacingNFRs: [
    'Real-time latency: < 100ms message delivery (DDIA Ch. 11: WebSockets)',
    'Message encoding: Binary (ETF/MessagePack) for 30-50% size reduction (DDIA Ch. 4)',
    'Fan-out: Deliver to all channel members in < 200ms (DDIA Ch. 11: Event streaming)',
    'Connection capacity: 1000+ WebSocket connections per gateway (SDP: Load balancing)',
    'Voice/video: WebRTC for peer-to-peer audio (SDP)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process chat messages and user actions',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, servers, channels, users',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time message delivery via WebSockets',
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
        reason: 'App server needs to read/write chat data',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages to WebSocket server',
      },
    ],
    dataModel: {
      entities: ['user', 'server', 'channel', 'message', 'member'],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'created_at'],
        server: ['id', 'name', 'icon_url', 'owner_id', 'created_at'],
        channel: ['id', 'server_id', 'name', 'type', 'created_at'],
        message: ['id', 'channel_id', 'user_id', 'content', 'created_at'],
        member: ['server_id', 'user_id', 'role', 'joined_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading chat history
      ],
    },
  },

  scenarios: generateScenarios('discord', problemConfigs.discord, [
    'Users can create servers with multiple channels',
    'Users can send text messages in real-time',
    'Users can join voice/video calls',
    'Messages are organized by channels and threads'
  ]),

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
servers = {}
channels = {}
messages = {}
members = {}
voice_sessions = {}

def create_server(server_id: str, name: str, owner_id: str) -> Dict:
    """
    FR-1: Users can create servers
    Naive implementation - stores server in memory
    """
    servers[server_id] = {
        'id': server_id,
        'name': name,
        'icon_url': None,
        'owner_id': owner_id,
        'created_at': datetime.now()
    }
    return servers[server_id]

def create_channel(channel_id: str, server_id: str, name: str, channel_type: str = "text") -> Dict:
    """
    FR-1: Users can create multiple channels in a server
    Naive implementation - stores channel in memory
    """
    channels[channel_id] = {
        'id': channel_id,
        'server_id': server_id,
        'name': name,
        'type': channel_type,  # text, voice, or video
        'created_at': datetime.now()
    }
    return channels[channel_id]

def send_message(message_id: str, channel_id: str, user_id: str, content: str) -> Dict:
    """
    FR-2: Users can send text messages in real-time
    Naive implementation - stores message in memory
    No actual real-time delivery
    """
    messages[message_id] = {
        'id': message_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'content': content,
        'created_at': datetime.now()
    }
    return messages[message_id]

def join_voice_call(session_id: str, channel_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can join voice calls
    Naive implementation - stores voice session
    No actual audio/video streaming
    """
    voice_sessions[session_id] = {
        'id': session_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'type': 'voice',
        'joined_at': datetime.now()
    }
    return voice_sessions[session_id]

def join_video_call(session_id: str, channel_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can join video calls
    Naive implementation - stores video session
    No actual video streaming
    """
    voice_sessions[session_id] = {
        'id': session_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'type': 'video',
        'joined_at': datetime.now()
    }
    return voice_sessions[session_id]

def get_channel_messages(channel_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a channel
    Naive implementation - returns all messages in channel
    """
    channel_messages = []
    for message in messages.values():
        if message['channel_id'] == channel_id:
            channel_messages.append(message)

    # Sort by created_at (oldest first)
    channel_messages.sort(key=lambda x: x['created_at'])
    return channel_messages[-limit:]  # Return most recent N messages
`,
};

// Auto-generate code challenges from functional requirements
(discordProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(discordProblemDefinition);
