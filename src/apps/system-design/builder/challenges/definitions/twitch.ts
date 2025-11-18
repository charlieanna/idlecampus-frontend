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
 * Twitch - Live Streaming Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Time-Series Chat & Log-Structured Storage
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Log-structured storage for chat messages (append-only)
 *   - LSM-tree (Log-Structured Merge-tree) for write-heavy chat
 *   - SSTables for efficient time-range queries
 *   - Compaction to remove old chat messages (TTL-based)
 * - Ch. 3: Time-series indexing for live chat
 *   - Index on (stream_id, timestamp DESC) for chat history
 *   - Partitioning by stream_id for horizontal scaling
 *   - Efficient range queries: "Last 10 minutes of chat"
 * - Ch. 3: Full-text search on chat history
 *   - Elasticsearch for searching past chat messages
 *   - Highlight toxic messages, emotes, user mentions
 * - Ch. 3: B-tree indexes for stream metadata
 *   - Index on (category, viewer_count DESC) for discovery
 *   - Index on (streamer_id, is_live) for "followed streams"
 *
 * Log-Structured Storage Benefits for Chat (DDIA Ch. 3):
 * - Write throughput: 10,000+ messages/sec per stream
 * - Append-only: No in-place updates, fast writes
 * - Compaction: Automatically delete messages older than 30 days
 * - Crash recovery: Replay log from last checkpoint
 *
 * Time-Series Query Example:
 * SELECT * FROM chat_messages
 * WHERE stream_id = 'xqc_live_123'
 *   AND timestamp >= NOW() - INTERVAL '10 minutes'
 * ORDER BY timestamp DESC
 * LIMIT 100;
 *
 * LSM-Tree Write Path (DDIA Ch. 3):
 * 1. Chat message arrives → Write to in-memory memtable
 * 2. Memtable full (64MB) → Flush to disk as SSTable
 * 3. Background compaction merges SSTables
 * 4. Old SSTables (> 30 days) deleted during compaction
 *
 * Real-Time Chat Architecture:
 * - WebSocket: Persistent connections for sub-100ms latency
 * - Pub/Sub: Redis for broadcasting chat to viewers
 * - Batching: Group chat messages in 100ms windows to reduce DB writes
 *
 * System Design Primer Concepts:
 * - CDN: Video chunk delivery (HLS/DASH adaptive streaming)
 * - WebSocket: Real-time chat delivery
 * - Pub/Sub: Redis for chat message fanout to viewers
 * - Time-Series DB: InfluxDB/TimescaleDB for chat storage
 */
export const twitchProblemDefinition: ProblemDefinition = {
  id: 'twitch',
  title: 'Twitch - Live Streaming',
  description: `Design a live streaming platform like Twitch that:
- Streamers can broadcast live video
- Viewers can watch live streams
- Users can chat in real-time during streams
- Platform supports VOD (Video on Demand) playback

Learning Objectives (DDIA Ch. 3):
1. Design log-structured storage for chat messages (DDIA Ch. 3)
   - LSM-tree for append-only write-heavy workload
   - Understand SSTables and compaction strategies
2. Implement time-series indexing for chat history (DDIA Ch. 3)
   - Efficient range queries on (stream_id, timestamp)
   - Partition by stream_id for horizontal scaling
3. Build full-text search on chat history (DDIA Ch. 3)
   - Search past chat for emotes, mentions, keywords
4. Optimize for write-heavy workload (DDIA Ch. 3)
   - 10,000+ chat messages/sec per popular stream
   - Batching and async writes to reduce latency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can chat in real-time during streams'
  ],

  userFacingNFRs: [
    'Chat latency: p99 < 100ms (SDP: WebSocket + Redis Pub/Sub)',
    'Chat write throughput: 10,000+ msg/sec per stream (DDIA Ch. 3: LSM-tree)',
    'Chat history query: p99 < 200ms (DDIA Ch. 3: Time-series index on timestamp)',
    'Chat search: p99 < 500ms (DDIA Ch. 3: Elasticsearch on chat logs)',
    'Video start time: p99 < 2s (SDP: CDN edge serving, HLS adaptive streaming)',
    'Stream discovery: < 300ms (DDIA Ch. 3: B-tree index on category + viewer_count)',
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

  scenarios: generateScenarios('twitch', problemConfigs.twitch, [
    'Users can chat in real-time during streams'
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

// Auto-generate code challenges from functional requirements
(twitchProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(twitchProblemDefinition);
