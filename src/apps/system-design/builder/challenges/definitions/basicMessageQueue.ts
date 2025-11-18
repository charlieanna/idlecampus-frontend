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

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional
import time
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

# In-memory storage (naive implementation)
queues = {}
messages = {}
consumers = {}

def create_queue(queue_id: str, name: str) -> Dict:
    """
    Create a message queue
    Naive implementation - stores queue in memory
    """
    queues[queue_id] = {
        'id': queue_id,
        'name': name,
        'message_count': 0,
        'consumer_count': 0,
        'created_at': datetime.now()
    }
    return queues[queue_id]

def publish_message(message_id: str, queue_id: str, payload: str) -> Dict:
    """
    Publish message to queue with durability
    Naive implementation - stores message, no actual durability
    """
    messages[message_id] = {
        'id': message_id,
        'queue_id': queue_id,
        'payload': payload,
        'status': 'pending',
        'retry_count': 0,
        'created_at': datetime.now()
    }

    queue = queues.get(queue_id)
    if queue:
        queue['message_count'] += 1

    return messages[message_id]

def consume_message(queue_id: str, consumer_id: str) -> Optional[Dict]:
    """
    Consume message from queue (supports multiple consumers for parallel processing)
    Naive implementation - returns first pending message
    """
    # Find first pending message
    for message in messages.values():
        if message['queue_id'] == queue_id and message['status'] == 'pending':
            message['status'] = 'processing'
            message['consumer_id'] = consumer_id
            message['processing_at'] = datetime.now()
            return message
    return None

def acknowledge_message(message_id: str) -> Dict:
    """
    Acknowledge message processing (removes from queue)
    Naive implementation - marks as completed
    """
    message = messages.get(message_id)
    if not message:
        raise ValueError("Message not found")

    message['status'] = 'completed'
    message['completed_at'] = datetime.now()

    # Decrement queue message count
    queue = queues.get(message['queue_id'])
    if queue:
        queue['message_count'] -= 1

    return message

def retry_message(message_id: str) -> Dict:
    """
    Retry failed message
    Naive implementation - increments retry count and marks as pending
    """
    message = messages.get(message_id)
    if not message:
        raise ValueError("Message not found")

    message['retry_count'] += 1
    message['status'] = 'pending'
    message['retried_at'] = datetime.now()
    return message

def get_queue_stats(queue_id: str) -> Dict:
    """
    Get queue statistics
    Naive implementation - counts messages by status
    """
    pending = 0
    processing = 0
    completed = 0

    for message in messages.values():
        if message['queue_id'] == queue_id:
            if message['status'] == 'pending':
                pending += 1
            elif message['status'] == 'processing':
                processing += 1
            elif message['status'] == 'completed':
                completed += 1

    return {
        'queue_id': queue_id,
        'pending': pending,
        'processing': processing,
        'completed': completed
    }
`,
};

// Auto-generate code challenges from functional requirements
(basicMessageQueueProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicMessageQueueProblemDefinition);
