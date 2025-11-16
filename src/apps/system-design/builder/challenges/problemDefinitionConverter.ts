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

  return {
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
