import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpAsynchronismLesson: SystemDesignLesson = {
  id: 'sdp-asynchronism',
  slug: 'sdp-asynchronism',
  title: 'Asynchronous Processing',
  description: 'Learn message queues, producer-consumer pattern, priority queues, dead letter queues, and backpressure.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  stages: [
    {
      id: 'intro-asynchronism',
      type: 'concept',
      title: 'Asynchronous Processing Patterns',
      content: (
        <Section>
          <H1>Asynchronous Processing Patterns</H1>
          <P>
            Asynchronous processing decouples producers and consumers, improving scalability and resilience.
          </P>

          <H2>Message Queues</H2>
          <P>
            Producers send messages to queue, consumers process them asynchronously:
          </P>
          <UL>
            <LI><Strong>Producer:</Strong> Sends message to queue (non-blocking)</LI>
            <LI><Strong>Queue:</Strong> Stores messages (FIFO or priority-based)</LI>
            <LI><Strong>Consumer:</Strong> Processes messages from queue</LI>
          </UL>

          <H2>Producer-Consumer Pattern</H2>
          <Example title="Email Sending Queue">
            <CodeBlock>
{`// Producer (API endpoint)
POST /send-email
{
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "..."
}

// Add to queue (non-blocking, fast response)
queue.enqueue(email_task)
return {status: "queued"}

// Consumer (background worker)
while True:
    task = queue.dequeue()
    send_email(task)
    queue.ack(task)`}
            </CodeBlock>
          </Example>

          <H2>Priority Queues</H2>
          <P>
            Process high-priority messages first:
          </P>
          <UL>
            <LI>Urgent emails processed before regular emails</LI>
            <LI>Payment processing before analytics</LI>
            <LI>Use multiple queues or priority field</LI>
          </UL>

          <H2>Dead Letter Queue (DLQ)</H2>
          <P>
            Store messages that failed processing after retries:
          </P>
          <UL>
            <LI>Message fails after 3 retries → Move to DLQ</LI>
            <LI>Admin can inspect and reprocess DLQ messages</LI>
            <LI>Prevents queue from being blocked by bad messages</LI>
          </UL>

          <H2>Backpressure</H2>
          <P>
            When consumer is slower than producer, apply backpressure:
          </P>
          <UL>
            <LI>Producer slows down or stops producing</LI>
            <LI>Queue size limit: Reject new messages when queue full</LI>
            <LI>Prevents memory exhaustion</LI>
            <LI>Example: Kafka consumer lag monitoring</LI>
          </UL>

          <KeyPoint>
            <Strong>Use Queues:</Strong> For time-consuming tasks (emails, image processing, analytics),
            to decouple services, and to handle traffic spikes.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

