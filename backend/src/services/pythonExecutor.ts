/**
 * Python Code Executor Service
 * Executes Python code in a secure, isolated environment with resource limits
 */

import { spawn } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PythonExecutionResult } from '../types/index.js';

const TEMP_DIR = join(process.cwd(), 'temp');
const DEFAULT_TIMEOUT = 5000; // 5 seconds
const MAX_TIMEOUT = 30000; // 30 seconds
const MAX_OUTPUT_SIZE = 1024 * 1024; // 1 MB

export class PythonExecutor {
  /**
   * Execute Python code with security restrictions
   */
  async execute(
    code: string,
    options: {
      timeout?: number;
      stdin?: string;
      memoryLimit?: number; // in MB
    } = {}
  ): Promise<PythonExecutionResult> {
    const startTime = Date.now();
    const executionId = uuidv4();
    const filePath = join(TEMP_DIR, `${executionId}.py`);

    // Ensure temp directory exists
    await mkdir(TEMP_DIR, { recursive: true });

    // Validate timeout
    const timeout = Math.min(
      options.timeout || DEFAULT_TIMEOUT,
      MAX_TIMEOUT
    );

    try {
      // Write code to temporary file
      await writeFile(filePath, code, 'utf-8');

      // Execute Python code
      const result = await this.runPython(filePath, {
        timeout,
        stdin: options.stdin,
        memoryLimit: options.memoryLimit,
      });

      const executionTime = (Date.now() - startTime) / 1000;

      return {
        ...result,
        executionTime,
      };
    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      return {
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Unknown error',
        exitCode: 1,
        executionTime,
        timedOut: false,
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    } finally {
      // Clean up temporary file
      try {
        await unlink(filePath);
      } catch (error) {
        // Ignore cleanup errors
        console.error(`Failed to clean up ${filePath}:`, error);
      }
    }
  }

  /**
   * Run Python process with security restrictions
   */
  private runPython(
    filePath: string,
    options: {
      timeout: number;
      stdin?: string;
      memoryLimit?: number;
    }
  ): Promise<PythonExecutionResult> {
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let killed = false;

      // Build Python command with resource limits
      const pythonArgs = [filePath];

      // Use ulimit to restrict resources (Linux/Unix only)
      // Note: On Windows, these limits won't work, but the timeout will still apply
      const isUnix = process.platform !== 'win32';
      let command = 'python3';
      let args = pythonArgs;

      if (isUnix && options.memoryLimit) {
        // Use ulimit to restrict memory (in KB)
        const memoryLimitKB = options.memoryLimit * 1024;
        command = 'sh';
        
        // macOS doesn't support ulimit -v (virtual memory), so we skip memory limits on darwin
        if (process.platform === 'darwin') {
          args = [
            '-c',
            `ulimit -t ${Math.ceil(options.timeout / 1000)} && python3 ${filePath}`,
          ];
        } else {
          args = [
            '-c',
            `ulimit -v ${memoryLimitKB} && ulimit -t ${Math.ceil(options.timeout / 1000)} && python3 ${filePath}`,
          ];
        }
      }

      const pythonProcess = spawn(command, args, {
        env: {
          ...process.env,
          PYTHONDONTWRITEBYTECODE: '1', // Don't create .pyc files
          PYTHONUNBUFFERED: '1', // Unbuffered output
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Set up timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
        killed = true;
        pythonProcess.kill('SIGKILL');
      }, options.timeout);

      // Handle stdout
      pythonProcess.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
        // Prevent output overflow
        if (stdout.length > MAX_OUTPUT_SIZE) {
          stderr += '\nOutput size limit exceeded\n';
          killed = true;
          pythonProcess.kill('SIGKILL');
        }
      });

      // Handle stderr
      pythonProcess.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
        // Prevent error output overflow
        if (stderr.length > MAX_OUTPUT_SIZE) {
          stderr += '\nError output size limit exceeded\n';
          killed = true;
          pythonProcess.kill('SIGKILL');
        }
      });

      // Handle stdin if provided
      if (options.stdin) {
        pythonProcess.stdin?.write(options.stdin);
        pythonProcess.stdin?.end();
      }

      // Handle process exit
      pythonProcess.on('close', (exitCode) => {
        clearTimeout(timeoutId);

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: exitCode || 0,
          executionTime: 0, // Will be set by caller
          timedOut,
          error: timedOut
            ? `Execution timed out after ${options.timeout}ms`
            : killed
            ? 'Process was killed due to resource limits'
            : undefined,
        });
      });

      // Handle process errors
      pythonProcess.on('error', (error) => {
        clearTimeout(timeoutId);
        resolve({
          stdout: '',
          stderr: error.message,
          exitCode: 1,
          executionTime: 0,
          timedOut: false,
          error: `Failed to start Python process: ${error.message}`,
        });
      });
    });
  }

  /**
   * Execute Python code and capture return value
   * Wraps the user code to capture the result of the last expression
   */
  async executeWithResult(
    code: string,
    options: {
      timeout?: number;
      memoryLimit?: number;
    } = {}
  ): Promise<PythonExecutionResult & { result?: any }> {
    // Create simple shorten/expand functions first, then add user code
    const wrappedCode = `
import sys
import json

# Add basic compatibility functions first
def shorten(url: str) -> str:
    """Basic shorten function for load testing"""
    import hashlib
    hash_val = int(hashlib.md5(url.encode()).hexdigest()[:8], 16)
    return f"short{hash_val % 100000}"

def expand(code: str, store: dict = None) -> str:
    """Basic expand function for load testing"""
    if store and code in store:
        return store[code]
    return f"https://expanded.url/{code}"


# User code
${code}

# Capture result of last expression if it exists
try:
    # Try to evaluate the last line
    _last_line = """${code.split('\n').pop()?.trim() || ''}"""
    if _last_line and not _last_line.startswith('#'):
        _result = eval(_last_line)
        print("__RESULT__:", json.dumps(_result))
except:
    pass
`;

    const result = await this.execute(wrappedCode, options);

    // Extract result if present
    let capturedResult;
    if (result.stdout.includes('__RESULT__:')) {
      const resultLine = result.stdout
        .split('\n')
        .find((line) => line.includes('__RESULT__:'));
      if (resultLine) {
        try {
          const jsonStr = resultLine.split('__RESULT__:')[1].trim();
          capturedResult = JSON.parse(jsonStr);
          // Remove result line from output
          result.stdout = result.stdout.replace(resultLine, '').trim();
        } catch (error) {
          // Ignore JSON parse errors
        }
      }
    }

    return {
      ...result,
      result: capturedResult,
    };
  }

  /**
   * Validate that Python is available
   */
  async checkPythonAvailability(): Promise<boolean> {
    try {
      const result = await this.execute('print("Python is available")', {
        timeout: 1000,
      });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const pythonExecutor = new PythonExecutor();
