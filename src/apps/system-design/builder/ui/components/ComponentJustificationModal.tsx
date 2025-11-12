import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node } from 'reactflow';

interface ComponentJustificationModalProps {
  node: Node;
  onSave: (nodeId: string, justification: string) => void;
  onClose: () => void;
  initialJustification?: string;
}

export function ComponentJustificationModal({
  node,
  onSave,
  onClose,
  initialJustification = '',
}: ComponentJustificationModalProps) {
  const [justification, setJustification] = useState(initialJustification);

  const handleSave = () => {
    onSave(node.id, justification);
    onClose();
  };

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
                  Why did you add this component?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {node.data.displayName || 'Component'}
                </p>
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
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Justification <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Explain why this component is necessary for your system design. Consider scalability, performance, reliability, and how it addresses the requirements.
            </p>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="E.g., 'Using Redis cache to reduce database load and improve response times for frequently accessed short URLs...'"
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">
              💡 Tip: You can edit this justification later by clicking the component again
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!justification.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded transition-colors"
            >
              Save Justification
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
