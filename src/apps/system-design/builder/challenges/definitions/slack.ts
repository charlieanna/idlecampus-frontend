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
 * Slack - Team Collaboration Platform
 * DDIA Ch. 9 (Consistency and Consensus) - Total Order Broadcast for Message Ordering
 *
 * DDIA Concepts Applied:
 * - Ch. 9: Total order broadcast for message ordering across channels
 *   - All participants see messages in the same order
 *   - Implemented via consensus algorithm (Raft)
 *   - Prevents message reordering: "Hello" always before "World" for all users
 * - Ch. 9: Linearizability for read-your-writes guarantee
 *   - User posts message → Immediately sees it in their channel view
 *   - Prevents confusion: "I sent message but don't see it"
 *   - Strong consistency for message reads after writes
 * - Ch. 9: Causal consistency for threaded messages
 *   - Reply B depends on message A → All users see A before B
 *   - Preserves happens-before relationships in threads
 *   - Vector clocks track message dependencies
 * - Ch. 9: Consensus for channel membership changes
 *   - Adding/removing users from channel requires consensus
 *   - Raft leader coordinates atomic membership updates
 *   - Prevents split-brain: User appears in channel on some servers but not others
 * - Ch. 9: Lamport timestamps for message ordering
 *   - Each message assigned monotonically increasing logical clock
 *   - Resolves concurrent messages: Higher timestamp wins
 *   - Fallback to user ID for tie-breaking
 *
 * Total Order Broadcast Problem (DDIA Ch. 9):
 * Scenario: Alice sends "Hello", Bob sends "World" at same time in #general channel
 *
 * Without Total Order Broadcast:
 * Server 1 (US-East): Sees Alice's message first
 *   - User Charlie sees: "Hello", "World"
 * Server 2 (EU-West): Sees Bob's message first
 *   - User David sees: "World", "Hello"
 * → Inconsistent message order! Charlie and David see different conversation flow
 *
 * With Total Order Broadcast (Raft Consensus):
 * 1. Alice sends "Hello" → Raft leader in US-East receives it
 * 2. Bob sends "World" → Raft leader receives it (slightly later)
 * 3. Raft leader assigns sequence numbers: Hello=seq_1, World=seq_2
 * 4. Raft replicates to all followers with sequence numbers
 * 5. All servers deliver messages in sequence order: seq_1, seq_2
 * → Charlie and David both see: "Hello", "World" (consistent order)
 *
 * Total Order Broadcast Implementation (DDIA Ch. 9):
 * messages_log = []  # Append-only log, replicated via Raft
 *
 * # Leader receives message
 * def broadcast_message(channel_id, user_id, content):
 *     entry = {
 *         'seq': raft.get_next_sequence(),  # Monotonic sequence from Raft
 *         'channel_id': channel_id,
 *         'user_id': user_id,
 *         'content': content,
 *         'timestamp': time.now()
 *     }
 *     raft.append_log(entry)  # Replicate to all followers
 *     raft.wait_for_majority_ack()  # Ensure consensus
 *     return entry
 *
 * # All servers deliver messages in sequence order
 * def deliver_messages(channel_id):
 *     for entry in sorted(messages_log, key=lambda e: e['seq']):
 *         if entry['channel_id'] == channel_id:
 *             yield entry
 *
 * Linearizability for Read-Your-Writes (DDIA Ch. 9):
 * Problem: Alice posts "Meeting at 3pm" but doesn't see it in her view
 *
 * Without Linearizability:
 * T0: Alice writes message → Leader in US-East
 * T1: Leader acknowledges write (not yet replicated)
 * T2: Alice refreshes → Reads from EU-West replica (stale, no message)
 * → Alice confused: "Did my message send?"
 *
 * With Linearizable Read-Your-Writes:
 * T0: Alice writes message → Leader assigns seq=100, replicates
 * T1: Leader waits for majority ACK (2/3 servers)
 * T2: Leader responds to Alice: "Message sent, seq=100"
 * T3: Alice refreshes → Client includes seq=100 in read request
 * T4: EU-West replica checks: "My latest seq is 95, need to catch up"
 * T5: Replica fetches up to seq=100, then serves read
 * → Alice sees her message immediately
 *
 * Linearizable Read Implementation (DDIA Ch. 9):
 * # Client-side: Track last written sequence
 * last_write_seq = None
 *
 * def post_message(content):
 *     global last_write_seq
 *     result = leader.broadcast_message(content)
 *     last_write_seq = result['seq']  # Remember sequence
 *
 * def read_messages(channel_id):
 *     # Read-your-writes: Ensure replica has caught up
 *     return replica.get_messages(channel_id, min_seq=last_write_seq)
 *
 * # Server-side: Wait for replication if needed
 * def get_messages(channel_id, min_seq=None):
 *     if min_seq and raft.current_seq < min_seq:
 *         raft.wait_until_seq(min_seq)  # Block until caught up
 *     return [m for m in messages_log if m['channel_id'] == channel_id]
 *
 * Causal Consistency for Threaded Messages (DDIA Ch. 9):
 * Thread: Alice posts "What time is the meeting?" → Bob replies "3pm"
 *
 * Without Causal Consistency:
 * Charlie sees: "3pm" (Bob's reply)
 * → Charlie confused: "3pm for what?"
 * Then sees: "What time is the meeting?" (Alice's question)
 * → Messages out of causal order!
 *
 * With Vector Clocks (Causal Consistency):
 * Alice's client: VC = {Alice: 1, Bob: 0}
 * Alice posts "What time?": msg_A, VC = {Alice: 1, Bob: 0}
 *
 * Bob's client receives msg_A, updates VC: {Alice: 1, Bob: 0}
 * Bob replies "3pm": msg_B, VC = {Alice: 1, Bob: 1}
 *
 * Charlie's client:
 * - Receives msg_B first: VC = {Alice: 1, Bob: 1}
 * - Checks: "Do I have Alice: 1?" → No, buffer msg_B
 * - Receives msg_A: VC = {Alice: 1, Bob: 0} → Deliver msg_A
 * - Now check buffered msg_B: "Do I have Alice: 1?" → Yes, deliver msg_B
 * → Charlie sees correct order: msg_A, then msg_B
 *
 * Vector Clock Implementation (DDIA Ch. 9):
 * class VectorClock:
 *     def __init__(self):
 *         self.clock = {}  # {user_id: counter}
 *
 *     def increment(self, user_id):
 *         self.clock[user_id] = self.clock.get(user_id, 0) + 1
 *
 *     def merge(self, other_vc):
 *         for user_id, count in other_vc.clock.items():
 *             self.clock[user_id] = max(self.clock.get(user_id, 0), count)
 *
 *     def happens_before(self, other_vc):
 *         # self happened before other if all counters ≤ other's
 *         for user_id, count in self.clock.items():
 *             if count > other_vc.clock.get(user_id, 0):
 *                 return False
 *         return True
 *
 * def send_message(user_id, content, parent_msg_id=None):
 *     vc.increment(user_id)  # Increment sender's clock
 *     if parent_msg_id:  # Thread reply
 *         parent_vc = get_message_vc(parent_msg_id)
 *         vc.merge(parent_vc)  # Merge parent's causal history
 *     return {'content': content, 'vc': vc.clock.copy()}
 *
 * Consensus for Channel Membership (DDIA Ch. 9):
 * Problem: Add user to #engineering channel across 5 servers
 *
 * Without Consensus:
 * Server 1: Adds Charlie to #engineering
 * Server 2: Network delay → Doesn't receive update
 * → Charlie sends message → Routed to Server 2 → Rejected: "Not in channel"
 *
 * With Raft Consensus:
 * 1. Server 1 (leader) receives: "Add Charlie to #engineering"
 * 2. Leader proposes: LOG[5] = {op: 'add_member', channel: 'eng', user: 'charlie'}
 * 3. Leader replicates to followers: Server 2, 3, 4, 5
 * 4. Wait for majority (3/5) to ACK
 * 5. Leader commits: "Charlie added to #engineering at LOG[5]"
 * 6. All servers apply LOG[5] → Charlie now in channel everywhere
 *
 * Lamport Timestamps for Message Ordering (DDIA Ch. 9):
 * Scenario: Concurrent messages from different users
 *
 * Alice's client: LT = 5
 * Alice sends "Hello": msg_A, LT = 6
 *
 * Bob's client: LT = 5 (same as Alice's)
 * Bob sends "Hi": msg_B, LT = 6
 *
 * Server receives both with LT = 6 → Tie!
 * Tie-breaking: Sort by (timestamp, user_id)
 * - msg_A: (6, "alice")
 * - msg_B: (6, "bob")
 * → "alice" < "bob" lexicographically → msg_A first
 *
 * Lamport Timestamp Implementation (DDIA Ch. 9):
 * lamport_clock = 0
 *
 * def send_message(user_id, content):
 *     global lamport_clock
 *     lamport_clock += 1
 *     return {
 *         'content': content,
 *         'user_id': user_id,
 *         'lamport_ts': lamport_clock
 *     }
 *
 * def receive_message(msg):
 *     global lamport_clock
 *     lamport_clock = max(lamport_clock, msg['lamport_ts']) + 1
 *
 * def order_messages(messages):
 *     # Sort by Lamport timestamp, then user_id for tie-breaking
 *     return sorted(messages, key=lambda m: (m['lamport_ts'], m['user_id']))
 *
 * System Design Primer Concepts:
 * - Total Order Broadcast: Kafka with partition key = channel_id
 * - Raft Consensus: etcd or Consul for channel membership
 * - Vector Clocks: Cassandra-style conflict detection
 * - Linearizable Storage: Strongly consistent database (Spanner, CockroachDB)
 */
export const slackProblemDefinition: ProblemDefinition = {
  id: 'slack',
  title: 'Slack - Team Collaboration',
  description: `Design a team collaboration platform like Slack that:
- Users can send messages in channels and direct messages
- Workspaces organize teams with multiple channels
- Users can share files and integrate apps
- Messages support threads and reactions

Learning Objectives (DDIA Ch. 9):
1. Implement total order broadcast for message ordering (DDIA Ch. 9)
   - All users see messages in the same order
   - Use Raft consensus for sequence number assignment
   - Prevents message reordering across replicas
2. Design linearizability for read-your-writes guarantee (DDIA Ch. 9)
   - User immediately sees their own messages
   - Strong consistency for message reads after writes
   - Track sequence numbers to ensure replica freshness
3. Implement causal consistency for threaded messages (DDIA Ch. 9)
   - Preserve happens-before relationships in threads
   - Use vector clocks to track message dependencies
   - Buffer out-of-order messages until dependencies met
4. Design consensus for channel membership changes (DDIA Ch. 9)
   - Raft-based atomic membership updates
   - Prevent split-brain for user channel membership
5. Use Lamport timestamps for concurrent message ordering (DDIA Ch. 9)
   - Logical clocks for deterministic ordering
   - Tie-breaking with user IDs for concurrent messages`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send messages in channels and direct messages',
    'Users can share files and integrate apps',
    'Workspaces organize teams with multiple channels',
    'Messages support threads and reactions'
  ],

  userFacingNFRs: [
    'Total order broadcast: 100% consistent message ordering (DDIA Ch. 9: Raft sequence numbers)',
    'Linearizability: Read-your-writes < 100ms (DDIA Ch. 9: Track sequence, ensure replica freshness)',
    'Causal consistency: Preserve thread order (DDIA Ch. 9: Vector clocks buffer out-of-order)',
    'Consensus latency: Channel membership updates < 200ms (DDIA Ch. 9: Raft majority ACK)',
    'Lamport timestamps: Deterministic concurrent ordering (DDIA Ch. 9: Logical clocks + user ID tie-break)',
    'Message ordering: No reordering across replicas (DDIA Ch. 9: Total order via consensus)',
    'Split-brain prevention: Atomic membership changes (DDIA Ch. 9: Raft single leader)',
    'Happens-before: Preserve causality in threads (DDIA Ch. 9: Vector clock dependencies)',
    'Sequence freshness: Replicas catch up before read (DDIA Ch. 9: min_seq parameter)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and file uploads',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, channels, workspaces',
      },
      {
        type: 'object_storage',
        reason: 'Need to store file attachments',
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
        reason: 'Client sends requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store messages',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store files',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages in real-time',
      },
    ],
    dataModel: {
      entities: ['workspace', 'channel', 'user', 'message', 'thread', 'reaction'],
      fields: {
        workspace: ['id', 'name', 'domain', 'created_at'],
        channel: ['id', 'workspace_id', 'name', 'is_private', 'created_at'],
        user: ['id', 'workspace_id', 'email', 'name', 'avatar_url', 'created_at'],
        message: ['id', 'channel_id', 'user_id', 'content', 'created_at'],
        thread: ['parent_message_id', 'reply_message_id', 'created_at'],
        reaction: ['message_id', 'user_id', 'emoji', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading channel history
      ],
    },
  },

  scenarios: generateScenarios('slack', problemConfigs.slack, [
    'Users can send messages in channels and direct messages',
    'Users can share files and integrate apps',
    'Workspaces organize teams with multiple channels',
    'Messages support threads and reactions'
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
workspaces = {}
channels = {}
users = {}
messages = {}
threads = {}
reactions = {}

def send_message(message_id: str, channel_id: str, user_id: str, content: str) -> Dict:
    """
    FR-1: Users can send messages in channels
    Naive implementation - stores message in memory
    """
    messages[message_id] = {
        'id': message_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'content': content,
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_direct_message(message_id: str, sender_id: str, recipient_id: str, content: str) -> Dict:
    """
    FR-1: Users can send direct messages
    Naive implementation - creates a DM channel and sends message
    """
    # Create or find DM channel
    dm_channel_id = f"dm_{min(sender_id, recipient_id)}_{max(sender_id, recipient_id)}"

    if dm_channel_id not in channels:
        channels[dm_channel_id] = {
            'id': dm_channel_id,
            'type': 'direct_message',
            'participants': [sender_id, recipient_id],
            'created_at': datetime.now()
        }

    messages[message_id] = {
        'id': message_id,
        'channel_id': dm_channel_id,
        'user_id': sender_id,
        'content': content,
        'created_at': datetime.now()
    }
    return messages[message_id]

def upload_file(file_id: str, channel_id: str, user_id: str, file_url: str, filename: str) -> Dict:
    """
    FR-2: Users can share files
    Naive implementation - stores file metadata and creates message
    """
    message_id = f"file_{file_id}"
    messages[message_id] = {
        'id': message_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'content': f"Shared file: {filename}",
        'file_url': file_url,
        'filename': filename,
        'type': 'file',
        'created_at': datetime.now()
    }
    return messages[message_id]

def integrate_app(workspace_id: str, app_name: str, config: Dict) -> Dict:
    """
    FR-2: Users can integrate apps
    Naive implementation - stores app integration config
    In real system, this would setup webhooks, OAuth, etc.
    """
    return {
        'workspace_id': workspace_id,
        'app_name': app_name,
        'config': config,
        'integrated_at': datetime.now()
    }

def get_channel_messages(channel_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a channel
    Naive implementation - returns all messages in channel
    """
    channel_messages = []
    for message in messages.values():
        if message['channel_id'] == channel_id:
            channel_messages.append(message)

    # Sort by created_at (oldest first for chat history)
    channel_messages.sort(key=lambda x: x['created_at'])
    return channel_messages[-limit:]  # Return most recent N messages
`,
};

// Auto-generate code challenges from functional requirements
(slackProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(slackProblemDefinition);
