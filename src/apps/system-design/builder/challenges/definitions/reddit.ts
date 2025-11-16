import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit - Discussion Forum Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Secondary Indexes for Ranking
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Secondary indexes for sorting by score
 *   - Index on (subreddit_id, score DESC, created_at DESC) for "Hot" feed
 *   - Index on (subreddit_id, created_at DESC) for "New" feed
 *   - Index on (subreddit_id, comment_count DESC) for "Top" feed
 * - Ch. 3: Covering indexes to avoid table lookups
 *   - Include (title, author_id, thumbnail) in index for feed queries
 * - Ch. 2: Adjacency list model for nested comments
 *   - parent_comment_id references parent in same table
 *   - Recursive queries to fetch comment trees
 *
 * Reddit's Ranking Algorithm (DDIA Ch. 3 - Custom Scoring):
 * - **Hot**: score = log10(upvotes - downvotes) + (created_at / 45000)
 *   - Balances vote count with recency
 *   - Older posts decay over time
 * - **Top**: Simple sort by score (upvotes - downvotes)
 * - **New**: Sort by created_at DESC
 *
 * Indexing Strategy (DDIA Ch. 3):
 * - Composite index: (subreddit_id, hot_score DESC) for hot feed
 * - Materialized view: Pre-compute hot_score on write
 * - Denormalize: Cache comment_count on posts table
 *
 * System Design Primer Concepts:
 * - Database Indexing: Use composite indexes for efficient sorting
 * - Caching: Cache top posts per subreddit in Redis (TTL: 5 minutes)
 */
export const redditProblemDefinition: ProblemDefinition = {
  id: 'reddit',
  title: 'Reddit - Discussion Forum',
  description: `Design a discussion forum like Reddit that:
- Users can create posts in different subreddits
- Users can comment on posts (nested comments)
- Users can upvote and downvote posts and comments
- Posts are ranked by votes and recency

Learning Objectives (DDIA Ch. 3):
1. Design secondary indexes for sorting/ranking (DDIA Ch. 3)
   - Composite index: (subreddit_id, score DESC, created_at DESC)
   - Covering index to avoid extra lookups
2. Implement custom ranking algorithms (DDIA Ch. 3)
   - Reddit's "Hot" algorithm: balance votes and time decay
3. Model nested comments with adjacency list (DDIA Ch. 2)
   - Recursive queries for comment trees
4. Optimize read-heavy workload with denormalization (DDIA Ch. 3)
   - Cache comment_count, score on posts table`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create posts in different subreddits',
    'Users can comment on posts (nested comments)',
    'Users can upvote and downvote posts and comments',
    'Posts are ranked by votes and recency'
  ],

  userFacingNFRs: [
    'Feed latency: p99 < 200ms for "Hot" feed (DDIA Ch. 3: Composite index)',
    'Sorting performance: Index scan, not table scan (DDIA Ch. 3: Secondary index)',
    'Comment tree query: < 100ms for 500 comments (DDIA Ch. 2: Adjacency list)',
    'Vote update: < 50ms with denormalized score (DDIA Ch. 3)',
    'Partitioning: Partition by subreddit for data locality (DDIA Ch. 6)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (post, comment, vote)',
      },
      {
        type: 'storage',
        reason: 'Need to store posts, comments, votes, users',
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
        reason: 'App server needs to read/write content',
      },
    ],
    dataModel: {
      entities: ['user', 'subreddit', 'post', 'comment', 'vote'],
      fields: {
        user: ['id', 'username', 'karma', 'created_at'],
        subreddit: ['id', 'name', 'description', 'created_at'],
        post: ['id', 'subreddit_id', 'user_id', 'title', 'content', 'score', 'created_at'],
        comment: ['id', 'post_id', 'parent_comment_id', 'user_id', 'text', 'score', 'created_at'],
        vote: ['id', 'target_id', 'target_type', 'user_id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating posts/comments
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing subreddit feed
      ],
    },
  },

  scenarios: generateScenarios('reddit', problemConfigs.reddit),

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
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
subreddits = {}
posts = {}
comments = {}
votes = {}

def create_post(post_id: str, subreddit_id: str, user_id: str, title: str, content: str) -> Dict:
    """
    FR-1: Users can create posts in different subreddits
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'subreddit_id': subreddit_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'score': 0,
        'created_at': datetime.now()
    }
    return posts[post_id]

def create_comment(comment_id: str, post_id: str, user_id: str, text: str, parent_comment_id: Optional[str] = None) -> Dict:
    """
    FR-2: Users can comment on posts (nested comments)
    Naive implementation - stores comment with optional parent
    """
    comments[comment_id] = {
        'id': comment_id,
        'post_id': post_id,
        'parent_comment_id': parent_comment_id,
        'user_id': user_id,
        'text': text,
        'score': 0,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def upvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': 1,  # +1 for upvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] += 1

    return votes[vote_id]

def downvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': -1,  # -1 for downvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] -= 1

    return votes[vote_id]

def upvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': 1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] += 1

    return votes[vote_id]

def downvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': -1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] -= 1

    return votes[vote_id]

def get_subreddit_feed(subreddit_id: str, sort_by: str = "hot") -> List[Dict]:
    """
    Helper: Get posts from a subreddit
    Naive implementation - simple sorting by score or time
    Real Reddit uses complex ranking algorithms
    """
    subreddit_posts = []
    for post in posts.values():
        if post['subreddit_id'] == subreddit_id:
            subreddit_posts.append(post)

    # Sort by score (hot) or time (new)
    if sort_by == "hot":
        subreddit_posts.sort(key=lambda x: x['score'], reverse=True)
    else:  # new
        subreddit_posts.sort(key=lambda x: x['created_at'], reverse=True)

    return subreddit_posts
`,
};
