import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../../utils/codeChallengeGenerator';

/**
 * Comprehensive Cloud Storage Platform
 * 
 * This problem consolidates all storage concepts into a single, realistic application.
 * Users will progressively build a Dropbox/Google Drive-scale platform that covers:
 * 
 * STORAGE CONCEPTS COVERED:
 * 1. Object Storage - S3-like blob storage for files
 * 2. NoSQL Document Store - MongoDB for user metadata
 * 3. Key-Value Store - Redis for caching and sessions
 * 4. Relational Database - PostgreSQL for structured data
 * 5. File Chunking - Split large files for parallel upload
 * 6. Deduplication - Store identical files once
 * 7. Versioning - Keep file history
 * 8. Sharing & Permissions - Access control
 * 9. Search & Indexing - Find files by name/content
 * 10. Sync Protocol - Real-time file synchronization
 * 
 * The problem is designed for progressive learning:
 * - Start with basic file upload/download
 * - Add chunking for large files
 * - Introduce deduplication
 * - Add versioning and sharing
 * - Implement sync protocol
 * - Scale with CDN and caching
 */
export const comprehensiveCloudStoragePlatformDefinition: ProblemDefinition = {
  id: 'comprehensive-cloud-storage-platform',
  title: 'Cloud Storage Platform (Dropbox/Google Drive-scale)',
  description: `Design a comprehensive cloud storage platform (like Dropbox or Google Drive) that handles:
  
  **Core User Features:**
  - Upload files of any size (1KB to 10GB)
  - Download files with resume support
  - Organize files in folders
  - Share files and folders with others
  - Search for files by name and content
  - View file versions and restore old versions
  - Sync files across multiple devices
  
  **Advanced Features:**
  - Automatic file deduplication (save storage)
  - Real-time sync across devices
  - Collaborative editing (multiple users)
  - File previews (images, PDFs, videos)
  - Trash and recovery
  - Storage quota management
  
  **Scale Requirements:**
  - Support 100M users
  - Store 10PB of data
  - Handle 10k file uploads/sec
  - Handle 50k file downloads/sec
  - Sync 1M devices in real-time
  - Provide 99.999999999% durability (11 nines)
  
  **Key Learning Objectives:**
  This problem teaches you to build a production-grade storage system with:
  - Object storage (S3) for blob data
  - NoSQL (MongoDB) for flexible metadata
  - Key-value store (Redis) for caching
  - Relational DB (PostgreSQL) for permissions
  - File chunking for large files
  - Content-based deduplication
  - Version control system
  - Real-time sync protocol
  - CDN for global distribution
  
  **Progressive Approach:**
  Start simple with basic upload/download, then progressively add:
  1. File upload and download
  2. Folder organization
  3. Chunking for large files
  4. Deduplication
  5. Versioning
  6. Sharing and permissions
  7. Search and indexing
  8. Real-time sync`,

  userFacingFRs: [
    // Core File Operations
    'Users can upload files up to 10GB',
    'Users can download files with resume support',
    'Users can delete files (moved to trash)',
    'Users can restore files from trash',
    'Users can permanently delete files from trash',
    
    // Folder Management
    'Users can create folders',
    'Users can move files between folders',
    'Users can rename files and folders',
    'Users can view folder contents',
    
    // Sharing
    'Users can share files with specific users',
    'Users can share folders with view/edit permissions',
    'Users can generate public share links',
    'Shared files appear in recipient\'s shared folder',
    
    // Versioning
    'System keeps last 30 versions of each file',
    'Users can view version history',
    'Users can restore previous versions',
    'Users can download specific versions',
    
    // Search
    'Users can search files by name',
    'Users can search by file type',
    'Users can search by date modified',
    'Search results show file preview',
    
    // Sync
    'Files sync automatically across all user devices',
    'Users see real-time updates when files change',
    'Sync handles conflicts (same file edited on 2 devices)',
    'Offline changes sync when device comes online',
    
    // Storage Management
    'Users can see storage usage (GB used / GB total)',
    'Users get notified when approaching storage limit',
    'Users can upgrade storage plan',
  ],

  userFacingNFRs: [
    // Performance
    'File upload starts within 100ms',
    'Small files (<10MB) upload in <2 seconds',
    'Large files (>100MB) use chunked upload',
    'File download starts within 200ms',
    'Sync latency <5 seconds for file changes',
    
    // Scale
    'Support 100M users',
    'Store 10PB of data',
    'Handle 10,000 file uploads/sec',
    'Handle 50,000 file downloads/sec',
    'Sync 1M devices in real-time',
    
    // Durability & Availability
    'Data durability: 99.999999999% (11 nines)',
    'System availability: 99.9%',
    'Zero data loss during failures',
    'Automatic backup and replication',
    
    // Storage Efficiency
    'Deduplication saves 30-50% storage',
    'Compression reduces storage by 20%',
    'Only store deltas for versions',
  ],

  functionalRequirements: {
    mustHave: [
      // Frontend & CDN
      {
        type: 'cdn',
        reason: 'Need CDN for fast file downloads globally',
      },
      
      // Load Balancing
      {
        type: 'load_balancer',
        reason: 'Need load balancer to distribute API traffic',
      },
      
      // Application Layer
      {
        type: 'compute',
        reason: 'Need application servers for file API (upload, download, metadata)',
      },
      {
        type: 'compute',
        reason: 'Need sync servers for real-time file synchronization',
      },
      {
        type: 'compute',
        reason: 'Need worker instances for async tasks (dedup, thumbnails, indexing)',
      },
      
      // Object Storage
      {
        type: 'object_storage',
        reason: 'Need S3 for storing actual file blobs with 11 nines durability',
      },
      
      // Databases
      {
        type: 'storage',
        reason: 'Need MongoDB for file metadata (name, size, chunks, versions)',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL for user accounts, permissions, and sharing',
      },
      {
        type: 'search',
        reason: 'Need Elasticsearch for file search by name and content',
      },
      
      // Caching
      {
        type: 'cache',
        reason: 'Need Redis for metadata caching (hot files)',
      },
      {
        type: 'cache',
        reason: 'Need Redis for deduplication hash lookups',
      },
      {
        type: 'cache',
        reason: 'Need Redis for sync state tracking',
      },
      
      // Message Queue
      {
        type: 'message_queue',
        reason: 'Need message queue for async tasks (dedup, thumbnails, indexing)',
      },
      {
        type: 'message_queue',
        reason: 'Need pub/sub for real-time sync notifications',
      },
    ],
    
    mustConnect: [
      // User Traffic Flow
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users download files through CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN pulls from origin load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes traffic to app servers',
      },
      
      // File Upload Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server checks dedup cache (file hash → S3 key)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server uploads file chunks to S3',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server writes file metadata to MongoDB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App server publishes "file uploaded" event',
      },
      
      // File Download Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server checks metadata cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server queries MongoDB for file metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server generates signed S3 URL for download',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls file from S3',
      },
      
      // Deduplication Flow
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Dedup worker consumes "file uploaded" event',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Dedup worker stores hash → S3 key mapping in Redis',
      },
      
      // Sync Flow
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App server publishes file change event to sync topic',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Sync servers consume file change events',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Sync server looks up connected devices in Redis',
      },
      {
        from: 'compute',
        to: 'client',
        reason: 'Sync server pushes update to devices via WebSocket',
      },
      
      // Search Flow
      {
        from: 'compute',
        to: 'search',
        reason: 'App server queries Elasticsearch for file search',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Index worker consumes events and updates Elasticsearch',
      },
      
      // Permissions Flow
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server queries PostgreSQL for sharing permissions',
      },
      
      // Thumbnail Generation
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Thumbnail worker consumes events',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Thumbnail worker stores generated thumbnails in S3',
      },
    ],
    
    dataModel: {
      entities: [
        'user',
        'file',
        'folder',
        'chunk',
        'version',
        'share',
        'device',
        'sync_state',
      ],
      fields: {
        user: ['id', 'email', 'storage_used_bytes', 'storage_quota_bytes', 'created_at'],
        file: ['id', 'user_id', 'folder_id', 'name', 'size_bytes', 'content_hash', 's3_key', 'mime_type', 'created_at', 'modified_at'],
        folder: ['id', 'user_id', 'parent_folder_id', 'name', 'created_at'],
        chunk: ['file_id', 'chunk_number', 's3_key', 'size_bytes', 'hash'],
        version: ['id', 'file_id', 'version_number', 's3_key', 'size_bytes', 'created_at'],
        share: ['id', 'file_id', 'owner_id', 'shared_with_user_id', 'permission', 'created_at'],
        device: ['id', 'user_id', 'device_name', 'last_sync_time', 'online'],
        sync_state: ['user_id', 'device_id', 'file_id', 'version', 'synced'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },     // File metadata lookups
        { type: 'write', frequency: 'high' },                // File uploads, metadata updates
        { type: 'read_by_query', frequency: 'high' },        // Folder listings, search
        { type: 'write_large_file', frequency: 'medium' },   // Large file uploads
      ],
    },
  },

  scenarios: generateScenarios('comprehensive-cloud-storage-platform', problemConfigs['comprehensive-cloud-storage-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(comprehensiveCloudStoragePlatformDefinition as any).codeChallenges = generateCodeChallengesFromFRs(comprehensiveCloudStoragePlatformDefinition);

