import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

function useAppFocusTracking() {
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => listener.remove();
  }, []);
}

export function AppQueryClientProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: Platform.select({ ios: 2, android: 2, default: 1 }),
            staleTime: 1000 * 30,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  useAppFocusTracking();

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
