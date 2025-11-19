import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const platformMigrationStrategiesLesson: SystemDesignLesson = {
  id: 'platform-migration-strategies',
  slug: 'platform-migration-strategies',
  title: 'Platform Migration Strategies',
  description: 'Learn how to approach system migration problems (L5) vs building from scratch (L1-L4)',
  category: 'patterns',
  difficulty: 'advanced',
  estimatedMinutes: 30,
  stages: [
    {
      id: 'migration-vs-building',
      type: 'concept',
      title: 'Migration vs Building from Scratch',
      content: (
        <Section>
          <H1>Migration Problems vs Building Problems</H1>
          
          <P>
            <Strong>L1-L4 Problems:</Strong> You're building a system from scratch. 
            You need to design the complete architecture.
          </P>

          <P>
            <Strong>L5 Migration Problems:</Strong> The system already exists. 
            You need to design the <Strong>migration strategy</Strong> to transform it.
          </P>

          <Divider />

          <H2>Example: Building vs Migrating</H2>

          <H3>L1-L4: Build E-commerce Platform</H3>
          <UL>
            <LI>Design: Client → Load Balancer → App Servers → Cache → Database</LI>
            <LI>Add: CDN, message queues, search index</LI>
            <LI>Focus: <Strong>What components do I need?</Strong></LI>
          </UL>

          <H3>L5: Migrate Netflix Monolith to Microservices</H3>
          <UL>
            <LI>System already exists: Monolithic Java app handling 10M streams</LI>
            <LI>Challenge: <Strong>How do I migrate without downtime?</Strong></LI>
            <LI>Focus: Migration strategy, not building the system</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Insight:</Strong> In migration problems, the system architecture 
            is already defined. You're designing the <Strong>transition path</Strong>.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'migration-strategies',
      type: 'concept',
      title: 'Common Migration Strategies',
      content: (
        <Section>
          <H1>Migration Strategies</H1>

          <H2>1. Strangler Fig Pattern</H2>
          <P>Gradually replace old system with new system piece by piece.</P>

          <Example title="Netflix Migration">
            <CodeBlock>
{`Old System: Monolith (Java)
New System: Microservices (Go, Node.js)

Phase 1: Extract User Service
  - Old: Monolith handles users
  - New: User microservice handles users
  - Traffic: 10% → new, 90% → old

Phase 2: Extract Content Service
  - Old: Monolith handles content
  - New: Content microservice handles content
  - Traffic: 50% → new, 50% → old

Phase 3: Extract Recommendation Service
  - Old: Monolith handles recommendations
  - New: Recommendation microservice
  - Traffic: 100% → new, 0% → old

Result: Monolith gradually "strangled" by microservices`}
            </CodeBlock>
          </Example>

          <P><Strong>Benefits:</Strong></P>
          <UL>
            <LI>Low risk - can rollback at any phase</LI>
            <LI>Gradual learning - team learns microservices incrementally</LI>
            <LI>No big bang - avoid massive one-time migration</LI>
          </UL>

          <Divider />

          <H2>2. Parallel Running</H2>
          <P>Run old and new systems simultaneously, compare results, gradually shift traffic.</P>

          <Example title="Uber Multi-Region Migration">
            <CodeBlock>
{`Current: Single region (US-East)
Target: 5 regions (US-East, US-West, EU, Asia, LatAm)

Phase 1: Deploy to US-West (parallel)
  - Old: All traffic → US-East
  - New: 0% traffic → US-West (testing)
  - Compare: Results match? Latency OK?

Phase 2: Gradual Traffic Shift
  - 10% → US-West, 90% → US-East
  - Monitor: Error rates, latency, data consistency

Phase 3: Full Activation
  - 50% → US-West, 50% → US-East
  - Add: EU, Asia, LatAm regions
  - Result: Active-active across 5 regions`}
            </CodeBlock>
          </Example>

          <P><Strong>Key Components Needed:</Strong></P>
          <UL>
            <LI><Strong>Load Balancer:</Strong> Route traffic between old/new</LI>
            <LI><Strong>Feature Flags:</Strong> Enable/disable new system per user</LI>
            <LI><Strong>Data Sync:</Strong> Keep old and new systems in sync</LI>
            <LI><Strong>Monitoring:</Strong> Compare metrics between systems</LI>
          </UL>

          <Divider />

          <H2>3. Database Migration Strategies</H2>

          <H3>A. Dual Write</H3>
          <P>Write to both old and new databases simultaneously.</P>

          <CodeBlock>
{`Application writes:
  → Old Database (PostgreSQL)
  → New Database (Cassandra)

Reads:
  → Old Database (until migration complete)

After migration:
  → Stop writing to old DB
  → Read from new DB only`}
          </CodeBlock>

          <H3>B. Change Data Capture (CDC)</H3>
          <P>Capture changes from old database, replicate to new database.</P>

          <CodeBlock>
{`Old Database (PostgreSQL)
  ↓ (CDC tool: Debezium)
Change Log Stream
  ↓
New Database (Cassandra)

Benefits:
  - No application code changes
  - Real-time replication
  - Can pause/resume migration`}
          </CodeBlock>

          <H3>C. Blue-Green Deployment</H3>
          <P>Deploy new system alongside old, switch traffic instantly.</P>

          <CodeBlock>
{`Blue (Old): Production system
Green (New): New system (fully tested)

Switch:
  Load Balancer → Blue (old)
  ↓ (one command)
  Load Balancer → Green (new)

Rollback:
  Load Balancer → Blue (old)`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'how-to-solve-migration',
      type: 'concept',
      title: 'How to Solve L5 Migration Problems',
      content: (
        <Section>
          <H1>How to Approach L5 Migration Problems</H1>

          <H2>Step 1: Understand Current System</H2>
          <UL>
            <LI>What does the current system do?</LI>
            <LI>What are the pain points? (Why migrate?)</LI>
            <LI>What are the constraints? (Can't have downtime, must maintain APIs)</LI>
          </UL>

          <H2>Step 2: Design Target System</H2>
          <UL>
            <LI>What does the new system look like?</LI>
            <LI>What components are needed? (This is like L1-L4)</LI>
            <LI>How does it differ from the old system?</LI>
          </UL>

          <H2>Step 3: Design Migration Path</H2>
          <UL>
            <LI><Strong>Strategy:</Strong> Strangler Fig? Parallel Running? Blue-Green?</LI>
            <LI><Strong>Phases:</Strong> Break migration into phases</LI>
            <LI><Strong>Traffic Shifting:</Strong> How to gradually move traffic?</LI>
            <LI><Strong>Data Migration:</Strong> How to move data?</LI>
            <LI><Strong>Rollback Plan:</Strong> What if something goes wrong?</LI>
          </UL>

          <H2>Step 4: Design Components for Migration</H2>
          <UL>
            <LI><Strong>Load Balancer:</Strong> Route traffic between old/new</LI>
            <LI><Strong>Feature Flags:</Strong> Control which users see new system</LI>
            <LI><Strong>Data Sync:</Strong> Keep old and new in sync</LI>
            <LI><Strong>Monitoring:</Strong> Compare old vs new metrics</LI>
            <LI><Strong>API Gateway:</Strong> Maintain backward compatibility</LI>
          </UL>

          <Divider />

          <H2>Example: Uber Multi-Region Migration</H2>

          <H3>Current System</H3>
          <UL>
            <LI>Single region: US-East</LI>
            <LI>All services in one region</LI>
            <LI>Problem: High latency for international users</LI>
          </UL>

          <H3>Target System</H3>
          <UL>
            <LI>5 regions: US-East, US-West, EU, Asia, LatAm</LI>
            <LI>Active-active: All regions handle traffic</LI>
            <LI>Cross-region replication for data</LI>
          </UL>

          <H3>Migration Strategy: Parallel Running</H3>
          <OL>
            <LI><Strong>Phase 1:</Strong> Deploy to US-West (0% traffic, testing)</LI>
            <LI><Strong>Phase 2:</Strong> 10% traffic → US-West, monitor</LI>
            <LI><Strong>Phase 3:</Strong> 50% traffic → US-West, add EU region</LI>
            <LI><Strong>Phase 4:</Strong> Add Asia, LatAm, full active-active</LI>
          </OL>

          <H3>Components Needed</H3>
          <UL>
            <LI><Strong>Global Load Balancer:</Strong> Route users to nearest region</LI>
            <LI><Strong>Cross-Region Replication:</Strong> Sync data between regions</LI>
            <LI><Strong>Conflict Resolution:</Strong> Handle split-brain scenarios</LI>
            <LI><Strong>Data Compliance:</Strong> Keep user data in correct region (GDPR)</LI>
            <LI><Strong>Monitoring:</Strong> Track latency, error rates per region</LI>
          </UL>

          <KeyPoint>
            <Strong>Remember:</Strong> Even though it's a migration problem, you still need 
            to design the <Strong>full target system architecture</Strong> (like L1-L4), 
            PLUS the <Strong>migration infrastructure</Strong> (load balancers, feature flags, data sync).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'common-pitfalls',
      type: 'concept',
      title: 'Common Pitfalls',
      content: (
        <Section>
          <H1>Common Pitfalls in Migration Problems</H1>

          <H2>1. Only Designing Migration, Not Target System</H2>
          <P><Strong>Wrong:</Strong> "I'll use Strangler Fig pattern" (that's it?)</P>
          <P><Strong>Right:</Strong> Design the full target system architecture, THEN design how to migrate to it.</P>

          <H2>2. Ignoring Data Migration</H2>
          <P><Strong>Wrong:</Strong> "Users will just re-register"</P>
          <P><Strong>Right:</Strong> Design data migration strategy (CDC, dual write, ETL pipeline).</P>

          <H2>3. No Rollback Plan</H2>
          <P><Strong>Wrong:</Strong> "If it breaks, we'll fix it"</P>
          <P><Strong>Right:</Strong> Design rollback mechanism (feature flags, traffic routing, data sync).</P>

          <H2>4. Big Bang Migration</H2>
          <P><Strong>Wrong:</Strong> "We'll migrate everything at once"</P>
          <P><Strong>Right:</Strong> Break into phases, migrate incrementally, validate each phase.</P>

          <H2>5. Forgetting Backward Compatibility</H2>
          <P><Strong>Wrong:</Strong> "New system has new APIs, old clients will break"</P>
          <P><Strong>Right:</Strong> Use API Gateway to maintain old APIs, version new APIs.</P>
        </Section>
      ),
    },
  ],
};

