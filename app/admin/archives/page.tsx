'use client'
import { useState, useEffect, useRef } from 'react'
import { Loader, Upload, FileText } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type PublishForm = { doi: string; volume: string; issue: string; pageNo: string }

export default function AdminArchivesPage() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, PublishForm>>({})
  const [pdfs, setPdfs] = useState<Record<string, File>>({})
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const load = () => {
    setLoading(true)
    fetch(apiUrl('/api/admin/papers'))
      .then(r => r.json())
      .then(d => {
        setPapers((d as any[]).filter((p: any) => ['payment_received', 'published'].includes(p.status)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const getForm = (id: string): PublishForm =>
    forms[id] || { doi: '', volume: '', issue: '', pageNo: '' }

  const setField = (id: string, field: keyof PublishForm, val: string) =>
    setForms(p => ({ ...p, [id]: { ...getForm(id), [field]: val } }))

  const publish = async (id: string) => {
    setPublishing(id)
    const fd = new FormData()
    const f = getForm(id)
    Object.entries(f).forEach(([k, v]) => fd.append(k, v))
    if (pdfs[id]) fd.append('pdf', pdfs[id])
    await fetch(apiUrl(`/api/admin/papers/${id}/publish`), { method: 'POST', body: fd })
    setPublishing(null)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Archives Management</h2>
        <p className="font-sans text-sm text-gray-500">Papers ready to publish and already published papers</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Loader size={24} className="animate-spin text-brand-600 mx-auto" />
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-sans text-gray-400">No papers ready for publishing</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-brand-700 mb-1">{p.id}</p>
                  <h3 className="font-display text-lg font-semibold text-gray-900">{p.title}</h3>
                  <p className="font-sans text-sm text-gray-500">{p.authorName} · {p.subject}</p>
                </div>
                <span className={`font-sans text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                  {p.status === 'published' ? 'Published' : 'Ready to Publish'}
                </span>
              </div>

              {p.status === 'payment_received' && (
                <div className="bg-brand-50 rounded-xl p-5 space-y-4">
                  <p className="font-sans text-sm font-semibold text-brand-900">Publish This Paper</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['doi', 'volume', 'issue', 'pageNo'] as (keyof PublishForm)[]).map(field => (
                      <div key={field}>
                        <label className="font-sans text-xs text-gray-500 mb-1 block capitalize">{field === 'pageNo' ? 'Page No' : field.toUpperCase()}</label>
                        <input
                          value={getForm(p.id)[field]}
                          onChange={e => setField(p.id, field, e.target.value)}
                          placeholder={field}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="file" accept=".pdf"
                      ref={el => { fileRefs.current[p.id] = el }}
                      onChange={e => { if (e.target.files?.[0]) setPdfs(prev => ({ ...prev, [p.id]: e.target.files![0] })) }}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileRefs.current[p.id]?.click()}
                      className="flex items-center gap-2 font-sans text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Upload size={14} />
                      {pdfs[p.id] ? pdfs[p.id].name : 'Upload Final PDF'}
                    </button>
                    <button
                      onClick={() => publish(p.id)}
                      disabled={publishing === p.id}
                      className="flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-5 py-2 rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-colors"
                    >
                      {publishing === p.id
                        ? <><Loader size={14} className="animate-spin" /> Publishing...</>
                        : '✓ Publish Now'}
                    </button>
                  </div>
                </div>
              )}

              {p.status === 'published' && (
                <div className="text-sm font-sans text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                  {p.doi && <p>DOI: <span className="font-mono text-brand-700">{p.doi}</span></p>}
                  {p.volume && <p>Vol. {p.volume}, Issue {p.issue}{p.pageNo ? `, pp. ${p.pageNo}` : ''}</p>}
                  {p.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                      View Published PDF →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
