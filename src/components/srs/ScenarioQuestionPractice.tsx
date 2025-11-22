/**
 * Scenario Question Practice Component
 *
 * Interactive component for practicing scenario-based questions
 * with spaced repetition tracking
 */

import React, { useState } from 'react';
import { ScenarioQuestion, ScenarioResponse } from '../../types/spacedRepetition';
import { evaluateScenarioResponse } from '../../services/scenarioEvaluator';
import {
  updateConceptStateAfterReview,
  saveResponse,
  getConceptState,
} from '../../services/spacedRepetitionService';

interface Props {
  question: ScenarioQuestion;
  userId: string;
  onComplete?: (response: ScenarioResponse) => void;
  onNext?: () => void;
}

export const ScenarioQuestionPractice: React.FC<Props> = ({
  question,
  userId,
  onComplete,
  onNext,
}) => {
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<ScenarioResponse['evaluation'] | null>(null);
  const [startTime] = useState(Date.now());

  const handleShowHint = () => {
    if (question.hints && hintsShown < question.hints.length) {
      setHintsShown(prev => prev + 1);
      setShowHint(true);
    }
  };

  const handleSubmit = () => {
    const responseTimeSeconds = Math.round((Date.now() - startTime) / 1000);

    // Evaluate the response
    const eval = evaluateScenarioResponse(question, answer, confidence, hintsShown);

    // Create response object
    const response: ScenarioResponse = {
      id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionId: question.id,
      conceptId: question.conceptId,
      userId,
      answer,
      confidence,
      responseTimeSeconds,
      hintsUsed: hintsShown,
      evaluation: eval,
      answeredAt: new Date(),
    };

    // Save response
    saveResponse(response);

    // Update concept state using SM-2
    updateConceptStateAfterReview(question.conceptId, userId, response, eval);

    setEvaluation(eval);
    setSubmitted(true);

    if (onComplete) {
      onComplete(response);
    }
  };

  const handleNext = () => {
    // Reset state for next question
    setAnswer('');
    setConfidence(3);
    setHintsShown(0);
    setShowHint(false);
    setSubmitted(false);
    setEvaluation(null);

    if (onNext) {
      onNext();
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (level: number): string => {
    const labels = {
      1: 'Just Guessing',
      2: 'Somewhat Unsure',
      3: 'Moderately Confident',
      4: 'Very Confident',
      5: 'Completely Certain',
    };
    return labels[level as keyof typeof labels];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {question.questionType.replace('_', ' ').toUpperCase()}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Difficulty: {question.difficulty}
          </span>
        </div>
      </div>

      {/* Scenario Context */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="font-bold text-lg mb-2">Scenario</h3>
        <p className="text-gray-700 mb-3">{question.scenario.context}</p>

        <div className="mb-3">
          <h4 className="font-semibold mb-2">Requirements:</h4>
          <ul className="list-disc list-inside space-y-1">
            {question.scenario.requirements.map((req, idx) => (
              <li key={idx} className="text-gray-700">
                {req}
              </li>
            ))}
          </ul>
        </div>

        {question.scenario.constraints && question.scenario.constraints.length > 0 && (
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Constraints:</h4>
            <ul className="list-disc list-inside space-y-1">
              {question.scenario.constraints.map((constraint, idx) => (
                <li key={idx} className="text-gray-700">
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {question.scenario.metrics && (
          <div className="mb-3">
            <h4 className="font-semibold mb-2">Key Metrics:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(question.scenario.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-white rounded">
                  <span className="font-medium">{key}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* The Question */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">{question.question}</h3>
      </div>

      {!submitted ? (
        <>
          {/* Answer Input */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Your Answer:</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explain your reasoning, discuss trade-offs, and justify your choice..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Word count: {answer.split(/\s+/).filter(w => w.length > 0).length}
            </p>
          </div>

          {/* Confidence Rating */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Confidence Level:</label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setConfidence(level as 1 | 2 | 3 | 4 | 5)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    confidence === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{getConfidenceLabel(confidence)}</p>
          </div>

          {/* Hints */}
          {question.hints && question.hints.length > 0 && (
            <div className="mb-6">
              <button
                onClick={handleShowHint}
                disabled={hintsShown >= question.hints.length}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Show Hint ({hintsShown}/{question.hints.length})
              </button>

              {showHint && hintsShown > 0 && (
                <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm font-semibold mb-1">Hint {hintsShown}:</p>
                  <p>{question.hints[hintsShown - 1].text}</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={answer.trim().length < 20}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Evaluation Results */}
          {evaluation && (
            <div className="space-y-6">
              {/* Score */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Your Score</h3>
                  <div className={`text-4xl font-bold ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score}%
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        evaluation.passed ? 'bg-green-500' : 'bg-red-500'
                      } transition-all duration-500`}
                      style={{ width: `${evaluation.score}%` }}
                    />
                  </div>
                  <span className="font-semibold">
                    {evaluation.passed ? '✓ Passed' : '✗ Needs Review'}
                  </span>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Completeness</div>
                  <div className="text-2xl font-bold">{evaluation.completeness}%</div>
                </div>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className="text-2xl font-bold">{evaluation.accuracy}%</div>
                </div>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Depth</div>
                  <div className="text-2xl font-bold">{evaluation.depth}%</div>
                </div>
              </div>

              {/* Strengths */}
              {evaluation.strengths.length > 0 && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <h4 className="font-bold text-green-800 mb-2">✓ Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx} className="text-green-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {evaluation.improvements.length > 0 && (
                <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <h4 className="font-bold text-orange-800 mb-2">📝 Areas for Improvement</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-orange-700">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Anti-patterns Warning */}
              {evaluation.antipatternsMentioned.length > 0 && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <h4 className="font-bold text-red-800 mb-2">⚠️ Anti-patterns Detected</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.antipatternsMentioned.map((antipattern, idx) => (
                      <li key={idx} className="text-red-700">
                        Mentioned: "{antipattern}" - This is generally not recommended
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Explanation */}
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-bold text-blue-800 mb-2">📚 Detailed Explanation</h4>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {question.explanation}
                </div>
              </div>

              {/* Related Resources */}
              {question.relatedResources && question.relatedResources.length > 0 && (
                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <h4 className="font-bold text-purple-800 mb-2">🔗 Learn More</h4>
                  <ul className="space-y-2">
                    {question.relatedResources.map((resource, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{resource.title}</span>
                        {resource.description && (
                          <span className="text-gray-600"> - {resource.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              {evaluation.nextSteps && evaluation.nextSteps.length > 0 && (
                <div className="p-4 bg-gray-50 border-l-4 border-gray-500 rounded">
                  <h4 className="font-bold text-gray-800 mb-2">→ Next Steps</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.nextSteps.map((step, idx) => (
                      <li key={idx} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Next Question →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScenarioQuestionPractice;
