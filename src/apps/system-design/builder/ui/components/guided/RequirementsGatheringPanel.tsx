import { motion } from 'framer-motion';
import { RequirementsGatheringContent, InterviewQuestion, ConfirmedFR } from '../../../types/guidedTutorial';
import { MarkdownContent } from '../MarkdownContent';
import { ThinkingFrameworkCard } from './ThinkingFrameworkCard';

// =============================================================================
// TYPES
// =============================================================================

interface RequirementsGatheringPanelProps {
  content: RequirementsGatheringContent;
  askedQuestionIds: string[];
  onAskQuestion: (questionId: string) => void;
  onComplete: () => void;
}

// =============================================================================
// QUESTION ANSWER CARD (read-only teaching view)
// =============================================================================

function QuestionAnswerCard({ question }: { question: InterviewQuestion }) {
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical': return { text: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' };
      case 'important': return { text: 'Important', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      default: return { text: 'Optional', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const badge = getImportanceBadge(question.importance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
    >
      {/* Question */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg mt-0.5">🗣️</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-blue-600 font-medium">You ask:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.text}
              </span>
            </div>
            <p className="font-medium text-gray-900">{question.question}</p>
          </div>
        </div>
      </div>

      {/* Answer */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-gray-600 text-lg mt-0.5">👩‍💼</span>
          <div className="flex-1">
            <span className="text-xs text-gray-500 font-medium">Interviewer responds:</span>
            <div className="text-gray-700 mt-1">
              <MarkdownContent content={question.answer} />
            </div>

            {/* Show calculation if present */}
            {question.calculation && (
              <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-700 text-sm font-medium mb-1">
                  <span>📊</span> The Math:
                </div>
                <code className="text-sm text-purple-800 block">{question.calculation.formula}</code>
                <div className="text-sm text-purple-900 font-medium mt-1">→ {question.calculation.result}</div>
              </div>
            )}

            {question.insight && (
              <p className="mt-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                💡 <strong>Insight:</strong> {question.insight}
              </p>
            )}

            {question.learningPoint && (
              <p className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                📚 <strong>Learning:</strong> {question.learningPoint}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// CONFIRMED FRS LIST COMPONENT
// =============================================================================

function ConfirmedFRsList({ frs }: { frs: ConfirmedFR[] }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
      <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
        <span className="text-xl">✅</span> Confirmed Functional Requirements
      </h3>
      <div className="space-y-3">
        {frs.map((fr, index) => (
          <motion.div
            key={fr.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-100"
          >
            <span className="text-xl">{fr.emoji || '📋'}</span>
            <div>
              <div className="font-medium text-green-900">{fr.text}</div>
              <div className="text-sm text-green-700">{fr.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// OUT OF SCOPE COMPONENT
// =============================================================================

function OutOfScopeList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-xl">🚫</span> Out of Scope (for now)
      </h3>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================================
// SECTION HEADER COMPONENT
// =============================================================================

function SectionHeader({
  number,
  title,
  subtitle,
  color = 'indigo'
}: {
  number: number;
  title: string;
  subtitle: string;
  color?: 'indigo' | 'purple' | 'blue' | 'green';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${colorClasses[color]}`}>
        {number}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

// =============================================================================
// FRAMEWORK-BASED VIEW (New - when thinkingFramework is present)
// =============================================================================

function FrameworkBasedView({
  content,
  onComplete,
}: {
  content: RequirementsGatheringContent;
  onComplete: () => void;
}) {
  const framework = content.thinkingFramework!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-sm text-indigo-600 font-medium">
            Step 0 • Requirements Gathering
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            🧠 {framework.title}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {framework.intro}
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{content.interviewer.avatar}</span>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-indigo-900">{content.interviewer.name}</span>
                <span className="text-sm text-indigo-600">• {content.interviewer.role}</span>
              </div>
              <p className="text-lg text-indigo-900 font-medium">
                "{content.problemStatement}"
              </p>
            </div>
          </div>
        </div>

        {/* Framework Steps */}
        <div className="mb-8">
          {framework.steps.map((step, index) => (
            <ThinkingFrameworkCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Start Simple Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>🚀</span> {framework.startSimple.title}
          </h2>
          <p className="text-blue-800 mb-4">{framework.startSimple.description}</p>

          <div className="bg-white/60 rounded-lg p-4 mb-4 border border-blue-100">
            <div className="text-sm text-blue-600 font-medium mb-1">Why start simple?</div>
            <p className="text-blue-900">{framework.startSimple.whySimple}</p>
          </div>

          <p className="text-blue-700 text-sm italic">{framework.startSimple.nextStepPreview}</p>
        </div>

        {/* Confirmed FRs (if available) */}
        {content.confirmedFRs && content.confirmedFRs.length > 0 && (
          <div className="mb-8">
            <ConfirmedFRsList frs={content.confirmedFRs} />
          </div>
        )}

        {/* Out of Scope (if available) */}
        {content.outOfScope && content.outOfScope.length > 0 && (
          <div className="mb-8">
            <OutOfScopeList items={content.outOfScope} />
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center pt-4 pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg shadow-blue-200"
          >
            Got it! Let's Start Building →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// LEGACY Q&A VIEW (Original - fallback when no thinkingFramework)
// =============================================================================

function LegacyQAView({
  content,
  onComplete,
}: {
  content: RequirementsGatheringContent;
  onComplete: () => void;
}) {
  // Group questions by category - Step 0 ONLY shows FR questions
  // (NFR questions exist in data but are used in later steps)
  const frQuestions = content.questions.filter(q =>
    q.category === 'functional' || q.category === 'clarification' || q.category === 'scope'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-sm text-indigo-600 font-medium">
            Step 0 of 10 • Requirements Gathering
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            🎤 First: Gather Functional Requirements
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            In a real interview, you should ALWAYS start by asking clarifying questions about WHAT the system does.
            Never jump straight to designing!
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{content.interviewer.avatar}</span>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-indigo-900">{content.interviewer.name}</span>
                <span className="text-sm text-indigo-600">• {content.interviewer.role}</span>
              </div>
              <p className="text-lg text-indigo-900 font-medium">
                "{content.problemStatement}"
              </p>
            </div>
          </div>
        </div>

        {/* Teaching: Why Ask Questions */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
          <h3 className="font-semibold text-amber-900 mb-2">🎯 Why This Step Matters</h3>
          <p className="text-amber-800">
            Interviewers expect you to ask questions before designing. Jumping straight to a solution
            shows poor problem-solving skills. Good questions help you:
          </p>
          <ul className="mt-3 space-y-1 text-amber-800">
            <li>• Understand the core use cases (what to build)</li>
            <li>• Clarify scope (what NOT to build)</li>
            <li>• Show structured thinking</li>
          </ul>
        </div>

        {/* ================================================================= */}
        {/* PART 1: FUNCTIONAL REQUIREMENTS */}
        {/* ================================================================= */}

        <div className="mb-12">
          <SectionHeader
            number={1}
            title="Functional Requirements"
            subtitle="First, understand WHAT the system does"
            color="indigo"
          />

          {/* FR Questions */}
          <div className="space-y-4 mb-6">
            {frQuestions.filter(q => q.importance === 'critical').map((q) => (
              <QuestionAnswerCard key={q.id} question={q} />
            ))}
          </div>

          {/* Other FR Questions (collapsible feel) */}
          {frQuestions.filter(q => q.importance !== 'critical').length > 0 && (
            <details className="mb-6">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium mb-4">
                + {frQuestions.filter(q => q.importance !== 'critical').length} more clarifying questions...
              </summary>
              <div className="space-y-4">
                {frQuestions.filter(q => q.importance !== 'critical').map((q) => (
                  <QuestionAnswerCard key={q.id} question={q} />
                ))}
              </div>
            </details>
          )}

          {/* Confirmed FRs */}
          <ConfirmedFRsList frs={content.confirmedFRs} />
        </div>

        {/* ================================================================= */}
        {/* PART 2: SUMMARY */}
        {/* ================================================================= */}

        <div className="mb-8">
          <SectionHeader
            number={2}
            title="Summary: What We Learned"
            subtitle="Functional requirements confirmed, ready to build"
            color="green"
          />

          <div className="space-y-4">
            {/* Out of Scope */}
            <OutOfScopeList items={content.outOfScope} />
          </div>
        </div>

        {/* Key Insight - FR-First Approach */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span> Key Insight: FR-First Approach
          </h3>
          <p className="text-blue-800 text-lg">
            First, let's make it <strong>WORK</strong>. We'll build a simple Client → App Server solution
            that satisfies our functional requirements. Once it works, we'll optimize for scale and performance
            in later steps. This is the right way to approach system design: <strong>functionality first, then optimization</strong>.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">🚀 What's Next?</h3>
          <p className="text-gray-700 mb-3">
            Now that we understand the <strong>functional requirements</strong>, let's build a simple solution
            that just works. We'll start with the basics:
          </p>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
              <span>Connect <strong>Client</strong> to <strong>App Server</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
              <span>Implement the core business logic (in-memory storage is fine for now!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
              <span>Once it works, we'll add persistent storage, caching, and scale optimizations</span>
            </li>
          </ol>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4 pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg shadow-blue-200"
          >
            Got it! Let's Start Building →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT - Routes to Framework or Legacy view
// =============================================================================

export function RequirementsGatheringPanel({
  content,
  onComplete,
}: RequirementsGatheringPanelProps) {
  // If thinkingFramework is present, use the new framework-based view
  if (content.thinkingFramework) {
    return <FrameworkBasedView content={content} onComplete={onComplete} />;
  }

  // Otherwise, fall back to the legacy Q&A view
  return <LegacyQAView content={content} onComplete={onComplete} />;
}

export default RequirementsGatheringPanel;