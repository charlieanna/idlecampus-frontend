import { create } from 'zustand';
import { Challenge, Solution } from '../../types/testCase';

interface BuilderState {
  // Challenge state
  selectedChallenge: Challenge | null;
  currentLevel: number;
  hasSubmitted: boolean;
  
  // Solution
  solution: Solution | null;
  showSolutionModal: boolean;
  
  // Actions
  setSelectedChallenge: (challenge: Challenge | null) => void;
  setCurrentLevel: (level: number) => void;
  setHasSubmitted: (submitted: boolean) => void;
  setSolution: (solution: Solution | null) => void;
  setShowSolutionModal: (show: boolean) => void;
  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  // Initial state
  selectedChallenge: null,
  currentLevel: 1,
  hasSubmitted: false,
  solution: null,
  showSolutionModal: false,
  
  // Actions
  setSelectedChallenge: (challenge) => set({ selectedChallenge: challenge }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setHasSubmitted: (submitted) => set({ hasSubmitted: submitted }),
  setSolution: (solution) => set({ solution: solution }),
  setShowSolutionModal: (show) => set({ showSolutionModal: show }),
  resetBuilder: () => set({
    selectedChallenge: null,
    currentLevel: 1,
    hasSubmitted: false,
    solution: null,
    showSolutionModal: false,
  }),
}));

