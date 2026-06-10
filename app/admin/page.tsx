'use client'
import { useState, useEffect } from 'react'
import { FileText, Users, MessageSquare, CheckCircle, Clock, CreditCard } from 'lucide-react'

export default function AdminDashboard() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/papers').then(r=>r.json() as Promise<any[]>).then((d: any[])=>{setPapers(d);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  const stats = [
    { label:'Total Submissions', value:papers.length, icon:FileText, color:'text-blue-600 bg-blue-50' },
    { label:'Under Review', value:papers.filter(p=>p.status==='under_review').length, icon:Clock, color:'text-yellow-600 bg-yellow-50' },
    { label:'Payment Pending', value:papers.filter(p=>p.status==='payment_pending').length, icon:CreditCard, color:'text-orange-600 bg-orange-50' },
    { label:'Published', value:papers.filter(p=>p.status==='published').length, icon:CheckCircle, color:'text-green-600 bg-green-50' },
  ]

  const STATUS_COLORS: Record<string,string> = { submitted:'bg-gray-100 text-gray-700', under_review:'bg-blue-100 text-blue-700', revision_required:'bg-yellow-100 text-yellow-700', accepted:'bg-green-100 text-green-700', payment_pending:'bg-orange-100 text-orange-700', payment_received:'bg-teal-100 text-teal-700', published:'bg-emerald-100 text-emerald-700', rejected:'bg-red-100 text-red-700' }
  const STATUS_LABELS: Record<string,string> = { submitted:'Submitted', under_review:'Under Review', revision_required:'Revision Required', accepted:'Accepted', payment_pending:'Payment Pending', payment_received:'Payment Received', published:'Published', rejected:'Rejected' }

  return (
    <div className="space-y-8">
      <div><h2 className="font-display text-2xl font-bold text-gray-900">Dashboard</h2><p className="font-sans text-sm text-gray-500 mt-1">Overview of journal submissions and activity</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18}/></div>
            <div className="font-display text-2xl font-bold text-gray-900">{loading ? '—' : s.value}</div>
            <div className="font-sans text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100"><h3 className="font-sans font-semibold text-gray-900">Recent Submissions</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Paper ID','Title','Author','Subject','Status','Date'].map(h=><th key={h} className="px-4 py-3 text-left font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">
              {papers.slice(0,10).map(p=>(
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-brand-700">{p.id}</td>
                  <td className="px-4 py-3 font-sans text-sm text-gray-900 max-w-xs"><div className="truncate">{p.title}</div></td>
                  <td className="px-4 py-3 font-sans text-sm text-gray-600">{p.authorName}</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500">{p.subject}</td>
                  <td className="px-4 py-3"><span className={`font-sans text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[p.status]||'bg-gray-100 text-gray-600'}`}>{STATUS_LABELS[p.status]||p.status}</span></td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!loading && papers.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center font-sans text-sm text-gray-400">No submissions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
