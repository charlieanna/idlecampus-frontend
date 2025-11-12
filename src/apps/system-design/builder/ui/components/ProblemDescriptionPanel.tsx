import { Challenge } from '../../types/testCase';

interface ProblemDescriptionPanelProps {
  challenge: Challenge;
}

export function ProblemDescriptionPanel({ challenge }: ProblemDescriptionPanelProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {challenge.title}
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              challenge.difficulty === 'beginner'
                ? 'bg-green-100 text-green-700'
                : challenge.difficulty === 'intermediate'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
        </div>
      </div>

      {/* Your Goal - High-level requirements */}
      <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Your Goal</h3>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-indigo-700 mb-2">Functional Requirements</div>
            <div className="text-sm text-gray-700">
              <p className="mb-2">Design a system that implements these features:</p>
              <ul className="space-y-1.5 ml-4">
                {challenge.requirements.functional.map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200">
            <div className="text-xs font-medium text-indigo-700 mb-2">Non-Functional Requirements</div>
            <div className="text-sm text-gray-700">
              {challenge.requirements.nfrs && challenge.requirements.nfrs.length > 0 ? (
                // Show detailed user-facing NFRs if available
                <ul className="space-y-1.5 ml-4">
                  {challenge.requirements.nfrs.map((nfr, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>{nfr}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // Fallback to old format if no detailed NFRs
                <ul className="space-y-1.5 ml-4">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📊</span>
                    <span><strong>Traffic:</strong> {challenge.requirements.traffic}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚡</span>
                    <span><strong>Latency:</strong> {challenge.requirements.latency}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🎯</span>
                    <span><strong>Availability:</strong> {challenge.requirements.availability}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💰</span>
                    <span><strong>Budget:</strong> {challenge.requirements.budget}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs font-medium text-blue-700 mb-1">💡 Hint</div>
        <p className="text-sm text-blue-700">
          Drag components from the right panel onto the canvas and connect them to build your system architecture.
        </p>
      </div>
    </div>
  );
}
