/**
 * Guided Tutorial Mode Components
 *
 * These components support the step-by-step teaching mode where users learn
 * the system design framework by implementing one FR at a time.
 *
 * Pedagogy:
 * 1. Step 0: Gather FRs (RequirementsGatheringPanel)
 * 2. Steps 1-N: TEACH → SOLVE → TEACH → SOLVE
 *    - LearnPhasePanel: Rich educational content (concepts, examples, quizzes)
 *    - PracticePhasePanel: Hands-on building with hints and validation
 */

export { GuidedTeachingPanel } from './GuidedTeachingPanel';
export { LearnPhasePanel } from './LearnPhasePanel';
export { PracticePhasePanel } from './PracticePhasePanel';
export { GuidedSidebar, DraggableComponent } from './GuidedSidebar';
export { HintSystem, HintIndicator } from './HintSystem';
export { ModeSwitcher, ModeIndicator } from './ModeSwitcher';
export { StepProgressIndicator, StepProgressIndicatorCompact } from './StepProgressIndicator';
export { ProgressRoadmapPanel, ProgressRoadmapCollapsible, ProgressRoadmapInline } from './ProgressRoadmapPanel';
export { StepValidationFeedback, ValidationIndicator } from './StepValidationFeedback';
export { StoryPanel } from './StoryPanel';
export { CelebrationPanel } from './CelebrationPanel';
export { FullScreenLearnPanel } from './FullScreenLearnPanel';
// NEW: Requirements Gathering (Step 0)
export { RequirementsGatheringPanel } from './RequirementsGatheringPanel';
// Cost Summary Widget for practice phase
export { CostSummaryWidget, CostIndicatorCompact } from './CostSummaryWidget';
