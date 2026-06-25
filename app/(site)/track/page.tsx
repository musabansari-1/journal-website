'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, Loader, FileText, CreditCard } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review',
  revision_required: 'Revision Required', accepted: 'Accepted',
  payment_pending: 'Payment Pending', payment_received: 'Payment Received',
  published: 'Published', rejected: 'Rejected',
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-700', under_review: 'bg-blue-100 text-blue-700',
  revision_required: 'bg-yellow-100 text-yellow-700', accepted: 'bg-green-100 text-green-700',
  payment_pending: 'bg-orange-100 text-orange-700', payment_received: 'bg-teal-100 text-teal-700',
  published: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700',
}

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

type Paper = {
  id: string; title: string; status: string; reviewerNotes?: string
  subject: string; createdAt: number; updatedAt: number
  doi?: string; volume?: string; issue?: string
  paymentStatus?: string; paymentLinkUrl?: string
}

// Reads ?name= and ?email= from the URL (e.g. homepage mini-form links here).
// useSearchParams() requires a Suspense boundary in Next.js 15 static export,
// so this lookup is isolated into its own tiny component below.
function PrefillFromQuery({ onPrefill }: { onPrefill: (name: string, email: string) => void }) {
  const searchParams = useSearchParams()
  const n = searchParams.get('name') || ''
  const e = searchParams.get('email') || ''
  // Run once on mount with whatever the URL had at load time.
  useState(() => { if (n || e) onPrefill(n, e); return null })
  return null
}

export default function TrackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [papers, setPapers] = useState<Paper[] | null>(null)
  const [searched, setSearched] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(false)
    try {
      const res = await fetch(apiUrl('/api/papers/track'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      setPapers(await res.json())
    } catch {
      setPapers([])
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <>
      <Suspense fallback={null}>
        <PrefillFromQuery onPrefill={(n, e) => { if (n) setName(n); if (e) setEmail(e) }} />
      </Suspense>
      <Navbar />
      <main className="pt-16 min-h-screen bg-brand-50">
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Track Paper Status</h1>
          <p className="font-body text-brand-200">Enter your name and email to check the status of your submission</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <form onSubmit={handleTrack} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <div className="space-y-4">
              <div>
                <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Your Full Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="As entered at submission"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="As entered at submission"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 font-sans font-semibold bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl transition-colors disabled:opacity-50">
                {loading ? <><Loader size={16} className="animate-spin" /> Searching...</> : <><Search size={16} /> Track My Paper</>}
              </button>
            </div>
          </form>

          {searched && papers && (
            papers.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-display text-xl text-gray-500 mb-2">No papers found</h3>
                <p className="font-sans text-sm text-gray-400">Please check your name and email match exactly with your submission.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-brand-600 mb-1">{p.id}</p>
                          <h3 className="font-display text-lg font-semibold text-brand-900 leading-tight">{p.title}</h3>
                          <p className="font-sans text-sm text-gray-500 mt-1">{p.subject}</p>
                        </div>
                        <span className={`font-sans text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[p.status] || p.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                        <div><span className="text-gray-400">Submitted: </span><span className="text-gray-700">{formatDate(p.createdAt)}</span></div>
                        <div><span className="text-gray-400">Last Updated: </span><span className="text-gray-700">{formatDate(p.updatedAt)}</span></div>
                      </div>
                      {p.doi && <div className="mt-3 font-sans text-sm"><span className="text-gray-400">DOI: </span><span className="text-brand-700 font-mono">{p.doi}</span></div>}
                      {p.volume && <div className="font-sans text-sm mt-1"><span className="text-gray-400">Volume: </span><span className="text-gray-700">{p.volume}, Issue {p.issue}</span></div>}
                      {p.reviewerNotes && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="font-sans text-xs font-semibold text-yellow-700 mb-1">Reviewer Feedback</p>
                          <p className="font-body text-sm text-yellow-800">{p.reviewerNotes}</p>
                        </div>
                      )}
                      {p.paymentLinkUrl && p.paymentStatus === 'pending' && (
                        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-sans text-sm font-semibold text-orange-800">Publication Fee Required</p>
                            <p className="font-sans text-xs text-orange-600 mt-0.5">Complete payment to proceed with publication</p>
                          </div>
                          <a href={p.paymentLinkUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-sans text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors shrink-0">
                            <CreditCard size={14} /> Pay Now
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
