import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * YouTube - Video Sharing Platform
 * Comprehensive FR and NFR scenarios
 */
export const youtubeProblemDefinition: ProblemDefinition = {
  id: 'youtube',
  title: 'YouTube - Video Sharing',
  description: `Design a video sharing platform like YouTube that:
- Users can upload and share videos
- Users can watch, like, comment on videos
- Users can subscribe to channels
- Videos are recommended based on viewing history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload and share videos',
    'Users can watch, like, comment on videos',
    'Users can subscribe to channels'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process uploads, transcoding, streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store video metadata, comments, users',
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
        reason: 'App server needs to read/write video metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/stream videos',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'comment', 'subscription', 'like'],
      fields: {
        user: ['id', 'email', 'channel_name', 'created_at'],
        video: ['id', 'channel_id', 'title', 'description', 'video_url', 'thumbnail_url', 'views', 'created_at'],
        comment: ['id', 'video_id', 'user_id', 'text', 'created_at'],
        subscription: ['subscriber_id', 'channel_id', 'created_at'],
        like: ['video_id', 'user_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading videos
        { type: 'read_by_key', frequency: 'very_high' }, // Watching videos
        { type: 'write', frequency: 'very_high' },    // Comments, likes
      ],
    },
  },

  scenarios: generateScenarios('youtube', problemConfigs.youtube),

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
comments = {}
subscriptions = {}
likes = {}

def upload_video(video_id: str, channel_id: str, title: str, description: str, video_url: str) -> Dict:
    """
    FR-1: Users can upload and share videos
    Naive implementation - stores video metadata in memory
    """
    videos[video_id] = {
        'id': video_id,
        'channel_id': channel_id,
        'title': title,
        'description': description,
        'video_url': video_url,
        'thumbnail_url': f"{video_url}_thumb.jpg",
        'views': 0,
        'created_at': datetime.now()
    }
    return videos[video_id]

def watch_video(video_id: str) -> Dict:
    """
    FR-2: Users can watch videos
    Naive implementation - increments view count
    """
    if video_id in videos:
        videos[video_id]['views'] += 1
        return videos[video_id]
    return None

def like_video(video_id: str, user_id: str) -> Dict:
    """
    FR-2: Users can like videos
    Naive implementation - stores like in memory
    """
    like_id = f"{video_id}_{user_id}"
    likes[like_id] = {
        'video_id': video_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    return likes[like_id]

def comment_on_video(comment_id: str, video_id: str, user_id: str, text: str) -> Dict:
    """
    FR-2: Users can comment on videos
    Naive implementation - stores comment in memory
    """
    comments[comment_id] = {
        'id': comment_id,
        'video_id': video_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def subscribe_to_channel(subscriber_id: str, channel_id: str) -> Dict:
    """
    FR-3: Users can subscribe to channels
    Naive implementation - stores subscription in memory
    """
    subscription_key = f"{subscriber_id}_{channel_id}"
    subscriptions[subscription_key] = {
        'subscriber_id': subscriber_id,
        'channel_id': channel_id,
        'created_at': datetime.now()
    }
    return subscriptions[subscription_key]

def get_subscribed_videos(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get videos from subscribed channels
    Naive implementation - returns videos from subscribed channels
    """
    # Get all channels this user subscribes to
    subscribed_channels = []
    for sub in subscriptions.values():
        if sub['subscriber_id'] == user_id:
            subscribed_channels.append(sub['channel_id'])

    # Get all videos from subscribed channels
    feed = []
    for video in videos.values():
        if video['channel_id'] in subscribed_channels:
            feed.append(video)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]
`,
};
