import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import {
  Home,
  Calculator,
  Brain,
  BookOpen,
  FileText,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import CatSectionPage from './pages/CatSectionPage';
import CatTopicPage from './pages/CatTopicPage';
import ExamInterface from './pages/exam/ExamInterface';

// ============================================
// NAVIGATION
// ============================================

const navItems = [
  { path: '/cat', icon: Home, label: 'Dashboard' },
  { path: '/cat/quant', icon: Calculator, label: 'Quantitative Aptitude' },
  { path: '/cat/dilr', icon: Brain, label: 'DILR' },
  { path: '/cat/varc', icon: BookOpen, label: 'VARC' },
  { path: '/cat/mock-tests', icon: FileText, label: 'Mock Tests' },
  { path: '/cat/analytics', icon: BarChart3, label: 'Analytics' },
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
              <h1 className="text-xl font-bold text-slate-900">CAT Prep</h1>
              <p className="text-xs text-slate-500">MBA Entrance Preparation</p>
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
                          ? 'bg-rose-50 text-rose-700'
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
            <div className="bg-rose-50 rounded-lg p-3">
              <p className="text-xs font-medium text-rose-900 mb-1">
                CAT 2025
              </p>
              <p className="text-xs text-rose-700">
                Comprehensive MBA entrance prep
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Placeholder components for sections
// function QuantSection() { ... removed ... }

// function DILRSection() { ... removed ... }

// function VARCSection() { ... removed ... }

function MockTests() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Mock Tests</h1>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">CAT Mock Test {num}</h3>
              <p className="text-sm text-slate-500">Full length | 3 hours | 66 questions</p>
            </div>
            <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Performance Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Overall Score</p>
          <p className="text-3xl font-bold text-slate-900">--</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Tests Attempted</p>
          <p className="text-3xl font-bold text-slate-900">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Questions Practiced</p>
          <p className="text-3xl font-bold text-slate-900">0</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Section-wise Performance</h3>
        <p className="text-slate-500">Complete some tests to see your analytics</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function CatApp() {
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
            <h1 className="text-lg font-bold text-slate-900">CAT Prep</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Dynamic Section Page (e.g., /cat/quant) */}
            <Route path="/:sectionId" element={<CatSectionPage />} />
            {/* Dynamic Topic Page (e.g., /cat/quant/arithmetic-time-work) */}
            <Route path="/:sectionId/:topicId" element={<CatTopicPage />} />

            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/cat" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
