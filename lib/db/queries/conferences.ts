import { eq, desc } from 'drizzle-orm'
import { conferences } from '../schema'
import type { Database } from '../db'

export async function getActiveConferences(db: Database) {
  return db.select().from(conferences).where(eq(conferences.isActive, 1)).orderBy(desc(conferences.createdAt))
}

export async function getAllConferencesAdmin(db: Database) {
  return db.select().from(conferences).orderBy(desc(conferences.createdAt))
}

export async function createConference(db: Database, data: {
  id: string; title: string; description: string; venue: string
  date: string; lastDate?: string; registrationUrl?: string
  coverUrl?: string; coverKey?: string
}) {
  return db.insert(conferences).values({ ...data, createdAt: Date.now() })
}

export async function updateConference(db: Database, id: string, data: Partial<typeof conferences.$inferInsert>) {
  return db.update(conferences).set(data).where(eq(conferences.id, id))
}

export async function deleteConference(db: Database, id: string) {
  return db.delete(conferences).where(eq(conferences.id, id))
}
