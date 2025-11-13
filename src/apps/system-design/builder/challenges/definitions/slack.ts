import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Slack - Team Collaboration Platform
 * Comprehensive FR and NFR scenarios
 */
export const slackProblemDefinition: ProblemDefinition = {
  id: 'slack',
  title: 'Slack - Team Collaboration',
  description: `Design a team collaboration platform like Slack that:
- Users can send messages in channels and direct messages
- Workspaces organize teams with multiple channels
- Users can share files and integrate apps
- Messages support threads and reactions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send messages in channels and direct messages',
    'Users can share files and integrate apps'
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

  scenarios: generateScenarios('slack', problemConfigs.slack),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
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
