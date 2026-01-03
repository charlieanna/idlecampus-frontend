/**
 * Removes function signature sections from instruction text
 * @param instruction The raw instruction text
 * @returns Cleaned instruction text without function signatures
 */
export function cleanInstruction(instruction: string): string {
  if (!instruction) return '';
  
  let cleaned = instruction;
  
  // Remove function signature sections with various heading levels
  cleaned = cleaned.replace(/#{1,6}\s*Function\s+Signature[:\s]*[\s\S]*?```\s*python[\s\S]*?```\s*/gi, '');
  
  // Remove alternative function signature patterns
  cleaned = cleaned.replace(/#{1,6}\s*Signature[:\s]*[\s\S]*?```\s*python[\s\S]*?```\s*/gi, '');
  cleaned = cleaned.replace(/#{1,6}\s*Method\s+Signature[:\s]*[\s\S]*?```\s*python[\s\S]*?```\s*/gi, '');
  
  // Remove standalone code blocks that contain only function definitions (common pattern)
  cleaned = cleaned.replace(/```\s*python\s*\ndef\s+\w+\([^)]*\)(\s*->\s*[^:]+)?:\s*#[^\n]*\n\s*pass\s*\n```\s*/gi, '');
  
  // Clean up any double newlines created by removal
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n').trim();
  
  return cleaned;
}