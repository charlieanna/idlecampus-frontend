import { ProblemDefinition, ComponentRequirement, ConnectionRequirement } from '../types/problemDefinition';
import {
  GuidedTutorial,
  GuidedStep,
  ComponentHint,
  ConnectionHint,
  TeachingContent,
} from '../types/guidedTutorial';

/**
 * Keyword-to-component mapping for matching FRs to components
 * Maps keywords in functional requirements to relevant component types
 */
const FR_COMPONENT_KEYWORDS: Record<string, string[]> = {
  // Data operations
  'upload': ['object_storage', 'app_server', 'compute'],
  'store': ['storage', 'postgresql', 'database'],
  'save': ['storage', 'postgresql', 'database'],
  'persist': ['storage', 'postgresql', 'database'],

  // Read operations
  'view': ['cache', 'redis', 'cdn', 'compute'],
  'read': ['cache', 'redis', 'storage'],
  'get': ['cache', 'redis', 'storage'],
  'fetch': ['cache', 'redis', 'storage'],
  'display': ['cache', 'cdn'],

  // Feed/timeline
  'feed': ['cache', 'redis', 'storage', 'postgresql'],
  'timeline': ['cache', 'redis', 'storage'],
  'stream': ['message_queue', 'kafka'],

  // Search
  'search': ['cache', 'storage', 'compute'],
  'find': ['cache', 'storage'],
  'query': ['storage', 'cache'],

  // URL/redirect
  'redirect': ['cache', 'storage', 'compute'],
  'shorten': ['storage', 'compute', 'app_server'],
  'url': ['storage', 'cache'],

  // Real-time
  'real-time': ['realtime_messaging', 'message_queue', 'websocket'],
  'realtime': ['realtime_messaging', 'message_queue', 'websocket'],
  'live': ['realtime_messaging', 'message_queue'],
  'notification': ['message_queue', 'worker', 'realtime_messaging'],
  'notify': ['message_queue', 'worker'],

  // Media
  'image': ['object_storage', 'cdn', 's3'],
  'photo': ['object_storage', 'cdn', 's3'],
  'video': ['object_storage', 'cdn', 's3'],
  'media': ['object_storage', 'cdn'],
  'file': ['object_storage', 's3'],

  // Social
  'like': ['cache', 'storage'],
  'comment': ['storage', 'cache'],
  'follow': ['storage', 'cache'],
  'share': ['storage', 'message_queue'],
  'post': ['storage', 'cache', 'object_storage'],

  // Traffic/scaling
  'load': ['load_balancer'],
  'balance': ['load_balancer'],
  'distribute': ['load_balancer', 'cdn'],
  'scale': ['load_balancer', 'compute'],
};

/**
 * Component type display names
 */
const COMPONENT_DISPLAY_NAMES: Record<string, string> = {
  'compute': 'App Server',
  'app_server': 'App Server',
  'storage': 'Database (PostgreSQL)',
  'postgresql': 'Database (PostgreSQL)',
  'database': 'Database',
  'cache': 'Cache (Redis)',
  'redis': 'Cache (Redis)',
  'object_storage': 'Object Storage (S3)',
  's3': 'Object Storage (S3)',
  'cdn': 'CDN (CloudFront)',
  'load_balancer': 'Load Balancer',
  'message_queue': 'Message Queue (Kafka/SQS)',
  'kafka': 'Message Queue (Kafka)',
  'realtime_messaging': 'Real-time Messaging (WebSocket)',
  'websocket': 'WebSocket Server',
  'worker': 'Background Worker',
};

/**
 * Normalize component type to standard form
 */
function normalizeComponentType(type: string): string {
  const normalizations: Record<string, string> = {
    'app_server': 'compute',
    'postgresql': 'storage',
    'database': 'storage',
    'redis': 'cache',
    's3': 'object_storage',
    'kafka': 'message_queue',
    'websocket': 'realtime_messaging',
  };
  return normalizations[type] || type;
}

/**
 * Find components related to a functional requirement
 */
function findComponentsForFR(
  frText: string,
  mustHave: ComponentRequirement[],
  alreadyIntroduced: Set<string>
): ComponentRequirement[] {
  const frLower = frText.toLowerCase();
  const matchedTypes = new Set<string>();

  // Find keywords in FR text
  for (const [keyword, componentTypes] of Object.entries(FR_COMPONENT_KEYWORDS)) {
    if (frLower.includes(keyword)) {
      componentTypes.forEach(type => matchedTypes.add(normalizeComponentType(type)));
    }
  }

  // Filter mustHave components that match and haven't been introduced yet
  return mustHave.filter(comp => {
    const normalizedType = normalizeComponentType(comp.type);
    return matchedTypes.has(normalizedType) && !alreadyIntroduced.has(normalizedType);
  });
}

/**
 * Find connections related to newly introduced components
 */
function findConnectionsForStep(
  mustConnect: ConnectionRequirement[],
  introducedComponents: Set<string>,
  newComponents: string[]
): ConnectionRequirement[] {
  const newNormalized = new Set(newComponents.map(normalizeComponentType));

  return mustConnect.filter(conn => {
    const fromNormalized = normalizeComponentType(conn.from);
    const toNormalized = normalizeComponentType(conn.to);

    // Connection is relevant if it involves a newly introduced component
    // and the other end is either 'client' or already introduced
    const involvesNewComponent = newNormalized.has(fromNormalized) || newNormalized.has(toNormalized);
    const fromValid = conn.from === 'client' || introducedComponents.has(fromNormalized) || newNormalized.has(fromNormalized);
    const toValid = introducedComponents.has(toNormalized) || newNormalized.has(toNormalized);

    return involvesNewComponent && fromValid && toValid;
  });
}

/**
 * Generate concept explanation for a functional requirement
 */
function generateConceptExplanation(frText: string, components: ComponentHint[]): string {
  if (components.length === 0) {
    return `This requirement focuses on the behavior of your existing components. Review your current design to ensure it supports: ${frText}`;
  }

  const componentNames = components.map(c => c.displayName).join(', ');
  return `To implement "${frText}", you'll need to add: ${componentNames}. Each component serves a specific purpose in handling this functionality.`;
}

/**
 * Generate level 1 hint (general guidance)
 */
function generateLevel1Hint(components: ComponentHint[], connections: ConnectionHint[]): string {
  if (components.length === 0 && connections.length === 0) {
    return 'Review your existing design. Does it handle this requirement with the current components?';
  }

  const hints: string[] = [];
  if (components.length > 0) {
    hints.push(`Think about what type of component handles ${components[0].reason.toLowerCase()}`);
  }
  if (connections.length > 0) {
    hints.push(`Consider how data flows between your components`);
  }

  return hints.join('. ');
}

/**
 * Generate level 2 hint (detailed prompt)
 */
function generateLevel2Hint(components: ComponentHint[], connections: ConnectionHint[]): string {
  const hints: string[] = [];

  components.forEach(comp => {
    hints.push(`Add a ${comp.displayName} - ${comp.reason}`);
  });

  connections.forEach(conn => {
    hints.push(`Connect ${conn.from} to ${conn.to}`);
  });

  if (hints.length === 0) {
    return 'Your design may already support this. Verify the component configurations are correct.';
  }

  return `To complete this step:\n${hints.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
}

/**
 * Component explanations for generating basic teaching content
 */
const COMPONENT_EXPLANATIONS: Record<string, { title: string; explanation: string; whyItMatters: string; keyPoints: string[] }> = {
  compute: {
    title: 'App Server',
    explanation: 'An App Server (or compute instance) is where your application code runs. It receives HTTP requests, processes business logic, and returns responses. Think of it as the brain of your system.',
    whyItMatters: 'Without an app server, there\'s no way to process user requests. It\'s the foundation of any web application.',
    keyPoints: [
      'Processes incoming HTTP requests',
      'Runs your business logic code',
      'Should be stateless for horizontal scaling',
      'Can be scaled by adding more instances',
    ],
  },
  storage: {
    title: 'Database',
    explanation: 'A Database provides persistent storage for your application data. PostgreSQL is a popular choice for its reliability, ACID compliance, and rich feature set.',
    whyItMatters: 'Data needs to survive server restarts and crashes. Databases provide durable storage with consistency guarantees.',
    keyPoints: [
      'ACID transactions ensure data integrity',
      'Indexes speed up queries',
      'Replication provides high availability',
      'Choose based on your access patterns',
    ],
  },
  cache: {
    title: 'Cache (Redis)',
    explanation: 'A Cache stores frequently accessed data in memory for ultra-fast retrieval. Redis is an in-memory data store that can reduce database load and latency significantly.',
    whyItMatters: 'Database queries take 10-50ms. Cache lookups take 1-5ms. For read-heavy workloads, caching can improve performance by 10x.',
    keyPoints: [
      'Reduces database load',
      'Sub-millisecond read latency',
      'Use TTL for automatic expiration',
      'Cache-aside pattern is most common',
    ],
  },
  load_balancer: {
    title: 'Load Balancer',
    explanation: 'A Load Balancer distributes incoming traffic across multiple app servers. It enables horizontal scaling and provides high availability by detecting and routing around failed servers.',
    whyItMatters: 'Single servers have limits. Load balancers let you scale by adding more servers and eliminate single points of failure.',
    keyPoints: [
      'Distributes traffic across servers',
      'Health checks detect failures',
      'Enables horizontal scaling',
      'Common algorithms: Round Robin, Least Connections',
    ],
  },
  object_storage: {
    title: 'Object Storage (S3)',
    explanation: 'Object Storage like S3 stores unstructured data (files, images, videos) as objects. It\'s highly durable, infinitely scalable, and cost-effective for large files.',
    whyItMatters: 'Databases aren\'t designed for large binary files. Object storage is purpose-built for this use case with 99.999999999% durability.',
    keyPoints: [
      'Store files, images, videos',
      'Virtually unlimited storage',
      'Built-in redundancy and durability',
      'Cost-effective for large files',
    ],
  },
  cdn: {
    title: 'CDN (Content Delivery Network)',
    explanation: 'A CDN caches content at edge locations around the world. Users get content from the nearest edge, reducing latency dramatically for static assets.',
    whyItMatters: 'Speed of light is slow. Users on the other side of the world experience 200-300ms just from network latency. CDNs bring content closer to users.',
    keyPoints: [
      'Global edge network',
      'Caches static content',
      'Reduces origin server load',
      'Improves user experience worldwide',
    ],
  },
  message_queue: {
    title: 'Message Queue',
    explanation: 'A Message Queue (like Kafka or SQS) enables asynchronous communication between services. Producers send messages, consumers process them at their own pace.',
    whyItMatters: 'Not everything needs to happen synchronously. Queues decouple services, handle traffic spikes, and enable reliable background processing.',
    keyPoints: [
      'Decouples producers and consumers',
      'Handles traffic spikes gracefully',
      'Enables reliable background processing',
      'Messages persist until acknowledged',
    ],
  },
  realtime_messaging: {
    title: 'Real-time Messaging (WebSocket)',
    explanation: 'WebSockets enable bidirectional, real-time communication between clients and servers. Unlike HTTP, the connection stays open for instant message delivery.',
    whyItMatters: 'Chat, notifications, live updates - these need instant delivery. Polling wastes resources; WebSockets are efficient for real-time features.',
    keyPoints: [
      'Persistent bidirectional connection',
      'Instant message delivery',
      'More efficient than polling',
      'Requires connection management',
    ],
  },
};

/**
 * Generate basic teaching content from component information
 */
function generateBasicLearnPhase(
  frText: string,
  components: ComponentHint[],
  stepNumber: number
): TeachingContent {
  // Get the primary component being taught
  const primaryComponent = components[0];
  const componentInfo = primaryComponent
    ? COMPONENT_EXPLANATIONS[primaryComponent.type] || COMPONENT_EXPLANATIONS.compute
    : COMPONENT_EXPLANATIONS.compute;

  return {
    conceptTitle: components.length > 0
      ? `Understanding ${componentInfo.title}`
      : `Step ${stepNumber}: ${frText}`,

    conceptExplanation: components.length > 0
      ? componentInfo.explanation
      : `This step focuses on: ${frText}\n\nReview your current design to ensure it properly handles this requirement.`,

    whyItMatters: components.length > 0
      ? componentInfo.whyItMatters
      : 'Each requirement builds upon the previous ones to create a complete, functional system.',

    keyPoints: components.length > 0
      ? componentInfo.keyPoints
      : [
          'Review existing components',
          'Ensure proper connections',
          'Validate the data flow',
        ],
  };
}

/**
 * Generate a guided tutorial from a problem definition
 */
export function generateGuidedTutorial(problem: ProblemDefinition): GuidedTutorial {
  const steps: GuidedStep[] = [];
  const introducedComponents = new Set<string>();
  const { mustHave, mustConnect } = problem.functionalRequirements;

  // Use userFacingFRs if available, otherwise generate from mustHave
  const frs = problem.userFacingFRs && problem.userFacingFRs.length > 0
    ? problem.userFacingFRs
    : mustHave.map(c => `System needs ${COMPONENT_DISPLAY_NAMES[c.type] || c.type} for ${c.reason}`);

  frs.forEach((frText, frIndex) => {
    // Find components for this FR
    const newComponentReqs = findComponentsForFR(frText, mustHave, introducedComponents);
    const newComponentTypes = newComponentReqs.map(c => c.type);

    // Find connections for this step
    const connectionReqs = findConnectionsForStep(mustConnect, introducedComponents, newComponentTypes);

    // Build component hints
    const componentsNeeded: ComponentHint[] = newComponentReqs.map(c => ({
      type: c.type,
      reason: c.reason,
      displayName: COMPONENT_DISPLAY_NAMES[c.type] || c.type,
    }));

    // Build connection hints
    const connectionsNeeded: ConnectionHint[] = connectionReqs.map(c => ({
      from: c.from === 'client' ? 'Client' : (COMPONENT_DISPLAY_NAMES[c.from] || c.from),
      to: COMPONENT_DISPLAY_NAMES[c.to] || c.to,
      reason: c.reason || `Data flow from ${c.from} to ${c.to}`,
    }));

    // Mark new components as introduced
    newComponentTypes.forEach(type => introducedComponents.add(normalizeComponentType(type)));

    // Build validation requirements (cumulative)
    const allIntroducedSoFar = Array.from(introducedComponents);
    const requiredConnections = mustConnect
      .filter(conn => {
        const fromNorm = normalizeComponentType(conn.from);
        const toNorm = normalizeComponentType(conn.to);
        return (conn.from === 'client' || introducedComponents.has(fromNorm)) &&
               introducedComponents.has(toNorm);
      })
      .map(conn => ({
        fromType: conn.from,
        toType: conn.to,
      }));

    // Create the step with both new and legacy formats
    const step: GuidedStep = {
      id: `step-${frIndex + 1}-${problem.id}`,
      stepNumber: frIndex + 1,
      frIndex,

      // New phase-based content
      learnPhase: generateBasicLearnPhase(frText, componentsNeeded, frIndex + 1),
      practicePhase: {
        frText,
        taskDescription: generateConceptExplanation(frText, componentsNeeded),
        componentsNeeded,
        connectionsNeeded,
        successCriteria: [
          ...componentsNeeded.map(c => `Add a ${c.displayName}`),
          ...connectionsNeeded.map(c => `Connect ${c.from} to ${c.to}`),
        ].filter(Boolean),
      },

      // Legacy format for backward compatibility
      teaching: {
        frText,
        conceptExplanation: generateConceptExplanation(frText, componentsNeeded),
        componentsNeeded,
        connectionsNeeded,
      },

      validation: {
        requiredComponents: allIntroducedSoFar,
        requiredConnections,
      },
      hints: {
        level1: generateLevel1Hint(componentsNeeded, connectionsNeeded),
        level2: generateLevel2Hint(componentsNeeded, connectionsNeeded),
        solutionComponents: componentsNeeded.map(c => ({ type: c.type })),
        solutionConnections: connectionReqs.map(c => ({ from: c.from, to: c.to })),
      },
    };

    steps.push(step);
  });

  // If no steps were generated with components, create steps from mustHave directly
  if (steps.every(s => s.practicePhase.componentsNeeded.length === 0)) {
    return generateTutorialFromMustHave(problem, mustHave, mustConnect);
  }

  return {
    problemId: problem.id,
    problemTitle: problem.title,
    totalSteps: steps.length,
    steps,
  };
}

/**
 * Fallback: Generate tutorial directly from mustHave when FR matching fails
 */
function generateTutorialFromMustHave(
  problem: ProblemDefinition,
  mustHave: ComponentRequirement[],
  mustConnect: ConnectionRequirement[]
): GuidedTutorial {
  const steps: GuidedStep[] = [];
  const introducedComponents = new Set<string>();

  mustHave.forEach((comp, index) => {
    const componentType = normalizeComponentType(comp.type);
    introducedComponents.add(componentType);

    // Find connections for this component
    const relevantConnections = mustConnect.filter(conn => {
      const fromNorm = normalizeComponentType(conn.from);
      const toNorm = normalizeComponentType(conn.to);
      return (toNorm === componentType && (conn.from === 'client' || introducedComponents.has(fromNorm))) ||
             (fromNorm === componentType && introducedComponents.has(toNorm));
    });

    const componentHint: ComponentHint = {
      type: comp.type,
      reason: comp.reason,
      displayName: COMPONENT_DISPLAY_NAMES[comp.type] || comp.type,
    };

    const connectionHints: ConnectionHint[] = relevantConnections.map(c => ({
      from: c.from === 'client' ? 'Client' : (COMPONENT_DISPLAY_NAMES[c.from] || c.from),
      to: COMPONENT_DISPLAY_NAMES[c.to] || c.to,
      reason: c.reason || `Connect ${c.from} to ${c.to}`,
    }));

    const frText = `Add ${componentHint.displayName}`;

    steps.push({
      id: `step-${index + 1}-${problem.id}`,
      stepNumber: index + 1,
      frIndex: index,

      // New phase-based content
      learnPhase: generateBasicLearnPhase(frText, [componentHint], index + 1),
      practicePhase: {
        frText,
        taskDescription: comp.reason,
        componentsNeeded: [componentHint],
        connectionsNeeded: connectionHints,
        successCriteria: [
          `Add a ${componentHint.displayName}`,
          ...connectionHints.map(c => `Connect ${c.from} to ${c.to}`),
        ],
      },

      // Legacy format for backward compatibility
      teaching: {
        frText,
        conceptExplanation: comp.reason,
        componentsNeeded: [componentHint],
        connectionsNeeded: connectionHints,
      },

      validation: {
        requiredComponents: Array.from(introducedComponents),
        requiredConnections: mustConnect
          .filter(conn => {
            const fromNorm = normalizeComponentType(conn.from);
            const toNorm = normalizeComponentType(conn.to);
            return (conn.from === 'client' || introducedComponents.has(fromNorm)) &&
                   introducedComponents.has(toNorm);
          })
          .map(conn => ({ fromType: conn.from, toType: conn.to })),
      },
      hints: {
        level1: `Think about why you need a ${componentHint.displayName}`,
        level2: `Add a ${componentHint.displayName}. ${comp.reason}`,
        solutionComponents: [{ type: comp.type }],
        solutionConnections: relevantConnections.map(c => ({ from: c.from, to: c.to })),
      },
    });
  });

  return {
    problemId: problem.id,
    problemTitle: problem.title,
    totalSteps: steps.length,
    steps,
  };
}

/**
 * Check if a problem has valid data for tutorial generation
 */
export function canGenerateTutorial(problem: ProblemDefinition): boolean {
  const hasFRs = problem.userFacingFRs && problem.userFacingFRs.length > 0;
  const hasMustHave = problem.functionalRequirements?.mustHave?.length > 0;
  return hasFRs || hasMustHave;
}
