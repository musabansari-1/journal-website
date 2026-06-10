'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'Is submission free?', a: 'Yes, paper submission is completely free. Publication fee is charged only after your paper is accepted.' },
  { q: 'What is the publication fee?', a: 'Indian authors: ₹1,000 per paper. International authors: $30 USD. Payment is made after acceptance via a secure Razorpay payment link sent to your email.' },
  { q: 'How long does the review process take?', a: 'Our review process typically takes 2–5 working days. We aim for fast, quality peer review by subject experts.' },
  { q: 'What file formats are accepted for submission?', a: 'We accept .doc, .docx, .odt, and .pdf formats. Maximum file size is 20MB.' },
  { q: 'How do I track my paper status?', a: 'Visit the Track Paper page and enter the name and email used during submission. Your Paper ID (e.g. NRJ-2024-001) will also be emailed to you.' },
  { q: 'Will my paper receive a DOI?', a: 'Yes. Every published paper receives a unique Digital Object Identifier (DOI) for permanent citation and discoverability.' },
  { q: 'Is the journal open access?', a: 'Yes. All published papers are freely accessible to anyone worldwide without subscription or paywall.' },
  { q: 'Can I submit a paper in Hindi or regional languages?', a: 'Currently we accept papers in English only to ensure international peer review quality.' },
  { q: 'What is the plagiarism policy?', a: 'All papers are checked for plagiarism. Papers with similarity index above 10% (excluding references) will be rejected. We use industry-standard plagiarism detection tools.' },
  { q: 'Can I submit a paper with multiple authors?', a: 'Yes. You can add co-authors in the submission form. The corresponding author must handle all communication with the journal.' },
  { q: 'What happens after payment?', a: 'After payment is confirmed, your paper is formatted and published in the next issue with a DOI. You will receive a publication confirmation email.' },
  { q: 'Can I withdraw my paper after submission?', a: 'You may withdraw before acceptance at no charge. After acceptance and payment, withdrawal is not permitted.' },
  { q: 'How do I join as a reviewer or editor?', a: 'Visit the Join as Editor/Reviewer page and fill the application form. Our editorial team will review your credentials and respond within 5 working days.' },
]

export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <><Navbar />
    <main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
        <p className="font-body text-brand-200">Everything you need to know about publishing with us</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
              <span className="font-sans text-sm font-semibold text-brand-900 pr-4">{faq.q}</span>
              <ChevronDown size={18} className={`text-brand-600 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5 border-t border-gray-50">
                <p className="font-body text-sm text-gray-700 leading-relaxed pt-4">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
    <Footer /></>
  )
}
