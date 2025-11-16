import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * GitHub - Code Hosting Platform
 * DDIA Ch. 2 (Graph Data Models) & Ch. 3 (Git Object Storage)
 *
 * DDIA Concepts Applied:
 * - Ch. 2: Graph database for repository relationships
 *   - Nodes: users, repos, commits, pull requests, issues
 *   - Edges: forks, stars, follows, PR references, commit parents
 * - Ch. 2: Git's DAG (Directed Acyclic Graph) for commit history
 * - Ch. 3: Content-addressable storage (SHA-1 hashing for git objects)
 * - Ch. 3: Pack files for efficient storage compression
 *
 * Key Graph Queries (DDIA Ch. 2):
 * - Find all forks of a repository (graph traversal)
 * - Find contributors to a project (multi-hop query)
 * - Dependency graph between repositories
 * - Social graph: followers, following, collaborators
 */
export const githubProblemDefinition: ProblemDefinition = {
  id: 'github',
  title: 'GitHub - Code Hosting',
  description: `Design a code hosting platform like GitHub that:
- Users can host Git repositories
- Users can create pull requests and issues
- Platform supports code review and collaboration
- Users can fork and star repositories

Learning Objectives (DDIA Ch. 2, 3):
1. Model relationships with graph database (DDIA Ch. 2)
   - Repository forks, stars, follows form a social graph
2. Understand Git's DAG structure (DDIA Ch. 2: Graph models)
   - Commits as nodes, parent commits as edges
3. Content-addressable storage with SHA hashing (DDIA Ch. 3)
4. Traverse dependency graphs efficiently (DDIA Ch. 2)`,

  userFacingFRs: [
    'Users can host Git repositories',
    'Users can create pull requests and issues',
    'Users can fork and star repositories',
    'Platform supports code review and collaboration'
  ],

  userFacingNFRs: [
    'Fork traversal: < 100ms for 3-hop queries (DDIA Ch. 2: Graph queries)',
    'Content-addressable lookup: O(1) with SHA (DDIA Ch. 3)',
    'Git push: Handle 1000+ objects efficiently (DDIA Ch. 3: Pack files)',
    'Social graph queries: < 200ms (DDIA Ch. 2: Graph indexes)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process git operations and web requests',
      },
      {
        type: 'storage',
        reason: 'Need to store repository metadata, issues, PRs',
      },
      {
        type: 'object_storage',
        reason: 'Need to store git repository data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends git and API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store git objects',
      },
    ],
    dataModel: {
      entities: ['user', 'repository', 'commit', 'pull_request', 'issue'],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'created_at'],
        repository: ['id', 'owner_id', 'name', 'description', 'is_private', 'stars', 'created_at'],
        commit: ['id', 'repo_id', 'author_id', 'message', 'sha', 'created_at'],
        pull_request: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
        issue: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Git pushes
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing repos
        { type: 'read_by_query', frequency: 'high' }, // Searching code
      ],
    },
  },

  scenarios: generateScenarios('github', problemConfigs.github),

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
repositories = {}
commits = {}
pull_requests = {}
issues = {}
stars = {}
forks = {}

def create_repository(repo_id: str, owner_id: str, name: str, description: str = "", is_private: bool = False) -> Dict:
    """
    FR-1: Users can host Git repositories
    Naive implementation - stores repository metadata
    """
    repositories[repo_id] = {
        'id': repo_id,
        'owner_id': owner_id,
        'name': name,
        'description': description,
        'is_private': is_private,
        'stars': 0,
        'created_at': datetime.now()
    }
    return repositories[repo_id]

def create_pull_request(pr_id: str, repo_id: str, author_id: str, title: str, base_branch: str, head_branch: str) -> Dict:
    """
    FR-2: Users can create pull requests
    Naive implementation - stores PR in memory
    """
    pull_requests[pr_id] = {
        'id': pr_id,
        'repo_id': repo_id,
        'author_id': author_id,
        'title': title,
        'base_branch': base_branch,
        'head_branch': head_branch,
        'status': 'open',
        'created_at': datetime.now()
    }
    return pull_requests[pr_id]

def create_issue(issue_id: str, repo_id: str, author_id: str, title: str, body: str = "") -> Dict:
    """
    FR-2: Users can create issues
    Naive implementation - stores issue in memory
    """
    issues[issue_id] = {
        'id': issue_id,
        'repo_id': repo_id,
        'author_id': author_id,
        'title': title,
        'body': body,
        'status': 'open',
        'created_at': datetime.now()
    }
    return issues[issue_id]

def fork_repository(fork_id: str, original_repo_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can fork repositories
    Naive implementation - creates copy of repo metadata
    """
    original = repositories.get(original_repo_id)
    if not original:
        return None

    repositories[fork_id] = {
        'id': fork_id,
        'owner_id': user_id,
        'name': original['name'],
        'description': original['description'],
        'is_private': False,
        'forked_from': original_repo_id,
        'stars': 0,
        'created_at': datetime.now()
    }

    forks[f"{original_repo_id}_{fork_id}"] = {
        'original_repo_id': original_repo_id,
        'fork_repo_id': fork_id,
        'created_at': datetime.now()
    }

    return repositories[fork_id]

def star_repository(user_id: str, repo_id: str) -> Dict:
    """
    FR-3: Users can star repositories
    Naive implementation - records star and increments count
    """
    star_id = f"{user_id}_{repo_id}"
    stars[star_id] = {
        'user_id': user_id,
        'repo_id': repo_id,
        'created_at': datetime.now()
    }

    if repo_id in repositories:
        repositories[repo_id]['stars'] += 1

    return stars[star_id]

def get_repository_pull_requests(repo_id: str, status: str = "open") -> List[Dict]:
    """
    Helper: Get pull requests for a repository
    Naive implementation - returns filtered PRs
    """
    repo_prs = []
    for pr in pull_requests.values():
        if pr['repo_id'] == repo_id and (status is None or pr['status'] == status):
            repo_prs.append(pr)
    return repo_prs
`,
};
