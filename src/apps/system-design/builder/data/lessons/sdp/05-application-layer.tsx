import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpApplicationLayerLesson: SystemDesignLesson = {
  id: 'sdp-application-layer',
  slug: 'sdp-application-layer',
  title: 'Application Layer Patterns',
  description: 'Learn microservices, service discovery, BFF, sidecar pattern, bulkhead, retry, and rate limiting.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  stages: [
    {
      id: 'intro-application-layer',
      type: 'concept',
      title: 'Application Layer Architecture Patterns',
      content: (
        <Section>
          <H1>Application Layer Architecture Patterns</H1>
          <P>
            Modern applications use various patterns to build scalable, maintainable systems.
          </P>

          <H2>Microservices</H2>
          <P>
            Break monolithic application into small, independent services:
          </P>
          <UL>
            <LI>Each service handles one business function</LI>
            <LI>Services communicate via APIs (REST, gRPC)</LI>
            <LI>Independent deployment and scaling</LI>
            <LI>Trade-off: More complexity, network latency</LI>
          </UL>

          <H2>Service Discovery</H2>
          <P>
            Services need to find each other dynamically:
          </P>
          <UL>
            <LI><Strong>Client-Side Discovery:</Strong> Client queries service registry (e.g., Consul, Eureka)</LI>
            <LI><Strong>Server-Side Discovery:</Strong> Load balancer queries registry, routes to service</LI>
            <LI>Services register on startup, deregister on shutdown</LI>
          </UL>

          <H2>BFF (Backend for Frontend)</H2>
          <P>
            Separate API for each client type (web, mobile, admin):
          </P>
          <UL>
            <LI>Web BFF: Optimized for web UI needs</LI>
            <LI>Mobile BFF: Optimized for mobile (smaller payloads)</LI>
            <LI>Reduces client-specific logic in services</LI>
          </UL>

          <H2>Sidecar Pattern</H2>
          <P>
            Deploy helper container alongside main application:
          </P>
          <UL>
            <LI>Handles cross-cutting concerns (logging, monitoring, proxy)</LI>
            <LI>Example: Envoy proxy as sidecar for service mesh</LI>
            <LI>Keeps application code focused on business logic</LI>
          </UL>

          <H2>Bulkhead Pattern</H2>
          <P>
            Isolate resources to prevent cascading failures:
          </P>
          <UL>
            <LI>Separate thread pools for different operations</LI>
            <LI>If one operation fails, others continue</LI>
            <LI>Example: Separate connection pools for read/write</LI>
          </UL>

          <H2>Retry with Exponential Backoff</H2>
          <P>
            Retry failed requests with increasing delays:
          </P>
          <CodeBlock>
{`// Exponential backoff
retry 1: wait 1s
retry 2: wait 2s
retry 3: wait 4s
retry 4: wait 8s
...

// Prevents overwhelming failing service
// Gives service time to recover`}
          </CodeBlock>

          <H2>Rate Limiting</H2>
          <P>
            Limit number of requests per user/IP/API key:
          </P>
          <UL>
            <LI><Strong>Token Bucket:</Strong> Refill tokens at fixed rate, consume per request</LI>
            <LI><Strong>Sliding Window:</Strong> Count requests in time window</LI>
            <LI>Return 429 (Too Many Requests) when limit exceeded</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use microservices for large teams, service discovery for dynamic
            environments, rate limiting to prevent abuse.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

