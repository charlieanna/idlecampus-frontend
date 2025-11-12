import { motion, AnimatePresence } from 'framer-motion';
import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';
import { EnhancedInspector } from './EnhancedInspector';

interface InspectorModalProps {
  node: Node;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

export function InspectorModal({
  node,
  systemGraph,
  onUpdateConfig,
  onClose,
  onDelete,
}: InspectorModalProps) {
  // Close on ESC key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-lg shadow-2xl w-[600px] max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{node.data.label || '⚙️'}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {node.data.displayName || 'Configure Component'}
                </h2>
                {node.data.subtitle && (
                  <p className="text-sm text-gray-500">{node.data.subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              title="Close (ESC)"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(80vh-160px)]">
            <EnhancedInspector
              node={node}
              systemGraph={systemGraph}
              onUpdateConfig={onUpdateConfig}
              isModal={true}
            />
          </div>

          {/* Footer with Delete button */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            {node.data.componentType !== 'client' ? (
              <button
                onClick={() => onDelete(node.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded transition-colors"
                title="Delete Node (Delete key)"
              >
                🗑️ Delete Node
              </button>
            ) : (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                🔒 Client component is locked
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
