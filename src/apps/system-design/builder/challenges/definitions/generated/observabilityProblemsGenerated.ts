import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Observability Problems (Auto-generated)
 * Generated from extracted-problems/system-design/observability.md
 */

/**
 * DataDog-Scale Observability Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5ObservabilityDatadogProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-datadog',
  title: 'DataDog-Scale Observability Platform',
  description: `Design DataDog-scale platform ingesting metrics, logs, and traces from 10K companies, providing real-time dashboards, alerting, and anomaly detection.
- Ingest 10T data points daily
- Support 1M custom metrics
- Provide < 1 minute data latency
- Enable complex query language`,

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

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

  scenarios: generateScenarios('l5-observability-datadog', problemConfigs['l5-observability-datadog']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

