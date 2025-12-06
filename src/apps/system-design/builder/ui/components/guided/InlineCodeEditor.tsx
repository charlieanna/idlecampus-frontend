import { Editor } from '@monaco-editor/react';
import { useCodeStore } from '../../store/useCodeStore';
import { SystemGraphComponent } from '../../../types/graph';

interface InlineCodeEditorProps {
  appServer: SystemGraphComponent;
  challenge?: any;
}

// Generate Python code template based on APIs (similar to PythonCodePage)
function generateAPICode(serverName: string, apis: string[]): string {
  // Check if this is TinyURL (has POST /api/v1/urls and GET /api/v1/urls/*)
  const isTinyUrl = apis.some(api => api.includes('/urls')) && 
                    apis.some(api => api.includes('POST')) && 
                    apis.some(api => api.includes('GET'));
  
  if (isTinyUrl) {
    // TinyURL-specific template matching the problem definition
    return `# ${serverName} - TinyURL API Handlers
# This server handles the following APIs:
${apis.map(api => `#   - ${api}`).join('\n')}

import random
import string
from typing import Optional

# Storage (in-memory for now - will add database later)
url_mappings = {}  # short_code -> original_url

def shorten(url: str, context: dict) -> Optional[str]:
    """
    Create a short code for the given URL.
    
    Args:
        url: The long URL to shorten
        context: System context (for now, just use url_mappings dict)
        
    Returns:
        A short code string, or None if invalid
    """
    # TODO: Implement this function
    # Hint: Generate a unique short code (6-8 characters)
    # Hint: Store the mapping: url_mappings[short_code] = url
    # Hint: Check for duplicates if needed
    
    # Simple starter implementation:
    if not url or len(url.strip()) == 0:
        return None
    
    # Generate a random 6-character code
    chars = string.ascii_letters + string.digits
    short_code = ''.join(random.choice(chars) for _ in range(6))
    
    # Store the mapping
    url_mappings[short_code] = url
    
    return short_code

def redirect(short_code: str, context: dict) -> Optional[str]:
    """
    Retrieve the original URL from a short code.
    
    Args:
        short_code: The short code to expand
        context: System context (for now, just use url_mappings dict)
        
    Returns:
        The original URL, or None if not found
    """
    # TODO: Implement this function
    # Hint: Look up short_code in url_mappings
    # Hint: Return the original URL or None if not found
    
    # Simple starter implementation:
    if not short_code:
        return None
    
    return url_mappings.get(short_code)
`;
  }
  
  // Generic template for other APIs
  const functionDefs = apis.map(api => {
    const parts = api.trim().split(/\s+/);
    const method = parts.length > 1 ? parts[0] : 'GET';
    const path = parts.length > 1 ? parts[1] : parts[0];
    const pathParts = path.split('/').filter(p => p && !p.includes('*') && !p.startsWith(':'));
    const funcName = `handle_${method.toLowerCase()}_${pathParts.join('_') || 'request'}`;
    
    return `def ${funcName}(request, context):
    """
    Handle ${method} ${path}
    
    Args:
        request: The incoming request object
        context: System context with access to databases, caches, etc.
        
    Returns:
        Response object
    """
    # TODO: Implement this API handler
    pass`;
  }).join('\n\n');
  
  return `# ${serverName} - API Handlers
# This server handles the following APIs:
${apis.map(api => `#   - ${api}`).join('\n')}

from typing import Any, Dict

${functionDefs}
`;
}

export function InlineCodeEditor({ appServer, challenge }: InlineCodeEditorProps) {
  const { pythonCodeByServer, setPythonCodeByServer } = useCodeStore();
  
  const serverId = appServer.id;
  const apis = appServer.config?.handledAPIs || [];
  const serverName = appServer.config?.displayName || appServer.config?.serviceName || 'App Server';
  
  // Get or initialize code for this server
  const existingCode = pythonCodeByServer[serverId]?.code;
  const currentCode = existingCode || generateAPICode(serverName, apis);
  
  const handleCodeChange = (value: string | undefined) => {
    setPythonCodeByServer({
      ...pythonCodeByServer,
      [serverId]: {
        code: value || '',
        apis: apis,
      },
    });
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🐍</span>
              Write Your Python Code
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{serverName}</strong> - Implement handlers for: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">{apis.join(', ')}</code>
            </p>
          </div>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={currentCode}
          onChange={handleCodeChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            readOnly: false,
          }}
        />
      </div>
      
      {/* Footer hint */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Fill in the TODO sections. For now, use the in-memory dictionary to store URL mappings.
        </p>
      </div>
    </div>
  );
}

