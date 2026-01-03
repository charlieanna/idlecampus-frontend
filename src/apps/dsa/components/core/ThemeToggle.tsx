/**
 * Theme Toggle Component
 * Provides UI control for switching between light, dark, and auto themes
 * Uses inline styles instead of styled-components
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { mode, isDark, setThemeMode } = useTheme();

  const getModeDisplay = () => {
    switch(mode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'auto': return 'Auto';
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '24px',
    backgroundColor: isDark ? '#1c2128' : '#ffffff',
    border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
    boxShadow: `0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.3s ease',
    fontSize: '14px',
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isActive
      ? (isDark ? '#58a6ff' : '#0969da')
      : 'transparent',
    color: isActive
      ? '#ffffff'
      : (isDark ? '#8b949e' : '#57606a'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const labelStyle: React.CSSProperties = {
    color: isDark ? '#c9d1d9' : '#24292f',
    fontWeight: 500,
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle(mode === 'light')}
        onClick={() => setThemeMode('light')}
        title="Light mode"
        aria-label="Light mode"
      >
        <Sun size={18} />
      </button>
      <button
        style={buttonStyle(mode === 'dark')}
        onClick={() => setThemeMode('dark')}
        title="Dark mode"
        aria-label="Dark mode"
      >
        <Moon size={18} />
      </button>
      <button
        style={buttonStyle(mode === 'auto')}
        onClick={() => setThemeMode('auto')}
        title="Auto mode (follow system)"
        aria-label="Auto mode"
      >
        <Monitor size={18} />
      </button>
      <span style={labelStyle}>{getModeDisplay()}</span>
    </div>
  );
};

// Compact version for smaller screens or embedded contexts
export const CompactThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, mode } = useTheme();

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isDark ? '#58a6ff' : '#0969da',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const getIcon = () => {
    switch(mode) {
      case 'light': return <Sun size={18} />;
      case 'dark': return <Moon size={18} />;
      case 'auto': return <Monitor size={18} />;
    }
  };

  return (
    <button
      style={buttonStyle}
      onClick={toggleTheme}
      title={`Current: ${mode} mode. Click to toggle.`}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  );
};
