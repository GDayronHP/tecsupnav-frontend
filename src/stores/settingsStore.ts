import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  performanceMode: boolean;
  notifications: boolean;
  darkMode: boolean;
  
  // Actions
  togglePerformanceMode: () => void;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  setPerformanceMode: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      performanceMode: false,
      notifications: true,
      darkMode: false,
      
      togglePerformanceMode: () => set((state) => ({ 
        performanceMode: !state.performanceMode 
      })),
      toggleNotifications: () => set((state) => ({ 
        notifications: !state.notifications 
      })),
      toggleDarkMode: () => set((state) => ({ 
        darkMode: !state.darkMode 
      })),
      setPerformanceMode: (value) => set({ performanceMode: value }),
      setNotifications: (value) => set({ notifications: value }),
      setDarkMode: (value) => set({ darkMode: value })
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
