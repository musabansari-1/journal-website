'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type Conference = { id:string; title:string; description:string; venue:string; date:string; lastDate?:string; registrationUrl?:string; coverUrl?:string }

export default function ConferencePage() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(apiUrl('/api/conferences')).then(r=>r.json()).then((d: unknown)=>{setConferences(d as Conference[]);setLoading(false)}).catch(()=>setLoading(false))
  }, [])
  return (
    <><Navbar /><main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Conferences & Seminars</h1>
        <p className="font-body text-brand-200">Upcoming academic events and research conferences</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {loading ? <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100"><div className="h-4 bg-gray-200 rounded w-3/4 mb-3"/><div className="h-3 bg-gray-100 rounded w-full"/></div>)}</div>
        : conferences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4"/>
            <h3 className="font-display text-xl text-gray-400 mb-2">No upcoming events</h3>
            <p className="font-sans text-sm text-gray-400">Check back soon for upcoming conferences and seminars</p>
          </div>
        ) : (
          <div className="space-y-6">
            {conferences.map(c=>(
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {c.coverUrl && <div className="h-48 overflow-hidden"><img src={c.coverUrl} alt={c.title} className="w-full h-full object-cover"/></div>}
                <div className="p-8">
                  <h3 className="font-display text-2xl font-bold text-brand-900 mb-4">{c.title}</h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-1.5 font-sans text-sm text-gray-600"><Calendar size={15} className="text-brand-600"/>{c.date}</span>
                    <span className="flex items-center gap-1.5 font-sans text-sm text-gray-600"><MapPin size={15} className="text-brand-600"/>{c.venue}</span>
                  </div>
                  <p className="font-body text-gray-700 leading-relaxed mb-4">{c.description}</p>
                  {c.lastDate && <p className="font-sans text-sm text-orange-600 font-medium mb-4">Last date for submission: {c.lastDate}</p>}
                  {c.registrationUrl && (
                    <a href={c.registrationUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-sm font-semibold bg-brand-700 text-white px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors">
                      Register Now <ExternalLink size={14}/>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main><Footer /></>
  )
}
