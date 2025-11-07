import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import SubjectList from './SubjectList';
import TopicExplorer from './TopicExplorer';
import PracticeQuestions from './PracticeQuestions';
import TestCenter from './TestCenter';
import TestAttempt from './TestAttempt';
import TestResults from './TestResults';
import AnswerWriting from './AnswerWriting';
import CurrentAffairs from './CurrentAffairs';
import StudyPlanner from './StudyPlanner';
import DailyTasksView from './DailyTasksView';
import RevisionsView from './RevisionsView';
import {
  Home,
  BookOpen,
  FileText,
  PenTool,
  Newspaper,
  Calendar,
  CheckSquare,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

// ============================================
// NAVIGATION
// ============================================

const navItems = [
  { path: '/upsc', icon: Home, label: 'Dashboard' },
  { path: '/upsc/subjects', icon: BookOpen, label: 'Subjects' },
  { path: '/upsc/practice', icon: FileText, label: 'Practice' },
  { path: '/upsc/tests', icon: FileText, label: 'Mock Tests' },
  { path: '/upsc/writing', icon: PenTool, label: 'Answer Writing' },
  { path: '/upsc/current-affairs', icon: Newspaper, label: 'Current Affairs' },
  { path: '/upsc/study-plan', icon: Calendar, label: 'Study Plan' },
  { path: '/upsc/tasks', icon: CheckSquare, label: 'Daily Tasks' },
  { path: '/upsc/revisions', icon: RefreshCw, label: 'Revisions' },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200
          w-64 transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-bold text-slate-900">UPSC CSE</h1>
              <p className="text-xs text-slate-500">Preparation Platform</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900 mb-1">
                UPSC CSE 2025
              </p>
              <p className="text-xs text-blue-700">
                Comprehensive preparation platform
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function UpscApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - mobile only */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">UPSC CSE</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/subjects/:id/topics" element={<TopicExplorer />} />
            <Route path="/practice" element={<PracticeQuestions />} />
            <Route path="/tests" element={<TestCenter />} />
            <Route path="/tests/:id/attempt" element={<TestAttempt />} />
            <Route path="/tests/:id/results" element={<TestResults />} />
            <Route path="/writing" element={<AnswerWriting />} />
            <Route path="/current-affairs" element={<CurrentAffairs />} />
            <Route path="/study-plan" element={<StudyPlanner />} />
            <Route path="/tasks" element={<DailyTasksView />} />
            <Route path="/revisions" element={<RevisionsView />} />
            <Route path="*" element={<Navigate to="/upsc" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
