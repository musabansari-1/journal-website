'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Users, Mail, Globe, BookOpen } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type Member = {
  id: string; name: string; designation: string; institute: string
  country: string; expertise?: string; photoUrl?: string; email?: string
  type: string; displayOrder?: number; profileUrl?: string
}

const FALLBACK_MEMBERS: Member[] = []

export default function BoardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl('/api/members/advisory'))
      .then(r => r.json())
      .then((d: unknown) => { const data = d as Member[]; setMembers(data.length > 0 ? data : FALLBACK_MEMBERS); setLoading(false) })
      .catch(() => { setMembers(FALLBACK_MEMBERS); setLoading(false) })
  }, [])

  return (
    <><Navbar /><main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Advisory Board</h1>
        <p className="font-body text-brand-200">Distinguished scholars guiding our publication standards</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
          {[
            { key: 'all', label: 'All Members' },
            { key: 'chief', label: 'Editor-in-Chief' },
            { key: 'editorial', label: 'Editorial Board Member' },
            { key: 'advisory', label: 'Advisory Board' },
            { key: 'reviewer', label: 'Reviewer Committee' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                tab.key === 'advisory'
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-xl font-bold text-brand-900">Advisory Board</h2>
          <span className="font-sans text-xs font-semibold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">{members.length} Member{members.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-display text-xl text-gray-400 mb-2">No Committee Members Found for Advisory Board</p>
            <p className="font-sans text-sm text-gray-400">There are currently no active members listed under this specific role position.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">Advisory Board</span>
                    {m.expertise && <span className="font-sans text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{m.expertise}</span>}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-brand-200">
                      {m.photoUrl
                        ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                        : <span className="font-display font-bold text-brand-700 text-xl">{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-brand-900 text-base leading-tight">{m.name}</h3>
                      <p className="font-sans text-sm text-brand-600 font-medium">{m.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="font-sans text-sm text-gray-600 leading-snug">{m.institute}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400 shrink-0" />
                      <p className="font-sans text-xs text-gray-400">{m.country}</p>
                    </div>
                    {m.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400 shrink-0" />
                        <a href={`mailto:${m.email}`} className="font-sans text-xs text-brand-600 hover:text-brand-800 truncate transition-colors">{m.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main><Footer /></>
  )
}
