import { create } from 'zustand';

interface ServerCode {
  code: string;
  apis: string[];
}

interface CodeState {
  // Python code state
  pythonCode: string;
  pythonCodeByServer: Record<string, ServerCode>;
  
  // Validation state
  connectionErrors: string[];
  schemaErrors: string[];
  
  // Actions
  setPythonCode: (code: string) => void;
  setPythonCodeByServer: (codeByServer: Record<string, ServerCode>) => void;
  updateServerCode: (serverId: string, code: string) => void;
  setConnectionErrors: (errors: string[]) => void;
  setSchemaErrors: (errors: string[]) => void;
  clearErrors: () => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  // Initial state
  pythonCode: '',
  pythonCodeByServer: {},
  connectionErrors: [],
  schemaErrors: [],
  
  // Actions
  setPythonCode: (code) => set({ pythonCode: code }),
  
  setPythonCodeByServer: (codeByServer) => set({ pythonCodeByServer: codeByServer }),
  
  updateServerCode: (serverId, code) => set((state) => ({
    pythonCodeByServer: {
      ...state.pythonCodeByServer,
      [serverId]: code,
    },
  })),
  
  setConnectionErrors: (errors) => set({ connectionErrors: errors }),
  
  setSchemaErrors: (errors) => set({ schemaErrors: errors }),
  
  clearErrors: () => set({ connectionErrors: [], schemaErrors: [] }),
}));

