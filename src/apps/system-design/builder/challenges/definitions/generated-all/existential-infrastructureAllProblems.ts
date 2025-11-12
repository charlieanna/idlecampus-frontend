import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Existential-infrastructure Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 21 problems
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

/**
 * Planetary Defense Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure1ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-1',
  title: 'Planetary Defense Infrastructure',
  description: `Create revolutionary planetary defense infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement planetary defense at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-1', problemConfigs['l6-existential-infrastructure-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asteroid Mining Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure2ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-2',
  title: 'Asteroid Mining Infrastructure',
  description: `Create revolutionary asteroid mining infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement asteroid mining at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-2', problemConfigs['l6-existential-infrastructure-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dyson Spheres Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure3ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-3',
  title: 'Dyson Spheres Infrastructure',
  description: `Create revolutionary dyson spheres infrastructure leveraging multiverse computing. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement dyson spheres at planetary scale
- Achieve multiverse computing breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-3', problemConfigs['l6-existential-infrastructure-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Generation Ships Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure4ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-4',
  title: 'Generation Ships Infrastructure',
  description: `Create revolutionary generation ships infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement generation ships at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-4', problemConfigs['l6-existential-infrastructure-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Terraforming Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure5ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-5',
  title: 'Terraforming Infrastructure',
  description: `Create revolutionary terraforming infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement terraforming at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-5', problemConfigs['l6-existential-infrastructure-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Planetary Defense Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure6ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-6',
  title: 'Planetary Defense Infrastructure',
  description: `Create revolutionary planetary defense infrastructure leveraging multiverse computing. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement planetary defense at planetary scale
- Achieve multiverse computing breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-6', problemConfigs['l6-existential-infrastructure-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asteroid Mining Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure7ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-7',
  title: 'Asteroid Mining Infrastructure',
  description: `Create revolutionary asteroid mining infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement asteroid mining at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-7', problemConfigs['l6-existential-infrastructure-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dyson Spheres Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure8ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-8',
  title: 'Dyson Spheres Infrastructure',
  description: `Create revolutionary dyson spheres infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement dyson spheres at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-8', problemConfigs['l6-existential-infrastructure-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Generation Ships Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure9ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-9',
  title: 'Generation Ships Infrastructure',
  description: `Create revolutionary generation ships infrastructure leveraging multiverse computing. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement generation ships at planetary scale
- Achieve multiverse computing breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-9', problemConfigs['l6-existential-infrastructure-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Terraforming Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure10ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-10',
  title: 'Terraforming Infrastructure',
  description: `Create revolutionary terraforming infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement terraforming at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-10', problemConfigs['l6-existential-infrastructure-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Planetary Defense Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure11ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-11',
  title: 'Planetary Defense Infrastructure',
  description: `Create revolutionary planetary defense infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement planetary defense at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-11', problemConfigs['l6-existential-infrastructure-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asteroid Mining Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure12ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-12',
  title: 'Asteroid Mining Infrastructure',
  description: `Create revolutionary asteroid mining infrastructure leveraging multiverse computing. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement asteroid mining at planetary scale
- Achieve multiverse computing breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-12', problemConfigs['l6-existential-infrastructure-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dyson Spheres Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure13ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-13',
  title: 'Dyson Spheres Infrastructure',
  description: `Create revolutionary dyson spheres infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement dyson spheres at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-13', problemConfigs['l6-existential-infrastructure-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Generation Ships Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure14ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-14',
  title: 'Generation Ships Infrastructure',
  description: `Create revolutionary generation ships infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement generation ships at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-14', problemConfigs['l6-existential-infrastructure-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Terraforming Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure15ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-15',
  title: 'Terraforming Infrastructure',
  description: `Create revolutionary terraforming infrastructure leveraging multiverse computing. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement terraforming at planetary scale
- Achieve multiverse computing breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-15', problemConfigs['l6-existential-infrastructure-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Planetary Defense Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure16ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-16',
  title: 'Planetary Defense Infrastructure',
  description: `Create revolutionary planetary defense infrastructure leveraging galactic internet. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement planetary defense at planetary scale
- Achieve galactic internet breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-16', problemConfigs['l6-existential-infrastructure-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asteroid Mining Infrastructure
 * From extracted-problems/system-design/existential-infrastructure.md
 */
export const l6ExistentialInfrastructure17ProblemDefinition: ProblemDefinition = {
  id: 'l6-existential-infrastructure-17',
  title: 'Asteroid Mining Infrastructure',
  description: `Create revolutionary asteroid mining infrastructure leveraging stellar engineering. This system will transform how we think about computing and set new industry standards for the next decade.
- Implement asteroid mining at planetary scale
- Achieve stellar engineering breakthrough
- Support quantum-resistant security
- Enable autonomous self-healing`,

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

  scenarios: generateScenarios('l6-existential-infrastructure-17', problemConfigs['l6-existential-infrastructure-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

