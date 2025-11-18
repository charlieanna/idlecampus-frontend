import { Challenge } from '../../types/testCase';

export const secretManagementChallenge: Challenge = {
  id: 'secret_management',
  title: 'Secret Management System (HashiCorp Vault / Google Secret Manager)',
  difficulty: 'advanced',
  description: `Design an internal secret management system for storing API keys, passwords, certificates.

Engineers can:
- Store secrets with version history
- Rotate secrets automatically
- Control access with fine-grained permissions
- Audit all secret access

Example:
- Store: database_password = "hunter2" (encrypted at rest)
- Access: GET /secrets/database_password → requires auth + permission
- Rotate: Old password still works for 24h (grace period)
- Audit: Who accessed database_password? When?

Key challenges:
- Encryption at rest and in transit
- High availability (apps can't start without secrets!)
- Automatic rotation without downtime
- Audit logging for compliance`,

  requirements: {
    functional: [
      'Store secrets with encryption at rest',
      'Version history (rollback if rotation breaks)',
      'Automatic rotation (passwords, API keys)',
      'Fine-grained access control (who can read what)',
      'Audit logging (all access tracked)',
    ],
    traffic: '5,000 RPS secret reads (app startup + periodic refresh)',
    latency: 'p99 < 50ms for reads',
    availability: '99.99% uptime (apps depend on this!)',
    budget: '$3,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Secret Storage',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Store and retrieve secrets with encryption.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.8,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        encrypted: true, // Secrets must be encrypted at rest
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500, encryption: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Basic secret storage with encryption:

**Encryption layers:**
1. **At rest**: PostgreSQL encryption (database level)
2. **In app**: Application-level encryption (AES-256)
3. **In transit**: TLS for all connections

**Storage format:**
Table: secrets
- id, name, encrypted_value, encryption_key_id, version, created_at

encrypted_value = AES256(plaintext_secret, master_key)

**Key management:**
- Master key stored in HSM or KMS (not in code!)
- Rotate master key annually
- Use envelope encryption (data key encrypted with master key)`,
      },
    },

    {
      name: 'Access Control',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Enforce fine-grained permissions (service A can read secret X, service B cannot).',
      traffic: {
        type: 'read',
        rps: 50,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        unauthorizedAccessBlocked: true,
      },
    },

    {
      name: 'Secret Rotation with Grace Period',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Rotate secret. Old version valid for 24h grace period to avoid breaking apps.',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.95,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        gracePeriodEnforced: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500, encryption: true } },
          { type: 'redis', config: { maxMemoryMB: 1024 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Secret rotation without downtime:

**Problem - Naive rotation:**
1. Rotate password in database: old_pass → new_pass
2. App servers still using old_pass
3. Database rejects connections ❌
4. Outage!

**Solution - Grace period:**

**Storage:**
secrets table:
- name: "database_password"
- versions: [
    {version: 2, value: "new_pass", created: now, active: true},
    {version: 1, value: "old_pass", created: now-1h, active: true, expires: now+24h}
  ]

**Read logic:**
GET /secrets/database_password
→ Returns BOTH versions (new + old still valid)
→ App can use either for 24h

**Write logic (in database):**
Accept old_pass for 24h ✅
Prefer new_pass (primary)

**After 24h:**
- old_pass expires (active: false)
- Only new_pass works
- All apps should have refreshed by now

**Key insight:**
Grace period allows gradual migration without coordinated rollout!`,
      },
    },

    {
      name: 'Audit Logging',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Track all secret access (who, what, when) for compliance.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        auditLogsComplete: true,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High-Frequency Secret Reads',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 5,000 RPS secret reads (apps refreshing secrets periodically).',
      traffic: {
        type: 'read',
        rps: 5000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 50,
        maxErrorRate: 0.001,
        maxMonthlyCost: 3000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500, encryption: true, replication: true } },
          { type: 's3', config: { storageSizeGB: 100 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `High-performance secret serving:

**Challenge:**
- 5,000 RPS = high read load
- Can't cache secrets aggressively (security risk!)
- Need encryption/decryption per request (CPU intensive)

**Architecture:**

**Cache strategy (careful!):**
- Redis: Cache encrypted secrets (not plaintext!) ✅
- TTL: 5 minutes (short!)
- Decrypt in-app only when needed

**Why cache encrypted secrets?**
- Reduces database load
- Still requires decryption key (not in cache)
- Compromise of Redis doesn't leak secrets

**Read path:**
1. GET /secrets/db_password
2. Check Redis: cached encrypted value? → decrypt in-app ✅
3. Cache miss → PostgreSQL → decrypt → cache encrypted value
4. Return plaintext only to authorized caller

**Cost breakdown (~$2,800/month):**
- 5 app servers: $1,000
- PostgreSQL with encryption + replication: $800
- Redis 2GB: $200
- S3 (audit logs): $2.30 (100GB)
- Load Balancer: $100
- HSM/KMS: $700`,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Database Failure - Cached Secrets',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Database fails. System serves secrets from Redis cache (degraded mode).',
      traffic: {
        type: 'read',
        rps: 5000,
      },
      duration: 120,
      failureInjection: {
        type: 'db_crash',
        atSecond: 30,
      },
      passCriteria: {
        minAvailability: 0.99, // 99% (cache hits continue working)
        maxErrorRate: 0.05, // 5% errors (cache misses fail)
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500, encryption: true, replication: true } },
          { type: 's3', config: { storageSizeGB: 100 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `High availability for secret management:

**Why 99.99% availability is critical:**
- Apps can't start without secrets
- Database credentials, API keys needed immediately
- Downtime = ALL apps down ❌

**Failover strategy:**

**Normal mode:**
- PostgreSQL with replication: <30 sec failover ✅
- Redis cache: Serves during brief failover

**Database down (>30 sec):**
- Redis cache hits: Continue working ✅ (95% of requests)
- Cache misses: Fail ❌ (5% of requests)
- No writes (can't rotate secrets)

**Degraded mode behavior:**
1. Serve cached secrets (encrypted in Redis)
2. Return stale data if needed (better than nothing!)
3. Block writes (can't rotate during outage)
4. Alert on-call immediately

**Key trade-off:**
Availability (serve stale) vs Security (fail closed)
→ For secrets, availability wins (apps need to function!)`,
      },
    },

    {
      name: 'Encryption Key Rotation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Rotate encryption master key annually. Re-encrypt all secrets with new key.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.8,
      },
      duration: 180,
      passCriteria: {
        maxErrorRate: 0,
        reencryptionComplete: true,
      },
    },
  ],

  learningObjectives: [
    'Design encryption at rest and in transit',
    'Implement secret rotation with grace periods',
    'Fine-grained access control with audit logging',
    'High availability for critical infrastructure',
    'Envelope encryption with KMS/HSM',
  ],

  hints: [
    {
      trigger: 'test_failed:Secret Rotation with Grace Period',
      message: `💡 Secret rotation is causing app outages!

**Problem:**
1. Rotate database password
2. App servers still using old password
3. Database rejects connections ❌
4. Apps crash!

**Root cause:**
Instant rotation with no transition period

**Solution - Grace period (dual-auth):**

**Before rotation:**
secrets.database_password.versions = [
  {version: 1, value: "old_pass", active: true}
]

**During rotation:**
secrets.database_password.versions = [
  {version: 2, value: "new_pass", active: true},
  {version: 1, value: "old_pass", active: true, expires_at: now+24h}
]

**After 24h:**
secrets.database_password.versions = [
  {version: 2, value: "new_pass", active: true},
  {version: 1, value: "old_pass", active: false}  # Expired
]

**App behavior:**
- GET /secrets/database_password → returns newest version
- GET /secrets/database_password?all=true → returns all active versions
- Use newest, fall back to old if connection fails

**Database behavior:**
- Accept both old_pass and new_pass for 24h
- After 24h, reject old_pass

This gives apps 24h to refresh!`,
    },
    {
      trigger: 'test_failed:Access Control',
      message: `💡 Unauthorized services are accessing secrets!

**Problem:**
Any service can read any secret ❌

**Solution - IAM-style permissions:**

**Policy model:**
{
  "service": "api-server",
  "permissions": [
    {"action": "read", "secret": "database_password"},
    {"action": "read", "secret": "stripe_api_key"}
  ]
}

{
  "service": "worker",
  "permissions": [
    {"action": "read", "secret": "database_password"}
    # NO access to stripe_api_key!
  ]
}

**Enforcement:**
GET /secrets/stripe_api_key
Authorization: Bearer <api-server-token>

1. Verify token (JWT signature)
2. Extract service identity: "api-server"
3. Check permissions: api-server allowed to read stripe_api_key? ✅
4. Return secret

**Audit log:**
{
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "api-server",
  "action": "read",
  "secret": "stripe_api_key",
  "result": "allowed"
}

Store permissions in PostgreSQL, cache in Redis!`,
    },
    {
      trigger: 'test_failed:High-Frequency Secret Reads',
      message: `💡 Database is overwhelmed by secret reads!

**Problem:**
- 5,000 RPS hitting PostgreSQL
- Encryption/decryption on every request
- Database CPU at 100% ❌

**Solution - Caching (carefully!):**

**WRONG approach:** ❌
Cache plaintext secrets in Redis
→ Redis compromise = all secrets leaked!

**RIGHT approach:** ✅
Cache ENCRYPTED secrets in Redis

**Flow:**
1. GET /secrets/db_password
2. Check Redis: encrypted_value = cache.get("db_password")
3. If hit:
   - Decrypt in-app: plaintext = AES256.decrypt(encrypted_value, master_key)
   - Return plaintext to caller
4. If miss:
   - Fetch from PostgreSQL (encrypted)
   - Cache encrypted value in Redis (TTL: 5 min)
   - Decrypt and return

**Why this is secure:**
- Redis has encrypted data only
- Master key never in Redis
- Redis compromise doesn't leak secrets
- Still need app + master key to decrypt

**Performance:**
- 95% cache hit ratio
- 250 RPS → PostgreSQL (manageable)
- Decryption in-app (fast: 0.1ms)

Add Redis cache for encrypted secrets!`,
    },
  ],

  pythonTemplate: `# Secret Management System
# Implement encryption, rotation, and access control

from cryptography.fernet import Fernet
import time
from typing import Dict, List, Optional

# Master encryption key (in production, get from KMS/HSM!)
MASTER_KEY = Fernet.generate_key()
cipher = Fernet(MASTER_KEY)


def encrypt_secret(plaintext: str) -> str:
    """
    Encrypt secret with master key.

    Args:
        plaintext: Secret value

    Returns:
        Encrypted value (base64)
    """
    return cipher.encrypt(plaintext.encode()).decode()


def decrypt_secret(encrypted: str) -> str:
    """
    Decrypt secret with master key.

    Args:
        encrypted: Encrypted value (base64)

    Returns:
        Plaintext secret
    """
    return cipher.decrypt(encrypted.encode()).decode()


def store_secret(name: str, value: str, context: dict) -> dict:
    """
    Store secret with encryption and versioning.

    Args:
        name: Secret name (e.g., "database_password")
        value: Plaintext secret value
        context: Shared context

    Returns:
        {
            'name': 'database_password',
            'version': 2,
            'created_at': 1234567890
        }

    Requirements:
    - Encrypt value before storing
    - Version the secret (increment version number)
    - Store in PostgreSQL with encryption
    - Invalidate cache
    """
    encrypted_value = encrypt_secret(value)

    # Your code here
    # Store in database: (name, encrypted_value, version, created_at)

    return {}


def get_secret(name: str, service_identity: str, context: dict) -> str:
    """
    Retrieve secret with access control.

    Args:
        name: Secret name
        service_identity: Caller's service identity
        context: Shared context

    Returns:
        Plaintext secret value

    Requirements:
    - Check access control (service allowed to read this secret?)
    - Check cache (Redis) for encrypted value
    - If miss, fetch from PostgreSQL
    - Decrypt value
    - Log access to audit log
    - Return plaintext
    """
    # Check permission
    if not check_permission(service_identity, name, 'read', context):
        raise PermissionError(f"{service_identity} cannot read {name}")

    # Check cache
    cache_key = f"secret:{name}"
    encrypted_value = context.get('cache', {}).get(cache_key)

    if not encrypted_value:
        # Cache miss - fetch from database
        # Your code here
        pass

    # Decrypt
    plaintext = decrypt_secret(encrypted_value)

    # Audit log
    log_access(service_identity, name, 'read', 'allowed', context)

    return plaintext


def rotate_secret(name: str, new_value: str, grace_period_hours: int, context: dict) -> dict:
    """
    Rotate secret with grace period.

    Args:
        name: Secret name
        new_value: New secret value
        grace_period_hours: Hours to keep old version active
        context: Shared context

    Returns:
        {
            'name': 'database_password',
            'old_version': 1,
            'new_version': 2,
            'grace_period_expires_at': 1234567890
        }

    Requirements:
    - Encrypt new value
    - Create new version
    - Keep old version active with expiry timestamp
    - Store both versions
    - Invalidate cache
    """
    encrypted_new = encrypt_secret(new_value)
    expires_at = time.time() + (grace_period_hours * 3600)

    # Your code here
    # Update database:
    # - Add new version (active: true)
    # - Update old version (active: true, expires_at: expires_at)

    return {}


def get_all_active_versions(name: str, context: dict) -> List[dict]:
    """
    Get all active versions of a secret (for grace period).

    Args:
        name: Secret name
        context: Shared context

    Returns:
        [
            {'version': 2, 'value': 'new_pass', 'created_at': 1234567890},
            {'version': 1, 'value': 'old_pass', 'expires_at': 1234567890}
        ]

    Requirements:
    - Fetch all versions from database
    - Filter: active = true AND (expires_at is null OR expires_at > now)
    - Decrypt all values
    - Return sorted by version DESC
    """
    # Your code here
    return []


def check_permission(service_identity: str, secret_name: str, action: str, context: dict) -> bool:
    """
    Check if service has permission to access secret.

    Args:
        service_identity: Service making request
        secret_name: Secret being accessed
        action: 'read' or 'write'
        context: Shared context

    Returns:
        True if allowed

    Requirements:
    - Query permissions from database
    - Check: (service, secret, action) in permissions table?
    - Cache permissions in Redis
    """
    # Your code here
    return False


def log_access(service: str, secret: str, action: str, result: str, context: dict):
    """
    Log secret access for audit.

    Args:
        service: Service that accessed secret
        secret: Secret name
        action: 'read' or 'write'
        result: 'allowed' or 'denied'
        context: Shared context

    Requirements:
    - Write to audit log (S3 or PostgreSQL)
    - Include timestamp, service, secret, action, result
    - Async logging (don't block request!)
    """
    audit_entry = {
        'timestamp': time.time(),
        'service': service,
        'secret': secret,
        'action': action,
        'result': result,
    }

    # Your code here (async write to S3 or PostgreSQL)
    pass


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle secret management API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})
    service = request.get('service_identity', '')

    # POST /secrets - Store secret
    if method == 'POST' and path == '/secrets':
        name = body.get('name', '')
        value = body.get('value', '')
        result = store_secret(name, value, context)
        return {'status': 201, 'body': result}

    # GET /secrets/:name - Get secret
    elif method == 'GET' and path.startswith('/secrets/'):
        name = path.split('/')[-1]
        try:
            value = get_secret(name, service, context)
            return {'status': 200, 'body': {'name': name, 'value': value}}
        except PermissionError as e:
            return {'status': 403, 'body': {'error': str(e)}}

    # POST /secrets/:name/rotate - Rotate secret
    elif method == 'POST' and '/rotate' in path:
        name = path.split('/')[2]
        new_value = body.get('value', '')
        grace_hours = body.get('grace_period_hours', 24)
        result = rotate_secret(name, new_value, grace_hours, context)
        return {'status': 200, 'body': result}

    # GET /secrets/:name/versions - Get all active versions
    elif method == 'GET' and '/versions' in path:
        name = path.split('/')[2]
        versions = get_all_active_versions(name, context)
        return {'status': 200, 'body': {'versions': versions}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
