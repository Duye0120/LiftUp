import { useEffect, useState } from 'react';
import { openDatabaseAsync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

const DB_NAME = 'liftup.db';

let dbPromise: Promise<ExpoSQLiteDatabase> | null = null;

async function createDatabase() {
  const sqlite = await openDatabaseAsync(DB_NAME, { useNewConnection: true });
  const db = drizzle(sqlite);

  try {
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
  } catch (error) {
    console.warn('[db] migrate skipped', error);
  }

  return db;
}

export async function getDatabase(): Promise<ExpoSQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }

  return dbPromise;
}

export function useDatabase() {
  const [database, setDatabase] = useState<ExpoSQLiteDatabase | null>(null);

  useEffect(() => {
    let mounted = true;

    getDatabase().then((db) => {
      if (mounted) {
        setDatabase(db);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return database;
}

export async function closeDatabase() {
  const sqlite = await openDatabaseAsync(DB_NAME);
  // `expo-sqlite` does not expose a close API on native, kept for parity when it arrives.
  await sqlite.closeAsync?.();
}
