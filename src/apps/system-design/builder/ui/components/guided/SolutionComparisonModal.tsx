import { motion, AnimatePresence } from 'framer-motion';
import { SystemGraph, Connection } from '../../../types/graph';
import { ComponentNode } from '../../../types/component';

interface ComponentSummary {
  type: string;
  displayName: string;
  icon: string;
  count: number;
}

interface ConnectionSummary {
  from: string;
  to: string;
}

interface SolutionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGraph: SystemGraph | null;
  optimalSolution: {
    components: Array<{ type: string; config?: Record<string, unknown> }>;
    connections: Array<{ from: string; to: string }>;
  };
  problemTitle?: string;
}

const COMPONENT_DISPLAY = {
  client: { name: 'Client', icon: '👤' },
  load_balancer: { name: 'Load Balancer', icon: '⚖️' },
  app_server: { name: 'App Server', icon: '🖥️' },
  database: { name: 'Database', icon: '🗄️' },
  cache: { name: 'Cache', icon: '⚡' },
  cdn: { name: 'CDN', icon: '🌐' },
  message_queue: { name: 'Message Queue', icon: '📬' },
  blob_storage: { name: 'Blob Storage', icon: '📦' },
  dns: { name: 'DNS', icon: '🔤' },
} as const;

function getComponentDisplay(type: string): { name: string; icon: string } {
  return COMPONENT_DISPLAY[type as keyof typeof COMPONENT_DISPLAY] || { name: type, icon: '📦' };
}

function summarizeComponents(graph: SystemGraph | null): ComponentSummary[] {
  if (!graph) return [];
  
  const counts: Record<string, number> = {};
  graph.components.forEach((comp: ComponentNode) => {
    counts[comp.type] = (counts[comp.type] || 0) + 1;
  });
  
  return Object.entries(counts).map(([type, count]) => {
    const display = getComponentDisplay(type);
    return {
      type,
      displayName: display.name,
      icon: display.icon,
      count,
    };
  });
}

function summarizeConnections(graph: SystemGraph | null): ConnectionSummary[] {
  if (!graph) return [];
  
  return graph.connections.map((conn: Connection) => ({
    from: conn.from.split('-')[0],
    to: conn.to.split('-')[0],
  }));
}

function compareComponents(
  userComponents: ComponentSummary[],
  optimalComponents: Array<{ type: string }>
): { matching: string[]; missing: string[]; extra: string[] } {
  const userTypes = new Set(userComponents.map(c => c.type));
  const optimalTypes = new Set(optimalComponents.map(c => c.type));
  
  const matching = [...userTypes].filter(t => optimalTypes.has(t));
  const missing = [...optimalTypes].filter(t => !userTypes.has(t));
  const extra = [...userTypes].filter(t => !optimalTypes.has(t));
  
  return { matching, missing, extra };
}

function compareConnections(
  userConnections: ConnectionSummary[],
  optimalConnections: Array<{ from: string; to: string }>
): { matching: number; missing: Array<{ from: string; to: string }>; extra: number } {
  const userSet = new Set(userConnections.map(c => `${c.from}->${c.to}`));
  const optimalSet = new Set(optimalConnections.map(c => `${c.from}->${c.to}`));
  
  const matching = [...userSet].filter(c => optimalSet.has(c)).length;
  const missing = optimalConnections.filter(c => !userSet.has(`${c.from}->${c.to}`));
  const extra = [...userSet].filter(c => !optimalSet.has(c)).length;
  
  return { matching, missing, extra };
}

export function SolutionComparisonModal({
  isOpen,
  onClose,
  userGraph,
  optimalSolution,
  problemTitle = 'TinyURL',
}: SolutionComparisonModalProps) {
  const userComponents = summarizeComponents(userGraph);
  const userConnections = summarizeConnections(userGraph);
  
  const componentComparison = compareComponents(userComponents, optimalSolution.components);
  const connectionComparison = compareConnections(userConnections, optimalSolution.connections);
  
  const totalOptimalComponents = optimalSolution.components.length;
  const matchingComponentsCount = componentComparison.matching.length;
  const score = Math.round((matchingComponentsCount / totalOptimalComponents) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Solution Comparison</h2>
                  <p className="text-blue-200 mt-1">{problemTitle} - Your Design vs Reference</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-3">
                  <div className="text-4xl font-bold text-blue-600">{score}%</div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">Architecture Match</div>
                    <div className="text-xs text-gray-500">
                      {matchingComponentsCount} of {totalOptimalComponents} key components
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-5">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <span>👤</span> Your Solution
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">
                        Components ({userComponents.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userComponents.length === 0 ? (
                          <span className="text-sm text-blue-600 italic">No components added</span>
                        ) : (
                          userComponents.map((comp, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                                componentComparison.matching.includes(comp.type)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              <span>{comp.icon}</span>
                              <span>{comp.displayName}</span>
                              {comp.count > 1 && (
                                <span className="bg-white/50 px-1.5 rounded text-xs">×{comp.count}</span>
                              )}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">
                        Connections ({userConnections.length})
                      </div>
                      {userConnections.length === 0 ? (
                        <span className="text-sm text-blue-600 italic">No connections made</span>
                      ) : (
                        <div className="space-y-1">
                          {userConnections.slice(0, 5).map((conn, i) => {
                            const fromDisplay = getComponentDisplay(conn.from);
                            const toDisplay = getComponentDisplay(conn.to);
                            return (
                              <div key={i} className="text-sm text-blue-800 flex items-center gap-2">
                                <span>{fromDisplay.icon}</span>
                                <span className="text-blue-400">→</span>
                                <span>{toDisplay.icon}</span>
                                <span className="text-blue-600">{fromDisplay.name} → {toDisplay.name}</span>
                              </div>
                            );
                          })}
                          {userConnections.length > 5 && (
                            <div className="text-xs text-blue-500">
                              +{userConnections.length - 5} more connections
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-5">
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <span>✨</span> Reference Solution
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-2">
                        Components ({optimalSolution.components.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {optimalSolution.components.map((comp, i) => {
                          const display = getComponentDisplay(comp.type);
                          const isInUser = componentComparison.matching.includes(comp.type);
                          return (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                                isInUser
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              <span>{display.icon}</span>
                              <span>{display.name}</span>
                              {!isInUser && <span className="text-xs">(missing)</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-2">
                        Connections ({optimalSolution.connections.length})
                      </div>
                      <div className="space-y-1">
                        {optimalSolution.connections.map((conn, i) => {
                          const fromDisplay = getComponentDisplay(conn.from);
                          const toDisplay = getComponentDisplay(conn.to);
                          return (
                            <div key={i} className="text-sm text-emerald-800 flex items-center gap-2">
                              <span>{fromDisplay.icon}</span>
                              <span className="text-emerald-400">→</span>
                              <span>{toDisplay.icon}</span>
                              <span className="text-emerald-600">{fromDisplay.name} → {toDisplay.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(componentComparison.missing.length > 0 || connectionComparison.missing.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5"
                >
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <span>💡</span> Suggestions to Improve
                  </h4>
                  <ul className="space-y-2">
                    {componentComparison.missing.map((type, i) => {
                      const display = getComponentDisplay(type);
                      return (
                        <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>Add a <strong>{display.name}</strong> {display.icon} to your design</span>
                        </li>
                      );
                    })}
                    {connectionComparison.missing.map((conn, i) => {
                      const fromDisplay = getComponentDisplay(conn.from);
                      const toDisplay = getComponentDisplay(conn.to);
                      return (
                        <li key={`conn-${i}`} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>Connect <strong>{fromDisplay.name}</strong> → <strong>{toDisplay.name}</strong></span>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}

              {score === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-center text-white"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold mb-1">Perfect Match!</h4>
                  <p className="text-green-100">
                    Your architecture matches the reference solution perfectly. Great job!
                  </p>
                </motion.div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
