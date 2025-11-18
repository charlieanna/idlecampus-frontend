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
 * Google Drive - Cloud Storage Platform
 * DDIA Ch. 3 (Storage Engines) - B-Trees for Read-Heavy Workload
 *
 * DDIA Concepts Applied:
 * - Ch. 3: B-trees for file metadata (read-optimized)
 *   - Read-heavy: Users browse, search, access files frequently
 *   - B-trees provide fast point queries and range scans
 *   - In-place updates (no compaction needed like LSM)
 * - Ch. 3: Full-text search indexes for file content
 * - Ch. 2: Hierarchical folder structure (tree model)
 * - Ch. 11: Real-time collaboration with OT (Operational Transform)
 *
 * Why B-trees for Google Drive (DDIA Ch. 3):
 * - Read-heavy workload: Users access files more than upload
 * - Fast file lookups by name, path, or ID (O(log n))
 * - Efficient range queries for folder listings
 * - In-place updates suitable for infrequent metadata changes
 */
export const googledriveProblemDefinition: ProblemDefinition = {
  id: 'googledrive',
  title: 'Google Drive - Cloud Storage',
  description: `Design a cloud storage platform like Google Drive that:
- Users can upload, store, and organize files
- Users can collaborate on documents in real-time
- Files can be shared with specific permissions
- Platform supports searching across all files

Learning Objectives (DDIA Ch. 3, 11):
1. Use B-trees for read-heavy file metadata (DDIA Ch. 3)
   - Fast point queries for file lookup
   - Efficient range scans for folder listings
2. Implement hierarchical folder structure (DDIA Ch. 2: Tree model)
3. Full-text search with inverted indexes (DDIA Ch. 3)
4. Real-time collaboration with Operational Transform (DDIA Ch. 11)`,

  userFacingFRs: [
    'Users can upload, store, and organize files',
    'Users can collaborate on documents in real-time',
    'Files can be shared with specific permissions',
    'Platform supports searching across all files'
  ],

  userFacingNFRs: [
    'File lookup: p99 < 50ms (DDIA Ch. 3: B-tree O(log n))',
    'Folder listing: < 100ms for 1000 files (DDIA Ch. 3: Range scan)',
    'Search latency: < 300ms (DDIA Ch. 3: Full-text index)',
    'Read throughput: 100K+ file accesses/sec (DDIA Ch. 3: B-tree read optimization)',
    'Collaboration sync: < 100ms (DDIA Ch. 11: Operational Transform)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process file operations and collaboration',
      },
      {
        type: 'storage',
        reason: 'Need to store file metadata and permissions',
      },
      {
        type: 'object_storage',
        reason: 'Need to store files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store files',
      },
    ],
    dataModel: {
      entities: ['user', 'file', 'folder', 'permission', 'activity'],
      fields: {
        user: ['id', 'email', 'name', 'storage_quota', 'created_at'],
        file: ['id', 'owner_id', 'folder_id', 'name', 'type', 'size', 'url', 'created_at'],
        folder: ['id', 'owner_id', 'parent_id', 'name', 'created_at'],
        permission: ['id', 'file_id', 'user_id', 'role', 'created_at'],
        activity: ['id', 'file_id', 'user_id', 'action', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading files
        { type: 'read_by_key', frequency: 'very_high' }, // Accessing files
        { type: 'read_by_query', frequency: 'high' }, // Searching files
      ],
    },
  },

  scenarios: generateScenarios('googledrive', problemConfigs.googledrive, [
    'Users can upload, store, and organize files',
    'Users can collaborate on documents in real-time',
    'Files can be shared with specific permissions',
    'Platform supports searching across all files'
  ]),

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
files = {}
folders = {}
permissions = {}
activities = {}

def upload_file(file_id: str, owner_id: str, name: str, file_type: str,
                size: int, folder_id: str = None) -> Dict:
    """
    FR-1: Users can upload files
    Naive implementation - stores file metadata in memory
    """
    files[file_id] = {
        'id': file_id,
        'owner_id': owner_id,
        'folder_id': folder_id,
        'name': name,
        'type': file_type,
        'size': size,
        'url': f'https://storage.example.com/{file_id}',
        'created_at': datetime.now()
    }
    return files[file_id]

def create_folder(folder_id: str, owner_id: str, name: str,
                  parent_id: str = None) -> Dict:
    """
    FR-1: Users can organize files (create folders)
    Naive implementation - stores folder in memory
    """
    folders[folder_id] = {
        'id': folder_id,
        'owner_id': owner_id,
        'parent_id': parent_id,
        'name': name,
        'created_at': datetime.now()
    }
    return folders[folder_id]

def get_files_in_folder(folder_id: str = None) -> List[Dict]:
    """
    FR-1: Users can view files in folders
    Naive implementation - returns all files in a folder
    """
    folder_files = []
    for file in files.values():
        if file['folder_id'] == folder_id:
            folder_files.append(file)
    return folder_files

def collaborate_on_file(file_id: str, user_id: str, content_changes: str) -> Dict:
    """
    FR-2: Users can collaborate on documents in real-time
    Naive implementation - records activity, doesn't actually edit file
    """
    activity_id = f"{file_id}_{user_id}_{datetime.now().timestamp()}"
    activities[activity_id] = {
        'id': activity_id,
        'file_id': file_id,
        'user_id': user_id,
        'action': 'edit',
        'changes': content_changes,
        'created_at': datetime.now()
    }
    return activities[activity_id]

def get_file_activities(file_id: str) -> List[Dict]:
    """
    FR-2: View collaboration history
    Naive implementation - returns all activities for a file
    """
    file_activities = []
    for activity in activities.values():
        if activity['file_id'] == file_id:
            file_activities.append(activity)
    return file_activities

def share_file(permission_id: str, file_id: str, user_id: str,
               role: str = 'viewer') -> Dict:
    """
    Helper: Share file with specific permissions
    Naive implementation - stores permission in memory
    """
    permissions[permission_id] = {
        'id': permission_id,
        'file_id': file_id,
        'user_id': user_id,
        'role': role,
        'created_at': datetime.now()
    }
    return permissions[permission_id]
`,
};

// Auto-generate code challenges from functional requirements
(googledriveProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(googledriveProblemDefinition);
