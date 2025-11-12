import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Node } from 'reactflow';
import { getTradeoffsForComponent, ComponentTradeoff } from '../../data/componentTradeoffs';

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
  tradeoffIds: string[]; // Changed from freetext to IDs
}

// Validation helper functions
const validateText = (text: string, minWords: number = 15): { valid: boolean; error?: string } => {
  const trimmed = text.trim();

  if (!trimmed) {
    return { valid: false, error: 'This field is required' };
  }

  const words = trimmed.split(/\s+/).filter(w => w.length > 0);

  if (words.length < minWords) {
    return { valid: false, error: `Need at least ${minWords} words (currently ${words.length})` };
  }

  // Check for repetitive text (same word repeated)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (uniqueWords.size < words.length * 0.6) {
    return { valid: false, error: 'Please avoid repetitive text' };
  }

  // Check for keyboard spam (aaaa, asdfasdf, etc.)
  const hasSpam = words.some(word => {
    if (word.length < 4) return false;
    const chars = word.split('');
    const uniqueChars = new Set(chars);
    return uniqueChars.size <= 2; // e.g., "aaaa" or "abab"
  });

  if (hasSpam) {
    return { valid: false, error: 'Please write meaningful text' };
  }

  return { valid: true };
};

export function ComponentJustificationModal({
  node,
  onSave,
  onClose,
  initialJustification = '',
}: ComponentJustificationModalProps) {
  // Parse initial justification if it exists
  const parseInitialJustification = (initial: string): JustificationData => {
    if (!initial) {
      return { why: '', benefits: '', alternatives: '', tradeoffIds: [] };
    }

    try {
      const parsed = JSON.parse(initial);
      if (parsed.why !== undefined) {
        return {
          why: parsed.why || '',
          benefits: parsed.benefits || '',
          alternatives: parsed.alternatives || '',
          tradeoffIds: parsed.tradeoffIds || parsed.tradeoffs || [], // Handle both formats
        };
      }
    } catch {
      // Legacy format - single string
      return { why: initial, benefits: '', alternatives: '', tradeoffIds: [] };
    }

    return { why: '', benefits: '', alternatives: '', tradeoffIds: [] };
  };

  const [justification, setJustification] = useState<JustificationData>(
    parseInitialJustification(initialJustification)
  );

  const componentType = node.data.componentType;
  const availableTradeoffs = getTradeoffsForComponent(componentType);

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

  const updateField = (field: keyof JustificationData, value: any) => {
    setJustification(prev => ({ ...prev, [field]: value }));
  };

  const toggleTradeoff = (tradeoffId: string) => {
    setJustification(prev => {
      const currentIds = prev.tradeoffIds;
      if (currentIds.includes(tradeoffId)) {
        return { ...prev, tradeoffIds: currentIds.filter(id => id !== tradeoffId) };
      } else {
        return { ...prev, tradeoffIds: [...currentIds, tradeoffId] };
      }
    });
  };

  const isFormValid = () => {
    const whyValid = validateText(justification.why, 15).valid;
    const benefitsValid = validateText(justification.benefits, 15).valid;
    const alternativesValid = validateText(justification.alternatives, 15).valid;
    const tradeoffsValid = justification.tradeoffIds.length >= 2; // At least 2 trade-offs

    return whyValid && benefitsValid && alternativesValid && tradeoffsValid;
  };

  // Group trade-offs by category
  const groupedTradeoffs = availableTradeoffs.reduce((acc, tradeoff) => {
    if (!acc[tradeoff.category]) {
      acc[tradeoff.category] = [];
    }
    acc[tradeoff.category].push(tradeoff);
    return acc;
  }, {} as Record<string, ComponentTradeoff[]>);

  const categoryLabels: Record<string, string> = {
    cost: '💰 Cost',
    complexity: '🔧 Complexity',
    performance: '⚡ Performance',
    reliability: '🛡️ Reliability',
    scalability: '📈 Scalability',
    maintenance: '🔨 Maintenance',
  };

  const whyValidation = validateText(justification.why, 15);
  const benefitsValidation = validateText(justification.benefits, 15);
  const alternativesValidation = validateText(justification.alternatives, 15);

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
          className="bg-white rounded-lg shadow-2xl w-[800px] max-h-[90vh] overflow-hidden flex flex-col"
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
                <strong>📝 Note:</strong> All fields are required. Provide meaningful explanations (min 15 words each).
                For trade-offs, select at least 2 that apply to your use case.
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
                placeholder="E.g., 'I chose Redis cache because the tiny URL system needs to handle millions of read requests per second. The short URLs are read much more frequently than they are created, making caching essential for performance and reducing database load...'"
                className={`w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
                  justification.why && !whyValidation.valid ? 'border-red-300' : 'border-gray-300'
                }`}
                autoFocus
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${whyValidation.valid ? 'text-green-600' : 'text-gray-400'}`}>
                  {whyValidation.valid ? '✓ Valid' : whyValidation.error || `${justification.why.split(/\s+/).filter(w => w).length}/15 words`}
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
                placeholder="E.g., 'Benefits include: Sub-millisecond response times for cached URLs, reduces database load by 90%, handles traffic spikes gracefully with memory-based storage, simple key-value structure perfect for URL mapping, supports TTL for automatic cleanup...'"
                className={`w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
                  justification.benefits && !benefitsValidation.valid ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${benefitsValidation.valid ? 'text-green-600' : 'text-gray-400'}`}>
                  {benefitsValidation.valid ? '✓ Valid' : benefitsValidation.error || `${justification.benefits.split(/\s+/).filter(w => w).length}/15 words`}
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
                placeholder="E.g., 'I considered CDN edge caching, but that only helps with geographic distribution not application-level caching. I also looked at Memcached, but Redis offers better data structure support and persistence options for our use case...'"
                className={`w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
                  justification.alternatives && !alternativesValidation.valid ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${alternativesValidation.valid ? 'text-green-600' : 'text-gray-400'}`}>
                  {alternativesValidation.valid ? '✓ Valid' : alternativesValidation.error || `${justification.alternatives.split(/\s+/).filter(w => w).length}/15 words`}
                </span>
              </div>
            </div>

            {/* Trade-offs Section - Checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                4. What are the trade-offs? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select at least 2 trade-offs that apply to your use case. Be honest about the downsides.
              </p>

              {availableTradeoffs.length === 0 ? (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-600">
                  No predefined trade-offs for this component type.
                </div>
              ) : (
                <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {Object.entries(groupedTradeoffs).map(([category, tradeoffs]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        {categoryLabels[category] || category}
                      </div>
                      <div className="space-y-2 ml-2">
                        {tradeoffs.map(tradeoff => (
                          <label
                            key={tradeoff.id}
                            className="flex items-start gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={justification.tradeoffIds.includes(tradeoff.id)}
                              onChange={() => toggleTradeoff(tradeoff.id)}
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{tradeoff.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${justification.tradeoffIds.length >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.tradeoffIds.length >= 2
                    ? `✓ ${justification.tradeoffIds.length} selected`
                    : `${justification.tradeoffIds.length}/2 minimum`}
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
              title={!isFormValid() ? 'Please complete all fields' : 'Save justification'}
            >
              {isFormValid() ? '✓ Save Justification' : 'Complete All Fields'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
