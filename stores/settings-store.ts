import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemePreference = 'system' | 'light' | 'dark';

export type SettingsState = {
  theme: ThemePreference;
  notificationsEnabled: boolean;
  motionTrackingEnabled: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleNotifications: (enabled: boolean) => void;
  toggleMotionTracking: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      notificationsEnabled: false,
      motionTrackingEnabled: false,
      setTheme: (theme) => set({ theme }),
      toggleNotifications: (enabled) => set({ notificationsEnabled: enabled }),
      toggleMotionTracking: (enabled) => set({ motionTrackingEnabled: enabled }),
    }),
    {
      name: 'liftup-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
