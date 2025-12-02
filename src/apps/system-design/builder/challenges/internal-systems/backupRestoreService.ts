/**
 * L4-L5 Internal Systems: Backup & Restore Service
 *
 * Design an enterprise-grade backup and restore service supporting incremental backups,
 * point-in-time recovery (PITR), cross-region replication, and RPO/RTO guarantees.
 * Critical for disaster recovery and data protection compliance.
 *
 * Real-world examples:
 * - Google Cloud Backup: Automated backups for Cloud SQL, GKE
 * - AWS RDS Automated Backups: Daily full + transaction log backups
 * - MongoDB Atlas Backup: Continuous backups with PITR
 * - Uber's Backup Service: Cross-region backups for critical data
 *
 * Companies: Google, AWS, MongoDB, Uber, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Migration & Reliability
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Backup Types
 *    - Full backup: Complete snapshot of data
 *    - Incremental backup: Only changes since last backup
 *    - Differential backup: Changes since last full backup
 *    - Continuous backup: Stream WAL/binlog for PITR
 *
 * 2. Scheduling & Retention
 *    - Automated scheduling (daily, weekly, monthly)
 *    - Retention policies (keep 7 daily, 4 weekly, 12 monthly)
 *    - Legal hold: Prevent deletion for compliance
 *    - Lifecycle: Hot → Warm → Cold → Glacier
 *
 * 3. Restore Operations
 *    - Point-in-time recovery (PITR): Restore to specific timestamp
 *    - Partial restore: Restore specific tables/databases
 *    - Cross-region restore: Restore to different region
 *    - Validation: Verify backup integrity before restore
 *
 * 4. Monitoring & Alerting
 *    - Backup success/failure tracking
 *    - RPO/RTO monitoring (are we meeting SLAs?)
 *    - Storage cost tracking
 *    - Backup verification (periodic restore tests)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Incremental backup: <10 min for 100GB database
 * - Full backup: <2 hours for 1TB database
 * - Restore time (RTO): <1 hour for 500GB
 * - PITR recovery lag: <15 minutes
 *
 * Scalability (NFR-S):
 * - Support 10K+ databases per cluster
 * - Handle 100TB+ total backup storage
 * - Parallel backups: 100+ concurrent backups
 * - Multi-region: 5+ regions for DR
 *
 * Reliability (NFR-R):
 * - RPO (Recovery Point Objective): <5 minutes data loss
 * - RTO (Recovery Time Objective): <1 hour downtime
 * - Backup durability: 99.999999999% (11 nines) using S3
 * - Backup verification: 100% of backups tested monthly
 *
 * Cost (NFR-C):
 * - Use incremental backups to reduce storage (90% savings)
 * - Lifecycle to Glacier for old backups (80% cost reduction)
 * - Compression: 3-5x reduction in size
 * - Cross-region replication only for critical data
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
import hashlib

class BackupRestoreService:
    """
    Backup & Restore Service

    Key Operations:
    1. create_backup: Create full or incremental backup
    2. schedule_backups: Set up automated backup schedule
    3. restore_pitr: Point-in-time recovery to specific timestamp
    4. verify_backup: Test backup integrity
    5. apply_retention_policy: Clean up old backups based on policy
    """

    def __init__(self):
        self.backups = {}  # {backup_id: BackupMetadata}
        self.schedules = {}  # {database_id: ScheduleConfig}
        self.restore_jobs = {}  # {restore_id: RestoreJob}
        self.wal_logs = {}  # {database_id: [WAL entries]}

    def create_backup(self, database_id: str, backup_type: str, context: dict) -> dict:
        """
        Create database backup (full or incremental).

        FR: Full, incremental, and differential backups
        NFR-P: Incremental <10 min for 100GB, Full <2 hours for 1TB

        Args:
            database_id: Database to backup
            backup_type: 'full' | 'incremental' | 'differential'
            context: Contains database data, storage, previous backups

        Returns:
            {
                'backup_id': str,
                'type': str,
                'size_bytes': int,
                'duration_seconds': float,
                'parent_backup_id': str | None  # For incremental
            }
        """
        # Get database data
        database_data = context['databases'].get(database_id, {})
        total_size = database_data.get('size_bytes', 0)

        # Find previous backup for incremental
        previous_backups = [b for b in self.backups.values() if b['database_id'] == database_id]
        previous_backups.sort(key=lambda x: x['timestamp'], reverse=True)

        parent_backup = None
        backup_size = total_size

        if backup_type == 'incremental' and previous_backups:
            # Incremental: Only changes since last backup
            parent_backup = previous_backups[0]
            last_backup_time = parent_backup['timestamp']

            # Calculate changes since last backup
            # Assume 1% of data changes per hour (simplified model)
            hours_since_last = (datetime.now() - last_backup_time).total_seconds() / 3600
            change_percentage = min(1.0, hours_since_last * 0.01)  # 1% per hour, max 100%
            backup_size = int(total_size * change_percentage)

        elif backup_type == 'differential' and previous_backups:
            # Differential: Changes since last FULL backup
            full_backups = [b for b in previous_backups if b['type'] == 'full']
            if full_backups:
                parent_backup = full_backups[0]
                last_full_time = parent_backup['timestamp']
                hours_since_full = (datetime.now() - last_full_time).total_seconds() / 3600
                change_percentage = min(1.0, hours_since_full * 0.01)
                backup_size = int(total_size * change_percentage)

        # Calculate backup duration (NFR-P)
        # Full: 1TB in 2 hours = ~140 MB/s
        # Incremental: 100GB in 10 min = ~170 MB/s
        throughput_mb_per_sec = 170 if backup_type == 'incremental' else 140
        duration_seconds = backup_size / (throughput_mb_per_sec * 1024 * 1024)

        # Apply compression (3-5x reduction)
        compression_ratio = 4
        compressed_size = backup_size // compression_ratio

        # Generate backup ID
        backup_id = f"{database_id}:{backup_type}:{int(datetime.now().timestamp())}"

        # Store backup metadata
        backup_metadata = {
            'backup_id': backup_id,
            'database_id': database_id,
            'type': backup_type,
            'size_bytes': compressed_size,
            'uncompressed_size_bytes': backup_size,
            'duration_seconds': round(duration_seconds, 2),
            'parent_backup_id': parent_backup['backup_id'] if parent_backup else None,
            'timestamp': datetime.now(),
            'status': 'completed',
            'storage_tier': 'hot',  # Start in hot tier
            'region': context.get('region', 'us-east-1')
        }

        self.backups[backup_id] = backup_metadata

        # Store in S3 (simulated)
        context['storage'].put(
            key=f"backups/{database_id}/{backup_id}",
            data={'metadata': backup_metadata},
            storage_class='STANDARD'
        )

        return {
            'backup_id': backup_id,
            'type': backup_type,
            'size_bytes': compressed_size,
            'duration_seconds': round(duration_seconds, 2),
            'parent_backup_id': parent_backup['backup_id'] if parent_backup else None
        }

    def schedule_backups(self, database_id: str, schedule_config: dict) -> dict:
        """
        Configure automated backup schedule.

        FR: Automated scheduling (daily, weekly, monthly)
        FR: Retention policies (keep 7 daily, 4 weekly, 12 monthly)

        Args:
            database_id: Database to schedule backups for
            schedule_config: {
                'daily_at': '02:00',  # Full backup daily at 2 AM
                'incremental_interval_hours': 6,  # Incremental every 6 hours
                'retention': {
                    'daily': 7,    # Keep 7 daily backups
                    'weekly': 4,   # Keep 4 weekly backups
                    'monthly': 12  # Keep 12 monthly backups
                }
            }

        Returns:
            {
                'database_id': str,
                'next_full_backup': datetime,
                'next_incremental_backup': datetime,
                'retention_policy': dict
            }
        """
        # Parse schedule
        daily_hour = int(schedule_config['daily_at'].split(':')[0])
        incremental_interval = schedule_config['incremental_interval_hours']

        # Calculate next backup times
        now = datetime.now()
        next_full = datetime(now.year, now.month, now.day, daily_hour, 0, 0)
        if next_full <= now:
            next_full += timedelta(days=1)

        # Next incremental is X hours from now
        next_incremental = now + timedelta(hours=incremental_interval)

        # Store schedule
        self.schedules[database_id] = {
            'database_id': database_id,
            'daily_at': schedule_config['daily_at'],
            'incremental_interval_hours': incremental_interval,
            'retention': schedule_config['retention'],
            'next_full_backup': next_full,
            'next_incremental_backup': next_incremental
        }

        return {
            'database_id': database_id,
            'next_full_backup': next_full.isoformat(),
            'next_incremental_backup': next_incremental.isoformat(),
            'retention_policy': schedule_config['retention']
        }

    def restore_pitr(self, database_id: str, target_timestamp: datetime, context: dict) -> dict:
        """
        Point-in-time recovery to specific timestamp.

        FR: Restore to specific timestamp using full backup + WAL replay
        NFR-P: RTO <1 hour for 500GB
        NFR-R: RPO <5 minutes (minimal data loss)

        Args:
            database_id: Database to restore
            target_timestamp: Timestamp to restore to
            context: Contains backups, WAL logs, storage

        Returns:
            {
                'restore_id': str,
                'base_backup_id': str,  # Full backup used as base
                'wal_entries_applied': int,  # WAL entries replayed
                'recovered_to_timestamp': datetime,
                'data_loss_seconds': float,  # Actual RPO achieved
                'restore_duration_seconds': float
            }
        """
        # Find latest full backup BEFORE target timestamp
        full_backups = [
            b for b in self.backups.values()
            if b['database_id'] == database_id
            and b['type'] == 'full'
            and b['timestamp'] <= target_timestamp
        ]

        if not full_backups:
            return {'success': False, 'error': 'No full backup found before target timestamp'}

        # Use latest full backup before target time
        full_backups.sort(key=lambda x: x['timestamp'], reverse=True)
        base_backup = full_backups[0]

        # Get WAL logs between base backup and target timestamp
        wal_entries = self.wal_logs.get(database_id, [])
        relevant_wal = [
            entry for entry in wal_entries
            if base_backup['timestamp'] <= entry['timestamp'] <= target_timestamp
        ]

        # Sort WAL entries by timestamp
        relevant_wal.sort(key=lambda x: x['timestamp'])

        # Calculate restore duration (NFR-P: RTO <1 hour for 500GB)
        # Restore = Uncompress base backup + Apply WAL entries
        base_size = base_backup['uncompressed_size_bytes']
        restore_throughput = 200 * 1024 * 1024  # 200 MB/s restore speed
        base_restore_time = base_size / restore_throughput

        # WAL replay: ~10K transactions/sec
        wal_replay_time = len(relevant_wal) / 10000

        total_restore_time = base_restore_time + wal_replay_time

        # Determine actual recovered timestamp (last WAL entry applied)
        if relevant_wal:
            recovered_to = relevant_wal[-1]['timestamp']
        else:
            recovered_to = base_backup['timestamp']

        # Calculate data loss (RPO)
        data_loss_seconds = (target_timestamp - recovered_to).total_seconds()

        # Generate restore ID
        restore_id = f"restore:{database_id}:{int(datetime.now().timestamp())}"

        # Store restore job
        restore_job = {
            'restore_id': restore_id,
            'database_id': database_id,
            'base_backup_id': base_backup['backup_id'],
            'wal_entries_applied': len(relevant_wal),
            'target_timestamp': target_timestamp,
            'recovered_to_timestamp': recovered_to,
            'data_loss_seconds': round(data_loss_seconds, 2),
            'restore_duration_seconds': round(total_restore_time, 2),
            'status': 'completed'
        }

        self.restore_jobs[restore_id] = restore_job

        return {
            'restore_id': restore_id,
            'base_backup_id': base_backup['backup_id'],
            'wal_entries_applied': len(relevant_wal),
            'recovered_to_timestamp': recovered_to.isoformat(),
            'data_loss_seconds': round(data_loss_seconds, 2),
            'restore_duration_seconds': round(total_restore_time, 2)
        }

    def verify_backup(self, backup_id: str, context: dict) -> dict:
        """
        Verify backup integrity by performing test restore.

        FR: Backup verification to ensure backups are restorable
        NFR-R: 100% of backups tested monthly

        Args:
            backup_id: Backup to verify
            context: Contains storage for backup data

        Returns:
            {
                'backup_id': str,
                'verified': bool,
                'verification_method': str,  # 'checksum' | 'test_restore'
                'verified_at': datetime
            }
        """
        if backup_id not in self.backups:
            return {'verified': False, 'error': 'Backup not found'}

        backup = self.backups[backup_id]

        # Method 1: Checksum verification (fast, but doesn't test restore path)
        # Method 2: Test restore (slow, but comprehensive)

        # For full backups, do test restore
        # For incremental, checksum is sufficient
        if backup['type'] == 'full':
            verification_method = 'test_restore'

            # Simulate test restore (partial restore of 1% of data)
            test_size = backup['uncompressed_size_bytes'] * 0.01
            restore_throughput = 200 * 1024 * 1024  # 200 MB/s
            verification_time = test_size / restore_throughput

        else:
            verification_method = 'checksum'
            verification_time = 0.1  # Fast checksum

        # Update backup metadata
        backup['verified_at'] = datetime.now()
        backup['verification_method'] = verification_method

        return {
            'backup_id': backup_id,
            'verified': True,
            'verification_method': verification_method,
            'verified_at': backup['verified_at'].isoformat(),
            'verification_duration_seconds': round(verification_time, 2)
        }

    def apply_retention_policy(self, database_id: str, context: dict) -> dict:
        """
        Clean up old backups based on retention policy.

        FR: Retention policies (keep 7 daily, 4 weekly, 12 monthly)
        NFR-C: Reduce storage costs by deleting old backups

        Args:
            database_id: Database to apply retention to
            context: Contains current time

        Returns:
            {
                'deleted_backups': [backup_ids],
                'retained_backups': [backup_ids],
                'storage_freed_bytes': int
            }
        """
        if database_id not in self.schedules:
            return {'error': 'No schedule found for database'}

        retention_policy = self.schedules[database_id]['retention']

        # Get all backups for this database
        db_backups = [b for b in self.backups.values() if b['database_id'] == database_id]
        db_backups.sort(key=lambda x: x['timestamp'], reverse=True)

        now = datetime.now()

        # Categorize backups
        daily_backups = []
        weekly_backups = []
        monthly_backups = []

        for backup in db_backups:
            age_days = (now - backup['timestamp']).days

            if age_days < 7:
                daily_backups.append(backup)
            elif age_days < 30:
                # Keep one backup per week
                week_num = age_days // 7
                if week_num < len(weekly_backups):
                    continue
                weekly_backups.append(backup)
            else:
                # Keep one backup per month
                month_num = age_days // 30
                if month_num < len(monthly_backups):
                    continue
                monthly_backups.append(backup)

        # Apply retention limits
        to_keep = []
        to_keep.extend(daily_backups[:retention_policy['daily']])
        to_keep.extend(weekly_backups[:retention_policy['weekly']])
        to_keep.extend(monthly_backups[:retention_policy['monthly']])

        to_keep_ids = {b['backup_id'] for b in to_keep}

        # Delete old backups
        to_delete = [b for b in db_backups if b['backup_id'] not in to_keep_ids]

        storage_freed = sum(b['size_bytes'] for b in to_delete)

        # Delete from storage
        for backup in to_delete:
            del self.backups[backup['backup_id']]
            context['storage'].delete(f"backups/{database_id}/{backup['backup_id']}")

        return {
            'deleted_backups': [b['backup_id'] for b in to_delete],
            'retained_backups': [b['backup_id'] for b in to_keep],
            'storage_freed_bytes': storage_freed,
            'retained_count': len(to_keep),
            'deleted_count': len(to_delete)
        }

    def capture_wal_entry(self, database_id: str, transaction: dict) -> dict:
        """
        Capture write-ahead log (WAL) entry for continuous backup.

        FR: Continuous backup for point-in-time recovery
        NFR-R: RPO <5 minutes

        Args:
            database_id: Database generating WAL
            transaction: Transaction to log

        Returns:
            {
                'wal_id': str,
                'timestamp': datetime,
                'transaction_id': str
            }
        """
        # Create WAL entry
        wal_entry = {
            'wal_id': f"wal:{database_id}:{transaction['transaction_id']}",
            'database_id': database_id,
            'transaction_id': transaction['transaction_id'],
            'operation': transaction['operation'],  # INSERT, UPDATE, DELETE
            'table': transaction.get('table'),
            'data': transaction.get('data'),
            'timestamp': datetime.now()
        }

        # Append to WAL log
        if database_id not in self.wal_logs:
            self.wal_logs[database_id] = []

        self.wal_logs[database_id].append(wal_entry)

        # Stream to backup storage (for durability)
        # In real system, this would be sent to S3/Kafka immediately

        return {
            'wal_id': wal_entry['wal_id'],
            'timestamp': wal_entry['timestamp'].isoformat(),
            'transaction_id': transaction['transaction_id']
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "create_full_backup",
        "description": "FR: Full backup creation, NFR-P: 1TB in <2 hours",
        "input": {
            "operation": "create_backup",
            "database_id": "prod-db-1",
            "backup_type": "full",
            "context": {
                "databases": {
                    "prod-db-1": {
                        "size_bytes": 1024 * 1024 * 1024 * 1024,  # 1 TB
                        "name": "production_database"
                    }
                },
                "storage": {"mock": True},
                "region": "us-east-1"
            }
        },
        "expected_output": {
            "backup_id": "<auto-generated>",
            "type": "full",
            "size_bytes": "<compressed ~256GB>",  # 4x compression
            "duration_seconds": "<7200",  # <2 hours
            "parent_backup_id": None
        }
    },
    {
        "id": 2,
        "name": "create_incremental_backup",
        "description": "FR: Incremental backup (only changes), NFR-P: 100GB in <10 min",
        "input": {
            "operation": "create_incremental_backup",
            "setup": {
                "create_full_backup": {
                    "database_id": "analytics-db",
                    "backup_type": "full",
                    "context": {
                        "databases": {
                            "analytics-db": {
                                "size_bytes": 500 * 1024 * 1024 * 1024  # 500 GB
                            }
                        },
                        "storage": {"mock": True}
                    }
                }
            },
            "database_id": "analytics-db",
            "backup_type": "incremental",
            "context": {
                "databases": {
                    "analytics-db": {
                        "size_bytes": 500 * 1024 * 1024 * 1024
                    }
                },
                "storage": {"mock": True},
                "time_since_last_backup_hours": 2  # 2% of data changed
            }
        },
        "expected_output": {
            "backup_id": "<auto-generated>",
            "type": "incremental",
            "size_bytes": "<~2.5GB compressed>",  # 2% of 500GB = 10GB, compressed 4x = 2.5GB
            "duration_seconds": "<600",  # <10 minutes
            "parent_backup_id": "<full-backup-id>"
        }
    },
    {
        "id": 3,
        "name": "schedule_backups",
        "description": "FR: Automated scheduling with retention policy",
        "input": {
            "operation": "schedule_backups",
            "database_id": "users-db",
            "schedule_config": {
                "daily_at": "02:00",
                "incremental_interval_hours": 6,
                "retention": {
                    "daily": 7,
                    "weekly": 4,
                    "monthly": 12
                }
            }
        },
        "expected_output": {
            "database_id": "users-db",
            "next_full_backup": "<tomorrow at 02:00>",
            "next_incremental_backup": "<6 hours from now>",
            "retention_policy": {
                "daily": 7,
                "weekly": 4,
                "monthly": 12
            }
        }
    },
    {
        "id": 4,
        "name": "restore_pitr",
        "description": "FR: Point-in-time recovery, NFR-R: RPO <5 min, NFR-P: RTO <1 hour",
        "input": {
            "operation": "restore_pitr",
            "setup": {
                "create_backup": {
                    "database_id": "payments-db",
                    "backup_type": "full",
                    "context": {
                        "databases": {
                            "payments-db": {"size_bytes": 500 * 1024 * 1024 * 1024}
                        },
                        "storage": {"mock": True}
                    }
                },
                "capture_wal": {
                    "database_id": "payments-db",
                    "transactions": [
                        {"transaction_id": "tx1", "operation": "INSERT", "table": "orders"},
                        {"transaction_id": "tx2", "operation": "UPDATE", "table": "payments"}
                    ]
                }
            },
            "database_id": "payments-db",
            "target_timestamp": "<2 minutes after backup>",
            "context": {
                "storage": {"mock": True}
            }
        },
        "expected_output": {
            "restore_id": "<auto-generated>",
            "base_backup_id": "<full-backup-id>",
            "wal_entries_applied": 2,
            "recovered_to_timestamp": "<actual timestamp of last WAL>",
            "data_loss_seconds": "<300",  # <5 minutes RPO
            "restore_duration_seconds": "<3600"  # <1 hour RTO
        }
    },
    {
        "id": 5,
        "name": "verify_backup",
        "description": "FR: Backup verification, NFR-R: 100% tested monthly",
        "input": {
            "operation": "verify_backup",
            "setup": {
                "create_backup": {
                    "database_id": "critical-db",
                    "backup_type": "full",
                    "context": {
                        "databases": {
                            "critical-db": {"size_bytes": 100 * 1024 * 1024 * 1024}  # 100GB
                        },
                        "storage": {"mock": True}
                    }
                }
            },
            "context": {
                "storage": {"mock": True}
            }
        },
        "expected_output": {
            "backup_id": "<full-backup-id>",
            "verified": True,
            "verification_method": "test_restore",  # Full backups use test restore
            "verified_at": "<timestamp>",
            "verification_duration_seconds": "<600"  # Test restore 1% of 100GB
        }
    },
    {
        "id": 6,
        "name": "apply_retention_policy",
        "description": "FR: Retention policy (7 daily, 4 weekly, 12 monthly), NFR-C: Reduce storage costs",
        "input": {
            "operation": "apply_retention_policy",
            "setup": {
                "schedule": {
                    "database_id": "logs-db",
                    "schedule_config": {
                        "daily_at": "02:00",
                        "incremental_interval_hours": 6,
                        "retention": {
                            "daily": 7,
                            "weekly": 4,
                            "monthly": 12
                        }
                    }
                },
                "create_backups": {
                    "database_id": "logs-db",
                    "count": 100,  # Create 100 backups over 100 days
                    "size_each": 10 * 1024 * 1024 * 1024  # 10 GB each
                }
            },
            "database_id": "logs-db",
            "context": {
                "storage": {"mock": True}
            }
        },
        "expected_output": {
            "deleted_backups": "<list of old backup IDs>",
            "retained_backups": "<list of kept backup IDs>",
            "storage_freed_bytes": "<large amount>",
            "retained_count": 23,  # 7 daily + 4 weekly + 12 monthly
            "deleted_count": 77    # 100 - 23
        }
    },
    {
        "id": 7,
        "name": "capture_wal_continuous_backup",
        "description": "FR: Continuous backup via WAL, NFR-R: RPO <5 minutes",
        "input": {
            "operation": "capture_wal_entry",
            "database_id": "transactions-db",
            "transaction": {
                "transaction_id": "tx-12345",
                "operation": "INSERT",
                "table": "transactions",
                "data": {"amount": 100.50, "user_id": "user-1"}
            }
        },
        "expected_output": {
            "wal_id": "wal:transactions-db:tx-12345",
            "timestamp": "<current timestamp>",
            "transaction_id": "tx-12345"
        }
    },
    {
        "id": 8,
        "name": "nfr_scalability_parallel_backups",
        "description": "NFR-S: Support 100+ concurrent backups",
        "input": {
            "operation": "create_multiple_backups",
            "database_count": 100,
            "backup_type": "incremental",
            "context": {
                "databases": {
                    f"db-{i}": {"size_bytes": 10 * 1024 * 1024 * 1024}  # 10GB each
                    for i in range(100)
                },
                "storage": {"mock": True}
            }
        },
        "expected_output": {
            "total_backups": 100,
            "success_count": 100,
            "total_duration_seconds": "<3600",  # All complete within 1 hour (parallel)
            "average_backup_duration_seconds": "<60"  # Each backup ~1 min
        }
    }
]

`;
export const backupRestoreServiceChallenge: SystemDesignChallenge = {
  id: 'backup_restore_service',
  title: 'Backup & Restore Service',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design an enterprise-grade Backup & Restore Service that provides automated backups, point-in-time recovery, cross-region replication, and RPO/RTO guarantees for disaster recovery.

**Real-world Context:**
At AWS RDS, backups are critical for customer trust. The system performs daily full backups + continuous transaction log backups, enabling point-in-time recovery to any second within the retention period. If a customer accidentally deletes data at 2:37 PM, they can restore to 2:36 PM with <5 minutes of data loss.

**Key Technical Challenges:**
1. **Incremental Backups**: How do you minimize backup time/storage while ensuring fast recovery?
2. **Point-in-Time Recovery**: How do you restore to an arbitrary timestamp (not just backup snapshots)?
3. **RPO/RTO Guarantees**: How do you meet <5 min data loss (RPO) and <1 hour downtime (RTO)?
4. **Cost Optimization**: How do you balance durability, performance, and cost (hot/warm/cold storage)?

**Companies Asking This:** Google (Cloud Backup), AWS (RDS Backups), MongoDB (Atlas), Uber, Netflix`,

  realWorldScenario: {
    company: 'AWS RDS',
    context: 'Customer accidentally drops production table at 2:37 PM. Needs restore to 2:36 PM.',
    constraint: 'Must recover within 1 hour (RTO) with <5 minutes data loss (RPO).'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Incremental Backups',
      content: 'Full backup = complete snapshot. Incremental = only changes since last backup. Use parent_backup_id to chain incrementals. Reduces storage by 90%.'
    },
    {
      stage: 'FR',
      title: 'Point-in-Time Recovery',
      content: 'PITR = Base full backup + WAL replay. Find latest full backup before target time, then apply WAL entries up to target timestamp. Achieves <5 min RPO.'
    },
    {
      stage: 'FR',
      title: 'Retention Policy',
      content: 'Keep 7 daily, 4 weekly, 12 monthly backups. Delete old backups to save costs. Monthly backups can go to Glacier (80% cheaper).'
    },
    {
      stage: 'NFR-P',
      title: 'Backup Performance',
      content: 'Full backup: 1TB in <2 hours (~140 MB/s). Incremental: 100GB in <10 min (~170 MB/s). Use parallel upload to S3 with multipart.'
    },
    {
      stage: 'NFR-R',
      title: 'RPO/RTO',
      content: 'RPO: Continuous WAL streaming achieves <5 min data loss. RTO: Parallel restore from S3 + WAL replay achieves <1 hour recovery for 500GB.'
    },
    {
      stage: 'NFR-C',
      title: 'Cost Optimization',
      content: 'Use compression (3-5x). Incremental backups (90% savings). Lifecycle to Glacier after 30 days (80% cost reduction). S3 durability: 11 nines.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Creates full and incremental backups correctly',
        'Schedules automated backups with retention policy',
        'Point-in-time recovery uses base backup + WAL replay',
        'Verifies backup integrity (checksum or test restore)',
        'Applies retention policy (deletes old backups)'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Full backup: 1TB in <2 hours',
        'Incremental backup: 100GB in <10 min',
        'Restore (RTO): 500GB in <1 hour',
        'PITR recovery lag: <15 minutes'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 10K+ databases per cluster',
        'Handles 100TB+ total backup storage',
        'Parallel backups: 100+ concurrent',
        'Multi-region replication for DR'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of backup creation, scheduling, and restore logic',
        'Proper calculation of backup sizes (incremental vs full)',
        'WAL log management for PITR',
        'Clean test cases covering full/incremental backups, PITR, retention'
      ]
    }
  },

  commonMistakes: [
    'No incremental backups → wastes storage and backup time (90% overhead)',
    'No WAL logging → can only restore to backup snapshots, not arbitrary timestamps',
    'No retention policy → storage costs grow unbounded',
    'No backup verification → discover backups are corrupted when you need them',
    'Synchronous backups → blocks database writes during backup',
    'No compression → 3-5x higher storage costs'
  ],

  companiesAsking: ['Google', 'AWS', 'MongoDB', 'Uber', 'Airbnb', 'Netflix'],
  relatedPatterns: [
    'Zero-Downtime Migration (backup/restore for data migration)',
    'Multi-Region Failover (cross-region backup replication)',
    'Data Replication Service (continuous backup similar to replication)',
    'ETL Orchestration (backup scheduling similar to job scheduling)'
  ]
};
