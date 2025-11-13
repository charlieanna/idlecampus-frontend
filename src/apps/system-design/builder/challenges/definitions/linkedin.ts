import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * LinkedIn - Professional Networking Platform
 * Comprehensive FR and NFR scenarios
 */
export const linkedinProblemDefinition: ProblemDefinition = {
  id: 'linkedin',
  title: 'LinkedIn - Professional Network',
  description: `Design a professional networking platform like LinkedIn that:
- Users can create profiles with work experience
- Users can connect with other professionals
- Users can post updates and articles
- Users can search for jobs and people`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create profiles with work experience',
    'Users can connect with other professionals',
    'Users can post updates and articles',
    'Users can search for jobs and people'
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
