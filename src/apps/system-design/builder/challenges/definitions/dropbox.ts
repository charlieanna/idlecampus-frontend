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
};
