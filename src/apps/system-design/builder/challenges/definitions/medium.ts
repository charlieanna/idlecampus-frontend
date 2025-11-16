import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Medium - Blogging Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Full-text Search for Articles
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Full-text search with Elasticsearch
 *   - Inverted index for article content, title, subtitle
 *   - Analyze text: tokenization, stemming, stop word removal
 *   - Relevance ranking with BM25 (better than TF-IDF for long documents)
 * - Ch. 3: Secondary indexes for filtering
 *   - Index on (author_id, published_at DESC) for author's articles
 *   - Index on (topic_id, claps DESC) for topic ranking
 * - Ch. 3: Read-time estimation index
 *   - Pre-compute read_time based on word count
 *   - Index on (read_time, quality_score) for "quick reads"
 *
 * Full-Text Search Example (Elasticsearch):
 * {
 *   "query": {
 *     "bool": {
 *       "must": [
 *         {"multi_match": {
 *           "query": "machine learning tutorial",
 *           "fields": ["title^3", "subtitle^2", "content"]
 *         }}
 *       ],
 *       "filter": [
 *         {"range": {"read_time": {"lte": 10}}},
 *         {"term": {"topic": "technology"}}
 *       ]
 *     }
 *   },
 *   "sort": [{"_score": "desc"}, {"claps": "desc"}]
 * }
 *
 * BM25 vs TF-IDF (DDIA Ch. 3):
 * - BM25 handles document length better (long articles don't dominate)
 * - Saturates term frequency (diminishing returns for repeated terms)
 * - Better for articles with varying lengths
 *
 * System Design Primer Concepts:
 * - Search: Elasticsearch for article full-text search
 * - Caching: Redis for trending articles cache
 */
export const mediumProblemDefinition: ProblemDefinition = {
  id: 'medium',
  title: 'Medium - Blogging Platform',
  description: `Design a blogging platform like Medium that:
- Users can write and publish articles
- Users can follow authors and topics
- Users can clap (like) and comment on articles
- Articles are ranked by popularity and engagement

Learning Objectives (DDIA Ch. 3):
1. Implement full-text search with Elasticsearch (DDIA Ch. 3)
   - Use BM25 ranking for article relevance
   - Text analysis: tokenization, stemming, synonyms
2. Design secondary indexes for filtering (DDIA Ch. 3)
   - Index on (author_id, published_at) for chronological feed
3. Optimize read-heavy workload (DDIA Ch. 3)
   - Denormalize clap count on articles table
4. Handle long-form content search (DDIA Ch. 3)
   - BM25 handles document length better than TF-IDF`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can write and publish articles',
    'Users can follow authors and topics',
    'Users can clap (like) and comment on articles',
    'Articles are ranked by popularity and engagement'
  ],

  userFacingNFRs: [
    'Search latency: p99 < 400ms (DDIA Ch. 3: Elasticsearch with BM25)',
    'Article ranking: BM25 for long-form content (DDIA Ch. 3)',
    'Feed generation: < 200ms (DDIA Ch. 3: Secondary index on author_id)',
    'Trending articles: < 100ms (SDP: Redis cache with TTL)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process article creation and reading',
      },
      {
        type: 'storage',
        reason: 'Need to store articles, users, claps, comments',
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
        reason: 'App server needs to read/write article data',
      },
    ],
    dataModel: {
      entities: ['user', 'article', 'clap', 'comment', 'follow'],
      fields: {
        user: ['id', 'username', 'email', 'bio', 'avatar_url', 'created_at'],
        article: ['id', 'author_id', 'title', 'content', 'tags', 'published_at', 'read_time'],
        clap: ['article_id', 'user_id', 'count', 'created_at'],
        comment: ['id', 'article_id', 'user_id', 'text', 'created_at'],
        follow: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'low' },        // Publishing articles
        { type: 'read_by_key', frequency: 'very_high' }, // Reading articles
        { type: 'read_by_query', frequency: 'high' }, // Browsing feed
      ],
    },
  },

  scenarios: generateScenarios('medium', problemConfigs.medium),

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
articles = {}
claps = {}
comments = {}
follows = {}

def write_article(article_id: str, author_id: str, title: str, content: str,
                  tags: List[str] = None) -> Dict:
    """
    FR-1: Users can write articles
    Naive implementation - stores article in memory
    """
    articles[article_id] = {
        'id': article_id,
        'author_id': author_id,
        'title': title,
        'content': content,
        'tags': tags or [],
        'published_at': datetime.now(),
        'read_time': len(content) // 200  # Rough estimate: 200 words/min
    }
    return articles[article_id]

def publish_article(article_id: str) -> Dict:
    """
    FR-1: Users can publish articles
    Naive implementation - sets published status
    """
    article = articles.get(article_id)
    if not article:
        raise ValueError("Article not found")

    article['status'] = 'published'
    article['published_at'] = datetime.now()
    return article

def follow_author(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow authors
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_{following_id}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'type': 'author',
        'created_at': datetime.now()
    }
    return follows[follow_id]

def follow_topic(follower_id: str, topic: str) -> Dict:
    """
    FR-2: Users can follow topics
    Naive implementation - stores topic follow
    """
    follow_id = f"{follower_id}_topic_{topic}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'topic': topic,
        'type': 'topic',
        'created_at': datetime.now()
    }
    return follows[follow_id]

def clap_article(article_id: str, user_id: str, count: int = 1) -> Dict:
    """
    FR-3: Users can clap (like) articles
    Naive implementation - stores or updates clap count
    """
    clap_id = f"{article_id}_{user_id}"
    if clap_id in claps:
        claps[clap_id]['count'] += count
    else:
        claps[clap_id] = {
            'article_id': article_id,
            'user_id': user_id,
            'count': count,
            'created_at': datetime.now()
        }
    return claps[clap_id]

def comment_on_article(comment_id: str, article_id: str, user_id: str,
                       text: str) -> Dict:
    """
    FR-3: Users can comment on articles
    Naive implementation - stores comment in memory
    """
    comments[comment_id] = {
        'id': comment_id,
        'article_id': article_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def get_article_claps(article_id: str) -> int:
    """
    Helper: Get total claps for an article
    Naive implementation - sums all claps
    """
    total = 0
    for clap in claps.values():
        if clap['article_id'] == article_id:
            total += clap['count']
    return total
`,
};
