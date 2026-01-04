// Stub component - TODO: Implement full TrieTaskEditor
import { useState } from 'react';
import { CodeEditorCore } from './CodeEditorCore';
import { Button } from '../ui/button';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';

interface TrieTaskEditorProps {
  starterCode: string;
  solution: string;
  expectedOutput: string;
  taskDescription: string;
}

export function TrieTaskEditor({
  starterCode,
  solution,
  expectedOutput,
  taskDescription
}: TrieTaskEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRun = () => {
    // Placeholder - would need Pyodide integration
    setOutput("Code execution coming soon...");
  };

  const handleReset = () => {
    setCode(starterCode);
    setOutput(null);
    setIsSuccess(false);
  };

  const handleShowSolution = () => {
    setCode(solution);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm text-slate-600 font-medium">{taskDescription}</div>

      <div className="border rounded-lg overflow-hidden">
        <CodeEditorCore
          code={code}
          onChange={setCode}
          language="python"
          height="200px"
          readOnly={false}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleRun} size="sm" className="gap-2">
          <Play className="w-4 h-4" />
          Run
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={handleShowSolution} variant="ghost" size="sm">
          Show Solution
        </Button>
      </div>

      {output && (
        <div className={`p-3 rounded-lg text-sm font-mono ${
          isSuccess ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'
        }`}>
          {isSuccess && <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-600" />}
          {output}
        </div>
      )}

      <div className="text-xs text-slate-500">
        Expected output: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{expectedOutput}</code>
      </div>
    </div>
  );
}

export default TrieTaskEditor;
