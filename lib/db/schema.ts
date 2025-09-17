import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const liftSessions = sqliteTable('lift_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  remoteId: text('remote_id'),
  athleteId: text('athlete_id').notNull(),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  totalVolume: real('total_volume').default(0),
  notes: text('notes'),
  updatedAt: integer('updated_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const liftSets = sqliteTable('lift_sets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull(),
  remoteId: text('remote_id'),
  movement: text('movement').notNull(),
  reps: integer('reps').notNull(),
  weight: real('weight'),
  rpe: real('rpe'),
  sequence: integer('sequence').notNull(),
  updatedAt: integer('updated_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const syncQueue = sqliteTable('sync_queue', {
  id: text('id').primaryKey(),
  entity: text('entity').notNull(),
  payload: text('payload').notNull(),
  operation: text('operation').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  lastTriedAt: integer('last_tried_at'),
  error: text('error'),
});

export type LiftSession = InferSelectModel<typeof liftSessions>;
export type NewLiftSession = InferInsertModel<typeof liftSessions>;

export type LiftSet = InferSelectModel<typeof liftSets>;
export type NewLiftSet = InferInsertModel<typeof liftSets>;

export type SyncQueueItem = InferSelectModel<typeof syncQueue>;
export type NewSyncQueueItem = InferInsertModel<typeof syncQueue>;
