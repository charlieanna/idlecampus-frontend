// Python Task Validator
// Since we can't execute Python in the browser, we validate based on code patterns

export function validatePythonTask(
  code: string,
  validation: (code: string) => boolean,
  expectedOutput: string,
  hint?: string
): { success: boolean; output: string; error?: string } {
  try {
    const isValid = validation(code);

    if (isValid) {
      return {
        success: true,
        output: `✓ Correct! Great job!\n\nExpected output:\n${expectedOutput}`,
      };
    } else {
      return {
        success: false,
        output: `✗ Not quite right. Your code is missing some required elements.\n\nExpected output:\n${expectedOutput}\n\n${hint ? `Hint: ${hint}\n\n` : ''}Make sure your code includes all required parts!`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: err.message,
    };
  }
}
