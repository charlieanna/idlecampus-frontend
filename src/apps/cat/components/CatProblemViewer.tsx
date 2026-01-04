import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, EyeOff, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CatProblem, CatProblemSet } from '../data/types';

interface Props {
  problems: CatProblem[];
  problemSets?: CatProblemSet[];
}

export default function CatProblemViewer({ problems, problemSets = [] }: Props) {
  // Flatten everything into a single list of "Items" to render
  // For sets, we will render the set container.

  return (
    <div className="space-y-12 pb-20">
      {/* Individual Problems */}
      {problems.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Practice Problems
          </h2>
          {problems.map((problem, idx) => (
            <SingleProblemCard key={problem.id} problem={problem} index={idx + 1} />
          ))}
        </div>
      )}

      {/* Problem Sets */}
      {problemSets.map((set, setIdx) => (
        <div key={set.id} className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900">
              Set {setIdx + 1}: {set.topicId.split('-').pop()?.toUpperCase()}
            </h2>
            <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
              {set.difficulty} • {set.estimatedTimeMinutes} mins
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 prose prose-slate max-w-none">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Common Data</h4>
            <ReactMarkdown>{set.commonDataMarkdown}</ReactMarkdown>
          </div>

          <div className="space-y-8 pl-4 border-l-2 border-slate-100">
            {set.subQuestions.map((q, qIdx) => (
              <SingleProblemCard key={q.id} problem={q} index={qIdx + 1} isSubQuestion />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleProblemCard({ problem, index, isSubQuestion }: { problem: CatProblem; index: number; isSubQuestion?: boolean }) {
  const [showSolution, setShowSolution] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [titaInput, setTitaInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    let correct = false;
    if (problem.type === 'MCQ') {
      correct = selectedOption === problem.correctOptionIndex;
    } else {
      // TITA check - loose equality for numbers
      const val = parseFloat(titaInput);
      correct = !isNaN(val) && val === problem.correctValue;
    }
    setIsCorrect(correct);
    setShowSolution(true);
  };

  return (
    <div className={`bg-white rounded-xl border ${isCorrect === true ? 'border-emerald-200' : isCorrect === false ? 'border-rose-200' : 'border-slate-200'} overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-bold text-sm shrink-0">
            Q{index}
          </div>
          <div className="prose prose-slate max-w-none flex-1">
            <ReactMarkdown>{problem.questionMarkdown}</ReactMarkdown>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${problem.difficulty === 'EASY' ? 'bg-green-50 text-green-700 border-green-100' :
              problem.difficulty === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                'bg-red-50 text-red-700 border-red-100'
            }`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Options / Input */}
        <div className="ml-12 space-y-3 max-w-xl">
          {problem.type === 'MCQ' && problem.options ? (
            <div className="space-y-2">
              {problem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => !showSolution && setSelectedOption(idx)}
                  disabled={showSolution}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between
                    ${showSolution && idx === problem.correctOptionIndex
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900' // Correct answer always green if revealed
                      : showSolution && selectedOption === idx && idx !== problem.correctOptionIndex
                        ? 'bg-rose-50 border-rose-500 text-rose-900' // Wrong selection
                        : selectedOption === idx
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500' // Selected (pre-check)
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>

                  {showSolution && idx === problem.correctOptionIndex && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                  {showSolution && selectedOption === idx && idx !== problem.correctOptionIndex && (
                    <X className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="text"
                value={titaInput}
                onChange={(e) => setTitaInput(e.target.value)}
                disabled={showSolution}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            {!showSolution ? (
              <button
                onClick={checkAnswer}
                disabled={problem.type === 'MCQ' ? selectedOption === null : !titaInput}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Check Answer
              </button>
            ) : (
              <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Incorrect
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solution Section */}
      {showSolution && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 animate-in slide-in-from-top-2">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Detailed Solution
          </h4>
          <div className="prose prose-sm prose-slate max-w-none text-slate-700">
            <ReactMarkdown>{problem.solutionMarkdown}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
