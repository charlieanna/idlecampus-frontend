import React from 'react';
import { BuilderMode } from '../../../types/guidedTutorial';

interface ModeSwitcherProps {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  isTutorialCompleted: boolean;
  disabled?: boolean;
}

export function ModeSwitcher({
  mode,
  onModeChange,
  isTutorialCompleted,
  disabled = false,
}: ModeSwitcherProps) {
  // Don't show switcher if tutorial not completed
  if (!isTutorialCompleted) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-blue-600 font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Guided Tutorial
        </span>
        <span className="text-gray-400 text-xs">
          (Complete to unlock free mode)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <ModeButton
        isActive={mode === 'guided-tutorial'}
        onClick={() => onModeChange('guided-tutorial')}
        disabled={disabled}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
        label="Guided Tutorial"
      />
      <ModeButton
        isActive={mode === 'solve-on-own'}
        onClick={() => onModeChange('solve-on-own')}
        disabled={disabled}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
        label="Solve on Your Own"
      />
    </div>
  );
}

interface ModeButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}

function ModeButton({ isActive, onClick, disabled, icon, label }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/**
 * Compact mode indicator for narrow spaces
 */
export function ModeIndicator({ mode }: { mode: BuilderMode }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
        ${mode === 'guided-tutorial'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-purple-100 text-purple-700'
        }
      `}
    >
      {mode === 'guided-tutorial' ? (
        <>
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Guided
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
          Free Mode
        </>
      )}
    </span>
  );
}
