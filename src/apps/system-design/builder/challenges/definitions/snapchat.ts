import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Snapchat - Ephemeral Messaging Platform
 * Comprehensive FR and NFR scenarios
 */
export const snapchatProblemDefinition: ProblemDefinition = {
  id: 'snapchat',
  title: 'Snapchat - Ephemeral Messaging',
  description: `Design an ephemeral messaging platform like Snapchat that:
- Users can send photos/videos that disappear after viewing
- Users can post stories that last 24 hours
- Users can send messages that auto-delete
- Content expires automatically`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send photos/videos that disappear after viewing',
    'Users can post stories that last 24 hours',
    'Users can send messages that auto-delete'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process media uploads and messages',
      },
      {
        type: 'storage',
        reason: 'Need to store user data and message metadata',
      },
      {
        type: 'object_storage',
        reason: 'Need temporary storage for photos/videos',
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
        reason: 'App server needs to read/write message metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store/delete ephemeral media',
      },
    ],
    dataModel: {
      entities: ['user', 'snap', 'story', 'friendship'],
      fields: {
        user: ['id', 'username', 'phone', 'created_at'],
        snap: ['id', 'sender_id', 'receiver_id', 'media_url', 'viewed_at', 'expires_at', 'created_at'],
        story: ['id', 'user_id', 'media_url', 'expires_at', 'created_at'],
        friendship: ['user_id_1', 'user_id_2', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending snaps
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing snaps
        { type: 'write_large_file', frequency: 'very_high' }, // Uploading media
      ],
    },
  },

  scenarios: generateScenarios('snapchat', problemConfigs.snapchat),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
snaps = {}
stories = {}
friendships = {}

def send_snap(snap_id: str, sender_id: str, receiver_id: str, media_url: str,
              view_duration: int = 10) -> Dict:
    """
    FR-1: Users can send photos/videos that disappear after viewing
    Naive implementation - stores snap with expiration logic
    """
    snaps[snap_id] = {
        'id': snap_id,
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'media_url': media_url,
        'view_duration': view_duration,
        'viewed_at': None,
        'expires_at': None,
        'created_at': datetime.now()
    }
    return snaps[snap_id]

def view_snap(snap_id: str) -> Dict:
    """
    FR-1: View snap (marks as viewed and sets expiration)
    Naive implementation - sets viewed time and expiration
    """
    snap = snaps.get(snap_id)
    if not snap:
        raise ValueError("Snap not found")

    if snap['viewed_at']:
        raise ValueError("Snap already viewed")

    snap['viewed_at'] = datetime.now()
    snap['expires_at'] = datetime.now() + timedelta(seconds=snap['view_duration'])
    return snap

def post_story(story_id: str, user_id: str, media_url: str) -> Dict:
    """
    FR-2: Users can post stories that last 24 hours
    Naive implementation - stores story with 24-hour expiration
    """
    stories[story_id] = {
        'id': story_id,
        'user_id': user_id,
        'media_url': media_url,
        'expires_at': datetime.now() + timedelta(hours=24),
        'created_at': datetime.now()
    }
    return stories[story_id]

def get_active_stories(user_id: str) -> List[Dict]:
    """
    FR-2: Get stories that haven't expired
    Naive implementation - filters stories by expiration
    """
    active_stories = []
    now = datetime.now()
    for story in stories.values():
        if story['user_id'] == user_id and story['expires_at'] > now:
            active_stories.append(story)
    return active_stories

def send_chat_message(message_id: str, sender_id: str, receiver_id: str,
                      text: str) -> Dict:
    """
    FR-3: Users can send messages that auto-delete
    Naive implementation - creates message with auto-delete flag
    """
    return {
        'id': message_id,
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'text': text,
        'auto_delete': True,
        'created_at': datetime.now()
    }

def cleanup_expired_content() -> Dict:
    """
    Helper: Remove expired snaps and stories
    Naive implementation - deletes expired content
    """
    now = datetime.now()
    deleted_snaps = 0
    deleted_stories = 0

    # Delete viewed snaps that have expired
    snap_ids_to_delete = []
    for snap_id, snap in snaps.items():
        if snap['expires_at'] and snap['expires_at'] < now:
            snap_ids_to_delete.append(snap_id)

    for snap_id in snap_ids_to_delete:
        del snaps[snap_id]
        deleted_snaps += 1

    # Delete expired stories
    story_ids_to_delete = []
    for story_id, story in stories.items():
        if story['expires_at'] < now:
            story_ids_to_delete.append(story_id)

    for story_id in story_ids_to_delete:
        del stories[story_id]
        deleted_stories += 1

    return {
        'deleted_snaps': deleted_snaps,
        'deleted_stories': deleted_stories
    }
`,
};

// Auto-generate code challenges from functional requirements
(snapchatProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(snapchatProblemDefinition);
