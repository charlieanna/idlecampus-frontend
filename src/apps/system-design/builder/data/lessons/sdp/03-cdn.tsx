import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCdnLesson: SystemDesignLesson = {
  id: 'sdp-cdn',
  slug: 'sdp-cdn',
  title: 'CDN (Content Delivery Network)',
  description: 'Master CDN fundamentals and critical trade-offs: WHEN to use CDN vs origin serving (traffic thresholds), WHICH provider fits your budget/performance needs, HOW to choose push vs pull and cache strategies for optimal cost/hit rates.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  stages: [
    {
      id: 'intro-cdn',
      type: 'concept',
      title: 'What is a CDN?',
      content: (
        <Section>
          <H1>What is a CDN?</H1>
          <P>
            A <Strong>CDN (Content Delivery Network)</Strong> is a distributed network of servers that cache
            content close to users, reducing latency and bandwidth costs.
          </P>

          <H2>How CDN Works</H2>
          <OL>
            <LI>User requests content (e.g., image.jpg)</LI>
            <LI>DNS routes to nearest CDN edge server</LI>
            <LI>Edge server checks cache</LI>
            <LI>If cached (cache hit): Return immediately</LI>
            <LI>If not cached (cache miss): Fetch from origin server, cache it, return to user</LI>
          </OL>

          <Example title="CDN Request Flow">
            <CodeBlock>
{`User in Tokyo requests: example.com/image.jpg

1. DNS: example.com → CDN edge server in Tokyo
2. Tokyo edge: Check cache → MISS
3. Tokyo edge: Fetch from origin (US datacenter)
4. Tokyo edge: Cache image.jpg
5. Tokyo edge: Return to user

Next user in Tokyo requests same image:
1. DNS: example.com → CDN edge server in Tokyo
2. Tokyo edge: Check cache → HIT
3. Tokyo edge: Return immediately (fast!)`}
            </CodeBlock>
          </Example>

          <H2>Push CDN vs Pull CDN</H2>
          <ComparisonTable
            headers={['Aspect', 'Push CDN', 'Pull CDN']}
            rows={[
              ['How it works', 'You upload content to CDN', 'CDN fetches from origin on first request'],
              ['Use case', 'Static content (images, videos)', 'Dynamic or frequently changing content'],
              ['Control', 'Full control over what\'s cached', 'Automatic caching based on requests'],
              ['Example', 'Upload video to CDN before launch', 'CDN caches blog posts on first read'],
            ]}
          />

          <H2>Cache Invalidation</H2>
          <P>
            When content changes, you need to invalidate CDN cache:
          </P>
          <UL>
            <LI><Strong>TTL-based:</Strong> Cache expires after time (e.g., 24 hours)</LI>
            <LI><Strong>Manual Invalidation:</Strong> API call to purge specific URLs</LI>
            <LI><Strong>Versioning:</Strong> Use versioned URLs (e.g., image-v2.jpg)</LI>
          </UL>

          <H2>CDN Benefits</H2>
          <UL>
            <LI><Strong>Lower Latency:</Strong> Content served from nearby edge server</LI>
            <LI><Strong>Reduced Bandwidth:</Strong> Less traffic to origin server</LI>
            <LI><Strong>DDoS Protection:</Strong> CDN absorbs attack traffic</LI>
            <LI><Strong>SSL Termination:</Strong> CDN handles HTTPS, reducing origin load</LI>
          </UL>

          <KeyPoint>
            <Strong>Use CDN:</Strong> For static content (images, CSS, JS, videos), especially when users are globally distributed.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cdn-provider-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: CDN Provider Selection',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: CDN Provider Selection</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing a CDN provider impacts your costs, latency, bandwidth, and feature availability.
            The wrong choice can cost $1k-10k+/month in over-provisioning or cause poor user experience from slow content delivery.
          </P>

          <H2>CDN Provider Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Cloudflare', 'CloudFront (AWS)', 'Fastly', 'Bunny CDN']}
            rows={[
              ['Monthly Cost (1TB)', '$0 (Free tier unlimited)', '$85 (US/EU), $170 (Asia)', '$120 + $0.12/GB overage', '$10 (pay-as-you-go)'],
              ['Monthly Cost (10TB)', '$0 (Free tier unlimited)', '$850 (blended), higher in Asia', '$1,200', '$100'],
              ['Edge Locations', '300+ in 100+ countries', '450+ in 90+ countries', '60+ (premium peering)', '100+ (focus on value)'],
              ['Performance (TTFB)', '15-30ms average', '20-40ms average', '10-20ms (fastest)', '25-45ms'],
              ['Cache Hit Ratio', '85-95% (excellent)', '80-90%', '90-98% (best)', '85-90%'],
              ['Setup Complexity', 'Trivial (DNS change)', 'Medium (AWS ecosystem)', 'Medium (API-first)', 'Trivial'],
              ['Invalidation Cost', 'Free unlimited', '$0.005 per path (1k paths = $5)', 'Included (instant)', 'Free unlimited'],
              ['Real-Time Features', 'Workers (serverless)', 'Lambda@Edge', 'VCL (Varnish)', 'Edge Rules (limited)'],
              ['Best For', 'Startups, free tier, DDoS protection', 'AWS-heavy stacks, enterprise', 'High-performance apps, live video', 'Budget-conscious, simple needs'],
            ]}
          />

          <H2>Real Decision: Image-Heavy SaaS Platform</H2>
          <Example title="Cloudflare vs CloudFront - Real Cost Analysis">
            <CodeBlock>
{`Scenario: SaaS platform serving 5TB images/month, 100k users globally

Cloudflare Free Tier:
- Bandwidth: UNLIMITED
- Cost: $0/mo
- Performance: 20ms TTFB, 90% cache hit ratio
- DDoS protection: Included free
- Total: $0/year

CloudFront Costs (5TB/month):
- US/EU (60%): 3TB × $0.085/GB = $255/mo
- Asia (30%): 1.5TB × $0.140/GB = $210/mo
- Other (10%): 0.5TB × $0.170/GB = $85/mo
- Invalidations: 10k paths/mo × $0.005 = $50/mo
- Total: $600/mo = $7,200/year

Fastly Costs (5TB/month):
- Bandwidth: 5TB × $0.12/GB = $600/mo
- Base fee: $50/mo
- Total: $650/mo = $7,800/year

Bunny CDN Costs (5TB/month):
- Bandwidth: 5TB × $0.01/GB = $50/mo
- Total: $50/mo = $600/year

Decision: Cloudflare Free saves $7,200/year vs CloudFront
         Even Bunny CDN at $600/year beats CloudFront by $6,600/year!

When to choose CloudFront:
- Already on AWS (tight S3/EC2 integration)
- Need Lambda@Edge for complex edge logic
- Enterprise support requirements

When to choose Cloudflare:
- Budget-conscious (Free tier is incredible)
- DDoS protection critical
- Workers for edge compute

When to choose Fastly:
- Performance-critical (10-20ms TTFB)
- Live video streaming
- Need instant cache purging

When to choose Bunny CDN:
- Cost-optimized ($10-100/mo sweet spot)
- Simple use cases
- Predictable pricing needed`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (bandwidth < 10TB/mo && budget_tight):
    return "Cloudflare Free"
    # $0/mo, unlimited bandwidth, DDoS included
    # Unbeatable value for most startups

elif (aws_infrastructure && bandwidth > 20TB/mo):
    return "CloudFront"
    # $1k-5k/mo, seamless AWS integration
    # Costs competitive at high volume with Reserved Capacity

elif (performance_critical || live_video):
    return "Fastly"
    # $1k-10k/mo, 10-20ms TTFB, instant purge
    # Worth premium for gaming, streaming, real-time apps

elif (budget < $500/mo && need_paid_features):
    return "Bunny CDN"
    # $10-200/mo, excellent value, simple pricing
    # Sweet spot for growing startups

else:
    return "Cloudflare Free, upgrade to Pro/Business later"
    # Start free, scale to $20-200/mo when needed`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using CloudFront because "we're on AWS"</Strong>
            <P>
              Many teams default to CloudFront and pay $7k/year when Cloudflare Free ($0/year) would work perfectly.
              CloudFront only makes sense at enterprise scale (50TB+/mo) or when you need Lambda@Edge.
            </P>
            <P>
              <Strong>Fix:</Strong> Start with Cloudflare Free for &lt;10TB/mo. Switch to CloudFront only if you need tight AWS integration or Lambda@Edge.
              Save $7k+/year for small/medium traffic.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Paying for CDN when traffic is tiny</Strong>
            <P>
              Startups with &lt;100GB/mo bandwidth often pay $50-200/mo for CDN when direct serving costs $5-10/mo.
              CDN becomes cost-effective around 500GB-1TB/mo threshold.
            </P>
            <P>
              <Strong>Fix:</Strong> If bandwidth &lt;500GB/mo, consider direct serving from origin with good caching headers.
              Or use Cloudflare Free (still $0 but adds DDoS protection). Bunny CDN is also cheap ($5-10/mo).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not considering geographic costs</Strong>
            <P>
              Asia/Australia bandwidth on CloudFront costs 2-3× more than US/EU ($0.140/GB vs $0.085/GB).
              Apps with heavy Asia traffic can pay $10k+/mo more than expected.
            </P>
            <P>
              <Strong>Fix:</Strong> For Asia-heavy traffic, Cloudflare Free (no geographic pricing) or Bunny CDN (flat $0.01/GB worldwide) save $1k+/mo.
              CloudFront is expensive for non-US/EU traffic.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Switching from CloudFront to Cloudflare Free saves $7,200/year for typical 5TB/mo traffic.
            Bunny CDN at $600/year saves $6,600/year vs CloudFront while offering similar performance.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'push-vs-pull-tradeoffs',
      type: 'concept',
      title: '🎯 Push vs Pull CDN Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Push vs Pull CDN Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Push CDN requires you to upload content, while Pull CDN fetches from origin on-demand.
            The choice impacts your cache hit ratio, origin load, and operational complexity.
          </P>

          <H2>Push vs Pull Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Push CDN', 'Pull CDN', 'Hybrid']}
            rows={[
              ['How It Works', 'You upload files to CDN', 'CDN fetches from origin on cache miss', 'Push critical assets, pull everything else'],
              ['Cache Hit Ratio', '100% (after upload)', '80-95% (depends on traffic)', '95-98% (best of both)'],
              ['Origin Load', 'Zero (no requests)', 'Medium (5-20% of requests)', 'Low (1-5% of requests)'],
              ['Setup Complexity', 'High (upload workflow)', 'Low (just configure origin)', 'Medium'],
              ['Deploy Speed', 'Slow (must upload)', 'Instant (pull on first request)', 'Medium (critical assets slow)'],
              ['Storage Cost', 'High (store all content)', 'Low (CDN caches only popular)', 'Medium'],
              ['Best For', 'Static sites, large video libraries', 'Dynamic sites, frequently changing content', 'E-commerce, SaaS platforms'],
              ['Worst For', 'Frequently updated content', 'Low-traffic assets (poor cache hit)', 'Simple use cases (overkill)'],
            ]}
          />

          <H2>Real Decision: Video Streaming Platform</H2>
          <Example title="Push vs Pull for Video Delivery">
            <CodeBlock>
{`Scenario: Netflix-style platform with 10k videos (500GB each), 1M users

Pull CDN Strategy:
- Cache popular videos (20% of content = 80% of views)
- CDN storage: 2k videos × 500GB = 1PB cached
- Origin requests: 20% of 1M users = 200k origin hits/day
- Cache hit ratio: 80%
- CDN cost: $1,000/mo (bandwidth only)
- Origin bandwidth: 200k requests × 500GB = 100TB/mo = $8,500/mo
- Total: $9,500/mo

Push CDN Strategy:
- Upload all 10k videos to CDN
- CDN storage: 10k videos × 500GB = 5PB
- Origin requests: 0 (everything on CDN)
- Cache hit ratio: 100%
- CDN cost: 5PB × $0.03/GB storage + bandwidth = $150k/mo
- Origin bandwidth: $0/mo
- Total: $150,000/mo

Hybrid Strategy (Best):
- Push top 500 videos (50% of views) to all edges
- Pull remaining 9.5k videos on-demand
- CDN storage: 500 videos × 500GB = 250TB
- Origin requests: 50% of 1M users = 500k hits/day
- Cache hit ratio: 95%
- CDN cost: 250TB × $0.03/GB + bandwidth = $7,500/mo
- Origin bandwidth: 50k requests × 500GB = 25TB/mo = $2,125/mo
- Total: $9,625/mo

Result: Pull wins for long-tail content (saves $140k/mo vs Push)
        Hybrid slightly more expensive but 95% hit rate (better UX)`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (static_site || video_library_with_few_assets):
    return "Push CDN"
    # Upload once, 100% cache hit ratio
    # Best for <1k assets that change rarely

elif (dynamic_content || frequent_updates):
    return "Pull CDN"
    # CDN auto-fetches, updates instantly
    # Best for blogs, news sites, SaaS with frequent deploys

elif (ecommerce || saas_with_heavy_assets):
    return "Hybrid: Push critical assets, Pull everything else"
    # Push: Homepage images, hero videos, CSS/JS bundles
    # Pull: User avatars, product images (long tail)
    # 95%+ cache hit ratio, optimal costs

elif (traffic_low || unpredictable_demand):
    return "Pull CDN"
    # Don't pay for storage until content is popular
    # CDN evicts unpopular content automatically

else:
    return "Pull CDN (default for most apps)"
    # Simpler, automatic, good cache hit ratio (85-90%)`}
          </CodeBlock>

          <H2>Hybrid Strategy Example</H2>
          <Example title="E-commerce Site Using Hybrid Approach">
            <CodeBlock>
{`# Push critical assets (preload to all edges)
- Homepage hero images (500MB)
- CSS/JS bundles (50MB)
- Product category thumbnails (2GB)
- Total pushed: 2.5GB to 200 edges = 500GB storage

# Pull everything else (lazy load on-demand)
- 100k product images (50GB)
- User avatars (5GB)
- Blog images (10GB)
- Total: 65GB origin, CDN caches popular subset

Result:
- Critical assets: 100% cache hit (pushed)
- Long-tail assets: 90% cache hit (pulled)
- Combined: 98% cache hit ratio
- Storage cost: 500GB vs 65TB if pushed everything
- Save: $1,950/mo on storage alone!

When to push:
- Assets on homepage (100% of users see)
- CSS/JS bundles (every page load needs)
- Top 10 product images (80% of revenue)

When to pull:
- User-generated content (avatars, reviews)
- Long-tail products (only 5% of users view)
- Frequently updated content (blog posts)`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Pushing everything to CDN</Strong>
            <P>
              Teams upload their entire 50GB asset library to CDN and pay $150/mo storage + bandwidth when 80% of content gets &lt;10 views/month.
              Pull CDN would only cache popular 10GB subset and cost $30/mo.
            </P>
            <P>
              <Strong>Fix:</Strong> Use Pull CDN for long-tail content. Only push assets that serve &gt;100k requests/month.
              Let CDN evict unpopular content automatically.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Pull CDN with low traffic causing poor cache hit ratio</Strong>
            <P>
              Sites with &lt;1k visitors/day using Pull CDN get 40-60% cache hit ratios because content expires before second request.
              This means 40-60% of requests hit slow origin, defeating CDN purpose.
            </P>
            <P>
              <Strong>Fix:</Strong> For low traffic sites, either (1) Push critical assets for 100% hit ratio, or (2) Increase TTL to 7+ days to improve hit ratio.
              Or skip CDN entirely if traffic &lt;500GB/mo.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not preloading for launches/events</Strong>
            <P>
              Black Friday sales with Pull CDN cause origin to melt from 100k simultaneous cache misses when new product images go live.
              Origin crashes, losing $50k+/hour in sales.
            </P>
            <P>
              <Strong>Fix:</Strong> Before major launches, push critical assets to CDN or "warm up" cache by pre-fetching to all edges.
              CloudFlare/Fastly offer cache warming APIs. Prevents origin overload.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Pull CDN saves $140k/mo vs Push for long-tail video content by only caching popular 20%.
            Hybrid approach achieves 95%+ cache hit ratio while saving $1,950/mo on storage vs pushing everything.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cache-invalidation-tradeoffs',
      type: 'concept',
      title: '🎯 Cache Invalidation Strategy Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Cache Invalidation Strategy Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Cache invalidation determines how you update CDN content: TTL-based expiration,
            manual purging, or versioned URLs. The choice impacts your deployment speed, costs, and user experience.
          </P>

          <H2>Invalidation Strategy Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'TTL-Based', 'Manual Purge', 'Versioned URLs', 'Hybrid']}
            rows={[
              ['Update Speed', 'Slow (wait for TTL)', 'Fast (2-5 min)', 'Instant (new URL)', 'Fast (purge + version)'],
              ['Cost (CloudFront)', '$0', '$0.005 per path (1k paths = $5)', '$0', '$5-20/mo'],
              ['Cost (Cloudflare)', '$0', '$0 (unlimited free)', '$0', '$0'],
              ['Complexity', 'Zero (set and forget)', 'Medium (API calls)', 'High (build process)', 'High'],
              ['Cache Efficiency', 'Poor (stale content)', 'Good', 'Excellent (never stale)', 'Excellent'],
              ['User Experience', 'Poor (see old content)', 'Good (5 min lag)', 'Perfect (instant updates)', 'Perfect'],
              ['Best For', 'Rarely changing content', 'Emergency fixes, daily deploys', 'Frequent deploys, SPA apps', 'Production-grade apps'],
              ['Worst For', 'Frequently updated apps', 'High-frequency changes (costs)', 'Static sites (overkill)', 'Simple use cases'],
            ]}
          />

          <H2>Real Decision: E-commerce Product Updates</H2>
          <Example title="TTL vs Versioning for Product Images">
            <CodeBlock>
{`Scenario: E-commerce site, update 500 product images/day, 5M pageviews/day

TTL-Based Strategy (TTL = 24 hours):
- Update image: product123.jpg
- Users see old image for up to 24 hours
- Cost: $0/mo
- Revenue impact: 1% of users see outdated pricing
  - 50k users × 1% conversion loss × $50 AOV = $25k/day lost
  - Monthly loss: $750k

Manual Purge Strategy:
- Update image, call API to purge product123.jpg
- Propagation: 2-5 minutes globally
- Cost: 500 purges/day × 30 days = 15k purges/mo
  - CloudFront: 15k × $0.005 = $75/mo
  - Cloudflare: $0/mo (unlimited free)
- Revenue impact: Minimal (5 min lag acceptable)

Versioned URLs Strategy:
- Old: product123-v1.jpg
- New: product123-v2.jpg (instantly live)
- Build process: Hash-based filenames
  - product-abc123.jpg (content hash)
- Cost: $0/mo
- Revenue impact: Zero (instant updates)
- Complexity: Requires build pipeline (Webpack, Vite, etc.)

Hybrid Strategy (Versioned + Purge):
- Critical assets: Versioned (CSS, JS, hero images)
- Dynamic content: Purge API (product images, UGC)
- Cost: $0-75/mo
- Best of both worlds

Result: Versioning prevents $750k/mo revenue loss
        Hybrid approach optimal for most e-commerce sites`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (updates_rare && accuracy_not_critical):
    return "TTL-Based (24-hour TTL)"
    # $0/mo, zero complexity
    # OK for blog images, marketing assets

elif (daily_deploys || emergency_fixes_needed):
    return "Manual Purge"
    # $0-75/mo, 2-5 min propagation
    # Good for news sites, daily product updates

elif (spa_app || frequent_deploys):
    return "Versioned URLs (content hashing)"
    # $0/mo, instant updates, best cache efficiency
    # Required for React/Vue/Angular apps

elif (ecommerce || revenue_critical):
    return "Hybrid: Version critical assets, purge dynamic content"
    # Version: CSS/JS/homepage → instant updates
    # Purge: Product images → 5 min updates, $0-75/mo
    # Best balance for production apps

elif (cloudflare_user):
    return "Manual Purge (unlimited free)"
    # Why not? It's free on Cloudflare!
    # 2-5 min updates, zero cost

else:
    return "Versioned URLs"
    # Industry standard for modern web apps
    # Vite/Webpack do this automatically`}
          </CodeBlock>

          <H2>Implementing Versioned URLs</H2>
          <Example title="Content Hashing with Vite/Webpack">
            <CodeBlock>
{`// Vite automatically hashes build output
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}

// Build output:
// main.abc123.js     ← hash changes when content changes
// logo.xyz789.png    ← new hash = new URL = instant CDN update

// HTML automatically updates:
<script src="/assets/main.abc123.js"></script>
<img src="/assets/logo.xyz789.png">

// Benefits:
// 1. Infinite TTL (never stale): Cache-Control: max-age=31536000
// 2. Instant updates: New deploy = new hashes = new URLs
// 3. No purge needed: Old URLs naturally expire from cache
// 4. Atomic deploys: All-or-nothing (no mixed versions)

// Result:
// - Cache hit ratio: 99%+
// - Update speed: Instant
// - Cost: $0/mo
// - User experience: Perfect (never see stale content)`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Long TTL without versioning</Strong>
            <P>
              Teams set 24-hour TTL on CSS/JS to "improve cache hit ratio", then wonder why users see broken layouts for hours after deploy.
              Costs $0 but causes 5-20% of users to see outdated assets, breaking critical flows.
            </P>
            <P>
              <Strong>Fix:</Strong> Use versioned URLs for CSS/JS/critical assets. Set infinite TTL (1 year) with content hashing.
              Each deploy generates new URLs, instant updates, 99%+ cache hit ratio.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Manual purge without automation</Strong>
            <P>
              Developers manually call purge API after each deploy, often forgetting. Results in stale content for hours/days.
              Or they purge too aggressively (100k purges/month) and pay $500/mo on CloudFront.
            </P>
            <P>
              <Strong>Fix:</Strong> Automate purge in CI/CD pipeline (GitHub Actions, etc.). Or switch to versioning to avoid purges entirely.
              If on CloudFront with &gt;10k purges/mo, switch to Cloudflare (free unlimited) or versioning.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Purging entire cache for small updates</Strong>
            <P>
              Teams do "purge all" after changing one CSS file, evicting 500GB of perfectly good cache.
              Next hour sees 10M cache misses, overloading origin and causing $5k+ bandwidth spike.
            </P>
            <P>
              <Strong>Fix:</Strong> Purge specific paths only: /assets/main.css, not entire cache. Or use versioning (purge nothing, update URL).
              CloudFlare/Fastly support wildcard purge: /assets/css/* to purge CSS folder only.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Versioned URLs prevent $750k/mo revenue loss from stale pricing/images in e-commerce.
            Cloudflare's free unlimited purge saves $75/mo vs CloudFront for high-frequency updates. Content hashing achieves 99%+ cache hit ratio vs 85% with TTL-only.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cdn-vs-origin-tradeoffs',
      type: 'concept',
      title: '🎯 CDN vs Direct Origin Serving',
      content: (
        <Section>
          <H1>🎯 CDN vs Direct Origin Serving</H1>
          <P>
            <Strong>The Decision:</Strong> CDN adds cost and complexity but reduces latency and bandwidth.
            The choice depends on your traffic volume, geographic distribution, and performance requirements.
          </P>

          <H2>CDN vs Origin Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Direct Origin', 'CDN (Cloudflare Free)', 'CDN (CloudFront)', 'CDN (Premium)']}
            rows={[
              ['Monthly Cost (1TB)', '$85 (EC2 bandwidth)', '$0', '$85', '$120 (Fastly)'],
              ['Monthly Cost (10TB)', '$850', '$0', '$850', '$1,200'],
              ['Latency (US users)', '20-50ms', '15-30ms', '20-40ms', '10-20ms'],
              ['Latency (Global)', '100-300ms', '15-50ms', '20-60ms', '10-30ms'],
              ['DDoS Protection', 'You manage ($500+/mo)', 'Free unlimited', 'AWS Shield ($3k/mo for Advanced)', 'Included'],
              ['Origin Load', '100%', '5-15%', '10-20%', '2-10%'],
              ['Setup Complexity', 'Zero', 'Trivial (DNS change)', 'Medium', 'Medium'],
              ['Break-Even Point', 'N/A', 'Never (free!)', '~1TB/mo', '~5TB/mo'],
            ]}
          />

          <H2>Real Decision: When CDN Makes Sense</H2>
          <Example title="Traffic Threshold Analysis">
            <CodeBlock>
{`Scenario 1: Small Startup (100GB/mo bandwidth, 5k users)
Direct Origin:
- EC2 bandwidth: 100GB × $0.09 = $9/mo
- Latency: 40ms (US users), 150ms (global)
- Origin load: Handles easily

CDN (CloudFront):
- Bandwidth: 100GB × $0.085 = $8.50/mo
- Latency: 30ms (US), 50ms (global)
- Improvement: Marginal

Decision: Skip CDN, save on complexity
          Or use Cloudflare Free for DDoS protection ($0)

---

Scenario 2: Growing SaaS (2TB/mo bandwidth, 100k users, 40% global)
Direct Origin:
- EC2 bandwidth: 2TB × $0.09/GB = $180/mo
- Latency: 40ms (US), 180ms (Asia/EU)
- Origin load: Struggling, need bigger instance (+$200/mo)
- Total: $380/mo

CDN (Cloudflare Free):
- Bandwidth: UNLIMITED = $0/mo
- Latency: 20ms (US), 30ms (global)
- Origin load: 90% reduction
- Total: $0/mo

CDN (CloudFront):
- Bandwidth: 2TB blended = $170/mo
- Latency: 30ms (US), 40ms (global)
- Origin: Can use smaller instance (-$100/mo)
- Total: $170/mo

Decision: Cloudflare Free is obvious win (saves $380/mo!)
          50ms faster globally, zero origin load

---

Scenario 3: High-Traffic App (50TB/mo, 1M users, 60% global)
Direct Origin:
- EC2 bandwidth: 50TB × $0.09 = $4,500/mo
- Need multi-region deployment: +$2,000/mo
- DDoS protection: AWS Shield Advanced = $3,000/mo
- Total: $9,500/mo

CDN (Cloudflare Free):
- Bandwidth: UNLIMITED = $0/mo
- DDoS: Included free
- Multi-region: Not needed (CDN handles)
- Total: $0/mo (incredible!)

CDN (CloudFront with Reserved Capacity):
- 50TB with commitment: ~$2,500/mo
- DDoS: Shield Standard free
- Total: $2,500/mo

Decision: Cloudflare Free saves $9,500/mo (!)
          Even CloudFront saves $7,000/mo vs direct serving

Key Insight: CDN becomes cost-effective at ~500GB-1TB/mo
             Cloudflare Free is almost always better (unless you need Lambda@Edge)`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (bandwidth < 100GB/mo && users_mostly_nearby):
    return "Direct Origin (skip CDN for now)"
    # $5-10/mo bandwidth, low latency locally
    # CDN adds complexity with minimal benefit

elif (bandwidth < 10TB/mo):
    return "Cloudflare Free"
    # $0/mo, unlimited bandwidth, DDoS protection
    # Literally no downside vs direct serving

elif (aws_infrastructure && bandwidth > 20TB/mo):
    return "CloudFront with Reserved Capacity"
    # $2k-5k/mo, competitive at scale
    # Seamless integration with S3/EC2

elif (performance_critical || live_video):
    return "Premium CDN (Fastly)"
    # $5k-20k/mo, 10-20ms latency, instant purge
    # Worth it for gaming, streaming, fintech

elif (global_users > 30%):
    return "CDN (any provider)"
    # 100-200ms latency reduction worth any CDN cost
    # Improves conversion 1-3%

else:
    return "Cloudflare Free (default for almost everyone)"
    # Unless you have specific needs, free is unbeatable`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Not using CDN because "we don't need it yet"</Strong>
            <P>
              Startups serve globally from single US datacenter, paying $180/mo EC2 bandwidth when Cloudflare Free is $0/mo
              AND reduces latency from 180ms to 30ms for international users (3% conversion boost).
            </P>
            <P>
              <Strong>Fix:</Strong> Use Cloudflare Free from day 1. It's literally free, 10 min setup, and provides DDoS protection + better performance.
              No reason to skip it (unless you enjoy paying AWS $180/mo for slower service).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using CDN for API responses</Strong>
            <P>
              Teams put entire API behind CDN to "speed things up", but personalized/authenticated responses shouldn't be cached.
              Results in 5% cache hit ratio, paying CDN costs for no benefit.
            </P>
            <P>
              <Strong>Fix:</Strong> Only CDN static assets (images, CSS, JS, videos). Keep API responses direct to origin.
              Or use CDN for public API endpoints only (e.g., GET /products, not GET /user/profile).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Over-paying for "enterprise" CDN</Strong>
            <P>
              Companies pay Akamai/Fastly $10k+/mo because "we need enterprise support" when Cloudflare Business ($200/mo)
              offers 99.99% SLA, 24/7 support, and identical performance for 98% less cost.
            </P>
            <P>
              <Strong>Fix:</Strong> Audit CDN bills. Unless you need live video streaming or 10ms latency, Cloudflare Business ($200/mo)
              handles enterprise scale. Save $9,800/mo vs legacy enterprise CDNs.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Cloudflare Free saves $9,500/mo vs direct serving at 50TB/mo scale (unlimited bandwidth + DDoS protection).
            CDN reduces global latency from 180ms to 30ms, improving conversion 1-3% = $10k-50k/mo extra revenue for typical SaaS.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

