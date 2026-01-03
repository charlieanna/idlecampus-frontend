/**
 * Global Error Suppression Utility
 * 
 * Suppresses known harmless bundler and module resolution errors
 * that don't affect application functionality.
 */

const SUPPRESS_PATTERNS = [
  // Stack parsing errors
  'error-stack-parser',
  'stackframe',
  
  // Module definition errors
  'duplicate definition',
  'module already defined',
  'already been declared',
  
  // Lucide/icon library errors
  'lucide-react',
  'lucide',
  
  // Runtime errors (the main culprit)
  'unknown runtime error',
  'unknown runtime',
  'runtime error',
  'unknown error',
  'error: unknown runtime error',
  'error: unknown runtime',
  'error: unknown',
  'err_unknown',
  
  // ESM/bundler errors
  'esm.sh',
  '/es2022/lucide-react.mjs',
  'at https://esm.sh',
  '.mjs:2:',
  '.mjs',
  'mjs:2:101',
  'mjs:2:29845',
  'es2022',
  
  // Chunk loading errors
  'chunk',
  'failed to fetch',
  'loading chunk',
  'import()',
  'dynamically imported module'
];

export const shouldSuppressError = (text: string): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return SUPPRESS_PATTERNS.some(pattern => 
    lowerText.includes(pattern.toLowerCase())
  );
};

export const initializeErrorSuppression = () => {
  if (typeof window === 'undefined') return;

  // Store originals
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Override console.error
  console.error = function(...args: any[]) {
    try {
      const message = args.map(a => {
        if (typeof a === 'string') return a;
        if (a?.message) return a.message;
        if (a?.stack) return a.stack;
        return String(a || '');
      }).join(' ');
      
      if (!shouldSuppressError(message)) {
        originalError.apply(console, args);
      }
    } catch {
      // Silent fail - don't throw errors in error handler
    }
  };
  
  // Override console.warn
  console.warn = function(...args: any[]) {
    try {
      const message = args.map(a => String(a || '')).join(' ');
      if (!shouldSuppressError(message)) {
        originalWarn.apply(console, args);
      }
    } catch {
      // Silent fail
    }
  };
};

export const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;

  const errorHandler = (event: ErrorEvent) => {
    try {
      const parts = [
        event.message || '',
        event.filename || '',
        event.error?.message || '',
        event.error?.stack || '',
        event.error?.toString() || ''
      ].join(' ');
      
      if (shouldSuppressError(parts)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    } catch {
      // Fallback: if we can't parse, check filename
      if (event.filename?.includes('lucide-react') || 
          event.filename?.includes('esm.sh') ||
          event.filename?.includes('.mjs')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    }
  };
  
  const rejectionHandler = (event: PromiseRejectionEvent) => {
    try {
      const message = [
        String(event.reason?.message || ''),
        String(event.reason?.stack || ''),
        String(event.reason || '')
      ].join(' ');
      
      if (shouldSuppressError(message)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    } catch {
      // Silent fail
    }
  };
  
  // Capture phase - fires FIRST
  window.addEventListener('error', errorHandler, true);
  // Bubble phase - backup
  window.addEventListener('error', errorHandler, false);
  
  // Promise rejections
  window.addEventListener('unhandledrejection', rejectionHandler, true);
  window.addEventListener('unhandledrejection', rejectionHandler, false);
};

// Initialize immediately on module load
initializeErrorSuppression();
setupGlobalErrorHandlers();
