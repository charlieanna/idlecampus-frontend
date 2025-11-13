import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * TikTok - Short Video Platform
 * Comprehensive FR and NFR scenarios
 */
export const tiktokProblemDefinition: ProblemDefinition = {
  id: 'tiktok',
  title: 'TikTok - Short Video Platform',
  description: `Design a short-form video platform like TikTok that:
- Users can upload short videos (15-60 seconds)
- Users can scroll through an infinite feed of videos
- Users can like, comment, and share videos
- Videos auto-play as users scroll`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload short videos (15-60 seconds)',
    'Users can scroll through an infinite feed of videos',
    'Users can like, comment, and share videos'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests and video transcoding',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, video metadata',
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
        reason: 'App server needs to read/write metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve videos',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'like', 'comment'],
      fields: {
        user: ['id', 'username', 'profile_photo', 'created_at'],
        video: ['id', 'user_id', 'video_url', 'thumbnail_url', 'caption', 'views', 'created_at'],
        like: ['video_id', 'user_id', 'created_at'],
        comment: ['id', 'video_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading videos
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing feed
      ],
    },
  },

  scenarios: generateScenarios('tiktok', problemConfigs.tiktok),

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
likes = {}
comments = {}
video_feed = []

def upload_video(video_id: str, user_id: str, video_url: str, caption: str = "") -> Dict:
    """
    FR-1: Users can upload short videos (15-60 seconds)
    Naive implementation - stores video metadata in memory
    """
    videos[video_id] = {
        'id': video_id,
        'user_id': user_id,
        'video_url': video_url,
        'thumbnail_url': f"{video_url}_thumb.jpg",
        'caption': caption,
        'views': 0,
        'created_at': datetime.now()
    }
    # Add to global feed
    video_feed.append(video_id)
    return videos[video_id]

def get_video_feed(user_id: str, offset: int = 0, limit: int = 10) -> List[Dict]:
    """
    FR-2: Users can scroll through an infinite feed of videos
    Naive implementation - returns videos in reverse chronological order
    No personalization or ranking algorithm
    """
    # Get videos from offset
    feed_video_ids = video_feed[offset:offset + limit]

    # Fetch video details
    feed_videos = []
    for video_id in reversed(feed_video_ids):  # Most recent first
        if video_id in videos:
            video = videos[video_id].copy()
            video['views'] += 1  # Increment view count
            videos[video_id]['views'] = video['views']
            feed_videos.append(video)

    return feed_videos

def like_video(video_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like videos
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
    FR-3: Users can comment on videos
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

def share_video(video_id: str, user_id: str, share_to: str) -> Dict:
    """
    FR-3: Users can share videos
    Naive implementation - just returns share confirmation
    In real system, this would create notifications, links, etc.
    """
    return {
        'video_id': video_id,
        'user_id': user_id,
        'share_to': share_to,
        'shared_at': datetime.now()
    }
`,
};
