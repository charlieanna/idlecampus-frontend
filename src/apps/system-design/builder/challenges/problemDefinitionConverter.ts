import { ProblemDefinition } from '../types/problemDefinition';
import { Challenge, TestCase } from '../types/testCase';

/**
 * Converts a ProblemDefinition to a Challenge
 */
export function convertProblemDefinitionToChallenge(
  def: ProblemDefinition
): Challenge {
  // Determine difficulty based on requirements complexity
  const difficulty = determineDifficulty(def);

  // Convert scenarios to test cases
  const testCases: TestCase[] = def.scenarios.map((scenario) => {
    // Parse requirement type from scenario name (e.g., "FR-1: Basic Connectivity" => { type: 'functional', req: 'FR-1' })
    const reqMatch = scenario.name.match(/^(FR|NFR-P|NFR-S|NFR-R|NFR-C)-(\d+)/);
    const requirement = reqMatch ? `${reqMatch[1]}-${reqMatch[2]}` : 'FR-1';
    const testType = getTestType(requirement);

    // Extract clean name (remove requirement prefix)
    const cleanName = scenario.name.replace(/^(FR|NFR-[PSRC])-\d+:\s*/, '');

    const isReadHeavy = (scenario.traffic.readWriteRatio || 0.5) >= 0.7;
    const trafficType =
      !scenario.traffic.readWriteRatio || scenario.traffic.readWriteRatio === 0.5
        ? 'mixed'
        : isReadHeavy
        ? 'read'
        : 'write';

    // Set duration based on test type
    const duration = testType === 'functional' ? 10 :
                     testType === 'reliability' ? 120 : 60;

    const testCase: TestCase = {
      name: cleanName,
      type: testType,
      requirement,
      description: scenario.description || cleanName,
      traffic: {
        type: trafficType as 'read' | 'write' | 'mixed',
        rps: scenario.traffic.rps,
        readRatio: scenario.traffic.readWriteRatio || 0.5,
        avgResponseSizeMB: scenario.traffic.avgFileSize,
      },
      duration,
      passCriteria: {
        maxP99Latency: scenario.passCriteria.maxLatency,
        maxErrorRate: scenario.passCriteria.maxErrorRate,
        maxMonthlyCost: scenario.passCriteria.maxCost,
        minAvailability: scenario.passCriteria.availability,
        maxDowntime: scenario.passCriteria.maxDowntime,
      },
    };

    // Add failure injection if present
    if (scenario.failureInjection) {
      testCase.failureInjection = {
        type: mapFailureType(scenario.failureInjection.component),
        atSecond: scenario.failureInjection.at,
        recoverySecond: scenario.failureInjection.recoveryAt,
      };
    }

    return testCase;
  });

  // Extract functional requirements as strings
  // Use user-facing FRs if provided, otherwise fall back to component reasons
  const functionalReqs = def.userFacingFRs ||
    (def.functionalRequirements?.mustHave?.map((req) => req.reason) || []);

  // Determine available components based on requirements
  const availableComponents = determineAvailableComponents(def);

  // Create learning objectives
  const learningObjectives = createLearningObjectives(def);

  const challenge: Challenge = {
    id: def.id,
    title: def.title,
    difficulty,
    description: def.description,
    requirements: {
      functional: functionalReqs,
      traffic: formatTrafficRequirement(def.scenarios[0]),
      latency: formatLatencyRequirement(def.scenarios[0]),
      availability: formatAvailabilityRequirement(def.scenarios[0]),
      budget: 'Optimize for cost efficiency',
      nfrs: def.userFacingNFRs, // Pass through user-facing NFRs
    },
    availableComponents,
    testCases,
    learningObjectives,
    referenceLinks: getReferenceLinks(def.id),
    pythonTemplate: def.pythonTemplate, // Pass through Python template
  };

  // Generate a basic solution if not already present
  // Note: Solutions can be manually refined later
  challenge.solution = generateBasicSolution(challenge, def);

  return challenge;
}

function determineDifficulty(
  def: ProblemDefinition
): 'beginner' | 'intermediate' | 'advanced' {
  // L5 (Staff) and L6 (Principal) problems are always advanced
  // These are Google interview levels for senior engineers
  if (def.id.startsWith('l5-') || def.id.startsWith('l6-')) {
    return 'advanced';
  }

  // Safety check for functionalRequirements
  if (!def.functionalRequirements) {
    return 'intermediate'; // Default to intermediate if no requirements defined
  }

  const componentCount = def.functionalRequirements.mustHave?.length || 0;
  const connectionCount = def.functionalRequirements.mustConnect?.length || 0;

  // Balanced heuristic for better problem distribution
  // Beginner: Simple connectivity (2-3 components)
  if (componentCount <= 3 && connectionCount <= 4) {
    return 'beginner';
  }
  // Intermediate: Typical interview problems (4-5 components)
  else if (componentCount <= 5 && connectionCount <= 8) {
    return 'intermediate';
  }
  // Advanced: Complex enterprise systems (6+ components)
  else {
    return 'advanced';
  }
}

function determineAvailableComponents(def: ProblemDefinition): string[] {
  const baseComponents = [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ];

  // Add specific components based on requirements
  const required: string[] = [];
  def.functionalRequirements?.mustHave?.forEach((req) => {
    switch (req.type) {
      case 'compute':
        required.push('app_server');
        break;
      case 'storage':
        required.push('database');
        break;
      case 'cache':
        required.push('redis');
        break;
      case 'load_balancer':
        required.push('load_balancer');
        break;
      case 'message_queue':
        required.push('message_queue');
        break;
      case 'object_storage':
        required.push('s3');
        break;
      case 'cdn':
        required.push('cdn');
        break;
      case 'realtime_messaging':
        required.push('redis', 'message_queue');
        break;
    }
  });

  // Deduplicate using an object as a set
  const allComponents = baseComponents.concat(required);
  const uniqueMap: { [key: string]: boolean } = {};
  allComponents.forEach((comp) => {
    uniqueMap[comp] = true;
  });
  return Object.keys(uniqueMap);
}

function createLearningObjectives(def: ProblemDefinition): string[] {
  const objectives: string[] = [];

  // Add objectives based on required components
  const componentTypesMap: { [key: string]: boolean } = {};
  def.functionalRequirements?.mustHave?.forEach((req) => {
    componentTypesMap[req.type] = true;
  });

  if (componentTypesMap['compute']) {
    objectives.push('Understand client-server architecture');
  }
  if (componentTypesMap['storage']) {
    objectives.push('Learn database connectivity and data persistence');
  }
  if (componentTypesMap['cache']) {
    objectives.push('Understand caching strategies for performance');
  }
  if (componentTypesMap['load_balancer']) {
    objectives.push('Learn horizontal scaling with load balancers');
  }
  if (componentTypesMap['message_queue']) {
    objectives.push('Understand asynchronous processing patterns');
  }
  if (componentTypesMap['object_storage']) {
    objectives.push('Learn blob storage for large files');
  }
  if (componentTypesMap['cdn']) {
    objectives.push('Understand content delivery networks');
  }

  // Add data modeling objective if defined
  if (def.functionalRequirements?.dataModel) {
    objectives.push('Design appropriate data models');
  }

  return objectives;
}

function formatTrafficRequirement(scenario: any): string {
  const rps = scenario.traffic.rps;
  const readWriteRatio = scenario.traffic.readWriteRatio || 0.5;
  const readPercent = Math.round(readWriteRatio * 100);
  const writePercent = 100 - readPercent;

  return `${rps} RPS (${readPercent}% reads, ${writePercent}% writes)`;
}

function formatLatencyRequirement(scenario: any): string {
  const maxLatency = scenario.passCriteria.maxLatency;
  if (!maxLatency) return 'Optimize for low latency';
  if (maxLatency >= 1000) return `p99 < ${maxLatency / 1000}s`;
  return `p99 < ${maxLatency}ms`;
}

function formatAvailabilityRequirement(scenario: any): string {
  const availability = scenario.passCriteria.availability;
  if (!availability) return 'Best effort availability';
  const percent = (availability * 100).toFixed(1);
  return `${percent}% uptime`;
}

function getReferenceLinks(challengeId: string): { label: string; url: string }[] {
  const linksMap: { [key: string]: { label: string; url: string }[] } = {
    instagram: [
      { label: 'Instagram Engineering Blog', url: 'https://instagram-engineering.com/' },
      { label: 'Official Site', url: 'https://www.instagram.com/' },
      { label: 'System Design: Instagram', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-instagram' },
    ],
    twitter: [
      { label: 'Twitter Engineering Blog', url: 'https://blog.twitter.com/engineering/en_us' },
      { label: 'Official Site', url: 'https://twitter.com/' },
      { label: 'System Design: Twitter', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-twitter' },
    ],
    reddit: [
      { label: 'Reddit Blog', url: 'https://www.redditinc.com/blog' },
      { label: 'Official Site', url: 'https://www.reddit.com/' },
      { label: 'Reddit Architecture', url: 'https://github.com/reddit-archive/reddit/wiki/Architecture' },
    ],
    linkedin: [
      { label: 'LinkedIn Engineering Blog', url: 'https://engineering.linkedin.com/' },
      { label: 'Official Site', url: 'https://www.linkedin.com/' },
    ],
    facebook: [
      { label: 'Meta Engineering Blog', url: 'https://engineering.fb.com/' },
      { label: 'Official Site', url: 'https://www.facebook.com/' },
      { label: 'Facebook TAO: The Graph Store', url: 'https://www.usenix.org/system/files/conference/atc13/atc13-bronson.pdf' },
    ],
    tiktok: [
      { label: 'TikTok Engineering Blog', url: 'https://newsroom.tiktok.com/en-us/topics/engineering' },
      { label: 'Official Site', url: 'https://www.tiktok.com/' },
    ],
    pinterest: [
      { label: 'Pinterest Engineering Blog', url: 'https://medium.com/pinterest-engineering' },
      { label: 'Official Site', url: 'https://www.pinterest.com/' },
      { label: 'Pinterest Architecture', url: 'https://medium.com/pinterest-engineering/sharding-pinterest-how-we-scaled-our-mysql-fleet-3f341e96ca6f' },
    ],
    snapchat: [
      { label: 'Snap Engineering Blog', url: 'https://eng.snap.com/blog' },
      { label: 'Official Site', url: 'https://www.snapchat.com/' },
    ],
    discord: [
      { label: 'Discord Engineering Blog', url: 'https://discord.com/category/engineering' },
      { label: 'Official Site', url: 'https://discord.com/' },
      { label: 'How Discord Stores Billions of Messages', url: 'https://discord.com/blog/how-discord-stores-billions-of-messages' },
    ],
    medium: [
      { label: 'Medium Engineering Blog', url: 'https://medium.engineering/' },
      { label: 'Official Site', url: 'https://medium.com/' },
    ],
    amazon: [
      { label: 'AWS Architecture Blog', url: 'https://aws.amazon.com/blogs/architecture/' },
      { label: 'Official Site', url: 'https://www.amazon.com/' },
      { label: 'Amazon Dynamo Paper', url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf' },
    ],
    shopify: [
      { label: 'Shopify Engineering Blog', url: 'https://shopify.engineering/' },
      { label: 'Official Site', url: 'https://www.shopify.com/' },
      { label: 'Shopify Architecture', url: 'https://shopify.engineering/e-commerce-at-scale-inside-shopifys-tech-stack' },
    ],
    stripe: [
      { label: 'Stripe Engineering Blog', url: 'https://stripe.com/blog/engineering' },
      { label: 'Official Site', url: 'https://stripe.com/' },
      { label: 'Stripe API Design', url: 'https://stripe.com/blog/payment-api-design' },
    ],
    uber: [
      { label: 'Uber Engineering Blog', url: 'https://www.uber.com/blog/engineering/' },
      { label: 'Official Site', url: 'https://www.uber.com/' },
      { label: 'System Design: Uber', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-uber' },
    ],
    airbnb: [
      { label: 'Airbnb Tech Blog', url: 'https://medium.com/airbnb-engineering' },
      { label: 'Official Site', url: 'https://www.airbnb.com/' },
      { label: 'Airbnb Architecture', url: 'https://medium.com/airbnb-engineering/building-services-at-airbnb-part-1-c4c1d8fa811b' },
    ],
    netflix: [
      { label: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/' },
      { label: 'Official Site', url: 'https://www.netflix.com/' },
      { label: 'System Design: Netflix', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-netflix' },
    ],
    spotify: [
      { label: 'Spotify Engineering Blog', url: 'https://engineering.atspotify.com/' },
      { label: 'Official Site', url: 'https://www.spotify.com/' },
      { label: 'Spotify Architecture', url: 'https://engineering.atspotify.com/2023/03/spotify-backstage-architecture/' },
    ],
    youtube: [
      { label: 'YouTube Engineering Blog', url: 'https://blog.youtube/inside-youtube/topic/engineering/' },
      { label: 'Official Site', url: 'https://www.youtube.com/' },
      { label: 'System Design: YouTube', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-youtube' },
    ],
    twitch: [
      { label: 'Twitch Engineering Blog', url: 'https://blog.twitch.tv/en/tags/engineering/' },
      { label: 'Official Site', url: 'https://www.twitch.tv/' },
      { label: 'Twitch Architecture', url: 'https://blog.twitch.tv/en/2022/04/26/breaking-down-twitchs-video-infrastructure/' },
    ],
    hulu: [
      { label: 'Hulu Tech Blog', url: 'https://medium.com/hulu-tech-blog' },
      { label: 'Official Site', url: 'https://www.hulu.com/' },
    ],
    whatsapp: [
      { label: 'WhatsApp Engineering', url: 'https://engineering.fb.com/category/whatsapp/' },
      { label: 'Official Site', url: 'https://www.whatsapp.com/' },
      { label: 'WhatsApp System Design', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-whatsapp' },
    ],
    slack: [
      { label: 'Slack Engineering Blog', url: 'https://slack.engineering/' },
      { label: 'Official Site', url: 'https://slack.com/' },
      { label: 'Slack Architecture', url: 'https://slack.engineering/scaling-slacks-job-queue/' },
    ],
    telegram: [
      { label: 'Telegram FAQ', url: 'https://telegram.org/faq' },
      { label: 'Official Site', url: 'https://telegram.org/' },
    ],
    messenger: [
      { label: 'Messenger Engineering', url: 'https://engineering.fb.com/category/messenger/' },
      { label: 'Official Site', url: 'https://www.messenger.com/' },
    ],
    pastebin: [
      { label: 'Official Site', url: 'https://pastebin.com/' },
      { label: 'System Design: Pastebin', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-pastebin' },
    ],
    dropbox: [
      { label: 'Dropbox Tech Blog', url: 'https://dropbox.tech/' },
      { label: 'Official Site', url: 'https://www.dropbox.com/' },
      { label: 'System Design: Dropbox', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-dropbox' },
    ],
    googledrive: [
      { label: 'Google Developers Blog', url: 'https://developers.googleblog.com/' },
      { label: 'Official Site', url: 'https://drive.google.com/' },
      { label: 'Google Drive API', url: 'https://developers.google.com/drive' },
    ],
    github: [
      { label: 'GitHub Engineering Blog', url: 'https://github.blog/category/engineering/' },
      { label: 'Official Site', url: 'https://github.com/' },
      { label: 'GitHub Architecture', url: 'https://github.blog/2023-10-30-the-architecture-of-githubs-code-search/' },
    ],
    stackoverflow: [
      { label: 'Stack Overflow Blog', url: 'https://stackoverflow.blog/engineering/' },
      { label: 'Official Site', url: 'https://stackoverflow.com/' },
      { label: 'Stack Overflow Architecture', url: 'https://stackexchange.com/performance' },
    ],
    doordash: [
      { label: 'DoorDash Engineering Blog', url: 'https://doordash.engineering/' },
      { label: 'Official Site', url: 'https://www.doordash.com/' },
      { label: 'DoorDash Architecture', url: 'https://doordash.engineering/category/architecture/' },
    ],
    instacart: [
      { label: 'Instacart Tech Blog', url: 'https://tech.instacart.com/' },
      { label: 'Official Site', url: 'https://www.instacart.com/' },
    ],
    yelp: [
      { label: 'Yelp Engineering Blog', url: 'https://engineeringblog.yelp.com/' },
      { label: 'Official Site', url: 'https://www.yelp.com/' },
      { label: 'System Design: Yelp', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-yelp' },
    ],
    notion: [
      { label: 'Notion Blog', url: 'https://www.notion.so/blog/topic/tech' },
      { label: 'Official Site', url: 'https://www.notion.so/' },
      { label: 'Notion Architecture', url: 'https://www.notion.so/blog/sharding-postgres-at-notion' },
    ],
    trello: [
      { label: 'Trello Engineering Blog', url: 'https://tech.trello.com/' },
      { label: 'Official Site', url: 'https://trello.com/' },
    ],
    googlecalendar: [
      { label: 'Google Developers Blog', url: 'https://developers.googleblog.com/' },
      { label: 'Official Site', url: 'https://calendar.google.com/' },
      { label: 'Google Calendar API', url: 'https://developers.google.com/calendar' },
    ],
    zoom: [
      { label: 'Zoom Blog', url: 'https://blog.zoom.us/' },
      { label: 'Official Site', url: 'https://zoom.us/' },
      { label: 'Zoom Architecture', url: 'https://blog.zoom.us/zoom-scalable-video-conferencing-platform/' },
    ],
    steam: [
      { label: 'Steam Blog', url: 'https://store.steampowered.com/news/' },
      { label: 'Official Site', url: 'https://store.steampowered.com/' },
    ],
    ticketmaster: [
      { label: 'Ticketmaster Tech Blog', url: 'https://tech.ticketmaster.com/' },
      { label: 'Official Site', url: 'https://www.ticketmaster.com/' },
      { label: 'System Design: Ticketmaster', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-ticketmaster' },
    ],
    bookingcom: [
      { label: 'Booking.com Tech Blog', url: 'https://blog.booking.com/' },
      { label: 'Official Site', url: 'https://www.booking.com/' },
    ],
    weatherapi: [
      { label: 'OpenWeatherMap', url: 'https://openweathermap.org/' },
      { label: 'Weather API Documentation', url: 'https://openweathermap.org/api' },
    ],
  };

  return linksMap[challengeId] || [];
}

function getTestType(requirement: string): 'functional' | 'performance' | 'scalability' | 'reliability' | 'cost' {
  if (requirement.startsWith('FR')) return 'functional';
  if (requirement.startsWith('NFR-P')) return 'performance';
  if (requirement.startsWith('NFR-S')) return 'scalability';
  if (requirement.startsWith('NFR-R')) return 'reliability';
  if (requirement.startsWith('NFR-C')) return 'cost';
  return 'functional';
}

function mapFailureType(component: string): 'db_crash' | 'cache_flush' | 'network_partition' {
  if (component === 'database' || component === 'db') return 'db_crash';
  if (component === 'cache' || component === 'redis') return 'cache_flush';
  return 'network_partition';
}

/**
 * Requirement-based pattern detection from functionalRequirements
 * This approach works for ANY custom system, not just hardcoded patterns
 */

function detectRequirementTypes(def?: ProblemDefinition): {
  requirementTypes: Set<string>;
  hasGeospatial: boolean;
  hasObjectStorage: boolean;
  hasMessageQueue: boolean;
  hasCache: boolean;
  hasRealtime: boolean;
  hasSearch: boolean;
  entities: string[];
  accessPatterns: any[];
} {
  if (!def || !def.functionalRequirements) {
    return {
      requirementTypes: new Set(),
      hasGeospatial: false,
      hasObjectStorage: false,
      hasMessageQueue: false,
      hasCache: false,
      hasRealtime: false,
      hasSearch: false,
      entities: [],
      accessPatterns: [],
    };
  }

  // Extract requirement types from mustHave
  const requirementTypes = new Set<string>(
    def.functionalRequirements.mustHave?.map(req => req.type) || []
  );

  // Extract entities and access patterns from data model
  const entities = def.functionalRequirements.dataModel?.entities || [];
  const accessPatterns = def.functionalRequirements.dataModel?.accessPatterns || [];

  // Detect patterns from requirements (not keywords!)
  const hasGeospatial = requirementTypes.has('geospatial') ||
    accessPatterns.some(p => p.type === 'geospatial_query');

  const hasObjectStorage = requirementTypes.has('object_storage') ||
    accessPatterns.some(p => p.type === 'write_large_file');

  const hasMessageQueue = requirementTypes.has('message_queue') ||
    requirementTypes.has('queue');

  const hasCache = requirementTypes.has('cache') ||
    accessPatterns.some(p => p.type === 'read_by_query' && p.frequency === 'very_high');

  const hasRealtime = requirementTypes.has('realtime_messaging') ||
    requirementTypes.has('websocket');

  const hasSearch = requirementTypes.has('search') ||
    accessPatterns.some(p => p.type === 'full_text_search');

  return {
    requirementTypes,
    hasGeospatial,
    hasObjectStorage,
    hasMessageQueue,
    hasCache,
    hasRealtime,
    hasSearch,
    entities,
    accessPatterns,
  };
}

/**
 * Generate a basic solution for a challenge
 * This creates a solution using the commodity hardware model
 */
function generateBasicSolution(challenge: Challenge, def?: ProblemDefinition): import('../types/testCase').Solution {
  const components: any[] = [];
  const connections: any[] = [];

  // Always add client
  components.push({ type: 'client', config: {} });

  // Calculate max RPS from test cases
  let maxRps = 0;
  let maxReadRps = 0;
  let maxWriteRps = 0;
  
  challenge.testCases.forEach(tc => {
    if (tc.traffic?.rps) {
      maxRps = Math.max(maxRps, tc.traffic.rps);
      if (tc.traffic.readRatio !== undefined) {
        maxReadRps = Math.max(maxReadRps, tc.traffic.rps * tc.traffic.readRatio);
        maxWriteRps = Math.max(maxWriteRps, tc.traffic.rps * (1 - tc.traffic.readRatio));
      }
    }
    if (tc.traffic?.readRps && tc.traffic?.writeRps) {
      maxReadRps = Math.max(maxReadRps, tc.traffic.readRps);
      maxWriteRps = Math.max(maxWriteRps, tc.traffic.writeRps);
      maxRps = Math.max(maxRps, tc.traffic.readRps + tc.traffic.writeRps);
    }
  });

  // Parse RPS from requirements if available
  if (challenge.requirements?.traffic) {
    const rpsMatch = challenge.requirements.traffic.match(/(\d+)(?:K|k)?\s*RPS/i);
    if (rpsMatch) {
      let rps = parseInt(rpsMatch[1]);
      if (challenge.requirements.traffic.toLowerCase().includes('k')) {
        rps *= 1000;
      }
      maxRps = Math.max(maxRps, rps);
    }
  }

  // Calculate app server instances (1000 RPS per instance, add 20% headroom)
  const appServerInstances = Math.max(1, Math.ceil((maxRps * 1.2) / 1000));

  // Detect requirements from functionalRequirements (not keyword patterns!)
  const {
    hasGeospatial,
    hasObjectStorage,
    hasMessageQueue,
    hasCache: hasCacheRequirement,
    hasRealtime,
    hasSearch,
    entities,
    accessPatterns,
  } = detectRequirementTypes(def);

  // Debug logging for requirement detection
  if (def) {
    const detectedRequirements = [];
    if (hasGeospatial) detectedRequirements.push('Geospatial');
    if (hasObjectStorage) detectedRequirements.push('Object Storage');
    if (hasMessageQueue) detectedRequirements.push('Message Queue');
    if (hasCacheRequirement) detectedRequirements.push('Cache');
    if (hasRealtime) detectedRequirements.push('Real-time');
    if (hasSearch) detectedRequirements.push('Search');
    console.log(`[Solution Generator] ${def.title}: Requirements: ${detectedRequirements.join(', ') || 'Basic compute+storage'}`);
    console.log(`[Solution Generator] ${def.title}: Entities: ${entities.join(', ') || 'None'}`);
  }

  // Determine component needs from requirements (not patterns!)
  const needsLoadBalancer = appServerInstances > 1 || maxRps > 1000;

  // Cache: Required by functional requirements OR high-frequency reads
  const needsCache = challenge.availableComponents.includes('redis') ||
                     challenge.availableComponents.includes('cache') ||
                     hasCacheRequirement ||
                     challenge.requirements?.nfrs?.some(nfr =>
                       nfr.toLowerCase().includes('cache') ||
                       nfr.toLowerCase().includes('hit ratio')
                     );

  const needsDatabase = challenge.availableComponents.includes('database') ||
                        challenge.availableComponents.includes('postgresql');

  // CDN: Required when object storage is present (inferred)
  const needsCDN = challenge.availableComponents.includes('cdn') ||
                   hasObjectStorage ||  // Infer CDN from object storage
                   challenge.requirements?.nfrs?.some(nfr =>
                     nfr.toLowerCase().includes('cdn') ||
                     nfr.toLowerCase().includes('static')
                   );

  // S3: Required by functional requirements
  const needsS3 = challenge.availableComponents.includes('s3') ||
                  hasObjectStorage ||
                  challenge.requirements?.nfrs?.some(nfr =>
                    nfr.toLowerCase().includes('object storage') ||
                    nfr.toLowerCase().includes('file')
                  );

  // Message Queue: Required by functional requirements OR realtime
  const needsQueue = challenge.availableComponents.includes('message_queue') ||
                     hasMessageQueue ||
                     hasRealtime ||
                     challenge.requirements?.nfrs?.some(nfr =>
                       nfr.toLowerCase().includes('async') ||
                       nfr.toLowerCase().includes('queue') ||
                       nfr.toLowerCase().includes('fan-out')
                     );

  // Add load balancer if needed
  if (needsLoadBalancer) {
    components.push({ type: 'load_balancer', config: {} });
    connections.push({ from: 'client', to: 'load_balancer', type: 'read_write' });
  }

  // Determine if we should split read/write services (CQRS pattern)
  // Only split when traffic patterns JUSTIFY it (not "good to have")
  const readRatio = maxRps > 0 ? maxReadRps / maxRps : 0.5;
  const shouldSplitReadWrite =
    (readRatio >= 0.8 && maxRps >= 5000) ||  // High read ratio + significant traffic
    (readRatio >= 0.9 && maxRps >= 1000) ||  // Extreme read skew
    (maxRps >= 10000);                        // Very high traffic always benefits from split

  // Add app server(s)
  if (shouldSplitReadWrite) {
    // CQRS: Separate Read API and Write API services
    // Justification: Read/write split allows independent scaling and optimization

    // Read API: Optimized for low latency, horizontal scaling
    const readInstances = Math.max(1, Math.ceil((maxReadRps * 1.2) / 1000));
    components.push({
      type: 'app_server',
      config: {
        instances: readInstances,
        serviceName: 'read-api',
        handledAPIs: ['GET /api/*'],
        displayName: 'Read API',
        subtitle: `${readInstances} instance(s)`,
      }
    });

    // Write API: Optimized for consistency, write throughput
    const writeInstances = Math.max(1, Math.ceil((maxWriteRps * 1.2) / 1000));
    components.push({
      type: 'app_server',
      config: {
        instances: writeInstances,
        serviceName: 'write-api',
        handledAPIs: ['POST /api/*', 'PUT /api/*', 'DELETE /api/*', 'PATCH /api/*'],
        displayName: 'Write API',
        subtitle: `${writeInstances} instance(s)`,
      }
    });

    console.log(`[Solution Generator] ${def?.title || 'Challenge'}: CQRS split - Read API: ${readInstances} instances, Write API: ${writeInstances} instances (Read ratio: ${(readRatio * 100).toFixed(1)}%, Total RPS: ${maxRps})`);
  } else {
    // Monolithic app server (justified by low traffic or balanced read/write)
    components.push({
      type: 'app_server',
      config: {
        instances: appServerInstances,
      }
    });

    console.log(`[Solution Generator] ${def?.title || 'Challenge'}: Monolithic app server - ${appServerInstances} instances (Read ratio: ${(readRatio * 100).toFixed(1)}%, Total RPS: ${maxRps})`);
  }
  
  // Update load balancer config with algorithm if it exists
  if (needsLoadBalancer) {
    const lbIndex = components.findIndex(c => c.type === 'load_balancer');
    if (lbIndex >= 0) {
      components[lbIndex].config = {
        ...components[lbIndex].config,
        algorithm: 'least_connections',
      };
    }
  }

  // Connect load balancer or client to app server(s)
  if (shouldSplitReadWrite) {
    // CQRS: Separate connections for read and write paths
    if (needsLoadBalancer) {
      connections.push({ from: 'load_balancer', to: 'app_server', type: 'read', label: 'Read traffic (GET)' });
      connections.push({ from: 'load_balancer', to: 'app_server', type: 'write', label: 'Write traffic (POST/PUT/DELETE)' });
    } else {
      connections.push({ from: 'client', to: 'app_server', type: 'read', label: 'Read traffic (GET)' });
      connections.push({ from: 'client', to: 'app_server', type: 'write', label: 'Write traffic (POST/PUT/DELETE)' });
    }
  } else {
    // Monolithic: Single connection for all traffic
    if (needsLoadBalancer) {
      connections.push({ from: 'load_balancer', to: 'app_server', type: 'read_write' });
    } else {
      connections.push({ from: 'client', to: 'app_server', type: 'read_write' });
    }
  }

  // Add cache if needed - size based on read traffic
  let cacheSizeGB = 4;
  if (needsCache) {
    // Calculate cache size: larger for read-heavy workloads
    // Base: 4GB, add 2GB per 1000 read RPS (accounting for 90% hit ratio)
    if (maxReadRps > 0) {
      cacheSizeGB = Math.max(4, Math.min(16, 4 + Math.ceil((maxReadRps / 1000) * 2)));
    }

    components.push({
      type: 'redis',
      config: {
        sizeGB: cacheSizeGB,
        strategy: 'cache_aside',
      }
    });

    // CQRS: Only Read API connects to cache (writes invalidate cache but don't read)
    if (shouldSplitReadWrite) {
      connections.push({ from: 'app_server', to: 'redis', type: 'read', label: 'Read API checks cache' });
    } else {
      connections.push({ from: 'app_server', to: 'redis', type: 'read_write' });
    }
  }

  // Add database if needed
  let replicationMode = 'single-leader';
  let replicas = 0;
  let shards = 1;
  
  if (needsDatabase) {
    // Account for cache misses: if cache has 90% hit ratio, 10% of reads go to DB
    // But be conservative: assume cache might not be fully warmed or might flush
    const cacheHitRatio = needsCache ? 0.9 : 0;
    const dbReadRps = maxReadRps * (1 - cacheHitRatio * 0.8); // Conservative: assume 80% of ideal hit ratio
    
    // Calculate read replicas needed (1000 RPS per replica)
    const readReplicas = Math.max(0, Math.ceil((dbReadRps * 1.2) / 1000));
    
    // Determine replication mode based on write load
    // Use multi-leader if write RPS > 100 (single-leader write capacity)
    const useMultiLeader = maxWriteRps > 100;
    replicationMode = useMultiLeader ? 'multi-leader' : 'single-leader';
    
    // Calculate shards needed for write capacity
    // Single-leader: 100 RPS per shard
    // Multi-leader: 300 RPS per shard (each replica can write)
    const writeCapacityPerShard = useMultiLeader ? 300 : 100;
    const requiredShards = Math.max(1, Math.ceil((maxWriteRps * 1.2) / writeCapacityPerShard));
    
    // For multi-leader: need at least 2 replicas (1 primary + 1 replica = 2 leaders)
    // For single-leader: replicas are just for read scaling
    if (useMultiLeader) {
      // Multi-leader: replicas = number of leaders (at least 2)
      replicas = Math.max(2, Math.ceil(requiredShards / 2));
      shards = requiredShards > 1 ? requiredShards : 1;
    } else {
      // Single-leader: replicas are read replicas
      replicas = readReplicas;
      shards = 1; // Single-leader doesn't need sharding unless write load is extreme
    }

    // Determine sharding key based on data model entities (not patterns!)
    let shardKey = 'id';
    if (hasGeospatial) {
      shardKey = 'region_id'; // Geospatial: shard by region for locality
    } else if (entities.includes('user')) {
      shardKey = 'user_id'; // User-centric systems: shard by user for user-related queries
    } else if (entities.length > 0) {
      // Use first entity as sharding key
      shardKey = `${entities[0]}_id`;
    }

    // Add database with master/replica visualization
    const dbDisplayName = replicas > 0 ? 'PostgreSQL Master' : 'PostgreSQL';
    const dbSubtitle = replicas > 0
      ? `Writes + ${replicas} replica${replicas > 1 ? 's' : ''} (reads)`
      : shards > 1 ? `${shards} shards` : undefined;

    components.push({
      type: 'postgresql',
      config: {
        instanceType: 'commodity-db',
        replicationMode,
        replication: {
          enabled: replicas > 0,
          replicas: replicas,
          mode: 'async',
        },
        sharding: {
          enabled: shards > 1,
          shards: shards,
          shardKey: shardKey,
        },
        displayName: dbDisplayName,
        subtitle: dbSubtitle,
      }
    });

    // CQRS: Route read traffic to replicas, write traffic to master
    if (shouldSplitReadWrite && replicas > 0) {
      connections.push({ from: 'app_server', to: 'postgresql', type: 'read', label: 'Read API → Replicas' });
      connections.push({ from: 'app_server', to: 'postgresql', type: 'write', label: 'Write API → Master' });
    } else {
      connections.push({ from: 'app_server', to: 'postgresql', type: 'read_write' });
    }
  }

  // Add CDN if needed
  if (needsCDN) {
    components.push({
      type: 'cdn',
      config: {
        enabled: true,
      }
    });
    connections.push({ from: 'client', to: 'cdn', type: 'read' });
  }

  // Add S3 if needed
  if (needsS3) {
    components.push({
      type: 's3',
      config: {}
    });
    if (needsCDN) {
      connections.push({ from: 'cdn', to: 's3', type: 'read' });
    }
    connections.push({ from: 'app_server', to: 's3', type: 'read_write' });
  }

  // Add message queue if needed
  if (needsQueue) {
    components.push({
      type: 'message_queue',
      config: {}
    });
    connections.push({ from: 'app_server', to: 'message_queue', type: 'write' });
  }

  // Build requirement-specific detailed explanation (educational, not pattern-based!)
  let requirementExplanation = '';
  const requirementLabels: string[] = [];

  // Geospatial requirements
  if (hasGeospatial) {
    requirementLabels.push('Geospatial');
    requirementExplanation += `\n\n🗺️ Geospatial Requirements:
- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient "find within radius" queries using spatial indexes (GIST).
- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).
- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for "find nearby drivers/restaurants" use cases.`;
  }

  // Real-time requirements
  if (hasRealtime || hasMessageQueue) {
    requirementLabels.push('Real-time');
    requirementExplanation += `\n\n⚡ Real-time/Async Processing:
- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).
- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.
- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.
- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.`;
  }

  // Object storage (media) requirements
  if (hasObjectStorage) {
    requirementLabels.push('Media');
    requirementExplanation += `\n\n🎥 Object Storage & CDN:
- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.
- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).
- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.
- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).`;
  }

  // Sharding explanation (for user-centric systems)
  if (shardKey === 'user_id' && shards > 1) {
    requirementExplanation += `\n\n👥 User-Centric Sharding:
- **Sharded by user_id**: Horizontally partitions data across ${shards} database shards. Each shard contains data for subset of users (e.g., user_id % ${shards} = shard_index).
- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).
- **Trade-offs**: Cross-shard queries (e.g., "find all users named John") become expensive. Design ensures most queries are single-shard (e.g., "get user's timeline" only queries that user's shard).
- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.`;
  }

  // CQRS explanation (when read/write split is used)
  if (shouldSplitReadWrite) {
    requirementLabels.push('CQRS');
    const readInstances = Math.max(1, Math.ceil((maxReadRps * 1.2) / 1000));
    const writeInstances = Math.max(1, Math.ceil((maxWriteRps * 1.2) / 1000));
    requirementExplanation += `\n\n🔄 CQRS (Command Query Responsibility Segregation):
- **Justification**: Traffic pattern justifies read/write split (Read: ${(readRatio * 100).toFixed(1)}%, Write: ${((1 - readRatio) * 100).toFixed(1)}%, Total: ${maxRps.toFixed(0)} RPS)
- **Read API (${readInstances} instance${readInstances > 1 ? 's' : ''})**: Handles GET requests. Optimized for low latency with:
  • Direct connection to cache (check cache first, DB on miss)
  • Routes to read replicas (not master) to avoid write contention
  • Can use eventual consistency (stale data acceptable for reads)
  • Horizontally scalable: Add instances to handle more read traffic
- **Write API (${writeInstances} instance${writeInstances > 1 ? 's' : ''})**: Handles POST/PUT/DELETE requests. Optimized for consistency with:
  • Routes writes to database master (ensures strong consistency)
  • Invalidates cache entries on writes (maintains cache freshness)
  • Fewer instances needed (writes are ${((1 - readRatio) * 100).toFixed(1)}% of traffic)
  • Can use database transactions for atomicity
- **Benefits** (validated by NFR tests):
  • Reads don't get blocked by writes (see NFR-P5 test)
  • Independent scaling: Add read instances without affecting writes
  • Different optimization strategies (read: cache + replicas, write: transactions + master)
  • Failure isolation: Read API failure doesn't affect writes (and vice versa)
- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)`;
  }

  const requirementLabel = requirementLabels.length > 0 ? ` (${requirementLabels.join(' + ')})` : '';

  // Generate app server description based on CQRS or monolithic
  const readInstances = Math.max(1, Math.ceil((maxReadRps * 1.2) / 1000));
  const writeInstances = Math.max(1, Math.ceil((maxWriteRps * 1.2) / 1000));
  const appServerDescription = shouldSplitReadWrite
    ? `**Read API**: ${readInstances} instance${readInstances > 1 ? 's' : ''} handling ${maxReadRps.toFixed(0)} read RPS (GET requests)\n- **Write API**: ${writeInstances} instance${writeInstances > 1 ? 's' : ''} handling ${maxWriteRps.toFixed(0)} write RPS (POST/PUT/DELETE)`
    : `**${appServerInstances} App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: ${(appServerInstances * 1000).toFixed(0)} RPS (peak: ${maxRps.toFixed(0)} RPS with 20% headroom for traffic spikes)`;

  return {
    components,
    connections,
    explanation: `Reference Solution for ${challenge.title}${requirementLabel}:

📊 Infrastructure Components:
- ${appServerDescription}.
- ${needsLoadBalancer ? '**Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).' : '**Direct Connection**: Single app server, no load balancer needed for current traffic.'}
${needsCache ? `- **${cacheSizeGB}GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~${(maxReadRps * 0.9).toFixed(0)} RPS served from cache (~${((maxReadRps * 0.9) / Math.max(maxReadRps, 1) * 100).toFixed(0)}% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).` : ''}
${needsDatabase ? `- **PostgreSQL Database**: ${replicationMode.replace('-', ' ')} configuration with ${replicas} read replica${replicas !== 1 ? 's' : ''}${shards > 1 ? ` and ${shards} shard${shards !== 1 ? 's' : ''} (sharded by ${shardKey})` : ''}.
  • Read Capacity: ${maxReadRps.toFixed(0)} RPS across ${replicas + 1} database instance(s)
  • Write Capacity: ${maxWriteRps.toFixed(0)} RPS ${replicationMode === 'multi-leader' ? 'distributed across leaders' : 'to primary leader'}
  • Replication: Asynchronous (eventual consistency, < 1s lag typical)` : ''}
${needsCDN ? '- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).' : ''}
${needsS3 ? '- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.' : ''}
${needsQueue ? '- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).' : ''}${requirementExplanation}

💡 Key Design Decisions:
- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.
- ${needsCache && maxReadRps > 0 ? `**Caching Strategy**: Cache reduces database load by ~${((maxReadRps * 0.9) / Math.max(maxReadRps, 1) * 100).toFixed(0)}%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.` : needsCache ? '**Caching**: Cache layer for read optimization and reduced database load.' : '**No Caching**: Low read traffic doesn\'t justify cache overhead.'}
- **Replication Mode**: ${replicationMode === 'multi-leader' ? 'Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).' : 'Single-leader chosen for strong consistency. All writes go to primary, reads can use replicas with eventual consistency (DDIA Ch. 5).'}
- ${shards > 1 ? `**Horizontal Scaling**: ${shards} database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on ${shardKey} hash (DDIA Ch. 6 - Partitioning).` : '**Vertical Scaling**: Single database shard sufficient for current load. Can add sharding later if write throughput exceeds single-node capacity.'}

⚠️ Important Note:
This is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:
✅ Has all required components (from functionalRequirements.mustHave)
✅ Has all required connections (from functionalRequirements.mustConnect)
✅ Meets performance targets (latency, cost, error rate)

Your solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!`
  };
}
