import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Teaching Problems - Chapter 1: Reliability, Scalability, Maintainability
 * Total: 15 foundational concept problems
 *
 * Focus: Core principles of data-intensive applications
 */

// ============================================================================
// 1.1 Reliability
// ============================================================================

// ============================================================================
// 1.2 Scalability
// ============================================================================

// Note: Fan-out problem has been integrated into the comprehensive social media platform problem
// (comprehensive-social-media-platform) since it's specifically about Twitter's timeline

// ============================================================================
// 1.3 Maintainability
// ============================================================================


// Export all Chapter 1 problems
// Note: SPOF, Hardware Faults, Vertical Scaling, Horizontal Scaling, Observability, and Operability
// are covered in comprehensive problems (multi-region, capacity planning, etc.)
// Software Errors, Human Errors, Chaos Engineering, Simplicity, Evolvability, and Technical Debt
// have been converted to lessons
// Fan-out has been integrated into the comprehensive social media platform problem
export const ddiaChapter1Problems: ProblemDefinition[] = [
  // All concepts are now covered in comprehensive problems or lessons
];

