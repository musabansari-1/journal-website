import { eq, desc, and, like, sql } from 'drizzle-orm'
import { papers } from '../schema'
import type { Database } from '../db'

export async function createPaper(db: Database, data: {
  id: string; title: string; abstract: string; keywords: string
  subject: string; authorName: string; coAuthors?: string
  designation: string; institute: string; email: string
  phone: string; country: string; fileUrl?: string
  fileKey?: string; fileName?: string
}) {
  const now = Date.now()
  return db.insert(papers).values({
    id: data.id, title: data.title, abstract: data.abstract,
    keywords: data.keywords, subject: data.subject,
    authorName: data.authorName, coAuthors: data.coAuthors,
    designation: data.designation, institute: data.institute,
    email: data.email, phone: data.phone, country: data.country,
    fileUrl: data.fileUrl, fileKey: data.fileKey, fileName: data.fileName,
    createdAt: now, updatedAt: now,
  } as any)
}

export async function getPaperById(db: Database, id: string) {
  const result = await db.select().from(papers).where(eq(papers.id, id)).limit(1)
  return result[0] || null
}

export async function trackPaper(db: Database, email: string, name: string) {
  return db.select({
    id: papers.id, title: papers.title, status: papers.status,
    reviewerNotes: papers.reviewerNotes, subject: papers.subject,
    createdAt: papers.createdAt, updatedAt: papers.updatedAt,
    doi: papers.doi, volume: papers.volume, issue: papers.issue,
    paymentStatus: papers.paymentStatus, paymentLinkUrl: papers.paymentLinkUrl,
  }).from(papers)
    .where(and(eq(papers.email, email), like(papers.authorName, `%${name}%`)))
    .orderBy(desc(papers.createdAt))
}

export async function getPublishedPapers(db: Database, subject?: string) {
  const base = {
    id: papers.id, title: papers.title, authorName: papers.authorName,
    coAuthors: papers.coAuthors, abstract: papers.abstract,
    keywords: papers.keywords, subject: papers.subject, doi: papers.doi,
    volume: papers.volume, issue: papers.issue, pageNo: papers.pageNo,
    pdfUrl: papers.pdfUrl, institute: papers.institute, createdAt: papers.createdAt,
  }
  const where = subject
    ? and(eq(papers.status, 'published'), eq(papers.subject, subject))
    : eq(papers.status, 'published')
  return db.select(base).from(papers).where(where).orderBy(desc(papers.createdAt))
}

export async function getAllPapersAdmin(db: Database) {
  return db.select().from(papers).orderBy(desc(papers.createdAt))
}

export async function updatePaperStatus(
  db: Database, id: string, status: string,
  reviewerNotes?: string, adminNotes?: string
) {
  const updates: Record<string, unknown> = { status, updatedAt: Date.now() }
  if (reviewerNotes !== undefined) updates.reviewerNotes = reviewerNotes
  if (adminNotes !== undefined) updates.adminNotes = adminNotes
  return db.update(papers).set(updates as any).where(eq(papers.id, id))
}

export async function setPublicationFee(db: Database, id: string, fee: number) {
  return db.update(papers).set({ publicationFee: fee, updatedAt: Date.now() } as any).where(eq(papers.id, id))
}

export async function setPaymentLink(db: Database, id: string, linkId: string, linkUrl: string) {
  return db.update(papers).set({
    paymentLinkId: linkId, paymentLinkUrl: linkUrl,
    paymentStatus: 'pending', status: 'payment_pending', updatedAt: Date.now()
  } as any).where(eq(papers.id, id))
}

export async function confirmPayment(db: Database, paperId: string, paymentId: string) {
  return db.update(papers).set({
    paymentId, paymentStatus: 'received',
    status: 'payment_received', paidAt: Date.now(), updatedAt: Date.now()
  } as any).where(eq(papers.id, paperId))
}

export async function publishPaper(db: Database, id: string, data: {
  doi?: string; volume?: string; issue?: string; pageNo?: string
  pdfUrl?: string; pdfKey?: string
}) {
  return db.update(papers)
    .set({ ...data, status: 'published', updatedAt: Date.now() } as any)
    .where(eq(papers.id, id))
}

export async function generatePaperId(db: Database): Promise<string> {
  const year = new Date().getFullYear()
  const result = await db.select({ count: sql<number>`count(*)` }).from(papers)
  const num = String((Number(result[0]?.count) || 0) + 1).padStart(3, '0')
  return `NRJ-${year}-${num}`
}
