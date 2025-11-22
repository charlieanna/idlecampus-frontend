import { create } from 'zustand';
import { SystemDesignLesson } from '../../types/lesson';

type TabId = 'canvas' | 'app-server' | 'load-balancer' | 'python' | 'lessons' | 'apis' | string;

interface UIState {
  // Tab navigation
  activeTab: TabId;
  
  // Panels and modals
  showContextualHelp: boolean;
  
  // Lesson state
  selectedLesson: SystemDesignLesson | null;
  
  // Actions
  setActiveTab: (tab: TabId) => void;
  setShowContextualHelp: (show: boolean) => void;
  setSelectedLesson: (lesson: SystemDesignLesson | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  activeTab: 'canvas',
  showContextualHelp: false,
  selectedLesson: null,
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowContextualHelp: (show) => set({ showContextualHelp: show }),
  setSelectedLesson: (lesson) => set({ selectedLesson: lesson }),
}));

