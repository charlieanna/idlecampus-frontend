import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Zero Trust Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching Zero Trust Security architecture for API gateways.
 * Focuses on identity verification, device trust, continuous authentication, mTLS,
 * identity-aware proxy, and policy enforcement.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic zero trust principles
 * Steps 4-6: Add mTLS, identity-aware proxy, policy enforcement
 *
 * Key Concepts (Zero Trust):
 * - Never trust, always verify
 * - Least privilege access
 * - Continuous authentication and authorization
 * - Mutual TLS (mTLS) for service-to-service auth
 * - Identity-aware proxy
 * - Context-based policy enforcement
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const zeroTrustGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Zero Trust Gateway that never trusts, always verifies",

  interviewer: {
    name: 'Maya Chen',
    role: 'Chief Security Officer at SecureCloud Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'zero-trust-principle',
      category: 'functional',
      question: "What does 'Zero Trust' actually mean? How is it different from traditional security?",
      answer: "Traditional security: 'Trust but verify' - once you're inside the network, you're trusted.\n\nZero Trust: 'Never trust, always verify' - every request is authenticated and authorized, regardless of where it comes from.\n\n**Core principles:**\n1. **Verify explicitly** - Always authenticate and authorize based on all available data\n2. **Least privilege** - Limit access with Just-In-Time and Just-Enough-Access\n3. **Assume breach** - Minimize blast radius, verify end-to-end encryption",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Zero Trust assumes the network is hostile, even internal networks. Every request must prove its identity and intent.",
    },
    {
      id: 'identity-verification',
      category: 'functional',
      question: "How do we verify the identity of every request?",
      answer: "Use **multi-factor identity verification**:\n\n1. **User Identity** - JWT tokens with user claims (who is making the request)\n2. **Device Identity** - Device certificates or hardware attestation (what device)\n3. **Service Identity** - Service certificates for service-to-service calls (which service)\n\nThe gateway validates ALL identities before allowing access. No identity = no access.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Identity is the new perimeter. Every entity (user, device, service) must prove who they are.",
    },
    {
      id: 'device-trust',
      category: 'functional',
      question: "Why verify the device? Isn't user authentication enough?",
      answer: "No! A valid user on a compromised device is still a threat:\n\n**Device Trust checks:**\n- Device is registered and managed (MDM)\n- OS is up-to-date with security patches\n- No jailbreak/root detection\n- Antivirus is running\n- Device location is allowed\n\nExample: CEO's credentials stolen, but attacker's device isn't registered → Access denied!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Device posture is as important as user identity. A compromised device can leak credentials.",
    },
    {
      id: 'continuous-auth',
      category: 'functional',
      question: "Traditional auth happens once at login. How does Zero Trust differ?",
      answer: "Zero Trust uses **continuous authentication**:\n\n- Login: Full authentication (MFA)\n- Request 1 (t=0): Verify token + device + context\n- Request 2 (t=5min): Re-verify token + device + context\n- Request 3 (t=10min): Token expired? Re-authenticate!\n\n**Context changes trigger re-auth:**\n- Location changed (London → Tokyo)\n- Device changed (iPhone → Android)\n- Risk score increased (accessing sensitive data)\n\nNever assume past authentication = current trust.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Trust is temporal and contextual. Continuous verification ensures stolen tokens become useless.",
    },
    {
      id: 'mtls-authentication',
      category: 'functional',
      question: "How do backend services authenticate each other?",
      answer: "Use **Mutual TLS (mTLS)**:\n\nTraditional TLS: Client verifies server's certificate\nmTLS: Both client AND server verify each other's certificates\n\n**Service-to-service call:**\n1. Gateway presents its certificate to backend\n2. Backend verifies gateway's certificate\n3. Backend presents its certificate to gateway\n4. Gateway verifies backend's certificate\n5. If both valid → establish encrypted connection\n\nNo valid certificate = no communication. Period.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "mTLS ensures both sides of every connection are who they claim to be. Critical for zero trust microservices.",
    },
    {
      id: 'policy-enforcement',
      category: 'functional',
      question: "How do we enforce access policies in Zero Trust?",
      answer: "Use **context-aware policy engine**:\n\n**Policy example:**\n```\nIF user.role == 'admin'\n   AND device.managed == true\n   AND device.location IN ['US', 'UK']\n   AND time.hour BETWEEN 9 AND 17\n   AND request.resource == '/admin/users'\nTHEN allow\nELSE deny\n```\n\n**Policy factors:**\n- User identity & role\n- Device trust level\n- Location & time\n- Resource sensitivity\n- Risk score\n\nPolicies are evaluated on EVERY request.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Policies encode business rules. The gateway is the enforcement point for all policies.",
    },
    {
      id: 'identity-aware-proxy',
      category: 'functional',
      question: "What's an Identity-Aware Proxy (IAP)?",
      answer: "IAP sits between users and applications, enforcing identity-based access:\n\n**Traditional VPN:** Inside network = trusted\n**IAP:** Every request authenticated, even from internal network\n\n**Flow:**\n1. User requests app.company.com\n2. IAP intercepts: Who are you?\n3. User authenticates (SSO, MFA)\n4. IAP checks policy: Does this user get access?\n5. If yes: IAP proxies request to backend\n6. Backend only accessible via IAP\n\nNo VPN needed! Access based on identity, not network location.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "IAP extends Zero Trust to web apps. Network location is irrelevant, only identity matters.",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests should the Zero Trust Gateway handle?",
      answer: "50,000 requests per second at peak. Every request requires authentication, policy evaluation, and audit logging.",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × (auth check + policy eval + audit) = significant CPU load",
        result: "Need fast policy cache, token validation cache, and distributed architecture",
      },
      learningPoint: "Zero Trust adds security overhead. Must optimize auth checks to avoid latency.",
    },
    {
      id: 'auth-latency',
      category: 'latency',
      question: "How much latency can we add for security checks?",
      answer: "Target: < 50ms p99 for auth + policy checks\n\n**Breakdown:**\n- Token validation: 5ms (cached)\n- Device trust check: 10ms (cached posture)\n- Policy evaluation: 20ms (in-memory rules)\n- Audit logging: 15ms (async)\n\nUsers won't tolerate slow security - must be invisible.",
      importance: 'critical',
      learningPoint: "Security can't sacrifice UX. Cache aggressively, evaluate policies in-memory.",
    },
    {
      id: 'breach-assumption',
      category: 'reliability',
      question: "What if an attacker gets inside the network?",
      answer: "Zero Trust **assumes breach**:\n\n- Even inside network, every request is authenticated\n- Lateral movement is blocked (no implicit trust)\n- Least privilege limits blast radius\n- All activity is logged and monitored\n\nTraditional security: Breach = game over\nZero Trust: Breach = contained to single identity/service",
      importance: 'critical',
      learningPoint: "Design for failure. Assume attackers will get in, but limit what they can do.",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['zero-trust-principle', 'identity-verification', 'continuous-auth', 'mtls-authentication'],
  criticalFRQuestionIds: ['zero-trust-principle', 'identity-verification', 'device-trust'],
  criticalScaleQuestionIds: ['throughput-requests', 'auth-latency', 'breach-assumption'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Verify identity explicitly on every request',
      description: 'Authenticate user, device, and service identity for all requests',
      emoji: '🔐',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Validate device trust posture',
      description: 'Check device is managed, patched, and secure before allowing access',
      emoji: '📱',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Implement continuous authentication',
      description: 'Re-verify identity based on context changes and token expiry',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Enforce mTLS for service-to-service auth',
      description: 'Mutual certificate verification for all backend communication',
      emoji: '🔒',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Apply context-aware policy enforcement',
      description: 'Evaluate policies based on identity, device, location, time, and risk',
      emoji: '⚖️',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Identity-aware proxy for web apps',
      description: 'Proxy access to internal apps based on identity, not network',
      emoji: '🚪',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A - Gateway handles 50K RPS',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 2,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 25000, peak: 50000 },
    maxPayloadSize: '~10KB (API request + auth headers)',
    storagePerRecord: 'N/A',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 50ms (auth overhead)',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Identity verification on every request prevents unauthorized access',
    '✅ Device trust ensures only managed devices access resources',
    '✅ Continuous auth limits token lifetime and detects compromises',
    '✅ mTLS provides strong service-to-service authentication',
    '✅ Policy engine enables fine-grained access control',
    '✅ IAP eliminates VPN, enables remote work security',
  ],

  outOfScope: [
    'Data encryption at rest (separate concern)',
    'Network segmentation (Zero Trust focuses on identity)',
    'SIEM integration (logging is in scope, SIEM is not)',
    'Threat detection and response',
  ],

  keyInsight: "First, let's make it WORK. We'll build basic identity verification and policy enforcement. Then we'll add advanced features like mTLS, device trust, and continuous authentication. Security first, but function always!",
};

// =============================================================================
// STEP 1: Identity Verification - The Foundation
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to SecureCloud Inc! You're building a Zero Trust Gateway.",
  hook: "Traditional perimeter security failed. Hackers breached the firewall and moved laterally, stealing customer data. Never again!",
  challenge: "Build the foundation: Verify user identity on every request before allowing access.",
  illustration: 'identity-verification',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Identity verification is live!',
  achievement: 'Every request is now authenticated',
  metrics: [
    { label: 'Authentication', after: 'Required' },
    { label: 'Unauthenticated access', before: 'Allowed', after: 'Blocked' },
  ],
  nextTeaser: "But how do we verify the device is trustworthy?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Zero Trust Foundation: Identity Verification',
  conceptExplanation: `**Zero Trust Principle #1: Verify Explicitly**

Traditional security: "Trust but verify"
- Inside firewall = trusted
- VPN connected = trusted
- On corporate network = trusted

Zero Trust: "Never trust, always verify"
- Every request requires proof of identity
- Network location is irrelevant
- Past authentication doesn't guarantee current trust

**Identity Verification Flow:**
\`\`\`
1. Client sends request with JWT token
2. Gateway extracts token from Authorization header
3. Gateway validates token signature
4. Gateway checks token expiry
5. Gateway extracts user claims (user_id, role, email)
6. If valid → proceed to authorization
   If invalid → return 401 Unauthorized
\`\`\`

**JWT Token Contents:**
\`\`\`json
{
  "sub": "user-123",
  "email": "alice@company.com",
  "role": "engineer",
  "exp": 1634567890,
  "iss": "auth.company.com"
}
\`\`\``,

  whyItMatters: 'Without identity verification, anyone can access your APIs. Identity is the new security perimeter in cloud-native architectures.',

  realWorldExample: {
    company: 'Google',
    scenario: 'BeyondCorp - Google\'s Zero Trust implementation',
    howTheyDoIt: 'Every request to internal apps requires user authentication, even from Google offices. No VPN, no implicit trust. Identity-based access everywhere.',
  },

  keyPoints: [
    'Never trust, always verify - core Zero Trust principle',
    'Validate JWT tokens on every request',
    'Extract user identity and claims',
    'Network location is irrelevant',
  ],

  keyConcepts: [
    { title: 'JWT Token', explanation: 'JSON Web Token - signed claims about user identity', icon: '🎫' },
    { title: 'Authentication', explanation: 'Verifying WHO the user is', icon: '🔐' },
    { title: 'Claims', explanation: 'Attributes about the user (role, email, etc)', icon: '📋' },
  ],
};

const step1: GuidedStep = {
  id: 'zero-trust-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Verify identity explicitly on every request',
    taskDescription: 'Add Client, Identity Provider, Gateway, and Backend. Implement identity verification.',
    componentsNeeded: [
      { type: 'client', reason: 'Sends authenticated requests', displayName: 'Client' },
      { type: 'auth_service', reason: 'Issues JWT tokens', displayName: 'Identity Provider' },
      { type: 'api_gateway', reason: 'Validates tokens', displayName: 'Zero Trust Gateway' },
      { type: 'app_server', reason: 'Backend service', displayName: 'Backend API' },
    ],
    successCriteria: [
      'Add all components',
      'Connect Client → Identity Provider (get token)',
      'Connect Client → Gateway (with token)',
      'Connect Gateway → Backend (after verification)',
      'Implement token validation in Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add Client, Identity Provider, Gateway, and Backend',
    level2: 'Connect: Client → Identity Provider → get JWT. Then Client → Gateway (with JWT) → Backend',
    solutionComponents: [
      { type: 'client' },
      { type: 'auth_service' },
      { type: 'api_gateway' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'auth_service' },
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Device Trust Validation
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📱',
  scenario: "Alert! An engineer's laptop was stolen with valid credentials saved!",
  hook: "The thief has valid JWT tokens, but the device isn't registered in your MDM (Mobile Device Management). Should you allow access?",
  challenge: "Implement device trust validation to block unmanaged devices.",
  illustration: 'device-trust',
};

const step2Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Device trust is protecting your systems!',
  achievement: 'Only managed, secure devices can access resources',
  metrics: [
    { label: 'Device verification', before: 'None', after: 'Required' },
    { label: 'Unmanaged devices blocked', after: '100%' },
  ],
  nextTeaser: "But tokens live forever... how do we handle stolen tokens?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Device Trust: The Second Factor',
  conceptExplanation: `**Why Device Trust Matters:**

Valid user ≠ secure access if device is compromised:
- Stolen laptop with cached credentials
- Personal device with malware
- Jailbroken/rooted device
- Unpatched OS with known vulnerabilities

**Device Trust Validation:**
\`\`\`
1. Client includes device certificate in request
2. Gateway validates certificate against Device Registry
3. Gateway checks device posture:
   - Device is registered (MDM enrolled)
   - OS version meets minimum (iOS 15+, Android 12+)
   - Security patch level (< 90 days old)
   - No jailbreak/root detected
   - Antivirus enabled (for laptops)
4. If all checks pass → proceed
   If any check fails → deny access
\`\`\`

**Device Posture Attributes:**
\`\`\`json
{
  "device_id": "device-abc123",
  "type": "laptop",
  "os": "macOS",
  "os_version": "13.2",
  "managed": true,
  "last_check": "2023-10-01T10:30:00Z",
  "compliance_status": "compliant"
}
\`\`\`

**Benefits:**
- Stolen device? Invalid certificate → blocked
- Compromised device? Compliance fails → blocked
- Personal device? Not registered → blocked`,

  whyItMatters: 'Compromised devices can leak credentials, intercept data, or exfiltrate secrets. Device trust is essential for Zero Trust.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Cloudflare Access - Zero Trust for internal apps',
    howTheyDoIt: 'Requires device certificate + user authentication. Laptops must be enrolled in MDM with full disk encryption, firewall enabled, and auto-updates on.',
  },

  famousIncident: {
    title: 'Capital One Breach via Misconfigured Firewall',
    company: 'Capital One',
    year: '2019',
    whatHappened: 'Attacker compromised a single EC2 instance and moved laterally to access S3 buckets containing 100M+ customer records. Traditional perimeter security failed.',
    lessonLearned: 'Zero Trust with device verification and least privilege could have limited the blast radius. Network location isn\'t enough.',
    icon: '🏦',
  },

  keyPoints: [
    'Device trust verifies the security posture of the device',
    'Managed devices only - enrolled in MDM',
    'Check OS version, patches, compliance',
    'Stolen device with valid creds still blocked',
  ],

  keyConcepts: [
    { title: 'MDM', explanation: 'Mobile Device Management - central device registry', icon: '📱' },
    { title: 'Device Posture', explanation: 'Security state of device (patched, compliant)', icon: '💊' },
    { title: 'Device Certificate', explanation: 'Cryptographic proof of device identity', icon: '📜' },
  ],
};

const step2: GuidedStep = {
  id: 'zero-trust-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Validate device trust posture',
    taskDescription: 'Add Device Registry and implement device trust checks in Gateway',
    componentsNeeded: [
      { type: 'database', reason: 'Device Registry - store device posture', displayName: 'Device Registry' },
    ],
    successCriteria: [
      'Add Device Registry component',
      'Connect Gateway → Device Registry',
      'Implement device verification logic',
      'Block unmanaged devices',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Device Registry (Database) component',
    level2: 'Connect Gateway → Device Registry to validate device certificates and posture',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'api_gateway', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Continuous Authentication
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔄',
  scenario: "An engineer logged in from London at 9 AM. At 9:05 AM, a request comes from Tokyo!",
  hook: "The JWT token is still valid (expires in 1 hour). Traditional auth would allow it. But this is clearly suspicious!",
  challenge: "Implement continuous authentication to detect context changes and re-verify identity.",
  illustration: 'continuous-auth',
};

const step3Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Continuous authentication is active!',
  achievement: 'Context changes trigger re-authentication',
  metrics: [
    { label: 'Token lifetime', before: '1 hour', after: '15 minutes' },
    { label: 'Context monitoring', before: 'None', after: 'Active' },
    { label: 'Anomaly detection', after: 'Enabled' },
  ],
  nextTeaser: "Great! But how do services authenticate to each other?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Continuous Authentication: Trust is Temporal',
  conceptExplanation: `**Traditional Auth:**
Login once → trusted for hours/days
- Token issued at login
- Valid until expiry (1-24 hours)
- No re-verification

**Zero Trust Continuous Auth:**
Trust is re-evaluated on every request
- Short-lived tokens (15 min)
- Context monitoring
- Anomaly detection

**Context Factors:**
\`\`\`
1. Location
   - IP address geolocation
   - Impossible travel (London → Tokyo in 5 min)

2. Device
   - Device fingerprint
   - Device changed mid-session

3. Behavior
   - Access patterns
   - Unusual resource access

4. Risk Score
   - Aggregated risk from all factors
   - High risk → require re-auth
\`\`\`

**Re-Authentication Triggers:**
\`\`\`python
def should_reauthenticate(request, session):
    # Token expiry
    if token_expired(request.token):
        return True

    # Location change
    if session.location != request.location:
        return True

    # Device change
    if session.device_id != request.device_id:
        return True

    # High-risk resource
    if request.resource.sensitivity == 'high':
        return True

    # Elevated risk score
    if calculate_risk_score(request) > THRESHOLD:
        return True

    return False
\`\`\``,

  whyItMatters: 'Stolen tokens are useless if they expire quickly and context changes are detected. Continuous auth limits the blast radius of credential theft.',

  realWorldExample: {
    company: 'Microsoft',
    scenario: 'Azure AD Conditional Access',
    howTheyDoIt: 'Continuously evaluates signals: user, device, location, application, risk. If context changes (new location, risky sign-in), requires re-auth even with valid token.',
  },

  famousIncident: {
    title: 'SolarWinds Supply Chain Attack',
    company: 'SolarWinds / US Government',
    year: '2020',
    whatHappened: 'Attackers stole credentials and maintained access for months. Traditional long-lived tokens allowed persistent access without re-verification.',
    lessonLearned: 'Short-lived tokens + continuous auth limit dwell time. Even if credentials are stolen, access expires quickly.',
    icon: '☀️',
  },

  keyPoints: [
    'Trust is temporal - verify on every request',
    'Short-lived tokens (15 min) reduce exposure',
    'Monitor context: location, device, behavior',
    'Re-authenticate on context changes',
  ],

  keyConcepts: [
    { title: 'Continuous Auth', explanation: 'Re-verify identity on every request', icon: '🔄' },
    { title: 'Context Change', explanation: 'Location, device, or behavior anomaly', icon: '🚨' },
    { title: 'Risk Score', explanation: 'Aggregate risk from multiple signals', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'zero-trust-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Implement continuous authentication',
    taskDescription: 'Add Context Store and implement continuous auth logic in Gateway',
    componentsNeeded: [
      { type: 'cache', reason: 'Store session context and risk scores', displayName: 'Context Store' },
    ],
    successCriteria: [
      'Add Context Store (Cache)',
      'Connect Gateway → Context Store',
      'Implement context monitoring',
      'Trigger re-auth on context changes',
      'Use short-lived tokens (15 min)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'database' },
      { fromType: 'api_gateway', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Context Store (Cache) to track sessions',
    level2: 'Connect Gateway → Cache to store and check session context (location, device, risk)',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'api_gateway', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Mutual TLS (mTLS) for Service-to-Service Auth
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔒',
  scenario: "Your gateway talks to 10 backend services. How do they trust each other?",
  hook: "Traditional approach: Shared secrets or API keys. Problem? Keys get leaked, rotated manually, no strong identity.",
  challenge: "Implement Mutual TLS (mTLS) so services authenticate each other with certificates.",
  illustration: 'mtls',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'mTLS is securing service communication!',
  achievement: 'All service-to-service calls are mutually authenticated',
  metrics: [
    { label: 'Auth method', before: 'API keys', after: 'mTLS certificates' },
    { label: 'Certificate rotation', before: 'Manual', after: 'Automated' },
    { label: 'Service identity', after: 'Cryptographically verified' },
  ],
  nextTeaser: "Perfect! But how do we enforce fine-grained access policies?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Mutual TLS: Cryptographic Service Identity',
  conceptExplanation: `**Traditional TLS (HTTPS):**
- Client verifies server's certificate
- Server doesn't verify client
- One-way authentication

**Mutual TLS (mTLS):**
- Client verifies server's certificate
- Server verifies client's certificate
- Two-way authentication

**mTLS Handshake:**
\`\`\`
1. Gateway → Backend: "ClientHello" + Gateway Certificate
2. Backend validates Gateway's certificate
3. Backend → Gateway: "ServerHello" + Backend Certificate
4. Gateway validates Backend's certificate
5. Both certificates valid? → Establish encrypted connection
6. Any certificate invalid? → Connection refused
\`\`\`

**Certificate Contents:**
\`\`\`
Subject: service=api-gateway
Issuer: internal-ca.company.com
Valid: 2023-10-01 to 2023-11-01 (30 days)
Public Key: ...
Signature: ... (signed by CA)
\`\`\`

**Benefits:**
- Strong identity (certificates, not secrets)
- Automated rotation (no manual key updates)
- Prevents man-in-the-middle attacks
- Encrypted communication

**Certificate Authority (CA):**
- Issues and signs certificates
- Gateway trusts CA
- Backend trusts CA
- Certificates signed by CA are trusted`,

  whyItMatters: 'mTLS provides cryptographic proof of service identity. API keys can be stolen; certificates are bound to specific services and expire automatically.',

  realWorldExample: {
    company: 'Lyft',
    scenario: 'Lyft\'s service mesh (Envoy)',
    howTheyDoIt: 'Every service has a unique certificate. mTLS enforced for all service-to-service calls. Certificates rotated daily automatically. Zero shared secrets.',
  },

  keyPoints: [
    'mTLS provides mutual authentication - both sides verify',
    'Certificates are cryptographically signed by CA',
    'Automated rotation eliminates manual key management',
    'Prevents MITM and impersonation attacks',
  ],

  keyConcepts: [
    { title: 'mTLS', explanation: 'Mutual TLS - both sides authenticate', icon: '🔒' },
    { title: 'Certificate', explanation: 'Cryptographic identity signed by CA', icon: '📜' },
    { title: 'CA', explanation: 'Certificate Authority - issues and signs certs', icon: '🏛️' },
  ],
};

const step4: GuidedStep = {
  id: 'zero-trust-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: Enforce mTLS for service-to-service auth',
    taskDescription: 'Add Certificate Authority and configure mTLS between Gateway and Backends',
    componentsNeeded: [
      { type: 'certificate_authority', reason: 'Issues service certificates', displayName: 'Certificate Authority' },
    ],
    successCriteria: [
      'Add Certificate Authority',
      'Connect Gateway → CA (get certificate)',
      'Connect Backend → CA (get certificate)',
      'Enable mTLS verification on all connections',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server', 'database', 'cache', 'certificate_authority'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'database' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'certificate_authority' },
      { fromType: 'app_server', toType: 'certificate_authority' },
    ],
  },

  hints: {
    level1: 'Add Certificate Authority component',
    level2: 'Connect both Gateway and Backend to CA to obtain certificates for mTLS',
    solutionComponents: [{ type: 'certificate_authority' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'certificate_authority' },
      { from: 'app_server', to: 'certificate_authority' },
    ],
  },
};

// =============================================================================
// STEP 5: Policy Enforcement Engine
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚖️',
  scenario: "You have 100 users with different roles accessing 50 services!",
  hook: "Engineers should access dev APIs, not production. Admins can access everything, but only from secure devices. How do you enforce this?",
  challenge: "Implement a Policy Engine to enforce context-aware access control.",
  illustration: 'policy-engine',
};

const step5Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Policy engine is enforcing access control!',
  achievement: 'Fine-grained, context-aware policies protect every resource',
  metrics: [
    { label: 'Policies', after: 'Context-aware' },
    { label: 'Policy factors', after: 'Identity, device, location, time, risk' },
    { label: 'Unauthorized access', before: 'Possible', after: 'Blocked' },
  ],
  nextTeaser: "Excellent! Now let's add Identity-Aware Proxy for web apps...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Policy Enforcement: Fine-Grained Access Control',
  conceptExplanation: `**Zero Trust Policy Engine:**
Evaluates policies on EVERY request based on context.

**Policy Structure:**
\`\`\`yaml
policy:
  name: "Engineers access dev APIs only"
  conditions:
    - user.role == "engineer"
    - device.managed == true
    - device.os_version >= "13.0"
    - request.resource.environment == "dev"
    - time.hour >= 9 AND time.hour <= 18
  action: allow

policy:
  name: "Admins access prod from secure locations"
  conditions:
    - user.role == "admin"
    - device.managed == true
    - device.location IN ["US", "UK", "DE"]
    - request.resource.environment == "prod"
    - risk_score < 0.3
  action: allow

default: deny
\`\`\`

**Policy Evaluation:**
\`\`\`python
def evaluate_policy(request, user, device):
    for policy in policies:
        if all_conditions_match(policy, request, user, device):
            return policy.action

    return "deny"  # Default deny
\`\`\`

**Context Attributes:**
- **User:** role, department, clearance
- **Device:** managed, OS, location
- **Resource:** sensitivity, environment
- **Time:** hour, day, timezone
- **Risk:** aggregated risk score

**Benefits:**
- Least privilege - only grant minimum access
- Context-aware - same user, different contexts
- Dynamic - policies updated without code changes
- Auditable - all decisions logged`,

  whyItMatters: 'Static roles (admin, user) are too coarse. Policies enable fine-grained control based on who, what, when, where, and how risky.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Zero Trust access to internal services',
    howTheyDoIt: 'Policy engine evaluates user, device, and context. Engineers can access dev from anywhere, but prod requires secure device + US location + daylight hours.',
  },

  famousIncident: {
    title: 'Uber Data Breach via Over-Privileged Access',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Attackers gained access to an engineer\'s GitHub account and found AWS credentials with excessive privileges. They downloaded data on 57M users.',
    lessonLearned: 'Least privilege + policy-based access could have limited the blast radius. Context-aware policies prevent over-privileged access.',
    icon: '🚗',
  },

  keyPoints: [
    'Policy engine evaluates context on every request',
    'Policies encode business rules',
    'Context: user, device, resource, time, risk',
    'Default deny - explicit allow required',
  ],

  keyConcepts: [
    { title: 'Policy', explanation: 'Rules defining who can access what under which conditions', icon: '📜' },
    { title: 'Context', explanation: 'All attributes about request (user, device, location, etc)', icon: '🌐' },
    { title: 'Least Privilege', explanation: 'Grant minimum access necessary', icon: '🔒' },
  ],
};

const step5: GuidedStep = {
  id: 'zero-trust-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Apply context-aware policy enforcement',
    taskDescription: 'Add Policy Engine and implement policy evaluation in Gateway',
    componentsNeeded: [
      { type: 'policy_engine', reason: 'Evaluate access policies', displayName: 'Policy Engine' },
    ],
    successCriteria: [
      'Add Policy Engine component',
      'Connect Gateway → Policy Engine',
      'Define policies based on user, device, resource',
      'Implement default deny',
      'Log all policy decisions',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server', 'database', 'cache', 'certificate_authority', 'policy_engine'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'database' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'certificate_authority' },
      { fromType: 'app_server', toType: 'certificate_authority' },
      { fromType: 'api_gateway', toType: 'policy_engine' },
    ],
  },

  hints: {
    level1: 'Add Policy Engine component',
    level2: 'Connect Gateway → Policy Engine to evaluate access policies for every request',
    solutionComponents: [{ type: 'policy_engine' }],
    solutionConnections: [{ from: 'api_gateway', to: 'policy_engine' }],
  },
};

// =============================================================================
// STEP 6: Identity-Aware Proxy (IAP)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚪',
  scenario: "Your engineers work remotely and need access to internal web apps!",
  hook: "Traditional solution: VPN. Problems: VPN = network access = lateral movement risk. Need better!",
  challenge: "Implement Identity-Aware Proxy to grant access based on identity, not network.",
  illustration: 'iap',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Congratulations! Zero Trust Gateway complete!',
  achievement: 'Full Zero Trust architecture with identity verification, device trust, mTLS, policies, and IAP',
  metrics: [
    { label: 'Identity verification', after: 'Required ✓' },
    { label: 'Device trust', after: 'Enforced ✓' },
    { label: 'Continuous auth', after: 'Active ✓' },
    { label: 'mTLS', after: 'Enabled ✓' },
    { label: 'Policy engine', after: 'Running ✓' },
    { label: 'IAP', after: 'Deployed ✓' },
  ],
  nextTeaser: "You've mastered Zero Trust Security! Try the final exam to validate your design.",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Identity-Aware Proxy: Zero Trust for Web Apps',
  conceptExplanation: `**Traditional VPN:**
- Connect to network → trusted
- Access all internal resources
- Lateral movement if compromised

**Identity-Aware Proxy (IAP):**
- Access per-application, not network
- Identity-based, not location-based
- No lateral movement

**IAP Flow:**
\`\`\`
1. User requests internal-app.company.com
2. IAP intercepts request
3. IAP: "Who are you?" → Redirect to SSO
4. User authenticates (SSO + MFA)
5. IAP validates user identity + device trust
6. IAP checks policy: Can this user access this app?
7. If yes: IAP proxies request to backend
   If no: IAP returns 403 Forbidden
8. Backend only accessible via IAP (no direct access)
\`\`\`

**IAP Benefits:**
- No VPN needed
- Per-app access control
- Works from anywhere (remote, office, coffee shop)
- Prevents lateral movement
- Integrated with Zero Trust policies

**Example Policy:**
\`\`\`yaml
app: internal-dashboard
allowed_users:
  - engineers@company.com
  - managers@company.com
required_device: managed
required_mfa: true
allowed_locations: ["US", "UK", "DE"]
\`\`\``,

  whyItMatters: 'IAP extends Zero Trust to web applications. Users get secure access from anywhere without VPN, and compromised credentials can\'t enable lateral movement.',

  realWorldExample: {
    company: 'Google',
    scenario: 'BeyondCorp + Identity-Aware Proxy',
    howTheyDoIt: 'All internal apps behind IAP. Googlers access from untrusted networks (home, coffee shops) with no VPN. Every request authenticated, per-app policies enforced.',
  },

  keyPoints: [
    'IAP provides identity-based access to web apps',
    'Replaces VPN with per-app access control',
    'Enforces authentication, device trust, and policies',
    'Prevents lateral movement',
  ],

  keyConcepts: [
    { title: 'IAP', explanation: 'Identity-Aware Proxy - auth gateway for web apps', icon: '🚪' },
    { title: 'Per-App Access', explanation: 'Grant access to specific apps, not network', icon: '🎯' },
    { title: 'No VPN', explanation: 'Identity-based, not network-based access', icon: '🚫' },
  ],

  quickCheck: {
    question: 'How is IAP different from VPN?',
    options: [
      'IAP is faster than VPN',
      'IAP grants per-app access based on identity, VPN grants network access',
      'IAP requires hardware, VPN is software-only',
      'IAP is deprecated, VPN is modern',
    ],
    correctIndex: 1,
    explanation: 'IAP grants access to specific applications based on user identity and policies. VPN grants network access - once connected, you can access everything.',
  },
};

const step6: GuidedStep = {
  id: 'zero-trust-step-6',
  stepNumber: 6,
  frIndex: 5,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-6: Identity-aware proxy for web apps',
    taskDescription: 'Configure IAP functionality in Gateway to proxy web app access',
    componentsNeeded: [
      { type: 'web_app', reason: 'Internal web application', displayName: 'Internal Web App' },
    ],
    successCriteria: [
      'Add Internal Web App',
      'Configure Gateway as IAP',
      'Enforce authentication before proxying',
      'Apply per-app policies',
      'Block direct access to app (only via IAP)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'auth_service', 'api_gateway', 'app_server', 'database', 'cache', 'certificate_authority', 'policy_engine', 'web_app'],
    requiredConnections: [
      { fromType: 'client', toType: 'auth_service' },
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'database' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'certificate_authority' },
      { fromType: 'app_server', toType: 'certificate_authority' },
      { fromType: 'api_gateway', toType: 'policy_engine' },
      { fromType: 'api_gateway', toType: 'web_app' },
    ],
  },

  hints: {
    level1: 'Add Internal Web App component',
    level2: 'Connect Gateway → Web App to proxy authenticated requests',
    solutionComponents: [{ type: 'web_app' }],
    solutionConnections: [{ from: 'api_gateway', to: 'web_app' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const zeroTrustGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'zero-trust-gateway',
  title: 'Design a Zero Trust Gateway',
  description: 'Build a production-ready Zero Trust Gateway with identity verification, device trust, continuous auth, mTLS, and policy enforcement',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🛡️',
    hook: "You're the Security Architect at SecureCloud Inc!",
    scenario: "Traditional perimeter security failed. Hackers breached the firewall and stole customer data. Your mission: Build a Zero Trust Gateway that assumes breach and verifies everything.",
    challenge: "Can you design a gateway that never trusts, always verifies?",
  },

  requirementsPhase: zeroTrustGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Identity Verification',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway verifies JWT tokens on every request',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Device Trust Validation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway blocks unmanaged devices',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Continuous Authentication',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway detects context changes and triggers re-auth',
      traffic: { type: 'mixed', rps: 200, readRps: 200, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'mTLS Service Auth',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Gateway and backends authenticate via mTLS',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Policy Enforcement',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Gateway enforces context-aware access policies',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Identity-Aware Proxy',
      type: 'functional',
      requirement: 'FR-6',
      description: 'Gateway proxies web app access with identity verification',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'High Throughput with Auth',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Gateway handles 50K RPS with < 50ms auth overhead',
      traffic: { type: 'mixed', rps: 50000, readRps: 50000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
    {
      name: 'Stolen Token Mitigation',
      type: 'security',
      requirement: 'NFR-S1',
      description: 'Short-lived tokens + context monitoring limit stolen token impact',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 90,
      failureInjection: { type: 'credential_theft', atSecond: 30 },
      passCriteria: { maxCompromiseDuration: 900, maxErrorRate: 0.1 },
    },
  ] as TestCase[],

  concepts: [
    'Zero Trust Security',
    'Identity Verification',
    'Device Trust',
    'Continuous Authentication',
    'Mutual TLS (mTLS)',
    'Policy Enforcement',
    'Identity-Aware Proxy',
    'Least Privilege',
    'Assume Breach',
    'Context-Aware Access Control',
  ],

  ddiaReferences: [
    'Chapter 9: Security - Authentication, authorization, encryption',
    'Chapter 11: Stream Processing - Security in distributed systems',
  ],
};

export default zeroTrustGatewayGuidedTutorial;
