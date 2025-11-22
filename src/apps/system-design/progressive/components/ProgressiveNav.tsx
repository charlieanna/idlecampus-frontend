import { Link, useLocation } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { getXPProgressInLevel } from '../types';

/**
 * Progressive Flow Navigation Component
 * Navigation bar for the progressive flow section
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md
 */

export function ProgressiveNav() {
  const location = useLocation();
  const progress = progressiveProgressService.getProgress();
  const xpProgress = getXPProgressInLevel(progress.totalXP);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/system-design/progressive', label: 'Dashboard', icon: '🏠' },
    { path: '/system-design/progressive/tracks', label: 'Tracks', icon: '🛤️' },
    { path: '/system-design/progressive/progress', label: 'Progress', icon: '📊' },
    { path: '/system-design/progressive/skills', label: 'Skills', icon: '🎯' },
    { path: '/system-design/progressive/achievements', label: 'Achievements', icon: '🏆' },
    { path: '/system-design/progressive/leaderboard', label: 'Leaderboard', icon: '🥇' },
    { path: '/system-design/progressive/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <Link 
              to="/system-design/progressive" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Progressive Flow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  flex items-center gap-2
                  ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & XP Bar */}
          <div className="flex items-center gap-4">
            {/* XP Progress */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-600">Level {progress.currentLevel}</div>
                  <div className="text-xs font-bold text-blue-600">
                    {progress.totalXP.toLocaleString()} XP
                  </div>
                </div>
                <div className="w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {xpProgress.xpNeeded - xpProgress.xpInLevel} to Level {progress.currentLevel + 1}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Bell */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <Link
              to="/system-design/progressive/profile"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                U
              </div>
              <div className="hidden xl:block">
                <div className="text-sm font-medium text-gray-900">You</div>
                <div className="text-xs text-gray-600">Level {progress.currentLevel}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 overflow-x-auto">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  flex items-center gap-2
                  ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile XP Bar */}
        <div className="lg:hidden pb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">
              Level {progress.currentLevel}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress.progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="text-xs font-bold text-blue-600">
              {progress.totalXP.toLocaleString()} XP
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Compact Navigation for use within pages
 */
export function CompactProgressiveNav() {
  const location = useLocation();
  const progress = progressiveProgressService.getProgress();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/system-design/progressive', label: 'Dashboard', icon: '🏠' },
    { path: '/system-design/progressive/skills', label: 'Skills', icon: '🎯' },
    { path: '/system-design/progressive/achievements', label: 'Achievements', icon: '🏆' },
    { path: '/system-design/progressive/leaderboard', label: 'Leaderboard', icon: '🥇' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            flex items-center gap-2
            ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
      <div className="ml-auto flex items-center gap-2 text-sm">
        <span className="text-gray-600">Level {progress.currentLevel}</span>
        <span className="font-bold text-blue-600">{progress.totalXP.toLocaleString()} XP</span>
      </div>
    </div>
  );
}