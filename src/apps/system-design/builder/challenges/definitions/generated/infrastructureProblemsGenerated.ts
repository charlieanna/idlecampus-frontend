import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Infrastructure Problems (Auto-generated)
 * Generated from extracted-problems/system-design/infrastructure.md
 */

/**
 * Google Kubernetes Engine Architecture
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5InfraKubernetesPlatformProblemDefinition: ProblemDefinition = {
  id: 'l5-infra-kubernetes-platform',
  title: 'Google Kubernetes Engine Architecture',
  description: `Design GKE-scale platform managing 100K Kubernetes clusters, handling upgrades, scaling, and multi-tenancy while maintaining security and performance.
- Manage 100K Kubernetes clusters
- Support zero-downtime upgrades
- Enable auto-scaling and auto-healing
- Provide multi-tenancy isolation`,

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

  scenarios: generateScenarios('l5-infra-kubernetes-platform', problemConfigs['l5-infra-kubernetes-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

