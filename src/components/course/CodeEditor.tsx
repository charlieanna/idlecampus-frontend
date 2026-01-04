import { useState, useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Play, Send, Lightbulb, CheckCircle, XCircle, Code, RotateCcw, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import type { CodeLab, TestCase, ValidationResult, ExecutionResult } from '../../types/codeLab';
import { LANGUAGE_MODES, DIFFICULTY_COLORS, LANGUAGE_COLORS } from '../../types/codeLab';
import { apiService } from '../../services/api';
import type * as monacoEditor from 'monaco-editor';

interface CodeEditorProps {
  lab: CodeLab;
  onComplete: () => void;
}

export function CodeEditor({ lab, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(lab.starter_code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'tests' | 'output'>('output');

  // Editor settings state
  const [showSettings, setShowSettings] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light' | 'hc-black'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [enableVimMode, setEnableVimMode] = useState(false);
  const [enableMinimap, setEnableMinimap] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  // Monaco editor instance
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    setActiveTab('output');

    try {
      const result: ExecutionResult = await apiService.executeCode(lab.id, code, customInput);

      if (result.success) {
        setOutput(
          `✓ Execution successful\n\n` +
          `Output:\n${result.output}\n\n` +
          `Execution time: ${result.execution_time}s${result.memory_used ? `\nMemory used: ${result.memory_used}MB` : ''}`
        );
      } else {
        setOutput(
          `✗ Execution failed\n\n` +
          `Error:\n${result.error}`
        );
      }
    } catch (error: any) {
      setOutput(`✗ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidateCode = async () => {
    setIsValidating(true);
    setActiveTab('tests');
    setAttemptCount(prev => prev + 1);

    try {
      const result = await apiService.validateCode(lab.id, code);
      setValidationResult(result.validation);
    } catch (error: any) {
      console.error('Validation error:', error);
      setOutput(`✗ Validation Error: ${error.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsValidating(true);
    setActiveTab('tests');

    try {
      const result = await apiService.submitCode(lab.id, code);

      if (result.success) {
        setValidationResult(result.validation);
        alert(`Congratulations! You earned ${lab.points_reward} points!`);
        onComplete();
      } else {
        setValidationResult(result.validation);
        alert('Some tests failed. Please review and try again.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleGetHint = async () => {
    try {
      const result = await apiService.getCodeLabHint(lab.id);
      setHint(result.hint);
      setShowHint(true);
    } catch (error: any) {
      console.error('Hint error:', error);
    }
  };

  const handleReset = () => {
    setCode(lab.starter_code);
    setOutput('');
    setValidationResult(null);
    setShowHint(false);
    setAttemptCount(0);
  };

  // Monaco editor mount handler
  const handleEditorMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor features
    editor.updateOptions({
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      parameterHints: {
        enabled: true,
      },
      snippetSuggestions: 'top',
      bracketPairColorization: {
        enabled: true,
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleValidateCode();
    });

    // Format code command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });
  };

  // Format code helper
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Save editor settings to localStorage
  useEffect(() => {
    const settings = {
      theme: editorTheme,
      fontSize,
      tabSize,
      enableVimMode,
      enableMinimap,
      wordWrap,
    };
    localStorage.setItem('codeEditorSettings', JSON.stringify(settings));
  }, [editorTheme, fontSize, tabSize, enableVimMode, enableMinimap, wordWrap]);

  // Load editor settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('codeEditorSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.theme) setEditorTheme(settings.theme);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.tabSize) setTabSize(settings.tabSize);
        if (settings.enableVimMode !== undefined) setEnableVimMode(settings.enableVimMode);
        if (settings.enableMinimap !== undefined) setEnableMinimap(settings.enableMinimap);
        if (settings.wordWrap) setWordWrap(settings.wordWrap);
      } catch (e) {
        console.error('Failed to load editor settings:', e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{lab.title}</h2>
          <div className="flex gap-2">
            <Badge className={DIFFICULTY_COLORS[lab.difficulty]}>
              {lab.difficulty}
            </Badge>
            <Badge className={LANGUAGE_COLORS[lab.programming_language]}>
              {lab.programming_language}
            </Badge>
            <Badge className="bg-green-600">
              {lab.points_reward} pts
            </Badge>
          </div>
        </div>
        <p className="text-gray-400 text-sm">{lab.description}</p>
      </div>

      {/* Objectives */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold mb-2 text-sm">Objectives:</h3>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
          {lab.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm">Code Editor</span>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                size="sm"
                variant="outline"
                className="border-gray-600 h-7 px-2"
                title="Editor Settings"
              >
                <Settings size={14} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                title="Run Code (Cmd/Ctrl+Enter)"
              >
                <Play size={14} className="mr-1" />
                Run
              </Button>
              <Button
                onClick={handleGetHint}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Lightbulb size={14} className="mr-1" />
                Hint
              </Button>
              <Button
                onClick={handleReset}
                size="sm"
                variant="outline"
                className="border-gray-600"
              >
                <RotateCcw size={14} className="mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-800 border-b border-gray-700 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Theme</label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value as any)}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="vs-light">Light</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tab Size</label>
                  <select
                    value={tabSize}
                    onChange={(e) => setTabSize(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Word Wrap</label>
                  <select
                    value={wordWrap}
                    onChange={(e) => setWordWrap(e.target.value as any)}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableMinimap}
                    onChange={(e) => setEnableMinimap(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Minimap</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableVimMode}
                    onChange={(e) => setEnableVimMode(e.target.checked)}
                    className="rounded"
                  />
                  <span>Vim Mode (experimental)</span>
                </label>
              </div>
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
                <div className="space-y-0.5">
                  <div>• Cmd/Ctrl + Enter: Run code</div>
                  <div>• Cmd/Ctrl + Shift + Enter: Run tests</div>
                  <div>• Cmd/Ctrl + Shift + F: Format code</div>
                </div>
              </div>
            </div>
          )}

          <Editor
            height="100%"
            language={LANGUAGE_MODES[lab.programming_language]}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorMount}
            theme={editorTheme}
            options={{
              minimap: { enabled: enableMinimap },
              fontSize: fontSize,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: tabSize,
              wordWrap: wordWrap,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              renderWhitespace: 'selection',
              renderLineHighlight: 'all',
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        </div>

        {/* Right: Test Cases / Output */}
        <div className="w-2/5 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tests'}
              aria-controls="tests-panel"
              id="tests-tab"
              onClick={() => setActiveTab('tests')}
              className={`flex-1 px-4 py-2 text-sm ${
                activeTab === 'tests' ? 'bg-gray-800 border-b-2 border-blue-500' : 'bg-gray-900'
              }`}
            >
              Test Cases
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'output'}
              aria-controls="output-panel"
              id="output-tab"
              onClick={() => setActiveTab('output')}
              className={`flex-1 px-4 py-2 text-sm ${
                activeTab === 'output' ? 'bg-gray-800 border-b-2 border-blue-500' : 'bg-gray-900'
              }`}
            >
              Output
            </button>
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1 p-4">
            {activeTab === 'tests' && (
              <div
                className="space-y-4"
                role="tabpanel"
                id="tests-panel"
                aria-labelledby="tests-tab"
                tabIndex={0}
              >
                {validationResult ? (
                  <>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="text-sm">
                        <span className="text-green-400">
                          {validationResult.passed_tests}/{validationResult.total_tests}
                        </span>{' '}
                        tests passed ({validationResult.pass_percentage.toFixed(0)}%)
                      </div>
                    </div>

                    {validationResult.results.map((test, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded ${
                          test.passed
                            ? 'border-green-600 bg-green-900/20'
                            : 'border-red-600 bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {test.passed ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <XCircle size={16} className="text-red-400" />
                          )}
                          <span className="font-semibold text-sm">
                            Test {test.test_number || idx + 1}: {test.description}
                          </span>
                        </div>

                        {!test.hidden && (
                          <>
                            {test.input && (
                              <div className="text-xs mb-2">
                                <span className="text-gray-400">Input:</span>
                                <pre className="bg-gray-800 p-2 mt-1 rounded overflow-x-auto">{test.input}</pre>
                              </div>
                            )}

                            <div className="text-xs mb-2">
                              <span className="text-gray-400">Expected:</span>
                              <pre className="bg-gray-800 p-2 mt-1 rounded overflow-x-auto">{test.expected_output}</pre>
                            </div>

                            {test.actual_output && (
                              <div className="text-xs">
                                <span className="text-gray-400">Your output:</span>
                                <pre className="bg-gray-800 p-2 mt-1 rounded overflow-x-auto">{test.actual_output}</pre>
                              </div>
                            )}
                          </>
                        )}

                        {test.hidden && !test.passed && (
                          <div className="text-xs text-gray-400">
                            This is a hidden test case. Details are not shown.
                          </div>
                        )}

                        {test.error && (
                          <div className="text-xs mt-2 text-red-400">
                            Error: {test.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 mb-4">
                      Public test cases (more tests will run on submit):
                    </p>
                    {lab.test_cases.map((test, i) => (
                      <div key={i} className="p-3 bg-gray-800 rounded">
                        <div className="font-semibold text-sm mb-2">{test.description}</div>
                        {test.input && (
                          <div className="text-xs mb-2">
                            <span className="text-gray-400">Input:</span>
                            <pre className="bg-gray-900 p-2 mt-1 rounded overflow-x-auto">{test.input}</pre>
                          </div>
                        )}
                        <div className="text-xs">
                          <span className="text-gray-400">Expected Output:</span>
                          <pre className="bg-gray-900 p-2 mt-1 rounded overflow-x-auto">{test.expected_output}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'output' && (
              <div
                role="tabpanel"
                id="output-panel"
                aria-labelledby="output-tab"
                tabIndex={0}
              >
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-1">
                    Custom Input (optional):
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sm font-mono"
                    rows={3}
                    placeholder="Enter test input..."
                  />
                </div>
                <pre className="bg-gray-800 p-3 rounded text-xs font-mono whitespace-pre-wrap min-h-[200px]">
                  {output || 'Run your code to see output here...'}
                </pre>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Hint Panel */}
      {showHint && hint && (
        <div className="p-4 bg-yellow-900/20 border-t border-yellow-600">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="font-semibold text-sm">Hint:</span>
              </div>
              <p className="text-sm text-gray-300">{hint}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="text-gray-400 hover:text-white text-xl leading-none"
              aria-label="Close hint"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-800">
        <div className="text-sm text-gray-400">
          {validationResult && (
            <span className={validationResult.all_passed ? 'text-green-400' : 'text-yellow-400'}>
              {validationResult.passed_tests}/{validationResult.total_tests} tests passed
              {validationResult.all_passed && ' ✓'}
            </span>
          )}
          {attemptCount > 0 && !validationResult && (
            <span>Attempts: {attemptCount}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleValidateCode}
            disabled={isValidating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Code size={16} className="mr-2" />
            {isValidating ? 'Validating...' : 'Run Tests'}
          </Button>
          <Button
            onClick={handleSubmitCode}
            disabled={isValidating}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send size={16} className="mr-2" />
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
}
