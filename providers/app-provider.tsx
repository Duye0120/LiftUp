import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AppQueryClientProvider } from '@/providers/query-client';
import { DatabaseProvider } from '@/providers/database-provider';
import { initSentry } from '@/lib/monitoring/sentry';
import { useOnlineManager } from '@/hooks/use-online-manager';
import { useSyncProcessor } from '@/lib/sync/runner';

export function AppProviders({ children }: PropsWithChildren) {
  useOnlineManager();
  useSyncProcessor();

  useEffect(() => {
    initSentry();
  }, []);

  return (
    <AppQueryClientProvider>
      <DatabaseProvider>{children}</DatabaseProvider>
    </AppQueryClientProvider>
  );
}
