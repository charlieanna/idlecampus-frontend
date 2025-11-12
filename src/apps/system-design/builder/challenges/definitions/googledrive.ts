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
};
