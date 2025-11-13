import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Google Drive - Cloud Storage Platform
 * Comprehensive FR and NFR scenarios
 */
export const googledriveProblemDefinition: ProblemDefinition = {
  id: 'googledrive',
  title: 'Google Drive - Cloud Storage',
  description: `Design a cloud storage platform like Google Drive that:
- Users can upload, store, and organize files
- Users can collaborate on documents in real-time
- Files can be shared with specific permissions
- Platform supports searching across all files`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload, store, and organize files',
    'Users can collaborate on documents in real-time'
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

  scenarios: generateScenarios('googledrive', problemConfigs.googledrive),

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
