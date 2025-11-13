import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Facebook - Social Networking Platform
 * Comprehensive FR and NFR scenarios
 */
export const facebookProblemDefinition: ProblemDefinition = {
  id: 'facebook',
  title: 'Facebook - Social Network',
  description: `Design a social networking platform like Facebook that:
- Users can create profiles and friend other users
- Users can post status updates, photos, and videos
- Users can see a news feed of friends' posts
- Users can like and comment on posts`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create profiles and friend other users',
    'Users can post status updates, photos, and videos',
    'Users can see a news feed of friends\' posts',
    'Users can like and comment on posts'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (posts, feed generation)',
      },
      {
        type: 'storage',
        reason: 'Need to store users, posts, friendships',
      },
      {
        type: 'object_storage',
        reason: 'Need to store photos and videos',
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
        reason: 'App server needs to read/write social data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve media',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'friendship', 'like', 'comment'],
      fields: {
        user: ['id', 'name', 'email', 'profile_photo_url', 'created_at'],
        post: ['id', 'user_id', 'content', 'media_url', 'created_at'],
        friendship: ['user_id_1', 'user_id_2', 'status', 'created_at'],
        like: ['post_id', 'user_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating posts
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing news feed
        { type: 'write_large_file', frequency: 'medium' }, // Uploading media
      ],
    },
  },

  scenarios: generateScenarios('facebook', problemConfigs.facebook),

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
friendships = {}
likes = {}
comments = {}

def create_profile(user_id: str, name: str, email: str) -> Dict:
    """
    FR-1: Users can create profiles
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'name': name,
        'email': email,
        'profile_photo_url': None,
        'created_at': datetime.now()
    }
    return users[user_id]

def add_friend(user_id_1: str, user_id_2: str) -> Dict:
    """
    FR-1: Users can friend other users
    Naive implementation - no friend request approval
    """
    friendship_id = f"{user_id_1}_{user_id_2}"
    friendships[friendship_id] = {
        'user_id_1': user_id_1,
        'user_id_2': user_id_2,
        'status': 'active',
        'created_at': datetime.now()
    }
    return friendships[friendship_id]

def create_post(post_id: str, user_id: str, content: str, media_url: str = None) -> Dict:
    """
    FR-2: Users can post status updates, photos, and videos
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'content': content,
        'media_url': media_url,
        'created_at': datetime.now()
    }
    return posts[post_id]

def get_news_feed(user_id: str) -> List[Dict]:
    """
    FR-3: Users can see a news feed of friends' posts
    Naive implementation - gets all posts from friends, no ranking
    """
    # Get all friends
    user_friends = []
    for friendship in friendships.values():
        if friendship['user_id_1'] == user_id:
            user_friends.append(friendship['user_id_2'])
        elif friendship['user_id_2'] == user_id:
            user_friends.append(friendship['user_id_1'])

    # Get all posts from friends
    feed = []
    for post in posts.values():
        if post['user_id'] in user_friends:
            feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed

def like_post(post_id: str, user_id: str) -> Dict:
    """
    FR-4: Users can like posts
    Naive implementation - stores like in memory
    """
    like_id = f"{post_id}_{user_id}"
    likes[like_id] = {
        'post_id': post_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    return likes[like_id]

def comment_on_post(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    FR-4: Users can comment on posts
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
`,
};
