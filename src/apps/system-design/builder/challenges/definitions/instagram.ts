import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Instagram - Photo Sharing Platform
 * Comprehensive FR and NFR scenarios
 */
export const instagramProblemDefinition: ProblemDefinition = {
  id: 'instagram',
  title: 'Instagram - Photo Sharing Platform',
  description: `Design a photo sharing platform like Instagram that:
- Users can upload photos and videos
- Users can view a feed of photos from people they follow
- Users can like and comment on photos
- Users can search for other users and content`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload photos and videos',
    'Users can view a feed of photos from people they follow',
    'Users can like and comment on photos',
    'Users can search for other users and content'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests (upload, view, like)',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, posts, likes, comments',
      },
      {
        type: 'object_storage',
        reason: 'Need to store photos and videos (large files)',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for fast global image delivery',
      },
      {
        type: 'cache',
        reason: 'Need caching for feed performance',
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
        reason: 'App server needs to upload/retrieve media files',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server caches feeds and user data',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls images from object storage',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'like', 'comment', 'follower'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'image_url', 'caption', 'created_at'],
        like: ['post_id', 'user_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        follower: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'medium' },        // Uploading posts
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing feed
        { type: 'write_large_file', frequency: 'medium' }, // Uploading images
      ],
    },
  },

  scenarios: generateScenarios('instagram', problemConfigs.instagram),

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
posts = {}
likes = {}
comments = {}
followers = {}

def upload_photo(post_id: str, user_id: str, image_url: str, caption: str = "") -> Dict:
    """
    FR-1: Users can upload photos and videos
    Naive implementation - stores post metadata in memory
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'image_url': image_url,
        'caption': caption,
        'created_at': datetime.now()
    }
    return posts[post_id]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow other users (helper for feed)
    Naive implementation - stores follow relationship in memory
    """
    follow_key = f"{follower_id}_{following_id}"
    followers[follow_key] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    return followers[follow_key]

def get_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Users can view a feed of photos from people they follow
    Naive implementation - returns all posts from followed users
    No ranking algorithm or personalization
    """
    # Get all users this user follows
    following = []
    for follow in followers.values():
        if follow['follower_id'] == user_id:
            following.append(follow['following_id'])

    # Get all posts from followed users
    feed = []
    for post in posts.values():
        if post['user_id'] in following:
            feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]

def like_photo(post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like photos
    Naive implementation - stores like in memory
    """
    like_id = f"{post_id}_{user_id}"
    likes[like_id] = {
        'post_id': post_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    return likes[like_id]

def comment_on_photo(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    FR-3: Users can comment on photos
    Naive implementation - stores comment in memory
    """
    comments[comment_id] = {
        'id': comment_id,
        'post_id': post_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def search_users(query: str) -> List[Dict]:
    """
    FR-4: Users can search for other users
    Naive implementation - simple substring match on username
    """
    results = []
    for user in users.values():
        if query.lower() in user.get('username', '').lower():
            results.append(user)
    return results

def search_content(query: str) -> List[Dict]:
    """
    FR-4: Users can search for content
    Naive implementation - simple substring match on captions
    """
    results = []
    for post in posts.values():
        if query.lower() in post.get('caption', '').lower():
            results.append(post)
    return results
`,
};
