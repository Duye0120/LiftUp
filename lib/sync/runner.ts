import { useCallback, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from '@/lib/api/client';
import type { SyncRecord } from '@/stores/sync-store';
import { useSyncQueue } from '@/lib/sync/use-sync-queue';
import { trackError } from '@/lib/monitoring/sentry';

async function processRecord(record: SyncRecord) {
  const { entity, operation, payload } = record;

  switch (entity) {
    case 'lift_sessions': {
      if (operation === 'create') {
        await apiClient({ path: '/sessions', method: 'POST', body: payload });
      }
      return;
    }
    default: {
      console.warn(`[sync] 未识别的实体 ${entity}`);
    }
  }
}

type SyncProcessorOptions = {
  enabled?: boolean;
};

export function useSyncProcessor(options: SyncProcessorOptions = {}) {
  const { enabled = true } = options;
  const { queue, flush } = useSyncQueue();

  const syncNow = useCallback(async () => {
    if (!enabled) {
      return;
    }

    await flush(async (record) => {
      try {
        await processRecord(record);
      } catch (error) {
        trackError(error);
        throw error;
      }
    });
  }, [enabled, flush]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state?.isConnected && state.isInternetReachable && queue.length > 0) {
        syncNow().catch(trackError);
      }
    });

    return () => unsubscribe();
  }, [enabled, queue.length, syncNow]);

  useEffect(() => {
    if (!enabled || queue.length === 0) {
      return;
    }

    syncNow().catch(trackError);
  }, [enabled, queue.length, syncNow]);

  return {
    queue,
    syncNow,
  };
}
