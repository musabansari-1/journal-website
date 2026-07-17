const B = '#1e40af'
const BL = '#dbeafe'
const footer = `<div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;color:#888;font-size:12px;"><p>Elsevier India (OPC) Pvt Ltd | Rampur, UP 244924 | +91-9557475906</p></div>`
const wrap = (c: string) => `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 20px;color:#1a1a2e;"><div style="border-bottom:3px solid ${B};padding-bottom:16px;margin-bottom:24px;"><h2 style="color:${B};margin:0;font-size:20px;">Elsevier Multidisciplinary International Research Journal</h2><p style="color:#666;margin:4px 0 0;font-size:12px;">E-ISSN: 3108-1452</p></div>${c}${footer}</div>`

export function submissionConfirmationEmail(d: { authorName: string; paperId: string; title: string }) {
  return { subject: `Submission Confirmed — ${d.paperId}`, html: wrap(`<h3>Submission Received</h3><p>Dear ${d.authorName},</p><p>Your paper has been submitted successfully.</p><div style="background:${BL};border-left:4px solid ${B};padding:14px;margin:16px 0;border-radius:4px;"><p style="margin:0 0 6px"><strong>Paper ID:</strong> <span style="font-family:monospace;color:${B};">${d.paperId}</span></p><p style="margin:0 0 6px"><strong>Title:</strong> ${d.title}</p><p style="margin:0"><strong>Status:</strong> Under Review</p></div><p>Save your Paper ID to track status. We review within <strong>2–5 working days</strong>.</p>`) }
}

export function statusUpdateEmail(d: { authorName: string; paperId: string; title: string; status: string; reviewerNotes?: string; paymentLink?: string }) {
  const labels: Record<string, string> = { submitted: 'Submitted', under_review: 'Under Review', revision_required: 'Revision Required', accepted: 'Accepted', payment_pending: 'Payment Required', payment_received: 'Payment Received', published: 'Published', rejected: 'Not Accepted' }
  const msgs: Record<string, string> = {
    under_review: 'Your paper is currently under expert review.',
    revision_required: 'Please review the feedback and resubmit.',
    accepted: 'Congratulations! Your paper has been accepted.',
    payment_pending: `Please complete the publication fee payment.${d.paymentLink ? `<br/><br/><a href="${d.paymentLink}" style="background:${B};color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;display:inline-block;">Pay Now</a>` : ''}`,
    payment_received: 'Payment received. Your paper will be published shortly.',
    published: 'Your paper is now live! Share it with your network.',
    rejected: 'Unfortunately your paper does not meet our criteria at this time.',
  }
  return { subject: `Status Update: ${labels[d.status] || d.status} — ${d.paperId}`, html: wrap(`<h3>Paper Status Update</h3><p>Dear ${d.authorName},</p><div style="background:${BL};border-left:4px solid ${B};padding:14px;margin:16px 0;border-radius:4px;"><p style="margin:0 0 6px"><strong>Paper ID:</strong> ${d.paperId}</p><p style="margin:0 0 6px"><strong>Title:</strong> ${d.title}</p><p style="margin:0"><strong>Status:</strong> ${labels[d.status] || d.status}</p></div><p>${msgs[d.status] || ''}</p>${d.reviewerNotes ? `<div style="background:#fefce8;border:1px solid #fef08a;padding:14px;border-radius:4px;margin:12px 0;"><strong>Reviewer Feedback:</strong><p>${d.reviewerNotes}</p></div>` : ''}`) }
}

export function adminNewSubmissionEmail(d: { paperId: string; title: string; authorName: string; email: string; subject: string }) {
  return { subject: `New Submission — ${d.paperId}`, html: wrap(`<h3>New Paper Submitted</h3><p><strong>ID:</strong> ${d.paperId}</p><p><strong>Title:</strong> ${d.title}</p><p><strong>Author:</strong> ${d.authorName} (${d.email})</p><p><strong>Subject:</strong> ${d.subject}</p><p><a href="https://Elsevierresearchjournal.com/admin/papers" style="color:${B};">Review in Admin →</a></p>`) }
}

export function contactNotificationEmail(d: { name: string; email: string; phone?: string; subject: string; message: string }) {
  return { subject: `New Contact: ${d.subject}`, html: wrap(`<h3>Contact Form</h3><p><strong>Name:</strong> ${d.name}</p><p><strong>Email:</strong> ${d.email}</p>${d.phone ? `<p><strong>Phone:</strong> ${d.phone}</p>` : ''}<p><strong>Subject:</strong> ${d.subject}</p><p><strong>Message:</strong></p><p style="background:#f8fafc;padding:14px;border-radius:4px;">${d.message}</p>`) }
}

export function joinRequestEmail(d: { name: string; type: string; designation: string; institute: string; expertise: string }) {
  return { subject: `New ${d.type} Application — ${d.name}`, html: wrap(`<h3>New ${d.type === 'editor' ? 'Editor' : 'Reviewer'} Application</h3><p><strong>Name:</strong> ${d.name}</p><p><strong>Designation:</strong> ${d.designation}</p><p><strong>Institute:</strong> ${d.institute}</p><p><strong>Expertise:</strong> ${d.expertise}</p><p><a href="https://Elsevierresearchjournal.com/admin/contacts" style="color:${B};">View in Admin →</a></p>`) }
}

