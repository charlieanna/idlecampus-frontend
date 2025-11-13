import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Zoom - Video Conferencing Platform
 * Comprehensive FR and NFR scenarios
 */
export const zoomProblemDefinition: ProblemDefinition = {
  id: 'zoom',
  title: 'Zoom - Video Conferencing',
  description: `Design a video conferencing platform like Zoom that:
- Users can create and join video meetings
- Meetings support screen sharing and recording
- Platform handles audio and video streaming
- Users can chat during meetings`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create and join video meetings',
    'Users can chat during meetings'
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
