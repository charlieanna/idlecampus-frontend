import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * LinkedIn - Professional Networking Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Multi-Faceted Search & Graph Indexing
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Multi-faceted job search with composite indexes
 *   - Index on (location, title, company, salary_range)
 *   - Support filtering by skills (array contains query)
 *   - Faceted search: "Show me jobs by location, then title"
 * - Ch. 3: Skills taxonomy indexing
 *   - Hierarchical skills: "JavaScript" → "Frontend" → "Web Development"
 *   - Skill graph for recommendations: "Users with Python also have Pandas"
 *   - Inverted index: skill → [user_ids with that skill]
 * - Ch. 3: Professional graph with adjacency lists
 *   - Index on (user_id) → [connection_ids, skills, companies]
 *   - 2nd-degree network queries (friend-of-friend for introductions)
 * - Ch. 3: Full-text search on profiles
 *   - Elasticsearch for searching by name, headline, summary, experience
 *   - Field boosting: name^3, headline^2, current_company^2
 *
 * Job Search Composite Index (DDIA Ch. 3):
 * Index on (location, job_function, seniority_level, posted_at DESC):
 * Query: "Software Engineer jobs in San Francisco, Senior level, posted last 7 days"
 * - location = "San Francisco"      (range filter on index)
 * - job_function = "Engineering"     (exact match on index)
 * - seniority_level = "Senior"       (exact match on index)
 * - posted_at >= NOW() - 7 days      (range filter on index)
 *
 * Skills Indexing (DDIA Ch. 3):
 * Inverted Index:
 * {
 *   "Python": [user_123, user_456, user_789],
 *   "Machine Learning": [user_123, user_789],
 *   "TensorFlow": [user_789]
 * }
 *
 * Skill Graph for Recommendations:
 * - Users with "Python" often have "Pandas" (co-occurrence analysis)
 * - Suggest "NumPy" to users with "Python" + "Pandas"
 *
 * Faceted Search Example (Elasticsearch):
 * {
 *   "query": {
 *     "bool": {
 *       "must": [
 *         {"match": {"title": "software engineer"}},
 *         {"term": {"location": "remote"}}
 *       ],
 *       "filter": [
 *         {"terms": {"skills": ["python", "aws"]}}
 *       ]
 *     }
 *   },
 *   "aggs": {
 *     "locations": {"terms": {"field": "location"}},
 *     "companies": {"terms": {"field": "company"}},
 *     "seniority": {"terms": {"field": "seniority_level"}}
 *   }
 * }
 *
 * System Design Primer Concepts:
 * - Search: Elasticsearch for job/profile search with facets
 * - Graph Database: Neo4j/TAO for professional network
 * - Caching: Redis for job search results, profile views
 */
export const linkedinProblemDefinition: ProblemDefinition = {
  id: 'linkedin',
  title: 'LinkedIn - Professional Network',
  description: `Design a professional networking platform like LinkedIn that:
- Users can create profiles with work experience
- Users can connect with other professionals
- Users can post updates and articles
- Users can search for jobs and people

Learning Objectives (DDIA Ch. 3):
1. Design multi-faceted job search (DDIA Ch. 3)
   - Composite index on (location, title, skills, posted_at)
   - Support filtering by multiple dimensions
   - Implement faceted search (show counts by category)
2. Build skills taxonomy indexing (DDIA Ch. 3)
   - Inverted index: skill → [user_ids]
   - Hierarchical skills graph for recommendations
3. Implement professional graph queries (DDIA Ch. 3)
   - 2nd-degree network (connections-of-connections)
   - Mutual connection count for introductions
4. Create profile full-text search (DDIA Ch. 3)
   - Search across name, headline, experience, skills
   - Field boosting for relevance ranking`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create profiles with work experience',
    'Users can connect with other professionals',
    'Users can post updates and articles',
    'Users can search for jobs and people'
  ],

  userFacingNFRs: [
    'Job search latency: p99 < 300ms (DDIA Ch. 3: Composite index + Elasticsearch)',
    'Faceted search: < 500ms with aggregations (DDIA Ch. 3: Elasticsearch facets)',
    'Profile search: p99 < 200ms (DDIA Ch. 3: Full-text with field boosting)',
    'Skills recommendations: < 1s (DDIA Ch. 3: Skill graph co-occurrence)',
    '2nd-degree network: < 2s (DDIA Ch. 3: BFS to depth 2)',
    'Job feed: < 400ms (DDIA Ch. 3: Index on skills + location + posted_at)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (profile updates, connections)',
      },
      {
        type: 'storage',
        reason: 'Need to store user profiles, connections, posts',
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
        reason: 'App server needs to read/write profile data',
      },
    ],
    dataModel: {
      entities: ['user', 'profile', 'connection', 'post', 'job'],
      fields: {
        user: ['id', 'email', 'password_hash', 'created_at'],
        profile: ['user_id', 'name', 'headline', 'summary', 'photo_url'],
        connection: ['user_id_1', 'user_id_2', 'status', 'created_at'],
        post: ['id', 'user_id', 'content', 'created_at'],
        job: ['id', 'company_id', 'title', 'description', 'location', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'low' },        // Updating profiles
        { type: 'read_by_key', frequency: 'high' }, // Viewing profiles
        { type: 'read_by_query', frequency: 'medium' }, // Job search
      ],
    },
  },

  scenarios: generateScenarios('linkedin', problemConfigs.linkedin),

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
profiles = {}
connections = {}
posts = {}
jobs = {}

def create_profile(user_id: str, name: str, headline: str, summary: str = "") -> Dict:
    """
    FR-1: Users can create profiles with work experience
    Naive implementation - stores profile in memory
    """
    profiles[user_id] = {
        'user_id': user_id,
        'name': name,
        'headline': headline,
        'summary': summary,
        'photo_url': None,
        'experience': [],  # Would contain work experience entries
        'education': [],   # Would contain education entries
        'skills': [],      # Would contain skills
        'created_at': datetime.now()
    }
    return profiles[user_id]

def add_work_experience(user_id: str, company: str, title: str, start_date: str, end_date: str = None) -> Dict:
    """
    FR-1: Add work experience to profile
    Naive implementation - appends to experience list
    """
    if user_id not in profiles:
        return None

    experience = {
        'company': company,
        'title': title,
        'start_date': start_date,
        'end_date': end_date,
        'current': end_date is None
    }
    profiles[user_id]['experience'].append(experience)
    return profiles[user_id]

def connect_with_professional(user_id_1: str, user_id_2: str) -> Dict:
    """
    FR-2: Users can connect with other professionals
    Naive implementation - creates connection immediately
    In real system, this would send connection request
    """
    connection_id = f"{user_id_1}_{user_id_2}"
    connections[connection_id] = {
        'user_id_1': user_id_1,
        'user_id_2': user_id_2,
        'status': 'connected',
        'created_at': datetime.now()
    }
    return connections[connection_id]

def create_post(post_id: str, user_id: str, content: str) -> Dict:
    """
    FR-3: Users can post updates
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'content': content,
        'type': 'update',
        'likes': 0,
        'comments': [],
        'created_at': datetime.now()
    }
    return posts[post_id]

def create_article(post_id: str, user_id: str, title: str, content: str) -> Dict:
    """
    FR-3: Users can post articles
    Naive implementation - stores article as special post type
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'type': 'article',
        'likes': 0,
        'comments': [],
        'created_at': datetime.now()
    }
    return posts[post_id]

def search_jobs(query: str = None, location: str = None) -> List[Dict]:
    """
    FR-4: Users can search for jobs
    Naive implementation - simple substring match
    """
    results = []
    for job in jobs.values():
        if query and query.lower() not in job.get('title', '').lower():
            continue
        if location and location.lower() not in job.get('location', '').lower():
            continue
        results.append(job)
    return results

def search_people(query: str) -> List[Dict]:
    """
    FR-4: Users can search for people
    Naive implementation - simple substring match on name
    """
    results = []
    for profile in profiles.values():
        if query.lower() in profile.get('name', '').lower():
            results.append(profile)
    return results

def get_network_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get posts from connections
    Naive implementation - returns posts from connections
    """
    # Get all connections
    connected_users = []
    for conn in connections.values():
        if conn['user_id_1'] == user_id:
            connected_users.append(conn['user_id_2'])
        elif conn['user_id_2'] == user_id:
            connected_users.append(conn['user_id_1'])

    # Get posts from connections
    feed = []
    for post in posts.values():
        if post['user_id'] in connected_users:
            feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]
`,
};
