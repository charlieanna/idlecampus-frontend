import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const reliabilityMaintainabilityLesson: SystemDesignLesson = {
  id: 'reliability-maintainability',
  slug: 'reliability-maintainability',
  title: 'Reliability & Maintainability Principles',
  description: 'Learn core principles for building reliable and maintainable systems',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  stages: [
    {
      id: 'software-errors',
      type: 'concept',
      title: 'Handling Software Errors',
      content: (
        <Section>
          <H1>Handling Software Errors</H1>
          
          <P>
            Software bugs are inevitable. The key is to design systems that handle errors gracefully 
            without <Strong>cascading failures</Strong> - where one failing component brings down the entire system.
          </P>

          <H2>Circuit Breaker Pattern</H2>

          <P>
            A <Strong>circuit breaker</Strong> prevents cascading failures by stopping requests to a failing service.
          </P>

          <Example title="How Circuit Breakers Work">
            <UL>
              <LI><Strong>Closed (Normal):</Strong> Requests flow through normally</LI>
              <LI><Strong>Open (Failing):</Strong> After N consecutive failures, circuit opens - requests fail fast</LI>
              <LI><Strong>Half-Open (Testing):</Strong> After timeout, allow one request to test if service recovered</LI>
            </UL>
          </Example>

          <CodeBlock>
{`Example: Recommendation Service Circuit Breaker

Normal flow:
  User request → App Server → Recommendation Service → Return results

Service starts failing:
  User request → App Server → Recommendation Service ❌ (timeout)
  After 5 failures → Circuit opens

Circuit open:
  User request → App Server → Circuit breaker → Return cached/default recommendations
  (No call to failing service)`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Benefit:</Strong> If recommendation service is slow, don't let it slow down the entire page. 
            Return cached recommendations instead.
          </KeyPoint>

          <H2>Request Timeouts</H2>

          <P>
            Always set timeouts on service calls. A hanging request can exhaust connection pools and 
            cause cascading failures.
          </P>

          <UL>
            <LI><Strong>Database queries:</Strong> 1-5 seconds</LI>
            <LI><Strong>API calls:</Strong> 3-10 seconds</LI>
            <LI><Strong>Cache lookups:</Strong> 100-500ms</LI>
          </UL>

          <H2>Resource Limits</H2>

          <P>
            Prevent resource exhaustion by setting limits:
          </P>

          <UL>
            <LI><Strong>Max connections:</Strong> Limit connections per service (e.g., 100)</LI>
            <LI><Strong>Memory limits:</Strong> Set container memory limits</LI>
            <LI><Strong>Rate limiting:</Strong> Prevent one user from overwhelming the system</LI>
          </UL>

          <H2>Graceful Degradation</H2>

          <P>
            When a dependency fails, return partial or cached data instead of failing completely.
          </P>

          <Example title="E-commerce Product Page">
            <UL>
              <LI>Product details: Required (fail if unavailable)</LI>
              <LI>Recommendations: Optional (show cached or skip if service fails)</LI>
              <LI>Reviews: Optional (show "Loading..." if service fails)</LI>
              <LI>Inventory: Required (fail if unavailable)</LI>
            </UL>
          </Example>
        </Section>
      ),
    },
    {
      id: 'human-errors',
      type: 'concept',
      title: 'Designing for Human Errors',
      content: (
        <Section>
          <H1>Designing for Human Errors</H1>

          <P>
            Most outages are caused by human errors, not hardware failures. Design systems that 
            make mistakes hard to make and easy to recover from.
          </P>

          <H2>Deployment Strategies</H2>

          <H3>1. Blue-Green Deployment</H3>

          <P>
            Run two identical production environments (blue = current, green = new). Switch traffic 
            instantly between them.
          </P>

          <Example title="Blue-Green Deployment">
            <CodeBlock>
{`Step 1: Deploy new version to green environment
Step 2: Test green environment
Step 3: Switch load balancer from blue → green
Step 4: Monitor green environment
Step 5: If issues → Switch back to blue (instant rollback!)
Step 6: If OK → Keep green, blue becomes next green`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Benefit:</Strong> Zero-downtime deployments and instant rollback if something goes wrong.
          </KeyPoint>

          <H3>2. Canary Deployment</H3>

          <P>
            Deploy new version to a small percentage of users first (e.g., 5%), then gradually increase.
          </P>

          <Example title="Canary Deployment">
            <CodeBlock>
{`Day 1: Deploy to 5% of users
  → Monitor metrics (error rate, latency)
  → If OK, continue to Day 2

Day 2: Deploy to 25% of users
  → Monitor metrics
  → If OK, continue to Day 3

Day 3: Deploy to 100% of users
  → Full rollout`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Benefit:</Strong> Catch bugs early with minimal impact. If 5% of users see errors, 
            you can rollback before affecting everyone.
          </KeyPoint>

          <H2>Environment Separation</H2>

          <UL>
            <LI><Strong>Development:</Strong> For developers to test locally</LI>
            <LI><Strong>Staging:</Strong> Production-like environment for testing before production</LI>
            <LI><Strong>Production:</Strong> Live environment serving real users</LI>
          </UL>

          <KeyPoint>
            <Strong>Rule:</Strong> Always deploy to staging first, test thoroughly, then deploy to production.
          </KeyPoint>

          <H2>Safeguards Against Mistakes</H2>

          <UL>
            <LI><Strong>Confirmation prompts:</Strong> Require typing "DELETE" or "DROP DATABASE" to confirm destructive actions</LI>
            <LI><Strong>Read-only mode:</Strong> Make production databases read-only by default</LI>
            <LI><Strong>Feature flags:</Strong> Enable new features gradually, disable instantly if issues</LI>
            <LI><Strong>Audit logs:</Strong> Track who did what and when</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'chaos-engineering',
      type: 'concept',
      title: 'Chaos Engineering',
      content: (
        <Section>
          <H1>Chaos Engineering</H1>

          <P>
            <Strong>Chaos engineering</Strong> is the practice of intentionally injecting failures into 
            production systems to verify they handle failures gracefully. Made famous by Netflix's Chaos Monkey.
          </P>

          <H2>Why Chaos Engineering?</H2>

          <P>
            You can't test for every possible failure scenario. Chaos engineering helps you discover 
            weaknesses before they cause real outages.
          </P>

          <KeyPoint>
            <Strong>Principle:</Strong> If you don't test failure scenarios, you'll discover them during 
            real outages when it's too late.
          </KeyPoint>

          <H2>Common Chaos Experiments</H2>

          <H3>1. Chaos Monkey - Random Server Termination</H3>

          <P>
            Randomly terminate a small percentage of servers (e.g., 1%) during business hours.
          </P>

          <Example title="Netflix Chaos Monkey">
            <P>
              Netflix runs Chaos Monkey during business hours. It randomly terminates EC2 instances 
              to ensure their system can handle server failures gracefully.
            </P>
          </Example>

          <H3>2. Latency Monkey - Network Delays</H3>

          <P>
            Inject random network latency (100-500ms) to simulate slow networks or network congestion.
          </P>

          <H3>3. Packet Loss Monkey</H3>

          <P>
            Drop a small percentage of network packets (e.g., 1%) to test how the system handles 
            network issues.
          </P>

          <H3>4. Disk Fill Monkey</H3>

          <P>
            Fill disks to 95% capacity to test how the system handles disk space issues.
          </P>

          <H2>Chaos Engineering Best Practices</H2>

          <UL>
            <LI><Strong>Start small:</Strong> Begin with 1% of servers, gradually increase</LI>
            <LI><Strong>Monitor closely:</Strong> Watch error rates, latency, availability during experiments</LI>
            <LI><Strong>Have a kill switch:</Strong> Ability to stop experiments instantly if things go wrong</LI>
            <LI><Strong>Document findings:</Strong> Record what broke and how you fixed it</LI>
            <LI><Strong>Automate:</Strong> Run experiments regularly, not just once</LI>
          </UL>

          <KeyPoint>
            <Strong>Goal:</Strong> Not to break things, but to discover weaknesses and fix them before 
            real failures occur.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'simplicity',
      type: 'concept',
      title: 'Simplicity - Avoiding Complexity',
      content: (
        <Section>
          <H1>Simplicity - Avoiding Complexity</H1>

          <P>
            <Strong>Complexity is the enemy of maintainability.</Strong> Simple systems are easier to 
            understand, debug, and modify.
          </P>

          <H2>Accidental vs Essential Complexity</H2>

          <UL>
            <LI><Strong>Essential complexity:</Strong> Inherent to the problem (e.g., distributed consensus)</LI>
            <LI><Strong>Accidental complexity:</Strong> Added by poor design choices (e.g., custom distributed consensus when ZooKeeper exists)</LI>
          </UL>

          <KeyPoint>
            <Strong>Rule:</Strong> Don't add accidental complexity. Use proven solutions instead of building custom ones.
          </KeyPoint>

          <H2>Use Proven Solutions</H2>

          <Example title="Don't Reinvent the Wheel">
            <UL>
              <LI>❌ <Strong>Don't:</Strong> Build custom distributed consensus algorithm</LI>
              <LI>✅ <Strong>Do:</Strong> Use ZooKeeper, etcd, or Consul</LI>
              <LI>❌ <Strong>Don't:</Strong> Build custom message queue</LI>
              <LI>✅ <Strong>Do:</Strong> Use RabbitMQ, Kafka, or AWS SQS</LI>
              <LI>❌ <Strong>Don't:</Strong> Build custom database</LI>
              <LI>✅ <Strong>Do:</Strong> Use PostgreSQL, Redis, MongoDB</LI>
            </UL>
          </Example>

          <H2>Clear Abstractions</H2>

          <P>
            Use clear abstraction layers to hide complexity:
          </P>

          <CodeBlock>
{`API Layer (REST endpoints)
  ↓
Service Layer (business logic)
  ↓
Repository Layer (data access)
  ↓
Database Layer (PostgreSQL, Redis)`}
          </CodeBlock>

          <H2>Standard Patterns</H2>

          <UL>
            <LI><Strong>MVC (Model-View-Controller):</Strong> Separate concerns</LI>
            <LI><Strong>Repository Pattern:</Strong> Abstract data access</LI>
            <LI><Strong>Factory Pattern:</Strong> Create objects without exposing creation logic</LI>
            <LI><Strong>Dependency Injection:</Strong> Make code testable and flexible</LI>
          </UL>

          <H2>Keep Interfaces Simple</H2>

          <P>
            Simple interfaces are easier to understand and use:
          </P>

          <Example title="Simple vs Complex API">
            <P>
              <Strong>Simple:</Strong> <Code>GET /users/:id</Code> - Returns user data
            </P>
            <P>
              <Strong>Complex:</Strong> <Code>POST /api/v2/data/users/retrieve?format=json&include=profile,settings&exclude=password&version=2.1</Code>
            </P>
          </Example>
        </Section>
      ),
    },
    {
      id: 'evolvability',
      type: 'concept',
      title: 'Evolvability - Design for Change',
      content: (
        <Section>
          <H1>Evolvability - Design for Change</H1>

          <P>
            Systems must evolve over time. Design for change by using loose coupling, versioned APIs, 
            and backward compatibility.
          </P>

          <H2>API Versioning</H2>

          <P>
            Version your APIs to allow changes without breaking existing clients.
          </P>

          <Example title="API Versioning">
            <CodeBlock>
{`/api/v1/users  → Old version (still supported)
/api/v2/users  → New version (adds new fields)

Clients can migrate gradually:
  - Old clients continue using v1
  - New clients use v2
  - Eventually deprecate v1`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Maintain n-1 versions (current + previous) to give clients 
            time to migrate.
          </KeyPoint>

          <H2>Feature Flags</H2>

          <P>
            Use feature flags to enable/disable features without deploying new code.
          </P>

          <Example title="Feature Flags">
            <CodeBlock>
{`if (featureFlag.isEnabled('new-checkout-flow', userId)) {
  // Use new checkout flow
} else {
  // Use old checkout flow
}

Benefits:
  - Enable for 5% of users first
  - Monitor metrics
  - Disable instantly if issues
  - No code deployment needed`}
            </CodeBlock>
          </Example>

          <H2>Schema Evolution</H2>

          <P>
            Design database schemas that can evolve without breaking existing code.
          </P>

          <UL>
            <LI><Strong>Add nullable columns:</Strong> New fields can be null for old records</LI>
            <LI><Strong>Never remove columns:</Strong> Mark as deprecated, stop using, remove later</LI>
            <LI><Strong>Use migrations:</Strong> Version control schema changes</LI>
            <LI><Strong>Backward compatible:</Strong> Old code should work with new schema</LI>
          </UL>

          <H2>Loose Coupling</H2>

          <P>
            Services should depend on interfaces, not implementations. This allows you to change 
            implementations without affecting dependents.
          </P>

          <Example title="Loose Coupling">
            <CodeBlock>
{`Tight Coupling (Bad):
  Service A directly calls Service B's internal methods
  → Changing Service B breaks Service A

Loose Coupling (Good):
  Service A calls Service B's public API
  → Service B can change internals without affecting Service A`}
            </CodeBlock>
          </Example>
        </Section>
      ),
    },
    {
      id: 'technical-debt',
      type: 'concept',
      title: 'Managing Technical Debt',
      content: (
        <Section>
          <H1>Managing Technical Debt</H1>

          <P>
            <Strong>Technical debt</Strong> is the cost of shortcuts and quick fixes. Like financial debt, 
            it accumulates interest over time. Manage it systematically.
          </P>

          <H2>What is Technical Debt?</H2>

          <UL>
            <LI><Strong>Code smells:</Strong> Duplicated code, long methods, complex logic</LI>
            <LI><Strong>Outdated dependencies:</Strong> Old libraries with security vulnerabilities</LI>
            <LI><Strong>Poor architecture:</Strong> Tight coupling, unclear abstractions</LI>
            <LI><Strong>Missing tests:</Strong> Low test coverage, untested critical paths</LI>
            <LI><Strong>Documentation:</Strong> Missing or outdated documentation</LI>
          </UL>

          <H2>Tracking Technical Debt</H2>

          <P>
            Use tools to measure and track technical debt:
          </P>

          <UL>
            <LI><Strong>Code coverage:</Strong> Target &gt;80% test coverage</LI>
            <LI><Strong>Code duplication:</Strong> Keep &lt;5% duplicate code</LI>
            <LI><Strong>Cyclomatic complexity:</Strong> Keep &lt;10 per function</LI>
            <LI><Strong>Dependency freshness:</Strong> Regular security audits</LI>
          </UL>

          <H2>The 20% Rule</H2>

          <P>
            Allocate 20% of each sprint to technical debt reduction. This prevents debt from accumulating.
          </P>

          <Example title="Sprint Planning">
            <CodeBlock>
{`2-week sprint (10 days):
  - 8 days: New features
  - 2 days: Technical debt reduction

Examples:
  - Refactor complex function
  - Update dependencies
  - Add missing tests
  - Improve documentation`}
            </CodeBlock>
          </Example>

          <H2>Incremental Refactoring</H2>

          <P>
            Don't try to fix everything at once. Refactor incrementally in small PRs:
          </P>

          <UL>
            <LI>One function at a time</LI>
            <LI>One module at a time</LI>
            <LI>One service at a time</LI>
          </UL>

          <KeyPoint>
            <Strong>Principle:</Strong> Small, frequent refactoring is better than big rewrites.
          </KeyPoint>

          <H2>When to Pay Down Debt</H2>

          <UL>
            <LI><Strong>Before adding features:</Strong> Clean up code in the area you're modifying</LI>
            <LI><Strong>When it blocks progress:</Strong> If debt is slowing down development</LI>
            <LI><Strong>Security vulnerabilities:</Strong> Update dependencies immediately</LI>
            <LI><Strong>Regular maintenance:</Strong> Use the 20% rule</LI>
          </UL>
        </Section>
      ),
    },
  ],
};

