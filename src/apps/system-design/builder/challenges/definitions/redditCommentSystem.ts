import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit Comment System - Multi-layer Caching
 * From extracted-problems/system-design/caching.md
 */
export const redditCommentSystemProblemDefinition: ProblemDefinition = {
  id: 'reddit-comment-system',
  title: 'Reddit Comment System',
  description: `Design a Reddit-scale comment system that:
- Handles 5M reads/sec during normal operation and 50M reads/sec during viral events
- Implements multi-layer caching for hot content
- Provides hot-key protection for viral threads
- Handles cache stampede during failures
- Maintains sub-100ms P99 latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process comment read/write requests',
      },
      {
        type: 'storage',
        reason: 'Need to store comment data persistently',
      },
      {
        type: 'cache',
        reason: 'Need caching to handle high read load with 98% hit rate',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for static comment rendering',
      },
      {
        type: 'load_balancer',
        reason: 'Need to distribute traffic across thousands of app servers',
      },
      {
        type: 'message_queue',
        reason: 'Need async vote updates to handle write load',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Client sends requests through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes traffic to app servers',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN pulls rendered comments from app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache hot comment threads',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read/write comment data',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App servers publish vote updates to queue',
      },
    ],
    dataModel: {
      entities: ['comment', 'thread', 'vote', 'user'],
      fields: {
        comment: ['id', 'thread_id', 'parent_id', 'user_id', 'text', 'votes', 'created_at'],
        thread: ['id', 'title', 'comment_count', 'is_viral', 'created_at'],
        vote: ['comment_id', 'user_id', 'direction', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Reading comment threads
        { type: 'write', frequency: 'high' },             // Adding comments
        { type: 'write', frequency: 'very_high' },        // Vote counting
      ],
    },
  },

  scenarios: generateScenarios('reddit-comment-system', problemConfigs['reddit-comment-system']),

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
threads = {}
comments = {}
votes = {}
comment_cache = {}  # Simulates multi-layer caching

def create_thread(thread_id: str, title: str) -> Dict:
    """
    Create discussion thread
    Naive implementation - stores thread in memory
    """
    threads[thread_id] = {
        'id': thread_id,
        'title': title,
        'comment_count': 0,
        'is_viral': False,
        'created_at': datetime.now()
    }
    return threads[thread_id]

def add_comment(comment_id: str, thread_id: str, user_id: str, text: str,
                parent_id: str = None) -> Dict:
    """
    Add comment to thread (supports nested comments)
    Naive implementation - stores comment, invalidates cache
    """
    comments[comment_id] = {
        'id': comment_id,
        'thread_id': thread_id,
        'parent_id': parent_id,
        'user_id': user_id,
        'text': text,
        'votes': 0,
        'created_at': datetime.now()
    }

    # Update thread comment count
    thread = threads.get(thread_id)
    if thread:
        thread['comment_count'] += 1

    # Invalidate cache for this thread
    if thread_id in comment_cache:
        del comment_cache[thread_id]

    return comments[comment_id]

def get_thread_comments(thread_id: str) -> List[Dict]:
    """
    Read comment thread with multi-layer caching
    Naive implementation - checks cache first, then storage
    """
    # Check cache (hot-key protection for viral threads)
    if thread_id in comment_cache:
        return comment_cache[thread_id]['comments']

    # Cache miss - fetch from storage
    thread_comments = []
    for comment in comments.values():
        if comment['thread_id'] == thread_id:
            thread_comments.append(comment)

    # Sort by votes (descending)
    thread_comments.sort(key=lambda x: x['votes'], reverse=True)

    # Cache for future reads (98% hit rate simulation)
    comment_cache[thread_id] = {
        'comments': thread_comments,
        'cached_at': datetime.now()
    }

    return thread_comments

def vote_comment(vote_id: str, comment_id: str, user_id: str, direction: int) -> Dict:
    """
    Vote on comment (async via message queue)
    Naive implementation - updates vote count directly
    direction: 1 for upvote, -1 for downvote
    """
    votes[vote_id] = {
        'comment_id': comment_id,
        'user_id': user_id,
        'direction': direction,
        'created_at': datetime.now()
    }

    # Update comment vote count
    comment = comments.get(comment_id)
    if comment:
        comment['votes'] += direction

        # Invalidate cache for thread
        thread_id = comment['thread_id']
        if thread_id in comment_cache:
            del comment_cache[thread_id]

    return votes[vote_id]

def mark_thread_viral(thread_id: str) -> Dict:
    """
    Mark thread as viral for hot-key protection
    Naive implementation - sets viral flag
    """
    thread = threads.get(thread_id)
    if not thread:
        raise ValueError("Thread not found")

    thread['is_viral'] = True
    return thread

def clear_cache(thread_id: str = None) -> int:
    """
    Clear cache (for cache stampede handling)
    Naive implementation - removes from cache
    """
    if thread_id:
        if thread_id in comment_cache:
            del comment_cache[thread_id]
            return 1
        return 0
    else:
        count = len(comment_cache)
        comment_cache.clear()
        return count
`,
};
