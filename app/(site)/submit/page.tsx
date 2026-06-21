'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Upload, CheckCircle, Loader, FileText } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

const SUBJECTS = [
  'Arts & Humanities','Commerce & Management','Education',
  'Engineering & Technology','Environmental Science','Law',
  'Library Science','Literature & Linguistics','Mathematics',
  'Medical & Health Sciences','Political Science','Psychology',
  'Science','Social Science','Sociology','Other'
]

type FormState = {
  title: string; abstract: string; keywords: string; subject: string
  authorName: string; coAuthors: string; designation: string
  institute: string; email: string; phone: string; country: string
}

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({
    title: '', abstract: '', keywords: '', subject: 'Arts & Humanities',
    authorName: '', coAuthors: '', designation: '', institute: '',
    email: '', phone: '', country: 'India'
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; paperId?: string; error?: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { alert('Please upload your paper file'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('file', file)
    try {
      const res = await fetch(apiUrl('/api/papers/submit'), { method: 'POST', body: fd })
      const data = await res.json() as { success: boolean; paperId?: string; error?: string }
      setResult(data)
    } catch {
      setResult({ success: false, error: 'Submission failed. Please try again.' })
    }
    setLoading(false)
  }

  if (result?.success) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-brand-50 pt-16">
        <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-brand-900 mb-3">Submitted Successfully!</h2>
          <p className="font-sans text-gray-600 mb-3">Your paper has been submitted for peer review.</p>
          <div className="bg-brand-50 rounded-2xl p-5 mb-6">
            <p className="font-sans text-sm text-gray-500 mb-1">Your Paper ID</p>
            <p className="font-display text-2xl font-bold text-brand-700">{result.paperId}</p>
            <p className="font-sans text-xs text-gray-500 mt-2">Save this ID to track your paper status</p>
          </div>
          <p className="font-sans text-sm text-gray-500">A confirmation email has been sent to your registered email address.</p>
        </div>
      </div>
      <Footer />
    </>
  )

  const textFields: { key: keyof FormState; label: string; type: string; full?: boolean; placeholder?: string }[] = [
    { key: 'authorName', label: 'Full Name (Main Author) *', type: 'text' },
    { key: 'coAuthors', label: 'Co-Authors (if any)', type: 'text', full: true, placeholder: 'Separate names with commas' },
    { key: 'designation', label: 'Designation *', type: 'text' },
    { key: 'institute', label: 'University / Institute *', type: 'text', full: true },
    { key: 'email', label: 'Email Address *', type: 'email' },
    { key: 'phone', label: 'Phone Number *', type: 'tel' },
    { key: 'country', label: 'Country *', type: 'text' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Submit Your Research Paper</h1>
          <p className="font-body text-brand-200">Fill all details carefully. You will receive a Paper ID after submission.</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paper Details */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-900 mb-6">Paper Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Paper Title *</label>
                  <input required value={form.title} onChange={e => set('title', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500"
                    placeholder="Full title of your research paper" />
                </div>
                <div>
                  <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">
                    Abstract * <span className="text-gray-400 font-normal">(150–300 words)</span>
                  </label>
                  <textarea required rows={5} value={form.abstract} onChange={e => set('abstract', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none"
                    placeholder="Brief summary of your research..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">
                      Keywords * <span className="text-gray-400 font-normal">(comma separated)</span>
                    </label>
                    <input required value={form.keywords} onChange={e => set('keywords', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500"
                      placeholder="keyword1, keyword2, keyword3" />
                  </div>
                  <div>
                    <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Subject Area *</label>
                    <select required value={form.subject} onChange={e => set('subject', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500 bg-white">
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Details */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-900 mb-6">Author Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {textFields.map(f => (
                  <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                    <label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      required={f.label.includes('*')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-900 mb-2">Upload Paper *</h2>
              <p className="font-sans text-sm text-gray-500 mb-6">Accepted formats: .doc, .docx, .odt, .pdf | Max size: 20MB</p>
              <input ref={fileRef} type="file" accept=".doc,.docx,.odt,.pdf"
                onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
              {file ? (
                <div className="flex items-center gap-4 p-5 bg-brand-50 rounded-xl border border-brand-200">
                  <FileText size={32} className="text-brand-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-brand-900 truncate">{file.name}</p>
                    <p className="font-sans text-xs text-brand-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="font-sans text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-brand-200 rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
                  <Upload size={32} className="text-brand-400" />
                  <div className="text-center">
                    <p className="font-sans text-sm font-medium text-brand-700">Click to upload your paper</p>
                    <p className="font-sans text-xs text-gray-400 mt-1">.doc, .docx, .odt or .pdf</p>
                  </div>
                </button>
              )}
            </div>

            {result?.error && <p className="font-sans text-sm text-red-600 text-center">{result.error}</p>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-sans font-semibold bg-brand-700 hover:bg-brand-800 disabled:bg-brand-300 text-white py-4 rounded-2xl text-base transition-colors">
              {loading ? <><Loader size={18} className="animate-spin" /> Submitting...</> : 'Submit Paper for Review'}
            </button>
            <p className="font-sans text-xs text-center text-gray-400">
              By submitting, you confirm this is original unpublished work and you agree to our publication terms.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
