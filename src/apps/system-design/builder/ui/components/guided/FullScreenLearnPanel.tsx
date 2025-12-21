import { motion } from 'framer-motion';
import { TeachingContent } from '../../../types/guidedTutorial';

/**
 * Simple markdown renderer for basic formatting
 * Supports: **bold**, `code`, and preserves line breaks
 */
function renderMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Parse inline formatting
    const parts: JSX.Element[] = [];
    let remaining = line;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Check for **bold**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Check for `code`
      const codeMatch = remaining.match(/`([^`]+)`/);

      // Find the earliest match
      let earliestMatch: { type: 'bold' | 'code'; match: RegExpMatchArray } | null = null;

      if (boldMatch && (!codeMatch || boldMatch.index! <= codeMatch.index!)) {
        earliestMatch = { type: 'bold', match: boldMatch };
      } else if (codeMatch) {
        earliestMatch = { type: 'code', match: codeMatch };
      }

      if (earliestMatch) {
        const { type, match } = earliestMatch;
        const beforeText = remaining.slice(0, match.index);

        if (beforeText) {
          parts.push(<span key={`${lineIndex}-${keyIndex++}`}>{beforeText}</span>);
        }

        if (type === 'bold') {
          parts.push(
            <strong key={`${lineIndex}-${keyIndex++}`} className="font-semibold text-gray-900">
              {match[1]}
            </strong>
          );
        } else {
          parts.push(
            <code key={`${lineIndex}-${keyIndex++}`} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700">
              {match[1]}
            </code>
          );
        }

        remaining = remaining.slice(match.index! + match[0].length);
      } else {
        parts.push(<span key={`${lineIndex}-${keyIndex++}`}>{remaining}</span>);
        remaining = '';
      }
    }

    // Return line with line break (except for last line)
    return (
      <span key={lineIndex}>
        {parts.length > 0 ? parts : ' '}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

interface FullScreenLearnPanelProps {
  content: TeachingContent;
  stepNumber: number;
  totalSteps: number;
  onStartPractice: () => void;
}

/**
 * Full-screen learning panel that teaches the concept before practice
 * Shows concept explanation, diagrams, key points, and a quiz
 */
export function FullScreenLearnPanel({
  content,
  stepNumber,
  totalSteps,
  onStartPractice,
}: FullScreenLearnPanelProps) {
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
          <span className="text-sm text-blue-600 font-medium">
            Step {stepNumber} of {totalSteps} • Learn
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {content.conceptTitle}
          </h1>
        </div>

        {/* Main explanation */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-gray-700 leading-relaxed">
            {renderMarkdown(content.conceptExplanation)}
          </div>
        </div>

        {/* Diagram if available */}
        {content.diagram && (
          <div className="bg-slate-900 rounded-xl p-6 mb-8 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm whitespace-pre">
              {content.diagram}
            </pre>
          </div>
        )}

        {/* Framework Reminder - connects back to scale framework questions */}
        {content.frameworkReminder && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 border-l-4 border-indigo-500 p-6 mb-8"
          >
            <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <span>🧠</span> Scale Framework Connection
            </h3>
            <p className="text-indigo-800 mb-2">
              <strong>The expert question:</strong> "{content.frameworkReminder.question}"
            </p>
            <p className="text-indigo-700">
              {content.frameworkReminder.connection}
            </p>
          </motion.div>
        )}

        {/* Why it matters */}
        {content.whyItMatters && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <h3 className="font-semibold text-amber-900 mb-2">Why This Matters</h3>
            <p className="text-amber-800">{content.whyItMatters}</p>
          </div>
        )}

        {/* Key concepts */}
        {content.keyConcepts && content.keyConcepts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {content.keyConcepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-blue-50 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{concept.icon || '💡'}</span>
                  <h4 className="font-semibold text-blue-900">{concept.title}</h4>
                </div>
                <p className="text-blue-800 text-sm">{concept.explanation}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Key points */}
        {content.keyPoints && content.keyPoints.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Key Points</h3>
            <ul className="space-y-3">
              {content.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Real world example */}
        {content.realWorldExample && (
          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-purple-900 mb-3">
              Real World: {content.realWorldExample.company}
            </h3>
            <p className="text-purple-800 mb-2">
              <strong>Scenario:</strong> {content.realWorldExample.scenario}
            </p>
            <p className="text-purple-700 text-sm">
              {content.realWorldExample.howTheyDoIt}
            </p>
          </div>
        )}

        {/* Famous Incident - What Can Go Wrong */}
        {content.famousIncident && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                {content.famousIncident.icon || '⚠️'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    INCIDENT
                  </span>
                  <span className="text-xs text-gray-500">
                    {content.famousIncident.company} • {content.famousIncident.year}
                  </span>
                </div>
                <h3 className="font-bold text-red-900 text-lg mb-2">
                  {content.famousIncident.title}
                </h3>
                <p className="text-red-800 mb-3 text-sm leading-relaxed">
                  {content.famousIncident.whatHappened}
                </p>
                <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                        Lesson Learned
                      </p>
                      <p className="text-sm text-red-800">
                        {content.famousIncident.lessonLearned}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick quiz */}
        {content.quickCheck && (
          <div className="bg-slate-100 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Check</h3>
            <p className="text-slate-800 mb-4">{content.quickCheck.question}</p>
            <div className="space-y-2">
              {content.quickCheck.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    index === content.quickCheck!.correctIndex
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-sm">
                    {index === content.quickCheck!.correctIndex && '✓ '}
                    {option}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-4 italic">
              {content.quickCheck.explanation}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center pt-4 pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartPractice}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg shadow-blue-200"
          >
            Now Let's Build It →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
