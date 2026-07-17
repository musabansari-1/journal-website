/**
 * Elsevier Journal — Cloudflare Worker
 *
 * CPU Budget per request (free tier = 10ms limit):
 * - KV reads: ~0.5ms (checked first, avoids D1)
 * - D1 reads: ~2ms
 * - D1 writes: ~2ms
 * - Storage uploads: 0ms CPU (network)
 * - Razorpay API calls: 0ms CPU (network)
 * - Email sends: 0ms CPU (network, via Queue)
 * - Heavy tasks → Queue (fresh CPU budget)
 *
 * KV caching strategy:
 * - Published papers, board members, conferences → cached in KV
 * - KV reads NOT counted against shared D1 limit
 * - Reduces D1 reads by ~95% for read-heavy pages
 */

import { createDb } from '../lib/db/db'
import { createPaper, getPaperById, trackPaper, getPublishedPapers, getAllPapersAdmin, updatePaperStatus, setPublicationFee, setPaymentLink, confirmPayment, publishPaper, generatePaperId } from '../lib/db/queries/papers'
import { getMembersByType, getAllMembersAdmin, createMember, updateMember, deleteMember } from '../lib/db/queries/members'
import { getActiveConferences, getAllConferencesAdmin, createConference, updateConference, deleteConference } from '../lib/db/queries/conferences'
import { createContact, getAllContacts, markContactRead, createJoinRequest, getAllJoinRequests, updateJoinRequestStatus, getTestimonials, getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial } from '../lib/db/queries/contacts'
import { uploadFile, deleteFile, generateStorageKey, validateFile } from '../lib/storage/storage'
import { getCached, setCache, invalidateCache, CACHE_KEYS, TTL } from '../lib/storage/kv-cache'
import { createPaymentLink, verifyWebhookSignature, getPaymentDetails } from '../lib/razorpay/payment'
import { sendEmail } from '../lib/email/send'
import { submissionConfirmationEmail, statusUpdateEmail, adminNewSubmissionEmail, contactNotificationEmail, joinRequestEmail } from '../lib/email/templates'
import { generateId, STATUS_LABELS } from '../lib/utils/id'

export interface Env {
  DB: D1Database
  R2: R2Bucket
  KV: KVNamespace
  QUEUE: Queue
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string
  RAZORPAY_WEBHOOK_SECRET: string
  RESEND_API_KEY: string
  ENVIRONMENT: string
}

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' }
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors } })
const err = (msg: string, status = 400) => json({ error: msg }, status)

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method

    if (method === 'OPTIONS') return new Response(null, { headers: cors })

    const db = createDb(env)

    try {

      // ═══════════════════════════════════════
      // PUBLIC — PAPERS
      // ═══════════════════════════════════════

      // GET published papers (with KV cache — saves D1 reads)
      if (path === '/api/papers/published' && method === 'GET') {
        const subject = url.searchParams.get('subject') || undefined
        const cacheKey = subject ? CACHE_KEYS.PUBLISHED_BY_SUBJECT(subject) : CACHE_KEYS.PUBLISHED_PAPERS

        const cached = await getCached(env, cacheKey)
        if (cached) return json(cached) // KV hit — zero D1 reads

        const papers = await getPublishedPapers(db, subject)
        await setCache(env, cacheKey, papers, TTL.PAPERS)
        return json(papers)
      }

      // POST submit paper
      if (path === '/api/papers/submit' && method === 'POST') {
        const formData = await request.formData()
        const title = formData.get('title') as string
        const abstract = formData.get('abstract') as string
        const keywords = formData.get('keywords') as string
        const subject = formData.get('subject') as string
        const authorName = formData.get('authorName') as string
        const coAuthors = formData.get('coAuthors') as string
        const designation = formData.get('designation') as string
        const institute = formData.get('institute') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const country = formData.get('country') as string || 'India'
        const file = formData.get('file') as File | null

        if (!title || !abstract || !keywords || !subject || !authorName || !designation || !institute || !email || !phone) {
          return err('Missing required fields')
        }

        let fileUrl: string | undefined
        let fileKey: string | undefined
        let fileName: string | undefined

        if (file && file.size > 0) {
          const validation = validateFile(file.type, file.size, 'document')
          if (!validation.valid) return err(validation.error!)
          fileKey = generateStorageKey('papers', file.name)
          const buffer = await file.arrayBuffer()
          fileUrl = await uploadFile(env, fileKey, buffer, file.type)
          fileName = file.name
        }

        const id = await generatePaperId(db)
        await createPaper(db, { id, title, abstract, keywords, subject, authorName, coAuthors, designation, institute, email, phone, country, fileUrl, fileKey, fileName })

        // Queue emails — 0ms CPU here
        await env.QUEUE.send({ type: 'submission_confirmation', paperId: id, title, authorName, email, subject })

        return json({ success: true, paperId: id })
      }

      // POST track paper by email + name
      if (path === '/api/papers/track' && method === 'POST') {
        const body = await request.json() as { email: string; name: string }
        if (!body.email || !body.name) return err('Email and name required')
        // Always fresh D1 read — authors need real-time status
        const papers = await trackPaper(db, body.email, body.name)
        return json(papers)
      }

      // ═══════════════════════════════════════
      // PUBLIC — BOARD MEMBERS (KV cached)
      // ═══════════════════════════════════════

      if (path === '/api/members/editorial' && method === 'GET') {
        const cached = await getCached(env, CACHE_KEYS.EDITORIAL_BOARD)
        if (cached) return json(cached)
        const members = await getMembersByType(db, 'editorial')
        await setCache(env, CACHE_KEYS.EDITORIAL_BOARD, members, TTL.MEMBERS)
        return json(members)
      }

      if (path === '/api/members/advisory' && method === 'GET') {
        const cached = await getCached(env, CACHE_KEYS.ADVISORY_BOARD)
        if (cached) return json(cached)
        const members = await getMembersByType(db, 'advisory')
        await setCache(env, CACHE_KEYS.ADVISORY_BOARD, members, TTL.MEMBERS)
        return json(members)
      }

      if (path === '/api/members/reviewer' && method === 'GET') {
        const cached = await getCached(env, CACHE_KEYS.REVIEWER_COMMITTEE)
        if (cached) return json(cached)
        const members = await getMembersByType(db, 'reviewer')
        await setCache(env, CACHE_KEYS.REVIEWER_COMMITTEE, members, TTL.MEMBERS)
        return json(members)
      }

      // ═══════════════════════════════════════
      // PUBLIC — CONFERENCES (KV cached)
      // ═══════════════════════════════════════

      if (path === '/api/conferences' && method === 'GET') {
        const cached = await getCached(env, CACHE_KEYS.CONFERENCES)
        if (cached) return json(cached)
        const conferences = await getActiveConferences(db)
        await setCache(env, CACHE_KEYS.CONFERENCES, conferences, TTL.CONFERENCES)
        return json(conferences)
      }

      // ═══════════════════════════════════════
      // PUBLIC — TESTIMONIALS (KV cached)
      // ═══════════════════════════════════════

      if (path === '/api/testimonials' && method === 'GET') {
        const cached = await getCached(env, CACHE_KEYS.TESTIMONIALS)
        if (cached) return json(cached)
        const testimonials = await getTestimonials(db)
        await setCache(env, CACHE_KEYS.TESTIMONIALS, testimonials, TTL.TESTIMONIALS)
        return json(testimonials)
      }

      // ═══════════════════════════════════════
      // PUBLIC — CONTACT & JOIN
      // ═══════════════════════════════════════

      if (path === '/api/contact' && method === 'POST') {
        const body = await request.json() as any
        if (!body.name || !body.email || !body.subject || !body.message) return err('Missing fields')
        await createContact(db, { id: generateId(), ...body })
        await env.QUEUE.send({ type: 'contact_notification', ...body })
        return json({ success: true })
      }

      if (path === '/api/join' && method === 'POST') {
        const formData = await request.formData()
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const designation = formData.get('designation') as string
        const institute = formData.get('institute') as string
        const country = formData.get('country') as string || 'India'
        const expertise = formData.get('expertise') as string
        const experience = formData.get('experience') as string
        const type = formData.get('type') as string
        const cvFile = formData.get('cv') as File | null

        if (!name || !email || !phone || !designation || !institute || !expertise || !type) return err('Missing fields')

        let cvUrl: string | undefined
        let cvKey: string | undefined

        if (cvFile && cvFile.size > 0) {
          const validation = validateFile(cvFile.type, cvFile.size, 'document')
          if (!validation.valid) return err(validation.error!)
          cvKey = generateStorageKey('cvs', cvFile.name)
          cvUrl = await uploadFile(env, cvKey, await cvFile.arrayBuffer(), cvFile.type)
        }

        await createJoinRequest(db, { id: generateId(), name, email, phone, designation, institute, country, expertise, experience, type, cvUrl, cvKey })
        await env.QUEUE.send({ type: 'join_request', name, email, requestType: type, designation, institute, expertise })
        return json({ success: true })
      }

      // ═══════════════════════════════════════
      // PAYMENT — Razorpay webhook
      // CPU: ~3ms (signature verify via Web Crypto = hardware, not CPU)
      // ═══════════════════════════════════════

      if (path === '/api/payment/webhook' && method === 'POST') {
        const body = await request.text()
        const signature = request.headers.get('x-razorpay-signature') || ''
        const isValid = await verifyWebhookSignature(body, signature, env.RAZORPAY_WEBHOOK_SECRET)
        if (!isValid) return err('Invalid signature', 401)

        const event = JSON.parse(body)
        if (event.event === 'payment_link.paid') {
          const paymentId = event.payload.payment.entity.id
          const paperId = event.payload.payment.entity.notes?.paper_id
          if (paperId) {
            await confirmPayment(db, paperId, paymentId)
            // Invalidate KV cache for published papers
            await invalidateCache(env, CACHE_KEYS.PUBLISHED_PAPERS)
            // Queue notification email
            const paper = await getPaperById(db, paperId)
            if (paper) {
              await env.QUEUE.send({ type: 'status_update', paperId, title: paper.title, authorName: paper.authorName, email: paper.email, status: 'payment_received' })
            }
          }
        }
        return json({ success: true })
      }

      // ═══════════════════════════════════════
      // ADMIN — Protected by Cloudflare Access
      // Cloudflare Access validates JWT before reaching here
      // Zero auth CPU cost on our end
      // ═══════════════════════════════════════

      // Admin — Papers
      if (path === '/api/admin/papers' && method === 'GET') {
        return json(await getAllPapersAdmin(db))
      }

      if (path.match(/^\/api\/admin\/papers\/[^/]+\/status$/) && method === 'PUT') {
        const id = path.split('/')[4]
        const body = await request.json() as any
        const { status, reviewerNotes, adminNotes } = body
        await updatePaperStatus(db, id, status, reviewerNotes, adminNotes)

        // If publishing — invalidate KV cache
        if (status === 'published') {
          await invalidateCache(env, CACHE_KEYS.PUBLISHED_PAPERS)
        }

        const paper = await getPaperById(db, id)
        if (paper) {
          await env.QUEUE.send({ type: 'status_update', paperId: id, title: paper.title, authorName: paper.authorName, email: paper.email, status, reviewerNotes })
        }
        return json({ success: true })
      }

      if (path.match(/^\/api\/admin\/papers\/[^/]+\/fee$/) && method === 'PUT') {
        const id = path.split('/')[4]
        const { fee } = await request.json() as { fee: number }
        await setPublicationFee(db, id, fee * 100) // convert to paise
        return json({ success: true })
      }

      if (path.match(/^\/api\/admin\/papers\/[^/]+\/send-payment-link$/) && method === 'POST') {
        const id = path.split('/')[4]
        const paper = await getPaperById(db, id)
        if (!paper) return err('Paper not found', 404)
        if (!paper.publicationFee) return err('Set publication fee first')

        const link = await createPaymentLink(env, {
          paperId: id, paperTitle: paper.title,
          authorName: paper.authorName, email: paper.email,
          phone: paper.phone, amount: paper.publicationFee,
          callbackUrl: `${env.ENVIRONMENT === 'production' ? 'https://Elsevierresearchjournal.com' : 'http://localhost:3000'}/payment/success`
        })

        await setPaymentLink(db, id, link.id, link.short_url)
        await env.QUEUE.send({ type: 'status_update', paperId: id, title: paper.title, authorName: paper.authorName, email: paper.email, status: 'payment_pending', paymentLink: link.short_url })
        return json({ success: true, paymentLink: link.short_url })
      }

      if (path.match(/^\/api\/admin\/papers\/[^/]+\/publish$/) && method === 'POST') {
        const id = path.split('/')[4]
        const formData = await request.formData()
        const doi = formData.get('doi') as string
        const volume = formData.get('volume') as string
        const issue = formData.get('issue') as string
        const pageNo = formData.get('pageNo') as string
        const pdfFile = formData.get('pdf') as File | null

        let pdfUrl: string | undefined
        let pdfKey: string | undefined

        if (pdfFile && pdfFile.size > 0) {
          pdfKey = generateStorageKey('published', pdfFile.name)
          pdfUrl = await uploadFile(env, pdfKey, await pdfFile.arrayBuffer(), pdfFile.type)
        }

        await publishPaper(db, id, { doi, volume, issue, pageNo, pdfUrl, pdfKey })
        await invalidateCache(env, CACHE_KEYS.PUBLISHED_PAPERS)

        const paper = await getPaperById(db, id)
        if (paper) {
          await env.QUEUE.send({ type: 'status_update', paperId: id, title: paper.title, authorName: paper.authorName, email: paper.email, status: 'published' })
        }
        return json({ success: true })
      }

      // Admin — Members
      if (path === '/api/admin/members' && method === 'GET') {
        return json(await getAllMembersAdmin(db))
      }

      if (path === '/api/admin/members' && method === 'POST') {
        const formData = await request.formData()
        const name = formData.get('name') as string
        const designation = formData.get('designation') as string
        const institute = formData.get('institute') as string
        const country = formData.get('country') as string || 'India'
        const expertise = formData.get('expertise') as string
        const type = formData.get('type') as string
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0
        const photo = formData.get('photo') as File | null

        let photoUrl: string | undefined
        let photoKey: string | undefined
        if (photo && photo.size > 0) {
          const v = validateFile(photo.type, photo.size, 'image')
          if (!v.valid) return err(v.error!)
          photoKey = generateStorageKey('members', photo.name)
          photoUrl = await uploadFile(env, photoKey, await photo.arrayBuffer(), photo.type)
        }

        await createMember(db, { id: generateId(), name, designation, institute, country, expertise, photoUrl, photoKey, type, displayOrder })
        await invalidateCache(env, CACHE_KEYS.EDITORIAL_BOARD, CACHE_KEYS.ADVISORY_BOARD, CACHE_KEYS.REVIEWER_COMMITTEE)
        return json({ success: true })
      }

      if (path.startsWith('/api/admin/members/') && method === 'DELETE') {
        const id = path.split('/')[4]
        await deleteMember(db, id)
        await invalidateCache(env, CACHE_KEYS.EDITORIAL_BOARD, CACHE_KEYS.ADVISORY_BOARD, CACHE_KEYS.REVIEWER_COMMITTEE)
        return json({ success: true })
      }

      // Admin — Conferences
      if (path === '/api/admin/conferences' && method === 'GET') {
        return json(await getAllConferencesAdmin(db))
      }

      if (path === '/api/admin/conferences' && method === 'POST') {
        const formData = await request.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const venue = formData.get('venue') as string
        const date = formData.get('date') as string
        const lastDate = formData.get('lastDate') as string
        const registrationUrl = formData.get('registrationUrl') as string
        const coverFile = formData.get('cover') as File | null

        let coverUrl: string | undefined
        let coverKey: string | undefined
        if (coverFile && coverFile.size > 0) {
          coverKey = generateStorageKey('conferences', coverFile.name)
          coverUrl = await uploadFile(env, coverKey, await coverFile.arrayBuffer(), coverFile.type)
        }

        await createConference(db, { id: generateId(), title, description, venue, date, lastDate, registrationUrl, coverUrl, coverKey })
        await invalidateCache(env, CACHE_KEYS.CONFERENCES)
        return json({ success: true })
      }

      if (path.startsWith('/api/admin/conferences/') && method === 'DELETE') {
        const id = path.split('/')[4]
        await deleteConference(db, id)
        await invalidateCache(env, CACHE_KEYS.CONFERENCES)
        return json({ success: true })
      }

      // Admin — Contacts & Join Requests
      if (path === '/api/admin/contacts' && method === 'GET') {
        return json(await getAllContacts(db))
      }

      if (path.startsWith('/api/admin/contacts/') && method === 'PUT') {
        await markContactRead(db, path.split('/')[4])
        return json({ success: true })
      }

      if (path === '/api/admin/join-requests' && method === 'GET') {
        return json(await getAllJoinRequests(db))
      }

      if (path.startsWith('/api/admin/join-requests/') && method === 'PUT') {
        const id = path.split('/')[4]
        const { status } = await request.json() as { status: string }
        await updateJoinRequestStatus(db, id, status)
        return json({ success: true })
      }

      // Admin — Testimonials
      if (path === '/api/admin/testimonials' && method === 'GET') {
        return json(await getAllTestimonialsAdmin(db))
      }

      if (path === '/api/admin/testimonials' && method === 'POST') {
        const body = await request.json() as any
        await createTestimonial(db, { id: generateId(), ...body })
        await invalidateCache(env, CACHE_KEYS.TESTIMONIALS)
        return json({ success: true })
      }

      if (path.startsWith('/api/admin/testimonials/') && method === 'PUT') {
        const id = path.split('/')[4]
        await updateTestimonial(db, id, await request.json() as any)
        await invalidateCache(env, CACHE_KEYS.TESTIMONIALS)
        return json({ success: true })
      }

      if (path.startsWith('/api/admin/testimonials/') && method === 'DELETE') {
        await deleteTestimonial(db, path.split('/')[4])
        await invalidateCache(env, CACHE_KEYS.TESTIMONIALS)
        return json({ success: true })
      }

      return err('Not found', 404)

    } catch (e) {
      console.error('Worker error:', e)
      return err('Internal server error', 500)
    }
  },

  // ═══════════════════════════════════════
  // QUEUE CONSUMER — Background tasks
  // Fresh CPU budget per batch
  // Email sends = 0ms CPU (network calls)
  // ═══════════════════════════════════════
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      const d = msg.body as any
      try {
        if (d.type === 'submission_confirmation') {
          const { subject, html } = submissionConfirmationEmail({ authorName: d.authorName, paperId: d.paperId, title: d.title })
          await sendEmail(env, d.email, subject, html)
          const { subject: as, html: ah } = adminNewSubmissionEmail({ paperId: d.paperId, title: d.title, authorName: d.authorName, email: d.email, subject: d.subject })
          await sendEmail(env, 'info@Elsevierresearchjournal.com', as, ah)
          msg.ack()
        } else if (d.type === 'status_update') {
          const { subject, html } = statusUpdateEmail({ authorName: d.authorName, paperId: d.paperId, title: d.title, status: d.status, reviewerNotes: d.reviewerNotes, paymentLink: d.paymentLink })
          await sendEmail(env, d.email, subject, html)
          msg.ack()
        } else if (d.type === 'contact_notification') {
          const { subject, html } = contactNotificationEmail(d)
          await sendEmail(env, 'info@Elsevierresearchjournal.com', subject, html)
          msg.ack()
        } else if (d.type === 'join_request') {
          const { subject, html } = joinRequestEmail(d)
          await sendEmail(env, 'info@Elsevierresearchjournal.com', subject, html)
          msg.ack()
        } else {
          msg.ack()
        }
      } catch (e) {
        console.error('Queue error:', e)
        msg.retry()
      }
    }
  }
}

