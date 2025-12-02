import { StepValidationResult } from '../../../types/guidedTutorial';

interface StepValidationFeedbackProps {
  result: StepValidationResult | null;
  isValidating: boolean;
  onDismiss?: () => void;
}

export function StepValidationFeedback({
  result,
  isValidating,
  onDismiss,
}: StepValidationFeedbackProps) {
  if (isValidating) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        <span className="text-sm text-blue-700">Checking your design...</span>
      </div>
    );
  }

  if (!result) return null;

  if (result.passed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-800 mb-1">Correct!</h4>
            <p className="text-sm text-green-700">{result.feedback}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-1">Not quite right</h4>
          <p className="text-sm text-red-700 mb-2">{result.feedback}</p>

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="text-xs text-red-600 mt-2">
              <span className="font-medium">Try:</span>
              <ul className="list-disc ml-4 mt-1 space-y-0.5">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline validation indicator for compact spaces
 */
export function ValidationIndicator({
  result,
  isValidating,
}: {
  result: StepValidationResult | null;
  isValidating: boolean;
}) {
  if (isValidating) {
    return (
      <span className="inline-flex items-center gap-1 text-blue-600">
        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Checking...</span>
      </span>
    );
  }

  if (!result) return null;

  if (result.passed) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-medium">Passed</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-red-600">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-medium">Issues found</span>
    </span>
  );
}
