'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader, Calendar, X } from 'lucide-react'

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', venue:'', date:'', lastDate:'', registrationUrl:'' })
  const [cover, setCover] = useState<File|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => { setLoading(true); fetch('/api/admin/conferences').then(r=>r.json()).then((d: unknown)=>{setConferences(d as any[]);setLoading(false)}).catch(()=>setLoading(false)) }
  useEffect(()=>{ load() },[])

  const save = async () => {
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k,v])=>fd.append(k,v))
    if (cover) fd.append('cover', cover)
    await fetch('/api/admin/conferences', { method:'POST', body:fd })
    setSaving(false); setShowForm(false); load()
  }

  const del = async (id:string) => {
    if (!confirm('Delete this conference?')) return
    await fetch(`/api/admin/conferences/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold text-gray-900">Conferences & Seminars</h2><p className="font-sans text-sm text-gray-500">{conferences.length} events</p></div>
        <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-5 py-2.5 rounded-xl hover:bg-brand-800"><Plus size={16}/> Add Event</button>
      </div>
      <div className="space-y-4">
        {loading ? <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Loader size={24} className="animate-spin text-brand-600 mx-auto"/></div>
        : conferences.length === 0 ? <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center"><Calendar size={40} className="text-gray-300 mx-auto mb-3"/><p className="font-sans text-gray-400">No events yet</p></div>
        : conferences.map(c=>(
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-1">{c.title}</h3>
              <p className="font-sans text-sm text-gray-500 mb-2">{c.venue} · {c.date}</p>
              <p className="font-body text-sm text-gray-600 line-clamp-2">{c.description}</p>
              {c.lastDate && <p className="font-sans text-xs text-orange-600 mt-2">Last date: {c.lastDate}</p>}
            </div>
            <button onClick={()=>del(c.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-display text-xl font-bold text-gray-900">Add Conference / Seminar</h3>
              <button onClick={()=>setShowForm(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              {[['title','Event Title'],['venue','Venue'],['date','Date'],['lastDate','Last Date for Submission'],['registrationUrl','Registration URL']].map(([k,l])=>(
                <div key={k}><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">{l}</label>
                  <input value={form[k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-500"/></div>
              ))}
              <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
                <textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none"/></div>
              <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Cover Image</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={e=>setCover(e.target.files?.[0]||null)} className="hidden"/>
                <button onClick={()=>fileRef.current?.click()} className="font-sans text-sm font-medium bg-brand-50 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-100">{cover?cover.name:'Upload Cover'}</button></div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={()=>setShowForm(false)} className="font-sans text-sm text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-100">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-6 py-2.5 rounded-xl hover:bg-brand-800 disabled:opacity-50">
                {saving?<><Loader size={14} className="animate-spin"/>Saving...</>:'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
