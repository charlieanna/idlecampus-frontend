/**
 * Lab Renderer - Factory Component
 *
 * Auto-detects lab type and renders the appropriate component:
 * - Terminal labs → Terminal component
 * - Code editor labs → CodeEditor component
 * - SQL labs → SQLEditor component (to be created)
 * - Hybrid labs → Multiple components as needed
 *
 * Features:
 * - Automatic type detection from lab metadata
 * - Unified execution interface
 * - Consistent validation across all lab types
 * - Support for step-by-step labs
 *
 * Usage:
 *   <LabRenderer
 *     lab={labData}
 *     courseSlug="docker-fundamentals"
 *     onComplete={() => console.log('Lab completed')}
 *   />
 */

import { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { CodeEditor } from './CodeEditor';

// ============================================
// TYPES
// ============================================

export type LabFormat = 'terminal' | 'code_editor' | 'sql_editor' | 'hybrid';

export interface LabData {
  id: number;
  title: string;
  description: string;
  lab_type: string;
  lab_format: LabFormat;
  difficulty?: string;
  estimated_minutes?: number;

  // Terminal labs
  steps?: LabStep[];

  // Code editor labs
  programming_language?: string;
  starter_code?: string;
  solution_code?: string;
  test_cases?: TestCase[];
  time_limit_seconds?: number;
  memory_limit_mb?: number;

  // SQL labs
  schema_setup?: string;
  sample_data?: string;
  expected_result?: any;

  // Hybrid labs
  current_step_type?: 'terminal' | 'code' | 'sql';
}

export interface LabStep {
  step_number: number;
  title: string;
  instruction: string;
  expected_command?: string;
  validation?: string;
  hint?: string;
  expected_output?: string;
}

export interface TestCase {
  name?: string;
  description?: string;
  input: any;
  expected_output: any;
  hidden?: boolean;
  points?: number;
}

export interface LabExecutionResult {
  success: boolean;
  output: string;
  error: string;
  validation: {
    valid: boolean;
    message: string;
    score?: number;
    test_results?: any[];
  };
}

export interface LabRendererProps {
  lab: LabData;
  courseSlug: string;
  onComplete?: () => void;
  onProgress?: (stepIndex: number, total: number) => void;
}

// ============================================
// SQL EDITOR COMPONENT (Placeholder)
// ============================================

interface SQLEditorProps {
  lab: LabData;
  courseSlug: string;
  onComplete?: () => void;
}

function SQLEditor({ lab, courseSlug, onComplete }: SQLEditorProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);

    try {
      const response = await fetch(`/api/v1/courses/${courseSlug}/labs/${lab.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query, step_index: 0 })
      });

      const data = await response.json();
      setResult(data);

      if (data.success && onComplete) {
        onComplete();
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{lab.title}</h3>
        <p className="text-sm text-slate-400">{lab.description}</p>
      </div>

      {/* Query Input */}
      <div className="flex-1 mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-slate-800 text-white p-4 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your SQL query here..."
          spellCheck={false}
        />
      </div>

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={executing || !query.trim()}
        className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-semibold transition-colors mb-4"
      >
        {executing ? 'Executing...' : 'Execute Query'}
      </button>

      {/* Results */}
      {result && (
        <div className={`p-4 rounded ${result.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
          <div className="font-semibold mb-2">
            {result.success ? '✓ Success' : '✗ Error'}
          </div>
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {result.output || result.error}
          </pre>
          {result.validation && (
            <div className="mt-2 text-sm text-slate-300">
              {result.validation.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// HYBRID LAB COMPONENT
// ============================================

interface HybridLabProps {
  lab: LabData;
  courseSlug: string;
  onComplete?: () => void;
  onProgress?: (stepIndex: number, total: number) => void;
}

function HybridLab({ lab, courseSlug, onComplete, onProgress }: HybridLabProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = lab.steps?.length || 1;

  const currentStep = lab.steps?.[currentStepIndex];
  const stepType = currentStep?.type || lab.current_step_type || 'terminal';

  const handleStepComplete = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onProgress?.(nextIndex, totalSteps);
    } else {
      onComplete?.();
    }
  };

  // Render appropriate component based on step type
  if (stepType === 'code' || stepType === 'code_editor') {
    return (
      <CodeEditor
        lab={{
          ...lab,
          description: currentStep?.instruction || lab.description
        }}
        courseSlug={courseSlug}
        onComplete={handleStepComplete}
      />
    );
  }

  if (stepType === 'sql' || stepType === 'sql_editor') {
    return (
      <SQLEditor
        lab={{
          ...lab,
          description: currentStep?.instruction || lab.description
        }}
        courseSlug={courseSlug}
        onComplete={handleStepComplete}
      />
    );
  }

  // Default to terminal
  return (
    <div className="h-full">
      <Terminal
        courseSlug={courseSlug}
        labId={lab.id}
        labTitle={lab.title}
        labDescription={currentStep?.instruction || lab.description}
        steps={[currentStep].filter(Boolean)}
        onLabComplete={handleStepComplete}
      />
    </div>
  );
}

// ============================================
// MAIN LAB RENDERER COMPONENT
// ============================================

export default function LabRenderer({
  lab,
  courseSlug,
  onComplete,
  onProgress
}: LabRendererProps) {
  // Detect lab format
  const labFormat: LabFormat = detectLabFormat(lab);

  // Render appropriate component based on format
  switch (labFormat) {
    case 'terminal':
      return (
        <div className="h-full">
          <Terminal
            courseSlug={courseSlug}
            labId={lab.id}
            labTitle={lab.title}
            labDescription={lab.description}
            steps={lab.steps || []}
            onLabComplete={onComplete}
          />
        </div>
      );

    case 'code_editor':
      return (
        <CodeEditor
          lab={lab}
          courseSlug={courseSlug}
          onComplete={onComplete}
        />
      );

    case 'sql_editor':
      return (
        <SQLEditor
          lab={lab}
          courseSlug={courseSlug}
          onComplete={onComplete}
        />
      );

    case 'hybrid':
      return (
        <HybridLab
          lab={lab}
          courseSlug={courseSlug}
          onComplete={onComplete}
          onProgress={onProgress}
        />
      );

    default:
      return (
        <div className="h-full flex items-center justify-center bg-slate-900 text-white p-8">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Unsupported Lab Format</h3>
            <p className="text-slate-400">Lab format "{labFormat}" is not supported.</p>
            <p className="text-sm text-slate-500 mt-4">
              Supported formats: terminal, code_editor, sql_editor, hybrid
            </p>
          </div>
        </div>
      );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Detect lab format from lab metadata
 */
function detectLabFormat(lab: LabData): LabFormat {
  // Check explicit lab_format first
  if (lab.lab_format) {
    return lab.lab_format;
  }

  // Infer from lab_type
  const labType = lab.lab_type?.toLowerCase() || '';

  if (
    labType.includes('terminal') ||
    labType.includes('docker') ||
    labType.includes('kubernetes') ||
    labType.includes('k8s') ||
    labType.includes('linux') ||
    labType.includes('bash')
  ) {
    return 'terminal';
  }

  if (
    labType.includes('code') ||
    labType.includes('python') ||
    labType.includes('javascript') ||
    labType.includes('golang') ||
    labType.includes('ruby') ||
    labType.includes('java') ||
    lab.programming_language
  ) {
    return 'code_editor';
  }

  if (
    labType.includes('sql') ||
    labType.includes('postgres') ||
    labType.includes('mysql') ||
    lab.schema_setup
  ) {
    return 'sql_editor';
  }

  if (labType.includes('hybrid') || labType.includes('mixed')) {
    return 'hybrid';
  }

  // Check for presence of specific fields
  if (lab.steps && lab.steps.length > 0) {
    return 'terminal';
  }

  if (lab.test_cases && lab.test_cases.length > 0) {
    return 'code_editor';
  }

  // Default to terminal
  return 'terminal';
}

/**
 * Execute lab command/code/query
 */
export async function executeLab(
  courseSlug: string,
  labId: number,
  input: string,
  stepIndex: number = 0
): Promise<LabExecutionResult> {
  try {
    const response = await fetch(
      `/api/v1/courses/${courseSlug}/labs/${labId}/execute`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input,
          step_index: stepIndex
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: result.success || false,
      output: result.output || '',
      error: result.error || '',
      validation: result.validation || { valid: false, message: 'No validation data' }
    };
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: error.message || 'Failed to execute lab',
      validation: { valid: false, message: error.message }
    };
  }
}
