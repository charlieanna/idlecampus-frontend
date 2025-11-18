import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  costOptimizationValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * WhatsApp - Messaging Platform
 * DDIA Ch. 8 (Distributed Systems) - Multi-Region Messaging with Network Partitions
 *
 * DDIA Concepts Applied:
 * - Ch. 8: Network partitions and split-brain for online status
 *   - Two datacenters lose connectivity → both mark user as "online"
 *   - Solution: Quorum-based presence detection (majority wins)
 *   - Fencing tokens to prevent stale writes after partition heals
 * - Ch. 8: Multi-datacenter message delivery with eventual consistency
 *   - Messages written to closest datacenter, replicated asynchronously
 *   - Conflict-free replicated data types (CRDTs) for message ordering
 *   - Vector clocks for causal consistency: Message B depends on Message A
 * - Ch. 8: Offline message queue synchronization
 *   - Client offline → messages queued in server
 *   - Client reconnects → replay missed messages in order
 *   - Handling duplicate detection with message IDs
 * - Ch. 8: Byzantine fault tolerance for group admin changes
 *   - Malicious server claims user is admin when they're not
 *   - Solution: Digital signatures + majority consensus
 * - Ch. 8: Clock synchronization for "last seen" timestamps
 *   - Servers have clock skew (±500ms)
 *   - Use logical clocks (Lamport timestamps) instead of wall-clock time
 *   - Ensure "last seen" is monotonically increasing
 * - Ch. 8: Handling partial failures in message delivery
 *   - Message sent → Database ACK → Network fails → WebSocket delivery fails
 *   - Use at-least-once delivery with idempotency keys
 *
 * Network Partition Problem (DDIA Ch. 8 - Split-Brain):
 * Scenario: User Alice is "online" in both US-East and EU-West datacenters, then network partition occurs
 *
 * Without Quorum:
 * US-East: Sees Alice's last heartbeat 10s ago → Marks Alice "offline"
 * EU-West: Sees Alice's last heartbeat 5s ago → Marks Alice "online"
 * → Split-brain! Alice appears offline in US, online in EU
 *
 * Solution: Quorum-Based Presence (Majority Consensus)
 * - 3 datacenters: US-East, US-West, EU-West
 * - Alice sends heartbeat to all 3 every 30 seconds
 * - Status is "online" if ≥2 datacenters received heartbeat in last 60s
 *
 * Example:
 * T0: Alice sends heartbeat → US-East ✓, US-West ✓, EU-West ✓
 * T30: Alice sends heartbeat → US-East ✓, US-West ✗ (partition), EU-West ✓
 * T60: Check presence: US-East (yes, 30s ago), EU-West (yes, 30s ago) → 2/3 quorum → "online"
 * T90: Alice sends heartbeat → US-East ✗, US-West ✗, EU-West ✓
 * T120: Check presence: Only EU-West (yes, 30s ago) → 1/3 no quorum → "offline"
 *
 * Vector Clocks for Message Ordering (DDIA Ch. 8):
 * Group chat: Alice, Bob, Charlie send messages concurrently
 *
 * Alice's device: [Alice=1, Bob=0, Charlie=0] → "Hi"
 * Bob's device: [Alice=1, Bob=1, Charlie=0] → "Hello" (saw Alice's message)
 * Charlie's device: [Alice=0, Bob=0, Charlie=1] → "Hey" (concurrent with Alice)
 *
 * Server merges:
 * - "Hi" (Alice=1)
 * - "Hey" (Charlie=1) ← concurrent with "Hi", but Alice's device ID < Charlie's → "Hi" first
 * - "Hello" (Bob=1, Alice=1) ← saw "Hi" → comes after "Hi"
 *
 * Final order: "Hi", "Hey", "Hello"
 *
 * Offline Message Queue Synchronization (DDIA Ch. 8):
 * Alice offline for 1 hour → 100 messages queued for Alice
 *
 * Naive approach: Send all 100 messages immediately when Alice reconnects
 * Problem: Network congestion, client overwhelmed
 *
 * Batched approach:
 * 1. Alice reconnects → Server sends: "You have 100 missed messages since T=12345"
 * 2. Alice requests batch: GET /messages?since=12345&limit=20
 * 3. Server returns first 20 messages
 * 4. Alice ACKs: "Received up to message_id=msg_80"
 * 5. Repeat until all messages synced
 *
 * Idempotency for duplicate detection:
 * - Each message has unique ID: msg_{timestamp}_{sender_id}_{random}
 * - Client deduplicates: IF message_id already exists THEN skip
 *
 * Fencing Tokens for Stale Writes (DDIA Ch. 8):
 * Problem: Network partition → Alice's device thinks it's the only writer
 *
 * T0: Alice's device acquires lock with token=5
 * T1: Network partition → Alice's device loses connectivity
 * T2: Lock expires → Bob's device acquires lock with token=6
 * T3: Network heals → Alice's device tries to write with token=5
 * → Server rejects: token=5 < current_token=6 (stale write)
 *
 * Exactly-Once Message Delivery (DDIA Ch. 8):
 * Challenge: Message sent → Server stores → Network fails before ACK
 *
 * Client retries → Server sees duplicate message ID → Returns cached response
 *
 * Implementation:
 * CREATE TABLE messages (
 *   id VARCHAR(100) PRIMARY KEY,  -- client-generated, globally unique
 *   chat_id INT,
 *   sender_id INT,
 *   content TEXT,
 *   created_at TIMESTAMP
 * );
 *
 * INSERT INTO messages (id, chat_id, sender_id, content)
 * VALUES ('msg_123', 'chat_456', 'user_1', 'Hello')
 * ON CONFLICT (id) DO NOTHING;  -- Idempotent write
 *
 * Byzantine Fault Tolerance for Group Admin (DDIA Ch. 8):
 * Problem: Malicious server claims Bob is admin, tries to remove Alice
 *
 * Solution: Majority consensus + digital signatures
 * - Admin change signed by current admin: SIGN(change, admin_private_key)
 * - Replicated to 3 datacenters
 * - Change accepted if ≥2 datacenters verify signature
 * - Bob cannot forge admin's signature → Rejected
 *
 * System Design Primer Concepts:
 * - WebSocket: Persistent connections for real-time messaging
 * - Message Queue: Reliable message delivery (Kafka/RabbitMQ)
 * - End-to-End Encryption: Signal Protocol for message encryption
 * - Object Storage: S3 for media files (photos, videos, voice messages)
 * - Load Balancing: Distribute WebSocket connections across servers
 * - Presence Service: Real-time "last seen" and "online" status with quorum
 */
export const whatsappProblemDefinition: ProblemDefinition = {
  id: 'whatsapp',
  title: 'WhatsApp - Messaging App',
  description: `Design a messaging platform like WhatsApp that:
- Users can send text messages in real-time
- Users can send photos, videos, and voice messages
- Messages are end-to-end encrypted
- Users can create group chats

Learning Objectives (DDIA Ch. 8):
1. Handle network partitions and split-brain for online status (DDIA Ch. 8)
   - Quorum-based presence detection across datacenters
   - Prevent split-brain: User appears online in some DCs, offline in others
2. Design multi-datacenter message delivery (DDIA Ch. 8)
   - Vector clocks for causal consistency in group chats
   - Conflict-free replicated data types (CRDTs) for message ordering
3. Implement offline message queue synchronization (DDIA Ch. 8)
   - Batched replay of missed messages on reconnect
   - Idempotency keys for duplicate detection
4. Use fencing tokens to prevent stale writes (DDIA Ch. 8)
   - Prevent writes after network partition heals with old lock
5. Handle clock synchronization for timestamps (DDIA Ch. 8)
   - Logical clocks (Lamport timestamps) for "last seen"
   - Ensure monotonically increasing timestamps across servers
6. Ensure exactly-once message delivery with partial failures (DDIA Ch. 8)
   - At-least-once delivery + idempotent writes`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send text messages in real-time',
    'Users can send photos, videos, and voice messages',
    'Users can create group chats'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'Network partition tolerance: Split-brain prevention (DDIA Ch. 8: Quorum 2/3 for presence)',
    'Message delivery: Exactly-once despite failures (DDIA Ch. 8: Idempotent writes + message ID)',
    'Offline sync: Batched replay on reconnect (DDIA Ch. 8: < 5s for 1000 messages)',
    'Causal consistency: Vector clocks for message ordering (DDIA Ch. 8: Preserve happens-before)',
    'Fencing tokens: Prevent stale writes (DDIA Ch. 8: Monotonic token numbers)',
    'Clock synchronization: Logical clocks for "last seen" (DDIA Ch. 8: Lamport timestamps)',
    'Byzantine tolerance: Digital signatures for admin (DDIA Ch. 8: 2/3 majority)',
    'Partial failure handling: At-least-once delivery (DDIA Ch. 8: Retry with backoff)',
    'Multi-datacenter latency: p99 < 150ms cross-region (DDIA Ch. 8: Async replication)',
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
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
    },
    {
      name: 'Cost Optimization (DDIA - Trade-offs)',
      validate: costOptimizationValidator,
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

// Auto-generate code challenges from functional requirements
(whatsappProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(whatsappProblemDefinition);
