import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Basic RDBMS Design - Blog Database
 * From extracted-problems/system-design/storage.md
 */
export const basicDatabaseDesignProblemDefinition: ProblemDefinition = {
  id: 'basic-database-design',
  title: 'Basic RDBMS Design',
  description: `Design a relational database for a blog platform that:
- Stores users, posts, and comments with normalization
- Supports tags, categories, and user relationships
- Enables full-text search on posts
- Handles 10k reads/sec and 1k writes/sec
- Uses read replicas for scaling reads`,

  userFacingFRs: [
    '**POST /api/users** - Register new user with username and email',
    '**POST /api/posts** - Create new blog post with title, content, and tags',
    '**GET /api/posts/:id** - View a specific blog post (increments view count)',
    '**GET /api/posts** - List recent posts (paginated)',
    '**POST /api/posts/:id/comments** - Add comment to a post',
    '**GET /api/posts/:id/comments** - Get all comments for a post',
    '**POST /api/users/:id/follow** - Follow another user',
    '**GET /api/search/posts?q=keyword** - Full-text search for posts by keyword',
    '**GET /api/tags/:name/posts** - Get all posts with a specific tag',
  ],

  userFacingNFRs: [
    '**Read Performance**: < 100ms p95 for viewing posts (10,000 reads/sec)',
    '**Write Performance**: < 200ms p95 for creating posts/comments (1,000 writes/sec)',
    '**Search Performance**: < 500ms p95 for full-text search queries',
    '**Database Design**: Properly normalized schema (3NF) with appropriate indexes',
    '**Scalability**: Use read replicas to handle read-heavy traffic (90% reads, 10% writes)',
    '**Cache Strategy**: Cache frequently viewed posts and query results',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to handle API requests',
      },
      {
        type: 'storage',
        reason: 'Need primary database for writes',
      },
      {
        type: 'storage',
        reason: 'Need read replicas to scale reads',
      },
      {
        type: 'cache',
        reason: 'Need query cache to reduce DB load',
      },
      {
        type: 'load_balancer',
        reason: 'Need to distribute API traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users access blog through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to blog API servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache query results',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read/write to database',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'comment', 'tag', 'follower'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'title', 'content', 'view_count', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        tag: ['id', 'name'],
        follower: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing posts
        { type: 'read_by_query', frequency: 'high' },    // Searching posts
        { type: 'write', frequency: 'medium' },          // Creating posts
      ],
    },
  },

  scenarios: generateScenarios('basic-database-design', problemConfigs['basic-database-design']),

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
comments = {}
tags = {}
followers = {}
post_tags = {}

def create_user(user_id: str, username: str, email: str) -> Dict:
    """
    Create user - Basic CRUD operation
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'username': username,
        'email': email,
        'created_at': datetime.now()
    }
    return users[user_id]

def create_post(post_id: str, user_id: str, title: str, content: str,
                tag_names: List[str] = None) -> Dict:
    """
    Create blog post with tags
    Naive implementation - stores post and tag relationships
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'view_count': 0,
        'created_at': datetime.now()
    }

    # Add tags
    if tag_names:
        for tag_name in tag_names:
            # Create tag if doesn't exist
            tag_id = tag_name.lower()
            if tag_id not in tags:
                tags[tag_id] = {'id': tag_id, 'name': tag_name}

            # Link post to tag
            post_tags[f"{post_id}_{tag_id}"] = {
                'post_id': post_id,
                'tag_id': tag_id
            }

    return posts[post_id]

def add_comment(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    Add comment to post
    Naive implementation - stores comment
    """
    comments[comment_id] = {
        'id': comment_id,
        'post_id': post_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    Follow another user
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_{following_id}"
    followers[follow_id] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    return followers[follow_id]

def search_posts(query: str) -> List[Dict]:
    """
    Full-text search on posts
    Naive implementation - simple text matching in title/content
    """
    results = []
    query_lower = query.lower()
    for post in posts.values():
        if query_lower in post['title'].lower() or query_lower in post['content'].lower():
            results.append(post)
    return results

def get_posts_by_tag(tag_name: str) -> List[Dict]:
    """
    Get posts by tag
    Naive implementation - iterates through post_tags
    """
    tag_id = tag_name.lower()
    tagged_posts = []
    for pt in post_tags.values():
        if pt['tag_id'] == tag_id:
            post = posts.get(pt['post_id'])
            if post:
                tagged_posts.append(post)
    return tagged_posts
`,
};

// Auto-generate code challenges from functional requirements
(basicDatabaseDesignProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicDatabaseDesignProblemDefinition);
