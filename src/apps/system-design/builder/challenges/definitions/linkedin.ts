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
 * LinkedIn - Professional Networking Platform
 * DDIA Ch. 10 (Batch Processing) - "People You May Know" via MapReduce Graph Analysis
 *
 * DDIA Concepts Applied:
 * - Ch. 10: MapReduce for "People You May Know" (PYMK) recommendations
 *   - Analyze 800M user connection graph to find 2nd-degree connections
 *   - Batch process: Count mutual connections for friend-of-friend
 *   - Rank by mutual connection count + shared skills/companies
 * - Ch. 10: Batch job recommendations with collaborative filtering
 *   - MapReduce: Match user skills/experience with job requirements
 *   - Content-based filtering: Skills similarity (Jaccard/cosine)
 *   - Hybrid: Combine content-based + collaborative signals
 * - Ch. 10: Skills co-occurrence analysis via MapReduce
 *   - Build skill graph: "Users with Python also have Pandas, NumPy"
 *   - Recommend skills to add based on user's current skills
 *   - Identify emerging skill trends (year-over-year growth)
 * - Ch. 10: Network analytics batch jobs
 *   - PageRank for professional influence scores
 *   - Community detection: Find industry clusters
 *   - Connection strength: Interaction frequency + profile similarity
 * - Ch. 10: ETL pipeline for data warehouse
 *   - Join users + jobs + companies + interactions for analytics
 *   - Star schema: fact_job_applications, dim_users, dim_jobs, dim_companies
 *   - OLAP: "Top hiring companies in AI by month"
 *
 * "People You May Know" with MapReduce (DDIA Ch. 10):
 * Problem: Find friend-of-friend recommendations for 800M users
 *
 * Graph Structure:
 * - User A → [B, C, D] (A is connected to B, C, D)
 * - User B → [A, E, F] (B is connected to A, E, F)
 * - Goal: Recommend E and F to user A (mutual connection: B)
 *
 * MapReduce Job 1: Find 2nd-Degree Connections
 * Input: Connection graph (user_id → [connection_ids])
 *
 * Map phase:
 * def map(user_id, connections):
 *     # For each connection, emit potential PYMK candidates
 *     for connection_id in connections:
 *         # Emit: (user_id, connection_id) to find their network
 *         emit(connection_id, user_id)
 *
 * Reduce phase:
 * def reduce(pivot_user, users_connected_to_pivot):
 *     # All users in 'users_connected_to_pivot' are 2nd-degree to each other
 *     # Example: pivot_user = B, users = [A, E, F]
 *     # → Recommend E,F to A; Recommend A to E,F
 *     for user_i in users_connected_to_pivot:
 *         for user_j in users_connected_to_pivot:
 *             if user_i != user_j:
 *                 emit((user_i, user_j), pivot_user)  # pivot is mutual connection
 *
 * MapReduce Job 2: Count Mutual Connections & Rank
 * Input: Candidate pairs from Job 1 with mutual connections
 *
 * Map phase:
 * def map(user_pair, mutual_connection):
 *     (user_i, user_j) = user_pair
 *     emit((user_i, user_j), 1)  # Count mutual connections
 *
 * Reduce phase:
 * def reduce(user_pair, counts):
 *     (user_i, user_j) = user_pair
 *     mutual_count = sum(counts)  # Number of mutual connections
 *     # Filter: Only recommend if >= 2 mutual connections
 *     if mutual_count >= 2:
 *         emit(user_i, (user_j, mutual_count))
 *
 * MapReduce Job 3: Enrich with Shared Skills/Companies
 * Input: PYMK candidates from Job 2 + user profiles
 *
 * Map phase:
 * def map(user_id, profile):
 *     # Broadcast user profile to join with PYMK candidates
 *     emit(user_id, profile)
 *
 * Reduce phase:
 * def reduce(user_id, values):
 *     profile = None
 *     pymk_candidates = []
 *     for value in values:
 *         if value.type == 'profile':
 *             profile = value
 *         else:
 *             pymk_candidates.append(value)
 *
 *     # Calculate similarity scores
 *     for (candidate_id, mutual_count) in pymk_candidates:
 *         candidate_profile = load_profile(candidate_id)
 *         shared_skills = profile.skills & candidate_profile.skills  # Set intersection
 *         shared_companies = profile.companies & candidate_profile.companies
 *
 *         # Scoring: mutual_count × 10 + shared_skills × 5 + shared_companies × 3
 *         score = mutual_count * 10 + len(shared_skills) * 5 + len(shared_companies) * 3
 *         emit(user_id, (candidate_id, score))
 *
 * Final Output: Top 50 PYMK recommendations per user, sorted by score
 *
 * Job Recommendations via Batch CF (DDIA Ch. 10):
 * Goal: Recommend relevant jobs to 800M users based on skills + experience
 *
 * MapReduce Job 1: Build User-Skill Matrix
 * Input: User profiles (user_id, [skills], seniority, location)
 *
 * Map phase:
 * def map(user_id, profile):
 *     for skill in profile.skills:
 *         emit(skill, (user_id, profile.seniority, profile.location))
 *
 * Reduce phase:
 * def reduce(skill, users):
 *     # Group users by skill for collaborative filtering
 *     emit(skill, list(users))
 *
 * MapReduce Job 2: Match Jobs with Users
 * Input: Job postings (job_id, required_skills, location, seniority) + User-skill index
 *
 * Map phase:
 * def map(job_id, job):
 *     for required_skill in job.required_skills:
 *         # Find users with this skill
 *         users_with_skill = skill_index[required_skill]
 *         for (user_id, seniority, location) in users_with_skill:
 *             # Filter by location and seniority
 *             if location_match(job.location, location) and seniority_match(job.seniority, seniority):
 *                 emit(user_id, (job_id, 1))  # Candidate job
 *
 * Reduce phase:
 * def reduce(user_id, job_candidates):
 *     # Aggregate: Count skill matches per job
 *     job_scores = {}
 *     for (job_id, match_count) in job_candidates:
 *         job_scores[job_id] = job_scores.get(job_id, 0) + match_count
 *     # Sort by score (number of matching skills)
 *     top_jobs = sorted(job_scores.items(), key=lambda x: x[1], reverse=True)[:20]
 *     emit(user_id, top_jobs)  # Top 20 job recommendations
 *
 * Skills Co-Occurrence Analysis (DDIA Ch. 10):
 * Goal: Build skill graph to recommend related skills
 *
 * MapReduce Job: Compute Skill Co-Occurrence
 * Input: User profiles (user_id, [skills])
 *
 * Map phase:
 * def map(user_id, skills):
 *     # Emit all pairs of skills this user has
 *     for skill_i in skills:
 *         for skill_j in skills:
 *             if skill_i < skill_j:  # Avoid duplicates
 *                 emit((skill_i, skill_j), 1)
 *
 * Reduce phase:
 * def reduce(skill_pair, counts):
 *     co_occurrence = sum(counts)
 *     # Example: ("Python", "Pandas") → 5,000,000 users have both
 *     emit(skill_pair, co_occurrence)
 *
 * Skill Recommendations:
 * User has ["Python", "NumPy"]
 * Look up co-occurrences:
 * - ("Python", "Pandas") → 5M users → Recommend "Pandas"
 * - ("Python", "TensorFlow") → 2M users → Recommend "TensorFlow"
 * - ("NumPy", "Matplotlib") → 3M users → Recommend "Matplotlib"
 *
 * PageRank for Influence Scores (DDIA Ch. 10):
 * Goal: Compute professional influence scores for 800M users
 *
 * Iterative MapReduce (10 iterations for convergence):
 *
 * Map phase (iteration i):
 * def map(user_id, (connections, pagerank_score)):
 *     num_connections = len(connections)
 *     for connection_id in connections:
 *         # Distribute current PageRank to connections
 *         emit(connection_id, pagerank_score / num_connections)
 *     # Also emit self to preserve connection list
 *     emit(user_id, connections)
 *
 * Reduce phase:
 * def reduce(user_id, values):
 *     connections = None
 *     pagerank_sum = 0
 *     for value in values:
 *         if isinstance(value, list):
 *             connections = value
 *         else:
 *             pagerank_sum += value
 *     # PageRank formula: 0.15 + 0.85 × pagerank_sum
 *     new_pagerank = 0.15 + 0.85 * pagerank_sum
 *     emit(user_id, (connections, new_pagerank))
 *
 * ETL for Data Warehouse (DDIA Ch. 10):
 * Goal: Join users, jobs, companies for business analytics
 *
 * Sort-Merge Join: Job Applications + User Profiles + Companies
 * Input A: Job applications (application_id, user_id, job_id, company_id, timestamp)
 * Input B: Users (user_id, skills, seniority, location)
 * Input C: Companies (company_id, name, industry, size)
 *
 * Map phase:
 * - Partition all inputs by user_id (for user join) then by company_id
 * - Tag records with source (applications / users / companies)
 *
 * Reduce phase:
 * def reduce(key, values):
 *     applications = []
 *     user_profile = None
 *     company_info = None
 *     for value in values:
 *         if value.source == 'applications':
 *             applications.append(value)
 *         elif value.source == 'users':
 *             user_profile = value
 *         elif value.source == 'companies':
 *             company_info = value
 *     # Join: Enrich applications with user and company data
 *     for app in applications:
 *         enriched = {**app, **user_profile, **company_info}
 *         emit(app.application_id, enriched)
 *
 * Output: Star schema fact table for OLAP
 * - fact_job_applications (application_id, user_id, job_id, company_id, timestamp, outcome)
 * - dim_users (user_id, seniority, skills, location)
 * - dim_jobs (job_id, title, required_skills, seniority_level)
 * - dim_companies (company_id, name, industry, employee_count)
 *
 * OLAP Query: "Top 10 companies hiring AI engineers in 2024"
 * SELECT company_name, COUNT(*) as hires
 * FROM fact_job_applications
 * JOIN dim_jobs ON fact_job_applications.job_id = dim_jobs.job_id
 * JOIN dim_companies ON fact_job_applications.company_id = dim_companies.company_id
 * WHERE dim_jobs.required_skills LIKE '%AI%'
 *   AND YEAR(timestamp) = 2024
 *   AND outcome = 'hired'
 * GROUP BY company_name
 * ORDER BY hires DESC
 * LIMIT 10;
 *
 * System Design Primer Concepts:
 * - MapReduce: Hadoop/Spark for graph analysis and recommendations
 * - HDFS: Distributed storage for 800M user profiles
 * - Airflow: Orchestrate PYMK → Job Recs → Skills Analysis DAG
 * - Data Warehouse: Snowflake for business intelligence queries
 */
export const linkedinProblemDefinition: ProblemDefinition = {
  id: 'linkedin',
  title: 'LinkedIn - Professional Network',
  description: `Design a professional networking platform like LinkedIn that:
- Users can create profiles with work experience
- Users can connect with other professionals
- Users can post updates and articles
- Users can search for jobs and people

Learning Objectives (DDIA Ch. 10):
1. Implement "People You May Know" via MapReduce (DDIA Ch. 10)
   - Graph analysis: Find 2nd-degree connections (friend-of-friend)
   - Count mutual connections and rank candidates
   - Enrich with shared skills and companies for scoring
2. Build batch job recommendations with collaborative filtering (DDIA Ch. 10)
   - MapReduce: Match user skills with job requirements
   - Content-based filtering: Skills similarity (Jaccard)
   - Hybrid scoring: Skills + location + seniority match
3. Compute skills co-occurrence analysis (DDIA Ch. 10)
   - MapReduce: Build skill graph "Python → Pandas, NumPy"
   - Recommend related skills to users
   - Identify emerging skill trends
4. Implement PageRank for influence scores (DDIA Ch. 10)
   - Iterative MapReduce (10 iterations for convergence)
   - Distribute scores across connection graph
   - Rank users by professional influence
5. Design ETL pipeline for data warehouse (DDIA Ch. 10)
   - Sort-merge join: Applications + Users + Companies
   - Star schema for OLAP analytics
   - Business intelligence queries on hiring trends`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create profiles with work experience',
    'Users can connect with other professionals',
    'Users can post updates and articles',
    'Users can search for jobs and people'
  ],

  userFacingNFRs: [
    'PYMK batch: Process 800M users overnight (DDIA Ch. 10: MapReduce graph analysis for 2nd-degree)',
    'Job recommendations: Match 800M users to 20M jobs in < 4 hours (DDIA Ch. 10: Batch CF MapReduce)',
    'Skills co-occurrence: Build skill graph in < 2 hours (DDIA Ch. 10: MapReduce pairwise analysis)',
    'PageRank: Converge in 10 iterations, < 6 hours (DDIA Ch. 10: Iterative MapReduce)',
    'ETL throughput: Process 100GB/hour for data warehouse (DDIA Ch. 10: Sort-merge join)',
    'OLAP query: Analytics dashboard loads in < 3s (DDIA Ch. 10: Materialized views on star schema)',
    'Batch fault tolerance: Retry failed tasks 3× (DDIA Ch. 10: MapReduce task retry)',
    'Join efficiency: Broadcast join for tables < 5GB (DDIA Ch. 10: In-memory dimension tables)',
    'Incremental batch: Process only new connections daily (DDIA Ch. 10: Date-partitioned HDFS)',
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

// Auto-generate code challenges from functional requirements
(linkedinProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(linkedinProblemDefinition);
