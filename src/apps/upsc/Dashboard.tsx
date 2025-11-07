import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { upscApi, type DashboardData, type DailyTask, type Revision } from '../../services/upscApi';
import {
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
  Award,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await upscApi.getDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, today, progress, recent_activity } = data;
  const daysToExam = overview.days_to_exam || null;
  const overallProgress = progress.overall.completion_percentage || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Your UPSC CSE preparation overview</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days to Exam */}
        {daysToExam !== null && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">Days to Exam</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{daysToExam}</p>
            <p className="text-xs text-slate-500 mt-1">
              {Math.floor(daysToExam / 30)} months remaining
            </p>
          </div>
        )}

        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-600">Overall Progress</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{overallProgress.toFixed(1)}%</p>
          <div className="mt-2 bg-slate-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-600">Today's Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {today.tasks.completed}/{today.tasks.total}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {today.tasks.pending} pending tasks
          </p>
        </div>

        {/* Topics Completed */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-600">Topics Completed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {progress.overall.completed_topics}/{progress.overall.total_topics}
          </p>
          <p className="text-xs text-slate-500 mt-1">Syllabus coverage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Today's Tasks</h2>
            <button
              onClick={() => navigate('/upsc/tasks')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          {today.tasks.list.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-600">No tasks for today</p>
              <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {today.tasks.list.slice(0, 5).map((task: DailyTask) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      {task.topic && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {task.topic.name}
                        </span>
                      )}
                      {task.estimated_duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimated_duration_minutes} min
                        </span>
                      )}
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Revisions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Revisions Due</h2>
            <button
              onClick={() => navigate('/upsc/revisions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          {today.revisions.list.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-600">No revisions today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {today.revisions.list.map((revision: Revision) => (
                <div
                  key={revision.id}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <h4 className="font-medium text-slate-900">
                    {revision.topic?.name || 'Topic'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Interval: {revision.interval_index + 1}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Subject-wise Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.by_subject.map((subject: any) => (
            <div key={subject.subject_id} className="p-4 rounded-lg border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-2">{subject.subject_name}</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">
                  {subject.completed_topics}/{subject.total_topics} topics
                </span>
                <span className="font-medium text-slate-900">
                  {subject.completion_percentage.toFixed(0)}%
                </span>
              </div>
              <div className="bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${subject.completion_percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Tests</h2>
          </div>

          {recent_activity.recent_tests.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No tests attempted yet</p>
          ) : (
            <div className="space-y-3">
              {recent_activity.recent_tests.map((attempt: any) => (
                <div
                  key={attempt.id}
                  className="p-3 rounded-lg border border-slate-200"
                >
                  <h4 className="font-medium text-slate-900">{attempt.test?.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-slate-600">
                      Score: <span className="font-medium text-slate-900">{attempt.score}</span>
                    </span>
                    <span className="text-slate-600">
                      {attempt.percentage.toFixed(1)}%
                    </span>
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${attempt.percentage >= 75 ? 'bg-green-100 text-green-700' :
                        attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {attempt.percentage >= 75 ? 'Excellent' :
                       attempt.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Answer Writing */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">Answer Writing</h2>
          </div>

          {recent_activity.recent_answers.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No answers submitted yet</p>
          ) : (
            <div className="space-y-3">
              {recent_activity.recent_answers.map((answer: any) => (
                <div
                  key={answer.id}
                  className="p-3 rounded-lg border border-slate-200"
                >
                  <h4 className="font-medium text-slate-900 line-clamp-2">
                    {answer.writing_question?.question_text}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {answer.status === 'evaluated' && answer.score && (
                      <span className="text-slate-600">
                        Score: <span className="font-medium text-slate-900">{answer.score}/100</span>
                      </span>
                    )}
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${answer.status === 'evaluated' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {answer.status === 'evaluated' ? 'Evaluated' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/upsc/practice')}
            className="bg-white hover:bg-slate-50 rounded-lg p-4 text-center border border-slate-200 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-900">Practice</span>
          </button>
          <button
            onClick={() => navigate('/upsc/tests')}
            className="bg-white hover:bg-slate-50 rounded-lg p-4 text-center border border-slate-200 transition-colors"
          >
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-900">Mock Test</span>
          </button>
          <button
            onClick={() => navigate('/upsc/writing')}
            className="bg-white hover:bg-slate-50 rounded-lg p-4 text-center border border-slate-200 transition-colors"
          >
            <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-900">Write Answer</span>
          </button>
          <button
            onClick={() => navigate('/upsc/current-affairs')}
            className="bg-white hover:bg-slate-50 rounded-lg p-4 text-center border border-slate-200 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-900">Daily News</span>
          </button>
        </div>
      </div>
    </div>
  );
}
