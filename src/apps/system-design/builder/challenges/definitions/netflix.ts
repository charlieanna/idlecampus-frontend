import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Netflix - Video Streaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const netflixProblemDefinition: ProblemDefinition = {
  id: 'netflix',
  title: 'Netflix - Video Streaming',
  description: `Design a video streaming platform like Netflix that:
- Users can browse movies and TV shows
- Users can stream videos on-demand
- Platform recommends content based on viewing history
- Videos are available in multiple qualities (SD, HD, 4K)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can browse movies and TV shows',
    'Users can stream videos on-demand'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests and streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, viewing history, metadata',
      },
      {
        type: 'object_storage',
        reason: 'Need to store video files',
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
        reason: 'App server needs to stream video files',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'watch_history', 'subscription'],
      fields: {
        user: ['id', 'email', 'name', 'subscription_tier', 'created_at'],
        video: ['id', 'title', 'description', 'duration', 'video_url', 'thumbnail_url', 'created_at'],
        watch_history: ['user_id', 'video_id', 'progress', 'watched_at'],
        subscription: ['user_id', 'tier', 'status', 'expires_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Streaming videos
        { type: 'write', frequency: 'high' },        // Recording watch history
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing content
      ],
    },
  },

  scenarios: generateScenarios('netflix', problemConfigs.netflix),

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
videos = {}
watch_history = {}
subscriptions = {}

def browse_catalog(category: str = None, limit: int = 20) -> List[Dict]:
    """
    FR-1: Users can browse movies and TV shows
    Naive implementation - returns all videos, optionally filtered by category
    No personalization or ranking
    """
    catalog = []
    for video in videos.values():
        if category is None or video.get('category') == category:
            catalog.append(video)

    # Sort by created_at (newest first)
    catalog.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
    return catalog[:limit]

def search_content(query: str) -> List[Dict]:
    """
    FR-1: Users can search for content
    Naive implementation - simple substring match on title
    """
    results = []
    for video in videos.values():
        if query.lower() in video.get('title', '').lower():
            results.append(video)
    return results

def stream_video(video_id: str, user_id: str, quality: str = "HD") -> Dict:
    """
    FR-2: Users can stream videos on-demand
    Naive implementation - returns video URL and records in watch history
    No actual streaming logic or quality adaptation
    """
    if video_id not in videos:
        return None

    video = videos[video_id]

    # Record watch history
    history_id = f"{user_id}_{video_id}_{datetime.now().timestamp()}"
    watch_history[history_id] = {
        'user_id': user_id,
        'video_id': video_id,
        'progress': 0,
        'quality': quality,
        'watched_at': datetime.now()
    }

    return {
        'video_id': video_id,
        'video_url': video['video_url'],
        'quality': quality,
        'title': video['title']
    }

def update_watch_progress(user_id: str, video_id: str, progress: int) -> Dict:
    """
    Helper: Update watch progress
    Naive implementation - updates most recent watch history entry
    """
    # Find most recent watch history entry for this user/video
    for history_id in reversed(list(watch_history.keys())):
        history = watch_history[history_id]
        if history['user_id'] == user_id and history['video_id'] == video_id:
            history['progress'] = progress
            return history

    return None

def get_watch_history(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get user's watch history
    Naive implementation - returns recent watch history
    """
    user_history = []
    for history in watch_history.values():
        if history['user_id'] == user_id:
            user_history.append(history)

    # Sort by watched_at (most recent first)
    user_history.sort(key=lambda x: x['watched_at'], reverse=True)
    return user_history[:limit]

def get_recommendations(user_id: str, limit: int = 10) -> List[Dict]:
    """
    Helper: Get recommended content (mentioned in description)
    Naive implementation - returns random videos, no actual ML
    In real system, this would use viewing history and ML models
    """
    return list(videos.values())[:limit]
`,
};
