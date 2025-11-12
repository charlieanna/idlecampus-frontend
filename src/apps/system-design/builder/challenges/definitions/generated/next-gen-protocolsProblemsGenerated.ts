import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Next-gen-protocols Problems (Auto-generated)
 * Generated from extracted-problems/system-design/next-gen-protocols.md
 */

/**
 * Quantum Internet Protocol Suite
 * From extracted-problems/system-design/next-gen-protocols.md
 */
export const l6ProtocolQuantumInternetProblemDefinition: ProblemDefinition = {
  id: 'l6-protocol-quantum-internet',
  title: 'Quantum Internet Protocol Suite',
  description: `Design complete protocol suite for quantum internet supporting entanglement distribution, quantum teleportation, and distributed quantum computing while maintaining security against both classical and quantum attacks.
- Support quantum entanglement distribution
- Enable quantum teleportation of qubits
- Maintain coherence over 1000km
- Support quantum error correction`,

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

  scenarios: generateScenarios('l6-protocol-quantum-internet', problemConfigs['l6-protocol-quantum-internet']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Interplanetary Internet Architecture
 * From extracted-problems/system-design/next-gen-protocols.md
 */
export const l6ProtocolInterplanetaryProblemDefinition: ProblemDefinition = {
  id: 'l6-protocol-interplanetary',
  title: 'Interplanetary Internet Architecture',
  description: `Design DTN protocol suite handling 4-24 minute delays between Earth and Mars, supporting 1M Mars colonists with intermittent connectivity and solar interference.
- Handle 24-minute round-trip delays
- Support custody transfer
- Enable bundle protocol routing
- Manage solar conjunction blackouts`,

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

  scenarios: generateScenarios('l6-protocol-interplanetary', problemConfigs['l6-protocol-interplanetary']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * 6G Network Architecture
 * From extracted-problems/system-design/next-gen-protocols.md
 */
export const l6Protocol6gArchitectureProblemDefinition: ProblemDefinition = {
  id: 'l6-protocol-6g-architecture',
  title: '6G Network Architecture',
  description: `Design 6G network architecture using terahertz spectrum, AI-native protocols, and supporting holographic communication with sub-millisecond latency globally.
- Achieve 1Tbps peak data rates
- Support holographic communication
- Enable AI-native network operations
- Provide ubiquitous coverage including space`,

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

  scenarios: generateScenarios('l6-protocol-6g-architecture', problemConfigs['l6-protocol-6g-architecture']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Post-TCP Protocol for Exascale
 * From extracted-problems/system-design/next-gen-protocols.md
 */
export const l6ProtocolTcpReplacementProblemDefinition: ProblemDefinition = {
  id: 'l6-protocol-tcp-replacement',
  title: 'Post-TCP Protocol for Exascale',
  description: `Create new transport protocol handling exascale computing needs with support for RDMA, persistent memory, and quantum channels while maintaining backward compatibility.
- Support 400Gbps+ per connection
- Enable one-sided RDMA operations
- Handle persistent memory semantics
- Support multipath by default`,

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

  scenarios: generateScenarios('l6-protocol-tcp-replacement', problemConfigs['l6-protocol-tcp-replacement']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

