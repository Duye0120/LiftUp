import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user?: UserProfile | null;
  }) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user: user ?? null,
        }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'liftup-session',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

export function useAccessToken() {
  return useSessionStore((state) => state.accessToken);
}

export function useCurrentUser() {
  return useSessionStore((state) => state.user);
}
