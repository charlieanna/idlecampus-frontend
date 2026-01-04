import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  Brain,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Target,
  Award
} from 'lucide-react';

const sections = [
  {
    id: 'quant',
    title: 'Quantitative Aptitude',
    description: 'Arithmetic, Algebra, Geometry, Number System',
    icon: Calculator,
    color: 'bg-blue-500',
    path: '/cat/quant',
    topics: 34,
    questions: 500
  },
  {
    id: 'dilr',
    title: 'Data Interpretation & Logical Reasoning',
    description: 'Tables, Charts, Puzzles, Arrangements',
    icon: Brain,
    color: 'bg-purple-500',
    path: '/cat/dilr',
    topics: 24,
    questions: 400
  },
  {
    id: 'varc',
    title: 'Verbal Ability & Reading Comprehension',
    description: 'RC, Para Jumbles, Critical Reasoning',
    icon: BookOpen,
    color: 'bg-green-500',
    path: '/cat/varc',
    topics: 20,
    questions: 350
  }
];

const stats = [
  { label: 'Questions Practiced', value: '0', icon: Target },
  { label: 'Mock Tests Taken', value: '0', icon: FileText },
  { label: 'Hours Studied', value: '0', icon: Clock },
  { label: 'Current Percentile', value: '--', icon: TrendingUp }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to CAT Preparation</h1>
        <p className="text-rose-100">
          Master Quantitative Aptitude, DILR, and Verbal Ability for CAT 2025
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => navigate('/cat/mock-tests')}
            className="px-4 py-2 bg-white text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-colors"
          >
            Take Mock Test
          </button>
          <button
            onClick={() => navigate('/cat/analytics')}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium border border-rose-400 hover:bg-rose-700 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Study Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => navigate(section.path)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`${section.color} p-4 text-white`}>
                  <Icon className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 mb-3">{section.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{section.topics} Topics</span>
                    <span className="text-slate-500">{section.questions}+ Questions</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAT Exam Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-100 rounded-lg">
            <Award className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">About CAT Exam</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">Duration</p>
                <p>2 hours (120 minutes)</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Total Questions</p>
                <p>66 questions across 3 sections</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Marking Scheme</p>
                <p>+3 for correct, -1 for wrong (MCQ)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Quick Tips for CAT Preparation</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-rose-500">1.</span>
            <span>Focus on building strong fundamentals in each section before attempting mocks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500">2.</span>
            <span>Practice time management - allocate 40 mins to each section in the actual exam</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500">3.</span>
            <span>Analyze your mock test performance to identify weak areas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500">4.</span>
            <span>Read newspapers and articles daily to improve VARC skills</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
