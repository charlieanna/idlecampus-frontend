import { GuidedStep, HintLevel } from '../../../types/guidedTutorial';

interface HintSystemProps {
  step: GuidedStep;
  hintLevel: HintLevel;
  attemptCount: number;
  onRequestHint: () => void;
  onShowSolution: () => void;
}

export function HintSystem({
  step,
  hintLevel,
  attemptCount,
  onRequestHint,
  onShowSolution,
}: HintSystemProps) {
  const { hints } = step;

  // Don't show anything if no attempts yet
  if (attemptCount === 0 && hintLevel === 'none') {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Hint Level 1 */}
      {(hintLevel === 'level1' || hintLevel === 'level2' || hintLevel === 'solution') && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">💡</span>
            <div>
              <div className="text-xs font-medium text-amber-700 mb-1">Hint</div>
              <p className="text-sm text-amber-800">{hints.level1}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hint Level 2 */}
      {(hintLevel === 'level2' || hintLevel === 'solution') && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">📋</span>
            <div>
              <div className="text-xs font-medium text-orange-700 mb-1">Detailed Guidance</div>
              <div className="text-sm text-orange-800 whitespace-pre-line">{hints.level2}</div>
            </div>
          </div>
        </div>
      )}

      {/* Solution */}
      {hintLevel === 'solution' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">📌</span>
            <div>
              <div className="text-xs font-medium text-purple-700 mb-1">Solution</div>
              <div className="text-sm text-purple-800">
                {hints.solutionComponents.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium">Add these components:</span>
                    <ul className="list-disc ml-5 mt-1">
                      {hints.solutionComponents.map((comp, idx) => (
                        <li key={idx}>{formatComponentType(comp.type)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {hints.solutionConnections.length > 0 && (
                  <div>
                    <span className="font-medium">Make these connections:</span>
                    <ul className="list-disc ml-5 mt-1">
                      {hints.solutionConnections.map((conn, idx) => (
                        <li key={idx}>
                          {formatComponentType(conn.from)} → {formatComponentType(conn.to)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {hintLevel !== 'solution' && attemptCount > 0 && (
        <div className="flex gap-2 pt-2">
          {hintLevel === 'none' && (
            <button
              onClick={onRequestHint}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              <span>💡</span> Need a hint?
            </button>
          )}
          {hintLevel === 'level1' && (
            <button
              onClick={onRequestHint}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              <span>📋</span> More help
            </button>
          )}
          {attemptCount >= 2 && (
            <button
              onClick={onShowSolution}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <span>📌</span> Show solution
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Format component type for display
 */
function formatComponentType(type: string): string {
  const displayNames: Record<string, string> = {
    'compute': 'App Server',
    'app_server': 'App Server',
    'storage': 'Database',
    'postgresql': 'PostgreSQL',
    'cache': 'Cache (Redis)',
    'redis': 'Redis',
    'object_storage': 'Object Storage (S3)',
    's3': 'S3',
    'cdn': 'CDN',
    'load_balancer': 'Load Balancer',
    'message_queue': 'Message Queue',
    'client': 'Client',
  };
  return displayNames[type] || type;
}

/**
 * Compact hint indicator for showing in headers
 */
export function HintIndicator({ hintLevel }: { hintLevel: HintLevel }) {
  if (hintLevel === 'none') return null;

  const indicators = {
    level1: { icon: '💡', label: 'Hint available', color: 'text-amber-500' },
    level2: { icon: '📋', label: 'Detailed guidance', color: 'text-orange-500' },
    solution: { icon: '📌', label: 'Solution shown', color: 'text-purple-500' },
  };

  const indicator = indicators[hintLevel];

  return (
    <span className={`text-xs ${indicator.color}`} title={indicator.label}>
      {indicator.icon}
    </span>
  );
}
