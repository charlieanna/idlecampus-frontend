import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Twitch - Live Streaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const twitchProblemDefinition: ProblemDefinition = {
  id: 'twitch',
  title: 'Twitch - Live Streaming',
  description: `Design a live streaming platform like Twitch that:
- Streamers can broadcast live video
- Viewers can watch live streams
- Users can chat in real-time during streams
- Platform supports VOD (Video on Demand) playback`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can chat in real-time during streams'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process live video streams',
      },
      {
        type: 'storage',
        reason: 'Need to store stream metadata, chat logs, VODs',
      },
      {
        type: 'object_storage',
        reason: 'Need to store VOD recordings',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time chat during streams',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends/receives stream data',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write stream metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store VODs',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server needs to handle live chat',
      },
    ],
    dataModel: {
      entities: ['user', 'stream', 'chat_message', 'follow', 'subscription'],
      fields: {
        user: ['id', 'username', 'email', 'is_streamer', 'created_at'],
        stream: ['id', 'streamer_id', 'title', 'category', 'is_live', 'viewers', 'started_at'],
        chat_message: ['id', 'stream_id', 'user_id', 'message', 'created_at'],
        follow: ['follower_id', 'streamer_id', 'created_at'],
        subscription: ['subscriber_id', 'streamer_id', 'tier', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Watching streams
        { type: 'write', frequency: 'very_high' },    // Chat messages
      ],
    },
  },

  scenarios: generateScenarios('twitch', problemConfigs.twitch),

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
streams = {}
chat_messages = {}
follows = {}
subscriptions = {}

def send_chat_message(message_id: str, stream_id: str, user_id: str,
                      message: str) -> Dict:
    """
    FR-1: Users can chat in real-time during streams
    Naive implementation - stores chat message
    """
    chat_messages[message_id] = {
        'id': message_id,
        'stream_id': stream_id,
        'user_id': user_id,
        'message': message,
        'created_at': datetime.now()
    }
    return chat_messages[message_id]

def get_stream_chat(stream_id: str, limit: int = 100) -> List[Dict]:
    """
    FR-1: Get recent chat messages for a stream
    Naive implementation - returns recent messages
    """
    stream_chat = []
    for message in chat_messages.values():
        if message['stream_id'] == stream_id:
            stream_chat.append(message)

    # Sort by created_at (most recent last)
    stream_chat.sort(key=lambda x: x['created_at'])
    return stream_chat[-limit:]

def start_stream(stream_id: str, streamer_id: str, title: str, category: str) -> Dict:
    """
    Helper: Streamer starts broadcasting
    Naive implementation - creates stream record
    """
    streams[stream_id] = {
        'id': stream_id,
        'streamer_id': streamer_id,
        'title': title,
        'category': category,
        'is_live': True,
        'viewers': 0,
        'started_at': datetime.now()
    }
    return streams[stream_id]

def watch_stream(stream_id: str) -> Optional[Dict]:
    """
    Helper: User watches a stream
    Naive implementation - returns stream info, increments viewer count
    """
    stream = streams.get(stream_id)
    if not stream or not stream['is_live']:
        return None

    stream['viewers'] += 1
    return stream

def follow_streamer(follower_id: str, streamer_id: str) -> Dict:
    """
    Helper: Follow a streamer
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_{streamer_id}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'streamer_id': streamer_id,
        'created_at': datetime.now()
    }
    return follows[follow_id]
`,
};
