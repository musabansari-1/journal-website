import { eq, desc, asc } from 'drizzle-orm'
import { contacts, joinRequests, testimonials } from '../schema'
import type { Database } from '../db'

export async function createContact(db: Database, data: {
  id: string; name: string; email: string; phone?: string; subject: string; message: string
}) {
  return db.insert(contacts).values({ ...data, createdAt: Date.now() } as any)
}

export async function getAllContacts(db: Database) {
  return db.select().from(contacts).orderBy(desc(contacts.createdAt))
}

export async function markContactRead(db: Database, id: string) {
  return db.update(contacts).set({ isRead: 1 } as any).where(eq(contacts.id, id))
}

export async function createJoinRequest(db: Database, data: {
  id: string; name: string; email: string; phone: string
  designation: string; institute: string; country: string
  expertise: string; experience?: string; type: string
  cvUrl?: string; cvKey?: string
}) {
  return db.insert(joinRequests).values({ ...data, createdAt: Date.now() } as any)
}

export async function getAllJoinRequests(db: Database) {
  return db.select().from(joinRequests).orderBy(desc(joinRequests.createdAt))
}

export async function updateJoinRequestStatus(db: Database, id: string, status: string) {
  return db.update(joinRequests).set({ status } as any).where(eq(joinRequests.id, id))
}

export async function getTestimonials(db: Database) {
  return db.select().from(testimonials)
    .where(eq(testimonials.isActive, 1))
    .orderBy(asc(testimonials.displayOrder))
}

export async function getAllTestimonialsAdmin(db: Database) {
  return db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
}

export async function createTestimonial(db: Database, data: {
  id: string; authorName: string; designation: string; institute: string
  content: string; rating: number; photoUrl?: string; displayOrder: number
}) {
  return db.insert(testimonials).values({ ...data, createdAt: Date.now() } as any)
}

export async function updateTestimonial(db: Database, id: string, data: Partial<typeof testimonials.$inferInsert>) {
  return db.update(testimonials).set(data as any).where(eq(testimonials.id, id))
}

export async function deleteTestimonial(db: Database, id: string) {
  return db.delete(testimonials).where(eq(testimonials.id, id))
}
