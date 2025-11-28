import { useState, useCallback } from 'react';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { MarkdownContent } from './MarkdownContent';
import { StageManager } from '../../../../../components/course/StageManager';
import { Check, Lightbulb, Play, AlertCircle } from 'lucide-react';
import {
  MultiStage,
  ConceptStage,
  VisualizationStage,
  ExampleStage,
  PracticeStage,
  QuizStage,
} from '../../../../types/multiStage';
import type {
  SystemDesignLesson,
  SystemDesignStage,
  CanvasPracticeStage,
  TrafficSimulationStage,
  CostAnalysisStage,
} from '../../types/lesson';
import { SystemGraph } from '../../types/graph';
import { DesignCanvas } from './DesignCanvas';
import { ReactFlowProvider } from 'reactflow';

export interface SystemDesignLessonViewerProps {
  lesson: SystemDesignLesson;
  onComplete?: () => void;
  onExit?: () => void;
  initialCanvas?: SystemGraph;
  onCanvasChange?: (canvas: SystemGraph) => void;
}

/**
 * Main viewer component for system design lessons
 * Extends MultiStageLessonViewer with SD-specific stage types
 */
export function SystemDesignLessonViewer({
  lesson,
  onComplete,
  onExit,
  initialCanvas,
  onCanvasChange,
}: SystemDesignLessonViewerProps) {
  const [practiceCanvas, setPracticeCanvas] = useState<SystemGraph>(
    initialCanvas || { components: [], connections: [] }
  );
  const [practiceAttempts, setPracticeAttempts] = useState<Map<string, number>>(new Map());

  // Load progress from localStorage
  const savedProgress = localStorage.getItem(`sdLessonProgress_${lesson.id}`);
  const initialProgress = savedProgress ? JSON.parse(savedProgress) : undefined;

  const handleStageComplete = (stageId: string, score?: number) => {
    console.log(`Stage ${stageId} completed with score:`, score);
    // Save progress to localStorage
    const progress = {
      lessonId: lesson.id,
      currentStageIndex: lesson.stages.findIndex(s => s.id === stageId) + 1,
      completedStages: Array.from(new Set([...initialProgress?.completedStages || [], stageId])),
      stageScores: { ...initialProgress?.stageScores, [stageId]: score || 0 },
      lastAccessedAt: new Date().toISOString(),
    };
    localStorage.setItem(`sdLessonProgress_${lesson.id}`, JSON.stringify(progress));
  };

  const handleLessonComplete = () => {
    console.log('Lesson completed!');
    onComplete?.();
  };

  const handleCanvasChange = useCallback((canvas: SystemGraph) => {
    setPracticeCanvas(canvas);
    onCanvasChange?.(canvas);
  }, [onCanvasChange]);

  // Render function for each stage type
  const renderStage = (stage: MultiStage | SystemDesignStage, onStageComplete: () => void) => {
    // Handle system design specific stages
    if (stage.type === 'canvas-practice') {
      return (
        <CanvasPracticeStageRenderer
          stage={stage as CanvasPracticeStage}
          onComplete={onStageComplete}
          canvas={practiceCanvas}
          onCanvasChange={handleCanvasChange}
          attempts={practiceAttempts.get(stage.id) || 0}
          onAttempt={() => {
            setPracticeAttempts(prev => {
              const newMap = new Map(prev);
              newMap.set(stage.id, (newMap.get(stage.id) || 0) + 1);
              return newMap;
            });
          }}
        />
      );
    }

    if (stage.type === 'traffic-simulation') {
      return (
        <TrafficSimulationStageRenderer
          stage={stage as TrafficSimulationStage}
          onComplete={onStageComplete}
        />
      );
    }

    if (stage.type === 'cost-analysis') {
      return (
        <CostAnalysisStageRenderer
          stage={stage as CostAnalysisStage}
          onComplete={onStageComplete}
        />
      );
    }

    // Handle standard multi-stage types
    switch (stage.type) {
      case 'concept':
        return <ConceptStageRenderer stage={stage as ConceptStage} onComplete={onStageComplete} />;

      case 'visualization':
        return <VisualizationStageRenderer stage={stage as VisualizationStage} onComplete={onStageComplete} />;

      case 'example':
        return <ExampleStageRenderer stage={stage as ExampleStage} onComplete={onStageComplete} />;

      case 'practice':
        return <PracticeStageRenderer stage={stage as PracticeStage} onComplete={onStageComplete} />;

      case 'quiz':
        return <QuizStageRenderer stage={stage as QuizStage} onComplete={onStageComplete} />;

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            Stage type not implemented: {stage.type}
          </div>
        );
    }
  };

  return (
    <StageManager
      lesson={lesson}
      initialProgress={initialProgress}
      onStageComplete={handleStageComplete}
      onLessonComplete={handleLessonComplete}
      onExit={onExit}
      renderStage={renderStage}
    />
  );
}

/**
 * Concept stage renderer - displays theory content
 */
function ConceptStageRenderer({
  stage,
  onComplete,
}: {
  stage: ConceptStage;
  onComplete: () => void;
}) {
  const [hasRead, setHasRead] = useState(false);

  const handleContinue = () => {
    setHasRead(true);
    onComplete();
  };

  // Handle different content formats
  const getContent = () => {
    if (!stage.content) return '';
    // If content is a string, use it directly
    if (typeof stage.content === 'string') return stage.content;
    // If content is an object with markdown property
    if (typeof stage.content === 'object' && 'markdown' in stage.content) {
      return stage.content.markdown || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <MarkdownContent content={getContent()} />

        {stage.keyPoints && stage.keyPoints.length > 0 && (
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Key Takeaways</h3>
            <ul className="space-y-2">
              {stage.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-blue-900">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stage.content && typeof stage.content === 'object' && 'externalLinks' in stage.content && stage.content.externalLinks && stage.content.externalLinks.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">Additional Resources</h4>
            <div className="space-y-2">
              {stage.content.externalLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {link.title} →
                </a>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Visualization stage renderer - placeholder for now
 */
function VisualizationStageRenderer({
  stage,
  onComplete,
}: {
  stage: VisualizationStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <p className="text-gray-600">Visualization stage: {stage.title}</p>
        {stage.explanation && (
          <div className="mt-4">
            <MarkdownContent content={stage.explanation} />
          </div>
        )}
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Example stage renderer
 */
function ExampleStageRenderer({
  stage,
  onComplete,
}: {
  stage: ExampleStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
        <MarkdownContent content={stage.problem} />
        {stage.solution && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Solution</h3>
            {stage.solution.steps.map((step, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-50 rounded">
                <div className="font-semibold">Step {step.stepNumber}: {step.title}</div>
                <div className="mt-2">
                  <MarkdownContent content={step.explanation} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Practice stage renderer
 */
function PracticeStageRenderer({
  stage,
  onComplete,
}: {
  stage: PracticeStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
        <MarkdownContent content={stage.problem} />
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Quiz stage renderer - placeholder
 */
function QuizStageRenderer({
  stage,
  onComplete,
}: {
  stage: QuizStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <p className="text-gray-600">Quiz stage: {stage.title}</p>
        <p className="text-sm text-gray-500 mt-2">
          {stage.questions.length} questions
        </p>
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Canvas Practice Stage Renderer - Interactive canvas practice
 */
function CanvasPracticeStageRenderer({
  stage,
  onComplete,
  canvas,
  onCanvasChange,
  attempts,
  onAttempt,
}: {
  stage: CanvasPracticeStage;
  onComplete: () => void;
  canvas: SystemGraph;
  onCanvasChange: (canvas: SystemGraph) => void;
  attempts: number;
  onAttempt: () => void;
}) {
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const validateCanvas = () => {
    onAttempt();
    // Basic validation - check if solution components exist
    const solutionComponentIds = new Set(stage.solution.components.map(c => c.id));
    const canvasComponentIds = new Set(canvas.components.map(c => c.id));
    
    // Check if all required components are present
    const hasAllComponents = Array.from(solutionComponentIds).every(id => 
      canvasComponentIds.has(id)
    );
    
    setIsValid(hasAllComponents);
    
    if (hasAllComponents) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
        {stage.description && (
          <div className="mb-4">
            <MarkdownContent content={stage.description} />
          </div>
        )}
        
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h3 className="font-semibold mb-2">Scenario</h3>
          <MarkdownContent content={stage.scenario.description} />
          
          {stage.scenario.requirements.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1">
                {stage.scenario.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {stage.hints.length > 0 && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
            {showHints && (
              <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold mb-2">Hint {currentHintIndex + 1}:</p>
                <p>{stage.hints[currentHintIndex]}</p>
                {stage.hints.length > 1 && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentHintIndex(Math.max(0, currentHintIndex - 1))}
                      disabled={currentHintIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentHintIndex(Math.min(stage.hints.length - 1, currentHintIndex + 1))}
                      disabled={currentHintIndex === stage.hints.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="border rounded-lg p-4 bg-white" style={{ height: '600px' }}>
          <ReactFlowProvider>
            <DesignCanvas
              systemGraph={canvas}
              onSystemGraphChange={onCanvasChange}
              selectedNode={null}
              onNodeSelect={() => {}}
              onAddComponent={() => {}}
              onUpdateConfig={() => {}}
            />
          </ReactFlowProvider>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Attempts: {attempts}
            {isValid && (
              <span className="ml-2 text-green-600 font-semibold">✓ Valid solution!</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={validateCanvas}>
              Validate Solution
            </Button>
            {isValid && (
              <Button onClick={onComplete} size="lg">
                Continue
              </Button>
            )}
          </div>
        </div>

        {stage.solutionExplanation && isValid && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold mb-2">Solution Explanation</h4>
            <MarkdownContent content={stage.solutionExplanation} />
          </div>
        )}
      </Card>
    </div>
  );
}

/**
 * Traffic Simulation Stage Renderer - placeholder
 */
function TrafficSimulationStageRenderer({
  stage,
  onComplete,
}: {
  stage: TrafficSimulationStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
        {stage.explanation && (
          <div className="mb-4">
            <MarkdownContent content={stage.explanation} />
          </div>
        )}
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-600">
            Traffic simulation: {stage.traffic.rps} RPS, {stage.traffic.readRatio * 100}% reads
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Visualization will be implemented in Phase 5
          </p>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Cost Analysis Stage Renderer - placeholder
 */
function CostAnalysisStageRenderer({
  stage,
  onComplete,
}: {
  stage: CostAnalysisStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{stage.title}</h2>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-600">Cost analysis visualization</p>
          <p className="text-sm text-gray-500 mt-2">
            Cost breakdown will be implemented in Phase 5
          </p>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

