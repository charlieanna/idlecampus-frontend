import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Streaming Problems (Auto-generated)
 * Generated from extracted-problems/system-design/streaming.md
 */

/**
 * Click Stream Analytics
 * From extracted-problems/system-design/streaming.md
 */
export const clickstreamAnalyticsProblemDefinition: ProblemDefinition = {
  id: 'clickstream-analytics',
  title: 'Click Stream Analytics',
  description: `Create a clickstream analytics pipeline to track user interactions. Learn about event collection, sessionization, and real-time analytics.
- Collect click events from web/mobile
- Track page views and interactions
- Sessionize user activity
- Generate real-time metrics`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web/Mobile (redirect_client) for track user clicks and behavior',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Collectors (cdn) for track user clicks and behavior',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for track user clicks and behavior',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for track user clicks and behavior',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Web/Mobile routes to Edge Collectors',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Collectors routes to Ingest API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ingest API routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Sessionizer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Sessionizer routes to Analytics DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('clickstream-analytics', problemConfigs['clickstream-analytics']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Server Log Aggregation
 * From extracted-problems/system-design/streaming.md
 */
export const serverLogAggregationProblemDefinition: ProblemDefinition = {
  id: 'server-log-aggregation',
  title: 'Server Log Aggregation',
  description: `Aggregate logs from thousands of servers into a central system. Learn about log shipping, parsing, indexing, and monitoring.
- Ship logs from many servers
- Parse different log formats
- Index for fast searching
- Alert on error patterns`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Servers (redirect_client) for centralize server logs',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Buffer (stream) for centralize server logs',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for centralize server logs',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'App Servers routes to Filebeat',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Filebeat routes to Kafka Buffer',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka Buffer routes to Logstash',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Logstash routes to Elasticsearch',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('server-log-aggregation', problemConfigs['server-log-aggregation']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Sensor Data Collection
 * From extracted-problems/system-design/streaming.md
 */
export const sensorDataCollectionProblemDefinition: ProblemDefinition = {
  id: 'sensor-data-collection',
  title: 'Sensor Data Collection',
  description: `Build an IoT data collection pipeline for sensor telemetry. Learn about time-series data, downsampling, and handling device connectivity.
- Ingest from millions of sensors
- Handle intermittent connectivity
- Store time-series data efficiently
- Support data aggregation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Sensors (redirect_client) for iot sensor telemetry',
      },
      {
        type: 'load_balancer',
        reason: 'Need MQTT Gateway (lb) for iot sensor telemetry',
      },
      {
        type: 'message_queue',
        reason: 'Need Telemetry Stream (stream) for iot sensor telemetry',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for iot sensor telemetry',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Sensors routes to MQTT Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'MQTT Gateway routes to Ingest Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ingest Service routes to Telemetry Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Downsampler',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Downsampler routes to TimescaleDB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('sensor-data-collection', problemConfigs['sensor-data-collection']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Email Queue System
 * From extracted-problems/system-design/streaming.md
 */
export const emailQueueSystemProblemDefinition: ProblemDefinition = {
  id: 'email-queue-system',
  title: 'Email Queue System',
  description: `Design an email delivery queue system for transactional and marketing emails. Learn about rate limiting, retries, and bounce handling.
- Queue emails for delivery
- Rate limit per domain
- Retry failed deliveries
- Handle bounces and complaints`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for asynchronous email delivery',
      },
      {
        type: 'message_queue',
        reason: 'Need Priority Queue (queue) for asynchronous email delivery',
      },
      {
        type: 'storage',
        reason: 'Need Status DB (db_primary) for asynchronous email delivery',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Applications routes to Email API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Email API routes to Priority Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Email API routes to Bulk Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Priority Queue routes to Sender Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Bulk Queue routes to Sender Workers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Sender Workers routes to Status DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('email-queue-system', problemConfigs['email-queue-system']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Event Sourcing Basics
 * From extracted-problems/system-design/streaming.md
 */
export const eventSourcingBasicProblemDefinition: ProblemDefinition = {
  id: 'event-sourcing-basic',
  title: 'Event Sourcing Basics',
  description: `Learn event sourcing by building an order management system that stores events instead of current state. Understand event replay, projections, and CQRS basics.
- Store all state changes as events
- Rebuild state from event log
- Create read projections
- Support event replay`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Order Service (redirect_client) for store events instead of state',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (stream) for store events instead of state',
      },
      {
        type: 'storage',
        reason: 'Need Event Store (db_primary) for store events instead of state',
      },
      {
        type: 'cache',
        reason: 'Need Read Models (cache) for store events instead of state',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Command API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Command API routes to Event Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event Log routes to Event Store',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event Log routes to Projection Builder',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Projection Builder routes to Read Models',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Command API routes to Read Models',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('event-sourcing-basic', problemConfigs['event-sourcing-basic']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Order Processing Stream
 * From extracted-problems/system-design/streaming.md
 */
export const orderProcessingStreamProblemDefinition: ProblemDefinition = {
  id: 'order-processing-stream',
  title: 'Order Processing Stream',
  description: `Design an Amazon-scale order processing system handling 100M orders/day (1B during Prime Day). Must coordinate inventory across 500+ fulfillment centers, process payments with <500ms latency, survive payment provider failures, and maintain perfect order accuracy. Support distributed sagas, real-time fraud detection, same-day delivery orchestration, and operate within $100M/month budget.
- Process 100M orders/day (1B during Prime Day)
- Coordinate inventory across 500+ fulfillment centers
- Distributed saga pattern for multi-step transactions
- Real-time fraud detection on all orders`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Customers (redirect_client) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'message_queue',
        reason: 'Need Order Events (stream) for amazon-scale 100m orders/day processing',
      },
      {
        type: 'storage',
        reason: 'Need Order DB (db_primary) for amazon-scale 100m orders/day processing',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Customers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Order API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order API routes to Order Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Inventory',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Payment',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Events routes to Fulfillment',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Inventory routes to Order DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Payment routes to Order DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Fulfillment routes to Order DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('order-processing-stream', problemConfigs['order-processing-stream']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Payment Transaction Log
 * From extracted-problems/system-design/streaming.md
 */
export const paymentTransactionLogProblemDefinition: ProblemDefinition = {
  id: 'payment-transaction-log',
  title: 'Payment Transaction Log',
  description: `Design a Visa/Mastercard-scale payment system processing 50B transactions/day globally with <10ms P99 latency. Must handle Black Friday spikes (500B transactions), maintain perfect financial accuracy, survive entire continent failures, and meet PCI-DSS compliance. Support real-time settlement across 10k+ banks, fraud detection on every transaction, and operate within $200M/month budget while ensuring zero financial loss.
- Process 50B transactions/day (500B during Black Friday)
- Real-time settlement with 10k+ banks globally
- Immutable audit trail with 10-year retention
- Real-time fraud detection with <10ms latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Payment Requests (redirect_client) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Log (stream) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'cache',
        reason: 'Need Transaction Cache (cache) for visa/mastercard-scale 50b transactions/day',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Payment Requests routes to Payment Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Payment Gateway routes to Transaction Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Log routes to Fraud Detector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Transaction Log routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Fraud Detector routes to Transaction Cache',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('payment-transaction-log', problemConfigs['payment-transaction-log']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Stock Price Updates
 * From extracted-problems/system-design/streaming.md
 */
export const stockPriceUpdatesProblemDefinition: ProblemDefinition = {
  id: 'stock-price-updates',
  title: 'Stock Price Updates',
  description: `Stream real-time stock price updates to traders and systems. Learn about low-latency distribution, market data protocols, and fan-out patterns.
- Stream tick-by-tick price data
- Support thousands of symbols
- Enable subscription filtering
- Provide historical replay`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Exchanges (redirect_client) for real-time market data feed',
      },
      {
        type: 'message_queue',
        reason: 'Need Price Stream (stream) for real-time market data feed',
      },
      {
        type: 'cache',
        reason: 'Need Last Price Cache (cache) for real-time market data feed',
      },
      {
        type: 'storage',
        reason: 'Need Tick DB (db_primary) for real-time market data feed',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Exchanges routes to Feed Handler',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Feed Handler routes to Price Stream',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Price Stream routes to Last Price Cache',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Price Stream routes to WebSocket Servers',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Price Stream routes to Tick DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('stock-price-updates', problemConfigs['stock-price-updates']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Social Media Feed
 * From extracted-problems/system-design/streaming.md
 */
export const socialMediaFeedProblemDefinition: ProblemDefinition = {
  id: 'social-media-feed',
  title: 'Social Media Feed',
  description: `Generate personalized social media feeds with posts from followed users. Learn about fan-out patterns, feed ranking, and real-time updates.
- Aggregate posts from followees
- Rank by relevance and recency
- Support real-time updates
- Handle viral content efficiently`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Users (redirect_client) for twitter/instagram feed generation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for twitter/instagram feed generation',
      },
      {
        type: 'cache',
        reason: 'Need Feed Cache (cache) for twitter/instagram feed generation',
      },
      {
        type: 'message_queue',
        reason: 'Need Post Stream (stream) for twitter/instagram feed generation',
      },
      {
        type: 'storage',
        reason: 'Need Social Graph (db_primary) for twitter/instagram feed generation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'App Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Feed API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feed API routes to Feed Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Feed API routes to Post Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Post Stream routes to Feed Builder',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feed Builder routes to Feed Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feed Builder routes to Social Graph',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('social-media-feed', problemConfigs['social-media-feed']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Video Upload Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const videoUploadPipelineProblemDefinition: ProblemDefinition = {
  id: 'video-upload-pipeline',
  title: 'Video Upload Pipeline',
  description: `Design a YouTube-scale video processing pipeline handling 500k hours of uploads daily (2M during viral events). Must transcode to 20+ formats in <2 minutes for 4K videos, support live streaming to 100M viewers, survive datacenter failures, and operate within $50M/month budget. Include ML content moderation, automatic quality optimization, and copyright detection across 1B+ reference videos.
- Process 500k hours of video daily (2M during viral events)
- Transcode to 20+ formats in <2min for 4K videos
- Support 100M concurrent live stream viewers
- ML-based content moderation and copyright detection`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Content Creators (redirect_client) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'cdn',
        reason: 'Need Upload CDN (cdn) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'message_queue',
        reason: 'Need Job Queue (queue) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'object_storage',
        reason: 'Need Object Storage (db_primary) for youtube-scale 500k hours/day processing',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Content Creators routes to Upload CDN',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'Upload CDN routes to Upload API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Upload API routes to Job Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Job Queue routes to Transcoders',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Job Queue routes to Thumbnail Gen',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Transcoders routes to Object Storage',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Thumbnail Gen routes to Object Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transcoders routes to Completion Events',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('video-upload-pipeline', problemConfigs['video-upload-pipeline']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Fraud Detection Stream
 * From extracted-problems/system-design/streaming.md
 */
export const fraudDetectionStreamProblemDefinition: ProblemDefinition = {
  id: 'fraud-detection-stream',
  title: 'Fraud Detection Stream',
  description: `Design a PayPal/Stripe-scale fraud detection system processing 10M transactions/sec globally with <5ms P99 latency. Must handle Black Friday spikes (100M TPS), detect sophisticated fraud rings using graph analysis, survive entire region failures, and maintain <0.01% false positive rate. Support 1000+ ML models, real-time feature computation across 100B+ historical transactions, and operate within $5M/month budget.
- Process 10M transactions/sec (100M during Black Friday)
- Score with <5ms P99 latency using 1000+ ML models
- Graph analysis for fraud ring detection across 1B+ entities
- Real-time feature computation from 100B+ transaction history`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Transactions (redirect_client) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Stream (stream) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'cache',
        reason: 'Need Feature Store (cache) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'storage',
        reason: 'Need Fraud DB (db_primary) for paypal/stripe-scale fraud detection at 10m tps',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transactions routes to Transaction API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Transaction API routes to Transaction Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Transaction Stream routes to Fraud Scorer',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Fraud Scorer routes to Feature Store',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Fraud Scorer routes to Fraud DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('fraud-detection-stream', problemConfigs['fraud-detection-stream']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * User Activity Tracking
 * From extracted-problems/system-design/streaming.md
 */
export const userActivityTrackingProblemDefinition: ProblemDefinition = {
  id: 'user-activity-tracking',
  title: 'User Activity Tracking',
  description: `Create a user activity tracking system for product analytics. Learn about event schemas, user profiles, funnels, and cohort analysis.
- Track user events across platforms
- Build user profiles
- Calculate funnel metrics
- Segment users into cohorts`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile/Web Apps (redirect_client) for track user behavior across app',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Collectors (cdn) for track user behavior across app',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for track user behavior across app',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for track user behavior across app',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Mobile/Web Apps routes to Edge Collectors',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Collectors routes to Tracking API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tracking API routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Profile Builder',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Metric Aggregator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile Builder routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Metric Aggregator routes to Analytics DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('user-activity-tracking', problemConfigs['user-activity-tracking']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * IoT Telemetry Aggregation
 * From extracted-problems/system-design/streaming.md
 */
export const iotTelemetryAggregationProblemDefinition: ProblemDefinition = {
  id: 'iot-telemetry-aggregation',
  title: 'IoT Telemetry Aggregation',
  description: `Design a Tesla/AWS IoT-scale platform handling 100M messages/sec from 1B+ devices globally. Must handle entire fleet OTA updates (10x traffic), maintain <100ms P99 latency for critical telemetry, survive multiple region failures, and detect anomalies across millions of autonomous vehicles. Support edge computing, real-time ML inference, and operate within $10M/month budget while processing 10PB daily telemetry.
- Ingest 100M messages/sec from 1B+ devices (1B during OTA)
- Real-time anomaly detection across fleet with ML models
- Edge computing for 100ms decision making in vehicles
- Support OTA updates to entire fleet within 1 hour`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Devices (redirect_client) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'load_balancer',
        reason: 'Need MQTT Broker (lb) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'message_queue',
        reason: 'Need Telemetry Stream (stream) for tesla/aws-scale iot with 1b+ devices',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for tesla/aws-scale iot with 1b+ devices',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Devices routes to MQTT Broker',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'MQTT Broker routes to Gateway Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Gateway Service routes to Telemetry Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Aggregators',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Anomaly Detector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregators routes to TimescaleDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Anomaly Detector routes to TimescaleDB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('iot-telemetry-aggregation', problemConfigs['iot-telemetry-aggregation']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Game Event Processing
 * From extracted-problems/system-design/streaming.md
 */
export const gameEventProcessingProblemDefinition: ProblemDefinition = {
  id: 'game-event-processing',
  title: 'Game Event Processing',
  description: `Process game events for leaderboards, achievements, and analytics. Learn about high-volume event processing, state management, and real-time rankings.
- Process player actions in real-time
- Update leaderboards
- Award achievements
- Detect cheating`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Clients (redirect_client) for process game telemetry events',
      },
      {
        type: 'load_balancer',
        reason: 'Need Game LB (lb) for process game telemetry events',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for process game telemetry events',
      },
      {
        type: 'cache',
        reason: 'Need Leaderboard Cache (cache) for process game telemetry events',
      },
      {
        type: 'storage',
        reason: 'Need Player DB (db_primary) for process game telemetry events',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Game Clients routes to Game LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Game LB routes to Game Servers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Game Servers routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Event Processor',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Event Processor routes to Leaderboard Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Event Processor routes to Player DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('game-event-processing', problemConfigs['game-event-processing']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Delivery Tracking Updates
 * From extracted-problems/system-design/streaming.md
 */
export const deliveryTrackingUpdatesProblemDefinition: ProblemDefinition = {
  id: 'delivery-tracking-updates',
  title: 'Delivery Tracking Updates',
  description: `Stream delivery location updates and ETAs to customers. Learn about geospatial tracking, ETA calculation, and notification triggers.
- Track package locations
- Calculate real-time ETAs
- Notify on status changes
- Handle route updates`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Delivery Drivers (redirect_client) for track package locations in real-time',
      },
      {
        type: 'message_queue',
        reason: 'Need Location Stream (stream) for track package locations in real-time',
      },
      {
        type: 'cache',
        reason: 'Need Location Cache (cache) for track package locations in real-time',
      },
      {
        type: 'storage',
        reason: 'Need Delivery DB (db_primary) for track package locations in real-time',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Delivery Drivers routes to Tracking API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tracking API routes to Location Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Location Stream routes to ETA Calculator',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Location Stream routes to Location Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'ETA Calculator routes to Delivery DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('delivery-tracking-updates', problemConfigs['delivery-tracking-updates']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Notification Fan-out
 * From extracted-problems/system-design/streaming.md
 */
export const notificationFanoutProblemDefinition: ProblemDefinition = {
  id: 'notification-fanout',
  title: 'Notification Fan-out',
  description: `Fan out notifications to millions of users across multiple channels (email, push, SMS). Learn about channel preferences, batching, and rate limiting.
- Support multiple channels
- Respect user preferences
- Batch similar notifications
- Rate limit per channel`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for broadcast notifications to millions',
      },
      {
        type: 'message_queue',
        reason: 'Need Fanout Stream (stream) for broadcast notifications to millions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Services routes to Notification API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Notification API routes to Fanout Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Fanout Stream routes to Fanout Worker',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to Email Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to Push Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fanout Worker routes to SMS Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Email Queue routes to Delivery Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Push Queue routes to Delivery Workers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'SMS Queue routes to Delivery Workers',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('notification-fanout', problemConfigs['notification-fanout']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Content Moderation Queue
 * From extracted-problems/system-design/streaming.md
 */
export const contentModerationQueueProblemDefinition: ProblemDefinition = {
  id: 'content-moderation-queue',
  title: 'Content Moderation Queue',
  description: `Queue and process user-generated content through automated and human moderation. Learn about prioritization, SLA management, and feedback loops.
- Queue content for review
- Apply automated filters
- Route to human moderators
- Prioritize by urgency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Content Creators (redirect_client) for moderate user-generated content',
      },
      {
        type: 'message_queue',
        reason: 'Need Content Stream (stream) for moderate user-generated content',
      },
      {
        type: 'storage',
        reason: 'Need Content DB (db_primary) for moderate user-generated content',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Content Creators routes to Upload API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Upload API routes to Content Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Content Stream routes to ML Classifier',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to High Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to Medium Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Classifier routes to Low Priority',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'High Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Medium Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Low Priority routes to Moderator UI',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Moderator UI routes to Content DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('content-moderation-queue', problemConfigs['content-moderation-queue']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Index Updates
 * From extracted-problems/system-design/streaming.md
 */
export const searchIndexUpdatesProblemDefinition: ProblemDefinition = {
  id: 'search-index-updates',
  title: 'Search Index Updates',
  description: `Stream document changes to search indexes in near real-time. Learn about incremental indexing, consistency, and search ranking updates.
- Stream document changes
- Update indexes incrementally
- Maintain search consistency
- Reindex on schema changes`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for real-time search index maintenance',
      },
      {
        type: 'storage',
        reason: 'Need Source DB (db_primary) for real-time search index maintenance',
      },
      {
        type: 'message_queue',
        reason: 'Need Change Stream (stream) for real-time search index maintenance',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Services routes to Document API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Document API routes to Source DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Source DB routes to Change Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Change Stream routes to Index Workers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Index Workers routes to Elasticsearch',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('search-index-updates', problemConfigs['search-index-updates']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Recommendation Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const recommendationPipelineProblemDefinition: ProblemDefinition = {
  id: 'recommendation-pipeline',
  title: 'Recommendation Pipeline',
  description: `Build a recommendation pipeline using user activity streams and ML models. Learn about feature extraction, model serving, and A/B testing.
- Track user interactions
- Extract behavioral features
- Serve ML recommendations
- A/B test models`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Users (redirect_client) for netflix-style recommendations',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for netflix-style recommendations',
      },
      {
        type: 'cache',
        reason: 'Need Recommendation Cache (cache) for netflix-style recommendations',
      },
      {
        type: 'message_queue',
        reason: 'Need Activity Stream (stream) for netflix-style recommendations',
      },
      {
        type: 'storage',
        reason: 'Need Feature Store (db_primary) for netflix-style recommendations',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'App Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Recommendation API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Recommendation API routes to Recommendation Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Recommendation API routes to Activity Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Activity Stream routes to ML Serving',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'ML Serving routes to Recommendation Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Serving routes to Feature Store',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('recommendation-pipeline', problemConfigs['recommendation-pipeline']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Audit Log Streaming
 * From extracted-problems/system-design/streaming.md
 */
export const auditLogStreamingProblemDefinition: ProblemDefinition = {
  id: 'audit-log-streaming',
  title: 'Audit Log Streaming',
  description: `Stream audit logs for compliance and security monitoring. Learn about immutability, encryption, retention policies, and log correlation.
- Capture all system actions
- Ensure log immutability
- Encrypt sensitive data
- Support compliance queries`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need All Services (redirect_client) for compliance audit trail',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Stream (stream) for compliance audit trail',
      },
      {
        type: 'storage',
        reason: 'Need Hot Storage (db_primary) for compliance audit trail',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'All Services routes to Audit Collector',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Audit Collector routes to Audit Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Audit Stream routes to Log Processor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Audit Stream routes to Anomaly Detector',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Log Processor routes to Hot Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Log Processor routes to Cold Archive',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('audit-log-streaming', problemConfigs['audit-log-streaming']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Kafka Streaming Pipeline
 * From extracted-problems/system-design/streaming.md
 */
export const kafkaStreamingPipelineProblemDefinition: ProblemDefinition = {
  id: 'kafka-streaming-pipeline',
  title: 'Kafka Streaming Pipeline',
  description: `Design a Kafka-based streaming pipeline processing billions of events daily. Learn about partitioning strategies, consumer groups, exactly-once semantics, and stream processing with Kafka Streams.
- Ingest 1B events per day
- Process with exactly-once semantics
- Support stream joins and aggregations
- Handle late-arriving data`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Event Producers (redirect_client) for process billions of events with kafka',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Cluster (stream) for process billions of events with kafka',
      },
      {
        type: 'cache',
        reason: 'Need State Store (cache) for process billions of events with kafka',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for process billions of events with kafka',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event Producers routes to Producer API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producer API routes to Kafka Cluster',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Kafka Cluster routes to Stream Processor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka Cluster routes to Analytics Engine',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Stream Processor routes to State Store',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Analytics Engine routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Analytics Engine routes to State Store',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('kafka-streaming-pipeline', problemConfigs['kafka-streaming-pipeline']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Exactly-Once Payment Processing
 * From extracted-problems/system-design/streaming.md
 */
export const exactlyOncePaymentProblemDefinition: ProblemDefinition = {
  id: 'exactly-once-payment',
  title: 'Exactly-Once Payment Processing',
  description: `Implement exactly-once payment processing across distributed systems. Learn about idempotency keys, distributed transactions, and two-phase commit.
- Guarantee exactly-once payment execution
- Handle network failures gracefully
- Support distributed transactions
- Maintain strict ordering`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Payment Requests (redirect_client) for guarantee exactly-once payment semantics',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for guarantee exactly-once payment semantics',
      },
      {
        type: 'cache',
        reason: 'Need Idempotency Cache (cache) for guarantee exactly-once payment semantics',
      },
      {
        type: 'message_queue',
        reason: 'Need Transaction Log (stream) for guarantee exactly-once payment semantics',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for guarantee exactly-once payment semantics',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Payment Requests routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Payment Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Payment Gateway routes to Idempotency Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Payment Gateway routes to Transaction Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Log routes to Coordinators',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinators routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Coordinators routes to Settlement Queue',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('exactly-once-payment', problemConfigs['exactly-once-payment']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Global Event Sourcing
 * From extracted-problems/system-design/streaming.md
 */
export const globalEventSourcingSystemProblemDefinition: ProblemDefinition = {
  id: 'global-event-sourcing-system',
  title: 'Global Event Sourcing',
  description: `Design a globally distributed event sourcing system with regional event stores and cross-region replication. Handle conflicts, maintain causality, and support point-in-time queries globally.
- Store events across regions
- Maintain causal ordering
- Replicate events globally
- Resolve conflicts with CRDTs`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Apps (redirect_client) for distributed event sourcing across continents',
      },
      {
        type: 'cdn',
        reason: 'Need GeoDNS (cdn) for distributed event sourcing across continents',
      },
      {
        type: 'load_balancer',
        reason: 'Need Regional LBs (lb) for distributed event sourcing across continents',
      },
      {
        type: 'message_queue',
        reason: 'Need Regional Stores (stream) for distributed event sourcing across continents',
      },
      {
        type: 'cache',
        reason: 'Need Projections (cache) for distributed event sourcing across continents',
      },
      {
        type: 'storage',
        reason: 'Need Global Catalog (db_primary) for distributed event sourcing across continents',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Apps routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GeoDNS routes to Regional LBs',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Regional LBs routes to Event APIs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Event APIs routes to Regional Stores',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Regional Stores routes to Replicators',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Regional Stores',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Projections',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators routes to Global Catalog',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('global-event-sourcing-system', problemConfigs['global-event-sourcing-system']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-DC Stream Replication
 * From extracted-problems/system-design/streaming.md
 */
export const multiDcStreamReplicationProblemDefinition: ProblemDefinition = {
  id: 'multi-dc-stream-replication',
  title: 'Multi-DC Stream Replication',
  description: `Replicate streaming data across multiple data centers with low latency and high consistency. Handle regional failures, network partitions, and maintain ordering guarantees.
- Replicate streams across DCs
- Maintain message ordering
- Handle DC failures
- Support bidirectional replication`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'message_queue',
        reason: 'Need DC1 Kafka (stream) for replicate streams across data centers',
      },
      {
        type: 'compute',
        reason: 'Need Replicators 1-2 (worker) for replicate streams across data centers',
      },
      {
        type: 'cache',
        reason: 'Need Lag Monitor (cache) for replicate streams across data centers',
      },
      {
        type: 'storage',
        reason: 'Need Metrics DB (db_primary) for replicate streams across data centers',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'DC1 Kafka routes to Replicators 1-2',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Replicators 1-2 routes to DC2 Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'DC2 Kafka routes to Replicators 2-3',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Replicators 2-3 routes to DC3 Kafka',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators 1-2 routes to Lag Monitor',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replicators 2-3 routes to Lag Monitor',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Lag Monitor routes to Health Dashboard',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Health Dashboard routes to Metrics DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('multi-dc-stream-replication', problemConfigs['multi-dc-stream-replication']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time ML Feature Store
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeMlFeatureStoreProblemDefinition: ProblemDefinition = {
  id: 'realtime-ml-feature-store',
  title: 'Real-time ML Feature Store',
  description: `Create a real-time feature store for ML inference with streaming feature computation, low-latency serving, and point-in-time correctness.
- Compute features from streams
- Serve features with <10ms latency
- Maintain point-in-time correctness
- Support feature versioning`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need ML Services (redirect_client) for feature store for online inference',
      },
      {
        type: 'load_balancer',
        reason: 'Need Feature LB (lb) for feature store for online inference',
      },
      {
        type: 'cache',
        reason: 'Need Feature Cache (cache) for feature store for online inference',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for feature store for online inference',
      },
      {
        type: 'storage',
        reason: 'Need Offline Store (db_primary) for feature store for online inference',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'ML Services routes to Feature LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Feature LB routes to Feature API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feature API routes to Feature Cache',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Feature Processors',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Feature Processors routes to Feature Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feature Processors routes to Offline Store',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Feature API routes to Registry',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('realtime-ml-feature-store', problemConfigs['realtime-ml-feature-store']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GDPR-Compliant Event Streaming
 * From extracted-problems/system-design/streaming.md
 */
export const gdprCompliantStreamingProblemDefinition: ProblemDefinition = {
  id: 'gdpr-compliant-streaming',
  title: 'GDPR-Compliant Event Streaming',
  description: `Design an event streaming platform compliant with GDPR and privacy regulations. Handle right to deletion, data anonymization, and consent management in real-time streams.
- Support right to be forgotten
- Anonymize PII in streams
- Track consent across events
- Enable data portability`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for privacy-preserving event streams',
      },
      {
        type: 'cache',
        reason: 'Need Consent Cache (cache) for privacy-preserving event streams',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for privacy-preserving event streams',
      },
      {
        type: 'storage',
        reason: 'Need Audit Log (db_primary) for privacy-preserving event streams',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Services routes to Privacy Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Privacy Gateway routes to Consent Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Privacy Gateway routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Anonymizer',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Anonymizer routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Privacy Gateway routes to Deletion Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Deletion Queue routes to Deletion Worker',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Deletion Worker routes to Event Stream',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('gdpr-compliant-streaming', problemConfigs['gdpr-compliant-streaming']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Financial Settlement Stream
 * From extracted-problems/system-design/streaming.md
 */
export const financialSettlementStreamProblemDefinition: ProblemDefinition = {
  id: 'financial-settlement-stream',
  title: 'Financial Settlement Stream',
  description: `Process financial settlements in real-time with strong consistency, audit trails, and regulatory compliance. Handle reconciliation, disputes, and multi-currency settlements.
- Process settlements in real-time
- Maintain double-entry accounting
- Support multi-currency
- Handle dispute resolution`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Banks/PSPs (redirect_client) for real-time financial settlement',
      },
      {
        type: 'load_balancer',
        reason: 'Need Gateway LB (lb) for real-time financial settlement',
      },
      {
        type: 'message_queue',
        reason: 'Need Settlement Stream (stream) for real-time financial settlement',
      },
      {
        type: 'storage',
        reason: 'Need Ledger DB (db_primary) for real-time financial settlement',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Banks/PSPs routes to Gateway LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Gateway LB routes to Settlement API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Settlement API routes to Validators',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Validators routes to Settlement Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Settlement Stream routes to Processors',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Processors routes to Ledger DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Processors routes to Reconciliation',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('financial-settlement-stream', problemConfigs['financial-settlement-stream']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Autonomous Vehicle Telemetry
 * From extracted-problems/system-design/streaming.md
 */
export const autonomousVehicleTelemetryProblemDefinition: ProblemDefinition = {
  id: 'autonomous-vehicle-telemetry',
  title: 'Autonomous Vehicle Telemetry',
  description: `Stream and process telemetry from autonomous vehicles including sensor data, video, and decision logs. Handle high bandwidth, edge processing, and ML model updates.
- Ingest multi-modal sensor data
- Process video streams
- Log decision traces
- Detect safety events`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need AV Fleet (redirect_client) for process av sensor streams',
      },
      {
        type: 'cdn',
        reason: 'Need Edge Gateways (cdn) for process av sensor streams',
      },
      {
        type: 'message_queue',
        reason: 'Need Safety Stream (stream) for process av sensor streams',
      },
      {
        type: 'storage',
        reason: 'Need Data Lake (db_primary) for process av sensor streams',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'AV Fleet routes to Edge Gateways',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Gateways routes to Edge Processors',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Safety Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Telemetry Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Edge Processors routes to Video Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Safety Stream routes to Safety Monitor',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to ML Pipeline',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Video Stream routes to ML Pipeline',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Pipeline routes to Data Lake',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('autonomous-vehicle-telemetry', problemConfigs['autonomous-vehicle-telemetry']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Healthcare Data Stream (HIPAA)
 * From extracted-problems/system-design/streaming.md
 */
export const healthcareDataStreamHipaaProblemDefinition: ProblemDefinition = {
  id: 'healthcare-data-stream-hipaa',
  title: 'Healthcare Data Stream (HIPAA)',
  description: `Stream patient health data with HIPAA compliance, encryption, access controls, and audit trails. Handle HL7/FHIR formats, clinical workflows, and real-time alerts.
- Stream HL7/FHIR messages
- Encrypt PHI end-to-end
- Enforce access controls
- Audit all data access`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Healthcare Systems (redirect_client) for hipaa-compliant health data streaming',
      },
      {
        type: 'load_balancer',
        reason: 'Need Secure Gateway (lb) for hipaa-compliant health data streaming',
      },
      {
        type: 'message_queue',
        reason: 'Need FHIR Stream (stream) for hipaa-compliant health data streaming',
      },
      {
        type: 'cache',
        reason: 'Need Permissions (cache) for hipaa-compliant health data streaming',
      },
      {
        type: 'storage',
        reason: 'Need Audit Log (db_primary) for hipaa-compliant health data streaming',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Healthcare Systems routes to Secure Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Secure Gateway routes to Encryption Layer',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Encryption Layer routes to FHIR Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'FHIR Stream routes to Clinical Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Clinical Workers routes to Permissions',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Clinical Workers routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Clinical Workers routes to Alert Queue',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('healthcare-data-stream-hipaa', problemConfigs['healthcare-data-stream-hipaa']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Global CDC Streaming Platform
 * From extracted-problems/system-design/streaming.md
 */
export const globalCdcPipelineProblemDefinition: ProblemDefinition = {
  id: 'global-cdc-pipeline',
  title: 'Global CDC Streaming Platform',
  description: `Build a change data capture (CDC) platform that streams database changes across multiple regions. Handle schema evolution, data transformation, and maintain consistency across heterogeneous systems.
- Capture changes from multiple databases
- Stream across regions with low latency
- Handle schema evolution gracefully
- Transform data between formats`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Need MySQL Sources (db_primary) for replicate database changes worldwide',
      },
      {
        type: 'compute',
        reason: 'Need CDC Connectors (worker) for replicate database changes worldwide',
      },
      {
        type: 'message_queue',
        reason: 'Need Global Kafka (stream) for replicate database changes worldwide',
      },
      {
        type: 'cache',
        reason: 'Need Schema Registry (cache) for replicate database changes worldwide',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'storage',
        to: 'compute',
        reason: 'MySQL Sources routes to CDC Connectors',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'Postgres Sources routes to CDC Connectors',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'CDC Connectors routes to Global Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Global Kafka routes to Transformers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Global Kafka routes to Routers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transformers routes to Schema Registry',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Transformers routes to Regional Streams',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Routers routes to Regional Streams',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Regional Streams routes to Target Systems',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('global-cdc-pipeline', problemConfigs['global-cdc-pipeline']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

