import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpSecurityLesson: SystemDesignLesson = {
  id: 'sdp-security',
  slug: 'sdp-security',
  title: 'Security Fundamentals',
  description: 'Master security fundamentals and critical trade-offs: WHEN to use session vs JWT authentication, HOW HTTPS impacts performance, WHICH security measures are worth the latency cost.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,

  // Progressive flow metadata
  moduleId: 'sd-module-5-primer',
  sequenceOrder: 10,
  stages: [
    {
      id: 'intro-security',
      type: 'concept',
      title: 'Security Fundamentals',
      content: (
        <Section>
          <H1>Security Fundamentals</H1>
          <P>
            Security is critical for protecting user data and preventing attacks.
          </P>

          <H2>HTTPS/TLS</H2>
          <P>
            Encrypts data in transit between client and server:
          </P>
          <UL>
            <LI>Prevents man-in-the-middle attacks</LI>
            <LI>Encrypts HTTP traffic using TLS</LI>
            <LI>Requires SSL certificate (validated by CA)</LI>
            <LI>Use for all sensitive data (passwords, payment info)</LI>
          </UL>

          <H2>Authentication vs Authorization</H2>
          <UL>
            <LI><Strong>Authentication:</Strong> "Who are you?" - Verifies user identity (login)</LI>
            <LI><Strong>Authorization:</Strong> "What can you do?" - Checks user permissions (access control)</LI>
          </UL>

          <H2>OAuth 2.0</H2>
          <P>
            Standard protocol for authorization (not authentication):
          </P>
          <OL>
            <LI>User clicks "Login with Google"</LI>
            <LI>Redirected to Google for authentication</LI>
            <LI>Google returns authorization code</LI>
            <LI>App exchanges code for access token</LI>
            <LI>App uses token to access user's Google data</LI>
          </OL>

          <H2>Common Vulnerabilities</H2>
          <H3>SQL Injection</H3>
          <P>
            Attacker injects malicious SQL code:
          </P>
          <CodeBlock>
{`// VULNERABLE
query = "SELECT * FROM users WHERE id = " + user_input
// If user_input = "1 OR 1=1", deletes all users!

// SAFE (Parameterized queries)
query = "SELECT * FROM users WHERE id = ?"
execute(query, [user_input])`}
          </CodeBlock>

          <H3>XSS (Cross-Site Scripting)</H3>
          <P>
            Attacker injects malicious JavaScript:
          </P>
          <UL>
            <LI>Sanitize user input</LI>
            <LI>Escape HTML/JavaScript in output</LI>
            <LI>Use Content Security Policy (CSP)</LI>
          </UL>

          <H3>CSRF (Cross-Site Request Forgery)</H3>
          <P>
            Attacker tricks user into making unwanted requests:
          </P>
          <UL>
            <LI>Use CSRF tokens</LI>
            <LI>Check Origin/Referer headers</LI>
            <LI>SameSite cookie attribute</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Always use HTTPS, validate and sanitize input, use parameterized queries,
            implement proper authentication and authorization.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'session-vs-jwt-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Session vs JWT Authentication',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Session vs JWT Authentication</H1>
          <P>
            <Strong>The Decision:</Strong> Session-based auth requires server state (Redis) but enables instant revocation.
            JWT is stateless (scales infinitely) but can't be revoked until expiry. Wrong choice: either scaling bottleneck
            (sessions) or security risk (stolen JWTs can't be invalidated).
          </P>

          <ComparisonTable
            headers={['Factor', 'Session (Cookie)', 'JWT (Stateless)', 'JWT + Refresh Token', 'OAuth 2.0']}
            rows={[
              ['Server State', 'Required (Redis/DB)', 'None (stateless)', 'Minimal (refresh tokens only)', 'Required (OAuth provider)'],
              ['Scalability', 'Medium (Redis bottleneck)', 'Excellent (no state)', 'Excellent (mostly stateless)', 'Depends on provider'],
              ['Revocation', 'Instant (delete session)', 'Not possible (until expiry)', 'Possible (revoke refresh token)', 'Provider controls'],
              ['Token Size', '32 bytes (session ID)', '200-1000 bytes (JWT)', '200 bytes + refresh', 'Variable'],
              ['Latency', '5ms (Redis lookup)', '0ms (no lookup)', '0ms (with refresh flow)', '50-200ms (OAuth redirect)'],
              ['Security', 'High (server controls)', 'Medium (token theft risk)', 'High (short-lived access)', 'High (delegated)'],
              ['Best For', 'Traditional web apps', 'Microservices, APIs', 'Mobile apps, SPAs', 'Third-party auth'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Authentication</H2>
          <Example title="Session vs JWT - Scalability vs Security">
            <CodeBlock>
{`Scenario: E-commerce site, 100k users, need to revoke access on password change

---

Approach 1: Session-Based Authentication (Cookie + Redis)

Login flow:
POST /login {email, password}
→ Verify password
→ Generate session ID: "abc123"
→ Store in Redis: sessions:abc123 = {user_id: 123, expires: 1h}
→ Set cookie: session_id=abc123; HttpOnly; Secure

Request flow:
GET /api/profile
Cookie: session_id=abc123
→ Lookup Redis: sessions:abc123
→ If found: user authenticated (user_id=123)
→ If not found: 401 Unauthorized

Logout/Revoke:
POST /logout
→ Delete from Redis: DEL sessions:abc123
→ User immediately logged out ✅

Performance:
- Latency: +5ms per request (Redis lookup)
- Throughput: 100k req/sec (Redis limit)
- Cost: $150/mo (Redis r5.large for 100k sessions)

Security:
✅ Instant revocation (delete session)
✅ Password change → invalidate all sessions
✅ Server controls everything

Scaling:
⚠️ Redis is single point of failure
⚠️ All app servers must reach same Redis
⚠️ Cross-region latency (50ms if Redis in us-east, app in eu-west)

Cost: $150/mo Redis + $500/mo app servers = $650/mo

Decision: ✅ BEST for traditional web apps (admin panels, dashboards)

---

Approach 2: JWT (Stateless)

Login flow:
POST /login {email, password}
→ Verify password
→ Generate JWT:
   Header: {alg: "HS256", typ: "JWT"}
   Payload: {user_id: 123, exp: 1h}
   Signature: HMACSHA256(header + payload, secret_key)
→ Return JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Request flow:
GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
→ Verify signature (no DB lookup!)
→ Check expiry
→ Extract user_id from payload
→ User authenticated ✅

Logout:
POST /logout
→ Client deletes JWT
→ But: JWT still valid until expiry! ❌

Problem: Stolen JWT
- Attacker steals JWT (XSS, network sniffing)
- JWT valid for 1 hour → attacker has 1 hour access
- No way to revoke (stateless) ❌

Example breach:
- User's laptop stolen at cafe
- JWT in browser localStorage
- Attacker has 1 hour to drain account ($5k loss)

Performance:
- Latency: 0ms (no lookup) ✅
- Throughput: Unlimited (stateless) ✅
- Cost: $0 (no Redis)

Security:
❌ No revocation (until expiry)
❌ Password change doesn't invalidate JWT
⚠️ XSS attack steals JWT → game over

Scaling:
✅ Perfect horizontal scaling
✅ No shared state between servers
✅ Works across regions (no latency)

Cost: $500/mo app servers only = $500/mo

Trade-off: Save $150/mo but lose instant revocation
Decision: ❌ BAD for sensitive data (can't revoke)
         ✅ OK for low-risk APIs (read-only)

---

Approach 3: JWT + Refresh Token (Best of Both Worlds)

Login flow:
POST /login {email, password}
→ Generate short-lived JWT (15 min expiry)
   Access Token: {user_id: 123, exp: 15min}
→ Generate long-lived refresh token (30 days)
   Refresh Token: random UUID, store in Redis
→ Return both tokens

Request flow:
GET /api/profile
Authorization: Bearer <access_token>
→ Verify JWT (no DB lookup)
→ If expired: return 401
→ Client: Refresh token

Refresh flow:
POST /refresh
{refresh_token: "uuid123"}
→ Check Redis: refresh_tokens:uuid123
→ If valid: issue new access token (15 min)
→ Return new access token

Revocation:
POST /logout
→ Delete refresh token from Redis
→ Access token valid for 15 more min (acceptable)
→ After 15 min: can't refresh → fully logged out ✅

Password change:
→ Delete all refresh tokens for user
→ All devices logged out within 15 min ✅

Performance:
- Latency: 0ms (most requests use JWT)
- Refresh: 5ms (Redis lookup, happens rarely)
- Throughput: Unlimited (99% of requests stateless)

Security:
✅ JWT stolen → only 15 min window (vs 1 hour)
✅ Refresh token can be revoked
✅ Password change → devices logged out within 15 min

Scaling:
✅ Perfect (only refresh tokens in Redis)
✅ 100k users × 3 devices = 300k refresh tokens
✅ Redis: $100/mo (vs $150 for sessions)

Cost: $100/mo Redis + $500/mo app servers = $600/mo

Decision: ✅ BEST for mobile apps, SPAs (balance of security + scale)

---

Approach 4: OAuth 2.0 (Third-Party Auth)

Login flow:
1. User clicks "Login with Google"
2. Redirect to Google: https://accounts.google.com/o/oauth2/auth
3. User approves
4. Google redirects back: /callback?code=xyz
5. Exchange code for access token
6. Use token to get user info from Google

Latency:
- Login: 2-5 seconds (redirects + OAuth flow)
- API requests: Same as JWT (use Google's access token)

Benefits:
✅ No password storage (Google handles it)
✅ 2FA built-in (Google's responsibility)
✅ Users trust Google more than your brand

Trade-offs:
❌ Vendor lock-in (dependent on Google)
❌ Slower login (redirects)
❌ Complex flow (OAuth 2.0 spec)

Cost: $0 (Google OAuth is free) + $500/mo app servers

Decision: ✅ BEST for B2C apps (user convenience)
         ⚠️ Requires fallback (email/password for enterprise)

---

Cost-Benefit Analysis:

Session-based: $650/mo
- Pros: Instant revocation, simple
- Cons: Redis dependency, scaling complexity
- Use: Admin panels, internal tools

JWT only: $500/mo (saves $150/mo)
- Pros: Perfect scaling, no dependencies
- Cons: No revocation (security risk)
- Use: Read-only APIs, low-risk data

JWT + Refresh: $600/mo (saves $50/mo)
- Pros: Scalability + revocation
- Cons: Slightly more complex
- Use: Mobile apps, SPAs, APIs ✅ BEST BALANCE

OAuth 2.0: $500/mo + integration time (2 weeks)
- Pros: No password management, user trust
- Cons: Vendor dependency
- Use: B2C apps with Google/Facebook login`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Authentication Strategy Decision Tree

app_type = identify_application_type()
revocation_critical = assess_revocation_needs()
scale_requirement = measure_expected_scale()

if (third_party_auth_acceptable):  # B2C, social login
    return "OAuth 2.0 (Google, Facebook, GitHub)"
    # Benefits: No password storage, user trust, built-in 2FA

elif (app_type == "traditional_web" && scale < 100k_users):
    return "Session-based (Cookie + Redis)"
    # Simple, instant revocation, proven

elif (app_type == "spa" || app_type == "mobile"):
    if (revocation_critical):  # Banking, e-commerce
        return "JWT + Refresh Token"
        # Balance: Scalability + security
    else:  # Low-risk read-only
        return "JWT (stateless)"
        # Max performance, simple

elif (microservices_internal):
    return "JWT (stateless)"
    # No shared Redis, service-to-service

elif (admin_panel || sensitive_data):
    return "Session-based"
    # Instant revocation required

else:
    return "JWT + Refresh Token"  # Safe default

# Security requirements:
if (pci_compliance || financial_data):
    return "Session-based OR JWT + Refresh (short-lived)"
    # Instant revocation critical
if (gdpr || user_data_sensitive):
    return "OAuth 2.0 OR JWT + Refresh"
    # Right to be forgotten = need revocation`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Storing JWT in localStorage (XSS vulnerable)</Strong>
            <P>
              Example: JWT stored in localStorage → XSS attack injects script → steals JWT → attacker has full access for
              1 hour → drains user account ($10k loss). LocalStorage accessible to any JavaScript = major security hole.
            </P>
            <P>
              <Strong>Fix:</Strong> Store JWT in HttpOnly cookie (JavaScript can't access). Or use session-based auth. Never
              localStorage or sessionStorage for tokens. If must use JWT client-side, use short expiry (5-15 min) + refresh
              token flow. Implement Content Security Policy to prevent XSS.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Long-lived JWT without refresh token</Strong>
            <P>
              Example: JWT with 7 day expiry → user changes password → old JWT still valid for 7 days → attacker who stole
              JWT keeps access for 7 days. Or: Employee fired → JWT valid for 7 days → ex-employee accesses company data
              → $100k data breach fine.
            </P>
            <P>
              <Strong>Fix:</Strong> Use short-lived access tokens (15 min) + long-lived refresh tokens (30 days). On password
              change, revoke all refresh tokens. Access token stolen = only 15 min window. Implement JWT blacklist for critical
              events (in Redis, defeats stateless benefit but worth it for security). For admin users, use 5 min expiry.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not implementing logout with JWT</Strong>
            <P>
              Example: User logs out → JWT deleted client-side → but JWT still valid on server → stolen JWT from previous
              session still works → attacker uses old JWT from browser cache → unauthorized access. "Logout" is cosmetic only.
            </P>
            <P>
              <Strong>Fix:</Strong> Implement proper logout: Use refresh token pattern, revoke refresh token on logout. Or:
              Maintain JWT blacklist in Redis (add to blacklist on logout, check on each request). Or: Use short expiry (15 min)
              so logout effective within 15 min. For critical apps, use session-based auth (instant revocation).
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce with 100k users. Session-based: $650/mo (Redis + servers). JWT-only: $500/mo
            but 1% breach rate (stolen tokens) = 1000 accounts × $100 avg loss = $100k/year damage + reputation. JWT + Refresh:
            $600/mo, breach window 15 min (vs 1 hour) = 75% reduction in damage = $75k/year saved. Investment: $100/mo more than
            JWT-only ($1,200/year) prevents $75k losses = 62.5× ROI. Plus: Compliance (PCI-DSS requires revocation capability).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'https-performance-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: HTTPS/TLS Performance vs Security',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: HTTPS/TLS Performance vs Security</H1>
          <P>
            <Strong>The Decision:</Strong> HTTPS adds 50-200ms latency (TLS handshake) but prevents man-in-the-middle attacks.
            TLS 1.3 is 30% faster than TLS 1.2. Session resumption reduces handshake to 0ms. Wrong configuration: either slow
            UX (full handshake every request) or security vulnerability (weak ciphers).
          </P>

          <ComparisonTable
            headers={['Factor', 'HTTP (No Encryption)', 'HTTPS TLS 1.2', 'HTTPS TLS 1.3', 'HTTPS + Session Resumption']}
            rows={[
              ['Handshake Latency', '0ms', '100-200ms (2 RTT)', '50-100ms (1 RTT)', '0ms (resumed session)'],
              ['Data Transfer Speed', 'Baseline', '-5% (encryption overhead)', '-3% (faster encryption)', '-3%'],
              ['Security', 'None (plaintext)', 'Strong (encrypted)', 'Stronger (modern ciphers)', 'Strong'],
              ['Browser Warning', 'Yes ("Not Secure")', 'No', 'No', 'No'],
              ['SEO Ranking', 'Penalized', 'Neutral', 'Neutral', 'Neutral'],
              ['Certificate Cost', '$0', '$0 (Let\'s Encrypt)', '$0 (Let\'s Encrypt)', '$0'],
              ['CPU Overhead', '0%', '+10% (RSA)', '+5% (ECDSA)', '+5%'],
            ]}
          />

          <Divider />

          <H2>Real Decision: API Performance Optimization</H2>
          <Example title="HTTP vs HTTPS - Security vs Latency">
            <CodeBlock>
{`Scenario: API serving 10k req/sec, latency target < 100ms

---

Baseline: HTTP (No Encryption)

Request flow:
Client → Server (direct TCP connection)
Time: 0ms handshake + 20ms request = 20ms total

Performance:
- Latency: 20ms ✅
- Throughput: 10k req/sec
- CPU: 20% (parsing only)

Security:
❌ Data sent in plaintext (passwords, credit cards visible)
❌ Man-in-the-middle attack (attacker can read/modify data)
❌ Browser shows "Not Secure" (users don't trust)

Cost: $500/mo (5× servers)

Decision: ❌ NEVER use HTTP for production (security risk)

---

Approach 1: HTTPS with TLS 1.2 (Old Standard)

First request (full handshake):
1. TCP handshake: 50ms (1 RTT)
2. TLS handshake: 100ms (2 RTT)
   - Client Hello
   - Server Hello + Certificate
   - Key Exchange
   - Finished
3. HTTP request: 20ms
Total: 170ms (8.5× slower than HTTP) ❌

Subsequent requests (same connection):
- TLS handshake: 0ms (reuse connection)
- HTTP request: 20ms
Total: 20ms ✅

Connection reuse problem:
- Mobile: Network changes (WiFi → 4G) → new handshake (170ms)
- Load balancer: May route to different server → new handshake
- Idle timeout: Connection closed after 60s → new handshake

Real-world latency:
- 30% requests: full handshake (170ms)
- 70% requests: reused connection (20ms)
- Average: 0.3 × 170 + 0.7 × 20 = 65ms

Performance:
- Latency: 65ms avg (3× slower than HTTP)
- CPU: +10% (RSA encryption overhead)
- Throughput: 9k req/sec (CPU limit)

Cost: $550/mo (6× servers, more CPU)

Decision: ⚠️ Works but slow handshakes hurt mobile users

---

Approach 2: HTTPS with TLS 1.3 (Modern Standard)

First request (TLS 1.3):
1. TCP handshake: 50ms (1 RTT)
2. TLS 1.3 handshake: 50ms (1 RTT only!) ✅
   - Client Hello + Key Share (combined)
   - Server Hello + Finished
3. HTTP request: 20ms
Total: 120ms (vs 170ms TLS 1.2) - 29% faster! ✅

TLS 1.3 improvements:
- 1-RTT handshake (vs 2-RTT in TLS 1.2)
- Faster ciphers (ChaCha20-Poly1305, AES-GCM)
- Removes legacy weak ciphers (RC4, 3DES)

Real-world latency:
- 30% requests: full handshake (120ms)
- 70% requests: reused connection (20ms)
- Average: 0.3 × 120 + 0.7 × 20 = 50ms ✅

Performance:
- Latency: 50ms avg (vs 65ms TLS 1.2) - 23% faster
- CPU: +5% (ECDSA vs RSA) - 50% less than TLS 1.2
- Throughput: 9.5k req/sec

Cost: $550/mo (same)

Decision: ✅ Use TLS 1.3 (faster, more secure)

---

Approach 3: TLS Session Resumption (Zero Handshake)

Session resumption flow:
First request:
1. Full TLS 1.3 handshake (120ms)
2. Server issues session ticket (encrypted session key)
3. Client stores ticket

Subsequent requests (within 24h):
1. TCP handshake: 50ms
2. Client sends session ticket → Server resumes session
3. TLS handshake: 0ms (no crypto exchange!) ✅
4. HTTP request: 20ms
Total: 70ms (vs 120ms full handshake)

Real-world latency:
- 10% requests: full handshake (120ms) - new users, expired tickets
- 90% requests: session resumption (70ms)
- Average: 0.1 × 120 + 0.9 × 70 = 75ms

But: Mobile network changes invalidate ticket → back to full handshake

Performance:
- Latency: 75ms avg (mobile), 70ms (desktop)
- CPU: +5% (same as TLS 1.3)

Session ticket security:
⚠️ Ticket valid for 24 hours → stolen ticket = 24h access
✅ Rotate encryption keys daily (limit damage)

Cost: $550/mo

Decision: ✅ Enable session resumption (25% faster repeat visits)

---

Approach 4: HTTP/2 + TLS 1.3 + Connection Pooling

HTTP/2 benefits:
- Multiplexing: Multiple requests over single connection
- Header compression: HPACK (50% smaller headers)
- Server push: Proactively send resources

Setup:
nginx http2 on;
ssl_protocols TLSv1.3;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 24h;

Connection pooling (client-side):
const https = require('https');
const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 50  // Reuse 50 connections
});

Performance:
- First request: 120ms (TLS 1.3 handshake)
- Requests 2-100: 20ms each (connection reused) ✅
- Average latency: 22ms (almost same as HTTP!)

Real-world impact:
- API: 100 requests/session → 1 handshake → 99 reused
- Avg: (120 + 99 × 20) / 100 = 21ms ✅

CPU: +5% (TLS overhead amortized over 100 requests)

Cost: $550/mo

Decision: ✅ BEST - Security + performance (21ms avg)

---

Latency Comparison:

HTTP (insecure): 20ms ❌ NEVER use
HTTPS TLS 1.2: 65ms avg ⚠️ Slow
HTTPS TLS 1.3: 50ms avg ✅ Good
TLS 1.3 + Session Resumption: 30ms avg ✅ Better
HTTP/2 + TLS 1.3 + Pooling: 21ms avg ✅ BEST

Recommendation:
1. Always use HTTPS (security non-negotiable)
2. Enable TLS 1.3 (50% faster handshake)
3. Enable session resumption (0ms repeat handshakes)
4. Use HTTP/2 (connection reuse)
5. Client connection pooling (keep-alive)

Result: HTTPS with 5% overhead (21ms vs 20ms HTTP)
Security: Encrypted, no MITM attacks ✅`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# HTTPS Configuration Decision

# Step 1: Always use HTTPS (non-negotiable)
if (using_http):
    error("HTTP is insecure - migrate to HTTPS immediately")

# Step 2: Choose TLS version
if (support_old_browsers):  # IE11, Android 4.x
    min_tls_version = "TLS 1.2"
    warning("TLS 1.2 required for old browsers (slower)")
else:
    min_tls_version = "TLS 1.3"  # Modern browsers (2018+)
    # 50% faster handshake

# Step 3: Enable performance optimizations
enable_session_resumption = True  # 0ms repeat handshakes
enable_http2 = True  # Multiplexing, header compression
enable_ocsp_stapling = True  # Faster certificate validation

# Step 4: Choose cipher suites
if (need_pci_compliance):
    ciphers = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
    # Strong ciphers only
else:
    ciphers = "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384"
    # AES-128 sufficient, faster

# Step 5: Certificate type
if (budget > $100/year):
    cert = "EV Certificate"  # Green bar, higher trust
elif (need_wildcard):
    cert = "Wildcard Certificate"  # *.example.com
else:
    cert = "Let's Encrypt (free)"  # Perfect for most cases

# Nginx config example:
nginx_config = """
ssl_protocols TLSv1.3 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 24h;
ssl_stapling on;
http2 on;
"""`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Not enabling session resumption</Strong>
            <P>
              Example: Mobile app makes 100 API requests/session → each request does full TLS handshake (120ms) → total 12
              seconds wasted on handshakes → slow app → 20% user churn. With session resumption: 1 handshake (120ms) + 99 fast
              requests (20ms) = 2.1 seconds total → 5.7× faster.
            </P>
            <P>
              <Strong>Fix:</Strong> Enable session resumption in web server: Nginx <Code>ssl_session_cache shared:SSL:10m</Code>,
              Apache <Code>SSLSessionCache shmcb</Code>. Client-side: Use persistent HTTP connections (keep-alive). Mobile apps:
              Reuse SSL session across requests. Reduces latency 80% for repeat requests. Cost: 0 (free optimization).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using weak ciphers for "performance"</Strong>
            <P>
              Example: Enable RC4 cipher (fast but broken) to reduce CPU → attacker breaks encryption in 52 hours → steals
              credit card data → $500k PCI-DSS fine + $1M customer notification cost. "Performance optimization" costs $1.5M.
            </P>
            <P>
              <Strong>Fix:</Strong> Only use strong modern ciphers: TLS 1.3 (AES-GCM, ChaCha20-Poly1305). Disable weak ciphers:
              RC4, 3DES, export ciphers. Modern ciphers are fast enough (5% CPU overhead). Use hardware acceleration (AES-NI)
              if CPU is bottleneck. Never compromise security for marginal performance gains. Test config: SSL Labs scanner.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using HTTP/2 with HTTPS</Strong>
            <P>
              Example: Website loads 50 resources (CSS, JS, images) → HTTP/1.1 opens 6 parallel connections × 8 batches = 48
              TLS handshakes (5.8 seconds) → slow page load → 30% bounce rate. HTTP/2: 1 connection, 1 handshake, parallel
              downloads = 0.5 seconds (11× faster).
            </P>
            <P>
              <Strong>Fix:</Strong> Enable HTTP/2 in web server (works only with HTTPS): Nginx <Code>listen 443 ssl http2</Code>.
              Requires TLS 1.2+. Benefits: Multiplexing (all resources over single connection), header compression (50% smaller),
              server push. No code changes needed. Improves page load 2-5× for multi-resource pages. Use HTTP/2 push for critical
              CSS/JS.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce site serving 1M page views/day. Without optimizations: TLS 1.2 full handshake
            every request = 100ms latency → page load 3 seconds → 25% bounce rate. With optimizations (TLS 1.3 + session resumption
            + HTTP/2): 20ms latency → page load 0.5 seconds → 10% bounce rate. Conversion improvement: 15% → $500k/year additional
            revenue. Implementation: 8 hours nginx config ($1,600). ROI: 312× first year. Plus: Better SEO (Google ranks fast sites higher).
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

