import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCommunicationLesson: SystemDesignLesson = {
  id: 'sdp-communication',
  slug: 'sdp-communication',
  title: 'Communication Protocols',
  description: 'Learn HTTP, gRPC, GraphQL, WebSocket, and API design patterns.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  stages: [
    {
      id: 'intro-communication',
      type: 'concept',
      title: 'Communication Protocols & APIs',
      content: (
        <Section>
          <H1>Communication Protocols & APIs</H1>
          <P>
            Different protocols optimize for different use cases. Choose based on requirements.
          </P>

          <H2>HTTP/HTTPS</H2>
          <UL>
            <LI><Strong>HTTP/1.1:</Strong> Text-based, one request per connection</LI>
            <LI><Strong>HTTP/2:</Strong> Binary, multiplexing (multiple requests per connection), header compression</LI>
            <LI><Strong>HTTP/3:</Strong> Uses QUIC (UDP-based), faster connection establishment</LI>
            <LI>Stateless, request-response model</LI>
          </UL>

          <H2>RESTful API Design</H2>
          <P>
            REST principles for designing HTTP APIs:
          </P>
          <UL>
            <LI>Use HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)</LI>
            <LI>Resource-based URLs: /users/123, /users/123/posts</LI>
            <LI>Stateless: Each request contains all needed information</LI>
            <LI>Use status codes: 200 (OK), 201 (Created), 404 (Not Found), 500 (Error)</LI>
          </UL>

          <H2>gRPC</H2>
          <P>
            Google's RPC framework using Protocol Buffers:
          </P>
          <UL>
            <LI>Binary protocol (faster than JSON)</LI>
            <LI>HTTP/2 based (multiplexing)</LI>
            <LI>Strong typing (schema-first)</LI>
            <LI>Streaming support (client/server/bidirectional)</LI>
            <LI>Use for microservices communication</LI>
          </UL>

          <H2>GraphQL</H2>
          <P>
            Query language for APIs - clients request exactly what they need:
          </P>
          <CodeBlock>
{`// Client requests only needed fields
query {
  user(id: 123) {
    name
    email
    posts {
      title
    }
  }
}

// Server returns only requested data
// No over-fetching or under-fetching`}
          </CodeBlock>
          <UL>
            <LI><Strong>Pros:</Strong> Flexible queries, single endpoint, no versioning needed</LI>
            <LI><Strong>Cons:</Strong> Complex queries can be slow, caching harder</LI>
          </UL>

          <H2>WebSocket</H2>
          <P>
            Persistent, bidirectional connection for real-time communication:
          </P>
          <UL>
            <LI>Full-duplex communication (both sides can send)</LI>
            <LI>Lower overhead than HTTP polling</LI>
            <LI>Use for chat, notifications, real-time updates</LI>
            <LI>Maintains connection state (more complex than HTTP)</LI>
          </UL>

          <ComparisonTable
            headers={['Protocol', 'Use Case', 'Performance']}
            rows={[
              ['REST/HTTP', 'General APIs', 'Good'],
              ['gRPC', 'Microservices', 'Excellent'],
              ['GraphQL', 'Flexible queries', 'Good'],
              ['WebSocket', 'Real-time', 'Excellent'],
            ]}
          />

          <KeyPoint>
            <Strong>Choose:</Strong> REST for general APIs, gRPC for microservices, GraphQL for flexible queries,
            WebSocket for real-time communication.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

