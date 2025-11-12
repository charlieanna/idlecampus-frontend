import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Basic Message Queue - Pub/Sub with RabbitMQ
 * From extracted-problems/system-design/streaming.md
 */
export const basicMessageQueueProblemDefinition: ProblemDefinition = {
  id: 'basic-message-queue',
  title: 'Basic Message Queue',
  description: `Design a basic message queue system that:
- Publishes messages to queues with durability
- Supports multiple consumers for parallel processing
- Handles message acknowledgments and retries
- Implements reliable async message processing
- Handles 5k messages/sec`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to publish messages',
      },
      {
        type: 'message_queue',
        reason: 'Need queue for reliable async messaging',
      },
      {
        type: 'compute',
        reason: 'Need worker instances to consume messages',
      },
      {
        type: 'load_balancer',
        reason: 'Need to distribute producer traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Producers send messages through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to publisher API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Publishers send messages to queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers consume messages from queue',
      },
    ],
    dataModel: {
      entities: ['message', 'queue', 'consumer'],
      fields: {
        message: ['id', 'queue_id', 'payload', 'status', 'retry_count', 'created_at'],
        queue: ['id', 'name', 'message_count', 'consumer_count'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Publishing messages
        { type: 'read_by_key', frequency: 'very_high' }, // Consuming messages
      ],
    },
  },

  scenarios: generateScenarios('basic-message-queue', problemConfigs['basic-message-queue']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
