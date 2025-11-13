import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Discord - Gaming Chat Platform
 * Comprehensive FR and NFR scenarios
 */
export const discordProblemDefinition: ProblemDefinition = {
  id: 'discord',
  title: 'Discord - Gaming Chat',
  description: `Design a group chat platform like Discord that:
- Users can create servers with multiple channels
- Users can send text messages in real-time
- Users can join voice/video calls
- Messages are organized by channels and threads`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create servers with multiple channels',
    'Users can send text messages in real-time',
    'Users can join voice/video calls'
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

  scenarios: generateScenarios('discord', problemConfigs.discord),

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
