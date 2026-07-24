'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  FileText, Search, CheckCircle, Globe, Award, Clock,
  Users, ArrowRight, Shield, Star, Download, ChevronDown
} from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type Paper = {
  id: string; title: string; authorName: string; subject: string
  doi?: string; volume?: string; issue?: string; pdfUrl?: string; createdAt: number
}

type Testimonial = {
  id: string; authorName: string; designation: string
  institute: string; content: string; rating: number
}

const INDEXING_PARTNERS = [
  { name: 'CrossRef', desc: 'DOI Registration' },
  { name: 'Google Scholar', desc: 'Academic Search' },
  { name: 'ResearchGate', desc: 'Research Network' },
  { name: 'Academia.edu', desc: 'Academic Platform' },
  { name: 'Index Copernicus', desc: 'Journal Indexing' },
  { name: 'ROAD', desc: 'Open Access' },
]

export default function HomePage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  useEffect(() => {
    fetch(apiUrl('/api/papers/published'))
      .then(r => r.json())
      .then((d: unknown) => setPapers((d as Paper[]).slice(0, 6)))
      .catch(() => {})

    fetch(apiUrl('/api/testimonials'))
      .then(r => r.json())
      .then((d: unknown) => setTestimonials(d as Testimonial[]))
      .catch(() => {})
  }, [])

  const steps = [
    { n: '01', icon: FileText, title: 'Submit Your Manuscript', desc: 'Easily upload your research paper through our submission form with all required details and documents.', href: '/submit', cta: 'Submit' },
    { n: '02', icon: Users, title: 'Peer Review', desc: 'Our experienced reviewers assess the paper\'s quality, relevance, and originality through a double-blind review process.', href: '/track', cta: 'Track Paper' },
    { n: '03', icon: CheckCircle, title: 'Revisions & Approval', desc: 'Authors receive reviewer feedback, make suggested changes, and resubmit the improved version for final approval.', href: '/track', cta: 'Track Paper' },
    { n: '04', icon: Globe, title: 'Publish & Share', desc: 'Once approved, your research is published online and shared with global audiences for maximum visibility and impact.', href: '/contact', cta: 'Contact Us' },
  ]

  const features = [
    { icon: Clock, title: 'Fast & Transparent Process', desc: 'Review results within 2–5 days' },
    { icon: Users, title: 'Double-Blind Peer Review', desc: 'Quality and impartial feedback' },
    { icon: Globe, title: 'Open-Access Visibility', desc: 'Free access to all published papers' },
    { icon: Award, title: 'Indexed & Recognized', desc: 'CrossRef DOI for every paper' },
    { icon: Shield, title: 'Personal Support', desc: 'Easy communication via email & phone' },
    { icon: CheckCircle, title: 'Fast Publication', desc: 'From submission to published in days' },
  ]

  const faqs = [
    { q: 'Is submission free?', a: 'Yes, paper submission is completely free. Publication fee is charged only after your paper is accepted.' },
    { q: 'What is the publication fee?', a: 'Indian authors: ₹1,000 per paper. International authors: $30 USD. Payment is made after acceptance via a secure Razorpay payment link sent to your email.' },
    { q: 'How long does the review process take?', a: 'Our review process typically takes 2–5 working days.' },
    { q: 'Will my paper receive a DOI?', a: 'Yes. Every published paper receives a CrossRef Digital Object Identifier (DOI) for permanent citation and discoverability.' },
    { q: 'How do I track my paper status?', a: 'Visit the Track Paper page and enter the name and email used during submission.' },
  ]

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <Navbar />
      <main>

        {/* ─── HERO ─── */}
        <section className="min-h-[90vh] bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #60a5fa 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-20 right-10 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 bg-gold-500/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-700/40 border border-brand-500/30 rounded-full px-4 py-2 mb-8">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-sans text-sm text-brand-200">Open Access Journal</span>
                </div>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  Welcome To
                </h1>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-brand-300 leading-tight mb-6">
                  Elsevier Multidisciplinary International Research Journal
                </h2>
                <p className="font-body text-lg text-brand-200 leading-relaxed mb-8 max-w-xl">
                  Join a trusted platform for publishing original research papers, review articles, and case studies. We support authors with quick peer review, expert editorial feedback, and global visibility.
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {['Open-access online visibility', 'Double-Blind Peer Review', 'Indexed & Recognized'].map(f => (
                    <span key={f} className="flex items-center gap-1.5 font-sans text-xs font-medium bg-brand-700/40 text-brand-200 border border-brand-600/30 px-3 py-1.5 rounded-full">
                      <CheckCircle size={12} className="text-green-400" /> {f}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/submit" className="flex items-center gap-2 font-sans font-semibold bg-white text-brand-800 px-8 py-4 rounded-full hover:bg-brand-50 transition-all shadow-lg group">
                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="tel:+917302342998" className="flex items-center gap-2 font-sans font-semibold border border-brand-400 text-white px-8 py-4 rounded-full hover:bg-brand-700 transition-all">
                    Call Us +91-7302342998
                  </a>
                </div>
              </div>

              {/* Track paper card */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
                <h3 className="font-display text-2xl font-semibold text-white mb-2">Track Your Paper</h3>
                <p className="font-sans text-sm text-brand-300 mb-6">Enter your details to check submission status</p>
                <TrackMiniForm />
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="font-sans text-sm text-brand-300 mb-3">Ready to publish your research?</p>
                  <Link href="/submit" className="font-sans text-sm font-semibold text-white underline underline-offset-4 hover:text-brand-300 transition-colors">
                    Submit a New Paper →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="bg-brand-800 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { n: '2–5 Days', l: 'Fast & Transparent Review' },
                { n: 'Double-Blind', l: 'Peer Review Process' },
                { n: 'Personal', l: 'Support via Email & Phone' },
                { n: 'CrossRef DOI', l: 'For Every Published Paper' },
              ].map(s => (
                <div key={s.l}>
                  <div className="font-display text-xl font-bold text-brand-300 mb-1">{s.n}</div>
                  <div className="font-sans text-xs text-brand-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase">About Us</span>
                <h2 className="font-display text-4xl font-bold text-brand-900 mt-3 mb-6">
                  Elsevier Multidisciplinary International Research Journal
                </h2>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  At <strong>Elsevier Multidisciplinary International Research Journal</strong>, we are dedicated to promoting high-quality, peer-reviewed research across multiple disciplines. Our mission is to create a platform where scholars, educators, and researchers can share their innovations and findings with a global academic community.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-6">
                  Our journal ensures ethical publishing, fast peer review, and wide visibility to help authors gain academic recognition and inspire future research.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    'Double-Blind Peer Review', 'Multidisciplinary Scope',
                    'Rapid Response & Publication', 'Indexed & Recognized',
                    'DOI Allocation', 'Open-access visibility',
                    'Wider Reach', 'Affordable Publication Fees',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 font-sans text-sm text-gray-700">
                      <CheckCircle size={14} className="text-brand-600 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <Link href="/about" className="inline-flex items-center gap-2 font-sans font-semibold text-brand-700 hover:text-brand-900 transition-colors">
                  More About Us <ArrowRight size={16} />
                </Link>
              </div>

              {/* Founder quote */}
              <div className="space-y-6">
                <div className="bg-brand-50 rounded-3xl p-8 border border-brand-100">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-brand-200 flex items-center justify-center shrink-0">
                      <span className="font-display font-bold text-brand-700 text-2xl">A</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-brand-900 text-lg">Dr. Ajay Gautam</p>
                      <p className="font-sans text-sm text-brand-600">Founder</p>
                    </div>
                  </div>
                  <blockquote className="font-body text-gray-700 italic leading-relaxed">
                    "Publishing here gave my work the reach it deserved. The review quality was commendable."
                  </blockquote>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[['500+', 'Papers Published'], ['16', 'Disciplines'], ['2–5 Days', 'Review Time']].map(([n, l]) => (
                    <div key={l} className="bg-white rounded-2xl p-4 text-center border border-brand-100 shadow-sm">
                      <div className="font-display text-2xl font-bold text-brand-700 mb-1">{n}</div>
                      <div className="font-sans text-xs text-gray-500">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── INDEXING PARTNERS ─── */}
        <section className="py-16 bg-brand-50 border-y border-brand-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase mb-2">Indexing & Citations</p>
            <h2 className="font-display text-3xl font-bold text-brand-900 mb-3">
              CrossRef DOI is allotted to all published papers
            </h2>
            <p className="font-body text-gray-600 mb-10">Indexed by Google Scholar and many other research databases</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {INDEXING_PARTNERS.map(p => (
                <div key={p.name} className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-200 transition-colors">
                    <Globe size={20} className="text-brand-700" />
                  </div>
                  <p className="font-sans text-sm font-bold text-brand-900 mb-1">{p.name}</p>
                  <p className="font-sans text-xs text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PUBLICATION PROCESS ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase">Process</span>
              <h2 className="font-display text-4xl font-bold text-brand-900 mt-3">Publication Procedure</h2>
              <p className="font-body text-gray-600 mt-3 max-w-2xl mx-auto">
                Submit your paper, get it peer-reviewed, revise if needed, and get published with global visibility and DOI indexing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={s.n} className="relative text-center group">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-brand-100 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-brand-700 group-hover:bg-brand-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-200 transition-colors">
                      <s.icon size={26} className="text-white" />
                    </div>
                    <div className="font-sans text-xs font-bold text-brand-400 mb-2">{s.n}</div>
                    <h3 className="font-display text-lg font-semibold text-brand-900 mb-3">{s.title}</h3>
                    <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{s.desc}</p>
                    <Link href={s.href} className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                      {s.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US ─── */}
        <section className="py-20 bg-brand-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-brand-900">Why Choose Elsevier?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (
                <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center mb-5 transition-colors">
                    <f.icon size={22} className="text-brand-700" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-brand-900 mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LATEST PUBLISHED PAPERS ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase">Latest</span>
                <h2 className="font-display text-4xl font-bold text-brand-900 mt-2">Published Research Papers</h2>
              </div>
              <Link href="/archives" className="hidden sm:flex items-center gap-2 font-sans text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {papers.length === 0 ? (
              <div className="text-center py-16 bg-brand-50 rounded-3xl border border-brand-100">
                <FileText size={48} className="text-brand-200 mx-auto mb-4" />
                <h3 className="font-display text-xl text-brand-400 mb-2">Papers will appear here once published</h3>
                <p className="font-sans text-sm text-gray-400">Be the first to submit your research</p>
                <Link href="/submit" className="inline-flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-6 py-3 rounded-full hover:bg-brand-800 transition-colors mt-6">
                  Submit Your Paper
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map(paper => (
                  <div key={paper.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-sans text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">{paper.subject}</span>
                        {paper.volume && (
                          <span className="font-sans text-xs text-gray-400">Vol. {paper.volume}</span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-semibold text-brand-900 leading-tight mb-3 line-clamp-3 group-hover:text-brand-700 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="font-sans text-sm text-gray-600 mb-1">{paper.authorName}</p>
                      {paper.doi && (
                        <p className="font-mono text-xs text-gray-400 mb-3">DOI: {paper.doi}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="font-sans text-xs text-gray-400">{formatDate(paper.createdAt)}</span>
                        {paper.pdfUrl && (
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 font-sans text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                            <Download size={13} /> PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link href="/archives" className="inline-flex items-center gap-2 font-sans font-semibold border-2 border-brand-700 text-brand-700 px-8 py-3 rounded-full hover:bg-brand-700 hover:text-white transition-all">
                View All Published Papers <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-brand-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <span className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase">Testimonial</span>
                <h2 className="font-display text-4xl font-bold text-brand-900 mt-3">What Our Authors Say</h2>
                <p className="font-body text-gray-600 mt-3 max-w-2xl mx-auto">
                  Researchers across disciplines trust Elsevier Journal for its fast, fair, and reliable publication process.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                      ))}
                    </div>
                    <p className="font-body text-gray-700 italic leading-relaxed mb-5">"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-brand-700">{t.authorName[0]}</span>
                      </div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-brand-900">{t.authorName}</p>
                        <p className="font-sans text-xs text-gray-500">{t.designation}, {t.institute}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── FAQ ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-sans text-sm font-semibold text-brand-600 tracking-widest uppercase">FAQ</span>
              <h2 className="font-display text-4xl font-bold text-brand-900 mt-3">Common Inquiries</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-brand-50 rounded-2xl border border-brand-100 overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-100 transition-colors"
                  >
                    <span className="font-sans text-sm font-semibold text-brand-900 pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`text-brand-600 shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-6 pb-5 border-t border-brand-100">
                      <p className="font-body text-sm text-gray-700 leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/faqs" className="font-sans text-sm font-semibold text-brand-700 hover:text-brand-900 underline underline-offset-4 transition-colors">
                View all FAQs →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 bg-brand-800">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Publish?</h2>
            <p className="font-body text-brand-200 mb-8 text-lg">
              Join our global community of scholars. Submit your research paper today and gain the recognition your work deserves.
            </p>
            <Link href="/submit" className="inline-flex items-center gap-2 font-sans font-semibold bg-white text-brand-800 px-10 py-4 rounded-full hover:bg-brand-50 transition-colors shadow-xl">
              Publish Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

function TrackMiniForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-3">
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Your Full Name"
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-sans text-sm text-white placeholder-brand-400 focus:outline-none focus:border-brand-400 transition-colors"
      />
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-sans text-sm text-white placeholder-brand-400 focus:outline-none focus:border-brand-400 transition-colors"
      />
      <Link
        href={`/track?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`}
        className="w-full flex items-center justify-center gap-2 font-sans font-semibold bg-brand-500 hover:bg-brand-400 text-white py-3 rounded-xl transition-colors"
      >
        <Search size={16} /> Track Paper
      </Link>
    </div>
  )
}

