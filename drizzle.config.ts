import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'expo',
  dbCredentials: {
    databasePath: 'liftup.db',
  },
});
