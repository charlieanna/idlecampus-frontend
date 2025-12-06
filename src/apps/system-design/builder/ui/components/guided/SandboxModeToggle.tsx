import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SandboxModeToggleProps {
  isTutorialComplete: boolean;
  isSandboxEnabled: boolean;
  onToggleSandbox: (enabled: boolean) => void;
}

export function SandboxModeToggle({
  isTutorialComplete,
  isSandboxEnabled,
  onToggleSandbox,
}: SandboxModeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isTutorialComplete) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={() => onToggleSandbox(!isSandboxEnabled)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all ${
            isSandboxEnabled
              ? 'bg-purple-600 text-white shadow-purple-200'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
          }`}
        >
          <span className="text-xl">{isSandboxEnabled ? '🎨' : '🔒'}</span>
          <div className="text-left">
            <div className="font-medium text-sm">
              {isSandboxEnabled ? 'Sandbox Mode' : 'Guided Mode'}
            </div>
            <div className={`text-xs ${isSandboxEnabled ? 'text-purple-200' : 'text-gray-500'}`}>
              {isSandboxEnabled ? 'Free exploration enabled' : 'Click to unlock canvas'}
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
            isSandboxEnabled ? 'bg-purple-400' : 'bg-gray-300'
          }`}>
            <motion.div 
              className="w-4 h-4 bg-white rounded-full shadow"
              animate={{ x: isSandboxEnabled ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </button>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 text-white rounded-lg p-4 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <h4 className="font-semibold mb-1">
                    {isSandboxEnabled ? 'Sandbox Mode Active' : 'Tutorial Complete!'}
                  </h4>
                  <p className="text-sm text-slate-300">
                    {isSandboxEnabled 
                      ? 'Add any components, make any connections. Explore freely without step validation.'
                      : 'Toggle sandbox mode to freely experiment with the canvas without guided validation.'}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-slate-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function SandboxModeBanner({ onExitSandbox }: { onExitSandbox: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🎨</span>
        <div>
          <span className="font-medium">Sandbox Mode</span>
          <span className="text-purple-200 text-sm ml-2">
            Free exploration - no validation
          </span>
        </div>
      </div>
      <button
        onClick={onExitSandbox}
        className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
      >
        Exit Sandbox
      </button>
    </motion.div>
  );
}
