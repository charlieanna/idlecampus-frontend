import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const platformMigrationStrategiesLesson: SystemDesignLesson = {
  id: 'platform-migration-strategies',
  slug: 'platform-migration-strategies',
  title: 'Platform Migration Strategies',
  description: 'Master WHEN to use Strangler Fig vs Big Bang vs Parallel Running, WHICH database migration strategy (CDC vs dual write vs snapshot), and WHEN to migrate vs rewrite from scratch with real cost analysis (Netscape failure vs Discord success)',
  category: 'patterns',
  difficulty: 'advanced',
  estimatedMinutes: 55,

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 13,

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
      id: 'migration-tradeoffs',
      type: 'concept',
      title: 'Migration Strategy Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Strangler Fig vs Big Bang vs Parallel Running</H1>

          <ComparisonTable
            headers={['Strategy', 'Timeline', 'Risk', 'Cost', 'Team Bandwidth', 'Rollback', 'Best For', 'Worst For']}
            rows={[
              [
                'Strangler Fig\n(gradual replacement)',
                '12-36 months\n(very slow)',
                'Low\n(isolated failures)',
                'High\n(run both 12+ mo)',
                'Medium\n(incremental)',
                'Easy\n(per service)',
                '• Large monoliths\n• Business continuity critical\n• Limited team',
                '• Time-sensitive\n• Simple systems\n• Startup pivots'
              ],
              [
                'Big Bang\n(cutover weekend)',
                '3-6 months\n(fast prep, instant switch)',
                'Very High\n(all or nothing)',
                'Low\n(no dual running)',
                'Very High\n(crunch time)',
                'Hard\n(full rollback)',
                '• Small systems\n• Scheduled downtime OK\n• Complete rewrite',
                '• 24/7 operations\n• Large user base\n• Complex systems'
              ],
              [
                'Parallel Running\n(shadow mode)',
                '6-12 months\n(medium)',
                'Low\n(validation before switch)',
                'Very High\n(2x infra)',
                'High\n(maintain both)',
                'Easy\n(instant switch back)',
                '• Payment systems\n• Need exact validation\n• Can afford 2x cost',
                '• Cost-sensitive\n• Simple migrations\n• Clear correctness'
              ],
              [
                'Feature Flag Migration\n(per-user rollout)',
                '6-18 months\n(medium-slow)',
                'Very Low\n(5-25% exposure)',
                'Medium\n(small % dual)',
                'Medium\n(incremental)',
                'Very Easy\n(toggle off)',
                '• SaaS platforms\n• B2C apps\n• Risk aversion priority',
                '• B2B (all clients same)\n• Hardware constraints\n• Embedded systems'
              ]
            ]}
          />

          <Example title="Real Decision: E-commerce Monolith → Microservices (500k daily users)">
            <P><Strong>Context:</Strong> PHP monolith (8 years old, 2M LOC) → Node.js microservices</P>
            <P><Strong>Business Constraints:</Strong> Cannot have downtime (Black Friday = $2M/day revenue)</P>

            <P><Strong>Option 1: Big Bang Migration (wrong for this scale)</Strong></P>
            <CodeBlock>
{`Timeline:
- 4 months: Build all microservices
- 1 month: Testing in staging
- Weekend: Switch production traffic

Cost:
- Development: 10 engineers × 5 months = $500k
- Infrastructure (staging): $5k/mo × 5 = $25k
- Production (new): $15k/mo (old terminated)
- Total: $525k one-time cost

Risk analysis:
- All 500k users switch at once
- If critical bug found Monday morning:
  → Rollback requires re-deploying monolith
  → Data written to new system incompatible with old
  → 2-4 hours downtime
  → Lost revenue: $2M/day × 4hrs/24hrs = $333k

Real incident (similar company):
- Big bang migration on Sunday night
- Memory leak discovered Monday 9 AM
- New system crashes under load
- Rollback impossible (data schema incompatible)
- 6 hours downtime fixing leak
- Lost: $500k revenue + $2M customer trust damage

Result: ❌ $525k saved in dual-running costs, risked $2.5M in one incident`}
            </CodeBlock>

            <P><Strong>Option 2: Strangler Fig Migration (correct for this case)</Strong></P>
            <CodeBlock>
{`Timeline:
Month 1-3: Extract User Service
  - New: User microservice (authentication, profile)
  - Route: 5% → new, 95% → monolith (feature flag)
  - Monitor: Error rate, latency, data consistency
  - Cost: +$1k/mo infrastructure

Month 4-6: Extract Product Catalog Service
  - New: Product microservice (search, details)
  - Route: 10% → new, 90% → monolith
  - Cost: +$2k/mo infrastructure

Month 7-9: Extract Order Service
  - New: Order microservice (checkout, payments)
  - Route: 25% → new, 75% → monolith
  - Cost: +$4k/mo infrastructure

Month 10-12: Extract Inventory Service
  - New: Inventory microservice
  - Route: 50% → new, 50% → monolith
  - Cost: +$7k/mo infrastructure

Month 13-18: Migrate remaining services
  - New: Shipping, Returns, Analytics services
  - Route: 100% → new, 0% → monolith
  - Decommission monolith

Cost breakdown:
- Development: 10 engineers × 18 months = $1.8M
- Dual infrastructure: ($1k + $2k + $4k + $7k + $10k) × avg 3mo each = $72k
- Total: $1.872M

Risk mitigation:
- Each service migrated independently
- If User Service has bug: Only 5% users affected, instant rollback
- If Order Service has bug: Only 25% affected, rollback in 2 min
- Actual incidents: 3 bugs caught at <10% rollout, $0 revenue loss

Trade-off: $1.872M over 18 months vs $525k over 5 months, BUT:
- Big bang risk: $2.5M potential loss in one incident
- Strangler fig risk: $0 (all bugs caught at <25% rollout)

Result: ✅ Spend extra $1.3M to eliminate $2.5M risk (1.9x ROI on risk mitigation)`}
            </CodeBlock>

            <P><Strong>Option 3: Parallel Running (too expensive for this case)</Strong></P>
            <CodeBlock>
{`Implementation:
- Build complete microservices platform
- Run both monolith + microservices at 100% capacity
- Route: 100% → monolith (production)
- Shadow: 100% → microservices (validation only)
- Compare: Every response, every transaction
- Switch: When 99.99% responses match

Cost:
- Development: 10 engineers × 8 months = $800k
- Dual infrastructure: $30k/mo (both at full capacity) × 8 mo = $240k
- Comparison infrastructure: $5k/mo × 8 mo = $40k
- Total: $1.08M

Benefits:
- 100% validation before switch
- Instant rollback (switch load balancer back)
- Discover edge cases with real production traffic

Problem:
- For e-commerce, correctness is relatively clear
- Don't need 100% validation (99% confidence sufficient)
- Paying $240k for 1% extra confidence vs strangler fig

Trade-off: $1.08M with 99.99% confidence vs $525k big bang (high risk) vs $1.872M strangler (99% confidence)

Result: ❌ Middle ground is worst of both worlds
- More expensive than big bang but still some risk
- Faster than strangler but less incremental learning
- Paying $240k for validation that strangler fig gives for free via gradual rollout`}
            </CodeBlock>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Database Migration Strategies</H1>

          <ComparisonTable
            headers={['Strategy', 'Downtime', 'Complexity', 'Cost/mo', 'Data Consistency', 'Risk', 'Best For']}
            rows={[
              [
                'Snapshot + Restore\n(dump and load)',
                'High\n(hours-days)',
                'Low',
                '$0\n(one-time)',
                'Eventual\n(lag during copy)',
                'Medium',
                '• Small DBs (<100GB)\n• Scheduled maintenance OK\n• One-time migration'
              ],
              [
                'Dual Write\n(app writes to both)',
                'Zero',
                'High\n(app changes)',
                '$500-2k\n(2x storage)',
                'Risk of divergence',
                'High\n(write conflicts)',
                '• Full control over writes\n• Simple data models\n• Can modify app code'
              ],
              [
                'Change Data Capture\n(CDC - Debezium)',
                'Zero',
                'Medium',
                '$500-1k\n(CDC infra)',
                'Near real-time\n(<1s lag)',
                'Low',
                '• Large DBs (>100GB)\n• Can\'t modify app\n• Need real-time sync'
              ],
              [
                'Read Replica + Cutover\n(DB replication)',
                'Low\n(seconds)',
                'Low',
                '$1-3k\n(replica)',
                'Consistent\n(DB-level replication)',
                'Low',
                '• Same DB type\n• Need consistency\n• Minimal app changes'
              ]
            ]}
          />

          <Example title="Real Decision: PostgreSQL → Cassandra (100M user records, 500GB)">
            <P><Strong>Business Context:</Strong> Social media app, need horizontal scaling for 10x growth</P>

            <P><Strong>Option 1: Snapshot + Restore (wrong for this size)</Strong></P>
            <CodeBlock>
{`Process:
1. Friday 11 PM: Put app in maintenance mode
2. pg_dump: 500GB → 6 hours
3. Load into Cassandra: Transform relational → columnar → 8 hours
4. Validation: Check record counts → 2 hours
5. Saturday 5 PM: Resume app (18 hours downtime)

Cost:
- No dual infrastructure: $0 extra
- Lost revenue: 18 hours × $10k/day ÷ 24 = $7.5k
- User churn: 5% of daily actives leave (poor UX) = 50k users
- Lifetime value lost: 50k × $20 = $1M

Result: ❌ Saved infrastructure cost, lost $1M+ in churn and revenue`}
            </CodeBlock>

            <P><Strong>Option 2: Dual Write (wrong for consistency risk)</Strong></P>
            <CodeBlock>
{`Implementation:
// In application code
async function createUser(userData) {
  // Write to both databases
  await postgres.insert(userData);
  await cassandra.insert(transformToCassandra(userData));
}

Problems:
1. What if Cassandra write fails but Postgres succeeds?
   → Data divergence: User in Postgres, not in Cassandra

2. What if writes succeed but in different order?
   → Cassandra sees update before create
   → Inconsistent state

3. What if network partition?
   → Some writes to Postgres only
   → Some writes to Cassandra only
   → Impossible to reconcile

Real incident:
- 0.1% of writes failed to Cassandra (network blips)
- 100M records × 0.1% = 100k missing records
- Discovered after 2 weeks
- Manual reconciliation: 200 engineering hours = $40k

Cost:
- Development: $100k (modify all write paths)
- Infrastructure: $2k/mo × 6 months = $12k
- Incident reconciliation: $40k
- Total: $152k

Trade-off: Low infrastructure cost vs high inconsistency risk

Result: ❌ Saved CDC cost ($500/mo), paid $40k fixing inconsistencies`}
            </CodeBlock>

            <P><Strong>Option 3: Change Data Capture (correct choice)</Strong></P>
            <CodeBlock>
{`Implementation:
1. Deploy Debezium to capture Postgres write-ahead log (WAL)
2. Stream changes to Kafka
3. Consumer transforms and writes to Cassandra
4. Run for 2 weeks, validate data consistency
5. Switch app to read from Cassandra
6. Monitor for 1 week, then decommission Postgres

Timeline:
- Week 1-2: Setup CDC pipeline, backfill historical data
- Week 3-4: Validate consistency (compare random samples)
- Week 5: Route 10% reads to Cassandra
- Week 6: Route 50% reads to Cassandra
- Week 7: Route 100% reads to Cassandra
- Week 8: Stop CDC, decommission Postgres

Cost:
- Debezium infrastructure: $500/mo (Kafka + connectors)
- Cassandra cluster: $2k/mo
- Postgres (keep during migration): $1k/mo
- Total: $3.5k/mo × 2 months = $7k
- Development: $50k (setup CDC, validation scripts)
- Grand total: $57k

Benefits:
- Zero downtime
- No application code changes
- Real-time sync (<1s lag)
- Can rollback at any point (just switch reads back to Postgres)

Validation:
- Automated daily: Compare 1M random records between DBs
- Found 0 inconsistencies
- Confidence: 99.99%

Trade-off: $57k for zero-downtime migration vs $0 with 18hr downtime vs $152k dual write inconsistencies

Result: ✅ $57k for professional migration with zero user impact
ROI: Prevented $1M churn from downtime + $40k inconsistency fixes`}
            </CodeBlock>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Migrate vs Rewrite from Scratch</H1>

          <ComparisonTable
            headers={['Approach', 'Timeline', 'Risk', 'Cost', 'Business Continuity', 'Technical Debt', 'Best For']}
            rows={[
              [
                'Migrate\n(refactor existing)',
                '12-24 months',
                'Low\n(incremental)',
                '$1-3M\n(gradual)',
                'Maintained',
                'Partially reduced',
                '• Working product\n• Profitable business\n• Complex domain logic\n• Large user base'
              ],
              [
                'Rewrite from Scratch',
                '18-36 months',
                'Very High\n(big bang at end)',
                '$3-10M\n(full rebuild)',
                'At risk',
                'Eliminated\n(new debt forms)',
                '• Broken product\n• Simple domain\n• Technology shift\n• Small user base'
              ],
              [
                'Hybrid\n(new features in new stack)',
                '24-48 months',
                'Medium',
                '$2-5M',
                'Maintained',
                'Partially reduced',
                '• Growing product\n• Clear service boundaries\n• Can afford slow migration\n• Recruiting advantage'
              ]
            ]}
          />

          <Example title="Real Decision: Netscape Navigator Rewrite (Cautionary Tale)">
            <P><Strong>Context:</Strong> Netscape Navigator 4.0 (1997) - market leader with 80% browser share</P>

            <P><Strong>Decision: Rewrite from Scratch</Strong></P>
            <CodeBlock>
{`Decision (1998):
- Navigator 4.0 codebase is "too messy"
- CEO decides: Rewrite from scratch (Navigator 5.0)
- Goal: Modern architecture, better performance
- Timeline estimate: 12 months

Reality:
- Year 1 (1998): Built rendering engine
- Year 2 (1999): Built layout engine, DOM
- Year 3 (2000): Built JavaScript engine, debugger
- 2002 (4 years later): Finally shipped as Mozilla 1.0

Meanwhile:
- Competitors: IE 5.0 (1999), IE 5.5 (2000), IE 6.0 (2001)
- Market share: 80% (1998) → 15% (2002)
- Revenue: $200M/year (1998) → $20M/year (2002)
- Company: Nearly bankrupt

What went wrong:
1. Threw away 10 years of bug fixes
   - Old code had fixes for 1000s of edge cases
   - New code: re-discovered same bugs over 4 years

2. No revenue during rewrite
   - Couldn't ship new features (in rewrite mode)
   - Competitors shipped new features monthly

3. Big bang risk
   - 4 years → one massive release
   - If it failed, no fallback

Alternative (migration):
- Keep Navigator 4.0 working
- Gradually replace components:
  Year 1: New JavaScript engine (ship it)
  Year 2: New rendering engine (ship it)
  Year 3: New layout engine (ship it)
- Users get improvements yearly, not after 4 years
- Competitors can't gain 4-year head start

Cost comparison:
- Rewrite: 100 engineers × 4 years = $80M
- Lost market share value: $2B (company value drop)
- Migration (estimated): 80 engineers × 4 years = $64M
- Market share: Maintained (shipping features continuously)

Result: ❌ Rewrite cost $80M + $2B company value vs migration $64M + maintained value

Lesson: "The single worst strategic mistake that any software company can make" - Joel Spolsky`}
            </CodeBlock>

            <P><Strong>Counter-Example: When Rewrite Works - Discord (2015)</Strong></P>
            <CodeBlock>
{`Context:
- Small startup (<10k users)
- Initial product: Gaming voice chat built on Skype SDK
- Problem: Skype SDK unreliable, high latency

Decision: Rewrite from scratch
- Why: Small user base (OK to pivot)
- Why: Simple domain (voice chat, text)
- Why: Existing product fundamentally broken (not just messy)
- Why: No complex business logic to preserve

Timeline:
- 6 months: New WebRTC-based voice engine
- Risk: Only 10k users, not 10M
- Result: Latency 300ms → 50ms, quality 10x better

Outcome:
- Growth: 10k users → 150M users (2021)
- Valuation: $0 → $15B
- Right decision because:
  1. Small user base (low rewrite risk)
  2. Core product broken (migration wouldn't help)
  3. Simple domain (no complex logic to preserve)

Result: ✅ Rewrite enabled product-market fit that migration couldn't achieve`}
            </CodeBlock>
          </Example>

          <H3>Decision Framework: Migrate vs Rewrite</H3>
          <CodeBlock>
{`Is your current product working and profitable?

├─ YES → Almost always MIGRATE, not rewrite
│   └─ How many users?
│       ├─ >100k users → Strangler Fig Migration (12-24 months)
│       │   └─ Rationale: Can't risk big bang with large user base
│       │
│       ├─ 10k-100k users → Feature Flag Migration (6-18 months)
│       │   └─ Rationale: Gradual rollout reduces risk
│       │
│       └─ <10k users → Consider Hybrid (new features in new stack)
│           └─ Rationale: Small enough to take moderate risk
│
└─ NO → Current product fundamentally broken?
    ├─ YES → Rewrite may be justified
    │   └─ But ONLY if:
    │       1. User base is small (<50k users)
    │       2. Domain logic is simple (not 10 years of edge cases)
    │       3. Current tech is EOL or impossible to maintain
    │       4. You have runway (18-36 months cash)
    │
    └─ NO → Still working somewhat?
        └─ MIGRATE (strangler fig)
            └─ Rewrite is almost never the right answer for working software`}
          </CodeBlock>

          <H2>Common Mistakes</H2>

          <P>❌ <Strong>Mistake 1: Big Bang Migration for Large System</Strong></P>
          <CodeBlock>
{`Problem:
- 200k daily users, 5M LOC monolith
- "Let's rewrite in 6 months and switch over a weekend"
- Weekend comes: Critical bug discovered, 12 hours downtime
- Lost: $500k revenue + customer trust

Fix: Strangler fig with 6-12 month gradual migration`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 2: Dual Write Without Conflict Resolution</Strong></P>
          <CodeBlock>
{`Problem:
- Write to both old and new DB
- Network partition → writes succeed on old DB only
- After partition: 100k records missing in new DB
- Manual reconciliation: 1 week engineering time

Fix: Use CDC (Debezium) for guaranteed consistency`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 3: Rewriting Working Software</Strong></P>
          <CodeBlock>
{`Problem:
- "Code is messy, let's rewrite from scratch"
- 2 years later: Still in rewrite, no features shipped
- Competitors gained market share
- Company runs out of runway

Fix: Migrate incrementally while shipping features (strangler fig)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 4: No Rollback Plan</Strong></P>
          <CodeBlock>
{`Problem:
- Migrated to new system
- Week later: Discovered data corruption bug
- Can't rollback: Old system decommissioned
- Lost: 1M user records

Fix: Keep old system running for 2-4 weeks after migration, feature flag for instant rollback`}
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

