import { eq, desc, asc, and } from 'drizzle-orm'
import { boardMembers } from '../schema'
import type { Database } from '../db'

export async function getMembersByType(db: Database, type: string) {
  return db.select().from(boardMembers)
    .where(and(eq(boardMembers.type, type), eq(boardMembers.isActive, 1)))
    .orderBy(asc(boardMembers.displayOrder))
}

export async function getAllMembersAdmin(db: Database) {
  return db.select().from(boardMembers).orderBy(desc(boardMembers.createdAt))
}

export async function createMember(db: Database, data: {
  id: string; name: string; designation: string; institute: string
  country: string; expertise?: string; photoUrl?: string
  photoKey?: string; type: string; displayOrder: number
}) {
  return db.insert(boardMembers).values({ ...data, createdAt: Date.now() })
}

export async function updateMember(db: Database, id: string, data: Partial<typeof boardMembers.$inferInsert>) {
  return db.update(boardMembers).set(data).where(eq(boardMembers.id, id))
}

export async function deleteMember(db: Database, id: string) {
  return db.delete(boardMembers).where(eq(boardMembers.id, id))
}
