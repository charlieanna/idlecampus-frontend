#!/usr/bin/env tsx
/**
 * Automated parser for extracted-problems markdown files
 * Converts markdown problem definitions to TypeScript ProblemDefinition objects
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ParsedProblem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  summary: string;
  goal: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: {
    latency?: string;
    requestRate?: string;
    datasetSize?: string;
    durability?: string;
    availability?: string;
  };
  constants: Record<string, any>;
  availableComponents: string[];
  hints: string[];
  tiers: Array<{
    name: string;
    requirements: string[];
  }>;
  referenceSolution: {
    description: string;
    components: string[];
    connections: string[];
  };
}

/**
 * Extract a field value from markdown using regex
 */
function extractField(content: string, regex: RegExp): string {
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract a section between two headers
 */
function extractSection(content: string, header: string, nextHeader?: string): string {
  const headerRegex = new RegExp(`### ${header}\\s*\\n([\\s\\S]*?)(?=###|$)`, 'i');
  const match = content.match(headerRegex);
  if (!match) return '';

  let section = match[1].trim();
  if (nextHeader) {
    const nextHeaderIndex = section.indexOf(`### ${nextHeader}`);
    if (nextHeaderIndex > -1) {
      section = section.substring(0, nextHeaderIndex).trim();
    }
  }
  return section;
}

/**
 * Extract bulleted list items
 */
function extractList(content: string): string[] {
  const lines = content.split('\n');
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      items.push(trimmed.substring(2).trim());
    }
  }

  return items;
}

/**
 * Extract NFR metrics
 */
function extractNFR(content: string): ParsedProblem['nonFunctionalRequirements'] {
  const nfrSection = extractSection(content, 'Non-Functional Requirements');
  const nfr: ParsedProblem['nonFunctionalRequirements'] = {};

  const latencyMatch = nfrSection.match(/\*\*Latency:\*\*\s*(.+)/i);
  if (latencyMatch) nfr.latency = latencyMatch[1].trim();

  const requestRateMatch = nfrSection.match(/\*\*Request Rate:\*\*\s*(.+)/i);
  if (requestRateMatch) nfr.requestRate = requestRateMatch[1].trim();

  const datasetMatch = nfrSection.match(/\*\*Dataset Size:\*\*\s*(.+)/i);
  if (datasetMatch) nfr.datasetSize = datasetMatch[1].trim();

  const durabilityMatch = nfrSection.match(/\*\*Data Durability:\*\*\s*(.+)/i);
  if (durabilityMatch) nfr.durability = durabilityMatch[1].trim();

  const availabilityMatch = nfrSection.match(/\*\*Availability:\*\*\s*(.+)/i);
  if (availabilityMatch) nfr.availability = availabilityMatch[1].trim();

  return nfr;
}

/**
 * Derive FRs from description when explicit FR section is missing
 * Looks for bullet points or action-oriented sentences in the description
 */
function deriveFRsFromDescription(description: string, goal: string): string[] {
  const frs: string[] = [];

  // Extract bullet points from description
  const bulletPoints = extractList(description);
  if (bulletPoints.length > 0) {
    frs.push(...bulletPoints);
  }

  // Extract sentences that contain action verbs (implement, support, handle, etc.)
  const actionVerbs = /\b(implement|support|handle|enforce|track|provide|return|persist|shard|validate|cache|store|process|manage|ensure|enable)\b/gi;
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (actionVerbs.test(trimmed) && !frs.some(fr => fr.includes(trimmed))) {
      // Clean up and extract the action item
      const cleaned = trimmed.replace(/^(should|must|needs to|your design should)\s+/i, '');
      if (cleaned.length > 10 && cleaned.length < 150) {
        frs.push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
      }
    }
  }

  // If still no FRs found, use the goal as a fallback
  if (frs.length === 0 && goal) {
    frs.push(goal);
  }

  return frs.slice(0, 10); // Limit to 10 FRs
}

/**
 * Derive NFRs from constants and solution analysis when explicit NFR section is missing
 */
function deriveNFRsFromConstants(content: string, constants: Record<string, any>): ParsedProblem['nonFunctionalRequirements'] {
  const nfr: ParsedProblem['nonFunctionalRequirements'] = {};
  const solutionAnalysis = extractSection(content, 'Solution Analysis');

  // Try to derive latency from constants
  if (constants.target_latency_ms) {
    nfr.latency = `P99 < ${constants.target_latency_ms}ms`;
  } else if (constants.max_latency_ms) {
    nfr.latency = `P99 < ${constants.max_latency_ms}ms`;
  } else if (constants.latency_target) {
    nfr.latency = `${constants.latency_target}`;
  }

  // Try to derive request rate from constants
  if (constants.qps || constants.requests_per_second) {
    const qps = constants.qps || constants.requests_per_second;
    nfr.requestRate = qps >= 1000 ? `${qps / 1000}k requests/sec` : `${qps} requests/sec`;
  } else if (constants.base_qps) {
    const qps = constants.base_qps;
    nfr.requestRate = qps >= 1000 ? `${qps / 1000}k requests/sec` : `${qps} requests/sec`;
  }

  // Try to derive from solution analysis
  const throughputMatch = solutionAnalysis.match(/(?:Throughput|Request Rate):\s*([\d,]+)\s*(?:requests?\/sec|QPS)/i);
  if (throughputMatch && !nfr.requestRate) {
    const throughput = throughputMatch[1].replace(/,/g, '');
    const qps = parseInt(throughput);
    nfr.requestRate = qps >= 1000 ? `${qps / 1000}k requests/sec` : `${qps} requests/sec`;
  }

  const latencyMatch = solutionAnalysis.match(/Latency:\s*P\d+:\s*([\d.]+)ms/i);
  if (latencyMatch && !nfr.latency) {
    nfr.latency = `P99 < ${latencyMatch[1]}ms`;
  }

  const availabilityMatch = solutionAnalysis.match(/Availability:\s*([\d.]+)%/i);
  if (availabilityMatch) {
    nfr.availability = `${availabilityMatch[1]}% uptime`;
  }

  // Dataset size from constants
  if (constants.total_users || constants.active_users) {
    const users = constants.total_users || constants.active_users;
    nfr.datasetSize = users >= 1000000 ? `${users / 1000000}M users` : `${users / 1000}k users`;
  } else if (constants.dataset_size) {
    nfr.datasetSize = `${constants.dataset_size}`;
  }

  return nfr;
}

/**
 * Extract constants/assumptions
 */
function extractConstants(content: string): Record<string, any> {
  const constantsSection = extractSection(content, 'Constants/Assumptions');
  const constants: Record<string, any> = {};

  const lines = constantsSection.split('\n');
  for (const line of lines) {
    const match = line.match(/\*\*(.+):\*\*\s*(.+)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();

      // Try to parse as number or boolean
      if (value === 'true') constants[key] = true;
      else if (value === 'false') constants[key] = false;
      else if (!isNaN(Number(value))) constants[key] = Number(value);
      else constants[key] = value;
    }
  }

  return constants;
}

/**
 * Extract reference solution components and connections
 */
function extractReferenceSolution(content: string) {
  const refSection = extractSection(content, 'Reference Solution');

  // Extract main description (everything before **Components:**)
  const descMatch = refSection.match(/^([\s\S]*?)(?=\*\*Components:\*\*|$)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract components list
  const componentsMatch = refSection.match(/\*\*Components:\*\*([\s\S]*?)(?=\*\*Connections:\*\*|$)/);
  const componentsText = componentsMatch ? componentsMatch[1].trim() : '';
  const components = extractList(componentsText);

  // Extract connections list
  const connectionsMatch = refSection.match(/\*\*Connections:\*\*([\s\S]*?)(?=###|$)/);
  const connectionsText = connectionsMatch ? connectionsMatch[1].trim() : '';
  const connections = extractList(connectionsText);

  return { description, components, connections };
}

/**
 * Parse a single problem from markdown section
 */
function parseProblem(section: string, sectionNumber: number): ParsedProblem | null {
  try {
    const id = extractField(section, /\*\*ID:\*\*\s*(.+)/);
    if (!id) {
      console.warn(`Problem ${sectionNumber}: No ID found, skipping`);
      return null;
    }

    const title = section.match(/^## \d+\.\s*(.+)/m)?.[1]?.trim() || '';
    const category = extractField(section, /\*\*Category:\*\*\s*(.+)/);
    const difficulty = extractField(section, /\*\*Difficulty:\*\*\s*(.+)/);
    const summary = extractSection(section, 'Summary').split('\n')[0].trim();
    const goal = extractSection(section, 'Goal').split('\n')[0].trim();
    const description = extractSection(section, 'Description').trim();

    const constants = extractConstants(section);

    // Try to extract FRs from explicit section first, then derive from description
    const frSection = extractSection(section, 'Functional Requirements');
    let functionalRequirements = extractList(frSection);

    if (functionalRequirements.length === 0) {
      console.warn(`Problem ${sectionNumber} (${id}): No explicit FR section found, deriving from description`);
      functionalRequirements = deriveFRsFromDescription(description, goal);
    }

    // Try to extract NFRs from explicit section first, then derive from constants/analysis
    let nonFunctionalRequirements = extractNFR(section);

    if (Object.keys(nonFunctionalRequirements).length === 0) {
      console.warn(`Problem ${sectionNumber} (${id}): No explicit NFR section found, deriving from constants/analysis`);
      nonFunctionalRequirements = deriveNFRsFromConstants(section, constants);
    }

    const componentsSection = extractSection(section, 'Available Components');
    const availableComponents = extractList(componentsSection);

    const hintsSection = extractSection(section, 'Hints');
    const hints = extractList(hintsSection);

    const referenceSolution = extractReferenceSolution(section);

    return {
      id,
      title,
      category,
      difficulty,
      summary,
      goal,
      description,
      functionalRequirements,
      nonFunctionalRequirements,
      constants,
      availableComponents,
      hints,
      tiers: [], // Not parsing tiers for now
      referenceSolution,
    };
  } catch (error) {
    console.error(`Error parsing problem ${sectionNumber}:`, error);
    return null;
  }
}

/**
 * Parse all problems from a markdown file
 */
function parseMarkdownFile(filePath: string): ParsedProblem[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const problems: ParsedProblem[] = [];

  // Split by ## (problem sections), skip the first element (header)
  const sections = content.split(/^## /gm).filter(s => s.trim());

  sections.forEach((section, index) => {
    // Skip the file header
    if (index === 0 && !section.includes('**ID:**')) return;

    const problem = parseProblem('## ' + section, index + 1);
    if (problem) {
      problems.push(problem);
    }
  });

  return problems;
}

/**
 * Map component names to our component types
 */
function mapComponentType(componentName: string): string {
  const name = componentName.toLowerCase();

  if (name.includes('redis') || name.includes('cache') || name.includes('memcached')) {
    return 'cache';
  }
  if (name.includes('cdn') || name.includes('cloudfront')) {
    return 'cdn';
  }
  if (name.includes('lb') || name.includes('load balancer') || name.includes('alb')) {
    return 'load_balancer';
  }
  if (name.includes('app') || name.includes('api') || name.includes('server') || name.includes('worker')) {
    return 'compute';
  }
  if (name.includes('kafka') || name.includes('rabbitmq') || name.includes('queue') || name.includes('stream')) {
    return 'message_queue';
  }
  if (name.includes('s3') || name.includes('object') || name.includes('blob')) {
    return 'object_storage';
  }
  if (name.includes('websocket') || name.includes('socket')) {
    return 'realtime_messaging';
  }
  if (name.includes('db') || name.includes('database') || name.includes('postgres') ||
      name.includes('mysql') || name.includes('mongo') || name.includes('aurora') ||
      name.includes('elasticsearch') || name.includes('dynamodb')) {
    return 'storage';
  }

  return 'compute'; // Default fallback
}

/**
 * Infer mustHave requirements from reference solution
 */
function inferMustHave(problem: ParsedProblem): Array<{ type: string; reason: string }> {
  const mustHave: Array<{ type: string; reason: string }> = [];
  const seenTypes = new Set<string>();

  // Analyze reference solution components
  problem.referenceSolution.components.forEach(comp => {
    const type = mapComponentType(comp);
    if (!seenTypes.has(type)) {
      seenTypes.add(type);
      mustHave.push({
        type,
        reason: `Need ${comp} for ${problem.summary.toLowerCase()}`,
      });
    }
  });

  // Ensure at least LB + compute + storage
  if (!seenTypes.has('load_balancer') && problem.nonFunctionalRequirements.requestRate) {
    mustHave.push({
      type: 'load_balancer',
      reason: 'Need LB for high availability and traffic distribution',
    });
  }

  return mustHave;
}

/**
 * Infer mustConnect requirements from reference solution
 */
function inferMustConnect(problem: ParsedProblem): Array<{ from: string; to: string; reason: string }> {
  const mustConnect: Array<{ from: string; to: string; reason: string }> = [];

  problem.referenceSolution.connections.forEach(conn => {
    const parts = conn.split('→').map(p => p.trim());
    if (parts.length === 2) {
      const fromType = mapComponentType(parts[0]);
      const toType = mapComponentType(parts[1]);

      mustConnect.push({
        from: fromType,
        to: toType,
        reason: `${parts[0]} routes to ${parts[1]}`,
      });
    }
  });

  return mustConnect;
}

/**
 * Get validator entries for a problem based on its ID
 * Returns basic functional validator that just checks connectivity
 * FR tests should be like brute force - just verify the app is connected and works
 * We don't care about performance or specific components (Redis, S3, etc.)
 */
function getFeatureValidatorEntries(problemId: string): string {
  // All FR tests use the same basic validator
  // Just checks: Client → Compute → Storage path exists
  // Think of it as running on a single dev laptop - does it work at all?
  return `    { name: 'Basic Functionality', validate: basicFunctionalValidator },`;
}

/**
 * Generate TypeScript problem definition code
 */
function generateProblemDefinition(problem: ParsedProblem): string {
  const mustHave = inferMustHave(problem);
  const mustConnect = inferMustConnect(problem);

  const mustHaveStr = mustHave.map(m =>
    `      {\n        type: '${m.type}',\n        reason: '${m.reason}',\n      }`
  ).join(',\n');

  const mustConnectStr = mustConnect.map(m =>
    `      {\n        from: '${m.from}',\n        to: '${m.to}',\n        reason: '${m.reason}',\n      }`
  ).join(',\n');

  // Generate description with key requirements
  const descParts = [problem.description];
  if (problem.functionalRequirements.length > 0) {
    const topFRs = problem.functionalRequirements.slice(0, 4);
    descParts.push(...topFRs.map(fr => `- ${fr}`));
  }
  const description = descParts.join('\n');

  // Format user-facing FRs
  const userFacingFRs = problem.functionalRequirements
    .map(fr => fr.replace(/^- /, ''))
    .map(fr => `'${fr.replace(/'/g, "\\'")}'`)
    .join(',\n    ');

  // Format user-facing NFRs from the NFR object
  const nfrStrings: string[] = [];
  if (problem.nonFunctionalRequirements.latency) {
    nfrStrings.push(`Latency: ${problem.nonFunctionalRequirements.latency}`);
  }
  if (problem.nonFunctionalRequirements.requestRate) {
    nfrStrings.push(`Request Rate: ${problem.nonFunctionalRequirements.requestRate}`);
  }
  if (problem.nonFunctionalRequirements.datasetSize) {
    nfrStrings.push(`Dataset Size: ${problem.nonFunctionalRequirements.datasetSize}`);
  }
  if (problem.nonFunctionalRequirements.availability) {
    nfrStrings.push(`Availability: ${problem.nonFunctionalRequirements.availability}`);
  }
  if (problem.nonFunctionalRequirements.durability) {
    nfrStrings.push(`Durability: ${problem.nonFunctionalRequirements.durability}`);
  }
  const userFacingNFRs = nfrStrings
    .map(nfr => `'${nfr.replace(/'/g, "\\'")}'`)
    .join(',\n    ');

  const camelCaseId = problem.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');

  return `/**
 * ${problem.title}
 * From extracted-problems/system-design/${problem.category}.md
 */
export const ${camelCaseId}ProblemDefinition: ProblemDefinition = {
  id: '${problem.id}',
  title: '${problem.title}',
  description: \`${description}\`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    ${userFacingFRs}
  ],
  userFacingNFRs: [
    ${userFacingNFRs}
  ],

  functionalRequirements: {
    mustHave: [
${mustHaveStr}
    ],
    mustConnect: [
${mustConnectStr}
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

  scenarios: generateScenarios('${problem.id}', problemConfigs['${problem.id}'], [
    ${userFacingFRs}
  ]),

  validators: [
    // Feature-specific validators for each FR
${getFeatureValidatorEntries(problem.id)}
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
`;
}

/**
 * Generate problemConfigs entry
 */
function generateProblemConfig(problem: ParsedProblem): string {
  // Extract RPS from request rate
  let baseRps = 1000;
  if (problem.nonFunctionalRequirements.requestRate) {
    const rateStr = problem.nonFunctionalRequirements.requestRate;
    const match = rateStr.match(/([\d.]+)([kKmM])/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      baseRps = unit === 'k' ? value * 1000 : value * 1000000;
    }
  }

  // Extract latency target
  let maxLatency = 100;
  if (problem.nonFunctionalRequirements.latency) {
    const latencyStr = problem.nonFunctionalRequirements.latency;
    const match = latencyStr.match(/(\d+)ms/);
    if (match) {
      maxLatency = parseInt(match[1]);
    }
  }

  // Extract availability
  let availability = 0.999;
  if (problem.nonFunctionalRequirements.availability) {
    const availStr = problem.nonFunctionalRequirements.availability;
    const match = availStr.match(/([\d.]+)%/);
    if (match) {
      availability = parseFloat(match[1]) / 100;
    }
  }

  // Infer read ratio (default 0.9 for most systems)
  const readRatio = problem.category === 'streaming' ? 0.5 : 0.9;

  return `  '${problem.id}': {
    baseRps: ${baseRps},
    readRatio: ${readRatio},
    maxLatency: ${maxLatency},
    availability: ${availability},
    hasCdn: ${problem.referenceSolution.components.some(c => c.toLowerCase().includes('cdn'))},
    hasCache: ${problem.referenceSolution.components.some(c => c.toLowerCase().includes('cache') || c.toLowerCase().includes('redis'))},
    hasObjectStorage: ${problem.referenceSolution.components.some(c => c.toLowerCase().includes('s3') || c.toLowerCase().includes('object'))},
  },`;
}

/**
 * Main execution
 */
function main() {
  const extractedDir = path.join(__dirname, '../extracted-problems/system-design');
  const categories = ['caching', 'streaming', 'storage', 'gateway', 'search', 'multiregion'];

  console.log('Starting automated problem extraction...\n');

  categories.forEach(category => {
    const filePath = path.join(extractedDir, `${category}.md`);

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }

    console.log(`\n=== Processing ${category}.md ===`);
    const problems = parseMarkdownFile(filePath);
    console.log(`Found ${problems.length} problems`);

    problems.slice(0, 3).forEach((problem, index) => {
      console.log(`\n--- Problem ${index + 1}: ${problem.title} (${problem.id}) ---`);
      console.log(`Category: ${problem.category}, Difficulty: ${problem.difficulty}`);
      console.log(`Summary: ${problem.summary}`);
      console.log(`FR count: ${problem.functionalRequirements.length}`);
      console.log(`Components: ${problem.referenceSolution.components.length}`);
      console.log(`Connections: ${problem.referenceSolution.connections.length}`);

      // Generate and display code
      console.log('\n--- Generated ProblemDefinition ---');
      console.log(generateProblemDefinition(problem));

      console.log('\n--- Generated ProblemConfig ---');
      console.log(generateProblemConfig(problem));
    });
  });

  console.log('\n✅ Parsing test complete!');
}

// Run the main function
main();

export { parseMarkdownFile, generateProblemDefinition, generateProblemConfig, ParsedProblem };
