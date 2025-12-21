import { GuidedTutorial } from '../../types/guidedTutorial';

export const googledriveProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'googledrive-progressive',
  title: 'Design Google Drive',
  description: 'Build a cloud storage system from simple file upload to real-time collaborative editing',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design scalable file storage with deduplication',
    'Implement file sync across devices',
    'Build sharing with granular permissions',
    'Handle real-time collaborative editing',
    'Scale to petabytes of storage'
  ],
  prerequisites: ['Distributed storage', 'Sync algorithms', 'Collaboration'],
  tags: ['cloud-storage', 'file-sync', 'collaboration', 'sharing', 'scale'],

  progressiveStory: {
    title: 'Google Drive Evolution',
    premise: "You're building a cloud storage platform. Starting with simple file upload and storage, you'll evolve to support cross-device sync, sharing, real-time collaboration, and enterprise features.",
    phases: [
      { phase: 1, title: 'Storage', description: 'Upload and organize files' },
      { phase: 2, title: 'Sync', description: 'Cross-device synchronization' },
      { phase: 3, title: 'Sharing', description: 'Collaboration and permissions' },
      { phase: 4, title: 'Scale', description: 'Enterprise and optimization' }
    ]
  },

  steps: [
    // PHASE 1: Storage (Steps 1-3)
    {
      id: 'step-1',
      title: 'File Upload and Storage',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Store files reliably in the cloud',
      thinkingFramework: {
        framework: 'Content-Addressable Storage',
        approach: 'Chunk files into blocks. Hash each block for deduplication. Store blocks in distributed object storage. Metadata separate from content.',
        keyInsight: 'Same block uploaded by different users = store once. Content hash is key. 4MB chunks balance dedup ratio vs overhead.'
      },
      requirements: {
        functional: [
          'Upload files of any size',
          'Resumable uploads',
          'Store in durable storage',
          'Support all file types'
        ],
        nonFunctional: [
          'Upload speed: 100 MB/s',
          'Durability: 99.999999999% (11 nines)'
        ]
      },
      hints: [
        'Chunk: split file into 4MB blocks, hash each',
        'Block: {hash, data, ref_count} - store in object storage',
        'File: {id, name, blocks: [hash1, hash2, ...], size}'
      ],
      expectedComponents: ['Upload Service', 'Chunker', 'Block Store'],
      successCriteria: ['Files upload', 'Resumable works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'File and Folder Organization',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Organize files in hierarchical folders',
      thinkingFramework: {
        framework: 'Virtual File System',
        approach: 'Folders contain files and subfolders. File can be in multiple folders (shortcuts). Metadata stored in database, content in object storage.',
        keyInsight: 'Folder is just metadata - no actual nested storage. Moving file = update parent pointer. Efficient for large hierarchies.'
      },
      requirements: {
        functional: [
          'Create folders and subfolders',
          'Move files between folders',
          'Rename files and folders',
          'File shortcuts (multiple locations)'
        ],
        nonFunctional: [
          'Folder listing < 500ms',
          'No depth limit'
        ]
      },
      hints: [
        'Item: {id, name, type: file|folder, parent_id, owner_id}',
        'Shortcut: {id, target_id, parent_id} - points to original',
        'Path: reconstruct from parent chain'
      ],
      expectedComponents: ['Metadata Store', 'Folder Manager', 'Shortcut Handler'],
      successCriteria: ['Folders work', 'Shortcuts work'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'File Versioning',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Keep history of file changes',
      thinkingFramework: {
        framework: 'Version Chain',
        approach: 'Each save creates new version. Keep N versions or X days. Restore any previous version. Show version history.',
        keyInsight: 'Versions share unchanged blocks. Edit = new version with some blocks same, some different. Deduplication across versions is huge.'
      },
      requirements: {
        functional: [
          'Automatic versioning on save',
          'View version history',
          'Restore previous version',
          'Name versions'
        ],
        nonFunctional: [
          'Keep versions 30 days',
          'Max 100 versions per file'
        ]
      },
      hints: [
        'Version: {file_id, version_num, blocks: [], created_at, created_by}',
        'Restore: create new version pointing to old blocks',
        'Cleanup: delete versions > 30 days, garbage collect orphan blocks'
      ],
      expectedComponents: ['Version Store', 'Version Manager', 'Cleanup Worker'],
      successCriteria: ['Versions saved', 'Restore works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Sync (Steps 4-6)
    {
      id: 'step-4',
      title: 'Desktop Sync Client',
      phase: 2,
      phaseTitle: 'Sync',
      learningObjective: 'Sync files between cloud and local disk',
      thinkingFramework: {
        framework: 'Bidirectional Sync',
        approach: 'Watch local folder for changes. Detect remote changes via API. Upload local changes, download remote changes. Handle conflicts.',
        keyInsight: 'Sync is hard. Same file edited in two places = conflict. Need timestamps, change detection, conflict resolution strategy.'
      },
      requirements: {
        functional: [
          'Monitor local folder changes',
          'Poll/push for remote changes',
          'Upload and download deltas',
          'Detect and handle conflicts'
        ],
        nonFunctional: [
          'Sync delay < 30 seconds',
          'Minimal bandwidth for unchanged files'
        ]
      },
      hints: [
        'Local watcher: filesystem events (inotify, FSEvents)',
        'Remote: long-poll or WebSocket for change notifications',
        'Delta: only upload changed blocks, not whole file'
      ],
      expectedComponents: ['File Watcher', 'Sync Engine', 'Delta Calculator'],
      successCriteria: ['Files sync', 'Changes propagate'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Conflict Resolution',
      phase: 2,
      phaseTitle: 'Sync',
      learningObjective: 'Handle concurrent edits gracefully',
      thinkingFramework: {
        framework: 'Conflict Detection',
        approach: 'Track base version for edits. If remote changed since base = conflict. Options: create conflict copy, auto-merge, or prompt user.',
        keyInsight: 'Conflicts are inevitable with multiple devices. Clear UX for resolution essential. "File (conflict copy)" pattern is safe default.'
      },
      requirements: {
        functional: [
          'Detect conflicting edits',
          'Create conflict copies',
          'Manual conflict resolution',
          'Show conflict status'
        ],
        nonFunctional: [
          'No data loss on conflict'
        ]
      },
      hints: [
        'Conflict: local_base != remote_version on upload',
        'Resolution: keep both as separate files, let user merge',
        'Auto-merge: only for known formats (text) with merge algorithms'
      ],
      expectedComponents: ['Conflict Detector', 'Conflict Resolver', 'Merge Tool'],
      successCriteria: ['Conflicts detected', 'No data loss'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Selective Sync and Streaming',
      phase: 2,
      phaseTitle: 'Sync',
      learningObjective: 'Optimize disk usage and bandwidth',
      thinkingFramework: {
        framework: 'On-Demand Files',
        approach: 'Show all files in folder but dont download until accessed. Placeholder files. Stream on open. Download for offline.',
        keyInsight: 'Users have 100GB in Drive but 256GB disk. Cant download everything. Placeholders show whats available, fetch on demand.'
      },
      requirements: {
        functional: [
          'Selective folder sync',
          'Placeholder files (show but not downloaded)',
          'Stream file content on access',
          'Pin files for offline'
        ],
        nonFunctional: [
          'Placeholder shows in < 100ms',
          'Stream start < 1 second'
        ]
      },
      hints: [
        'Placeholder: OS-specific (macOS: dataless file, Windows: cloud files API)',
        'On access: intercept file open, download, then complete open',
        'Pin: force download and keep local'
      ],
      expectedComponents: ['Placeholder Manager', 'Stream Handler', 'Offline Pinner'],
      successCriteria: ['Placeholders work', 'Streaming smooth'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Sharing (Steps 7-9)
    {
      id: 'step-7',
      title: 'Sharing and Permissions',
      phase: 3,
      phaseTitle: 'Sharing',
      learningObjective: 'Share files with granular access control',
      thinkingFramework: {
        framework: 'ACL Model',
        approach: 'Share with users or groups. Permission levels: viewer, commenter, editor. Link sharing with optional password. Folder permissions inherit.',
        keyInsight: 'Inheritance simplifies management. Share folder → all contents shared. Can override at lower level. Most restrictive wins for conflicts.'
      },
      requirements: {
        functional: [
          'Share with specific users',
          'Permission levels (view, comment, edit)',
          'Shareable link (anyone with link)',
          'Permission inheritance'
        ],
        nonFunctional: [
          'Permission check < 10ms',
          'ACL limit: 1000 per item'
        ]
      },
      hints: [
        'Permission: {item_id, grantee: user|group|anyone, role: viewer|editor}',
        'Link: generate unique URL, optional password/expiry',
        'Inheritance: check item, then parent, then grandparent...'
      ],
      expectedComponents: ['Permission Store', 'Permission Checker', 'Link Manager'],
      successCriteria: ['Sharing works', 'Permissions enforced'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Shared Drives (Team Storage)',
      phase: 3,
      phaseTitle: 'Sharing',
      learningObjective: 'Create team-owned storage spaces',
      thinkingFramework: {
        framework: 'Organizational Ownership',
        approach: 'Shared Drive owned by team, not individual. Members have roles. Files belong to drive, not person. Person leaves = files stay.',
        keyInsight: 'Personal drives die with account. Shared Drives persist. Essential for business - employee leaves, files remain. Ownership is organization.'
      },
      requirements: {
        functional: [
          'Create Shared Drives',
          'Member management and roles',
          'Files owned by drive',
          'Drive-level settings'
        ],
        nonFunctional: [
          'Members per drive: 600',
          'No storage limit (enterprise)'
        ]
      },
      hints: [
        'SharedDrive: {id, name, members: [{user_id, role}]}',
        'Roles: manager, content_manager, contributor, viewer',
        'Files: owner_type = shared_drive, no personal owner'
      ],
      expectedComponents: ['Shared Drive Manager', 'Member Manager', 'Drive Settings'],
      successCriteria: ['Shared Drives work', 'Ownership persists'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Real-Time Collaboration',
      phase: 3,
      phaseTitle: 'Sharing',
      learningObjective: 'Enable simultaneous editing',
      thinkingFramework: {
        framework: 'Operational Transform',
        approach: 'Multiple cursors in same document. OT or CRDT for conflict-free edits. See others changes in real-time. Works for Docs, Sheets, Slides.',
        keyInsight: 'Real-time collab is different from file sync. Character-level operations, not file-level. OT transforms operations to preserve intent.'
      },
      requirements: {
        functional: [
          'Multiple simultaneous editors',
          'See others cursors/selections',
          'Real-time character updates',
          'Presence indicators'
        ],
        nonFunctional: [
          'Edit latency < 100ms',
          'Support 100 concurrent editors'
        ]
      },
      hints: [
        'Operations: insert(pos, char), delete(pos, len)',
        'OT: transform concurrent ops to maintain consistency',
        'Presence: broadcast cursor position via WebSocket'
      ],
      expectedComponents: ['OT Engine', 'Presence Service', 'Document Server'],
      successCriteria: ['Real-time editing works', 'No conflicts'],
      estimatedTime: '10 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Search and Discovery',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Find files across all storage',
      thinkingFramework: {
        framework: 'Full-Text Index',
        approach: 'Index file names, content, metadata. OCR for images/PDFs. Search owned + shared files. Filter by type, date, owner.',
        keyInsight: 'People forget where they put files. Search is primary navigation. Content search finds files by whats inside, not just name.'
      },
      requirements: {
        functional: [
          'Search by filename',
          'Full-text content search',
          'OCR for images and PDFs',
          'Filters (type, date, owner)'
        ],
        nonFunctional: [
          'Search < 1 second',
          'Index within 1 hour of upload'
        ]
      },
      hints: [
        'Index: filename, extracted text, metadata, owner, shared_with',
        'OCR: async processing for images, store extracted text',
        'Scope: user files + shared with me'
      ],
      expectedComponents: ['Search Index', 'Content Extractor', 'OCR Pipeline'],
      successCriteria: ['Search finds files', 'Content searchable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Activity and Audit',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Track all file activity',
      thinkingFramework: {
        framework: 'Audit Trail',
        approach: 'Log every action: view, edit, share, download. Activity feed for users. Admin audit log for compliance. Detect unusual activity.',
        keyInsight: 'Activity serves multiple needs: user sees recent, admin audits compliance, security detects anomalies. Single log, multiple views.'
      },
      requirements: {
        functional: [
          'Log all file actions',
          'User activity feed',
          'Admin audit log',
          'Activity alerts'
        ],
        nonFunctional: [
          'Log retention: 6 months',
          'Query < 2 seconds'
        ]
      },
      hints: [
        'Activity: {user_id, action, item_id, timestamp, details}',
        'Actions: view, edit, share, download, delete, permission_change',
        'Alerts: mass download, share to external, unusual access pattern'
      ],
      expectedComponents: ['Activity Logger', 'Activity Feed', 'Audit Console'],
      successCriteria: ['Activity logged', 'Auditable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Storage Optimization',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Optimize cost at petabyte scale',
      thinkingFramework: {
        framework: 'Tiered Storage',
        approach: 'Hot storage for recent files. Cold storage for old files. Deduplication across all users. Compression for compressible types.',
        keyInsight: 'Storage cost is major expense. 80% of files rarely accessed. Move to cheap cold storage. Dedup saves 30-50% across user base.'
      },
      requirements: {
        functional: [
          'Automatic tiering by access pattern',
          'Cross-user deduplication',
          'Compression for text/documents',
          'Quota management'
        ],
        nonFunctional: [
          'Hot to cold: after 30 days no access',
          'Dedup ratio > 30%'
        ]
      },
      hints: [
        'Tiers: hot (SSD), warm (HDD), cold (tape/glacier)',
        'Migration: background job, transparent to user',
        'Dedup: global block index, ref counting'
      ],
      expectedComponents: ['Tier Manager', 'Dedup Service', 'Quota Enforcer'],
      successCriteria: ['Cost optimized', 'Transparent to user'],
      estimatedTime: '8 minutes'
    }
  ]
};
