import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SyncOperation = 'create' | 'update' | 'delete';

export type SyncRecordPayload = Record<string, unknown>;

export type SyncRecord = {
  id: string;
  entity: string;
  operation: SyncOperation;
  payload: SyncRecordPayload;
  createdAt: number;
  updatedAt: number;
  lastTriedAt?: number;
  error?: string | null;
};

type SyncStore = {
  queue: SyncRecord[];
  enqueue: (record: SyncRecord) => void;
  dequeue: (id: string) => void;
  update: (id: string, patch: Partial<SyncRecord>) => void;
  clear: () => void;
};

export const useSyncStore = create<SyncStore>()(
  persist(
    (set) => ({
      queue: [],
      enqueue: (record) =>
        set((state) => ({
          queue: [...state.queue, record],
        })),
      dequeue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),
      update: (id, patch) =>
        set((state) => ({
          queue: state.queue.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      clear: () => set({ queue: [] }),
    }),
    {
      name: 'liftup-sync-queue',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
