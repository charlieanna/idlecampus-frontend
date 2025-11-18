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
 * Pattern detection functions to identify challenge-specific requirements
 */

function hasGeospatialPattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check accessPatterns if available
  if (def.functionalRequirements?.dataModel?.accessPatterns) {
    return def.functionalRequirements.dataModel.accessPatterns
      .some(p => p.type === 'geospatial_query');
  }
  
  // Fallback to heuristics
  const geoKeywords = ['map', 'location', 'nearby', 'distance', 'delivery', 'ride', 'driver', 'geospatial', 'coordinates', 'lat', 'lng', 'radius'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  
  return geoKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

function hasRealtimePattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check for real-time keywords
  const realtimeKeywords = ['real-time', 'realtime', 'live', 'chat', 'message', 'messaging', 'websocket', 'streaming', 'instant', 'notification'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  const nfrs = def.userFacingNFRs?.join(' ').toLowerCase() || '';
  
  return realtimeKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword) || nfrs.includes(keyword)
  );
}

function hasMediaPattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check for media/video keywords
  const mediaKeywords = ['video', 'media', 'photo', 'image', 'stream', 'upload', 'file', 'content delivery', 'cdn', 'blob', 'asset'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  
  return mediaKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

function hasEcommercePattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check for e-commerce keywords
  const ecommerceKeywords = ['shop', 'store', 'product', 'catalog', 'cart', 'checkout', 'order', 'payment', 'inventory', 'purchase', 'e-commerce', 'ecommerce'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  
  return ecommerceKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

function hasGraphPattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check for graph/social keywords
  const graphKeywords = ['social', 'network', 'graph', 'friend', 'follow', 'connection', 'relationship', 'feed', 'timeline'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  
  return graphKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

function hasSearchPattern(def?: ProblemDefinition): boolean {
  if (!def) return false;
  
  // Check for search keywords
  const searchKeywords = ['search', 'query', 'index', 'autocomplete', 'suggestion', 'discovery', 'find', 'filter'];
  const titleLower = def.title.toLowerCase();
  const descLower = def.description.toLowerCase();
  const nfrs = def.userFacingNFRs?.join(' ').toLowerCase() || '';
  
  return searchKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword) || nfrs.includes(keyword)
  );
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

  // Detect challenge patterns
  const isGeospatial = hasGeospatialPattern(def);
  const isRealtime = hasRealtimePattern(def);
  const isMedia = hasMediaPattern(def);
  const isEcommerce = hasEcommercePattern(def);
  const isGraph = hasGraphPattern(def);
  const hasSearch = hasSearchPattern(def);

  // Determine component needs
  const needsLoadBalancer = appServerInstances > 1 || maxRps > 1000;
  const needsCache = challenge.availableComponents.includes('redis') || 
                     challenge.availableComponents.includes('cache') ||
                     challenge.requirements?.nfrs?.some(nfr => 
                       nfr.toLowerCase().includes('cache') || 
                       nfr.toLowerCase().includes('hit ratio')
                     );
  const needsDatabase = challenge.availableComponents.includes('database') ||
                        challenge.availableComponents.includes('postgresql');
  const needsCDN = challenge.availableComponents.includes('cdn') ||
                   isMedia ||
                   challenge.requirements?.nfrs?.some(nfr => 
                     nfr.toLowerCase().includes('cdn') || 
                     nfr.toLowerCase().includes('static')
                   );
  const needsS3 = challenge.availableComponents.includes('s3') ||
                  isMedia ||
                  challenge.requirements?.nfrs?.some(nfr => 
                    nfr.toLowerCase().includes('object storage') ||
                    nfr.toLowerCase().includes('file')
                  );
  const needsQueue = challenge.availableComponents.includes('message_queue') ||
                     isRealtime ||
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

  // Add app server
  components.push({
    type: 'app_server',
    config: {
      instances: appServerInstances,
    }
  });
  
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

  if (needsLoadBalancer) {
    connections.push({ from: 'load_balancer', to: 'app_server', type: 'read_write' });
  } else {
    connections.push({ from: 'client', to: 'app_server', type: 'read_write' });
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
    connections.push({ from: 'app_server', to: 'redis', type: 'read_write' });
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

    // Determine sharding key based on pattern
    let shardKey = 'id';
    if (isGeospatial) {
      shardKey = 'region_id'; // Geospatial: shard by region for locality
    } else if (isGraph) {
      shardKey = 'user_id'; // Social graph: shard by user for friend queries
    } else if (isEcommerce) {
      shardKey = 'category_id'; // E-commerce: shard by category for product queries
    }

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
        }
      }
    });
    connections.push({ from: 'app_server', to: 'postgresql', type: 'read_write' });
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

  // Build pattern-specific explanation
  let patternExplanation = '';
  const patterns: string[] = [];
  
  if (isGeospatial) {
    patterns.push('Geospatial');
    patternExplanation += `\n\n🗺️ Geospatial Pattern:
- PostgreSQL with PostGIS support for location queries (nearby drivers, businesses)
- Sharded by region_id for geographic locality
- Optimized for "find within radius" queries`;
  }
  
  if (isRealtime) {
    patterns.push('Real-time');
    patternExplanation += `\n\n⚡ Real-time Pattern:
- Message queue for async message delivery and fan-out
- WebSocket-ready architecture for instant notifications
- Low-latency design (p99 < 100ms target)`;
  }
  
  if (isMedia) {
    patterns.push('Media');
    patternExplanation += `\n\n🎥 Media Pattern:
- CDN for global content delivery (videos, images)
- S3 for scalable object storage
- Separate read path (client → CDN → S3) for static content
- Write path (app → S3) for uploads`;
  }
  
  if (isEcommerce) {
    patterns.push('E-commerce');
    patternExplanation += `\n\n🛒 E-commerce Pattern:
- Aggressive caching for product catalog (${cacheSizeGB}GB)
- Sharded by category_id for product discovery
- Search-optimized for product queries`;
  }
  
  if (isGraph) {
    patterns.push('Social Graph');
    patternExplanation += `\n\n👥 Social Graph Pattern:
- Sharded by user_id for friend/follower queries
- Optimized for multi-hop graph traversal
- Cache for hot user profiles and feeds`;
  }

  const patternLabel = patterns.length > 0 ? ` (${patterns.join(' + ')})` : '';

  return {
    components,
    connections,
    explanation: `Solution for ${challenge.title}${patternLabel}:

📊 Infrastructure:
- ${appServerInstances} app server instance(s) @ 1000 RPS each (peak: ${maxRps.toFixed(0)} RPS)
- ${needsLoadBalancer ? 'Load balancer with least-connections algorithm' : 'Direct client connection'}
${needsCache ? `- ${cacheSizeGB}GB Redis cache (cache-aside, ~${(maxReadRps * 0.9).toFixed(0)} RPS cached reads)` : ''}
${needsDatabase ? `- PostgreSQL ${replicationMode} (${replicas} replica${replicas !== 1 ? 's' : ''}${shards > 1 ? `, ${shards} shard${shards !== 1 ? 's' : ''}` : ''})
  • Read capacity: ${maxReadRps.toFixed(0)} RPS
  • Write capacity: ${maxWriteRps.toFixed(0)} RPS` : ''}
${needsCDN ? '- CDN for static content delivery (edge caching)' : ''}
${needsS3 ? '- S3 for object storage (images, videos, files)' : ''}
${needsQueue ? '- Message queue for async processing' : ''}${patternExplanation}

💡 Design Decisions:
- Components sized with 20% headroom for traffic spikes
- ${needsCache && maxReadRps > 0 ? `Cache reduces database load by ~${((maxReadRps * 0.9) / maxReadRps * 100).toFixed(0)}%` : needsCache ? 'Cache layer for read optimization' : 'No caching layer (low read traffic)'}
- ${replicationMode === 'multi-leader' ? 'Multi-leader replication for write scalability' : 'Single-leader replication for consistency'}
- ${shards > 1 ? `${shards} shards for horizontal scaling` : 'No sharding (single-shard sufficient)'}

This architecture is optimized for the specific requirements of ${challenge.title}.`
  };
}
