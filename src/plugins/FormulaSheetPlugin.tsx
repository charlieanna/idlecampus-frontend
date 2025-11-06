/**
 * Formula Sheet Plugin
 *
 * Mathematical/chemical formula reference for academic courses:
 * - IIT-JEE Mathematics
 * - IIT-JEE Chemistry
 * - Physics courses
 * - GRE Math prep
 *
 * Features:
 * - LaTeX formula rendering
 * - Category-based organization
 * - Downloadable PDF
 *
 * Corresponds to backend: formula_sheet_plugin.rb
 */

import { useState } from 'react';
import { FileText, Download, X, ChevronDown } from 'lucide-react';

export interface FormulaSheetPluginProps {
  courseSlug: string;
  enabled?: boolean;
  subject?: 'mathematics' | 'chemistry' | 'physics';
  downloadable?: boolean;
}

interface Formula {
  name: string;
  formula: string;
  description: string;
  category: string;
}

// Sample formulas (would be fetched from API in production)
const SAMPLE_FORMULAS: Record<string, Formula[]> = {
  mathematics: [
    {
      name: 'Quadratic Formula',
      formula: 'x = (-b ± √(b² - 4ac)) / 2a',
      description: 'Solution for ax² + bx + c = 0',
      category: 'Algebra'
    },
    {
      name: 'Pythagorean Theorem',
      formula: 'a² + b² = c²',
      description: 'Relationship in right triangles',
      category: 'Geometry'
    },
    {
      name: 'Derivative Power Rule',
      formula: 'd/dx(xⁿ) = nxⁿ⁻¹',
      description: 'Differentiation of power functions',
      category: 'Calculus'
    },
    {
      name: 'Integration by Parts',
      formula: '∫u dv = uv - ∫v du',
      description: 'Integration technique for products',
      category: 'Calculus'
    }
  ],
  chemistry: [
    {
      name: 'Ideal Gas Law',
      formula: 'PV = nRT',
      description: 'Relationship between pressure, volume, and temperature',
      category: 'Physical Chemistry'
    },
    {
      name: 'pH Formula',
      formula: 'pH = -log₁₀[H⁺]',
      description: 'Measure of acidity',
      category: 'Acids & Bases'
    },
    {
      name: 'Nernst Equation',
      formula: 'E = E° - (RT/nF)ln(Q)',
      description: 'Electrode potential under non-standard conditions',
      category: 'Electrochemistry'
    }
  ],
  physics: [
    {
      name: 'Newton\'s Second Law',
      formula: 'F = ma',
      description: 'Force equals mass times acceleration',
      category: 'Mechanics'
    },
    {
      name: 'Kinetic Energy',
      formula: 'KE = ½mv²',
      description: 'Energy of motion',
      category: 'Mechanics'
    }
  ]
};

export default function FormulaSheetPlugin({
  courseSlug,
  enabled = true,
  subject = 'mathematics',
  downloadable = true
}: FormulaSheetPluginProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!enabled) {
    return null;
  }

  const formulas = SAMPLE_FORMULAS[subject] || [];

  // Group formulas by category
  const categories = formulas.reduce((acc, formula) => {
    if (!acc[formula.category]) {
      acc[formula.category] = [];
    }
    acc[formula.category].push(formula);
    return acc;
  }, {} as Record<string, Formula[]>);

  const handleDownload = () => {
    // In production, this would fetch PDF from backend
    alert('Formula sheet download would happen here');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-32 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Formula Sheet"
      >
        <FileText className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Formula Sheet
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 capitalize">
                {subject}
              </span>
              {downloadable && (
                <button
                  onClick={handleDownload}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {/* Formula List */}
          <div className="flex-1 overflow-y-auto p-4">
            {Object.entries(categories).length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <p>No formulas available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(categories).map(([category, categoryFormulas]) => (
                  <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(
                        expandedCategory === category ? null : category
                      )}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-900 text-sm">
                        {category}
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-slate-500 mr-2">
                          {categoryFormulas.length} formulas
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            expandedCategory === category ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Category Formulas */}
                    {expandedCategory === category && (
                      <div className="p-4 space-y-3 bg-white">
                        {categoryFormulas.map((formula, index) => (
                          <div
                            key={index}
                            className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <h3 className="font-semibold text-sm text-slate-900 mb-2">
                              {formula.name}
                            </h3>
                            <div className="bg-white p-3 rounded border border-purple-300 mb-2">
                              <code className="text-purple-900 font-mono text-sm">
                                {formula.formula}
                              </code>
                            </div>
                            <p className="text-xs text-slate-600">
                              {formula.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              Quick reference for {formulas.length} essential formulas
            </p>
          </div>
        </div>
      )}
    </>
  );
}
