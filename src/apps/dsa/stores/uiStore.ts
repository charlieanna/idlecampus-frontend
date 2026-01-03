/**
 * UI Store - Zustand State Management
 * 
 * Manages global UI state like sidebar, modals, theme, etc.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  sidebarWidth: number;
  
  // Modal state
  activeModal: string | null;
  modalData: any;
  
  // Theme
  theme: 'light' | 'dark' | 'auto';
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // UI Preferences
  fontSize: 'sm' | 'md' | 'lg';
  compactMode: boolean;
  
  // Notifications/Toasts
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }[];
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLoading: (loading: boolean, message?: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setCompactMode: (compact: boolean) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const initialState = {
  isSidebarOpen: true,
  sidebarWidth: 300,
  activeModal: null,
  modalData: null,
  theme: 'light' as const,
  isLoading: false,
  loadingMessage: '',
  fontSize: 'md' as const,
  compactMode: false,
  notifications: [],
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () =>
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'toggleSidebar'),

        setSidebarOpen: (open) =>
          set({ isSidebarOpen: open }, false, 'setSidebarOpen'),

        setSidebarWidth: (width) =>
          set({ sidebarWidth: width }, false, 'setSidebarWidth'),

        openModal: (modalId, data = null) =>
          set({ activeModal: modalId, modalData: data }, false, 'openModal'),

        closeModal: () =>
          set({ activeModal: null, modalData: null }, false, 'closeModal'),

        setTheme: (theme) =>
          set({ theme }, false, 'setTheme'),

        setLoading: (loading, message = '') =>
          set({ isLoading: loading, loadingMessage: message }, false, 'setLoading'),

        setFontSize: (size) =>
          set({ fontSize: size }, false, 'setFontSize'),

        setCompactMode: (compact) =>
          set({ compactMode: compact }, false, 'setCompactMode'),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: Date.now().toString() },
            ],
          }), false, 'addNotification'),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }), false, 'removeNotification'),

        clearNotifications: () =>
          set({ notifications: [] }, false, 'clearNotifications'),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          isSidebarOpen: state.isSidebarOpen,
          sidebarWidth: state.sidebarWidth,
          theme: state.theme,
          fontSize: state.fontSize,
          compactMode: state.compactMode,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// Selectors
export const uiSelectors = {
  isSidebarOpen: (state: UIState) => state.isSidebarOpen,
  theme: (state: UIState) => state.theme,
  isLoading: (state: UIState) => state.isLoading,
  notifications: (state: UIState) => state.notifications,
  fontSize: (state: UIState) => state.fontSize,
  compactMode: (state: UIState) => state.compactMode,
};