'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader, Users, X } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', designation:'', institute:'', country:'India', expertise:'', type:'editorial', displayOrder:'0' })
  const [photo, setPhoto] = useState<File|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => { setLoading(true); fetch(apiUrl('/api/admin/members')).then(r=>r.json()).then((d: unknown)=>{setMembers(d as any[]);setLoading(false)}).catch(()=>setLoading(false)) }
  useEffect(()=>{ load() },[])

  const save = async () => {
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k,v])=>fd.append(k,v))
    if (photo) fd.append('photo', photo)
    await fetch(apiUrl('/api/admin/members'), { method:'POST', body:fd })
    setSaving(false); setShowForm(false); load()
  }

  const del = async (id:string) => {
    if (!confirm('Delete this member?')) return
    await fetch(apiUrl(`/api/admin/members/${id}`), { method:'DELETE' })
    load()
  }

  const types = ['editorial','advisory','reviewer']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold text-gray-900">Board Members</h2><p className="font-sans text-sm text-gray-500">{members.length} members</p></div>
        <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors"><Plus size={16}/> Add Member</button>
      </div>

      {types.map(type=>{
        const group = members.filter(m=>m.type===type)
        return (
          <div key={type}>
            <h3 className="font-display text-lg font-semibold text-brand-900 mb-3 capitalize">{type} Board ({group.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.map(m=>(
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {m.photoUrl?<img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover"/>:<span className="font-display font-bold text-brand-700">{m.name[0]}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="font-sans text-xs text-gray-500">{m.designation}</p>
                    <p className="font-sans text-xs text-gray-400 truncate">{m.institute}</p>
                  </div>
                  <button onClick={()=>del(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={14}/></button>
                </div>
              ))}
              {group.length===0 && <div className="col-span-3 bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center"><p className="font-sans text-sm text-gray-400">No {type} members yet</p></div>}
            </div>
          </div>
        )
      })}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-display text-xl font-bold text-gray-900">Add Board Member</h3>
              <button onClick={()=>setShowForm(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Type</label>
                <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none bg-white">
                  <option value="editorial">Editorial Board</option>
                  <option value="advisory">Advisory Board</option>
                  <option value="reviewer">Reviewer Committee</option>
                </select></div>
              {[['name','Full Name'],['designation','Designation'],['institute','Institution'],['country','Country'],['expertise','Expertise'],['displayOrder','Display Order']].map(([k,l])=>(
                <div key={k}><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">{l}</label>
                  <input value={form[k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-500"/></div>
              ))}
              <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Photo</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]||null)} className="hidden"/>
                <button onClick={()=>fileRef.current?.click()} className="font-sans text-sm font-medium bg-brand-50 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-100">{photo?photo.name:'Upload Photo'}</button></div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={()=>setShowForm(false)} className="font-sans text-sm text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-100">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-6 py-2.5 rounded-xl hover:bg-brand-800 disabled:opacity-50">
                {saving?<><Loader size={14} className="animate-spin"/>Saving...</>:'Save Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
