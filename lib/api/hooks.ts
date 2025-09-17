import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { LiftSession, NewLiftSession } from '@/lib/db/schema';
import { useSyncQueue } from '@/lib/sync/use-sync-queue';

export const queryKeys = {
  sessions: ['lift-sessions'] as const,
  session: (id: number | string) => ['lift-sessions', id] as const,
};

type LiftSessionsResponse = {
  data?: LiftSession[];
};

type CreateSessionResponse = {
  data?: LiftSession;
};

export function useLiftSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: async () => {
      const response = await apiClient<LiftSessionsResponse>({ path: '/sessions' });
      return response?.data ?? [];
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateSessionMutation() {
  const queue = useSyncQueue();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NewLiftSession) => {
      try {
        const response = await apiClient<CreateSessionResponse>({
          path: '/sessions',
          method: 'POST',
          body: payload,
        });

        return response?.data ?? null;
      } catch (error) {
        queue.enqueue({ entity: 'lift_sessions', operation: 'create', payload });
        throw error;
      }
    },
    onSuccess: (session) => {
      if (session) {
        queryClient.setQueryData<LiftSession[]>(queryKeys.sessions, (existing) => {
          const list = existing ?? [];
          const next = [...list, session];
          return next;
        });
      }
    },
  });
}
