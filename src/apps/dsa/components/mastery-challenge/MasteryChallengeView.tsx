import React, { useEffect, useState, useRef } from 'react';
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';
import { adaptiveQueueManager } from '../../services/adaptiveQueueManager';
import { variationSelector } from '../../services/variationSelector';
import { struggleAnalyzer } from '../../services/struggleAnalyzer';
import { AdaptiveQueuePanel } from './AdaptiveQueuePanel';
import { StruggleDetectionModal } from './StruggleDetectionModal';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ProblemVariation, VariationAttempt } from '../../types/concept-families';
import { familyDependencyGraph } from '../../data/familyDependencyGraph';
import { Play, CheckCircle, Flame } from 'lucide-react';
// Assuming we have a component to display/run the actual problem. 
// For now, mocking the problem runner interface or using a placeholder.
// In real app, this would be the CodeWorkspace with props injected.

const PLACEHOLDER_PROBLEM_runner = ({ problemId, onResult }: any) => (
  <div className="p-8 border rounded-lg bg-muted text-center space-y-4">
    <h2 className="text-xl font-bold">Solving: {problemId}</h2>
    <p className="text-muted-foreground">Editor and Problem Description would go here.</p>
    <div className="flex gap-4 justify-center">
      <Button onClick={() => onResult({ passed: true, hintsUsed: 0, attempts: 1, timeMs: 5000 })} className="bg-green-600">
        Simulate Pass (First Try)
      </Button>
      <Button onClick={() => onResult({ passed: true, hintsUsed: 2, attempts: 3, timeMs: 25000 })} variant="outline">
        Simulate Struggle (Pass but slow/hints)
      </Button>
      <Button onClick={() => onResult({ passed: false, hintsUsed: 0, attempts: 1, timeMs: 10000 })} variant="destructive">
        Simulate Fail
      </Button>
    </div>
  </div>
);

export const MasteryChallengeView: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const {
    learningQueue,
    familyRecords,
    initializeStore,
    updateFamilyRecord,
    setQueue,
    setPausedFamilies,
    addQueueHistory,
    getFamilyRecord
  } = useFamilyMasteryStore();

  const [currentVariation, setCurrentVariation] = useState<ProblemVariation | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [struggleModalOpen, setStruggleModalOpen] = useState(false);
  const [struggleDetails, setStruggleDetails] = useState<{ reason: string[], prereqs: string[], familyId: string }>({ reason: [], prereqs: [], familyId: '' });

  // Timer refs
  const startTimeRef = useRef<number>(0);

  // Initial Load
  useEffect(() => {
    initializeStore();
  }, []);

  // 1. START SESSION
  const handleStartSession = () => {
    if (!learningQueue || learningQueue.queue.length === 0) return;

    const nextFamilyItem = learningQueue.queue[0];
    const record = getFamilyRecord(nextFamilyItem.familyId);

    if (!record) return; // Should not happen

    // Select specific variation
    const variation = variationSelector.selectNextVariation(nextFamilyItem.familyId, record);

    if (variation) {
      setCurrentVariation(variation);
      setIsSessionActive(true);
      startTimeRef.current = Date.now();
    } else {
      // Error or done
      alert("No variation available for this family.");
    }
  };

  // 2. PROBLEM COMPLETION
  const handleProblemResult = (result: { passed: boolean, hintsUsed: number, attempts: number, timeMs?: number }) => {
    if (!currentVariation || !learningQueue) return;

    const timeSpent = result.timeMs || (Date.now() - startTimeRef.current);
    const familyId = learningQueue.queue[0].familyId; // Current head of queue
    const record = getFamilyRecord(familyId);

    if (!record) return;

    // Construct Attempt Object
    const attempt: VariationAttempt = {
      variationId: currentVariation.variationId,
      problemId: currentVariation.problemId,
      attemptNumber: (record.attempts.filter(a => a.variationId === currentVariation.variationId).length) + 1,
      timestamp: Date.now(),
      phase: 'mastery-challenge', // Assuming purely mastery mode for now
      timeMs: timeSpent,
      hintsUsed: result.hintsUsed,
      passed: result.passed,
      submissionAttempts: result.attempts,
      isFirstAttempt: !record.usedVariations.includes(currentVariation.variationId),
      qualifiesForMastery: result.passed && !record.usedVariations.includes(currentVariation.variationId) && timeSpent <= 20 * 60 * 1000 && result.hintsUsed <= 1 && result.attempts <= 2,
      struggleScore: 0, // Calculated below
      triggeredPrerequisites: [],
      triggeredLearningReturn: false
    };

    attempt.struggleScore = struggleAnalyzer.calculateStruggleScore(attempt);

    // UPDATE STORE LOGIC via Manager
    const newQueueState = adaptiveQueueManager.handleAttemptComplete(
      attempt,
      familyId,
      learningQueue,
      familyRecords
    );

    // UPDATE LOCAL RECORD
    const updatedUsedVariations = [...record.usedVariations];
    if (!updatedUsedVariations.includes(currentVariation.variationId)) {
      updatedUsedVariations.push(currentVariation.variationId);
    }

    updateFamilyRecord(familyId, {
      attempts: [...record.attempts, attempt],
      usedVariations: updatedUsedVariations,
      totalAttempts: record.totalAttempts + 1,
      isMastered: attempt.qualifiesForMastery || record.isMastered, // Sticky mastery
      masteredAt: attempt.qualifiesForMastery ? Date.now() : record.masteredAt
    });

    // UPDATE QUEUE IN STORE
    setQueue(newQueueState.queue);
    setPausedFamilies(newQueueState.pausedFamilies);
    if (newQueueState.queueHistory.length > learningQueue.queueHistory.length) {
      // There was a modification
      addQueueHistory(newQueueState.queueHistory[newQueueState.queueHistory.length - 1]);
    }

    // UI FEEDBACK
    if (attempt.qualifiesForMastery) {
      // Show Success / Next
      alert("Mastered! Moving to next topic.");
    } else if (struggleAnalyzer.shouldTriggerIntervention(attempt.struggleScore)) {
      // Show Struggle Modal
      const prereqs = familyDependencyGraph.getPrerequisites(familyId).filter(pid => {
        const r = familyRecords[pid];
        return !r || !r.isMastered;
      });

      setStruggleDetails({
        reason: struggleAnalyzer.getStruggleReason(attempt),
        prereqs: prereqs,
        familyId: familyId
      });
      setStruggleModalOpen(true);
    }

    // Reset Session
    setIsSessionActive(false);
    setCurrentVariation(null);
  };

  if (!learningQueue) return <div>Loading...</div>;

  return (
    <div className={`flex ${embedded ? 'h-full' : 'h-screen'} bg-slate-50 dark:bg-slate-950 p-4 gap-4 overflow-hidden`}>
      {/* LEFT: QUEUE */}
      <div className="w-1/4 min-w-[300px]">
        <AdaptiveQueuePanel />
      </div>

      {/* RIGHT: WORKSPACE */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 border-none shadow-none bg-transparent">
          <CardContent className="h-full flex flex-col justify-center items-center p-0">

            {!isSessionActive ? (
              <div className="text-center space-y-6 max-w-lg">
                <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-xl border">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Flame className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Ready for Mastery?</h1>
                  <p className="text-muted-foreground mb-8">
                    Solve fresh variations on your first attempt to prove your skills.
                    We'll adapt the queue if you get stuck.
                  </p>

                  {learningQueue.queue.length > 0 ? (
                    <Button size="lg" onClick={handleStartSession} className="w-full text-lg h-14 shadow-primary/25 shadow-lg">
                      <Play className="mr-2 w-5 h-5" />
                      Start Next Challenge
                    </Button>
                  ) : (
                    <div className="text-green-600 font-bold flex items-center justify-center gap-2">
                      <CheckCircle />
                      Queue Empty! Course Complete!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full max-w-4xl pt-10">
                {/* MOCK RUNNER */}
                <PLACEHOLDER_PROBLEM_runner
                  problemId={currentVariation?.problemId}
                  onResult={handleProblemResult}
                />
                <div className="mt-4 text-center">
                  <Button variant="ghost" onClick={() => setIsSessionActive(false)}>
                    Cancel Session
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODALS */}
      <StruggleDetectionModal
        isOpen={struggleModalOpen}
        onClose={() => setStruggleModalOpen(false)}
        struggleReason={struggleDetails.reason}
        insertedPrerequisites={struggleDetails.prereqs}
        familyId={struggleDetails.familyId}
      />
    </div>
  );
};
