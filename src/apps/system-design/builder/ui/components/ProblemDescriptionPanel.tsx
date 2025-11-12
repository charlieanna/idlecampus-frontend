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

      {/* Your Goal */}
      <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Your Goal</h3>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-indigo-700 mb-2">Phase 1: Functional Requirements</div>
            <div className="text-sm text-gray-700">
              <p className="mb-2">Design a system that correctly implements these core features:</p>
              <ul className="space-y-1.5 ml-4">
                {challenge.testCases
                  .filter(tc => tc.type === 'functional')
                  .map((tc, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>{tc.description}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200">
            <div className="text-xs font-medium text-indigo-700 mb-2">Phase 2: Non-Functional Requirements</div>
            <div className="text-sm text-gray-700">
              <ul className="space-y-1.5 ml-4">
                {challenge.testCases
                  .filter(tc => tc.type !== 'functional')
                  .map((tc, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>{tc.description}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Targets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Targets</h3>
        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Traffic</div>
            <p className="text-sm text-gray-700">{challenge.requirements.traffic}</p>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Latency</div>
            <p className="text-sm text-gray-700">{challenge.requirements.latency}</p>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Availability</div>
            <p className="text-sm text-gray-700">{challenge.requirements.availability}</p>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Budget</div>
            <p className="text-sm text-gray-700">{challenge.requirements.budget}</p>
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
