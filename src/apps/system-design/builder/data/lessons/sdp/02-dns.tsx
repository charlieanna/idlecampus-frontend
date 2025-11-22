import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpDnsLesson: SystemDesignLesson = {
  id: 'sdp-dns',
  slug: 'sdp-dns',
  title: 'DNS (Domain Name System)',
  description: 'Master DNS fundamentals and critical trade-offs: WHEN to use managed DNS vs self-hosted, WHICH routing strategy fits your latency/cost needs, HOW to balance TTL for agility vs performance.',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 55,

  // Progressive flow metadata
  moduleId: 'sd-module-5-primer',
  sequenceOrder: 2,
  stages: [
    {
      id: 'intro-dns',
      type: 'concept',
      title: 'What is DNS?',
      content: (
        <Section>
          <H1>What is DNS?</H1>
          <P>
            <Strong>DNS (Domain Name System)</Strong> translates human-readable domain names (e.g., google.com)
            into IP addresses (e.g., 172.217.164.110). It's the phone book of the internet.
          </P>

          <H2>How DNS Works</H2>
          <OL>
            <LI>User types "google.com" in browser</LI>
            <LI>Browser asks DNS resolver (usually ISP or 8.8.8.8)</LI>
            <LI>Resolver queries root DNS server → ".com" TLD server → "google.com" authoritative server</LI>
            <LI>Authoritative server returns IP address</LI>
            <LI>Resolver caches result and returns to browser</LI>
            <LI>Browser connects to IP address</LI>
          </OL>

          <Example title="DNS Resolution Flow">
            <CodeBlock>
{`1. Browser: "What's the IP for google.com?"
2. Resolver: "I don't know, let me ask root server"
3. Root: "Ask .com TLD server at 192.5.6.30"
4. Resolver: "What's the IP for google.com?"
5. .com TLD: "Ask google.com authoritative at 216.239.32.10"
6. Resolver: "What's the IP for google.com?"
7. google.com: "172.217.164.110"
8. Resolver: Caches result, returns to browser
9. Browser: Connects to 172.217.164.110`}
            </CodeBlock>
          </Example>

          <H2>DNS Record Types</H2>
          <UL>
            <LI><Strong>A Record:</Strong> Maps domain to IPv4 address</LI>
            <LI><Strong>AAAA Record:</Strong> Maps domain to IPv6 address</LI>
            <LI><Strong>CNAME:</Strong> Alias to another domain (e.g., www → example.com)</LI>
            <LI><Strong>MX Record:</Strong> Mail server for domain</LI>
            <LI><Strong>NS Record:</Strong> Nameserver for domain</LI>
            <LI><Strong>TXT Record:</Strong> Text data (often for verification)</LI>
          </UL>

          <H2>DNS Caching</H2>
          <P>
            DNS responses are cached at multiple levels to reduce lookup time:
          </P>
          <UL>
            <LI><Strong>Browser Cache:</Strong> Caches DNS for a few minutes</LI>
            <LI><Strong>OS Cache:</Strong> Caches DNS for hours</LI>
            <LI><Strong>Resolver Cache:</Strong> Caches based on TTL (Time To Live)</LI>
          </UL>

          <H2>DNS Load Balancing</H2>
          <P>
            Multiple A records for same domain return different IPs, distributing load:
          </P>
          <CodeBlock>
{`example.com A 192.168.1.1
example.com A 192.168.1.2
example.com A 192.168.1.3

# DNS server returns different IPs in round-robin fashion`}
          </CodeBlock>

          <H2>Geo-Routing (GeoDNS)</H2>
          <P>
            Return different IPs based on user's geographic location:
          </P>
          <UL>
            <LI>US users → US datacenter IP</LI>
            <LI>EU users → EU datacenter IP</LI>
            <LI>Asia users → Asia datacenter IP</LI>
          </UL>
          <P>
            Reduces latency by routing users to nearest datacenter.
          </P>

          <KeyPoint>
            <Strong>Use GeoDNS:</Strong> When you have multiple datacenters and want to route users to the nearest one.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'dns-provider-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: DNS Provider Selection',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: DNS Provider Selection</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing a DNS provider impacts your availability, latency, cost, and operational complexity.
            The wrong choice can cost you $10k+/year in over-provisioning or cause global outages.
          </P>

          <H2>DNS Provider Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Route 53', 'Cloudflare', 'Google Cloud DNS', 'Self-Hosted (BIND)']}
            rows={[
              ['Monthly Cost', '$0.50/zone + $0.40/M queries', 'Free tier: $0\nPro: $20/mo', '$0.20/zone + $0.40/M queries', '$500-2k/mo (servers + ops)'],
              ['Query Performance', '100% SLA, ~30ms avg', '100% SLA, ~15ms avg (Anycast)', '100% SLA, ~25ms avg', 'Variable, 50-200ms'],
              ['Global PoPs', '200+ locations', '300+ locations', '100+ locations', 'You manage (typically 2-4)'],
              ['Setup Time', '15 minutes', '10 minutes', '15 minutes', '2-4 weeks'],
              ['Operational Burden', 'Zero (fully managed)', 'Zero (fully managed)', 'Zero (fully managed)', 'High (patching, monitoring, scaling)'],
              ['Advanced Routing', 'Geolocation, latency, weighted, failover, geoproximity', 'Geolocation, load balancing', 'Geolocation, weighted round robin', 'Basic round-robin only'],
              ['DDoS Protection', 'AWS Shield Standard (free)', 'Industry-leading (included)', 'Google Cloud Armor (extra cost)', 'You manage (costly)'],
              ['Best For', 'AWS-heavy stacks, complex routing needs', 'Global apps, performance-critical, tight budgets', 'GCP-heavy stacks, simple needs', 'Never recommended'],
            ]}
          />

          <H2>Real Decision: E-commerce Platform</H2>
          <Example title="Route 53 vs Cloudflare - Real Cost Analysis">
            <CodeBlock>
{`Scenario: E-commerce site, 50M DNS queries/month, 5 zones

Route 53 Costs:
- Hosted zones: 5 × $0.50 = $2.50/mo
- Queries: 50M × $0.40/M = $20/mo
- Total: $22.50/mo = $270/year

Cloudflare Costs:
- Free tier covers unlimited queries
- 5 zones on Free plan = $0/mo
- Total: $0/year

Cloudflare Pro (if you need analytics/WAF):
- $20/mo per zone × 5 = $100/mo = $1,200/year

Self-Hosted BIND Costs:
- 2 servers (redundancy): 2 × $200/mo = $400/mo
- DevOps time: 10 hrs/mo × $100/hr = $1,000/mo
- Total: $1,400/mo = $16,800/year

Decision: Cloudflare Free saves $270/year vs Route 53
         Self-hosted costs 62× more than Route 53!

When to choose Route 53:
- Already on AWS (tight integration)
- Need complex routing (geoproximity, traffic flow)
- Health checks + failover critical

When to choose Cloudflare:
- Budget-conscious startups
- Performance-critical (15ms queries)
- Built-in DDoS protection valued`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (startup || budget < $500/mo):
    return "Cloudflare Free"
    # $0/mo, excellent performance, DDoS included

elif (aws_infrastructure && complex_routing_needs):
    return "Route 53"
    # $20-100/mo, geoproximity, traffic policies, seamless AWS integration

elif (gcp_infrastructure):
    return "Google Cloud DNS"
    # $15-80/mo, GCP integration, standard features

elif (queries > 100M/month && latency_critical):
    return "Cloudflare Pro"
    # $20-200/mo, fastest response times (15ms avg)

else:
    return "NEVER self-host DNS"
    # $10k+/year, high complexity, no benefits over managed services`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Self-hosting DNS to "save money"</Strong>
            <P>
              Reality: Self-hosted BIND costs $16k/year (servers + ops) vs $0-300/year for managed DNS.
              You also lose DDoS protection, global Anycast, and 100% SLA guarantees.
            </P>
            <P>
              <Strong>Fix:</Strong> Use Cloudflare Free (startups) or Route 53 (AWS shops). Self-hosting DNS is never justified in 2025.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using Route 53 because "we're on AWS"</Strong>
            <P>
              Many teams default to Route 53 and pay $270-1,000/year when Cloudflare Free ($0/year) would work perfectly.
              Route 53 only makes sense if you need geoproximity routing, traffic flow policies, or tight ELB integration.
            </P>
            <P>
              <Strong>Fix:</Strong> Audit your routing needs. If using simple A records or basic geolocation, switch to Cloudflare and save $270+/year.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not enabling DDoS protection</Strong>
            <P>
              DNS DDoS attacks can cost $50k+ in downtime. Cloudflare includes DDoS protection free, Route 53 includes AWS Shield Standard free.
              But teams often forget to configure rate limiting and health checks.
            </P>
            <P>
              <Strong>Fix:</Strong> Enable provider's DDoS protection (free on Cloudflare/Route 53). Add health checks ($0.50/check) for critical endpoints.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Switching from Route 53 to Cloudflare Free saves $270/year for simple use cases.
            Avoiding self-hosted DNS saves $16k/year + prevents outage risks.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'dns-routing-tradeoffs',
      type: 'concept',
      title: '🎯 DNS Routing Strategy Trade-Offs',
      content: (
        <Section>
          <H1>🎯 DNS Routing Strategy Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Routing strategies determine how DNS responds to queries: simple round-robin,
            weighted distribution, latency-based routing, or geolocation. The choice impacts user latency, costs, and complexity.
          </P>

          <H2>Routing Strategy Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Simple', 'Weighted', 'Latency-Based', 'Geolocation', 'Failover']}
            rows={[
              ['Monthly Cost', '$0.40/M queries', '$0.60/M queries', '$0.70/M queries', '$0.70/M queries', '$0.50/M + $0.50/health check'],
              ['Latency Impact', 'Random (50-200ms variation)', 'Random (50-200ms variation)', 'Optimal (lowest latency)', '~20ms better than simple', 'Same as primary until failover'],
              ['Setup Complexity', 'Trivial (1 A record)', 'Low (weight per record)', 'Medium (measure latency)', 'Medium (define regions)', 'Medium (health checks required)'],
              ['Use Case Fit', 'Single datacenter, uniform traffic', 'Canary deploys, gradual migrations', 'Multi-region apps, global users', 'Compliance (data residency)', 'HA critical (99.99%+ uptime)'],
              ['Traffic Control', 'None (equal distribution)', 'Precise (1-255 weights)', 'Auto (AWS measures latency)', 'Geographic (country/continent)', 'Binary (primary/secondary)'],
              ['Best For', 'Startups, single region', 'A/B testing, blue-green deploys', 'Gaming, SaaS, global apps', 'GDPR compliance, regional services', 'Banks, healthcare, mission-critical'],
              ['Worst For', 'Global apps (high latency)', 'Latency optimization', 'Single region (overkill)', 'Apps without regional needs', 'Cost-sensitive apps'],
            ]}
          />

          <H2>Real Decision: SaaS Platform Expansion</H2>
          <Example title="Simple vs Latency-Based Routing - Global Impact">
            <CodeBlock>
{`Scenario: SaaS platform expanding from US-only to US + EU + Asia
         100k daily active users, 2M DNS queries/day

Initial Setup (Simple Routing):
- Single US datacenter
- Users in Tokyo: 180ms latency to US
- Users in London: 90ms latency to US
- Cost: 60M queries/mo × $0.40/M = $24/mo

After Global Expansion (Latency-Based Routing):
- 3 datacenters: US-East, EU-West, Asia-Pacific
- Users in Tokyo: 20ms to Asia-Pacific (160ms improvement!)
- Users in London: 15ms to EU-West (75ms improvement!)
- Cost: 60M queries/mo × $0.70/M = $42/mo

Cost Increase: $42 - $24 = $18/mo = $216/year

Revenue Impact:
- 100ms latency reduction = 1% conversion increase (proven)
- Average improvement: 120ms across 60% of users
- Conversion boost: 1.2% on 60k users
- New revenue: 60k × 1.2% × $50/mo LTV = $36k/mo

ROI: $18/mo investment → $36k/mo revenue = 2,000× ROI!

Decision: Latency-based routing pays for itself 2,000× over`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (single_datacenter):
    return "Simple Routing"
    # $0.40/M queries, no complexity overhead

elif (canary_deploy || blue_green_needed):
    return "Weighted Routing"
    # $0.60/M queries, 1% canary → 50% → 100% gradual rollout

elif (global_users && latency_matters):
    return "Latency-Based Routing"
    # $0.70/M queries, auto-routes to nearest datacenter
    # ROI: 100ms reduction = 1% conversion = huge revenue

elif (data_residency_required):
    return "Geolocation Routing"
    # $0.70/M queries, EU users → EU datacenter (GDPR compliance)

elif (uptime_sla > 99.95%):
    return "Failover Routing"
    # $0.50/M + $15/mo health checks
    # Auto-switch to backup on primary failure

else:
    return "Simple Routing"
    # Don't over-engineer for <10k users`}
          </CodeBlock>

          <H2>Weighted Routing for Canary Deploys</H2>
          <Example title="Gradual Rollout with Weighted Routing">
            <CodeBlock>
{`# Week 1: 5% canary
api.example.com A 192.168.1.1 weight=95  # Old version
api.example.com A 192.168.1.2 weight=5   # New version

# Week 2: 50% rollout (if metrics look good)
api.example.com A 192.168.1.1 weight=50
api.example.com A 192.168.1.2 weight=50

# Week 3: 100% new version
api.example.com A 192.168.1.2 weight=100

Cost: $0.60/M queries ($0.20/M premium over simple)
Benefit: Catch bugs affecting <5% of users before full rollout
         Prevents $50k+ incident from bad deploy`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using simple routing for global apps</Strong>
            <P>
              Teams serve global users from single US datacenter, causing 150ms+ latency for 60% of users.
              This kills conversion rates (1% per 100ms) and loses $36k+/mo in revenue.
            </P>
            <P>
              <Strong>Fix:</Strong> Switch to latency-based routing ($18/mo extra) when &gt;30% of users are &gt;100ms away.
              ROI is typically 500-2,000× from conversion improvements alone.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Geolocation instead of latency-based</Strong>
            <P>
              Geolocation routes "US users → US datacenter", but doesn't account for latency.
              A user in Seattle might be closer to Vancouver, Canada datacenter (20ms) than US-East (80ms).
            </P>
            <P>
              <Strong>Fix:</Strong> Use latency-based routing unless you need data residency compliance (GDPR, etc.).
              Latency-based auto-optimizes, geolocation is manual and often suboptimal.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: No failover for mission-critical services</Strong>
            <P>
              Single-region apps with no failover experience 99.9% uptime at best (8.7 hours downtime/year).
              For banks, healthcare, or e-commerce, this costs $10k-100k+ per outage.
            </P>
            <P>
              <Strong>Fix:</Strong> Add failover routing ($15/mo for health checks) to achieve 99.99%+ uptime (52 minutes downtime/year).
              Each prevented outage saves $10k+.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Latency-based routing costs $18/mo extra but generates $36k/mo revenue from conversion improvements (2,000× ROI).
            Weighted routing prevents $50k+ incidents from bad deploys for $0.20/M query premium.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'dns-ttl-tradeoffs',
      type: 'concept',
      title: '🎯 TTL Trade-Offs: Agility vs Performance',
      content: (
        <Section>
          <H1>🎯 TTL Trade-Offs: Agility vs Performance</H1>
          <P>
            <Strong>The Decision:</Strong> TTL (Time To Live) determines how long DNS records are cached.
            Short TTLs (60s) enable fast IP changes but increase query costs. Long TTLs (86400s/24h) reduce costs but slow migrations.
          </P>

          <H2>TTL Strategy Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Short TTL (60s)', 'Medium TTL (300s/5m)', 'Long TTL (3600s/1h)', 'Very Long (86400s/24h)']}
            rows={[
              ['Query Cost Impact', '10-20× baseline', '5-8× baseline', '1-2× baseline', '1× baseline (lowest)'],
              ['IP Change Speed', '1-2 minutes', '5-10 minutes', '1-2 hours', '24-48 hours'],
              ['Resolver Behavior', '99% respect 60s', '95% respect 5m', '90% respect 1h', '80% respect 24h (many ignore)'],
              ['Emergency Failover', 'Excellent (2 min)', 'Good (10 min)', 'Poor (2 hours)', 'Terrible (2 days)'],
              ['DNS Query Volume', '500k/day → 8.3M/day', '500k/day → 3M/day', '500k/day → 800k/day', '500k/day → 550k/day'],
              ['Monthly Cost (50k users)', '$100/mo', '$50/mo', '$15/mo', '$10/mo'],
              ['Best For', 'Frequent deploys, blue-green, canaries', 'Active development, weekly deploys', 'Stable production, rare changes', 'CDN edges, static assets'],
              ['Worst For', 'Cost-sensitive apps, high traffic', 'Mission-critical (balance needed)', 'Startups with frequent changes', 'Apps needing fast failover'],
            ]}
          />

          <H2>Real Decision: Blue-Green Deployment</H2>
          <Example title="TTL Impact on Zero-Downtime Deploys">
            <CodeBlock>
{`Scenario: E-commerce site doing weekly blue-green deploys
         50k daily users, 500k DNS queries/day baseline

TTL = 60s Strategy:
- DNS queries: 500k/day × 15 (cache misses) = 7.5M/day
- Monthly cost: 225M queries × $0.40/M = $90/mo
- Deployment speed: Change IP, wait 2 minutes, 99% traffic migrated
- Rollback speed: 2 minutes (critical for e-commerce!)

TTL = 3600s (1 hour) Strategy:
- DNS queries: 500k/day × 1.5 = 750k/day
- Monthly cost: 22.5M queries × $0.40/M = $9/mo
- Deployment speed: Change IP, wait 1-2 hours for full migration
- Rollback speed: 1-2 hours (risky during Black Friday!)

Cost Difference: $90 - $9 = $81/mo = $972/year

Risk Analysis:
- Bad deploy on Black Friday (2% of yearly revenue in 1 day)
- Annual revenue: $5M → Black Friday: $100k
- 1 hour rollback delay = $4k+ revenue loss
- 2 minute rollback (TTL=60s) limits loss to $133

Decision: Use TTL=60s during high-risk periods (Black Friday, launches)
         Use TTL=3600s during stable periods to save $81/mo

Hybrid Strategy:
- Normal: TTL=3600s ($9/mo)
- 1 week before deploy: TTL=60s ($90/mo)
- Average: $15/mo, best of both worlds!`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (blue_green_deploys || frequent_ip_changes):
    return "TTL = 60s"
    # $50-100/mo extra cost, 2-minute failover, worth it for agility

elif (weekly_deploys && can_plan_ahead):
    return "Hybrid: TTL = 3600s normally, 60s before deploys"
    # $10-20/mo average, reduce TTL 24h before planned changes

elif (stable_production && changes_rare):
    return "TTL = 3600s (1 hour)"
    # $10-20/mo, reasonable compromise

elif (cdn_edge || static_content):
    return "TTL = 86400s (24 hours)"
    # $5-10/mo, lowest cost for rarely-changing IPs

elif (mission_critical && uptime_sla > 99.99%):
    return "TTL = 300s (5 minutes)"
    # $30-60/mo, fast failover without extreme query costs

else:
    return "TTL = 300s (default)"
    # Good balance for most apps`}
          </CodeBlock>

          <H2>Hybrid TTL Strategy (Best Practice)</H2>
          <Example title="Lower TTL Before Planned Changes">
            <CodeBlock>
{`# Normal operation: Long TTL for cost savings
api.example.com  A  192.168.1.1  TTL=3600

# 24 hours before deployment: Reduce TTL
$ aws route53 change-resource-record-sets \\
    --hosted-zone-id Z123 \\
    --change-batch '{
      "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "api.example.com",
          "Type": "A",
          "TTL": 60,
          "ResourceRecords": [{"Value": "192.168.1.1"}]
        }
      }]
    }'

# Wait 1 hour (old TTL expires), then deploy
# Now all resolvers have 60s TTL, fast migration possible

# After deployment succeeds: Restore long TTL
TTL=3600

Result: Pay for short TTL only 1 day/month
        $90/mo × 1 day + $9/mo × 29 days = $12/mo average
        Get fast deployments without constant high costs!`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using 24-hour TTL and expecting fast changes</Strong>
            <P>
              Teams set TTL=86400 (24h) to save on DNS costs, then wonder why IP changes take 2 days to propagate.
              Many resolvers ignore long TTLs anyway (30% use max 1 hour regardless).
            </P>
            <P>
              <Strong>Fix:</Strong> Use TTL=300-3600s for production. Only use 24h for truly static IPs (CDN edges).
              The $5-10/mo savings isn't worth 24-hour deployment delays.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Constant short TTL for "flexibility"</Strong>
            <P>
              Startups often use TTL=60s permanently "in case we need to change something", paying 10-20× more in DNS costs.
              This costs $80-1,000/mo extra for flexibility rarely needed.
            </P>
            <P>
              <Strong>Fix:</Strong> Use hybrid strategy: TTL=3600s normally, reduce to 60s 24h before planned changes.
              Saves $80+/mo while maintaining agility when needed.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not accounting for resolver non-compliance</Strong>
            <P>
              About 10-30% of resolvers ignore TTL and cache for 1 hour minimum regardless of your setting.
              Teams set TTL=60s and expect 100% migration in 2 minutes, but 20% of users still hit old IP for 1 hour.
            </P>
            <P>
              <Strong>Fix:</Strong> Plan for 90-95% compliance, not 100%. Keep old servers running for TTL + 1 hour during migrations.
              Use connection draining to gracefully handle stragglers.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Hybrid TTL strategy (long normally, short before deploys) costs $12/mo vs $90/mo constant short TTL.
            Saves $936/year while maintaining fast deployment capability. Black Friday fast rollback (TTL=60s) prevents $4k+ revenue loss per incident.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

