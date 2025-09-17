import { desc, eq } from 'drizzle-orm';
import { getDatabase } from '@/lib/db/client';
import { liftSessions, liftSets } from '@/lib/db/schema';
import type { LiftSession, LiftSet, NewLiftSession, NewLiftSet } from '@/lib/db/schema';

export async function listSessions(): Promise<LiftSession[]> {
  const db = await getDatabase();
  return db.select().from(liftSessions).orderBy(desc(liftSessions.startedAt));
}

export async function findSessionById(id: string): Promise<LiftSession | null> {
  const db = await getDatabase();
  const result = await db.select().from(liftSessions).where(eq(liftSessions.id, Number(id))).limit(1);
  return result?.[0] ?? null;
}

export async function createSession(payload: NewLiftSession): Promise<number> {
  const db = await getDatabase();
  const inserted = await db.insert(liftSessions).values(payload).returning({ id: liftSessions.id });
  return inserted?.[0]?.id ?? 0;
}

export async function upsertSession(payload: LiftSession): Promise<void> {
  const db = await getDatabase();
  await db
    .insert(liftSessions)
    .values(payload)
    .onConflictDoUpdate({
      target: liftSessions.id,
      set: {
        remoteId: payload.remoteId,
        athleteId: payload.athleteId,
        startedAt: payload.startedAt,
        completedAt: payload.completedAt,
        totalVolume: payload.totalVolume,
        notes: payload.notes,
        updatedAt: payload.updatedAt,
      },
    });
}

export async function listSetsBySession(sessionId: number): Promise<LiftSet[]> {
  const db = await getDatabase();
  return db.select().from(liftSets).where(eq(liftSets.sessionId, sessionId)).orderBy(desc(liftSets.sequence));
}

export async function createSet(payload: NewLiftSet): Promise<number> {
  const db = await getDatabase();
  const inserted = await db.insert(liftSets).values(payload).returning({ id: liftSets.id });
  return inserted?.[0]?.id ?? 0;
}
