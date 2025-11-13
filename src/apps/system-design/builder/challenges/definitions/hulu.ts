import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Hulu - Video Streaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const huluProblemDefinition: ProblemDefinition = {
  id: 'hulu',
  title: 'Hulu - TV & Movie Streaming',
  description: `Design a streaming platform like Hulu that:
- Users can watch TV shows and movies
- Platform offers live TV channels
- Users can record shows to watch later (DVR)
- Content is available with or without ads`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can watch TV shows and movies',
    'Users can record shows to watch later (DVR)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process streaming requests',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, watch history, DVR recordings',
      },
      {
        type: 'object_storage',
        reason: 'Need to store video content',
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
        reason: 'App server needs to read/write viewing data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to stream videos',
      },
    ],
    dataModel: {
      entities: ['user', 'show', 'episode', 'watch_history', 'dvr_recording'],
      fields: {
        user: ['id', 'email', 'subscription_tier', 'created_at'],
        show: ['id', 'title', 'description', 'genre', 'created_at'],
        episode: ['id', 'show_id', 'season', 'episode_number', 'video_url', 'duration', 'created_at'],
        watch_history: ['user_id', 'episode_id', 'progress', 'watched_at'],
        dvr_recording: ['id', 'user_id', 'episode_id', 'expires_at', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Streaming content
        { type: 'write', frequency: 'high' },        // Recording watch history
      ],
    },
  },

  scenarios: generateScenarios('hulu', problemConfigs.hulu),

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
shows = {}
episodes = {}
watch_history = {}
dvr_recordings = {}

def watch_content(episode_id: str, user_id: str) -> Dict:
    """
    FR-1: Users can watch TV shows and movies
    Naive implementation - returns episode URL for streaming
    """
    episode = episodes.get(episode_id)
    if not episode:
        raise ValueError("Episode not found")

    # Record watch history
    history_id = f"{user_id}_{episode_id}_{datetime.now().timestamp()}"
    watch_history[history_id] = {
        'user_id': user_id,
        'episode_id': episode_id,
        'progress': 0,
        'watched_at': datetime.now()
    }

    return {
        'episode': episode,
        'video_url': episode['video_url'],
        'duration': episode['duration']
    }

def update_watch_progress(user_id: str, episode_id: str, progress: int) -> Dict:
    """
    FR-1: Track watch progress
    Naive implementation - updates most recent watch history entry
    """
    # Find most recent watch history entry
    for history in watch_history.values():
        if history['user_id'] == user_id and history['episode_id'] == episode_id:
            history['progress'] = progress
            history['watched_at'] = datetime.now()
            return history

    # Create new if not found
    history_id = f"{user_id}_{episode_id}_{datetime.now().timestamp()}"
    watch_history[history_id] = {
        'user_id': user_id,
        'episode_id': episode_id,
        'progress': progress,
        'watched_at': datetime.now()
    }
    return watch_history[history_id]

def record_show(recording_id: str, user_id: str, episode_id: str,
                expiration_days: int = 30) -> Dict:
    """
    FR-2: Users can record shows to watch later (DVR)
    Naive implementation - stores recording metadata
    """
    from datetime import timedelta

    dvr_recordings[recording_id] = {
        'id': recording_id,
        'user_id': user_id,
        'episode_id': episode_id,
        'expires_at': datetime.now() + timedelta(days=expiration_days),
        'created_at': datetime.now()
    }
    return dvr_recordings[recording_id]

def get_dvr_recordings(user_id: str) -> List[Dict]:
    """
    FR-2: View DVR recordings
    Naive implementation - returns all recordings for user
    """
    user_recordings = []
    for recording in dvr_recordings.values():
        if recording['user_id'] == user_id:
            # Check if not expired
            if recording['expires_at'] > datetime.now():
                user_recordings.append(recording)
    return user_recordings

def delete_recording(recording_id: str) -> bool:
    """
    FR-2: Delete DVR recording
    Naive implementation - removes recording from memory
    """
    if recording_id in dvr_recordings:
        del dvr_recordings[recording_id]
        return True
    return False
`,
};
