import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Dropbox - File Storage and Sync
 * DDIA Ch. 3 (Storage Engines) - LSM-Trees for Write-Heavy Workload
 *
 * DDIA Concepts Applied:
 * - Ch. 3: LSM-trees (Log-Structured Merge-Trees) for file metadata
 *   - Write-optimized: File uploads generate many metadata writes
 *   - Sequential writes to memtable, flushed to SSTables
 *   - Background compaction to merge SSTables
 * - Ch. 3: Bloom filters for quick file existence checks
 * - Ch. 4: Delta encoding for efficient sync (only send changes)
 * - Ch. 4: Chunking and content-defined chunking for deduplication
 *
 * Why LSM-trees for Dropbox (DDIA Ch. 3):
 * - File uploads are write-heavy (metadata: name, size, version, hash, timestamps)
 * - LSM-trees handle high write throughput better than B-trees
 * - Compaction runs in background without blocking writes
 * - Perfect for append-heavy file version history
 */
export const dropboxProblemDefinition: ProblemDefinition = {
  id: 'dropbox',
  title: 'Dropbox - File Storage & Sync',
  description: `Design a file storage and sync service like Dropbox that:
- Users can upload and download files
- Files sync across multiple devices
- Users can share files and folders
- Platform supports file versioning

Learning Objectives (DDIA Ch. 3, 4):
1. Use LSM-trees for write-heavy file metadata (DDIA Ch. 3)
   - Fast sequential writes to memtable
   - Background compaction for read optimization
2. Implement delta sync with chunking (DDIA Ch. 4)
   - Only sync changed file chunks, not entire files
3. Use Bloom filters for existence checks (DDIA Ch. 3)
4. Content-defined chunking for deduplication (DDIA Ch. 4)`,

  userFacingFRs: [
    'Users can upload and download files',
    'Files sync across multiple devices',
    'Users can share files and folders',
    'Platform supports file versioning'
  ],

  userFacingNFRs: [
    'Upload throughput: 10K+ files/sec (DDIA Ch. 3: LSM-tree write optimization)',
    'Sync latency: < 1s for small changes (DDIA Ch. 4: Delta sync)',
    'Metadata write latency: < 10ms (DDIA Ch. 3: LSM memtable)',
    'Deduplication: 50%+ storage savings (DDIA Ch. 4: Content-defined chunking)',
    'Compaction: Background without blocking (DDIA Ch. 3: LSM compaction)',
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
