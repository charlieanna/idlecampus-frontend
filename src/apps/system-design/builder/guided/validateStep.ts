import { SystemGraph } from '../types/graph';
import { GuidedStep, StepValidationResult } from '../types/guidedTutorial';

/**
 * Component type normalizations for flexible matching
 */
const TYPE_NORMALIZATIONS: Record<string, string[]> = {
  'compute': ['compute', 'app_server'],
  'app_server': ['compute', 'app_server'],
  'storage': ['storage', 'postgresql', 'mysql', 'mongodb', 'database', 'cassandra', 'dynamodb', 'couchdb', 'hbase'],
  'postgresql': ['storage', 'postgresql', 'database'],
  'mysql': ['storage', 'mysql', 'database'],
  'mongodb': ['storage', 'mongodb', 'database'],
  'database': ['storage', 'postgresql', 'mysql', 'mongodb', 'database', 'cassandra', 'dynamodb'],
  'cache': ['cache', 'redis', 'memcached', 'elasticache'],
  'redis': ['cache', 'redis'],
  'object_storage': ['object_storage', 's3'],
  's3': ['object_storage', 's3'],
  'cdn': ['cdn'],
  'load_balancer': ['load_balancer'],
  'message_queue': ['message_queue', 'kafka', 'sqs', 'rabbitmq'],
  'realtime_messaging': ['realtime_messaging', 'websocket'],
};

/**
 * Get all acceptable types for a given required type
 */
function getAcceptableTypes(requiredType: string): string[] {
  return TYPE_NORMALIZATIONS[requiredType] || [requiredType];
}

/**
 * Check if a component type matches a required type
 */
function typeMatches(actualType: string, requiredType: string): boolean {
  const acceptableTypes = getAcceptableTypes(requiredType);
  return acceptableTypes.includes(actualType);
}

/**
 * Get display name for a component type
 */
function getDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    'compute': 'App Server',
    'app_server': 'App Server',
    'storage': 'Database',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'database': 'Database',
    'cache': 'Cache',
    'redis': 'Redis',
    'object_storage': 'Object Storage',
    's3': 'S3',
    'cdn': 'CDN',
    'load_balancer': 'Load Balancer',
    'message_queue': 'Message Queue',
    'realtime_messaging': 'Real-time Messaging',
    'client': 'Client',
  };
  return displayNames[type] || type;
}

/**
 * Find components on canvas that match a required type
 */
function findMatchingComponents(graph: SystemGraph, requiredType: string): string[] {
  return graph.components
    .filter(comp => typeMatches(comp.type, requiredType))
    .map(comp => comp.id);
}

/**
 * Check if a required connection exists on the canvas
 */
function connectionExists(
  graph: SystemGraph,
  fromType: string,
  toType: string
): boolean {
  // Find all components matching the from and to types
  const fromComponents = fromType === 'client'
    ? graph.components.filter(c => c.type === 'client').map(c => c.id)
    : findMatchingComponents(graph, fromType);

  const toComponents = findMatchingComponents(graph, toType);

  // Check if any connection exists between matching components
  return graph.connections.some(conn =>
    fromComponents.includes(conn.from) && toComponents.includes(conn.to)
  );
}

/**
 * Validate the current step against the user's canvas
 * @param step - The step to validate
 * @param graph - The current system graph
 * @param codeByServer - Optional: Code store to check if code has been written
 */
export function validateStep(
  step: GuidedStep,
  graph: SystemGraph,
  codeByServer?: Record<string, { code: string; apis: string[] }>
): StepValidationResult {
  const missingComponents: string[] = [];
  const missingConnections: Array<{ from: string; to: string }> = [];
  const suggestions: string[] = [];

  // Check required components
  for (const requiredType of step.validation.requiredComponents) {
    const matching = findMatchingComponents(graph, requiredType);
    if (matching.length === 0) {
      missingComponents.push(requiredType);
    }
  }

  // Check required connections
  for (const conn of step.validation.requiredConnections) {
    if (!connectionExists(graph, conn.fromType, conn.toType)) {
      missingConnections.push({
        from: conn.fromType,
        to: conn.toType,
      });
    }
  }

  // Check for API configuration requirement (Step 2 - configuration step)
  let apiConfigPassed = true;
  let apiConfigMessage = '';

  if (step.validation.requireAPIConfiguration) {
    // Find app server and check if it has APIs configured
    const appServer = graph.components.find(c =>
      typeMatches(c.type, 'app_server') || typeMatches(c.type, 'compute')
    );

    if (appServer) {
      const handledAPIs = appServer.config?.handledAPIs || [];
      if (handledAPIs.length === 0) {
        apiConfigPassed = false;
        apiConfigMessage = 'App Server needs API endpoints configured';
        suggestions.push('Click on the App Server and assign at least one API endpoint (e.g., POST /api/v1/urls)');
      }
    } else {
      apiConfigPassed = false;
      apiConfigMessage = 'No App Server found to configure';
    }
  }

  // Check for Python code implementation requirement (Step 2)
  let codeImplementationPassed = true;
  let codeImplementationMessage = '';

  if (step.validation.requireCodeImplementation) {
    // Find app server with APIs configured
    const appServer = graph.components.find(c =>
      (typeMatches(c.type, 'app_server') || typeMatches(c.type, 'compute')) &&
      c.config?.handledAPIs?.length > 0
    );
    
    if (!appServer) {
      codeImplementationPassed = false;
      codeImplementationMessage = 'App Server needs APIs configured first';
      suggestions.push('Click on the App Server and assign APIs (e.g., POST /api/v1/urls, GET /api/v1/urls/*)');
    } else {
      // Check if code exists in code store
      const serverId = appServer.id;
      const serverCode = codeByServer?.[serverId];
      const codeContent = serverCode?.code || '';
      
      // Check if code has been edited beyond just the template
      // Code is considered "implemented" if:
      // 1. It has content beyond just comments
      // 2. It has at least one return statement or assignment (actual implementation)
      // 3. It's not just the template with TODOs
      const hasCode = codeContent.trim().length > 0 &&
        // Has actual code (not just comments/TODOs)
        (codeContent.includes('return') || 
         codeContent.includes('=') ||
         codeContent.includes('url_mappings[') ||
         codeContent.includes('short_code =') ||
         codeContent.includes('context[')) &&
        // Not just the template (has some implementation beyond TODOs)
        !(codeContent.split('\n').filter(line => 
          line.trim().startsWith('#') || 
          line.trim().startsWith('"""') ||
          line.trim() === '' ||
          line.trim().includes('TODO')
        ).length / codeContent.split('\n').length > 0.7); // Less than 70% comments/TODOs
      
      // Also check graph metadata flag (for backward compatibility)
      const hasCodeEdits = graph.metadata?.hasUserCodeEdits === true;
      
      // Also check component config (for backward compatibility)
      const hasPythonCodeInConfig = appServer.config?.pythonCode && 
        typeof appServer.config.pythonCode === 'string' &&
        appServer.config.pythonCode.trim().length > 0;
      
      if (!hasCode && !hasCodeEdits && !hasPythonCodeInConfig) {
        codeImplementationPassed = false;
        codeImplementationMessage = 'Python handlers need to be implemented';
        const apiList = appServer.config?.handledAPIs?.join(', ') || 'the configured APIs';
        suggestions.push(`Write the Python code in the code editor above. Fill in the TODO sections to implement handlers for ${apiList}`);
      }
    }
  }

  // Check for database replication requirement (Step 6)
  let replicationPassed = true;
  let replicationMessage = '';

  if (step.validation.requireDatabaseReplication) {
    const database = graph.components.find(c =>
      typeMatches(c.type, 'database') || typeMatches(c.type, 'storage')
    );

    if (database) {
      const replicationConfig = database.config?.replication;
      const replicationEnabled =
        (typeof replicationConfig === 'boolean' && replicationConfig) ||
        (typeof replicationConfig === 'object' && replicationConfig?.enabled) ||
        (typeof replicationConfig === 'string' && replicationConfig !== 'none');

      // Check replicas in multiple possible locations
      const replicas =
        database.config?.replication?.replicas ||  // nested in replication object
        database.config?.replicas ||                // direct on config
        0;

      if (!replicationEnabled || replicas < 2) {
        replicationPassed = false;
        replicationMessage = 'Database needs replication configured with at least 2 replicas';
        suggestions.push('Click on the Database → Replication & Scaling → Enable replication with 2+ replicas');
      }
    } else {
      replicationPassed = false;
      replicationMessage = 'No Database found to configure replication';
    }
  }

  // Check for multiple app server instances requirement (Step 7)
  let multiInstancePassed = true;
  let multiInstanceMessage = '';

  if (step.validation.requireMultipleAppInstances) {
    const appServers = graph.components.filter(c =>
      typeMatches(c.type, 'app_server') || typeMatches(c.type, 'compute')
    );

    const totalInstances = appServers.reduce((sum, server) => {
      return sum + (server.config?.instances || 1);
    }, 0);

    if (totalInstances < 2) {
      multiInstancePassed = false;
      multiInstanceMessage = 'App Server needs multiple instances for high availability';
      suggestions.push('Click on the App Server → Set Instances to 2 or more');
    }
  }

  // Check for cache strategy requirement (Step 8)
  let cacheStrategyPassed = true;
  let cacheStrategyMessage = '';

  if (step.validation.requireCacheStrategy) {
    const cache = graph.components.find(c =>
      typeMatches(c.type, 'cache') || typeMatches(c.type, 'redis')
    );

    if (cache) {
      const ttl = cache.config?.ttl || cache.config?.defaultTTL || 0;
      const strategy = cache.config?.strategy || cache.config?.cacheStrategy || '';

      if (!ttl || ttl <= 0) {
        cacheStrategyPassed = false;
        cacheStrategyMessage = 'Cache needs TTL (Time-To-Live) configured';
        suggestions.push('Click on the Cache → Set TTL (e.g., 3600 seconds = 1 hour)');
      } else if (!strategy) {
        cacheStrategyPassed = false;
        cacheStrategyMessage = 'Cache needs a caching strategy configured';
        suggestions.push('Click on the Cache → Select a strategy (e.g., cache-aside)');
      }
    } else {
      cacheStrategyPassed = false;
      cacheStrategyMessage = 'No Cache found to configure strategy';
    }
  }

  // Check for database capacity requirement (Step 9)
  let capacityPassed = true;
  let capacityMessage = '';

  if (step.validation.requireDatabaseCapacity) {
    const database = graph.components.find(c =>
      typeMatches(c.type, 'database') || typeMatches(c.type, 'storage')
    );

    if (database) {
      const writeCapacity = database.config?.writeCapacity || 0;
      // For TinyURL with 1000 RPS and 10% writes = 100 write RPS needed
      const minRequiredCapacity = 100;

      if (writeCapacity < minRequiredCapacity) {
        capacityPassed = false;
        capacityMessage = `Database write capacity (${writeCapacity || 'not set'}) is below required ${minRequiredCapacity} RPS`;
        suggestions.push('Click on the Database → Set Write Capacity to at least 100 RPS');
      }
    } else {
      capacityPassed = false;
      capacityMessage = 'No Database found to configure capacity';
    }
  }

  // Check for cost under budget requirement (Step 10)
  let costPassed = true;
  let costMessage = '';

  if (step.validation.requireCostUnderBudget) {
    const maxBudget = 500; // $500/month
    let totalCost = 0;

    for (const component of graph.components) {
      const instances = component.config?.instances || 1;

      if (typeMatches(component.type, 'database') || typeMatches(component.type, 'storage')) {
        const replication = component.config?.replication;
        const replicas = typeof replication === 'object' && replication?.enabled
          ? (replication.replicas || 1)
          : (component.config?.replicas || 0);
        const storageCost = (component.config?.storageSizeGB || 50) * 0.1;
        totalCost += 120 * (1 + replicas) + storageCost;
        continue;
      }

      const compType = component.type as string;
      if (compType === 'app_server' || compType === 'compute') {
        totalCost += 50 * instances;
      } else if (compType === 'redis' || compType === 'cache') {
        const memorySizeGB = component.config?.memorySizeGB || 1;
        totalCost += 20 * memorySizeGB;
      } else if (compType === 'load_balancer') {
        totalCost += 30;
      } else if (compType === 's3' || compType === 'object_storage') {
        totalCost += 25;
      } else if (compType === 'cdn') {
        totalCost += 50;
      }
    }

    if (totalCost > maxBudget) {
      costPassed = false;
      costMessage = `Design costs $${totalCost.toFixed(0)}/month, exceeds budget of $${maxBudget}/month`;
      suggestions.push('Reduce instances, replica count, or memory sizes to stay under budget');
    }
  }

  // Generate feedback
  const passed = missingComponents.length === 0 &&
                 missingConnections.length === 0 &&
                 apiConfigPassed &&
                 codeImplementationPassed &&
                 replicationPassed &&
                 multiInstancePassed &&
                 cacheStrategyPassed &&
                 capacityPassed &&
                 costPassed;
  let feedback = '';

  if (passed) {
    feedback = 'Great job! Your design satisfies this requirement. Moving to the next step...';
  } else {
    const issues: string[] = [];

    if (missingComponents.length > 0) {
      const componentNames = missingComponents.map(getDisplayName).join(', ');
      issues.push(`Missing components: ${componentNames}`);
      suggestions.push(`Add the following component(s): ${componentNames}`);
    }

    if (missingConnections.length > 0) {
      const connectionDescs = missingConnections
        .map(c => `${getDisplayName(c.from)} → ${getDisplayName(c.to)}`)
        .join(', ');
      issues.push(`Missing connections: ${connectionDescs}`);
      suggestions.push(`Connect: ${connectionDescs}`);
    }

    if (!apiConfigPassed && apiConfigMessage) {
      issues.push(apiConfigMessage);
    }

    if (!codeImplementationPassed && codeImplementationMessage) {
      issues.push(codeImplementationMessage);
    }

    if (!replicationPassed && replicationMessage) {
      issues.push(replicationMessage);
    }

    if (!multiInstancePassed && multiInstanceMessage) {
      issues.push(multiInstanceMessage);
    }

    if (!cacheStrategyPassed && cacheStrategyMessage) {
      issues.push(cacheStrategyMessage);
    }

    if (!capacityPassed && capacityMessage) {
      issues.push(capacityMessage);
    }

    if (!costPassed && costMessage) {
      issues.push(costMessage);
    }

    feedback = issues.join('. ');
  }

  return {
    passed,
    missingComponents,
    missingConnections,
    feedback,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Check if the tutorial is complete (all steps passed)
 */
export function isTutorialComplete(
  tutorial: { steps: GuidedStep[] },
  graph: SystemGraph
): boolean {
  // Validate the last step - if it passes, tutorial is complete
  const lastStep = tutorial.steps[tutorial.steps.length - 1];
  if (!lastStep) return false;

  const result = validateStep(lastStep, graph);
  return result.passed;
}

/**
 * Get progress percentage through the tutorial
 */
export function getTutorialProgress(
  completedSteps: number,
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Validate all steps up to and including the current step
 * Returns the first failing step index, or -1 if all pass
 */
export function findFirstFailingStep(
  steps: GuidedStep[],
  graph: SystemGraph,
  currentStepIndex: number
): number {
  for (let i = 0; i <= currentStepIndex; i++) {
    const result = validateStep(steps[i], graph);
    if (!result.passed) {
      return i;
    }
  }
  return -1;
}
