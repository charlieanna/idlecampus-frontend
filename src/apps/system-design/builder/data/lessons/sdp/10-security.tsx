import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpSecurityLesson: SystemDesignLesson = {
  id: 'sdp-security',
  slug: 'sdp-security',
  title: 'Security Fundamentals',
  description: 'Learn HTTPS/TLS, authentication, authorization, OAuth, and common vulnerabilities (SQL injection, XSS, CSRF).',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 55,
  stages: [
    {
      id: 'intro-security',
      type: 'concept',
      title: 'Security Fundamentals',
      content: (
        <Section>
          <H1>Security Fundamentals</H1>
          <P>
            Security is critical for protecting user data and preventing attacks.
          </P>

          <H2>HTTPS/TLS</H2>
          <P>
            Encrypts data in transit between client and server:
          </P>
          <UL>
            <LI>Prevents man-in-the-middle attacks</LI>
            <LI>Encrypts HTTP traffic using TLS</LI>
            <LI>Requires SSL certificate (validated by CA)</LI>
            <LI>Use for all sensitive data (passwords, payment info)</LI>
          </UL>

          <H2>Authentication vs Authorization</H2>
          <UL>
            <LI><Strong>Authentication:</Strong> "Who are you?" - Verifies user identity (login)</LI>
            <LI><Strong>Authorization:</Strong> "What can you do?" - Checks user permissions (access control)</LI>
          </UL>

          <H2>OAuth 2.0</H2>
          <P>
            Standard protocol for authorization (not authentication):
          </P>
          <OL>
            <LI>User clicks "Login with Google"</LI>
            <LI>Redirected to Google for authentication</LI>
            <LI>Google returns authorization code</LI>
            <LI>App exchanges code for access token</LI>
            <LI>App uses token to access user's Google data</LI>
          </OL>

          <H2>Common Vulnerabilities</H2>
          <H3>SQL Injection</H3>
          <P>
            Attacker injects malicious SQL code:
          </P>
          <CodeBlock>
{`// VULNERABLE
query = "SELECT * FROM users WHERE id = " + user_input
// If user_input = "1 OR 1=1", deletes all users!

// SAFE (Parameterized queries)
query = "SELECT * FROM users WHERE id = ?"
execute(query, [user_input])`}
          </CodeBlock>

          <H3>XSS (Cross-Site Scripting)</H3>
          <P>
            Attacker injects malicious JavaScript:
          </P>
          <UL>
            <LI>Sanitize user input</LI>
            <LI>Escape HTML/JavaScript in output</LI>
            <LI>Use Content Security Policy (CSP)</LI>
          </UL>

          <H3>CSRF (Cross-Site Request Forgery)</H3>
          <P>
            Attacker tricks user into making unwanted requests:
          </P>
          <UL>
            <LI>Use CSRF tokens</LI>
            <LI>Check Origin/Referer headers</LI>
            <LI>SameSite cookie attribute</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Always use HTTPS, validate and sanitize input, use parameterized queries,
            implement proper authentication and authorization.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

