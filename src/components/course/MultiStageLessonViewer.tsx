import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StageManager } from './StageManager';
import { ArrayVisualization } from '../visualizations/ArrayVisualization';
import { SlidingWindowAnimation } from '../visualizations/SlidingWindowAnimation';
import { TreeVisualization } from '../visualizations/TreeVisualization';
import { CodeEditor } from './CodeEditor';
import { Check, Lightbulb, Play } from 'lucide-react';
import {
  MultiStage,
  MultiStageLesson,
  ConceptStage,
  VisualizationStage,
  ExampleStage,
  PracticeStage,
  QuizStage,
  TerminalStage,
} from '../../types/multiStage';

export interface MultiStageLessonViewerProps {
  lesson: MultiStageLesson;
  onComplete?: () => void;
  onExit?: () => void;
}

/**
 * Main viewer component for multi-stage lessons
 * Renders different stage types using StageManager
 */
export function MultiStageLessonViewer({
  lesson,
  onComplete,
  onExit,
}: MultiStageLessonViewerProps) {
  // Load progress from localStorage
  const savedProgress = localStorage.getItem(`multiStageProgress_${lesson.id}`);
  const initialProgress = savedProgress ? JSON.parse(savedProgress) : undefined;

  const handleStageComplete = (stageId: string, score?: number) => {
    console.log(`Stage ${stageId} completed with score:`, score);
    // Could send to backend API here
  };

  const handleLessonComplete = () => {
    console.log('Lesson completed!');
    onComplete?.();
  };

  // Render function for each stage type
  const renderStage = (stage: MultiStage, onStageComplete: () => void) => {
    switch (stage.type) {
      case 'concept':
        return <ConceptStageRenderer stage={stage} onComplete={onStageComplete} />;

      case 'visualization':
        return <VisualizationStageRenderer stage={stage} onComplete={onStageComplete} />;

      case 'example':
        return <ExampleStageRenderer stage={stage} onComplete={onStageComplete} />;

      case 'practice':
        return <PracticeStageRenderer stage={stage} onComplete={onStageComplete} />;

      case 'quiz':
        return <QuizStageRenderer stage={stage} onComplete={onStageComplete} />;

      case 'terminal':
        return <TerminalStageRenderer stage={stage} onComplete={onStageComplete} />;

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

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{stage.content.markdown}</ReactMarkdown>
        </div>

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

        {stage.content.externalLinks && stage.content.externalLinks.length > 0 && (
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
        <Button onClick={handleContinue} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Check className="w-5 h-5 mr-2" />
          Mark as Complete
        </Button>
      </div>
    </div>
  );
}

/**
 * Visualization stage renderer
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
      <Card className="p-6">
        {stage.explanation && (
          <div className="prose mb-6">
            <ReactMarkdown>{stage.explanation}</ReactMarkdown>
          </div>
        )}

        {/* Render visualization based on type */}
        {stage.visualizationType === 'array' && stage.config.type === 'array' && (
          <ArrayVisualization {...stage.config} />
        )}

        {stage.visualizationType === 'sliding_window' &&
          stage.config.type === 'sliding_window' && (
            <SlidingWindowAnimation {...stage.config} />
          )}

        {stage.visualizationType === 'tree' && stage.config.type === 'tree' && (
          <TreeVisualization {...stage.config} />
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Check className="w-5 h-5 mr-2" />
          Continue
        </Button>
      </div>
    </div>
  );
}

/**
 * Example stage renderer - step-by-step worked example
 */
function ExampleStageRenderer({
  stage,
  onComplete,
}: {
  stage: ExampleStage;
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = stage.solution.steps[currentStep];
  const isLastStep = currentStep === stage.solution.steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Problem statement */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-lg mb-2">Problem</h3>
        <div className="prose">
          <ReactMarkdown>{stage.problem}</ReactMarkdown>
        </div>
      </Card>

      {/* Current step */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            Step {step.stepNumber}: {step.title}
          </h3>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {stage.solution.steps.length}
          </span>
        </div>

        <div className="prose mb-6">
          <ReactMarkdown>{step.explanation}</ReactMarkdown>
        </div>

        {step.code && (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{step.code}</code>
          </pre>
        )}
      </Card>

      {/* Final answer */}
      {isLastStep && stage.solution.finalAnswer && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-bold text-lg mb-2 text-green-900">Final Answer</h3>
          <div className="text-green-900">{stage.solution.finalAnswer}</div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          variant="outline"
        >
          Previous Step
        </Button>

        {isLastStep ? (
          <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
            <Check className="w-5 h-5 mr-2" />
            Complete Example
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentStep((prev) =>
                Math.min(stage.solution.steps.length - 1, prev + 1)
              )
            }
          >
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Practice stage renderer - interactive problem
 */
function PracticeStageRenderer({
  stage,
  onComplete,
}: {
  stage: PracticeStage;
  onComplete: () => void;
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    // Simple validation - in real app, would use backend
    if (stage.validation.type === 'free_form') {
      // Auto-accept for now
      setIsCorrect(true);
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Your Turn to Practice</h3>
        <div className="prose mb-6">
          <ReactMarkdown>{stage.problem}</ReactMarkdown>
        </div>

        <div className="space-y-4">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full h-40 p-4 border rounded font-mono text-sm"
            placeholder="Type your answer here..."
          />

          {isCorrect !== null && (
            <div
              className={`p-4 rounded ${
                isCorrect
                  ? 'bg-green-50 border border-green-200 text-green-900'
                  : 'bg-red-50 border border-red-200 text-red-900'
              }`}
            >
              {isCorrect ? '✓ Correct!' : '✗ Not quite. Try again or check the hint.'}
            </div>
          )}
        </div>
      </Card>

      {/* Hints */}
      {stage.hints && stage.hints.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <Button
            onClick={() => {
              setShowHint(true);
              setCurrentHint((prev) => Math.min(stage.hints!.length - 1, prev + 1));
            }}
            variant="outline"
            size="sm"
            disabled={showHint && currentHint === stage.hints.length}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHint ? 'Show Next Hint' : 'Show Hint'}
          </Button>

          {showHint && (
            <div className="mt-4 text-sm">
              <strong>Hint {currentHint}:</strong> {stage.hints[currentHint - 1]}
            </div>
          )}
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          Submit Answer
        </Button>
      </div>
    </div>
  );
}

/**
 * Quiz stage renderer
 */
function QuizStageRenderer({
  stage,
  onComplete,
}: {
  stage: QuizStage;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setShowResults(true);
    // Calculate score and complete
    const score = 80; // Placeholder
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="space-y-6">
      {stage.questions.map((question, idx) => (
        <Card key={question.id} className="p-6">
          <div className="font-semibold mb-4">
            {idx + 1}. {question.question}
          </div>

          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question.id]: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {showResults && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={showResults}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}

/**
 * Terminal stage renderer - reuses existing terminal components
 */
function TerminalStageRenderer({
  stage,
  onComplete,
}: {
  stage: TerminalStage;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center py-12 text-gray-600">
          Terminal stage integration coming soon...
          <br />
          Will reuse existing progressive module terminal components
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </div>
  );
}
