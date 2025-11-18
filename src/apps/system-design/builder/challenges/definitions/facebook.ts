import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Facebook - Social Networking Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Social Graph Indexing
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Graph database for social connections
 *   - Adjacency list representation: user_id → [friend_ids]
 *   - Efficient friend lookups: O(1) for "get friends"
 *   - Graph traversal for friend suggestions (BFS to depth 2)
 * - Ch. 3: Composite indexes for news feed generation
 *   - Index on (user_id, created_at DESC) for "posts by friends"
 *   - Index on (post_id, engagement_score DESC) for ranking
 *   - Denormalize friend_count for fast profile queries
 * - Ch. 3: Secondary indexes for filtering
 *   - Index on (author_id, post_type, created_at) for user timeline
 *   - Index on (location, created_at) for local posts
 * - Ch. 3: Full-text search on posts
 *   - Elasticsearch for searching posts, comments, profiles
 *
 * Social Graph Storage (DDIA Ch. 3):
 * Adjacency List (Fast Friend Lookups):
 * friendships: {
 *   user_123: [user_456, user_789, user_101],
 *   user_456: [user_123, user_999]
 * }
 *
 * Edge List (Good for Analytics):
 * edges: [
 *   {from: user_123, to: user_456, created_at: "2024-01-01"},
 *   {from: user_123, to: user_789, created_at: "2024-01-02"}
 * ]
 *
 * Friend Suggestion Algorithm (DDIA Ch. 3 - Graph Traversal):
 * 1. BFS to depth 2 from user_123
 * 2. Find friends-of-friends not already connected
 * 3. Rank by mutual friend count
 * Example:
 *   user_123 → [user_456, user_789]
 *   user_456 → [user_123, user_999]  (user_999 is suggestion: 1 mutual)
 *   user_789 → [user_123, user_999]  (user_999 is suggestion: 2 mutual)
 *
 * News Feed Index (DDIA Ch. 3):
 * Index on (friend_id, created_at DESC):
 * - For user_123 with 500 friends, query 500 friend timelines
 * - Merge-sort by created_at (like merge phase of merge sort)
 * - Return top 50 posts
 *
 * Trade-off: Fan-out on read (DDIA Ch. 1):
 * - Read-time: Query all friend timelines at feed generation
 * - Pros: Fast writes, always fresh data
 * - Cons: Slower reads for users with many friends
 *
 * System Design Primer Concepts:
 * - Graph Database: TAO (Facebook's graph store) for social graph
 * - Caching: Memcached for friend lists, user profiles
 * - CDN: Media distribution (photos, videos)
 */
export const facebookProblemDefinition: ProblemDefinition = {
  id: 'facebook',
  title: 'Facebook - Social Network',
  description: `Design a social networking platform like Facebook that:
- Users can create profiles and friend other users
- Users can post status updates, photos, and videos
- Users can see a news feed of friends' posts
- Users can like and comment on posts

Learning Objectives (DDIA Ch. 3):
1. Design social graph storage with adjacency lists (DDIA Ch. 3)
   - Efficient friend lookups: O(1) to get all friends
   - Graph traversal for friend suggestions (BFS)
2. Create composite indexes for news feed (DDIA Ch. 3)
   - Index on (friend_id, created_at DESC) for timeline merge
   - Merge-sort friend timelines for feed generation
3. Implement graph queries (DDIA Ch. 3)
   - Find mutual friends (set intersection)
   - BFS to depth 2 for friend suggestions
4. Denormalize for performance (DDIA Ch. 3)
   - Pre-compute friend_count, post_count on profiles
   - Cache friend lists in Memcached`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create profiles and friend other users',
    'Users can post status updates, photos, and videos',
    'Users can see a news feed of friends\' posts',
    'Users can like and comment on posts'
  ],

  userFacingNFRs: [
    'Friend lookup: p99 < 50ms (DDIA Ch. 3: Adjacency list with index)',
    'News feed generation: p99 < 500ms (DDIA Ch. 3: Fan-out on read with merge-sort)',
    'Friend suggestions: < 1s (DDIA Ch. 3: BFS to depth 2)',
    'Post search: p99 < 300ms (DDIA Ch. 3: Elasticsearch on post content)',
    'Profile load: p99 < 100ms (SDP: Memcached for denormalized profiles)',
    'Media CDN: > 90% cache hit ratio (SDP: CloudFront for photos/videos)',
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
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
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

// Auto-generate code challenges from functional requirements
(facebookProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(facebookProblemDefinition);
