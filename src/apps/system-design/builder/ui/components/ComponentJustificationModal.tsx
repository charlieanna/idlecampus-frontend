import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node } from 'reactflow';

interface ComponentJustificationModalProps {
  node: Node;
  onSave: (nodeId: string, justification: string) => void;
  onClose: () => void;
  initialJustification?: string;
}

interface JustificationData {
  why: string;
  benefits: string;
  alternatives: string;
  tradeoffs: string;
}

export function ComponentJustificationModal({
  node,
  onSave,
  onClose,
  initialJustification = '',
}: ComponentJustificationModalProps) {
  // Parse initial justification if it exists (could be JSON or legacy string)
  const parseInitialJustification = (initial: string): JustificationData => {
    if (!initial) {
      return { why: '', benefits: '', alternatives: '', tradeoffs: '' };
    }

    try {
      const parsed = JSON.parse(initial);
      if (parsed.why !== undefined) {
        return parsed;
      }
    } catch {
      // Legacy format - single string, put it in 'why' field
      return { why: initial, benefits: '', alternatives: '', tradeoffs: '' };
    }

    return { why: '', benefits: '', alternatives: '', tradeoffs: '' };
  };

  const [justification, setJustification] = useState<JustificationData>(
    parseInitialJustification(initialJustification)
  );

  const handleSave = () => {
    // Save as JSON string
    const jsonString = JSON.stringify(justification);
    onSave(node.id, jsonString);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const updateField = (field: keyof JustificationData, value: string) => {
    setJustification(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      justification.why.trim().length >= 20 &&
      justification.benefits.trim().length >= 20 &&
      justification.alternatives.trim().length >= 20 &&
      justification.tradeoffs.trim().length >= 20
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-lg shadow-2xl w-[700px] max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{node.data.label || '⚙️'}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Design Decision Justification
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {node.data.displayName || 'Component'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              title="Close (ESC)"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>📝 Note:</strong> All fields are required (minimum 20 characters each).
                Think critically about your design choice and provide meaningful explanations.
              </p>
            </div>

            {/* Why Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                1. Why did you choose this component? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Explain the specific problem this component solves in your design.
              </p>
              <textarea
                value={justification.why}
                onChange={(e) => updateField('why', e.target.value)}
                placeholder="E.g., 'I chose Redis cache because the tiny URL system needs to handle millions of read requests per second. The short URLs are read much more frequently than they are created, making caching essential for performance...'"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                autoFocus
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${justification.why.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.why.length >= 20 ? '✓' : `${justification.why.length}/20`} characters
                </span>
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                2. What are the key benefits? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                List the advantages this component brings (performance, scalability, reliability, etc.).
              </p>
              <textarea
                value={justification.benefits}
                onChange={(e) => updateField('benefits', e.target.value)}
                placeholder="E.g., 'Benefits: (1) Reduces database load by 90%, (2) Sub-millisecond response times, (3) Handles traffic spikes gracefully, (4) Simple key-value structure perfect for URL mapping...'"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${justification.benefits.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.benefits.length >= 20 ? '✓' : `${justification.benefits.length}/20`} characters
                </span>
              </div>
            </div>

            {/* Alternatives Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                3. What alternatives did you consider? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Mention other options you thought about and why you didn't choose them.
              </p>
              <textarea
                value={justification.alternatives}
                onChange={(e) => updateField('alternatives', e.target.value)}
                placeholder="E.g., 'I considered CDN edge caching, but that only helps with geographic distribution. I also looked at Memcached, but Redis offers better data structure support and persistence options for our use case...'"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${justification.alternatives.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.alternatives.length >= 20 ? '✓' : `${justification.alternatives.length}/20`} characters
                </span>
              </div>
            </div>

            {/* Trade-offs Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                4. What are the trade-offs? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Be honest about the downsides, costs, complexity, or limitations this component introduces.
              </p>
              <textarea
                value={justification.tradeoffs}
                onChange={(e) => updateField('tradeoffs', e.target.value)}
                placeholder="E.g., 'Trade-offs: (1) Additional cost for Redis cluster (~$200/month), (2) Cache invalidation complexity when URLs are updated, (3) Need to handle cache misses gracefully, (4) Increased system complexity with another component to monitor...'"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${justification.tradeoffs.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.tradeoffs.length >= 20 ? '✓' : `${justification.tradeoffs.length}/20`} characters
                </span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                💡 <strong>Tip:</strong> You can edit this justification later by clicking the component again.
                These justifications help you think critically about your design decisions.
              </p>
            </div>
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
              disabled={!isFormValid()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded transition-colors shadow-sm"
              title={!isFormValid() ? 'Please complete all fields (min 20 characters each)' : 'Save justification'}
            >
              {isFormValid() ? '✓ Save Justification' : 'Complete All Fields'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
