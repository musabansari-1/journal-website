'use client'
import { useState, useEffect } from 'react'
import { MessageSquare, ChevronDown, Check, Users } from 'lucide-react'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [joins, setJoins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'contacts'|'joins'>('contacts')
  const [expanded, setExpanded] = useState<string|null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([fetch('/api/admin/contacts').then(r=>r.json() as Promise<any[]>), fetch('/api/admin/join-requests').then(r=>r.json() as Promise<any[]>)])
      .then(([c,j]: [any[], any[]])=>{ setContacts(c); setJoins(j); setLoading(false) }).catch(()=>setLoading(false))
  }
  useEffect(()=>{ load() },[])

  const markRead = async (id:string) => {
    await fetch(`/api/admin/contacts/${id}`, { method:'PUT' })
    setContacts(prev=>prev.map((c:any)=>c.id===id?{...c,isRead:1}:c))
  }

  const updateJoinStatus = async (id:string, status:string) => {
    await fetch(`/api/admin/join-requests/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) })
    load()
  }

  const unreadContacts = contacts.filter((c:any)=>!c.isRead).length
  const pendingJoins = joins.filter((j:any)=>j.status==='pending').length

  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-2xl font-bold text-gray-900">Contacts & Applications</h2></div>
      <div className="flex gap-2">
        {[['contacts','Contact Inquiries',unreadContacts],['joins','Join Applications',pendingJoins]].map(([t,l,count])=>(
          <button key={t} onClick={()=>setTab(t as any)}
            className={`font-sans text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${tab===t?'bg-brand-700 text-white':'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
            {l} {(count as number)>0 && <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{count}</span>}
          </button>
        ))}
      </div>

      {tab === 'contacts' && (
        <div className="space-y-3">
          {loading ? <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"/></div>
          : contacts.length === 0 ? <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><MessageSquare size={40} className="text-gray-300 mx-auto mb-3"/><p className="font-sans text-gray-400">No contact inquiries</p></div>
          : contacts.map((c:any)=>(
            <div key={c.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${!c.isRead?'border-brand-200':'border-gray-100'}`}>
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50" onClick={()=>{ setExpanded(expanded===c.id?null:c.id); if(!c.isRead) markRead(c.id) }}>
                <div className="flex items-center gap-3">
                  {!c.isRead && <div className="w-2 h-2 bg-brand-600 rounded-full"/>}
                  <div><p className={`font-sans text-sm font-semibold ${c.isRead?'text-gray-700':'text-gray-900'}`}>{c.name}</p><p className="font-sans text-xs text-gray-400">{c.subject}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded===c.id?'rotate-180':''}`}/>
                </div>
              </div>
              {expanded===c.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                    <div><span className="text-gray-400">Email: </span><a href={`mailto:${c.email}`} className="text-brand-700">{c.email}</a></div>
                    {c.phone && <div><span className="text-gray-400">Phone: </span><span>{c.phone}</span></div>}
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100 font-body text-sm text-gray-700 leading-relaxed">{c.message}</div>
                  <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-xl hover:bg-brand-800 transition-colors">Reply →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'joins' && (
        <div className="space-y-3">
          {loading ? <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"/></div>
          : joins.length === 0 ? <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Users size={40} className="text-gray-300 mx-auto mb-3"/><p className="font-sans text-gray-400">No applications yet</p></div>
          : joins.map((j:any)=>(
            <div key={j.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-xs font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full capitalize">{j.type}</span>
                    <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${j.status==='approved'?'bg-green-100 text-green-700':j.status==='rejected'?'bg-red-100 text-red-600':'bg-yellow-100 text-yellow-700'}`}>{j.status}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900">{j.name}</h3>
                  <p className="font-sans text-sm text-gray-500">{j.designation} · {j.institute} · {j.country}</p>
                  <p className="font-sans text-sm text-gray-600 mt-1"><strong>Expertise:</strong> {j.expertise}</p>
                  {j.experience && <p className="font-sans text-sm text-gray-600"><strong>Experience:</strong> {j.experience}</p>}
                  <div className="flex gap-3 mt-1 font-sans text-sm">
                    <a href={`mailto:${j.email}`} className="text-brand-600 hover:underline">{j.email}</a>
                    <span className="text-gray-400">{j.phone}</span>
                  </div>
                  {j.cvUrl && <a href={j.cvUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-brand-600 hover:underline mt-1 inline-block">📄 View CV</a>}
                </div>
              </div>
              {j.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={()=>updateJoinStatus(j.id,'approved')} className="flex items-center gap-1.5 font-sans text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"><Check size={14}/> Approve</button>
                  <button onClick={()=>updateJoinStatus(j.id,'rejected')} className="font-sans text-sm font-semibold bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors border border-red-200">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
