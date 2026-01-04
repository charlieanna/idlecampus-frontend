import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getMock } from '../../data/mocks';
import { getProblem, getProblemSet } from '../../data/contentMap';
import { CatProblem, CatProblemSet } from '../../data/types';

// Types for local state
type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED' | 'MARKED_ANSWERED';

interface ExamState {
  currentSectionIdx: number;
  sectionTimeRemaining: number; // in seconds
  answers: Record<string, string | number>; // qId -> answer (index or value)
  status: Record<string, QuestionStatus>;
  currentQuestionId: string | null;
}

export default function ExamInterface() {
  const { mockId } = useParams();
  const mock = useMemo(() => getMock(mockId || ''), [mockId]);

  // Initial State
  const [state, setState] = useState<ExamState>({
    currentSectionIdx: 0,
    sectionTimeRemaining: 0,
    answers: {},
    status: {},
    currentQuestionId: null
  });

  // Initialize Section
  useEffect(() => {
    if (mock) {
      const section = mock.sections[state.currentSectionIdx];
      // Flatten questions to find the first one
      let firstQ = '';
      if (section.problemIds.length > 0) firstQ = section.problemIds[0];
      else if (section.problemSetIds && section.problemSetIds.length > 0) {
        const set = getProblemSet(section.problemSetIds[0]);
        if (set && set.subQuestions.length > 0) firstQ = set.subQuestions[0].id;
      }

      setState(prev => ({
        ...prev,
        sectionTimeRemaining: section.durationMinutes * 60,
        currentQuestionId: firstQ
      }));
    }
  }, [mock, state.currentSectionIdx]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.sectionTimeRemaining <= 0) {
          // Time up! Move to next section or submit
          // For now, simpler logic: just sit at 0
          return prev;
        }
        return { ...prev, sectionTimeRemaining: prev.sectionTimeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mock) return <div className="p-8">Mock Test Not Found</div>;

  const currentSection = mock.sections[state.currentSectionIdx];

  // Helper to get ALL questions in current section (flattened)
  const allSectionQuestions = useMemo(() => {
    let qs: { id: string; type: 'SINGLE' | 'SET'; set?: CatProblemSet; problem?: CatProblem }[] = [];

    // Add standalone
    currentSection.problemIds.forEach(id => {
      const p = getProblem(id);
      if (p) qs.push({ id, type: 'SINGLE', problem: p });
    });

    // Add sets
    if (currentSection.problemSetIds) {
      currentSection.problemSetIds.forEach(setId => {
        const s = getProblemSet(setId);
        if (s) {
          s.subQuestions.forEach(sq => {
            qs.push({ id: sq.id, type: 'SET', set: s, problem: sq });
          });
        }
      });
    }
    return qs;
  }, [currentSection]);

  const currentQIndex = allSectionQuestions.findIndex(q => q.id === state.currentQuestionId);
  const currentQItem = allSectionQuestions[currentQIndex];

  // Logic to update answer
  const handleAnswer = (val: string | number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [state.currentQuestionId!]: val },
      status: { ...prev.status, [state.currentQuestionId!]: 'ANSWERED' }
    }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
        <div className="font-bold text-slate-800">{mock.title}</div>
        <div className="flex items-center gap-2 font-mono text-xl font-bold text-rose-600 bg-white px-4 py-1 rounded border border-rose-100 shadow-sm">
          <Clock className="w-5 h-5" />
          {formatTime(state.sectionTimeRemaining)}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Section Tabs (Non-clickable usually, but visible) */}
          <div className="flex items-center bg-slate-100 border-b border-slate-200">
            {mock.sections.map((sec, idx) => (
              <div
                key={sec.id}
                className={`px-6 py-3 font-medium text-sm ${idx === state.currentSectionIdx
                  ? 'bg-white border-t-2 border-t-rose-600 text-rose-700'
                  : 'text-slate-500'
                  }`}
              >
                {sec.title}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {currentQItem && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Set Context if exists */}
                {currentQItem.type === 'SET' && currentQItem.set && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-6 max-h-60 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Common Data</div>
                    <div className="prose prose-sm"><ReactMarkdown>{currentQItem.set.commonDataMarkdown}</ReactMarkdown></div>
                  </div>
                )}

                {/* Question */}
                {currentQItem.problem && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-rose-600 text-white px-2 py-1 rounded text-sm font-bold">Q{currentQIndex + 1}</span>
                      <span className="text-sm text-slate-500 uppercase font-bold tracking-wide">{currentQItem.problem.type}</span>
                    </div>
                    <div className="prose prose-lg text-slate-900 mb-8">
                      <ReactMarkdown>{currentQItem.problem.questionMarkdown}</ReactMarkdown>
                    </div>

                    {/* Options / Input */}
                    <div className="space-y-3 max-w-xl">
                      {currentQItem.problem.type === 'MCQ' ? (
                        currentQItem.problem.options?.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`
                               w-full text-left px-4 py-4 rounded-lg border flex items-center gap-3 transition-all
                               ${state.answers[currentQItem.id] === idx
                                ? 'bg-rose-50 border-rose-500 text-rose-900'
                                : 'bg-white border-slate-200 hover:bg-slate-50'}
                             `}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${state.answers[currentQItem.id] === idx ? 'border-rose-600 bg-rose-600' : 'border-slate-400'}`}>
                              {state.answers[currentQItem.id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            {opt}
                          </button>
                        ))
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter your answer"
                          value={state.answers[currentQItem.id] || ''}
                          onChange={(e) => handleAnswer(e.target.value)}
                          className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="h-16 border-t border-slate-200 bg-white p-4 flex items-center justify-between">
            <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded">Mark for Review</button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (currentQIndex > 0) setState(prev => ({ ...prev, currentQuestionId: allSectionQuestions[currentQIndex - 1].id }));
                }}
                disabled={currentQIndex === 0}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const nextQ = allSectionQuestions[currentQIndex + 1];
                  if (nextQ) setState(prev => ({ ...prev, currentQuestionId: nextQ.id }));
                }}
                className="px-6 py-2 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: Palette */}
        <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 bg-white border-b border-slate-200 font-bold">Question Palette</div>
          <div className="flex-1 p-4 grid grid-cols-5 gap-2 content-start overflow-y-auto">
            {allSectionQuestions.map((q, idx) => {
              const status = state.answers[q.id] !== undefined ? 'answered' : 'not_answered';
              const isCurrent = q.id === state.currentQuestionId;

              let bgClass = 'bg-white border-slate-300 text-slate-700'; // Default not visited
              if (status === 'answered') bgClass = 'bg-green-500 text-white border-green-600';
              // if visited but not answered (needs tracking visited state separately, simplified here)

              if (isCurrent) bgClass += ' ring-2 ring-rose-500 ring-offset-2';

              return (
                <button
                  key={q.id}
                  onClick={() => setState(prev => ({ ...prev, currentQuestionId: q.id }))}
                  className={`h-10 w-10 rounded border flex items-center justify-center font-bold text-sm ${bgClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="p-4 border-t border-slate-200">
            <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded shadow-sm hover:bg-emerald-700">
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
