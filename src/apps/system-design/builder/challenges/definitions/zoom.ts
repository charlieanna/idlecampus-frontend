import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Zoom - Video Conferencing Platform
 * DDIA Ch. 8 (Distributed Systems) - Distributed SFU Consensus & Failover
 *
 * DDIA Concepts Applied:
 * - Ch. 8: Distributed SFU (Selective Forwarding Unit) consensus for media routing
 *   - Multiple SFU servers handling same meeting
 *   - Consensus on which SFU routes to which participant
 *   - Prevent duplicate video streams (waste bandwidth)
 * - Ch. 8: Failover and redundancy for media servers
 *   - Primary SFU crashes → Backup SFU takes over < 3s
 *   - Participants automatically reconnect to backup
 *   - No meeting interruption (brief video freeze)
 * - Ch. 8: Clock drift and timestamp ordering for A/V sync
 *   - Audio/video from different participants must sync
 *   - NTP synchronization across servers (±10ms)
 *   - Jitter buffer compensates for network delays
 * - Ch. 8: Split-brain prevention for meeting state
 *   - Network partition → Two SFUs think they're coordinating meeting
 *   - Solution: Quorum-based leader election (Raft)
 *   - Only one SFU has authority to modify meeting state
 * - Ch. 8: Network partition handling during active calls
 *   - Participant A can't reach Participant B (partition)
 *   - SFU detects partition, keeps both connected
 *   - Trade-off: Some participants can't see each other
 * - Ch. 8: Handling partial failures in screen sharing
 *   - Screen share sender crashes → Graceful notification
 *   - Participants see "User X stopped sharing" (not hung screen)
 *
 * SFU Consensus Problem (DDIA Ch. 8):
 * Scenario: Meeting with 100 participants, 3 SFU servers (SFU1, SFU2, SFU3)
 *
 * Without Consensus:
 * - SFU1 routes Alice's video to 50 participants
 * - SFU2 also routes Alice's video to same 50 participants (duplicate!)
 * → Wasted bandwidth: 2x video streams sent
 *
 * With Consensus (Leader-Based Routing):
 * - Raft elects SFU1 as leader for this meeting
 * - SFU1 assigns routing: "SFU1 handles participants 1-50, SFU2 handles 51-100"
 * - SFU2 and SFU3 follow SFU1's routing decisions
 * → No duplicates, optimal bandwidth usage
 *
 * SFU Failover (DDIA Ch. 8):
 * T0: SFU1 is primary, handling 100 participants
 * T1: SFU1 crashes (hardware failure)
 * T2 (1s later): SFU2 and SFU3 detect SFU1 heartbeat timeout
 * T3 (2s later): Raft election → SFU2 becomes new leader
 * T4: SFU2 broadcasts: "I am new leader, reconnect to me"
 * T5 (3s total): All 100 participants reconnected to SFU2/SFU3
 * → Brief video freeze (2-3 seconds), then meeting continues
 *
 * Clock Drift for A/V Sync (DDIA Ch. 8):
 * Problem: Alice's audio and Bob's video are out of sync
 *
 * Alice's clock: 10:00:00.000 (exact)
 * Bob's clock: 10:00:00.050 (50ms ahead)
 *
 * Alice sends audio packet at 10:00:00.100 (her time)
 * Bob sends video packet at 10:00:00.100 (his time, actually 10:00:00.150 real time)
 *
 * SFU receives:
 * - Alice's audio with timestamp 10:00:00.100
 * - Bob's video with timestamp 10:00:00.100 (but 50ms later in real time)
 * → Appears synchronized, but actually 50ms out of sync
 *
 * Solution: NTP clock synchronization
 * - All participants sync with NTP server (±10ms accuracy)
 * - SFU uses NTP-corrected timestamps for playback ordering
 * - Jitter buffer (100ms) absorbs remaining clock skew
 *
 * Split-Brain Prevention (DDIA Ch. 8):
 * Network partition: SFU1 and SFU2 can't communicate
 *
 * Without Quorum:
 * - SFU1 thinks it's the leader (has 60 participants)
 * - SFU2 also thinks it's the leader (has 40 participants)
 * → Two leaders! Meeting state diverges
 *
 * With Raft Quorum (3 SFUs total):
 * - Partition splits: [SFU1 + SFU3] vs [SFU2]
 * - SFU1 + SFU3 = 2/3 quorum → SFU1 remains leader
 * - SFU2 alone = 1/3 no quorum → SFU2 becomes follower (read-only)
 * → Only one leader, meeting state consistent
 *
 * Participant Partition Handling (DDIA Ch. 8):
 * Network partition between US-East and EU-West datacenters
 *
 * Participants in meeting:
 * - Alice (US-East), Bob (US-East), Charlie (EU-West), David (EU-West)
 *
 * Partition occurs:
 * - Alice and Bob can see each other
 * - Charlie and David can see each other
 * - But Alice/Bob ↔ Charlie/David can't communicate
 *
 * Zoom's approach: Keep both groups connected
 * - SFU in US-East handles Alice + Bob
 * - SFU in EU-West handles Charlie + David
 * - Participants see notification: "Some participants disconnected"
 * - When partition heals: Automatically merge back together
 *
 * Screen Share Failure Handling (DDIA Ch. 8):
 * Alice is sharing screen → Alice's client crashes
 *
 * Without Failure Detection:
 * - Participants see frozen screen
 * - Unclear if Alice's screen or network issue
 *
 * With Heartbeat Monitoring:
 * T0: Alice sends screen share frames every 100ms
 * T1: Alice's client crashes (last frame at T0)
 * T2 (3s later): SFU detects no frames from Alice for 3s
 * T3: SFU broadcasts to all participants: "Alice stopped sharing screen"
 * T4: Participants UI updates: "Screen sharing ended"
 * → Clear feedback, no confusion
 *
 * System Design Primer Concepts:
 * - WebRTC: Peer-to-peer and SFU-based video routing
 * - SFU (Selective Forwarding Unit): Efficient media routing for large meetings
 * - Jitter Buffer: Compensate for network delay variations
 * - NTP: Network Time Protocol for clock synchronization
 */
export const zoomProblemDefinition: ProblemDefinition = {
  id: 'zoom',
  title: 'Zoom - Video Conferencing',
  description: `Design a video conferencing platform like Zoom that:
- Users can create and join video meetings
- Meetings support screen sharing and recording
- Platform handles audio and video streaming
- Users can chat during meetings

Learning Objectives (DDIA Ch. 8):
1. Design distributed SFU consensus for media routing (DDIA Ch. 8)
   - Raft-based leader election across SFU servers
   - Prevent duplicate video stream routing
2. Implement SFU failover and redundancy (DDIA Ch. 8)
   - Primary SFU crashes → Backup takes over < 3s
   - Participants automatically reconnect
3. Handle clock drift for A/V synchronization (DDIA Ch. 8)
   - NTP clock sync across servers (±10ms)
   - Jitter buffer to absorb network delay variations
4. Prevent split-brain for meeting state (DDIA Ch. 8)
   - Quorum-based writes (2/3 SFUs)
   - Only one SFU has authority to modify meeting
5. Handle network partitions during active calls (DDIA Ch. 8)
   - Keep participant groups connected separately
   - Merge when partition heals
6. Design graceful failure handling for screen sharing (DDIA Ch. 8)
   - Detect sender crashes with heartbeat monitoring
   - Notify participants clearly`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create and join video meetings',
    'Users can chat during meetings'
  ],

  // DDIA Ch. 8 Non-Functional Requirements
  userFacingNFRs: [
    'SFU failover: < 3s to recover from crash (DDIA Ch. 8: Raft leader election)',
    'No duplicate streams: Consensus on routing (DDIA Ch. 8: Leader-based routing)',
    'A/V sync: ±10ms clock synchronization (DDIA Ch. 8: NTP)',
    'Split-brain prevention: Quorum writes (DDIA Ch. 8: 2/3 SFUs)',
    'Network partition tolerance: Keep groups connected (DDIA Ch. 8: Graceful degradation)',
    'Failure detection: 3s heartbeat timeout (DDIA Ch. 8: Screen share monitoring)',
    'Jitter buffer: 100ms to absorb delays (DDIA Ch. 8: Compensate clock skew)',
    'Meeting state consistency: Linearizable writes (DDIA Ch. 8: Raft consensus)',
    'Participant reconnect: < 5s after partition heals (DDIA Ch. 8: Auto-merge)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process video/audio streams and signaling',
      },
      {
        type: 'storage',
        reason: 'Need to store meeting metadata and recordings',
      },
      {
        type: 'object_storage',
        reason: 'Need to store meeting recordings',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time video/audio streaming',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends video/audio streams',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store meeting data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store recordings',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server handles real-time streams',
      },
    ],
    dataModel: {
      entities: ['user', 'meeting', 'participant', 'recording', 'chat_message'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        meeting: ['id', 'host_id', 'title', 'scheduled_start', 'duration', 'status', 'created_at'],
        participant: ['meeting_id', 'user_id', 'joined_at', 'left_at'],
        recording: ['id', 'meeting_id', 'url', 'duration', 'created_at'],
        chat_message: ['id', 'meeting_id', 'user_id', 'message', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Streaming video/audio
        { type: 'read_by_key', frequency: 'high' }, // Loading meeting details
      ],
    },
  },

  scenarios: generateScenarios('zoom', problemConfigs.zoom),

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
meetings = {}
participants = {}
recordings = {}
chat_messages = {}

def create_meeting(meeting_id: str, host_id: str, title: str, scheduled_start: datetime, duration: int) -> Dict:
    """
    FR-1: Users can create video meetings
    Naive implementation - stores meeting in memory
    """
    meetings[meeting_id] = {
        'id': meeting_id,
        'host_id': host_id,
        'title': title,
        'scheduled_start': scheduled_start,
        'duration': duration,  # in minutes
        'status': 'scheduled',
        'created_at': datetime.now()
    }
    return meetings[meeting_id]

def join_meeting(meeting_id: str, user_id: str) -> Dict:
    """
    FR-1: Users can join video meetings
    Naive implementation - stores participant info
    No actual video/audio streaming
    """
    participant_id = f"{meeting_id}_{user_id}"
    participants[participant_id] = {
        'meeting_id': meeting_id,
        'user_id': user_id,
        'joined_at': datetime.now(),
        'left_at': None
    }

    # Update meeting status to active
    if meeting_id in meetings:
        meetings[meeting_id]['status'] = 'active'

    return participants[participant_id]

def send_chat_message(message_id: str, meeting_id: str, user_id: str, message: str) -> Dict:
    """
    FR-2: Users can chat during meetings
    Naive implementation - stores chat message in memory
    """
    chat_messages[message_id] = {
        'id': message_id,
        'meeting_id': meeting_id,
        'user_id': user_id,
        'message': message,
        'created_at': datetime.now()
    }
    return chat_messages[message_id]

def leave_meeting(meeting_id: str, user_id: str) -> Dict:
    """
    Helper: User leaves meeting
    Naive implementation - updates participant record
    """
    participant_id = f"{meeting_id}_{user_id}"
    if participant_id in participants:
        participants[participant_id]['left_at'] = datetime.now()
        return participants[participant_id]
    return None

def get_meeting_participants(meeting_id: str) -> List[Dict]:
    """
    Helper: Get all participants in a meeting
    Naive implementation - returns all participants who haven't left
    """
    active_participants = []
    for participant in participants.values():
        if participant['meeting_id'] == meeting_id and participant['left_at'] is None:
            active_participants.append(participant)
    return active_participants

def get_meeting_chat(meeting_id: str) -> List[Dict]:
    """
    Helper: Get all chat messages from a meeting
    Naive implementation - returns all chat messages
    """
    meeting_chat = []
    for message in chat_messages.values():
        if message['meeting_id'] == meeting_id:
            meeting_chat.append(message)

    # Sort by created_at
    meeting_chat.sort(key=lambda x: x['created_at'])
    return meeting_chat
`,
};
