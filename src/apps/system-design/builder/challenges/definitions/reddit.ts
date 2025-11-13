import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit - Discussion Forum Platform
 * Comprehensive FR and NFR scenarios
 */
export const redditProblemDefinition: ProblemDefinition = {
  id: 'reddit',
  title: 'Reddit - Discussion Forum',
  description: `Design a discussion forum like Reddit that:
- Users can create posts in different subreddits
- Users can comment on posts (nested comments)
- Users can upvote and downvote posts and comments
- Posts are ranked by votes and recency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create posts in different subreddits',
    'Users can comment on posts (nested comments)',
    'Users can upvote and downvote posts and comments'
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
