import { GuidedTutorial } from '../../types/guidedTutorial';

export const identityAuthProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'identity-auth-progressive',
  title: 'Design an Identity & Authentication System',
  description: 'Build an auth system from basic login to enterprise-grade identity platform',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design secure password storage with hashing',
    'Implement token-based authentication (JWT)',
    'Build OAuth 2.0 and SSO integration',
    'Handle MFA and passwordless authentication',
    'Scale identity management for millions of users'
  ],
  prerequisites: ['Security fundamentals', 'HTTP/REST', 'Cryptography basics'],
  tags: ['authentication', 'authorization', 'security', 'oauth', 'identity'],

  progressiveStory: {
    title: 'Identity System Evolution',
    premise: "You're building an identity and authentication platform. Starting with basic username/password login, you'll evolve to handle enterprise SSO, MFA, and millions of authentications per second.",
    phases: [
      { phase: 1, title: 'Basic Authentication', description: 'Username/password login' },
      { phase: 2, title: 'Token-Based Auth', description: 'Sessions and JWT tokens' },
      { phase: 3, title: 'Advanced Auth', description: 'OAuth, SSO, and MFA' },
      { phase: 4, title: 'Enterprise Identity', description: 'Scale, compliance, and zero-trust' }
    ]
  },

  steps: [
    // PHASE 1: Basic Authentication (Steps 1-3)
    {
      id: 'step-1',
      title: 'User Registration',
      phase: 1,
      phaseTitle: 'Basic Authentication',
      learningObjective: 'Securely store user credentials',
      thinkingFramework: {
        framework: 'Never Store Plaintext',
        approach: 'Hash password with salt before storage. Use slow hash (bcrypt, Argon2) to resist brute force. Validate email, enforce password policy.',
        keyInsight: 'Password hash must be slow. Fast hash = fast brute force. Bcrypt with cost factor 12+ takes ~250ms per hash, making attacks impractical.'
      },
      requirements: {
        functional: [
          'Accept username/email and password',
          'Validate email format and uniqueness',
          'Enforce password strength requirements',
          'Hash password with salt before storing'
        ],
        nonFunctional: [
          'Password hash time 200-500ms (intentionally slow)'
        ]
      },
      hints: [
        'User: {id, email, password_hash, created_at, email_verified}',
        'Hash: bcrypt.hash(password, 12) or Argon2id',
        'Policy: min 8 chars, upper, lower, number, special'
      ],
      expectedComponents: ['User Store', 'Password Hasher', 'Validator'],
      successCriteria: ['Users registered securely', 'Passwords never stored in plaintext'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Login Authentication',
      phase: 1,
      phaseTitle: 'Basic Authentication',
      learningObjective: 'Verify user credentials securely',
      thinkingFramework: {
        framework: 'Constant-Time Comparison',
        approach: 'Retrieve user by email, compare password hash. Use constant-time comparison to prevent timing attacks. Return generic error (dont reveal which field is wrong).',
        keyInsight: 'Never say "password incorrect" vs "user not found". Attackers enumerate valid emails. Always: "invalid credentials".'
      },
      requirements: {
        functional: [
          'Accept email and password',
          'Verify password against stored hash',
          'Return success or generic failure',
          'Track failed login attempts'
        ],
        nonFunctional: [
          'Same response time for valid/invalid users'
        ]
      },
      hints: [
        'Lookup: findUserByEmail(email) - may return null',
        'Verify: bcrypt.compare(password, user.password_hash)',
        'Track: failed_attempts table for rate limiting'
      ],
      expectedComponents: ['Login Handler', 'Password Verifier', 'Attempt Tracker'],
      successCriteria: ['Valid credentials authenticate', 'Invalid credentials rejected safely'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Account Security',
      phase: 1,
      phaseTitle: 'Basic Authentication',
      learningObjective: 'Protect against brute force and account takeover',
      thinkingFramework: {
        framework: 'Defense in Depth',
        approach: 'Rate limit login attempts per IP and per account. Lock account after N failures. Send alert on suspicious activity. Require CAPTCHA after failures.',
        keyInsight: 'Rate limit per account prevents targeted attacks. Rate limit per IP prevents distributed attacks. Need both.'
      },
      requirements: {
        functional: [
          'Lock account after 5 failed attempts',
          'Rate limit login requests per IP',
          'Email alert on suspicious login',
          'CAPTCHA after 3 failures'
        ],
        nonFunctional: [
          'Lockout duration: 15 min, then 1 hour, then 24 hours'
        ]
      },
      hints: [
        'Lock: account_locked_until timestamp, escalating duration',
        'Rate: 10 attempts/min per IP, 5 attempts/min per account',
        'Suspicious: new device, new location, multiple failures'
      ],
      expectedComponents: ['Rate Limiter', 'Account Locker', 'Alert Service'],
      successCriteria: ['Brute force blocked', 'Legitimate users not impacted'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Token-Based Auth (Steps 4-6)
    {
      id: 'step-4',
      title: 'Session Management',
      phase: 2,
      phaseTitle: 'Token-Based Auth',
      learningObjective: 'Maintain authenticated state across requests',
      thinkingFramework: {
        framework: 'Server-Side Sessions',
        approach: 'Create session on login, store in Redis. Session ID in secure cookie. Validate session on each request. Support concurrent sessions.',
        keyInsight: 'Session ID must be unpredictable. Use cryptographically random 128+ bit value. Never sequential or guessable.'
      },
      requirements: {
        functional: [
          'Create session on successful login',
          'Store session data server-side',
          'Validate session on each request',
          'Support logout (session invalidation)'
        ],
        nonFunctional: [
          'Session lookup < 5ms',
          'Session expiry: 24 hours idle, 7 days absolute'
        ]
      },
      hints: [
        'Session: {id, user_id, created_at, last_active, ip, user_agent}',
        'Cookie: HttpOnly, Secure, SameSite=Strict',
        'Redis: session:{id} → session data, with TTL'
      ],
      expectedComponents: ['Session Store', 'Cookie Manager', 'Session Validator'],
      successCriteria: ['Sessions maintained correctly', 'Logout invalidates session'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'JWT Tokens',
      phase: 2,
      phaseTitle: 'Token-Based Auth',
      learningObjective: 'Issue and validate stateless tokens',
      thinkingFramework: {
        framework: 'Stateless Authentication',
        approach: 'JWT contains user claims, signed with secret. No server-side storage needed. Short expiry + refresh token pattern. Validate signature and claims.',
        keyInsight: 'JWT tradeoff: stateless (scalable) but hard to revoke. Use short expiry (15 min) + refresh tokens. Revoke refresh token to force re-auth.'
      },
      requirements: {
        functional: [
          'Issue JWT access token on login',
          'Include user claims (id, roles, permissions)',
          'Validate signature and expiry',
          'Issue refresh token for renewal'
        ],
        nonFunctional: [
          'Access token expiry: 15 minutes',
          'Refresh token expiry: 7 days'
        ]
      },
      hints: [
        'JWT payload: {sub: user_id, roles, iat, exp}',
        'Sign: HMAC-SHA256 (symmetric) or RS256 (asymmetric)',
        'Refresh: store in DB, one-time use, rotate on refresh'
      ],
      expectedComponents: ['Token Issuer', 'Token Validator', 'Refresh Handler'],
      successCriteria: ['Tokens issued and validated', 'Refresh flow works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Token Revocation',
      phase: 2,
      phaseTitle: 'Token-Based Auth',
      learningObjective: 'Revoke tokens before expiry when needed',
      thinkingFramework: {
        framework: 'Revocation Strategies',
        approach: 'Blacklist: store revoked token IDs. Allowlist: only valid token IDs accepted. Token versioning: invalidate all tokens older than version.',
        keyInsight: 'Full JWT benefits require giving up instant revocation. Hybrid: short-lived JWT + server-checked refresh token. Best of both worlds.'
      },
      requirements: {
        functional: [
          'Revoke individual tokens (logout)',
          'Revoke all user tokens (password change)',
          'Check revocation on each request',
          'Handle token family rotation'
        ],
        nonFunctional: [
          'Revocation check < 5ms'
        ]
      },
      hints: [
        'Blacklist: Redis set of revoked jti (token ID)',
        'Token version: user.token_version, include in JWT, compare on validation',
        'Family: refresh tokens linked, revoke whole family on reuse detection'
      ],
      expectedComponents: ['Revocation Store', 'Token Family Tracker', 'Revocation Checker'],
      successCriteria: ['Tokens revocable', 'Revoked tokens rejected'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Advanced Auth (Steps 7-9)
    {
      id: 'step-7',
      title: 'OAuth 2.0 Provider',
      phase: 3,
      phaseTitle: 'Advanced Auth',
      learningObjective: 'Implement OAuth authorization server',
      thinkingFramework: {
        framework: 'OAuth Flows',
        approach: 'Authorization Code flow for web apps. PKCE for mobile/SPA. Client credentials for server-to-server. Issue access tokens to authorized clients.',
        keyInsight: 'Never use Implicit flow (deprecated). Authorization Code + PKCE is secure for all public clients. Back-channel token exchange prevents interception.'
      },
      requirements: {
        functional: [
          'Register OAuth clients (apps)',
          'Authorization endpoint with consent screen',
          'Token endpoint for code exchange',
          'Support PKCE for public clients'
        ],
        nonFunctional: [
          'Auth code valid for 10 minutes, single use'
        ]
      },
      hints: [
        'Client: {id, secret_hash, redirect_uris, scopes}',
        'Auth code: short-lived, bound to redirect_uri, PKCE verifier',
        'Consent: show requested scopes, remember consent'
      ],
      expectedComponents: ['Authorization Server', 'Client Registry', 'Consent Manager'],
      successCriteria: ['OAuth flows work', 'PKCE validated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'SSO Integration',
      phase: 3,
      phaseTitle: 'Advanced Auth',
      learningObjective: 'Enable single sign-on across applications',
      thinkingFramework: {
        framework: 'Federated Identity',
        approach: 'Central identity provider (IdP), multiple service providers (SP). SAML for enterprise, OIDC for modern apps. Single logout propagation.',
        keyInsight: 'SSO session != app session. User logs into IdP once, each app creates local session. Logout from IdP should terminate all app sessions.'
      },
      requirements: {
        functional: [
          'Act as SAML/OIDC identity provider',
          'Federate with external IdPs (Google, Okta)',
          'Single sign-on across registered apps',
          'Single logout with session propagation'
        ],
        nonFunctional: [
          'SSO login < 2 seconds'
        ]
      },
      hints: [
        'OIDC: userinfo endpoint, id_token with user claims',
        'SAML: assertion with attributes, signed XML',
        'SLO: notify all SPs on logout, front-channel or back-channel'
      ],
      expectedComponents: ['Identity Provider', 'Federation Manager', 'SSO Session'],
      successCriteria: ['SSO works across apps', 'External IdPs federated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Multi-Factor Authentication',
      phase: 3,
      phaseTitle: 'Advanced Auth',
      learningObjective: 'Add second authentication factors',
      thinkingFramework: {
        framework: 'Defense Layers',
        approach: 'Something you know (password) + something you have (phone/key). TOTP apps, SMS (weak), hardware keys (strongest). Backup codes for recovery.',
        keyInsight: 'SMS is weakest 2FA (SIM swapping). TOTP is good. Hardware keys (FIDO2/WebAuthn) are best - phishing resistant.'
      },
      requirements: {
        functional: [
          'Enroll TOTP authenticator (Google Auth, Authy)',
          'Support hardware security keys (WebAuthn)',
          'Generate and manage backup codes',
          'Require MFA for sensitive operations'
        ],
        nonFunctional: [
          'MFA verification < 1 second',
          'TOTP time window: ±30 seconds'
        ]
      },
      hints: [
        'TOTP: shared secret, time-based 6-digit code, RFC 6238',
        'WebAuthn: public key challenge-response, device-bound',
        'Backup: 10 single-use codes, hashed storage'
      ],
      expectedComponents: ['MFA Manager', 'TOTP Verifier', 'WebAuthn Handler'],
      successCriteria: ['MFA enrollment works', 'Multiple factors supported'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Enterprise Identity (Steps 10-12)
    {
      id: 'step-10',
      title: 'Role-Based Access Control',
      phase: 4,
      phaseTitle: 'Enterprise Identity',
      learningObjective: 'Implement fine-grained authorization',
      thinkingFramework: {
        framework: 'RBAC to ABAC',
        approach: 'Roles contain permissions. Users assigned roles. Check permission, not role. Attribute-based (ABAC) for complex rules: "managers can approve expenses under $10K".',
        keyInsight: 'Check permissions at resource level, not just endpoint. User can view some documents but not others. Resource-level authorization required.'
      },
      requirements: {
        functional: [
          'Define roles with permissions',
          'Assign roles to users',
          'Check permissions on API requests',
          'Support resource-level permissions'
        ],
        nonFunctional: [
          'Permission check < 10ms'
        ]
      },
      hints: [
        'Permission: resource:action (documents:read, users:delete)',
        'Role: {name, permissions: []}',
        'Resource: {owner, permissions: [{user/role, actions}]}'
      ],
      expectedComponents: ['Permission Store', 'Role Manager', 'Authorization Engine'],
      successCriteria: ['RBAC enforced', 'Resource-level checks work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Passwordless & Passkeys',
      phase: 4,
      phaseTitle: 'Enterprise Identity',
      learningObjective: 'Enable authentication without passwords',
      thinkingFramework: {
        framework: 'Beyond Passwords',
        approach: 'Magic links via email. WebAuthn passkeys (device-bound or synced). Biometric unlock. No password = no password attacks.',
        keyInsight: 'Passkeys are the future. Synced across devices (iCloud, Google), phishing-resistant, no passwords to remember or steal.'
      },
      requirements: {
        functional: [
          'Magic link authentication via email',
          'Passkey registration and authentication',
          'Biometric verification (Face ID, fingerprint)',
          'Fallback to traditional auth if needed'
        ],
        nonFunctional: [
          'Magic link expiry: 15 minutes',
          'Passkey auth < 2 seconds'
        ]
      },
      hints: [
        'Magic link: token in URL, single-use, verify and create session',
        'Passkey: WebAuthn credential, stored in platform authenticator',
        'Discoverable: passkey can identify user (no username needed)'
      ],
      expectedComponents: ['Magic Link Service', 'Passkey Manager', 'Biometric Handler'],
      successCriteria: ['Passwordless login works', 'Passkeys registered and used'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Zero-Trust & Audit',
      phase: 4,
      phaseTitle: 'Enterprise Identity',
      learningObjective: 'Implement zero-trust and compliance logging',
      thinkingFramework: {
        framework: 'Never Trust, Always Verify',
        approach: 'Every request authenticated and authorized. Device trust evaluation. Continuous authentication. Complete audit trail for compliance.',
        keyInsight: 'Zero-trust: verify device posture, location, behavior. Step-up auth for risky actions. Every auth decision logged for audit.'
      },
      requirements: {
        functional: [
          'Evaluate device trust (managed, compliant)',
          'Risk-based authentication (step-up MFA)',
          'Comprehensive audit logging',
          'Support compliance requirements (SOC2, GDPR)'
        ],
        nonFunctional: [
          'Audit log retention: 1 year',
          'Real-time risk scoring'
        ]
      },
      hints: [
        'Device: {id, managed, os_version, last_verified}',
        'Risk signals: new device, impossible travel, unusual time',
        'Audit: {timestamp, user, action, resource, result, context}'
      ],
      expectedComponents: ['Device Trust', 'Risk Engine', 'Audit Logger'],
      successCriteria: ['Zero-trust enforced', 'Complete audit trail'],
      estimatedTime: '10 minutes'
    }
  ]
};
