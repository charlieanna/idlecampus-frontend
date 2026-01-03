// Pyodide Python Runner for Browser
// Loads Pyodide (Python in WebAssembly) and executes Python code

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodideLoading: Promise<any> | null = null;

export async function loadPyodide() {
  // Return existing instance if available
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Wait for existing load if in progress
  if (pyodideLoading) {
    return pyodideLoading;
  }

  // Start new load
  pyodideLoading = (async () => {
    try {
      // Wait for loadPyodide to be available
      if (typeof window.loadPyodide === 'undefined') {
        // Wait a bit for the script to load
        await new Promise(resolve => setTimeout(resolve, 100));

        if (typeof window.loadPyodide === 'undefined') {
          throw new Error('Pyodide script not loaded. Make sure PyodideLoader component is mounted.');
        }
      }

      const pyodide = await window.loadPyodide!({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
      });

      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      pyodideLoading = null; // Reset so we can retry
      throw error;
    }
  })();

  return pyodideLoading;
}

// Clear user-defined globals to prevent pollution between exercises
async function clearUserGlobals(pyodide: any): Promise<void> {
  try {
    await pyodide.runPythonAsync(`
# Clear user-defined names from globals to prevent pollution between exercises
# Keep built-in modules and Pyodide internals
_KEEP_NAMES = {
    '__name__', '__doc__', '__package__', '__loader__', '__spec__',
    '__annotations__', '__builtins__', '__file__', '__cached__',
    # Standard library modules that might be imported
    'json', 'ast', 'base64', 'sys', 'traceback', 'inspect', 're',
    'collections', 'math', 'random', 'itertools', 'functools',
    'typing', 'heapq', 'bisect', 'copy', 'operator', 'string',
    # Pyodide internals
    '_pyodide_core', 'pyodide', 'micropip', 'js',
}

_to_delete = [name for name in list(globals().keys())
              if name not in _KEEP_NAMES
              and not name.startswith('_')]

for _name in _to_delete:
    try:
        del globals()[_name]
    except:
        pass

# Clean up our temporary variables
del _KEEP_NAMES, _to_delete
try:
    del _name
except NameError:
    pass  # _name was never defined if _to_delete was empty
`);
  } catch (e) {
    // Ignore errors during cleanup
    console.warn('Error clearing Pyodide globals:', e);
  }
}

export async function runPythonCode(code: string): Promise<{
  success: boolean;
  output: string;
  error?: string;
}> {
  try {
    const pyodide = await loadPyodide();
    let output = "";

    // Clear user-defined globals from previous executions
    await clearUserGlobals(pyodide);

    // Use Pyodide's setStdout for more reliable capture
    let capturedOutput = '';
    const originalStdout = pyodide.setStdout({
      batched: (text: string) => {
        capturedOutput += text + "\n";
      },
    });

    try {
      // Run the user code
      await pyodide.runPythonAsync(code);

      // Get captured output
      output = capturedOutput;
    } finally {
      // Restore original stdout
      if (originalStdout) {
        pyodide.setStdout(originalStdout);
      } else {
        pyodide.setStdout({ batched: () => { } });
      }
    }

    const trimmedOutput = String(output || '').trim();

    // Debug: log if output is empty
    if (trimmedOutput.length === 0) {
      console.warn('Pyodide execution produced no output. Code may have failed silently.');
      console.warn('Code that was executed:', code.substring(0, 200));
    }

    return {
      success: true,
      output: trimmedOutput,
    };
  } catch (error: any) {
    // Provide more helpful error messages
    let errorMessage = error.message || String(error);

    // Check for common errors and provide hints
    if (errorMessage.includes('undefined')) {
      errorMessage += '\n\nHint: Make sure all variables are defined before use.';
    } else if (errorMessage.includes('IndentationError')) {
      errorMessage += '\n\nHint: Check your indentation - Python requires consistent spacing.';
    } else if (errorMessage.includes('SyntaxError')) {
      errorMessage += '\n\nHint: Check your syntax - missing colons, parentheses, or quotes?';
    }

    return {
      success: false,
      output: "",
      error: errorMessage,
    };
  }
}

export async function validatePythonTask(
  code: string,
  expectedOutput: string
): Promise<{
  success: boolean;
  output: string;
  error?: string;
}> {
  const result = await runPythonCode(code);

  if (result.error) {
    return result;
  }

  // Compare actual output with expected output
  const actualOutput = result.output.trim();
  const expected = expectedOutput.trim();

  if (actualOutput === expected) {
    return {
      success: true,
      output: `✓ Correct! Great job!\n\nOutput:\n${actualOutput}`,
    };
  } else {
    return {
      success: false,
      output: `✗ Not quite right.\n\nYour output:\n${actualOutput}\n\nExpected:\n${expected}\n\nTry again!`,
    };
  }
}
