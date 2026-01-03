import {
  AdaptiveLearningQueue,
  FamilyMasteryRecord,
  QueuedFamily,
  QueueModification,
  PausedFamily,
  VariationAttempt
} from '../types/concept-families';
import { familyDependencyGraph } from '../data/familyDependencyGraph';
import { struggleAnalyzer } from './struggleAnalyzer';

export class AdaptiveQueueManager {
  /**
   * Called after each attempt - decides whether to reorder the queue.
   * Returns the NEW queue state.
   */
  public handleAttemptComplete(
    attempt: VariationAttempt,
    familyId: string,
    currentQueue: AdaptiveLearningQueue,
    allMasteryRecords: Record<string, FamilyMasteryRecord>
  ): AdaptiveLearningQueue {

    // 1. Calculate Struggle
    const struggleScore = struggleAnalyzer.calculateStruggleScore(attempt);

    // 2. Check Mastery
    if (attempt.qualifiesForMastery) {
      // SUCCESS PATH: Mark mastered, check if any paused families can resume
      return this.handleMastery(familyId, currentQueue, allMasteryRecords);
    }

    // 3. Check Major Struggle
    if (struggleAnalyzer.shouldTriggerIntervention(struggleScore)) {
      // MAJOR STRUGGLE: Insert prerequisites
      return this.handleMajorStruggle(familyId, struggleScore, currentQueue, allMasteryRecords);
    }

    // 4. Minor Struggle
    // Just continue with next variation next time (logic handled by selector)
    // No queue change needed.
    return currentQueue;
  }

  private handleMajorStruggle(
    familyId: string,
    struggleScore: number,
    queue: AdaptiveLearningQueue,
    allMasteryRecords: Record<string, FamilyMasteryRecord>
  ): AdaptiveLearningQueue {

    // 1. Find unmastered prerequisites
    const prerequisites = familyDependencyGraph.getPrerequisites(familyId);

    const unmasteredPrereqs = prerequisites.filter(prereqId => {
      const record = allMasteryRecords[prereqId];
      return !record || !record.isMastered;
    });

    if (unmasteredPrereqs.length === 0) {
      // No prerequisites to work on (foundational struggle)
      // TODO: Could insert specific 'remedial' content here if we had it.
      // For now, no queue change.
      return queue;
    }

    // 2. Pause the current family
    // Use plain object for JSON/persist compatibility
    const prereqProgress: Record<string, boolean> = {};
    unmasteredPrereqs.forEach(id => { prereqProgress[id] = false; });

    const pausedFamily: PausedFamily = {
      familyId,
      pausedAt: Date.now(),
      requiredPrerequisites: unmasteredPrereqs,
      prereqProgress: prereqProgress
    };

    // 3. Insert prerequisites at front of queue
    const newQueueItems: QueuedFamily[] = unmasteredPrereqs.map((prereqId, index) => ({
      familyId: prereqId,
      priority: index, // Lower = more urgent (relative to these inserts)
      reason: 'prerequisite-needed',
      addedAt: Date.now()
    }));

    // 4. Record the modification
    const modification: QueueModification = {
      timestamp: Date.now(),
      action: 'insert-prereqs',
      affectedFamilies: [familyId, ...unmasteredPrereqs],
      reason: `Struggle score ${struggleScore} on ${familyId} - inserted ${unmasteredPrereqs.length} prerequisites`
    };

    // Filter out the paused family from the active queue
    const filteredQueue = queue.queue.filter(q => q.familyId !== familyId);

    return {
      queue: [...newQueueItems, ...filteredQueue],
      pausedFamilies: [...queue.pausedFamilies, pausedFamily],
      queueHistory: [...queue.queueHistory, modification]
    };
  }

  private handleMastery(
    masteredFamilyId: string,
    queue: AdaptiveLearningQueue,
    allMasteryRecords: Record<string, FamilyMasteryRecord>
  ): AdaptiveLearningQueue {

    // Check if any paused families can now resume
    const resumableFamilies: string[] = [];
    const stillPausedFamilies: PausedFamily[] = [];

    // We need to check all paused families
    for (const paused of queue.pausedFamilies) {
      // Update prereq progress
      if (paused.requiredPrerequisites.includes(masteredFamilyId)) {
        paused.prereqProgress[masteredFamilyId] = true;
      }

      // Check if all prerequisites are now mastered
      // We check against the Master Record store for truth
      const allPrereqsMastered = paused.requiredPrerequisites.every(prereqId => {
        // If it's the one we just mastered, it's true.
        if (prereqId === masteredFamilyId) return true;

        // Otherwise check records
        const record = allMasteryRecords[prereqId];
        return record && record.isMastered;
      });

      if (allPrereqsMastered) {
        resumableFamilies.push(paused.familyId);
      } else {
        stillPausedFamilies.push(paused);
      }
    }

    if (resumableFamilies.length === 0) {
      // Just remove the mastered item from queue if it's there
      return {
        ...queue,
        queue: queue.queue.filter(q => q.familyId !== masteredFamilyId)
      };
    }

    // Add resumable families back to queue
    const resumeQueueItems: QueuedFamily[] = resumableFamilies.map(familyId => ({
      familyId,
      priority: 0, // High priority - they've been waiting!
      reason: 'retry-after-prereqs',
      addedAt: Date.now()
    }));

    // Remove mastered family from queue
    const newQueue = queue.queue.filter(q => q.familyId !== masteredFamilyId);

    // Record modification
    const modification: QueueModification = {
      timestamp: Date.now(),
      action: 'resume-paused',
      affectedFamilies: [masteredFamilyId, ...resumableFamilies],
      reason: `Mastered ${masteredFamilyId}, resumed ${resumableFamilies.length} paused families`
    };

    return {
      queue: [...resumeQueueItems, ...newQueue],
      pausedFamilies: stillPausedFamilies,
      queueHistory: [
        ...queue.queueHistory,
        modification
      ]
    };
  }
}

export const adaptiveQueueManager = new AdaptiveQueueManager();
