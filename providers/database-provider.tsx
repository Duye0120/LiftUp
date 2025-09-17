import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useDatabase } from '@/lib/db/client';

type DatabaseContextValue = {
  db: ExpoSQLiteDatabase | null;
  isReady: boolean;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const db = useDatabase();

  const value = useMemo<DatabaseContextValue>(
    () => ({
      db,
      isReady: Boolean(db),
    }),
    [db],
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabaseContext() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('Database Provider 缺失');
  }

  return context;
}

export function useDatabaseInstance() {
  const { db } = useDatabaseContext();

  if (!db) {
    throw new Error('Database 尚未准备就绪');
  }

  return db;
}
