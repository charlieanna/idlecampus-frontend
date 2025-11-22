/**
 * Assessment Page
 * 
 * Entry assessment to determine user's skill level and recommend learning path.
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md section 1 & 2.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { AssessmentQuestion } from '../types';

/**
 * Assessment questions based on wireframe
 */
const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary purpose of a load balancer in a distributed system?',
    type: 'multiple_choice',
    options: [
      'Store user session data',
      'Distribute incoming traffic across multiple servers',
      'Cache frequently accessed data',
      'Encrypt data in transit'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    topic: 'Load Balancing'
  },
  {
    id: 'q2',
    question: 'Which database type is best suited for storing hierarchical data like JSON documents?',
    type: 'multiple_choice',
    options: [
      'Relational database (SQL)',
      'Document database (NoSQL)',
      'Graph database',
      'Time-series database'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    topic: 'Database Design'
  },
  {
    id: 'q3',
    question: 'What is the primary purpose of a Content Delivery Network (CDN)?',
    type: 'multiple_choice',
    options: [
      'Store user authentication data securely',
      'Distribute content closer to end users',
      'Handle database transactions',
      'Process background jobs'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    topic: 'Caching & CDN'
  },
  {
    id: 'q4',
    question: 'In the CAP theorem, what does "P" stand for?',
    type: 'multiple_choice',
    options: [
      'Performance',
      'Persistence',
      'Partition Tolerance',
      'Processing Power'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    topic: 'Distributed Systems'
  },
  {
    id: 'q5',
    question: 'What is database sharding?',
    type: 'multiple_choice',
    options: [
      'Creating backup copies of the database',
      'Partitioning data across multiple database instances',
      'Encrypting database content',
      'Indexing database tables'
    ],
    correctAnswer: 1,
    difficulty: 'intermediate',
    topic: 'Database Design'
  },
  {
    id: 'q6',
    question: 'Which caching strategy updates the cache only when data is requested and not found?',
    type: 'multiple_choice',
    options: [
      'Write-through',
      'Write-behind',
      'Cache-aside (Lazy Loading)',
      'Write-around'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    topic: 'Caching & CDN'
  },
  {
    id: 'q7',
    question: 'What is the main advantage of eventual consistency in distributed systems?',
    type: 'multiple_choice',
    options: [
      'Stronger data guarantees',
      'Higher availability and partition tolerance',
      'Simpler implementation',
      'Better security'
    ],
    correctAnswer: 1,
    difficulty: 'advanced',
    topic: 'Distributed Systems'
  },
  {
    id: 'q8',
    question: 'In a microservices architecture, what is the purpose of a service mesh?',
    type: 'multiple_choice',
    options: [
      'Store shared data between services',
      'Handle service-to-service communication, monitoring, and security',
      'Deploy services to production',
      'Generate API documentation'
    ],
    correctAnswer: 1,
    difficulty: 'advanced',
    topic: 'System Architecture'
  },
  {
    id: 'q9',
    question: 'What is the Two-Phase Commit (2PC) protocol used for?',
    type: 'multiple_choice',
    options: [
      'Optimizing database queries',
      'Coordinating distributed transactions',
      'Balancing load across servers',
      'Encrypting network traffic'
    ],
    correctAnswer: 1,
    difficulty: 'advanced',
    topic: 'Distributed Systems'
  },
  {
    id: 'q10',
    question: 'Which metric best represents the user experience for tail latency?',
    type: 'multiple_choice',
    options: [
      'Average latency',
      'Median latency (p50)',
      '99th percentile latency (p99)',
      'Minimum latency'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    topic: 'Scalability'
  }
];

/**
 * Assessment Page Component
 */
export function AssessmentPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(ASSESSMENT_QUESTIONS.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === -1) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]);
    } else {
      // Show results
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleSkip = () => {
    navigate('/system-design/progressive');
  };

  if (showResults) {
    return <AssessmentResults answers={answers} questions={ASSESSMENT_QUESTIONS} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              IdleCampus System Design
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Welcome to System Design Mastery!
          </h1>
          <p className="text-gray-600">
            Let's assess your current knowledge to personalize your learning path.
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
              </span>
              <span className="text-sm text-gray-500">Progress: {Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {ASSESSMENT_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx < currentQuestion
                      ? 'bg-blue-600'
                      : idx === currentQuestion
                      ? 'bg-blue-400'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === idx
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === idx
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswer === idx && (
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswer === -1}
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                selectedAnswer === -1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentQuestion === ASSESSMENT_QUESTIONS.length - 1
                ? 'See Results →'
                : 'Next →'}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                💡 Tip: Don't worry if you're unsure! This helps us create the
                perfect learning path for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Assessment Results Component
 */
interface AssessmentResultsProps {
  answers: number[];
  questions: AssessmentQuestion[];
}

function AssessmentResults({ answers, questions }: AssessmentResultsProps) {
  const navigate = useNavigate();

  // Calculate score
  const correctAnswers = answers.filter(
    (answer, idx) => answer === questions[idx].correctAnswer
  ).length;
  const score = (correctAnswers / questions.length) * 100;

  // Determine skill level
  let skillLevel: 'beginner' | 'intermediate' | 'advanced';
  if (score >= 80) {
    skillLevel = 'advanced';
  } else if (score >= 50) {
    skillLevel = 'intermediate';
  } else {
    skillLevel = 'beginner';
  }

  // Calculate skill breakdown
  const topicScores: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, idx) => {
    if (!topicScores[q.topic]) {
      topicScores[q.topic] = { correct: 0, total: 0 };
    }
    topicScores[q.topic].total++;
    if (answers[idx] === q.correctAnswer) {
      topicScores[q.topic].correct++;
    }
  });

  const handleStartLearning = () => {
    progressiveProgressService.completeAssessment(skillLevel);
    navigate('/system-design/progressive');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              IdleCampus System Design
            </div>
            <button
              onClick={() => navigate('/system-design/progressive')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Assessment Complete!
          </h1>
          <div className="text-2xl font-semibold text-gray-700 mt-4">
            Your Score: {correctAnswers}/{questions.length} ({Math.round(score)}%)
          </div>
          <div className="text-xl text-gray-600 mt-2">
            Recommended Level:{' '}
            <span className="font-semibold capitalize">{skillLevel}</span>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Skill Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(topicScores).map(([topic, scores]) => {
              const percentage = (scores.correct / scores.total) * 100;
              let status = '⚠ Needs Work';
              let statusColor = 'text-red-600';
              if (percentage >= 75) {
                status = '✓ Strong';
                statusColor = 'text-green-600';
              } else if (percentage >= 50) {
                status = '○ Developing';
                statusColor = 'text-yellow-600';
              }

              return (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {topic}:
                    </span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                      {Math.round(percentage)}% {status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 75
                          ? 'bg-green-600'
                          : percentage >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Learning Path */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎯 Recommended Learning Path
          </h2>

          <div className="space-y-4">
            {/* Fundamentals */}
            <div className="border-l-4 border-blue-600 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    📘 FUNDAMENTALS TRACK
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {skillLevel === 'beginner'
                      ? 'START HERE ▼ - Learn the basics and build a strong foundation'
                      : 'Review basics and fill knowledge gaps'}
                  </p>
                  <div className="text-sm text-gray-500">
                    Est: 20 hours • 15 challenges
                  </div>
                </div>
              </div>
            </div>

            {/* Concepts */}
            <div
              className={`border-l-4 ${
                skillLevel === 'beginner' ? 'border-gray-300' : 'border-purple-600'
              } pl-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    📗 CONCEPTS TRACK
                    {skillLevel === 'beginner' && (
                      <span className="text-gray-400">🔒</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {skillLevel === 'beginner'
                      ? 'Unlocks after Fundamentals completion'
                      : skillLevel === 'intermediate'
                      ? 'THEN ▼ - Deep dive into advanced patterns'
                      : 'Advanced patterns and distributed systems'}
                  </p>
                  <div className="text-sm text-gray-500">
                    Est: 35 hours • 24 challenges
                  </div>
                </div>
              </div>
            </div>

            {/* Systems */}
            <div
              className={`border-l-4 ${
                skillLevel === 'advanced' ? 'border-green-600' : 'border-gray-300'
              } pl-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    📕 SYSTEMS TRACK
                    {skillLevel !== 'advanced' && (
                      <span className="text-gray-400">🔒</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {skillLevel === 'advanced'
                      ? 'FINALLY ▼ - Design production-grade systems'
                      : 'Unlocks after Concepts completion'}
                  </p>
                  <div className="text-sm text-gray-500">
                    Est: 45 hours • 22 challenges
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleStartLearning}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Start Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}