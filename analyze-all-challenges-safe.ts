import { TestRunner } from './src/apps/system-design/builder/simulation/testRunner.js';
import { SystemGraph } from './src/apps/system-design/builder/types/graph.js';
import { ComponentNode } from './src/apps/system-design/builder/types/component.js';

// Import challenges directly from individual files to avoid index.ts issues
const challengeFiles = [
  './src/apps/system-design/builder/challenges/instagram.js',
  './src/apps/system-design/builder/challenges/twitter.js',
  './src/apps/system-design/builder/challenges/reddit.js',
  './src/apps/system-design/builder/challenges/linkedin.js',
  './src/apps/system-design/builder/challenges/facebook.js',
  './src/apps/system-design/builder/challenges/tiktok.js',
  './src/apps/system-design/builder/challenges/pinterest.js',
  './src/apps/system-design/builder/challenges/snapchat.js',
  './src/apps/system-design/builder/challenges/discord.js',
  './src/apps/system-design/builder/challenges/medium.js',
  './src/apps/system-design/builder/challenges/amazon.js',
  './src/apps/system-design/builder/challenges/shopify.js',
  './src/apps/system-design/builder/challenges/stripe.js',
  './src/apps/system-design/builder/challenges/uber.js',
  './src/apps/system-design/builder/challenges/airbnb.js',
  './src/apps/system-design/builder/challenges/netflix.js',
  './src/apps/system-design/builder/challenges/spotify.js',
  './src/apps/system-design/builder/challenges/youtube.js',
  './src/apps/system-design/builder/challenges/twitch.js',
  './src/apps/system-design/builder/challenges/hulu.js',
  './src/apps/system-design/builder/challenges/whatsapp.js',
  './src/apps/system-design/builder/challenges/slack.js',
  './src/apps/system-design/builder/challenges/telegram.js',
  './src/apps/system-design/builder/challenges/facebookMessenger.js',
  './src/apps/system-design/builder/challenges/pastebin.js',
  './src/apps/system-design/builder/challenges/dropbox.js',
  './src/apps/system-design/builder/challenges/googleDrive.js',
  './src/apps/system-design/builder/challenges/github.js',
  './src/apps/system-design/builder/challenges/stackoverflow.js',
  './src/apps/system-design/builder/challenges/doordash.js',
  './src/apps/system-design/builder/challenges/instacart.js',
  './src/apps/system-design/builder/challenges/yelp.js',
  './src/apps/system-design/builder/challenges/notion.js',
  './src/apps/system-design/builder/challenges/trello.js',
  './src/apps/system-design/builder/challenges/googleCalendar.js',
  './src/apps/system-design/builder/challenges/zoom.js',
  './src/apps/system-design/builder/challenges/steam.js',
  './src/apps/system-design/builder/challenges/ticketMaster.js',
  './src/apps/system-design/builder/challenges/booking.js',
  './src/apps/system-design/builder/challenges/weather.js',
  './src/apps/system-design/builder/challenges/tinyUrlL6.js',
  './src/apps/system-design/builder/challenges/tinyUrl.js',
  './src/apps/system-design/builder/challenges/kafkaStreamingPipeline.js',
  './src/apps/system-design/builder/challenges/collaborativeEditor.js',
  './src/apps/system-design/builder/challenges/ecommerce.js',
  './src/apps/system-design/builder/challenges/apiGateway.js',
  './src/apps/system-design/builder/challenges/facebookApiGateway.js',
  './src/apps/system-design/builder/challenges/netflixGraphql.js',
  './src/apps/system-design/builder/challenges/salesforceCrm.js',
  './src/apps/system-design/builder/challenges/uberDataPlatform.js',
  './src/apps/system-design/builder/challenges/googleCicd.js',
  './src/apps/system-design/builder/challenges/appleEncryption.js',
  './src/apps/system-design/builder/challenges/datadogObservability.js',
  './src/apps/system-design/builder/challenges/googleKubernetes.js',
  './src/apps/system-design/builder/challenges/metaMlTraining.js',
  './src/apps/system-design/builder/challenges/sixGNetwork.js',
  './src/apps/system-design/builder/challenges/postTcpProtocol.js',
  './src/apps/system-design/builder/challenges/beyondCap.js',
  './src/apps/system-design/builder/challenges/quantumConsensus.js',
  './src/apps/system-design/builder/challenges/relativisticConsensus.js',
  './src/apps/system-design/builder/challenges/zeroKnowledge.js',
  './src/apps/system-design/builder/challenges/foodBlog.js',
  './src/apps/system-design/builder/challenges/todoApp.js',
  './src/apps/system-design/builder/challenges/webCrawler.js',
];

function solutionToGraph(solution: any): SystemGraph {
  const componentNodes: ComponentNode[] = solution.components.map((comp: any, index: number) => ({
    id: `${comp.type}_${index}`,
    type: comp.type,
    config: comp.config,
  }));

  const typeToId = new Map<string, string>();
  componentNodes.forEach(node => {
    if (!typeToId.has(node.type)) {
      typeToId.set(node.type, node.id);
    }
  });

  const connections = solution.connections.map((conn: any) => ({
    from: typeToId.get(conn.from) || conn.from,
    to: typeToId.get(conn.to) || conn.to,
    type: 'read_write' as const,
  }));

  return { components: componentNodes, connections };
}

async function analyzeAllChallenges() {
  console.log(`\n=== Analyzing Challenges ===\n`);

  const failingChallenges: string[] = [];
  const passingChallenges: string[] = [];
  const noSolutionChallenges: string[] = [];
  const errorChallenges: string[] = [];

  for (const file of challengeFiles) {
    try {
      const module = await import(file);
      const challenge = Object.values(module)[0] as any;

      if (!challenge || !challenge.title) {
        continue;
      }

      if (!challenge.solution) {
        noSolutionChallenges.push(`${challenge.title} (${challenge.id || 'no id'})`);
        continue;
      }

      const testRunner = new TestRunner();
      const graph = solutionToGraph(challenge.solution);

      let hasFailing = false;
      challenge.testCases.forEach((testCase: any) => {
        try {
          const result = testRunner.runTestCase(graph, testCase);
          if (!result.passed) {
            hasFailing = true;
          }
        } catch (err) {
          hasFailing = true;
        }
      });

      if (hasFailing) {
        failingChallenges.push(`${challenge.title} (${challenge.id || 'no id'})`);
      } else {
        passingChallenges.push(`${challenge.title} (${challenge.id || 'no id'})`);
      }
    } catch (err) {
      errorChallenges.push(`${file}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\n=== SUMMARY ===\n`);
  console.log(`Total Analyzed: ${passingChallenges.length + failingChallenges.length + noSolutionChallenges.length}`);
  console.log(`Passing: ${passingChallenges.length}`);
  console.log(`Failing: ${failingChallenges.length}`);
  console.log(`No Solution: ${noSolutionChallenges.length}`);
  console.log(`Errors: ${errorChallenges.length}\n`);

  if (failingChallenges.length > 0) {
    console.log(`\n=== FAILING CHALLENGES (${failingChallenges.length}) ===\n`);
    failingChallenges.forEach(c => console.log(`  ❌ ${c}`));
  }

  if (noSolutionChallenges.length > 0) {
    console.log(`\n=== NO SOLUTION (${noSolutionChallenges.length}) ===\n`);
    noSolutionChallenges.forEach(c => console.log(`  ⚠️  ${c}`));
  }

  if (errorChallenges.length > 0) {
    console.log(`\n=== ERRORS (${errorChallenges.length}) ===\n`);
    errorChallenges.forEach(c => console.log(`  ⛔ ${c}`));
  }
}

analyzeAllChallenges().catch(console.error);
