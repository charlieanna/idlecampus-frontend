import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const loadParametersLesson: SystemDesignLesson = {
  id: 'load-parameters',
  slug: 'load-parameters',
  title: 'Understanding Load Parameters',
  description: 'Learn how to identify the key load parameters for different types of systems',
  category: 'patterns',
  difficulty: 'beginner',
  estimatedMinutes: 20,
  stages: [
    {
      id: 'what-are-load-parameters',
      type: 'concept',
      title: 'What are Load Parameters?',
      content: (
        <Section>
          <H1>What are Load Parameters?</H1>
          
          <P>
            <Strong>Load parameters</Strong> are the numbers that describe how much work your system needs to do. 
            Different systems have different load characteristics, and identifying the <Strong>right</Strong> load 
            parameters is crucial for designing scalable systems.
          </P>

          <KeyPoint>
            <Strong>Key Insight:</Strong> The obvious metric (like requests per second) might not be your actual bottleneck!
          </KeyPoint>

          <H2>Common Load Parameters</H2>

          <UL>
            <LI><Strong>Requests per second (RPS):</Strong> How many API requests your system handles</LI>
            <LI><Strong>Concurrent users:</Strong> How many users are actively using the system</LI>
            <LI><Strong>Database queries per second:</Strong> How many database operations occur</LI>
            <LI><Strong>Cache hit rate:</Strong> Percentage of requests served from cache</LI>
            <LI><Strong>Fan-out ratio:</Strong> How many downstream operations one write creates</LI>
            <LI><Strong>Data volume:</Strong> Amount of data stored or transferred</LI>
            <LI><Strong>Bandwidth:</Strong> Network throughput required</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'different-systems-different-parameters',
      type: 'concept',
      title: 'Different Systems, Different Parameters',
      content: (
        <Section>
          <H1>Different Systems Have Different Key Load Parameters</H1>
          
          <P>
            The most important load parameter varies by system type. Understanding which parameter matters most 
            helps you design the right architecture.
          </P>

          <H2>Example 1: Twitter - Fan-Out Ratio</H2>

          <Example title="The Twitter Problem">
            <P>
              At first glance, you might think Twitter's bottleneck is <Strong>tweets per second</Strong>. 
              But that's not the real problem!
            </P>

            <P>
              <Strong>The Real Bottleneck:</Strong> When a celebrity with 1 million followers posts a tweet, 
              that single tweet creates <Strong>1 million timeline writes</Strong> (one for each follower).
            </P>

            <CodeBlock>
{`Celebrity posts 1 tweet
  → System must write to 1,000,000 follower timelines
  → 1 write operation becomes 1,000,000 write operations!

Fan-out ratio = 1,000,000:1`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Fan-out ratio (average followers per user), NOT tweets per second
            </KeyPoint>
          </Example>

          <H2>Example 2: Web Search - Query Complexity</H2>

          <Example title="Google Search">
            <P>
              Google doesn't just handle high RPS - the real challenge is the <Strong>query complexity</Strong>.
            </P>

            <UL>
              <LI>Each search query must search billions of web pages</LI>
              <LI>Must rank results in milliseconds</LI>
              <LI>Must handle complex queries (multi-word, typos, synonyms)</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Query complexity and index size, not just queries per second
            </KeyPoint>
          </Example>

          <H2>Example 3: Chat Application - Concurrent Connections</H2>

          <Example title="Slack or WhatsApp">
            <P>
              Chat applications have a different bottleneck: <Strong>concurrent connections</Strong>.
            </P>

            <UL>
              <LI>Each user maintains a persistent WebSocket connection</LI>
              <LI>1 million users = 1 million open connections</LI>
              <LI>Messages per second is less important than connection management</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Concurrent connections, not messages per second
            </KeyPoint>
          </Example>

          <H2>Example 4: Video Streaming - Bandwidth</H2>

          <Example title="Netflix or YouTube">
            <P>
              Video streaming's bottleneck is <Strong>bandwidth</Strong>, not requests per second.
            </P>

            <UL>
              <LI>One video stream requires 5-25 Mbps</LI>
              <LI>1 million concurrent viewers = 5-25 Tbps total bandwidth</LI>
              <LI>API requests are minimal compared to video data transfer</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Bandwidth (Mbps/Tbps), not API requests per second
            </KeyPoint>
          </Example>
        </Section>
      ),
    },
    {
      id: 'identifying-load-parameters',
      type: 'concept',
      title: 'How to Identify Load Parameters',
      content: (
        <Section>
          <H1>How to Identify Load Parameters</H1>

          <H2>Step 1: Understand Your System's Behavior</H2>

          <UL>
            <LI>What operations does your system perform?</LI>
            <LI>What happens when a user performs an action?</LI>
            <LI>How does one operation affect other parts of the system?</LI>
          </UL>

          <H2>Step 2: Ask "What Amplifies?"</H2>

          <P>
            Look for operations that create <Strong>amplification</Strong> - where one action causes many downstream operations.
          </P>

          <Example title="Amplification Examples">
            <UL>
              <LI><Strong>Twitter:</Strong> 1 tweet → 1M timeline writes (high amplification)</LI>
              <LI><Strong>Email blast:</Strong> 1 send → 1M emails (high amplification)</LI>
              <LI><Strong>File upload:</Strong> 1 upload → 1 file stored (low amplification)</LI>
            </UL>
          </Example>

          <H2>Step 3: Measure What Matters</H2>

          <P>
            Don't just measure the obvious metrics. Measure what actually impacts your system's performance.
          </P>

          <ComparisonTable
            headers={['System Type', 'Obvious Metric', 'Actual Key Metric']}
            rows={[
              ['Social Media', 'Posts per second', 'Fan-out ratio (followers per user)'],
              ['Web Search', 'Queries per second', 'Query complexity + index size'],
              ['Chat App', 'Messages per second', 'Concurrent connections'],
              ['Video Streaming', 'Video requests', 'Bandwidth (Mbps)'],
              ['E-commerce', 'Page views', 'Database query rate'],
              ['Analytics', 'Events per second', 'Query complexity'],
            ]}
          />

          <KeyPoint>
            <Strong>Remember:</Strong> The metric that matters is often the one that creates the most work downstream, 
            not the one that seems most obvious.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'practical-examples',
      type: 'concept',
      title: 'Practical Examples',
      content: (
        <Section>
          <H1>Practical Examples</H1>

          <H2>Example: Instagram Photo Upload</H2>

          <P>
            When a user uploads a photo to Instagram:
          </P>

          <UL>
            <LI>1 photo upload (obvious metric)</LI>
            <LI>→ Creates thumbnail (3 sizes: small, medium, large)</LI>
            <LI>→ Updates user's feed</LI>
            <LI>→ Updates all followers' feeds (fan-out)</LI>
            <LI>→ Updates search index</LI>
            <LI>→ Triggers notifications to followers</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Fan-out ratio (followers per user) × photo processing time
          </KeyPoint>

          <Divider />

          <H2>Example: E-commerce Product Page</H2>

          <P>
            When a user views a product page:
          </P>

          <UL>
            <LI>1 page view (obvious metric)</LI>
            <LI>→ Queries product details</LI>
            <LI>→ Queries inventory</LI>
            <LI>→ Queries reviews</LI>
            <LI>→ Queries recommendations</LI>
            <LI>→ Queries related products</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Database queries per page view (not page views per second)
          </KeyPoint>

          <Divider />

          <H2>Example: Real-Time Analytics Dashboard</H2>

          <P>
            When a user views an analytics dashboard:
          </P>

          <UL>
            <LI>1 dashboard view (obvious metric)</LI>
            <LI>→ Aggregates millions of events</LI>
            <LI>→ Performs complex time-series queries</LI>
            <LI>→ Calculates multiple metrics</LI>
            <LI>→ Renders charts and graphs</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Query complexity (data scanned per query), not dashboard views per second
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'takeaways',
      type: 'concept',
      title: 'Key Takeaways',
      content: (
        <Section>
          <H1>Key Takeaways</H1>

          <UL>
            <LI>
              <Strong>Different systems have different key load parameters.</Strong> Don't assume RPS is always the bottleneck.
            </LI>
            <LI>
              <Strong>Look for amplification.</Strong> Operations that create many downstream operations are often the real bottleneck.
            </LI>
            <LI>
              <Strong>Measure what matters.</Strong> The obvious metric might not be the one that impacts performance.
            </LI>
            <LI>
              <Strong>Design for your key load parameter.</Strong> Once you identify it, optimize your architecture for that specific parameter.
            </LI>
          </UL>

          <H2>Common Mistakes</H2>

          <UL>
            <LI>❌ Assuming RPS is always the most important metric</LI>
            <LI>❌ Not considering fan-out or amplification effects</LI>
            <LI>❌ Measuring the wrong thing (e.g., API calls instead of database queries)</LI>
            <LI>❌ Ignoring query complexity in favor of simple request counts</LI>
          </UL>

          <H2>Best Practices</H2>

          <UL>
            <LI>✅ Understand your system's behavior end-to-end</LI>
            <LI>✅ Identify operations that create amplification</LI>
            <LI>✅ Measure the metrics that actually impact performance</LI>
            <LI>✅ Design your architecture around your key load parameter</LI>
          </UL>
        </Section>
      ),
    },
  ],
};

