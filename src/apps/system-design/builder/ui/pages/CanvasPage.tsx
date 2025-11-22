import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { DesignCanvas } from '../components/DesignCanvas';
import { ProblemDescriptionPanel } from '../components/ProblemDescriptionPanel';
import { SubmissionResultsPanel } from '../components/SubmissionResultsPanel';
import { ComponentPalette } from '../components/ComponentPalette';
import { ContextualHelpPanel } from '../components/ContextualHelpPanel';
import { useBuilderStore, useCanvasStore, useTestStore, useUIStore } from '../store';
import { Challenge, TestResult } from '../../types/testCase';
import { SystemGraph } from '../../types/graph';
import { SystemDesignLesson } from '../../types/lesson';

interface CanvasPageProps {
  challenge: Challenge;
  onAddComponent: (type: string) => void;
  onUpdateConfig: (nodeId: string, config: any) => void;
  onSubmit: () => void;
  onLoadSolution: () => void;
}

/**
 * CanvasPage - Main design canvas view
 * Maps to Figma: CanvasPage frame
 */
export const CanvasPage: React.FC<CanvasPageProps> = ({
  challenge,
  onAddComponent,
  onUpdateConfig,
  onSubmit,
  onLoadSolution,
}) => {
  // Store state
  const { hasSubmitted, setHasSubmitted } = useBuilderStore();
  const {
    systemGraph,
    setSystemGraph,
    selectedNode,
    setSelectedNode,
    canvasCollapsed,
    setCanvasCollapsed,
  } = useCanvasStore();
  const { testResults, isRunning, setTestResults, setCurrentTestIndex } = useTestStore();
  const { showContextualHelp, setShowContextualHelp, setActiveTab, setSelectedLesson } = useUIStore();

  const handleEditDesign = () => {
    setHasSubmitted(false);
    setTestResults(new Map());
    setCurrentTestIndex(0);
  };

  const handleOpenLesson = (lesson: SystemDesignLesson) => {
    setSelectedLesson(lesson);
    setShowContextualHelp(false);
    setActiveTab('lessons');
  };

  const hasChallengeSolution = !!(
    challenge?.solution ||
    (challenge as any)?.problemDefinition
  );

  return (
    <>
      {/* Left Panel - Problem Description OR Submission Results */}
      {hasSubmitted ? (
        <SubmissionResultsPanel
          testCases={challenge.testCases}
          testResults={testResults}
          isRunning={isRunning}
          currentTestIndex={0}
          onEditDesign={handleEditDesign}
          onShowSolution={onLoadSolution}
          hasChallengeSolution={hasChallengeSolution}
        />
      ) : (
        <ProblemDescriptionPanel challenge={challenge} />
      )}

      {/* Center Panel - Collapsible Design Canvas */}
      {canvasCollapsed ? (
        // Collapsed: Thin strip with expand button
        <div className="w-12 bg-gray-100 border-r border-gray-300 flex flex-col items-center justify-center">
          <button
            onClick={() => setCanvasCollapsed(false)}
            className="writing-mode-vertical px-2 py-4 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-blue-600 transition-colors rounded"
            title="Expand Canvas"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg">◀</span>
              <span className="transform rotate-90 whitespace-nowrap text-xs">
                Design Canvas
              </span>
            </div>
          </button>
        </div>
      ) : (
        // Expanded: Full canvas with collapse button
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <DesignCanvas
              systemGraph={systemGraph}
              onSystemGraphChange={setSystemGraph}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              onAddComponent={onAddComponent}
              onUpdateConfig={onUpdateConfig}
            />
          </ReactFlowProvider>

          {/* Collapse Button (overlay on canvas) */}
          <button
            onClick={() => setCanvasCollapsed(true)}
            className="absolute top-2 right-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-50 hover:shadow-lg transition-all z-10"
            title="Collapse Canvas (focus on configuration)"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                Hide Canvas
              </span>
              <span className="text-sm">▶</span>
            </div>
          </button>

          {/* Floating Help Button */}
          {hasSubmitted && testResults.size > 0 && (
            <button
              onClick={() => setShowContextualHelp(true)}
              className="absolute bottom-4 right-4 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-10 flex items-center gap-2"
              title="Get Help"
            >
              <span className="text-lg">💡</span>
              <span className="font-medium">Help</span>
            </button>
          )}
        </div>
      )}

      {/* Contextual Help Modal */}
      {showContextualHelp && hasSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <ContextualHelpPanel
              currentCanvas={systemGraph}
              failedTests={Array.from(testResults.values()).filter(
                (r) => !r.passed,
              )}
              onClose={() => setShowContextualHelp(false)}
              onOpenLesson={handleOpenLesson}
            />
          </div>
        </div>
      )}

      {/* Right Panel - Component Palette with Submit Button */}
      {!hasSubmitted && (
        <div
          className={`flex flex-col bg-white border-l border-gray-200 transition-all ${
            canvasCollapsed ? "flex-1" : "w-80"
          }`}
        >
          {/* Component Palette */}
          <div className="flex-1 overflow-y-auto">
            <ComponentPalette
              availableComponents={challenge.availableComponents || []}
              onAddComponent={onAddComponent}
            />
          </div>

          {/* Submit Button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onSubmit}
              disabled={isRunning}
              className="w-full px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {isRunning ? "⏳ Running Tests..." : "▶️ Submit Solution"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

