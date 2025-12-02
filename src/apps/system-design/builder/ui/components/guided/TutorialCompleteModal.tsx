import { useEffect, useState } from 'react';

interface TutorialCompleteModalProps {
  isOpen: boolean;
  tutorialTitle: string;
  totalSteps: number;
  hintsUsed?: number;
  onTryAnotherChallenge: () => void;
  onSolveOnYourOwn: () => void;
  onClose: () => void;
}

/**
 * TutorialCompleteModal - Celebration modal shown when tutorial is completed
 *
 * Features:
 * - CSS confetti animation
 * - Trophy and congratulations message
 * - Stats summary
 * - CTA buttons for next actions
 */
export function TutorialCompleteModal({
  isOpen,
  tutorialTitle,
  totalSteps,
  hintsUsed = 0,
  onTryAnotherChallenge,
  onSolveOnYourOwn,
  onClose,
}: TutorialCompleteModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti after modal appears
      const timer = setTimeout(() => setShowConfetti(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
      >
        {/* Confetti container */}
        {showConfetti && <ConfettiAnimation />}

        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-8 text-center relative overflow-hidden">
            {/* Sparkle decorations */}
            <div className="absolute top-4 left-4 text-2xl animate-pulse">✨</div>
            <div className="absolute top-6 right-6 text-xl animate-pulse delay-100">⭐</div>
            <div className="absolute bottom-4 left-8 text-lg animate-pulse delay-200">🌟</div>

            {/* Trophy */}
            <div className="text-6xl mb-4 animate-bounce">🏆</div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-white/90 text-sm">
              You've mastered the guided tutorial
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Challenge name */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {tutorialTitle}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tutorial Complete
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalSteps}
                </div>
                <div className="text-xs text-green-700 font-medium">
                  Steps Completed
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {hintsUsed}
                </div>
                <div className="text-xs text-blue-700 font-medium">
                  Hints Used
                </div>
              </div>
            </div>

            {/* Encouragement message */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                You've learned the key concepts step by step. Now you're ready to
                apply this knowledge on your own!
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={onSolveOnYourOwn}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
              >
                <span>🎯</span>
                <span>Solve on Your Own</span>
              </button>

              <button
                onClick={onTryAnotherChallenge}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>📚</span>
                <span>Try Another Challenge</span>
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </>
  );
}

/**
 * CSS-based confetti animation
 */
function ConfettiAnimation() {
  // Generate confetti pieces
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'][
      Math.floor(Math.random() * 8)
    ],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute confetti-piece"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-piece {
          animation: confettiFall linear forwards;
        }
      `}</style>
    </div>
  );
}
