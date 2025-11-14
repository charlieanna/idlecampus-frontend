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
from typing import List, Dict, Optional, Any

# ===========================================
# 📦 STORAGE API (PROVIDED)
# ===========================================
# In-memory storage (simulates production database/cache)
storage = {}

def store(key: str, value: Any) -> bool:
    """Store a key-value pair in memory."""
    storage[key] = value
    return True

def retrieve(key: str) -> Optional[Any]:
    """Retrieve a value by key."""
    return storage.get(key)

def exists(key: str) -> bool:
    """Check if a key exists in storage."""
    return key in storage

# ===========================================
# 🚀 YOUR IMPLEMENTATION
# ===========================================

def upload_photo(post_id: str, user_id: str, image_url: str, caption: str = "") -> Dict:
    """
    FR-1: Users can upload photos and videos
    Store post metadata using the storage API
    """
    post = {
        'id': post_id,
        'user_id': user_id,
        'image_url': image_url,
        'caption': caption,
        'created_at': datetime.now()
    }
    store(f"post:{post_id}", post)

    # Add to user's posts list
    user_posts_key = f"user_posts:{user_id}"
    user_posts = retrieve(user_posts_key) or []
    user_posts.append(post_id)
    store(user_posts_key, user_posts)

    return post

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow other users (helper for feed)
    Store follow relationship using the storage API
    """
    follow_key = f"follow:{follower_id}:{following_id}"
    follow = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    store(follow_key, follow)

    # Update follower's following list
    following_key = f"following:{follower_id}"
    following_list = retrieve(following_key) or []
    if following_id not in following_list:
        following_list.append(following_id)
        store(following_key, following_list)

    return follow

def get_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Users can view a feed of photos from people they follow
    Returns posts from followed users, sorted by recency
    """
    # Get list of users this user follows
    following_key = f"following:{user_id}"
    following = retrieve(following_key) or []

    # Collect all posts from followed users
    feed = []
    for followed_user_id in following:
        user_posts_key = f"user_posts:{followed_user_id}"
        post_ids = retrieve(user_posts_key) or []
        for post_id in post_ids:
            post = retrieve(f"post:{post_id}")
            if post:
                feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]

def like_photo(post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like photos
    Store like using the storage API
    """
    like_key = f"like:{post_id}:{user_id}"
    like = {
        'post_id': post_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    store(like_key, like)

    # Update post's likes count
    likes_count_key = f"likes_count:{post_id}"
    count = retrieve(likes_count_key) or 0
    store(likes_count_key, count + 1)

    return like

def comment_on_photo(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    FR-3: Users can comment on photos
    Store comment using the storage API
    """
    comment = {
        'id': comment_id,
        'post_id': post_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    store(f"comment:{comment_id}", comment)

    # Add comment to post's comment list
    post_comments_key = f"post_comments:{post_id}"
    comments_list = retrieve(post_comments_key) or []
    comments_list.append(comment_id)
    store(post_comments_key, comments_list)

    return comment

def search_users(query: str) -> List[Dict]:
    """
    FR-4: Users can search for other users
    Search through stored users by username
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all user keys
    for key in storage.keys():
        if key.startswith("user:"):
            user = retrieve(key)
            if user and query.lower() in user.get('username', '').lower():
                results.append(user)
    return results

def search_content(query: str) -> List[Dict]:
    """
    FR-4: Users can search for content
    Search through stored posts by caption
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all post keys
    for key in storage.keys():
        if key.startswith("post:"):
            post = retrieve(key)
            if post and query.lower() in post.get('caption', '').lower():
                results.append(post)
    return results
`,
};
