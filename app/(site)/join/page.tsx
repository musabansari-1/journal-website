'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Loader, Upload } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

export default function JoinPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', designation:'', institute:'', country:'India', expertise:'', experience:'', type:'reviewer' })
  const [cv, setCv] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}))

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k,v])=>fd.append(k,v))
    if (cv) fd.append('cv', cv)
    try {
      const res = await fetch(apiUrl('/api/join'), { method:'POST', body:fd })
      if (res.ok) setSuccess(true)
    } catch {}
    setLoading(false)
  }

  if (success) return (
    <><Navbar /><div className="min-h-screen flex items-center justify-center bg-brand-50 pt-16">
      <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl shadow-xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-green-600"/></div>
        <h2 className="font-display text-3xl font-bold text-brand-900 mb-3">Application Submitted!</h2>
        <p className="font-sans text-gray-600">Our editorial team will review your application and respond within 5 working days.</p>
      </div>
    </div><Footer /></>
  )

  return (
    <><Navbar /><main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Join as Editor / Reviewer</h1>
        <p className="font-body text-brand-200">Contribute to the advancement of research by joining our expert panel</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="font-sans text-sm font-medium text-gray-700 mb-2 block">Applying as *</label>
            <div className="flex gap-4">
              {['reviewer','editor'].map(t=>(
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value={t} checked={form.type===t} onChange={()=>set('type',t)} className="accent-brand-700"/>
                  <span className="font-sans text-sm font-medium text-gray-700 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[['name','Full Name','text'],['email','Email','email'],['phone','Phone','tel'],['designation','Designation','text'],['institute','Institution','text'],['country','Country','text']].map(([k,l,t])=>(
              <div key={k}><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">{l} *</label>
                <input required type={t} value={form[k as keyof typeof form]} onChange={e=>set(k,e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500"/></div>
            ))}
          </div>
          <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Area of Expertise *</label>
            <input required value={form.expertise} onChange={e=>set('expertise',e.target.value)} placeholder="e.g. Environmental Science, Machine Learning, Education Policy" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500"/></div>
          <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Experience & Publications</label>
            <textarea rows={3} value={form.experience} onChange={e=>set('experience',e.target.value)} placeholder="Brief description of your research experience and notable publications..." className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none"/></div>
          <div>
            <label className="font-sans text-sm font-medium text-gray-700 mb-2 block">Upload CV (optional)</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={e=>setCv(e.target.files?.[0]||null)} className="hidden"/>
            {cv ? (
              <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-200">
                <span className="font-sans text-sm text-brand-800 flex-1 truncate">{cv.name}</span>
                <button type="button" onClick={()=>setCv(null)} className="font-sans text-xs text-red-500">Remove</button>
              </div>
            ) : (
              <button type="button" onClick={()=>fileRef.current?.click()} className="flex items-center gap-2 font-sans text-sm font-medium bg-brand-50 text-brand-700 px-5 py-3 rounded-xl hover:bg-brand-100 transition-colors">
                <Upload size={16}/> Upload CV (.pdf, .doc, .docx)
              </button>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 font-sans font-semibold bg-brand-700 text-white py-4 rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-colors">
            {loading ? <><Loader size={16} className="animate-spin"/>Submitting...</> : 'Submit Application'}
          </button>
        </form>
      </div>
    </main><Footer /></>
  )
}
