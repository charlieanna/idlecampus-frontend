import { Challenge } from '../../types/testCase';

export const alertingIncidentManagementChallenge: Challenge = {
  id: 'alerting_incident_management',
  title: 'Alerting & Incident Management System (PagerDuty / Google SRE)',
  difficulty: 'advanced',
  description: `Design an internal alerting and incident management system for production monitoring.

Engineers can:
- Define alert rules based on metrics (error_rate > 5%, latency > 1s)
- Route alerts to correct on-call teams
- Escalate if not acknowledged within 5 minutes
- Deduplicate similar alerts (prevent alert fatigue)
- Track incident lifecycle (detected → acknowledged → resolved)

Example alert flow:
- Metric: API error_rate = 8% (threshold: 5%)
- Create alert: "API Service Error Rate High"
- Route to: api-team on-call engineer
- If no ACK in 5 min → escalate to manager
- If no ACK in 10 min → escalate to director

Key challenges:
- Alert deduplication (1000 identical alerts → 1 incident)
- Multi-channel delivery (Slack, PagerDuty, SMS, phone)
- On-call scheduling with rotations
- Alert fatigue prevention`,

  requirements: {
    functional: [
      'Alert rule evaluation (metrics → alerts)',
      'Routing to on-call teams',
      'Escalation policies (multi-level)',
      'Alert deduplication and grouping',
      'Multi-channel notifications (Slack, SMS, phone)',
      'Incident lifecycle tracking',
    ],
    traffic: '10,000 alerts/day (~7 alerts/min), 100 incidents/day',
    latency: 'p99 < 30s from metric breach to alert delivery',
    availability: '99.99% uptime (critical alerts cannot be lost!)',
    budget: '$4,000/month',
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
      name: 'Basic Alert Creation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Create alert when metric breaches threshold.',
      traffic: {
        type: 'write',
        rps: 10, // 10 alerts/min
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        alertsCreated: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Basic alerting architecture:

**Components:**
- PostgreSQL: Alert rules, incidents, on-call schedules
- Message Queue: Alert delivery pipeline
- Redis: Alert deduplication state, rate limiting

**Alert evaluation flow:**
1. Metrics ingestion: error_rate = 8%
2. Rule evaluation: error_rate > 5% → BREACH!
3. Create alert in PostgreSQL
4. Publish to message queue for delivery
5. Worker pulls alert, sends notifications`,
      },
    },

    {
      name: 'Alert Deduplication',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Deduplicate 1000 identical alerts → 1 incident. Prevent alert fatigue.',
      traffic: {
        type: 'write',
        rps: 1000, // 1000 alerts/min (same error)
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        incidentsCreated: 1, // Only 1 incident despite 1000 alerts!
        deduplicationWorking: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Alert deduplication is CRITICAL for preventing alert fatigue:

**Problem - No deduplication:**
- API service has error spike
- 100 instances × 10 alerts/sec = 1000 alerts/sec
- On-call engineer gets 60,000 alerts in 1 minute ❌
- Phone rings non-stop, impossible to diagnose!

**Solution - Fingerprint-based deduplication:**

**Step 1: Generate alert fingerprint**
fingerprint = hash(service_name + alert_type + error_message)

Example:
- Alert 1: "api-service: error_rate high: connection timeout"
- Alert 2: "api-service: error_rate high: connection timeout"
- Fingerprint: "abc123" (identical!)

**Step 2: Check if incident exists (Redis)**
incident_id = redis.get(f"incident:{fingerprint}")

if incident_id:
    # Existing incident - just increment counter
    redis.incr(f"incident:{incident_id}:count")
    return  # Don't create duplicate!
else:
    # New incident - create and store fingerprint
    incident = create_incident(alert)
    redis.setex(f"incident:{fingerprint}", 3600, incident.id)  # 1 hour TTL
    send_notification(incident)

**Result:**
- 1000 alerts with same fingerprint → 1 incident ✅
- On-call receives 1 notification
- Incident page shows: "Count: 1000 occurrences"

**Deduplication window:**
- TTL: 1 hour (alerts within 1 hour are grouped)
- After 1 hour, new alerts create new incident
- Prevents masking new issues

**Key insight:**
Deduplication is the difference between usable and unusable alerting!`,
      },
    },

    {
      name: 'Escalation Policy',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Escalate alert: L1 (5 min) → L2 (10 min) → L3 (15 min) if not acknowledged.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.5,
      },
      duration: 900, // 15 minutes to test full escalation
      passCriteria: {
        maxErrorRate: 0,
        escalationLevelsTriggered: 3, // L1, L2, L3
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Escalation policy ensures critical alerts reach someone:

**Escalation configuration:**
{
  "team": "api-team",
  "escalation_policy": [
    {"level": 1, "timeout_min": 5, "recipients": ["oncall_engineer"]},
    {"level": 2, "timeout_min": 10, "recipients": ["oncall_manager"]},
    {"level": 3, "timeout_min": 15, "recipients": ["director", "vp_engineering"]}
  ]
}

**Timeline:**
- Time 0:00 - Alert created, sent to on-call engineer (L1)
- Time 0:05 - No ACK → escalate to manager (L2)
- Time 0:10 - No ACK → escalate to director + VP (L3)
- Time 0:12 - Director acknowledges → stop escalation ✅

**Implementation with delayed jobs:**

# Create incident
incident = create_incident(alert)

# Schedule escalations
for level in escalation_policy:
    message_queue.publish_delayed(
        {
            "action": "check_escalation",
            "incident_id": incident.id,
            "level": level.level
        },
        delay_seconds=level.timeout_min * 60
    )

# Worker processes delayed messages
def check_escalation(incident_id, level):
    incident = db.get_incident(incident_id)

    if incident.status == "acknowledged":
        return  # Someone ack'd, stop escalation

    # No ack - escalate!
    recipients = get_escalation_recipients(level)
    send_notifications(recipients, incident)

**Key features:**
- Automatic escalation (no manual intervention)
- Stops when someone acknowledges
- Ensures 24/7 coverage`,
      },
    },

    {
      name: 'On-Call Rotation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Route alerts to correct on-call engineer based on schedule.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        routingCorrect: true,
      },
    },

    {
      name: 'Multi-Channel Delivery',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Deliver alerts via Slack, SMS, and phone call based on severity.',
      traffic: {
        type: 'write',
        rps: 20,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        channelsUsed: ['slack', 'sms', 'phone'],
      },
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Alert Volume',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 alerts/day with <30s delivery latency.',
      traffic: {
        type: 'write',
        rps: 7, // ~10K/day = 7/min
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 30000, // 30 seconds
        maxErrorRate: 0.001,
        maxMonthlyCost: 4000,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Message Queue Failure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Message queue fails. Alerts buffered in database until queue recovers.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 180,
      failureInjection: {
        type: 'queue_failure',
        atSecond: 60,
        recoverySecond: 120,
      },
      passCriteria: {
        minAvailability: 0.95,
        maxErrorRate: 0.1,
        alertsLost: 0, // CRITICAL: Cannot lose alerts!
      },
    },

    {
      name: 'Alert Storm (1000x normal)',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Massive outage causes alert storm (1000x normal). System must not crash.',
      traffic: {
        type: 'write',
        rps: 7000, // 1000x normal
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.5, // 50% may be dropped (acceptable during storm)
        minAvailability: 0.80,
        systemStable: true, // Must not crash!
      },
    },
  ],

  learningObjectives: [
    'Design alert deduplication to prevent alert fatigue',
    'Implement escalation policies with delayed jobs',
    'On-call scheduling and rotation',
    'Multi-channel notification delivery',
    'Handle alert storms gracefully',
  ],

  hints: [
    {
      trigger: 'test_failed:Alert Deduplication',
      message: `💡 1000 alerts are creating 1000 incidents!

**Problem - No deduplication:**
Service crashes → 100 instances × 10 alerts/sec = 1000 alerts/sec
On-call engineer: Phone rings 1000 times ❌

**Solution - Fingerprint-based grouping:**

**Step 1: Generate fingerprint**
def alert_fingerprint(alert):
    key = f"{alert.service}:{alert.type}:{alert.message}"
    return hashlib.md5(key.encode()).hexdigest()

**Step 2: Check for existing incident**
fingerprint = alert_fingerprint(alert)
incident_key = f"incident:{fingerprint}"

incident_id = redis.get(incident_key)

if incident_id:
    # Existing incident - increment count
    redis.incr(f"incident:{incident_id}:count")
    db.execute("UPDATE incidents SET count = count + 1 WHERE id = ?", incident_id)
    return  # Don't send duplicate notification!

# New incident
incident = db.insert("INSERT INTO incidents (fingerprint, ...) VALUES (...)")
redis.setex(incident_key, 3600, incident.id)  # 1 hour dedup window
send_notification(incident)

**Result:**
1000 alerts → 1 notification ✅
Incident shows: "1000 occurrences in last 5 minutes"

**Deduplication window (TTL):**
- 1 hour: Alerts within 1 hour grouped
- After 1 hour: New incident created
- Prevents masking recurring issues

Add Redis for deduplication state!`,
    },
    {
      trigger: 'test_failed:Escalation Policy',
      message: `💡 Escalations are not working!

**Problem:**
Alert sent to on-call engineer at 10:00 AM
No acknowledgment
Nobody else notified ❌

**Solution - Delayed escalation:**

**Using message queue with delay:**

# Create incident
incident = create_incident(alert)
send_notification(oncall_engineer, incident)

# Schedule escalation checks
escalation_policy = [
  {"level": 1, "delay_min": 5, "recipients": ["manager"]},
  {"level": 2, "delay_min": 10, "recipients": ["director"]}
]

for policy in escalation_policy:
    queue.publish_delayed(
        message={
            "action": "check_escalation",
            "incident_id": incident.id,
            "level": policy.level,
            "recipients": policy.recipients
        },
        delay_seconds=policy.delay_min * 60
    )

**Worker processes delayed messages:**

def check_escalation(incident_id, level, recipients):
    incident = db.get(incident_id)

    if incident.status == "acknowledged":
        # Someone ack'd - stop escalating
        return

    if incident.status == "resolved":
        # Auto-resolved - stop escalating
        return

    # Still open - escalate!
    for recipient in recipients:
        send_notification(recipient, incident)

    # Log escalation
    db.execute(
        "INSERT INTO escalations (incident_id, level, notified_at) VALUES (?, ?, NOW())",
        incident_id, level
    )

**Timeline:**
10:00 - Alert created, notify L1 (engineer)
10:05 - Check: not ack'd → notify L2 (manager)
10:10 - Check: not ack'd → notify L3 (director)
10:12 - Director ack's → future checks stop ✅

Use message queue with delay for escalation!`,
    },
    {
      trigger: 'test_failed:Alert Storm (1000x normal)',
      message: `💡 System is crashing under alert storm!

**Problem:**
Datacenter outage → 10,000 services fail → 1M alerts/min
Database saturated, queue backing up, system crashes ❌

**Solution - Rate limiting + sampling:**

**1. Rate limit per fingerprint:**
fingerprint = alert_fingerprint(alert)
rate_limit_key = f"ratelimit:{fingerprint}"

count = redis.incr(rate_limit_key)
redis.expire(rate_limit_key, 60)  # 1 minute window

if count > 100:
    # More than 100 alerts/min for same issue
    # Log but don't process
    metrics.incr('alerts_rate_limited')
    return

**2. Sample during storms:**
if is_alert_storm():  # Detect: alerts/min > 1000
    # Sample 10% of alerts
    if random.random() > 0.10:
        metrics.incr('alerts_sampled_out')
        return

**3. Prioritize critical alerts:**
if alert.severity == 'critical':
    process_immediately(alert)
elif alert.severity == 'warning':
    if not is_alert_storm():
        process(alert)
    else:
        queue_for_later(alert)  # Process after storm

**4. Backpressure:**
if queue.size() > 10000:
    # Queue is backing up
    if alert.severity != 'critical':
        drop(alert)  # Drop non-critical during overload

**Key principle:**
During disaster:
- Process critical alerts ✅
- Sample/drop warnings ✅
- Stay available ✅

Better 10% of alerts than 0% availability!`,
    },
  ],

  pythonTemplate: `# Alerting & Incident Management System
# Implement deduplication, escalation, routing

import hashlib
import time
from typing import Dict, List

def alert_fingerprint(alert: dict) -> str:
    """
    Generate fingerprint for alert deduplication.

    Args:
        alert: {
            'service': 'api-service',
            'type': 'error_rate_high',
            'message': 'Error rate > 5%',
            'severity': 'critical'
        }

    Returns:
        MD5 hash for deduplication

    Requirements:
    - Combine service + type + message
    - Hash to generate fingerprint
    - Same alerts → same fingerprint
    """
    key = f"{alert['service']}:{alert['type']}:{alert['message']}"
    return hashlib.md5(key.encode()).hexdigest()


def create_or_update_incident(alert: dict, context: dict) -> dict:
    """
    Create new incident or update existing (deduplication).

    Args:
        alert: Alert data
        context: Shared context

    Returns:
        {
            'incident_id': 'incident_123',
            'fingerprint': 'abc123',
            'count': 1,
            'created': True  # or False if updated existing
        }

    Requirements:
    - Generate fingerprint
    - Check Redis for existing incident
    - If exists: increment count, return existing
    - If new: create incident, store fingerprint, send notification
    """
    fingerprint = alert_fingerprint(alert)
    incident_key = f"incident:{fingerprint}"

    # Check for existing incident (Redis)
    incident_id = context['redis'].get(incident_key)

    if incident_id:
        # Existing incident - update count
        context['redis'].incr(f"incident:{incident_id}:count")
        context['db'].execute(
            "UPDATE incidents SET count = count + 1, updated_at = NOW() WHERE id = ?",
            incident_id
        )
        return {'incident_id': incident_id, 'fingerprint': fingerprint, 'count': int(context['redis'].get(f"incident:{incident_id}:count")), 'created': False}

    # New incident
    incident_id = f"incident_{int(time.time())}"
    context['db'].execute(
        "INSERT INTO incidents (id, fingerprint, service, type, message, severity, count, status) VALUES (?, ?, ?, ?, ?, ?, 1, 'open')",
        incident_id, fingerprint, alert['service'], alert['type'], alert['message'], alert['severity']
    )

    # Store in Redis (1 hour dedup window)
    context['redis'].setex(incident_key, 3600, incident_id)
    context['redis'].set(f"incident:{incident_id}:count", 1)

    return {'incident_id': incident_id, 'fingerprint': fingerprint, 'count': 1, 'created': True}


def get_oncall_engineer(team: str, context: dict) -> str:
    """
    Get current on-call engineer for team.

    Args:
        team: Team name
        context: Shared context

    Returns:
        On-call engineer email

    Requirements:
    - Query on-call schedule from database
    - Check current time against rotation schedule
    - Return engineer on duty now
    """
    # Your code here
    return "engineer@company.com"


def schedule_escalations(incident_id: str, team: str, context: dict):
    """
    Schedule escalation checks for incident.

    Args:
        incident_id: Incident to escalate
        team: Team for escalation policy
        context: Shared context

    Requirements:
    - Fetch escalation policy for team
    - For each escalation level, schedule delayed job
    - Use message queue with delay
    """
    escalation_policy = context['db'].execute(
        "SELECT * FROM escalation_policies WHERE team = ? ORDER BY level",
        team
    )

    for policy in escalation_policy:
        # Schedule delayed escalation check
        context['queue'].publish_delayed(
            {
                'action': 'check_escalation',
                'incident_id': incident_id,
                'level': policy['level'],
                'recipients': policy['recipients'],
            },
            delay_seconds=policy['timeout_minutes'] * 60
        )


def check_escalation(incident_id: str, level: int, recipients: List[str], context: dict):
    """
    Check if incident needs escalation (background job).

    Args:
        incident_id: Incident ID
        level: Escalation level
        recipients: Who to notify
        context: Shared context

    Requirements:
    - Check if incident acknowledged/resolved
    - If still open → notify recipients
    - Log escalation
    """
    incident = context['db'].execute(
        "SELECT * FROM incidents WHERE id = ?",
        incident_id
    )[0]

    if incident['status'] in ['acknowledged', 'resolved']:
        # Incident handled - stop escalating
        return

    # Still open - escalate!
    for recipient in recipients:
        send_notification(recipient, incident, context)

    # Log escalation
    context['db'].execute(
        "INSERT INTO escalations (incident_id, level, notified_at) VALUES (?, ?, NOW())",
        incident_id, level
    )


def send_notification(recipient: str, incident: dict, context: dict):
    """
    Send notification via appropriate channel.

    Args:
        recipient: Email or phone
        incident: Incident data
        context: Shared context

    Requirements:
    - Determine channel based on severity (critical → phone, warning → slack)
    - Send via external API (Slack, Twilio, etc.)
    - Log notification
    """
    severity = incident['severity']

    if severity == 'critical':
        # Phone call
        # context['twilio'].call(recipient, message)
        pass
    elif severity == 'warning':
        # Slack
        # context['slack'].send(recipient, message)
        pass

    # Log
    context['db'].execute(
        "INSERT INTO notifications (incident_id, recipient, channel, sent_at) VALUES (?, ?, ?, NOW())",
        incident['id'], recipient, 'phone' if severity == 'critical' else 'slack'
    )


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle alerting API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /alerts - Create alert
    if method == 'POST' and path == '/alerts':
        alert = body

        # Create or update incident (with deduplication)
        result = create_or_update_incident(alert, context)

        if result['created']:
            # New incident - route to on-call + schedule escalations
            oncall = get_oncall_engineer(alert['service'], context)
            send_notification(oncall, {'id': result['incident_id'], **alert}, context)
            schedule_escalations(result['incident_id'], alert['service'], context)

        return {'status': 201, 'body': result}

    # POST /incidents/:id/acknowledge - Ack incident
    elif method == 'POST' and '/acknowledge' in path:
        incident_id = path.split('/')[2]
        acker = body.get('acker', '')

        context['db'].execute(
            "UPDATE incidents SET status = 'acknowledged', acknowledged_by = ?, acknowledged_at = NOW() WHERE id = ?",
            acker, incident_id
        )

        return {'status': 200, 'body': {'acknowledged': True}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
