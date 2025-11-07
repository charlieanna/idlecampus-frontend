import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { upscApi, type Subject } from '../../services/upscApi';
import { BookOpen, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function SubjectList() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filter, setFilter] = useState<'all' | 'prelims' | 'mains' | 'optional'>('all');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubjects();
  }, [filter]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      switch (filter) {
        case 'prelims':
          result = await upscApi.getPrelimsSubjects();
          break;
        case 'mains':
          result = await upscApi.getMainsSubjects();
          break;
        case 'optional':
          result = await upscApi.getOptionalSubjects();
          break;
        default:
          result = await upscApi.getSubjects();
      }

      setSubjects(result.subjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">{error}</p>
          <button
            onClick={loadSubjects}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Subjects</h1>
        <p className="text-slate-600 mt-1">Explore UPSC CSE syllabus</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'prelims', 'mains', 'optional'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => navigate(`/upsc/subjects/${subject.id}/topics`)}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                subject.exam_type === 'prelims' ? 'bg-green-100 text-green-700' :
                subject.exam_type === 'mains' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {subject.exam_type}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 mb-2">{subject.name}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{subject.description || 'No description'}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {subject.total_topics_count || 0} topics
              </span>
              {subject.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {subject.duration_minutes} min
                </span>
              )}
              {subject.high_yield_topics_count && subject.high_yield_topics_count > 0 && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {subject.high_yield_topics_count} high-yield
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
