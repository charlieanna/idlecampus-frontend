#!/usr/bin/env ts-node
/**
 * CLI Tool: Fix All Solutions
 *
 * Automatically fixes solutions across all challenges by migrating
 * from old config format to new commodity hardware model.
 *
 * Usage:
 *   ts-node fixAllSolutions.ts [--challenge <challenge-id>] [--dry-run] [--verbose]
 *
 * Options:
 *   --challenge <id>    Fix only specific challenge (e.g., 'tinyurl')
 *   --dry-run           Show what would be changed without modifying files
 *   --verbose           Show detailed change reports
 *   --help              Show this help message
 *
 * Examples:
 *   ts-node fixAllSolutions.ts                    # Fix all challenges
 *   ts-node fixAllSolutions.ts --dry-run          # Preview changes
 *   ts-node fixAllSolutions.ts --challenge tinyurl # Fix only TinyURL
 *   ts-node fixAllSolutions.ts --verbose          # Detailed output
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  fixSolution,
  fixChallengeSolutions,
  validateFixedSolution,
  generateFixReport,
  ChallengeContext,
} from './fixSolution';
import { challenges } from '../challenges';

// CLI arguments
interface CLIArgs {
  challengeId?: string;
  dryRun: boolean;
  verbose: boolean;
  help: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {
    dryRun: false,
    verbose: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--challenge':
        parsed.challengeId = args[++i];
        break;
      case '--dry-run':
        parsed.dryRun = true;
        break;
      case '--verbose':
        parsed.verbose = true;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
    }
  }

  return parsed;
}

function showHelp(): void {
  console.log(`
CLI Tool: Fix All Solutions

Automatically fixes solutions across all challenges by migrating
from old config format to new commodity hardware model.

Usage:
  ts-node fixAllSolutions.ts [--challenge <challenge-id>] [--dry-run] [--verbose]

Options:
  --challenge <id>    Fix only specific challenge (e.g., 'tinyurl')
  --dry-run           Show what would be changed without modifying files
  --verbose           Show detailed change reports
  --help              Show this help message

Examples:
  ts-node fixAllSolutions.ts                    # Fix all challenges
  ts-node fixAllSolutions.ts --dry-run          # Preview changes
  ts-node fixAllSolutions.ts --challenge tinyurl # Fix only TinyURL
  ts-node fixAllSolutions.ts --verbose          # Detailed output
  `);
}

/**
 * Create challenge context from challenge definition
 */
function createContext(challenge: any): ChallengeContext {
  const context: ChallengeContext = {
    id: challenge.id,
  };

  // Try to infer data model and traffic patterns
  // This would need to be extended based on actual challenge structure
  if (challenge.dataModel) {
    context.dataModel = challenge.dataModel;
  }

  return context;
}

/**
 * Fix a single challenge
 */
function fixChallenge(
  challenge: any,
  args: CLIArgs
): { success: boolean; changes: number; errors: string[] } {
  const context = createContext(challenge);
  let changes = 0;
  const errors: string[] = [];

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Challenge: ${challenge.title} (${challenge.id})`);
  console.log('='.repeat(60));

  // Fix challenge-level solution
  if (challenge.solution) {
    const originalSolution = JSON.parse(JSON.stringify(challenge.solution));
    const fixedSolution = fixSolution(challenge.solution, context);

    const validation = validateFixedSolution(fixedSolution);

    if (!validation.valid) {
      console.log(`❌ Challenge-level solution has validation errors:`);
      validation.errors.forEach((err) => console.log(`   - ${err}`));
      errors.push(...validation.errors);
    } else {
      const report = generateFixReport(originalSolution, fixedSolution);
      if (report !== 'No changes needed - solution already in correct format.') {
        changes++;
        console.log(`✅ Fixed challenge-level solution`);
        if (args.verbose) {
          console.log(report);
        }

        if (!args.dryRun) {
          challenge.solution = fixedSolution;
        }
      } else {
        console.log(`✓ Challenge-level solution already correct`);
      }
    }
  } else {
    console.log(`ℹ No challenge-level solution`);
  }

  // Fix test case solutions
  if (challenge.testCases) {
    console.log(`\nTest Cases: ${challenge.testCases.length} total`);

    let testCaseChanges = 0;
    for (const testCase of challenge.testCases) {
      if (testCase.solution) {
        const originalSolution = JSON.parse(JSON.stringify(testCase.solution));
        const fixedSolution = fixSolution(testCase.solution, context);

        const validation = validateFixedSolution(fixedSolution);

        if (!validation.valid) {
          console.log(
            `❌ Test '${testCase.name}' (${testCase.requirement}) has validation errors:`
          );
          validation.errors.forEach((err) => console.log(`   - ${err}`));
          errors.push(...validation.errors);
        } else {
          const report = generateFixReport(originalSolution, fixedSolution);
          if (
            report !== 'No changes needed - solution already in correct format.'
          ) {
            testCaseChanges++;
            changes++;

            if (args.verbose) {
              console.log(`✅ Fixed test '${testCase.name}' (${testCase.requirement})`);
              console.log(report);
            }

            if (!args.dryRun) {
              testCase.solution = fixedSolution;
            }
          }
        }
      }
    }

    console.log(`✅ Fixed ${testCaseChanges} test case solutions`);
  }

  return {
    success: errors.length === 0,
    changes,
    errors,
  };
}

/**
 * Main execution
 */
function main(): void {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    return;
  }

  console.log('\n🔧 Universal Solution Fixing Tool\n');

  if (args.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  // Filter challenges if specific one requested
  let challengesToFix = challenges;
  if (args.challengeId) {
    challengesToFix = challenges.filter((c) => c.id === args.challengeId);
    if (challengesToFix.length === 0) {
      console.error(`❌ Challenge '${args.challengeId}' not found`);
      console.log(
        `\nAvailable challenges: ${challenges.map((c) => c.id).join(', ')}`
      );
      process.exit(1);
    }
  }

  console.log(`Processing ${challengesToFix.length} challenge(s)...\n`);

  // Fix each challenge
  const results = {
    total: challengesToFix.length,
    success: 0,
    failed: 0,
    totalChanges: 0,
    errors: [] as string[],
  };

  for (const challenge of challengesToFix) {
    const result = fixChallenge(challenge, args);

    if (result.success) {
      results.success++;
      results.totalChanges += result.changes;
    } else {
      results.failed++;
      results.errors.push(...result.errors);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total challenges processed: ${results.total}`);
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`🔄 Total changes: ${results.totalChanges}`);

  if (args.dryRun) {
    console.log(`\n⚠️  DRY RUN - No files were modified`);
    console.log(
      `Run without --dry-run to apply changes: ts-node fixAllSolutions.ts`
    );
  } else if (results.totalChanges > 0) {
    console.log(`\n✅ Changes applied successfully!`);
    console.log(`Next steps:`);
    console.log(`1. Review the changes`);
    console.log(`2. Run tests to verify solutions pass`);
    console.log(`3. Commit the changes to version control`);
  } else {
    console.log(`\n✓ All solutions already in correct format!`);
  }

  if (results.errors.length > 0) {
    console.log(`\n⚠️  ${results.errors.length} validation error(s) found:`);
    results.errors.forEach((err) => console.log(`   - ${err}`));
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
