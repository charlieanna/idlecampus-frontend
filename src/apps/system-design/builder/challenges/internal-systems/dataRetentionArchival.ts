import { Challenge } from '../../types/testCase';

export const dataRetentionArchivalChallenge: Challenge = {
  id: 'data_retention_archival',
  title: 'Data Retention & Archival System',
  difficulty: 'advanced',
  description: `Design a data retention and archival system for lifecycle management.

Automatically tier data from hot (SSD) → warm (HDD) → cold (S3) based on access patterns and age.
Enforce retention policies, handle legal holds, and provide fast restore for archived data.

Example workflow:
- Data unused for 30 days → Move to warm tier
- Data unused for 90 days → Archive to cold storage (S3)
- Legal hold → Prevent deletion even after retention period
- Restore request → Retrieve from archive in < 1 hour

Key challenges:
- Automated tiering based on access patterns
- Cost optimization (storage tiers)
- Legal compliance (GDPR, retention policies)
- Fast restore from cold storage`,

  requirements: {
    functional: [
      'Automated data tiering (hot/warm/cold)',
      'Retention policy enforcement',
      'Legal hold management',
      'Fast restore from archive (<1 hour)',
      'Compression and deduplication',
    ],
    traffic: '1TB/day archived, 100GB/day restored',
    latency: 'Hot access <10ms, warm <100ms, cold <1hr',
    availability: '99.9% uptime',
    budget: '$5,000/month for storage + archival',
  },

  availableComponents: [
    'client',
    'app_server',
    'database',
    'cache',
    's3',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Automated Tiering',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Automatically move data between hot/warm/cold tiers.',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.8,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        tieringAccuracy: 0.95,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
          { type: 's3', config: { storageSizeGB: 100000, tiers: ['hot', 'warm', 'cold'] } },
          { type: 'kafka', config: { partitions: 10 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'kafka' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Architecture:
- PostgreSQL tracks object metadata and access patterns
- S3 with lifecycle policies (hot → warm → cold)
- Kafka for async tiering jobs
- Redis caches frequently accessed objects`,
      },
    },

    {
      name: 'Retention Policy Enforcement',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Automatically delete data after retention period expires.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        retentionCompliance: 1.0,
      },
      hints: [
        'Policy: Delete after N days (30, 90, 365, 7 years)',
        'Check for legal holds before deletion',
        'Soft delete first (grace period)',
        'Audit log for all deletions',
      ],
    },

    {
      name: 'Fast Restore from Cold',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Restore archived data in < 1 hour.',
      traffic: {
        type: 'restore',
        dataSize: 100, // 100GB
      },
      duration: 3600, // 1 hour
      passCriteria: {
        maxErrorRate: 0,
        restoreTime: 3600,
      },
      hints: [
        'S3 Glacier Expedited: 1-5 minutes (expensive)',
        'S3 Glacier Standard: 3-5 hours (cheaper)',
        'Pre-warm cache for predicted restores',
        'Prioritize small files for fast user feedback',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Volume Archival',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Archive 1TB/day with compression.',
      traffic: {
        type: 'write',
        dataVolume: 1000, // 1TB
        duration: 86400, // 1 day
      },
      duration: 300, // Measure 5 min
      passCriteria: {
        maxErrorRate: 0,
        compressionRatio: 0.5, // 50% reduction
        throughput: 100, // 100MB/s
      },
      hints: [
        'Compress before upload (Gzip, Zstd)',
        'Parallel uploads (multipart)',
        'Batch small files to reduce API calls',
        'Deduplication for repeated data',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large Archive Scale',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Manage 100PB archive with 1B objects.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 500,
      },
      hints: [
        'Partition metadata by date or hash',
        'S3 object tagging for lifecycle rules',
        'Archive index in database (not S3 list)',
        'Lazy load metadata (not all 1B objects)',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Legal Hold Compliance',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Prevent deletion of data under legal hold.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        complianceViolations: 0,
      },
      hints: [
        'S3 Object Lock for immutability',
        'Check legal_hold flag before deletion',
        'Audit trail for hold changes',
        'Alert legal team on hold expirations',
      ],
    },
  ],

  hints: [
    {
      category: 'Tiering Strategy',
      items: [
        'Hot (SSD): Last accessed < 7 days',
        'Warm (HDD): Last accessed 7-30 days',
        'Cold (S3 Glacier): Last accessed > 30 days',
        'Archive (S3 Deep Archive): > 90 days',
      ],
    },
    {
      category: 'Retention Policies',
      items: [
        'Financial data: 7 years (regulation)',
        'User data: 30 days after account deletion (GDPR)',
        'Logs: 90 days (operational)',
        'Backups: 30 days (RPO)',
      ],
    },
    {
      category: 'Cost Optimization',
      items: [
        'Compression: Save 50-70% storage',
        'Deduplication: Save 30-50% for repeated data',
        'Lifecycle policies: Automate tiering',
        'Intelligent tiering: S3 auto-tier based on access',
      ],
    },
    {
      category: 'Restore Strategies',
      items: [
        'Bulk restore: Standard retrieval (3-5 hrs, cheap)',
        'Urgent restore: Expedited retrieval (1-5 min, expensive)',
        'Predictive: Pre-warm cache for likely restores',
        'Partial: Restore only requested files',
      ],
    },
  ],

  learningObjectives: [
    'Data lifecycle management strategies',
    'Storage tiering and cost optimization',
    'Retention policy enforcement',
    'Legal compliance (GDPR, holds)',
    'Archive and restore mechanisms',
  ],

  realWorldExample: `**AWS S3 Lifecycle:**
- Transition rules (Standard → IA → Glacier → Deep Archive)',
- Expiration rules for automatic deletion
- Object Lock for compliance
- Intelligent Tiering with ML

**Google Cloud Storage:**
- Nearline, Coldline, Archive classes
- Lifecycle management
- Object versioning
- Retention policies

**Azure Blob Storage:**
- Hot, Cool, Archive tiers
- Lifecycle management policies
- Immutable storage (WORM)
- Soft delete and versioning`,

  pythonTemplate: `from typing import Dict, List
from datetime import datetime, timedelta
import gzip

class DataRetentionArchival:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.storage = None  # S3
        self.queue = None  # Kafka

    def track_access(self, object_id: str):
        """Track object access for tiering decisions."""
        # TODO: Update last_accessed timestamp
        # TODO: Increment access count
        # TODO: Update tier if needed
        pass

    def tier_object(self, object_id: str) -> str:
        """Determine appropriate tier for object."""
        # TODO: Get last_accessed timestamp
        # TODO: Calculate age
        # TODO: Return tier: hot, warm, or cold
        last_accessed = datetime.now() - timedelta(days=10)
        age_days = (datetime.now() - last_accessed).days

        if age_days < 7:
            return 'hot'
        elif age_days < 30:
            return 'warm'
        else:
            return 'cold'

    def archive_object(self, object_id: str):
        """Move object to cold storage."""
        # TODO: Compress object data
        # TODO: Upload to S3 Glacier
        # TODO: Update metadata (tier = cold)
        # TODO: Delete from hot/warm storage
        pass

    def compress_data(self, data: bytes) -> bytes:
        """Compress data before archival."""
        return gzip.compress(data)

    def apply_retention_policy(self, object_id: str) -> bool:
        """Check if object should be deleted per retention policy."""
        # TODO: Get object metadata
        # TODO: Check retention period
        # TODO: Check for legal hold
        # TODO: Return True if should delete
        return False

    def delete_expired(self):
        """Delete objects past retention period."""
        # TODO: Query for expired objects
        # TODO: Check legal holds
        # TODO: Soft delete (mark for deletion)
        # TODO: Hard delete after grace period
        # TODO: Audit log
        pass

    def apply_legal_hold(self, object_id: str, reason: str):
        """Apply legal hold to prevent deletion."""
        # TODO: Set legal_hold flag
        # TODO: Record reason and requester
        # TODO: Notify stakeholders
        # TODO: Audit log
        pass

    def restore_from_archive(self, object_id: str,
                            priority: str = 'standard') -> str:
        """Restore object from cold storage."""
        # TODO: Initiate S3 Glacier retrieval
        # TODO: Priority: expedited (1-5min) or standard (3-5hr)
        # TODO: Poll for completion
        # TODO: Copy to hot tier
        # TODO: Return download URL
        pass

    def deduplicate(self, data: bytes) -> str:
        """Check if data already exists (deduplication)."""
        # TODO: Calculate content hash (SHA-256)
        # TODO: Check if hash exists in database
        # TODO: If exists, return existing object ID
        # TODO: Else, store new object
        pass

    def run_lifecycle_job(self):
        """Background job to enforce lifecycle policies."""
        # TODO: Tier objects based on access patterns
        # TODO: Delete expired objects
        # TODO: Generate cost reports
        # TODO: Alert on policy violations
        pass

# Example usage
if __name__ == '__main__':
    system = DataRetentionArchival()

    # Track access
    system.track_access('obj_123')

    # Determine tier
    tier = system.tier_object('obj_123')

    # Archive
    if tier == 'cold':
        system.archive_object('obj_123')

    # Legal hold
    system.apply_legal_hold('obj_456', reason='Litigation hold')

    # Restore
    url = system.restore_from_archive('obj_123', priority='expedited')

    # Run lifecycle
    system.run_lifecycle_job()`,
};
