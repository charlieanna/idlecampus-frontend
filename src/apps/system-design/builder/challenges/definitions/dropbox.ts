import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Dropbox - File Storage and Sync
 * Comprehensive FR and NFR scenarios
 */
export const dropboxProblemDefinition: ProblemDefinition = {
  id: 'dropbox',
  title: 'Dropbox - File Storage & Sync',
  description: `Design a file storage and sync service like Dropbox that:
- Users can upload and download files
- Files sync across multiple devices
- Users can share files and folders
- Platform supports file versioning`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload and download files',
    'Users can share files and folders'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process file uploads and downloads',
      },
      {
        type: 'storage',
        reason: 'Need to store file metadata and user data',
      },
      {
        type: 'object_storage',
        reason: 'Need to store actual files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends file requests',
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
      entities: ['user', 'file', 'folder', 'share', 'version'],
      fields: {
        user: ['id', 'email', 'name', 'storage_used', 'created_at'],
        file: ['id', 'user_id', 'folder_id', 'name', 'size', 'url', 'created_at'],
        folder: ['id', 'user_id', 'parent_folder_id', 'name', 'created_at'],
        share: ['id', 'file_id', 'shared_with_user_id', 'permission', 'created_at'],
        version: ['id', 'file_id', 'version_number', 'url', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading files
        { type: 'read_by_key', frequency: 'very_high' }, // Downloading files
        { type: 'read_by_query', frequency: 'high' }, // Browsing folders
      ],
    },
  },

  scenarios: generateScenarios('dropbox', problemConfigs.dropbox),

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
files = {}
folders = {}
shares = {}
versions = {}

def upload_file(file_id: str, user_id: str, folder_id: str, name: str, size: int, url: str) -> Dict:
    """
    FR-1: Users can upload files
    Naive implementation - stores file metadata in memory
    """
    files[file_id] = {
        'id': file_id,
        'user_id': user_id,
        'folder_id': folder_id,
        'name': name,
        'size': size,
        'url': url,
        'created_at': datetime.now()
    }

    # Update user storage
    if user_id in users:
        users[user_id]['storage_used'] = users[user_id].get('storage_used', 0) + size

    return files[file_id]

def download_file(file_id: str) -> Dict:
    """
    FR-1: Users can download files
    Naive implementation - returns file metadata with URL
    """
    return files.get(file_id)

def share_file(share_id: str, file_id: str, shared_with_user_id: str, permission: str = "read") -> Dict:
    """
    FR-2: Users can share files
    Naive implementation - stores share permission
    """
    shares[share_id] = {
        'id': share_id,
        'file_id': file_id,
        'shared_with_user_id': shared_with_user_id,
        'permission': permission,  # read, write
        'created_at': datetime.now()
    }
    return shares[share_id]

def share_folder(share_id: str, folder_id: str, shared_with_user_id: str, permission: str = "read") -> Dict:
    """
    FR-2: Users can share folders
    Naive implementation - shares folder and all contained files
    """
    shares[share_id] = {
        'id': share_id,
        'folder_id': folder_id,
        'shared_with_user_id': shared_with_user_id,
        'permission': permission,
        'created_at': datetime.now()
    }
    return shares[share_id]

def get_user_files(user_id: str, folder_id: str = None) -> List[Dict]:
    """
    Helper: Get user's files
    Naive implementation - returns all files in folder or root
    """
    user_files = []
    for file in files.values():
        if file['user_id'] == user_id and file['folder_id'] == folder_id:
            user_files.append(file)
    return user_files
`,
};
