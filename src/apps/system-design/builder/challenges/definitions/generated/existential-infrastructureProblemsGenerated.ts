import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Existential-infrastructure Problems (Auto-generated)
 * Generated from extracted-problems/system-design/existential-infrastructure.md
 */

/**
 * Nuclear War Survival System
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialNuclearResilientProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-nuclear-resilient',
  title: 'Nuclear War Survival System',
  description: `Create resilient communication infrastructure surviving EMP attacks, radiation, and 90% node failure, maintaining critical coordination capabilities.
- Survive EMP attacks
- Operate in radiation
- Handle 90% node failure
- Support emergency broadcast`,

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

  scenarios: generateScenarios('l6-existential-nuclear-resilient', problemConfigs['l6-existential-nuclear-resilient']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Climate Collapse Computing
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialClimateAdaptationProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-climate-adaptation',
  title: 'Climate Collapse Computing',
  description: `Build computing systems operating in 5°C warming world with flooding, 60°C temperatures, superstorms, and mass migration of billions.
- Operate at 60°C ambient
- Survive category 6 hurricanes
- Handle mass migration logistics
- Coordinate disaster response`,

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

  scenarios: generateScenarios('l6-existential-climate-adaptation', problemConfigs['l6-existential-climate-adaptation']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Pandemic Response Platform
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialPandemicResponseProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-pandemic-response',
  title: 'Pandemic Response Platform',
  description: `Design system managing global pandemic response with 50% mortality rate, coordinating vaccines, quarantines, and essential services.
- Track 8B people health status
- Coordinate vaccine distribution
- Manage quarantine zones
- Allocate critical resources`,

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

  scenarios: generateScenarios('l6-existential-pandemic-response', problemConfigs['l6-existential-pandemic-response']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asteroid Defense Coordination
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialAsteroidDefenseProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-asteroid-defense',
  title: 'Asteroid Defense Coordination',
  description: `Build infrastructure detecting asteroids, calculating trajectories, and coordinating global deflection missions with nuclear devices or gravity tractors.
- Track 1M asteroids
- Calculate trajectories for 100 years
- Coordinate deflection missions
- Simulate intervention outcomes`,

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

  scenarios: generateScenarios('l6-existential-asteroid-defense', problemConfigs['l6-existential-asteroid-defense']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

