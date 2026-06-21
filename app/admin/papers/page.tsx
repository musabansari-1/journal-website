'use client'
import { useState, useEffect } from 'react'
import { Search, ChevronDown, FileText, Send, DollarSign, Loader } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

const STATUSES = ['submitted','under_review','revision_required','accepted','payment_pending','payment_received','published','rejected']

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

type Paper = {
  id: string; title: string; authorName: string; institute: string; subject: string
  email: string; phone: string; country: string; status: string; abstract: string
  keywords: string; fileUrl?: string; reviewerNotes?: string; adminNotes?: string
  publicationFee?: number; paymentStatus?: string; paymentLinkUrl?: string; createdAt: number
}

type NotesMap = Record<string, string>

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [filtered, setFiltered] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [notes, setNotes] = useState<NotesMap>({})
  const [adminNotes, setAdminNotes] = useState<NotesMap>({})
  const [fees, setFees] = useState<NotesMap>({})

  const load = () => {
    setLoading(true)
    fetch(apiUrl('/api/admin/papers'))
      .then(r => r.json())
      .then((d: unknown) => { setPapers(d as Paper[]); setFiltered(d as Paper[]); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    let r = papers
    if (statusFilter !== 'all') r = r.filter(p => p.status === statusFilter)
    if (search) r = r.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authorName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search)
    )
    setFiltered(r)
  }, [search, statusFilter, papers])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await fetch(apiUrl(`/api/admin/papers/${id}/status`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewerNotes: notes[id], adminNotes: adminNotes[id] })
    })
    setUpdating(null)
    load()
  }

  const setFee = async (id: string) => {
    const fee = parseFloat(fees[id] || '0')
    if (!fee) { alert('Enter a valid fee amount'); return }
    await fetch(apiUrl(`/api/admin/papers/${id}/fee`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fee })
    })
    alert('Fee set successfully')
  }

  const sendPaymentLink = async (id: string) => {
    setUpdating(id)
    const res = await fetch(apiUrl(`/api/admin/papers/${id}/send-payment-link`), { method: 'POST' })
    const data = await res.json() as { success: boolean; paymentLink?: string; error?: string }
    setUpdating(null)
    if (data.success) alert(`Payment link sent!\nLink: ${data.paymentLink}`)
    else alert('Failed: ' + (data.error || 'Unknown error'))
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Paper Submissions</h2>
        <p className="font-sans text-sm text-gray-500">{papers.length} total submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search papers..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`font-sans text-xs font-semibold px-3 py-2 rounded-xl capitalize transition-all ${statusFilter === s ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
              {s === 'all' ? 'All' : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Loader size={24} className="animate-spin text-brand-600 mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-sans text-gray-400">No papers found</p>
          </div>
        ) : filtered.map(paper => (
          <div key={paper.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="flex items-start justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === paper.id ? null : paper.id)}
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs text-brand-700">{paper.id}</span>
                  <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[paper.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[paper.status] || paper.status}
                  </span>
                  {paper.paymentStatus === 'pending' && (
                    <span className="font-sans text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">💳 Payment Due</span>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-gray-900 truncate">{paper.title}</h3>
                <p className="font-sans text-sm text-gray-500">{paper.authorName} · {paper.institute} · {paper.subject}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-sans text-xs text-gray-400">{new Date(paper.createdAt).toLocaleDateString('en-IN')}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === paper.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {expanded === paper.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Author Contact</p>
                    <p className="text-gray-700">{paper.email}</p>
                    <p className="text-gray-700">{paper.phone}</p>
                    <p className="text-gray-500">{paper.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Keywords</p>
                    <p className="text-gray-700">{paper.keywords}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Files</p>
                    {paper.fileUrl && (
                      <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline text-sm">
                        📄 Download Paper
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wide mb-2">Abstract</p>
                  <p className="font-body text-sm text-gray-700 bg-white rounded-xl p-4 border border-gray-100 leading-relaxed">{paper.abstract}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-medium text-gray-600 mb-1.5 block">Reviewer Notes (sent to author)</label>
                    <textarea rows={3} value={notes[paper.id] ?? paper.reviewerNotes ?? ''}
                      onChange={e => setNotes(p => ({ ...p, [paper.id]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none bg-white" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-medium text-gray-600 mb-1.5 block">Internal Admin Notes</label>
                    <textarea rows={3} value={adminNotes[paper.id] ?? paper.adminNotes ?? ''}
                      onChange={e => setAdminNotes(p => ({ ...p, [paper.id]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none bg-white" />
                  </div>
                </div>

                {['accepted', 'payment_pending', 'payment_received'].includes(paper.status) && (
                  <div className="flex flex-wrap items-end gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div>
                      <label className="font-sans text-xs font-medium text-orange-800 mb-1.5 block">Publication Fee (₹)</label>
                      <input type="number"
                        value={fees[paper.id] ?? (paper.publicationFee ? String(paper.publicationFee / 100) : '1000')}
                        onChange={e => setFees(p => ({ ...p, [paper.id]: e.target.value }))}
                        className="border border-orange-200 rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-400 bg-white w-32" />
                    </div>
                    <button onClick={() => setFee(paper.id)}
                      className="font-sans text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-1.5">
                      <DollarSign size={14} /> Set Fee
                    </button>
                    {paper.status === 'accepted' && paper.publicationFee && (
                      <button onClick={() => sendPaymentLink(paper.id)} disabled={updating === paper.id}
                        className="font-sans text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-xl hover:bg-brand-800 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                        {updating === paper.id
                          ? <><Loader size={14} className="animate-spin" /> Sending...</>
                          : <><Send size={14} /> Send Payment Link</>}
                      </button>
                    )}
                    {paper.paymentLinkUrl && (
                      <a href={paper.paymentLinkUrl} target="_blank" rel="noopener noreferrer"
                        className="font-sans text-xs text-brand-600 underline">View Payment Link</a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  {STATUSES.filter(s => s !== paper.status).map(s => (
                    <button key={s} onClick={() => updateStatus(paper.id, s)} disabled={updating === paper.id}
                      className={`font-sans text-xs font-semibold px-3 py-2 rounded-xl transition-all border capitalize ${STATUS_COLORS[s] || 'bg-gray-100 text-gray-700'} hover:opacity-80 disabled:opacity-40`}>
                      → {STATUS_LABELS[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
