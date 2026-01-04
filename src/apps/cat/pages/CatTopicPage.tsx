import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getModule } from '../data/contentMap';
import CatProblemViewer from '../components/CatProblemViewer';

export default function CatTopicPage() {
  const { sectionId, topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'lesson' | 'practice'>('lesson');

  const module = getModule(topicId || '');

  if (!module) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Topic Not Found</h2>
        <button onClick={() => navigate('/cat')} className="mt-4 text-rose-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/cat/${sectionId}`)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{module.topic.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="uppercase tracking-wider font-semibold">{module.topic.section}</span>
              <span>•</span>
              <span>{module.topic.description}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'lesson'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'practice'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <PlayCircle className="w-4 h-4" />
            Practice
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {activeTab === 'lesson' ? (
          <div className="space-y-8">
            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="prose prose-slate max-w-none">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-rose-900 m-0 mb-2">{lesson.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-rose-700">
                    <Clock className="w-4 h-4" />
                    {lesson.durationMinutes} min read
                  </div>
                </div>

                <ReactMarkdown className="markdown-body">
                  {lesson.contentMarkdown}
                </ReactMarkdown>

                {lesson.keyTakeaways.length > 0 && (
                  <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 m-0 mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2 m-0 p-0 list-none">
                      {lesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-800">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr className="my-8 border-slate-200" />
              </div>
            ))}

            <button
              onClick={() => setActiveTab('practice')}
              className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Practice Problems
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <CatProblemViewer
            problems={module.problems}
            problemSets={module.problemSets}
          />
        )}
      </div>
    </div>
  );
}
