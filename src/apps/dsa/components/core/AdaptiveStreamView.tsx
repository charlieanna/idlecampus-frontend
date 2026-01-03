
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CodeEditor } from './CodeEditor';
import { AdaptiveEngine, GraderResult, NavigationResult, Navigator } from '../../services/AdaptiveEngine';
import { runPythonCode } from '../../utils/pyodideRunner';
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';
import { ArrowRight, Brain, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

// Decay threshold for triggering review (40% = 8 problems since mastery)
const DECAY_THRESHOLD = 0.4;
const DECAY_RATE_PER_PROBLEM = 0.05; // 5% per problem
const STRUGGLE_DECAY_MULTIPLIER = 1.4; // 40% faster decay for struggled problems

// Calculate progress-based decay (not time-based)
const calculateProgressDecay = (
  masteredAtIndex: number | null,
  currentIndex: number,
  usedHelpOnMastery: boolean,
  lastReviewedAtIndex: number | null
): number => {
  if (masteredAtIndex === null) return 0;

  // Use last review index if available, otherwise use mastery index
  const referenceIndex = lastReviewedAtIndex ?? masteredAtIndex;
  const problemsSince = currentIndex - referenceIndex;

  if (problemsSince <= 0) return 0;

  // Base decay: 5% per problem
  let decay = problemsSince * DECAY_RATE_PER_PROBLEM;

  // Struggle multiplier: struggled problems decay faster
  if (usedHelpOnMastery) {
    decay *= STRUGGLE_DECAY_MULTIPLIER;
  }

  return Math.min(decay, 0.8); // Cap at 80%
};

// Import Module 1 Content directly for Prototype fallback
import challenges1 from '../../content/modules/01_arrays_hashing/challenges.json';
import remedials1 from '../../content/modules/01_arrays_hashing/remedials.json';
import tutorials1 from '../../content/modules/01_arrays_hashing/tutorials.json';

const engine = new AdaptiveEngine();

interface AdaptiveStreamViewProps {
  moduleId?: string;
  onBack?: () => void;
  onNavigateToModule?: (moduleId: string) => void;
}

export const AdaptiveStreamView: React.FC<AdaptiveStreamViewProps> = ({ moduleId, onBack, onNavigateToModule }) => {
  // Connect to mastery store for persistence and decay tracking
  const { familyRecords, updateFamilyRecord } = useFamilyMasteryStore();

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [starterCode, setStarterCode] = useState<string>("");
  const [feedback, setFeedback] = useState<NavigationResult | null>(null);
  const [graderStatus, setGraderStatus] = useState<GraderResult | null>(null);

  // Track original challenge and remedial for navigation back after help
  const [originalChallenge, setOriginalChallenge] = useState<any>(null);
  const [lastRemedial, setLastRemedial] = useState<any>(null);

  // Track struggle metrics for current problem
  const [attemptCount, setAttemptCount] = useState(0);
  const [usedHelp, setUsedHelp] = useState(false);

  // Review mode state (for spaced repetition)
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewingProblemId, setReviewingProblemId] = useState<string | null>(null);

  // Key to force CodeEditor remount on question change
  const [editorKey, setEditorKey] = useState(0);

  // Track current question index for persistence
  const [questionIndex, setQuestionIndex] = useState(() => {
    const saved = localStorage.getItem('adaptiveStreamIndex');
    console.log('Loading questionIndex from localStorage:', saved);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Local state for module content
  const [moduleContent, setModuleContent] = useState<any>({
    challenges: challenges1,
    remedials: remedials1,
    tutorials: tutorials1
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load - Load module content if ID is provided
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      if (moduleId) {
        const config = await engine.loadModuleConfig(moduleId);
        if (config) {
          const rawChallenges = config.challenges.default || config.challenges;
          const rawRemedials = config.remedials.default || config.remedials;
          const rawTutorials = config.tutorials.default || config.tutorials;

          const challenges = rawChallenges.map((q: any) => ({ ...q, tier: 'Challenge', module: moduleId }));
          const remedials = rawRemedials.map((q: any) => ({ ...q, tier: 'Remedial', module: moduleId }));
          const tutorials = rawTutorials.map((q: any) => ({ ...q, tier: 'Tutorial', module: moduleId }));

          setModuleContent({ challenges, remedials, tutorials });

          // Set question based on saved index
          const idx = Math.min(questionIndex, challenges.length - 1);
          const q1 = challenges[idx];
          setCurrentQuestion(q1);
          setStarterCode(q1.starterCode || `def solution():\n    # Problem: ${q1.title}\n    # Write your solution here\n    pass`);
          setEditorKey(k => k + 1);
        } else {
          console.error(`Could not load module: ${moduleId}`);
        }
      } else {
        // Fallback to static Module 1
        const challenges = challenges1.map(q => ({ ...q, tier: 'Challenge', module: 'Arrays & Hashing' }));
        const remedials = remedials1.map(q => ({ ...q, tier: 'Remedial', module: 'Arrays & Hashing' }));
        const tutorials = tutorials1.map(q => ({ ...q, tier: 'Tutorial', module: 'Arrays & Hashing' }));

        setModuleContent({ challenges, remedials, tutorials });

        const idx = Math.min(questionIndex, challenges.length - 1);
        const q1 = challenges[idx];
        setCurrentQuestion(q1);
        setStarterCode(q1.starterCode || `def solution():\n    # Problem: ${q1.title}\n    # Write your solution here\n    pass`);
        setEditorKey(k => k + 1);
      }
      setIsLoading(false);
    };

    loadContent();
  }, [moduleId, questionIndex]);

  // Handle code run from editor - actually executes Python code
  const handleCodeRun = async (code: string) => {
    if (!currentQuestion) return { success: false, output: '', error: 'No question loaded' };

    // Track submission attempts
    setAttemptCount(prev => prev + 1);

    const testCases = currentQuestion.testCases || [];

    if (testCases.length === 0) {
      return { success: false, output: '', error: 'No test cases available' };
    }

    // Build test harness
    const functionMatch = code.match(/def\s+(\w+)\s*\(/);
    const functionName = functionMatch ? functionMatch[1] : 'solution';

    let allPassed = true;
    let testOutput = '';
    const testResults: any[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const testCode = `
${code}

# Test case ${i + 1}
try:
    result = ${functionName}(${tc.input})
    expected = ${tc.expectedOutput}
    passed = result == expected
    print(f"TEST_RESULT:{passed}:{result}:{expected}")
except Exception as e:
    print(f"TEST_ERROR:{e}")
`;

      try {
        const result = await runPythonCode(testCode);
        const output = result.output || '';

        if (result.error) {
          // Syntax error
          testResults.push({ id: tc.id, passed: false, error: result.error });
          testOutput += `✗ Test ${i + 1}: ${result.error}\n`;
          allPassed = false;

          // On syntax error, route to tutorial
          const graderResult: GraderResult = 'SYNTAX_FAIL';
          const plan = Navigator.getNextStep(currentQuestion, graderResult);
          setGraderStatus(graderResult);
          setFeedback(plan);
          return { success: false, output: testOutput, error: result.error, testResults };
        } else if (output.includes('TEST_RESULT:True')) {
          testResults.push({ id: tc.id, passed: true, input: tc.input, expected: tc.expectedOutput });
          testOutput += `✓ Test ${i + 1}: Passed\n`;
        } else if (output.includes('TEST_RESULT:False')) {
          const match = output.match(/TEST_RESULT:False:(.+):(.+)/);
          const actual = match ? match[1] : 'unknown';
          testResults.push({ id: tc.id, passed: false, input: tc.input, expected: tc.expectedOutput, actual });
          testOutput += `✗ Test ${i + 1}: Failed\n  Input: ${tc.input}\n  Expected: ${tc.expectedOutput}\n  Got: ${actual}\n`;
          allPassed = false;
        } else if (output.includes('TEST_ERROR')) {
          const errorMatch = output.match(/TEST_ERROR:(.+)/);
          const errorMsg = errorMatch ? errorMatch[1] : 'Unknown error';
          testResults.push({ id: tc.id, passed: false, error: errorMsg });
          testOutput += `✗ Test ${i + 1}: Error - ${errorMsg}\n`;
          allPassed = false;
        } else {
          // Unexpected output - treat as failure
          testResults.push({ id: tc.id, passed: false, error: 'Unexpected output', actual: output });
          testOutput += `✗ Test ${i + 1}: Unexpected output\n  Raw: ${output.slice(0, 100)}\n`;
          allPassed = false;
        }
      } catch (err: any) {
        testResults.push({ id: tc.id, passed: false, error: err.message });
        testOutput += `✗ Test ${i + 1}: ${err.message}\n`;
        allPassed = false;
      }
    }

    // Determine grader result based on test outcomes
    const passedCount = testResults.filter(t => t.passed).length;
    let graderResult: GraderResult;

    if (allPassed) {
      graderResult = 'STRONG_PASS';
      // Save progress immediately when passing - advance to next problem index
      const challenges = moduleContent.challenges;
      const currentIdx = challenges.findIndex((q: any) => q.id === currentQuestion.id);
      if (currentIdx >= 0 && currentIdx < challenges.length - 1) {
        const nextIdx = currentIdx + 1;
        localStorage.setItem('adaptiveStreamIndex', String(nextIdx));
        console.log('Progress saved: advancing to index', nextIdx);
      }

      // Record mastery to store for decay tracking
      const problemId = isReviewMode ? reviewingProblemId : currentQuestion.id;
      if (isReviewMode && reviewingProblemId) {
        if (attemptCount === 1) {
          // Review passed on first try - reinforce mastery
          updateFamilyRecord(reviewingProblemId, {
            lastReviewedAtIndex: questionIndex,
            reviewAttempts: (familyRecords[reviewingProblemId]?.reviewAttempts || 0) + 1
          });
          console.log('Review passed on first try, mastery reinforced:', reviewingProblemId);
        } else {
          // Review passed but not on first try - increase decay for sooner review
          // Don't update lastReviewedAtIndex so it stays decayed
          updateFamilyRecord(reviewingProblemId, {
            reviewAttempts: (familyRecords[reviewingProblemId]?.reviewAttempts || 0) + 1,
            // Mark as needing help since they struggled on review
            usedHelpOnMastery: true
          });
          console.log('Review passed after struggle, scheduling sooner review:', reviewingProblemId);
        }
      } else if (currentQuestion.tier === 'Challenge') {
        // First-time mastery - record full mastery data
        updateFamilyRecord(problemId, {
          status: 'mastered',
          isMastered: true,
          masteredAt: Date.now(),
          masteredAtIndex: questionIndex,
          masteryVariationId: problemId,
          usedHelpOnMastery: usedHelp,
          totalAttempts: attemptCount,
          totalHintsUsed: usedHelp ? 1 : 0
        });
        console.log('Mastery recorded:', problemId, { attemptCount, usedHelp, questionIndex });
      }
    } else if (passedCount > 0) {
      graderResult = 'SOFT_PASS'; // Some tests passed
    } else {
      graderResult = 'HARD_FAIL'; // All tests failed
    }

    const plan = Navigator.getNextStep(currentQuestion, graderResult);
    console.log('Setting feedback:', { graderResult, plan });
    setGraderStatus(graderResult);
    setFeedback(plan);

    return {
      success: allPassed,
      output: testOutput,
      error: allPassed ? undefined : `${passedCount}/${testCases.length} tests passed`,
      testResults
    };
  };

  // Find decayed concepts that need review
  const findDecayedConcepts = () => {
    const { challenges, remedials } = moduleContent;

    return challenges
      .filter((c: any) => {
        const record = familyRecords[c.id];
        if (!record?.masteredAt) return false;

        const decay = calculateProgressDecay(
          record.masteredAtIndex,
          questionIndex,
          record.usedHelpOnMastery || false,
          record.lastReviewedAtIndex
        );

        return decay >= DECAY_THRESHOLD;
      })
      .map((c: any) => ({
        ...c,
        decay: calculateProgressDecay(
          familyRecords[c.id]?.masteredAtIndex ?? null,
          questionIndex,
          familyRecords[c.id]?.usedHelpOnMastery || false,
          familyRecords[c.id]?.lastReviewedAtIndex ?? null
        )
      }))
      .sort((a: any, b: any) => b.decay - a.decay);
  };

  // Select a variation for review (anti-memorization)
  const selectReviewVariation = (originalProblem: any) => {
    const { remedials } = moduleContent;

    // Find remedials with same conceptId (or similar pattern in id)
    const conceptPattern = originalProblem.id.split('-').slice(0, 2).join('-');
    const variations = remedials.filter((r: any) =>
      r.id !== originalProblem.id &&
      (r.conceptId === originalProblem.conceptId || r.id.startsWith(conceptPattern))
    );

    if (variations.length > 0) {
      // Prefer unused variations
      const unused = variations.find((v: any) =>
        !familyRecords[v.id]?.attempts?.length
      );
      return unused || variations[0];
    }

    // No variations found, use the original (with randomized test order)
    return originalProblem;
  };

  const handleNext = () => {
    if (!feedback) return;

    // Use loaded content
    const { challenges, remedials, tutorials } = moduleContent;

    // If exiting review mode after success, clear review state
    if (isReviewMode && graderStatus === 'STRONG_PASS') {
      setIsReviewMode(false);
      setReviewingProblemId(null);
    }

    // Check for decayed concepts (MANDATORY review)
    const decayedConcepts = findDecayedConcepts();
    if (decayedConcepts.length > 0 && !isReviewMode) {
      // Trigger mandatory review
      const mostDecayed = decayedConcepts[0];
      const reviewVariation = selectReviewVariation(mostDecayed);

      console.log('Triggering mandatory review:', {
        original: mostDecayed.id,
        decay: mostDecayed.decay,
        variation: reviewVariation.id
      });

      setIsReviewMode(true);
      setReviewingProblemId(mostDecayed.id);
      setCurrentQuestion({ ...reviewVariation, tier: 'Review' });
      setStarterCode(reviewVariation.starterCode || `def solution():\n    # Review: ${reviewVariation.title}\n    pass`);
      setEditorKey(k => k + 1);
      setFeedback(null);
      setGraderStatus(null);
      setAttemptCount(0);
      setUsedHelp(false);
      return;
    }

    // Normal next logic
    let nextQ = null;

    // Simple lookup helpers
    const findQ = (id: string) => {
      return challenges.find((q: any) => q.id === id) ||
        remedials.find((q: any) => q.id === id) ||
        tutorials.find((q: any) => q.id === id);
    };

    if (feedback.nextId) {
      nextQ = findQ(feedback.nextId);
    }

    // Fallback or "Next" logic if not specified (Infinite Scroll style)
    if (!nextQ && feedback.action === 'upgrade') {
      // Just find random next challenge
      const idx = challenges.indexOf(currentQuestion);
      if (idx >= 0 && idx < challenges.length - 1) {
        nextQ = challenges[idx + 1];
      }
    }

    if (nextQ) {
      const newIdx = challenges.indexOf(nextQ);
      setQuestionIndex(newIdx);
      localStorage.setItem('adaptiveStreamIndex', String(newIdx));
      setCurrentQuestion(nextQ);
      setStarterCode(nextQ.starterCode || `def solution():\n    # New problem: ${nextQ.title}\n    pass`);
      setEditorKey(k => k + 1);
      setFeedback(null);
      setGraderStatus(null);
      // Reset struggle metrics for new problem
      setAttemptCount(0);
      setUsedHelp(false);
      setOriginalChallenge(null);
      setLastRemedial(null);
      setIsReviewMode(false);
      setReviewingProblemId(null);
    } else {
      alert("End of Demo Content Stream!");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-400">Loading Module Content...</div>;
  if (!currentQuestion) return <div className="p-8 text-slate-400">No content found for this module.</div>;

  return (
    <div className="flex-1 h-full w-full flex min-w-0 bg-slate-950 text-slate-100 font-sans">
      {/* Left Panel: Problem & Stream Status */}
      <div className="h-full flex flex-col border-r border-slate-800" style={{ flexBasis: '40%', flexGrow: 0, flexShrink: 0, minWidth: 0, maxWidth: '40%' }}>
        <div className="p-6 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              L5 Adaptive Stream
            </h1>
          </div>
          <div className="flex space-x-2 flex-wrap gap-2">
            {isReviewMode ? (
              <Badge className="bg-purple-600 text-white border-purple-500">
                <RefreshCw className="w-3 h-3 mr-1" />
                Review: Testing Retention
              </Badge>
            ) : (
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                Current Tier: {currentQuestion.tier || 'Remedial'}
              </Badge>
            )}
            <Badge variant="outline" className="border-slate-700">
              Module: {currentQuestion.module || 'General'}
            </Badge>
            {isReviewMode && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                First-try required
              </Badge>
            )}
          </div>
        </div>

        {/* Success Banner - Only shows after passing (STRONG_PASS) */}
        {feedback && graderStatus === 'STRONG_PASS' && (
          <div className={`shrink-0 p-4 border-b ${isReviewMode && attemptCount === 1
            ? 'bg-purple-900/30 border-purple-800'
            : isReviewMode
              ? 'bg-yellow-900/30 border-yellow-800'
              : 'bg-green-900/30 border-green-800'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isReviewMode ? (
                  <RefreshCw className={`mr-2 w-5 h-5 ${attemptCount === 1 ? 'text-purple-400' : 'text-yellow-400'}`} />
                ) : (
                  <CheckCircle className="text-green-400 mr-2 w-5 h-5" />
                )}
                <div>
                  {isReviewMode ? (
                    attemptCount === 1 ? (
                      <>
                        <span className="font-bold text-sm text-purple-400">Retention Confirmed!</span>
                        <p className="text-xs text-slate-400">Mastery reinforced. Moving to next challenge.</p>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-sm text-yellow-400">Review Complete</span>
                        <p className="text-xs text-slate-400">Took {attemptCount} attempts. Will review again soon.</p>
                      </>
                    )
                  ) : (
                    <>
                      <span className="font-bold text-sm text-green-400">Solved!</span>
                      <p className="text-xs text-slate-400">
                        {attemptCount === 1 && !usedHelp
                          ? "Perfect! First try!"
                          : usedHelp
                            ? `Solved after practicing (${attemptCount} attempts)`
                            : `Solved in ${attemptCount} attempts`}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Show "Practice Similar" if user struggled */}
                {(usedHelp || attemptCount > 3) && currentQuestion.tier === 'Challenge' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-600 text-orange-400 hover:bg-orange-900/20"
                    onClick={() => {
                      // Find another remedial to practice (different from lastRemedial if possible)
                      const { remedials } = moduleContent;
                      if (remedials && remedials.length > 0) {
                        const otherRemedials = remedials.filter((r: any) => r.id !== lastRemedial?.id);
                        const practiceQ = otherRemedials.length > 0 ? otherRemedials[0] : remedials[0];
                        setCurrentQuestion(practiceQ);
                        setStarterCode(practiceQ.starterCode || `def solution():\n    pass`);
                        setEditorKey(k => k + 1);
                        setFeedback(null);
                        setGraderStatus(null);
                        setAttemptCount(0);
                        // Keep usedHelp and originalChallenge so they can return
                      }
                    }}
                  >
                    Practice Similar
                  </Button>
                )}
                <Button onClick={handleNext} size="sm" className="bg-green-600 hover:bg-green-700">
                  Next Challenge <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 min-h-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-100">{currentQuestion.title}</h2>
            {/* Need Help button - routes to easier content based on current tier */}
            {/* Hidden during review mode - reviews require first-try pass */}
            {!isReviewMode && currentQuestion.tier === 'Challenge' && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-orange-400 hover:bg-orange-900/20"
                onClick={() => {
                  const { remedials } = moduleContent;
                  if (remedials && remedials.length > 0) {
                    const remedialQ = remedials[0];
                    setOriginalChallenge(currentQuestion); // Remember where we came from
                    setUsedHelp(true); // Mark that user needed help
                    setCurrentQuestion(remedialQ);
                    setStarterCode(remedialQ.starterCode || `def solution():\n    # Remedial: ${remedialQ.title}\n    pass`);
                    setEditorKey(k => k + 1);
                    setFeedback(null);
                    setGraderStatus(null);
                  }
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Need Help
              </Button>
            )}
            {!isReviewMode && currentQuestion.tier === 'Remedial' && (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-blue-400 hover:bg-blue-900/20"
                  onClick={() => {
                    // Start by checking if we have a navigation handler
                    if (onNavigateToModule) {
                      // Check for specific module override in family_tree (e.g. redirect to Prefix Suffix module)
                      const overrideModuleId = currentQuestion.family_tree?.tutorial_module_id;
                      const targetModule = overrideModuleId || currentQuestion.module;

                      if (targetModule) {
                        onNavigateToModule(targetModule);
                        return;
                      }
                    }

                    const { tutorials } = moduleContent;
                    if (tutorials && tutorials.length > 0) {
                      const tutorialQ = tutorials[0];
                      setLastRemedial(currentQuestion); // Remember remedial for return
                      setCurrentQuestion(tutorialQ);
                      setStarterCode(tutorialQ.starterCode || '');
                      setEditorKey(k => k + 1);
                      setFeedback(null);
                      setGraderStatus(null);
                    }
                  }}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  View Tutorial
                </Button>
                {originalChallenge && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-green-400 hover:bg-green-900/20"
                    onClick={() => {
                      setCurrentQuestion(originalChallenge);
                      setStarterCode(originalChallenge.starterCode || `def solution():\n    pass`);
                      setEditorKey(k => k + 1);
                      setFeedback(null);
                      setGraderStatus(null);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Retry Challenge
                  </Button>
                )}
              </div>
            )}
            {!isReviewMode && currentQuestion.tier === 'Tutorial' && (
              <div className="flex space-x-2">
                {lastRemedial && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-orange-400 hover:bg-orange-900/20"
                    onClick={() => {
                      setCurrentQuestion(lastRemedial);
                      setStarterCode(lastRemedial.starterCode || `def solution():\n    pass`);
                      setEditorKey(k => k + 1);
                      setFeedback(null);
                      setGraderStatus(null);
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Try Remedial
                  </Button>
                )}
                {originalChallenge && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-green-400 hover:bg-green-900/20"
                    onClick={() => {
                      setCurrentQuestion(originalChallenge);
                      setStarterCode(originalChallenge.starterCode || `def solution():\n    pass`);
                      setEditorKey(k => k + 1);
                      setFeedback(null);
                      setGraderStatus(null);
                      setOriginalChallenge(null);
                      setLastRemedial(null);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Retry Challenge
                  </Button>
                )}
                {onBack && !originalChallenge && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-purple-400 hover:bg-purple-900/20"
                    onClick={onBack}
                  >
                    <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                    Back to Lesson
                  </Button>
                )}
              </div>
            )}
          </div>

          {currentQuestion.prompt && (
            <div className="mb-6 text-slate-300 leading-relaxed">
              {currentQuestion.prompt}
            </div>
          )}

          {currentQuestion.content && (
            <div className="mb-6 p-4 bg-slate-900 rounded-lg text-slate-300">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Tutorial Content</h3>
              {currentQuestion.content}
            </div>
          )}

          {currentQuestion.constraints && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Constraints</h3>
              <ul className="space-y-1">
                {currentQuestion.constraints.map((c: string, i: number) => (
                  <li key={i} className="flex items-center text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Cases Section */}
          {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Examples</h3>
              <div className="space-y-3">
                {currentQuestion.testCases.map((tc: any, i: number) => (
                  <div key={tc.id || i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-slate-500">Input:</span>
                      <pre className="text-sm text-cyan-400 font-mono mt-1">{tc.input}</pre>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500">Expected Output:</span>
                      <pre className="text-sm text-green-400 font-mono mt-1">{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </ScrollArea>
      </div>

      {/* Right Panel: Editor */}
      <div className="h-full overflow-hidden flex flex-col bg-[#1e1e1e]" style={{ flexBasis: '60%', flexGrow: 0, flexShrink: 0, minWidth: '60%', maxWidth: '60%' }}>
        <div className="flex-1 overflow-hidden relative min-h-0">
          <CodeEditor
            key={`editor-${editorKey}`}
            initialCode={starterCode}
            onRun={handleCodeRun}
            language="python"
            solution={currentQuestion.solution}
            requireComplexity={true}
            exerciseTitle={currentQuestion.title}
          />
        </div>
      </div>
    </div>
  );
};
