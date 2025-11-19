import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCachingLesson: SystemDesignLesson = {
  id: 'sdp-caching',
  slug: 'sdp-caching',
  title: 'Caching Strategies',
  description: 'Learn caching patterns: cache-aside, write-through, write-behind, refresh-ahead, and eviction policies.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  stages: [
    {
      id: 'intro-caching',
      type: 'concept',
      title: 'Caching Strategies',
      content: (
        <Section>
          <H1>Caching Strategies</H1>
          <P>
            Different caching patterns optimize for different use cases. Choose based on read/write patterns.
          </P>

          <H2>Cache-Aside (Lazy Loading)</H2>
          <P>
            Application manages cache. Most common pattern.
          </P>
          <OL>
            <LI>Check cache for data</LI>
            <LI>If miss: Read from database</LI>
            <LI>Write to cache</LI>
            <LI>Return data</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Simple, cache only what's needed<br/>
            <Strong>Cons:</Strong> Cache miss penalty, possible stale data
          </P>

          <H2>Write-Through</H2>
          <P>
            Write to cache and database simultaneously.
          </P>
          <OL>
            <LI>Write to cache</LI>
            <LI>Write to database</LI>
            <LI>Return success</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Cache always consistent<br/>
            <Strong>Cons:</Strong> Slower writes (two writes)
          </P>

          <H2>Write-Behind (Write-Back)</H2>
          <P>
            Write to cache immediately, write to database asynchronously.
          </P>
          <OL>
            <LI>Write to cache</LI>
            <LI>Return success immediately</LI>
            <LI>Write to database in background</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Fast writes<br/>
            <Strong>Cons:</Strong> Risk of data loss if cache fails before DB write
          </P>

          <H2>Refresh-Ahead</H2>
          <P>
            Proactively refresh cache before expiration.
          </P>
          <UL>
            <LI>If cache entry expires in 5 minutes, refresh at 4 minutes</LI>
            <LI>User always gets fresh data</LI>
            <LI>Useful for predictable access patterns</LI>
          </UL>

          <H2>Cache Eviction Policies</H2>
          <UL>
            <LI><Strong>LRU (Least Recently Used):</Strong> Evict least recently accessed</LI>
            <LI><Strong>LFU (Least Frequently Used):</Strong> Evict least frequently accessed</LI>
            <LI><Strong>FIFO (First In First Out):</Strong> Evict oldest entry</LI>
            <LI><Strong>TTL (Time To Live):</Strong> Evict after expiration time</LI>
          </UL>

          <ComparisonTable
            headers={['Strategy', 'Use Case', 'Consistency']}
            rows={[
              ['Cache-Aside', 'Read-heavy', 'Eventual'],
              ['Write-Through', 'Read/write balanced', 'Strong'],
              ['Write-Behind', 'Write-heavy', 'Eventual'],
              ['Refresh-Ahead', 'Predictable access', 'Strong'],
            ]}
          />

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use cache-aside for most cases. Use write-through when consistency
            is critical. Use write-behind only if you can tolerate data loss.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

