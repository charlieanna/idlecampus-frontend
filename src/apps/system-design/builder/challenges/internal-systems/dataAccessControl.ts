import { Challenge } from '../../types/testCase';

export const dataAccessControlChallenge: Challenge = {
  id: 'data_access_control',
  title: 'Data Access Control System (Row/Column Security)',
  difficulty: 'advanced',
  description: `Design a data access control system for fine-grained permissions on data warehouse tables.

Enforce row-level and column-level security, dynamic data masking, and audit all data access.
Handle complex policies like "users can only see their own team's data" or "PII must be masked for analysts".

Example workflow:
- POST /policies → Create policy: "Sales team sees only sales region data"
- GET /data/users → Apply row filter based on user's team
- Query with PII → Automatically mask email/SSN columns
- GET /audit → View all data access attempts

Key challenges:
- Policy evaluation performance (<10ms per query)
- Complex policy expressions (SQL predicates, regex masks)
- Dynamic masking without data duplication
- Comprehensive audit logging`,

  requirements: {
    functional: [
      'Row-level security (filter rows based on user context)',
      'Column-level security (hide/mask columns)',
      'Dynamic data masking (email, SSN, credit cards)',
      'Policy expression language (SQL predicates)',
      'Audit logging for all data access',
    ],
    traffic: '5,000 queries/sec with policy evaluation',
    latency: 'Policy evaluation < 10ms overhead',
    availability: '99.99% uptime',
    budget: '$4,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'analytics_db',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Row-Level Security',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Filter rows based on user context (team, role, etc.).',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 200,
        securityViolations: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 200 } },
          { type: 'redis', config: { memorySizeGB: 16 } },
          { type: 'kafka', config: { partitions: 20 } },
          { type: 'clickhouse', config: { nodes: 2 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'clickhouse' },
        ],
        explanation: `Architecture:
- Policy engine evaluates access rules
- Redis caches compiled policies
- Query rewriter injects WHERE clauses for row filtering
- Kafka streams audit events
- ClickHouse stores audit logs`,
      },
    },

    {
      name: 'Column-Level Security and Masking',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Hide or mask columns based on user permissions.',
      traffic: {
        type: 'read',
        rps: 150,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 200,
        maskingAccuracy: 1.0, // 100% accurate masking
      },
      hints: [
        'Column hide: Remove from SELECT clause',
        'Email masking: user@example.com → u***@e***.com',
        'SSN masking: 123-45-6789 → ***-**-6789',
        'Custom masks per column type',
      ],
    },

    {
      name: 'Audit Logging',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Log all data access attempts with user context.',
      traffic: {
        type: 'write',
        rps: 200,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxAuditLatency: 5000, // Async within 5s
        auditCompleteness: 1.0, // 100% coverage
      },
      hints: [
        'Async audit via Kafka (don\'t block queries)',
        'Log: user, query, tables accessed, rows returned, timestamp',
        'Store in ClickHouse for fast analytics',
        'Retention: 1 year for compliance',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Low-Latency Policy Evaluation',
      type: 'performance',
      requirement: 'NFR-P',
      description: '5,000 QPS with < 10ms policy evaluation overhead.',
      traffic: {
        type: 'read',
        rps: 5000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 210, // 200ms base + 10ms policy
        policyOverhead: 10, // Max 10ms overhead
      },
      hints: [
        'Cache compiled policies in memory',
        'Lazy evaluation (skip if no policies for table)',
        'Pre-compute user context (roles, teams)',
        'Use bitmap indexes for fast filtering',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Complex Policy Expressions',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Support 10,000 policies across 1,000 tables.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 250,
      },
      hints: [
        'Index policies by table name for fast lookup',
        'Compile policies to SQL predicates (not runtime eval)',
        'Merge multiple policies with AND/OR',
        'Detect policy conflicts (deny overrides allow)',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Fail-Closed Security',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Deny access on policy evaluation errors (fail-closed).',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        securityViolations: 0,
        falsePositives: 0, // No valid queries blocked
      },
      hints: [
        'Default deny if policy engine unavailable',
        'Validate policy syntax before deployment',
        'Test policies in dry-run mode first',
        'Alert on policy evaluation failures',
      ],
    },
  ],

  hints: [
    {
      category: 'Policy Language',
      items: [
        'Row policy: "region = user.region AND status = \'active\'"',
        'Column policy: "MASK(email) IF user.role != \'admin\'"',
        'Support placeholders: ${user.team_id}, ${user.role}',
        'Compile to SQL WHERE/CASE clauses',
      ],
    },
    {
      category: 'Query Rewriting',
      items: [
        'Parse SQL query (use SQL parser)',
        'Inject WHERE clause for row policies',
        'Wrap columns with CASE for masking',
        'Remove columns for hide policies',
      ],
    },
    {
      category: 'Masking Functions',
      items: [
        'Email: Show first char + domain → a***@g***.com',
        'Phone: Show last 4 digits → ***-***-1234',
        'SSN: Show last 4 digits → ***-**-6789',
        'Credit card: Show last 4 → ****-****-****-1234',
      ],
    },
    {
      category: 'Performance Optimization',
      items: [
        'Cache user context in session (avoid repeated lookups)',
        'Pre-compile policies to SQL (not runtime interpretation)',
        'Use database views for common policies',
        'Partition audit logs by date for fast queries',
      ],
    },
  ],

  learningObjectives: [
    'Row-level and column-level security implementation',
    'Dynamic data masking techniques',
    'SQL query rewriting for policy injection',
    'Audit logging for compliance',
    'Policy engine design and optimization',
  ],

  realWorldExample: `**Google BigQuery:**
- Row-level security with authorized views
- Column-level access control
- Data masking policies (email, phone)
- Audit logs in Cloud Logging

**Apache Ranger:**
- Fine-grained access control for Hadoop
- Dynamic data masking
- Policy evaluation engine
- Audit to Solr/HDFS

**Snowflake:**
- Row access policies (SQL predicates)
- Column masking policies
- Object tagging for classification
- Query history and access logs`,

  pythonTemplate: `from typing import Dict, List
import re

class DataAccessControl:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.cache = None  # Redis
        self.audit = None  # Kafka

    def create_policy(self, table: str, policy_type: str,
                     expression: str) -> str:
        """Create access control policy."""
        # TODO: Validate expression syntax
        # TODO: Store policy in database
        # TODO: Compile to SQL predicate
        # TODO: Invalidate policy cache
        # TODO: Return policy ID
        pass

    def evaluate_row_policy(self, table: str, user: Dict) -> str:
        """Evaluate row-level policies for user."""
        # TODO: Get policies for table from cache
        # TODO: Substitute user context (${user.team_id})
        # TODO: Merge multiple policies with AND
        # TODO: Return SQL WHERE clause
        return f"team_id = '{user['team_id']}'"

    def evaluate_column_policy(self, table: str, columns: List[str],
                               user: Dict) -> Dict:
        """Evaluate column-level policies."""
        # TODO: Get column policies from cache
        # TODO: For each column, check if user has access
        # TODO: Return masking/hide instructions
        return {
            'email': 'mask',
            'ssn': 'mask',
            'salary': 'hide'
        }

    def rewrite_query(self, query: str, user: Dict) -> str:
        """Rewrite query to enforce policies."""
        # TODO: Parse SQL query
        # TODO: Extract table names
        # TODO: Inject row policies (WHERE clause)
        # TODO: Wrap columns with masking functions
        # TODO: Remove hidden columns
        # TODO: Return rewritten query
        pass

    def mask_value(self, value: str, mask_type: str) -> str:
        """Apply data masking to value."""
        if mask_type == 'email':
            # user@example.com → u***@e***.com
            match = re.match(r'([^@])[^@]*(@)([^.]+)(.*)', value)
            if match:
                return f"{match[1]}***{match[2]}{match[3][0]}***{match[4]}"
        elif mask_type == 'ssn':
            # 123-45-6789 → ***-**-6789
            return '***-**-' + value[-4:]
        elif mask_type == 'phone':
            # (123) 456-7890 → ***-***-7890
            return '***-***-' + value[-4:]
        return value

    def audit_access(self, user_id: str, query: str,
                    tables: List[str], rows_returned: int):
        """Log data access for audit."""
        # TODO: Create audit record
        # TODO: Send to Kafka asynchronously
        # TODO: Include: user, query, tables, rows, timestamp
        pass

    def check_permission(self, user: Dict, table: str,
                        operation: str) -> bool:
        """Check if user can perform operation on table."""
        # TODO: Get user roles
        # TODO: Check table ACLs
        # TODO: Return allow/deny (fail-closed)
        return False

# Example usage
if __name__ == '__main__':
    acl = DataAccessControl()

    # Create policy
    policy_id = acl.create_policy(
        table='users',
        policy_type='row',
        expression='team_id = ${user.team_id}'
    )

    # Evaluate for user
    user = {'id': 'alice', 'team_id': 'sales', 'role': 'analyst'}
    where_clause = acl.evaluate_row_policy('users', user)

    # Rewrite query
    original = 'SELECT * FROM users WHERE status = "active"'
    rewritten = acl.rewrite_query(original, user)

    # Mask value
    masked_email = acl.mask_value('alice@example.com', 'email')

    # Audit
    acl.audit_access('alice', rewritten, ['users'], rows_returned=150)`,
};
