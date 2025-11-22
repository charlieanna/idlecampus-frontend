import { create } from 'zustand';
import { TestResult } from '../../types/testCase';

interface TestState {
  // Test execution state
  testResults: Map<number, TestResult>;
  currentTestIndex: number;
  isRunning: boolean;
  
  // Actions
  setTestResults: (results: Map<number, TestResult>) => void;
  setTestResult: (index: number, result: TestResult) => void;
  setCurrentTestIndex: (index: number) => void;
  setIsRunning: (running: boolean) => void;
  clearTestResults: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  // Initial state
  testResults: new Map(),
  currentTestIndex: 0,
  isRunning: false,
  
  // Actions
  setTestResults: (results) => set({ testResults: results }),
  
  setTestResult: (index, result) => set((state) => {
    const newResults = new Map(state.testResults);
    newResults.set(index, result);
    return { testResults: newResults };
  }),
  
  setCurrentTestIndex: (index) => set({ currentTestIndex: index }),
  
  setIsRunning: (running) => set({ isRunning: running }),
  
  clearTestResults: () => set({ 
    testResults: new Map(),
    currentTestIndex: 0,
    isRunning: false,
  }),
}));

