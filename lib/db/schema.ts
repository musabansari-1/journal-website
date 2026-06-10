import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// ============================================
// PAPERS TABLE — Core of the journal
// ============================================
export const papers = sqliteTable('papers', {
  id: text('id').primaryKey(),                          // e.g. NRJ-2024-001
  title: text('title').notNull(),
  abstract: text('abstract').notNull(),
  keywords: text('keywords').notNull(),
  subject: text('subject').notNull(),                   // discipline/subject area

  // Author details
  authorName: text('author_name').notNull(),
  coAuthors: text('co_authors'),                        // JSON array of co-author names
  designation: text('designation').notNull(),
  institute: text('institute').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull().default('India'),

  // Submitted file
  fileUrl: text('file_url'),                            // R2 URL of submitted doc
  fileKey: text('file_key'),                            // R2 key for deletion
  fileName: text('file_name'),

  // Status workflow
  // submitted → under_review → revision_required → accepted → payment_pending → payment_received → published → rejected
  status: text('status').notNull().default('submitted'),
  reviewerNotes: text('reviewer_notes'),                // Feedback to author
  adminNotes: text('admin_notes'),                      // Internal notes

  // Payment
  publicationFee: integer('publication_fee'),           // in paise, set by admin on acceptance
  paymentId: text('payment_id'),                        // Razorpay payment ID
  paymentLinkId: text('payment_link_id'),               // Razorpay payment link ID
  paymentLinkUrl: text('payment_link_url'),             // Razorpay payment link URL
  paymentStatus: text('payment_status').default('not_required'), // not_required/pending/received/failed
  paidAt: integer('paid_at'),

  // Publication details (filled when published)
  doi: text('doi'),
  volume: text('volume'),
  issue: text('issue'),
  pageNo: text('page_no'),
  pdfUrl: text('pdf_url'),                             // R2 URL of final published PDF
  pdfKey: text('pdf_key'),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

// ============================================
// BOARD MEMBERS TABLE
// ============================================
export const boardMembers = sqliteTable('board_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  designation: text('designation').notNull(),
  institute: text('institute').notNull(),
  country: text('country').notNull().default('India'),
  expertise: text('expertise'),
  photoUrl: text('photo_url'),
  photoKey: text('photo_key'),
  type: text('type').notNull(),                        // editorial / advisory / reviewer
  displayOrder: integer('display_order').default(0),
  isActive: integer('is_active').default(1),
  createdAt: integer('created_at').notNull(),
})

// ============================================
// CONFERENCES TABLE
// ============================================
export const conferences = sqliteTable('conferences', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  venue: text('venue').notNull(),
  date: text('date').notNull(),
  lastDate: text('last_date'),                         // last date for submission
  registrationUrl: text('registration_url'),
  coverUrl: text('cover_url'),
  coverKey: text('cover_key'),
  isActive: integer('is_active').default(1),
  createdAt: integer('created_at').notNull(),
})

// ============================================
// JOIN REQUESTS TABLE (Editor/Reviewer applications)
// ============================================
export const joinRequests = sqliteTable('join_requests', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  designation: text('designation').notNull(),
  institute: text('institute').notNull(),
  country: text('country').notNull().default('India'),
  expertise: text('expertise').notNull(),
  experience: text('experience'),
  type: text('type').notNull(),                        // editor / reviewer
  cvUrl: text('cv_url'),
  cvKey: text('cv_key'),
  status: text('status').default('pending'),           // pending / approved / rejected
  isRead: integer('is_read').default(0),
  createdAt: integer('created_at').notNull(),
})

// ============================================
// CONTACTS TABLE
// ============================================
export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read').default(0),
  createdAt: integer('created_at').notNull(),
})

// ============================================
// TESTIMONIALS TABLE
// ============================================
export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey(),
  authorName: text('author_name').notNull(),
  designation: text('designation').notNull(),
  institute: text('institute').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  photoUrl: text('photo_url'),
  isActive: integer('is_active').default(1),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at').notNull(),
})
