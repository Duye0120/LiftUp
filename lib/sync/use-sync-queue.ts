import { useCallback } from 'react';
import { eq } from 'drizzle-orm';
import { getDatabase } from '@/lib/db/client';
import { syncQueue } from '@/lib/db/schema';
import type { SyncRecordPayload, SyncOperation, SyncRecord } from '@/stores/sync-store';
import { useSyncStore } from '@/stores/sync-store';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

type EnqueueInput = {
  entity: string;
  operation: SyncOperation;
  payload: SyncRecordPayload;
};

type FlushHandler = (record: SyncRecord) => Promise<void>;

export function useSyncQueue() {
  const queue = useSyncStore((state) => state.queue);
  const add = useSyncStore((state) => state.enqueue);
  const remove = useSyncStore((state) => state.dequeue);
  const patch = useSyncStore((state) => state.update);

  const enqueue = useCallback(
    async ({ entity, operation, payload }: EnqueueInput) => {
      const now = Date.now();
      const record: SyncRecord = {
        id: createId(),
        entity,
        operation,
        payload,
        createdAt: now,
        updatedAt: now,
      };

      add(record);

      const db = await getDatabase();
      await db.insert(syncQueue).values({
        id: record.id,
        entity: record.entity,
        operation: record.operation,
        payload: JSON.stringify(record.payload ?? {}),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        lastTriedAt: record.lastTriedAt ?? null,
        error: record.error ?? null,
      });

      return record;
    },
    [add],
  );

  const removeFromQueue = useCallback(
    async (id: string) => {
      remove(id);
      const db = await getDatabase();
      await db.delete(syncQueue).where(eq(syncQueue.id, id));
    },
    [remove],
  );

  const markFailed = useCallback(
    async (id: string, error: unknown) => {
      const now = Date.now();
      const message = error instanceof Error ? error.message : '未知错误';

      patch(id, { error: message, lastTriedAt: now, updatedAt: now });
      const db = await getDatabase();
      await db
        .update(syncQueue)
        .set({
          error: message,
          lastTriedAt: now,
          updatedAt: now,
        })
        .where(eq(syncQueue.id, id));
    },
    [patch],
  );

  const flush = useCallback(
    async (handler: FlushHandler) => {
      for (const record of queue) {
        try {
          await handler(record);
          await removeFromQueue(record.id);
        } catch (error) {
          await markFailed(record.id, error);
        }
      }
    },
    [queue, removeFromQueue, markFailed],
  );

  return {
    queue,
    enqueue,
    flush,
    remove: removeFromQueue,
  };
}
