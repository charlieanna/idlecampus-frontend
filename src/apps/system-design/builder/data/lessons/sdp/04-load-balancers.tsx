import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpLoadBalancersLesson: SystemDesignLesson = {
  id: 'sdp-load-balancers',
  slug: 'sdp-load-balancers',
  title: 'Load Balancers',
  description: 'Learn load balancing strategies: Layer 4 vs Layer 7, algorithms, health checks, and session affinity.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  stages: [
    {
      id: 'intro-load-balancers',
      type: 'concept',
      title: 'What is a Load Balancer?',
      content: (
        <Section>
          <H1>What is a Load Balancer?</H1>
          <P>
            A <Strong>Load Balancer</Strong> distributes incoming requests across multiple servers to improve
            performance, availability, and scalability.
          </P>

          <H2>Layer 4 (Transport Layer) Load Balancing</H2>
          <P>
            Operates at TCP/UDP level. Routes based on IP address and port. Fast but limited visibility.
          </P>
          <UL>
            <LI>Routes based on source IP, destination IP, ports</LI>
            <LI>No knowledge of HTTP/application layer</LI>
            <LI>Faster (less processing)</LI>
            <LI>Example: AWS Network Load Balancer</LI>
          </UL>

          <H2>Layer 7 (Application Layer) Load Balancing</H2>
          <P>
            Operates at HTTP/HTTPS level. Routes based on URL path, headers, cookies. More intelligent routing.
          </P>
          <UL>
            <LI>Routes based on URL path, HTTP headers, cookies</LI>
            <LI>Can do SSL termination, content-based routing</LI>
            <LI>Slower (more processing) but more flexible</LI>
            <LI>Example: AWS Application Load Balancer, NGINX</LI>
          </UL>

          <ComparisonTable
            headers={['Aspect', 'Layer 4', 'Layer 7']}
            rows={[
              ['OSI Layer', 'Transport (TCP/UDP)', 'Application (HTTP)'],
              ['Routing', 'IP + Port', 'URL, Headers, Cookies'],
              ['Performance', 'Faster', 'Slower'],
              ['Flexibility', 'Limited', 'High'],
              ['SSL Termination', 'No', 'Yes'],
              ['Use Case', 'High throughput', 'Content-based routing'],
            ]}
          />

          <H2>Load Balancing Algorithms</H2>
          <UL>
            <LI><Strong>Round Robin:</Strong> Distribute requests sequentially (1→2→3→1→2→3)</LI>
            <LI><Strong>Least Connections:</Strong> Route to server with fewest active connections</LI>
            <LI><Strong>IP Hash:</Strong> Hash client IP to always route to same server (session affinity)</LI>
            <LI><Strong>Weighted Round Robin:</Strong> Round robin with different weights per server</LI>
            <LI><Strong>Least Response Time:</Strong> Route to server with lowest latency</LI>
          </UL>

          <H2>Health Checks</H2>
          <P>
            Load balancer periodically checks if servers are healthy:
          </P>
          <UL>
            <LI>Send HTTP request to /health endpoint</LI>
            <LI>If server fails health check, remove from pool</LI>
            <LI>When server recovers, add back to pool</LI>
            <LI>Prevents routing to unhealthy servers</LI>
          </UL>

          <H2>Session Affinity (Sticky Sessions)</H2>
          <P>
            Route same user to same server to maintain session state:
          </P>
          <UL>
            <LI>Use IP hash or cookie-based routing</LI>
            <LI>Needed when session stored in server memory</LI>
            <LI>Trade-off: Less flexible (can't easily scale down)</LI>
            <LI>Better: Store session in Redis (stateless servers)</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use Layer 7 for application routing, Layer 4 for high throughput.
            Keep servers stateless (session in Redis) to avoid sticky sessions.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

