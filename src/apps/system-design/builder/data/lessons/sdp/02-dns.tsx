import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpDnsLesson: SystemDesignLesson = {
  id: 'sdp-dns',
  slug: 'sdp-dns',
  title: 'DNS (Domain Name System)',
  description: 'Learn how DNS works: name resolution, caching, load balancing, and geo-routing.',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 40,
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
  ],
};

