import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { LiftSession } from '@/lib/db/schema';
import { listSessions } from '@/lib/db/repository';

export function useLocalSessions() {
  const [sessions, setSessions] = useState<LiftSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listSessions();
      setSessions(data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => null);
    }, [load]),
  );

  useEffect(() => {
    load().catch(() => null);
  }, [load]);

  return {
    sessions,
    isLoading,
    reload: load,
  };
}
