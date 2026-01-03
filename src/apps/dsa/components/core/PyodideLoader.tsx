import { useEffect, useState } from 'react';

// Global flag to track if Pyodide is being loaded
let pyodideLoadingStarted = false;

// Component to load Pyodide script
export function PyodideLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if loadPyodide is already available globally
    if (window.loadPyodide) {
      setLoaded(true);
      return;
    }

    // Check if Pyodide script is already in the document
    if (document.getElementById('pyodide-script')) {
      setLoaded(true);
      return;
    }

    // Check if we're already loading Pyodide
    if (pyodideLoadingStarted) {
      return;
    }

    // Mark that we're starting to load Pyodide
    pyodideLoadingStarted = true;

    // Add Pyodide script to document
    const script = document.createElement('script');
    script.id = 'pyodide-script';
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.async = true;
    script.onload = () => {setLoaded(true);
    };
    script.onerror = (error) => {pyodideLoadingStarted = false; // Reset so we can retry
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount, as other components might need it
    };
  }, []);

  return null; // This component doesn't render anything
}
