import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCdnLesson: SystemDesignLesson = {
  id: 'sdp-cdn',
  slug: 'sdp-cdn',
  title: 'CDN (Content Delivery Network)',
  description: 'Learn how CDNs work: edge caching, push vs pull, cache invalidation, and SSL termination.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
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
  ],
};

